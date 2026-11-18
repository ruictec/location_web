<template>
  <div class="test-screen" ref="root">
    <header class="ts-header">
      <div class="ts-head-main">
        <h1 class="ts-title">{{ projectName }}</h1>
        <span class="ts-time">{{ now }}</span>
      </div>

      <!-- 上下船播报：三列 × 3 行可见，自动向上循环滚动；
           鼠标移入暂停自动滚动，可用滚轮手动上下翻看 -->
      <div
        class="ts-marquee"
        @mouseenter="pauseMarquee"
        @mouseleave="resumeMarquee"
      >
        <ul class="marquee-track" v-for="(col, ci) in marqueeCols" :key="ci">
          <li v-for="row in col" :key="row.key">
            <span class="mq-time">{{ row.time }}</span>
            <span class="mq-name">{{ row.name }}</span>
            <span class="action-tag" :class="'action--' + row.action">
              {{ row.actionText }}
            </span>
          </li>
        </ul>
      </div>

      <span class="ts-back" :title="$t('list.backHint')" @click="goBack">{{
        $t("list.back")
      }}</span>
    </header>

    <section class="ts-kpi">
      <div
        class="kpi-card"
        v-for="item in kpis"
        :key="item.label"
        :style="{ '--kpi-rgb': item.rgb }"
      >
        <!-- 图标和标题放在一起；SOS 卡把数量也放到这一行右侧，省掉一整行 -->
        <div class="kpi-head">
          <i class="kpi-icon" :class="item.icon"></i>
          <span class="kpi-label">{{ item.label }}</span>
          <span v-if="item.sosItems" class="kpi-inline-value">
            <b>{{ item.value }}</b><em>{{ item.unit }}</em>
          </span>
        </div>
        <!-- 非 SOS 卡：左边大数值，右边环形占比图填满空白 -->
        <div class="kpi-body" v-if="!item.sosItems">
          <p class="kpi-value">
            <b>{{ item.value }}</b>
            <em>{{ item.unit }}</em>
          </p>
          <div
            class="kpi-ring"
            v-if="item.pct != null"
            :data-tip="item.ringTip"
            :style="{ '--ring-pct': item.pct + '%' }"
          >
            <span>{{ item.pct }}%</span>
          </div>
        </div>
        <!-- 细分说明放卡片底部，和标题、数值形成上中下三段 -->
        <div class="kpi-subs" v-if="item.subs && item.subs.length">
          <span class="kpi-sub" v-for="sub in item.subs" :key="sub.text">
            <i :style="{ background: sub.color }"></i>{{ sub.text }}</span
          >
        </div>
        <!-- SOS 卡：直接把最近的告警明细列在卡片里 -->
        <ul class="kpi-sos-list" v-if="item.sosItems && item.sosItems.length">
          <li v-for="sos in item.sosItems" :key="sos.id">
            <span class="kpi-sos-name">{{ sos.name }}</span>
            <span class="kpi-sos-time">{{ sos.time }}</span>
            <span class="sos-tag" :class="'sos--' + sos.status">
              {{ sos.statusText
              }}<template v-if="sos.doneTime"> · {{ sos.doneTime }}</template>
            </span>
          </li>
        </ul>
        <p class="kpi-note" v-if="item.note">{{ item.note }}</p>
      </div>
    </section>

    <!-- 一个船舱一张卡片：人员数与气体数据放在同一张卡里 -->
    <section class="ts-cabins">
      <article
        class="cabin-card"
        v-for="cabin in cabinList"
        :key="cabin.name"
        :class="'cabin-card--' + cabin.level"
      >
        <header class="cabin-head">
          <span class="cabin-name">{{ cabin.name }}</span>
          <span class="cabin-people">
            <b>{{ cabin.people }}</b>
            <em>{{ $t("list.person") }}</em>
          </span>
        </header>

        <!-- 每种气体一个仪表盘圆弧：绿色段为安全区，红色段为危险区 -->
        <div class="cabin-gas">
          <div class="gas-cell" v-for="gas in cabin.gases" :key="gas.key">
            <div class="gas-gauge" :id="'g-' + cabin.key + '-' + gas.key"></div>
            <p class="gas-caption">
              <span class="gas-name">{{ gas.label }}</span>
            </p>
          </div>
        </div>

        <!-- 双栏：左在舱人员（姓名 + 停留时长），右进出舱信息 -->
        <div class="cabin-cols">
          <div class="cabin-col">
            <p class="col-title">{{ $t("list.memberInCabin") }}</p>
            <ul class="col-list">
              <li
                v-for="member in cabin.members"
                :key="member.name"
                :class="{ 'is-sos': member.sos }"
              >
                <span class="col-name">{{ member.name }}</span>
                <span v-if="member.sos" class="sos-flag">SOS</span>
                <span class="col-extra">{{
                  formatDuration(member.minutes)
                }}</span>
              </li>
            </ul>
          </div>
          <div class="cabin-col">
            <p class="col-title">{{ $t("list.cabinLogs") }}</p>
            <ul class="col-list">
              <li v-for="log in cabin.logs" :key="log.name + log.time">
                <span class="col-name">{{ log.name }}</span>
                <span class="log-tag" :class="'log--' + log.action">
                  {{ log.actionText }}
                </span>
                <span class="col-extra">{{ log.time }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 多种异常并存时全部展示（如 SOS 告警 + 气体异常） -->
        <footer class="cabin-foot">
          <span
            v-for="tag in cabin.tags"
            :key="tag.key"
            class="status-tag"
            :class="'status--' + tag.level"
          >
            {{ tag.text }}
          </span>
        </footer>
      </article>
    </section>

  </div>
</template>

<script>
import echarts from "../../utils/echartsLegacy";
import { markRaw } from "vue";
import host from "../../host";
import {
  getShipAccessList,
  getShipBoardList,
  getWarningList,
} from "../../axios/api";

/* ============================================================
 * 气体阈值配置 —— 到现场后只需修改这里的数值
 * ------------------------------------------------------------
 * min / max : 仪表盘量程。max 建议设为「危险阈值 × 1.5 ~ 2」，
 *             太小指针容易贴边，太大安全区会被压得很扁。
 * safe      : 安全区间 [下限, 上限]。仪表盘上：
 *             低于下限的弧段 → 红色（如缺氧）
 *             safe 区间内的弧段 → 绿色
 *             高于上限的弧段 → 红色（如富氧 / 浓度超标）
 * decimals  : 数值保留几位小数
 * splitNumber: 圆周上分几段刻度，决定显示几个刻度数值
 *              （2 → 显示 3 个数字，3 → 显示 4 个）
 * ============================================================ */
const GAS_CONFIG = {
  o2: {
    label: "O₂",
    unit: "%",
    min: 0,
    max: 30,
    safe: [19.5, 23.5], // 缺氧 < 19.5%，富氧 > 23.5%
    decimals: 1,
    splitNumber: 3, // 0 / 10 / 20 / 30
  },
  co: {
    label: "CO",
    unit: "ppm",
    min: 0,
    max: 60,
    safe: [0, 30], // 超过 30ppm 危险
    decimals: 0,
    splitNumber: 3, // 0 / 20 / 40 / 60
  },
  h2s: {
    label: "H₂S",
    unit: "ppm",
    min: 0,
    max: 20,
    safe: [0, 10], // 超过 10ppm 危险
    decimals: 1,
    splitNumber: 2, // 0 / 10 / 20
  },
  ex: {
    label: "EX",
    unit: "%LEL",
    min: 0,
    max: 20,
    safe: [0, 10], // 超过 10%LEL 危险
    decimals: 0,
    splitNumber: 2, // 0 / 10 / 20
  },
};


// 后端时间有两种：秒级 Unix 时间戳（1794811989）和 "2026-11-16 10:23:41" 字符串，
// 这里统一转成 Date（字符串里的 - 换成 / 以兼容 Safari）
const toDate = (ts) => {
  if (typeof ts === "string" && /[-:/\s]/.test(ts)) {
    return new Date(ts.replace(/-/g, "/"));
  }
  const num = Number(ts);
  if (!num) return new Date(NaN);
  return new Date(num < 1e12 ? num * 1000 : num);
};
// 时间戳转 HH:mm
const toClock = (ts) => {
  const d = toDate(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
// 时间戳转 HH:mm:ss
const toClockSec = (ts) => {
  const d = toDate(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};



/* ============================================================
 * 假船舱数据 —— 后端真实数据不足时用于填充页面
 * ------------------------------------------------------------
 * 结构与 getShipBoardList 返回的楼层对象保持一致，
 * 拼在真实数据之后（真实数据在前，假数据在后）。
 * 后端数据完整后，把 buildMockCabins() 的调用去掉即可。
 * ============================================================ */
// 缓存：每次重拉都重新生成会让假船舱的「在舱时间」跳回初始值
let mockCabinsCache = null;

const buildMockCabins = () => {
  if (mockCabinsCache) return mockCabinsCache;
  const now = Math.floor(Date.now() / 1000);
  // [舱名, ex, co, o2, h2s, [[姓名, 停留分钟], ...]]
  const defs = [
    ["货舱 A", 6, 18, 20.4, 4.1, [["李四", 210], ["吴九", 175], ["许亮", 132], ["何军", 88]]],
    ["机舱", 3, 12, 20.6, 2.4, [["张三", 152], ["郑十", 118], ["冯二", 63], ["陈明", 25], ["杨帆", 8]]],
    ["客舱", 2, 8, 20.8, 1.2, [["赵六", 260], ["周杰", 205], ["吴磊", 168], ["郑爽", 140], ["王芳", 96], ["李娜", 45], ["陈晨", 15]]],
    ["泵房", 12, 42, 18.6, 13.5, [["何强", 124], ["徐涛", 76], ["高鹏", 38]]],
    ["前压载舱", 2, 6, 20.7, 0.8, [["孙七", 176], ["马超", 133], ["黄磊", 91], ["林峰", 62], ["杜鹏", 34]]],
    ["后压载舱", 4, 14, 18.9, 3.2, [["周八", 158], ["龚伟", 112], ["廖强", 74], ["方舟", 43]]],
    ["冷藏舱", 11, 11, 20.3, 2.2, [["卢俊", 196], ["霍宁", 148], ["岳峰", 103], ["岳雷", 66], ["滕飞", 37]]],
    ["锚链舱", 3, 35, 20.5, 1.6, [["沈飞", 64], ["卢明", 28]]],
    ["舵机舱", 2, 9, 20.6, 1.1, [["蒋涛", 142], ["魏刚", 87], ["薛峰", 51], ["潘宇", 13]]],
  ];

  mockCabinsCache = defs.map(([name, ex, co, o2, h2s, members], i) => ({
    // 用字符串前缀避免与真实 groundid（数字）冲突
    groundid: `mock-${i + 1}`,
    name,
    ground: i + 2,
    building: "船厂",
    ex,
    co,
    o2,
    h2s,
    // 在舱人员：boardTime 用「当前时间 - 停留分钟」反推
    list: members.map(([username, minutes], j) => ({
      beaconid: `mock-${i + 1}-${j}`,
      username,
      boardTime: now - minutes * 60,
    })),
    // 进出舱记录：type 3 进舱 / 4 出舱（不能出现 1、2，那是船梯层的进出船）
    accessList: members.map(([username, minutes], j) => ({
      id: `mock-log-${i + 1}-${j}`,
      username,
      type: j === members.length - 1 && members.length > 2 ? 4 : 3,
      time: now - minutes * 60,
    })),
  }));
  return mockCabinsCache;
};

export default {
  name: "TestScreen",
  data() {
    return {
      now: "",
      timer: null,
      // getShipBoardList 返回的楼层数组（含气体、在舱人员、进出记录）
      shipsData: [],
      // SOS 告警：由 getWarningList 接口（type=1）返回
      sosAlarms: [],
      // SOS 轮询定时器
      sosTimer: null,
      // 上下船 / 进出舱实时推送
      shipSocket: null,
      shipBuildId: null,
      shipReconnectTimer: null,
      // 当前时间（秒），由定时器刷新，驱动在舱停留时长重算
      nowSec: Math.floor(Date.now() / 1000),
      boardTimer: null,
      // 进出舱数据请求的防抖定时器
      boardFetchTimer: null,
      // 播报自动滚动的暂停状态与动画帧句柄
      marqueePaused: false,
      marqueeRAF: null,
      // 所有气体仪表盘实例
      gasCharts: [],
    };
  },
  computed: {
    projectName() {
      return this.$store.state.intoProjectName || "";
    },
    // 总人数 = 页面上显示的船舱卡片在舱人数之和（已排除船梯层）
    totalPeople() {
      return this.cabinList.reduce((sum, cabin) => sum + cabin.people, 0);
    },
    // 每栋楼「楼层号最小」的一层是船梯层。
    // 用楼层号判断，不依赖它有没有进出船记录 —— 刚建好、还没人经过时也能识别。
    // 假船舱（groundid 以 mock- 开头）不参与判定。
    ladderIds() {
      const lowest = {};
      (this.shipsData || []).forEach((floor) => {
        if (String(floor.groundid).indexOf("mock-") === 0) return;
        const key = floor.buildid;
        const prev = lowest[key];
        if (!prev || Number(floor.ground) < Number(prev.ground)) {
          lowest[key] = floor;
        }
      });
      return new Set(
        Object.keys(lowest).map((key) => lowest[key].groundid)
      );
    },
    // 每个楼层（船舱）：在舱人员 + 四项气体 + 进出记录，逐项标出是否超阈值
    cabinList() {
      const sosNames = this.sosNames;
      // 用定时器维护的 nowSec：它会定时刷新，既能让停留时长自动增长，
      // 又保证取的是当前真实时间（之前用 floor(now/分钟) + boardTick，
      // 两者都在增长，等于时间走了两遍，停留越久偏差越大）
      const nowSec = this.nowSec;

      return (this.shipsData || [])
        // 过滤船梯层，满足任一条件即视为船梯层：
        // 1) accessList 里有进出船记录（type 1/2）
        // 2) 是本栋楼 ground 最小的一层（刚建好、没有任何记录时也能识别）
        .filter((floor) => {
          const hasBoardLog = (floor.accessList || []).some((item) => {
            const type = Number(item.type);
            return type === 1 || type === 2;
          });
          const isLowest = this.ladderIds.has(floor.groundid);
          return !hasBoardLog && !isLowest;
        })
        .map((floor, index) => {
          // 气体：后端可能返回 null，视为「无数据」而不是 0
          const gases = Object.keys(GAS_CONFIG).map((key) => {
            const cfg = GAS_CONFIG[key];
            const raw = floor[key];
            const hasValue =
              raw !== null && raw !== undefined && raw !== "";
            const value = hasValue ? Number(raw) || 0 : 0;
            return {
              key,
              label: cfg.label,
              unit: cfg.unit,
              value,
              cfg,
              hasValue,
              over:
                hasValue && (value < cfg.safe[0] || value > cfg.safe[1]),
            };
          });
          const hasAlarm = gases.some((gas) => gas.over);

          // 在舱人员：SOS 人员排最前并打标，其余按停留时长倒序
          const allMembers = (floor.list || [])
            .slice()
            .map((member) => ({
              // beaconid 是人员唯一标识（可能有重名，不能用 username 做 key）
              memberId: member.beaconid || member.eui,
              name: member.username || "-",
              minutes: Math.max(
                0,
                Math.floor((nowSec - Number(member.boardTime || 0)) / 60)
              ),
              sos: sosNames.has(member.username),
            }))
            .sort((a, b) => b.minutes - a.minutes);
          const members = [
            ...allMembers.filter((member) => member.sos),
            ...allMembers.filter((member) => !member.sos),
          ];
          const sosCount = allMembers.filter((member) => member.sos).length;

          // 进出记录：后端已按楼层规则筛好（最底层 type 1/2，其余 3/4）
          const logs = (floor.accessList || [])
            .slice()
            .sort((a, b) => Number(b.time) - Number(a.time))
            .map((item) => {
              const type = Number(item.type);
              const isIn = type === 1 || type === 3;
              return {
                logId: item.id,
                name: item.username || "-",
                action: isIn ? "in" : "out",
                actionText: isIn
                  ? this.$t("list.enterCabin")
                  : this.$t("list.leaveCabin"),
                time: toClock(item.time),
              };
            });

          // 底部标签：所有异常都要列出来（SOS 与气体异常可同时存在）
          const tags = [];
          if (sosCount) {
            tags.push({
              key: "sos",
              level: "sos",
              text: this.$t("list.sosAlarm"),
            });
          }
          if (hasAlarm) {
            tags.push({
              key: "danger",
              level: "danger",
              text: this.$t("list.gasAbnormal"),
            });
          }
          if (!tags.length) {
            tags.push({
              key: "normal",
              level: "normal",
              text: this.$t("list.gasNormal"),
            });
          }
          const level = tags[0].level;

          return {
            ...floor,
            idx: index,
            // groundid 是楼层主键（Integer），作为卡片稳定标识
            key: floor.groundid,
            cabinName: floor.name,
            buildingName: floor.building,
            gases,
            members,
            logs,
            people: members.length,
            sosCount,
            gasAlarm: hasAlarm,
            level,
            tags,
          };
        })
        // 分组排序：真实数据恒排在假数据之前；
        // 组内再按「SOS 告警 > 气体异常 > 正常」、同级按人数降序
        .sort((a, b) => {
          const isMock = (cabin) => String(cabin.key).indexOf("mock-") === 0;
          const mockDiff = Number(isMock(a)) - Number(isMock(b));
          if (mockDiff !== 0) return mockDiff;

          const rank = (cabin) => {
            if (cabin.level === "sos") return 0;
            if (cabin.gasAlarm) return 1;
            return 2;
          };
          const diff = rank(a) - rank(b);
          return diff !== 0 ? diff : b.people - a.people;
        });
    },
    abnormalCount() {
      // 按气体是否超限统计，不能看 level：SOS 舱的 level 已被改成 sos
      return this.cabinList.filter((item) => item.gasAlarm).length;
    },
    // 存在 SOS 告警的船舱数
    sosCabins() {
      return this.cabinList.filter((item) => item.sosCount > 0).length;
    },
    // SOS 告警：转状态文案，未处理的排前面
    sosList() {
      return (this.sosAlarms || [])
        .map((item) => ({
          ...item,
          statusText:
            item.status === "pending"
              ? this.$t("list.sosPending")
              : this.$t("list.sosDone"),
        }))
        .sort((a, b) => {
          if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
          return String(b.time).localeCompare(String(a.time));
        });
    },
    // 未处理的 SOS 数量
    sosPendingCount() {
      return this.sosList.filter((item) => item.status === "pending").length;
    },
    // 触发未处理 SOS 的人员姓名集合（已处理的不用高亮）
    sosNames() {
      return new Set(
        this.sosList
          .filter((item) => item.status === "pending")
          .map((item) => item.name)
      );
    },
    // 上下船播报：取各楼层进出记录里的「进船 / 出船」（type 1、2），按时间倒序
    boardingList() {
      const rows = [];
      (this.shipsData || []).forEach((floor) => {
        (floor.accessList || []).forEach((item) => {
          const type = Number(item.type);
          if (type !== 1 && type !== 2) return;
          rows.push({
            // groundid + 记录 id 保证唯一
            id: `${floor.groundid}-${item.id}`,
            name: item.username || "-",
            action: type === 1 ? "on" : "off",
            actionText:
              type === 1
                ? this.$t("list.boardOn")
                : this.$t("list.boardOff"),
            cabinName: floor.name,
            time: toClockSec(item.time),
            rawTime: Number(item.time) || 0,
          });
        });
      });
      return rows.sort((a, b) => b.rawTime - a.rawTime);
    },
    // 播报最新一条记录的 id，用来判断「是不是真的来了新记录」
    boardingTopId() {
      const first = this.boardingList[0];
      return first ? first.id : "";
    },
    // 播报三列：按索引取模分列，而不是按前后切段。
    // 这样三列「同一行」合起来正好是时间相邻的记录 ——
    // 最上面一行 = 最新的 3 条，第二行 = 次新的 3 条，依次往下。
    marqueeCols() {
      const list = this.boardingList;
      return [0, 1, 2].map((ci) => {
        const col = list.filter((_, index) => index % 3 === ci);
        // 只有内容超过一屏（3 行）才复制一份做无缝循环；
        // 记录本来就少时复制会让同一条重复出现，看起来像假数据
        const rows = col.length > 3 ? [...col, ...col] : col.slice();
        // key 只用 id + 副本标记、不含数组下标，避免新增记录时整列 DOM 重建
        return rows.map((item, index) => ({
          ...item,
          key: "c" + ci + (index < col.length ? "-a-" : "-b-") + item.id,
        }));
      });
    },
    kpis() {
      // 用 cabinList 而不是原始数组：否则船梯层也会被算进「船舱数」
      const cabins = this.cabinList.length || 1;
      const abnormal = this.abnormalCount;
      const sos = this.sosPendingCount;
      const sosDone = this.sosList.length - sos;
      const normalCabins = cabins - abnormal;
      const abnormalRatio = Math.round((abnormal / cabins) * 100);
      const normalRatio = 100 - abnormalRatio;
      const sosCabins = this.sosCabins;
      const sosRate = this.totalPeople
        ? Math.round((sos / this.totalPeople) * 100)
        : 0;

      return [
        {
          label: this.$t("list.totalPeople"),
          value: this.totalPeople,
          unit: this.$t("list.person"),
          rgb: "47,123,255",
          icon: "el-icon-user",
          subs: [
            {
              text: `${this.$t("list.cabinCount")} ${cabins}`,
              color: "#34d399",
            },
            { text: `${this.$t("list.sosAlarm")} ${sos}`, color: "#f87171" },
          ],
          // 环形图表示 SOS 告警人数占比
          pct: sosRate,
          ringTip: `${this.$t("list.sosAlarm")} ${sos}${this.$t(
            "list.person"
          )} / ${this.$t("list.totalPeople")} ${this.totalPeople}${this.$t(
            "list.person"
          )}`,
          note: "",
        },
        {
          label: this.$t("list.cabinCount"),
          value: cabins,
          unit: this.$t("list.unit"),
          rgb: "13,148,136",
          icon: "el-icon-box",
          subs: [
            {
              text: `${this.$t("list.gasNormal")} ${normalCabins}`,
              color: "#34d399",
            },
            {
              text: `${this.$t("list.gasAbnormal")} ${abnormal}`,
              color: "#f87171",
            },
            {
              text: `${this.$t("list.sosAlarm")} ${sosCabins}`,
              color: "#fbbf24",
            },
          ],
          pct: normalRatio,
          ringTip: `${this.$t("list.gasNormal")} ${normalCabins} / ${
            this.$t("list.cabinCount")
          } ${cabins}`,
          note: "",
        },
        {
          label: this.$t("list.gasAbnormalCabins"),
          value: abnormal,
          unit: this.$t("list.unit"),
          rgb: "239,68,68",
          icon: "el-icon-warning-outline",
          subs: [
            {
              text: `${this.$t("list.ratio")} ${abnormalRatio}%`,
              color: "#fbbf24",
            },
            {
              text: `${this.$t("list.gasNormal")} ${normalCabins}`,
              color: "#34d399",
            },
          ],
          pct: abnormalRatio,
          ringTip: `${this.$t("list.gasAbnormal")} ${abnormal} / ${
            this.$t("list.cabinCount")
          } ${cabins}`,
          note: "",
        },
        {
          label: this.$t("list.sosAlarm"),
          value: sos,
          unit: this.$t("list.unit"),
          rgb: "245,158,11",
          icon: "el-icon-bell",
          // SOS 卡不再用细分文字，直接展示全部告警明细（列表可滚动）
          subs: [],
          sosItems: this.sosList,
          note: `${this.$t("list.sosPending")} ${sos} · ${
            this.$t("list.sosDone")
          } ${sosDone}`,
        },
      ];
    },
  },
  watch: {
    // 只在「最新一条记录」变化时才把播报滚回顶部。
    // 用长度判断不可靠：后端截断时新旧条数可能相同；
    // 也不该每次数据刷新都重置，否则推送频繁时会一直跳回开头
    boardingTopId() {
      this.$nextTick(() => this.resetMarqueeScroll());
    },
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("resize", this.handleResize);
    this.$nextTick(() => {
      this.startMarquee();
      this.renderGasGauges();
    });
    // 进入大屏就拉一次真实的进出舱记录：先只打印返回结构，确认字段后再接入
    this.fetchShipAccessList();
    // 查询当前在舱人员：同样先只看返回结构
    this.fetchShipBoardList();
    // SOS 告警：走告警列表接口（type=1）
    this.fetchSosList();
    // 轮询兜底：WebSocket 推送为主，60 秒再拉一次防止漏消息
    this.sosTimer = setInterval(this.fetchSosList, 60000);
    // 监听 App.vue 转发的 SOS 推送（大屏路由下不弹窗、不播声音）
    this.$EventBus.$on("sosPush", this.onSosPush);
    // 定时刷新当前时间：停留时长才能自动增长，且与真实时间不漂移
    this.boardTimer = setInterval(() => {
      this.nowSec = Math.floor(Date.now() / 1000);
    }, 15000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
    clearInterval(this.sosTimer);
    this.sosTimer = null;
    clearInterval(this.boardTimer);
    this.boardTimer = null;
    clearTimeout(this.boardFetchTimer);
    this.boardFetchTimer = null;
    this.closeShipSocket();
    this.$EventBus.$off("sosPush", this.onSosPush);
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("resize", this.handleResize);
    this.stopMarquee();
    (this.gasCharts || []).forEach((chart) => {
      try {
        chart.dispose();
      } catch (e) {
        /* 实例已销毁，忽略 */
      }
    });
    this.gasCharts = [];
  },
  methods: {
    // 拉取进出舱记录：只按项目 ID 查询，结果暂不接入渲染，先看返回结构
    fetchShipAccessList() {
      const userInfo = this.$store.state.userInfo || {};
      const query = {
        projectid: this.$store.state.intoProjectid,
      };
      getShipAccessList(
        query,
        userInfo.tenantkey,
        userInfo.tenantid,
        userInfo.username
      )
        .then((res) => {
          console.log(
            "[getShipAccessList] 返回结构：",
            JSON.parse(JSON.stringify(res))
          );
        })
        .catch((err) => {
          console.warn("[getShipAccessList] 请求失败：", err);
        });
    },
    // 查询当前在舱人员：只按项目 ID 查询，结果暂不接入渲染，先看返回结构
    // 入口：短时间多条推送合并成一次请求，避免并发和返回错序
    fetchShipBoardList() {
      clearTimeout(this.boardFetchTimer);
      this.boardFetchTimer = setTimeout(() => {
        this.doFetchShipBoardList();
      }, 500);
    },
    doFetchShipBoardList() {
      const userInfo = this.$store.state.userInfo || {};
      const query = {
        projectid: this.$store.state.intoProjectid,
      };
      getShipBoardList(
        query,
        userInfo.tenantkey,
        userInfo.tenantid,
        userInfo.username
      )
        .then((res) => {
          console.log(
            "[getShipBoardList] 返回结构：",
            JSON.parse(JSON.stringify(res))
          );
          if (res.code != 1001 || !Array.isArray(res.data)) return;
          // 真实数据在前，假数据补在后面把页面填满
          this.shipsData = [...res.data, ...buildMockCabins()];
          // 建 WebSocket：sid = ship + buildid
          const first = res.data[0];
          if (first && first.buildid) {
            this.openShipSocket(first.buildid);
          }
          // 楼层数据到位后重画仪表盘。
          // 播报不在这里重置：改由「最新一条记录 id 变化」触发，
          // 否则每条推送都会把播报拉回开头，频繁时根本看不清
          this.$nextTick(() => {
            this.renderGasGauges();
          });
        })
        .catch((err) => {
          console.warn("[getShipBoardList] 请求失败：", err);
        });
    },
    // 建立大屏专用 WebSocket：/websocket/map/ship{buildid}
    // 用于实时感知上下船（type 1/2）和进出舱（type 3/4）的变化
    openShipSocket(buildid) {
      if (!buildid) return;
      if (typeof WebSocket === "undefined") return;
      // 同一个 buildid 且连接还活着就直接复用。
      // 否则每次数据刷新都会关掉连接再重建 —— 推送→重拉→重连，形成重连风暴
      const readyState = this.shipSocket && this.shipSocket.readyState;
      if (
        this.shipBuildId === buildid &&
        (readyState === WebSocket.OPEN || readyState === WebSocket.CONNECTING)
      ) {
        return;
      }
      this.closeShipSocket();
      this.shipBuildId = buildid;

      const sid = "ship" + buildid;
      let socket;
      try {
        socket = new WebSocket(host.ws + "map/" + sid);
      } catch (e) {
        return;
      }
      this.shipSocket = socket;

      socket.onmessage = (ev) => {
        const raw = typeof ev.data === "string" ? ev.data.trim() : "";
        // 心跳之类的纯文本直接忽略
        if (!raw || raw.charAt(0) !== "{") return;

        let msg;
        try {
          msg = JSON.parse(raw);
        } catch (e) {
          return;
        }
        if (!msg) return;
        console.log("[ship socket] 推送：", msg);

        // access：进出舱 / 上下船记录
        // 推一条只说明「有变化」，字段也不全（没有 boardTime、没有整层人员），
        // 统一走一次重拉（有 500ms 防抖），保证人员列表和进出记录都同步
        if (msg.access) {
          this.fetchShipBoardList();
          return;
        }
        // devGasMsg：气体实时值，没有对应的查询接口，只能就地更新
        if (msg.devGasMsg) {
          this.applyGasPush(msg.devGasMsg);
        }
      };

      socket.onclose = () => {
        this.shipSocket = null;
        // 5 秒后自动重连（页面还在才连）
        clearTimeout(this.shipReconnectTimer);
        this.shipReconnectTimer = setTimeout(() => {
          if (this.shipBuildId) this.openShipSocket(this.shipBuildId);
        }, 5000);
      };
    },
    // 气体实时推送：{ o2, co, ex, h2s, groundid, deveui, time }
    // 四个值都可能推送；某个字段缺失（如后端暂未补）时跳过，保留接口返回的原值
    applyGasPush(gas) {
      const groundid = Number(gas.groundid);
      if (!groundid) return;
      const floor = (this.shipsData || []).find(
        (item) => Number(item.groundid) === groundid
      );
      if (!floor) return;

      let changed = false;
      ["o2", "ex", "co", "h2s"].forEach((key) => {
        const value = gas[key];
        if (value === undefined || value === null) return;
        floor[key] = value;
        changed = true;
      });
      if (changed) {
        // 只刷新这一个楼层的仪表盘，不重拉接口、不影响其它卡片
        this.$nextTick(() => this.updateGaugeValues(groundid));
      }
    },
    // 局部刷新某个楼层的气体仪表盘（复用实例，只 setOption）
    updateGaugeValues(groundid) {
      const cabin = this.cabinList.find(
        (item) => Number(item.key) === Number(groundid)
      );
      if (!cabin) return;
      cabin.gases.forEach((gas) => {
        const el = document.getElementById(`g-${cabin.key}-${gas.key}`);
        if (!el) return;
        const chart =
          echarts.getInstanceByDom && echarts.getInstanceByDom(el);
        if (chart && !chart.isDisposed()) {
          chart.setOption(this.buildGaugeOption(gas), true);
        }
      });
    },
    closeShipSocket() {
      clearTimeout(this.shipReconnectTimer);
      this.shipReconnectTimer = null;
      const socket = this.shipSocket;
      this.shipSocket = null;
      if (socket) {
        socket.onmessage = null;
        socket.onclose = null;
        try {
          socket.close();
        } catch (e) {
          /* 已断开，忽略 */
        }
      }
    },
    // SOS 告警：查告警列表接口，只取 type=1（SOS）。
    // 按需求不传 page / count，由后端返回全部匹配记录
    fetchSosList() {
      const userInfo = this.$store.state.userInfo || {};
      const query = {
        superid: userInfo.superid,
        projectid: this.$store.state.intoProjectid,
        type: 1,
        status: "",
        begintime: "",
        endtime: "",
        deveui: "",
        username: "",
        devtype: "",
        endtype: "",
      };
      getWarningList(
        query,
        userInfo.tenantkey,
        userInfo.tenantid,
        userInfo.username
      )
        .then((res) => {
          console.log(
            "[getWarningList] SOS 返回结构：",
            JSON.parse(JSON.stringify(res))
          );
          if (res.code != 1001 || !res.data) return;
          const list = Array.isArray(res.data.list) ? res.data.list : [];
          this.sosAlarms = list
            .filter((item) => Number(item.type) === 1)
            .map((item, index) => ({
              id: item.id || item.warningid || index,
              name: item.username || "-",
              time: toClockSec(item.time),
              // status: 1 未解除（告警中）/ 2 已解除，
              // 对应后端 statustr 的「告警中」「已解除」
              status: Number(item.status) === 1 ? "pending" : "done",
              // 已解除时的解除时间
              doneTime: item.statustime ? toClockSec(item.statustime) : "",
            }));
        })
        .catch((err) => {
          console.warn("[getWarningList] SOS 请求失败：", err);
        });
    },
    // 收到 App.vue 转发的 SOS 推送：直接重拉列表，能拿到完整字段（位置、解除时间）
    onSosPush() {
      this.fetchSosList();
    },
    // 播报自动向上滚动：用 requestAnimationFrame 按「时间差」推进位移，
    // 与手动滚轮共用同一套 scrollTop，悬停时只是停止推进，滚轮依然可用
    startMarquee() {
      this.stopMarquee();
      const SPEED = 9; // 每秒滚动像素数，想更慢就调小
      let lastTs = 0;

      const step = (ts) => {
        // this.$el 在渲染出错或组件处于异常状态时可能是注释节点，
        // 用 ref 拿到真实根元素，并确认它确实是元素节点
        const root = this.$refs.root;
        if (lastTs && !this.marqueePaused && root) {
          // 按真实帧间隔换算，掉帧时速度也不会变慢
          const dt = Math.min(ts - lastTs, 120) / 1000;
          const move = SPEED * dt;

          root.querySelectorAll(".marquee-track").forEach((track) => {
            // 列表复制了一份，滚到一半即回到开头，实现无缝衔接
            const half = track.scrollHeight / 2;
            if (!half) return;

            // scrollTop 会被浏览器取整（读到的是整数），
            // 每帧只加零点几像素会被完全舍掉、看起来完全不滚；
            // 所以用自定义属性自己维护小数偏移，再赋给 scrollTop
            const offset =
              typeof track._offset === "number"
                ? track._offset
                : track.scrollTop;
            let next = offset + move;
            if (next >= half) next -= half;
            track._offset = next;
            track.scrollTop = next;
          });
        }
        lastTs = ts;
        this.marqueeRAF = requestAnimationFrame(step);
      };
      this.marqueeRAF = requestAnimationFrame(step);
    },
    stopMarquee() {
      if (this.marqueeRAF) {
        cancelAnimationFrame(this.marqueeRAF);
        this.marqueeRAF = null;
      }
    },
    pauseMarquee() {
      this.marqueePaused = true;
    },
    resumeMarquee() {
      this.marqueePaused = false;
    },
    // 窗口尺寸变化时同步缩放所有仪表盘
    handleResize() {
      (this.gasCharts || []).forEach((chart) => {
        try {
          chart.resize();
        } catch (e) {
          /* 实例已销毁，忽略 */
        }
      });
    },
    // 渲染楼层气体仪表盘。
    // 关键：容器上已有实例时只 setOption 更新数据，不再 dispose+init ——
    // 全量重建会让 60 个 canvas 一起重绘，数据刷新时整屏闪烁。
    renderGasGauges(retry = 0) {
      const charts = [];
      let pending = 0;
      let created = false;

      this.cabinList.forEach((cabin) => {
        cabin.gases.forEach((gas) => {
          const el = document.getElementById(`g-${cabin.key}-${gas.key}`);
          if (!el) return;

          // echartsLegacy 在容器未撑开时会写入兜底尺寸（minWidth/minHeight），
          // 容器被撑大后 canvas 与格子比例不一致，圆弧会被压成细条 —— 这里先清掉
          if (el.style.minWidth) el.style.minWidth = "";
          if (el.style.minHeight) el.style.minHeight = "";

          // 复用容器上已有的实例：只更新 option，保留 canvas，不闪
          const exist =
            echarts.getInstanceByDom && echarts.getInstanceByDom(el);
          if (exist && !exist.isDisposed()) {
            exist.setOption(this.buildGaugeOption(gas), true);
            charts.push(exist);
            return;
          }

          const width = el.clientWidth;
          const height = el.clientHeight;
          // 布局还没完成时先跳过，稍后重试
          if (!width || !height) {
            pending += 1;
            return;
          }

          // 显式传宽高，避免 echartsLegacy 走兜底分支污染容器
          const chart = markRaw(echarts.init(el, null, { width, height }));
          chart.setOption(this.buildGaugeOption(gas), true);
          charts.push(chart);
          created = true;
        });
      });

      // 回收本轮不再存在的实例（楼层被移除、容器被重建）
      (this.gasCharts || []).forEach((chart) => {
        if (charts.indexOf(chart) === -1) {
          try {
            chart.dispose();
          } catch (e) {
          /* 实例已销毁，忽略 */
        }
        }
      });

      this.gasCharts = markRaw(charts);

      // 新建过实例时补一次 resize，确保尺寸与实际布局一致
      if (created) {
        this.$nextTick(() => this.handleResize());
      }

      // 仍有容器没撑开时重试（最多 3 次）
      if (pending && retry < 3) {
        setTimeout(() => this.renderGasGauges(retry + 1), 150);
      }
    },
    // 单个气体仪表盘：圆弧按安全区间分段，绿色安全、红色危险
    buildGaugeOption(gas) {
      const cfg = gas.cfg;

      // 后端没返回该气体数据（该位置未装传感器 / 未上报）时，
      // 画一个灰色空表 + 「--」，不要假装是 0
      if (gas.hasValue === false) {
        return {
          backgroundColor: "transparent",
          series: [
            {
              type: "gauge",
              startAngle: 210,
              endAngle: -30,
              min: cfg.min,
              max: cfg.max,
              radius: "94%",
              center: ["50%", "56%"],
              splitNumber: cfg.splitNumber || 3,
              axisLine: {
                lineStyle: {
                  width: 8,
                  color: [[1, "rgba(148,163,184,0.18)"]],
                },
              },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              pointer: { show: false },
              anchor: { show: false },
              progress: { show: false },
              title: { show: false },
              detail: {
                offsetCenter: [0, "56%"],
                formatter: "--",
                fontSize: 14,
                fontWeight: 700,
                color: "#5c6b80",
                fontFamily: '"DIN Alternate", Arial, sans-serif',
              },
              data: [{ value: cfg.min }],
            },
          ],
        };
      }

      const span = cfg.max - cfg.min || 1;
      const safeFrom = Math.max(0, (cfg.safe[0] - cfg.min) / span);
      const safeTo = Math.min(1, (cfg.safe[1] - cfg.min) / span);

      const over = gas.over;
      // 安全段始终实色；危险段正常时半透明压暗，超限时提亮，层次更清楚
      const safeColor = "rgba(16,185,129,0.95)";
      const dangerColor = over
        ? "rgba(239,68,68,0.95)"
        : "rgba(239,68,68,0.32)";

      // 依次压入危险 / 安全 / 危险三段，覆盖整圈圆弧
      const colorStops = [];
      if (safeFrom > 0.001) colorStops.push([safeFrom, dangerColor]);
      colorStops.push([safeTo, safeColor]);
      if (safeTo < 0.999) colorStops.push([1, dangerColor]);

      const valueColor = over ? "#f87171" : "#eaf2ff";
      const glowColor = over
        ? "rgba(239,68,68,0.85)"
        : "rgba(47,123,255,0.7)";
      // 单位简化：%LEL 只显示 LEL，避免圆弧下方文字过长
      const unitText = cfg.unit === "%LEL" ? "LEL" : cfg.unit;

      return {
        backgroundColor: "transparent",
        series: [
          // 单层圆弧：安全区绿色、危险区红色，带刻度数值与指针
          {
            type: "gauge",
            startAngle: 210,
            endAngle: -30,
            min: cfg.min,
            max: cfg.max,
            // 单层圆弧，半径放大到接近占满容器
            radius: "94%",
            center: ["50%", "56%"],
            splitNumber: cfg.splitNumber || 3,
            axisLine: {
              lineStyle: { width: 8, color: colorStops },
            },
            // 小刻度
            axisTick: {
              show: true,
              splitNumber: 2,
              distance: -7,
              length: 3,
              lineStyle: { color: "rgba(148,163,184,0.45)", width: 1 },
            },
            // 主刻度线
            splitLine: {
              show: true,
              distance: -7,
              length: 7,
              lineStyle: { color: "rgba(148,163,184,0.6)", width: 1 },
            },
            // 刻度数值：放在圆弧内侧（distance 为负表示向内）
            axisLabel: {
              show: true,
              distance: -14,
              fontSize: 9,
              color: "#8f9db2",
              formatter: (v) => `${Number(v)}`,
            },
            pointer: {
              show: true,
              // 指针缩短，给下方的数值留出位置，避免压住数字
              length: "46%",
              width: 3.5,
              itemStyle: {
                color: valueColor,
                shadowBlur: over ? 12 : 7,
                shadowColor: glowColor,
              },
            },
            anchor: {
              show: true,
              size: 6,
              showAbove: true,
              itemStyle: {
                color: valueColor,
                borderColor: glowColor,
                borderWidth: 2,
                shadowBlur: over ? 10 : 5,
                shadowColor: glowColor,
              },
            },
            progress: { show: false },
            title: { show: false },
            detail: {
              // 放在圆心下方，指针已缩短，不会遮挡
              offsetCenter: [0, "56%"],
              formatter: (value) =>
                `${Number(value).toFixed(cfg.decimals)}${unitText}`,
              fontSize: 14,
              fontWeight: 700,
              color: valueColor,
              fontFamily: '"DIN Alternate", Arial, sans-serif',
            },
            data: [{ value: gas.value }],
          },
        ],
      };
    },
    // 数据变化后把播报滚回顶部（最新记录在顶部）
    resetMarqueeScroll() {
      const root = this.$refs.root;
      if (!root || typeof root.querySelectorAll !== "function") return;
      root.querySelectorAll(".marquee-track").forEach((track) => {
        track.scrollTop = 0;
        // 同步清掉自维护的小数偏移，否则下一帧会跳回原来的位置
        track._offset = 0;
      });
    },
    // 停留时长：不足 1 小时显示分钟，超过则显示「X小时Y分钟」
    formatDuration(minutes) {
      const total = Number(minutes) || 0;
      const hourText = this.$t("list.hour");
      const minuteText = this.$t("list.minute");
      if (total < 60) return `${total}${minuteText}`;
      const hours = Math.floor(total / 60);
      const rest = total % 60;
      return rest
        ? `${hours}${hourText}${rest}${minuteText}`
        : `${hours}${hourText}`;
    },
    updateTime() {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      this.now = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    // Esc 返回首页
    handleKeydown(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        this.goBack();
      }
    },
    goBack() {
      // 大屏没有侧边栏，统一回首页
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style lang="scss" scoped>
.test-screen {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  /* 顶部留白交给 header 自己控制，sticky 才能贴住顶端 */
  padding: 0 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: auto;
  color: #e2e8f0;
  background:
    radial-gradient(circle at 50% -10%, rgba(47, 123, 255, 0.22) 0%, rgba(11, 18, 32, 0) 55%),
    linear-gradient(180deg, #0d1729 0%, #0a1120 55%, #070c16 100%);
}

/* 全局 * { margin: 0 auto } 会让没有显式宽度的子项按内容宽度居中收缩，
   这里把它们统一拉满并清掉 auto 外边距 */
.test-screen > * {
  box-sizing: border-box;
  width: 100% !important;
  min-width: 0;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/* 注意：grid 的子项不能设 width: 100%，否则会按整行宽度撑开、列与列互相重叠，
   只清掉 auto 外边距，宽度交给 grid 分配 */
.test-screen .ts-kpi > *,
.test-screen .ts-cabins > *,
/* 卡片内部区块同理：气体区、双栏列表不设宽度会被收缩到内容宽并居中，
   这也是之前仪表盘和表格都挤在卡片中间、左右留白的原因 */
.test-screen .cabin-card > * {
  box-sizing: border-box;
  min-width: 0;
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/* 卡片内部再下一层的格子（气体单元、双栏的每一栏）也要清掉 auto 外边距，
   否则会在各自的网格里按内容宽度收缩，表格就撑不满卡片 */
.test-screen .cabin-gas > *,
.test-screen .cabin-cols > * {
  box-sizing: border-box;
  min-width: 0;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/* KPI 卡内的标题行、数值行、细分行同理，否则会各自居中、错位 */
.test-screen .kpi-card > * {
  box-sizing: border-box;
  width: 100% !important;
  min-width: 0;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/* 标题行里的图标和文字也要清掉 auto 外边距，
   否则 flex 下左右 auto 会把图标顶到左边、标题顶到右边，看起来「分开」 */
.test-screen .kpi-head > * {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/* 全局 * { margin: 0 auto } 会给所有元素加左右 auto 外边距：
   flex 里的 b/em 会被推到两端（数值与单位分离），inline-block 标签会被居中。
   这里把页面内的行内元素统一清掉 */
.test-screen b,
.test-screen em,
.test-screen .kpi-label,
.test-screen .kpi-value,
.test-screen .cabin-name,
.test-screen .cabin-people,
.test-screen .status-tag,
.test-screen .action-tag {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 顶部标题栏：sticky 固定在顶部，下面内容滚动时不动 */
.ts-header {
  position: sticky;
  top: 0;
  z-index: 20;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  /* 间距收窄：播报和「返回」按钮贴得更近（标题与播报之间由 margin-left: auto 撑开，不受影响） */
  gap: 6px;
  min-height: 92px;
  padding: 8px 4px 10px;
  border-bottom: 1px solid rgba(47, 123, 255, 0.32);
  background: linear-gradient(180deg, #0d1729 0%, #0b1424 100%);
}
.ts-head-main {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ts-header::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 180px;
  height: 2px;
  background: linear-gradient(90deg, #2f7bff, rgba(47, 123, 255, 0));
}
.ts-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #eaf2ff;
  text-shadow: 0 0 18px rgba(47, 123, 255, 0.55);
}
.ts-time {
  /* 紧跟标题；右侧必须显式归零，否则 * { margin: 0 auto } 会把它居中 */
  margin-left: 14px !important;
  margin-right: 0 !important;
  font-size: 14px;
  font-family: "DIN Alternate", Arial, sans-serif;
  color: #cbd5e1;
  letter-spacing: 1px;
}
.ts-back {
  flex: 0 0 auto;
  /* 推到头部最右侧 */
  margin-left: auto !important;
  margin-right: 0 !important;
  padding: 5px 16px;
  font-size: 13px;
  color: #cbd5e1;
  border: 1px solid rgba(47, 123, 255, 0.45);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.ts-back:hover {
  color: #fff;
  background: rgba(47, 123, 255, 0.22);
}

/* KPI 指标卡 */
.ts-kpi {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  /* 跟着头部一起固定：top 等于 header 实测高度（92 最小高度 + 上下 padding 18 ≈ 96～110）
     这里用 96px 贴合 78px 播报区的实际高度 */
  position: sticky;
  top: 96px;
  z-index: 15;
  /* 吸附后需要不透明背景盖住下方滚动的内容，
     同时用负 margin + padding 把上方 14px 的间隙也一并遮住 */
  padding-top: 14px;
  margin-top: -14px;
  background: linear-gradient(180deg, #0d1729 0%, #0c1526 100%);
}
.kpi-card {
  position: relative;
  display: flex;
  flex-direction: column;
  /* 标题 / 数值 / 细分三段均匀分布，避免内容全堆上半部、下半部留一大块空白 */
  justify-content: space-between;
  padding: 14px 18px 12px;
  border-radius: 10px;
  background: linear-gradient(
    160deg,
    rgba(var(--kpi-rgb), 0.2) 0%,
    rgba(var(--kpi-rgb), 0.04) 100%
  );
  border: 1px solid rgba(var(--kpi-rgb), 0.32);
  /* 不能用 overflow: hidden —— 环形图的悬停提示要溢出卡片；
     圆角靠 border-radius 就够了（内容都是矩形，不会漏边） */
  overflow: visible;
}
/* 悬停时抬高层级，避免浮层被相邻卡片盖住 */
.kpi-card:hover {
  z-index: 5;
}
/* 标题行：图标和标题紧贴在一起 */
.kpi-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
}
.kpi-icon {
  flex: 0 0 auto;
  font-size: 15px;
  line-height: 1;
  color: rgb(var(--kpi-rgb));
}
/* SOS 卡的内联数量：靠标题行最右侧。
   需要比 .kpi-head > * 的 margin 清除规则更高特异性，才能用 auto 推开 */
.test-screen .kpi-head .kpi-inline-value {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  margin: 0 0 0 auto !important;
}
.kpi-inline-value b {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  font-family: "DIN Alternate", Arial, sans-serif;
  color: #fbbf24;
}
.kpi-inline-value em {
  font-size: 11px;
  font-style: normal;
  color: #7f8ea3;
}
.kpi-label {
  margin: 0;
  font-size: 13px;
  color: #9aa8bd;
}
/* 数值行：数值靠左，细分说明贴右侧。
   高度按内容走（不能 flex: 1），否则会被拉伸、数字被推到底部，
   和标题之间出现一大段空白 */
/* 细分说明：横排放在卡片底部，小圆点 + 文字 */
.kpi-subs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  margin: 0;
}
.kpi-sub {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  font-size: 11px;
  color: #9aa8bd;
  white-space: nowrap;
}
.kpi-sub i {
  width: 5px;
  height: 5px;
  margin: 0;
  border-radius: 50%;
}
/* 卡片底部一行说明文字（目前只有 SOS 卡用） */
.kpi-note {
  margin: 6px 0 0 !important;
  font-size: 10px;
  color: #6b7a90;
  text-align: right;
}
.kpi-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: rgb(var(--kpi-rgb));
}
/* 数值 + 右侧环形图 */
.kpi-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: 0 0 auto;
}
.kpi-value {
  margin: 2px 0 0 !important;
  display: flex;
  align-items: baseline;
  gap: 4px;
}
/* 环形占比图：conic-gradient 画环，内圈用卡片同色遮罩成空心 */
.kpi-ring {
  position: relative;
  flex: 0 0 auto;
  width: 54px;
  height: 54px;
  /* 全局 * { margin: 0 auto } 会给它加左右 auto，flex 下会被推到中间；
     这里显式靠右，但不加负边距，保留卡片自身的右内边距作为留白 */
  margin: 0 4px 0 auto !important;
  border-radius: 50%;
  background: conic-gradient(
    rgb(var(--kpi-rgb)) var(--ring-pct, 0%),
    rgba(148, 163, 184, 0.16) 0
  );
  box-shadow: 0 0 12px rgba(var(--kpi-rgb), 0.25);
}
.kpi-ring::after {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: #0e1726;
}
.kpi-ring span {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: "DIN Alternate", Arial, sans-serif;
  color: #eaf2ff;
}
/* 悬停提示：用 ::before + attr(data-tip)，不依赖第三方组件 */
.kpi-ring::before {
  content: attr(data-tip);
  position: absolute;
  /* 环形图贴着卡片右侧，提示框改为右对齐、向左展开，
     否则居中会越过右边界被裁掉一半 */
  right: -4px;
  left: auto;
  bottom: calc(100% + 8px);
  z-index: 6;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(8, 14, 26, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.32);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  color: #e2e8f0;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s;
}
.kpi-ring:hover::before {
  opacity: 1;
}
.kpi-value b {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.1;
  font-family: "DIN Alternate", Arial, sans-serif;
  color: #eaf2ff;
}
.kpi-value em {
  font-size: 12px;
  font-style: normal;
  color: #7f8ea3;
}

/* 船舱卡片网格 */
.ts-cabins {
  flex: 1 1 auto;
  display: grid;
  /* 卡片自适应铺满可用宽度（最小 560px）：
     卡片内部区块已统一 width: 100%，仪表盘用 margin: 0 auto 居中，
     所以拉宽时只会让格子变宽、仪表盘仍在各自格子里居中，不会偏左 */
  grid-template-columns: repeat(auto-fill, minmax(560px, 1fr));
  /* 行高保底：卡片内是仪表盘 + 双栏列表 */
  grid-auto-rows: minmax(470px, auto);
  /* 间距收到 10px：1920 宽下 620×3 + 2×10 正好放进内容区，能排 3 列 */
  gap: 10px;
  align-content: start;
  align-items: stretch;
}
.cabin-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px 10px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(47, 123, 255, 0.22);
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.cabin-card:hover {
  transform: translateY(-2px);
  border-color: rgba(47, 123, 255, 0.55);
}
/* 异常船舱：红色描边 + 顶部光带 */
.cabin-card--danger {
  border-color: rgba(239, 68, 68, 0.5);
  background: linear-gradient(
    180deg,
    rgba(239, 68, 68, 0.14) 0%,
    rgba(15, 23, 42, 0.6) 60%
  );
}
.cabin-card--danger::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #ef4444, rgba(239, 68, 68, 0));
}

/* SOS 告警船舱：整卡红色呼吸闪烁，优先级高于气体异常 */
.cabin-card--sos {
  border-color: rgba(239, 68, 68, 0.85);
  background: linear-gradient(
    180deg,
    rgba(239, 68, 68, 0.2) 0%,
    rgba(15, 23, 42, 0.6) 60%
  );
  animation: sos-card-flash 1.5s ease-in-out infinite;
}
.cabin-card--sos::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #ef4444, rgba(239, 68, 68, 0));
}
@keyframes sos-card-flash {
  0%,
  100% {
    box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.45),
      0 0 14px rgba(239, 68, 68, 0.28);
  }
  50% {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.95),
      0 0 26px rgba(239, 68, 68, 0.65);
  }
}

.cabin-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}
.cabin-name {
  font-size: 15px;
  font-weight: 600;
  color: #eaf2ff;
}
.cabin-people {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  color: #2f7bff;
}
.cabin-people b {
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  font-family: "DIN Alternate", Arial, sans-serif;
}
.cabin-people em {
  font-size: 12px;
  font-style: normal;
  color: #7f8ea3;
}

/* 气体仪表盘：一行四个圆弧表 */
.cabin-gas {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
}
.gas-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 0;
  /* 左右不留内边距：4 × 124 + 3 × 8 = 520，正好放进卡片内容宽 528px，
     留 4px 会让最后一个格子被裁掉 */
  padding: 4px 0 3px;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: border-color 0.2s, background 0.2s;
}
.gas-cell:hover {
  background: rgba(47, 123, 255, 0.1);
  border-color: rgba(47, 123, 255, 0.35);
}
.gas-gauge {
  /* 固定正方形：gauge 以 min(宽,高) 定半径，宽高必须稳定且接近 1:1，
     否则圆弧会被压扁；也不要依赖父级百分比，避免布局未完成时取到 0 */
  flex: 0 0 auto;
  /* 卡片收窄到 560px（内容 528px）后，4 个仪表盘最多 126px */
  width: 124px;
  height: 124px;
  margin: 0 auto;
}
.gas-caption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: 0 !important;
  line-height: 1.25;
}
.gas-name {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #cbd5e1;
}


/* 在舱人员 / 进出舱信息：卡片内左右两栏 */
.cabin-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
}
.cabin-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.col-title {
  margin: 0 0 2px !important;
  font-size: 12px;
  font-weight: 600;
  color: #8f9db2;
}
.col-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  /* 卡片加宽后列表同步放大；人多时仍在列表内部滚动 */
  max-height: 170px;
  overflow-y: auto;
  padding: 0 6px 0 0;
  list-style: none;
}
.col-list::-webkit-scrollbar {
  width: 4px;
}
.col-list::-webkit-scrollbar-track {
  background: transparent;
}
.col-list::-webkit-scrollbar-thumb {
  background: rgba(47, 123, 255, 0.42);
  border-radius: 2px;
}
.col-list::-webkit-scrollbar-thumb:hover {
  background: rgba(47, 123, 255, 0.68);
}
.col-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 5px 8px;
  border-radius: 6px;
  background: rgba(148, 163, 184, 0.06);
  font-size: 13px;
  line-height: 18px;
}
.col-list li:hover {
  background: rgba(47, 123, 255, 0.12);
}
/* 触发 SOS 的在舱人员：整行红底 + 名字标红 + 呼吸 SOS 标签 */
.col-list li.is-sos {
  background: rgba(239, 68, 68, 0.16);
}
.col-list li.is-sos .col-name {
  color: #fca5a5;
}
.sos-flag {
  flex: 0 0 auto;
  margin: 0;
  padding: 0 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  background: rgba(239, 68, 68, 0.9);
  animation: sos-blink 1.6s ease-in-out infinite;
}
.col-name {
  margin: 0;
  color: #cbd5e1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col-extra {
  flex: 0 0 auto;
  margin-left: auto;
  font-family: "DIN Alternate", Arial, sans-serif;
  color: #7f8ea3;
}
/* 进 / 出舱标签 */
.log-tag {
  flex: 0 0 auto;
  margin: 0;
  padding: 0 7px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 18px;
}
.log--in {
  color: #34d399;
  background: rgba(16, 185, 129, 0.16);
}
.log--out {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.16);
}

.cabin-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}
.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.6;
}
.status--normal {
  color: #34d399;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.35);
}
.status--danger {
  color: #f87171;
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.35);
}
/* SOS 告警状态：实心红底 + 发光，和气体异常区分开 */
.status--sos {
  color: #fff;
  background: rgba(239, 68, 68, 0.85);
  border: 1px solid rgba(239, 68, 68, 0.95);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
  animation: sos-blink 1.6s ease-in-out infinite;
}

/* SOS 告警卡内的明细列表 */
.kpi-sos-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 8px 0 0;
  padding: 0 4px 0 0;
  /* 限制高度并允许滚动，告警多了可以滚轮查看；3 行刚好不把卡片撑太高 */
  overflow-y: auto;
  max-height: 70px;
  list-style: none;
}
.kpi-sos-list::-webkit-scrollbar {
  width: 3px;
}
.kpi-sos-list::-webkit-scrollbar-track {
  background: transparent;
}
.kpi-sos-list::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.45);
  border-radius: 2px;
}
.kpi-sos-list::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 158, 11, 0.75);
}
.kpi-sos-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  margin: 0;
  font-size: 12px;
}
.kpi-sos-name {
  margin: 0;
  font-weight: 600;
  color: #eaf2ff;
}
.kpi-sos-time {
  margin: 0;
  font-size: 11px;
  font-family: "DIN Alternate", Arial, sans-serif;
  color: #8f9db2;
}
.sos-tag {
  margin: 0 0 0 auto !important;
  padding: 0 6px;
  border-radius: 8px;
  font-size: 10px;
  line-height: 16px;
  white-space: nowrap;
}
.sos--pending {
  color: #f87171;
  background: rgba(239, 68, 68, 0.18);
  border: 1px solid rgba(239, 68, 68, 0.4);
  animation: sos-blink 1.6s ease-in-out infinite;
}
.sos--done {
  color: #94a3b8;
  background: rgba(148, 163, 184, 0.14);
}
@keyframes sos-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

/* 上下船播报：三列 × 3 行可视，自动向上无缝滚动 */
.ts-marquee {
  position: relative;
  /* 宽度由内容决定：三列刚好包住记录，右侧才不会空出一大截。
     之前用 1fr 三列等分固定宽度，每列比内容宽 80 多 px，
     看起来就和「返回」按钮离得很远（改 gap 也看不出变化） */
  flex: 0 0 auto;
  width: auto;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 18px;
  min-width: 0;
  height: 78px;
  margin-left: auto !important;
  margin-right: 0 !important;
  overflow: hidden;
  /* 上下边缘淡出，滚动更自然 */
  -webkit-mask-image: linear-gradient(
    180deg,
    transparent 0,
    #000 14%,
    #000 86%,
    transparent 100%
  );
  mask-image: linear-gradient(
    180deg,
    transparent 0,
    #000 14%,
    #000 86%,
    transparent 100%
  );
}
.marquee-track {
  margin: 0;
  padding: 0 2px 0 0;
  /* 固定高度 + 原生滚动：自动滚动（JS 累加 scrollTop）与手动滚轮共用同一套状态 */
  height: 78px;
  overflow-y: auto;
  overscroll-behavior: contain;
  list-style: none;
  scrollbar-width: thin;
  scrollbar-color: rgba(47, 123, 255, 0.35) transparent;
}
.marquee-track::-webkit-scrollbar {
  width: 3px;
}
.marquee-track::-webkit-scrollbar-track {
  background: transparent;
}
.marquee-track::-webkit-scrollbar-thumb {
  background: rgba(47, 123, 255, 0.35);
  border-radius: 2px;
}
.marquee-track::-webkit-scrollbar-thumb:hover {
  background: rgba(47, 123, 255, 0.65);
}
.marquee-track li {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 26px;
  margin: 0;
  padding: 0 4px;
  font-size: 12px;
  white-space: nowrap;
}
.mq-time {
  flex: 0 0 auto;
  margin: 0;
  font-family: "DIN Alternate", Arial, sans-serif;
  color: #8f9db2;
}
.mq-name {
  flex: 0 0 auto;
  margin: 0;
  color: #eaf2ff;
  font-weight: 600;
}
/* 列表在数据层复制了一份，向上移动 50% 即可无缝衔接 */
.action-tag {
  display: inline-block;
  min-width: 56px;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.6;
}
.action--on {
  color: #34d399;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.35);
}
.action--off {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.35);
}

/* 窄屏兜底 */
@media (max-width: 1100px) {
  .ts-kpi {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
/* 屏幕比卡片还窄时，卡片改成自适应宽度，避免横向溢出 */
@media (max-width: 700px) {
  .ts-cabins {
    grid-template-columns: minmax(0, 1fr);
  }
  .gas-gauge {
    width: 100%;
    height: 140px;
  }
}
</style>
