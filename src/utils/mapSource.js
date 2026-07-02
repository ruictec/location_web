import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'

const MAP_PROVIDER = process.env.VUE_APP_MAP_PROVIDER || 'osm'
const TIANDITU_KEY = process.env.VUE_APP_TIANDITU_KEY || ''
const TILE_URL_TEMPLATE = process.env.VUE_APP_TILE_URL_TEMPLATE

function useTianditu(isZh) {
  return isZh && MAP_PROVIDER === 'tianditu' && TIANDITU_KEY
}

function tiandituXyzSource(type) {
  return new XYZ({
    url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=${type}&x={x}&y={y}&l={z}&tk=${TIANDITU_KEY}`,
    wrapX: true,
    maxZoom: 18,
    crossOrigin: '',
  })
}

/**
 * 创建室外地图底图图层（中文环境默认天地图，无 Key 时回退 OSM）
 * @param {boolean} isZh 是否为中文环境
 * @returns {import('ol/layer/Tile').default[]}
 */
export function createOutdoorBaseLayers(isZh) {
  if (useTianditu(isZh)) {
    return [
      new TileLayer({
        className: 'baseLayerClass',
        source: tiandituXyzSource('vec_w'),
        zIndex: 0,
      }),
      new TileLayer({
        source: tiandituXyzSource('cva_w'),
        zIndex: 1,
      }),
    ]
  }
  const source = isZh
    ? new OSM({ url: TILE_URL_TEMPLATE, crossOrigin: '' })
    : new OSM()
  return [
    new TileLayer({
      className: 'baseLayerClass',
      source,
    }),
  ]
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
