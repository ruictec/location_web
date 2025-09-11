<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><System /></el-aside>
        <el-main>
          <!-- <div class="user_input"> -->
          <el-form
            class="demo-form-inline"
            :model="searchList"
            style="display: flex; white-space: nowrap"
          >
            <el-form-item
              :label="$t('logmanagement.operator')"
              style="
                display: flex;
                width: 15%;
                margin-left: 2%;
                margin-right: 0;
              "
            >
              <el-input
                style="width: 95%; float: left"
                v-model="searchList.username"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('logmanagement.operatype')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-select
                v-model="searchList.action"
                clearable
                filterable
                :placeholder="$t('LocationIndoor.Pleaseenter')"
                style="width: 95%; float: left"
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
              style="
                display: flex;
                width: 27%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-date-picker
                style="width: 95%; float: left"
                v-model="tasktime"
                type="datetimerange"
                :picker-options="pickerOptions"
                :range-separator="$t('logmanagement.to')"
                :start-placeholder="$t('logmanagement.startdate')"
                :end-placeholder="$t('logmanagement.enddate')"
                align="right"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item style="margin-left: 2%">
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
          <!-- </div> -->
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
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('warning.delete')"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      class="dels"
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
                :current-page.sync="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-size="20"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 批量删除日志信息 -->
          <el-dialog :title="$t('logmanagement.logrule1')" :visible.sync="del">
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
            <div slot="footer" class="dialog-footer">
              <el-button @click="del = false">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="deleteTrue">{{
                $t("terminal.confirm")
              }}</el-button>
            </div>
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
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0));
              // start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions5"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);

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
.dels {
  padding: 2px 16px !important;
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

.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}
.query,
.reset,
.delLogs {
  padding: 8px 12px !important;
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
