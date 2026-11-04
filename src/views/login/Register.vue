<template>
  <div class="registerFrame" :class="{ 'is-en': $store.state.i18n != 'zh' }">
    <div class="auth-card" v-if="setresetnoon">
      <span class="auth-close fork" @click="fork">×</span>
      <div class="auth-head">
        <h1>{{ $t("register.register") }}</h1>
        <p class="auth-sub">{{ $t("login.introduce") }}</p>
      </div>
      <div class="auth-field">
        <div class="auth-input" :class="{ 'is-error': nouser }">
          <input
            @input="Zuser"
            v-model="registerForm.username"
            type="text"
            autocomplete="username"
            class="iptbox"
            :placeholder="$t('register.enterUser')"
          />
        </div>
        <p class="auth-error">
          <template v-if="nouser">{{ $t("Change.nouser") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="auth-input" :class="{ 'is-error': nopswd }">
          <input
            @input="tpsw"
            v-model="registerForm.password"
            type="password"
            autocomplete="new-password"
            class="iptbox"
            :placeholder="$t('register.enterPassword')"
          />
        </div>
        <p class="auth-error">
          <template v-if="nopswd">{{ $t("Change.nopswd") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="auth-input" :class="{ 'is-error': Tpsw }">
          <input
            @input="tpsw"
            v-model="registerForm.surepassword"
            type="password"
            autocomplete="new-password"
            class="iptbox"
            :placeholder="$t('register.confirmPassword')"
          />
        </div>
        <p class="auth-error">
          <template v-if="Tpsw">{{ $t("tips.secondPassword") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="auth-input has-help" :class="{ 'is-error': email }">
          <input
            @input="enteremail"
            v-model="registerForm.email"
            type="text"
            autocomplete="email"
            class="iptbox"
            :placeholder="$t('register.enterEmail')"
          />
          <el-tooltip effect="light" placement="right-start">
            <template #content
              ><div class="auth-help-tip">
                {{ $t("register.emailPrompt") }}
              </div></template
            >
            <i class="illustrate" />
          </el-tooltip>
        </div>
        <p class="auth-error">
          <template v-if="email">{{ $t("tips.email") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="auth-input has-help" :class="{ 'is-error': noregistration }">
          <input
            @input="enterTenantid"
            v-model="registerForm.tenantid"
            type="text"
            class="iptbox"
            :placeholder="$t('register.enterTenantid')"
          />
          <el-tooltip effect="light" placement="right-start">
            <template #content
              ><div class="auth-help-tip">
                {{ $t("register.tenantidPrompt") }}
                <a
                  href="https://www.rctiot.com/html/product/index.html?number=0"
                  target="_blank"
                  v-if="$store.state.i18n == 'zh'"
                >
                  {{ $t("register.tenantidPrompts") }}
                </a>
                <a
                  href="https://www.rctiot.com/rct/#/card"
                  target="_blank"
                  v-else
                >
                  {{ $t("register.tenantidPrompts") }}
                </a>
              </div></template
            >
            <i class="illustrate" />
          </el-tooltip>
        </div>
        <p class="auth-error">
          <template v-if="noregistration">{{ $t("Change.nocode") }}</template>
        </p>
      </div>
      <div class="auth-btn account" @click="register">
        {{ $t("register.register") }}
      </div>
      <div class="auth-agree">
        <el-checkbox v-model="checked" class="agree-check">{{
          $t("register.agree")
        }}</el-checkbox>
        <span class="agreement" @click="centerDialogVisible = true">{{
          $t("register.statement")
        }}</span>
      </div>
      <div class="auth-switch">
        <span @click="fork">{{ $t("login.existingAccount") }}</span>
      </div>
      <!-- 阅读协议 -->
      <el-dialog v-model="centerDialogVisible" width="30%" center>
        <agreement></agreement>
        <template #footer
          ><span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">{{
              $t("retrieve.cancel")
            }}</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">{{
              $t("retrieve.confirm")
            }}</el-button>
          </span></template
        >
      </el-dialog>
    </div>
    <div class="auth-card" v-else>
      <span class="auth-close fork" @click="fork">×</span>
      <div class="auth-head">
        <h1>{{ $t("retrieve.resetPassword") }}</h1>
        <p class="auth-sub">{{ $t("retrieve.resetTip") }}</p>
      </div>
      <div class="auth-field">
        <div class="auth-input" :class="{ 'is-error': email2 }">
          <input
            @input="iptemail2"
            v-model="resetPassword.resetEmail"
            type="text"
            autocomplete="email"
            class="iptbox"
            :placeholder="$t('retrieve.mailbox')"
          />
        </div>
        <p class="auth-error">
          <template v-if="email2">{{ $t("Change.email") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="auth-code">
          <div class="auth-input" :class="{ 'is-error': code2 }">
            <input
              @input="iptcode2"
              v-model="resetPassword.Code"
              type="text"
              class="iptbox"
              :placeholder="$t('retrieve.verificationCode')"
            />
          </div>
          <div class="send" @click="sendCode" v-if="!disabled">
            {{ $t("retrieve.sendOut") }}
          </div>
          <div class="send is-disabled" v-else>{{ time }}s</div>
        </div>
        <p class="auth-error">
          <template v-if="code2">{{ $t("Change.Incorrect") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="auth-input" :class="{ 'is-error': newpswd2 }">
          <input
            @input="esquecer"
            v-model="resetPassword.newpsw"
            type="password"
            autocomplete="new-password"
            class="iptbox"
            :placeholder="$t('retrieve.newPassword')"
          />
        </div>
        <p class="auth-error">
          <template v-if="newpswd2">{{ $t("Change.nonewpswd") }}</template>
        </p>
      </div>
      <div class="auth-field">
        <div class="auth-input" :class="{ 'is-error': confirmnewpswd2 }">
          <input
            @input="esquecer"
            v-model="resetPassword.confirmNewpsw"
            type="password"
            autocomplete="new-password"
            class="iptbox"
            :placeholder="$t('retrieve.confirmPassword')"
          />
        </div>
        <p class="auth-error">
          <template v-if="confirmnewpswd2">{{ $t("Change.passwords") }}</template>
        </p>
      </div>
      <div class="select">
        <div class="auth-btn is-ghost cancel" @click="cancel">
          {{ $t("retrieve.cancel") }}
        </div>
        <div class="auth-btn confirm" @click="confirm">
          {{ $t("retrieve.confirm") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  registerUser,
  registerSendMail,
  registerUserPwd,
} from "../../axios/api";
import agreement from "./agreement.vue";
export default {
  components: {
    agreement,
  },
  name: "Register",

  data() {
    return {
      checked: true,
      disabled: false,
      setresetnoon: true,
      time: 60,
      twopsw: false,
      centerDialogVisible: false,
      registerForm: {
        //注册账号
        username: "",
        password: "",
        confirmpassword: "",
        // phone: "",
        email: "",
        tenantid: "",
        agree: "",
      },
      resetPassword: {
        //重置密码
        resetEmail: "",
        Code: "",
        newpsw: "",
        confirmNewpsw: "",
      },
      // 格式
      nouser: false, //用户名
      nopswd: false, //密码
      Tpsw: false, //二次密码
      email: false, //邮箱
      noregistration: false, //注册码
      // 修改密码格式
      email2: false,
      code2: false,
      newpswd2: false,
      confirmnewpswd2: false,
    };
  },
  mounted() {
    this.setresetnoon = this.$route.query.setresetnoon === "true";
  },
  methods: {
    tpsw() {
      if (this.registerForm.password) {
        this.nopswd = false;
      } else {
        this.nopswd = true;
      }

      if (this.registerForm.surepassword != this.registerForm.password) {
        this.Tpsw = true;
      } else {
        this.Tpsw = false;
      }
      return;
      if (this.registerForm.password != this.registerForm.surepassword) {
        this.Tpsw = true;
      } else {
        this.Tpsw = false;
      }
    },
    enterTenantid() {
      if (this.registerForm.tenantid) {
        this.noregistration = false;
      } else {
        this.noregistration = true;
      }
    },
    // 叉
    fork() {
      this.$router.push("/login");
    },
    // 邮箱正则
    enteremail() {
      const reg =
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      const email = reg.test(this.registerForm.email);
      if (email == true) {
        this.email = false;
      } else {
        this.email = true;
      }
    },
    //注册
    register() {
      var that = this;
      if (
        !this.registerForm.username ||
        !this.registerForm.password ||
        !this.registerForm.surepassword ||
        !this.registerForm.email ||
        !this.registerForm.tenantid
      ) {
        if (!this.registerForm.username) {
          this.nouser = true;
        }
        if (!this.registerForm.password) {
          this.nopswd = true;
        }
        if (
          !this.registerForm.surepassword ||
          this.registerForm.password != this.registerForm.surepassword
        ) {
          this.Tpsw = true;
        }
        if (!this.registerForm.email) {
          this.email = true;
        }
        if (!this.registerForm.tenantid) {
          this.noregistration = true;
        }
      } else {
        if (
          this.nouser == false &&
          this.nopswd == false &&
          this.Tpsw == false &&
          this.email == false &&
          this.noregistration == false
        ) {
          if (this.checked == true) {
            let para = {
              username: that.registerForm.username.toString(),
              userkey: that.registerForm.password.toString(),
              usermail: that.registerForm.email.toString(),
              tenantid: that.registerForm.tenantid.toString(),
            };
            registerUser(para).then(function (data) {
              if (data.code == 1001) {
                that.$message({
                  message: that.$t("tips.registerUser"),
                  type: "success",
                });
                this.setresetnoon = false;
              } else {
                that.$message({
                  message:
                    that.$store.state.i18n == "zh" ? data.msg : data.enMsg,
                  type: "error",
                });
              }
            });
          } else {
            that.$message({
              message: that.$t("login.pleasecheck"),
              type: "error",
            });
          }
        }
      }
    },
    Zuser() {
      // 过滤掉中文字符
      this.registerForm.username = this.registerForm.username.replace(/[\u4e00-\u9fa5]/g, '');
      if (this.registerForm.username) {
        this.nouser = false;
      }
    },
    // 确认
    confirm() {
      var that = this;

      if (!this.resetPassword.resetEmail) {
        this.email2 = true;
      }
      if (!this.resetPassword.Code) {
        this.code2 = true;
      }
      if (!this.resetPassword.newpsw) {
        this.newpswd2 = true;
      }
      if (!this.resetPassword.confirmNewpsw) {
        this.confirmnewpswd2 = true;
      }
      if (
        this.email2 == false &&
        this.code2 == false &&
        this.newpswd2 == false &&
        this.confirmnewpswd2 == false
      ) {
        if (this.resetPassword.newpsw != this.resetPassword.confirmNewpsw) {
          this.$message({
            message: that.$t("login.incon"),
            type: "error",
          });
        }
        let data = {
          email: that.resetPassword.resetEmail,
          password: that.resetPassword.newpsw,
          code: that.resetPassword.Code,
        };
        registerUserPwd(data).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("tips.reset"),
              type: "suceess",
            });
            this.resetPassword = {};
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    // 取消
    cancel() {
      this.$router.push("/login");
      this.resetPassword = {};
    },
    //获取验证码
    sendCode() {
      var that = this;
      const reg =
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      const email = reg.test(this.resetPassword.resetEmail);
      if (!email) {
        this.$message({
          message: this.$t("tips.emailes"),
          type: "warning",
        });
        return;
      }
      if (this.resetPassword.resetEmail == "") {
        this.$message({
          message: this.$t("tips.emails"),
          type: "warning",
        });
        return;
      }
      let data = {
        email: this.resetPassword.resetEmail,
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
        setTimeout(this.timer, 1000);
      } else {
        this.time = 60;
        this.disabled = false;
      }
    },
    esquecerBasic() {
      if (this.resetPassword.newpsw != this.resetPassword.confirmNewpsw) {
        this.twopsw = true;
      } else {
        this.twopsw = false;
      }
    },
    iptemail2() {
      const reg =
        /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      const email2 = reg.test(this.resetPassword.resetEmail);

      if (email2 == true) {
        this.email2 = false;
      } else {
        this.email2 = true;
      }
    },
    iptcode2() {
      if (this.resetPassword.Code) {
        this.code2 = false;
      } else {
        this.code2 = true;
      }
    },
    esquecer() {
      if (this.resetPassword.newpsw) {
        this.newpswd2 = false;
      } else {
        this.newpswd2 = true;
      }
      if (this.resetPassword.newpsw != this.resetPassword.confirmNewpsw) {
        this.confirmnewpswd2 = true;
      } else {
        this.confirmnewpswd2 = false;
      }
    },
  },
};
</script>
<style scoped>
.registerFrame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: url(../../assets/banner2.png) 0px 0px;
  background-size: 100% 100%;
}

.auth-card {
  position: relative;
  width: 500px;
  margin: 24px;
  padding: 48px 48px 36px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(31, 78, 160, 0.18);
  overflow: hidden;
}

.auth-card::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  background: linear-gradient(90deg, #2f7bff, #22d3ee);
}

.auth-close {
  position: absolute;
  right: 18px;
  top: 18px;
  width: 34px;
  height: 34px;
  line-height: 32px;
  text-align: center;
  font-size: 24px;
  color: #8a94a6;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.auth-close:hover {
  background: #f0f3f8;
  color: #1f2d3d;
}

.auth-head {
  margin: 0 0 30px;
  text-align: center;
}

.auth-head h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2d3d;
  letter-spacing: 2px;
}

.auth-sub {
  margin: 10px auto 0;
  max-width: 360px;
  font-size: 15px;
  line-height: 1.5;
  color: #8a94a6;
}

.auth-field {
  width: 100%;
}

.auth-input {
  position: relative;
  flex: 1;
  height: 52px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #f6f8fb;
  border: 1px solid #dfe4ec;
  border-radius: 10px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.auth-input:hover {
  border-color: #b9c6db;
}

.auth-input:focus-within {
  background: #ffffff;
  border-color: #2f7bff;
  box-shadow: 0 0 0 3px rgba(47, 123, 255, 0.14);
}

.auth-input.is-error {
  border-color: #f56c6c;
  background: #ffffff;
}

.iptbox {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 16px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #1f2d3d;
}

.iptbox::placeholder {
  color: #a8b0bd;
}

.auth-input.has-help .iptbox {
  padding-right: 8px;
}

.illustrate {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin: 0 14px 0 0;
  background: url(../../../static/illustrate.png) center / 100% 100% no-repeat;
  opacity: 0.55;
  cursor: help;
  transition: opacity 0.2s;
}

.illustrate:hover {
  opacity: 1;
}

.auth-help-tip {
  max-width: 280px;
  line-height: 1.6;
}

.auth-help-tip a {
  color: #2f7bff;
}

.auth-error {
  margin: 0;
  padding: 0 4px;
  height: 24px;
  line-height: 24px;
  font-size: 13px;
  color: #f56c6c;
  text-align: left;
}

.auth-code {
  display: flex;
  align-items: center;
  gap: 10px;
}

.send {
  flex: 0 0 auto;
  min-width: 128px;
  height: 52px;
  padding: 0 14px;
  box-sizing: border-box;
  line-height: 52px;
  text-align: center;
  font-size: 15px;
  white-space: nowrap;
  color: #2f7bff;
  background: rgba(47, 123, 255, 0.08);
  border: 1px solid rgba(47, 123, 255, 0.35);
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.send:hover {
  background: rgba(47, 123, 255, 0.14);
}

.send.is-disabled {
  color: #a8b0bd;
  background: #f2f4f7;
  border-color: #dfe4ec;
  cursor: not-allowed;
}

.auth-btn {
  height: 52px;
  line-height: 52px;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #ffffff;
  background: linear-gradient(135deg, #22d3ee, #2f7bff);
  box-shadow: 0 10px 22px rgba(47, 123, 255, 0.3);
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
}

.is-en .auth-head h1,
.is-en .auth-btn {
  letter-spacing: 0.5px;
}

.auth-btn:hover {
  filter: brightness(1.05);
  box-shadow: 0 12px 26px rgba(47, 123, 255, 0.38);
}

.auth-btn:active {
  transform: translateY(1px);
}

.auth-btn.is-ghost {
  color: #5c6b80;
  background: #ffffff;
  border: 1px solid #dfe4ec;
  box-shadow: none;
}

.auth-btn.is-ghost:hover {
  color: #2f7bff;
  border-color: #2f7bff;
  filter: none;
}

.account {
  width: 100%;
  margin: 6px 0 0;
}

.auth-agree {
  margin: 18px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 14px;
}

.agree-check {
  margin: 0;
  height: auto;
}

.agree-check :deep(.el-checkbox__inner) {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.agree-check :deep(.el-checkbox__inner::after) {
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
}

.agree-check :deep(.el-checkbox__label) {
  padding-left: 8px;
  font-size: 14px;
  color: #5c6b80 !important;
}

.agreement {
  margin: 0 0 0 2px;
  font-size: 14px;
  color: #2f7bff;
  cursor: pointer;
}

.is-en .agreement {
  margin: 0 0 0 5px;
}

.agreement:hover {
  text-decoration: underline;
}

.auth-switch {
  margin: 14px 0 0;
  text-align: center;
  font-size: 14px;
}

.auth-switch span {
  color: #2f7bff;
  cursor: pointer;
}

.auth-switch span:hover {
  text-decoration: underline;
}

.select {
  margin: 10px 0 0;
  display: flex;
  gap: 16px;
}

.select .auth-btn {
  flex: 1;
}
</style>
