<template>
  <div :class="contrForPrionum != 5 ? 'home device-page admin-page' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Project /></el-aside>
        <el-main>
          <el-breadcrumb separator="/" class="config-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/projectmanagement' }">{{
              $t("index.projectmanagement")
            }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ intoProjectName }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $t("Breadcrumb.Config") }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="page-panel config-panel">
          <div class="config-head">
            <span class="config-title">{{ $t("Breadcrumb.Config") }}</span>
            <el-button type="primary" class="query" @click="confirmTrue()">{{
              $t("index.Confirm")
            }}</el-button>
          </div>
          <el-collapse v-model="activeName" class="options config-collapse">
            <el-collapse-item :title="$t('list.homepage')" name="6" class="config-card-sm">
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
              <div class="list_options">
                <p>{{ $t("list.AlarmStatistics") }}：</p>
                <p>
                  <el-radio v-model="showAlarmStat" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="showAlarmStat" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
            </el-collapse-item>
            <el-collapse-item :title="$t('list.alarmmanagement')" name="1" class="config-card-sm">
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
              <div class="list_options">
                <p>{{ $t("list.manualAlarmCheck") }}：</p>
                <p class="config-input-wrap">
                  <el-input
                    v-model="manualAlarmCheck"
                    class="config-time-input"
                    type="number"
                    :min="0"
                  ></el-input>
                  <span class="config-unit">{{
                    $t("functionParts.minutes")
                  }}</span>
                  <el-tooltip
                    :content="$t('functionParts.manualAlarmCheckTip')"
                    placement="top"
                    :popper-style="{ maxWidth: '260px', lineHeight: '1.5' }"
                  >
                    <i class="el-icon-question config-help"></i>
                  </el-tooltip>
                </p>
              </div>
            </el-collapse-item>

            <el-collapse-item :title="$t('list.Locationmanagement')" name="3" class="config-card-sm">
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

            <el-collapse-item :title="$t('list.devicemanagement')" name="4" class="config-card-sm">
              <div class="list_options">
                <p>{{ $t("list.Terminalmanagement") }}：</p>
                <p>
                  <el-radio v-model="devgw" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="devgw"
                    :label="false"
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
                    :label="false"
                    >{{ $t("functionParts.unshow") }}</el-radio>
                </p>
              </div>
              <div class="list_options">
                <p>{{ $t("list.Audiorecording") }}：</p>
                <p>
                  <el-radio v-model="audio" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="audio" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
            </el-collapse-item>

            <el-collapse-item :title="$t('list.Personnelmanagement')" name="2" class="config-card-lg">
              <div class="list_options">
                <p>{{ $t("list.Employeemanagement") }}：</p>
                <p>
                  <el-radio v-model="staffmanagement" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="staffmanagement"
                    :label="false"
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
              <div class="list_options">
                <p>{{ $t("list.Taskmanagement") }}：</p>
                <p>
                  <el-radio v-model="locateManage" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio v-model="locateManage" :label="false">{{
                    $t("functionParts.unshow")
                  }}</el-radio>
                </p>
              </div>
            </el-collapse-item>

            <el-collapse-item :title="$t('list.Securitymanagement')" name="5" class="config-card-lg">
              <div class="list_options">
                <p>{{ $t("otherDev.aoaGateway") }}：</p>
                <p>
                  <el-radio v-model="aoagw" :label="true">{{
                    $t("functionParts.show")
                  }}</el-radio>
                  <el-radio
                    v-model="aoagw"
                    :label="false"
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
                    >{{ $t("functionParts.unshow") }}</el-radio>
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
                    >{{ $t("functionParts.unshow") }}</el-radio>
                </p>
              </div>
            </el-collapse-item>
          </el-collapse>
          </div>
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
      intoProjectName: this.$store.state.intoProjectName,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      activeName: ["1", "2", "3", "4", "5", "6"],
      attenFlag: "",
      showBeacon: "true", //显示信标统计
      showAttendance: "true", //显示考勤统计
      showAlarmStat: false, //显示告警统计（后端暂无字段，先本地控制）
      warningconfig: "true", //人员告警
      warningconfigtbox: "true", //车辆告警
      manualAlarmCheck: "", //人工核对告警（分钟），接口参数待后端确定
      staffmanagement: "true", //员工管理
      assetManagement: "true", //资产管理
      tboxManagement: "true", //车辆管理
      checkwork: "true", //考勤管理
      inspection: "true", //巡检管理
      locateManage: false, //任务管理
      locationoutdoor: "true", //室外定位
      locationindoor: "true", //室内定位
      devgw: "true", //终端管理
      scanbeacon: "true", //信标管理
      audio: false, //录音管理
      aoagw: "true", //AOA网关
      smoke: "true", //烟感
      alertor: "true", //报警器
      blesensor: "true", //蓝牙传感器
      camera: "true", //摄像头
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
          // 后端暂无告警统计字段，先默认不显示
          that.showAlarmStat = false;
          that.warningconfig = res.data.alarmConfig;
          that.warningconfigtbox = res.data.tboxConfig;
          that.staffmanagement = res.data.employee;
          that.assetManagement = res.data.asset;
          that.tboxManagement = res.data.tbox;
          that.checkwork = res.data.attendance;
          that.inspection = res.data.task;
          that.locateManage = !!res.data.locateManage;
          that.locationindoor = res.data.inDoor;
          that.locationoutdoor = res.data.outDoor;
          that.aoagw = res.data.aoagw;
          that.smoke = res.data.smoke;
          that.alertor = res.data.alertor;
          that.blesensor = res.data.blesensor;
          that.camera = res.data.camera;
          that.devgw = res.data.devgw;
          that.scanbeacon = res.data.scanbeacon;
          that.audio = !!res.data.audio;
        }
      });
    },
    confirmTrue() {
      var that = this;
      // 信标状态 / 考勤统计 / 告警统计 三者只能显示一个，且必须显示一个
      const homeStats = [this.showBeacon, this.showAttendance, this.showAlarmStat];
      const shownStats = homeStats.filter((v) => v === true || v === "true")
        .length;
      if (shownStats > 1) {
        that.$message({
          message: that.$t("functionParts.message5"),
          type: "warning",
        });
        return;
      }
      if (shownStats === 0) {
        that.$message({
          message: that.$t("functionParts.message6"),
          type: "warning",
        });
        return;
      }
      // 员工管理 / 资产管理 / 车辆管理 三项中必须保留一项为显示
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
      // 其余分组（告警管理 / 定位管理 / 设备管理 / 安全管理）不再做前端联动限制，
      // 由用户自由选择，合法性交由后端校验
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
        locateManage: this.locateManage,
        outDoor: this.locationoutdoor,
        inDoor: this.locationindoor,
        aoagw: this.aoagw,
        smoke: this.smoke,
        alertor: this.alertor,
        blesensor: this.blesensor,
        camera: this.camera,
        devgw: this.devgw,
        scanbeacon: this.scanbeacon,
        audio: this.audio,
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
.config-breadcrumb {
  margin: 0 0 10px 2px !important;
}
.config-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 2px 12px !important;
}
.config-head .el-button {
  margin: 0 !important;
}
.config-title {
  margin: 0 !important;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}
.config-collapse {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: stretch;
  gap: 12px;
  margin: 0 !important;
  border: none;
}
.config-collapse :deep(.el-collapse-item) {
  grid-column: span 3;
  margin: 0 !important;
  overflow: hidden;
  border: 1px solid #eef2f7;
  border-radius: 10px;
  background: #fff;
}
.config-collapse :deep(.el-collapse-item__header) {
  height: 42px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  background: #f8fafc;
  border-bottom: 1px solid #eef2f7;
}
.config-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}
.config-collapse :deep(.el-collapse-item__content) {
  padding: 6px 14px 8px;
}
.list_options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  margin: 0 !important;
  border-bottom: 1px dashed #eef2f7;
}
.list_options:last-child {
  border-bottom: none;
}
.config-collapse :deep(.config-card-lg) {
  grid-column: span 6;
}
.config-collapse :deep(.el-collapse-item:not(.is-active)) {
  align-self: start;
}
.config-card-lg :deep(.el-collapse-item__content) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 32px;
}
.config-card-lg .list_options:nth-child(odd):nth-last-child(-n + 2),
.config-card-lg .list_options:nth-child(odd):nth-last-child(-n + 2) ~ .list_options {
  border-bottom: none;
}
@media (max-width: 1280px) {
  .config-collapse :deep(.el-collapse-item) {
    grid-column: span 6;
  }
  .config-collapse :deep(.config-card-lg) {
    grid-column: span 12;
  }
}
.list_options p {
  margin: 0 !important;
}
.list_options p:nth-of-type(1) {
  color: #475569;
}
.list_options p:nth-of-type(2) :deep(.el-radio) {
  margin-right: 0;
  margin-left: 16px;
}
/* 人工核对告警：数字输入框 + 单位「分钟」 */
.config-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.config-input-wrap > * {
  margin: 0 !important;
}
.config-input-wrap .config-time-input {
  flex: 0 0 auto;
  width: 88px;
}
.config-input-wrap :deep(.el-input__inner) {
  text-align: center;
}
/* 隐藏数字输入框的上下箭头，避免挤占输入区 */
.config-input-wrap :deep(input[type="number"]::-webkit-outer-spin-button),
.config-input-wrap :deep(input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
.config-unit {
  margin: 0 !important;
  color: #64748b;
  font-size: 13px;
  white-space: nowrap;
}
/* 人工核对告警的问号说明 */
.config-help {
  margin: 0 !important;
  flex: 0 0 auto;
  color: #94a3b8;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s;
}
.config-help:hover {
  color: #2f7bff;
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


.el-message--success {
  display: -webkit-box !important;
}

.el-message--error {
  display: -webkit-box !important;
}

.el-message--warning {
  display: -webkit-box !important;
}

.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}
.demo-form-inline :deep(.el-form-item .el-form-item__label) {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline :deep(.el-form-item .el-form-item__content) {
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-input__inner) {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-input__icon) {
  height: 34px;
  line-height: 34px;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
</style>