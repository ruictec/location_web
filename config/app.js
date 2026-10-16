'use strict'

/**
 * 项目统一配置（本地开发 + 打包部署只改这一份）。
 *
 * 切换后端：改 active
 *   cloud  — 云端直连
 *   lan    — 局域网直连
 *   docker — Docker 部署（API/WS 相对路径，资源走 rct-zuul）
 *
 * 地图 / 统计 / MQTT / 微信等公共项在下方 common 中修改。
 * 部署后若不想重新打包，仍可改 dist/static/config.js 覆盖地图相关项（非空才生效）。
 */
const config = {
  // ---------- 后端环境：只改这一行 ----------
  active: 'cloud',

  targets: {
    cloud: {
      label: '云端',
      apiProxy: 'https://location.rctiot.com:14001/v1',
      apiBase: 'https://location.rctiot.com:14001/v1',
      wsBase: 'wss://location.rctiot.com:14001/websocket',
      assetBase: 'https://location.rctiot.com:8079',
      docBase: 'https://location.rctiot.com:8078',
      helpBase: 'https://location.rctiot.com:8079',
    },
    lan: {
      label: '局域网',
      apiProxy: 'http://192.168.1.11:14001/v1',
      apiBase: 'http://192.168.1.11:14001/v1',
      wsBase: 'ws://192.168.1.11:14001/websocket',
      assetBase: 'https://location.rctiot.com:8079',
      docBase: 'https://location.rctiot.com:8078',
      helpBase: 'https://location.rctiot.com:8079',
    },
    docker: {
      label: 'Docker部署',
      // 本地 npm run dev 时的代理目标（容器名本机解析不了）
      apiProxy: 'https://location.rctiot.com:14001/v1',
      apiBase: '/v1',
      wsBase: '/websocket',
      assetBase: 'http://rct-zuul:8079',
      docBase: 'http://rct-zuul:8078',
      helpBase: 'http://rct-zuul:8079',
    },
  },

  // ---------- 公共配置（与后端环境无关）----------
  common: {
    // 地图：tianditu | osm
    mapProvider: 'tianditu',
    // 天地图 Key：勿把真实值提交到仓库；本机填写或部署后改 dist/static/config.js
    tiandituKey: '',
    tileUrlTemplate: 'https://www.edwei.cn:8443/osm/{z}/{x}/{y}.png',
    fengmapImgBase: 'https://developer.fengmap.com/fmAPI/images',
    fengmapMapUrl: '',
    fengmapThemeUrl: '',
    // 开发时 /data 离线包代理（与 :14001 API 无关）
    dataProxyTarget: 'https://location.rctiot.com',

    enableBaiduAnalytics: false,
    baiduHmId: '',
    mqttBrokerUrl: 'tcp://mqtt.example.com:1883',

    wechatAppId: '',
    wechatSecret: '',
  },
}

function resolveBackend() {
  const target = config.targets[config.active]
  if (!target) {
    throw new Error(
      `[config/app.js] unknown active="${config.active}", use: ${Object.keys(config.targets).join(' | ')}`
    )
  }
  return {
    active: config.active,
    ...target,
  }
}

/** 合并当前后端 + 公共项，供 Vite / webpack 注入 process.env */
function resolveAppEnv(mode) {
  const backend = resolveBackend()
  const c = config.common
  const isProd = mode === 'production'
  return {
    BACKEND_TARGET: backend.active,
    API_PROXY_TARGET: backend.apiProxy,
    // 开发走相对路径 + 代理；打包写入 apiBase
    VUE_APP_API_BASE: isProd ? backend.apiBase : '/v1',
    VUE_APP_WS_BASE: backend.wsBase,
    VUE_APP_ASSET_BASE: backend.assetBase,
    VUE_APP_DOC_BASE: backend.docBase,
    VUE_APP_HELP_BASE: backend.helpBase,
    VUE_APP_MAP_PROVIDER: c.mapProvider,
    VUE_APP_TIANDITU_KEY: c.tiandituKey,
    VUE_APP_TILE_URL_TEMPLATE: c.tileUrlTemplate,
    VUE_APP_FENGMAP_IMG_BASE: c.fengmapImgBase,
    VUE_APP_FENGMAP_MAP_URL: c.fengmapMapUrl,
    VUE_APP_FENGMAP_THEME_URL: c.fengmapThemeUrl,
    VUE_APP_ENABLE_BAIDU_ANALYTICS: c.enableBaiduAnalytics ? 'true' : 'false',
    VUE_APP_BAIDU_HM_ID: c.baiduHmId,
    VUE_APP_MQTT_BROKER_URL: c.mqttBrokerUrl,
    VUE_APP_WECHAT_APPID: c.wechatAppId,
    VUE_APP_WECHAT_SECRET: c.wechatSecret,
    DATA_PROXY_TARGET: c.dataProxyTarget,
  }
}

module.exports = config
module.exports.resolveBackend = resolveBackend
module.exports.resolveAppEnv = resolveAppEnv
