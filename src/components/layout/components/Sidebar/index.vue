<template>
  <div>
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#252b3b"
        text-color="#8c97aa"
        :unique-opened="false"
        active-text-color="#458bff"
        :collapse-transition="false"
        mode="vertical"
        :router="true"
        style="text-align: left"
      >
        <el-menu-item index="/dashboard">
          <i class="icon home"></i>
          <span style="font-weight: 600">{{ $t("list.homepage") }}</span>
        </el-menu-item>
        <el-submenu ref="subMenu" index="/device" popper-append-to-body>
          <template slot="title">
            <i class="icon terminal"></i>
            <span style="font-weight: 600">{{
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
            v-if="assetgw || aoagw || smoke || alertor || blesensor || camera"
            >{{ $t("list.Securitymanagement") }}</el-menu-item
          >
        </el-submenu>

        <el-submenu ref="subMenu" index="/warningu" popper-append-to-body>
          <template slot="title">
            <i class="icon sos"></i>
            <span style="font-weight: 600">{{
              $t("list.alarmmanagement")
            }}</span>
          </template>

          <el-menu-item index="/warningu/electronicfence" v-if="maprio == 1">{{ $t("warning.electronicFence") }}</el-menu-item>

          <el-menu-item index="/warningu/index">
            <span>{{ $t("list.Alarminformation") }}</span>
            <el-badge
              :value="warningNum"
              class="warningbox"
              v-show="warningNum > 0"
            >
            </el-badge
          ></el-menu-item>
          <el-menu-item index="/warningu/warningconfigper" v-if="alarmConfig">{{
            $t("list.Personwarning")
          }}</el-menu-item>

          <el-menu-item
            index="/warningu/warningconfigtbox"
            v-show="intoProjectType == 1 && tboxConfig"
            >{{ $t("list.Vehiclewarning") }}</el-menu-item
          >
          <el-menu-item index="/warningu/warningconfig">{{
            $t("list.Alarmconfiguration")
          }}</el-menu-item>
        </el-submenu>

        <el-submenu ref="subMenu" index="/staff" popper-append-to-body>
          <template slot="title">
            <i class="icon staff"></i>
            <span style="font-weight: 600">{{
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
            v-show="intoProjectType == 1 && tbox"
            >{{ $t("list.Vehiclemanagement") }}</el-menu-item
          >
          <el-menu-item index="/staff/checkwork" v-if="attendance">{{
            $t("list.Attendancemanagement")
          }}</el-menu-item>
          <el-menu-item index="/staff/inspection" v-if="task">{{
            $t("list.Patrolmanagement")
          }}</el-menu-item>
        </el-submenu>
        <el-submenu ref="subMenu" index="/location" popper-append-to-body>
          <template slot="title">
            <i class="icon location"></i>
            <span style="font-weight: 600">{{
              $t("list.Locationmanagement")
            }}</span>
          </template>

          <el-menu-item index="/location/mapmanagement" v-if="maprio == 1">{{
            $t("list.Mapmanagement")
          }}</el-menu-item>
          <el-menu-item
            index="/location/buildingmanagement"
            v-if="maprio == 1"
            >{{ $t("list.Buildingmanagement") }}</el-menu-item
          >
          <el-menu-item index="/location/floormanagement" v-if="maprio == 1">{{
            $t("list.Floormanagement")
          }}</el-menu-item>
          <el-menu-item index="/location/buildingdetails">{{
            $t("list.Floordetails")
          }}</el-menu-item>
          <el-submenu index="outdoor" class="el-submenu2" v-if="outDoor">
            <template slot="title">{{
              $t("list.Outdoorpositioning")
            }}</template>
            <el-menu-item index="/location/outdoor/locationoutdoor">{{
              $t("list.Locationquery")
            }}</el-menu-item>
            <el-menu-item index="/location/outdoor/historical">{{
              $t("list.Historicaltrack")
            }}</el-menu-item>
          </el-submenu>
          <el-submenu index="indoor" class="el-submenu2" v-if="inDoor">
            <template slot="title">{{ $t("list.Indoorpositioning") }}</template>
            <el-menu-item index="/location/indoor/locationindoor">{{
              $t("list.Locationquery")
            }}</el-menu-item>
            <!-- <el-menu-item index="/location/indoor/historicaltrack">
              {{ $t("list.Historicaltrack") }}
            </el-menu-item> -->
            <el-menu-item index="/location/indoor/historical">
              {{ $t("list.Dataanalysis") }}
            </el-menu-item>
          </el-submenu>
          <!-- <el-menu-item index="indoor3d">indoor3d</el-menu-item> -->
        </el-submenu>
        <el-submenu ref="subMenu" index="/user" popper-append-to-body>
          <template slot="title">
            <i class="icon user"></i>
            <span style="font-weight: 600">{{
              $t("list.systemmanagement")
            }}</span>
          </template>

          <el-menu-item index="/user/usercenter">{{
            $t("list.PersonalCenter")
          }}</el-menu-item>
          <el-menu-item index="/user/myorder">{{
            $t("list.Myworkorder")
          }}</el-menu-item>
        </el-submenu>
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
      assetgw: this.$store.state.functionParts.assetgw,
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
      this.inDoor = val.inDoor;
      this.outDoor = val.outDoor;

      this.assetgw = val.assetgw;
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

@media screen and (max-width: 1400px) {
  >>> .el-submenu .el-submenu__title {
    padding-left: 20px !important ;
  }
}

.el-menu-item {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.el-submenu .el-menu-item {
  padding-left: 46px !important;
}
.el-submenu2 >>> .el-submenu__title {
  padding-left: 46px !important;
}
.el-menu--popup-right-start .el-submenu2 >>> .el-submenu__title {
  padding-left: 20px !important;
}
.el-submenu2 .el-menu-item {
  padding-left: 60px !important;
}
// .el-submenu >>> .el-menu--popup-right-start{
//   margin-left: 0 !important;
// }
.el-menu--popup-right-start .el-submenu2 .el-menu-item {
  padding-left: 20px !important;
}
.el-menu--vertical
  .el-menu--popup-right-start
  .el-submenu2
  .el-menu-item.is-active {
  padding-left: 20px !important ;
}
.el-menu-item.is-active {
  border-left: 4px #458bff solid;
  padding-left: 16px !important;
  background-color: $menuHover !important;
  transition: all 0.2s;
}

.el-submenu .el-menu-item.is-active {
  border-left: 4px #458bff solid;
  padding-left: 42px !important;
  background-color: $menuHover !important;
  transition: all 0.2s;
}
.el-submenu2 .el-menu-item.is-active {
  border-left: 4px #458bff solid;
  padding-left: 56px !important;
  background-color: $menuHover !important;
  transition: all 0.2s;
}
.el-menu-item {
  &:hover {
    // you can use $subMenuHover
    background-color: $menuHover !important;
  }
}
>>> .el-submenu .el-submenu__title:hover {
  background-color: $menuHover !important;
}
>>> .is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}
>>> .el-submenu.is-active .el-submenu__title .icon {
  background-color: $subMenuActiveText;
}
#app .sidebar-container .el-submenu .el-menu-item.is-active {
  background-color: $menuHover !important;
}
>>> .el-menu-item,
.el-submenu {
  text-align: left !important;
}
>>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
>>> .el-scrollbar__wrap ::-webkit-scrollbar {
  display: none !important;
}
.icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  margin-right: 8px;
  margin-left: 5px;
  background-color: #9c9c9c;
  transition: all 0.2s;
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
.is-active > .icon {
  background-color: #458bff;
}
.el-badge.warningbox {
  margin-left: 60px;
}
>>> sup {
  transform: translateY(5px);
  border: 0;
}
.el-scrollbar {
  padding-bottom: 30px !important;
}
.el-scrollbar::-webkit-scrollbar {
  display: none !important;
}
</style>
