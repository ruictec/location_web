<template>
  <div class="task-management-page">
    <div class="terminal-filter-flow" :class="filterLangClass">
      <el-form
        class="demo-form-inline terminal-filter-form"
        :model="searchList"
        @submit.prevent
      >
        <el-form-item :label="$t('locateTask.name')" class="terminal-filter-item">
          <el-input
            v-model="searchList.name"
            clearable
            :placeholder="$t('locateTask.namePlaceholder')"
            @keyup.enter="searchInfo"
          />
        </el-form-item>
        <el-form-item class="terminal-toolbar-item">
          <el-button type="primary" class="query" @click="searchInfo">{{
            $t("locateTask.search")
          }}</el-button>
          <el-button type="primary" class="reset" @click="resetSearch">{{
            $t("locateTask.reset")
          }}</el-button>
          <el-button type="primary" class="reset" @click="openAddDialog">{{
            $t("locateTask.add")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 98%; margin-left: 1%"
    >
      <el-table-column
        property="name"
        :label="$t('locateTask.name')"
        show-overflow-tooltip
        align="center"
        min-width="140"
      />
      <el-table-column
        :label="$t('locateTask.status')"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          <el-tag
            :type="getTaskStatusTagType(scope.row)"
            size="small"
            effect="plain"
          >
            {{ formatTaskStatus(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('locateTask.starttime')"
        show-overflow-tooltip
        align="center"
        min-width="170"
      >
        <template #default="scope">
          {{ formatSecondTime(scope.row.begintime) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('locateTask.endtime')"
        show-overflow-tooltip
        align="center"
        min-width="170"
      >
        <template #default="scope">
          {{ formatSecondTime(scope.row.endtime) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('locateTask.worktypes')"
        show-overflow-tooltip
        align="center"
        min-width="140"
      >
        <template #default="scope">
          {{ formatWorktypes(scope.row.worktypes) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('locateTask.location')"
        show-overflow-tooltip
        align="center"
        min-width="180"
      >
        <template #default="scope">
          {{ formatLocation(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('locateTask.members')"
        show-overflow-tooltip
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="getMemberCount(scope.row.members)">
            ({{ getMemberCount(scope.row.members) }})
            {{ formatMembers(scope.row.members) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('locateTask.ctime')"
        show-overflow-tooltip
        align="center"
        min-width="170"
      >
        <template #default="scope">
          {{ formatSecondTime(scope.row.ctime) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('locateTask.operate')"
        align="center"
        width="280"
        fixed="right"
      >
        <template #default="scope">
          <div class="task-operate-btns">
            <el-tooltip
              v-if="canStartTask(scope.row)"
              effect="dark"
              :content="$t('locateTask.start')"
              placement="top"
            >
              <el-button
                type="danger"
                size="small"
                class="icon_button"
                @click="changeTaskStatus(scope.row, 1)"
              >
                <img src="../../../static/start1.png" alt="" />
              </el-button>
            </el-tooltip>
            <el-tooltip
              v-if="canPauseTask(scope.row)"
              effect="dark"
              :content="$t('locateTask.pause')"
              placement="top"
            >
              <el-button
                type="danger"
                size="small"
                class="icon_button"
                @click="changeTaskStatus(scope.row, 2)"
              >
                <el-icon :size="16"><VideoPause /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip
              v-if="canStopTask(scope.row)"
              effect="dark"
              :content="$t('locateTask.stop')"
              placement="top"
            >
              <el-button
                type="danger"
                size="small"
                class="icon_button"
                @click="stopTask(scope.row)"
              >
                <img src="../../../static/stop.png" alt="" />
              </el-button>
            </el-tooltip>
            <el-dropdown size="small" type="primary" trigger="click">
              <span class="el-dropdown-link">
                <el-tooltip
                  effect="dark"
                  :content="$t('locateTask.operate')"
                  placement="top"
                >
                  <el-button type="primary" size="small" class="icon_button">
                    <img src="../../../static/control.png" alt="" />
                  </el-button>
                </el-tooltip>
              </span>
              <template #dropdown>
                <el-dropdown-menu
                  class="task-operate-menu selects"
                  style="background-color: rgb(219, 222, 231)"
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
                      :disabled="!canEditTask(scope.row)"
                      @click="openEditDialog(scope.row)"
                      >{{ $t("locateTask.edit") }}</el-button
                    >
                  </el-dropdown-item>
                  <el-dropdown-item
                    style="
                      margin-top: 4%;
                      background-color: rgb(219, 222, 231);
                    "
                  >
                    <el-button
                      size="small"
                      class="edits"
                      :disabled="!canExtendTask(scope.row)"
                      @click="openExtendDialog(scope.row)"
                      >{{ $t("locateTask.extend") }}</el-button
                    >
                  </el-dropdown-item>
                  <el-dropdown-item
                    style="
                      margin-top: 4%;
                      background-color: rgb(219, 222, 231);
                    "
                  >
                    <el-button
                      size="small"
                      class="dels"
                      @click="deleteTask(scope.row)"
                      >{{ $t("locateTask.delete") }}</el-button
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              type="success"
              size="small"
              @click="enterTask(scope.row)"
              >{{ $t("locateTask.enter") }}</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="task-pagination">
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

    <el-dialog
      :title="
        dialogMode === 'edit'
          ? $t('locateTask.editTitle')
          : $t('locateTask.addTitle')
      "
      width="560px"
      v-model="dialogVisible"
      @opened="bindTaskTimeCompactInput"
      @close="onTaskDialogClose"
    >
      <el-form
        ref="taskForm"
        :model="taskForm"
        :rules="taskRules"
        label-width="100px"
      >
        <el-form-item :label="$t('locateTask.name')" prop="name">
          <el-input
            v-model="taskForm.name"
            clearable
            :placeholder="$t('locateTask.namePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('locateTask.time')" prop="timeRange">
          <div ref="taskTimePickerWrap" class="task-time-range-row">
            <el-date-picker
              :model-value="taskForm.timeRange[0] || null"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('locateTask.starttime')"
              :disabled-date="disabledTaskDate"
              style="width: 100%"
              @update:model-value="(val) => updateTimeRangeSide(0, val)"
            />
            <span class="task-time-sep">{{ $t("locateTask.to") }}</span>
            <el-date-picker
              :model-value="taskForm.timeRange[1] || null"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('locateTask.endtime')"
              :disabled-date="disabledTaskDate"
              style="width: 100%"
              @update:model-value="(val) => updateTimeRangeSide(1, val)"
            />
          </div>
          <div class="task-time-tip">{{ $t("locateTask.timeCompactTip") }}</div>
        </el-form-item>
        <el-form-item :label="$t('locateTask.worktypes')" prop="worktypes">
          <el-select
            v-model="taskForm.worktypes"
            multiple
            filterable
            clearable
            style="width: 100%"
            :placeholder="$t('locateTask.worktypesPlaceholder')"
          >
            <el-option
              v-for="item in worktypeList"
              :key="item.id || item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('locateTask.tranches')" prop="tranches">
          <el-select
            v-model="taskForm.tranches"
            multiple
            filterable
            clearable
            style="width: 100%"
            :placeholder="$t('locateTask.tranchesPlaceholder')"
          >
            <el-option
              v-for="item in fenceList"
              :key="item.id"
              :label="item.name || item.optionname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('locateTask.location')" prop="longi">
          <div class="location-row">
            <el-input
              :model-value="locationDisplay"
              readonly
              :placeholder="$t('locateTask.locationPlaceholder')"
            />
            <el-button type="primary" @click="openLocationMap">{{
              $t("locateTask.pickLocation")
            }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">{{
            $t("locateTask.cancel")
          }}</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitTask"
            >{{ $t("locateTask.confirm") }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="locationMapVisible"
      :title="$t('locateTask.pickLocationTitle')"
      width="820px"
      append-to-body
      destroy-on-close
      @opened="onLocationMapOpened"
      @closed="onLocationMapClosed"
    >
      <div class="location-map-tip">{{ $t("locateTask.pickLocationTip") }}</div>
      <div class="location-map-wrap">
        <div ref="locationMapEl" class="location-map"></div>
        <MapLayerSwitcher
          v-if="locationMap"
          :map="locationMap"
          top="12px"
          right="12px"
          @change="onLocationMapStyleChange"
        />
      </div>
      <div class="location-map-coords" v-if="tempLongi && tempLati">
        {{ $t("locateTask.longitude") }}：{{ tempLongi }}，
        {{ $t("locateTask.latitude") }}：{{ tempLati }}
      </div>
      <template #footer>
        <el-button @click="locationMapVisible = false">{{
          $t("locateTask.cancel")
        }}</el-button>
        <el-button type="primary" @click="confirmLocationPick">{{
          $t("locateTask.confirm")
        }}</el-button>
      </template>
    </el-dialog>

    <el-dialog
      :title="$t('locateTask.extendTitle')"
      width="420px"
      v-model="extendDialogVisible"
      @opened="bindExtendTimeCompactInput"
      @close="closeExtendDialog"
    >
      <el-form label-width="100px">
        <el-form-item :label="$t('locateTask.name')">
          <span>{{ extendTaskName }}</span>
        </el-form-item>
        <el-form-item :label="$t('locateTask.endtime')">
          <span>{{ formatSecondTime(extendOriginEndSec) }}</span>
        </el-form-item>
        <el-form-item :label="$t('locateTask.extendEndtime')">
          <div ref="extendTimePickerWrap" class="extend-time-picker-wrap">
            <el-date-picker
              v-model="extendEndTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('locateTask.extendEndtimePlaceholder')"
              :disabled-date="disabledExtendEndDate"
              :disabled-hours="disabledExtendHours"
              :disabled-minutes="disabledExtendMinutes"
              :disabled-seconds="disabledExtendSeconds"
              style="width: 100%"
            />
          </div>
          <div class="task-time-tip">{{ $t("locateTask.timeCompactTip") }}</div>
        </el-form-item>
        <div class="task-time-tip">{{ $t("locateTask.extendTip") }}</div>
      </el-form>
      <template #footer>
        <el-button @click="closeExtendDialog">{{
          $t("locateTask.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="extendSubmitLoading"
          @click="submitExtendTime"
          >{{ $t("locateTask.confirm") }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { markRaw } from "vue";
import { VideoPause } from "@element-plus/icons-vue";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Icon, Style } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";
import ScaleLine from "ol/control/ScaleLine";
import "ol/ol.css";
import {
  createOutdoorBaseLayers,
  refreshBaseTiles,
} from "../../utils/mapSource";
import MapLayerSwitcher from "../../components/map/MapLayerSwitcher";
import mapStyleMixin from "../../mixins/mapStyleMixin";
import {
  getLocateTaskList,
  insertLocateTask,
  updateLocateTask,
  updateLocateTaskStatus,
  extendLocateTaskEndtime,
  delLocateTask,
  getMemberType,
  getFenceManageList,
} from "../../axios/api";

// status: 0 未开始 / 1 进行中 / 2 已暂停 / 3 已结束
const TASK_STATUS = {
  NOT_STARTED: 0,
  RUNNING: 1,
  PAUSED: 2,
  ENDED: 3,
};

export default {
  name: "TaskManagement",
  components: { MapLayerSwitcher, VideoPause },
  mixins: [mapStyleMixin],
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogMode: "add",
      extendDialogVisible: false,
      extendSubmitLoading: false,
      extendTaskId: "",
      extendTaskName: "",
      extendOriginEnd: null,
      extendOriginEndSec: "",
      extendEndTime: null,
      searchList: {
        name: "",
        page: 1,
        count: 20,
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      pageCount: 20,
      worktypeList: [],
      fenceList: [],
      taskForm: {
        id: "",
        name: "",
        timeRange: [null, null],
        worktypes: [],
        tranches: [],
        longi: "",
        lati: "",
      },
      locationMapVisible: false,
      locationMap: null,
      locationView: null,
      locationMarkerSource: null,
      locationClickKey: null,
      outdoorBaseLayers: [],
      tempLongi: "",
      tempLati: "",
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
    locationDisplay() {
      if (this.taskForm.longi && this.taskForm.lati) {
        return `${this.taskForm.longi}, ${this.taskForm.lati}`;
      }
      return "";
    },
    taskRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t("locateTask.nameRequired"),
            trigger: "blur",
          },
        ],
        timeRange: [
          {
            validator: (rule, value, callback) => {
              const range = Array.isArray(value) ? value : [];
              const hasStart = range[0] instanceof Date;
              const hasEnd = range[1] instanceof Date;
              // 都为空：允许不填
              if (!hasStart && !hasEnd) {
                callback();
                return;
              }
              // 只填一侧：不允许
              if (hasStart !== hasEnd) {
                callback(new Error(this.$t("locateTask.timePairRequired")));
                return;
              }
              this.validateTaskTimeRange(rule, range, callback);
            },
            trigger: "change",
          },
        ],
        worktypes: [
          {
            required: true,
            type: "array",
            min: 1,
            message: this.$t("locateTask.worktypesRequired"),
            trigger: "change",
          },
        ],
        tranches: [
          {
            required: true,
            type: "array",
            min: 1,
            message: this.$t("locateTask.tranchesRequired"),
            trigger: "change",
          },
        ],
        longi: [
          {
            validator: this.validateLocation,
            trigger: "change",
          },
        ],
      };
    },
  },
  beforeUnmount() {
    this.unbindTaskTimeCompactInput();
    this.unbindExtendTimeCompactInput();
    this.destroyLocationMap();
  },
  mounted() {
    this.getTaskList();
    this.getWorktypeList();
    this.getFenceList();
  },
  watch: {
    "$store.state.projectid"() {
      this.searchList.page = 1;
      this.currentPage = 1;
      this.getTaskList();
      this.getWorktypeList();
      this.getFenceList();
    },
  },
  methods: {
    searchInfo() {
      this.searchList.page = 1;
      this.currentPage = 1;
      this.getTaskList();
    },
    resetSearch() {
      this.searchList.name = "";
      this.searchList.page = 1;
      this.searchList.count = this.pageCount;
      this.currentPage = 1;
      this.getTaskList();
    },
    handleCurrentChange(page) {
      this.searchList.page = page;
      this.searchList.count = this.pageCount;
      this.getTaskList();
    },
    handleSizeChange(count) {
      this.pageCount = count;
      this.searchList.count = count;
      this.searchList.page = 1;
      this.currentPage = 1;
      this.getTaskList();
    },
    // 从 members[].worktype 汇总去重后的角色
    extractWorktypesFromMembers(members) {
      if (!Array.isArray(members) || !members.length) return [];
      const set = new Set();
      members.forEach((item) => {
        const type = item && item.worktype;
        if (type != null && String(type).trim() !== "") {
          set.add(String(type).trim());
        }
      });
      return Array.from(set);
    },
    // 逗号分隔字符串 / 数组 → 多选数组
    parseCommaList(value) {
      if (Array.isArray(value)) {
        return value
          .map((item) => (item == null ? "" : String(item).trim()))
          .filter(Boolean);
      }
      if (value == null || value === "") return [];
      return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    },
    // 围栏 id 回填：与下拉 option 的 id 类型对齐
    parseTrancheIds(value) {
      const ids = this.parseCommaList(value);
      return ids.map((id) => {
        const found = this.fenceList.find(
          (item) => String(item.id) === String(id)
        );
        return found ? found.id : id;
      });
    },
    normalizeTaskRow(row) {
      const fromApi = this.parseCommaList(row && row.worktypes);
      const worktypes =
        fromApi.length > 0
          ? fromApi
          : this.extractWorktypesFromMembers(row && row.members);
      return {
        ...(row || {}),
        worktypes,
        tranches: this.parseCommaList(row && row.tranches).join(","),
      };
    },
    getTaskList() {
      const that = this;
      this.loading = true;
      getLocateTaskList(
        {
          projectid: this.$store.state.projectid,
          name: this.searchList.name,
          page: this.searchList.page,
          count: this.searchList.count,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res.code == 1001) {
            const data = res.data || {};
            that.tableData = (data.list || []).map((item) =>
              that.normalizeTaskRow(item)
            );
            that.total = data.size || 0;
          } else {
            that.tableData = [];
            that.total = 0;
            that.$message({
              message: (res && res.msg) || that.$t("locateTask.searchfaile"),
              type: "warning",
            });
          }
        })
        .catch(() => {
          that.tableData = [];
          that.total = 0;
          that.$message({
            message: that.$t("locateTask.searchfaile"),
            type: "warning",
          });
        })
        .finally(() => {
          that.loading = false;
        });
    },
    getWorktypeList() {
      const that = this;
      getMemberType(
        {
          tenantid: this.tenantid_A,
          projectid: this.$store.state.projectid,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.worktypeList = res.data || [];
        } else {
          that.worktypeList = [];
        }
      });
    },
    getFenceList() {
      const that = this;
      getFenceManageList(
        {
          flag: true,
          projectid: this.$store.state.projectid,
          groundid: 0,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.fenceList = res.data || [];
        } else {
          that.fenceList = [];
        }
      });
    },
    openAddDialog() {
      this.dialogMode = "add";
      this.taskForm = {
        id: "",
        name: "",
        timeRange: [null, null],
        worktypes: [],
        tranches: [],
        longi: "",
        lati: "",
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.taskForm) {
          this.$refs.taskForm.clearValidate();
        }
      });
    },
    openEditDialog(row) {
      if (!this.canEditTask(row)) {
        this.$message({
          message: this.$t("locateTask.editOnlyNotStarted"),
          type: "warning",
        });
        return;
      }
      this.dialogMode = "edit";
      const worktypesFromApi = this.parseCommaList(row.worktypes);
      const worktypes =
        worktypesFromApi.length > 0
          ? worktypesFromApi
          : this.extractWorktypesFromMembers(row.members);
      this.taskForm = {
        id: row.id,
        name: row.name || "",
        timeRange:
          row.begintime && row.endtime
            ? [
                new Date(Number(row.begintime) * 1000),
                new Date(Number(row.endtime) * 1000),
              ]
            : [null, null],
        worktypes,
        tranches: this.parseTrancheIds(row.tranches),
        longi:
          row.longi != null && row.longi !== ""
            ? String(row.longi)
            : "",
        lati:
          row.lati != null && row.lati !== "" ? String(row.lati) : "",
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.taskForm) {
          this.$refs.taskForm.clearValidate();
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    onTaskDialogClose() {
      this.unbindTaskTimeCompactInput();
      this.submitLoading = false;
      if (this.$refs.taskForm) {
        this.$refs.taskForm.resetFields();
      }
    },
    // 支持输入 20240924122020 → 转为标准时间后再交给 el-date-picker 解析
    parseCompactDateTime(text) {
      if (!/^\d{14}$/.test(String(text || "").trim())) return null;
      const s = String(text).trim();
      const y = Number(s.slice(0, 4));
      const m = Number(s.slice(4, 6));
      const d = Number(s.slice(6, 8));
      const h = Number(s.slice(8, 10));
      const mi = Number(s.slice(10, 12));
      const se = Number(s.slice(12, 14));
      if (
        m < 1 ||
        m > 12 ||
        d < 1 ||
        d > 31 ||
        h > 23 ||
        mi > 59 ||
        se > 59
      ) {
        return null;
      }
      const date = new Date(y, m - 1, d, h, mi, se);
      if (
        date.getFullYear() !== y ||
        date.getMonth() !== m - 1 ||
        date.getDate() !== d ||
        date.getHours() !== h ||
        date.getMinutes() !== mi ||
        date.getSeconds() !== se
      ) {
        return null;
      }
      return date;
    },
    formatDateTimeDisplay(date) {
      const pad = (num) => (num < 10 ? "0" + num : "" + num);
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
    applyCompactTimeFromInput(el) {
      if (!el || el.tagName !== "INPUT") return false;
      const date = this.parseCompactDateTime(el.value);
      if (!date) return false;

      const root = this._taskTimeCompactRoot;
      const inputs = root
        ? Array.from(root.querySelectorAll(".el-date-editor input"))
        : [];
      const index = inputs.indexOf(el);
      if (index !== 0 && index !== 1) return false;

      const formatted = this.formatDateTimeDisplay(date);
      el.value = formatted;
      // 同步 EP 内部 userInput，避免失焦后被旧值覆盖
      el.dispatchEvent(new Event("input", { bubbles: true }));
      this.updateTimeRangeSide(index, date);
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    },
    updateTimeRangeSide(index, value) {
      const next = Array.isArray(this.taskForm.timeRange)
        ? [...this.taskForm.timeRange]
        : [null, null];
      while (next.length < 2) next.push(null);
      next[index] = value || null;
      // 选择/输入开始时间后，默认结束时间 = 开始时间 + 2 小时（仍可再改）
      if (index === 0) {
        if (next[0] instanceof Date) {
          next[1] = new Date(next[0].getTime() + 2 * 60 * 60 * 1000);
        } else {
          // 清空开始时一并清空结束，避免只剩一侧
          next[1] = null;
        }
      }
      this.taskForm.timeRange = next;
      this.$nextTick(() => {
        if (this.$refs.taskForm) {
          this.$refs.taskForm.validateField("timeRange");
        }
      });
    },
    bindTaskTimeCompactInput() {
      this.$nextTick(() => {
        this.unbindTaskTimeCompactInput();
        const root = this.$refs.taskTimePickerWrap;
        if (!root || typeof root.addEventListener !== "function") return;
        this._taskTimeCompactRoot = root;
        this._taskTimeCompactOnFocusOut = (e) => {
          this.applyCompactTimeFromInput(e.target);
        };
        this._taskTimeCompactOnKeydown = (e) => {
          if (
            e.key === "Enter" ||
            e.code === "Enter" ||
            e.code === "NumpadEnter"
          ) {
            this.applyCompactTimeFromInput(e.target);
          }
        };
        root.addEventListener(
          "focusout",
          this._taskTimeCompactOnFocusOut,
          true
        );
        root.addEventListener(
          "keydown",
          this._taskTimeCompactOnKeydown,
          true
        );
      });
    },
    unbindTaskTimeCompactInput() {
      if (this._taskTimeCompactRoot) {
        this._taskTimeCompactRoot.removeEventListener(
          "focusout",
          this._taskTimeCompactOnFocusOut,
          true
        );
        this._taskTimeCompactRoot.removeEventListener(
          "keydown",
          this._taskTimeCompactOnKeydown,
          true
        );
      }
      this._taskTimeCompactRoot = null;
      this._taskTimeCompactOnFocusOut = null;
      this._taskTimeCompactOnKeydown = null;
    },
    applyExtendCompactTimeFromInput(el) {
      if (!el || el.tagName !== "INPUT") return false;
      const date = this.parseCompactDateTime(el.value);
      if (!date) return false;
      const formatted = this.formatDateTimeDisplay(date);
      el.value = formatted;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      this.extendEndTime = date;
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    },
    bindExtendTimeCompactInput() {
      this.$nextTick(() => {
        this.unbindExtendTimeCompactInput();
        const root = this.$refs.extendTimePickerWrap;
        if (!root || typeof root.addEventListener !== "function") return;
        this._extendTimeCompactRoot = root;
        this._extendTimeCompactOnFocusOut = (e) => {
          this.applyExtendCompactTimeFromInput(e.target);
        };
        this._extendTimeCompactOnKeydown = (e) => {
          if (
            e.key === "Enter" ||
            e.code === "Enter" ||
            e.code === "NumpadEnter"
          ) {
            this.applyExtendCompactTimeFromInput(e.target);
          }
        };
        root.addEventListener(
          "focusout",
          this._extendTimeCompactOnFocusOut,
          true
        );
        root.addEventListener(
          "keydown",
          this._extendTimeCompactOnKeydown,
          true
        );
      });
    },
    unbindExtendTimeCompactInput() {
      if (this._extendTimeCompactRoot) {
        this._extendTimeCompactRoot.removeEventListener(
          "focusout",
          this._extendTimeCompactOnFocusOut,
          true
        );
        this._extendTimeCompactRoot.removeEventListener(
          "keydown",
          this._extendTimeCompactOnKeydown,
          true
        );
      }
      this._extendTimeCompactRoot = null;
      this._extendTimeCompactOnFocusOut = null;
      this._extendTimeCompactOnKeydown = null;
    },
    formatSecondTime(value) {
      if (value == null || value === "" || Number(value) === 0) return "";
      const date = new Date(Number(value) * 1000);
      if (Number.isNaN(date.getTime())) return "";
      const pad = (num) => (num < 10 ? "0" + num : "" + num);
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
    formatWorktypes(value) {
      if (value == null || value === "") return "";
      if (Array.isArray(value)) return value.filter(Boolean).join("、");
      return String(value);
    },
    formatLocation(row) {
      if (!row) return "";
      const longi = row.longi;
      const lati = row.lati;
      if (
        longi == null ||
        longi === "" ||
        lati == null ||
        lati === ""
      ) {
        return "";
      }
      return `${longi}, ${lati}`;
    },
    formatMembers(members) {
      if (!Array.isArray(members) || !members.length) return "";
      return members
        .map((item) => item && item.username)
        .filter(Boolean)
        .join("、");
    },
    getMemberCount(members) {
      return Array.isArray(members) ? members.length : 0;
    },
    getTaskStatus(row) {
      if (!row || row.status === null || row.status === undefined || row.status === "") {
        return TASK_STATUS.NOT_STARTED;
      }
      const status = Number(row.status);
      return Number.isNaN(status) ? TASK_STATUS.NOT_STARTED : status;
    },
    formatTaskStatus(row) {
      const status = this.getTaskStatus(row);
      if (status === TASK_STATUS.RUNNING) {
        return this.$t("locateTask.statusRunning");
      }
      if (status === TASK_STATUS.PAUSED) {
        return this.$t("locateTask.statusPaused");
      }
      if (status === TASK_STATUS.ENDED) {
        return this.$t("locateTask.statusEnded");
      }
      return this.$t("locateTask.statusNotStarted");
    },
    getTaskStatusTagType(row) {
      const status = this.getTaskStatus(row);
      if (status === TASK_STATUS.RUNNING) return "success";
      if (status === TASK_STATUS.PAUSED) return "warning";
      if (status === TASK_STATUS.ENDED) return "info";
      return "";
    },
    canStartTask(row) {
      const status = this.getTaskStatus(row);
      return (
        status === TASK_STATUS.NOT_STARTED || status === TASK_STATUS.PAUSED
      );
    },
    canPauseTask(row) {
      return this.getTaskStatus(row) === TASK_STATUS.RUNNING;
    },
    canStopTask(row) {
      const status = this.getTaskStatus(row);
      return status === TASK_STATUS.RUNNING || status === TASK_STATUS.PAUSED;
    },
    canExtendTask(row) {
      const status = this.getTaskStatus(row);
      return status === TASK_STATUS.RUNNING || status === TASK_STATUS.PAUSED;
    },
    canEditTask(row) {
      return this.getTaskStatus(row) === TASK_STATUS.NOT_STARTED;
    },
    changeTaskStatus(row, status) {
      const that = this;
      const actionKey =
        status === TASK_STATUS.RUNNING
          ? "start"
          : status === TASK_STATUS.PAUSED
            ? "pause"
            : "stop";
      updateLocateTaskStatus(
        { id: row.id, status },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res.code == 1001) {
            row.status = status;
            that.$message({
              message: that.$t(`locateTask.${actionKey}success`),
              type: "success",
            });
          } else {
            that.$message({
              message:
                (that.$store.state.i18n == "zh" ? res.msg : res.enMsg) ||
                that.$t(`locateTask.${actionKey}faile`),
              type: "warning",
            });
          }
        })
        .catch(() => {
          that.$message({
            message: that.$t(`locateTask.${actionKey}faile`),
            type: "warning",
          });
        });
    },
    stopTask(row) {
      this.$confirm(
        this.$t("locateTask.stopConfirm", { name: row.name || "" }),
        this.$t("beacon.prompt"),
        {
          confirmButtonText: this.$t("locateTask.confirm"),
          cancelButtonText: this.$t("locateTask.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.changeTaskStatus(row, TASK_STATUS.ENDED);
        })
        .catch(() => {});
    },
    openExtendDialog(row) {
      if (!this.canExtendTask(row)) {
        this.$message({
          message: this.$t("locateTask.extendOnlyAfterStart"),
          type: "warning",
        });
        return;
      }
      if (!row || row.endtime == null || row.endtime === "") {
        this.$message({
          message: this.$t("locateTask.extendNoEndtime"),
          type: "warning",
        });
        return;
      }
      const endMs =
        Number(row.endtime) < 1e12
          ? Number(row.endtime) * 1000
          : Number(row.endtime);
      if (Number.isNaN(endMs)) {
        this.$message({
          message: this.$t("locateTask.extendNoEndtime"),
          type: "warning",
        });
        return;
      }
      this.extendTaskId = row.id;
      this.extendTaskName = row.name || "";
      this.extendOriginEnd = new Date(endMs);
      this.extendOriginEndSec = Number(row.endtime);
      // 默认选中原结束时间后 1 小时，便于直接确认
      const defaultEnd = new Date(endMs + 60 * 60 * 1000);
      this.extendEndTime = defaultEnd;
      this.extendDialogVisible = true;
    },
    closeExtendDialog() {
      this.unbindExtendTimeCompactInput();
      this.extendDialogVisible = false;
      this.extendSubmitLoading = false;
      this.extendTaskId = "";
      this.extendTaskName = "";
      this.extendOriginEnd = null;
      this.extendOriginEndSec = "";
      this.extendEndTime = null;
    },
    isSameCalendarDay(a, b) {
      if (!(a instanceof Date) || !(b instanceof Date)) return false;
      return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
      );
    },
    disabledExtendEndDate(time) {
      const origin = this.extendOriginEnd;
      if (!(origin instanceof Date)) return false;
      const day = new Date(origin);
      day.setHours(0, 0, 0, 0);
      return time.getTime() < day.getTime();
    },
    disabledExtendHours() {
      const origin = this.extendOriginEnd;
      if (!(origin instanceof Date)) return [];
      const selected =
        this.extendEndTime instanceof Date ? this.extendEndTime : origin;
      if (!this.isSameCalendarDay(selected, origin)) return [];
      const max = origin.getHours();
      const hours = [];
      for (let i = 0; i < max; i += 1) hours.push(i);
      return hours;
    },
    disabledExtendMinutes(hour) {
      const origin = this.extendOriginEnd;
      if (!(origin instanceof Date)) return [];
      const selected =
        this.extendEndTime instanceof Date ? this.extendEndTime : origin;
      if (!this.isSameCalendarDay(selected, origin)) return [];
      if (hour > origin.getHours()) return [];
      if (hour < origin.getHours()) {
        return Array.from({ length: 60 }, (_, i) => i);
      }
      const max = origin.getMinutes();
      const minutes = [];
      for (let i = 0; i < max; i += 1) minutes.push(i);
      return minutes;
    },
    disabledExtendSeconds(hour, minute) {
      const origin = this.extendOriginEnd;
      if (!(origin instanceof Date)) return [];
      const selected =
        this.extendEndTime instanceof Date ? this.extendEndTime : origin;
      if (!this.isSameCalendarDay(selected, origin)) return [];
      if (
        hour !== origin.getHours() ||
        minute !== origin.getMinutes()
      ) {
        return [];
      }
      const max = origin.getSeconds();
      const seconds = [];
      for (let i = 0; i <= max; i += 1) seconds.push(i);
      return seconds;
    },
    submitExtendTime() {
      if (!(this.extendEndTime instanceof Date)) {
        this.$message({
          message: this.$t("locateTask.extendEndtimeRequired"),
          type: "warning",
        });
        return;
      }
      const origin = this.extendOriginEnd;
      if (!(origin instanceof Date)) return;
      if (this.extendEndTime.getTime() <= origin.getTime()) {
        this.$message({
          message: this.$t("locateTask.extendEndtimeInvalid"),
          type: "warning",
        });
        return;
      }
      const that = this;
      const endtime = this.toTimestamp(this.extendEndTime);
      this.extendSubmitLoading = true;
      extendLocateTaskEndtime(
        { id: this.extendTaskId, endtime },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("locateTask.extendsuccess"),
              type: "success",
            });
            that.closeExtendDialog();
            that.getTaskList();
          } else {
            that.$message({
              message:
                (that.$store.state.i18n == "zh" ? res.msg : res.enMsg) ||
                that.$t("locateTask.extendfaile"),
              type: "warning",
            });
          }
        })
        .catch(() => {
          that.$message({
            message: that.$t("locateTask.extendfaile"),
            type: "warning",
          });
        })
        .finally(() => {
          that.extendSubmitLoading = false;
        });
    },
    enterTask(row) {
      try {
        sessionStorage.setItem("locateTaskDetail", JSON.stringify(row || {}));
      } catch (e) {}
      this.$router.push({
        path: "/taskdetail",
        query: {
          id: row && row.id != null ? String(row.id) : "",
        },
      });
    },
    deleteTask(row) {
      const that = this;
      this.$confirm(
        this.$t("locateTask.deleteConfirm", { name: row.name || "" }),
        this.$t("beacon.prompt"),
        {
          confirmButtonText: this.$t("locateTask.confirm"),
          cancelButtonText: this.$t("locateTask.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          delLocateTask(
            { id: row.id },
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          )
            .then((res) => {
              if (res.code == 1001) {
                that.$message({
                  message: that.$t("locateTask.deletesuccess"),
                  type: "success",
                });
                if (that.tableData.length === 1 && that.searchList.page > 1) {
                  that.searchList.page -= 1;
                  that.currentPage = that.searchList.page;
                }
                that.getTaskList();
              } else {
                that.$message({
                  message:
                    (that.$store.state.i18n == "zh" ? res.msg : res.enMsg) ||
                    that.$t("locateTask.deletefaile"),
                  type: "warning",
                });
              }
            })
            .catch(() => {
              that.$message({
                message: that.$t("locateTask.deletefaile"),
                type: "warning",
              });
            });
        })
        .catch(() => {});
    },
    toTimestamp(value) {
      if (value == null || value === "") return "";
      let ms;
      if (typeof value === "number") {
        ms = value;
      } else if (value instanceof Date) {
        ms = value.getTime();
      } else {
        ms = new Date(value).getTime();
      }
      if (Number.isNaN(ms)) return "";
      return ms < 1e12 ? Math.floor(ms) : Math.floor(ms / 1000);
    },
    // 添加/编辑任务：开始时间不能早于当前时间；结束时间需晚于开始时间
    disabledTaskDate(time) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      return time.getTime() < day.getTime();
    },
    validateTaskTimeRange(rule, value, callback) {
      const startMs =
        value[0] instanceof Date
          ? value[0].getTime()
          : new Date(value[0]).getTime();
      const endMs =
        value[1] instanceof Date
          ? value[1].getTime()
          : new Date(value[1]).getTime();
      if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
        callback(new Error(this.$t("locateTask.timeRequired")));
        return;
      }
      if (endMs <= startMs) {
        callback(new Error(this.$t("locateTask.timeOrderInvalid")));
        return;
      }
      if (startMs < Date.now() - 1000) {
        callback(new Error(this.$t("locateTask.starttimeNotPast")));
        return;
      }
      callback();
    },
    validateLocation(rule, value, callback) {
      const longi = Number(this.taskForm.longi);
      const lati = Number(this.taskForm.lati);
      if (
        this.taskForm.longi === "" ||
        this.taskForm.lati === "" ||
        !Number.isFinite(longi) ||
        !Number.isFinite(lati)
      ) {
        callback(new Error(this.$t("locateTask.locationRequired")));
        return;
      }
      callback();
    },
    openLocationMap() {
      this.tempLongi = this.taskForm.longi || "";
      this.tempLati = this.taskForm.lati || "";
      this.locationMapVisible = true;
    },
    onLocationMapOpened() {
      this.$nextTick(() => {
        this.initLocationMap();
      });
    },
    onLocationMapClosed() {
      this.destroyLocationMap();
    },
    destroyLocationMap() {
      if (this.locationMap) {
        try {
          this.locationMap.un("singleclick", this.onLocationMapClick);
        } catch (e) {}
        try {
          this.locationMap.setTarget(null);
        } catch (e) {}
      }
      this.locationClickKey = null;
      this.locationMap = null;
      this.locationView = null;
      this.locationMarkerSource = null;
      this.outdoorBaseLayers = [];
    },
    initLocationMap() {
      const target = this.$refs.locationMapEl;
      if (!target) return;
      this.destroyLocationMap();

      const isZh = this.$store.state.i18n === "zh";
      const baseLayers = createOutdoorBaseLayers(
        isZh,
        this.mapBaseStyle
      ).map((layer) => markRaw(layer));
      this.outdoorBaseLayers = baseLayers;

      this.locationMarkerSource = markRaw(new VectorSource());
      const markerLayer = markRaw(
        new VectorLayer({
          source: this.locationMarkerSource,
          zIndex: 10,
        })
      );

      const defaultLongi =
        Number(this.tempLongi) ||
        Number(this.$store.state.longis) ||
        116.397428;
      const defaultLati =
        Number(this.tempLati) ||
        Number(this.$store.state.latis) ||
        39.90923;

      this.locationView = markRaw(
        new View({
          center: fromLonLat([defaultLongi, defaultLati]),
          zoom: 15,
        })
      );
      this.locationMap = markRaw(
        new Map({
          target,
          layers: [...baseLayers, markerLayer],
          view: this.locationView,
        })
      );
      this.locationMap.addControl(new ScaleLine());
      this.locationMap.on("singleclick", this.onLocationMapClick);

      if (this.tempLongi && this.tempLati) {
        this.setLocationMarker(Number(this.tempLongi), Number(this.tempLati));
      }

      const refreshSize = () => {
        if (!this.locationMap) return;
        this.locationMap.updateSize();
        refreshBaseTiles(this.locationMap);
      };
      this.$nextTick(() => {
        refreshSize();
        requestAnimationFrame(refreshSize);
        setTimeout(refreshSize, 200);
      });
    },
    onLocationMapStyleChange(style) {
      this.mapBaseStyle = style;
      const isZh = this.$store.state.i18n === "zh";
      this.outdoorBaseLayers = createOutdoorBaseLayers(isZh, style).map(
        (layer) => markRaw(layer)
      );
      if (this.locationMap) {
        this.locationMap.updateSize();
        refreshBaseTiles(this.locationMap);
      }
    },
    onLocationMapClick(evt) {
      if (!evt || !evt.coordinate) return;
      const lonLat = toLonLat(evt.coordinate);
      const longi = Number(lonLat[0].toFixed(6));
      const lati = Number(lonLat[1].toFixed(6));
      this.tempLongi = String(longi);
      this.tempLati = String(lati);
      this.setLocationMarker(longi, lati);
    },
    setLocationMarker(longi, lati) {
      if (!this.locationMarkerSource) return;
      this.locationMarkerSource.clear();
      const feature = markRaw(
        new Feature({
          geometry: new Point(fromLonLat([longi, lati])),
        })
      );
      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: "../../../static/1.png",
            scale: 1,
          }),
        })
      );
      this.locationMarkerSource.addFeature(feature);
    },
    confirmLocationPick() {
      if (!this.tempLongi || !this.tempLati) {
        this.$message({
          message: this.$t("locateTask.locationRequired"),
          type: "warning",
        });
        return;
      }
      this.taskForm.longi = this.tempLongi;
      this.taskForm.lati = this.tempLati;
      this.locationMapVisible = false;
      this.$nextTick(() => {
        if (this.$refs.taskForm) {
          this.$refs.taskForm.validateField("longi");
        }
      });
    },
    submitTask() {
      this.$refs.taskForm.validate((valid) => {
        if (!valid) return;
        const that = this;
        const range = this.taskForm.timeRange || [];
        const payload = {
          name: this.taskForm.name,
          projectid: this.$store.state.projectid,
          begintime: this.toTimestamp(range[0]),
          endtime: this.toTimestamp(range[1]),
          // 角色、围栏 id：多个用逗号分隔的字符串
          worktypes: (this.taskForm.worktypes || []).join(","),
          tranches: (this.taskForm.tranches || []).join(","),
          longi: Number(this.taskForm.longi),
          lati: Number(this.taskForm.lati),
        };
        const isEdit = this.dialogMode === "edit";
        if (isEdit) {
          payload.id = this.taskForm.id;
        }
        this.submitLoading = true;
        const request = isEdit ? updateLocateTask : insertLocateTask;
        request(payload, this.tenantkey_A, this.tenantid_A, this.userName)
          .then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t(
                  isEdit ? "locateTask.editsuccess" : "locateTask.addsuccess"
                ),
                type: "success",
              });
              that.closeDialog();
              that.getTaskList();
            } else {
              that.$message({
                message:
                  (that.$store.state.i18n == "zh" ? res.msg : res.enMsg) ||
                  that.$t(
                    isEdit ? "locateTask.editfaile" : "locateTask.addfaile"
                  ),
                type: "warning",
              });
            }
          })
          .catch(() => {
            that.$message({
              message: that.$t(
                isEdit ? "locateTask.editfaile" : "locateTask.addfaile"
              ),
              type: "warning",
            });
          })
          .finally(() => {
            that.submitLoading = false;
          });
      });
    },
  },
};
</script>

<style scoped>
.task-management-page {
  min-height: 100%;
  padding: 16px 8px 24px;
  background: #fff;
  box-sizing: border-box;
}
.task-time-tip {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: #909399;
}
.task-time-range-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.task-time-sep {
  flex-shrink: 0;
  color: #606266;
  font-size: 13px;
}
.task-operate-btns {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.task-operate-btns :deep(.el-button) {
  height: 24px;
  min-height: 24px;
  padding: 0 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.task-operate-btns .icon_button {
  padding: 0 11px !important;
}
.task-operate-btns .icon_button img {
  display: block;
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.task-operate-btns :deep(.el-dropdown),
.task-operate-btns :deep(.el-dropdown-link),
.task-operate-btns :deep(.el-tooltip__trigger) {
  display: inline-flex;
  align-items: center;
  height: 24px;
  line-height: 24px;
}
.terminal-filter-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  margin: 0 1% 16px;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item,
.terminal-filter-flow .terminal-toolbar-item {
  width: auto !important;
  margin: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  padding: 0 8px 0 0 !important;
  line-height: 32px;
  white-space: nowrap;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input) {
  width: 220px;
}
.terminal-toolbar-item :deep(.el-form-item__content) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.terminal-filter-flow .query,
.terminal-filter-flow .reset {
  height: 32px;
  padding: 7px 15px;
}
.task-pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.location-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.location-row :deep(.el-input) {
  flex: 1;
}
.location-map-tip {
  margin-bottom: 8px;
  color: #606266;
  font-size: 13px;
}
.location-map-wrap {
  position: relative;
  width: 100%;
  height: 460px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}
.location-map {
  width: 100%;
  height: 100%;
}
.location-map-coords {
  margin-top: 10px;
  color: #303133;
  font-size: 13px;
}
</style>

<style>
.task-operate-menu.selects button {
  width: 100%;
  text-align: left;
}
.task-operate-menu .edits:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.task-operate-menu .dels:hover {
  background-color: rgb(196, 27, 27);
  color: white;
}
</style>
