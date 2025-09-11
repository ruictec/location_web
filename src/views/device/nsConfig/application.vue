<template>
  <div style="height: 100%">
    <div class="content">
      <el-container>
        <el-main>
          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 98%; text-align: center; margin-left: 0; z-index: 1"
              max-height="670"
              border
              highlight-current-row
            >
              <el-table-column
                property="nsid"
                :label="$t('nsconfig.nsid1')"
                show-overflow-tooltip
                min-width="87"
              >
              </el-table-column>

              <el-table-column
                property="name"
                :label="$t('manage.Appname')"
                show-overflow-tooltip
                min-width="87"
              ></el-table-column>
              <el-table-column
                property="scheme"
                :label="$t('manage.AppSpid')"
                show-overflow-tooltip
                min-width="87"
              ></el-table-column>
              <el-table-column
                property="applicationId"
                :label="$t('manage.Appid')"
                show-overflow-tooltip
                min-width="87"
              ></el-table-column>

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

        </el-main>
      </el-container>
    </div>
  </div>
</template>
  <script>
import basecard from "@/components/card/base-card";
import Menu from "@/components/menu/Menu";
import Devicemanagement from "@/components/devicemanagement/devicemanagement";
import {
    getApplicationList,
} from "@/axios/api";
export default {
  components: {
    Menu,
    Devicemanagement,
    basecard,
  },
  data() {
    return {
      i8n: this.$store.state.i18n,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      tenantid_A: this.$store.state.userInfo.tenantid,
      userName: this.$store.state.userInfo.username,

      tableData: [],
      searchList: {
        page: 1,
        count: 20,
      },
      currentPage1: 1,
      total: 0,
      pageCount: 20,
 
    };
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getApplicationOnes();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getApplicationOnes();
    },

    getApplicationOnes() {
      this.tableData = [];
      getApplicationList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName).then((res) => {
        if (res.code == 1001) {
            this.total=res.data.size
          this.tableData = res.data.list;
        }
      });
    },
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
        this.$data.searchInallotList,
        this.$options.data.call(this).searchInallotList
      );
      Object.assign(
        this.$data.inuseType,
        this.$options.data.call(this).inuseType
      );
      Object.assign(
        this.$data.workType,
        this.$options.data.call(this).workType
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

.el-main {
  width: 98%;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
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

.el-table >>> .el-table__row td {
  padding: 0 !important;
}

.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}

.query,
.reset,
.delBeacons,
.addBeacon,
.editBeacons,
.dels {
  padding: 8px 12px !important;
}

/* 按钮改变颜色 */
.editBeacons:hover,
.delBeacons:hover,
.edits:hover {
  background-color: rgb(25, 86, 201);
}

.delss:hover {
  background-color: rgb(196, 27, 27);
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

.icon_button {
  padding: 2px 16px !important;
}
</style>