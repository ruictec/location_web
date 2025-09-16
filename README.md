# Location Web Platform

[English](README_EN.md) | 中文

一个基于Vue.js 2.x的室内定位和地图管理系统。

## 📋 技术栈说明

**当前版本使用Vue 2.x技术栈：**

- 🏗️ **Vue.js 2.6.12** - 前端框架
- 📦 **较旧的技术栈** - 基于2018-2019年的技术选型
- 🔄 **现代化计划** - 2.0版本将升级到Vue 3.x和现代技术栈

## 📋 项目概述
这是一个室内定位和地图管理平台，提供以下功能：
- **实时定位跟踪**：室内外定位
- **资产管理**：跟踪和管理各种资产
- **员工管理**：员工位置和轨迹跟踪
- **项目管理**：多项目支持，3D可视化
- **设备管理**：支持各种定位设备（AOA、BLE、GPS等）
- **地图集成**：OpenLayers和蜂鸟地图集成
- **多语言支持**：中英文界面

## 🛠️ 技术栈

- **前端框架**: Vue.js 2.6.12
- **UI组件库**: Element UI 2.14.1, View Design 4.5.0
- **地图引擎**: FengMap 3.1.4, OpenLayers 6.4.3
- **图表库**: ECharts 4.9.0
- **构建工具**: Webpack 3.12.0
- **样式预处理**: Sass 1.26.2

## 📦 环境要求

- Node.js 16.20.2 (推荐使用nvm管理版本)
- npm 6.x

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd location_web
```

### 2. 安装依赖
```bash
# 使用nvm切换到指定Node.js版本
nvm use

# 安装依赖
npm install --legacy-peer-deps
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
location_web/
├── build/                 # 构建配置
├── config/               # 项目配置
├── src/                  # 源代码
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   ├── store/           # Vuex状态管理
│   ├── utils/           # 工具函数
│   └── views/           # 页面组件
├── static/              # 静态文件
└── package.json         # 项目配置
```

## 🔧 开发说明

### 依赖版本锁定
项目使用精确版本号锁定所有依赖，确保构建一致性：
- 所有依赖版本都固定为具体版本号（无^或~前缀）
- 使用`--legacy-peer-deps`标志处理依赖冲突

### 已知问题
1. **fengmap压缩文件解析问题**: 某些压缩的JavaScript文件可能导致webpack解析错误
2. **Vue版本兼容性**: 严格依赖Vue 2.6.12版本
3. **技术栈版本**: 使用较旧的技术栈版本，部分依赖可能存在兼容性问题

## 🛡️ 安全考虑

### 技术栈安全
- 使用较旧的技术栈版本，建议定期关注依赖更新
- 详细安全信息请参考 [SECURITY.md](SECURITY.md)
- 建议在隔离环境中进行开发和测试

## 🗺️ 路线图

### v1.0 (当前版本)
- ✅ 基础功能实现
- ✅ 依赖版本锁定
- ✅ 开发环境配置

### v2.0 (计划中)
- 🔄 升级到Vue 3.x
- 🔄 使用现代构建工具（Vite）
- 🔄 现代化UI组件库
- 🔄 TypeScript支持
- 🔄 全面技术栈现代化

## 🤝 贡献指南

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目贡献。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🆘 支持

如果您遇到问题或有建议，请：

1. 查看 [Issues](../../issues) 中是否有类似问题
2. 创建新的 Issue 描述您的问题
3. 参考 [安全策略](SECURITY.md) 报告安全漏洞

## ⚡ 性能优化

### 内存配置
项目配置了较大的内存限制以支持大型地图数据：
```bash
node --max_old_space_size=7168
```

### 构建优化
- 使用webpack代码分割
- 图片和资源压缩
- CSS提取和优化

## 🔗 后端项目

本项目需要配合后端服务使用，后端项目地址：

- **后端仓库**: [https://github.com/ruictec/edwei](https://github.com/ruictec/edwei)
- **项目说明**: 人员与资产定位管理系统后端，支持智能徽章、BLE信标、GPS、UWB等多种定位技术

## 📚 相关文档

- [Vue.js 2.x 官方文档](https://v2.vuejs.org/)
- [Element UI 文档](https://element.eleme.cn/)
- [FengMap 开发文档](https://www.fengmap.com/)
- [ECharts 配置手册](https://echarts.apache.org/)

---

**技术栈说明**: 当前版本基于Vue 2.x技术栈，较旧但功能完整。现代化版本v2.0正在开发中。