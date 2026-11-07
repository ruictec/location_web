<template>
  <div class="cotn_principal">
    <!-- 登录框 -->
    <div class="Login_Fream" :class="{ 'is-en': $store.state.i18n != 'zh' }">
      <div class="auth-head">
        <h1 class="welcome_text">{{ $t("login.vindo") }}</h1>
        <p class="auth-sub">{{ $t("login.introduce") }}</p>
      </div>
      <div class="auth-field">
        <div class="ipt_frame" :class="{ 'is-error': loginFormusername }">
          <div class="imgBox imgBox_user"></div>
          <input
            type="text"
            v-model="loginForm.username"
            @input="user"
            @keyup.enter="handleLogin"
            autocomplete="username"
            class="box_input"
            :placeholder="$t('login.enterUser')"
          />
        </div>
        <p class="auth-error">
          <template v-if="loginFormusername">{{ $t("login.enterUsers") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="ipt_frame" :class="{ 'is-error': loginFormpassword }">
          <div class="imgBox imgBox_psw"></div>
          <input
            :type="password"
            v-model="loginForm.password"
            @input="pswd"
            @keyup.enter="handleLogin"
            autocomplete="current-password"
            class="box_input"
            :placeholder="$t('login.enterPassword')"
          />
          <div class="eye eye1" @click="eye" v-if="open"></div>
          <div class="eye eye2" @click="eye" v-else></div>
        </div>
        <p class="auth-error">
          <template v-if="loginFormpassword">{{ $t("login.enterPasswords") }}</template>
        </p>
      </div>
      <div class="optionBox">
        <el-checkbox v-model="checked" class="remember-check"
          ><span class="rememberPassword">{{
            $t("login.rememberAccount")
          }}</span></el-checkbox>
        <div class="auth-links">
          <span class="register" @click="NewRegister">{{ $t("login.register") }}</span>
          <i class="auth-links-divider"></i>
          <span class="reset" @click="reset">{{ $t("login.forgetPassword") }}</span>
        </div>
      </div>
      <div class="onlogin" @click="handleLogin">{{ $t("login.login") }}</div>
    </div>
    <div class="auth-footer">
      <div class="copyright" @click="copyright">
        {{ $t("login.tet") }} {{ $t("login.tet1") }}
      </div>
      <div class="recommendation">{{ $t("login.recommendation") }}</div>
    </div>

    <!-- 浏览器兼容性提示：非 Chrome / Firefox / Safari 时弹出 -->
    <div v-if="browserTipVisible" class="browser-tip-mask">
      <div class="browser-tip">
        <h2 class="browser-tip-title">{{ $t("login.browserTipTitle") }}</h2>
        <p class="browser-tip-desc">{{ $t("login.browserTipDesc") }}</p>
        <div class="browser-tip-links">
          <a
            class="browser-link is-chrome"
            href="https://www.google.cn/chrome/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="browser-link-name">Chrome</span>
            <span class="browser-link-sub">{{ $t("login.browserTipDownload") }}</span>
          </a>
          <a
            class="browser-link is-firefox"
            href="https://www.firefox.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="browser-link-name">Firefox</span>
            <span class="browser-link-sub">{{ $t("login.browserTipDownload") }}</span>
          </a>
        </div>
        <p class="browser-tip-current">
          {{ $t("login.browserTipCurrent") }}{{ browserInfo.name }}
          {{ browserInfo.version }}
        </p>
        <button class="browser-tip-btn" type="button" @click="closeBrowserTip">
          {{ $t("login.browserTipOk") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import agreement from "./agreement";
import {
  registerUser,
  registerSendMail,
  registerUserPwd,
} from "../../axios/api";
import { persistTabSession, notifyAuthEvent } from "../../utils/authSession";
import { injectRoutesByRole } from "../../router/permission";
import { getBrowserInfo, formatBrowserInfo } from "../../utils/browserInfo";

const REMEMBER_USERNAME_KEY = "login_remember_username";
// 路由注入由permission.js处理，不再需要导入
export default {
  components: {
    agreement,
  },
  name: "Login",

  data() {
    //手机号码正则
    var isMobileNumber = (rule, value, callback) => {
      if (!value) {
        return new Error(this.$t("tips.telephone"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const isPhone = reg.test(value);
        value = Number(value); //转换为数字
        if (typeof value === "number" && !isNaN(value)) {
          //判断是否为数字
          value = value.toString(); //转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) {
            //判断是否为11位手机号
            callback(new Error(this.$t("tips.phone")));
          } else {
            callback();
          }
        } else {
          callback(new Error(this.$t("tips.telephone")));
        }
      }
    };

    //邮箱正则
    var isEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg =
          /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        const email = reg.test(value);
        if (!email) {
          callback(new Error(this.$t("tips.email")));
        } else {
          callback();
        }
        callback();
      }
    };
    var loginRules_username = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("login.enterUser")));
      }
    };
    var loginRules_password = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("login.enterPassword")));
      }
    };
    var registerRules_agree = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.agree")));
      }
      callback();
    };
    var registerRules_username = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.username")));
      } else {
        const reg = /^\w{5,16}$/;
        const username = reg.test(value);
        if (!username) {
          callback(new Error(this.$t("tips.usernames")));
        } else {
          callback();
        }
        callback();
      }
    };
    var registerRules_password = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.password")));
      } else {
        const reg = /^^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d~!@#$%^&*]{6,16}$/;
        const password = reg.test(value);
        if (!password) {
          callback(new Error(this.$t("tips.passwords")));
        } else {
          callback();
        }
        callback();
      }
    };
    var registerRules_confirmpassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.password")));
      } else if (value !== this.registerForm.password) {
        callback(new Error(this.$t("tips.secondPassword")));
      } else {
        callback();
      }
    };
    var registerRules_phone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.phone")));
      }
    };
    var registerRules_email = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.emails")));
      } else {
        const reg =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email = reg.test(value);
        if (!email) {
          callback(new Error(this.$t("tips.email")));
        } else {
          callback();
        }
        callback();
      }
    };
    var registerRules_tenantid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.tenantid")));
      }
      callback();
    };
    //两次密码是否一致
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.firstPassword")));
      } else if (value !== this.registerForm.password) {
        callback(new Error(this.$t("tips.secondPassword")));
      } else {
        callback();
      }
    };
    //两次密码是否一致
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.firstPassword")));
      } else if (value !== this.getPassData.inputNewpass) {
        callback(new Error(this.$t("tips.secondPassword")));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.firstPassword")));
      } else if (value !== this.getPassData.inputNewpass) {
        callback(new Error(this.$t("tips.secondPassword")));
      } else {
        callback();
      }
    };
    var gerRules_inputEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.emails")));
      } else {
        const reg =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email = reg.test(value);
        if (!email) {
          callback(new Error(this.$t("tips.email")));
        } else {
          callback();
        }
        callback();
      }
    };
    var gerRules_inputCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.inputCode")));
      } else {
        const reg = /^[0-9a-zA-Z]{6}$/;
        const code = reg.test(value);
        if (!code) {
          callback(new Error(this.$t("tips.inputCodes")));
        } else {
          callback();
        }
        callback();
      }
    };
    var gerRules_inputNewpass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.password")));
      } else {
        callback();
      }
    };
    var gerRules_inputOldpass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.password")));
      } else if (value !== this.getPassData.inputNewpass) {
        callback(new Error(this.$t("tips.secondPassword")));
      } else {
        callback();
      }
    };
    // /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
    return {
      //
      loginFormusername: false,
      loginFormpassword: false,
      //
      twopsw: false,
      open: false,
      password: "password",
      vedioCanPlay: false,
      fixStyle: "",
      dialogVisible: true,
      agreement: false,
      rePwd: false,
      checked: false,
      // 浏览器兼容性提示
      browserTipVisible: false,
      browserInfo: {},
      showremember: true,
      userInfo: {},
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            validator: loginRules_username,
            trigger: "blur",
          },
          // {
          //   min: 5,
          //   max: 16,
          //   message: "长度在 5 到 16 个字符",
          //   trigger: "blur",
          // },
        ],
        password: [
          {
            required: true,
            validator: loginRules_password,
            // message: this.$t("login.enterPassword"),
            trigger: "blur",
          },
        ],
      },
      registerForm: {
        username: "",
        password: "",
        confirmpassword: "",
        phone: "",
        email: "",
        tenantid: "",
        agree: "",
      },
      registerRules: {
        agree: [
          {
            required: true,
            validator: registerRules_agree,
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            validator: registerRules_username,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            validator: registerRules_password,
            trigger: "blur",
          },
        ],
        confirmpassword: [
          {
            required: true,
            validator: registerRules_confirmpassword,
            trigger: "blur",
          },
          { validator: validatePass1, trigger: "blur" },
        ],
        email: [
          {
            required: true,
            validator: registerRules_email,
            trigger: "blur",
          },
          { validator: isEmail, trigger: "blur" },
        ],
        tenantid: [
          {
            required: true,
            validator: registerRules_tenantid,
            trigger: "blur",
          },
        ],
      },
      lablePositon: "left",
      tenantid_A: "",
      tenantkey_A: "",

      //忘记密码
      disabled: false,
      time: 0,
      btntxt: this.$t("tips.btntxt"),
      getPassData: {
        inputEmail: "",
        inputCode: "",
        inputNewpass: "",
        inputOldpass: "",
      },
      gerRules: {
        inputEmail: [
          { required: true, validator: gerRules_inputEmail, trigger: "blur" },
          { validator: isEmail, trigger: "blur" },
        ],
        inputCode: [
          {
            required: true,
            validator: gerRules_inputCode,
            trigger: "blur",
          },
        ],
        inputNewpass: [
          { required: true, validator: gerRules_inputNewpass, trigger: "blur" },
        ],
        inputOldpass: [
          {
            required: true,
            validator: gerRules_inputOldpass,
            trigger: "blur",
          },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
      //当前触发了几个表单验证
      validateLength: "",
    };
  },

  methods: {
    // 背景视频
    canplay() {
      this.vedioCanPlay = true;
    },
    //忘记密码
    for_pas() {
      this.rePwd = true;
    },
    //获取验证码
    sendCode() {
      var that = this;
      const reg =
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      const email = reg.test(this.getPassData.inputEmail);
      if (!email) {
        this.$message({
          message: this.$t("tips.emailes"),
          type: "warning",
        });
        return;
      }
      if (this.getPassData.inputEmail == "") {
        this.$message({
          message: this.$t("tips.emails"),
          type: "warning",
        });
        return;
      }
      let data = {
        email: this.getPassData.inputEmail,
      };
      registerSendMail(data).then((res) => {
        if (res.code == 1001) {
          that.time = 60;
          that.disabled = true;
          that.timer();
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
    //60S倒计时
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + this.$t("tips.obtain");
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = this.$t("tips.obtains");
        this.disabled = false;
      }
    },
    closeCode(getPassData) {
      this.$refs[getPassData].resetFields();
    },
    cancelPass() {
      this.rePwd = false;
      this.getPassData = {
        inputEmail: "",
        inputCode: "",
        inputNewpass: "",
        inputOldpass: "",
      };
    },
    savePass(getPassData) {
      var that = this;
      this.$refs[getPassData].validate((valid) => {
        if (valid) {
          let data = {
            email: that.getPassData.inputEmail,
            password: that.getPassData.inputNewpass,
            code: that.getPassData.inputCode,
          };
          registerUserPwd(data).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("tips.reset"),
                type: "suceess",
              });
              that.rePwd = false;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        }
      });
    },

    //登录
    handleLogin() {
      var that = this;
      if (!this.loginForm.username) {
        this.loginFormusername = true;
      }
      if (!this.loginForm.password) {
        this.loginFormpassword = true;
      }
      if (this.loginForm.username && this.loginForm.password) {
        $(".cont_forms").attr("class", "cont_forms cont_forms_active_login");
        $(".cont_form_login").css({ display: "block", opacity: "0" });

        setTimeout(function () {
          $(".cont_form_login").css({ opacity: "1" });
        }, 400);

        this.$axios({
          method: "POST",
          url: "service/login",
          data: {
            username: this.loginForm.username.toString(),
            userkey: this.loginForm.password.toString(),
          },
          ContentType: "application/json;charset=UTF-8",
        })
          .then((data) => {
            if (data.data.code == 1001) {
              if (data.data.data.prionum == 5 && data.data.data.num == 0) {
                that.$message({
                  message: that.$t("tips.error"),
                  type: "warning",
                });
                return;
              }
              that.saveRememberedUsername();
              that.tenantid_A = data.data.data.tenantid;
              that.userInfo = data.data.data;
              that.$store.commit("setuserInfo", that.userInfo);
              persistTabSession(that.$store.state);
              notifyAuthEvent("login", {
                username: that.userInfo.username,
                prionum: that.userInfo.prionum,
              });
              try {
                injectRoutesByRole(that.userInfo.prionum);
              } catch (e) {}
              that.$router.push("/dashboard").catch(() => {});
              that.$store.commit("changeShow", true);
            } else {
              that.$message({
                message:
                  that.$store.state.i18n == "zh"
                    ? data.data.msg
                    : data.data.enMsg,
                type: "error",
              });
            }
          })
          .catch(() => {
            that.$message({
              message: that.$t("tips.errors"),
              type: "warning",
            });
          });
      }
    },

    // 记住账号：只保存用户名，密码交给浏览器密码管理器
    saveRememberedUsername() {
      try {
        if (this.checked) {
          localStorage.setItem(REMEMBER_USERNAME_KEY, this.loginForm.username);
        } else {
          localStorage.removeItem(REMEMBER_USERNAME_KEY);
        }
      } catch (e) {}
    },
    loadRememberedUsername() {
      try {
        const username = localStorage.getItem(REMEMBER_USERNAME_KEY);
        if (username) {
          this.loginForm.username = username;
          this.checked = true;
        }
      } catch (e) {}
    },
    // 旧版“记住密码”把明文密码存在 Cookie 中，这里统一清掉
    clearLegacyCookies() {
      ["username", "password", "checked"].forEach((name) => {
        document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      });
    },
    // 忘记密码
    reset() {
      this.twopsw = false;
      this.$router.push("/register?setresetnoon=false");
    },
    user() {
      if (this.loginForm.username == "") {
        this.loginFormusername = true;
      } else {
        this.loginFormusername = false;
      }
    },
    pswd() {
      if (this.loginForm.password == "") {
        this.loginFormpassword = true;
      } else {
        this.loginFormpassword = false;
      }
    },
    //注册
    register(formName) {
      if (this.registerForm.agree === false) {
        this.registerForm.agree = "";
      }
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = {
            username: that.registerForm.username.toString(),
            userkey: that.registerForm.password.toString(),
            usermail: that.registerForm.email.toString(),
            tenantid: that.registerForm.tenantid.toString(),
          };

          registerUser(para)
            .then(function (data) {
              if (data.code == 1001) {
                that.$message({
                  message: that.$t("tips.registerUser"),
                  type: "success",
                });

                $(".cont_forms").attr(
                  "class",
                  "cont_forms cont_forms_active_login"
                );
                $(".cont_form_login").css({ display: "block", opacity: "0" });

                setTimeout(function () {
                  $(".cont_form_login").css({ opacity: "1" });
                }, 400);

                setTimeout(function () {
                  $(".cont_form_sign_up").css({ display: "none" });
                }, 200);
              } else {
                that.$message({
                  message:
                    that.$store.state.i18n == "zh" ? data.msg : data.enMsg,
                  type: "error",
                });
              }
            })
            .catch(function (response) {
              that.$message({
                message: that.$t("tips.registerUsers"),
                type: "warning",
              });
            });
        }
      });
    },
    // 注册新账号
    NewRegister() {
      this.$router.push("/register?setresetnoon=true");
    },
    eye() {
      this.open = !this.open;
      if (this.open == true) this.password = "text";
      else this.password = "password";
    },
    //切换到登录板块
    cambiar_login() {
      $(".cont_forms").attr("class", "cont_forms cont_forms_active_login");
      $(".cont_form_login").css({ display: "block", opacity: "0" });

      setTimeout(function () {
        $(".cont_form_login").css({ opacity: "1" });
      }, 400);

      setTimeout(function () {
        $(".cont_form_sign_up").css({ display: "none" });
      }, 200);
    },

    //切换到注册板块
    cambiar_sign_up(at) {
      $(".cont_forms").attr("class", "cont_forms cont_forms_active_sign_up");
      $(".cont_form_sign_up").css({ display: "block", opacity: "0" });

      setTimeout(function () {
        $(".cont_form_sign_up").css({ opacity: "1" });
      }, 100);

      $(".cont_form_login").css({ display: "none" });
    },

    //左上角关闭按钮
    ocultar_login_sign_up() {
      $(".cont_forms").attr("class", "cont_forms");
      $(".cont_form_sign_up").css({ opacity: "0" });
      $(".cont_form_login").css({ opacity: "1" });

      setTimeout(function () {
        $(".cont_form_sign_up").css({ display: "none" });
        $(".cont_form_login").css({ display: "block" });
      }, 50);
      this.cambiar_login();
      this.$refs.registerForm.resetFields();
    },
    copyright() {
      window.location.href = "https://beian.miit.gov.cn/#/Integrated/index";
    },
    //切换语言
    changeLanguage() {
      let lan = navigator.systemLanguage || navigator.language;
      const lang =
        lan === "zh" || lan === "zh-CN" || lan === "zh-cn" ? "zh" : "en";
      this.$i18n.locale = lang;
      this.$store.state.i18n = lang;
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    // 记录访问终端的浏览器信息，便于排查兼容性问题（大屏图表、全屏、分辨率等）
    recordBrowserInfo() {
      try {
        const info = getBrowserInfo();
        sessionStorage.setItem("browserInfo", JSON.stringify(info));
        window.__browserInfo = info;
        console.info(
          "[browser]",
          formatBrowserInfo(info),
          "| shell:",
          !!info.isShellBrowser,
          "| secure:",
          !!info.secureContext,
          "| uaData:",
          !!info.hasUAData,
          "| brands:",
          info.brands || "n/a"
        );
        return info;
      } catch (e) {
        return null;
      }
    },
    // 非 Chrome / Firefox / Safari 时提示更换浏览器（同一会话只提示一次）
    checkBrowserSupport() {
      try {
        const supported = ["Chrome", "Firefox", "Safari"];
        const info = this.browserInfo || {};
        const major = parseInt(String(info.version).split(".")[0], 10) || 0;
        // macOS 版 360 极速浏览器用系统 WebKit，UA 与 Safari 完全相同（如 Version/14.1），
        // 只能按 Safari 版本下限兜底；项目建议 Safari 16+（macOS 13+）
        const isOldSafari = info.name === "Safari" && major > 0 && major < 16;
        // 壳浏览器（360、QQ 等精简 UA 的 Chromium 内核）虽被识别成 Chrome，也一并提示
        const isSupported =
          supported.includes(info.name) && !info.isShellBrowser && !isOldSafari;
        if (isSupported) return;
        // 便于排查：打印识别依据
        console.info(
          "[browser] unsupported:",
          info.name,
          info.version,
          "| engine:",
          info.engine,
          "| shell:",
          !!info.isShellBrowser,
          "| oldSafari:",
          isOldSafari,
          "| brands:",
          info.brands || "n/a"
        );
        // 每次打开登录页都提示，不做会话去重
        this.browserTipVisible = true;
      } catch (e) {}
    },
    closeBrowserTip() {
      this.browserTipVisible = false;
    },
    onresizes() {
      window.onresize = () => {
        const windowWidth = document.body.clientWidth;
        const windowHeight = document.body.clientHeight;
        const windowAspectRatio = windowHeight / windowWidth;
        let videoWidth;
        let videoHeight;
        if (windowAspectRatio < 0.5625) {
          videoWidth = windowWidth;
          videoHeight = videoWidth * 0.5625;
          this.fixStyle = {
            height: windowWidth * 0.5625 + "px",
            width: windowWidth + "px",
            "margin-bottom": (windowHeight - videoHeight) / 2 + "px",
            "margin-left": "initial",
          };
        } else {
          videoHeight = windowHeight;
          videoWidth = videoHeight / 0.5625;
          this.fixStyle = {
            height: windowHeight + "px",
            width: windowHeight / 0.5625 + "px",
            "margin-left": (windowWidth - videoWidth) / 2 + "px",
            "margin-bottom": "initial",
          };
        }
      };
    },
  },
  beforeCreate() {
    // sessionStorage.clear();
    // window.localStorage.clear();
    // window.location.reload();
  },
  created() {
    // sessionStorage.clear();
    // window.localStorage.clear();
    // window.location.reload();
    this.changeLanguage();
  },

  beforeMount() {
    this.$i18n.locale = navigator.language;
  },

  mounted() {
    var that = this;
    this.browserInfo = this.recordBrowserInfo() || {};
    this.checkBrowserSupport();
    this.clearLegacyCookies();
    this.loadRememberedUsername();
    this.cambiar_login();

    if (this._isMobile()) {
      const appid = process.env.VUE_APP_WECHAT_APPID
      const secret = process.env.VUE_APP_WECHAT_SECRET
      if (!appid || !secret) {
        // 未配置敏感凭据时直接返回，避免泄露
        console.warn('WeChat appid/secret is not configured. Skipping mini-program flow.')
        return
      }
      that
        .$axios({
          method: "get",
          url: `apiTWO/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(appid)}&secret=${encodeURIComponent(secret)}`,
        })
        .then(function (data) {
          let access_token = JSON.parse(data.request.response).access_token;
          that
            .$axios({
              method: "POST",
              url: `apiTWO/wxa/generatescheme?access_token=${access_token}`,
            })
            .then((res) => {
              location.href = res.data.openlink;
            });
        });
      return;
    }
    this.onresizes();
    window.onresize();
  },
};
</script>

<style>
/* 只作用在登录页，避免登录后污染首页 flex 布局（否则会白屏） */
.cotn_principal,
.cotn_principal * {
  margin: 0 auto;
  padding: 0;
}

.el-tooltip__popper {
  font-size: 14px;
  max-width: 50%;
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

.el-message--info {
  display: -webkit-box !important;
}

/* 表单验证不通过 */
.el-form-item__error--inline {
  display: block !important;
}

.cotn_principal {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  /* 登录页主视觉：与平台浅色蓝白主题一致（#f5f7fb 底、#2f7bff→#22d3ee 点缀）
     等轴测园区/楼层、基站覆盖、轨迹、电子围栏；矢量背景适配 2K/4K 屏。
     深色科技风版本保留在 login-bg.svg，改这里一行即可切回。 */
  background-color: #f5f7fb;
  background-image: url(../../assets/login-bg.svg);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.poster img {
  z-index: 0;
  position: absolute;
}

.filter {
  z-index: 1;
  position: absolute;
  /* background: rgba(0, 0, 0, 0.3); */
  width: 100%;
}

.fillWidth {
  width: 100%;
}

/*.cotn_principal:before {
   content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../../../static/introduce.png") no-repeat;
  background-size: cover;
  filter: blur(1px);
  background-size: cover; 
}*/
.introduce_img {
  width: 700px;
  height: 600px;
}

.cont_centrar {
  position: relative;
  float: left;
  width: 100%;
}

.cont_login {
  position: relative;
  width: 320px;
  /* top: 16vh; */
  /* left: 50%;
  margin-left: -320px; */
}

.cont_back_info {
  position: relative;
  float: left;
  width: 700px;
  height: 280px;
  overflow: hidden;
  background-color: #fff;
  margin-top: 100px;
  box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.cont_forms {
  border-radius: 8px;
  position: fixed;
  overflow: hidden;
  /* top: 28%;
  right: 40%; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 350px;
  height: 280px;
  margin: auto;
  /* background-color: rgba(135, 206, 235, 1); */
  background-color: rgba(70, 130, 180, 0.5);
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
  /* z-index: 22; */
}

.cont_forms_active_login {
  box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
  height: 410px;
  /* top: 20px; */
  /* left: 0px; */
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.cont_forms_active_sign_up {
  box-shadow: 1px 10px 30px -10px rgba(0, 0, 0, 0.5);
  height: 524px;
  top: 20%;
  /* left: 350px; */
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.cont_img_back_grey {
  position: absolute;
  width: 950px;
  top: -80px;
  left: -116px;
}

.cont_img_back_grey > img {
  width: 100%;
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  opacity: 0.2;
  animation-name: animar_fondo;
  animation-duration: 20s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.cont_img_back_ {
  position: absolute;
  width: 950px;
  top: -80px;
  left: -116px;
}

.cont_img_back_ > img {
  width: 100%;
  opacity: 0.3;
  animation-name: animar_fondo;
  animation-duration: 20s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.cont_forms_active_login > .cont_img_back_ {
  top: 0px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.cont_forms_active_sign_up > .cont_img_back_ {
  top: 0px;
  left: -435px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.cont_info_log_sign_up {
  position: fixed;
  width: 700px;
  height: 280px;
  top: 25%;
  z-index: 1;
}

.btn_login {
  background-color: #4d80e4;
  border: none;
  padding: 10px;
  width: 200px;
  border-radius: 3px;
  box-shadow: 1px 5px 20px -5px rgba(0, 0, 0, 0.4);
  color: #fff;
  margin-top: 10px;
  cursor: pointer;
}

.col_md_sign_up {
  position: relative;
  float: left;
  width: 50%;
}

.cont_ba_opcitiy > h2 {
  font-weight: 400;
  color: #fff;
}

.cont_ba_opcitiy > p {
  font-weight: 400;
  margin-top: 15px;
  color: #fff;
}

/* ----------------------------------
background text    
------------------------------------
 */
.cont_ba_opcitiy {
  position: relative;
  background-color: rgba(187, 168, 170, 0.79);
  width: 80%;
  border-radius: 3px;
  margin-top: 60px;
  padding: 15px 0px;
}

.btn_sign_up {
  background-color: #4d80e4;
  border: none;
  padding: 10px;
  width: 200px;
  border-radius: 3px;
  box-shadow: 1px 5px 20px -5px rgba(0, 0, 0, 0.4);
  color: #fff;
  margin-top: 10px;
  cursor: pointer;
}

.cont_forms_active_sign_up {
  z-index: 2;
}

@-webkit-keyframes animar_fondo {
  from {
    -webkit-transform: scale(1) translate(0px);
    -moz-transform: scale(1) translate(0px);
    -ms-transform: scale(1) translate(0px);
    -o-transform: scale(1) translate(0px);
    transform: scale(1) translate(0px);
  }

  to {
    -webkit-transform: scale(1.5) translate(50px);
    -moz-transform: scale(1.5) translate(50px);
    -ms-transform: scale(1.5) translate(50px);
    -o-transform: scale(1.5) translate(50px);
    transform: scale(1.5) translate(50px);
  }
}

@-o-keyframes identifier {
  from {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }

  to {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }
}

@-moz-keyframes identifier {
  from {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }

  to {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }
}

@keyframes identifier {
  from {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }

  to {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }
}
</style>

<style scoped>
.dialog-footer {
  margin-top: -30px;
}

.nameinput,
.passwordinput {
  border: 0px;
  width: 280px;
  height: 38px;
  border-radius: 10px;
}

.loginbutton {
  width: 280px;
  height: 38px;
  color: #ffffff;
  font-family: SourceHanSansCN-Medium;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #4d80e4;
}

.checkdiv {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  color: white !important;
}

.checkdiv .el-button--text,
.checkdiv :deep(.el-checkbox__label) {
  color: white !important;
}

.loginhead {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 22px;
}

a {
  text-decoration: none;
}

.cont_form_login {
  position: absolute;
  opacity: 0;
  display: none;
  width: 350px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.cont_forms_active_login {
  z-index: 2;
}

.cont_form_sign_up {
  position: absolute;
  width: 350px;
  float: left;
  opacity: 0;
  display: none;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.cont_form_sign_up > input {
  text-align: left;
  padding: 15px 5px;
  margin-left: 10px;
  margin-top: 20px;
  width: 260px;
  border: none;
  /* color: #757575; */
  color: white;
}

.cont_form_sign_up :deep(input::-webkit-input-placeholder) {
  /* WebKit, Blink, Edge */
  color: white;
}

.cont_form_sign_up :deep(.el-icon-question) {
  color: white;
}

.cont_form_sign_up > h2 {
  margin-top: 50px;
  font-weight: 400;
  color: white;
}

.cont_form_login > input {
  padding: 15px 5px;
  margin-left: 10px;
  margin-top: 20px;
  width: 260px;
  border: none;
  text-align: left;
  color: #757575;
}

.cont_form_login > h2 {
  margin-top: 34px;
  font-weight: 400;
  /* color: #757575; */
  color: white;
}

.cont_form_login > a,
.cont_form_sign_up > a {
  /* color: #757575; */
  color: white;
  position: relative;
  float: right;
  margin: 10px;
  margin-right: 20px;
}

.no-autofill-pwd :deep(.el-input__inner) {
  -webkit-text-security: disc !important;
}

.login-icon {
  mask: url("../../assets/login.svg");
  width: 22px;
  height: 22px;
  display: inline-block;
  mask-size: contain;
  /* background-color: rgb(105, 105, 105); */
  background-color: white;
  transform: translateY(5px);
}

.fr {
  /* Permalink - use to edit and share this gradient: /code/cssgradient/index.aspx#739ae2+2,4a80e2+60,4d80e4+100 */
  background: #739ae2 !important;
  /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #739ae2 2%,
    #4a80e2 60%,
    #4d80e4 100%
  ) !important;
  /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #739ae2 2%,
    #4a80e2 60%,
    #4d80e4 100%
  ) !important;
  /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #739ae2 2%,
    #4a80e2 60%,
    #4d80e4 100%
  ) !important;
  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#739ae2', endColorstr='#4d80e4', GradientType=0);
  /* IE6-9 */
}

.text {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  left: 13%;
  text-align: start;
  font-weight: 400;
}

.text .title1,
.title2 {
  line-height: 1.4;
  font-size: 37px;
  color: #fff;
  letter-spacing: 4px;
}

.text .title3 {
  font-weight: 400;
  margin-top: 1vh;
  color: #fff;
  font-size: 30px;
}

.footer {
  position: fixed;
  bottom: 2vh;
  width: 100%;
  color: #1f1f1f;
  z-index: 99;
}

.footer a {
  color: #303030;
}

.el-form-item__content {
  /* width: 280px; */
}

.form {
  width: 280px;
}

.form :deep(.el-input__inner) {
  color: white;
  background-color: rgba(255, 255, 255, 0.4) !important;
}

.form :deep(.el-form-item__error) {
  color: white;
}

.item {
  right: -25px;
}

.agree :deep(.el-checkbox__label) {
  font-size: 12px !important;
  color: white;
  /* color: #606266; */
}

.agree :deep(.el-checkbox__label a) {
  font-size: 12px !important;
  color: red;
  /* color: #4d80e4; */
}

.agree :deep(.el-checkbox__label a:hover) {
  text-decoration: underline;
}

.scrolllist1 {
  max-height: 80vh;
}

.agree-dialog :deep(.el-dialog__body) {
  padding-top: 0;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 20px;
}

.scrollbar :deep(.el-scrollbar__bar) {
  right: 0;
}

.agree-wrapper :deep(.el-form-item__content) {
  line-height: 1.5;
}

/* 登录框 */
.Login_Fream {
  position: fixed;
  right: 11%;
  top: 50%;
  transform: translateY(-50%);
  width: 520px;
  padding: 52px 48px 44px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.10);
  overflow: hidden;
}

.Login_Fream::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  background: linear-gradient(90deg, #2f7bff, #22d3ee);
}

.auth-head {
  margin: 0 0 36px;
  text-align: center;
}

.welcome_text {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2d3d;
  letter-spacing: 2px;
}

.auth-sub {
  margin: 10px 0 0;
  font-size: 16px;
  color: #8a94a6;
}

.auth-field {
  margin: 0;
  width: 100%;
}

.ipt_frame {
  margin: 0;
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #f6f8fb;
  border: 1px solid #dfe4ec;
  border-radius: 10px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.ipt_frame:hover {
  border-color: #b9c6db;
}

.ipt_frame:focus-within {
  background: #ffffff;
  border-color: #2f7bff;
  box-shadow: 0 0 0 3px rgba(47, 123, 255, 0.14);
}

.ipt_frame.is-error {
  border-color: #f56c6c;
  background: #fff;
}

.box_input {
  flex: 1;
  min-width: 0;
  height: 100%;
  margin: 0 0 0 12px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 17px;
  color: #1f2d3d;
}

.box_input::placeholder {
  color: #a8b0bd;
}

.imgBox {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin: 0;
  opacity: 0.7;
}

.imgBox_user {
  background: url(../../../static/newUser.png) center / 100% 100% no-repeat;
}

.imgBox_psw {
  background: url(../../../static/newPsw.png) center / 100% 100% no-repeat;
}

.eye {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin: 0 0 0 10px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.eye:hover {
  opacity: 1;
}

.eye1 {
  background: url(../../../static/openeye.png) center / 100% 100% no-repeat;
}

.eye2 {
  background: url(../../../static/closeeye.png) center / 100% 100% no-repeat;
}

.auth-error {
  margin: 0;
  padding: 0 4px;
  height: 26px;
  line-height: 26px;
  font-size: 13px;
  color: #f56c6c;
  text-align: left;
}

.optionBox {
  width: 100%;
  margin: 2px 0 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-check {
  margin: 0;
  height: auto;
}

.remember-check :deep(.el-checkbox__inner) {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.remember-check :deep(.el-checkbox__inner::after) {
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
}

.remember-check :deep(.el-checkbox__label) {
  padding-left: 8px;
}

.rememberPassword {
  font-size: 15px;
  color: #5c6b80;
}

.remember-check.is-checked .rememberPassword {
  color: #2f7bff;
}

.auth-links {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
}

.auth-links-divider {
  width: 1px;
  height: 14px;
  background: #dfe4ec;
}

.register,
.reset {
  font-size: 15px;
  color: #2f7bff;
  cursor: pointer;
  transition: color 0.2s;
}

.register:hover,
.reset:hover {
  color: #22a5e6;
  text-decoration: underline;
}

.onlogin {
  width: 100%;
  height: 54px;
  line-height: 54px;
  margin: 0;
  border-radius: 10px;
  color: #ffffff;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 6px;
  text-align: center;
  background: linear-gradient(135deg, #22d3ee, #2f7bff);
  box-shadow: 0 10px 22px rgba(47, 123, 255, 0.3);
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
}

.is-en .welcome_text,
.is-en .onlogin {
  letter-spacing: 0.5px;
}

.onlogin:hover {
  filter: brightness(1.05);
  box-shadow: 0 12px 26px rgba(47, 123, 255, 0.38);
}

.onlogin:active {
  transform: translateY(1px);
}

.auth-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.copyright {
  margin: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.copyright:hover {
  color: #2f7bff;
}

.recommendation {
  margin: 0;
  color: #94a3b8;
}

/* 浏览器兼容性提示 */
.browser-tip-mask {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
}

.browser-tip {
  width: 420px;
  max-width: 100%;
  padding: 28px 28px 22px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.28);
  text-align: center;
}

.browser-tip-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.browser-tip-desc {
  margin: 0 0 18px;
  font-size: 14px;
  line-height: 22px;
  color: #475569;
}

.browser-tip-links {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.browser-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 10px;
  border-radius: 10px;
  color: #fff;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.browser-link-name {
  font-size: 16px;
  font-weight: 600;
}

.browser-link-sub {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.9;
}

.browser-link.is-chrome {
  background: linear-gradient(135deg, #4285f4, #34a853);
}

.browser-link.is-firefox {
  background: linear-gradient(135deg, #ff9500, #ff4d2d);
}

.browser-link:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
}

.browser-tip-current {
  margin: 0 0 18px;
  font-size: 12px;
  color: #94a3b8;
}

.browser-tip-btn {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #2f7bff;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: filter 0.2s, box-shadow 0.2s;
}

.browser-tip-btn:hover {
  filter: brightness(1.05);
  box-shadow: 0 10px 22px rgba(47, 123, 255, 0.32);
}
</style>
