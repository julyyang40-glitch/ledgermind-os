import type { ParsedBill } from "../../shared/src/types.js";
import { parseCsv, rowsToObjects } from "./csv.js";
import { parseAmount, parseDirection } from "./money.js";

export function parseWechatBill(content: string): ParsedBill {
  const objects = rowsToObjects(parseCsv(content));
  const errors: string[] = [];
  const rows = objects.flatMap((record, index) => {
    try {
      const paidAt = pick(record, ["交易时间", "支付时间", "时间"]);
      const amount = pick(record, ["金额(元)", "金额", "交易金额"]);
      const direction = pick(record, ["收/支", "交易类型", "类型"]);

      if (!paidAt || !amount) {
        return [];
      }

      return [{
        sourceTransactionId: pick(record, ["交易单号", "商户单号"]),
        paidAt,
        direction: parseDirection(direction),
        amount: parseAmount(amount),
        currency: "CNY",
        merchantName: pick(record, ["交易对方", "商户", "收款方"]),
        counterparty: pick(record, ["交易对方", "对方"]),
        productName: pick(record, ["商品", "商品名称", "交易商品"]),
        paymentMethod: pick(record, ["支付方式", "当前状态"]),
        rawDescription: Object.values(record).filter(Boolean).join(" | ")
      }];
    } catch (error) {
      errors.push(`row ${index + 1}: ${(error as Error).message}`);
      return [];
    }
  });

  return { source: "wechat", rows, errors };
}

function pick(record: Record<string, string>, candidates: string[]): string {
  for (const key of candidates) {
    if (record[key]) {
      return record[key];
    }
  }
  return "";
}

