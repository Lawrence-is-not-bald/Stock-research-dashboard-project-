# Stock Research Dashboard

## Project Overview

This is a beginner-friendly stock research dashboard for comparing Apple (`AAPL`), Nvidia (`NVDA`), and Costco Wholesale (`COST`).

The website reads local stock data files, displays company cards, draws price charts, shows financial metrics, and gives educational ChatGPT-style summaries based on the saved data.

## Why I Built This

I built this project to practice combining finance, coding, data, and web design in one dashboard.

The goal is to make stock research easier to understand by showing prices, charts, company metrics, explanations, and personal notes in one place.

## Features

- Company cards for Apple, Nvidia, and Costco
- Latest close price for each stock
- Revenue, net income, market cap, and P/E ratio boxes
- Chart ranges: `1D`, `5D`, `1W`, `1M`, `6M`, `1Y`, `5Y`, and `Max`
- Smooth up/down arrow animation that follows the chart line
- Quick AI-style summary beside the longer AI explanation
- Educational AI-style buy/sell research signal
- User ideas box for writing personal research thoughts
- "Verify with ChatGPT" style popup that lists pros and cons
- End-of-day market review section
- Slideshow review mode
- Multi-language interface
- Optional emoji hints
- Optional fun-mode popups
- Local browser saving for user ideas and questions

## Financial Concepts Covered

- Daily close price
- Open, high, low, and close prices
- Volume
- Revenue
- Net income
- Market capitalization
- P/E ratio
- Daily price change
- Long-term price trend
- Risk vs. reward
- Basic valuation thinking
- Beginner-friendly buy, hold, and sell research signals

## Tech Stack

- HTML
- CSS
- JavaScript
- Python
- Local JSON data files
- Public web data, with optional EODHD API access
- Browser `localStorage` for saving notes locally
- Canvas charts drawn with JavaScript

## Data Sources and Optional EODHD Connection

**No API key is required.** The dashboard opens immediately with its saved data.
It highly recommends an EODHD API key and offers an optional **Connect EODHD** form.
This verifies a provider key; it does not create a dashboard user account.

- **Web mode:** downloads daily USD price history from Yahoo Finance’s public chart
  endpoint and tries to extract company metrics from StockAnalysis’s public statistics pages.
- **EODHD mode:** prefers EODHD prices and fundamentals, with web fallback when a
  request fails or the account plan lacks access. A connection does not guarantee
  access to every dataset.
- Every ticker shows its source, latest trading date, fetch date, and whether data
  is fetched, partial, cached, or unavailable. Unknown provenance in old snapshots
  is labeled explicitly. Failed refreshes preserve saved prices and metrics;
  missing metrics are never invented. Revenue and net income may be annual (EODHD)
  or trailing twelve months (StockAnalysis), as indicated in source details.
- Public sources can change, reject automated requests, or impose limits. Data
  can be delayed. A current trading session is excluded until after market close.
- The existing educational summaries are generated locally from these datasets;
  this feature does not add a live language model or unrestricted web browsing.

## Project Structure

```text
stock-research-dashboard/
  index.html
  style.css
  app.js
  data-source.js
  README.md
  .env.example
  .gitignore
  data/
    AAPL.json
    NVDA.json
    COST.json
    prices.js
    fundamentals.js
    ai_explanations.js
    ai_actions.js
    daily_analysis.js
    source_metadata.js
  scripts/
    download_aapl.py
    web_data.py
    serve.py
```

## Installation

Download or clone the project, then open Terminal in the project folder:

```bash
cd /Users/lawrenceli/Documents/Codex/2026-06-17/stock-research-dashboard-scripts-data/stock-research-dashboard
```

No extra JavaScript packages are required for the website.

Use Python 3.9 or newer for the local data service and refresh script. No additional Python packages are required.

## How to Run — No Key Needed

Start the local data service from the project folder:

```bash
python3 scripts/serve.py
```

Open [the local dashboard](http://127.0.0.1:8000/). Use `--port 8001` if port 8000
is occupied. The dashboard loads saved data immediately and automatically checks
web sources when the latest refresh attempt is more than four hours old. Click
**Refresh from the web** to check again. The service binds only to your computer.

To update files without running the service:

```bash
python3 scripts/download_aapl.py --web
```

`--web` explicitly skips EODHD even if `.env` or the environment contains a key.

## Optional EODHD Setup

With the local service running, expand **Connect EODHD (optional)**, paste your
key, and connect. The server validates it against EODHD’s User API before enabling
EODHD mode and refreshing data. The key stays in server memory until disconnect
or server shutdown. It is never saved in browser storage, public data files, or
logs. **Disconnect and use web mode** clears the key and refreshes public data.
The server starts in web mode; an existing `.env` key is only used by the CLI.

For command-line refreshes, optionally create a private `.env` in the project
folder using `.env.example`, then run:

```bash
python3 scripts/download_aapl.py
```

Without a usable key this command also uses web mode. Never upload `.env` or API
keys. The local service serves only allowlisted dashboard assets, so it does not
expose `.env`, Git files, or unrelated documents.

## Static / GitHub Pages Copies

[Open the published dashboard](https://lawrence-is-not-bald.github.io/Stock-research-dashboard-project-/).

A static copy (including opening `index.html` directly) displays the saved snapshot
without a key. Live website collection and key verification require the Python
service; GitHub Pages cannot run that backend. The interface explains how to start
it and disables connection/refresh actions until it is available. To update a
hosted static copy, run the refresh script and publish the generated `data/` files.
Do not use `python3 -m http.server` for key connection or live refresh.

## How to Use the Dashboard

1. Open the website in your browser.
2. Look at the company cards for AAPL, NVDA, and COST.
3. Use the chart range buttons to switch between short-term and long-term price history.
4. Read the quick summary for a fast explanation.
5. Read the longer AI-style explanation for more detail.
6. Write your own thoughts in the User ideas box.
7. Click "Verify with ChatGPT" to get a pros and cons review.
8. Scroll to the end-of-day review to compare the latest close with the previous close.

## Screenshots

Add screenshots of the dashboard here.

Example:

```text
screenshots/dashboard-home.png
screenshots/company-card.png
screenshots/end-of-day-review.png
```

## Known Limitations

- The ChatGPT-style summaries are generated locally from saved dashboard data.
- The website does not call the live ChatGPT API.
- Fresh web data requires the local service or Python refresh script. Static copies show saved data.
- The dashboard depends on the saved local data files in `data/`.
- Financial data may be delayed depending on the API source.
- This project currently focuses on only three companies.
- It is a learning project, not a professional trading platform.

## Not Investment Advice

This project is for education only.

The AI-style explanations, buy/sell checks, and pros/cons reviews are not personal financial advice. Do your own research before making any investment decision.

## What I Learned

Through this project, I learned how to:

- Use a stock market API
- Store private API keys in a `.env` file
- Read JSON data with Python and JavaScript
- Build a dashboard with HTML, CSS, and JavaScript
- Draw charts using canvas
- Compare stocks with financial metrics
- Think about valuation using revenue, net income, market cap, and P/E ratio
- Keep private data out of GitHub

## Future Improvements

- Add more companies
- Add real daily news for each company
- Add real ChatGPT API summaries using a private server-side key
- Add screenshots to the README
- Add portfolio comparison tools
- Add export-to-PDF reports
- Add more financial metrics such as EPS, free cash flow, and debt
- Improve mobile layout
- Add user-selected stock tickers

## Verification

Run the parser, fallback, refresh, connection, and local-server security tests:

```bash
python3 -m unittest discover -s tests -v
```

The tests use isolated temporary snapshots and mocked provider responses, so they
do not need a key or alter saved project data.
