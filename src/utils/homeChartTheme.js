import echarts from './echartsLegacy'

// 首页图表共用配色：c1 为深色端、c2 为浅色端，rgb 用于阴影/透明度
export const CHART_TONES = {
  green: { c1: '#059669', c2: '#34D399', rgb: '16,185,129' },
  yellow: { c1: '#D97706', c2: '#FCD34D', rgb: '245,158,11' },
  red: { c1: '#DC2626', c2: '#F87171', rgb: '239,68,68' },
  blue: { c1: '#2F7BFF', c2: '#22D3EE', rgb: '47,123,255' },
  purple: { c1: '#7C3AED', c2: '#A78BFA', rgb: '139,92,246' },
  pink: { c1: '#DB2777', c2: '#F472B6', rgb: '236,72,153' },
  teal: { c1: '#0D9488', c2: '#5EEAD4', rgb: '20,184,166' },
  indigo: { c1: '#4338CA', c2: '#818CF8', rgb: '99,102,241' },
  orange: { c1: '#EA580C', c2: '#FDBA74', rgb: '249,115,22' },
  cyan: { c1: '#0891B2', c2: '#67E8F9', rgb: '6,182,212' },
  lime: { c1: '#65A30D', c2: '#BEF264', rgb: '132,204,22' },
  slate: { c1: '#475569', c2: '#94A3B8', rgb: '100,116,139' },
  gray: { c1: '#94A3B8', c2: '#CBD5E1', rgb: '148,163,184' },
}

// 类别较多（如项目类型）时按顺序取色
export const CHART_PALETTE = [
  CHART_TONES.blue,
  CHART_TONES.purple,
  CHART_TONES.teal,
  CHART_TONES.orange,
  CHART_TONES.pink,
  CHART_TONES.lime,
  CHART_TONES.indigo,
  CHART_TONES.yellow,
  CHART_TONES.cyan,
  CHART_TONES.red,
  CHART_TONES.green,
  CHART_TONES.slate,
]

export function chartGradient(tone, x = 0, y = 0, x2 = 1, y2 = 1) {
  return new echarts.graphic.LinearGradient(x, y, x2, y2, [
    { offset: 0, color: tone.c2 },
    { offset: 1, color: tone.c1 },
  ])
}

export function toneItemStyle(tone, glow = 8) {
  return {
    color: chartGradient(tone),
    shadowBlur: glow,
    shadowColor: `rgba(${tone.rgb},0.4)`,
  }
}

const LEGEND_TEXT = { color: '#64748b', fontSize: 12 }

export function ringLegend(extra = {}) {
  return {
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 10,
    textStyle: LEGEND_TEXT,
    pageIconColor: '#2F7BFF',
    pageIconInactiveColor: '#cbd5e1',
    pageIconSize: 10,
    pageTextStyle: { color: '#94a3b8' },
    ...extra,
  }
}

/**
 * 双层环形图：inner / outer 为 [{ name, value, tone, ...其余字段原样保留 }]
 * centerValue 不为空时在圆心显示数值 + centerLabel
 */
export function buildDualRingOption({ inner = [], outer = [], center = ['50%', '50%'], centerValue, centerLabel, legend }) {
  const toItems = (list) =>
    (Array.isArray(list) ? list : []).map((d) => ({
      ...d,
      value: Number(d.value) || 0,
      itemStyle: toneItemStyle(d.tone || CHART_TONES.gray),
    }))
  const innerItems = toItems(inner)
  const outerItems = toItems(outer)
  const padOf = (items) => (items.filter((d) => d.value > 0).length > 1 ? 2 : 0)
  const series = [
    {
      type: 'pie',
      silent: true,
      center,
      radius: [0, '30%'],
      label: centerValue == null
        ? { show: false }
        : {
            show: true,
            position: 'center',
            lineHeight: 16,
            formatter: () => `{v|${centerValue}}\n{t|${centerLabel || ''}}`,
            rich: {
              v: { fontSize: 18, fontWeight: 700, color: '#1f2937', fontFamily: 'DIN Alternate, Arial' },
              t: { fontSize: 11, color: '#8a94a6', padding: [3, 0, 0, 0] },
            },
          },
      labelLine: { show: false },
      itemStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
          { offset: 0, color: 'rgba(47,123,255,0.12)' },
          { offset: 1, color: 'rgba(47,123,255,0)' },
        ]),
      },
      data: [{ value: 1 }],
    },
    {
      type: 'pie',
      center,
      radius: ['34%', '44%'],
      padAngle: padOf(innerItems),
      itemStyle: { borderRadius: 4 },
      label: { show: false },
      labelLine: { show: false },
      emphasis: { scaleSize: 4 },
      data: innerItems,
    },
    {
      type: 'pie',
      center,
      radius: ['52%', '66%'],
      padAngle: padOf(outerItems),
      minAngle: 3,
      itemStyle: { borderRadius: 6 },
      label: { show: false },
      labelLine: { show: false },
      emphasis: { scaleSize: 5 },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      data: outerItems,
    },
    {
      type: 'gauge',
      silent: true,
      center,
      radius: '74%',
      startAngle: 90,
      endAngle: -270,
      splitNumber: 12,
      pointer: { show: false },
      progress: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
      detail: { show: false },
      splitLine: { distance: 0, length: 3, lineStyle: { color: 'rgba(100,116,139,0.45)', width: 2 } },
      axisTick: { distance: 0, length: 2, splitNumber: 5, lineStyle: { color: 'rgba(148,163,184,0.4)', width: 1 } },
      data: [],
    },
  ]
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (p) => (p.seriesType === 'pie' && p.name ? `${p.marker}${p.name}：${p.value}（${p.percent}%）` : ''),
    },
    legend: ringLegend({ data: [...innerItems, ...outerItems].map((d) => d.name), ...legend }),
    series,
  }
}

/** 胶囊底槽 + 渐变柱：data 为 [{ name, value, tone }] */
export function buildCapsuleBarOption(data, { rotate = 0, labelWidth, grid } = {}) {
  const list = Array.isArray(data) ? data : []
  return {
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.marker}${p.name}：${p.value}`,
    },
    grid: { left: 4, right: 8, top: 24, bottom: 4, containLabel: true, ...grid },
    xAxis: {
      type: 'category',
      data: list.map((d) => d.name),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        rotate,
        color: '#64748b',
        fontSize: 11,
        lineHeight: 13,
        ...(labelWidth ? { width: labelWidth, overflow: 'break' } : {}),
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#eef2f7', type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: '42%',
        showBackground: true,
        backgroundStyle: { color: 'rgba(148,163,184,0.12)', borderRadius: [8, 8, 3, 3] },
        label: {
          show: true,
          position: 'top',
          distance: 4,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'DIN Alternate, Arial',
        },
        emphasis: { itemStyle: { shadowBlur: 14 } },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDelay: (idx) => idx * 70,
        data: list.map((d) => {
          const tone = d.tone || CHART_TONES.blue
          return {
            value: Number(d.value) || 0,
            itemStyle: {
              borderRadius: [8, 8, 3, 3],
              color: chartGradient(tone, 0, 0, 0, 1),
              shadowBlur: 8,
              shadowColor: `rgba(${tone.rgb},0.4)`,
              shadowOffsetY: 2,
            },
            label: { color: tone.c1 },
          }
        }),
      },
    ],
  }
}
