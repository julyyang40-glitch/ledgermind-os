import type { LedgerInsights, RefundCandidate, Transaction, TransferCandidate } from "../../shared/src/types.js";
import { detectRecurringPayments } from "./recurring.js";

export function detectLedgerInsights(transactions: Transaction[]): LedgerInsights {
  return {
    transferCandidates: detectTransferCandidates(transactions),
    refundCandidates: detectRefundCandidates(transactions),
    recurringPaymentCandidates: detectRecurringPayments(transactions)
  };
}

export function detectTransferCandidates(transactions: Transaction[]): TransferCandidate[] {
  const expenses = transactions.filter((transaction) =>
    transaction.direction === "expense" || transaction.direction === "transfer"
  );
  const incomes = transactions.filter((transaction) => transaction.direction === "income" || transaction.direction === "transfer");
  const candidates: TransferCandidate[] = [];

  for (const expense of expenses) {
    for (const income of incomes) {
      if (expense.id === income.id || expense.userId !== income.userId) {
        continue;
      }

      if (!sameAmount(expense, income) || minutesBetween(expense.paidAt, income.paidAt) > 1440) {
        continue;
      }

      const text = joinedText(expense, income);
      const hasTransferSignal = ["转账", "充值", "提现", "余额", "还款", "转入", "转出"].some((keyword) =>
        text.includes(keyword)
      );
      if (!hasTransferSignal && expense.direction !== "transfer" && income.direction !== "transfer") {
        continue;
      }

      const confidence = hasTransferSignal ? 0.82 : 0.68;
      candidates.push({
        expenseTransactionId: expense.id,
        incomeTransactionId: income.id,
        amount: expense.amount,
        confidence,
        reason: "金额相同且时间接近，可能是账户间转账"
      });
    }
  }

  return candidates;
}

export function detectRefundCandidates(transactions: Transaction[]): RefundCandidate[] {
  const purchases = transactions.filter((transaction) => transaction.direction === "expense");
  const refunds = transactions.filter((transaction) => transaction.direction === "refund" || hasRefundText(transaction));
  const candidates: RefundCandidate[] = [];

  for (const refund of refunds) {
    for (const purchase of purchases) {
      if (refund.id === purchase.id || refund.userId !== purchase.userId) {
        continue;
      }

      if (refund.amount > purchase.amount || minutesBetween(purchase.paidAt, refund.paidAt) > 60 * 24 * 60) {
        continue;
      }

      const sameMerchant = normalizeText(refund.merchantName ?? refund.counterparty ?? "") ===
        normalizeText(purchase.merchantName ?? purchase.counterparty ?? "");
      if (!sameMerchant) {
        continue;
      }

      candidates.push({
        originalTransactionId: purchase.id,
        refundTransactionId: refund.id,
        amount: refund.amount,
        confidence: 0.9,
        reason: "商户相同且退款金额不超过原交易"
      });
    }
  }

  return candidates;
}

function sameAmount(left: Transaction, right: Transaction): boolean {
  return Math.abs(left.amount - right.amount) < 0.005;
}

function minutesBetween(left: string, right: string): number {
  const leftTime = Date.parse(left.replace(" ", "T"));
  const rightTime = Date.parse(right.replace(" ", "T"));
  if (!Number.isFinite(leftTime) || !Number.isFinite(rightTime)) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.abs(leftTime - rightTime) / 60000;
}

function joinedText(...transactions: Transaction[]): string {
  return transactions.map((transaction) => [
    transaction.merchantName,
    transaction.counterparty,
    transaction.productName,
    transaction.rawDescription
  ].filter(Boolean).join(" ")).join(" ");
}

function hasRefundText(transaction: Transaction): boolean {
  return joinedText(transaction).includes("退款");
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
}
