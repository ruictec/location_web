<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content" style="height: 100%">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside
          v-if="contrForPrionum != 5"
          :class="{ user: contrForPrionum == 5 }"
          ><Project
        /></el-aside>
        <el-main style="height: 100%">
          <el-breadcrumb
            separator="/"
            style="margin-left: 0"
            v-if="contrForPrionum == 3 || contrForPrionum == 4"
          >
            <el-breadcrumb-item :to="{ path: '/projectmanagement' }">{{
              $t("index.projectmanagement")
            }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ intoProjectName }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{
              $t("Breadcrumb.Floordetails")
            }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="containers ground-details-map" style="width: 100%; height: 95%">
            <div v-if="mapTypes" class="mapConent">
              <div id="allmap" ref="map" class="allmap">
                <!-- 楼栋选择 -->
                <div class="selectBuild">
                  <el-select
                    v-model="isactive"
                    placeholder=""
                    @change="getGrounds"
                    popper-class="ground-details-building-select"
                    style="position: absolute; top: 2px; right: 0; z-index: 1"
                  >
                    <el-option
                      v-for="item in buildings"
                      :key="item.id"
                      :label="item.building"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>

              <!-- 切换按钮 -->
              <div class="changShowButton" v-if="showOptions">
                <el-dropdown @command="showOptionsTrue">
                  <span class="el-dropdown-link">
                  <el-button type="primary">
                    {{ showOptionName
                    }}<i class="el-icon-arrow-up el-icon--right"></i>
                  </el-button>
                  </span>
<template #dropdown><el-dropdown-menu>
                    <el-dropdown-item command="1" v-if="intoProjectType == 1">{{
                      $t("change.showAliases")
                    }}</el-dropdown-item>
                    <el-dropdown-item command="2" v-if="intoProjectType == 1">{{
                      $t("change.showMajor16")
                    }}</el-dropdown-item>
                    <el-dropdown-item command="3" v-if="intoProjectType == 1">{{
                      $t("change.showMajor10")
                    }}</el-dropdown-item>
                    <el-dropdown-item command="4">{{
                      $t("change.showPosition")
                    }}</el-dropdown-item>
                  </el-dropdown-menu></template>
                </el-dropdown>
              </div>
              <!-- 楼层 -->
              <div class="selectGround" style="z-index: 1">
                <div
                  style="
                    width: 42px;
                    background-color: white;
                    box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 3px;
                    border-radius: 2px;
                  "
                >
                  <div style="overflow: hidden" class="fm-layer-list">
                    <div
                      v-for="(item, index) in grounds"
                      :key="item"
                      @click="getBuildGroundLists(item)"
                      :class="isactiveGround == item ? 'addclass' : ''"
                    >
                      <label
                        data-gid="2"
                        id="gid_24.99322021/3/1/11:04:43"
                        style="
                          display: inline-block;
                          text-align: center;
                          width: 42px;
                          height: 42px;
                          line-height: 42px;
                          margin: 0px;
                          cursor: pointer;
                          font-size: 0.8em;
                          font-weight: bold;
                          color: rgb(102, 102, 102);
                        "
                      >
                        <span v-if="item > 0">F{{ item }}</span>
                        <span v-if="item < 0">B{{ -item }}</span>
                      </label>
                      <hr
                        v-show="
                          grounds.length > 1 && index !== grounds.length - 1
                        "
                        style="
                          height: 1px;
                          border-top: 1px solid rgba(153, 153, 153, 0.45);
                          border-right: none;
                          border-bottom: none;
                          border-left: none;
                          border-image: initial;
                          width: 60%;
                          margin: 0px 20%;
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!mapTypes" class="mapConentD">
              <div id="fengMap">
                <!-- 楼栋选择 -->
                <div class="selectBuild">
                  <el-select
                    v-model="isactive"
                    placeholder=""
                    @change="getGrounds"
                    popper-class="ground-details-building-select"
                    style="position: absolute; top: 2px; right: 0; z-index: 1001"
                  >
                    <el-option
                      v-for="item in buildings"
                      :key="item.id"
                      :label="item.building"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <!-- 切换按钮 -->
              <div class="changShowButton" v-if="showOptions">
                <el-dropdown @command="showOptionsTrue">
                  <span class="el-dropdown-link">
                  <el-button type="primary">
                    {{ showOptionName
                    }}<i class="el-icon-arrow-up el-icon--right"></i>
                  </el-button>
                  </span>
<template #dropdown><el-dropdown-menu>
                    <el-dropdown-item command="1" v-if="intoProjectType == 1">{{
                      $t("change.showAliases")
                    }}</el-dropdown-item>
                    <el-dropdown-item command="2" v-if="intoProjectType == 1">{{
                      $t("change.showMajor16")
                    }}</el-dropdown-item>
                    <el-dropdown-item command="3" v-if="intoProjectType == 1">{{
                      $t("change.showMajor10")
                    }}</el-dropdown-item>
                    <el-dropdown-item command="4">{{
                      $t("change.showPosition")
                    }}</el-dropdown-item>
                  </el-dropdown-menu></template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import host from "../../host";
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import fengmap from "fengmap/build/fengmap.map.min";
import "fengmap/build/fengmap.plugin.ui.min";
import "fengmap/build/fengmap.plugin.markers.min";
import "fengmap/build/toolBarStyle.css";
import { FENGMAP_DECODER_URL } from "../../utils/fengmapAssets";
import { markRaw } from "vue";

import {
  getBuildingByProjectid,
  getGroundList,
  getBuildGroundList,
  getGround,
  getMapidByBuildid,
  getDevAndOtherList,
} from "../../axios/api";

// 布置相关
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

// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
export default {
  components: {
    Menu,
    Project,
  },
  name: "TestLevel",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      intoProjectName: this.$store.state.intoProjectName,
      intoProjectid: this.$store.state.intoProjectid,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      isactive: "",
      isactiveGround: false,
      buildings: "", //所有楼栋
      building: "", //当前选中楼栋
      buildingId: "", //从信标页面传递过来的楼栋编号
      grounds: "", //所有楼层
      ground: "", //当前选中楼层
      groundid: "", //当前楼层编号
      groundId: "", //从信标页面传递过来的楼层编号
      selectBeacon: "", //从信标页面传递过来的信标编号
      arrangeFeatures: "", //已布置的设备
      imgUrl: "",
      map: null,
      mapName: "allmap",
      gwnum: "", //当前楼层网关数
      bnum: "", //当前楼层信标数
      iconSrc: "",
      groundListCopy: [], //用于3D地图的时候，设定新的对应关系
      newGround: "", //用于3D地图的时候新的对应关系里的新的楼层对应的
      //3D 地图相关
      mapTypes: true,
      map3d: null,
      fmapId: "",
      themeId: "",
      scrollFloorControl: null,
      map3dLoadToken: 0,
      layer: null,
      layerList: [],
      // 图标显示相关
      showOption: 1,
      showOptionName: this.$t("change.showAliases"),
      showOptions: false,
      lastValidBuilding: null,
      lastValidMapTypes: null,
    };
  },
  methods: {
    // 切换显示图标下标
    showOptionsTrue(val) {
      this.showOption = Number(val);
      switch (this.showOption) {
        case 1:
          this.showOptionName = this.$t("change.showAliases");
          break;
        case 2:
          this.showOptionName = this.$t("change.showMajor16");
          break;
        case 3:
          this.showOptionName = this.$t("change.showMajor10");
          break;
        case 4:
          this.showOptionName = this.$t("change.showPosition");
          break;
        default:
          break;
      }
      let that = this;
      if (this.mapTypes) {
        that.delFeature();
        setTimeout(() => {
          for (let i = 0; i < that.arrangeFeatures.length; i++) {
            that.addIconMarkers(that.map, that.arrangeFeatures[i]);
          }
        }, 500);
      } else {
        if (that.layerList.length > 0) {
          that.layerList.forEach((item) => {
            item.remove();
          });
          that.layerList = [];
        }
        if (that.arrangeFeatures.length > 0) {
          for (let i = 0; i < that.arrangeFeatures.length; i++) {
            that.addMarkers(that.arrangeFeatures[i], that.map3d.getLevel());
          }
        }
      }
    },
    //删除
    delFeature() {
      let LayerArrays = this.map.getLayers().getArray();
      for (let i = LayerArrays.length - 1; i > 0; i--) {
        LayerArrays[i]
          .getSource()
          .getFeatures()
          .forEach(function (feature) {
            LayerArrays[i].getSource().removeFeature(feature);
          });
        this.map.removeLayer(LayerArrays[i]);
      }
    },
    // 加载地图
    mapInit(x, y) {
      if (this.map) {
        this.map.setTarget("masssss");
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
        this.$refs.map.style.height = "98%";
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
            zoom: 2,
            maxZoom: 6,
          }),
        });
      }, 0);
    },
    //在地图上加载已布置的设备
    addIconMarkers(map, info) {
      var that = this;
      let selectB = false;
      let selectBsrc = "../../../static/beacon_green.png";
      if (that.selectBeacon && that.selectBeacon == info.beaconid) {
        that.selectBeacon = null;
        that.groundId = null;
        that.buildingId = null;
        selectB = true;
      }

      let alias = info.alias;
      switch (this.showOption) {
        case 1:
          alias = info.alias;
          break;
        case 2:
          alias = info.major + "/" + info.minor;
          break;
        case 3:
          alias = parseInt(info.major, 16) + "/" + parseInt(info.minor, 16);
          break;
        default:
          break;
      }
      if (info.devtype) {
        alias = info.alias;
        var startMarker = new OlFeature({
          x: info.lastx,
          y: info.lasty,
          xy: [info.lastx, info.lasty],
          alias: info.alias,
          deveui: info.deveui,
          devtype: info.devtype,
          major: info.mode,
          minor: info.scheme,
          tranche: info.tranche || "",
          geometry: new OlGeomPoint([info.lastx, info.lasty]),
        });
      } else {
        if (this.$store.state.intoProjectType == 1) {
          //正向项目
          var startMarker = new OlFeature({
            x: info.longi,
            y: info.lati,
            alias: info.alias,
            deveui: info.beaconid,
            major: info.major,
            minor: info.minor,
            type: info.type,
            clockin: info.clockin,
            tranche: info.tranche || "",
            geometry: new OlGeomPoint([info.longi, info.lati]),
          });
        } else if (this.$store.state.intoProjectType == 2) {
          alias = info.alias;
          //反向项目
          var startMarker = new OlFeature({
            x: info.lastx,
            y: info.lasty,
            alias: info.alias,
            deveui: info.deveui,
            major: info.major,
            minor: info.minor,
            type: "",
            clockin: "",
            tranche: info.tranche || "",
            geometry: new OlGeomPoint([info.lastx, info.lasty]),
          });
        }
      }

      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style;
      var names = "";
      if (that.showOption == 4) {
        names = info.tranche ? "/" + info.tranche : "";
      }
      if (info.devtype) {
        let src;
        switch (info.devtype) {
          case 1:
            src = "../../../static/assetGateway.png";
            break;
          case 2:
            src = "../../../static/aoa.png";
            break;
          case 3:
            src = "../../../static/smoke.png";
            break;
          case 4:
            src = "../../../static/alarm.png";
            break;
          case 6:
            src = "../../../static/camera.png";
            break;
          default:
            break;
        }
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: selectB ? selectBsrc : src,
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: alias + names,
            font: "14px font-size",
            fill: new Fill({
              color: "blue",
            }),
            offsetY: 10, //文字偏移量
          }),
        });
      } else {
        if (this.intoProjectType == 1) {
          if (info.type == 2) {
            // 告警信标用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: selectB ? selectBsrc : "../../../static/beacon_sos.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else if (info.type == 1 && info.clockin == 1) {
            // 打卡点用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: selectB ? selectBsrc : "../../../static/clock.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: selectB ? selectBsrc : that.iconSrc,
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          }
        } else if (this.intoProjectType == 2) {
          if (info.clockin == 1) {
            // 打卡点用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: selectB ? selectBsrc : "../../../static/clock.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: selectB ? selectBsrc : that.iconSrc,
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          }
        }
      }

      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
    },

    //返回项目管理
    goProject() {
      this.$router.push("/projectmanagement");
    },

    //获取楼栋
    getBuildingByProjectids() {
      var that = this;
      let data = {
        tenantid: that.$store.state.intoProjectTenantid,
        projectid: that.$store.state.intoProjectid,
      };
      getBuildingByProjectid(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.buildings = res.data;
          if (that.buildingId) {
            let found = that.buildings.find(function (item) {
              return item.id == that.buildingId;
            });
            if (found.buildtype == 1) {
              that.getGroundLists(that.buildingId);
            } else if (found.buildtype == 2) {
              that.getMapid(that.buildingId);
              that.$nextTick(() => {
                that.getGroundLists3D(that.buildingId);
              });
            }
          } else {
            if (that.buildings[0].buildtype == 1) {
              that.getGroundLists(that.buildings[0].id);
            } else if (that.buildings[0].buildtype == 2) {
              that.getMapid(that.buildings[0].id);
              that.$nextTick(() => {
                that.getGroundLists3D(that.buildings[0].id);
              });
            }
          }
        }
      });
    },

    destroyMap3d() {
      this.destroyFengmapFloorToolbar();
      try {
        if (this.map3d && typeof this.map3d.dispose === "function") {
          this.map3d.dispose();
        }
      } catch (e) {
        // ignore map dispose errors
      }
      this.map3d = null;
      this.destroyFengmapFloorToolbar();
    },
    destroyFengmapFloorToolbar() {
      try {
        const ctrl = this.scrollFloorControl;
        if (ctrl && typeof ctrl.remove === "function") {
          ctrl.remove();
        }
      } catch (e) {
        // ignore toolbar remove errors
      }
      this.scrollFloorControl = null;
      const container = document.getElementById("fengMap");
      if (container) {
        container
          .querySelectorAll(".fm-control-groups")
          .forEach((el) => el.remove());
      }
    },
    // 点击楼栋,判断楼栋是2D还是3D
    getGrounds(val) {
      this.map3dLoadToken += 1;
      this.selectBeacon = null;
      this.groundId = null;
      this.buildingId = null;
      var found = this.buildings.find(function (item) {
        return item.id == val;
      });
      if (!found) {
        return;
      }
      const revertContext = {
        building: this.lastValidBuilding,
        mapTypes: this.lastValidMapTypes,
      };
      if (found.buildtype == 1) {
        this.$nextTick(() => {
          this.getGroundLists(val, revertContext);
        });
      } else if (found.buildtype == 2) {
        this.$nextTick(() => {
          this.getGroundLists3D(val, null, revertContext);
        });
      }
    },
    // 等待 3D 地图容器挂载并有尺寸后再初始化
    prepareMap3dContainer() {
      const wrap = document.querySelector(".ground-details-map .mapConentD");
      const el = document.getElementById("fengMap");
      if (!wrap || !el) {
        return false;
      }
      const containers = wrap.closest(".containers");
      if (wrap.offsetHeight === 0 && containers && containers.clientHeight > 0) {
        wrap.style.minHeight = containers.clientHeight + "px";
      }
      return el.offsetWidth > 0 && el.offsetHeight > 0;
    },
    runWhenMap3dReady(callback, attempt = 0) {
      const that = this;
      const maxAttempts = 30;
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (that.prepareMap3dContainer() || attempt >= maxAttempts) {
            callback();
            return;
          }
          setTimeout(() => that.runWhenMap3dReady(callback, attempt + 1), 50);
        });
      });
    },
    // 3D楼栋获取地图的编号
    getMapid(id) {
      var that = this;
      getMapidByBuildid(
        { buildid: id },
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.fmapId = res.data[0];
        }
      });
    },
    //获取楼层
    getGroundLists(val, revertContext) {
      var that = this;
      const fromUserChange = !!revertContext;

      this.isactive = val;
      let data = {
        buildid: val,
      };
      getGroundList(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          const floors = res.data || [];
          if (floors.length === 0) {
            that.$message.warning(that.$t("floordetails.noFloorInfo"));
            if (
              fromUserChange &&
              revertContext.building != null &&
              revertContext.building !== ""
            ) {
              that.isactive = revertContext.building;
              that.mapTypes = revertContext.mapTypes;
            } else {
              that.grounds = [];
            }
            return;
          }

          that.destroyMap3d();

          that.mapTypes = true;
          that.grounds = floors.reverse();
          that.building = val;
          that.lastValidBuilding = val;
          that.lastValidMapTypes = true;
          if (that.groundId) {
            that.getBuildGroundLists();
          } else {
            that.getBuildGroundLists(floors[floors.length - 1]);
          }
        }
      });
    },

    // 获取楼层3D
    getGroundLists3D(build, ground, revertContext) {
      var that = this;
      const loadToken = this.map3dLoadToken;
      that.groundListCopy = [];
      const fromUserChange = !!revertContext;
      this.building = build;
      this.isactive = build;
      let data = {
        buildid: build,
      };
      getGround(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
        (res) => {
          if (loadToken !== that.map3dLoadToken) {
            return;
          }
          if (res.code == 1001) {
            const floors = res.data || [];
            if (floors.length === 0) {
              that.$message.warning(that.$t("floordetails.noFloorInfo"));
              if (
                fromUserChange &&
                revertContext.building != null &&
                revertContext.building !== ""
              ) {
                that.isactive = revertContext.building;
                that.building = revertContext.building;
              }
              return;
            }

            that.destroyMap3d();

            that.mapTypes = false;
            that.$nextTick(() => {
              for (let i = 0; i < floors.length; i++) {
                let groundinfo = {
                  groundid: floors[i].id,
                  ground: floors[i].ground,
                  newground: i + 1,
                };
                that.groundListCopy.push(groundinfo);
              }

              that.fmapId = floors[0].filename;
              that.themeId = floors[0].filetype;
              that.lastValidBuilding = build;
              that.lastValidMapTypes = false;
              let groundLevel = null;
              if (that.groundId) {
                let found = that.groundListCopy.find(function (item) {
                  return item.groundid == that.groundId;
                });
                if (found) {
                  groundLevel = found.newground;
                }
              }
              setTimeout(() => {
                that.runWhenMap3dReady(() => {
                  if (loadToken !== that.map3dLoadToken) {
                    return;
                  }
                  that.onmap(
                    that.$store.state.intoProjectid,
                    floors[0].appname,
                    floors[0].mapkey,
                    groundLevel,
                    loadToken
                  );
                });
              }, 1);
            });
            return;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },

    //加载3D地图
    onmap(projectid, appname, mapkey, ground, loadToken) {
      document.oncontextmenu = function (e) {
        return false;
      };
      var that = this;
      if (loadToken != null && loadToken !== this.map3dLoadToken) {
        return;
      }
      const container = document.getElementById("fengMap");
      if (!container) {
        return;
      }
      this.destroyMap3d();
      this.prepareMap3dContainer();
      var mapOpation = {
        container: container,
        level: ground ? ground : 1, //默认聚焦楼层
        visibleLevels: ground ? [ground] : [1], //初始显示楼层ID数组
        appName: appname,
        key: mapkey,
        viewMode: fengmap.FMViewMode.MODE_2D, //设置地图2d显示
        mapID: that.fmapId,
        themeID: that.themeId,
        zoomRange: [1, 29],
        decoderURL: FENGMAP_DECODER_URL,
        // mapURL: "/data/",
        // themeURL: "/data/theme/",
      };

      this.map3d = markRaw(new fengmap.FMMap(mapOpation));
      this.map3d.on("loaded", function () {
        if (loadToken != null && loadToken !== that.map3dLoadToken) {
          return;
        }
        try {
          const level = that.map3d.getLevel();
          const floor = that.map3d.getFloor(level);
          if (floor && floor.getBound) {
            that.map3d.setFitView(floor.getBound());
          }
        } catch (e) {
          // ignore fit view errors
        }
        that.loadScrollFloorCtrl();
        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        let data = {
          projectid: that.intoProjectid,
          buildid: that.building,
          ground: focusGroupID.ground,
        };
        getBuildGroundList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.groundid = res.data.list[0].id;
            if (that.$store.state.intoProjectType == 1) {
              that.getArrangeBeaconPos3D(projectid, that.map3d.getLevel());
            } else if (that.$store.state.intoProjectType == 2) {
              that.getArrangeGatewayPos3D(projectid, that.map3d.getLevel());
            }
          }
        });
      });
      // 聚焦楼层改变事件
      this.map3d.on("levelChanged", function (event) {
        if (that.layerList.length > 0) {
          that.layerList.forEach((item) => {
            item.remove();
          });
          that.layerList = [];
        }
        that.layerList = [];
        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        let data = {
          projectid: that.intoProjectid,
          buildid: that.building,
          ground: focusGroupID.ground,
        };
        getBuildGroundList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.groundid = res.data.list[0].id;
            if (that.$store.state.intoProjectType == 1) {
              that.getArrangeBeaconPos3D(projectid, that.map3d.getLevel());
            } else if (that.$store.state.intoProjectType == 2) {
              that.getArrangeGatewayPos3D(projectid, that.map3d.getLevel());
            }
          }
        });
      });
    },

    // 巡检历史页面，上一层
    lastGroups3D() {
      var that = this;
      let focusGroupID = that.groundListCopy.find(function (item) {
        return item.newground == that.map3d.focusGroupID;
      });
      this.map3d.focusGroupID -= 1;
    },

    //加载滚动楼层控制
    loadScrollFloorCtrl() {
      var scrollFloorCtlOpt = {
        position: fengmap.FMControlPosition.RIGHT_TOP,
        //初始楼层按钮显示个数配置。默认显示5层,其他的隐藏，可滚动查看
        floorButtonCount: 6,
        needAllLayerBtn: false,
        offset: {
          x: -20,
          y: 20,
        },
      };
      this.destroyFengmapFloorToolbar();
      this.scrollFloorControl = markRaw(new fengmap.FMToolbar(scrollFloorCtlOpt));
      this.scrollFloorControl.addTo(this.map3d);
    },

    //正向项目获取3D地图上已布置的设备
    getArrangeBeaconPos3D(projectid, groupID) {
      var that = this;
      let data2 = {
        projectype: 1,
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevAndOtherList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          let devList = res.data.devList;
          let otherList = res.data.otherList;
          that.arrangeFeatures = devList.concat(otherList);
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.addMarkers(that.arrangeFeatures[i], groupID);
            }
          }
        }
      });
    },
    //反向项目获取3D地图上已布置的设备
    getArrangeGatewayPos3D(projectid, groupID) {
      var that = this;
      let data2 = {
        projectype: 2,
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevAndOtherList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          let devList = res.data.devList;
          let otherList = res.data.otherList;
          that.arrangeFeatures = devList.concat(otherList);
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.addMarkers(that.arrangeFeatures[i], groupID);
            }
          }
        }
      });
    },

    //3D 地图显示图标
    addMarkers(mapinfo, groupID) {
      if (mapinfo.tranche == null) {
        mapinfo.tranche = "";
      }
      var that = this;
      var info;
      let alias = mapinfo.alias;
      let imagerMarkerSrc;
      let selectB = false;
      let selectBsrc = "../../../static/beacon_green.png";
      if (that.selectBeacon && that.selectBeacon == mapinfo.beaconid) {
        that.selectBeacon = null;
        that.groundId = null;
        that.buildingId = null;
        selectB = true;
      }
      switch (that.showOption) {
        case 1:
          alias = mapinfo.alias;
          break;
        case 2:
          alias = mapinfo.major + "/" + mapinfo.minor;
          break;
        case 3:
          alias =
            parseInt(mapinfo.major, 16) + "/" + parseInt(mapinfo.minor, 16);
          break;
        default:
          break;
      }
      var names = "";
      if (mapinfo.devtype) {
        // 第三方
        alias = mapinfo.alias;
        var coord = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
        };

        info = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
          xy: [mapinfo.lastx, mapinfo.lasty],
          alias: mapinfo.alias,
          deveui: mapinfo.deveui,
          major: mapinfo.major,
          minor: mapinfo.minor,
          devtype: mapinfo.devtype,
          tranche: mapinfo.tranche,
        };

        let src;
        switch (mapinfo.devtype) {
          case 1:
            src = "../../../static/assetGateway.png";
            break;
          case 2:
            src = "../../../static/aoa.png";
            break;
          case 3:
            src = "../../../static/smoke.png";
            break;
          case 4:
            src = "../../../static/alarm.png";
            break;
          case 6:
            src = "../../../static/camera.png";
            break;
          default:
            break;
        }
        that.layer = new fengmap.FMCompositeMarker({
          layout: {
            style: "timage-btext",
            align: "center",
          },
          text: {
            padding: [0, 0, 0, 0],
            plateStrokeWidth: 1,
            content: {
              textAlign: fengmap.FMTextAlign.Center,
              lineSpacing: 2,
              fontSize: 14,
              fontFamily: "Microsoft YaHei",
              fillColor: "rgba(0, 0, 238)",
              // strokeColor: "rgba(255, 204, 255)",
              // strokeWidth: 1,
              text: alias + names,
            },
          },
          x: coord.x,
          y: coord.y,
          height: 1,
          collision: false,
          anchor: {
            baseon: "image",
            anchor: fengmap.FMMarkerAnchor.CENTER,
          },
          //设置图片路径
          image: {
            url: selectB ? selectBsrc : src,
            size: [80, 100],
          },
        });
      } else {
        if (that.intoProjectType == 1 && mapinfo.type == 2) {
          // 告警信标
          imagerMarkerSrc = "../../../static/beacon_sos.png";
        } else if (mapinfo.type == 1 && mapinfo.clockin == 1) {
          // 打卡点
          imagerMarkerSrc = "../../../static/clock.png";
        } else {
          imagerMarkerSrc = that.iconSrc;
        }
        if (this.$store.state.intoProjectType == 1) {
          //正向项目
          var coord = {
            x: mapinfo.longi,
            y: mapinfo.lati,
          };
          info = {
            x: mapinfo.longi,
            y: mapinfo.lati,
            alias: mapinfo.alias,
            deveui: mapinfo.beaconid,
            major: mapinfo.major,
            minor: mapinfo.minor,
            type: mapinfo.type,
            clockin: mapinfo.clockin,
            tranche: mapinfo.tranche,
          };
          that.layer = new fengmap.FMCompositeMarker({
            layout: {
              style: "timage-btext",
              align: "center",
            },
            text: {
              padding: [0, 0, 0, 0],
              plateStrokeWidth: 1,
              content: {
                textAlign: fengmap.FMTextAlign.Center,
                lineSpacing: 2,
                fontSize: 14,
                fontFamily: "Microsoft YaHei",
                fillColor: "rgba(0, 0, 238)",
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: alias + names,
              },
            },
            x: coord.x,
            y: coord.y,
            //设置图片路径
            image: {
              url: selectB ? selectBsrc : imagerMarkerSrc,
              size: [100, 100],
            },
            height: 1,
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          });
        } else if (this.$store.state.intoProjectType == 2) {
          alias = mapinfo.alias;
          //反向项目
          var coord = {
            x: mapinfo.lastx,
            y: mapinfo.lasty,
          };
          info = {
            x: mapinfo.lastx,
            y: mapinfo.lasty,
            alias: mapinfo.alias,
            deveui: mapinfo.deveui,
            major: mapinfo.major,
            minor: mapinfo.minor,
            type: "",
            clockin: mapinfo.clockin,
            tranche: mapinfo.tranche,
          };
          that.layer = new fengmap.FMCompositeMarker({
            layout: {
              style: "timage-btext",
              align: "center",
            },
            text: {
              padding: [0, 0, 0, 0],
              plateStrokeWidth: 1,
              content: {
                textAlign: fengmap.FMTextAlign.Center,
                lineSpacing: 2,
                fontSize: 14,
                fontFamily: "Microsoft YaHei",
                fillColor: "rgba(0, 0, 238)",
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: alias + names,
              },
            },
            x: coord.x,
            y: coord.y,
            image: {
              url: selectB ? selectBsrc : imagerMarkerSrc,
              size: [100, 100],
            },
            height: 1,
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          });
        }
      }

      this.layer.selfAttr = info;
      var level = this.map3d.getLevel();
      var group = this.map3d.getFloor(level);
      this.layer.addTo(group);
      this.layerList.push(this.layer);
    },

    //获取楼层详情
    getBuildGroundLists(val) {
      this.isactiveGround = val;
      var that = this;
      let data = {
        projectid: this.intoProjectid,
        buildid: this.building,
        ground: val,
      };
      getBuildGroundList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (val) {
            if (res.data.list.length > 0) {
              const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
              that.imgUrl =
                base + "indoormap/" + res.data.list[0].filetype;
              that.groundid = res.data.list[0].id;
              that.gwnum = res.data.list[0].gwnum;
              that.bnum = res.data.list[0].bnum;
              that.mapInit(res.data.list[0].length, res.data.list[0].width);
              if (that.intoProjectType == 1) {
                that.getArrangeBeaconPos(that.intoProjectid);
              } else if (that.intoProjectType == 2) {
                that.getArrangeGatewayPos(that.intoProjectid);
              }
            } else {
              if (that.map) {
                that.map.setTarget("mapppppp");
              }
            }
          } else {
            var found = res.data.list.find(function (item) {
              return item.id == that.groundId;
            });
            that.isactiveGround = found.ground;
            const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
            that.imgUrl = base + "indoormap/" + found.filetype;
            that.groundid = found.id;
            that.gwnum = found.gwnum;
            that.bnum = found.bnum;
            that.mapInit(found.length, found.width);
            if (that.intoProjectType == 1) {
              that.getArrangeBeaconPos(that.intoProjectid);
            } else if (that.intoProjectType == 2) {
              that.getArrangeGatewayPos(that.intoProjectid);
            }
          }
        }
      });
    },

    //反向项目获取地图上已布置的设备
    getArrangeGatewayPos(projectid) {
      var that = this;
      let data2 = {
        projectype: 2,
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevAndOtherList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          let devList = res.data.devList;
          let otherList = res.data.otherList;
          that.arrangeFeatures = devList.concat(otherList);
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.addIconMarkers(that.map, that.arrangeFeatures[i]);
            }
          }
        }
      });
    },

    //正向项目获取地图上已布置的设备
    getArrangeBeaconPos(projectid) {
      var that = this;
      let data2 = {
        projectype: 1,
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevAndOtherList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          let devList = res.data.devList;
          let otherList = res.data.otherList;
          that.arrangeFeatures = devList.concat(otherList);
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.addIconMarkers(that.map, that.arrangeFeatures[i]);
            }
          }
        }
      });
    },
    updateSize() {
      this.map.updateSize();
    },
  },
  beforeUnmount() {
    this.map3dLoadToken += 1;
    this.destroyMap3d();
  },
  mounted() {
    this.buildingId = this.$route.query.buildid * 1;
    this.groundId = this.$route.query.groundid * 1;
    this.selectBeacon = this.$route.query.beaconid;
    this.getBuildingByProjectids();
    if (this.$store.state.intoProjectType == 1) {
      this.iconSrc = "../../../static/beacon.png";
      this.showOptions = true;
    } else if (this.$store.state.intoProjectType == 2) {
      this.iconSrc = "../../../static/gateway.png";
      this.showOptions = false;
    }
  },
  computed: {
    show1() {
      return this.$store.state.show;
    },
  },
  watch: {
    show1(val) {
      setTimeout(() => {
        this.updateSize();
      }, 200);
    },
    "$i18n.locale"() {
      Object.assign(
        this.$data.showOptionName,
        this.$options.data.call(this).showOptionName
      );
    },
  },
};
</script>

<style scoped>
.containers {
  display: flex;
}
.selectGround :deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
}
.selectBuild {
  width: 100%;
  margin-left: 2%;
}
.selectBuild :deep(.el-select) {
  width: 200px;
  margin-left: 0%;
  display: block;
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
  height: 90%;
}
.user {
  height: 100%;
}

.el-aside {
  margin-top: 50px;
  width: auto !important;
}
li {
  list-style: none;
  cursor: pointer;
}
.selectBuildGround {
  /* position: absolute; */
  margin-top: 60px;
  display: flex;
  margin-left: 2%;
  margin-right: 0;
}

.mapConent {
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  margin-left: 2%;
  position: relative;
}
.allmap {
  background-color: white;
  position: relative;
}

.selectGround {
  margin-left: 20px;
}
.addclass span {
  /* background-color: #409eff !important; */
  color: #409eff;
  transition: all 0.3s;
}
.backProject :deep(.el-page-header__left) {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject :deep(.el-page-header__content) {
  text-align: left !important;
}

.buildings-item li {
  background-color: #fff;
  border-bottom: 1px #efefef solid;
}
.buildings-item:hover li {
  background-color: #f2f2f2;
}
.ground li {
  font-size: 16px;
  padding: 5px 12px !important;
  background-color: #fff;
  border-bottom: 1px #efefef solid;
}
.ground:hover li {
  background-color: #f2f2f2;
}

.mapConent, .mapConentD {
  overflow-x: hidden;
}
.mapConentD {
  width: 100%;
  margin-left: 0;
  position: relative;
}

#fengMap {
  width: 100%;
  height: 85%;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 11;
  margin: 0 !important;
}
.changShowButton {
  position: absolute;
  bottom: 4%;
  z-index: 12;
}

/* 覆盖 App.vue 全局 * { margin: 0 auto }，避免 flex 子项被收成半宽 */
.ground-details-map > .mapConent,
.ground-details-map > .mapConentD {
  flex: 1 1 100%;
  min-width: 0;
  max-width: 100%;
  margin-right: 0 !important;
}
.ground-details-map > .mapConent {
  margin-left: 2% !important;
}
.ground-details-map > .mapConentD {
  width: 100% !important;
  margin-left: 0 !important;
}
</style>
