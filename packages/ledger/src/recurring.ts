import type { RecurringPaymentCandidate, Transaction } from "../../shared/src/types.js";

export function detectRecurringPayments(transactions: Transaction[]): RecurringPaymentCandidate[] {
  const expenses = transactions
    .filter((transaction) => transaction.direction === "expense")
    .filter((transaction) => merchantKey(transaction).length > 0)
    .sort((left, right) => left.paidAt.localeCompare(right.paidAt));
  const groups = new Map<string, Transaction[]>();

  for (const transaction of expenses) {
    const key = `${merchantKey(transaction)}|${transaction.categoryId ?? ""}|${transaction.amount.toFixed(2)}`;
    groups.set(key, [...(groups.get(key) ?? []), transaction]);
  }

  const candidates: RecurringPaymentCandidate[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }

    const intervals = pairIntervals(group);
    const averageInterval = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
    const isRecurring = intervals.every((interval) => Math.abs(interval - averageInterval) <= 5) &&
      averageInterval >= 25 &&
      averageInterval <= 40;

    if (!isRecurring) {
      continue;
    }

    candidates.push({
      merchantName: merchantKey(group[0]),
      categoryId: group[0].categoryId,
      amount: group[0].amount,
      intervalDays: Math.round(averageInterval),
      occurrences: group.length,
      transactionIds: group.map((transaction) => transaction.id),
      confidence: group.length >= 3 ? 0.88 : 0.72
    });
  }

  return candidates.sort((left, right) => right.confidence - left.confidence);
}

function pairIntervals(transactions: Transaction[]): number[] {
  const intervals: number[] = [];
  for (let index = 1; index < transactions.length; index += 1) {
    const previous = Date.parse(transactions[index - 1].paidAt.replace(" ", "T"));
    const current = Date.parse(transactions[index].paidAt.replace(" ", "T"));
    if (Number.isFinite(previous) && Number.isFinite(current)) {
      intervals.push(Math.abs(current - previous) / 86400000);
    }
  }
  return intervals;
}

function merchantKey(transaction: Transaction): string {
  return (transaction.merchantName ?? transaction.counterparty ?? "").trim();
}
