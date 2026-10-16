<template>
  <div style="height: 100%">
    <div class="content">
      <el-container class="user">
        <el-main>
          <div
            class="ter_input terminal-filter-flow"
            :class="filterLangClass"
          >
            <el-form
              class="demo-form-inline terminal-filter-form"
              :model="searchList"
              @submit.prevent
            >
              <el-form-item
                :label="$t('audioRecording.deveui')"
                class="terminal-filter-item"
              >
                <el-input
                  v-model="searchList.deveui"
                  clearable
                  :placeholder="$t('audioRecording.deveuiPlaceholder')"
                  @keyup.enter="searchInfo"
                />
              </el-form-item>
            </el-form>
            <div class="search-actions terminal-toolbar-item">
              <div class="terminal-toolbar-row">
                <el-button type="primary" class="query" @click="searchInfo">{{
                  $t("audioRecording.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="resetSearch">{{
                  $t("audioRecording.reset")
                }}</el-button>
              </div>
            </div>
          </div>

          <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 98%; text-align: center; margin-left: 2%"
          >
            <el-table-column
              property="id"
              :label="$t('audioRecording.id')"
              show-overflow-tooltip
              align="center"
              min-width="80"
            />
            <el-table-column
              property="deveui"
              :label="$t('audioRecording.deveuiCol')"
              show-overflow-tooltip
              align="center"
              min-width="160"
            />
            <el-table-column
              property="filename"
              :label="$t('audioRecording.filename')"
              show-overflow-tooltip
              align="center"
              min-width="180"
            />
            <el-table-column
              :label="$t('audioRecording.filesize')"
              show-overflow-tooltip
              align="center"
              min-width="120"
            >
              <template #default="scope">
                {{ formatFileSize(scope.row.filesize) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('audioRecording.ctime')"
              show-overflow-tooltip
              align="center"
              min-width="170"
            >
              <template #default="scope">
                {{ formatCtime(scope.row.ctime) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('audioRecording.operate')"
              align="center"
              fixed="right"
              min-width="160"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="!getAudioUrl(scope.row)"
                  @click="playAudio(scope.row)"
                >
                  {{ $t("audioRecording.play") }}
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteAudio(scope.row)"
                >
                  {{ $t("audioRecording.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="audio-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              v-model:current-page="currentPage"
              v-model:page-size="pageCount"
              :page-sizes="[10, 20, 30, 40, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            />
          </div>
        </el-main>
      </el-container>
    </div>

    <el-dialog
      :title="$t('audioRecording.playTitle')"
      v-model="playVisible"
      width="480px"
      @close="stopAudio"
    >
      <div class="audio-player-wrap" v-if="currentAudioUrl">
        <audio
          ref="audioPlayer"
          :src="currentAudioUrl"
          controls
          style="width: 100%"
        />
      </div>
      <div v-else class="audio-empty">{{ $t("audioRecording.noUrl") }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { getAudioFileList, delAudioFile } from "../../axios/api";
import host from "../../host.js";

export default {
  name: "AudioRecording",
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageCount: 20,
      searchList: {
        deveui: "",
        page: 1,
        count: 20,
      },
      playVisible: false,
      currentAudioUrl: "",
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
    };
  },
  computed: {
    filterLangClass() {
      const lang =
        this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  mounted() {
    this.getList();
  },
  beforeUnmount() {
    this.stopAudio();
  },
  methods: {
    searchInfo() {
      this.searchList.deveui = (this.searchList.deveui || "").trim();
      this.currentPage = 1;
      this.searchList.page = 1;
      this.searchList.count = this.pageCount;
      this.getList();
    },
    resetSearch() {
      this.searchList.deveui = "";
      this.searchList.page = 1;
      this.searchList.count = this.pageCount;
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.searchList.page = page;
      this.getList();
    },
    handleSizeChange(count) {
      this.pageCount = count;
      this.searchList.count = count;
      this.searchList.page = 1;
      this.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      getAudioFileList(
        {
          projectid: this.$store.state.projectid,
          deveui: (this.searchList.deveui || "").trim(),
          page: this.searchList.page,
          count: this.searchList.count,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res && res.code == 1001) {
            const data = res.data || {};
            this.tableData = Array.isArray(data)
              ? data
              : data.list || data.records || [];
            this.total =
              (data && (data.size != null ? data.size : data.total)) ||
              this.tableData.length;
          } else {
            this.tableData = [];
            this.total = 0;
            this.$message({
              message:
                (res && (res.msg || res.enMsg)) ||
                this.$t("audioRecording.searchfaile"),
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.tableData = [];
          this.total = 0;
          this.$message({
            message: this.$t("audioRecording.searchfaile"),
            type: "warning",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // filesize 单位：字节
    formatFileSize(value) {
      if (value == null || value === "") return "-";
      const num = Number(value);
      if (Number.isNaN(num)) return String(value);
      if (num < 1024) return num + " B";
      if (num < 1024 * 1024) return (num / 1024).toFixed(1) + " KB";
      return (num / (1024 * 1024)).toFixed(2) + " MB";
    },
    // ctime：秒级时间戳
    formatCtime(value) {
      if (value == null || value === "" || Number(value) === 0) return "-";
      const num = Number(value);
      if (Number.isNaN(num)) return String(value);
      const date = new Date(num > 1e12 ? num : num * 1000);
      if (Number.isNaN(date.getTime())) return String(value);
      const pad = (n) => (n < 10 ? "0" + n : "" + n);
      return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        " " +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds())
      );
    },
    // 播放地址：/v1/audio/[设备号]/[文件名]
    getAudioUrl(row) {
      if (!row) return "";
      const deveui = row.deveui != null ? String(row.deveui).trim() : "";
      const filename = row.filename != null ? String(row.filename).trim() : "";
      if (!deveui || !filename) return "";
      const base = (host.host || "").replace(/\/$/, "");
      return (
        base +
        "/audio/" +
        encodeURIComponent(deveui) +
        "/" +
        encodeURIComponent(filename)
      );
    },
    playAudio(row) {
      const url = this.getAudioUrl(row);
      if (!url) {
        this.$message({
          message: this.$t("audioRecording.noUrl"),
          type: "warning",
        });
        return;
      }
      this.currentAudioUrl = url;
      this.playVisible = true;
      this.$nextTick(() => {
        const el = this.$refs.audioPlayer;
        if (el && el.play) {
          el.play().catch(() => {});
        }
      });
    },
    deleteAudio(row) {
      if (!row || row.id == null || row.id === "") {
        this.$message({
          message: this.$t("audioRecording.deletefaile"),
          type: "warning",
        });
        return;
      }
      const that = this;
      this.$confirm(
        this.$t("audioRecording.deleteConfirm", {
          name: row.filename || row.id,
        }),
        this.$t("beacon.prompt"),
        {
          confirmButtonText: this.$t("audioRecording.confirm"),
          cancelButtonText: this.$t("audioRecording.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          delAudioFile(
            { id: row.id },
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          )
            .then((res) => {
              if (res && res.code == 1001) {
                that.$message({
                  message: that.$t("audioRecording.deletesuccess"),
                  type: "success",
                });
                if (that.tableData.length === 1 && that.searchList.page > 1) {
                  that.searchList.page -= 1;
                  that.currentPage = that.searchList.page;
                }
                that.getList();
              } else {
                that.$message({
                  message:
                    (that.$store.state.i18n == "zh"
                      ? res && res.msg
                      : res && res.enMsg) ||
                    that.$t("audioRecording.deletefaile"),
                  type: "warning",
                });
              }
            })
            .catch(() => {
              that.$message({
                message: that.$t("audioRecording.deletefaile"),
                type: "warning",
              });
            });
        })
        .catch(() => {});
    },
    stopAudio() {
      const el = this.$refs.audioPlayer;
      if (el) {
        try {
          el.pause();
          el.currentTime = 0;
        } catch (e) {}
      }
      this.currentAudioUrl = "";
    },
  },
};
</script>

<style scoped>
.user {
  height: 100%;
}
.ter_input.terminal-filter-flow {
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
.ter_input.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.ter_input.terminal-filter-flow > .terminal-filter-form > .el-form-item,
.ter_input.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.ter_input.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
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
.ter_input.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
}
.ter_input.terminal-filter-flow .terminal-filter-item :deep(.el-input) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  order: 999;
}
.terminal-toolbar-row {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
}
.audio-pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.audio-player-wrap {
  padding: 8px 0;
}
.audio-empty {
  color: #909399;
  text-align: center;
  padding: 16px 0;
}
</style>
