<template>
  <div
    v-if="visible"
    class="map-layer-switcher"
    :style="positionStyle"
  >
    <span class="map-layer-switcher__label">{{ $t("mapLayer.label") }}：{{ currentLabel }}</span>
    <el-select
      v-model="currentStyle"
      size="small"
      style="width: 110px"
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
    currentLabel() {
      const matched = this.styleOptions.find((item) => item.value === this.currentStyle)
      return matched ? matched.label : this.$t(`mapLayer.${this.currentStyle}`)
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
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
}

.map-layer-switcher__label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.map-layer-switcher :deep(.el-select) {
  width: 110px;
  min-width: 110px;
  flex-shrink: 0;
}

.map-layer-switcher :deep(.el-input),
.map-layer-switcher :deep(.el-input__wrapper),
.map-layer-switcher :deep(.el-input__inner),
.map-layer-switcher :deep(.el-select__wrapper) {
  width: 110px;
}

.map-layer-switcher :deep(.el-select__placeholder),
.map-layer-switcher :deep(.el-select__selected-item),
.map-layer-switcher :deep(.el-input__inner) {
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
