<template>
  <div class="content">
    <div class="inputContent">
      <el-form
        class="demo-form-inline"
        style="display: flex; white-space: nowrap; margin-left: 1%"
        :model="actionData"
      >
        <el-form-item
          :label="$t('staff.name1')"
          style="display: flex; margin-left: 1%; margin-right: 2%"
        >
          <el-select
            clearable
            filterable
            remote
            :remote-method="remoteUserMethod"
            v-model="perDeveui"
            :placeholder="$t('staffmanagement.text')"
            style="width: 120%"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.maplabel"
              :label="item.username"
              :value="item.maplabel"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.maplabel
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('car.Numberplate')"
          style="display: flex; margin-left: 1%; margin-right: 2%"
          v-if="intoProjectType == 1"
        >
          <el-select
            clearable
            filterable
            remote
            :remote-method="remoteTBoxMethod"
            v-model="tboxDeveui"
            :placeholder="$t('staffmanagement.text')"
            style="width: 120%"
          >
            <el-option
              v-for="item in tboxOptions"
              :key="item.maplabel"
              :label="item.sn"
              :value="item.maplabel"
            >
              <span style="float: left">{{ item.sn }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.maplabel
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('staff.time')"
          style="display: flex; margin-left: 1%; margin-right: 0"
        >
          <el-date-picker
            v-model="actionTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            :range-separator="$t('terminal.to')"
            :start-placeholder="$t('terminal.startdate')"
            :end-placeholder="$t('terminal.enddate')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="display: flex; margin-left: 2%">
          <el-button type="primary" class="query" @click="searchAction()">{{
            $t("staff.search")
          }}</el-button>
          <el-button type="primary" class="query" @click="showTrajectory()">{{
            $t("staff.Viewtrack")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="actionDetails">
      <Timeline v-for="item in actionTableData" :key="item.id">
        <!-- 室内 -->
        <TimelineItem v-if="item.postype == 1">
          <p class="time">
            {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
          </p>
          <p class="content">
            {{ $t("LocationIndoorHis.Building") }}{{ item.building }}
          </p>
          <p class="content">
            {{ $t("LocationIndoorHis.floor") }}{{ item.ground }}
          </p>
          <p class="content">{{ $t("warning.area1") }}{{ item.tranche }}</p>
          <p class="content">
            {{ $t("tet.Residencetime") }}{{ formatSeconds(item.remaintime) }}
          </p>
        </TimelineItem>

        <!-- 室外 -->
        <TimelineItem v-if="item.postype == 2">
          <p class="time">
            {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
          </p>
          <p class="content">{{ $t("warning.area1") }}{{ item.tranche }}</p>
          <p class="content">
            {{ $t("tet.Residencetime") }}{{ formatSeconds(item.remaintime) }}
          </p>
        </TimelineItem>
      </Timeline>
    </div>
    <el-dialog
      :visible.sync="trajectory"
      width="80%"
      style="text-align: center"
      :close-on-click-modal="false"
      class="trajectory"
      append-to-body
      @close="closetrajectoryAction"
    >
      <Trajectory ref="trajectory" @closePopup="closePopup" />
    </el-dialog>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Asset from "../../components/asset/asset";
import util from "../../common/util";
import { getDevGpsAction, getTboxSnId, getMemberNameId } from "../../axios/api";
import Location from "../staff/outdoorTrajectory.vue";
import Trajectory from "../staff/trajectory.vue";

export default {
  components: {
    Menu,
    Asset,
    Location,
    Trajectory
  },
  name: "StaffManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      //时间选择限制
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("staffmanagement.Lasthour1"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("staffmanagement.Lasthour3"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("staffmanagement.Lasthour6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      superid: this.$store.state.userInfo.superid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      projectid: this.$store.state.intoProjectid,
      intoProjectType: this.$store.state.intoProjectType,

      trajectory: false,

      actionData: {
        projectid: this.$store.state.intoProjectid,
        maplabel: "",
      },
      actionTableData: [],
      actionTableDataArr: [],
      actionTime: "",

      isSearchAction: false,
      //输入框模糊查询
      perDeveui: "",
      tboxDeveui: "",
      userList: [],
      tboxList: [],
      userLoading: false,
      tboxLoading: false,
      userOptions: [],
      tboxOptions: []
    };
  },
  methods: {
    //获取员工姓名下拉框
    getMemberNames() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid
      };
      getMemberNameId(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {
        if (res.code == 1001) {
          that.userList = res.data.map(item => {
            return {
              value: `${item.maplabel}`,
              maplabel: `${item.maplabel}`,
              username: `${item.username}`
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
        }
      });
    },

    // 获取车辆下拉框
    getTboxSnIds() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid
      };
      getTboxSnId(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        res => {
          if (res.code == 1001) {
            that.tboxList = res.data
              .filter(item => {
                return item.maplabel;
              })
              .map(item => {
                return {
                  value: `${item.maplabel}`,
                  maplabel: `${item.maplabel}`,
                  sn: `${item.sn}`
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
          this.userOptions = this.userList.filter(item => {
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
        this.userOptions = [];
      }
    },

    remoteTBoxMethod(query) {
      if (query !== "") {
        this.tboxLoading = true;
        setTimeout(() => {
          this.tboxLoading = false;
          this.tboxOptions = this.tboxList.filter(item => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.sn.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return item.sn.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
          });
        }, 200);
      } else {
        this.tboxOptions = [];
      }
    },
    showTrajectory() {
      this.isSearchAction = true;
      var that = this;
      if (this.actionTableData.length === 0) {
        that.searchAction();
        return;
      }

      // 将行为轨迹数据根据楼层分为不同的数组
      this.actionTableDataArr = [];
      let newArr = [];
      let list = JSON.parse(JSON.stringify(this.actionTableData));
      let node = list[0];
      list.forEach((item, i) => {
        if (item.groundid === node.groundid) {
          newArr.push(item);
        } else {
          that.actionTableDataArr.push(newArr);
          node = item;
          newArr = [];
          newArr.push(item);
        }
        if (i == list.length - 1) {
          that.actionTableDataArr.push(newArr);
        }
      });

      if (that.actionTableDataArr.length > 0) {
        let begintime, endtime;
        if (this.actionTime == null || this.actionTime.length == 0) {
          let timee = new Date();
          timee.setHours(0, 0, 0, 0);
          begintime = timee.getTime() / 1000;
          endtime = Date.parse(new Date()) / 1000;
        } else {
          begintime = that.actionTime[0].getTime() / 1000;
          endtime = that.actionTime[1].getTime() / 1000;
        }
        this.trajectory = true;
        this.isSearchAction = false;
        this.$nextTick(() => {
          this.$refs.trajectory.search(
            that.actionTableDataArr,
            begintime,
            endtime,
            1
          );
        });
      }
    },
    // 当子区域设置有误时，关闭轨迹弹框
    closePopup(data) {
      this.trajectory = false;
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
    formatDatetime(row) {
      if (row == null || row == 0) {
        return "";
      }
      let date = new Date(parseInt(row) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    //将秒数转换为时分秒格式
    // formatSeconds(value) {
    //   var theTime = parseInt(value); // 秒
    //   var middle = 0; // 分
    //   var hour = 0; // 小时

    //   if (theTime > 60) {
    //     middle = parseInt(theTime / 60);
    //     theTime = parseInt(theTime % 60);
    //     if (middle > 60) {
    //       hour = parseInt(middle / 60);
    //       middle = parseInt(middle % 60);
    //     }
    //   }
    //   var result = "" + parseInt(theTime) + "秒";
    //   if (middle > 0) {
    //     result = "" + parseInt(middle) + "分" + result;
    //   }
    //   if (hour > 0) {
    //     result = "" + parseInt(hour) + "小时" + result;
    //   }
    //   return result;
    // },
    formatSeconds(value) {
      let result = parseInt(value);
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

    searchAction() {
      var that = this;
      if (this.perDeveui && this.tboxDeveui) {
        this.$message({
          message: this.$t("locationoutdoor.text2"),
          type: "warning"
        });
        return;
      }
       if (this.perDeveui) {
        this.actionData.maplabel = this.perDeveui;
      }
      if (this.tboxDeveui) {
        this.actionData.maplabel = this.tboxDeveui;
      }
       if (!this.actionData.maplabel) {
        this.$message({
          message: this.$t("locationoutdoor.text3"),
          type: "warning",
        });
        return;
      }
      let data = {
        projectid: this.actionData.projectid,
        deveui: this.actionData.maplabel,
        begintime: "",
        endtime: "",
        devtype: this.$store.state.intoProjectType == 1 ? 1 : 2,
        timezone: this.$store.state.intoProjectTimezone
      };
      if (this.actionTime) {
        // 判断是否为24小时间隔
        if (
          this.actionTime[1].getTime() - this.actionTime[0].getTime() >
          86400000
        ) {
          that.$message({
            message: this.$t("staffmanagement.Thehours"),
            type: "warning"
          });
          return;
        }
        let begingTime = that.actionTime[0];
        let endTime = that.actionTime[1];

        begingTime =
          !begingTime || begingTime == ""
            ? ""
            : util.formatDate.format(
                new Date(begingTime),
                "yyyy-MM-dd hh:mm:ss"
              );
        endTime =
          !endTime || endTime == ""
            ? ""
            : util.formatDate.format(new Date(endTime), "yyyy-MM-dd hh:mm:ss");

        if (begingTime.length > 0 && endTime.length > 0) {
          begingTime = Date.parse(new Date(begingTime)) / 1000;
          endTime = Date.parse(new Date(endTime)) / 1000;
        }
        data.begintime = begingTime;
        data.endtime = endTime;
      } else {
        let timee = new Date();
        timee.setHours(0, 0, 0, 0);
        data.begintime = timee.getTime() / 1000;
        data.endtime = Date.parse(new Date()) / 1000;
      }
      // if (
      //   this.actionData.maplabel == "" ||
      //   this.actionData.maplabel == null ||
      //   this.actionData.username == "" ||
      //   this.actionData.username == null
      // ) {
      //   this.$message({
      //     message: this.$t("staffmanagement.cardtime"),
      //     type: "warning"
      //   });
      //   return;
      // }
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".action")
      });
      getDevGpsAction(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {
        if (res.code == 1001) {
          if (res.data.tranchelist.length == 0) {
            that.$message({
              message: that.$t("staffmanagement.Nodata"),
              type: "warning"
            });
            that.actionTableData = [];
            loading.close();
            return;
          } else {
            that.actionTableData = res.data.tranchelist.reverse();
          }
          for (let i = 0; i < that.actionTableData.length; i++) {
            that.actionTableData[i].gpstime = that.formatDatetime(
              that.actionTableData[i].gpstime
            );
          }
          if (this.isSearchAction == true) {
            that.showTrajectory();
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error"
          });
        }
        loading.close();
      });
    },

    //关闭行为回调
    closetrajectoryAction() {
      this.$nextTick(() => {
        this.$refs.trajectory.stop(true);
        this.$refs.trajectory.closeTime();
      });
    }
  },
  beforeMount() {
    this.getMemberNames();
    this.getTboxSnIds();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;

      Object.assign(
        this.$data.editRules,
        this.$options.data.call(this).editRules
      );
    }
  }
};
</script>

<style scoped>
.inputContent {
  height: 7%;
  width: 100%;
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

.query {
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

.demo-form-inline >>> .el-select .el-input__inner {
  padding-right: 20px;
}

.demo-form-inline >>> .el-input__suffix {
  right: 0 !important;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.actionDetails {
  max-height: 700px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  padding-top: 2%;
}
.actionDetails >>> .ivu-timeline {
  width: 23%;
  margin-left: 2%;
  text-align: left;
}

.action .el-dialog__body .el-form .el-form-item {
  padding-right: 0px !important;
}

.action .demo-form-inline .el-form-item .el-form-item__content {
  width: 100%;
}

.trajectory >>> .el-dialog {
  height: 85%;
  margin-top: 2% !important;
}
.trajectory >>> .el-dialog__header {
  height: 4%;
}
.trajectory >>> .el-dialog__headerbtn {
  top: 1% !important;
}
.trajectory >>> .el-dialog__body {
  height: 96%;
  padding-top: 10px !important;
}
.import_type {
  white-space: nowrap;
}
.work_type_list {
  display: flex;
}
.work_type_list >>> .el-form-item__content {
  display: flex;
  width: 100%;
  margin-left: 80px !important;
}
</style>
