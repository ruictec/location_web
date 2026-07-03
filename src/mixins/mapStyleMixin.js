import { createOutdoorBaseLayers } from '../utils/mapSource'

export default {
  methods: {
    onMapStyleChange(style) {
      const isZh = this.$store.state.i18n === 'zh'
      if (this.outdoorBaseLayers !== undefined) {
        this.outdoorBaseLayers = createOutdoorBaseLayers(isZh, style)
      }
      if (this.seeLayer !== undefined && Array.isArray(this.outdoorBaseLayers)) {
        this.seeLayer = this.outdoorBaseLayers
      }
    },
  },
}
