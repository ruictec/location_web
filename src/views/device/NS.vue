<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>

    <div class="content">
      <el-container class="asi">
        <el-aside><Devicemanagement /></el-aside>
        <el-main>
          <div class="device_input">
            <el-form
              class="demo-form-inline"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item
                :label="$t('warning.state')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.status"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in statuList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
         
              <el-form-item style="margin-left: 2%">
                <el-button type="primary" class="query" @click="searchInfo()">
                  {{ $t("nsconfig.search") }}</el-button
                ><el-button type="primary" class="reset" @click="clearBtn()">
                  {{ $t("nsconfig.reset") }}</el-button
                >
                <el-button
                  type="primary"
                  class="add"
                  @click="addNS()"
                  v-if="contrForPrionum == 1"
                  >{{ $t("ns.addns") }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- NS 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
              ><el-table-column
                property="id"
                label="ID"
                show-overflow-tooltip
                min-width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                property="name"
                :label="$t('ns.name')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="levelstr"
                :label="$t('ns.Grade')"
                show-overflow-tooltip
                min-width="47"
                align="center"
              ></el-table-column>
              <el-table-column
                property="domain"
                :label="$t('ns.domain')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="ip"
                label="IP"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="port"
                :label="$t('ns.port')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="statusstr"
                :label="$t('terminal.state')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="statustime"
                :label="$t('terminal.Statusupdatetime')"
                show-overflow-tooltip
                min-width="110"
                align="center"
                :formatter="formatDateStatustime"
              ></el-table-column>
              <el-table-column
                property="certstr"
                :label="$t('ns.cert1')"
                show-overflow-tooltip
                min-width="30"
                align="center"
              ></el-table-column>
              <el-table-column
                property="usrname"
                :label="$t('ns.usrname')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="token"
                :label="$t('ns.password')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>

              <el-table-column
                property="memo"
                :label="$t('ns.memo')"
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('ns.operate')"
                width="80"
                align="center"
                v-if="contrForPrionum == 1"
              >
                <template slot-scope="scope">
                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('staff.operate')"
                      placement="top"
                    >
                      <el-button type="primary" class="icon_button">
                        <img src="../../../static/control.png" />
                      </el-button>
                    </el-tooltip>
                    <el-dropdown-menu
                      slot="dropdown"
                      style="background-color: rgb(219, 222, 231)"
                      class="selects"
                    >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                      >
                        <el-button
                          size="mini"
                          class="edits"
                          @click="nsEdit(scope.$index, tableData)"
                          v-if="contrForPrionum == 1"
                          >{{ $t("ns.edit") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                      >
                        <el-button
                          size="mini"
                          class="dels1"
                          @click="nsDele(scope.$index)"
                          v-if="contrForPrionum == 1"
                          >{{ $t("ns.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <!--分页效果-->
            <div
              class="block"
              style="text-align: center; width: 100%; margin-top: 1%"
            >
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-size="20"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 添加NS -->
          <el-dialog
            :title="$t('ns.addns1')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="130px"
              ref="addData"
              style="text-align: left"
              :rules="addRules"
            >
              <el-form-item :label="$t('ns.Name')" prop="name">
                <el-input
                  v-model="addData.name"
                  :placeholder="$t('ns.text')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.Domainname')" prop="domain">
                <el-input
                  v-model="addData.domain"
                  :placeholder="$t('ns.addnsrules')"
                ></el-input>
              </el-form-item>
              <el-form-item label="IP：" prop="ip">
                <el-input
                  v-model="addData.ip"
                  :placeholder="$t('ns.addnsrules')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.port1')" prop="port">
                <el-input
                  v-model="addData.port"
                  :placeholder="$t('ns.addnsrules1')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.usrname1')" prop="usrname">
                <el-input
                  v-model="addData.usrname"
                  :placeholder="$t('ns.addnsrules3')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.password1')" prop="token">
                <el-input
                  v-model="addData.token"
                  :placeholder="$t('ns.addnsrules31')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.usermail1')" prop="">
                <el-input
                  v-model="addData.emails"
                  :placeholder="$t('register.enterEmail')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.cert')" prop="">
                <el-select
                  v-model="addData.cert"
                  clearable
                  :placeholder="$t('warning.text3')"
                >
                  <el-option
                    v-for="item in certList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('ns.memo1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel('addData')">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
              >
                {{ $t("terminal.confirm") }}
              </el-button>
            </div>
          </el-dialog>

          <!-- 编辑Ns -->
          <el-dialog
            :title="$t('ns.editns')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              ref="editData"
              class="demo-ruleForm"
              label-width="130px"
              style="text-align: left; margin-left: 10px"
              :rules="addRules"
            >
              <el-form-item :label="$t('ns.Name')" prop="name">
                <el-input
                  v-model="editData.name"
                  :placeholder="$t('ns.text')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.Domainname')" prop="domain">
                <el-input
                  v-model="editData.domain"
                  :placeholder="$t('ns.addnsrules')"
                ></el-input>
              </el-form-item>
              <el-form-item label="IP：" prop="ip">
                <el-input
                  v-model="editData.ip"
                  :placeholder="$t('ns.addnsrules')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.port1')" prop="port">
                <el-input
                  v-model="editData.port"
                  :placeholder="$t('ns.addnsrules1')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.usrname1')" prop="usrname">
                <el-input
                  v-model="editData.usrname"
                  :placeholder="$t('ns.addnsrules3')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.password1')" prop="token">
                <el-input
                  v-model="editData.token"
                  :placeholder="$t('ns.addnsrules31')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usercenter.usermail1')" prop="">
                <el-input
                  v-model="editData.emails"
                  :placeholder="$t('register.enterEmail')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('ns.cert')" prop="">
                <el-select
                  v-model="editData.cert"
                  clearable
                  :placeholder="$t('warning.text3')"
                >
                  <el-option
                    v-for="item in certList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('ns.memo1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel('editData')">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
              >
                {{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Devicemanagement from "../../components/devicemanagement/devicemanagement";
import { addNs, getNsList, updateNs, delNs } from "../../axios/api";
export default {
  components: {
    Menu,
    Devicemanagement,
    basecard,
  },
  name: "NS",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      loading: false,
      searchList: {
        status: "",
        page: 1,
        count: 20,
      },
      pageCount: 20,
      tableData: [],
      currentPage1: 1,
      total: 0,
      add: false,
      addData: {
        domain: "",
        port: "",
        usrname: "",
        token: "",
        memo: "",
        ip: "",
        name: "",
        emails: "",
        cert: "",
      },
      certList: [
        {
          index: 1,
          value: "Yes",
        },
        {
          index: 2,
          value: "No",
        },
      ],
      statuList: [
        {
          index: 1,
          value: this.$t("home.Online"),
        },
        {
          index: 2,
          value: this.$t("home.Offline"),
        },
      ],
      addRules: {
        name: [
          {
            required: true,
            message: this.$t("ns.text"),
            trigger: "blur",
          },
        ],
        port: [
          {
            required: true,
            message: this.$t("ns.addnsrules1"),
            trigger: "blur",
          },
        ],
        usrname: [
          {
            required: true,
            message: this.$t("ns.addnsrules3"),
            trigger: "blur",
          },
        ],
        token: [
          {
            required: true,
            message: this.$t("ns.text1"),
            trigger: "blur",
          },
        ],
        ip: [
          {
            required: true,
            message: this.$t("ns.text2"),
            trigger: "blur",
          },
        ],
        domain: [
          {
            required: true,
            message: this.$t("ns.text3"),
            trigger: "blur",
          },
        ],
      },
      edit: false,
      editData: {
        domain: "",
        port: "",
        usrname: "",
        token: "",
        memo: "",
        id: "",
        ip: "",
        name: "",
        emails: "",
        cert: "",
      },
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
    // 时间转化
    formatDateStatustime(row, column) {
      if (row.statustime == null || row.statustime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.statustime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getNsLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getNsLists();
    },
    searchInfo() {
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      getNsList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          if (that.total > 0) {
            that.$message({
              message: that.$t("nsconfig.searchsuccess"),
              type: "success",
            });
          } else if (that.total == 0) {
            that.$message({
              message: that.$t("nsconfig.nodata"),
              type: "warning",
            });
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    clearBtn() {
      this.currentPage1 = 1;
      this.searchList = {
        status: "",
        page: 1,
        count: 20,
      };
      this.getNsLists();
    },
    // 添加NS
    addNS() {
      this.add = true;
      this.addData = {
        domain: "",
        port: "",
        usrname: "",
        token: "",
        memo: "",
        ip: "",
        name: "",
        emails: "",
        cert: "",
      };
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          this.loading = true;
          addNs(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getNsLists();
              that.$message({
                message: that.$t("ns.addsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs[addData].resetFields();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    },

    //获取NS信息
    getNsLists() {
      var that = this;
      getNsList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
        }
      });
    },

    //编辑Ns信息
    nsEdit(index) {
      this.editData.domain = this.tableData[index].domain;
      this.editData.port = this.tableData[index].port;
      this.editData.usrname = this.tableData[index].usrname;
      this.editData.token = this.tableData[index].token;
      this.editData.memo = this.tableData[index].memo;
      this.editData.id = this.tableData[index].id;
      this.editData.ip = this.tableData[index].ip;
      this.editData.name = this.tableData[index].name;
      this.editData.emails = this.tableData[index].emails;
      this.editData.cert = this.tableData[index].cert;
      this.edit = true;
    },
    editCancel(editData) {
      this.edit = false;
      this.loading = false;
      this.$refs[editData].resetFields();
    },
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateNs(
            that.editData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              // that.searchList.page = 1;
              that.getNsLists();
              that.$message({
                message: that.$t("ns.editsuccess"),
                type: "success",
              });
              that.loading = false;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    },

    //删除Ns信息
    nsDele(index) {
      var that = this;
      this.$confirm(this.$t("ns.deletemsg"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          id: that.tableData[index].id,
          domain: that.tableData[index].domain,
        };
        delNs(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.getNsLists();
              that.$message({
                message: that.$t("ns.deletesuccess"),
                type: "success",
              });
            } else {
              $message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          }
        );
      });
    },
  },
  beforeMount() {
    this.getNsLists();
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
      );
      Object.assign(
        this.$data.statuList,
        this.$options.data.call(this).statuList
      );
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
.selects button {
  width: 100%;
  text-align: left;
}
/* 按钮改变颜色 */
.edits:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.dels1:hover {
  background-color: rgb(196, 27, 27);
  color: white;
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
.add,
.query,
.reset {
  padding: 8px 12px !important;
}
.icon_button {
  padding: 2px 16px !important;
}
</style>
