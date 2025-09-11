<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    key() {
      return this.$route.path
    }
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

// .hasTagsView {
//   .app-main {
//     /* 84 = navbar + tags-view = 50 + 34 */
//     min-height: calc(100vh - 84px);
//   }

//   .fixed-header+.app-main {
//     padding-top: 84px;
//   }
// }
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.28s;
// }

// .fade-enter,
// .fade-leave-active {
//   opacity: 0;
// }

/* fade-transform */
// @keyframes fade {
//   0% {
//     opacity: 0;
//   transform: translateX(-30px);
//   };
//   100% {
//      opacity: 1;
//   transform: translateX(30px);
//   }
// }
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
