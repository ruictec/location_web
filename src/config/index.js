// 统一配置入口
// 地图相关项支持双源：static/config.js（运行时外部）优先，非空则覆盖；否则用构建时环境变量

function pickConfig(key, fallback) {
  const runtime =
    typeof window !== 'undefined' && window.__RUNTIME_CONFIG__
      ? window.__RUNTIME_CONFIG__
      : {}
  const fromRuntime = runtime[key]
  if (fromRuntime !== undefined && fromRuntime !== null && String(fromRuntime).trim() !== '') {
    return String(fromRuntime).trim()
  }
  const fromEnv = process.env[key]
  if (fromEnv !== undefined && fromEnv !== null && String(fromEnv).trim() !== '') {
    return String(fromEnv).trim()
  }
  return fallback
}

export const API_BASE = process.env.VUE_APP_API_BASE
export const WS_BASE = process.env.VUE_APP_WS_BASE
export const ASSET_BASE = process.env.VUE_APP_ASSET_BASE
export const DOC_BASE = process.env.VUE_APP_DOC_BASE
export const HELP_BASE = process.env.VUE_APP_HELP_BASE
export const MAP_PROVIDER = pickConfig('VUE_APP_MAP_PROVIDER', 'osm')
export const TIANDITU_KEY = pickConfig('VUE_APP_TIANDITU_KEY', '')
export const TILE_URL_TEMPLATE = process.env.VUE_APP_TILE_URL_TEMPLATE
export const FENGMAP_IMG_BASE = process.env.VUE_APP_FENGMAP_IMG_BASE
export const ENABLE_BAIDU_ANALYTICS = process.env.VUE_APP_ENABLE_BAIDU_ANALYTICS === 'true'
export const BAIDU_HM_ID = process.env.VUE_APP_BAIDU_HM_ID
export const MQTT_BROKER_URL = process.env.VUE_APP_MQTT_BROKER_URL
