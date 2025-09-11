<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Project /></el-aside>
        <el-main>
          <el-collapse v-model="activeName" class="options">
            <el-collapse-item :title="$t('list.homepage')" name="6">
              <div class="list_options">
                <p>{{ $t("list.beaconstatus") }}：</p>
                <p>
                  <el-radio v-model="showBeacon" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="showBeacon" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.attendancestatistics") }}：</p>
                <p>
                  <el-radio v-model="showAttendance" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="showAttendance" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
            </el-collapse-item>
            <el-collapse-item :title="$t('list.alarmmanagement')" name="1">
              <div class="list_options">
                <p>{{ $t("list.Personwarning") }}：</p>
                <p>
                  <el-radio v-model="warningconfig" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="warningconfig" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.Vehiclewarning") }}：</p>
                <p>
                  <el-radio v-model="warningconfigtbox" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="warningconfigtbox" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
            </el-collapse-item>

            <el-collapse-item :title="$t('list.Personnelmanagement')" name="2">
              <div class="list_options">
                <p>{{ $t("list.Employeemanagement") }}：</p>
                <p>
                  <el-radio v-model="staffmanagement" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="staffmanagement"
                    :label="false"
                    :disabled="staffNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.assetmanagement") }}：</p>
                <p>
                  <el-radio v-model="assetManagement" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="assetManagement"
                    :label="false"
                    :disabled="assetNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.Vehiclemanagement") }}：</p>
                <p>
                  <el-radio v-model="tboxManagement" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="tboxManagement"
                    :label="false"
                    :disabled="tboxNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.Attendancemanagement") }}：</p>
                <p>
                  <el-radio v-model="checkwork" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="checkwork" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.Patrolmanagement") }}：</p>
                <p>
                  <el-radio v-model="inspection" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="inspection" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
            </el-collapse-item>

            <el-collapse-item :title="$t('list.Locationmanagement')" name="3">
              <div class="list_options">
                <p>{{ $t("list.Indoorpositioning") }}：</p>
                <p>
                  <el-radio v-model="locationindoor" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="locationindoor" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.Outdoorpositioning") }}：</p>
                <p>
                  <el-radio v-model="locationoutdoor" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="locationoutdoor" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
            </el-collapse-item>

            <el-collapse-item :title="$t('list.devicemanagement')" name="4">
              <div class="list_options">
                <p>{{ $t("list.Terminalmanagement") }}：</p>
                <p>
                  <el-radio v-model="devgw" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="devgw"
                    :disabled="devgwNum != 0"
                    :label="false"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.Beaconmanagement") }}：</p>
                <p>
                  <el-radio v-model="scanbeacon" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="scanbeacon"
                    :disabled="scanbeaconNum != 0"
                    :label="false"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>
            </el-collapse-item>

            <el-collapse-item :title="$t('list.Securitymanagement')" name="5">
              <div class="list_options">
                <p>{{ $t("otherDev.assetGateway") }}：</p>
                <p>
                  <el-radio v-model="assetgw" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="assetgw"
                    :label="false"
                    :disabled="assetgwNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>

              <div class="list_options">
                <p>{{ $t("otherDev.aoaGateway") }}：</p>
                <p>
                  <el-radio v-model="aoagw" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="aoagw"
                    :label="false"
                    :disabled="aoagwNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>

              <div class="list_options">
                <p>{{ $t("otherDev.smokeSensor") }}：</p>
                <p>
                  <el-radio v-model="smoke" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="smoke"
                    :label="false"
                    :disabled="smokeNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>

              <div class="list_options">
                <p>{{ $t("otherDev.burglarAlarm") }}：</p>
                <p>
                  <el-radio v-model="alertor" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="alertor"
                    :label="false"
                    :disabled="alertorNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>

              <div class="list_options">
                <p>{{ $t("otherDev.bluetoothSensor") }}：</p>
                <p>
                  <el-radio v-model="blesensor" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="blesensor"
                    :label="false"
                    :disabled="blesensorNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>

              <div class="list_options">
                <p>{{ $t("otherDev.camera") }}：</p>
                <p>
                  <el-radio v-model="camera" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="camera"
                    :label="false"
                    :disabled="cameraNum != 0"
                    >{{ $t("functionParts.unshow") }}</el-radio
                  >
                </p>
              </div>

              <el-button
                type="primary"
                class="buttons"
                @click="confirmTrue()"
                >{{ $t("index.Confirm") }}</el-button
              >
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import Menu from "../../components/menu/Menu";
import { getProjectConfigOne, updateProjectConfig } from "../../axios/api";
import Project from "../../components/project/project";

export default {
  components: {
    Menu,
    Project,
  },
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      activeName: ["1", "2", "3", "4", "5", "6"],
      attenFlag: "",
      showBeacon: "true", //显示信标统计
      showAttendance: "true", //显示考勤统计
      warningconfig: "true", //人员告警
      warningconfigtbox: "true", //车辆告警
      staffmanagement: "true", //员工管理
      staffNum: 0, //员工数量
      assetManagement: "true", //资产管理
      assetNum: 0, //资产数量
      tboxManagement: "true", //车辆管理
      tboxNum: 0, //车辆数量
      checkwork: "true", //考勤管理
      inspection: "true", //巡检管理
      locationoutdoor: "true", //室外定位
      locationindoor: "true", //室内定位
      devgw: "true", //终端管理
      devgwNum: 0, //终端管理数量
      scanbeacon: "true", //信标管理
      scanbeaconNum: 0, //信标管理数量
      assetgw: "true", //资产网关
      assetgwNum: 0, //资产网关数量
      aoagw: "true", //AOA网关
      aoagwNum: 0, //AOA网关数量
      smoke: "true", //烟感
      smokeNum: 0, //烟感数量
      alertor: "true", //报警器
      alertorNum: 0, //报警器数量
      blesensor: "true", //蓝牙传感器
      blesensorNum: 0, //蓝牙传感器数量
      camera: "true", //摄像头
      cameraNum: 0, //摄像头数量
    };
  },
  methods: {
    getProjectConfigOnes() {
      var that = this;
      getProjectConfigOne(
        { projectid: this.$store.state.intoProjectid },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.attenFlag = res.data.attenFlag;
          that.showBeacon = res.data.attenFlag ? false : true;
          that.showAttendance = res.data.attenFlag ? true : false;
          that.warningconfig = res.data.alarmConfig;
          that.warningconfigtbox = res.data.tboxConfig;
          that.staffmanagement = res.data.employee;
          that.staffNum = res.data.employeeNum;
          that.assetManagement = res.data.asset;
          that.assetNum = res.data.assetNum;
          that.tboxManagement = res.data.tbox;
          that.tboxNum = res.data.tboxNum;
          that.checkwork = res.data.attendance;
          that.inspection = res.data.task;
          that.locationindoor = res.data.inDoor;
          that.locationoutdoor = res.data.outDoor;
          that.assetgw = res.data.assetgw;
          that.assetgwNum = res.data.assetgwNum;
          that.aoagw = res.data.aoagw;
          that.aoagwNum = res.data.aoagwNum;
          that.smoke = res.data.smoke;
          that.smokeNum = res.data.smokeNum;
          that.alertor = res.data.alertor;
          that.alertorNum = res.data.alertorNum;
          that.blesensor = res.data.blesensor;
          that.blesensorNum = res.data.blesensorNum;
          that.camera = res.data.camera;
          that.cameraNum = res.data.cameraNum;
          that.devgw = res.data.devgw;
          that.devgwNum = res.data.devgwNum;
          that.scanbeacon = res.data.scanbeacon;
          that.scanbeaconNum = res.data.scanbeaconNum;
        }
      });
    },
    confirmTrue() {
      var that = this;
      if (this.showBeacon && this.showAttendance) {
        that.$message({
          message: that.$t("functionParts.message5"),
          type: "warning",
        });
        return;
      }
      if (!this.showBeacon && !this.showAttendance) {
        that.$message({
          message: that.$t("functionParts.message6"),
          type: "warning",
        });
        return;
      }
      if (!this.warningconfig && !this.warningconfigtbox) {
        that.$message({
          message: that.$t("functionParts.message1"),
          type: "warning",
        });
        return;
      }
      if (
        !this.staffmanagement &&
        !this.assetManagement &&
        !this.tboxManagement
      ) {
        that.$message({
          message: that.$t("functionParts.message2"),
          type: "warning",
        });
        return;
      }
      if (!this.locationindoor && !this.locationoutdoor) {
        that.$message({
          message: that.$t("functionParts.message3"),
          type: "warning",
        });
        return;
      }
      if (
        !this.assetgw &&
        !this.aoagw &&
        !this.smoke &&
        !this.alertor &&
        !this.blesensor &&
        !this.camera &&
        !this.devgw
      ) {
        that.$message({
          message: that.$t("functionParts.message4"),
          type: "warning",
        });
      }
      this.attenFlag = this.showBeacon ? false : true;
      let data = {
        projectid: this.$store.state.intoProjectid,
        attenFlag: this.attenFlag,
        alarmConfig: this.warningconfig,
        tboxConfig: this.warningconfigtbox,
        employee: this.staffmanagement,
        asset: this.assetManagement,
        attendance: this.checkwork,
        tbox: this.tboxManagement,
        task: this.inspection,
        outDoor: this.locationoutdoor,
        inDoor: this.locationindoor,
        assetgw: this.assetgw,
        aoagw: this.aoagw,
        smoke: this.smoke,
        alertor: this.alertor,
        blesensor: this.blesensor,
        camera: this.camera,
        devgw: this.devgw,
        scanbeacon: this.scanbeacon,
      };
      updateProjectConfig(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("terminal.tet28"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
  },
  mounted() {
    this.getProjectConfigOnes();
  },
};
</script>
<style  scoped>
.options {
  width: 40%;
  margin: 2% auto;
}
.buttons {
  padding: 8px 12px !important;
  float: right;
  margin-right: 10%;
  margin-bottom: 2%;
}
.list_options {
  display: flex;
}
.list_options p:nth-of-type(1) {
  text-align: right;
  width: 40%;
}
.list_options p:nth-of-type(2) {
  text-align: left;
  width: 60%;
}
.home {
  height: 100%;
  width: 100%;
  position: absolute;
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
}
.home::-webkit-scrollbar {
  display: none;
}

.menu_header {
  position: relative;
}
.asi {
  position: absolute;
  top: 70px;
  width: 99%;
}
.el-aside {
  margin-top: 50px;
  width: auto !important;
}

.el-message--success {
  display: -webkit-box !important;
}

.el-message--error {
  display: -webkit-box !important;
}

.el-message--warning {
  display: -webkit-box !important;
}

.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}
.demo-form-inline >>> .el-form-item .el-form-item__label {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline >>> .el-form-item .el-form-item__content {
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__inner {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px;
  line-height: 34px;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
</style>