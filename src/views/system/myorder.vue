<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><System /></el-aside>
        <el-main>
          <!-- <div class="user_input"> -->
          <el-form
            class="demo-form-inline"
            :model="searchList"
            style="display: flex; white-space: nowrap"
          >
            <el-form-item
              :label="$t('myorder.questioncategory')"
              style="
                display: flex;
                width: 15%;
                margin-left: 2%;
                margin-right: 0;
              "
            >
              <el-select
                v-model="searchList.type"
                clearable
                filterable
                :placeholder="$t('myorder.text')"
                style="width: 95%; float: left"
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
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-select
                v-model="searchList.priority"
                clearable
                filterable
                :placeholder="$t('myorder.text')"
                style="width: 95%; float: left"
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
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-select
                v-model="searchList.status"
                clearable
                filterable
                :placeholder="$t('myorder.text')"
                style="width: 95%; float: left"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item style="margin-left: 2%">
              <el-button type="primary" class="query" @click="searchInfo()">{{
                $t("myorder.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("myorder.reset")
              }}</el-button>
              <el-button type="primary" class="reset" @click="addOrder()">{{
                $t("myorder.add")
              }}</el-button>
              <!-- <el-button type="primary" class="delLogs" @click="deleteLog()"
                >批量删除</el-button
              > -->
            </el-form-item>
          </el-form>
          <!-- </div> -->
          <div class="content_user">
            <!-- 展示 -->
            <el-table
              ref="multipleTable"
              :data="orderData"
              @selection-change="handleSelectionChange"
              style="
                width: 98%;
                text-align: center;
                margin-left: 2%;
                z-index: 1;
              "
              max-height="660"
              border
              highlight-current-row
            >
              <!-- <el-table-column type="selection" width="55"> </el-table-column> -->

              <el-table-column
                property="id"
                :label="$t('myorder.workordernumber')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'typestr' : 'entype'"
                :label="$t('myorder.questioncategory1')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="title"
                :label="$t('myorder.title')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'prioritystr' : 'enpriority'"
                :label="$t('myorder.priority1')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>

              <el-table-column
                property="creatime"
                :label="$t('myorder.submissiontime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDate"
              ></el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'statustr' : 'enstatus'"
                :label="$t('myorder.state')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="lastime"
                :label="$t('myorder.ResponseTime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDataLast"
              ></el-table-column>
              <el-table-column
                :label="$t('myorder.operate')"
                align="center"
                fixed="right"
                min-width="100"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('myorder.Details')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      class="icon_button"
                      @click="orderDetail(scope.$index, tableData)"
                      ><img src="../../../static/details.png"
                    /></el-button>
                  </el-tooltip>
                  <el-dropdown szie="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('myorder.Operate')"
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
                          v-if="scope.row.status == 1"
                          @click="editTer(scope.$index, tableData)"
                          >{{ $t("myorder.edit") }}</el-button
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
                          class="edits"
                          v-if="scope.row.status == 1"
                          @click="submitOrder(scope.$index, tableData)"
                          >{{ $t("myorder.Submit") }}</el-button
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
                          @click="delOrder(scope.$index, tableData)"
                          >{{ $t("myorder.delete") }}</el-button
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
                          class="edits"
                          v-if="scope.row.status != 5"
                          @click="closeOrder(scope.$index, tableData)"
                          >{{ $t("myorder.close") }}</el-button
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

          <!-- 添加工单 -->
          <el-dialog
            :title="$t('myorder.Addticket')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
          >
            <el-form
              :model="addData"
              label-width="150px"
              ref="addData"
              style="text-align: left"
              :rules="addRules"
            >
              <el-form-item :label="$t('myorder.Tickettitle')">
                <el-input v-model="addData.title"></el-input>
              </el-form-item>
              <el-form-item :label="$t('myorder.questioncategory')">
                <el-select
                  v-model="addData.type"
                  clearable
                  filterable
                  :placeholder="$t('myorder.text')"
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
                  v-model="addData.priority"
                  clearable
                  filterable
                  :placeholder="$t('myorder.text')"
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
                  v-model="addData.details"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('myorder.Appendix')">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="filePath"
                  :data="dataForFile"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :on-change="handleChange"
                  :http-request="uploadFile"
                  :auto-upload="false"
                  :limit="5"
                  :on-success="FileSuccess"
                >
                  <a slot="trigger">{{ $t("myorder.Addattachments") }}</a>
                  <div slot="tip" class="el-upload__tip">
                    {{ $t("myorder.text1") }}
                  </div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="add = false">{{
                $t("myorder.cancel")
              }}</el-button>
              <el-button type="primary" @click="saveAddOrder('addData')">{{
                $t("myorder.save")
              }}</el-button>
              <el-button type="primary" @click="submitAddOrder('addData')">{{
                $t("myorder.Submit")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 编辑工单 -->
          <el-dialog
            :title="$t('myorder.editticket')"
            width="30%"
            :visible.sync="edit"
            style="text-align: center"
          >
            <el-form
              :model="editData"
              label-width="120px"
              ref="editData"
              style="text-align: left"
              :rules="addRules"
              class="order_edit_form"
            >
              <el-form-item :label="$t('myorder.Tickettitle')">
                <el-input v-model="editData.title"></el-input>
              </el-form-item>
              <el-form-item :label="$t('myorder.questioncategory')">
                <el-select
                  v-model="editData.type"
                  clearable
                  filterable
                  :placeholder="$t('myorder.text')"
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
                  :placeholder="$t('myorder.text')"
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
                >
                  <a slot="trigger">{{ $t("myorder.Addattachments") }}</a>
                  <div slot="tip" class="el-upload__tip">
                    {{ $t("myorder.text1") }}
                  </div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="edit = false">{{
                $t("myorder.cancel")
              }}</el-button>
              <el-button type="primary" @click="saveEditOrder('editData')">{{
                $t("myorder.save")
              }}</el-button>
              <el-button type="primary" @click="submitEditOrder('editData')">{{
                $t("myorder.Submit")
              }}</el-button>
            </div></el-dialog
          >
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
  insertQuestion,
  delQuestion,
  updateQuestion,
  updateQuestionStatus,
  delFile,
} from "../../axios/api";
import System from "../../components/system/system.vue";
export default {
  components: {
    Menu,
    basecard,
    System,
  },

  Systemname: "MyOrder",
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
      pageCount: 20,
      searchList: {
        type: "",
        superid: "",
        tenantid: "",
        priority: "",
        status: "",
        page: 1,
        count: 20,
      },
      currentPage1: 1,
      total: 0,
      dataForFile: {},
      editdataForFile: {},
      add: false,
      addData: {
        title: "",
        type: "",
        superid: this.$store.state.userInfo.superid,
        tenantid: this.$store.state.userInfo.tenantid,
        priority: "",
        details: "",
        status: "",
      },
      filePath: host.host + "user/addQuestionMapFile",
      editfilePath: host.host + "user/updateQuestionMapFile",
      fileData: "", //文件上传数据（多文件合一）
      editfileData: "", //文件上传数据（多文件合一）
      fileList: [], //upload多文件数组
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
          index: 7,
          value: this.$t("myorderde.Employeemanagement"),
        },
        {
          index: 8,
          value: this.$t("myorderde.assetmanagement"),
        },
        {
          index: 9,
          value: this.$t("myorderde.Locationmanagement"),
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
          index: 1,
          value: this.$t("myorderde.draft"),
        },
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

      deleBtnDis: false,
      deleId: "",
      filename: "",
      del: false,
      delData: [],
      multipleSelection: [],
    };
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
          that.$message({
            message: that.$t("beacon.searchsuccess"),
            type: "success",
          });
        }
        this.searchList.count = 20;
      });
    },

    //重置搜索输入
    clearBtn() {
      if (this.$store.state.userInfo.prionum == 5) {
        this.searchList = {
          type: "",
          superid: "",
          tenantid: this.$store.state.userInfo.tenantid,
          priority: "",
          status: "",
          page: 1,
          count: 20,
        };
      }

      this.currentPage1 = 1;
      this.getQuestions();
    },

    handleRemove(file, fileList) {
      var that = this;
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name == file.name) {
          this.fileList.splice(i, 1);
        }
      }
      if (fileList.length == 0) {
        this.haveFile = false;
      } else {
        this.haveFile = true;
      }
    },
    edithandleRemove(file, fileList) {
      var that = this;

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
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].status != "success") {
          that.haveFile = true;
          return;
        } else {
          that.haveFile = false;
        }
      }
    },
    detailhandlePreview(file) {
      var a = document.createElement("a");
      a.setAttribute("download", file.name);
      a.setAttribute("target", "_blank");
      a.setAttribute("href", file.url);
      var event = new MouseEvent("click");
      a.dispatchEvent(event);
    },
    handleChange(file, fileList) {
      var that = this;
      this.fileList.forEach(function (item, index) {
        if (item.name === file.name) {
          fileList.splice(fileList.length - 1, 1); // 删除这个重复的元素
          that.$message({
            message: file.name + this.$t("tet.tet16"),
            type: "warning",
          });
        }
      });

      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].size) {
          const isLt2M = fileList[i].size / 1024 / 1024 < 2;
          if (!isLt2M) {
            that.$message.error(this.$t("tet.tet15"));
            fileList.splice(fileList.length - 1, 1); // 删除这个重复的元素
            return;
          }
        }
      }
      if (fileList.length > 0) {
        this.haveFile = true;
      }
      this.fileList = fileList;
    },
    edithandleChange(file, fileList) {
      var that = this;
      this.editfileList.forEach(function (item, index) {
        if (item.name === file.name) {
          fileList.splice(fileList.length - 1, 1); // 删除这个重复的元素
          that.$message({
            message: file.name + this.$t("tet.tet16"),
            type: "warning",
          });
        }
      });
      if (fileList.length > 0) {
        this.haveFile = true;
      }
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].size) {
          const isLt2M = fileList[i].size / 1024 / 1024 < 2;
          if (!isLt2M) {
            that.$message.error(this.$t("tet.tet15"));
            fileList.splice(fileList.length - 1, 1); // 删除这个重复的元素
            return false;
          }
        }
      }

      this.editfileList = fileList;
    },
    FileSuccess(response, file, fileList) {
      file = "";
      fileList = [];
      this.$refs.upload.clearFiles();
    },
    editFileSuccess(response, file, fileList) {
      file = "";
      fileList = [];
      this.$refs.uploads.clearFiles();
    },
    //添加工单
    addOrder() {
      this.fileList = [];
      this.haveFile = false;
      this.addData = {
        title: "",
        type: "",
        superid: this.$store.state.userInfo.superid,
        tenantid: this.$store.state.userInfo.tenantid,
        priority: "",
        details: "",
        status: "",
      };
      this.add = true;
    },
    //添加工单时保存为草稿
    saveAddOrder(addData) {
      var that = this;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          that.addData.status = 1;
          that.addTrue();
        }
      });
    },
    //添加工单时提交
    submitAddOrder(addData) {
      var that = this;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          that.addData.status = 2;
          that.addTrue();
        }
      });
    },
    addTrue(addData) {
      var that = this;
      if (that.haveFile) {
        that.dataForFile.title = that.addData.title;
        that.dataForFile.type = that.addData.type;
        that.dataForFile.superid = that.addData.superid;
        that.dataForFile.tenantid = that.addData.tenantid;
        that.dataForFile.priority = that.addData.priority;
        that.dataForFile.details = that.addData.details;
        that.dataForFile.status = that.addData.status;
        // that.$refs.upload.submit();
        that.submitUpload();
      } else {
        insertQuestion(
          that.addData,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (that.addData.status == 1) {
              that.$message({
                message: that.$t("inspection.Savedsuccessfully"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$t("mapmanagement.Submittedsuccessfully"),
                type: "success",
              });
            }

            that.add = false;
            that.getQuestions();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    uploadFile(file) {
      this.fileData.append("file", file.file);
    },
    //多个文件调用一次接口
    submitUpload() {
      var that = this;
      let fileData = this.uploadData.fileData;
      this.fileData = new FormData();
      this.$refs.upload.submit();
      this.fileData.append("title", this.addData.title);
      this.fileData.append("type", this.addData.type);
      this.fileData.append("superid", this.addData.superid);
      this.fileData.append("tenantid", this.addData.tenantid);
      this.fileData.append("priority", this.addData.priority);
      this.fileData.append("details", this.addData.details);
      this.fileData.append("status", this.addData.status);
      this.$axios({
        method: "POST",
        url: "v1/user/addQuestionMapFile",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: this.fileData,
      }).then((res) => {
        if (res.data.code == 1001) {
          if (that.addData.status == 1) {
            that.$message({
              message: this.$t("inspection.Savedsuccessfully"),
              type: "success",
            });
          } else {
            that.$message({
              message: this.$t("mapmanagement.Submittedsuccessfully"),
              type: "success",
            });
          }
          that.getQuestions();
          that.add = false;
        } else {
          that.$refs.upload.clearFiles();
          that.$message({
            message: res.data.msg,
            type: "error",
          });
          that.haveFile = false;
        }
      });
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
            message: that.$t("staffmanagement.delsuccess"),
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

    //编辑工单
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
      this.editData.status = this.orderData[index].status;
      this.editData.filename = [];
      this.edit = true;
    },
    //编辑工单时保存为草稿
    saveEditOrder(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          that.editData.status = 1;
          that.editTrue();
        }
      });
    },
    //编辑工单时提交
    submitEditOrder(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          that.editData.status = 2;
          that.editTrue();
        }
      });
    },

    //编辑工单
    editTrue(editData) {
      var that = this;
      for (let i = 0; i < that.editfileList.length; i++) {
        that.editData.filename.push(that.editfileList[i].name);
      }
      if (that.haveFile) {
        that.editdataForFile.id = that.editData.id;
        that.editdataForFile.title = that.editData.title;
        that.editdataForFile.type = that.editData.type;
        that.editdataForFile.priority = that.editData.priority;
        that.editdataForFile.details = that.editData.details;
        that.editdataForFile.status = that.editData.status;
        that.editdataForFile.filename = that.editData.filename;
        that.editsubmitUpload();
      } else {
        that.editData.filename = that.editData.filename.toString();
        updateQuestion(
          that.editData,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (that.editData.status == 1) {
              that.$message({
                message: that.$t("inspection.Savedsuccessfully"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$t("mapmanagement.Submittedsuccessfully"),
                type: "success",
              });
            }
            that.getQuestions();
            that.edit = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
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
          if (that.editData.status == 1) {
            that.$message({
              message: this.$t("inspection.Savedsuccessfully"),
              type: "success",
            });
          } else {
            that.$message({
              message: this.$t("mapmanagement.Submittedsuccessfully"),
              type: "success",
            });
          }
          that.getQuestions();
          that.edit = false;
        } else {
          that.$message({
            message: res.data.msg,
            type: "error",
          });
          that.haveFile = false;
        }
      });
    },

    //直接提交工单
    submitOrder(index) {
      var that = this;
      this.$confirm(
        this.$t("myorderde.submitworkorder"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        that.editfileList = [];
        that.haveFile = false;
        if (that.orderData[index].filename) {
          let filenames = that.orderData[index].filename.split(",");
          for (let i = 0; i < filenames.length; i++) {
            that.editfileList.push({
              url: host.host + "question/" + filenames[i],
              name: filenames[i],
            });
          }
        }
        that.editData.id = that.orderData[index].id;
        that.editData.title = that.orderData[index].title;
        that.editData.type = that.orderData[index].type;
        that.editData.priority = that.orderData[index].priority;
        that.editData.details = that.orderData[index].details;
        that.editData.status = that.orderData[index].status;
        that.editData.status = 2;
        that.editData.filename = [];
        that.editTrue();
      });
    },

    //直接关闭工单
    closeOrder(index) {
      var that = this;
      this.$confirm(this.$t("myorderde.closejob"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          status: 5,
          id: this.orderData[index].id,
        };
        updateQuestionStatus(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("myorderde.Workclosed"),
              type: "success",
            });
            that.getQuestions();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },

    //工单详情
    orderDetail(index) {
      this.$router.push({
        path: "/orderdetails",
        query: { orderId: this.orderData[index].id, myorder: true },
      });
    },
  },

  beforeMount() {
    this.searchList = {
      type: "",
      superid: "",
      tenantid: this.$store.state.userInfo.tenantid,
      priority: "",
      status: "",
      page: 1,
      count: 20,
    };
    if (
      this.$store.state.userInfo.prionum == 3 ||
      this.$store.state.userInfo.prionum == 4
    ) {
      this.questionTypeList = [
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
      ];
    } else if (this.$store.state.userInfo.prionum == 5) {
      this.questionTypeList = [
        {
          index: 1,
          value: this.$t("myorderde.Loginregistration"),
        },
        {
          index: 2,
          value: this.$t("myorderde.devicemanagement"),
        },
        {
          index: 6,
          value: this.$t("myorderde.alarmmanagement"),
        },
        {
          index: 7,
          value: this.$t("myorderde.Employeemanagement"),
        },
        {
          index: 8,
          value: this.$t("myorderde.assetmanagement"),
        },
        {
          index: 9,
          value: this.$t("myorderde.Locationmanagement"),
        },
        {
          index: 10,
          value: this.$t("myorderde.PersonalCenter"),
        },

        {
          index: 11,
          value: this.$t("myorderde.other"),
        },
      ];
    }
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
      Object.assign(
        this.$data.questionTypeList,
        this.$options.data.call(this).questionTypeList
      );
      Object.assign(
        this.$data.priorityList,
        this.$options.data.call(this).priorityList
      );
      Object.assign(
        this.$data.statusList,
        this.$options.data.call(this).statusList
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

.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}
.query,
.reset,
.delLogs {
  padding: 8px 12px !important;
}

.demo-form-inline >>> .el-form-item .el-form-item__label {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline >>> .el-form-item .el-form-item__content {
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__inner {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px;
  line-height: 34px;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.upload-demo >>> .el-upload-list {
  display: flex !important;
  flex-wrap: wrap !important;
}
.upload-demo >>> .el-upload-list__item {
  width: 30%;
  margin-left: 0;
  margin-right: 0;
}
.order_edit_form >>> .el-textarea__inner {
  min-height: 150px !important;
}

.order_detail {
  display: flex;
}
.order_detail_form >>> .el-textarea__inner {
  min-height: 100px !important;
}
.order_detail_form >>> .el-upload--text {
  display: none !important;
}
.order_message h2 {
  font-size: 18px !important;
  font-weight: 400;
  color: #303133;
}
.selects button {
  width: 100%;
  text-align: left;
}
.dels1,
.edits {
  padding: 8px 12px !important;
}
.el-dropdown-menu .el-dropdown-menu__item {
  padding: 0 10px !important;
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
  margin-top: 5px;
  /* border: 1px solid #DCDFE6; */
}
.msgdetail ul li span {
  margin-left: 0;
  margin-right: 0;
  white-space: nowrap;
}
.msgdetail ul li p {
  margin-left: 0%;
}
.el-divider--horizontal {
  margin: 5px 0 !important;
}

.order_message >>> .el-textarea__inner {
  margin-top: 10px;
}
.icon_button {
  padding: 2px 16px !important;
}
</style>
