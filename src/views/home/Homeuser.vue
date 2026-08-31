<template>
  <div class="main_box">
    <el-container class="asi">
      <el-main>
        <el-row
          :gutter="25"
          class="panel-group"
          style="margin-left: -4px; maring-right: -4px"
        >
          <el-col :xs="8" :sm="8" :lg="5" class="card-panel-col">
            <div class="card-panel">
              <div class="card-body">
                <div class="media">
                  <div class="overflow-hidden media-body">
                    <p class="mb-2 text-truncate font-size-14">
                      {{ $t("homepage.card1") }}
                    </p>
                    <h4 class="mb-0" style="color: #676767">
                      {{ max_num_buildName }}
                    </h4>
                  </div>
                  <div class="text-primary">
                    <div class="card-panel-icon-wrapper icon-message" @click="toggle(1)">
                      <i class="card-panel-icon icon tower"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="py-3 card-body border-top">
                <div class="text-truncate">
                  <span class="badge badge-soft-success font-size-11"
                    ><i class="mdi mdi-menu-up"></i> {{ $t("homepage.livedata") }} </span><span class="ml-2 text-muted"
                    >{{ $t("homepage.people") }}{{ max_num_buildNum }}</span>
                  <span style="float: right"
                    ><a @click="ranking(1)">{{ $t("homepage.Buildingranking") }}</a>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="5" class="card-panel-col">
            <div class="card-panel">
              <div class="card-body">
                <div class="media">
                  <div class="overflow-hidden media-body">
                    <p class="mb-2 text-truncate font-size-14">
                      {{ $t("homepage.card2") }}
                    </p>
                    <h4 class="mb-0" style="color: #676767">
                      {{ max_num_groundName }}
                    </h4>
                  </div>
                  <div class="text-primary">
                    <div class="card-panel-icon-wrapper icon-message" @click="toggle(2)">
                      <i class="card-panel-icon icon tier"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="py-3 card-body border-top">
                <div class="text-truncate">
                  <span class="badge badge-soft-success font-size-11"
                    ><i class="mdi mdi-menu-up"></i>{{ $t("homepage.livedata") }}</span><span class="ml-2 text-muted"
                    >{{ $t("homepage.people") }}{{ max_num_groundNum }}</span>
                  <span style="float: right"
                    ><a @click="ranking(2)">{{ $t("homepage.Floorranking") }}</a>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="5" class="card-panel-col">
            <div class="card-panel">
              <div class="card-body">
                <div class="media">
                  <div class="overflow-hidden media-body">
                    <p class="mb-2 text-truncate font-size-14">
                      {{ $t("homepage.card3") }}
                    </p>
                    <h4 class="mb-0" style="color: #676767">
                      {{ memberMaxStepName }}
                    </h4>
                  </div>
                  <div class="text-primary">
                    <div class="card-panel-icon-wrapper icon-message" @click="toggle(3)">
                      <i class="card-panel-icon el-icon-user peoples"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div class="py-3 card-body border-top">
                <div class="text-truncate">
                  <span class="badge badge-soft-success font-size-11"
                    ><i class="mdi mdi-menu-up"></i>{{ $t("homepage.livedata") }}</span><span class="ml-2 text-muted"
                    >{{ $t("homepage.step") }}{{ memberMaxStepNum }}</span><span style="float: right"
                    ><a @click="ranking(3)">{{ $t("homepage.Stepranking") }}</a>
                  </span>
                </div>
              </div>
            </div>
          </el-col>

          <el-col
            :xs="12"
            :sm="12"
            :lg="8"
            class="card-panel-col"
            style="position: relative; z-index: 100"
          >
            <el-card style="height: 46vh; width: 108%; position: absolute">
              <template #header><div
               
                class="clearfix"
                style="text-align: left; font-weight: 600"
              >
                <span style="cursor: pointer" @click="$router.push('/device/terminal')">{{
                  $t("homepage.equipmentstatus")
                }}</span>
              </div></template>
              <div id="main" style="height: 40vh; width: 100%"></div>
            </el-card>

            <div
              class="count"
              ref="count"
              id="count"
              style="
                height: 15vh;
                width: 108%;
                position: absolute;
                top: 47.5vh;
                box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
              "
            >
              <div
                class="count-item"
                @click="
                  $router.push({
                    path: '/device/terminal',
                  })
                "
                style="cursor: pointer"
              >
                <count-to
                  style="font-size: 30px; font-weight: bold"
                  :start-val="0"
                  :end-val="
                    devTypeNum.dev_online +
                      devTypeNum.dev_offline +
                      devTypeNum.dev_unknown || 0
                  "
                  :duration="1800"
                  class="card-panel-num"
                />

                <p class="mb-0" style="font-size: 14px; font-weight: 600">
                  {{ $t("homepage.Totaldevice") }}
                </p>
              </div>

              <div
                class="count-item"
                style="cursor: pointer"
                @click="
                  $router.push({
                    path: '/device/terminal',
                    query: { hbstatus: 1 },
                  })
                "
              >
                <count-to
                  style="font-size: 30px; font-weight: bold"
                  :start-val="0"
                  :end-val="devTypeNum.dev_online || 0"
                  :duration="1800"
                  class="card-panel-num"
                />
                <p class="mb-0" style="font-size: 14px; font-weight: 600">
                  {{ $t("homepage.onlinedevice") }}
                </p>
              </div>
              <div
                class="count-item"
                style="cursor: pointer"
                @click="
                  $router.push({
                    path: '/device/terminal',
                    query: { hbstatus: 2 },
                  })
                "
              >
                <count-to
                  style="font-size: 30px; font-weight: bold"
                  :start-val="0"
                  :end-val="devTypeNum.dev_offline || 0"
                  :duration="1800"
                  class="card-panel-num"
                />

                <p class="mb-0" style="font-size: 14px; font-weight: 600">
                  {{ $t("homepage.Offlinedevice") }}
                </p>
              </div>

              <div
                class="count-item"
                style="cursor: pointer"
                @click="
                  $router.push({
                    path: '/device/terminal',
                    query: { hbstatus: 3 },
                  })
                "
              >
                <count-to
                  style="font-size: 30px; font-weight: bold"
                  :start-val="0"
                  :end-val="devTypeNum.dev_unknown || 0"
                  :duration="1800"
                  class="card-panel-num"
                />

                <p class="mb-0" style="font-size: 14px; font-weight: 600">
                  {{ $t("homepage.Neveronlinedevice") }}
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="25" style="margin-left: -4px; maring-right: -4px">
          <el-col :xs="24" :sm="24" :lg="15">
            <div class="maps" style="position: relative">
              <MapLayerSwitcher
                :map="map"
                bottom="10px"
                right="10px"
                @change="onMapStyleChange"
              />
              <!-- 放性能监测的容器 -->
              <div
                id="userMap"
                ref="userMap"
                @mousedown="startDrag"
                @mouseup="stopDrag"
              ></div>

              <div class="tips">
                <div class="tips1">
                  <div class="item" style="font-size: 12px">
                    {{ $t("homepage.Indoorpeople") }}
                    <div class="color">
                      {{ member_indoor_num }}
                    </div>
                  </div>
                  <div class="item" style="font-size: 12px">
                    {{ $t("homepage.Indoorassets") }}
                    <div class="color">
                      {{ asset_indoor_num }}
                    </div>
                  </div>
                  <div class="item" style="font-size: 12px">
                    {{ $t("homepage.Indoorvehicle") }}
                    <div class="color">
                      {{ tbox_indoor_num }}
                    </div>
                  </div>
                </div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('homepage.ClickToOutdoor')"
                  placement="left"
                >
                  <div class="tips2">
                    <div
                      class="item"
                      style="font-size: 12px"
                      @click="
                        $router.push({
                          path: '/location/outdoor/locationoutdoor',
                        })
                      "
                    >
                      {{ $t("homepage.Outdoorpeople") }}
                      <div class="color">
                        {{ member_outdoor_num }}
                      </div>
                    </div>
                    <div
                      class="item"
                      style="font-size: 12px"
                      @click="
                        $router.push({
                          path: '/location/outdoor/locationoutdoor',
                        })
                      "
                    >
                      {{ $t("homepage.Outdoorassets") }}
                      <div class="color">
                        {{ asset_outdoor_num }}
                      </div>
                    </div>
                    <div
                      class="item"
                      style="font-size: 12px"
                      @click="
                        $router.push({
                          path: '/location/outdoor/locationoutdoor',
                        })
                      "
                    >
                      {{ $t("homepage.Outdoorvehicle") }}
                      <div class="color">
                        {{ tbox_outdoor_num }}
                      </div>
                    </div>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row
          :gutter="25"
          class="panel-group"
          style="margin-left: -4px; maring-right: -4px"
        >
          <el-col :xs="26" :sm="26" :lg="7" style="height: 40vh">
            <el-card class="box-card soscard" style="width: 100%; height: 100%">
              <template #header><div
               
                class="clearfix"
                style="text-align: left; font-weight: 600"
              >
                <span style="cursor: pointer" @click="$router.push('/warning/index')">
                  {{ $t("homepage.AlertType") }}
                </span>
              </div></template>
              <div id="projectType" style="width: 100%">
                <el-table
                  :key="tableKey"
                  :data="warnNumList"
                  border
                  fit
                  class="table sostable"
                  @cell-click="handdle"
                  :cell-class-name="addClass"
                >
                  <el-table-column
                    property="typestr"
                    :label="$t('homepage.AlertType')"
                    align="center"
                    show-overflow-tooltip
                    min-width="70"
                  >
                  </el-table-column>

                  <el-table-column
                    property="warn_status1_num"
                    :label="$t('homepage.Notlifted')"
                    align="center"
                    show-overflow-tooltip
                    min-width="55"
                  >
                    <template #default="scope">
                      <span v-if="scope.row.warn_status1_num == 0">{{
                        scope.row.warn_status1_num
                      }}</span>
                      <span v-else style="border-bottom: 1px solid">{{
                        scope.row.warn_status1_num
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="warn_status2_num"
                    :label="$t('homepage.Lifted')"
                    align="center"
                    show-overflow-tooltip
                    min-width="50"
                  >
                    <template #default="scope">
                      <span v-if="scope.row.warn_status2_num == 0">{{
                        scope.row.warn_status2_num
                      }}</span>
                      <span v-else style="border-bottom: 1px solid">{{
                        scope.row.warn_status2_num
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('homepage.operate')"
                    min-width="50"
                    align="center"
                  >
                    <template #default="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('homepage.content')"
                        placement="top"
                      >
                        <el-button
                          type="primary"
                          size="small"
                          class="editss"
                          @click.stop="getWarnWeekNumLists(scope.$index)"
                        >
                          {{ $t("homepage.census") }}
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="22" :sm="22" :lg="8" style="height: 40vh" v-show="attenFlag">
            <el-card class="box-card2 home-stat-card" style="width: 100%; height: 100%">
              <template #header>
                <div class="home-card-title">
                  <span
                    style="cursor: pointer"
                    @click="attendance ? $router.push('/staff/checkwork') : ''"
                  >
                    {{ $t("homepage.Attendancestatistics") }}
                  </span>
                </div>
              </template>
              <div class="member">
                <div class="add">
                  <span>{{ $t("homepage.Today") }}</span>
                  <span>{{ $t("homepage.Attendanceattendance") }} </span>
                  <span style="font-size: 18px; font-weight: 600; margin-right: 10px">
                    {{ attendance ? memberNum.member_attendance_num || 0 : 0 }}
                  </span>
                  <span>{{ $t("homepage.Unattendedattendance") }} </span><span style="font-size: 18px; font-weight: 600; margin-right: 10px">
                    {{
                      attendance
                        ? memberNum.member_sum_num - memberNum.member_attendance_num || 0
                        : 0
                    }}</span>
                </div>
                <div id="main6" style="height: 100%; width: 100%"></div>
              </div>
            </el-card>
          </el-col>

          <el-col :xs="22" :sm="22" :lg="8" style="height: 40vh" v-show="!attenFlag">
            <el-card class="box-card2 home-stat-card" style="width: 100%; height: 100%">
              <template #header>
                <div class="home-card-title">
                  <span style="cursor: pointer" @click="$router.push('/device/beacon')">
                    {{ $t("home.BeaconStatus") }}
                  </span>
                </div>
              </template>
              <div class="member">
                <div id="main7" class="home-chart home-chart-fill"></div>
              </div>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="9" style="height: 40vh">
            <el-card class="box-card2 home-stat-card" style="width: 100%; height: 100%">
              <template #header>
                <div class="home-card-title home-card-title-polar">
                  <el-breadcrumb separator="/">
                    <el-breadcrumb-item
                      :to="employee ? { path: '/staff/staffmanagement' } : ''"
                      >{{ $t("homepage.personnel") }}</el-breadcrumb-item>
                    <el-breadcrumb-item
                      :to="asset ? { path: '/staff/assetManagement' } : ''"
                      >{{ $t("homepage.assets") }}</el-breadcrumb-item>
                    <el-breadcrumb-item
                      :to="tbox ? { path: '/staff/tboxManagement' } : ''"
                    >
                      {{ $t("homepage.vehicle") }}
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                  <el-tooltip class="item" effect="light" placement="right-start">
                    <template #content>
                      <div>
                        <p>{{ $t("homepage.content1") }}</p>
                      </div>
                    </template>
                    <i class="el-icon-question home-card-help" />
                  </el-tooltip>
                </div>
              </template>
              <!-- 恢复 Vue2 的 card 走马灯结构，保证三环并排预览 -->
              <div id="main0" class="home-chart-carousel">
                <el-carousel
                  :interval="4000"
                  type="card"
                  height="100%"
                  :autoplay="true"
                  indicator-position="outside"
                  @change="onPolarCarouselChange"
                >
                  <el-carousel-item v-for="item in 3" :key="'polar-' + item">
                    <div :id="'main' + item" class="home-chart-polar"></div>
                    <p class="polar-total">
                      {{ $t("homepage.Total") }}{{ $data[`memberNum${item}`] }}
                    </p>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <!-- 选择项目 -->
    <el-dialog
      :title="$t('navbar.Selectitem')"
      v-if="pro"
      v-model="pro"
      :close-on-press-escape="false"
      :show-close="false"
      :close-on-click-modal="false"
      width="40%"
      style="text-align: center"
      class="select"
    >
      <div class="project-wrapper">
        <div
          class="project-item"
          v-for="(item, index) in projectTable"
          :key="index"
          @click="choseProject(item)"
        >
          <div class="item-header">
            <div class="item-icon"></div>
            {{ item.name }}
          </div>
          <div class="item-info">
            <div class="key">
              <span>{{ $t("navbar.number") }}</span>
              <span>{{ $t("navbar.type") }}</span>
              <span>{{ $t("navbar.remarks") }}</span>
            </div>
            <div class="value">
              <span>{{ item.projectid }}</span>

              <span>{{ i8n == "zh" ? item.typestr : item.entype }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.memo"
                placement="bottom-end"
                ><span>{{ item.memo }}</span></el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('Breadcrumb.AlarmStatistics')"
      v-model="warningWeek"
      @close="closeWarningWeek()"
    >
      <div id="warningweekdatas"></div>
    </el-dialog>

    <!-- 排行 -->
    <el-dialog v-model="rankings" width="30%" class="dialog_box">
      <template #header><div :class="showTitleTips == true ? 'dialog-title' : ''">
        <p class="title-text">{{ rankingName }}</p>
        <el-tooltip
          class="title-tips"
          effect="light"
          placement="right-start"
          v-if="showTitleTips"
        >
          <template #content><div>
            <p>
              {{ $t("homepage.stepTips") }}
            </p>
          </div></template>
          <i class="el-icon-question" />
        </el-tooltip>
      </div></template>
      <el-table :data="rankingData" border>
        <el-table-column :label="$t('homepage.No')" width="60" align="center">
          <template #default="scope">
            <img :src="scope.row.picurl" alt="" srcset="" />
          </template>
        </el-table-column>
        <el-table-column
          property="building"
          v-if="rankingGround || rankingBuild"
          :label="$t('homepage.building')"
          align="center"
          key="1"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          v-if="rankingGround"
          property="ground"
          :label="$t('homepage.floor')"
          align="center"
          key="2"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          v-if="rankingGround"
          property="groundname"
          :label="$t('floormanagement.floorName')"
          align="center"
          key="6"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          v-if="rankingPer"
          property="username"
          :label="$t('homepage.name')"
          align="center"
          key="3"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="num"
          v-if="rankingGround || rankingBuild"
          :label="$t('homepage.numberofpeople')"
          align="center"
          key="4"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="steps"
          v-if="rankingPer"
          :label="$t('homepage.step1')"
          align="center"
          key="5"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </el-dialog>
    <audio :src="audioSrc" controls="controls" loop hidden ref="audio"></audio>
  </div>
</template>

<script>
import host from "../../host";
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import { CountTo } from "vue3-count-to";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import {
  getProjectFirstList,
  getFristPageUserDevUtil,
  getBuildingByProjectid,
  getWarningNum,
  getFristPageUserMapUtil,
  getWarnWeekNumList,
  getDevGpsOne,
  getFenceManageAndPointList,
} from "../../axios/api";
import i18n from "../../i18n/i18n";

//地图
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { createOutdoorBaseLayers } from "../../utils/mapSource";
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlSourceVector from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OlLayerVector from "ol/layer/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import echarts from "../../utils/echartsLegacy";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom"; //鼠标双击放大
import "echarts/theme/macarons.js";
import { fromLonLat } from "ol/proj";
// 描线
import { Stroke, Style } from "ol/style";
import { LineString, Polygon } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";
//地图控件
import ScaleLine from "ol/control/ScaleLine"; //比例尺控件
import MapLayerSwitcher from "../../components/map/MapLayerSwitcher";
import mapStyleMixin from "../../mixins/mapStyleMixin";
import { markRaw } from "vue";

export default {
  mixins: [mapStyleMixin],
  components: {
    Menu,
    basecard,
    CountTo,
    MapLayerSwitcher,
  },
  name: "Home",
  data() {
    return {
      publicPath: process.env.BASE_URL,
      clearAnim: null,

      attenFlag: this.$store.state.functionParts.attenFlag,
      alarmConfig: this.$store.state.functionParts.alarmConfig,
      tboxConfig: this.$store.state.functionParts.tboxConfig,
      employee: this.$store.state.functionParts.employee,
      asset: this.$store.state.functionParts.asset,
      tbox: this.$store.state.functionParts.tbox,
      attendance: this.$store.state.functionParts.attendance,
      task: this.$store.state.functionParts.task,
      inDoor: this.$store.state.functionParts.inDoor,
      outDoor: this.$store.state.functionParts.outDoor,
      camera: this.$store.state.functionParts.camera,
      intoProjectid: this.$store.state.intoProjectid,
      intoProjectFBXUrl: this.$store.state.intoProjectFBXUrl,
      intoProjectType: this.$store.state.intoProjectType,
      tableKey: 1,
      i8n: this.$store.state.i18n,
      outdoorBaseLayers: [],
      beaconData: {},
      attendanceNum: [],
      warnNumList: [],
      devBatTimeNum: {},
      memberMaxStep: [],
      memberMaxStepName: "",
      memberMaxStepNum: "",
      max_num_tranche: "",
      max_num_ground: [],
      max_num_groundName: "",
      max_num_groundNum: "",
      max_num_build: [],
      max_num_buildName: "",
      max_num_buildNum: "",
      memberNum: {},
      memberNum1: 0,
      memberNum2: 0,
      memberNum3: 0,
      member_indoor_num: 0,
      member_outdoor_num: 0,
      tbox_indoor_num: 0,
      tbox_outdoor_num: 0,
      asset_indoor_num: 0,
      asset_outdoor_num: 0,
      warningWeek: false,
      myChartWarning: "",
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      timezone: this.$store.state.intoProjectTimezone,
      projectTable: "",
      pro: false,
      devTypeNum: {},

      // 地图
      map: "",
      seeLayer: "",
      view: "",
      clusterSource: "", //用户地图聚合标注源
      layerVetor: "", //用户地图矢量图层

      mapInfos: "",
      zoom: this.$store.state.mapZoom,
      longi: this.$store.state.longis,
      lati: this.$store.state.latis,
      getMap: true,

      devnumList: {
        blenum: 0,
        gpsnum: 0,
      },
      timer: null,
      timerMap: null,
      myChart1: "",
      myChart2: "",
      myChartBeacon: null,
      polarActive: 1,
      polarTimer: null,
      myChart3: "",
      myChart4: "",
      myChart5: "",

      // 排行相关
      rankingName: "",
      rankingData: [],
      rankings: false,
      showTitleTips: false,
      rankingBuild: false,
      rankingGround: false,
      rankingPer: false,
      mapCenter: [],

      // 音效相关

      audioSrc: "",
      audioTimer: true,

      startX: null, // 记录起始x坐标
      startY: null, // 记录起始y坐标
      currentX: null, // 记录当前x坐标
      currentY: null, // 记录当前y坐标
      distanceX: 0, // 记录移动距离
      distanceY: 0, // 记录移动距离
      notClick: false, //判断是点击还是移动鼠标
      AllFences: [],
      vectorSource: null,
      fences:[]
    };
  },
  created() {
    this.scene = null;
    this.cameras = null;
    this.renderer = null;
    this.textureLoader = null;
    this.groupBox = null;
    this.control = null;
  },

  methods: {
    getChartDom(id) {
      const root = this.$el;
      if (!root) {
        return document.getElementById(id);
      }
      const list = Array.from(root.querySelectorAll("#" + id));
      if (!list.length) {
        return document.getElementById(id);
      }
      // Element Plus card 走马灯会克隆节点，只绑原始项，避免图表画在克隆上后消失
      const scored = list
        .filter((el) => el.isConnected)
        .map((el) => {
          const wrap = el.closest(".el-carousel-item");
          const isClone = !!(wrap && wrap.classList.contains("is-clone"));
          const active = !!(wrap && wrap.classList.contains("is-active"));
          const area = (el.clientWidth || 1) * (el.clientHeight || 1);
          return { el, isClone, active, area };
        })
        .sort((a, b) => {
          if (a.isClone !== b.isClone) return a.isClone ? 1 : -1;
          if (a.active !== b.active) return a.active ? -1 : 1;
          return b.area - a.area;
        });
      return (scored[0] && scored[0].el) || list[0];
    },
    disposeChart(key) {
      if (this[key] && this[key].dispose && !this[key].isDisposed?.()) {
        try {
          this[key].dispose();
        } catch (e) {}
      }
      this[key] = null;
    },
    measureChartBox(el, fallbackH) {
      if (!el) {
        return { width: 360, height: fallbackH || 220 };
      }
      // 抵消全局 * { margin: 0 auto } 把容器挤成内容宽
      el.style.marginLeft = "0";
      el.style.marginRight = "0";
      el.style.margin = "0";
      el.style.width = "100%";

      if (el.id === "main7") {
        const member = el.closest(".member");
        const cardBody = el.closest(".el-card__body");
        const targetH = Math.max(
          (member && member.clientHeight) || 0,
          (cardBody && cardBody.clientHeight - 4) || 0,
          fallbackH || 260
        );
        el.style.height = targetH + "px";
        el.style.minHeight = targetH + "px";
        el.style.flex = "1 1 auto";
        return {
          width: Math.max(el.clientWidth || el.offsetWidth || 0, 280),
          height: targetH,
        };
      }

      const parent = el.closest(".el-carousel-item") || el.parentElement;
      let width = el.clientWidth || el.offsetWidth || 0;
      let height = el.clientHeight || el.offsetHeight || 0;
      if (parent) {
        width = Math.max(width, parent.clientWidth || 0);
        // card 模式下侧卡偏窄，至少给中心卡可用高度
        const parentH = parent.clientHeight || 0;
        height = Math.max(height, parentH > 40 ? parentH - 36 : 0, fallbackH || 200);
      }
      height = Math.max(height, fallbackH || 200);
      width = Math.max(width, 200);
      el.style.height = height + "px";
      el.style.minHeight = height + "px";
      return { width, height };
    },
    ensureChart(id, key, theme) {
      const el = this.getChartDom(id);
      if (!el) {
        return null;
      }
      this.disposeChart(key);
      const exist = echarts.getInstanceByDom && echarts.getInstanceByDom(el);
      if (exist) {
        try {
          exist.dispose();
        } catch (e) {}
      }
      const size = this.measureChartBox(el, id === "main7" ? 280 : 200);
      const instance = echarts.init(el, theme, {
        width: size.width,
        height: size.height,
        renderer: "canvas",
      });
      this[key] = instance ? markRaw(instance) : null;
      return this[key];
    },
    onPolarCarouselChange() {
      this.scheduleHomeChartsResize();
    },
    whenChartDomReady(id, run, tries) {
      const max = tries == null ? 30 : tries;
      const el = this.getChartDom(id);
      if (el) {
        this.measureChartBox(el, id === "main7" ? 280 : 200);
        if (el.clientWidth > 0 && el.clientHeight > 0) {
          run(el);
          return;
        }
      }
      if (max <= 0) {
        if (el) run(el);
        return;
      }
      setTimeout(() => {
        if (!this.$el || (this.$route && this.$route.path === "/largescreen")) {
          return;
        }
        this.whenChartDomReady(id, run, max - 1);
      }, 50);
    },
    polarBarColor() {
      if (echarts.graphic && echarts.graphic.LinearGradient) {
        return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "#518FEF" },
          { offset: 1, color: "#5CBEFF" },
        ]);
      }
      return "#559BF4";
    },
    buildPolarRingOption(percent, title, onlineName, offlineName, offlineNum, onlineNum) {
      let P = Number(percent);
      if (isNaN(P)) P = 0;
      // 对齐大屏已验证可显示的 ECharts5 极坐标写法
      return {
        backgroundColor: "#ffffff",
        title: {
          text: P + "%",
          textStyle: {
            color: "#559BF4",
            fontSize: 22,
          },
          subtext: title,
          subtextStyle: {
            color: "#B1B1B1",
            fontSize: 14,
          },
          itemGap: 12,
          left: "center",
          top: "38%",
        },
        tooltip: {
          formatter: function (params) {
            if (params.seriesName === onlineName || params.name === onlineName) {
              return onlineName + "：" + onlineNum;
            }
            return offlineName + "：" + offlineNum;
          },
        },
        polar: {
          radius: ["62%", "78%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
          clockwise: false,
        },
        radiusAxis: {
          type: "category",
          show: false,
        },
        series: [
          {
            name: onlineName,
            type: "bar",
            data: [{ name: onlineName, value: P }],
            coordinateSystem: "polar",
            roundCap: true,
            barWidth: 16,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220,220,220,1)",
            },
            itemStyle: {
              color: this.polarBarColor(),
            },
            emphasis: {
              disabled: true,
            },
          },
        ],
      };
    },
    scheduleHomeChartsResize() {
      const run = () => {
        const beaconEl = this.getChartDom("main7");
        if (beaconEl && this.myChartBeacon && !this.myChartBeacon.isDisposed?.()) {
          const size = this.measureChartBox(beaconEl, 260);
          try {
            this.myChartBeacon.resize({ width: size.width, height: size.height });
          } catch (e) {}
        }
        [
          this.myChart1,
          this.myChart2,
          this.myChart3,
          this.myChart4,
          this.myChart5,
        ].forEach((chart) => {
          if (chart && chart.resize && !chart.isDisposed?.()) {
            try {
              chart.resize();
            } catch (e) {}
          }
        });
      };
      this.$nextTick(run);
      clearTimeout(this._chartResizeTimer1);
      clearTimeout(this._chartResizeTimer2);
      this._chartResizeTimer1 = setTimeout(run, 80);
      this._chartResizeTimer2 = setTimeout(run, 320);
    },
    renderBeaconAndDeviceCharts(beaconBatTimeNum) {
      try {
        this.myEcharts1();
      } catch (e) {
        console.warn(e);
      }
      const paintBeacon = () => {
        try {
          this.beaconData = beaconBatTimeNum || {
            beacon_low_3day: 0,
            beacon_more_3day: 0,
            beacon_time_unknown: 0,
            bat_60_100: 0,
            bat_20_60: 0,
            bat_0_20: 0,
          };
          this.myEchartsBeacon();
          this.scheduleHomeChartsResize();
        } catch (e) {
          console.warn(e);
        }
      };
      // 立即画一次，再等布局稳定后重画，避免从大屏返回时容器尚未撑开
      paintBeacon();
      this.whenChartDomReady("main7", paintBeacon);
      setTimeout(paintBeacon, 300);
    },
    renderPolarCharts() {
      const paint = () => {
        try {
          this.myEcharts3();
          this.myEcharts4();
          this.myEcharts5();
          this.scheduleHomeChartsResize();
        } catch (e) {
          console.warn(e);
        }
      };
      paint();
      this.$nextTick(paint);
      setTimeout(paint, 300);
    },
    initThree() {
      // 场景
      this.scene = markRaw(new THREE.Scene());
      // 1.2 相机
      this.cameras = markRaw(
        new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
        )
      );
      // 设置摄像机位置
      this.cameras.position.set(30, 50, 70);
      // 指向场景中心
      this.cameras.lookAt(this.scene.position);
      // 1.3 渲染器
      this.renderer = markRaw(
        new THREE.WebGLRenderer({
        antialias: true,
        // alpha: true,
        })
      );

      this.renderer.outputEncoding = THREE.sRGBEncoding;

      // 创建纹理加载器
      this.textureLoader = markRaw(new THREE.TextureLoader());
      // 创建一个组合对象
      // this.groupBox = new THREE.Group();
      // let axes = new THREE.AxesHelper(100);
      // this.scene.add(axes);
      // 设置环境
      this.renderer.setClearColor(new THREE.Color("#f1f5f7"));
      // 设置场景大小
      this.renderer.setSize(
        $("#userMap")[0].getBoundingClientRect().width,
        $("#userMap")[0].getBoundingClientRect().height
      );
      // 渲染器开启阴影效果
      this.renderer.shadowMap.enabled = true;
      // 环境光
      let ambient = new THREE.AmbientLight(0x1c1c1c);
      this.scene.add(ambient);
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(1000, 1000, 1000); // 点光源位置
      this.scene.add(point); // 点光源添加到场景中

      // 渲染div到canvas
      $("#userMap")[0].appendChild(this.renderer.domElement);

      //创建相机控件
      this.control = markRaw(
        new OrbitControls(this.cameras, this.renderer.domElement)
      );
      this.control.enableDamping = true;
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
      // this.control.dampingFactor = 0.5;
      // 是否可以缩放
      this.control.enableZoom = true;
      // 是否自动旋转
      this.control.autoRotate = false;
      // 设置相机距离原点的最近距离
      this.control.minDistance = 20;
      // 设置相机距离原点的最远距离
      this.control.maxDistance = 1000;
      // 是否开启右键拖拽
      this.control.enablePan = true;
      // // 上下翻转的最大角度
      // this.control.maxPolarAngle = 1.5;
      // // 上下翻转的最小角度
      // this.control.minPolarAngle = 0.0;
      // 是否可以旋转
      this.enableRotate = true;
      this.loadFbxModel(); // 加载 FBX 模型
      // 最后进行渲染
      this.render();
    },
    render() {
      let animate = () => {
        if (this.control) {
          //循环调用函数
          this.clearAnim = requestAnimationFrame(animate);
          //更新相机控件
          this.control.update();
          // 更新性能插件
          //渲染界面
          this.renderer.render(this.scene, this.cameras);
        } else {
          return;
        }
      };
      animate();
      //  为模型绑定点击事件
      this.renderer.domElement.addEventListener("click", this.modelMouseClick, false);
    },
    //  加载 FBX 模型
    loadFbxModel() {
      var loader = new FBXLoader();
      loader.load(host.host + "model/" + this.intoProjectFBXUrl, (object) => {
        this.scene.add(markRaw(object)); //模型
      });
    },
    startDrag(event) {
      this.notClick = false;
      this.startX = event.clientX; // 获取起始x坐标
      this.startY = event.clientY; // 获取起始y坐标
      window.addEventListener("mousemove", this.handleMouseMove);
    },

    stopDrag() {
      window.removeEventListener("mousemove", this.handleMouseMove);
    },

    handleMouseMove(event) {
      if (this.startX !== null) {
        const deltaX = event.clientX - this.startX; // 计算水平移动距离
        const deltaY = event.clientY - this.startY; // 计算垂直移动距离
        this.currentX += deltaX; // 更新当前x坐标
        this.currentY += deltaY; // 更新当前x坐标

        this.distanceX = Math.abs(deltaX).toFixed(); // 将移动距离保留为正值（向右移动）或负值（向左移动）
        this.distanceY = Math.abs(deltaY).toFixed(); // 将移动距离保留为正值（向右移动）或负值（向左移动）

        if (this.distanceX > 0 || this.distanceY > 0) {
          this.notClick = true;
          window.removeEventListener("mousemove", this.handleMouseMove);
          return;
        }
      }
    },
    // 模型的点击事件
    modelMouseClick(event) {
      if (this.notClick === false) {
        event.preventDefault();
        var mainCanvas = document.getElementById("userMap");
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

        mouse.x =
          ((event.clientX - mainCanvas.getBoundingClientRect().left) /
            mainCanvas.offsetWidth) *
            2 -
          1;
        mouse.y =
          -(
            (event.clientY - mainCanvas.getBoundingClientRect().top) /
            mainCanvas.offsetHeight
          ) *
            2 +
          1;

        raycaster.setFromCamera(mouse, this.cameras);
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        // 根据它来判断点击的什么，length为0即没有点击到模型
        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
          //通过点击到该模型用名字匹配
          if (clickedObject.name !== "Plane001" && clickedObject.name !== "Plane002") {
            this.$router.push({
              path: "/location/indoor/locationindoor",
            });
          }
        }
      }
    },
    toggle(type) {
      var that = this;
      if (type == 1) {
        if (that.max_num_build.length > 0) {
          if (!that.max_num_build[0].buildid) return;

          that.$router.push({
            path: "/location/indoor/locationindoor",
            query: {
              id: that.max_num_build[0].buildid,
            },
          });
        }
      } else if (type == 2) {
        if (that.max_num_ground.length > 0) {
          if (!that.max_num_ground[0].groundid) return;

          that.$router.push({
            path: "/location/indoor/locationindoor",
            query: {
              id: that.max_num_ground[0].buildid,
              homeground: that.max_num_ground[0].ground,
            },
          });
        }
      } else if (type == 3) {
        if (that.memberMaxStep.length > 0) {
          if (!that.memberMaxStep[0].steps) return;
          let data = {
            deveui: that.memberMaxStep[0].maplabel,
            projectid: that.intoProjectid,
            devtype: that.intoProjectType,
          };
          getDevGpsOne(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
            (res) => {
              if (res.code == 1001) {
                if (
                  res.data.gpstime == null ||
                  res.data.gpstime == "" ||
                  res.data.gpstime == 0
                ) {
                  that.$message({
                    message: i18n.global.t("LocationIndoor.tet3"),
                    type: "warning",
                  });
                } else {
                  if (res.data.postype == 1) {
                    that.$router.push({
                      path: "/location/indoor/locationindoor",
                      query: {
                        deveui: that.memberMaxStep[0].maplabel,
                      },
                    });
                  } else {
                    that.$router.push({
                      path: "/location/outdoor/locationoutdoor",
                      query: { deveui: res.data.deveui },
                    });
                  }
                }
              }
            }
          );
        }
      }
    },
    // 排行
    ranking(type) {
      var that = this;
      switch (type) {
        case 1:
          that.rankingName = i18n.global.t("homepage.Buildingranking1");
          that.rankingData = that.max_num_build;
          that.rankingBuild = true;
          that.rankingGround = false;
          that.rankingPer = false;
          that.rankings = true;
          that.showTitleTips = false;
          break;
        case 2:
          that.rankingName = i18n.global.t("homepage.Floorranking1");
          that.rankingData = that.max_num_ground;
          that.rankingBuild = false;
          that.rankingGround = true;
          that.rankingPer = false;
          that.rankings = true;
          that.showTitleTips = false;
          break;
        case 3:
          that.rankingName = i18n.global.t("homepage.Stepranking1");
          that.rankingData = that.memberMaxStep;
          that.rankingBuild = false;
          that.rankingGround = false;
          that.rankingPer = true;
          that.rankings = true;
          that.showTitleTips = true;
          break;
        default:
          break;
      }
      for (let i = 0; i < that.rankingData.length; i++) {
        switch (i) {
          case 0:
            // 说明：示例图片地址改为从环境变量读取基础地址
            that.rankingData[i].picurl =
              process.env.VUE_APP_ASSET_BASE + "/image/rank/1.png";
            break;
          case 1:
            that.rankingData[i].picurl =
              process.env.VUE_APP_ASSET_BASE + "/image/rank/2.png";
            break;
          case 2:
            that.rankingData[i].picurl =
              process.env.VUE_APP_ASSET_BASE + "/image/rank/3.png";
            break;
          default:
            that.rankingData[i].picurl =
              process.env.VUE_APP_ASSET_BASE + "/image/rank/badge.svg";
            break;
        }
      }
    },
    addClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        if (row.warn_status1_num != 0) {
          return "cell-point";
        }
      }
      if (columnIndex == 2) {
        if (row.warn_status2_num != 0) {
          return "cell-point";
        }
      }
    },
    // 统计七天内某种类型的告警的每一天数据
    getWarnWeekNumLists(index) {
      var that = this;
      if (
        that.warnNumList[index].warn_status1_num == 0 &&
        that.warnNumList[index].warn_status2_num == 0
      ) {
        that.$message({
          message: i18n.global.t("homepage.noData"),
          type: "error",
        });
        return;
      }
      let date = new Date();
      let y = date.getUTCFullYear();
      let m = date.getUTCMonth();
      let d = date.getUTCDate();
      let utc = Date.UTC(y, m, d - 7, 0, 0, 0);
      let data = {
        superid: this.$store.state.userInfo.superid,
        projectid: this.$store.state.projectid,
        type: "",
        time: utc / 1000,
        timezone: this.timezone,
      };
      switch (this.warnNumList[index].typestr) {
        case i18n.global.t("homepage.SOSalert"):
          data.type = 1;
          break;
        case i18n.global.t("homepage.gatherwarn"):
          data.type = 2;
          break;
        case i18n.global.t("homepage.crosswarn"):
          data.type = 3;
          break;
        case i18n.global.t("homepage.strandedwarn"):
          data.type = 4;
          break;
        case i18n.global.t("homepage.Unusuallystill"):
          data.type = 5;
          break;
        case i18n.global.t("warning.Tilt"):
          data.type = 6;
          break;
        case i18n.global.t("warning.Dumpalarm"):
          data.type = 7;
          break;
        case i18n.global.t("warning.Firealarm"):
          data.type = 8;
          break;
        default:
          break;
      }
      getWarnWeekNumList(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            if (res.data.length == 0) {
              that.$message({
                message: i18n.global.t("buildingmanagement.nodata"),
                type: "warning",
              });
              return;
            }
            that.warningWeek = true;
            let warningName = "";
            let warningDate = [];
            let warningData1 = [];
            let warningData2 = [];
            let count = 0;

            warningName = this.i8n == "zh" ? res.data[0].typestr : res.data[0].entype;
            res.data.forEach((item) => {
              count++;
              warningDate.push(item.date);
              warningData1.push(item.warn_status1_num);
              warningData2.push(item.warn_status2_num);
              if (count == res.data.length) {
                setTimeout(() => {
                  that.echartsWarningWeek(
                    warningName,
                    warningDate,
                    warningData1,
                    warningData2
                  );
                }, 100);
              }
            });
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    // 绘制一周内每天的告警信息柱状图
    echartsWarningWeek(warningName, warningDate, warningData1, warningData2) {
      var that = this;
      var chartDom = document.getElementById("warningweekdatas");
      this.myChartWarning = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: warningName,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        color: ["#52ca52", "#d72a14"],
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },

        xAxis: {
          type: "category",
          data: warningDate.reverse(),
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          boundaryGap: [0, 0.01],
        },
        series: [
          {
            message: i18n.global.t("homepage.Lifted"),
            type: "bar",
            data: warningData2.reverse(),
          },
          {
            message: i18n.global.t("homepage.Notlifted"),
            type: "bar",
            data: warningData1.reverse(),
          },
        ],
      };

      option && this.myChartWarning.setOption(option);
    },
    closeWarningWeek() {
      echarts.init(document.getElementById("warningweekdatas")).dispose(); //销毁
    },
    // 跳转到告警信息页面
    handdle(row, column, cell, event) {
      let statustype, type;
      if (column.label == i18n.global.t("homepage.Lifted")) {
        if (row.warn_status2_num == 0) return;
        statustype = 2;
      } else if (column.label == i18n.global.t("homepage.Notlifted")) {
        if (row.warn_status1_num == 0) return;
        statustype = 1;
      } else {
        return;
      }
      switch (row.typestr) {
        case i18n.global.t("homepage.SOSalert"):
          type = 1;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("homepage.gatherwarn"):
          type = 2;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("homepage.crosswarn"):
          type = 3;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("homepage.strandedwarn"):
          type = 4;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("homepage.Unusuallystill"):
          type = 5;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("warning.Tilt"):
          type = 6;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("warning.Dumpalarm"):
          type = 7;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("warning.Firealarm"):
          type = 8;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
        case i18n.global.t("homepage.closecontact"):
          type = 9;
          this.$router.push({
            path: "/warning/index",
            query: {
              warningtype: type,
              statustype: statustype,
            },
          });
          break;
      }
    },

    choseProject(row) {
      var that = this;
      this.pro = false;
      that.attenFlag = row.projectConfig.attenFlag;
      that.alarmConfig = row.projectConfig.alarmConfig;
      that.tboxConfig = row.projectConfig.tboxConfig;
      that.employee = row.projectConfig.employee;
      that.asset = row.projectConfig.asset;
      that.tbox = row.projectConfig.tbox;
      that.attendance = row.projectConfig.attendance;
      that.task = row.projectConfig.task;
      that.inDoor = row.projectConfig.inDoor;
      that.outDoor = row.projectConfig.outDoor;
      that.camera = row.projectConfig.camera;
      let data1 = {
        attenFlag: row.projectConfig.attenFlag,
        alarmConfig: row.projectConfig.alarmConfig,
        tboxConfig: row.projectConfig.tboxConfig,
        employee: row.projectConfig.employee,
        asset: row.projectConfig.asset,
        tbox: row.projectConfig.tbox,
        attendance: row.projectConfig.attendance,
        task: row.projectConfig.task,
        inDoor: row.projectConfig.inDoor,
        outDoor: row.projectConfig.outDoor,
        assetgw: row.projectConfig.assetgw,
        aoagw: row.projectConfig.aoagw,
        smoke: row.projectConfig.smoke,
        alertor: row.projectConfig.alertor,
        blesensor: row.projectConfig.blesensor,
        camera: row.projectConfig.camera,
        devgw: row.projectConfig.devgw,
        scanbeacon: row.projectConfig.scanbeacon,
      };
      that.$store.commit("changefunctionParts", data1);

      that.getFristPages(row.projectid);
      this.timer = setInterval(() => {
        that.getFristPages(that.$store.state.projectid);
      }, 30000);
      this.$store.commit("changeProjectid", row.projectid);
      this.$store.commit("selectProjectid", row.projectid);
      this.$store.commit("selectProjectFBXUrl", row.filename);
      this.$store.commit("selectProjectKey", row.setkey);
      this.$store.commit("selectProjectFlag", row.flag);
      this.$store.commit("selectProjectName", row.name);
      this.$store.commit("selectProjectTimezone", row.timezone);
      this.$store.commit("selectProjectSuperid", row.superid);
      this.$store.commit("selectProjectTenantid", row.tenantid);
      this.$store.commit("changeMapZoom", row.zoom);
      this.$store.commit("changeMapLongi", row.longi);
      this.$store.commit("changeMapLati", row.lati);
      this.$store.commit("selectProjectType", row.type);
      this.$store.commit("selectProjectprojectType", row.projectype);
      that.intoProjectid = row.projectid;
      that.intoProjectFBXUrl = row.filename;
      that.intoProjectType = row.type;
      this.timezone = row.timezone;
      this.zoom = row.zoom;
      this.longi = row.longi;
      this.lati = row.lati;
      const lang = (
        this.$store.state.i18n ||
        (i18n.global && i18n.global.locale) ||
        ""
      )
        .toString()
        .toLowerCase();
      if (lang.indexOf("zh") === 0) {
        this.$router.push("/largescreen").catch(() => {});
      }
      //获取告警信息
      let data = {
        superid: this.$store.state.userInfo.superid,
        projectid: row.projectid,
        status: 1,
        endtype: 8,
      };
      var that = this;
      getWarningNum(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$store.commit("setWarningNum", res.data.size);
            let sosNums = that.$store.state.sosNums;
            const audio = that.$refs.audio;
            if (sosNums == 0 || sosNums == "") {
              if (res.data.warning) {
                if (res.data.warning.id != that.$store.state.warningInfo.id) {
                  if (audio) {
                    audio.pause();
                  }
                  clearInterval(that.audioTimer);
                  that.audioTimer = null;
                  that.$store.commit("setWarningInfo", res.data.warning);
                  if (audio) {
                    audio.src =
                      "../../../static/video/" + res.data.warning.voice + ".mp3";
                    audio.currentTime = 0;
                    audio.play();
                  }
                  if (res.data.warning.vtime > 0) {
                    setTimeout(() => {
                      audio && audio.pause();
                    }, res.data.warning.vtime * 1000);
                    if (res.data.warning.vcycle > 0) {
                      that.audioTimer = setInterval(() => {
                        audio && audio.play();
                        setTimeout(() => {
                          audio && audio.pause();
                        }, res.data.warning.vtime * 1000);
                      }, res.data.warning.vcycle * 1000);
                    }
                  } else {
                    audio && audio.pause();
                    clearInterval(that.audioTimer);
                    that.audioTimer = null;
                  }
                }
              }
            } else {
              audio && audio.pause();
              clearInterval(that.audioTimer);
              that.audioTimer = null;
            }
          }
        }
      );
    },

    //获取楼栋信息
    getBuildingByProjectids(val) {
      if (this.map) {
        this.map.setTarget("masssss");
      }
      var that = this;
      let data = {
        projectid: val,
      };
      getBuildingByProjectid(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.mapInfos = res.data;
            if (that.scene) {
              var element = document.getElementById("userMap");
              while (element.firstChild) {
                element.removeChild(element.firstChild);
              }
              cancelAnimationFrame(that.clearAnim); // 清除requestAnimationFrame
              that.scene.clear();
              that.scene.traverse((child) => {
                if (child.material) {
                  child.material.dispose();
                }
                if (child.geometry) {
                  child.geometry.dispose();
                }
                child = null;
              });
              that.scene = null; // 场景
              that.cameras = null; // 照相机
              that.renderer = null; // 渲染器
              that.textureLoader = null; // 纹理加载器
              that.groupBox = null;
              that.control = null; // 相机控件
              that.publicPath = process.env.BASE_URL;
            }
            if (that.map) {
              that.map.setTarget("sss");
              that.map = null;
            }
            if (that.intoProjectFBXUrl) {
              that.initThree();
            } else {
              that.initUserMap();
            }
          }
        }
      );
    },
    //定时请求楼栋数据
    getBuildingByProjectids2(val) {
      var that = this;
      let data = {
        projectid: val,
      };
      getBuildingByProjectid(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.mapInfos = res.data;
            if (this.clusterSource) {
              // 首页楼栋下信息更新
              this.clusterSource.forEachFeature(function (e) {
                for (let i = 0; i < that.mapInfos.length; i++) {
                  if (e.values_.id == that.mapInfos[i].id) {
                    e.values_.longi = that.mapInfos[i].longi;
                    e.values_.lati = that.mapInfos[i].lati;
                    e.values_.src = that.mapInfos[i].src;
                    e.values_.projectid = that.mapInfos[i].projectid;
                    e.values_.building = that.mapInfos[i].building;
                    e.values_.devnum = that.mapInfos[i].devnum;
                    e.values_.assetnum = that.mapInfos[i].assetnum;
                    e.values_.tboxnum = that.mapInfos[i].tboxnum;
                    let coordinates = fromLonLat([
                      that.mapInfos[i].longi,
                      that.mapInfos[i].lati,
                    ]);
                    e.values_geometry = new OlGeomPoint(coordinates);
                  }
                }
                e.setStyle(() => {
                  new OlStyleStyle({
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text:
                        e.values_.building +
                        "/" +
                        e.values_.devnum +
                        "人" + // 添加文字描述
                        e.values_.assetnum +
                        "设备", // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      backgroundFill: new Fill({
                        color: "rgba(256,256,256,1)",
                      }),
                      fill: new Fill({
                        color: that.getBuildingLabelColor(
                          e.values_.devnum,
                          e.values_.assetnum
                        ),
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  });
                });
              });
            }
            // that.setClusterCus(that.map, that.mapInfos);
          }
        }
      );
    },

    //用户进入首页获取项目列表
    getProjectFirstLists() {
      this.pro = false;
      var that = this;
      let data = {
        tenantid: this.$store.state.userInfo.tenantid,
      };
      getProjectFirstList(data, this.tenantkey_A, this.tenantid_A, this.username).then(
        (res) => {
          if (res.code == 1001) {
            this.projectTable = res.data;
            if (this.projectTable.length === 1) {
              this.choseProject(this.projectTable[0]);
            }
            if (this.projectTable.length > 1) {
              this.$store.commit("setProjectNum", this.projectTable.length);
              setTimeout(() => {
                that.pro = true;
              }, 200);
            }
          }
        }
      );
    },

    //初始化用户首页地图

    initUserMap() {
      var that = this;

      that.vectorSource = new VectorSource();
      // this.seeLayer = new TileLayer({
      //   className: "baseLayerClass",
      //   source: this.openlayersSource,
      // });

      that.seeLayer = [
        ...that.outdoorBaseLayers,
        new VectorLayer({
          source: that.vectorSource,
        }),
      ];

      if (that.mapInfos.length > 0) {
        that.view = new View({
          center: fromLonLat([that.longi, that.lati]),
          zoom: that.$store.state.mapZoom,
        });
      } else {
        that.view = new View({
          center: fromLonLat(that.mapCenter),
          zoom: 5,
        });
      }
      setTimeout(() => {
        const origGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, options) {
          if (type === "2d") {
            options = Object.assign({}, options || {}, { willReadFrequently: true });
          }
          return origGetContext.call(this, type, options);
        };
        try {
          that.map = new Map({
            target: "userMap",
            layers: that.seeLayer,
            view: that.view,
          });
        } finally {
          HTMLCanvasElement.prototype.getContext = origGetContext;
        }

        this.map.addControl(new ScaleLine()); //缩放比例控件
        if (this.mapInfos.length > 0) {
          //聚合
          this.setClusterCus(that.map, this.mapInfos);
        }

        this.addLine(this.map);
        this.userMapMouse(this.map);
        this.userMapdbclick();
        // that.showAllFence().then(() => {
        //   that.recreateFences();
        // });
        const dblClickInteraction = this.map
          .getInteractions()
          .getArray()
          .find((interaction) => {
            return interaction instanceof DoubleClickZoom;
          });
        this.map.removeInteraction(dblClickInteraction);
      }, 0);
    },
    recreateFences() {
      // this.vectorSource.clear();
      this.AllFences.forEach((fenceData) => {
        const gpsCoords = fenceData.coordinates;
        const color = fenceData.color;
        const mercatorCoords = gpsCoords.map((coord) => fromLonLat(coord));
        const polygon = new Polygon([mercatorCoords]);
        const fenceFeature = new Feature({
          geometry: polygon,
          type: "fence",
        });
        const numberFeature = new Feature({
          geometry: polygon.getInteriorPoint(),
          number: fenceData.num,
          type: "number",
        });
        // // 设置样式
        fenceFeature.setStyle(
          new Style({
            fill: new Fill({
              color: this.hexToRgba(color, 0.5), // 使用当前选择的颜色
            }),
            stroke: new Stroke({
              color: color,
              width: 2,
            }),
          })
        );
        // 设置数字样式
        numberFeature.setStyle(
          new Style({
            text: new Text({
              text: String(fenceData.num) + i18n.global.t("warning.people"),
              font: "24px Calibri,sans-serif",
              fill: new Fill({ color: "black" }),
              stroke: new Stroke({
                color: "white",
                width: 2,
              }),
            }),
          })
        );
        // this.vectorSource.addFeature(feature);
        this.vectorSource.addFeature(fenceFeature);
        this.vectorSource.addFeature(numberFeature);
        this.fences.push({ fenceFeature, numberFeature });
      });
    },
    updateNumber(fenceIndex, newNumber) {
      if (!this.fences || !this.fences[fenceIndex]) return;
      if (newNumber === null || newNumber === undefined) {
        newNumber = 0; // 设置默认值为空字符串或其他默认值
      }
      const { numberFeature } = this.fences[fenceIndex];
      numberFeature.set("number", newNumber);

      // 确保 setText 方法接收到的是字符串
      numberFeature
        .getStyle()
        .getText()
        .setText(String(newNumber) + i18n.global.t("warning.people"));

      this.vectorSource.changed(); // 通知源更新
    },
    // 将16进制颜色和透明度转换为rgba格式
    hexToRgba(hex, opacity) {
      const rgb = parseInt(hex.slice(1), 16); // 转换为 RGB 整数
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    // 显示围栏
    showAllFence() {
      var that = this;
      return new Promise((resolve) => {
        let data = {
          projectid: this.$store.state.projectid,
        };
        getFenceManageAndPointList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            let editFencess = [];
            res.data.forEach((item) => {
              let editFences = [];
              item.list.forEach((items) => {
                editFences.push([items.pointX, items.pointY]);
              });

              editFencess.push({
                coordinates: editFences,
                color: item.colour,
                id: item.id,
                num: item.num,
              });
            });
            that.AllFences = editFencess;
          }
          resolve();
        });
      });
    },
    //用户界面设置聚合
    setClusterCus(map, mapInfo) {
      var that = this;
      //创建要素数量
      var clusterFeatures = [];
      for (let i = 0; i < mapInfo.length; i++) {
        let coordinates = fromLonLat([mapInfo[i].longi, mapInfo[i].lati]);
        //新建点要素
        clusterFeatures[i] = new OlFeature({
          longi: mapInfo[i].longi,
          lati: mapInfo[i].lati,
          src: mapInfo[i].src,
          projectid: mapInfo[i].projectid,
          building: mapInfo[i].building,
          id: mapInfo[i].id,
          devnum: mapInfo[i].devnum,
          assetnum: mapInfo[i].assetnum,
          tboxnum: mapInfo[i].tboxnum,
          geometry: new OlGeomPoint(coordinates),
        });
      }
      //初始化矢量数据源
      this.clusterSource = new OlSourceVector({
        features: clusterFeatures,
      });

      //初始化聚合标注数据源
      var clusterSources = new Cluster({
        distance: 60, //两个图标之间距离小于此值，就会聚合
        source: that.clusterSource,
      });

      //加载聚合标注的矢量图层
      var styleCache = {};
      this.layerVetor = new OlLayerVector({
        source: clusterSources,
        style: function (feature) {
          var size = feature.get("features").length;
          var style = styleCache[size];
          if (size > 1) {
            //聚合时的样式
            style = [
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: "../../../static/cluster.png",
                  scale: 1,
                }),
                text: new Text({
                  text: size.toString(),
                  font: "18px font-size", // 设置字体大小
                  fill: new Fill({
                    color: "#fff",
                  }),

                  offsetY: -22, // 设置文字偏移量
                }),
              }),
            ];
            styleCache[size] = style;
          } else {
            let devnum = feature.values_.features[0].values_.devnum
              ? feature.values_.features[0].values_.devnum + i18n.global.t("homepage.P")
              : "";
            let assetnum = feature.values_.features[0].values_.assetnum
              ? feature.values_.features[0].values_.assetnum + i18n.global.t("homepage.A")
              : "";
            let tboxnum = feature.values_.features[0].values_.tboxnum
              ? feature.values_.features[0].values_.tboxnum + i18n.global.t("homepage.C")
              : "";
            let text;
            if (devnum == "" && assetnum == "" && tboxnum == "") {
              text = feature.values_.features[0].values_.building;
            } else {
              if (devnum && assetnum) {
                devnum = devnum + ",";
              }
              if (assetnum && tboxnum) {
                assetnum = assetnum + ",";
              }
              text =
                feature.values_.features[0].values_.building +
                "/" +
                devnum +
                assetnum +
                tboxnum;
            }
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: feature.values_.features[0].values_.src,
                scale: 1,
              }),
              // 设置图片下面显示字体的样式和内容
              text: new Text({
                text: text,
                font: "12px font-size", // 设置字体大小
                fill: new Fill({
                  color: that.getBuildingLabelColor(
                    feature.values_.features[0].values_.devnum,
                    feature.values_.features[0].values_.assetnum,
                    feature.values_.features[0].values_.tboxnum
                  ),
                  backgroundColor: "white",
                }),

                offsetY: 10, // 设置文字偏移量
              }),
            });
          }
          return style;
        },
      });

      map.addLayer(this.layerVetor);
    },

    myEcharts3() {
      var that = this;
      this.myChart3 = this.ensureChart("main1", "myChart3");
      if (!this.myChart3) return;
      this.memberNum.member_online_num = this.employee
        ? this.memberNum.member_online_num
        : 0;
      this.memberNum.member_sum_num = this.employee ? this.memberNum.member_sum_num : 0;
      let P = (
        (this.memberNum.member_online_num / this.memberNum.member_sum_num) *
        100
      ).toFixed(2);
      if (isNaN(P)) {
        P = "0";
      }
      var offLineNum = this.memberNum.member_sum_num - this.memberNum.member_online_num;
      const option = this.buildPolarRingOption(
        P,
        i18n.global.t("home.tet1"),
        i18n.global.t("home.tet2"),
        i18n.global.t("home.tet3"),
        offLineNum,
        this.memberNum.member_online_num
      );
      try {
        this.myChart3.clear();
        this.myChart3.setOption(option, true);
        this.myChart3.resize();
      } catch (e) {
        console.warn(e);
      }
      this.myChart3.off("click");
      this.myChart3.on("click", function (params) {
        if (!that.employee) {
          return;
        }
        const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
        if (params.name == i18n.global.t("home.tet2")) {
          that.$store.commit("changeStaffEuis", that.memberNum.member_online_dev_list);
          that.$router.push({
            path: "/staff/staffmanagement",
            query: {
              timeStamp: timeStamp,
              euis: true,
              flag: true,
            },
          });
        } else if (params.name == i18n.global.t("home.tet3")) {
          that.$store.commit("changeStaffEuis", that.memberNum.member_online_dev_list);
          that.$router.push({
            path: "/staff/staffmanagement",
            query: {
              timeStamp: timeStamp,
              euis: true,
              flag: false,
            },
          });
        }
      });
    },
    myEcharts4() {
      var that = this;
      this.myChart4 = this.ensureChart("main2", "myChart4");
      if (!this.myChart4) return;
      this.memberNum.asset_online_num = this.asset ? this.memberNum.asset_online_num : 0;
      this.memberNum.asset_sum_num = this.asset ? this.memberNum.asset_sum_num : 0;
      let P = (
        (this.memberNum.asset_online_num / this.memberNum.asset_sum_num) *
        100
      ).toFixed(2);
      if (isNaN(P)) {
        P = "0";
      }
      var offLineNum = this.asset ? this.memberNum.asset_offline_num : 0;
      const option = this.buildPolarRingOption(
        P,
        i18n.global.t("home.tet4"),
        i18n.global.t("home.tet5"),
        i18n.global.t("home.tet6"),
        offLineNum,
        this.memberNum.asset_online_num
      );
      try {
        this.myChart4.clear();
        this.myChart4.setOption(option, true);
        this.myChart4.resize();
      } catch (e) {
        console.warn(e);
      }
      this.myChart4.off("click");
      this.myChart4.on("click", function (params) {
        if (!that.asset) {
          return;
        }
        const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
        if (params.name == i18n.global.t("home.tet5")) {
          that.$store.commit("changeAssetEuis", that.memberNum.asset_online_dev_list);
          that.$router.push({
            path: "/staff/assetManagement",
            query: {
              timeStamp: timeStamp,
              euis: true,
              flag: true,
            },
          });
        } else if (params.name == i18n.global.t("home.tet6")) {
          that.$store.commit("changeAssetEuis", that.memberNum.asset_online_dev_list);
          that.$router.push({
            path: "/staff/assetManagement",
            query: {
              timeStamp: timeStamp,
              euis: true,
              flag: false,
            },
          });
        }
      });
    },
    myEcharts5() {
      var that = this;
      this.myChart5 = this.ensureChart("main3", "myChart5");
      if (!this.myChart5) return;
      this.memberNum.tbox_online_num = this.tbox ? this.memberNum.tbox_online_num : 0;
      this.memberNum.tbox_sum_num = this.tbox ? this.memberNum.tbox_sum_num : 0;
      let P = (
        (this.memberNum.tbox_online_num / this.memberNum.tbox_sum_num) *
        100
      ).toFixed(2);
      if (isNaN(P)) {
        P = "0";
      }
      var offLineNum = this.tbox ? this.memberNum.tbox_offline_num : 0;
      const option = this.buildPolarRingOption(
        P,
        i18n.global.t("home.tet7"),
        i18n.global.t("home.tet8"),
        i18n.global.t("home.tet9"),
        offLineNum,
        this.memberNum.tbox_online_num
      );
      try {
        this.myChart5.clear();
        this.myChart5.setOption(option, true);
        this.myChart5.resize();
      } catch (e) {
        console.warn(e);
      }
      this.myChart5.off("click");
      this.myChart5.on("click", function (params) {
        if (!that.tbox) {
          return;
        }
        const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
        if (params.name == i18n.global.t("home.tet8")) {
          that.$store.commit("changeTBoxEuis", that.memberNum.tbox_online_dev_list);
          that.$router.push({
            path: "/staff/tboxManagement",
            query: {
              timeStamp: timeStamp,
              euis: true,
              flag: true,
            },
          });
        } else if (params.name == i18n.global.t("home.tet9")) {
          that.$store.commit("changeTBoxEuis", that.memberNum.tbox_online_dev_list);
          that.$router.push({
            path: "/staff/tboxManagement",
            query: {
              timeStamp: timeStamp,
              euis: true,
              flag: false,
            },
          });
        }
      });
    },
    //用户视角
    myEcharts1() {
      var that = this;
      //初始化echarts实例
      var chartDom = document.getElementById("main");
      if (this.myChart1 && this.myChart1.dispose && !this.myChart1.isDisposed?.()) {
        try {
          this.myChart1.dispose();
        } catch (e) {}
        this.myChart1 = null;
      }
      const exist = chartDom && echarts.getInstanceByDom && echarts.getInstanceByDom(chartDom);
      if (exist) {
        try {
          exist.dispose();
        } catch (e) {}
      }
      const instance = echarts.init(chartDom, "macarons");
      this.myChart1 = instance ? markRaw(instance) : null;
      if (!this.myChart1) return;
      var option;
      let bgColor = "#fff";
      let title = "总量";

      let echartData = [
        {
          name: i18n.global.t("home.tet10"),
          value: this.devBatTimeNum.bat_0_20,
          itemStyle: {
            color: "#d72a14",
          },
        },
        {
          itemStyle: {
            color: "#E1D95B",
          },
          name: i18n.global.t("home.tet11"),
          value: this.devBatTimeNum.bat_20_60,
        },
        {
          itemStyle: {
            color: "#52ca52",
          },
          name: i18n.global.t("home.tet12"),
          value: this.devBatTimeNum.bat_60_100,
        },
      ];
      let echartData2 = [
        {
          name: i18n.global.t("home.Unused"),
          value: this.devTypeNum.inuse_no,
        },
        {
          name: i18n.global.t("home.Used"),
          value: this.devTypeNum.inuse_yes,
        },
      ];
      let total = echartData.reduce((a, b) => {
        return a + b.value * 1;
      }, 0);

      option = {
        backgroundColor: bgColor,
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          icon: "rect",

          bottom: "0",

          textStyle: {
            rich: {
              name: {
                fontSize: 12,
              },
              value: {
                fontSize: 16,
                padding: [0, 5, 0, 15],
              },
              unit: {
                fontSize: 12,
              },
            },
          },
        },
        series: [
          //第一环
          {
            type: "pie",
            selectedMode: "single",
            radius: ["20%", "35%"],
            center: ["50%", "50%"],
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2,
              },
            },
            label: {
              normal: {
                position: "inner",
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },

            data: echartData2,
          },

          {
            type: "pie",
            radius: ["45%", "60%"],
            center: ["50%", "50%"],
            data: echartData,
            hoverAnimation: true,
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2,
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 120,
                lineStyle: {
                  color: "#e6e6e6",
                },
              },
            },
            label: {
              normal: {
                formatter: (params) => {
                  return "{icon|●}{name|" + params.name + "}{value|" + params.value + "}";
                },
                padding: [0, -100, 25, -100],
                rich: {
                  icon: {
                    fontSize: 16,
                  },
                  name: {
                    fontSize: 14,
                    padding: [0, 10, 0, 4],
                    color: "#666666",
                  },
                  value: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333333",
                  },
                },
              },
            },
          },
        ],
      };

      option && this.myChart1.setOption(option);
      this.myChart1.on("click", function (param) {
        switch (param.name) {
          case i18n.global.t("home.Used"):
            that.$router.push({
              path: "/device/terminal",
              query: { inuse: 1 },
            });
            break;
          case i18n.global.t("home.Unused"):
            that.$router.push({
              path: "/device/terminal",
              query: { inuse: 2 },
            });
            break;
          case i18n.global.t("home.tet10"):
            that.$router.push({
              path: "/device/terminal",
              query: { endbat: 20 },
            });
            break;
          case i18n.global.t("home.tet11"):
            that.$router.push({
              path: "/device/terminal",
              query: { beginbat: 20, endbat: 60 },
            });
            break;
          case i18n.global.t("home.tet12"):
            that.$router.push({
              path: "/device/terminal",
              query: { beginbat: 60 },
            });
            break;
        }
      });
    },
    //用户视角
    myEcharts2() {
      if (this.myChartBeacon) {
        this.myChartBeacon.dispose();
        this.myChartBeacon = null;
      }
      var that = this;
      //初始化echarts实例
      var chartDom = document.getElementById("main6");
      this.myChart2 = echarts.init(chartDom, "macarons");
      if (!this.myChart2) return;
      this.myChart2 = markRaw(this.myChart2);
      if (!this.myChart2) return;
      var option;
      var category = [];
      var barData1 = [];
      var barData2 = [];
      if (this.attendance) {
        for (var i = 0; i < this.attendanceNum.length; i++) {
          barData1.push(-this.attendanceNum[i].member_absenteeism_num);
          barData2.push(this.attendanceNum[i].member_attendance_num);
          category.push(this.attendanceNum[i].retime);
        }
      }
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
              backgroundColor: "#333",
            },
          },
          // 显示时，都显示正数
          formatter: (params) => {
            if (!params.length) return "";
            let s = params[0].axisValueLabel + "<br/>";
            for (const iterator of params) {
              // 如果是负数则反转
              let d = iterator.data < 0 ? -iterator.data : iterator.data;
              s += iterator.marker + iterator.seriesName + "：" + d;
            }
            return s;
          },
        },
        legend: {
          data: [i18n.global.t("checkwork.Attendance"), i18n.global.t("checkwork.Noattendance")],
          bottom: "0",
          textStyle: {
            color: "#666",
          },
        },
        xAxis: {
          type: "category",
          data: category,
          axisTick: {
            alignWithLabel: true,
          },

          splitLine: {
            show: false,
          },
          axisLabel: {
            fontsize: 2,
            align: "center",
            color: "#666",
          },
        },
        yAxis: [
          {
            type: "value",
            minInterval: 1,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#666",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (data) {
                if (data < 0) return -data;
                else return data;
              },
              fontWeight: 10,
              fontsize: 5,
              color: "#666",
            },
          },
        ],
        series: [
          {
            cursor: "default",
            name: i18n.global.t("checkwork.Attendance"),
            type: "bar",
            stack: "总量",
            barWidth: 14,
            itemStyle: {
              normal: {
                barBorderRadius: 25,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#4aa3ff" },
                  { offset: 1, color: "#5664d2" },
                ]),
              },
            },
            data: barData2,
          },
          {
            cursor: "default",
            name: i18n.global.t("checkwork.Noattendance"),
            type: "bar",
            stack: "总量",
            barWidth: 14,
            itemStyle: {
              normal: {
                barBorderRadius: 25,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#74788d" },
                  { offset: 1, color: "#ccc" },
                ]),
              },
            },
            label: {
              show: false,
              formatter: (value) => {
                // 值都是负数的 所以需要取反一下
                return -value.data;
              },
            },
            data: barData1,
          },
        ],
      };

      option && this.myChart2.setOption(option);
    },

    myEchartsBeacon() {
      if (this.myChart2) {
        this.myChart2.dispose();
        this.myChart2 = null;
      }
      var that = this;
      this.myChartBeacon = this.ensureChart("main7", "myChartBeacon");
      if (!this.myChartBeacon) return;
      const raw = that.beaconData && typeof that.beaconData === "object" ? that.beaconData : {};
      let beacon_data = [
        {
          name: i18n.global.t("home.Scanneddays"),
          value: raw.beacon_low_3day,
        },
        {
          name: i18n.global.t("home.scannedwithin"),
          value: raw.beacon_more_3day,
        },
        {
          name: i18n.global.t("home.Neverscanned"),
          value: raw.beacon_time_unknown,
        },
        {
          name: ">60%",
          value: raw.bat_60_100,
        },
        {
          name: ">20%",
          value: raw.bat_20_60,
        },
        {
          name: "<20%",
          value: raw.bat_0_20,
        },
      ];
      for (let i = beacon_data.length - 1; i > -1; i--) {
        if (beacon_data[i].value == undefined || beacon_data[i].value === "") {
          beacon_data[i].value = 0;
        }
      }
      let dev_beacon_xAx = [];
      let dev_beacon_yAy = [];
      for (let i = 0; i < beacon_data.length; i++) {
        dev_beacon_xAx.push(beacon_data[i].name);
        dev_beacon_yAy.push(beacon_data[i].value);
      }
      var option;
      option = {
        tooltip: {},
        grid: {
          left: 40,
          right: 20,
          top: 30,
          bottom: 60,
        },
        xAxis: {
          data: dev_beacon_xAx,
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: function (params) {
                var colorList = [
                  "#52ca52",
                  "#E1D95B",
                  "#d72a14",
                  "#52ca52",
                  "#E1D95B",
                  "#d72a14",
                ];
                return colorList[params.dataIndex];
              },
            },
            barCategoryGap: "60%",
            data: dev_beacon_yAy,
          },
        ],
      };

      try {
        that.myChartBeacon.clear();
        that.myChartBeacon.setOption(option, true);
        that.myChartBeacon.resize();
      } catch (e) {
        console.warn(e);
      }
      that.myChartBeacon.off("click");
      that.myChartBeacon.on("click", function (param) {
        switch (param.name) {
          case i18n.global.t("home.Scanneddays"):
            that.$router.push({
              path: "/device/beacon",
              query: { devtimes: 1 },
            });
            break;
          case i18n.global.t("home.scannedwithin"):
            that.$router.push({
              path: "/device/beacon",
              query: { devtimes: 2 },
            });
            break;
          case i18n.global.t("home.Neverscanned"):
            that.$router.push({
              path: "/device/beacon",
              query: { devtimes: 3 },
            });
            break;
          case "<20%":
            that.$router.push({
              path: "/device/beacon",
              query: { batterys: 3 },
            });
            break;
          case ">20%":
            that.$router.push({
              path: "/device/beacon",
              query: { batterys: 2 },
            });
            break;
          case ">60%":
            that.$router.push({
              path: "/device/beacon",
              query: { batterys: 1 },
            });
            break;
          default:
            break;
        }
      });
    },

    //获取echarts需要的数据
    getFristPages(value) {
      var that = this;
      let data;
      if (this.contrForPrionum == 5) {
        data = {
          projectid: value,
          tenantid: this.$store.state.userInfo.superid,
          timezone: this.timezone,
          attenFlag: that.attenFlag,
        };
      }
      getFristPageUserDevUtil(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.devTypeNum) {
            that.devTypeNum = res.data.devTypeNum;
          } else {
            that.devTypeNum = "";
          }
          if (res.data.devBatTimeNum) {
            that.devBatTimeNum = res.data.devBatTimeNum;
          }
          that.$nextTick(() => {
            if (!that.$el || that.$route.path === "/largescreen") {
              return;
            }
            that.renderBeaconAndDeviceCharts(res.data.beaconBatTimeNum);
          });
        }
      });
      //本地时区 console.log(0 - new Date().getTimezoneOffset() / 60);
      getFristPageUserMapUtil(
        {
          projectid: value,
          tenantid: this.$store.state.userInfo.superid,
          timezone: this.timezone,
          attenFlag: this.attenFlag,
        },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.fenceList && res.data.fenceList.length > 0) {
            res.data.fenceList.forEach((item) => {
              const index = that.AllFences.findIndex((items) => items.id === item.id);
              that.updateNumber(index, item.num);
            });
          }
          that.attendanceNum = res.data.attendanceNum ? res.data.attendanceNum : [];
          that.max_num_build = res.data.max_num_build;
          if (that.max_num_build.length > 0) {
            that.max_num_buildName = that.max_num_build[0].building;
            that.max_num_buildNum = that.max_num_build[0].num;
          } else {
            that.max_num_buildName = i18n.global.t("tet.nodata");
            that.max_num_buildNum = "";
          }
          that.max_num_ground = res.data.max_num_ground;
          if (that.max_num_ground.length > 0) {
            that.max_num_groundName =
              that.max_num_ground[0].building + "/" + that.max_num_ground[0].groundname;
            that.max_num_groundNum = that.max_num_ground[0].num;
          } else {
            that.max_num_groundName = i18n.global.t("tet.nodata");
            that.max_num_groundNum = "";
          }

          that.max_num_tranche = res.data.max_num_tranche;
          that.memberMaxStep = res.data.memberMaxStep;
          if (that.memberMaxStep.length > 0) {
            that.memberMaxStepName = that.memberMaxStep[0].username;
            that.memberMaxStepNum = that.memberMaxStep[0].steps;
          } else {
            that.memberMaxStepName = i18n.global.t("tet.nodata");
            that.memberMaxStepNum = "";
          }

          that.member_indoor_num = res.data.memberIndoorNum;
          that.member_outdoor_num = res.data.memberOutdoorNum;
          that.tbox_indoor_num = res.data.tboxIndoorNum;
          that.tbox_outdoor_num = res.data.tboxOutdoorNum;
          that.asset_indoor_num = res.data.assetIndoorNum;
          that.asset_outdoor_num = res.data.assetOutdoorNum;
          that.warnNumList = [
            {
              type: 1,
              typestr: i18n.global.t("homepage.SOSalert"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: i18n.global.t("homepage.gatherwarn"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: i18n.global.t("homepage.crosswarn"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: i18n.global.t("homepage.strandedwarn"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: i18n.global.t("homepage.Unusuallystill"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: i18n.global.t("warning.Tilt"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },

            {
              type: 1,
              typestr: i18n.global.t("warning.Dumpalarm"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },

            {
              type: 1,
              typestr: i18n.global.t("warning.Firealarm"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
          ];
          if (res.data.warnNumList.length > 0) {
            // console.log(res.data.warnNumList);
            that.warnNumList.forEach((item) => {
              res.data.warnNumList.forEach((value) => {
                if (item.typestr == value.typestr || item.typestr == value.entype) {
                  item.warn_status1_num = value.warn_status1_num;
                  item.warn_status2_num = value.warn_status2_num;
                }
              });
            });
          }

          if (that.contrForPrionum == 5) {
            that.memberNum = res.data;
            that.memberNum1 = that.employee ? res.data.member_sum_num : 0;
            that.memberNum2 = that.asset ? res.data.asset_sum_num : 0;
            that.memberNum3 = that.tbox ? res.data.tbox_sum_num : 0;
            that.$nextTick(() => {
              that.renderPolarCharts();
              if (that.attendanceNum.length > 0) {
                try {
                  that.myEcharts2();
                } catch (e) {
                  console.warn(e);
                }
              } else if (that.myChart2) {
                that.myChart2.dispose();
                that.myChart2 = null;
              }
              that.scheduleHomeChartsResize();
            });
          }
        }
      });
    },

    // 描线（南海）
    addLine(map) {
      var style = new Style({
        stroke: new Stroke({
          color: "#AA8DC6",
          width: 10,
        }),
      });

      //直线数据，手动添加
      var line = new LineString([
        [122.9272781486751, 23.848426854398152],
        [122.40150850225844, 22.133416341086654],
        [121.78811058143899, 21.35728019637634],
        [120.18576499235964, 19.5296047588327],
        [119.25521102926318, 17.337282710181967],
        [119.05017371536066, 14.734886033725882],
        [118.98708531108292, 12.810689703255191],
        [118.07230344905598, 10.88649337278446],
        [116.57395384745995, 8.96229704231377],
        [111.37587218970845, 3.8613280294327694],
        [110.27425959721639, 2.809788736599442],
        [107.95320447327722, 5.7617448175673145],
        [107.26213818712276, 7.806878264206475],
        [108.44658415967254, 8.693401446500248],
        [110.07396639858125, 11.021809880631187],
        [110.90017584295029, 13.225035065615302],
        [109.69841665114078, 15.428260250599415],
        [107.99592446274401, 17.531338836266087],
      ]);
      var source = new VectorSource({
        wrapX: false,
      });
      var outlineStroke = new Style({
        stroke: new Stroke({
          color: [170, 141, 198, 1],
          lineDash: [2, 7],
        }),
      });
      function getAnimationStrokeStyle() {
        return new Style({
          stroke: new Stroke({
            color: [170, 141, 198, 1],
            widht: 5,
            lineDash: [2, 7], //一组线段和间距交互的数组，可以控制虚线的长度
            lineDashOffset: feature.get("dashOffset"), //偏移量，控制虚线的速度和方向
          }),
        });
      }
      //手动添加数据的矢量数据
      var feature = new Feature({
        geometry: line,
        finished: false,
        dashOffset: -8,
      });

      function getStyle() {
        return [outlineStroke, getAnimationStrokeStyle()];
      }
      var array = [];
      feature.setStyle(getStyle());
      source.addFeature(feature);
      var flightsLayer = new VectorLayer({
        source: source,
        style: style,
      });
      map.addLayer(flightsLayer);
      setInterval(() => {
        let offset1 = feature.get("dashOffset");
        offset1 = offset1 == 0 ? -8 : offset1 + 1;

        feature.set("dashOffset", offset1);
        feature.setStyle(getStyle());
      }, 100);
    },

    //用户鼠标经过楼栋改变鼠标样式
    userMapMouse(map) {
      var that = this;
      map.on("pointermove", function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        if (feature) {
          if (feature.values_.features && feature.values_.features.length == 1) {
            map.getTargetElement().style.cursor = "pointer";
          }
        } else {
          map.getTargetElement().style.cursor = "default";
        }
      });
    },

    //用户地图双击事件
    userMapdbclick() {
      var that = this;
      // 250ms内单击多次，只触发一次
      this.map.on("singleclick", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        if (feature.values_.features && feature.values_.features.length == 1) {
          that.$router.push({
            path: "/location/indoor/locationindoor",
            query: { id: feature.values_.features[0].values_.id },
          });
        }
      });
      //250ms内双击触发
      this.map.on("dblclick", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        if (feature.values_.features && feature.values_.features.length == 1) {
          that.$router.push({
            path: "/location/indoor/locationindoor",
            query: { id: feature.values_.features[0].values_.id },
          });
        }
      });
    },
    updateSize() {
      if (this.map && this.map.updateSize) {
        this.map.updateSize();
      }
    },
    bootstrapHomePage() {
      let that = this;
      if (this.$store.state.longis && this.$store.state.latis) {
        this.mapCenter = [this.$store.state.longis, this.$store.state.latis];
      } else {
        if (that.$store.state.i18n == "zh") {
          that.mapCenter = [118, 32];
        } else {
          that.mapCenter = [0.1, 51.3];
        }
      }
      this.outdoorBaseLayers = createOutdoorBaseLayers(
        this.$store.state.i18n == "zh"
      );
      var count = document.getElementById("count");
      if (count) {
        count.style.height = 15 + "vh";
      }
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerMap);
      this.timerMap = null;
      if (
        this.$store.state.userInfo.prionum == 5 &&
        !this.$store.state.projectid
      ) {
        this.getProjectFirstLists();
      } else if (
        this.$store.state.userInfo.prionum == 5 &&
        this.$store.state.projectid
      ) {
        this.getFristPages(this.$store.state.projectid);
        this.getBuildingByProjectids(this.$store.state.projectid);
        this.timer = setInterval(() => {
          that.getFristPages(that.$store.state.projectid);
        }, 30000);
        this.timerMap = setInterval(() => {
          that.getBuildingByProjectids2(this.$store.state.projectid);
        }, 30000);
      }
      this.$nextTick(() => {
        window.dispatchEvent(new Event("resize"));
        if (this.map && this.map.updateSize) {
          this.map.updateSize();
        }
        this.scheduleHomeChartsResize();
      });
    },
  },

  mounted() {
    this.bootstrapHomePage();
  },
  computed: {
    isFullscreen() {
      return this.$store.state.isFullscreen;
    },
    show1() {
      return this.$store.state.show;
    },
    projectid() {
      return this.$store.state.projectid;
    },

    longis() {
      return this.$store.state.longis;
    },
    latis() {
      return this.$store.state.latis;
    },
  },
  watch: {
    isFullscreen(val, oldVal) {
      var that = this;
      if (val != oldVal) {
        that.myChart1.resize();
        if (that.myChart2) {
          that.myChart2.resize();
        }
        that.myChart3.resize();
        that.myChart4.resize();
        that.myChart5.resize();
        if (that.myChartBeacon) {
          that.myChartBeacon.resize();
        }
        var count = document.getElementById("count");
        //全屏样式修改
        if (
          document.fullscreen ||
          document.mozFullScreen ||
          document.webkitIsFullScreen ||
          document.msFullscreenElement ||
          window.fullScreen
        ) {
          count.style.height = 12.5 + "vh";
        } else {
          count.style.height = 15 + "vh";
        }
      }
    },
    //监听vuex中projectid的变化
    projectid(val, oldVal) {
      var that = this;
      this.attenFlag = this.$store.state.functionParts.attenFlag;
      if (val && val != oldVal && this.$store.state.userInfo.prionum == 5) {
        if (this.attenFlag !== "") {
          this.getFristPages(val);
        }
        this.intoProjectFBXUrl = this.$store.state.intoProjectFBXUrl;
        this.getBuildingByProjectids(this.$store.state.projectid);

        clearInterval(this.timerMap);
        this.timerMap = null;
        this.timerMap = setInterval(() => {
          that.getBuildingByProjectids2(this.$store.state.projectid);
        }, 30000);
      }
    },
    longis(val, oldVal) {
      this.longi = val;
    },
    latis(val, oldVal) {
      this.lati = val;
    },
    show1(val) {
      setTimeout(() => {
        this.updateSize();
      }, 500);
    },
    "$i18n.locale"() {
      this.myEcharts1();
      if (this.attenFlag) {
        this.myEcharts2();
      } else {
        this.myEchartsBeacon();
      }
      this.myEcharts3();
      this.myEcharts4();
      this.myEcharts5();
      this.getFristPages(this.$store.state.projectid);
    },
  },

  unmounted() {
    clearTimeout(this._chartResizeTimer1);
    clearTimeout(this._chartResizeTimer2);
    clearInterval(this.polarTimer);
    this.polarTimer = null;
    if (this.myChart1) {
      this.myChart1.dispose();
    }
    if (this.myChart2) {
      this.myChart2.dispose();
    }
    if (this.myChart3) {
      this.myChart3.dispose();
    }
    if (this.myChart4) {
      this.myChart4.dispose();
    }
    if (this.myChart5) {
      this.myChart5.dispose();
    }
    if (this.myChartBeacon) {
      this.myChartBeacon.dispose();
    }
    cancelAnimationFrame(this.clearAnim); // 清除requestAnimationFrame
    this.scene = null; // 场景
    this.cameras = null; // 照相机
    this.renderer = null; // 渲染器
    this.textureLoader = null; // 纹理加载器
    this.groupBox = null;
    this.control = null; // 相机控件
    this.publicPath = process.env.BASE_URL;

    clearInterval(this.audioTimer);
    this.audioTimer = null;

    clearInterval(this.timer);
    this.timer = null;

    clearInterval(this.timerMap);
    this.timerMap = null;
  },
};
</script>

<style lang="scss" scoped>
//变量
:root {
  --blue: #5438dc;
  --indigo: #564ab1;
  --purple: #5664d2;
  --pink: #e83e8c;
  --red: #ff3d60;
  --orange: #f1734f;
  --yellow: #fcb92c;
  --green: #1cbb8c;
  --teal: #050505;
  --cyan: #4aa3ff;
  --white: #fff;
  --gray: #74788d;
  --gray-dark: #343a40;
  --primary: #5664d2;
  --secondary: #74788d;
  --success: #1cbb8c;
  --info: #4aa3ff;
  --warning: #fcb92c;
  --danger: #ff3d60;
  --light: #eff2f7;
  --dark: #343a40;
  --pink: #e83e8c;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: "Nunito", sans-serif;
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
}

.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  color: #343a40 !important;
  font-family: "Inter";
}

.menu_header {
  position: relative;
}

.box-card span {
  cursor: pointer;
}

#beaconPower,
#projectType {
  height: 300px;
}

#projectType >>> .el-table th {
  padding: 0;
}

/* 地图 */
.mapConent {
  width: 56%;
  position: relative;
}
.mapConent .tips1 {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  background-color: rgba(134, 153, 175, 0.7);
  padding: 4px;
  border-radius: 4px;
}
.mapConent .tips1 .item {
  display: flex;
  margin-right: 0;
  align-items: center;
  font-size: 10px;
  color: #fff;
  padding: 1px 0 1px 0;
}
.mapConent .tips1 .item .color {
  padding: 2px 6px 2px 6px;
  border-radius: 2px;
  margin-left: 6px;
  font-size: 8px;
}

.divider {
  margin: 5px 0 !important;
}

a {
  text-decoration: none;
}
#userMap {
  cursor: pointer;
  position: relative;
  height: 100%;
  width: 100%;
}

#userBeacon,
#userGateway {
  height: 200px;
}

#userBeaconPower {
  height: 225px !important;
}
.userHome {
  display: flex;
}
.maps {
  width: 100%;
  margin-left: 0;
  position: relative;
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
  height: 44vh;
  background-color: #fff;
}
.maps .tips {
  position: absolute;
  right: 20px;
  top: 10px;
  display: flex;
  flex-direction: column;
}
.maps .tips1 {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgba(134, 153, 175, 0.7);
  padding: 4px 10px 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
}
.maps .tips2 {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  background-color: rgba(134, 153, 175, 0.7);
  padding: 4px 10px 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
}
.maps .tips1 .item,
.maps .tips2 .item {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #fff;
  margin-left: 0;
}
.maps .tips2 .item {
  cursor: pointer;
}
.maps .tips1 .item .color,
.maps .tips2 .item .color {
  margin-left: 6px;
}
.userEcharts {
  width: 33%;
  margin-left: 1%;
  display: flex;
  flex-direction: column;
}
.userEcharts_beacon {
  display: flex;
  flex-direction: column;
}
.select .el-dialog__body {
  padding-bottom: 30px;
}

.el-dialog_wrapper .dialog-fade-leave-active {
  animation-fill-mode: forwards;
}

/*项目选择 */
.project-wrapper {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5vw;
}
.project-item {
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 20px;
  z-index: 0;
  transition: all 0s;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  margin: 0;
  text-align: left;
  box-shadow: 3px 3px 4px -2px #d6d6d6;
}

.project-item:hover {
  z-index: 2;
  transform: scale(1.05);
  -moz-box-shadow: 1px 5px 14px #cccccc;
  -webkit-box-shadow: 1px 5px 14px #cccccc;
  box-shadow: 1px 5px 14px #cccccc;
}
.item-header {
  position: relative;
  height: 40px;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
.active-item .item-header {
  background: #ff9b44;
}
.item-header .isactive {
  width: 46px;
  height: 46px;
  position: absolute;
  background: #ffca9c;
  top: -23px;
  right: -23px;
  transform: rotate(45deg);
}
.item-header .isactive .icon {
  position: absolute;
  bottom: 0;
  transform: rotate(-45deg);
  width: 12px;
  height: 12px;
  background: #fff;
  mask: url("../../assets/pick.svg");
  mask-size: contain;
}
.item-header .item-icon {
  margin: 0;
  margin-right: 10px;
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #fff;
  mask: url("../../assets/firm.svg");
  mask-size: contain;
  font-size: 18px;
}
.item-info {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  margin: 14px 0 0;
  text-align: left;
}
.item-info .key {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #8c8c8c;
  margin: 0 10px;
  white-space: nowrap;
  text-align: left;
}
.item-info .key span {
  margin: 4px 0 0;
  text-align: left;
}
.item-info .value {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 0 0 5px;
  min-width: 0;
  text-align: left;
}
.item-info .value span {
  margin: 4px 0 0;
  color: #2d2d2d;
  text-align: left;
}

.el-card {
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%) !important;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 24px;
  }

  .card-panel {
    border-radius: 6px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        cursor: pointer;
        color: #fff;
      }
      .card-panel-icon-wrapper {
        .icon {
          background-color: #fff;
        }
      }
      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      padding: 12px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.main_box {
  height: 100%;
  width: 100%;
  margin: 0 !important;
}
.asi {
  width: 100%;
  height: 100%;
  margin: 0 !important;
}

main.el-main {
  margin: 0 !important;
  padding: 0;
  padding-top: 0px !important;
  padding-left: 15px !important;
  padding-bottom: 30px !important;
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
}
.el-main::-webkit-scrollbar {
  display: none;
}
>>> table {
  margin: 0 !important;
}
>>> .cell {
  line-height: 2;
}
>>> .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.card-body {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-height: 1px;
  padding: 18px;
  text-align: left !important;
}
.media {
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}
.overflow-hidden {
  overflow: hidden !important;
}
.media-body {
  flex: 1;
}
.font-size-14 {
  font-size: 14px !important;
}
.mb-2,
.my-2 {
  margin-bottom: 10px !important;
}
.pb-3,
.py-3 {
  padding-bottom: 10px !important;
}
.pt-3,
.py-3 {
  padding-top: 10px !important;
}
.border-top {
  border-top: 1px solid #eff2f7 !important;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.font-size-11 {
  font-size: 11px !important;
}
.badge-soft-success {
  color: #1cbb8c;
  background-color: rgba(28, 187, 140, 0.18);
}
.badge {
  display: inline-block;
  padding: 4px 5px;
  font-size: 75%;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 4px;
  -webkit-transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}
.text-muted {
  color: #74788d !important;
}

.ml-2,
.mx-2 {
  margin-left: 6px !important;
}
h4.mb-0 {
  font-size: 20px;
}
[dir] .card,
[dir] .card-nav .tab-content {
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid #dfe2e6;
  border-radius: 8px;
}
.card-group-row__card {
  flex: 1 0 0;
}

.card,
.card-nav .tab-content {
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: box-shadow;
}
.card,
.card-nav .tab-content {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
}

[dir="ltr"] .row,
[dir="rtl"] .row {
  margin-right: -12px;
  margin-left: -12px;
}

.flex {
  flex: 1 1 0% !important;
}
.row {
  display: flex;
  flex-wrap: wrap;
}
.flex-column {
  flex-direction: column !important;
}
.d-flex {
  display: flex !important;
}
.col-auto {
  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
}

:deep(.el-card__body) {
  height: calc(100% - 50px);
  padding-top: 0;
}

:deep(.el-card__header) {
  padding-top: 8px;
  padding-bottom: 8px;
  text-align: left !important;
}
.home-stat-card {
  text-align: left !important;
}
.home-stat-card :deep(.el-card__header),
.home-stat-card :deep(.el-card__body),
.home-stat-card :deep(.member),
.home-stat-card :deep(.home-chart-carousel),
.home-stat-card :deep(.el-carousel),
.home-stat-card :deep(.el-carousel__container),
.home-stat-card :deep(.el-carousel__item),
.home-stat-card :deep(.home-chart),
.home-stat-card :deep(.home-chart-polar),
.home-stat-card :deep(.polar-total),
.home-stat-card :deep(.el-breadcrumb),
.home-stat-card :deep(.home-card-title) {
  /* 覆盖 App.vue 全局 * { margin: 0 auto }，否则标题居中、内容被挤成窄条 */
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.home-stat-card :deep(.el-card__header) {
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center;
  text-align: left !important;
}
.home-stat-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: calc(100% - 50px) !important;
  padding: 8px 12px 12px !important;
  box-sizing: border-box;
  width: 100% !important;
}
.home-card-title {
  width: 100%;
  text-align: left !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.home-card-title-polar {
  gap: 6px;
}
.home-card-title :deep(.el-breadcrumb) {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  font-weight: 600;
}
.home-card-title :deep(.el-breadcrumb__item) {
  float: none;
}
.home-card-help {
  margin-left: 4px !important;
  cursor: help;
}
.count {
  padding: 22px;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
}
.count-item {
  border-right: 1px #ccc solid;
  width: 25%;
}

.count .count-item:last-child {
  border-right: 0;
}
.el-container {
  color: #515a6e;
}
>>> table {
  overflow: hidden;
  width: 100%;
}
.member {
  display: flex;
  flex-direction: column;
  width: 100% !important;
  flex: 1;
  min-height: 0;
  height: 100%;
  align-items: stretch;
}
.member .add {
  margin-top: 12px;
  flex: 0 0 auto;
}
#main6 {
  margin-top: -9%;
  flex: 1;
  min-height: 0;
}
.home-chart,
.home-chart-polar {
  width: 100% !important;
}
.home-chart-fill {
  flex: 1 1 auto !important;
  width: 100% !important;
  min-height: 240px !important;
  height: 100% !important;
}
.home-chart-carousel {
  flex: 1;
  min-height: 0;
  width: 100% !important;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.home-chart-carousel :deep(.el-carousel) {
  flex: 1;
  width: 100% !important;
  height: 100% !important;
}
.home-chart-carousel :deep(.el-carousel__container) {
  height: calc(100% - 24px) !important;
}
.home-chart-carousel :deep(.el-carousel__item) {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 6px 8px;
  box-sizing: border-box;
}
.home-chart-polar {
  width: 100% !important;
  flex: 1 1 auto;
  min-height: 160px !important;
  height: calc(100% - 28px) !important;
}
.polar-total {
  margin: 0 !important;
  line-height: 28px;
  text-align: center;
  flex: 0 0 auto;
  width: 100%;
  white-space: nowrap;
}
.box-card2 {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100% !important;
}

// ======================================================================================
// Users List
// ======================================================================================

.user-list {
  display: flex;

  & .con-vs-avatar {
    transition: 0.3s;

    &:hover {
      transform: translateY(-5px) scale(1.07);
      box-shadow: 0 14px 24px rgba(62, 57, 107, 0.2);
      z-index: 999;
    }
  }
}

// ======================================================================================
// Uncategorized
// ======================================================================================

.vx-row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
[dir] .pb-4 {
  padding-bottom: 16px !important;
}

[dir="ltr"] .px-8 {
  padding-left: 32px !important;
  padding-right: 32px !important;
}

[dir] .mt-2 {
  margin-top: 8px !important;
}

.justify-between {
  -webkit-box-pack: justify !important;
  -ms-flex-pack: justify !important;
  justify-content: space-between !important;
}

.flex-row {
  -webkit-box-orient: horizontal !important;
  -webkit-box-direction: normal !important;
  -ms-flex-direction: row !important;
  flex-direction: row !important;
}

.flex {
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
}

.icon {
  width: 48px;
  height: 48px;
  display: inline-block;
  margin-right: 8px;
  margin-left: 5px;
  background-color: #36a3f7;
  transition: all 0.2s;
}
.icon.tower {
  mask: url("../../assets/tower.svg");
  mask-size: contain;
}

.icon.tier {
  mask: url("../../assets/tier.svg");
  mask-size: contain;
}

#warningweekdatas {
  width: 100%;
  height: 500px;
}
.el-carousel {
  height: 100%;
  overflow-y: hidden;
}

.el-carousel__indicator--horizontal {
  padding: 0 !important;
}
.soscard :deep(.el-card__body) {
  padding: 0px !important;
}
.sostable :deep(.cell) {
  text-overflow: clip !important;
}
.sostable :deep(.el-table__row td) {
  padding: 2px !important;
}
.dialog_box :deep(.el-dialog__header) {
  display: flex;
  justify-content: center;
}
.dialog-title {
  display: flex;
  justify-content: center;
}
.title-text {
  font-size: 18px;
  line-height: 24px;
  margin-right: 0;
}
.title-tips {
  font-size: 130%;
  line-height: 24px;
  margin-left: 5px;
}
</style>

<style lang="scss">
/* 非 scoped：确保压过 #app { text-align:center } 与 * { margin:0 auto } */
.home-stat-card .el-card__header,
.home-stat-card .home-card-title {
  text-align: left !important;
}
.home-stat-card .el-card__body,
.home-stat-card .member,
.home-stat-card #main7,
.home-stat-card #main0,
.home-stat-card .el-carousel {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
