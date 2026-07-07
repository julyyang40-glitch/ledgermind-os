void (async () => {
const agentSafetyUtils = globalThis.LedgerMindAgentUtils;
﻿const userIdInput = document.querySelector("#user-id");
const monthInput = document.querySelector("#month");
const mobileMonthInput = document.querySelector("#mobile-month");
const mobileRefreshButton = document.querySelector("#mobile-refresh");
const refreshButton = document.querySelector("#refresh");
const commandInput = document.querySelector("#command-input");
const importSamplesButton = document.querySelector("#import-samples");
const backupJsonButton = document.querySelector("#backup-json");
const clearUserButton = document.querySelector("#clear-user");
const themeToggleButton = document.querySelector("#theme-toggle");
const demoModeToggleButton = document.querySelector("#demo-mode-toggle");
const displayModeBanner = document.querySelector("#display-mode-banner");
const firstRunGuide = document.querySelector("#first-run-guide");
const guideImportButton = document.querySelector("#guide-import");
const guideDemoButton = document.querySelector("#guide-demo");
const guideDisplayButton = document.querySelector("#guide-display");
const guideModelButton = document.querySelector("#guide-model");
const nextActionList = document.querySelector("#next-action-list");
const quickStartPanel = document.querySelector("#quick-start-panel");
const dismissQuickStartButton = document.querySelector("#dismiss-quick-start");
const openOnboardingButton = document.querySelector("#open-onboarding");
const openFeatureMapButton = document.querySelector("#open-feature-map");
const onboardingLayer = document.querySelector("#onboarding-layer");
const featureMapLayer = document.querySelector("#feature-map-layer");
const demoLedgerBanner = document.querySelector("#demo-ledger-banner");
const clearDemoLedgerButton = document.querySelector("#clear-demo-ledger");
const refreshDiagnosticsButton = document.querySelector("#refresh-diagnostics");
const billFileInput = document.querySelector("#bill-file");
const dropzone = document.querySelector("#dropzone");
const statusEl = document.querySelector("#service-status");
const importStatusEl = document.querySelector("#import-status");
const searchInput = document.querySelector("#search");
const statusFilter = document.querySelector("#status-filter");
const exportCsvButton = document.querySelector("#export-csv");
const exportReportMarkdownButton = document.querySelector("#export-report-markdown");
const batchCategorySelect = document.querySelector("#batch-category");
const applyBatchButton = document.querySelector("#apply-batch");
const budgetCategorySelect = document.querySelector("#budget-category");
const budgetLimitInput = document.querySelector("#budget-limit");
const saveBudgetButton = document.querySelector("#save-budget");
const manualPaidAtInput = document.querySelector("#manual-paid-at");
const manualDirectionSelect = document.querySelector("#manual-direction");
const manualAmountInput = document.querySelector("#manual-amount");
const manualMerchantInput = document.querySelector("#manual-merchant");
const manualProductInput = document.querySelector("#manual-product");
const manualCategorySelect = document.querySelector("#manual-category");
const saveManualButton = document.querySelector("#save-manual");
const manualStatusEl = document.querySelector("#manual-status");
const toastEl = document.querySelector("#toast");
const agentQuestionInput = document.querySelector("#agent-question");
const askAgentButton = document.querySelector("#ask-agent");
const agentAnswerEl = document.querySelector("#agent-answer");
const ruleCommandInput = document.querySelector("#rule-command");
const createRuleButton = document.querySelector("#create-rule");
const mobileAgentQuestionInput = document.querySelector("#mobile-agent-question");
const mobileAskAgentButton = document.querySelector("#mobile-ask-agent");
const mobileAgentAnswerEl = document.querySelector("#mobile-agent-answer");
const mobileOpenReviewButton = document.querySelector("#mobile-open-review");
const reviewSubscriptionsButton = document.querySelector("#review-subscriptions");
const createSavingPlanButton = document.querySelector("#create-saving-plan");
const apiBaseUrlInput = document.querySelector("#api-base-url");
const saveApiBaseButton = document.querySelector("#save-api-base");
const siliconflowApiKeyInput = document.querySelector("#siliconflow-api-key");
const saveSiliconflowKeyButton = document.querySelector("#save-siliconflow-key");
const mobileNavLinks = [...document.querySelectorAll(".mobile-nav a[data-mobile-page]")];
const commandPaletteLayer = document.querySelector("#command-palette");
const commandPaletteSearch = document.querySelector("#command-palette-search");
const commandPaletteList = document.querySelector("#command-palette-list");
const transactionDetailLayer = document.querySelector("#transaction-detail-layer");
const transactionDetailContent = document.querySelector("#transaction-detail-content");
const importDetailLayer = document.querySelector("#import-detail-layer");
const importDetailContent = document.querySelector("#import-detail-content");
const clearPendingDraftsButton = document.querySelector("#clear-pending-drafts");
const clearAuditLogButton = document.querySelector("#clear-audit-log");
const reportCenterExportButton = document.querySelector("#report-center-export");
const copyReportSummaryButton = document.querySelector("#copy-report-summary");
const reportTabButtons = [...document.querySelectorAll("[data-report-tab]")];
const bundledSiliconFlowApiKey = "";
const DEMO_USER_ID = "ledgermind-demo";
const showcaseMode = window.location.pathname === "/showcase" || window.location.hash === "#showcase";
const startupDemoRequested = new URLSearchParams(window.location.search).get("demo") === "1";
const githubRepoUrl = document.querySelector('meta[name="github-repo-url"]')?.content?.trim() ?? "";

const categoryOptions = [
  ["", "\u672a\u5206\u7c7b"],
  ["food.coffee", "\u9910\u996e / \u5496\u5561"],
  ["food.restaurant", "\u9910\u996e / \u6b63\u9910"],
  ["shopping.grocery", "\u8d2d\u7269 / \u4e70\u83dc"],
  ["transport.taxi", "\u4ea4\u901a / \u6253\u8f66"],
  ["subscription.video", "\u8ba2\u9605 / \u89c6\u9891"],
  ["housing.rent", "\u5c45\u4f4f / \u623f\u79df"],
  ["life.daily", "\u751f\u6d3b / \u65e5\u7528"],
  ["transfer", "\u8d26\u6237\u8f6c\u8d26"],
  ["refund", "\u9000\u6b3e"]
];
const chartColors = ["#4fb8aa", "#638fc5", "#c79b55", "#897bb8", "#c86f7d", "#58a47b"];
const categoryColors = {
  "food.coffee": "#a88b63",
  "food.restaurant": "#c17a62",
  "shopping.grocery": "#897bb8",
  "transport.taxi": "#638fc5",
  "subscription.video": "#7d83b8",
  "housing.rent": "#4f8f87",
  "life.daily": "#7d9272",
  transfer: "#8391a2",
  refund: "#58a47b"
};

const state = {
  transactions: [],
  jobs: [],
  report: null,
  analytics: null,
  insights: null,
  budgets: [],
  rules: [],
  lastImport: null,
  selectedTransactionIds: new Set(),
  agentProvider: "local",
  agentCallStatus: "ready",
  backendStatus: "checking",
  lastAgentAt: "",
  lastAgentQuestion: "",
  importJobFilter: "",
  pendingActions: [],
  completedTaskSteps: new Set(),
  auditLogs: [],
  exportRecords: [],
  reportTab: "monthly"
};
let lastMobileAskAt = 0;
let refreshSequence = 0;
let monthManuallySelected = false;
let agentAskInFlight = false;
let agentAnswerBeforeDisplay = "";
let mobileAnswerBeforeDisplay = "";
let displayMode = new URLSearchParams(window.location.search).get("display") === "1"
  || localStorage.getItem("ledgermind-display-mode") === "true";
let commandPaletteIndex = 0;
let selectedTransactionForDetails = null;

if (showcaseMode) {
  document.documentElement.dataset.theme = localStorage.getItem("theme") ?? "dark";
  document.body.classList.add("showcase-mode");
  document.querySelector("#showcase-page").hidden = false;
  document.querySelector(".app-shell").hidden = true;
  document.querySelector(".mobile-agent-input").hidden = true;
  document.querySelector(".mobile-nav").hidden = true;
  const githubLink = document.querySelector("#showcase-github");
  if (githubRepoUrl) {
    githubLink.href = githubRepoUrl;
    githubLink.hidden = false;
  }
  return;
}

fillCategorySelect(batchCategorySelect, "\u9009\u62e9\u5206\u7c7b");
fillCategorySelect(budgetCategorySelect, "\u9884\u7b97\u5206\u7c7b");
fillCategorySelect(manualCategorySelect, "\u9009\u62e9\u5206\u7c7b");
manualPaidAtInput.value = new Date().toISOString().slice(0, 16);
monthInput.value = localStorage.getItem("ledgermind-selected-month") ?? new Date().toISOString().slice(0, 7);
mobileMonthInput.value = monthInput.value;
syncManualDateToMonth();
document.documentElement.dataset.theme = localStorage.getItem("theme") ?? "dark";
applyDisplayMode();
loadLocalAgentState();
installGroupedNavigation();
installModuleHelp();
apiBaseUrlInput.value = localStorage.getItem("ledgermind-api-base") ?? "";
siliconflowApiKeyInput.value = getSiliconFlowApiKey() ? "********" : "";
setMobilePage("home");

refreshButton.addEventListener("click", () => refreshAll());
monthInput.addEventListener("change", () => {
  monthManuallySelected = true;
  mobileMonthInput.value = monthInput.value;
  syncManualDateToMonth();
  localStorage.setItem("ledgermind-selected-month", monthInput.value);
  refreshAll();
});
mobileMonthInput.addEventListener("change", () => {
  monthManuallySelected = true;
  monthInput.value = mobileMonthInput.value;
  syncManualDateToMonth();
  localStorage.setItem("ledgermind-selected-month", mobileMonthInput.value);
  refreshAll();
});
mobileRefreshButton.addEventListener("click", () => refreshAll());
commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runCommand(commandInput.value);
  }
});
commandInput.addEventListener("click", openCommandPalette);
commandInput.addEventListener("focus", openCommandPalette);
exportReportMarkdownButton.addEventListener("click", exportMonthlyReportMarkdown);
commandPaletteSearch.addEventListener("input", () => {
  commandPaletteIndex = 0;
  renderCommandPalette();
});
commandPaletteSearch.addEventListener("keydown", handleCommandPaletteKeydown);
for (const element of document.querySelectorAll("[data-close-command-palette]")) {
  element.addEventListener("click", closeCommandPalette);
}
for (const element of document.querySelectorAll("[data-close-transaction-detail]")) {
  element.addEventListener("click", closeTransactionDetails);
}
for (const element of document.querySelectorAll("[data-close-import-detail]")) {
  element.addEventListener("click", closeImportDetails);
}
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommandPalette();
  } else if (event.key === "Escape") {
    closeCommandPalette();
    closeTransactionDetails();
    closeImportDetails();
    closeOnboarding();
    closeFeatureMap();
  }
});
userIdInput.addEventListener("change", () => {
  monthManuallySelected = false;
  loadLocalAgentState();
  refreshAll();
});
themeToggleButton.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
});
demoModeToggleButton.addEventListener("click", () => {
  displayMode = !displayMode;
  localStorage.setItem("ledgermind-display-mode", String(displayMode));
  applyDisplayMode();
  loadLocalAgentState();
  render();
});
importSamplesButton.addEventListener("click", () => loadDemoLedger());
guideDemoButton.addEventListener("click", () => loadDemoLedger());
guideImportButton.addEventListener("click", () => navigateToFeature("transactions", "#workbench"));
guideDisplayButton.addEventListener("click", () => demoModeToggleButton.click());
guideModelButton.addEventListener("click", () => navigateToFeature("settings", "#privacy-panel"));
dismissQuickStartButton.addEventListener("click", () => {
  localStorage.setItem("ledgermind-quick-start-dismissed", "true");
  renderQuickStart();
});
openOnboardingButton.addEventListener("click", openOnboarding);
openFeatureMapButton.addEventListener("click", openFeatureMap);
for (const button of document.querySelectorAll("[data-guide-action]")) {
  button.addEventListener("click", () => runGuideAction(button.dataset.guideAction));
}
for (const button of document.querySelectorAll("[data-onboarding-action]")) {
  button.addEventListener("click", () => {
    markOnboardingSeen();
    closeOnboarding();
    if (button.dataset.onboardingAction === "map") openFeatureMap();
    else runGuideAction(button.dataset.onboardingAction);
  });
}
for (const element of document.querySelectorAll("[data-close-onboarding]")) {
  element.addEventListener("click", () => {
    markOnboardingSeen();
    closeOnboarding();
  });
}
for (const element of document.querySelectorAll("[data-close-feature-map]")) {
  element.addEventListener("click", closeFeatureMap);
}
for (const button of document.querySelectorAll("[data-map-target]")) {
  button.addEventListener("click", () => {
    closeFeatureMap();
    runGuideAction(button.dataset.mapTarget);
  });
}
clearDemoLedgerButton.addEventListener("click", () => clearDemoLedger());
refreshDiagnosticsButton.addEventListener("click", () => refreshAll());
clearPendingDraftsButton.addEventListener("click", clearPendingDrafts);
clearAuditLogButton.addEventListener("click", clearAuditLogs);
reportCenterExportButton.addEventListener("click", exportMonthlyReportMarkdown);
copyReportSummaryButton.addEventListener("click", copyReportSummary);
for (const button of reportTabButtons) {
  button.addEventListener("click", () => {
    state.reportTab = button.dataset.reportTab ?? "monthly";
    renderReportCenter();
  });
}
backupJsonButton.addEventListener("click", () => {
  if (shouldUseOfflineMode()) {
    exportOfflineBackup();
    return;
  }
  window.location.href = `/exports/backup.json?userId=${encodeURIComponent(currentUserId())}`;
  showToast("\u5df2\u5f00\u59cb\u5bfc\u51fa\u5907\u4efd");
});
clearUserButton.addEventListener("click", async () => {
  const ok = window.confirm("\u786e\u5b9a\u6e05\u7a7a\u5f53\u524d\u7528\u6237\u7684\u6240\u6709\u8bb0\u8d26\u6570\u636e\uff1f\u8bf7\u5148\u5907\u4efd\u3002");
  if (!ok) {
    return;
  }
  await runAction(async () => {
    await api(`/users/${encodeURIComponent(currentUserId())}/data`, {
      method: "DELETE"
    });
    await syncAfterChange("\u5f53\u524d\u7528\u6237\u6570\u636e\u5df2\u6e05\u7a7a");
  });
});
askAgentButton.addEventListener("click", () => askAgent(agentQuestionInput.value));
agentQuestionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    askAgent(agentQuestionInput.value);
  }
});
mobileAskAgentButton.addEventListener("click", sendMobileAgentQuestion);
mobileAskAgentButton.addEventListener("touchend", sendMobileAgentQuestion);
mobileAgentQuestionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMobileAgentQuestion(event);
  }
});
reviewSubscriptionsButton.addEventListener("click", () => navigateToFeature("insights", "#insights-panel"));
createSavingPlanButton.addEventListener("click", () => askAgent("请基于本月账本生成一份具体的节省计划。"));
mobileOpenReviewButton.addEventListener("click", () => navigateToFeature("transactions", "#transactions"));
for (const chip of document.querySelectorAll(".prompt-chip")) {
  chip.addEventListener("click", () => {
    const question = chip.textContent ?? "";
    agentQuestionInput.value = question;
    askAgent(question);
  });
}
for (const link of mobileNavLinks) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setMobilePage(link.dataset.mobilePage ?? "home");
  });
}
createRuleButton.addEventListener("click", () => createAutomationRule());
saveApiBaseButton.addEventListener("click", () => {
  const value = apiBaseUrlInput.value.trim().replace(/\/$/, "");
  if (value && !/^https?:\/\//i.test(value)) {
    showToast("后端地址需要以 http:// 或 https:// 开头", "error");
    return;
  }
  if (value) {
    localStorage.setItem("ledgermind-api-base", value);
    showToast("云端模型后端已保存");
  } else {
    localStorage.removeItem("ledgermind-api-base");
    showToast("已切回本地离线模式");
  }
  refreshAll();
});
saveSiliconflowKeyButton.addEventListener("click", () => {
  const value = siliconflowApiKeyInput.value.trim();
  if (!value || value === "********") {
    localStorage.removeItem("ledgermind-siliconflow-key");
    siliconflowApiKeyInput.value = "";
    showToast("已清除本机 API Key");
    return;
  }
  if (!value.startsWith("sk-")) {
    showToast("Key 格式看起来不正确，请确认后再保存", "error");
    return;
  }
  localStorage.setItem("ledgermind-siliconflow-key", value);
  siliconflowApiKeyInput.value = "********";
  showToast("API Key 已保存在当前设备");
});
ruleCommandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    createAutomationRule();
  }
});
searchInput.addEventListener("input", () => renderTransactions());
statusFilter.addEventListener("change", () => renderTransactions());
exportCsvButton.addEventListener("click", () => {
  const userId = encodeURIComponent(currentUserId());
  const month = encodeURIComponent(monthInput.value);
  if (shouldUseOfflineMode()) {
    exportOfflineTransactionsCsv();
    return;
  }
  window.location.href = `/exports/transactions.csv?userId=${userId}&month=${month}`;
});
applyBatchButton.addEventListener("click", async () => {
  const transactionIds = [...state.selectedTransactionIds];
  if (transactionIds.length === 0 || !batchCategorySelect.value) {
    return;
  }
  await runAction(async () => {
    await api("/transactions/batch", {
      method: "PATCH",
      body: {
        userId: currentUserId(),
        transactionIds,
        categoryId: batchCategorySelect.value
      }
    });
    state.selectedTransactionIds.clear();
    await syncAfterChange("\u6279\u91cf\u5206\u7c7b\u5df2\u5e94\u7528");
  });
});
saveBudgetButton.addEventListener("click", async () => {
  const limitAmount = Number(budgetLimitInput.value);
  if (!budgetCategorySelect.value || !Number.isFinite(limitAmount)) {
    return;
  }
  await runAction(async () => {
    await api("/budgets", {
      method: "PUT",
      body: {
        userId: currentUserId(),
        month: monthInput.value,
        categoryId: budgetCategorySelect.value,
        limitAmount
      }
    });
    budgetLimitInput.value = "";
    await syncAfterChange("\u9884\u7b97\u5df2\u4fdd\u5b58");
  });
});
saveManualButton.addEventListener("click", async () => {
  const amount = Number(manualAmountInput.value);
  const paidAtMonth = manualPaidAtInput.value.slice(0, 7);
  if (!Number.isFinite(amount) || amount <= 0 || !manualPaidAtInput.value) {
    manualStatusEl.textContent = "\u8bf7\u586b\u5199\u91d1\u989d\u548c\u65f6\u95f4";
    return;
  }

  await runAction(async () => {
    await api("/transactions/manual", {
      method: "POST",
      body: {
        userId: currentUserId(),
        direction: manualDirectionSelect.value,
        amount,
        paidAt: manualPaidAtInput.value.replace("T", " ") + ":00",
        merchantName: manualMerchantInput.value,
        productName: manualProductInput.value,
        categoryId: manualCategorySelect.value
      }
    });
    manualAmountInput.value = "";
    manualMerchantInput.value = "";
    manualProductInput.value = "";
    if (/^\d{4}-\d{2}$/.test(paidAtMonth) && paidAtMonth !== monthInput.value) {
      monthInput.value = paidAtMonth;
      mobileMonthInput.value = paidAtMonth;
      monthManuallySelected = false;
      localStorage.setItem("ledgermind-selected-month", paidAtMonth);
    }
    manualStatusEl.textContent = "\u5df2\u6dfb\u52a0";
    await syncAfterChange("\u624b\u5de5\u8bb0\u8d26\u5df2\u6dfb\u52a0");
  });
});
billFileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    await importFile(file);
  }
  billFileInput.value = "";
});

for (const eventName of ["dragenter", "dragover"]) {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragging");
  });
}

dropzone.addEventListener("drop", async (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await importFile(file);
  }
});

await refreshAll();
if (startupDemoRequested) {
  await loadDemoLedger();
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("demo");
  window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
}
maybeOpenOnboarding();

async function refreshAll() {
  const sequence = ++refreshSequence;
  document.body.classList.add("is-refreshing");
  try {
    setSyncStatus("同步中...");
    await api("/health");
    state.backendStatus = shouldUseOfflineMode() ? "offline" : "online";
    statusEl.textContent = "智能体运行中 · 兼容 GPT 模型 · 隐私模式：本地优先";
    if (isMobileViewport()) {
      statusEl.textContent = "智能体运行中 · 本地优先 · 数据不离开设备";
    }
    const userId = currentUserId();
    const month = monthInput.value;
    const [transactions, imports, report, analytics, insights, budgets, rules] = await Promise.all([
      api(`/transactions?userId=${encodeURIComponent(userId)}`),
      api(`/imports?userId=${encodeURIComponent(userId)}`),
      api(`/reports/monthly?userId=${encodeURIComponent(userId)}&month=${encodeURIComponent(month)}`),
      api(`/analytics/monthly?userId=${encodeURIComponent(userId)}&month=${encodeURIComponent(month)}`),
      api(`/insights?userId=${encodeURIComponent(userId)}`),
      api(`/budgets/status?userId=${encodeURIComponent(userId)}&month=${encodeURIComponent(month)}`),
      api(`/classification-rules?userId=${encodeURIComponent(userId)}`)
    ]);
    if (sequence !== refreshSequence) {
      return;
    }
    const transactionRows = transactions.transactions ?? [];
    if (!monthManuallySelected && transactionRows.length > 0 && !transactionRows.some((item) => item.paidAt?.startsWith(month))) {
      const latestMonth = latestTransactionMonth(transactionRows);
      if (latestMonth && latestMonth !== month) {
        monthInput.value = latestMonth;
        mobileMonthInput.value = latestMonth;
        syncManualDateToMonth();
        localStorage.setItem("ledgermind-selected-month", latestMonth);
        await refreshAll();
        return;
      }
    }
    state.selectedTransactionIds = new Set([...state.selectedTransactionIds].filter((id) =>
      transactionRows.some((transaction) => transaction.id === id)
    ));
    state.transactions = transactionRows;
    state.jobs = imports.jobs ?? [];
    state.report = report;
    state.analytics = analytics;
    state.insights = insights;
    state.budgets = budgets.budgets ?? [];
    state.rules = rules.rules ?? [];
    render();
    setSyncStatus(`已同步 · 本月 ${currentMonthTransactions().length} 笔 · 账本共 ${state.transactions.length} 笔 · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`);
  } catch (error) {
    state.backendStatus = "unavailable";
    statusEl.textContent = `\u8fde\u63a5\u5931\u8d25\uff1a${error.message}`;
    renderDiagnostics();
  } finally {
    if (sequence === refreshSequence) {
      document.body.classList.remove("is-refreshing");
    }
  }
}

async function syncAfterChange(message) {
  await refreshAll();
  showToast(message);
}

function setSyncStatus(message) {
  statusEl.textContent = message;
}

async function importFile(file) {
  if (!/\.(csv|xlsx)$/i.test(file.name)) {
    const message = "暂不支持该文件格式，请选择微信或支付宝导出的 CSV / XLSX 账单";
    importStatusEl.textContent = message;
    setImportStep("upload", message, true);
    showToast(message, "error");
    return;
  }
  importStatusEl.textContent = "\u5bfc\u5165\u4e2d";
  setImportStep("parse", `正在解析 ${file.name}`);
  await runAction(async () => {
    const contentBase64 = await fileToBase64(file);
    const result = await api("/imports", {
      method: "POST",
      body: {
        userId: currentUserId(),
        filename: file.name,
        contentBase64
      }
    });
    const importedMonth = latestTransactionMonth(result.transactions ?? []);
    state.lastImport = { ...result.job, month: importedMonth, filename: file.name };
    if (importedMonth) {
      monthInput.value = importedMonth;
      mobileMonthInput.value = importedMonth;
      syncManualDateToMonth();
      monthManuallySelected = false;
      localStorage.setItem("ledgermind-selected-month", importedMonth);
    }
    importStatusEl.textContent = `${result.job.importedRows} \u6761\u5df2\u5bfc\u5165`;
    setImportStep("confirm", "解析完成，结果已写入账本");
    await syncAfterChange(`${result.job.importedRows} \u6761\u4ea4\u6613\u5df2\u5bfc\u5165，已刷新所有图表`);
  }, (error) => {
    const message = friendlyImportError(error);
    importStatusEl.textContent = message;
    setImportStep("upload", message, true);
    return message;
  });
}

function friendlyImportError(error) {
  const message = String(error?.message ?? "");
  if (/编码|decode|gbk|utf/i.test(message)) return "编码识别失败，请使用微信或支付宝原始导出文件";
  if (/xlsx|zip|工作表/i.test(message)) return "XLSX 文件解析失败，请重新导出账单后再试";
  if (/json|http|network|fetch/i.test(message)) return "导入服务暂时不可用，本地账本未发生变化";
  return "账单导入失败，请确认文件完整且未被加密";
}

function setImportStep(step, message, isError = false) {
  const order = ["upload", "parse", "confirm"];
  const activeIndex = order.indexOf(step);
  for (const element of document.querySelectorAll("[data-import-step]")) {
    const index = order.indexOf(element.dataset.importStep);
    element.classList.toggle("complete", !isError && index < activeIndex || !isError && step === "confirm");
    element.classList.toggle("active", index === activeIndex);
    element.classList.toggle("error", isError && index === activeIndex);
  }
  const result = document.querySelector("#import-result");
  result.textContent = message;
  result.classList.toggle("error", isError);
}

function sendMobileAgentQuestion(event) {
  event?.preventDefault();
  event?.stopPropagation();
  const now = Date.now();
  if (now - lastMobileAskAt < 450) {
    return;
  }
  lastMobileAskAt = now;
  const question = mobileAgentQuestionInput.value;
  askAgent(question, { fromMobile: true });
}

async function askAgent(question, options = {}) {
  const text = String(question ?? "").trim();
  if (!text) {
    showToast("请先输入一个记账问题", "error");
    return;
  }
  if (agentAskInFlight) {
    showToast("智能体正在分析上一条问题");
    return;
  }
  agentAskInFlight = true;
  state.lastAgentQuestion = text;
  state.completedTaskSteps = new Set();
  state.agentCallStatus = "loading";
  renderDiagnostics();
  askAgentButton.disabled = true;
  mobileAskAgentButton.disabled = true;
  if (options.fromMobile) {
    mobileAgentQuestionInput.value = "";
    mobileAgentQuestionInput.blur();
  }
  agentAnswerEl.classList.add("loading");
  const loadingTitle = document.createElement("span");
  loadingTitle.textContent = "智能体回答";
  const loadingCopy = document.createElement("p");
  loadingCopy.textContent = `正在分析：${text}`;
  agentAnswerEl.replaceChildren(loadingTitle, loadingCopy);
  mobileAgentAnswerEl.textContent = `正在分析：${text}`;
  if (options.fromMobile && isMobileViewport()) {
    agentAnswerEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  try {
    await runAction(async () => {
      const result = await api("/agent/ask", {
        method: "POST",
        body: {
          userId: currentUserId(),
          month: monthInput.value,
          question: text
        }
      });
      renderAgentAnswer(result);
      if (options.fromMobile && isMobileViewport()) {
        agentAnswerEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, (error) => {
      renderAgentAnswer({
        answer: `暂时无法连接智能体：${error.message ?? "请求失败"}。账本数据仍保存在本机，请稍后重试。`,
        cards: [{ label: "账本状态", value: "本机数据可用" }],
        actions: ["打开交易页", "查看月报"]
      });
      return "智能体连接失败，已保留本地账本数据";
    });
  } finally {
    agentAskInFlight = false;
    askAgentButton.disabled = false;
    mobileAskAgentButton.disabled = false;
  }
}

async function createAutomationRule() {
  const command = ruleCommandInput.value.trim();
  if (!command) {
    showToast("请先输入一条自然语言规则", "error");
    return;
  }
  if (!window.confirm(`确认创建规则？\n${command}`)) return;
  await runAction(async () => {
    const result = await api("/automation-rules", {
      method: "POST",
      body: {
        userId: currentUserId(),
        command
      }
    });
    ruleCommandInput.value = "";
    addAuditLog({ type: "用户确认创建规则", title: command, source: "规则草稿", impact: "未来同类交易", result: "已完成" });
    await syncAfterChange(result.message ?? "自动化规则已创建");
  });
}

async function loadDemoLedger() {
  await runAction(async () => {
    const returnUser = currentUserId();
    if (returnUser && returnUser !== DEMO_USER_ID) {
      localStorage.setItem("ledgermind-demo-return-user", returnUser);
    }
    importStatusEl.textContent = "正在准备独立演示账本";
    await api(`/users/${DEMO_USER_ID}/data`, { method: "DELETE" });
    await api("/demo/import-samples", { method: "POST", body: { userId: DEMO_USER_ID } });
    const manualRows = [
      { direction: "manual", amount: 36.5, paidAt: "2026-05-06T18:20:00+08:00", merchantName: "示例商户 A", productName: "晚餐", categoryId: "food.restaurant" },
      { direction: "expense", amount: 68.5, paidAt: "2026-05-08T09:12:00+08:00", merchantName: "示例咖啡店", productName: "咖啡与早餐", categoryId: "food.coffee" },
      { direction: "refund", amount: 28, paidAt: "2026-05-10T14:30:00+08:00", merchantName: "示例电商", productName: "订单退款", categoryId: "refund" },
      { direction: "expense", amount: 699, paidAt: "2026-05-11T21:40:00+08:00", merchantName: "待确认商户", productName: "用途待确认" },
      { direction: "expense", amount: 24, paidAt: "2026-04-12T08:00:00+08:00", merchantName: "示例订阅服务", productName: "月度订阅", categoryId: "subscription.video" },
      { direction: "expense", amount: 24, paidAt: "2026-05-12T08:00:00+08:00", merchantName: "示例订阅服务", productName: "月度订阅", categoryId: "subscription.video" }
    ];
    for (const row of manualRows) {
      await api("/transactions/manual", {
        method: "POST",
        body: { ...row, userId: DEMO_USER_ID, direction: row.direction === "manual" ? "expense" : row.direction }
      });
    }
    await api("/automation-rules", { method: "POST", body: { userId: DEMO_USER_ID, command: "把滴滴自动归为交通" } });
    await api("/budgets", { method: "PUT", body: { userId: DEMO_USER_ID, month: "2026-05", categoryId: "food.coffee", limitAmount: 50 } });
    if (displayMode) userIdInput.dataset.realValue = DEMO_USER_ID;
    else userIdInput.value = DEMO_USER_ID;
    monthInput.value = "2026-05";
    mobileMonthInput.value = "2026-05";
    localStorage.setItem("ledgermind-selected-month", "2026-05");
    loadLocalAgentState();
    importStatusEl.textContent = "独立演示账本已加载";
    await syncAfterChange("演示账本已加载，不会写入你的真实用户数据");
  });
}

async function clearDemoLedger() {
  if (currentUserId() !== DEMO_USER_ID) {
    showToast("当前不是演示账本，未执行清除", "error");
    return;
  }
  const ok = window.confirm("确定清除独立演示账本？你的真实账本不会受到影响。");
  if (!ok) return;
  await runAction(async () => {
    await api(`/users/${DEMO_USER_ID}/data`, { method: "DELETE" });
    const returnUser = localStorage.getItem("ledgermind-demo-return-user") || "demo-user";
    localStorage.removeItem("ledgermind-demo-return-user");
    if (displayMode) userIdInput.dataset.realValue = returnUser;
    else userIdInput.value = returnUser;
    monthManuallySelected = false;
    state.lastImport = null;
    loadLocalAgentState();
    await syncAfterChange("演示账本已清除，真实账本未受影响");
  });
}

function renderAgentAnswer(result) {
  state.agentProvider = result.provider === "SiliconFlow" ? "SiliconFlow" : "local";
  state.agentCallStatus = result.provider === "SiliconFlow" ? "cloud" : "fallback";
  state.lastAgentAt = new Date().toISOString();
  addAuditLog({ type: "智能体生成任务流", title: state.lastAgentQuestion || "财务分析任务", source: result.provider === "SiliconFlow" ? "云端模型" : "本地分析", impact: `${agentTaskSteps(state.lastAgentQuestion, result.answer).length} 个建议步骤`, result: "已建议" });
  if (result.provider !== "SiliconFlow") addAuditLog({ type: "本地分析回退", title: "云端不可用，已使用本地账本分析", source: "智能体", impact: "只读分析，不修改账本", result: "已完成" });
  renderDiagnostics();
  document.querySelector("#agent-model-state").textContent = state.agentCallStatus === "cloud"
    ? "DeepSeek V4 Flash · 云端"
    : state.agentCallStatus === "fallback"
      ? "本地分析"
      : getSiliconFlowApiKey() ? "DeepSeek V4 Flash · 就绪" : "本地账本分析";
  if (displayMode) {
    renderDisplayModeAgentPreview();
    return;
  }
  agentAnswerEl.classList.remove("loading");
  agentAnswerEl.replaceChildren();
  const title = document.createElement("span");
  title.textContent = state.agentProvider === "SiliconFlow" ? "智能体回答 · 云端模型" : "智能体回答 · 本地分析";
  if (state.agentProvider !== "SiliconFlow") {
    const fallback = document.createElement("div");
    fallback.className = "fallback-notice";
    fallback.textContent = "当前云端模型不可用或未启用，已使用本地账本分析生成结果。";
    agentAnswerEl.append(title, fallback);
  } else {
    agentAnswerEl.append(title);
  }
  const structured = structureAgentAnswer(result.answer ?? "没有生成回答。", result.actions ?? []);
  const sourceLabel = `${monthInput.value.replace("-", " 年 ")} 月账本 · ${currentMonthTransactions().length} 笔交易`;
  const answer = document.createElement("div");
  answer.className = "agent-answer-body";
  answer.append(
    answerSection("结论", structured.summary),
    answerList("重点发现", structured.points),
    answerList("建议操作", structured.nextSteps),
    answerSection("数据来源", sourceLabel),
    answerSection("模型来源", state.agentProvider === "SiliconFlow" ? "云端模型 · DeepSeek V4 Flash" : "本地分析 · 当前设备账本规则")
  );
  const cards = document.createElement("div");
  cards.className = "agent-answer-cards";
  for (const card of result.cards ?? []) {
    const item = document.createElement("strong");
    item.textContent = `${card.label}: ${card.value}`;
    cards.append(item);
  }
  const actions = document.createElement("div");
  actions.className = "agent-actions";
  for (const action of inferAgentActions(state.lastAgentQuestion, result.answer)) {
    actions.append(actionButton(action.label, () => handleAgentAction(action.id)));
  }
  agentAnswerEl.append(answer, cards, actions);
  agentAnswerEl.append(renderAgentTaskFlow(state.lastAgentQuestion, result.answer));
  renderMobileAgentAnswer(structured);
}

function agentTaskSteps(question, answer) {
  const text = `${question ?? ""} ${answer ?? ""}`;
  const steps = [];
  const add = (id, title, description, actionId, modifying = false) => {
    if (!steps.some((item) => item.id === id)) steps.push({ id, title, description, actionId, modifying });
  };
  add("related", "查看相关交易", "定位与问题直接相关的账本明细。", /餐饮|外卖|咖啡/.test(text) ? "filter-food" : /订阅|周期/.test(text) ? "filter-subscriptions" : "transactions");
  if (/餐饮|外卖|咖啡|高频/.test(text)) add("merchant", "筛选高频商户", "聚焦重复出现的消费渠道。", "filter-food");
  if (/预算|风险|超支|节省|餐饮/.test(text)) add("budget", "分析预算风险", "检查分类预算使用率和月底风险。", "budget-risks");
  if (/节省|减少|餐饮|订阅/.test(text)) add("saving", "生成节省建议", "结合频率、订阅和预算形成可执行建议。", "saving-plan");
  if (/分类|餐饮|订阅|规则/.test(text)) add("rule", "创建规则草稿", "仅填充草稿，确认后才会创建规则。", /订阅|周期/.test(text) ? "draft-recurring-rule" : "draft-food-rule", true);
  add("report", "导出分析结果", "将本月摘要导出为中文 Markdown。", "export-report");
  return steps.slice(0, 6);
}

function renderAgentTaskFlow(question, answer) {
  const section = document.createElement("section");
  section.className = "agent-task-flow";
  const header = document.createElement("div");
  header.className = "agent-task-flow-header";
  header.append(strongText("智能体任务流"), textSpan("由你决定每一步是否执行"));
  const list = document.createElement("div");
  list.className = "agent-task-list";
  agentTaskSteps(question, answer).forEach((step, index) => {
    const completed = state.completedTaskSteps.has(step.id);
    const item = document.createElement("article");
    item.className = completed ? "completed" : "";
    const indexEl = textSpan(completed ? "✓" : String(index + 1), "task-step-index");
    const copy = document.createElement("div");
    copy.append(strongText(step.title), textSpan(step.description));
    const status = pill(completed ? "已完成" : step.modifying ? "待确认" : "可执行", `status-badge ${completed ? "confirmed" : step.modifying ? "pending" : "ignored"}`);
    const button = actionButton(completed ? "已执行" : step.modifying ? "加入待执行" : "执行", () => executeAgentTaskStep(step, item));
    button.disabled = completed;
    item.append(indexEl, copy, status, button);
    list.append(item);
  });
  section.append(header, list);
  return section;
}

function executeAgentTaskStep(step, item) {
  if (step.modifying) {
    enqueuePendingAction({
      type: "创建分类规则",
      title: step.actionId === "draft-recurring-rule" ? "创建订阅分类规则" : "创建餐饮分类规则",
      impact: "仅生成规则草稿；实际创建前仍需确认",
      risk: "规则会影响未来同类交易的自动分类",
      source: "智能体建议",
      draft: step.actionId === "draft-recurring-rule" ? "把已确认的订阅商户自动归为订阅 / 视频" : "把常见外卖和餐饮商户自动归为餐饮",
      action: "create-rule"
    });
  } else {
    handleAgentAction(step.actionId);
  }
  state.completedTaskSteps.add(step.id);
  item.classList.add("completed");
  item.querySelector(".status-badge").textContent = "已完成";
  item.querySelector(".status-badge").className = "status-badge confirmed";
  const button = item.querySelector("button");
  button.textContent = "已执行";
  button.disabled = true;
}

function inferAgentActions(question, answer) {
  const text = `${question ?? ""} ${answer ?? ""}`;
  const actions = [];
  const add = (id, label) => {
    if (!actions.some((item) => item.id === id)) actions.push({ id, label });
  };
  if (/餐饮|外卖|咖啡/.test(text)) {
    add("filter-food", "查看餐饮交易");
    add("draft-food-rule", "创建分类规则");
    add("saving-plan", "生成节省计划");
  }
  if (/订阅|周期|扣费/.test(text)) {
    add("filter-subscriptions", "筛选订阅交易");
    add("draft-recurring-rule", "标记为周期扣费");
    add("saving-plan", "生成节省计划");
  }
  if (/预算|超支|风险/.test(text)) add("budget-risks", "查看预算风险");
  if (/月报|总结|本月/.test(text)) add("monthly-report", "查看月度报告");
  if (/导出|报告/.test(text)) add("export-report", "导出本月月报");
  if (/待确认|审核|分类/.test(text)) add("review-inbox", "打开智能审核箱");
  if (actions.length === 0) {
    add("transactions", "查看交易明细");
    add("review-inbox", "打开智能审核箱");
    add("monthly-report", "查看月度报告");
  }
  return actions.slice(0, 4);
}

function handleAgentAction(action) {
  if (action === "filter-food") return filterTransactions("餐饮");
  if (action === "filter-subscriptions") return filterTransactions("订阅");
  if (action === "transactions") return filterTransactions("");
  if (action === "review-inbox") {
    statusFilter.value = "pending_review";
    renderTransactions();
    return navigateToFeature("transactions", "#transactions");
  }
  if (action === "budget-risks") return navigateToFeature("insights", "#workbench");
  if (action === "monthly-report") return navigateToFeature("insights", "#monthly-report-card");
  if (action === "export-report") return exportMonthlyReportMarkdown();
  if (action === "saving-plan") return askAgent("请基于本月账本生成一份具体、可执行的节省计划。");
  if (action === "draft-food-rule") return prepareRuleDraft("把常见外卖和餐饮商户自动归为餐饮");
  if (action === "draft-recurring-rule") {
    if (!window.confirm("将为周期扣费创建规则草稿，不会直接修改交易。是否继续？")) return;
    return prepareRuleDraft("把已确认的订阅商户自动归为订阅 / 视频");
  }
}

function filterTransactions(query) {
  searchInput.value = query;
  statusFilter.value = "";
  state.importJobFilter = "";
  renderTransactions();
  navigateToFeature("transactions", "#transactions");
}

function prepareRuleDraft(command) {
  ruleCommandInput.value = command;
  navigateToFeature("settings", "#rules-panel");
  ruleCommandInput.focus();
  showToast("规则草稿已填充，确认内容后再创建");
}

function enqueuePendingAction(action) {
  const id = action.id ?? `pending-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if (!state.pendingActions.some((item) => item.title === action.title && item.draft === action.draft)) {
    const createdAt = action.createdAt ?? new Date().toISOString();
    state.pendingActions.unshift({ ...action, id, createdAt, expiresAt: action.expiresAt ?? new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString() });
    savePendingDrafts();
    addAuditLog({ type: "智能体建议", title: action.title, source: action.source, impact: action.impact, result: "已建议" });
  }
  renderPendingActions();
  navigateToFeature("transactions", "#pending-actions-panel");
  showToast("建议已加入待执行操作，尚未修改任何数据");
}

function renderPendingActions() {
  const root = document.querySelector("#pending-action-list");
  const count = document.querySelector("#pending-action-count");
  if (!root || !count) return;
  root.replaceChildren();
  const actions = displayMode && state.pendingActions.length === 0 ? [{
    id: "display-rule",
    type: "创建分类规则",
    title: "把示例外卖商户自动归为餐饮",
    impact: "预计影响 18 笔历史交易和未来同类交易",
    risk: "执行前需确认规则内容",
    source: "智能体建议",
    draft: "把示例外卖商户自动归为餐饮",
    action: "create-rule",
    preview: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }] : state.pendingActions;
  count.textContent = `${actions.length} 项待确认`;
  if (actions.length === 0) {
    root.append(empty("暂无待执行操作", "智能体提出修改建议后，会先放到这里等待你的确认。"));
    return;
  }
  for (const action of actions) {
    const expired = isDraftExpired(action);
    const card = document.createElement("article");
    card.className = "pending-action-card";
    const copy = document.createElement("div");
    copy.className = "pending-action-copy";
    copy.append(
      pill(expired ? "需重新确认" : action.type, `status-badge ${expired ? "risk" : "pending"}`),
      strongText(action.title),
      detailLine("影响范围", action.impact),
      detailLine("风险提示", action.risk),
      detailLine("来源", action.source),
      detailLine("操作类型", action.type),
      detailLine("创建时间", formatFullDateTime(action.createdAt)),
      detailLine("有效状态", expired ? "已超过 24 小时，不能直接执行" : "有效期内")
    );
    const buttons = document.createElement("div");
    buttons.className = "pending-action-buttons";
    buttons.append(
      actionButton(expired ? "重新确认" : "确认执行", () => expired ? reconfirmPendingAction(action) : confirmPendingAction(action), "primary"),
      actionButton("修改", () => editPendingAction(action)),
      actionButton("取消", () => cancelPendingAction(action), "danger")
    );
    card.append(copy, buttons);
    root.append(card);
  }
}

function detailLine(label, value) {
  const line = document.createElement("span");
  line.append(strongText(`${label}：`), document.createTextNode(value || "未记录"));
  return line;
}

function confirmPendingAction(action) {
  if (isDraftExpired(action)) {
    showToast("草稿已过期，请先重新确认", "error");
    return;
  }
  if (!window.confirm(`确认执行“${action.title}”？\n${action.risk}`)) return;
  if (action.rule?.preview || action.preview) {
    showToast("展示模式示例不会修改真实数据");
    return;
  }
  if (action.action === "create-rule") {
    prepareRuleDraft(action.draft);
    showToast("规则草稿已准备，请在规则输入框中再次确认并创建");
  } else if (action.action === "budget") {
    budgetCategorySelect.value = action.categoryId ?? "";
    navigateToFeature("insights", "#workbench");
    budgetLimitInput.focus();
    showToast("预算分类已选择，请填写额度后保存");
  } else if (action.action === "export-report") {
    exportMonthlyReportMarkdown();
  } else if (action.action === "delete-rule" && action.rule) {
    deleteRule(action.rule);
  } else {
    handleAgentAction(action.action ?? "transactions");
  }
  if (!action.preview) state.pendingActions = state.pendingActions.filter((item) => item.id !== action.id);
  savePendingDrafts();
  addAuditLog({ type: action.type, title: action.title, source: action.source, impact: action.impact, result: "已确认" });
  renderPendingActions();
}

function reconfirmPendingAction(action) {
  if (!window.confirm(`该草稿已超过 24 小时。是否重新确认其内容和影响范围？\n${action.title}`)) return;
  action.createdAt = new Date().toISOString();
  action.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  savePendingDrafts();
  addAuditLog({ type: "草稿重新确认", title: action.title, source: action.source, impact: action.impact, result: "已确认" });
  renderPendingActions();
}

function editPendingAction(action) {
  if (action.action === "create-rule") {
    prepareRuleDraft(action.draft);
  } else {
    handleAgentAction(action.action ?? "transactions");
  }
}

function cancelPendingAction(action) {
  if (action.preview) {
    showToast("展示模式示例不会修改真实队列");
    return;
  }
  state.pendingActions = state.pendingActions.filter((item) => item.id !== action.id);
  savePendingDrafts();
  addAuditLog({ type: "用户取消待执行操作", title: action.title, source: action.source, impact: action.impact, result: "已取消" });
  renderPendingActions();
  showToast("已取消待执行操作");
}

function isDraftExpired(action) {
  return agentSafetyUtils.isDraftExpired(action);
}

function localAgentNamespace() {
  return agentSafetyUtils.draftNamespace(currentUserId(), { displayMode, demoUserId: DEMO_USER_ID });
}

function localAgentKey(kind) {
  return `ledgermind-agent-${kind}:${localAgentNamespace()}`;
}

function readLocalList(kind) {
  try {
    const value = JSON.parse(localStorage.getItem(localAgentKey(kind)) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeLocalList(kind, value) {
  localStorage.setItem(localAgentKey(kind), JSON.stringify(value));
}

function loadLocalAgentState() {
  state.pendingActions = readLocalList("drafts");
  state.auditLogs = readLocalList("audit");
  state.exportRecords = readLocalList("exports");
}

function savePendingDrafts() {
  writeLocalList("drafts", state.pendingActions.slice(0, 50));
}

function clearPendingDrafts() {
  if (!state.pendingActions.length) return showToast("草稿箱已经为空");
  if (!window.confirm(`确定清空 ${state.pendingActions.length} 条待执行草稿？此操作不会修改账本。`)) return;
  const count = state.pendingActions.length;
  state.pendingActions = [];
  savePendingDrafts();
  addAuditLog({ type: "用户清空待执行草稿", title: "清空待执行操作草稿箱", source: "用户操作", impact: `${count} 条草稿`, result: "已完成" });
  renderPendingActions();
}

function addAuditLog(entry) {
  state.auditLogs = agentSafetyUtils.appendAuditLog(state.auditLogs, entry);
  writeLocalList("audit", state.auditLogs);
  renderAuditLogs();
}

function clearAuditLogs() {
  if (!state.auditLogs.length) return showToast("审计日志已经为空");
  if (!window.confirm("确定清空当前环境的操作审计日志？")) return;
  state.auditLogs = [];
  writeLocalList("audit", []);
  renderAuditLogs();
  showToast("审计日志已清空");
}

function runGuideAction(action) {
  if (action === "import") {
    navigateToFeature("transactions", "#workbench");
    window.setTimeout(() => billFileInput.click(), 180);
    return;
  }
  if (action === "demo") return loadDemoLedger();
  if (action === "review") return navigateToFeature("transactions", "#agent-inbox");
  if (action === "agent") return navigateToFeature("agent", "#agent-inbox");
  if (action === "drafts") return navigateToFeature("agent", "#pending-actions-panel");
  if (action === "budget") {
    state.reportTab = "budget";
    renderReportCenter();
    return navigateToFeature("insights", "#reports-panel");
  }
  if (action === "quality") return navigateToFeature("settings", "#diagnostics-panel");
  if (action === "reports") {
    state.reportTab = "monthly";
    renderReportCenter();
    return navigateToFeature("insights", "#reports-panel");
  }
  if (action === "settings") return navigateToFeature("settings", "#privacy-panel");
}

function renderQuickStart() {
  const dismissed = localStorage.getItem("ledgermind-quick-start-dismissed") === "true";
  quickStartPanel.hidden = dismissed && !displayMode;
}

function renderNextActions() {
  nextActionList.replaceChildren();
  const rows = currentMonthTransactions();
  const pending = displayMode ? 2 : rows.filter((item) => item.status === "pending_review").length;
  const drafts = displayMode ? Math.max(1, state.pendingActions.length) : state.pendingActions.length;
  const budgetRisks = displayMode ? 1 : state.budgets.filter((item) => item.status && item.status !== "ok").length;
  const quality = displayMode ? { score: 91 } : calculateDataQuality();
  const suggestions = [];
  const add = (priority, title, copy, actions) => suggestions.push({ priority, title, copy, actions });

  if (rows.length === 0 && !displayMode) {
    add(1, "还没有账本数据", "建议先导入微信或支付宝账单，也可以加载演示账本体验完整流程。", [["导入账单", "import"], ["加载演示账本", "demo"]]);
  } else {
    if (pending > 0) add(1, `你有 ${pending} 笔交易需要确认`, "建议先处理低置信度分类、异常消费和周期性扣费。", [["打开智能审核箱", "review"]]);
    if (drafts > 0) add(2, `你有 ${drafts} 个待执行操作草稿`, "这些是智能体建议但尚未执行的操作，确认后才会修改账本。", [["查看草稿箱", "drafts"]]);
    if (budgetRisks > 0) add(3, "发现预算风险", "部分分类可能在月底前超支，建议查看预算报告。", [["查看预算风险", "budget"]]);
    if (quality && quality.score < 65) add(4, "账本数据质量需要优化", "处理待确认、补充预算或规则后，月报会更可靠。", [["查看修复建议", "quality"]]);
  }

  if (suggestions.length === 0) {
    add(5, "账本状态良好", "可以查看月度报告，或询问智能体获取本月节省建议。", [["查看月报", "reports"], ["问问智能体", "agent"]]);
  }

  suggestions.sort((left, right) => left.priority - right.priority).slice(0, 3).forEach((item, index) => {
    const card = document.createElement("article");
    card.className = index === 0 ? "next-action-card primary" : "next-action-card";
    const marker = document.createElement("span");
    marker.className = "next-action-marker";
    marker.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("div");
    copy.append(strongText(item.title), textSpan(item.copy));
    const actions = document.createElement("div");
    actions.className = "next-action-buttons";
    item.actions.forEach(([label, action]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.className = action === "demo" ? "secondary-button" : "";
      button.addEventListener("click", () => runGuideAction(action));
      actions.append(button);
    });
    card.append(marker, copy, actions);
    nextActionList.append(card);
  });
}

function markOnboardingSeen() {
  localStorage.setItem("ledgermind-seen-onboarding", "true");
}

function maybeOpenOnboarding() {
  if (!displayMode && localStorage.getItem("ledgermind-seen-onboarding") !== "true") openOnboarding();
}

function openOnboarding() {
  onboardingLayer.hidden = false;
  document.body.classList.add("has-modal");
}

function closeOnboarding() {
  onboardingLayer.hidden = true;
  if (featureMapLayer.hidden) document.body.classList.remove("has-modal");
}

function openFeatureMap() {
  featureMapLayer.hidden = false;
  document.body.classList.add("has-modal");
}

function closeFeatureMap() {
  featureMapLayer.hidden = true;
  if (onboardingLayer.hidden) document.body.classList.remove("has-modal");
}

function installGroupedNavigation() {
  const nav = document.querySelector(".nav-list");
  if (!nav || nav.dataset.grouped === "true") return;
  const groups = [
    ["开始", [["总览", "#overview"], ["快速开始", "#quick-start-panel"], ["Showcase", "/showcase"]]],
    ["账本", [["导入账单", "#workbench"], ["交易明细", "#transactions"], ["智能审核箱", "#agent-inbox"]]],
    ["分析", [["预算管理", "#workbench"], ["账本洞察", "#insights-panel"], ["报告中心", "#reports-panel"]]],
    ["智能体", [["财务智能体", "#settings-panel"], ["待执行草稿", "#pending-actions-panel"], ["自动化规则", "#automation-panel"], ["智能体记忆", "#memory-panel"], ["操作审计", "#diagnostics-panel"]]],
    ["系统", [["隐私与模型", "#privacy-panel"], ["系统诊断", "#diagnostics-panel"], ["设置", "#settings-panel"]]]
  ];
  nav.replaceChildren();
  let sequence = 1;
  groups.forEach(([label, links]) => {
    const section = document.createElement("section");
    section.className = "nav-group";
    const title = document.createElement("strong");
    title.textContent = label;
    const list = document.createElement("div");
    links.forEach(([text, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.innerHTML = `<span>${String(sequence++).padStart(2, "0")}</span>${text}`;
      list.append(link);
    });
    section.append(title, list);
    nav.append(section);
  });
  nav.dataset.grouped = "true";
  const updateActive = () => {
    const current = window.location.hash || "#overview";
    nav.querySelectorAll("a").forEach((link) => link.classList.toggle("active", link.getAttribute("href") === current));
  };
  window.addEventListener("hashchange", updateActive);
  updateActive();
}

function installModuleHelp() {
  const modules = [
    [".desktop-hero .hero-copy h2", "财务指挥中心", "汇总本月收支、智能体状态、待处理事项和关键财务指标，是进入系统后的主控制台。"],
    ["#ledger-health-card h2", "账本健康度", "评估本月财务状态，综合预算风险、异常消费、支出结构和节省空间。"],
    ["#data-quality-card h2", "数据质量", "判断当前账本是否适合生成可靠分析，主要参考待确认比例、商户完整性、预算覆盖和规则覆盖。"],
    [".review-inbox .panel-heading h2", "智能审核箱", "集中处理需要你确认的事项，包括低置信度分类、异常消费、预算风险和周期扣费。"],
    ["#pending-actions-panel .panel-heading h2", "待执行草稿箱", "保存智能体建议但尚未执行的修改类操作，所有修改都需要你确认后才会生效。"],
    [".audit-panel .panel-heading h3", "操作审计", "记录智能体建议、用户确认、取消和导出等关键操作，方便追踪系统行为。"],
    ["#reports-panel .panel-heading h2", "报告中心", "集中查看月度报告、预算报告、订阅报告、数据质量报告，并支持导出 Markdown。"],
    ["#memory-panel .panel-heading h2", "智能体记忆", "展示系统从你的分类修改中学习到的商户偏好，可禁用或转为规则。"],
    ["#automation-panel .panel-heading h2", "自动化规则", "用中文自然语言创建分类规则，例如“把滴滴自动归为交通”。"],
    ["#diagnostics-panel > .panel-heading h2", "系统诊断", "检查后端、模型配置、账本、预算、规则、导入和展示模式状态。"]
  ];
  modules.forEach(([selector, label, help]) => {
    const heading = document.querySelector(selector);
    if (!heading || heading.querySelector(".module-help")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "module-help";
    button.textContent = "?";
    button.dataset.help = help;
    button.setAttribute("aria-label", `${label}说明`);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const expanded = button.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".module-help[aria-expanded='true']").forEach((item) => item.setAttribute("aria-expanded", "false"));
      button.setAttribute("aria-expanded", String(!expanded));
    });
    heading.append(button);
  });
  demoModeToggleButton.title = "展示模式用于演示和截图，会隐藏用户、商户和金额，不影响真实账本。";
  const settingsGuide = document.createElement("button");
  settingsGuide.type = "button";
  settingsGuide.className = "mini-button";
  settingsGuide.textContent = "功能地图";
  settingsGuide.addEventListener("click", openFeatureMap);
  document.querySelector("#privacy-panel .panel-heading")?.append(settingsGuide);
}

function navigateToFeature(mobilePage, selector) {
  if (isMobileViewport()) {
    setMobilePage(mobilePage);
  }
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  if (isMobileViewport()) {
    window.scrollTo({ left: 0, top: window.scrollY });
  }
}

function renderMobileAgentAnswer(structured) {
  mobileAgentAnswerEl.replaceChildren();
  const title = document.createElement("strong");
  title.textContent = "结论";
  const summary = document.createElement("p");
  summary.textContent = structured.summary;
  const listTitle = document.createElement("strong");
  listTitle.textContent = "重点发现";
  const list = document.createElement("ul");
  for (const point of structured.points.slice(0, 3)) {
    const item = document.createElement("li");
    item.textContent = point;
    list.append(item);
  }
  mobileAgentAnswerEl.append(title, summary);
  if (list.childElementCount) {
    mobileAgentAnswerEl.append(listTitle, list);
  }
  const source = document.createElement("small");
  source.textContent = state.agentProvider === "SiliconFlow" ? "数据来源：云端模型 · DeepSeek V4 Flash" : "数据来源：本地账本分析";
  mobileAgentAnswerEl.append(source);
}

function answerSection(label, text) {
  const section = document.createElement("section");
  const heading = document.createElement("strong");
  heading.textContent = label;
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  section.append(heading, paragraph);
  return section;
}

function answerList(label, items) {
  const section = document.createElement("section");
  const heading = document.createElement("strong");
  heading.textContent = label;
  const list = document.createElement("ul");
  for (const item of items.slice(0, 4)) {
    const row = document.createElement("li");
    row.textContent = item;
    list.append(row);
  }
  section.append(heading, list);
  return section;
}

function structureAgentAnswer(answer, actions = []) {
  const cleaned = cleanAgentAnswerText(answer);
  const sentences = splitAgentSentences(cleaned);
  const fallback = "我已经根据当前账本完成分析。";
  const summarySentenceCount = sentences[0] && sentences[0].length >= 12 ? 1 : 2;
  const summarySource = sentences.slice(0, summarySentenceCount).filter(Boolean).join("，");
  const summary = compactSentence(summarySource || cleaned || fallback, 90);
  const points = sentences
    .slice(summarySentenceCount)
    .map((item) => compactSentence(item, 80))
    .filter(Boolean)
    .slice(0, 4);
  const nextSteps = actions.length
    ? actions.map((item) => compactSentence(item, 24)).filter(Boolean).slice(0, 3)
    : ["先确认待分类交易", "检查订阅扣费", "再生成节省计划"];

  return {
    summary,
    points: points.length ? points : ["优先处理待确认交易，避免月报和预算被未分类项目影响。"],
    nextSteps
  };
}

function cleanAgentAnswerText(answer) {
  return String(answer ?? "")
    .replace(/\*\*/g, "")
    .replace(/[`#>_~]/g, "")
    .replace(/[📊⚠️🔧✅❌]/g, "")
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/^\s*\d+[.)、]\s*/gm, "")
    .replace(/\n+\s*/g, "。")
    .replace(/\s+/g, " ")
    .replace(/。+/g, "。")
    .trim();
}

function splitAgentSentences(text) {
  return text
    .split(/(?<=[。！？；;])/)
    .map((item) => item.replace(/^[。,\s]+|[。,\s]+$/g, "").trim())
    .filter((item) => item.length > 0);
}

function compactSentence(text, maxLength) {
  const value = String(text ?? "").trim();
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1)}…`;
}

function setMobilePage(page) {
  document.body.classList.remove(
    "mobile-page-home",
    "mobile-page-transactions",
    "mobile-page-insights",
    "mobile-page-agent",
    "mobile-page-settings"
  );
  document.body.classList.add(`mobile-page-${page}`);
  for (const link of mobileNavLinks) {
    link.classList.toggle("active", link.dataset.mobilePage === page);
  }
  if (!isMobileViewport()) {
    return;
  }
  const titles = {
    home: ["今日账本", "先看总览，再处理需要确认的事项。"],
    transactions: ["记一笔 / 导账单", "新增、导入、分类和确认每一笔交易。"],
    insights: ["本月分析", "查看趋势、预算、异常和可节省空间。"],
    agent: ["问智能体", "让 LedgerMind 解释支出、生成建议和创建规则。"],
    settings: ["本地与模型", "管理本机数据、分类规则和云端模型 Key。"]
  };
  const [title, subtitle] = titles[page] ?? titles.home;
  const topTitle = document.querySelector(".header-title h2");
  const topSubtitle = document.querySelector(".header-title > span");
  if (topTitle) {
    topTitle.textContent = title;
  }
  if (topSubtitle) {
    topSubtitle.textContent = subtitle;
  }
  window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
}

function runCommand(value) {
  const command = String(value ?? "").trim();
  if (!command) {
    showToast("请输入要执行的命令", "error");
    return;
  }
  commandInput.value = "";
  if (/导入|账单文件|微信账单|支付宝账单/.test(command)) {
    billFileInput.click();
    return;
  }
  if (/交易|待确认|分类/.test(command)) {
    navigateToFeature("transactions", "#transactions");
    return;
  }
  if (/月报|报表|洞察|预算|图表/.test(command)) {
    navigateToFeature("insights", "#insights-panel");
    return;
  }
  askAgent(command);
}

const commandPaletteCommands = [
  ["导入微信账单", "选择微信导出的 CSV / XLSX", () => billFileInput.click()],
  ["导入支付宝账单", "选择支付宝导出的 CSV / XLSX", () => billFileInput.click()],
  ["导入 CSV / XLSX", "自动识别来源、编码和表头", () => billFileInput.click()],
  ["切换到本月", "回到当前自然月", () => { monthInput.value = new Date().toISOString().slice(0, 7); mobileMonthInput.value = monthInput.value; refreshAll(); }],
  ["查看待确认交易", "筛选需要人工审核的交易", () => { statusFilter.value = "pending_review"; renderTransactions(); navigateToFeature("transactions", "#transactions"); }],
  ["打开智能审核箱", "查看低置信度与风险事项", () => navigateToFeature("transactions", "#agent-inbox")],
  ["生成月度报告", "打开本月中文财务简报", () => navigateToFeature("insights", "#monthly-report-card")],
  ["导出本月 CSV", "下载当前月份交易明细", () => exportCsvButton.click()],
  ["导出 JSON 备份", "备份当前用户账本", () => backupJsonButton.click()],
  ["开启展示模式", "对商户、用户和金额进行脱敏", () => { if (!displayMode) demoModeToggleButton.click(); }],
  ["加载演示账本", "使用独立匿名示例数据", () => loadDemoLedger()],
  ["清除演示账本", "只清除独立演示用户数据", () => clearDemoLedger()],
  ["配置模型", "设置 SiliconFlow 与 DeepSeek", () => navigateToFeature("settings", "#privacy-panel")],
  ["打开系统诊断", "检查后端、模型和本地账本状态", () => navigateToFeature("settings", "#diagnostics-panel")],
  ["打开 Showcase", "查看 GitHub 项目展示页", () => { window.location.href = "/showcase"; }]
];

function openCommandPalette() {
  commandInput.blur();
  commandPaletteLayer.hidden = false;
  document.body.classList.add("has-modal");
  commandPaletteSearch.value = commandInput.value.trim();
  commandPaletteIndex = 0;
  renderCommandPalette();
  window.setTimeout(() => commandPaletteSearch.focus(), 0);
}

function closeCommandPalette() {
  if (!commandPaletteLayer || commandPaletteLayer.hidden) return;
  commandPaletteLayer.hidden = true;
  document.body.classList.remove("has-modal");
}

function filteredPaletteCommands() {
  const query = commandPaletteSearch.value.trim().toLowerCase();
  return commandPaletteCommands.filter(([title, description]) => `${title} ${description}`.toLowerCase().includes(query));
}

function renderCommandPalette() {
  const commands = filteredPaletteCommands();
  commandPaletteIndex = Math.max(0, Math.min(commandPaletteIndex, commands.length - 1));
  commandPaletteList.replaceChildren();
  if (!commands.length) {
    commandPaletteList.append(empty("没有匹配的命令", "可以直接向智能体提问"));
    return;
  }
  commands.forEach(([title, description, execute], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === commandPaletteIndex ? "active" : "";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(index === commandPaletteIndex));
    const copy = document.createElement("span");
    copy.append(strongText(title), textSpan(description));
    button.append(copy, textSpan("↵"));
    button.addEventListener("click", () => executePaletteCommand(execute));
    commandPaletteList.append(button);
  });
}

function handleCommandPaletteKeydown(event) {
  const commands = filteredPaletteCommands();
  if (event.key === "ArrowDown") {
    event.preventDefault();
    commandPaletteIndex = Math.min(commands.length - 1, commandPaletteIndex + 1);
    renderCommandPalette();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    commandPaletteIndex = Math.max(0, commandPaletteIndex - 1);
    renderCommandPalette();
  } else if (event.key === "Enter" && commands[commandPaletteIndex]) {
    event.preventDefault();
    executePaletteCommand(commands[commandPaletteIndex][2]);
  } else if (event.key === "Escape") {
    closeCommandPalette();
  }
}

function executePaletteCommand(execute) {
  closeCommandPalette();
  commandInput.value = "";
  execute();
}

function syncManualDateToMonth() {
  const month = monthInput.value;
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return;
  }
  const now = new Date();
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  const day = String(Math.min(now.getDate(), lastDay)).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  manualPaidAtInput.value = `${month}-${day}T${hour}:${minute}`;
}

function toMobileChineseAnswer(answer) {
  if (answer.includes("Offline Agent reviewed")) {
    return "本地智能体已完成离线分析：本月可优先检查订阅扣费和高频餐饮支出，预计仍有一部分可节省空间。";
  }
  if (answer.includes("conservative saving target")) {
    return "智能体建议：先从订阅服务、高频餐饮和异常商户开始排查，本月可以设置一个保守节省目标。";
  }
  if (answer.includes("recurring payment")) {
    return "智能体发现可能的周期扣费，请优先检查订阅列表，确认是否仍然需要。";
  }
  return answer;
}

function render() {
  renderMetrics();
  renderLedgerHealth();
  renderDataQuality();
  renderMonthlyReport();
  renderDailySummary();
  renderAnalytics();
  renderOperatingPanels();
  renderJobs();
  renderImportSummary();
  renderCategories();
  renderInsights();
  renderBudgets();
  renderRules();
  renderTransactions();
  renderMobileHome();
  renderFirstRunGuide();
  renderDiagnostics();
  renderDataQualityRepairs();
  renderAuditLogs();
  renderReportCenter();
  renderQuickStart();
  renderNextActions();
}

function renderFirstRunGuide() {
  firstRunGuide.hidden = true;
  demoLedgerBanner.hidden = currentUserId() !== DEMO_USER_ID;
  document.body.classList.toggle("demo-ledger-active", currentUserId() === DEMO_USER_ID);
}

function renderDiagnostics() {
  const latestJob = state.lastImport ?? state.jobs.slice().sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))[0];
  const backendLabels = {
    checking: "检测中",
    online: configuredApiBase() ? "远程后端已连接" : "本地后端正常",
    offline: "移动端本地模式",
    unavailable: "连接失败"
  };
  const agentLabels = {
    ready: "未调用",
    loading: "调用中",
    cloud: "云端模型成功",
    fallback: "本地分析回退"
  };
  setDiagnosticValue("diagnostic-backend", backendLabels[state.backendStatus] ?? "未检测");
  setDiagnosticValue("diagnostic-model", getSiliconFlowApiKey() ? "DeepSeek V4 Flash 已配置" : "需配置 · 本地回退可用");
  setDiagnosticValue("diagnostic-display", displayMode ? "已开启" : "未开启");
  setDiagnosticValue("diagnostic-ledger", state.transactions.length ? (currentUserId() === DEMO_USER_ID ? "演示数据" : "本地数据可用") : "暂无数据");
  setDiagnosticValue("diagnostic-transactions", `${state.transactions.length} 笔`);
  setDiagnosticValue("diagnostic-budgets", `${state.budgets.length} 项`);
  setDiagnosticValue("diagnostic-rules", `${state.rules.length} 条`);
  setDiagnosticValue("diagnostic-memories", `${state.rules.length} 条`);
  setDiagnosticValue("diagnostic-agent", state.lastAgentAt ? `${agentLabels[state.agentCallStatus] ?? "未检测"} · ${formatDiagnosticTime(state.lastAgentAt)}` : agentLabels[state.agentCallStatus] ?? "未调用");
  setDiagnosticValue("diagnostic-import", latestJob ? `${latestJob.importedRows ?? 0}/${latestJob.totalRows ?? 0} 行 · ${latestJob.status === "completed" ? "成功" : latestJob.status ?? "未检测"}` : "暂无记录");
  const quality = displayMode ? { score: 91 } : calculateDataQuality();
  setDiagnosticValue("diagnostic-data-quality", quality ? `${quality.score} 分 · ${quality.score >= 85 ? "适合分析" : quality.score >= 65 ? "需要确认" : "数据不足"}` : "数据不足");
}

function setDiagnosticValue(id, value) {
  const element = document.querySelector(`#${id}`);
  if (element) element.textContent = value;
}

function formatDiagnosticTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "时间未知" : date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function renderAnalytics() {
  renderDailyChart();
  renderTopMerchants();
  renderCategoryShares();
  renderStatusBreakdown();
  renderSourceBreakdown();
  renderDirectionBreakdown();
}

function renderOperatingPanels() {
  renderWorkflow();
  renderReviewInbox();
  renderMemoryPanel();
  renderPendingActions();
  renderAutomationPreview();
  renderAnomalyPanel();
  renderAgentAlert();
}

function renderWorkflow() {
  const root = document.querySelector("#workflow-list");
  root.replaceChildren();
  if (displayMode) {
    const previewItems = [
      ["09:12", "导入", "账单导入完成", "98 笔 · 微信 / 支付宝", "completed"],
      ["09:13", "分类", "自动分类完成", "94/98 笔 · 规则与商户记忆", "completed"],
      ["09:13", "去重", "重复交易检测完成", "3 笔重复已跳过", "completed"],
      ["09:14", "审核", "2 笔进入审核箱", "等待用户确认", "review"],
      ["09:14", "预算", "预算状态已更新", "1 个分类存在风险", "review"],
      ["09:15", "报告", "图表与月报已生成", "2026-05 · 演示账本", "completed"]
    ];
    let latestCompletedIndex = -1;
    previewItems.forEach((item, index) => { if (item[4] === "completed") latestCompletedIndex = index; });
    const visiblePreviewItems = previewItems.filter((item, index) => item[4] !== "completed" || index === latestCompletedIndex);
    for (const [time, step, title, detail, tone] of visiblePreviewItems) {
      const item = document.createElement("div");
      item.className = `timeline-item ${tone}`;
      item.append(textSpan(time, "workflow-time"), textSpan(step), strongText(title), emphasisText(detail));
      root.append(item);
    }
    return;
  }
  const rows = currentMonthTransactions();
  const classified = rows.filter((item) => item.categoryId).length;
  const pending = rows.filter((item) => item.status === "pending_review").length;
  const latestJob = state.jobs.slice().sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))[0];
  const budgetRisk = state.budgets.filter((item) => item.status !== "ok").length;
  const items = [
    [timelineTime(latestJob?.updatedAt), "导入", latestJob ? "账单导入完成" : "等待账单导入", latestJob ? `${latestJob.importedRows} 笔 · ${sourceName(latestJob.source)}` : "支持微信 / 支付宝", latestJob ? "completed" : "suggested"],
    [timelineTime(), "分类", "自动分类完成", `${classified}/${rows.length} 笔 · 规则与商户记忆`, classified === rows.length ? "completed" : "suggested"],
    [timelineTime(), "去重", "重复交易检测完成", `${latestJob?.duplicateRows ?? 0} 笔重复已跳过`, "completed"],
    [timelineTime(), "审核", `${pending} 笔进入审核箱`, pending ? "等待用户确认" : "无需人工处理", pending ? "review" : "completed"],
    [timelineTime(), "预算", "预算状态已更新", `${budgetRisk} 个分类存在风险`, budgetRisk ? "review" : "completed"],
    [timelineTime(), "报告", "图表与月报已生成", `${monthInput.value} · 本地账本`, "completed"]
  ];
  let latestCompletedIndex = -1;
  items.forEach((item, index) => { if (item[4] === "completed") latestCompletedIndex = index; });
  const visibleItems = items.filter((item, index) => item[4] !== "completed" || index === latestCompletedIndex);
  for (const [time, step, title, detail, tone] of visibleItems) {
    const item = document.createElement("div");
    item.className = `timeline-item ${tone}`;
    item.append(textSpan(time, "workflow-time"), textSpan(step), strongText(title), emphasisText(detail));
    root.append(item);
  }
}

function timelineTime(value = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "刚刚" : date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function renderReviewInbox() {
  const root = document.querySelector("#review-inbox-list");
  root.replaceChildren();
  if (displayMode) {
    document.querySelector("#review-inbox-count").textContent = "2 项待处理";
    const previewItems = [
      ["低置信度", "示例商户 B", "餐饮 / 正餐 · 置信度 68%", "确认分类"],
      ["预算风险", "餐饮预算接近上限", "已使用 ¥1,860.00 / ¥2,000.00", "查看预算"]
    ];
    for (const [badge, title, detail, action] of previewItems) {
      const article = document.createElement("article");
      article.className = "review-card high-priority";
      const content = document.createElement("div");
      content.className = "review-content";
      content.append(pill(badge, "status-badge pending"), strongText(title), textSpan(detail));
      const actions = document.createElement("div");
      actions.className = "review-actions";
      actions.append(actionButton(action, () => navigateToFeature("transactions", badge === "预算风险" ? "#workbench" : "#transactions"), "primary"));
      article.append(content, actions);
      root.append(article);
    }
    return;
  }
  const rows = currentMonthTransactions();
  const highAmountLine = Math.max(500, Number(state.report?.expense ?? 0) * 0.25);
  const transactions = rows
    .filter((item) => item.status === "pending_review" || Number(item.confidence ?? 0) < 0.75 || item.direction === "expense" && item.amount >= highAmountLine)
    .sort((left, right) => reviewPriority(right, highAmountLine) - reviewPriority(left, highAmountLine));
  const budgetRisks = state.budgets.filter((item) => item.status !== "ok");
  const recurring = state.insights?.recurringPaymentCandidates ?? [];
  const total = transactions.length + budgetRisks.length + recurring.length;
  document.querySelector("#review-inbox-count").textContent = `${total} 项待处理`;
  if (total === 0) {
    root.append(empty("当前没有需要确认的事项", "你的财务智能体已完成本月账本整理，可以直接查看月报或继续导入新账单。"));
    return;
  }
  for (const transaction of transactions.slice(0, 5)) {
    root.append(reviewTransactionCard(transaction, transaction.status === "pending_review" ? "待确认" : transaction.amount >= highAmountLine ? "高额消费" : "低置信度"));
  }
  for (const item of budgetRisks.slice(0, 2)) {
    const article = document.createElement("article");
    article.className = `review-card review-budget ${item.status === "over" ? "high-priority" : ""}`;
    const content = document.createElement("div");
    content.className = "review-content";
    content.append(
      pill(item.status === "over" ? "已超支" : "接近额度", "status-badge risk"),
      strongText(`${labelForCategory(item.budget.categoryId)}预算风险`),
      textSpan(`已使用 ${money(item.spent)} / ${money(item.budget.limitAmount)}`)
    );
    const actions = document.createElement("div");
    actions.className = "review-actions";
    actions.append(
      actionButton("查看预算", () => navigateToFeature("insights", "#workbench"), "primary"),
      actionButton("设置提醒", () => enqueuePendingAction({ type: "设置预算提醒", title: `设置${labelForCategory(item.budget.categoryId)}预算提醒`, impact: "影响当前月份该分类的预算提示", risk: "不会自动修改额度，需要你填写后保存", source: "预算风险", action: "budget", categoryId: item.budget.categoryId })),
      actionButton("问问智能体", () => askAgent(`分析${labelForCategory(item.budget.categoryId)}预算风险`))
    );
    article.append(content, actions);
    root.append(article);
  }
  for (const item of recurring.slice(0, 1)) {
    const article = document.createElement("article");
    article.className = "review-card review-recurring";
    const content = document.createElement("div");
    content.className = "review-content";
    content.append(pill("周期扣费", "status-badge pending"), strongText(displayName(item.merchantName ?? "未知订阅")), textSpan(`${money(item.amount)} · 建议确认是否仍在使用`));
    const actions = document.createElement("div");
    actions.className = "review-actions";
    actions.append(
      actionButton("准备标记", () => enqueuePendingAction({ type: "标记周期扣费", title: `标记${displayName(item.merchantName ?? "未知订阅")}为周期扣费`, impact: `关联 ${item.occurrences ?? item.transactionIds?.length ?? 0} 笔交易`, risk: "当前版本将生成订阅分类规则草稿，不直接批量修改历史交易", source: "审核箱", action: "create-rule", draft: `把${item.merchantName ?? "该商户"}自动归为订阅 / 视频` })),
      actionButton("问问智能体", () => askAgent(`分析这项周期扣费：${item.merchantName ?? "未知订阅"}`))
    );
    article.append(content, actions);
    root.append(article);
  }
}

function reviewPriority(transaction, highAmountLine) {
  return (transaction.status === "pending_review" ? 100 : 0)
    + (Number(transaction.confidence ?? 0) < 0.75 ? 60 : 0)
    + (transaction.direction === "expense" && transaction.amount >= highAmountLine ? 30 : 0);
}

function reviewTransactionCard(transaction, riskLabel) {
  const article = document.createElement("article");
  article.className = `review-card review-transaction ${transaction.status === "pending_review" || transaction.confidence < 0.75 ? "high-priority" : ""}`;
  article.dataset.transactionId = transaction.id;
  const content = document.createElement("div");
  content.className = "review-content";
  const badges = document.createElement("div");
  badges.className = "badge-row";
  badges.append(statusBadge(transaction.status), sourceBadge(transaction.source), pill(riskLabel, "ai-badge"));
  const title = document.createElement("div");
  title.className = "review-title";
  title.append(strongText(displayName(transaction.merchantName ?? transaction.counterparty ?? "未知商户")), amountText(transaction));
  content.append(
    badges,
    title,
    textSpan(`${labelForCategory(transaction.categoryId ?? "")} · 置信度 ${Math.round(Number(transaction.confidence ?? 0) * 100)}%`),
    textSpan(reasonFor(transaction), "review-reason")
  );
  const actions = document.createElement("div");
  actions.className = "review-actions";
  if (transaction.status === "pending_review") {
    actions.append(actionButton("确认", () => updateStatus(transaction, "confirmed"), "primary"));
  }
  actions.append(
    actionButton("修改", () => focusTransaction(transaction)),
    actionButton("忽略", () => updateStatus(transaction, "ignored")),
    actionButton("创建规则", () => suggestRuleFor(transaction)),
    actionButton("问问智能体", () => askAgent(`解释这笔交易：${transaction.merchantName ?? "未知商户"} ${money(transaction.amount)}`)),
    actionButton("删除", () => deleteTransaction(transaction), "danger")
  );
  article.append(content, actions);
  return article;
}

function focusTransaction(transaction) {
  searchInput.value = transaction.merchantName ?? transaction.counterparty ?? "";
  renderTransactions();
  navigateToFeature("transactions", "#transactions");
}

function suggestRuleFor(transaction) {
  const merchant = transaction.merchantName ?? transaction.counterparty ?? "该商户";
  enqueuePendingAction({
    type: "创建分类规则",
    title: `为${displayName(merchant)}创建分类规则`,
    impact: `${state.transactions.filter((item) => (item.merchantName ?? item.counterparty) === merchant).length} 笔相关交易及未来同类交易`,
    risk: "规则会影响未来自动分类，创建前请确认分类",
    source: "审核箱",
    action: "create-rule",
    draft: `把${merchant}自动归为${labelForCategory(transaction.categoryId ?? "life.daily")}`
  });
}

function renderMemoryPanel() {
  const root = document.querySelector("#memory-list");
  root.replaceChildren();
  const memories = displayMode && state.rules.length === 0 ? [{ id: "display-memory", pattern: "示例外卖商户", categoryId: "food.restaurant", createdAt: "2026-07-03T09:00:00+08:00", updatedAt: "2026-07-03T09:00:00+08:00", field: "merchantName", matchType: "contains", preview: true }] : state.rules;
  document.querySelector("#memory-count").textContent = `${memories.length} 条偏好`;
  if (memories.length === 0) {
    root.append(empty("修正交易分类后，智能体会在这里记住你的偏好"));
    return;
  }
  for (const rule of memories.slice(0, 4)) {
    const matched = displayMode && rule.preview ? state.transactions.slice(0, 18) : state.transactions.filter((transaction) => ruleMatchesTransaction(rule, transaction));
    const latest = matched.slice().sort((left, right) => right.paidAt.localeCompare(left.paidAt))[0];
    const article = document.createElement("article");
    article.className = "memory-explainer-card";
    const head = document.createElement("div");
    head.className = "memory-explainer-head";
    head.append(pill("已学习", "status-badge confirmed"), strongText(`${displayName(rule.pattern)} → ${labelForCategory(rule.categoryId)}`));
    const evidence = matched.length
      ? `学习依据：你已有 ${matched.length} 笔相关交易符合这一分类偏好。`
      : "学习依据：暂无足够的交易命中记录。";
    const facts = document.createElement("div");
    facts.className = "memory-facts";
    [
      ["学习依据", evidence.replace("学习依据：", "")],
      ["命中次数", `${displayMode && rule.preview ? 18 : matched.length} 次`],
      ["最近命中", displayMode && rule.preview ? "2026-07-03" : latest ? formatDateTime(latest.paidAt) : "暂无"],
      ["最近学习", formatDateTime(rule.updatedAt ?? rule.createdAt)],
      ["相关交易", `${displayMode && rule.preview ? 18 : matched.length} 笔`],
      ["可转为规则", "是"]
    ].forEach(([label, value]) => facts.append(detailLine(label, value)));
    const actions = document.createElement("div");
    actions.className = "memory-actions";
    actions.append(
      actionButton("继续使用", () => showToast("该记忆将继续用于分类解释"), "primary"),
      actionButton("禁用记忆", () => enqueuePendingAction({ type: "禁用记忆", title: `禁用${displayName(rule.pattern)}分类记忆`, impact: `${matched.length} 笔相关交易；不会修改历史分类`, risk: "后续同类交易将不再使用此偏好", source: "智能体记忆", action: "delete-rule", rule })),
      actionButton("转为规则", () => prepareRuleDraft(`把${rule.pattern}自动归为${labelForCategory(rule.categoryId)}`)),
      actionButton("查看相关交易", () => filterTransactions(rule.pattern))
    );
    article.append(head, facts, actions);
    root.append(article);
  }
}

function renderAutomationPreview() {
  const root = document.querySelector("#automation-preview-list");
  root.replaceChildren();
  if (state.rules.length === 0) {
    root.append(empty("输入自然语言规则，或在交易中修正分类"));
    return;
  }
  for (const rule of state.rules.slice(0, 3)) {
    const article = document.createElement("article");
    const copy = document.createElement("div");
    copy.append(strongText(`${rule.pattern} → ${labelForCategory(rule.categoryId)}`), textSpan(`优先级 ${rule.priority ?? 120} · ${formatDateTime(rule.updatedAt ?? rule.createdAt)}`));
    article.append(pill("启用", "status-badge confirmed"), copy);
    root.append(article);
  }
}

function renderAnomalyPanel() {
  const root = document.querySelector("#anomaly-list");
  root.replaceChildren();
  const recurring = state.insights?.recurringPaymentCandidates ?? [];
  const pending = currentMonthTransactions().filter((item) => item.status === "pending_review");
  const anomalies = [
    ...recurring.slice(0, 2).map((item) => ["订阅", `周期扣费：${item.merchantName ?? "未知商户"}`, `${money(item.amount)} · 建议确认是否仍在使用`]),
    ...(pending.length ? [["待处理", `${pending.length} 笔交易尚未确认`, "确认后会同步更新报表和图表"]] : [])
  ];
  document.querySelector("#anomaly-count").textContent = `${anomalies.length} 个提醒`;
  if (anomalies.length === 0) {
    root.append(empty("本月未发现需要处理的异常"));
    return;
  }
  for (const [risk, title, detail] of anomalies) {
    const article = document.createElement("article");
    article.append(textSpan(risk), strongText(title), paragraphText(detail));
    root.append(article);
  }
}

function renderAgentAlert() {
  const recurring = state.insights?.recurringPaymentCandidates ?? [];
  const pending = currentMonthTransactions().filter((item) => item.status === "pending_review");
  const label = document.querySelector("#agent-alert-label");
  const title = document.querySelector("#agent-alert-title");
  const copy = document.querySelector("#agent-alert-copy");
  if (pending.length > 0) {
    label.textContent = "待确认";
    title.textContent = `${pending.length} 笔交易需要处理`;
    copy.textContent = "确认分类后，本月报表、预算和图表会立即同步。";
    return;
  }
  if (recurring.length > 0) {
    label.textContent = "订阅检查";
    title.textContent = `发现 ${recurring.length} 项周期扣费`;
    copy.textContent = "建议检查仍在使用的服务，并关闭不需要的自动续费。";
    return;
  }
  label.textContent = "账本状态";
  title.textContent = "本月没有待处理异常";
  copy.textContent = "当前分类和确认状态正常，可以继续查看月报。";
}

function renderDailyChart() {
  const root = document.querySelector("#daily-chart");
  root.replaceChildren();
  const points = state.analytics?.dailyExpenses ?? [];
  const peak = Math.max(0, ...points.map((point) => point.expense));
  document.querySelector("#daily-peak").textContent = money(peak);
  const peakPoint = points.slice().sort((left, right) => right.expense - left.expense)[0];
  document.querySelector("#daily-insight").textContent = peak > 0 ? `${peakPoint.date} 支出最高，为 ${money(peak)} · 数据范围 ${monthInput.value}` : `${monthInput.value} 暂无支出趋势`;
  if (points.length === 0 || peak === 0) {
    root.append(empty("\u6682\u65e0\u6bcf\u65e5\u652f\u51fa"));
    return;
  }

  for (const point of points) {
    const bar = document.createElement("div");
    bar.className = "day-bar";
    bar.style.height = `${Math.max(6, (point.expense / peak) * 100)}%`;
    bar.title = `${point.date} ${money(point.expense)}`;
    root.append(bar);
  }
}

function renderTopMerchants() {
  const root = document.querySelector("#top-merchants");
  root.replaceChildren();
  const merchants = state.analytics?.topMerchants ?? [];
  const max = Math.max(0, ...merchants.map((item) => item.expense));
  document.querySelector("#merchant-count").textContent = String(merchants.length);
  document.querySelector("#merchant-insight").textContent = merchants[0] ? `${merchants[0].merchantName} 是本月最大支出商户，共 ${money(merchants[0].expense)}` : `${monthInput.value} 暂无商户数据`;
  if (merchants.length === 0) {
    root.append(empty("\u6682\u65e0\u5546\u6237\u6570\u636e"));
    return;
  }

  for (const item of merchants) {
    root.append(progressItem(item.merchantName, money(item.expense), max > 0 ? item.expense / max : 0, "blue"));
  }
}

function renderCategoryShares() {
  const root = document.querySelector("#category-shares");
  root.replaceChildren();
  const shares = state.analytics?.categoryShares ?? [];
  document.querySelector("#category-share-count").textContent = String(shares.length);
  document.querySelector("#category-insight").textContent = shares[0] ? `${labelForCategory(shares[0].categoryId)}占本月支出 ${Math.round(shares[0].percent * 100)}%` : `${monthInput.value} 暂无分类数据`;
  if (shares.length === 0) {
    root.append(empty("\u6682\u65e0\u5360\u6bd4\u6570\u636e"));
    return;
  }

  const normalized = shares
    .filter((item) => item.expense > 0)
    .map((item) => ({
      label: labelForCategory(item.categoryId),
      value: item.expense,
      percent: item.percent,
      color: categoryColors[item.categoryId] ?? chartColors[0]
    }))
    .sort((left, right) => right.value - left.value);
  root.append(donutChart(normalized, "分类", "category"));
  for (const item of normalized.slice(0, 6)) {
    root.append(progressItem(item.label, `${money(item.value)} · ${Math.round(item.percent * 100)}%`, item.percent, "green"));
  }
}

function renderStatusBreakdown() {
  const root = document.querySelector("#status-breakdown");
  root.replaceChildren();
  const rows = currentMonthTransactions();
  const items = aggregateBy(rows, (item) => statusLabel(item.status), (item) => item.amount).map((item) => ({ ...item, color: item.label === "待确认" ? "#c79b55" : item.label === "已忽略" ? "#8391a2" : "#4fb8aa" }));
  document.querySelector("#status-breakdown-count").textContent = `${rows.length} 笔`;
  const pendingCount = rows.filter((item) => item.status === "pending_review").length;
  document.querySelector("#status-insight").textContent = pendingCount ? `${pendingCount} 笔交易需要确认，处理后报表会实时更新` : "本月交易状态已全部处理";
  if (items.length === 0) {
    root.append(empty("暂无状态数据"));
    return;
  }
  root.append(donutChart(items, "状态", "status"));
  for (const item of items) {
    root.append(progressItem(item.label, `${item.count} 笔 · ${money(item.value)}`, item.percent, item.label === "待确认" ? "warn" : "green"));
  }
}

function renderSourceBreakdown() {
  const root = document.querySelector("#source-breakdown");
  root.replaceChildren();
  const rows = currentMonthTransactions();
  const items = aggregateBy(rows, (item) => sourceName(item.source), (item) => item.amount).map((item) => ({ ...item, color: item.label === "微信" ? "#58a47b" : item.label === "支付宝" ? "#638fc5" : "#8391a2" }));
  document.querySelector("#source-breakdown-count").textContent = `${rows.length} 笔`;
  document.querySelector("#source-insight").textContent = items[0] ? `${items[0].label}是本月主要账单来源，占 ${Math.round(items[0].percent * 100)}%` : `${monthInput.value} 暂无来源数据`;
  if (items.length === 0) {
    root.append(empty("暂无来源数据"));
    return;
  }
  root.append(donutChart(items, "来源", "source"));
  for (const item of items) {
    root.append(progressItem(item.label, `${item.count} 笔 · ${money(item.value)}`, item.percent, "blue"));
  }
}

function renderDirectionBreakdown() {
  const root = document.querySelector("#direction-breakdown");
  root.replaceChildren();
  const rows = currentMonthTransactions();
  const items = aggregateBy(rows, (item) => directionLabel(item.direction), (item) => item.amount).map((item) => ({ ...item, color: item.label === "支出" ? "#c86f7d" : item.label === "收入" || item.label === "退款" ? "#58a47b" : "#8391a2" }));
  document.querySelector("#direction-breakdown-count").textContent = `${rows.length} 笔`;
  document.querySelector("#direction-insight").textContent = `收入 ${money(state.report?.income ?? 0)} · 支出 ${money(state.report?.expense ?? 0)} · 净额 ${money(state.report?.net ?? 0)}`;
  if (items.length === 0) {
    root.append(empty("暂无收支数据"));
    return;
  }
  root.append(donutChart(items, "收支", "direction"));
  for (const item of items) {
    root.append(progressItem(item.label, `${item.count} 笔 · ${money(item.value)}`, item.percent, item.label === "支出" ? "warn" : "green"));
  }
}

function renderMetrics() {
  const report = state.report ?? {};
  const rows = currentMonthTransactions();
  const classifiedCount = rows.filter((item) => Boolean(item.categoryId)).length;
  const classificationRate = displayMode ? 96 : rows.length > 0 ? Math.round((classifiedCount / rows.length) * 100) : 0;
  const visibleCount = displayMode ? 98 : rows.length;
  const visiblePending = displayMode ? 2 : Number(report.pendingReviewCount ?? 0);
  const monthLabel = monthInput.value ? monthInput.value.replace("-", "\u5e74") + "\u6708" : "\u5f53\u524d\u6708\u4efd";
  localizeMobileDashboard();
  const headerTitle = document.querySelector(".header-title h2");
  const headerCopy = document.querySelector(".header-title > span");
  if (isMobileViewport()) {
    const hour = new Date().getHours();
    headerTitle.textContent = hour < 11 ? "早上好" : hour < 18 ? "下午好" : "晚上好";
    headerCopy.textContent = visiblePending
      ? `你的财务智能体发现 ${visiblePending} 项需要确认。`
      : "本月账本状态良好，智能体正在持续整理。";
  } else {
    headerTitle.textContent = "LedgerMind OS 工作台";
    headerCopy.textContent = "自动整理微信 / 支付宝账单，只把需要你确认的财务决策推到前台。";
  }
  document.querySelector("#expense").textContent = displayMode ? "¥4,862.30" : money(report.expense ?? 0);
  document.querySelector("#income").textContent = `${classificationRate}%`;
  document.querySelector("#pending").textContent = String(visiblePending);
  document.querySelector("#count").textContent = displayMode ? "¥86.00" : money(Math.max(0, (report.expense ?? 0) * 0.08));
  document.querySelector("#net").textContent = `\u51c0\u989d ${money(report.net ?? 0)}`;
  document.querySelector("#hero-month").textContent = monthLabel;
  document.querySelector("#command-total").textContent = String(visibleCount);
  document.querySelector("#command-expense").textContent = displayMode ? "¥4,862.30" : money(report.expense ?? 0);
  document.querySelector("#command-income").textContent = displayMode ? "¥8,000.00" : money(report.income ?? 0);
  document.querySelector("#command-net").textContent = displayMode ? "¥3,137.70" : money(report.net ?? 0);
  document.querySelector("#command-net").className = displayMode || (report.net ?? 0) >= 0 ? "amount-positive" : "amount-negative";
  document.querySelector("#command-rate").textContent = `${classificationRate}%`;
  document.querySelector("#command-pending").textContent = String(visiblePending);
  document.querySelector("#hero-saving").textContent = displayMode ? "¥86.00" : money(Math.max(0, (report.expense ?? 0) * 0.08));
  document.querySelector("#hero-sync-time").textContent = `最近更新 ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
  document.querySelector("#hero-sync-state").textContent = `本月 ${visibleCount} 笔 · 数据已同步`;
  document.querySelector("#hero-agent-mode").textContent = getSiliconFlowApiKey() ? "云端模型 · 本地分析可用" : "本地账本分析";
  const topCategory = state.report?.categories?.slice().sort((left, right) => Number(right.expense ?? 0) - Number(left.expense ?? 0))[0];
  document.querySelector("#hero-insight").textContent = displayMode
    ? "餐饮支出较上月增加 18%，建议检查外卖与咖啡消费"
    : rows.length
    ? `${labelForCategory(topCategory?.categoryId ?? "")}是主要支出，${visiblePending} 项需要确认`
    : "导入账单后生成支出洞察";
  document.querySelector("#mobile-summary-pending").textContent = `待确认 ${visiblePending} 笔`;
  document.querySelector("#mobile-summary-expense").textContent = `支出 ${displayMode ? "¥4,862.30" : money(report.expense ?? 0)}`;
  document.querySelector("#mobile-summary-subscriptions").textContent = `订阅 ${displayMode ? 2 : state.insights?.recurringPaymentCandidates?.length ?? 0} 项`;
  document.querySelector("#mobile-summary-count").textContent = `本机 ${visibleCount} 笔`;
  document.querySelector("#mobile-summary-budget").textContent = `预算风险 ${displayMode ? 1 : state.budgets.filter((item) => item.status !== "ok").length} 项`;
  document.querySelector("#mobile-summary-mode").textContent = getSiliconFlowApiKey() ? "云端 + 本地" : "本地优先";
  document.querySelector("#mobile-summary-title").textContent = visiblePending
    ? `还有 ${visiblePending} 笔待确认`
    : "本月账本已同步";
  document.querySelector("#mobile-summary-copy").textContent = visibleCount
    ? `${visibleCount} 笔交易，支出 ${displayMode ? "¥4,862.30" : money(report.expense ?? 0)}，自动分类率 ${classificationRate}%。`
    : "还没有交易，可在「交易」中手工记账或导入账单。";
  document.querySelector("#agent-month-state").textContent = monthInput.value;
  document.querySelector("#agent-transaction-state").textContent = String(visibleCount);
  document.querySelector("#agent-pending-state").textContent = String(visiblePending);
  document.querySelector("#agent-model-state").textContent = state.agentProvider === "SiliconFlow" ? "DeepSeek V4 Flash · 云端" : "本地账本分析";
}

function renderLedgerHealth() {
  const rows = currentMonthTransactions();
  const scoreEl = document.querySelector("#health-score");
  const statusEl = document.querySelector("#health-status");
  const ringEl = document.querySelector("#health-ring");
  const titleEl = document.querySelector("#health-title");
  const copyEl = document.querySelector("#health-copy");
  const factorsEl = document.querySelector("#health-factors");
  factorsEl.replaceChildren();
  if (displayMode) {
    scoreEl.textContent = "86";
    ringEl.style.setProperty("--health-score", 86);
    statusEl.textContent = "状态良好";
    statusEl.className = "status-badge confirmed";
    titleEl.textContent = "状态良好，账本结构完整";
    copyEl.textContent = "分类与审核状态整体稳定，餐饮预算接近提醒线。";
    ["自动分类率较高", "待确认交易较少", "餐饮预算接近上限", "暂未发现明显重复扣费"].forEach((item) => factorsEl.append(textListItem(item)));
    return;
  }
  if (rows.length === 0) {
    scoreEl.textContent = "--";
    ringEl.style.setProperty("--health-score", 0);
    statusEl.textContent = "等待评估";
    statusEl.className = "status-badge ignored";
    titleEl.textContent = "暂无足够数据";
    copyEl.textContent = "导入账单后，智能体将根据分类率、预算风险和异常交易生成账本健康度。";
    return;
  }
  const classifiedRate = rows.filter((item) => item.categoryId).length / rows.length;
  const pendingRate = rows.filter((item) => item.status === "pending_review").length / rows.length;
  const lowConfidenceRate = rows.filter((item) => Number(item.confidence ?? 0) < 0.75).length / rows.length;
  const budgetRiskRate = state.budgets.length ? state.budgets.filter((item) => item.status !== "ok").length / state.budgets.length : 0;
  const duplicateRate = Math.min(1, state.jobs.reduce((sum, item) => sum + Number(item.duplicateRows ?? 0), 0) / Math.max(rows.length, 1));
  const score = Math.max(0, Math.min(100, Math.round(
    classifiedRate * 40 + (1 - pendingRate) * 25 + (1 - budgetRiskRate) * 15 + (1 - lowConfidenceRate) * 15 + (1 - duplicateRate) * 5
  )));
  const status = score >= 85 ? "状态优秀" : score >= 70 ? "状态良好" : score >= 55 ? "需要关注" : "风险较高";
  scoreEl.textContent = String(score);
  ringEl.style.setProperty("--health-score", score);
  statusEl.textContent = status;
  statusEl.className = `status-badge ${score >= 70 ? "confirmed" : score >= 55 ? "pending" : "risk"}`;
  titleEl.textContent = `${status}，分类完整度 ${Math.round(classifiedRate * 100)}%`;
  const riskCopy = budgetRiskRate > 0
    ? `${state.budgets.filter((item) => item.status !== "ok").length} 项预算需要关注。`
    : "预算整体处于可控范围。";
  copyEl.textContent = `${rows.filter((item) => item.status === "pending_review").length} 笔交易待确认，${riskCopy}`;
  const factors = [
    classifiedRate >= 0.9 ? "自动分类率较高" : "仍有交易需要补充分组",
    pendingRate <= 0.08 ? "待确认交易较少" : "待确认事项需要处理",
    budgetRiskRate === 0 ? "预算整体处于健康范围" : "部分预算接近或超过上限",
    duplicateRate < 0.05 ? "暂未发现明显重复扣费" : "发现重复记录，导入时已处理"
  ];
  factors.forEach((item) => factorsEl.append(textListItem(item)));
}

function calculateDataQuality() {
  const rows = currentMonthTransactions();
  if (rows.length === 0) return null;
  const pending = rows.filter((item) => item.status === "pending_review").length;
  const unclassified = rows.filter((item) => !item.categoryId).length;
  const missingMerchant = rows.filter((item) => !(item.merchantName || item.counterparty)).length;
  const duplicates = state.jobs.reduce((sum, item) => sum + Number(item.duplicateRows ?? 0), 0);
  const expenseCategories = [...new Set(rows.filter((item) => item.direction === "expense" && item.categoryId).map((item) => item.categoryId))];
  const budgetCategories = new Set(state.budgets.map((item) => item.budget?.categoryId ?? item.categoryId));
  const budgetCoverage = expenseCategories.length ? expenseCategories.filter((id) => budgetCategories.has(id)).length / expenseCategories.length : 0;
  const ruleMatched = rows.filter((transaction) => state.rules.some((rule) => ruleMatchesTransaction(rule, transaction))).length;
  const ruleCoverage = rows.length ? ruleMatched / rows.length : 0;
  const latestJob = state.jobs.slice().sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))[0];
  const latestTime = latestJob ? new Date(latestJob.updatedAt).getTime() : 0;
  const recentImport = latestTime > 0 && Date.now() - latestTime < 1000 * 60 * 60 * 24 * 45;
  const anomalies = (state.insights?.recurringPaymentCandidates?.length ?? 0) + rows.filter((item) => item.confidence < 0.75 && item.status !== "ignored").length;
  return agentSafetyUtils.calculateDataQuality({ rows: rows.length, pending, unclassified, missingMerchant, duplicates, budgetCoverage, ruleCoverage, recentImport, anomalies });
}

function renderDataQuality() {
  const scoreEl = document.querySelector("#data-quality-score");
  const statusEl = document.querySelector("#data-quality-status");
  const ringEl = document.querySelector("#data-quality-ring");
  const titleEl = document.querySelector("#data-quality-title");
  const copyEl = document.querySelector("#data-quality-copy");
  const factorsEl = document.querySelector("#data-quality-factors");
  const actionsEl = document.querySelector("#data-quality-actions");
  factorsEl.replaceChildren();
  actionsEl.replaceChildren();
  if (displayMode) {
    scoreEl.textContent = "91";
    ringEl.style.setProperty("--health-score", 91);
    statusEl.textContent = "适合分析";
    statusEl.className = "status-badge confirmed";
    titleEl.textContent = "适合生成月报";
    copyEl.textContent = "账本结构完整，只有少量交易需要确认。";
    ["98 条交易已完成导入", "仅 2 条交易待确认", "预算覆盖 5 个主要分类", "暂未发现重复交易"].forEach((item) => factorsEl.append(textListItem(item)));
    actionsEl.append(actionButton("处理待确认", () => handleAgentAction("review-inbox")), actionButton("查看质量详情", () => navigateToFeature("settings", "#diagnostics-panel")));
    document.querySelector("#mobile-data-quality").textContent = "数据质量 91 · 适合分析";
    return;
  }
  const quality = calculateDataQuality();
  if (!quality) {
    scoreEl.textContent = "--";
    ringEl.style.setProperty("--health-score", 0);
    statusEl.textContent = "数据不足";
    statusEl.className = "status-badge ignored";
    titleEl.textContent = "暂无足够数据";
    copyEl.textContent = "导入账单后评估数据是否适合智能体分析和生成月报。";
    document.querySelector("#mobile-data-quality").textContent = "数据质量待评估";
    return;
  }
  const status = quality.score >= 85 ? "适合分析" : quality.score >= 65 ? "需要确认" : "数据不足";
  scoreEl.textContent = String(quality.score);
  ringEl.style.setProperty("--health-score", quality.score);
  statusEl.textContent = status;
  statusEl.className = `status-badge ${quality.score >= 85 ? "confirmed" : quality.score >= 65 ? "pending" : "risk"}`;
  titleEl.textContent = quality.score >= 85 ? "适合生成月报" : quality.score >= 65 ? "处理关键项后再分析" : "建议先完善账本数据";
  copyEl.textContent = `${quality.rows} 笔交易，${quality.pending} 笔待确认，${quality.unclassified} 笔未分类。`;
  [
    `${quality.rows} 条交易已完成导入`,
    quality.pending ? `${quality.pending} 条交易仍待确认` : "交易确认状态完整",
    quality.duplicates ? `导入时跳过 ${quality.duplicates} 条重复记录` : "暂未发现重复交易",
    `预算覆盖 ${Math.round(quality.budgetCoverage * 100)}% 的支出分类`,
    `规则覆盖 ${Math.round(quality.ruleCoverage * 100)}% 的本月交易`
  ].forEach((item) => factorsEl.append(textListItem(item)));
  if (quality.pending) actionsEl.append(actionButton("处理待确认", () => handleAgentAction("review-inbox")));
  if (quality.budgetCoverage < 0.5) actionsEl.append(actionButton("设置主要预算", () => navigateToFeature("insights", "#workbench")));
  actionsEl.append(actionButton("查看导入批次", () => navigateToFeature("transactions", "#workbench")));
  document.querySelector("#mobile-data-quality").textContent = `数据质量 ${quality.score} · ${status}`;
}

function dataQualityRepairSuggestions() {
  const quality = calculateDataQuality();
  if (!quality) return [];
  const codes = new Set(agentSafetyUtils.qualityRepairCodes(quality));
  const suggestions = [];
  const add = (problem, impact, actionLabel, action) => suggestions.push({ problem, impact, actionLabel, action });
  if (codes.has("pending")) add("待确认交易比例偏高", "可能降低分类统计和月报准确度", "打开智能审核箱", () => handleAgentAction("review-inbox"));
  if (codes.has("unclassified")) add("未分类交易较多", `${quality.unclassified} 笔交易未进入明确分类`, "准备批量分类", () => enqueuePendingAction({ type: "批量分类建议", title: "整理本月未分类交易", source: "数据质量", impact: `${quality.unclassified} 笔未分类交易`, risk: "仅打开筛选；批量修改前仍需确认", action: "transactions" }));
  if (codes.has("duplicates")) add("导入时发现重复交易", `已跳过 ${quality.duplicates} 条重复记录`, "查看导入批次", () => navigateToFeature("transactions", "#workbench"));
  if (codes.has("merchant")) add("部分交易缺少商户", `${quality.missingMerchant} 笔交易的解释依据不足`, "筛选相关交易", () => filterTransactions("未知商户"));
  if (codes.has("budget")) add("主要分类预算覆盖不足", `当前覆盖率 ${Math.round(quality.budgetCoverage * 100)}%`, "打开预算设置", () => navigateToFeature("insights", "#workbench"));
  if (codes.has("rules")) add("规则覆盖率较低", `仅 ${Math.round(quality.ruleCoverage * 100)}% 交易命中现有规则`, "打开规则草稿", () => prepareRuleDraft("把高频商户自动归为对应分类"));
  if (codes.has("import")) add("最近导入时间较久", "当前账本可能缺少最新交易", "导入最新账单", () => billFileInput.click());
  if (codes.has("anomalies")) add("未处理异常较多", `检测到 ${quality.anomalies} 个低置信度或周期性事项`, "打开异常列表", () => navigateToFeature("insights", "#insights-panel"));
  return suggestions;
}

function renderDataQualityRepairs() {
  const suggestions = displayMode ? [
    { problem: "2 笔交易需要确认", impact: "确认后月报分类会更准确", actionLabel: "打开智能审核箱", action: () => handleAgentAction("review-inbox") },
    { problem: "餐饮预算接近上限", impact: "可能影响本月可节省空间", actionLabel: "打开预算设置", action: () => navigateToFeature("insights", "#workbench") },
    { problem: "高频商户可转为规则", impact: "提高后续账单自动分类率", actionLabel: "打开规则草稿", action: () => prepareRuleDraft("把示例外卖商户自动归为餐饮") }
  ] : dataQualityRepairSuggestions();
  const root = document.querySelector("#quality-repair-list");
  const summary = document.querySelector("#quality-repair-summary");
  document.querySelector("#quality-repair-count").textContent = `${suggestions.length} 项`;
  root.replaceChildren();
  summary.replaceChildren();
  if (!calculateDataQuality() && !displayMode) {
    root.append(empty("暂无修复建议", "导入账单后再评估数据质量。"));
    return;
  }
  if (suggestions.length === 0) {
    root.append(empty("当前数据质量良好", "暂时没有需要优先修复的问题。"));
    summary.append(textSpan("当前没有紧急修复项", "quality-ok"));
    return;
  }
  suggestions.slice(0, 3).forEach((item) => summary.append(textSpan(item.problem)));
  suggestions.forEach((item) => {
    const card = document.createElement("article");
    const copy = document.createElement("div");
    copy.append(strongText(item.problem), textSpan(item.impact));
    card.append(copy, actionButton(item.actionLabel, item.action, "primary"));
    root.append(card);
  });
}

function renderAuditLogs() {
  const root = document.querySelector("#audit-log-list");
  if (!root) return;
  root.replaceChildren();
  const logs = displayMode && state.auditLogs.length === 0 ? [
    { time: new Date().toISOString(), type: "智能体生成任务流", title: "分析本月餐饮支出", source: "云端模型", impact: "6 个建议步骤", result: "已建议" },
    { time: new Date(Date.now() - 300000).toISOString(), type: "用户导出月报", title: "2026 年 5 月账本月报", source: "报告中心", impact: "ledger-report-2026-05.md", result: "已完成" },
    { time: new Date(Date.now() - 600000).toISOString(), type: "用户确认创建规则", title: "示例外卖商户归为餐饮", source: "待执行草稿", impact: "未来同类交易", result: "已确认" }
  ] : state.auditLogs;
  if (!logs.length) {
    root.append(empty("暂无审计记录", "智能体建议和用户确认行为会记录在当前设备。"));
    return;
  }
  logs.slice(0, 8).forEach((log) => {
    const item = document.createElement("article");
    const head = document.createElement("div");
    head.append(pill(log.result, `status-badge ${log.result === "已失败" ? "risk" : log.result === "已取消" ? "ignored" : "confirmed"}`), strongText(log.title));
    item.append(head, detailLine("时间", formatFullDateTime(log.time)), detailLine("类型", log.type), detailLine("来源", log.source), detailLine("影响", log.impact));
    if (log.detail) item.append(detailLine("详情", log.detail));
    root.append(item);
  });
  if (logs.length > 8) root.append(textSpan(`仅显示最近 8 条，共 ${logs.length} 条；完整记录仍保存在当前设备。`, "history-limit-note"));
}

function renderMonthlyReport() {
  const rows = currentMonthTransactions();
  const root = document.querySelector("#monthly-report-grid");
  const summary = document.querySelector("#monthly-report-summary");
  document.querySelector("#monthly-report-period").textContent = monthInput.value ? `${monthInput.value.replace("-", "年")}月` : "当前月份";
  root.replaceChildren();
  if (displayMode) {
    summary.textContent = "本月共记录 98 笔交易，支出 ¥4,862.30，收入 ¥8,000.00。餐饮、交通和购物是主要支出来源，智能体发现 2 项可优化订阅，预计可节省 ¥86.00。";
    const sampleValues = [["交易总数", "98 笔"], ["本月支出", "¥4,862.30"], ["本月收入", "¥8,000.00"], ["本月净额", "¥3,137.70"], ["主要分类", "餐饮 / 正餐"], ["主要商户", "示例商户 A"], ["待确认", "2 笔"], ["预算风险", "1 项"], ["可节省", "¥86.00"]];
    for (const [label, value] of sampleValues) {
      const item = document.createElement("span");
      item.append(textSpan(label), strongText(value));
      root.append(item);
    }
    return;
  }
  if (rows.length === 0) {
    summary.textContent = "还没有月报数据。导入微信或支付宝账单后，智能体会自动生成中文财务总结。";
    root.append(empty("暂无月度报告", "导入账单后自动汇总交易、分类、商户和预算风险"));
    return;
  }
  const expenses = rows.filter((item) => item.direction === "expense");
  const merchantTotals = aggregateBy(expenses, (item) => item.merchantName ?? item.counterparty ?? "未知商户", (item) => item.amount);
  const topCategory = state.report?.categories?.slice().sort((left, right) => Number(right.expense ?? 0) - Number(left.expense ?? 0))[0];
  const topMerchant = merchantTotals[0];
  const pending = rows.filter((item) => item.status === "pending_review").length;
  const budgetRisks = state.budgets.filter((item) => item.status !== "ok").length;
  const saving = Math.max(0, Number(state.report?.expense ?? 0) * 0.08);
  summary.textContent = `本月共记录 ${rows.length} 笔交易，支出 ${money(state.report?.expense ?? 0)}，收入 ${money(state.report?.income ?? 0)}。${labelForCategory(topCategory?.categoryId ?? "未分类")}是主要支出来源，智能体预计可节省 ${money(saving)}。`;
  const values = [
    ["交易总数", `${rows.length} 笔`], ["本月支出", money(state.report?.expense ?? 0)],
    ["本月收入", money(state.report?.income ?? 0)], ["本月净额", money(state.report?.net ?? 0)],
    ["主要分类", labelForCategory(topCategory?.categoryId ?? "未分类")], ["主要商户", displayName(topMerchant?.label ?? "暂无")],
    ["待确认", `${pending} 笔`], ["预算风险", `${budgetRisks} 项`], ["可节省", money(saving)]
  ];
  for (const [label, value] of values) {
    const item = document.createElement("span");
    item.append(textSpan(label), strongText(value));
    root.append(item);
  }
}

function buildMonthlyReportMarkdown() {
  const month = monthInput.value || new Date().toISOString().slice(0, 7);
  const rows = currentMonthTransactions();
  const report = state.report ?? { income: 0, expense: 0, net: 0, transactionCount: rows.length, pendingReviewCount: 0, categories: [] };
  const expenses = rows.filter((item) => item.direction === "expense");
  const categoryRows = displayMode
    ? [["餐饮 / 正餐", "¥1,286.40"], ["交通 / 打车", "¥638.20"], ["购物 / 买菜", "¥526.80"]]
    : (report.categories ?? []).filter((item) => item.expense > 0).sort((left, right) => right.expense - left.expense).slice(0, 5).map((item) => [labelForCategory(item.categoryId), money(item.expense)]);
  const merchantRows = displayMode
    ? [["示例商户 A", "¥862.30"], ["示例商户 B", "¥618.00"], ["示例商户 C", "¥436.20"]]
    : aggregateBy(expenses, (item) => item.merchantName ?? item.counterparty ?? "未知商户", (item) => item.amount).slice(0, 5).map((item) => [displayName(item.label), money(item.value)]);
  const risks = state.budgets.filter((item) => item.status !== "ok");
  const pending = displayMode ? 2 : rows.filter((item) => item.status === "pending_review").length;
  const health = displayMode ? 86 : Number(document.querySelector("#health-score")?.textContent) || 0;
  const income = displayMode ? "¥8,000.00" : money(report.income);
  const expense = displayMode ? "¥4,862.30" : money(report.expense);
  const net = displayMode ? "¥3,137.70" : money(report.net);
  const lines = [
    `# ${month.replace("-", " 年 ")} 月账本月报`, "",
    "> 由 LedgerMind OS 基于当前账本生成。", "",
    "## 总览", "",
    `- 收入：${income}`, `- 支出：${expense}`, `- 净额：${net}`, `- 交易数：${displayMode ? 98 : rows.length} 笔`, "",
    "## Top 分类", "", ...(categoryRows.length ? categoryRows.map(([label, value], index) => `${index + 1}. ${label}：${value}`) : ["暂无分类支出"]), "",
    "## Top 商户", "", ...(merchantRows.length ? merchantRows.map(([label, value], index) => `${index + 1}. ${label}：${value}`) : ["暂无商户支出"]), "",
    "## 预算风险", "", ...(displayMode ? ["- 餐饮预算接近上限，建议检查外卖与咖啡支出。"] : risks.length ? risks.map((item) => `- ${labelForCategory(item.budget?.categoryId ?? item.categoryId)}：${item.status === "over" ? "已超支" : "接近上限"}`) : ["- 暂未发现预算风险。"]), "",
    "## 待确认交易", "", `- 共 ${pending} 笔交易需要确认。`, "",
    "## 智能体节省建议", "", "- 优先检查高频餐饮、订阅扣费和低置信度交易。", `- 建议节省目标：${displayMode ? "¥86.00" : money(Math.max(0, report.expense * 0.08))}。`, "",
    "## 账本健康度", "", `- 当前分数：${health} / 100`, "",
    `生成时间：${new Date().toLocaleString("zh-CN")}`, ""
  ];
  return { month, filename: `ledger-report-${month}.md`, content: agentSafetyUtils.buildMarkdown(lines) };
}

function exportMonthlyReportMarkdown() {
  const output = buildMonthlyReportMarkdown();
  downloadText(output.filename, output.content, "text/markdown;charset=utf-8");
  const record = { id: `export-${Date.now()}`, time: new Date().toISOString(), month: output.month, filename: output.filename };
  state.exportRecords.unshift(record);
  state.exportRecords = state.exportRecords.slice(0, 30);
  writeLocalList("exports", state.exportRecords);
  addAuditLog({ type: "用户导出月报", title: `${output.month.replace("-", " 年 ")} 月账本月报`, source: "报告中心", impact: output.filename, result: "已完成" });
  renderReportCenter();
  showToast("月报 Markdown 已导出");
}

function downloadText(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderReportCenter() {
  const root = document.querySelector("#report-center-content");
  if (!root) return;
  reportTabButtons.forEach((button) => button.classList.toggle("active", button.dataset.reportTab === state.reportTab));
  root.replaceChildren();
  if (state.reportTab === "monthly") {
    root.append(reportSummaryCard("月度财务摘要", document.querySelector("#monthly-report-summary")?.textContent || "暂无月度报告"));
    const values = document.createElement("div");
    values.className = "report-center-metrics";
    [["收入", displayMode ? "¥8,000.00" : money(state.report?.income ?? 0)], ["支出", displayMode ? "¥4,862.30" : money(state.report?.expense ?? 0)], ["净额", displayMode ? "¥3,137.70" : money(state.report?.net ?? 0)], ["交易", `${displayMode ? 98 : currentMonthTransactions().length} 笔`]].forEach(([label, value]) => values.append(detailLine(label, value)));
    root.append(values);
  } else if (state.reportTab === "budget") {
    const risks = displayMode ? [{ label: "餐饮 / 正餐", value: "已使用 ¥1,860.00 / ¥2,000.00" }] : state.budgets.map((item) => ({ label: labelForCategory(item.budget?.categoryId ?? item.categoryId), value: `${money(item.spent ?? 0)} / ${money(item.budget?.limitAmount ?? item.limitAmount ?? 0)} · ${item.status === "over" ? "已超支" : item.status === "warning" ? "接近上限" : "正常"}` }));
    renderReportRows(root, risks, "还没有预算报告", "设置分类预算后显示使用率和风险。", "查看预算", () => navigateToFeature("insights", "#workbench"));
  } else if (state.reportTab === "subscriptions") {
    const rows = displayMode ? [{ label: "示例订阅服务", value: "¥24.00 · 每月扣费" }, { label: "示例视频服务", value: "¥19.00 · 建议审核" }] : (state.insights?.recurringPaymentCandidates ?? []).map((item) => ({ label: displayName(item.merchantName), value: `${money(item.amount)} · ${item.occurrences} 次` }));
    renderReportRows(root, rows, "暂无周期扣费报告", "识别到周期性交易后会显示在这里。", "查看订阅", () => navigateToFeature("insights", "#insights-panel"));
  } else if (state.reportTab === "quality") {
    const quality = displayMode ? { score: 91 } : calculateDataQuality();
    root.append(reportSummaryCard("数据质量报告", quality ? `当前评分 ${quality.score} 分，${quality.score >= 85 ? "适合分析和生成月报" : quality.score >= 65 ? "建议先处理关键确认项" : "建议先完善账本数据"}。` : "暂无足够账本数据。"));
    const repairs = displayMode ? [{ problem: "2 笔交易需要确认", impact: "确认后月报会更准确" }] : dataQualityRepairSuggestions();
    renderReportRows(root, repairs.map((item) => ({ label: item.problem, value: item.impact })), "暂无修复建议", "当前数据质量没有明显问题。", "查看完整建议", () => navigateToFeature("settings", "#diagnostics-panel"));
  } else {
    const records = displayMode && state.exportRecords.length === 0 ? [{ time: new Date().toISOString(), month: "2026-05", filename: "ledger-report-2026-05.md" }] : state.exportRecords;
    renderReportRows(root, records.slice(0, 8).map((item) => ({ label: item.filename, value: `${item.month} · ${formatFullDateTime(item.time)}` })), "暂无导出记录", "导出 Markdown 月报后会记录时间和文件名。", "导出本月", exportMonthlyReportMarkdown);
  }
  const monthlyOnly = state.reportTab === "monthly";
  reportCenterExportButton.hidden = !monthlyOnly && state.reportTab !== "exports";
  copyReportSummaryButton.hidden = state.reportTab === "exports";
}

function reportSummaryCard(title, copy) {
  const card = document.createElement("article");
  card.className = "report-summary-card";
  card.append(strongText(title), paragraphText(copy));
  return card;
}

function renderReportRows(root, rows, emptyTitle, emptyCopy, actionLabel, action) {
  if (!rows.length) {
    root.append(empty(emptyTitle, emptyCopy), actionButton(actionLabel, action));
    return;
  }
  const list = document.createElement("div");
  list.className = "report-row-list";
  rows.forEach((item) => {
    const row = document.createElement("article");
    row.append(strongText(item.label), textSpan(item.value));
    list.append(row);
  });
  root.append(list, actionButton(actionLabel, action));
}

async function copyReportSummary() {
  const text = document.querySelector("#report-center-content")?.innerText?.trim() || document.querySelector("#monthly-report-summary")?.textContent || "";
  if (!text) return showToast("当前没有可复制的报告摘要", "error");
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  addAuditLog({ type: "用户复制报告摘要", title: `${state.reportTab} 报告摘要`, source: "报告中心", impact: "仅写入本机剪贴板", result: "已完成" });
  showToast("报告摘要已复制");
}

function renderDailySummary() {
  const rows = currentMonthTransactions();
  const imported = rows.filter((item) => item.source !== "manual").length;
  const classified = rows.filter((item) => item.categoryId).length;
  const duplicateCount = state.jobs.reduce((sum, job) => sum + Number(job.duplicateRows ?? 0), 0);
  const pending = rows.filter((item) => item.status === "pending_review").length;
  const lowConfidence = rows.filter((item) => Number(item.confidence ?? 0) < 0.75).length;
  const recurring = state.insights?.recurringPaymentCandidates?.length ?? 0;
  const values = displayMode ? [
    ["已导入", 98, "笔交易"],
    ["自动分类", 94, "笔"],
    ["待确认", 2, "笔"],
    ["重复检测", 3, "笔"],
    ["异常消费", 1, "项"],
    ["周期扣费", 2, "项"],
    ["节省建议", 3, "条"],
    ["商户偏好", 4, "条"],
    ["自动化规则", 3, "条"]
  ] : [
    ["已导入", imported, "笔交易"],
    ["自动分类", classified, "笔"],
    ["待确认", pending, "笔"],
    ["重复检测", duplicateCount, "笔"],
    ["异常消费", lowConfidence, "项"],
    ["周期扣费", recurring, "项"],
    ["节省建议", (state.report?.expense ?? 0) > 0 ? 1 : 0, "条"],
    ["商户偏好", state.rules.length, "条"],
    ["自动化规则", state.rules.length, "条"]
  ];
  const root = document.querySelector("#daily-summary-grid");
  root.replaceChildren();
  for (const [label, value, unit] of values) {
    const item = document.createElement("div");
    item.append(textSpan(label), strongText(String(value)), textSpan(unit));
    root.append(item);
  }
  const visiblePending = displayMode ? 2 : pending;
  document.querySelector("#daily-summary-status").textContent = visiblePending > 0 ? `${visiblePending} 项待处理` : "运行正常";
  document.querySelector("#daily-summary-status").className = visiblePending > 0 ? "status-badge pending" : "status-badge confirmed";
}

function localizeMobileDashboard() {
  if (!isMobileViewport()) {
    return;
  }
  const metricLabels = document.querySelectorAll(".metric span");
  const labels = ["本月支出", "自动分类率", "待确认", "可节省"];
  metricLabels.forEach((label, index) => {
    if (labels[index]) {
      label.textContent = labels[index];
    }
  });
  const headingMap = new Map([
    ["Agent Activity Timeline", "智能体工作流"],
    ["Review Inbox", "待审核事项"],
    ["Agent Memory", "智能体记忆"],
    ["Automation Rules", "自动化规则"],
    ["Anomaly Detection", "异常检测"],
    ["Privacy & Model Settings", "隐私与模型设置"]
  ]);
  for (const heading of document.querySelectorAll(".panel-heading h2")) {
    if (headingMap.has(heading.textContent)) {
      heading.textContent = headingMap.get(heading.textContent);
    }
  }
  const panelSpanMap = new Map([
    ["Live workflow", "实时流程"],
    ["Only what needs attention", "只显示需要你处理的事项"],
    ["Learned preferences", "已学习的偏好"],
    ["Natural language builder", "自然语言创建规则"],
    ["2 active alerts", "2 个活跃提醒"],
    ["Developer trusted", "开发者可信赖"]
  ]);
  for (const span of document.querySelectorAll(".panel-heading span")) {
    if (panelSpanMap.has(span.textContent)) {
      span.textContent = panelSpanMap.get(span.textContent);
    }
  }
  const timelineTexts = [
    ["09:12 · Bank", "09:12 · 支付"],
    ["09:15 · CSV", "09:15 · 账单"],
    ["09:17 · Agent", "09:17 · 智能体"],
    ["09:21 · SaaS", "09:21 · 订阅"],
    ["09:25 · Report", "09:25 · 报告"],
    ["Synced", "已同步"],
    ["Completed", "已完成"],
    ["Learning", "学习中"],
    ["Warning", "提醒"],
    ["Suggested", "建议"],
    ["Bank sync completed", "支付记录同步完成"],
    ["28 transactions imported", "已导入 28 笔交易"],
    ["24 transactions categorized automatically", "24 笔交易已自动分类"],
    ["1 unusual subscription detected", "发现 1 个异常订阅"],
    ["Weekly spending summary generated", "周消费摘要已生成"],
    ["Confidence 99%", "置信度 99%"],
    ["Rule match + merchant memory", "规则匹配 + 商户记忆"],
    ["Price changed from $12 to $19", "价格从 ¥12 变为 ¥19"],
    ["Ready for review", "等待你确认"],
    ["WeChat + Alipay", "微信 + 支付宝"]
  ];
  replaceExactText(".timeline-item small, .timeline-item span, .timeline-item strong, .timeline-item em", timelineTexts);
  replaceExactText(".review-list strong, .review-list span, .review-list button", [
    ["Netflix · Subscription · $19.99", "Netflix · 订阅 · ¥19.90"],
    ["Unknown Merchant · Shopping · $42.30", "未知商户 · 购物 · ¥42.30"],
    ["Figma · Software · $15.00", "Figma · 软件 · ¥15.00"],
    ["Detected price increase", "检测到价格上涨"],
    ["Confidence 62% · Needs category", "置信度 62% · 需要分类"],
    ["New recurring payment detected", "发现新的周期扣费"],
    ["Review", "审核"],
    ["Categorize", "分类"],
    ["Create Rule", "创建规则"]
  ]);
  replaceExactText(".memory-list strong, .memory-list span", [
    ["Uber is usually Transport", "Uber 通常归为交通"],
    ["Notion and Figma are Software", "Notion 和 Figma 归为软件"],
    ["Transactions over $500 should be flagged", "超过 ¥500 的交易需要标记"],
    ["Source: corrections · Accuracy 97%", "来源：用户修正 · 准确率 97%"],
    ["Source: subscriptions · Accuracy 94%", "来源：订阅识别 · 准确率 94%"],
    ["Source: privacy rule · Accuracy 100%", "来源：隐私规则 · 准确率 100%"]
  ]);
  replaceExactText(".rule-card-list span, .rule-card-list strong, .rule-builder button", [
    ["On", "启用"],
    ["Flag any subscription over $30", "标记超过 ¥30 的订阅"],
    ["Auto-approve confidence above 95%", "自动确认 95% 以上置信度交易"],
    ["Create", "创建"]
  ]);
  const ruleInput = document.querySelector("#rule-command");
  if (ruleInput) {
    ruleInput.placeholder = "例如：把 Uber 自动归为交通";
  }
  replaceExactText(".anomaly-list span, .anomaly-list strong, .anomaly-list p", [
    ["Medium", "中风险"],
    ["High", "高风险"],
    ["Food spending up 32% this week", "本周餐饮支出上升 32%"],
    ["Duplicate charge detected", "检测到疑似重复扣费"],
    ["Agent suggests reviewing lunch merchants.", "建议检查午餐相关商户。"],
    ["Two similar payments from the same merchant.", "同一商户出现两笔相似支付。"]
  ]);
  replaceExactText(".privacy-grid span", [
    ["Local-first mode", "本地优先模式"],
    ["Encrypted database", "加密数据库"],
    ["Self-hosted deployment", "可自部署"],
    ["OpenAI-compatible API", "兼容 OpenAI API"],
    ["No financial data leaves your server", "财务数据不离开你的设备"],
    ["Audit logs enabled", "审计日志已启用"]
  ]);
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function replaceExactText(selector, pairs) {
  const map = new Map(pairs);
  for (const element of document.querySelectorAll(selector)) {
    const text = element.textContent?.trim();
    if (map.has(text)) {
      element.textContent = map.get(text);
    }
  }
}

function renderJobs() {
  const root = document.querySelector("#jobs");
  const filterRoot = document.querySelector("#import-batch-filter");
  root.replaceChildren();
  filterRoot.replaceChildren();
  filterRoot.hidden = !state.importJobFilter;
  if (state.importJobFilter) {
    filterRoot.append(textSpan("正在查看指定导入批次"), actionButton("清除筛选", () => {
      state.importJobFilter = "";
      renderJobs();
      renderTransactions();
    }));
  }
  if (state.jobs.length === 0) {
    root.append(empty("\u6682\u65e0\u5bfc\u5165\u4efb\u52a1"));
    return;
  }
  const sortedJobs = state.jobs.slice().sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)));
  const activeJobs = sortedJobs.filter((job) => job.status !== "completed");
  const latestCompletedJob = sortedJobs.find((job) => job.status === "completed");
  const visibleJobs = [...activeJobs, ...(latestCompletedJob ? [latestCompletedJob] : [])]
    .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))
    .slice(0, 5);
  for (const job of visibleJobs) {
    const item = document.createElement("article");
    item.className = "import-batch-card";
    const head = document.createElement("div");
    const statusLabel = job.status === "completed" ? "已完成" : job.status === "failed" ? "失败" : "处理中";
    head.append(strongText(job.filename), pill(statusLabel, job.status === "completed" ? "pill" : "pill warn"));
    const month = latestTransactionMonth(state.transactions.filter((transaction) => transaction.importJobId === job.id)) || "待识别";
    const metrics = document.createElement("div");
    metrics.className = "import-batch-metrics";
    [["来源", sourceName(job.source)], ["成功", `${job.importedRows} 笔`], ["重复", `${job.duplicateRows} 笔`], ["待确认", `${job.reviewRows} 笔`], ["月份", month], ["时间", formatFullDateTime(job.updatedAt)]].forEach(([label, value]) => {
      const metric = document.createElement("span");
      metric.append(textSpan(label), strongText(value));
      metrics.append(metric);
    });
    const actions = document.createElement("div");
    actions.className = "import-batch-actions";
    actions.append(actionButton("批次详情", () => openImportDetails(job), "primary"), actionButton("查看本批次交易", () => {
      state.importJobFilter = job.id;
      searchInput.value = "";
      statusFilter.value = "";
      renderJobs();
      renderTransactions();
      navigateToFeature("transactions", "#transactions");
    }));
    item.append(head, metrics, actions);
    root.append(item);
  }
}

function openImportDetails(job) {
  const rows = state.transactions.filter((transaction) => transaction.importJobId === job.id);
  const previewRows = displayMode && rows.length === 0 ? currentMonthTransactions().slice(0, Math.min(12, currentMonthTransactions().length)) : rows;
  const month = latestTransactionMonth(previewRows) || latestTransactionMonth(state.transactions.filter((item) => item.source === job.source)) || "未记录";
  const pending = previewRows.filter((item) => item.status === "pending_review");
  const anomalies = previewRows.filter((item) => item.confidence < 0.75 || !item.merchantName && !item.counterparty);
  const distribution = aggregateBy(previewRows, (item) => labelForCategory(item.categoryId || "未分类"), () => 1).slice(0, 6);
  importDetailContent.replaceChildren();

  const hero = document.createElement("div");
  hero.className = "transaction-detail-hero";
  hero.append(textSpan(sourceName(job.source)), strongText(job.filename), textSpan(formatFullDateTime(job.updatedAt)));
  const facts = document.createElement("dl");
  facts.className = "transaction-detail-facts";
  [["批次时间", formatFullDateTime(job.updatedAt)], ["来源", sourceName(job.source)], ["文件格式", job.filename?.split(".").pop()?.toUpperCase() || "未记录"], ["编码", "自动识别"], ["识别月份", month], ["成功导入", `${job.importedRows ?? 0} 笔`], ["重复跳过", `${job.duplicateRows ?? 0} 笔`], ["待确认", `${job.reviewRows ?? pending.length} 笔`]].forEach(([label, value]) => {
    const row = document.createElement("div");
    row.append(textSpan(label), strongText(value));
    facts.append(row);
  });

  const categorySection = document.createElement("section");
  categorySection.className = "import-detail-section";
  categorySection.append(strongText("本批次分类分布"));
  const categoryList = document.createElement("div");
  categoryList.className = "import-category-distribution";
  if (distribution.length) distribution.forEach((item) => categoryList.append(progressItem(item.label, `${item.count} 笔`, item.percent, "green")));
  else categoryList.append(empty("暂无可关联的分类记录", "旧批次可能未保存交易关联标识"));
  categorySection.append(categoryList);

  const reviewSection = document.createElement("section");
  reviewSection.className = "import-detail-section";
  reviewSection.append(strongText("质量检查"));
  const reviewList = document.createElement("div");
  reviewList.className = "import-review-summary";
  reviewList.append(
    detailLine("异常交易", `${displayMode ? 1 : anomalies.length} 笔`),
    detailLine("待确认交易", `${displayMode ? 2 : pending.length || job.reviewRows || 0} 笔`),
    detailLine("解析错误", job.errors?.length ? `${job.errors.length} 项` : "无")
  );
  reviewSection.append(reviewList);

  const notice = document.createElement("p");
  notice.className = "batch-undo-notice";
  notice.textContent = "为避免批量删除中断导致数据不一致，当前版本暂不支持撤销导入批次。";
  const actions = document.createElement("div");
  actions.className = "transaction-detail-actions";
  actions.append(
    actionButton("查看本批次交易", () => { closeImportDetails(); filterImportJob(job.id, ""); }, "primary"),
    actionButton("查看待确认", () => { closeImportDetails(); filterImportJob(job.id, "pending_review"); }),
    actionButton("生成本批次摘要", () => { closeImportDetails(); askAgent(`请总结导入批次 ${job.filename}：成功 ${job.importedRows} 笔，重复 ${job.duplicateRows} 笔，待确认 ${job.reviewRows} 笔。`); }),
    actionButton("关闭", closeImportDetails)
  );
  importDetailContent.append(hero, facts, categorySection, reviewSection, notice, actions);
  importDetailLayer.hidden = false;
  document.body.classList.add("has-modal");
}

function filterImportJob(jobId, status) {
  state.importJobFilter = jobId;
  searchInput.value = "";
  statusFilter.value = status;
  renderJobs();
  renderTransactions();
  navigateToFeature("transactions", "#transactions");
}

function closeImportDetails() {
  if (!importDetailLayer || importDetailLayer.hidden) return;
  importDetailLayer.hidden = true;
  document.body.classList.remove("has-modal");
}

function renderImportSummary() {
  const job = state.lastImport ?? state.jobs.slice().sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))[0];
  const root = document.querySelector("#import-result");
  if (!job) {
    root.innerHTML = "<strong>等待账单</strong><span>上传后由 Agent 自动识别编码、表头和重复交易</span>";
    return;
  }
  for (const element of document.querySelectorAll("[data-import-step]")) {
    element.classList.add("complete");
    element.classList.toggle("active", element.dataset.importStep === "confirm");
  }
  const skipped = Math.max(0, Number(job.totalRows ?? 0) - Number(job.importedRows ?? 0) - Number(job.duplicateRows ?? 0));
  const source = sourceName(job.source);
  const month = job.month || latestTransactionMonth(state.transactions.filter((item) => item.source === job.source));
  root.replaceChildren();
  root.append(
    importResultItem("成功", `${job.importedRows ?? 0} 笔`),
    importResultItem("重复", `${job.duplicateRows ?? 0} 笔`),
    importResultItem("待确认", `${job.reviewRows ?? 0} 笔`),
    importResultItem("跳过", `${skipped} 行`),
    importResultItem("来源", source),
    importResultItem("月份", month || "待识别")
  );
}

function importResultItem(label, value) {
  const item = document.createElement("span");
  item.append(textSpan(label), strongText(value));
  return item;
}

function renderMobileHome() {
  const rows = currentMonthTransactions().slice().sort((left, right) => right.paidAt.localeCompare(left.paidAt));
  const pending = rows.filter((item) => item.status === "pending_review");
  const topCategory = state.analytics?.categoryShares?.[0];
  if (displayMode) {
    document.querySelector("#mobile-review-title").textContent = "2 笔交易需要确认";
    document.querySelector("#mobile-review-copy").textContent = "优先确认低置信度分类，完成后月报与预算会立即更新。";
    document.querySelector("#mobile-insight-title").textContent = "餐饮支出较上月增加 18%";
    document.querySelector("#mobile-insight-copy").textContent = "外卖与咖啡是主要增量，建议检查高频消费。";
    const recentRoot = document.querySelector("#mobile-recent-transactions");
    recentRoot.replaceChildren();
    const previewRows = [
      ["示例商户 A", "餐饮 / 正餐", "-¥••••", "amount-negative"],
      ["示例商户 B", "交通 / 打车", "-¥••••", "amount-negative"],
      ["示例收入", "收入", "+¥••••", "amount-positive"]
    ];
    for (const [merchant, category, amount, amountClass] of previewRows) {
      const item = document.createElement("div");
      item.className = "mobile-recent-row";
      const amountNode = strongText(amount);
      amountNode.className = amountClass;
      item.append(strongText(merchant), textSpan(category), amountNode);
      recentRoot.append(item);
    }
    return;
  }
  document.querySelector("#mobile-review-title").textContent = pending.length ? `${pending.length} 笔交易需要确认` : "本月没有待确认交易";
  document.querySelector("#mobile-review-copy").textContent = pending.length
    ? `优先处理 ${displayName(pending[0].merchantName ?? pending[0].counterparty ?? "未知商户")}，确认后图表会立即更新。`
    : "分类和状态均已同步，可以继续查看本月洞察。";
  document.querySelector("#mobile-insight-title").textContent = topCategory
    ? `${labelForCategory(topCategory.categoryId)}是主要支出`
    : "等待更多账本数据";
  document.querySelector("#mobile-insight-copy").textContent = topCategory
    ? `占本月支出 ${Math.round(topCategory.percent * 100)}%，金额 ${money(topCategory.expense)}。`
    : "导入微信或支付宝账单后，Agent 会生成分类和预算建议。";
  const recentRoot = document.querySelector("#mobile-recent-transactions");
  recentRoot.replaceChildren();
  if (rows.length === 0) {
    recentRoot.append(empty("还没有最近交易"));
    return;
  }
  for (const transaction of rows.slice(0, 3)) {
    const item = document.createElement("div");
    item.className = "mobile-recent-row";
    item.append(
      strongText(displayName(transaction.merchantName ?? transaction.counterparty ?? "未知商户")),
      textSpan(labelForCategory(transaction.categoryId ?? "")),
      amountText(transaction)
    );
    recentRoot.append(item);
  }
}

function renderCategories() {
  const root = document.querySelector("#categories");
  root.replaceChildren();
  const categories = state.report?.categories ?? [];
  if (categories.length === 0) {
    root.append(empty("\u6682\u65e0\u5206\u7c7b\u6570\u636e"));
    return;
  }
  for (const category of categories.slice(0, 8)) {
    root.append(rowItem(labelForCategory(category.categoryId), money(category.expense || category.income), "pill blue"));
  }
}

function renderInsights() {
  const root = document.querySelector("#insights");
  root.replaceChildren();
  const transfers = state.insights?.transferCandidates ?? [];
  const refunds = state.insights?.refundCandidates ?? [];
  const recurring = state.insights?.recurringPaymentCandidates ?? [];
  document.querySelector("#insight-count").textContent = String(transfers.length + refunds.length + recurring.length);

  if (transfers.length + refunds.length + recurring.length === 0) {
    root.append(empty("\u6682\u65e0\u5019\u9009\u9879"));
    return;
  }

  for (const item of transfers.slice(0, 4)) {
    root.append(rowItem("\u53ef\u80fd\u8f6c\u8d26", money(item.amount), "pill blue"));
  }
  for (const item of refunds.slice(0, 4)) {
    root.append(rowItem("\u53ef\u80fd\u9000\u6b3e", money(item.amount), "pill"));
  }
  for (const item of recurring.slice(0, 4)) {
    root.append(rowItem(`\u5468\u671f\u6263\u8d39 ${item.merchantName}`, money(item.amount), "pill warn"));
  }
}

function renderBudgets() {
  const root = document.querySelector("#budgets");
  root.replaceChildren();
  document.querySelector("#budget-count").textContent = String(state.budgets.length);
  if (state.budgets.length === 0) {
    root.append(empty("还没有预算", "为常用分类设置月度额度，Agent 会预测月底风险"));
    return;
  }

  for (const item of state.budgets) {
    const statusText = { over: "已超支", warning: "接近额度", ok: "正常" }[item.status] ?? "正常";
    const progress = monthProgress(item.budget.month);
    const projected = progress > 0 ? item.spent / progress : item.spent;
    const usage = item.budget.limitAmount > 0 ? item.spent / item.budget.limitAmount : 0;
    const card = document.createElement("article");
    card.className = `budget-card ${item.status}`;
    const head = document.createElement("div");
    head.className = "budget-head";
    head.append(strongText(labelForCategory(item.budget.categoryId)), pill(statusText, `status-badge ${item.status === "ok" ? "confirmed" : "risk"}`));
    const amounts = document.createElement("div");
    amounts.className = "budget-amounts";
    amounts.append(
      budgetValue("预算额度", money(item.budget.limitAmount)),
      budgetValue("已使用", money(item.spent)),
      budgetValue("剩余额度", money(Math.max(0, item.budget.limitAmount - item.spent))),
      budgetValue("使用比例", `${Math.round(usage * 100)}%`)
    );
    const track = document.createElement("div");
    track.className = "budget-track";
    const fill = document.createElement("div");
    fill.style.width = `${Math.min(100, usage * 100)}%`;
    track.append(fill);
    const forecast = document.createElement("p");
    forecast.textContent = `月份进度 ${Math.round(progress * 100)}% · 预计月底 ${money(projected)} · ${projected > item.budget.limitAmount ? "按当前速度可能超支" : "当前消费速度可控"}`;
    card.append(head, amounts, track, forecast);
    root.append(card);
  }
}

function budgetValue(label, value) {
  const element = document.createElement("span");
  element.append(textSpan(label), strongText(value));
  return element;
}

function monthProgress(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const now = new Date();
  const target = year * 12 + monthNumber;
  const current = now.getFullYear() * 12 + now.getMonth() + 1;
  if (target < current) return 1;
  if (target > current) return 0;
  return now.getDate() / new Date(year, monthNumber, 0).getDate();
}

function renderRules() {
  const root = document.querySelector("#rules");
  const logRoot = document.querySelector("#rule-hit-log");
  root.replaceChildren();
  logRoot.replaceChildren();
  document.querySelector("#rule-count").textContent = String(state.rules.length);
  if (state.rules.length === 0) {
    root.append(empty("\u6682\u65e0\u5b66\u4e60\u89c4\u5219"));
    logRoot.append(empty("暂无命中记录"));
    return;
  }

  for (const rule of state.rules.slice(0, 8)) {
    const row = document.createElement("div");
    row.className = "rule-row";
    const label = document.createElement("span");
    label.textContent = `${rule.pattern} → ${labelForCategory(rule.categoryId)} · ${formatDateTime(rule.updatedAt ?? rule.createdAt)}`;
    row.append(label, actionButton("\u5220\u9664", () => deleteRule(rule), "danger"));
    root.append(row);

    const matched = state.transactions.filter((transaction) => ruleMatchesTransaction(rule, transaction));
    const log = document.createElement("article");
    log.className = "rule-hit-row";
    const latest = matched.slice().sort((left, right) => right.paidAt.localeCompare(left.paidAt))[0];
    const copy = document.createElement("div");
    copy.append(strongText(`${rule.pattern} → ${labelForCategory(rule.categoryId)}`), textSpan(matched.length ? `命中 ${matched.length} 次 · 最近 ${formatDateTime(latest?.paidAt)}` : "暂无命中记录"));
    log.append(copy, actionButton("查看相关交易", () => filterTransactions(rule.pattern)));
    logRoot.append(log);
  }
}

function ruleMatchesTransaction(rule, transaction) {
  return agentSafetyUtils.ruleMatches(rule, transaction);
}

function formatDateTime(value) {
  const date = new Date(value ?? Date.now());
  return Number.isNaN(date.getTime()) ? "刚刚更新" : date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
}

function renderTransactions() {
  const root = document.querySelector("#transactions-body");
  const mobileRoot = document.querySelector("#mobile-transactions");
  root.replaceChildren();
  mobileRoot.replaceChildren();
  const transactions = filteredTransactions();
  document.querySelector("#transaction-total").textContent = `${transactions.length} \u6761`;

  if (transactions.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 11;
    cell.className = "table-empty";
    cell.textContent = searchInput.value || statusFilter.value
      ? "没有符合当前筛选条件的交易"
      : `${monthInput.value} 暂无交易，可手工记账或导入账单`;
    row.append(cell);
    root.append(row);
    mobileRoot.append(empty(cell.textContent));
    return;
  }

  for (const transaction of transactions.sort((left, right) => right.paidAt.localeCompare(left.paidAt))) {
    const tr = document.createElement("tr");
    tr.dataset.transactionId = transaction.id;
    tr.tabIndex = 0;
    tr.addEventListener("click", (event) => {
      if (!event.target.closest("button, input, select, label")) openTransactionDetails(transaction);
    });
    tr.addEventListener("keydown", (event) => {
      if (event.key === "Enter") openTransactionDetails(transaction);
    });
    tr.append(
      selectCell(transaction),
      td(displayName(transaction.merchantName || transaction.counterparty || "-")),
      td(transaction.productName || "无备注"),
      categoryCell(transaction),
      tdNode(amountText(transaction), "amount"),
      td(transaction.paidAt),
      tdNode(sourceBadge(transaction.source)),
      tdNode(statusBadge(transaction.status)),
      confidenceCell(transaction),
      tdNode(reasonContent(transaction)),
      statusCell(transaction)
    );
    root.append(tr);
    mobileRoot.append(transactionCard(transaction));
  }
}

function confidenceCell(transaction) {
  const cell = td("");
  cell.append(confidenceMeter(transaction.confidence));
  return cell;
}

function confidenceMeter(value) {
  const confidence = Math.round((value ?? 0.88) * 100);
  const wrap = document.createElement("div");
  wrap.className = "confidence-wrap";
  const label = document.createElement("span");
  label.textContent = `${confidence}%`;
  const track = document.createElement("div");
  track.className = "confidence-track";
  const fill = document.createElement("div");
  fill.style.width = `${Math.max(8, Math.min(confidence, 100))}%`;
  track.append(fill);
  wrap.append(label, track);
  return wrap;
}

function statusCell(transaction) {
  const cell = td("");
  const wrap = document.createElement("div");
  wrap.className = "status-actions";
  if (transaction.status !== "confirmed") wrap.append(actionButton("确认", () => updateStatus(transaction, "confirmed")));
  wrap.append(
    actionButton("修改", () => updateStatus(transaction, "pending_review")),
    actionButton("忽略", () => updateStatus(transaction, "ignored")),
    actionButton("问问智能体", () => askAgent(`解释这笔交易：${transaction.merchantName ?? transaction.counterparty ?? "未知交易"} ${money(transaction.amount)}`)),
    actionButton("删除", () => deleteTransaction(transaction), "danger")
  );
  cell.append(wrap);
  return cell;
}

function transactionCard(transaction) {
  const card = document.createElement("article");
  card.className = `transaction-card ${transaction.status === "pending_review" ? "pending-review" : ""}`;
  card.dataset.transactionId = transaction.id;
  card.tabIndex = 0;
  card.addEventListener("click", (event) => {
    if (!event.target.closest("button, input, select, label")) openTransactionDetails(transaction);
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") openTransactionDetails(transaction);
  });
  const title = document.createElement("div");
  title.className = "card-title";
  title.append(
    textSpan(displayName(transaction.merchantName || transaction.counterparty || "-")),
    amountText(transaction)
  );

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.textContent = transaction.paidAt;

  const detail = document.createElement("div");
  detail.className = "card-detail";
  detail.textContent = transaction.productName || "无备注";

  const badges = document.createElement("div");
  badges.className = "badge-row";
  badges.append(sourceBadge(transaction.source), statusBadge(transaction.status), pill(transaction.confidence < 0.75 ? "低置信度" : "Agent 已判断", "ai-badge"));

  const reason = document.createElement("div");
  reason.className = "card-reason";
  reason.append(reasonContent(transaction), confidenceMeter(transaction.confidence));

  const categoryField = document.createElement("label");
  categoryField.className = "card-category";
  categoryField.append(textSpan("分类"), createCategorySelect(transaction));

  const actions = document.createElement("div");
  actions.className = "card-actions";
  actions.append(
    actionButton("\u786e\u8ba4", () => updateStatus(transaction, "confirmed")),
    actionButton("修改", () => categoryField.querySelector("select")?.focus()),
    actionButton("\u5ffd\u7565", () => updateStatus(transaction, "ignored")),
    actionButton("问问智能体", () => askAgent(`解释这笔交易：${transaction.merchantName ?? transaction.counterparty ?? "未知交易"} ${money(transaction.amount)}`)),
    actionButton("\u5220\u9664", () => deleteTransaction(transaction), "danger")
  );

  card.append(title, meta, detail, badges, categoryField, reason, actions);
  return card;
}

function openTransactionDetails(transaction) {
  selectedTransactionForDetails = transaction;
  transactionDetailContent.replaceChildren();
  const merchant = displayName(transaction.merchantName || transaction.counterparty || "未知商户");
  const heading = document.createElement("div");
  heading.className = "transaction-detail-hero";
  heading.append(textSpan(sourceLabel(transaction)), strongText(merchant), amountText(transaction));

  const facts = document.createElement("dl");
  facts.className = "transaction-detail-facts";
  const rule = state.rules.find((item) => ruleMatchesTransaction(item, transaction));
  const recurring = (state.insights?.recurringPaymentCandidates ?? []).some((item) => item.transactionIds?.includes(transaction.id) || item.merchantName === transaction.merchantName);
  const budget = state.budgets.find((item) => item.budget?.categoryId === transaction.categoryId || item.categoryId === transaction.categoryId);
  const values = [
    ["商品 / 备注", transaction.productName || transaction.rawDescription || "无备注"],
    ["交易时间", formatFullDateTime(transaction.paidAt)],
    ["当前分类", labelForCategory(transaction.categoryId || "")],
    ["状态", statusLabel(transaction.status)],
    ["置信度", `${Math.round(Number(transaction.confidence ?? 0) * 100)}%`],
    ["规则命中", rule ? `是 · ${rule.pattern}` : "否"],
    ["智能体记忆", rule ? "已参考分类规则" : "暂无明确记忆命中"],
    ["疑似重复", "未发现"],
    ["周期扣费", recurring ? "疑似周期扣费" : "未发现"],
    ["相关预算", budget ? `${budget.status === "over" ? "已超支" : budget.status === "warning" ? "接近上限" : "正常"} · ${money(budget.spent ?? 0)} / ${money(budget.budget?.limitAmount ?? budget.limitAmount ?? 0)}` : "未设置"]
  ];
  for (const [label, value] of values) {
    const row = document.createElement("div");
    row.append(textSpan(label), strongText(value));
    facts.append(row);
  }

  const explanation = document.createElement("section");
  explanation.className = "classification-explanation";
  const points = [reasonFor(transaction)];
  if (rule) points.push(`命中了规则：“${rule.pattern} → ${labelForCategory(rule.categoryId)}”`);
  if (transaction.confidence < 0.75) points.push(`当前置信度为 ${Math.round(transaction.confidence * 100)}%，建议人工确认`);
  else points.push(`当前置信度为 ${Math.round(transaction.confidence * 100)}%`);
  const list = document.createElement("ul");
  points.forEach((point) => list.append(textListItem(point)));
  explanation.append(strongText("为什么这样分类？"), list);

  const categoryControl = document.createElement("label");
  categoryControl.className = "transaction-detail-category";
  categoryControl.append(textSpan("修改分类"), createCategorySelect(transaction));

  const actions = document.createElement("div");
  actions.className = "transaction-detail-actions";
  actions.append(
    actionButton("确认分类", async () => { await updateStatus(transaction, "confirmed"); closeTransactionDetails(); }),
    actionButton("忽略", async () => { await updateStatus(transaction, "ignored"); closeTransactionDetails(); }),
    actionButton("创建规则", () => { prepareRuleDraft(`把${merchant}自动归为${labelForCategory(transaction.categoryId || "")}`); closeTransactionDetails(); }),
    actionButton("问问智能体", () => { closeTransactionDetails(); askAgent(`请解释这笔交易为什么被归类：${merchant}，${money(transaction.amount)}`); }),
    actionButton("删除交易", async () => { await deleteTransaction(transaction); closeTransactionDetails(); }, "danger")
  );
  transactionDetailContent.append(heading, facts, explanation, categoryControl, actions);
  transactionDetailLayer.hidden = false;
  document.body.classList.add("has-modal");
  transactionDetailLayer.querySelector("[data-close-transaction-detail]")?.focus();
}

function closeTransactionDetails() {
  if (!transactionDetailLayer || transactionDetailLayer.hidden) return;
  transactionDetailLayer.hidden = true;
  selectedTransactionForDetails = null;
  document.body.classList.remove("has-modal");
}

function formatFullDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value ?? "-") : date.toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function sourceBadge(source) {
  return pill(sourceName(source), `source-badge source-${source ?? "unknown"}`);
}

function statusBadge(status) {
  const tone = status === "confirmed" ? "confirmed" : status === "ignored" ? "ignored" : "pending";
  return pill(statusLabel(status), `status-badge ${tone}`);
}

function reasonContent(transaction) {
  const wrap = document.createElement("div");
  wrap.className = "reason-content";
  wrap.append(pill(transaction.confidence < 0.75 ? "AI · 低置信度" : transaction.categoryId ? "AI · 规则/记忆" : "AI · 待判断", "ai-badge"), textSpan(reasonFor(transaction)));
  return wrap;
}

function filteredTransactions() {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  return state.transactions.filter((transaction) => {
    if (!transaction.paidAt?.startsWith(monthInput.value)) {
      return false;
    }
    if (status && transaction.status !== status) {
      return false;
    }
    if (state.importJobFilter && transaction.importJobId !== state.importJobFilter) {
      return false;
    }
    if (!query) {
      return true;
    }
    return [
      transaction.merchantName,
      transaction.counterparty,
      transaction.productName,
      transaction.categoryId,
      labelForCategory(transaction.categoryId),
      transaction.rawDescription
    ].filter(Boolean).join(" ").toLowerCase().includes(query);
  });
}

function selectCell(transaction) {
  const cell = td("");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = state.selectedTransactionIds.has(transaction.id);
  input.addEventListener("change", () => {
    if (input.checked) {
      state.selectedTransactionIds.add(transaction.id);
    } else {
      state.selectedTransactionIds.delete(transaction.id);
    }
  });
  cell.append(input);
  return cell;
}

function categoryCell(transaction) {
  const cell = td("");
  const wrap = document.createElement("div");
  wrap.className = "category-control";
  const dot = textSpan("", "category-dot");
  dot.style.background = categoryColors[transaction.categoryId] ?? "#8391a2";
  wrap.append(dot, createCategorySelect(transaction));
  cell.append(wrap);
  return cell;
}

function createCategorySelect(transaction) {
  const select = document.createElement("select");
  select.setAttribute("aria-label", `${transaction.merchantName ?? transaction.counterparty ?? "交易"}分类`);
  for (const [value, label] of categoryOptions) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = value === (transaction.categoryId ?? "");
    select.append(option);
  }
  select.addEventListener("change", async () => {
    if (!select.value) {
      return;
    }
    await runAction(async () => {
      await api(`/transactions/${transaction.id}`, {
        method: "PATCH",
        body: {
          userId: currentUserId(),
          categoryId: select.value
        }
      });
      await syncAfterChange("分类已更新，月报和图表已同步");
    });
  });
  return select;
}

async function updateStatus(transaction, status) {
  if (status === "confirmed") {
    document.querySelectorAll(`[data-transaction-id="${transaction.id}"]`).forEach((element) => element.classList.add("is-resolving"));
  }
  await runAction(async () => {
    await api(`/transactions/${transaction.id}/status`, {
      method: "PATCH",
      body: {
        userId: currentUserId(),
        status
      }
    });
    await syncAfterChange(status === "confirmed" ? "已确认，统计和图表已同步" : "\u4ea4\u6613\u72b6\u6001\u5df2\u66f4\u65b0");
  });
}

async function deleteTransaction(transaction) {
  if (!window.confirm(`确定删除“${transaction.merchantName ?? transaction.counterparty ?? "这笔交易"}”？删除后无法恢复。`)) return;
  await runAction(async () => {
    await api(`/transactions/${transaction.id}?userId=${encodeURIComponent(currentUserId())}`, {
      method: "DELETE"
    });
    state.selectedTransactionIds.delete(transaction.id);
    await syncAfterChange("\u4ea4\u6613\u5df2\u5220\u9664，统计已同步");
  });
}

async function deleteRule(rule) {
  await runAction(async () => {
    await api(`/classification-rules/${rule.id}?userId=${encodeURIComponent(currentUserId())}`, {
      method: "DELETE"
    });
    await syncAfterChange("\u5206\u7c7b\u89c4\u5219\u5df2\u5220\u9664");
  });
}

async function runAction(action, onError) {
  document.body.classList.add("is-busy");
  try {
    await action();
  } catch (error) {
    const handledMessage = onError ? onError(error) : undefined;
    showToast(typeof handledMessage === "string" ? handledMessage : onError ? "操作未完成，请检查后重试" : error.message ?? "\u64cd\u4f5c\u5931\u8d25", "error");
  } finally {
    document.body.classList.remove("is-busy");
  }
}

let toastTimer = 0;

function showToast(message, type = "info") {
  window.clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.className = type === "error" ? "toast show error" : "toast show";
  toastTimer = window.setTimeout(() => {
    toastEl.className = "toast";
  }, 2600);
}

async function api(path, options = {}) {
  const apiBase = configuredApiBase();
  if (isOfflineShell() && !apiBase) {
    return offlineApi(path, options);
  }
  try {
    const response = await fetch(`${apiBase}${path}`, {
      method: options.method ?? "GET",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { error: await response.text() };
    if (!response.ok) {
      throw new Error(data.error ?? `HTTP ${response.status}`);
    }
    if (!contentType.includes("application/json")) {
      throw new Error("接口没有返回 JSON");
    }
    return data;
  } catch (error) {
    if (isOfflineShell()) {
      return offlineApi(path, options);
    }
    throw error;
  }
}

function isOfflineShell() {
  return location.protocol === "file:" ||
    location.protocol === "capacitor:" ||
    location.hostname.includes("androidplatform.net") ||
    Boolean(window.Capacitor?.isNativePlatform?.()) ||
    window.Capacitor?.getPlatform?.() === "android";
}

function configuredApiBase() {
  return (localStorage.getItem("ledgermind-api-base") ?? "").trim().replace(/\/$/, "");
}

function shouldUseOfflineMode() {
  return isOfflineShell() && !configuredApiBase();
}

function getSiliconFlowApiKey() {
  return (localStorage.getItem("ledgermind-siliconflow-key") ?? bundledSiliconFlowApiKey).trim();
}

function decodeBase64Text(base64) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const decoders = ["utf-8", "gb18030", "gbk"];
  let best = "";
  let bestScore = Number.POSITIVE_INFINITY;
  for (const encoding of decoders) {
    try {
      const text = new TextDecoder(encoding).decode(bytes);
      const score = countReplacementChars(text) * 20 - countChineseChars(text);
      if (score < bestScore) {
        best = text;
        bestScore = score;
      }
    } catch {
      // Some WebViews do not expose every legacy decoder.
    }
  }
  return best || new TextDecoder().decode(bytes);
}

function countReplacementChars(text) {
  return (text.match(/\uFFFD/g) ?? []).length;
}

function countChineseChars(text) {
  return (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
}

function parseOfflineCsvTransactions(userId, filename, content, existingTransactions) {
  const now = new Date().toISOString();
  const rows = parseCsvRows(content).filter((row) => row.some((cell) => cell.trim()));
  return parseOfflineRowsTransactions(userId, filename, rows, existingTransactions, now);
}

async function parseOfflineXlsxTransactions(userId, filename, base64, existingTransactions) {
  const now = new Date().toISOString();
  if (!window.JSZip) {
    throw new Error("XLSX 解析器未加载");
  }
  const zip = await window.JSZip.loadAsync(base64, { base64: true });
  const rows = await xlsxRowsFromZip(zip);
  return parseOfflineRowsTransactions(userId, filename, normalizeXlsxRows(rows), existingTransactions, now);
}

function parseOfflineRowsTransactions(userId, filename, rows, existingTransactions, now) {
  const headerIndex = findOfflineHeaderIndex(rows);
  const headers = (rows[headerIndex] ?? rows[0] ?? []).map((cell) => normalizeHeader(cell));
  const dataRows = rows.slice(Math.max(0, headerIndex + 1));
  const transactions = [];
  let duplicateRows = 0;
  let reviewRows = 0;

  for (const [index, row] of dataRows.entries()) {
    if (row.length < 3 || row.some((cell) => /微信支付账单|支付宝交易记录明细|交易记录明细/i.test(cell))) {
      continue;
    }
    const record = recordFromRow(headers, row);
    const paidAt = pickRecord(record, row, ["交易时间", "支付时间", "交易创建时间", "付款时间", "时间", "paidAt", "date"], 0) || now.slice(0, 19).replace("T", " ");
    const merchantName = pickRecord(record, row, ["交易对方", "商户", "商户名称", "收付款方", "收/付款方", "对方", "merchant", "counterparty"], 1) || "未知商户";
    const productName = pickRecord(record, row, ["商品", "商品说明", "商品名称", "交易说明", "备注", "product", "description"], 2) || "";
    const amountText = pickRecord(record, row, ["金额", "交易金额", "金额元", "交易金额元", "amount"], 3);
    const amount = Math.abs(Number(String(amountText).replace(/[^\d.-]/g, "")));
    if (!Number.isFinite(amount) || amount <= 0) {
      continue;
    }
    const directionText = pickRecord(record, row, ["收/支", "收支", "交易类型", "交易分类", "方向", "direction"], 4);
    const rowText = row.join(" ");
    const direction = /退款|退回|refund/i.test(rowText)
      ? "refund"
      : /收入|收款|转入|income/i.test(directionText)
        ? "income"
        : "expense";
    const categoryId = inferOfflineCategory(`${merchantName} ${productName}`);
    const confidence = categoryId ? 0.86 : 0.58;
    const fingerprint = `${paidAt}|${merchantName}|${amount.toFixed(2)}|${direction}`;
    const duplicate = existingTransactions.some((item) => item.userId === userId &&
      `${item.paidAt}|${item.merchantName ?? item.counterparty ?? ""}|${Number(item.amount).toFixed(2)}|${item.direction}` === fingerprint
    ) || transactions.some((item) =>
      `${item.paidAt}|${item.merchantName ?? ""}|${Number(item.amount).toFixed(2)}|${item.direction}` === fingerprint
    );
    if (duplicate) {
      duplicateRows += 1;
      continue;
    }
    if (!categoryId) {
      reviewRows += 1;
    }
    transactions.push({
      id: `txn-local-${Date.now()}-${index}`,
      userId,
      source: filename.toLowerCase().includes("alipay") || filename.includes("支付宝") ? "alipay" : filename.toLowerCase().includes("wechat") || filename.includes("微信") ? "wechat" : "csv",
      direction,
      amount,
      currency: "CNY",
      paidAt,
      merchantName,
      productName,
      categoryId,
      tags: [],
      confidence,
      status: categoryId ? "confirmed" : "pending_review",
      createdAt: now,
      updatedAt: now
    });
  }

  const job = {
    id: `job-local-${Date.now()}`,
    userId,
    source: filename.toLowerCase().includes("alipay") || filename.includes("支付宝") ? "alipay" : filename.toLowerCase().includes("wechat") || filename.includes("微信") ? "wechat" : "csv",
    filename,
    status: "completed",
    totalRows: dataRows.length,
    importedRows: transactions.length,
    duplicateRows,
    reviewRows,
    errors: [],
    createdAt: now,
    updatedAt: now
  };
  return { job, transactions };
}

async function xlsxRowsFromZip(zip) {
  const sharedStrings = await readXlsxSharedStrings(zip);
  const workbookXml = await zip.file("xl/workbook.xml")?.async("text");
  const relsXml = await zip.file("xl/_rels/workbook.xml.rels")?.async("text");
  const firstSheetRelId = workbookXml?.match(/<sheet[^>]+r:id="([^"]+)"/)?.[1];
  const sheetTarget = firstSheetRelId && relsXml
    ? relsXml.match(new RegExp(`<Relationship[^>]+Id="${escapeRegExp(firstSheetRelId)}"[^>]+Target="([^"]+)"`))?.[1]
    : undefined;
  const sheetPath = sheetTarget
    ? `xl/${sheetTarget.replace(/^\/?xl\//, "")}`
    : "xl/worksheets/sheet1.xml";
  const sheetXml = await zip.file(sheetPath)?.async("text");
  if (!sheetXml) {
    throw new Error("未找到 XLSX 工作表");
  }
  const rows = [];
  for (const rowMatch of sheetXml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const row = [];
    for (const cellMatch of rowMatch[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const ref = attrs.match(/\sr="([A-Z]+)\d+"/)?.[1];
      const colIndex = ref ? columnNameToIndex(ref) : row.length;
      const type = attrs.match(/\st="([^"]+)"/)?.[1] ?? "";
      const raw = body.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "";
      const value = type === "s" ? sharedStrings[Number(raw)] ?? "" : decodeXml(raw);
      row[colIndex] = value;
    }
    if (row.some((cell) => String(cell ?? "").trim())) {
      rows.push(row.map((cell) => String(cell ?? "")));
    }
  }
  return rows;
}

function normalizeXlsxRows(rows) {
  const headerIndex = rows.findIndex((row) => {
    const text = row.map(normalizeHeader).join("|");
    return /交易时间|支付时间|交易创建时间|付款时间|时间/.test(text) && /金额|交易金额/.test(text);
  });
  if (headerIndex < 0) {
    return rows;
  }

  const headers = rows[headerIndex].map(normalizeHeader);
  const timeColumns = headers
    .map((header, index) => (/交易时间|支付时间|交易创建时间|付款时间|时间/.test(header) ? index : -1))
    .filter((index) => index >= 0);

  return rows.map((row, rowIndex) => {
    if (rowIndex <= headerIndex) {
      return row;
    }
    const next = [...row];
    for (const index of timeColumns) {
      next[index] = excelSerialToDateTime(next[index]) ?? next[index];
    }
    return next;
  });
}

function excelSerialToDateTime(value) {
  const trimmed = String(value ?? "").trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return undefined;
  }
  const serial = Number(trimmed);
  if (!Number.isFinite(serial) || serial < 20000 || serial > 80000) {
    return undefined;
  }

  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

async function readXlsxSharedStrings(zip) {
  const xml = await zip.file("xl/sharedStrings.xml")?.async("text");
  if (!xml) {
    return [];
  }
  return [...xml.matchAll(/<si[^>]*>([\s\S]*?)<\/si>/g)].map((match) =>
    [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((part) => decodeXml(part[1])).join("")
  );
}

function columnNameToIndex(name) {
  return [...name].reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function decodeXml(value) {
  return String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseCsvRows(content) {
  const delimiter = detectDelimiter(content);
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      cell += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

function detectDelimiter(content) {
  const sample = content.split(/\r?\n/).filter((line) => line.trim().length > 0).slice(0, 20).join("\n");
  const tabCount = (sample.match(/\t/g) ?? []).length;
  const commaCount = (sample.match(/,/g) ?? []).length;
  return tabCount > commaCount ? "\t" : ",";
}

function findOfflineHeaderIndex(rows) {
  const index = rows.findIndex((row) => {
    const normalized = row.map((cell) => normalizeHeader(cell)).join("|");
    return /交易时间|支付时间|交易创建时间|付款时间|金额|交易金额/.test(normalized) &&
      /交易对方|商户|收付款方|商品|商品说明|备注|对方/.test(normalized);
  });
  return index >= 0 ? index : 0;
}

function normalizeHeader(header) {
  return String(header)
    .replace(/^\uFEFF/, "")
    .replace(/[："'\s/（）()_-]/g, "")
    .trim();
}

function recordFromRow(headers, row) {
  const record = {};
  headers.forEach((header, index) => {
    record[header] = row[index] ?? "";
  });
  return record;
}

function pickRecord(record, row, keys, fallbackIndex) {
  for (const key of keys) {
    const normalizedKey = normalizeHeader(key);
    const value = record[normalizedKey] ?? fuzzyRecordValue(record, normalizedKey);
    if (value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }
  return String(row[fallbackIndex] ?? "").trim();
}

function fuzzyRecordValue(record, key) {
  const entry = Object.entries(record).find(([candidate, value]) =>
    value && (candidate.includes(key) || key.includes(candidate))
  );
  return entry?.[1];
}

function inferOfflineCategory(text) {
  if (/咖啡|奶茶|餐|饭|食|麦当劳|肯德基|星巴克|瑞幸|coffee|food|restaurant|lunch/i.test(text)) {
    return "food.restaurant";
  }
  if (/打车|出租|地铁|公交|滴滴|优步|uber|taxi|transport/i.test(text)) {
    return "transport.taxi";
  }
  if (/订阅|会员|视频|notion|figma|netflix|saas|subscription/i.test(text)) {
    return "subscription.video";
  }
  if (/超市|购物|淘宝|京东|拼多多|grocery|shopping/i.test(text)) {
    return "shopping.grocery";
  }
  if (/房租|租金|公寓|rent|housing/i.test(text)) {
    return "housing.rent";
  }
  return "";
}

function isGreetingQuestion(question) {
  return /^(你好|您好|hello|hi|嗨|在吗|测试|test)[\s!！。？?]*$/i.test(String(question).trim());
}

function buildOfflineAgentAnswer(userId, month, question, store) {
  const report = monthlyReport(userId, month, store.transactions);
  const analytics = monthlyAnalytics(userId, month, store.transactions);
  const insights = offlineInsights(store.transactions.filter((item) => item.userId === userId));
  const text = String(question).toLowerCase();
  const savings = Math.max(0, report.expense * 0.08);
  const topMerchant = analytics.topMerchants[0];
  const topCategory = analytics.categoryShares[0];
  const recurringCount = insights.recurringPaymentCandidates.length;
  let answer = "";
  let actions = ["总结本月花销", "检查订阅", "生成节省计划"];

  if (/导入|账单|csv|乱码|编码|识别|支付宝|微信/.test(text)) {
    answer = "导入账单时我会优先识别 UTF-8、GBK/GB18030 编码，并跳过微信/支付宝账单前面的说明行。如果仍有漏识别，建议确认文件是 CSV 原始导出，不要先用表格软件另存。";
    actions = ["重新导入账单", "查看导入记录", "检查待确认交易"];
  } else if (/订阅|扣费|会员|subscription|saas|netflix|notion|figma/.test(text)) {
    answer = recurringCount > 0
      ? `我在本机账本里发现 ${recurringCount} 个周期扣费候选。建议先检查订阅类交易，确认是否还在使用，尤其是金额上涨或低频使用的服务。`
      : "目前账本里还没有明显的周期订阅候选。你可以多导入 2-3 个月账单，周期扣费识别会更准。";
    actions = ["审核订阅", "创建订阅规则", "生成节省计划"];
  } else if (/节省|省钱|预算|超支|save|budget|¥?200|200元/.test(text)) {
    answer = `按当前账本，本月可以先设置 ${money(savings)} 的保守节省目标。优先处理三类：订阅扣费、高频餐饮、待确认的未知商户。`;
    actions = ["生成节省计划", "查看预算", "检查异常"];
  } else if (/餐饮|吃饭|咖啡|午餐|晚餐|food|coffee|restaurant/.test(text)) {
    answer = topMerchant
      ? `餐饮或高频消费可以先看 Top 商户：${topMerchant.merchantName}，本月记录支出 ${money(topMerchant.expense)}。如果它不是餐饮商户，请先去交易页修正分类，我会学习这个规则。`
      : "当前还没有足够的餐饮交易。导入微信/支付宝账单或手工记一笔后，我可以分析餐饮上涨原因。";
    actions = ["查看 Top 商户", "修正分类", "创建餐饮规则"];
  } else if (/分类|规则|归类|打车|交通|商户|category|rule/.test(text)) {
    answer = "你可以在交易页修正任意一笔分类，我会把商户和分类记成规则。比如把打车商户归为交通后，后续相似交易会自动归类。";
    actions = ["打开交易页", "创建规则", "查看智能体记忆"];
  } else if (/总结|月报|本月|花销|支出|收入|summary|report/.test(text)) {
    answer = `本月摘要：共 ${report.transactionCount} 笔交易，支出 ${money(report.expense)}，收入 ${money(report.income)}，净额 ${money(report.net)}。${topCategory ? `占比最高的分类是 ${labelForCategory(topCategory.categoryId)}。` : "分类数据还不够完整。"}`;
    actions = ["查看月报", "查看分类占比", "导出 CSV"];
  } else {
    answer = `我理解你的问题是“${question}”。当前是本机离线模式，我可以基于账本回答支出、订阅、预算、导入、分类规则等问题；如果想自由对话，请在设置里保存 API Key。`;
  }

  return {
    answer,
    cards: [
      { label: "本月支出", value: money(report.expense) },
      { label: "可节省空间", value: money(savings) },
      { label: "待确认", value: String(report.pendingReviewCount) },
      { label: "模式", value: getSiliconFlowApiKey() ? "模型回退" : "本机离线" }
    ],
    actions
  };
}

async function directSiliconFlowAnswer(userId, month, question, store) {
  const apiKey = getSiliconFlowApiKey();
  if (!apiKey) {
    return null;
  }

  const report = monthlyReport(userId, month, store.transactions);
  const analytics = monthlyAnalytics(userId, month, store.transactions);
  const insights = offlineInsights(store.transactions.filter((item) => item.userId === userId));
  const transactions = store.transactions
    .filter((item) => item.userId === userId && item.paidAt.startsWith(month))
    .sort((left, right) => right.paidAt.localeCompare(left.paidAt))
    .slice(0, 20)
    .map((item) => ({
      paidAt: item.paidAt,
      merchant: item.merchantName ?? item.counterparty ?? "未知商户",
      product: item.productName ?? "",
      direction: item.direction,
      amount: item.amount,
      categoryId: item.categoryId ?? "未分类",
      status: item.status
    }));
  const savings = Math.max(0, report.expense * 0.08);
  const payload = {
    model: "deepseek-ai/DeepSeek-V4-Flash",
    temperature: 0.25,
    max_tokens: 900,
    messages: [
      {
        role: "system",
        content: [
          "你是 LedgerMind OS 的中文财务记账智能体。",
          "你只能基于用户账本上下文回答，不要编造不存在的交易。",
          "回答要简洁、可执行，优先指出异常、订阅、预算风险和下一步操作。",
          "不要使用 Markdown、emoji、粗体符号或长段落。",
          "最多输出 4 句中文短句，每句只讲一个结论。"
        ].join("\n")
      },
      {
        role: "user",
        content: `用户问题：${question || "请总结本月账本。"}\n\n账本上下文 JSON：\n${JSON.stringify({
          month,
          report,
          topMerchants: analytics.topMerchants.slice(0, 8),
          categoryShares: analytics.categoryShares.slice(0, 8),
          recurringPaymentCandidates: insights.recurringPaymentCandidates.slice(0, 8),
          recentTransactions: transactions
        }, null, 2)}`
      }
    ]
  };

  try {
    const data = await nativeJsonPost("https://api.siliconflow.cn/v1/chat/completions", payload, {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    });
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      throw new Error("模型没有返回内容");
    }
    return {
      answer,
      cards: [
        { label: "本月支出", value: money(report.expense) },
        { label: "可节省空间", value: money(savings) },
        { label: "待确认", value: String(report.pendingReviewCount) },
        { label: "模型", value: "DeepSeek V4 Flash" }
      ],
      actions: ["审核订阅", "生成节省计划", "打开待处理收件箱"],
      provider: "SiliconFlow"
    };
  } catch (error) {
    showToast(`云端模型调用失败，已回退本机分析：${error.message ?? "未知错误"}`, "error");
    return null;
  }
}

async function nativeJsonPost(url, body, headers) {
  const capacitorHttp = window.Capacitor?.Plugins?.CapacitorHttp ?? window.CapacitorHttp;
  if (capacitorHttp?.post) {
    const response = await capacitorHttp.post({
      url,
      headers,
      data: body,
      responseType: "json"
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP ${response.status}`);
    }
    return typeof response.data === "string" ? JSON.parse(response.data) : response.data;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await response.json() : null;
    if (!response.ok) {
      throw new Error(data?.error?.message ?? `HTTP ${response.status}`);
    }
    if (!data) {
      throw new Error("模型接口未返回 JSON");
    }
    return data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("模型请求超时，请检查网络后重试");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function offlineApi(path, options = {}) {
  const store = offlineStore();
  const method = options.method ?? "GET";
  const body = options.body ?? {};
  const url = new URL(path, "https://offline.local");
  const pathUserId = url.pathname.match(/^\/users\/([^/]+)\/data$/)?.[1];
  const userId = String(
    body.userId
      ?? url.searchParams.get("userId")
      ?? (pathUserId ? decodeURIComponent(pathUserId) : currentUserId())
  );
  const month = String(body.month ?? url.searchParams.get("month") ?? monthInput.value);

  if (url.pathname === "/health") {
    return { ok: true, service: "ledgermind-offline-mobile" };
  }
  if (url.pathname === "/demo/import-samples" && method === "POST") {
    store.transactions = [...store.transactions.filter((item) => item.userId !== userId), ...sampleTransactions(userId)];
    store.jobs = [...store.jobs.filter((item) => item.userId !== userId), ...sampleJobs(userId)];
    saveOfflineStore(store);
    return { results: [{ job: store.jobs[0] }, { job: store.jobs[1] }] };
  }
  if (url.pathname === "/imports" && method === "POST") {
    const filename = String(body.filename ?? "mobile-bill.csv");
    const parsed = filename.toLowerCase().endsWith(".xlsx") && body.contentBase64
      ? await parseOfflineXlsxTransactions(userId, filename, String(body.contentBase64), store.transactions)
      : parseOfflineCsvTransactions(userId, filename, body.contentBase64 ? decodeBase64Text(String(body.contentBase64)) : String(body.content ?? ""), store.transactions);
    store.transactions.push(...parsed.transactions);
    store.jobs.push(parsed.job);
    saveOfflineStore(store);
    return parsed;
  }
  if (url.pathname === "/transactions/manual" && method === "POST") {
    const now = new Date().toISOString();
    const transaction = {
      id: `txn-local-${Date.now()}`,
      userId,
      source: "manual",
      direction: String(body.direction ?? "expense"),
      amount: Number(body.amount),
      currency: "CNY",
      paidAt: String(body.paidAt ?? now.slice(0, 19).replace("T", " ")),
      merchantName: String(body.merchantName ?? "").trim() || "手工记账",
      productName: String(body.productName ?? "").trim(),
      categoryId: String(body.categoryId ?? "").trim(),
      tags: [],
      confidence: String(body.categoryId ?? "").trim() ? 1 : 0.72,
      status: String(body.categoryId ?? "").trim() ? "confirmed" : "pending_review",
      createdAt: now,
      updatedAt: now
    };
    store.transactions.push(transaction);
    saveOfflineStore(store);
    return { transaction };
  }
  if (url.pathname === "/transactions") {
    return { transactions: store.transactions.filter((item) => item.userId === userId) };
  }
  if (url.pathname === "/imports") {
    return { jobs: store.jobs.filter((item) => item.userId === userId) };
  }
  if (url.pathname === "/reports/monthly") {
    return monthlyReport(userId, month, store.transactions);
  }
  if (url.pathname === "/analytics/monthly") {
    return monthlyAnalytics(userId, month, store.transactions);
  }
  if (url.pathname === "/insights") {
    return offlineInsights(store.transactions.filter((item) => item.userId === userId));
  }
  if (url.pathname === "/budgets/status") {
    return { budgets: budgetStatuses(userId, month, store.budgets, store.transactions) };
  }
  if (url.pathname === "/classification-rules") {
    return { rules: store.rules.filter((item) => item.userId === userId) };
  }
  if (url.pathname.startsWith("/classification-rules/") && method === "DELETE") {
    const ruleId = url.pathname.split("/")[2];
    store.rules = store.rules.filter((rule) => rule.id !== ruleId || rule.userId !== userId);
    saveOfflineStore(store);
    return { deleted: true };
  }
  if (url.pathname === "/agent/ask" && method === "POST") {
    const question = String(body.question ?? "");
    if (isGreetingQuestion(question)) {
      return {
        answer: "你好，我是 LedgerMind 的本机记账智能体。你可以问我本月花销、订阅扣费、预算风险，也可以让我帮你生成节省计划。",
        cards: [
          { label: "本月支出", value: money(monthlyReport(userId, month, store.transactions).expense) },
          { label: "数据位置", value: "本机保存" },
          { label: "可提问", value: "支出 / 订阅 / 预算" },
          { label: "模式", value: "本机离线" }
        ],
        actions: ["总结本月花销", "检查订阅", "生成节省计划"]
      };
    }
    const directAnswer = await directSiliconFlowAnswer(userId, month, String(body.question ?? ""), store);
    if (directAnswer) {
      return directAnswer;
    }
    return buildOfflineAgentAnswer(userId, month, question, store);
  }
  if (url.pathname === "/automation-rules" && method === "POST") {
    const command = String(body.command ?? "");
    const pattern = command.match(/(?:把|将)(.+?)(?:自动)?(?:归为|分类为)/)?.[1]?.trim()
      ?? command.match(/categorize\s+(.+?)\s+as\s+/i)?.[1]
      ?? command.replace(/^always\s+/i, "").split(/\s+as\s+/i)[0];
    const categoryId = /打车|滴滴|优步|交通|uber|taxi|transport/i.test(command)
      ? "transport.taxi"
      : /咖啡|餐饮|吃饭|coffee|food|restaurant/i.test(command)
        ? "food.restaurant"
        : /订阅|会员|视频|subscription|notion|figma/i.test(command)
          ? "subscription.video"
          : /购物|超市|买菜|shopping|grocery/i.test(command)
            ? "shopping.grocery"
            : "life.daily";
    const rule = {
      id: `rule-${Date.now()}`,
      userId,
      categoryId,
      matchType: "contains",
      field: "merchantName",
      pattern: pattern.trim() || command,
      priority: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.rules.push(rule);
    saveOfflineStore(store);
    return { rule, message: `规则已创建：${rule.pattern} → ${labelForCategory(rule.categoryId)}` };
  }
  if (url.pathname === "/transactions/batch" && method === "PATCH") {
    for (const id of body.transactionIds ?? []) {
      const item = store.transactions.find((transaction) => transaction.id === id && transaction.userId === userId);
      if (item) {
        item.categoryId = body.categoryId;
        item.status = "confirmed";
      }
    }
    saveOfflineStore(store);
    return { transactions: store.transactions, updatedRows: body.transactionIds?.length ?? 0 };
  }
  if (url.pathname.startsWith("/transactions/") && method === "PATCH") {
    const [, , transactionId, action] = url.pathname.split("/");
    const item = store.transactions.find((transaction) => transaction.id === transactionId && transaction.userId === userId);
    if (item && action === "status") {
      item.status = body.status;
    } else if (item) {
      item.categoryId = body.categoryId;
      item.status = "confirmed";
    }
    saveOfflineStore(store);
    return { transaction: item };
  }
  if (url.pathname.startsWith("/transactions/") && method === "DELETE") {
    const transactionId = url.pathname.split("/")[2];
    store.transactions = store.transactions.filter((transaction) => transaction.id !== transactionId || transaction.userId !== userId);
    saveOfflineStore(store);
    return { deleted: true };
  }
  if (url.pathname === "/budgets" && method === "PUT") {
    const now = new Date().toISOString();
    const budget = { id: `budget-${userId}-${month}-${body.categoryId}`, userId, month, categoryId: body.categoryId, limitAmount: Number(body.limitAmount), createdAt: now, updatedAt: now };
    store.budgets = [
      ...store.budgets.filter((item) => !(item.userId === userId && item.month === month && item.categoryId === body.categoryId)),
      budget
    ];
    saveOfflineStore(store);
    return { budget };
  }
  if (url.pathname.endsWith("/data") && method === "DELETE") {
    store.transactions = store.transactions.filter((item) => item.userId !== userId);
    store.jobs = store.jobs.filter((item) => item.userId !== userId);
    store.rules = store.rules.filter((item) => item.userId !== userId);
    store.budgets = store.budgets.filter((item) => item.userId !== userId);
    saveOfflineStore(store);
    return { deleted: true, removedRows: {} };
  }
  return {};
}

function offlineStore() {
  const saved = localStorage.getItem("ledgermind-offline-store");
  if (saved) {
    try {
      return normalizeOfflineStore(JSON.parse(saved));
    } catch {
      localStorage.removeItem("ledgermind-offline-store");
    }
  }
  const store = {
    schemaVersion: 2,
    transactions: [],
    jobs: [],
    rules: [],
    budgets: []
  };
  saveOfflineStore(store);
  return store;
}

function saveOfflineStore(store) {
  localStorage.setItem("ledgermind-offline-store", JSON.stringify({ ...store, schemaVersion: 2 }));
}

function normalizeOfflineStore(value) {
  const store = value && typeof value === "object" ? value : {};
  return {
    schemaVersion: 2,
    transactions: Array.isArray(store.transactions) ? store.transactions : [],
    jobs: Array.isArray(store.jobs) ? store.jobs : [],
    rules: Array.isArray(store.rules) ? store.rules : [],
    budgets: Array.isArray(store.budgets)
      ? store.budgets.map((item) => item?.budget ?? item).filter(Boolean)
      : []
  };
}

function sampleTransactions(userId) {
  const now = new Date().toISOString();
  return [
    sampleTransaction(userId, "txn-mobile-1", "wechat", "2026-05-01 08:30:00", "星巴克", "拿铁", "expense", 6.8, "food.coffee", 0.94, "confirmed", now),
    sampleTransaction(userId, "txn-mobile-2", "alipay", "2026-05-02 09:20:00", "Notion", "团队套餐", "expense", 12, "subscription.video", 0.98, "confirmed", now),
    sampleTransaction(userId, "txn-mobile-3", "wechat", "2026-05-03 18:10:00", "优步", "机场打车", "expense", 18.4, "transport.taxi", 0.89, "pending_review", now),
    sampleTransaction(userId, "txn-mobile-4", "alipay", "2026-05-04 20:12:00", "未知商户", "线上订单", "expense", 42.3, "shopping.grocery", 0.62, "pending_review", now),
    sampleTransaction(userId, "txn-mobile-5", "wechat", "2026-05-05 12:00:00", "自由职业客户", "发票入账", "income", 680, "", 1, "confirmed", now)
  ];
}

function sampleTransaction(userId, id, source, paidAt, merchantName, productName, direction, amount, categoryId, confidence, status, now) {
  return {
    id,
    userId,
    source,
    direction,
    amount,
    currency: "CNY",
    paidAt,
    merchantName,
    productName,
    categoryId,
    tags: [],
    confidence,
    status,
    createdAt: now,
    updatedAt: now
  };
}

function sampleJobs(userId) {
  const now = new Date().toISOString();
  return [
    { id: "job-mobile-wechat", userId, source: "wechat", filename: "微信示例账单.csv", status: "completed", totalRows: 3, importedRows: 3, duplicateRows: 0, reviewRows: 1, errors: [], createdAt: now, updatedAt: now },
    { id: "job-mobile-alipay", userId, source: "alipay", filename: "支付宝示例账单.csv", status: "completed", totalRows: 2, importedRows: 2, duplicateRows: 0, reviewRows: 1, errors: [], createdAt: now, updatedAt: now }
  ];
}

function monthlyReport(userId, month, transactions) {
  const rows = transactions.filter((item) => item.userId === userId && item.paidAt.startsWith(month));
  const income = rows.filter((item) => item.direction === "income" || item.direction === "refund").reduce((sum, item) => sum + item.amount, 0);
  const expense = rows.filter((item) => item.direction === "expense").reduce((sum, item) => sum + item.amount, 0);
  const categories = [...new Set(rows.map((item) => item.categoryId).filter(Boolean))].map((categoryId) => ({
    categoryId,
    income: rows.filter((item) => item.categoryId === categoryId && (item.direction === "income" || item.direction === "refund")).reduce((sum, item) => sum + item.amount, 0),
    expense: rows.filter((item) => item.categoryId === categoryId && item.direction === "expense").reduce((sum, item) => sum + item.amount, 0),
    count: rows.filter((item) => item.categoryId === categoryId).length
  }));
  return {
    userId,
    month,
    income,
    expense,
    net: income - expense,
    transactionCount: rows.length,
    pendingReviewCount: rows.filter((item) => item.status === "pending_review").length,
    categories
  };
}

function monthlyAnalytics(userId, month, transactions) {
  const report = monthlyReport(userId, month, transactions);
  const rows = transactions.filter((item) => item.userId === userId && item.paidAt.startsWith(month) && item.direction === "expense");
  const merchantMap = new Map();
  for (const item of rows) {
    const merchantName = item.merchantName || item.counterparty || "未知商户";
    const current = merchantMap.get(merchantName) ?? { merchantName, expense: 0, count: 0 };
    current.expense += item.amount;
    current.count += 1;
    merchantMap.set(merchantName, current);
  }
  return {
    userId,
    month,
    dailyExpenses: Array.from({ length: 31 }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      return { date: `${month}-${day}`, expense: rows.filter((item) => item.paidAt.startsWith(`${month}-${day}`)).reduce((sum, item) => sum + item.amount, 0) };
    }),
    topMerchants: [...merchantMap.values()].sort((a, b) => b.expense - a.expense).slice(0, 5),
    categoryShares: report.categories.map((item) => ({ categoryId: item.categoryId, expense: item.expense, percent: report.expense > 0 ? item.expense / report.expense : 0 }))
  };
}

function budgetStatuses(userId, month, budgets, transactions) {
  return budgets
    .filter((budget) => budget.userId === userId && budget.month === month)
    .map((budget) => {
      const spent = transactions
        .filter((item) => item.userId === userId && item.paidAt.startsWith(month) && item.direction === "expense" && item.categoryId === budget.categoryId)
        .reduce((sum, item) => sum + item.amount, 0);
      const remaining = Math.max(0, budget.limitAmount - spent);
      const usageRatio = budget.limitAmount > 0 ? spent / budget.limitAmount : 0;
      return {
        budget,
        spent,
        remaining,
        usageRatio,
        status: usageRatio > 1 ? "over" : usageRatio > 0.8 ? "warning" : "ok"
      };
    });
}

function offlineInsights(transactions) {
  return {
    transferCandidates: [],
    refundCandidates: [],
    recurringPaymentCandidates: transactions
      .filter((item) => item.categoryId?.includes("subscription"))
      .map((item) => ({ merchantName: item.merchantName, categoryId: item.categoryId, amount: item.amount, intervalDays: 30, occurrences: 1, transactionIds: [item.id], confidence: 0.82 }))
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("\u6587\u4ef6\u8bfb\u53d6\u5931\u8d25"));
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });
}

function exportOfflineBackup() {
  const store = offlineStore();
  const userId = currentUserId();
  const backup = {
    exportedAt: new Date().toISOString(),
    userId,
    transactions: store.transactions.filter((item) => item.userId === userId),
    importJobs: store.jobs.filter((item) => item.userId === userId),
    budgets: store.budgets.filter((item) => item.userId === userId),
    rules: store.rules.filter((item) => item.userId === userId)
  };
  downloadTextFile(
    `ledgermind-backup-${userId}-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(backup, null, 2),
    "application/json;charset=utf-8"
  );
  showToast("本地备份已生成");
}

function exportOfflineTransactionsCsv() {
  const store = offlineStore();
  const userId = currentUserId();
  const month = monthInput.value;
  const rows = store.transactions
    .filter((item) => item.userId === userId && item.paidAt.startsWith(month))
    .sort((left, right) => right.paidAt.localeCompare(left.paidAt));
  const headers = ["时间", "方向", "金额", "商户", "商品/备注", "分类", "状态", "来源"];
  const lines = [
    headers,
    ...rows.map((item) => [
      item.paidAt,
      directionLabel(item.direction),
      Number(item.amount).toFixed(2),
      item.merchantName ?? item.counterparty ?? "",
      item.productName ?? "",
      item.categoryId ? labelForCategory(item.categoryId) : "未分类",
      statusLabel(item.status),
      item.source ?? ""
    ])
  ].map((row) => row.map(csvCell).join(","));
  downloadTextFile(`ledgermind-transactions-${userId}-${month}.csv`, `\uFEFF${lines.join("\n")}`, "text/csv;charset=utf-8");
  showToast("本地 CSV 已生成");
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function currentUserId() {
  return (displayMode ? userIdInput.dataset.realValue : userIdInput.value)?.trim() || "demo-user";
}

function rowItem(left, right, pillClass) {
  const row = document.createElement("div");
  row.className = "row-item";
  const name = document.createElement("span");
  name.textContent = left;
  const value = document.createElement("span");
  value.className = pillClass;
  value.textContent = right;
  row.append(name, value);
  return row;
}

function currentMonthTransactions() {
  const month = monthInput.value;
  return state.transactions.filter((item) => item.paidAt?.startsWith(month));
}

function latestTransactionMonth(transactions) {
  return transactions
    .map((item) => String(item.paidAt ?? "").slice(0, 7))
    .filter((value) => /^\d{4}-\d{2}$/.test(value))
    .sort()
    .at(-1) ?? "";
}

function aggregateBy(rows, labelFor, valueFor) {
  const total = rows.reduce((sum, item) => sum + Math.abs(Number(valueFor(item)) || 0), 0);
  const map = new Map();
  for (const item of rows) {
    const label = labelFor(item) || "未标记";
    const value = Math.abs(Number(valueFor(item)) || 0);
    const current = map.get(label) ?? { label, value: 0, count: 0, percent: 0 };
    current.value += value;
    current.count += 1;
    map.set(label, current);
  }
  return [...map.values()]
    .map((item) => ({ ...item, percent: total > 0 ? item.value / total : 0 }))
    .sort((left, right) => right.value - left.value);
}

function donutChart(items, centerLabel, tone) {
  const wrap = document.createElement("div");
  wrap.className = "donut-wrap";
  const donut = document.createElement("div");
  donut.className = `donut-chart ${tone}`;
  donut.style.background = donutGradient(items);
  const center = document.createElement("div");
  center.className = "donut-center";
  const top = items[0];
  center.append(textSpan(centerLabel), textSpan(top ? `${Math.round(top.percent * 100)}%` : "0%", "donut-value"));
  donut.append(center);
  const legend = document.createElement("div");
  legend.className = "donut-legend";
  items.slice(0, 4).forEach((item, index) => {
    const row = document.createElement("span");
    row.style.setProperty("--legend-color", item.color ?? chartColors[index % chartColors.length]);
    row.textContent = `${item.label} ${Math.round(item.percent * 100)}%`;
    legend.append(row);
  });
  wrap.append(donut, legend);
  return wrap;
}

function donutGradient(items) {
  if (!items.length) {
    return "conic-gradient(rgba(255,255,255,0.12) 0 100%)";
  }
  let cursor = 0;
  const segments = items.map((item, index) => {
    const start = cursor;
    const end = cursor + Math.max(0.5, item.percent * 100);
    cursor = end;
    return `${item.color ?? chartColors[index % chartColors.length]} ${start}% ${end}%`;
  });
  if (cursor < 100) {
    segments.push(`rgba(255,255,255,0.08) ${cursor}% 100%`);
  }
  return `conic-gradient(${segments.join(", ")})`;
}

function progressItem(label, value, ratio, tone) {
  const item = document.createElement("div");
  item.className = "progress-item";
  const head = document.createElement("div");
  head.className = "progress-head";
  head.append(textSpan(label), textSpan(value));
  const track = document.createElement("div");
  track.className = "progress-track";
  const fill = document.createElement("div");
  fill.className = `progress-fill ${tone}`;
  fill.style.width = `${Math.max(3, Math.min(1, ratio) * 100)}%`;
  track.append(fill);
  item.append(head, track);
  return item;
}

function actionButton(label, onClick, variant = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = variant ? `mini-button ${variant}` : "mini-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function pill(text, className) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function textSpan(text, className = "") {
  const span = document.createElement("span");
  span.textContent = text;
  if (className) {
    span.className = className;
  }
  return span;
}

function strongText(text) {
  const element = document.createElement("strong");
  element.textContent = text;
  return element;
}

function amountText(transaction) {
  const element = strongText(`${transaction.direction === "expense" ? "-" : "+"}${money(transaction.amount)}`);
  element.className = transaction.direction === "expense" ? "amount-negative" : transaction.direction === "transfer" ? "amount-transfer" : "amount-positive";
  return element;
}

function emphasisText(text) {
  const element = document.createElement("em");
  element.textContent = text;
  return element;
}

function paragraphText(text) {
  const element = document.createElement("p");
  element.textContent = text;
  return element;
}

function textListItem(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}

function empty(text, description = "导入账单或完成一笔记账后，这里会自动更新") {
  const element = document.createElement("div");
  element.className = "empty";
  const icon = textSpan("◇", "empty-icon");
  const title = strongText(text);
  const copy = textSpan(description);
  element.append(icon, title, copy);
  return element;
}

function td(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  return cell;
}

function tdNode(node, className = "") {
  const cell = document.createElement("td");
  if (className) cell.className = className;
  cell.append(node);
  return cell;
}

function applyDisplayMode() {
  document.body.classList.toggle("display-mode", displayMode);
  displayModeBanner.hidden = !displayMode;
  demoModeToggleButton.setAttribute("aria-pressed", String(displayMode));
  demoModeToggleButton.textContent = displayMode ? "退出展示" : "展示模式";
  if (displayMode) {
    if (!userIdInput.dataset.realValue) userIdInput.dataset.realValue = userIdInput.value;
    userIdInput.value = "演示用户";
    userIdInput.readOnly = true;
    if (!agentAnswerBeforeDisplay) agentAnswerBeforeDisplay = agentAnswerEl.innerHTML;
    if (!mobileAnswerBeforeDisplay) mobileAnswerBeforeDisplay = mobileAgentAnswerEl.innerHTML;
    renderDisplayModeAgentPreview();
  } else {
    if (userIdInput.dataset.realValue) {
      userIdInput.value = userIdInput.dataset.realValue;
      delete userIdInput.dataset.realValue;
    }
    userIdInput.readOnly = false;
    if (agentAnswerBeforeDisplay) agentAnswerEl.innerHTML = agentAnswerBeforeDisplay;
    if (mobileAnswerBeforeDisplay) mobileAgentAnswerEl.innerHTML = mobileAnswerBeforeDisplay;
    agentAnswerBeforeDisplay = "";
    mobileAnswerBeforeDisplay = "";
  }
}

function displayName(value) {
  if (!displayMode) return value;
  const index = [...String(value ?? "")].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3;
  return `示例商户 ${["A", "B", "C"][index]}`;
}

function money(value) {
  if (displayMode) {
    return "¥••••";
  }
  return `¥${Number(value).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function renderDisplayModeAgentPreview() {
  const previewMonth = monthInput.value ? `${monthInput.value.replace("-", " 年 ")} 月` : "当前月份";
  agentAnswerEl.classList.remove("loading");
  agentAnswerEl.innerHTML = `
    <span>智能体回答 · 云端模型</span>
    <div class="agent-answer-body">
      <section><strong>结论</strong><p>本月餐饮支出偏高，主要集中在外卖和咖啡消费。</p></section>
      <section><strong>重点发现</strong><ul><li>餐饮支出较上月增加 18%</li><li>高频消费集中在 3 个平台</li><li>有 2 笔交易建议确认分类</li></ul></section>
      <section><strong>建议操作</strong><ul><li>查看餐饮明细</li><li>创建外卖分类规则</li><li>设置餐饮预算提醒</li></ul></section>
      <section><strong>数据来源</strong><p>${previewMonth}账本 · 98 笔交易</p></section>
      <section><strong>模型来源</strong><p>云端模型 · DeepSeek V4 Flash</p></section>
    </div>`;
  const actions = document.createElement("div");
  actions.className = "agent-actions";
  inferAgentActions("本月餐饮为什么这么高", "餐饮支出较高").forEach((action) => actions.append(actionButton(action.label, () => handleAgentAction(action.id))));
  agentAnswerEl.append(actions, renderAgentTaskFlow("本月餐饮为什么这么高", "餐饮支出较高，需要分析预算并生成节省建议"));
  mobileAgentAnswerEl.innerHTML = `<strong>结论</strong><p>本月餐饮支出偏高，建议优先检查外卖和咖啡消费。</p><strong>重点发现</strong><ul><li>较上月增加 18%</li><li>2 笔交易需要确认</li></ul><small>数据来源：${previewMonth}账本 · 98 笔交易</small>`;
}

function labelForCategory(categoryId) {
  return categoryOptions.find(([value]) => value === categoryId)?.[1] ?? categoryId;
}

function sourceLabel(transaction) {
  if (transaction.source === "manual") {
    return "手工记账";
  }
  if (transaction.source === "wechat") {
    return "微信账单";
  }
  if (transaction.source === "alipay") {
    return "支付宝账单";
  }
  return sourceName(transaction.source);
}

function sourceName(source) {
  const labels = {
    wechat: "微信",
    alipay: "支付宝",
    manual: "手工",
    csv: "导入"
  };
  return labels[source] ?? source ?? "未知";
}

function reasonFor(transaction) {
  if (transaction.status === "pending_review") {
    return "需要你确认后再学习";
  }
  if (transaction.categoryId?.includes("subscription")) {
    return "识别到周期性订阅扣费";
  }
  if (transaction.categoryId?.includes("food")) {
    return "商户符合餐饮消费模式";
  }
  if (transaction.categoryId?.includes("transport")) {
    return "商户符合交通出行分类";
  }
  if (transaction.categoryId?.includes("housing")) {
    return "大额周期性居住支出";
  }
  return "智能体匹配了商户和金额模式";
}

function fillCategorySelect(select, placeholder) {
  select.replaceChildren();
  for (const [value, label] of categoryOptions) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value ? label : placeholder;
    select.append(option);
  }
}

function directionLabel(direction) {
  const labels = {
    income: "\u6536\u5165",
    expense: "\u652f\u51fa",
    transfer: "\u8f6c\u8d26",
    refund: "\u9000\u6b3e",
    unknown: "\u672a\u77e5"
  };
  return labels[direction] ?? direction;
}

function statusLabel(status) {
  const labels = {
    pending_review: "\u5f85\u786e\u8ba4",
    confirmed: "\u5df2\u786e\u8ba4",
    ignored: "\u5ffd\u7565"
  };
  return labels[status] ?? status;
}


})().catch((error) => {
  console.error(error);
  const status = document.querySelector("#service-status");
  if (status) status.textContent = "Startup failed: " + error.message;
});
