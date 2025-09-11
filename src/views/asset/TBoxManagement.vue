<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu ref="menu" />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Asset /></el-aside>

        <el-main>
          <el-form
            class="demo-form-inline"
            :model="searchList"
            style="display: flex; white-space: nowrap; margin-left: 1%"
          >
            <el-form-item
              :label="$t('car.Numberplate')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-input v-model="searchList.sn"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('car.Tagnumber')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-input
                style="width: 95%; float: left"
                v-model="searchList.maplabel"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('car.Department')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-select
                v-model="searchList.depart"
                filterable
                :placeholder="$t('car.text')"
              >
                <el-option
                  v-for="item in DepartList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item style="display: flex; margin-left: 1%; z-index: 1">
              <el-button type="primary" class="query" @click="searchTBox()">{{
                $t("car.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("car.reset")
              }}</el-button>
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
                @click="exportExcel()"
                >{{ $t("terminal.export") }}</el-button
              >
              <el-button
                type="primary"
                class="reset"
                style="margin-left: 0%"
                @click="exportExcelAll()"
                >{{ $t("terminal.exportAll") }}</el-button
              >
              <el-button type="primary" class="add" @click="addTBox()">{{
                $t("car.Addvehicle")
              }}</el-button
              ><el-button type="danger" class="add" @click="removeTBoxs()">{{
                $t("car.unbind")
              }}</el-button>
              <el-button type="primary" class="add add2" @click="goSetTBox()">{{
                $t("car.vehiclesettings")
              }}</el-button>
            </el-form-item>
          </el-form>
          <!-- </div> -->

          <!-- 展示 -->
          <div class="content_staff">
            <div class="exportContent" style="display: flex">
              <input
                id="articleImageFile"
                name="excelFile"
                type="file"
                class="x_file"
                accept=".xls,.xlsx"
                @change="importExcels"
              />
            </div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              style="
                width: 97%;
                text-align: center;
                margin-left: 2%;
                z-index: 1;
              "
              max-height="660"
              border
              highlight-current-row
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                property="sn"
                :label="$t('car.LicensePlate')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="type"
                :label="$t('car.VehicleType')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="maplabel"
                :label="$t('car.LabelNumber')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="depart"
                :label="$t('car.Department1')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('car.Remark3')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('car.Operate')"
                min-width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('car.operate')"
                      placement="top"
                    >
                      <el-button type="primary" class="icon_button">
                        <img src="../../../static/control.png" />
                      </el-button>
                    </el-tooltip>
                    <el-dropdown-menu
                      slot="dropdown"
                      style="background-color: rgb(219, 222, 231)"
                      class="selects"
                    >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="mini"
                          class="edits"
                          @click="staffEdit(scope.$index, tableData)"
                          >{{ $t("car.edit") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="TBoxDele(scope.$index)"
                          >{{ $t("car.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('car.position')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="edits icon_button"
                      @click="goLocation(scope.$index, tableData)"
                      ><img src="../../../static/location.png"
                    /></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('staffmanagement.trajectory')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="edits icon_button"
                      style="margin-left: 0"
                      @click="staffAction(scope.$index, tableData)"
                      ><img src="../../../static/trajectory2.png"
                    /></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
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

          <!-- 添加车辆 -->
          <el-dialog
            :title="$t('car.text1')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-upload
              :action="ImagePath"
              list-type="picture-card"
              :file-list="fileListAdd"
              :on-preview="handlePictureCardPreview"
              accept=".png, .jpg, .jpeg"
              :limit="1"
              ref="upload"
              :data="userIdForPic"
              :on-success="picSuccess"
              :on-error="picError"
              :headers="myHeader"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
              :on-change="handleChange"
              :on-remove="handleRemove"
            >
              <div slot="tip" class="el-upload__tip">
                {{ $t("car.text2") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="addData"
              label-width="110px"
              ref="addData"
              :rules="editRules"
              style="text-align: left; margin-top: 2%"
            >
              <el-form-item :label="$t('car.Carnumber1')" prop="sn">
                <el-input v-model="addData.sn"></el-input>
              </el-form-item>
              <el-form-item :label="$t('car.Vehicletype1')" prop="">
                <el-select
                  v-model="addData.type"
                  filterable
                  :placeholder="$t('car.text')"
                >
                  <el-option
                    v-for="item in tboxList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('car.Department2')">
                <el-select
                  v-model="addData.depart"
                  filterable
                  :placeholder="$t('car.text')"
                >
                  <el-option
                    v-for="item in DepartList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('car.Tagnumber')">
                <el-select
                  v-model="addData.maplabel"
                  clearable
                  filterable
                  :placeholder="$t('car.text')"
                >
                  <el-option
                    v-for="item in maplabelList"
                    :key="item.deveui"
                    :label="item.deveui"
                    :value="item.deveui"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('car.Remark1')">
                <el-input
                  type="textarea"
                  maxlength="255"
                  show-word-limit
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel('addData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 地图预览 -->
          <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
          <!-- 编辑 -->
          <el-dialog
            :title="$t('car.text3')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-upload
              :action="ImagePathEdit"
              list-type="picture-card"
              :file-list="fileListEdit"
              :on-preview="handlePictureCardPreviewEdit"
              accept=".png, .jpg, .jpeg"
              :limit="1"
              ref="upload"
              :data="userIdForPicEdit"
              :on-success="picSuccessEdit"
              :on-error="picErrorEdit"
              :headers="myHeaderEdit"
              :auto-upload="false"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-exceed="handleExceedEdit"
              :before-upload="beforeAvatarUploadEdit"
            >
              <div slot="tip" class="el-upload__tip">
                {{ $t("car.text2") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="editData"
              ref="editData"
              label-width="110px"
              :rules="editRules"
              style="text-align: left; margin-top: 2%"
            >
              <el-form-item :label="$t('car.Carnumber1')" prop="">
                <el-input v-model="editData.sn" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('car.Vehicletype1')" prop="">
                <el-select
                  v-model="editData.type"
                  filterable
                  :placeholder="$t('car.text')"
                >
                  <el-option
                    v-for="item in tboxList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('car.Department2')">
                <el-select
                  v-model="editData.depart"
                  filterable
                  :placeholder="$t('car.text')"
                >
                  <el-option
                    v-for="item in DepartList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('car.Tagnumber')">
                <el-select
                  v-model="editData.maplabel"
                  clearable
                  filterable
                  :placeholder="$t('car.text')"
                >
                  <el-option
                    v-for="item in maplabelList"
                    :key="item.deveui"
                    :label="item.deveui"
                    :value="item.deveui"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('car.Remark1')">
                <el-input
                  type="textarea"
                  maxlength="64"
                  show-word-limit
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(edit = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 解除分配信标 -->
          <el-dialog
            :title="$t('car.text4')"
            :visible.sync="removeTBox"
            class="edit"
            width="50%"
            style="text-align: center"
          >
            <el-table
              :data="removeDatas"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="sn"
                :label="$t('car.LicensePlate')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="type"
                :label="$t('car.VehicleType')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="maplabel"
                :label="$t('car.LabelNumber')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('car.Remark3')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(removeTBox = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="removeTrue()"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 设置车辆类型 -->
          <el-dialog
            :title="$t('car.text5')"
            :visible.sync="addAssets"
            class="edit"
            width="30%"
            style="text-align: center"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
            :append-to-body="true"
          >
            <el-radio-group size="small">
              <el-button
                type="primary"
                class="add"
                style="float: left"
                @click="addTBoxRow"
                >{{ $t("car.add") }}</el-button
              >
            </el-radio-group>
            <el-form style="text-align: center">
              <el-form-item
                style="
                  width: 75%;
                  margin-left: 16%;
                  text-align: left;
                  margin-top: 14px;
                "
                :label="$t('car.import')"
              >
                <el-select
                  v-model="currentProjectid.projectid"
                  clearable
                  filterable
                  @change="importTBox"
                  :placeholder="$t('car.title6')"
                >
                  <el-option
                    v-for="item in projectList()"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option> </el-select
                ><el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <div slot="content">
                    <p>
                      {{ $t("car.title6") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-form>
            <el-form
              label-width="80px"
              v-for="(item, index) in tboxList"
              :key="item.id"
              style="margin-top: 20px"
              class="demo-form-inline"
            >
              <el-form-item>
                <el-input
                  v-model="item.name"
                  :maxlength="i8n == 'zh' ? '12' : '30'"
                  style="float: left; width: 70%"
                  :disabled="item.id === undefined ? false : true"
                ></el-input>
                <el-button
                  type="primary"
                  size="small"
                  style="float: left; margin-left: 20px"
                  @click="
                    deleTBoxRow(index, item.id, item.name, item.tenantid, item.projectid)
                  "
                  class="del"
                  >{{ $t("car.delete") }}</el-button
                >
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-top: -10px">
              <el-button @click="addAssets = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addTBoxRowTrue()">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>
          <!-- 行为分析 -->
          <el-dialog
            :visible.sync="actions"
            width="60%"
            style="text-align: center"
            :close-on-click-modal="false"
            class="action"
            @close="closeAction"
          >
            <el-dialog
              :visible.sync="trajectory"
              width="80%"
              style="text-align: center"
              :close-on-click-modal="false"
              class="trajectory"
              append-to-body
              @close="closetrajectoryAction"
            >
              <!-- <location ref="locations" /> -->
              <Trajectory ref="trajectory" @closePopup="closePopup" />
            </el-dialog>
            <el-form
              class="demo-form-inline"
              style="
                display: flex;
                white-space: nowrap;
                margin-left: 1%;
                width: 100%;
              "
              :model="actionData"
            >
              <el-form-item
                :label="$t('car.Numberplate')"
                style="
                  display: flex;
                  margin-left: 1%;
                  margin-right: 1%;
                  width: 20%;
                "
              >
                <el-input v-model="actionData.sn"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('car.Workcardnumber')"
                style="
                  display: flex;
                  margin-left: 1%;
                  margin-right: 2%;
                  width: 30%;
                "
              >
                <el-input v-model="actionData.maplabel"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('car.time')"
                style="
                  display: flex;
                  margin-left: 1%;
                  margin-right: 0;
                  width: 40%;
                "
              >
                <el-date-picker
                  v-model="actionTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('car.to')"
                  :start-placeholder="$t('car.starttime')"
                  :end-placeholder="$t('car.endtime')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item style="margin-left: 1%; width: 20%">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchAction()"
                  >{{ $t("car.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="query"
                  @click="showTrajectory()"
                  >{{ $t("car.Viewtrack") }}</el-button
                >
              </el-form-item>
            </el-form>
            <div class="actionDetails">
              <Timeline v-for="item in actionTableData" :key="item.id">
                <!-- 室内 -->
                <TimelineItem v-if="item.postype == 1">
                  <p class="time">
                    {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
                  </p>
                  <p class="content">
                    {{ $t("LocationIndoorHis.Building") }}{{ item.building }}
                  </p>
                  <p class="content">
                    {{ $t("LocationIndoorHis.floor") }}{{ item.ground }}
                  </p>
                  <p class="content">
                    {{ $t("warning.area1") }}{{ item.tranche }}
                  </p>
                  <p class="content">
                    {{ $t("tet.Residencetime")
                    }}{{ formatSeconds(item.remaintime) }}
                  </p>
                </TimelineItem>

                <!-- 室外 -->
                <TimelineItem v-if="item.postype == 2">
                  <p class="time">
                    {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
                  </p>
                  <p class="content">
                    {{ $t("warning.area1") }}{{ item.tranche }}
                  </p>
                  <p class="content">
                    {{ $t("tet.Residencetime")
                    }}{{ formatSeconds(item.remaintime) }}
                  </p>
                </TimelineItem>
              </Timeline>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import host from "../../host";
import util from "../../common/util";
import {
  delTbox,
  getDevDeveui,
  updateTboxRemoveLable,
  getTboxList,
  getTboxByEuis,
  delTboxType,
  addTboxType,
  addTbox,
  updateTbox,
  getDevGpsOne,
  getDepartmentType,
  getTboxType,
  getMemberList,
  getProjectListByTenantid,
  getDevGpsAction,
  importTbox,
} from "../../axios/api";
import Asset from "../../components/asset/asset.vue";

import Trajectory from "../staff/trajectory.vue";
export default {
  components: {
    Menu,
    Asset,
    Trajectory,
  },
  name: "AssetManagement",
  data() {
    var carPhoneValid = (rule, value, callback) => {
      const plateNumber =
        /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
      if (plateNumber.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t("tet.tet5")));
      }
    };
    return {
      i8n: this.$store.state.i18n,
      //时间选择限制
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("staffmanagement.Lasthour1"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour3"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      projectid: this.$store.state.intoProjectid,
      loading: false,
      searchList: {
        sn: "", //车牌号
        type: "", //类型
        tenantid: "", //
        projectid: this.$store.state.projectid, //项目编号
        maplabel: "", //工卡号或信标号
        memo: "",
        page: 1,
        count: 20,
        depart: "",
      },
      assetUsername: [], //所属用户下拉框
      maplabelList: [], //标签号下拉框
      warningList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "enabled",
        },
      ],
      searchSelectPerson: [],
      tableData: [],
      pageCount: 20,
      tenantidData: [],
      currentPage1: 1,
      total: 0,
      add: false,
      addData: {
        sn: "", //
        type: "", //
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        maplabel: "", //
        memo: "", //
        depart: "",
      },
      ProjectTye: "",
      edit: false,
      editData: {
        id: "",
        sn: "", //
        type: "", //
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        maplabel: "", //
        memo: "", //
        filename: "",
        depart: "",
      },
      editRules: {
        // sn: [{ required: true, validator: carPhoneValid, trigger: blur }],
        sn: [
          {
            required: true,
            message: this.$t("asset.licenseplatenumber"),
            trigger: blur,
          },
        ],
      },
      deleId: "",
      deleTenantid: "",

      multipleSelection: [],
      removeTBox: false,
      removeDatas: [],
      removeTBoxDatas: {
        ids: [],
      },

      DepartList: [],
      haveImage: false, //判断添加的资产有没有图片
      delImage: false, //判断资产是否要删除图片
      ImagePath: host.host + "user/addTboxMapFile",
      ImagePathEdit: host.host + "user/updateTboxMapFile",
      fileListAdd: [],
      fileListEdit: [],
      dialogImageUrl: "",
      dialogVisible: false,
      userIdForPic: {}, //添加图片携带参数
      userIdForPicEdit: {}, //编辑图片携带参数
      myHeader: {
        tenantkey: this.$store.state.userInfo.tenantkey,
        ts: new Date().getTime(),
        tenantid: this.$store.state.userInfo.tenantid,
        userName: this.$store.state.userInfo.username,
      },
      myHeaderEdit: {
        tenantkey: this.$store.state.userInfo.tenantkey,
        ts: new Date().getTime(),
        tenantid: this.$store.state.userInfo.tenantid,
        userName: this.$store.state.userInfo.username,
      },
      projectTable: [],
      currentProjectid: {
        projectid: "",
      },
      trajectory: false,
      addAssets: false,
      tboxList: [],
      actions: false,
      actionData: {
        projectid: "",
        maplabel: "",
        sn: "",
      },
      actionTableData: [],
      actionTableDataArr: [],
      actionTime: "",
      isSearchAction: false,
      headlistdata: "",
    };
  },
  methods: {
    // 导入
    importExcel() {
      document.getElementById("articleImageFile").click(); //触发importExcels
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
            tenantid: that.tenantid_A,
            projectid: that.$store.state.projectid,
          };

          importTbox(
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
              $("#articleImageFile").val("");
              that.getTboxLists();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              $("#articleImageFile").val("");
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

    // 将对应的中文key转化为自己想要的英文key
    dateTransition(outdata) {
      var that = this;
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case that.$t("car.LicensePlate"):
              obj["sn"] = outdata[i][key];
              break;
            case that.$t("car.VehicleType"):
              obj["type"] = outdata[i][key];
              break;
            case that.$t("car.LabelNumber"):
              obj["maplabel"] = outdata[i][key];
              break;
            case that.$t("car.Department1"):
              obj["depart"] = outdata[i][key];
              break;
            case that.$t("car.Remark3"):
              obj["memo"] = outdata[i][key];
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
    exportExcel() {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: that.$t("car.selectCar"),
          type: "warning",
        });
        return;
      }
      this.headlistdata = [
        {
          msg: that.$t("car.LicensePlate"),
          value: "sn",
        },
        {
          msg: that.$t("car.VehicleType"),
          value: "type",
        },
        {
          msg: that.$t("car.LabelNumber"),
          value: "maplabel",
        },
        {
          msg: that.$t("car.Department1"),
          value: "depart",
        },
        {
          msg: that.$t("car.Remark3"),
          value: "memo",
        },
      ];

      that.export2Excel(this.multipleSelection);
    },
    export2Excel(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = ["sn", "type", "maplabel", "depart", "memo"];

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
        export_json_to_excel(tHeader, data, that.$t("list.Vehiclemanagement"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    exportExcelAll() {
      var that = this;
      this.headlistdata = [
        {
          msg: that.$t("car.LicensePlate"),
          value: "sn",
        },
        {
          msg: that.$t("car.VehicleType"),
          value: "type",
        },
        {
          msg: that.$t("car.LabelNumber"),
          value: "maplabel",
        },
        {
          msg: that.$t("car.Department1"),
          value: "depart",
        },
        {
          msg: that.$t("car.Remark3"),
          value: "memo",
        },
      ];
      let data = {
        sn: "", //车牌号
        type: "", //类型
        tenantid: "", //
        projectid: this.$store.state.projectid, //项目编号
        maplabel: "", //工卡号或信标号
        memo: "",
        page: "",
        count: "",
        depart: "",
      };
      getTboxList(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.export2Excel(res.data.list);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    showTrajectory() {
      this.isSearchAction = true;
      var that = this;
      if (this.actionTableData.length === 0) {
        // this.$message({
        //   message: "请先查询行为数据",
        //   type: "warning",
        // });
        that.searchAction();
        return;
      }

      // 将行为轨迹数据根据楼层分为不同的数组
      this.actionTableDataArr = [];
      let newArr = [];
      let list = JSON.parse(JSON.stringify(this.actionTableData));
      let node = list[0];
      list.forEach((item, i) => {
        if (item.groundid === node.groundid) {
          newArr.push(item);
        } else {
          that.actionTableDataArr.push(newArr);
          node = item;
          newArr = [];
          newArr.push(item);
        }
        if (i == list.length - 1) {
          that.actionTableDataArr.push(newArr);
        }
      });

      if (that.actionTableDataArr.length > 0) {
        let begintime, endtime;
        if (this.actionTime == null || this.actionTime.length == 0) {
          let timee = new Date();
          timee.setHours(0, 0, 0, 0);
          begintime = timee.getTime() / 1000;
          endtime = Date.parse(new Date()) / 1000;
        } else {
          begintime = Date.parse(that.actionTime[0]) / 1000;
          endtime = Date.parse(that.actionTime[1]) / 1000;
        }
        this.trajectory = true;
        this.isSearchAction = false;
        this.$nextTick(() => {
          this.$refs.trajectory.search(
            that.actionTableDataArr,
            begintime,
            endtime,
            4
          );
        });
      }
    },

    // 当子区域设置有误时，关闭轨迹弹框
    closePopup(data) {
      this.trajectory = false;
    },
    //行为分析
    staffAction(index) {
      var that = this;
      this.actionData.projectid = this.tableData[index].projectid;
      this.actionData.maplabel = this.tableData[index].maplabel;
      this.actionData.sn = this.tableData[index].sn;
      if (
        this.tableData[index].maplabel == "" ||
        this.tableData[index].maplabel == null
      ) {
        this.$message({
          message: this.$t("asset.vehiclebindlabel"),
          type: "warning",
        });
        return;
      }
      this.actions = true;
    },

    searchAction() {
      var that = this;
      let data = {
        projectid: this.actionData.projectid,
        deveui: this.actionData.maplabel,
        username: this.actionData.sn,
        begintime: "",
        endtime: "",
        devtype: 4,
        timezone: this.$store.state.intoProjectTimezone,
      };
      if (this.actionTime) {
        // 判断是否为24小时间隔
        if (
          this.actionTime[1].getTime() - this.actionTime[0].getTime() >
          86400000
        ) {
          that.$message({
            message: this.$t("asset.exceedhours"),
            type: "warning",
          });
          return;
        }
        let begingTime = that.actionTime[0];
        let endTime = that.actionTime[1];

        begingTime =
          !begingTime || begingTime == ""
            ? ""
            : util.formatDate.format(
                new Date(begingTime),
                "yyyy-MM-dd hh:mm:ss"
              );
        endTime =
          !endTime || endTime == ""
            ? ""
            : util.formatDate.format(new Date(endTime), "yyyy-MM-dd hh:mm:ss");

        if (begingTime.length > 0 && endTime.length > 0) {
          begingTime = Date.parse(new Date(begingTime)) / 1000;
          endTime = Date.parse(new Date(endTime)) / 1000;
        }
        data.begintime = begingTime;
        data.endtime = endTime;
      } else {
        let timee = new Date();
        timee.setHours(0, 0, 0, 0);
        data.begintime = timee.getTime() / 1000;
        data.endtime = Date.parse(new Date()) / 1000;
      }
      if (
        this.actionData.maplabel == "" ||
        this.actionData.maplabel == null ||
        this.actionData.sn == "" ||
        this.actionData.sn == null
      ) {
        this.$message({
          message: this.$t("asset.Licensesametime"),
          type: "warning",
        });
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".action"),
      });
      getDevGpsAction(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.tranchelist.length == 0) {
            that.$message({
              message: that.$t("buildingmanagement.nodata"),
              type: "warning",
            });
            that.actionTableData = [];
            loading.close();
            return;
          } else {
            that.actionTableData = res.data.tranchelist.reverse();
          }
          for (let i = 0; i < that.actionTableData.length; i++) {
            that.actionTableData[i].gpstime = that.formatDatetime(
              that.actionTableData[i].gpstime
            );
            // that.actionTableData[i].remaintime = that.formatSeconds(
            //   that.actionTableData[i].remaintime
            // );
          }
          if (this.isSearchAction == true) {
            that.showTrajectory();
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        loading.close();
      });
    },
    //关闭行为回调
    closeAction() {
      this.actionTableData = [];
    },
    closetrajectoryAction() {
      this.$nextTick(() => {
        this.$refs.trajectory.stop(true);
      });
    },

    //时间转换
    formatDatetime(row) {
      if (row == null || row == 0) {
        return "";
      }
      let date = new Date(parseInt(row) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
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
    //将秒数转换为时分秒格式
    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var middle = 0; // 分
      var hour = 0; // 小时

      if (theTime > 60) {
        middle = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (middle > 60) {
          hour = parseInt(middle / 60);
          middle = parseInt(middle % 60);
        }
      }
      var result = "" + parseInt(theTime) + "秒";
      if (middle > 0) {
        result = "" + parseInt(middle) + "分" + result;
      }
      if (hour > 0) {
        result = "" + parseInt(hour) + "小时" + result;
      }
      return result;
    },

    projectList() {
      return this.projectTable.filter((item) => {
        return item.projectid !== this.$store.state.projectid;
      });
    },
    getProjectLists() {
      let data = {
        tenantid: this.$store.state.userInfo.tenantid,
      };
      getProjectListByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.username
      ).then((res) => {
        if (res.code == 1001) {
          this.projectTable = res.data.list;
        }
      });
    },
    //车辆设置
    goSetTBox() {
      this.getProjectLists();
      var that = this;
      this.currentProjectid.projectid = "";
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      getTboxType(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.tboxList = res.data;
            that.addAssets = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    addTBoxRow() {
      this.tboxList.push({});
    },
    //导入车辆类型
    importTBox(val) {
      if (!val) return;
      var that = this;
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.currentProjectid.projectid,
      };
      getTboxType(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            if (res.data.length > 0) {
              // //导入后自动去重

              let arr = res.data;
              that.tboxList.forEach((i) => {
                arr.forEach((j, index) => {
                  if (j.name == i.name) {
                    arr.splice(index, 1);
                  }
                });
              });
              arr.forEach((item) => {
                that.tboxList.push({
                  name: item.name,
                  id: "",
                  tenantid: item.tenantid,
                  projectid: item.projectid,
                });
              });
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
    //删除车辆类型
    deleTBoxRow(index, id, name, tenantid, projectid) {
      if (!name || !id) {
        this.tboxList.splice(index, 1);
      } else {
        var that = this;
        let data = {
          tenantid: tenantid,
          projectid: projectid,
          name: name,
        };
        delTboxType(
          JSON.stringify(data),
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.tboxList.splice(index, 1);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    addTBoxRowTrue() {
      var that = this;
      let flag = false;
      let flag1 = false;
      let hash = {};
      $.each(this.tboxList, function (i, n) {
        if (n.id === undefined) {
          n.id = "";
        }
        if (!n.name) {
          flag = true;
        }
        if (hash[n.name]) {
          flag1 = true;
        }
        hash[n.name] = true;
      });
      if (flag) {
        that.$message({
          message: this.$t("asset.cannotempty"),
          type: "error",
        });
        this.tboxList.splice(-1, 1);
        return;
      }
      if (flag1) {
        that.$message({
          message: this.$t("asset.alreadyexists"),
          type: "error",
        });
        this.tboxList.splice(-1, 1);
        return;
      }
      let data = {
        branchs: this.tboxList.filter(item => !item.id).map(({id,...item})=>item),
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      data.branchs = JSON.stringify(data.branchs);
      addTboxType(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("asset.Setsuccessfully"),
              type: "success",
            });
            that.addAssets = false;
            this.getTBoxType();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            flag = false;
          }
        }
      );
    },
    myHeaderd() {
      let d = new Date();
      let time_A = d.getTime();
      this.myHeader.tenantkey = this.tenantkey_A;
      this.myHeader.ts = this.time_A;
      this.myHeader.tenantid = this.tenantid_A;
      this.myHeader.userName = this.userName;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreviewEdit(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    picSuccess(response, file, fileList) {
      file = "";
      this.$refs.upload.clearFiles();
      if (response.code == 1001) {
        this.add = false;
        this.searchList.page = 1;
        this.getTboxLists();
        this.$message({
          message: this.$t("beacon.addsuccess"),
          type: "success",
        });
        this.loading = false;
        this.$refs.addData.resetFields();
      } else {
        this.$message({
          message: this.$t("beacon.addfaile"),
          type: "warning",
        });
        this.loading = false;
      }
    },
    picSuccessEdit(response, file, fileList) {
      file = "";
      this.$refs.upload.clearFiles();
      if (response.code == 1001) {
        this.edit = false;
        this.searchList.page = 1;
        this.getTboxLists();
        this.$message({
          message: this.$t("beacon.editsuccess"),
          type: "success",
        });
        this.loading = false;
      } else {
        this.$message({
          message: this.$t("beacon.editfaile"),
          type: "warning",
        });
        this.loading = false;
      }
    },
    picError(err) {
      this.loading = false;
      this.$refs.upload.clearFiles();
    },
    picErrorEdit(err) {
      this.loading = false;
      this.$refs.upload.clearFiles();
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t("tet.tet10"));
    },
    handleExceedEdit(files, fileList) {
      this.$message.warning(this.$t("tet.tet11"));
    },
    beforeAvatarUpload(file) {
      var index = file.name.lastIndexOf(".");
      var type = file.name.substr(index + 1); //文件后缀名
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.error(this.$t("tet.tet12"));
        this.loading = false;
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("tet.tet13"));
        this.loading = false;
      }

      return isLt2M;
    },
    beforeAvatarUploadEdit(file) {
      var index = file.name.lastIndexOf(".");
      var type = file.name.substr(index + 1); //文件后缀名
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.error(this.$t("tet.tet12"));
        this.loading = false;
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("tet.tet13"));
        this.loading = false;
      }
      return isLt2M;
    },
    handleChange(file) {
      if (file) {
        this.haveImage = true;
        this.delImage = false;
      }
    },
    handleRemove(file) {
      if (file) {
        this.haveImage = false;
        this.delImage = true;
      }
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      if (this.$route.query.euis) {
        var that = this;
        let data = {
          projectid: this.projectid,
          euis: this.$store.state.tboxEuis,
          page: this.searchList.page,
          count: this.searchList.count,
          flag: this.$route.query.flag,
        };
        getTboxByEuis(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.tableData = res.data.list;
            that.total = res.data.size;
          }
        });
      } else {
        this.getTboxLists();
      }
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.$route.query.euis) {
        var that = this;
        let data = {
          projectid: this.projectid,
          euis: this.$store.state.tboxEuis,
          page: this.searchList.page,
          count: this.searchList.count,
          flag: this.$route.query.flag,
        };
        getTboxByEuis(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.tableData = res.data.list;
            that.total = res.data.size;
          }
        });
      } else {
        this.getTboxLists();
      }
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //重置搜索
    clearBtn() {
      var that = this;
      this.searchList = {
        sn: "", //车牌号
        type: "", //类型
        tenantid: "", //
        projectid: this.$store.state.projectid, //项目编号
        maplabel: "", //工卡号或信标号
        memo: "",
        page: 1,
        count: 20,
        depart: "",
      };
      this.currentPage1 = 1;
      this.$route.query.euis = "";
      that.$store.commit("changeTBoxEuis", "");
      this.getTboxLists();
    },

    getMemberLists() {
      var that = this;
      return new Promise((resolve, reject) => {
        let data = {
          tenantid: this.$store.state.userInfo.tenantid, //公司识别号
          projectid: this.$store.state.projectid, //项目编号
        };
        getMemberList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.assetUsername = res.data.list;
            resolve();
          }
        });
      });
    },

    //标签号下拉框
    getDevDeveuis(val) {
      var that = this;
      return new Promise((resolve, reject) => {
        let data = {
          projectid: val,
          devtype: 3,
          workstate: 1,
          inallot: 1,
          inuse: 2,
        };
        getDevDeveui(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.maplabelList = res.data;
            for (let i = 0; i < res.data.length; i++) {
              that.maplabelList[i] = {
                deveui: that.maplabelList[i],
              };
            }
            resolve();
          }
        });
      });
    },

    //添加资产
    addTBox() {
      this.fileListAdd = [];
      this.haveImage = false;

      this.getDepart();
      var that = this;

      this.assetUsername = []; //所属用户下拉框
      this.maplabelList = []; //标签号下拉框
      this.addData = {
        sn: "", //
        type: "", //
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        maplabel: "", //
        memo: "", //
        depart: "",
      };

      Promise.all([
        this.getMemberLists(),
        this.getDevDeveuis(this.$store.state.projectid),
        this.getTBoxType(),
      ]).then(() => {
        that.add = true;
      });
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      this.addData.tenantid = this.tenantid_A;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.haveImage) {
            that.userIdForPic.sn = that.addData.sn;
            that.userIdForPic.type = that.addData.type;
            that.userIdForPic.tenantid = that.addData.tenantid;
            that.userIdForPic.projectid = that.addData.projectid;
            that.userIdForPic.maplabel = that.addData.maplabel;
            that.userIdForPic.memo = that.addData.memo;
            that.userIdForPic.depart = that.addData.depart;
            that.$refs.upload.submit();
          } else {
            addTbox(
              this.addData,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.add = false;
                that.searchList.page = 1;
                that.getTboxLists();
                that.$message({
                  message: that.$t("beacon.addsuccess"),
                  type: "success",
                });
                that.loading = false;
                that.$refs[addData].resetFields();
              } else {
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

    // 编辑
    staffEdit(index) {
      this.haveImage = false;
      this.delImage = false;
      this.getDepart();
      if (this.tableData[index].filename) {
        this.fileListEdit = [
          {
            url: host.host + "profile/" + this.tableData[index].filename,
          },
        ];
      } else {
        this.fileListEdit = [];
      }
      var that = this;
      this.assetUsername = []; //所属用户下拉框
      this.maplabelList = []; //标签号下拉框
      this.editData.id = this.tableData[index].id;
      this.editData.sn = this.tableData[index].sn;
      this.editData.type = this.tableData[index].type;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.projectid = this.tableData[index].projectid;
      this.editData.maplabel = this.tableData[index].maplabel;
      this.editData.memo = this.tableData[index].memo;
      this.editData.filename = this.tableData[index].filename;
      this.editData.depart = this.tableData[index].depart;
      Promise.all([
        this.getMemberLists(),
        this.getDevDeveuis(this.$store.state.projectid),
        this.getTBoxType(),
      ]).then(() => {
        that.edit = true;
      });
    },
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.haveImage) {
            that.userIdForPicEdit.id = that.editData.id;
            that.userIdForPicEdit.sn = that.editData.sn;
            that.userIdForPicEdit.type = that.editData.type;
            that.userIdForPicEdit.tenantid = that.editData.tenantid;
            that.userIdForPicEdit.projectid = that.editData.projectid;
            that.userIdForPicEdit.memo = that.editData.memo;
            that.userIdForPicEdit.maplabel = that.editData.maplabel;
            that.userIdForPicEdit.depart = that.editData.depart;
            that.$refs.upload.submit();
          } else {
            if (that.delImage) {
              that.editData.filename = "";
            }
            updateTbox(
              that.editData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.edit = false;
                that.searchList.page = 1;
                that.getTboxLists();
                that.$message({
                  message: that.$t("beacon.editsuccess"),
                  type: "success",
                });
                that.loading = false;
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "warning",
                });
                that.loading = false;
              }
            });
          }
        } else {
          return false;
        }
      });
    },

    // 删除车辆
    TBoxDele(index) {
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t("staffmanagement.permissiondelete"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("test.confirmdel1") +
          this.tableData[index].sn +
          this.$t("terminal.carmsg2"),
        this.$t("terminal.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        this.deleId = this.tableData[index].id;
        this.deleTrue();
      });
    },
    deleTrue() {
      var that = this;
      let data = {
        id: this.deleId,
      };
      // data.id = JSON.stringify(data.id);
      this.loading = true;
      delTbox(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.searchList.page = 1;
            that.getTboxLists();
            that.$message({
              message: that.$t("terminal.deletesuccess"),
              type: "success",
            });
            that.loading = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "warning",
            });
            that.loading = false;
          }
        }
      );
    },

    //搜索
    searchTBox() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getTboxList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          if (res.data.list.length > 0) {
            that.$message({
              message: this.$t("terminal.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: this.$t("terminal.nodata"),
              type: "warning",
            });
          }
        }
      });
    },

    // 解除绑定
    removeTBoxs() {
      var that = this;
      this.removeTBoxDatas = {
        ids: [],
        snlist: [],
        maplabellist: [],
        projectid: this.$store.state.projectid,
      };
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("beacon.Pleaseunbound"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[i].maplabel == null ||
          this.multipleSelection[i].maplabel == ""
        ) {
          this.$message({
            message: this.$t("beacon.boundvehicle"),
            type: "warning",
          });
          return;
        }
        this.removeTBoxDatas.ids += this.multipleSelection[i].id + ",";
        this.removeTBoxDatas.snlist += this.multipleSelection[i].sn + ",";
        this.removeTBoxDatas.maplabellist +=
          this.multipleSelection[i].maplabel + ",";
      }
      // 去掉最后一个逗号
      that.removeTBoxDatas.ids = that.removeTBoxDatas.ids.slice(
        0,
        that.removeTBoxDatas.ids.length - 1
      );
      that.removeTBoxDatas.snlist = that.removeTBoxDatas.snlist.slice(
        0,
        that.removeTBoxDatas.snlist.length - 1
      );
      that.removeTBoxDatas.maplabellist =
        that.removeTBoxDatas.maplabellist.slice(
          0,
          that.removeTBoxDatas.maplabellist.length - 1
        );

      this.removeDatas = this.multipleSelection;
      this.removeTBox = true;
    },

    removeTrue() {
      var that = this;
      this.loading = true;
      updateTboxRemoveLable(
        this.removeTBoxDatas,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.removeTBox = false;
          that.searchList.page = 1;
          that.getTboxLists();
          that.$message({
            message: that.$t("staffmanagement.staffrule2"),
            type: "success",
          });
          that.loading = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "warning",
          });
          that.loading = false;
        }
      });
    },

    //获取资产信息
    getTboxLists() {
      var that = this;
      getTboxList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
        }
      });
    },

    //获取车辆类型下拉框
    getTBoxType() {
      var that = this;
      return new Promise((resolve, reject) => {
        let data = {
          tenantid: this.tenantid_A,
          projectid: this.$store.state.projectid,
        };
        getTboxType(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.tboxList = res.data;
            resolve();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },

    //获取部门下拉框
    getDepart() {
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      getDepartmentType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.DepartList = res.data;
        }
      });
    },
    //点击跳转到定位页面
    goLocation(index) {
      var that = this;
      if (
        this.tableData[index].maplabel == "" ||
        this.tableData[index].maplabel == null
      ) {
        this.$message({
          message: this.$t("asset.vehiclebindlabel"),
          type: "warning",
        });
        return;
      }
      let data = {
        deveui: this.tableData[index].maplabel,
        projectid: this.tableData[index].projectid,
        devtype: 4,
      };
      getDevGpsOne(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            if (
              res.data.gpstime == null ||
              res.data.gpstime == "" ||
              res.data.gpstime == 0
            ) {
              that.$message({
                message: that.$t("LocationIndoor.tet3"),
                type: "warning",
              });
            } else {
              if (res.data.postype == 1) {
                that.$router.push({
                  path: "/location/indoor/locationindoor",
                  query: { tboxDeveui: res.data.deveui },
                });
              } else if (res.data.postype == 2) {
                that.$router.push({
                  path: "/location/outdoor/locationoutdoor",
                  query: { tboxDeveui: res.data.deveui },
                });
              }
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
  },
  beforeMount() {
    if (this.$route.query.euis) {
      var that = this;
      let data = {
        projectid: this.projectid,
        euis: this.$store.state.tboxEuis,
        page: 1,
        count: 20,
        flag: this.$route.query.flag,
      };
      getTboxByEuis(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
        }
      });
    } else {
      this.getTboxLists();
    }
    this.getTBoxType();
    this.getDepart();
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.editRules,
        this.$options.data.call(this).editRules
      );
    },
  },
};
</script>

<style scoped>
#articleImageFile {
  display: none;
}
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
.query,
.reset,
.add {
  padding: 8px 12px !important;
}
.icon_button {
  padding: 2px 16px !important;
}
.selects button {
  width: 100%;
  text-align: left;
}
/* 按钮改变颜色 */
.edits:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.dels:hover {
  background-color: rgb(196, 27, 27);
  color: white;
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

.demo-form-inline >>> .el-select .el-input__inner {
  padding-right: 20px;
}

.demo-form-inline >>> .el-input__suffix {
  right: 0 !important;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.el-form-item .el-button.el-button--danger {
  transform: translateX(4px);
}
.el-form-item .el-button.add2 {
  margin-left: 8px !important;
}

.actionDetails {
  /* height: 50px; */
  max-height: 500px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.actionDetails >>> .ivu-timeline {
  width: 23%;
  margin-left: 2%;
  text-align: left;
}
.action .el-dialog__body .el-form .el-form-item {
  padding-right: 0px !important;
}

.action .demo-form-inline .el-form-item .el-form-item__content {
  width: 100%;
}
.trajectory >>> .el-dialog {
  height: 85%;
  margin-top: 2% !important;
}
.trajectory >>> .el-dialog__header {
  height: 4%;
}
.trajectory >>> .el-dialog__headerbtn {
  top: 1% !important;
}
.trajectory >>> .el-dialog__body {
  height: 96%;
  padding-top: 10px !important;
}
</style>
