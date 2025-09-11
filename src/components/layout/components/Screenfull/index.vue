<template>
  <div @click="click">
    <el-tooltip
      class="item"
      effect="dark"
      :content="
        isFullscreen
          ? `${$t('navbar.Fullscreen1')}`
          : `${$t('navbar.Fullscreen')}`
      "
      placement="bottom"
    >
      <i
        :class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
        class="icon"
      />
    </el-tooltip>
  </div>
</template>

<script>
import screenfull from "screenfull";

export default {
  name: "Screenfull",
  data() {
    return {
      isFullscreen: false
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    click() {
      screenfull.toggle();
    },
    change() {
      this.$store.commit("changeScreen", screenfull.isFullscreen);
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      screenfull.on("change", this.change);
    },
    destroy() {
      screenfull.off("change", this.change);
    }
  }
};
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-color: #5a5e66;
}
.icon.fullscreen {
  mask: url("../../../../assets/fullscreen.svg");
  mask-size: contain;
}
.icon.exit-fullscreen {
  mask: url("../../../../assets/exit-fullscreen.svg");
  mask-size: contain;
}
</style>
