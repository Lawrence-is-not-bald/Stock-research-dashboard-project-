"""Local dashboard server. Run: python3 scripts/serve.py [--port 8000]."""

import argparse
import json
import os
import secrets
import threading
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode, urlsplit

import download_aapl as data
from web_data import valid_api_key

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_FILES = {"/", "/index.html", "/app.js", "/data-source.js", "/style.css",
                "/Stock_Research_Dashboard_Presentation.pptx"}
PUBLIC_FILES.update("/" + path for path in [
    "data/prices.js", "data/fundamentals.js", "data/ai_explanations.js",
    "data/ai_actions.js", "data/daily_analysis.js", "data/source_metadata.js",
    "data/AAPL.json", "data/NVDA.json", "data/COST.json"])


class DashboardServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address, handler):
        super().__init__(address, handler)
        self.csrf_token = secrets.token_urlsafe(32)
        self.operation = threading.Lock()
        self.api_key = None  # Optional connections last only until this process exits.
        self.refreshing = False
        self.last_attempt = None
        self.refresh_error = None

    def status(self):
        return {"service": "stock-research-dashboard", "connected": bool(self.api_key),
                "csrfToken": self.csrf_token, "refreshing": self.refreshing,
                "lastAttempt": self.last_attempt, "refreshError": self.refresh_error}

    def refresh(self):
        try:
            data.refresh_data(self.api_key)
        except Exception:
            self.refresh_error = "Refresh could not finish. Saved data is still available; please retry."
        finally:
            self.refreshing = False
            self.operation.release()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

    def local_request(self):
        port = self.server.server_address[1]
        allowed = {f"127.0.0.1:{port}", f"localhost:{port}"}
        return (self.headers.get("Host") in allowed and
                self.headers.get("Sec-Fetch-Site") != "cross-site")

    def send_json(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if not self.local_request():
            self.send_error(403)
            return
        path = urlsplit(self.path).path
        if path == "/api/status":
            self.send_json(200, self.server.status())
        elif path in PUBLIC_FILES:
            super().do_GET()
        else:
            self.send_error(404)

    def do_HEAD(self):
        if not self.local_request() or urlsplit(self.path).path not in PUBLIC_FILES:
            self.send_error(404)
            return
        super().do_HEAD()

    def do_POST(self):
        origin = self.headers.get("Origin")
        if (not self.local_request() or origin != "http://" + self.headers.get("Host", "")
                or self.headers.get("Content-Type", "").split(";")[0] != "application/json"
                or not secrets.compare_digest(self.headers.get("X-Dashboard-Token", ""), self.server.csrf_token)):
            self.send_json(403, {"error": "Refresh the dashboard page and try again."})
            return
        path = urlsplit(self.path).path
        if path not in {"/api/connect", "/api/disconnect", "/api/refresh"}:
            self.send_json(404, {"error": "Unknown action."})
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if not 0 < size <= 4096:
                raise ValueError()
            payload = json.loads(self.rfile.read(size))
            if not isinstance(payload, dict):
                raise ValueError()
        except (ValueError, UnicodeError):
            self.send_json(400, {"error": "Invalid request."})
            return
        if not self.server.operation.acquire(blocking=False):
            self.send_json(409, {"error": "A data operation is already running. Please wait for it to finish."})
            return
        release = True
        try:
            if path == "/api/connect":
                key = valid_api_key(payload.get("apiKey"))
                if not key or len(key) > 256 or any(char.isspace() for char in key):
                    self.send_json(400, {"error": "Enter your own EODHD API key."})
                    return
                url = "https://eodhd.com/api/user?" + urlencode({"api_token": key, "fmt": "json"})
                try:
                    account = data.download_json(url)
                    if not isinstance(account, dict) or not account.get("name") or not account.get("email"):
                        self.send_json(401, {"error": "EODHD could not verify this key. Check the key and try again."})
                        return
                except HTTPError as error:
                    message = ("EODHD rejected this key. Check it and try again." if error.code in (401, 403)
                               else "EODHD is temporarily unavailable or its request limit was reached. Try again later.")
                    self.send_json(401 if error.code in (401, 403) else 503, {"error": message})
                    return
                except Exception:
                    self.send_json(503, {"error": "Could not reach EODHD. You can keep using web mode and try again later."})
                    return
                self.server.api_key = key
                # Never return account details or credentials to browser assets.
                self.send_json(200, self.server.status())
            elif path == "/api/disconnect":
                self.server.api_key = None
                self.send_json(200, self.server.status())
            else:
                self.server.refresh_error = None
                self.server.last_attempt = datetime.now(timezone.utc).isoformat()
                self.server.refreshing = True
                worker = threading.Thread(target=self.server.refresh, daemon=True)
                worker.start()
                release = False  # Worker releases the operation lock when finished.
                self.send_json(202, self.server.status())
        finally:
            if release:
                self.server.operation.release()

    def log_message(self, format, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    os.chdir(ROOT)
    server = DashboardServer(("127.0.0.1", args.port), Handler)
    print(f"Dashboard ready at http://127.0.0.1:{server.server_port}/", flush=True)
    print("Web mode needs no key. Connect EODHD in the dashboard if you want to use it.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
