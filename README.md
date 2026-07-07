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
- EODHD API for stock market data
- Browser `localStorage` for saving notes locally
- Canvas charts drawn with JavaScript

## Data Source

The stock data comes from EODHD.

The Python script downloads historical price data and financial data, then saves the results into the `data/` folder. The website reads those saved local files.

The public website does not need an API key to load if the data files are already saved.

## Project Structure

```text
stock-research-dashboard/
  index.html
  style.css
  app.js
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
  scripts/
    download_aapl.py
```

## Installation

Download or clone the project, then open Terminal in the project folder:

```bash
cd /Users/lawrenceli/Documents/Codex/2026-06-17/stock-research-dashboard-scripts-data/stock-research-dashboard
```

No extra JavaScript packages are required for the website.

Python is used only when refreshing the stock data.

## API Key Setup

Create a private `.env` file in the project folder:

```bash
nano .env
```

Add your own EODHD token:

```env
EODHD_API_KEY=your_real_eodhd_api_key_here
```

Save in nano:

1. Press `Control + O`
2. Press `Enter`
3. Press `Control + X`

Do not upload `.env` to GitHub or any public website.

The project includes `.env.example` as a safe template. The real `.env` file should stay private.

## How to Run

Online version:

```text
https://lawrence-is-not-bald.github.io/Stock-research-dashboard-project-/
```

Start a local web server from the project folder:

```bash
python3 -m http.server 8000
```

Then open this in your browser:

```text
http://127.0.0.1:8000/
```

To refresh the stock data, run:

```bash
python3 scripts/download_aapl.py
```

That updates the saved data files used by the dashboard.

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
- Stock data updates only when the Python refresh script is run.
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
- Add a backend for secure live API calls
- Add real ChatGPT API summaries using a private server-side key
- Add screenshots to the README
- Add portfolio comparison tools
- Add export-to-PDF reports
- Add more financial metrics such as EPS, free cash flow, and debt
- Improve mobile layout
- Add user-selected stock tickers
