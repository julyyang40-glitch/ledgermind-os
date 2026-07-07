import type { MonthlyReport, Transaction } from "../../shared/src/types.js";

export function generateMonthlyReport(userId: string, month: string, transactions: Transaction[]): MonthlyReport {
  const scoped = transactions.filter((transaction) =>
    transaction.userId === userId && transaction.paidAt.startsWith(month)
  );
  const categories = new Map<string, { income: number; expense: number; count: number }>();
  let income = 0;
  let expense = 0;

  for (const transaction of scoped) {
    const categoryId = transaction.categoryId ?? "uncategorized";
    const current = categories.get(categoryId) ?? { income: 0, expense: 0, count: 0 };
    current.count += 1;

    if (transaction.direction === "income" || transaction.direction === "refund") {
      income += transaction.amount;
      current.income += transaction.amount;
    } else if (transaction.direction === "expense") {
      expense += transaction.amount;
      current.expense += transaction.amount;
    }

    categories.set(categoryId, current);
  }

  return {
    userId,
    month,
    income: roundMoney(income),
    expense: roundMoney(expense),
    net: roundMoney(income - expense),
    transactionCount: scoped.length,
    pendingReviewCount: scoped.filter((transaction) => transaction.status === "pending_review").length,
    categories: [...categories.entries()]
      .map(([categoryId, value]) => ({
        categoryId,
        income: roundMoney(value.income),
        expense: roundMoney(value.expense),
        count: value.count
      }))
      .sort((left, right) => right.expense - left.expense)
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
