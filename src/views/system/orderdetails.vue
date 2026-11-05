<template>
  <div :class="contrForPrionum != 5 ? 'home device-page admin-page' : 'device-page'" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><System /></el-aside>
        <el-main>
          <el-breadcrumb
            separator="/"
            class="od-breadcrumb"
            v-if="contrForPrionum != 5"
          >
            <el-breadcrumb-item
              :to="{ path: '/user/myorder' }"
              v-if="myorder"
              >{{ $t("Breadcrumb.Myworkorder") }}</el-breadcrumb-item>
            <el-breadcrumb-item
              :to="{ path: '/userorder' }"
              v-if="userorder"
              >{{ $t("list.Userworkorder") }}</el-breadcrumb-item>
            <el-breadcrumb-item
              :to="{ path: '/companyorder' }"
              v-if="companyorder"
              >{{ $t("list.Enterpriseworkorder") }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{
              $t("Breadcrumb.Workorderdetails")
            }}</el-breadcrumb-item>
          </el-breadcrumb>

          <div class="page-panel od-card">
            <div class="od-card-head">
              <span class="od-card-title">{{
                $t("Breadcrumb.Workorderdetails")
              }}</span>
              <el-button
                v-if="contrForPrionum == 5"
                class="od-back"
                @click="$router.push('/user/myorder')"
                >{{ $t("login.return") }}</el-button>
            </div>
            <div class="od-info">
              <div class="od-field">
                <span class="od-label">{{ $t("myorderde.workordernumber") }}</span>
                <span class="od-value">{{ orderId || "-" }}</span>
              </div>
              <div class="od-field">
                <span class="od-label">{{ $t("myorderde.title") }}</span>
                <span class="od-value">{{ orderTitle || "-" }}</span>
              </div>
              <div class="od-field">
                <span class="od-label">{{ $t("myorderde.company") }}</span>
                <span class="od-value">{{ orderCustomername || "-" }}</span>
              </div>
              <div class="od-field">
                <span class="od-label">{{ $t("myorderde.questioncategory") }}</span>
                <span class="od-value">{{
                  (i8n == "zh" ? orderTypestr : enOrderTypestr) || "-"
                }}</span>
              </div>
              <div class="od-field">
                <span class="od-label">{{ $t("myorderde.priority") }}</span>
                <span class="od-value">{{
                  (i8n == "zh" ? orderPrioritystr : enOrderPrioritystr) || "-"
                }}</span>
              </div>
              <div class="od-field">
                <span class="od-label">{{ $t("myorderde.workorderstatus") }}</span>
                <span class="od-value">{{
                  (i8n == "zh" ? orderStatustr : enOrderStatustr) || "-"
                }}</span>
              </div>
              <div class="od-field">
                <span class="od-label">{{ $t("myorder.submissiontime") }}</span>
                <span class="od-value">{{ orderTime || "-" }}</span>
              </div>
              <div class="od-field od-field-full">
                <span class="od-label">{{ $t("myorderde.Questioncontent") }}</span>
                <span class="od-value od-content">{{ orderDetails || "-" }}</span>
              </div>
              <div class="od-field od-field-full">
                <span class="od-label">{{ $t("myorderde.Appendix") }}</span>
                <el-upload
                  class="upload-demo"
                  ref="uploads"
                  :action="editfilePath"
                  :data="editdataForFile"
                  :on-preview="edithandlePreview"
                  :on-remove="edithandleRemove"
                  :file-list="editfileList"
                  :on-change="edithandleChange"
                  :auto-upload="true"
                  :limit="5"
                  :before-upload="editFileUpload"
                  :on-success="editFileSuccess"
                  :disabled="orderStatus == 5"
                >
                  <template #trigger><el-button class="od-upload-btn">{{
                    $t("myorder.Addattachments")
                  }}</el-button></template>
                  <template #tip><div class="el-upload__tip">
                    {{ $t("myorder.text1") }}
                  </div></template>
                </el-upload>
              </div>
            </div>
          </div>

          <div class="page-panel od-card">
            <div class="od-card-head">
              <span class="od-card-title">{{ $t("myorderde.UserComments") }}</span>
              <span class="od-count">{{ MsgBoardList.length }}</span>
            </div>
            <div class="order_detail2">
              <el-scrollbar
                wrap-class="scrolllist"
                ref="scrollbar"
                view-class="view-box"
                :native="false"
              >
                <p v-if="MsgBoardList.length == 0" class="od-empty">
                  {{ $t("myorderde.Nomessage") }}
                </p>
                <div v-for="item in MsgBoardList" :key="item.id" class="od-msg">
                  <div class="od-msg-head">
                    <span class="od-msg-user">{{ item.username }}</span>
                    <span class="od-msg-time">{{ item.time }}</span>
                  </div>
                  <p class="od-msg-body">{{ item.details }}</p>
                </div>
              </el-scrollbar>
              <template v-if="orderStatus != 1 && orderStatus != 5">
                <el-input
                  class="od-reply"
                  type="textarea"
                  maxlength="255"
                  show-word-limit
                  v-model="sendData.details"
                  :placeholder="$t('myorderde.text')"
                ></el-input>
                <div class="od-actions">
                  <el-button
                    @click="upgradeOrder()"
                    v-if="
                      (contrForPrionum == 3 || contrForPrionum == 4) &&
                      upgradeUserOrder &&
                      userOrders
                    "
                    >{{ $t("myorderde.Liftingworkorder") }}</el-button>
                  <el-button
                    @click="upgradeOrderBack()"
                    v-if="
                      (contrForPrionum == 3 || contrForPrionum == 4) &&
                      !upgradeUserOrder &&
                      userOrders
                    "
                    >{{ $t("myorderde.Withdrawpromotion") }}</el-button>
                  <el-button type="primary" class="query" @click="sendMsg()">{{
                    $t("myorderde.Submitmessage")
                  }}</el-button>
                </div>
              </template>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import host from "../../host";
import Menu from "../../components/menu/Menu";
import basecard from "../../components/card/base-card";
import {
  getMsgBoard,
  insertMsgBoard,
  getQuestionOne,
  updateQuestionStatus,
  delFile,
} from "../../axios/api";
import System from "../../components/system/system.vue";
export default {
  components: {
    Menu,
    basecard,
    System,
  },

  Systemname: "OrderDetails",
  data() {
    return {
      i8n: this.$store.state.i18n,
      host: host,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      contrForPrionum: this.$store.state.userInfo.prionum,
      orderId: "",
      userOrders: true,
      MsgBoardList: [], //留言
      myorder: false,
      userorder: false,
      companyorder: false,
      upgradeUserOrder: true,

      orderCustomername: "", //公司
      orderDetails: "", //工单内容
      orderPrioritystr: "", //工单优先级
      orderPriority: "", //工单优先级
      enOrderPrioritystr: "", //工单优先级
      orderStatustr: "", //工单状态
      enOrderStatustr: "", //工单状态
      orderStatus: "",
      orderTitle: "", //工单标题
      orderTypestr: "", //问题类型
      enOrderTypestr: "", //问题类型
      orderType: "",
      orderTime: "", //工单提交时间
      orderFilenames: "",

      sendData: {
        questionid: "",
        username: this.$store.state.userInfo.username,
        details: "",
      },
      editfilePath: host.host + "service/updateQuestionMapFile",
      editdataForFile: {},
      editfileList: [], //upload多文件数组
      editfileData: "", //文件上传数据（多文件合一）
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
    formatDate(row, column) {
      if (row.time == null || row.time == 0) {
        return "";
      }
      let date = new Date(parseInt(row.time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDatecreatime(row, column) {
      if (row.creatime == null || row.creatime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.creatime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    edithandlePreview(file) {
      file.name = file.name.replace(/\s*/g, "");
      let name = file.name;
      let fileUrl = host.host + "question/" + file.name;
      this.downloadFile(name, fileUrl);
    },
    downloadFile(name, fileUrl) {
      var request = new XMLHttpRequest();
      request.responseType = "blob";
      // let fileUrl = Url; // 文件路径
      request.open("GET", fileUrl);
      request.onload = function () {
        var url = window.URL.createObjectURL(this.response);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = name;
        a.click();
      };
      request.send();
    },

    edithandleRemove(file, fileList) {
      var that = this;
      this.editfileList = fileList;
      let filename = [];
      for (let i = 0; i < fileList.length; i++) {
        filename.push(fileList[i].name);
      }
      let data = {
        delname: file.name,
        id: this.orderId,
        filename: filename.toString(),
      };

      delFile(
        JSON.stringify(data),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code != 1001) {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });

      if (fileList.length == 0) {
        this.haveFile = false;
      } else {
        this.haveFile = true;
      }
    },
    edithandleChange(file, fileList) {
      this.editfileList = fileList;
    },
    editFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("tet.tet15"));
        return false;
      }
      if (this.orderStatus == 5) {
        this.$message({
          message: this.$t("companyorder.tet4"),
          type: "warning",
        });
        this.$refs.uploads.abort();
        return false;
      }
      this.editdataForFile.id = this.orderId;
      this.editdataForFile.title = this.orderTitle;
      this.editdataForFile.type = this.orderType;
      this.editdataForFile.priority = this.orderPriority;
      this.editdataForFile.details = this.orderDetails;
      this.editdataForFile.status = this.orderStatus;
      let filename = [];
      for (let i = 0; i < this.editfileList.length; i++) {
        filename.push(this.editfileList[i].name);
      }
      this.editdataForFile.filename = filename;
    },
    editFileSuccess(response, file, fileList) {
      var that = this;
      if (response.code != 1001) {
        this.$message({
          message: response.msg,
          type: "error",
        });
        fileList.splice(fileList.length - 1, 1);
      } else {
        that.editfileList = [];
        that.orderFilenames = response.data.split(",");
        for (let i = 0; i < that.orderFilenames.length; i++) {
          that.editfileList.push({
            url: host.host + "question/" + that.orderFilenames[i],
            name: that.orderFilenames[i],
          });
        }
      }
    },

    //获取留言
    getOrderDetail(val) {
      var that = this;
      that.editfileList = [];
      let data = {
        id: this.orderId,
      };
      getQuestionOne(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          switch (res.data.upgrade) {
            case 1:
              that.upgradeUserOrder = false;
              break;
            case 2:
              that.upgradeUserOrder = true;
              break;
            default:
              that.upgradeUserOrder = true;
              break;
          }
          that.orderDetails = res.data.details;
          that.orderCustomername = res.data.customername;
          that.orderPrioritystr = res.data.prioritystr;
          that.enOrderPrioritystr = res.data.enpriority;
          that.orderPriority = res.data.priority;
          that.orderStatustr = res.data.statustr;
          that.enOrderStatustr = res.data.enstatus;
          that.orderStatus = res.data.status;
          that.orderTitle = res.data.title;
          that.orderTypestr = res.data.typestr;
          that.enOrderTypestr = res.data.entype;
          that.orderType = res.data.type;

          that.orderTime = that.formatDatecreatime(res.data);

          //自动滚动到底部
          that.$nextTick(() => {
            setTimeout(() => {
              that.$refs.scrollbar.$el.children[0].scrollTop =
                that.$refs.scrollbar.$el.children[0].scrollHeight;
            }, 0);
          });
          if (res.data.filename) {
            that.orderFilenames = res.data.filename.split(",");
            for (let i = 0; i < that.orderFilenames.length; i++) {
              that.editfileList.push({
                url: host.host + "question/" + that.orderFilenames[i],
                name: that.orderFilenames[i],
              });
            }
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
      this.getMsgBoards(this.orderId);
    },
    //查询留言信息
    getMsgBoards(val) {
      var that = this;
      let data = {
        questionid: val,
      };
      getMsgBoard(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.MsgBoardList = res.data;
            for (let i = 0; i < that.MsgBoardList.length; i++) {
              that.MsgBoardList[i].time = that.formatDate(that.MsgBoardList[i]);
            }
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    //提交留言
    sendMsg() {
      var that = this;
      this.sendData.questionid = this.orderId;
      if (this.sendData.details) {
        insertMsgBoard(
          that.sendData,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("mapmanagement.Submittedsuccessfully"),
              type: "success",
            });
            that.getOrderDetail();
            that.sendData.details = "";
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    //提升工单
    upgradeOrder() {
      var that = this;
      this.$confirm(this.$t("companyorder.tet5"), this.$t("Building.tips"), {
        customClass: "device-message-box",
        confirmButtonClass: "device-message-confirm",
        cancelButtonClass: "device-message-cancel",
        roundButton: false,
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          id: this.orderId,
          status: this.orderStatus,
          upgrade: "1",
        };
        updateQuestionStatus(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("companyorder.tet6"),
              type: "success",
            });

            that.upgradeUserOrder = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },
    //撤回提升的工单
    upgradeOrderBack() {
      var that = this;
      this.$confirm(this.$t("companyorder.tet7"), this.$t("Building.tips"), {
        customClass: "device-message-box",
        confirmButtonClass: "device-message-confirm",
        cancelButtonClass: "device-message-cancel",
        roundButton: false,
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          id: this.orderId,
          status: this.orderStatus,
          upgrade: "2",
        };
        updateQuestionStatus(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("companyorder.tet8"),
              type: "success",
            });
            that.upgradeUserOrder = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },
  },

  beforeMount() {
    this.orderId = this.$route.query.orderId;
    if (this.$route.query.myorder) {
      this.myorder = true;
      this.userOrders = false;
    } else if (this.$route.query.userorder) {
      this.userOrders = true;
      this.userorder = true;
    } else if (this.$route.query.companyorder) {
      this.userOrders = true;
      this.companyorder = true;
    }
    this.getOrderDetail();
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
.el-form-item .el-button {
  margin-left: 4px !important;
}
.od-breadcrumb {
  margin: 0 0 10px 2px !important;
}
.od-card {
  margin: 0 0 12px !important;
  padding: 16px 20px 18px;
}
.od-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px !important;
}
.od-card-title {
  margin: 0 !important;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}
.od-back {
  height: 28px;
  margin: 0 0 0 auto !important;
  padding: 0 14px;
}
.od-count {
  margin: 0 !important;
  min-width: 22px;
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 10px;
}
.od-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 24px;
  margin: 0 !important;
  text-align: left;
}
.od-field {
  display: flex;
  align-items: flex-start;
  min-width: 0;
  margin: 0 !important;
  font-size: 14px;
  line-height: 22px;
}
.od-field-full {
  grid-column: 1 / -1;
}
.od-label {
  flex: 0 0 88px;
  margin: 0 !important;
  color: #94a3b8;
}
.od-value {
  flex: 1;
  min-width: 0;
  margin: 0 !important;
  color: #0f172a;
  word-break: break-all;
}
.od-content {
  white-space: pre-wrap;
}

.upload-demo {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin: 0 !important;
}
.upload-demo :deep(.el-upload) {
  margin: 0 !important;
}
.od-upload-btn {
  height: 28px;
  padding: 0 12px;
  font-size: 13px;
}
.upload-demo :deep(.el-upload__tip) {
  margin: 0 !important;
  color: #94a3b8;
  white-space: nowrap;
}
.upload-demo :deep(.el-upload-list) {
  flex-basis: 100%;
  display: flex !important;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 !important;
}
.upload-demo :deep(.el-upload-list__item) {
  width: auto;
  margin: 0 !important;
  padding-right: 24px;
  text-align: left;
}
.upload-demo :deep(.el-icon-close-tip) {
  display: none !important;
}

.order_detail2 {
  margin: 0 !important;
}
.od-empty {
  margin: 0 !important;
  padding: 18px 0;
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
}
.od-msg {
  margin: 0 0 10px !important;
  padding: 10px 14px;
  text-align: left;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 8px;
}
.od-msg-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 4px !important;
}
.od-msg-user {
  margin: 0 !important;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}
.od-msg-time {
  margin: 0 !important;
  font-size: 12px;
  color: #94a3b8;
}
.od-msg-body {
  margin: 0 !important;
  font-size: 14px;
  line-height: 22px;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-all;
}
.od-reply {
  margin: 12px 0 0 !important;
}
.od-reply :deep(.el-textarea__inner) {
  min-height: 110px !important;
}
.od-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 12px 0 0 !important;
}
.od-actions .el-button {
  margin: 0 !important;
}

:deep(.scrolllist) {
  max-height: 360px;
}
</style>
