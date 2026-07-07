import type { ParsedBill } from "../../shared/src/types.js";
import { parseAlipayBill } from "./alipay.js";
import { detectBillSource } from "./detect.js";
import { parseWechatBill } from "./wechat.js";

export function parseBill(filename: string, content: string): ParsedBill {
  const source = detectBillSource(filename, content);

  if (source === "wechat") {
    return parseWechatBill(content);
  }

  if (source === "alipay") {
    return parseAlipayBill(content);
  }

  return {
    source: "unknown",
    rows: [],
    errors: [`Unsupported bill source for file: ${filename}`]
  };
}

export { detectBillSource } from "./detect.js";
export { parseWechatBill } from "./wechat.js";
export { parseAlipayBill } from "./alipay.js";
