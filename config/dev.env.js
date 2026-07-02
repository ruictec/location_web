'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const path = require('path')

// 加载.env.local文件
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

// prod.env 中的值已是 webpack DefinePlugin 格式（含引号），不可再 JSON.stringify
function defineEnv(key) {
  const value = process.env[key]
  return value !== undefined && value !== ''
    ? JSON.stringify(value)
    : prodEnv[key]
}

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_API_BASE: defineEnv('VUE_APP_API_BASE'),
  VUE_APP_WS_BASE: defineEnv('VUE_APP_WS_BASE'),
  VUE_APP_ASSET_BASE: defineEnv('VUE_APP_ASSET_BASE'),
  VUE_APP_DOC_BASE: defineEnv('VUE_APP_DOC_BASE'),
  VUE_APP_HELP_BASE: defineEnv('VUE_APP_HELP_BASE'),
  VUE_APP_MAP_PROVIDER: defineEnv('VUE_APP_MAP_PROVIDER'),
  VUE_APP_TIANDITU_KEY: defineEnv('VUE_APP_TIANDITU_KEY'),
  VUE_APP_TILE_URL_TEMPLATE: defineEnv('VUE_APP_TILE_URL_TEMPLATE'),
  VUE_APP_FENGMAP_IMG_BASE: defineEnv('VUE_APP_FENGMAP_IMG_BASE'),
  VUE_APP_ENABLE_BAIDU_ANALYTICS: defineEnv('VUE_APP_ENABLE_BAIDU_ANALYTICS'),
  VUE_APP_BAIDU_HM_ID: defineEnv('VUE_APP_BAIDU_HM_ID'),
  VUE_APP_MQTT_BROKER_URL: defineEnv('VUE_APP_MQTT_BROKER_URL')
})
