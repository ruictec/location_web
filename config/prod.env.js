'use strict'
const path = require('path')

// 本地生产构建时可从 .env.local 读取（该文件不会被 git 追踪）
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

function defineEnv(key, fallback) {
  const value = process.env[key]
  return value !== undefined && value !== ''
    ? JSON.stringify(value)
    : fallback
}

module.exports = {
  NODE_ENV: '"production"',
  // 生产环境配置（开源默认值，建议通过环境变量覆盖）
  // 说明：敏感配置请在部署/构建环境中注入，不要在仓库中写入真实值：
  // VUE_APP_TIANDITU_KEY, VUE_APP_WECHAT_APPID, VUE_APP_WECHAT_SECRET

  VUE_APP_API_BASE: '"https://location.rctiot.com:14001/v1"',
  VUE_APP_WS_BASE: '"wss://location.rctiot.com:14001/websocket"',
  // VUE_APP_API_BASE: '"http://192.168.2.30:14001/v1"',
  // VUE_APP_WS_BASE: '"ws://192.168.2.30:14001/websocket"',
  VUE_APP_ASSET_BASE: '"https://location.rctiot.com:8079"',
  VUE_APP_DOC_BASE: '"https://location.rctiot.com:8078"',
  VUE_APP_HELP_BASE: '"https://location.rctiot.com:8079"',
  VUE_APP_MAP_PROVIDER: '"tianditu"',
  VUE_APP_TIANDITU_KEY: defineEnv('VUE_APP_TIANDITU_KEY', '""'),
  VUE_APP_TILE_URL_TEMPLATE: '"https://www.edwei.cn:8443/osm/{z}/{x}/{y}.png"',
  VUE_APP_FENGMAP_IMG_BASE: '"https://developer.fengmap.com/fmAPI/images"',
  VUE_APP_ENABLE_BAIDU_ANALYTICS: '"false"',
  VUE_APP_BAIDU_HM_ID: '""',
  VUE_APP_MQTT_BROKER_URL: '"tcp://mqtt.example.com:1883"',

  // VUE_APP_API_BASE: '"/v1"',
  // VUE_APP_WS_BASE: '"/websocket"',
  // VUE_APP_ASSET_BASE: '"http://rct-zuul:8079"',
  // VUE_APP_DOC_BASE: '"http://rct-zuul:8078"',
  // VUE_APP_HELP_BASE: '"http://rct-zuul:8079"',
  // VUE_APP_TILE_URL_TEMPLATE: '"https://www.edwei.cn:8443/osm/{z}/{x}/{y}.png"',
  // VUE_APP_FENGMAP_IMG_BASE: '"https://developer.fengmap.com/fmAPI/images"',
  // VUE_APP_ENABLE_BAIDU_ANALYTICS: '"false"',
  // VUE_APP_BAIDU_HM_ID: '""',
  // VUE_APP_MQTT_BROKER_URL: '"tcp://mqtt.example.com:1883"',
}

