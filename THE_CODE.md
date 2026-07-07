# The Code

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stock Research Dashboard</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header class="site-header">
      <div>
        <p class="eyebrow" data-i18n="Local JSON stock project">Local JSON stock project</p>
        <h1 data-i18n="Stock Research Dashboard">Stock Research Dashboard</h1>
        <p class="description" data-i18n="A beginner-friendly webpage that reads local EODHD price files for Apple, Nvidia, and Costco, then turns daily close prices into research cards, charts, metric boxes, and personal notes.">
          A beginner-friendly webpage that reads local EODHD price files for Apple,
          Nvidia, and Costco, then turns daily close prices into research cards,
          charts, metric boxes, and personal notes.
        </p>
        <div class="language-picker">
          <label for="languageSelect" data-i18n="Language">Language</label>
          <select id="languageSelect">
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="la">Latina</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        <div class="hero-actions">
          <a href="#cardsTitle" data-i18n="Explore stocks">Explore stocks</a>
          <a href="#dailyReview" data-i18n="End-of-day review">End-of-day review</a>
          <button id="startIdeaCoach" type="button" data-i18n="Open idea coach">Open idea coach</button>
          <button id="funModeSettings" type="button" data-i18n="Fun mode">Fun mode</button>
          <button id="emojiModeToggle" type="button" data-i18n="Emoji hints">Emoji hints</button>
        </div>
      </div>
    </header>

    <main>
      <section aria-labelledby="cardsTitle">
        <div class="section-heading">
          <h2 id="cardsTitle" data-i18n="Company Cards">Company Cards</h2>
          <p id="loadStatus" data-i18n="Loading local price data...">Loading local price data...</p>
        </div>
        <div class="card-grid" id="companyCards"></div>
      </section>

      <section aria-labelledby="sectionsTitle">
        <div class="section-heading">
          <h2 id="sectionsTitle" data-i18n="Company Research Sections">Company Research Sections</h2>
          <p data-i18n="Each section uses the same local JSON file as its chart and table source.">Each section uses the same local JSON file as its chart and table source.</p>
        </div>
        <div class="company-sections" id="companySections"></div>
      </section>

      <section aria-labelledby="dailyTitle" id="dailyReview">
        <div class="section-heading">
          <h2 id="dailyTitle" data-i18n="End-of-Day Market Review">End-of-Day Market Review</h2>
          <p data-i18n="Use the tabs to see the exact latest trading-day move for one stock.">Use the tabs to see the exact latest trading-day move for one stock.</p>
        </div>
        <div class="daily-tabs" id="dailyTabs"></div>
        <div class="daily-panel" id="dailyPanel"></div>
      </section>
    </main>

    <div class="modal-backdrop" id="ideaModal" aria-hidden="true">
      <section class="idea-modal" role="dialog" aria-modal="true" aria-labelledby="ideaModalTitle">
        <div class="modal-top">
          <div>
            <p class="eyebrow" data-i18n="Idea coach">Idea coach</p>
            <h2 id="ideaModalTitle" data-i18n="Review my stock idea">Review my stock idea</h2>
          </div>
          <button class="icon-button" id="closeIdeaModal" type="button" aria-label="Close idea coach">×</button>
        </div>

        <div class="idea-grid">
          <div>
            <label for="ideaTicker" data-i18n="Stock">Stock</label>
            <select id="ideaTicker">
              <option value="AAPL">Apple (AAPL)</option>
              <option value="NVDA">Nvidia (NVDA)</option>
              <option value="COST">Costco (COST)</option>
            </select>
          </div>

          <div>
            <label for="ideaAction" data-i18n="My idea">My idea</label>
            <select id="ideaAction">
              <option value="hold" data-i18n="I am thinking about holding">I am thinking about holding</option>
              <option value="buy" data-i18n="I am thinking about buying">I am thinking about buying</option>
              <option value="sell" data-i18n="I am thinking about selling">I am thinking about selling</option>
            </select>
          </div>
        </div>

        <label for="ideaText" data-i18n="Explain your thinking">Explain your thinking</label>
        <textarea id="ideaText" data-i18n-placeholder="Example: I think Nvidia is dropping today, but I still like its long-term AI business. Should I wait?" placeholder="Example: I think Nvidia is dropping today, but I still like its long-term AI business. Should I wait?"></textarea>

        <div class="modal-actions">
          <button id="reviewIdeaButton" type="button" data-i18n="Review idea">Review idea</button>
        </div>

        <div class="coach-response" id="coachResponse">
          <strong data-i18n="Ready when you are.">Ready when you are.</strong>
          <p data-i18n="Write your idea, choose the stock, then press Review idea.">Write your idea, choose the stock, then press Review idea.</p>
        </div>
      </section>
    </div>

    <div class="modal-backdrop" id="responseModal" aria-hidden="true">
      <section class="idea-modal response-modal" role="dialog" aria-modal="true" aria-labelledby="responseModalTitle">
        <div class="modal-top">
          <div>
            <p class="eyebrow" data-i18n="ChatGPT-style response">ChatGPT-style response</p>
            <h2 id="responseModalTitle" data-i18n="Review in progress">Review in progress</h2>
          </div>
          <button class="icon-button" id="closeResponseModal" type="button" aria-label="Close response">×</button>
        </div>
        <div class="response-loading" id="responseLoading">
          <span aria-hidden="true"></span>
          <p data-i18n="Reviewing the stock data and your idea...">Reviewing the stock data and your idea...</p>
        </div>
        <div class="response-body" id="responseBody"></div>
      </section>
    </div>

    <div class="modal-backdrop" id="funModeModal" aria-hidden="true">
      <section class="idea-modal fun-modal" role="dialog" aria-modal="true" aria-labelledby="funModeTitle">
        <div class="modal-top">
          <div>
            <p class="eyebrow" data-i18n="Tiny dashboard personality">Tiny dashboard personality</p>
            <h2 id="funModeTitle" data-i18n="Turn on stock puns?">Turn on stock puns?</h2>
          </div>
        </div>

        <p class="fun-intro" data-i18n="Add a controlled amount of small popups, light jokes, and investing puns while you click around.">
          Add a controlled amount of small popups, light jokes, and investing puns while you click around.
        </p>

        <div class="fun-sample">
          <strong data-i18n="Sample:">Sample:</strong>
          <span data-i18n="This chart is trying to make a good impression. Very bullish behavior.">This chart is trying to make a good impression. Very bullish behavior.</span>
        </div>

        <div class="modal-actions fun-actions">
          <button id="disableFunMode" type="button" data-i18n="Keep it serious">Keep it serious</button>
          <button id="enableFunMode" type="button" data-i18n="Add a little fun">Add a little fun</button>
        </div>
      </section>
    </div>

    <div class="pun-toast-area" id="punToastArea" aria-live="polite"></div>

    <script src="data/prices.js"></script>
    <script src="data/fundamentals.js"></script>
    <script src="data/ai_explanations.js"></script>
    <script src="data/ai_actions.js"></script>
    <script src="data/daily_analysis.js"></script>
    <script src="app.js"></script>
  </body>
</html>

```

## style.css

```css
* {
  box-sizing: border-box;
}

:root {
  --ink: #172033;
  --muted: #647084;
  --line: #d8e0ea;
  --paper: #ffffff;
  --wash: #f5f7fa;
  --blue: #1768d1;
  --green: #087d61;
  --red: #bf4b39;
  --gold: #a46a00;
  --shadow: 0 14px 34px rgba(23, 32, 51, 0.08);
}

body {
  margin: 0;
  background: var(--wash);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
}

.site-header {
  border-bottom: 1px solid var(--line);
  background: var(--paper);
}

.site-header > div,
main {
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
}

.site-header > div {
  padding: 34px 0 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--green);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3 {
  margin: 0;
  line-height: 1.18;
}

h1 {
  font-size: clamp(38px, 5vw, 64px);
}

h2 {
  font-size: 30px;
}

h3 {
  font-size: 26px;
}

.description {
  max-width: 760px;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 21px;
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.language-picker {
  display: grid;
  gap: 6px;
  max-width: 260px;
  margin-top: 18px;
}

.language-picker label {
  margin-bottom: 0;
}

.hero-actions a,
.hero-actions button,
.idea-button,
.modal-actions button,
.icon-button {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfcfe;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
}

.hero-actions a,
.hero-actions button {
  display: grid;
  min-height: 48px;
  place-items: center;
  padding: 12px 16px;
}

.hero-actions a:first-child,
.modal-actions button {
  border-color: var(--green);
  background: var(--green);
  color: #ffffff;
}

.hero-actions a:hover,
.hero-actions button:hover,
.idea-button:hover,
.modal-actions button:hover {
  border-color: var(--green);
  box-shadow: 0 8px 18px rgba(23, 32, 51, 0.08);
  transform: translateY(-1px);
}

.hero-actions button.active {
  border-color: var(--green);
  background: #f3fbf7;
  color: var(--green);
}

.context-emoji {
  display: inline-grid;
  width: 1.65em;
  height: 1.65em;
  place-items: center;
  margin-right: 0.35em;
  border-radius: 999px;
  background: #eef3f8;
  font-size: 0.92em;
  line-height: 1;
  vertical-align: -0.12em;
}

[dir="rtl"] .context-emoji {
  margin-right: 0;
  margin-left: 0.35em;
}

main {
  padding: 26px 0 46px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin: 22px 0 14px;
}

.section-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 17px;
}

.range-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(58px, 1fr));
  gap: 8px;
  margin: 12px 0 10px;
}

.range-controls button {
  min-height: 38px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.range-controls button:hover {
  border-color: var(--green);
  transform: translateY(-1px);
}

.range-controls button.active {
  border-color: var(--green);
  background: #f3fbf7;
  color: var(--green);
  box-shadow: inset 0 0 0 1px var(--green);
}

.chart-block {
  display: grid;
  gap: 4px;
  margin: 12px 0 6px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.daily-tab:focus-visible,
.review-mode button:focus-visible,
.slide-controls button:focus-visible,
.hero-actions a:focus-visible,
.hero-actions button:focus-visible,
.idea-button:focus-visible,
.modal-actions button:focus-visible,
.icon-button:focus-visible {
  outline: 3px solid rgba(8, 125, 97, 0.22);
  outline-offset: 2px;
}

.company-card,
.research-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
}

.company-card {
  display: flex;
  min-height: 560px;
  flex-direction: column;
  padding: 18px;
  animation: updateFade 700ms ease both;
}

.card-top,
.panel-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.ticker-pill {
  border-radius: 999px;
  background: #eef3f8;
  color: var(--muted);
  font-size: 15px;
  font-weight: 700;
  padding: 7px 11px;
  white-space: nowrap;
}

.summary {
  min-height: 92px;
  margin: 12px 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.45;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.metric {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  animation: updateLift 620ms ease both;
}

.metric span {
  display: block;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

.metric strong {
  display: block;
  margin-top: 6px;
  font-size: 22px;
}

.metric-effect.change-up {
  border-color: rgba(8, 125, 97, 0.38);
  background: #f3fbf7;
}

.metric-effect.change-down {
  border-color: rgba(191, 75, 57, 0.34);
  background: #fff7f5;
}

.mini-chart {
  width: 100%;
  height: 170px;
}

.chart-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  margin: 14px 0 6px;
}

.chart-row-large {
  margin: 0;
}

.change-badge {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  min-width: 74px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfcfe;
  padding: 12px 10px;
  animation: updatePulse 900ms ease both;
}

.change-badge span {
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}

.change-badge strong {
  margin-top: 4px;
  font-size: 20px;
}

.change-badge small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 15px;
  font-weight: 700;
}

.change-up {
  color: var(--green);
}

.change-down {
  color: var(--red);
}

.change-flat {
  color: var(--muted);
}

.value-effect {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.value-effect span {
  position: absolute;
  font-size: 18px;
  font-weight: 800;
  opacity: 0;
}

.gain-effect span {
  color: var(--green);
  animation: dollarFloat 1700ms ease-in-out infinite;
}

.drop-effect span {
  color: var(--red);
  animation: arrowFall 1500ms ease-in-out infinite;
}

.value-effect span:nth-child(1) {
  left: 14%;
  animation-delay: 0ms;
}

.value-effect span:nth-child(2) {
  left: 48%;
  animation-delay: 260ms;
}

.value-effect span:nth-child(3) {
  left: 76%;
  animation-delay: 520ms;
}

.note-group {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.label-row label {
  margin-bottom: 0;
}

.idea-button {
  min-height: 36px;
  padding: 8px 12px;
  white-space: nowrap;
}

.ai-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(160px, 0.6fr);
  gap: 10px;
}

.ai-summary-grid {
  display: grid;
  grid-template-columns: minmax(150px, 0.55fr) minmax(0, 1fr);
  gap: 10px;
}

.ai-quick-summary {
  min-height: 92px;
  margin: 0;
  border: 1px solid #cfdced;
  border-left: 4px solid var(--gold);
  border-radius: 8px;
  background: #fffaf0;
  color: var(--ink);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.5;
  padding: 12px;
  animation: updateGlow 900ms ease both;
}

.ai-explanation,
.ai-action {
  min-height: 92px;
  margin: 0;
  border: 1px solid #cfdced;
  border-left: 4px solid var(--green);
  border-radius: 8px;
  background: #f7fbf9;
  color: var(--ink);
  font-size: 17px;
  line-height: 1.5;
  padding: 12px;
  animation: updateGlow 900ms ease both;
}

.ai-action {
  display: grid;
  align-content: start;
  gap: 6px;
}

.ai-action strong {
  font-size: 22px;
}

.ai-action p {
  margin: 0;
  color: var(--muted);
  font-size: 16px;
}

.ai-action small {
  color: var(--muted);
  font-size: 15px;
  font-weight: 700;
}

.action-buy {
  border-left-color: var(--green);
  background: #f3fbf7;
}

.action-hold {
  border-left-color: var(--gold);
  background: #fffaf0;
}

.action-sell {
  border-left-color: var(--red);
  background: #fff7f5;
}

.action-neutral {
  border-left-color: var(--muted);
  background: #f8fafc;
}

.daily-analysis {
  min-height: 100px;
  border: 1px solid #cfdced;
  border-left: 4px solid var(--muted);
  border-radius: 8px;
  background: #f8fafc;
  padding: 12px;
  animation: updateGlow 900ms ease both;
}

.daily-analysis strong {
  display: block;
  font-size: 20px;
}

.daily-analysis p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.5;
}

.daily-up {
  border-left-color: var(--green);
  background: #f3fbf7;
}

.daily-down {
  border-left-color: var(--red);
  background: #fff7f5;
}

.daily-flat {
  border-left-color: var(--gold);
  background: #fffaf0;
}

.daily-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.daily-tab {
  display: grid;
  gap: 4px;
  min-height: 66px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  padding: 12px;
  text-align: left;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.daily-tab:hover {
  border-color: #b7c7da;
  transform: translateY(-1px);
}

.daily-tab span {
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

.daily-tab strong {
  font-size: 24px;
}

.daily-tab.active {
  border-color: var(--green);
  background: #f3fbf7;
  box-shadow: inset 0 0 0 1px var(--green);
}

.daily-panel {
  margin-bottom: 8px;
}

.daily-detail {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  padding: 20px;
  animation: updateFade 700ms ease both;
  box-shadow: var(--shadow);
}

.daily-detail-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.review-mode {
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #f8fafc;
  padding: 4px;
}

.review-mode button {
  min-height: 44px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  padding: 9px 12px;
}

.review-mode button.active {
  background: var(--paper);
  color: var(--ink);
  box-shadow: 0 3px 12px rgba(23, 32, 51, 0.08);
}

.daily-detail-top h3 {
  margin-top: 10px;
}

.daily-detail-top p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 17px;
  font-weight: 700;
}

.daily-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 18px;
}

.daily-side {
  display: grid;
  align-content: start;
  gap: 14px;
}

.review-card,
.slide-card {
  border: 1px solid #cfdced;
  border-left: 4px solid var(--muted);
  border-radius: 8px;
  background: #f8fafc;
  padding: 14px;
  animation: reviewEnter 420ms ease both;
}

.review-card strong,
.slide-card h4 {
  display: block;
  margin: 0;
  font-size: 24px;
}

.review-card p,
.slide-card p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.55;
}

.review-card small {
  display: block;
  margin-top: 10px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}

.allocation-box {
  margin-top: 12px;
  border: 1px solid rgba(23, 32, 51, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.65);
  color: var(--ink);
  font-size: 17px;
  font-weight: 700;
  padding: 10px;
}

.review-buy {
  border-left-color: var(--green);
  background: #f3fbf7;
}

.review-hold {
  border-left-color: var(--gold);
  background: #fffaf0;
}

.review-sell {
  border-left-color: var(--red);
  background: #fff7f5;
}

.slide-card {
  min-height: 300px;
  display: grid;
  align-content: space-between;
  gap: 18px;
}

.slide-count {
  width: fit-content;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  padding: 6px 10px;
}

.slide-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.slide-controls button {
  min-height: 48px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.slide-controls button:hover {
  border-color: var(--green);
  background: #f3fbf7;
}

@keyframes updateFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes updateLift {
  0% {
    background: #eef8f3;
    transform: translateY(4px);
  }

  100% {
    background: transparent;
    transform: translateY(0);
  }
}

@keyframes updatePulse {
  0% {
    box-shadow: 0 0 0 0 rgba(8, 125, 97, 0.35);
  }

  100% {
    box-shadow: 0 0 0 12px rgba(8, 125, 97, 0);
  }
}

@keyframes updateGlow {
  0% {
    box-shadow: inset 0 0 0 999px rgba(8, 125, 97, 0.08);
  }

  100% {
    box-shadow: inset 0 0 0 999px rgba(8, 125, 97, 0);
  }
}

@keyframes reviewEnter {
  from {
    opacity: 0;
    transform: translateX(12px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toastOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(12px);
  }
}

@keyframes dollarFloat {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.82);
  }

  35% {
    opacity: 0.42;
  }

  100% {
    opacity: 0;
    transform: translateY(-24px) scale(1.08);
  }
}

@keyframes responseSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes arrowFall {
  0% {
    opacity: 0;
    transform: translateY(-24px) scale(0.9);
  }

  35% {
    opacity: 0.48;
  }

  100% {
    opacity: 0;
    transform: translateY(24px) scale(1.08);
  }
}

label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

textarea,
input,
select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfcfe;
  color: var(--ink);
  font: inherit;
}

textarea {
  min-height: 92px;
  resize: vertical;
  padding: 12px;
  line-height: 1.45;
}

.user-ideas-box {
  min-height: 184px;
}

input {
  padding: 12px;
}

select {
  padding: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(23, 32, 51, 0.38);
  padding: 18px;
}

.modal-backdrop.open {
  display: flex;
}

.idea-modal {
  width: min(760px, 100%);
  max-height: min(86vh, 820px);
  overflow-y: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  box-shadow: 0 24px 80px rgba(23, 32, 51, 0.22);
  padding: 20px;
  animation: modalEnter 220ms ease both;
}

.modal-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.icon-button {
  width: 44px;
  height: 44px;
  font-size: 26px;
  line-height: 1;
}

.idea-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  justify-content: end;
  margin-top: 12px;
}

.modal-actions button {
  min-height: 48px;
  padding: 12px 18px;
}

.coach-response {
  margin-top: 14px;
  border: 1px solid #cfdced;
  border-left: 4px solid var(--green);
  border-radius: 8px;
  background: #f3fbf7;
  padding: 14px;
  animation: updateGlow 900ms ease both;
}

.coach-response strong {
  display: block;
  font-size: 22px;
}

.coach-response p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.55;
}

.coach-response ul {
  margin: 10px 0 0;
  padding-left: 20px;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.55;
}

.coach-response small {
  display: block;
  margin-top: 10px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}

.response-modal {
  width: min(860px, 100%);
}

.response-loading {
  display: grid;
  justify-items: center;
  gap: 12px;
  min-height: 180px;
  border: 1px solid #cfdced;
  border-radius: 8px;
  background: #f7fbf9;
  padding: 24px;
  text-align: center;
}

.response-loading span {
  width: 54px;
  height: 54px;
  border: 5px solid #d8e0ea;
  border-top-color: var(--green);
  border-radius: 999px;
  animation: responseSpin 900ms linear infinite;
}

.response-loading p {
  margin: 0;
  color: var(--muted);
  font-size: 18px;
  font-weight: 700;
}

.response-body {
  display: none;
}

.response-body.ready {
  display: grid;
  gap: 14px;
}

.response-body .coach-response,
.response-body .review-card {
  margin-top: 0;
}

.response-body .review-card ul {
  margin: 10px 0 0;
  padding-left: 20px;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.55;
}

.response-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 10px;
  margin-top: 12px;
}

.response-actions button {
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfcfe;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 14px;
}

.response-actions button:hover {
  border-color: var(--green);
  background: #f3fbf7;
}

.fun-modal {
  max-width: 560px;
}

.fun-intro {
  margin: 0;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.55;
}

.fun-sample {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  border: 1px solid #cfdced;
  border-left: 4px solid var(--gold);
  border-radius: 8px;
  background: #fffaf0;
  padding: 12px;
}

.fun-sample strong {
  font-size: 17px;
}

.fun-sample span {
  color: var(--muted);
  font-size: 17px;
  line-height: 1.45;
}

.fun-actions {
  gap: 10px;
}

.fun-actions button:first-child {
  background: #fbfcfe;
  color: var(--ink);
  border-color: var(--line);
}

.pun-toast-area {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 30;
  display: grid;
  gap: 10px;
  width: min(340px, calc(100% - 36px));
  pointer-events: none;
}

.pun-toast {
  border: 1px solid #cfdced;
  border-left: 4px solid var(--green);
  border-radius: 8px;
  background: var(--paper);
  box-shadow: var(--shadow);
  color: var(--ink);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.45;
  padding: 14px 16px;
  animation: toastIn 240ms ease both;
}

.pun-toast.leaving {
  animation: toastOut 240ms ease both;
}

[dir="rtl"] .section-heading,
[dir="rtl"] .card-top,
[dir="rtl"] .panel-top,
[dir="rtl"] .daily-detail-top,
[dir="rtl"] .modal-top {
  text-align: right;
}

[dir="rtl"] th,
[dir="rtl"] td {
  text-align: left;
}

[dir="rtl"] th:first-child,
[dir="rtl"] td:first-child {
  text-align: right;
}

[dir="rtl"] .pun-toast-area {
  right: auto;
  left: 18px;
}

.company-sections {
  display: grid;
  gap: 20px;
}

.research-panel {
  padding: 20px;
}

.panel-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(310px, 0.75fr);
  gap: 18px;
  margin-top: 16px;
}

.large-chart {
  width: 100%;
  height: 380px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfcfe;
}

.table-wrap {
  margin-top: 14px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--paper);
  font-size: 17px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 12px 10px;
  text-align: right;
  white-space: nowrap;
}

th:first-child,
td:first-child {
  text-align: left;
}

th {
  color: var(--muted);
  font-size: 14px;
  text-transform: uppercase;
}

.panel-side {
  display: grid;
  align-content: start;
  gap: 14px;
}

.accent-aapl {
  border-top: 4px solid var(--blue);
}

.accent-nvda {
  border-top: 4px solid var(--green);
}

.accent-cost {
  border-top: 4px solid var(--gold);
}

@media (max-width: 940px) {
  .card-grid,
  .daily-detail-grid,
  .panel-layout {
    grid-template-columns: 1fr;
  }

  .company-card {
    min-height: auto;
  }
}

@media (max-width: 620px) {
  .section-heading,
  .card-top,
  .panel-top {
    align-items: stretch;
    flex-direction: column;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }

  .daily-tabs,
  .idea-grid {
    grid-template-columns: 1fr;
  }

  .range-controls {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .large-chart {
    height: 320px;
  }

  .chart-row {
    grid-template-columns: 1fr;
  }

  .change-badge {
    grid-template-columns: auto auto auto;
    justify-content: center;
    gap: 6px;
    min-width: 0;
  }

  .change-badge strong,
  .change-badge small {
    margin-top: 0;
  }

  .ai-row {
    grid-template-columns: 1fr;
  }

  .ai-summary-grid {
    grid-template-columns: 1fr;
  }

  .daily-detail-top {
    align-items: stretch;
    flex-direction: column;
  }

  .label-row,
  .modal-top {
    align-items: stretch;
    flex-direction: column;
  }

  .review-mode,
  .slide-controls {
    grid-template-columns: 1fr;
  }
}

```

## app.js

```javascript
const companies = [
  {
    name: "Apple",
    ticker: "AAPL",
    file: "data/AAPL.json",
    color: "#1768d1",
    accentClass: "accent-aapl",
    summary:
      "Apple designs consumer devices, software, and services, including iPhone, Mac, iPad, Apple Watch, iCloud, and the App Store.",
  },
  {
    name: "Nvidia",
    ticker: "NVDA",
    file: "data/NVDA.json",
    color: "#087d61",
    accentClass: "accent-nvda",
    summary:
      "Nvidia designs GPUs, AI accelerators, networking products, and software used in gaming, data centers, visualization, and autonomous systems.",
  },
  {
    name: "Costco Wholesale",
    ticker: "COST",
    file: "data/COST.json",
    color: "#a46a00",
    accentClass: "accent-cost",
    summary:
      "Costco operates membership warehouses that sell groceries, merchandise, fuel, and services with a focus on high volume and low prices.",
  },
];

const companyCards = document.querySelector("#companyCards");
const companySections = document.querySelector("#companySections");
const loadStatus = document.querySelector("#loadStatus");
const dailyTabs = document.querySelector("#dailyTabs");
const dailyPanel = document.querySelector("#dailyPanel");
const ideaModal = document.querySelector("#ideaModal");
const startIdeaCoach = document.querySelector("#startIdeaCoach");
const closeIdeaModal = document.querySelector("#closeIdeaModal");
const ideaTicker = document.querySelector("#ideaTicker");
const ideaAction = document.querySelector("#ideaAction");
const ideaText = document.querySelector("#ideaText");
const reviewIdeaButton = document.querySelector("#reviewIdeaButton");
const coachResponse = document.querySelector("#coachResponse");
const responseModal = document.querySelector("#responseModal");
const closeResponseModal = document.querySelector("#closeResponseModal");
const responseModalTitle = document.querySelector("#responseModalTitle");
const responseLoading = document.querySelector("#responseLoading");
const responseBody = document.querySelector("#responseBody");
const funModeSettings = document.querySelector("#funModeSettings");
const funModeModal = document.querySelector("#funModeModal");
const enableFunMode = document.querySelector("#enableFunMode");
const disableFunMode = document.querySelector("#disableFunMode");
const punToastArea = document.querySelector("#punToastArea");
const languageSelect = document.querySelector("#languageSelect");
const emojiModeToggle = document.querySelector("#emojiModeToggle");
let dailyViewMode = "clear";
let dailySlideIndex = 0;
let currentDataByTicker = {};
let funModeEnabled = localStorage.getItem("funModeEnabled") === "true";
let emojiModeEnabled = localStorage.getItem("emojiModeEnabled") === "true";
let currentLanguage = localStorage.getItem("dashboardLanguage") || "en";
let selectedRange = localStorage.getItem("chartRange") || "1Y";
let punsShownThisSession = 0;
let lastPunTime = 0;
let responseTimer = null;
const chartAnimationFrames = new WeakMap();

const chartRanges = [
  { key: "1D", label: "1D", rows: 1 },
  { key: "5D", label: "5D", rows: 5 },
  { key: "1W", label: "1W", days: 7 },
  { key: "1M", label: "1M", months: 1 },
  { key: "6M", label: "6M", months: 6 },
  { key: "1Y", label: "1Y", years: 1 },
  { key: "5Y", label: "5Y", years: 5 },
  { key: "MAX", label: "Max" },
];

const stockPuns = [
  "This chart is trying to make a good impression. Very bullish behavior.",
  "Nice click. Your research portfolio just gained one curiosity point.",
  "That tab opened faster than a market headline on earnings day.",
  "This dashboard keeps its gains in knowledge, which is the least taxable kind.",
  "A thoughtful note now can save a confused trade later.",
  "The data dressed up today. It brought metrics and everything.",
  "Tiny reminder: good research compounds too.",
  "That was a clean move. The interface approves calmly.",
];

const translations = {
  en: {},
  zh: {
    "Local JSON stock project": "本地 JSON 股票项目",
    "Stock Research Dashboard": "股票研究仪表板",
    "A beginner-friendly webpage that reads local EODHD price files for Apple, Nvidia, and Costco, then turns daily close prices into research cards, charts, metric boxes, and personal notes.": "一个适合初学者的网页，会读取 Apple、Nvidia 和 Costco 的本地 EODHD 价格文件，并把每日收盘价变成研究卡片、图表、指标框和个人笔记。",
    "Language": "语言",
    "Chart Range": "图表范围",
    "Choose how much price history the charts should show.": "选择图表要显示多少价格历史。",
    "Explore stocks": "浏览股票",
    "End-of-day review": "收盘后回顾",
    "Open idea coach": "打开想法助手",
    "Fun mode": "趣味模式",
    "Emoji hints": "表情提示",
    "Emoji hints on": "表情提示：开",
    "Emoji hints off": "表情提示：关",
    "Stock Navigator": "股票导航",
    "Choose a company, jump to its research section, or open its daily review.": "选择一家公司，跳到研究区，或打开每日回顾。",
    "Company Cards": "公司卡片",
    "Loading local price data...": "正在加载本地价格数据...",
    "Company Research Sections": "公司研究区",
    "Each section uses the same local JSON file as its chart and table source.": "每个区块都使用同一个本地 JSON 文件作为图表和表格来源。",
    "End-of-Day Market Review": "收盘后市场回顾",
    "Use the tabs to see the exact latest trading-day move for one stock.": "使用标签查看某只股票最新交易日的具体变化。",
    "Idea coach": "想法助手",
    "Review my stock idea": "审查我的股票想法",
    "Stock": "股票",
    "My idea": "我的想法",
    "I am thinking about holding": "我在考虑持有",
    "I am thinking about buying": "我在考虑买入",
    "I am thinking about selling": "我在考虑卖出",
    "Explain your thinking": "说明你的想法",
    "Example: I think Nvidia is dropping today, but I still like its long-term AI business. Should I wait?": "例子：我觉得 Nvidia 今天下跌，但我仍看好它的长期 AI 业务。我应该等待吗？",
    "Review idea": "审查想法",
    "Ready when you are.": "准备好了就开始。",
    "Write your idea, choose the stock, then press Review idea.": "写下你的想法，选择股票，然后点击审查想法。",
    "Tiny dashboard personality": "一点点仪表板个性",
    "Turn on stock puns?": "开启股票双关笑话？",
    "Add a controlled amount of small popups, light jokes, and investing puns while you click around.": "点击浏览时加入少量可控的小弹窗、轻松笑话和投资双关语。",
    "Sample:": "示例：",
    "This chart is trying to make a good impression. Very bullish behavior.": "这张图表想留下好印象。非常看涨的行为。",
    "Keep it serious": "保持严肃",
    "Add a little fun": "加一点趣味",
    "Latest close": "最新收盘价",
    "Day move": "当日变化",
    "Market cap": "市值",
    "P/E ratio": "市盈率",
    "Research section": "研究区",
    "Daily review": "每日回顾",
    "Revenue": "收入",
    "Net income": "净利润",
    "Quick summary": "快速总结",
    "AI explanation": "AI 解释",
    "AI buy/sell check": "AI 买/卖检查",
    "Educational signal, not personal financial advice.": "教育性信号，不是个人财务建议。",
    "User ideas": "用户想法",
    "Verify with ChatGPT": "用 ChatGPT 验证",
    "Write your ideas here.": "在这里写下你的想法。",
    "One question I still have": "我还有一个问题",
    "Write one question here.": "在这里写一个问题。",
    "Range high close": "范围最高收盘价",
    "Range low close": "范围最低收盘价",
    "Clear View": "清晰视图",
    "Slideshow Review": "幻灯片回顾",
    "Previous close": "前一收盘价",
    "Daily change": "每日变化",
    "Volume": "成交量",
    "ChatGPT-style buy/sell review": "ChatGPT 风格买/卖回顾",
    "Back": "返回",
    "Next": "下一步",
    "Fun mode is on. Small puns, controlled dosage.": "趣味模式已开启。少量笑话，剂量可控。",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "已从本地 JSON 文件加载 AAPL、NVDA 和 COST。",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "已加载 AAPL、NVDA 和 COST。最后刷新：",
    "Slide": "幻灯片",
    "of": "共",
  },
  la: {
    "Local JSON stock project": "Proiectum locale JSON de mercatu",
    "Stock Research Dashboard": "Tabula Investigationis Actionum",
    "Language": "Lingua",
    "Chart Range": "Spatium chartae",
    "Choose how much price history the charts should show.": "Elige quantum historiae pretiorum charta ostendat.",
    "Explore stocks": "Actiones explorare",
    "End-of-day review": "Recensio finis diei",
    "Open idea coach": "Consiliarium idearum aperire",
    "Fun mode": "Modus iocosus",
    "Emoji hints": "Signa emoji",
    "Emoji hints on": "Emoji adsunt",
    "Emoji hints off": "Emoji absunt",
    "Stock Navigator": "Navigator actionum",
    "Company Cards": "Chartae societatum",
    "Loading local price data...": "Pretia localia onerantur...",
    "Company Research Sections": "Sectiones investigationis",
    "End-of-Day Market Review": "Recensio mercatus in fine diei",
    "Idea coach": "Consiliarius idearum",
    "Review my stock idea": "Recense ideam meam",
    "Stock": "Actio",
    "My idea": "Idea mea",
    "I am thinking about holding": "Cogito tenere",
    "I am thinking about buying": "Cogito emere",
    "I am thinking about selling": "Cogito vendere",
    "Explain your thinking": "Explica consilium tuum",
    "Review idea": "Recense ideam",
    "Ready when you are.": "Paratus sum.",
    "Tiny dashboard personality": "Parva persona tabulae",
    "Turn on stock puns?": "Iocos mercatus accendere?",
    "Sample:": "Exemplum:",
    "Keep it serious": "Serium serva",
    "Add a little fun": "Adde paulum ioci",
    "Latest close": "Clausura novissima",
    "Day move": "Motus diei",
    "Market cap": "Valor mercatus",
    "P/E ratio": "Ratio P/E",
    "Research section": "Sectio investigationis",
    "Daily review": "Recensio cotidiana",
    "Revenue": "Reditus",
    "Net income": "Lucrum netum",
    "Quick summary": "Summarium breve",
    "AI explanation": "Explicatio AI",
    "AI buy/sell check": "Probatio emendi/vendendi AI",
    "Educational signal, not personal financial advice.": "Signum scholasticum, non consilium pecuniarium personale.",
    "User ideas": "Ideae usoris",
    "Verify with ChatGPT": "Verifica cum ChatGPT",
    "One question I still have": "Una quaestio restat",
    "Range high close": "Clausura maxima spatii",
    "Range low close": "Clausura minima spatii",
    "Clear View": "Visus clarus",
    "Slideshow Review": "Recensio per imagines",
    "Previous close": "Clausura prior",
    "Daily change": "Mutatio diei",
    "Volume": "Volumen",
    "ChatGPT-style buy/sell review": "Recensio emendi/vendendi more ChatGPT",
    "Back": "Retro",
    "Next": "Proximum",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA, COST ex fasciculis localibus JSON onerata sunt.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA, COST onerata sunt. Novissime renovatum:",
    "Slide": "Imago",
    "of": "ex",
  },
  ar: {
    "Local JSON stock project": "مشروع أسهم JSON محلي",
    "Stock Research Dashboard": "لوحة أبحاث الأسهم",
    "Language": "اللغة",
    "Chart Range": "نطاق الرسم",
    "Choose how much price history the charts should show.": "اختر مقدار تاريخ الأسعار الذي تعرضه الرسوم.",
    "Explore stocks": "استكشف الأسهم",
    "End-of-day review": "مراجعة نهاية اليوم",
    "Open idea coach": "افتح مساعد الأفكار",
    "Fun mode": "وضع المرح",
    "Emoji hints": "تلميحات الرموز",
    "Emoji hints on": "الرموز مفعلة",
    "Emoji hints off": "الرموز متوقفة",
    "Stock Navigator": "متصفح الأسهم",
    "Choose a company, jump to its research section, or open its daily review.": "اختر شركة، وانتقل إلى قسم البحث أو افتح مراجعتها اليومية.",
    "Company Cards": "بطاقات الشركات",
    "Loading local price data...": "جار تحميل بيانات الأسعار المحلية...",
    "Company Research Sections": "أقسام بحث الشركات",
    "Each section uses the same local JSON file as its chart and table source.": "يستخدم كل قسم ملف JSON المحلي نفسه كمصدر للرسم والجدول.",
    "End-of-Day Market Review": "مراجعة السوق في نهاية اليوم",
    "Use the tabs to see the exact latest trading-day move for one stock.": "استخدم التبويبات لرؤية حركة آخر يوم تداول لسهم واحد.",
    "Idea coach": "مساعد الأفكار",
    "Review my stock idea": "راجع فكرتي عن السهم",
    "Stock": "السهم",
    "My idea": "فكرتي",
    "I am thinking about holding": "أفكر في الاحتفاظ",
    "I am thinking about buying": "أفكر في الشراء",
    "I am thinking about selling": "أفكر في البيع",
    "Explain your thinking": "اشرح تفكيرك",
    "Review idea": "راجع الفكرة",
    "Ready when you are.": "جاهز عندما تكون جاهزاً.",
    "Write your idea, choose the stock, then press Review idea.": "اكتب فكرتك، اختر السهم، ثم اضغط مراجعة الفكرة.",
    "Tiny dashboard personality": "لمسة شخصية صغيرة",
    "Turn on stock puns?": "تشغيل نكات الأسهم؟",
    "Add a controlled amount of small popups, light jokes, and investing puns while you click around.": "أضف كمية محدودة من النوافذ الصغيرة والنكات الخفيفة أثناء التصفح.",
    "Sample:": "مثال:",
    "Keep it serious": "ابقه جاداً",
    "Add a little fun": "أضف بعض المرح",
    "Latest close": "آخر إغلاق",
    "Day move": "حركة اليوم",
    "Market cap": "القيمة السوقية",
    "P/E ratio": "نسبة السعر إلى الربح",
    "Research section": "قسم البحث",
    "Daily review": "المراجعة اليومية",
    "Revenue": "الإيرادات",
    "Net income": "صافي الدخل",
    "Quick summary": "ملخص سريع",
    "AI explanation": "شرح الذكاء الاصطناعي",
    "AI buy/sell check": "فحص شراء/بيع بالذكاء الاصطناعي",
    "Educational signal, not personal financial advice.": "إشارة تعليمية وليست نصيحة مالية شخصية.",
    "User ideas": "أفكار المستخدم",
    "Verify with ChatGPT": "تحقق باستخدام ChatGPT",
    "Write your ideas here.": "اكتب أفكارك هنا.",
    "One question I still have": "سؤال ما زال لدي",
    "Write one question here.": "اكتب سؤالاً هنا.",
    "Range high close": "أعلى إغلاق في النطاق",
    "Range low close": "أدنى إغلاق في النطاق",
    "Clear View": "عرض واضح",
    "Slideshow Review": "مراجعة بالشرائح",
    "Previous close": "الإغلاق السابق",
    "Daily change": "التغير اليومي",
    "Volume": "الحجم",
    "ChatGPT-style buy/sell review": "مراجعة شراء/بيع بأسلوب ChatGPT",
    "Back": "السابق",
    "Next": "التالي",
    "Fun mode is on. Small puns, controlled dosage.": "تم تشغيل وضع المرح. نكات قليلة وبجرعة مضبوطة.",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "تم تحميل AAPL و NVDA و COST من ملفات JSON المحلية.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "تم تحميل AAPL و NVDA و COST. آخر تحديث:",
    "Slide": "شريحة",
    "of": "من",
  },
  es: {
    "Local JSON stock project": "Proyecto local de acciones con JSON",
    "Stock Research Dashboard": "Panel de investigación de acciones",
    "Language": "Idioma",
    "Chart Range": "Rango del gráfico",
    "Choose how much price history the charts should show.": "Elige cuánta historia de precios deben mostrar los gráficos.",
    "Explore stocks": "Explorar acciones",
    "End-of-day review": "Revisión de cierre",
    "Open idea coach": "Abrir asesor de ideas",
    "Fun mode": "Modo divertido",
    "Emoji hints": "Pistas emoji",
    "Emoji hints on": "Emojis activados",
    "Emoji hints off": "Emojis desactivados",
    "Stock Navigator": "Navegador de acciones",
    "Choose a company, jump to its research section, or open its daily review.": "Elige una empresa, salta a su sección de investigación o abre su revisión diaria.",
    "Company Cards": "Tarjetas de empresas",
    "Loading local price data...": "Cargando datos locales de precios...",
    "Company Research Sections": "Secciones de investigación",
    "Each section uses the same local JSON file as its chart and table source.": "Cada sección usa el mismo archivo JSON local como fuente del gráfico y la tabla.",
    "End-of-Day Market Review": "Revisión del mercado al cierre",
    "Use the tabs to see the exact latest trading-day move for one stock.": "Usa las pestañas para ver el movimiento exacto del último día de una acción.",
    "Idea coach": "Asesor de ideas",
    "Review my stock idea": "Revisar mi idea de acción",
    "Stock": "Acción",
    "My idea": "Mi idea",
    "I am thinking about holding": "Estoy pensando en mantener",
    "I am thinking about buying": "Estoy pensando en comprar",
    "I am thinking about selling": "Estoy pensando en vender",
    "Explain your thinking": "Explica tu razonamiento",
    "Review idea": "Revisar idea",
    "Ready when you are.": "Listo cuando tú lo estés.",
    "Write your idea, choose the stock, then press Review idea.": "Escribe tu idea, elige la acción y pulsa Revisar idea.",
    "Tiny dashboard personality": "Un poco de personalidad",
    "Turn on stock puns?": "¿Activar chistes de acciones?",
    "Add a controlled amount of small popups, light jokes, and investing puns while you click around.": "Añade una cantidad controlada de ventanas pequeñas, bromas ligeras y juegos de palabras mientras navegas.",
    "Sample:": "Ejemplo:",
    "Keep it serious": "Mantenerlo serio",
    "Add a little fun": "Añadir diversión",
    "Latest close": "Último cierre",
    "Day move": "Movimiento diario",
    "Market cap": "Capitalización",
    "P/E ratio": "Ratio P/E",
    "Research section": "Sección de investigación",
    "Daily review": "Revisión diaria",
    "Revenue": "Ingresos",
    "Net income": "Beneficio neto",
    "Quick summary": "Resumen rápido",
    "AI explanation": "Explicación de IA",
    "AI buy/sell check": "Chequeo comprar/vender de IA",
    "Educational signal, not personal financial advice.": "Señal educativa, no consejo financiero personal.",
    "User ideas": "Ideas del usuario",
    "Verify with ChatGPT": "Verificar con ChatGPT",
    "Write your ideas here.": "Escribe tus ideas aquí.",
    "One question I still have": "Una pregunta que aún tengo",
    "Write one question here.": "Escribe una pregunta aquí.",
    "Range high close": "Máximo cierre del rango",
    "Range low close": "Mínimo cierre del rango",
    "Clear View": "Vista clara",
    "Slideshow Review": "Revisión en diapositivas",
    "Previous close": "Cierre anterior",
    "Daily change": "Cambio diario",
    "Volume": "Volumen",
    "ChatGPT-style buy/sell review": "Revisión comprar/vender estilo ChatGPT",
    "Back": "Atrás",
    "Next": "Siguiente",
    "Fun mode is on. Small puns, controlled dosage.": "Modo divertido activado. Bromas pequeñas, dosis controlada.",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA y COST cargados desde archivos JSON locales.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA y COST cargados. Última actualización:",
    "Slide": "Diapositiva",
    "of": "de",
  },
  fr: {
    "Local JSON stock project": "Projet boursier JSON local",
    "Stock Research Dashboard": "Tableau de recherche boursière",
    "Language": "Langue",
    "Chart Range": "Période du graphique",
    "Choose how much price history the charts should show.": "Choisissez la quantité d'historique de prix à afficher.",
    "Explore stocks": "Explorer les actions",
    "End-of-day review": "Revue de fin de journée",
    "Open idea coach": "Ouvrir le coach d'idées",
    "Fun mode": "Mode amusant",
    "Emoji hints": "Indices emoji",
    "Emoji hints on": "Emojis activés",
    "Emoji hints off": "Emojis désactivés",
    "Stock Navigator": "Navigateur d'actions",
    "Company Cards": "Cartes des entreprises",
    "Loading local price data...": "Chargement des données locales...",
    "Company Research Sections": "Sections de recherche",
    "End-of-Day Market Review": "Revue du marché en fin de journée",
    "Idea coach": "Coach d'idées",
    "Review my stock idea": "Analyser mon idée d'action",
    "Stock": "Action",
    "My idea": "Mon idée",
    "I am thinking about holding": "Je pense conserver",
    "I am thinking about buying": "Je pense acheter",
    "I am thinking about selling": "Je pense vendre",
    "Explain your thinking": "Explique ton raisonnement",
    "Review idea": "Analyser l'idée",
    "Ready when you are.": "Prêt quand tu l'es.",
    "Tiny dashboard personality": "Petite touche de personnalité",
    "Turn on stock puns?": "Activer les jeux de mots boursiers ?",
    "Sample:": "Exemple :",
    "Keep it serious": "Rester sérieux",
    "Add a little fun": "Ajouter un peu d'humour",
    "Latest close": "Dernière clôture",
    "Day move": "Mouvement du jour",
    "Market cap": "Capitalisation",
    "P/E ratio": "Ratio cours/bénéfice",
    "Research section": "Section recherche",
    "Daily review": "Revue quotidienne",
    "Revenue": "Chiffre d'affaires",
    "Net income": "Résultat net",
    "Quick summary": "Résumé rapide",
    "AI explanation": "Explication IA",
    "AI buy/sell check": "Vérification achat/vente IA",
    "Educational signal, not personal financial advice.": "Signal éducatif, pas un conseil financier personnel.",
    "User ideas": "Idées utilisateur",
    "Verify with ChatGPT": "Vérifier avec ChatGPT",
    "One question I still have": "Une question restante",
    "Clear View": "Vue claire",
    "Slideshow Review": "Revue en diapositives",
    "Previous close": "Clôture précédente",
    "Daily change": "Variation du jour",
    "Volume": "Volume",
    "ChatGPT-style buy/sell review": "Revue achat/vente style ChatGPT",
    "Back": "Retour",
    "Next": "Suivant",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA et COST chargés depuis les fichiers JSON locaux.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA et COST chargés. Dernière mise à jour :",
    "Slide": "Diapositive",
    "of": "sur",
  },
  hi: {
    "Local JSON stock project": "स्थानीय JSON स्टॉक प्रोजेक्ट",
    "Stock Research Dashboard": "स्टॉक रिसर्च डैशबोर्ड",
    "Language": "भाषा",
    "Chart Range": "चार्ट सीमा",
    "Choose how much price history the charts should show.": "चुनें कि चार्ट कितना मूल्य इतिहास दिखाएं।",
    "Explore stocks": "स्टॉक देखें",
    "End-of-day review": "दिन के अंत की समीक्षा",
    "Open idea coach": "आइडिया कोच खोलें",
    "Fun mode": "मज़ेदार मोड",
    "Emoji hints": "इमोजी संकेत",
    "Emoji hints on": "इमोजी चालू",
    "Emoji hints off": "इमोजी बंद",
    "Stock Navigator": "स्टॉक नेविगेटर",
    "Company Cards": "कंपनी कार्ड",
    "Loading local price data...": "स्थानीय मूल्य डेटा लोड हो रहा है...",
    "Company Research Sections": "कंपनी रिसर्च सेक्शन",
    "End-of-Day Market Review": "दिन के अंत की मार्केट समीक्षा",
    "Idea coach": "आइडिया कोच",
    "Review my stock idea": "मेरे स्टॉक विचार की समीक्षा करें",
    "Stock": "स्टॉक",
    "My idea": "मेरा विचार",
    "I am thinking about holding": "मैं होल्ड करने के बारे में सोच रहा हूँ",
    "I am thinking about buying": "मैं खरीदने के बारे में सोच रहा हूँ",
    "I am thinking about selling": "मैं बेचने के बारे में सोच रहा हूँ",
    "Explain your thinking": "अपनी सोच समझाएँ",
    "Review idea": "विचार की समीक्षा करें",
    "Ready when you are.": "जब आप तैयार हों, मैं तैयार हूँ।",
    "Keep it serious": "गंभीर रखें",
    "Add a little fun": "थोड़ा मज़ा जोड़ें",
    "Latest close": "नवीनतम बंद भाव",
    "Day move": "दिन की चाल",
    "Market cap": "मार्केट कैप",
    "P/E ratio": "P/E अनुपात",
    "Research section": "रिसर्च सेक्शन",
    "Daily review": "दैनिक समीक्षा",
    "Revenue": "राजस्व",
    "Net income": "शुद्ध आय",
    "Quick summary": "त्वरित सारांश",
    "AI explanation": "AI व्याख्या",
    "User ideas": "उपयोगकर्ता विचार",
    "Verify with ChatGPT": "ChatGPT से जांचें",
    "One question I still have": "मेरा एक सवाल अभी बाकी है",
    "Clear View": "स्पष्ट दृश्य",
    "Slideshow Review": "स्लाइडशो समीक्षा",
    "Previous close": "पिछला बंद भाव",
    "Daily change": "दैनिक बदलाव",
    "Volume": "वॉल्यूम",
    "Back": "पीछे",
    "Next": "आगे",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA और COST स्थानीय JSON फ़ाइलों से लोड हो गए।",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA और COST लोड हो गए। अंतिम अपडेट:",
    "Slide": "स्लाइड",
    "of": "में से",
  },
};

function t(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function withEmoji(type, text) {
  if (!emojiModeEnabled) {
    return text;
  }

  const emojis = {
    summary: "📌",
    chart: "📈",
    ai: "🧠",
    question: "❓",
    daily: "🌙",
    idea: "💡",
    fun: "✨",
  };

  return `<span class="context-emoji" aria-hidden="true">${emojis[type] || "•"}</span>${text}`;
}

function updateEmojiButtonText() {
  emojiModeToggle.textContent = emojiModeEnabled
    ? t("Emoji hints on")
    : t("Emoji hints off");
  emojiModeToggle.classList.toggle("active", emojiModeEnabled);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  languageSelect.value = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  updateEmojiButtonText();
}

function setupLanguagePicker() {
  applyLanguage();

  languageSelect.addEventListener("change", () => {
    localStorage.setItem("dashboardLanguage", languageSelect.value);
    window.location.reload();
  });
}

function getSelectedRangeOption() {
  return chartRanges.find((range) => range.key === selectedRange) || chartRanges[5];
}

function subtractRangeFromDate(date, range) {
  const cutoff = new Date(date);

  if (range.days) {
    cutoff.setDate(cutoff.getDate() - range.days);
  }

  if (range.months) {
    cutoff.setMonth(cutoff.getMonth() - range.months);
  }

  if (range.years) {
    cutoff.setFullYear(cutoff.getFullYear() - range.years);
  }

  return cutoff;
}

function getRangePrices(prices, rangeKey = selectedRange) {
  if (!prices.length) {
    return prices;
  }

  const range = chartRanges.find((item) => item.key === rangeKey) || getSelectedRangeOption();

  if (range.key === "MAX") {
    return prices;
  }

  if (range.rows) {
    return prices.slice(-range.rows);
  }

  const latestDate = new Date(prices[prices.length - 1].date);
  const cutoff = subtractRangeFromDate(latestDate, range);
  const filtered = prices.filter((row) => new Date(row.date) >= cutoff);

  return filtered.length ? filtered : prices.slice(-1);
}

function getRangedData(dataByTicker) {
  const rangedData = {};

  companies.forEach((company) => {
    rangedData[company.ticker] = getRangePrices(dataByTicker[company.ticker] || []);
  });

  return rangedData;
}

function createRangeControlsHtml() {
  return `
    <div class="range-controls" aria-label="Chart range">
      ${chartRanges
        .map(
          (range) => `
            <button class="${range.key === selectedRange ? "active" : ""}" type="button" data-chart-range="${range.key}">
              ${range.label}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function setupRangeControls() {
  document.querySelectorAll("[data-chart-range]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRange = button.dataset.chartRange;
      localStorage.setItem("chartRange", selectedRange);

      if (Object.keys(currentDataByTicker).length) {
        renderDashboard(currentDataByTicker);
      }

      maybeShowPun();
    });
  });
}

function openResponseModal(title, buildHtml, delay = 250) {
  if (responseTimer) {
    clearTimeout(responseTimer);
  }

  responseModalTitle.textContent = title;
  responseBody.innerHTML = "";
  responseBody.classList.remove("ready");
  responseLoading.style.display = "grid";
  responseModal.classList.add("open");
  responseModal.setAttribute("aria-hidden", "false");

  responseTimer = setTimeout(() => {
    responseLoading.style.display = "none";
    responseBody.innerHTML = buildHtml();
    responseBody.classList.add("ready");
    responseTimer = null;
  }, delay);
}

function closeResponse() {
  if (responseTimer) {
    clearTimeout(responseTimer);
    responseTimer = null;
  }

  responseModal.classList.remove("open");
  responseModal.setAttribute("aria-hidden", "true");
}

function setupResponseModal() {
  closeResponseModal.addEventListener("click", closeResponse);

  responseModal.addEventListener("click", (event) => {
    if (event.target === responseModal) {
      closeResponse();
    }
  });
}

function renderDashboard(dataByTicker) {
  const rangedDataByTicker = getRangedData(dataByTicker);

  companyCards.innerHTML = companies
    .map((company) =>
      createCompanyCard(
        company,
        rangedDataByTicker[company.ticker],
        getFundamentals(company.ticker),
        getAiExplanation(company.ticker),
        getAiAction(company.ticker),
      ),
    )
    .join("");

  companySections.innerHTML = companies
    .map((company) =>
      createCompanySection(
        company,
        rangedDataByTicker[company.ticker],
        getFundamentals(company.ticker),
        getAiExplanation(company.ticker),
        getAiAction(company.ticker),
      ),
    )
    .join("");

  setupRangeControls();
  const activeTab = document.querySelector(".daily-tab.active");
  const activeTicker = activeTab ? activeTab.dataset.ticker : companies[0].ticker;
  showDailyStock(activeTicker, dataByTicker);
  setupPrivateFields();
  setupIdeaButtons();
  drawAllCharts(dataByTicker);
}

function setupEmojiMode() {
  updateEmojiButtonText();

  emojiModeToggle.addEventListener("click", () => {
    emojiModeEnabled = !emojiModeEnabled;
    localStorage.setItem("emojiModeEnabled", String(emojiModeEnabled));
    updateEmojiButtonText();

    if (Object.keys(currentDataByTicker).length) {
      renderDashboard(currentDataByTicker);
    }
  });
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function formatNumber(value) {
  return value.toLocaleString("en-US");
}

function formatLargeMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Not available";
  }

  const number = Number(value);

  if (Math.abs(number) >= 1_000_000_000_000) {
    return `$${(number / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (Math.abs(number) >= 1_000_000_000) {
    return `$${(number / 1_000_000_000).toFixed(2)}B`;
  }

  if (Math.abs(number) >= 1_000_000) {
    return `$${(number / 1_000_000).toFixed(2)}M`;
  }

  return formatMoney(number);
}

function formatRatio(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Not available";
  }

  return Number(value).toFixed(2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFundamentals(ticker) {
  if (window.FUNDAMENTALS_DATA && window.FUNDAMENTALS_DATA[ticker]) {
    return window.FUNDAMENTALS_DATA[ticker];
  }

  return {
    revenue: null,
    netIncome: null,
    marketCap: null,
    peRatio: null,
  };
}

function getAiExplanation(ticker) {
  if (window.AI_EXPLANATIONS && window.AI_EXPLANATIONS[ticker]) {
    return window.AI_EXPLANATIONS[ticker];
  }

  return "AI explanation will appear after the refresh script runs.";
}

function getAiAction(ticker) {
  if (window.AI_ACTIONS && window.AI_ACTIONS[ticker]) {
    return window.AI_ACTIONS[ticker];
  }

  return {
    action: "Research first",
    className: "action-neutral",
    reason: "AI buy/sell check will appear after the refresh script runs.",
  };
}

function getAiQuickSummary(ticker, aiAction) {
  const snapshot = getStockSnapshot(ticker);
  const moveDirection = snapshot.rangeChange >= 0 ? "up" : "down";
  const valuation = getValuationLabel(snapshot.peRatio);
  const signal = aiAction.action || "Research first";

  return `${ticker} is ${moveDirection} ${Math.abs(snapshot.rangeChange).toFixed(1)}% over the selected chart range, with ${valuation}. Quick read: ${signal}; use this as a starting point, not a final decision.`;
}

function getDailyAnalysis(ticker) {
  if (window.DAILY_ANALYSIS && window.DAILY_ANALYSIS[ticker]) {
    return window.DAILY_ANALYSIS[ticker];
  }

  return {
    className: "daily-flat",
    headline: "End-of-day analysis will appear after the refresh script runs.",
    explanation:
      "Run python3 scripts/download_aapl.py after the market closes to create the daily analysis file.",
  };
}

function getRefreshText() {
  if (!window.DASHBOARD_REFRESHED_AT) {
    return t("Loaded AAPL, NVDA, and COST from local JSON files.");
  }

  const date = new Date(window.DASHBOARD_REFRESHED_AT);

  if (Number.isNaN(date.getTime())) {
    return t("Loaded AAPL, NVDA, and COST from local JSON files.");
  }

  return `${t("Loaded AAPL, NVDA, and COST. Last refreshed:")} ${date.toLocaleString()}.`;
}

function openFunModeChoice() {
  funModeModal.classList.add("open");
  funModeModal.setAttribute("aria-hidden", "false");
}

function closeFunModeChoice() {
  funModeModal.classList.remove("open");
  funModeModal.setAttribute("aria-hidden", "true");
}

function setFunMode(enabled) {
  funModeEnabled = enabled;
  localStorage.setItem("funModeEnabled", String(enabled));
  localStorage.setItem("funModeChoiceMade", "true");
  closeFunModeChoice();

  if (enabled) {
    showPunToast(t("Fun mode is on. Small puns, controlled dosage."));
  }
}

function showPunToast(customText = "") {
  const now = Date.now();

  if (!funModeEnabled && !customText) {
    return;
  }

  if (!customText && punsShownThisSession >= 4) {
    return;
  }

  if (!customText && now - lastPunTime < 9000) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "pun-toast";
  toast.textContent =
    customText || stockPuns[Math.floor(Math.random() * stockPuns.length)];

  punToastArea.appendChild(toast);
  punsShownThisSession += customText ? 0 : 1;
  lastPunTime = now;

  setTimeout(() => {
    toast.classList.add("leaving");
  }, 4200);

  setTimeout(() => {
    toast.remove();
  }, 4800);
}

function maybeShowPun() {
  if (!funModeEnabled) {
    return;
  }

  if (Math.random() < 0.45) {
    showPunToast();
  }
}

async function loadJson(file) {
  const ticker = file.split("/").pop().replace(".json", "");

  if (window.PRICE_DATA && window.PRICE_DATA[ticker]) {
    return window.PRICE_DATA[ticker];
  }

  const response = await fetch(file);

  if (!response.ok) {
    throw new Error(`Could not load ${file}`);
  }

  return response.json();
}

function cleanPrices(rows) {
  return rows
    .filter((row) => row.date && typeof row.close === "number")
    .map((row) => ({
      date: row.date,
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
      volume: row.volume,
    }));
}

function createMetric(label, value) {
  return `
    <div class="metric">
      <span>${t(label)}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function createValueEffect(change) {
  if (change.className === "change-up") {
    return `
      <span class="value-effect gain-effect" aria-hidden="true">
        <span>$</span>
        <span>$</span>
        <span>$</span>
      </span>
    `;
  }

  if (change.className === "change-down") {
    return `
      <span class="value-effect drop-effect" aria-hidden="true">
        <span>↓</span>
        <span>↓</span>
        <span>↓</span>
      </span>
    `;
  }

  return "";
}

function createChangeMetric(label, change) {
  return `
    <div class="metric metric-effect ${change.className}">
      <span>${t(label)}</span>
      <strong>${change.arrow} ${change.text}</strong>
      ${createValueEffect(change)}
    </div>
  `;
}

function getPriceChange(prices) {
  const startPrice = prices[0].close;
  const endPrice = prices[prices.length - 1].close;
  const percent = ((endPrice - startPrice) / startPrice) * 100;

  if (percent > 0) {
    return {
      className: "change-up",
      arrow: "↑",
      text: `${percent.toFixed(1)}%`,
    };
  }

  if (percent < 0) {
    return {
      className: "change-down",
      arrow: "↓",
      text: `${Math.abs(percent).toFixed(1)}%`,
    };
  }

  return {
    className: "change-flat",
    arrow: "→",
    text: "0.0%",
  };
}

function getStockSnapshot(ticker) {
  const company = getCompany(ticker);
  const prices = getRangePrices(currentDataByTicker[ticker] || []);
  const fundamentals = getFundamentals(ticker);
  const dailyAnalysis = getDailyAnalysis(ticker);
  const latestDay = prices[prices.length - 1] || {};
  const firstDay = prices[0] || latestDay;
  const closes = prices.map((row) => Number(row.close)).filter((value) => !Number.isNaN(value));
  const latestClose = Number(latestDay.close || dailyAnalysis.close || 0);
  const rangeStart = Number(firstDay.close || latestClose || 0);
  const rangeChange = rangeStart
    ? ((latestClose - rangeStart) / rangeStart) * 100
    : 0;
  const highClose = closes.length ? Math.max(...closes) : latestClose;
  const lowClose = closes.length ? Math.min(...closes) : latestClose;
  const distanceFromHigh = highClose
    ? ((latestClose - highClose) / highClose) * 100
    : 0;
  const distanceFromLow = lowClose
    ? ((latestClose - lowClose) / lowClose) * 100
    : 0;
  const peRatio = Number(fundamentals.peRatio);

  return {
    company,
    prices,
    fundamentals,
    dailyAnalysis,
    aiAction: getAiAction(ticker),
    latestClose,
    latestVolume: Number(latestDay.volume || 0),
    rangeChange,
    highClose,
    lowClose,
    distanceFromHigh,
    distanceFromLow,
    peRatio: Number.isNaN(peRatio) ? null : peRatio,
  };
}

function getValuationLabel(peRatio) {
  if (peRatio === null) {
    return "valuation data is not available";
  }

  if (peRatio >= 45) {
    return "valuation looks expensive, so growth needs to justify the price";
  }

  if (peRatio >= 25) {
    return "valuation is moderate-to-high, so compare it with growth and competitors";
  }

  if (peRatio > 0) {
    return "valuation looks lower than many growth stocks, but still needs business-quality checks";
  }

  return "P/E is not useful here, so use other fundamentals instead";
}

function createChangeBadge(prices) {
  const change = getPriceChange(prices);

  return `
    <div class="change-badge ${change.className}">
      <span>${change.arrow}</span>
      <strong>${change.text}</strong>
      <small>1Y</small>
      ${createValueEffect(change)}
    </div>
  `;
}

function getDailyChange(dailyAnalysis) {
  const percent = Number(dailyAnalysis.percentChange || 0);

  if (percent > 0) {
    return {
      className: "change-up",
      arrow: "↑",
      text: `${percent.toFixed(2)}%`,
    };
  }

  if (percent < 0) {
    return {
      className: "change-down",
      arrow: "↓",
      text: `${Math.abs(percent).toFixed(2)}%`,
    };
  }

  return {
    className: "change-flat",
    arrow: "→",
    text: "0.00%",
  };
}

function createDailyChangeBadge(dailyAnalysis) {
  const change = getDailyChange(dailyAnalysis);

  return `
    <div class="change-badge ${change.className}">
      <span>${change.arrow}</span>
      <strong>${change.text}</strong>
      <small>DAY</small>
      ${createValueEffect(change)}
    </div>
  `;
}

function createEducationalReview(company, dailyAnalysis, aiAction) {
  const percent = Number(dailyAnalysis.percentChange || 0);
  const absPercent = Math.abs(percent);
  const actionText = aiAction.action.toLowerCase();

  if (actionText.includes("buy")) {
    return {
      stance: "Buy-watch review",
      className: "review-buy",
      allocation: "Sample range: 1% to 3% of a practice portfolio",
      explanation:
        `${company.ticker} has a positive research signal, but the daily move should still be checked against valuation and risk. A beginner-friendly approach would be to study a small starter-size example instead of jumping in all at once.`,
      caution:
        "This is not personal financial advice. Use it as a research example and decide your own risk limit.",
    };
  }

  if (actionText.includes("sell") || actionText.includes("avoid")) {
    return {
      stance: "Reduce / avoid review",
      className: "review-sell",
      allocation: "Sample trim range: 10% to 25% of an existing practice position",
      explanation:
        `${company.ticker} has a cautious signal. If this were a practice portfolio, the review would focus on protecting risk, checking why the stock moved, and avoiding a rushed buy after a weak day.`,
      caution:
        "This is not a command to sell. It is an educational risk-management example.",
    };
  }

  if (absPercent >= 3) {
    return {
      stance: "Wait for confirmation",
      className: "review-hold",
      allocation: "Sample range: 0% new buy until the next review",
      explanation:
        `${company.ticker} had a large daily move, so the safer research habit is to wait for another day of price action before deciding whether the move is meaningful or just short-term volatility.`,
      caution:
        "Large one-day moves can reverse quickly. Review news, volume, and valuation before acting.",
    };
  }

  return {
    stance: "Hold / research more",
    className: "review-hold",
    allocation: "Sample range: 0% to 1% watchlist-only practice position",
    explanation:
      `${company.ticker} does not show a strong enough daily setup by itself. The review points toward watching the stock, comparing it with fundamentals, and waiting for a clearer reason.`,
    caution:
      "This is educational only and should not replace your own research.",
  };
}

function createReviewSlides(company, dailyAnalysis, review, latestDay, previousDay) {
  return [
    {
      title: "Daily move",
      body: dailyAnalysis.explanation,
    },
    {
      title: "Price check",
      body: `${company.ticker} moved from ${formatMoney(previousDay.close)} to ${formatMoney(latestDay.close)}. Volume was ${formatNumber(latestDay.volume)} shares.`,
    },
    {
      title: "ChatGPT-style review",
      body: review.explanation,
    },
    {
      title: "Educational position idea",
      body: `${review.allocation}. ${review.caution}`,
    },
  ];
}

function buildDailyFullResponse(company, prices) {
  const snapshot = getStockSnapshot(company.ticker);
  const dailyAnalysis = getDailyAnalysis(company.ticker);
  const aiAction = getAiAction(company.ticker);
  const review = createEducationalReview(company, dailyAnalysis, aiAction);
  const latestDay = prices[prices.length - 1];
  const previousDay = prices[prices.length - 2] || latestDay;

  return `
    <div class="daily-analysis ${dailyAnalysis.className}">
      <strong>${dailyAnalysis.headline}</strong>
      <p>${withEmoji("daily", dailyAnalysis.explanation)}</p>
    </div>

    <div class="review-card ${review.className}">
      <label>${t("ChatGPT-style buy/sell review")}</label>
      <strong>${review.stance}</strong>
      <p>${withEmoji("idea", review.explanation)}</p>
      <div class="allocation-box">${review.allocation}</div>
      <small>${review.caution}</small>
    </div>

    <div class="metric-grid">
      ${createMetric("Previous close", formatMoney(previousDay.close))}
      ${createMetric("Latest close", formatMoney(latestDay.close))}
      ${createChangeMetric("Daily change", getDailyChange(dailyAnalysis))}
      ${createMetric("Range move", `${snapshot.rangeChange.toFixed(1)}%`)}
      ${createMetric("P/E ratio", formatRatio(snapshot.fundamentals.peRatio))}
      ${createMetric("Volume", formatNumber(latestDay.volume))}
    </div>

    <small>Educational review only, not personal financial advice. This faster response is generated locally from saved dashboard data including price trend, valuation, and fundamentals.</small>
  `;
}

function createAiBlock(ticker, aiExplanation, aiAction) {
  const quickSummary = getAiQuickSummary(ticker, aiAction);

  return `
    <div class="ai-row">
      <div class="ai-summary-grid">
        <div>
          <label>${t("Quick summary")}</label>
          <p class="ai-quick-summary">${withEmoji("ai", quickSummary)}</p>
        </div>

        <div>
          <label>${t("AI explanation")}</label>
          <p class="ai-explanation">${withEmoji("ai", aiExplanation)}</p>
        </div>
      </div>

      <div>
        <label>${t("AI buy/sell check")}</label>
        <div class="ai-action ${aiAction.className}">
          <strong>${aiAction.action}</strong>
          <p>${aiAction.reason}</p>
          <small>${t("Educational signal, not personal financial advice.")}</small>
        </div>
      </div>
    </div>
  `;
}

function createExplanationHeader(ticker, targetId) {
  return `
    <div class="label-row">
      <label for="${targetId}">${t("User ideas")}</label>
      <button class="idea-button" type="button" data-verify-idea="${ticker}" data-idea-source="${targetId}">
        ${t("Verify with ChatGPT")}
      </button>
    </div>
  `;
}

function createCompanyCard(
  company,
  prices,
  fundamentals,
  aiExplanation,
  aiAction,
) {
  const latestPrice = prices[prices.length - 1].close;

  return `
    <article class="company-card ${company.accentClass}">
      <div class="card-top">
        <h3>${company.name}</h3>
        <span class="ticker-pill">${company.ticker}</span>
      </div>

      <p class="summary">${withEmoji("summary", company.summary)}</p>

      <div class="metric-grid">
        ${createMetric("Latest close", formatMoney(latestPrice))}
        ${createMetric("Revenue", formatLargeMoney(fundamentals.revenue))}
        ${createMetric("Net income", formatLargeMoney(fundamentals.netIncome))}
        ${createMetric("Market cap", formatLargeMoney(fundamentals.marketCap))}
        ${createMetric("P/E ratio", formatRatio(fundamentals.peRatio))}
      </div>

      <div class="chart-block">
        ${createRangeControlsHtml()}
        <div class="chart-row">
          <canvas class="mini-chart" id="miniChart-${company.ticker}"></canvas>
          ${createChangeBadge(prices)}
        </div>
      </div>

      <div class="note-group">
        <div>
          ${createExplanationHeader(company.ticker, `cardExplanation-${company.ticker}`)}
          <textarea class="user-ideas-box" id="cardExplanation-${company.ticker}" data-storage-key="explanation-${company.ticker}" placeholder="${t("Write your ideas here.")}"></textarea>
        </div>

        ${createAiBlock(company.ticker, aiExplanation, aiAction)}

        <div>
          <label for="cardQuestion-${company.ticker}">${t("One question I still have")}</label>
          <input id="cardQuestion-${company.ticker}" data-storage-key="question-${company.ticker}" placeholder="${t("Write one question here.")}">
        </div>
      </div>
    </article>
  `;
}

function createCompanySection(
  company,
  prices,
  fundamentals,
  aiExplanation,
  aiAction,
) {
  const latestRows = prices.slice(-5).reverse();
  const latestPrice = prices[prices.length - 1].close;
  const closes = prices.map((row) => row.close);
  const highClose = Math.max(...closes);
  const lowClose = Math.min(...closes);

  const tableRows = latestRows
    .map(
      (row) => `
        <tr>
          <td>${row.date}</td>
          <td>${formatMoney(row.open)}</td>
          <td>${formatMoney(row.high)}</td>
          <td>${formatMoney(row.low)}</td>
          <td>${formatMoney(row.close)}</td>
          <td>${formatNumber(row.volume)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <article class="research-panel ${company.accentClass}" id="${company.ticker}">
      <div class="panel-top">
        <div>
          <h3>${company.name}</h3>
          <p class="summary">${withEmoji("summary", company.summary)}</p>
        </div>
        <span class="ticker-pill">${company.ticker}</span>
      </div>

      <div class="panel-layout">
        <div>
          <div class="chart-block">
            ${createRangeControlsHtml()}
            <div class="chart-row chart-row-large">
              <canvas class="large-chart" id="largeChart-${company.ticker}"></canvas>
              ${createChangeBadge(prices)}
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Close</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>
        </div>

        <div class="panel-side">
          <div class="metric-grid">
            ${createMetric("Latest close", formatMoney(latestPrice))}
            ${createMetric("Range high close", formatMoney(highClose))}
            ${createMetric("Range low close", formatMoney(lowClose))}
            ${createMetric("Revenue", formatLargeMoney(fundamentals.revenue))}
            ${createMetric("Net income", formatLargeMoney(fundamentals.netIncome))}
            ${createMetric("Market cap", formatLargeMoney(fundamentals.marketCap))}
            ${createMetric("P/E ratio", formatRatio(fundamentals.peRatio))}
          </div>

          <div>
            ${createExplanationHeader(company.ticker, `sectionExplanation-${company.ticker}`)}
            <textarea class="user-ideas-box" id="sectionExplanation-${company.ticker}" data-storage-key="section-explanation-${company.ticker}" placeholder="${t("Write your ideas here.")}"></textarea>
          </div>

          ${createAiBlock(company.ticker, aiExplanation, aiAction)}

          <div>
            <label for="sectionQuestion-${company.ticker}">${t("One question I still have")}</label>
            <input id="sectionQuestion-${company.ticker}" data-storage-key="section-question-${company.ticker}" placeholder="${t("Write one question here.")}">
          </div>
        </div>
      </div>
    </article>
  `;
}

function createDailyTabs(activeTicker) {
  return companies
    .map(
      (company) => `
        <button class="daily-tab ${company.ticker === activeTicker ? "active" : ""}" data-ticker="${company.ticker}">
          <span>${company.name}</span>
          <strong>${company.ticker}</strong>
        </button>
      `,
    )
    .join("");
}

function createDailyPanel(company, prices) {
  const dailyAnalysis = getDailyAnalysis(company.ticker);
  const aiAction = getAiAction(company.ticker);
  const review = createEducationalReview(company, dailyAnalysis, aiAction);
  const latestRows = prices.slice(-2);
  const latestDay = latestRows[latestRows.length - 1];
  const previousDay = latestRows[0];
  const slides = createReviewSlides(company, dailyAnalysis, review, latestDay, previousDay);
  const activeSlide = slides[dailySlideIndex % slides.length];

  return `
    <article class="daily-detail ${company.accentClass}">
      <div class="daily-detail-top">
        <div>
          <span class="ticker-pill">${company.ticker}</span>
          <h3>${company.name} daily move</h3>
          <p>${dailyAnalysis.date || latestDay.date}</p>
        </div>

        <div class="review-mode">
          <button class="${dailyViewMode === "clear" ? "active" : ""}" data-review-mode="clear">${t("Clear View")}</button>
          <button class="${dailyViewMode === "slides" ? "active" : ""}" data-review-mode="slides">${t("Slideshow Review")}</button>
        </div>
      </div>

      <div class="daily-detail-grid">
        <div>
          <div class="chart-row chart-row-large">
            <canvas class="large-chart" id="dailyChart-${company.ticker}"></canvas>
            ${createDailyChangeBadge(dailyAnalysis)}
          </div>
        </div>

        <div class="daily-side">
          ${
            dailyViewMode === "clear"
              ? `
                <div class="metric-grid">
                  ${createMetric("Previous close", formatMoney(previousDay.close))}
                  ${createMetric("Latest close", formatMoney(latestDay.close))}
                  ${createChangeMetric("Daily change", getDailyChange(dailyAnalysis))}
                  ${createMetric("Volume", formatNumber(latestDay.volume))}
                </div>

                <div class="daily-analysis ${dailyAnalysis.className}">
                  <strong>${dailyAnalysis.headline}</strong>
                  <p>${withEmoji("daily", dailyAnalysis.explanation)}</p>
                </div>

                <div class="review-card ${review.className}">
                  <label>${t("ChatGPT-style buy/sell review")}</label>
                  <strong>${review.stance}</strong>
                  <p>${withEmoji("idea", review.explanation)}</p>
                  <div class="allocation-box">${review.allocation}</div>
                  <small>${review.caution}</small>
                  <div class="response-actions">
                    <button type="button" data-open-daily-response="${company.ticker}">${t("Open full response")}</button>
                  </div>
                </div>
              `
              : `
                <div class="slide-card ${review.className}">
                  <div class="slide-count">${t("Slide")} ${dailySlideIndex + 1} ${t("of")} ${slides.length}</div>
                  <h4>${activeSlide.title}</h4>
                  <p>${withEmoji("daily", activeSlide.body)}</p>
                  <div class="slide-controls">
                    <button data-slide-direction="previous">${t("Back")}</button>
                    <button data-slide-direction="next">${t("Next")}</button>
                  </div>
                </div>
              `
          }
        </div>
      </div>
    </article>
  `;
}

function drawDailyChart(company, prices) {
  const canvas = document.querySelector(`#dailyChart-${company.ticker}`);

  if (!canvas) {
    return;
  }

  drawLineChart(canvas, prices.slice(-2), company.color);
}

function showDailyStock(ticker, dataByTicker) {
  const company = companies.find((item) => item.ticker === ticker) || companies[0];

  dailyTabs.innerHTML = createDailyTabs(company.ticker);
  dailyPanel.innerHTML = createDailyPanel(company, dataByTicker[company.ticker]);
  drawDailyChart(company, dataByTicker[company.ticker]);

  document.querySelectorAll(".daily-tab").forEach((button) => {
    button.addEventListener("click", () => {
      dailySlideIndex = 0;
      showDailyStock(button.dataset.ticker, dataByTicker);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-review-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      dailyViewMode = button.dataset.reviewMode;
      dailySlideIndex = 0;
      showDailyStock(company.ticker, dataByTicker);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-slide-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.slideDirection;
      const slideCount = 4;

      if (direction === "previous") {
        dailySlideIndex = (dailySlideIndex + slideCount - 1) % slideCount;
      } else {
        dailySlideIndex = (dailySlideIndex + 1) % slideCount;
      }

      showDailyStock(company.ticker, dataByTicker);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-open-daily-response]").forEach((button) => {
    button.addEventListener("click", () => {
      openResponseModal(`${company.name} full review`, () =>
        buildDailyFullResponse(company, dataByTicker[company.ticker]),
      );
      maybeShowPun();
    });
  });
}

function getCompany(ticker) {
  return companies.find((company) => company.ticker === ticker) || companies[0];
}

function openIdeaCoach(ticker = "AAPL", sourceId = "") {
  const sourceField = sourceId ? document.querySelector(`#${sourceId}`) : null;

  ideaTicker.value = ticker;

  if (sourceField && sourceField.value.trim()) {
    ideaText.value = sourceField.value.trim();
  }

  coachResponse.innerHTML = `
    <strong>Ready to review ${ticker}.</strong>
    <p>${withEmoji("idea", "Add your buy, hold, or sell thinking, then press Review idea.")}</p>
  `;

  ideaModal.classList.add("open");
  ideaModal.setAttribute("aria-hidden", "false");
  ideaText.focus();
}

function closeIdeaCoach() {
  ideaModal.classList.remove("open");
  ideaModal.setAttribute("aria-hidden", "true");
}

function buildCoachResponse(ticker, action, idea) {
  const snapshot = getStockSnapshot(ticker);
  const { company, fundamentals, dailyAnalysis, aiAction } = snapshot;
  const dailyPercent = Number(dailyAnalysis.percentChange || 0);
  const ideaLower = idea.toLowerCase();
  const mentionsRisk = ideaLower.includes("risk") || ideaLower.includes("lose") || ideaLower.includes("drop");
  const mentionsLongTerm = ideaLower.includes("long") || ideaLower.includes("future") || ideaLower.includes("growth");

  let qualityNote = "Your idea is a starting point. Make it stronger by naming your time frame, risk limit, and what would prove you wrong.";

  if (mentionsRisk && mentionsLongTerm) {
    qualityNote = "Good start: you mentioned both risk and the bigger business view. Now add a specific price level or event that would change your mind.";
  } else if (mentionsRisk) {
    qualityNote = "Good risk awareness. Add what would make you comfortable buying or holding after the drop.";
  } else if (mentionsLongTerm) {
    qualityNote = "Good long-term thinking. Add a risk check so the idea does not depend only on optimism.";
  }

  const actionGuides = {
    buy: "For a buy idea, the review should ask: is the valuation reasonable, is the business still improving, and would I be okay if the stock falls more first?",
    hold: "For a hold idea, the review should ask: has the original reason for owning it changed, or is the daily move just noise?",
    sell: "For a sell idea, the review should ask: am I selling because the facts changed, or only because the price moved against me today?",
  };

  return `
    <strong>${company.name} (${ticker}) idea review</strong>
    <p>${withEmoji("idea", actionGuides[action])}</p>
    <ul>
      <li>Latest close: ${snapshot.latestClose ? formatMoney(snapshot.latestClose) : "Not available"}.</li>
      <li>Latest daily move: ${dailyPercent.toFixed(2)}%.</li>
      <li>Selected range move: ${snapshot.rangeChange.toFixed(1)}%.</li>
      <li>Distance from range high: ${snapshot.distanceFromHigh.toFixed(1)}%.</li>
      <li>P/E ratio: ${formatRatio(fundamentals.peRatio)}.</li>
      <li>Dashboard signal: ${aiAction.action}.</li>
    </ul>
    <p>${withEmoji("chart", qualityNote)}</p>
    <p>${withEmoji("idea", `<strong>Faster, more grounded response:</strong> ${getValuationLabel(snapshot.peRatio)}. Your idea is worth researching, but do not treat this as an automatic ${action}. Compare the daily move, selected chart range, and your risk rule before deciding what to do.`)}</p>
    <small>Educational review only, not personal financial advice. This runs locally in the webpage, not through a private ChatGPT API.</small>
  `;
}

function buildUserIdeaVerification(ticker, idea) {
  const snapshot = getStockSnapshot(ticker);
  const { company, fundamentals, dailyAnalysis, aiAction } = snapshot;
  const dailyPercent = Number(dailyAnalysis.percentChange || 0);
  const ideaLower = idea.toLowerCase();
  const mentionsPrice = /\$|\d/.test(idea);
  const mentionsRisk = ideaLower.includes("risk") || ideaLower.includes("drop") || ideaLower.includes("lose") || ideaLower.includes("sell");
  const mentionsLongTerm = ideaLower.includes("long") || ideaLower.includes("future") || ideaLower.includes("growth") || ideaLower.includes("years");
  const mentionsTimeFrame = mentionsLongTerm || ideaLower.includes("day") || ideaLower.includes("week") || ideaLower.includes("month");
  const hasRevenue = fundamentals.revenue !== null && fundamentals.revenue !== undefined;
  const hasNetIncome = fundamentals.netIncome !== null && fundamentals.netIncome !== undefined;

  const pros = [
    `${company.name} has real business data in the dashboard, so your idea can be compared against price, valuation, and fundamentals instead of only a headline.`,
    `The latest close is ${snapshot.latestClose ? formatMoney(snapshot.latestClose) : "not available"}, giving you a concrete current price to judge your idea against.`,
    `The selected chart range move is ${snapshot.rangeChange.toFixed(1)}%, so the idea can be checked against the range you chose instead of only today's move.`,
  ];

  if (mentionsLongTerm) {
    pros.push("You mentioned a longer-term angle, which is useful because one trading day usually does not explain the whole business.");
  }

  if (mentionsRisk) {
    pros.push("You included risk thinking, which makes the idea more balanced and easier to test.");
  }

  if (hasRevenue && hasNetIncome) {
    pros.push(`Revenue is ${formatLargeMoney(fundamentals.revenue)} and net income is ${formatLargeMoney(fundamentals.netIncome)}, so the idea can be checked against actual business scale.`);
  }

  const cons = [
    `The latest daily move is ${dailyPercent.toFixed(2)}%, so short-term price movement could still be noise.`,
    `The P/E ratio is ${formatRatio(fundamentals.peRatio)}; ${getValuationLabel(snapshot.peRatio)}.`,
    `The latest close is ${Math.abs(snapshot.distanceFromHigh).toFixed(1)}% below the selected-range high and ${snapshot.distanceFromLow.toFixed(1)}% above the selected-range low, so entry timing still matters.`,
  ];

  if (!mentionsPrice) {
    cons.push("Your idea does not include a target price, stop point, or buy range yet, so it is hard to know when the idea is proven right or wrong.");
  }

  if (!mentionsRisk) {
    cons.push("Your idea does not clearly say what could go wrong yet. Add one risk that would make you wait or change your mind.");
  }

  if (!mentionsTimeFrame) {
    cons.push("Your idea does not say whether it is a short-term trade or long-term investment, so the review cannot judge it against the right time frame.");
  }

  const nextStep = mentionsPrice
    ? "Next step: write one rule for what would make you wait, buy smaller, or stop following the idea."
    : "Next step: add a price level, valuation reason, or event that would make the idea easier to verify.";

  return `
    <div class="coach-response">
      <strong>${company.name} (${ticker}) user idea check</strong>
      <p>${withEmoji("idea", `<strong>Your idea:</strong> ${escapeHtml(idea)}`)}</p>
      <ul>
        <li>Latest close: ${snapshot.latestClose ? formatMoney(snapshot.latestClose) : "Not available"}.</li>
        <li>Latest daily move: ${dailyPercent.toFixed(2)}%.</li>
        <li>Selected range move: ${snapshot.rangeChange.toFixed(1)}%.</li>
        <li>Selected range: ${formatMoney(snapshot.lowClose)} to ${formatMoney(snapshot.highClose)}.</li>
        <li>P/E ratio: ${formatRatio(fundamentals.peRatio)}.</li>
        <li>Revenue / net income: ${formatLargeMoney(fundamentals.revenue)} / ${formatLargeMoney(fundamentals.netIncome)}.</li>
        <li>Dashboard signal: ${aiAction.action}.</li>
      </ul>
    </div>

    <div class="review-card review-buy">
      <strong>Pros</strong>
      <ul>${pros.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>

    <div class="review-card review-sell">
      <strong>Cons / risks</strong>
      <ul>${cons.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>

    <div class="review-card review-hold">
      <strong>Beginner-friendly verdict</strong>
      <p>${withEmoji("chart", `${nextStep} Treat this as a research check, not a final buy or sell command.`)}</p>
      <small>Educational review only, not personal financial advice. This runs locally from the dashboard data.</small>
    </div>
  `;
}

function setupIdeaCoach() {
  startIdeaCoach.addEventListener("click", () => {
    openIdeaCoach("AAPL");
    maybeShowPun();
  });

  closeIdeaModal.addEventListener("click", closeIdeaCoach);

  ideaModal.addEventListener("click", (event) => {
    if (event.target === ideaModal) {
      closeIdeaCoach();
    }
  });

  reviewIdeaButton.addEventListener("click", () => {
    const idea = ideaText.value.trim();

    if (!idea) {
      coachResponse.innerHTML = `
        <strong>Add your idea first.</strong>
        <p>${withEmoji("idea", "Write what you are thinking about buying, holding, or selling, then I can review it.")}</p>
      `;
      return;
    }

    coachResponse.innerHTML = `
      <strong>Review opened.</strong>
      <p>${withEmoji("idea", "A full ChatGPT-style response is opening in its own popup so it has more room.")}</p>
    `;

    openResponseModal(`${ideaTicker.value} idea review`, () =>
      `<div class="coach-response">${buildCoachResponse(
        ideaTicker.value,
        ideaAction.value,
        idea,
      )}</div>`,
    );
    maybeShowPun();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && responseModal.classList.contains("open")) {
      closeResponse();
    } else if (event.key === "Escape" && ideaModal.classList.contains("open")) {
      closeIdeaCoach();
    }
  });
}

function setupIdeaButtons() {
  document.querySelectorAll("[data-idea-button]").forEach((button) => {
    button.addEventListener("click", () => {
      openIdeaCoach(button.dataset.ideaButton, button.dataset.ideaSource);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-verify-idea]").forEach((button) => {
    button.addEventListener("click", () => {
      const ticker = button.dataset.verifyIdea;
      const sourceField = document.querySelector(`#${button.dataset.ideaSource}`);
      const idea = sourceField ? sourceField.value.trim() : "";

      if (!idea) {
        openResponseModal(`${ticker} user idea check`, () => `
          <div class="coach-response">
            <strong>Add your idea first.</strong>
            <p>${withEmoji("idea", "Write your stock idea in the User ideas box, then press Verify with ChatGPT again.")}</p>
          </div>
        `, 350);
        return;
      }

      openResponseModal(`${ticker} user idea check`, () =>
        buildUserIdeaVerification(ticker, idea),
      );
      maybeShowPun();
    });
  });
}

function setupFunMode() {
  funModeSettings.addEventListener("click", openFunModeChoice);
  enableFunMode.addEventListener("click", () => setFunMode(true));
  disableFunMode.addEventListener("click", () => setFunMode(false));

  funModeModal.addEventListener("click", (event) => {
    if (event.target === funModeModal) {
      closeFunModeChoice();
    }
  });

  if (!localStorage.getItem("funModeChoiceMade")) {
    setTimeout(openFunModeChoice, 650);
  }
}

function setupPrivateFields() {
  const fields = document.querySelectorAll("[data-storage-key]");

  fields.forEach((field) => {
    const key = field.dataset.storageKey;
    const savedValue = localStorage.getItem(key);

    if (savedValue) {
      field.value = savedValue;
    }

    field.addEventListener("input", () => {
      localStorage.setItem(key, field.value);
    });
  });
}

function resizeCanvas(canvas) {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return { ctx, width, height };
}

function getChartColorForMove(prices, fallbackColor) {
  if (prices.length < 2) {
    return fallbackColor;
  }

  const startClose = Number(prices[0].close);
  const endClose = Number(prices[prices.length - 1].close);

  if (endClose > startClose) {
    return "#087d61";
  }

  if (endClose < startClose) {
    return "#bf4b39";
  }

  return fallbackColor;
}

function drawMovingArrow(ctx, points, progress, isUp, compact) {
  if (!points.length) {
    return;
  }

  const lastPointIndex = Math.max(points.length - 1, 1);
  const exactIndex = progress * lastPointIndex;
  const lowerIndex = Math.min(Math.floor(exactIndex), Math.max(points.length - 2, 0));
  const upperIndex = Math.min(points.length - 1, lowerIndex + 1);
  const localProgress = Math.min(Math.max(exactIndex - lowerIndex, 0), 1);
  const fromPoint = points[lowerIndex];
  const toPoint = points[upperIndex];
  const x = fromPoint.x + (toPoint.x - fromPoint.x) * localProgress;
  const y = fromPoint.y + (toPoint.y - fromPoint.y) * localProgress;
  const angle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);
  const size = compact ? 8 : 13;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = isUp ? "#087d61" : "#bf4b39";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = compact ? 2 : 3;
  ctx.shadowColor = "rgba(23, 32, 51, 0.28)";
  ctx.shadowBlur = compact ? 4 : 8;
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.72, -size * 0.62);
  ctx.lineTo(-size * 0.42, 0);
  ctx.lineTo(-size * 0.72, size * 0.62);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function drawLineChart(canvas, prices, color, compact = false, animate = true) {
  if (!canvas || !prices.length) {
    return;
  }

  const existingFrame = chartAnimationFrames.get(canvas);

  if (existingFrame) {
    cancelAnimationFrame(existingFrame);
  }

  const { ctx, width, height } = resizeCanvas(canvas);
  const padding = compact
    ? { top: 14, right: 10, bottom: 18, left: 10 }
    : { top: 24, right: 24, bottom: 42, left: 62 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const closes = prices.map((row) => row.close);
  const minClose = Math.min(...closes);
  const maxClose = Math.max(...closes);
  const pricePadding = (maxClose - minClose) * 0.08 || 1;
  const chartMin = minClose - pricePadding;
  const chartMax = maxClose + pricePadding;
  const moveColor = getChartColorForMove(prices, color);

  function xForIndex(index) {
    if (prices.length === 1) {
      return padding.left + chartWidth / 2;
    }

    return padding.left + (index / (prices.length - 1)) * chartWidth;
  }

  function yForClose(close) {
    const percent = (close - chartMin) / (chartMax - chartMin);
    return padding.top + chartHeight - percent * chartHeight;
  }

  const points = prices.map((row, index) => ({
    x: xForIndex(index),
    y: yForClose(row.close),
  }));
  const isUp = Number(prices[prices.length - 1].close) >= Number(prices[0].close);
  const duration = compact ? 820 : 1050;
  const startTime = performance.now();

  function drawFrame(progress) {
    const visibleCount = Math.max(1, Math.ceil(points.length * progress));
    const visiblePoints = points.slice(0, visibleCount);

    ctx.clearRect(0, 0, width, height);

    if (!compact) {
      ctx.font = "12px Arial";
      ctx.textBaseline = "middle";

      for (let i = 0; i <= 4; i += 1) {
        const percent = i / 4;
        const y = padding.top + percent * chartHeight;
        const price = chartMax - percent * (chartMax - chartMin);

        ctx.strokeStyle = "#e5eaf1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = "#647084";
        ctx.textAlign = "right";
        ctx.fillText(formatMoney(price), padding.left - 10, y);
      }

      ctx.fillStyle = "#647084";
      ctx.textAlign = "left";
      ctx.fillText(prices[0].date, padding.left, height - 18);
      ctx.textAlign = "right";
      ctx.fillText(prices[prices.length - 1].date, width - padding.right, height - 18);
    }

    ctx.strokeStyle = moveColor;
    ctx.lineWidth = compact ? 2 : 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    visiblePoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();

    if (prices.length === 1) {
      ctx.fillStyle = moveColor;
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, compact ? 4 : 5, 0, Math.PI * 2);
      ctx.fill();
      drawMovingArrow(ctx, points, 1, true, compact);
      return;
    }

    drawMovingArrow(ctx, points, progress, isUp, compact);
  }

  function animateFrame(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - (1 - rawProgress) ** 3;

    drawFrame(easedProgress);

    if (rawProgress < 1) {
      const frameId = requestAnimationFrame(animateFrame);
      chartAnimationFrames.set(canvas, frameId);
    } else {
      chartAnimationFrames.delete(canvas);
    }
  }

  if (animate) {
    drawFrame(0.01);
    const frameId = requestAnimationFrame(animateFrame);
    chartAnimationFrames.set(canvas, frameId);
  } else {
    drawFrame(1);
  }
}

function drawAllCharts(dataByTicker) {
  companies.forEach((company) => {
    const prices = getRangePrices(dataByTicker[company.ticker] || []);
    const miniCanvas = document.querySelector(`#miniChart-${company.ticker}`);
    const largeCanvas = document.querySelector(`#largeChart-${company.ticker}`);

    drawLineChart(miniCanvas, prices, company.color, true);
    drawLineChart(largeCanvas, prices, company.color);
  });
}

async function startDashboard() {
  try {
    const dataByTicker = {};

    for (const company of companies) {
      const rawRows = await loadJson(company.file);
      dataByTicker[company.ticker] = cleanPrices(rawRows);
    }

    currentDataByTicker = dataByTicker;

    renderDashboard(dataByTicker);

    window.addEventListener("resize", () => {
      drawAllCharts(dataByTicker);
      const activeTab = document.querySelector(".daily-tab.active");
      const activeTicker = activeTab ? activeTab.dataset.ticker : companies[0].ticker;
      const activeCompany =
        companies.find((company) => company.ticker === activeTicker) || companies[0];
      drawDailyChart(activeCompany, dataByTicker[activeCompany.ticker]);
    });

    loadStatus.textContent = getRefreshText();
  } catch (error) {
    loadStatus.textContent = error.message;
    console.error(error);
  }
}

setupLanguagePicker();
setupEmojiMode();
setupIdeaCoach();
setupResponseModal();
setupFunMode();
startDashboard();

```

## README.md

```markdown
# Stock Research Dashboard

This is a simple beginner-friendly website for comparing three companies:

- Apple (`AAPL`)
- Nvidia (`NVDA`)
- Costco Wholesale (`COST`)

The page reads local EODHD historical price JSON files from the `data/` folder and draws one-year close-price charts with JavaScript canvas. It also includes a stock navigator and a tabbed end-of-day review section.

## Project Structure

```text
stock-research-dashboard/
  index.html
  style.css
  app.js
  README.md
  .env.example
  data/
    AAPL.json
    NVDA.json
    COST.json
    daily_analysis.js
  scripts/
    download_aapl.py
```

## How To Run

From the project folder, start a local web server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

You can also open `index.html` directly in a browser because the chart data is embedded in `data/prices.js`.

## API Key Safety

The public website does not need an EODHD API key to load. It uses the saved files in `data/`.

The refresh script needs an API key only when someone wants to download fresh EODHD price data on their own computer. Each user should use their own local token.

Your real key belongs in a private `.env` file:

```text
EODHD_API_KEY=your_real_eodhd_api_key_here
```

Do not upload `.env` to GitHub or any website. This project includes `.gitignore` so `.env` is ignored.

The safe public template is `.env.example`. Other people can copy it, rename the copy to `.env`, and paste in their own EODHD key locally.

If this project is published online, do not include your own token in the code. Each visitor should use their own EODHD token on their own device.

## How To Refresh Stock Data

Run this command from the project folder:

```bash
python3 scripts/download_aapl.py
```

That command downloads fresh daily price data for AAPL, NVDA, and COST. It also updates the fundamentals file used for revenue, net income, market cap, and P/E ratio. It updates:

```text
data/AAPL.json
data/NVDA.json
data/COST.json
data/prices.js
data/fundamentals.js
data/ai_explanations.js
data/ai_actions.js
data/daily_analysis.js
```

The website charts read from `data/prices.js`. The metric boxes read from `data/fundamentals.js`. The AI explanation boxes read from `data/ai_explanations.js`. The educational buy/sell check reads from `data/ai_actions.js`.
The end-of-day analysis reads from `data/daily_analysis.js`.

## Notes

The latest close price comes from each local JSON file.

Revenue, net income, market cap, and P/E ratio are visible on the page as research fields. They update when you run the refresh script.

The AI explanation is an educational summary based on the latest price and fundamentals data. Each AI block also includes a quick one- or two-sentence summary beside the longer explanation. It is not a buy or sell recommendation.

The AI buy/sell check is a simple educational research signal based on price change, P/E ratio, and net income. It is not personal financial advice.

The end-of-day analysis compares the latest close with the previous close. It is meant to be refreshed after the market closes so it can explain what happened that day.

The Chart Range controls let you switch the charts between 1D, 5D, 1W, 1M, 6M, 1Y, 5Y, and Max. When the dashboard reloads or the range changes, each chart redraws with a smooth up/down arrow that follows the price line.

The top of the website has quick buttons for exploring stocks, jumping to the end-of-day review, and opening the idea coach.

The site includes a language selector. Current languages are English, Chinese, Latin, Arabic, Spanish, French, and Hindi. Hindi was added because it is one of the most widely used languages in the world.

The first time someone opens the site, it asks whether they want a small amount of stock puns and playful popups. Fun mode is saved in the browser and can be changed later with the "Fun mode" button at the top. The popups are intentionally limited so they do not interrupt the dashboard.

The "Emoji hints" button adds small context emojis beside selected paragraph text. It is optional and saved in the browser, so turning it off removes the emojis from the dashboard.

The idea coach lets you type your own buy, hold, or sell idea. It gives a quick ChatGPT-style review using the selected stock's local price, fundamentals, daily move, and dashboard signal. It runs locally in the webpage, so it does not expose an OpenAI key or your EODHD key.

Each stock card and research section has a larger "User ideas" box. Press "Verify with ChatGPT" to open a fast response popup that reviews the idea and lists beginner-friendly pros and cons using local dashboard data such as latest close, daily move, one-year trend, revenue, net income, market cap, and P/E ratio.

When a ChatGPT-style review needs more space, the site opens a separate response popup. The popup shows a short reviewing state first, then displays the full educational response in a cleaner reading view.

The End-of-Day Market Review at the bottom has separate tabs for AAPL, NVDA, and COST. Each tab shows the latest daily move, a two-point daily chart, volume, previous close, latest close, and the generated daily explanation.

The review section has two clickable modes:

- Clear View: shows the chart, daily metrics, full daily explanation, and a ChatGPT-style educational buy/sell review.
- Slideshow Review: turns the review into short slides with Back and Next buttons.

The buy/sell review uses sample allocation ranges, such as a small watchlist position or a practice trim range. These are educational examples only, not personal financial advice.

The page animates updated cards, metric boxes, percent-change badges, and AI sections whenever the refreshed files load.

If the internet or an API is unavailable, the refresh script keeps using the last saved local data files instead of clearing the dashboard.

Your user ideas and question boxes are saved in your browser with `localStorage`, so they stay private on your computer unless you copy them somewhere else.

```

## .env.example

```env
EODHD_API_KEY=put_your_own_eodhd_api_key_here

```

## .gitignore

```gitignore
.env
*.key
.DS_Store
__pycache__/
*.pyc

```

## scripts/download_aapl.py

```python
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

```

## data/fundamentals.js

```javascript
window.FUNDAMENTALS_DATA = {
  "AAPL": {
    "revenue": 416161000000.0,
    "netIncome": 112010000000.0,
    "marketCap": 4532958920704.0,
    "peRatio": 37.3192
  },
  "NVDA": {
    "revenue": 215938000000.0,
    "netIncome": 120067000000.0,
    "marketCap": 4718977351680.0,
    "peRatio": 29.8819
  },
  "COST": {
    "revenue": 275235000000.0,
    "netIncome": 8099000000.0,
    "marketCap": 422045483008.0,
    "peRatio": 47.8707
  }
};

```

## data/ai_explanations.js

```javascript
window.DASHBOARD_REFRESHED_AT = "2026-07-03T22:18:12.729463+00:00";
window.AI_EXPLANATIONS = {
  "AAPL": "AAPL's one-year daily close price rose, moving 45.3% from $212.44 to $308.63. The company currently shows revenue of $416.16B, net income of $112.01B, a market cap of $4.53T, and a P/E ratio of 37.32. A useful research question is whether the company's earnings growth and business quality justify that valuation. This is an educational explanation, not a buy or sell recommendation.",
  "NVDA": "NVDA's one-year daily close price rose, moving 23.9% from $157.25 to $194.83. The company currently shows revenue of $215.94B, net income of $120.07B, a market cap of $4.72T, and a P/E ratio of 29.88. A useful research question is whether the company's earnings growth and business quality justify that valuation. This is an educational explanation, not a buy or sell recommendation.",
  "COST": "COST's one-year daily close price stayed fairly close to where it started, moving -3.1% from $982.36 to $951.67. The company currently shows revenue of $275.24B, net income of $8.10B, a market cap of $422.05B, and a P/E ratio of 47.87. A useful research question is whether the company's earnings growth and business quality justify that valuation. This is an educational explanation, not a buy or sell recommendation."
};

```

## data/ai_actions.js

```javascript
window.AI_ACTIONS = {
  "AAPL": {
    "action": "Hold / research more",
    "className": "action-hold",
    "reason": "The data is mixed, so compare growth, valuation, and business quality before making a decision."
  },
  "NVDA": {
    "action": "Buy-watch signal",
    "className": "action-buy",
    "reason": "The stock has positive momentum and the P/E ratio is not extremely high compared with the others."
  },
  "COST": {
    "action": "Hold / research more",
    "className": "action-hold",
    "reason": "The data is mixed, so compare growth, valuation, and business quality before making a decision."
  }
};

```

## data/daily_analysis.js

```javascript
window.DAILY_ANALYSIS = {
  "AAPL": {
    "date": "2026-07-02",
    "className": "daily-up",
    "headline": "AAPL ended up 4.84%",
    "close": 308.63,
    "previousClose": 294.38,
    "change": 14.25,
    "percentChange": 4.840682111556491,
    "volume": 71900726,
    "explanation": "On 2026-07-02, AAPL moved sharply higher, closing at $308.63. That was up 4.84% from the previous close of $294.38. The close was near the top of the day's range, which can show buyers stayed active into the close. Volume was 71,900,726 shares. For context, the dashboard shows revenue of $416.16B, net income of $112.01B, and a P/E ratio of 37.32. This is an end-of-day educational summary, not personal financial advice."
  },
  "NVDA": {
    "date": "2026-07-02",
    "className": "daily-down",
    "headline": "NVDA ended down 1.39%",
    "close": 194.83,
    "previousClose": 197.58,
    "change": -2.75,
    "percentChange": -1.3918412794817288,
    "volume": 142385500,
    "explanation": "On 2026-07-02, NVDA moved lower, closing at $194.83. That was down 1.39% from the previous close of $197.58. The close ended near the middle of the day's range, which suggests a more balanced finish. Volume was 142,385,500 shares. For context, the dashboard shows revenue of $215.94B, net income of $120.07B, and a P/E ratio of 29.88. This is an end-of-day educational summary, not personal financial advice."
  },
  "COST": {
    "date": "2026-07-02",
    "className": "daily-up",
    "headline": "COST ended up 2.92%",
    "close": 951.67,
    "previousClose": 924.67,
    "change": 27.0,
    "percentChange": 2.919960634604778,
    "volume": 2787500,
    "explanation": "On 2026-07-02, COST moved sharply higher, closing at $951.67. That was up 2.92% from the previous close of $924.67. The close was near the top of the day's range, which can show buyers stayed active into the close. Volume was 2,787,500 shares. For context, the dashboard shows revenue of $275.24B, net income of $8.10B, and a P/E ratio of 47.87. This is an end-of-day educational summary, not personal financial advice."
  }
};

```

