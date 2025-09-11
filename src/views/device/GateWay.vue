<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>

    <div class="content">
      <el-container class="asi">
        <el-aside><Devicemanagement /></el-aside>
        <el-main>
          <div class="gateway_input">
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="
                display: flex;
                white-space: nowrap;
                margin-left: 1%;
                z-index: 1;
              "
            >
              <el-form-item
                :label="$t('gateway.company')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.tenantid"
                  clearable
                  filterable
                  @change="getSearchGatewayList"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in tenantidData"
                    :key="item.tenantid"
                    :label="item.username"
                    :value="item.tenantid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.deveui')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.deveui"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in devList"
                    :key="item.deveui"
                    :label="item.deveui"
                    :value="item.deveui"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.scheme')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.scheme"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in schemeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.Online')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.hbstatus"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in hbstatusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: 2%">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchGateway()"
                  >{{ $t("gateway.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="clearButton()"
                  >{{ $t("gateway.reset") }}</el-button
                >
                <el-button
                  type="primary"
                  class="add"
                  @click="addGateways()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                  >{{ $t("gateway.addstation") }}</el-button
                >
                <el-button
                  type="primary"
                  class="add"
                  @click="GwToNs()"
                  v-if="contrForPrionum == 1 || contrForPrionum == 2"
                  >{{ $t("gateway.Batchsynchronization") }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- gateway展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              @current-change="selectGateway"
              @selection-change="handleSelectionChange"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="300"
              border
              highlight-current-row
            >
              <el-table-column
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                type="selection"
                width="55"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="customername"
                :label="$t('gateway.customername')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrionum == '1'"
                min-width="150"
              ></el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('gateway.deveui1')"
                align="center"
                show-overflow-tooltip
                min-width="150"
              ></el-table-column>
              <el-table-column
                property="alias"
                :label="$t('inspection.alias')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="projectname"
                :label="$t('buildingmanagement.projectname')"
                align="center"
                show-overflow-tooltip
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              ></el-table-column>
              <el-table-column
                property="schemestr"
                :label="$t('gateway.schemestr')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                property="country"
                :label="$t('gateway.country')"
                align="center"
                show-overflow-tooltip
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>
              <el-table-column
                property="customstr"
                :label="$t('gateway.customstr')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="hbstatustr"
                :label="$t('terminal.hbstatusstr')"
                min-width="125"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'networkstr' : 'ennetwork'"
                :label="$t('gateway.Networkmode')"
                min-width="110"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.network == 1 && scope.row.cardid"
                    @click="show4Gs(scope.$index)"
                    type="text"
                    size="small"
                    style="width: 60%"
                    >{{
                      i8n == "zh" ? scope.row.networkstr : scope.row.ennetwork
                    }}</el-button
                  >
                  <p v-if="scope.row.network != 1 || scope.row.cardid == null">
                    {{
                      i8n == "zh" ? scope.row.networkstr : scope.row.ennetwork
                    }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                property="firsttime"
                :label="$t('gateway.firsttime')"
                align="center"
                show-overflow-tooltip
                :formatter="formatDateFirsttime"
                min-width="170"
              ></el-table-column>
              <el-table-column
                property="statustime"
                :label="$t('terminal.statustime')"
                align="center"
                show-overflow-tooltip
                :formatter="formatDateStatustime"
                min-width="170"
              ></el-table-column>

              <el-table-column
                property="sysmemo"
                :label="$t('gateway.sysmemo')"
                min-width="120"
                align="center"
                show-overflow-tooltip
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('gateway.memo2')"
                align="center"
                show-overflow-tooltip
                v-if="contrForPrionum != 1 && contrForPrionum != 2"
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('gateway.operate1')"
                min-width="80"
                align="center"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              >
                <template slot-scope="scope">
                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('staff.operate')"
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
                      >
                        <el-button
                          size="mini"
                          class="edits"
                          @click="gatewayEdit(scope.$index, tableData)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          >{{ $t("gateway.edit") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="mini"
                          class="edits"
                          @click="gatewayBack(scope.$index)"
                          v-if="contrForPrionum == 3 || contrForPrionum == 4"
                          >{{ $t("terminal.recovery") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="mini"
                          class="dels1"
                          @click="gatewayDele(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 3 ||
                            delprio == 1
                          "
                          >{{ $t("gateway.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
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
              >
              </el-pagination>
            </div>
          </div>

          <!-- 地图 -->
          <div class="mapConent">
            <div id="gatewayMap">
              <span class="tips">
                {{ $t("gateway.tet") }}
              </span>
            </div>

            <div id="lineChart">
              <div id="line1" style="height: 275px"></div>
              <div id="line2" style="height: 275px"></div>
            </div>
            <!-- 左键显示内容的 -->
            <div id="popup" class="ol-popup">
              <a href="#" id="popup-closer" class="ol-popup-closer">
                <img
                  src="../../../static/close.jpg"
                  width="11"
                  height="11"
                  alt=""
                />
              </a>
              <div id="popup-content">
                <ul>
                  <li>{{ $t("home.Gatewaynumber") }}{{ deveuiNum }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t("home.Createdon") }}{{ startAt }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t("home.Dataupdatetime") }}{{ lastAt }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t("home.Company") }}{{ customername }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t("home.Project") }}{{ projectname }}</li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 添加gateway -->
          <el-dialog
            :title="$t('gateway.addgateway')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="130px"
              ref="addData"
              style="text-align: left"
              :rules="addRules"
            >
              <el-form-item
                :label="$t('gateway.deveui')"
                prop="deveui"
                style="margin-right: 2%"
              >
                <el-input maxlength="16" v-model="addData.deveui"> </el-input>
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
                    <p>{{ $t("gateway.tet1") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('floormanagement.Alias')"
                style="margin-right: 2%"
              >
                <el-input v-model="addData.alias"> </el-input>
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
                    <p>{{ $t("gateway.tet2") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.company')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="addData.tenantid"
                  clearable
                  filterable
                  @change="selectScheme"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in tenantidData"
                    :key="item.tenantid"
                    :label="item.username"
                    :value="item.tenantid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('gateway.scheme')" prop="scheme">
                <el-select
                  v-model="addData.scheme"
                  :placeholder="$t('gateway.schemerules')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in selectschemeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
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
                    <p>{{ $t("gateway.tet3") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagement.projectname1')"
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  v-model="addData.projectid"
                  :placeholder="$t('buildingmanagement.projectname1rule')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.tet4')"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              >
                <el-select
                  v-model="addData.network"
                  :placeholder="$t('gateway.tet5')"
                  clearable
                  filterable
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
                :label="$t('gateway.Cardid')"
                style="margin-right: 2%"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
                v-show="addData.network == 1"
              >
                <el-input maxlength="32" v-model="addData.cardid"> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.Totalflow1')"
                style="margin-right: 2%"
                v-show="addData.network == 1"
                prop="totalbytes"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              >
                <el-input maxlength="16" v-model="totalbytes"> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.sysmemo1')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                style="margin-right: 2%"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.sysmemo"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.memo')"
                v-if="contrForPrionum != 1 && contrForPrionum != 2"
                style="margin-right: 2%"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel('addData')">
                {{ $t("terminal.cancel") }}</el-button
              >
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
              >
                {{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 修改gateway -->
          <el-dialog
            :title="$t('gateway.editgateway')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              ref="editData"
              class="demo-ruleForm"
              label-width="130px"
              style="text-align: left; margin-left: 10px"
              :rules="editRules"
            >
              <el-form-item :label="$t('gateway.deveui')">
                <el-input v-model="editData.deveui" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.Alias')">
                <el-input v-model="editData.alias"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.company')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="editData.tenantid"
                  clearable
                  filterable
                  @change="selectScheme"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in tenantidData"
                    :key="item.tenantid"
                    :label="item.username"
                    :value="item.tenantid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('gateway.scheme')">
                <el-select
                  v-model="editData.schemestr"
                  :placeholder="$t('gateway.schemerules')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in selectschemeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('beacon.projectname1')"
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  v-model="editData.projectid"
                  :placeholder="$t('buildingmanagement.projectname1rule')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.tet4')"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              >
                <el-select
                  v-model="editData.network"
                  :placeholder="$t('gateway.tet5')"
                  clearable
                  filterable
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
                :label="$t('gateway.Cardid')"
                v-show="editData.network == 1"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              >
                <el-input maxlength="32" v-model="editData.cardid"> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.Totalflow1')"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
                v-show="editData.network == 1"
                prop="totalbytes"
              >
                <el-input maxlength="16" v-model="totalbytes1"> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.sysmemo1')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.sysmemo"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.memo')"
                v-if="contrForPrionum != 1 && contrForPrionum != 2"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel('editData')">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 显示4G信息 -->
          <el-dialog
            width="30%"
            :visible.sync="show4Gdialog"
            style="text-align: center"
          >
            <el-form
              :model="show4GData"
              label-width="110px"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('gateway.Cardnumber')"
                prop="name"
                style="margin-right: 2%"
              >
                <el-input v-model="show4GData.cardid"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.Totalflow')"
                prop="name"
                style="margin-right: 2%"
              >
                <el-input v-model="show4GData.totalbytes"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('gateway.Usageflow')"
                prop="name"
                style="margin-right: 2%"
              >
                <el-input v-model="show4GData.totalcount"></el-input>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Devicemanagement from "../../components/devicemanagement/devicemanagement";

//地图
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlSourceVector from "ol/source/Vector";
import OlLayerVector from "ol/layer/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

import Overlay from "ol/Overlay";
import {
  defaults as defaultInteractions,
  DragRotateAndZoom,
  Modify,
} from "ol/interaction";

// 描线
import { Stroke, Style } from "ol/style";
import { LineString } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";

//地图控件
import ScaleLine from "ol/control/ScaleLine"; //比例尺控件
import {
  addGateway,
  getGatewayList,
  updateGateway,
  delGateway,
  getSchemes,
  getGatewayMore,
  getGwStats,
  addGatewayToNs,
  updateGatewayLocation,
  getCustomerName,
  getProjectListByTenantid,
  updateGatewayRemoveProject,
  getGatewayFlow,
} from "../../axios/api";
export default {
  components: {
    Menu,
    Devicemanagement,
    basecard,
  },
  name: "GateWay",
  data() {
    return {
      i8n: this.$store.state.i18n,
      openlayersSource: "",
      deveuiNum: "",
      startAt: "",
      lastAt: "",
      projectname: "",
      customername: "",
      timestamp: [],
      rxPacketsReceivedOK: [],
      txPacketsEmitted: [],
      contrForPrionum: this.$store.state.userInfo.prionum,
      country: this.$store.state.userInfo.country,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      projectList: [],
      multipleSelection: [],
      tableData: [],
      tenantidData: [],
      loading: false,
      searchList: {
        deveui: "",
        scheme: "",
        tenantid: this.$store.state.userInfo.tenantid,
        page: 1,
        count: 10,
        hbstatus: "",
        network: "",
      },
      pageCount: 10,
      currentPage1: 1,
      total: 0,
      add: false,
      totalbytes: "",
      totalbytes1: "",
      addData: {
        deveui: "",
        scheme: "",
        tenantid: "",
        country: "",
        memo: "",
        sysmemo: "",
        custom: 1,
        alais: "",
        projectid: "",
        network: "",
        cardid: "",
        totalbytes: "",
      },

      addRules: {
        deveui: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9]{1,16}$/,
            message: this.$t("terminal.tit30"),
            trigger: "blur",
          },
        ],
        scheme: [
          {
            required: true,
            message: this.$t("gateway.schemestrrules"),
            trigger: "change",
          },
        ],
        totalbytes: [
          {
            pattern: /^\d+(?:\.\d+)?\s?GG?$/,
            message: this.$t("gateway.tet6"),
            trigger: "blur",
          },
        ],
      },
      editRules: {
        totalbytes: [
          {
            pattern: /^\d+(?:\.\d+)?\s?GG?$/,
            message: this.$t("gateway.tet6"),
            trigger: "blur",
          },
        ],
      },
      schemeList: [
        {
          index: 1,
          value: "CN470",
        },
        {
          index: 2,
          value: "US915_BAND1",
        },
        {
          index: 3,
          value: "US915_BAND2",
        },
        {
          index: 4,
          value: "EU868",
        },
        {
          index: 5,
          value: "AS923",
        },
        {
          index: 6,
          value: "IN865",
        },
        {
          index: 7,
          value: "RU864",
        },
        {
          index: 8,
          value: "AU915_BAND1",
        },
        {
          index: 9,
          value: "AU915_BAND2",
        },
        {
          index: 10,
          value: "KR920",
        },
      ],
      hbstatusList: [
        {
          index: 1,
          value: "Online",
        },
        {
          index: 2,
          value: "Offline",
        },
        {
          index: 3,
          value: "Unknown",
        },
      ],
      typeList: [
        {
          index: 1,
          value: this.$t("gateway.Gcard"),
        },
        {
          index: 2,
          value: this.$t("gateway.wired"),
        },
      ],
      selectschemeList: [],
      edit: false,
      editData: {
        deveui: "",
        scheme: "",
        tenantid: "",
        country: "",
        memo: "",
        sysmemo: "",
        schemestr: "",
        alias: "",
        projectid: "",
        network: "",
        cardid: "",
        totalbytes: "",
      },
      devList: [],

      //地图
      map: "",
      seeLayer: "",
      view: "",
      show4G: true, //判断是否点击了显示4G流量
      show4Gdialog: false,
      show4GData: {
        cardid: "",
        totalbytes: "",
        totalcount: "",
      },
      clickTrue: true, //用来判断点击表格后是否触发后续的事件
      echarts1: true,
      echarts2: true, //当两个echarts折线图渲染完成后才会触发点击事件
    };
  },
  methods: {
    //批量同步
    GwToNs() {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.tet8"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[0].tenantid !=
            this.multipleSelection[i].tenantid ||
          this.multipleSelection[0].scheme != this.multipleSelection[i].scheme
        ) {
          that.$message({
            message: this.$t("terminal.tet9"),
            type: "warning",
          });
          return;
        }
      }

      this.$confirm(this.$t("terminal.tet10"), this.$t("Building.tips"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            let data = {
              deveuis: [],
            };
            for (let i = 0; i < this.multipleSelection.length; i++) {
              data.deveuis.push(this.multipleSelection[i].deveui);
            }
            addGatewayToNs(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.$message({
                  message: that.$t("terminal.tet11"),
                  type: "success",
                });
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          }
        },
      });
    },
    //表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 显示4G流量
    show4Gs(index) {
      this.show4G = false;
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".action"),
      });
      getGatewayFlow(
        { deveui: that.tableData[index].deveui },
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        that.show4G = true;
        if (res.code == 1001) {
          that.show4GData = {
            cardid: that.tableData[index].cardid,
            totalbytes: that.tableData[index].totalbytes,
            totalcount: res.data,
          };
          loading.close();
          that.show4Gdialog = true;
        } else {
          loading.close();
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //选中表格事件
    selectGateway(val) {
      if (this.show4G) {
        var that = this;
        if (this.echarts1 && this.echarts2 && this.clickTrue) {
          let LayerArrays = this.map.getLayers().getArray();
          for (let i = 1; i < LayerArrays.length; i++) {
            if (LayerArrays[i].getSource().getFeatures()[0].values_.deveui) {
              LayerArrays[i]
                .getSource()
                .getFeatures()
                .forEach(function (feature) {
                  LayerArrays[i].getSource().removeFeature(feature);
                });
              this.map.removeLayer(LayerArrays[i]);
            }
          }

          that.timestamp = [];
          that.rxPacketsReceivedOK = [];
          that.txPacketsEmitted = [];
          let data = {
            deveui: val.deveui,
            tenantid: val.tenantid,
          };
          //单击获取折线图所需要的数据

          if (val.custom == 1) {
            that.clickTrue = false;
            that.echarts2 = false;
            that.echarts1 = false;
            // 系统分配调用
            getGwStats(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                if (
                  res.data != null &&
                  JSON.parse(res.data).result.length > 0
                ) {
                  let datas = JSON.parse(res.data).result;
                  for (let i = 0; i < datas.length; i++) {
                    that.timestamp.push(datas[i].timestamp);
                    that.rxPacketsReceivedOK.push(datas[i].rxPacketsReceivedOK);
                    that.txPacketsEmitted.push(datas[i].txPacketsEmitted);
                    that.drawLine1();
                    that.drawLine2();
                  }
                } else {
                  that.$message({
                    message: that.$t("gateway.tet7"),
                    type: "warning",
                  });
                  that.timestamp = [];
                  that.rxPacketsReceivedOK = [];
                  that.txPacketsEmitted = [];
                  that.drawLine1();
                  that.drawLine2();
                }
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          }

          that.map.getView().setCenter([val.lastx, val.lasty], "EPSG:4326");
          that.addIconMarker(that.map, val);
          that.clickTrue = true;
        }
      }
    },
    //初始化echarts
    //上行数据量折线图
    drawLine1() {
      var myChart = this.$echarts.init(document.getElementById("line1"));
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["上行数据量"],
        },
        xAxis: {
          name: this.$t("gateway.time"),
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          type: "category",
          boundaryGap: false,
          data: this.timestamp,
        },
        yAxis: {
          name: this.$t("gateway.data"),
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 15,
          },
          type: "value",
          scale: true,
        },
        series: [
          {
            data: this.rxPacketsReceivedOK,
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
      this.echarts1 = true;
    },
    //下行数据量折线图
    drawLine2() {
      var myChart = this.$echarts.init(document.getElementById("line2"));
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["上行数据量"],
        },
        // color:[]
        xAxis: {
          name: this.$t("gateway.time"),
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          type: "category",
          boundaryGap: false,
          data: this.timestamp,
        },
        yAxis: {
          name: this.$t("gateway.data1"),
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 15,
          },
          type: "value",
          scale: true,
        },
        series: [
          {
            data: this.txPacketsEmitted,
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
      this.echarts2 = true;
    },
    //初始化地图
    initMap() {
      this.seeLayer = new TileLayer({
        source: this.openlayersSource,
      });

      this.view = new View({
        projection: "EPSG:4326",
        center: [118.804, 32.083],
        zoom: 7,
      });
      setTimeout(() => {
        this.map = new Map({
          target: "gatewayMap",
          layers: [this.seeLayer],
          view: this.view,
          interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
        });

        this.map.addControl(new ScaleLine());
        this.mapClick();

        this.addLine(this.map);
      }, 0);
    },

    //点击事件
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
        if (feature) {
          for (let i = 0; i < that.tableData.length; i++) {
            that.deveuiNum = that.tableData[i].deveui;
            that.startAt = that.formatTime(that.tableData[i].firsttime);
            that.lastAt = that.formatTime(that.tableData[i].statustime);
            that.projectname = that.tableData[i].projectname;
            that.customername = that.tableData[i].customername;
            if (feature.values_.deveui == that.tableData[i].deveui) {
              $("#popup").css("display", "block");
              var container = document.getElementById("popup"); //最外层包含所有元素的div
              var overlay = new Overlay({
                //设置弹出框的容器
                element: container,
                //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
                autoPan: true,
              });
              overlay.setPosition(coodinate);
              that.map.addOverlay(overlay);
              $("#popup-closer").on("click", function (event) {
                event.preventDefault();
                overlay.setPosition(undefined);
              }); // 点击关闭的按钮
              return;
            }
          }
        }
      });
    },

    //添加图标
    addIconMarker(map, iconInfo) {
      var that = this;
      var features = new OlFeature({
        tenantid: iconInfo.tenantid,
        longitude: iconInfo.lastx,
        latitude: iconInfo.lasty,
        src: "../../../static/baseon.png", //图标路径
        deveui: iconInfo.deveui,
        geometry: new OlGeomPoint([iconInfo.lastx, iconInfo.lasty]),
      });

      var source = new OlSourceVector({
        features: [features],
      });

      let style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/baseon.png",
          scale: 1,
        }),
        // 设置图片下面显示字体的样式和内容
        text: new Text({
          text: iconInfo.deveui, // 添加文字描述
          font: "16px font-size", // 设置字体大小
          fill: new Fill({
            // 设置字体颜色
            color: "blue",
          }),
          offsetY: 10, // 设置文字偏移量
        }),
      });

      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });

      this.modifyFeature(map, vectorLayer.getSource());
      map.addLayer(vectorLayer);
    },

    //拖拽
    modifyFeature(map, source) {
      var that = this;
      var modify = new Modify({
        source: source,
      });

      //移动后
      modify.on("modifyend", (e) => {
        source.getFeatures()[0].values_.longitude =
          e.mapBrowserEvent.coordinate[0];
        source.getFeatures()[0].values_.latitude =
          e.mapBrowserEvent.coordinate[1];
        let data = {
          deveui: source.getFeatures()[0].values_.deveui,
          longitude: e.mapBrowserEvent.coordinate[0],
          latitude: e.mapBrowserEvent.coordinate[1],
        };
        updateGatewayLocation(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code != 1001) {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
      map.addInteraction(modify);
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
      setInterval(() => {
        let offset1 = feature.get("dashOffset");
        offset1 = offset1 == 0 ? -8 : offset1 + 1;

        feature.set("dashOffset", offset1);
        feature.setStyle(getStyle());
      }, 100);
    },

    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getGatewayLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getGatewayLists();
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
    formatDateFirsttime(row, column) {
      if (row.firsttime == null || row.firsttime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.firsttime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDateStatustime(row, column) {
      if (row.statustime == null || row.statustime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.statustime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatTime(time) {
      if (time == null || time == 0) {
        return "";
      }
      let date = new Date(parseInt(time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    //添加基站
    addGateways() {
      this.totalbytes = "";
      this.addData = {
        deveui: "",
        scheme: "",
        tenantid: "",
        country: "",
        memo: "",
        sysmemo: "",
        custom: 1,
        alias: "",
        projectid: "",
        network: "",
        cardid: "",
        totalbytes: "",
      };
      if (this.contrForPrionum != 1 && this.contrForPrionum != 2) {
        this.selectScheme(this.tenantid_A);
      }
      this.add = true;
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          if (that.contrForPrionum == 3 || that.contrForPrionum == 4) {
            that.addData.country = that.country;
            that.addData.tenantid = that.tenantid_A;
            that.addData.custom = 2;
          } else {
            for (let i = 0; i < that.tenantidData.length; i++) {
              if (that.tenantidData[i].tenantid == that.addData.tenantid) {
                that.addData.country = that.tenantidData[i].country;
              }
            }
          }
          this.loading = true;

          addGateway(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getGatewayLists();
              that.getCustomerNames();
              that.getSearchGatewayList();
              that.$message({
                message: that.$t("gateway.addsuccess"),
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
        } else {
          return false;
        }
      });
    },

    //获取基站信息
    getGatewayLists() {
      var that = this;
      getGatewayList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          for (let i = 0; i < that.tableData.length; i++) {
            if (that.tableData[i].custom == 1) {
              that.selectGateway(that.tableData[i]);
              return;
            }
          }
        }
      });
    },

    //修改gateway
    gatewayEdit(index) {
      this.show4G = false;
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        if (this.tableData[index].custom == 2) {
          this.$message({
            message: this.$t("gateway.editgatewayrules"),
            type: "warning",
          });
          return;
        }
      }
      this.editData.deveui = this.tableData[index].deveui;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.country = this.tableData[index].country;
      this.editData.memo = this.tableData[index].memo;
      this.editData.sysmemo = this.tableData[index].sysmemo;
      this.editData.alias = this.tableData[index].alias;
      this.editData.schemestr = this.tableData[index].schemestr;
      this.editData.projectid = this.tableData[index].projectid;
      this.editData.cardid = this.tableData[index].cardid;
      this.editData.network = this.tableData[index].network;
      this.totalbytes1 = this.tableData[index].totalbytes
        ? this.tableData[index].totalbytes.substr(
            0,
            this.tableData[index].totalbytes.length - 1
          )
        : "";

      this.selectScheme(this.editData.tenantid);
      this.edit = true;
    },
    editCancel(editData) {
      this.edit = false;
      this.loading = false;
      this.show4G = true;
      this.$refs[editData].resetFields();
    },
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.editData.scheme = this.editData.schemestr;
          if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
            for (let i = 0; i < that.tenantidData.length; i++) {
              if (that.tenantidData[i].tenantid == that.editData.tenantid) {
                that.editData.country = that.tenantidData[i].country;
              }
            }
          }

          this.loading = true;
          updateGateway(
            that.editData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.getGatewayLists();
              that.getCustomerNames();
              that.getSearchGatewayList();
              that.$message({
                message: that.$t("gateway.editsuccess"),
                type: "success",
              });
              that.loading = false;
              that.show4G = true;
              that.$refs[editData].resetFields();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    },

    //删除gateway
    gatewayDele(index) {
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
      var that = this;
      //系统分配的设备无法删除
      if (
        (this.contrForPrionum == 3 && this.tableData[index].custom == 1) ||
        (this.contrForPrionum == 4 && this.tableData[index].custom == 1)
      ) {
        this.$message({
          message: this.$t("gateway.deletegatewayrules"),
          type: "warning",
        });
        return;
      } else if (
        this.contrForPrionum == 1 &&
        this.tableData[index].custom == 2
      ) {
        this.$message({
          message: this.$t("gateway.deletegatewayrules1"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("gateway.deletemsg") +
          this.tableData[index].deveui +
          this.$t("gateway.deletemsg1"),
        this.$t("Building.tips"),

        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          deveui: that.tableData[index].deveui,
        };
        delGateway(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.getGatewayLists();
              that.getCustomerNames();
              that.getSearchGatewayList();
              that.$message({
                message: that.$t("gateway.deletesuccess"),
                type: "success",
              });
            } else {
              $message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          }
        );
      });
    },

    //回收
    gatewayBack(index) {
      var that = this;
      this.$confirm(
        this.$t("beacon.tet13") +
          this.tableData[index].deveui +
          this.$t("gateway.deletemsg1"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          deveui: this.tableData[index].deveui,
        };
        updateGatewayRemoveProject(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.getGatewayLists();
            that.getCustomerNames();
            that.getSearchGatewayList();
            that.$message({
              message: that.$t("gateway.Recyclingsucceeded"),
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

    //搜索gateway
    searchGateway() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      // if (this.contrForPrionum != "系统管理员") {
      //   this.searchList.tenantid = this.tenantid_A;
      // }
      getGatewayList(
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
              message: that.$t("gateway.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("gateway.nodata"),
              type: "success",
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

    // 刷新
    clearButton() {
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          deveui: "",
          scheme: "",
          tenantid: "",
          page: 1,
          count: this.pageCount,
          hbstatus: "",
        };
      } else {
        this.searchList = {
          deveui: "",
          scheme: "",
          tenantid: this.$store.state.userInfo.tenantid,
          page: 1,
          count: this.pageCount,
          hbstatus: "",
        };
      }

      this.currentPage1 = 1;
      this.getGatewayLists();
    },
    //获取所有的Tenantid
    getCustomerNames() {
      var that = this;
      if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
        let data = {
          beginlevel: 1,
          endlevel: 3,
        };
        getCustomerName(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          that.tenantidData = res.data;
        });
      }
    },

    //获取设备号下拉框
    getSearchGatewayList(event) {
      let data = {};
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        data = {
          tenantid: event,
        };
      } else {
        data = {
          tenantid: this.$store.state.userInfo.tenantid,
        };
      }
      getGatewayList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.devList = res.data.list;
      });
    },

    //系统管理员添加设备时根据选择的公司来获取相对应的设备制式
    selectScheme(event) {
      this.selectschemeList = [];
      let data = {
        tenantid: event,
      };
      getSchemes(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          let scheme = {};
          let schemes = res.data.split(",");
          for (let i = 0; i < schemes.length; i++) {
            scheme = {
              index: i,
              value: schemes[i],
            };
            this.selectschemeList.push(scheme);
          }
        }
      );

      // getGatewayList(
      //   data,
      //   this.tenantkey_A,
      //   this.tenantid_A,
      //   this.userName
      // ).then((res) => {
      //   this.devList = res.data.list;
      // });
    },

    //获取项目下拉框
    getSearchProjectList(tenantid) {
      let data = {
        superid: tenantid,
      };
      getProjectListByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.projectList = res.data.list;
      });
    },
  },
  beforeMount() {
    if (this.$store.state.i18n == "zh") {
      // 说明：瓦片地址改为读取环境变量，默认保持当前地址
      this.openlayersSource = new OSM({
        url: process.env.VUE_APP_TILE_URL_TEMPLATE,
        crossOrigin: "",
      });
    } else {
      this.openlayersSource = new OSM();
    }
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2
    ) {
      this.searchList = {
        deveui: "",
        scheme: "",
        tenantid: "",
        page: 1,
        count: 10,
        hbstatus: "",
      };
    }
    if (
      this.$store.state.userInfo.prionum == 3 ||
      this.$store.state.userInfo.prionum == 4
    ) {
      this.getSearchProjectList(this.$store.state.userInfo.tenantid);
    }

    this.getCustomerNames();
    this.getSearchGatewayList();
    this.initMap();
    this.getGatewayLists();
  },
  mounted() {
    this.drawLine1();
    this.drawLine2();
  },
  watch: {
    totalbytes(v) {
      if (v) {
        this.addData.totalbytes = `${v}G`;
      } else {
        this.addData.totalbytes = "";
      }
    },
    totalbytes1(v) {
      if (v) {
        this.editData.totalbytes = `${v}G`;
      } else {
        this.editData.totalbytes = "";
      }
    },
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
      );
      Object.assign(
        this.$data.editRules,
        this.$options.data.call(this).editRules
      );
      Object.assign(
        this.$data.typeList,
        this.$options.data.call(this).typeList
      );

      this.drawLine1();
      this.drawLine2();
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
.selects button {
  width: 100%;
  text-align: left;
}
/* 按钮改变颜色 */
.edits:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.dels1:hover {
  background-color: rgb(196, 27, 27);
  color: white;
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
  padding: 8px 14px !important;
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

/* 地图 */
.mapConent {
  display: flex;
}

.tips {
  float: left;
  text-align: left;
}
#gatewayMap {
  position: relative;
  height: 550px;
  width: 47%;
}
#lineChart {
  width: 50%;
}

#popup {
  /* height: 300px; */
  display: none;
}

#popup-content {
  background: #fff;
  padding: 3px 10px 3px 10px;
}
.divider {
  margin: 5px 0 !important;
}

#popup-content li {
  list-style: none;
  text-align: left;
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
a {
  text-decoration: none;
}
.el-button {
  margin-left: 4px !important;
}

#gatewayMap >>> .ol-viewport {
  height: 95% !important;
}
.icon_button {
  padding: 2px 16px !important;
}
</style>
