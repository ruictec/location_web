<template>
  <div class="cotn_principal">
    <!-- 登录框 -->
    <div class="Login_Fream" style="transform: scale(0.8)">
      <h1 class="welcome_text">{{ $t("login.vindo") }}</h1>
      <div>
        <div class="ipt_userBox ipt_frame">
          <div class="imgBox imgBox_user"></div>
          <input
            type="text"
            v-model="loginForm.username"
            @input="user"
            name=""
            id=""
            class="box_input"
            :placeholder="$t('login.enterUser')"
          />
        </div>
        <div class="usernone">
          <p class="usernone_p" v-if="loginFormusername">
            {{ $t("login.enterUsers") }}
          </p>
        </div>
      </div>
      <div>
        <div class="ipt_pswBox ipt_frame">
          <div class="imgBox imgBox_psw"></div>
          <input
            :type="password"
            v-model="loginForm.password"
            name=""
            @input="pswd"
            id=""
            class="box_input"
            :placeholder="$t('login.enterPassword')"
          />
          <div class="eye1" @click="eye" v-if="open"></div>
          <div class="eye2" @click="eye" v-else></div>
        </div>
        <div class="pswdnone">
          <p class="pswdnone_p" v-if="loginFormpassword">
            {{ $t("login.enterPasswords") }}
          </p>
        </div>
      </div>
      <div class="onlogin" @click="handleLogin">{{ $t("login.login") }}</div>
      <div class="optionBox">
        <div class="opbtm">
          <el-checkbox v-model="checked"
            ><span class="rememberPassword">{{
              $t("login.rememberPassword")
            }}</span></el-checkbox
          >
        </div>
        <div class="register" @click="NewRegister">
          {{ $t("login.register") }}
        </div>
        <div @click="reset" class="reset">{{ $t("login.forgetPassword") }}</div>
      </div>
    </div>
    <div class="copyright" @click="copyright">
      {{ $t("login.tet") }} {{ $t("login.tet1") }}
    </div>
    <div class="recommendation">{{ $t("login.recommendation") }}</div>
  </div>
</template>
<!-- 微信 JS-SDK 如果不需要兼容小程序，则无需引用此 JS 文件。 -->
<script
  type="text/javascript"
  src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js"
></script>
<!-- uni 的 SDK，必须引用。 -->
<script
  type="text/javascript"
  src="https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.0.1.52.js"
></script>
<script>
import $ from "jquery";
import agreement from "./agreement";
import {
  registerUser,
  registerSendMail,
  registerUserPwd,
} from "../../axios/api";
import router, { adminRoutes, userRoutes, resetRouter } from "../../router/index.js";
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
      checked: true,
      open: false,
      password: "password",
      vedioCanPlay: false,
      fixStyle: "",
      dialogVisible: true,
      agreement: false,
      rePwd: false,
      checked: false,
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
      } else if (
        !this.loginForm.password &&
        this.loginForm.username != "leyi0802"
      ) {
        that.$message({
          message: this.$t("login.enterPasswords"),
        });
      } else {
        if (that.loginForm.username == "leyi0802") {
          that.loginForm.password = "asdf1234 ";
        }
        $(".cont_forms").attr("class", "cont_forms cont_forms_active_login");
        $(".cont_form_login").css({ display: "block", opacity: "0" });

        setTimeout(function () {
          $(".cont_form_login").css({ opacity: "1" });
        }, 400);

        //记住密码
        if (that.checked == true) {
          //传入账号名，密码，和保存天数3个参数
          that.setCookie(
            that.loginForm.username,
            that.loginForm.password,
            that.checked,
            7
          );
        } else {
          //清空Cookie
          that.clearCookie();
        }

        this.$axios({
          method: "POST",
          url: "v1/user/login",
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
              that.tenantid_A = data.data.data.tenantid;
              that.userInfo = data.data.data;
              that.$store.commit("setuserInfo", that.userInfo);
              sessionStorage.setItem(
                "state",
                JSON.stringify(that.$store.state)
              );
              // that.$store.commit("changeGoNext", true);
              try { localStorage.setItem('userInfo', JSON.stringify(that.userInfo)) } catch (e) {}
              // 登录成功后，先按权限注入路由，避免首次跳转未命中路由需要点第二次
              try {
                resetRouter();
                if (Number(that.userInfo.prionum) === 5) {
                  router.addRoutes(userRoutes);
                } else {
                  router.addRoutes(adminRoutes);
                }
              } catch (e) {}
              that.$nextTick(() => {
                const target = that.$route.query.redirect && that.$route.query.redirect !== '/login' ? that.$route.query.redirect : '/dashboard'
                that.$router.replace(target).catch(() => {})
              })
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

    //设置cookie
    setCookie(c_name, c_pwd, c_rem, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "username" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "checked" + "=" + c_rem + ";path=/;expires=" + exdate.toGMTString();
    },

    //读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "username") {
            this.loginForm.username = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "password") {
            this.loginForm.password = arr2[1];
          } else if (arr2[0] == "checked") {
            this.checked = JSON.parse(arr2[1]);
          }
        }
      }
    },
    // 忘记密码
    reset() {
      this.twopsw = false;
      this.$router.push("/register?setresetnoon=false");
    },
    //清除cookie
    clearCookie: function () {
      this.setCookie("", "", "", -1); //修改2值都为空，天数为负1天就好了
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
    this.getCookie();
    this.cambiar_login();
    // 易寻定位
    // wxf85f05de6dcf36e7
    // gh_c4536c12feb2

    if (this._isMobile()) {
      that
        .$axios({
          method: "get",
          url: "apiTWO/cgi-bin/token?grant_type=client_credential&appid=wxf85f05de6dcf36e7&secret=49dfbb3ecd29364f5a3532dfbfde349f",
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
* {
  margin: 0px auto;
  padding: 0px;
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
  /* background: url("../../../static/bg.jpg"); */
  /* background: url("../../../static/introduce.png");
  background-repeat: no-repeat;
  background-size: cover; */
  background: url(../../assets/banner1.png) 0px 0px;
  background-size: 100% 100%;
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
.checkdiv >>> .el-checkbox__label {
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

.cont_form_sign_up >>> input::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: white;
}

.cont_form_sign_up >>> .el-icon-question {
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

.no-autofill-pwd /deep/ .el-input__inner {
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

.form >>> .el-input__inner {
  color: white;
  background-color: rgba(255, 255, 255, 0.4) !important;
}

.form >>> .el-form-item__error {
  color: white;
}

.item {
  right: -25px;
}

.agree >>> .el-checkbox__label {
  font-size: 12px !important;
  color: white;
  /* color: #606266; */
}

.agree >>> .el-checkbox__label a {
  font-size: 12px !important;
  color: red;
  /* color: #4d80e4; */
}

.agree >>> .el-checkbox__label a:hover {
  text-decoration: underline;
}

.scrolllist1 {
  max-height: 80vh;
}

.agree-dialog >>> .el-dialog__body {
  padding-top: 0;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 20px;
}

.scrollbar >>> .el-scrollbar__bar {
  right: 0;
}

.agree-wrapper >>> .el-form-item__content {
  line-height: 1.5;
}

/* 登录框 */
.Login_Fream {
  width: 688px;
  height: 713px;
  background: #ffffff;
  border-radius: 28px;
  position: fixed;
  right: 120px;
  top: calc(50% - 356px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.welcome_text {
  font-size: 40px;
  margin: 66px auto 0 auto;
  border-radius: 10px;
}

.ipt_frame {
  margin: 0 auto;
  width: 550px;
  height: 90px;
  border-radius: 10px;
  border: 2px solid #bbbbbb;
  display: flex;
  align-content: center;
}

.box_input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #9a9a9a;
  margin-right: 20px;
}

.imgBox_user {
  background: url(../../../static/newUser.png) 0px 0px;
  background-size: 100% 100%;
}

.imgBox_psw {
  background: url(../../../static/newPsw.png) 0px 0px;
  background-size: 100% 100%;
}

.ipt_userBox {
  display: flex;
  align-items: center;
}

.ipt_pswBox {
  display: flex;
  align-items: center;
}

.imgBox {
  width: 33px;
  height: 33px;
  margin: 20px 20px 20px 63px;
}

.onlogin {
  width: 425px;
  height: 66px;
  line-height: 66px;
  border-radius: 20px;
  margin: 0 auto;
  color: #ffffff;
  font-size: 36px;
  background: linear-gradient(180deg, #75cfff 0%, #0086d9 100%);
  cursor: pointer;
}

.optionBox {
  width: 70%;
  margin: 0px auto 30px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.opbtm {
  transform: scale(1.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eye1 {
  width: 33px;
  height: 33px;
  margin-right: 20px;
  cursor: pointer;
  background: url(../../../static/openeye.png) 0px 0px;
  background-size: 100% 100%;
}

.eye2 {
  width: 33px;
  height: 33px;
  margin-right: 20px;
  cursor: pointer;
  background: url(../../../static/closeeye.png) 0px 0px;
  background-size: 100% 100%;
}

.rememberPassword {
  font-size: 16px !important;
}

.register {
  transform: scale(1.3);
  font-size: 16px !important;
  cursor: pointer;
}

.reset {
  transform: scale(1.3);
  font-size: 16px !important;
  text-align: center;
  cursor: pointer;
}

.reset:hover {
  color: rgb(168, 172, 179);
}

.register:hover {
  color: rgb(168, 172, 179);
}

.usernone {
  width: 100%;
  height: 30px;
  margin: 20px auto 0px 30px;
  text-align: left;
}

.pswdnone {
  width: 100%;
  height: 30px;
  margin: 20px auto 0px 30px;
  text-align: left;
}

.usernone_p {
  width: 100%;
  height: 100%;
  color: red;
  font-size: 20px;
}

.pswdnone_p {
  width: 100%;
  height: 100%;
  color: red;
  font-size: 20px;
}
.copyright {
  width: 600px;
  text-align: center;
  position: fixed;
  left: calc(50% - 300px);
  bottom: 60px;
  cursor: pointer;
}
.copyright:hover {
  color: #6d6d6d;
}
.recommendation {
  width: 600px;
  text-align: center;
  position: fixed;
  left: calc(50% - 300px);
  bottom: 30px;
}
</style>
