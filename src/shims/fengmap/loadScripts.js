/** 以经典 script 加载 fengmap UMD，避免 Vite ESM 触发 require("fs") */
const SCRIPT_BASE = '/static/fengmap/'
const CACHE_BUST = 'v=classic-1'

const FENGMAP_SCRIPTS = [
  'fengmap.map.min.js',
  'fengmap.plugin.ui.min.js',
  'fengmap.analyser.min.js',
  'fengmap.plugin.navi.min.js',
  'fengmap.effect.min.js',
  'fengmap.plugin.markers.min.js',
  'fengmap.plugin.draw.min.js',
  'fengmap.plugin.location.min.js',
  'fengmap.plugin.export.min.js',
  'fengmap.plugin.layers.min.js',
  'fengmap.plugin.debug.min.js',
  'fengmap.plugins-compositemarker.min.js'
]

let loading = null

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-fengmap-src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === '1') return resolve()
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
        once: true
      })
      return
    }
    const el = document.createElement('script')
    el.src = src
    el.async = false
    el.dataset.fengmapSrc = src
    el.onload = () => {
      el.dataset.loaded = '1'
      resolve()
    }
    el.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(el)
  })
}

export function ensureFengmapScripts() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('fengmap requires browser'))
  }
  if (window.__fengmapScriptsLoaded && window.fengmap) {
    return Promise.resolve(window.fengmap)
  }
  if (loading) return loading

  if (typeof window.fs === 'undefined') {
    window.fs = {}
  }

  loading = FENGMAP_SCRIPTS.reduce(
    (chain, file) => chain.then(() => loadScript(`${SCRIPT_BASE}${file}?${CACHE_BUST}`)),
    Promise.resolve()
  ).then(() => {
    window.__fengmapScriptsLoaded = true
    if (!window.fengmap) {
      throw new Error('fengmap global missing after script load')
    }
    return window.fengmap
  })

  return loading
}
