<template>
  <div class="content">
    <!-- <el-main> -->
    <div class="inputContent">
      <el-form
        class="demo-form-inline"
        style="display: flex; white-space: nowrap; margin-left: 0%"
        :model="searchList"
      >
        <el-form-item
          :label="$t('locationoutdoorh.name')"
          style="display: flex; margin-left: 0%; margin-right: 2%"
        >
          <el-select
            clearable
            filterable
            remote
            allow-create
            :remote-method="remoteUserMethod"
            v-model="searchList.username"
            :placeholder="$t('locationoutdoorh.text')"
            :loading="userLoading"
          >
            <el-option
              v-for="item in allOptions"
              :key="item.maplabel"
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
        <el-form-item
          style="display: block; width: 35%; margin-left: 0%"
          :label="$t('locationoutdoorh.speed')"
        >
          <div class="block">
            <div style="width: 80%">
              <el-slider v-model="speed" :step="1" :max="10" :min="1">
              </el-slider>
            </div>

            <el-button
              type="primary"
              class="start"
              plain
              @click="handlerPlay"
              >{{ textContent }}</el-button
            ><el-checkbox
              v-model="showLine"
              @change="changeShow()"
              :disabled="showTime"
              class="showline"
              >{{ $t("locationoutdoorh.showline") }}</el-checkbox
            >
            <el-checkbox
              v-model="showTime"
              @change="changeShow()"
              :disabled="!showLine"
              >{{ $t("locationoutdoorh.showtime") }}</el-checkbox
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="mapConent">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import util from "../../common/util";

import { getMemberNameId, getTboxSnId, getDevGpsList } from "../../axios/api";

import OSM from "ol/source/OSM";
import "ol/ol.css";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { Point, LineString } from "ol/geom";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
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
export default {
  components: {
    Menu,
    Project,
  },
  name: "LocationHistorical",
  data() {
    return {
      openlayersSource: "",
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      searchList: {
        projectid: this.$store.state.projectid,
        username: "",
        postype: 2,
        begintime: "",
        endtime: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("terminal.pickeroptions4"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions5"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
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
      // endTime 字段已在上方定义，避免重复

      progress: 0, // 进度
      animating: false, // 动画是否开始
      speed: 1, // 速度
      now: null, // 当前时间
      textContent: this.$t("locationoutdoorh.start"),
      routeCoords: [], // 数组点集合
      TrackData: [],
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
            color: [0, 0, 0, 0.8],
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
            src: require("../../../static/user1.png"),
          }),
        }),
        start: new Style({
          // 设置开始标记样式
          image: new Icon({
            anchor: [0.5, 1],
            src: require("../../../static/start.png"),
          }),
        }),
        end: new Style({
          // 设置结束标记样式
          image: new Icon({
            anchor: [0.5, 1],
            src: require("../../../static/end.png"),
          }),
        }),
      },
      showTime: false,
      // 在data中添加一个数组来保存所有文字图层
      textLayers: [],
      showLine: false,
      vectorLayer: null, // 矢量图层
      vectorLayerText: null, // 矢量图层
      center: [],

      //输入框模糊查询
      userLoading: false,
      userList: [],
      tboxList: [],
      allList: [],
      allOptions: [],
    };
  },
  methods: {
    updateSize() {
      this.map.updateSize();
    },
    //查询
    searchInfo() {
      var that = this;
      if (this.searchList.username == "") {
        that.$message({
          message: this.$t("locationoutdoorh.message"),
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
            message: this.$t("locationoutdoorh.message1"),
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
        getDevGpsList(
          this.searchList,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.routeCoords = [];
            if (res.data.list.length > 0) {
              that.$message({
                message: that.$t("buildingmanagement.searchsuccess"),
                type: "success",
              });

              let TrackData = res.data.list.reverse();
              this.center = [TrackData[0].x, TrackData[0].y];
              this.map.getView().setCenter(this.center);
              TrackData.forEach((e) => {
                that.routeCoords.push([parseFloat(e.x), parseFloat(e.y)]);
              });
              that.TrackData = TrackData;
              that.addLayers();
            } else {
              that.$message({
                message: that.$t("buildingmanagement.nodata"),
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
      } else {
        that.$message({
          message: this.$t("locationoutdoorh.message2"),
          type: "warning",
        });
        return;
      }
    },
    //刷新
    clearBtn() {
      this.searchList = {
        projectid: this.$store.state.projectid,
        username: "",
        postype: 2,
        begintime: "",
        endtime: "",
      };
      this.tasktime = [
        new Date().getTime() - (1 * 60 * 60 * 1000 - 1),
        new Date(),
      ];
      this.begingTime = "";
      this.endTime = "";
      this.routeCoords = [];

      this.addLayers();
      this.getMemberNames();
    },
    //初始化地图

    initMaps() {
      let that = this;
      setTimeout(() => {
        this.map = new Map({
          target: "map",
          layers: [
            new TileLayer({
              className: "baseLayerClass",
              source: that.openlayersSource,
            }),
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

    //时间转换
    formatDatetime(row) {
      if (row == null || row == 0) {
        return "";
      }
      let date = new Date(parseInt(row) * 1000);
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
    changeShow() {
      this.addLayers();
      if (this.textContent === "停止") {
        this.stop(false);
      }
    },
    addLayers() {
      let that = this;
      // 第二次以后渲染轨迹的时候把上次的图层先删除
      this.removeVectorLayer(this.vectorLayer);
      this.removeVectorLayer(this.vectorLayer2);
      let list = this.map.getLayers().getArray();
      for (let i = list.length - 1; i > 0; i--) {
        if (
          list[i].getSource().getFeatures()[0].style_ &&
          list[i].getSource().getFeatures()[0].style_.text_
        ) {
          that.map.removeLayer(list[i]);
        }
      }
      that.textLayers.forEach((layer) => {
        that.map.removeLayer(layer);
      });
      that.textLayers = []; // 清空引用
      if (that.routeCoords.length > 0) {
        that.routeLength = that.routeCoords.length;
        that.route = new LineString(that.routeCoords);

        let timeMarks = that.TrackData;
        that.textLayers = []; // 每次清空之前的
        timeMarks.forEach((item) => {
          let itemStyle = new Style({
            text: new Text({
              // 位置
              textAlign: "center",
              // 基准线
              textBaseline: "middle",
              // 文字样式
              font: "bold 13px 微软雅黑",
              // 文本内容
              text: that.showTime ? that.formatDatetime(item.gpstime) : "",
              // 文字颜色
              fill: new Fill({ color: "#587de5" }),
              // 文字背景
              stroke: new Stroke({ color: "#ffcc33", width: 3 }),
            }),
          });

          let featureItem = new Feature({
            geometry: new Point([item.x, item.y]),
          });
          featureItem.setStyle(itemStyle);

          // this.vectorLayerText = new VectorLayer({
          let vectorLayerText = new VectorLayer({
            source: new VectorSource({
              features: [featureItem],
            }),

            zIndex: 9999,
            style: null,
          });
          if (this.showTime) {
            // that.map.addLayer(this.vectorLayerText);
            that.map.addLayer(vectorLayerText);
          }
          // 保存图层引用，方便后续移除
          that.textLayers.push(vectorLayerText);
        });

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
              // that.geoMarker,
              that.startMarker,
              that.endMarker,
            ],
            // 线、标记、开始标记、结束标记
          }),
          style: function (feature) {
            // 如果动画处于活动状态，则隐藏标记
            if (!that.showLine && feature.get("type") === "route") {
              return null;
            }
            return that.styles[feature.get("type")];
          },
        });
        if (that.vectorLayer2) {
          this.map.removeLayer(that.vectorLayer2);
        }
        that.vectorLayer2 = new VectorLayer({
          source: new VectorSource({
            features: [
              // that.routeFeature,
              that.geoMarker,
            ],
            // 线、标记、开始标记、结束标记
          }),

          style: new Style({
            // 设置标记样式
            image: new Icon({
              anchor: [0.5, 0.5], // 偏移位置
              // 控制大小
              scale: 0.5,
              src: require("../../../static/user2.png"),
              rotateWithView: true,
            }),
          }),
          zIndex: 10000,
        });
        this.map.addLayer(that.vectorLayer);
        this.map.addLayer(that.vectorLayer2);
      }
    },
    // 地图绑定事件
    mapClick() {
      let that = this;
      this.map.on("click", function (event) {
        let feature = that.map.getFeaturesAtPixel(event.pixel);
        let pixel = that.map.getEventPixel(event.originalEvent);
        let coodinate = event.coordinate;
        if (feature.length > 0) {
          console.warn(feature[0].values_.type, 111);
        }
      });
    },

    // 运动轨迹开关
    handlerPlay() {
      if (this.routeCoords.length == 0) return;
      if (this.textContent === "停止") {
        this.stop(false);
      } else {
        this.start();
      }
    },

    // 轨迹移动
    moveFeature(event) {
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
        let currentPoint1;
        if (index > 0) {
          currentPoint1 = new Point(this.routeCoords[index - 1]);
        }
        let that = this;

        //改变位置
        that.geoMarker.setGeometry(new Point(currentPoint.flatCoordinates));
        if (currentPoint1) {
          //改变方向
          this.vectorLayer2
            .getStyle()
            .getImage()
            .setRotation(
              this._map_p_rotation(
                currentPoint.flatCoordinates,
                currentPoint1.flatCoordinates
              )
            );
        }
      }
      this.map.render(); // 开始移动动画
    },

    // 开始动画
    start() {
      if (this.animating) {
        this.stop(false);
      } else {
        this.animating = true;
        this.textContent = this.$t("locationoutdoorh.stop");
        this.now = new Date().getTime();
        this.geoMarker.setStyle(null); // hide geoMarker 隐藏标记
        this.map.getView().setCenter(this.center); // 设置下中心点
        this.vectorLayer.on("postrender", this.moveFeature);
        this.map.render();
      }
    },
    // 停止
    stop(ended) {
      this.progress = 0;
      this.animating = false;
      this.textContent = this.$t("locationoutdoorh.start");
      let coord = ended
        ? this.routeCoords[this.routeLength - 1]
        : this.routeCoords[0];
      let geometry = this.geoMarker.getGeometry().setCoordinates(coord);
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
        // 占位：遍历图层
      }
    },
    // 点的转向角度设置  new_p 上一点的坐标 old_p 下一点的坐标
    _map_p_rotation(new_p, old_p) {
      // 90度的PI值
      var pi_90 = Math.atan2(1, 0);
      // 当前点的PI值
      var pi_ac = Math.atan2(new_p[1] - old_p[1], new_p[0] - old_p[0]);

      return pi_90 - pi_ac;
    },
    //获取页面所有图标
    getAllFeatures() {
      var that = this;
      let LayerArrays = this.map.getLayers().getArray();
      this.arrs = [];
      let info;
      for (let i = 1; i < LayerArrays.length; i++) {
        // 占位：遍历图层
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
          this.getTboxSnIds();
        }
      });
    },
    // 获取车辆下拉框
    getTboxSnIds() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
      };
      getTboxSnId(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.tboxList = res.data
              .filter((item) => {
                return item.maplabel;
              })
              .map((item) => {
                return {
                  value: `${item.maplabel}`,
                  maplabel: `${item.maplabel}`,
                  username: `${item.sn}`,
                };
              });
            that.allList = that.userList.concat(that.tboxList);
          }
        }
      );
    },
    //输入框模糊查询
    remoteUserMethod(query) {
      if (query !== "") {
        this.userLoading = true;
        setTimeout(() => {
          this.userLoading = false;
          this.allOptions = this.allList.filter((item) => {
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
        this.allOptions = [];
      }
    },
  },
  computed: {
    show1() {
      return this.$store.state.show;
    },
  },
  watch: {
    show1(val) {
      setTimeout(() => {
        this.msg = 2;
        this.getMsgSum();
      }, 1000);
    },
    "$i18n.locale"() {
      Object.assign(
        this.$data,
        this.$options.data.apply(this)
      );
    }
  },
  beforeMount() {
    let that = this;
    if (this.$store.state.longis && this.$store.state.latis) {
      this.center = [this.$store.state.longis, this.$store.state.latis];
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
    this.getMemberNames();
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
.start,
.addBeacon,
.editBeacons,
.delBeacons {
  padding: 8px 12px !important;
  z-index: 1;
}
.showline {
  margin-left: 20px;
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
.content {
  position: absolute;
  width: 98%;
  height: 90%;
}
.inputContent {
  height: 7%;
  width: 100%;
}
.mapConent {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 93%;
  margin-bottom: 20px;
}
#map {
  height: 100%;
  width: 100%;
  z-index: 1;
}
#map >>> .baseLayerClass {
  filter: grayscale(100%) sepia(51%) invert(100%) saturate(350%);
}
.assignMapContent {
  display: flex;
}

#contextmenu_container {
  background: #fff;
}
#popup-content {
  background: #fff;
  padding: 3px;
}

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
  background-size: 100% 30px;
  position: relative;
  box-sizing: border-box;
}
.bar {
  height: 10px;
  border-radius: 5px;
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
  background-size: 100% 30px;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.block {
  display: flex;
}
</style>
