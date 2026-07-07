# Changelog

本文件记录 LedgerMind OS 的重要版本变化。版本格式遵循 [Semantic Versioning](https://semver.org/)。

## [0.1.0-beta] - 2026-07-01

首个公开 Beta 版本。

### 新增

- PC 财务指挥中心与响应式中文工作台
- Android APK 与移动端独立离线账本
- 微信、支付宝、CSV、XLSX 账单导入
- AI 自动分类、置信度判断与分类记忆
- 智能审核箱与待确认交易工作流
- 账本健康度、预算风险和异常消费分析
- 中文月度报告与多维财务图表
- 中文财务智能体问答与结构化回答
- 展示模式、脱敏示例和独立演示账本
- SiliconFlow / DeepSeek V4 Flash 配置
- 云端模型失败时的本地分析 fallback
- JSON 备份、CSV 导出和系统诊断

### 验证

- 16/16 自动化测试通过
- 真实微信 XLSX 账单 98/98 行导入成功
- Android Debug APK 构建通过
- Android APK Signature Scheme v2 签名校验通过
