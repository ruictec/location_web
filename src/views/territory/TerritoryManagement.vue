<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-main>
                    <div class="terminal-filter-flow" :class="filterLangClass">
<el-form
            :inline="true"
            :model="searchList"
            class="demo-form-inline terminal-filter-form"
          >
            <el-form-item
              :label="$t('territorymanagement.country')"
             class="terminal-filter-item">
              <el-select
                v-model="searchList.username"
                filterable
                :placeholder="$t('territorymanagement.Pleaseenter')"
              >
                <el-option
                  v-for="item in searchSelectCountry"
                  :key="item.tenantid"
                  :label="item.country"
                  :value="item.country"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="terminal-toolbar-item">
              <el-button type="primary" @click="seachInfo()" class="query">{{
                $t("territorymanagement.search")
              }}</el-button>
              <el-button type="primary" @click="clearBtn()" class="reset">{{
                $t("territorymanagement.reset")
              }}</el-button>
            </el-form-item>
          </el-form>
          </div>
          <div class="content_country">
            <!-- 展示 -->
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
            >
              <el-table-column
                property="username"
                :label="$t('territorymanagement.username')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>

              <el-table-column
                property="gwnumber"
                :label="$t('territorymanagement.gwnumber')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="nodenumber"
                :label="$t('territorymanagement.nodenumber')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="uptime"
                :label="$t('territorymanagement.uptime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDate"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('territorymanagement.memo')"
                align="center"
              ></el-table-column>
              <el-table-column
                :label="$t('territorymanagement.contron')"
                width="120"
                align="center"
              >
                <template #default="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('territorymanagement.edit')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      @click="teeritoryEdit(scope.row)"
                      class="edits"
                      ><img src="../../../static/edit2.png"
                    /></el-button>
                  </el-tooltip>
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

          <!-- 编辑模态框 -->
          <el-dialog
            :title="$t('territorymanagement.editinfor2')"
            v-model="edit"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-form
              :model="editData"
              ref="editData"
              class="demo-ruleForm"
              label-width="130px"
              style="text-align: left; margin-left: 10px"
            >
              <el-form-item :label="$t('territorymanagement.country')">
                <el-input
                  disabled
                  v-model="editData.username"
                  :placeholder="$t('territorymanagement.Pleaseenter')"
                ></el-input>
              </el-form-item>

              <el-form-item :label="$t('territorymanagement.gwnumber1')">
                <el-input
                  disabled
                  v-model="editData.gwnumber"
                  :placeholder="$t('territorymanagement.Pleaseenter')"
                ></el-input>
              </el-form-item>

              <el-form-item :label="$t('territorymanagement.nodenumber1')">
                <el-input
                  disabled
                  v-model="editData.nodenumber"
                  :placeholder="$t('territorymanagement.Pleaseenter')"
                ></el-input>
              </el-form-item>

              <el-form-item :label="$t('territorymanagement.memo1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <template #footer><div class="dialog-footer">
              <el-button @click="(edit = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button>
            </div></template>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import {
  getCountryList,
  getCountry,
  updateCountry,
  getCustomerName,
} from "../../axios/api";
export default {
  components: {
    Menu,
  },
  name: "TerritoryManagement",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      loading: false,
      pageCount: 20,
      searchList: { username: "", page: 1, count: 20 },
      searchSelectCountry: [],
      tableData: [],
      currentPage1: 1,
      total: 0,
      editData: { username: "", gwnumber: "", nodenumber: "", memo: "" },
      edit: false,
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
      this.getCountryLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getCountryLists();
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
      if (row.uptime == null) {
        return "";
      }
      let date = new Date(parseInt(row.uptime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    //获取所有信息
    getCountryLists() {
      var that = this;
      let para = {
        page: this.searchList.page,
        count: this.searchList.count,
      };
      getCountryList(
        para,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.tableData = res.data.list;
          that.total = res.data.size;
        }
      });
    },

    //查询
    seachInfo() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getCountry(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = [];
          that.tableData.push(res.data);
          that.total = 1;
        }
      });
    },

    //刷新
    clearBtn() {
      this.searchList = { username: "", page: 1, count: this.pageCount };
      this.currentPage1 = 1;
      this.getCountryLists();
    },

    //编辑
    teeritoryEdit(row) {
      this.editData.username = row.username;
      this.editData.gwnumber = row.gwnumber;
      this.editData.nodenumber = row.nodenumber;
      this.editData.memo = row.memo;
      this.edit = true;
    },

    //确认提交
    editTrue(ruleForm) {
      var that = this;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.editData.memo == "") {
            this.editData.memo = " "; //等于空格，不然不会进行修改
          }
          this.loading = true;
          updateCountry(
            that.editData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              this.edit = false;
              this.getCountryLists();
              this.getCustomerNames();
              that.$message({
                message: that.$t("territorymanagement.editsuccess"),
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

    //获取所有的Tenantid以及国家下拉框
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
        //国家下拉搜索框
        var countryData = res.data;
        var countryHash = {};
        this.searchSelectCountry = countryData.reduce((preVal, curVal) => {
          countryHash[curVal.country]
            ? ""
            : (countryHash[curVal.country] = true && preVal.push(curVal));
          return preVal;
        }, []);
      });
    },
  },
  beforeMount() {
    this.getCountryLists();
    this.getCustomerNames();
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

.el-message--success {
  display: -webkit-box !important;
}

.el-message--error {
  display: -webkit-box !important;
}

.el-message--warning {
  display: -webkit-box !important;
}
.content_country {
  margin-top: 20px;
}

.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}
.el-form-item :deep(.el-form-item__content .el-button) {
  padding: 10px 14px !important;
}

.query,
.reset {
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
.edits {
  padding: 2px 16px !important;
}
.edits:hover {
  background-color: rgb(25, 86, 201);
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

