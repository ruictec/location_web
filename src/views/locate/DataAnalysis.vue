<template>
  <div class="data-analysis-page">
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
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title">{{ chartTitleTop }}</div>
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
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title">{{ chartTitleBottom }}</div>
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
import * as echarts from "echarts";
import {
  getMemberNameId,
  getMemberStepRank,
  getMemberVibstateRank,
  getRunInfoDateList,
} from "../../axios/api";

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
      chartTop: null,
      chartBottom: null,
      resizeHandler: null,
    };
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
    initCharts() {
      if (this.$refs.chartTop) {
        this.chartTop = echarts.init(this.$refs.chartTop);
      }
      if (this.$refs.chartBottom) {
        this.chartBottom = echarts.init(this.$refs.chartBottom);
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
        return `${p.marker}${val}`;
      });
      return head ? `${head}<br/>${lines.join("<br/>")}` : lines.join("<br/>");
    },
    tipNoData() {
      this.$message({
        message: this.$t("LocationIndoorHis.nodata"),
        type: "warning",
      });
    },
    renderEmpty(chart) {
      if (!chart) return;
      chart.clear();
      chart.setOption(
        {
          title: {
            text: this.$t("LocationIndoorHis.nodata"),
            left: "center",
            top: "middle",
            textStyle: {
              color: "#909399",
              fontSize: 14,
              fontWeight: "normal",
            },
          },
        },
        true
      );
    },
    renderBar(chart, names, values, color) {
      if (!chart) return;
      chart.setOption(
        {
          color: [color || "#409EFF"],
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: this.formatTooltip,
          },
          grid: {
            left: 50,
            right: 24,
            top: 36,
            bottom: names.length > 12 ? 70 : 40,
          },
          xAxis: {
            type: "category",
            data: names,
            axisLabel: {
              interval: 0,
              rotate: names.length > 10 ? 35 : 0,
            },
          },
          yAxis: { type: "value", minInterval: 1 },
          series: [
            {
              type: "bar",
              data: values,
              barMaxWidth: 36,
              label: { show: false },
              emphasis: {
                label: {
                  show: true,
                  position: "top",
                  color: "#606266",
                  fontSize: 11,
                },
              },
            },
          ],
        },
        true
      );
    },
    renderLine(chart, times, values, color) {
      if (!chart) return;
      // 两图各自独立渲染；不使用 echarts.connect，避免轴指示线只出现在其中一个图上
      chart.setOption(
        {
          color: [color || "#409EFF"],
          tooltip: {
            show: true,
            trigger: "axis",
            triggerOn: "mousemove|click",
            confine: true,
            axisPointer: {
              type: "line",
              snap: true,
              z: 100,
              label: { show: false },
              lineStyle: {
                color: "#909399",
                width: 1,
                type: "dashed",
              },
            },
            formatter: this.formatTooltip,
          },
          grid: { left: 50, right: 24, top: 40, bottom: 40 },
          xAxis: {
            type: "category",
            data: times,
            boundaryGap: false,
            axisPointer: {
              show: true,
              type: "line",
              snap: true,
              lineStyle: {
                color: "#909399",
                width: 1,
                type: "dashed",
              },
            },
          },
          yAxis: {
            type: "value",
            scale: false,
            splitNumber: 5,
          },
          series: [
            {
              type: "line",
              data: values,
              smooth: true,
              showSymbol: true,
              symbol: "circle",
              symbolSize: 8,
              emphasis: {
                scale: 1.4,
                itemStyle: {
                  borderWidth: 2,
                  borderColor: "#fff",
                },
                label: {
                  show: true,
                  position: "top",
                  distance: 6,
                  color: "#606266",
                  fontSize: 12,
                  formatter: (p) =>
                    p.value == null || p.value === "" ? "-" : String(p.value),
                },
              },
              label: { show: false },
            },
          ],
        },
        true
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
      this.renderBar(this.chartTop, names, values, "#409EFF");
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
      this.renderBar(this.chartBottom, names, values, "#67C23A");
      return false;
    },
    loadStepRank() {
      this.viewMode = "rank";
      return getMemberStepRank(
        this.rankQuery(this.stepSort),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => this.applyStepRank(res));
    },
    loadVibRank() {
      this.viewMode = "rank";
      return getMemberVibstateRank(
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
          const list = this.pickList(res);
          if (!list.length) {
            this.renderEmpty(this.chartTop);
            this.renderEmpty(this.chartBottom);
            this.tipNoData();
            return;
          }
          // 接口字段：time 时间、steps 步数、vibstate 活跃度
          const times = list.map((i) => {
            const t = i.time != null ? i.time : i.gpstime || i.steptime || i.createtime;
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
          });
          const steps = list.map((i) => Number(i.steps != null ? i.steps : 0));
          const vibs = list.map((i) =>
            Number(i.vibstate != null ? i.vibstate : 0)
          );
          this.renderLine(this.chartTop, times, steps, "#409EFF");
          this.renderLine(this.chartBottom, times, vibs, "#67C23A");
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
  flex: 1 1 0 !important;
  min-height: 240px !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden;
  align-self: stretch !important;
}
.chart-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 12px;
  border-bottom: 1px solid #ebeef5;
  margin: 0 !important;
  box-sizing: border-box;
}
.chart-title {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  font-weight: 600;
  color: #303133;
  text-align: left !important;
  margin: 0 !important;
  line-height: 28px;
}
.chart-sort {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 !important;
}
.chart-sort :deep(.el-button) {
  margin: 0 !important;
}
.chart-box {
  flex: 1 1 0 !important;
  min-height: 200px !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
}
</style>
