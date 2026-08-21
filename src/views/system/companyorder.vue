<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><System /></el-aside>
        <el-main>
          <div class="user_input terminal-filter-flow" :class="filterLangClass">
          <el-form
            class="demo-form-inline terminal-filter-form"
            :model="searchList"
          >
            <el-form-item
              :label="$t('myorder.questioncategory')"
             class="terminal-filter-item">
              <el-select
                v-model="searchList.type"
                clearable
                filterable
                :placeholder="$t('terminal.choose')"
              >
                <el-option
                  v-for="item in questionTypeList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('myorder.priority')"
             class="terminal-filter-item">
              <el-select
                v-model="searchList.priority"
                clearable
                filterable
                :placeholder="$t('terminal.choose')"
              >
                <el-option
                  v-for="item in priorityList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('myorder.Workorderstatus')"
             class="terminal-filter-item">
              <el-select
                v-model="searchList.status"
                clearable
                filterable
                :placeholder="$t('terminal.choose')"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('companyorder.Company')"
             class="terminal-filter-item">
              <el-select
                v-model="searchList.tenantid"
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

            <el-form-item class="terminal-toolbar-item">
              <el-button type="primary" class="query" @click="searchInfo()">{{
                $t("heartbeat.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("heartbeat.reset")
              }}</el-button>
            </el-form-item>
          </el-form>
          </div>
          <div class="content_user">
            <!-- 展示 -->
            <el-table
              ref="multipleTable"
              :data="orderData"
              @selection-change="handleSelectionChange"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>

              <el-table-column
                property="id"
                :label="$t('myorderde.workordernumber')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'typestr' : 'entype'"
                :label="$t('myorderde.questioncategory')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="title"
                :label="$t('myorderde.title')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'prioritystr' : 'enpriority'"
                :label="$t('myorderde.priority')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>

              <el-table-column
                property="customername"
                :label="$t('myorderde.company')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="creatime"
                :label="$t('myorderde.submissiontime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDate"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'statustr' : 'enstatus'"
                :label="$t('companyorder.state')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>

              <el-table-column
                property="lastime"
                :label="$t('companyorder.Replytime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDataLast"
              ></el-table-column>
              <el-table-column
                :label="$t('downlink.operate')"
                align="center"
                fixed="right"
                min-width="100"
              >
                <template #default="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('myorder.Details')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="small"
                      class="icon_button"
                      @click="orderDetail(scope.$index, tableData)"
                      ><img src="../../../static/details.png"
                    /></el-button>
                  </el-tooltip>
                  <el-dropdown
                    size="small"
                    type="primary"
                    trigger="click"
                    class="operation"
                    v-if="scope.row.status != 4"
                  >
                    <span class="el-dropdown-link">
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
                    </span>
<template #dropdown><el-dropdown-menu
                     
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
                          size="small"
                          class="edits"
                          v-if="scope.row.status == 2 || scope.row.status == 3"
                          @click="editTer(scope.$index, tableData)"
                          >{{ $t("companyorder.handle") }}</el-button></el-dropdown-item>
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                      >
                        <el-button
                          size="small"
                          class="dels1"
                          v-if="scope.row.status == 5"
                          @click="delOrder(scope.$index, tableData)"
                          >{{ $t("downlink.delete") }}</el-button></el-dropdown-item>
                    </el-dropdown-menu></template>
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
                v-model:current-page="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                v-model:page-size="pageCount"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 处理工单 -->
          <el-dialog
            :title="$t('companyorder.Processworkorder')"
            width="30%"
            v-model="edit"
            style="text-align: center"
          >
            <el-form
              :model="editData"
              label-width="120px"
              ref="editData"
              style="text-align: left"
              :rules="addRules"
              class="order_detail_form"
            >
              <el-form-item :label="$t('myorder.Tickettitle')">
                <el-input v-model="editData.title" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('myorder.questioncategory')">
                <el-select
                  v-model="editData.type"
                  clearable
                  filterable
                  disabled
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in questionTypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('myorder.priority')">
                <el-select
                  v-model="editData.priority"
                  clearable
                  filterable
                  disabled
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in priorityList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('myorder.ProblemDescription')">
                <el-input
                  type="textarea"
                  maxlength="255"
                  show-word-limit
                  v-model="editData.details"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('myorder.Appendix')">
                <el-upload
                  class="upload-demo"
                  ref="uploads"
                  :action="editfilePath"
                  :data="editdataForFile"
                  :on-remove="edithandleRemove"
                  :file-list="editfileList"
                  :on-change="edithandleChange"
                  :http-request="edituploadFile"
                  :auto-upload="false"
                  :limit="5"
                  :on-success="editFileSuccess"
                  disabled
                >
                </el-upload>
              </el-form-item>
              <el-form-item :label="$t('myorder.Workorderstatus')">
                <el-select
                  v-model="editData.status"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in editstatusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer><div class="dialog-footer">
              <el-button @click="edit = false">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="editTrue('editData')">{{
                $t("terminal.confirm")
              }}</el-button>
            </div></template></el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import host from "../../host";
import Menu from "../../components/menu/Menu";
import basecard from "../../components/card/base-card";
import {
  getQuestion,
  delQuestion,
  updateQuestionStatus,
  delFile,
  getCustomerName,
} from "../../axios/api";
import System from "../../components/system/system.vue";
export default {
  components: {
    Menu,
    basecard,
    System,
  },

  Systemname: "CompanyOrder",
  data() {
    return {
      i8n: this.$store.state.i18n,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tableData: [],
      orderData: [],
      tenantidData: [],
      pageCount: 20,
      searchList: {
        type: "",
        superid: this.$store.state.userInfo.tenantid,
        tenantid: "",
        priority: "",
        status: "",
        beginstatus: "1",
        page: 1,
        count: 20,
      },
      currentPage1: 1,
      total: 0,
      editdataForFile: {},

      editfilePath: host.host + "user/updateQuestionMapFile",
      editfileData: "", //文件上传数据（多文件合一）
      editfileList: [], //upload多文件数组
      uploadData: "",
      uploadeditData: "",
      addRules: {},
      haveFile: false,
      edit: false,
      editData: {
        id: "",
        title: "",
        type: "",
        priority: "",
        details: "",
        status: "",
        filename: [],
      },
      questionTypeList: [
        {
          index: 1,
          value: this.$t("myorderde.Loginregistration"),
        },
        {
          index: 2,
          value: this.$t("myorderde.devicemanagement"),
        },
        {
          index: 3,
          value: this.$t("myorderde.usermanagement"),
        },
        {
          index: 4,
          value: this.$t("myorderde.projectmanagement"),
        },
        {
          index: 5,
          value: this.$t("myorderde.datamanagement"),
        },
        {
          index: 6,
          value: this.$t("myorderde.alarmmanagement"),
        },
        {
          index: 10,
          value: this.$t("myorderde.PersonalCenter"),
        },

        {
          index: 11,
          value: this.$t("myorderde.other"),
        },
      ],
      priorityList: [
        {
          index: 1,
          value: this.$t("myorderde.important"),
        },
        {
          index: 2,
          value: this.$t("myorderde.commonly"),
        },
      ],
      statusList: [
        {
          index: 2,
          value: this.$t("myorderde.Pending"),
        },

        {
          index: 3,
          value: this.$t("myorderde.Processing"),
        },
        {
          index: 4,
          value: this.$t("myorderde.Processed"),
        },
        {
          index: 5,
          value: this.$t("myorderde.Closed"),
        },
      ],
      editstatusList: [],

      deleBtnDis: false,
      deleId: "",
      filename: "",
      del: false,
      delData: [],
      multipleSelection: [],
    };
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getQuestions();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getQuestions();
    },
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
    formatDate(row, column) {
      if (row.creatime == null || row.creatime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.creatime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDataLast(row, column) {
      if (row.lastime == null || row.creatime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.lastime) * 1000);
      let Y = date.getFullYear() + "-";
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
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

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //获取操作记录信息
    getQuestions() {
      var that = this;
      getQuestion(
        that.searchList,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.orderData = res.data.list;
          that.total = res.data.size;
        }
      });
    },

    //查询操作记录信息
    searchInfo() {
      var that = this;

      this.searchList.page = 1;

      // this.searchList.beginstatus = "";
      this.currentPage1 = 1;

      getQuestion(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.orderData = res.data.list;
          that.total = res.data.size;
          if (res.data.list.length > 0) {
            that.$message({
              message: that.$t("downlink.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("downlink.nodata"),
              type: "success",
            });
          }
        }
        this.searchList.count = 20;
      });
    },

    //重置搜索输入
    clearBtn() {
      this.searchList = {
        type: "",
        superid: this.$store.state.userInfo.tenantid,
        tenantid: "",
        priority: "",
        status: "",
        page: 1,
        count: 20,
        beginstatus: "1",
      };

      this.currentPage1 = 1;
      this.getQuestions();
    },

    edithandleRemove(file, fileList) {
      this.editfileList = fileList;
      let filename = [];
      for (let i = 0; i < fileList.length; i++) {
        filename.push(fileList[i].name);
      }
      let data = {
        delname: file.name,
        id: this.editData.id,
        filename: filename.toString(),
      };
      delFile(
        JSON.stringify(data),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {});

      if (fileList.length == 0) {
        this.haveFile = false;
      } else {
        this.haveFile = true;
      }
    },

    edithandlePreview(file) {
      var a = document.createElement("a");
      a.setAttribute("download", file.name);
      a.setAttribute("target", "_blank");
      a.setAttribute("href", file.url);
      var event = new MouseEvent("click");
      a.dispatchEvent(event);
    },
    detailhandlePreview(file) {
      var a = document.createElement("a");
      a.setAttribute("download", file.name);
      a.setAttribute("target", "_blank");
      a.setAttribute("href", file.url);
      var event = new MouseEvent("click");
      a.dispatchEvent(event);
    },

    edithandleChange(file, fileList) {
      this.editfileList = fileList;
      if (fileList.length > 0) {
        this.haveFile = true;
      }
    },

    editFileSuccess(response, file, fileList) {
      file = "";
      fileList = [];
      this.$refs.uploads.clearFiles();
    },

    //点击删除工单
    delOrder(index) {
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t("staffmanagement.permissiondelete"),
          type: "warning",
        });
        return;
      }
      if (this.orderData[index].status != 5) {
        this.$message({
          message: this.$t("companyorder.tet"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("myorderde.deletethejob"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        this.deleId = this.orderData[index].id;
        this.filename = this.orderData[index].filename;
        this.deleTrue();
      });
    },
    deleTrue() {
      let data = {
        id: this.deleId,
        filename: this.filename,
      };
      var that = this;
      delQuestion(
        JSON.stringify(data),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.getQuestions();
          that.$message({
            message: that.$t("downlink.deletesuccess"),
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

    //处理工单
    editTer(index) {
      this.editfileList = [];
      this.haveFile = false;
      if (this.orderData[index].filename) {
        let filenames = this.orderData[index].filename.split(",");
        for (let i = 0; i < filenames.length; i++) {
          this.editfileList.push({
            url: host.host + "question/" + filenames[i],
            name: filenames[i],
          });
        }
      }
      this.editData.id = this.orderData[index].id;
      this.editData.title = this.orderData[index].title;
      this.editData.type = this.orderData[index].type;
      this.editData.priority = this.orderData[index].priority;
      this.editData.details = this.orderData[index].details;
      this.editData.filename = [];
      if (this.orderData[index].status == 2) {
        this.editstatusList = [
          {
            index: 3,
            value: this.$t("myorderde.Processing"),
          },
          {
            index: 4,
            value: this.$t("myorderde.Processed"),
          },
        ];
      } else if (this.orderData[index].status == 3) {
        this.editstatusList = [
          {
            index: 3,
            value: this.$t("myorderde.Processed"),
          },
        ];
      }
      this.edit = true;
    },

    //处理工单
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          let data = {
            id: that.editData.id,
            status: that.editData.status,
          };
          updateQuestionStatus(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("mapmanagement.Submittedsuccessfully"),
                type: "success",
              });
              that.getQuestions();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
            that.edit = false;
          });
        }
      });
    },

    edituploadFile(file) {
      this.editfileData.append("file", file.file);
    },
    //多个文件调用一次接口
    editsubmitUpload() {
      var that = this;
      let editfileData = this.uploadeditData.fileData;
      this.editfileData = new FormData();
      this.$refs.uploads.submit();
      this.editfileData.append("id", this.editData.id);
      this.editfileData.append("title", this.editData.title);
      this.editfileData.append("type", this.editData.type);
      this.editfileData.append("priority", this.editData.priority);
      this.editfileData.append("details", this.editData.details);
      this.editfileData.append("status", this.editData.status);
      this.editfileData.append("filename", this.editData.filename);
      this.$axios({
        method: "POST",
        url: "v1/user/updateQuestionMapFile",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: this.editfileData,
      }).then((res) => {
        if (res.data.code == 1001) {
          that.$message({
            message: this.$t("mapmanagement.Submittedsuccessfully"),
            type: "success",
          });
          that.getQuestions();
        } else {
          that.$message({
            message: res.data.msg,
            type: "error",
          });
        }
        that.edit = false;
      });
    },

    //工单详情
    orderDetail(index) {
      this.$router.push({
        path: "/orderdetails",
        query: { orderId: this.orderData[index].id, companyorder: true },
      });
    },

    //获取企业管理员下的采购客户，做下拉框
    getCustomerNames() {
      let data = {
        beginlevel: 1,
        endlevel: 3,
      };
      getCustomerName(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.tenantidData = res.data;
      });
    },
  },

  beforeMount() {
    this.searchList = {
      type: "",
      superid: this.$store.state.userInfo.tenantid,
      tenantid: "",
      priority: "",
      status: "",
      page: 1,
      count: 20,
      beginstatus: "1",
    };

    this.getCustomerNames();
    this.getQuestions();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
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
/* 改变按钮颜色 */
.dels:hover {
  background-color: rgb(196, 27, 27);
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

.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}
.query,
.reset,
.delLogs {
  height: 32px !important;
  padding: 0 15px !important;
  line-height: 30px !important;
  box-sizing: border-box !important;
}

.demo-form-inline :deep(.el-form-item .el-form-item__label) {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline :deep(.el-form-item:not(.terminal-toolbar-item) .el-form-item__content) {
  line-height: 34px;
}
.demo-form-inline :deep(.terminal-toolbar-item .el-form-item__content) {
  line-height: normal !important;
  display: inline-flex !important;
  align-items: center !important;
}
.demo-form-inline :deep(.el-form-item .el-input__inner) {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-input__icon) {
  height: 34px;
  line-height: 34px;
}
.terminal-toolbar-item .el-button {
  margin-left: 0 !important;
}
.upload-demo :deep(.el-upload-list) {
  display: flex !important;
  flex-wrap: wrap !important;
}
.upload-demo :deep(.el-upload-list__item) {
  width: 30%;
  margin-left: 0;
  margin-right: 0;
}

.order_detail {
  display: flex;
}
.order_detail_form :deep(.el-textarea__inner) {
  min-height: 150px !important;
}

.order_detail_form :deep(.el-upload--text) {
  display: none !important;
}
.order_message h2 {
  font-size: 18px !important;
  font-weight: 400;
  color: #303133;
}

.el-dropdown-menu .el-dropdown-menu__item {
  padding: 0 10px !important;
}
.selects button {
  width: 100%;
  text-align: left;
}
.dels1,
.edits {
  padding: 8px 12px !important;
}
/* 按钮变化 */
.edits:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.dels1:hover {
  background-color: rgb(196, 27, 27);
  color: white;
}

.sendMsg {
  display: block;
  margin-top: 10px;
}
.msgdetail {
  min-height: 50px;
  max-height: 150px;
  overflow: auto;
  margin-top: 10px;
  /* border-top: 1px solid #DCDFE6; */
  padding-top: 10px;
}
.msgdetail ul {
  text-align: left;
}
.msgdetail ul li {
  display: flex;
}
.msgdetail ul li span {
  margin-left: 0;
  margin-right: 0;
  white-space: nowrap;
}
.msgdetail ul li p {
  margin-left: 0;
}
.el-divider--horizontal {
  margin: 5px 0 !important;
}
.order_message :deep(.el-textarea__inner) {
  margin-top: 10px;
}
.icon_button {
  padding: 2px 16px !important;
}

.terminal-filter-flow {
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px 16px;
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 16px;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  text-align: right !important;
  line-height: 32px;
  box-sizing: border-box;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow.is-en .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: 0 !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input),
.terminal-filter-flow .terminal-filter-item :deep(.el-select),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor),
.terminal-filter-flow .terminal-filter-item :deep(.el-cascader) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  float: none !important;
  margin: 0 !important;
  flex: none !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--datetimerange),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--daterange) {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-select__wrapper) {
  width: 100% !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  order: 999;
}
.terminal-toolbar-item :deep(.el-form-item__content) {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  width: auto !important;
  margin: 0 !important;
}
.terminal-toolbar-item :deep(.el-button),
.terminal-toolbar-item :deep(.el-dropdown),
.terminal-toolbar-item :deep(.el-popover__),
.terminal-toolbar-item :deep(.el-tooltip__),
.terminal-toolbar-item :deep(.el-popover),
.terminal-toolbar-item :deep(.el-tooltip) {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .query,
.terminal-filter-flow .reset,
.terminal-filter-flow .add,
.terminal-filter-flow .delLogs,
.terminal.terminal-filter-flow .del,
.terminal-filter-flow .del,
.terminal-filter-flow .export,
.terminal-filter-flow .addTer,
.terminal-filter-flow .addBeacon {
  height: 32px !important;
  padding: 0 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 30px !important;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.terminal-toolbar-item :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}
.search-actions :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}

</style>

<style>
.terminal-filter-flow {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px 16px !important;
  margin-bottom: 16px !important;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item {
  margin: 0 !important;
  width: auto !important;
  flex: 0 0 auto !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow.is-en .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: 0 !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__content {
  margin-left: 0 !important;
}
.terminal-filter-flow .terminal-filter-item .el-input,
.terminal-filter-flow .terminal-filter-item .el-select,
.terminal-filter-flow .terminal-filter-item .el-cascader {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  margin: 0 !important;
  float: none !important;
}
.terminal-filter-flow .terminal-filter-item .el-date-editor.el-input__wrapper,
.terminal-filter-flow .terminal-filter-item .el-date-editor--datetimerange,
.terminal-filter-flow .terminal-filter-item .el-date-editor--daterange {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  order: 999;
}
.terminal-toolbar-item .el-form-item__content {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.terminal-toolbar-item .el-button,
.terminal-toolbar-item .el-dropdown {
  margin: 0 !important;
}

/* 筛选与按钮垂直居中对齐 */
.user_input.terminal-filter-flow,
.terminal-filter-flow {
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item,
.terminal-filter-flow .terminal-toolbar-item {
  display: inline-flex !important;
  align-items: center !important;
  margin-bottom: 0 !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label),
.terminal-filter-flow .terminal-filter-item .el-form-item__label {
  line-height: 32px !important;
  height: 32px !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content),
.terminal-filter-flow .terminal-toolbar-item :deep(.el-form-item__content),
.terminal-filter-flow .terminal-filter-item .el-form-item__content,
.terminal-filter-flow .terminal-toolbar-item .el-form-item__content {
  line-height: normal !important;
  display: inline-flex !important;
  align-items: center !important;
  min-height: 32px !important;
}
.terminal-filter-flow .terminal-toolbar-item :deep(.el-button),
.terminal-filter-flow .terminal-toolbar-item .el-button {
  height: 32px !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  vertical-align: middle !important;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row .el-button,
.terminal-toolbar-row > .el-dropdown .el-button,
.terminal-toolbar-item .el-button,
.search-actions .el-button {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

</style>

