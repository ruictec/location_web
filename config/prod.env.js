'use strict'
module.exports = {
  NODE_ENV: '"production"',
  // 生产环境配置（开源默认值，建议通过环境变量覆盖）
  VUE_APP_API_BASE: '"http://rct-zuul:14001/v1"',
  VUE_APP_WS_BASE: '"ws://rct-zuul:14001/websocket"',
  VUE_APP_ASSET_BASE: '"https://location.rctiot.com:8079"',
  VUE_APP_DOC_BASE: '"https://location.rctiot.com:8078"',
  VUE_APP_HELP_BASE: '"https://location.rctiot.com:8079"',
  VUE_APP_TILE_URL_TEMPLATE: '"https://www.edwei.cn:8443/osm/{z}/{x}/{y}.png"',
  VUE_APP_FENGMAP_IMG_BASE: '"https://developer.fengmap.com/fmAPI/images"',
  VUE_APP_ENABLE_BAIDU_ANALYTICS: '"false"',
  VUE_APP_BAIDU_HM_ID: '""',
  VUE_APP_MQTT_BROKER_URL: '"tcp://mqtt.example.com:1883"',


  // VUE_APP_API_BASE: '"http://localhost:14001/v1"',
  // VUE_APP_WS_BASE: '"ws://localhost:14001/websocket"',
  // VUE_APP_ASSET_BASE: '"http://localhost:8079"',
  // VUE_APP_DOC_BASE: '"http://localhost:8078"',
  // VUE_APP_HELP_BASE: '"http://localhost:8079"',
  // VUE_APP_TILE_URL_TEMPLATE: '"https://tile.openstreetmap.org/{z}/{x}/{y}.png"',
  // VUE_APP_FENGMAP_IMG_BASE: '"https://developer.fengmap.com/fmAPI/images"',
  // VUE_APP_ENABLE_BAIDU_ANALYTICS: '"false"',
  // VUE_APP_BAIDU_HM_ID: '""',
  // VUE_APP_MQTT_BROKER_URL: '"tcp://mqtt.example.com:1883"',
}

