<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><System /></el-aside>
        <el-main>
          <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
          </el-breadcrumb> -->
          <div class="user_content">
            <el-tabs type="border-card" style="width: 100%">
              <!-- 用户资料 -->
              <el-tab-pane :label="$t('usercenter.Userdata')">
                <el-form
                  :label-position="labelPosition"
                  label-width="120px"
                  :model="userInfo"
                  style="display: flex; width: 100%"
                >
                  <el-form-item
                    :label="$t('usercenter.user')"
                    style="width: 33%"
                  >
                    <el-input disabled v-model="userInfo.username"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.admintel')"
                    style="margin-left: 2%; width: 33%"
                  >
                    <el-input disabled v-model="userInfo.usertel"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.usermail1')"
                    style="margin-right: 1%; width: 33%"
                  >
                    <el-input disabled v-model="userInfo.usermail"></el-input>
                  </el-form-item>
                </el-form>
                <el-form
                  :label-position="labelPosition"
                  label-width="120px"
                  :model="userInfo"
                  style="display: flex; width: 100%"
                >
                  <el-form-item
                    :label="$t('usercenter.company')"
                    style="width: 33%"
                  >
                    <el-input
                      disabled
                      v-model="userInfo.customername"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.country')"
                    style="margin-left: 2%; width: 33%"
                  >
                    <el-input disabled v-model="userInfo.country"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.prio')"
                    style="margin-right: 1%; width: 33%"
                  >
                    <el-input
                      disabled
                      :value="i8n == 'zh' ? userInfo.prio : userInfo.enprio"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!-- 用户权限 -->
              <el-tab-pane
                :label="$t('usercenter.Authoritymanagement')"
                v-if="
                  contrForPrionum == 3 ||
                  contrForPrionum == 4 ||
                  contrForPrionum == 5
                "
              >
                <el-form
                  :label-position="labelPosition"
                  label-width="180px"
                  :model="userInfo"
                  style="display: flex; width: 100%"
                >
                  <el-form-item
                    :label="$t('usercenter.Accessrights')"
                    style="width: 32%; margin-left: 0; margin-right: 0"
                  >
                    <el-input disabled v-model="userInfo.accpriostr"></el-input>
                  </el-form-item>

                  <el-form-item
                    :label="$t('usercenter.Setlogo')"
                    style="margin-left: 2%; width: 32%"
                    v-if="
                      contrForPrionum == 3 ||
                      contrForPrionum == 4 ||
                      contrForPrionum == 5
                    "
                  >
                    <el-input
                      disabled
                      v-model="userInfo.logopriostr"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('companymanagement.item31')"
                    style="margin-left: 0; width: 32%"
                    v-if="contrForPrionum == 3 || contrForPrionum == 4"
                  >
                    <el-input disabled v-model="userInfo.validtime"></el-input>
                  </el-form-item>
                </el-form>
                <el-form
                  :label-position="labelPosition"
                  label-width="180px"
                  :model="userInfo"
                  style="display: flex; width: 100%"
                  v-if="contrForPrionum == 3 || contrForPrionum == 4"
                >
                  <el-form-item
                    :label="$t('companymanagement.item5')"
                    style="width: 32%; margin-left: 0; margin-right: 0"
                  >
                    <el-input disabled v-model="userInfo.projectnum"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('companymanagement.item6')"
                    style="margin-left: 2%; margin-right: 0; width: 32%"
                  >
                    <el-input disabled v-model="userInfo.mapnum"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('companymanagement.item7')"
                    style="width: 32%"
                  >
                    <el-input disabled v-model="userInfo.devnum"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <!-- 是否需要嵌入页面 - 暂时隐藏 -->
              <!-- <el-tab-pane
                :label="$t('usercenter.Customizedaccess')"
                v-if="contrForPrionum == 5"
              >
                <el-form
                  :label-position="labelPosition"
                  label-width="180px"
                  style="display: flex; width: 100%"
                >
                  <el-form-item
                    :label="$t('usercenter.Pagesembedded')"
                    style="width: 32%; margin-left: 0; margin-right: 0"
                  >
                    <el-switch
                      v-model="projectFlag"
                      :active-text="$t('floormanagement.open')"
                      :inactive-text="$t('floormanagement.close')"
                      @change="changeSwitch"
                    >
                    </el-switch>
                    <el-tooltip
                      class="item"
                      effect="light"
                      placement="right-start"
                      style="
                        position: absolute;
                        font-size: 130%;
                        top: 50%;
                        transform: translateY(-50%);
                        margin-left: 5px;
                      "
                    >
                      <div slot="content">
                        <p>
                          {{ $t("usercenter.Embedprompt1") }}
                        </p>
                        <p>
                          {{ $t("usercenter.Embedprompt2") }}
                        </p>
                        <p>
                          {{ $t("usercenter.Embedprompt3") }}
                        </p>
                        <p>
                          {{ $t("usercenter.Embedprompt4") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item
                    :label="$t('usercenter.key')"
                    style="margin-left: 2%; width: 32%"
                  >
                    <el-input v-model="key"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane> -->
            </el-tabs>

            <el-form
              :label-position="labelPosition"
              :model="userInfo"
              style="
                display: flex;
                margin-top: 2%;
                width: 100%;
                justify-content: center;
              "
            >
              <el-form-item>
                <el-button type="primary" class="edit" @click="editUser()">{{
                  $t("usercenter.editinfor")
                }}</el-button>
                <el-button
                  type="primary"
                  class="edit"
                  @click="resetUserKeys()"
                  >{{ $t("usercenter.editpwd") }}</el-button
                >

                <el-button
                  type="primary"
                  class="edit"
                  :disabled="deleteUser"
                  @click="userDele()"
                  v-if="!deleteUser"
                  >{{ $t("usercenter.cancel") }}</el-button
                >
                <el-button type="primary" class="out" @click="logout()">{{
                  $t("usercenter.signout")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 修改个人信息 -->
          <el-dialog
            :title="$t('usercenter.editinfor1')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="test-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              ref="editData"
              class="demo-ruleForm"
              label-width="120px"
              :rules="editRules"
              style="text-align: left; margin-left: 10px"
            >
              <el-form-item :label="$t('usercenter.user')" prop="">
                <el-input
                  disabled
                  v-model="editData.username"
                  :placeholder="$t('usercenter.userrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.admintel')" prop="">
                <el-input
                  v-model="editData.usertel"
                  :placeholder="$t('usercenter.admintelrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.usermail1')" prop="usermail">
                <el-input
                  v-model="editData.usermail"
                  :placeholder="$t('usercenter.usermail1rule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.company')" prop="">
                <el-input
                  disabled
                  v-model="editData.customername"
                  :placeholder="$t('usercenter.company1rule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.country')" prop="">
                <el-input
                  disabled
                  v-model="editData.country"
                  :placeholder="$t('usercenter.country1rule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.prio')">
                <el-select
                  :value="i8n == 'zh' ? editData.prio : editData.enprio"
                  clearable
                  filterable
                  :placeholder="$t('usercenter.priorule')"
                  disabled
                >
                  <el-option
                    v-for="item in prioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel('editData')">{{
                $t("usercenter.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("usercenter.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 修改密码 -->
          <el-dialog
            :title="$t('usercenter.editpwd')"
            width="30%"
            style="text-align: center"
            :visible.sync="passwordTpl"
            class="passward"
          >
            <el-form
              :model="passwordData"
              ref="passwordData"
              class="demo-ruleForm"
              label-width="150px"
              style="text-align: left; margin-left: 10px"
              :rules="passwordRules"
            >
              <el-form-item :label="$t('usercenter.oldpwd')" prop="managerkey">
                <el-input
                  show-password
                  v-model="passwordData.managerkey"
                  :placeholder="$t('usercenter.oldpwdrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.newpwd')" prop="passwordNew">
                <el-input
                  show-password
                  v-model="passwordData.passwordNew"
                  :placeholder="$t('usercenter.newpwdrule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usercenter.fixpwd')"
                prop="passwordAgain"
              >
                <el-input
                  show-password
                  v-model="passwordData.passwordAgain"
                  :placeholder="$t('usercenter.fixpwdrule')"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(passwordTpl = false), (loading = false)">{{
                $t("usercenter.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="passwordTrue('passwordData')"
                :loading="loading"
                >{{ $t("usercenter.confirm") }}</el-button
              >
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import System from "../../components/system/system";
import {
  updateUser,
  resetUserkey,
  loginout,
  removeUser,
  getUserCustomerOne,
  // updateProjectMosaic, // 定制访问功能暂时隐藏
} from "../../axios/api";
export default {
  components: {
    Menu,
    System,
  },
  name: "UserCenter",
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.firstPassword")));
      } else if (value !== this.passwordData.passwordNew) {
        callback(new Error(this.$t("tips.secondPassword")));
      } else {
        callback();
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
      }
    };
    return {
      // projectFlag: this.$store.state.intoProjectFlag, // 定制访问功能暂时隐藏
      // key: this.$store.state.intoProjectKey, // 定制访问功能暂时隐藏
      i8n: this.$store.state.i18n,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      intoProjectid: this.$store.state.intoProjectid,
      userName: this.$store.state.userInfo.username,
      contrForPrionum: this.$store.state.userInfo.prionum,
      delprio: this.$store.state.userInfo.delprio,
      userInfo: "",
      labelPosition: "right",
      loading: false,
      deleteUser: "",
      edit: false,
      editData: {
        username: "",
        usertel: "",
        usermail: "",
        prio: "",
        country: "",
        tenantid: "",
        customername: "",
        delprio: "",
        logintime: "",
        devnum: "",
        enprio: "",
      },
      prio: "",
      passwordTpl: false,
      passwordData: {
        managerkey: "",
        passwordNew: "",
        passwordAgain: "",
      },
      editRules: {
        usermail: [
          { required: true, message: this.$t("tips.emails"), trigger: "blur" },
          { validator: isEmail, trigger: "blur" },
        ],
      },
      passwordRules: {
        managerkey: [
          {
            required: true,
            message: this.$t("usercenter.oldpwdrule"),
            trigger: "blur",
          },
        ],
        passwordNew: [
          {
            required: true,
            message: this.$t("usercenter.newpwdrule"),
            trigger: "blur",
          },
          {
            // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
            // pattern:  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/,
            pattern: /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d~!@#$%^&*]{6,16}$/,
            message: this.$t("tips.passwords"),
          },
        ],
        passwordAgain: [
          {
            required: true,
            message: this.$t("usercenter.fixpwdrule"),
            trigger: "blur",
          },
          { validator: validatePass1, trigger: "blur" },
        ],
      },
      prioList: [
        {
          index: 1,
          value: this.$t("usercenter.systemadmin"),
        },
        {
          index: 2,
          value: this.$t("usercenter.systemadmin1"),
        },
        {
          index: 3,
          value: this.$t("usercenter.companyadmin"),
        },
        {
          index: 4,
          value: this.$t("usercenter.companyadmin1"),
        },
        {
          index: 5,
          value: this.$t("usercenter.companyuser"),
        },
        {
          index: 6,
          value: this.$t("usercenter.companyassets"),
        },
      ],
    };
  },
  methods: {
    // changeSwitch(e) { // 定制访问功能暂时隐藏
    //   var that = this;
    //   let data = {
    //     flag: e,
    //     username: this.userName,
    //     projectid: this.intoProjectid,
    //   };
    //   updateProjectMosaic(
    //     data,
    //     this.tenantkey_A,
    //     this.tenantid_A,
    //     this.userName
    //   ).then((res) => {
    //     if (res.code == 1001) {
    //       that.key = res.data.setkey;
    //       that.$store.commit("selectProjectKey", res.data.setkey);
    //       that.$store.commit("selectProjectFlag", e);
    //     } else {
    //       that.$message({
    //         message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
    //         type: "error",
    //       });
    //     }
    //   });
    // },
    //修改个人信息
    editUser() {
      // if (
      //   (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
      //   (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      // ) {
      //   this.$message({
      //     message: "没有权限！",
      //     type: "warning",
      //   });
      //   return;
      // }
      this.prio = this.userInfo.prio;

      this.editData.username = this.userInfo.username;
      this.editData.usertel = this.userInfo.usertel;
      this.editData.usermail = this.userInfo.usermail;
      this.editData.prio = this.userInfo.prio;
      this.editData.country = this.userInfo.country;
      this.editData.logintime = this.userInfo.logintime;
      this.editData.delprio = this.userInfo.delprio;
      this.editData.customername = this.userInfo.customername;
      this.editData.enprio = this.userInfo.enprio;
      this.edit = true;
    },
    editCancel(editData) {
      this.edit = false;
      this.loading = false;
      this.$refs[editData].resetFields();
    },
    editTrue(editData) {
      switch (this.editData.prio) {
        case "系统管理员":
          this.editData.prio = 1;
          break;
        case "系统子管理员":
          this.editData.prio = 2;
          break;
        case "企业管理员":
          this.editData.prio = 3;
          break;
        case "企业子管理员":
          this.editData.prio = 4;
          break;
        case "企业用户":
          this.editData.prio = 5;
          break;
        case "资产拥有者":
          this.editData.prio = 6;
          break;
        default:
          break;
      }
      switch (this.editData.enprio) {
        case "System admin":
          this.editData.prio = 1;
          break;
        case "System sub admin":
          this.editData.prio = 2;
          break;
        case "Enterprise admin":
          this.editData.prio = 3;
          break;
        case "Enterprise sub admin":
          this.editData.prio = 4;
          break;
        case "Enterprise user":
          this.editData.prio = 5;
          break;
        case "Enterprise asset owner":
          this.editData.prio = 6;
          break;
        default:
          break;
      }

      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateUser(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.getUserCustomerOnes(that.editData.username);
              that.$message({
                message: that.$t("usercenter.editsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs[editData].resetFields();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }
          });
        }
      });
    },

    //修改个人信息后更新个人信息
    getUserCustomerOnes(val) {
      var that = this;
      let data = {
        username: val,
      };
      getUserCustomerOne(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        that.$store.state.userInfo = res.data;
        that.userInfo = res.data;
      });
    },

    //修改密码
    resetUserKeys() {
      this.passwordData = {
        managerkey: "",
        passwordNew: "",
        passwordAgain: "",
      };
      this.passwordTpl = true;
      this.$refs.passwordData.resetFields();
    },
    passwordTrue(passwordData) {
      var that = this;
      if (!that.passwordData.managerkey) {
        that.$message({
          message: this.$t("usercenter.oldpwdrule"),
        });
        that.loading = false;
        return;
      }
      if (
        !that.passwordData.passwordNew ||
        !that.passwordData.passwordAgain ||
        that.passwordData.passwordNew != that.passwordData.passwordAgain
      ) {
        that.$message({
          message: this.$t("usercenter.Differentpwd"),
        });
        that.loading = false;
        return;
      }
      if (that.passwordData.passwordNew == that.passwordData.managerkey) {
        that.$message({
          message: this.$t("usercenter.Differentpwd1"),
        });
        that.loading = false;
        return;
      } else {
        let para = {
          username: that.userInfo.username,
          newkey: that.passwordData.passwordNew,
          managerkey: that.passwordData.managerkey,
        };
        this.loading = true;
        this.$refs.passwordData.validate((valid) => {
          if (valid) {
            resetUserkey(
              para,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.passwordTpl = false;
                that.$message({
                  message: that.$t("usercenter.editsuccess"),
                  type: "success",
                });
                that.loading = false;
                that.$refs[passwordData].resetFields();
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
                that.loading = false;
              }
            });
          }
        });
      }
    },

    //退出登录
    logout() {
      this.$confirm(this.$t("usercenter.islogout"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      })
        .then(() => {
          var that = this;
          let para = {};
          loginout(para, this.tenantkey_A, this.tenantid_A, this.userName).then(
            (res) => {
              if (res.code == 1001) {
                this.$store.commit("setuserInfo", "");
                this.$store.state.projectid = "";
                this.$store.commit("resetRoutes");
                that.$router.push("/login");
                that.$message({
                  message: that.$t("usercenter.logout"),
                  type: "success",
                });
                // 清除页面上所有的SOS告警
                let sosList = this.$store.state.sosList;
                for (let i in sosList) {
                  sosList[i].value.close();
                }
                sessionStorage.clear();
                window.localStorage.clear();
                window.location.reload();
                // that.$store.commit("changeGoNext", false);
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            message: this.$t("usercenter.cancel"),
            type: "info",
          });
        });
    },

    //注销账号
    userDele() {
      this.$prompt(this.$t("usercenter.password"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
        inputType: "password",
      }).then(({ value }) => {
        let data = {
          username: this.userInfo.username,
          userkey: value,
        };
        var that = this;
        removeUser(
          JSON.stringify(data),
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$router.push("/login");
            that.$message({
              message: that.$t("usercenter.logoutsuccess"),
              type: "success",
            });
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
    this.userInfo = this.$store.state.userInfo;
    if (
      this.$store.state.userInfo.prionum == 2 ||
      this.$store.state.userInfo.prionum == 4
    ) {
      this.deleteUser = false;
    } else {
      this.deleteUser = true;
    }
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
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

.user_content {
  margin-top: 4%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: baseline;
}
</style>
