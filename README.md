# Location Web Platform

[English](README_EN.md) | 中文

一个基于 **Vue.js 3.x** 的室内定位和地图管理系统（`Tianditu-vue3` 分支）。

## 📋 分支说明

| 分支 | 说明 |
|------|------|
| `main` | 主分支 |
| `Tianditu` | Vue 2.x + Webpack + 天地图 |
| `Tianditu-vue3` | **当前**：Vue 3.x + Vite + Element Plus + 天地图 |

## 📋 技术栈说明

**本分支使用 Vue 3.x 技术栈：**

- 🏗️ **Vue.js 3.4.38** - 前端框架
- ⚡ **Vite 5.4** - 构建工具
- 🎨 **Element Plus 2.8** - UI 组件库
- 🗺️ **天地图 / OpenLayers / FengMap** - 地图能力

> Vue 2.x（Webpack）版本请切换到 [`Tianditu`](https://github.com/ruictec/location_web/tree/Tianditu) 分支，并参考该分支文档。

## 📋 项目概述
这是一个室内定位和地图管理平台，提供以下功能：
- **实时定位跟踪**：室内外定位
- **资产管理**：跟踪和管理各种资产
- **员工管理**：员工位置和轨迹跟踪
- **项目管理**：多项目支持，3D可视化
- **设备管理**：支持各种定位设备（AOA、BLE、GPS等）
- **地图集成**：OpenLayers、蜂鸟地图、天地图
- **多语言支持**：中英文界面

## 🛠️ 技术栈

- **前端框架**: Vue.js 3.4.38
- **路由 / 状态**: Vue Router 4.4、Vuex 4.1
- **UI组件库**: Element Plus 2.8.8
- **地图引擎**: FengMap 3.1.4、OpenLayers 6.4.3、天地图
- **图表库**: ECharts 5.5.1
- **构建工具**: Vite 5.4.11
- **样式预处理**: Sass 1.77.8
- **3D**: Three.js 0.150.1

## 📦 环境要求

- Node.js 16.20.2+（推荐使用 nvm，见 `.nvmrc`）
- npm 8.x+

## 🚀 快速开始

### 1. 克隆项目并切换分支
```bash
git clone <repository-url>
cd location_web
git checkout Tianditu-vue3
```

### 2. 安装依赖
```bash
# 使用 nvm 切换到指定 Node.js 版本
nvm use

# 安装依赖（如遇 peer 依赖冲突可用下方命令）
npm install
# 或
npm run install:legacy
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 构建生产版本
```bash
npm run build
```

构建产物在 `dist/`。部署时可用 `dist/static/config.js` 覆盖运行时配置（如天地图 Key、地图提供方），无需重新打包。

## 📁 项目结构

```
location_web/
├── src/                  # 源代码
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   ├── store/           # Vuex 状态管理
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   └── shims/           # 第三方库适配（如 fengmap）
├── static/              # 静态文件（含运行时 config.js）
├── vite.config.js       # Vite 配置
└── package.json         # 项目配置
```

## 🔧 开发说明

### 依赖版本锁定
项目尽量使用精确版本号锁定依赖，确保构建一致性。

### 环境变量（示例）
在项目根目录创建 `.env.local` 并配置：

```bash
# 后端接口与WebSocket
VUE_APP_API_BASE=http://localhost:14001/v1
VUE_APP_WS_BASE=ws://localhost:14001/websocket

# 静态资源与文档
VUE_APP_ASSET_BASE=http://localhost:8079
VUE_APP_DOC_BASE=http://localhost:8078
VUE_APP_HELP_BASE=http://localhost:8079

# 地图与第三方
VUE_APP_MAP_PROVIDER=tianditu
VUE_APP_TILE_URL_TEMPLATE=https://tile.openstreetmap.org/{z}/{x}/{y}.png
VUE_APP_FENGMAP_IMG_BASE=https://developer.fengmap.com/fmAPI/images
VUE_APP_TIANDITU_KEY=

# 统计与消息
VUE_APP_ENABLE_BAIDU_ANALYTICS=false
VUE_APP_BAIDU_HM_ID=
VUE_APP_MQTT_BROKER_URL=tcp://mqtt.example.com:1883

# 微信小程序（如需使用，勿提交到仓库）
VUE_APP_WECHAT_APPID=
VUE_APP_WECHAT_SECRET=
```

生产环境也可在部署目录修改 `static/config.js`（或构建后的 `dist/static/config.js`）覆盖地图相关配置。

### 已知问题
1. **fengmap 脚本加载**：通过 `src/shims/fengmap` 适配 Vite，避免 top-level await 影响构建目标兼容性
2. **ECharts**：通过 `echartsLegacy` 做兼容封装，请勿用 Proxy 覆盖 ESM 只读导出
3. **旧 Webpack 配置**：`build/`、`config/` 目录中部分文件为历史兼容保留，日常开发以 Vite 为准

## 🛡️ 安全考虑

- 详细安全信息请参考 [SECURITY.md](SECURITY.md)
- 请勿将密钥、证书、真实 API Key 提交到仓库（如天地图 Key、微信 Secret）
- 建议在隔离环境中进行开发和测试

## 🗺️ 路线图

### v2.0（本分支）
- ✅ 升级到 Vue 3.x
- ✅ 使用 Vite 构建
- ✅ Element Plus UI
- ✅ 天地图集成与相关业务同步
- 🔄 TypeScript 逐步引入（可选）
- 🔄 持续功能与样式对齐

### v1.x（`Tianditu` / 历史）
- ✅ Vue 2.x + Webpack 基线功能

## 🤝 贡献指南

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目贡献。

Vue 3 相关改动请基于 `Tianditu-vue3` 分支开发。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🆘 支持

如果您遇到问题或有建议，请：

1. 查看 [Issues](../../issues) 中是否有类似问题
2. 创建新的 Issue 描述您的问题
3. 参考 [安全策略](SECURITY.md) 报告安全漏洞

## 🔗 后端项目

本项目需要配合后端服务使用，后端项目地址：

- **后端仓库**: [https://github.com/ruictec/edwei](https://github.com/ruictec/edwei)
- **项目说明**: 人员与资产定位管理系统后端，支持智能徽章、BLE信标、GPS、UWB等多种定位技术

## 📚 相关文档

- [Vue.js 3 官方文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 文档](https://vitejs.dev/)
- [FengMap 开发文档](https://www.fengmap.com/)
- [ECharts 配置手册](https://echarts.apache.org/)

---

**技术栈说明**: `Tianditu-vue3` 分支基于 Vue 3.x + Vite；Vue 2.x 请使用 `Tianditu` 分支。
