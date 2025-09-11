<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height:100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Project /></el-aside>
        <el-main>
          <div class="project_input" style="display: flex">
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
                $t("Breadcrumb.Floormanagement")
              }}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-form
              :model="searchList"
              class="demo-form-inline"
              style="display: flex; white-space: nowrap; margin-left: 0"
            >
              <el-form-item
                :label="$t('LocationIndoorHis.Building')"
                style="display: flex; margin-right: 2%"
              >
                <el-select
                  v-model="searchList.buildid"
                  clearable
                  filterable
                  @change="selectGround"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in buildingList"
                    :key="item.id"
                    :label="item.building"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('LocationIndoorHis.floor')"
                style="display: flex; margin-right: 2%"
              >
                <el-select
                  v-model="searchList.ground"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in groundList"
                    :key="item.id"
                    :label="item.ground"
                    :value="item.ground"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('floormanagement.Floornumber')"
                style="display: flex; margin-right: 2%"
              >
                <el-input v-model="searchList.groundid"></el-input>
              </el-form-item>
              <el-form-item style="display: flex; margin-right: 2%">
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("beacon.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("beacon.reset")
                }}</el-button>
                <el-button type="primary" class="add" @click="addBuildings()">{{
                  $t("car.add")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 展示 -->
          <div class="content_project">
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
            >
              <el-table-column
                property="building"
                :label="$t('inspection.building')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>

              <el-table-column
                property="ground"
                :label="$t('inspection.floor')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="id"
                :label="$t('floormanagement.floornumber')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>

              <el-table-column
                property="mapname"
                :label="$t('floormanagement.mapname')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <!-- 正向项目 -->
              <el-table-column
                property="bnum"
                :label="$t('floormanagement.EquipmentQuantity')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 1"
              ></el-table-column>
              <el-table-column
                property="bclocknum"
                :label="$t('floormanagement.Numberofpunchpoints')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 1"
              ></el-table-column>
              <el-table-column
                property="balarmnum"
                :label="$t('floormanagement.Numberofalarmdevices')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 1"
              ></el-table-column>
              <!-- 反向项目 -->
              <el-table-column
                property="gwnum"
                :label="$t('floormanagement.EquipmentQuantity')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 2"
              ></el-table-column>
              <el-table-column
                property="gwclocknum"
                :label="$t('floormanagement.Numberofpunchpoints')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 2"
              ></el-table-column>
              <el-table-column
                property="gwalarmnum"
                :label="$t('floormanagement.Numberofalarmdevices')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 2"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('floormanagement.Remark')"
                show-overflow-tooltip
                min-width="105"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('floormanagement.operate')"
                width="170"
                align="center"
              >
                <template slot-scope="scope">
                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-button type="primary" size="mini">
                      {{ $t("myorder.operate")
                      }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu
                      slot="dropdown"
                      style="background-color: rgb(219, 222, 231)"
                    >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          type="primary"
                          size="mini"
                          class="editss"
                          @click="projectEdit(scope.$index, tableData)"
                          >{{ $t("myorder.edit") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          type="danger"
                          size="mini"
                          class="delss"
                          @click="projectDele(scope.$index)"
                          >{{ $t("myorder.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button
                    type="primary"
                    size="mini"
                    class="edits"
                    @click="arrangeMap(scope.$index, scope)"
                    >{{ $t("floormanagement.arrangement") }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!--分页效果-->
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
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import host from "../../host";
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";

import {
  getBuildGroundList,
  getGround,
  getBuildingByProjectid
} from "../../axios/api";
export default {
  components: {
    Menu,
    Project,
    basecard
  },
  name: "Building3D",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      superId: this.$store.state.userInfo.superid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      intoProjectName: this.$store.state.intoProjectName,
      intoProjectid: this.$store.state.intoProjectid,
      intoProjectType: this.$store.state.intoProjectType,
      searchList: {
        projectid: this.$store.state.intoProjectid,
        mapid: "",
        buildid: "",
        ground: "",
        groundid: "",
        page: 1,
        count: 20
      },
      tableData: [],
      currentPage1: 1,
      total: 0,
      pageCount: 20,

      buildingList: "", //楼栋下拉框
      groundList: "" //楼层下拉框
    };
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getBuildingLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getBuildingLists();
    },
    //查询
    searchInfo() {},
    //重置，刷新
    clearBtn() {},
    //添加
    addBuildings() {},
    //编辑
    projectEdit() {},
    //删除
    projectDele() {},
    //布置
    arrangeMap() {},
    //获取楼栋号的下拉框
    getBuildings() {
      var that = this;
      let data = {
        projectid: this.$store.state.intoProjectid
      };
      getBuildingByProjectid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {
        if (res.code == 1001) {
          that.buildingList = res.data;
        }
      });
    },
    //选择楼栋获取楼层下拉框
    selectGround(event) {
      var that = this;
      let data = {
        buildid: event
      };
      getGround(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        res => {
          if (res.code == 1001) {
            that.groundList = res.data;
          }
        }
      );
    },
    //获取建筑信息
    getBuildingLists() {
      var that = this;
      getBuildGroundList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
        }
      });
    }
  },
  beforeMount() {
    this.getBuildingLists();
    this.getBuildings();
  }
};
</script>

<style scoped>
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
  margin-top: 50px !important;
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
.reset,
.add {
  padding: 8px 12px !important;
}
.editss:hover {
  background-color: rgb(25, 86, 201);
}
.delss:hover {
  background-color: rgb(196, 27, 27);
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
.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}
</style>
