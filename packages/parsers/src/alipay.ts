import type { ParsedBill } from "../../shared/src/types.js";
import { parseCsv, rowsToObjects } from "./csv.js";
import { parseAmount, parseDirection } from "./money.js";

export function parseAlipayBill(content: string): ParsedBill {
  const objects = rowsToObjects(parseCsv(content));
  const errors: string[] = [];
  const rows = objects.flatMap((record, index) => {
    try {
      const paidAt = pick(record, ["交易创建时间", "付款时间", "时间"]);
      const amount = pick(record, ["金额", "金额（元）", "交易金额"]);
      const direction = pick(record, ["收/支", "交易分类", "类型"]);

      if (!paidAt || !amount) {
        return [];
      }

      return [{
        sourceTransactionId: pick(record, ["交易号", "商家订单号"]),
        paidAt,
        direction: parseDirection(direction),
        amount: parseAmount(amount),
        currency: "CNY",
        merchantName: pick(record, ["交易对方", "商家名称", "对方"]),
        counterparty: pick(record, ["交易对方", "对方"]),
        productName: pick(record, ["商品说明", "商品名称", "备注"]),
        paymentMethod: pick(record, ["支付方式", "交易状态"]),
        rawDescription: Object.values(record).filter(Boolean).join(" | ")
      }];
    } catch (error) {
      errors.push(`row ${index + 1}: ${(error as Error).message}`);
      return [];
    }
  });

  return { source: "alipay", rows, errors };
}

function pick(record: Record<string, string>, candidates: string[]): string {
  for (const key of candidates) {
    if (record[key]) {
      return record[key];
    }
  }
  return "";
}

