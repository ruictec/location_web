'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const path = require('path')

// 加载.env.local文件
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 开发环境配置：使用 .env.local 文件中的配置
  // 如需自定义，请在 .env.local 文件中设置对应的环境变量
  VUE_APP_API_BASE: JSON.stringify(process.env.VUE_APP_API_BASE || prodEnv.VUE_APP_API_BASE),
  VUE_APP_WS_BASE: JSON.stringify(process.env.VUE_APP_WS_BASE || prodEnv.VUE_APP_WS_BASE),
  VUE_APP_ASSET_BASE: JSON.stringify(process.env.VUE_APP_ASSET_BASE || prodEnv.VUE_APP_ASSET_BASE),
  VUE_APP_DOC_BASE: JSON.stringify(process.env.VUE_APP_DOC_BASE || prodEnv.VUE_APP_DOC_BASE),
  VUE_APP_HELP_BASE: JSON.stringify(process.env.VUE_APP_HELP_BASE || prodEnv.VUE_APP_HELP_BASE),
  VUE_APP_TILE_URL_TEMPLATE: JSON.stringify(process.env.VUE_APP_TILE_URL_TEMPLATE || prodEnv.VUE_APP_TILE_URL_TEMPLATE),
  VUE_APP_FENGMAP_IMG_BASE: JSON.stringify(process.env.VUE_APP_FENGMAP_IMG_BASE || prodEnv.VUE_APP_FENGMAP_IMG_BASE),
  VUE_APP_ENABLE_BAIDU_ANALYTICS: JSON.stringify(process.env.VUE_APP_ENABLE_BAIDU_ANALYTICS || prodEnv.VUE_APP_ENABLE_BAIDU_ANALYTICS),
  VUE_APP_BAIDU_HM_ID: JSON.stringify(process.env.VUE_APP_BAIDU_HM_ID || prodEnv.VUE_APP_BAIDU_HM_ID),
  VUE_APP_MQTT_BROKER_URL: JSON.stringify(process.env.VUE_APP_MQTT_BROKER_URL || prodEnv.VUE_APP_MQTT_BROKER_URL)
})
