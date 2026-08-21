<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Asset /> </el-aside>
        <el-main>
          <div class="checkwork_input terminal-filter-flow" :class="filterLangClass">
            <el-form
              class="demo-form-inline terminal-filter-form"
              :model="searchList"
            >
              <el-form-item
                :label="$t('checkwork.Label')"
               class="terminal-filter-item">
                <el-input
                  v-model="searchList.maplabel"
                  :placeholder="$t('checkwork.title')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('checkwork.Name')"
               class="terminal-filter-item">
                <el-input
                  v-model="searchList.username"
                  :placeholder="$t('checkwork.title1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('checkwork.State')"
               class="terminal-filter-item">
                <el-select
                  v-model="searchList.status"
                  :placeholder="$t('checkwork.title2')"
                  clearable
                  filterable
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
                :label="$t('checkwork.Time')"
               class="terminal-filter-item">
                <el-date-picker
                  v-model="tasktime"
                  type="daterange"
                  :range-separator="$t('checkwork.to')"
                  :start-placeholder="$t('checkwork.starttime')"
                  :end-placeholder="$t('checkwork.endtime')"
                  :shortcuts="pickerOptions.shortcuts" :disabled-date="pickerOptions.disabledDate" @calendar-change="(val) => pickerOptions.onPick && pickerOptions.onPick({ minDate: val[0], maxDate: val[1] })"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="terminal-toolbar-item">
                <el-button
                  type="primary"
                  class="querry"
                  @click="searchInfo()"
                  >{{ $t("checkwork.search") }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("checkwork.reset")
                }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="delCheckList()"
                  >{{ $t("checkwork.batchdeletion") }}</el-button>
              </el-form-item>
            </el-form>
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
              max-height="660"
              border
              highlight-current-rowh
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                property="maplabel"
                :label="$t('checkwork.labelnumber')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="username"
                :label="$t('checkwork.name')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'statustr' : 'enstatus'"
                :label="$t('checkwork.state')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                v-if="intoProjectType == 1"
                property="steps"
                :label="$t('checkwork.Stepcount')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="retime"
                :label="$t('checkwork.date')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="firstime"
                :label="$t('checkwork.recordtime')"
                show-overflow-tooltip
                :formatter="formatDatefirstime"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="lastime"
                :label="$t('checkwork.departuretime')"
                show-overflow-tooltip
                :formatter="formatDatelastime"
                align="center"
              >
              </el-table-column>
            </el-table>
            <!-- 分页 -->
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
          <el-dialog :title="$t('checkwork.title3')" v-model="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="maplabel"
                :label="$t('checkwork.labelnumber')"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="username"
                :label="$t('checkwork.name')"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'statustr' : 'enstatus'"
                :label="$t('checkwork.state')"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="steps"
                :label="$t('checkwork.Stepcount')"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="firstime"
                :label="$t('checkwork.recordtime')"
                show-overflow-tooltip
                :formatter="formatDatefirstime"
              >
              </el-table-column>
              <el-table-column
                property="lastime"
                :label="$t('checkwork.departuretime')"
                show-overflow-tooltip
                :formatter="formatDatelastime"
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
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import host from "../../host";
import Menu from "../../components/menu/Menu";
import basecard from "../../components/card/base-card";
import Asset from "../../components/asset/asset.vue";

import { getAttendanceList, delAttendance } from "../../axios/api";
import util from "../../common/util";
export default {
  components: {
    Menu,
    basecard,
    Asset,
  },
  name: "CheckWork",
  data() {
    return {
      i8n: this.$store.state.i18n,
      //时间选择限制,设置选择今天以前的日期
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
              return [start, end];

              // const end = new Date();
              // const start = new Date();
              // start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 7);
              // end.setTime(end.setHours(0, 0, 0, 0));
              // picker.$emit("pick", [start, end]);

              // const end = new Date();
              // const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              // picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      projectid: this.$store.state.intoProjectid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      intoProjectType: this.$store.state.intoProjectType,
      tableData: [],
      multipleSelection: [],
      tasktime: [],
      begingTime: "",
      endTime: "",
      searchList: {
        maplabel: "",
        username: "",
        status: "",
        projectid: this.$store.state.intoProjectid,
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        // timezone: this.$store.state.intoProjectTimezone,
      },

      total: 0,
      pageCount: 20,
      currentPage1: 1,
      statusList: [
        {
          index: 1,
          value: this.$t("checkwork.Attendance"),
        },
        {
          index: 2,
          value: this.$t("checkwork.Noattendance"),
        },
        {
          index: 3,
          value: this.$t("checkwork.Notclockedin"),
        },
      ],

      del: false,
      loading: false,
      deleteData: [],
    };
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
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
    formatDatefirstime(row, colum) {
      if (row.firstime == null || row.firstime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.firstime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDatelastime(row, colum) {
      if (row.lastime == null || row.lastime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.lastime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    //获取考勤信息
    getAttendanceLists() {
      var that = this;
      getAttendanceList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
        }
      });
    },

    //查询
    searchInfo() {
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.tasktime && this.tasktime.length > 0) {
        that.begingTime = that.tasktime[0];
        that.endTime = that.tasktime[1];
      } else {
        that.begingTime = "";
        that.endTime = "";
      }
      that.begingTime =
        !that.begingTime || that.begingTime == ""
          ? ""
          : util.formatDate.format(
              new Date(that.begingTime),
              "yyyy-MM-dd hh:mm:ss"
            );
      that.endTime =
        !that.endTime || that.endTime == ""
          ? ""
          : util.formatDate.format(
              new Date(that.endTime),
              "yyyy-MM-dd hh:mm:ss"
            );
      if (that.begingTime.length > 0 && that.endTime.length > 0) {
        that.begingTime = Date.parse(new Date(that.begingTime));
        that.endTime = Date.parse(new Date(that.endTime));
        this.searchList.begintime = this.getDate(this.begingTime);
        this.searchList.endtime = this.getDate(this.endTime);
      } else {
        this.searchList.begintime = "";
        this.searchList.endtime = "";
      }
      getAttendanceList(
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
    //转换时间方法
    getDate(date) {
      //date是传过来的时间戳，注意需为13位，10位需*1000
      //也可以不传,获取的就是当前时间
      var time = new Date(date);
      var year = time.getFullYear(); //年
      var month = ("0" + (time.getMonth() + 1)).slice(-2); //月
      var day = ("0" + time.getDate()).slice(-2); //日
      var mydate = year + "-" + month + "-" + day;
      return mydate;
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getAttendanceLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getAttendanceLists();
    },

    //刷新
    clearBtn() {
      this.searchList = {
        maplabel: "",
        username: "",
        status: "",
        projectid: this.$store.state.intoProjectid,
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        // timezone: this.$store.state.intoProjectTimezone,
      };
      this.currentPage1 = 1;
      this.tasktime = [];

      this.getAttendanceLists();
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    delCheckList() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("downlink.deletedownlink1"),
          type: "warning",
        });
        return;
      }
      this.deleteData = this.multipleSelection;
      this.del = true;
    },
    deleteTrue() {
      var that = this;
      let data = {
        ids: [],
      };
      for (let i = 0; i < this.deleteData.length; i++) {
        data.ids.push(this.deleteData[i].id);
      }
      this.loading = true;
      delAttendance(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.del = false;
          that.getAttendanceLists();
          that.$message({
            message: that.$t("downlink.deletesuccess"),
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
      });
    },
  },
  beforeMount() {
    this.getAttendanceLists();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;

      Object.assign(
        this.$data.statusList,
        this.$options.data.call(this).statusList
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

/* 改变按钮颜色 */
.edits:hover {
  background-color: rgb(196, 27, 27);
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
  padding: 3px !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}

.querry,
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
.el-form-item .el-button {
  margin-left: 4px !important;
}

.terminal-filter-flow {
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
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
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
.terminal-filter-flow.is-en .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input),
.terminal-filter-flow .terminal-filter-item :deep(.el-select),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor),
.terminal-filter-flow .terminal-filter-item :deep(.el-cascader) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  float: none !important;
  margin: 0 !important;
  flex: none !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--datetimerange),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--daterange) {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-select__wrapper) {
  width: 100% !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  order: 999;
}
.terminal-toolbar-item :deep(.el-form-item__content) {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  width: auto !important;
  margin: 0 !important;
}
.terminal-toolbar-item :deep(.el-button),
.terminal-toolbar-item :deep(.el-dropdown),
.terminal-toolbar-item :deep(.el-popover__),
.terminal-toolbar-item :deep(.el-tooltip__),
.terminal-toolbar-item :deep(.el-popover),
.terminal-toolbar-item :deep(.el-tooltip) {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .query,
.terminal-filter-flow .reset,
.terminal-filter-flow .add,
.terminal.terminal-filter-flow .del,
.terminal-filter-flow .del,
.terminal-filter-flow .export,
.terminal-filter-flow .addTer,
.terminal-filter-flow .addBeacon {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 1 !important;
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
  min-width: auto !important;
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
  min-width: auto !important;
  flex: 0 0 auto !important;
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
.terminal-toolbar-item .el-form-item__content {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.terminal-toolbar-item .el-button,
.terminal-toolbar-item .el-dropdown {
  margin: 0 !important;
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

