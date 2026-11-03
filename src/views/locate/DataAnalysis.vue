<template>
  <div class="data-analysis-page norem">
    <div
      class="inputContent outdoor-filter-flow terminal-filter-flow"
      :class="filterLangClass"
    >
      <el-form
        class="demo-form-inline terminal-filter-form"
        :model="searchForm"
      >
        <el-form-item
          :label="$t('LocationIndoorHis.name')"
          class="terminal-filter-item"
        >
          <el-select
            clearable
            filterable
            remote
            :remote-method="remoteUserMethod"
            v-model="searchForm.username"
            :placeholder="$t('LocationIndoorHis.text')"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.maplabel || item.username"
              :label="item.username"
              :value="item.username"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.maplabel
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('LocationIndoorHis.date')"
          class="terminal-filter-item analysis-date-item"
        >
          <el-date-picker
            v-model="searchForm.stepdate"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="$t('LocationIndoorHis.text1')"
            clearable
          />
        </el-form-item>

        <el-form-item class="terminal-toolbar-item">
          <el-button type="primary" class="query" @click="onSearch()">{{
            $t("LocationIndoorHis.search")
          }}</el-button>
          <el-button type="primary" class="reset" @click="onRefresh()">{{
            $t("LocationIndoorHis.reset")
          }}</el-button>
          <el-button
            type="primary"
            class="reset"
            :disabled="viewMode === 'detail'"
            @click="onSortAll()"
            >{{ sortAllBtnText }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="chart-panel">
      <div class="chart-card chart-card--steps">
        <div class="chart-header">
          <div class="chart-title">
            <span class="chart-title-icon"><i class="el-icon-data-line"></i></span>
            <span>{{ chartTitleTop }}</span>
          </div>
          <div v-if="stats.top" class="chart-stats">
            <span v-if="viewMode === 'rank'" class="chart-stat">
              <em>{{ $t("LocationIndoorHis.statPeople") }}</em><b>{{ stats.top.count }}</b>
            </span>
            <span class="chart-stat">
              <em>{{ $t("LocationIndoorHis.statAvg") }}</em><b>{{ stats.top.avg }}</b>
            </span>
            <span class="chart-stat chart-stat--max">
              <em>{{ $t("LocationIndoorHis.statMax") }}</em><b>{{ stats.top.max }}</b>
            </span>
          </div>
          <div v-if="viewMode === 'rank'" class="chart-sort">
            <el-button
              size="small"
              :type="stepSort === 2 ? 'primary' : 'default'"
              @click="onSortStep(2)"
              >{{ $t("LocationIndoorHis.sortDesc") }}</el-button
            >
            <el-button
              size="small"
              :type="stepSort === 1 ? 'primary' : 'default'"
              @click="onSortStep(1)"
              >{{ $t("LocationIndoorHis.sortAsc") }}</el-button
            >
          </div>
        </div>
        <div ref="chartTop" class="chart-box"></div>
      </div>
      <div class="chart-card chart-card--activity">
        <div class="chart-header">
          <div class="chart-title">
            <span class="chart-title-icon"><i class="el-icon-lightning"></i></span>
            <span>{{ chartTitleBottom }}</span>
            <el-tooltip
              effect="dark"
              placement="top"
              :content="$t('LocationIndoorHis.activityRankTip')"
            >
              <i class="el-icon-question chart-title-tip" />
            </el-tooltip>
          </div>
          <div v-if="stats.bottom" class="chart-stats">
            <span v-if="viewMode === 'rank'" class="chart-stat">
              <em>{{ $t("LocationIndoorHis.statPeople") }}</em><b>{{ stats.bottom.count }}</b>
            </span>
            <span class="chart-stat">
              <em>{{ $t("LocationIndoorHis.statAvg") }}</em><b>{{ stats.bottom.avg }}</b>
            </span>
            <span class="chart-stat chart-stat--max">
              <em>{{ $t("LocationIndoorHis.statMax") }}</em><b>{{ stats.bottom.max }}</b>
            </span>
          </div>
          <div v-if="viewMode === 'rank'" class="chart-sort">
            <el-button
              size="small"
              :type="vibSort === 2 ? 'primary' : 'default'"
              @click="onSortVib(2)"
              >{{ $t("LocationIndoorHis.sortDesc") }}</el-button
            >
            <el-button
              size="small"
              :type="vibSort === 1 ? 'primary' : 'default'"
              @click="onSortVib(1)"
              >{{ $t("LocationIndoorHis.sortAsc") }}</el-button
            >
          </div>
        </div>
        <div ref="chartBottom" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { markRaw } from "vue";
import * as echarts from "echarts";
import { CHART_TONES, chartGradient } from "../../utils/homeChartTheme";
import {
  getMemberNameId,
  getRunInfoStepsList,
  getRunInfoVibstateList,
  getRunInfoDateList,
} from "../../axios/api";

const MEDAL_TONES = [
  { c1: "#D97706", c2: "#FCD34D", rgb: "245,158,11" },
  { c1: "#7C8BA1", c2: "#DCE3EC", rgb: "124,139,161" },
  { c1: "#C2410C", c2: "#FDBA74", rgb: "234,88,12" },
];

export default {
  name: "DataAnalysis",
  data() {
    return {
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      userList: [],
      userOptions: [],
      searchForm: {
        username: "",
        stepdate: "",
      },
      // 1 升序，2 降序（筛选栏同步用；两图可各自独立）
      sort: 2,
      stepSort: 2,
      vibSort: 2,
      // rank | detail
      viewMode: "rank",
      // 卡片标题右侧的统计：{ count, avg, max }，无数据时为 null
      stats: { top: null, bottom: null },
    };
  },
  created() {
    // 不要放进 data：Vue3 响应式 Proxy 会导致 echarts 内部 coordinateSystem 异常
    this.chartTop = null;
    this.chartBottom = null;
    this.resizeHandler = null;
  },
  computed: {
    filterLangClass() {
      return this.$store.state.i18n === "en" ? "is-en" : "is-zh";
    },
    projectid() {
      return this.$store.state.intoProjectid || this.$store.state.projectid;
    },
    chartTitleTop() {
      return this.viewMode === "detail"
        ? this.$t("LocationIndoorHis.stepTrend")
        : this.$t("LocationIndoorHis.stepRank");
    },
    chartTitleBottom() {
      return this.viewMode === "detail"
        ? this.$t("LocationIndoorHis.activityTrend")
        : this.$t("LocationIndoorHis.activityRank");
    },
    sortAllBtnText() {
      // 两图排序一致时以图上为准；否则用筛选栏自身的 sort
      const current =
        this.stepSort === this.vibSort ? this.stepSort : this.sort;
      return current === 1
        ? this.$t("LocationIndoorHis.sortAsc")
        : this.$t("LocationIndoorHis.sortDesc");
    },
  },
  methods: {
    formatToday() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    },
    getMemberNames() {
      return getMemberNameId(
        { projectid: this.projectid },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          const list = (res.data && (res.data.list || res.data)) || [];
          this.userList = Array.isArray(list) ? list : [];
        }
      });
    },
    remoteUserMethod(query) {
      if (query !== "") {
        const q = query.toLowerCase();
        this.userOptions = this.userList.filter((item) => {
          return (
            String(item.username || "")
              .toLowerCase()
              .indexOf(q) > -1 ||
            String(item.maplabel || "")
              .toLowerCase()
              .indexOf(q) > -1
          );
        });
      } else {
        this.userOptions = [];
      }
    },
    pickList(res) {
      if (!res || res.code != 1001) return [];
      const d = res.data;
      if (!d) return [];
      if (Array.isArray(d)) return d;
      if (Array.isArray(d.list)) return d.list;
      if (Array.isArray(d.ranklist)) return d.ranklist;
      return [];
    },
    getRunInfoTimeRaw(item) {
      if (!item) return null;
      return item.time != null
        ? item.time
        : item.gpstime || item.steptime || item.createtime;
    },
    formatRunInfoTime(item) {
      const t = this.getRunInfoTimeRaw(item);
      if (t == null) return "-";
      if (typeof t === "number") {
        const ms = t > 1e12 ? t : t * 1000;
        const d = new Date(ms);
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        const ss = String(d.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
      }
      const s = String(t);
      return s.length > 16 ? s.slice(11, 19) : s;
    },
    initCharts() {
      if (this.$refs.chartTop && !this.chartTop) {
        this.chartTop = markRaw(echarts.init(this.$refs.chartTop));
      }
      if (this.$refs.chartBottom && !this.chartBottom) {
        this.chartBottom = markRaw(echarts.init(this.$refs.chartBottom));
      }
    },
    disposeCharts() {
      if (this.chartTop) {
        this.chartTop.dispose();
        this.chartTop = null;
      }
      if (this.chartBottom) {
        this.chartBottom.dispose();
        this.chartBottom = null;
      }
    },
    formatTooltip(params) {
      const list = Array.isArray(params) ? params : [params];
      if (!list.length) return "";
      const head = list[0].axisValueLabel || list[0].name || "";
      const lines = list.map((p) => {
        const val = p.value == null || p.value === "" ? "-" : p.value;
        const tone = p.data && p.data.tone ? p.data.tone : null;
        const dot = tone
          ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:${tone.c1};box-shadow:0 0 6px rgba(${tone.rgb},.6)"></span>`
          : p.marker;
        const rank = p.data && p.data.rank ? `<span style="margin-left:8px;color:#94a3b8">#${p.data.rank}</span>` : "";
        return `<div style="display:flex;align-items:center;margin-top:4px">${dot}<span style="color:#64748b">${p.seriesName || ""}</span><b style="margin-left:12px;font-size:14px;color:#1f2937;font-family:DIN Alternate,Arial">${val}</b>${rank}</div>`;
      });
      return `<div style="font-weight:600;color:#1f2937">${head}</div>${lines.join("")}`;
    },
    tooltipBase(trigger) {
      return {
        trigger,
        confine: true,
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: "#1f2937", fontSize: 12 },
        extraCssText:
          "border-radius:10px;box-shadow:0 10px 24px rgba(15,23,42,0.12);",
        formatter: this.formatTooltip,
      };
    },
    calcStats(values) {
      if (!values.length) return null;
      const sum = values.reduce((a, b) => a + b, 0);
      return {
        count: values.length,
        avg: Math.round((sum / values.length) * 10) / 10,
        max: Math.max(...values),
      };
    },
    axisStyle() {
      return {
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisTick: { show: false },
        axisLabel: { color: "#64748b", fontSize: 11 },
      };
    },
    valueAxisStyle() {
      return {
        type: "value",
        minInterval: 1,
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        splitLine: { lineStyle: { color: "#eef2f7", type: "dashed" } },
      };
    },
    avgMarkLine(tone, values) {
      const s = this.calcStats(values);
      if (!s) return undefined;
      // 用全量平均值：type: "average" 只统计 dataZoom 可见区间，会与标题统计对不上
      return {
        silent: true,
        symbol: "none",
        data: [{ yAxis: s.avg }],
        lineStyle: { color: `rgba(${tone.rgb},0.7)`, type: "dashed", width: 1 },
        label: {
          position: "insideEndTop",
          color: tone.c1,
          fontSize: 11,
          fontWeight: 600,
          padding: [2, 6],
          borderRadius: 8,
          backgroundColor: `rgba(${tone.rgb},0.1)`,
          formatter: (p) =>
            `${this.$t("LocationIndoorHis.statAvg")} ${Math.round(p.value * 10) / 10}`,
        },
      };
    },
    tipNoData() {
      this.$message({
        message: this.$t("LocationIndoorHis.nodata"),
        type: "warning",
      });
    },
    renderEmpty(chart) {
      if (!chart) return;
      if (chart === this.chartTop) this.stats.top = null;
      if (chart === this.chartBottom) this.stats.bottom = null;
      chart.setOption(
        {
          graphic: [
            {
              type: "circle",
              left: "center",
              top: "middle",
              shape: { r: 46 },
              style: {
                fill: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                  { offset: 0, color: "rgba(47,123,255,0.12)" },
                  { offset: 1, color: "rgba(47,123,255,0)" },
                ]),
              },
              silent: true,
            },
          ],
          title: {
            text: this.$t("LocationIndoorHis.nodata"),
            left: "center",
            top: "middle",
            textStyle: {
              color: "#94a3b8",
              fontSize: 14,
              fontWeight: "normal",
            },
          },
          xAxis: { show: false, type: "category", data: [] },
          yAxis: { show: false, type: "value" },
          series: [],
          tooltip: { show: false },
        },
        { notMerge: true }
      );
    },
    renderBar(chart, names, values, tone, seriesName) {
      if (!chart) return;
      this.setStats(chart, values);
      // 人多时默认只展示前若干名，其余靠 dataZoom 横向拖动，避免 X 轴姓名挤成一团
      const crowded = names.length > 15;
      const endPct = crowded
        ? Math.min(100, Math.max(12, (15 / names.length) * 100))
        : 100;
      // 按数值取前三名，用金/银/铜色突出（与升降序无关）
      const medalOf = {};
      values
        .map((v, i) => ({ v, i }))
        .filter((d) => d.v > 0)
        .sort((a, b) => b.v - a.v)
        .slice(0, 3)
        .forEach((d, k) => {
          medalOf[d.i] = k;
        });
      const rankOf = {};
      values
        .map((v, i) => ({ v, i }))
        .sort((a, b) => b.v - a.v)
        .forEach((d, k) => {
          rankOf[d.i] = k + 1;
        });
      const data = values.map((v, i) => {
        const medal = medalOf[i];
        const t = medal == null ? tone : MEDAL_TONES[medal];
        return {
          value: v,
          tone: t,
          rank: rankOf[i],
          itemStyle: {
            borderRadius: [8, 8, 2, 2],
            color: chartGradient(t, 0, 0, 0, 1),
            shadowBlur: medal == null ? 6 : 12,
            shadowColor: `rgba(${t.rgb},${medal == null ? 0.3 : 0.5})`,
            shadowOffsetY: 2,
          },
          label: {
            show: medal != null || !crowded,
            color: t.c1,
          },
        };
      });
      chart.setOption(
        {
          title: { show: false },
          tooltip: {
            ...this.tooltipBase("axis"),
            axisPointer: {
              type: "shadow",
              shadowStyle: { color: `rgba(${tone.rgb},0.06)` },
            },
          },
          grid: {
            left: 12,
            right: 24,
            top: 36,
            bottom: crowded ? 36 : 10,
            containLabel: true,
          },
          dataZoom: crowded
            ? [
                {
                  type: "slider",
                  xAxisIndex: 0,
                  height: 14,
                  bottom: 8,
                  start: 0,
                  end: endPct,
                  brushSelect: false,
                  showDetail: false,
                  borderColor: "transparent",
                  backgroundColor: "#f1f5f9",
                  fillerColor: `rgba(${tone.rgb},0.22)`,
                  dataBackground: {
                    lineStyle: { color: `rgba(${tone.rgb},0.4)` },
                    areaStyle: { color: `rgba(${tone.rgb},0.12)` },
                  },
                  selectedDataBackground: {
                    lineStyle: { color: tone.c1 },
                    areaStyle: { color: `rgba(${tone.rgb},0.25)` },
                  },
                  handleSize: "120%",
                  handleStyle: {
                    color: "#fff",
                    borderColor: tone.c1,
                    shadowBlur: 4,
                    shadowColor: `rgba(${tone.rgb},0.4)`,
                  },
                  moveHandleSize: 0,
                },
                {
                  type: "inside",
                  xAxisIndex: 0,
                  start: 0,
                  end: endPct,
                  zoomOnMouseWheel: false,
                  moveOnMouseWheel: true,
                  moveOnMouseMove: true,
                },
              ]
            : [],
          xAxis: {
            type: "category",
            data: names,
            ...this.axisStyle(),
            axisLabel: {
              ...this.axisStyle().axisLabel,
              interval: 0,
              rotate: names.length > 10 ? 35 : 0,
              hideOverlap: true,
            },
          },
          yAxis: this.valueAxisStyle(),
          series: [
            {
              type: "bar",
              name: seriesName,
              data,
              barMaxWidth: 28,
              barMinHeight: 2,
              showBackground: true,
              backgroundStyle: {
                color: "rgba(148,163,184,0.1)",
                borderRadius: [8, 8, 2, 2],
              },
              label: {
                position: "top",
                distance: 4,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "DIN Alternate, Arial",
              },
              emphasis: {
                label: { show: true },
                itemStyle: { shadowBlur: 16 },
              },
              markLine: this.avgMarkLine(tone, values),
              animationDuration: 900,
              animationEasing: "cubicOut",
              animationDelay: (idx) => Math.min(idx, 20) * 40,
            },
          ],
        },
        { notMerge: true }
      );
    },
    setStats(chart, values) {
      const s = this.calcStats(values);
      if (chart === this.chartTop) this.stats.top = s;
      if (chart === this.chartBottom) this.stats.bottom = s;
    },
    renderLine(chart, times, values, tone, seriesName) {
      if (!chart) return;
      this.setStats(chart, values);
      const pointer = {
        color: `rgba(${tone.rgb},0.6)`,
        width: 1,
        type: "dashed",
      };
      // 两图各自独立渲染；不使用 echarts.connect，避免轴指示线只出现在其中一个图上
      chart.setOption(
        {
          title: { show: false },
          tooltip: {
            ...this.tooltipBase("axis"),
            triggerOn: "mousemove|click",
            axisPointer: {
              type: "line",
              snap: true,
              z: 100,
              label: { show: false },
              lineStyle: pointer,
            },
          },
          grid: { left: 12, right: 28, top: 40, bottom: 10, containLabel: true },
          xAxis: {
            type: "category",
            data: times,
            boundaryGap: false,
            ...this.axisStyle(),
            axisPointer: {
              show: true,
              type: "line",
              snap: true,
              lineStyle: pointer,
            },
          },
          yAxis: { ...this.valueAxisStyle(), splitNumber: 5 },
          series: [
            {
              type: "line",
              name: seriesName,
              data: values.map((v) => ({ value: v, tone })),
              smooth: 0.35,
              smoothMonotone: "x",
              showSymbol: values.length <= 48,
              symbol: "circle",
              symbolSize: 7,
              itemStyle: {
                color: "#fff",
                borderColor: tone.c1,
                borderWidth: 2,
              },
              lineStyle: {
                width: 3,
                color: chartGradient(tone, 0, 0, 1, 0),
                shadowBlur: 10,
                shadowColor: `rgba(${tone.rgb},0.45)`,
                shadowOffsetY: 6,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: `rgba(${tone.rgb},0.32)` },
                  { offset: 0.7, color: `rgba(${tone.rgb},0.06)` },
                  { offset: 1, color: `rgba(${tone.rgb},0)` },
                ]),
              },
              emphasis: {
                scale: 1.6,
                itemStyle: {
                  color: tone.c1,
                  borderColor: "#fff",
                  borderWidth: 2,
                  shadowBlur: 10,
                  shadowColor: `rgba(${tone.rgb},0.6)`,
                },
                label: {
                  show: true,
                  position: "top",
                  distance: 8,
                  color: tone.c1,
                  fontSize: 12,
                  fontWeight: 700,
                  formatter: (p) =>
                    p.value == null || p.value === "" ? "-" : String(p.value),
                },
              },
              label: { show: false },
              markPoint: {
                symbol: "pin",
                symbolSize: 40,
                data: [{ type: "max" }],
                itemStyle: {
                  color: chartGradient(tone, 0, 0, 0, 1),
                  shadowBlur: 8,
                  shadowColor: `rgba(${tone.rgb},0.5)`,
                },
                label: {
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "DIN Alternate, Arial",
                },
              },
              markLine: this.avgMarkLine(tone, values),
              animationDuration: 1200,
              animationEasing: "cubicOut",
            },
          ],
        },
        { notMerge: true }
      );
    },
    rankQuery(sort) {
      if (!this.searchForm.stepdate) {
        this.searchForm.stepdate = this.formatToday();
      }
      return {
        projectid: this.projectid,
        stepdate: this.searchForm.stepdate,
        sort,
        count: 50,
        // 未指定具体人员：排行统计
        stattype: 1,
      };
    },
    /** @returns {boolean} 是否空数据（接口成功但列表为空） */
    applyStepRank(res) {
      if (res.code != 1001) {
        if (res.msg) {
          this.$message({
            message: this.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        return false;
      }
      const list = this.pickList(res);
      if (!list.length) {
        this.renderEmpty(this.chartTop);
        return true;
      }
      const names = list.map((i) => i.username || "-");
      const values = list.map((i) => Number(i.steps != null ? i.steps : 0));
      this.renderBar(
        this.chartTop,
        names,
        values,
        CHART_TONES.blue,
        this.$t("LocationIndoorHis.stepRank")
      );
      return false;
    },
    /** @returns {boolean} 是否空数据（接口成功但列表为空） */
    applyVibRank(res) {
      if (res.code != 1001) {
        if (res.msg) {
          this.$message({
            message: this.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        return false;
      }
      const list = this.pickList(res);
      if (!list.length) {
        this.renderEmpty(this.chartBottom);
        return true;
      }
      const names = list.map((i) => i.username || "-");
      const values = list.map((i) =>
        Number(i.vibstate != null ? i.vibstate : 0)
      );
      this.renderBar(
        this.chartBottom,
        names,
        values,
        CHART_TONES.green,
        this.$t("LocationIndoorHis.activityRank")
      );
      return false;
    },
    loadStepRank() {
      this.viewMode = "rank";
      return getRunInfoStepsList(
        this.rankQuery(this.stepSort),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => this.applyStepRank(res));
    },
    loadVibRank() {
      this.viewMode = "rank";
      return getRunInfoVibstateList(
        this.rankQuery(this.vibSort),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => this.applyVibRank(res));
    },
    loadRankCharts() {
      this.viewMode = "rank";
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading") || "Loading",
        background: "rgba(0, 0, 0, 0.5)",
        target: this.$el,
      });
      Promise.all([this.loadStepRank(), this.loadVibRank()])
        .then(([stepEmpty, vibEmpty]) => {
          if (stepEmpty || vibEmpty) this.tipNoData();
        })
        .catch(() => {})
        .finally(() => {
          loading.close();
          this.$nextTick(() => this.resizeCharts());
        });
    },
    loadDetailCharts() {
      if (!this.searchForm.username || !this.searchForm.stepdate) {
        this.$message({
          message: this.$t("LocationIndoorHis.pleaseNameAndDate"),
          type: "warning",
        });
        return;
      }
      this.viewMode = "detail";
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading") || "Loading",
        background: "rgba(0, 0, 0, 0.5)",
        target: this.$el,
      });
      getRunInfoDateList(
        {
          username: this.searchForm.username,
          projectid: this.projectid,
          stepdate: this.searchForm.stepdate,
          // 查询具体人员明细
          stattype: 0,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res.code != 1001) {
            this.$message({
              message: this.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            return;
          }
          const rawList = this.pickList(res);
          if (!rawList.length) {
            this.renderEmpty(this.chartTop);
            this.renderEmpty(this.chartBottom);
            this.tipNoData();
            return;
          }
          // 接口字段：time 时间、steps 步数、vibstate 活跃度
          // 接口返回顺序倒序后再画图（不依赖 time 字段解析）
          const list = rawList.slice().reverse();
          const times = list.map((i) => this.formatRunInfoTime(i));
          const steps = list.map((i) => Number(i.steps != null ? i.steps : 0));
          const vibs = list.map((i) =>
            Number(i.vibstate != null ? i.vibstate : 0)
          );
          this.renderLine(
            this.chartTop,
            times,
            steps,
            CHART_TONES.blue,
            this.$t("LocationIndoorHis.stepTrend")
          );
          this.renderLine(
            this.chartBottom,
            times,
            vibs,
            CHART_TONES.green,
            this.$t("LocationIndoorHis.activityTrend")
          );
        })
        .finally(() => {
          loading.close();
          this.$nextTick(() => this.resizeCharts());
        });
    },
    onSearch() {
      if (this.searchForm.username) {
        if (!this.searchForm.stepdate) {
          this.searchForm.stepdate = this.formatToday();
        }
        this.loadDetailCharts();
      } else {
        this.loadRankCharts();
      }
    },
    onRefresh() {
      // 刷新：清空姓名等筛选，回到排行柱状图
      this.searchForm.username = "";
      this.userOptions = [];
      this.searchForm.stepdate = this.formatToday();
      this.sort = 2;
      this.stepSort = 2;
      this.vibSort = 2;
      this.viewMode = "rank";
      this.loadRankCharts();
    },
    /** 筛选栏：两图同步排序并各调一次接口 */
    onSortAll() {
      if (this.viewMode === "detail") return;
      const current =
        this.stepSort === this.vibSort ? this.stepSort : this.sort;
      this.sort = current === 2 ? 1 : 2;
      this.stepSort = this.sort;
      this.vibSort = this.sort;
      this.loadRankCharts();
    },
    /** 两图排序一致时，同步筛选栏按钮文案状态 */
    syncFilterSortIfSame() {
      if (this.stepSort === this.vibSort) {
        this.sort = this.stepSort;
      }
    },
    /** 步数图单独排序 */
    onSortStep(sort) {
      if (this.viewMode === "detail") return;
      if (this.stepSort === sort) return;
      this.stepSort = sort;
      this.syncFilterSortIfSame();
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading") || "Loading",
        background: "rgba(0, 0, 0, 0.5)",
        target: this.$el,
      });
      this.loadStepRank()
        .then((empty) => {
          if (empty) this.tipNoData();
        })
        .catch(() => {})
        .finally(() => {
          loading.close();
          this.$nextTick(() => this.resizeCharts());
        });
    },
    /** 活跃度图单独排序 */
    onSortVib(sort) {
      if (this.viewMode === "detail") return;
      if (this.vibSort === sort) return;
      this.vibSort = sort;
      this.syncFilterSortIfSame();
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading") || "Loading",
        background: "rgba(0, 0, 0, 0.5)",
        target: this.$el,
      });
      this.loadVibRank()
        .then((empty) => {
          if (empty) this.tipNoData();
        })
        .catch(() => {})
        .finally(() => {
          loading.close();
          this.$nextTick(() => this.resizeCharts());
        });
    },
    resizeCharts() {
      this.chartTop && this.chartTop.resize();
      this.chartBottom && this.chartBottom.resize();
    },
  },
  mounted() {
    this.searchForm.stepdate = this.formatToday();
    this.getMemberNames().finally(() => {
      this.$nextTick(() => {
        this.initCharts();
        this.loadRankCharts();
        this.resizeHandler = () => this.resizeCharts();
        window.addEventListener("resize", this.resizeHandler);
        // 布局稳定后再刷一次，避免首次按窄宽度渲染
        setTimeout(() => this.resizeCharts(), 100);
        setTimeout(() => this.resizeCharts(), 400);
      });
    });
  },
  beforeUnmount() {
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
    this.disposeCharts();
  },
};
</script>

<style scoped>
/* 抵消 App.vue * { margin:0 auto } / text-align:center，铺满主内容区 */
.data-analysis-page {
  position: relative !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  min-height: 0;
  margin: 0 !important;
  padding: 12px 16px 16px;
  box-sizing: border-box;
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  text-align: left !important;
  overflow: hidden;
}
/* 底部给 App.vue 固定的 30px 语言栏留位；.norem 避免被 pxtorem 按屏宽缩小 */
.data-analysis-page.norem {
  padding-bottom: 40px;
}
.data-analysis-page > * {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box;
}
.inputContent.outdoor-filter-flow.terminal-filter-flow {
  height: auto !important;
  width: 100% !important;
  max-width: 100% !important;
  z-index: 1;
  display: flex !important;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start !important;
  gap: 8px 16px;
  margin: 0 0 12px 0 !important;
  padding: 0;
  flex: 0 0 auto !important;
}
.outdoor-filter-flow.terminal-filter-flow
  > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.outdoor-filter-flow.terminal-filter-flow .terminal-filter-item,
.outdoor-filter-flow.terminal-filter-flow .terminal-toolbar-item {
  width: auto !important;
  max-width: none !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item
  :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  line-height: 32px;
  white-space: nowrap !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-filter-item
  :deep(.el-form-item__content) {
  margin-left: 0 !important;
  margin-right: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
}
/* 固定日期框宽度，避免悬停出现清除图标时把右侧按钮挤动 */
.outdoor-filter-flow.terminal-filter-flow
  .analysis-date-item
  :deep(.el-date-editor) {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  box-sizing: border-box !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .analysis-date-item
  :deep(.el-input__wrapper) {
  width: 160px !important;
  box-sizing: border-box !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-toolbar-item
  :deep(.el-form-item__content) {
  display: inline-flex !important;
  gap: 8px !important;
  margin: 0 !important;
}
.outdoor-filter-flow.terminal-filter-flow
  .terminal-toolbar-item
  :deep(.el-button) {
  margin: 0 !important;
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
}
.query,
.reset {
  padding: 8px 12px !important;
}
.chart-panel {
  flex: 1 1 0 !important;
  min-height: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px;
  align-items: stretch !important;
}
.chart-card {
  --tone-c1: #2f7bff;
  --tone-c2: #22d3ee;
  --tone-rgb: 47, 123, 255;
  position: relative;
  flex: 1 1 0 !important;
  min-height: 240px !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: radial-gradient(
      120% 80% at 100% 0%,
      rgba(var(--tone-rgb), 0.06),
      rgba(var(--tone-rgb), 0) 55%
    ),
    #fff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden;
  align-self: stretch !important;
  transition: box-shadow 0.25s ease;
}
.chart-card:hover {
  box-shadow: 0 8px 24px rgba(var(--tone-rgb), 0.12);
}
.chart-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--tone-c1), var(--tone-c2), transparent);
}
.chart-card--activity {
  --tone-c1: #059669;
  --tone-c2: #34d399;
  --tone-rgb: 16, 185, 129;
}
.chart-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px 6px;
  margin: 0 !important;
  box-sizing: border-box;
}
.chart-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  margin: 0 !important;
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  background: linear-gradient(135deg, var(--tone-c2), var(--tone-c1));
  box-shadow: 0 4px 10px rgba(var(--tone-rgb), 0.35);
}
.chart-stats {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 !important;
}
.chart-stat {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  margin: 0 !important;
  padding: 3px 10px;
  border-radius: 14px;
  background: #f5f7fb;
  border: 1px solid #eef2f7;
}
.chart-stat em {
  font-style: normal;
  font-size: 12px;
  color: #8a94a6;
}
.chart-stat b {
  font-size: 15px;
  line-height: 1;
  color: #1f2937;
  font-family: "DIN Alternate", Arial, sans-serif;
}
.chart-stat--max {
  background: rgba(var(--tone-rgb), 0.08);
  border-color: rgba(var(--tone-rgb), 0.18);
}
.chart-stat--max b {
  color: var(--tone-c1);
}
.chart-title {
  flex: 0 0 auto;
  width: auto;
  max-width: none;
  padding: 0;
  font-weight: 700;
  font-size: 15px;
  color: #1f2937;
  text-align: left !important;
  margin: 0 auto 0 0 !important;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}
.chart-title > span {
  flex: 0 0 auto;
  margin: 0 !important;
}
.chart-title :deep(.el-tooltip__trigger),
.chart-title :deep(.el-only-child__content) {
  display: inline-flex !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
}
.chart-title-tip {
  flex: 0 0 auto;
  font-size: 14px;
  color: #909399;
  cursor: help;
  font-weight: normal;
  margin: 0 !important;
}
.chart-sort {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0 !important;
  padding: 2px;
  border-radius: 8px;
  background: #f1f5f9;
}
.chart-sort :deep(.el-button) {
  margin: 0 !important;
  height: 24px;
  padding: 0 12px;
  border: none;
  border-radius: 6px;
  color: #64748b;
  background: transparent;
  box-shadow: none;
}
.chart-sort :deep(.el-button:hover) {
  color: var(--tone-c1);
}
.chart-sort :deep(.el-button--primary) {
  color: #fff;
  background: linear-gradient(135deg, var(--tone-c2), var(--tone-c1));
  box-shadow: 0 2px 6px rgba(var(--tone-rgb), 0.35);
}
.chart-sort :deep(.el-button--primary:hover) {
  color: #fff;
}
.chart-box {
  flex: 1 1 0 !important;
  min-height: 200px !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
}
</style>
