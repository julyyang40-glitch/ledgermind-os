export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const delimiter = detectDelimiter(input);

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell.trim());
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((value) => value.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

export function rowsToObjects(rows: string[][]): Record<string, string>[] {
  const headerIndex = findHeaderIndex(rows);
  if (headerIndex < 0) {
    return [];
  }

  const headers = rows[headerIndex].map((header) => header.trim());
  return rows.slice(headerIndex + 1).map((row) => {
    const item: Record<string, string> = {};
    headers.forEach((header, index) => {
      item[header] = row[index]?.trim() ?? "";
    });
    return item;
  });
}

function detectDelimiter(input: string): "," | "\t" {
  const previewLines = input.split(/\r?\n/).filter((line) => line.trim().length > 0).slice(0, 20);
  const commaCount = previewLines.reduce((sum, line) => sum + countChar(line, ","), 0);
  const tabCount = previewLines.reduce((sum, line) => sum + countChar(line, "\t"), 0);
  return tabCount > commaCount ? "\t" : ",";
}

function countChar(input: string, char: string): number {
  return input.split(char).length - 1;
}

function findHeaderIndex(rows: string[][]): number {
  const keywordIndex = rows.findIndex((row) => {
    const normalized = row.map(normalizeHeader).join("|");
    const hasTime = /交易时间|支付时间|交易创建时间|付款时间|时间/.test(normalized);
    const hasAmount = /金额|交易金额|收入|支出/.test(normalized);
    const hasSubject = /交易对方|商户|商家|商品|备注|对方/.test(normalized);
    return hasTime && hasAmount && hasSubject;
  });

  if (keywordIndex >= 0) {
    return keywordIndex;
  }

  return rows.findIndex((row) => row.length > 1);
}

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "")
    .replace(/[()（）:：]/g, "")
    .trim();
}
