import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import requireTransform from 'vite-plugin-require-transform'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { resolveBackend, resolveAppEnv } = require('./config/app.js')
const staticDir = path.resolve(__dirname, 'static')
const fengmapDataDir = path.resolve(__dirname, 'data')
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
      if (fs.existsSync(fengmapDataDir)) {
        server.middlewares.use('/data', express.static(fengmapDataDir))
      }
      server.middlewares.use(serveFengmapBuild)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/static/fengmap', express.static(fengmapBuildDir))
      if (fs.existsSync(fengmapDataDir)) {
        server.middlewares.use('/data', express.static(fengmapDataDir))
      }
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
  const isProd = mode === 'production'
  // 统一配置入口：config/app.js
  const processEnv = {
    NODE_ENV: isProd ? 'production' : 'development',
    BASE_URL: isProd ? './' : '/',
    ...resolveAppEnv(mode),
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
  const backend = resolveBackend()
  const appEnv = resolveAppEnv(mode)
  const proxyTargetRaw = backend.apiProxy
  let proxyOrigin = proxyTargetRaw
  try {
    proxyOrigin = new URL(proxyTargetRaw).origin
  } catch (e) {}
  // eslint-disable-next-line no-console
  console.log(`[app] backend=${backend.active} (${backend.label}) → ${proxyTargetRaw}`)

  function normalizeProxyOrigin(target, fallback) {
    const raw = (target && String(target).trim()) || fallback
    try {
      return new URL(raw).origin
    } catch (e) {
      return String(raw).replace(/\/$/, '')
    }
  }
  const dataProxyTarget = normalizeProxyOrigin(
    appEnv.DATA_PROXY_TARGET,
    'https://location.rctiot.com'
  )

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
        },
        // 蜂鸟 3D 离线地图包（nginx 静态目录，与 :14001 API 无关）
        '/data': {
          target: dataProxyTarget,
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
