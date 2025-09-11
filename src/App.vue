<template>
  <div id="app">
    <router-view />
    <el-dialog
      :title="$t('tet.tet19')"
      :visible.sync="editSos"
      class="edit"
      width="30%"
      style="text-align: center"
    >
      <el-form
        :model="closeSosValue"
        ref="closeSosValue"
        :rules="updateSos"
        label-width="100px"
        style="text-align: left"
        @submit.native.prevent
      >
        <el-form-item :label="$t('usermanagement.password')" prop="userkey">
          <el-input
            v-model="closeSosValue.userkey"
            type="password"
            :placeholder="$t('territorymanagement.Pleaseenter')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="">
        <el-button @click="editSos = false">{{
          $t("territorymanagement.cancle")
        }}</el-button>
        <el-button type="primary" @click="editSosTrue('closeSosValue')">{{
          $t("territorymanagement.sure")
        }}</el-button>
      </div>
    </el-dialog>
    <div v-show="showlargr">
      <div class="changeLanguage" v-if="showFooter">
        <p>{{ $t("login.user") }}{{ userName }}</p>
        <p class="moreInfo">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ $t("login.language")
              }}<i class="el-icon-arrow-up el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeLanguagezh()">{{
                $t("message.zh")
              }}</el-dropdown-item>
              <el-dropdown-item @click.native="changeLanguageen()">{{
                $t("message.en")
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span @click="showVer()" class="show_ver">V1.14</span>
          <el-tooltip
            v-if="contrForPrionum == 5"
            class="item"
            effect="dark"
            :content="$t('navbar.Selectitem')"
            placement="bottom"
            :value="showTooltip"
          >
            <span
              class="project_name"
              @click="selectProject()"
              style="position: relative"
              >{{ $store.state.intoProjectName }}
            </span>
          </el-tooltip>
          <span v-if="i8n == 'zh'" class="xcx_name" @click="showImage()">
            小程序</span
          >
        </p>
      </div>
    </div>

    <el-dialog :title="$t('versions.title')" :visible.sync="showVersion">
      <div class="version">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            <div
              class="version_text"
              v-for="(item, index) in activity.content"
              :key="index"
            >
              <h2 v-if="index == 0" style="font-size: 130%">{{ item }}</h2>
              <span v-if="index != 0">{{ item }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="showImages">
      <img src="./assets/xcx.jpg" alt="" srcset="" />
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
    <audio :src="audioSrc" controls="controls" loop hidden ref="audio"></audio>
  </div>
</template>

<script>
import host from "./host";
import i18n from "./i18n/i18n";
// import { WS_BASE } from "./config/index.js"; // 使用 host.ws 保持原有逻辑
import {
  updateSosWarn,
  getWarningNum,
  sendDownLinkMsg,
  getProjectFirstList,
  getWarningPopoutList,
} from "./axios/api";
export default {
  name: "App",

  data() {
    return {
      showTooltip: false,
      selectProjects: false,
      projectTable: [],
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

      showImages: false,
      i8n: this.$store.state.i18n,
      closeSosList: [],
      warningAudioList: [],
      reverse: true,
      showFooter: "",
      activities: [
        {
          content: [
            this.$t("versions.content1"),
            this.$t("versions.content2"),
            this.$t("versions.content3"),
            this.$t("versions.content4"),
            this.$t("versions.content5"),
            this.$t("versions.content6"),
            this.$t("versions.content7"),
            this.$t("versions.content8"),
          ],
          timestamp: this.$t("versions.timestamp1"),
        },
        {
          content: [
            this.$t("versions.content9"),
            this.$t("versions.content10"),
            this.$t("versions.content11"),
            this.$t("versions.content12"),
            this.$t("versions.content13"),
          ],
          timestamp: this.$t("versions.timestamp2"),
        },
        {
          content: [
            this.$t("versions.content14"),
            this.$t("versions.content15"),
            this.$t("versions.content16"),
            this.$t("versions.content17"),
          ],
          timestamp: this.$t("versions.timestamp3"),
        },
        {
          content: [
            this.$t("versions.content18"),
            this.$t("versions.content19"),
            this.$t("versions.content20"),
          ],
          timestamp: this.$t("versions.timestamp4"),
        },
        {
          content: [
            this.$t("versions.content21"),
            this.$t("versions.content22"),
            this.$t("versions.content23"),
          ],
          timestamp: this.$t("versions.timestamp5"),
        },
        {
          content: [
            this.$t("versions.content24"),
            this.$t("versions.content25"),
            this.$t("versions.content26"),
            this.$t("versions.content27"),
            this.$t("versions.content28"),
          ],
          timestamp: this.$t("versions.timestamp6"),
        },
        {
          content: [
            this.$t("versions.content29"),
            this.$t("versions.content30"),
            this.$t("versions.content31"),
            this.$t("versions.content32"),
            this.$t("versions.content33"),
            this.$t("versions.content34"),
            this.$t("versions.content35"),
            this.$t("versions.content36"),
          ],
          timestamp: this.$t("versions.timestamp7"),
        },
        {
          content: [
            this.$t("versions.content37"),
            this.$t("versions.content38"),
            this.$t("versions.content39"),
            this.$t("versions.content40"),
            this.$t("versions.content41"),
            this.$t("versions.content42"),
            this.$t("versions.content43"),
          ],
          timestamp: this.$t("versions.timestamp8"),
        },

        {
          content: [
            this.$t("versions.content44"),
            this.$t("versions.content45"),
            this.$t("versions.content46"),
            this.$t("versions.content47"),
            this.$t("versions.content48"),
            this.$t("versions.content49"),
          ],
          timestamp: this.$t("versions.timestamp9"),
        },

        {
          content: [
            this.$t("versions.content50"),
            this.$t("versions.content51"),
            this.$t("versions.content52"),
            this.$t("versions.content53"),
            this.$t("versions.content54"),
            this.$t("versions.content55"),
            this.$t("versions.content56"),
          ],
          timestamp: this.$t("versions.timestamp10"),
        },
        {
          content: [
            this.$t("versions.content57"),
            this.$t("versions.content58"),
            this.$t("versions.content59"),
            this.$t("versions.content60"),
            this.$t("versions.content61"),
            this.$t("versions.content62"),
            this.$t("versions.content63"),
            this.$t("versions.content64"),
            this.$t("versions.content65"),
          ],
          timestamp: this.$t("versions.timestamp11"),
        },
        {
          content: [
            this.$t("versions.content66"),
            this.$t("versions.content67"),
            this.$t("versions.content68"),
            this.$t("versions.content69"),
            this.$t("versions.content70"),
          ],
          timestamp: this.$t("versions.timestamp12"),
        },
        {
          content: [
            this.$t("versions.content71"),
            this.$t("versions.content72"),
            this.$t("versions.content73"),
            this.$t("versions.content74"),
            this.$t("versions.content75"),
            this.$t("versions.content76"),
            this.$t("versions.content77"),
            this.$t("versions.content78"),
            this.$t("versions.content79"),
            this.i8n == "zh" ? this.$t("versions.content80") : "",
          ],
          timestamp: this.$t("versions.timestamp13"),
        },
        {
          content: [
            this.$t("versions.content81"),
            this.$t("versions.content82"),
            this.$t("versions.content83"),
            this.$t("versions.content84"),
            this.i8n == "zh" ? this.$t("versions.content85") : "",
          ],
          timestamp: this.$t("versions.timestamp14"),
        },
        {
          content: [
            this.$t("versions.content86"),
            this.$t("versions.content90"),
            this.$t("versions.content87"),
            this.$t("versions.content88"),
            this.i8n == "zh" ? this.$t("versions.content89") : "",
          ],
          timestamp: this.$t("versions.timestamp15"),
        },
      ],
      showVersion: false,
      showlargr: true,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: "",
      tenantkey_A: "",
      userName: this.$store.state.userInfo.username,
      intoProjectid: "",
      superid: "",
      closeProjectid: "",
      timer: null,
      times: 0,

      sosAlarms: [],
      sosList: [],
      clearS: [],
      closeSosIcon: "",
      closeSosValue: {
        type: "SOS",
        userkey: "",
        username: "",
        deveui: "",
        superid: "",
        projectid: "",
      },
      falseSos: "",
      editSos: false,
      updateSos: {
        username: [
          {
            required: true,
            message: this.$t("login.enterUsers"),
            trigger: "blur",
          },
        ],
        userkey: [
          {
            required: true,
            message: this.$t("login.enterPasswords"),
            trigger: "blur",
          },
        ],
      },

      audioSrc: "",
      audioTimer: null,
    };
  },
  computed: {
    // 说明：底部栏仅在“已登录且不在登录页”时显示，避免未登录时露出用户/语言/版本/小程序
    shouldShowFooter () {
      const s = this.$store && this.$store.state
      const info = s && s.userInfo
      // 放宽条件：登录后 userInfo 可能尚未写入 tenantid，但已有 username/superid
      const hasUser = !!(info && (info.tenantid || info.username || info.superid))
      const notLoginRoute = this.$route && this.$route.path !== '/login'
      return hasUser && notLoginRoute
    }
  },
  computed: {
    projectNums() {
      return this.$store.state.projectNum;
    },
    timess() {
      return this.times;
    },
    projectid() {
      return this.$store.state.intoProjectid;
    },
    changeProjectid() {
      return this.$store.state.projectid;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    showWarningDialog() {
      return this.$store.state.showWarningDialog;
    },
  },
  watch: {
    projectNums(val, oldVal) {
      if (val > 1) {
        this.showTooltip = true;
      } else {
        this.showTooltip = false;
      }
    },
    timess(val, oldVal) {
      var that = this;
      if (oldVal == 4) {
        // 登录页或未登录时不进行任何告警/连接处理
        const hasUser = this.$store && this.$store.state && this.$store.state.userInfo && this.$store.state.userInfo.tenantid;
        if (!hasUser || (this.$route && this.$route.path === '/login')) {
          return;
        }
        this.ws.close();
        this.localSocket(this.$store.state.intoProjectid);
        clearInterval(that.timer);
        that.timer = null;
        that.times = 0;

        if (that.sosList.length > 0) {
          for (let i = 0; i < that.sosList.length; i++) {
            that.sosList[i].value.close();
            that.sosList[i].value = "";
          }
        }

        this.sosList = [];
        this.sosAlarms = [];
        this.closeProjectid = that.$store.state.intoProjectid;
        that.getWarnSoss(
          that.$store.state.userInfo.tenantid,
          that.$store.state.userInfo.tenantkey,
          that.$store.state.userInfo.username,
          that.$store.state.userInfo.superid,
          that.$store.state.intoProjectid
        );
      }
    },
    $route(to, from) {
      to.path == "/largescreen"
        ? (this.showlargr = false)
        : (this.showlargr = true);
      // if (to.path === "/location/indoor/locationindoor") {
      //   let notification = document.getElementsByClassName("el-notification");
      //   if (notification.length > 0) {
      //     for (let index = 0; index < notification.length; index++) {
      //       notification[index].style.right = 100 + "px";
      //     }
      //   }
      // } else {
      let notification = document.getElementsByClassName("el-notification");
      if (notification.length > 0) {
        for (let index = 0; index < notification.length; index++) {
          notification[index].style.right = 10 + "px";
        }
      }
      // }
    },
    changeProjectid(val, oldVal) {
      let that = this;
      if (that.sosList.length > 0) {
        for (let i = 0; i < that.sosList.length; i++) {
          var box = document.getElementsByClassName(that.sosList[i].name);
          for (let j = 0; j < box.length; j++) {
            box[j].remove();
          }
        }
      }
      this.$notify.closeAll();
      this.sosList = [];
      this.sosAlarms = [];
      this.closeProjectid = val;
      if (
        val != oldVal &&
        this.$store && this.$store.state && this.$store.state.userInfo && this.$store.state.userInfo.tenantid &&
        this.$store.state.userInfo.prionum == 5 &&
        this.$route && this.$route.path !== '/login'
      ) {
        this.getWarnSoss(
          this.$store.state.userInfo.tenantid,
          this.$store.state.userInfo.tenantkey,
          this.$store.state.userInfo.username,
          this.$store.state.userInfo.superid,
          this.$store.state.intoProjectid
        );
        if (val) {
          this.saveState();
        }
      }

      if (val == "") {
        sessionStorage.clear();
      }
    },
    userInfo(val, oldVal) {
      if (val == "") {
        sessionStorage.clear();
        this.showFooter = false;
      } else if (val != oldVal && val) {
        this.showFooter = true;
        this.saveState();
      }
      this.contrForPrionum = val.prionum;
      this.tenantid_A = val.tenantid;
      this.tenantkey_A = val.tenantkey;
      this.userName = val.username;
      this.superid = val.superid;
      this.$store.commit("changeuserInfoCopy", val);
    },
    projectid(val, oldVal) {
      var that = this;
      this.intoProjectid = val;
      if (this.ws) {
        this.ws.close();
      }
      if (val != oldVal && this.$store.state.userInfo.prionum == 5) {
        if (this.$store.state.sosNum) {
          this.ws.close();
        }
        console.log("重新建立websocket");
        if (that.timer) {
          clearInterval(that.timer);
          that.timer = null;
          that.times = 0;
        }
        this.$refs.audio.pause();
        clearInterval(this.audioTimer);
        this.audioTimer = null;
        this.localSocket(val);
      }
      if (val) {
        this.saveState();
      }
      if (val == "") {
        sessionStorage.clear();
      }
    },
    showWarningDialog(val, oldVal) {
      var notifications = document.getElementsByClassName("el-notification");
      var arrs = Object.values(notifications);
      if (val == false) {
        arrs.forEach((item) => {
          item.style.opacity = "0";
          item.style.zIndex = "0";
        });
      } else {
        arrs.forEach((item) => {
          item.style.opacity = "1";
          item.style.zIndex = "100";
        });
      }
    },
    "$i18n.locale"() {
      var that = this;
      if (that.sosList.length > 0) {
        for (let i = 0; i < that.sosList.length; i++) {
          var box = document.getElementsByClassName(that.sosList[i].name);
          for (let j = 0; j < box.length; j++) {
            box[j].remove();
          }
        }
      }
      for (let i = 0; i < that.sosList.length; i++) {
        that.sosList[i].value.close();
        that.sosList[i].value = "";
      }

      this.i8n = this.$store.state.i18n;
      this.closeSosList.forEach((item) => {
        item.close();
      });
      if (
        this.$route.path !== "/login" &&
        this.$store && this.$store.state && this.$store.state.userInfo && this.$store.state.userInfo.tenantid &&
        this.$store.state.userInfo.prionum == 5
      ) {
        this.sosAlarms = [];
        this.sosList = [];
        this.getWarnSoss(
          this.$store.state.userInfo.tenantid,
          this.$store.state.userInfo.tenantkey,
          this.$store.state.userInfo.username,
          this.$store.state.userInfo.superid,
          this.$store.state.intoProjectid
        );
      }
      Object.assign(
        this.$data.activities,
        this.$options.data.call(this).activities
      );
    },
  },

  mounted() {
    // this.$nextTick(() => {
    //   this.show = this.router.path === "/largescreen"
    // })
    if (
      this.$route.path === "/largescreen" &&
      this.$store.state.userInfo.prionum == 5
    ) {
      this.showlargr = false;
    } else {
      this.showlargr = true;
    }
    // 说明：仅在非登录页且已登录（存在 userInfo.tenantid）时才拉取告警并建立 websocket
    if (
      this.$route.path !== "/login" &&
      this.$store && this.$store.state && this.$store.state.userInfo && this.$store.state.userInfo.tenantid &&
      this.$store.state.userInfo.prionum == 5
    ) {
      this.getWarnSoss(
        this.$store.state.userInfo.tenantid,
        this.$store.state.userInfo.tenantkey,
        this.$store.state.userInfo.username,
        this.$store.state.userInfo.superid,
        this.$store.state.intoProjectid
      );
      if (this.$store.state.userInfo.prionum == 5) {
        this.localSocket(this.$store.state.intoProjectid);
      }
    }
    if (this.$route.path !== "/login" && this.$store && this.$store.state && this.$store.state.userInfo && (this.$store.state.userInfo.tenantid || this.$store.state.userInfo.username || this.$store.state.userInfo.superid)) {
      this.showFooter = true;
    }
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
    document.title = i18n.t("title.title");
    window.GoMap = this.GoMap;
    window.hideNotify = this.hideNotify;
    window.showNotify = this.showNotify;
  },
  methods: {
    // 选择项目
    selectProject() {
      var that = this;
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
          that.projectTable = res.data;
          that.$store.commit("changeProjectTable", this.projectTable);
          if (that.projectTable.length > 1) {
            that.i8n = that.$store.state.i18n;
            that.selectProjects = true;
          }
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
    // 小程序
    showImage() {
      this.showImages = true;
    },
    // 版本号
    showVer() {
      this.showVersion = true;
    },
    changeLanguagezh() {
      const lang = (this.$i18n.locale = "zh");
      this.$i18n.locale = lang;
      this.$store.state.i18n = lang;
      document.title = i18n.t("title.title");
    },
    changeLanguageen() {
      const lang = (this.$i18n.locale = "en");
      this.$i18n.locale = lang;
      this.$store.state.i18n = lang;
      document.title = i18n.t("title.title");
    },
    beforeunloadHandler(e) {
      this.saveState();
      // console.log("关闭窗口之后");
      // var storage = window.localStorage;
      // storage.clear();
      // this.$store.state.addRoutes = [];
      // this.$store.commit("resetRoutes");
    },

    //保存vuex里面的state到session storage中
    saveState() {
      sessionStorage.clear();
      this.$store.state.addRoutes = [];
      sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    },
    //获取SOS信息
    getWarnSoss(tenantid, tenantkey, username, superid, intoProjectid) {
      // 说明：防呆校验——仅在已登录且当前路由不为登录页时才请求告警弹窗接口
      // 避免项目刚启动停留在登录页时触发 getWarningPopoutList
      const hasUser = this.$store && this.$store.state && this.$store.state.userInfo && this.$store.state.userInfo.tenantid;
      if (this.$route && this.$route.path === "/login") return;
      if (!hasUser) return;
      if (tenantid && tenantkey && username) {
        this.tenantid_A = tenantid;
        this.tenantkey_A = tenantkey;
        this.userName = username;
        this.superid = superid;
      }
      if (intoProjectid) {
        this.intoProjectid = intoProjectid;
      }
      var that = this;
      let data = {
        superid: superid,
        projectid: intoProjectid,
        status: 1,
        endtype: 8,
      };
      getWarningPopoutList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.closeSosList = [];
          that.warningAudioList = [];
          that.sosList = [];
          that.sosAlarms = [];
          res.data = res.data.filter(function (item) {
            return item.type == 1  || item.push == true;
          });
          if (res.data.length > 0) {
            that.$store.commit("changesosNums", res.data.length);
          } else {
            that.$store.commit("changesosNums", 0);
            return;
          }
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].deveuiIcon = res.data[i].deveui + res.data[i].type;
            setTimeout(function () {
              that.goSos(res.data[i], intoProjectid);
            }, 5);
          }
          res.data.sort(that.compare("type"));
          res.data.forEach((item) => {
            if (item.vtime > 0) {
              that.warningAudioList.push(item);
            }
          });
          if (that.warningAudioList.length > 0) {
            that.audios(that.warningAudioList[0]);
          }
        }
      });
    },
    // 告警排序
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    goSos(sosA, intoProjectid) {
      if (sosA.deveui != "") {
        let flag = true;
        for (let i in this.sosAlarms) {
          if (this.sosAlarms[i].deveuiIcon == sosA.deveuiIcon) {
            flag = false;
          }
        }
        if (flag) {
          this.sosAlarms.push(sosA);
          this.openSos(sosA, intoProjectid);
        }
      }
    },
    localSocket(val) {
      // 说明：仅在非登录页且已登录并且有有效的项目ID时才建立 WebSocket
      if (this.$route && this.$route.path === '/login') {
        if (this.ws) {
          try { this.ws.close(); } catch (e) { /* 忽略关闭异常 */ }
        }
        if (this.$store && this.$store.commit) {
          this.$store.commit('changesosNum', false)
        }
        return;
      }
      const hasUser = this.$store && this.$store.state && this.$store.state.userInfo && this.$store.state.userInfo.tenantid;
      if (!hasUser || !val) {
        return;
      }
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        this.times = 0;
      }
      let that = this;
      if (typeof WebSocket === "undefined") {
        that.$message({
          message: "您的浏览器不支持WebSocket！",
          type: "warning",
        });
        return;
      } else {
        that.ws = new WebSocket(host.ws + "map/alarm_" + val);
        that.websocket.setWs(that.ws);
        that.ws.onopen = function () {
          // console.log("SOS连接成功");
          that.$store.commit("changesosNum", true);
          that.timer = setInterval(function () {
            that.times += 1;
          }, 40000);
        };
        that.ws.onclose = function (e) {
          // console.log("SOS连接关闭");
          that.$store.commit("changesosNum", false);
        };
        that.ws.onmessage = function (res) {
          if (res.data == "The connection is normal.") {
            if (that.timer) {
              clearInterval(that.timer);
              that.timer = null;
              that.times = 0;
            }
            that.timer = setInterval(function () {
              that.times += 1;
            }, 10000);
            return;
          }
          var data = JSON.parse(res.data);
          that.$store.commit("setWarningNum", data.size);
          let state = JSON.parse(sessionStorage.getItem("state"));
          for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].deveui && state.userInfo.prionum == 5) {
              if (data.list[i].status == 1) {
                // 如果推送过来sos，重新调接口排序显示
                if (data.list[i].type == 1) {
                  if (that.sosList.length > 0) {
                    for (let i = 0; i < that.sosList.length; i++) {
                      var box = document.getElementsByClassName(
                        that.sosList[i].name
                      );
                      for (let j = 0; j < box.length; j++) {
                        box[j].remove();
                      }
                    }
                  }
                  that.$notify.closeAll();
                  if (that.sosList.length > 0) {
                    for (let i = 0; i < that.sosList.length; i++) {
                      that.sosList[i].value.close();
                      that.sosList[i].value = "";
                    }
                  }
                  that.getWarnSoss(
                    that.$store.state.userInfo.tenantid,
                    that.$store.state.userInfo.tenantkey,
                    that.$store.state.userInfo.username,
                    that.$store.state.userInfo.superid,
                    that.$store.state.intoProjectid
                  );
                  return;
                } else {
                  data.list[i].deveuiIcon =
                    data.list[i].deveui + data.list[i].type;
                  that.openSos(data.list[i], that.intoProjectid);
                  // 如果新的告警设定的vtime告警时长大于0才会停止之前的告警声音
                  if (data.list[i].vtime > 0) {
                    clearInterval(that.audioTimer);
                    that.audioTimer = null;
                    that.$refs.audio.pause();
                    that.warningAudioList.push(data.list[i]);
                    that.audios(
                      that.warningAudioList[that.warningAudioList.length - 1]
                    );
                  }
                }
              } else if (data.list[i].status == 2) {
                for (let j = 0; j < that.sosList.length; j++) {
                  if (
                    that.sosList[j].name ==
                    data.list[i].deveui + data.list[i].type
                  ) {
                    that.sosList[j].value.close();
                    that.clearSos(data.list[i].deveui + data.list[i].type);
                    var boxEls = document.getElementsByClassName(
                      data.list[i].deveui + data.list[i].type
                    );
                    for (let j = 0; j < boxEls.length; j++) {
                      boxEls[j].remove();
                    }
                  }
                }
              }
            }
          }
        };
      }
    },
    // 音频播放
    audios(item) {
      var that = this;
      clearInterval(this.audioTimer);
      this.audioTimer = null;
      this.$refs.audio.pause();
      if (item == undefined) return;
      if (item.vtime == 0) {
        return;
      } else if (item.vtime == 30 && item.vcycle == 30) {
        that.$refs.audio.src = "../../../static/video/" + item.voice + ".mp3";
        that.$refs.audio.currentTime = 0; //从头开始播放
        that.$refs.audio.play(); //播放
      } else {
        if (item.vtime > 0) {
          that.$refs.audio.src = "../../../static/video/" + item.voice + ".mp3";
          that.$refs.audio.currentTime = 0; //从头开始播放
          that.$refs.audio.play(); //播放
          setTimeout(() => {
            that.$refs.audio.pause();
          }, item.vtime * 1000);
          if (item.vcycle > 0) {
            that.audioTimer = setInterval(() => {
              that.$refs.audio.play(); //播放
              if (item.vtime > 0) {
                setTimeout(() => {
                  that.$refs.audio.pause();
                }, item.vtime * 1000);
              }
            }, item.vcycle * 1000);
          }
        } else {
          clearInterval(that.audioTimer);
          that.audioTimer = null;
          that.$refs.audio.pause();
        }
      }
    },
    //显示SOS告警提示
    openSos(sosA, intoProjectid) {
      var that = this;
      that.$store.commit("setWarningInfo", {});
      that.$store.commit("changesosNums", 1);
      sosA.time = this.timeFormat(sosA.time);
      let keySos = sosA.deveui;
      let warningTitle;
      let warningContent;
      let sosAs = JSON.stringify(sosA);
      let sosAss = this.htmlspecialchars(sosAs);
      switch (sosA.type) {
        case 1:
          warningTitle = this.$t("warning.SOSalarm");
          warningContent = this.$t("terminal.deveui");
          break;
        case 2:
          warningTitle = this.$t("warning.Aggregatealarm");
          warningContent = this.$t("warning.area1");
          break;
        case 3:
          warningTitle = this.$t("warning.Passingalarm");
          warningContent = this.$t("terminal.deveui");
          break;
        case 4:
          warningTitle = this.$t("warning.Detentionalarm");
          warningContent = this.$t("terminal.deveui");
          break;
        case 5:
          warningTitle = this.$t("warning.Abnormalstatic");
          warningContent = this.$t("terminal.deveui");
          break;
        case 6:
          warningTitle = this.$t("warning.Tilt");
          warningContent = this.$t("terminal.deveui");
          break;
        case 7:
          warningTitle = this.$t("warning.Dumpalarm");
          warningContent = this.$t("terminal.deveui");
          break;
        case 8:
          warningTitle = this.$t("warning.Firealarm");
          warningContent = this.$t("terminal.deveui");
          break;
        default:
          break;
      }

      keySos = this.$notify({
        // title: "SOS告警",
        customClass: sosA.deveuiIcon,
        // + 40,
        duration: 0,
        showClose: false,
        dangerouslyUseHTMLString: true,
        offset: 44,
        message:
          `<div class="${sosA.deveuiIcon}box box"><div class= "sosheader ${
            sosA.deveuiIcon
          }10"><i class="sosIcon"></i>${warningTitle} <i onclick="hideNotify('${
            sosA.deveuiIcon
          }')" class="el-icon-remove-outline ${
            sosA.deveuiIcon
          }boxicon sosicon2"></i></div>
           <div class= "soscontent">
           <p>${this.$t("warning.name")}${sosA.username}
          </p><p>${this.$t("warning.time")}
          ${sosA.time}
          </p><p>${warningContent}
           ${sosA.deveui}
          </p></div><br/>
          <div class="sosfooter">
          <button ${
            sosA.type == 1 ? "" : 'class="hidefooter"'
          } style="font-size: 12px;"   class="${sosA.deveuiIcon}30 el-button"
          >${this.$t("warning.search")}</button>
          <button ${
            sosA.type == 1 ? "" : 'class="hidefooter"'
          } style="font-size: 12px;" class="${sosA.deveuiIcon}20 el-button"
          >${this.$t("myorder.close")}</button><button onclick="GoMap('${
            sosA.deveui
          }','${sosA.postype}','${sosA.devtype}',` +
          sosAss +
          `)" style="font-size: 12px;" class= "el-button el-button--primary
          ${sosA.deveui}"
          >${this.$t("tet.Jumpmap")}</button></div></div>
          <div class= "  mini ${
            sosA.deveuiIcon
          }minibox" style ="display:none"><div class="sosheader  ${
            sosA.deveuiIcon
          }10"><i class="sosIcon"></i>${warningTitle}<i onclick="showNotify('${
            sosA.deveuiIcon
          }')" class="el-icon-circle-plus-outline ${
            sosA.deveuiIcon
          }miniicon sosicon2"></i></div></div>
          `,
      });
      let arrStr = { value: keySos, name: sosA.deveuiIcon };
      this.sosList.push(arrStr);

      let btnClose = document.getElementsByClassName(sosA.deveuiIcon + "20");
      that.closeSosList.push(keySos);
      if (btnClose.length > 0) {
        btnClose[0].addEventListener("click", function () {
          that.closeSosIcon = sosA.deveuiIcon;
          that.closeSosValue.deveui = "";
          that.closeSosValue.userkey = "";
          that.closeSosValue.username = that.userName;
          that.closeSosValue.superid = that.superid;
          // that.closeSosValue.projectid = that.closeProjectid;
          that.closeSosValue.projectid = that.$store.state.intoProjectid;
          that.closeSos(keySos, sosA.deveui);
        });
      }

      //发送远程搜索按钮
      let btnLongRange = document.getElementsByClassName(
        sosA.deveuiIcon + "30"
      );
      if (btnLongRange.length > 0) {
        btnLongRange[0].addEventListener("click", function () {
          that.sendLongRange(sosA.deveui);
        });
      }

      let notification = document.getElementsByClassName("el-notification");
      for (let index = 0; index < notification.length; index++) {
        notification[index].style.right = 10 + "px";
      }
      // }
      var notifications = document.getElementsByClassName("el-notification");
      var arrs = Object.values(notifications);
      if (this.$store.state.showWarningDialog == false) {
        arrs.forEach((item) => {
          item.style.opacity = "0";
          item.style.zIndex = "-1";
        });
      } else {
        arrs.forEach((item) => {
          item.style.opacity = "1";
          item.style.zIndex = "100";
        });
      }
    },
    hideNotify(deveuiIcon) {
      var that = this;
      let box = document.getElementsByClassName(deveuiIcon + "box");
      let minibox = document.getElementsByClassName(deveuiIcon + "minibox");
      let arr = document.getElementsByClassName("el-notification");
      box[0].style.display = "none";
      minibox[0].style.display = "block";
      that.$nextTick(() => {
        that.setTop(arr);
      });
    },
    showNotify(deveuiIcon) {
      var that = this;
      let box = document.getElementsByClassName(deveuiIcon + "box");
      let minibox = document.getElementsByClassName(deveuiIcon + "minibox");
      let arr = document.getElementsByClassName("el-notification");
      box[0].style.display = "block";
      minibox[0].style.display = "none";
      that.$nextTick(() => {
        that.setTop(arr);
      });
    },
    //重新计算sos框位置
    setTop(domArr) {
      let top = [60];
      for (let i = 0; i < domArr.length; i++) {
        if (i > 0) {
          top.push(domArr[i - 1].scrollHeight + top[i - 1] + 18);
          domArr[i].style.top = top[i] + "px";
        } else {
          domArr[i].style.top = top[0] + "px";
        }
      }
    },
    // 字符串双引号变成单引号
    htmlspecialchars(str) {
      str = str.replace(/&/g, "&amp;");
      str = str.replace(/</g, "&lt;");
      str = str.replace(/>/g, "&gt;");
      str = str.replace(/"/g, "&quot;");
      str = str.replace(/'/g, "&#039;");
      return str;
    },
    //点击弹出的信息框跳转到相应的定位页面
    GoMap(deveui, postype, devtype, info) {
      var that = this;
      that.$store.commit("changesosData", info);
      if (postype == 1) {
        if (devtype == 4) {
          //车辆告警
          that.$router.push({
            path: "/location/indoor/locationindoor",
            query: {
              tboxDeveui: deveui,
              sostype: true,
              warning: true,
            },
          });
        } else if (devtype == 3) {
          //资产告警
          that.$router.push({
            path: "/location/indoor/locationindoor",
            query: {
              assetDeveui: deveui,
              sostype: true,
              warning: true,
            },
          });
        } else {
          //人告警
          that.$router.push({
            path: "/location/indoor/locationindoor",
            query: {
              deveui: deveui,
              sostype: true,
              warning: true,
            },
          });
        }
      } else if (postype == 2) {
        if (devtype == 4) {
          //车辆告警
          that.$router.push({
            path: "/location/outdoor/locationoutdoor",
            query: {
              tboxDeveui: deveui,
              sostype: true,
              warning: true,
            },
          });
        } else {
          //人告警
          that.$router.push({
            path: "/location/outdoor/locationoutdoor",
            query: {
              deveui: deveui,
              sostype: true,
              warning: true,
            },
          });
        }
      } else {
        //聚集告警
        that.$router.push({
          path: "/location/indoor/locationindoor",
          query: {
            sostype: true,
            warning: true,
          },
        });
      }
    },

    // 发送远程搜索命令
    sendLongRange(deveui) {
      var that = this;
      let data = {
        euilist: deveui,
        command: 3,
      };
      sendDownLinkMsg(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("tips.sendOut"),
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
    // 打开处理SOS的弹框
    closeSos(notify, deveui) {
      this.closeSosValue.deveui = deveui;
      this.falseSos = notify;
      this.editSos = true;
    },
    editSosTrue(closeSosValue) {
      var that = this;
      this.$refs[closeSosValue].validate((valid) => {
        if (valid) {
          updateSosWarn(
            this.closeSosValue,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.editSos = false;
              that.$message({
                message: that.$t("tet.tet20"),
                type: "success",
              });
              that.falseSos.close();
              that.clearSos(that.closeSosIcon);
              that.closeSosValue.deveui = "";
              that.falseSos = "";
              that.getWarningLists();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error ",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //清除已处理过的SOS告警
    clearSos(deveuiIcon) {
      var that = this;
      for (let i in this.sosAlarms) {
        if (this.sosAlarms[i].deveuiIcon == deveuiIcon) {
          this.clearS.push(this.sosAlarms[i]);
          this.sosAlarms.splice(i, 1);
        }
      }
      for (let i in this.sosList) {
        if (this.sosList[i].name == deveuiIcon) {
          this.sosList.splice(i, 1);
        }
      }
      for (let i = 0; i < that.warningAudioList.length; i++) {
        if (that.warningAudioList[i].deveuiIcon == deveuiIcon) {
          that.warningAudioList.splice(i, 1);
        }
      }
      clearInterval(that.audioTimer);
      that.audioTimer = null;
      that.$refs.audio.pause();
      if (that.warningAudioList.length > 0) {
        let backSosAudio = that.warningAudioList.findIndex(
          (item) => item.type == 1
        );
        if (backSosAudio != -1) {
          that.audios(that.warningAudioList[backSosAudio]);
        }
      }
      let data = {
        superid: that.superid,
        projectid: that.intoProjectid,
        status: 1,
        // type: 1,
        endtype: 8,
      };
      getWarningPopoutList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          res.data = res.data.filter(function (item) {
            return item.type == 1  || item.push == true;
          });
          if (res.data.length > 0) {
            that.$store.commit("changesosNums", res.data.length);
          } else {
            that.$store.commit("changesosNums", 0);
          }
        }
      });
    },

    getWarningLists() {
      let data;
      if (this.$store.state.userInfo.prionum == 5) {
        data = {
          superid: this.$store.state.userInfo.superid,
          projectid: this.$store.state.intoProjectid,
          status: 1,
          endtype: 8,
        };
      }
      var that = this;
      getWarningNum(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$store.commit("setWarningNum", res.data.size);
        }
      });
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
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) =>
      this.beforeunloadHandler(e)
    );
  },
};
</script>

<style>
.show_ver,
.xcx_name {
  cursor: pointer;
  margin-left: 10px;
  border-left: 2px solid pink;
  padding-left: 10px;
}

.project_name {
  margin-left: 10px;
  border-left: 2px solid pink;
  padding-left: 10px;
  cursor: pointer;
}

.version_text {
  text-align: left;
  word-wrap: break-word;
}

.el-timeline-item__timestamp {
  text-align: left !important;
}

* {
  margin: 0 auto;
  padding: 0;
  font-size: 14px;
}

.changeLanguage {
  position: fixed;
  display: flex;
  justify-content: space-between;
  background: white;
  width: 100%;
  bottom: 0;
  z-index: 9999;
  border-top: 1px solid pink;
  height: 30px;
  line-height: 30px;
}

.changeLanguage p:nth-of-type(1) {
  margin-left: 10px;
}

.changeLanguage p:nth-of-type(2) {
  margin-right: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-scrollbar__wrap {
  height: 100% !important;
  /* padding-bottom: 30px !important; */
}

.scrollbar__wrap::-webkit-scrollbar {
  display: none !important;
}

.el-tooltip__popper {
  font-size: 14px;
  max-width: 50%;
}

html,
body,
#app {
  height: 100%;
}

body {
  padding-right: 0 !important;
}

#app {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-align: center;
}

.user .el-table {
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%) !important;
  border-radius: 5px;
  color: #505d69;
}

.el-message {
  min-width: 100px !important;
}

.el-dialog__body {
  padding-bottom: 10px;
}

.padreduce .el-dialog__body {
  padding-bottom: 30px;
}

.el-image-viewer__wrapper .el-image-viewer__close .el-icon-circle-close {
  font-size: 26px !important;
  color: #fff;
}

.el-notification.right {
  padding: 0;
  /* right: 3% !important; */
}

.el-notification__group {
  width: 100%;
  margin: 0 !important;
}

.el-notification__content {
  margin: 0 !important;
}

.sosheader {
  background: rgb(255, 217, 91);
  color: rgb(27, 27, 27);
  font-weight: bold;
  height: 40px;
  display: flex;
  font-size: 18px;
  align-items: center;
}

.soscontent {
  margin: 14px;
  margin-left: 18px;
  margin-bottom: 0;
}

.sosfooter {
  display: flex;
  justify-content: end;
  text-align: right;
  margin-bottom: 10px;
  margin-right: 10px;
}

.sosfooter button {
  padding: 10px 13px !important;
}

.hidefooter {
  display: none;
}

.sosIcon {
  width: 22px;
  height: 22px;
  display: inline-block;
  background-color: rgb(27, 27, 27);
  mask: url("./assets/sos1.svg");
  mask-size: contain;
  margin: 0;
  margin-left: 10px;
  margin-right: 10px;
}

.sosicon2 {
  font-size: 22px;
  margin-right: 4%;
  cursor: pointer;
}

.el-dialog__body .el-form .el-form-item {
  padding-right: 30px !important;
}

.el-table__body tr.current-row > td {
  background-color: #bed7f0 !important;
}

.el-dropdown-menu.el-popper.el-dropdown-menu--mini {
  transform: translateX(-30px);
}

body .el-table th {
  display: table-cell !important;
}
</style>
<style lang="sss" scoped>
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
  mask: url("./assets/pick.svg");
  mask-size: contain;
}
.item-header .item-icon {
  margin: 0;
  margin-right: 10px;
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #fff;
  mask: url("./assets/firm.svg");
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
.version {
  text-align: left;
  height: 500px;
  overflow: auto;
}
</style>
