<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
      {{ $t("list.Alarmconfiguration") }}
    </div>
    <div class="content">
      <el-container>
        <el-main>
          <div class="warning_input">
            <el-form
              class="demo-form-inline"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item
                :label="$t('ns.Name')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
              >
                <el-select
                  v-model="searchList.name"
                  style="width: 95%; float: left"
                  :placeholder="$t('warning.text3')"
                >
                  <el-option
                    v-for="item in nameList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: 2%">
                <el-button type="primary" class="reset" @click="searchInfo()">{{
                  $t("beacon.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("beacon.reset")
                }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="showAllFence()"
                  >{{ $t("warning.Preview") }}</el-button
                >
                <el-button type="primary" class="reset" @click="addFence()">{{
                  $t("warning.add")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="
                width: 98%;
                text-align: center;
                margin-left: 2%;
                z-index: 1;
              "
              border
              highlight-current-row
            >
              <el-table-column
                property="id"
                :label="$t('warning.id')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="name"
                :label="$t('ns.name')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('warning.operate')"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('territorymanagement.edit')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="editss"
                      @click="EditFenceCommand(scope.$index)"
                      ><img src="../../../static/edit2.png"
                    /></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('warning.delete')"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      size="mini"
                      class="edits"
                      @click="DelFenceCommand(scope.$index)"
                      ><img src="../../../static/delete.png"
                    /></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div
              class="block"
              style="text-align: center; width: 100%; margin-top: 1%"
            >
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-size="20"
              >
              </el-pagination>
            </div>

            <!-- 地图弹框 -->
            <el-dialog
              :title="add ? $t('warning.add') : edit ? $t('warning.edit') : ''"
              :visible.sync="showMap"
              width="70%"
              style="text-align: center"
              @opened="initMap"
              @close="closeMap"
              class="fence"
            >
              <el-form
                :model="mapData"
                style="white-space: nowrap; display: flex"
                ref="mapData"
              >
                <el-form-item
                  :label="$t('ns.Name')"
                  v-if="add || edit"
                  style="
                    display: flex;
                    width: 20%;
                    margin-left: 1%;
                    margin-right: 0;
                  "
                >
                  <el-input
                    v-model="mapData.name"
                    style="width: 95%; float: left"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('warningVoice.selectColor')"
                  v-if="add"
                  style="
                    display: flex;
                    width: 20%;
                    margin-left: 1%;
                    margin-right: 0;
                  "
                >
                  <input type="color" v-model="fillColor" />
                </el-form-item>
                <el-form-item v-if="add" style="display: flex; margin-left: 0">
                  <el-button @click="clearFence" type="primary">
                    {{ $t("warning.Redraw") }}</el-button
                  >
                </el-form-item>
              </el-form>
              <div class="mapConent">
                <div id="map" ref="map"></div>
              </div>
              <div slot="footer" class="dialog-footer" v-if="add || edit">
                <el-button @click="mapCancel(mapData)">
                  {{ $t("warning.Cancel") }}
                </el-button>
                <el-button
                  type="primary"
                  :loading="loading"
                  @click="mapTrue(mapData)"
                >
                  {{ $t("warning.Sure") }}</el-button
                >
              </div>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import { Modify } from "ol/interaction";
import { Polygon } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Fill, Stroke } from "ol/style";

import Menu from "../../components/menu/Menu";
import Data from "../../components/data/data";
import {
  getFenceManageAndPointList,
  delFenceManage,
  fenceManage,
  getFenceManageList,
} from "../../axios/api";
import { fromLonLat, toLonLat } from "ol/proj";
export default {
  components: {
    Menu,
    Data,
  },
  name: "ElectronicFence",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      projectid: this.$store.state.projectid,
      nameList: [],
      tableData: [],
      currentPage1: 1,
      total: 0,
      searchList: {
        projectid: this.$store.state.intoProjectid,
        name: "",
        page: 1,
        count: 20,
      },
      pageCount: 20,
      showMap: false,
      add: false,
      edit: false,
      mapData: {
        projectid: "",
        name: "",
      },
      loading: false,

      map: null,
      vectorSource: null,
      drawInteraction: null,
      mapWidth: "100 %",
      mapHeight: "100vh",
      savedFences: [], //坐标
      editFences: [],
      fenceID: "",
      centerX: 0,
      centerY: 0,
      fillColor: "#000000",
    };
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getFenceManageAndPointLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getFenceManageAndPointLists();
    },
    searchInfo() {
      var that = this;
      getFenceManageAndPointList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data;
          that.total = res.data.size;
          if (res.data.size > 0) {
            that.$message({
              message: that.$t("beacon.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("beacon.nodata"),
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
    },
    //刷新
    clearBtn() {
      this.currentPage1 = 1;
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        page: 1,
        count: 20,
      };
      this.getFenceManageAndPointLists();
    },
    initMap() {
      var that = this;
    
      setTimeout(() => {
        let openlayersSource;
      if (that.$store.state.i18n == "zh") {
        // 说明：瓦片地址改为读取环境变量，默认保持当前地址
        openlayersSource = new OSM({
          url: process.env.VUE_APP_TILE_URL_TEMPLATE,
          crossOrigin: "",
        });
      } else {
        openlayersSource = new OSM();
      }
        that.vectorSource = new VectorSource();
        that.map = new Map({
          target: that.$refs.map,
          layers: [
            new TileLayer({
              source: openlayersSource,
            }),
            new VectorLayer({
              source: that.vectorSource,
            }),
          ],
          view: new View({
            center: fromLonLat([that.centerX, that.centerY]),
            zoom: 15,
          }),
        });
        if (that.add) {
          that.addDrawInteraction();
          that.addModifyInteraction();
        } else if (that.edit) {
          that.recreateFences();
          that.addModifyInteraction();
        } else {
          that.recreateFences();
        }
      }, 10);
    },
    closeMap() {
      this.map.getInteractions().clear();
      this.map.getLayers().clear();
      if (this.vectorSource) {
        this.vectorSource.clear();
      }
      this.map.setTarget(null);
      this.map = null;
    },

    // 将16进制颜色和透明度转换为rgba格式
    hexToRgba(hex, opacity) {
      const rgb = parseInt(hex.slice(1), 16); // 转换为 RGB 整数
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    addDrawInteraction() {
      this.drawInteraction = new Draw({
        source: this.vectorSource,
        type: "Polygon",
      });
      this.map.addInteraction(this.drawInteraction);
      this.drawInteraction.on("drawend", (event) => {
        const feature = event.feature;
        // // 设置样式
        feature.setStyle(
          new Style({
            fill: new Fill({
              color: this.hexToRgba(this.fillColor, 0.5), // 使用当前选择的颜色
            }),
            stroke: new Stroke({
              color: this.fillColor,
              width: 2,
            }),
          })
        );
        const geometry = feature.getGeometry();
        const coordinates = geometry.getCoordinates();
        // 记录围栏坐标
        const gpsCoordinates = coordinates[0].map((coord) => toLonLat(coord));
        // this.savedFences.push(coordinates[0]);
        this.savedFences = gpsCoordinates;

        //   移除绘制交互，只能绘制一个
        this.map.removeInteraction(this.drawInteraction);
        // 如果现存的围栏，清除之前的围栏
        if (this.vectorSource.getFeatures().length > 1) {
          this.vectorSource.clear();
          this.vectorSource.addFeature(feature);
        }
      });
    },
    // 清除所有围栏
    clearFence() {
      this.vectorSource.clear();
      //   重新启用绘制
      this.addDrawInteraction();
    },
    //   转换坐标
    logCoordinates() {
      this.savedFences.forEach((coords) => {
        const gpsCoordinates = coords.map((coord) => toLonLat(coord));
      });
    },
    addModifyInteraction() {
      var that = this;
      const modify = new Modify({
        source: this.vectorSource,
      });
      this.map.addInteraction(modify);
      modify.on("modifyend", (event) => {
        event.features.forEach((feature) => {
          const geometry = feature.getGeometry();
          const coordinates = geometry.getCoordinates();

          // 记录围栏坐标
          const gpsCoordinates = coordinates[0].map((coord) => toLonLat(coord));
          that.savedFences = gpsCoordinates;
        });
      });
    },
    recreateFences() {
      this.vectorSource.clear();
      this.savedFences.forEach((fenceData) => {
        const gpsCoords = fenceData.coordinates;
        const color = fenceData.color;
        const mercatorCoords = gpsCoords.map((coord) => fromLonLat(coord));
        const polygon = new Polygon([mercatorCoords]);
        const feature = new Feature(polygon);
        // // 设置样式
        feature.setStyle(
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
        this.vectorSource.addFeature(feature);
      });
    },
    // 添加
    addFence() {
      this.mapData = {
        projectid: this.$store.state.intoProjectid,
        name: "",
        colour: "",
      };
      this.centerX = this.$store.state.longis;
      this.centerY = this.$store.state.latis;
      this.fillColor = "#000000";
      this.fenceID = "";
      this.showMap = true;
      this.add = true;
      this.edit = false;
    },
    mapCancel(mapData) {
      this.showMap = false;
      this.add = false;
      this.edit = false;
      this.loading = false;
      this.$refs.mapData.resetFields();
    },
    mapTrue(mapData) {
      this.$refs.mapData.validate((valid) => {
        var that = this;
        if (valid) {
          let list = [];
          var savedFences = [];
          if (that.savedFences.length == 0) {
            that.$message({
              message: that.$t("floormanagement.Pleaseselectpoint"),
              type: "warning",
            });
          } else {
            if (Array.isArray(that.savedFences[0][0])) {
              savedFences = that.savedFences.flat(1);
              // 是 [[[经度值，纬度值],[经度值，纬度值]]]
              // return 'Three-level array';
            } else {
              if (that.savedFences[0].coordinates) {
                savedFences = that.savedFences[0].coordinates;
              } else {
                savedFences = that.savedFences;
              }
            }
            savedFences.forEach((item) => {
              list.push({
                pointX: item[0],
                pointY: item[1],
              });
            });
            let data = {
              name: that.mapData.name,
              projectid: this.projectid,
              list: list,
              id: that.fenceID ? that.fenceID : "",
              colour: that.fillColor,
            };
            that.loading = true;
            fenceManage(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.showMap = false;
                that.add = false;
                that.searchList.page = 1;
                that.currentPage1 = 1;
                that.getFenceManageLists();
                that.getFenceManageAndPointLists();
                that.$message({
                  message: that.$t("beacon.addsuccess"),
                  type: "success",
                });
                that.loading = false;
                that.$refs.mapData.resetFields();
              } else {
                // that.add = false;
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
                that.loading = false;
              }
            });
          }
        }
      });
    },
    showAllFence() {
      var that = this;
      let data = {
        projectid: this.projectid,
      };
      getFenceManageAndPointList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.code == 1001) {
            that.centerX =
              res.data.length > 0
                ? res.data[0].list.length > 0
                  ? res.data[0].list[0].pointX
                  : 0
                : 0;
            that.centerY =
              res.data.length > 0
                ? res.data[0].list.length > 0
                  ? res.data[0].list[0].pointY
                  : 0
                : 0;
            that.editFences = [];
            res.data.forEach((item) => {
              let editFences = [];
              item.list.forEach((items) => {
                editFences.push([items.pointX, items.pointY]);
              });

              that.editFences.push({
                coordinates: editFences,
                color: item.colour,
              });
            });

            that.savedFences = that.editFences;

            that.showMap = true;
            that.add = false;
            that.edit = false;
          }
          // that.tableData = res.data;
          // that.total = res.data.size;
        }
      });
    },
    EditFenceCommand(index) {
      this.mapData = {
        projectid: this.$store.state.intoProjectid,
        name: "",
      };
      this.fillColor = this.tableData[index].colour;
      this.centerX =
        this.tableData[index].list.length > 0
          ? this.tableData[index].list[0].pointX
          : 0;
      this.centerY =
        this.tableData[index].list.length > 0
          ? this.tableData[index].list[0].pointY
          : 0;
      this.mapData = {
        projectid: this.$store.state.intoProjectid,
        name: "",
      };
      this.mapData.name = this.tableData[index].name;
      this.fenceID = this.tableData[index].id;
      let list = this.tableData[index].list;
      let editFences = [];
      this.editFences = [];
      list.forEach((item) => {
        editFences.push([item.pointX, item.pointY]);
      });
      this.editFences.push({
        coordinates: editFences,
        color: this.tableData[index].colour,
      });
      this.savedFences = this.editFences;
      this.showMap = true;
      this.add = false;
      this.edit = true;
    },
    DelFenceCommand(index) {
      var that = this;
      this.$confirm("确认删除吗？", this.$t("beacon.prompt"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      })
        .then(() => {
          let data = {
            id: that.tableData[index].id,
          };
          delFenceManage(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.getFenceManageLists();
              that.getFenceManageAndPointLists();
              that.$message({
                message: that.$t("beacon.deletesuccess"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    // 下拉框
    getFenceManageLists() {
      var that = this;
      let data = {
        projectid: this.projectid,
      };
      getFenceManageList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.nameList = res.data;
        }
      });
    },
    //刚进页面获取数据
    getFenceManageAndPointLists() {
      var that = this;
      getFenceManageAndPointList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data;
          that.total = res.data.size;
        }
      });
    },
  },
  beforeMount() {
    this.searchList = {
      projectid: this.$store.state.intoProjectid,
      name: "",
      page: 1,
      count: 20,
    };
    this.getFenceManageLists();
    this.getFenceManageAndPointLists();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
    },
  },
};
</script>

<style scoped>
.home {
  height: 100%;
  margin-right: calc(102% - 100vw);
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

.el-message {
  display: -webkit-box !important;
}
.edits,
.editss {
  padding: 2px 16px !important;
}
/* 改变按钮颜色 */
.edits:hover {
  background-color: rgb(196, 27, 27);
}

.editss:hover {
  background-color: rgb(25, 86, 201);
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
  padding: 0 !important;
}

.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}

.querry,
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

.el-form-item .el-button {
  margin-left: 4px !important;
}

.mapConent {
  width: 100%;
  height: 700px;
}
#map {
  height: 100%;
  /* height: 700px; */
  width: 100%;
  /* z-index: 1; */
}
.fence >>> .el-dialog {
  margin-top: 5vh !important;
}
</style>
