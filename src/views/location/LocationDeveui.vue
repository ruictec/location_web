<template>
  <div class="content">
    <el-main>
      <div class="inputContent" style="display: flex">
        <el-form
          class="demo-form-inline"
          :model="searchList"
          style="display: flex; white-space: nowrap; margin-left: 0"
        >
          <el-form-item
            :label="$t('floormanagement.device')"
            style="display: flex; margin-right: 0"
          >
            <el-select
              v-model="searchList.deveui"
              clearable
              filterable
              :placeholder="$t('terminal.choose')"
            >
              <el-option
                v-for="item in mapInfo"
                :key="item.deveui"
                :label="item.deveui"
                :value="item.deveui"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            style="display: flex; margin-left: 4%; margin-right: 2%"
          >
            <el-button type="primary" class="querry" @click="searchInfo()">{{
              $t("mapmanagements.search")
            }}</el-button>
            <el-button type="primary" class="reset" @click="clearBtn()">{{
              $t("mapmanagements.reset")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="mmm" style="margin-top: 0; height: 100%">
        <div id="allmap" ref="map" class=""></div>
        <!-- 左键显示内容的 -->
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>

        <!-- 右键显示内容的 -->
        <!-- <div id="contextmenu_container" class="contextmenu">
              <ul>
                <li><button id="del">删除</button></li>
                <li><button id="edit">编辑</button></li>
              </ul>
            </div> -->
      </div>
    </el-main>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import host from "../../host";
import { getLastDevGps, getDevGpsOne } from "../../axios/api";

import "ol/ol.css";
import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { getCenter } from "ol/extent";

// 图上图标相关
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlLayerVector from "ol/layer/Vector";
import OlSourceVector from "ol/source/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";

import Overlay from "ol/Overlay";

import {
  Draw,
  Modify,
  Select,
  Snap,
  Translate,
  defaults as defaultInteractions
} from "ol/interaction";

// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
export default {
  components: {
    Menu
  },
  name: "LocationDeveui",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectName: this.$store.state.intoProjectName,
      intoGroundImg: this.$store.state.intoGroundImg,
      intoGroundId: this.$store.state.intoGroundId,
      map: null,
      mapName: "allmap",
      modify: null,
      vectorLayer: null,
      source: null,
      feature: null,
      startX: "",
      startY: "",
      endX: "",
      endY: "",
      edit: false,

      mapInfo: "",
      websock: "",

      // wsuri:
      //   "ws://192.168.2.12:14501/websocket/gps/" +
      //   this.$store.state.intoGroundId,
      wsuri: host.ws + "gps/" + this.$store.state.intoGroundId,
      searchList: {}
    };
  },
  methods: {
    //刚进页面获取最后一次位置信息，加载图标
    getDevGpsLocation() {
      var that = this;
      let data = {
        groundid: this.intoGroundId,
        gpstype: 1
      };
      getLastDevGps(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {
        if (res.code == 1001) {
          that.mapInfo = res.data;
          for (let i = 0; i < that.mapInfo.length; i++) {
            that.addIconMarkers(that.map, that.mapInfo[i]);
          }
        }
      });
    },

    //查询
    searchInfo() {
      var that = this;
      getDevGpsOne(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {
        if (res.code == 1001) {
          that.websock.close();
          that.delFeature(res.data);
          that.addIconMarker(that.map, res.data, 2);
          that.$message({
            message: that.$t("project.Searchsucceeded"),
            type: "success"
          });
        }
      });
    },

    //刷新
    clearBtn() {
      if (this.$store.state.intoProjectprojectType == 1) {
        this.searchList = {
          projectid: this.$store.state.intoProjectid,
          deveui: "",
          devtype: 1,
          postype: 1
        };
      } else if (this.$store.state.intoProjectprojectType == 2) {
        this.searchList = {
          projectid: this.$store.state.intoProjectid,
          deveui: "",
          devtype: 2,
          postype: 1
        };
      }
      //   this.getDevGpsLocation();
      this.initWebsocket();
    },
    initWebsocket() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持WebSocket");
        return false;
      }
      this.websock = new WebSocket(this.wsuri);
      this.websock.onopen = this.websocketopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketerror;
      this.websock.onclose = this.close;
    },
    websocketopen() {
      //打开
      console.log("WebSocket连接成功");

      this.websocketSend(this.intoGroundId);
    },
    //数据接收
    websocketonmessage(res) {
      var data = JSON.parse(res.data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.delFeature(data[i]);
          this.addIconMarker(this.map, data[i], 1);
        }
      }
    },
    close() {
      console.log("WebSocket关闭");
    },
    websocketerror() {
      console.log("WebSocket连接失败");
    },

    websocketSend(data) {
      this.websock.send(data);
    },
    //返回项目管理
    goProject() {
      this.$router.push("/projectmanagement");
    },

    mapint(x, y) {
      var that = this;
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent
      });
      setTimeout(() => {
        let xx, yy;
        if (x > 1399 && y > 699) {
          xx = 1400;
          yy = 700;
        } else if (x > 1399 && y < 700) {
          xx = 1400;
          yy = y;
        } else if (x < 1400 && y > 699) {
          yy = 700;
          xx = x;
        } else if (x < 1400 && y < 700) {
          xx = x;
          yy = y;
        }
        this.$refs.map.style.width = xx + "px";
        this.$refs.map.style.height = yy + "px";
        this.map = new Map({
          layers: [
            new ImageLayer({
              source: new Static({
                url: (host.host && host.host.endsWith('/') ? host.host : (host.host + '/')) + "indoormap/" + this.intoGroundImg,
                projection: projection,
                imageExtent: extent
              })
            })
          ],
          target: this.mapName,
          view: new View({
            projection: projection,
            center: getCenter(extent),
            zoom: 2,
            maxZoom: 6,
            extent: [0, 0, x, y]
          })
        });

        // this.mapClick();
        // this.mapRightClick(that.map);
      }, 0);
    },

    //右键事件
    mapRightClick(map) {
      var that = this;
      var menu_overlay = new Overlay({
        element: document.getElementById("contextmenu_container"),
        positioning: "center-center"
      });
      map.addOverlay(menu_overlay);
      $(map.getViewport()).on("contextmenu", function(event) {
        event.preventDefault();
        // 书写事件触发后的函数
        var pixel = map.getEventPixel(event.originalEvent);
        var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
          return feature;
        });
        if (feature) {
          if (feature.values_.x) {
            var coordinate = map.getEventCoordinate(event.originalEvent);
            menu_overlay.setPosition(coordinate);

            $("#del").click(function() {
              that.delFeature(feature, menu_overlay);
            });
            $("#edit").click(function() {
              that.editFeature(feature, menu_overlay);
            });
          }
        }
      });
    },
    //单击布置
    mapClick() {
      var that = this;
      var x = "";
      var y = "";
      var container = document.getElementById("popup"); //最外层包含所有元素的div
      var content = document.getElementById("popup-content"); //显示弹出框具体内容的div
      var popupCloser = document.getElementById("popup-closer"); //关闭按钮，是一个a标签

      var overlay = new Overlay({
        //设置弹出框的容器
        element: container,
        //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true
      });
      this.map.on("click", evt => {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(
          feature
        ) {
          var coodinate = evt.coordinate;
          //设置弹出框内容，可以HTML自定义
          content.innerHTML = "<p>你点击的坐标为：" + coodinate + "</p>";
          //设置overlay的显示位置
          overlay.setPosition(coodinate);
          //显示overlay
          that.map.addOverlay(overlay);
          $("#popup-closer").on("click", function(event) {
            event.preventDefault();
            overlay.setPosition(undefined);
          }); // 点击关闭的按钮
          return feature;
        });
        if (feature) {
          let x = feature.get("x"); //获取图标要传递的值
        } else {
          x = Number((evt.coordinate[0] / 1000) * 100).toFixed(2);
          y = Number((evt.coordinate[1] / 1000) * 100).toFixed(2);
          this.addIconMarker(this.map, x, y);
        }
      });
    },
    //加载
    addIconMarkers(map, mapInfo) {
      var that = this;
      var startMarker = new OlFeature({
        x: mapInfo.x, //图标传入值
        y: mapInfo.y, //图标传入值
        deveui: mapInfo.deveui,
        // type: "icon",
        geometry: new OlGeomPoint([mapInfo.x, mapInfo.y])
      });

      this.source = new OlSourceVector({
        features: [startMarker]
      });

      let style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/User.png",
          scale: 1
        }),
        // 设置图片下面显示字体的样式和内容
        text: new Text({
          text: mapInfo.username, // 添加文字描述
          font: "12px font-size", // 设置字体大小
          fill: new Fill({
            // 设置字体颜色
            color: "red"
          }),
          offsetY: 10 // 设置文字偏移量
        })
      });

      this.vectorLayer = new OlLayerVector({
        source: this.source,
        style: style
      });
      map.addLayer(this.vectorLayer);
    },
    //添加
    addIconMarker(map, mapInfo, index) {
      var that = this;
      var startMarker = new OlFeature({
        x: mapInfo.x, //图标传入值
        y: mapInfo.y, //图标传入值
        deveui: mapInfo.deveui,
        // type: "icon",
        geometry: new OlGeomPoint([mapInfo.x, mapInfo.y])
      });

      this.source = new OlSourceVector({
        features: [startMarker]
      });

      let style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/User.png",
          scale: index
        }),
        // 设置图片下面显示字体的样式和内容
        text: new Text({
          text: mapInfo.username, // 添加文字描述
          font: "12px font-size", // 设置字体大小
          fill: new Fill({
            // 设置字体颜色
            color: "blue"
          }),
          offsetY: 10 // 设置文字偏移量
        })
      });

      this.vectorLayer = new OlLayerVector({
        source: this.source,
        style: style
      });
      map.addLayer(this.vectorLayer);
    },

    //删除
    delFeature(e) {
      var that = this;
      let LayerArrays = this.map.getLayers().getArray();
      for (let i = 1; i < LayerArrays.length; i++) {
        if (
          e.deveui == LayerArrays[i].getSource().getFeatures()[0].values_.deveui
        ) {
          LayerArrays[i]
            .getSource()
            .getFeatures()
            .forEach(function(feature) {
              LayerArrays[i].getSource().removeFeature(feature);
            });
          this.map.removeLayer(LayerArrays[i]);
        }
      }
    },

    //编辑
    editFeature() {
      this.edit = true;
    },

    //获取页面所有图标
    saveBtn() {
      let LayerArrays = this.map.getLayers().getArray();
      let arrs = [];
      let info;

      for (let i = 1; i < LayerArrays.length; i++) {
        info = {
          x: LayerArrays[i].getSource().getFeatures()[0].values_.x,
          y: LayerArrays[i].getSource().getFeatures()[0].values_.y
        };
        arrs.push(info);
      }
    }
  },
  mounted() {
    this.mapint(
      this.$store.state.intoGroundImgWidth,
      this.$store.state.intoGroundImgHeight
    );
    this.initWebsocket();
    this.getDevGpsLocation();
    if (this.$store.state.intoProjectprojectType == 1) {
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        deveui: "",
        devtype: 1,
        postype: 1
      };
    } else if (this.$store.state.intoProjectprojectType == 2) {
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        deveui: "",
        devtype: 2,
        postype: 1
      };
    }
  },
  destroyed() {
    this.websock.close();
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
li {
  list-style-type: none;
}
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

.demo-form-inline >>> .el-form-item .el-form-item__label {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline >>> .el-form-item .el-form-item__content {
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__inner {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px;
  line-height: 34px;
}

.querry,
.reset {
  padding: 8px 12px !important;
}

#allmap {
  position: relative;
  border: 1px solid red;
}

#popup {
  height: 100px;
}

#popup-content {
  background: #fff;
  padding: 3px;
}
.ol-popup-closer {
  position: absolute;
  top: 2px;
  right: 8px;
}
/* .ol-popup-closer:after {
  content: "x";
  color: red;
} */

.backProject >>> .el-page-header__left {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject >>> .el-page-header__content {
  text-align: left !important;
}
</style>
