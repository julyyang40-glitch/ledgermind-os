import type { Budget, BudgetStatus, Transaction } from "../../shared/src/types.js";

export function calculateBudgetStatuses(
  userId: string,
  month: string,
  budgets: Budget[],
  transactions: Transaction[]
): BudgetStatus[] {
  const scopedBudgets = budgets.filter((budget) => budget.userId === userId && budget.month === month);

  return scopedBudgets.map((budget) => {
    const spent = roundMoney(transactions
      .filter((transaction) =>
        transaction.userId === userId &&
        transaction.paidAt.startsWith(month) &&
        transaction.direction === "expense" &&
        transaction.categoryId === budget.categoryId
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0));
    const remaining = roundMoney(budget.limitAmount - spent);
    const usageRatio = budget.limitAmount > 0 ? roundMoney(spent / budget.limitAmount) : 0;

    return {
      budget,
      spent,
      remaining,
      usageRatio,
      status: usageRatio >= 1 ? "over" : usageRatio >= 0.8 ? "warning" : "ok"
    };
  });
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
