import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseBill } from "./index.js";

test("parses sample wechat bill", () => {
  const content = readFileSync("samples/bills/wechat.csv", "utf8");
  const bill = parseBill("wechat.csv", content);

  assert.equal(bill.source, "wechat");
  assert.equal(bill.rows.length, 3);
  assert.equal(bill.rows[0].amount, 18);
  assert.equal(bill.rows[0].merchantName, "瑞幸咖啡");
});

test("parses sample alipay bill", () => {
  const content = readFileSync("samples/bills/alipay.csv", "utf8");
  const bill = parseBill("alipay.csv", content);

  assert.equal(bill.source, "alipay");
  assert.equal(bill.rows.length, 3);
  assert.equal(bill.rows[0].amount, 86.2);
  assert.equal(bill.rows[1].merchantName, "滴滴出行");
});

