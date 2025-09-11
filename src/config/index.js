// 统一配置入口 - 从环境变量读取配置
export const API_BASE = process.env.VUE_APP_API_BASE
export const WS_BASE = process.env.VUE_APP_WS_BASE
export const ASSET_BASE = process.env.VUE_APP_ASSET_BASE
export const DOC_BASE = process.env.VUE_APP_DOC_BASE
export const HELP_BASE = process.env.VUE_APP_HELP_BASE
export const TILE_URL_TEMPLATE = process.env.VUE_APP_TILE_URL_TEMPLATE
export const FENGMAP_IMG_BASE = process.env.VUE_APP_FENGMAP_IMG_BASE
export const ENABLE_BAIDU_ANALYTICS = process.env.VUE_APP_ENABLE_BAIDU_ANALYTICS === 'true'
export const BAIDU_HM_ID = process.env.VUE_APP_BAIDU_HM_ID
export const MQTT_BROKER_URL = process.env.VUE_APP_MQTT_BROKER_URL
