"""
Download historical daily stock price data from EODHD.

Before running this script:
1. Open the .env file in the main project folder.
2. Replace your_api_key_here with your real EODHD API key.
3. Run this script from the main project folder:

   python3 scripts/download_aapl.py
"""

# json helps us save Python data as a .json file.
import json

# re helps us find values inside simple HTML table rows.
import re

# sys lets us stop the script early if something goes wrong.
import sys

# datetime lets us save when the dashboard data was refreshed.
from datetime import datetime, timezone

# urllib.parse helps us safely build a URL with query parameters.
from urllib.parse import urlencode

# urllib.request lets us download data from a web URL.
from urllib.request import urlopen


# These are the stock symbols we want to download.
SYMBOLS = [
    "AAPL.US",
    "NVDA.US",
    "COST.US",
]

# This is the local file that stores your private API key.
ENV_FILE = ".env"

# This file lets the website read chart data without a local web server.
EMBEDDED_PRICE_FILE = "data/prices.js"

# This file lets the website read revenue, net income, market cap, and P/E.
EMBEDDED_FUNDAMENTALS_FILE = "data/fundamentals.js"

# This file lets the website read the auto-generated explanation text.
EMBEDDED_AI_EXPLANATIONS_FILE = "data/ai_explanations.js"

# This file lets the website read the educational buy/sell check.
EMBEDDED_AI_ACTIONS_FILE = "data/ai_actions.js"

# This file lets the website read the latest end-of-day market analysis.
EMBEDDED_DAILY_ANALYSIS_FILE = "data/daily_analysis.js"

# This keeps slow websites from freezing the whole refresh script.
REQUEST_TIMEOUT_SECONDS = 20


def load_api_key():
    """Read the EODHD_API_KEY value from the local .env file."""

    # Open the .env file in read mode.
    # The "with" statement automatically closes the file when we are done.
    with open(ENV_FILE, "r", encoding="utf-8") as env_file:
        # Read the file one line at a time.
        for line in env_file:
            # Remove spaces and newlines from the start and end of the line.
            line = line.strip()

            # Skip blank lines.
            if not line:
                continue

            # Skip comment lines that start with #.
            if line.startswith("#"):
                continue

            # Look for the line that starts with EODHD_API_KEY=.
            if line.startswith("EODHD_API_KEY="):
                # Split the line into two parts:
                # "EODHD_API_KEY" and the actual key value.
                _, api_key = line.split("=", 1)

                # Remove any extra spaces around the key.
                api_key = api_key.strip()

                # Return the key to the rest of the script.
                return api_key

    # If we get here, the script did not find EODHD_API_KEY in .env.
    return None


def build_url(symbol, api_key):
    """Create the EODHD API URL with the API key and response format."""

    # This is the EODHD endpoint for historical end-of-day price data.
    base_url = f"https://eodhd.com/api/eod/{symbol}"

    # These are the query parameters EODHD expects.
    query_parameters = {
        "api_token": api_key,
        "fmt": "json",
    }

    # urlencode turns the dictionary above into:
    # api_token=YOUR_KEY&fmt=json
    query_string = urlencode(query_parameters)

    # Return the complete URL.
    return f"{base_url}?{query_string}"


def build_fundamentals_url(symbol, api_key):
    """Create the EODHD API URL for company fundamentals."""

    # This endpoint returns company financial and valuation data.
    base_url = f"https://eodhd.com/api/fundamentals/{symbol}"

    # These are the query parameters EODHD expects.
    query_parameters = {
        "api_token": api_key,
        "fmt": "json",
    }

    # Return the complete URL.
    return f"{base_url}?{urlencode(query_parameters)}"


def build_stockanalysis_url(symbol):
    """Create the StockAnalysis statistics page URL for a symbol."""

    # StockAnalysis URLs use lowercase tickers like aapl, nvda, and cost.
    ticker = get_ticker(symbol).lower()

    # This page includes valuation and financial summary metrics.
    return f"https://stockanalysis.com/stocks/{ticker}/statistics/"


def download_json(url):
    """Download JSON data from the API and turn it into Python data."""

    # Open the URL and wait for the server response.
    with urlopen(url, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        # Read the raw response bytes from the server.
        response_body = response.read()

    # Decode bytes into normal text.
    response_text = response_body.decode("utf-8")

    # Convert the JSON text into Python lists/dictionaries.
    return json.loads(response_text)


def load_cached_json(path):
    """Read a local JSON file if the internet is unavailable."""

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_embedded_javascript_object(path, variable_name):
    """Read a simple window.NAME = {...}; JavaScript data file as JSON."""

    with open(path, "r", encoding="utf-8") as file:
        text = file.read()

    text = text.removeprefix(f"window.{variable_name} = ")
    text = text.removesuffix(";\n")
    text = text.removesuffix(";")
    return json.loads(text)


def download_text(url):
    """Download normal text or HTML from a URL."""

    # Some sites require a browser-like User-Agent header.
    from urllib.request import Request

    # Build a request that looks like it came from a browser.
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})

    # Open the URL and read the response.
    with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        response_body = response.read()

    # Decode bytes into normal text.
    return response_body.decode("utf-8")


def get_output_file(symbol):
    """Turn a symbol like AAPL.US into a file path like data/AAPL.json."""

    # Split the symbol at the dot and keep the stock ticker part.
    # For example: "AAPL.US" becomes "AAPL".
    ticker = symbol.split(".")[0]

    # Return the path where this ticker's data should be saved.
    return f"data/{ticker}.json"


def save_json(data, output_file):
    """Save the downloaded data into the correct JSON file."""

    # Open the output file in write mode.
    with open(output_file, "w", encoding="utf-8") as output_file:
        # json.dump writes Python data as nicely formatted JSON.
        json.dump(data, output_file, indent=2)


def get_ticker(symbol):
    """Turn a symbol like AAPL.US into a ticker like AAPL."""

    # Split the symbol at the dot and keep the first part.
    return symbol.split(".")[0]


def rebuild_embedded_price_file():
    """Create data/prices.js from the latest local JSON files."""

    # This dictionary will hold all chart data for the website.
    all_price_data = {}

    # Read each local JSON file we just downloaded.
    for symbol in SYMBOLS:
        # Convert AAPL.US into AAPL.
        ticker = get_ticker(symbol)

        # Build the matching JSON file path.
        json_file = f"data/{ticker}.json"

        # Open and read that JSON file.
        with open(json_file, "r", encoding="utf-8") as price_file:
            all_price_data[ticker] = json.load(price_file)

    # Turn the Python dictionary into JavaScript code.
    javascript_text = "window.PRICE_DATA = "
    javascript_text += json.dumps(all_price_data, indent=2)
    javascript_text += ";\n"

    # Save the JavaScript file used by index.html.
    with open(EMBEDDED_PRICE_FILE, "w", encoding="utf-8") as embedded_file:
        embedded_file.write(javascript_text)


def get_latest_yearly_statement_value(fundamentals, value_name):
    """Read the newest yearly income statement value from EODHD fundamentals."""

    # Safely walk into Financials -> Income_Statement -> yearly.
    yearly = (
        fundamentals.get("Financials", {})
        .get("Income_Statement", {})
        .get("yearly", {})
    )

    # If the data is missing, return nothing.
    if not yearly:
        return None

    # EODHD stores yearly statements by date, so sorting puts newest last.
    latest_year = sorted(yearly.keys())[-1]

    # Return the requested value from the newest yearly statement.
    return yearly.get(latest_year, {}).get(value_name)


def summarize_fundamentals(fundamentals):
    """Keep only the fundamentals used by the website."""

    # EODHD puts market cap and P/E in the Highlights section.
    highlights = fundamentals.get("Highlights", {})

    # Build a small dictionary for the website.
    return {
        "revenue": parse_number(
            str(get_latest_yearly_statement_value(fundamentals, "totalRevenue"))
        ),
        "netIncome": parse_number(
            str(get_latest_yearly_statement_value(fundamentals, "netIncome"))
        ),
        "marketCap": parse_number(
            str(
                highlights.get("MarketCapitalization")
                or highlights.get("MarketCapitalizationMln")
            )
        ),
        "peRatio": parse_number(str(highlights.get("PERatio"))),
    }


def parse_number(text):
    """Turn text like '4,362,291,605,560' or '36.005' into a number."""

    # If there is no value, return nothing.
    if text is None:
        return None

    # Remove commas, dollar signs, and spaces.
    cleaned = text.replace(",", "").replace("$", "").strip()

    # Try to read the value as a decimal number.
    try:
        return float(cleaned)
    except ValueError:
        return None


def extract_metric_from_html(html, label):
    """Find a metric value in a StockAnalysis statistics table."""

    # This pattern finds a table row with the exact label, then reads the
    # numeric value from the next table cell's title attribute.
    label_pattern = (
        rf"(?:>{re.escape(label)}</a>|<span><!---->{re.escape(label)}<!----></span>)"
    )
    pattern = rf"<tr[^>]*>.*?{label_pattern}.*?<td[^>]*title=\"([^\"]+)\""

    # Search across line breaks too.
    match = re.search(pattern, html, re.DOTALL)

    # Return no value if the label was not found.
    if not match:
        return None

    # Convert the captured text into a number.
    return parse_number(match.group(1))


def summarize_stockanalysis_fundamentals(html):
    """Keep only the StockAnalysis values used by the website."""

    # Read the four values from the statistics page.
    return {
        "revenue": extract_metric_from_html(html, "Revenue"),
        "netIncome": extract_metric_from_html(html, "Net Income"),
        "marketCap": extract_metric_from_html(html, "Market Cap"),
        "peRatio": extract_metric_from_html(html, "PE Ratio"),
    }


def get_fundamentals_summary(symbol, api_key):
    """Try EODHD fundamentals first, then use StockAnalysis as a fallback."""

    # First try EODHD, because the rest of this project already uses EODHD.
    try:
        fundamentals_url = build_fundamentals_url(symbol, api_key)
        fundamentals = download_json(fundamentals_url)
        summary = summarize_fundamentals(fundamentals)

        # If EODHD returned useful values, use them.
        if any(value is not None for value in summary.values()):
            return summary

    except Exception as error:
        print(f"EODHD fundamentals unavailable for {symbol}: {error}")

    # If EODHD is blocked by the current plan, use a no-key webpage fallback.
    stockanalysis_url = build_stockanalysis_url(symbol)
    html = download_text(stockanalysis_url)
    return summarize_stockanalysis_fundamentals(html)


def rebuild_embedded_fundamentals_file(api_key):
    """Download fundamentals and create data/fundamentals.js."""

    # This dictionary will hold the small fundamentals summary for each ticker.
    all_fundamentals = {}

    # Keep old fundamentals available in case the internet is down.
    try:
        cached_fundamentals = load_embedded_javascript_object(
            EMBEDDED_FUNDAMENTALS_FILE,
            "FUNDAMENTALS_DATA",
        )
    except Exception:
        cached_fundamentals = {}

    # Download fundamentals for each symbol.
    for symbol in SYMBOLS:
        ticker = get_ticker(symbol)
        print(f"Downloading fundamentals for {symbol}...")
        try:
            all_fundamentals[ticker] = get_fundamentals_summary(symbol, api_key)
        except Exception as error:
            print(f"Could not download fundamentals for {symbol}; using cached values.")
            print(f"Error: {error}")
            all_fundamentals[ticker] = cached_fundamentals.get(
                ticker,
                {
                    "revenue": None,
                    "netIncome": None,
                    "marketCap": None,
                    "peRatio": None,
                },
            )

    # Turn the Python dictionary into JavaScript code.
    javascript_text = "window.FUNDAMENTALS_DATA = "
    javascript_text += json.dumps(all_fundamentals, indent=2)
    javascript_text += ";\n"

    # Save the JavaScript file used by index.html.
    with open(EMBEDDED_FUNDAMENTALS_FILE, "w", encoding="utf-8") as embedded_file:
        embedded_file.write(javascript_text)


def format_large_money(value):
    """Turn a large number into readable text like $4.36T or $451.44B."""

    if value is None:
        return "not available"

    number = float(value)

    if abs(number) >= 1_000_000_000_000:
        return f"${number / 1_000_000_000_000:.2f}T"

    if abs(number) >= 1_000_000_000:
        return f"${number / 1_000_000_000:.2f}B"

    if abs(number) >= 1_000_000:
        return f"${number / 1_000_000:.2f}M"

    return f"${number:.2f}"


def format_ratio(value):
    """Turn a ratio number into readable text."""

    if value is None:
        return "not available"

    return f"{float(value):.2f}"


def describe_price_change(start_price, end_price):
    """Explain whether the one-year price move was up or down."""

    change_percent = ((end_price - start_price) / start_price) * 100

    if change_percent > 5:
        direction = "rose"
    elif change_percent < -5:
        direction = "fell"
    else:
        direction = "stayed fairly close to where it started"

    return direction, change_percent


def get_latest_trading_year(prices):
    """Return roughly the latest year of daily market sessions."""

    trading_days_in_year = 252

    if len(prices) <= trading_days_in_year:
        return prices

    return prices[-trading_days_in_year:]


def build_ai_explanation(ticker, prices, fundamentals):
    """Create a short educational explanation from price and fundamentals data."""

    latest_year_prices = get_latest_trading_year(prices)
    start_price = latest_year_prices[0]["close"]
    end_price = latest_year_prices[-1]["close"]
    direction, change_percent = describe_price_change(start_price, end_price)

    revenue = format_large_money(fundamentals.get("revenue"))
    net_income = format_large_money(fundamentals.get("netIncome"))
    market_cap = format_large_money(fundamentals.get("marketCap"))
    pe_ratio = format_ratio(fundamentals.get("peRatio"))

    return (
        f"{ticker}'s one-year daily close price {direction}, moving "
        f"{change_percent:.1f}% from ${start_price:.2f} to ${end_price:.2f}. "
        f"The company currently shows revenue of {revenue}, net income of "
        f"{net_income}, a market cap of {market_cap}, and a P/E ratio of "
        f"{pe_ratio}. A useful research question is whether the company's "
        f"earnings growth and business quality justify that valuation. "
        f"This is an educational explanation, not a buy or sell recommendation."
    )


def rebuild_ai_explanations_file():
    """Create data/ai_explanations.js from the latest data files."""

    explanations = {}

    with open(EMBEDDED_FUNDAMENTALS_FILE, "r", encoding="utf-8") as fundamentals_file:
        fundamentals_text = fundamentals_file.read()

    fundamentals_json = fundamentals_text.removeprefix("window.FUNDAMENTALS_DATA = ")
    fundamentals_json = fundamentals_json.removesuffix(";\n")
    fundamentals_data = json.loads(fundamentals_json)

    for symbol in SYMBOLS:
        ticker = get_ticker(symbol)
        price_file = f"data/{ticker}.json"

        with open(price_file, "r", encoding="utf-8") as file:
            prices = json.load(file)

        explanations[ticker] = build_ai_explanation(
            ticker,
            prices,
            fundamentals_data.get(ticker, {}),
        )

    refreshed_at = datetime.now(timezone.utc).isoformat()

    javascript_text = f"window.DASHBOARD_REFRESHED_AT = {json.dumps(refreshed_at)};\n"
    javascript_text += "window.AI_EXPLANATIONS = "
    javascript_text += json.dumps(explanations, indent=2)
    javascript_text += ";\n"

    with open(EMBEDDED_AI_EXPLANATIONS_FILE, "w", encoding="utf-8") as embedded_file:
        embedded_file.write(javascript_text)


def build_ai_action(ticker, prices, fundamentals):
    """Create an educational buy/sell/hold signal from simple data rules."""

    latest_year_prices = get_latest_trading_year(prices)
    start_price = latest_year_prices[0]["close"]
    end_price = latest_year_prices[-1]["close"]
    change_percent = ((end_price - start_price) / start_price) * 100
    pe_ratio = parse_number(str(fundamentals.get("peRatio")))
    net_income = parse_number(str(fundamentals.get("netIncome")))

    if pe_ratio is None or net_income is None:
        return {
            "action": "Research first",
            "className": "action-neutral",
            "reason": "Some valuation or profit data is missing, so the dashboard cannot form a useful signal.",
        }

    if net_income <= 0:
        return {
            "action": "Sell / avoid signal",
            "className": "action-sell",
            "reason": "The company shows negative net income, so the risk needs extra research before buying.",
        }

    if change_percent > 20 and pe_ratio > 45:
        return {
            "action": "Hold / wait signal",
            "className": "action-hold",
            "reason": "The stock has already risen strongly and the P/E ratio is high, so the valuation may need caution.",
        }

    if change_percent > 0 and pe_ratio <= 35:
        return {
            "action": "Buy-watch signal",
            "className": "action-buy",
            "reason": "The stock has positive momentum and the P/E ratio is not extremely high compared with the others.",
        }

    if change_percent < -10 and pe_ratio > 40:
        return {
            "action": "Sell / avoid signal",
            "className": "action-sell",
            "reason": "The stock is down over the year while the valuation is still high, so risk may be elevated.",
        }

    return {
        "action": "Hold / research more",
        "className": "action-hold",
        "reason": "The data is mixed, so compare growth, valuation, and business quality before making a decision.",
    }


def rebuild_ai_actions_file():
    """Create data/ai_actions.js from the latest data files."""

    actions = {}

    with open(EMBEDDED_FUNDAMENTALS_FILE, "r", encoding="utf-8") as fundamentals_file:
        fundamentals_text = fundamentals_file.read()

    fundamentals_json = fundamentals_text.removeprefix("window.FUNDAMENTALS_DATA = ")
    fundamentals_json = fundamentals_json.removesuffix(";\n")
    fundamentals_data = json.loads(fundamentals_json)

    for symbol in SYMBOLS:
        ticker = get_ticker(symbol)
        price_file = f"data/{ticker}.json"

        with open(price_file, "r", encoding="utf-8") as file:
            prices = json.load(file)

        actions[ticker] = build_ai_action(
            ticker,
            prices,
            fundamentals_data.get(ticker, {}),
        )

    javascript_text = "window.AI_ACTIONS = "
    javascript_text += json.dumps(actions, indent=2)
    javascript_text += ";\n"

    with open(EMBEDDED_AI_ACTIONS_FILE, "w", encoding="utf-8") as embedded_file:
        embedded_file.write(javascript_text)


def describe_day_change(change_percent):
    """Turn a daily percent move into simple words."""

    if change_percent > 1.5:
        return "moved sharply higher"

    if change_percent > 0.25:
        return "moved higher"

    if change_percent < -1.5:
        return "moved sharply lower"

    if change_percent < -0.25:
        return "moved lower"

    return "finished close to the previous day"


def describe_close_location(latest_day):
    """Explain where the close landed inside the day's high-low range."""

    high = latest_day.get("high")
    low = latest_day.get("low")
    close = latest_day.get("close")

    if high is None or low is None or close is None or high == low:
        return "The high-low range was not available for this day."

    close_position = (close - low) / (high - low)

    if close_position >= 0.75:
        return "The close was near the top of the day's range, which can show buyers stayed active into the close."

    if close_position <= 0.25:
        return "The close was near the bottom of the day's range, which can show sellers had more control near the close."

    return "The close ended near the middle of the day's range, which suggests a more balanced finish."


def build_daily_analysis(ticker, prices, fundamentals):
    """Create an end-of-day explanation from the latest two price rows."""

    if len(prices) < 2:
        return {
            "date": None,
            "className": "daily-flat",
            "headline": "End-of-day analysis unavailable",
            "explanation": "The dashboard needs at least two daily price rows to compare the latest close with the previous close.",
        }

    previous_day = prices[-2]
    latest_day = prices[-1]
    previous_close = previous_day["close"]
    latest_close = latest_day["close"]
    change = latest_close - previous_close
    change_percent = (change / previous_close) * 100

    if change_percent > 0:
        class_name = "daily-up"
        direction_word = "up"
    elif change_percent < 0:
        class_name = "daily-down"
        direction_word = "down"
    else:
        class_name = "daily-flat"
        direction_word = "flat"

    revenue = format_large_money(fundamentals.get("revenue"))
    net_income = format_large_money(fundamentals.get("netIncome"))
    pe_ratio = format_ratio(fundamentals.get("peRatio"))
    day_description = describe_day_change(change_percent)
    close_location = describe_close_location(latest_day)

    explanation = (
        f"On {latest_day['date']}, {ticker} {day_description}, closing at "
        f"${latest_close:.2f}. That was {direction_word} {abs(change_percent):.2f}% "
        f"from the previous close of ${previous_close:.2f}. "
        f"{close_location} Volume was {int(latest_day.get('volume', 0)):,} shares. "
        f"For context, the dashboard shows revenue of {revenue}, net income of "
        f"{net_income}, and a P/E ratio of {pe_ratio}. This is an end-of-day "
        f"educational summary, not personal financial advice."
    )

    return {
        "date": latest_day["date"],
        "className": class_name,
        "headline": f"{ticker} ended {direction_word} {abs(change_percent):.2f}%",
        "close": latest_close,
        "previousClose": previous_close,
        "change": change,
        "percentChange": change_percent,
        "volume": latest_day.get("volume"),
        "explanation": explanation,
    }


def rebuild_daily_analysis_file():
    """Create data/daily_analysis.js from the latest local price files."""

    daily_analysis = {}

    fundamentals_data = load_embedded_javascript_object(
        EMBEDDED_FUNDAMENTALS_FILE,
        "FUNDAMENTALS_DATA",
    )

    for symbol in SYMBOLS:
        ticker = get_ticker(symbol)
        price_file = f"data/{ticker}.json"

        with open(price_file, "r", encoding="utf-8") as file:
            prices = json.load(file)

        daily_analysis[ticker] = build_daily_analysis(
            ticker,
            prices,
            fundamentals_data.get(ticker, {}),
        )

    javascript_text = "window.DAILY_ANALYSIS = "
    javascript_text += json.dumps(daily_analysis, indent=2)
    javascript_text += ";\n"

    with open(EMBEDDED_DAILY_ANALYSIS_FILE, "w", encoding="utf-8") as embedded_file:
        embedded_file.write(javascript_text)


def main():
    """Run the full download process."""

    # Load the API key from .env.
    api_key = load_api_key()

    # Make sure the API key exists and is not still the placeholder value.
    if not api_key or api_key == "your_api_key_here":
        print("Please add your real EODHD API key to the .env file first.")
        print("Example: EODHD_API_KEY=abc123_your_real_key")
        sys.exit(1)

    # Download each symbol one at a time.
    for symbol in SYMBOLS:
        # Build the API URL for this symbol.
        url = build_url(symbol, api_key)

        # Decide where this symbol's JSON file should be saved.
        output_file = get_output_file(symbol)

        # Let the user know what is happening.
        print(f"Downloading historical daily prices for {symbol}...")

        try:
            # Download and parse the JSON data.
            data = download_json(url)

            # Save the JSON data to the matching file in data/.
            save_json(data, output_file)

        except Exception as error:
            # If anything goes wrong, keep the last saved data instead.
            print(f"Could not download {symbol}; using cached {output_file}.")
            print(f"Error: {error}")
            data = load_cached_json(output_file)

        # Let the user know this symbol finished successfully.
        print(f"Saved data to {output_file}")

    # Rebuild data/prices.js so the website charts use the latest data.
    rebuild_embedded_price_file()
    print(f"Updated chart data in {EMBEDDED_PRICE_FILE}")

    # Rebuild data/fundamentals.js so the website metrics use the latest data.
    rebuild_embedded_fundamentals_file(api_key)
    print(f"Updated fundamentals data in {EMBEDDED_FUNDAMENTALS_FILE}")

    # Rebuild AI explanation text from the latest prices and fundamentals.
    rebuild_ai_explanations_file()
    print(f"Updated AI explanations in {EMBEDDED_AI_EXPLANATIONS_FILE}")

    # Rebuild the educational buy/sell check from the latest available data.
    rebuild_ai_actions_file()
    print(f"Updated AI buy/sell checks in {EMBEDDED_AI_ACTIONS_FILE}")

    # Rebuild the end-of-day analysis from the latest two daily price rows.
    rebuild_daily_analysis_file()
    print(f"Updated end-of-day analysis in {EMBEDDED_DAILY_ANALYSIS_FILE}")


# This means "run main() only when this file is executed directly."
# It prevents main() from running if another script imports this file later.
if __name__ == "__main__":
    main()
