import type { ClassificationRule, Transaction } from "../../shared/src/types.js";

const merchantRules: Array<{ categoryId: string; keywords: string[] }> = [
  { categoryId: "food.coffee", keywords: ["瑞幸", "星巴克", "咖啡"] },
  { categoryId: "food.restaurant", keywords: ["美团", "饿了么", "餐饮", "饭店", "肯德基", "麦当劳"] },
  { categoryId: "transport.taxi", keywords: ["滴滴", "高德打车", "出租车"] },
  { categoryId: "shopping.grocery", keywords: ["盒马", "山姆", "超市", "便利店"] },
  { categoryId: "subscription.video", keywords: ["腾讯视频", "爱奇艺", "优酷", "哔哩哔哩"] },
  { categoryId: "housing.rent", keywords: ["房租", "租金"] }
];

export function classifyTransaction(transaction: Transaction, userRules: ClassificationRule[] = []): Transaction {
  const userRule = findUserRule(transaction, userRules);
  if (userRule) {
    return {
      ...transaction,
      categoryId: userRule.categoryId,
      confidence: Math.max(transaction.confidence, 0.96),
      status: "confirmed"
    };
  }

  const text = [
    transaction.merchantName,
    transaction.counterparty,
    transaction.productName,
    transaction.rawDescription
  ].filter(Boolean).join(" ");

  for (const rule of merchantRules) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return {
        ...transaction,
        categoryId: rule.categoryId,
        confidence: Math.max(transaction.confidence, 0.86),
        status: "confirmed"
      };
    }
  }

  return {
    ...transaction,
    confidence: Math.min(transaction.confidence, 0.6),
    status: "pending_review"
  };
}

function findUserRule(transaction: Transaction, userRules: ClassificationRule[]): ClassificationRule | undefined {
  const sortedRules = [...userRules]
    .filter((rule) => rule.userId === transaction.userId)
    .sort((left, right) => right.priority - left.priority);

  return sortedRules.find((rule) => {
    const value = transaction[rule.field] ?? "";
    if (rule.matchType === "equals") {
      return value === rule.pattern;
    }
    return value.includes(rule.pattern);
  });
}
