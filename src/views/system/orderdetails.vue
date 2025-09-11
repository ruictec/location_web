<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><System /></el-aside>
        <el-main>
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                :to="{ path: '/user/myorder' }"
                v-if="myorder"
                >{{ $t("Breadcrumb.Myworkorder") }}</el-breadcrumb-item
              >
              <el-breadcrumb-item
                :to="{ path: '/userorder' }"
                v-if="userorder"
                >{{ $t("list.Userworkorder") }}</el-breadcrumb-item
              >
              <el-breadcrumb-item
                :to="{ path: '/companyorder' }"
                v-if="companyorder"
                >{{ $t("list.Enterpriseworkorder") }}</el-breadcrumb-item
              >
              <el-breadcrumb-item
                ><a>{{
                  $t("Breadcrumb.Workorderdetails")
                }}</a></el-breadcrumb-item
              >
            </el-breadcrumb>
            <!-- <h2>工单详情</h2> -->
            <el-divider class="divider"></el-divider>
            <div class="order_detail1">
              <div class="order_detail1_1">
                <p>
                  <span>{{ $t("myorderde.workordernumber") }}</span>
                  <span>{{ orderId }}</span>
                </p>
                <p>
                  <span>{{ $t("myorderde.title") }}</span>
                  <span>{{ orderTitle }}</span>
                </p>
                <p>
                  <span>{{ $t("myorderde.questioncategory") }}</span>
                  <span>{{ i8n == "zh" ? orderTypestr : enOrderTypestr }}</span>
                </p>
                <p>
                  <span>{{ $t("myorderde.priority") }}</span>
                  <span>{{
                    i8n == "zh" ? orderPrioritystr : enOrderPrioritystr
                  }}</span>
                </p>
                <p>
                  <span>{{ $t("myorderde.workorderstatus") }}</span>
                  <span>{{
                    i8n == "zh" ? orderStatustr : enOrderStatustr
                  }}</span>
                </p>
              </div>
              <div class="order_detail1_2">
                <p>
                  <span>{{ $t("myorderde.company") }}</span>
                  <span>{{ orderCustomername }}</span>
                </p>
                <p>
                  <span>{{ $t("myorderde.Questioncontent") }}</span>
                  <span>{{ orderDetails }}</span>
                </p>
                <p>
                  <span>{{ $t("myorderde.Appendix") }}</span>

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
                    <a slot="trigger">{{ $t("myorder.Addattachments") }}</a>
                    <div slot="tip" class="el-upload__tip">
                      {{ $t("myorder.text1") }}
                    </div>
                  </el-upload>
                </p>
                <p class="uploadTime">
                  <span> {{ $t("myorder.submissiontime") }}</span>
                  <span>{{ orderTime }}</span>
                </p>
              </div>
            </div>
          </div>
          <div style="margin-top: 3%">
            <h2>{{ $t("myorderde.UserComments") }}</h2>
            <el-divider class="divider"></el-divider>
            <div class="order_detail2">
              <el-scrollbar
                wrap-class="scrolllist"
                ref="scrollbar"
                view-class="view-box"
                :native="false"
              >
                <p
                  v-if="MsgBoardList.length == 0"
                  style="text-align: left; color: #6f6f6f; font-size: 14px"
                >
                  {{ $t("myorderde.Nomessage") }}
                </p>
                <ul v-for="item in MsgBoardList" :key="item.id" class="item">
                  <li>
                    <p>
                      <span
                        style="
                          font-size: 16px;
                          font-weight: 600;
                          margin-right: 1.5%;
                        "
                        >{{ item.username }}</span
                      >
                      <span style="color: #6f6f6f">{{ item.time }}</span>
                    </p>
                    <p>
                      <span style="font-size: 16px">{{ item.details }}</span>
                    </p>
                  </li>
                </ul>
              </el-scrollbar>
              <el-input
                type="textarea"
                maxlength="255"
                show-word-limit
                v-model="sendData.details"
                :placeholder="$t('myorderde.text')"
                v-if="orderStatus != 1 && orderStatus != 5"
              ></el-input>
              <div
                style="display: flex"
                v-if="orderStatus != 1 && orderStatus != 5"
              >
                <el-button type="primary" class="sendMsg" @click="sendMsg()">{{
                  $t("myorderde.Submitmessage")
                }}</el-button>
                <el-button
                  type="primary"
                  class="sendMsg"
                  @click="upgradeOrder()"
                  v-if="
                    (contrForPrionum == 3 || contrForPrionum == 4) &&
                    upgradeUserOrder &&
                    userOrders
                  "
                  >{{ $t("myorderde.Liftingworkorder") }}</el-button
                >
                <el-button
                  type="primary"
                  class="sendMsg"
                  @click="upgradeOrderBack()"
                  v-if="
                    (contrForPrionum == 3 || contrForPrionum == 4) &&
                    !upgradeUserOrder &&
                    userOrders
                  "
                  >{{ $t("myorderde.Withdrawpromotion") }}</el-button
                >
              </div>
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
      editfilePath: host.host + "user/updateQuestionMapFile",
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

.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
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
h2 {
  text-align: left;
  font-size: 18px;
}
.order_detail1 {
  display: flex;
}
.order_detail1_1 {
  width: 50%;
  margin-left: 0;
  margin-right: 0;
}
.order_detail1_2 {
  width: 50%;
  margin-left: 0;
}
.order_detail1 p {
  display: flex;
  margin-top: 20px;
}
.order_detail1 p span {
  margin-left: 0;
  text-align: left;
  color: #3a3a3a;
}
.order_detail1 p span:nth-of-type(1) {
  width: 10%;
  margin-right: 0;
  color: #999;
}
/* .order_detail1 p span:nth-of-type(2) {
  width: 90%;
} */

.order_detail2 ul {
  text-align: left;
}
.order_detail2 ul li {
  display: flex;
  margin-top: 12px;
  text-align: left;
  flex-direction: column;
}
.order_detail2 ul li p {
  margin-left: 0;
  text-align: left;
}
.order_detail2 ul li p span {
  margin-left: 0;
  text-align: left;
  margin-top: 5px;
  /* display: flex; */
}
.order_detail2 ul li p:nth-of-type(1) {
  margin-right: 2%;
  white-space: nowrap;
}
.order_detail2 ul li p:nth-of-type(2) {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
}
.order_detail2 >>> .el-textarea__inner {
  margin-top: 20px;
  min-height: 150px !important;
}

.upload-demo {
  margin-left: 0 !important;
  display: flex;
}
.upload-demo >>> .el-upload--text {
  margin-left: 0 !important;
  white-space: nowrap;
}
.upload-demo >>> .el-upload__tip {
  margin-top: 2px !important;
  white-space: nowrap;
  margin-left: 2%;
}
.upload-demo >>> .el-upload-list {
  display: flex !important;
  flex-wrap: wrap;
  margin-left: 2%;
}
.upload-demo >>> .el-upload-list__item {
  margin-top: 0 !important;
  text-align: left;
  width: auto;
  margin-left: 0;
}
.upload-demo >>> .el-icon-close-tip {
  display: none !important;
}

.sendMsg {
  display: block;
  margin-top: 10px;
}
.uploadTime {
  margin-top: 30px !important;
}

>>> .scrolllist {
  max-height: 360px;
}
/* >>>.el-scrollbar__thumb {
  height: 60px;
} */
.item {
  padding-bottom: 14px;
  border-bottom: 1px dashed #ccc;
}
</style>
