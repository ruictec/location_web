import { ensureFengmapScripts } from './loadScripts'

// 插件包作为副作用导入：触发同一套脚本加载链，避免 top-level await
ensureFengmapScripts().catch((err) => {
  console.error('[fengmap] failed to load plugin scripts', err)
})

export default typeof window !== 'undefined' ? window.fengmap : {}
