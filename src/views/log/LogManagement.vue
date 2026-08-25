<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><System /></el-aside>
        <el-main>
          <div class="user_input terminal-filter-flow" :class="filterLangClass">
          <el-form
            class="demo-form-inline terminal-filter-form"
            :model="searchList"
          >
            <el-form-item
              :label="$t('logmanagement.operator')"
             class="terminal-filter-item">
              <el-input
                v-model="searchList.username"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('logmanagement.operatype')"
             class="terminal-filter-item">
              <el-select
                v-model="searchList.action"
                clearable
                filterable
                :placeholder="$t('LocationIndoor.Pleaseenter')"
              >
                <el-option
                  v-for="item in actionType"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('logmanagement.chosetime')"
             class="terminal-filter-item">
              <el-date-picker
                v-model="tasktime"
                type="datetimerange"
                :shortcuts="pickerOptions.shortcuts" :disabled-date="pickerOptions.disabledDate" @calendar-change="(val) => pickerOptions.onPick && pickerOptions.onPick({ minDate: val[0], maxDate: val[1] })"
                :range-separator="$t('logmanagement.to')"
                :start-placeholder="$t('logmanagement.startdate')"
                :end-placeholder="$t('logmanagement.enddate')"
                align="right"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item class="terminal-toolbar-item">
              <el-button type="primary" class="query" @click="searchInfo()">{{
                $t("heartbeat.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("heartbeat.reset")
              }}</el-button>
              <el-button type="primary" class="delLogs" @click="deleteLog()">{{
                $t("test.Batchdelete")
              }}</el-button>
            </el-form-item>
          </el-form>
          </div>
          <div class="content_user">
            <!-- log展示 -->
            <el-table
              ref="multipleTable"
              :data="logData"
              @selection-change="handleSelectionChange"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>

              <el-table-column
                property="username"
                :label="$t('logmanagement.username')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="action"
                :label="$t('logmanagement.action')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'module' : 'enmodule'"
                :label="$t('logmanagement.action2')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="detail"
                :label="$t('logmanagement.detail')"
                show-overflow-tooltip
                align="center"
                min-width="190"
              ></el-table-column>

              <el-table-column
                property="customername"
                :label="$t('logmanagement.customername')"
                show-overflow-tooltip
                align="center"
                min-width="150"
              ></el-table-column>
              <el-table-column
                property="time"
                :label="$t('logmanagement.time')"
                show-overflow-tooltip
                align="center"
                min-width="190"
                :formatter="formatDate"
              ></el-table-column>
              <el-table-column
                :label="$t('logmanagement.contron')"
                align="center"
                fixed="right"
                min-width="70"
              >
                <template #default="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('warning.delete')"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      size="small"
                      class="dels icon_button"
                      @click="userDele(scope.$index)"
                      ><img src="../../../static/delete.png"
                    /></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <!--分页效果-->
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

          <!-- 批量删除日志信息 -->
          <el-dialog :title="$t('logmanagement.logrule1')" v-model="del">
            <el-table
              :data="delData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="username"
                :label="$t('logmanagement.username')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="action"
                :label="$t('logmanagement.action')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="detail"
                :label="$t('logmanagement.detail')"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                property="customername"
                :label="$t('logmanagement.customername')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="time"
                :label="$t('logmanagement.time')"
                show-overflow-tooltip
                :formatter="formatDate"
              ></el-table-column>
            </el-table>
            <template #footer><div class="dialog-footer">
              <el-button @click="del = false">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="deleteTrue">{{
                $t("terminal.confirm")
              }}</el-button>
            </div></template>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import util from "../../common/util";
import Menu from "../../components/menu/Menu";
import basecard from "../../components/card/base-card";
import { getSysLog, delSysLog } from "../../axios/api";
import System from "../../components/system/system.vue";
export default {
  components: {
    Menu,
    basecard,
    System,
  },

  Systemname: "WorkOrder",
  data() {
    return {
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
      i8n: this.$store.state.i18n,
      tasktime: [],
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tableData: [],
      logData: [],
      pageCount: 20,
      searchList: {
        username: "",
        tenantid: "",
        superid: "",
        action: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      },
      currentPage1: 1,
      total: 0,
      actionType: [
        {
          index: 1,
          value: "Login",
        },
        {
          index: 2,
          value: "Exit",
        },
        {
          index: 3,
          value: "Add",
        },
        {
          index: 4,
          value: "Update",
        },
        {
          index: 5,
          value: "Delete",
        },
      ],

      deleBtnDis: false,
      deleId: "",
      del: false,
      delData: [],
      multipleSelection: [],
    };
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getSysLogs();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getSysLogs();
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
    formatDate(row, column) {
      if (row.time == null || row.time == 0) {
        return "";
      }
      let date = new Date(parseInt(row.time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //获取操作记录信息
    getSysLogs() {
      var that = this;
      getSysLog(
        that.searchList,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.logData = res.data.list;
          that.total = res.data.size;
        }
      });
    },

    //查询操作记录信息
    searchInfo() {
      var that = this;
      if (this.tasktime && this.tasktime.length > 0) {
        this.searchList.begintime =
          Date.parse(new Date(that.tasktime[0])) / 1000;
        this.searchList.endtime = Date.parse(new Date(that.tasktime[1])) / 1000;
      } else {
        this.searchList.begintime = "";
        this.searchList.endtime = "";
      }
      this.searchList.page = 1;
      this.currentPage1 = 1;

      getSysLog(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.logData = res.data.list;
          that.total = res.data.size;
          that.$message({
            message: that.$t("downlink.searchsuccess"),
            type: "success",
          });
        }
        this.searchList.count = 20;
      });
    },

    //重置搜索输入
    clearBtn() {
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          username: "",
          tenantid: "",
          superid: "",
          action: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
        };
      } else {
        this.searchList = {
          username: "",
          tenantid: "",
          superid: this.$store.state.userInfo.tenantid,
          action: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
        };
      }
      this.tasktime = [];

      this.currentPage1 = 1;
      this.getSysLogs();
    },

    //点击删除
    userDele(index) {
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t("logmanagement.tet"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        this.deleId = this.logData[index].id;
        this.deleTrue();
      });
    },
    deleTrue() {
      let ids = [];
      ids.push(this.deleId);
      let data = {
        ids: ids,
      };
      var that = this;
      delSysLog(
        JSON.stringify(data),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.getSysLogs();
          that.$message({
            message: that.$t("downlink.deletesuccess"),
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

    //批量删除
    deleteLog(index) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("logmanagement.logrule2"),
          type: "warning",
        });
        return;
      }

      this.delData = this.multipleSelection;
      this.del = true;
    },

    //批量删除
    deleteTrue() {
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      var that = this;
      let data = {
        ids: [],
      };
      for (var i = 0; i < this.delData.length; i++) {
        data.ids.push(this.delData[i].id);
      }
      delSysLog(
        JSON.stringify(data),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.del = false;
          that.getSysLogs();
          that.$message({
            message: that.$t("downlink.deletesuccess"),
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

  beforeMount() {
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2
    ) {
      this.searchList = {
        username: "",
        tenantid: "",
        action: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      };
    } else {
      this.searchList = {
        username: "",
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        action: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      };
    }
    this.getSysLogs();
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
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
/* 改变按钮颜色 */
.dels:hover {
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
  padding: 0 !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}
.query,
.reset,
.delLogs {
  height: 32px !important;
  padding: 0 15px !important;
  line-height: 30px !important;
  box-sizing: border-box !important;
}

.demo-form-inline :deep(.el-form-item .el-form-item__label) {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline :deep(.el-form-item:not(.terminal-toolbar-item) .el-form-item__content) {
  line-height: 34px;
}
.demo-form-inline :deep(.terminal-toolbar-item .el-form-item__content) {
  line-height: normal !important;
  display: inline-flex !important;
  align-items: center !important;
}
.demo-form-inline :deep(.el-form-item .el-input__inner) {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-input__icon) {
  height: 34px;
  line-height: 34px;
}
.terminal-toolbar-item .el-button {
  margin-left: 0 !important;
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
.terminal-filter-flow .delLogs,
.terminal.terminal-filter-flow .del,
.terminal-filter-flow .del,
.terminal-filter-flow .export,
.terminal-filter-flow .addTer,
.terminal-filter-flow .addBeacon {
  height: 32px !important;
  padding: 0 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 30px !important;
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

/* 筛选与按钮垂直居中对齐 */
.user_input.terminal-filter-flow,
.terminal-filter-flow {
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item,
.terminal-filter-flow .terminal-toolbar-item {
  display: inline-flex !important;
  align-items: center !important;
  margin-bottom: 0 !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label),
.terminal-filter-flow .terminal-filter-item .el-form-item__label {
  line-height: 32px !important;
  height: 32px !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content),
.terminal-filter-flow .terminal-toolbar-item :deep(.el-form-item__content),
.terminal-filter-flow .terminal-filter-item .el-form-item__content,
.terminal-filter-flow .terminal-toolbar-item .el-form-item__content {
  line-height: normal !important;
  display: inline-flex !important;
  align-items: center !important;
  min-height: 32px !important;
}
.terminal-filter-flow .terminal-toolbar-item :deep(.el-button),
.terminal-filter-flow .terminal-toolbar-item .el-button {
  height: 32px !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  vertical-align: middle !important;
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

