import Text from 'ol/style/Text'
import Fill from 'ol/style/Fill'
import {
  createOutdoorBaseLayers,
  getOutdoorMarkerTextColor,
  getSavedTiandituStyle,
} from '../utils/mapSource'

export default {
  data() {
    return {
      mapBaseStyle: getSavedTiandituStyle(),
    }
  },
  methods: {
    getMarkerTextColor() {
      const isZh = this.$store.state.i18n === 'zh'
      return getOutdoorMarkerTextColor(this.mapBaseStyle, isZh)
    },

    getBuildingLabelColor(devnum = 0, assetnum = 0, tboxnum = 0) {
      const isEmpty =
        devnum == 0 &&
        assetnum == 0 &&
        (tboxnum == 0 || tboxnum == null)
      if (!isEmpty) {
        return 'red'
      }
      return this.getMarkerTextColor()
    },

    createMarkerText(text, offsetY = 10, font = '12px font-size') {
      return new Text({
        text: text || '',
        font,
        fill: new Fill({
          color: this.getMarkerTextColor(),
        }),
        offsetY,
      })
    },

    createBuildingLabelText(text, devnum = 0, assetnum = 0, tboxnum = 0, offsetY = 10, font = '12px font-size') {
      return new Text({
        text: text || '',
        font,
        fill: new Fill({
          color: this.getBuildingLabelColor(devnum, assetnum, tboxnum),
          backgroundColor: 'white',
        }),
        offsetY,
      })
    },

    refreshMarkerTextStyles() {
      if (!this.map) {
        return
      }
      const color = this.getMarkerTextColor()
      const updateStyleText = (style) => {
        if (!style) {
          return
        }
        const styleList = Array.isArray(style) ? style : [style]
        styleList.forEach((item) => {
          const text = item.getText && item.getText()
          if (text && text.getFill()) {
            const fillColor = text.getFill().getColor()
            if (fillColor === '#ffffff' || fillColor === '#fff' || fillColor === 'white') {
              text.getFill().setColor(color)
            }
          }
        })
      }

      this.map.getLayers().getArray().forEach((layer) => {
        if (layer.getStyle) {
          const layerStyle = layer.getStyle()
          if (layerStyle && typeof layerStyle !== 'function') {
            updateStyleText(layerStyle)
            layer.changed()
          }
        }
        const source = layer.getSource && layer.getSource()
        if (source && source.getFeatures) {
          source.getFeatures().forEach((feature) => {
            updateStyleText(feature.getStyle && feature.getStyle())
            feature.changed()
          })
        }
      })
    },

    onMapStyleChange(style) {
      this.mapBaseStyle = style
      const isZh = this.$store.state.i18n === 'zh'
      if (this.outdoorBaseLayers !== undefined) {
        this.outdoorBaseLayers = createOutdoorBaseLayers(isZh, style)
      }
      if (this.seeLayer !== undefined && Array.isArray(this.outdoorBaseLayers)) {
        this.seeLayer = this.outdoorBaseLayers
      }
      if (this.styleCache) {
        this.styleCache = {}
      }
      if (this.layerVetor) {
        this.layerVetor.changed()
      }
      this.refreshMarkerTextStyles()
    },
  },
}
