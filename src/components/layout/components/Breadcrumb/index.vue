<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- <span class="images_div">
      <el-tooltip
        class="item"
        effect="dark"
        content="告警信息页面"
        placement="bottom"
      >
        <el-image
          class="images"
          style="width: 32px; height: 32px"
          :src="warning"
          @click="goLink('warning')"
        ></el-image>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="行为分析页面"
        placement="bottom"
      >
        <el-image
          class="images"
          style="width: 32px; height: 32px"
          :src="trajectory"
          @click="goLink('trajectory')"
        ></el-image>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="室内定位页面"
        placement="bottom"
      >
        <el-image
          class="images"
          style="width: 32px; height: 32px"
          :src="indoor"
          @click="goLink('indoor')"
        ></el-image>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="室外定位页面"
        placement="bottom"
      >
        <el-image
          class="images"
          style="width: 32px; height: 32px"
          :src="outdoor"
          @click="goLink('outdoor')"
        ></el-image>
      </el-tooltip>
    </span> -->

    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ $t(item.meta.title) }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{
          $t(item.meta.title)
        }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from "path-to-regexp";

export default {
  data() {
    return {
      levelList: null,
      warning: "../../../../../static/warning.png",
      trajectory: "../../../../../static/trajectory.png",
      indoor: "../../../../../static/trajectory.png",
      outdoor: "../../../../../static/trajectory.png"
    };
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb();
    },
      "$i18n.locale"() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    goLink(value) {
      switch (value) {
        case "warning":
          this.$router.push({ path: "/warningu/index" });
          break;
        case "trajectory":
          this.$router.push({ path: "/staff/staffmanagement" });
          break;
        case "indoor":
          this.$router.push({ path: "/location/indoor/locationindoor" });
          break;
        case "outdoor":
          this.$router.push({ path: "/location/outdoor/locationoutdoor" });
          break;
        default:
          break;
      }
    },
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      const first = matched[0];

      if (!this.isDashboard(first)) {
        matched = [
          {
            path: "/dashboard",
            meta: { title: this.$t("Breadcrumb.homepage") }
          }
        ].concat(matched);
      }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === "首页".toLocaleLowerCase();
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      // this.$router.push(this.pathCompile(path))
      this.$router.push(path);
    }
  },
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
.images {
  cursor: pointer;
  margin-left: 10px;
  vertical-align: middle;
}
</style>
