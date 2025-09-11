<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside
          v-if="contrForPrionum != 5"
          :class="{ user: contrForPrionum == 5 }"
          ><Project
        /></el-aside>
        <el-main class="main">
          <div class="inputContent" style="display: flex">
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
                $t("Breadcrumb.Buildingmanagement")
              }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="exportContent" style="display: flex">
            <input
              id="articleImage"
              name="excelFile"
              type="file"
              class="x_file"
              accept=".xls,.xlsx"
              @change="importExcels"
            />
          </div>
          <div class="mapConent">
            <div style="width: 100%; position: relative; z-index: 1">
              <div id="map" style="width: 100%"></div>
              <p style="position: absolute; bottom: -4%; left: 0">
                {{ $t("Building.title") }}
                <a href="javascript:;" @click="showVideo()">{{
                  $t("Building.title1")
                }}</a>
              </p>
            </div>

            <!-- 右键显示内容的 -->
            <div
              id="contextmenu_container"
              class="contextmenu"
              v-show="rightMenu"
            >
              <ul id="popup-content">
                <li>
                  <a href="#" id="popup-closer" class="ol-popup-closer">
                    <img
                      src="../../../static/close.jpg"
                      width="11"
                      height="11"
                      alt=""
                    />
                  </a>
                </li>
                <li>
                  <el-button id="del" size="mini">{{
                    $t("beacon.delete")
                  }}</el-button>
                </li>
                <li>
                  <el-button id="edit" size="mini">{{
                    $t("beacon.edit")
                  }}</el-button>
                </li>
                <li v-show="mapType2">
                  <el-button id="maptype2" size="mini">{{
                    $t("build.Set2D")
                  }}</el-button>
                </li>
                <li v-show="mapType3">
                  <el-button id="maptype3" size="mini">{{
                    $t("build.Set3D")
                  }}</el-button>
                </li>
              </ul>
            </div>
            <div class="imgBtn">
              <p
                v-for="(item, index) in imgBtnInfo"
                :key="index"
                :class="{ activeClass: isActives === index }"
                @click="changeImgSrc(index, item.src, item.msg)"
              >
                <img :src="item.src" /><span>{{ item.msg }}</span>
              </p>
              <el-button
                type="primary"
                class="reset"
                style="margin-left: 0%"
                @click="importExcel()"
                >{{ $t("terminal.import") }}</el-button
              >
              <el-button
                type="primary"
                class="reset"
                style="margin-left: 0%"
                @click="exportExcelAll()"
                >{{ $t("terminal.exportAll") }}</el-button
              >
            </div>
          </div>
          <!-- 修改 -->
          <el-dialog
            :title="$t('Building.Editinformation')"
            :visible.sync="edit"
            class="edit"
            width="50%"
            style="text-align: center"
          >
            <el-form
              :model="editData"
              label-width="120px"
              ref="editData"
              style="text-align: left"
            >
              <el-form-item :label="$t('Building.Building')">
                <el-input
                  v-model="editData.building"
                  :placeholder="$t('Building.text')"
                ></el-input>
              </el-form-item>
              <el-form-item label="楼层显示：" v-if="showAllGroundEdit">
                <el-select v-model="showAllGround" clearable filterable>
                  <el-option
                    v-for="item in showGroundList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('Building.Icon')">
                <el-radio
                  v-for="(item, index) in imgBtnInfo"
                  :key="index"
                  v-model="editData.src"
                  :label="item.src"
                  ><img :src="item.src"
                /></el-radio>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel()">{{
                $t("change.cancle")
              }}</el-button>
              <el-button type="primary" @click="editTrue()">{{
                $t("change.sure")
              }}</el-button>
            </div>
          </el-dialog>
          <el-dialog :visible.sync="vedio" @close="closeVedio">
            <video width="100%" controls autoplay id="video">
              <!-- <source src="../../../static/楼层管理——布置~1.mp4" type="video/mp4"/> -->
              <source
                v-if="i8n != 'zh'"
                src="../../../static/楼栋管理En.mp4"
                type="video/mp4"
              />
              <source
                v-if="i8n == 'zh'"
                src="../../../static/楼栋管理~2.mp4"
                type="video/mp4"
              />
            </video>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";

import {
  disposeBuildingMsg,
  getBuildingList,
  updateBuildingOne,
  getGroundList,
  addBuilding,
  delBuilding,
  updateProjectPosition,
  sendDevOtherAlarmMore,
  importBuilding,
} from "../../axios/api";

import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

import { getCenter } from "ol/extent";

import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlLayerVector from "ol/layer/Vector";
import OlSourceVector from "ol/source/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";

import Overlay from "ol/Overlay";

import { Modify, defaults as defaultInteractions } from "ol/interaction";
// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

// 描线
import { Stroke, Style } from "ol/style";
import { LineString } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";

//地图控件
import ScaleLine from "ol/control/ScaleLine"; //比例尺控件

import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import Projection from "ol/proj/Projection";
export default {
  components: {
    Menu,
    Project,
  },
  name: "buildingManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      openlayersSource: "",
      rightMenu: false,
      vedio: false,
      contrForPrionum: this.$store.state.userInfo.prionum,
      delprio: this.$store.state.userInfo.delprio,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectName: this.$store.state.intoProjectName,
      intoProjectid: this.$store.state.intoProjectid,
      intoProjectprojectType: this.$store.state.intoProjectprojectType, //项目类型
      map: "",
      seeLayer: "",
      view: "",
      modify: null,
      vectorLayer: null,
      source: null,
      startX: "",
      startY: "",
      endX: "",
      endY: "",
      imgSrc: "",
      imgMsg: "",
      isActives: "",
      edit: false,
      mapType2: false,
      mapType3: false,

      // building: this.$store.state.building - 1, //默认楼栋号
      building: 0, //默认楼栋号
      building1: 0, //默认楼栋号
      building2: 0, //默认楼栋号
      building3: 0, //默认楼栋号
      building4: 0, //默认楼栋号
      building5: 0, //默认楼栋号
      building6: 0, //默认楼栋号
      building7: 0, //默认楼栋号
      building8: 0, //默认楼栋号
      building9: 0, //默认楼栋号
      building10: 0, //默认楼栋号
      building11: 0, //默认楼栋号
      building12: 0, //默认楼栋号
      building13: 0, //默认楼栋号
      imgBtnInfo: [
        {
          index: 1,
          src: "../../../static/offices//office.png",
          msg: this.$t("tet.Building"),
        },
      ],
      //学校
      schoolImgInfo: [
        {
          index: 1,
          src: "../../../static/school/academic.png",
          msg: this.$t("build.AcademicBuilding"),
        },
        {
          index: 2,
          src: "../../../static/school/basketball.png",
          msg: this.$t("build.BasketballCourt"),
        },
        {
          index: 3,
          src: "../../../static/school/guard.png",
          msg: this.$t("build.guard"),
        },
        {
          index: 4,
          src: "../../../static/school/laboratory.png",
          msg: this.$t("build.LaboratoryBuilding"),
        },
        {
          index: 5,
          src: "../../../static/school/library.png",
          msg: this.$t("build.library"),
        },
        {
          index: 6,
          src: "../../../static/school/park.png",
          msg: this.$t("build.Parkinglot"),
        },
        {
          index: 7,
          src: "../../../static/school/playground.png",
          msg: this.$t("build.playground"),
        },
      ],
      //居民区
      residenceImgInfo: [
        {
          index: 1,
          src: "../../../static/residence/guard.png",
          msg: this.$t("build.guard"),
        },
        {
          index: 2,
          src: "../../../static/residence/park.png",
          msg: this.$t("build.Parkinglot"),
        },
        {
          index: 3,
          src: "../../../static/residence/residential.png",
          msg: this.$t("build.Residentialbuilding"),
        },
      ],
      //医院
      hospitalImgInfo: [
        {
          index: 1,
          src: "../../../static/hospital/Inpatient.png",
          msg: this.$t("build.InpatientWard"),
        },
        {
          index: 2,
          src: "../../../static/hospital/complex.png",
          msg: this.$t("build.Complexbuilding"),
        },
        {
          index: 3,
          src: "../../../static/hospital/guard.png",
          msg: this.$t("build.guard"),
        },
        {
          index: 4,
          src: "../../../static/hospital/outpatient.png",
          msg: this.$t("build.OutpatientDepartment"),
        },
        {
          index: 5,
          src: "../../../static/hospital/park.png",
          msg: this.$t("build.Parkinglot"),
        },
      ],
      //商场
      marketImgInfo: [
        {
          index: 1,
          src: "../../../static/market/market.png",
          msg: this.$t("build.market"),
        },
        {
          index: 2,
          src: "../../../static/market/park.png",
          msg: this.$t("build.Parkinglot"),
        },
      ],
      //办公楼
      officesImgInfo: [
        {
          index: 1,
          src: "../../../static/offices/office.png",
          msg: this.$t("build.OfficeBuilding"),
        },
        {
          index: 2,
          src: "../../../static/offices/park.png",
          msg: this.$t("build.Parkinglot"),
        },
        {
          index: 3,
          src: "../../../static/offices/guard.png",
          msg: this.$t("build.guard"),
        },
      ],
      //仓库
      warehouseImgInfo: [
        {
          index: 1,
          src: "../../../static/warehouse/plant.png",
          msg: this.$t("build.Warehouseplant"),
        },
        {
          index: 2,
          src: "../../../static/warehouse/park.png",
          msg: this.$t("build.Parkinglot"),
        },
      ],
      // 工厂
      workshopImgInfo: [
        {
          index: 1,
          src: "../../../static/workshop/office.png",
          msg: this.$t("build.Factoryofficebuilding"),
        },
        {
          index: 2,
          src: "../../../static/workshop/workshop.png",
          msg: this.$t("build.Factoryworkshop"),
        },
        {
          index: 3,
          src: "../../../static/workshop/guard.png",
          msg: this.$t("build.guard"),
        },
        {
          index: 4,
          src: "../../../static/workshop/dormitory.png",
          msg: this.$t("build.dormitory"),
        },

        {
          index: 5,
          src: "../../../static/workshop/park.png",
          msg: this.$t("build.Parkinglot"),
        },
      ],
      mapInfo: "",
      buildingNameList: [], //用来判断是否有重名的
      buildingIdList: [], //用来存储楼栋ID
      editData: {
        building: "",
        src: "",
        id: "",
        lati: "",
        longi: "",
        projectid: "",
      },
      editDataBuilding: "",
      arrs: [],
      editFeatureInfo: "",
      oldEditBUilding: "",
      menu_overlay: "",
      zoom: this.$store.state.mapZoom,
      longi: this.$store.state.longis,
      lati: this.$store.state.latis,
      mapCenter: [],
      headlistdata: "",
      showAllGround: "", //是否展示所有楼层
      showAllGroundEdit: false, //是否编辑展示所有楼层选项
      showGroundList: [
        {
          index: 1,
          value: true,
          label: "显示所有",
        },
        {
          index: 1,
          value: false,
          label: "显示单层",
        },
      ],
    };
  },
  methods: {
    // 导入
    importExcel() {
      document.getElementById("articleImage").click(); //触发importExcels
    },
    importExcels(obj) {
      var importList;
      let that = this;
      // 通过DOM取文件数据
      var file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = file;
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64",
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          importList = that.dateTransition(outdata);
          let data = {
            msg: JSON.stringify(importList),
          };

          importBuilding(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("terminal.tet2"),
                type: "warning",
              });
              $("#articleImage").val("");
              that.getBuildingByProjectids();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              $("#articleImage").val("");
            }
          });
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    dateTransition(outdata) {
      var that = this;
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case "ID":
              obj["id"] = outdata[i][key];
              break;
            case that.$t("Building.Building1"):
              obj["building"] = outdata[i][key];
              break;
            case that.$t("Building.BuildingType"):
              obj["buildtype"] = outdata[i][key];
              break;
            case that.$t("beacon.lati"):
              obj["lati"] = outdata[i][key];
              break;
            case that.$t("beacon.longi"):
              obj["longi"] = outdata[i][key];
              break;
            case that.$t("Building.projectid"):
              obj["projectid"] = outdata[i][key];
              break;
            case that.$t("Building.src"):
              obj["src"] = outdata[i][key];
              break;
            default:
              break;
          }
        }
        list.push(obj);
      }
      return list;
    },
    //导出
    export2Excel(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = [
        "id",
        "building",
        "buildtype",
        "lati",
        "longi",
        "projectid",
        "src",
      ];
      for (let i = 0; i < exprotHeadertype.length; i++) {
        eHeaders3.push(exprotHeadertype[i]);
        for (let j = 0; j < that.headlistdata.length; j++) {
          if (exprotHeadertype[i] == that.headlistdata[j].value) {
            exprotHeadertype[i] = that.headlistdata[j].msg;
          }
        }
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        //表头
        const tHeader = exprotHeadertype;
        const filterVal = eHeaders3;
        let list = tableData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, that.$t("list.Buildingmanagement"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    exportExcelAll() {
      var that = this;
      this.headlistdata = [
        {
          msg: "ID",
          value: "id",
        },
        {
          msg: that.$t("Building.Building1"),
          value: "building",
        },
        {
          msg: that.$t("Building.BuildingType"),
          value: "buildtype",
        },
        {
          msg: that.$t("beacon.lati"),
          value: "lati",
        },
        {
          msg: that.$t("beacon.longi"),
          value: "longi",
        },
        {
          msg: that.$t("Building.projectid"),
          value: "projectid",
        },
        {
          msg: that.$t("Building.src"),
          value: "src",
        },
      ];
      let data = {
        projectid: this.intoProjectid,
      };
      getBuildingList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.export2Excel(res.data);
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    showVideo() {
      this.vedio = true;
    },
    closeVedio() {
      let myVideo = document.getElementById("video"); //对应video标签的ID
      myVideo.pause();
      myVideo.currentTime = 0;
    },
    //返回项目管理
    goProject() {
      this.$router.push("/projectmanagement");
    },
    // 加载地图
    initMap() {
      var that = this;
      if (this.map) {
        this.map.setTarget("sss");
        this.map = null;
      }
      this.seeLayer = new TileLayer({
        className: "baseLayerClass",
        source: that.openlayersSource,
      });
      if (this.mapInfo.length > 0) {
        this.view = new View({
          projection: "EPSG:4326",
          center: [that.longi, that.lati],
          zoom: that.zoom,
        });
      } else {
        this.view = new View({
          projection: "EPSG:4326",
          center: that.mapCenter,
          zoom: 5,
        });
      }
      setTimeout(() => {
        this.map = new Map({
          target: "map",
          layers: [this.seeLayer],
          view: this.view,
        });

        this.map.addControl(new ScaleLine());
        if (this.mapInfo.length > 0) {
          for (let i = 0; i < that.mapInfo.length; i++) {
            that.addIconMarkers(that.map, that.mapInfo[i]);
          }
        }
        this.mapClick();
        this.mapRightClick(this.map);
        this.addLine(this.map);
      }, 0);
    },

    //加载已存在的
    addIconMarkers(map, mapInfo) {
      var that = this;
      if (mapInfo.buildtype == null) {
        mapInfo.buildtype = 1;
      }
      var features = new OlFeature({
        longi: mapInfo.longi, //图标传入值
        lati: mapInfo.lati, //图标传入值
        src: mapInfo.src,
        projectid: mapInfo.projectid,
        building: mapInfo.building,
        id: mapInfo.id,
        buildtype: mapInfo.buildtype,
        mapid: mapInfo.mapid,
        allGround: mapInfo.flag,
        // type: "icon",
        geometry: new OlGeomPoint([mapInfo.longi, mapInfo.lati]),
      });

      this.source = new OlSourceVector({
        features: [features],
      });

      let style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: mapInfo.src,
          scale: 1,
          rotation: 0,
        }),
        // 设置图片下面显示字体的样式和内容
        text: new Text({
          text:
            mapInfo.buildtype == 1
              ? mapInfo.building
              : mapInfo.building + "(3D)", // 添加文字描述
          font: "12px font-size", // 设置字体大小
          fill: new Fill({
            // 设置字体颜色
            color: "white",
          }),
          offsetY: 10, // 设置文字偏移量
        }),
      });

      this.vectorLayer = new OlLayerVector({
        source: this.source,
        style: style,
      });
      this.modifyFeature(map, this.vectorLayer.getSource());
      map.addLayer(this.vectorLayer);
    },

    //添加图标
    addIconMarker(map, mapInfo) {
      var that = this;
      var buildingName;
      //通过判断选择的图标来判断要布置的楼栋的默认名
      switch (this.imgMsg) {
        //学校
        case that.$t("build.Parkinglot"):
          that.building1 += 1;
          that.building = that.building1;
          break;
        case that.$t("build.guard"):
          that.building2 += 1;
          that.building = that.building2;
          break;
        case that.$t("build.AcademicBuilding"):
          that.building3 += 1;
          that.building = that.building3;
          break;
        case that.$t("build.BasketballCourt"):
          that.building4 += 1;
          that.building = that.building4;
          break;
        case that.$t("build.LaboratoryBuilding"):
          that.building5 += 1;
          that.building = that.building5;
          break;
        case that.$t("build.library"):
          that.building6 += 1;
          that.building = that.building6;
          break;
        case that.$t("build.playground"):
          that.building7 += 1;
          that.building = that.building7;
          break;

        //居民区
        case that.$t("build.Residentialbuilding"):
          that.building3 += 1;
          that.building = that.building3;
          break;

        //医院
        case that.$t("build.Complexbuilding"):
          that.building3 += 1;
          that.building = that.building3;
          break;
        case that.$t("build.InpatientWard"):
          that.building4 += 1;
          that.building = that.building4;
          break;
        case that.$t("build.OutpatientDepartment"):
          that.building5 += 1;
          that.building = that.building5;
          break;

        //商场
        case that.$t("build.market"):
          that.building3 += 1;
          that.building = that.building3;
          break;

        //办公楼
        case that.$t("build.OfficeBuilding"):
          that.building3 += 1;
          that.building = that.building3;
          break;

        //仓库
        case that.$t("build.Warehouseplant"):
          that.building3 += 1;
          that.building = that.building3;
          break;

        //工场
        case that.$t("build.Factoryofficebuilding"):
          that.building3 += 1;
          that.building = that.building3;
          break;
        case that.$t("build.Factoryworkshop"):
          that.building4 += 1;
          that.building = that.building4;
          break;
        case that.$t("build.dormitory"):
          that.building5 += 1;
          that.building = that.building5;
          break;
        case that.$t("build.Building"):
          that.building += 1;
          break;
        default:
          break;
      }
      buildingName = this.imgMsg + this.building;
      for (let i = 0; i < this.mapInfo.length; i++) {
        if (buildingName == that.mapInfo[i].building) {
          that.building += 1;
          buildingName = that.imgMsg + that.building;
        }
      }
      // this.$store.commit("changeBuilding", this.building);
      var that = this;
      var features = new OlFeature({
        longi: mapInfo.x, //图标传入值
        lati: mapInfo.y, //图标传入值
        src: mapInfo.src,
        projectid: this.intoProjectid,
        building: buildingName,
        id: "",
        buildtype: 1,
        allGround: "false",
        // type: "icon",
        geometry: new OlGeomPoint([mapInfo.x, mapInfo.y]),
      });

      this.source = new OlSourceVector({
        features: [features],
      });

      let style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: mapInfo.src,
          scale: 1,
        }),
        // 设置图片下面显示字体的样式和内容
        text: new Text({
          text: buildingName, // 添加文字描述
          font: "12px font-size", // 设置字体大小
          fill: new Fill({
            // 设置字体颜色
            color: "white",
          }),
          offsetY: 10, // 设置文字偏移量
        }),
      });

      this.vectorLayer = new OlLayerVector({
        source: this.source,
        style: style,
      });
      this.modifyFeature(map, this.vectorLayer.getSource());
      map.addLayer(this.vectorLayer);
      this.buildingNameList.push(buildingName);
      switch (this.imgMsg) {
        //学校
        case that.$t("build.Parkinglot"):
          that.building1 = that.building;
          break;
        case that.$t("build.guard"):
          that.building2 = that.building;
          break;
        case that.$t("build.AcademicBuilding"):
          that.building3 = that.building;
          break;
        case that.$t("build.Residentialbuilding"):
          that.building3 = that.building;
          break;
        case that.$t("build.Complexbuilding"):
          that.building3 = that.building;
          break;
        case that.$t("build.market"):
          that.building3 = that.building;
          break;
        case that.$t("build.OfficeBuilding"):
          that.building3 = that.building;
          break;
        case that.$t("build.Warehouseplant"):
          that.building3 = that.building;
          break;
        case that.$t("build.Factoryofficebuilding"):
          that.building3 = that.building;
          break;
        case that.$t("build.BasketballCourt"):
          that.building4 = that.building;
          break;
        case that.$t("build.InpatientWard"):
          that.building4 = that.building;
          break;
        case that.$t("build.Factoryworkshop"):
          that.building4 = that.building;
          break;
        case that.$t("build.LaboratoryBuilding"):
          that.building5 = that.building;
          break;
        case that.$t("build.OutpatientDepartment"):
          that.building5 = that.building;
          break;
        case that.$t("build.dormitory"):
          that.building5 = that.building;
          break;
        case that.$t("build.library"):
          that.building6 = that.building;
          break;
        case that.$t("build.playground"):
          that.building7 = that.building;
          break;
      }
      let data = {
        longi: mapInfo.x, //图标传入值
        lati: mapInfo.y, //图标传入值
        src: mapInfo.src,
        projectid: that.intoProjectid,
        building: buildingName,
        id: "",
        buildtype: 1,
        tenantid: that.$store.state.intoProjectTenantid,
      };
      addBuilding(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
        (res) => {
          if (res.code == 1001) {
            let mapData = {
              projectid: that.intoProjectid,
              longi: mapInfo.x,
              lati: mapInfo.y,
              zoom: that.map.getView().getZoom(),
            };
            updateProjectPosition(
              mapData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.$store.commit(
                  "changeMapZoom",
                  that.map.getView().getZoom()
                );
                that.$store.commit("changeMapLongi", mapInfo.x);
                that.$store.commit("changeMapLati", mapInfo.y);
              }
            });
            let newData = {
              projectid: that.intoProjectid,
            };
            getBuildingList(
              newData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((ress) => {
              if (ress.code == 1001) {
                let newBuildId = [];
                ress.data.forEach((item) => {
                  newBuildId.push(item.id);
                });
                let newArr = newBuildId.filter(function (item) {
                  return that.buildingIdList.every(function (item1) {
                    return item != item1;
                  });
                });
                let buildId = newArr[0];
                that.buildingIdList.push(buildId);
                features.values_.id = buildId;
              }
            });
          } else {
            that.delFeature(features);
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },

    mapClick() {
      var that = this;
      this.map.on("click", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );

        if (feature) {
          // 命中特征，无操作
        } else {
          if (that.imgSrc == "") {
            that.$message({
              message: this.$t("Building.Pleaseicon"),
              type: "warning",
            });
            return;
          }
          this.$confirm(this.$t("Building.layout"), this.$t("Building.tips"), {
            confirmButtonText: this.$t("terminal.confirm"),
            cancelButtonText: this.$t("terminal.cancel"),
            type: "warning",
            callback: (action) => {
              if (action === "confirm") {
                let mapInfo = {
                  x: evt.coordinate[0],
                  y: evt.coordinate[1],
                  src: that.imgSrc,
                };
                that.addIconMarker(that.map, mapInfo);
                // }
              }
            },
          });
        }
      });
    },

    //右键事件
    mapRightClick(map) {
      var that = this;
      this.rightMenu = true;
      var menu_overlay = new Overlay({
        element: document.getElementById("contextmenu_container"),
        positioning: "center-center",
      });
      map.addOverlay(menu_overlay);
      $(map.getViewport()).on("contextmenu", function (event) {
        event.preventDefault();
        // 书写事件触发后的函数
        var pixel = map.getEventPixel(event.originalEvent);
        var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });
        if (feature) {
          that.mapType2 = false;
          that.mapType3 = false;
          if (
            (feature.values_.buildtype == 1 ||
              feature.values_.buildtype == 2) &&
            (that.contrForPrionum == 3 || that.contrForPrionum == 4)
          ) {
            that.mapType3 = true;
            that.mapType2 = true;
          }
          if (feature.values_.longi) {
            var coordinate = map.getEventCoordinate(event.originalEvent);
            menu_overlay.setPosition(coordinate);
            $("#popup-closer").on("click", function (event) {
              event.preventDefault();
              menu_overlay.setPosition(undefined);
              that.removeClick();
            }); // 点击关闭的按钮
            $("#del").click(function () {
              that.delFeature(feature, menu_overlay);
            });
            $("#edit").click(function () {
              that.editFeature(feature, menu_overlay);
            });
            $("#maptype3").click(function () {
              that.setMaptype3D(feature, menu_overlay);
            });
            $("#maptype2").click(function () {
              that.setMaptype2D(feature, menu_overlay);
            });
            $("#triggerAlarm").click(function () {
              that.sendDevOtherAlarmMores("no", feature);
            });
            $("#cancelAlarm").click(function () {
              that.sendDevOtherAlarmMores("no", feature);
            });
          }
        }
      });
    },
    removeClick() {
      $("#del").unbind("click");
      $("#edit").unbind("click");
      $("#maptype3").unbind("click");
      $("#maptype2").unbind("click");
      $("#triggerAlarm").unbind("click");
      $("#cancelAlarm").unbind("click");
    },
    // 根据设备号触发或取消告警
    sendDevOtherAlarmMores(val, info) {
      var that = this;
      this.$confirm(
        val == "yes"
          ? this.$t("otherDev.triggerAlarmtrue")
          : this.$t("otherDev.cancelAlarmtrue"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          alarm: val,
          devtype: 4,
          inuse: 1,
          buildid: info.values_.id,
          projectid: info.values_.projectid,
        };
        sendDevOtherAlarmMore(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "success",
            });
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },
    // 设置地图类型（2D，3D）
    setMaptype3D(feature, menu_overlay) {
      var that = this;
      this.$confirm(this.$t("build.Set3Dtet"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      })
        .then(() => {
          let data = {
            id: feature.values_.id,
            building: feature.values_.building,
            buildtype: 2,
            longi: feature.values_.longi,
            lati: feature.values_.lati,
            src: feature.values_.src,
            projectid: that.intoProjectid,
          };
          updateBuildingOne(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("Building.Setsuccessfully"),
                type: "success",
              });
              feature.values_.buildtype = 2;
              feature.setStyle(
                new OlStyleStyle({
                  image: new OlStyleIcon({
                    anchor: [0.5, 1],
                    src: feature.values_.src,
                    scale: 1,
                  }),
                  // 设置图片下面显示字体的样式和内容
                  text: new Text({
                    text: feature.values_.building + "(3D)", // 添加文字描述
                    font: "12px font-size", // 设置字体大小
                    fill: new Fill({
                      // 设置字体颜色
                      color: "white",
                    }),
                    offsetY: 10, // 设置文字偏移量
                  }),
                })
              );
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Building.Cancelsetting"),
          });
        });
    },
    setMaptype2D(feature, menu_overlay) {
      var that = this;
      this.$confirm(this.$t("build.Set2Dtet"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      })
        .then(() => {
          let data = {
            id: feature.values_.id,
            building: feature.values_.building,
            buildtype: 1,
            longi: feature.values_.longi,
            lati: feature.values_.lati,
            src: feature.values_.src,
            projectid: that.intoProjectid,
          };
          updateBuildingOne(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("Building.Setsuccessfully"),
                type: "success",
              });
              feature.values_.buildtype = 1;
              feature.setStyle(
                new OlStyleStyle({
                  image: new OlStyleIcon({
                    anchor: [0.5, 1],
                    src: feature.values_.src,
                    scale: 1,
                  }),
                  // 设置图片下面显示字体的样式和内容
                  text: new Text({
                    text: feature.values_.building, // 添加文字描述
                    font: "12px font-size", // 设置字体大小
                    fill: new Fill({
                      // 设置字体颜色
                      color: "white",
                    }),
                    offsetY: 10, // 设置文字偏移量
                  }),
                })
              );
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Building.Cancelsetting"),
          });
        });
    },
    //拖拽
    modifyFeature(map, source) {
      var that = this;
      var feature;
      this.modify = new Modify({
        source: source,
      });
      //移动前
      this.modify.on("modifystart", (e) => {
        this.startX = e.mapBrowserEvent.coordinate[0];
        this.startY = e.mapBrowserEvent.coordinate[1];
      });

      //移动后
      this.modify.on("modifyend", (e) => {
        this.endX = e.mapBrowserEvent.coordinate[0];
        this.endY = e.mapBrowserEvent.coordinate[1];
        source.getFeatures()[0].values_.longi = e.mapBrowserEvent.coordinate[0];
        source.getFeatures()[0].values_.lati = e.mapBrowserEvent.coordinate[1];
        let data = {
          id: source.getFeatures()[0].values_.id,
          building: source.getFeatures()[0].values_.building,
          projectid: source.getFeatures()[0].values_.projectid,
          buildtype: source.getFeatures()[0].values_.buildtype,
          longi: source.getFeatures()[0].values_.longi,
          lati: source.getFeatures()[0].values_.lati,
          src: source.getFeatures()[0].values_.src,
        };
        updateBuildingOne(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            let mapData = {
              projectid: that.intoProjectid,
              longi: source.getFeatures()[0].values_.longi,
              lati: source.getFeatures()[0].values_.lati,
              zoom: that.map.getView().getZoom(),
            };
            updateProjectPosition(
              mapData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.$store.commit(
                  "changeMapZoom",
                  that.map.getView().getZoom()
                );
                that.$store.commit(
                  "changeMapLongi",
                  source.getFeatures()[0].values_.longi
                );
                that.$store.commit(
                  "changeMapLati",
                  source.getFeatures()[0].values_.lati
                );
              }
            });
          }
          if (res.code != 1001) {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            source
              .getFeatures()[0]
              .setGeometry(new OlGeomPoint([that.startX, that.startY]));
          }
        });
      });

      map.addInteraction(this.modify);
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
    //点击之后可以在地图上布置
    //点击图片，获取图片地址
    changeImgSrc(index, src, msg) {
      this.building = 0;
      this.imgSrc = src;
      this.isActives = index;
      this.imgMsg = msg;
    },

    //编辑

    editFeature(feature, menu_overlay) {
      this.menu_overlay = menu_overlay;
      this.editData.building = feature.values_.building;
      this.editDataBuilding = feature.values_.building;
      this.editData.src = feature.values_.src;
      this.editData.id = feature.values_.id;
      this.editData.lati = feature.values_.lati;
      this.editData.longi = feature.values_.longi;
      this.editData.buildtype = feature.values_.buildtype;
      this.editData.projectid = feature.values_.projectid;
      this.oldEditBUilding = feature.values_.building;
      this.editFeatureInfo = feature;
      this.showAllGround = feature.values_.allGround;
      this.showAllGroundEdit = feature.values_.buildtype == 1 ? false : true;
      this.edit = true;
    },
    editCancel() {
      this.edit = false;
      this.oldEditBUilding = "";
    },
    editTrue() {
      var that = this;
      if (this.editDataBuilding != this.editData.building)
        if (that.buildingNameList.indexOf(that.editData.building) > -1) {
          that.$message({
            message: that.editData.building + "已存在",
            type: "warning",
          });
          return;
        }
      let data = {
        id: that.editData.id,
        building: that.editData.building,
        projectid: that.editData.projectid,
        buildtype: that.editData.buildtype,
        longi: that.editData.longi,
        lati: that.editData.lati,
        src: that.editData.src,
        flag: that.showAllGround,
      };
      updateBuildingOne(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.editFeatureInfo.values_.building = that.editData.building;
          that.editFeatureInfo.values_.src = that.editData.src;
          that.editFeatureInfo.values_.id = that.editData.id;
          that.editFeatureInfo.values_.lati = that.editData.lati;
          that.editFeatureInfo.values_.longi = that.editData.longi;
          that.editFeatureInfo.values_.projectid = that.editData.projectid;
          that.editFeatureInfo.values_.allGround = that.showAllGround;
          that.$message({
            message: that.$t("mapmanagement.editsuccess"),
            type: "success",
          });
          that.edit = false;
          that.buildingNameList = that.buildingNameList.filter(function (item) {
            return item != that.oldEditBUilding;
          });
          that.buildingNameList.push(that.editData.building);
          that.editFeatureInfo.setStyle(
            new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: that.editData.src,
                scale: 1,
              }),
              // 设置图片下面显示字体的样式和内容
              text: new Text({
                text:
                  that.editFeatureInfo.values_.buildtype == 1
                    ? that.editData.building
                    : that.editData.building + "(3D)", // 添加文字描述
                font: "12px font-size", // 设置字体大小
                fill: new Fill({
                  // 设置字体颜色
                  color: "white",
                }),
                offsetY: 10, // 设置文字偏移量
              }),
            })
          );

          that.menu_overlay.setPosition(undefined);
          that.removeClick();
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //删除
    delFeature(e, menu_overlay) {
      var that = this;
      if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        this.$message({
          message: this.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      this.removeClick();
      if (e.values_.id) {
        let data = {
          buildid: e.values_.id,
        };
        getGroundList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (res.data.length == 0) {
              let delData = {
                buildid: e.values_.id,
                projectid: that.intoProjectid,
              };
              delBuilding(
                delData,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  let LayerArrays = that.map.getLayers().getArray();
                  for (let i = 1; i < LayerArrays.length; i++) {
                    if (
                      e.values_.longi ==
                        LayerArrays[i].getSource().getFeatures()[0].values_
                          .longi &&
                      e.values_.lati ==
                        LayerArrays[i].getSource().getFeatures()[0].values_.lati
                    ) {
                      that.buildingNameList = that.buildingNameList.filter(
                        function (item) {
                          return item != e.values_.building;
                        }
                      );
                      LayerArrays[i]
                        .getSource()
                        .getFeatures()
                        .forEach(function (feature) {
                          LayerArrays[i].getSource().removeFeature(feature);
                        });
                      if (menu_overlay) {
                        menu_overlay.setPosition(undefined);
                      }
                      that.removeClick();
                      that.map.removeLayer(LayerArrays[i]);
                    }
                  }
                  that.buildingIdList.forEach((item, index) => {
                    if (item == e.values_.id) {
                      that.buildingIdList.splice(index, 1);
                    }
                  });
                  that.$message({
                    message: this.$t("beacon.deletesuccess"),
                    type: "success",
                  });
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                }
              });
            } else {
              that.$message({
                message: this.$t("Building.buildingfirst"),
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
        let LayerArrays = that.map.getLayers().getArray();
        for (let i = 1; i < LayerArrays.length; i++) {
          if (
            e.values_.longi ==
              LayerArrays[i].getSource().getFeatures()[0].values_.longi &&
            e.values_.lati ==
              LayerArrays[i].getSource().getFeatures()[0].values_.lati
          ) {
            that.buildingNameList = that.buildingNameList.filter(function (
              item
            ) {
              return item != e.values_.building;
            });
            LayerArrays[i]
              .getSource()
              .getFeatures()
              .forEach(function (feature) {
                LayerArrays[i].getSource().removeFeature(feature);
              });
            if (menu_overlay) {
              menu_overlay.setPosition(undefined);
            }
            that.removeClick();
            that.map.removeLayer(LayerArrays[i]);
          }
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
        if (LayerArrays[i].getSource().getFeatures()[0].values_.building) {
          //因为画了南海那边的虚线，导致会多获取一个，判断
          info = {
            building: LayerArrays[i].getSource().getFeatures()[0].values_
              .building,
            longi: LayerArrays[i].getSource().getFeatures()[0].values_.longi,
            lati: LayerArrays[i].getSource().getFeatures()[0].values_.lati,
            src: LayerArrays[i].getSource().getFeatures()[0].values_.src,
            id: LayerArrays[i].getSource().getFeatures()[0].values_.id,
          };
          that.arrs.push(info);
        }
      }
    },
    //获取楼栋信息
    getBuildingByProjectids() {
      var that = this;
      let data = {
        projectid: this.intoProjectid,
      };
      getBuildingList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.mapInfo = res.data;
          for (let i = 0; i < that.mapInfo.length; i++) {
            that.buildingNameList.push(that.mapInfo[i].building);
            that.buildingIdList.push(that.mapInfo[i].id);
          }
          that.initMap();
        }
      });
    },
  },
  beforeMount() {
    let that = this;
    if (this.$store.state.longis && this.$store.state.latis) {
      this.mapCenter = [this.$store.state.longis, this.$store.state.latis];
    } else {
      if (that.$store.state.i18n == "zh") {
        that.mapCenter = [118, 32];
      } else {
        that.mapCenter = [0.1, 51.3];
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
    switch (Number(this.$store.state.intoProjectprojectType)) {
      case 1:
        this.imgBtnInfo = this.schoolImgInfo;
        break;
      case 2:
        this.imgBtnInfo = this.hospitalImgInfo;
        break;
      case 3:
        this.imgBtnInfo = this.officesImgInfo;
        break;
      case 4:
        this.imgBtnInfo = this.residenceImgInfo;
        break;
      case 5:
        this.imgBtnInfo = this.workshopImgInfo;
        break;
      case 6:
        this.imgBtnInfo = this.warehouseImgInfo;
        break;
      case 7:
        // 保持不变
        break;
      case 8:
        this.imgBtnInfo = this.marketImgInfo;
        break;
      case 9:
        // 保持不变
        break;
      case 10:
        // 保持不变
        break;
      case 11:
        // 保持不变
        break;
      case 12:
        // 保持不变
        break;
      default:
        break;
    }
    this.getBuildingByProjectids();
  },
  beforeDestroy() {
    var that = this;
    let data = {
      projectid: this.intoProjectid,
      longi: this.map.getView().getCenter()[0],
      // longi:
      //   this.map.getView().getCenter()[0] > 0
      //     ? this.map.getView().getCenter()[0]
      //     : 360 + this.map.getView().getCenter()[0],
      lati: this.map.getView().getCenter()[1],
      zoom: this.map.getView().getZoom(),
    };
    updateProjectPosition(
      data,
      this.tenantkey_A,
      this.tenantid_A,
      this.userName
    ).then((res) => {
      if (res.code == 1001) {
        that.$store.commit("changeMapZoom", data.zoom);
        that.$store.commit("changeMapLongi", data.longi);
        that.$store.commit("changeMapLati", data.lati);
      }
    });
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.schoolImgInfo,
        this.$options.data.call(this).schoolImgInfo
      );
      Object.assign(
        this.$data.imgBtnInfo,
        this.$options.data.call(this).imgBtnInfo
      );
      Object.assign(
        this.$data.residenceImgInfo,
        this.$options.data.call(this).residenceImgInfo
      );
      Object.assign(
        this.$data.hospitalImgInfo,
        this.$options.data.call(this).hospitalImgInfo
      );
      Object.assign(
        this.$data.marketImgInfo,
        this.$options.data.call(this).marketImgInfo
      );
      Object.assign(
        this.$data.officesImgInfo,
        this.$options.data.call(this).officesImgInfo
      );
      Object.assign(
        this.$data.warehouseImgInfo,
        this.$options.data.call(this).warehouseImgInfo
      );
      Object.assign(
        this.$data.workshopImgInfo,
        this.$options.data.call(this).workshopImgInfo
      );
    },
  },
};
</script>

<style scoped>
#articleImage {
  display: none;
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
.el-table >>> .el-table__row td {
  padding: 5px 0 !important;
}
.reset {
  padding: 8px 12px !important;
  margin-top: 5px;
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
.mapConent {
  display: flex;
  margin-top: 2%;
  z-index: 1;
}
#map {
  height: 700px;
  width: 100%;
  z-index: 1;
}
#map >>> .baseLayerClass {
  filter: grayscale(100%) sepia(51%) invert(100%) saturate(350%);
}
#map img {
  max-width: none;
}
.assignMapContent {
  display: flex;
}
.imgBtn {
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}

.imgBtn p {
  display: flex;
  flex-direction: column;
  margin-top: 20%;
}

.imgBtn img {
  width: 50px;
  height: 50px;
}
.activeClass {
  outline: 2px solid #c0c0c0;
}
#contextmenu_container {
  display: flex;
  flex-direction: column;
}
#contextmenu_container li {
  display: flex;
}
#popup-content {
  /* margin-left: 50%; */
  background: #f1f5f7 !important;
}
#popup-content button {
  background: #f1f5f7 !important;
  width: 100%;
  text-align: left;
  border: none;
}
#popup-content button:hover {
  background: skyblue !important;
  color: white;
}
#popup-content #del:hover {
  background-color: rgb(196, 27, 27) !important;
}
.ol-popup-closer {
  margin-right: 5px;
}
li {
  list-style: none;
  margin-top: 5px;
}
#popup-content li:first-of-type {
  margin-top: 0px;
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
.main {
  overflow: visible;
}
</style>
