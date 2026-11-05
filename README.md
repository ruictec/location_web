# Location Web Platform

[English](README_EN.md) | 中文

一个基于 **Vue.js 3.x** 的室内定位和地图管理系统。

## 📋 分支说明

| 分支 | 说明 |
|------|------|
| `main` | **默认分支**：Vue 3.x + Vite + Element Plus + 天地图（本文档所在分支） |
| `Tianditu` | Vue 2.x + Webpack 旧版存档 |

> GitHub 仓库首页的 README 取自默认分支 `main`，即当前 Vue 3.x 版本。
> 如需查阅旧版说明，请访问 [`Tianditu` 分支的 README](https://github.com/ruictec/location_web/blob/Tianditu/README.md)。

## 📋 技术栈说明

**本项目使用 Vue 3.x 技术栈：**

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

版本要求以 `package.json` 的 `engines` 为准，这是项目里唯一的版本声明：

```json
"engines": {
  "node": ">=18.18.0",
  "npm": ">= 9.0.0"
}
```

| 项 | 要求 | 说明 |
|----|------|------|
| Node.js | `>=18.18.0` | Vite 5 不支持 Node 16；已在 Node 22 LTS 环境验证可用 |
| npm | `>= 9.0.0` | `package-lock.json` 为 `lockfileVersion: 3`（npm 9+ 生成的格式），用更老的 npm 可能改写锁文件 |

> `engines` 只是**声明，不会强制拦截**：项目没有 `.npmrc`（未开启 `engine-strict`）、没有 `packageManager` 字段，也没有 CI 版本约束，用不满足要求的版本安装只会收到 `EBADENGINE` 警告。
> 当前开发环境实测为 Node `v22.22.2` / npm `10.9.7`。`.nvmrc` 与上表一致，直接 `nvm use` 即可。

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/ruictec/location_web.git
cd location_web
```

### 2. 安装依赖
```bash
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

构建产物在 `dist/`。`static/` 会由 `vite.config.js` 中的静态资源插件原样复制到 `dist/static/`，因此部署时可用 `dist/static/config.js` 覆盖运行时配置（如天地图 Key、地图提供方），无需重新打包。

## 📁 项目结构

```
location_web/
├── config/app.js        # 运行时统一配置（后端环境 / 地图 / 统计 / 微信），开发与部署都改这里
├── src/                  # 源代码
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── i18n/            # 多语言（中 / 英）
│   ├── router/          # 路由配置
│   ├── store/           # Vuex 状态管理
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   └── shims/           # 第三方库适配（如 fengmap）
├── public/              # 图片 / 大屏切图等静态资源
├── scripts/             # 迁移与辅助脚本
├── static/              # 运行时静态文件（含 config.js，构建时复制到 dist/static）
├── vite.config.js       # Vite 配置
└── package.json         # 项目配置
```

## 🔧 开发说明

### 依赖版本锁定
项目尽量使用精确版本号锁定依赖，确保构建一致性。

### 运行时配置（统一入口）

所有配置集中在 [`config/app.js`](config/app.js)。**本项目不再读取 `.env.local`**：
`config/app.js` 的 `resolveAppEnv()` 生成 `VUE_APP_*` 变量，再由 `vite.config.js` 的 `define` 在构建期注入 `process.env`；仓库中没有任何 `dotenv` / `loadEnv` / `.env.local` 读取逻辑。因此改配置请改 `config/app.js`，不要新建 `.env` 文件。

```js
// config/app.js
const config = {
  active: 'cloud',   // 切换后端环境：cloud | lan | lan1 | docker
  targets: {         // 各环境的 API / WebSocket / 资源地址
    cloud: { /* apiBase, wsBase, assetBase, docBase, helpBase ... */ },
  },
  common: {          // 与后端环境无关的公共项
    mapProvider: 'tianditu',      // tianditu | osm
    tiandituKey: '',              // 天地图 Key，勿提交真实值
    tileUrlTemplate: '...',
    fengmapImgBase: '...',
    enableBaiduAnalytics: false,
    baiduHmId: '',
    mqttBrokerUrl: '...',
    wechatAppId: '', wechatSecret: '',
  },
}
```

代码中读取的 `process.env.*` 与配置来源的对应关系：

| 变量 | `config/app.js` 中的来源 |
|------|--------------------------|
| `VUE_APP_API_BASE`、`VUE_APP_WS_BASE` | `targets[active].apiBase` / `wsBase`（开发时 API 固定走 `/v1` 代理） |
| `VUE_APP_ASSET_BASE`、`VUE_APP_DOC_BASE`、`VUE_APP_HELP_BASE` | `targets[active]` 对应项 |
| `VUE_APP_MAP_PROVIDER`、`VUE_APP_TIANDITU_KEY`、`VUE_APP_TILE_URL_TEMPLATE` | `common` 对应项 |
| `VUE_APP_FENGMAP_IMG_BASE`、`VUE_APP_FENGMAP_MAP_URL`、`VUE_APP_FENGMAP_THEME_URL` | `common` 对应项 |
| `VUE_APP_ENABLE_BAIDU_ANALYTICS`、`VUE_APP_BAIDU_HM_ID`、`VUE_APP_MQTT_BROKER_URL` | `common` 对应项 |
| `VUE_APP_WECHAT_APPID`、`VUE_APP_WECHAT_SECRET` | `common` 对应项 |

部署后若不想重新打包，可修改 `static/config.js`（或构建后的 `dist/static/config.js`）覆盖**地图相关项**（非空才生效）；后端地址等其他项需改 `config/app.js` 后重新构建。

> 天地图 Key、微信 Secret 等敏感值请勿提交到仓库。

### 已知问题
1. **fengmap 脚本加载**：通过 `src/shims/fengmap` 适配 Vite，避免 top-level await 影响构建目标兼容性
2. **ECharts**：通过 `echartsLegacy` 做兼容封装，请勿用 Proxy 覆盖 ESM 只读导出
3. **旧 Webpack 配置**：`build/`、`config/` 目录中部分文件为历史兼容保留，日常开发以 Vite 为准

## 🛡️ 安全考虑

- 详细安全信息请参考 [SECURITY.md](SECURITY.md)
- 请勿将密钥、证书、真实 API Key 提交到仓库（如天地图 Key、微信 Secret）
- 建议在隔离环境中进行开发和测试

## 🗺️ 路线图

### v2.0（当前版本）
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

日常开发请基于 `main` 分支创建 feature 分支。

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

**技术栈说明**: `main` 分支基于 Vue 3.x + Vite；Vue 2.x 旧版请使用 `Tianditu` 分支。
