# Location Web Platform

[中文](README.md) | English

A location tracking and map management platform built with **Vue.js 3.x**.

## Branch Overview

| Branch | Description |
|--------|-------------|
| `main` | **Default branch**: Vue 3.x + Vite + Element Plus + Tianditu maps (this document's branch) |
| `Tianditu` | Vue 2.x + Webpack legacy archive |

> GitHub renders the README from the default branch `main`, which is the current Vue 3.x version.
> For the legacy docs, see the [`Tianditu` branch README](https://github.com/ruictec/location_web/blob/Tianditu/README_EN.md).

## Quick Navigation

- [🚀 Quick Start](#quick-start)
- [⚙️ Injected Variables](#injected-variables)
- [📖 Usage Guide](#usage-guide)
- [🔧 Build Commands](#build-commands)
- [📁 Project Structure](#project-structure)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

## Features

- **Real-time Location Tracking**: Indoor and outdoor positioning
- **Asset Management**: Track and manage various assets
- **Staff Management**: Employee location and trajectory tracking
- **Project Management**: Multi-project support with 3D visualization
- **Device Management**: Support for various positioning devices (AOA, BLE, GPS, etc.)
- **Map Integration**: OpenLayers, Fengmap, and Tianditu
- **Multi-language Support**: Chinese and English interface

## Technology Stack

**The project uses the Vue 3.x stack:**

- 🏗️ **Vue.js 3.4.38** - Frontend framework
- ⚡ **Vite 5.4** - Build tool
- 🎨 **Element Plus 2.8** - UI library
- 🗺️ **Tianditu / OpenLayers / FengMap** - Maps

> For the Vue 2.x (Webpack) version, switch to the [`Tianditu`](https://github.com/ruictec/location_web/tree/Tianditu) branch.

### Technical Details
- **Frontend**: Vue.js 3.4.38, Vue Router 4.4.5, Vuex 4.1.0
- **Build Tool**: Vite 5.4.11
- **Maps**: OpenLayers 6.4.3, Fengmap 3.1.4, Tianditu
- **UI Framework**: Element Plus 2.8.8
- **Charts**: ECharts 5.5.1
- **3D Visualization**: Three.js 0.150.1

## Quick Start

### Prerequisites

The `engines` field in `package.json` is the only version declaration in this project:

```json
"engines": {
  "node": ">=18.18.0",
  "npm": ">= 9.0.0"
}
```

| Item | Requirement | Note |
|------|-------------|------|
| Node.js | `>=18.18.0` | Vite 5 does not support Node 16; verified on Node 22 LTS |
| npm | `>= 9.0.0` | `package-lock.json` uses `lockfileVersion: 3` (npm 9+ format); older npm may rewrite the lockfile |

> `engines` is **advisory, not enforced**: there is no `.npmrc` (`engine-strict` is off), no
> `packageManager` field, and no CI version constraint. An older npm only produces an
> `EBADENGINE` warning instead of failing the install.
> Verified development environment: Node `v22.22.2` / npm `10.9.7`.
> `.nvmrc` matches the table above; a plain `nvm use` is enough.

### Installation

```bash
git clone https://github.com/ruictec/location_web.git
cd location_web

nvm use

# Install dependencies
npm install
# or if peer dependency conflicts occur:
npm run install:legacy

# Start development server
npm run dev
```

### Configuration

All settings live in [`config/app.js`](config/app.js). **The project no longer reads `.env.local`**:
`resolveAppEnv()` in that file produces the `VUE_APP_*` values, which `vite.config.js` injects into
`process.env` at build time through `define`. There is no `dotenv` / `loadEnv` / `.env.local` logic
anywhere in the repo, so edit `config/app.js` instead of creating a `.env` file.

```js
// config/app.js
const config = {
  active: 'cloud',   // backend target: cloud | lan | lan1 | docker
  targets: {         // apiBase, wsBase, assetBase, docBase, helpBase per environment
    cloud: { /* ... */ },
  },
  common: {          // map / analytics / MQTT / WeChat settings
    mapProvider: 'tianditu',   // tianditu | osm
    tiandituKey: '',           // never commit a real key
  },
}
```

`static/` is copied verbatim to `dist/static/` during the build. After deployment you can edit
`dist/static/config.js` to override **map-related settings** (non-empty values only) without
rebuilding. Backend endpoints and other values require editing `config/app.js` and rebuilding.

## Injected Variables

`process.env.*` keys read by the code, and where their values come from in `config/app.js`:

| Variable | Source in `config/app.js` |
|----------|---------------------------|
| `VUE_APP_API_BASE`, `VUE_APP_WS_BASE` | `targets[active].apiBase` / `wsBase` (dev API is fixed to the `/v1` proxy) |
| `VUE_APP_ASSET_BASE`, `VUE_APP_DOC_BASE`, `VUE_APP_HELP_BASE` | matching `targets[active]` fields |
| `VUE_APP_MAP_PROVIDER`, `VUE_APP_TIANDITU_KEY`, `VUE_APP_TILE_URL_TEMPLATE` | matching `common` fields |
| `VUE_APP_FENGMAP_IMG_BASE`, `VUE_APP_FENGMAP_MAP_URL`, `VUE_APP_FENGMAP_THEME_URL` | matching `common` fields |
| `VUE_APP_ENABLE_BAIDU_ANALYTICS`, `VUE_APP_BAIDU_HM_ID`, `VUE_APP_MQTT_BROKER_URL` | matching `common` fields |
| `VUE_APP_WECHAT_APPID`, `VUE_APP_WECHAT_SECRET` | matching `common` fields |

## Usage Guide

1. **Development**: Set `active` / `targets` / `common` in `config/app.js`, then run `npm run dev`.
2. **Production build**: Run `npm run build` (output in `dist/`).
3. **Deploy-time config**: Edit `dist/static/config.js` for map provider / Tianditu key.

## Important Notes

- `.env` and `.env.local` are **not read** by the build — always use `config/app.js`.
- Never commit Tianditu keys or WeChat secrets; prefer deploy-time `static/config.js` for keys.
- Baidu Analytics loads only when `VUE_APP_ENABLE_BAIDU_ANALYTICS` is true (set `common.enableBaiduAnalytics` in `config/app.js`).

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
location_web/
├── config/app.js        # Single runtime config entry (backend / maps / analytics / WeChat)
├── src/
│   ├── components/      # Reusable components
│   ├── views/           # Page components
│   ├── router/          # Vue Router 4
│   ├── store/           # Vuex 4
│   ├── axios/           # HTTP helpers
│   ├── i18n/            # i18n
│   ├── shims/           # Third-party adapters (fengmap, etc.)
│   └── assets/          # Static assets
├── public/              # Images / dashboard assets
├── scripts/             # Migration and helper scripts
├── static/              # Runtime static files (config.js, copied to dist/static at build)
├── vite.config.js
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) / [CONTRIBUTING_EN.md](CONTRIBUTING_EN.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Security

See [SECURITY.md](SECURITY.md) / [SECURITY_EN.md](SECURITY_EN.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) / [CODE_OF_CONDUCT_EN.md](CODE_OF_CONDUCT_EN.md).

## Backend Project

- **Backend Repository**: [https://github.com/ruictec/edwei](https://github.com/ruictec/edwei)
- **Description**: Backend for people and assets location management (smart badges, BLE beacons, GPS, UWB, etc.)

## Support

For technical support and questions, please contact the development team.

---

**Note**: The `main` branch is Vue 3.x + Vite. Use the `Tianditu` branch for the Vue 2.x legacy
version. The GitHub homepage renders this README.
