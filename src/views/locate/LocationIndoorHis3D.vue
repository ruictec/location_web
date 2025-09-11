<template>
  <div class="content">
    <!-- <el-main> -->
    <div class="inputContent">
      <el-form
        class="demo-form-inline"
        style="display: flex; white-space: nowrap; margin-left: 1%"
        :model="searchList"
      >
        <el-form-item
          :label="$t('checkwork.Name')"
          style="display: flex; margin-left: 1%; margin-right: 2%"
        >
          <el-select
            clearable
            filterable
            remote
            :remote-method="remoteUserMethod"
            v-model="searchList.deveui"
            :placeholder="$t('locationoutdoorh.text')"
            style="width: 120%"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.maplabel"
              :label="item.username"
              :value="item.maplabel"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.maplabel
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('locationoutdoorh.time')"
          style="display: flex; margin-left: 2%; margin-right: 0"
        >
          <el-date-picker
            v-model="tasktime"
            type="datetimerange"
            :picker-options="pickerOptions"
            :range-separator="$t('locationoutdoorh.to')"
            :start-placeholder="$t('locationoutdoorh.starttime')"
            :end-placeholder="$t('locationoutdoorh.endtime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="display: flex; margin-left: 2%">
          <el-button type="primary" class="query" @click="searchInfo()">{{
            $t("locationoutdoorh.search")
          }}</el-button>
          <el-button type="primary" class="reset" @click="clearBtn()">{{
            $t("locationoutdoorh.reset")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mapConent">
      <el-row :gutter="20">
        <el-col :span="3">
          <label for="speed">
            {{ $t("tet.Movementspeed") }}:&nbsp;
            <input id="speed" type="range" step="10" value="5" />
          </label>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" plain @click="handlerPlay">{{
            textContent
          }}</el-button>
        </el-col>
      </el-row>
      <!-- <div class="progress-bar">
        <div class="bar-box">
          <el-progress :text-inside="true" :stroke-width="10" :percentage="progress"></el-progress>
        </div>
      </div> -->
      <div id="map"></div>
    </div>

    <!-- </el-main> -->
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import util from "../../common/util";

import { getMemberNameId, getDevGpsList } from "../../axios/api";

import OSM from "ol/source/OSM";
import "ol/ol.css";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import Polyline from "ol/format/Polyline";
import { Projection } from "ol/proj";
import { fromLonLat } from "ol/proj";
import { Point, LineString, Polygon } from "ol/geom";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";

//地图控件
import ScaleLine from "ol/control/ScaleLine"; //比例尺控件
import {
  Circle as CircleStyle,
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
} from "ol/style";
import { getVectorContext } from "ol/render";
export default {
  components: {
    Menu,
    Project,
  },
  name: "LocationHistorical3D",
  data() {
    return {
      openlayersSource: "",
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      userList: [],
      searchList: {
        projectid: this.$store.state.projectid,
        // deveui: "",
        devtype: "",
        postype: 2,
        begintime: "",
        endtime: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            message: this.$t("terminal.pickeroptions4"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0));
              // start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            message: this.$t("terminal.pickeroptions5"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            message: this.$t("terminal.pickeroptions6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);

              // const end = new Date();
              // const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              // picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tasktime: [new Date().getTime() - (1 * 60 * 60 * 1000 - 1), new Date()],
      begingTime: "",
      endTime: "",
      locationHisList: "",
      mapName: "map",
      arrs: [],
      map: null,

      time: "",
      startTime: "",
      // endTime 在上方已定义，避免重复

      progress: 0, // 进度
      animating: false, // 动画是否开始
      speed: null, // 速度
      now: null, // 当前时间
      textContent: "开始回放",
      routeCoords: [], // 数组点集合
      routeLength: null, // 数组长度
      route: null, // 线
      routeFeature: null, // 画线
      geoMarker: null, // 标记
      startMarker: null, // 开始标记
      endMarker: null, // 结束标记
      styles: {
        route: new Style({
          // 线的样式
          stroke: new Stroke({
            width: 6,
            color: [237, 212, 0, 0.8],
          }),
        }),
        icon: new Style({
          // 默认icon样式
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: "red" }),
            stroke: new Stroke({
              color: "white",
              width: 2,
            }),
          }),
        }),
        geoMarker: new Style({
          // 设置标记样式
          image: new Icon({
            anchor: [0.5, 1], // 偏移位置
            // rotation: 0, // 旋转
            // size: [52, 26], // 图标大小
            src: require("../../../static/User.png"),
          }),
        }),
        start: new Style({
          // 设置开始标记样式
          image: new Icon({
            anchor: [0.5, 1],
            src: require("../../../static/User.png"),
          }),
        }),
        end: new Style({
          // 设置结束标记样式
          image: new Icon({
            anchor: [0.5, 1],
            src: require("../../../static/User.png"),
          }),
        }),
      },
      vectorLayer: null, // 矢量图层
      center: [],

      //输入框模糊查询
      userLoading: false,
      userOptions: [],
    };
  },
  methods: {
    //查询
    searchInfo() {
      var that = this;
      if (this.searchList.deveui == "") {
        this.$message({
          message: this.$t("tet.tet3"),
          type: "warning",
        });
        return;
      }
      if (this.tasktime && this.tasktime.length > 0) {
        that.begingTime = that.tasktime[0];
        that.endTime = that.tasktime[1];
        let redeuceData =
          (that.endTime - that.begingTime) / 1000 / 60 / 60 / 24;
        if (redeuceData > 7) {
          that.$message({
            message: this.$t("tet.tet1"),
            type: "warning",
          });
          return;
        }
        that.begingTime =
          !that.begingTime || that.begingTime == ""
            ? ""
            : util.formatDate.format(
                new Date(that.begingTime),
                "yyyy-MM-dd hh:mm:ss"
              );
        that.endTime =
          !that.endTime || that.endTime == ""
            ? ""
            : util.formatDate.format(
                new Date(that.endTime),
                "yyyy-MM-dd hh:mm:ss"
              );

        if (that.begingTime.length > 0 && that.endTime.length > 0) {
          that.begingTime = Date.parse(new Date(that.begingTime)) / 1000;
          that.endTime = Date.parse(new Date(that.endTime)) / 1000;
        }
        this.searchList.begintime = this.begingTime;
        this.searchList.endtime = this.endTime;
        if (this.intoProjectType == 1) {
          this.searchList.devtype = 1;
        } else if (this.intoProjectType == 2) {
          this.searchList.devtype = 2;
        }
        getDevGpsList(
          this.searchList,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (res.data.list.length > 0) {
              that.$message({
                message: this.$t("beacon.searchsuccess"),
                type: "success",
              });

              let TrackData = res.data.list;
              this.center = [TrackData[0].x, TrackData[0].y];
              TrackData.forEach((e) => {
                that.routeCoords.push([parseFloat(e.x), parseFloat(e.y)]);
              });
              that.addLayers();
            } else {
              that.$message({
                message: this.$t("beacon.nodata"),
                type: "warning",
              });
            }
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    //刷新
    clearBtn() {
      this.searchList = {
        projectid: this.$store.state.projectid,
        // deveui: "",
        devtype: "",
        postype: 2,
        begintime: "",
        endtime: "",
      };
      this.tasktime = [];
      this.begingTime = "";
      this.endTime = "";
      this.routeCoords = [];

      this.addLayers();
    },
    //初始化地图

    initMaps() {
      let that = this;
      setTimeout(() => {
        this.map = new Map({
          target: "map",
          layers: [
            new TileLayer({
              source: that.openlayersSource,
              // projection: "EPSG:3857",
            }),
            // that.vectorLayer,
          ],
          view: new View({
            projection: "EPSG:4326",
            center: this.center,
            zoom: 15,
          }),
        });

        this.map.addControl(new ScaleLine());
        this.mapClick();
        this.addLayers();
        this.addLine(this.map);
      }, 0);
    },
    /**
     * 删除图层
     */
    removeVectorLayer(vectorLayer) {
      if (vectorLayer) this.map.removeLayer(vectorLayer);
    },
    addLayers() {
      // 第二次以后渲染轨迹的时候把上次的图层先删除
      this.removeVectorLayer(this.vectorLayer);
      let that = this;
      if (that.routeCoords.length > 0) {
        that.routeLength = that.routeCoords.length;
        that.route = new LineString(that.routeCoords);

        that.routeFeature = new Feature({
          type: "route",
          geometry: that.route,
        });
        that.geoMarker = new Feature({
          type: "geoMarker",
          geometry: new Point(that.routeCoords[0]),
        });
        that.startMarker = new Feature({
          type: "start",
          geometry: new Point(that.routeCoords[0]),
        });
        that.endMarker = new Feature({
          type: "end",
          geometry: new Point(that.routeCoords[that.routeLength - 1]),
        });
        that.vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: [
              that.routeFeature,
              that.geoMarker,
              that.startMarker,
              that.endMarker,
            ],
            // 线、标记、开始标记、结束标记
          }),
          style: function (feature) {
            // 如果动画处于活动状态，则隐藏标记
            if (that.animating && feature.get("type") === "geoMarker") {
              return null;
            }
            return that.styles[feature.get("type")];
          },
        });

        this.map.addLayer(that.vectorLayer);
      }
    },
    // 地图绑定事件
    mapClick() {
      let that = this;
      this.map.on("click", function (event) {
        let feature = that.map.getFeaturesAtPixel(event.pixel);
        let pixel = that.map.getEventPixel(event.originalEvent);
        let coodinate = event.coordinate;
        // let temp = feature[0].geometryChangeKey_.target
        // Point
        if (feature.length > 0) {
          console.warn(feature[0].values_.type, 111);
          // console.warn(feature[0].get('geometryChangeKey'),9999999999)
        }
      });
    },
    // 运动轨迹开关
    handlerPlay() {
      if (this.textContent === "停止回放") {
        this.stop(false);
      } else {
        this.start();
      }
    },

    // 轨迹移动
    moveFeature(event) {
      let vectorContext = getVectorContext(event);
      let frameState = event.frameState;
      if (this.animating) {
        let elapsedTime = frameState.time - this.now;
        let index = Math.round((this.speed * elapsedTime) / 1000);
        // 进度条
        this.progress = Math.floor(
          ((100 / this.routeLength) * (this.speed * elapsedTime)) / 1000
        );
        if (index >= this.routeLength) {
          this.progress = "100";
          this.stop(true);
          return;
        }

        let currentPoint = new Point(this.routeCoords[index]);
        let feature = new Feature(currentPoint);
        vectorContext.drawFeature(feature, this.styles.geoMarker);
      }
      // tell OpenLayers to continue the postrender animation
      this.map.render(); // 开始移动动画
    },

    // 开始动画
    start() {
      if (this.animating) {
        this.stop(false);
      } else {
        this.animating = true;
        this.textContent = "停止回放";
        this.now = new Date().getTime();
        let speedInput = document.getElementById("speed");
        this.speed = speedInput.value;
        this.geoMarker.setStyle(null); // hide geoMarker 隐藏标记
        // just in case you pan somewhere else
        this.map.getView().setCenter(this.center); // 设置下中心点
        this.vectorLayer.on("postrender", this.moveFeature);
        this.map.render();
      }
    },
    // 停止
    stop(ended) {
      this.progress = 0;
      this.animating = false;
      this.textContent = "开始回放";
      let coord = ended
        ? this.routeCoords[this.routeLength - 1]
        : this.routeCoords[0];
      let geometry = this.geoMarker.getGeometry().setCoordinates(coord);
      //remove listener
      this.vectorLayer.un("postrender", this.moveFeature); // 删除侦听器
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
      // map.addLayer(newVector)
      setInterval(() => {
        let offset1 = feature.get("dashOffset");
        offset1 = offset1 == 0 ? -8 : offset1 + 1;

        feature.set("dashOffset", offset1);
        feature.setStyle(getStyle());
      }, 100);
    },
    //删除
    delFeature(e) {
      let LayerArrays = this.map.getLayers().getArray();
      for (let i = 1; i < LayerArrays.length; i++) {
        if (
          e.deveui == LayerArrays[i].getSource().getFeatures()[0].values_.deveui
        ) {
          LayerArrays[i]
            .getSource()
            .getFeatures()
            .forEach(function (feature) {
              LayerArrays[i].getSource().removeFeature(feature);
            });
          this.map.removeLayer(LayerArrays[i]);
        }
      }
    },

    //获取页面所有图标
    getAllFeatures() {
      var that = this;
      let LayerArrays = this.map.getLayers().getArray();
      this.arrs = [];
      let info;
      for (let i = 1; i < LayerArrays.length; i++) {
        // TODO: 后续可在此收集图层信息
      }
    },
    //获取员工姓名下拉框
    getMemberNames() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
      };
      getMemberNameId(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          // this.userList = res.data;
          that.userList = res.data.map((item) => {
            return {
              value: `${item.maplabel}`,
              maplabel: `${item.maplabel}`,
              username: `${item.username}`,
            };
          });
          for (let i = that.userList.length - 1; i > -1; i--) {
            if (
              that.userList[i].maplabel == "" ||
              that.userList[i].maplabel == null ||
              that.userList[i].maplabel == undefined
            ) {
              that.userList.splice(i, 1);
            }
          }
        }
      });
    },
    //输入框模糊查询
    remoteUserMethod(query) {
      if (query !== "") {
        this.userLoading = true;
        setTimeout(() => {
          this.userLoading = false;
          this.userOptions = this.userList.filter((item) => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return (
                item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          });
        }, 200);
      } else {
        this.userOptions = [];
      }
    },
  },
  beforeMount() {
    let that = this;
    if (this.$store.state.longis && this.$store.state.latis) {
      this.center=[this.$store.state.longis, this.$store.state.latis];
    } else {
      if (that.$store.state.i18n == "zh") {
        that.center = [118, 32];
      } else {
        that.center = [0.1, 51.3];
      }
    }
    if (this.$store.state.i18n == "zh") {
      // 说明：瓦片地址改为读取环境变量，默认保持当前地址
      this.openlayersSource = new OSM({
        url: process.env.VUE_APP_TILE_URL_TEMPLATE,
        crossOrigin: "",
      });
    } else {
      this.openlayersSource = new OSM();
    }
    this.getMemberNames();
    this.initMaps();
  },
};
</script>

<style scoped>
.home {
  height: 100%;
}

.menu_header {
  position: relative;
}
.asi {
  position: absolute;
  top: 70px;
  width: 99%;
}
.el-aside {
  margin-top: 50px;
  width: auto !important;
}

.el-message--success {
  display: -webkit-box !important;
}

.el-message--error {
  display: -webkit-box !important;
}

.el-message--warning {
  display: -webkit-box !important;
}
.el-table >>> .el-table__row td {
  padding: 5px 0 !important;
}
.query,
.reset,
.addBeacon,
.editBeacons,
.delBeacons {
  padding: 8px 12px !important;
}
.demo-form-inline >>> .el-form-item .el-form-item__label {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline >>> .el-form-item .el-form-item__content {
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__inner {
  height: 34px !important;
  line-height: 34px !important;
}
.demo-form-inline >>> .el-form-item:nth-of-type(1) .el-input__inner {
  cursor: text !important;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-range-separator {
  height: 34px;
  line-height: 34px;
}
.mapConent {
  display: flex;
  /* margin-top: 1%; */
  flex-direction: column;
}
#map {
  margin-top: 0.5%;
  height: 700px;
  width: 100%;
}
.assignMapContent {
  display: flex;
}

#contextmenu_container {
  background: #fff;
  /* height: 100px; */
}
#popup-content {
  background: #fff;
  padding: 3px;
}
/* .ol-popup-closer {
  position: absolute;
  top: 2px;
  right: 8px;
} */
.ol-popup-closer:after {
  content: "x";
  color: red;
}
li {
  list-style: none;
  margin-top: 5px;
}
a {
  text-decoration: none;
}
.backProject >>> .el-page-header__left {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject >>> .el-page-header__content {
  text-align: left !important;
}
.bar-box {
  position: absolute;
  top: 10px;
  left: 30px;
  right: 30px;
  height: 10px;
  border-radius: 5px;
}

.progress-bar {
  width: 100%;
  height: 30px;
  /* background: url("~@/assets/bg-5.png") center bottom no-repeat; */
  background-size: 100% 30px;
  position: relative;
  box-sizing: border-box;
}
.bar {
  height: 10px;
  border-radius: 5px;
  /* background: url("~@/assets/bg-6.png") 0 bottom repeat #ecc520; */
  position: relative;
}
.bar span {
  width: 50px;
  height: 50px;
  line-height: 18px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  position: absolute;
  color: #fe0000;
  top: -30px;
  right: -25px;
  /* background: url("~@/assets/bg-7.png") center 0 no-repeat; */
  background-size: 100% 30px;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
</style>
