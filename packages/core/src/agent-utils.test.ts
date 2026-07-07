import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

type Utils = {
  draftNamespace(userId: string, options: { displayMode?: boolean; demoUserId?: string }): string;
  isDraftExpired(action: { createdAt: string; expiresAt?: string }, now?: number): boolean;
  sanitizeAuditText(value: string): string;
  appendAuditLog(logs: unknown[], entry: Record<string, string>, now?: number): unknown[];
  calculateDataQuality(input: Record<string, number | boolean>): ({ score: number } & Record<string, unknown>) | null;
  qualityRepairCodes(quality: Record<string, number | boolean> | null): string[];
  buildMarkdown(lines: string[]): string;
  ruleMatches(rule: Record<string, string>, transaction: Record<string, string>): boolean;
};

const context: { LedgerMindAgentUtils?: Utils; globalThis?: unknown } = {};
context.globalThis = context;
runInNewContext(readFileSync("apps/web/public/agent-utils.js", "utf8"), context);
const utils = context.LedgerMindAgentUtils as Utils;

test("isolates real, demo and display draft namespaces", () => {
  assert.equal(utils.draftNamespace("alice", { demoUserId: "demo" }), "user-alice");
  assert.equal(utils.draftNamespace("demo", { demoUserId: "demo" }), "demo-ledger");
  assert.equal(utils.draftNamespace("alice", { displayMode: true, demoUserId: "demo" }), "display-mode");
});

test("marks drafts expired after 24 hours and blocks early expiry", () => {
  const createdAt = "2026-07-01T00:00:00.000Z";
  assert.equal(utils.isDraftExpired({ createdAt }, Date.parse(createdAt) + 24 * 60 * 60 * 1000 - 1), false);
  assert.equal(utils.isDraftExpired({ createdAt }, Date.parse(createdAt) + 24 * 60 * 60 * 1000 + 1), true);
});

test("redacts SiliconFlow-style API keys from audit text", () => {
  const output = utils.sanitizeAuditText("request sk-exampleSecret123 failed");
  assert.equal(output.includes("sk-exampleSecret123"), false);
  assert.equal(output.includes("[已隐藏 Key]"), true);
});

test("caps audit logs at 100 entries", () => {
  const logs = Array.from({ length: 100 }, (_, index) => ({ id: String(index) }));
  assert.equal(utils.appendAuditLog(logs, { title: "new" }).length, 100);
});

test("does not fabricate data quality without transactions", () => {
  assert.equal(utils.calculateDataQuality({ rows: 0 }), null);
});

test("generates repair codes from quality factors", () => {
  const quality = { rows: 100, pending: 12, unclassified: 8, duplicates: 2, missingMerchant: 4, budgetCoverage: 0.2, ruleCoverage: 0.1, recentImport: false, anomalies: 4 };
  assert.deepEqual([...utils.qualityRepairCodes(quality)], ["pending", "unclassified", "duplicates", "merchant", "budget", "rules", "import", "anomalies"]);
});

test("builds Chinese Markdown with a final newline", () => {
  assert.equal(utils.buildMarkdown(["# 2026 年 7 月账本月报", "", "- 支出：¥100.00"]), "# 2026 年 7 月账本月报\n\n- 支出：¥100.00\n");
});

test("matches rule fields without changing transaction data", () => {
  const transaction = { merchantName: "美团外卖" };
  assert.equal(utils.ruleMatches({ field: "merchantName", pattern: "美团", matchType: "contains" }, transaction), true);
  assert.deepEqual(transaction, { merchantName: "美团外卖" });
});
