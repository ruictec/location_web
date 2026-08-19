<template>
  <section class="app-main">
    <router-view v-if="outletReady" :key="viewKey" />
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      outletReady: false
    }
  },
  computed: {
    viewKey() {
      // 用 fullPath 强制子页在路由切换时重建，避免从大屏返回后内层空白
      return (this.$route && this.$route.fullPath) || 'app-main'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.outletReady = true
    })
  }
}
</script>

<style lang="scss" scoped>
.app-main {
   height: 100vh !important;
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
   overflow-y: scroll !important;
   background-color: #f1f5f7
}
.app-main::-webkit-scrollbar {
   display: none; 
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
