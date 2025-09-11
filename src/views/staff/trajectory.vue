<template>
  <div class="mapConent">
    <div class="progress_div">
      <div @mousedown="changeStop" style="width: 100%">
        <el-slider
          class="progress"
          v-model="percentage"
          @change="changeProgress"
        ></el-slider>
      </div>

      <div class="block">
        <span style="white-space: nowrap">{{ $t("trajectory.Speed") }}</span>
        <div style="width: 50%">
          <el-slider v-model="speed" :step="1" :max="10" :min="1"> </el-slider>
        </div>
        <el-checkbox
          v-model="showLine"
          @change="changeShow()"
          class="show_line"
          >{{ $t("trajectory.Showroute") }}</el-checkbox
        ><el-button
          type="primary"
          class="restart"
          :disabled="restartLine"
          @click="repeatRoute()"
          >{{ $t("trajectory.Trackplayback") }}</el-button
        >
      </div>
    </div>

    <div class="mapContent">
      <div id="allmap" ref="map" class="allmap">
        <span class="progresstime"
          >{{ progressTime }}<br />
          {{ trajectoryUserame }}
        </span>
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
import OSM from "ol/source/OSM";
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
export default {
  name: "trajectory",
  data() {
    return {
      openlayersSource: "",
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
          // 线的样式
          stroke: new Stroke({
            width: 3,
            // color: [65, 105, 225, 0.8],
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
      restartLine: false, //轨迹回放
      trajectoryUserame: "",
      timeout: "",
      alltime: "",
      firsttime: "",
      iconImagSrc: "",
      goTimeOut: true,
      devType: "",
      moveTime: 0,
      outerDoor: false, //是否室外轨迹
    };
  },
  computed: {
    outDoors() {
      return this.outDoor;
    },
  },
  watch: {
    outDoors(val) {
      if (val == false) {
        this.styles.route = new Style({
          // 线的样式
          stroke: new Stroke({
            width: 3,
            color: [65, 105, 225, 0.8],
          }),
        });
      } else {
        this.styles.route = new Style({
          // 线的样式
          stroke: new Stroke({
            width: 3,
            color: [255, 255, 0, 0.8],
          }),
        });
      }
    },
  },
  methods: {
    changeStop() {
      // this.stop(true);
      this.goTimeOut = false;
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
      this.restartLine = false;
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
      if (this.actionTableDataArr[0][0].groundid) {
        // 有楼层id，开始室内轨迹
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
              if (that.graphData[i].list.length > 0) {
                for (let j = 0; j < that.graphData[i].list.length; j++) {
                  that.g.addEdge(
                    that.graphData[i].pointid,
                    that.graphData[i].list[j].pointid
                  );
                  arr.push(that.graphData[i].list[j]);
                }
              } else {
                arr.push(that.graphData[i]);
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
                let lists = that.actionTableData[0].list.reverse();
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
                  },
                ];
                pathAll = pathAll.concat(One);
              }
              pathAll = [...pathAll, ...pathOneArr];
            } else {
              for (let k = 0; k < this.actionTableData.length-1; k++) {
                pathOneArr = [];
                if (that.actionTableData[k].list.length > 1) {
                  let lists = that.actionTableData[k].list.reverse();
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
                        if (that.actionTableData[k].list.length < 2) {
                          pathOneArr[index] = {
                            gpstime: that.actionTableData[k].gpstime,
                            remaintime: that.actionTableData[k].remaintime,
                            pointid: item,
                            anglimit: that.actionTableData[k].anglimit,
                          };
                        } else {
                          let remaintime =
                            that.actionTableData[k].list[
                              that.actionTableData[k].list.length - 1
                            ].gpstime -
                            that.actionTableData[k].list[0].gpstime +
                            that.actionTableData[k].list[
                              that.actionTableData[k].list.length - 1
                            ].remaintime;
                          pathOneArr[index] = {
                            gpstime: that.formatDatetimeGps(
                              that.actionTableData[k].list[
                                that.actionTableData[k].list.length - 1
                              ].gpstime +
                                that.actionTableData[k].list[
                                  that.actionTableData[k].list.length - 1
                                ].remaintime
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
                        anglimit: that.actionTableData[k].anglimit,
                        pointid: pathOneArr[pathOneArr.length - 1].pointid,
                      };
                    }

                    pathAll = [...pathAll, ...pathOneArr];
                  } else if (
                    that.actionTableData[k].eui == that.graphData[l].pointid &&
                    that.graphData[l].list.length === 0
                  ) {
                    let One = [
                      {
                        gpstime: that.actionTableData[k].gpstime,
                        remaintime: that.actionTableData[k].remaintime,
                        pointid: that.actionTableData[k].eui,
                        anglimit: that.actionTableData[k].anglimit, //扫描角度，15表示360°，判断是否走一半
                      },
                    ];
                    pathAll = pathAll.concat(One);
                  }
                }
              }
            }
            //给每个点都加上时间

            pathAll.forEach((item) => {
              arrs.forEach((val) => {
                if (item.pointid == val.pointid) {
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
                    (item.pointid.length == 8 || item.pointid.length == 16) &&
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
                }
              });
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
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
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
      let gpstime1 = Date.parse(new Date(arr[0].gpstime));
      let gpstime2 = Date.parse(new Date(arr[arr.length - 1].gpstime));
      this.firsttime = gpstime1;
      this.alltime =
        gpstime2 + arr[arr.length - 1].remaintime * 1000 - gpstime1;
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
      if (this.map) {
        this.map.setTarget("sss");
      }
      var that = this;
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      setTimeout(() => {
        this.$refs.map.style.width = "100%";
        this.$refs.map.style.height = "99%";

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
      clearTimeout(this.timeout);
      this.addLayers();
    },
    repeatRoute() {
      clearTimeout(this.timeout);
      this.restartLine = true;
      this.goTimeOut = true;
      this.actionTableDataArr[0][0].list.reverse();
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
      // if (this.vectorLayer) {
      // 第二次以后渲染轨迹的时候把上次的图层先删除
      that.removeVectorLayer(that.vectorLayer);
      // }
      let list = this.map.getLayers().getArray();
      for (let i = list.length - 1; i > 0; i--) {
        if (
          list[i].getSource().getFeatures()[0].style_ &&
          list[i].getSource().getFeatures()[0].style_.text_
        ) {
          that.map.removeLayer(list[i]);
        }
      }
      if (that.routeCoords.length > 0) {
        that.routeLength = that.routeCoords.length;
        that.route = new LineString(that.routeCoords);
        let timeMarks = [];
        that.outerDoor = false;
        if (that.searchInfoArr.length > 0) {
          that.routeCoords.forEach((item, index) => {
            let marker = this.searchInfoArr[index];
            if (marker.gpstime) {
              timeMarks.push(marker);
            }
          });
          that.outerDoor = false;
        }
        if (that.TrackData.length > 0) {
          timeMarks = that.TrackData;
          that.outerDoor = true;
        }
        that.vectorLayers = [];
        timeMarks.forEach((item) => {
          // let time = outerDoor
          //   ? that.formatDatetime(item.gpstime)
          //   : item.gpstime;
          let itemStyle = new Style({
            text: new Text({
              // 位置
              textAlign: "center",
              // 基准线
              textBaseline: "middle",
              // 文字样式
              font: "bold 13px 微软雅黑",
              // 文本内容
              // text: that.showLine ? time : "",
              // 文字颜色
              fill: new Fill({ color: "#587de5" }),
              // 文字背景
              stroke: new Stroke({ color: "#ffcc33", width: 3 }),
            }),
          });

          let featureItem = new Feature({
            beacon: item.beacon ? "1" : "",
            geometry: new Point([item.x, item.y]),
          });
          featureItem.setStyle(itemStyle);

          let vectorLayer = new VectorLayer({
            source: new VectorSource({
              features: [featureItem],
            }),

            zIndex: 9999,
          });
          this.vectorLayers.push(vectorLayer);
          // if (this.showLine) {
          //   that.map.addLayer(vectorLayer);
          // }
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
              anchor: [0.5, 1], // 偏移位置
              // 控制大小
              scale: 1,
              // rotation: 0, // 旋转
              // size: [52, 26], // 图标大小
              src: that.iconImagSrc,
              // src: require("../../../static/user2.png"),

              rotateWithView: true,
            }),
          }),
          zIndex: 10000,
        });
        // return
        this.map.addLayer(that.vectorLayer);
        this.map.addLayer(that.vectorLayer2);
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
      var that = this;
      let index = Math.ceil(this.num + this.speed / 30);
      this.num = this.num + this.speed / 30;
      // 进度条
      if (index > this.routeLength) {
        this.percentage = 100;
        this.stop(true);
        this.restartLine = true;
        this.nextMap();
        if (that.TrackData.length > 0) {
          that.progressTime = that.TrackData[that.TrackData.length - 1].gpstime
            ? that.formatDatetime(
                that.TrackData[that.TrackData.length - 1].gpstime
              )
            : "";
        }
        if (that.searchInfoArr.length > 0) {
          that.progressTime = that.searchInfoArr[0].gpstime
            ? that.searchInfoArr[0].gpstime.substr(5)
            : "";
        }
        return;
      }
      let currentPoint = new Point(this.routeCoords[index - 1]);
      // 室外
      if (that.TrackData.length > 0) {
        if (that.TrackData.length == 1) {
          that.percentage = 100;
          that.progressTime = that.TrackData[0].gpstime
            ? that.TrackData[0].gpstime.substr(5)
            : "";
        } else {
          that.percentage = Math.round((index / that.TrackData.length) * 100);
          that.progressTime = that.TrackData[index - 1].gpstime
            ? that.formatDatetime(that.TrackData[index - 1].gpstime)
            : that.progressTime;
        }
      }
      // 室内
      if (that.searchInfoArr.length > 0) {
        if (that.searchInfoArr.length == 1) {
          that.percentage = 100;
        } else {
          that.progressTime = that.searchInfoArr[index - 1].gpstime
            ? that.searchInfoArr[index - 1].gpstime.substr(5)
            : that.progressTime;

          if (that.searchInfoArr[index - 1].remaintime > 0) {
            this.stop(true);
            let gpstime = Date.parse(
              new Date(that.searchInfoArr[index - 1].gpstime)
            );
            let times;
            if (that.moveTime == 0) {
              times = 1;
            } else {
              times = Math.ceil((that.moveTime - gpstime) / 1000) + 1;
            }

            that.getProgressTime(
              gpstime,
              index,
              times,
              that.searchInfoArr[index - 1].remaintime,
              that.moveTime
            );
          }
        }
      }
      that.geoMarker.setGeometry(new Point(currentPoint.flatCoordinates));

      this.map.render(); // 开始移动动画
      // }
    },
    // 计算显示时间
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
          that.percentage = Math.round(
            ((gpstimes - that.firsttime) / that.alltime) * 100
          );
          that.progressTime = gpstime1.substr(5);
          if (times == remaintime) {
            that.num++;
            that.start();
            return;
          } else {
            times++;
            // that.getProgressTime(gpstimes, index, times, remaintime);
            setTimeout(
              that.getProgressTime(gpstimes, index, times, remaintime),
              0
            );
          }
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
      let that = this;
      setTimeout(() => {
        this.groundLength += 1;
        this.restartLine = false;
        if (that.actionTableDataArr.length > that.groundLength) {
          if (that.actionTableDataArr[that.groundLength][0].groundid) {
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
                  that.$emit("closePopup2d", "test");
                }
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
        }
      }, 3000);
    },

    start() {
      this.now = new Date().getTime();
      this.geoMarker.setStyle(null); // hide geoMarker 隐藏标记
      if (this.outDoor) {
        this.map.getView().setCenter(this.center); // 设置下中心点
      }
      this.vectorLayer.on("postrender", this.moveFeature);
      this.map.render();
    },
    // 停止
    stop(ended) {
      this.animating = false;
      let coord = ended
        ? this.routeCoords[this.routeLength - 1]
        : this.routeCoords[0];
      let geometry = this.geoMarker.getGeometry().setCoordinates(coord);
      this.vectorLayer.un("postrender", this.moveFeature); // 删除侦听器
    },

    searchOutDoor(userName, beginTime, endTime, outdoorData, devType) {
      this.firsttime = Date.parse(new Date(outdoorData[0].gpstime));
      this.alltime = outdoorData[0].remaintime * 1000;
      this.searchInfoArr = [];
      var that = this;
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
          that.routeCoords = [];
          if (res.data.list.length > 0) {
            let TrackData = res.data.list.reverse();
            TrackData.forEach((e) => {
              that.routeCoords.push([parseFloat(e.x), parseFloat(e.y)]);
            });
            that.TrackData = TrackData;
            that.center = [TrackData[0].x, TrackData[0].y];
            that.initMap();
          } else {
            that.routeCoords.push([
              parseFloat(outdoorData[0].x),
              parseFloat(outdoorData[0].y),
            ]);
            that.TrackData = outdoorData;
            that.center = [outdoorData[0].x, outdoorData[0].y];
            that.initMap();
            // that.$message({
            //   message: that.$t("buildingmanagement.nodata"),
            //   type: "warning"
            // });
          }
        } else {
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
      if (this.map) {
        this.map.setTarget("sss");
      }
      setTimeout(() => {
        this.map = new Map({
          target: "allmap",
          layers: [
            new TileLayer({
              className: "baseLayerClass",
              source: that.openlayersSource,
            }),
          ],
          view: new View({
            projection: "EPSG:4326",
            center: that.center,
            zoom: 15,
          }),
        });
        this.map.addControl(new ScaleLine());
        this.addLayers();
        this.addLine(this.map);
      }, 0);
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
  },
  beforeMount() {
    if (this.$store.state.i18n == "zh") {
      // 说明：瓦片地址改为读取环境变量，默认保持当前地址
      this.openlayersSource = new OSM({
        url: process.env.VUE_APP_TILE_URL_TEMPLATE,
        crossOrigin: "",
      });
    } else {
      this.openlayersSource = new OSM();
    }
  },
  destroyed() {
    this.stop(true);
  },
};
</script>

<style scoped>
.mapConent {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.progress_div {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  align-items: center;
}
.progress {
  width: 98% !important;
  margin-left: 2%;
}
.progress >>> .el-progress-bar {
  margin-right: 0%;
  padding-right: 0%;
}
.progress >>> .el-progress__text {
  display: none !important;
}
.progresstime {
  color: #587de5;
  white-space: nowrap;
  position: absolute;
  right: 20px;
  z-index: 999;
  font-size: large;
  font-weight: bolder;
}
.restart {
  padding: 8px 12px;
  margin-left: 5px;
}
.mapContent {
  margin-top: 1%;
  width: 100%;
  height: 100%;
}
#allmap {
  height: 99%;
  width: 100%;
  background-color: white;
}

#allmap >>> .baseLayerClass {
  filter: grayscale(100%) sepia(51%) invert(100%) saturate(350%);
}
.block {
  width: 35%;
  display: flex;
  align-items: center;
  margin-left: 2%;
}
.show_line {
  margin-left: 10px;
}
</style>
