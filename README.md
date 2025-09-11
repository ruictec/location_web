# Location Web Platform

> 定位与可视化管理平台（Vue2 + Webpack3）

## 📋 快速导航

- [🚀 快速开始](#快速开始)
- [⚙️ 环境变量说明](#环境变量说明)
- [📖 使用指南](#使用指南)
- [🔧 构建命令](#构建命令)
- [📁 项目结构](#项目结构)
- [🤝 贡献指南](#贡献指南)
- [📄 许可证](#许可证)

## 功能特性

- **实时定位跟踪**：室内外定位
- **资产管理**：跟踪和管理各种资产
- **员工管理**：员工位置和轨迹跟踪
- **项目管理**：多项目支持，3D可视化
- **设备管理**：支持各种定位设备（AOA、BLE、GPS等）
- **地图集成**：OpenLayers和蜂鸟地图集成
- **多语言支持**：中英文界面

## 技术栈

- **前端**：Vue.js 2.x, Vue Router, Vuex
- **构建工具**：Webpack 3.x
- **地图**：OpenLayers, 蜂鸟地图
- **UI框架**：Element UI
- **图表**：ECharts
- **3D可视化**：Three.js

## 快速开始

### 前置条件

- Node.js >= 12.x
- npm >= 6.x

### 安装

```bash
# 克隆仓库
git clone <repository-url>
cd location_web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 配置

#### 开发环境

在项目根目录创建 `.env.local` 文件：

```bash
# 开发环境配置
# 后端API和WebSocket地址
VUE_APP_API_BASE=http://localhost:14001/v1
VUE_APP_WS_BASE=ws://localhost:14001/websocket

# 静态资源地址（角色图片等）
VUE_APP_ASSET_BASE=http://localhost:8079

# 文档地址（Navbar.vue 中的在线文档和常见问题）
VUE_APP_DOC_BASE=http://localhost:8078

# 帮助文档地址（Menu.vue 中的帮助文档）
VUE_APP_HELP_BASE=http://localhost:8079

# 地图瓦片地址
VUE_APP_TILE_URL_TEMPLATE=https://tile.openstreetmap.org/{z}/{x}/{y}.png

# 蜂鸟地图图片资源地址
VUE_APP_FENGMAP_IMG_BASE=https://developer.fengmap.com/fmAPI/images

# 百度统计配置（可选）
VUE_APP_ENABLE_BAIDU_ANALYTICS=false
VUE_APP_BAIDU_HM_ID=

# MQTT 服务器地址
VUE_APP_MQTT_BROKER_URL=tcp://mqtt.example.com:1883

# 开发环境代理目标地址
API_PROXY_TARGET=http://localhost:14001
```

#### 生产环境

修改 `config/prod.env.js` 中的地址，或设置服务器环境变量。

## 环境变量说明

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| **后端服务地址** | | |
| `VUE_APP_API_BASE` | `http://localhost:14001/v1` | 后端API基础地址，用于API调用、文件上传等（对应 host.host） |
| `VUE_APP_WS_BASE` | `ws://localhost:14001/websocket` | WebSocket基础地址，用于实时通信（对应 host.ws） |
| **静态资源地址** | | |
| `VUE_APP_ASSET_BASE` | `http://localhost:8079` | 静态资源/图片基础地址，用于角色图片等（如 StaffManagement.vue 中的工种图片） |
| `VUE_APP_DOC_BASE` | `http://localhost:8078` | 文档/FAQ基础地址，用于 Navbar.vue 中的在线文档和常见问题 |
| `VUE_APP_HELP_BASE` | `http://localhost:8079` | 帮助文档基础地址，用于 Menu.vue 中的帮助文档 |
| **地图服务地址** | | |
| `VUE_APP_TILE_URL_TEMPLATE` | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | OSM瓦片URL模板，用于OpenLayers地图瓦片显示 |
| `VUE_APP_FENGMAP_IMG_BASE` | `https://developer.fengmap.com/fmAPI/images` | 蜂鸟地图示例图片基础地址，用于蜂鸟地图相关图片资源 |
| **统计配置** | | |
| `VUE_APP_BAIDU_HM_ID` | `''` | 百度统计HM ID（默认为空，需要时自行配置） |
| `VUE_APP_ENABLE_BAIDU_ANALYTICS` | `false` | 是否启用百度统计（默认关闭） |
| **其他服务** | | |
| `VUE_APP_MQTT_BROKER_URL` | `tcp://mqtt.example.com:1883` | MQTT服务器地址，用于数据转发配置 |

### 项目内跳转地址

项目内的页面跳转地址（如 beacon、project、terminal 页面）会根据当前访问地址自动生成，无需配置。

## 使用指南

1. **开发环境**：创建 `.env.local` 文件，根据实际部署填写环境变量值。
2. **开发**：运行 `npm run dev`，将使用 `.env.local` 文件中的配置。
3. **生产环境**：修改 `config/prod.env.js` 中的地址，或设置服务器环境变量。
4. **构建**：运行 `npm run build`，将使用 `config/prod.env.js` 中的配置。

## 重要说明

- `.env` 和 `.env.local` 已加入 `.gitignore`，避免误提交。
- 生产环境请使用自身域名/证书，避免把默认值带到线上。
- 百度统计仅在 `VUE_APP_ENABLE_BAIDU_ANALYTICS=true` 时加载，HM ID 可通过 `VUE_APP_BAIDU_HM_ID` 覆盖。

## 代理与地图建议

- **开发代理**：`config/index.js` 中的 `/v1` 路由可通过 `API_PROXY_TARGET` 指向测试网关。
- **地图瓦片**：建议自建 OSM 瓦片或选择稳定公共服务，避免示例地址限流。
- **蜂鸟地图图片**：可替换为自有静态资源以加速访问。

## 构建命令

```bash
# 开发
npm run dev

# 生产构建
npm run build

# 构建分析
npm run build --report
```

## 项目结构

```
src/
├── components/          # 可复用组件
├── views/              # 页面组件
├── router/             # 路由配置
├── store/              # Vuex状态管理
├── axios/              # HTTP请求配置
├── i18n/               # 国际化
├── config/             # 配置文件
└── assets/             # 静态资源
```

## 开源使用注意

- 许可证：MIT（见 [LICENSE](LICENSE)）。
- 安全策略：见 [SECURITY.md](SECURITY.md) / [SECURITY_EN.md](SECURITY_EN.md)；请勿公开披露未修复漏洞。
- 行为准则与贡献指南：见 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) / [CODE_OF_CONDUCT_EN.md](CODE_OF_CONDUCT_EN.md)、[CONTRIBUTING.md](CONTRIBUTING.md) / [CONTRIBUTING_EN.md](CONTRIBUTING_EN.md)。
- 提 Issue/PR：使用 `.github` 模板；PR 前请通过 `npm run lint && npm run build`。

## 贡献指南

1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 支持

如需技术支持或有问题，请联系开发团队。