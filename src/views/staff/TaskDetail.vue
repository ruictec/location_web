<template>
  <div class="task-detail-page">
    <div class="task-detail-header">
      <div class="header-left">
        <button type="button" class="back-btn" @click="goBack">
          {{ $t("locateTask.back") }}
        </button>
      </div>
      <div class="header-center">
        <div class="task-name" :title="task.name">{{ task.name || "-" }}</div>
      </div>
      <div class="header-right">
        <span class="attend-item">
          <span class="attend-label">{{ $t("locateTask.attendCount") }}</span>
          <span class="attend-value"
            >{{ onlineCount }}<span class="attend-sep">/</span
            >{{ totalCount }}</span
          >
        </span>
        <span class="attend-item">
          <span class="attend-label">{{ $t("locateTask.outsideFenceCount") }}</span>
          <span class="attend-value">{{ outsideFenceCount }}</span>
        </span>
      </div>
    </div>

    <div class="task-detail-body">
      <div class="map-wrap">
        <div ref="mapEl" class="task-detail-map"></div>
        <MapLayerSwitcher
          v-if="map"
          :map="map"
          top="16px"
          right="16px"
          @change="onMapStyleChange"
        />
      </div>

      <aside class="side-panel" :class="{ collapsed: panelCollapsed }">
        <button
          type="button"
          class="collapse-btn"
          @click="panelCollapsed = !panelCollapsed"
        >
          {{ panelCollapsed ? "›" : "‹" }}
        </button>

        <div class="side-panel-inner" v-show="!panelCollapsed">
          <div class="countdown-card">
            <div class="countdown-label">{{ $t("locateTask.taskTime") }}</div>
            <div class="countdown-value">{{ countdownText }}</div>
            <div class="countdown-range">
              {{ formatSecondTime(task.begintime) }}
              ~
              {{ formatSecondTime(task.endtime) }}
            </div>
          </div>

          <div class="member-panel">
            <el-input
              v-model="memberKeyword"
              clearable
              size="small"
              class="member-search"
              :placeholder="$t('locateTask.memberSearch')"
            />
            <el-table
              ref="memberTable"
              :data="filteredMembers"
              height="100%"
              size="small"
              border
              :row-key="getMemberRowKey"
              @selection-change="onSelectionChange"
              :row-class-name="memberRowClassName"
            >
              <el-table-column type="selection" width="36" align="center" />
              <el-table-column
                :label="$t('locateTask.memberName')"
                min-width="90"
                show-overflow-tooltip
                align="left"
              >
                <template #default="scope">
                  <span class="member-name-cell">
                    <img
                      class="colour-icon"
                      :src="getColourIcon(scope.row.colour)"
                      alt=""
                    />
                    <span
                      class="member-name-link"
                      :style="{ color: getColourText(scope.row.colour) }"
                    >
                      {{ scope.row.username || "-" }}
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('locateTask.speedCol')"
                min-width="80"
                align="center"
              >
                <template #default="scope">
                  {{ formatMemberSpeed(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('locateTask.altitude')"
                min-width="80"
                align="center"
              >
                <template #default="scope">
                  {{ formatMemberAltitude(scope.row) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { markRaw } from "vue";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Icon, Style, Fill, Stroke, Text, RegularShape } from "ol/style";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import Zoom from "ol/control/Zoom";
import Rotate from "ol/control/Rotate";
import ScaleLine from "ol/control/ScaleLine";
import "ol/ol.css";
import {
  createOutdoorBaseLayers,
  refreshBaseTiles,
} from "../../utils/mapSource";
import MapLayerSwitcher from "../../components/map/MapLayerSwitcher";
import mapStyleMixin from "../../mixins/mapStyleMixin";
import host from "../../host.js";
import {
  getLastDevGpsByDeveuis,
  getFenceManageAndPointByIds,
  getDevGpsHistoryByDeveuiList,
} from "../../axios/api";

const TASK_CACHE_KEY = "locateTaskDetail";
const GPS_STALE_SECONDS = 10 * 60;
const TRACK_ARROW_SPACING_PX = 80;
const WS_RECONNECT_DELAY = 3000;
const WS_RECONNECT_MAX = 3;

// 与角色管理 / 室内外定位一致：colour 1-10 对应 static/1.png ... 10.png
const COLOUR_TEXT_MAP = {
  1: "#3db7e8",
  2: "#c8d018",
  3: "#e838e8",
  4: "#78c0c0",
  5: "#000000",
  6: "#a0f0a0",
  7: "#e03058",
  8: "#6a6aff",
  9: "#e85858",
  10: "#c85878",
};

const COLOUR_ICON_MAP = {
  1: "../../../static/1.png",
  2: "../../../static/2.png",
  3: "../../../static/3.png",
  4: "../../../static/4.png",
  5: "../../../static/5.png",
  6: "../../../static/6.png",
  7: "../../../static/7.png",
  8: "../../../static/8.png",
  9: "../../../static/9.png",
  10: "../../../static/10.png",
};

export default {
  name: "TaskDetail",
  components: { MapLayerSwitcher },
  mixins: [mapStyleMixin],
  data() {
    return {
      outdoorBaseLayers: [],
      map: null,
      view: null,
      vectorSource: null,
      // 任务专属通道：/websocket/map/locateTask-{id}
      websock: null,
      wsuri: "",
      // deveui -> VectorLayer
      markerLayers: {},
      // 勾选人员轨迹线图层
      trackSource: null,
      // deveui -> { x, y, ... }
      gpsCache: {},
      // fenceId -> Feature
      fenceFeatureMap: {},
      wsOnlineNum: null,
      apiOnlineNum: null,
      fenceInCount: 0,
      panelCollapsed: false,
      memberKeyword: "",
      selectedMembers: [],
      countdownText: "",
      countdownTimer: null,
      // 用于判断速度/海拔是否过期，定时刷新
      nowSec: Math.floor(Date.now() / 1000),
      nowTimer: null,
      // WebSocket 心跳超时重连（对齐告警通道 alarm_*）
      wsTimer: null,
      wsTimes: 0,
      wsManualClose: false,
      // 建连失败延迟重连
      wsReconnectTimer: null,
      wsReconnectCount: 0,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      task: {
        id: "",
        name: "",
        begintime: "",
        endtime: "",
        status: 0,
        members: [],
        worktypes: [],
        tranches: "",
      },
    };
  },
  computed: {
    members() {
      return Array.isArray(this.task.members) ? this.task.members : [];
    },
    totalCount() {
      return this.members.length;
    },
    onlineCount() {
      if (this.wsOnlineNum != null) return this.wsOnlineNum;
      if (this.apiOnlineNum != null) return this.apiOnlineNum;
      return 0;
    },
    // 围栏外人数 = 在线人数 - 围栏内人数
    outsideFenceCount() {
      const outside = this.onlineCount - this.fenceInCount;
      return outside < 0 ? 0 : outside;
    },
    selectedDeveuiSet() {
      const set = new Set();
      (this.selectedMembers || []).forEach((item) => {
        const deveui = item && item.maplabel;
        if (deveui) set.add(String(deveui));
      });
      return set;
    },
    memberByDeveui() {
      const map = {};
      this.members.forEach((item) => {
        if (item && item.maplabel) {
          map[String(item.maplabel)] = item;
        }
      });
      return map;
    },
    filteredMembers() {
      const keyword = (this.memberKeyword || "").trim().toLowerCase();
      if (!keyword) return this.members;
      return this.members.filter((item) => {
        const name = String((item && item.username) || "").toLowerCase();
        return name.includes(keyword);
      });
    },
    wsTimess() {
      return this.wsTimes;
    },
  },
  watch: {
    // 对齐 App.vue 告警 WebSocket：心跳超时后重连并补数据
    wsTimess(val, oldVal) {
      if (oldVal != 4) return;
      if (
        this.wsManualClose ||
        this.isTaskEnded() ||
        !this.shouldConnectWebsocket()
      ) {
        this.clearWsHeartbeat();
        return;
      }
      console.log("任务详情 WebSocket 心跳超时，重新连接", this.wsuri);
      this.clearWsReconnectTimer();
      this.clearWsHeartbeat();
      this.closeWebsocket();
      this.initWebsocket();
      this.prefetchAllMembersGps();
      this.reloadSelectedTracks();
    },
  },
  created() {
    // deveui -> { points: [{ x, y, t }], feature }，轨迹点量大，不做响应式
    this.trackStates = {};
  },
  mounted() {
    this.loadTask();
    this.startCountdown();
    this.nowTimer = setInterval(() => {
      this.nowSec = Math.floor(Date.now() / 1000);
      this.pruneStaleTracks();
    }, 10000);
    this.$nextTick(() => {
      this.initMap();
      this.loadTaskFences();
      this.syncWebsocketWithStatus();
    });
  },
  beforeUnmount() {
    this.clearCountdown();
    if (this.nowTimer) {
      clearInterval(this.nowTimer);
      this.nowTimer = null;
    }
    this.wsManualClose = true;
    this.clearWsReconnectTimer();
    this.clearWsHeartbeat();
    this.closeWebsocket();
    this.clearAllMarkers();
    this.clearAllTracks();
    this.clearFences();
    this.destroyMap();
  },
  methods: {
    destroyMap() {
      if (this.map) {
        this.map.setTarget(null);
        this.map = null;
      }
      this.view = null;
      this.vectorSource = null;
      this.outdoorBaseLayers = [];
    },
    loadTask() {
      const id = this.$route.query.id;
      let cached = null;
      try {
        cached = JSON.parse(sessionStorage.getItem(TASK_CACHE_KEY) || "null");
      } catch (e) {
        cached = null;
      }
      if (cached && (!id || String(cached.id) === String(id))) {
        this.task = {
          ...this.task,
          ...cached,
          members: Array.isArray(cached.members) ? cached.members : [],
          worktypes: Array.isArray(cached.worktypes)
            ? cached.worktypes
            : this.extractWorktypesFromMembers(cached.members),
          tranches:
            cached.tranches == null || cached.tranches === ""
              ? ""
              : Array.isArray(cached.tranches)
                ? cached.tranches.join(",")
                : String(cached.tranches),
        };
        return;
      }
      if (this.$route.query.name) {
        this.task.name = this.$route.query.name;
      }
      if (id) {
        this.task.id = id;
      }
    },
    getTaskTrancheIds() {
      const value = this.task && this.task.tranches;
      if (Array.isArray(value)) {
        return value
          .map((item) => (item == null ? "" : String(item).trim()))
          .filter(Boolean)
          .join(",");
      }
      if (value == null || value === "") return "";
      return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(",");
    },
    hexToRgba(hex, opacity) {
      const raw = String(hex || "").trim();
      if (!/^#([0-9a-fA-F]{6})$/.test(raw)) {
        return `rgba(255, 0, 0, ${opacity})`;
      }
      const rgb = parseInt(raw.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    createFenceStyle(color, name, num, opacity) {
      let label = name || "";
      if (num != null && num !== "") {
        label = label ? `${label}(${num})` : String(num);
      }
      const alpha = this.normalizeFenceOpacity(opacity);
      return new Style({
        fill: new Fill({
          color: this.hexToRgba(color, alpha),
        }),
        stroke: new Stroke({
          color: color || "#FF0000",
          width: 2,
        }),
        text: label
          ? new Text({
              text: label,
              font: "bold 13px Microsoft YaHei, sans-serif",
              fill: new Fill({ color: "#333333" }),
              stroke: new Stroke({ color: "#ffffff", width: 3 }),
              overflow: true,
              textAlign: "center",
              textBaseline: "middle",
            })
          : undefined,
      });
    },
    normalizeFenceOpacity(value) {
      const num = Number(value);
      if (!Number.isFinite(num) || num <= 0 || num > 1) return 1;
      return num;
    },
    clearFences() {
      if (this.vectorSource) {
        this.vectorSource.clear();
      }
      this.fenceFeatureMap = {};
      this.fenceInCount = 0;
    },
    renderFences(list) {
      if (!this.vectorSource) return;
      this.clearFences();
      const fences = Array.isArray(list) ? list : [];
      fences.forEach((fence) => {
        const points = (fence && fence.list) || [];
        if (points.length < 3) return;
        const gpsCoords = points
          .map((point) => {
            const x = Number(point.pointX != null ? point.pointX : point.x);
            const y = Number(point.pointY != null ? point.pointY : point.y);
            if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
            return [x, y];
          })
          .filter(Boolean);
        if (gpsCoords.length < 3) return;

        const mercatorCoords = gpsCoords.map((coord) => fromLonLat(coord));
        // 闭合多边形
        const first = mercatorCoords[0];
        const last = mercatorCoords[mercatorCoords.length - 1];
        if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
          mercatorCoords.push(first);
        }

        const color = fence.colour || "#FF0000";
        const fenceOpacity = this.normalizeFenceOpacity(fence.opacity);
        const fenceNum =
          fence.num === null || fence.num === undefined ? 0 : fence.num;
        const feature = markRaw(
          new Feature({
            geometry: new Polygon([mercatorCoords]),
            type: "fence",
            fenceId: fence.id,
            fenceName: fence.name || "",
            fenceColor: color,
            fenceOpacity: fenceOpacity,
            number: fenceNum,
          })
        );
        feature.setStyle(
          this.createFenceStyle(color, fence.name || "", fenceNum, fenceOpacity)
        );
        this.vectorSource.addFeature(feature);
        if (fence.id != null) {
          this.fenceFeatureMap[String(fence.id)] = feature;
        }
      });

      const extent = this.vectorSource.getExtent();
      if (
        this.view &&
        extent &&
        Number.isFinite(extent[0]) &&
        extent[0] !== Infinity
      ) {
        this.view.fit(extent, {
          padding: [60, 60, 60, 60],
          maxZoom: 18,
          duration: 300,
        });
      }
    },
    updateFenceNumsFromWs(fenceList) {
      const list = Array.isArray(fenceList) ? fenceList : [];
      let inCount = 0;
      list.forEach((item) => {
        const num =
          item && item.num != null && item.num !== ""
            ? Number(item.num) || 0
            : 0;
        inCount += num;
        if (!item || item.id == null) return;
        const feature = this.fenceFeatureMap[String(item.id)];
        if (!feature) return;
        feature.set("number", num);
        const color = feature.get("fenceColor") || item.colour || "#FF0000";
        const name = feature.get("fenceName") || item.name || "";
        const opacity =
          feature.get("fenceOpacity") != null
            ? feature.get("fenceOpacity")
            : item.opacity;
        feature.setStyle(this.createFenceStyle(color, name, num, opacity));
      });
      this.fenceInCount = inCount;
    },
    loadTaskFences() {
      const ids = this.getTaskTrancheIds();
      if (!ids) {
        this.clearFences();
        this.prefetchAllMembersGps();
        return;
      }
      const that = this;
      getFenceManageAndPointByIds(
        { ids },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res.code == 1001) {
            that.renderFences(res.data || []);
          } else {
            that.clearFences();
          }
        })
        .catch(() => {
          that.clearFences();
        })
        .finally(() => {
          that.prefetchAllMembersGps();
        });
    },
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
    goBack() {
      this.$router.push("/staff/taskmanagement").catch(() => {});
    },
    onSelectionChange(rows) {
      const prev = new Set(this.selectedDeveuiSet);
      this.selectedMembers = rows || [];
      const next = new Set(this.selectedDeveuiSet);
      const added = [];
      const removed = [];
      next.forEach((deveui) => {
        if (!prev.has(deveui)) added.push(deveui);
      });
      prev.forEach((deveui) => {
        if (!next.has(deveui)) removed.push(deveui);
      });
      removed.forEach((deveui) => {
        this.removeMemberMarker(deveui);
        this.removeMemberTrack(deveui);
      });
      // 勾选后重新请求定位并上图，同时加载任务开始至今的轨迹
      if (added.length) {
        this.fetchLastGpsByDeveuis(added, { placeOnMap: true });
        this.fetchMemberTracks(added);
      }
    },
    getMemberRowKey(row) {
      if (!row) return "";
      if (row.memberid != null && row.memberid !== "") return String(row.memberid);
      if (row.id != null && row.id !== "") return String(row.id);
      if (row.maplabel) return String(row.maplabel);
      return String(row.username || "");
    },
    getMemberGps(row) {
      const deveui = row && row.maplabel;
      return deveui ? this.gpsCache[String(deveui)] || null : null;
    },
    // 后端会一直保留最后一条定位，超过时效的速度/海拔不再显示
    getFreshMemberGps(row) {
      const gps = this.getMemberGps(row);
      if (!gps) return null;
      const gpstime = this.toGpsSeconds(gps.gpstime);
      if (gpstime && this.nowSec - gpstime > GPS_STALE_SECONDS) return null;
      return gps;
    },
    formatMemberSpeed(row) {
      const gps = this.getFreshMemberGps(row);
      if (!gps || gps.speed == null || gps.speed === "") return "-";
      return Number(gps.speed).toFixed(1) + this.$t("locateTask.speedUnit");
    },
    formatMemberAltitude(row) {
      const gps = this.getFreshMemberGps(row);
      const alt = gps && (gps.alt != null ? gps.alt : gps.altitude);
      if (alt == null || alt === "") return "-";
      return Number(alt) + this.$t("locateTask.meterUnit");
    },
    getColourIcon(colour) {
      const key = Number(colour);
      return COLOUR_ICON_MAP[key] || "../../../static/user1.png";
    },
    getColourText(colour) {
      const key = Number(colour);
      return COLOUR_TEXT_MAP[key] || "#e2e8f0";
    },
    memberRowClassName({ row }) {
      return row && row.colour ? "has-colour" : "";
    },
    formatSecondTime(value) {
      if (value == null || value === "" || Number(value) === 0) return "-";
      const date = new Date(Number(value) * 1000);
      if (Number.isNaN(date.getTime())) return "-";
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
    formatDuration(seconds) {
      const negative = seconds < 0;
      const s = Math.abs(Math.floor(seconds));
      const day = Math.floor(s / 86400);
      const hour = Math.floor((s % 86400) / 3600);
      const min = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      const pad = (num) => (num < 10 ? "0" + num : "" + num);
      let text =
        day > 0
          ? `${day}${this.$t("locateTask.day")} ${pad(hour)}:${pad(min)}:${pad(sec)}`
          : `${pad(hour)}:${pad(min)}:${pad(sec)}`;
      return (negative ? "-" : "") + text;
    },
    // status: 0 未开始 / 1 进行中 / 2 已暂停 / 3 已结束
    getTaskStatus() {
      const raw = this.task && this.task.status;
      if (raw === null || raw === undefined || raw === "") {
        return 0;
      }
      const status = Number(raw);
      return Number.isNaN(status) ? 0 : status;
    },
    markTaskEndedUI() {
      this.countdownText = this.$t("locateTask.ended");
      this.wsManualClose = true;
      this.clearWsReconnectTimer();
      this.clearWsHeartbeat();
      if (this.websock) {
        this.closeWebsocket();
      }
      // 停留页面期间任务结束：已勾选人员改为显示整个任务时间段的轨迹
      if (this.countdownTimer) {
        this.reloadSelectedTracks();
      }
      this.clearCountdown();
    },
    // 进行中/已暂停：直接连；未开始：到达开始时间后才连
    shouldConnectWebsocket() {
      if (this.isTaskEnded()) return false;
      const status = this.getTaskStatus();
      if (status === 1 || status === 2) return true;
      if (status === 0) {
        const begin = Number(this.task && this.task.begintime);
        return !!begin && Math.floor(Date.now() / 1000) >= begin;
      }
      return false;
    },
    syncWebsocketWithStatus() {
      if (this.isTaskEnded()) {
        this.wsManualClose = true;
        this.clearWsReconnectTimer();
        this.clearWsHeartbeat();
        this.closeWebsocket();
        return;
      }
      if (!this.websock && this.shouldConnectWebsocket()) {
        this.initWebsocket();
      }
    },
    updateCountdown() {
      const status = this.getTaskStatus();
      const begin = Number(this.task.begintime);
      const end = Number(this.task.endtime);
      const now = Math.floor(Date.now() / 1000);

      // 以 status 为准：已结束
      if (status === 3) {
        this.markTaskEndedUI();
        return;
      }
      // 已超过计划结束时间，视为结束
      if (end && now >= end) {
        this.markTaskEndedUI();
        return;
      }

      // 未开始：到达开始时间后按已开始处理（显示已开始并建立 WebSocket）
      if (status === 0) {
        if (!begin) {
          this.countdownText = this.$t("locateTask.notStarted");
          return;
        }
        if (now < begin) {
          this.countdownText =
            this.$t("locateTask.notStarted") +
            " " +
            this.formatDuration(now - begin);
          return;
        }
        this.countdownText =
          this.$t("locateTask.elapsed") +
          " " +
          this.formatDuration(now - begin);
        this.syncWebsocketWithStatus();
        return;
      }

      // 已暂停
      if (status === 2) {
        if (begin) {
          this.countdownText =
            this.$t("locateTask.statusPaused") +
            " " +
            this.formatDuration(Math.max(0, now - begin));
        } else {
          this.countdownText = this.$t("locateTask.statusPaused");
        }
        return;
      }

      // 进行中（status === 1）
      if (begin) {
        this.countdownText =
          this.$t("locateTask.elapsed") +
          " " +
          this.formatDuration(Math.max(0, now - begin));
      } else {
        this.countdownText = this.$t("locateTask.statusRunning");
      }
    },
    isTaskEnded() {
      if (this.getTaskStatus() === 3) return true;
      const end = Number(this.task && this.task.endtime);
      if (!end) return false;
      return Math.floor(Date.now() / 1000) >= end;
    },
    startCountdown() {
      this.clearCountdown();
      this.updateCountdown();
      if (this.isTaskEnded()) return;
      this.countdownTimer = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    },
    clearCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
    },
    getTaskId() {
      if (this.task && this.task.id != null && this.task.id !== "") {
        return this.task.id;
      }
      return this.$route.query.id || "";
    },
    getTaskWsSid() {
      const id = this.getTaskId();
      if (id === "" || id == null) return "";
      return "locateTask-" + String(id);
    },
    // 首次进入：拉取全部成员最近 GPS，仅填充速度/海拔缓存，不上图；
    // 在线人数用 data.onlineNum，围栏人数用 data.fenceList（与 WS 推送结构一致）
    prefetchAllMembersGps() {
      const deveuis = this.members
        .map((item) => item && item.maplabel)
        .filter(Boolean)
        .map((item) => String(item));
      if (!deveuis.length) {
        this.apiOnlineNum = 0;
        return;
      }
      this.fetchLastGpsByDeveuis(deveuis, {
        placeOnMap: false,
        applyStats: true,
      });
    },
    // 返回结构：{ onlineNum, devlist, fenceList }（兼容旧版数组 / list）
    fetchLastGpsByDeveuis(deveuis, options = {}) {
      const placeOnMap = !!options.placeOnMap;
      const applyStats = !!options.applyStats;
      const list = (deveuis || []).filter(Boolean).map((item) => String(item));
      if (!list.length) {
        if (applyStats) this.apiOnlineNum = 0;
        return;
      }
      const locateTaskId = this.getTaskId();
      getLastDevGpsByDeveuis(
        {
          projectid: this.$store.state.projectid,
          deveuis: list.join(","),
          locateTaskId,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code != 1001) return;
        const data = res.data;
        const points = Array.isArray(data)
          ? data
          : data && Array.isArray(data.devlist)
            ? data.devlist
            : data && Array.isArray(data.list)
              ? data.list
              : [];
        const nextCache = { ...this.gpsCache };
        points.forEach((item) => {
          if (!item || !item.deveui) return;
          const deveui = String(item.deveui);
          const x = Number(item.x);
          const y = Number(item.y);
          nextCache[deveui] = { ...item, x, y };
          if (placeOnMap && this.selectedDeveuiSet.has(deveui)) {
            this.upsertMemberMarker(nextCache[deveui]);
          }
        });
        this.gpsCache = nextCache;

        if (!applyStats || !data || Array.isArray(data)) return;
        if (data.onlineNum != null && data.onlineNum !== "") {
          this.apiOnlineNum = Number(data.onlineNum) || 0;
        }
        const fenceList = data.fenceList || data.fenceObj;
        if (fenceList && fenceList.length > 0) {
          this.updateFenceNumsFromWs(fenceList);
        }
      });
    },
    findMemberByDeveui(deveui) {
      return this.memberByDeveui[String(deveui)] || null;
    },
    removeMemberMarker(deveui) {
      const key = String(deveui);
      const layer = this.markerLayers[key];
      if (layer && this.map) {
        this.map.removeLayer(layer);
      }
      delete this.markerLayers[key];
    },
    clearAllMarkers() {
      Object.keys(this.markerLayers).forEach((deveui) => {
        this.removeMemberMarker(deveui);
      });
      this.markerLayers = {};
    },
    upsertMemberMarker(gpsInfo) {
      if (!this.map || !gpsInfo || !gpsInfo.deveui) return;
      const deveui = String(gpsInfo.deveui);
      if (!this.selectedDeveuiSet.has(deveui)) {
        this.removeMemberMarker(deveui);
        return;
      }
      // 与室外一致：status=2 视为离线，移除点位
      if (gpsInfo.status == 2) {
        this.removeMemberMarker(deveui);
        return;
      }
      const x = Number(gpsInfo.x);
      const y = Number(gpsInfo.y);
      if (!x && !y) return;

      this.gpsCache = {
        ...this.gpsCache,
        [deveui]: { ...gpsInfo, x, y },
      };

      const member = this.findMemberByDeveui(deveui);
      const colour = (member && member.colour) || gpsInfo.colour;
      const username =
        (member && member.username) || gpsInfo.username || deveui;
      const iconSrc = this.getColourIcon(colour);

      this.removeMemberMarker(deveui);

      const feature = markRaw(
        new Feature({
          geometry: new Point(fromLonLat([x, y])),
          deveui,
          username,
          colour,
          longi: x,
          lati: y,
        })
      );
      const source = markRaw(new VectorSource({ features: [feature] }));
      const layer = markRaw(
        new VectorLayer({
          source,
          style: new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: iconSrc,
              scale: 1,
            }),
            text: this.createMarkerText(username),
          }),
          zIndex: 10,
        })
      );
      this.map.addLayer(layer);
      this.markerLayers[deveui] = layer;
    },
    // gpstime 兼容秒 / 毫秒 / 日期字符串，统一为秒
    toGpsSeconds(value) {
      if (value == null || value === "") return 0;
      const num = Number(value);
      if (!Number.isNaN(num)) {
        return num > 1e12 ? Math.floor(num / 1000) : num;
      }
      const parsed = Date.parse(String(value).replace(/-/g, "/"));
      return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
    },
    // 缺少 gpstime 的推送点按接收时间计，便于按时效裁剪
    toTrackPoint(item) {
      if (!item || item.status == 2) return null;
      const x = Number(item.x);
      const y = Number(item.y);
      if (!x || !y || Number.isNaN(x) || Number.isNaN(y)) return null;
      const t =
        this.toGpsSeconds(item.gpstime) || Math.floor(Date.now() / 1000);
      return { x, y, t };
    },
    // 任务已结束：显示整个任务时间段，不按时效裁剪
    getTrackCutoff() {
      if (this.isTaskEnded()) return 0;
      return Math.floor(Date.now() / 1000) - GPS_STALE_SECONDS;
    },
    // 进行中：最近 10 分钟（不早于任务开始）~ 当前时间
    // 已结束：任务开始时间 ~ 任务结束时间（提前结束则到当前时间）
    getTrackTimeRange() {
      const now = Math.floor(Date.now() / 1000);
      const taskBegin = Number(this.task && this.task.begintime);
      const end = Number(this.task && this.task.endtime);
      const endtime = end && end < now ? end : now;
      let begintime;
      if (this.isTaskEnded()) {
        if (!taskBegin) return null;
        begintime = taskBegin;
      } else {
        const cutoff = now - GPS_STALE_SECONDS;
        begintime = taskBegin && taskBegin > cutoff ? taskBegin : cutoff;
      }
      if (endtime <= begintime) return null;
      return { begintime, endtime };
    },
    reloadSelectedTracks() {
      const deveuis = Array.from(this.selectedDeveuiSet);
      if (!deveuis.length) return;
      deveuis.forEach((deveui) => this.removeMemberTrack(deveui));
      this.fetchMemberTracks(deveuis);
    },
    // 裁掉超过时效的轨迹点并重绘
    pruneStaleTracks() {
      const cutoff = this.getTrackCutoff();
      Object.keys(this.trackStates).forEach((deveui) => {
        const state = this.trackStates[deveui];
        if (!state || !state.points.length) return;
        if (state.points[0].t >= cutoff) return;
        state.points = state.points.filter((p) => p.t >= cutoff);
        this.renderMemberTrack(deveui);
      });
    },
    ensureTrackState(deveui) {
      const key = String(deveui);
      if (!this.trackStates[key]) {
        this.trackStates[key] = { points: [], feature: null };
      }
      return this.trackStates[key];
    },
    fetchMemberTracks(deveuis) {
      const list = (deveuis || []).filter(Boolean).map((item) => String(item));
      if (!list.length) return;
      list.forEach((deveui) => this.ensureTrackState(deveui));
      const range = this.getTrackTimeRange();
      if (!range) return;
      const usernames = list.map((deveui) => {
        const member = this.findMemberByDeveui(deveui);
        return (member && member.username) || deveui;
      });
      getDevGpsHistoryByDeveuiList(
        {
          projectid: this.$store.state.projectid,
          deveuis: list.join(","),
          usernames: usernames.join(","),
          begintime: range.begintime,
          endtime: range.endtime,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (!res || res.code != 1001) return;
          const data = res.data || {};
          list.forEach((deveui) => {
            // 请求期间已取消勾选则丢弃
            if (!this.selectedDeveuiSet.has(deveui)) return;
            // 接口按 gpstime 倒序返回，反转为正序连线
            const cutoff = this.getTrackCutoff();
            const history = (Array.isArray(data[deveui]) ? data[deveui] : [])
              .map((item) => this.toTrackPoint(item))
              .filter((p) => p && p.t >= cutoff)
              .reverse();
            const state = this.ensureTrackState(deveui);
            // 合并请求期间 WebSocket 已追加的新点
            const lastT = history.length ? history[history.length - 1].t : 0;
            const pending = state.points.filter(
              (p) => p.t > lastT && p.t >= cutoff
            );
            state.points = history.concat(pending);
            this.renderMemberTrack(deveui);
          });
        })
        .catch(() => {});
    },
    appendTrackPoint(gpsInfo) {
      if (!gpsInfo || !gpsInfo.deveui) return;
      const deveui = String(gpsInfo.deveui);
      if (!this.selectedDeveuiSet.has(deveui)) return;
      const point = this.toTrackPoint(gpsInfo);
      if (!point || point.t < this.getTrackCutoff()) return;
      const state = this.ensureTrackState(deveui);
      const last = state.points[state.points.length - 1];
      if (last && last.x === point.x && last.y === point.y) return;
      if (last && point.t < last.t) return;
      state.points.push(point);
      state.points = state.points.filter((p) => p.t >= this.getTrackCutoff());
      this.renderMemberTrack(deveui);
    },
    renderMemberTrack(deveui) {
      if (!this.trackSource) return;
      const key = String(deveui);
      const state = this.trackStates[key];
      if (!state) return;
      const coords = state.points.map((p) => fromLonLat([p.x, p.y]));
      if (coords.length < 2) {
        if (state.feature) {
          this.trackSource.removeFeature(state.feature);
          state.feature = null;
        }
        return;
      }
      if (state.feature) {
        state.feature.getGeometry().setCoordinates(coords);
        return;
      }
      const member = this.findMemberByDeveui(key);
      const color = this.getColourText(member && member.colour);
      const feature = markRaw(
        new Feature({ geometry: new LineString(coords), deveui: key })
      );
      const lineStyle = new Style({
        stroke: new Stroke({ color, width: 3 }),
      });
      feature.setStyle((f, resolution) =>
        this.createTrackStyles(f, resolution, color, lineStyle)
      );
      this.trackSource.addFeature(feature);
      state.feature = feature;
    },
    // 沿轨迹按固定屏幕间距绘制方向箭头
    createTrackStyles(feature, resolution, color, lineStyle) {
      const styles = [lineStyle];
      const geometry = feature.getGeometry();
      if (!geometry || !resolution) return styles;
      const spacing = TRACK_ARROW_SPACING_PX * resolution;
      let walked = 0;
      let next = spacing / 2;
      geometry.forEachSegment((start, end) => {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const len = Math.hypot(dx, dy);
        if (!len) return;
        // RegularShape 三角形默认朝上，rotation 为顺时针弧度
        const rotation = Math.PI / 2 - Math.atan2(dy, dx);
        while (next <= walked + len) {
          const ratio = (next - walked) / len;
          styles.push(
            new Style({
              geometry: new Point([
                start[0] + dx * ratio,
                start[1] + dy * ratio,
              ]),
              image: new RegularShape({
                points: 3,
                radius: 6,
                rotation,
                rotateWithView: true,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: "#ffffff", width: 1 }),
              }),
            })
          );
          next += spacing;
        }
        walked += len;
      });
      return styles;
    },
    removeMemberTrack(deveui) {
      const key = String(deveui);
      const state = this.trackStates[key];
      if (state && state.feature && this.trackSource) {
        this.trackSource.removeFeature(state.feature);
      }
      delete this.trackStates[key];
    },
    clearAllTracks() {
      if (this.trackSource) this.trackSource.clear();
      this.trackStates = {};
    },
    initWebsocket() {
      if (typeof WebSocket === "undefined") {
        return;
      }
      // 任务已结束：不建立 WebSocket
      if (this.isTaskEnded()) {
        console.log("任务详情 WebSocket 跳过：任务已结束");
        return;
      }
      // 任务未开始且未到开始时间：不建立 WebSocket
      if (!this.shouldConnectWebsocket()) {
        console.log("任务详情 WebSocket 跳过：任务未开始");
        return;
      }
      const sid = this.getTaskWsSid();
      if (!sid) {
        console.log("任务详情 WebSocket 跳过：缺少任务 id");
        return;
      }
      this.wsManualClose = false;
      this.clearWsHeartbeat();
      this.closeWebsocket();
      // host.ws 已含 /websocket/，最终为 /websocket/map/locateTask-{id}
      this.wsuri = host.ws + "map/" + sid;
      this.websock = new WebSocket(this.wsuri);
      this.websock.onopen = () => {
        const wasReconnect = this.wsReconnectCount > 0;
        console.log("任务详情 WebSocket 连接成功", this.wsuri);
        this.wsReconnectCount = 0;
        this.clearWsReconnectTimer();
        // 对齐告警：建连后先按 40s 计心跳超时
        this.clearWsHeartbeat();
        this.wsTimer = setInterval(() => {
          this.wsTimes += 1;
        }, 40000);
        // 失败重连成功后补一次定位/轨迹
        if (wasReconnect) {
          this.prefetchAllMembersGps();
          this.reloadSelectedTracks();
        }
      };
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = () => {
        console.log("任务详情 WebSocket 连接失败", this.wsuri);
      };
      this.websock.onclose = () => {
        console.log("任务详情 WebSocket 关闭", this.wsuri);
        this.websock = null;
        this.clearWsHeartbeat();
        this.scheduleWsReconnect();
      };
    },
    clearWsHeartbeat() {
      if (this.wsTimer) {
        clearInterval(this.wsTimer);
        this.wsTimer = null;
      }
      this.wsTimes = 0;
    },
    clearWsReconnectTimer() {
      if (this.wsReconnectTimer) {
        clearTimeout(this.wsReconnectTimer);
        this.wsReconnectTimer = null;
      }
    },
    // 建连失败 / 异常断开：延迟重连，最多 3 次，仍失败则提示网络问题
    scheduleWsReconnect() {
      if (
        this.wsManualClose ||
        this.isTaskEnded() ||
        !this.shouldConnectWebsocket()
      ) {
        return;
      }
      if (this.wsReconnectTimer) return;
      if (this.wsReconnectCount >= WS_RECONNECT_MAX) {
        this.$message({
          message: this.$t("locateTask.wsNetworkError"),
          type: "warning",
        });
        return;
      }
      this.wsReconnectCount += 1;
      console.log(
        "任务详情 WebSocket 将在 " +
          WS_RECONNECT_DELAY +
          "ms 后重连（第 " +
          this.wsReconnectCount +
          "/" +
          WS_RECONNECT_MAX +
          " 次）",
        this.wsuri
      );
      this.wsReconnectTimer = setTimeout(() => {
        this.wsReconnectTimer = null;
        if (
          this.wsManualClose ||
          this.isTaskEnded() ||
          !this.shouldConnectWebsocket()
        ) {
          return;
        }
        this.initWebsocket();
      }, WS_RECONNECT_DELAY);
    },
    closeWebsocket() {
      if (this.websock) {
        try {
          this.websock.onopen = null;
          this.websock.onmessage = null;
          this.websock.onerror = null;
          this.websock.onclose = null;
          this.websock.close();
        } catch (e) {}
        this.websock = null;
      }
    },
    // 推送格式：{ devGps, fenceList, onlineNum }
    // 心跳文案与告警通道一致：The connection is normal.
    websocketonmessage(res) {
      if (!res) return;
      if (res.data === "连接成功") return;
      // 后端心跳：收到后缩短超时检测间隔（对齐 App.vue 告警）
      if (res.data === "The connection is normal.") {
        this.clearWsHeartbeat();
        this.wsTimer = setInterval(() => {
          this.wsTimes += 1;
        }, 10000);
        return;
      }
      let payload;
      try {
        payload = JSON.parse(res.data);
      } catch (e) {
        return;
      }
      if (!payload || typeof payload !== "object") return;

      if (payload.onlineNum != null && payload.onlineNum !== "") {
        this.wsOnlineNum = Number(payload.onlineNum) || 0;
      }

      const fenceList = payload.fenceList || payload.fenceObj;
      if (fenceList && fenceList.length > 0) {
        this.updateFenceNumsFromWs(fenceList);
      }

      const data = payload.devGps || payload;
      if (!data || !data.deveui) return;
      const deveui = String(data.deveui);
      if (!this.memberByDeveui[deveui]) return;
      const x = Number(data.x);
      const y = Number(data.y);
      this.gpsCache = {
        ...this.gpsCache,
        [deveui]: { ...data, x, y },
      };
      // 仅勾选后才上图
      if (!this.selectedDeveuiSet.has(deveui)) return;
      this.upsertMemberMarker(this.gpsCache[deveui]);
      this.appendTrackPoint(this.gpsCache[deveui]);
    },
    initMap() {
      const target = this.$refs.mapEl;
      if (!target) return;
      this.clearAllMarkers();
      this.clearAllTracks();
      this.destroyMap();

      const isZh = this.$store.state.i18n === "zh";
      const baseLayers = createOutdoorBaseLayers(
        isZh,
        this.mapBaseStyle
      ).map((layer) => markRaw(layer));
      this.outdoorBaseLayers = baseLayers;
      this.vectorSource = markRaw(new VectorSource());
      const vectorLayer = markRaw(
        new VectorLayer({
          source: this.vectorSource,
        })
      );
      this.trackSource = markRaw(new VectorSource());
      const trackLayer = markRaw(
        new VectorLayer({
          source: this.trackSource,
          zIndex: 5,
        })
      );

      const longi = Number(this.$store.state.longis) || 116.397428;
      const lati = Number(this.$store.state.latis) || 39.90923;
      this.view = markRaw(
        new View({
          center: fromLonLat([longi, lati]),
          zoom: 15,
        })
      );

      this.map = markRaw(
        new Map({
          target,
          layers: [...baseLayers, vectorLayer, trackLayer],
          view: this.view,
          controls: defaultControls({
            zoom: false,
            rotate: false,
            attribution: false,
          }).extend([
            new Zoom({ className: "ol-zoom task-map-ctrl-zoom" }),
            new Rotate({ className: "ol-rotate task-map-ctrl-rotate" }),
            new ScaleLine({ className: "ol-scale-line task-map-ctrl-scale" }),
          ]),
        })
      );

      const refreshSize = () => {
        if (!this.map) return;
        this.map.updateSize();
        refreshBaseTiles(this.map);
      };
      this.$nextTick(() => {
        refreshSize();
        requestAnimationFrame(refreshSize);
        setTimeout(refreshSize, 200);
      });
    },
    onMapStyleChange(style) {
      this.mapBaseStyle = style;
      const isZh = this.$store.state.i18n === "zh";
      this.outdoorBaseLayers = createOutdoorBaseLayers(isZh, style).map(
        (layer) => markRaw(layer)
      );
      if (this.map) {
        this.map.updateSize();
        refreshBaseTiles(this.map);
      }
    },
  },
};
</script>

<style scoped>
.task-detail-page {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  color: #e2e8f0;
  overflow: hidden;
  z-index: 1000;
}
.task-detail-header {
  position: relative;
  flex: 0 0 56px;
  width: 100%;
  box-sizing: border-box;
  display: block;
  padding: 0;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  z-index: 2;
}
.header-left {
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  z-index: 2;
}
.header-center {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 320px;
  box-sizing: border-box;
  text-align: center;
}
.header-right {
  position: absolute;
  right: 12px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
  z-index: 2;
}
.attend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.back-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  padding: 0;
  margin: 0;
  font-size: 14px;
  cursor: pointer;
  line-height: 1;
}
.back-btn:hover {
  color: #e2e8f0;
}
.task-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #f8fafc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  line-height: 1.2;
}
.attend-label {
  font-size: 13px;
  color: #94a3b8;
}
.attend-value {
  font-size: 22px;
  font-weight: 700;
  color: #38bdf8;
  font-variant-numeric: tabular-nums;
}
.attend-sep {
  margin: 0 2px;
  color: #64748b;
  font-weight: 500;
}
.task-detail-body {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
}
.map-wrap {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #dbe4ee;
}
.task-detail-map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.task-detail-map :deep(.ol-viewport),
.task-detail-map :deep(.ol-layers) {
  width: 100% !important;
  height: 100% !important;
}
.task-detail-map :deep(.task-map-ctrl-zoom) {
  position: absolute !important;
  top: auto !important;
  left: auto !important;
  right: 16px !important;
  bottom: 56px !important;
}
.task-detail-map :deep(.task-map-ctrl-rotate) {
  position: absolute !important;
  top: auto !important;
  left: auto !important;
  right: 16px !important;
  bottom: 16px !important;
}
.task-detail-map :deep(.task-map-ctrl-scale) {
  position: absolute !important;
  top: auto !important;
  left: auto !important;
  right: 64px !important;
  bottom: 16px !important;
}
.side-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  bottom: 16px;
  width: 420px;
  max-width: calc(100vw - 32px);
  z-index: 5;
  display: flex;
  transition: width 0.2s ease;
  box-sizing: border-box;
  /* 允许收缩按钮露在面板右侧外 */
  overflow: visible;
}
.side-panel.collapsed {
  width: 0;
}
.side-panel-inner {
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.42);
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
}
.collapse-btn {
  position: absolute;
  top: 50%;
  left: 100%;
  right: auto;
  transform: translateY(-50%);
  width: 18px;
  height: 56px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-left: none;
  border-radius: 0 8px 8px 0;
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  cursor: pointer;
  z-index: 8;
  padding: 0;
  line-height: 56px;
  font-size: 16px;
  flex-shrink: 0;
}
.countdown-card {
  flex: 0 0 auto;
  padding: 12px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.38);
  border: 1px solid rgba(56, 189, 248, 0.25);
}
.countdown-label {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 6px;
}
.countdown-value {
  font-size: 18px;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 6px;
}
.countdown-range {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}
.member-panel {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.member-search {
  flex: 0 0 auto;
}
.member-panel :deep(.el-table) {
  flex: 1;
  width: 100% !important;
  background: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(30, 41, 59, 0.45);
  --el-table-row-hover-bg-color: rgba(51, 65, 85, 0.45);
  --el-table-text-color: #e2e8f0;
  --el-table-header-text-color: #cbd5e1;
  --el-table-border-color: rgba(71, 85, 105, 0.6);
}
.member-panel :deep(.el-table__inner-wrapper),
.member-panel :deep(.el-table__header-wrapper),
.member-panel :deep(.el-table__body-wrapper) {
  width: 100% !important;
}
.member-name-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  cursor: pointer;
}
.colour-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  object-fit: contain;
}
.member-name-link {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}
</style>
