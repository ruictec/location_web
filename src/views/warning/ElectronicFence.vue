<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
      {{ $t("list.Alarmconfiguration") }}
    </div>
    <div class="content">
      <el-container>
        <el-main>
          <div
            class="warning_input terminal-filter-flow"
            :class="filterLangClass"
          >
            <el-form class="demo-form-inline terminal-filter-form">
              <el-form-item
                :label="$t('ns.Name')"
                class="terminal-filter-item"
              >
                <el-select
                  v-model="searchList.name"
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
            </el-form>
            <div class="search-actions terminal-toolbar-item">
              <div class="terminal-toolbar-row">
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
                  >{{ $t("warning.Preview") }}</el-button>
                <el-popover
                  placement="bottom"
                  width="auto"
                  trigger="click"
                  v-model="showFenceTypePopover"
                >
                  <div style="display: flex; gap: 10px; padding: 5px 0;">
                    <el-button
                      type="primary"
                      @click="handleOutdoorFence()"
                    >{{ $t("warning.outdoorFence") }}</el-button>
                    <el-button
                      type="primary"
                      @click="handleIndoorFence()"
                    >{{ $t("warning.indoorFence") }}</el-button>
                  </div>
                  <template #reference><el-button
                    type="primary"
                    class="reset"
                  >{{ $t("warning.add") }}</el-button></template>
                </el-popover>
              </div>
            </div>
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
                :label="$t('floormanagement.floor1').replace('：', '').replace(':', '')"
                show-overflow-tooltip
                align="center"
                min-width="150"
              >
                <template #default="scope">
                  <span>{{ getFloorDisplay(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$store.state.i18n == 'zh' ? '颜色' : 'Color'"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <div
                    :style="{
                      width: '30px',
                      height: '30px',
                      backgroundColor: scope.row.colour || '#FF0000',
                      border: '1px solid #ccc',
                      margin: '0 auto',
                      borderRadius: '4px'
                    }"
                  ></div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$store.state.i18n == 'zh' ? '开启/关闭' : 'Enable/Disable'"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <el-switch
                    :model-value="isFenceFlagOn(scope.row.flag)"
                    @change="handleFenceFlagChange(scope.row, $event)"
                    :disabled="scope.row.updating"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('warning.operate')"
                align="center"
                min-width="100"
              >
                <template #default="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('territorymanagement.edit')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="small"
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
                      size="small"
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
                v-model:current-page="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                v-model:page-size="pageCount"
              >
              </el-pagination>
            </div>

            <!-- 地图弹框 -->
            <el-dialog
              :title="add ? $t('warning.add') : edit ? $t('warning.edit') : ''"
              v-model="showMap"
              width="70%"
              style="text-align: center"
              @opened="initMap"
              @close="closeMap"
              class="fence"
            >
              <el-form
                :model="mapData"
                class="fence-map-form"
                label-width="auto"
                ref="mapData"
              >
                <el-form-item
                  :label="$t('ns.Name')"
                  v-if="add || edit"
                  class="fence-name-color-item"
                >
                  <div class="fence-name-color">
                    <el-input
                      v-model="mapData.name"
                      class="fence-name-input"
                    ></el-input>
                    <!-- 添加和编辑时都显示颜色选择器 -->
                    <input
                      v-if="add || edit"
                      type="color"
                      v-model="fillColor"
                      class="fence-color-input"
                      :title="fillColor || '#FF0000'"
                    />
                    <el-button
                      v-if="add"
                      @click="clearFence"
                      type="primary"
                    >
                      {{ $t("warning.Redraw") }}
                    </el-button>
                    <el-button
                      v-if="edit"
                      type="primary"
                      :loading="loading"
                      @click="mapTrue(mapData)"
                    >
                      {{ $store.state.i18n == "zh" ? "保存" : "Save" }}
                    </el-button>
                  </div>
                </el-form-item>
              </el-form>
              <div class="mapConent" style="position: relative">
                <MapLayerSwitcher :map="map" />
                <div id="map" ref="map"></div>
              </div>
              <template #footer><div class="dialog-footer" v-if="add">
                <el-button @click="mapCancel(mapData)">
                  {{ $t("warning.Cancel") }}
                </el-button>
                <el-button
                  type="primary"
                  :loading="loading"
                  @click="mapTrue(mapData)"
                >
                  {{ $t("warning.Sure") }}</el-button>
              </div></template>
            </el-dialog>

            <!-- 楼栋楼层选择对话框 -->
            <el-dialog
              :title="$t('warning.selectFenceType')"
              v-model="showBuildingFloorDialog"
              width="30%"
              style="text-align: center"
            >
              <el-form :model="buildingFloorForm" label-width="100px">
                <el-form-item :label="$t('floormanagement.building')">
                  <el-select
                    v-model="selectedBuildingId"
                    :placeholder="$t('floormanagement.text')"
                    style="width: 100%"
                    @change="handleBuildingChange"
                  >
                    <el-option
                      v-for="item in buildingList"
                      :key="item.id"
                      :label="item.building"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('floormanagement.floor1')">
                  <el-select
                    v-model="selectedGroundId"
                    :placeholder="$t('floormanagement.text')"
                    style="width: 100%"
                    :disabled="!selectedBuildingId"
                  >
                    <el-option
                      v-for="item in groundList"
                      :key="item.id"
                      :label="item.ground"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <template #footer><div class="dialog-footer">
                <el-button @click="cancelBuildingFloorDialog()">
                  {{ $t("warning.Cancel") }}
                </el-button>
                <el-button
                  type="primary"
                  @click="confirmBuildingFloor()"
                  :disabled="!selectedBuildingId || !selectedGroundId"
                >
                  {{ $t("warning.Sure") }}
                </el-button>
              </div></template>
            </el-dialog>

            <!-- 室内地图弹框 -->
            <el-dialog
              v-model="showIndoorMapDialog"
              width="90%"
              :close-on-click-modal="false"
              @close="handleCancelIndoorMap"
              @opened="onIndoorMapDialogOpened"
              class="indoorMapDialog"
            >
              <div style="width: 100%; height: 100%">
                <!-- 按钮栏 -->
                <div class="searchArrange">
                  <el-form
                    class="demo-form-inline"
                    style="display: flex; white-space: nowrap"
                  >
                    <el-button
                      v-if="currentGroundInfo && currentGroundInfo.maptype == 2 && !isEditingFence3d && !isEditFromList"
                      type="primary"
                      @click="toggleCreateFence3d"
                      style="width: 120px; height: 30px"
                      size="small"
                      >{{ isCreatingFence3d ? $t("warning.End") : $t("warning.CreateFence") }}</el-button>
                    <el-button
                      v-if="currentGroundInfo && currentGroundInfo.maptype == 2 && isEditingFence3d"
                      type="primary"
                      @click="toggleEditFence3d"
                      style="width: 120px; height: 30px; margin-left: 10px"
                      size="small"
                      >{{ $t("warning.EndEdit") }}</el-button>
                    <!-- 2D地图按钮 -->
                    <el-button
                      v-if="currentGroundInfo && currentGroundInfo.maptype == 1 && !isEditingFence2d && !isEditFromList"
                      type="primary"
                      @click="toggleCreateFence2d"
                      style="width: 120px; height: 30px"
                      size="small"
                      >{{ isCreatingFence2d ? $t("warning.End") : $t("warning.CreateFence") }}</el-button>
                    <el-button
                      v-if="currentGroundInfo && currentGroundInfo.maptype == 1 && isEditingFence2d"
                      type="primary"
                      @click="toggleEditFence2d"
                      style="width: 120px; height: 30px; margin-left: 10px"
                      size="small"
                      >{{ $t("warning.EndEdit") }}</el-button>
                  </el-form>
                </div>
                <div style="width: 100%; margin-top: 2%">
                  <div class="indoor-map-container">
                    <!-- 2D地图容器 -->
                    <div
                      v-if="currentGroundInfo && currentGroundInfo.maptype == 1"
                      id="indoorMap2d"
                      ref="indoorMap2d"
                      class="map-container-2d"
                    ></div>
                    <!-- 3D地图容器（完全参考ElectronicFenceMap.vue的结构） -->
                    <div
                      v-if="currentGroundInfo && currentGroundInfo.maptype == 2"
                      class="mapContent mapContent3D"
                      style="width: 100%; height: calc(100vh - 120px); position: relative"
                    >
                      <div style="width: 100%; height: 100%">
                        <div id="fengMap" ref="fengMap"></div>
                      </div>
                      <!-- 加载提示 -->
                      <div
                        v-if="!map3d"
                        class="map-loading-tip"
                      >
                        正在加载3D地图...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-dialog>
            
            <!-- 创建/编辑电子围栏对话框 -->
            <el-dialog
              :title="isEditingFence3d ? $t('warning.EditFenceInfo') : $t('warning.SetFenceInfo')"
              v-model="showFenceDialog"
              width="500px"
              :close-on-click-modal="false"
            >
              <el-form :model="fenceForm" label-width="120px">
                <el-form-item :label="$t('warning.FenceName')">
                  <el-input v-model="fenceForm.name" :placeholder="$t('warning.EnterFenceName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('warning.FenceColor')">
                  <el-color-picker v-model="fenceForm.colour"></el-color-picker>
                </el-form-item>
                <el-form-item :label="$t('warning.EnableFence')">
                  <el-switch v-model="fenceForm.flag"></el-switch>
                </el-form-item>
              </el-form>
              <template #footer><div class="dialog-footer">
                <el-button @click="cancelCreateFence3d">{{ $t("login.cancel") }}</el-button>
                <el-button type="primary" @click="confirmCreateFence3d">{{ $t("login.confirm") }}</el-button>
              </div></template>
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
import { createOutdoorBaseLayers } from "../../utils/mapSource";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw, Modify, Select } from "ol/interaction";
import Overlay from "ol/Overlay";
import Collection from "ol/Collection";
import { Polygon, Point } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Fill, Stroke, Text, Icon } from "ol/style";
// 2D地图相关
import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";
// 3D地图相关
import fengmap from "fengmap/build/fengmap.map.min";
import "fengmap/build/fengmap.plugin.ui.min";
import "fengmap/build/fengmap.plugin.markers.min";
import "fengmap/build/toolBarStyle.css";
import { applyFengmapLocalLoad } from "../../utils/fengmapAssets";
import host from "../../host";

import Menu from "../../components/menu/Menu";
import Data from "../../components/data/data";
import {
  getFenceManageAndPointList,
  getFenceManageAndPointListByPage,
  delFenceManage,
  fenceManage,
  getFenceManageList,
  getBuildingByProjectid,
  getGround,
  getBuildGroundOne,
  updateFenceManage,
  getDevAndOtherList,
} from "../../axios/api";
import { fromLonLat, toLonLat } from "ol/proj";
import MapLayerSwitcher from "../../components/map/MapLayerSwitcher";
export default {
  components: {
    Menu,
    Data,
    MapLayerSwitcher,
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
      showFenceTypePopover: false, // 控制围栏类型选择弹窗显示
      showBuildingFloorDialog: false, // 控制楼栋楼层选择对话框显示
      buildingList: [], // 楼栋列表
      groundList: [], // 楼层列表
      selectedBuildingId: "", // 选中的楼栋ID
      selectedGroundId: "", // 选中的楼层ID
      buildingFloorForm: {}, // 楼栋楼层表单
      showIndoorMapDialog: false, // 控制室内地图弹框显示
      currentGroundInfo: null, // 当前选中的楼层完整信息
      map2d: null, // 2D地图实例
      vectorSource2d: null, // 2D地图的矢量数据源
      vectorLayer2d: null, // 2D地图的矢量图层
      drawInteraction2d: null, // 2D地图的绘制交互
      modifyInteraction2d: null, // 2D地图的修改交互
      selectInteraction2d: null, // 2D地图的选择交互
      fenceFeatures2d: [], // 2D地图的电子围栏要素数组
      isCreatingFence2d: false, // 是否正在创建2D电子围栏
      isEditingFence2d: false, // 是否正在编辑2D电子围栏
      editingFenceFeature2d: null, // 正在编辑的2D电子围栏要素
      editingFenceId2d: null, // 正在编辑的2D电子围栏ID
      contextMenuOverlay2d: null, // 2D地图右键菜单覆盖层
      map3d: null, // 3D地图实例
      imgUrl: "", // 2D地图图片URL
      imageWidth: 0, // 2D地图宽度
      imageHeight: 0, // 2D地图高度
      fmapId: "", // 3D地图ID
      themeId: "", // 3D地图主题ID
      lastGroupid: 0, // 3D地图楼层组ID
      // 3D地图电子围栏相关（参考ElectronicFenceMap.vue）
      fenceManageList: [], // 电子围栏列表
      fencePolygonMarkers: [], // 已渲染的电子围栏多边形标记数组
      fenceNameMarkers3d: [], // 已渲染的电子围栏名称标记数组（3D）
      isCreatingFence3d: false, // 是否正在创建3D电子围栏
      fencePoints: [], // 电子围栏的坐标点数组
      fencePointMarkers: [], // 绘制电子围栏时的点标记数组
      currentPolygonMarker: null, // 当前绘制的多边形标记
      showFenceDialog: false, // 显示设置电子围栏信息对话框
      fenceForm: {
        name: "",
        colour: "#FF0000",
        flag: true, // 是否开启电子围栏，true为启用，false为停用
      },
      mapClickHandler: null, // 地图点击事件处理器
      creatingFenceColor: "#FF0000", // 正在创建的电子围栏颜色
      // 右键菜单相关
      popMarker: null, // 右键菜单信息框
      popMarkerTip: false, // 是否有提示框了
      currentFenceId: null, // 当前右键点击的电子围栏ID
      currentFenceMarker: null, // 当前右键点击的电子围栏标记
      // 编辑电子围栏相关
      isEditingFence3d: false, // 是否正在编辑电子围栏
      editingFenceId: null, // 正在编辑的电子围栏ID
      editingFenceMarker: null, // 正在编辑的电子围栏标记
      editingFenceData: null, // 正在编辑的电子围栏原始数据
      pendingEditFenceId: null, // 待编辑的电子围栏ID（用于室内电子围栏编辑）
      isEditFromList: false, // 是否从列表编辑进入的
      iconSrc: "../../../static/beacon.png",
      deviceVectorSource: null,
      deviceVectorLayer: null,
      deviceMarkers3d: [],
    };
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
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
      getFenceManageAndPointListByPage(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list || [];
          that.total = res.data.size || 0;
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
      // 刷新表格数据
      this.getFenceManageAndPointLists();
      // 刷新下拉框数据
      this.getFenceManageLists();
    },
    initMap() {
      var that = this;
    
      setTimeout(() => {
        that.vectorSource = new VectorSource();
        that.map = new Map({
          target: that.$refs.map,
          layers: [
            ...createOutdoorBaseLayers(that.$store.state.i18n == "zh"),
            new VectorLayer({
              source: that.vectorSource,
              renderMode: "vector",
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
    // 室外电子围栏样式（含名称文字）
    createOutdoorFenceStyle(color, name) {
      return new Style({
        fill: new Fill({
          color: this.hexToRgba(color, 0.5),
        }),
        stroke: new Stroke({
          color: color,
          width: 2,
        }),
        text: name
          ? new Text({
              text: name,
              font: "bold 13px Microsoft YaHei, sans-serif",
              fill: new Fill({
                color: "#333333",
              }),
              stroke: new Stroke({
                color: "#ffffff",
                width: 3,
              }),
              overflow: true,
              textAlign: "center",
              textBaseline: "middle",
            })
          : undefined,
      });
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
        feature.setStyle(this.createOutdoorFenceStyle(this.fillColor, this.mapData.name));
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
        feature.setStyle(this.createOutdoorFenceStyle(color, fenceData.name));
        this.vectorSource.addFeature(feature);
      });
    },
    // 处理室外电子围栏
    handleOutdoorFence() {
      this.showFenceTypePopover = false;
      // 室外电子围栏 - 使用现有逻辑
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
    // 处理室内电子围栏
    handleIndoorFence() {
      this.showFenceTypePopover = false;
      // 重置选择
      this.selectedBuildingId = "";
      this.selectedGroundId = "";
      this.groundList = [];
      // 显示楼栋楼层选择对话框
      this.showBuildingFloorDialog = true;
      // 获取楼栋列表
      this.getBuildings();
    },
    // 获取楼栋列表
    getBuildings() {
      var that = this;
      let data = {
        tenantid: this.$store.state.intoProjectTenantid,
        projectid: this.$store.state.intoProjectid,
      };
      getBuildingByProjectid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.buildingList = res.data;
        }
      });
    },
    // 楼栋选择变化时获取楼层列表
    handleBuildingChange(buildingId) {
      if (buildingId) {
        this.selectedGroundId = ""; // 重置楼层选择
        this.getGrounds(buildingId);
      } else {
        this.groundList = [];
      }
    },
    // 获取楼层列表
    getGrounds(buildid) {
      var that = this;
      let data = {
        buildid: buildid,
      };
      getGround(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.groundList = res.data;
          }
        }
      );
    },
    // 确认选择楼栋楼层
    confirmBuildingFloor() {
      if (!this.selectedBuildingId || !this.selectedGroundId) {
        this.$message({
          message: this.$t('floormanagement.Pleaseselectpoint'),
          type: 'warning',
        });
        return;
      }
      // 获取选中的楼栋和楼层信息
      const selectedBuilding = this.buildingList.find(
        (item) => item.id === this.selectedBuildingId
      );
      const selectedGround = this.groundList.find(
        (item) => item.id === this.selectedGroundId
      );
      
      if (!selectedGround) {
        this.$message({
          message: this.$t('floormanagement.Pleaseselectpoint'),
          type: 'warning',
        });
        return;
      }

      // 保存当前楼层信息
      this.currentGroundInfo = {
        ...selectedGround,
        buildid: this.selectedBuildingId, // 确保有 buildid 字段
        buildingId: this.selectedBuildingId,
        buildingName: selectedBuilding ? selectedBuilding.building : "",
        projectid: this.$store.state.intoProjectid,
      };
      this.iconSrc =
        this.$store.state.intoProjectType == 1
          ? "../../../static/beacon.png"
          : "../../../static/gateway.png";
      
      console.log("保存的楼层信息:", this.currentGroundInfo);

      // 关闭楼栋楼层选择对话框
      this.showBuildingFloorDialog = false;
      
      // 显示地图弹框
      this.showIndoorMapDialog = true;
    },
    // 取消选择楼栋楼层
    cancelBuildingFloorDialog() {
      this.showBuildingFloorDialog = false;
      this.selectedBuildingId = "";
      this.selectedGroundId = "";
      this.groundList = [];
    },
    // 加载2D地图
    load2DMap(groundInfo) {
      var that = this;
      const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
      this.imgUrl = base + "indoormap/" + groundInfo.filetype;
      this.imageWidth = groundInfo.length || 1000;
      this.imageHeight = groundInfo.width || 1000;
      
      var extent = [0, 0, this.imageWidth, this.imageHeight];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      
      setTimeout(() => {
        const mapContainer = document.getElementById("indoorMap2d");
        if (mapContainer) {
          mapContainer.style.width = "100%";
          mapContainer.style.height = "100%";
        }

        let zoom = 4;
        let minZoom = 3;
        if (groundInfo.nums > 200) {
          zoom = 5;
          minZoom = 4;
        }
        if (groundInfo.reallength > 60 || groundInfo.realwidth > 60) {
          minZoom = 3;
        } else {
          minZoom = 1;
        }

        // 创建矢量数据源和图层
        that.vectorSource2d = new VectorSource();
        that.vectorLayer2d = new VectorLayer({
          source: that.vectorSource2d,
        });
        
        that.map2d = new Map({
          layers: [
            new ImageLayer({
              source: new Static({
                url: this.imgUrl,
                projection: projection,
                imageExtent: extent,
              }),
            }),
            that.vectorLayer2d,
          ],
          target: "indoorMap2d",
          view: new View({
            projection: projection,
            center: getCenter(extent),
            zoom: zoom,
            maxZoom: 6,
            minZoom: minZoom,
          }),
        });
        
        // 初始化2D地图右键菜单
        that.init2dContextMenu();
        
        // 2D地图加载完成后，查询电子围栏信息
        if (that.currentGroundInfo) {
          that.getFenceManageData(that.currentGroundInfo.projectid || that.$store.state.intoProjectid, that.currentGroundInfo.id);
          that.loadArrangedDevices();
        }
      }, 100);
    },
    // 加载3D地图
    load3DMap(groundInfo) {
      console.log("load3DMap 被调用，groundInfo:", groundInfo);
      var that = this;
      
      // 检查必要参数
      if (!groundInfo.filename || !groundInfo.filetype || !groundInfo.appname || !groundInfo.mapkey) {
        console.error("3D地图参数不完整:", {
          filename: groundInfo.filename,
          filetype: groundInfo.filetype,
          appname: groundInfo.appname,
          mapkey: groundInfo.mapkey
        });
        this.$message({
          message: "3D地图配置信息不完整",
          type: "error",
        });
        return;
      }
      
      // 检查 buildid，优先使用 buildid，如果没有则使用 buildingId
      const buildid = groundInfo.buildid || groundInfo.buildingId;
      if (!buildid) {
        console.error("buildid 为空，groundInfo:", groundInfo);
        this.$message({
          message: "楼栋ID为空，无法加载地图",
          type: "error",
        });
        return;
      }
      
      // 获取该楼栋下的所有楼层，用于计算newground
      let data = {
        buildid: buildid,
      };
      console.log("获取楼层列表，buildid:", buildid);
      getGround(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          console.log("获取楼层列表响应:", res);
          if (res.code == 1001) {
            let groundListCopy = [];
            for (let i = 0; i < res.data.length; i++) {
              let groundinfo = {
                groundid: res.data[i].id,
                ground: res.data[i].ground,
                newground: i + 1,
              };
              groundListCopy.push(groundinfo);
            }

            let newGround = groundListCopy.find(function (item) {
              return item.ground == groundInfo.ground;
            });

            if (newGround) {
              console.log("找到对应的楼层组:", newGround);
              this.fmapId = groundInfo.filename;
              this.themeId = groundInfo.filetype;
              this.lastGroupid = newGround.newground;
              
              console.log("3D地图参数:", {
                fmapId: this.fmapId,
                themeId: this.themeId,
                lastGroupid: this.lastGroupid,
                appname: groundInfo.appname,
                mapkey: groundInfo.mapkey
              });

              // 确保DOM渲染完成后再加载地图
              this.$nextTick(() => {
                setTimeout(() => {
                  const fengMapContainer = document.getElementById("fengMap");
                  console.log("查找3D地图容器:", fengMapContainer);
                  
                  if (!fengMapContainer) {
                    console.error("3D地图容器未找到");
                    that.$message({
                      message: "3D地图容器未找到",
                      type: "error",
                    });
                    return;
                  }
                  
                  // 强制设置容器和父容器的高度
                  const parentContainer = fengMapContainer.parentElement;
                  if (parentContainer) {
                    parentContainer.style.height = '80vh';
                    parentContainer.style.minHeight = '600px';
                  }
                  
                  // 强制设置容器高度
                  fengMapContainer.style.height = '80vh';
                  fengMapContainer.style.minHeight = '600px';
                  fengMapContainer.style.width = '100%';
                  
                  // 确保容器有正确的尺寸
                  const containerWidth = fengMapContainer.offsetWidth || fengMapContainer.clientWidth || 1555;
                  const containerHeight = fengMapContainer.offsetHeight || fengMapContainer.clientHeight || 600;
                  
                  console.log("容器尺寸:", {
                    offsetWidth: fengMapContainer.offsetWidth,
                    offsetHeight: fengMapContainer.offsetHeight,
                    clientWidth: fengMapContainer.clientWidth,
                    clientHeight: fengMapContainer.clientHeight,
                    computedWidth: containerWidth,
                    computedHeight: containerHeight,
                    styleHeight: fengMapContainer.style.height
                  });
                  
                  // 即使高度为0也尝试加载，fengmap可能会自己处理
                  that.onmap3D(
                    newGround.newground,
                    groundInfo.projectid,
                    groundInfo.appname,
                    groundInfo.mapkey
                  );
                }, 500);
              });
            } else {
              console.error("未找到对应的楼层组");
              this.$message({
                message: "未找到对应的楼层组",
                type: "error",
              });
            }
          } else {
            console.error("获取楼层列表失败:", res);
            this.$message({
              message: res.msg || "获取楼层列表失败",
              type: "error",
            });
          }
        }
      ).catch((error) => {
        console.error("获取楼层列表异常:", error);
        this.$message({
          message: "获取楼层列表异常: " + error.message,
          type: "error",
        });
      });
    },
    // 加载3D地图（fengmap）- 完全参考ElectronicFenceMap.vue的实现
    onmap3D(group, projectid, appname, mapkey) {
      var that = this;
      // 检查是否已加载fengmap库
      if (typeof fengmap === "undefined") {
        console.error("fengmap library is not loaded");
        return;
      }

      document.oncontextmenu = function (e) {
        return false;
      };

      that.lastGroupid = group;
      
      // 确保容器已渲染（完全参考ElectronicFenceMap.vue的简单实现）
      setTimeout(() => {
        var container = document.getElementById("fengMap");
        if (container) {
          var mapOpation = applyFengmapLocalLoad({
            container: container,
            level: group,
            visibleLevels: [group],
            focusAlpha: 0.1,
            appName: appname,
            key: mapkey,
            defaultControlsPose: 0,
            viewMode: fengmap.FMViewMode.MODE_2D,
            mapID: that.fmapId,
            themeID: that.themeId,
            zoomRange: [1, 29],
          });
          that.map3d = new fengmap.FMMap(mapOpation);
          that.map3d.on("loaded", function () {
            // 地图加载完成后的回调
            console.log("3D地图加载完成");
            // 查询电子围栏信息
            that.getFenceManageData(that.currentGroundInfo.projectid || that.$store.state.intoProjectid, that.currentGroundInfo.id);
            that.loadArrangedDevices();
            // 绑定地图点击事件（用于右键菜单）
            that.bindMapClickEvent();
          });
        }
      }, 100);
    },
    // 弹框打开后的回调
    onIndoorMapDialogOpened() {
      console.log("弹框已打开，开始加载地图");
      console.log("currentGroundInfo:", this.currentGroundInfo);
      // 弹框打开后，根据maptype加载对应地图
      if (this.currentGroundInfo) {
        console.log("maptype:", this.currentGroundInfo.maptype);
        this.$nextTick(() => {
          setTimeout(() => {
            if (this.currentGroundInfo.maptype == 1) {
              // 2D地图
              console.log("开始加载2D地图");
              this.load2DMap(this.currentGroundInfo);
            } else if (this.currentGroundInfo.maptype == 2) {
              // 3D地图
              console.log("开始加载3D地图");
              this.load3DMap(this.currentGroundInfo);
            } else {
              console.warn("未知的maptype:", this.currentGroundInfo.maptype);
            }
          }, 300);
        });
      } else {
        console.error("currentGroundInfo为空，无法加载地图");
      }
    },
    // 关闭室内地图
    closeIndoorMap() {
      this.clearArrangedDevices2d();
      this.clearArrangedDevices3d();
      // 清理2D地图
      if (this.map2d) {
        // 移除所有交互
        if (this.drawInteraction2d) {
          this.map2d.removeInteraction(this.drawInteraction2d);
          this.drawInteraction2d = null;
        }
        if (this.modifyInteraction2d) {
          this.map2d.removeInteraction(this.modifyInteraction2d);
          this.modifyInteraction2d = null;
        }
        if (this.selectInteraction2d) {
          this.map2d.removeInteraction(this.selectInteraction2d);
          this.selectInteraction2d = null;
        }
        // 清理覆盖层
        if (this.contextMenuOverlay2d) {
          this.map2d.removeOverlay(this.contextMenuOverlay2d);
          this.contextMenuOverlay2d = null;
        }
        // 清理数据源和图层
        if (this.vectorSource2d) {
          this.vectorSource2d.clear();
          this.vectorSource2d = null;
        }
        if (this.vectorLayer2d) {
          this.map2d.removeLayer(this.vectorLayer2d);
          this.vectorLayer2d = null;
        }
        this.map2d.setTarget(null);
        this.map2d = null;
      }
      // 清理2D地图电子围栏相关状态
      this.fenceFeatures2d = [];
      this.isCreatingFence2d = false;
      this.isEditingFence2d = false;
      this.editingFenceFeature2d = null;
      this.editingFenceId2d = null;
      // 清理3D地图（使用dispose方法，参考Arrange3dMap.vue）
      if (this.map3d) {
        try {
          if (typeof this.map3d.dispose === 'function') {
            this.map3d.dispose();
          }
        } catch (e) {
          console.error("清理3D地图失败:", e);
        }
        this.map3d = null;
      }
      // 清理容器
      const fengMapContainer = document.getElementById("fengMap");
      if (fengMapContainer) {
        fengMapContainer.innerHTML = '';
      }
      // 清理3D地图电子围栏相关状态
      this.cleanupFence3d();
      // 清除待编辑的围栏ID
      this.pendingEditFenceId = null;
      // 重置从列表编辑进入的标志
      this.isEditFromList = false;
      this.showIndoorMapDialog = false;
      this.currentGroundInfo = null;
      // 重新查询表格数据
      this.getFenceManageAndPointLists();
      this.getFenceManageLists();
    },
    // 取消/返回室内地图
    handleCancelIndoorMap() {
      // 直接清理状态，不弹出对话框
      // 如果正在创建3D围栏，先停止
      if (this.isCreatingFence3d) {
        this.stopDrawingFence();
        this.isCreatingFence3d = false;
        this.fencePoints = [];
        this.clearPolygonMarker();
        this.clearFencePointMarkers();
      }
      // 如果正在创建2D围栏，先停止
      if (this.isCreatingFence2d) {
        this.stopDrawingFence2d();
        this.isCreatingFence2d = false;
        this.fencePoints = [];
        // 清除未保存的绘制要素
        if (this.vectorSource2d) {
          var features = this.vectorSource2d.getFeatures();
          features.forEach((feature) => {
            if (!feature.get('fenceId')) {
              this.vectorSource2d.removeFeature(feature);
            }
          });
        }
      }
      // 如果正在编辑3D围栏，先停止（不弹出对话框）
      if (this.isEditingFence3d) {
        this.stopDrawingFence();
        this.isEditingFence3d = false;
        this.editingFenceId = null;
        this.editingFenceMarker = null;
        this.editingFenceData = null;
        this.fencePoints = [];
        this.clearPolygonMarker();
        this.clearFencePointMarkers();
      }
      // 如果正在编辑2D围栏，先停止（不弹出对话框）
      if (this.isEditingFence2d) {
        this.stopEditingFence2d();
        this.fencePoints = [];
      }
      // 关闭设置电子围栏信息对话框（防止残留）
      this.showFenceDialog = false;
      // 重置从列表编辑进入的标志
      this.isEditFromList = false;
      this.closeIndoorMap();
    },
    // 清理3D地图电子围栏相关状态
    cleanupFence3d() {
      // 如果正在创建电子围栏，先停止
      if (this.isCreatingFence3d) {
        this.stopDrawingFence();
        this.isCreatingFence3d = false;
        this.fencePoints = [];
        this.clearPolygonMarker();
        this.clearFencePointMarkers();
      }
      // 如果正在编辑电子围栏，先停止
      if (this.isEditingFence3d) {
        this.stopDrawingFence();
        this.isEditingFence3d = false;
        this.editingFenceId = null;
        this.editingFenceMarker = null;
        this.editingFenceData = null;
        this.fencePoints = [];
        this.clearPolygonMarker();
        this.clearFencePointMarkers();
      }
      // 关闭设置电子围栏信息对话框（防止关闭弹框时残留）
      this.showFenceDialog = false;
      // 清除右键菜单
      if (this.popMarker) {
        try {
          this.popMarker.remove();
        } catch (e) {
          console.error("清除右键菜单失败:", e);
        }
        this.popMarker = null;
        this.popMarkerTip = false;
      }
      // 清除所有电子围栏标记
      this.clearAllFenceMarkers();
      // 清理全局函数
      if (window.closeFenceMenu) {
        delete window.closeFenceMenu;
      }
      if (window.editFence) {
        delete window.editFence;
      }
      if (window.deleteFence) {
        delete window.deleteFence;
      }
    },
    // 加载当前楼层已布置的设备（参考布置页面）
    loadArrangedDevices() {
      var that = this;
      if (!that.currentGroundInfo) {
        return;
      }
      var projectid =
        that.currentGroundInfo.projectid || that.$store.state.intoProjectid;
      var groundid = that.currentGroundInfo.id;
      getDevAndOtherList(
        {
          projectype: that.$store.state.intoProjectType,
          groundid: groundid,
          projectid: projectid,
          inallot: 1,
          inuse: 1,
        },
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then(function (res) {
        if (res.code == 1001) {
          var deviceList = (res.data.devList || []).concat(
            res.data.otherList || []
          );
          if (
            that.currentGroundInfo &&
            that.currentGroundInfo.maptype == 1 &&
            that.map2d
          ) {
            that.renderArrangedDevices2d(deviceList);
          } else if (
            that.currentGroundInfo &&
            that.currentGroundInfo.maptype == 2 &&
            that.map3d
          ) {
            that.renderArrangedDevices3d(deviceList);
          }
        }
      });
    },
    ensureDeviceLayer2d() {
      if (!this.map2d) {
        return;
      }
      if (this.deviceVectorLayer) {
        var onMap =
          this.map2d.getLayers().getArray().indexOf(this.deviceVectorLayer) !==
          -1;
        if (onMap) {
          return;
        }
        this.deviceVectorLayer = null;
        this.deviceVectorSource = null;
      }
      this.deviceVectorSource = new VectorSource();
      this.deviceVectorLayer = new VectorLayer({
        source: this.deviceVectorSource,
        zIndex: 100,
      });
      this.deviceVectorLayer.set("isArrangedDeviceLayer", true);
      this.map2d.addLayer(this.deviceVectorLayer);
    },
    clearArrangedDevices2d() {
      if (this.deviceVectorSource) {
        this.deviceVectorSource.clear();
      }
      if (this.deviceVectorLayer && this.map2d) {
        this.map2d.removeLayer(this.deviceVectorLayer);
      }
      this.deviceVectorLayer = null;
      this.deviceVectorSource = null;
    },
    clearArrangedDevices3d() {
      this.deviceMarkers3d.forEach(function (marker) {
        try {
          marker.remove();
        } catch (e) {
          console.error("清除已布置设备标记失败:", e);
        }
      });
      this.deviceMarkers3d = [];
    },
    getArrangedDevice2dStyle(info) {
      var alias = info.alias || "";
      var labelStyle = new Text({
        text: alias,
        font: "14px Microsoft YaHei, sans-serif",
        fill: new Fill({ color: "blue" }),
        offsetY: 10,
      });
      var imageSrc = this.iconSrc;
      if (info.devtype) {
        switch (info.devtype) {
          case 1:
            imageSrc = "../../../static/aoa.png";
            break;
          case 2:
            imageSrc = "../../../static/smoke.png";
            break;
          case 3:
            imageSrc = "../../../static/alarm.png";
            break;
          case 5:
            imageSrc = "../../../static/camera.png";
            break;
          default:
            break;
        }
      } else if (this.$store.state.intoProjectType == 1) {
        if (info.type == 2) {
          imageSrc = "../../../static/beacon_sos.png";
        } else if (info.clockin == 1) {
          imageSrc = "../../../static/clock.png";
        }
      } else if (info.clockin == 1) {
        imageSrc = "../../../static/clock.png";
      }
      return new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: imageSrc,
          scale: 1,
        }),
        text: labelStyle,
      });
    },
    getArrangedDeviceCoords2d(info) {
      if (info.devtype) {
        return [info.lastx, info.lasty];
      }
      if (this.$store.state.intoProjectType == 1) {
        return [info.longi, info.lati];
      }
      return [info.lastx, info.lasty];
    },
    renderArrangedDevices2d(deviceList) {
      var that = this;
      if (!that.map2d) {
        return;
      }
      that.ensureDeviceLayer2d();
      that.deviceVectorSource.clear();
      if (!deviceList || deviceList.length === 0) {
        return;
      }
      deviceList.forEach(function (info) {
        var coords = that.getArrangedDeviceCoords2d(info);
        if (
          coords[0] === undefined ||
          coords[0] === null ||
          coords[1] === undefined ||
          coords[1] === null
        ) {
          return;
        }
        var feature = new Feature({
          geometry: new Point(coords),
          isArrangedDevice: true,
        });
        feature.setStyle(that.getArrangedDevice2dStyle(info));
        that.deviceVectorSource.addFeature(feature);
      });
    },
    createCompositeDeviceMarker3d(x, y, imageUrl, label) {
      return new fengmap.FMCompositeMarker({
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
            text: label,
          },
        },
        x: x,
        y: y,
        height: 1,
        collision: false,
        anchor: {
          baseon: "image",
          anchor: fengmap.FMMarkerAnchor.CENTER,
        },
        image: {
          url: imageUrl,
          size: [100, 100],
        },
      });
    },
    addArrangedDeviceMarker3d(info, group) {
      var that = this;
      var alias = info.alias || "";
      var x;
      var y;
      var imageUrl = that.iconSrc;
      if (info.devtype) {
        x = info.lastx;
        y = info.lasty;
        switch (info.devtype) {
          case 1:
            imageUrl = "../../../static/aoa.png";
            break;
          case 2:
            imageUrl = "../../../static/smoke.png";
            break;
          case 3:
            imageUrl = "../../../static/alarm.png";
            break;
          case 5:
            imageUrl = "../../../static/camera.png";
            break;
          default:
            break;
        }
      } else if (that.$store.state.intoProjectType == 1) {
        x = info.longi;
        y = info.lati;
        if (info.type == 2) {
          imageUrl = "../../../static/beacon_sos.png";
        } else if (info.clockin == 1) {
          imageUrl = "../../../static/clock.png";
        }
      } else {
        x = info.lastx;
        y = info.lasty;
        if (info.clockin == 1) {
          imageUrl = "../../../static/clock.png";
        }
      }
      if (x === undefined || x === null || y === undefined || y === null) {
        return;
      }
      var marker = that.createCompositeDeviceMarker3d(x, y, imageUrl, alias);
      marker.selfAttr = { isArrangedDevice: true };
      marker.addTo(group);
      that.deviceMarkers3d.push(marker);
    },
    renderArrangedDevices3d(deviceList) {
      var that = this;
      if (!that.map3d) {
        return;
      }
      that.clearArrangedDevices3d();
      if (!deviceList || deviceList.length === 0) {
        return;
      }
      try {
        var level = that.map3d.getLevel();
        var group = that.map3d.getFloor(level);
        deviceList.forEach(function (info) {
          that.addArrangedDeviceMarker3d(info, group);
        });
      } catch (e) {
        console.error("渲染已布置设备失败:", e);
      }
    },
    // 获取电子围栏列表
    getFenceManageData(projectid, groundid) {
      var that = this;
      let data = {
        projectid: projectid,
        groundid: groundid,
      };
      getFenceManageAndPointListByPage(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.fenceManageList = res.data.list || [];
          console.log("电子围栏列表:", that.fenceManageList);
          // 渲染所有电子围栏到地图上
          if (that.currentGroundInfo && that.currentGroundInfo.maptype == 2 && that.map3d) {
            that.renderAllFences();
            // 如果有待编辑的围栏ID，自动进入编辑模式
            if (that.pendingEditFenceId) {
              that.$nextTick(() => {
                setTimeout(() => {
                  // 找到对应的围栏标记
                  var targetMarker = that.fencePolygonMarkers.find(function(marker) {
                    return marker.selfAttr && marker.selfAttr.fenceId === that.pendingEditFenceId;
                  });
                  if (targetMarker) {
                    that.startEditFence3d(targetMarker);
                  } else {
                    console.warn("未找到待编辑的围栏标记，fenceId:", that.pendingEditFenceId);
                  }
                  // 清除待编辑的围栏ID
                  that.pendingEditFenceId = null;
                }, 500);
              });
            }
          } else if (that.currentGroundInfo && that.currentGroundInfo.maptype == 1 && that.map2d) {
            // 渲染2D地图的电子围栏
            that.renderAllFences2d();
            // 如果有待编辑的围栏ID，自动进入编辑模式
            if (that.pendingEditFenceId) {
              that.$nextTick(() => {
                setTimeout(() => {
                  // 找到对应的围栏要素
                  var targetFeature = that.fenceFeatures2d.find(function(feature) {
                    return feature.get('fenceId') === that.pendingEditFenceId;
                  });
                  if (targetFeature) {
                    that.startEditFence2d(targetFeature);
                  } else {
                    console.warn("未找到待编辑的围栏要素，fenceId:", that.pendingEditFenceId);
                  }
                  // 清除待编辑的围栏ID
                  that.pendingEditFenceId = null;
                }, 500);
              });
            }
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 计算围栏多边形中心点
    getFencePolygonCenter(points) {
      if (!points || points.length === 0) {
        return { x: 0, y: 0 };
      }
      var validPoints = points;
      if (
        points.length > 1 &&
        (points[0].x || points[0].pointX) ===
          (points[points.length - 1].x || points[points.length - 1].pointX) &&
        (points[0].y || points[0].pointY) ===
          (points[points.length - 1].y || points[points.length - 1].pointY)
      ) {
        validPoints = points.slice(0, -1);
      }
      var centerX = 0;
      var centerY = 0;
      validPoints.forEach(function (point) {
        centerX += point.x || point.pointX || 0;
        centerY += point.y || point.pointY || 0;
      });
      return {
        x: centerX / validPoints.length,
        y: centerY / validPoints.length,
      };
    },
    // 转义围栏名称，避免注入到 DOM
    escapeFenceName(name) {
      return String(name || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },
    // 渲染所有电子围栏到地图上
    renderAllFences() {
      var that = this;
      if (!that.map3d || !that.currentGroundInfo || that.currentGroundInfo.maptype !== 2) return;

      // 清除之前的电子围栏标记
      that.clearAllFenceMarkers();

      if (!that.fenceManageList || that.fenceManageList.length === 0) {
        return;
      }

      try {
        var level = that.map3d.getLevel();
        var group = that.map3d.getFloor(level);

        // 遍历电子围栏列表，在地图上渲染每个围栏
        that.fenceManageList.forEach(function (fence) {
          if (!fence.list || fence.list.length < 3) {
            return; // 至少需要3个点才能形成多边形
          }

          // 构建多边形点数组
          var polygonPoints = fence.list.map(function (point) {
            return {
              x: point.pointX || point.x,
              y: point.pointY || point.y,
              z: 1,
            };
          });

          // 闭合多边形（添加第一个点到末尾）
          polygonPoints.push({
            x: polygonPoints[0].x,
            y: polygonPoints[0].y,
            z: 1,
          });

          // 创建多边形标记
          var polygonMarker = new fengmap.FMPolygonMarker({
            points: polygonPoints,
            color: fence.colour || "#FF0000",
            alpha: 0.3,
            lineWidth: 2,
            lineColor: fence.colour || "#FF0000",
          });

          // 为多边形标记添加自定义属性，用于识别电子围栏
          polygonMarker.selfAttr = {
            fenceId: fence.id,
            fenceName: fence.name,
            fenceData: fence,
          };

          polygonMarker.addTo(group);
          that.fencePolygonMarkers.push(polygonMarker);

          // 在围栏中心显示名称，便于多个围栏时区分
          var fenceName = fence.name || "";
          if (fenceName) {
            var center = that.getFencePolygonCenter(polygonPoints);
            var borderColor = fence.colour || "#FF0000";
            var nameHtml =
              '<div style="padding:2px 8px;background:rgba(255,255,255,0.92);border:1px solid ' +
              borderColor +
              ';border-radius:4px;color:#333;font-size:12px;line-height:18px;white-space:nowrap;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,0.2);">' +
              that.escapeFenceName(fenceName) +
              "</div>";
            var nameMarker = new fengmap.FMDomMarker({
              x: center.x,
              y: center.y,
              height: 2,
              anchor: fengmap.FMMarkerAnchor.CENTER,
              collision: false,
              domWidth: Math.min(220, Math.max(48, fenceName.length * 14 + 20)),
              domHeight: 28,
              content: nameHtml,
            });
            nameMarker.selfAttr = {
              fenceId: fence.id,
              fenceName: fenceName,
              isNameLabel: true,
            };
            nameMarker.addTo(group);
            that.fenceNameMarkers3d.push(nameMarker);
          }
        });
      } catch (e) {
        console.error("渲染电子围栏失败:", e);
      }
    },
    // 清除所有电子围栏标记
    clearAllFenceMarkers() {
      this.fencePolygonMarkers.forEach(function (marker) {
        try {
          marker.remove();
        } catch (e) {
          console.error("清除电子围栏标记失败:", e);
        }
      });
      this.fencePolygonMarkers = [];
      this.fenceNameMarkers3d.forEach(function (marker) {
        try {
          marker.remove();
        } catch (e) {
          console.error("清除电子围栏名称标记失败:", e);
        }
      });
      this.fenceNameMarkers3d = [];
    },
    // ========== 2D地图电子围栏相关方法 ==========
    // 渲染所有2D电子围栏到地图上
    renderAllFences2d() {
      var that = this;
      if (!that.map2d || !that.vectorSource2d) {
        return;
      }

      // 清除之前的电子围栏
      that.fenceFeatures2d.forEach(function (feature) {
        that.vectorSource2d.removeFeature(feature);
      });
      that.fenceFeatures2d = [];

      if (!that.fenceManageList || that.fenceManageList.length === 0) {
        return;
      }

      try {
        // 遍历电子围栏列表，在地图上渲染每个围栏
        that.fenceManageList.forEach(function (fence) {
          if (!fence.list || fence.list.length < 3) {
            return; // 至少需要3个点才能形成多边形
          }

          // 构建多边形坐标数组（2D地图使用像素坐标）
          var polygonCoords = fence.list.map(function (point) {
            return [point.pointX || point.x, point.pointY || point.y];
          });
          // 闭合多边形
          polygonCoords.push(polygonCoords[0]);

          // 创建多边形要素
          var polygon = new Polygon([polygonCoords]);
          var feature = new Feature(polygon);

          // 设置样式（含名称文字，便于多个围栏时区分）
          var color = fence.colour || "#FF0000";
          var fenceName = fence.name || "";
          feature.setStyle(
            new Style({
              fill: new Fill({
                color: that.hexToRgba(color, 0.3),
              }),
              stroke: new Stroke({
                color: color,
                width: 2,
              }),
              text: fenceName
                ? new Text({
                    text: fenceName,
                    font: "bold 13px Microsoft YaHei, sans-serif",
                    fill: new Fill({
                      color: "#333333",
                    }),
                    stroke: new Stroke({
                      color: "#ffffff",
                      width: 3,
                    }),
                    overflow: true,
                    textAlign: "center",
                    textBaseline: "middle",
                  })
                : undefined,
            })
          );

          // 为要素添加自定义属性，用于识别电子围栏
          feature.set('fenceId', fence.id);
          feature.set('fenceName', fence.name);
          feature.set('fenceData', fence);
          feature.set('fenceColor', color);

          that.vectorSource2d.addFeature(feature);
          that.fenceFeatures2d.push(feature);
        });
      } catch (e) {
        console.error("渲染2D电子围栏失败:", e);
      }
    },
    // 初始化2D地图右键菜单
    init2dContextMenu() {
      var that = this;
      if (!that.map2d) {
        return;
      }

      // 创建右键菜单DOM元素
      var menuElement = document.createElement('div');
      menuElement.id = 'fenceContextMenu2d';
      menuElement.className = 'contextmenu';
      menuElement.style.display = 'none';
      menuElement.innerHTML = `
        <ul>
          <li>
            <button class="el-button el-button--mini BUTTON" id="editFence2d">${that.$t("tet.edit")}</button>
          </li>
          <li>
            <button class="el-button el-button--mini BUTTON DELETE" id="deleteFence2d">${that.$t("tet.delete")}</button>
          </li>
        </ul>
      `;
      document.body.appendChild(menuElement);

      // 创建覆盖层
      that.contextMenuOverlay2d = new Overlay({
        element: menuElement,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10],
      });
      that.map2d.addOverlay(that.contextMenuOverlay2d);

      // 绑定右键菜单事件
      that.map2d.on('contextmenu', function (event) {
        event.preventDefault();
        var pixel = that.map2d.getEventPixel(event.originalEvent);
        var feature = that.map2d.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });

        if (feature && feature.get('fenceId')) {
          // 显示右键菜单
          var coordinate = that.map2d.getEventCoordinate(event.originalEvent);
          that.contextMenuOverlay2d.setPosition(coordinate);
          menuElement.style.display = 'block';
          that.currentFenceId = feature.get('fenceId');
          that.currentFenceMarker = feature;

          // 如果是从列表编辑进入的，检查是否允许编辑/删除其他围栏
          var canOperateOtherFence = !that.isEditFromList || (that.isEditFromList && feature.get('fenceId') === that.pendingEditFenceId);
          var buttonDisabled = that.isEditFromList && feature.get('fenceId') !== that.pendingEditFenceId;
          
          // 更新按钮状态
          var editButton = document.getElementById('editFence2d');
          var deleteButton = document.getElementById('deleteFence2d');
          
          if (buttonDisabled) {
            editButton.style.opacity = '0.5';
            editButton.style.cursor = 'not-allowed';
            editButton.style.pointerEvents = 'none';
            deleteButton.style.opacity = '0.5';
            deleteButton.style.cursor = 'not-allowed';
            deleteButton.style.pointerEvents = 'none';
          } else {
            editButton.style.opacity = '';
            editButton.style.cursor = '';
            editButton.style.pointerEvents = '';
            deleteButton.style.opacity = '';
            deleteButton.style.cursor = '';
            deleteButton.style.pointerEvents = '';
          }

          // 绑定编辑按钮事件
          editButton.onclick = function () {
            if (!canOperateOtherFence) {
              that.$message({
                message: that.$store.state.i18n == "zh" ? "只能编辑当前选中的电子围栏" : "Can only edit the currently selected electronic fence",
                type: "warning",
              });
              menuElement.style.display = 'none';
              that.contextMenuOverlay2d.setPosition(undefined);
              return;
            }
            that.startEditFence2d(feature);
            menuElement.style.display = 'none';
            that.contextMenuOverlay2d.setPosition(undefined);
          };

          // 绑定删除按钮事件
          deleteButton.onclick = function () {
            if (!canOperateOtherFence) {
              that.$message({
                message: that.$store.state.i18n == "zh" ? "只能操作当前选中的电子围栏" : "Can only operate the currently selected electronic fence",
                type: "warning",
              });
              menuElement.style.display = 'none';
              that.contextMenuOverlay2d.setPosition(undefined);
              return;
            }
            that.confirmDeleteFence2d(feature);
            menuElement.style.display = 'none';
            that.contextMenuOverlay2d.setPosition(undefined);
          };
        } else {
          // 隐藏右键菜单
          menuElement.style.display = 'none';
          that.contextMenuOverlay2d.setPosition(undefined);
        }
      });

      // 点击地图其他地方时隐藏菜单
      that.map2d.on('click', function () {
        menuElement.style.display = 'none';
        that.contextMenuOverlay2d.setPosition(undefined);
      });
    },
    // 切换创建2D电子围栏状态
    toggleCreateFence2d() {
      if (!this.map2d || !this.currentGroundInfo || this.currentGroundInfo.maptype !== 1) {
        return;
      }

      // 如果正在编辑，不能创建
      if (this.isEditingFence2d) {
        return;
      }

      this.isCreatingFence2d = !this.isCreatingFence2d;

      if (this.isCreatingFence2d) {
        // 开始创建电子围栏
        this.startDrawingFence2d();
      } else {
        // 结束创建电子围栏
        this.stopDrawingFence2d();
        // 如果已绘制多边形，弹出对话框
        if (this.drawInteraction2d && this.drawInteraction2d.getOverlay().getSource().getFeatures().length > 0) {
          var feature = this.drawInteraction2d.getOverlay().getSource().getFeatures()[0];
          var geometry = feature.getGeometry();
          var coordinates = geometry.getCoordinates()[0];
          if (coordinates.length >= 4) { // 至少3个点+闭合点
            this.fencePoints = coordinates.slice(0, -1).map(function (coord) {
              return { x: coord[0], y: coord[1] };
            });
            this.showFenceDialog = true;
          } else {
            this.$message({
              message: this.$t("warning.AtLeastThreePoints"),
              type: "warning",
            });
            this.vectorSource2d.removeFeature(feature);
          }
        }
      }
    },
    // 开始绘制2D电子围栏
    startDrawingFence2d() {
      var that = this;
      if (!that.map2d || !that.vectorSource2d) {
        return;
      }

      // 移除之前的绘制交互
      if (that.drawInteraction2d) {
        that.map2d.removeInteraction(that.drawInteraction2d);
      }

      // 创建绘制交互
      that.drawInteraction2d = new Draw({
        source: that.vectorSource2d,
        type: 'Polygon',
      });

      // 设置绘制样式
      that.drawInteraction2d.on('drawstart', function () {
        that.creatingFenceColor = that.fenceForm.colour || "#FF0000";
      });

      // 绘制完成事件
      that.drawInteraction2d.on('drawend', function (event) {
        var feature = event.feature;
        var geometry = feature.getGeometry();
        var coordinates = geometry.getCoordinates()[0];

        // 设置样式
        feature.setStyle(
          new Style({
            fill: new Fill({
              color: that.hexToRgba(that.creatingFenceColor, 0.3),
            }),
            stroke: new Stroke({
              color: that.creatingFenceColor,
              width: 2,
            }),
          })
        );

        // 移除绘制交互
        that.map2d.removeInteraction(that.drawInteraction2d);
        that.drawInteraction2d = null;
        that.isCreatingFence2d = false;

        // 保存坐标点
        that.fencePoints = coordinates.slice(0, -1).map(function (coord) {
          return { x: coord[0], y: coord[1] };
        });

        // 弹出对话框
        if (that.fencePoints.length >= 3) {
          that.showFenceDialog = true;
        } else {
          that.$message({
            message: that.$t("warning.AtLeastThreePoints"),
            type: "warning",
          });
          that.vectorSource2d.removeFeature(feature);
        }
      });

      that.map2d.addInteraction(that.drawInteraction2d);
    },
    // 停止绘制2D电子围栏
    stopDrawingFence2d() {
      if (this.drawInteraction2d) {
        this.map2d.removeInteraction(this.drawInteraction2d);
        this.drawInteraction2d = null;
      }
    },
    // 切换编辑2D电子围栏状态
    toggleEditFence2d() {
      var that = this;
      if (!that.isEditingFence2d) {
        return;
      }

      // 停止编辑交互
      if (that.modifyInteraction2d) {
        that.map2d.removeInteraction(that.modifyInteraction2d);
        that.modifyInteraction2d = null;
      }

      // 从当前编辑的要素获取最新的坐标
      if (that.editingFenceFeature2d) {
        var geometry = that.editingFenceFeature2d.getGeometry();
        var coordinates = geometry.getCoordinates()[0];
        that.fencePoints = coordinates.slice(0, -1).map(function (coord) {
          return { x: coord[0], y: coord[1] };
        });
      }

      // 检查点数
      if (that.fencePoints.length < 3) {
        that.$message({
          message: that.$t("warning.AtLeastThreePoints"),
          type: "warning",
        });
        // 恢复编辑状态（限制只能修改当前编辑的要素）
        if (that.editingFenceFeature2d) {
          var featureCollection = new Collection([that.editingFenceFeature2d]);
          that.modifyInteraction2d = new Modify({
            features: featureCollection, // 限制只能修改指定的要素
          });
          that.modifyInteraction2d.on('modifyend', function (event) {
            var modifiedFeature = event.features.getArray()[0];
            if (modifiedFeature === that.editingFenceFeature2d) {
              var modifiedGeometry = modifiedFeature.getGeometry();
              var modifiedCoordinates = modifiedGeometry.getCoordinates()[0];
              that.fencePoints = modifiedCoordinates.slice(0, -1).map(function (coord) {
                return { x: coord[0], y: coord[1] };
              });
            }
          });
          that.map2d.addInteraction(that.modifyInteraction2d);
        }
        return;
      }

      // 弹出编辑对话框
      that.showFenceDialog = true;
    },
    // 开始编辑2D电子围栏
    startEditFence2d(feature) {
      var that = this;
      if (!that.map2d || !that.vectorSource2d) {
        return;
      }

      // 如果正在创建，不能编辑
      if (that.isCreatingFence2d) {
        that.$message({
          message: "请先完成或取消创建电子围栏",
          type: "warning",
        });
        return;
      }

      // 保存编辑的围栏信息
      that.isEditingFence2d = true;
      that.editingFenceId2d = feature.get('fenceId');
      that.editingFenceFeature2d = feature;

      // 查找原始数据
      var fenceData = that.fenceManageList.find(function (f) {
        return f.id === feature.get('fenceId');
      });

      // 从要素获取点
      var geometry = feature.getGeometry();
      var coordinates = geometry.getCoordinates()[0];
      that.fencePoints = coordinates.slice(0, -1).map(function (coord) {
        return { x: coord[0], y: coord[1] };
      });

      // 设置颜色和名称
      that.fenceForm.colour = fenceData ? (fenceData.colour || "#FF0000") : "#FF0000";
      that.fenceForm.name = fenceData ? (fenceData.name || "") : "";
      that.fenceForm.flag = fenceData ? (fenceData.flag !== false) : true;
      that.creatingFenceColor = that.fenceForm.colour;

      // 添加修改交互（限制只能修改当前编辑的要素）
      if (that.modifyInteraction2d) {
        that.map2d.removeInteraction(that.modifyInteraction2d);
      }
      
      // 创建一个只包含当前编辑要素的集合
      var featureCollection = new Collection([feature]);
      
      that.modifyInteraction2d = new Modify({
        features: featureCollection, // 限制只能修改指定的要素
      });

      // 修改完成事件
      that.modifyInteraction2d.on('modifyend', function (event) {
        var modifiedFeature = event.features.getArray()[0];
        if (modifiedFeature === feature) {
          var modifiedGeometry = modifiedFeature.getGeometry();
          var modifiedCoordinates = modifiedGeometry.getCoordinates()[0];
          that.fencePoints = modifiedCoordinates.slice(0, -1).map(function (coord) {
            return { x: coord[0], y: coord[1] };
          });
        }
      });

      that.map2d.addInteraction(that.modifyInteraction2d);
    },
    // 停止编辑2D电子围栏
    stopEditingFence2d() {
      if (this.modifyInteraction2d) {
        this.map2d.removeInteraction(this.modifyInteraction2d);
        this.modifyInteraction2d = null;
      }
      this.isEditingFence2d = false;
      this.editingFenceId2d = null;
      this.editingFenceFeature2d = null;
    },
    // 确认删除2D电子围栏
    confirmDeleteFence2d(feature) {
      var that = this;
      
      // 如果是从列表编辑进入的，不允许删除其他围栏（双重检查）
      if (that.isEditFromList && that.pendingEditFenceId) {
        var fenceId = feature.get('fenceId');
        if (fenceId !== that.pendingEditFenceId) {
          that.$message({
            message: that.$store.state.i18n == "zh" ? "只能操作当前选中的电子围栏" : "Can only operate the currently selected electronic fence",
            type: "warning",
          });
          return;
        }
      }
      
      var fenceId = feature.get('fenceId');
      var fenceName = feature.get('fenceName') || '';

      that.$confirm(
        that.$store.state.i18n == "zh" 
          ? `确认删除电子围栏"${fenceName}"吗？` 
          : `Confirm to delete electronic fence "${fenceName}"?`,
        that.$t("beacon.prompt"),
        {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          that.deleteFence2d(fenceId);
        })
        .catch(() => {});
    },
    // 删除2D电子围栏
    deleteFence2d(fenceId) {
      var that = this;
      let data = {
        id: fenceId,
      };
      delFenceManage(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("beacon.deletesuccess"),
              type: "success",
            });
            // 重新获取电子围栏列表
            that.getFenceManageData(
              that.currentGroundInfo.projectid || that.$store.state.intoProjectid,
              that.currentGroundInfo.id
            );
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    // 切换创建3D电子围栏状态
    toggleCreateFence3d() {
      if (!this.map3d || !this.currentGroundInfo || this.currentGroundInfo.maptype !== 2) {
        return;
      }

      // 如果正在编辑，不能创建
      if (this.isEditingFence3d) {
        return;
      }

      this.isCreatingFence3d = !this.isCreatingFence3d;

      if (this.isCreatingFence3d) {
        // 开始创建电子围栏
        this.fencePoints = [];
        this.creatingFenceColor = this.fenceForm.colour || "#FF0000";
        this.startDrawingFence();
      } else {
        // 结束创建电子围栏
        this.stopDrawingFence();
        // 如果有点，弹出对话框
        if (this.fencePoints.length >= 3) {
          this.showFenceDialog = true;
        } else if (this.fencePoints.length > 0) {
          this.$message({
            message: this.$t("warning.AtLeastThreePoints"),
            type: "warning",
          });
          this.fencePoints = [];
          this.clearPolygonMarker();
          this.clearFencePointMarkers();
        }
      }
    },
    // 开始绘制电子围栏
    startDrawingFence() {
      console.log("开始绘制电子围栏, map3d:", this.map3d);
      var that = this;
      if (!that.map3d) {
        console.error("地图未初始化");
        return;
      }

      // 清除之前的标记
      that.clearPolygonMarker();
      that.clearFencePointMarkers();

      // 绑定地图点击事件
      that.mapClickHandler = function (event) {
        console.log("地图点击事件触发", event);
        
        // 只处理左键点击（button === 0）
        if (event.mouseEvent.button !== 0) {
          return;
        }
        
        // 如果点击的是电子围栏多边形标记，不处理（避免在创建围栏时误点击已有围栏）
        if (event.targets && event.targets.length > 0 && !that.isEditingFence3d) {
          var target = event.targets[0];
          if (target.selfAttr && target.selfAttr.fenceId) {
            // 点击了电子围栏，不处理
            return;
          }
        }

        // 只在地图底面上点击才添加点
        var isFloor = true;
        if (event.targets && event.targets.length > 0) {
          var target = event.targets[0];
          if (target.type == "64" || target.type == "8") {
            // type=64或8 表示点击的是标记，不处理
            isFloor = false;
          }
        }

        if (isFloor) {
          // 点击的是地图底面
          var coord = event.coords;
          console.log("添加点:", coord);
          that.fencePoints.push({ x: coord.x, y: coord.y });
          console.log("当前点数:", that.fencePoints.length);

          // 在地图上显示点标记
          that.addFencePointMarker(coord.x, coord.y);

          // 实时更新多边形显示
          that.updatePolygonMarker();
        }
      };

      that.map3d.on("click", that.mapClickHandler);
    },
    // 停止绘制电子围栏
    stopDrawingFence() {
      if (this.map3d && this.mapClickHandler) {
        this.map3d.off("click", this.mapClickHandler);
        this.mapClickHandler = null;
      }
    },
    // 更新多边形标记
    updatePolygonMarker() {
      var that = this;
      console.log("更新多边形标记, 点数:", that.fencePoints.length);
      if (!that.map3d) {
        console.error("地图未初始化");
        return;
      }
      
      if (that.fencePoints.length < 1) return;

      // 清除之前的标记
      that.clearPolygonMarker();

      try {
        // 构建多边形点数组（fengmap需要的格式）
        var polygonPoints = that.fencePoints.map(function (point) {
          return {
            x: point.x,
            y: point.y,
            z: 1,
          };
        });

        // 如果点数>=3，闭合多边形
        if (that.fencePoints.length >= 3) {
          polygonPoints.push({
            x: that.fencePoints[0].x,
            y: that.fencePoints[0].y,
            z: 1,
          });
        }

        // 创建多边形标记
        var level = that.map3d.getLevel();
        var group = that.map3d.getFloor(level);

        that.currentPolygonMarker = new fengmap.FMPolygonMarker({
          points: polygonPoints,
          color: that.creatingFenceColor || that.fenceForm.colour || "#FF0000",
          alpha: 0.3,
          lineWidth: 2,
          lineColor: that.creatingFenceColor || that.fenceForm.colour || "#FF0000",
        });

        that.currentPolygonMarker.addTo(group);
        console.log("多边形标记创建成功");
      } catch (e) {
        console.error("创建多边形标记失败:", e);
      }
    },
    // 清除多边形标记
    clearPolygonMarker() {
      if (this.currentPolygonMarker) {
        try {
          this.currentPolygonMarker.remove();
        } catch (e) {
          console.error("清除多边形标记失败:", e);
        }
        this.currentPolygonMarker = null;
      }
    },
    // 添加点标记
    addFencePointMarker(x, y, pointIndex) {
      var that = this;
      if (!that.map3d) return;

      try {
        var level = that.map3d.getLevel();
        var group = that.map3d.getFloor(level);

        var pointMarker = new fengmap.FMImageMarker({
          x: x,
          y: y,
          height: 10,
          url: "../../../static/near.png",
          size: 32,
          collision: false,
        });

        // 保存点索引，方便后续删除
        if (pointIndex !== undefined) {
          pointMarker.selfAttr = { pointIndex: pointIndex };
        }

        pointMarker.addTo(group);
        that.fencePointMarkers.push(pointMarker);
      } catch (e) {
        console.error("添加点标记失败:", e);
      }
    },
    // 清除所有点标记
    clearFencePointMarkers() {
      this.fencePointMarkers.forEach(function (marker) {
        try {
          marker.remove();
        } catch (e) {
          console.error("清除点标记失败:", e);
        }
      });
      this.fencePointMarkers = [];
    },
    // 取消创建/编辑电子围栏（支持2D和3D）
    cancelCreateFence3d() {
      var that = this;
      // 清除已绘制的电子围栏
      that.fencePoints = [];
      that.clearPolygonMarker();
      that.clearFencePointMarkers();
      that.fenceForm.name = "";
      that.fenceForm.colour = "#FF0000";
      that.fenceForm.flag = true;
      that.showFenceDialog = false;
      // 重置3D创建状态
      if (that.isCreatingFence3d) {
        that.isCreatingFence3d = false;
        that.stopDrawingFence();
      }
      // 重置2D创建状态
      if (that.isCreatingFence2d) {
        that.isCreatingFence2d = false;
        that.stopDrawingFence2d();
        // 清除未保存的绘制要素
        if (that.vectorSource2d) {
          var features = that.vectorSource2d.getFeatures();
          features.forEach((feature) => {
            if (!feature.get('fenceId')) {
              that.vectorSource2d.removeFeature(feature);
            }
          });
        }
      }
      // 重置3D编辑状态
      if (that.isEditingFence3d) {
        that.isEditingFence3d = false;
        that.editingFenceId = null;
        that.editingFenceMarker = null;
        that.editingFenceData = null;
        that.stopDrawingFence();
        // 重新渲染所有围栏
        that.getFenceManageData(that.currentGroundInfo.projectid || that.$store.state.intoProjectid, that.currentGroundInfo.id);
      }
      // 重置2D编辑状态
      if (that.isEditingFence2d) {
        that.stopEditingFence2d();
        // 重新渲染所有围栏
        that.getFenceManageData(that.currentGroundInfo.projectid || that.$store.state.intoProjectid, that.currentGroundInfo.id);
      }
    },
    // 确认创建/编辑3D电子围栏
    confirmCreateFence3d() {
      var that = this;

      if (!that.fenceForm.name || !that.fenceForm.name.trim()) {
        that.$message({
          message: that.$t("warning.EnterFenceName"),
          type: "warning",
        });
        return;
      }

      if (that.fencePoints.length < 3) {
        that.$message({
          message: that.$t("warning.AtLeastThreePoints"),
          type: "warning",
        });
        return;
      }

      if (!that.currentGroundInfo) {
        that.$message({
          message: "楼层信息不存在",
          type: "error",
        });
        return;
      }

      // 构建提交数据
      var data = {
        name: that.fenceForm.name.trim(),
        projectid: that.currentGroundInfo.projectid || that.$store.state.intoProjectid,
        groundid: that.currentGroundInfo.id,
        list: that.fencePoints.map(function (point) {
          return { pointX: point.x, pointY: point.y };
        }),
        colour: that.fenceForm.colour || "#FF0000",
        flag: that.fenceForm.flag, // true为启用，false为停用
      };

      // 如果是编辑模式，添加id字段（支持2D和3D）
      if ((that.isEditingFence3d && that.editingFenceId) || (that.isEditingFence2d && that.editingFenceId2d)) {
        data.id = that.isEditingFence3d ? that.editingFenceId : that.editingFenceId2d;
      }

      // 调用接口
      fenceManage(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: (that.isEditingFence3d || that.isEditingFence2d)
                ? that.$t("warning.EditSuccess")
                : that.$t("warning.CreateSuccess"),
              type: "success",
            });
            // 保存是否是从列表编辑进入的状态（在重置前）
            var wasEditFromList = that.isEditFromList;
            var wasEditing = that.isEditingFence3d || that.isEditingFence2d;
            
            // 关闭对话框
            that.showFenceDialog = false;
            // 清除3D地图的标记
            that.clearPolygonMarker();
            that.clearFencePointMarkers();
            
            // 清除2D地图的绘制要素（如果是创建模式）
            if (that.isCreatingFence2d && that.vectorSource2d) {
              var features = that.vectorSource2d.getFeatures();
              features.forEach(function(feature) {
                if (!feature.get('fenceId')) {
                  that.vectorSource2d.removeFeature(feature);
                }
              });
            }
            
            // 重置状态
            that.isCreatingFence3d = false;
            that.isCreatingFence2d = false;
            that.isEditingFence3d = false;
            that.isEditingFence2d = false;
            that.editingFenceId = null;
            that.editingFenceId2d = null;
            that.editingFenceMarker = null;
            that.editingFenceFeature2d = null;
            that.editingFenceData = null;
            that.fencePoints = [];
            that.fenceForm.name = "";
            that.fenceForm.colour = "#FF0000";
            that.fenceForm.flag = true;
            that.creatingFenceColor = "#FF0000";
            
            // 停止2D地图的绘制和编辑交互
            if (that.drawInteraction2d) {
              that.map2d.removeInteraction(that.drawInteraction2d);
              that.drawInteraction2d = null;
            }
            if (that.modifyInteraction2d) {
              that.map2d.removeInteraction(that.modifyInteraction2d);
              that.modifyInteraction2d = null;
            }
            // 重新获取电子围栏列表
            that.getFenceManageData(that.currentGroundInfo.projectid || that.$store.state.intoProjectid, that.currentGroundInfo.id);
            
            // 如果是从列表编辑进入的，编辑完成后关闭弹框
            if (wasEditFromList && wasEditing) {
              // 重置标志
              that.isEditFromList = false;
              // 延迟关闭，确保数据已保存
              setTimeout(() => {
                that.handleCancelIndoorMap();
              }, 500);
            }
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    // 绑定地图点击事件（用于右键菜单）
    bindMapClickEvent() {
      var that = this;
      if (!that.map3d) {
        return;
      }

      // 鼠标左右键点击事件
      that.map3d.on("click", function (event) {
        // 如果正在创建电子围栏，不处理右键菜单
        if (that.isCreatingFence3d) {
          return;
        }

        // 只处理右键点击
        if (event.mouseEvent.button !== 2) {
          return;
        }

        // 检测是否点击了电子围栏多边形标记
        var clickedFenceMarker = null;
        
        // 方法1: 遍历所有targets查找
        if (event.targets && event.targets.length > 0) {
          for (var i = 0; i < event.targets.length; i++) {
            var target = event.targets[i];
            if (target.selfAttr && target.selfAttr.fenceId) {
              clickedFenceMarker = target;
              break;
            }
          }
        }

        // 方法2: 如果targets中没找到，通过坐标判断是否点击在多边形内
        if (!clickedFenceMarker && event.coords) {
          var clickX = event.coords.x;
          var clickY = event.coords.y;
          
          // 遍历所有已渲染的电子围栏标记，判断点击是否在多边形内
          for (var j = 0; j < that.fencePolygonMarkers.length; j++) {
            var marker = that.fencePolygonMarkers[j];
            if (marker.selfAttr && marker.selfAttr.fenceId) {
              var points = marker.points || [];
              if (points.length >= 3) {
                // 使用射线法判断点是否在多边形内
                if (that.isPointInPolygon(clickX, clickY, points)) {
                  clickedFenceMarker = marker;
                  break;
                }
              }
            }
          }
        }

        // 如果找到点击的电子围栏，显示右键菜单
        if (clickedFenceMarker) {
          that.showFenceContextMenu(clickedFenceMarker);
        }
      });
    },
    // 判断点是否在多边形内（射线法）
    isPointInPolygon(x, y, points) {
      if (!points || points.length < 3) {
        return false;
      }
      
      // 过滤掉闭合点的最后一个点（如果存在）
      var validPoints = points;
      if (points.length > 1) {
        var firstPoint = points[0];
        var lastPoint = points[points.length - 1];
        var firstX = firstPoint.x || firstPoint.pointX;
        var firstY = firstPoint.y || firstPoint.pointY;
        var lastX = lastPoint.x || lastPoint.pointX;
        var lastY = lastPoint.y || lastPoint.pointY;
        
        if (firstX === lastX && firstY === lastY) {
          validPoints = points.slice(0, -1);
        }
      }
      
      if (validPoints.length < 3) {
        return false;
      }
      
      var inside = false;
      for (var i = 0, j = validPoints.length - 1; i < validPoints.length; j = i++) {
        var xi = validPoints[i].x || validPoints[i].pointX;
        var yi = validPoints[i].y || validPoints[i].pointY;
        var xj = validPoints[j].x || validPoints[j].pointX;
        var yj = validPoints[j].y || validPoints[j].pointY;
        
        var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    },
    // 显示电子围栏右键菜单
    showFenceContextMenu(marker) {
      var that = this;
      
      // 如果已有菜单，先移除
      if (that.popMarker) {
        that.popMarker.remove();
        that.popMarker = null;
        that.popMarkerTip = false;
      }

      // 保存当前选中的电子围栏信息
      that.currentFenceId = marker.selfAttr.fenceId;
      that.currentFenceMarker = marker;

      // 如果是从列表编辑进入的，检查是否允许编辑/删除其他围栏
      var canEditOtherFence = !that.isEditFromList || (that.isEditFromList && marker.selfAttr.fenceId === that.pendingEditFenceId);
      var editButtonDisabled = that.isEditFromList && marker.selfAttr.fenceId !== that.pendingEditFenceId;
      var deleteButtonDisabled = that.isEditFromList && marker.selfAttr.fenceId !== that.pendingEditFenceId;
      
      // 创建右键菜单（参考Arrange3dMap的样式）
      var editButtonStyle = editButtonDisabled ? 'opacity: 0.5; cursor: not-allowed; pointer-events: none;' : '';
      var deleteButtonStyle = deleteButtonDisabled ? 'opacity: 0.5; cursor: not-allowed; pointer-events: none;' : '';
      var editButtonOnclick = canEditOtherFence ? 'editFence()' : 'void(0)';
      var deleteButtonOnclick = canEditOtherFence ? 'deleteFence()' : 'void(0)';
      var menuContent = `
        <div style='text-align:left;background: #f1f5f7' class="threecontent">
          <ul id="popup-content">
            <li style="margin-top:5px;text-align:right">
              <a style="margin-right:5px" href="#" id="fenceMenu-closer" class="ol-popup-closer" onclick="closeFenceMenu()">
                <img src="../../../static/close.jpg" width="11" height="11"/>
              </a>
            </li>
            <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="${editButtonOnclick}" 
                      class="el-button el-button--mini BUTTON" 
                      style="${editButtonStyle}">${that.$t("tet.edit")}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="${deleteButtonOnclick}" 
                      class="el-button el-button--mini BUTTON DELETE" 
                      style="${deleteButtonStyle}">${that.$t("tet.delete")}</button>
            </li>
          </ul>
        </div>
      `;

      // 获取标记的中心点坐标
      var points = marker.points || [];
      var centerX = 0;
      var centerY = 0;
      if (points.length > 0) {
        // 过滤掉闭合点的最后一个点（如果存在）
        var validPoints = points;
        if (points.length > 1 && 
            points[0].x === points[points.length - 1].x && 
            points[0].y === points[points.length - 1].y) {
          validPoints = points.slice(0, -1);
        }
        validPoints.forEach(function(point) {
          centerX += (point.x || point.pointX || 0);
          centerY += (point.y || point.pointY || 0);
        });
        if (validPoints.length > 0) {
          centerX = centerX / validPoints.length;
          centerY = centerY / validPoints.length;
        }
      }

      // 创建信息窗口
      var ctlOpt = {
        x: centerX,
        y: centerY,
        anchor: fengmap.FMMarkerAnchor.LEFT_BOTTOM,
        domWidth: 120,
        domHeight: 120,
        collision: false,
        content: menuContent,
      };

      that.popMarker = new fengmap.FMDomMarker(ctlOpt);
      var level = that.map3d.getLevel();
      var floor = that.map3d.getFloor(level);
      that.popMarker.addTo(floor);
      that.popMarkerTip = true;

      // 绑定全局函数（用于菜单按钮点击）
      window.closeFenceMenu = function() {
        if (that.popMarker) {
          that.popMarker.remove();
          that.popMarker = null;
          that.popMarkerTip = false;
        }
      };

      window.editFence = function() {
        // 如果是从列表编辑进入的，只能编辑指定的围栏
        if (that.isEditFromList && that.pendingEditFenceId) {
          if (marker.selfAttr.fenceId !== that.pendingEditFenceId) {
            that.$message({
              message: that.$store.state.i18n == "zh" ? "只能编辑当前选中的电子围栏" : "Can only edit the currently selected electronic fence",
              type: "warning",
            });
            window.closeFenceMenu();
            return;
          }
        }
        that.startEditFence3d(marker);
        window.closeFenceMenu();
      };

      window.deleteFence = function() {
        // 如果是从列表编辑进入的，不允许删除其他围栏
        if (that.isEditFromList && that.pendingEditFenceId) {
          if (marker.selfAttr.fenceId !== that.pendingEditFenceId) {
            that.$message({
              message: that.$store.state.i18n == "zh" ? "只能操作当前选中的电子围栏" : "Can only operate the currently selected electronic fence",
              type: "warning",
            });
            window.closeFenceMenu();
            return;
          }
        }
        that.confirmDeleteFence();
      };
    },
    // 开始编辑3D电子围栏
    startEditFence3d(marker) {
      var that = this;
      if (!that.map3d || !that.currentGroundInfo || that.currentGroundInfo.maptype !== 2) {
        return;
      }

      // 如果正在创建，不能编辑
      if (that.isCreatingFence3d) {
        that.$message({
          message: "请先完成或取消创建电子围栏",
          type: "warning",
        });
        return;
      }

      // 如果是从列表编辑进入的，只能编辑指定的围栏
      if (that.isEditFromList && that.pendingEditFenceId) {
        if (marker.selfAttr.fenceId !== that.pendingEditFenceId) {
          that.$message({
            message: that.$store.state.i18n == "zh" ? "只能编辑当前选中的电子围栏" : "Can only edit the currently selected electronic fence",
            type: "warning",
          });
          return;
        }
      }

      // 保存编辑的围栏信息
      that.isEditingFence3d = true;
      that.editingFenceId = marker.selfAttr.fenceId;
      that.editingFenceMarker = marker;
      
      // 查找原始数据
      var fenceData = that.fenceManageList.find(function(f) {
        return f.id === marker.selfAttr.fenceId;
      });
      that.editingFenceData = fenceData;

      // 从原始数据获取点
      if (fenceData && fenceData.list && fenceData.list.length >= 3) {
        that.fencePoints = fenceData.list.map(function(point) {
          return {
            x: point.pointX || point.x,
            y: point.pointY || point.y,
          };
        });
      } else {
        // 从marker获取点
        var points = marker.points || [];
        that.fencePoints = [];
        // 过滤掉闭合点
        var validPoints = points;
        if (points.length > 1 && 
            points[0].x === points[points.length - 1].x && 
            points[0].y === points[points.length - 1].y) {
          validPoints = points.slice(0, -1);
        }
        validPoints.forEach(function(point) {
          that.fencePoints.push({
            x: point.x || point.pointX,
            y: point.y || point.pointY,
          });
        });
      }

      // 设置颜色和名称
      that.fenceForm.colour = fenceData ? (fenceData.colour || "#FF0000") : "#FF0000";
      that.fenceForm.name = fenceData ? (fenceData.name || "") : "";
      that.fenceForm.flag = fenceData ? (fenceData.flag !== false) : true; // 默认启用
      that.creatingFenceColor = that.fenceForm.colour;

      // 隐藏当前正在编辑的围栏标记（从数组中移除并删除）
      var markerIndex = -1;
      for (var i = 0; i < that.fencePolygonMarkers.length; i++) {
        if (that.fencePolygonMarkers[i].selfAttr && 
            that.fencePolygonMarkers[i].selfAttr.fenceId === marker.selfAttr.fenceId) {
          try {
            that.fencePolygonMarkers[i].remove();
          } catch (e) {
            console.error("清除编辑围栏标记失败:", e);
          }
          markerIndex = i;
          break;
        }
      }
      if (markerIndex >= 0) {
        that.fencePolygonMarkers.splice(markerIndex, 1);
      }
      
      // 先清除之前的点标记（避免重复）
      that.clearFencePointMarkers();
      
      // 显示可编辑的多边形（用currentPolygonMarker显示）
      that.updatePolygonMarker();
      
      // 显示所有点标记（带索引）
      that.fencePoints.forEach(function(point, index) {
        that.addFencePointMarker(point.x, point.y, index);
      });

      // 绑定地图点击事件（允许添加新点），但不清除多边形
      that.startEditingFenceDrawing();
    },
    // 开始编辑模式下的绘制（不清除已有标记）
    startEditingFenceDrawing() {
      console.log("开始编辑模式绘制, map3d:", this.map3d);
      var that = this;
      if (!that.map3d) {
        console.error("地图未初始化");
        return;
      }

      // 编辑模式下不清除已有的多边形和点标记，只绑定点击事件
      // 绑定地图点击事件
      that.mapClickHandler = function (event) {
        console.log("地图点击事件触发（编辑模式）", event);
        
        // 只处理左键点击（button === 0）
        if (event.mouseEvent.button !== 0) {
          return;
        }

        // 检查是否点击了点标记或其他围栏（编辑模式下只能编辑当前围栏）
        if (event.targets && event.targets.length > 0) {
          var target = event.targets[0];
          
          // 检查是否点击了其他围栏的多边形标记
          if (target.type == "4" || target.type == "2") {
            // type=4或2 表示点击的是多边形标记
            // 检查点击的坐标是否在其他围栏内
            var clickX = event.coords.x;
            var clickY = event.coords.y;
            var isInOtherFence = false;
            
            // 遍历所有围栏标记，检查是否点击在其他围栏内
            for (var k = 0; k < that.fencePolygonMarkers.length; k++) {
              var marker = that.fencePolygonMarkers[k];
              // 跳过当前编辑的围栏
              if (marker.selfAttr && marker.selfAttr.fenceId === that.editingFenceId) {
                continue;
              }
              
              // 检查点击是否在这个围栏内
              var points = marker.points || [];
              if (points.length > 0 && that.isPointInPolygon(clickX, clickY, points)) {
                isInOtherFence = true;
                break;
              }
            }
            
            // 如果点击在其他围栏内，不允许编辑
            if (isInOtherFence) {
              that.$message({
                message: that.$store.state.i18n == "zh" ? "只能编辑当前选中的电子围栏" : "Can only edit the currently selected electronic fence",
                type: "warning",
              });
              return;
            }
          }
          
          // 检查是否是点标记
          if (target.type == "64" || target.type == "8") {
            // 查找对应的点标记（只查找当前编辑围栏的点标记）
            var clickedPointIndex = -1;
            for (var i = 0; i < that.fencePointMarkers.length; i++) {
              var pointMarker = that.fencePointMarkers[i];
              // 通过坐标比较找到对应的点标记
              if (Math.abs(pointMarker.x - event.coords.x) < 1 && 
                  Math.abs(pointMarker.y - event.coords.y) < 1) {
                // 找到对应的点标记，获取点索引
                if (pointMarker.selfAttr && pointMarker.selfAttr.pointIndex !== undefined) {
                  clickedPointIndex = pointMarker.selfAttr.pointIndex;
                } else {
                  // 如果没有索引，通过坐标查找
                  for (var j = 0; j < that.fencePoints.length; j++) {
                    if (Math.abs(that.fencePoints[j].x - pointMarker.x) < 1 &&
                        Math.abs(that.fencePoints[j].y - pointMarker.y) < 1) {
                      clickedPointIndex = j;
                      break;
                    }
                  }
                }
                break;
              }
            }
            
            // 如果找到对应的点，删除它（至少保留3个点）
            if (clickedPointIndex >= 0 && that.fencePoints.length > 3) {
              that.fencePoints.splice(clickedPointIndex, 1);
              // 重新渲染多边形和点标记
              that.clearPolygonMarker();
              that.clearFencePointMarkers();
              that.updatePolygonMarker();
              that.fencePoints.forEach(function(point, index) {
                that.addFencePointMarker(point.x, point.y, index);
              });
              return;
            }
          }
        }

        // 检查点击是否在其他围栏内（编辑模式下不允许在其他围栏内添加点）
        var clickX = event.coords.x;
        var clickY = event.coords.y;
        var isInOtherFence = false;
        
        // 遍历所有围栏标记，检查是否点击在其他围栏内
        for (var m = 0; m < that.fencePolygonMarkers.length; m++) {
          var otherMarker = that.fencePolygonMarkers[m];
          // 跳过当前编辑的围栏
          if (otherMarker.selfAttr && otherMarker.selfAttr.fenceId === that.editingFenceId) {
            continue;
          }
          
          // 检查点击是否在这个围栏内
          var otherPoints = otherMarker.points || [];
          if (otherPoints.length > 0 && that.isPointInPolygon(clickX, clickY, otherPoints)) {
            isInOtherFence = true;
            break;
          }
        }
        
        // 如果点击在其他围栏内，不允许添加点
        if (isInOtherFence) {
          that.$message({
            message: that.$store.state.i18n == "zh" ? "只能编辑当前选中的电子围栏" : "Can only edit the currently selected electronic fence",
            type: "warning",
          });
          return;
        }

        // 只在地图底面上点击才添加点
        var isFloor = true;
        if (event.targets && event.targets.length > 0) {
          var target = event.targets[0];
          if (target.type == "64" || target.type == "8") {
            // type=64或8 表示点击的是标记，不处理
            isFloor = false;
          }
        }

        if (isFloor) {
          // 点击的是地图底面，添加新点
          var coord = event.coords;
          console.log("添加点:", coord);
          that.fencePoints.push({ x: coord.x, y: coord.y });
          console.log("当前点数:", that.fencePoints.length);

          // 在地图上显示点标记（编辑模式下带索引）
          var pointIndex = that.isEditingFence3d ? (that.fencePoints.length - 1) : undefined;
          that.addFencePointMarker(coord.x, coord.y, pointIndex);

          // 实时更新多边形显示
          that.updatePolygonMarker();
        }
      };

      that.map3d.on("click", that.mapClickHandler);
    },
    // 结束编辑3D电子围栏
    toggleEditFence3d() {
      var that = this;
      if (!that.isEditingFence3d) {
        return;
      }

      // 停止绘制
      that.stopDrawingFence();

      // 检查点数
      if (that.fencePoints.length < 3) {
        that.$message({
          message: that.$t("warning.AtLeastThreePoints"),
          type: "warning",
        });
        return;
      }

      // 弹出编辑对话框
      that.showFenceDialog = true;
    },
    // 确认删除电子围栏
    confirmDeleteFence() {
      var that = this;
      
      // 如果是从列表编辑进入的，不允许删除其他围栏（双重检查）
      if (that.isEditFromList && that.pendingEditFenceId && that.currentFenceId) {
        if (that.currentFenceId !== that.pendingEditFenceId) {
          that.$message({
            message: that.$store.state.i18n == "zh" ? "只能操作当前选中的电子围栏" : "Can only operate the currently selected electronic fence",
            type: "warning",
          });
          // 关闭右键菜单
          if (that.popMarker) {
            that.popMarker.remove();
            that.popMarker = null;
            that.popMarkerTip = false;
          }
          return;
        }
      }
      
      // 关闭右键菜单
      if (that.popMarker) {
        that.popMarker.remove();
        that.popMarker = null;
        that.popMarkerTip = false;
      }

      // 显示确认删除对话框
      that.$confirm(
        that.$t("floormanagement.Aredelete") || "确定要删除吗？",
        that.$t("Building.tips") || "提示",
        {
          confirmButtonText: that.$t("login.confirm") || "确认",
          cancelButtonText: that.$t("login.cancel") || "取消",
          type: "warning",
        }
      )
        .then(() => {
          that.deleteFence();
        })
        .catch(() => {
          // 取消删除，不做任何操作
        });
    },
    // 删除电子围栏
    deleteFence() {
      var that = this;
      if (!that.currentFenceId) {
        that.$message({
          message: that.$t("warning.error") || "删除失败：未找到电子围栏ID",
          type: "error",
        });
        return;
      }

      let data = {
        id: that.currentFenceId,
      };

      delFenceManage(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      )
        .then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("buildingmanagement.deletesuccess"),
              type: "success",
            });
            // 重新获取电子围栏列表并刷新显示
            that.getFenceManageData(that.currentGroundInfo.projectid || that.$store.state.intoProjectid, that.currentGroundInfo.id);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.error("删除电子围栏失败:", error);
          that.$message({
            message: that.$t("buildingmanagement.deletefaile"),
            type: "error",
          });
        })
        .finally(() => {
          // 清除当前选中的电子围栏信息
          that.currentFenceId = null;
          that.currentFenceMarker = null;
        });
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
              groundid:0,
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
        groundid:0
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
              res.data.length > 0 && res.data[0].list && res.data[0].list.length > 0
                ? res.data[0].list[0].pointX
                : that.$store.state.longis;
            that.centerY =
              res.data.length > 0 && res.data[0].list && res.data[0].list.length > 0
                ? res.data[0].list[0].pointY
                : that.$store.state.latis;
            that.editFences = [];
            res.data.forEach((item) => {
              let editFences = [];
              item.list.forEach((items) => {
                editFences.push([items.pointX, items.pointY]);
              });

              that.editFences.push({
                coordinates: editFences,
                color: item.colour,
                name: item.name,
              });
            });

            that.savedFences = that.editFences;

            that.showMap = true;
            that.add = false;
            that.edit = false;
          }
        }
      });
    },
    EditFenceCommand(index) {
      var that = this;
      const fenceData = this.tableData[index];
      const groundid = fenceData.groundid || 0;
      
      // 如果 groundid 为 0，表示是室外电子围栏，使用原有逻辑
      if (groundid === 0 || groundid === null || groundid === undefined) {
        this.mapData = {
          projectid: this.$store.state.intoProjectid,
          name: "",
        };
        this.fillColor = fenceData.colour;
        this.centerX =
          fenceData.list.length > 0
            ? fenceData.list[0].pointX
            : 0;
        this.centerY =
          fenceData.list.length > 0
            ? fenceData.list[0].pointY
            : 0;
        this.mapData = {
          projectid: this.$store.state.intoProjectid,
          name: "",
        };
        this.mapData.name = fenceData.name;
        this.fenceID = fenceData.id;
        let list = fenceData.list;
        let editFences = [];
        this.editFences = [];
        list.forEach((item) => {
          editFences.push([item.pointX, item.pointY]);
        });
        this.editFences.push({
          coordinates: editFences,
          color: fenceData.colour,
          name: fenceData.name,
        });
        this.savedFences = this.editFences;
        this.showMap = true;
        this.add = false;
        this.edit = true;
      } else {
        // groundid 不为 0，表示是室内电子围栏
        // 根据 groundid 查询楼层信息
        let data = {
          id: groundid,
        };
        getBuildGroundOne(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            // 保存待编辑的围栏ID
            that.pendingEditFenceId = fenceData.id;
            // 标记是从列表编辑进入的
            that.isEditFromList = true;
            
            // 设置当前楼层信息
            that.currentGroundInfo = {
              id: res.data.id,
              groundid: res.data.id,
              ground: res.data.ground,
              buildid: res.data.buildid,
              buildingId: res.data.buildid,
              maptype: res.data.maptype,
              filename: res.data.filename,
              filetype: res.data.filetype,
              appname: res.data.appname,
              mapkey: res.data.mapkey,
              projectid: that.$store.state.intoProjectid,
              length: res.data.length,
              width: res.data.width,
            };
            that.iconSrc =
              that.$store.state.intoProjectType == 1
                ? "../../../static/beacon.png"
                : "../../../static/gateway.png";
            
            // 打开室内地图弹框
            that.showIndoorMapDialog = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }).catch((error) => {
          console.error("获取楼层信息失败:", error);
          that.$message({
            message: "获取楼层信息失败",
            type: "error",
          });
        });
      }
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
      getFenceManageAndPointListByPage(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list || [];
          that.total = res.data.size || 0;
        }
      });
    },
    // 获取楼层显示文本
    getFloorDisplay(row) {
      if (!row.groundid || row.groundid === 0) {
        return this.$store.state.i18n == "zh" ? "室外" : "Outdoor";
      }
      
      // 直接从接口返回的数据中获取楼栋和楼层信息
      var building = row.building || '';
      var groundname = row.groundname || row.ground || '';
      
      if (building && groundname) {
        return building + '-' + groundname;
      } else if (building) {
        return building;
      } else if (groundname) {
        return groundname;
      }
      
      return '';
    },
    // Element Plus 开关只认 modelValue；并兼容接口可能返回字符串/数字
    isFenceFlagOn(flag) {
      return flag === true || flag === "true" || flag === 1 || flag === "1";
    },
    // 处理电子围栏开启/关闭状态切换
    handleFenceFlagChange(row, value) {
      var that = this;
      
      // 设置更新中状态，防止重复点击
      row['updating'] = true;
      
      // 构建请求数据
      var data = {
        id: row.id,
        flag: !!value, // true为开启，false为关闭
      };
      
      // 调用接口
      updateFenceManage(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          // 清除更新中状态
          row['updating'] = false;
          
          if (res.code == 1001) {
            // 更新本地数据
            row.flag = !!value;
            that.$message({
              message: value 
                ? (that.$store.state.i18n == "zh" ? "已开启" : "Enabled")
                : (that.$store.state.i18n == "zh" ? "已关闭" : "Disabled"),
              type: "success",
            });
          } else {
            // 恢复原状态
            row.flag = !value;
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      ).catch((error) => {
        // 清除更新中状态
        row['updating'] = false;
        // 恢复原状态
        row.flag = !value;
        that.$message({
          message: that.$store.state.i18n == "zh" ? "操作失败" : "Operation failed",
          type: "error",
        });
        console.error("更新电子围栏状态失败:", error);
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

.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}

.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}

.querry,
.reset {
  padding: 8px 12px !important;
}

.demo-form-inline :deep(.el-form-item .el-form-item__label) {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline :deep(.el-form-item .el-form-item__content) {
  line-height: 34px;
}

.demo-form-inline :deep(.el-form-item .el-input__inner) {
  height: 34px;
  line-height: 34px;
}

.demo-form-inline :deep(.el-form-item .el-input__icon) {
  height: 34px;
  line-height: 34px;
}

.demo-form-inline :deep(.el-form-item .el-range-separator) {
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
.fence :deep(.el-dialog) {
  margin-top: 5vh !important;
}
.indoorMapDialog :deep(.el-dialog) {
  margin-top: 2vh !important;
  margin-left: auto !important;
  margin-right: auto !important;
  display: flex !important;
  flex-direction: column !important;
  width: 90% !important;
  max-width: none !important;
}
.indoorMapDialog :deep(.el-dialog__wrapper) {
  overflow: hidden !important;
}
.indoorMapDialog :deep(.el-dialog__body) {
  padding: 0 !important;
  overflow: hidden !important;
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  height: 80vh !important;
  min-height: 600px !important;
  width: 100% !important;
}
.indoor-map-container {
  width: 100% !important;
  height: 80vh !important;
  position: relative;
  min-height: 600px !important;
  flex: 1;
  overflow: hidden;
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
}
.map-container-2d {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 !important;
  padding: 0 !important;
}
.mapContent {
  width: 100%;
  height: 100%;
  position: relative;
}
.mapContent3D {
  margin-right: 0;
}
.map-loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  z-index: 10;
}
#fengMap {
  width: 90%;
  height: 78%;
  display: flex;
  position: absolute;
  top: 0;
}
.searchArrange {
  width: 100%;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.indoor-map-container {
  width: 100%;
  height: calc(100vh - 120px);
  position: relative;
}

/* 室外围栏弹框：名称 / 颜色 / 操作同一行，间距统一 */
.fence-map-form {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  white-space: nowrap;
  margin-bottom: 8px;
}
.fence-map-form > .el-form-item {
  width: auto !important;
  margin: 0 !important;
  flex: 0 0 auto;
}
.fence-map-form :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  padding: 0 6px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-start !important;
  text-align: left !important;
  line-height: 32px;
}
.fence-map-form :deep(.el-form-item__content) {
  margin-left: 0 !important;
}
.fence-name-color-item {
  flex: 0 0 auto !important;
}
.fence-name-color-item :deep(.el-form-item__content) {
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center;
  width: auto !important;
  flex: 0 0 auto !important;
  gap: 0 !important;
}
.fence-name-color {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
  width: auto;
  min-width: 0;
}
.fence-name-color .fence-name-input {
  flex: 0 0 180px;
  width: 180px !important;
  min-width: 180px;
  max-width: 180px;
  display: inline-flex !important;
  margin: 0 !important;
}
.fence-name-color :deep(.el-input__wrapper) {
  width: 100%;
}
.fence-name-color :deep(.el-button) {
  margin: 0 !important;
  flex: 0 0 auto;
}
.fence-color-input {
  flex: 0 0 40px;
  width: 40px;
  height: 30px;
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}
</style>
<style>
/* 右键菜单按钮样式（参考Arrange3dMap） */
.BUTTON {
  background: #f1f5f7 !important;
  width: 100%;
  text-align: left;
  border: none;
  color: black;
}
.BUTTON:hover {
  background: skyblue !important;
  color: white;
}
.DELETE:hover {
  background-color: rgb(196, 27, 27) !important;
  color: white;
}
.threecontent :deep(li) {
  margin-top: 5px;
}
#fengMap >>> .hiddenclock {
  display: none;
}

.terminal-filter-flow {
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px 16px;
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 16px;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow > .terminal-filter-form > .el-form-item,
.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  text-align: right !important;
  line-height: 32px;
  box-sizing: border-box;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow.is-en .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input),
.terminal-filter-flow .terminal-filter-item :deep(.el-select),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  float: none !important;
  margin: 0 !important;
  flex: none !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--datetimerange) {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-select__wrapper) {
  width: 100% !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  order: 999;
}
.terminal-toolbar-row {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
  width: auto !important;
  margin: 0 !important;
}
.terminal-toolbar-row > *,
.terminal-toolbar-row :deep(.el-button),
.terminal-toolbar-row :deep(.el-dropdown) {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
.terminal-filter-more {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  color: #409eff;
  margin: 0 !important;
}
.query,
.reset,
.add,
.addBeacon {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 1 !important;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row .el-button,
.terminal-toolbar-row > .el-dropdown .el-button,
.terminal-toolbar-item .el-button,
.search-actions .el-button {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

</style>

<style>
.terminal-filter-flow {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px 16px !important;
  margin-bottom: 16px !important;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item {
  margin: 0 !important;
  width: auto !important;
  flex: 0 0 auto !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow.is-en .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__content {
  margin-left: 0 !important;
}
.terminal-filter-flow .terminal-filter-item .el-input,
.terminal-filter-flow .terminal-filter-item .el-select {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  margin: 0 !important;
  float: none !important;
}
.terminal-filter-flow .terminal-filter-item .el-date-editor.el-input__wrapper,
.terminal-filter-flow .terminal-filter-item .el-date-editor--datetimerange {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-toolbar-row {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.terminal-toolbar-row > .el-button,
.terminal-toolbar-row > .el-dropdown,
.terminal-toolbar-row > .terminal-filter-more {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  order: 999;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row .el-button,
.terminal-toolbar-row > .el-dropdown .el-button,
.terminal-toolbar-item .el-button,
.search-actions .el-button {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

</style>

