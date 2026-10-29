<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
      告警管理
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum == 3 || contrForPrionum == 4"
          ><Data
        /></el-aside>
        <el-main>
          <div class="warning_input terminal-filter-flow" :class="filterLangClass">
            <el-form class="demo-form-inline terminal-filter-form">
              <el-form-item
                :label="$t('warning.DeviceNo')"
                class="terminal-filter-item"
              >
                <el-input
                  v-model="searchList.deveui"
                  :placeholder="$t('warning.text')"
                ></el-input>
              </el-form-item>

              <el-form-item
                v-if="contrForPrionum == 5"
                :label="$t('warning.name')"
                class="terminal-filter-item"
              >
                <el-input
                  v-model="searchList.username"
                  :placeholder="$t('warning.text1')"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('warning.type')"
                class="terminal-filter-item"
              >
                <el-select
                  v-model="searchList.devtype"
                  :placeholder="$t('warning.text2')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in intoProjectType == 1
                      ? searchDevtypeList1
                      : searchDevtypeList2"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('warning.AlertType')"
                class="terminal-filter-item"
              >
                <el-select
                  v-model="types"
                  clearable
                  :placeholder="$t('warning.text3')"
                >
                  <el-option
                    v-for="item in contrForPrionum == 5 ? typeList1 : typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('warning.state')"
                class="terminal-filter-item"
              >
                <el-select
                  v-model="searchList.status"
                  clearable
                  :placeholder="$t('warning.text3')"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('warning.time')"
                class="terminal-filter-item"
              >
                <el-date-picker
                  v-model="tasktime"
                  type="datetimerange"
                  :shortcuts="pickerOptions.shortcuts"
                  :disabled-date="pickerOptions.disabledDate"
                  @calendar-change="(val) => pickerOptions.onPick && pickerOptions.onPick({ minDate: val[0], maxDate: val[1] })"
                  :range-separator="$t('beacon.to')"
                  :start-placeholder="$t('beacon.starttime')"
                  :end-placeholder="$t('beacon.endtime')"
                ></el-date-picker>
              </el-form-item>
            </el-form>

            <div class="search-actions terminal-toolbar-item">
              <div class="terminal-toolbar-row">
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("beacon.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("beacon.reset")
                }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="delWarningList()"
                  >{{ $t("warning.batchdeletion") }}</el-button>
              </div>
            </div>
          </div>
          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              style="
                width: 98%;
                text-align: center;
                margin-left: 2%;
                z-index: 1;
              "
              border
              highlight-current-row
              max-height="660"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('warning.DeviceNo1')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDeveui"
              >
              </el-table-column>
              <el-table-column
                property="username"
                :label="$t('warning.name1')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
                property="projectname"
                :label="$t('staff.projectname')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'statustr' : 'enstatus'"
                :label="$t('warning.state1')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="tranche"
                :label="$t('warning.area')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'typestr' : 'entype'"
                :label="$t('warning.AlertType1')"
                show-overflow-tooltip
                align="center"
                :formatter="formatAlertType"
              >
              </el-table-column>
              <el-table-column
                property="time"
                :label="$t('warning.time1')"
                show-overflow-tooltip
                :formatter="formatDatetime"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="statustime"
                :label="$t('warning.Clearalarmtime')"
                show-overflow-tooltip
                :formatter="formatDatetime1"
                align="center"
              >
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('warning.operate')"
                align="center"
                min-width="90"
              >
                <template #default="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('terminal.position')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="small"
                      class="icon_button"
                      @click="goLocation(scope.row)"
                      v-if="contrForPrionum == 5"
                    >
                      <img src="../../../static/location.png"
                    /></el-button>
                  </el-tooltip>
                  <el-tooltip
                    v-if="isHealthType(scope.row.type)"
                    class="item"
                    effect="dark"
                    :content="$t('staff.health')"
                    placement="top-start"
                  >
                    <el-button
                      type="primary"
                      size="small"
                      class="edits icon_button"
                      @click="openHealthDialog(scope.row)"
                    >
                      <el-icon :size="16"><FirstAidKit /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('nsconfig.delete')"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      size="small"
                      class="edits icon_button"
                      @click="DelWarningCommand(scope.row)"
                      ><img src="../../../static/delete.png"
                    /></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div
              class="block"
              style="text-align: center; width: 100%; margin-top: 1%"
            >
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-model:current-page="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                v-model:page-size="pageCount"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 批量删除 -->
          <el-dialog :title="$t('warning.title')" v-model="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="deveui"
                :label="$t('warning.DeviceNo1')"
                show-overflow-tooltip
                :formatter="formatDeveui"
              >
              </el-table-column>
              <el-table-column
                property="projectname"
                :label="$t('beacon.projectname')"
                show-overflow-tooltip
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'typestr' : 'entype'"
                :label="$t('warning.AlertType1')"
                show-overflow-tooltip
                :formatter="formatAlertType"
              >
              </el-table-column>
              <el-table-column
                property="time"
                :label="$t('warning.time1')"
                show-overflow-tooltip
                :formatter="formatDatetime"
              >
              </el-table-column>
            </el-table>
            <template #footer><div class="dialog-footer">
              <el-button @click="(del = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="deleteTrue()"
                >{{ $t("warning.Sure") }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 心率/体温异常告警：健康数据折线图 -->
          <el-dialog
            :title="healthTitle"
            v-model="healthDialog"
            width="70%"
            @opened="onHealthDialogOpened"
            @closed="disposeHealthChart"
          >
            <div style="text-align: left; color: #666; margin-bottom: 8px">
              {{ healthRangeText }}
            </div>
            <div
              v-if="healthEmpty"
              style="text-align: center; color: #999; padding: 40px 0"
            >
              {{ $t("staff.healthEmpty") }}
            </div>
            <div
              v-else
              ref="healthChart"
              style="width: 100%; height: 320px"
              v-loading="healthLoading"
            ></div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Data from "../../components/data/data";
import { getWarningList, delWarning, getDevHealthListAsc } from "../../axios/api";
import util from "../../common/util";
import { FirstAidKit } from "@element-plus/icons-vue";
import { jumpToWarningLocation } from "../../utils/warningLocation";
export default {
  components: {
    Menu,
    Data,
    FirstAidKit,
  },
  name: "WarningManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      projectid: this.$store.state.projectid,
      delprio: this.$store.state.userInfo.delprio,
      intoProjectType: this.$store.state.intoProjectType,
      tableData: [],
      multipleSelection: [],
      currentPage1: 1,
      total: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("terminal.pickeroptions4"),
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0));
              // start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1);
              // end.setTime(end.setHours(0, 0, 0, 0));
              return [start, end];
            },
          },
          {
            text: this.$t("terminal.pickeroptions5"),
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2);
              // end.setTime(end.setHours(0, 0, 0, 0));
              return [start, end];
            },
          },
          {
            text: this.$t("terminal.pickeroptions6"),
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6);
              // end.setTime(end.setHours(0, 0, 0, 0));
              return [start, end];

              // const end = new Date();
              // const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              // picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tasktime: [],
      begingTime: "",
      endTime: "",
      types: "",
      searchList: {
        superid: this.$store.state.userInfo.superid,
        projectid: this.$store.state.intoProjectid,
        page: 1,
        count: 20,
        type: 0,
        begintime: "",
        endtime: "",
        deveui: "",
        status: "",
        username: "",
        devtype: "",
        endtype: "",
      },
      pageCount: 20,
      del: false,
      loading: false,
      deleteData: [],

      searchDevtypeList1: [
        {
          index: 1,
          value: this.$t("warning.people"),
        },
        {
          index: 3,
          value: this.$t("warning.assets"),
        },
        {
          index: 4,
          value: this.$t("warning.vehicle"),
        },
      ],
      searchDevtypeList2: [
        {
          index: 2,
          value: this.$t("warning.people"),
        },
        {
          index: 3,
          value: this.$t("warning.assets"),
        },
      ],
      //状态：仅未解除 / 已解除，与告警类型无关
      statusList: [
        {
          index: 1,
          value: this.$t("warning.Notreleased"),
        },
        {
          index: 2,
          value: this.$t("warning.Released"),
        },
      ],
      //告警类型（typeList / typeList1 保持一致）
      typeList: [
        {
          index: 1,
          value: this.$t("warning.SOSalarm"),
        },
        {
          index: 2,
          value: this.$t("warning.Aggregatealarm"),
        },
        {
          index: 3,
          value: this.$t("warning.Passingalarm"),
        },
        {
          index: 4,
          value: this.$t("warning.Detentionalarm"),
        },
        {
          index: 5,
          value: this.$t("warning.Abnormalstatic"),
        },
        {
          index: 6,
          value: this.$t("warning.Tilt"),
        },
        {
          index: 7,
          value: this.$t("warning.Dumpalarm"),
        },
        {
          index: 8,
          value: this.$t("warning.Firealarm"),
        },
        {
          index: 9,
          value: this.$t("warning.CloseContact"),
        },
        {
          index: 10,
          value: this.$t("warning.DoorOpenalarm"),
        },
        {
          index: 11,
          value: this.$t("warning.LowBatteryAlarm"),
        },
        {
          index: 12,
          value: this.$t("warning.HeartbeatAbnormal"),
        },
        {
          index: 13,
          value: this.$t("warning.TemperatureAbnormal"),
        },
      ],

      typeList1: [
        {
          index: 1,
          value: this.$t("warning.SOSalarm"),
        },
        {
          index: 2,
          value: this.$t("warning.Aggregatealarm"),
        },
        {
          index: 3,
          value: this.$t("warning.Passingalarm"),
        },
        {
          index: 4,
          value: this.$t("warning.Detentionalarm"),
        },
        {
          index: 5,
          value: this.$t("warning.Abnormalstatic"),
        },
        {
          index: 6,
          value: this.$t("warning.Tilt"),
        },
        {
          index: 7,
          value: this.$t("warning.Dumpalarm"),
        },
        {
          index: 8,
          value: this.$t("warning.Firealarm"),
        },
        {
          index: 9,
          value: this.$t("warning.CloseContact"),
        },
        {
          index: 10,
          value: this.$t("warning.DoorOpenalarm"),
        },
        {
          index: 11,
          value: this.$t("warning.LowBatteryAlarm"),
        },
        {
          index: 12,
          value: this.$t("warning.HeartbeatAbnormal"),
        },
        {
          index: 13,
          value: this.$t("warning.TemperatureAbnormal"),
        },
      ],
      // 心率/体温异常告警的健康数据弹框
      healthDialog: false,
      healthLoading: false,
      healthMetric: "heartrate", // heartrate | tem
      healthTitle: "",
      healthRangeText: "",
      healthData: [],
      healthEmpty: false,
      healthChartInst: null,
    };
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    //重置状态选择框选项
    resetStatus() {
      this.statusList = [
        {
          index: 1,
          value: this.$t("warning.Notreleased"),
        },
        {
          index: 2,
          value: this.$t("warning.Released"),
        },
      ];
    },
    // utc转本地
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
      var dateStr =
        year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
      return dateStr;
    },
    //时间转换
    formatDatetime(row, colum) {
      if (row.time == null || row.time == 0) {
        return "";
      }
      let date = new Date(parseInt(row.time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    formatDatetime1(row, colum) {
      if (row.statustime == null || row.statustime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.statustime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    // 聚集告警：新数据 deveui 为门限级别（1/2/3…），旧数据可能是区域名称
    isGatherType(type) {
      return Number(type) === 2;
    },
    isGatherLevelValue(deveui) {
      return /^[1-9]\d*$/.test(String(deveui == null ? "" : deveui).trim());
    },
    // 聚集级别：中文用一/二/三，英文用罗马数字Ⅰ/Ⅱ/Ⅲ
    formatGatherLevelLabel(level) {
      const n = Number(level);
      if (!(n >= 1 && n <= 10)) return String(level);
      const lang = this.i8n || this.$store.state.i18n;
      if (lang === "en") {
        return ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ"][n];
      }
      return ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][n];
    },
    formatDeveui(row) {
      if (this.isGatherType(row.type)) {
        const level = String(row.deveui == null ? "" : row.deveui).trim();
        if (!level) return "-";
        // 仅纯数字级别显示「N级聚集告警」；旧数据区域名原样展示
        if (this.isGatherLevelValue(level)) {
          return this.$t("warning.gatherLevelAlarm", {
            n: this.formatGatherLevelLabel(level),
          });
        }
        return level;
      }
      return row.deveui || "-";
    },
    // 低电 / 心率异常 / 体温异常：类型后附带 memo 实测值
    formatAlertType(row) {
      const typeName = this.i8n == "zh" ? row.typestr : row.entype;
      const type = Number(row.type);
      const memo = row.memo;
      if (
        (type === 11 || type === 12 || type === 13) &&
        memo !== "" &&
        memo != null &&
        memo !== undefined
      ) {
        return `${typeName || ""}（${memo}）`;
      }
      return typeName || "-";
    },

    // 心率异常(12) / 体温异常(13) 才显示健康数据按钮
    isHealthType(type) {
      var t = Number(type);
      return t === 12 || t === 13;
    },
    // 秒级时间戳转本地时间字符串
    formatTimeStamp(sec) {
      if (!sec) return "-";
      return util.formatDate.format(
        new Date(parseInt(sec) * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    // 打开健康数据弹框：以告警时间为中点，取前后 1 小时
    openHealthDialog(row) {
      var that = this;
      var isHeart = Number(row.type) === 12;
      this.healthMetric = isHeart ? "heartrate" : "tem";
      this.healthTitle = isHeart
        ? this.$t("staff.healthHeartrate") +
          "（" +
          this.$t("staff.healthUnitBpm") +
          "）"
        : this.$t("staff.healthTemperature") +
          "（" +
          this.$t("staff.healthUnitCelsius") +
          "）";
      var center = parseInt(row.time) || 0;
      var begin = center - 3600;
      var end = center + 3600;
      this.healthRangeText =
        this.formatTimeStamp(begin) + " ~ " + this.formatTimeStamp(end);
      this.healthData = [];
      this.healthEmpty = false;
      this.disposeHealthChart();
      this.healthDialog = true;
      this.$nextTick(() => {
        that.fetchHealthData(row, begin, end);
      });
    },
    // 调用 getDevHealthListAsc 拉取告警时间点前后 1 小时的数据
    fetchHealthData(row, begin, end) {
      var that = this;
      var query = {
        projectid:
          row.projectid ||
          this.projectid ||
          this.$store.state.intoProjectid ||
          "",
        username: row.username,
        begintime: begin,
        endtime: end,
      };
      this.healthLoading = true;
      getDevHealthListAsc(
        query,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          that.healthData = res && res.data ? res.data : [];
          that.renderHealthChart();
        })
        .catch((err) => {
          console.error("getDevHealthListAsc error:", err);
          that.healthData = [];
          that.healthEmpty = true;
        })
        .finally(() => {
          that.healthLoading = false;
        });
    },
    disposeHealthChart() {
      if (this.healthChartInst) {
        this.healthChartInst.dispose();
        this.healthChartInst = null;
      }
    },
    onHealthDialogOpened() {
      if (this.healthChartInst) this.healthChartInst.resize();
    },
    // 渲染单指标（心率或体温）折线图
    renderHealthChart() {
      var that = this;
      this.disposeHealthChart();
      this.$nextTick(() => {
        var list = that.healthData || [];
        var isHeart = that.healthMetric === "heartrate";
        var fullTimes = [];
        var rawTimes = [];
        var values = [];
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var t = item.dataTime ? item.dataTime * 1000 : null;
          rawTimes.push(t);
          fullTimes.push(that.formatTimeStamp(item.dataTime));
          var v = isHeart ? item.heartrate : item.tem;
          // 0 视为未读数（设备未上报有效值），置为 null 避免误导
          values.push(v > 0 ? v : null);
        }
        var hasValue = false;
        for (var k = 0; k < values.length; k++) {
          if (values[k] !== null) {
            hasValue = true;
            break;
          }
        }
        that.healthEmpty = !hasValue;
        if (that.healthEmpty) return;
        // 同一天只显示时分秒；跨天时补上日期，保证时间可辨识
        var sameDay = true;
        if (rawTimes.length > 1 && rawTimes[0] && rawTimes[rawTimes.length - 1]) {
          sameDay =
            new Date(rawTimes[0]).toDateString() ===
            new Date(rawTimes[rawTimes.length - 1]).toDateString();
        }
        var axisPattern = sameDay ? "hh:mm:ss" : "MM-dd hh:mm";
        var axisTimes = [];
        for (var j = 0; j < rawTimes.length; j++) {
          axisTimes.push(
            rawTimes[j]
              ? util.formatDate.format(new Date(rawTimes[j]), axisPattern)
              : "-"
          );
        }
        var seriesName = isHeart
          ? that.$t("staff.healthHeartrate")
          : that.$t("staff.healthTemperature");
        var unit = isHeart
          ? that.$t("staff.healthUnitBpm")
          : that.$t("staff.healthUnitCelsius");
        var option = {
          tooltip: {
            trigger: "axis",
            formatter: function (params) {
              if (!params || !params.length) return "";
              var p = params[0];
              var full = fullTimes[p.dataIndex] || p.axisValue;
              var val = p.value === null || p.value === undefined ? "-" : p.value;
              return full + "<br/>" + p.marker + seriesName + "：" + val + unit;
            },
          },
          // containLabel: true 让 echarts 自动预留坐标轴文字空间，标签不会被画布裁切
          grid: {
            left: 10,
            right: 24,
            top: 24,
            bottom: 10,
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: axisTimes,
            boundaryGap: false,
            axisTick: { alignWithLabel: true },
            axisLabel: {
              rotate: 0,
              fontSize: 11,
              margin: 10,
              hideOverlap: true,
              interval: "auto",
            },
          },
          yAxis: {
            type: "value",
            axisLabel: { fontSize: 11, margin: 10 },
            splitLine: { lineStyle: { type: "dashed" } },
          },
          series: [
            {
              name: seriesName,
              type: "line",
              smooth: false,
              connectNulls: false,
              symbolSize: 6,
              data: values,
            },
          ],
        };
        var el = that.$refs.healthChart;
        if (!el) return;
        var inst = that.$echarts.init(el);
        that.healthChartInst = inst;
        inst.setOption(option);
        inst.resize();
      });
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getWarningLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getWarningLists();
    },
    getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    },
    //查询
    searchInfo() {
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.tasktime && this.tasktime.length > 0) {
        this.searchList.begintime =
          Date.parse(new Date(this.tasktime[0])) / 1000;
        this.searchList.endtime = Date.parse(new Date(this.tasktime[1])) / 1000;
      } else {
        this.searchList.begintime = "";
        this.searchList.endtime = "";
      }
      if (!this.types) {
        if (that.contrForPrionum == 5) {
          that.searchList.type = "";
          that.searchList.endtype = "";
        } else {
          that.searchList.type = "";
          that.searchList.endtype = "";
        }
      } else {
        that.searchList.type = that.types;
      }
      getWarningList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          if (res.data.size > 0) {
            that.$message({
              message: that.$t("beacon.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("beacon.nodata"),
              type: "warning",
            });
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    //刷新
    clearBtn() {
      this.currentPage1 = 1;
      this.resetStatus();
      this.tasktime = [];

      if (this.contrForPrionum == 5) {
        this.searchList = {
          superid: this.$store.state.userInfo.superid,
          deveui: "",
          projectid: this.$store.state.intoProjectid,
          type: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
          status: "",
          username: "",
          devtype: "",
          endtype: 13,
        };
        this.types = "";
        this.getWarningLists();
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        this.searchList = {
          superid: this.$store.state.userInfo.tenantid,
          deveui: "",
          projectid: "",
          type: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
          status: "",
          devtype: "",
          endtype: "",
        };
        this.types = "";
        this.getWarningLists();
      }
    },

    //删除
    DelWarningCommand(row) {
      var that = this;
      if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        this.$message({
          message: this.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      } else if (
        row.status == 1 &&
        row.type == 1
      ) {
        this.$message({
          message: this.$t("tet.tet7"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("beacon.deletemsg1") +
          row.deveui +
          this.$t("beacon.deletemsg3"),
        this.$t("beacon.prompt"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let data;
          if (this.contrForPrionum == 5) {
            data = {
              tenantid: this.$store.state.userInfo.superid,
              ids: [row.id],
            };
          } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
            data = {
              tenantid: this.$store.state.userInfo.tenantid,
              ids: [row.id],
            };
          }

          data.ids = JSON.stringify(data.ids);
          delWarning(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.getWarningLists();
              that.$message({
                message: that.$t("beacon.deletesuccess"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    delWarningList(index) {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg44"),
          type: "warning",
        });
        return;
      } else if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        this.$message({
          message: this.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[i].status == 1 &&
          this.multipleSelection[i].type == 1
        ) {
          this.$message({
            message: this.$t("tet.tet7"),
            type: "warning",
          });
          return;
        }
      }

      this.deleteData = this.multipleSelection;
      this.del = true;
    },
    deleteTrue() {
      var that = this;
      let data = {
        tenantid: this.tenantid_A,
        ids: [],
      };
      if (this.contrForPrionum == 5) {
        data = {
          tenantid: this.$store.state.userInfo.superid,
          ids: [],
        };
      }
      for (let i = 0; i < this.deleteData.length; i++) {
        data.ids.push(this.deleteData[i].id);
      }
      data.ids = JSON.stringify(data.ids);
      this.loading = true;
      delWarning(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            this.del = false;
            that.getWarningLists();
            that.$message({
              message: that.$t("beacon.deletesuccess"),
              type: "success",
            });
            that.loading = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            that.loading = false;
          }
        }
      );
    },

    //刚进页面获取数据
    getWarningLists() {
      getWarningList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.tableData = res.data.list;
          this.total = res.data.size;
        }
      });
    },
    //从其他页面跳转过来获取未处理的数据
    getWarningLists2() {
      let data = {
        superid: this.$store.state.userInfo.superid,
        projectid: this.$store.state.intoProjectid,
        status: 1,
        page: 1,
        count: 20,
      };
      getWarningList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.tableData = res.data.list;
          this.total = res.data.size;
        }
      });
    },

    // 点击跳转到定位页面
    goLocation(row) {
      // 无 postype 不可跳；有则查 getWarningPointByWarningid 再进室内/室外
      return jumpToWarningLocation(this, row, { active: row.status == 1 });
    },
  },
  beforeMount() {
    if (this.contrForPrionum == 5) {
      this.searchList = {
        superid: this.$store.state.userInfo.superid,
        deveui: "",
        projectid: this.$store.state.intoProjectid,
        type: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        status: "",
        devtype: "",
        endtype: 13,
      };

      // 判断是否从首页点击跳转过来
      if (this.$route.query.warningtype) {
        this.searchList.type = this.$route.query.warningtype;
        this.searchList.status = Number(this.$route.query.statustype);
        this.types = Number(this.$route.query.warningtype);
        const start = new Date();
        start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6);
        this.searchList.begintime = Date.parse(start) / 1000;
      } else {
        this.types = "";
      }

      this.getWarningLists();
      this.statusList = [
        {
          index: 1,
          value: this.$t("warning.Notreleased"),
        },
        {
          index: 2,
          value: this.$t("warning.Released"),
        },
      ];
    } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
      this.searchList = {
        superid: this.$store.state.userInfo.tenantid,
        deveui: "",
        projectid: "",
        type: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        status: "",
        devtype: "",
        endtype: "",
      };
      this.getWarningLists();
    }
  },

  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.searchDevtypeList1,
        this.$options.data.call(this).searchDevtypeList1
      );
      Object.assign(
        this.$data.searchDevtypeList2,
        this.$options.data.call(this).searchDevtypeList2
      );
      Object.assign(
        this.$data.statusList,
        this.$options.data.call(this).statusList
      );
      Object.assign(
        this.$data.typeList,
        this.$options.data.call(this).typeList
      );
      Object.assign(
        this.$data.typeList1,
        this.$options.data.call(this).typeList1
      );
      Object.assign(
        this.$data.pickerOptions,
        this.$options.data.call(this).pickerOptions
      );
    },
  },
};
</script>

<style scoped>
.home {
  height: 100%;
  margin-right: calc(102% - 100vw);
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
.el-message {
  display: -webkit-box !important;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
/* 改变按钮颜色 */
.edits:hover {
  background-color: rgb(196, 27, 27);
}
.icon_button:hover {
  background-color: rgb(25, 86, 201);
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
.querry,
.query,
.reset {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 1 !important;
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
.demo-form-inline :deep(.el-form-item .el-range-separator) {
  height: 34px;
  line-height: 34px;
}

.warning_input.terminal-filter-flow {
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px 16px;
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 16px;
}
.warning_input.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.warning_input.terminal-filter-flow > .terminal-filter-form > .el-form-item,
.warning_input.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: 0 !important;
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
.warning_input.terminal-filter-flow.is-en .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: 0 !important;
}
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
}
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-input),
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-select),
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  float: none !important;
  margin: 0 !important;
  flex: none !important;
}
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor.el-input__wrapper),
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--datetimerange) {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-input__wrapper),
.warning_input.terminal-filter-flow .terminal-filter-item :deep(.el-select__wrapper) {
  width: 100% !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  order: 999;
}
.terminal-toolbar-row {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
  width: auto !important;
  margin: 0 !important;
}
.terminal-toolbar-row > *,
.terminal-toolbar-row :deep(.el-button) {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
.terminal-filter-more {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  color: #409eff;
  margin: 0 !important;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.terminal-toolbar-item :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}
.search-actions :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}

</style>

<style>
.terminal-filter-flow {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px 16px !important;
  margin-bottom: 16px !important;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item {
  margin: 0 !important;
  width: auto !important;
  flex: 0 0 auto !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow.is-en .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: 0 !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__content {
  margin-left: 0 !important;
}
.terminal-filter-flow .terminal-filter-item .el-input,
.terminal-filter-flow .terminal-filter-item .el-select,
.terminal-filter-flow .terminal-filter-item .el-cascader {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  margin: 0 !important;
  float: none !important;
}
.terminal-filter-flow .terminal-filter-item .el-date-editor.el-input__wrapper,
.terminal-filter-flow .terminal-filter-item .el-date-editor--datetimerange,
.terminal-filter-flow .terminal-filter-item .el-date-editor--daterange {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  order: 999;
}
.terminal-toolbar-row {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.terminal-toolbar-row > .el-button,
.terminal-toolbar-row > .terminal-filter-more {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row .el-button,
.terminal-toolbar-row > .el-dropdown .el-button,
.terminal-toolbar-item .el-button,
.search-actions .el-button {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

</style>

