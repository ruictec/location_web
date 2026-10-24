import { ref } from 'vue'

/** 相对 1920 设计稿的缩放比（与 flexible rem/192 一致） */
export const uiScale = ref(1)

export function setUiScale(scale) {
  const s = Number(scale)
  if (!Number.isFinite(s) || s <= 0) return
  uiScale.value = Math.round(s * 10000) / 10000
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--ui-scale', String(uiScale.value))
  }
}

/**
 * 缩放 Element 上以 px / 无单位数字表示的尺寸；百分比、calc、var 原样返回。
 * 无单位数字保持 number（表格列宽需要）。
 */
export function scaleCssSize(val, scale = uiScale.value) {
  if (val == null || val === '') return val
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val * scale : val
  }
  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (
      !trimmed ||
      trimmed.endsWith('%') ||
      trimmed.startsWith('var(') ||
      trimmed.includes('calc(') ||
      trimmed.includes('vw') ||
      trimmed.includes('vh') ||
      trimmed.includes('rem') ||
      trimmed.includes('em')
    ) {
      return val
    }
    const m = trimmed.match(/^(-?\d+(?:\.\d+)?)(px)?$/i)
    if (m) {
      const n = parseFloat(m[1]) * scale
      return m[2] ? `${n}px` : n
    }
    return val
  }
  return val
}
