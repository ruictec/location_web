<template>
  <div class="content" style="margin-top: 10px">
    <div class="project_input">
      <el-form
        class="demo-form-inline"
        :model="searchList"
        style="display: flex; white-space: nowrap"
      >
        <el-form-item
          :label="$t('floormanagement.device')"
          style="display: flex; margin-left: 2%; margin-right: 2%"
        >
          <el-input
            v-model="searchList.deveui"
            :placeholder="$t('locationoutdoorh.text')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('locationoutdoor.time')"
          style="display: flex; margin-left: 0; margin-right: 2%"
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
        <el-form-item style="margin-left: 0">
          <el-button type="primary" class="querry" @click="searchInfo()">{{
            $t("mapmanagements.search")
          }}</el-button>
          <el-button type="primary" class="reset">{{
            $t("mapmanagements.reset")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-main>
      <div class="mmm">
        <div id="allmap" ref="map" class=""></div>
        <!-- 左键显示内容的 -->
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import host from "../../host";
import util from "../../common/util";
import { getDevGpsList } from "../../axios/api";

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
    Menu,
    Project
  },
  name: "LocationHistorical",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectprojectType: this.$store.state.intoProjectprojectType,
      intoGroundImg: this.$store.state.intoGroundImg,
      intoGroundId: this.$store.state.intoGroundId,
      map: null,
      mapName: "allmap",
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("terminal.pickeroptions4"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0));
              // start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("terminal.pickeroptions5"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("terminal.pickeroptions6"),
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
            }
          }
        ]
      },
      tasktime: [new Date().getTime() - (1 * 60 * 60 * 1000 - 1), new Date()],
      begingTime: "",
      endTime: "",
      searchList: {},
      locationHisList: ""
    };
  },
  methods: {
    //返回项目管理
    goProject() {
      this.$router.push("/projectmanagement");
    },

    //查询历史轨迹数据
    getDevGpsLists() {
      getDevGpsList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {});
    },

    //查询
    searchInfo() {
      var that = this;
      if (this.searchList.deveui == "") {
        this.$message({
          message: this.$t("tet.tet"),
          type: "warning"
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
            type: "warning"
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
        ).then(res => {
          if (res.code == 1001) {
            that.locationHisList = res.data.list;
          }
        });
      }
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

    drawLine() {}
  },
  mounted() {
    this.mapint(
      this.$store.state.intoGroundImgWidth,
      this.$store.state.intoGroundImgHeight
    );
    if (this.$store.state.intoProjectprojectType == 1) {
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        deveui: "",
        devetype: 1,
        postype: 1,
        groundid: this.$store.state.intoGroundId,
        begintime: "",
        endtime: "",
        page: "",
        count: ""
      };
    } else if (this.$store.state.intoProjectprojectType == 2) {
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        deveui: "",
        devetype: 2,
        postype: 1,
        groundid: this.$store.state.intoGroundId,
        begintime: "",
        endtime: "",
        page: "",
        count: ""
      };
    }
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
.demo-form-inline >>> .el-form-item .el-range-separator {
  height: 34px;
  line-height: 34px;
}

.querry,
.reset {
  padding: 8px 12px !important;
}

#allmap {
  position: relative;
  /* height: 600px; */
  /* width: 100%; */
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
.el-form-item .el-button {
  margin-left: 4px !important;
}
</style>
