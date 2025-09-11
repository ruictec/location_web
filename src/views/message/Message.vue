<template>
  <div :class="contrForPrioNum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="$store.state.userInfo.prionum != 5">
      <Menu />
    </div>
    <div class="msgcontent" :class="contrForPrioNum != 5 ? 'admin' : ''">
      <div class="anniu">
        <h1 style="font-size: 20px; padding: 10px">
          {{ $t("tet.NotificationCenter") }}
        </h1>
        <el-button
          type="primary"
          class="anniu1"
          size="mini"
          @click="deleteMsg()"
          >{{ $t("tet.Batchdelete") }}</el-button
        >
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 70%"
        class="xc"
        :cell-style="{ background: 'rgb(243, 241, 241)' }"
        :empty-text="$t('tet.Nomessage')"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框 @cell-click="handelClickCell" -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 消息对象 -->
        <el-table-column
          :prop="i8n == 'zh' ? 'notice' : 'ennotice'"
          min-width="90"
          show-overflow-tooltip
          type="text"
        >
        </el-table-column>
        <!-- 消息内容 -->
        <el-table-column
          :prop="i8n == 'zh' ? 'msg' : 'enmsg'"
          min-width="700"
          type="text"
        >
        </el-table-column>
        <!-- 时间statusstr-->
        <el-table-column
          prop="time"
          min-width="140"
          :formatter="formatDateRegtime"
          show-overflow-tooltip
        >
        </el-table-column>
        <!-- false相当于没有写 -->
        <!-- <el-table-column
        v-if="false"
          prop="statusstr"
          min-width="90"
          type="text"
        >
        </el-table-column> -->
        <el-table-column min-width="100">
          <template slot-scope="status1">
            <span
              v-if="status1.row.status == 1"
              style="color: red; cursor: pointer"
              @click="handelClickCell(status1.row)"
              >{{ $t("tet.Markasread") }}</span
            >
            <span v-else style="color: green; cursor: pointer">{{
              $t("tet.Read")
            }}</span>
          </template>
        </el-table-column>
        <!-- 删除 -->
        <el-table-column min-width="60">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="deleteRow(scope.$index)"
              >{{ $t("tet.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div
        class="block"
        style="text-align: center; width: 100%; margin-top: 1%;"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageCount"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import { getNotice, delNotice, updateNoticeList } from "../../axios/api";
export default {
  components: {
    Menu,
  },
  name: "Message",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrioNum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      multipleSelection: [],
      searchList: {
        username: this.$store.state.userInfo.username,
        status: "", //1 未读；2 已读
        page: 1,
        count: 20,
      },
      currentPage1: 1,
      pageCount: 20,
      total: 0,
      tableData: [],
    };
  },
  mounted() {
    this.getMsg();
  },
  methods: {
    //点击未读变已读
    handelClickCell(val) {
      if (val) {
        if (val.status == 1) {
          this.upMsg(val.id);
          this.$EventBus.$emit("pushData", val.id);
        }
      }
    },
    upMsg(id) {
      var that = this;
      let ids = [];
      ids.push(id);
      let datas = {
        ids: ids,
      };
      updateNoticeList(
        datas,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        //刷新数据,别重新查数据库就不会有问题了
        //  this.getMsg();
        for (let i = 0; i < that.tableData.length; i++) {
          if (that.tableData[i].id == id) {
            that.tableData[i].status = 2;
          }
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getMsg();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getMsg();
    },
    getDevLists() {},
    //批量删除条数
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除通知
    deleteMsg() {
      var that = this;
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      let datas = {
        ids: ids,
      };
      this.$confirm(
        this.$t("warning.permissiondelete1"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        delNotice(datas, this.tenantkey_A, this.tenantid_A, this.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("buildingmanagement.deletesuccess"),
                type: "success",
              });
              that.getMsg();
            }
          }
        );
      });
    },
    //删除通知
    deleteRow(index) {
      var that = this;
      let ids = [];
      ids.push(this.tableData[index].id);
      let datas = {
        ids: ids,
      };
      this.$confirm(
        this.$t("warning.permissiondelete1"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        delNotice(datas, this.tenantkey_A, this.tenantid_A, this.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("buildingmanagement.deletesuccess"),
                type: "success",
              });
              that.getMsg();
            }
          }
        );
      });
    },

    getMsg() {
      var that = this;
      getNotice(
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
    // 时间转换
    formatDateRegtime(row, column) {
      if (row.time == null || row.time == 0) {
        return "";
      }
      let date = new Date(parseInt(row.time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
    },
  },
};
</script>

<style scoped>
.block{
  padding-bottom: 40px;
}
.anniu {
  position: relative;
  display: block;
}
.anniu1 {
  position: absolute;
  right: 26%;
  top: 20%;
}

.home {
  height: 100%;
  /* margin-right: calc(102% - 100vw); */
}

.menu_header {
  position: relative;
}
.msgcontent {
  width: 100%;
  height: 60%;
  position: absolute;
  /* top: 70px; */
}
.admin {
  top: 70px;
}
.xc {
  border: 1px solid rgb(243, 241, 241);
  width: 80px;
  text-align: center;
  border-radius: 10px;
}
</style>
