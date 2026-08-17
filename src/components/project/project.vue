<template>
  <div :class="changeBox ? 'box' : 'box1'">
    <el-button
      :class="btnChange ? 'changeBtn1' : 'changeBtn'"
      @click="changeIcon()"
    >
      <i :class="iconData"></i>
    </el-button>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="activeName"
      mode="vertical"
      :router="true"
    >
      <el-menu-item
        index="/mapmanagement"
        :class="{ left: show }"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4 || maprio == 1"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Mapmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon map"></i>
        </el-tooltip>
        <span v-show="show">{{
          $t("Breadcrumb.Mapmanagement")
        }}</span>
      </el-menu-item>

      <el-menu-item
        index="/buildingmanagement"
        :class="{ left: show }"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4 || maprio == 1"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Buildingmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon tower"></i>
        </el-tooltip>
        <span v-show="show">{{
          $t("Breadcrumb.Buildingmanagement")
        }}</span>
      </el-menu-item>
      <el-menu-item
        index="/floormanagement"
        :class="{ left: show }"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4 || maprio == 1"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Floormanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon tier"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Floormanagement") }}</span>
        <el-tooltip
          class="item menu-item-help"
          effect="light"
          placement="right-start"
          v-if="show"
        >
          <template #content><div>
            <p>{{ $t("Breadcrumb.tet") }}</p>
          </div></template>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>

      <el-menu-item
        index="/buildingdetails"
        :class="{ left: show }"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Floordetails')"
          placement="right"
          :disabled="open"
        >
          <i class="icon detail"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Floordetails") }}</span>
        <el-tooltip
          class="item menu-item-help"
          effect="light"
          placement="right-start"
          v-if="show"
        >
          <template #content><div>
            <p>{{ $t("Breadcrumb.tet1") }}</p>
          </div></template>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
      <el-menu-item
        index="/outdoor/locationoutdoor"
        :class="{ left: show, 'is-active': isActiveClass == 'locationoutdoor' }"
        @click="changeActiveName()"
        v-if="contrForPrioNum == 5 && projectType == 1"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Outdoorpositioning')"
          placement="right"
          :disabled="open"
          ref="outdoor"
        >
          <i class="icon outdoor"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Outdoorpositioning") }}</span>
      </el-menu-item>

      <el-menu-item
        index="/indoor/locationindoor"
        :class="{ left: show, 'is-active': isActiveClass == 'locationindoor' }"
        @click="changeActiveName2()"
        v-if="contrForPrioNum == 5"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Indoorpositioning')"
          placement="right"
          :disabled="open"
          ref="indoor"
        >
          <i class="icon indoor"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Indoorpositioning") }}</span>
      </el-menu-item>
      <el-menu-item
        index="/location"
        :class="{ left: show }"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Locationdata')"
          placement="right"
          :disabled="open"
        >
          <i class="el-icon-data-board menu-side-icon"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Locationdata") }}</span>
      </el-menu-item>
      <el-menu-item
        index="/config"
        :class="{ left: show }"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Config')"
          placement="right"
          :disabled="open"
        >
          <i class="el-icon-setting menu-side-icon"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Config") }}</span>
        <el-tooltip
          class="item menu-item-help"
          effect="light"
          placement="right-start"
          v-if="show"
        >
          <template #content><div>
            <p>{{ $t("Breadcrumb.tet2") }}</p>
          </div></template>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Project",
  data() {
    return {
      contrForPrioNum: this.$store.state.userInfo.prionum,
      maprio: this.$store.state.userInfo.maprio,
      projectType: this.$store.state.intoProjectType,
      isCollapse: false,
      iconData: "",
      show: this.$store.state.show,
      btnChange: "",
      changeBox: "",
      open: "",
      activeName: this.$route.path,

      isActiveClass: "",
    };
  },
  methods: {
    changeActiveName() {
      this.$store.commit("changeActiveName", "location");
    },
    changeActiveName2() {
      this.$store.commit("changeActiveName2", "location");
    },
    changeIcon() {
      if (!this.show) {
        this.iconData = "el-icon-s-fold";
        this.open = true;
        this.show = true;
        this.btnChange = true;
        this.changeBox = true;
        this.$store.commit("changeShow", this.show);
      } else {
        this.iconData = "el-icon-s-unfold";
        this.show = false;
        this.btnChange = false;
        this.open = false;
        this.changeBox = false;
        this.$store.commit("changeShow", this.show);
      }
    },
  },
  beforeMount() {
    if (this.$store.state.show) {
      this.iconData = "el-icon-s-fold";
      this.btnChange = true;
      this.changeBox = true;
      this.open = true;
    } else {
      this.iconData = "el-icon-s-unfold";
      this.btnChange = false;
      this.changeBox = false;
      this.open = false;
    }
    switch (this.$route.path) {
      case "/indoor/historical":
        this.isActiveClass = "locationindoor";
        break;
      case "/outdoor/historical":
        this.isActiveClass = "locationoutdoor";
        break;
      case "/indoor3d/historical3d":
        this.isActiveClass = "location3d";
    }
  },
};
</script>

<style scoped>
.changeBtn {
  width: 30px;
  height: 50px;
  border: none;
  background-color: #fff;
  padding-left: 20%;
}
.changeBtn1 {
  width: 149px;
  height: 50px;
  border: none;
}
.box {
  width: auto;
  overflow: hidden;
}
.box1 {
  width: auto;
  overflow: hidden;
}
.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-color: #909399;
}
.menu-side-icon {
  width: 16px;
  height: 16px;
  font-size: 16px;
  line-height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}
.icon.map {
  mask: url("../../assets/map.svg");
  mask-size: contain;
}
.icon.tower {
  mask: url("../../assets/tower.svg");
  mask-size: contain;
}
.icon.tier {
  mask: url("../../assets/tier.svg");
  mask-size: contain;
}
.icon.detail {
  mask: url("../../assets/detail.svg");
  mask-size: contain;
}
.icon.indoor {
  mask: url("../../assets/indoor.svg");
  mask-size: contain;
}
.icon.outdoor {
  mask: url("../../assets/outdoor.svg");
  mask-size: contain;
}
.is-active .icon,
.is-active .menu-side-icon {
  color: #409eff;
  background-color: transparent;
}
.is-active .icon {
  background-color: #409eff;
}
.left {
  text-align: start !important;
  padding-left: 40px !important;
}
</style>
