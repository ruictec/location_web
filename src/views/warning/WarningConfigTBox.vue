<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
      车辆告警
    </div>
    <div class="content">
      <el-container>
        <el-main>
          <div class="warning_input">
            <el-form class="demo-form-inline" style="display: flex; white-space: nowrap">
              <el-form-item
                :label="$t('warning.AlertType')"
                style="display: flex; width: 15%; margin-left: 2%; margin-right: 0"
              >
                <el-select
                  v-model="searchList.type"
                  style="width: 95%; float: left"
                  :placeholder="$t('warning.text3')"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: 1%">
                <el-button type="primary" class="querry" @click="searchInfo()">{{
                  $t("beacon.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("beacon.reset")
                }}</el-button>
                <el-button type="primary" class="reset" @click="addWarning()">{{
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
              style="width: 98%; text-align: center; margin-left: 2%; z-index: 1"
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
                :property="i8n == 'zh' ? 'typestr' : 'entype'"
                :label="$t('warning.AlertType1')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="worktypes"
                :label="$t('warning.vehicletype')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                :label="$t('warning.area')"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-popover
                    trigger="hover"
                    placement="bottom"
                    v-if="scope.row.postype == 1"
                  >
                    <p>{{ $t("tet.tet2") }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-button
                        @click="ShowTranches(scope.$index)"
                        type="text"
                        size="small"
                        style="width: 60%"
                        >{{ scope.row.tranches }}</el-button
                      >
                    </div>
                  </el-popover>
                  <p v-else>{{ scope.row.tranches }}</p>
                </template>
              </el-table-column>
              <el-table-column
                property="begintime"
                :label="$t('warning.Startingtime')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="endtime"
                :label="$t('warning.EndTime')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="warnum"
                :label="$t('warning.threshold')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="memo"
                :label="$t('warning.Remark')"
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
                      @click="EditWarningCommand(scope.$index)"
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
                      @click="DelWarningCommand(scope.$index)"
                      ><img src="../../../static/delete.png"
                    /></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="text-align: center; width: 100%; margin-top: 1%">
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

          <!-- 添加告警设置 -->
          <el-dialog
            :title="$t('warning.title1')"
            :visible.sync="add"
            width="30%"
            style="text-align: center"
            @close="addCancel(addData)"
          >
            <el-form
              :model="addData"
              label-width="110px"
              :rules="addRules"
              ref="addData"
              style="text-align: left"
            >
              <el-form-item :label="$t('warning.type')" prop="type">
                <el-select
                  v-model="addData.type"
                  :placeholder="$t('warning.text4')"
                  @change="changeType"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="触发方式" prop="meth" v-if="showWarnum == false">
                <el-select v-model="addData.meth" placeholder="请选择越界告警的触发方式">
                  <el-option
                    v-for="item in methList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('project.Locationtype')" prop="postype">
                <el-select
                  v-model="addData.postype"
                  :placeholder="$t('warning.text4')"
                  @change="changePosType"
                >
                  <el-option
                    v-for="item in postypeList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('warning.vehicletype1')">
                <el-select
                  v-model="addWorktypes"
                  multiple
                  :placeholder="$t('warning.text8')"
                >
                  <el-option
                    v-for="item in worktypeList"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('warning.area1')">
                <el-select
                  v-model="addTranches"
                  multiple
                  :placeholder="$t('warning.text6')"
                >
                  <el-option
                    v-for="item in trancheLists"
                    :key="item.index"
                    :label="item.optionname"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('warning.Startingtime1')">
                <el-time-picker
                  v-model="addData.begintime"
                  :placeholder="$t('warning.Startingtime')"
                  format="HH:mm"
                  value-format="HH:mm"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item :label="$t('warning.EndTime1')">
                <el-time-picker
                  v-model="addData.endtime"
                  :placeholder="$t('warning.EndTime')"
                  format="HH:mm"
                  value-format="HH:mm"
                >
                </el-time-picker>
              </el-form-item>

              <el-form-item
                :label="$t('warning.threshold1')"
                prop="warnum"
                v-if="showWarnum"
              >
                <el-input
                  v-model="addData.warnum"
                  :placeholder="$t('warning.text7')"
                ></el-input>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="
                    position: absolute;
                    font-size: 130%;
                    top: 50%;
                    transform: translateY(-50%);
                    margin-left: 5px;
                  "
                >
                  <div slot="content">
                    <p>
                      {{ $t("warning.title2") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('warning.Remark1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel(addData)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" :loading="loading" @click="addTrue(addData)">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 编辑告警设置 -->
          <el-dialog
            :title="$t('warning.title1')"
            :visible.sync="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel(editData)"
          >
            <el-form
              :model="editData"
              label-width="110px"
              :rules="addRules"
              ref="editData"
              style="text-align: left"
            >
              <el-form-item :label="$t('warning.type')" prop="type">
                <el-select
                  v-model="editData.type"
                  :placeholder="$t('warning.text4')"
                  disabled
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('project.Locationtype')" prop="postype">
                <el-select
                  v-model="editData.postype"
                  :placeholder="$t('warning.text4')"
                  disabled
                >
                  <el-option
                    v-for="item in postypeList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('warning.vehicletype1')">
                <el-select
                  v-model="editWorktypes"
                  multiple
                  :placeholder="$t('warning.text8')"
                >
                  <el-option
                    v-for="item in worktypeList"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('warning.area1')">
                <el-select
                  v-model="editTranches"
                  multiple
                  :placeholder="$t('warning.text6')"
                >
                  <el-option
                    v-for="item in trancheLists"
                    :key="item.index"
                    :label="item.optionname"
                    :value="item.building + '/' + item.groundname + '/' + item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('warning.Startingtime1')">
                <el-time-picker
                  v-model="editData.begintime"
                  :placeholder="$t('warning.Startingtime')"
                  format="HH:mm"
                  value-format="HH:mm"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item :label="$t('warning.EndTime1')">
                <el-time-picker
                  v-model="editData.endtime"
                  :placeholder="$t('warning.EndTime')"
                  format="HH:mm"
                  value-format="HH:mm"
                >
                </el-time-picker>
              </el-form-item>

              <el-form-item
                :label="$t('warning.threshold1')"
                prop="warnum"
                v-if="showWarnum"
              >
                <el-input
                  v-model="editData.warnum"
                  :placeholder="$t('warning.text7')"
                ></el-input>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="
                    position: absolute;
                    font-size: 130%;
                    top: 50%;
                    transform: translateY(-50%);
                    margin-left: 5px;
                  "
                >
                  <div slot="content">
                    <p>
                      {{ $t("warning.title2") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('warning.Remark1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel(editData)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" :loading="loading" @click="editTrue(editData)">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>

          <el-dialog
            :title="$t('tet.Regionaldetails')"
            :visible.sync="showTranchesDetails"
            width="40%"
            style="text-align: center"
            @close="closeAction"
          >
            <div style="padding-bottom: 3%">
              <el-table :data="tranchesDetails" border max-height="660">
                <el-table-column
                  property="id"
                  :label="$t('tet.Areanumber')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                ></el-table-column>

                <el-table-column
                  property="name"
                  :label="$t('tet.region')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                ></el-table-column>
                <el-table-column
                  property="building"
                  :label="$t('tet.Building')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                ></el-table-column>
                <el-table-column
                  property="groundname"
                  :label="$t('tet.floor')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                ></el-table-column>
              </el-table>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Data from "../../components/data/data";
import util from "../../common/util";
import {
  getWarningConfigList,
  delWarningConfig,
  addWarningConfig,
  getTboxType,
  getTranche,
  updateWarningConfig,
  getTrancheByIds,
  getFenceManageAndPointList,
} from "../../axios/api";
export default {
  components: {
    Menu,
    Data,
  },
  name: "WarningConfigTBox",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      projectid: this.$store.state.projectid,
      delprio: this.$store.state.userInfo.delprio,
      timezone: Math.ceil(0 - new Date().getTimezoneOffset() / 60),
      tableData: [],
      currentPage1: 1,
      total: 0,
      searchList: {
        projectid: this.$store.state.intoProjectid,
        page: 1,
        count: 20,
        type: "",
        cate: 2,
      },
      pageCount: 20,
      add: false,
      showWarnum: true,
      addData: {
        projectid: this.$store.state.intoProjectid,
        type: "",
        worktypes: "",
        tranches: "",
        begintime: "",
        endtime: "",
        warnum: "",
        memo: "",
        cate: 2,
        meth: "",
        postype: "",
      },

      addWorktypes: "", //添加角色集合
      addTranches: "", //添加区域集合
      worktypeList: [],
      typeval: "",
      posTypeVal: "",
      trancheListBle: [],
      trancheListGPS: [],
      trancheLists: [],
      addRules: {
        type: [
          {
            required: true,
            message: this.$t("warning.text4"),
            trigger: "change",
          },
        ],
        meth: [
          {
            required: true,
            message: "请选择触发方式",
            trigger: "change",
          },
        ],
        postype: [
          {
            required: true,
            message: this.$t("beacon.Pleasealarm"),
            trigger: "change",
          },
        ],
        warnum: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: this.$t("warning.positiveinteger"),
            trigger: "blur",
          },
        ],
      },
      edit: false,
      editWorktypes: "", //编辑角色集合
      editTranches: [], //编辑区域集合
      editTranche: "", //编辑区域集合,用来拼接
      editData: {
        projectid: this.$store.state.intoProjectid,
        type: "",
        worktypes: "",
        tranches: "",
        begintime: "",
        endtime: "",
        warnum: "",
        memo: "",
        id: "",
        cate: 2,
        postype: "",
        meth: "",
      },
      loading: false,
      tranchesDetails: [],
      showTranchesDetails: false,
      //告警类型
      typeList: [
        {
          index: 1,
          value: this.$t("warning.Detentionalarm"),
        },
        {
          index: 2,
          value: this.$t("warning.Aggregatealarm"),
        },
        {
          index: 3,
          value: this.$t("warning.Abnormalstatic"),
        },
        {
          index: 4,
          value: this.$t("warning.Passingalarm"),
        },
      ], // 告警定位类型
      postypeList: [
        {
          index: 1,
          label: this.$t("warningVoice.indoorBle"),
        },
        {
          index: 2,
          label: this.$t("warningVoice.outdoorGps"),
        },
      ],
      methList: [
        {
          index: 1,
          value: "进入",
        },
        {
          index: 2,
          value: "离开",
        },
      ],
    };
  },
  methods: {
    // 判断是否是选择越界告警和聚集告警
    changeType(val) {
      if (val == 4) {
        this.addData.warnum = "";
        this.showWarnum = false;
      } else {
        this.showWarnum = true;
      }
      this.typeval = val;
      if (this.posTypeVal == 1) {
        // 聚集告警，区域没有室外
        if (this.typeval == 2) {
          this.trancheLists = this.trancheListBle.slice(0, -1);
        } else {
          this.trancheLists = this.trancheListBle;
        }
      } else if (this.posTypeVal == 2) {
        this.trancheLists = this.trancheListGPS;
      }
    },

    // 选择告警定位类型，选择室外时需要选择围栏
    changePosType(val) {
      this.posTypeVal = val;
      if (this.edit) {
        this.editTranches = [];
      }
      if (val == 1) {
        // 聚集告警，区域没有室外
        if (this.typeval == 2) {
          this.trancheLists = this.trancheListBle.slice(0, -1);
        } else {
          this.trancheLists = this.trancheListBle;
        }
      } else if (val == 2) {
        this.trancheLists = this.trancheListGPS;
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
      var hour = date2.getHours() < 10 ? "0" + date2.getHours() : date2.getHours();

      var min = formatFunc(date2.getMinutes());
      var sec = formatFunc(date2.getSeconds());
      var dateStr = year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
      return dateStr;
    },
    //时间转换
    formatDatetime(row, colum) {
      if (row.begintime == null || row.begintime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.begintime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    formatDatetime1(row, colum) {
      if (row.endtime == null || row.endtime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.endtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getWarningLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getWarningLists();
    },
    //查询
    searchInfo() {
      var that = this;
      getWarningConfigList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
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
        type: "",
        page: 1,
        count: 20,
        cate: 2,
      };
      this.getWarningLists();
      this.getTrancheList();
    },

    //
    getBranchNameList() {
      var that = this;
      let data = {
        projectid: this.projectid,
      };
      getTboxType(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.worktypeList = res.data;
          }
        }
      );
    },
    // 获取围栏区域
    getFenceManageAndPointLists() {
      var that = this;
      let data = {
        projectid: this.$store.state.intoProjectid,
      };
      getFenceManageAndPointList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.trancheListGPS = res.data;
          that.trancheListGPS.forEach((item) => {
            item.optionname = item.name;
          });
        }
      });
    },
    //获取区域
    getTrancheList() {
      var that = this;
      let data = {
        site: false,
        projectid: this.projectid,
      };
      getTranche(data, this.tenantkey_A, this.tenantid_A, this.userName).then((res) => {
        if (res.code == 1001) {
          // that.trancheLists = res.data;
          that.trancheListBle = res.data;
          that.trancheListBle.forEach((item) => {
            if (item.building) {
              item.optionname = item.building + "/" + item.groundname + "/" + item.name;
            } else {
              item.optionname = item.name;
            }
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    // 添加
    addWarning() {
      this.getBranchNameList();
      this.getTrancheList();
      this.getFenceManageAndPointLists();
      this.addWorktypes = "";
      this.addTranches = "";
      this.addData = {
        projectid: this.$store.state.intoProjectid,
        type: "",
        worktypes: "",
        tranches: "",
        begintime: "",
        endtime: "",
        warnum: "",
        memo: "",
        cate: 2,
        meth: "",
        postype: "",
      };
      this.add = true;
      this.showWarnum = true;
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs.addData.resetFields();
    },
    addTrue(addData) {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          var that = this;
          if (that.addWorktypes.length == 0) {
            that.$message({
              message: this.$t("beacon.Pvehicletype"),
              type: "warning",
            });
            return;
          }
          if (that.addTranches.length == 0) {
            that.$message({
              message: this.$t("beacon.Pleasearea"),
              type: "warning",
            });
            return;
          }
          if (this.addData.begintime == "" || this.addData.begintime == null) {
            that.$message({
              message: this.$t("beacon.Pleasestarttime"),
              type: "warning",
            });
            return;
          }
          if (this.addData.endtime == "" || this.addData.endtime == null) {
            that.$message({
              message: this.$t("beacon.Pleaseendtime"),
              type: "warning",
            });
            return;
          }
          if (this.addData.endtime == this.addData.begintime) {
            that.$message({
              message: this.$t("beacon.Startendtime"),
              type: "warning",
            });
            return;
          }
          for (let i = 0; i < that.addWorktypes.length; i++) {
            that.addData.worktypes += that.addWorktypes[i] + ",";
          }
          that.addData.worktypes = that.addData.worktypes.slice(
            0,
            that.addData.worktypes.length - 1
          );
          if (that.addData.worktypes.length > 320) {
            that.$message({
              message: this.$t("tet.tet9"),
              type: "warning",
            });
            return;
          }
          for (let i = 0; i < that.addTranches.length; i++) {
            that.addData.tranches += that.addTranches[i] + ",";
          }
          that.addData.tranches = that.addData.tranches.slice(
            0,
            that.addData.tranches.length - 1
          );
          if (that.addData.tranches.length > 320) {
            that.$message({
              message: this.$t("tet.tet9"),
              type: "warning",
            });
            return;
          }
          that.loading = true;
          addWarningConfig(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getWarningLists();
              that.$message({
                message: that.$t("beacon.addsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs.addData.resetFields();
            } else {
              that.add = false;
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }
          });
        }
      });
    },

    // 编辑
    EditWarningCommand(index) {
      var that = this;
      this.getBranchNameList();
      this.getTrancheList();
      this.getFenceManageAndPointLists();
      this.editWorktypes = "";
      this.editTranches = [];
      this.editTranche = "";
      this.editData.worktypes = "";
      this.editData.tranches = "";
      this.editWorktypes = this.tableData[index].worktypes.split(",");
      this.editTranche = this.tableData[index].tranches.split(",");

      this.editData.type = this.tableData[index].type;
      this.editData.postype = this.tableData[index].postype;
      if (this.editData.type == 4) {
        this.showWarnum = false;
      } else {
        this.showWarnum = true;
      }
      this.editData.endtime = this.tableData[index].endtime;
      this.editData.begintime = this.tableData[index].begintime;
      this.editData.warnum = this.tableData[index].warnum;
      this.editData.memo = this.tableData[index].memo;
      this.editData.id = this.tableData[index].id;
      this.edit = true;
      let arr = [];
      if (this.editData.postype == 2) {
        this.trancheLists = this.trancheListGPS;
        this.editTranche.forEach((item) => {
          that.trancheListGPS.forEach((value) => item == value.id && arr.push(value));
        });
        arr.forEach((item) => {
          that.editTranches.push(item.building + "/" + item.groundname + "/" + item.name);
        });
      } else {
        this.editTranche.forEach((item) => {
          that.trancheListBle.forEach((value) => item == value.id && arr.push(value));
        });
        arr.forEach((item) => {
          that.editTranches.push(item.building + "/" + item.groundname + "/" + item.name);
        });
        if (this.editData.type == 2) {
          this.trancheLists = this.trancheListBle.slice(0, -1);
        } else {
          this.trancheLists = this.trancheListBle;
        }
      }
    },
    editCancel(editData) {
      this.edit = false;
      this.loading = false;
      this.$refs.editData.resetFields();
    },
    editTrue(editData) {
      var that = this;
      if (that.editWorktypes.length == 0) {
        that.$message({
          message: this.$t("beacon.Pvehicletype"),
          type: "warning",
        });
        return;
      }
      if (that.editTranches.length == 0) {
        that.$message({
          message: this.$t("beacon.Pleasearea"),
          type: "warning",
        });
        return;
      }
      if (this.editData.begintime == "" || this.editData.begintime == null) {
        that.$message({
          message: this.$t("beacon.Pleasestarttime"),
          type: "warning",
        });
        return;
      }
      if (this.editData.endtime == "" || this.editData.endtime == null) {
        that.$message({
          message: this.$t("beacon.Pleaseendtime"),
          type: "warning",
        });
        return;
      }
      if (this.editData.endtime == this.editData.begintime) {
        that.$message({
          message: this.$t("beacon.Startendtime"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < that.editWorktypes.length; i++) {
        that.editData.worktypes += that.editWorktypes[i] + ",";
      }
      that.editData.worktypes = that.editData.worktypes.slice(
        0,
        that.editData.worktypes.length - 1
      );

      //用来获取区域id集合
      let idArr = [];
      if (this.editData.postype == 2) {
        this.editTranches.forEach((item) => {
          that.trancheListGPS.forEach((value) => {
            if (item == value.building + "/" + value.groundname + "/" + value.name) {
              idArr.push(value);
            }
          });
        });
      } else {
        this.editTranches.forEach((item) => {
          that.trancheListBle.forEach((value) => {
            if (item == value.building + "/" + value.groundname + "/" + value.name) {
              idArr.push(value);
            }
          });
        });
      }

      for (let i = 0; i < idArr.length; i++) {
        that.editData.tranches += idArr[i].id + ",";
      }
      that.editData.tranches = that.editData.tranches.slice(
        0,
        that.editData.tranches.length - 1
      );
      updateWarningConfig(
        that.editData,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.edit = false;
          that.getWarningLists();
          that.$message({
            message: that.$t("beacon.editsuccess"),
            type: "success",
          });
          that.loading = false;
          that.$refs.editData.resetFields();
        } else {
          that.edit = false;
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
          that.loading = false;
        }
      });
    },
    // 显示区域详情
    ShowTranches(index) {
      var that = this;
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".action"),
      });
      let data = {
        ids: this.tableData[index].tranches,
      };
      getTrancheByIds(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.tranchesDetails = res.data;
            that.showTranchesDetails = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }

          loading.close();
        }
      );
    },
    //关闭行为回调
    closeAction() {
      this.tranchesDetails = [];
    },

    //删除
    DelWarningCommand(index) {
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
      this.$confirm(this.$t("beacon.deletemsg10"), this.$t("beacon.prompt"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id,
          };
          delWarningConfig(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
            (res) => {
              if (res.code == 1001) {
                that.getWarningLists();
                that.$message({
                  message: that.$t("warning.deletesuccess"),
                  type: "success",
                });
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            }
          );
        })
        .catch(() => {});
    },

    //刚进页面获取数据
    getWarningLists() {
      getWarningConfigList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.tableData = res.data.list;
          this.total = res.data.size;
        }
      });
    },
  },
  beforeMount() {
    this.searchList = {
      projectid: this.$store.state.intoProjectid,
      type: "",
      page: 1,
      count: 20,
      cate: 2,
    };
    this.getWarningLists();
    this.getTrancheList();
    this.getFenceManageAndPointLists();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(this.$data.addRules, this.$options.data.call(this).addRules);
      Object.assign(this.$data.postypeList, this.$options.data.call(this).postypeList);
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
</style>
