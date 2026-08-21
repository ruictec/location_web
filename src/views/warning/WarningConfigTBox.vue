<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
      <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
      {{ $t("warning.Vehiclewarning") }}
    </div>
    <div class="content">
      <el-container>
        <el-main>
          <div class="warning_input terminal-filter-flow" :class="filterLangClass">
            <el-form class="demo-form-inline terminal-filter-form">
              <el-form-item
                :label="$t('warning.AlertType')"
               class="terminal-filter-item">
                <el-select
                  v-model="searchList.type"
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
              <el-form-item class="terminal-toolbar-item">
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
                :label="$t('warning.AlertType1')"
                show-overflow-tooltip
                align="center"
              >
                <template #default="scope">
                  {{ formatAlertType(scope.row) }}
                </template>
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
                <template #default="scope">
                  <el-popover
                    trigger="hover"
                    placement="bottom"
                  >
                    <p>{{ $t("tet.tet2") }}</p>
                    <template #reference><div class="name-wrapper">
                      <el-button text
                        @click="ShowTranches(scope.$index)"
                        size="small"
                        style="width: 60%"
                        >{{ scope.row.tranches }}</el-button>
                    </div></template>
                  </el-popover>
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
                      size="small"
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
                v-model:current-page="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                v-model:page-size="pageCount"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 添加告警设置 -->
          <el-dialog
            :title="$t('warning.title1')"
            v-model="add"
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
              <el-form-item :label="$t('warning.triggerMethod')" prop="meth" v-if="showWarnum == false">
                <el-select v-model="addData.meth" :placeholder="$t('warning.selectTriggerMethod')">
                  <el-option
                    v-for="item in methList"
                    :key="item.index"
                    :label="item.value"
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
                  @change="handleAddTrancheChange"
                >
                  <el-option
                    v-for="item in trancheLists"
                    :key="item.id"
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
                  <template #content><div>
                    <p>
                      {{ $t("warning.title2") }}
                    </p>
                  </div></template>
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
            <template #footer><div class="dialog-footer">
              <el-button @click="addCancel(addData)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" :loading="loading" @click="addTrue(addData)">{{
                $t("warning.Sure")
              }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 编辑告警设置 -->
          <el-dialog
            :title="$t('warning.title1')"
            v-model="edit"
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
              <el-form-item
                :label="$t('warning.triggerMethod')"
                v-if="showWarnum == false"
              >
                <span>{{ formatMeth(editData.meth) }}</span>
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
                  @change="handleEditTrancheChange"
                >
                  <el-option
                    v-for="item in trancheLists"
                    :key="item.id"
                    :label="item.optionname"
                    :value="item.id"
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
                  <template #content><div>
                    <p>
                      {{ $t("warning.title2") }}
                    </p>
                  </div></template>
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
            <template #footer><div class="dialog-footer">
              <el-button @click="editCancel(editData)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" :loading="loading" @click="editTrue(editData)">{{
                $t("warning.Sure")
              }}</el-button>
            </div></template>
          </el-dialog>

          <el-dialog
            :title="$t('tet.Regionaldetails')"
            v-model="showTranchesDetails"
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
                  :label="$t('LocationIndoorHis.Locationtype')"
                  show-overflow-tooltip
                  min-width="100"
                  align="center"
                >
                  <template #default="scope">
                    <span v-if="scope.row.groundid === 0 || scope.row.groundid == 0">
                      {{ $t("warningVoice.outdoorGps") }}
                    </span>
                    <span v-else>
                      {{ $t("warningVoice.indoorBle") }}
                    </span>
                  </template>
                </el-table-column>
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
  updateWarningConfig,
  getFenceManageByIds,
  getFenceManageList,
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
      addTranches: [], //添加区域集合
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
            message: this.$t("warning.pleaseSelectTriggerMethod"),
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
          value: this.$t("warning.enter"),
        },
        {
          index: 2,
          value: this.$t("warning.leave"),
        },
      ],
    };
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
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
    },
    // 处理区域选择变化
    handleTrancheChange(values, target) {
      const ids = values || [];
      const selected = this.trancheLists.filter((item) => ids.includes(item.id));
      const hasOutdoor = selected.some((item) => item.groundid === 0);
      const hasIndoor = selected.some((item) => item.groundid !== 0);

      if (hasOutdoor && hasIndoor) {
        // 混选室内和室外围栏时，保留最后选择的类型
        const lastId = ids[ids.length - 1];
        const lastItem = this.trancheLists.find((item) => item.id === lastId);
        if (lastItem) {
          const keepOutdoor = lastItem.groundid === 0;
          const filtered = selected
            .filter((item) => (item.groundid === 0) === keepOutdoor)
            .map((item) => item.id);
          this[target] = filtered;
          this.setPostypeBySelection(target, keepOutdoor);
          
          // 使用i18n翻译的提示消息
          const fenceTypeLabel = keepOutdoor 
            ? this.$t("warningVoice.outdoorGps") 
            : this.$t("warningVoice.indoorBle");
          const message = this.$t("warningVoice.cannotMixFence", { type: fenceTypeLabel });
          
          this.$message({
            message: message,
            type: "warning",
          });
        }
        return;
      }
      if (hasOutdoor) {
        this.setPostypeBySelection(target, true);
      } else if (hasIndoor) {
        this.setPostypeBySelection(target, false);
      } else {
        this.setPostypeBySelection(target, null);
      }
    },
    setPostypeBySelection(target, isOutdoor) {
      const value = isOutdoor === null ? "" : isOutdoor ? 2 : 1;
      if (target === "addTranches") {
        this.addData.postype = value;
      } else {
        this.editData.postype = value;
      }
    },
    formatMeth(meth) {
      if (!meth && meth !== 0) {
        return "-";
      }
      const item = this.methList.find((m) => m.index == meth);
      return item ? item.value : "-";
    },
    formatAlertType(row) {
      const typeName =
        this.i8n == "zh" ? row.typestr : row.entype;
      if (row.type == 4 && (row.meth || row.meth === 0)) {
        const methLabel = this.formatMeth(row.meth);
        if (methLabel !== "-") {
          return this.$t("warning.alertTypeWithTrigger", {
            type: typeName,
            meth: methLabel,
          });
        }
      }
      return typeName || "-";
    },
    handleAddTrancheChange(val) {
      this.handleTrancheChange(val, "addTranches");
    },
    handleEditTrancheChange(val) {
      this.handleTrancheChange(val, "editTranches");
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
    // 获取围栏区域（统一获取所有室内及室外电子围栏）
    getFenceManageAndPointLists() {
      var that = this;
      let data = {
        projectid: this.$store.state.intoProjectid,
      };
      getFenceManageList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          // 统一处理所有围栏数据
          that.trancheLists = res.data.map((item) => that.decorateFenceOption(item));
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 生成区域展示名称
    decorateFenceOption(item) {
      const isOutdoor = item.groundid === 0;
      const outdoorLabel = this.$t("warning.outdoor") || this.$t("warning.outdoorFence");
      const building = item.building || "";
      const ground = item.groundname || "";
      const name = item.name || "";
      return {
        ...item,
        optionname: isOutdoor ? `${outdoorLabel}-${name}` : `${building}-${ground}-${name}`,
      };
    },

    // 添加
    addWarning() {
      this.getBranchNameList();
      this.getFenceManageAndPointLists();
      this.addWorktypes = "";
      this.addTranches = [];
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
          if (!that.addData.postype) {
            that.$message({
              message: this.$t("project.Locationtype"),
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
          that.addData.tranches = that.addTranches.join(",");
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
      this.getFenceManageAndPointLists();
      this.editWorktypes = "";
      this.editTranches = [];
      this.editData.worktypes = "";
      this.editData.tranches = "";
      this.editWorktypes = this.tableData[index].worktypes.split(",");
      const trancheIds = this.tableData[index].tranches.split(",");

      this.editData.type = this.tableData[index].type;
      this.editData.postype = this.tableData[index].postype;
      if (this.editData.type == 4) {
        this.showWarnum = false;
      } else {
        this.showWarnum = true;
      }
      const meth = this.tableData[index].meth;
      this.editData.meth = meth || meth === 0 ? Number(meth) : "";
      this.editData.endtime = this.tableData[index].endtime;
      this.editData.begintime = this.tableData[index].begintime;
      this.editData.warnum = this.tableData[index].warnum;
      this.editData.memo = this.tableData[index].memo;
      this.editData.id = this.tableData[index].id;
      
      // 等待围栏数据加载完成后再设置选中的区域
      this.$nextTick(() => {
        const selectedItems = this.trancheLists.filter((item) => 
          trancheIds.includes(String(item.id))
        );
        this.editTranches = selectedItems.map((item) => item.id);
      });
      
      this.edit = true;
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

      // 直接使用选中的id数组
      that.editData.tranches = that.editTranches.join(",");
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
      getFenceManageByIds(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
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
    this.getFenceManageAndPointLists();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(this.$data.addRules, this.$options.data.call(this).addRules);
      Object.assign(this.$data.postypeList, this.$options.data.call(this).postypeList);
      // 更新触发方式列表
      this.methList = [
        {
          index: 1,
          value: this.$t("warning.enter"),
        },
        {
          index: 2,
          value: this.$t("warning.leave"),
        },
      ];
      // 重新生成区域选项的显示名称
      if (this.trancheLists && this.trancheLists.length > 0) {
        this.trancheLists = this.trancheLists.map((item) => this.decorateFenceOption(item));
      }
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
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor),
.terminal-filter-flow .terminal-filter-item :deep(.el-cascader) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  float: none !important;
  margin: 0 !important;
  flex: none !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--datetimerange),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--daterange) {
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
.terminal-toolbar-item :deep(.el-form-item__content) {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  width: auto !important;
  margin: 0 !important;
}
.terminal-toolbar-item :deep(.el-button),
.terminal-toolbar-item :deep(.el-dropdown),
.terminal-toolbar-item :deep(.el-popover__),
.terminal-toolbar-item :deep(.el-tooltip__),
.terminal-toolbar-item :deep(.el-popover),
.terminal-toolbar-item :deep(.el-tooltip) {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .query,
.terminal-filter-flow .reset,
.terminal-filter-flow .add,
.terminal.terminal-filter-flow .del,
.terminal-filter-flow .del,
.terminal-filter-flow .export,
.terminal-filter-flow .addTer,
.terminal-filter-flow .addBeacon {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 1 !important;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.terminal-toolbar-item :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}
.search-actions :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
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
.terminal-filter-flow .terminal-filter-item .el-select,
.terminal-filter-flow .terminal-filter-item .el-cascader {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  margin: 0 !important;
  float: none !important;
}
.terminal-filter-flow .terminal-filter-item .el-date-editor.el-input__wrapper,
.terminal-filter-flow .terminal-filter-item .el-date-editor--datetimerange,
.terminal-filter-flow .terminal-filter-item .el-date-editor--daterange {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  order: 999;
}
.terminal-toolbar-item .el-form-item__content {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.terminal-toolbar-item .el-button,
.terminal-toolbar-item .el-dropdown {
  margin: 0 !important;
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

