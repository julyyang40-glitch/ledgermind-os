import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { importBill } from "./import-workflow.js";

test("imports and classifies wechat transactions", () => {
  const content = readFileSync("samples/bills/wechat.csv", "utf8");
  const result = importBill({ userId: "u1", filename: "wechat.csv", content });

  assert.equal(result.job.status, "completed");
  assert.equal(result.job.importedRows, 3);
  assert.equal(result.transactions[0].categoryId, "food.coffee");
  assert.equal(result.transactions[1].categoryId, "food.restaurant");
  assert.equal(result.transactions[2].categoryId, "housing.rent");
});

test("deduplicates existing transactions", () => {
  const content = readFileSync("samples/bills/alipay.csv", "utf8");
  const first = importBill({ userId: "u1", filename: "alipay.csv", content });
  const second = importBill({
    userId: "u1",
    filename: "alipay.csv",
    content,
    existingTransactions: first.transactions
  });

  assert.equal(second.job.importedRows, 0);
  assert.equal(second.job.duplicateRows, 3);
});

