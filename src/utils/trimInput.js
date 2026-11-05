/**
 * 全局去掉输入框首尾空格：失焦时写回，保证后续使用 / 提交的数据不含首尾空格。
 * 跳过：file / checkbox / radio / button 等非文本控件；带 data-no-trim 的节点。
 */

const SKIP_TYPES = new Set([
  'file',
  'checkbox',
  'radio',
  'button',
  'submit',
  'reset',
  'image',
  'range',
  'color',
  'hidden',
])

function shouldSkip(el) {
  if (!el || el.disabled) return true
  if (el.closest && el.closest('[data-no-trim]')) return true
  const tag = (el.tagName || '').toUpperCase()
  if (tag === 'TEXTAREA') return false
  if (tag !== 'INPUT') return true
  const type = (el.type || 'text').toLowerCase()
  return SKIP_TYPES.has(type)
}

function trimTarget(el) {
  if (shouldSkip(el)) return
  if (typeof el.value !== 'string') return
  const next = el.value.trim()
  if (next === el.value) return
  el.value = next
  // 触发 Vue / Element Plus 的 v-model 更新
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

export function installInputTrim() {
  if (typeof document === 'undefined') return
  if (document.__inputTrimInstalled) return
  document.__inputTrimInstalled = true
  document.addEventListener(
    'focusout',
    (e) => {
      trimTarget(e.target)
    },
    true
  )
}

/** 递归去掉对象 / 数组中字符串的首尾空格（供个别场景手动调用） */
export function trimStringsDeep(value) {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.map(trimStringsDeep)
  if (value && typeof value === 'object') {
    if (typeof FormData !== 'undefined' && value instanceof FormData) {
      const next = new FormData()
      value.forEach((v, k) => {
        next.append(k, typeof v === 'string' ? v.trim() : v)
      })
      return next
    }
    if (
      (typeof Blob !== 'undefined' && value instanceof Blob) ||
      (typeof File !== 'undefined' && value instanceof File) ||
      (typeof Date !== 'undefined' && value instanceof Date)
    ) {
      return value
    }
    const out = {}
    Object.keys(value).forEach((key) => {
      out[key] = trimStringsDeep(value[key])
    })
    return out
  }
  return value
}
