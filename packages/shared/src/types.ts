export type BillSource = "wechat" | "alipay" | "bank" | "cash" | "manual" | "invoice" | "unknown";

export type TransactionDirection = "income" | "expense" | "transfer" | "refund" | "unknown";

export type TransactionStatus = "pending_review" | "confirmed" | "ignored";

export type Transaction = {
  id: string;
  userId: string;
  source: Exclude<BillSource, "unknown">;
  sourceTransactionId?: string;
  importJobId?: string;
  accountId?: string;
  direction: TransactionDirection;
  amount: number;
  currency: string;
  paidAt: string;
  merchantName?: string;
  counterparty?: string;
  productName?: string;
  paymentMethod?: string;
  categoryId?: string;
  tags: string[];
  rawDescription?: string;
  normalizedDescription?: string;
  confidence: number;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
};

export type ClassificationRule = {
  id: string;
  userId: string;
  categoryId: string;
  matchType: "contains" | "equals";
  field: "merchantName" | "counterparty" | "productName" | "rawDescription";
  pattern: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type ImportJobStatus = "created" | "parsing" | "classified" | "completed" | "failed";

export type ImportJob = {
  id: string;
  userId: string;
  source: Extract<BillSource, "wechat" | "alipay" | "bank" | "unknown">;
  filename: string;
  status: ImportJobStatus;
  totalRows: number;
  importedRows: number;
  duplicateRows: number;
  reviewRows: number;
  errors: string[];
  createdAt: string;
  updatedAt: string;
};

export type ParsedBill = {
  source: Extract<BillSource, "wechat" | "alipay" | "unknown">;
  rows: ParsedBillRow[];
  errors: string[];
};

export type ParsedBillRow = {
  sourceTransactionId?: string;
  paidAt: string;
  direction: TransactionDirection;
  amount: number;
  currency: string;
  merchantName?: string;
  counterparty?: string;
  productName?: string;
  paymentMethod?: string;
  rawDescription?: string;
};

export type ImportResult = {
  job: ImportJob;
  transactions: Transaction[];
};

export type TransferCandidate = {
  expenseTransactionId: string;
  incomeTransactionId: string;
  amount: number;
  confidence: number;
  reason: string;
};

export type RefundCandidate = {
  originalTransactionId: string;
  refundTransactionId: string;
  amount: number;
  confidence: number;
  reason: string;
};

export type LedgerInsights = {
  transferCandidates: TransferCandidate[];
  refundCandidates: RefundCandidate[];
  recurringPaymentCandidates: RecurringPaymentCandidate[];
};

export type MonthlyCategorySummary = {
  categoryId: string;
  income: number;
  expense: number;
  count: number;
};

export type MonthlyReport = {
  userId: string;
  month: string;
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
  pendingReviewCount: number;
  categories: MonthlyCategorySummary[];
};

export type Budget = {
  id: string;
  userId: string;
  month: string;
  categoryId: string;
  limitAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type BudgetStatus = {
  budget: Budget;
  spent: number;
  remaining: number;
  usageRatio: number;
  status: "ok" | "warning" | "over";
};

export type RecurringPaymentCandidate = {
  merchantName: string;
  categoryId?: string;
  amount: number;
  intervalDays: number;
  occurrences: number;
  transactionIds: string[];
  confidence: number;
};

export type DailyExpensePoint = {
  date: string;
  expense: number;
};

export type MerchantSummary = {
  merchantName: string;
  expense: number;
  count: number;
};

export type CategoryShare = {
  categoryId: string;
  expense: number;
  percent: number;
};

export type MonthlyAnalytics = {
  userId: string;
  month: string;
  dailyExpenses: DailyExpensePoint[];
  topMerchants: MerchantSummary[];
  categoryShares: CategoryShare[];
};
