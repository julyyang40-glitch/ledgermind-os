# 自动记账 Agent OS 开发规格

## 1. 产品目标

构建一个隐私优先、跨移动端和 PC 端的自动记账 Agent OS。系统从微信支付、支付宝、银行卡、手工记账、票据 OCR 等来源导入交易，完成标准化、去重、自动分类、用户确认、预算分析和自然语言查询。

首个 MVP 聚焦：

- 微信支付账单文件导入
- 支付宝账单文件导入
- 统一交易模型
- 基础规则分类
- 重复交易识别
- 导入结果报告
- 后续移动端/PC 端可复用的核心内核

## 2. 设计原则

1. 隐私优先：优先本地解析账单文件，原始记录默认不上传给大模型。
2. 来源可追溯：每笔标准交易都保留来源、来源交易 ID、原始摘要和导入任务 ID。
3. 规则优先，AI 补充：确定性规则先执行，低置信交易再进入 Agent 推理或人工确认。
4. 多端共享内核：移动端、PC 端、Web 端都调用同一套账本、解析、分类能力。
5. 渐进式 Agent OS：先做可靠的导入和账本，再扩展为预算、订阅、问答和自动建议。

## 3. 合规边界

允许路径：

- 用户主动上传微信/支付宝导出的账单文件
- 用户授权邮箱读取账单附件
- 用户手动选择本地文件或拖拽导入
- 用户拍照、截图或发票 OCR 辅助补录
- 商户场景下使用官方开放平台接口

禁止路径：

- 绕过微信、支付宝客户端安全机制
- 读取其他 App 私有数据库
- 模拟登录或自动点击抓取账单
- 未经用户确认上传原始账单到第三方模型

## 4. 系统分层

```text
apps/
  api/                 后端 API，供移动端/PC/Web 调用
  web/                 PC/Web 操作台，后续阶段建设
packages/
  core/                Agent OS 内核：工作流、工具注册、策略
  ledger/              账本领域模型、去重、分类、统计
  parsers/             微信/支付宝/银行账单解析器
  shared/              共享类型、错误码、工具函数
docs/
  architecture/        架构补充文档
samples/
  bills/               示例账单文件
```

## 5. 核心数据模型

### 5.1 Transaction

```ts
type Transaction = {
  id: string;
  userId: string;
  source: "wechat" | "alipay" | "bank" | "cash" | "manual" | "invoice";
  sourceTransactionId?: string;
  importJobId?: string;
  accountId?: string;
  direction: "income" | "expense" | "transfer" | "refund" | "unknown";
  amount: number;
  currency: string;
  paidAt: string;
  merchantName?: string;
  counterparty?: string;
  productName?: string;
  paymentMethod?: string;
  categoryId?: string;
  tags: string[];
  rawDescription?: string;
  normalizedDescription?: string;
  confidence: number;
  status: "pending_review" | "confirmed" | "ignored";
  createdAt: string;
  updatedAt: string;
};
```

### 5.2 ImportJob

```ts
type ImportJob = {
  id: string;
  userId: string;
  source: "wechat" | "alipay" | "bank" | "unknown";
  filename: string;
  status: "created" | "parsing" | "classified" | "completed" | "failed";
  totalRows: number;
  importedRows: number;
  duplicateRows: number;
  reviewRows: number;
  errors: string[];
  createdAt: string;
  updatedAt: string;
};
```

## 6. 开发流程

### 阶段 0：仓库初始化

交付物：

- `DEV_SPEC.md`
- TypeScript monorepo 基础配置
- 包目录结构
- 基础 lint/test/build 命令

验收：

- `npm.cmd test` 可运行
- `npm.cmd run build` 可运行

### 阶段 1：账单导入 MVP

交付物：

- 微信账单 CSV 解析器
- 支付宝账单 CSV 解析器
- 来源自动识别
- 标准交易模型映射
- 导入任务报告
- 示例账单和解析测试

验收：

- 示例微信账单可解析为标准交易
- 示例支付宝账单可解析为标准交易
- 错误行不会中断整个导入任务
- 金额、方向、时间、商户字段映射正确

### 阶段 2：账本内核

交付物：

- 交易指纹生成
- 重复交易检测
- 退款/转账候选识别
- 基础分类规则
- 用户规则接口

验收：

- 同一账单重复导入时能识别重复
- 常见商户可自动分类
- 低置信交易进入 `pending_review`

### 阶段 3：API 服务

交付物：

- `POST /imports` 创建导入任务
- `GET /imports/:id` 获取导入报告
- `GET /transactions` 查询交易
- `PATCH /transactions/:id` 修正分类

验收：

- 可通过 API 上传账单并返回导入摘要
- 可查询标准交易列表
- 修改分类后可形成用户规则

### 阶段 4：PC/Web 操作台

交付物：

- 文件拖拽导入
- 交易表格
- 分类修正
- 月度分类报表
- 导出 Excel

验收：

- 用户可以在 PC 端完成一个月账单整理
- 待确认交易可批量处理

### 阶段 5：移动端

交付物：

- 移动端首页
- 文件选择器导入
- 今日/本月支出
- 待确认交易
- 手工/语音记账入口
- 安卓新机型安全区与触控热区适配
- 移动端底部快捷导航

验收：

- 用户可在手机上导入账单并查看结果
- 多端数据模型保持一致
- 360/390/412/430px 常见安卓宽度无横向滚动
- 移动端交易明细以卡片呈现，PC 端仍保留高密度表格
- 主要表单控件触控高度不低于 44px，明细小按钮不低于 40px

### 阶段 6：Agent OS

交付物：

- Agent 工具注册表
- 工作流编排
- 用户偏好记忆
- 财务问答
- 预算建议
- 订阅识别

验收：

- 用户可发起“整理五月账单”等自然语言任务
- Agent 能检查缺失账单、导入、分类、请求确认并生成报告

## 7. 当前迭代范围

本次开发执行阶段 0、阶段 1，并落地阶段 2 的最小能力：

- 建立 monorepo
- 实现标准交易模型
- 实现 CSV 解析工具
- 实现微信/支付宝解析器
- 实现导入工作流
- 实现交易指纹和基础分类
- 增加示例数据与测试

## 12. 当前开发进度

已完成：

- 阶段 0：仓库初始化
- 阶段 1：微信/支付宝 CSV 账单导入 MVP
- 阶段 2：账本内核最小能力
- 阶段 3：主要 API 服务
- 阶段 4：PC/Web 操作台 MVP

阶段 4 当前已支持：

- 浏览器文件导入，使用 `contentBase64` 避免中文 CSV 编码问题
- 导入任务列表
- 交易明细表格
- 交易搜索与状态筛选
- 交易 CSV 导出
- 批量分类
- 分类修正
- 手工记账
- 单笔交易确认、忽略、删除
- 修正后自动学习用户分类规则
- 月度分类报表
- 月度分类预算与预算执行状态
- 退款/转账候选洞察
- 周期扣费候选识别
- PC 高密度表格视图
- 移动端卡片式交易视图
- GitHub 展示级侧栏工作台 UI
- PC 端桌面财务控制台：深色侧栏、月度指挥区、KPI 卡片、分析面板和高密度表格
- LedgerMind OS 高级 AI-native Dashboard：Finance Command Center、Review Inbox、Agent Memory、Automation Rules、Anomaly Detection、Privacy & Model Settings
- 本地 Agent 问答接口 `/agent/ask`，基于本地账本数据生成财务解释与行动建议
- 自然语言自动化规则接口 `/automation-rules`，支持从短命令创建分类学习规则
- 暗色 / 亮色主题切换
- 每日支出趋势
- Top 商户排行
- 分类支出占比
- 匿名示例数据一键导入
- 当前用户 JSON 备份导出
- 自动学习分类规则查看与删除
- 当前用户数据清空
- Toast 操作反馈与加载态
- PWA manifest 与 SVG 图标
- 安卓移动端视口安全区、底部快捷导航、两列指标卡片和触控按钮优化
- JSON 文件持久化，默认保存至 `data/ledger-store.json`

下一阶段建议：

- 将 JSON 文件持久化升级为 SQLite 本地持久化
- 增加 Excel 导出
- 增加预算趋势和订阅确认/忽略状态
- 抽象 API 错误码和审计日志

## 8. 技术选型

当前 MVP：

- Runtime：Node.js
- Language：TypeScript
- Test：Node built-in test runner
- API：Node HTTP 原生服务起步，后续可迁移 NestJS/Fastify
- Storage：内存仓库起步，阶段 3 接入 PostgreSQL/SQLite

后续生产版本：

- 后端：NestJS 或 FastAPI
- 数据库：PostgreSQL
- 本地数据库：SQLite
- 队列：Redis + BullMQ/Celery
- PC 桌面：Tauri
- 移动端：Flutter
- 图表：ECharts
- AI：LLM Gateway + Embedding + 规则引擎

## 9. 安全要求

1. 原始账单文件不默认持久化。
2. 原始记录进入数据库前必须标记敏感级别。
3. LLM 调用必须走脱敏层。
4. 所有导入、删除、导出动作写审计日志。
5. 用户可导出和彻底删除个人数据。
6. 本地模式必须可用。

## 10. Agent 工具清单

```text
detect_bill_source
parse_wechat_bill
parse_alipay_bill
normalize_transaction
classify_transaction
dedupe_transactions
create_import_job
query_transactions
update_transaction_category
generate_monthly_report
ask_user_to_confirm
```

## 11. Definition of Done

一次迭代完成必须满足：

- 代码可构建
- 测试可运行
- 示例数据覆盖主要路径
- 文档同步更新
- 新增领域逻辑有类型定义
- 涉及隐私数据的逻辑有明确边界
