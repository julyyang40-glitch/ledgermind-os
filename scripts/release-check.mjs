import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const output = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" });
const files = output.split("\0").filter(Boolean);
const errors = [];
const prohibitedPath = /(^|\/)(node_modules|dist|build|coverage|data|uploads|imports|tmp|temp)(\/|$)|\.(apk|aab|jks|keystore|p12|pfx|pem|key|db|sqlite|xlsx|xls|log)$/i;
const textExtensions = /\.(js|mjs|cjs|ts|tsx|json|md|html|css|yml|yaml|env|example|txt|xml|gradle|properties)$/i;
const secretPattern = /sk-[a-z0-9_-]{20,}/gi;
const absolutePathPattern = /C:\\Users\\[^\\\s]+|C:\/Users\/[^/\s]+/gi;

for (const file of files) {
  const normalized = file.replaceAll("\\", "/");
  const isAnonymousFixture = normalized.startsWith("samples/bills/") && /\.(csv|txt)$/i.test(normalized);
  if (prohibitedPath.test(normalized) && !isAnonymousFixture) errors.push(`${normalized}: 不应提交的构建产物、私密数据或密钥文件`);
  if (!textExtensions.test(normalized)) continue;
  const content = readFileSync(file, "utf8");
  if (secretPattern.test(content)) errors.push(`${normalized}: 疑似包含真实 API Key`);
  secretPattern.lastIndex = 0;
  if (absolutePathPattern.test(content)) errors.push(`${normalized}: 包含本地用户绝对路径`);
  absolutePathPattern.lastIndex = 0;
}

if (errors.length) {
  console.error("发布安全检查失败：\n" + errors.map((item) => `- ${item}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`发布安全检查通过，共检查 ${files.length} 个 Git 文件。`);
}
