// Optional EODHD connection and web refresh. No credentials go into browser storage.
let dashboardService = null;
let dataOperationBusy = false;

function sourceLabel(record) {
  const labels = { updated: "fetched", partial: "partially available", cached: "cached", unavailable: "unavailable" };
  return labels[record?.status] || "saved snapshot";
}

function createDataSourceNote(ticker) {
  const sources = window.DATA_SOURCE_METADATA?.tickers?.[ticker] || {};
  const rows = window.PRICE_DATA?.[ticker] || [];
  const latestDate = sources.prices?.latestDate || rows[rows.length - 1]?.date || "unknown";
  return `<p class="source-note">Prices: ${escapeHtml(sources.prices?.source || "saved snapshot")}
    · ${escapeHtml(sourceLabel(sources.prices))} · through ${escapeHtml(latestDate)}.<br>
    Company metrics: ${escapeHtml(sourceLabel(sources.fundamentals))}.
    <a href="#sourceDetails">Source details</a></p>`;
}

function formatSourceRecord(label, record = {}) {
  const source = escapeHtml(record.source || "Saved data; original source unrecorded");
  let sourceHtml = source;
  try {
    const url = new URL(record.url);
    if (url.protocol === "https:" && ["finance.yahoo.com", "stockanalysis.com", "eodhd.com"].includes(url.hostname)) {
      sourceHtml = `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${source}</a>`;
    }
  } catch { /* Unknown sources stay plain text. */ }
  const parsedDate = new Date(record.fetchedAt);
  const fetched = record.fetchedAt && !Number.isNaN(parsedDate.getTime())
    ? `Last fetched ${parsedDate.toLocaleString()}` : "Fetch date unknown";
  const priceDate = record.latestDate ? ` · Trading date ${escapeHtml(record.latestDate)}` : "";
  const period = record.period ? ` · ${escapeHtml(record.period)}` : "";
  return `<p><strong>${label}:</strong> ${sourceHtml} · ${sourceLabel(record)}<br>${fetched}${priceDate}${period}</p>`;
}

function renderSourceDetails() {
  const metadata = window.DATA_SOURCE_METADATA || {};
  document.querySelector("#sourceDetails").innerHTML = ["AAPL", "NVDA", "COST"].map((ticker) => {
    const sources = metadata.tickers?.[ticker] || {};
    return `<div class="source-record"><strong>${ticker}</strong>
      ${formatSourceRecord("Daily prices", sources.prices)}
      ${formatSourceRecord("Company metrics", sources.fundamentals)}</div>`;
  }).join("");
  // A source link on any card opens the otherwise collapsed disclosure.
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href="#sourceDetails"]')) {
      document.querySelector(".source-details").open = true;
    }
  });
}

function setSourceStatus(message, error = false) {
  const status = document.querySelector("#dataSourceStatus");
  status.textContent = message;
  status.classList.toggle("error", error);
}

function updateDataControls() {
  const available = Boolean(dashboardService);
  const connected = Boolean(dashboardService?.connected);
  document.querySelector("#dataModeBadge").textContent = available
    ? connected ? "EODHD connected" : "Web mode · no API key needed"
    : "Saved snapshot · no API key required";
  document.querySelector("#refreshData").textContent = dataOperationBusy
    ? "Updating data…" : connected ? "Refresh with EODHD" : "Refresh from the web";
  for (const id of ["refreshData", "connectEodhd", "eodhdKey", "disconnectEodhd"]) {
    document.getElementById(id).disabled = !available || dataOperationBusy;
  }
  document.querySelector("#disconnectEodhd").hidden = !connected;
  document.querySelector("#eodhdConnection").hidden = connected;
  document.querySelector("#localServiceHelp").hidden = available;
}

async function serviceRequest(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const options = { cache: "no-store", signal: controller.signal };
    if (body !== undefined) {
      options.method = "POST";
      options.headers = { "Content-Type": "application/json", "X-Dashboard-Token": dashboardService.csrfToken };
      options.body = JSON.stringify(body);
    }
    const response = await fetch(path, options);
    if (!response.headers.get("Content-Type")?.includes("application/json")) {
      throw new Error("The local data service is not running. Start python3 scripts/serve.py to connect or refresh.");
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "The data service could not complete this action.");
    if (result.service !== "stock-research-dashboard") throw new Error("The local data service is unavailable.");
    return result;
  } catch (error) {
    if (error instanceof TypeError || error.name === "AbortError") {
      throw new Error("Could not reach the local data service. Check that python3 scripts/serve.py is running, then reload the page.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function waitForDataRefresh() {
  while (dashboardService.refreshing) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    dashboardService = await serviceRequest("/api/status");
  }
  if (dashboardService.refreshError) throw new Error(dashboardService.refreshError);
  // Reload the coherent saved snapshot and restore notes from existing local storage.
  window.location.reload();
}

async function refreshDashboardData() {
  if (!dashboardService || dataOperationBusy) return;
  dataOperationBusy = true;
  updateDataControls();
  setSourceStatus("Collecting prices and company metrics. You can keep reading while the saved data updates…");
  try {
    dashboardService = await serviceRequest("/api/refresh", {});
    await waitForDataRefresh();
  } catch (error) {
    setSourceStatus(error.message, true);
  } finally {
    dataOperationBusy = false;
    updateDataControls();
  }
}

function describeSavedSources() {
  const records = Object.values(window.DATA_SOURCE_METADATA?.tickers || {}).flatMap(Object.values);
  const cached = records.filter((record) => record.status === "cached").length;
  const missing = records.filter((record) => ["unavailable", "partial"].includes(record.status)).length;
  if (!records.length) return "Showing saved data. Original source and fetch dates were not recorded for this snapshot.";
  return `Showing saved data with source details below.${cached ? ` ${cached} source(s) could not update and are using cached values.` : ""}${missing ? ` ${missing} source(s) have missing metrics.` : ""}`;
}

async function setupDataSource() {
  renderSourceDetails();
  document.querySelector("#refreshData").addEventListener("click", refreshDashboardData);
  document.querySelector("#continueWeb").addEventListener("click", () => {
    document.querySelector("#eodhdKey").value = "";
    document.querySelector("#eodhdConnection").open = false;
    setSourceStatus(dashboardService
      ? "No key needed. You can use the dashboard and refresh in web mode."
      : "No key needed. You can explore the saved dashboard; start the local data service for fresh web data.");
  });
  document.querySelector("#eodhdForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!dashboardService || dataOperationBusy) return;
    const input = document.querySelector("#eodhdKey");
    const key = input.value.trim();
    input.value = "";
    if (!key) return;
    dataOperationBusy = true;
    updateDataControls();
    setSourceStatus("Verifying your key with EODHD…");
    let connected = false;
    try {
      dashboardService = await serviceRequest("/api/connect", { apiKey: key });
      document.querySelector("#eodhdConnection").open = false;
      connected = true;
    } catch (error) {
      setSourceStatus(error.message, true);
    } finally {
      dataOperationBusy = false;
      updateDataControls();
    }
    if (connected) await refreshDashboardData();
  });
  document.querySelector("#disconnectEodhd").addEventListener("click", async () => {
    if (dataOperationBusy) return;
    dataOperationBusy = true;
    updateDataControls();
    let disconnected = false;
    try {
      dashboardService = await serviceRequest("/api/disconnect", {});
      disconnected = true;
    } catch (error) {
      setSourceStatus(error.message, true);
    } finally {
      dataOperationBusy = false;
      updateDataControls();
    }
    if (disconnected) await refreshDashboardData();
  });
  try {
    if (!["127.0.0.1", "localhost"].includes(window.location.hostname)) throw new Error("static");
    dashboardService = await serviceRequest("/api/status");
  } catch {
    updateDataControls();
    setSourceStatus("You can explore the saved dashboard without a key. Start the local data service below to collect fresh web data.");
    return;
  }
  updateDataControls();
  setSourceStatus(dashboardService.refreshError || describeSavedSources(), Boolean(dashboardService.refreshError));
  if (dashboardService.refreshing) {
    dataOperationBusy = true;
    updateDataControls();
    setSourceStatus("A refresh is already running. The dashboard will update when it finishes…");
    try { await waitForDataRefresh(); }
    catch (error) { setSourceStatus(error.message, true); }
    finally { dataOperationBusy = false; updateDataControls(); }
    return;
  }
  // Check the web automatically when this local service first opens an old snapshot.
  const lastAttempt = dashboardService.lastAttempt || window.DATA_SOURCE_METADATA?.attemptedAt;
  if (!lastAttempt || Date.now() - new Date(lastAttempt).getTime() > 4 * 60 * 60 * 1000) {
    await refreshDashboardData();
  }
}
