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
        width="220"
        fixed="right"
      >
        <template #default="scope">
          <el-button type="success" link @click="enterTask(scope.row)">{{
            $t("locateTask.enter")
          }}</el-button>
          <el-button type="primary" link @click="openEditDialog(scope.row)">{{
            $t("locateTask.edit")
          }}</el-button>
          <el-button type="danger" link @click="deleteTask(scope.row)">{{
            $t("locateTask.delete")
          }}</el-button>
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
      @close="closeDialog"
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
          <el-date-picker
            v-model="taskForm.timeRange"
            type="datetimerange"
            :range-separator="$t('locateTask.to')"
            :start-placeholder="$t('locateTask.starttime')"
            :end-placeholder="$t('locateTask.endtime')"
            :disabled-date="disabledTaskDate"
            style="width: 100%"
          />
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
  </div>
</template>

<script>
import { markRaw } from "vue";
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
  delLocateTask,
  getMemberType,
  getFenceManageList,
} from "../../axios/api";

export default {
  name: "TaskManagement",
  components: { MapLayerSwitcher },
  mixins: [mapStyleMixin],
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogMode: "add",
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
        timeRange: [],
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
            required: true,
            type: "array",
            min: 2,
            message: this.$t("locateTask.timeRequired"),
            trigger: "change",
          },
          {
            validator: this.validateTaskTimeRange,
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
        timeRange: [],
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
            : [],
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
      this.submitLoading = false;
      if (this.$refs.taskForm) {
        this.$refs.taskForm.resetFields();
      }
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
      if (!value || !Array.isArray(value) || value.length < 2 || !value[0]) {
        callback();
        return;
      }
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
