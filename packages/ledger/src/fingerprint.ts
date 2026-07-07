import type { Transaction, ParsedBillRow } from "../../shared/src/types.js";
import { stableHash } from "../../shared/src/id.js";

export function transactionFingerprint(transaction: Transaction): string {
  return stableHash([
    transaction.source,
    transaction.sourceTransactionId ?? "",
    transaction.amount.toFixed(2),
    transaction.direction,
    normalizeDateMinute(transaction.paidAt),
    normalizeText(transaction.merchantName ?? transaction.counterparty ?? ""),
    normalizeText(transaction.productName ?? "")
  ].join("|"));
}

export function parsedRowFingerprint(source: string, row: ParsedBillRow): string {
  return stableHash([
    source,
    row.sourceTransactionId ?? "",
    row.amount.toFixed(2),
    row.direction,
    normalizeDateMinute(row.paidAt),
    normalizeText(row.merchantName ?? row.counterparty ?? ""),
    normalizeText(row.productName ?? "")
  ].join("|"));
}

function normalizeDateMinute(value: string): string {
  return value.trim().replace(/:\d{2}$/, "");
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
}

