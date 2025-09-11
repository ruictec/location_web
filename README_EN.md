# Location Web Platform

A comprehensive location tracking and management platform built with Vue.js 2.x.

## 📋 Quick Navigation

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
- **Map Integration**: OpenLayers and Fengmap integration
- **Multi-language Support**: Chinese and English interface

## Technology Stack

- **Frontend**: Vue.js 2.x, Vue Router, Vuex
- **Build Tool**: Webpack 3.x
- **Maps**: OpenLayers, Fengmap
- **UI Framework**: Element UI
- **Charts**: ECharts
- **3D Visualization**: Three.js

## Quick Start

### Prerequisites

- Node.js >= 12.x
- npm >= 6.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd location_web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

#### Development Environment

Create a `.env.local` file in the project root:

```bash
# Development Environment Configuration
# Backend API and WebSocket addresses
VUE_APP_API_BASE=http://localhost:14001/v1
VUE_APP_WS_BASE=ws://localhost:14001/websocket

# Static resource addresses (role images, etc.)
VUE_APP_ASSET_BASE=http://localhost:8079

# Document addresses (Navbar.vue online documentation and FAQ)
VUE_APP_DOC_BASE=http://localhost:8078

# Help documentation addresses (Menu.vue help documentation)
VUE_APP_HELP_BASE=http://localhost:8079

# Map tile addresses
VUE_APP_TILE_URL_TEMPLATE=https://tile.openstreetmap.org/{z}/{x}/{y}.png

# Fengmap image resource addresses
VUE_APP_FENGMAP_IMG_BASE=https://developer.fengmap.com/fmAPI/images

# Baidu Analytics configuration (optional)
VUE_APP_ENABLE_BAIDU_ANALYTICS=false
VUE_APP_BAIDU_HM_ID=

# MQTT server address
VUE_APP_MQTT_BROKER_URL=tcp://mqtt.example.com:1883

# Development environment proxy target address
API_PROXY_TARGET=http://localhost:14001
```

#### Production Environment

Modify the addresses in `config/prod.env.js` or set server environment variables.

## Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| **Backend Service Addresses** | | |
| `VUE_APP_API_BASE` | `http://localhost:14001/v1` | Backend API base address for API calls, file uploads, etc. (corresponds to host.host) |
| `VUE_APP_WS_BASE` | `ws://localhost:14001/websocket` | WebSocket base address for real-time communication (corresponds to host.ws) |
| **Static Resource Addresses** | | |
| `VUE_APP_ASSET_BASE` | `http://localhost:8079` | Static resource/image base address for role images, etc. (e.g., role images in StaffManagement.vue) |
| `VUE_APP_DOC_BASE` | `http://localhost:8078` | Document/FAQ base address for Navbar.vue online documentation and FAQ |
| `VUE_APP_HELP_BASE` | `http://localhost:8079` | Help documentation base address for Menu.vue help documentation |
| **Map Service Addresses** | | |
| `VUE_APP_TILE_URL_TEMPLATE` | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | OSM tile URL template for OpenLayers map tile display |
| `VUE_APP_FENGMAP_IMG_BASE` | `https://developer.fengmap.com/fmAPI/images` | Fengmap example image base address for Fengmap-related image resources |
| **Analytics Configuration** | | |
| `VUE_APP_BAIDU_HM_ID` | `''` | Baidu Analytics HM ID (empty by default, configure when needed) |
| `VUE_APP_ENABLE_BAIDU_ANALYTICS` | `false` | Whether to enable Baidu Analytics (disabled by default) |
| **Other Services** | | |
| `VUE_APP_MQTT_BROKER_URL` | `tcp://mqtt.example.com:1883` | MQTT server address for data forwarding configuration |

### Internal Navigation Addresses

Project internal navigation addresses (such as beacon, project, terminal pages) are automatically generated based on the current access address and do not require configuration.

## Usage Guide

1. **Development Environment**: Create a `.env.local` file and fill in environment variable values according to actual deployment.
2. **Development**: Run `npm run dev` to use configurations from the `.env.local` file.
3. **Production Environment**: Modify addresses in `config/prod.env.js` or set server environment variables.
4. **Build**: Run `npm run build` to use configurations from `config/prod.env.js`.

## Important Notes

- `.env` and `.env.local` are included in `.gitignore` to prevent accidental commits.
- For production environments, please use your own domain/certificates to avoid bringing default values to production.
- Baidu Analytics only loads when `VUE_APP_ENABLE_BAIDU_ANALYTICS=true`, and HM ID can be overridden via `VUE_APP_BAIDU_HM_ID`.

## Proxy and Map Recommendations

- **Development Proxy**: The `/v1` route in `config/index.js` can point to a test gateway via `API_PROXY_TARGET`.
- **Map Tiles**: It's recommended to build your own OSM tiles or choose stable public services to avoid rate limiting from example addresses.
- **Fengmap Images**: Can be replaced with your own static resources for faster access.

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Build analysis
npm run build --report
```

## Project Structure

```
src/
├── components/          # Reusable components
├── views/              # Page components
├── router/             # Route configuration
├── store/              # Vuex state management
├── axios/              # HTTP request configuration
├── i18n/               # Internationalization
├── config/             # Configuration files
└── assets/             # Static resources
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md) / [CONTRIBUTING_EN.md](CONTRIBUTING_EN.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Security

For security issues, see [SECURITY.md](SECURITY.md) / [SECURITY_EN.md](SECURITY_EN.md).

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) / [CODE_OF_CONDUCT_EN.md](CODE_OF_CONDUCT_EN.md) for our community guidelines.

## Support

For technical support and questions, please contact the development team.
