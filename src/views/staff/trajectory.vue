<template>
  <div class="mapConent">
    <div class="control_div">
      <div class="block">
        <div class="block-group block-speed">
          <span class="speed-label">{{ $t("trajectory.Speed") }}</span>
          <div class="speed-slider">
            <el-slider v-model="speed" :step="1" :max="10" :min="1" />
          </div>
        </div>
        <div class="block-group block-options">
          <el-checkbox
            v-model="showLine"
            @change="changeShow()"
            :disabled="outDoor && (showTime || showDistance)"
            class="show_line"
            >{{ $t("trajectory.Showroute") }}</el-checkbox>
          <template v-if="outDoor">
            <el-checkbox
              v-model="showTime"
              @change="changeShow()"
              :disabled="!showLine"
              class="show_line"
              >{{ $t("locationoutdoorh.showtime") }}</el-checkbox>
            <el-checkbox
              v-model="showDistance"
              @change="changeShow()"
              :disabled="!showLine"
              class="show_line"
              >{{ $t("locationoutdoorh.showdistance") }}</el-checkbox>
          </template>
        </div>
        <div class="block-group block-actions">
          <el-button
            type="primary"
            class="restart"
            :disabled="!canTogglePause"
            @click="togglePause()"
            >{{ pauseBtnText }}</el-button>
          <el-button
            type="primary"
            class="restart"
            :disabled="restartLine"
            @click="repeatRoute()"
            >{{ $t("trajectory.Trackplayback") }}</el-button>
        </div>
      </div>
      <div
        v-if="progressTime || trajectoryUserame"
        class="progresstime progresstime-out"
      >
        <span v-if="trajectoryUserame" class="progresstime-line">{{
          trajectoryUserame
        }}</span>
        <span
          v-if="progressTime && trajectoryUserame"
          class="progresstime-sep"
          >·</span
        >
        <span v-if="progressTime" class="progresstime-line">{{
          progressTime
        }}</span>
      </div>
    </div>

    <div class="mapContent" style="position: relative">
      <MapLayerSwitcher
        v-if="outDoor"
        :map="map"
        bottom="10px"
        right="10px"
        @change="onMapStyleChange"
      />
      <div id="allmap" ref="map" class="allmap"></div>
    </div>

    <div class="progress_div">
      <div class="progress-row">
        <el-slider
          class="progress"
          v-model="percentage"
          disabled
        ></el-slider>
      </div>
    </div>
  </div>
</template>
<script>
import host from "../../host";
import {
  getBuildGroundList,
  getPointAndNearList,
  getDevGpsList,
} from "../../axios/api";
import Graphs from "./trajectory2.js";

import "ol/ol.css";
import { createOutdoorBaseLayers, refreshBaseTiles } from "../../utils/mapSource";
import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { getCenter } from "ol/extent";
// 图上图标相关
import Feature from "ol/Feature";
import { Point, LineString, Polygon } from "ol/geom";
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
// 用来添加相关文字描述的
import MapLayerSwitcher from "../../components/map/MapLayerSwitcher";
import mapStyleMixin from "../../mixins/mapStyleMixin";
export default {
  name: "trajectory",
  components: {
    MapLayerSwitcher,
  },
  mixins: [mapStyleMixin],
  data() {
    return {
      outdoorBaseLayers: [],
      intoProjectid: this.$store.state.intoProjectid,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      actionTableDataArr: [],
      actionTableData: [], //每一层的行为数据信息
      tranchChild: [],
      newActionTableData: [],

      imgUrl: "",
      map: null,
      mapName: "allmap",

      animating: false, // 动画是否开始
      speed: 1, // 速度
      num: 0,
      distance: 0,
      now: null, // 当前时间
      vectorLayer: null, // 矢量图层
      vectorLayer2: null, // 矢量图层
      routeCoords: [], // 数组点集合
      routeLength: null, // 数组长度
      route: null, // 线
      routeFeature: null, // 画线
      geoMarker: null, // 标记
      startMarker: null, // 开始标记
      endMarker: null, // 结束标记

      center: [this.$store.state.longis, this.$store.state.latis],
      TrackData: [],
      outDoor: true,
      styles: {
        route: new Style({
          // 线的样式（室外：标准底图深蓝，其他底图黄色；室内保持蓝色）
          stroke: new Stroke({
            width: 3,
            color: [255, 255, 0, 0.8],
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
            src: (process.env.BASE_URL || '/') + 'static/user1.png',
          }),
        }),
        start: new Style({
          // 设置开始标记样式
          image: new Icon({
            anchor: [0.5, 1],
            src: (process.env.BASE_URL || '/') + 'static/start.png',
          }),
        }),
        end: new Style({
          // 设置结束标记样式
          image: new Icon({
            anchor: [0.5, 1],
            src: (process.env.BASE_URL || '/') + 'static/end.png',
          }),
        }),
      },
      g: "",
      graphData: "",
      beTime: "",
      enTime: "",
      groundLength: 0,
      searchInfoArr: [],
      vectorLayers: [],
      percentage: 0,
      progressTime: "", //进度条后显示时间
      showLine: true,
      showTime: false,
      showDistance: false,
      textLayers: [],
      restartLine: false, //轨迹回放
      playing: false,
      paused: false,
      trajectoryUserame: "",
      timeout: "",
      alltime: "",
      firsttime: "",
      iconImagSrc: "",
      goTimeOut: true,
      devType: "",
      moveTime: 0,
      outerDoor: false, //是否室外轨迹
      mapSwitching: false,
      nextMapTimer: null,
    };
  },
  computed: {
    outDoors() {
      return this.outDoor;
    },
    pauseBtnText() {
      return this.playing
        ? this.$t("trajectory.Pause")
        : this.$t("trajectory.Continue");
    },
    canTogglePause() {
      return (
        Array.isArray(this.routeCoords) &&
        this.routeCoords.length > 0 &&
        !this.restartLine
      );
    },
  },
  watch: {
    outDoors() {
      this.updateRouteStyle();
    },
  },
  methods: {
    /** 室外标准底图深蓝，室外其他底图黄色，室内保持原蓝色 */
    getRouteStrokeColor() {
      if (!this.outDoor) {
        return [65, 105, 225, 0.8];
      }
      if (this.mapBaseStyle === "vec") {
        return [0, 70, 160, 0.9];
      }
      return [255, 255, 0, 0.8];
    },
    updateRouteStyle() {
      if (!this.styles || !this.styles.route) return;
      const stroke = this.styles.route.getStroke();
      if (stroke) {
        stroke.setColor(this.getRouteStrokeColor());
      }
      if (this.vectorLayer) {
        this.vectorLayer.changed();
      }
    },
    onMapStyleChange(style) {
      mapStyleMixin.methods.onMapStyleChange.call(this, style);
      this.updateRouteStyle();
    },
    changeStop() {
      // this.stop(true);
      this.goTimeOut = false;
    },
    togglePause() {
      if (!this.canTogglePause) return;
      if (this.playing) {
        this.pausePlay();
      } else {
        this.resumePlay();
      }
    },
    /** 暂停：保持当前位置与进度，不重置到起点 */
    pausePlay() {
      this.paused = true;
      this.playing = false;
      this.animating = false;
      this.goTimeOut = false;
      this.closeTime();
      this.unbindMoveFeature();
    },
    /** 继续：从当前进度接着播 */
    resumePlay() {
      if (!this.routeCoords.length) return;
      if (this.percentage >= 100) {
        this.repeatRoute();
        return;
      }
      this.goTimeOut = true;
      this.start(true);
    },
    //拖完进度条
    changeProgress() {
      this.stop(true);
      this.goTimeOut = false;
      let that = this;
      if (this.percentage == 0) {
        that.repeatRoute();
        return;
      }
      let lineData;
      if (that.outerDoor) {
        lineData = that.TrackData;
      } else {
        lineData = that.searchInfoArr;
      }
      let gpstime = (this.percentage / 100) * this.alltime + this.firsttime;
      let lastTime = that.outDoor
        ? lineData[lineData.length - 1].gpstime * 1000
        : Date.parse(new Date(lineData[lineData.length - 1].gpstime)) +
          lineData[lineData.length - 1].remaintime * 1000;

      if (lastTime < gpstime) {
        that.goTimeOut = true;
        that.restartLine = true;
        that.nextMap();
        return;
      }
      for (let i = 0; i < lineData.length; i++) {
        let time = that.outDoor
          ? lineData[i].gpstime * 1000
          : Date.parse(new Date(lineData[i].gpstime));
        let time1 = time + lineData[i].remaintime * 1000;
        if (that.outDoor) {
          if (time == gpstime || gpstime < time) {
            that.num = i;
            that.moveTime = gpstime;
            that.start();
            that.goTimeOut = true;
            return;
          }
        } else {
          if (time < gpstime && gpstime < time1) {
            that.num = i;
            that.moveTime = gpstime;
            that.start();
            that.goTimeOut = true;
            return;
          }
        }
      }
    },

    search(arr, begintime, endtime, devtype) {
      this.mapSwitching = false;
      if (this.nextMapTimer) {
        clearTimeout(this.nextMapTimer);
        this.nextMapTimer = null;
      }
      this.unbindMoveFeature();
      this.restartLine = false;
      this.percentage = 0;
      this.progressTime = "";
      this.num = 0;
      this.moveTime = 0;
      this.goTimeOut = true;
      this.beTime = begintime;
      this.enTime = endtime;
      var that = this;
      this.groundLength = 0;
      this.actionTableDataArr = arr;
      that.trajectoryUserame = arr[0][0].username;
      this.devType = devtype;

      if (devtype == 1) {
        this.iconImagSrc = "../../../static/user1.png";
      } else {
        this.iconImagSrc = "../../../static/tbox1.png";
      }
      if (!this.isOutdoorSegment(this.actionTableDataArr[0][0])) {
        // 有有效楼层 id，开始室内轨迹
        that.outDoor = false;
        that.getPointAndNearLists(that.actionTableDataArr[0]);
      } else {
        that.outDoor = true;
        // 没有楼层id，判断几条数据，2条及以上的数据时，待在室外时间为第一条和第二条数据的gpstime
        if (that.actionTableDataArr.length > 1) {
          const beginTime =
            Date.parse(new Date(that.actionTableDataArr[0][0].gpstime)) / 1000;
          const endTime =
            Date.parse(new Date(that.actionTableDataArr[1][0].gpstime)) / 1000;
          const userName = that.actionTableDataArr[0][0].username;
          that.searchOutDoor(
            userName,
            beginTime,
            endTime,
            that.actionTableDataArr[0],
            this.devType
          );
        } else {
          const beginTime = begintime;
          const endTime = endtime;
          const userName = that.actionTableDataArr[0][0].username;
          that.searchOutDoor(
            userName,
            beginTime,
            endTime,
            that.actionTableDataArr[0],
            this.devType
          );
        }
      }
    },

    getPointAndNearLists(val) {
      this.actionTableData = val;
      var that = this;
      let data = {
        groundid: this.actionTableData[0].groundid,
      };
      getPointAndNearList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          let arr = [];
          that.graphData = res.data;
          this.g = new Graphs();
          if (that.graphData.length > 0 && that.intoProjectType == 1) {
            for (let i = 0; i < that.graphData.length; i++) {
              // 自身节点也要进坐标表；原先只 push 邻居，单点停留时本楼层 eui 对不上会得到空 pathAllXY
              arr.push(that.graphData[i]);
              if (
                that.graphData[i].list &&
                that.graphData[i].list.length > 0
              ) {
                for (let j = 0; j < that.graphData[i].list.length; j++) {
                  that.g.addEdge(
                    that.graphData[i].pointid,
                    that.graphData[i].list[j].pointid
                  );
                  arr.push(that.graphData[i].list[j]);
                }
              }
            }
            let arrs = that.unique(arr);
            let paths, //所有路线
              pathOne, //两点之间最短线路
              pathOneArr, //将最短线路截取成数组
              pathAll = [], //存放所有的路线节点
              pathAllXY = []; //存放路线节点的坐标值
            if (this.actionTableData.length == 1) {
              pathOneArr = [];
              if (that.actionTableData[0].list.length > 1) {
                let lists = that.actionTableData[0].list.slice().reverse();
                let newGPSTime;
                let gpstimeValue;
                let xValue;
                let yValue;
                let newpathOneArr = [];
                lists.forEach((item) => {
                  newpathOneArr.push({
                    gpstime: item.gpstime,
                    pointid: item.eui,
                    remaintime: item.remaintime,
                    x: item.x,
                    y: item.y,
                  });
                });
                for (let i = 0; i < newpathOneArr.length - 1; i++) {
                  //每两个点之间添加1个点
                  newGPSTime = newpathOneArr[i].gpstime;
                  gpstimeValue = Math.floor(
                    (newpathOneArr[i + 1].gpstime - newpathOneArr[i].gpstime) /
                      2
                  );
                  xValue = (newpathOneArr[i + 1].x - newpathOneArr[i].x) / 2;
                  yValue = (newpathOneArr[i + 1].y - newpathOneArr[i].y) / 2;
                  newpathOneArr[i].gpstime = that.formatDatetimeGps(
                    newpathOneArr[i].gpstime
                  );
                  pathOneArr.push(newpathOneArr[i]);
                  for (let j = 1; j < 2; j++) {
                    pathOneArr.push({
                      gpstime: that.formatDatetimeGps(
                        newGPSTime + gpstimeValue * j
                      ),
                      pointid: newpathOneArr[i].pointid,
                      x: newpathOneArr[i].x + xValue * j,
                      y: newpathOneArr[i].y + yValue * j,
                    });
                  }
                }
                newpathOneArr[newpathOneArr.length - 1].gpstime =
                  that.formatDatetimeGps(
                    newpathOneArr[newpathOneArr.length - 1].gpstime
                  );
                pathOneArr.push(newpathOneArr[newpathOneArr.length - 1]);
              } else {
                let One = [
                  {
                    gpstime: that.actionTableData[0].gpstime,
                    remaintime: that.actionTableData[0].remaintime,
                    pointid: that.actionTableData[0].eui,
                    anglimit: that.actionTableData[0].anglimit, //扫描角度，15表示360°，判断是否走一半
                    beacon: 1,
                  },
                ];
                pathAll = pathAll.concat(One);
              }
              pathAll = [...pathAll, ...pathOneArr];
            } else {
              for (let k = 0; k < this.actionTableData.length; k++) {
                pathOneArr = [];
                const stayList = Array.isArray(that.actionTableData[k].list)
                  ? that.actionTableData[k].list
                  : [];
                if (stayList.length > 1) {
                  let lists = stayList.slice().reverse();
                  let newGPSTime;
                  let gpstimeValue;
                  let xValue;
                  let yValue;
                  let newpathOneArr = [];
                  lists.forEach((item) => {
                    newpathOneArr.push({
                      gpstime: item.gpstime,
                      pointid: item.eui,
                      remaintime: item.remaintime,
                      x: item.x,
                      y: item.y,
                    });
                  });
                  for (let i = 0; i < newpathOneArr.length - 1; i++) {
                    //每两个点之间添加1个点
                    newGPSTime = newpathOneArr[i].gpstime;
                    gpstimeValue = Math.floor(
                      (newpathOneArr[i + 1].gpstime -
                        newpathOneArr[i].gpstime) /
                        2
                    );
                    xValue = (newpathOneArr[i + 1].x - newpathOneArr[i].x) / 2;
                    yValue = (newpathOneArr[i + 1].y - newpathOneArr[i].y) / 2;
                    newpathOneArr[i].gpstime = that.formatDatetimeGps(
                      newpathOneArr[i].gpstime
                    );
                    pathOneArr.push(newpathOneArr[i]);
                    for (let j = 1; j < 2; j++) {
                      pathOneArr.push({
                        gpstime: that.formatDatetimeGps(
                          newGPSTime + gpstimeValue * j
                        ),
                        pointid: newpathOneArr[i].pointid,
                        x: newpathOneArr[i].x + xValue * j,
                        y: newpathOneArr[i].y + yValue * j,
                      });
                    }
                  }
                  newpathOneArr[newpathOneArr.length - 1].gpstime =
                    that.formatDatetimeGps(
                      newpathOneArr[newpathOneArr.length - 1].gpstime
                    );
                  pathOneArr.push(newpathOneArr[newpathOneArr.length - 1]);

                  pathAll = [...pathAll, ...pathOneArr];
                }
                // 最后一段停留点：列表已在上方处理；同 eui 回访（C==A）交给后面按「访问顺序」补齐
                if (k >= this.actionTableData.length - 1) {
                  continue;
                }
                let linkedToNext = false;
                for (let l = 0; l < that.graphData.length; l++) {
                  if (
                    that.actionTableData[k].eui == that.graphData[l].pointid &&
                    that.graphData[l].list.length > 0
                  ) {
                    paths = this.g.BFS(that.actionTableData[k].eui);
                    if (paths[that.actionTableData[k + 1].eui]) {
                      pathOne = paths[that.actionTableData[k + 1].eui].path;
                    } else {
                      pathOne =
                        that.actionTableData[k].eui +
                        "->" +
                        that.actionTableData[k + 1].eui;
                    }
                    pathOneArr = pathOne.split("->");
                    pathOneArr.forEach((item, index) => {
                      if (index === 0) {
                        if (stayList.length < 2) {
                          pathOneArr[index] = {
                            gpstime: that.actionTableData[k].gpstime,
                            remaintime: that.actionTableData[k].remaintime,
                            pointid: item,
                            anglimit: that.actionTableData[k].anglimit,
                          };
                        } else {
                          let remaintime =
                            stayList[stayList.length - 1].gpstime -
                            stayList[0].gpstime +
                            stayList[stayList.length - 1].remaintime;
                          pathOneArr[index] = {
                            gpstime: that.formatDatetimeGps(
                              stayList[stayList.length - 1].gpstime +
                                stayList[stayList.length - 1].remaintime
                            ),
                            remaintime:
                              that.actionTableData[k].remaintime - remaintime,
                            pointid: item,
                            anglimit: that.actionTableData[k].anglimit,
                          };
                        }
                      } else {
                        pathOneArr[index] = { pointid: item };
                      }
                    });
                    if (k != this.actionTableData.length - 2) {
                      pathOneArr.pop();
                    } else {
                      pathOneArr[pathOneArr.length - 1] = {
                        gpstime: that.actionTableData[k + 1].gpstime,
                        remaintime: that.actionTableData[k + 1].remaintime,
                        anglimit: that.actionTableData[k + 1].anglimit,
                        pointid: pathOneArr[pathOneArr.length - 1].pointid,
                      };
                    }

                    pathAll = [...pathAll, ...pathOneArr];
                    linkedToNext = true;
                  } else if (
                    that.actionTableData[k].eui == that.graphData[l].pointid &&
                    that.graphData[l].list.length === 0
                  ) {
                    // 仅有当前点、无邻接边：只加入当前点，不能当作已连到下一点
                    if (
                      stayList.length <= 1 &&
                      !pathAll.some(
                        (p, idx) =>
                          p &&
                          idx >= pathAll.length - 1 &&
                          String(p.pointid) ===
                            String(that.actionTableData[k].eui)
                      )
                    ) {
                      // 若当前点尚未作为「最近一次」出现，则追加
                      const last = pathAll[pathAll.length - 1];
                      if (
                        !last ||
                        String(last.pointid) !==
                          String(that.actionTableData[k].eui)
                      ) {
                        pathAll.push({
                          gpstime: that.actionTableData[k].gpstime,
                          remaintime: that.actionTableData[k].remaintime,
                          pointid: that.actionTableData[k].eui,
                          anglimit: that.actionTableData[k].anglimit,
                          beacon: 1,
                        });
                      }
                    }
                  }
                }
                // 未真正连到下一点时，补当前点 + 直连下一点（支持回到同一 beacon）
                if (!linkedToNext && that.actionTableData[k].eui) {
                  const cur = that.actionTableData[k];
                  const next = that.actionTableData[k + 1];
                  const last = pathAll[pathAll.length - 1];
                  if (
                    stayList.length <= 1 &&
                    (!last || String(last.pointid) !== String(cur.eui))
                  ) {
                    pathAll.push({
                      gpstime: cur.gpstime,
                      remaintime: cur.remaintime,
                      pointid: cur.eui,
                      anglimit: cur.anglimit,
                      beacon: 1,
                    });
                  }
                  if (next && next.eui) {
                    pathAll.push({
                      gpstime: next.gpstime,
                      remaintime: next.remaintime,
                      pointid: next.eui,
                      anglimit: next.anglimit,
                      beacon: 1,
                    });
                  }
                }
              }
              // 按停留「访问顺序」补齐（同一 eui 可多次出现，如 A→B→A）
              pathAll = that.ensureStayVisitsInOrder(
                pathAll,
                that.actionTableData
              );
            }
            //给每个点都加上时间

            pathAll.forEach((item) => {
              if (!item || item.pointid == null || item.pointid === "") {
                return;
              }
              let matched = false;
              arrs.forEach((val) => {
                if (String(item.pointid) != String(val.pointid)) {
                  return;
                }
                matched = true;
                if (item.anglimit) {
                  pathAllXY.push({
                    gpstime: item.gpstime,
                    x: val.nodeX,
                    y: val.nodeY,
                    beacon: 1,
                    anglimit: item.anglimit,
                    remaintime: item.remaintime,
                    pointid: item.pointid,
                  });
                } else if (item.beacon) {
                  pathAllXY.push({
                    gpstime: item.gpstime,
                    x: val.nodeX,
                    y: val.nodeY,
                    beacon: 1,
                    remaintime: item.remaintime,
                    pointid: item.pointid,
                  });
                } else if (
                  (String(item.pointid).length == 8 ||
                    String(item.pointid).length == 16) &&
                  item.x == undefined
                ) {
                  pathAllXY.push({
                    x: val.nodeX,
                    y: val.nodeY,
                    beacon: 1,
                    gpstime: item.gpstime,
                    remaintime: item.remaintime,
                    pointid: item.pointid,
                  });
                } else if (item.x || item.y) {
                  pathAllXY.push({
                    x: item.x,
                    y: item.y,
                    remaintime: item.remaintime,
                    gpstime: item.gpstime,
                    pointid: item.pointid,
                  });
                } else {
                  pathAllXY.push({
                    x: val.nodeX,
                    y: val.nodeY,
                    gpstime: item.gpstime,
                    pointid: item.pointid,
                  });
                }
              });
              // arrs 未命中时：用自身坐标或 graphData 回退，避免切楼层得到空轨迹
              if (!matched) {
                let x = item.x;
                let y = item.y;
                if (
                  (x === undefined ||
                    x === null ||
                    y === undefined ||
                    y === null) &&
                  that.graphData &&
                  that.graphData.length
                ) {
                  const node = that.graphData.find(
                    (g) => g && String(g.pointid) === String(item.pointid)
                  );
                  if (node) {
                    x = node.nodeX;
                    y = node.nodeY;
                  }
                }
                if (
                  x !== undefined &&
                  x !== null &&
                  y !== undefined &&
                  y !== null
                ) {
                  pathAllXY.push({
                    gpstime: item.gpstime,
                    x: x,
                    y: y,
                    beacon: 1,
                    anglimit: item.anglimit,
                    remaintime: item.remaintime,
                    pointid: item.pointid,
                  });
                }
              }
            });
            // 每两个之间起始点选择真实位置数据
            if (pathAllXY.length > 1) {
              pathAllXY.forEach((item, index) => {
                that.graphData.forEach((val) => {
                  if (item.pointid == val.pointid) {
                    item.anglimit = val.anglimit;
                  }
                });
                if (item.beacon == 1 && item.anglimit != 15) {
                  if (index != 0) {
                    item.x =
                      pathAllXY[index - 1].x +
                      (pathAllXY[index].x - pathAllXY[index - 1].x) / 2;
                    item.y =
                      pathAllXY[index - 1].y +
                      (pathAllXY[index].y - pathAllXY[index - 1].y) / 2;
                  } else {
                    item.x =
                      pathAllXY[index].x +
                      (pathAllXY[index + 1].x - pathAllXY[index].x) / 2;
                    item.y =
                      pathAllXY[index].y +
                      (pathAllXY[index + 1].y - pathAllXY[index].y) / 2;
                  }
                }
              });
            }
            that.searchInfo(pathAllXY, that.actionTableData[0].groundid);
          } else {
            that.searchInfo(
              that.actionTableDataArr[that.groundLength],
              that.actionTableDataArr[that.groundLength][0].groundid
            );
          }
        } else {
          that.mapSwitching = false;
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    /**
     * 按停留访问顺序补齐轨迹点。
     * 同一 beacon 可能被访问多次（如 A→B→A），不能用「eui 是否已出现」判断。
     */
    ensureStayVisitsInOrder(pathAll, stays) {
      const result = Array.isArray(pathAll) ? pathAll.slice() : [];
      let searchFrom = 0;
      (stays || []).forEach((stay) => {
        if (!stay || stay.eui == null || stay.eui === "") return;
        const eui = String(stay.eui);
        let foundAt = -1;
        for (let i = searchFrom; i < result.length; i++) {
          if (result[i] && String(result[i].pointid) === eui) {
            foundAt = i;
            break;
          }
        }
        if (foundAt >= 0) {
          result[foundAt] = {
            ...result[foundAt],
            gpstime: stay.gpstime || result[foundAt].gpstime,
            remaintime:
              stay.remaintime != null
                ? stay.remaintime
                : result[foundAt].remaintime,
            anglimit:
              stay.anglimit != null ? stay.anglimit : result[foundAt].anglimit,
            beacon: 1,
            pointid: stay.eui,
          };
          searchFrom = foundAt + 1;
        } else {
          result.splice(searchFrom, 0, {
            gpstime: stay.gpstime,
            remaintime: stay.remaintime,
            pointid: stay.eui,
            anglimit: stay.anglimit,
            beacon: 1,
          });
          searchFrom += 1;
        }
      });
      return result;
    },
    unique(arr) {
      let hash = {};
      return arr.reduce((preVal, curVal) => {
        hash[curVal.pointid]
          ? ""
          : (hash[curVal.pointid] = true && preVal.push(curVal));
        return preVal;
      }, []);
    },

    // 判断选择距离最近的子区域
    /**
     * @function 返回两点距离
     * @param {Object} obj1 坐标点1
     * @param {Object} obj2 坐标点2
     */
    backDistance(obj1, obj2) {
      return Math.abs(
        Math.sqrt(
          Math.pow(obj1.centerX - obj2.x, 2) +
            Math.pow(obj1.centerY - obj2.y, 2)
        )
      );
    },

    searchInfo(arr, groundid) {
      var that = this;
      // 切楼层后若无法生成轨迹点（如 5 楼仅 1 个停留点且坐标未匹配），跳过本段继续下一段，避免读 arr[0].gpstime 崩溃
      if (!arr || !arr.length || !arr[0] || arr[0].gpstime == null) {
        console.warn(
          "[trajectory] empty path for ground, skip to nextMap",
          groundid,
          arr
        );
        that.nextMap();
        return;
      }
      let gpstime1 = Date.parse(new Date(arr[0].gpstime));
      let last = arr[arr.length - 1];
      let gpstime2 = Date.parse(new Date(last.gpstime));
      this.firsttime = gpstime1;
      this.alltime =
        gpstime2 + (Number(last.remaintime) || 0) * 1000 - gpstime1;
      this.percentage = 0;
      this.progressTime = that.toProgressTime(arr[0].gpstime) || "";
      this.num = 0;
      this.moveTime = 0;
      this.goTimeOut = true;
      // if (that.intoProjectid != "e4pggpuy") {
      that.searchInfoArr = arr;
      // } else {
      // that.searchInfoArr = arr[0];
      // }
      this.TrackData = [];
      this.routeCoords = [];
      // if (that.intoProjectid == "e4pggpuy") {
      //   arr[0].forEach((e) => {
      //     that.routeCoords.push([parseFloat(e.x), parseFloat(e.y)]);
      //   });
      // } else {
      arr.forEach((e) => {
        that.routeCoords.push([parseFloat(e.x), parseFloat(e.y)]);
      });
      // }
      let data = {
        groundid: groundid,
      };
      getBuildGroundList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.list[0].maptype == 1) {
            const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
            that.imgUrl = base + "indoormap/" + res.data.list[0].filetype;
            that.mapInit(res.data.list[0].length, res.data.list[0].width);
          }
        }
      });
    },
    // 室内地图
    mapInit(x, y) {
      this.unbindMoveFeature();
      if (this.map) {
        this.map.setTarget(undefined);
      }
      var that = this;
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      setTimeout(() => {
        if (this.$refs.map) {
          this.$refs.map.style.width = "100%";
          this.$refs.map.style.height = "100%";
        }

        this.map = new Map({
          layers: [
            new ImageLayer({
              source: new Static({
                url: that.imgUrl,
                projection: projection,
                imageExtent: extent,
              }),
            }),
          ],
          target: this.mapName,
          view: new View({
            projection: projection,
            center: getCenter(extent),
            zoom: 1,
            maxZoom: 6,
          }),
        });
        that.addLayers();
        that.refreshMapSize();
        // 嵌入分栏布局时先按容器尺寸 fit，避免室内图只占一小块
        that.$nextTick(() => {
          if (that.map && that.map.getView && that.map.getSize) {
            const size = that.map.getSize();
            if (size && size[0] > 0 && size[1] > 0) {
              that.map.getView().fit(extent, {
                size,
                padding: [16, 16, 16, 16],
                maxZoom: 6,
              });
            }
          }
        });
      }, 0);
    },

    /**
     * 删除图层
     */
    removeVectorLayer(vectorLayer) {
      var that = this;
      if (vectorLayer) {
        that.map.removeLayer(vectorLayer);
      } else {
        if (that.vectorLayer) {
          that.map.removeLayer(that.vectorLayer);
        }
        if (that.vectorLayer2) {
          that.map.removeLayer(that.vectorLayer2);
        }
      }
    },

    changeShow() {
      if (!this.showLine) {
        this.showTime = false;
        this.showDistance = false;
      }
      // 室外：路线显隐 / 时间里程标注切换时不重建图层，避免回放重置
      if (this.outerDoor && this.vectorLayer && this.routeCoords.length) {
        this.vectorLayer.changed();
        this.refreshTextLabels();
        return;
      }
      clearTimeout(this.timeout);
      this.addLayers();
    },
    /** 室外轨迹：时间 / 路程·均速标注（与 LocationHistorical 一致） */
    refreshTextLabels() {
      const that = this;
      (this.textLayers || []).forEach((layer) => {
        if (this.map && layer) {
          this.map.removeLayer(layer);
        }
      });
      this.textLayers = [];
      if (!this.map || !this.outerDoor) return;
      const timeMarks = this.TrackData || [];
      if (!timeMarks.length) return;
      if (!this.showTime && !this.showDistance) return;

      const cumDistM = [];
      if (this.showDistance) {
        let distSumM = 0;
        timeMarks.forEach((item, index) => {
          if (index === 0) {
            cumDistM.push(0);
            return;
          }
          const prev = timeMarks[index - 1];
          distSumM +=
            that.getDistance(
              parseFloat(prev.y),
              parseFloat(prev.x),
              parseFloat(item.y),
              parseFloat(item.x)
            ) * 1000;
          cumDistM.push(distSumM);
        });
      }

      timeMarks.forEach((item, index) => {
        const label = that.buildPointLabel(item, index, timeMarks, cumDistM);
        if (!label) return;
        const itemStyle = new Style({
          text: new Text({
            textAlign: "center",
            textBaseline: "bottom",
            offsetY: -18,
            font: "bold 13px 微软雅黑",
            text: label,
            fill: new Fill({ color: "#587de5" }),
            stroke: new Stroke({ color: "#ffcc33", width: 3 }),
          }),
        });
        const featureItem = new Feature({
          geometry: new Point([
            parseFloat(item.x),
            parseFloat(item.y),
          ]),
        });
        featureItem.setStyle(itemStyle);
        const vectorLayerText = new VectorLayer({
          source: new VectorSource({
            features: [featureItem],
          }),
          renderMode: "vector",
          style: null,
          zIndex: 4,
        });
        that.map.addLayer(vectorLayerText);
        that.textLayers.push(vectorLayerText);
      });
    },
    /** Haversine，入参纬度、经度，返回公里 */
    getDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = (lat1 * Math.PI) / 180.0;
      var radLat2 = (lat2 * Math.PI) / 180.0;
      var a = radLat1 - radLat2;
      var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      return s;
    },
    formatTrackDistance(meters) {
      if (!Number.isFinite(meters) || meters <= 0) return "0m";
      if (meters >= 1000) return (meters / 1000).toFixed(2) + "km";
      return meters.toFixed(1) + "m";
    },
    formatTrackAvgSpeed(mps) {
      if (!Number.isFinite(mps) || mps <= 0) return "0km/h";
      return (mps * 3.6).toFixed(2) + "km/h";
    },
    /** 统一解析轨迹点时间：Unix 秒/毫秒或日期字符串 → 秒 */
    parseGpsTimeSec(gpstime) {
      if (gpstime == null || gpstime === "") return NaN;
      if (typeof gpstime === "number") {
        return gpstime > 1e12 ? gpstime / 1000 : gpstime;
      }
      const str = String(gpstime).trim();
      if (/^\d+(\.\d+)?$/.test(str)) {
        const n = parseFloat(str);
        return n > 1e12 ? n / 1000 : n;
      }
      const ms = Date.parse(str.replace(/-/g, "/"));
      return Number.isFinite(ms) ? ms / 1000 : NaN;
    },
    buildPointLabel(item, index, trackData, cumDistM) {
      const parts = [];
      if (this.showTime) {
        const sec = this.parseGpsTimeSec(item.gpstime);
        const timeStr = Number.isFinite(sec)
          ? this.formatDatetimeGps(sec)
          : this.toProgressTime(item.gpstime);
        if (timeStr) parts.push(timeStr);
      }
      if (this.showDistance) {
        const distM = cumDistM[index] || 0;
        const startT = this.parseGpsTimeSec(trackData[0].gpstime);
        const curT = this.parseGpsTimeSec(item.gpstime);
        const dt =
          Number.isFinite(startT) && Number.isFinite(curT) ? curT - startT : 0;
        const avgMps = dt > 0 ? distM / dt : 0;
        parts.push(
          this.$t("locationoutdoorh.distance") +
            ":" +
            this.formatTrackDistance(distM) +
            "  " +
            this.$t("locationoutdoorh.avgSpeed") +
            ":" +
            this.formatTrackAvgSpeed(avgMps)
        );
      }
      return parts.join("  ");
    },
    repeatRoute() {
      clearTimeout(this.timeout);
      this.restartLine = false;
      this.paused = false;
      this.playing = false;
      this.goTimeOut = true;
      // 回放时翻转列表，使用拷贝避免污染原始停留点顺序
      if (
        this.actionTableDataArr[0] &&
        this.actionTableDataArr[0][0] &&
        Array.isArray(this.actionTableDataArr[0][0].list)
      ) {
        this.actionTableDataArr[0][0].list =
          this.actionTableDataArr[0][0].list.slice().reverse();
      }
      this.search(
        this.actionTableDataArr,
        this.beTime,
        this.enTime,
        this.devType
      );
    },
    addLayers() {
      // const start6 = Date.now();
      let that = this;
      this.num = 0;
      that.updateRouteStyle();
      // if (this.vectorLayer) {
      // 第二次以后渲染轨迹的时候把上次的图层先删除
      that.removeVectorLayer(that.vectorLayer);
      if (that.vectorLayers && that.vectorLayers.length) {
        that.vectorLayers.forEach((layer) => {
          that.map.removeLayer(layer);
        });
      }
      that.vectorLayers = [];
      (that.textLayers || []).forEach((layer) => {
        if (that.map && layer) {
          that.map.removeLayer(layer);
        }
      });
      that.textLayers = [];
      if (that.routeCoords.length > 0) {
        that.routeLength = that.routeCoords.length;
        that.route = new LineString(that.routeCoords);
        that.outerDoor = false;
        if (that.searchInfoArr.length > 0) {
          that.outerDoor = false;
        }
        if (that.TrackData.length > 0) {
          that.outerDoor = true;
        }

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
        // 中间停留点也画标记（原先只画起终点，三条数据看起来像只有两个点）
        const stayFeatures = [];
        if (
          !that.outerDoor &&
          Array.isArray(that.actionTableData) &&
          that.actionTableData.length > 2
        ) {
          for (let i = 1; i < that.actionTableData.length - 1; i++) {
            const stay = that.actionTableData[i];
            if (!stay || !stay.eui) continue;
            let xy = null;
            const matched = (that.searchInfoArr || []).find(
              (p) => p && String(p.pointid) === String(stay.eui)
            );
            if (matched && matched.x != null && matched.y != null) {
              xy = [parseFloat(matched.x), parseFloat(matched.y)];
            } else if (
              Array.isArray(stay.list) &&
              stay.list.length &&
              stay.list[0].x != null
            ) {
              xy = [parseFloat(stay.list[0].x), parseFloat(stay.list[0].y)];
            } else {
              const g = (that.graphData || []).find(
                (p) => p && String(p.pointid) === String(stay.eui)
              );
              if (g && g.nodeX != null && g.nodeY != null) {
                xy = [parseFloat(g.nodeX), parseFloat(g.nodeY)];
              }
            }
            if (!xy || Number.isNaN(xy[0]) || Number.isNaN(xy[1])) continue;
            stayFeatures.push(
              new Feature({
                type: "icon",
                geometry: new Point(xy),
              })
            );
          }
        }
        that.vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: [
              that.routeFeature,
              // that.geoMarker,
              that.startMarker,
              ...stayFeatures,
              that.endMarker,
            ],
            // 线、标记、开始标记、结束标记
          }),
          renderMode: "vector",
          zIndex: 5,
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
          renderMode: "vector",
          // 人标在标注之上，避免时间和距离文字挡住当前位置
          zIndex: 10,
          style: new Style({
            // 设置标记样式
            image: new Icon({
              anchor: [0.5, 1], // 偏移位置
              // 控制大小
              scale: 1,
              // rotation: 0, // 旋转
              // size: [52, 26], // 图标大小
              src: that.iconImagSrc,
              // src: (process.env.BASE_URL || '/') + 'static/user2.png',

              rotateWithView: true,
            }),
          }),
        });
        // return
        this.map.addLayer(that.vectorLayer);
        this.map.addLayer(that.vectorLayer2);
        if (that.outerDoor) {
          that.refreshTextLabels();
        }
        refreshBaseTiles(this.map);
        this.start();
      }
    },
    // utc转本地
    datetimecut(UTCDateString, gps) {
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
      var dateStrGPS =
        year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
      var dateStr = mon + "-" + day + " " + hour + ":" + min + ":" + sec;
      if (gps) {
        return dateStrGPS;
      } else {
        return dateStr;
      }
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
    //时间转换
    formatDatetimeGps(row) {
      if (row == null || row == 0) {
        return "";
      }
      let date = new Date(parseInt(row) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2, true);
    },
    // 进度条时间：兼容 Unix 秒/毫秒时间戳和日期字符串
    toProgressTime(gpstime) {
      if (gpstime == null || gpstime === "") {
        return "";
      }
      const sec = this.parseGpsTimeSec(gpstime);
      if (Number.isFinite(sec)) {
        return this.formatDatetime(sec);
      }
      const str = String(gpstime).trim();
      // 已是展示串（如 MM-DD HH:mm:ss）时直接用
      if (/^\d{2}-\d{2}\s+\d{2}:\d{2}/.test(str)) return str;
      return str.length > 10 ? str.substr(5) : str;
    },
    /**
     * 按点序解析回放时刻（秒）。当前点无时间或连续点时间相同时，
     * 在前后有效时间戳之间插值，避免右上角时间卡住不动。
     */
    resolveProgressTimeSec(index, dataArr) {
      const arr = dataArr || [];
      if (!arr.length) return NaN;
      const i = Math.min(arr.length, Math.max(1, index)) - 1;

      let prev = -1;
      for (let p = i; p >= 0; p--) {
        if (Number.isFinite(this.parseGpsTimeSec(arr[p].gpstime))) {
          prev = p;
          break;
        }
      }
      if (prev < 0) {
        for (let n = i; n < arr.length; n++) {
          const sec = this.parseGpsTimeSec(arr[n].gpstime);
          if (Number.isFinite(sec)) return sec;
        }
        return NaN;
      }

      const t0 = this.parseGpsTimeSec(arr[prev].gpstime);
      let nextDiff = -1;
      for (let n = Math.max(i, prev + 1); n < arr.length; n++) {
        const sec = this.parseGpsTimeSec(arr[n].gpstime);
        if (Number.isFinite(sec) && sec !== t0) {
          nextDiff = n;
          break;
        }
      }
      if (nextDiff > prev && i >= prev && i <= nextDiff) {
        const t1 = this.parseGpsTimeSec(arr[nextDiff].gpstime);
        const ratio = (i - prev) / (nextDiff - prev);
        return t0 + (t1 - t0) * ratio;
      }
      return t0;
    },
    resolveProgressTimeLabel(index, dataArr) {
      const sec = this.resolveProgressTimeSec(index, dataArr);
      if (Number.isFinite(sec)) {
        return this.formatDatetime(sec);
      }
      return this.progressTime || "";
    },
    unbindMoveFeature() {
      if (this.vectorLayer) {
        this.vectorLayer.un("postrender", this.moveFeature);
      }
    },
    formatDateTimeForHMSS(obj) {
      if (obj == null) {
        return null;
      }
      let date = new Date(obj);
      let y = 1900 + date.getYear();
      let m = "0" + (date.getMonth() + 1);
      let d = "0" + date.getDate();
      let h = "0" + date.getHours();
      let mm = "0" + date.getMinutes();
      let s = date.getSeconds();
      if (s.toString().length < 2) {
        s = "0" + s;
      }
      return (
        y +
        "-" +
        m.substring(m.length - 2, m.length) +
        "-" +
        d.substring(d.length - 2, d.length) +
        " " +
        h.substring(h.length - 2, h.length) +
        ":" +
        mm.substring(mm.length - 2, mm.length) +
        ":" +
        s
      );
    },
    calcTimeFun(data) {
      var that = this;
      let [num, startTime] = [0, ""];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const { gpstime: time = "" } = item;
        if (!time) {
          num++;
          continue;
        } else {
          item.beacon = 1;
          const timestamp = new Date(time).getTime();
          if (num === 0) {
            startTime = timestamp;
          } else {
            const equalTime = (timestamp - startTime) / (num + 1);
            for (let j = i - num, k = 1; j < i; j++) {
              const element = data[j];
              element.gpstime = that.formatDateTimeForHMSS(
                startTime + equalTime * k
              );
              k++;
            }
            num = 0;
            startTime = timestamp;
          }
        }
      }
    },

    // 轨迹移动
    moveFeature(event) {
      if (!this.map || !this.geoMarker || !this.routeCoords.length) {
        this.unbindMoveFeature();
        return;
      }
      var that = this;
      let index = Math.ceil(this.num + this.speed / 30);
      this.num = this.num + this.speed / 30;
      // 进度条
      if (index > this.routeLength) {
        this.percentage = 100;
        this.stop(true);
        this.restartLine = true;
        this.playing = false;
        this.nextMap();
        if (that.TrackData.length > 0) {
          that.progressTime = that.resolveProgressTimeLabel(
            that.TrackData.length,
            that.TrackData
          );
        } else if (that.searchInfoArr.length > 0) {
          that.progressTime = that.resolveProgressTimeLabel(
            that.searchInfoArr.length,
            that.searchInfoArr
          );
        }
        return;
      }
      let currentPoint = new Point(this.routeCoords[index - 1]);
      // 室外
      if (that.TrackData.length > 0) {
        if (that.TrackData.length == 1) {
          that.percentage = 100;
        } else {
          that.percentage = Math.min(
            100,
            Math.round((index / that.TrackData.length) * 100)
          );
        }
        that.progressTime = that.resolveProgressTimeLabel(
          index,
          that.TrackData
        );
      }
      // 室内：按点序推进进度（A→B→A 回访时绝对时间可能回退，不能用 gpstime 算百分比）
      if (that.searchInfoArr.length > 0) {
        if (that.searchInfoArr.length == 1) {
          that.setIndoorPercentage(100);
          that.progressTime = that.resolveProgressTimeLabel(
            1,
            that.searchInfoArr
          );
        } else {
          const cur = that.searchInfoArr[index - 1];
          if (cur) {
            that.setIndoorPercentage(that.calcIndoorPercentage(index));
            that.progressTime = that.resolveProgressTimeLabel(
              index,
              that.searchInfoArr
            );

            if (Number(cur.remaintime) > 0) {
              // 停留等待：只停动画，不把人标/进度拉到整段终点
              that.unbindMoveFeature();
              that.animating = false;
              let gpstimeSec = that.parseGpsTimeSec(cur.gpstime);
              if (!Number.isFinite(gpstimeSec)) {
                gpstimeSec = that.resolveProgressTimeSec(
                  index,
                  that.searchInfoArr
                );
              }
              if (!Number.isFinite(gpstimeSec)) {
                gpstimeSec = Date.now() / 1000;
              }
              const gpstimeMs = gpstimeSec * 1000;
              let times;
              if (that.moveTime == 0) {
                times = 1;
              } else {
                times = Math.ceil((that.moveTime - gpstimeMs) / 1000) + 1;
              }
              if (times < 1) times = 1;

              that.getProgressTime(
                gpstimeMs,
                index,
                times,
                Number(cur.remaintime),
                that.moveTime
              );
            }
          }
        }
      }
      that.geoMarker.setGeometry(new Point(currentPoint.flatCoordinates));

      this.map.render(); // 开始移动动画
      // }
    },
    /**
     * 室内进度按轨迹点序计算。
     * A→B→A 等回访场景下，路径中间点时间戳可能缺失或早于前序点，
     * 用绝对时间会出现走到 B 之后进度又跳回 0。
     */
    calcIndoorPercentage(index, stayRatio) {
      const total = this.routeLength || this.searchInfoArr.length || 1;
      const ratio =
        stayRatio != null && Number.isFinite(stayRatio)
          ? Math.min(1, Math.max(0, stayRatio))
          : 0;
      // index 为当前点（1-based），停留中在当前点与下一点之间插值
      const pos = Math.min(total, Math.max(0, index - 1 + ratio));
      return Math.min(100, Math.max(0, Math.round((pos / total) * 100)));
    },
    /** 回放中进度只增不减，避免时间乱序把进度条打回 0 */
    setIndoorPercentage(value) {
      const next = Math.min(100, Math.max(0, Math.round(value)));
      if (this.playing || this.animating || this.timeout) {
        this.percentage = Math.max(this.percentage || 0, next);
      } else {
        this.percentage = next;
      }
    },
    // 计算显示时间（停留点倒计时），进度按点序插值
    getProgressTime(gpstime, index, times, remaintime, movetime) {
      let gpstimes;
      if (movetime > 0) {
        gpstimes = movetime;
      } else {
        gpstimes = gpstime;
      }
      this.moveTime = 0;
      this.closeTime();
      if (this.goTimeOut) {
        var that = this;
        this.timeout = setTimeout(function () {
          let gpstime1 = that.formatDateTimeForHMSS(gpstimes + 1000);
          gpstimes = gpstimes + 1000;
          const stayRatio = times / Math.max(1, remaintime);
          that.setIndoorPercentage(
            that.calcIndoorPercentage(index, stayRatio)
          );
          that.progressTime = gpstime1.substr(5);
          if (times >= remaintime) {
            // 跳过当前停留点，避免下一帧再次落入同一 index
            that.num = Math.max(that.num, index);
            that.moveTime = 0;
            that.start(true);
            return;
          }
          times++;
          that.getProgressTime(gpstimes, index, times, remaintime);
        }, 1000 / that.speed);
      }
    },
    closeTime() {
      clearTimeout(this.timeout);
    },
    // 点的转向角度设置  new_p 上一点的坐标 old_p 下一点的坐标
    _map_p_rotation(new_p, old_p) {
      // 90度的PI值
      var pi_90 = Math.atan2(1, 0);
      // 当前点的PI值
      var pi_ac = Math.atan2(new_p[1] - old_p[1], new_p[0] - old_p[0]);

      return pi_90 - pi_ac;
    },
    nextMap() {
      if (this.mapSwitching) return;
      this.mapSwitching = true;
      this.unbindMoveFeature();
      if (this.nextMapTimer) {
        clearTimeout(this.nextMapTimer);
      }
      let that = this;
      this.nextMapTimer = setTimeout(() => {
        this.nextMapTimer = null;
        this.groundLength += 1;
        this.restartLine = false;
        if (that.actionTableDataArr.length > that.groundLength) {
          if (
            !that.isOutdoorSegment(
              that.actionTableDataArr[that.groundLength][0]
            )
          ) {
            let data = {
              groundid: that.actionTableDataArr[that.groundLength][0].groundid,
            };
            getBuildGroundList(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                if (res.data.list[0].maptype == 1) {
                  // 有楼层id，开始室内轨迹
                  that.outDoor = false;
                  that.getPointAndNearLists(
                    that.actionTableDataArr[that.groundLength]
                  );
                } else {
                  that.mapSwitching = false;
                  that.$message({
                    message: that.$t("trajectory.switchTo3d"),
                    type: "warning",
                  });
                  that.$emit("closePopup2d", "test");
                }
              } else {
                that.mapSwitching = false;
              }
            });
          } else {
            that.outDoor = true;
            // 没有楼层Id，室外轨迹，
            // 时间判断为：还有两条及以上数据时，时间段到下一条数据，否则就为传过来的结束时间
            if (that.actionTableDataArr.length - that.groundLength > 1) {
              const beginTime =
                Date.parse(
                  new Date(
                    that.actionTableDataArr[that.groundLength][0].gpstime
                  )
                ) / 1000;
              const endTime =
                Date.parse(
                  new Date(
                    that.actionTableDataArr[that.groundLength + 1][0].gpstime
                  )
                ) / 1000;
              const userName =
                that.actionTableDataArr[that.groundLength][0].username;
              that.searchOutDoor(
                userName,
                beginTime,
                endTime,
                that.actionTableDataArr[that.groundLength],
                this.devType
              );
            } else {
              const beginTime =
                Date.parse(
                  new Date(
                    that.actionTableDataArr[that.groundLength][0].gpstime
                  )
                ) / 1000;
              const endTime = that.enTime;
              const userName = that.actionTableDataArr[0][0].username;
              that.searchOutDoor(
                userName,
                beginTime,
                endTime,
                that.actionTableDataArr[that.groundLength],
                this.devType
              );
            }
          }
        } else {
          that.mapSwitching = false;
        }
      }, 3000);
    },

    start(fromResume) {
      if (!this.map || !this.vectorLayer || !this.geoMarker) {
        return;
      }
      this.mapSwitching = false;
      this.playing = true;
      this.paused = false;
      this.animating = true;
      this.now = new Date().getTime();
      this.geoMarker.setStyle(null); // hide geoMarker 隐藏标记
      // 继续播放时不强制拉回中心，避免视角跳动
      if (this.outDoor && !fromResume) {
        this.map.getView().setCenter(this.center); // 设置下中心点
      }
      this.vectorLayer.on("postrender", this.moveFeature);
      this.map.render();
    },
    // 停止（ended=true 停在终点；false 回到起点）
    stop(ended) {
      this.animating = false;
      this.playing = false;
      this.paused = false;
      this.closeTime();
      this.unbindMoveFeature();
      if (
        this.geoMarker &&
        this.geoMarker.getGeometry() &&
        this.routeCoords &&
        this.routeCoords.length
      ) {
        const coord = ended
          ? this.routeCoords[this.routeLength - 1] ||
            this.routeCoords[this.routeCoords.length - 1]
          : this.routeCoords[0];
        if (coord) {
          this.geoMarker.getGeometry().setCoordinates(coord);
        }
      }
    },

    /** 是否为室外段（无有效楼层 id；0 也视为室外） */
    isOutdoorSegment(item) {
      if (!item) return true;
      const g = item.groundid;
      return g == null || g === "" || g === 0 || g === "0";
    },
    /**
     * 拼接连续室外段内嵌 list 为一条轨迹点列（按 gpstime 升序）。
     * list 为空时用外层 x/y 兜底。室内段不会传入本方法。
     */
    buildOutdoorTrackFromSegments(outdoorData) {
      if (!Array.isArray(outdoorData) || !outdoorData.length) {
        return [];
      }
      const points = [];
      outdoorData.forEach((seg) => {
        if (!seg) return;
        let list = Array.isArray(seg.list) ? seg.list.slice() : [];
        list = list.filter(
          (p) =>
            p &&
            p.x != null &&
            p.y != null &&
            !Number.isNaN(parseFloat(p.x)) &&
            !Number.isNaN(parseFloat(p.y))
        );
        if (list.length > 1) {
          list.sort(
            (a, b) =>
              this.parseGpsTimeSec(a.gpstime) - this.parseGpsTimeSec(b.gpstime)
          );
          points.push(...list);
        } else if (list.length === 1) {
          points.push(list[0]);
        } else if (
          seg.x != null &&
          seg.y != null &&
          !Number.isNaN(parseFloat(seg.x)) &&
          !Number.isNaN(parseFloat(seg.y))
        ) {
          points.push(seg);
        }
      });
      return points;
    },
    applyOutdoorTrack(TrackData) {
      if (!TrackData || !TrackData.length) {
        this.mapSwitching = false;
        return;
      }
      this.routeCoords = [];
      TrackData.forEach((e) => {
        this.routeCoords.push([parseFloat(e.x), parseFloat(e.y)]);
      });
      this.TrackData = TrackData;
      this.center = [TrackData[0].x, TrackData[0].y];
      const firstSec = this.parseGpsTimeSec(TrackData[0].gpstime);
      const lastSec = this.parseGpsTimeSec(
        TrackData[TrackData.length - 1].gpstime
      );
      this.firsttime = Number.isFinite(firstSec)
        ? firstSec * 1000
        : Date.parse(new Date(TrackData[0].gpstime));
      if (Number.isFinite(firstSec) && Number.isFinite(lastSec) && lastSec > firstSec) {
        this.alltime = (lastSec - firstSec) * 1000;
      } else {
        this.alltime =
          (Number(TrackData[TrackData.length - 1].remaintime) || 0) * 1000 ||
          1000;
      }
      this.initMap();
    },
    searchOutDoor(userName, beginTime, endTime, outdoorData, devType) {
      this.stop(true);
      this.searchInfoArr = [];
      var that = this;
      // 优先用 Action 连续室外段内嵌 list 拼成一条线，避免多次 getDevGpsList 重画/重置进度
      const fromList = this.buildOutdoorTrackFromSegments(outdoorData);
      const listPointCount = (outdoorData || []).reduce((n, seg) => {
        return n + (Array.isArray(seg && seg.list) ? seg.list.length : 0);
      }, 0);
      if (listPointCount > 0 && fromList.length > 0) {
        this.applyOutdoorTrack(fromList);
        return;
      }
      this.firsttime = Date.parse(new Date(outdoorData[0].gpstime));
      this.alltime = outdoorData[0].remaintime * 1000;
      let data = {
        projectid: this.$store.state.projectid,
        username: userName,
        devtype: devType,
        postype: 2,
        begintime: beginTime,
        endtime: endTime,
      };
      getDevGpsList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.list.length > 0) {
            let TrackData = res.data.list.reverse();
            that.applyOutdoorTrack(TrackData);
          } else {
            const fallback = that.buildOutdoorTrackFromSegments(outdoorData);
            that.applyOutdoorTrack(
              fallback.length ? fallback : outdoorData
            );
          }
        } else {
          that.mapSwitching = false;
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 室外地图
    initMap() {
      let that = this;
      this.unbindMoveFeature();
      if (this.map) {
        this.map.setTarget(undefined);
      }
      this.outdoorBaseLayers = createOutdoorBaseLayers(
        this.$store.state.i18n == "zh"
      );
      setTimeout(() => {
        this.map = new Map({
          target: "allmap",
          layers: [...that.outdoorBaseLayers],
          view: new View({
            projection: "EPSG:4326",
            center: that.center,
            zoom: 15,
          }),
        });
        this.map.addControl(new ScaleLine());
        that.updateRouteStyle();
        this.addLayers();
        this.addLine(this.map);
        this.refreshMapSize();
      }, 0);
    },
    refreshMapSize() {
      const resize = () => {
        if (!this.map || !this.map.updateSize) return;
        this.map.updateSize();
        // 室内像素投影：容器尺寸变化后重新 fit，避免只占一小块
        if (
          !this.outDoor &&
          this.map.getView &&
          this.routeCoords &&
          this.routeCoords.length
        ) {
          const view = this.map.getView();
          const proj = view && view.getProjection && view.getProjection();
          const extent = proj && proj.getExtent && proj.getExtent();
          const size = this.map.getSize();
          if (
            extent &&
            size &&
            size[0] > 40 &&
            size[1] > 40 &&
            typeof view.fit === "function"
          ) {
            view.fit(extent, {
              size,
              padding: [16, 16, 16, 16],
              maxZoom: 6,
            });
          }
        }
      };
      this.$nextTick(() => {
        resize();
        setTimeout(resize, 50);
        setTimeout(resize, 300);
        setTimeout(resize, 600);
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
        renderMode: "vector",
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
  },
  beforeMount() {
    this.outdoorBaseLayers = createOutdoorBaseLayers(
      this.$store.state.i18n == "zh"
    );
  },
  unmounted() {
    this.mapSwitching = true;
    if (this.nextMapTimer) {
      clearTimeout(this.nextMapTimer);
      this.nextMapTimer = null;
    }
    this.stop(true);
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }
  },
};
</script>

<style scoped>
.mapConent {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  box-sizing: border-box;
}
.control_div,
.progress_div {
  display: flex;
  width: 100%;
  max-width: 100%;
  flex-shrink: 0;
  margin: 0 !important;
  box-sizing: border-box;
  overflow: hidden;
}
.control_div {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 2px 8px;
}
.progress_div {
  flex-direction: column;
  align-items: stretch;
  padding: 8px 2px 0;
}
.progress-row {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.progress {
  width: 100% !important;
  margin: 0 !important;
}
.progress :deep(.el-progress-bar) {
  margin-right: 0%;
  padding-right: 0%;
}
.progress :deep(.el-progress__text) {
  display: none !important;
}
.progresstime-out {
  position: static;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 4px 0 auto !important;
  padding: 0;
  color: #587de5;
  white-space: nowrap;
  text-align: right;
  line-height: 28px;
  font-size: 18px;
  font-weight: bolder;
  z-index: 1;
}
.progresstime-out .progresstime-line,
.progresstime-out .progresstime-sep {
  margin: 0 !important;
  font-size: 18px;
}
.restart {
  padding: 7px 12px !important;
  margin: 0 !important;
  height: 28px !important;
  flex: 0 0 auto !important;
}
.mapContent {
  margin: 0 !important;
  width: 100%;
  max-width: 100%;
  flex: 1 1 0;
  min-height: 0;
  height: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
}
.allmap,
#allmap {
  flex: 1 1 0;
  min-height: 0;
  height: 100%;
  width: 100%;
  max-width: 100%;
  margin: 0 !important;
  background-color: white;
  box-sizing: border-box;
}

.block {
  flex: 1 1 auto;
  width: auto;
  max-width: calc(100% - 160px);
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  /* 三组之间固定间距，从左向右排列 */
  gap: 24px;
  margin: 0 !important;
  padding: 0;
  box-sizing: border-box;
}
.block-group {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto !important;
  gap: 10px;
  /* 抵消 App.vue * { margin: 0 auto } 把控件左右拉开 */
  margin: 0 !important;
  min-height: 28px;
}
.block-group > * {
  margin-left: 0 !important;
  margin-right: 0 !important;
  flex: 0 0 auto;
}
.block-speed .speed-label {
  line-height: 28px;
  color: #606266;
  white-space: nowrap;
  margin: 0 !important;
}
.speed-slider {
  flex: 0 0 140px !important;
  width: 140px !important;
  min-width: 120px;
  max-width: 160px;
  height: 28px;
  display: flex;
  align-items: center;
  margin: 0 !important;
}
.speed-slider :deep(.el-slider) {
  width: 100%;
  margin: 0 !important;
}
.show_line {
  margin: 0 !important;
  white-space: nowrap;
  height: 28px;
  display: inline-flex !important;
  align-items: center;
}
.show_line :deep(.el-checkbox__label) {
  padding-left: 6px;
}
.block-actions :deep(.el-button + .el-button) {
  margin-left: 8px !important;
}
</style>
