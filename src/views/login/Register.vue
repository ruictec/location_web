<template>
  <div class="registerFrame">
    <div class="frame_absolute" v-if="setresetnoon">
      <div class="registerFrameBox">
        <div class="fork" @click="fork">X</div>
        <h1>{{ $t("register.register") }}</h1>
        <!-- <div class="fiveipt"> -->
        <div>
          <input
            @input="Zuser"
            v-model="registerForm.username"
            type="text"
            name=""
            class="iptbox"
            :placeholder="$t('register.enterUser')"
          />
          <div class="noneBox">
            <p v-if="nouser" class="noneBox_p">{{ $t("Change.nouser") }}</p>
          </div>
        </div>
        <div>
          <input
            @input="tpsw"
            v-model="registerForm.password"
            type="text"
            name=""
            class="iptbox"
            :placeholder="$t('register.enterPassword')"
          />
          <div class="noneBox">
            <p v-if="nopswd" class="noneBox_p">{{ $t("Change.nopswd") }}</p>
          </div>
        </div>
        <div>
          <input
            @input="tpsw"
            v-model="registerForm.surepassword"
            type="text"
            name=""
            class="iptbox"
            style="margin: 0px"
            :placeholder="$t('register.confirmPassword')"
          />
          <div class="noneBox">
            <p v-if="Tpsw" class="noneBox_p">
              {{ $t("tips.secondPassword") }}
            </p>
          </div>
        </div>
        <div class="illustrateBox" style="padding: 0px; margin-bottom: 0px">
          <div>
            <input
              @input="enteremail"
              v-model="registerForm.email"
              type="text"
              name=""
              class="iptbox"
              style="margin-bottom: 0px"
              :placeholder="$t('register.enterEmail')"
            />
            <div class="noneBox">
              <p v-if="email" class="noneBox_p">
                {{ $t("tips.email") }}
              </p>
            </div>
          </div>

          <el-tooltip
            class="item illustrate"
            effect="light"
            placement="right-start"
          >
            <div slot="content">
              {{ $t("register.emailPrompt") }}
            </div>
            <i class="illustrate" />
          </el-tooltip>
        </div>
        <div class="illustrateBox" style="padding: 0px">
          <div>
            <input
              @input="enterTenantid"
              v-model="registerForm.tenantid"
              type="text"
              name=""
              class="iptbox"
              style="margin-bottom: 0px"
              :placeholder="$t('register.enterTenantid')"
            />
            <div class="noneBox">
              <p v-if="noregistration" class="noneBox_p">
                {{ $t("Change.nocode") }}
              </p>
            </div>
          </div>
          <el-tooltip
            class="item illustrate"
            effect="light"
            placement="right-start"
          >
            <div slot="content">
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
            </div>
            <i class="illustrate" />
          </el-tooltip>
        </div>
        <!-- </div> -->
        <div class="account" @click="register">
          {{ $t("register.register") }}
        </div>
        <div>
          <el-checkbox v-model="checked">{{
            $t("register.agree")
          }}</el-checkbox>
          <span class="agreement" @click="centerDialogVisible = true">{{
            $t("register.statement")
          }}</span>
        </div>
        <!-- 阅读协议 -->
        <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
          <agreement></agreement>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">{{
              $t("retrieve.cancel")
            }}</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">{{
              $t("retrieve.confirm")
            }}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div class="frame_absolute2" style="height: 500px" v-else>
      <div class="registerFrameBox2">
        <div class="fork" @click="fork">X</div>
        <h1>{{ $t("usercenter.editpwd") }}</h1>
        <div>
          <input
            @input="iptemail2"
            v-model="resetPassword.resetEmail"
            type="text"
            name=""
            class="iptbox"
            :placeholder="$t('retrieve.mailbox')"
          />
          <div class="changeBox">
            <p class="changeBox_p" v-if="email2">{{ $t("Change.email") }}</p>
          </div>
        </div>
        <div>
          <div style="position: relative">
            <input
              @input="iptcode2"
              v-model="resetPassword.Code"
              type="text"
              name=""
              class="iptbox"
              :placeholder="time"
            />
            <div class="send" @click="sendCode" v-if="!disabled">
              {{ $t("retrieve.sendOut") }}
            </div>
            <div class="send" style="background: red" v-else>
              {{ $t("retrieve.sendOut") }}
            </div>
          </div>
          <div class="changeBox">
            <p class="changeBox_p" v-if="code2">{{ $t("Change.Incorrect") }}</p>
          </div>
        </div>
        <div>
          <input
            @input="esquecer"
            v-model="resetPassword.newpsw"
            type="text"
            name=""
            class="iptbox"
            :placeholder="$t('retrieve.newPassword')"
          />
          <div class="changeBox">
            <p class="changeBox_p" v-if="newpswd2">
              {{ $t("Change.nonewpswd") }}
            </p>
          </div>
        </div>
        <div>
          <input
            @input="esquecer"
            v-model="resetPassword.confirmNewpsw"
            type="text"
            name=""
            class="iptbox"
            :placeholder="$t('retrieve.confirmPassword')"
            style="margin: 0px"
          />
          <div class="changeBox">
            <p class="changeBox_p" v-if="confirmnewpswd2">
              {{ $t("Change.passwords") }}!
            </p>
          </div>
        </div>
        <div class="select">
          <div class="confirm" @click="confirm">
            {{ $t("retrieve.confirm") }}
          </div>
          <div class="cancel" @click="cancel">{{ $t("retrieve.cancel") }}</div>
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
  created() {
    this.time = this.$t("retrieve.verificationCode");
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
        this.time = that.$t("tips.inputCode");
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
  width: 100%;
  height: 100%;
  background: url(../../assets/banner2.png) 0px 0px;
  background-size: 100% 100%;
  position: relative;
}

.frame_absolute {
  position: absolute;
  left: calc(50% - 252px);
  top: calc(50% - 371px);
}

.frame_absolute2 {
  position: absolute;
  left: calc(50% - 252px);
  top: calc(50% - 300px);
}

.registerFrameBox {
  padding: 20px 0;
  width: 505px;
  height: 742px;
  border-radius: 28px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.registerFrameBox2 {
  padding: 20px 0;
  width: 505px;
  height: 600px;
  border-radius: 28px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.fiveipt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.fork {
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 30px;
  top: 20px;
}

.iptbox {
  width: 350px;
  height: 60px;
  border: 2px solid #bbbbbb;
  border-radius: 10px;
  text-indent: 30px;
  font-size: 20px;
}

.noneBox {
  width: 100%;
  height: 36px;
}

.noneBox_p {
  width: 100%;
  height: 100%;
  text-align: left;
  color: red;
  font-size: 14px;
  line-height: 36px;
  margin-left: 10px;
}

.account {
  width: 350px;
  height: 46px;
  line-height: 46px;
  font-size: 20px;
  color: #ffffff;
  background: linear-gradient(180deg, #75cfff 0%, #0086d9 100%);
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 20px;
}

.agreement {
  color: red;
  cursor: pointer;
}

.reset {
  /* width: 200px; */
  font-size: 16px !important;
  margin: 0 auto;
  text-align: center;
  cursor: pointer;
}

.register {
  font-size: 16px !important;
}

.reset:hover {
  color: rgb(168, 172, 179);
}

.register:hover {
  color: rgb(168, 172, 179);
}

.rememberPassword {
  font-size: 16px !important;
}

.illustrateBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 36px;
}

.illustrate {
  width: 40px;
  height: 40px;
  background: url(../../../static/illustrate.png) 0px 0px;
  background-size: 100% 100%;
  position: absolute;
  right: -38px;
  top: 7px;
}

.send {
  width: 160px;
  height: 60px;
  border-radius: 10px;
  background: linear-gradient(180deg, #66c6fa 45%, #0e8fde 100%);
  position: absolute;
  right: 0px;
  top: 0px;
  font-size: 18px;
  color: #ffffff;
  line-height: 60px;
  cursor: pointer;
}

.select {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 320px;
  margin: 0 auto;
}

.confirm {
  width: 120px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(180deg, #75cfff 0%, #0086d9 100%);
  font-size: 24px;
  color: #ffffff;
  line-height: 46px;
  cursor: pointer;
}

.cancel {
  width: 120px;
  height: 46px;
  border-radius: 14px;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #bbbbbb;
  color: #bbbbbb;
  font-size: 24px;
  line-height: 46px;
  cursor: pointer;
}

.changeBox {
  width: 100%;
  height: 36px;
}

.changeBox_p {
  width: 100%;
  height: 100%;
  text-align: left;
  line-height: 26px;
  font-size: 16px;
  color: red;
  margin-left: 10px;
}
</style>