<template>
  <div class="content">
    <div class="project_input">
      <el-form
        class="demo-form-inline"
        :model="searchList"
        style="display: flex; white-space: nowrap; margin-left: 1%"
      >
        <el-form-item
          :label="$t('inspection.Building')"
          style="display: flex; margin-left: 2%; margin-right: 0"
        >
          <el-select
            clearable
            filterable
            v-model="searchList.buildid"
            style="float: left"
            @change="getGroundLists"
            :placeholder="$t('LocationIndoorHis.text1')"
          >
            <el-option
              v-for="item in buildingList"
              :key="item.id"
              :label="item.building"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('LocationIndoorHis.floor')"
          style="display: flex; margin-left: 2%; margin-right: 0"
        >
          <el-select
            clearable
            filterable
            v-model="searchList.groundid"
            style="width: 80%; float: left"
            :placeholder="$t('LocationIndoorHis.text1')"
          >
            <el-option
              v-for="item in groundList"
              :key="item.id"
              :label="item.ground"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('LocationIndoorHis.time')"
          style="display: flex; margin-left: 0%; margin-right: 0"
        >
          <el-date-picker
            v-model="tasktime"
            type="datetimerange"
            :picker-options="pickerOptions"
            :range-separator="$t('LocationIndoorHis.to')"
            :start-placeholder="$t('LocationIndoorHis.starttime')"
            :end-placeholder="$t('LocationIndoorHis.endtime')"
            style="width: 85%; margin-left: -15%"
          ></el-date-picker>
          <el-tooltip
            class="item"
            effect="light"
            placement="right-start"
            style="
              position: absolute;
              font-size: 130%;
              top: 50%;
              transform: translateY(-50%);
              margin-left: 5px;
            "
          >
            <div slot="content">
              <p>
                {{ $t("LocationIndoorHis.text3") }} <br />
                {{ $t("LocationIndoorHis.text4") }}
              </p>
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item style="margin-left: 0%">
          <el-button type="primary" class="querry" @click="searchInfo()">{{
            $t("terminal.search")
          }}</el-button>
          <el-button type="primary" class="reset" @click="clearBtn()">{{
            $t("terminal.reset")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 展示 -->
    <div>
      <el-table
        class="tableData"
        :data="tableData"
        style="width: 97%; text-align: center"
        border
        max-height="660"
        highlight-current-row
      >
        <el-table-column
          property="username"
          :label="$t('LocationIndoorHis.Name')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          property="deveui"
          :label="$t('LocationIndoorHis.deveui')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          property="building"
          :label="$t('LocationIndoorHis.building')"
          min-width="50"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          property="ground"
          :label="$t('LocationIndoorHis.Floor')"
          min-width="30"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          property="tranche"
          :label="$t('LocationIndoorHis.area')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          property="devtypestr"
          :label="$t('LocationIndoorHis.DeviceType')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          property="gpstime"
          :label="$t('LocationIndoorHis.Positioningtime')"
          show-overflow-tooltip
          :formatter="formatDateGpstime"
        >
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
  </div>
</template>
<script>
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import Trajectory from "../staff/trajectory.vue";
import {
  getDevGpsList,
  getBuildingByProjectid,
  getGround,
  getMemberNameId,
  getTboxSnId,
  getDevGpsByGroup,
} from "../../axios/api";
export default {
  components: { Menu, Project, Trajectory },
  name: "LocationIndoorHis",
  data() {
    let _minTime = null;
    return {
      trajectory: false,
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
        onPick(time) {
          if (time.minDate && !time.maxDate) {
            _minTime = time.minDate;
          }
          if (time.maxDate) {
            _minTime = "";
          }
        },
        disabledDate: (time) => {
          let timeOptionRange = _minTime;
          let secondNum = 60 * 60 * 24 * 1 * 1000;
          if (timeOptionRange) {
            return (
              time.getTime() > timeOptionRange.getTime() + secondNum ||
              time.getTime() < timeOptionRange.getTime() - secondNum
            );
          }
        },
        shortcuts: [
          {
            text: this.$t("staffmanagement.Lasthour1"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour3"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions4"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              // start.setTime(start.setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tasktime: [new Date().getTime() - (3 * 60 * 60 * 1000 - 1), new Date()],
      begingTime: "",
      endTime: "",
      searchList: {
        projectid: this.$store.state.intoProjectid,
        devtype: "",
        postype: 1,
        groundid: "",
        buildid: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      },
      pageCount: 20,
      del: false,
      loading: false,
      deleteData: [],
      buildingList: [],
      groundList: [],
      userList: [],
      tboxList: [],
      allList: [],
      //输入框模糊查询
      userLoading: false,
      allOptions: [],
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
    formatDateGpstime(row) {
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
      getDevGpsByGroup(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.list.length > 0) {
            that.tableData = res.data.list;
            that.total = res.data.size;
            that.$message({
              message: that.$t("buildingmanagement.searchsuccess"),
              type: "success",
            });
          } else {
            that.tableData = [];
            that.total = 0;
            that.$message({
              message: that.$t("buildingmanagement.nodata"),
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
      // this.tasktime = [new Date().getTime() - (3 * 60 * 60 * 1000 - 1), new Date()];
      this.tasktime = [];
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        devtype: "",
        postype: 1,
        groundid: "",
        buildid: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      };
      this.getDevGpsLists();
      this.getMemberNames();
    },
    getDevGpsLists() {
      var that = this;
      getDevGpsByGroup(
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

    //获取楼栋
    getBuildingByProjectids() {
      var that = this;
      let data = {
        tenantid: this.$store.state.intoProjectTenantid,
        projectid: this.$store.state.intoProjectid,
      };
      getBuildingByProjectid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.buildingList = res.data;
        }
      });
    },
    getGroundLists(val) {
      let data = {
        buildid: val,
      };
      getGround(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            this.groundList = res.data;
          }
        }
      );
    },

    //获取员工姓名下拉框
    getMemberNames() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
      };
      getMemberNameId(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.userList = res.data.map((item) => {
            return {
              value: `${item.maplabel}`,
              maplabel: `${item.maplabel}`,
              username: `${item.username}`,
            };
          });
          for (let i = that.userList.length - 1; i > -1; i--) {
            if (
              that.userList[i].maplabel == "" ||
              that.userList[i].maplabel == null ||
              that.userList[i].maplabel == undefined
            ) {
              that.userList.splice(i, 1);
            }
          }
          this.getTboxSnIds();
        }
      });
    },

    // 获取车辆下拉框
    getTboxSnIds() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
      };
      getTboxSnId(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.tboxList = res.data
              .filter((item) => {
                return item.maplabel;
              })
              .map((item) => {
                return {
                  value: `${item.maplabel}`,
                  maplabel: `${item.maplabel}`,
                  username: `${item.sn}`,
                };
              });
            // for (let i = that.tboxList.length - 1; i > -1; i--) {
            //   if (
            //     that.tboxList[i].maplabel == "" ||
            //     that.tboxList[i].maplabel == null ||
            //     that.tboxList[i].maplabel == undefined
            //   ) {
            //     that.tboxList.splice(i, 1);
            //   }
            // }
            that.allList = that.userList.concat(that.tboxList);
          }
        }
      );
    },
    //输入框模糊查询
    remoteUserMethod(query) {
      if (query !== "") {
        this.userLoading = true;
        setTimeout(() => {
          this.userLoading = false;
          this.allOptions = this.allList.filter((item) => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return (
                item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          });
        }, 200);
      } else {
        this.allOptions = [];
      }
    },
  },
  beforeMount() {
    this.getDevGpsLists();

    this.getBuildingByProjectids();
    this.getMemberNames();
  },
  watch: {
    "$i18n.locale"() {
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
.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}
.querry,
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
  height: 34px !important;
  line-height: 34px !important;
}
.demo-form-inline >>> .el-form-item:nth-of-type(1) .el-input__inner {
  cursor: text !important;
}
.demo-form-inline >>> .el-form-item:nth-of-type(2) .el-input__inner {
  cursor: text !important;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-range-separator {
  height: 34px;
  line-height: 34px;
}
.tableData >>> td,
.tableData >>> th {
  text-align: center !important;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.trajectory {
  height: 100%;
}
.trajectory >>> .el-dialog {
  height: 80%;
  margin-top: 0;
}
.trajectory >>> .el-dialog__body {
  height: 90%;
}
</style>
