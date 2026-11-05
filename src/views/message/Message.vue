<template>
  <div
    :class="contrForPrioNum != 5 ? 'home device-page admin-page message-page' : 'device-page message-page'"
  >
    <div class="menu_header" v-if="$store.state.userInfo.prionum != 5">
      <Menu />
    </div>
    <div class="msgcontent" :class="contrForPrioNum != 5 ? 'admin' : ''">
      <div class="page-panel table-panel">
        <div class="message-head">
          <div class="message-title">
            {{ $t("tet.NotificationCenter") }}
            <span class="message-count">{{ total }}</span>
          </div>
          <el-button
            type="danger"
            plain
            class="message-batch-del"
            :disabled="!multipleSelection.length"
            @click="deleteMsg()"
            >{{ $t("tet.Batchdelete") }}</el-button>
        </div>

        <el-table
          ref="multipleTable"
          :data="tableData"
          class="device-table message-table"
          :row-class-name="messageRowClass"
          :empty-text="$t('tet.Nomessage')"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="48" align="center" />
          <el-table-column :label="$t('downlink.msg')" min-width="520">
            <template #default="{ row }">
              <div class="message-cell">
                <span class="message-dot" v-if="row.status == 1"></span>
                <span class="message-obj" v-if="row[i8n == 'zh' ? 'notice' : 'ennotice']">{{
                  row[i8n == "zh" ? "notice" : "ennotice"]
                }}</span>
                <span class="message-text">{{ row[i8n == "zh" ? "msg" : "enmsg"] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('gateway.time')"
            prop="time"
            width="180"
            align="center"
            :formatter="formatDateRegtime"
          />
          <el-table-column :label="$t('terminal.state')" width="140" align="center">
            <template #default="{ row }">
              <el-tag
                v-if="row.status == 1"
                type="warning"
                effect="light"
                class="message-tag is-unread"
                @click="handelClickCell(row)"
                >{{ $t("tet.Markasread") }}</el-tag>
              <el-tag v-else type="success" effect="light" class="message-tag">{{
                $t("tet.Read")
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('downlink.operate')" width="100" align="center">
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click="deleteRow(scope.$index)"
                >{{ $t("tet.delete") }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block device-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-model:current-page="currentPage1"
            :page-sizes="[10, 20, 30, 40, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="pageCount"
          >
          </el-pagination>
        </div>
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
    messageRowClass({ row }) {
      return row.status == 1 ? "is-unread" : "";
    },
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
          customClass: "device-message-box",
          confirmButtonClass: "device-message-confirm",
          cancelButtonClass: "device-message-cancel",
          roundButton: false,
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
          customClass: "device-message-box",
          confirmButtonClass: "device-message-confirm",
          cancelButtonClass: "device-message-cancel",
          roundButton: false,
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
.message-page .msgcontent {
  position: relative;
  padding: 12px;
  box-sizing: border-box;
}

.message-page .msgcontent.admin {
  padding-top: 82px;
  min-height: 100vh;
}

.message-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 4px 12px;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 !important;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.message-count {
  min-width: 22px;
  padding: 0 8px;
  line-height: 20px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: var(--tone-c1);
  background: rgba(var(--tone-rgb), 0.1);
}

.message-batch-del {
  margin: 0 !important;
  border-radius: 8px;
}

.message-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  text-align: left;
}

.message-dot {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  margin: 0 !important;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.message-obj {
  flex: 0 0 auto;
  margin: 0 !important;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
  background: #f1f5f9;
}

.message-text {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #64748b;
}

.message-table :deep(.is-unread .message-text) {
  color: #0f172a;
  font-weight: 600;
}

.message-tag {
  border-radius: 6px;
}

.message-tag.is-unread {
  cursor: pointer;
}
</style>
