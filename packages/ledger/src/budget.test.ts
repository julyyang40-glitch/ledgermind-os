import assert from "node:assert/strict";
import test from "node:test";
import type { Budget, Transaction } from "../../shared/src/types.js";
import { calculateBudgetStatuses } from "./budget.js";

test("calculates monthly budget status", () => {
  const budgets: Budget[] = [{
    id: "budget-1",
    userId: "u1",
    month: "2026-05",
    categoryId: "food.restaurant",
    limitAmount: 100,
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  }];
  const transactions: Transaction[] = [
    makeTransaction("t1", "food.restaurant", 60),
    makeTransaction("t2", "food.restaurant", 45),
    makeTransaction("t3", "transport.taxi", 20)
  ];

  const [status] = calculateBudgetStatuses("u1", "2026-05", budgets, transactions);

  assert.equal(status.spent, 105);
  assert.equal(status.remaining, -5);
  assert.equal(status.status, "over");
});

function makeTransaction(id: string, categoryId: string, amount: number): Transaction {
  return {
    id,
    userId: "u1",
    source: "wechat",
    direction: "expense",
    amount,
    currency: "CNY",
    paidAt: "2026-05-10 12:00:00",
    categoryId,
    tags: [],
    confidence: 1,
    status: "confirmed",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  };
}
