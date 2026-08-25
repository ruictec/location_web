import * as echarts from 'echarts'

/** ECharts 4 默认色板，保持与升级前饼图/柱状图颜色一致 */
export const ECHARTS4_COLORS = [
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
]

echarts.registerTheme('echarts4legacy', {
  color: ECHARTS4_COLORS,
})

const originalInit = echarts.init.bind(echarts)

/**
 * 不能用 Proxy 覆盖 echarts.init：
 * ESM 命名空间里 init 是只读且 non-configurable，Proxy get 返回不同值会在生产环境抛错：
 * "'get' on proxy: property 'init' is a read-only and non-configurable..."
 */
function patchedInit(dom, theme, opts = {}) {
  if (!dom) {
    return null
  }
  const exist = echarts.getInstanceByDom(dom)
  if (exist) {
    if (dom.clientWidth > 0 && dom.clientHeight > 0) {
      try {
        exist.resize()
      } catch (e) {}
    }
    return exist
  }
  const hasSize = dom.clientWidth > 0 && dom.clientHeight > 0
  // 容器尚未撑开时，优先使用调用方传入的宽高，不要强行建成 1x1（会导致图表“空白”）
  const width = hasSize
    ? opts.width
    : opts.width || Math.max(dom.offsetWidth || 0, 360)
  const height = hasSize
    ? opts.height
    : opts.height || Math.max(dom.offsetHeight || 0, 220)
  if (!hasSize) {
    dom.style.minWidth = (typeof width === 'number' ? width : 360) + 'px'
    dom.style.minHeight = (typeof height === 'number' ? height : 220) + 'px'
  }
  const instance = originalInit(dom, theme || 'echarts4legacy', {
    ...opts,
    ...(hasSize ? {} : { width, height }),
  })
  const resizeWhenReady = () => {
    try {
      if (!instance.isDisposed?.() && dom.clientWidth > 0 && dom.clientHeight > 0) {
        instance.resize()
      }
    } catch (e) {}
  }
  requestAnimationFrame(resizeWhenReady)
  setTimeout(resizeWhenReady, 120)
  setTimeout(resizeWhenReady, 360)
  return instance
}

const patched = {
  ...echarts,
  init: patchedInit,
}

export default patched
