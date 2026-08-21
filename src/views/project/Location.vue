<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Project /></el-aside>
        <el-main>
          <div class="project_input location-search-bar">
            <el-breadcrumb
              separator="/"
              class="location-breadcrumb"
              v-if="contrForPrionum == 3 || contrForPrionum == 4"
            >
              <el-breadcrumb-item :to="{ path: '/projectmanagement' }">{{
                $t("myorderde.projectmanagement")
              }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ intoProjectName }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{
                $t("Breadcrumb.Locationdata")
              }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div
              class="location-search-row terminal-filter-flow"
              :class="filterLangClass"
            >
              <el-form
                class="demo-form-inline terminal-filter-form"
                :model="searchList"
              >
                <el-form-item
                  :label="$t('floormanagement.device')"
                  class="terminal-filter-item"
                >
                  <el-input
                    v-model="searchList.deveui"
                    :placeholder="$t('staffmanagement.text')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('floormanagement.Floornumber')"
                  class="terminal-filter-item"
                >
                  <el-input
                    v-model="searchList.groundid"
                    :placeholder="$t('staffmanagement.text')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('locationoutdoor.time')"
                  class="terminal-filter-item"
                >
                  <el-date-picker
                    v-model="tasktime"
                    type="datetimerange"
                    :shortcuts="pickerOptions.shortcuts"
                    :disabled-date="pickerOptions.disabledDate"
                    @calendar-change="(val) => pickerOptions.onPick && pickerOptions.onPick({ minDate: val[0], maxDate: val[1] })"
                    :range-separator="$t('locationoutdoorh.to')"
                    :start-placeholder="$t('locationoutdoorh.starttime')"
                    :end-placeholder="$t('locationoutdoorh.endtime')"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item class="terminal-toolbar-item">
                  <el-button
                    type="primary"
                    class="querry"
                    @click="searchInfo()"
                    >{{ $t("locationoutdoorh.search") }}</el-button>
                  <el-button type="primary" class="reset" @click="clearBtn()">{{
                    $t("locationoutdoorh.reset")
                  }}</el-button>
                  <el-button
                    type="primary"
                    class="reset"
                    @click="delDevGpsList()"
                    >{{ $t("inspection.batchdeletion") }}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              style="width: 98%; text-align: center; margin-left: 2%"
              border
              highlight-current-row
              max-height="660"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('floormanagement.deviceid')"
                show-overflow-tooltip
                align="center"
                min-width="160"
              >
              </el-table-column>
              <el-table-column
                property="devtypestr"
                :label="$t('floormanagement.DeviceType')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="postypestr"
                :label="$t('LocationIndoorHis.Locationtype')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="groundid"
                :label="$t('LocationIndoorHis.Floornumber')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="rssi"
                label="Rssi"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="x"
                label="X"
                show-overflow-tooltip
                align="center"
                min-width="160"
              >
              </el-table-column>
              <el-table-column
                property="y"
                label="Y"
                show-overflow-tooltip
                align="center"
                min-width="160"
              >
              </el-table-column>
              <el-table-column
                property="gpstime"
                :label="$t('LocationIndoorHis.Positioningtime')"
                show-overflow-tooltip
                :formatter="formatDateGpstime"
                align="center"
                min-width="170"
              >
              </el-table-column>

              <el-table-column
                fixed="right"
                :label="$t('myorder.operate')"
                align="center"
                min-width="90"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  delprio == 1
                "
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
          <el-dialog :title="$t('LocationIndoorHis.text2')" v-model="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="deveui"
                :label="$t('floormanagement.deviceid')"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="devtypestr"
                :label="$t('floormanagement.DeviceType')"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="postypestr"
                :label="$t('LocationIndoorHis.Locationtype')"
                show-overflow-tooltip
              >
              </el-table-column>

              <el-table-column
                property="groundid"
                :label="$t('LocationIndoorHis.Floornumber')"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="rssi"
                label="Rssi"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column property="x" label="X" show-overflow-tooltip>
              </el-table-column>
              <el-table-column property="y" label="Y" show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                property="gpstime"
                :label="$t('LocationIndoorHis.Positioningtime')"
                show-overflow-tooltip
                :formatter="formatDateGpstime"
                min-width="130"
              >
              </el-table-column>
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
import Project from "../../components/project/project";
import util from "../../common/util";
import {
  delDevCommandById,
  getDevCommandList,
  getDevGpsList,
  delDevGps,
} from "../../axios/api";
export default {
  components: { Menu, Project },
  name: "Location",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      intoProjectName: this.$store.state.intoProjectName,
      tableData: [],
      multipleSelection: [],
      currentPage1: 1,
      total: 0,
      tenantidData: [],
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
      searchList: {},
      pageCount: 20,
      del: false,
      loading: false,
      deleteData: [],
    };
  },
  computed: {
    filterLangClass() {
      const lang =
        this.i8n ||
        this.$store.state.i18n ||
        (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    //返回项目管理
    goProject() {
      this.$router.push("/projectmanagement");
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
    formatDateGpstime(row, colum) {
      if (row.gpstime == null || row.gpstime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.gpstime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getDevGpsLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getDevGpsLists();
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
      getDevGpsList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          that.$message({
            message: that.$t("beacon.searchsuccess"),
            type: "success",
          });
        }
      });
    },

    //刷新
    clearBtn() {
      this.currentPage1 = 1;
      this.tasktime = [];
      if (this.$store.state.intoProjectprojectType == 1) {
        this.searchList = {
          projectid: this.$store.state.intoProjectid,
          deveui: "",
          devetype: 1,
          postype: 1,
          groundid: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
        };
      } else if (this.$store.state.intoProjectprojectType == 2) {
        this.searchList = {
          projectid: this.$store.state.intoProjectid,
          deveui: "",
          devetype: 2,
          postype: 1,
          groundid: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
        };
      }
      this.getDevGpsLists();
    },

    //删除
    DelDevCommand(index) {
      var that = this;
      this.$confirm(
        this.$t("beacon.deletemsg1") +
          this.tableData[index].deveui +
          this.$t("project.tet16"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let data = {
            projectid: this.$store.state.intoProjectid,
            ids: [this.tableData[index].id],
          };
          data.ids = JSON.stringify(data.ids);
          delDevGps(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.getDevGpsLists();
              that.$message({
                message: that.$t("buildingmanagement.deletesuccess"),
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
    //批量删除delDevGps
    delDevGpsList(index) {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("locationoutdoorh.message3"),
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
        projectid: this.$store.state.intoProjectid,
        ids: [],
      };
      for (let i = 0; i < this.deleteData.length; i++) {
        data.ids.push(this.deleteData[i].id);
      }
      data.ids = JSON.stringify(data.ids);
      this.loading = true;
      delDevGps(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            this.del = false;
            that.getDevGpsLists();
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

    getDevGpsLists() {
      var that = this;
      getDevGpsList(
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
  },
  beforeMount() {
    if (this.$store.state.intoProjectprojectType == 1) {
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        deveui: "",
        devetype: 1,
        postype: 1,
        groundid: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      };
    } else if (this.$store.state.intoProjectprojectType == 2) {
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        deveui: "",
        devetype: 2,
        postype: 1,
        groundid: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      };
    }
    this.getDevGpsLists();
  },
};
</script>
<style scoped>
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
.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}
.querry,
.reset,
.addBeacon,
.editBeacons,
.delBeacons {
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

.location-search-bar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}
.location-breadcrumb {
  margin: 0 0 12px 2% !important;
  align-self: flex-start;
}
.location-search-row.terminal-filter-flow {
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 16px;
  margin-left: 2%;
  margin-right: 1%;
  margin-bottom: 16px;
}
.location-search-row.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.location-search-row.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
}
.location-search-row.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  white-space: nowrap !important;
  flex: 0 0 auto !important;
}
.location-search-row.terminal-filter-flow.is-en .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
.location-search-row.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
}
.location-search-row.terminal-filter-flow .terminal-filter-item :deep(.el-input),
.location-search-row.terminal-filter-flow .terminal-filter-item :deep(.el-select) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  margin: 0 !important;
}
.location-search-row.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor.el-input__wrapper),
.location-search-row.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--datetimerange) {
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
.terminal-toolbar-item :deep(.el-form-item__content) {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.terminal-toolbar-item :deep(.el-button) {
  margin: 0 !important;
}

.backProject :deep(.el-page-header__left) {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject :deep(.el-page-header__content) {
  text-align: left !important;
  min-width: 160px !important;
  height: 48px !important;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.el-form-item .el-button {
  margin-left: 0 !important;
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
.location-search-row.terminal-filter-flow {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 8px 16px !important;
  margin-bottom: 16px !important;
}
.location-search-row.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.location-breadcrumb {
  margin: 0 0 12px 2% !important;
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
