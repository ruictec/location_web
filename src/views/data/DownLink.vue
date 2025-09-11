<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Data /></el-aside>
        <el-main>
          <div class="ns_input">
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item
                :label="$t('downlink.deveui1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.deveui"
                  :placeholder="$t('terminal.tit27')"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('downlink.msgtype1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.type"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('downlink.msgtype2')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.msgstatus"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in msgstatusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('downlink.company1')"
                style="
                  display: flex;
                  width: 18%;
                  margin-left: 2%;
                  margin-right: 0;
                "
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.tenantid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in tenantidData"
                    :key="item.tenantid"
                    :label="item.username"
                    :value="item.tenantid"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item style="float: left; margin-left: 0%">
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("heartbeat.search")
                }}</el-button
                ><el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("heartbeat.reset")
                }}</el-button
                ><el-button
                  type="primary"
                  class="reset"
                  @click="delDevCommands()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    delprio == 1
                  "
                  >{{ $t("test.Batchdelete") }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              style="width: 97%; text-align: center; margin-left: 2%"
              border
              highlight-current-row
              max-height="660"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                property="customername"
                :label="$t('downlink.customername')"
                show-overflow-tooltip
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('downlink.deveui')"
                show-overflow-tooltip
                header-align="center"
                min-width="90"
              >
              </el-table-column>

              <el-table-column
                property="typestr"
                :label="$t('downlink.typestr')"
                show-overflow-tooltip
                align="center"
                min-width="110"
              >
              </el-table-column>

              <el-table-column
                property="msg"
                :label="$t('downlink.msg')"
                show-overflow-tooltip
                header-align="center"
                min-width="300"
              >
              </el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'msgstatustr' : 'enmsgstatus'"
                :label="$t('downlink.msgstatustr')"
                show-overflow-tooltip
                min-width="60"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="creatime"
                :label="$t('downlink.creatime')"
                show-overflow-tooltip
                :formatter="formatDateCreatime"
                align="center"
                min-width="110"
              >
              </el-table-column>

              <el-table-column
                property="sendtime"
                :label="$t('downlink.sendtime')"
                show-overflow-tooltip
                :formatter="formatDateSendtime"
                align="center"
                min-width="110"
              >
              </el-table-column>

              <el-table-column
                property="statustime"
                :label="$t('downlink.statustime')"
                show-overflow-tooltip
                :formatter="formatDateStatustime"
                align="center"
                min-width="110"
              >
              </el-table-column>

              <el-table-column
                fixed="right"
                :label="$t('downlink.operate')"
                align="center"
                min-width="60"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  delprio == 1
                "
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
                      class="edits"
                      @click="DelDevCommand(scope.$index)"
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
                :current-page.sync="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-size="20"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 批量删除 -->
          <el-dialog :title="$t('downlink.msgdelete')" :visible.sync="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="customername"
                :label="$t('downlink.customername')"
                show-overflow-tooltip
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
              </el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('downlink.deveui')"
                show-overflow-tooltip
              >
              </el-table-column>

              <el-table-column
                property="typestr"
                :label="$t('downlink.typestr')"
                show-overflow-tooltip
              >
              </el-table-column>

              <el-table-column
                property="msg"
                :label="$t('downlink.msg')"
                show-overflow-tooltip
              >
              </el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'msgstatustr' : 'enmsgstatus'"
                :label="$t('downlink.msgstatustr')"
                show-overflow-tooltip
                min-width="80"
              >
              </el-table-column>

              <el-table-column
                property="creatime"
                :label="$t('downlink.creatime')"
                show-overflow-tooltip
                :formatter="formatDateCreatime"
                min-width="150"
              >
              </el-table-column>

              <el-table-column
                property="sendtime"
                :label="$t('downlink.sendtime')"
                show-overflow-tooltip
                :formatter="formatDateSendtime"
                min-width="150"
              >
              </el-table-column>

              <el-table-column
                property="statustime"
                :label="$t('downlink.statustime')"
                show-overflow-tooltip
                :formatter="formatDateStatustime"
                min-width="150"
              >
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(del = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="deleteTrue"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import Menu from "../../components/menu/Menu";
import Data from "../../components/data/data";
import {
  getCustomerName,
  delDevCommandById,
  getDevCommandList,
} from "../../axios/api";
export default {
  components: { Menu, Data },
  name: "DownLink",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      tableData: [],
      multipleSelection: [],
      currentPage1: 1,
      total: 0,
      tenantidData: [],
      searchList: {
        deveui: "",
        tenantid: this.$store.state.userInfo.tenantid,
        type: "",
        msgstatus: "",
        page: 1,
        count: 20,
      },
      pageCount: 20,
      del: false,
      loading: false,
      deleteData: [],
      typeList: [
        {
          index: 1,
          value: "Param Configuration",
        },
        {
          index: 2,
          value: "Position Request",
        },
        {
          index: 3,
          value: "Reset",
        },
        {
          index: 4,
          value: "Turn Off",
        },
        {
          index: 5,
          value: "Search",
        },

        {
          index: 6,
          value: "Dismiss Search",
        },
        {
          index: 7,
          value: "Positioning Beacon List",
        },
        {
          index: 8,
          value: "Asset Beacon List",
        },
        {
          index: 9,
          value: "Pass-through Beacon list",
        },
        {
          index: 10,
          value: "History BLE Config List",
        },
        {
          index: 11,
          value: "Positioning Beacon UUID",
        },
        {
          index: 12,
          value: "Asset Beacon UUID",
        },
        {
          index: 13,
          value: "Pass-through Beacon Filter",
        },
        {
          index: 14,
          value: "History BLE Config",
        },
        {
          index: 15,
          value: "Time Synchronization",
        },
      ],
      msgstatusList: [
        {
          index: 1,
          value: this.$t("downlink.wait"),
        },
        {
          index: 2,
          value: this.$t("downlink.waitconfirm"),
        },
        {
          index: 3,
          value: this.$t("downlink.success"),
        },
        {
          index: 4,
          value: this.$t("downlink.fail"),
        },
      ],
    };
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
    formatDateCreatime(row, colum) {
      if (row.creatime == null || row.creatime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.creatime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDateSendtime(row, colum) {
      if (row.sendtime == null || row.sendtime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.sendtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDateStatustime(row, colum) {
      if (row.statustime == null || row.statustime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.statustime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getDevCommandLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getDevCommandLists();
    },

    getDevCommandLists() {
      var that = this;
      getDevCommandList(
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
      this.searchList.count = this.pageCount;
      this.currentPage1 = 1;
      getDevCommandList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          if (that.total > 0) {
            that.$message({
              message: that.$t("downlink.searchsuccess"),
              type: "success",
            });
          } else if (that.total == 0) {
            that.$message({
              message: that.$t("downlink.nodata"),
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
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          deveui: "",
          tenantid: "",
          type: "",
          msgstatus: "",
          page: 1,
          count: this.pageCount,
        };
      } else {
        this.searchList = {
          deveui: "",
          tenantid: this.tenantid_A,
          type: "",
          msgstatus: "",
          page: 1,
          count: this.pageCount,
        };
      }

      this.getDevCommandLists();
    },

    //删除
    DelDevCommand(index) {
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t("staffmanagement.permissiondelete"),
          type: "warning",
        });
        return;
      }
      var that = this;
      this.$confirm(
        this.$t("downlink.tet") +
          this.tableData[index].deveui +
          this.$t("downlink.tet1"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let data = {
            ids: [this.tableData[index].id],
          };
          delDevCommandById(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getDevCommandLists();
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
        })
        .catch(() => {});
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除delDevCommandById
    delDevCommands(index) {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("downlink.deletedownlink1"),
          type: "warning",
        });
        return;
      }
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   if (this.multipleSelection[i].msgstatus == 2) {
      //     that.$message({
      //       message: "不能删除待确认的下行数据信息！",
      //       type: "warning",
      //     });
      //     return;
      //   }
      // }
      this.deleteData = this.multipleSelection;
      this.del = true;
    },
    deleteTrue() {
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t("staffmanagement.permissiondelete"),
          type: "warning",
        });
        return;
      }
      var that = this;
      let data = {
        ids: [],
      };
      for (let i = 0; i < this.deleteData.length; i++) {
        data.ids.push(this.deleteData[i].id);
      }
      this.loading = true;
      delDevCommandById(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.del = false;
          that.searchList.page = 1;
          that.currentPage1 = 1;
          that.getDevCommandLists();
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

    //获取所有的Tenantid
    getCustomerNames() {
      let data = {
        beginlevel: 1,
        endlevel: 3,
      };
      getCustomerName(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.tenantidData = res.data;
      });
    },
  },
  beforeMount() {
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2
    ) {
      this.searchList.tenantid = "";
      this.getCustomerNames();
    }
    this.getDevCommandLists();
  },

  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.msgstatusList,
        this.$options.data.call(this).msgstatusList
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
.edits {
  padding: 2px 16px !important;
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
.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}
.query,
.reset,
.addBeacon,
.editBeacons,
.delBeacons {
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
  margin-left: 8px !important;
}
</style>
