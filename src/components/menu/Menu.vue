<template>
  <div class="container">
    <div class="header">
      <el-col :span="4" class="header_item">
        <img :src="imgSrc" class="logo" />
      </el-col>

      <el-col :span="16" class="header_item">
        <el-menu
          class="menu"
          :default-active="this.$route.path"
          mode=""
          :router="true"
        >
          <el-menu-item
            index="/dashboard"
            :class="isActiveClass == 'dashboard' ? 'selectMenu' : ''"
            >{{ $t("index.homepage") }}</el-menu-item
          >
          <el-menu-item
            index="/terminal"
            v-if="contrForPrioNum != 6"
            :class="isActiveClass == 'terminal' ? 'selectMenu' : ''"
            >{{ $t("index.devicemanagement") }}</el-menu-item
          >
          <el-menu-item
            index="/usermanagement"
            v-if="
              contrForPrioNum == 1 ||
              contrForPrioNum == 2 ||
              contrForPrioNum == 3
            "
            :class="isActiveClass == 'user' ? 'selectMenu' : ''"
            >{{ $t("myorderde.usermanagement") }}</el-menu-item
          >
          <el-menu-item
            index="/customermanagement"
            v-if="contrForPrioNum == 4"
            :class="isActiveClass == 'user' ? 'selectMenu' : ''"
            >{{ $t("myorderde.usermanagement") }}</el-menu-item
          >
          <el-menu-item
            index="/territorymanagement"
            v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
            :class="isActiveClass == 'territory' ? 'selectMenu' : ''"
            >{{ $t("index.Territorialmanagement") }}</el-menu-item
          >
          <el-menu-item
            index="/mapmanagement"
            v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
            :class="isActiveClass == 'adminMap' ? 'selectMenu' : ''"
            >{{ $t("index.Mapmanagement") }}</el-menu-item
          >
          <el-menu-item
            index="/projectmanagement"
            v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
            :class="isActiveClass == 'project' ? 'selectMenu' : ''"
            >{{ $t("index.projectmanagement") }}</el-menu-item
          >
          <el-menu-item
            index="/test"
            v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
            :class="isActiveClass == 'data' ? 'selectMenu' : ''"
            >{{ $t("index.datamanagement") }}</el-menu-item
          >
          <el-menu-item
            index="/usercenter"
            v-if="
              contrForPrioNum == 1 ||
              contrForPrioNum == 2 ||
              contrForPrioNum == 3 ||
              contrForPrioNum == 4 ||
              contrForPrioNum == 5
            "
            :class="isActiveClass == 'system' ? 'selectMenu' : ''"
            >{{ $t("index.systemmanagement") }}</el-menu-item
          >
        </el-menu>
      </el-col>

      <el-col :span="4" class="header_item perDiv">
        <!-- 个人中心 -->
        <el-dropdown style="z-index: 999" class="perDropdown">
          <span class="el-dropdown-link perSpan">
            <i class="perIcon">
              <img src="../../../static/menu.png" alt />
            </i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goCenter">{{
              $t("index.PersonalCenter")
            }}</el-dropdown-item>
            <el-dropdown-item
              v-if="logoprio == 1 || clogoprio == 1"
              @click.native="goSetLogo"
              >{{ $t("index.Logosettings") }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                contrForPrioNum == 1 ||
                contrForPrioNum == 2 ||
                contrForPrioNum == 3 ||
                contrForPrioNum == 4
              "
              @click.native="sendMessage"
              >{{ $t("index.Sendnotification") }}</el-dropdown-item
            >

            <el-dropdown-item @click.native="logout">{{
              $t("index.signout")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 通知消息 -->
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('index.Messagenotification')"
          placement="bottom-end"
          :disabled="msgtable.length > 0"
          style="margin-right: 4%"
        >
          <el-dropdown
            style="z-index: 999; margin-left: 4%; margin-right: 0%"
            @click.native="goMsg()"
            class="perDropdown"
            v-if="msgtable.length > 0"
            :divided="true"
          >
            <span class="el-dropdown-link1 perSpan1">
              <i class="perIcon1">
                <img src="../../../static/message.png" alt />
                <el-badge
                  :value="msgtable.length"
                  class="msgbox"
                  v-show="msgtable.length > 0"
                >
                </el-badge>
              </i>
            </span>
            <el-dropdown-menu
              v-if="msgtable.length > 0"
              slot="dropdown"
              v-bind:class="[isActive ? 'boxcard' : 'hideClass']"
            >
              <div style="max-height: 200px; overflow: auto">
                <el-dropdown-item v-for="item in msgtable" :key="item.index">
                  <!--点击查看一条 -->
                  <div @click="upMsg(item)" style="padding-top: 12px">
                    <div style="font-weight: bold; line-height: 1.2">
                      {{ i8n == "zh" ? item.msg : item.enmsg }}
                    </div>
                    <span>{{ timeFormat(item.time) }}</span>
                    <div
                      style="
                        border-bottom: 1px dashed #ccc;
                        width: 100%;
                        height: 1px;
                      "
                    ></div>
                  </div>
                </el-dropdown-item>
              </div>
              <el-dropdown-item class="btnMsgHover">
                <span class="gtMessage"
                  ><el-button
                    type="text"
                    size="mini"
                    @click="redCourentMsg()"
                    >{{ $t("index.Currentlyread") }}</el-button
                  ></span
                >
                <span class="gtMessage1"
                  ><el-button type="text" size="mini" @click.native="goMsg()">{{
                    $t("index.Viewall")
                  }}</el-button></span
                >
              </el-dropdown-item>
            </el-dropdown-menu>

            <el-dropdown-menu style="border: none"></el-dropdown-menu>
          </el-dropdown>
          <span
            class="el-dropdown-link1 perSpan1"
            v-else
            style="margin-left: 16px"
            @click="goMsg()"
          >
            <i class="perIcon1">
              <img src="../../../static/message.png" alt />
              <el-badge
                :value="msgtable.length"
                class="msgbox"
                v-show="msgtable.length > 0"
              >
              </el-badge>
            </i>
          </span>
        </el-tooltip>

        <!-- 帮助菜单 -->
        <el-dropdown style="z-index: 100; margin-right: 2%;margin-left: 2%" v-if="i8n == 'zh'">
          <span class="el-dropdown-link perSpan">
            <i class="perIcon">
              <img src="../../../static/help.png" alt />
            </i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="Onlinedocumentation">{{
              $t("index.Onlinedocumentation")
            }}</el-dropdown-item>

            <el-dropdown-item @click.native="commonproblem"
              >{{ $t("index.commonproblem") }}
            </el-dropdown-item>

            <el-dropdown-item
              ><a href="javascript:;" class="helpitem">{{
                $t("index.Resourcedownload")
              }}</a></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <!-- 设置logo -->
      <el-dialog
        :title="$t('index.Setlogo')"
        :visible.sync="setLogo"
        class="edit"
        width="30%"
        style="text-align: center"
        :modal-append-to-body="false"
      >
        <el-upload
          :action="ImagePath"
          list-type="picture-card"
          :file-list="fileListAdd"
          :on-preview="handlePictureCardPreview"
          accept=".png, .jpg, .jpeg"
          :limit="1"
          ref="upload"
          :data="userIdForPic"
          :on-success="picSuccess"
          :on-error="picError"
          :headers="myHeader"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
        >
          <div slot="tip" class="el-upload__tip">
            {{ $t("index.pic") }}
          </div>
          <i class="el-icon-plus"></i>
        </el-upload>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancel">{{ $t("index.Cancel") }}</el-button>
          <el-button type="primary" @click="addTrue">{{
            $t("index.Confirm")
          }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        :append-to-body="true"
      >
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>

      <!-- 发送消息 -->
      <el-dialog
        :title="$t('index.sendmessage')"
        :visible.sync="showSendMessage"
        class="edit"
        width="30%"
        style="text-align: center"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        :append-to-body="true"
      >
        <el-form
          :model="sendMessages"
          style="margin-top: 20px"
          class="demo-form-inline"
        >
          <el-form-item
            style="width: 60%; margin-left: 0; text-align: left"
            :label="$t('index.Sendto')"
          >
            <el-select
              v-model="sendMessages.tenantid"
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
          <el-form-item>
            <el-input
              type="textarea"
              :rows="8"
              :placeholder="$t('index.entercontent')"
              v-model="sendMessages.msg"
              maxlength="255"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: -10px">
          <el-button @click="showSendMessage = false">{{
            $t("index.Cancel")
          }}</el-button>
          <el-button type="primary" @click="sendMsgTrue()">{{
            $t("index.Confirm")
          }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import host from "../../host.js";
import {
  loginout,
  getNotice,
  updateNoticeList,
  getCustomerName,
  insertNoticeList,
} from "../../axios/api";
export default {
  name: "Menu",
  data() {
    return {
      i8n: this.$store.state.i18n,
      clogoprio: this.$store.state.userInfo.clogoprio, //用来判断企业有没有设置logo的权限
      logoprio: this.$store.state.userInfo.logoprio, //用来判断用户有没有设置logo的权限
      contrForPrioNum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      searchList: {
        username: this.$store.state.userInfo.username,
        status: 1, //1 未读；2 已读
        page: "",
        count: "",
      },
      currentProjectid: {
        projectid: "",
      },
      sendMessages: {
        tenantid: "",
        msg: "",
      },

      websock: "",
      wsuri: host.ws + "user/" + this.$store.state.userInfo.username,
      // wsuri:
      //   "ws://192.168.2.12:14301/websocket/user/" +
      //   this.$store.state.userInfo.username,
      value: "",
      msgtable: [],
      tenantidData: [],
      SosTable: [],
      isActive: true,
      isActive2: true,
      // imgSrc: require("../../assets/rct.png"),
      imgSrc: "",
      setLogo: false,
      ImagePath: "v1/user/addMapFileLogo",
      fileListAdd: [],
      dialogImageUrl: "",
      dialogVisible: false,
      userIdForPic: {}, //添加图片携带参数
      myHeader: {
        tenantkey: this.$store.state.userInfo.tenantkey,
        ts: new Date().getTime(),
        tenantid: this.$store.state.userInfo.tenantid,
        userName: this.$store.state.userInfo.username,
      },
      showSendMessage: false,
      isActiveClass: "",
    };
  },
  beforeMount() {
    // this.imgSrc = host.host + "logo/" + this.$store.state.userInfo.filelogo;
    this.imgSrc = this.$store.state.userInfo.filelogo
      ? host.host + "logo/" + this.$store.state.userInfo.filelogo
      : "../../../../../static/logo.png";
    switch (this.$route.path) {
      case "/dashboard":
        this.isActiveClass = "dashboard";
        break;
      case "/terminal":
        this.isActiveClass = "terminal";
        break;
      case "/beacon":
        this.isActiveClass = "terminal";
        break;
      case "/aoa":
        this.isActiveClass = "terminal";
        break;
      case "/gateway":
        this.isActiveClass = "terminal";
        break;
      case "/ns":
        this.isActiveClass = "terminal";
        break;
      case "/nsconfig":
        this.isActiveClass = "terminal";
        break;

      case "/usermanagement":
        this.isActiveClass = "user";
        break;
      case "/companymanagement":
        this.isActiveClass = "user";
        break;

      case "/customermanagement":
        this.isActiveClass = "user";
        break;

      case "/territorymanagement":
        this.isActiveClass = "territory";
        break;

      case "/mapmanagement":
        if (
          this.$store.state.userInfo.prionum == 1 ||
          this.$store.state.userInfo.prionum == 2
        ) {
          this.isActiveClass = "adminMap";
        } else if (
          this.$store.state.userInfo.prionum == 3 ||
          this.$store.state.userInfo.prionum == 4
        ) {
          this.isActiveClass = "project";
        } else if (this.$store.state.userInfo.prionum == 5) {
          this.isActiveClass = "position";
        }
        break;
      case "/projectmanagement":
        this.isActiveClass = "project";
        break;
      case "/buildingmanagement":
        if (
          this.$store.state.userInfo.prionum == 3 ||
          this.$store.state.userInfo.prionum == 4
        ) {
          this.isActiveClass = "project";
        } else if (this.$store.state.userInfo.prionum == 5) {
          this.isActiveClass = "position";
        }
        break;
      case "/floormanagement":
        if (
          this.$store.state.userInfo.prionum == 3 ||
          this.$store.state.userInfo.prionum == 4
        ) {
          this.isActiveClass = "project";
        } else if (this.$store.state.userInfo.prionum == 5) {
          this.isActiveClass = "position";
        }
        break;
      case "/buildingdetails":
        if (
          this.$store.state.userInfo.prionum == 3 ||
          this.$store.state.userInfo.prionum == 4
        ) {
          this.isActiveClass = "project";
        } else if (this.$store.state.userInfo.prionum == 5) {
          this.isActiveClass = "position";
        }
        break;
      case "/location":
        this.isActiveClass = "project";
        break;
      case "/config":
        this.isActiveClass = "project";
        break;
      case "/locations/locationdeveui":
        if (
          this.$store.state.userInfo.prionum == 3 ||
          this.$store.state.userInfo.prionum == 4
        ) {
          this.isActiveClass = "project";
        } else if (this.$store.state.userInfo.prionum == 5) {
          this.isActiveClass = "position";
        }
        break;

      case "/test":
        this.isActiveClass = "data";
        break;
      case "/heartbeat":
        this.isActiveClass = "data";
        break;

      case "/downlink":
        this.isActiveClass = "data";
        break;

      case "/warningmanagement":
        if (
          this.$store.state.userInfo.prionum == 3 ||
          this.$store.state.userInfo.prionum == 4
        ) {
          this.isActiveClass = "data";
        } else if (this.$store.state.userInfo.prionum == 5) {
          this.isActiveClass = "warning";
        }
        break;

      case "/staffmanagement":
        this.isActiveClass = "staff";
        break;
      case "/tboxManagement":
        this.isActiveClass = "staff";
        break;
      case "/assetManagement":
        this.isActiveClass = "staff";
        break;
      case "/checkwork":
        this.isActiveClass = "staff";
        break;
      case "/inspection":
        this.isActiveClass = "staff";
        break;
      case "/outdoor/locationoutdoor":
        this.isActiveClass = "position";
        break;

      case "/indoor/locationindoor":
        this.isActiveClass = "position";
        break;
      case "/indoor3d/locationindoor3d":
        this.isActiveClass = "position";
        break;
      case "/logmanagement":
        this.isActiveClass = "system";
        break;

      case "/myorder":
        this.isActiveClass = "system";
        break;
      case "/usercenter":
        this.isActiveClass = "system";
        break;
      case "/userorder":
        this.isActiveClass = "system";
        break;
      case "/orderdetails":
        this.isActiveClass = "system";
        break;
      default:
        break;
    }
  },
  mounted() {
    if (this.$route.name == "Message") {
      this.isActive = false;
    } else if (this.$route.name == "WarningManagement") {
      this.isActive2 = false;
    }
    if (this.$route.name != "Message") {
      this.getMsg();
    }
    this.getPustMsg();
  },

  methods: {
    Onlinedocumentation() {
      // 说明：帮助文档地址以环境变量为基础，默认你的线上地址
      const base = process.env.VUE_APP_HELP_BASE
      window.open(base, "_blank");
    },
    commonproblem() {
      const base = process.env.VUE_APP_HELP_BASE
      window.open(base + "/faq", "_blank");
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.projectid == this.$store.state.intoProjectid) {
        return "select-row";
      }
      return "";
    },
    addCancel() {
      this.setLogo = false;
      this.$refs.upload.clearFiles();
    },
    addTrue() {
      if (this.contrForPrioNum == 5) {
        this.userIdForPic.username = this.userName;
        this.userIdForPic.tenantid = this.tenantid_A;
      } else if (
        this.contrForPrioNum == 3 ||
        this.contrForPrioNum == 4 ||
        this.contrForPrioNum == 1 ||
        this.contrForPrioNum == 2
      ) {
        this.userIdForPic.tenantid = this.tenantid_A;
        this.userIdForPic.username = this.userName;
      }
      this.$refs.upload.submit();
    },
    picSuccess(response, file, fileList) {
      file = "";
      this.$refs.upload.clearFiles();
      if (response.code == 1001) {
        this.setLogo = false;
        this.imgSrc = host.host + "logo/" + response.data.filelogo;
        this.$store.commit("changeLogo", response.data.filelogo);
        this.$store.state.addRoutes = [];
        sessionStorage.setItem("state", JSON.stringify(this.$store.state));
        this.$message({
          message: this.$t("index.Setsuccessfully"),
          type: "success",
        });
      } else {
        this.$message({
          message: response.msg,
          type: "warning",
        });
      }
    },
    picError(err) {
      this.$refs.upload.clearFiles();
      this.$message({
        message: this.$t("index.Settingfailed"),
        type: "error",
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t("tet.tet10"));
    },
    beforeAvatarUpload(file) {
      var index = file.name.lastIndexOf(".");
      var type = file.name.substr(index + 1); //文件后缀名
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.error(this.$t("tet.tet12"));
        this.backgroundImg = false;
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("tet.tet13"));
        this.backgroundImg = false;
      }
      return isLt2M;
    },
    getPustMsg() {
      this.$EventBus.$on("pushData", (msgId) => {
        //删除id数据
        for (let i = 0; i < this.msgtable.length; i++) {
          if (this.msgtable[i].id == msgId) {
            this.msgtable.splice(i, 1);
          }
        }
      });
    },
    //获取通知消息
    getMsg() {
      var that = this;
      getNotice(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.msgtable = res.data.list;
          that.value = res.data.list.length;
        }
      });
    },

    // 标为已读
    //用item接收数据,读一条数据
    upMsg(item) {
      var that = this;
      let ids = [];
      ids.push(item.id);
      let datas = {
        ids: ids,
      };
      //前端处理 删除已读数据
      for (let i = 0; i < that.msgtable.length; i++) {
        if (that.msgtable[i].id == item.id) {
          that.msgtable.splice(i, 1);
        }
      }
      updateNoticeList(
        datas,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {});
    },

    //标记当前已读，读当前所有数据
    redCourentMsg() {
      if (this.msgtable.length > 0) {
        let ids = [];
        //前端处理
        for (let i = 0; i < this.msgtable.length; i++) {
          if (this.msgtable[i].status == 1) {
            ids.push(this.msgtable[i].id);
          }
        }
        let datas = {
          ids: ids,
        };
        updateNoticeList(
          datas,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          this.msgtable = [];
        });
      }
    },

    //时间转换
    timeFormat(time) {
      if (time == null || time == 0) {
        return "";
      }
      let date = new Date(parseInt(time) * 1000);
      let Y = date.getFullYear() + "-";
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      let h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      let m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    logout() {
      this.$confirm(this.$t("index.surelogout"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      })
        .then(() => {
          var that = this;
          let para = {};
          loginout(
            para,
            this.tenantkey_A,
            this.tenantkey_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$store.commit("setuserInfo", "");
              that.$store.state.projectid = "";
              that.$store.commit("resetRoutes");
              that.$router.push("/login");
              that.$message({
                message: that.$t("usercenter.logout"),
                type: "success",
              });
              // 退出清除页面上所有的SOS告警
              let sosList = that.$store.state.sosList;
              if (sosList.length > 0) {
                for (let i in sosList) {
                  sosList[i].value.close();
                }
              }
              // that.$store.commit("changeGoNext", false);
              sessionStorage.clear();
              window.localStorage.clear();
              window.location.reload();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("usercenter.cancel"),
          });
        });
    },

    goCenter() {
      this.$router.push("/usercenter");
    },
    //设置logo
    goSetLogo() {
      this.fileListAdd = [];
      this.setLogo = true;
    },

    //发送通知
    sendMessage() {
      this.getCustomerNames();
      this.showSendMessage = true;
    },

    // 查看全部还是未读状态
    goMsg() {
      this.$router.push("/message");
    },

    //获取所有的Tenantid
    getCustomerNames() {
      let data;
      if (this.contrForPrioNum == 1 || this.contrForPrioNum == 2) {
        data = {
          beginlevel: 1,
          endlevel: 3,
        };
      } else if (this.contrForPrioNum == 3 || this.contrForPrioNum == 4) {
        data = {
          superid: this.$store.state.userInfo.tenantid,
          beginlevel: 2,
          endlevel: 4,
        };
      }
      this.tenantidData = [];
      // this.searchSelectCountry = [];
      getCustomerName(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        let tenantidData = [];
        tenantidData = res.data;
        tenantidData.unshift({
          username: this.$t("index.Allusers"),
          tenantid: "all",
        });
        this.tenantidData = tenantidData;
      });
    },

    sendMsgTrue() {
      let that = this;
      if (this.sendMessages.tenantid == "") {
        this.$message({
          message: this.$t("index.sendingobject"),
          type: "warning",
        });
        return;
      }
      if (this.sendMessages.msg == "") {
        this.$message({
          message: this.$t("index.contentsend"),
          type: "warning",
        });
        return;
      }
      //发送所有人
      let sendMessages1;
      if (this.sendMessages.tenantid == "all") {
        sendMessages1 = {
          msg: this.sendMessages.msg,
          superid: this.$store.state.userInfo.tenantid,
        };
      } else {
        sendMessages1 = this.sendMessages;
      }
      insertNoticeList(
        sendMessages1,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.showSendMessage = false;
          that.$message({
            message: that.$t("tips.sendOut"),
            type: "success",
          });
          that.sendMessages = {
            tenantid: "",
            msg: "",
          };
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
  },

  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;

      Object.assign(
        this.$data.msgtable,
        this.$options.data.call(this).msgtable
      );
    },
  },
};
</script>

<style>
.logo {
  height: 60px;
  margin-left: 10px;
}

.menu {
  height: 60px;
  display: flex;
  justify-content: space-between !important;
  border: none !important;
  background-color: #409eff !important;
}

.menu .el-menu-item {
  height: 60px !important;
  color: white;
}

.menu .el-menu-item:hover {
  color: #844200;
}

.menu .is-active {
  background: white;
  color: #844200;
}

.selectMenu {
  color: #844200 !important;
  background: white;
}

.header_item {
  height: 60px;
  background-color: #409eff !important;
}

.el-message--success {
  display: -webkit-box;
}

.boxcard {
  display: block;
  width: 480px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}

.hideClass {
  display: none;
}

.el-dropdown-link1 {
  margin-left: 10px;
}

.msgbox {
  position: absolute !important;
  top: -8px;
  left: 22px;
  z-index: 10000;
}

/* .warningbox {
  position: absolute !important;
  top: -8px;
  right: 0px;
} */
.btnMsgHover {
  background-color: #ffffff !important;
}

.btnMsgHover:hover {
  background-color: unset !important;
}

.gtMessage {
  padding-left: 4%;
}

.gtMessage1 {
  float: right;
  padding-right: 6%;
}

.header {
  position: fixed;
  width: 100%;
  z-index: 99;
  background: white;
  /* border-bottom: 2px solid #DDDDFF; */
}

.perDiv {
  display: flex;
  justify-content: end;
}

.perDropdown {
  margin-right: 0;
}

.perSpan {
  display: inline-block;
  height: 56px;
  line-height: 56px;
}

.perSpan1 {
  display: inline-block;
  height: 56px;
  line-height: 56px;
}

.perIcon {
  display: inline-block;
  width: 32px;
  height: 32px;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.perIcon1 {
  display: inline-block;
  width: 30px;
  height: 30px;
  position: relative;
  top: 50%;
  transform: translateY(-55%);
}

.demo-form-inline .el-form-item__label {
  padding: 0;
  line-height: 34px !important;
}

.demo-form-inline .el-form-item__content {
  line-height: 34px !important;
}

.demo-form-inline .el-input__inner {
  height: 34px !important;
  line-height: 34px !important;
}

.demo-form-inline .el-input__icon {
  height: 34px !important;
  line-height: 34px !important;
}

.demo-form-inline >>> .el-input__suffix {
  right: 0 !important;
}

.add,
.del {
  padding: 8px 12px !important;
}

.select-row {
  background: #409eff !important;
}

/*项目选择 */
.project-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  transform: translateX(0.2vw);
}

.project-item {
  margin: 0;
  position: relative;
  z-index: 1;
  width: 11.2vw;
  padding-bottom: 20px;
  z-index: 0;
  transition: all 0.3s;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5vw;
  box-shadow: 3px 3px 4px -2px #d6d6d6;
}

.project-item:hover {
  z-index: 2;
  transform: scale(1.05);
  -moz-box-shadow: 1px 5px 14px #cccccc;
  -webkit-box-shadow: 1px 5px 14px #cccccc;
  box-shadow: 1px 5px 14px #cccccc;
}

.item-header {
  position: relative;
  height: 40px;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.active-item .item-header {
  background: #ff9b44;
}

.item-header .isactive {
  width: 46px;
  height: 46px;
  position: absolute;
  background: #ffca9c;
  top: -23px;
  right: -23px;
  transform: rotate(45deg);
}

.item-header .isactive .icon {
  position: absolute;
  bottom: 0;
  transform: rotate(-45deg);
  width: 12px;
  height: 12px;
  background: #fff;
  mask: url("../../assets/pick.svg");
  mask-size: contain;
}

.item-header .item-icon {
  margin: 0;
  margin-right: 10px;
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #fff;
  mask: url("../../assets/firm.svg");
  mask-size: contain;
  font-size: 18px;
}

.item-info {
  display: flex;
  margin-top: 14px;
  justify-self: start;
}

.item-info .key {
  display: flex;
  flex-direction: column;
  color: #8c8c8c;
  margin-right: 10px;
  margin-left: 10px;
  white-space: nowrap;
}

.item-info .key span {
  margin-left: 0;
  margin-top: 4px;
}

.item-info .value {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.item-info .value span {
  margin-left: 0;
  margin-top: 4px;
  color: #2d2d2d;
}

.padreduce .el-dialog__body {
  padding-bottom: 30px;
}

/* .sendmessage  .el-form-item__label{
  text-align: left !important;
} */

.helpitem {
  text-decoration: none;
  color: #606266;
}

.helpitem:hover {
  color: #409eff;
}

.perSpan1 {
  margin-right: 0;
}

.el-dropdown-link1 {
  margin-left: 4px;
}

.el-dropdown-menu__item:hover a {
  color: #409eff;
}
</style>
