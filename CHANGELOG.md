# 更新日志

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划中
- Vue 3.x 升级
- 现代构建工具集成
- TypeScript 支持
- 全面安全审计

## [1.0.0] - 2025-09-12

### 新增
- 🎉 初始开源版本发布
- 📍 室内定位功能
- 🗺️ 地图管理和展示
- 📊 数据可视化
- 🎯 3D场景展示
- 👥 人员轨迹分析

### 技术栈
- Vue.js 2.6.12
- Element UI 2.14.1
- View Design 4.5.0
- FengMap 3.1.4
- OpenLayers 6.4.3
- ECharts 4.9.0
- Webpack 3.12.0

### 文档
- 📖 完整的 README.md
- 🛡️ 安全策略文档 (SECURITY.md)
- 🤝 贡献指南 (CONTRIBUTING.md)
- 📄 MIT 许可证
- 📋 更新日志

### 配置
- 🔧 Node.js 版本锁定 (14.21.3)
- 📦 依赖版本完全锁定
- 🚀 开发环境配置
- 🏗️ 构建脚本优化

### 安全
- ⚠️ 已知安全漏洞文档化
- 🔍 安全审计报告
- 📋 漏洞清单和风险评估
- 🛡️ 安全使用指南

### 脚本
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run audit` - 安全审计
- `npm run outdated` - 检查过时依赖
- `npm run reinstall` - 重新安装依赖

## 版本说明

### v1.0.x 系列
- **目标**: 稳定运行，文档完善
- **支持**: 仅安全修复和文档更新
- **状态**: 维护模式
- **用途**: 室内定位和地图管理

### v2.0.x 系列 (计划中)
- **目标**: 现代化技术栈
- **计划**: Vue 3.x, 现代构建工具, TypeScript
- **状态**: 开发中
- **用途**: 生产环境

## 安全状态

### 当前版本 (v1.0.0)
- **总漏洞数**: 160个
- **严重漏洞**: 40个
- **高危漏洞**: 43个
- **中危漏洞**: 65个
- **低危漏洞**: 12个

### 主要安全风险
- babel-traverse: 任意代码执行
- ejs: 模板注入
- eventsource: 敏感信息泄露
- vue: ReDoS攻击
- axios: CSRF/SSRF/DoS
- express: 拒绝服务
- webpack-dev-server: 路径遍历

## 升级指南

### 从开发版本升级到 v1.0.0
1. 备份现有代码
2. 拉取最新代码
3. 删除 node_modules 和 package-lock.json
4. 运行 `npm run reinstall`
5. 测试功能是否正常

### 计划升级到 v2.0.0
- 等待 v2.0.0 发布
- 查看迁移指南
- 逐步升级各个模块
- 全面测试

## 贡献者

感谢所有为项目做出贡献的开发者！

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

**注意**: 此版本基于Vue 2.x技术栈，建议根据项目需求评估技术栈兼容性。
