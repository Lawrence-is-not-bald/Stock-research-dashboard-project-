"""Public web price data and shared validation; no API key required."""

import math
from datetime import datetime, timezone
from urllib.parse import urlencode
from zoneinfo import ZoneInfo


def valid_api_key(value):
    if not isinstance(value, str):
        return None
    value = value.strip().strip("\"'")
    if not value or value.lower() in {"demo", "your_api_key_here",
            "put_your_own_eodhd_api_key_here", "your_real_eodhd_api_key_here"}:
        return None
    return value


def normalize_prices(rows):
    """Reject error payloads and unusable rows before replacing a good cache."""
    if not isinstance(rows, list):
        raise ValueError("The source did not return price history.")
    clean = {}
    for row in rows:
        try:
            day = datetime.strptime(row["date"], "%Y-%m-%d").date().isoformat()
            values = {key: float(row[key]) for key in ("open", "high", "low", "close")}
            if not all(math.isfinite(value) and value > 0 for value in values.values()):
                continue
            volume = float(row["volume"])
            if not math.isfinite(volume) or volume < 0:
                continue
            result = {"date": day, **values, "volume": int(volume)}
            adjusted = row.get("adjusted_close")
            if adjusted is not None and math.isfinite(float(adjusted)) and float(adjusted) > 0:
                result["adjusted_close"] = float(adjusted)
            clean[day] = result
        except (KeyError, TypeError, ValueError, OverflowError):
            continue
    if len(clean) < 2:
        raise ValueError("The source did not return enough valid daily prices.")
    return [clean[day] for day in sorted(clean)]


def yahoo_url(ticker):
    # Explicit dates preserve daily history; range=max can return coarser bars.
    params = urlencode({"period1": 0, "period2": int(datetime.now(timezone.utc).timestamp()),
                        "interval": "1d"})
    return f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?{params}"


def parse_yahoo_prices(payload, now=None):
    now = now or datetime.now(timezone.utc)
    try:
        chart = payload["chart"]
        if chart.get("error"):
            raise ValueError("The public price source is unavailable.")
        result = chart["result"][0]
        meta = result["meta"]
        if meta.get("dataGranularity") != "1d" or meta.get("currency") != "USD":
            raise ValueError("Expected daily USD price data.")
        quote = result["indicators"]["quote"][0]
        exchange_zone = ZoneInfo(meta.get("exchangeTimezoneName", "America/New_York"))
        regular_end = meta.get("currentTradingPeriod", {}).get("regular", {}).get("end")
        rows = []
        for index, timestamp in enumerate(result["timestamp"]):
            day = datetime.fromtimestamp(timestamp, exchange_zone).date()
            today = now.astimezone(exchange_zone).date()
            if day > today:
                continue
            # Do not call a still-trading daily candle an end-of-day close.
            if day == today:
                if not regular_end or now.timestamp() < regular_end + 900:
                    continue
            rows.append({"date": day.isoformat(),
                         **{key: quote[key][index] for key in ("open", "high", "low", "close", "volume")}})
        return normalize_prices(rows)
    except (KeyError, IndexError, TypeError) as error:
        raise ValueError("The public price source returned an unexpected response.") from error
