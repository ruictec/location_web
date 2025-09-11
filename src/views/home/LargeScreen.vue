<template>
  <div class="LargeScreen" id="content">
    <div class="header">
      <span>{{ current }}</span>
      <div class="rct">
        {{ $store.state.intoProjectName }}
      </div>
      <div class="return" @click="brk">返回</div>
    </div>
    <div id="mapback"></div>
    <div class="frameBox">
      <div class="bottom">
        <div class="frame1">
          <div class="frame1_box">
            <!-- 楼栋/楼层 人员 资产 告警 -->
            <div class="floorlist">
              <p class="topline"></p>
              <p class="floorlistTop">
                <span>总人数：{{ totalpeople }}</span>
                <span>告警数：{{ totalalarm }}</span>
                <span>更新时间：{{ currentTable }}</span>
              </p>
              <div class="ultitle">
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  :row-class-name="tableRowClassName"
                >
                  <el-table-column
                    prop="name"
                    label="楼栋/楼层"
                    width="120"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="devnum"
                    label="人员"
                    align="center"
                    :formatter="devNum"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="assetnum"
                    label="资产"
                    align="center"
                    :formatter="assetNum"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="alarmnum"
                    label="告警"
                    align="center"
                    :formatter="alarmNum"
                  >
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="all_num">
              <div class="indoor">
                <div>
                  <img src="../../../static/室内.png" alt="" srcset="" />
                  <p class="title">室内</p>
                </div>
                <div class="num_box">
                  <img src="../../../static/人数.png" alt="" srcset="" />
                  <p>室内人数</p>
                  <p class="num">{{ member_indoor_num }}</p>
                </div>
                <div class="num_box">
                  <img src="../../../static/资产.png" alt="" srcset="" />
                  <p>室内资产</p>
                  <p class="num">{{ asset_indoor_num }}</p>
                </div>
                <div class="num_box">
                  <img src="../../../static/车辆.png" alt="" srcset="" />
                  <p>室内车辆</p>
                  <p class="num">{{ tbox_indoor_num }}</p>
                </div>
              </div>
              <div class="outdoor">
                <div>
                  <img src="../../../static/室外.png" alt="" srcset="" />
                  <p class="title">室外</p>
                </div>
                <div class="num_box">
                  <img src="../../../static/人数.png" alt="" srcset="" />
                  <p>室外人数</p>
                  <p class="num">{{ member_outdoor_num }}</p>
                </div>
                <div class="num_box">
                  <img src="../../../static/资产.png" alt="" srcset="" />
                  <p>室外资产</p>
                  <p class="num">{{ asset_outdoor_num }}</p>
                </div>
                <div class="num_box">
                  <img src="../../../static/车辆.png" alt="" srcset="" />
                  <p>室外车辆</p>
                  <p class="num">{{ tbox_outdoor_num }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- 人数最多的楼栋/楼层 -->
          <div class="mostpeople">
            <div class="most1">
              <p class="most_title">人数最多的楼栋</p>
              <p class="most_floor">
                {{ maxbuild ? maxbuild.building : "暂无数据" }}
              </p>
              <p class="realTime">
                实时数据&nbsp;人数：{{ maxbuild ? maxbuild.num : "暂无数据" }}
              </p>
              <div class="imgBox">
                <img src="../../../public/image/screen/png/楼栋.png" alt="" />
              </div>
            </div>
            <div class="most2">
              <p class="most_title">人数最多的楼层</p>
              <p class="most_floor">
                {{ maxbuild ? maxbuild.building : "暂无数据" }}/{{
                  maxground ? maxground.groundname : "暂无数据"
                }}
              </p>
              <p class="realTime">
                实时数据&nbsp;人数：{{ maxground ? maxbuild.num : "暂无数据" }}
              </p>
              <div class="imgBox">
                <img src="../../../public/image/screen/png/楼层.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="frame2">
          <div class="middle">
            <!-- 警告类型 -->
            <div class="middle_left">
              <p class="title">
                <img
                  src="../../../public/image/screen/png/jinggao.png"
                  alt=""
                />
                <span>警告类型</span>
              </p>
              <div class="flexCol">
                <ul class="middle_left_ul">
                  <li>警告类型</li>
                  <li>未解除</li>
                  <li>已解除</li>
                </ul>
                <ul class="alarmUl">
                  <li class="alarmLi" v-for="(item, i) in alarmData" :key="i">
                    <span>{{ item.typestr }}</span>
                    <span>{{ item.warn_status1_num }}</span>
                    <span>{{ item.warn_status2_num }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 信标状态 -->
            <div class="middle_right">
              <p class="title">
                <img src="../../../public/image/screen/png/信标.png" alt="" />
                <span>信标状态</span>
              </p>
              <div id="Column"></div>
            </div>
          </div>
        </div>
        <div class="frame3">
          <!-- 人员 资产 车辆 -->
          <div class="property">
            <p class="title">
              <img src="../../../public/image/screen/png/人员资产.png" alt="" />
              <span>人员/资产/车辆</span>
            </p>
            <div class="totalBox">
              <div id="total1"></div>
              <div id="total2"></div>
              <div id="total3"></div>
            </div>
            <ul class="totalText">
              <li>总数：{{ total.asset || 0 }}</li>
              <li>总数：{{ total.vehicle || 0 }}</li>
              <li>总数：{{ total.people || 0 }}</li>
            </ul>
            <ul class="foreBox">
              <li class="foreBox_li">
                <span>设备总数</span>
                <div>
                  {{
                    devTypeNum.dev_online +
                      devTypeNum.dev_offline +
                      devTypeNum.dev_unknown || 0
                  }}
                </div>
              </li>
              <li class="foreBox_li">
                <span>在线设备</span>
                <div>{{ devTypeNum.dev_online || 0 }}</div>
              </li>
              <li class="foreBox_li">
                <span>离线设备</span>
                <div>{{ devTypeNum.dev_offline || 0 }}</div>
              </li>
              <li class="foreBox_li">
                <span>从未上线设备</span>
                <div>{{ devTypeNum.dev_unknown || 0 }}</div>
              </li>
            </ul>
          </div>
          <!-- 设备状态 -->
          <div class="state">
            <div class="title">
              <div class="imgs"></div>
              <span>设备状态</span>
            </div>
            <div id="pieEcharts"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import screenfull from "screenfull";
import {
  getFristPageUserDevUtil,
  getFristPageUserMapUtil,
  getBuildingByProjectid,getFenceManageAndPointList
} from "../../axios/api";
//地图
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlSourceVector from "ol/source/Vector";
import OlLayerVector from "ol/layer/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import * as echarts from "echarts";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom"; //鼠标双击放大
import DragPan from "ol/interaction/DragPan";
import MouseWheelZoom from "ol/interaction/MouseWheelZoom";
import "echarts/theme/macarons.js";
// 描线
import { Stroke, Style } from "ol/style";
import { LineString, Polygon } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";
//地图控件
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";

export default {
  name: "largescreen",
  data() {
    return {
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight, //实时屏幕高度
      timezone: this.$store.state.intoProjectTimezone,
      attenFlag: this.$store.state.functionParts.attenFlag,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      asset: this.$store.state.functionParts.asset,
      contrForPrionum: this.$store.state.userInfo.prionum,
      employee: this.$store.state.functionParts.employee,
      tbox: this.$store.state.functionParts.tbox,
      zoom: this.$store.state.mapZoom,
      longi: this.$store.state.longis,
      lati: this.$store.state.latis,
      mapCenter: [118.8, 32],
      screenWidth: document.body.clientWidth, // 屏幕宽度
      timer: false,
      timerMap: null,
      getMap: true,
      current: "", //当前时间
      currentTable: "", //表格更新时间
      devBatTimeNum: {},
      deviceData: {},
      devTypeNum: {},

      member_indoor_num: 0,
      member_outdoor_num: 0,
      tbox_indoor_num: 0,
      tbox_outdoor_num: 0,
      asset_indoor_num: 0,
      asset_outdoor_num: 0,
      alarmData: [], //警告类型data
      stateData: [], //信标状态data
      memberNum: {}, //占比
      maxbuild: {}, //人数最多的楼栋
      maxground: {}, //人数最多的楼层
      totalpeople: "", // 楼栋楼层总人数
      totalalarm: "", // 总告警数
      total: {
        asset: "",
        vehicle: "",
        people: "",
      },
      tableData: [],
      // 地图
      map: "",
      seeLayer: "",
      view: "",
      clusterSource: "", //用户地图聚合标注源
      layerVetor: "", //用户地图矢量图层
      openlayersSource: "",
      mapInfos: "",
      floor: [],
      largest: [], // 人数最多的楼栋
      devnumList: {
        blenum: 0,
        gpsnum: 0,
      },
      timers: null,
      AllFences: [],
      vectorSource: null,
      fences:[]
    };
  },
  watch: {
    screenWidth(val) {
      // 为了避免频繁触发resize
      if (!this.timer) {
        // 监听screenWidth的值改变，就重新赋值
        this.screenWidth = val;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          // 操作
          that.setColumn1();
          that.setColumn2();
          that.setColumn3();
          that.setPie();
          that.setCylinder();
          that.timer = false;
        }, 500);
      }
    },
  },
  mounted() {
    this.getTime();
    if (this.$store.state.i18n == "zh") {
      // 说明：瓦片地址改为读取环境变量，默认保持当前地址
      this.openlayersSource = new OSM({
        url: process.env.VUE_APP_TILE_URL_TEMPLATE,
        crossOrigin: "",
      });
    } else {
      this.openlayersSource = new OSM();
    }

    this.$nextTick(() => {
      this.getReport(); //警告类型
      this.getState(); //信标状态
      this.getBuildingByProjectids(this.$store.state.projectid);
      this.timers = setInterval(() => {
        this.getReport(); //警告类型
        this.getState(); //信标状态
        this.getBuildingByProjectids(this.$store.state.projectid);
      }, 15000);
    });
    this.btnClick(); //刚进页面进入大屏

    this.escape();
    window.onresize = () => {
      //控制Echarts的缩放渲染
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    let ulscrollsArray = Array.from(document.querySelectorAll(".ultitle"));
    if (ulscrollsArray.length > 7) {
      ulscrollsArray.style.overflowY = "none";
    }
  },
  
  beforeDestroy() {
    clearInterval(this.timers);
    this.timers = null;
  },
  methods: {
    //获取楼栋信息
    getBuildingByProjectids(val) {
      var that = this;
      let data = {
        projectid: val,
      };
      getBuildingByProjectid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.mapInfos = res.data;
          if (that.map) {
            that.updateMap(that.map, that.mapInfos);
          } else {
            that.initUserMap();
          }
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.type == "building") {
        return "threeD-row";
      } else {
        return "";
      }
    },
    getTime() {
      //获取当前时间
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      this.current = `${year}-${month}-${date}`;
    },
    brk() {
      //返回到首页
      this.$router.push("/dashboard");
      this.$store.state.largeScreen
        ? this.$store.commit("changeWarningDialog", true)
        : this.$store.commit("changeWarningDialog", false);
    },
    updateMap(map, info) {
      var that = this;
      let LayerArrays = map.getLayers().getArray();
      for (let i = 1; i < LayerArrays.length; i++) {
        info.forEach((item) => {
          if (
            item.building ==
            LayerArrays[i].getSource().getFeatures()[0].values_.building
          ) {
            var text,
              devnum = item.devnum ? item.devnum + that.$t("homepage.P") : "",
              assetnum = item.assetnum
                ? item.assetnum + that.$t("homepage.A")
                : "",
              tboxnum = item.tboxnum
                ? item.tboxnum + that.$t("homepage.C")
                : "";
            if (devnum == "" && assetnum == "" && tboxnum == "") {
              text = item.building;
            } else {
              if (devnum && assetnum) {
                devnum = devnum + ",";
              }
              if (assetnum && tboxnum) {
                assetnum = assetnum + ",";
              }
              text = item.building + "/" + devnum + assetnum + tboxnum;
            }
            LayerArrays[i].getSource().getFeatures()[0].values_.devnum =
              item.devnum;
            LayerArrays[i].getSource().getFeatures()[0].values_.assetnum =
              item.assetnum;
            LayerArrays[i].getSource().getFeatures()[0].values_.tboxnum =
              item.tboxnum;
            LayerArrays[i]
              .getSource()
              .getFeatures()[0]
              .setStyle(
                new OlStyleStyle({
                  image: new OlStyleIcon({
                    anchor: [0.5, 1],
                    src: "../../../static/坐标.png",
                    scale: 1,
                  }),
                  //设置图片下面显示的字体样式和内容
                  text: new Text({
                    text: text,
                    font: "14px font-size",
                    fill: new Fill({
                      color:
                        item.devnum == 0 &&
                        item.assetnum == 0 &&
                        (item.tboxnum == 0 || item.tboxnum == null)
                          ? "white"
                          : "red",
                      backgroundColor: "white",
                    }),
                    offsetY: 10, //文字偏移量
                  }),
                })
              );
          }
        });
      }
    },
    initUserMap() {
      var that = this;

      that.vectorSource = new VectorSource();
      this.seeLayer = [
        new TileLayer({
          className: "baseLayerClass",
          source: that.openlayersSource,
        }),
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
          zoom: 14,
        });
      }
      setTimeout(() => {
        that.map = new Map({
          target: "mapback",
          layers: that.seeLayer,
          view: that.view,
          controls: defaultControls({
            zoom: false,
            rotate: false,
            attribution: false,
          }).extend([]),
        });
        that.map.getInteractions().forEach(function (interaction) {
          if (interaction instanceof DragPan) {
            interaction.setActive(false); // 禁止鼠标拖动
          } else if (interaction instanceof MouseWheelZoom) {
            interaction.setActive(false); // 禁止鼠标缩放
          } else if (interaction instanceof DoubleClickZoom) {
            interaction.setActive(false); // 禁止鼠标双击放大
          }
        });
        that.addLine(that.map);
        if (that.mapInfos.length > 0) {
          for (let i = 0; i < that.mapInfos.length; i++) {
            that.addIconMarkers(that.map, that.mapInfos[i]);
          }
        }
        that.showAllFence().then(() => {
          that.recreateFences();
        });
      }, 0);
    },
    recreateFences() {
      this.vectorSource.clear();
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
              text: String(fenceData.num) + "人",
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
        .setText(String(newNumber) + "人");

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
    addIconMarkers(map, info) {
      var that = this;

      const mercatorCoord = fromLonLat([info.longi, info.lati]);
      var startMarker = new OlFeature({
        x: info.longi,
        y: info.lati,
        building: info.building,
        id: info.id,
        devnum: info.devnum,
        assetnum: info.assetnum,
        tboxnum: info.tboxnum,
        src: info.src,
        geometry: new OlGeomPoint(mercatorCoord),
      });
      var source = new OlSourceVector({
        features: [startMarker],
      });

      var style;
      var text,
        devnum = info.devnum ? info.devnum + that.$t("homepage.P") : "",
        assetnum = info.assetnum ? info.assetnum + that.$t("homepage.A") : "",
        tboxnum = info.tboxnum ? info.tboxnum + that.$t("homepage.C") : "";
      if (devnum == "" && assetnum == "" && tboxnum == "") {
        text = info.building;
      } else {
        if (devnum && assetnum) {
          devnum = devnum + ",";
        }
        if (assetnum && tboxnum) {
          assetnum = assetnum + ",";
        }
        text = info.building + "/" + devnum + assetnum + tboxnum;
      }
      style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/坐标.png",
          scale: 1,
        }),
        //设置图片下面显示的字体样式和内容
        text: new Text({
          text: text,
          font: "14px font-size",
          fill: new Fill({
            color:
              info.devnum == 0 &&
              info.assetnum == 0 &&
              (info.tboxnum == 0 || info.tboxnum == null)
                ? "white"
                : "red",
            backgroundColor: "white",
          }),
          offsetY: 10, //文字偏移量
        }),
      });
      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
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
    //在线资产占比
    setColumn1() {
      var ColumnEcharts1 = this.$echarts.init(
        document.getElementById("total1")
      );
      this.memberNum.asset_online_num = this.asset
        ? this.memberNum.asset_online_num
        : 0;
      this.memberNum.asset_sum_num = this.asset
        ? this.memberNum.asset_sum_num
        : 0;
      let P =
        this.memberNum.asset_sum_num == 0
          ? 0
          : (
              (this.memberNum.asset_online_num / this.memberNum.asset_sum_num) *
              100
            ).toFixed(2);
      this.total.asset =
        this.memberNum.asset_offline_num + this.memberNum.asset_online_num;

      let assets = [Number(P)];
      var ColumnOption1 = {
        tooltip: {
          //悬浮框
          trigger: "item",
        },
        title: [
          {
            text: "在线资产占比",
            x: "center",
            top: "50%",
            textStyle: {
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: "100",
            },
          },
          {
            text: assets + "%",
            x: "center",
            y: "35%",
            textStyle: {
              fontSize: 14,
              color: "#FFFFFF",
              fontFamily: "DINAlternate-Bold, DINAlternate",
              foontWeight: "600",
            },
          },
        ],
        backgroundColor: "transparent",
        polar: {
          //大小
          radius: ["80%", "60%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            roundCap: true,
            barWidth: 30,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, .3)",
            },
            data: assets,
            coordinateSystem: "polar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "#16CEB9",
                  },
                  {
                    offset: 1,
                    color: "#6648FF",
                  },
                ]),
              },
            },
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["55%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 3,
              borderColor: "#5269EE",
            },
            data: [100],
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["45%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 1,
              borderColor: "#5269EE",
            },
            data: [100],
          },
        ],
      };

      ColumnEcharts1.setOption(ColumnOption1);

      ColumnEcharts1.resize();
    },
    // 在线车辆占比
    setColumn2() {
      var ColumnEcharts2 = this.$echarts.init(
        document.getElementById("total2")
      );
      this.memberNum.tbox_online_num = this.tbox
        ? this.memberNum.tbox_online_num
        : 0;
      this.memberNum.tbox_sum_num = this.tbox ? this.memberNum.tbox_sum_num : 0;
      let P =
        this.memberNum.tbox_sum_num == 0
          ? 0
          : (
              (this.memberNum.tbox_online_num / this.memberNum.tbox_sum_num) *
              100
            ).toFixed(2);
      let vehicle = [Number(P)];
      this.total.vehicle =
        this.memberNum.tbox_offline_num + this.memberNum.tbox_online_num;

      var ColumnOption2 = {
        tooltip: {
          //悬浮框
          trigger: "item",
        },
        title: [
          {
            text: "在线车辆占比",
            x: "center",
            top: "50%",
            textStyle: {
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: "100",
            },
          },
          {
            text: vehicle + "%",
            x: "center",
            y: "35%",
            textStyle: {
              fontSize: 14,
              color: "#FFFFFF",
              fontFamily: "DINAlternate-Bold, DINAlternate",
              foontWeight: "600",
            },
          },
        ],
        backgroundColor: "transparent",
        polar: {
          //大小
          radius: ["80%", "60%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            roundCap: true,
            barWidth: 30,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, .3)",
            },
            data: vehicle,
            coordinateSystem: "polar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "#16CEB9",
                  },
                  {
                    offset: 1,
                    color: "#6648FF",
                  },
                ]),
              },
            },
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["55%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 3,
              borderColor: "#5269EE",
            },
            data: [100],
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["45%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 1,
              borderColor: "#5269EE",
            },
            data: [100],
          },
        ],
      };

      ColumnEcharts2.setOption(ColumnOption2);
      ColumnEcharts2.resize();
    },
    // 在线人员占比
    setColumn3() {
      var ColumnEcharts3 = this.$echarts.init(
        document.getElementById("total3")
      );
      this.memberNum.member_online_num = this.employee
        ? this.memberNum.member_online_num
        : 0;
      this.memberNum.member_sum_num = this.employee
        ? this.memberNum.member_sum_num
        : 0;
      let P =
        this.memberNum.member_sum_num == 0
          ? 0
          : (
              (this.memberNum.member_online_num /
                this.memberNum.member_sum_num) *
              100
            ).toFixed(2);
      this.total.people =
        this.memberNum.member_offline_num + this.memberNum.member_online_num;
      var offLineNum = this.tbox ? this.memberNum.tbox_offline_num : 0;
      let Onlinezb = [Number(P)];

      var ColumnOption3 = {
        tooltip: {
          //悬浮框
          trigger: "item",
        },
        title: [
          {
            text: "在线人员占比",
            x: "center",
            top: "50%",
            textStyle: {
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: "100",
            },
          },
          {
            text: Onlinezb + "%",
            x: "center",
            y: "35%",
            textStyle: {
              fontSize: 14,
              color: "#FFFFFF",
              fontFamily: "DINAlternate-Bold, DINAlternate",
              foontWeight: "600",
            },
          },
        ],
        backgroundColor: "transparent",
        polar: {
          //大小
          radius: ["80%", "60%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            roundCap: true,
            barWidth: 30,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, .3)",
            },
            data: Onlinezb,
            coordinateSystem: "polar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "#16CEB9",
                  },
                  {
                    offset: 1,
                    color: "#6648FF",
                  },
                ]),
              },
            },
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["55%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 3,
              borderColor: "#5269EE",
            },
            data: [100],
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["45%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 1,
              borderColor: "#5269EE",
            },
            data: [100],
          },
        ],
      };

      ColumnEcharts3.setOption(ColumnOption3);
      ColumnEcharts3.resize();
    },
    // 设备状态
    setPie() {
      var pieEcharts = this.$echarts.init(
        document.getElementById("pieEcharts")
      );

      var pieEchartsOption = {
        legend: {
          bottom: "16%",
          itemWidth: 8, // 设置图例标记的宽度
          itemHeight: 10, // 设置图例标记的高度
          textStyle: {
            color: "white", // 字体颜色
          },
        },
        series: [
          {
            name: "外层",
            type: "pie",
            radius: ["30%", "60%"],
            center: ["center", "40%"],
            // roseType: "area",
            roseType: "radius",

            itemStyle: {
              borderRadius: 100,
            },
            data: [
              {
                value: Number(this.devBatTimeNum.bat_0_20),
                name: "电量<20%",
                itemStyle: { color: "#d72a14" },
              },
              {
                value: Number(this.devBatTimeNum.bat_20_60),
                name: "电量>20%",
                itemStyle: { color: "#E1D95B" },
              },

              {
                value: Number(this.devBatTimeNum.bat_60_100),
                name: "电量>60%",
                itemStyle: { color: "#52ca52" },
              },
            ],
          },
          {
            name: "内层",
            type: "pie",
            radius: "40",
            center: ["center", "40%"],
            itemStyle: {
              borderRadius: 100,
            },
            data: [
              {
                value: Number(this.devTypeNum.inuse_yes),
                name: "已使用",
                itemStyle: { color: "yellow" },
              },
              {
                value: Number(this.devTypeNum.inuse_no),
                name: "未使用",
                itemStyle: { color: "orange" },
              },
            ],
          },
        ],
      };
      pieEcharts.setOption(pieEchartsOption);
      pieEcharts.resize();
    },
    // 信标状态
    setCylinder() {
      var that = this;
      var linderEcharts = this.$echarts.init(document.getElementById("Column"));
      var yList = that.stateData
        ? [
            that.stateData.beacon_low_3day,
            that.stateData.beacon_more_3day,
            that.stateData.beacon_time_unknown,
            that.stateData.bat_60_100,
            that.stateData.bat_20_60,
            that.stateData.bat_0_20,
          ]
        : "";
      let Max = Math.max(...yList);
      let upward = Math.ceil(Max / 100) * (Max < 50 ? 50 : 100); //向上取整
      console.log("upward", upward);

      var xList = [
        "三天内被扫描",
        "三天内未被扫描",
        "从未被扫描过",
        ">60%",
        ">20%",
        "<20%",
      ];
      var color = [
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
      ];
      var xData = xList.map((item, index) => {
        return {
          value: item,
          textStyle: {
            color: color[index],
          },
        };
      });
      var dom = 300;
      var barWidth = dom / 10;
      var colors = [
        {
          type: "linear",
          x: 1,
          x2: 1,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: "transparent",
            },
            {
              offset: 0,
              color: "rgb(82,202,82)",
            },
          ],
        },
        {
          type: "linear",
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.8,
              color: "transparent",
            },
            {
              offset: 0,
              color: "rgb(225,217,91)",
            },
          ],
        },
        {
          type: "linear",
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.8,
              color: "transparent",
            },
            {
              offset: 0,
              color: "rgb(215,42,20)",
            },
          ],
        },
        {
          type: "linear",
          x: 1,
          x2: 1,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: "transparent",
            },
            {
              offset: 0,
              color: "rgb(82,202,82)",
            },
          ],
        },
        {
          type: "linear",
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.8,
              color: "transparent",
            },
            {
              offset: 0,
              color: "rgb(225,217,91)",
            },
          ],
        },
        {
          type: "linear",
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.8,
              color: "transparent",
            },
            {
              offset: 0,
              color: "rgb(215,42,20",
            },
          ],
        },
      ];
      var linderOption = {
        backgroundColor: "transparent",
        width: "80%",
        height: "80%",
        //X轴
        xAxis: {
          nameTextStyle: {
            color: "#FFFFFF",
          },

          data: xData,
          show: true,
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.4)",
            },
            symbol: ["none", "arrow"],
            symbolOffset: [0, 25],
          },
          splitLine: {
            //背景线条
            show: false,
            lineStyle: {
              color: "rgba(255,255,255,0.2)",
            },
          },
          axisLabel: {
            rotate: 30,
            interval: "auto",
            fontSize: 10, //X轴字体大小
          },
        },
        yAxis: {
          show: true,
          splitNumber: 5,
          max: upward,
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.4)",
            },
          },
          splitLine: {
            //背景线条
            show: false,
            lineStyle: {
              color: "rgba(255,255,255,0.2)",
            },
          },
          axisLabel: {
            color: "#FFFFFF",
          },
        },
        grid: {
          top: "10%",
          right: "10%",
          containLabel: true, // gird 区域是否包含坐标轴的刻度标签
        },
        series: [
          {
            type: "bar",
            barWidth: barWidth,
            symbolOffset: ["10%", "50%"],

            itemStyle: {
              normal: {
                color: function (params) {
                  return colors[params.dataIndex % 3];
                },
              },
            },
            label: {
              show: true,
              position: "top",
              color: "#ffffff",
              fontSize: 12,
              formatter: function (params) {
                return params.value;
              },
              offset: [0, -5],
              align: "center",
            },
            data: yList,
          },
          // 实体柱状图顶部
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            data: [that.stateData ? that.stateData.beacon_low_3day : ""],
            symbolOffset: ["0%", "-50%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: function (params) {
                  // return "#21F3FF";
                  return "rgb(82,202,82)";
                },
              },
            },
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            data: ["", that.stateData ? that.stateData.beacon_more_3day : ""],
            symbolOffset: ["0%", "-50%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: function (params) {
                  return "rgb(225,217,91)";
                },
              },
            },
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            data: [
              "",
              "",
              that.stateData ? that.stateData.beacon_time_unknown : "",
            ],
            symbolOffset: ["0%", "-50%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: function (params) {
                  return "rgb(215,42,20)";
                },
              },
            },
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            data: ["", "", "", that.stateData ? that.stateData.bat_60_100 : ""],
            symbolOffset: ["0%", "-50%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: function (params) {
                  return "rgb(82,202,82)";
                },
              },
            },
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            data: [
              "",
              "",
              "",
              "",
              that.stateData ? that.stateData.bat_20_60 : "",
            ],
            symbolOffset: ["0%", "-50%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: function (params) {
                  return "rgb(225,217,91)";
                },
              },
            },
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            data: [
              "",
              "",
              "",
              "",
              "",
              that.stateData ? that.stateData.bat_0_20 : "",
            ],
            symbolOffset: ["0%", "-50%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: function (params) {
                  // return "#21F3FF";
                  return "rgb(215,42,20)";
                },
              },
            },
          },
          // 实体柱状图底部
          {
            z: 4,
            type: "pictorialBar",
            data: [that.stateData ? that.stateData.beacon_low_3day : ""],
            symbolOffset: ["0%", "0%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                color: function (params) {
                  return "rgb(82,202,82,0.3)";
                },
              },
            },
          },
          {
            z: 4,
            type: "pictorialBar",
            data: ["", that.stateData ? that.stateData.beacon_more_3day : ""],
            symbolOffset: ["0%", "0%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                color: function (params) {
                  return "rgb(225,217,91,0.3)";
                },
              },
            },
          },
          {
            z: 4,
            type: "pictorialBar",
            data: [
              "",
              "",
              that.stateData ? that.stateData.beacon_time_unknown : "",
            ],
            symbolOffset: ["0%", "0%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                color: function (params) {
                  return "rgb(215,42,20,0.3)";
                },
              },
            },
          },
          {
            z: 4,
            type: "pictorialBar",
            data: ["", "", "", that.stateData ? that.stateData.bat_60_100 : ""],
            symbolOffset: ["0%", "0%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                color: function (params) {
                  return "rgb(82,202,82,0.3)";
                },
              },
            },
          },
          {
            z: 4,
            type: "pictorialBar",
            data: [
              "",
              "",
              "",
              "",
              that.stateData ? that.stateData.bat_20_60 : "",
            ],
            symbolOffset: ["0%", "0%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                color: function (params) {
                  return "rgb(225,217,91,0.3)";
                },
              },
            },
          },
          {
            z: 4,
            type: "pictorialBar",
            data: [
              "",
              "",
              "",
              "",
              "",
              that.stateData ? that.stateData.bat_0_20 : "",
            ],
            symbolOffset: ["0%", "0%"],
            symbolSize: [barWidth, barWidth * 0.3],
            itemStyle: {
              normal: {
                color: function (params) {
                  return "rgb(215,42,20,0.3)";
                },
              },
            },
          },
        ],
      };

      linderEcharts.setOption(linderOption);
      linderEcharts.resize();
    },
    // 警告类型
    async getReport() {
      var that = this;
      let warn = {
        projectid: this.$store.state.projectid,
        tenantid: this.$store.state.userInfo.superid,
        timezone: this.timezone,
        attenFlag: this.attenFlag,
      };
      await getFristPageUserMapUtil(
        warn,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          res.data.fenceList.forEach((item) => {
            const index = that.AllFences.findIndex((items) => items.id === item.id);
            that.updateNumber(index, item.num);
          });
          that.member_indoor_num = res.data.memberIndoorNum;
          that.member_outdoor_num = res.data.memberOutdoorNum;
          that.tbox_indoor_num = res.data.tboxIndoorNum;
          that.tbox_outdoor_num = res.data.tboxOutdoorNum;
          that.asset_indoor_num = res.data.assetIndoorNum;
          that.asset_outdoor_num = res.data.assetOutdoorNum;
          that.alarmData = [
            {
              type: 1,
              typestr: this.$t("homepage.SOSalert"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: this.$t("homepage.gatherwarn"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: this.$t("homepage.crosswarn"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: this.$t("homepage.strandedwarn"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: this.$t("homepage.Unusuallystill"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
            {
              type: 1,
              typestr: this.$t("warning.Tilt"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },

            {
              type: 1,
              typestr: this.$t("warning.Dumpalarm"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },

            {
              type: 1,
              typestr: this.$t("warning.Firealarm"),
              warn_status1_num: 0,
              warn_status2_num: 0,
            },
          ];
          if (res.data.warnNumList.length > 0) {
            that.alarmData.forEach((item) => {
              res.data.warnNumList.forEach((value) => {
                if (
                  item.typestr == value.typestr ||
                  item.typestr == value.entype
                ) {
                  item.warn_status1_num = value.warn_status1_num;
                  item.warn_status2_num = value.warn_status2_num;
                }
              });
            });
          }
          that.memberNum = res.data;
          that.memberNum1 = that.employee ? res.data.member_sum_num : 0;
          that.memberNum2 = that.asset ? res.data.asset_sum_num : 0;
          that.memberNum3 = that.tbox ? res.data.tbox_sum_num : 0;
          that.setColumn1();
          that.setColumn2();
          that.setColumn3();
          this.maxbuild = res.data.max_num_build[0];
          this.maxground = res.data.max_num_ground[0];
          let sum = []; // 楼栋楼层总人数
          let sum2 = []; // 总告警数
          let dataList = [];
          res.data.buildList.forEach((i) => {
            dataList.push({
              name: i.building,
              devnum: i.devnum,
              assetnum: i.assetnum,
              alarmnum: i.alarmnum,
              type: "building",
            });
            i.list.forEach((t) => {
              if (t.devnum || t.assetnum || t.alarmnum) {
                dataList.push({
                  name: t.name,
                  devnum: t.devnum,
                  assetnum: t.assetnum,
                  alarmnum: t.alarmnum,
                  type: "ground",
                });
              }
              sum.push(t.devnum);
              sum2.push(t.alarmnum);
            });
          });
          that.tableData = dataList;
          that.currentTable = that.getTimeTable();

          sum = sum.reduce((total, cur) => (total += cur), 0);
          sum2 = sum2.reduce((total, cur) => (total += cur), 0);
          this.totalpeople = sum;
          this.totalalarm = sum2;
        }
      });
    },
    devNum(row) {
      if (row.devnum == 0) {
        return "0";
      } else {
        return row.devnum;
      }
    },
    assetNum(row) {
      if (row.assetnum == 0) {
        return "0";
      } else {
        return row.assetnum;
      }
    },
    alarmNum(row) {
      if (row.alarmnum == 0) {
        return "0";
      } else {
        return row.assetnum;
      }
    },
    getTimeTable() {
      let now = new Date();
      let month = now.getMonth() + 1; // 注意，月份是从0开始的，所以我们需要加1
      let date = now.getDate();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      return month + "/" + date + " " + hours + ":" + minutes + ":" + seconds;
    },
    async getState() {
      var that = this;
      let beacon = {
        projectid: this.$store.state.projectid,
        tenantid: this.$store.state.userInfo.superid,
        timezone: this.timezone,
        attenFlag: that.attenFlag,
      };
      await getFristPageUserDevUtil(
        beacon,
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
          this.setPie();
          this.stateData = res.data.beaconBatTimeNum; // 信标状态
          this.setCylinder();
        }
      });
    },
    // 进入大屏
    btnClick() {
      var that = this;
      var element = document.getElementById("content");
      if (this.isFullscreen()) {
        // 全屏
        // that.exitFullScreen();
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen(); // IE11
        }
      }
    },
    // 退出大屏
    exitFullScreen() {
      var that = this;
      let exitFullScreen =
        document.exitFullScreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      if (exitFullScreen) {
        exitFullScreen.call(document);
        that.brk();
      }
    },
    //  判断是否是全屏
    isFullscreen() {
      return (
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        false
      );
    },
    escape() {
      var that = this;
      window.addEventListener("fullscreenchange", () => {
        if (screenfull.isFullscreen == false) {
          that.brk();
        }
      });
      // document.addEventListener("keyup", function (event) {
      //   console.log(event.key);
      //   if (event.key == "Escape") {
      //     event.preventDefault();
      //     console.log("按下了Esc键");
      //     that.brk();
      //   }
      // });
    },
    // 销毁定时器
    destroyed() {
      clearInterval(this.timerMap);
      this.timerMap = null;
    },
  },
};
</script>

<style lang="scss" scoped>
$border: 1px solid red;

* {
  font-weight: 600 !important;
  color: white;
  font-weight: 600;
}

@mixin wh() {
  width: 100%;
  height: 100%;
}

@mixin bg() {
  background-repeat: no-repeat;
  background-position: 0px 0px;
  background-size: 100% 100%;
}

@mixin flex() {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flexColumn() {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}

@mixin title() {
  .title {
    height: 55px;
    display: flex;
    align-items: center;

    img {
      width: 55px;
      height: 100%;
      margin: 0;
    }

    span {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #f1f1f1;
      margin: 0;
    }
  }
}

.LargeScreen >>> .baseLayerClass {
  filter: grayscale(50%) sepia(45%) invert(100%) saturate(350%)
    hue-rotate(-46deg);
}

.LargeScreen {
  @include wh();
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: black;
  position: relative;

  #mapback {
    @include wh();
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    color: rgba(0, 156, 253, 0.5);
  }

  .header {
    width: 100%;
    height: 92px;
    @include flex();

    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background: url(../../../public/image/screen/png/标题背景.png) no-repeat -30px
      0px;
    background-size: 100% 100%;

    span {
      margin: auto auto auto 70px;
      font-size: 19px;
      font-weight: 500;
      color: #0b7bd1;
    }

    .rct {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
      text-align: center;
      line-height: 26px;
    }

    .return {
      width: 102px;
      height: 32px;
      font-weight: 500;
      color: #fffeff;
      line-height: 32px;
      margin: auto 80px auto auto;
      background: url(../../../public/image/screen/返回背景.svg);
      cursor: pointer;
      @include bg();
    }
  }

  .frameBox {
    width: 100%;
    position: absolute;
    left: 0;
    top: 92px;
    z-index: 10;

    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      .frame1 {
        position: absolute;
        left: 44px;
        top: 20px;
        z-index: 10;

        .frame1_box {
          display: flex;

          .floorlist {
            padding: 0px 10px 10px 10px;
            box-sizing: border-box;
            width: 450px;
            background: url(../../../public/image/screen/png/背景框.png);
            @include bg();
            background-color: rgb(5, 22, 45);
            opacity: 0.8;

            .topline {
              height: 1px;
            }

            .floorlistTop {
              @include flex();
              color: #f1f1f1;
              font-size: 16px;
              margin: 20px auto 0 auto;
            }

            .ultitle {
              width: 100%;
              height: 400px;
              padding: 10px 20px;
              margin: 0px auto 0 auto;
              box-sizing: border-box;
              overflow-y: scroll;

              &::-webkit-scrollbar {
                width: 10px;
                border-radius: 20px;
                background: rgba(0, 187, 255, 0.3);
              }

              &::-webkit-scrollbar-thumb {
                border-radius: 20px;
                background: rgb(56, 151, 234);
              }

              .el-table >>> .has-gutter tr th {
                background-color: #05162d;
                color: white;
                font-weight: bolder;
                border: 0px;
              }

              .el-table >>> .has-gutter tr th .cell {
                font-size: 18px;
              }
              .el-table >>> body .el-table th {
                display: none !important;
              }
              .el-table >>> td {
                border: none;
              }

              & >>> .el-table .cell {
                color: white;
              }

              .el-table >>> .el-table__row {
                background: rgb(56, 151, 234, 1) !important;
              }

              .el-table >>> .el-table__row:hover {
                background: rgba(56, 151, 234, 1) !important;
              }

              .el-table >>> .el-table__row:hover td {
                background: rgba(56, 151, 234, 1) !important;
              }

              .el-table >>> .threeD-row {
                background: rgba(2, 70, 122, 1) !important;
              }

              .el-table >>> .threeD-row:hover {
                background: rgba(2, 70, 122, 1) !important;
              }

              .el-table >>> .threeD-row:hover td {
                background: rgba(2, 70, 122, 1) !important;
              }
            }

            .liList {
              @include flex();
              margin: 20px 20px 0px 20px;
              padding: 0px 20px;
              box-sizing: border-box;

              span {
                display: inline-block;
                width: 25%;
                text-align: center;
                font-size: 18px;
                font-weight: 600;
                line-height: 35px;
                color: #fefefe;
              }
            }
          }

          .all_num {
            margin-left: 32px;
            display: flex;

            .title {
              font-size: 16px;
            }
            img {
              margin: 0;
            }
            .num_box {
              p {
                line-height: 20px;
                font-size: 10px;
              }

              .num {
                font-size: 16px;
              }
            }

            .indoor {
              background: url("../../../static/室内背景框.png");
              width: 115px;
              height: 135px;

              div {
                display: flex;
                align-items: center;
                justify-content: space-around;
              }
            }

            .outdoor {
              margin-left: 12px;
              background: url("../../../static/室内背景框.png");
              width: 115px;
              height: 135px;

              div {
                display: flex;
                align-items: center;
                justify-content: space-around;
              }
            }
          }
        }

        .mostpeople {
          width: 450px;
          height: 310px;
          margin-top: 55px;
          padding: 15px 0 0 0;
          box-sizing: border-box;
          @include flex();
          position: fixed;
          left: 40px;
          bottom: 20px;

          .most1 {
            width: 45%;
            height: 100%;
            padding: 15px 0px 0px 0px;
            box-sizing: border-box;
            border-bottom: 2px solid white;
            background: url(../../../public/image/screen/人数最多的楼栋背景.svg);
            @include bg();
            background-color: rgb(5, 22, 45);
            opacity: 0.8;

            .most_title {
              font-size: 24px;
              font-family: YouSheBiaoTiHei;
              font-weight: 400;
              color: #ffffff;
            }

            .most_floor {
              font-size: 14px;
              font-family: Adobe Heiti Std;
              font-weight: normal;
              color: #4bf3f9;
              text-align: left;
              margin: 20px auto auto 15px;
            }

            .realTime {
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #f7f9ff;
              text-align: left;
              margin: 20px auto auto 15px;
            }

            .imgBox {
              width: 180px;
              height: 120px;
              margin: 20px auto auto auto;

              img {
                @include wh();
              }
            }
          }

          .most2 {
            width: 45%;
            height: 100%;
            padding: 15px 0px 0px 0px;
            box-sizing: border-box;
            border-bottom: 2px solid white;
            background: url(../../../public/image/screen/人数最多的楼层背景.svg);
            @include bg();
            background-color: rgb(5, 22, 45);
            opacity: 0.8;

            .most_title {
              font-size: 24px;
              font-family: YouSheBiaoTiHei;
              font-weight: 400;
              color: #ffffff;
            }

            .most_floor {
              font-size: 14px;
              font-family: Adobe Heiti Std;
              font-weight: normal;
              color: #4bf3f9;
              text-align: left;
              margin: 20px auto auto 15px;
            }

            .realTime {
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #f7f9ff;
              text-align: left;
              margin: 20px auto auto 15px;
            }

            .imgBox {
              width: 180px;
              height: 120px;
              margin: 20px auto auto auto;

              img {
                @include wh();
              }
            }
          }
        }
      }

      .frame2 {
        position: absolute;
        left: calc(50% - 385px);
        bottom: -840px;
        z-index: 10;

        .middle {
          width: 770px;
          height: 300px;
          @include flex();
          position: fixed;
          left: calc(50% - 385px);
          bottom: 20px;

          .middle_left {
            width: 48%;
            height: 100%;
            background: url(../../../public/image/screen/小背景.svg) no-repeat -7px -77px;
            background-size: 105% 128%;
            margin: 0px;
            @include title();
            background-color: rgb(5, 22, 45);
            opacity: 0.8;

            .flexCol {
              height: 220px;
              @include flexColumn();
              margin: 10px auto 10px auto;
              padding: 0px 10px 0px 10px;

              .middle_left_ul {
                width: 100%;
                @include flex();
                padding: 5px 20px 0 20px;
                box-sizing: border-box;

                li {
                  width: 100px;
                  height: 100%;
                  background-color: skyblue;
                  margin: 0;
                  background: rgba(47, 174, 255, 0);
                  box-shadow: inset 0px 0px 50px 0px rgba(13, 118, 217, 0.7);
                  font-size: 16px;
                  font-family: Source Han Sans CN;
                  font-weight: 400;
                  color: #ffffff;
                  line-height: 45px;
                }

                li:nth-child(2) {
                  color: #e80000;
                  background: rgba(242, 135, 37, 0);
                  box-shadow: inset 0px 0px 50px 0px rgba(217, 51, 13, 0.7);
                }

                li:nth-child(3) {
                  color: #1fea58;
                  background: rgba(47, 174, 255, 0);
                  box-shadow: inset 0px 0px 50px 0px rgba(13, 217, 61, 0.7);
                }
              }

              .alarmUl {
                color: #74c3ff;
                width: 100%;
                padding: 0px 20px 0px 20px;
                box-sizing: border-box;
                flex: 1;
                overflow-y: scroll;
                @include flexColumn();

                &::-webkit-scrollbar {
                  width: 10px;
                  border-radius: 20px;
                  background: rgba(0, 187, 255, 0.3);
                }

                &::-webkit-scrollbar-thumb {
                  border-radius: 20px;
                  background: rgb(56, 151, 234);
                }

                .alarmLi {
                  @include wh();
                  margin-top: 6px;
                  @include flex();

                  span {
                    margin: 0;
                    display: inline-block;
                    width: 100px;
                    text-align: center;
                    font-size: 14px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 27px;
                  }
                }
              }
            }
          }

          .middle_right {
            width: 48%;
            height: 100%;
            background: url(../../../public/image/screen/小背景.svg) no-repeat -7px -77px;
            background-size: 105% 128%;
            margin: 0px;
            @include title();
            background-color: rgb(5, 22, 45);
            opacity: 0.8;

            #Column {
              width: 100%;
              height: 240px;
            }
          }
        }
      }

      .frame3 {
        position: absolute;
        right: 40px;
        top: 20px;
        z-index: 10;

        .property {
          width: 470px;
          height: 450px;
          background: url(../../../public/image/screen/大背景.svg) no-repeat -10px -8px;
          background-size: 105% 103%;
          @include title();
          background-color: rgb(5, 22, 45);
          opacity: 0.8;

          .totalBox {
            @include flex();

            #total1,
            #total2,
            #total3 {
              width: 33%;
              height: 120px;
            }
          }

          .totalText {
            width: 100%;
            @include flex();
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #ffffff;
            li {
              width: 33% !important;
            }
          }

          .foreBox {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin: 40px 20px;

            .foreBox_li {
              width: 180px;
              height: 75px;
              margin: 0;
              position: relative;

              span {
                position: absolute;
                top: -4px;
                right: 14px;
                font-size: 14px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #ffffff !important;
              }

              div {
                position: absolute;
                top: 25px;
                right: 20px;
                font-size: 29px;
                font-family: AlibabaSans;
                font-weight: normal;
                color: #3fb4ff;
              }
            }

            .foreBox_li:nth-child(1) {
              background: url(../../../public/image/screen/png/设备总数.png);
              @include bg();
              background-color: rgb(5, 22, 45);
            }

            .foreBox_li:nth-child(2) {
              background: url(../../../public/image/screen/png/在线设备.png);
              @include bg();
              background-color: rgb(5, 22, 45);
            }

            .foreBox_li:nth-child(3) {
              margin-top: 20px;
              background: url(../../../public/image/screen/png/离线设备.png);
              @include bg();
              background-color: rgb(5, 22, 45);
            }

            .foreBox_li:nth-child(4) {
              margin-top: 20px;
              background: url(../../../public/image/screen/png/未上线设备.png);
              @include bg();
              background-color: rgb(5, 22, 45);
            }
          }
        }

        .state {
          width: 470px;
          height: 350px;
          margin-top: 50px;
          background: url(../../../public/image/screen/小背景.svg) no-repeat -10px -95px;
          background-size: 105% 130%;
          background-color: rgb(5, 22, 45);
          opacity: 0.8;
          position: fixed;
          right: 40px;
          bottom: 20px;

          .title {
            height: 55px;
            display: flex;
            align-items: center;

            .imgs {
              width: 55px;
              height: 55px;
              margin: 0;
              background: url(../../../public/image/screen/png/设备状态.png)
                no-repeat 3px -2px;
              background-size: 105% 103%;
              background-color: rgb(5, 22, 45);
              opacity: 0.8;
            }
          }

          span {
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #f1f1f1;
            margin: 0;
          }

          #pieEcharts {
            @include wh();
          }
        }
      }
    }
  }
}
</style>
