'use strict'
module.exports = {
  NODE_ENV: '"production"',
  // 生产环境配置（开源默认值，建议通过环境变量覆盖）
  // 说明：如需启用微信小程序跳转，请在部署环境中以环境变量方式注入：
  // VUE_APP_WECHAT_APPID, VUE_APP_WECHAT_SECRET（不要在仓库中写入默认值）

  VUE_APP_API_BASE: '"http://localhost:14001/v1"',
  VUE_APP_WS_BASE: '"ws://localhost:14001/websocket"',
  VUE_APP_ASSET_BASE: '"http://localhost:8079"',
  VUE_APP_DOC_BASE: '"http://localhost:8078"',
  VUE_APP_HELP_BASE: '"http://localhost:8079"',
  VUE_APP_TILE_URL_TEMPLATE: '"https://tile.openstreetmap.org/{z}/{x}/{y}.png"',
  VUE_APP_FENGMAP_IMG_BASE: '"https://developer.fengmap.com/fmAPI/images"',
  VUE_APP_ENABLE_BAIDU_ANALYTICS: '"false"',
  VUE_APP_BAIDU_HM_ID: '""',
  VUE_APP_MQTT_BROKER_URL: '"tcp://mqtt.example.com:1883"',
}

