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
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Icon, Style, Fill, Stroke, Text } from "ol/style";
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
} from "../../axios/api";

const TASK_CACHE_KEY = "locateTaskDetail";

// 与角色管理 / 室内外定位一致：colour 1-10 对应 static/1.png ... 10.png
const COLOUR_TEXT_MAP = {
  1: "#3db7e8",
  2: "#c8d018",
  3: "#e838e8",
  4: "#78c0c0",
  5: "#c4a898",
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
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      task: {
        id: "",
        name: "",
        begintime: "",
        endtime: "",
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
        const type = String((item && item.worktype) || "").toLowerCase();
        const label = String((item && item.maplabel) || "").toLowerCase();
        return (
          name.includes(keyword) ||
          type.includes(keyword) ||
          label.includes(keyword)
        );
      });
    },
  },
  mounted() {
    this.loadTask();
    this.startCountdown();
    this.$nextTick(() => {
      this.initMap();
      this.loadTaskFences();
      this.initWebsocket();
    });
  },
  beforeUnmount() {
    this.clearCountdown();
    this.closeWebsocket();
    this.clearAllMarkers();
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
    createFenceStyle(color, name, num) {
      let label = name || "";
      if (num != null && num !== "") {
        label = label ? `${label}(${num})` : String(num);
      }
      return new Style({
        fill: new Fill({
          color: this.hexToRgba(color, 0.35),
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
        const fenceNum =
          fence.num === null || fence.num === undefined ? 0 : fence.num;
        const feature = markRaw(
          new Feature({
            geometry: new Polygon([mercatorCoords]),
            type: "fence",
            fenceId: fence.id,
            fenceName: fence.name || "",
            fenceColor: color,
            number: fenceNum,
          })
        );
        feature.setStyle(
          this.createFenceStyle(color, fence.name || "", fenceNum)
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
        feature.setStyle(this.createFenceStyle(color, name, num));
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
      removed.forEach((deveui) => this.removeMemberMarker(deveui));
      // 勾选后重新请求定位并上图
      if (added.length) {
        this.fetchLastGpsByDeveuis(added, { placeOnMap: true });
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
    formatMemberSpeed(row) {
      const gps = this.getMemberGps(row);
      if (!gps || gps.speed == null || gps.speed === "") return "-";
      return Number(gps.speed).toFixed(1) + this.$t("locateTask.speedUnit");
    },
    formatMemberAltitude(row) {
      const gps = this.getMemberGps(row);
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
    updateCountdown() {
      const begin = Number(this.task.begintime);
      const end = Number(this.task.endtime);
      const now = Math.floor(Date.now() / 1000);
      if (!begin) {
        this.countdownText = "-";
        return;
      }
      // 已超过结束时间：直接显示已结束，并断开 WebSocket
      if (end && now >= end) {
        this.countdownText = this.$t("locateTask.ended");
        if (this.websock) {
          this.closeWebsocket();
        }
        this.clearCountdown();
        return;
      }
      const elapsed = now - begin;
      if (elapsed < 0) {
        this.countdownText =
          this.$t("locateTask.notStarted") + " " + this.formatDuration(elapsed);
      } else {
        this.countdownText =
          this.$t("locateTask.elapsed") + " " + this.formatDuration(elapsed);
      }
    },
    isTaskEnded() {
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
    initWebsocket() {
      if (typeof WebSocket === "undefined") {
        return;
      }
      // 任务已结束：不建立 WebSocket
      if (this.isTaskEnded()) {
        console.log("任务详情 WebSocket 跳过：任务已结束");
        return;
      }
      const sid = this.getTaskWsSid();
      if (!sid) {
        console.log("任务详情 WebSocket 跳过：缺少任务 id");
        return;
      }
      this.closeWebsocket();
      // host.ws 已含 /websocket/，最终为 /websocket/map/locateTask-{id}
      this.wsuri = host.ws + "map/" + sid;
      this.websock = new WebSocket(this.wsuri);
      this.websock.onopen = () => {
        console.log("任务详情 WebSocket 连接成功", this.wsuri);
      };
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = () => {
        console.log("任务详情 WebSocket 连接失败", this.wsuri);
      };
      this.websock.onclose = () => {
        console.log("任务详情 WebSocket 关闭", this.wsuri);
      };
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
    websocketonmessage(res) {
      if (!res || res.data === "连接成功") return;
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
    },
    initMap() {
      const target = this.$refs.mapEl;
      if (!target) return;
      this.clearAllMarkers();
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
          layers: [...baseLayers, vectorLayer],
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
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 10px;
  backdrop-filter: blur(8px);
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
  background: rgba(15, 23, 42, 0.92);
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
  background: rgba(30, 41, 59, 0.9);
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
  --el-table-header-bg-color: rgba(30, 41, 59, 0.95);
  --el-table-row-hover-bg-color: rgba(51, 65, 85, 0.7);
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
