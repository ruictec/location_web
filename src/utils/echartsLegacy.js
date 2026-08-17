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

const patched = new Proxy(echarts, {
  get(target, prop, receiver) {
    if (prop === 'init') {
      return function (dom, theme, opts) {
        return originalInit(dom, theme || 'echarts4legacy', opts)
      }
    }
    return Reflect.get(target, prop, receiver)
  },
})

export default patched
