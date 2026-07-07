import assert from "node:assert/strict";
import test from "node:test";
import type { Transaction } from "../../shared/src/types.js";
import { detectLedgerInsights } from "./insights.js";

test("detects refund and transfer candidates", () => {
  const transactions: Transaction[] = [
    makeTransaction("expense-1", "expense", 18, "2026-05-01 08:30:00", "瑞幸咖啡", "冰拿铁"),
    makeTransaction("refund-1", "refund", 18, "2026-05-02 09:00:00", "瑞幸咖啡", "订单退款"),
    makeTransaction("expense-2", "expense", 1000, "2026-05-03 10:00:00", "招商银行", "提现到支付宝"),
    makeTransaction("income-1", "income", 1000, "2026-05-03 10:05:00", "支付宝", "余额转入")
  ];

  const insights = detectLedgerInsights(transactions);

  assert.equal(insights.refundCandidates.length, 1);
  assert.equal(insights.refundCandidates[0].originalTransactionId, "expense-1");
  assert.equal(insights.transferCandidates.length, 1);
  assert.equal(insights.transferCandidates[0].expenseTransactionId, "expense-2");
});

function makeTransaction(
  id: string,
  direction: Transaction["direction"],
  amount: number,
  paidAt: string,
  merchantName: string,
  productName: string
): Transaction {
  return {
    id,
    userId: "u1",
    source: "wechat",
    direction,
    amount,
    currency: "CNY",
    paidAt,
    merchantName,
    productName,
    tags: [],
    confidence: 1,
    status: "confirmed",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  };
}

