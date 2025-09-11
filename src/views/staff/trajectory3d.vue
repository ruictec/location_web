<template>
  <div class="mapConent">
    <!-- 轨迹回放控件 -->
    <div class="panel" id="panel">
      <div class="progressBox">
        <!-- 播放进度条 -->
        <el-slider class="progress" v-model="percentage" disabled></el-slider>
      </div>
      <div class="btnBox">
        <!-- 播放按钮 -->
        <div class="left">
          <i
            id="playBtn"
            class="el-icon-video-play"
            @click="onHandlePlayBtn('play')"
          ></i>
          <i class="el-icon-video-pause" @click="onHandleBtn('pause')"></i>
        </div>
        <!-- 倍速选择 -->
        <div class="right">
          <span id="speed_0.5" @click="onHandleBtn('speed', 0.5)">x0.5</span>
          <span id="speed_1" class="active" @click="onHandleBtn('speed', 1)"
            >x1</span
          >
          <span id="speed_1.5" @click="onHandleBtn('speed', 1.5)">x1.5</span>
          <span id="speed_2" @click="onHandleBtn('speed', 2)">x2</span>
          <span id="speed_3" @click="onHandleBtn('speed', 3)">x3</span>
        </div>
      </div>
    </div>
    <div id="fengmap"></div>
  </div>
</template>
<script>
import host from "../../host";
// import "../../../static/layui/layui.js";
// import '../../../static/layui/css/layui.css'
import {
  getBuildGroundList,
  getPointAndNearList,
  getGround,
} from "../../axios/api";
import Graphs from "./trajectory2.js";

// import fengmap from "fengmap/build/fengmap.map.min"; //核心包
// import "fengmap/build/fengmap.analyser.min"; //分析器
// import "fengmap/build/fengmap.plugin.min"; //插件包
// import "fengmap/build/fengmap.effect.min"; //特效包
// import "fengmap/build/fengmap.plugins-compositemarker.min"; //复合标注包
// import "fengmap/build/fengmap.plugins-mapedit.min"; //绘图包
// import "fengmap/build/fengmap.plugins-track-player.min"; //轨迹回放包
// import "fengmap/build/toolBarStyle.css";

import fengmap from "fengmap/build/fengmap.map.min"; //核心包
import "fengmap/build/fengmap.plugin.ui.min"; //UI控件包
import "fengmap/build/fengmap.analyser.min"; //分析器包
import "fengmap/build/fengmap.plugin.navi.min"; //导航包
import "fengmap/build/fengmap.effect.min"; //特效包
import "fengmap/build/fengmap.plugin.markers.min"; //特殊标注包
import "fengmap/build/fengmap.plugin.draw.min"; //绘图包
import "fengmap/build/fengmap.plugin.location.min"; //位置服务相关功能包
import "fengmap/build/fengmap.plugin.export.min"; //打印/出图包
import "fengmap/build/fengmap.plugin.layers.min"; //附加图层包
import "fengmap/build/fengmap.plugin.debug.min"; //性能监控包
import "fengmap/build/toolBarStyle.css";

export default {
  name: "trajectorys",
  data() {
    return {
      devtype: "",
      iconImagSrc: "",
      // 事件响应 - 拾取类型
      typeEnum: {
        8192: "FACILITY",
        16384: "LABEL",
        4096: "MODEL",
        64: "TEXT_MARKER",
        8: "IMAGE_MARKER",
      },
      intoProjectid: this.$store.state.intoProjectid,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      map: "",
      tracksPlayer: "", //轨迹回放类
      speed: 1, //默认速度
      speedMultiple: 1, //默认倍速
      sliderIns: "", //滑块实例
      percentage: 0, //进度
      startValue: "", //滑块开始值
      endValue: "", //滑块结束值
      isPause: false, //是否在暂停状态
      isComplete: false, //是否播放完成，播放完成后需要先调用start方法，再执行play
      coordMarkers: [], //起始点图标

      actionTableDataArr: "",
      actionTableData: "",
      graphData: "",
      g: "",
      groundLength: 0,
    };
  },
  methods: {
    search(arr, begintime, endtime, devtype) {
      var that = this;
      if (devtype == 1) {
        this.iconImagSrc = "../../../static/user1.png";
      } else {
        this.iconImagSrc = "../../../static/tbox1.png";
      }
      this.startValue = begintime * 1000;
      this.endValue = endtime * 1000;
      this.actionTableDataArr = arr;
      this.groundLength = 0;
      that.getPointAndNearLists(that.actionTableDataArr[0]);
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
          that.g = new Graphs();
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
                pathOneArr.push({
                  gpstime: that.actionTableData[0].gpstime,
                  remaintime: that.actionTableData[0].remaintime,
                  pointid: that.actionTableData[0].eui,
                  anglimit: that.actionTableData[0].anglimit,
                });
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
              for (let k = 0; k < this.actionTableData.length - 1; k++) {
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
                } else {
                  // let One = [
                  //   {
                  //     gpstime: that.actionTableData[k].gpstime,
                  //     remaintime: that.actionTableData[k].remaintime,
                  //     pointid: that.actionTableData[k].eui,
                  //     anglimit: that.actionTableData[k].anglimit, //扫描角度，15表示360°，判断是否走一半
                  //   },
                  // ];
                  // console.log(One);
                  // console.log(pathAll);
                  // pathAll = pathAll.concat(One);
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
                        pathOneArr[index] = {
                          pointid: item,
                        };
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
                    // pathAll = [...pathAll, ...pathOneArr];
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
                pathAll = [...pathAll, ...pathOneArr];
              }
            }
            //给每个点都加上时间
            pathAll.forEach((item) => {
              arrs.forEach((val) => {
                if (item.pointid == val.pointid) {
                  if (item.anglimit) {
                    pathAllXY.push({
                      time: item.gpstime,
                      x: val.nodeX,
                      y: val.nodeY,
                      beacon: 1,
                      anglimit: item.anglimit,
                      remaintime: item.remaintime,
                      pointid: item.pointid,
                    });
                  } else if (item.beacon) {
                    pathAllXY.push({
                      time: item.gpstime,
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
                      time: item.gpstime,
                      remaintime: item.remaintime,
                      pointid: item.pointid,
                    });
                  } else if (item.x || item.y) {
                    pathAllXY.push({
                      x: item.x,
                      y: item.y,
                      remaintime: item.remaintime,
                      time: item.gpstime,
                      pointid: item.pointid,
                    });
                  } else {
                    pathAllXY.push({
                      x: val.nodeX,
                      y: val.nodeY,
                      time: item.gpstime,
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
            // this.tranchid = [];
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
    searchInfo(arr, groundid) {
      var that = this;
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
          getGround(
            { buildid: res.data.list[0].buildid },
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((ress) => {
            if (ress.code == 1001) {
              let groundListCopy = [];
              for (let i = 0; i < ress.data.length; i++) {
                let groundinfo = {
                  groundid: ress.data[i].id,
                  ground: ress.data[i].ground,
                  newground: i + 1,
                };
                groundListCopy.push(groundinfo);
              }
              let newGround = groundListCopy.find(function (item) {
                return item.ground == res.data.list[0].ground;
              });
              arr.forEach((item) => {
                item.level = newGround.newground;
              });
              that.mapInit(
                res.data.list[0].appname,
                res.data.list[0].mapkey,
                res.data.list[0].filename,
                newGround.newground,
                arr
              );
            }
          });
        }
      });
    },
    mapOut() {
      // 更改上一次选中状态
      var preDom = document.getElementById(`speed_${this.speedMultiple}`);
      preDom.classList.remove("active");
      // 选中当前倍速
      var curDom = document.getElementById(`speed_1`);
      curDom.classList.add("active");
      this.speedMultiple = 1;
      this.map.dispose();
      this.map = null;
    },
    mapInit(appName, key, mapID, level, arr) {
      var that = this;
      if (this.map) {
        that.map.dispose();
        that.map = null;
      }
      var options = {
        container: document.getElementById("fengmap"),
        appName: appName,
        key: key,
        mapID: mapID,
        level: level,
        visibleLevels: [level],
        floorSpace: 50,
        // mapURL: "/data/",
        // themeURL: "/data/theme/",
      };
      this.map = new fengmap.FMMap(options);
      this.map.on("loaded", function () {
        console.log("加载完成1");
        that.addTracks(arr);
      });
      // this.map.on("loadComplete", function () {
      //   console.log("加载完成");
      // });
    },

    // 渲染轨迹回放数据
    addTracks(arr) {
      var that = this;
      // 自行添加起终点marker
      that.addStartAndEndMarker(arr);
      // 初始化轨迹播放插件
      that.tracksPlayer = new fengmap.FMTracksPlayer(that.map);
      // 设置路劲轨迹数据
      that.tracksPlayer.setTracks(arr);
      // 设置线的样式
      that.tracksPlayer.setTrackStyle({
        width: 6,
        radius: 1,
        type: fengmap.FMLineType.ARROW,
        animate: true,
        height: 0,
      });
      // 设置定位点图标1 - LOCATION_MARKER
      var locationMarker = {
        type: fengmap.FMType.LOCATION_MARKER,
        options: {
          // 说明：Fengmap 示例图标改为从环境变量读取基础地址
          url: process.env.VUE_APP_FENGMAP_IMG_BASE + '/bluedot.png',
          height: 0.2,
          x: arr[0].x,
          y: arr[0].y,
          level: arr[0].level,
          size: 48,
        },
      };
      // 设置定位点图标
      that.tracksPlayer.setMarkerStyle(
        locationMarker.type,
        locationMarker.options
      );
      // 将轨迹线和定位点渲染到地图上
      that.tracksPlayer.render();
      // 设置轨迹回放速度
      that.tracksPlayer.setSpeed(that.speed);
      // 播放中的回调函数
      this.onHandlePlayBtn("play");
      that.tracksPlayer.on("playing", function (params) {
        var progress = params.progress; // 当前播放进度时间戳
        var level = params.level; // 所在楼层
        // 设置进度条
        var curValue = progress - that.startValue;
        that.percentage =
          ((progress - that.startValue) / (that.endValue - that.startValue)) *
          100;
        // that.sliderIns.setValue(curValue);
      });
      // 轨迹播放完成回调函数
      that.tracksPlayer.on("complete", function () {
        that.isComplete = true;
        that.nextMAp();
        // 更改播放按钮状态
        // var dom = document.getElementById("playBtn");
        // dom.classList.remove("icon-zanting");
        // dom.classList.add("icon-yunhang");
        that.isPause = false;
      });
    },
    nextMAp() {
      let that = this;
      setTimeout(() => {
        this.groundLength += 1;
        // this.restartLine = false;
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
                if (res.data.list[0].maptype == 2) {
                  // 更改上一次选中状态
                  var preDom = document.getElementById(
                    `speed_${that.speedMultiple}`
                  );
                  preDom.classList.remove("active");
                  // 选中当前倍速
                  var curDom = document.getElementById(`speed_1`);
                  curDom.classList.add("active");
                  that.speedMultiple = 1;
                  // 有楼层id，开始室内轨迹
                  that.getPointAndNearLists(
                    that.actionTableDataArr[that.groundLength]
                  );
                } else {
                  that.$emit("closePopup2d", "test");
                }
              }
            });
          }
        } else {
          that.percentage = 100;
        }
      }, 3000);
    },
    /* 播放按钮交互 */
    onHandlePlayBtn(val) {
      var that = this;
      if (val == "play") {
        that.onHandleBtn("play");
        that.isPause = false;
      } else if (val == "pause") {
        that.onHandleBtn("pause");
        that.isPause = true;
      }
      // var dom = document.getElementById("playBtn");
      // if (dom.classList.contains("icon-yunhang")) {
      //   // 开始、继续播放
      //   onHandleBtn("play");
      //   dom.classList.remove("icon-yunhang");
      //   dom.classList.add("icon-zanting");
      //   that.isPause = false;
      // } else {
      //   // 暂停播放
      //   onHandleBtn("pause");
      //   dom.classList.remove("icon-zanting");
      //   dom.classList.add("icon-yunhang");
      //   that.isPause = true;
      // }
    },
    /* 按钮操作 */
    onHandleBtn(type, value) {
      var that = this;
      switch (type) {
        case "play":
          if (that.isComplete) {
            // 轨迹播放到开始
            that.tracksPlayer.start();
            that.tracksPlayer.play();
            that.isComplete = false;
          } else {
            // 播放
            that.tracksPlayer.play();
          }
          break;
        case "pause":
          // 暂停
          that.tracksPlayer.pause();
          break;
        case "stop":
          // 轨迹播放到最后
          that.tracksPlayer.stop();
          // 设置进度条
          // that.sliderIns.setValue(that.endValue);
          break;
        case "speed":
          // 设置播放速度
          var _speed = value * that.speed;
          that.tracksPlayer.setSpeed(_speed);
          // 更新按钮选中状态
          that.updateBtnUI(value);
          break;
        case "progress":
          // 设置轨迹的进度
          that.tracksPlayer.setProgress(value);
          break;
        default:
          break;
      }
    },
    /* 添加起终点marker */
    addStartAndEndMarker(arr) {
      var that = this;
      var coords = [
        {
          x: arr[0].x,
          y: arr[0].y,
          level: arr[0].level,
          url: process.env.VUE_APP_FENGMAP_IMG_BASE + '/start.png',
        },
        {
          x: arr[arr.length - 1].x,
          y: arr[arr.length - 1].y,
          level: arr[arr.length - 1].level,
          url: process.env.VUE_APP_FENGMAP_IMG_BASE + '/end.png',
        },
      ];
      for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var im = new fengmap.FMImageMarker({
          x: coord.x,
          y: coord.y,
          url: coord.url,
          size: 32,
          height: 0.2,
          anchor: fengmap.FMMarkerAnchor.BOTTOM,
          depth: false,
          collision: true,
        });
        var floor = that.map.getFloor(coord.level);
        im.addTo(floor);
        that.coordMarkers.push(im);
      }
    },

    /* 更新倍速按钮选中状态 */
    updateBtnUI(value) {
      var that = this;
      // 更改上一次选中状态
      var preDom = document.getElementById(`speed_${that.speedMultiple}`);
      preDom.classList.remove("active");
      // 选中当前倍速
      var curDom = document.getElementById(`speed_${value}`);
      curDom.classList.add("active");
      that.speedMultiple = value;
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
    // 时间转换
    formatDateRecv(time) {
      if (time == null || time == 0) {
        return "";
      }
      let date = new Date(parseInt(time));
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
#fengmap {
  margin-top: 1%;
  height: 700px;
  width: 100%;
  display: flex;
  position: relative;
}
.panel {
  display: flex;
  flex-direction: column;
}
.progressBox {
  width: 100%;
}
.progress {
  width: 100% !important;
}
.btnBox {
  display: flex;
}
.left i {
  font-size: 26px;
  margin-right: 4px;
  line-height: 22px;
  cursor: pointer;
}
.left i:first-child {
  color: #2f65ee;
}
.left i:last-child {
  margin-right: 0;
  color: #000;
}
.right {
  margin-left: 5px;
}
.active {
  background-color: skyblue !important;
}
.right span {
  display: inline-block;
  width: 38px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #bfbfbf;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 22px;
  text-align: center;
  cursor: pointer;
  margin-right: 2px;
}
</style>
