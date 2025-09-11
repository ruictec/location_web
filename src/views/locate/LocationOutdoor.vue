<template>
  <div class="content">
    <div class="inputContent">
      <el-form
        class="demo-form-inline"
        style="display: flex; white-space: nowrap; margin-left: 0%"
        :model="searchList"
      >
        <el-form-item
          :label="$t('staffmanagement.username1')"
          style="display: flex; margin-left: 0%; margin-right: 2%"
        >
          <el-select
            clearable
            filterable
            remote
            :remote-method="remoteUserMethod"
            v-model="perDeveui"
            :placeholder="$t('staffmanagement.text')"
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
          :label="$t('car.Numberplate')"
          style="display: flex; margin-left: 1%; margin-right: 2%"
          v-if="intoProjectType == 1"
        >
          <el-select
            clearable
            filterable
            remote
            :remote-method="remoteTBoxMethod"
            v-model="tboxDeveui"
            :placeholder="$t('staffmanagement.text')"
            style="width: 120%"
          >
            <el-option
              v-for="item in tboxOptions"
              :key="item.maplabel"
              :label="item.sn"
              :value="item.maplabel"
            >
              <span style="float: left">{{ item.sn }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.maplabel
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display: flex; margin-left: 2%">
          <el-button type="primary" class="query" @click="searchInfo()">{{
            $t("floormanagement.search")
          }}</el-button>
          <el-button type="primary" class="reset" @click="clearBtn()">{{
            $t("floormanagement.reset")
          }}</el-button>
          <el-button type="primary" class="reset" @click="goHis()">{{
            $t("Breadcrumb.Historicaltrack")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 地图 -->
    <div class="mapConent">
      <div id="map"></div>
      <div id="popup-num" class="ol-popup-num">
        <a
          href="#"
          id="popup-closer-num"
          class="ol-popup-closer-num"
          @click="closePopup"
        ></a>
        <div id="popup-content-num"></div>
      </div>
    </div>

    <!-- 鼠标左键显示内容 -->
    <el-dialog
      :visible.sync="visible"
      :width="showBracelet ? '25%' : '20%'"
      @close="clearInfo()"
      class="Info_dialog"
      :modal="false"
    >
      <!-- 左键显示内容的 -->
      <div id="popup" class="ol-popup">
        <div id="popup-content">
          <ul v-show="devPer" class="container">
            <!-- 左上部分：图片 -->
            <div class="left-top">
              <el-image
                style="width: 100%; height: auto"
                :src="imagePath"
              ></el-image>
            </div>

            <!-- 右上部分：基本信息 -->
            <div class="right-top">
              <li class="goDev">
                {{ $t("locationoutdoor.name") }}
                <a @click="goStaff(username)">{{ username }}</a>
              </li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.age") }}{{ age }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.sex") }}{{ sexstr }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.worktype") }}{{ worktype }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.department") }}{{ depart }}</li>
            </div>

            <!-- 下部：其余信息 -->
            <div class="bottom" v-if="showBracelet">
              <el-divider class="divider"></el-divider>
              <!-- 设备信息 -->
              <p class="bracelet_title">
                {{ $t("LocationIndoor.equipmentInfo") }}
              </p>
              <li class="goDev bracelet_dev">
                <span
                  >{{ $t("terminal.deveui") }}
                  <a @click="goDevs(maplabel)">{{ maplabel }}</a></span
                >
                <span v-if="battery"
                  >{{ $t("locationoutdoor.electricity") }}{{ battery }}%</span
                >
              </li>
              <!-- <el-divider class="divider"></el-divider> -->
              <li>{{ $t("terminal.Locationupdatetime1") }}{{ gpstime }}</li>

              <el-divider class="divider"></el-divider>
              <!-- 手环数据 -->
              <p class="bracelet_title">
                {{ $t("LocationIndoor.braceletData") }}
              </p>
              <li class="bracelet_dev">
                <span>{{ $t("terminal.deveui") }} {{ bracelet_eui }}</span>
                <span
                  >{{ $t("locationoutdoor.electricity")
                  }}{{ bracelet_soc }}%</span
                >
              </li>
              <!-- <el-divider class="divider"></el-divider> -->
              <li class="bracelet_dev">
                <span
                  >{{ $t("LocationIndoor.heartRate") }}{{ bracelet_rate }}</span
                >
                <span
                  >{{ $t("LocationIndoor.temperature")
                  }}{{ bracelet_tem }} °C</span
                >
                <span
                  >{{ $t("LocationIndoor.oxygen") }}{{ bracelet_oxygen }}</span
                >
              </li>
              <!-- <el-divider class="divider"></el-divider> -->
              <li>{{ $t("home.Dataupdatetime") }}{{ bracelet_time }}</li>
            </div>
            <div class="bottom" v-else>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.telephone") }}{{ tel }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.cardno") }}{{ cardno }}</li>

              <el-divider class="divider" v-if="battery"></el-divider>
              <li v-if="battery">
                {{ $t("locationoutdoor.electricity") }}{{ battery }} %
              </li>

              <el-divider class="divider"></el-divider>
              <li class="goDev">
                {{ $t("terminal.deveui") }}
                <a @click="goDevs(maplabel)">{{ maplabel }}</a>
              </li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("terminal.Locationupdatetime1") }}{{ gpstime }}</li>
            </div>
          </ul>

          <ul v-show="devAsset" class="container">
            <!-- 左上部分：图片 -->
            <div class="left-top">
              <el-image
                style="width: 100%; height: auto"
                :src="imageAsset"
              ></el-image>
            </div>
            <!-- 右上部分：基本信息 -->
            <div class="right-top">
              <li>{{ $t("locationoutdoor.AssetName") }}{{ assetName }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Assettype") }}{{ assetType }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Assetmodel") }}{{ assetModel }}</li>
            </div>

            <!-- 下部：其余信息 -->
            <div class="bottom">
              <el-divider class="divider"></el-divider>
              <li class="goDev">
                {{ $t("LocationIndoor.TagNo")
                }}<a @click="goBeacons(assetBeaconid)">{{ assetBeaconid }}</a>
              </li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Department") }}{{ assetDepart }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.User") }}{{ assetUser }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Time") }}{{ assetTime }}</li>
            </div>
          </ul>

          <ul v-show="devTBox">
            <el-image
              style="width: 150px; height: 150px"
              :src="imageTBox"
            ></el-image>
            <li>{{ $t("locationoutdoor.carnumber") }}{{ tboxName }}</li>
            <el-divider class="divider"></el-divider>
            <li>{{ $t("locationoutdoor.Vehicletype") }}{{ tboxType }}</li>
            <el-divider class="divider"></el-divider>
            <li class="goDev">
              {{ $t("LocationIndoor.TagNo")
              }}<a @click="goDevs(tboxMaplabel)">{{ tboxMaplabel }}</a>
            </li>
            <el-divider class="divider"></el-divider>
            <li>{{ $t("locationoutdoor.time") }}{{ tboxTime }}</li>
            <el-divider class="divider"></el-divider>
          </ul>
        </div>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      :title="$t('locationoutdoor.text')"
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
        <el-form-item :label="$t('locationoutdoor.floor')">
          <el-input
            v-model="editData.building"
            :placeholder="$t('locationoutdoor.text1')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">{{ $t("warning.Cancel") }}</el-button>
        <el-button type="primary" @click="editTrue()">{{
          $t("warning.Sure")
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="nameNum"
      :visible.sync="showNameNum"
      class="edit"
      width="50%"
      style="text-align: center"
    >
      <el-table :data="numData" style="width: 100" max-height="660" stripe="">
        <el-table-column
          property="username"
          :label="$t('staff.employeename')"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          property="tel"
          :label="$t('staff.telephone')"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          property="worktype"
          :label="$t('staff.Typeofwork')"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          property="maplabel"
          :label="$t('staff.Workcardnumber')"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLastDevGps,
  getMemberNameId,
  getTboxSnId,
  getDevGpsOne,
  getMemberInformation,
  getTboxOne,
  getAssetOne,
  getDevGpsList,
  getFenceManageAndPointList,
  getFenceManageWhiteList,
  getFenceManageWhiteNum,
} from "../../axios/api";

import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlLayerVector from "ol/layer/Vector";
import OlSourceVector from "ol/source/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";

import ImageLayer from "ol/layer/Image";
import Overlay from "ol/Overlay";

// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

// 描线
import { Stroke, Style } from "ol/style";
import { LineString, Polygon } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";

//地图控件
import ScaleLine from "ol/control/ScaleLine"; //比例尺控件
import { fromLonLat } from "ol/proj";

import host from "../../host";
export default {
  name: "LocationOutdoor",
  data() {
    return {
      i8n: this.$store.state.i18n,
      openlayersSource: "",
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      userList: [],
      tboxList: [],
      searchList: {
        deveui: "",
        projectid: this.$store.state.projectid,
        devtype: "",
        postype: 2,
      },
      sostype: false, //判断是否为SOS告警
      map: "",
      seeLayer: "",
      view: "",
      mapName: "map",
      vectorLayer: null,
      source: null,
      imgMsg: "",
      edit: false,

      // building: this.$store.state.building - 1, //默认楼栋号
      building: 0, //默认楼栋号
      mapInfo: "",
      buildingNameList: [], //用来判断是否有重名的
      editData: {
        building: "",
        src: "",
        id: "",
        lati: "",
        longi: "",
        projectid: "",
      },
      arrs: [],
      editFeatureInfo: "",
      oldEditBUilding: "",
      menu_overlay: "",
      zoom: this.$store.state.mapZoom,
      longi: this.$store.state.longis,
      lati: this.$store.state.latis,
      perDeveui: "",
      tboxDeveui: "",
      // wsuri:
      //   "ws://192.168.2.12:14501/websocket/map/" + this.$store.state.projectid,

      wsuri: host.ws + "map/" + this.$store.state.projectid,

      //输入框模糊查询
      userLoading: false,
      tboxLoading: false,
      userOptions: [],
      tboxOptions: [],

      //点击显示的个人信息

      visible: false, //信息详情弹框
      devPer: false, //单击显示人的信息
      showBracelet: false, //是否显示手环健康数据
      devTBox: false, //单击显示车辆的信息
      devAsset: false, //单击显示资产的信息
      // 手环信息
      bracelet_eui: "", //设备号
      bracelet_soc: "", //电量
      bracelet_rate: "", //心率
      bracelet_tem: "", //体温
      bracelet_oxygen: "", //血氧
      bracelet_time: "", //时间
      age: "",
      depart: "",
      cardno: "",
      maplabel: "",
      sexstr: "",
      tel: "",
      worktype: "",
      username: "",
      imagePath: "",
      gpstime: "",
      imageAsset: "",
      assetName: "",
      assetType: "",
      assetModel: "",
      assetBeaconid: "",
      assetDepart: "",
      assetUser: "",
      assetTime: "",
      imageTBox: "",
      tboxName: "",
      tboxType: "",
      tboxMaplabel: "",
      tboxTime: "",
      mapCenter: [],
      xinaoList: [],
      AllFences: [],
      vectorSource: null,
      fences: [], // 存储围栏和数字的数组
      popupOverlay: null,
      popupCloser: null,
      nameNum: "",
      showNameNum: false,
      numData: [],
      whiteType: "",
      whiteNum: 0,
      blackNum: 0,
      whiteNotNum: 0,
      fenceId: "",
      battery: "", //工卡电量
    };
  },
  methods: {
    // 点击信息弹框中的人名,跳转查询
    goStaff(username) {
      this.$router.push({
        path: "/staff/staffmanagement",
        query: {
          username: username,
        },
      });
    },
    // 点击信息弹框中的卡号,跳转查询
    goDevs(deveui) {
      this.$router.push({
        path: "/device/terminal",
        query: {
          deveui: deveui,
        },
      });
    },
    goBeacons(deveui) {
      this.$router.push({
        path: "/device/beacon",
        query: {
          beaconid: deveui,
        },
      });
    },
    // 计算年龄
    ages(str) {
      if (str == "" || str == null) {
        return 0;
      }
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
      if (r == null) return 0;
      var d = new Date(r[1], r[3] - 1, r[4]);
      if (
        d.getFullYear() == r[1] &&
        d.getMonth() + 1 == r[3] &&
        d.getDate() == r[4]
      ) {
        var Y = new Date().getFullYear();
        return Y - r[1];
      }
      return 0;
    },
    // 跳转历史轨迹
    goHis() {
      this.$router.push({
        path: "/location/outdoor/historical",
      });
    },
    // 清空个人信息和车辆信息
    clearInfo() {
      this.imageTBox = "";
      this.imagePath = "";
      this.username = "";
      this.age = "";
      this.sexstr = "";
      this.tel = "";
      this.maplabel = "";
      this.cardno = "";
      this.worktype = "";
      this.depart = "";
      this.gpstime = "";
      this.imageAsset = "";
      this.assetName = "";
      this.assetType = "";
      this.assetModel = "";
      this.assetBeaconid = "";
      this.assetDepart = "";
      this.assetUser = "";
      this.assetTime = "";
      this.tboxName = "";
      this.tboxType = "";
      this.tboxMaplabel = "";
      this.tboxTime = "";
    },
    //查询
    searchInfo(per, tbox) {
      var that = this;
      if (that.websock) {
        console.log("断开");
        that.websock.close(); //断开websocket
      }
      if (this.perDeveui && this.tboxDeveui) {
        this.$message({
          message: this.$t("locationoutdoor.text2"),
          type: "warning",
        });
        return;
      }

      if (this.perDeveui) {
        this.tboxDeveui = "";
        this.searchList.deveui = this.perDeveui;
        if (that.intoProjectType == 1) {
          that.searchList.devtype = 1;
        } else if (that.intoProjectType == 2) {
          that.searchList.devtype = 2;
        }
      }
      if (this.tboxDeveui) {
        this.perDeveui = "";
        this.searchList.deveui = this.tboxDeveui;
        this.searchList.devtype = 4;
      }
      if (per) {
        this.searchList.deveui = per;
        if (that.intoProjectType == 1) {
          that.searchList.devtype = 1;
        } else if (that.intoProjectType == 2) {
          that.searchList.devtype = 2;
        }
      }
      if (tbox) {
        this.searchList.deveui = tbox;
        this.searchList.devtype = 4;
      }
      if (!this.searchList.deveui) {
        this.$message({
          message: this.$t("locationoutdoor.text3"),
          type: "warning",
        });
        return;
      }
      //判断是否从告警管理页面跳转过来的，如果是，就使用触发告警时的信息
      if (that.$route.query.warning == "true") {
        console.log('warning == "true"');
        let sosData = that.$store.state.sosData;
        if (per) {
          that.remoteUserMethod(sosData.deveui);
          setTimeout(() => {
            that.tboxDeveui = "";
            that.perDeveui = sosData.deveui;
          }, 201);
          that.delFeature(sosData);
          setTimeout(() => {
            that.addIconMarker(that.map, sosData, true);
            const center = fromLonLat([sosData.x, sosData.y]);
            that.map.getView().setCenter(center);
          }, 100);
        }
        if (tbox) {
          that.remoteTBoxMethod(sosData.deveui);
          setTimeout(() => {
            that.perDeveui = "";
            that.tboxDeveui = sosData.deveui;
          }, 201);
          that.delFeature(sosData);
          setTimeout(() => {
            that.addTBoxIconMarker(that.map, sosData, true);
            const center = fromLonLat([sosData.x, sosData.y]);
            that.map.getView().setCenter(center);
          }, 100);
        }
      } else {
        getDevGpsOne(
          this.searchList,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (per) {
              that.remoteUserMethod(res.data.deveui);
              setTimeout(() => {
                that.perDeveui = res.data.deveui;
              }, 201);
            }
            if (tbox) {
              that.remoteTBoxMethod(res.data.deveui);
              setTimeout(() => {
                that.tboxDeveui = res.data.deveui;
              }, 201);
            }
            if (
              res.data.gpstime == null ||
              res.data.gpstime == "" ||
              res.data.gpstime == 0
            ) {
              that.$message({
                message: this.$t("locationoutdoor.text4"),
                type: "warning",
              });
            } else {
              if (res.data.postype == 1) {
                that.$confirm(
                  this.$t("locationoutdoor.text5"),
                  this.$t("Building.tips"),
                  {
                    confirmButtonText: this.$t("terminal.confirm"),
                    cancelButtonText: this.$t("terminal.cancel"),
                    type: "warning",
                    callback: (action) => {
                      if (action === "confirm") {
                        if (that.perDeveui) {
                          that.$router.push({
                            path: "/location/indoor/locationindoor",
                            query: { deveui: res.data.deveui },
                          });
                        } else if (that.tboxDeveui) {
                          that.$router.push({
                            path: "/location/indoor/locationindoor",
                            query: { tboxDeveui: res.data.deveui },
                          });
                        }
                      }
                    },
                  }
                );
              } else if (res.data.postype == 2) {
                if (that.websock) {
                  that.websock.close(); //断开websocket
                }
                that.delFeature(res.data);
                if (that.perDeveui || per) {
                  that.addIconMarker(that.map, res.data, true);
                } else if (that.tboxDeveui || tbox) {
                  that.addTBoxIconMarker(that.map, res.data, true);
                }
                const center = fromLonLat([res.data.x, res.data.y]);
                that.map.getView().setCenter(center);
                that.wsuri = host.ws + "map/" + that.searchList.deveui;
                that.initWebsocketOne();
              }
            }
          } else {
            this.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    //刷新
    clearBtn() {
      //重置搜索框
      this.perDeveui = "";
      this.tboxDeveui = "";

      this.searchList = {
        deveui: "",
        projectid: this.$store.state.projectid,
        devtype: "",
        postype: 2,
      };
      //重新连接websocket
      this.initWebsocket();
      this.getMemberNames();
      this.getTboxSnIds();
      console.log(this.sostype);
      this.sostype = false;
      var that = this;
      //删除所有图标   //重新获取
      let LayerArrays;
      if (this.map) {
        LayerArrays = that.map.getLayers().getArray();
      }

      // for (let i = 1; i < LayerArrays.length; i++) {
      //   LayerArrays[i]
      //     .getSource()
      //     .getFeatures()
      //     .forEach(function (feature) {
      //       LayerArrays[i].getSource().removeFeature(feature);
      //     });
      //   this.map.removeLayer(LayerArrays[i]);
      //   i--;
      // }
      LayerArrays.forEach((layer) => {
        if (layer instanceof VectorLayer) {
          if (layer.getSource().getFeatures().length > 0) {
            if (e.deveui == layer.getSource().getFeatures()[0].values_.deveui) {
              layer
                .getSource()
                .getFeatures()
                .forEach(function (feature) {
                  layer.getSource().removeFeature(feature);
                });
              this.map.removeLayer(layer);
            }
          }
        } else if (layer instanceof ImageLayer) {
          console.log("This layer is an ImageLayer.");
        } else if (layer instanceof TileLayer) {
          console.log("This layer is a TileLayer.");
        } else {
          console.log("This layer type is unknown.");
        }
      });
      let data = {
        projectid: this.$store.state.projectid,
        gpstype: 2,
      };
      getLastDevGps(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.mapInfo = res.data;
          setTimeout(() => {
            if (this.mapInfo.length > 0) {
              for (let i = 0; i < that.mapInfo.length; i++) {
                that.addIconMarkers(that.map, that.mapInfo[i]);
              }
            }
          }, 0);
        }
      });
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
    // 将16进制颜色和透明度转换为rgba格式
    hexToRgba(hex, opacity) {
      const rgb = parseInt(hex.slice(1), 16); // 转换为 RGB 整数
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
          id: fenceData.id,
          number: fenceData.num,
        });
        const numberFeature = new Feature({
          geometry: polygon.getInteriorPoint(),
          number: fenceData.num,
          type: "number",
          id: fenceData.id,
        });
        // const feature = new Feature(polygon);
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
              text: String(fenceData.num) + this.$t("warning.people"),
              font: "24px Calibri,sans-serif",
              fill: new Fill({ color: "black" }),
              stroke: new Stroke({
                color: "white",
                width: 2,
              }),
            }),
          })
        );

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
      const { fenceFeature } = this.fences[fenceIndex];
      numberFeature.set("number", newNumber);
      fenceFeature.set("number", newNumber);

      // 确保 setText 方法接收到的是字符串
      numberFeature
        .getStyle()
        .getText()
        .setText(String(newNumber) + this.$t("warning.people"));

      this.vectorSource.changed(); // 通知源更新
    },
    //初始化地图
    initMap() {
      var that = this;
      that.vectorSource = new VectorSource();
      that.seeLayer = [
        new TileLayer({
          className: "baseLayerClass",
          source: that.openlayersSource,
        }),

        new VectorLayer({
          source: that.vectorSource,
        }),
      ];

      if (that.mapInfo.length > 0) {
        that.view = new View({
          center: fromLonLat([that.longi, that.lati]),
          zoom: 15,
        });
      } else {
        that.view = new View({
          center: fromLonLat(that.mapCenter),
          zoom: 15,
        });
      }
      setTimeout(() => {
        that.map = new Map({
          target: "map",
          layers: that.seeLayer,
          view: that.view,
        });

        that.map.addControl(new ScaleLine());
        if (that.mapInfo.length > 0) {
          for (let i = 0; i < that.mapInfo.length; i++) {
            that.addIconMarkers(that.map, that.mapInfo[i]);
          }
        }
        that.mapClick();
        that.addLine(that.map);
        that.initializePopup(that.map);
        that.showAllFence().then(() => {
          that.recreateFences();
        });
      }, 0);
    },

    // 测试获取新奥数据
    getDevGpsLists() {
      var that = this;
      getDevGpsList(
        { projectid: this.$store.state.projectid },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.xinaoList = res.data.list;
          for (let i = 0; i < that.xinaoList.length; i++) {
            that.addIconMarkers(that.map, that.xinaoList[i]);
          }
        }
      });
    },

    //加载已存在的
    addIconMarkers(map, mapInfo) {
      if (mapInfo.x != 0 || mapInfo.y != 0) {
        const mercatorCoord = fromLonLat([mapInfo.x, mapInfo.y]);
        var features = new OlFeature({
          longi: mapInfo.x,
          lati: mapInfo.y,
          projectid: mapInfo.projectid,
          deveui: mapInfo.deveui,
          username: mapInfo.username,
          gpstime: mapInfo.gpstime,
          devtype: mapInfo.devtype,
          battery: mapInfo.battery ? mapInfo.battery : "",
          geometry: new OlGeomPoint(mercatorCoord),
        });

        this.source = new OlSourceVector({
          features: [features],
        });
        let src;
        if (mapInfo.devtype == 4) {
          src = "../../../static/tbox.png";
        } else if (mapInfo.devtype == 3) {
          src = "../../../static/beacon1.png";
        } else {
          src = "../../../static/user1.png";
        }
        let style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: src,
            scale: 1,
          }),
          // 设置图片下面显示字体的样式和内容
          text: new Text({
            text: mapInfo.username, // 添加文字描述
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
        map.addLayer(this.vectorLayer);
      }
    },

    //添加图标
    addIconMarker(map, mapInfo, newCenter) {
      var that = this;
      const mercatorCoord = fromLonLat([mapInfo.x, mapInfo.y]);
      var features = new OlFeature({
        longi: mapInfo.x, //图标传入值
        lati: mapInfo.y, //图标传入值
        projectid: mapInfo.projectid,
        deveui: mapInfo.deveui,
        username: mapInfo.username,
        gpstime: mapInfo.gpstime,
        devtype: mapInfo.devtype,
        battery: mapInfo.battery ? mapInfo.battery : "",
        geometry: new OlGeomPoint(mercatorCoord),
      });

      this.source = new OlSourceVector({
        features: [features],
      });

      let style;
      console.log(this.sostype);
      if (this.sostype) {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/usersos.png",
            scale: 1,
          }),
          // 设置图片下面显示字体的样式和内容
          text: new Text({
            text: mapInfo.username, // 添加文字描述
            font: "12px font-size", // 设置字体大小
            fill: new Fill({
              // 设置字体颜色
              color: "white",
            }),
            offsetY: 10, // 设置文字偏移量
          }),
        });
      } else {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/user1.png",
            scale: 1,
          }),
          // 设置图片下面显示字体的样式和内容
          text: new Text({
            text: mapInfo.username, // 添加文字描述
            font: "12px font-size", // 设置字体大小
            fill: new Fill({
              // 设置字体颜色
              color: "white",
            }),
            offsetY: 10, // 设置文字偏移量
          }),
        });
      }

      this.vectorLayer = new OlLayerVector({
        source: this.source,
        style: style,
      });
      map.addLayer(this.vectorLayer);
      console.log(this.sostype);
      this.sostype = false;
      if (newCenter) {
        const center = fromLonLat([mapInfo.x, mapInfo.y]);
        that.map.getView().setCenter(center);
      }
    },
    addAssetMarker(map, mapInfo) {
      var that = this;
      const mercatorCoord = fromLonLat([mapInfo.x, mapInfo.y]);
      var features = new OlFeature({
        longi: mapInfo.x, //图标传入值
        lati: mapInfo.y, //图标传入值
        projectid: mapInfo.projectid,
        deveui: mapInfo.deveui,
        username: mapInfo.username,
        gpstime: mapInfo.gpstime,
        devtype: mapInfo.devtype,
        geometry: new OlGeomPoint(mercatorCoord),
      });

      this.source = new OlSourceVector({
        features: [features],
      });

      let style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/beacon1.png",
          scale: 1,
        }),
        // 设置图片下面显示字体的样式和内容
        text: new Text({
          text: mapInfo.username, // 添加文字描述
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
      map.addLayer(this.vectorLayer);
      console.log(this.sostype);
      this.sostype = false;
    },
    addTBoxIconMarker(map, mapInfo, newCenter) {
      console.log(1111);
      console.log(this.sostype);
      var that = this;
      const mercatorCoord = fromLonLat([mapInfo.x, mapInfo.y]);
      var features = new OlFeature({
        longi: mapInfo.x, //图标传入值
        lati: mapInfo.y, //图标传入值
        projectid: mapInfo.projectid,
        deveui: mapInfo.deveui,
        username: mapInfo.username,
        gpstime: mapInfo.gpstime,
        devtype: mapInfo.devtype,
        battery: mapInfo.battery ? mapInfo.battery : "",
        geometry: new OlGeomPoint(mercatorCoord),
      });

      this.source = new OlSourceVector({
        features: [features],
      });

      let style;
      console.log(this.sostype);
      if (this.sostype) {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/tboxsos.png",
            scale: 1,
          }),
          // 设置图片下面显示字体的样式和内容
          text: new Text({
            text: mapInfo.username, // 添加文字描述
            font: "12px font-size", // 设置字体大小
            fill: new Fill({
              // 设置字体颜色
              color: "white",
            }),
            offsetY: 10, // 设置文字偏移量
          }),
        });
      } else {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/tbox.png",
            scale: 1,
          }),
          // 设置图片下面显示字体的样式和内容
          text: new Text({
            text: mapInfo.username, // 添加文字描述
            font: "12px font-size", // 设置字体大小
            fill: new Fill({
              // 设置字体颜色
              color: "white",
            }),
            offsetY: 10, // 设置文字偏移量
          }),
        });
      }

      this.vectorLayer = new OlLayerVector({
        source: this.source,
        style: style,
      });
      map.addLayer(this.vectorLayer);
      console.log(this.sostype);
      this.sostype = false;
      if (newCenter) {
        const center = fromLonLat([mapInfo.x, mapInfo.y]);
        that.map.getView().setCenter(center);
      }
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
    //时间转换
    formatDate(time) {
      if (time == null || time == 0) {
        return "";
      }
      let date = new Date(parseInt(time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    //单击事件
    mapClick() {
      var that = this;
      var coodinate;
      this.map.on("click", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            coodinate = evt.coordinate;
            return feature;
          }
        );

        that.battery = "";
        if (feature) {
          if (feature.values_.devtype == 1 || feature.values_.devtype == 2) {
            let data = {
              maplabel: feature.values_.deveui,
            };
            //单击获取需要显示的内容
            getMemberInformation(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.battery = feature.values_.battery;
                that.devPer = true;
                that.devTBox = false;
                that.devAsset = false;
                that.age = that.ages(res.data.member.birthday);
                that.depart = res.data.member.depart;
                that.cardno = res.data.member.cardno;
                that.maplabel = res.data.member.maplabel;
                that.sexstr =
                  that.i8n == "zh"
                    ? res.data.member.sexstr
                    : res.data.member.ensex;
                that.tel = res.data.member.tel;
                that.worktype = res.data.member.worktype;
                that.username = res.data.member.username;
                that.gpstime = that.formatDate(feature.values_.gpstime);
                that.imagePath = res.data.member.filename
                  ? host.host + "profile/" + res.data.member.filename
                  : res.data.member.sex == "1"
                  ? "../../../static/male.png"
                  : res.data.member.sex == "2"
                  ? "../../../static/female.png"
                  : "../../../static/nosex.png";

                if (res.data.devHealth == null) {
                  that.bracelet_eui = "";
                  that.bracelet_soc = "";
                  that.bracelet_rate = "";
                  that.bracelet_tem = "";
                  that.bracelet_oxygen = "";
                  that.bracelet_time = "";
                  that.showBracelet = false;
                } else {
                  that.bracelet_eui = res.data.devHealth.wristEui;
                  that.bracelet_soc = res.data.devHealth.soc;
                  that.bracelet_rate = res.data.devHealth.heartrate;
                  that.bracelet_tem = res.data.devHealth.tem;
                  that.bracelet_oxygen = res.data.devHealth.oxygen;
                  that.bracelet_time = that.formatDate(
                    res.data.devHealth.dataTime
                  );

                  that.showBracelet = true;
                }
                that.visible = true;
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
                return;
              }
            });
          } else if (feature.values_.devtype == 4) {
            let data = {
              maplabel: feature.values_.deveui,
            };
            getTboxOne(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.battery = feature.values_.battery;
                that.devPer = false;
                that.showBracelet = false;
                that.devTBox = true;
                that.devAsset = false;
                that.tboxName = res.data.sn;
                that.tboxType = res.data.type;
                that.tboxMaplabel = res.data.maplabel;
                that.tboxTime = that.formatDate(feature.values_.gpstime);
                that.imageTBox = host.host + "profile/" + res.data.filename;

                that.visible = true;
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
                return;
              }
            });
          } else if (feature.values_.devtype == 3) {
            let data = {
              beaconid: feature.values_.deveui,
            };
            getAssetOne(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.devPer = false;
                that.showBracelet = false;
                that.devAsset = true;
                that.devTBox = false;
                that.assetName = res.data.name;
                that.assetType = res.data.type;
                that.assetModel = res.data.model;
                that.assetBeaconid = res.data.beaconid;
                that.assetDepart = res.data.depart;
                that.assetUser = res.data.username;
                that.assetTime = that.formatDate(feature.values_.gpstime);
                that.imageAsset = host.host + "profile/" + res.data.filename;

                that.visible = true;
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
                return;
              }
            });
          }
          if (
            feature.get("type") === "fence" ||
            feature.get("type") === "number"
          ) {
            that.fenceId = feature.get("id"); //获取围栏id
            const totalNum = feature.get("number"); //获取围栏人数
            if (totalNum > 0) {
              that.showPopup(evt.coordinate, that.fenceId, totalNum);
            } else {
              that.$message({
                message: that.$t("terminal.nodata"),
                type: "info",
              });
            }
          }
        }
      });
    },
    // 初始化Popup
    initializePopup(map) {
      const container = document.getElementById("popup-num");
      const closer = document.getElementById("popup-closer-num");
      this.popupCloser = closer;
      this.popupOverlay = new Overlay({
        element: container,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      map.addOverlay(this.popupOverlay);
    },
    // 显示围栏中的人员分类数量
    showPopup(coordinate, fenceId, totalNum) {
      var that = this;
      // 获取时区（秒）
      const offsetMinutes = new Date().getTimezoneOffset();
      const currentTimeZone = -offsetMinutes * 60;
      let data = {
        projectid: this.$store.state.projectid,
        id: fenceId,
        timezone: currentTimeZone,
      };
      getFenceManageWhiteNum(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.whiteNum = res.data.whiteNum;
          that.whiteNotNum = res.data.totalNum - res.data.whiteNum;
          that.blackNum = totalNum - res.data.whiteNum;
          that.whiteType = res.data.whiteType;
          const content = `
          <table class="popup-table">
            <tr>
              <td class="popup-cell" data-category="1"> ${this.$t(
                "locationoutdoor.Whitelist"
              )}</td>
              <td class="popup-cell" data-category="2">${this.$t(
                "locationoutdoor.Nonwhitelist"
              )}</td>
              <td class="popup-cell" data-category="3">${this.$t(
                "locationoutdoor.Whitelistnotin"
              )}</td>
            </tr>
            <tr>
              <td class="popup-cell" data-category="1">${that.whiteNum}</td>
              <td class="popup-cell" data-category="2">${that.blackNum}</td>
              <td class="popup-cell" data-category="3">${that.whiteNotNum}</td>
            </tr>
          </table>
        `;
          that.$nextTick(() => {
            const cells = document.querySelectorAll(".popup-cell");
            cells.forEach((cell) => {
              cell.addEventListener("click", that.handleClick);
            });
          });
          // 显示Popup
          this.popupOverlay.setPosition(coordinate);
          document.getElementById("popup-content-num").innerHTML = content;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 表格点击事件
    handleClick(event) {
      var that = this;
      const index = event.target.dataset.category;
      let data = {
        id: that.fenceId,
        projectid: that.$store.state.projectid,
        whiteType: that.whiteType,
        dataType: "",
      };
      switch (index) {
        case "1":
          if (that.whiteNum == 0) {
            that.$message({
              message: that.$t("terminal.nodata"),
              type: "info",
            });
            return;
          } else {
            data.dataType = 1;
            that.nameNum = that.$t("locationoutdoor.Whitelist");
          }
          break;
        case "2":
          if (that.blackNum == 0) {
            that.$message({
              message: that.$t("terminal.nodata"),
              type: "info",
            });
            return;
          } else {
            data.dataType = 2;
            that.nameNum = that.$t("locationoutdoor.Nonwhitelist");
          }
          break;
        case "3":
          if (that.whiteNotNum == 0) {
            that.$message({
              message: that.$t("terminal.nodata"),
              type: "info",
            });
            return;
          } else {
            data.dataType = 3;
            that.nameNum = that.$t("locationoutdoor.Whitelistnotin");
          }
          break;
      }
      getFenceManageWhiteList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.showNameNum = true;
          that.numData = res.data;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 关闭Popup
    closePopup(event) {
      event.preventDefault();
      this.popupOverlay.setPosition(undefined);
      this.popupCloser.blur();
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
    //编辑

    editFeature(feature, menu_overlay) {
      this.menu_overlay = menu_overlay;
      this.editData.building = feature.values_.building;
      this.editData.src = feature.values_.src;
      this.editData.id = feature.values_.id;
      this.editData.lati = feature.values_.lati;
      this.editData.longi = feature.values_.longi;
      this.editData.projectid = feature.values_.projectid;
      this.oldEditBUilding = feature.values_.building;
      this.editFeatureInfo = feature;
      this.edit = true;
    },
    editCancel() {
      this.edit = false;
      this.oldEditBUilding = "";
    },
    editTrue() {
      var that = this;
      if (this.buildingNameList.indexOf(this.editData.building) > -1) {
        this.$message({
          message: this.editData.building + "已存在",
          type: "warning",
        });
        return;
      }
      this.editFeatureInfo.values_.building = this.editData.building;
      this.editFeatureInfo.values_.src = this.editData.src;
      this.editFeatureInfo.values_.id = this.editData.id;
      this.editFeatureInfo.values_.lati = this.editData.lati;
      this.editFeatureInfo.values_.longi = this.editData.longi;
      this.editFeatureInfo.values_.projectid = this.editData.projectid;
      that.edit = false;
      this.buildingNameList = this.buildingNameList.filter(function (item) {
        return item != that.oldEditBUilding;
      });
      this.buildingNameList.push(this.editData.building);
      that.editFeatureInfo.setStyle(
        new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: that.editData.src,
            scale: 1,
          }),
          // 设置图片下面显示字体的样式和内容
          text: new Text({
            text: that.editData.building, // 添加文字描述
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
    },
    //删除
    delFeature(e) {
      var that = this;
      let LayerArrays;
      if (this.map) {
        LayerArrays = that.map.getLayers().getArray();
      }
      LayerArrays.forEach((layer) => {
        if (layer instanceof VectorLayer) {
          if (layer.getSource().getFeatures().length > 0) {
            if (e.deveui == layer.getSource().getFeatures()[0].values_.deveui) {
              layer
                .getSource()
                .getFeatures()
                .forEach(function (feature) {
                  layer.getSource().removeFeature(feature);
                });
              this.map.removeLayer(layer);
            }
          }
        } else if (layer instanceof ImageLayer) {
          console.log("This layer is an ImageLayer.");
        } else if (layer instanceof TileLayer) {
          console.log("This layer is a TileLayer.");
        } else {
          console.log("This layer type is unknown.");
        }
      });
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
    //获取最后一次位置信息
    getDevGpsLocation() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
        gpstype: 2,
      };
      getLastDevGps(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.mapInfo = res.data;
          that.initMap();
        }
      });
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
                  sn: `${item.sn}`,
                };
              });
            // for (let i = that.tboxList.length - 1; i > -1; i--) {
            //   if (
            //     that.tboxList[i].maplabel == "" ||
            //     that.tboxList[i].maplabel == null ||
            //     that.tboxList[i].maplabel == undefined
            //   ) {
            //     that.tboxList.splice(i, 1);
            //   }
            // }
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

    remoteTBoxMethod(query) {
      if (query !== "") {
        this.tboxLoading = true;
        setTimeout(() => {
          this.tboxLoading = false;
          this.tboxOptions = this.tboxList.filter((item) => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.sn.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return item.sn.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
          });
        }, 200);
      } else {
        this.tboxOptions = [];
      }
    },

    //websock
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
    initWebsocketOne() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持WebSocket");
        return false;
      }
      this.websock = new WebSocket(this.wsuri);
      this.websock.onopen = this.websocketopenOne;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketerrorOne;
      this.websock.onclose = this.close;
    },
    websocketopen(e) {
      //打开
      console.log("室外定位WebSocket连接成功");
    },
    websocketopenOne(e) {
      //打开
      console.log("室外单人定位WebSocket连接成功");
    },
    //数据接收
    websocketonmessage(res) {
      var that = this;
      if (res.data != "连接成功") {
        var data = JSON.parse(res.data);
        if (data.deveui) {
          that.delFeature(data);
          if (data.fenceObj.length > 0) {
            data.fenceObj.forEach((item) => {
              if (item.num > 0) {
                const index = that.AllFences.findIndex(
                  (items) => items.id === item.id
                );
                that.updateNumber(index, item.num);
              }
            });
          }
          if (data.status != 2) {
            if (data.devtype == 4) {
              that.addTBoxIconMarker(that.map, data);
            } else if (data.devtype == 3) {
              that.addAssetMarker(that.map, data);
            } else {
              that.addIconMarker(that.map, data);
            }
          }
        }
      }
    },
    close(e) {
      console.log("室外WebSocket关闭");
      this.websock.close();
    },
    websocketerror() {
      console.log("室外WebSocket连接失败");
    },
    websocketerrorOne() {
      console.log("室外单人WebSocket连接失败");
    },

    websocketSend(data) {
      this.websock.send(data);
    },
    updateSize() {
      this.map.updateSize();
    },
  },
  beforeMount() {
    let that = this;
    // this.getDevGpsLists();
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
    if (this.$route.query.deveui) {
      if (this.$route.query.sostype == "true") {
        this.sostype = true;
      } else {
        this.sostype = false;
      }
      console.log(this.sostype);
      this.initMap();
      setTimeout(() => {
        this.searchInfo(this.$route.query.deveui);
      }, 0);
    } else if (this.$route.query.tboxDeveui) {
      if (this.$route.query.sostype == "true") {
        this.sostype = true;
      } else {
        this.sostype = false;
      }
      //车辆管理页面跳转
      this.initMap();
      setTimeout(() => {
        this.searchInfo("", this.$route.query.tboxDeveui);
      }, 0);
    } else {
      console.log(this.sostype);
      this.sostype = false;
      this.getDevGpsLocation();
      this.initWebsocket();
    }
    this.getMemberNames();
    this.getTboxSnIds();
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
      this.i8n = this.$store.state.i18n;
    },
    $route: {
      handler(to, from) {
        if (to.query != from.query) {
          this.getMemberNames();
          this.getTboxSnIds();
          if (this.$route.query.deveui) {
            if (this.$route.query.sostype == "true") {
              this.sostype = true;
            } else {
              this.sostype = false;
            }
            console.log(this.sostype);
            setTimeout(() => {
              this.searchInfo(this.$route.query.deveui);
            }, 10);
          } else if (this.$route.query.tboxDeveui) {
            //车辆管理页面跳转
            setTimeout(() => {
              this.searchInfo("", this.$route.query.tboxDeveui);
            }, 10);
          } else {
            console.log(this.sostype);
            this.sostype = false;
            this.getDevGpsLocation();
            this.initWebsocket();
          }
        }
      },
    },
  },
  destroyed() {
    this.websock.close();
  },
};
</script>

<style scoped>
.Info_dialog >>> .el-dialog {
  border-radius: 20px !important;
  background: rgba(0, 0, 0, 0.2);
}
.Info_dialog >>> .el-dialog__body {
  color: white !important;
}
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.left-top {
  flex: 1 1 40%; /* 左上部分图片宽度为40% */
}

.right-top {
  flex: 1 1 60%; /* 右上部分宽度为60% */
  display: flex;
  flex-direction: column;
}

.bottom {
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
}

.container li {
  text-align: left; /* 确保每个 li 左对齐 */
  list-style: none; /* 去掉 li 前面的默认样式 */
  padding: 0 !important;
  margin: 0 !important;
}

.goDev a {
  text-decoration: null;
  color: #409eff; /* 链接颜色 */
}
.bracelet_title {
  text-align: left;
}
.bracelet_dev {
  display: flex;
  justify-content: space-between;
}
.bracelet_dev span {
  margin: 0;
  padding: 0;
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
.query,
.reset {
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
#popup {
  display: block;
}

.divider {
  margin: 5px 0 !important;
}

#popup-content li {
  list-style: none;
  text-align: left;
  cursor: default;
}
#popup-contents .goDev {
  cursor: pointer;
}

#popup-content li:first-of-type {
  margin-top: 10px;
}
#popup-content li:last-of-type {
  margin-bottom: 5px;
}
.ol-popup-closer {
  position: absolute;
  top: 0px;
  right: 8px;
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
.el-form-item .el-button {
  margin-left: 4px !important;
}

.ol-popup-num {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px 5px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup-num:after,
.ol-popup-num:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup-num:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup-num:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer-num {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer-num:after {
  content: "✖";
}
</style>
<style>
/* Table styling */
.popup-table {
  width: 100%;
  border-collapse: collapse; /* Ensure no space between cells */
  table-layout: fixed; /* Ensure equal column width */
}

.popup-table td {
  padding: 8px;
  text-align: center;
  cursor: pointer;
}

/* Adding borders only between specific columns and rows */
.popup-table tr:first-child td {
  border-bottom: 1px solid #ddd; /* First row has bottom border */
}

.popup-table td:nth-child(1),
.popup-table td:nth-child(2) {
  border-right: 1px solid #ddd; /* Border between first and second column */
}

.popup-table td:nth-child(2),
.popup-table td:nth-child(3) {
  border-left: 1px solid #ddd; /* Border between second and third column */
}
</style>
