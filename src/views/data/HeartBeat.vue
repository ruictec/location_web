<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>

    <div class="content">
      <el-container class="asi">
        <el-aside><Data /></el-aside>
        <el-main>
          <div class="ter_input terminal-filter-flow" :class="filterLangClass">
            <el-form
              class="demo-form-inline terminal-filter-form"
            >
              <el-form-item
                :label="$t('heartbeat.deveui1')"
               class="terminal-filter-item">
                <el-input
                  v-model="searchList.deveui"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('heartbeat.chosetime')"
               class="terminal-filter-item">
                <el-date-picker
                  v-model="tasktime"
                  type="datetimerange"
                  :shortcuts="pickerOptions.shortcuts" :disabled-date="pickerOptions.disabledDate" @calendar-change="(val) => pickerOptions.onPick && pickerOptions.onPick({ minDate: val[0], maxDate: val[1] })"
                  :range-separator="$t('heartbeat.to')"
                  :start-placeholder="$t('heartbeat.startdate')"
                  :end-placeholder="$t('heartbeat.enddate')"
                  align="right"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item class="search-actions terminal-toolbar-item">
                <el-button
                  type="primary"
                  class="search"
                  @click="searchInfo()"
                  >{{ $t("heartbeat.search") }}</el-button>
                <el-button
                  type="primary"
                  class="search"
                  @click="searchPrevious()"
                  >{{ $t("test.previous") }}</el-button>
                <el-button
                  type="primary"
                  class="search"
                  @click="searchNext()"
                  >{{ $t("test.next") }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("heartbeat.reset")
                }}</el-button><el-button
                  type="primary"
                  class="reset"
                  @click="startRefresh()"
                  v-if="start"
                  >{{ $t("test.start") }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="stopRefresh()"
                  v-if="stop"
                  >{{ $t("heartbeat.stop") }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="delHeartBeatList()"
                  >{{ $t("test.Batchdelete") }}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 97%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              @selection-change="handleSelectionChange"
              highlight-current-row
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>

              <el-table-column
                property="deveui"
                :label="$t('heartbeat.deveui')"
                show-overflow-tooltip
                min-width="105"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="freq"
                :label="$t('heartbeat.freq')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="vibstatestr"
                :label="$t('heartbeat.vibstatestr')"
                show-overflow-tooltip
                min-width="80"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'batterystr' : 'enbattery'"
                :label="$t('heartbeat.batterystr')"
                show-overflow-tooltip
                min-width="83"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="gnssstr"
                :label="$t('heartbeat.gnssstr')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="vol"
                :label="$t('heartbeat.vol')"
                show-overflow-tooltip
                min-width="50"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="gwrssi"
                :label="$t('heartbeat.gwrssi')"
                align="center"
                show-overflow-tooltip
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                property="gwsnr"
                :label="$t('heartbeat.gwsnr')"
                align="center"
                show-overflow-tooltip
                min-width="88"
              >
              </el-table-column>
              <el-table-column
                property="rssi"
                :label="$t('heartbeat.rssi')"
                align="center"
                show-overflow-tooltip
                min-width="100"
              >
              </el-table-column>

              <el-table-column
                property="snr"
                :label="$t('heartbeat.snr')"
                align="center"
                show-overflow-tooltip
                min-width="88"
              >
              </el-table-column>
              <el-table-column
                property="steps"
                :label="$t('checkwork.Stepcount')"
                align="center"
                show-overflow-tooltip
                min-width="50"
              >
              </el-table-column>

              <el-table-column
                property="time"
                :label="$t('heartbeat.time')"
                show-overflow-tooltip
                :formatter="formatDate"
                min-width="180"
                align="center"
              ></el-table-column>

              <el-table-column
                :label="$t('heartbeat.contron')"
                align="center"
                min-width="60"
                fixed="right"
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
                      @click="delTer(scope.$index)"
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
          <el-dialog :title="$t('downlink.msgdelete')" v-model="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="deveui"
                :label="$t('heartbeat.deveui')"
                show-overflow-tooltip
                min-width="105"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="freq"
                :label="$t('heartbeat.freq')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="vibstatestr"
                :label="$t('heartbeat.vibstatestr')"
                show-overflow-tooltip
                min-width="98"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'batterystr' : 'enbattery'"
                :label="$t('heartbeat.batterystr')"
                show-overflow-tooltip
                min-width="105"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="gnssstr"
                :label="$t('heartbeat.gnssstr')"
                show-overflow-tooltip
                min-width="95"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="vol"
                :label="$t('heartbeat.vol')"
                show-overflow-tooltip
                min-width="50"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="gwrssi"
                :label="$t('heartbeat.gwrssi')"
                align="center"
                show-overflow-tooltip
                min-width="88"
              >
              </el-table-column>
              <el-table-column
                property="gwsnr"
                :label="$t('heartbeat.gwsnr')"
                align="center"
                show-overflow-tooltip
                min-width="88"
              >
              </el-table-column>
              <el-table-column
                property="rssi"
                :label="$t('heartbeat.rssi')"
                align="center"
                show-overflow-tooltip
                min-width="88"
              >
              </el-table-column>

              <el-table-column
                property="snr"
                :label="$t('heartbeat.snr')"
                align="center"
                show-overflow-tooltip
                min-width="88"
              >
              </el-table-column>

              <el-table-column
                property="time"
                :label="$t('heartbeat.time')"
                show-overflow-tooltip
                :formatter="formatDate"
                min-width="180"
                align="center"
              ></el-table-column>
            </el-table>
            <template #footer><div class="dialog-footer">
              <el-button @click="(del = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="deleteTrue"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button>
            </div></template>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Data from "../../components/data/data";
import { getStatusRecordList, delStatusRecord } from "../../axios/api";
export default {
  components: {
    Menu,
    Data,
  },
  name: "Heartbeat",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      start: false,
      stop: true,
      timer: null,
      tableData: [],
      multipleSelection: [],
      tenantidData: [],
      currentPage1: 1,
      total: 0,
      pageCount: 20,
      tasktime: [],
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
      searchList: {
        tenantid: this.$store.state.userInfo.tenantid,
        deveui: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      },

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
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getStatusRecordLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getStatusRecordLists();
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
    // 时间转换
    formatDate(row, colum) {
      if (row.time == null || row.time == 0) {
        return "";
      }
      let date = new Date(parseInt(row.time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    // 获取心跳数据
    getStatusRecordLists() {
      var that = this;
      getStatusRecordList(
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

    // 搜索
    searchInfo() {
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.tasktime && this.tasktime.length > 0) {
        this.searchList.begintime =
          Date.parse(new Date(that.tasktime[0])) / 1000;
        this.searchList.endtime = Date.parse(new Date(that.tasktime[1])) / 1000;
      } else {
        this.searchList.begintime = "";
        this.searchList.endtime = "";
      }
      getStatusRecordList(
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
              message: that.$t("heartbeat.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("heartbeat.nodata"),
              type: "success",
            });
          }
        } else {
          that.searchList.count = 20;
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    searchPrevious() {
      if (this.searchList.deveui) {
        let firstNum, lastNum, deveui;
        if (this.searchList.deveui.length > 8) {
          let start = this.searchList.deveui.length - 8;
          lastNum = this.searchList.deveui.substring(start);
          firstNum = this.searchList.deveui.substring(0, start);
          deveui = parseInt(lastNum, 16) - 1;
          lastNum = deveui.toString(16);
          lastNum = lastNum.padStart(8, "0");
          this.searchList.deveui = firstNum + lastNum;
        } else {
          deveui = parseInt(this.searchList.deveui, 16) - 1;
          this.searchList.deveui = deveui.toString(16);
        }
        this.searchInfo();
      } else {
        this.$message({
          message: this.$t("test.tet6"),
          type: "warning",
        });
        return;
      }
    },
    searchNext() {
      if (this.searchList.deveui) {
        let firstNum, lastNum, deveui;
        if (this.searchList.deveui.length > 8) {
          let start = this.searchList.deveui.length - 8;
          lastNum = this.searchList.deveui.substring(start);
          firstNum = this.searchList.deveui.substring(0, start);
          deveui = parseInt(lastNum, 16) + 1;
          lastNum = deveui.toString(16);
          lastNum = lastNum.padStart(8, "0");
          this.searchList.deveui = firstNum + lastNum;
        } else {
          deveui = parseInt(this.searchList.deveui, 16) + 1;
          this.searchList.deveui = deveui.toString(16);
        }
        this.searchInfo();
      } else {
        this.$message({
          message: this.$t("test.tet6"),
          type: "warning",
        });
        return;
      }
    },
    // 刷新
    clearBtn() {
      this.tasktime = [];
      this.searchList = {
        tenantid: this.$store.state.userInfo.tenantid,
        deveui: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: this.pageCount,
      };
      this.currentPage1 = 1;
      this.getStatusRecordLists();
    },

    //删除
    delTer(index) {
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
      if (this.contrForPrionum == 4 && this.delprio == 2) {
        this.$message({
          message: this.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("heartbeat.confirmdel1") +
          this.tableData[index].deveui +
          this.$t("heartbeat.confirmdel2"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          tenantid: this.$store.state.userInfo.tenantid,
          ids: [this.tableData[index].id],
        };
        data.ids = JSON.stringify(data.ids);
        delStatusRecord(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.searchList.page = 1;
            that.currentPage1 = 1;
            that.getStatusRecordLists();
            that.$message({
              message: that.$t("heartbeat.delsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //批量删除
    delHeartBeatList() {
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
        tenantid: this.$store.state.userInfo.tenantid,
        ids: [],
      };

      for (let i = 0; i < this.deleteData.length; i++) {
        data.ids.push(this.deleteData[i].id);
      }
      data.ids = JSON.stringify(data.ids);
      this.loading = true;
      delStatusRecord(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.del = false;
          that.searchList.page = 1;
          that.currentPage1 = 1;
          that.getStatusRecordLists();
          that.$message({
            message: that.$t("heartbeat.delsuccess"),
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

    //开始刷新
    startRefresh() {
      this.start = false;
      this.stop = true;
      this.timer = setInterval(() => {
        this.getStatusRecordLists();
      }, 10000);
    },

    //暂停刷新
    stopRefresh() {
      this.start = true;
      this.stop = false;
      clearInterval(this.timer);
    },
  },
  beforeMount() {
    this.getStatusRecordLists();
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getStatusRecordLists();
    }, 10000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
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
.search,
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

