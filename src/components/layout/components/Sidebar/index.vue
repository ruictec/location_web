<template>
  <div>
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        :router="true"
        class="sidebar-menu"
        style="text-align: left; --el-menu-bg-color: #1e2433; --el-menu-text-color: #94a3b8; --el-menu-active-color: #2f7bff; --el-menu-hover-bg-color: rgba(47,123,255,0.14);"
      >
        <el-menu-item index="/dashboard">
          <i class="icon home"></i>
          <span class="menu-label">{{ $t("list.homepage") }}</span>
        </el-menu-item>
        <el-sub-menu ref="subMenu" index="/device">
          <template #title>
            <i class="icon terminal"></i>
            <span class="menu-label">{{
              $t("list.devicemanagement")
            }}</span>
          </template>

          <el-menu-item index="/device/terminal" v-if="devgw">{{
            $t("list.Terminalmanagement")
          }}</el-menu-item>
          <el-menu-item index="/device/beacon" v-if="scanbeacon">{{
            $t("list.Beaconmanagement")
          }}</el-menu-item>
          <el-menu-item
            index="/device/security"
            v-if="aoagw || smoke || alertor || blesensor || camera"
            >{{ $t("list.Securitymanagement") }}</el-menu-item>
          <el-menu-item index="/device/gateway">{{
            $t("list.Basestationmanagement")
          }}</el-menu-item>
          <el-menu-item
            index="/device/audiorecording"
            v-if="audio"
            >{{ $t("list.Audiorecording") }}</el-menu-item>
        </el-sub-menu>

        <el-sub-menu ref="subMenu" index="/warning">
          <template #title>
            <i class="icon sos"></i>
            <span class="menu-label">{{
              $t("list.alarmmanagement")
            }}</span>
          </template>

          <el-menu-item index="/warning/electronicfence" v-if="maprio == 1">{{ $t("warning.electronicFence") }}</el-menu-item>

          <el-menu-item index="/warning/index">
            <span>{{ $t("list.Alarminformation") }}</span>
            <el-badge
              v-if="Number(warningNum) > 0"
              :value="warningNum"
              :hidden="Number(warningNum) <= 0"
              class="warningbox"
            >
            </el-badge></el-menu-item>
          <el-menu-item index="/warning/warningconfigper" v-if="alarmConfig">{{
            $t("list.Personwarning")
          }}</el-menu-item>

          <el-menu-item
            index="/warning/warningconfigasset"
            v-if="intoProjectType == 2 && asset"
            >{{ $t("list.Assetwarning") }}</el-menu-item>

          <el-menu-item
            index="/warning/warningconfigtbox"
            v-if="intoProjectType == 1 && tboxConfig"
            >{{ $t("list.Vehiclewarning") }}</el-menu-item>
          <el-menu-item index="/warning/warningconfig">{{
            $t("list.Alarmconfiguration")
          }}</el-menu-item>
        </el-sub-menu>

        <el-sub-menu ref="subMenu" index="/staff">
          <template #title>
            <i class="icon staff"></i>
            <span class="menu-label">{{
              $t("list.Personnelmanagement")
            }}</span>
          </template>

          <el-menu-item index="/staff/staffmanagement" v-if="employee">{{
            $t("list.Employeemanagement")
          }}</el-menu-item>
          <el-menu-item index="/staff/assetManagement" v-if="asset">{{
            $t("list.assetmanagement")
          }}</el-menu-item>
          <el-menu-item
            index="/staff/tboxManagement"
            v-if="intoProjectType == 1 && tbox"
            >{{ $t("list.Vehiclemanagement") }}</el-menu-item>
          <el-menu-item index="/staff/checkwork" v-if="attendance">{{
            $t("list.Attendancemanagement")
          }}</el-menu-item>
          <el-menu-item index="/staff/inspection" v-if="task">{{
            $t("list.Patrolmanagement")
          }}</el-menu-item>
          <el-menu-item
            index="/staff/taskmanagement"
            v-if="locateManage"
            >{{ $t("list.Taskmanagement") }}</el-menu-item>
        </el-sub-menu>
        <el-sub-menu ref="subMenu" index="/location">
          <template #title>
            <i class="icon location"></i>
            <span class="menu-label">{{
              $t("list.Locationmanagement")
            }}</span>
          </template>

          <el-menu-item index="/location/mapmanagement" v-if="maprio == 1">{{
            $t("list.Mapmanagement")
          }}</el-menu-item>
          <el-menu-item
            index="/location/buildingmanagement"
            v-if="maprio == 1"
            >{{ $t("list.Buildingmanagement") }}</el-menu-item>
          <el-menu-item index="/location/floormanagement" v-if="maprio == 1">{{
            $t("list.Floormanagement")
          }}</el-menu-item>
          <el-menu-item index="/location/buildingdetails">{{
            $t("list.Floordetails")
          }}</el-menu-item>
          <el-menu-item index="/location/historytrajectory">{{
            $t("list.Historicaltrack")
          }}</el-menu-item>
          <!-- 室外定位：扁平为一级菜单（原「室外定位 > 定位查询」） -->
          <el-menu-item
            index="/location/outdoor/locationoutdoor"
            v-if="outDoor"
            >{{ $t("list.Outdoorpositioning") }}</el-menu-item>
          <!-- 室外定位-历史轨迹：暂时下线，统一走「历史轨迹」页
          <el-menu-item index="/location/outdoor/historical">{{
            $t("list.Historicaltrack")
          }}</el-menu-item>
          -->
          <!-- 室内定位：扁平为一级菜单（原「室内定位 > 定位查询」） -->
          <el-menu-item
            index="/location/indoor/locationindoor"
            v-if="inDoor"
            >{{ $t("list.Indoorpositioning") }}</el-menu-item>
          <!-- 数据分析：从「室内定位」下提升为定位管理一级菜单 -->
          <el-menu-item
            index="/location/indoor/historical"
            v-if="inDoor"
            >{{ $t("list.Dataanalysis") }}</el-menu-item>
          <!-- <el-menu-item index="indoor3d">indoor3d</el-menu-item> -->
        </el-sub-menu>
        <el-sub-menu ref="subMenu" index="/user">
          <template #title>
            <i class="icon user"></i>
            <span class="menu-label">{{
              $t("list.systemmanagement")
            }}</span>
          </template>

          <el-menu-item index="/user/usercenter">{{
            $t("list.PersonalCenter")
          }}</el-menu-item>
          <el-menu-item index="/user/myorder">{{
            $t("list.Myworkorder")
          }}</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
// import variables from '../../style/variables.scss'

export default {
  data() {
    return {
      devgw: this.$store.state.functionParts.devgw,
      scanbeacon: this.$store.state.functionParts.scanbeacon,
      audio: this.$store.state.functionParts.audio,
      aoagw: this.$store.state.functionParts.aoagw,
      smoke: this.$store.state.functionParts.smoke,
      alertor: this.$store.state.functionParts.alertor,
      blesensor: this.$store.state.functionParts.blesensor,
      camera: this.$store.state.functionParts.camera,
      alarmConfig: this.$store.state.functionParts.alarmConfig,
      tboxConfig: this.$store.state.functionParts.tboxConfig,
      employee: this.$store.state.functionParts.employee,
      asset: this.$store.state.functionParts.asset,
      tbox: this.$store.state.functionParts.tbox,
      attendance: this.$store.state.functionParts.attendance,
      task: this.$store.state.functionParts.task,
      locateManage: this.$store.state.functionParts.locateManage,
      inDoor: this.$store.state.functionParts.inDoor,
      outDoor: this.$store.state.functionParts.outDoor,
      maprio: this.$store.state.userInfo.maprio,
      warningNum: this.$store.state.warningNum,
      intoProjectType: this.$store.state.intoProjectType,
    };
  },
  components: { SidebarItem, Logo },
  computed: {
    functionPartss() {
      return this.$store.state.functionParts;
    },
    warningNums() {
      return this.$store.state.warningNum;
    },
    intoProjectTypes() {
      return this.$store.state.intoProjectType;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      if (path === "/dashboard" || path === "/dashboard/index") {
        return "/dashboard";
      }
      return path;
    },
    isCollapse() {
      return !this.$store.state.show;
    },
  },
  watch: {
    warningNums(val) {
      this.warningNum = val;
    },
    intoProjectTypes(val) {
      this.intoProjectType = val;
    },
    functionPartss(val) {
      this.alarmConfig = val.alarmConfig;
      this.tboxConfig = val.tboxConfig;
      this.employee = val.employee;
      this.asset = val.asset;
      this.tbox = val.tbox;
      this.attendance = val.attendance;
      this.task = val.task;
      this.locateManage = val.locateManage;
      this.inDoor = val.inDoor;
      this.outDoor = val.outDoor;
      this.devgw = val.devgw;
      this.scanbeacon = val.scanbeacon;
      this.audio = val.audio;
      this.aoagw = val.aoagw;
      this.smoke = val.smoke;
      this.alertor = val.alertor;
      this.blesensor = val.blesensor;
      this.camera = val.camera;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/variables.scss";
@import "../../style/sidebar.scss";

.menu-label {
  margin: 0 !important;
  font-weight: 600;
  letter-spacing: 0.2px;
}

@media screen and (max-width: 1400px) {
  :deep(.el-sub-menu .el-sub-menu__title) {
    padding-left: 20px !important;
  }
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  height: 46px;
  line-height: 46px;
  margin: 4px 10px !important;
  border-radius: 10px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.el-menu-item {
  padding-left: 14px !important;
  padding-right: 14px !important;
}
.el-sub-menu .el-menu-item {
  padding-left: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
  margin: 2px 10px !important;
  border-radius: 8px;
}
.el-submenu2 :deep(.el-sub-menu__title) {
  padding-left: 46px !important;
}
.el-menu--popup-right-start .el-submenu2 :deep(.el-sub-menu__title) {
  padding-left: 20px !important;
}
.el-submenu2 .el-menu-item {
  padding-left: 60px !important;
}
.el-menu--popup-right-start .el-submenu2 .el-menu-item {
  padding-left: 20px !important;
}
.el-menu--vertical
  .el-menu--popup-right-start
  .el-submenu2
  .el-menu-item.is-active {
  padding-left: 20px !important;
}

.el-menu-item.is-active {
  position: relative;
  color: #fff !important;
  background: linear-gradient(
    90deg,
    rgba(47, 123, 255, 0.28),
    rgba(34, 211, 238, 0.08)
  ) !important;
  box-shadow: inset 3px 0 0 #2f7bff;
}
.el-sub-menu .el-menu-item.is-active {
  padding-left: 40px !important;
  color: #fff !important;
  background: linear-gradient(
    90deg,
    rgba(47, 123, 255, 0.28),
    rgba(34, 211, 238, 0.08)
  ) !important;
  box-shadow: inset 3px 0 0 #2f7bff;
}
.el-submenu2 .el-menu-item.is-active {
  padding-left: 56px !important;
  background: linear-gradient(
    90deg,
    rgba(47, 123, 255, 0.28),
    rgba(34, 211, 238, 0.08)
  ) !important;
  box-shadow: inset 3px 0 0 #2f7bff;
}
.el-menu-item:hover {
  background-color: $menuHover !important;
  color: #e2e8f0 !important;
}
:deep(.el-sub-menu .el-sub-menu__title:hover) {
  background-color: $menuHover !important;
  color: #e2e8f0 !important;
}
:deep(.is-active > .el-sub-menu__title) {
  color: $subMenuActiveText !important;
}
:deep(.el-sub-menu.is-active .el-sub-menu__title .icon) {
  background-color: $subMenuActiveText;
}
#app .sidebar-container .el-sub-menu .el-menu-item.is-active {
  background: linear-gradient(
    90deg,
    rgba(47, 123, 255, 0.28),
    rgba(34, 211, 238, 0.08)
  ) !important;
}
:deep(.el-menu-item),
.el-sub-menu {
  text-align: left !important;
}
:deep(.el-sub-menu__icon-arrow) {
  color: #64748b;
  right: 14px;
}
:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
:deep(.el-scrollbar__wrap ::-webkit-scrollbar) {
  display: none !important;
}
.icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  margin: 0 10px 0 0 !important;
  flex-shrink: 0;
  background-color: #7c8ba1;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.icon.home {
  mask: url("../../../../assets/home.svg");
  mask-size: contain;
}
.icon.terminal {
  mask: url("../../../../assets/terminal.svg");
  mask-size: contain;
}
.icon.sos {
  mask: url("../../../../assets/sos.svg");
  mask-size: contain;
}
.icon.user {
  mask: url("../../../../assets/usercenter.svg");
  mask-size: contain;
}
.icon.staff {
  mask: url("../../../../assets/staff.svg");
  mask-size: contain;
}

.icon.location {
  mask: url("../../../../assets/location.svg");
  mask-size: contain;
}
.is-active > .icon,
.el-menu-item:hover > .icon,
:deep(.el-sub-menu__title:hover .icon) {
  background-color: #2f7bff;
}
.el-badge.warningbox {
  margin-left: auto !important;
  margin-right: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  height: auto !important;
  line-height: 1 !important;
}
.el-badge.warningbox :deep(.el-badge__content),
.el-badge.warningbox :deep(sup) {
  transform: none !important;
  position: static !important;
  border: 0;
  top: auto !important;
  vertical-align: middle;
  background: linear-gradient(135deg, #f87171, #dc2626);
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}
.el-scrollbar {
  padding-bottom: 30px !important;
}
.el-scrollbar::-webkit-scrollbar {
  display: none !important;
}
</style>
