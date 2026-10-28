<template>
  <div class="content">
    <div
      class="inputContent outdoor-filter-flow terminal-filter-flow"
      :class="filterLangClass"
    >
      <el-form
        class="demo-form-inline terminal-filter-form"
        :model="actionData"
      >
        <el-form-item
          :label="$t('locationoutdoorh.name')"
          class="terminal-filter-item"
        >
          <el-select
            clearable
            filterable
            allow-create
            default-first-option
            v-model="searchUsername"
            :placeholder="$t('staffmanagement.text')"
            @change="onNameSelectChange"
          >
            <el-option
              v-for="item in nameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('terminal.deveui')"
          class="terminal-filter-item"
        >
          <el-select
            clearable
            filterable
            allow-create
            default-first-option
            v-model="searchDeveui"
            :placeholder="$t('staffmanagement.text')"
            @change="onDeveuiSelectChange"
          >
            <el-option
              v-for="item in deveuiList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('staff.time')"
          class="terminal-filter-item history-time-item"
        >
          <el-date-picker
            v-model="actionTime"
            type="datetimerange"
            :shortcuts="pickerOptions.shortcuts"
            :disabled-date="pickerOptions.disabledDate"
            @calendar-change="
              (val) =>
                pickerOptions.onPick &&
                pickerOptions.onPick({ minDate: val[0], maxDate: val[1] })
            "
            :range-separator="$t('terminal.to')"
            :start-placeholder="$t('terminal.startdate')"
            :end-placeholder="$t('terminal.enddate')"
          ></el-date-picker>
        </el-form-item>

        <el-form-item class="terminal-toolbar-item">
          <el-button type="primary" class="query" @click="viewTrack()">{{
            $t("staff.search")
          }}</el-button>
          <el-button type="primary" class="reset" @click="resetAll()">{{
            $t("usermanagement.repassword")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="history-main">
      <div class="actionDetails">
        <template v-if="actionTableData.length">
          <Timeline
            v-for="item in actionTableData"
            :key="item.id || item.gpstime"
          >
            <TimelineItem v-if="item.postype == 1">
              <p class="time">
                {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
              </p>
              <p class="content">
                {{ $t("LocationIndoorHis.Building") }}{{ item.building }}
              </p>
              <p class="content">
                {{ $t("LocationIndoorHis.floor")
                }}{{ item.groundname || item.ground }}
              </p>
              <p class="content">{{ $t("warning.area1") }}{{ item.tranche }}</p>
              <p class="content">
                {{ $t("tet.Residencetime")
                }}{{ formatSeconds(item.remaintime) }}
              </p>
            </TimelineItem>
            <TimelineItem v-if="item.postype == 2">
              <p class="time">
                {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
              </p>
              <p class="content">{{ $t("warning.area1") }}{{ item.tranche }}</p>
              <p class="content">
                {{ $t("tet.Residencetime")
                }}{{ formatSeconds(item.remaintime) }}
              </p>
            </TimelineItem>
          </Timeline>
        </template>
      </div>

      <div class="mapConent" style="position: relative">
        <Trajectory
          v-if="showTrajectory2d"
          ref="trajectory"
          @closePopup2d="onCloseTrack2d"
          @closePopup="onCloseTrack2d"
        />
        <Trajectorys
          v-if="showTrajectory3d"
          ref="trajectorys"
          @closePopup3d="onCloseTrack3d"
        />
        <div
          v-if="!showTrajectory2d && !showTrajectory3d"
          class="map-empty"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../../common/util";
import {
  getDevGpsAction,
  getMemberTboxAssetName,
  getUsedDeveui,
  getBuildGroundList,
} from "../../axios/api";
import Trajectory from "../staff/trajectory.vue";
import Trajectorys from "../staff/trajectory3d.vue";

export default {
  name: "HistoryTrajectory",
  components: {
    Trajectory,
    Trajectorys,
  },
  data() {
    return {
      i8n: this.$store.state.i18n,
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("staffmanagement.Lasthour1"),
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 1);
              return [start, end];
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour3"),
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              return [start, end];
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour6"),
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              return [start, end];
            },
          },
        ],
      },
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      actionData: {
        projectid: this.$store.state.intoProjectid || this.$store.state.projectid,
        username: "",
        deveui: "",
      },
      actionTableData: [],
      actionTableDataArr: [],
      actionTime: "",
      searchUsername: "",
      searchDeveui: "",
      nameList: [],
      deveuiList: [],
      showTrajectory2d: false,
      showTrajectory3d: false,
      pendingViewTrack: false,
      trackDevType: 1,
    };
  },
  computed: {
    filterLangClass() {
      return this.$store.state.i18n === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    /** 与侧栏菜单一致：员工管理 / 资产管理 / 车辆管理 显示才纳入对应名称 */
    isMenuPartOn(val) {
      return val === true || val === "true" || val === 1 || val === "1";
    },
    /** getMemberTboxAssetName: data = { memberList, tboxList, assetList } */
    normalizeNameOptions(data) {
      const parts = this.$store.state.functionParts || {};
      const showMember = this.isMenuPartOn(parts.employee);
      const showAsset = this.isMenuPartOn(parts.asset);
      // 车辆管理菜单：正向项目(intoProjectType==1) 且开启车辆
      const projectType =
        this.$store.state.intoProjectType ||
        this.$store.state.intoProjectprojectType;
      const showTbox =
        this.isMenuPartOn(parts.tbox) && String(projectType) === "1";

      const rows = [];
      if (Array.isArray(data)) {
        rows.push(...data);
      } else if (data && typeof data === "object") {
        if (showMember) rows.push(...(data.memberList || []));
        if (showTbox) rows.push(...(data.tboxList || []));
        if (showAsset) rows.push(...(data.assetList || []));
      }
      const seen = new Set();
      const options = [];
      for (const item of rows) {
        if (item == null) continue;
        let name = "";
        if (typeof item === "string" || typeof item === "number") {
          name = String(item).trim();
        } else {
          name = String(
            item.username || item.name || item.sn || item.label || item.value || ""
          ).trim();
        }
        if (!name || seen.has(name)) continue;
        seen.add(name);
        options.push({ value: name, label: name });
      }
      return options;
    },
    /** getUsedDeveui: data = { beaconList, devList, devOtherList } 均为字符串数组 */
    normalizeDeveuiOptions(data) {
      const rows = [];
      if (Array.isArray(data)) {
        rows.push(...data);
      } else if (data && typeof data === "object") {
        rows.push(
          ...(data.devList || []),
          ...(data.beaconList || []),
          ...(data.devOtherList || []),
          ...(data.list || [])
        );
      }
      const seen = new Set();
      const options = [];
      for (const item of rows) {
        if (item == null) continue;
        let deveui = "";
        if (typeof item === "string" || typeof item === "number") {
          deveui = String(item).trim();
        } else {
          deveui = String(
            item.deveui || item.maplabel || item.beaconid || item.value || item.label || ""
          ).trim();
        }
        if (!deveui || seen.has(deveui)) continue;
        seen.add(deveui);
        options.push({ value: deveui, label: deveui });
      }
      return options;
    },
    ensureOption(list, value) {
      const v = value == null ? "" : String(value).trim();
      if (!v) return list;
      if (list.some((i) => i.value === v)) return list;
      return [{ value: v, label: v }, ...list];
    },
    onNameSelectChange(val) {
      this.nameList = this.ensureOption(this.nameList, val);
    },
    onDeveuiSelectChange(val) {
      this.deveuiList = this.ensureOption(this.deveuiList, val);
    },
    resetAll() {
      this.searchUsername = "";
      this.searchDeveui = "";
      this.actionTime = "";
      this.actionData.username = "";
      this.actionData.deveui = "";
      this.actionTableData = [];
      this.actionTableDataArr = [];
      this.pendingViewTrack = false;
      this.trackDevType = 1;
      this.clearTrackView();
    },
    getMemberTboxAssetNames() {
      var that = this;
      const projectid =
        this.$store.state.projectid || this.$store.state.intoProjectid;
      if (!projectid) return Promise.resolve();
      return getMemberTboxAssetName(
        { projectid },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.nameList = that.normalizeNameOptions(res.data);
        }
      });
    },
    getUsedDeveuis() {
      var that = this;
      const projectid =
        this.$store.state.projectid || this.$store.state.intoProjectid;
      if (!projectid) return Promise.resolve();
      return getUsedDeveui(
        { projectid },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.deveuiList = that.normalizeDeveuiOptions(res.data);
        }
      });
    },
    /** 接收室内/室外定位等页面跳转带来的名称/设备号参数 */
    applyRouteQuery() {
      const q = (this.$route && this.$route.query) || {};
      const username = q.username ? String(q.username) : "";
      const sn = q.sn ? String(q.sn) : "";
      const perDeveui = q.perDeveui ? String(q.perDeveui) : "";
      const tboxDeveui = q.tboxDeveui ? String(q.tboxDeveui) : "";
      const assetDeveui = q.assetDeveui ? String(q.assetDeveui) : "";
      const deveui = q.deveui
        ? String(q.deveui)
        : perDeveui || tboxDeveui || assetDeveui || "";
      const name = username || sn || "";

      let has = false;
      if (name) {
        this.searchUsername = name;
        this.nameList = this.ensureOption(this.nameList, name);
        this.actionData.username = name;
        has = true;
      }
      if (deveui) {
        this.searchDeveui = deveui;
        this.deveuiList = this.ensureOption(this.deveuiList, deveui);
        this.actionData.deveui = deveui;
        has = true;
      }
      return has;
    },
    ensureDefaultActionTime() {
      if (this.actionTime && this.actionTime.length === 2) return;
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000);
      this.actionTime = [start, end];
    },
    resolveSelection() {
      this.actionData.username = this.searchUsername || "";
      this.actionData.deveui = this.searchDeveui || "";
      if (!this.actionData.username && !this.actionData.deveui) {
        this.$message({
          message: this.$t("locationoutdoor.text3"),
          type: "warning",
        });
        return false;
      }
      this.trackDevType = this.intoProjectType == 1 ? 1 : 2;
      return true;
    },
    buildTimeRange() {
      var that = this;
      if (this.actionTime && this.actionTime.length === 2) {
        if (
          this.actionTime[1].getTime() - this.actionTime[0].getTime() >
          86400000
        ) {
          that.$message({
            message: this.$t("staffmanagement.Thehours"),
            type: "warning",
          });
          return null;
        }
        let begingTime = that.actionTime[0];
        let endTime = that.actionTime[1];
        begingTime = util.formatDate.format(
          new Date(begingTime),
          "yyyy-MM-dd hh:mm:ss"
        );
        endTime = util.formatDate.format(
          new Date(endTime),
          "yyyy-MM-dd hh:mm:ss"
        );
        return {
          begintime: Date.parse(new Date(begingTime)) / 1000,
          endtime: Date.parse(new Date(endTime)) / 1000,
        };
      }
      return {
        begintime: (Date.parse(new Date()) - 1 * 60 * 60 * 1000) / 1000,
        endtime: Date.parse(new Date()) / 1000,
      };
    },
    searchAction() {
      var that = this;
      if (!this.resolveSelection()) {
        return;
      }
      const timeRange = this.buildTimeRange();
      if (!timeRange) {
        return;
      }
      this.actionData.projectid =
        this.$store.state.intoProjectid || this.$store.state.projectid;
      let data = {
        projectid: this.actionData.projectid,
        deveui: this.actionData.deveui,
        username: this.actionData.username,
        begintime: timeRange.begintime,
        endtime: timeRange.endtime,
        devtype: this.trackDevType,
        timezone: this.$store.state.intoProjectTimezone,
      };
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: this.$el,
      });
      getDevGpsAction(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (!res.data.tranchelist || res.data.tranchelist.length == 0) {
            that.$message({
              message: that.$t("staffmanagement.Nodata"),
              type: "warning",
            });
            that.actionTableData = [];
            that.clearTrackView();
            loading.close();
            return;
          }
          that.actionTableData = res.data.tranchelist.reverse();
          for (let i = 0; i < that.actionTableData.length; i++) {
            that.actionTableData[i].gpstime = that.formatDatetime(
              that.actionTableData[i].gpstime
            );
          }
          if (that.pendingViewTrack) {
            that.pendingViewTrack = false;
            that.openTrackMap();
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        loading.close();
      });
    },
    viewTrack() {
      this.pendingViewTrack = true;
      this.searchAction();
    },
    /** 室外 groundid（null/undefined/''/0）归一，避免连续室外被拆成多组 */
    outdoorGroundKey(groundid) {
      if (
        groundid == null ||
        groundid === "" ||
        groundid === 0 ||
        groundid === "0"
      ) {
        return "__outdoor__";
      }
      return groundid;
    },
    splitByGround() {
      this.actionTableDataArr = [];
      if (!this.actionTableData.length) {
        return;
      }
      let newArr = [];
      let list = JSON.parse(JSON.stringify(this.actionTableData));
      let node = list[0];
      list.forEach((item, i) => {
        if (
          this.outdoorGroundKey(item.groundid) ===
          this.outdoorGroundKey(node.groundid)
        ) {
          newArr.push(item);
        } else {
          this.actionTableDataArr.push(newArr);
          node = item;
          newArr = [item];
        }
        if (i == list.length - 1) {
          this.actionTableDataArr.push(newArr);
        }
      });
    },
    openTrackMap() {
      var that = this;
      this.splitByGround();
      if (!this.actionTableDataArr.length) {
        return;
      }
      const timeRange = this.buildTimeRange();
      if (!timeRange) {
        return;
      }
      const begintime = timeRange.begintime;
      const endtime = timeRange.endtime;
      const first = that.actionTableDataArr[0][0];
      const refreshEmbedMapSize = () => {
        that.$nextTick(() => {
          const t2d = that.$refs.trajectory;
          if (t2d && typeof t2d.refreshMapSize === "function") {
            t2d.refreshMapSize();
          } else if (t2d && t2d.map && t2d.map.updateSize) {
            t2d.map.updateSize();
          }
          // 左右分栏布局稳定后再刷一次，避免 OL 按旧窄宽度渲染
          setTimeout(() => {
            if (t2d && typeof t2d.refreshMapSize === "function") {
              t2d.refreshMapSize();
            } else if (t2d && t2d.map && t2d.map.updateSize) {
              t2d.map.updateSize();
            }
          }, 200);
          setTimeout(() => {
            if (t2d && t2d.map && t2d.map.updateSize) {
              t2d.map.updateSize();
            }
          }, 500);
        });
      };
      const runSearch = (maptype) => {
        // 先销毁另一类地图，避免 DOM id 冲突
        if (maptype == 2) {
          that.clearTrack2d();
          that.showTrajectory3d = true;
          that.showTrajectory2d = false;
          that.$nextTick(() => {
            that.$refs.trajectorys &&
              that.$refs.trajectorys.search(
                that.actionTableDataArr,
                begintime,
                endtime,
                that.trackDevType
              );
          });
        } else {
          that.clearTrack3d();
          that.showTrajectory2d = true;
          that.showTrajectory3d = false;
          that.$nextTick(() => {
            if (that.$refs.trajectory) {
              that.$refs.trajectory.search(
                that.actionTableDataArr,
                begintime,
                endtime,
                that.trackDevType
              );
              refreshEmbedMapSize();
            }
          });
        }
      };
      if (
        first &&
        this.outdoorGroundKey(first.groundid) !== "__outdoor__"
      ) {
        getBuildGroundList(
          { groundid: first.groundid },
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001 && res.data.list && res.data.list[0]) {
            runSearch(res.data.list[0].maptype);
          } else {
            runSearch(1);
          }
        });
      } else {
        runSearch(1);
      }
    },
    clearTrack2d() {
      if (this.$refs.trajectory) {
        try {
          this.$refs.trajectory.stop && this.$refs.trajectory.stop(true);
          this.$refs.trajectory.closeTime && this.$refs.trajectory.closeTime();
          this.$refs.trajectory.removeVectorLayer &&
            this.$refs.trajectory.removeVectorLayer();
        } catch (e) {}
      }
      this.showTrajectory2d = false;
    },
    clearTrack3d() {
      if (this.$refs.trajectorys && this.$refs.trajectorys.mapOut) {
        try {
          this.$refs.trajectorys.mapOut();
        } catch (e) {}
      }
      this.showTrajectory3d = false;
    },
    clearTrackView() {
      this.clearTrack2d();
      this.clearTrack3d();
    },
    onCloseTrack2d() {
      this.clearTrack2d();
    },
    onCloseTrack3d() {
      this.clearTrack3d();
    },
    datetimecut(UTCDateString) {
      if (!UTCDateString) {
        return "-";
      }
      function formatFunc(str) {
        return str > 9 ? str : "0" + str;
      }
      var date2 = new Date(UTCDateString);
      var year = date2.getFullYear();
      var mon = formatFunc(date2.getMonth() + 1);
      var day = formatFunc(date2.getDate());
      var hour =
        date2.getHours() < 10 ? "0" + date2.getHours() : date2.getHours();
      var min = formatFunc(date2.getMinutes());
      var sec = formatFunc(date2.getSeconds());
      return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
    },
    formatDatetime(row) {
      if (row == null || row == 0) {
        return "";
      }
      let date = new Date(parseInt(row) * 1000);
      return this.datetimecut(date.toUTCString());
    },
    formatSeconds(value) {
      let result = parseInt(value) || 0;
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
      let res = "";
      if (h !== "00") res += `${h}h`;
      if (m !== "00") res += ` ${m}min`;
      res += ` ${s}s`;
      return res;
    },
  },
  beforeMount() {
    const tasks = [this.getMemberTboxAssetNames(), this.getUsedDeveuis()];
    Promise.all(tasks).then(() => {
      const hasSelection = this.applyRouteQuery();
      if (hasSelection) {
        // 室外定位跳转：默认最近一小时并直接查询，无需再点「查询」
        this.ensureDefaultActionTime();
        this.$nextTick(() => {
          this.viewTrack();
        });
      }
    });
  },
  beforeUnmount() {
    this.clearTrackView();
  },
};
</script>

<style scoped>
.query,
.reset {
  padding: 8px 12px !important;
}
.demo-form-inline :deep(.el-form-item .el-form-item__label) {
  padding: 0;
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-form-item__content) {
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-input__inner) {
  height: 34px !important;
  line-height: 34px !important;
  cursor: text !important;
}
.demo-form-inline :deep(.el-form-item .el-input__icon) {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-range-separator) {
  height: 34px;
  line-height: 34px;
}
div.content {
  position: absolute;
  left: 20px;
  right: 20px;
  width: auto;
  height: 90%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
  padding-top: 12px;
  overflow-x: hidden;
  overflow-y: hidden;
}
.inputContent.outdoor-filter-flow.terminal-filter-flow {
  height: auto;
  width: 100%;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px 16px;
  margin: 0 0 12px;
  padding: 0;
  flex-shrink: 0;
}
.outdoor-filter-flow.terminal-filter-flow
  > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.outdoor-filter-flow.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item
  :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  text-align: right !important;
  line-height: 32px;
  box-sizing: border-box;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.outdoor-filter-flow.terminal-filter-flow.is-en
  .terminal-filter-item
  :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item
  :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item:not(.history-time-item)
  :deep(.el-input),
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item:not(.history-time-item)
  :deep(.el-select) {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  margin: 0 !important;
  flex: none !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .history-time-item
  :deep(.el-date-editor) {
  width: 360px !important;
  min-width: 360px !important;
  max-width: 360px !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item:not(.history-time-item)
  :deep(.el-input__wrapper),
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item:not(.history-time-item)
  :deep(.el-select__wrapper) {
  width: 100% !important;
}
.outdoor-filter-flow.terminal-filter-flow .terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-toolbar-item
  :deep(.el-form-item__content) {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-toolbar-item
  :deep(.el-button) {
  margin: 0 !important;
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}
.outdoor-filter-flow.terminal-filter-flow .el-form-item .el-button {
  margin-left: 0 !important;
}
.history-main {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box;
  overflow: hidden;
}
.history-main > * {
  /* 抵消 App.vue * { margin: 0 auto } 把 flex 子项收成窄条居中 */
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.actionDetails {
  flex: 0 0 16%;
  width: 16%;
  max-width: 16%;
  min-width: 160px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start !important;
  align-items: stretch;
  align-content: flex-start;
  gap: 8px;
  text-align: left !important;
  margin: 0 !important;
  padding: 10px 8px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
}
.actionDetails > * {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}
.actionDetails :deep(.el-timeline) {
  flex: 0 0 auto;
  width: 100% !important;
  min-width: 0;
  max-width: 100%;
  margin: 0 !important;
  padding-left: 4px;
  text-align: left;
  box-sizing: border-box;
}
.actionDetails :deep(.el-timeline-item),
.actionDetails :deep(.el-timeline-item__wrapper),
.actionDetails :deep(.el-timeline-item__content) {
  text-align: left !important;
}
.actionDetails :deep(.el-timeline-item__content) p,
.actionDetails :deep(.el-timeline-item__content) .time,
.actionDetails :deep(.el-timeline-item__content) .content {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: auto;
  max-width: 100%;
  white-space: normal;
  word-break: break-word;
  text-align: left !important;
}
div.mapConent {
  display: flex !important;
  flex-direction: column;
  flex: 1 1 0 !important;
  align-self: stretch !important;
  width: auto !important;
  max-width: none !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: 100% !important;
  margin: 0 !important;
  box-sizing: border-box;
}
/* 内嵌 trajectory 铺满；勿强改 canvas 尺寸，交给 OL updateSize */
div.mapConent > :deep(.mapConent),
div.mapConent :deep(.mapContent),
div.mapConent :deep(.control_div),
div.mapConent :deep(.progress_div),
div.mapConent :deep(.progress-row),
div.mapConent :deep(.block),
div.mapConent :deep(.allmap),
div.mapConent :deep(#allmap),
div.mapConent :deep(.ol-viewport) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box;
}
div.mapConent > :deep(.mapConent) {
  flex: 1 1 0 !important;
  align-self: stretch !important;
  height: 100% !important;
  min-height: 0 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}
div.mapConent :deep(.control_div) {
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: space-between !important;
  flex-shrink: 0 !important;
  overflow: hidden !important;
}
div.mapConent :deep(.progress_div) {
  flex-direction: column !important;
  flex-wrap: nowrap !important;
  flex-shrink: 0 !important;
  overflow: hidden !important;
}
div.mapConent :deep(.block) {
  justify-content: flex-start !important;
  gap: 24px !important;
  flex: 1 1 auto !important;
  width: auto !important;
  max-width: calc(100% - 160px) !important;
}
div.mapConent :deep(.progresstime-out) {
  position: static !important;
  flex: 0 0 auto !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin: 0 4px 0 auto !important;
  text-align: right !important;
  white-space: nowrap !important;
  font-size: 18px !important;
}
div.mapConent :deep(.progresstime-out .progresstime-line),
div.mapConent :deep(.progresstime-out .progresstime-sep) {
  font-size: 18px !important;
}
div.mapConent :deep(.block-group),
div.mapConent :deep(.block-group > *),
div.mapConent :deep(.block .speed-slider),
div.mapConent :deep(.block .show_line),
div.mapConent :deep(.block .restart) {
  margin-left: 0 !important;
  margin-right: 0 !important;
  flex: 0 0 auto !important;
}
div.mapConent :deep(.block-actions .el-button + .el-button) {
  margin-left: 8px !important;
}
div.mapConent :deep(.mapContent) {
  flex: 1 1 0 !important;
  min-height: 0 !important;
  height: auto !important;
  overflow: hidden !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  background: #fff !important;
}
div.mapConent :deep(.allmap),
div.mapConent :deep(#allmap) {
  flex: 1 1 0 !important;
  min-height: 200px !important;
  height: 100% !important;
}
div.mapConent :deep(#fengmap) {
  height: calc(100% - 70px) !important;
  width: 100% !important;
}
.map-empty {
  flex: 1;
  min-height: 0;
  width: 100%;
  background: #fff;
}
</style>
