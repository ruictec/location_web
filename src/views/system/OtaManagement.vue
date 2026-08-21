<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><System /></el-aside>
        <el-main>
                    <div class="terminal-filter-flow" :class="filterLangClass">
<el-form
            class="demo-form-inline terminal-filter-form"
            :model="searchList"
          >
            <el-form-item
              :label="$t('otamanagement.devtype')"
             class="terminal-filter-item">
              <el-select
                v-model="searchList.devtype"
                clearable
                filterable
                :placeholder="$t('otamanagement.devtypeplaceholder')"
              >
                <el-option
                  v-for="item in devTypeList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
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
              <el-button type="primary" class="uploadBtn" @click="openUpload()">{{
                $t("otamanagement.upload")
              }}</el-button>
            </el-form-item>
          </el-form>
          </div>

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
                min-width="70"
              >
                <template #default="scope">
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
                v-model:current-page="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                v-model:page-size="pageCount"
              >
              </el-pagination>
            </div>
          </div>

          <el-dialog
            :title="$t('otamanagement.uploadtitle')"
            v-model="uploadVisible"
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
                  <template #tip><div class="el-upload__tip">
                    {{ $t("otamanagement.filetip") }}
                  </div></template>
                </el-upload>
              </el-form-item>
            </el-form>
            <template #footer><div class="dialog-footer">
              <el-button @click="uploadVisible = false">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="submitUpload()">{{
                $t("terminal.confirm")
              }}</el-button>
            </div></template>
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
        page: 1,
        count: 20,
      },
      currentPage1: 1,
      total: 0,
      uploadVisible: false,
      uploadForm: {
        devtype: null,
        description: "",
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
    };
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
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
        page: 1,
        count: this.pageCount,
      };
      this.currentPage1 = 1;
      this.getOtaList();
    },
    openUpload() {
      this.uploadVisible = true;
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
.uploadBtn {
  padding: 8px 12px !important;
}
.demo-form-inline :deep(.el-form-item .el-form-item__label) {
  padding: 0;
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-form-item__content) {
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-input__inner) {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline :deep(.el-form-item .el-input__icon) {
  height: 34px;
  line-height: 34px;
}
.el-form-item .el-button {
  margin-left: 4px !important;
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
  min-width: auto !important;
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
  min-width: auto !important;
  flex: 0 0 auto !important;
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
.terminal.terminal-filter-flow .del,
.terminal-filter-flow .del,
.terminal-filter-flow .export,
.terminal-filter-flow .addTer,
.terminal-filter-flow .addBeacon {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 1 !important;
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
  min-width: auto !important;
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
  min-width: auto !important;
  flex: 0 0 auto !important;
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

