# Location Web Platform

[中文](README.md) | English

A location tracking and map management platform built with **Vue.js 3.x** (`Tianditu-vue3` branch).

## Branch Overview

| Branch | Description |
|--------|-------------|
| `main` | Main branch |
| `Tianditu` | Vue 2.x + Webpack + Tianditu maps |
| `Tianditu-vue3` | **Current**: Vue 3.x + Vite + Element Plus + Tianditu maps |

## Quick Navigation

- [🚀 Quick Start](#quick-start)
- [⚙️ Environment Variables](#environment-variables)
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

**This branch uses the Vue 3.x stack:**

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

- Node.js 16.20.2+ (recommended to use nvm; see `.nvmrc`)
- npm >= 8.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd location_web
git checkout Tianditu-vue3

# Install dependencies
npm install
# or if peer dependency conflicts occur:
npm run install:legacy

# Start development server
npm run dev
```

### Configuration

#### Development Environment

Create a `.env.local` file in the project root:

```bash
# Backend API and WebSocket
VUE_APP_API_BASE=http://localhost:14001/v1
VUE_APP_WS_BASE=ws://localhost:14001/websocket

# Static resources / docs
VUE_APP_ASSET_BASE=http://localhost:8079
VUE_APP_DOC_BASE=http://localhost:8078
VUE_APP_HELP_BASE=http://localhost:8079

# Maps
VUE_APP_MAP_PROVIDER=tianditu
VUE_APP_TILE_URL_TEMPLATE=https://tile.openstreetmap.org/{z}/{x}/{y}.png
VUE_APP_FENGMAP_IMG_BASE=https://developer.fengmap.com/fmAPI/images
VUE_APP_TIANDITU_KEY=

# Analytics / messaging
VUE_APP_ENABLE_BAIDU_ANALYTICS=false
VUE_APP_BAIDU_HM_ID=
VUE_APP_MQTT_BROKER_URL=tcp://mqtt.example.com:1883

# WeChat Mini Program (do NOT commit secrets)
VUE_APP_WECHAT_APPID=
VUE_APP_WECHAT_SECRET=
```

#### Production Environment

You can override map-related settings at deploy time via `dist/static/config.js` without rebuilding.

## Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| **Backend** | | |
| `VUE_APP_API_BASE` | `http://localhost:14001/v1` | Backend API base URL |
| `VUE_APP_WS_BASE` | `ws://localhost:14001/websocket` | WebSocket base URL |
| **Static / Docs** | | |
| `VUE_APP_ASSET_BASE` | `http://localhost:8079` | Static asset base URL |
| `VUE_APP_DOC_BASE` | `http://localhost:8078` | Docs / FAQ base URL |
| `VUE_APP_HELP_BASE` | `http://localhost:8079` | Help docs base URL |
| **Maps** | | |
| `VUE_APP_MAP_PROVIDER` | `tianditu` | Map provider (`tianditu` / `osm`) |
| `VUE_APP_TILE_URL_TEMPLATE` | OSM template | Tile URL template (OSM mode) |
| `VUE_APP_FENGMAP_IMG_BASE` | Fengmap CDN | Fengmap image base URL |
| `VUE_APP_TIANDITU_KEY` | `''` | Tianditu API key |
| **Other** | | |
| `VUE_APP_ENABLE_BAIDU_ANALYTICS` | `false` | Enable Baidu Analytics |
| `VUE_APP_BAIDU_HM_ID` | `''` | Baidu HM ID |
| `VUE_APP_MQTT_BROKER_URL` | example broker | MQTT broker URL |

## Usage Guide

1. **Development**: Create `.env.local` and run `npm run dev`.
2. **Production build**: Run `npm run build` (output in `dist/`).
3. **Deploy-time config**: Edit `dist/static/config.js` for map provider / Tianditu key.

## Important Notes

- `.env` and `.env.local` are gitignored — do not commit secrets.
- Prefer configuring Tianditu keys in deploy-time `static/config.js`.
- Baidu Analytics loads only when `VUE_APP_ENABLE_BAIDU_ANALYTICS=true`.

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
├── src/
│   ├── components/      # Reusable components
│   ├── views/           # Page components
│   ├── router/          # Vue Router 4
│   ├── store/           # Vuex 4
│   ├── axios/           # HTTP helpers
│   ├── i18n/            # i18n
│   ├── shims/           # Third-party adapters (fengmap, etc.)
│   └── assets/          # Static assets
├── static/              # Public static files (runtime config.js)
├── vite.config.js
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch from `Tianditu-vue3` (for Vue 3 work)
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

**Note**: The `Tianditu-vue3` branch is Vue 3.x + Vite. Use the `Tianditu` branch for Vue 2.x.
