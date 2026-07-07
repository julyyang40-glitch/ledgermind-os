import assert from "node:assert/strict";
import test from "node:test";
import type { Transaction } from "../../shared/src/types.js";
import { detectRecurringPayments } from "./recurring.js";

test("detects monthly recurring payments", () => {
  const transactions = [
    makeTransaction("t1", "2026-03-01 10:00:00"),
    makeTransaction("t2", "2026-04-01 10:00:00"),
    makeTransaction("t3", "2026-05-01 10:00:00")
  ];

  const [candidate] = detectRecurringPayments(transactions);

  assert.equal(candidate.merchantName, "腾讯视频");
  assert.equal(candidate.occurrences, 3);
  assert.equal(candidate.amount, 19.9);
});

function makeTransaction(id: string, paidAt: string): Transaction {
  return {
    id,
    userId: "u1",
    source: "alipay",
    direction: "expense",
    amount: 19.9,
    currency: "CNY",
    paidAt,
    merchantName: "腾讯视频",
    categoryId: "subscription.video",
    tags: [],
    confidence: 1,
    status: "confirmed",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  };
}
