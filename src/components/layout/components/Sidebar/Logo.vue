<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/dashboard"> -->
      <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
      <!-- <h1 v-else class="sidebar-title">{{ title }} </h1> -->
      <!-- </router-link> -->
      <router-link
        v-if="!collapse"
        key="expand"
        class="sidebar-logo-link"
        to="/dashboard"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
import host from "../../../../host";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: "e定位-位置管理系统",
      logo: "",
    };
  },
  beforeMount() {
    // this.logo = host.host + "logo/" + this.$store.state.userInfo.filelogo;
    this.logo = this.$store.state.userInfo.filelogo
      ? host.host + "logo/" + this.$store.state.userInfo.filelogo
      : "../../../../../static/logouser.png";
  },
  computed: {
    changeLogo() {
      return this.$store.state.userInfo.filelogo;
    },
  },
  watch: {
    changeLogo() {
      this.logo = host.host + "logo/" + this.$store.state.userInfo.filelogo;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #252b3b;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 1px 3px rgb(0 21 41 / 4%);
  z-index: 1000;

  & .sidebar-logo-link {
    display: inline-block;
    height: 100%;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    & .sidebar-logo {
      width: 100%;
      height: 34px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: rgb(253, 253, 253);
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
