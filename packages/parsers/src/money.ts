import type { TransactionDirection } from "../../shared/src/types.js";

export function parseAmount(value: string): number {
  const normalized = value.replace(/[^\d.-]/g, "");
  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid amount: ${value}`);
  }
  return Math.abs(amount);
}

export function parseDirection(value: string): TransactionDirection {
  const normalized = value.trim();
  if (["支出", "付款", "消费", "expense"].some((token) => normalized.includes(token))) {
    return "expense";
  }
  if (["收入", "收款", "income"].some((token) => normalized.includes(token))) {
    return "income";
  }
  if (["转账", "转入", "转出", "transfer"].some((token) => normalized.includes(token))) {
    return "transfer";
  }
  if (["退款", "退回", "refund"].some((token) => normalized.includes(token))) {
    return "refund";
  }
  return "unknown";
}

