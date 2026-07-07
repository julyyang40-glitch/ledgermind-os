import assert from "node:assert/strict";
import test from "node:test";
import type { Transaction } from "../../shared/src/types.js";
import { generateMonthlyAnalytics } from "./analytics.js";

test("generates daily, merchant and category analytics", () => {
  const analytics = generateMonthlyAnalytics("u1", "2026-05", [
    makeTransaction("t1", "2026-05-01 10:00:00", "商户A", "food.restaurant", 20),
    makeTransaction("t2", "2026-05-01 12:00:00", "商户A", "food.restaurant", 30),
    makeTransaction("t3", "2026-05-02 09:00:00", "商户B", "transport.taxi", 10)
  ]);

  assert.equal(analytics.dailyExpenses[0].expense, 50);
  assert.equal(analytics.topMerchants[0].merchantName, "商户A");
  assert.equal(analytics.categoryShares[0].categoryId, "food.restaurant");
  assert.equal(analytics.categoryShares[0].percent, 0.83);
});

function makeTransaction(id: string, paidAt: string, merchantName: string, categoryId: string, amount: number): Transaction {
  return {
    id,
    userId: "u1",
    source: "manual",
    direction: "expense",
    amount,
    currency: "CNY",
    paidAt,
    merchantName,
    categoryId,
    tags: [],
    confidence: 1,
    status: "confirmed",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  };
}
