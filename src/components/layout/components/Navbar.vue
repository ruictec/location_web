<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="$store.state.show"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="accessory">
      <!-- 首页 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('navbar.Gohome')"
        placement="bottom"
      >
        <span
          class="golink hover-effect"
          @click="goLink('home')"
          style="position: relative"
        >
          <i class="icon1 home" style="font-size: 28px"></i>
        </span>
      </el-tooltip>
      <!-- 告警信息 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('navbar.Alarminformation')"
        placement="bottom"
      >
        <span
          class="golink hover-effect"
          @click="goLink('warning')"
          style="position: relative"
        >
          <i class="icon1 sos" style="font-size: 28px"></i>
          <el-badge
            class="warningbox"
            :value="warningNum"
            v-show="warningNum > 0"
          >
          </el-badge>
        </span>
      </el-tooltip>
      <!-- 巡检管理 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('Breadcrumb.Patrolmanagement')"
        placement="bottom"
        v-if="task"
      >
        <span class="golink hover-effect" @click="goLink('inspection')">
          <i class="icon1 patrol" style="font-size: 28px"></i>
        </span>
      </el-tooltip>
      <!-- 行为分析 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('navbar.behavioranalysis')"
        placement="bottom"
        v-if="employee"
      >
        <span class="golink hover-effect" @click="goLink('trajectory')">
          <i class="icon1 active" style="font-size: 28px"></i>
        </span>
      </el-tooltip>
      <!-- 室内定位 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('navbar.Indoorpositioning')"
        placement="bottom"
        v-if="inDoor"
      >
        <span class="golink hover-effect" @click="goLink('indoor')">
          <i class="icon1 indoor" style="font-size: 28px"></i
        ></span>
      </el-tooltip>
      <!-- 室外定位 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('navbar.Outdoorpositioning')"
        placement="bottom"
        v-if="outDoor"
      >
        <span class="golink hover-effect" @click="goLink('outdoor')">
          <i class="icon1 outdoor" style="font-size: 28px"></i>
        </span>
      </el-tooltip>

      <!-- 全屏 -->
      <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <el-dropdown style="z-index: 999" class="perDropdown">
        <span class="el-dropdown-link perSpan">
          <i class="icon menu1" style="font-size: 24px"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="goCenter">{{
            $t("navbar.PersonalCenter")
          }}</el-dropdown-item>

          <el-dropdown-item
            v-if="contrForPrioNum == 5 && $store.state.projectTable.length > 1"
            @click.native="selectProject"
            >{{ $t("navbar.Selectitem") }}</el-dropdown-item
          >
          <el-dropdown-item
            v-if="logoprio == 1 || clogoprio == 1"
            @click.native="goSetLogo"
            >{{ $t("navbar.Logosettings") }}</el-dropdown-item
          >
          <el-dropdown-item @click.native="goscreen" v-if="i8n == 'zh'">{{
            $t("index.largescreen")
          }}</el-dropdown-item>
          <el-dropdown-item
            v-if="
              contrForPrioNum == 1 ||
              contrForPrioNum == 2 ||
              contrForPrioNum == 3 ||
              contrForPrioNum == 4
            "
            @click.native="sendMessage"
            >{{ $t("navbar.Sendnotification") }}</el-dropdown-item
          >
          <el-dropdown-item @click.native="logout">{{
            $t("navbar.signout")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 通知消息 -->
      <el-tooltip
        class="itemMessage"
        effect="dark"
        :content="$t('navbar.Messagenotification')"
        placement="bottom-end"
        :disabled="msgtable.length > 0"
      >
        <el-dropdown
          style="z-index: 999"
          @click.native="goMsg()"
          class="perDropdown"
          :divided="true"
        >
          <span class="el-dropdown-link1 el-dropdown-link perSpan1">
            <!-- <i class="perIcon1"> -->
            <i class="icon bell" style="font-size: 24px"></i>
            <el-badge
              :value="msgtable.length"
              class="msgbox"
              v-show="msgtable.length > 0"
            ></el-badge>
            <!-- </i> -->
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
              <span class="gtMessage">
                <el-button type="text" size="mini" @click="redCourentMsg()">{{
                  $t("navbar.tet")
                }}</el-button>
              </span>
              <span class="gtMessage1">
                <el-button type="text" size="mini" @click.native="goMsg()">{{
                  $t("navbar.tet1")
                }}</el-button>
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>

          <el-dropdown-menu style="border: none"></el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
      <!-- 帮助菜单 -->
      <el-dropdown style="z-index: 100" class="perDropdown" v-if="i8n == 'zh'">
        <span class="el-dropdown-link perSpan">
          <i class="more icon" style="font-size: 24px"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="Onlinedocumentation">
            {{ $t("navbar.Onlinedocumentation") }}
          </el-dropdown-item>

          <el-dropdown-item @click.native="commonproblem">
            {{ $t("navbar.commonproblem") }}
          </el-dropdown-item>

          <el-dropdown-item v-if="contrForPrioNum != 5">
            <a href="javascript:;" class="helpitem">{{
              $t("navbar.Resourcedownload")
            }}</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 显示/隐藏告警弹框 -->
      <el-button
        v-show="showWarnignButton > 0"
        type="primary"
        size="mini"
        class="warning_button"
        @click="changeShowWarning()"
        >{{ buttonText }}</el-button
      >
    </div>
    <!-- 设置logo -->
    <el-dialog
      :title="$t('navbar.Setlogo')"
      :visible.sync="setLogo"
      class="edit"
      width="30%"
      style="text-align: center"
      :modal-append-to-body="false"
      :append-to-body="true"
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
          {{ $t("navbar.tet2") }}
        </div>
        <i class="el-icon-plus"></i>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">{{ $t("terminal.cancel") }}</el-button>
        <el-button type="primary" @click="addTrue">
          {{ $t("terminal.confirm") }}</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!-- 选择项目 -->
    <el-dialog
      :title="$t('navbar.Selectitem')"
      :visible.sync="selectProjects"
      class="edit padreduce"
      style="text-align: center"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="40%"
    >
      <div class="project-wrapper">
        <div
          class="project-item"
          v-for="(item, index) in projectTable"
          :key="index"
          @click="choseProject(item)"
          :class="{
            'active-item': $store.state.projectid === item.projectid,
          }"
        >
          <div class="item-header">
            <div class="item-icon"></div>
            {{ item.name }}
            <div
              v-if="$store.state.projectid === item.projectid"
              class="isactive"
            >
              <i class="icon"></i>
            </div>
          </div>
          <div class="item-info">
            <div class="key">
              <span>{{ $t("navbar.number") }}</span>
              <span>{{ $t("navbar.type") }}</span>
              <span>{{ $t("navbar.remarks") }}</span>
            </div>
            <div class="value">
              <span>{{ item.projectid }}</span>
              <span>{{ i8n == "zh" ? item.typestr : item.entype }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.memo"
                placement="bottom-end"
              >
                <span>{{ item.memo }}</span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
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
          :label="$t('navbar.Sendto')"
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
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: -10px">
        <el-button @click="showSendMessage = false">{{
          $t("terminal.cancel")
        }}</el-button>
        <el-button type="primary" @click="sendMsgTrue()">{{
          $t("terminal.confirm")
        }}</el-button>
      </div>
    </el-dialog>
    <audio :src="audioSrc" controls="controls" loop hidden ref="audio"></audio>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "./Breadcrumb";
import Hamburger from "./Hamburger";
import host from "../../../host.js";
import Screenfull from "./Screenfull";
import {
  loginout,
  getNotice,
  updateNoticeList,
  getProjectFirstList,
  getWarningNum,
  getCustomerName,
  insertNoticeList,
} from "../../../axios/api";
export default {
  data() {
    return {
      buttonText: this.$t("navbar.hideNotification"),
      attenFlag: this.$store.state.functionParts.attenFlag,
      alarmConfig: this.$store.state.functionParts.alarmConfig,
      tboxConfig: this.$store.state.functionParts.tboxConfig,
      employee: this.$store.state.functionParts.employee,
      asset: this.$store.state.functionParts.asset,
      tbox: this.$store.state.functionParts.tbox,
      attendance: this.$store.state.functionParts.attendance,
      task: this.$store.state.functionParts.task,
      inDoor: this.$store.state.functionParts.inDoor,
      outDoor: this.$store.state.functionParts.outDoor,
      i8n: this.$store.state.i18n,
      warning: "../../../../../static/warning.png",
      trajectory: "../../../../../static/trajectory.png",
      indoor: "../../../../../static/trajectory.png",
      outdoor: "../../../../../static/trajectory.png",
      clogoprio: this.$store.state.userInfo.clogoprio, //用来判断企业有没有设置logo的权限
      logoprio: this.$store.state.userInfo.logoprio, //用来判断用户有没有设置logo的权限
      contrForPrioNum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      sendMessages: {
        tenantid: "",
        msg: "",
      },
      websock: "",
      wsuri: host.ws + "user/" + this.$store.state.userInfo.username,
      value: "",
      msgtable: [],
      tenantidData: [],
      warningNum: this.$store.state.warningNum,
      showWarnignButton: this.$store.state.sosNums,
      showWarningDialog: this.$store.state.showWarningDialog,

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
      selectProjects: false,
      showSendMessage: false,
      projectTable: [],
      // projectList: [],
      isActiveClass: "",
      timer: null,
      searchList: {
        username: this.$store.state.userInfo.username,
        status: 1, //1 未读；2 已读
        page: "",
        count: "",
      },

      // 音效相关

      audioSrc: "",
      audioTimer: true,
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull,
    // SizeSelect,
    // Search
  },
  created() {
    this.getProjectLists();
    if (this.$store.state.userInfo.prionum == 5) {
      this.timer = setInterval(() => {
        this.getWarningLists();
        this.getMsg();
      }, 30000);
    }
  },
  beforeMount() {
    this.imgSrc = host.host + "logo/" + this.$store.state.userInfo.filelogo;
  },
  mounted() {
    if (this.$store.state.showWarningDialog) {
      this.buttonText = this.$t("navbar.hideNotification");
    } else {
      this.buttonText = this.$t("navbar.showNotification");
    }
    this.getMsg();
    if (this.$store.state.userInfo.prionum == 5) {
      this.getWarningLists();
    }
    this.getPustMsg();
  },
  methods: {
    // 改变告警弹框的层级
    changeShowWarning() {
      if (this.$store.state.showWarningDialog) {
        this.$store.commit("changeWarningDialog", false);
        this.buttonText = this.$t("navbar.showNotification");
      } else {
        this.$store.commit("changeWarningDialog", true);
        this.buttonText = this.$t("navbar.hideNotification");
      }
    },
    Onlinedocumentation() {
      if (this.i8n == "zh") {
        // 说明：在线文档地址从环境变量读取，可与资产地址不同。
        const doc = process.env.VUE_APP_DOC_BASE
        window.open(doc, "_blank");
      } else {
        const doc = process.env.VUE_APP_DOC_BASE
        window.open(doc + "/en", "_blank");
      }
    },
    commonproblem() {
      if (this.i8n == "zh") {
        const doc = process.env.VUE_APP_DOC_BASE
        window.open(doc + "/faqs.html", "_blank");
      } else {
        const doc = process.env.VUE_APP_DOC_BASE
        window.open(doc + "/en/faqs.html", "_blank");
      }
    },

    goLink(value) {
      switch (value) {
        case "warning":
          this.$router.push({ path: "/warningu/index" });
          break;
        case "trajectory":
          this.$router.push({ path: "/staff/staffmanagement" });
          break;
        case "indoor":
          this.$router.push({ path: "/location/indoor/locationindoor" });
          break;
        case "outdoor":
          this.$router.push({ path: "/location/outdoor/locationoutdoor" });
          break;
        case "home":
          this.$router.push({ path: "/dashboard" });
          break;
        case "inspection":
          this.$router.push({ path: "/staff/inspection" });
          break;
        default:
          break;
      }
    },
    toggleSideBar() {
      this.$store.commit("changeShow", !this.$store.state.show);
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
          message: this.$t("index.Settingfailed"),
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
    myHeaderd() {
      let d = new Date();
      let time_A = d.getTime();
      this.myHeader.tenantkey = this.tenantkey_A;
      this.myHeader.ts = this.time_A;
      this.myHeader.tenantid = this.tenantid_A;
      this.myHeader.userName = this.userName;
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

    //获取告警信息
    getWarningLists() {
      if (this.$store.state.intoProjectid) {
        let data = {
          superid: this.$store.state.userInfo.superid,
          projectid: this.$store.state.intoProjectid,
          status: 1,
        };

        var that = this;
        getWarningNum(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.warningNum = res.data.size;
            that.$store.commit("setWarningNum", res.data.size);
            let sosNumss = that.$store.state.sosNums;
            if (sosNumss == 0 || sosNumss == "") {
              if (res.data.warning) {
                if (res.data.warning.id != that.$store.state.warningInfo.id) {
                  clearInterval(that.audioTimer);
                  that.audioTimer = null;
                  that.$refs.audio.pause();
                  that.$store.commit("setWarningInfo", res.data.warning);
                  if (res.data.warning.vtime > 0) {
                    that.$refs.audio.src =
                      "../../../static/video/" +
                      res.data.warning.voice +
                      ".mp3";
                    that.$refs.audio.currentTime = 0; //从头开始播放
                    that.$refs.audio.play(); //播放
                    setTimeout(() => {
                      that.$refs.audio.pause();
                    }, res.data.warning.vtime * 1000);

                    if (res.data.warning.vcycle > 0) {
                      that.audioTimer = setInterval(() => {
                        that.$refs.audio.play(); //播放
                        setTimeout(() => {
                          that.$refs.audio.pause();
                        }, res.data.warning.vtime * 1000);
                      }, res.data.warning.vcycle * 1000);
                    }
                  } else {
                    clearInterval(that.audioTimer);
                    that.audioTimer = null;
                    that.$refs.audio.pause();
                  }
                }
              } else {
                clearInterval(that.audioTimer);
                that.audioTimer = null;
                that.$refs.audio.pause();
              }
            } else {
              clearInterval(that.audioTimer);
              that.audioTimer = null;
              that.$refs.audio.pause();
            }
          }
        });
      }
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
              // 说明：清空用户信息与动态路由
              that.$store.commit("setuserInfo", "");
              if (typeof that.$router.resetRouter === 'function') {
                that.$router.resetRouter()
              }
              that.$store.state.projectid = "";
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
      this.$router.push("/user/usercenter");
    },
    //设置logo
    goSetLogo() {
      this.fileListAdd = [];
      this.setLogo = true;
    },
    goscreen() {
      this.$router.push("/largescreen");
      this.$store.state.showWarningDialog
        ? this.$store.commit("setlargeScreen", true)
        : this.$store.commit("setlargeScreen", false);
      // if (this.$store.state.showWarningDialog == true) {
      //   this.$store.commit("setlargeScreen", true);
      // } else {
      //   this.$store.commit("setlargeScreen", false);
      // }
      this.$store.commit("changeWarningDialog", false);
      this.$store.commit("setscreen", false);
    },
    //用户选择项目
    selectProject() {
      this.getProjectLists();
      this.i8n = this.$store.state.i18n;
      this.selectProjects = true;
    },
    //发送通知
    sendMessage() {
      this.getCustomerNames();
      this.showSendMessage = true;
    },

    //用户获取项目列表
    getProjectLists() {
      let data = {
        tenantid: this.$store.state.userInfo.tenantid,
      };
      getProjectFirstList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.username
      ).then((res) => {
        if (res.code == 1001) {
          this.projectTable = res.data;
          this.$store.commit("changeProjectTable", this.projectTable);
        }
      });
    },

    choseProject(row) {
      var that = this;
      that.attenFlag = row.projectConfig.attenFlag;
      that.alarmConfig = row.projectConfig.alarmConfig;
      that.tboxConfig = row.projectConfig.tboxConfig;
      that.employee = row.projectConfig.employee;
      that.asset = row.projectConfig.asset;
      that.tbox = row.projectConfig.tbox;
      that.attendance = row.projectConfig.attendance;
      that.task = row.projectConfig.task;
      that.inDoor = row.projectConfig.inDoor;
      that.outDoor = row.projectConfig.outDoor;
      that.camera = row.projectConfig.camera;

      let data = {
        attenFlag: row.projectConfig.attenFlag,
        alarmConfig: row.projectConfig.alarmConfig,
        tboxConfig: row.projectConfig.tboxConfig,
        employee: row.projectConfig.employee,
        asset: row.projectConfig.asset,
        tbox: row.projectConfig.tbox,
        attendance: row.projectConfig.attendance,
        task: row.projectConfig.task,
        inDoor: row.projectConfig.inDoor,
        outDoor: row.projectConfig.outDoor,
        assetgw: row.projectConfig.assetgw,
        aoagw: row.projectConfig.aoagw,
        smoke: row.projectConfig.smoke,
        alertor: row.projectConfig.alertor,
        blesensor: row.projectConfig.blesensor,
        camera: row.projectConfig.camera,
        devgw: row.projectConfig.devgw,
        scanbeacon: row.projectConfig.scanbeacon,
      };
      that.$store.commit("changefunctionParts", data);

      that.$store.commit("changeProjectid", row.projectid);
      that.$store.commit("selectProjectid", row.projectid);
      that.$store.commit("selectProjectFBXUrl", row.filename);
      that.$store.commit("selectProjectKey", row.setkey);
      that.$store.commit("selectProjectFlag", row.flag);
      that.$store.commit("selectProjectName", row.name);
      that.$store.commit("selectProjectTimezone", row.timezone);
      that.$store.commit("selectProjectSuperid", row.superid);
      that.$store.commit("selectProjectTenantid", row.tenantid);
      that.$store.commit("changeMapZoom", row.zoom);
      that.$store.commit("changeMapLongi", row.longi);
      that.$store.commit("changeMapLati", row.lati);
      that.$store.commit("selectProjectType", row.type);
      that.$store.commit("selectProjectprojectType", row.projectype);
      that.selectProjects = false;
      // 切换项目后，清除页面上上一个项目的所有告警
      let sosList = that.$store.state.sosList;

      if (sosList.length > 0) {
        for (let i in sosList) {
          sosList[i].value.close();
        }
      }
      that.getWarningLists();
      that.$router.push("/dashboard").catch((err) => {});
    },
    // 查看全部还是未读状态
    goMsg() {
      this.$router.push("/messageuser");
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
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    functionPartss() {
      return this.$store.state.functionParts;
    },
    projectid() {
      return this.$store.state.projectid;
    },
    sosNums() {
      return this.$store.state.sosNums;
    },
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      this.buttonText = this.$t("navbar.showNotification");

      Object.assign(
        this.$data.msgtable,
        this.$options.data.call(this).msgtable
      );
    },
    sosNums(val) {
      this.showWarnignButton = val;
    },
    //监听vuex中projectid的变化
    projectid(val, oldVal) {
      if (val != oldVal && this.$store.state.userInfo.prionum == 5) {
        this.getWarningLists();
      }
    },
    functionPartss(val) {
      this.attenFlag = val.attenFlag;
      this.alarmConfig = val.alarmConfig;
      this.tboxConfig = val.tboxConfig;
      this.employee = val.employee;
      this.asset = val.asset;
      this.tbox = val.tbox;
      this.attendance = val.attendance;
      this.task = val.task;
      this.inDoor = val.inDoor;
      this.outDoor = val.outDoor;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .userinfo {
    margin-left: 20px;
    display: inline-block;
  }
  .accessory {
    position: absolute;
    right: 10px;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
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
  left: 14px;
  z-index: 10000;
}
.warningbox {
  position: absolute !important;
  top: -8px;
  right: 0px;
}
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
}
.perDropdown {
  margin-right: 0;
  width: 30px;
  cursor: pointer;
  height: 100%;
}
.perDropdown:hover .el-dropdown-link {
  background-color: rgb(248, 248, 248);
}
.perDropdown .el-dropdown-link {
  // padding-bottom: 22px;
}

.el-dropdown {
  width: 30px;
}
.perDropdown1 {
  margin-left: 2%;
}
.hover-effect {
  display: flex !important;
  align-items: center !important;
}
.perSpan {
  height: 100%;
  display: flex;
  align-items: center;
}
.perSpan1 {
  height: 100%;
  display: flex;
  align-items: center;
}
.perIcon {
  display: flex;
  align-items: center;
  width: 32px;
  height: 32px;
  position: relative;
}
.perIcon1 {
  display: flex;
  align-items: center;
  width: 30px;
  height: 30px;
  position: relative;
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

.warning_button {
  padding: 6px !important;
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
  mask: url("../../../assets/pick.svg");
  mask-size: contain;
}
.item-header .item-icon {
  margin: 0;
  margin-right: 10px;
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #fff;
  mask: url("../../../assets/firm.svg");
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
  text-align: left;
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
.itemMessage {
  width: 30px;
}
.icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-color: #4c4c4d;
  mask-repeat: no-repeat !important;
}
.icon.menu1 {
  mask: url("../../../assets/menu.svg");
  mask-size: contain;
}
.icon.bell {
  mask: url("../../../assets/bell.svg");
  mask-size: contain;
}
.icon.more {
  mask: url("../../../assets/more.svg");
  mask-size: contain;
}
.icon1 {
  width: 25px;
  height: 25px;
  display: inline-block;
  background-color: #4c4c4d;
  mask-repeat: no-repeat !important;
}
.icon1.outdoor {
  mask: url("../../../assets/outdoor.svg");
  mask-size: contain;
  background-color: #003f9c;
}
.icon1.indoor {
  mask: url("../../../assets/indoor.svg");
  mask-size: contain;
  background-color: #003f9c;
}
.icon1.sos {
  mask: url("../../../assets/sos.svg");
  mask-size: contain;
  background-color: #003f9c;
}
.icon1.active {
  mask: url("../../../assets/active.svg");
  mask-size: contain;
  background-color: #003f9c;
}

.icon1.patrol {
  mask: url("../../../assets/patrol.svg");
  mask-size: contain;
  background-color: #003f9c;
}
.icon1.home {
  mask: url("../../../assets/home.svg");
  mask-size: contain;
  background-color: #003f9c;
}

.images {
  cursor: pointer;
  margin-left: 10px;
  vertical-align: middle;
}
.golink {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;

  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
