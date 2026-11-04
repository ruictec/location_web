<template>
  <div
    v-if="visible"
    class="map-layer-switcher"
    :class="{ 'is-en': $store.state.i18n !== 'zh' }"
    :style="positionStyle"
  >
    <span class="map-layer-switcher__label">{{ $t("mapLayer.label") }}</span>
    <el-select
      v-model="currentStyle"
      size="small"
      :placeholder="$t('mapLayer.label')"
      @change="handleChange"
    >
      <el-option
        v-for="item in styleOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
import {
  getSavedTiandituStyle,
  isTiandituMapAvailable,
  setMapBaseStyle,
  TIANDITU_STYLE_OPTIONS,
} from "../../utils/mapSource";

export default {
  name: "MapLayerSwitcher",
  props: {
    map: {
      default: null,
    },
    isZh: {
      type: Boolean,
      default: null,
    },
    top: {
      type: String,
      default: "",
    },
    right: {
      type: String,
      default: "10px",
    },
    bottom: {
      type: String,
      default: "",
    },
    left: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentStyle: getSavedTiandituStyle(),
    };
  },
  computed: {
    useZh() {
      return this.isZh !== null ? this.isZh : this.$store.state.i18n === "zh";
    },
    visible() {
      return isTiandituMapAvailable(this.useZh) && !!this.map;
    },
    styleOptions() {
      return TIANDITU_STYLE_OPTIONS.map((value) => ({
        value,
        label: this.$t(`mapLayer.${value}`),
      }));
    },
    positionStyle() {
      const style = {};
      if (this.top) style.top = this.top;
      if (this.right) style.right = this.right;
      if (this.bottom) style.bottom = this.bottom;
      if (this.left) style.left = this.left;
      if (!this.top && !this.bottom) style.top = "10px";
      return style;
    },
  },
  methods: {
    handleChange(style) {
      setMapBaseStyle(this.map, this.useZh, style);
      this.$emit("change", style);
    },
  },
};
</script>

<style scoped>
.map-layer-switcher {
  position: absolute;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 4px 6px 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
}

.map-layer-switcher__label {
  margin: 0;
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.map-layer-switcher :deep(.el-select) {
  width: 84px;
  margin: 0;
  flex-shrink: 0;
}

.map-layer-switcher.is-en :deep(.el-select) {
  width: 112px;
}

.map-layer-switcher :deep(.el-select__wrapper) {
  width: 100%;
}

.map-layer-switcher :deep(.el-select__placeholder),
.map-layer-switcher :deep(.el-select__selected-item) {
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
