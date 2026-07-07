import type {
  ClassificationRule,
  Budget,
  BudgetStatus,
  ImportJob,
  ImportResult,
  LedgerInsights,
  MonthlyAnalytics,
  MonthlyReport,
  Transaction
} from "../../shared/src/types.js";
import { dirname } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createId } from "../../shared/src/id.js";
import { importBill } from "../../ledger/src/import-workflow.js";
import { generateMonthlyAnalytics } from "../../ledger/src/analytics.js";
import { calculateBudgetStatuses } from "../../ledger/src/budget.js";
import { detectLedgerInsights } from "../../ledger/src/insights.js";
import { generateMonthlyReport } from "../../ledger/src/report.js";

export type AgentToolContext = {
  userId: string;
  transactions: Transaction[];
};

type LedgerStoreState = {
  version: 1;
  transactions: Transaction[];
  importJobs: ImportJob[];
  classificationRules: ClassificationRule[];
  budgets: Budget[];
};

export class LedgerAgentOS {
  private transactions: Transaction[] = [];
  private importJobs: ImportJob[] = [];
  private classificationRules: ClassificationRule[] = [];
  private budgets: Budget[] = [];

  constructor(private readonly storagePath?: string) {
    this.load();
  }

  importBill(userId: string, filename: string, content: string): ImportResult {
    const result = importBill({
      userId,
      filename,
      content,
      existingTransactions: this.listTransactions(userId),
      classificationRules: this.classificationRules
    });
    this.importJobs.push(result.job);
    this.transactions.push(...result.transactions);
    this.save();
    return result;
  }

  listTransactions(userId: string): Transaction[] {
    return this.transactions.filter((transaction) => transaction.userId === userId);
  }

  listImportJobs(userId: string): ImportJob[] {
    return this.importJobs.filter((job) => job.userId === userId);
  }

  getImportJob(userId: string, importJobId: string): ImportJob | undefined {
    return this.importJobs.find((job) => job.userId === userId && job.id === importJobId);
  }

  updateTransactionCategory(userId: string, transactionId: string, categoryId: string): Transaction | undefined {
    const index = this.transactions.findIndex((transaction) =>
      transaction.userId === userId && transaction.id === transactionId
    );
    if (index < 0) {
      return undefined;
    }

    const current = this.transactions[index];
    const updated: Transaction = {
      ...current,
      categoryId,
      confidence: 1,
      status: "confirmed",
      updatedAt: new Date().toISOString()
    };
    this.transactions[index] = updated;
    this.learnClassificationRule(updated, categoryId);
    this.save();
    return updated;
  }

  createManualTransaction(input: {
    userId: string;
    direction: Transaction["direction"];
    amount: number;
    paidAt: string;
    merchantName?: string;
    productName?: string;
    categoryId?: string;
    paymentMethod?: string;
  }): Transaction {
    const now = new Date().toISOString();
    const transaction: Transaction = {
      id: createId("txn"),
      userId: input.userId,
      source: "manual",
      direction: input.direction,
      amount: input.amount,
      currency: "CNY",
      paidAt: input.paidAt,
      merchantName: input.merchantName,
      productName: input.productName,
      paymentMethod: input.paymentMethod,
      categoryId: input.categoryId,
      tags: [],
      rawDescription: [input.merchantName, input.productName].filter(Boolean).join(" | "),
      normalizedDescription: [input.merchantName, input.productName].filter(Boolean).join(" - "),
      confidence: 1,
      status: input.categoryId ? "confirmed" : "pending_review",
      createdAt: now,
      updatedAt: now
    };
    this.transactions.push(transaction);
    if (input.categoryId) {
      this.learnClassificationRule(transaction, input.categoryId);
    }
    this.save();
    return transaction;
  }

  updateTransactionStatus(
    userId: string,
    transactionId: string,
    status: Transaction["status"]
  ): Transaction | undefined {
    const index = this.transactions.findIndex((transaction) =>
      transaction.userId === userId && transaction.id === transactionId
    );
    if (index < 0) {
      return undefined;
    }

    const updated: Transaction = {
      ...this.transactions[index],
      status,
      updatedAt: new Date().toISOString()
    };
    this.transactions[index] = updated;
    this.save();
    return updated;
  }

  deleteTransaction(userId: string, transactionId: string): boolean {
    const before = this.transactions.length;
    this.transactions = this.transactions.filter((transaction) =>
      !(transaction.userId === userId && transaction.id === transactionId)
    );
    const deleted = this.transactions.length !== before;
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  updateTransactionCategories(userId: string, transactionIds: string[], categoryId: string): Transaction[] {
    const updated: Transaction[] = [];
    for (const transactionId of transactionIds) {
      const transaction = this.updateTransactionCategory(userId, transactionId, categoryId);
      if (transaction) {
        updated.push(transaction);
      }
    }
    this.save();
    return updated;
  }

  getInsights(userId: string): LedgerInsights {
    return detectLedgerInsights(this.listTransactions(userId));
  }

  generateMonthlyReport(userId: string, month: string): MonthlyReport {
    return generateMonthlyReport(userId, month, this.transactions);
  }

  generateMonthlyAnalytics(userId: string, month: string): MonthlyAnalytics {
    return generateMonthlyAnalytics(userId, month, this.transactions);
  }

  listClassificationRules(userId: string): ClassificationRule[] {
    return this.classificationRules.filter((rule) => rule.userId === userId);
  }

  createClassificationRule(input: {
    userId: string;
    pattern: string;
    categoryId: string;
    field?: ClassificationRule["field"];
  }): ClassificationRule {
    const now = new Date().toISOString();
    const existing = this.classificationRules.find((rule) =>
      rule.userId === input.userId &&
      rule.pattern.toLowerCase() === input.pattern.toLowerCase() &&
      rule.categoryId === input.categoryId
    );
    if (existing) {
      return existing;
    }

    const rule: ClassificationRule = {
      id: createId("rule"),
      userId: input.userId,
      categoryId: input.categoryId,
      matchType: "contains",
      field: input.field ?? "merchantName",
      pattern: input.pattern,
      priority: 120,
      createdAt: now,
      updatedAt: now
    };
    this.classificationRules.push(rule);
    this.save();
    return rule;
  }

  deleteClassificationRule(userId: string, ruleId: string): boolean {
    const before = this.classificationRules.length;
    this.classificationRules = this.classificationRules.filter((rule) =>
      !(rule.userId === userId && rule.id === ruleId)
    );
    const deleted = this.classificationRules.length !== before;
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  exportUserData(userId: string): LedgerStoreState {
    return {
      version: 1,
      transactions: this.listTransactions(userId),
      importJobs: this.listImportJobs(userId),
      classificationRules: this.listClassificationRules(userId),
      budgets: this.listBudgets(userId)
    };
  }

  clearUserData(userId: string): LedgerStoreState {
    const removed = this.exportUserData(userId);
    this.transactions = this.transactions.filter((transaction) => transaction.userId !== userId);
    this.importJobs = this.importJobs.filter((job) => job.userId !== userId);
    this.classificationRules = this.classificationRules.filter((rule) => rule.userId !== userId);
    this.budgets = this.budgets.filter((budget) => budget.userId !== userId);
    this.save();
    return removed;
  }

  upsertBudget(userId: string, month: string, categoryId: string, limitAmount: number): Budget {
    const now = new Date().toISOString();
    const index = this.budgets.findIndex((budget) =>
      budget.userId === userId && budget.month === month && budget.categoryId === categoryId
    );

    if (index >= 0) {
      const updated: Budget = {
        ...this.budgets[index],
        limitAmount,
        updatedAt: now
      };
      this.budgets[index] = updated;
      this.save();
      return updated;
    }

    const budget: Budget = {
      id: createId("budget"),
      userId,
      month,
      categoryId,
      limitAmount,
      createdAt: now,
      updatedAt: now
    };
    this.budgets.push(budget);
    this.save();
    return budget;
  }

  listBudgets(userId: string, month?: string): Budget[] {
    return this.budgets.filter((budget) =>
      budget.userId === userId && (!month || budget.month === month)
    );
  }

  getBudgetStatuses(userId: string, month: string): BudgetStatus[] {
    return calculateBudgetStatuses(userId, month, this.budgets, this.transactions);
  }

  private learnClassificationRule(transaction: Transaction, categoryId: string): void {
    const now = new Date().toISOString();
    const sourceText = transaction.merchantName ?? transaction.counterparty ?? transaction.productName;
    if (!sourceText) {
      return;
    }

    const exists = this.classificationRules.some((rule) =>
      rule.userId === transaction.userId &&
      rule.categoryId === categoryId &&
      rule.field === "merchantName" &&
      rule.pattern === sourceText
    );
    if (exists) {
      return;
    }

    this.classificationRules.push({
      id: createId("rule"),
      userId: transaction.userId,
      categoryId,
      matchType: "contains",
      field: transaction.merchantName ? "merchantName" : "counterparty",
      pattern: sourceText,
      priority: 100,
      createdAt: now,
      updatedAt: now
    });
  }

  private load(): void {
    if (!this.storagePath || !existsSync(this.storagePath)) {
      return;
    }

    const state = JSON.parse(readFileSync(this.storagePath, "utf8")) as Partial<LedgerStoreState>;
    this.transactions = Array.isArray(state.transactions) ? state.transactions : [];
    this.importJobs = Array.isArray(state.importJobs) ? state.importJobs : [];
    this.classificationRules = Array.isArray(state.classificationRules) ? state.classificationRules : [];
    this.budgets = Array.isArray(state.budgets) ? state.budgets : [];
  }

  private save(): void {
    if (!this.storagePath) {
      return;
    }

    mkdirSync(dirname(this.storagePath), { recursive: true });
    const state: LedgerStoreState = {
      version: 1,
      transactions: this.transactions,
      importJobs: this.importJobs,
      classificationRules: this.classificationRules,
      budgets: this.budgets
    };
    writeFileSync(this.storagePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  }
}
