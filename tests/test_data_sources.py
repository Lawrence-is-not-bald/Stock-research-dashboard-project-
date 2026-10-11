import contextlib
import http.client
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from datetime import datetime, timezone
from unittest.mock import patch
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import download_aapl as data
import serve
from web_data import normalize_prices, parse_yahoo_prices, valid_api_key


ROWS = [
    {"date": "2026-10-08", "open": 100, "high": 103, "low": 99, "close": 102, "volume": 1000},
    {"date": "2026-10-09", "open": 102, "high": 105, "low": 101, "close": 104, "volume": 1200},
]
METRICS = {"revenue": 1000000, "netIncome": 100000, "marketCap": 2000000, "peRatio": 20}


def yahoo_fixture():
    dates = [datetime(2026, 10, day, 13, 30, tzinfo=timezone.utc).timestamp() for day in (8, 9, 12)]
    return {"chart": {"error": None, "result": [{
        "meta": {"dataGranularity": "1d", "currency": "USD", "exchangeTimezoneName": "America/New_York",
                 "currentTradingPeriod": {"regular": {"end": datetime(2026, 10, 12, 20, tzinfo=timezone.utc).timestamp()}}},
        "timestamp": dates,
        "indicators": {"quote": [{"open": [100, 102, 104], "high": [103, 105, 107],
            "low": [99, 101, 103], "close": [102, 104, 106], "volume": [1000, 1200, 1500]}]},
    }]}}


class ParserTests(unittest.TestCase):
    def test_placeholder_keys_are_optional(self):
        for key in (None, "", "your_api_key_here", "put_your_own_eodhd_api_key_here",
                    "your_real_eodhd_api_key_here", "demo"):
            self.assertIsNone(valid_api_key(key))
        self.assertEqual(valid_api_key(' "actual-secret" '), "actual-secret")

    def test_prices_sort_deduplicate_and_reject_invalid_payloads(self):
        self.assertEqual(normalize_prices([ROWS[1], ROWS[0], ROWS[1]]), ROWS)
        for payload in ({"error": "invalid key"}, [], [{**row, "close": float("nan")} for row in ROWS]):
            with self.assertRaises(ValueError):
                normalize_prices(payload)

    def test_yahoo_excludes_incomplete_session(self):
        payload = yahoo_fixture()
        self.assertEqual(parse_yahoo_prices(payload, datetime(2026, 10, 12, 18, tzinfo=timezone.utc)), ROWS)
        self.assertEqual(len(parse_yahoo_prices(payload, datetime(2026, 10, 12, 21, tzinfo=timezone.utc))), 3)
        payload["chart"]["result"][0]["meta"]["dataGranularity"] = "1mo"
        with self.assertRaises(ValueError):
            parse_yahoo_prices(payload)

    def test_metrics_do_not_cross_table_rows(self):
        html = '''<table><tr><td>Other value</td><td title="999">999</td></tr>
            <tr><td><a>Revenue</a></td><td title="1,234,000">1.23M</td></tr>
            <tr><td>Net Income</td><td>3.2B</td></tr>
            <tr><td>PE Ratio</td><td>n/a</td></tr></table>'''
        result = data.summarize_stockanalysis_fundamentals(html)
        self.assertEqual(result["revenue"], 1234000)
        self.assertEqual(result["netIncome"], 3200000000)
        self.assertIsNone(result["marketCap"])
        self.assertIsNone(result["peRatio"])

    def test_web_mode_never_calls_eodhd(self):
        with patch.object(data, "download_json", return_value=yahoo_fixture()) as download:
            rows, source = data.get_prices("AAPL.US")
        self.assertEqual(source["source"], "Yahoo Finance")
        self.assertIn("finance.yahoo.com", download.call_args.args[0])
        self.assertGreaterEqual(len(rows), 2)

    def test_invalid_eodhd_response_falls_back_without_logging_key(self):
        output = io.StringIO()
        with patch.object(data, "download_json", side_effect=[{"error": "invalid"}, yahoo_fixture()]), contextlib.redirect_stdout(output):
            _, source = data.get_prices("AAPL.US", "very-private-key")
        self.assertEqual(source["source"], "Yahoo Finance")
        self.assertNotIn("very-private-key", output.getvalue())

    def test_eodhd_success_keeps_provider(self):
        with patch.object(data, "download_json", return_value=ROWS):
            rows, source = data.get_prices("AAPL.US", "private-key")
        self.assertEqual(rows, ROWS)
        self.assertEqual(source["source"], "EODHD")
        self.assertNotIn("private-key", json.dumps(source))

    def test_missing_eodhd_metrics_are_not_fabricated(self):
        self.assertTrue(all(value is None for value in data.summarize_fundamentals({}).values()))
        self.assertEqual(data.summarize_fundamentals({"Highlights": {"MarketCapitalizationMln": 42}})["marketCap"], 42000000)


class RefreshTests(unittest.TestCase):
    def setUp(self):
        self.original_cwd = Path.cwd()
        self.directory = tempfile.TemporaryDirectory()
        os.chdir(self.directory.name)
        Path("data").mkdir()
        for ticker in ("AAPL", "NVDA", "COST"):
            data.save_json(ROWS, f"data/{ticker}.json")
        data.write_javascript(data.EMBEDDED_FUNDAMENTALS_FILE, "FUNDAMENTALS_DATA",
                              {ticker: METRICS for ticker in ("AAPL", "NVDA", "COST")})
        previous = {ticker: {"prices": {"source": "Yahoo Finance", "fetchedAt": "2026-10-09T23:00:00Z"},
                            "fundamentals": {"source": "StockAnalysis", "fetchedAt": "2026-10-08T23:00:00Z"}}
                    for ticker in ("AAPL", "NVDA", "COST")}
        data.write_javascript(data.METADATA_FILE, "DATA_SOURCE_METADATA", {"tickers": previous})

    def tearDown(self):
        os.chdir(self.original_cwd)
        self.directory.cleanup()

    def test_offline_refresh_preserves_cache_and_success_dates(self):
        with patch.object(data, "download_json", side_effect=OSError("offline")), \
             patch.object(data, "download_text", side_effect=OSError("offline")), contextlib.redirect_stdout(io.StringIO()):
            metadata = data.refresh_data()
        self.assertEqual(metadata["mode"], "web")
        for ticker, sources in metadata["tickers"].items():
            self.assertEqual(sources["prices"]["status"], "cached")
            self.assertEqual(sources["prices"]["fetchedAt"], "2026-10-09T23:00:00Z")
            self.assertEqual(sources["fundamentals"]["status"], "cached")
            self.assertEqual(sources["fundamentals"]["fetchedAt"], "2026-10-08T23:00:00Z")
            self.assertEqual(data.load_cached_json(f"data/{ticker}.json"), ROWS)
        self.assertTrue(Path("data/daily_analysis.js").exists())
        self.assertTrue(Path("data/prices.js").exists())

    def test_empty_webpage_does_not_erase_cached_metrics(self):
        with patch.object(data, "download_text", return_value="<html>Access denied</html>"):
            metadata = {}
            with contextlib.redirect_stdout(io.StringIO()):
                data.rebuild_embedded_fundamentals_file(metadata=metadata)
        saved = data.load_embedded_javascript_object(data.EMBEDDED_FUNDAMENTALS_FILE, "FUNDAMENTALS_DATA")
        self.assertEqual(saved["AAPL"], METRICS)
        self.assertEqual(metadata["AAPL"]["fundamentals"]["status"], "cached")

    def test_successful_no_key_refresh_writes_sourced_snapshot(self):
        with patch.object(data, "get_prices", return_value=(ROWS, data.source_record("Yahoo Finance", "https://finance.yahoo.com/", latestDate=ROWS[-1]["date"]))), \
             patch.object(data, "get_fundamentals_summary", return_value=(METRICS, data.source_record("StockAnalysis", "https://stockanalysis.com/"))), \
             contextlib.redirect_stdout(io.StringIO()):
            metadata = data.refresh_data()
        self.assertEqual(metadata["tickers"]["AAPL"]["prices"]["status"], "updated")
        self.assertEqual(metadata["tickers"]["AAPL"]["fundamentals"]["source"], "StockAnalysis")
        self.assertFalse(Path("data/local_token_status.js").exists())

    def test_missing_cache_fails_without_overwriting_other_tickers(self):
        Path("data/COST.json").unlink()
        original = Path("data/AAPL.json").read_bytes()
        with patch.object(data, "get_prices", side_effect=OSError("offline")), contextlib.redirect_stdout(io.StringIO()):
            with self.assertRaisesRegex(ValueError, "No usable prices for COST"):
                data.refresh_data()
        self.assertEqual(Path("data/AAPL.json").read_bytes(), original)


class ServerTests(unittest.TestCase):
    def setUp(self):
        self.server = serve.DashboardServer(("127.0.0.1", 0), serve.Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.host = f"127.0.0.1:{self.server.server_port}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def request(self, path, method="GET", body=None, headers=None):
        client = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=3)
        defaults = {"Host": self.host}
        if method == "POST":
            defaults.update({"Origin": "http://" + self.host, "Content-Type": "application/json",
                             "X-Dashboard-Token": self.server.csrf_token})
        defaults.update(headers or {})
        client.request(method, path, body=json.dumps(body) if body is not None else None, headers=defaults)
        response = client.getresponse()
        status, result = response.status, response.read().decode()
        client.close()
        return status, result

    def test_no_key_required_and_private_files_not_served(self):
        self.assertEqual(self.request("/")[0], 200)
        status, body = self.request("/api/status")
        self.assertEqual(status, 200)
        self.assertFalse(json.loads(body)["connected"])
        for path in ("/.env", "/.git/config", "/scripts/serve.py", "/data/../.env", "/data/%2e%2e/.env"):
            self.assertEqual(self.request(path)[0], 404)

    def test_cross_origin_or_invalid_host_cannot_mutate(self):
        for headers in ({"Origin": "https://untrusted.example"}, {"X-Dashboard-Token": "bad"}, {"Host": "untrusted.example"}):
            self.assertEqual(self.request("/api/refresh", "POST", {}, headers)[0], 403)

    def test_verified_connection_disconnect_and_secret_not_in_status(self):
        with patch.object(data, "download_json", return_value={"name": "Test", "email": "test@example.com"}):
            status, body = self.request("/api/connect", "POST", {"apiKey": "private-test-key"})
        self.assertEqual(status, 200)
        self.assertTrue(json.loads(body)["connected"])
        self.assertNotIn("private-test-key", body)
        self.assertNotIn("test@example.com", body)
        self.assertNotIn("private-test-key", self.request("/api/status")[1])
        self.assertEqual(self.request("/api/disconnect", "POST", {})[0], 200)
        self.assertIsNone(self.server.api_key)

    def test_rejected_key_does_not_connect_or_leak(self):
        error = HTTPError("https://eodhd.com/?api_token=secret", 401, "Unauthorized", {}, None)
        with patch.object(data, "download_json", side_effect=error):
            status, body = self.request("/api/connect", "POST", {"apiKey": "secret"})
        self.assertEqual(status, 401)
        self.assertNotIn("secret", body)
        self.assertIsNone(self.server.api_key)

    def test_refresh_without_key_and_concurrent_request_rejected(self):
        started = threading.Event()
        finish = threading.Event()

        def refresh(key):
            self.assertIsNone(key)
            started.set()
            finish.wait(2)

        with patch.object(data, "refresh_data", side_effect=refresh):
            self.assertEqual(self.request("/api/refresh", "POST", {})[0], 202)
            self.assertTrue(started.wait(1))
            self.assertEqual(self.request("/api/disconnect", "POST", {})[0], 409)
            finish.set()
            self.assertTrue(self.server.operation.acquire(timeout=2))
            self.server.operation.release()
        self.assertFalse(json.loads(self.request("/api/status")[1])["refreshing"])


if __name__ == "__main__":
    unittest.main()
