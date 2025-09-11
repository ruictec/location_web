<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-main>
          <div
            class="Echarts"
            v-if="
              contrForPrionum == 1 ||
              contrForPrionum == 2 ||
              contrForPrionum == 3 ||
              contrForPrionum == 4
            "
          >
            <div
              style="display: flex; justify-content: space-between; width: 100%"
            >
              <el-card class="box-card" style="width: 48%; margin-left: 1%">
                <div
                  slot="header"
                  class="clearfix"
                  style="text-align: left; font-weight: 600"
                  @click="goBeacon()"
                >
                  <span>{{ $t("home.BeaconStatus") }}</span>
                </div>
                <div style="display: flex">
                  <div id="beacon" style="width: 50%"></div>
                  <div id="beaconPower" style="width: 50%"></div>
                </div>
              </el-card>

              <el-card class="box-card" style="width: 25%">
                <div
                  slot="header"
                  class="clearfix"
                  style="text-align: left; font-weight: 600"
                >
                  <span>{{ $t("home.ProjectType") }}</span>
                </div>
                <div id="projectType" style="width: 100%"></div>
              </el-card>

              <el-card class="box-card" style="width: 20%">
                <div
                  slot="header"
                  class="clearfix"
                  style="text-align: left; font-weight: 600"
                  @click="goTerminal()"
                >
                  <span>{{ $t("home.DeviceType") }}</span>
                </div>
                <div id="gatewayType" style="width: 100%"></div>
              </el-card>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-top: 1%;
                width: 100%;
              "
            >
              <el-card
                class="box-card local"
                style="margin-left: 1%; width: 42%"
              >
                <div
                  slot="header"
                  class="clearfix"
                  style="text-align: left; font-weight: 600"
                  @click="goTerminal()"
                >
                  <span>{{ $t("home.DeviceState") }}</span>
                </div>
                <div id="gateway" style="width: 100%"></div>
              </el-card>
              <!-- 地图 -->
              <div class="mapConent">
                <div id="gatewayMap" ref="map"></div>
                <div class="tips">
                  <span style="color: #fff; font-size: 18px">
                    - {{ $t("home.BaseStation") }} -</span
                  >
                  <div class="item" style="font-size: 14px">
                    {{ $t("home.Online") }}
                    <div
                      class="color"
                      style="background-color: #1c9ef7; font-size: 14px"
                    >
                      {{ gatewayLength.on }}
                    </div>
                  </div>
                  <div class="item" style="font-size: 14px">
                    {{ $t("home.Offline") }}
                    <div
                      class="color"
                      style="background-color: #d63333; font-size: 14px"
                    >
                      {{ gatewayLength.off }}
                    </div>
                  </div>
                  <div class="item" style="font-size: 14px">
                    {{ $t("home.NeverOnline") }}

                    <div
                      class="color"
                      style="background-color: #898989; font-size: 14px"
                    >
                      {{ gatewayLength.unknown }}
                    </div>
                  </div>
                </div>
                <!-- 左键显示内容的 -->
                <div id="popup" class="ol-popup">
                  <a href="#" id="popup-closer" class="ol-popup-closer">
                    <img
                      src="../../../static/close.jpg"
                      width="11"
                      height="11"
                      alt=""
                  /></a>
                  <div id="popup-content">
                    <ul>
                      <li>{{ $t("home.Gatewaynumber") }}{{ deveuiNum }}</li>
                      <el-divider class="divider"></el-divider>
                      <li>{{ $t("home.Createdon") }}{{ startAt }}</li>
                      <el-divider class="divider"></el-divider>
                      <li>{{ $t("home.Dataupdatetime") }}{{ lastAt }}</li>
                      <el-divider class="divider"></el-divider>
                      <li>{{ $t("home.Company") }}{{ customername }}</li>
                      <el-divider class="divider"></el-divider>
                      <li>{{ $t("home.Project") }}{{ projectname }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import host from "../../host";

import { getFristPageAdmin, getGatewayList } from "../../axios/api";

//地图
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlSourceVector from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OlLayerVector from "ol/layer/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

import Overlay from "ol/Overlay";

// 描线
import { Circle as CircleStyle, Stroke, Style } from "ol/style";
import { LineString } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";

//地图控件
import ScaleLine from "ol/control/ScaleLine"; //比例尺控件
export default {
  components: {
    Menu,
    basecard,
  },
  name: "Home",
  data() {
    return {
      allGwData: [],
      openlayersSource: "",
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      projectTable: this.$store.state.projectTable,
      pro: false,
      beacon_bat: "", //信标电量
      beacon_inallot: "", //信标分配状态
      beacon_inuse: "", //信标使用状态
      beacon_type: "", //信标类型
      dev_bat: "", //设备电量
      dev_workstate: "", //设备是否正常
      dev_hbstatus: "", //设备是否在线
      dev_inallot: "", //设备分配状态
      dev_inuse: "", //设备使用
      dev_type: "", //设备类型,网关，工卡，车载设备，第三方设备
      dev_custom: "", //是否为系统分配的设备
      project_projectype: "", //项目类型
      project_type: "", //项目定位类型
      gw_hbstatus: "", //基站状态
      beacon_devtime: "", //信标是否被扫描

      // 地图
      deveuiNum: "",
      startAt: "",
      lastAt: "",
      customername: "",
      projectname: "",
      map: "",
      seeLayer: "",
      view: "",

      gatewayLength: {
        on: 0,
        off: 0,
        unknown: 0,
      },
      mapCenter: [0, 0],
    };
  },
  methods: {
    goBeacon() {
      this.$router.push("/beacon");
    },
    goGateway() {
      this.$router.push("/gateway");
    },

    //初始化地图
    initGatewayMap() {
      this.seeLayer = new TileLayer({
        className: "baseLayerClass",
        source: this.openlayersSource,
      });

      this.view = new View({
        projection: "EPSG:4326",
        center: this.mapCenter,
        zoom: 7,
      });
      setTimeout(() => {
        this.map = new Map({
          target: "gatewayMap",
          layers: [this.seeLayer],
          view: this.view,
        });

        this.map.addControl(new ScaleLine());
        this.mapClick();
        this.addLine(this.map);
        setTimeout(() => {
          this.map.updateSize();
        }, 10);
      }, 0);
    },

    // 系统管理员及企业级管理员
    myEcharts() {
      var that = this;
      //初始化echarts实例
      var projectType = this.$echarts.init(
        document.getElementById("projectType")
      );
      var beacon = this.$echarts.init(document.getElementById("beacon"));
      var beaconPower = this.$echarts.init(
        document.getElementById("beaconPower")
      );
      var gateway = this.$echarts.init(document.getElementById("gateway"));
      var gatewayType = this.$echarts.init(
        document.getElementById("gatewayType")
      );

      //项目
      //项目定位类型
      let project_type_data =
        that.project_type == ""
          ? ""
          : [
              {
                name: this.$t("home.Forward"),
                value: that.project_type.project_pos_type1,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.reverse"),
                value: that.project_type.project_pos_type2,
                url: host.projectUrl,
              },
            ];
      //项目类型
      let project_projectype_data =
        that.project_projectype == ""
          ? ""
          : [
              {
                name: this.$t("home.school"),
                value: that.project_projectype.project_type1,
                url: host.projectUrl,
                itemStyle: { color: "red" },
              },
              {
                name: this.$t("home.hospital"),
                value: that.project_projectype.project_type2,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.OfficeBuilding"),
                value: that.project_projectype.project_type3,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.residencecommunity"),
                value: that.project_projectype.project_type4,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.factory"),
                value: that.project_projectype.project_type5,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.Warehouse"),
                value: that.project_projectype.project_type6,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.beadhouse"),
                value: that.project_projectype.project_type7,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.market"),
                value: that.project_projectype.project_type8,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.Parkinglot"),
                value: that.project_projectype.project_type9,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.constructionsite"),
                value: that.project_projectype.project_type10,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.Tunnel"),
                value: that.project_projectype.project_type11,
                url: host.projectUrl,
              },
              {
                name: this.$t("home.other"),
                value: that.project_projectype.project_type12,
                url: host.projectUrl,
              },
            ];
      for (let i = project_projectype_data.length - 1; i > -1; i--) {
        if (project_projectype_data[i].value == undefined) {
          project_projectype_data.splice(i, 1);
        }
      }
      var projectTypeOption = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
          // formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          x: "right",
        },
        series: [
          //第一环
          {
            // name: "项目数量",
            type: "pie",
            selectedMode: "single",
            center: ["30%", "50%"],
            radius: ["0%", "35%"],
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
            data: project_type_data,
          },
          //第二环
          {
            // name: "项目数量",
            type: "pie",
            radius: ["45%", "60%"],
            center: ["30%", "50%"],

            label: {
              normal: {
                show: false,
                formatter: (params) => {
                  return (
                    params.name +
                    ":" +
                    params.value +
                    "个(" +
                    params.percent.toFixed(1) +
                    "%)"
                  );
                },
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 10,
                lineStyle: {
                  color: "#e6e6e6",
                },
              },
            },
            data: project_projectype_data,
          },
        ],
      };

      // 信标
      let beacon_type_data =
        that.beacon_type == null
          ? ""
          : [
              {
                name: this.$t("home.location"),
                value: that.beacon_type.beacon_position,
                url: host.beaconUrl,
                itemStyle: {
                  color: "#61a0a8",
                },
              },
              {
                name: this.$t("home.assets"),
                value: that.beacon_type.beacon_asset,
                url: host.beaconUrl,
                itemStyle: {
                  color: "#e16215",
                },
              },
              {
                name: this.$t("home.alarm"),
                value: that.beacon_type.beacon_hazardous,
                url: host.beaconUrl,
                itemStyle: {
                  color: "#c23531",
                },
              },
            ];
      let beacon_data1 =
        that.beacon_inallot == null
          ? ""
          : [
              {
                name: this.$t("home.Assigned"),
                value: that.beacon_inallot.inallot_yes,
                url: host.beaconUrl,
                itemStyle: {
                  color: "#6AB0B8",
                },
              },
              {
                name: this.$t("home.Unassigned"),
                value: that.beacon_inallot.inallot_no,
                url: host.beaconUrl,
                itemStyle: {
                  color: "#334B5C",
                },
              },
              {
                name: this.$t("home.Used"),
                value: that.beacon_inuse.inuse_yes,
                url: host.beaconUrl,
                itemStyle: {
                  color: "#9FDABF",
                },
              },
              {
                name: this.$t("home.Unused"),
                value: that.beacon_inuse.inuse_no,
                url: host.beaconUrl,
                itemStyle: {
                  color: "#D48265",
                },
              },
            ];
      let beacon_data2 =
        that.beacon_devtime == null
          ? ""
          : [
              {
                name: this.$t("home.Scanneddays"),
                value: that.beacon_devtime.beacon_low_3day,
                url: host.beaconUrl,
                itemStyle: { color: "#5acc5a" },
              },
              {
                name: this.$t("home.scannedwithin"),
                value: that.beacon_devtime.beacon_more_3day,
                url: host.beaconUrl,
                itemStyle: { color: "red" },
              },
              {
                name: this.$t("home.Neverscanned"),
                value: that.beacon_devtime.beacon_time_unknown,
                url: host.beaconUrl,
              },
            ];
      var beaconOption = {
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b}: {c} ({d}%)",
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          x: "right",
        },
        series: [
          // 第一环
          {
            // name: "信标数量",
            type: "pie",
            // selectedMode: "single",
            center: ["30%", "50%"],
            radius: ["0%", "35%"],
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
            data: beacon_data2,
          },
          //第二环
          {
            // name: "信标数量",
            type: "pie",
            radius: ["45%", "60%"],
            center: ["30%", "50%"],

            label: {
              normal: {
                show: false,
                formatter: (params) => {
                  return (
                    params.name +
                    ":" +
                    params.value +
                    "个(" +
                    params.percent.toFixed(1) +
                    "%)"
                  );
                },
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 10,
                lineStyle: {
                  color: "#e6e6e6",
                },
              },
            },
            data: beacon_data1,
          },
        ],
      };

      //信标电量
      let beacon_bat_data =
        that.beacon_bat == null
          ? ""
          : [
              {
                value: that.beacon_bat.bat_60_100,
                name: ">60%",
                url: host.beaconUrl,
                itemStyle: {
                  color: "#ea9518",
                },
              },
              {
                value: that.beacon_bat.bat_20_60,
                name: ">20%",
                url: host.beaconUrl,
                itemStyle: {
                  color: "#e16531",
                },
              },
              {
                value: that.beacon_bat.bat_0_20,
                name: "<20%",
                url: host.beaconUrl,
                itemStyle: {
                  color: "#d81e06",
                },
              },
            ];
      var beaconPowerOption = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
          // formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          x: "right",
          data: [
            {
              name: this.$t("home.location"),
            },
            {
              name: this.$t("home.assets"),
            },
            {
              name: this.$t("home.alarm"),
            },
            {
              name: ">60%",
              icon: "image://../../../../static/echartsIcon/60.png",
              textStyle: {
                color: "#52ca52",
              },
            },
            {
              name: ">20%",
              icon: "image://../../../../static/echartsIcon/20.png",
              textStyle: {
                color: "#E1D95B",
              },
            },
            {
              name: "<20%",
              icon: "image://../../../../static/echartsIcon/0.png",
              textStyle: {
                color: "#d72a14",
              },
            },
          ],
        },
        series: [
          // 第一环
          {
            // name: "信标数量",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["0%", "35%"],
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
            data: beacon_type_data,
          },
          //第二环
          {
            // name: "信标数量",
            type: "pie",
            radius: ["45%", "60%"],
            label: {
              show: false,
              formatter: (params) => {
                return (
                  params.name +
                  ":" +
                  params.value +
                  "个(" +
                  params.percent.toFixed(1) +
                  "%)"
                );
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 10,
                lineStyle: {
                  color: "#e6e6e6",
                },
              },
            },
            data: beacon_bat_data,
          },
        ],
      };

      // 设备
      let dev_hbstatus_data =
        that.dev_workstate == null
          ? ""
          : [
              {
                name: this.$t("home.normal"),
                value: that.dev_workstate.workstate1,
              },
              {
                name: this.$t("home.fault"),
                value: that.dev_workstate.workstate2,
              },
              {
                name: this.$t("home.Online"),
                value: that.dev_hbstatus.dev_online,
              },
              {
                name: this.$t("home.Offline"),
                value: that.dev_hbstatus.dev_offline,
              },
              {
                name: this.$t("home.NeverOnline"),
                value: that.dev_hbstatus.dev_unknown,
              },
              {
                name: this.$t("home.Used"),
                value: that.dev_inuse.inuse_yes,
              },

              {
                name: this.$t("home.Unused"),
                value: that.dev_inuse.inuse_no,
              },
              {
                name: this.$t("home.Assigned"),
                value: that.dev_inallot.inallot_yes,
              },
              {
                name: this.$t("home.Unassigned"),
                value: that.dev_inallot.inallot_no,
              },
              {
                name: "<20%",
                value: that.dev_bat.bat_0_20,
              },
              {
                name: ">20%",
                value: that.dev_bat.bat_20_60,
              },
              {
                name: ">60%",
                value: that.dev_bat.bat_60_100,
              },
            ];
      for (let i = dev_hbstatus_data.length - 1; i > -1; i--) {
        if (dev_hbstatus_data[i].value == undefined) {
          // dev_hbstatus_data.splice(i, 1);
          dev_hbstatus_data[i].value = 0;
        }
      }
      let dev_hbstatus_xAx = [];
      let dev_hbstatus_yAy = [];
      for (let i = 0; i < dev_hbstatus_data.length; i++) {
        dev_hbstatus_xAx.push(dev_hbstatus_data[i].name);
        dev_hbstatus_yAy.push(dev_hbstatus_data[i].value);
      }
      var gatewayOption;
      if (dev_hbstatus_xAx == [] && dev_hbstatus_yAy == []) {
        gatewayOption = {};
      } else {
        gatewayOption = {
          aria: {
            enabled: true,
            decal: {
              show: true,
            },
          },
          tooltip: {},
          xAxis: {
            data: dev_hbstatus_xAx,
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
          },
          legend: {
            show: true,
          },
          series: [
            {
              // name: "设备数量",
              type: "bar",
              // label: {
              //   show: true,
              //   position: "insideTop",
              // },
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorList = [
                      ["#52ca52"],
                      ["#d72a14"],
                      ["#52ca52"],
                      ["#d72a14"],
                      ["#d72a14"],
                      ["#52ca52"],
                      ["#d72a14"],
                      ["#52ca52"],
                      ["#d72a14"],
                      ["#d72a14"],
                      ["#E1D95B"],
                      ["#52ca52"],
                    ];
                    return colorList[params.dataIndex];
                  },
                },
              },
              barCategoryGap: "60%",
              data: dev_hbstatus_yAy,
            },
          ],
        };
      }

      // 设备类型
      let dev_type_data =
        that.dev_type == null
          ? ""
          : [
              {
                name: this.$t("home.gateway"),
                value: that.dev_type.dev_gateway,
                url: host.terminalUrl,
              },
              {
                name: this.$t("home.Jobcard"),
                value: that.dev_type.dev_badge,
                url: host.terminalUrl,
              },

              {
                name: this.$t("home.vehicledevice"),
                value: that.dev_type.dev_tbox,
                url: host.terminalUrl,
              },
            ];
      let dev_custom_data =
        that.dev_custom == null
          ? ""
          : [
              {
                name: this.$t("home.systemdevice"),
                value: that.dev_custom.dev_custom_yes,
                url: host.terminalUrl,
              },
              {
                name: this.$t("home.Nonsystemdevice"),
                value: that.dev_custom.dev_custom_no,
                url: host.terminalUrl,
              },
            ];
      var gatewayTypeOption = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          // show: true,
          // type: "plain",
          orient: "vertical",
          x: "right",
        },
        series: [
          //第一环
          {
            type: "pie",
            selectedMode: "single",
            radius: ["0%", "35%"],
            center: ["30%", "50%"],
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
            data: dev_custom_data,
          },
          //第二环
          {
            type: "pie",
            radius: ["45%", "60%"],
            center: ["30%", "50%"],

            label: {
              normal: {
                show: false,
                formatter: (params) => {
                  return (
                    params.name +
                    ":" +
                    params.value +
                    "个(" +
                    params.percent.toFixed(1) +
                    "%)"
                  );
                },
              },
              rich: {
                a: {
                  color: "#999",
                  lineHeight: 22,
                  align: "center",
                },
                hr: {
                  borderColor: "#aaa",
                  width: "100%",
                  borderWidth: 0.5,
                  height: 0,
                },
                b: { fontSize: 16, lineHeight: 33 },
                per: {
                  color: "#eee",
                  backgroundColor: "#334455",
                  padding: [2, 4],
                  borderRadius: 2,
                },
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 10,
                lineStyle: {
                  color: "#e6e6e6",
                },
              },
            },
            data: dev_type_data,
          },
        ],
      };
      gateway.setOption(gatewayOption);
      gateway.on("click", function (param) {
        switch (param.name) {
          case that.$t("home.normal"):
            window.location.href = host.terminalUrl + "?workstate=1";
            break;
          case that.$t("home.fault"):
            window.location.href = host.terminalUrl + "?workstate=2";
            break;
          case that.$t("home.Online"):
            window.location.href = host.terminalUrl + "?hbstatus=1";
            break;
          case that.$t("home.Offline"):
            window.location.href = host.terminalUrl + "?hbstatus=2";
            break;
          case that.$t("home.NeverOnline"):
            window.location.href = host.terminalUrl + "?hbstatus=3";
            break;
          case that.$t("home.Used"):
            window.location.href = host.terminalUrl + "?inuse=1";
            break;
          case that.$t("home.Unused"):
            window.location.href = host.terminalUrl + "?inuse=2";
            break;
          case that.$t("home.Assigned"):
            window.location.href = host.terminalUrl + "?inallot=1";
            break;
          case that.$t("home.Unassigned"):
            window.location.href = host.terminalUrl + "?inallot=2";
            break;
          case "<20%":
            window.location.href = host.terminalUrl + "?batterys=3";
            break;
          case ">20%":
            window.location.href = host.terminalUrl + "?batterys=2";
            break;
          case ">60%":
            window.location.href = host.terminalUrl + "?batterys=1";
            break;
        }
      });
      gatewayType.setOption(gatewayTypeOption);
      gatewayType.on("click", function (param) {
        switch (param.data.name) {
          case that.$t("home.systemdevice"):
            window.location.href = param.data.url + "?custom=1";
            break;
          case that.$t("home.Nonsystemdevice"):
            window.location.href = param.data.url + "?custom=2";
            break;
          case that.$t("home.gateway"):
            window.location.href = param.data.url + "?devtype=2";
            break;
          case that.$t("home.vehicledevice"):
            window.location.href = param.data.url + "?devtype=3";
            break;
          case that.$t("home.Jobcard"):
            window.location.href = param.data.url + "?devtype=1";
            break;
          // case that.$t("home.Jobcardgateway"):
          //   window.location.href = param.data.url + "?devtype=1&type=2";
          //   break;
          default:
            break;
        }
      });
      projectType.setOption(projectTypeOption);
      projectType.on("click", function (param) {
        if (
          that.$store.state.userInfo.prionum == 1 ||
          that.$store.state.userInfo.prionum == 2
        ) {
          return;
        }
        switch (param.data.name) {
          case that.$t("home.Forward"):
            window.location.href = param.data.url + "?type=1";
            break;
          case that.$t("home.reverse"):
            window.location.href = param.data.url + "?type=2";
            break;
          case that.$t("home.school"):
            window.location.href = param.data.url + "?projectype=1";
            break;
          case that.$t("home.hospital"):
            window.location.href = param.data.url + "?projectype=2";
            break;
          case that.$t("home.OfficeBuilding"):
            window.location.href = param.data.url + "?projectype=3";
            break;
          case that.$t("home.residencecommunity"):
            window.location.href = param.data.url + "?projectype=4";
            break;
          case that.$t("home.factory"):
            window.location.href = param.data.url + "?projectype=5";
            break;
          case that.$t("home.Warehouse"):
            window.location.href = param.data.url + "?projectype=6";
            break;
          case that.$t("home.beadhouse"):
            window.location.href = param.data.url + "?projectype=7";
            break;
          case that.$t("home.market"):
            window.location.href = param.data.url + "?projectype=8";
            break;
          case that.$t("home.Parkinglot"):
            window.location.href = param.data.url + "?projectype=9";
            break;
          case that.$t("home.constructionsite"):
            window.location.href = param.data.url + "?projectype=10";
            break;
          case that.$t("home.Tunnel"):
            window.location.href = param.data.url + "?projectype=11";
            break;
          case that.$t("home.other"):
            window.location.href = param.data.url + "?projectype=12";
            break;
          default:
            break;
        }
      });
      beacon.setOption(beaconOption);
      beacon.on("click", function (param) {
        switch (param.data.name) {
          case that.$t("home.Assigned"):
            window.location.href = param.data.url + "?inallot=1";
            break;
          case that.$t("home.Unassigned"):
            window.location.href = param.data.url + "?inallot=2";
            break;
          case that.$t("home.Used"):
            window.location.href = param.data.url + "?inuse=1";
            break;
          case that.$t("home.Unused"):
            window.location.href = param.data.url + "?inuse=2";
            break;
          case that.$t("home.Scanneddays"):
            window.location.href = param.data.url + "?devtimes=1";
            break;
          case that.$t("home.scannedwithin"):
            window.location.href = param.data.url + "?devtimes=2";
            break;
          case that.$t("home.Neverscanned"):
            window.location.href = param.data.url + "?devtimes=3";
            break;
          default:
            break;
        }
      });
      beaconPower.setOption(beaconPowerOption);
      beaconPower.on("click", function (param) {
        switch (param.data.name) {
          case that.$t("home.location"):
            window.location.href = param.data.url + "?type=1";
            break;
          case that.$t("home.assets"):
            window.location.href = param.data.url + "?type=3";
            break;
          case that.$t("home.alarm"):
            window.location.href = param.data.url + "?type=2";
            break;
          case ">60%":
            window.location.href = param.data.url + "?batterys=1";
            break;
          case ">20%":
            window.location.href = param.data.url + "?batterys=2";
            break;
          case "<20%":
            window.location.href = param.data.url + "?batterys=3";
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
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        data = {
          tenantid: "",
          timezone: 0 - new Date().getTimezoneOffset() / 60,
        };
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        data = {
          tenantid: this.$store.state.userInfo.tenantid,
          timezone: 0 - new Date().getTimezoneOffset() / 60,
        };
      } else if (this.contrForPrionum == 5) {
        data = {
          projectid: value,
          timezone: 0 - new Date().getTimezoneOffset() / 60,
        };
      }
      getFristPageAdmin(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.beacon_bat = res.data.beaconBatTimeNum;
          if (
            res.data.beaconBatTimeNum.bat_0_20 == 0 &&
            res.data.beaconBatTimeNum.bat_20_60 == 0 &&
            res.data.beaconBatTimeNum.bat_60_100 == 0 &&
            res.data.beaconBatTimeNum.bat_unknown == 0
          ) {
            that.beacon_bat = null;
          }
          that.beacon_inallot = res.data.beaconTypeNum;
          that.beacon_inuse = res.data.beaconTypeNum;
          that.beacon_type = res.data.beaconTypeNum;
          that.dev_bat = res.data.devBatTimeNum;
          that.dev_hbstatus = res.data.devTypeNum;
          that.dev_workstate = res.data.devTypeNum;
          that.dev_inallot = res.data.devTypeNum;
          that.dev_inuse = res.data.devTypeNum;
          that.dev_type = res.data.devTypeNum;
          that.dev_custom = res.data.devTypeNum;
          if (res.data.projectTypeNum) {
            that.project_projectype = res.data.projectTypeNum;
          }
          if (res.data.projectTypeNum) {
            that.project_type = res.data.projectTypeNum;
          }
          // that.gw_hbstatus = res.data.gw_hbstatus;
          that.beacon_devtime = res.data.beaconBatTimeNum;
          if (
            res.data.beaconBatTimeNum.beacon_low_3day == 0 &&
            res.data.beaconBatTimeNum.beacon_more_3day == 0 &&
            res.data.beaconBatTimeNum.beacon_time_unknown == 0
          ) {
            that.beacon_devtime = null;
          }
          if (
            that.contrForPrionum == 1 ||
            that.contrForPrionum == 2 ||
            that.contrForPrionum == 3 ||
            that.contrForPrionum == 4
          ) {
            that.myEcharts();
          }
        }
      });
    },

    // 描线（南海）
    addLine(map) {
      var style = new Style({
        stroke: new Stroke({
          color: "#AA8DC6",
          // AA8DC6
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
          // color: [170, 141, 198, 1],
          lineDash: [2, 7],
        }),
      });
      function getAnimationStrokeStyle() {
        return new Style({
          stroke: new Stroke({
            // color: [170, 141, 198, 1],
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

    //获取所有的基站位置信息
    getGwActiveInfos() {
      var that = this;
      let data = {};
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        data = {};
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        data = {
          tenantid: this.$store.state.userInfo.tenantid,
        };
      }
      getGatewayList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.setCluster(that.map, res.data.list);
          that.allGwData = res.data.list;
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].lastx && res.data.list[i].lasty) {
              that.mapCenter = [res.data.list[i].lastx, res.data.list[i].lasty];
              if (that.map) {
                that.map
                  .getView()
                  .setCenter(
                    [res.data.list[i].lastx, res.data.list[i].lasty],
                    "EPSG:4326"
                  );
              }

              return;
            }
          }
        }
      });
    },
    //设置聚合
    setCluster(map, mapInfo) {
      var that = this;
      //创建要素数量
      this.clusterFeatures = [];
      let dateNow = new Date().getTime();
      let gatewayLength = {
        on: 0,
        off: 0,
        unknown: 0,
      };
      for (let i = 0; i < mapInfo.length; i++) {
        let coordinates = [mapInfo[i].lastx, mapInfo[i].lasty];
        let src;
        if (mapInfo[i].hbstatus == 3) {
          src = "../../../static/basenull.png";
          gatewayLength.unknown += 1;
        } else if (mapInfo[i].hbstatus == 1) {
          src = "../../../static/baseon.png";
          gatewayLength.on += 1;
        } else if (mapInfo[i].hbstatus == 2) {
          src = "../../../static/baseoff.png";
          gatewayLength.off += 1;
        }
        //新建点要素
        that.clusterFeatures[i] = new OlFeature({
          longitude: mapInfo[i].lastx,
          latitude: mapInfo[i].lasty,
          src: src, //图标路径
          deveui: mapInfo[i].deveui,
          geometry: new OlGeomPoint(coordinates),
        });
      }
      //设置基站数量
      this.gatewayLength = gatewayLength;
      //初始化矢量数据源
      this.clusterSource = new OlSourceVector({
        features: that.clusterFeatures,
      });

      //初始化聚合标注数据源
      this.clusterSources = new Cluster({
        distance: 60, //两个图标之间距离小于此值，就会聚合
        source: that.clusterSource,
      });

      //加载聚合标注的矢量图层
      this.styleCache = {};
      this.layerVetor = new OlLayerVector({
        source: that.clusterSources,
        style: function (feature) {
          var size = feature.get("features").length;
          var style = that.styleCache[size];
          if (size > 1) {
            //聚合时的样式
            style = [
              new OlStyleStyle({
                // image: new OlStyleIcon({
                //   anchor: [0.2, 1],
                //   src: "../../../static/bases.png",
                //   scale: 1,
                // }),
                // image: new CircleStyle({
                //   radius: 14,
                //   stroke: new Stroke({
                //     color: "#fff",
                //   }),
                //   fill: new Fill({
                //     color: "#3399cc",
                //   }),
                // }),

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
            that.styleCache[size] = style;
          } else {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: feature.values_.features[0].values_.src,
                scale: 1,
              }),
              // 设置图片下面显示字体的样式和内容
              text: new Text({
                text: "", // 添加文字描述
                font: "12px font-size", // 设置字体大小
                fill: new Fill({
                  // 设置字体颜色
                  color: "white",
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

    //地图上的点击事件
    mapClick() {
      var that = this;
      var coodinate;
      this.map.on("click", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            coodinate = evt.coordinate;
            return feature;
          }
        );
        if (feature) {
          if (feature.getProperties().features) {
            if (feature.getProperties().features.length == 1) {
              let data = {
                deveui: feature.getProperties().features[0].values_.deveui,
                tenantid: that.tenantid_A,
              };
              //单击获取需要显示的内容
              for (let i = 0; i < that.allGwData.length; i++) {
                if (
                  feature.getProperties().features[0].values_.deveui ==
                  that.allGwData[i].deveui
                ) {
                  that.deveuiNum = that.allGwData[i].deveui;
                  that.startAt = that.formatTime(that.allGwData[i].firsttime);
                  that.lastAt = that.formatTime(that.allGwData[i].statustime);
                  that.projectname = that.allGwData[i].projectname;
                  that.customername = that.allGwData[i].customername;
                }
              }

              $("#popup").css("display", "block");
              var container = document.getElementById("popup"); //最外层包含所有元素的div
              var overlay = new Overlay({
                //设置弹出框的容器
                element: container,
                //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
                autoPan: true,
              });
              overlay.setPosition(coodinate);
              that.map.addOverlay(overlay);
              $("#popup-closer").on("click", function (event) {
                event.preventDefault();
                overlay.setPosition(undefined);
              }); // 点击关闭的按钮
            }
          }
        }
      });
    },
    //时间转换
    formatTime(tiem) {
      if (tiem == null || tiem == 0) {
        return "";
      }
      let date = new Date(parseInt(tiem) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
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
  },
  beforeMount() {
    if (this.$store.state.i18n == "zh") {
      this.mapCenter = [118, 32];
      // 说明：瓦片地址改为读取环境变量
      this.openlayersSource = new OSM({
        url: process.env.VUE_APP_TILE_URL_TEMPLATE,
        crossOrigin: "",
      });
    } else {
      this.mapCenter = [0.1, 51.3];
      this.openlayersSource = new OSM();
    }
  },
  mounted() {
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2 ||
      this.$store.state.userInfo.prionum == 3 ||
      this.$store.state.userInfo.prionum == 4
    ) {
      this.getFristPages();
      this.initGatewayMap();
      this.getGwActiveInfos();
    }
  },
  computed: {
    longis() {
      return this.$store.state.longis;
    },
    latis() {
      return this.$store.state.latis;
    },
  },

  watch: {
    //监听vuex中projectid的变化

    "$i18n.locale"() {
      this.myEcharts();
    },
  },
};
</script>

<style scoped>
.home {
  height: 100%;
  margin-right: calc(100% - 100vw);
}

.menu_header {
  position: relative;
}

.asi {
  position: absolute;
  top: 50px;
  width: 99%;
}

.box-card span {
  cursor: pointer;
}

#beacon,
#beaconPower,
#projectType,
#gatewayType,
#gateway {
  height: 300px;
}

/* 地图 */
.mapConent {
  width: 56%;
  position: relative;
}

.mapConent .tips {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  background-color: rgba(134, 153, 175, 0.7);
  padding: 4px;
  border-radius: 4px;
}

.mapConent .tips .item {
  display: flex;
  margin-right: 0;
  align-items: center;
  font-size: 10px;
  color: #fff;
  padding: 1px 0 1px 0;
}

.mapConent .tips .item .color {
  padding: 2px 6px 2px 6px;
  border-radius: 2px;
  margin-left: 6px;
  font-size: 8px;
}

/* .tips .textwrapper {
 text-align: right;
}
.tips .colorwrapper .color1{
 width: 18px;
 height: 10px;
 border-radius: 2px;
 background-color: #fff;
 margin: 6px 0;
} */
#gatewayMap {
  position: relative;
  height: 100%;
  width: 100%;
}
#gatewayMap >>> .baseLayerClass {
  filter: grayscale(100%) sepia(51%) invert(100%) saturate(350%);
}
#popup {
  /* height: 300px; */
  display: none;
}

#popup-content {
  background: #fff;
  padding: 3px 10px 3px 10px;
}

.divider {
  margin: 5px 0 !important;
}

#popup-content li {
  list-style: none;
  text-align: left;
}

#popup-content li:first-of-type {
  margin-top: 10px;
}

#popup-content li:last-of-type {
  margin-bottom: 5px;
}

.ol-popup-closer {
  position: absolute;
  top: 0px;
  right: 8px;
}

.ol-popup-closer:after {
  /* content: "x";
  color: red; */
}

a {
  text-decoration: none;
}

#userBeacon,
#userGateway {
  height: 200px;
}

.userHome {
  display: flex;
}

.maps {
  width: 65%;
  margin-left: 1%;
  position: relative;
}

.maps .tips {
  position: absolute;
  right: 20px;
  top: 10px;
  display: flex;
  flex-direction: column;
  background-color: rgba(134, 153, 175, 0.7);
  padding: 4px 10px 4px 10px;
  border-radius: 4px;
}

.maps .tips .item {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #fff;
  margin-left: 0;
  cursor: pointer;
}

.maps .tips .item .color {
  margin-left: 6px;
}

.select .el-dialog__body {
  padding-bottom: 30px;
}

/*项目选择 */
.project-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  transform: translateX(0.2vw);
}

.project-item {
  margin: 0;
  position: relative;
  z-index: 1;
  width: 11.2vw;
  padding-bottom: 20px;
  z-index: 0;
  transition: all 0.3s;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5vw;
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
  margin-top: 14px;
  justify-self: start;
}

.item-info .key {
  display: flex;
  flex-direction: column;
  color: #8c8c8c;
  margin-right: 10px;
  margin-left: 10px;
  white-space: nowrap;
}

.item-info .key span {
  margin-left: 0;
  margin-top: 4px;
}

.item-info .value {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.item-info .value span {
  margin-left: 0;
  margin-top: 4px;
  color: #2d2d2d;
  text-align: left;
}

/* 大屏 */
</style>
