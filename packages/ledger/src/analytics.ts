import type { CategoryShare, DailyExpensePoint, MerchantSummary, MonthlyAnalytics, Transaction } from "../../shared/src/types.js";

export function generateMonthlyAnalytics(userId: string, month: string, transactions: Transaction[]): MonthlyAnalytics {
  const scoped = transactions.filter((transaction) =>
    transaction.userId === userId &&
    transaction.paidAt.startsWith(month) &&
    transaction.direction === "expense"
  );

  return {
    userId,
    month,
    dailyExpenses: dailyExpenses(month, scoped),
    topMerchants: topMerchants(scoped),
    categoryShares: categoryShares(scoped)
  };
}

function dailyExpenses(month: string, transactions: Transaction[]): DailyExpensePoint[] {
  const days = daysInMonth(month);
  const totals = new Map<string, number>();
  for (const transaction of transactions) {
    const date = transaction.paidAt.slice(0, 10);
    totals.set(date, (totals.get(date) ?? 0) + transaction.amount);
  }

  return Array.from({ length: days }, (_, index) => {
    const date = `${month}-${String(index + 1).padStart(2, "0")}`;
    return {
      date,
      expense: roundMoney(totals.get(date) ?? 0)
    };
  });
}

function topMerchants(transactions: Transaction[]): MerchantSummary[] {
  const totals = new Map<string, { expense: number; count: number }>();
  for (const transaction of transactions) {
    const merchantName = transaction.merchantName ?? transaction.counterparty ?? "unknown";
    const current = totals.get(merchantName) ?? { expense: 0, count: 0 };
    current.expense += transaction.amount;
    current.count += 1;
    totals.set(merchantName, current);
  }

  return [...totals.entries()]
    .map(([merchantName, value]) => ({
      merchantName,
      expense: roundMoney(value.expense),
      count: value.count
    }))
    .sort((left, right) => right.expense - left.expense)
    .slice(0, 8);
}

function categoryShares(transactions: Transaction[]): CategoryShare[] {
  const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const categories = new Map<string, number>();
  for (const transaction of transactions) {
    const categoryId = transaction.categoryId ?? "uncategorized";
    categories.set(categoryId, (categories.get(categoryId) ?? 0) + transaction.amount);
  }

  return [...categories.entries()]
    .map(([categoryId, expense]) => ({
      categoryId,
      expense: roundMoney(expense),
      percent: total > 0 ? roundMoney(expense / total) : 0
    }))
    .sort((left, right) => right.expense - left.expense);
}

function daysInMonth(month: string): number {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(year, monthIndex, 0).getDate();
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
