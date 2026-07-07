import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { LedgerAgentOS } from "./agent-os.js";

test("stores import jobs and generates monthly report", () => {
  const os = new LedgerAgentOS();
  const content = readFileSync("samples/bills/wechat.csv", "utf8");
  const result = os.importBill("u1", "wechat.csv", content);

  assert.equal(os.getImportJob("u1", result.job.id)?.id, result.job.id);

  const report = os.generateMonthlyReport("u1", "2026-05");
  assert.equal(report.transactionCount, 3);
  assert.equal(report.expense, 3554.5);
  assert.equal(report.pendingReviewCount, 0);
});

test("learns a user classification rule from category correction", () => {
  const os = new LedgerAgentOS();
  const content = [
    "微信支付账单",
    "交易时间,交易类型,交易对方,商品,收/支,金额(元),支付方式,当前状态,交易单号",
    "2026-05-01 08:30:00,商户消费,未知小店,晚餐,支出,42.00,零钱,支付成功,wx-custom-001"
  ].join("\n");
  const first = os.importBill("u1", "wechat.csv", content);
  const transaction = first.transactions[0];

  assert.equal(transaction.status, "pending_review");

  const updated = os.updateTransactionCategory("u1", transaction.id, "food.restaurant");
  assert.equal(updated?.status, "confirmed");
  assert.equal(os.listClassificationRules("u1").length, 1);

  const second = os.importBill("u1", "wechat.csv", content.replace("wx-custom-001", "wx-custom-002"));
  assert.equal(second.transactions[0].categoryId, "food.restaurant");
  assert.equal(second.transactions[0].status, "confirmed");
});

test("updates categories in batch and stores budgets", () => {
  const os = new LedgerAgentOS();
  const content = readFileSync("samples/bills/alipay.csv", "utf8");
  const result = os.importBill("u1", "alipay.csv", content);
  const transactionIds = result.transactions.slice(0, 2).map((transaction) => transaction.id);

  const updated = os.updateTransactionCategories("u1", transactionIds, "life.daily");
  const budget = os.upsertBudget("u1", "2026-05", "life.daily", 120);
  const [status] = os.getBudgetStatuses("u1", "2026-05");

  assert.equal(updated.length, 2);
  assert.equal(budget.limitAmount, 120);
  assert.equal(status.spent, 110.2);
});

test("creates manual transactions and manages status", () => {
  const os = new LedgerAgentOS();
  const transaction = os.createManualTransaction({
    userId: "u1",
    direction: "expense",
    amount: 28.5,
    paidAt: "2026-05-06 18:30:00",
    merchantName: "社区超市",
    productName: "水果",
    categoryId: "shopping.grocery"
  });

  const ignored = os.updateTransactionStatus("u1", transaction.id, "ignored");
  const deleted = os.deleteTransaction("u1", transaction.id);

  assert.equal(transaction.source, "manual");
  assert.equal(transaction.status, "confirmed");
  assert.equal(ignored?.status, "ignored");
  assert.equal(deleted, true);
  assert.equal(os.listTransactions("u1").length, 0);
});

test("deduplicates imports per user instead of globally", () => {
  const os = new LedgerAgentOS();
  const content = readFileSync("samples/bills/wechat.csv", "utf8");
  const first = os.importBill("u1", "wechat.csv", content);
  const second = os.importBill("u2", "wechat.csv", content);
  const repeat = os.importBill("u2", "wechat.csv", content);

  assert.equal(first.job.importedRows, 3);
  assert.equal(second.job.importedRows, 3);
  assert.equal(repeat.job.importedRows, 0);
  assert.equal(repeat.job.duplicateRows, 3);
});

test("exports user data and deletes learned rules", () => {
  const os = new LedgerAgentOS();
  const transaction = os.createManualTransaction({
    userId: "u1",
    direction: "expense",
    amount: 12,
    paidAt: "2026-05-06 12:00:00",
    merchantName: "咖啡店",
    categoryId: "food.coffee"
  });
  const [rule] = os.listClassificationRules("u1");
  const backup = os.exportUserData("u1");
  const deleted = os.deleteClassificationRule("u1", rule.id);

  assert.equal(transaction.source, "manual");
  assert.equal(backup.transactions.length, 1);
  assert.equal(backup.classificationRules.length, 1);
  assert.equal(deleted, true);
  assert.equal(os.listClassificationRules("u1").length, 0);
});

test("creates explicit automation classification rules", () => {
  const os = new LedgerAgentOS();
  const first = os.createClassificationRule({
    userId: "u1",
    pattern: "Uber",
    categoryId: "transport.taxi"
  });
  const second = os.createClassificationRule({
    userId: "u1",
    pattern: "Uber",
    categoryId: "transport.taxi"
  });

  assert.equal(first.id, second.id);
  assert.equal(os.listClassificationRules("u1").length, 1);
  assert.equal(os.listClassificationRules("u1")[0].pattern, "Uber");
});

test("clears one user's data without touching another user", () => {
  const os = new LedgerAgentOS();
  os.createManualTransaction({
    userId: "u1",
    direction: "expense",
    amount: 12,
    paidAt: "2026-05-06 12:00:00",
    merchantName: "咖啡店",
    categoryId: "food.coffee"
  });
  os.createManualTransaction({
    userId: "u2",
    direction: "expense",
    amount: 18,
    paidAt: "2026-05-06 12:00:00",
    merchantName: "茶饮店",
    categoryId: "food.coffee"
  });

  const removed = os.clearUserData("u1");

  assert.equal(removed.transactions.length, 1);
  assert.equal(os.listTransactions("u1").length, 0);
  assert.equal(os.listTransactions("u2").length, 1);
});
