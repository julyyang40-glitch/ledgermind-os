import type { BillSource } from "../../shared/src/types.js";

export function detectBillSource(filename: string, content: string): BillSource {
  const haystack = `${filename}\n${content.slice(0, 2000)}`.toLowerCase();

  if (haystack.includes("微信") || haystack.includes("wechat") || haystack.includes("交易单号")) {
    return "wechat";
  }

  if (haystack.includes("支付宝") || haystack.includes("alipay") || haystack.includes("交易号")) {
    return "alipay";
  }

  return "unknown";
}

