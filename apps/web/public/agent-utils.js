(function initAgentUtils(scope) {
  const DAY_MS = 24 * 60 * 60 * 1000;

  function draftNamespace(userId, options = {}) {
    if (options.displayMode) return "display-mode";
    if (userId === options.demoUserId) return "demo-ledger";
    return `user-${String(userId || "default")}`;
  }

  function isDraftExpired(action, now = Date.now()) {
    const createdAt = new Date(action?.createdAt ?? 0).getTime();
    const expiresAt = new Date(action?.expiresAt ?? createdAt + DAY_MS).getTime();
    return Number.isFinite(expiresAt) && now > expiresAt;
  }

  function sanitizeAuditText(value) {
    return String(value ?? "").replace(/sk-[a-z0-9_-]{6,}/gi, "[已隐藏 Key]");
  }

  function appendAuditLog(logs, entry, now = Date.now()) {
    const safe = {
      id: `audit-${now}`,
      time: new Date(now).toISOString(),
      type: sanitizeAuditText(entry.type ?? "操作"),
      title: sanitizeAuditText(entry.title ?? "未命名操作"),
      source: sanitizeAuditText(entry.source ?? "系统"),
      impact: sanitizeAuditText(entry.impact ?? "未记录"),
      result: sanitizeAuditText(entry.result ?? "已建议"),
      detail: sanitizeAuditText(entry.detail ?? "")
    };
    return [safe, ...(Array.isArray(logs) ? logs : [])].slice(0, 100);
  }

  function calculateDataQuality(input) {
    const rows = Number(input?.rows ?? 0);
    if (rows <= 0) return null;
    const ratio = (value) => Math.min(1, Math.max(0, Number(value ?? 0) / rows));
    const score = Math.max(0, Math.min(100, Math.round(
      (1 - ratio(input.pending)) * 25
      + (1 - ratio(input.unclassified)) * 20
      + (1 - ratio(input.duplicates)) * 15
      + (1 - ratio(input.missingMerchant)) * 10
      + Math.min(1, Math.max(0, Number(input.budgetCoverage ?? 0))) * 10
      + Math.min(1, Math.max(0, Number(input.ruleCoverage ?? 0))) * 10
      + (input.recentImport ? 5 : 0)
      + (Number(input.anomalies ?? 0) === 0 ? 5 : Math.max(0, 5 - Number(input.anomalies ?? 0)))
    )));
    return { ...input, rows, score };
  }

  function qualityRepairCodes(quality) {
    if (!quality) return [];
    const codes = [];
    if (quality.pending / quality.rows > 0.08) codes.push("pending");
    if (quality.unclassified / quality.rows > 0.05) codes.push("unclassified");
    if (quality.duplicates > 0) codes.push("duplicates");
    if (quality.missingMerchant / quality.rows > 0.03) codes.push("merchant");
    if (quality.budgetCoverage < 0.5) codes.push("budget");
    if (quality.ruleCoverage < 0.25) codes.push("rules");
    if (!quality.recentImport) codes.push("import");
    if (quality.anomalies > 2) codes.push("anomalies");
    return codes;
  }

  function buildMarkdown(lines) {
    return [...lines, ""].join("\n");
  }

  function ruleMatches(rule, transaction) {
    const value = String(transaction?.[rule?.field] ?? "").toLowerCase();
    const pattern = String(rule?.pattern ?? "").toLowerCase();
    return rule?.matchType === "equals" ? value === pattern : Boolean(pattern) && value.includes(pattern);
  }

  scope.LedgerMindAgentUtils = { DAY_MS, draftNamespace, isDraftExpired, sanitizeAuditText, appendAuditLog, calculateDataQuality, qualityRepairCodes, buildMarkdown, ruleMatches };
})(globalThis);
