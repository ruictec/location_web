import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import requireTransform from 'vite-plugin-require-transform'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const staticDir = path.resolve(__dirname, 'static')
const fengmapBuildDir = path.resolve(__dirname, 'node_modules/fengmap/build')
const fengmapDracoFiles = new Set([
  'draco_decoder.js',
  'draco_decoder.wasm',
  'draco_wasm_wrapper.js'
])

function serveFengmapBuild(req, res, next) {
  const url = (req.url || '').split('?')[0]
  const fileName = path.basename(url)
  if (!fengmapDracoFiles.has(fileName)) {
    return next()
  }
  if (url !== `/${fileName}` && url !== `/static/fengmap/${fileName}`) {
    return next()
  }
  req.url = `/${fileName}`
  return express.static(fengmapBuildDir)(req, res, next)
}

function fengmapAliasPlugin() {
  const coreShim = path.resolve(__dirname, 'src/shims/fengmap/core.js')
  const pluginShim = path.resolve(__dirname, 'src/shims/fengmap/plugin.js')
  return {
    name: 'fengmap-classic-script-alias',
    enforce: 'pre',
    resolveId(id) {
      const bare = id.split('?')[0].replace(/\\/g, '/').replace(/\.js$/, '')
      if (bare === 'fengmap/build/fengmap.map.min') {
        return coreShim
      }
      // 其余 fengmap JS 包改为走经典 script 加载，避免 ESM 下 require("fs")
      if (
        bare.startsWith('fengmap/build/') &&
        !bare.endsWith('.css') &&
        !bare.endsWith('.wasm') &&
        bare.includes('fengmap.')
      ) {
        return pluginShim
      }
      return null
    }
  }
}

function fengmapStaticPlugin() {
  return {
    name: 'fengmap-static',
    configureServer(server) {
      server.middlewares.use('/static/fengmap', express.static(fengmapBuildDir))
      server.middlewares.use(serveFengmapBuild)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/static/fengmap', express.static(fengmapBuildDir))
      server.middlewares.use(serveFengmapBuild)
    },
    writeBundle(options) {
      const outDir = options.dir || path.resolve(__dirname, 'dist')
      const dest = path.join(outDir, 'static', 'fengmap')
      fs.mkdirSync(dest, { recursive: true })
      fs.cpSync(fengmapBuildDir, dest, { recursive: true })
    }
  }
}

function legacyStaticPlugin() {
  return {
    name: 'legacy-static-dir',
    configureServer(server) {
      server.middlewares.use('/static', express.static(staticDir))
    },
    writeBundle(options) {
      const outDir = options.dir || path.resolve(__dirname, 'dist')
      const dest = path.join(outDir, 'static')
      fs.mkdirSync(dest, { recursive: true })
      fs.cpSync(staticDir, dest, { recursive: true })
    }
  }
}

function buildProcessEnvDefines(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'
  const processEnv = {
    NODE_ENV: isProd ? 'production' : 'development',
    BASE_URL: isProd ? './' : '/',
    VUE_APP_API_BASE: env.VUE_APP_API_BASE || (isProd ? 'https://location.rctiot.com:14001/v1' : '/v1'),
    VUE_APP_WS_BASE: env.VUE_APP_WS_BASE || 'wss://location.rctiot.com:14001/websocket',
    VUE_APP_ASSET_BASE: env.VUE_APP_ASSET_BASE || 'https://location.rctiot.com:8079',
    VUE_APP_DOC_BASE: env.VUE_APP_DOC_BASE || 'https://location.rctiot.com:8078',
    VUE_APP_HELP_BASE: env.VUE_APP_HELP_BASE || 'https://location.rctiot.com:8079',
    VUE_APP_MAP_PROVIDER: env.VUE_APP_MAP_PROVIDER || 'tianditu',
    VUE_APP_TIANDITU_KEY: env.VUE_APP_TIANDITU_KEY || '',
    VUE_APP_TILE_URL_TEMPLATE: env.VUE_APP_TILE_URL_TEMPLATE || 'https://www.edwei.cn:8443/osm/{z}/{x}/{y}.png',
    VUE_APP_FENGMAP_IMG_BASE: env.VUE_APP_FENGMAP_IMG_BASE || 'https://developer.fengmap.com/fmAPI/images',
    VUE_APP_ENABLE_BAIDU_ANALYTICS: env.VUE_APP_ENABLE_BAIDU_ANALYTICS || 'false',
    VUE_APP_BAIDU_HM_ID: env.VUE_APP_BAIDU_HM_ID || '',
    VUE_APP_MQTT_BROKER_URL: env.VUE_APP_MQTT_BROKER_URL || '',
    VUE_APP_WECHAT_APPID: env.VUE_APP_WECHAT_APPID || '',
    VUE_APP_WECHAT_SECRET: env.VUE_APP_WECHAT_SECRET || '',
    API_PROXY_TARGET: env.API_PROXY_TARGET || ''
  }
  const defines = {
    'process.env': JSON.stringify(processEnv),
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false
  }
  for (const [key, value] of Object.entries(processEnv)) {
    defines[`process.env.${key}`] = JSON.stringify(value)
  }
  return defines
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTargetRaw = env.API_PROXY_TARGET || 'https://location.rctiot.com:14001/v1'
  let proxyOrigin = proxyTargetRaw
  try {
    proxyOrigin = new URL(proxyTargetRaw).origin
  } catch (e) {}

  return {
    base: mode === 'production' ? './' : '/',
    publicDir: false,
    plugins: [
      vue(),
      requireTransform({
        // 只转换业务源码。匹配全部 .js 会把 fengmap 的数 MB SDK 丢给 Babel，请求会一直 pending
        fileRegex: /\/src\/.*\.(js|vue)$/
      }),
      fengmapAliasPlugin(),
      fengmapStaticPlugin(),
      legacyStaticPlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vendor: path.resolve(__dirname, 'src/vendor'),
        pbf: path.resolve(__dirname, 'node_modules/pbf/dist/pbf.js')
      },
      extensions: ['.js', '.vue', '.json']
    },
    define: buildProcessEnvDefines(mode),
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api', 'import', 'mixed-decls', 'bogus-combinators']
        }
      }
    },
    assetsInclude: ['**/*.wasm'],
    optimizeDeps: {
      exclude: ['fengmap'],
      include: [
        'vue',
        'vue-router',
        'vuex',
        'vue-i18n',
        'element-plus',
        'axios',
        'jquery',
        'echarts',
        'ol',
        'pbf',
        'xlsx',
        'mitt'
      ]
    },
    server: {
      host: true,
      port: 8080,
      open: true,
      proxy: {
        '/apiTWO': {
          target: 'https://api.weixin.qq.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/apiTWO/, '')
        },
        '/v1': {
          target: proxyOrigin,
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 4000,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    }
  }
})
