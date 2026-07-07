import type { ClassificationRule, ImportResult, Transaction } from "../../shared/src/types.js";
import { createId } from "../../shared/src/id.js";
import { parseBill } from "../../parsers/src/index.js";
import { classifyTransaction } from "./classifier.js";
import { parsedRowFingerprint, transactionFingerprint } from "./fingerprint.js";

export type ImportBillInput = {
  userId: string;
  filename: string;
  content: string;
  existingTransactions?: Transaction[];
  classificationRules?: ClassificationRule[];
};

export function importBill(input: ImportBillInput): ImportResult {
  const now = new Date().toISOString();
  const parsed = parseBill(input.filename, input.content);
  const importJobId = createId("import");
  if (parsed.source === "unknown") {
    return {
      job: {
        id: importJobId,
        userId: input.userId,
        source: "unknown",
        filename: input.filename,
        status: "failed",
        totalRows: 0,
        importedRows: 0,
        duplicateRows: 0,
        reviewRows: 0,
        errors: parsed.errors,
        createdAt: now,
        updatedAt: now
      },
      transactions: []
    };
  }

  const existingFingerprints = new Set(
    (input.existingTransactions ?? []).map((transaction) => transactionFingerprint(transaction))
  );
  const seenFingerprints = new Set<string>();
  const transactions: Transaction[] = [];
  let duplicateRows = 0;

  for (const row of parsed.rows) {
    const fingerprint = parsedRowFingerprint(parsed.source, row);
    if (existingFingerprints.has(fingerprint) || seenFingerprints.has(fingerprint)) {
      duplicateRows += 1;
      continue;
    }

    seenFingerprints.add(fingerprint);

    const base: Transaction = {
      id: createId("txn"),
      userId: input.userId,
      source: parsed.source,
      sourceTransactionId: row.sourceTransactionId,
      importJobId,
      direction: row.direction,
      amount: row.amount,
      currency: row.currency,
      paidAt: row.paidAt,
      merchantName: row.merchantName,
      counterparty: row.counterparty,
      productName: row.productName,
      paymentMethod: row.paymentMethod,
      tags: [],
      rawDescription: row.rawDescription,
      normalizedDescription: [row.merchantName, row.productName].filter(Boolean).join(" - "),
      confidence: 0.5,
      status: "pending_review",
      createdAt: now,
      updatedAt: now
    };

    transactions.push(classifyTransaction(base, input.classificationRules));
  }

  const reviewRows = transactions.filter((transaction) => transaction.status === "pending_review").length;

  return {
    job: {
      id: importJobId,
      userId: input.userId,
      source: parsed.source,
      filename: input.filename,
      status: parsed.errors.length > 0 ? "failed" : "completed",
      totalRows: parsed.rows.length,
      importedRows: transactions.length,
      duplicateRows,
      reviewRows,
      errors: parsed.errors,
      createdAt: now,
      updatedAt: now
    },
    transactions
  };
}
