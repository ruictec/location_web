import { ensureFengmapScripts } from './loadScripts'

// 启动加载，但不使用 top-level await（打包目标不支持）
ensureFengmapScripts().catch((err) => {
  console.error('[fengmap] failed to load core scripts', err)
})

function createFengmapProxy() {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === '__esModule') return false
        if (prop === 'default') return createFengmapProxy()
        // 避免被当成 Promise
        if (prop === 'then') return undefined

        const fm = typeof window !== 'undefined' ? window.fengmap : null
        if (!fm) {
          ensureFengmapScripts()
          throw new Error(
            'fengmap is not ready yet; scripts are still loading'
          )
        }
        const value = fm[prop]
        return typeof value === 'function' ? value.bind(fm) : value
      },
      has(_target, prop) {
        return !!(window.fengmap && prop in window.fengmap)
      },
      ownKeys() {
        return window.fengmap ? Reflect.ownKeys(window.fengmap) : []
      },
      getOwnPropertyDescriptor(_target, prop) {
        if (!window.fengmap) return undefined
        const desc = Object.getOwnPropertyDescriptor(window.fengmap, prop)
        if (desc) desc.configurable = true
        return desc
      }
    }
  )
}

const fengmap = createFengmapProxy()
export default fengmap
