import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import { MAP_PROVIDER, TIANDITU_KEY, TILE_URL_TEMPLATE } from '../config'

const STORAGE_KEY = 'location_web_tianditu_style'

export const TIANDITU_STYLE_OPTIONS = ['vec', 'img', 'ter']

// 天地图地形晕渲(ter)/地形注记(cta)只提供到 14 级：底图由 OpenLayers 放大 14 级瓦片显示，
// 注记若同样放大会糊成大字，故地形改用支持到 18 级的矢量注记(cva)
const TIANDITU_LAYER_TYPES = {
  vec: { base: 'vec_w', label: 'cva_w', baseMaxZoom: 18 },
  img: { base: 'img_w', label: 'cia_w', baseMaxZoom: 18 },
  ter: { base: 'ter_w', label: 'cva_w', baseMaxZoom: 14 },
}

function useTianditu(isZh) {
  return isZh && MAP_PROVIDER === 'tianditu' && TIANDITU_KEY
}

export function isTiandituMapAvailable(isZh) {
  return useTianditu(isZh)
}

export function getSavedTiandituStyle() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && TIANDITU_LAYER_TYPES[saved]) {
    return saved
  }
  return 'vec'
}

export function saveTiandituStyle(style) {
  if (TIANDITU_LAYER_TYPES[style]) {
    localStorage.setItem(STORAGE_KEY, style)
  }
}

function tiandituXyzSource(type, maxZoom = 18) {
  return new XYZ({
    url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=${type}&x={x}&y={y}&l={z}&tk=${TIANDITU_KEY}`,
    wrapX: true,
    maxZoom,
    crossOrigin: '',
  })
}

function markOutdoorBaseLayer(layer, isPrimary) {
  layer.set('isOutdoorBase', true)
  if (isPrimary) {
    layer.set('isOutdoorBasePrimary', true)
  }
}

function createTiandituLayers(style) {
  const styleKey = TIANDITU_LAYER_TYPES[style] ? style : 'vec'
  const layerTypes = TIANDITU_LAYER_TYPES[styleKey]
  const baseLayer = new TileLayer({
    // 第二个类名供大屏等页面按底图类型设置不同滤镜
    className: `baseLayerClass baseLayer-${styleKey}`,
    source: tiandituXyzSource(layerTypes.base, layerTypes.baseMaxZoom),
    zIndex: 0,
  })
  const labelLayer = new TileLayer({
    source: tiandituXyzSource(layerTypes.label),
    zIndex: 1,
  })
  markOutdoorBaseLayer(baseLayer, true)
  markOutdoorBaseLayer(labelLayer, false)
  return [baseLayer, labelLayer]
}

function createOsmLayers(isZh) {
  const source = isZh
    ? new OSM({ url: TILE_URL_TEMPLATE, crossOrigin: '' })
    : new OSM()
  const layer = new TileLayer({
    className: 'baseLayerClass',
    source,
  })
  markOutdoorBaseLayer(layer, true)
  return [layer]
}

export function getOutdoorMarkerTextColor(style, isZh) {
  const selectedStyle = style || getSavedTiandituStyle()
  if (!isTiandituMapAvailable(isZh) || selectedStyle === 'vec') {
    return '#303133'
  }
  return '#ffffff'
}

/**
 * 创建室外地图底图图层（中文环境默认天地图，无 Key 时回退 OSM）
 * @param {boolean} isZh 是否为中文环境
 * @param {string} [style] vec | img | ter
 * @returns {import('ol/layer/Tile').default[]}
 */
export function createOutdoorBaseLayers(isZh, style) {
  const selectedStyle = style || getSavedTiandituStyle()
  if (useTianditu(isZh)) {
    return createTiandituLayers(selectedStyle)
  }
  return createOsmLayers(isZh)
}

/**
 * 运行时切换地图底图样式（仅天地图可用）
 */
export function setMapBaseStyle(map, isZh, style) {
  if (!map || !useTianditu(isZh) || !TIANDITU_LAYER_TYPES[style]) {
    return
  }
  saveTiandituStyle(style)
  const layers = map.getLayers()
  const toRemove = []
  layers.forEach((layer) => {
    if (layer.get('isOutdoorBase')) {
      toRemove.push(layer)
    }
  })
  toRemove.forEach((layer) => layers.remove(layer))
  const newLayers = createTiandituLayers(style)
  newLayers.forEach((layer, index) => {
    layers.insertAt(index, layer)
  })
  refreshBaseTiles(map)
}

/** 视图变化后刷新瓦片底图（避免查询/缩放后底图不显示） */
export function refreshBaseTiles(map) {
  if (!map) return
  map.getLayers().getArray().forEach((layer) => {
    if (layer instanceof TileLayer) {
      const source = layer.getSource()
      if (source && source.refresh) {
        source.refresh()
      }
    }
  })
  map.render()
}
