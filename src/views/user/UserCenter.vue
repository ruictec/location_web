<template>
  <div :class="contrForPrionum != 5 ? 'home device-page admin-page' : 'device-page'" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><System /></el-aside>
        <el-main>
          <!-- 隐藏原生文件控件，由 updateCode() 程序化触发；勿用 display:none，否则 .click() 可能无法打开选择框 -->
          <div class="usercenter-hidden-file-input">
            <input
              id="articleImageFile"
              name="excelFile"
              type="file"
              class="x_file"
              accept=".txt"
              @change="importTxt($event)"
            />
          </div>
          <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
          </el-breadcrumb> -->
          <div class="user_content page-panel">
            <div class="usercenter-profile" v-if="contrForPrionum == 5">
              <div class="usercenter-avatar">{{ avatarText }}</div>
              <div class="usercenter-profile-main">
                <div class="usercenter-profile-name">
                  {{ userInfo.username }}
                </div>
                <div class="usercenter-profile-meta">
                  <span class="usercenter-profile-tag">{{
                    i8n == "zh" ? userInfo.prio : userInfo.enprio
                  }}</span>
                  <span v-if="userInfo.customername">{{
                    userInfo.customername
                  }}</span>
                  <span v-if="userInfo.usermail">{{ userInfo.usermail }}</span>
                </div>
              </div>
            </div>
            <el-tabs class="usercenter-tabs" style="width: 100%">
              <!-- 用户资料 -->
              <el-tab-pane :label="$t('usercenter.Userdata')">
                <el-form
                  class="usercenter-form"
                  :label-position="formLabelPosition"
                  label-width="120px"
                  :model="userInfo"
                >
                  <el-form-item
                    :label="$t('usercenter.user')"
                    class="usercenter-field"
                  >
                    <el-input disabled v-model="userInfo.username"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.admintel')"
                    class="usercenter-field"
                  >
                    <el-input disabled v-model="userInfo.usertel"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.usermail1')"
                    class="usercenter-field"
                  >
                    <el-input disabled v-model="userInfo.usermail"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.company')"
                    class="usercenter-field"
                  >
                    <el-input
                      disabled
                      v-model="userInfo.customername"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.country')"
                    class="usercenter-field"
                  >
                    <el-input disabled v-model="userInfo.country"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('usercenter.prio')"
                    class="usercenter-field"
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
                  class="usercenter-form is-auth"
                  :label-position="formLabelPosition"
                  label-width="140px"
                  :model="userInfo"
                >
                  <el-form-item
                    :label="$t('usercenter.Accessrights')"
                    class="usercenter-field"
                  >
                    <el-input disabled v-model="userInfo.accpriostr"></el-input>
                  </el-form-item>

                  <el-form-item
                    :label="$t('usercenter.Setlogo')"
                    class="usercenter-field"
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
                    class="usercenter-field"
                    v-if="contrForPrionum == 3 || contrForPrionum == 4"
                  >
                    <el-input disabled v-model="userInfo.validtime"></el-input>
                  </el-form-item>
                  <template v-if="contrForPrionum == 3 || contrForPrionum == 4">
                    <el-form-item
                      :label="$t('companymanagement.item5')"
                      class="usercenter-field"
                    >
                      <el-input
                        disabled
                        v-model="userInfo.projectnum"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      :label="$t('companymanagement.item6')"
                      class="usercenter-field"
                    >
                      <el-input disabled v-model="userInfo.mapnum"></el-input>
                    </el-form-item>
                    <el-form-item
                      :label="$t('companymanagement.item7')"
                      class="usercenter-field"
                    >
                      <el-input disabled v-model="userInfo.devnum"></el-input>
                    </el-form-item>
                  </template>
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
                      <template #content><div>
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
                      </div></template>
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

            <div class="usercenter-actions">
              <el-button type="primary" class="edit" @click="editUser()">{{
                $t("usercenter.editinfor")
              }}</el-button>
              <el-button type="primary" class="edit" @click="updateCode()">{{
                $t("usercenter.Updatelicensekey")
              }}</el-button>
              <el-button
                type="primary"
                class="edit"
                @click="resetUserKeys()"
                >{{ $t("usercenter.editpwd") }}</el-button>
              <el-button
                type="primary"
                class="edit"
                :disabled="deleteUser"
                @click="userDele()"
                v-if="!deleteUser"
                >{{ $t("usercenter.cancel") }}</el-button>
              <el-button type="primary" class="out" @click="logout()">{{
                $t("usercenter.signout")
              }}</el-button>
            </div>
          </div>

          <!-- 修改个人信息 -->
          <el-dialog
            :title="$t('usercenter.editinfor1')"
            v-model="edit"
            class="edit device-dialog"
            width="480px"
            align-center
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              ref="editData"
              class="demo-ruleForm usercenter-dialog-form"
              label-width="auto"
              :rules="editRules"
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
                  :model-value="i8n == 'zh' ? editData.prio : editData.enprio"
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

            <template #footer><div class="dialog-footer">
              <el-button @click="editCancel('editData')">{{
                $t("usercenter.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("usercenter.confirm") }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 修改密码 -->
          <el-dialog
            :title="$t('usercenter.editpwd')"
            width="480px"
            align-center
            v-model="passwordTpl"
            class="passward device-dialog"
          >
            <el-form
              :model="passwordData"
              ref="passwordData"
              class="demo-ruleForm usercenter-dialog-form"
              label-width="auto"
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
            <template #footer><div class="dialog-footer">
              <el-button @click="(passwordTpl = false), (loading = false)">{{
                $t("usercenter.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="passwordTrue('passwordData')"
                :loading="loading"
                >{{ $t("usercenter.confirm") }}</el-button>
            </div></template>
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
import { notifyAuthEvent } from "../../utils/authSession";
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
  computed: {
    formLabelPosition() {
      return this.contrForPrionum == 5 ? "top" : this.labelPosition;
    },
    avatarText() {
      const name = (this.userInfo && this.userInfo.username) || "";
      return name.charAt(0).toUpperCase();
    },
  },
  methods: {
    // 更新注册码
    updateCode() {
      document.getElementById("articleImageFile").click(); //触发importExcels
    },
    importTxt(e) {
      const input = e.target;
      const file = input.files && input.files[0];
      if (!file) {
        return;
      }
      var that = this;
      let formData = new FormData();
      formData.append("file", file);
      this.$axios
        .post("service/updateRegisterFile", formData)
        .then((response) => {
          if (response.data.code === 1001) {
            that.$message({
              message: that.$t("usercenter.updateSuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message:
                that.$store.state.i18n == "zh"
                  ? response.data.msg
                  : response.data.enMsg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.$message({
            message:
              that.$store.state.i18n == "zh"
                ? error.data.msg
                : error.data.enMsg,
            type: "error",
          });
        })
        .finally(() => {
          // 清空以便下次可再选同一文件并触发 change（否则 value 不变浏览器不派发 change）
          input.value = "";
        });
      // updateRegisterMapFile
    },
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
        customClass: "device-message-box",
        confirmButtonClass: "device-message-confirm",
        cancelButtonClass: "device-message-cancel",
        roundButton: false,
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
                notifyAuthEvent("logout", { username: that.userName });
                sessionStorage.clear();
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
        customClass: "device-message-box",
        confirmButtonClass: "device-message-confirm",
        cancelButtonClass: "device-message-cancel",
        roundButton: false,
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
.usercenter-hidden-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

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
  align-items: stretch;
  width: 100%;
  height: auto;
  box-sizing: border-box;
}

.usercenter-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 20px;
  row-gap: 4px;
  width: 100%;
  margin: 0;
}

.usercenter-form.is-auth {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.usercenter-field {
  margin-right: 0 !important;
  margin-bottom: 14px !important;
  width: 100% !important;
}

.usercenter-field :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 1;
  min-width: 0;
}

.usercenter-field :deep(.el-input),
.usercenter-field :deep(.el-select) {
  width: 100%;
}

.usercenter-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 0;
  padding: 14px 18px 16px;
  box-sizing: border-box;
  border-top: 1px solid #eef2f7;
  background: #f8fafc;
}

.usercenter-actions > .el-button {
  margin: 0 !important;
}

.usercenter-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin: 0;
  padding: 20px 24px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);
  border-bottom: 1px solid #e0ecff;
}

.usercenter-avatar {
  flex: 0 0 56px;
  width: 56px;
  height: 56px;
  margin: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #22d3ee, #2f7bff);
  box-shadow: 0 6px 16px rgba(47, 123, 255, 0.25);
}

.usercenter-profile-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  margin: 0;
}

.usercenter-profile-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.usercenter-profile-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.usercenter-profile-meta > span {
  margin: 0;
}

.usercenter-profile-tag {
  padding: 2px 10px;
  border-radius: 999px;
  color: #2f7bff;
  font-weight: 600;
  background: rgba(47, 123, 255, 0.1);
}
</style>

<style>
/* 企业用户个人中心：与 device-page 卡片体系对齐（非 scoped，覆盖 Element tabs） */
.device-page .user_content.page-panel {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding: 0 !important;
  overflow: hidden;
  height: auto !important;
  max-width: 100%;
}

.device-page .usercenter-tabs.el-tabs {
  width: 100%;
}

.device-page .usercenter-tabs > .el-tabs__header {
  margin: 0;
  padding: 0 8px;
  background: #f8fafc;
  border-bottom: 1px solid #eef2f7;
}

.device-page .usercenter-tabs > .el-tabs__header .el-tabs__nav-wrap::after {
  display: none;
}

.device-page .usercenter-tabs > .el-tabs__header .el-tabs__item {
  height: 44px;
  line-height: 44px;
  font-weight: 600;
  color: #64748b;
  padding: 0 16px !important;
}

.device-page .usercenter-tabs > .el-tabs__header .el-tabs__item.is-active {
  color: #2f7bff;
}

.device-page .usercenter-tabs > .el-tabs__header .el-tabs__active-bar {
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(90deg, #22d3ee, #2f7bff);
}

.device-page .usercenter-tabs > .el-tabs__content {
  padding: 18px 20px 8px;
}

.device-page .user_content.page-panel {
  text-align: left;
}

.device-page .usercenter-field.el-form-item--label-top .el-form-item__label,
.device-page .usercenter-form .el-form-item__label {
  display: block;
  width: 100%;
  text-align: left !important;
  justify-content: flex-start;
  margin: 0 0 6px;
  padding: 0;
  line-height: 20px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
}

.device-page .usercenter-field .el-input.is-disabled .el-input__wrapper {
  border-radius: 8px;
  background: #f8fafc;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}

.device-page .usercenter-actions .el-button--primary.edit,
.device-page .usercenter-actions .el-button--primary.out {
  border: none !important;
  border-radius: 8px !important;
  font-weight: 600;
  background: linear-gradient(135deg, #22d3ee, #2f7bff) !important;
  box-shadow: 0 4px 10px rgba(47, 123, 255, 0.28);
}

.device-page .usercenter-actions .el-button--primary.out {
  background: linear-gradient(135deg, #94a3b8, #64748b) !important;
  box-shadow: 0 4px 10px rgba(100, 116, 139, 0.25);
}

.el-dialog.device-dialog .usercenter-dialog-form {
  text-align: left;
  padding: 4px 8px 0;
}

.el-dialog.device-dialog .usercenter-dialog-form .el-form-item__label {
  white-space: nowrap;
}

.device-page .usercenter-actions .el-button--primary:hover {
  filter: brightness(1.05);
}

@media (max-width: 1100px) {
  .device-page .usercenter-form {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 720px) {
  .device-page .usercenter-form,
  .device-page .usercenter-form.is-auth {
    grid-template-columns: 1fr !important;
  }
}
</style>
