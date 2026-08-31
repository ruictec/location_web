<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><System /></el-aside>
        <el-main>
          <el-form
            class="demo-form-inline search-form"
            :model="searchList"
            label-width="90px"
          >
            <el-form-item :label="$t('otamanagement.devtype')">
              <el-select
                v-model="searchList.devtype"
                clearable
                filterable
                :placeholder="$t('otamanagement.devtypeplaceholder')"
                class="search-select"
              >
                <el-option
                  v-for="item in devTypeList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('otamanagement.status1')">
              <el-select
                v-model="searchList.status"
                clearable
                filterable
                :placeholder="$t('otamanagement.status2')"
                class="search-select"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="search-actions">
              <el-button type="primary" class="query" @click="searchInfo()">{{
                $t("heartbeat.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("heartbeat.reset")
              }}</el-button>
              <el-button type="primary" class="uploadBtn" @click="openUpload()">{{
                $t("otamanagement.upload")
              }}</el-button>
            </el-form-item>
          </el-form>

          <div class="content_user">
            <el-table
              ref="multipleTable"
              :data="otaData"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
            >
              <el-table-column
                property="id"
                :label="$t('otamanagement.id')"
                show-overflow-tooltip
                align="center"
                min-width="80"
              ></el-table-column>
              <el-table-column
                property="devtype"
                :label="$t('otamanagement.devtype1')"
                show-overflow-tooltip
                align="center"
                min-width="120"
                :formatter="formatDevtype"
              ></el-table-column>
              <el-table-column
                property="version"
                :label="$t('otamanagement.version1')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="description"
                :label="$t('otamanagement.description')"
                show-overflow-tooltip
                align="center"
                min-width="150"
              ></el-table-column>
              <el-table-column
                property="status"
                :label="$t('otamanagement.status')"
                show-overflow-tooltip
                align="center"
                min-width="110"
                :formatter="formatStatus"
              ></el-table-column>
              <el-table-column
                property="time"
                :label="$t('otamanagement.time')"
                show-overflow-tooltip
                align="center"
                min-width="170"
                :formatter="formatDate"
              ></el-table-column>
              <el-table-column
                :label="$t('otamanagement.control')"
                align="center"
                fixed="right"
                min-width="110"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('warning.edit')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="editss"
                      @click="openEdit(scope.row)"
                      ><img src="../../../static/edit2.png"
                    /></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('warning.delete')"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      class="dels"
                      @click="deleteOta(scope.$index)"
                      ><img src="../../../static/delete.png"
                    /></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>

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

          <el-dialog
            :title="$t('otamanagement.uploadtitle')"
            :visible.sync="uploadVisible"
            width="32%"
            @close="resetUpload()"
          >
            <el-form
              :model="uploadForm"
              ref="uploadForm"
              label-width="100px"
              :rules="uploadRules"
            >
              <!-- <el-form-item :label="$t('otamanagement.devtype1')" prop="devtype">
                <el-select
                  v-model="uploadForm.devtype"
                  filterable
                  :placeholder="$t('otamanagement.devtypeplaceholder')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in devTypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item :label="$t('otamanagement.description')">
                <el-input
                  v-model="uploadForm.description"
                  type="textarea"
                  maxlength="128"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('otamanagement.status1')">
                <el-select
                  v-model="uploadForm.status"
                  filterable
                  :placeholder="$t('otamanagement.status2')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('otamanagement.file')" prop="file">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  action=""
                  :auto-upload="false"
                  :limit="1"
                  :on-change="handleFileChange"
                  :on-remove="handleFileRemove"
                  :on-exceed="handleExceed"
                >
                  <el-button size="small" type="primary">{{
                    $t("otamanagement.selectfile")
                  }}</el-button>
                  <div slot="tip" class="el-upload__tip">
                    {{ $t("otamanagement.filetip") }}
                  </div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="uploadVisible = false">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="submitUpload()">{{
                $t("terminal.confirm")
              }}</el-button>
            </div>
          </el-dialog>

          <el-dialog
            :title="$t('otamanagement.edittitle')"
            :visible.sync="editVisible"
            width="32%"
            @close="resetEdit()"
          >
            <el-form
              :model="editForm"
              ref="editForm"
              label-width="100px"
              :rules="editRules"
            >
              <el-form-item :label="$t('otamanagement.description')">
                <el-input
                  v-model="editForm.description"
                  type="textarea"
                  maxlength="128"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('otamanagement.status1')" prop="status">
                <el-select
                  v-model="editForm.status"
                  filterable
                  :placeholder="$t('otamanagement.status2')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editVisible = false">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="submitEdit()">{{
                $t("terminal.confirm")
              }}</el-button>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import System from "../../components/system/system.vue";
import {
  getDevOtaMapFileList,
  addDevOtaMapFile,
  delDevOta,
  updateDevOta,
} from "../../axios/api";

export default {
  components: {
    Menu,
    System,
  },
  data() {
    return {
      i8n: this.$store.state.i18n,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      contrForPrionum: this.$store.state.userInfo.prionum,
      otaData: [],
      pageCount: 20,
      searchList: {
        devtype: null,
        status: null,
        page: 1,
        count: 20,
      },
      currentPage1: 1,
      total: 0,
      uploadVisible: false,
      editVisible: false,
      uploadForm: {
        devtype: null,
        description: "",
        status: 1,
        file: null,
      },
      uploadRules: {
        devtype: [
          {
            required: true,
            message: this.$t("otamanagement.devtyperule"),
            trigger: "change",
          },
        ],
        file: [
          {
            required: true,
            message: this.$t("otamanagement.filerule"),
            trigger: "change",
          },
        ],
      },
      editForm: {
        id: null,
        description: "",
        status: 1,
      },
      editRules: {
        status: [
          {
            required: true,
            message: this.$t("otamanagement.status2"),
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    devTypeList() {
      return [
        { index: 1, value: this.$t("otamanagement.devtype_lora") },
        { index: 2, value: this.$t("otamanagement.devtype_mk3") },
        { index: 3, value: this.$t("otamanagement.devtype_card") },
        { index: 4, value: this.$t("otamanagement.devtype_vehicle") },
        { index: 5, value: this.$t("otamanagement.devtype_helmet") },
        { index: 6, value: this.$t("otamanagement.devtype_vehicle_4G") },
      ];
    },
    statusList() {
      return [
        { index: 0, value: this.$t("otamanagement.statusDisabled") },
        { index: 1, value: this.$t("otamanagement.statusEnabled") },
      ];
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getOtaList();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getOtaList();
    },
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
      return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
    },
    formatDate(row) {
      if (row.time == null || row.time == 0) {
        return "";
      }
      let date = new Date(parseInt(row.time) * 1000);
      return this.datetimecut(date.toUTCString());
    },
    formatDevtype(row) {
      const item = this.devTypeList.find((type) => type.index == row.devtype);
      return item ? item.value : row.devtype;
    },
    formatStatus(row) {
      if (row.status === 1 || row.status === "1") {
        return this.$t("otamanagement.statusEnabled");
      }
      return this.$t("otamanagement.statusDisabled");
    },
    hasDeletePermission() {
      return !(
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      );
    },
    getQueryParams() {
      const params = {
        page: this.searchList.page,
        count: this.searchList.count,
      };
      if (this.searchList.devtype !== null && this.searchList.devtype !== "") {
        params.devtype = this.searchList.devtype;
      }
      if (this.searchList.status !== null && this.searchList.status !== "") {
        params.status = this.searchList.status;
      }
      return params;
    },
    getOtaList() {
      var that = this;
      getDevOtaMapFileList(that.getQueryParams()).then((res) => {
        if (res.code == 1001) {
          that.otaData = res.data.list || [];
          that.total = res.data.size || 0;
        }
      });
    },
    searchInfo() {
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      getDevOtaMapFileList(this.getQueryParams()).then((res) => {
        if (res.code == 1001) {
          that.otaData = res.data.list || [];
          that.total = res.data.size || 0;
          that.$message({
            message: that.$t("downlink.searchsuccess"),
            type: "success",
          });
        }
      });
    },
    clearBtn() {
      this.searchList = {
        devtype: null,
        status: null,
        page: 1,
        count: this.pageCount,
      };
      this.currentPage1 = 1;
      this.getOtaList();
    },
    openUpload() {
      this.uploadVisible = true;
    },
    openEdit(row) {
      this.editForm = {
        id: row.id,
        description: row.description || "",
        status:
          row.status === 1 || row.status === "1"
            ? 1
            : 0,
      };
      this.editVisible = true;
    },
    resetEdit() {
      this.editForm = {
        id: null,
        description: "",
        status: 1,
      };
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields();
      }
    },
    submitEdit() {
      var that = this;
      this.$refs.editForm.validate((valid) => {
        if (!valid) {
          return;
        }
        const data = {
          id: that.editForm.id,
          status: that.editForm.status,
          description: that.editForm.description || "",
        };
        updateDevOta(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.editVisible = false;
            that.resetEdit();
            that.getOtaList();
            that.$message({
              message: that.$t("otamanagement.editsuccess"),
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
    handleFileChange(file) {
      this.uploadForm.file = file.raw;
      this.$refs.uploadForm && this.$refs.uploadForm.validateField("file");
    },
    handleFileRemove() {
      this.uploadForm.file = null;
    },
    handleExceed() {
      this.$message({
        message: this.$t("otamanagement.filelimit"),
        type: "warning",
      });
    },
    resetUpload() {
      this.uploadForm = {
        devtype: null,
        description: "",
        status: 1,
        file: null,
      };
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      if (this.$refs.uploadForm) {
        this.$refs.uploadForm.resetFields();
      }
    },
    submitUpload() {
      var that = this;
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) {
          return;
        }
        if (!that.uploadForm.file) {
          that.$message({
            message: that.$t("otamanagement.filerule"),
            type: "warning",
          });
          return;
        }
        const formData = new FormData();
        formData.append("file", that.uploadForm.file);
        // formData.append("devtype", that.uploadForm.devtype);
        formData.append("description", that.uploadForm.description || "");
        formData.append("status", that.uploadForm.status);
        addDevOtaMapFile(formData).then((res) => {
          if (res.code == 1001) {
            that.uploadVisible = false;
            that.resetUpload();
            that.getOtaList();
            that.$message({
              message: that.$t("otamanagement.uploadsuccess"),
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
    deleteOta(index) {
      if (!this.hasDeletePermission()) {
        this.$message({
          message: this.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("otamanagement.deletetip"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        const row = this.otaData[index];
        const data = {
          id: row.id,
        };
        delDevOta(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            this.getOtaList();
            this.$message({
              message: this.$t("downlink.deletesuccess"),
              type: "success",
            });
          } else {
            this.$message({
              message: this.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },
  },
  beforeMount() {
    this.getOtaList();
  },
  watch: {
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
.dels {
  padding: 2px 16px !important;
}
.dels:hover {
  background-color: rgb(196, 27, 27);
}
.editss {
  padding: 2px 16px !important;
}
.editss:hover {
  background-color: rgb(25, 86, 201);
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
.uploadBtn {
  padding: 8px 12px !important;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  white-space: nowrap;
  margin-left: 2%;
}
.content_user {
  margin-top: 20px;
}
.search-form >>> .el-form-item {
  margin-bottom: 0;
  margin-right: 12px;
}
.search-form >>> .el-form-item__label {
  padding: 0 8px 0 0;
  line-height: 34px;
}
.search-form >>> .el-form-item__content {
  line-height: 34px;
}
.search-select {
  width: 180px;
}
.search-actions >>> .el-form-item__content {
  margin-left: 0 !important;
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
</style>
