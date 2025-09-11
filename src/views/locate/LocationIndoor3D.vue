<template>
  <div class="content">
    <div class="inputContent">
      <el-form
        class="demo-form-inline"
        style="display: flex; white-space: nowrap; margin-left: 1%"
        :model="searchList"
      >
        <el-form-item
          :label="$t('staffmanagement.username1')"
          style="display: flex; margin-left: 1%; margin-right: 2%"
        ></el-form-item>
      </el-form>
    </div>
    <fullscreen ref="fullscreen" @change="fullscreenChange">
      <div :class="fullscreen ? 'fullscreen_containers' : 'containers'">
        <div class="selectBuildGround">
          <!-- 楼栋选择 -->
          <div class="selectBuild">
            <el-select
              v-model="isactive"
              @change="getGroundLists(isactive)"
              style="width: 180px"
              :popper-append-to-body="false"
              :placeholder="$t('terminal.choose')"
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

        <div class="mapContent">
          <!-- <div id="fengMap"></div> -->
        </div>
      </div>
    </fullscreen>
    <div id="fengMap"></div>
  </div>
</template>

<script>
import fengmap from "fengmap/build/fengmap.map.min";
import "fengmap/build/fengmap.plugin.ui.min";
import "fengmap/build/fengmap.plugin.markers.min";
import "fengmap/build/toolBarStyle.css";
import host from "../../host";
import Fullscreen from "vue-fullscreen/src/component.vue";

import { getBuildingByProjectid, getAssetName } from "../../axios/api";

export default {
  components: { Fullscreen },
  name: "LocationIndoor3D",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      intoProjectName: this.$store.state.intoProjectName,
      intoProjectid: this.$store.state.intoProjectid,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      searchList: {},
      fullscreen: false,
      isactive: "",
      buildings: "", //所有楼栋

      //地图相关
      changemap: true,
      map: null,
      fmapId: "",
      scrollFloorControl: "",
      layer: null,
      setNewMarker: true, //标注
      popMarker: null, //信息框
      popMarkerList: [], //地图上所有的信息框
      uuid: 1,
    };
  },
  methods: {
    //全屏
    toggle() {
      // if(!this.fullscreen) {
      //   this.fullMap()
      // }
      this.$refs["fullscreen"].toggle();
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
    },

    //获取楼层
    getGroundLists(val) {
      var that = this;
      if (this.map) {
        that.map.dispose();
        that.map = null;
        if (that.changemap) {
          that.fmapId = "1377110180142047234";
        } else {
          that.fmapId = "1375048284114743298";
        }
        that.changemap = !that.changemap;
        that.onmap();
      }
    },
    //获取楼栋
    getBuildingByProjectids() {
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
          that.buildings = res.data;
          that.fmapId = "1375048284114743298";
          that.onmap();
        }
      });
    },
    onmap() {
      var that = this;
      var mapOpation = {
        container: document.getElementById("fengMap"),
        focusAlphaMode: true, //是否对不可见图层启用透明设置，默认true
        focusAlpha: 0.1,
        appName: "地图测试",
        key: "5c73116e8ab887fb99cf42bf0541407f",
        defaultControlsPose: 0, //角度值
        // mapURL: "/data/",
        // themeURL: "/data/theme/",
        modelSelectedEffect: false, //支持单击模型高亮，false为单击时模型不高亮
        defaultViewMode: fengmap.FMViewMode.MODE_2D, //设置地图2d显示
      };

      this.map = new fengmap.FMMap(mapOpation);
      this.map.openMapById(this.fmapId, function (error) {
        // 忽略错误处理以保持现有行为
      });
      this.map.on("loadComplete", function () {
        console.log("地图加载完成");
        // that.map.gestureEnableController['enableMapIncline'] = false;
        // that.map.gestureEnableController['enableMapRotate'] = false;
        that.loadScrollFloorCtrl();
      });
      // 聚焦楼层改变事件
      this.map.on("focusGroundIDChanged", function () {
        // 楼层改变事件占位，避免空块
      });
      //鼠标左右键点击事件
      this.map.on("mapClickNode", function (event) {
        if (!event.nodeType) {
          // 占位：无 nodeType
        }
        if (event.nodeType == 31) {
          that.setNewMarker = false;
          that.addPopInfoWindow(event.target);
        } else if (event.nodeType == 4) {
          //鼠标左右键点击事件
          var buttonType = event.domEvent.button;
          if (buttonType === 0) {
            that.$message({
              message: event.mapCoord,
              type: "warning",
            });
            if (that.setNewMarker) {
              var coord2 = that.map.getRotationCoord(
                event.eventInfo.coord.x,
                event.eventInfo.coord.y
              );
              //封装model对象
              var target = {
                mapCoord: { coord2: coord2 },
                groupID: that.map.focusGroupID,
                uuida: 123,
              };
              //添加marker
              that.addMarker(target);
            }
          } else if (buttonType === 2) {
            that.$message({
              message: this.$t("tet.Rightclick"),
              type: "warning",
            });
          }
        }
      });
    },
    addMarker(model) {
      var coord = model.mapCoord.coord2;
      var group = this.map.getFMGroup(model.groupID);
      this.layer = group.getOrCreateLayer("imageMarker");
      var im = new fengmap.FMImageMarker({
        x: coord.x,
        y: coord.y,
        height: 2,
        //设置图片路径
        url: "../../../static/sos.png",
        //设置图片显示尺寸
        size: 32,
        callback: function () {
          //imageMarker不参与避让
          im.avoid(false);
          im.alwaysShow();
        },
      });

      //图标添加自定义属性(绑定值)
      // im.selfAttr = "deveui:"+"123123,appkey:"+"qweqwewq";
      im.selfAttr = {
        deveui: 123,
        appkey: 1231231231,
        ten: 1232131231,
        uuid: this.uuid,
      };
      this.layer.addMarker(im);
      this.uuid += 1;
    },
    //信息框
    addPopInfoWindow(marker) {
      var that = this;
      if (marker) {
        //添加绑定marker信息窗
        var ctlOpt = {
          //设置弹框的宽度
          width: 200,
          //设置弹框的高度px
          height: 100,
          //设置弹框的内容，文本或html页面元素
          content: ` <div style='text-align:left'>
          <p>deveui: ${marker.selfAttr.deveui}   </p>
          <p>appkey: ${marker.selfAttr.appkey}   </p>
          <p>ten: ${marker.selfAttr.ten}   </p>
          <p>uuid: ${marker.selfAttr.uuid}   </p>
          </div>`,
          //关闭回调函数
          closeCallBack: function (e) {
            //信息窗点击关闭操作
            that.setNewMarker = true;
            for (let i = 0; i < that.popMarkerList.length; i++) {
              if (
                e.marker.selfAttr.uuid ==
                that.popMarkerList[i].marker.selfAttr.uuid
              ) {
                that.popMarkerList.splice(i, 1);
              }
            }
          },
        };
        //添加弹框到地图上，绑定marker
        // var popMarker = new fengmap.FMPopInfoWindow(this.map, ctlOpt, marker);
        this.popMarker = new fengmap.FMPopInfoWindow(this.map, ctlOpt, marker);
        this.popMarkerList.push(this.popMarker);
        //popMarker.close(); 关闭信息窗
      }
    },
    //加载滚动楼层控制
    loadScrollFloorCtrl() {
      var that = this;
      var scrollFloorCtlOpt = {
        position: fengmap.FMControlPosition.RIGHT_TOP,
        //初始楼层按钮显示个数配置。默认显示5层,其他的隐藏，可滚动查看
        // showBtnCount: 6,
        //初始是否是多层显示，默认单层显示false
        allLayer: false,
        //是否显示多层/单层切换按钮
        needAllLayerBtn: false,
        offset: {
          x: -20,
          y: 20,
        },
        // imgURL: '../../static/1.png',
      };
      this.scrollFloorControl = new fengmap.FMScrollGroupsControl(
        this.map,
        scrollFloorCtlOpt
      );

      this.scrollFloorControl.onChange(function (groups, allLayer) {
        // that.map.viewMode = fengmap.FMViewMode.MODE_2D;//切换地图2维3维
        that.map.viewMode = fengmap.FMViewMode.MODE_3D; //切换地图2维3维
        //切换楼层删除所有信息弹框
        for (let i = that.popMarkerList.length - 1; i > -1; i--) {
          that.popMarkerList[i].close();
        }
        that.popMarkerList = [];
      });
      //切换单、多层方法，changeGroupsSelect(ture表示多层/false表示单层)
      // this.scrollFloorControl.changeGroupsSelect(true);
    },
  },
  beforeMount() {
    this.getBuildingByProjectids();
  },
};
</script>

<style scoped>
#fengMap {
  width: 80%;
  position: absolute;
  height: 100%;
}
.selectGround >>> .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.selectBuild >>> .el-scrollbar__wrap {
  overflow-x: hidden !important;
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
li {
  list-style: none;
  cursor: pointer;
}
.selectBuildGround {
  /* position: absolute; */
  /* display: flex; */
  margin-left: 0%;
  margin-right: 0;
}

.mapConent {
  /* position: absolute; */
  /* margin-left: 250px; */
  display: flex;
  justify-content: flex-start;
  /* width: 70%; */
}
.allmap {
  /* margin: 0 auto;
  width: 100%;
  height: 700px;
  margin-left: 80px;
  margin-right: 80px; */
}

.selectGround {
  margin-left: 20px;
}
.addclass {
  background-color: #409eff !important ;
  color: white;
  transition: all 0.3s;
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
#popups {
  /* height: 300px; */
  display: block;
}

#popup-contents {
  background: #fff;
  padding: 3px 10px 3px 10px;
}
.divider {
  margin: 5px 0 !important;
}

#popup-contents li {
  list-style: none;
  text-align: left;
}

#popup-contents li:first-of-type {
  margin-top: 10px;
}

#popup-contents li:last-of-type {
  margin-bottom: 5px;
}

a {
  text-decoration: none;
}

.statistics {
  margin-left: 2%;
}
.statistics >>> .el-table tr {
  background-color: #f5f7fa !important;
}
.buildings-item li {
  background-color: #fff;
  border-bottom: 1px #efefef solid;
}
.buildings-item:hover li {
  background-color: #f2f2f2;
}
.el-form-item .el-button {
  margin-left: 4px !important;
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
.containers {
  display: flex;
}
.fullscreen_containers {
  display: flex;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background-color: white; */
}
.fullscreen_containers .selectBuildGround {
  margin-left: auto !important;
}
.fullscreen_containers .mapConent .allmap {
  width: 80vw !important;
  height: 80vh !important;
}
/* .containers .mapConent .allmap {
  width: 800px  !important;
  height: auto  !important;
} */
.fullscreen {
  background-color: #fff !important;
}
/* background-color: #f5f7fa !important; */
.statistics {
  overflow-x: hidden;
}
>>> .el-select-dropdown.el-popper {
  top: 39px !important;
  text-align: left;
}
>>> .el-select-dropdown__wrap.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
</style>
