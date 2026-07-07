import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import JSZip from "jszip";
import { LedgerAgentOS } from "../../../packages/core/src/agent-os.js";

loadDotEnv();

const agentOS = new LedgerAgentOS(join(process.cwd(), "data", "ledger-store.json"));
const webRoot = join(process.cwd(), "apps", "web", "public");
const llmConfig = {
  baseUrl: process.env.SILICONFLOW_BASE_URL ?? "https://api.siliconflow.cn/v1",
  modelName: process.env.SILICONFLOW_MODEL_NAME ?? "deepseek-ai/DeepSeek-V4-Flash",
  apiKey: process.env.SILICONFLOW_API_KEY ?? ""
};

const server = createServer((request, response) => {
  void handleRequest(request, response).catch((error: unknown) => {
    if (response.headersSent) {
      response.end();
      return;
    }
    const invalidJson = error instanceof SyntaxError;
    const invalidImport = request.method === "POST" && request.url === "/imports";
    writeJson(response, invalidJson || invalidImport ? 400 : 500, {
      error: invalidJson
        ? "请求内容不是有效的 JSON"
        : invalidImport
          ? "账单文件解析失败，请确认文件完整且未加密"
          : "服务暂时无法处理该请求，请稍后重试"
    });
    if (!invalidJson && !invalidImport) {
      console.error("Unhandled request error", error);
    }
  });
});

async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ ok: true, service: "auto-ledger-agent-os" }));
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/transactions")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    writeJson(response, 200, { transactions: agentOS.listTransactions(userId) });
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/exports/transactions.csv")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const month = url.searchParams.get("month");
    const transactions = agentOS.listTransactions(userId)
      .filter((transaction) => !month || transaction.paidAt.startsWith(month));
    response.setHeader("Content-Type", "text/csv; charset=utf-8");
    response.setHeader("Content-Disposition", `attachment; filename="transactions-${month ?? "all"}.csv"`);
    response.end(`\uFEFF${transactionsToCsv(transactions)}`);
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/exports/backup.json")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Disposition", `attachment; filename="ledger-backup-${userId}.json"`);
    response.end(JSON.stringify(agentOS.exportUserData(userId), null, 2));
    return;
  }

  if (request.method === "DELETE" && request.url?.startsWith("/users/") && request.url.endsWith("/data")) {
    const url = new URL(request.url, "http://localhost");
    const userId = decodeURIComponent(url.pathname.split("/")[2] ?? "");
    if (!userId) {
      writeJson(response, 400, { error: "userId is required" });
      return;
    }
    const removed = agentOS.clearUserData(userId);
    writeJson(response, 200, {
      deleted: true,
      removedRows: {
        transactions: removed.transactions.length,
        importJobs: removed.importJobs.length,
        classificationRules: removed.classificationRules.length,
        budgets: removed.budgets.length
      }
    });
    return;
  }

  if (request.method === "POST" && request.url === "/transactions/manual") {
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const amount = Number(body.amount);
    const paidAt = String(body.paidAt ?? "");
    const direction = String(body.direction ?? "expense");

    if (!Number.isFinite(amount) || amount <= 0 || !paidAt) {
      writeJson(response, 400, { error: "amount and paidAt are required" });
      return;
    }

    if (!["income", "expense", "transfer", "refund", "unknown"].includes(direction)) {
      writeJson(response, 400, { error: "invalid direction" });
      return;
    }

    const transaction = agentOS.createManualTransaction({
      userId,
      direction: direction as Parameters<LedgerAgentOS["createManualTransaction"]>[0]["direction"],
      amount,
      paidAt,
      merchantName: optionalString(body.merchantName),
      productName: optionalString(body.productName),
      categoryId: optionalString(body.categoryId),
      paymentMethod: optionalString(body.paymentMethod)
    });
    writeJson(response, 201, { transaction });
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/imports/")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const importJobId = url.pathname.split("/")[2];
    const job = agentOS.getImportJob(userId, importJobId);
    if (!job) {
      writeJson(response, 404, { error: "Import job not found" });
      return;
    }
    writeJson(response, 200, { job });
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/imports")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    writeJson(response, 200, { jobs: agentOS.listImportJobs(userId) });
    return;
  }

  if (request.method === "POST" && request.url === "/imports") {
    const body = await readJsonBody(request);
    const filename = String(body.filename ?? "bill.csv");
    const content = typeof body.contentBase64 === "string"
      ? filename.toLowerCase().endsWith(".xlsx")
        ? await xlsxBase64ToCsvText(String(body.contentBase64))
        : decodeBillContent(String(body.contentBase64))
      : String(body.content ?? "");
    const result = agentOS.importBill(
      String(body.userId ?? "demo-user"),
      filename,
      content
    );
    writeJson(response, result.job.status === "failed" ? 400 : 201, result);
    return;
  }

  if (request.method === "POST" && request.url === "/demo/import-samples") {
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const files = [
      ["wechat.csv", join(process.cwd(), "samples", "bills", "wechat.csv")],
      ["alipay.csv", join(process.cwd(), "samples", "bills", "alipay.csv")]
    ];
    const results = [];
    for (const [filename, path] of files) {
      const content = await readFile(path, "utf8");
      results.push(agentOS.importBill(userId, filename, content));
    }
    writeJson(response, 201, { results });
    return;
  }

  if (request.method === "POST" && request.url === "/agent/ask") {
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const month = String(body.month ?? new Date().toISOString().slice(0, 7));
    const question = String(body.question ?? "");
    writeJson(response, 200, await buildAgentAnswer(userId, month, question));
    return;
  }

  if (request.method === "POST" && request.url === "/automation-rules") {
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const command = String(body.command ?? "").trim();
    const parsed = parseRuleCommand(command);
    if (!parsed) {
      writeJson(response, 400, {
        error: "无法识别规则，请尝试：把滴滴自动归为交通"
      });
      return;
    }

    const rule = agentOS.createClassificationRule({
      userId,
      pattern: parsed.pattern,
      categoryId: parsed.categoryId
    });
    writeJson(response, 201, {
      rule,
      message: `规则已创建：${parsed.pattern} → ${categoryDisplayName(parsed.categoryId)}`
    });
    return;
  }

  if (request.method === "PATCH" && request.url === "/transactions/batch") {
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const categoryId = String(body.categoryId ?? "");
    const transactionIds = Array.isArray(body.transactionIds)
      ? body.transactionIds.map((id) => String(id))
      : [];

    if (transactionIds.length === 0 || !categoryId) {
      writeJson(response, 400, { error: "transactionIds and categoryId are required" });
      return;
    }

    const transactions = agentOS.updateTransactionCategories(userId, transactionIds, categoryId);
    writeJson(response, 200, { transactions, updatedRows: transactions.length });
    return;
  }

  if (request.method === "PATCH" && request.url?.endsWith("/status") && request.url.startsWith("/transactions/")) {
    const transactionId = request.url.split("?")[0]?.split("/")[2];
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const status = String(body.status ?? "");

    if (!transactionId || !["pending_review", "confirmed", "ignored"].includes(status)) {
      writeJson(response, 400, { error: "transactionId and valid status are required" });
      return;
    }

    const transaction = agentOS.updateTransactionStatus(
      userId,
      transactionId,
      status as Parameters<LedgerAgentOS["updateTransactionStatus"]>[2]
    );
    if (!transaction) {
      writeJson(response, 404, { error: "Transaction not found" });
      return;
    }
    writeJson(response, 200, { transaction });
    return;
  }

  if (request.method === "DELETE" && request.url?.startsWith("/transactions/")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const transactionId = url.pathname.split("/")[2];
    const deleted = agentOS.deleteTransaction(userId, transactionId);
    if (!deleted) {
      writeJson(response, 404, { error: "Transaction not found" });
      return;
    }
    writeJson(response, 200, { deleted: true });
    return;
  }

  if (request.method === "PATCH" && request.url?.startsWith("/transactions/")) {
    const transactionId = request.url.split("?")[0]?.split("/")[2];
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const categoryId = String(body.categoryId ?? "");
    if (!transactionId || !categoryId) {
      writeJson(response, 400, { error: "transactionId and categoryId are required" });
      return;
    }

    const transaction = agentOS.updateTransactionCategory(userId, transactionId, categoryId);
    if (!transaction) {
      writeJson(response, 404, { error: "Transaction not found" });
      return;
    }
    writeJson(response, 200, { transaction, rules: agentOS.listClassificationRules(userId) });
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/insights")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    writeJson(response, 200, agentOS.getInsights(userId));
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/reports/monthly")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const month = url.searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
    writeJson(response, 200, agentOS.generateMonthlyReport(userId, month));
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/analytics/monthly")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const month = url.searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
    writeJson(response, 200, agentOS.generateMonthlyAnalytics(userId, month));
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/budgets/status")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const month = url.searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
    writeJson(response, 200, { budgets: agentOS.getBudgetStatuses(userId, month) });
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/budgets")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const month = url.searchParams.get("month") ?? undefined;
    writeJson(response, 200, { budgets: agentOS.listBudgets(userId, month) });
    return;
  }

  if (request.method === "PUT" && request.url === "/budgets") {
    const body = await readJsonBody(request);
    const userId = String(body.userId ?? "demo-user");
    const month = String(body.month ?? "");
    const categoryId = String(body.categoryId ?? "");
    const limitAmount = Number(body.limitAmount);

    if (!month || !categoryId || !Number.isFinite(limitAmount) || limitAmount < 0) {
      writeJson(response, 400, { error: "month, categoryId and non-negative limitAmount are required" });
      return;
    }

    const budget = agentOS.upsertBudget(userId, month, categoryId, limitAmount);
    writeJson(response, 200, { budget });
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/classification-rules")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    writeJson(response, 200, { rules: agentOS.listClassificationRules(userId) });
    return;
  }

  if (request.method === "DELETE" && request.url?.startsWith("/classification-rules/")) {
    const url = new URL(request.url, "http://localhost");
    const userId = url.searchParams.get("userId") ?? "demo-user";
    const ruleId = url.pathname.split("/")[2];
    const deleted = agentOS.deleteClassificationRule(userId, ruleId);
    if (!deleted) {
      writeJson(response, 404, { error: "Classification rule not found" });
      return;
    }
    writeJson(response, 200, { deleted: true });
    return;
  }

  if (request.method === "GET") {
    const served = await serveStatic(request.url ?? "/", response);
    if (served) {
      return;
    }
  }

  writeJson(response, 404, { error: "Not found" });
}

const port = Number(process.env.PORT ?? 8787);
server.listen(port, () => {
  console.log(`Agent OS API listening on http://localhost:${port}`);
});

function loadDotEnv(): void {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
}

async function readJsonBody(request: NodeJS.ReadableStream): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function writeJson(
  response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void },
  statusCode: number,
  body: unknown
): void {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.statusCode = statusCode;
  response.end(JSON.stringify(body));
}

async function serveStatic(
  requestUrl: string,
  response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: Buffer | string) => void }
): Promise<boolean> {
  const url = new URL(requestUrl, "http://localhost");
  const pathname = url.pathname === "/" || url.pathname === "/showcase" || url.pathname === "/showcase/"
    ? "/index.html"
    : url.pathname;
  const target = normalize(join(webRoot, pathname));

  if (!target.startsWith(webRoot)) {
    return false;
  }

  try {
    const file = await readFile(target);
    response.setHeader("Content-Type", contentTypeFor(target));
    response.end(file);
    return true;
  } catch {
    return false;
  }
}

function contentTypeFor(filename: string): string {
  switch (extname(filename)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".webmanifest":
      return "application/manifest+json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function transactionsToCsv(transactions: ReturnType<LedgerAgentOS["listTransactions"]>): string {
  const headers = ["paidAt", "source", "merchant", "product", "direction", "amount", "categoryId", "status", "paymentMethod"];
  const rows = transactions.map((transaction) => [
    transaction.paidAt,
    transaction.source,
    transaction.merchantName ?? transaction.counterparty ?? "",
    transaction.productName ?? "",
    transaction.direction,
    transaction.amount.toFixed(2),
    transaction.categoryId ?? "",
    transaction.status,
    transaction.paymentMethod ?? ""
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

function optionalString(value: unknown): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : undefined;
}

function decodeBillContent(base64: string): string {
  const bytes = Buffer.from(base64, "base64");
  const decoders = ["utf-8", "gb18030", "gbk"];
  let best = "";
  let bestScore = Number.POSITIVE_INFINITY;
  for (const encoding of decoders) {
    try {
      const text = new TextDecoder(encoding).decode(bytes);
      const score = countReplacementChars(text) * 20 - countChineseChars(text);
      if (score < bestScore) {
        best = text;
        bestScore = score;
      }
    } catch {
      // Runtime may not expose every legacy decoder.
    }
  }
  return best || bytes.toString("utf8");
}

function countReplacementChars(text: string): number {
  return text.match(/\uFFFD/g)?.length ?? 0;
}

function countChineseChars(text: string): number {
  return text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
}

async function xlsxBase64ToCsvText(base64: string): Promise<string> {
  const zip = await JSZip.loadAsync(Buffer.from(base64, "base64"));
  const rows = await xlsxRowsFromZip(zip);
  const normalizedRows = normalizeXlsxRows(rows);
  return normalizedRows.map((row) => row.map(csvCell).join(",")).join("\n");
}

async function xlsxRowsFromZip(zip: JSZip): Promise<string[][]> {
  const sharedStrings = await readXlsxSharedStrings(zip);
  const workbookXml = await zip.file("xl/workbook.xml")?.async("text");
  const relsXml = await zip.file("xl/_rels/workbook.xml.rels")?.async("text");
  const firstSheetRelId = workbookXml?.match(/<sheet[^>]+r:id="([^"]+)"/)?.[1];
  const sheetTarget = firstSheetRelId && relsXml
    ? relsXml.match(new RegExp(`<Relationship[^>]+Id="${escapeRegExp(firstSheetRelId)}"[^>]+Target="([^"]+)"`))?.[1]
    : undefined;
  const sheetPath = sheetTarget
    ? `xl/${sheetTarget.replace(/^\/?xl\//, "")}`
    : "xl/worksheets/sheet1.xml";
  const sheetXml = await zip.file(sheetPath)?.async("text");
  if (!sheetXml) {
    throw new Error("XLSX worksheet not found");
  }

  const rows: string[][] = [];
  for (const rowMatch of sheetXml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const row: string[] = [];
    for (const cellMatch of rowMatch[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const ref = attrs.match(/\sr="([A-Z]+)\d+"/)?.[1];
      const colIndex = ref ? columnNameToIndex(ref) : row.length;
      const type = attrs.match(/\st="([^"]+)"/)?.[1] ?? "";
      const raw = body.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "";
      row[colIndex] = type === "s" ? sharedStrings[Number(raw)] ?? "" : decodeXml(raw);
    }
    if (row.some((cell) => String(cell ?? "").trim())) {
      rows.push(row.map((cell) => String(cell ?? "")));
    }
  }
  return rows;
}

function normalizeXlsxRows(rows: string[][]): string[][] {
  const headerIndex = rows.findIndex((row) => {
    const text = row.map(normalizeXlsxHeader).join("|");
    return /交易时间|支付时间|交易创建时间|付款时间|时间/.test(text) && /金额|交易金额/.test(text);
  });
  if (headerIndex < 0) {
    return rows;
  }

  const headers = rows[headerIndex].map(normalizeXlsxHeader);
  const timeColumns = headers
    .map((header, index) => (/交易时间|支付时间|交易创建时间|付款时间|时间/.test(header) ? index : -1))
    .filter((index) => index >= 0);

  return rows.map((row, rowIndex) => {
    if (rowIndex <= headerIndex) {
      return row;
    }
    const next = [...row];
    for (const index of timeColumns) {
      next[index] = excelSerialToDateTime(next[index]) ?? next[index];
    }
    return next;
  });
}

function normalizeXlsxHeader(value: string): string {
  return value.replace(/^\uFEFF/, "").replace(/\s+/g, "").replace(/[()（）:：]/g, "").trim();
}

function excelSerialToDateTime(value: string): string | undefined {
  const trimmed = String(value ?? "").trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return undefined;
  }
  const serial = Number(trimmed);
  if (!Number.isFinite(serial) || serial < 20000 || serial > 80000) {
    return undefined;
  }

  const milliseconds = Math.round((serial - 25569) * 86400 * 1000);
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

async function readXlsxSharedStrings(zip: JSZip): Promise<string[]> {
  const xml = await zip.file("xl/sharedStrings.xml")?.async("text");
  if (!xml) {
    return [];
  }
  return [...xml.matchAll(/<si[^>]*>([\s\S]*?)<\/si>/g)].map((match) =>
    [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((part) => decodeXml(part[1])).join("")
  );
}

function columnNameToIndex(name: string): number {
  return [...name].reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type AgentAnswer = {
  answer: string;
  cards: Array<{ label: string; value: string }>;
  actions: string[];
  provider?: string;
  model?: string;
};

async function buildAgentAnswer(userId: string, month: string, question: string): Promise<AgentAnswer> {
  const fallback = buildLocalAgentAnswer(userId, month, question);
  if (!llmConfig.apiKey) {
    return fallback;
  }

  try {
    const answer = await askSiliconFlow(userId, month, question);
    return {
      ...fallback,
      answer,
      provider: "SiliconFlow",
      model: llmConfig.modelName
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return {
      ...fallback,
      answer: `${fallback.answer}\n\n提示：云端模型暂时不可用，已使用本地分析结果。原因：${message}`,
      provider: "local-fallback",
      model: llmConfig.modelName
    };
  }
}

function buildLocalAgentAnswer(userId: string, month: string, question: string): AgentAnswer {
  const report = agentOS.generateMonthlyReport(userId, month);
  if (isGreetingQuestion(question)) {
    return {
      answer: "你好，我是 LedgerMind 的记账智能体。你可以问我本月花销、订阅扣费、预算风险，也可以让我帮你生成节省计划。",
      cards: [
        { label: "本月支出", value: money(report.expense) },
        { label: "数据来源", value: "本地账本" },
        { label: "可提问", value: "支出 / 订阅 / 预算" },
        { label: "模式", value: "本地回退" }
      ],
      actions: ["总结本月花销", "检查订阅", "生成节省计划"],
      provider: "local"
    };
  }
  const insights = agentOS.getInsights(userId);
  const analytics = agentOS.generateMonthlyAnalytics(userId, month);
  const topCategory = analytics.categoryShares[0];
  const topMerchant = analytics.topMerchants[0];
  const recurringCount = insights.recurringPaymentCandidates.length;
  const potentialSavings = Math.max(0, report.expense * 0.08);
  const lowerQuestion = question.toLowerCase();

  let answer = `我已分析 ${month} 的 ${report.transactionCount} 笔交易：支出 ${money(report.expense)}，收入 ${money(report.income)}，还有 ${report.pendingReviewCount} 笔需要确认。`;
  if (lowerQuestion.includes("订阅") || lowerQuestion.includes("subscription") || lowerQuestion.includes("saas")) {
    answer = recurringCount > 0
      ? `我发现 ${recurringCount} 个周期扣费候选项。建议优先检查订阅列表，尤其是最近涨价或低频使用的服务。`
      : "目前还没有发现明显的周期订阅扣费。建议导入更多月份的账单，提高识别稳定性。";
  } else if (lowerQuestion.includes("节省") || lowerQuestion.includes("省钱") || lowerQuestion.includes("save")) {
    answer = `本月可以先设置一个保守节省目标：${money(potentialSavings)}。优先从订阅、高频餐饮和异常商户三类支出开始排查。`;
  } else if (lowerQuestion.includes("餐饮") || lowerQuestion.includes("food")) {
    answer = topCategory
      ? `当前占比最高的分类是 ${topCategory.categoryId}，约占本月支出的 ${Math.round(topCategory.percent * 100)}%。可以结合 Top 商户面板定位主要来源。`
      : "还需要更多已分类交易，才能解释餐饮支出的变化原因。";
  } else if (lowerQuestion.includes("总结") || lowerQuestion.includes("summary") || lowerQuestion.includes("month")) {
    answer = `本月摘要：支出 ${money(report.expense)}，收入 ${money(report.income)}，净额 ${money(report.net)}。Top 商户：${topMerchant?.merchantName ?? "数据不足"}。`;
  }

  return {
    answer,
    cards: [
      { label: "本月支出", value: money(report.expense) },
      { label: "可节省空间", value: money(potentialSavings) },
      { label: "待确认", value: String(report.pendingReviewCount) },
      { label: "周期扣费候选", value: String(recurringCount) }
    ],
    actions: ["审核订阅", "生成节省计划", "打开待处理收件箱"],
    provider: "local"
  };
}

function money(value: number): string {
  return `¥${value.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function isGreetingQuestion(question: string): boolean {
  return /^(你好|您好|hello|hi|嗨|在吗|测试|test)[\s!！。？?]*$/i.test(question.trim());
}

async function askSiliconFlow(userId: string, month: string, question: string): Promise<string> {
  const report = agentOS.generateMonthlyReport(userId, month);
  const insights = agentOS.getInsights(userId);
  const analytics = agentOS.generateMonthlyAnalytics(userId, month);
  const transactions = agentOS.listTransactions(userId)
    .filter((transaction) => transaction.paidAt.startsWith(month))
    .sort((left, right) => right.paidAt.localeCompare(left.paidAt))
    .slice(0, 20)
    .map((transaction) => ({
      paidAt: transaction.paidAt,
      merchant: transaction.merchantName ?? transaction.counterparty ?? "未知商户",
      product: transaction.productName ?? "",
      direction: transaction.direction,
      amount: transaction.amount,
      categoryId: transaction.categoryId ?? "未分类",
      status: transaction.status
    }));
  const context = {
    month,
    report,
    topMerchants: analytics.topMerchants.slice(0, 8),
    categoryShares: analytics.categoryShares.slice(0, 8),
    recurringPaymentCandidates: insights.recurringPaymentCandidates.slice(0, 8),
    pendingReviewTransactions: transactions.filter((transaction) => transaction.status === "pending_review").slice(0, 8),
    recentTransactions: transactions
  };
  const endpoint = `${llmConfig.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(30000),
    headers: {
      "Authorization": `Bearer ${llmConfig.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: llmConfig.modelName,
      temperature: 0.25,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: [
            "你是 LedgerMind OS 的中文财务记账智能体。",
            "你只能基于用户账本上下文回答，不要编造不存在的交易。",
            "回答要简洁、可执行，优先指出异常、订阅、预算风险和下一步操作。",
            "不要使用 Markdown、emoji、粗体符号或长段落。",
            "最多输出 4 句中文短句，每句只讲一个结论。",
            "这不是投资建议、税务建议或法律建议；涉及高风险决策时提醒用户自行核对。"
          ].join("\n")
        },
        {
          role: "user",
          content: `用户问题：${question || "请总结本月账本。"}\n\n账本上下文 JSON：\n${JSON.stringify(context, null, 2)}`
        }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SiliconFlow HTTP ${response.status}: ${body.slice(0, 180)}`);
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error("SiliconFlow returned an empty answer");
  }
  return answer;
}

function parseRuleCommand(command: string): { pattern: string; categoryId: string } | undefined {
  const normalized = command.trim();
  if (!normalized) {
    return undefined;
  }

  const categoryMap: Array<[RegExp, string]> = [
    [/交通|打车|滴滴|优步|出租|transport|uber|ride|taxi/i, "transport.taxi"],
    [/软件|订阅|会员|视频|software|saas|notion|figma|subscription/i, "subscription.video"],
    [/餐饮|咖啡|吃饭|午餐|晚餐|food|coffee|restaurant|lunch/i, "food.restaurant"],
    [/购物|超市|买菜|grocery|shopping/i, "shopping.grocery"],
    [/房租|租金|居住|rent|housing/i, "housing.rent"]
  ];
  const categoryId = categoryMap.find(([pattern]) => pattern.test(normalized))?.[1] ?? "life.daily";
  const quoted = normalized.match(/"([^"]+)"/)?.[1];
  const chineseMatch = normalized.match(/(?:把|将)(.+?)(?:自动)?(?:归为|分类为)/)?.[1];
  const asMatch = normalized.match(/categorize\s+(.+?)\s+as\s+/i)?.[1];
  const pattern = (quoted ?? chineseMatch ?? asMatch ?? normalized.replace(/^always\s+/i, "").split(/\s+as\s+/i)[0]).trim();
  return pattern ? { pattern, categoryId } : undefined;
}

function categoryDisplayName(categoryId: string): string {
  const labels: Record<string, string> = {
    "transport.taxi": "交通 / 打车",
    "subscription.video": "订阅 / 视频",
    "food.restaurant": "餐饮 / 正餐",
    "shopping.grocery": "购物 / 买菜",
    "housing.rent": "居住 / 房租",
    "life.daily": "生活 / 日用"
  };
  return labels[categoryId] ?? categoryId;
}
