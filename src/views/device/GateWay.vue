<template>
  <div
    :class="contrForPrionum != 5 ? 'home device-page admin-page' : 'device-page'"
    style="height: 100%"
  >
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>

    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Devicemanagement /></el-aside>
        <el-main>
          <div
            class="gateway_input terminal-filter-flow page-panel"
            :class="filterLangClass"
          >
            <el-form
              class="demo-form-inline terminal-filter-form gateway-search-form"
              :model="searchList"
            >
              <el-form-item
                :label="$t('gateway.company')"
                class="terminal-filter-item"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
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
                class="terminal-filter-item"
              >
                <el-select
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
                class="terminal-filter-item"
              >
                <el-select
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
                class="terminal-filter-item"
              >
                <el-select
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
              <el-form-item
                :label="$t('gateway.Accessmode')"
                class="terminal-filter-item"
              >
                <el-select
                  v-model="searchList.network"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
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
                :label="$t('terminal.Project1')"
                class="terminal-filter-item"
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  v-model="searchList.projectid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in searchProjectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="search-actions terminal-toolbar-item">
              <div class="terminal-toolbar-row">
                <el-button type="primary" class="query" @click="searchGateway()">{{
                  $t('gateway.search')
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearButton()">{{
                  $t('gateway.reset')
                }}</el-button>
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
                  >{{ $t('gateway.addstation') }}</el-button>
                <el-button
                  type="primary"
                  class="add"
                  @click="GwToNs()"
                  v-if="contrForPrionum == 1 || contrForPrionum == 2"
                  >{{ $t('gateway.Batchsynchronization') }}</el-button>
              </div>
            </div>
          </div>

          <!-- gateway展示 -->
          <div class="page-panel table-panel">
            <el-table
              ref="multipleTable"
              :data="tableData"
              @current-change="selectGateway"
              @selection-change="handleSelectionChange"
              class="device-table"
              style="width: 100%; text-align: center"
              :max-height="300"
              :border="contrForPrionum != 5"
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
                <template #default="scope">
                  <el-button text
                    v-if="scope.row.network == 1 && scope.row.cardid"
                    @click="show4Gs(scope.$index)"
                    size="small"
                    style="width: 60%"
                    >{{ i8n == 'zh' ? scope.row.networkstr : scope.row.ennetwork }}</el-button>
                  <p v-if="scope.row.network != 1 || scope.row.cardid == null">
                    {{ i8n == 'zh' ? scope.row.networkstr : scope.row.ennetwork }}
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
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
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
                  contrForPrionum == 4 ||
                  contrForPrionum == 5
                "
              >
                <template #default="scope">
                  <el-dropdown size="small" type="primary" trigger="click">
                    <span class="el-dropdown-link">
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
                    </span>
<template #dropdown><el-dropdown-menu
                     
                      style="background-color: rgb(219, 222, 231)"
                      class="selects"
                    >
                      <el-dropdown-item
                        style="margin-top: 4%; background-color: rgb(219, 222, 231)"
                      >
                        <el-button
                          size="small"
                          class="edits"
                          @click="gatewayEdit(scope.row)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          >{{ $t('gateway.edit') }}</el-button></el-dropdown-item>
                      <el-dropdown-item
                        v-if="contrForPrionum == 3 || contrForPrionum == 4"
                        style="margin-top: 4%; background-color: rgb(219, 222, 231)"
                        ><el-button
                          size="small"
                          class="edits"
                          @click="gatewayBack(scope.row)"
                          v-if="contrForPrionum == 3 || contrForPrionum == 4"
                          >{{ $t('terminal.recovery') }}</el-button></el-dropdown-item>
                      <el-dropdown-item
                        v-if="contrForPrionum != 5 && (contrForPrionum == 1 || contrForPrionum == 3 || delprio == 1)"
                        style="margin-top: 4%; background-color: rgb(219, 222, 231)"
                        ><el-button
                          size="small"
                          class="dels1"
                          @click="gatewayDele(scope.row)"
                          v-if="contrForPrionum != 5 && (contrForPrionum == 1 || contrForPrionum == 3 || delprio == 1)"
                          >{{ $t('gateway.delete') }}</el-button></el-dropdown-item>
                    </el-dropdown-menu></template>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block device-pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-model:current-page="currentPage1"
                v-model:page-size="pageCount"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 地图 -->
          <div class="mapConent page-panel">
            <div class="gateway-map-wrap">
              <div id="gatewayMap">
                <span class="tips">
                  {{ $t('gateway.tet') }}
                </span>
                <!-- 锚点放在提示条之后，控件随提示条高度自适应，始终位于地图区域内 -->
                <div class="gateway-map-anchor">
                  <MapLayerSwitcher
                    :map="map"
                    top="10px"
                    right="10px"
                    @change="onMapStyleChange"
                  />
                </div>
              </div>
            </div>

            <div id="lineChart" class="gateway-chart-panel">
              <div class="gateway-chart-card gateway-chart-card--rx">
                <div class="gateway-chart-header">
                  <div class="gateway-chart-title">
                    <span class="gateway-chart-icon"><i class="el-icon-data-line"></i></span>
                    <span>{{ $t('gateway.data') }}</span>
                  </div>
                  <div v-if="rxStats" class="gateway-chart-stats">
                    <span class="gateway-chart-stat">
                      <em>{{ $t('LocationIndoorHis.statAvg') }}</em><b>{{ rxStats.avg }}</b>
                    </span>
                    <span class="gateway-chart-stat gateway-chart-stat--max">
                      <em>{{ $t('LocationIndoorHis.statMax') }}</em><b>{{ rxStats.max }}</b>
                    </span>
                  </div>
                </div>
                <div id="line1" class="gateway-chart-box"></div>
              </div>
              <div class="gateway-chart-card gateway-chart-card--tx">
                <div class="gateway-chart-header">
                  <div class="gateway-chart-title">
                    <span class="gateway-chart-icon"><i class="el-icon-data-line"></i></span>
                    <span>{{ $t('gateway.data1') }}</span>
                  </div>
                  <div v-if="txStats" class="gateway-chart-stats">
                    <span class="gateway-chart-stat">
                      <em>{{ $t('LocationIndoorHis.statAvg') }}</em><b>{{ txStats.avg }}</b>
                    </span>
                    <span class="gateway-chart-stat gateway-chart-stat--max">
                      <em>{{ $t('LocationIndoorHis.statMax') }}</em><b>{{ txStats.max }}</b>
                    </span>
                  </div>
                </div>
                <div id="line2" class="gateway-chart-box"></div>
              </div>
            </div>
            <!-- 左键显示内容的 -->
            <div id="popup" class="ol-popup">
              <a href="#" id="popup-closer" class="ol-popup-closer">
                <img src="../../../static/close.jpg" width="11" height="11" alt="" />
              </a>
              <div id="popup-content">
                <ul>
                  <li>{{ $t('home.Gatewaynumber') }}{{ deveuiNum }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t('home.Createdon') }}{{ startAt }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t('home.Dataupdatetime') }}{{ lastAt }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t('home.Company') }}{{ customername }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t('home.Project') }}{{ projectname }}</li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 添加gateway -->
          <el-dialog
            class="device-dialog"
            :title="$t('gateway.addgateway')"
            width="640px"
            v-model="add"
            @close="addCancel('addData')"
            top="5vh"
          >
            <el-form
              :model="addData"
              label-width="130px"
              ref="addData"
              style="text-align: left"
              :rules="addRules"
            >
              <el-form-item :label="$t('gateway.deveui')" prop="deveui" style="margin-right: 2%">
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
                  <template #content><div>
                    <p>{{ $t('gateway.tet1') }}</p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.Alias')" style="margin-right: 2%">
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
                  <template #content><div>
                    <p>{{ $t('gateway.tet2') }}</p>
                  </div></template>
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
                  <template #content><div>
                    <p>{{ $t('gateway.tet3') }}</p>
                  </div></template>
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
            <template #footer><div class="dialog-footer">
              <el-button @click="addCancel('addData')"> {{ $t('terminal.cancel') }}</el-button>
              <el-button type="primary" @click="addTrue('addData')" :loading="loading">
                {{ $t('terminal.confirm') }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 修改gateway -->
          <el-dialog
            :title="$t('gateway.editgateway')"
            v-model="edit"
            class="edit device-dialog"
            :width="contrForPrionum == 5 ? '480px' : '640px'"
            @close="editCancel('editData')"
            top="5vh"
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
              <el-form-item :label="$t('gateway.scheme')" v-if="contrForPrionum != 5">
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
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <template #footer><div class="dialog-footer">
              <el-button @click="editCancel('editData')">{{ $t('terminal.cancel') }}</el-button>
              <el-button type="primary" @click="editTrue('editData')" :loading="loading">{{
                $t('terminal.confirm')
              }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 显示4G信息 -->
          <el-dialog
            class="device-dialog"
            :title="$t('gateway.Networkmode')"
            width="520px"
            v-model="show4Gdialog"
            align-center
          >
            <el-form :model="show4GData" label-width="110px" style="text-align: left">
              <el-form-item :label="$t('gateway.Cardnumber')" prop="name" style="margin-right: 2%">
                <el-input v-model="show4GData.cardid"></el-input>
              </el-form-item>
              <el-form-item :label="$t('gateway.Totalflow')" prop="name" style="margin-right: 2%">
                <el-input v-model="show4GData.totalbytes"></el-input>
              </el-form-item>
              <el-form-item :label="$t('gateway.Usageflow')" prop="name" style="margin-right: 2%">
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
import basecard from '../../components/card/base-card'
import Menu from '../../components/menu/Menu'
import Devicemanagement from '../../components/devicemanagement/devicemanagement'

//地图
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { createOutdoorBaseLayers } from '../../utils/mapSource'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import OlSourceVector from 'ol/source/Vector'
import OlLayerVector from 'ol/layer/Vector'
import OlStyleStyle from 'ol/style/Style'
import OlStyleIcon from 'ol/style/Icon'
import Text from 'ol/style/Text'
import Fill from 'ol/style/Fill'

import Overlay from 'ol/Overlay'
import { defaults as defaultInteractions, DragRotateAndZoom, Modify } from 'ol/interaction'

// 描线
import { Stroke, Style } from 'ol/style'
import { LineString } from 'ol/geom'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature'

//地图控件
import ScaleLine from 'ol/control/ScaleLine' //比例尺控件
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
} from '../../axios/api'
import MapLayerSwitcher from '../../components/map/MapLayerSwitcher'
import mapStyleMixin from '../../mixins/mapStyleMixin'
import { CHART_TONES, chartGradient } from '../../utils/homeChartTheme'
export default {
  mixins: [mapStyleMixin],
  components: {
    Menu,
    Devicemanagement,
    basecard,
    MapLayerSwitcher,
  },
  name: 'GateWay',
  data() {
    return {
      i8n: this.$store.state.i18n,
      outdoorBaseLayers: [],
      deveuiNum: '',
      startAt: '',
      lastAt: '',
      projectname: '',
      customername: '',
      timestamp1: [],
      timestamp2: [],
      rxPacketsReceivedOK: [],
      txPacketsEmitted: [],
      rxStats: null,
      txStats: null,
      contrForPrionum: this.$store.state.userInfo.prionum,
      country: this.$store.state.userInfo.country,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      projectList: [],
      searchProjectList: [],
      multipleSelection: [],
      tableData: [],
      tenantidData: [],
      loading: false,
      searchList: {
        deveui: '',
        scheme: '',
        tenantid: this.$store.state.userInfo.tenantid,
        page: 1,
        count: 10,
        hbstatus: '',
        network: '',
        projectid: '',
      },
      pageCount: 10,
      currentPage1: 1,
      total: 0,
      add: false,
      totalbytes: '',
      totalbytes1: '',
      addData: {
        deveui: '',
        scheme: '',
        tenantid: '',
        country: '',
        memo: '',
        sysmemo: '',
        custom: 1,
        alais: '',
        projectid: '',
        network: '',
        cardid: '',
        totalbytes: '',
      },

      addRules: {
        deveui: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9]{1,16}$/,
            message: this.$t('terminal.tit30'),
            trigger: 'blur',
          },
        ],
        scheme: [
          {
            required: true,
            message: this.$t('gateway.schemestrrules'),
            trigger: 'change',
          },
        ],
        totalbytes: [
          {
            pattern: /^\d+(?:\.\d+)?\s?GG?$/,
            message: this.$t('gateway.tet6'),
            trigger: 'blur',
          },
        ],
      },
      editRules: {
        totalbytes: [
          {
            pattern: /^\d+(?:\.\d+)?\s?GG?$/,
            message: this.$t('gateway.tet6'),
            trigger: 'blur',
          },
        ],
      },
      schemeList: [
        {
          index: 1,
          value: 'CN470',
        },
        {
          index: 2,
          value: 'US915_BAND1',
        },
        {
          index: 3,
          value: 'US915_BAND2',
        },
        {
          index: 4,
          value: 'EU868',
        },
        {
          index: 5,
          value: 'AS923',
        },
        {
          index: 6,
          value: 'IN865',
        },
        {
          index: 7,
          value: 'RU864',
        },
        {
          index: 8,
          value: 'AU915_BAND1',
        },
        {
          index: 9,
          value: 'AU915_BAND2',
        },
        {
          index: 10,
          value: 'KR920',
        },
      ],
      hbstatusList: [
        {
          index: 1,
          value: 'Online',
        },
        {
          index: 2,
          value: 'Offline',
        },
        {
          index: 3,
          value: 'Unknown',
        },
      ],
      typeList: [
        {
          index: 1,
          value: this.$t('gateway.Gcard'),
        },
        {
          index: 2,
          value: this.$t('gateway.wired'),
        },
      ],
      selectschemeList: [],
      edit: false,
      editData: {
        deveui: '',
        scheme: '',
        tenantid: '',
        country: '',
        memo: '',
        sysmemo: '',
        schemestr: '',
        alias: '',
        projectid: '',
        network: '',
        cardid: '',
        totalbytes: '',
      },
      devList: [],

      //地图
      map: '',
      seeLayer: '',
      view: '',
      gatewayLayer: null,
      gatewaySource: null,
      selectedGatewayEui: '',
      gatewayDragFeature: null,
      mapResizeObserver: null,
      show4G: true, //判断是否点击了显示4G流量
      show4Gdialog: false,
      show4GData: {
        cardid: '',
        totalbytes: '',
        totalcount: '',
      },
      clickTrue: true, //用来判断点击表格后是否触发后续的事件
      echarts1: true,
      echarts2: true, //当两个echarts折线图渲染完成后才会触发点击事件
    }
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    //批量同步
    GwToNs() {
      if (this.contrForPrionum == 5) return
      var that = this
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t('terminal.tet8'),
          type: 'warning',
        })
        return
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[0].tenantid != this.multipleSelection[i].tenantid ||
          this.multipleSelection[0].scheme != this.multipleSelection[i].scheme
        ) {
          that.$message({
            message: this.$t('terminal.tet9'),
            type: 'warning',
          })
          return
        }
      }

      this.$confirm(this.$t('terminal.tet10'), this.$t('Building.tips'), {
        customClass: 'device-message-box',
        confirmButtonClass: 'device-message-confirm',
        cancelButtonClass: 'device-message-cancel',
        roundButton: false,
        confirmButtonText: this.$t('terminal.confirm'),
        cancelButtonText: this.$t('terminal.cancel'),
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            let data = {
              deveuis: [],
            }
            for (let i = 0; i < this.multipleSelection.length; i++) {
              data.deveuis.push(this.multipleSelection[i].deveui)
            }
            addGatewayToNs(data, that.tenantkey_A, that.tenantid_A, that.userName).then(res => {
              if (res.code == 1001) {
                that.$message({
                  message: that.$t('terminal.tet11'),
                  type: 'success',
                })
              } else {
                that.$message({
                  message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
                  type: 'error',
                })
              }
            })
          }
        },
      })
    },
    //表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 显示4G流量
    show4Gs(index) {
      this.show4G = false
      let that = this
      const loading = this.$loading({
        lock: true,
        text: this.$t('tet.Loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.action'),
      })
      getGatewayFlow(
        { deveui: that.tableData[index].deveui },
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then(res => {
        that.show4G = true
        if (res.code == 1001) {
          that.show4GData = {
            cardid: that.tableData[index].cardid,
            totalbytes: that.tableData[index].totalbytes,
            totalcount: res.data,
          }
          loading.close()
          that.show4Gdialog = true
        } else {
          loading.close()
          that.$message({
            message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
            type: 'error',
          })
        }
      })
    },
    //选中表格事件
    selectGateway(val) {
      if (!val) return
      var that = this
      // 选中态与地图居中始终生效，不受折线图 / 4G 弹窗状态影响
      that.selectedGatewayEui = val.deveui
      if (that.gatewayLayer) {
        that.gatewayLayer.changed()
      }
      if (that.map && that.map.getView) {
        const lastx = Number(val.lastx) || 0
        const lasty = Number(val.lasty) || 0
        const view = that.map.getView()
        view.setCenter([lastx, lasty], 'EPSG:4326')
        // 选中后聚焦放大；用户已手动放得更大时不回缩
        const targetZoom = 12
        if ((view.getZoom() || 0) < targetZoom) {
          view.setZoom(targetZoom)
        }
      }
      if (that.show4G && that.echarts1 && that.echarts2 && that.clickTrue) {
        that.timestamp1 = []
        that.timestamp2 = []
        that.rxPacketsReceivedOK = []
        that.txPacketsEmitted = []
        let data = {
          deveui: val.deveui,
          tenantid: val.tenantid,
        }
        //单击获取折线图所需要的数据
        if (val.custom == 1) {
          that.clickTrue = false
          that.echarts2 = false
          that.echarts1 = false
          // 系统分配调用
          getGwStats(data, that.tenantkey_A, that.tenantid_A, that.userName).then(res => {
            if (res.code == 1001) {
              if (res.data != null && JSON.parse(res.data).rxPackets.timestamps.length > 0) {
                that.timestamp1 = JSON.parse(res.data).rxPackets.timestamps
                that.rxPacketsReceivedOK = JSON.parse(res.data).rxPackets.datasets[0].data
              }
              if (res.data != null && JSON.parse(res.data).txPackets.timestamps.length > 0) {
                that.timestamp2 = JSON.parse(res.data).txPackets.timestamps
                that.txPacketsEmitted = JSON.parse(res.data).txPackets.datasets[0].data
              }
              that.drawLine1()
              that.drawLine2()
            } else {
              that.$message({
                message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
                type: 'error',
              })
            }
          })
        }
        that.clickTrue = true
      }
    },
    // 折线图统计（卡片头部均值 / 峰值）
    calcLineStats(values) {
      if (!values.length) return null
      const sum = values.reduce((a, b) => a + b, 0)
      return {
        avg: Math.round((sum / values.length) * 10) / 10,
        max: Math.max(...values),
      }
    },
    // 解析接口时间戳：兼容 Unix 秒 / 毫秒、YYYY-MM-DD HH:mm:ss、ISO 字符串
    parseGatewayTime(value) {
      const raw = String(value == null ? '' : value).trim()
      if (!raw) return null
      if (/^\d{10}$/.test(raw)) return new Date(Number(raw) * 1000)
      if (/^\d{13}$/.test(raw)) return new Date(Number(raw))
      const normalized = raw.replace(/\//g, '-').replace(' ', 'T')
      const d = new Date(normalized)
      return isNaN(d.getTime()) ? null : d
    },
    // 横坐标：日期 + 时间分两行，显示日期的同时不挤占横向空间
    formatGatewayTime(value) {
      const d = this.parseGatewayTime(value)
      if (!d) return String(value == null ? '' : value)
      const pad = n => String(n).padStart(2, '0')
      const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
      const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`
      return `${date}\n${time}`
    },
    // tooltip 标题：完整日期时间
    formatGatewayDateTime(value) {
      const d = this.parseGatewayTime(value)
      if (!d) return String(value == null ? '' : value)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    // 与数据分析页一致的圆点 tooltip
    formatLineTooltip(params) {
      const list = Array.isArray(params) ? params : [params]
      if (!list.length) return ''
      const rawAxis = list[0].axisValue
      const head = rawAxis != null && rawAxis !== ''
        ? this.formatGatewayDateTime(rawAxis)
        : list[0].axisValueLabel || list[0].name || ''
      const lines = list.map(p => {
        const val = p.value == null || p.value === '' ? '-' : p.value
        const tone = p.data && p.data.tone ? p.data.tone : null
        const dot = tone
          ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:${tone.c1};box-shadow:0 0 6px rgba(${tone.rgb},.6)"></span>`
          : p.marker
        return `<div style="display:flex;align-items:center;margin-top:4px">${dot}<span style="color:#64748b">${p.seriesName || ''}</span><b style="margin-left:12px;font-size:14px;color:#1f2937;font-family:DIN Alternate,Arial">${val}</b></div>`
      })
      return `<div style="font-weight:600;color:#1f2937">${head}</div>${lines.join('')}`
    },
    // 上 / 下行折线图共用渲染
    renderGatewayLine(elId, times, values, tone, seriesName) {
      const el = document.getElementById(elId)
      if (!el) return null
      const chart = this.$echarts.init(el)
      if (!chart) return null
      const numeric = (values || []).map(v => {
        const n = Number(v)
        return Number.isFinite(n) ? n : 0
      })
      const stats = this.calcLineStats(numeric)
      const pointer = { color: `rgba(${tone.rgb},0.6)`, width: 1, type: 'dashed' }
      chart.setOption(
        {
          title: { show: false },
          color: [tone.c1],
          tooltip: {
            trigger: 'axis',
            triggerOn: 'mousemove|click',
            confine: true,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: [8, 12],
            textStyle: { color: '#1f2937', fontSize: 12 },
            extraCssText: 'border-radius:10px;box-shadow:0 10px 24px rgba(15,23,42,0.12);',
            formatter: this.formatLineTooltip,
            axisPointer: {
              type: 'line',
              snap: true,
              z: 100,
              label: { show: false },
              lineStyle: pointer,
            },
          },
          grid: { left: 12, right: 24, top: 24, bottom: 12, containLabel: true },
          xAxis: {
            type: 'category',
            data: times || [],
            boundaryGap: false,
            axisLine: { lineStyle: { color: '#e2e8f0' } },
            axisTick: { show: false },
            axisLabel: {
              color: '#64748b',
              fontSize: 11,
              lineHeight: 15,
              margin: 10,
              hideOverlap: true,
              formatter: v => this.formatGatewayTime(v),
            },
            axisPointer: { show: true, type: 'line', snap: true, lineStyle: pointer },
          },
          yAxis: {
            type: 'value',
            scale: true,
            splitNumber: 4,
            minInterval: 1,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#94a3b8', fontSize: 11 },
            splitLine: { lineStyle: { color: '#eef2f7', type: 'dashed' } },
          },
          graphic: stats
            ? []
            : [
                {
                  type: 'text',
                  left: 'center',
                  top: 'middle',
                  style: {
                    text: this.$t('LocationIndoorHis.nodata'),
                    fill: '#94a3b8',
                    fontSize: 13,
                  },
                },
              ],
          series: [
            {
              type: 'line',
              name: seriesName,
              data: numeric.map(v => ({ value: v, tone })),
              smooth: 0.35,
              smoothMonotone: 'x',
              showSymbol: numeric.length <= 48,
              symbol: 'circle',
              symbolSize: 7,
              itemStyle: { color: '#fff', borderColor: tone.c1, borderWidth: 2 },
              lineStyle: {
                width: 3,
                color: chartGradient(tone, 0, 0, 1, 0),
                shadowBlur: 10,
                shadowColor: `rgba(${tone.rgb},0.45)`,
                shadowOffsetY: 6,
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: `rgba(${tone.rgb},0.32)` },
                  { offset: 0.7, color: `rgba(${tone.rgb},0.06)` },
                  { offset: 1, color: `rgba(${tone.rgb},0)` },
                ]),
              },
              emphasis: {
                scale: 1.6,
                itemStyle: {
                  color: tone.c1,
                  borderColor: '#fff',
                  borderWidth: 2,
                  shadowBlur: 10,
                  shadowColor: `rgba(${tone.rgb},0.6)`,
                },
                label: {
                  show: true,
                  position: 'top',
                  distance: 8,
                  color: tone.c1,
                  fontSize: 12,
                  fontWeight: 700,
                  formatter: p => (p.value == null ? '-' : String(p.value)),
                },
              },
              label: { show: false },
              markPoint: {
                symbol: 'pin',
                symbolSize: 40,
                data: [{ type: 'max' }],
                itemStyle: {
                  color: chartGradient(tone, 0, 0, 0, 1),
                  shadowBlur: 8,
                  shadowColor: `rgba(${tone.rgb},0.5)`,
                },
                label: {
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'DIN Alternate, Arial',
                },
              },
              markLine: stats
                ? {
                    silent: true,
                    symbol: 'none',
                    data: [{ yAxis: stats.avg }],
                    lineStyle: { color: `rgba(${tone.rgb},0.7)`, type: 'dashed', width: 1 },
                    label: {
                      position: 'insideEndTop',
                      color: tone.c1,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: [2, 6],
                      borderRadius: 8,
                      backgroundColor: `rgba(${tone.rgb},0.1)`,
                      formatter: p =>
                        `${this.$t('LocationIndoorHis.statAvg')} ${Math.round(p.value * 10) / 10}`,
                    },
                  }
                : undefined,
              animationDuration: 1200,
              animationEasing: 'cubicOut',
            },
          ],
        },
        { notMerge: true }
      )
      return stats
    },
    //初始化echarts
    //上行数据量折线图
    drawLine1() {
      this.rxStats = this.renderGatewayLine(
        'line1',
        this.timestamp1,
        this.rxPacketsReceivedOK,
        CHART_TONES.blue,
        this.$t('gateway.data')
      )
      this.echarts1 = true
    },
    //下行数据量折线图
    drawLine2() {
      this.txStats = this.renderGatewayLine(
        'line2',
        this.timestamp2,
        this.txPacketsEmitted,
        CHART_TONES.green,
        this.$t('gateway.data1')
      )
      this.echarts2 = true
    },
    resizeGatewayCharts() {
      const ids = ['line1', 'line2']
      ids.forEach(id => {
        const el = document.getElementById(id)
        const chart = el && this.$echarts.getInstanceByDom(el)
        if (chart) chart.resize()
      })
    },
    //初始化地图
    initMap() {
      this.seeLayer = this.outdoorBaseLayers

      this.view = new View({
        projection: 'EPSG:4326',
        center: [118.804, 32.083],
        zoom: 7,
      })
      setTimeout(() => {
        this.map = new Map({
          target: 'gatewayMap',
          layers: [...this.seeLayer],
          view: this.view,
          interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
        })

        this.map.addControl(new ScaleLine())
        this.mapClick()

        this.addLine(this.map)
        this.renderGatewayMarkers()
        // flex 布局 / 窗口缩放 / 菜单折叠后同步地图尺寸，
        // 避免 canvas 与容器尺寸不一致导致底图被挤压出现横条
        if (typeof ResizeObserver !== 'undefined') {
          this.mapResizeObserver = new ResizeObserver(() => {
            if (this.map) this.map.updateSize()
          })
          this.mapResizeObserver.observe(this.map.getViewport())
        }
      }, 0)
    },

    //点击事件
    mapClick() {
      var that = this
      var coodinate
      this.map.on('click', evt => {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          coodinate = evt.coordinate
          return feature
        })
        if (feature) {
          for (let i = 0; i < that.tableData.length; i++) {
            that.deveuiNum = that.tableData[i].deveui
            that.startAt = that.formatTime(that.tableData[i].firsttime)
            that.lastAt = that.formatTime(that.tableData[i].statustime)
            that.projectname = that.tableData[i].projectname
            that.customername = that.tableData[i].customername
            if (feature.values_.deveui == that.tableData[i].deveui) {
              $('#popup').css('display', 'block')
              var container = document.getElementById('popup') //最外层包含所有元素的div
              var overlay = new Overlay({
                //设置弹出框的容器
                element: container,
                //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
                autoPan: true,
              })
              overlay.setPosition(coodinate)
              that.map.addOverlay(overlay)
              $('#popup-closer').on('click', function (event) {
                event.preventDefault()
                overlay.setPosition(undefined)
              }) // 点击关闭的按钮
              return
            }
          }
        }
      })
    },

    // 基站样式：图标按心跳状态着色，选中行放大图标并把设备号文字变红
    gatewayMarkerStyle(feature) {
      const status = feature.get('hbstatus')
      let iconSrc = '../../../static/baseon.png'
      if (status == 2) {
        iconSrc = '../../../static/baseoff.png'
      } else if (status != null && status !== '' && status != 1) {
        iconSrc = '../../../static/basenull.png'
      }
      const selected = feature.get('deveui') === this.selectedGatewayEui
      return new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: iconSrc,
          scale: selected ? 1.3 : 1,
        }),
        text: new Text({
          text: feature.get('deveui'),
          font: '16px font-size',
          fill: new Fill({
            color: selected ? 'red' : 'blue',
          }),
          offsetY: 10,
        }),
      })
    },
    // 移除全量基站图层与拖拽交互
    clearGatewayLayer() {
      if (this.map && this.map.getInteractions) {
        this.map
          .getInteractions()
          .getArray()
          .slice()
          .forEach(interaction => {
            if (interaction instanceof Modify) {
              this.map.removeInteraction(interaction)
            }
          })
      }
      if (this.gatewayLayer && this.map && this.map.removeLayer) {
        this.map.removeLayer(this.gatewayLayer)
      }
      if (this.gatewaySource) {
        this.gatewaySource.clear()
      }
      this.gatewayLayer = null
      this.gatewaySource = null
    },
    // 按当前列表重画全部基站（单图层 + 多要素）
    renderGatewayMarkers() {
      if (!this.map) return
      const features = []
      const list = this.tableData || []
      list.forEach(item => {
        const lng = Number(item.lastx)
        const lat = Number(item.lasty)
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) return
        features.push(
          new OlFeature({
            tenantid: item.tenantid,
            deveui: item.deveui,
            hbstatus: item.hbstatus,
            longitude: lng,
            latitude: lat,
            geometry: new OlGeomPoint([lng, lat]),
          })
        )
      })
      // Modify 的 modifyend 给的是 source 里「全部」要素，
      // 用 geometry 的 change 事件记下真正被拖动的那一个
      this.gatewayDragFeature = null
      features.forEach(f => {
        f.on('change', () => {
          this.gatewayDragFeature = f
        })
      })
      // 搜索 / 翻页后旧选中行可能已不在列表里
      if (
        this.selectedGatewayEui &&
        !features.some(f => f.get('deveui') === this.selectedGatewayEui)
      ) {
        this.selectedGatewayEui = ''
      }
      this.clearGatewayLayer()
      if (!features.length) return
      this.gatewaySource = new OlSourceVector({ features: features })
      this.gatewayLayer = new OlLayerVector({
        source: this.gatewaySource,
        style: feature => this.gatewayMarkerStyle(feature),
        zIndex: 5,
      })
      this.map.addLayer(this.gatewayLayer)
      this.modifyFeature(this.map, this.gatewaySource)
    },

    //拖拽
    modifyFeature(map, source) {
      var that = this
      var modify = new Modify({
        source: source,
      })

      //移动后：e.features 是 source 里「全部」基站，item(0) 并非本次被拖的那台；
      // 优先用 change 监听记录的要素，兜底按拖拽终点找最近的要素
      modify.on('modifyend', e => {
        let feature = that.gatewayDragFeature
        if (!feature && e.mapBrowserEvent && e.mapBrowserEvent.coordinate) {
          feature = source.getClosestFeatureToCoordinate(e.mapBrowserEvent.coordinate)
        }
        if (!feature) return
        const deveui = feature.get('deveui')
        if (!deveui) return
        const rawCoord = feature.getGeometry().getCoordinates()
        const lng = rawCoord[0]
        const lat = rawCoord[1]
        const latInvalid = !Number.isFinite(lat) || lat <= -90 || lat >= 90
        if (!Number.isFinite(lng) || latInvalid) {
          // 纬度越界（或非数值）无地理意义：拒绝保存，图标回到拖拽前的位置
          feature.getGeometry().setCoordinates([
            Number(feature.get('longitude')) || 0,
            Number(feature.get('latitude')) || 0,
          ])
          that.$message({
            message: !Number.isFinite(lng)
              ? that.$t('Building.longiInvalid')
              : that.$t('Building.latiInvalid'),
            type: 'warning',
          })
          return
        }
        // 经度是环绕的：往右跨过日期变更线时视图坐标会累加到 180~360，
        // 折算回 [-180,180] 后地理等价，可以正常提交（如 240 -> -120 北美洲）
        const normalizedLng =
          lng >= -180 && lng <= 180
            ? lng
            : ((lng + 180) % 360 + 360) % 360 - 180
        if (normalizedLng !== lng) {
          feature.getGeometry().setCoordinates([normalizedLng, lat])
        }
        let data = {
          deveui: deveui,
          longitude: normalizedLng,
          latitude: lat,
        }
        updateGatewayLocation(data, that.tenantkey_A, that.tenantid_A, that.userName).then(res => {
          if (res.code != 1001) {
            that.$message({
              message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
              type: 'error',
            })
            return
          }
          // 保存成功后才更新「已保存位置」，供越界拒绝时恢复
          feature.set('longitude', data.longitude)
          feature.set('latitude', data.latitude)
          // 同步表格坐标，避免再次点击该行时地图回到旧位置
          const row = that.tableData.find(item => item.deveui === deveui)
          if (row) {
            row.lastx = data.longitude
            row.lasty = data.latitude
          }
        })
      })
      map.addInteraction(modify)
    },

    // 描线（南海）
    addLine(map) {
      var style = new Style({
        stroke: new Stroke({
          color: '#AA8DC6',
          width: 10,
        }),
      })

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
      ])
      var source = new VectorSource({
        wrapX: false,
      })
      var outlineStroke = new Style({
        stroke: new Stroke({
          color: [170, 141, 198, 1],
          lineDash: [2, 7],
        }),
      })
      function getAnimationStrokeStyle() {
        return new Style({
          stroke: new Stroke({
            color: [170, 141, 198, 1],
            widht: 5,
            lineDash: [2, 7], //一组线段和间距交互的数组，可以控制虚线的长度
            lineDashOffset: feature.get('dashOffset'), //偏移量，控制虚线的速度和方向
          }),
        })
      }
      //手动添加数据的矢量数据
      var feature = new Feature({
        geometry: line,
        finished: false,
        dashOffset: -8,
      })

      function getStyle() {
        return [outlineStroke, getAnimationStrokeStyle()]
      }
      var array = []
      feature.setStyle(getStyle())
      source.addFeature(feature)
      var flightsLayer = new VectorLayer({
        source: source,
        style: style,
      })
      map.addLayer(flightsLayer)
      setInterval(() => {
        let offset1 = feature.get('dashOffset')
        offset1 = offset1 == 0 ? -8 : offset1 + 1

        feature.set('dashOffset', offset1)
        feature.setStyle(getStyle())
      }, 100)
    },

    //分页
    handleCurrentChange(val) {
      this.searchList.page = val
      this.searchList.count = this.pageCount
      this.getGatewayLists()
    },
    handleSizeChange(val1) {
      this.pageCount = val1
      this.searchList.count = val1
      this.searchList.page = 1
      this.currentPage1 = 1
      this.getGatewayLists()
    },
    // utc转本地
    datetimecut(UTCDateString) {
      if (!UTCDateString) {
        return '-'
      }
      function formatFunc(str) {
        return str > 9 ? str : '0' + str
      }
      var date2 = new Date(UTCDateString)
      var year = date2.getFullYear()
      var mon = formatFunc(date2.getMonth() + 1)
      var day = formatFunc(date2.getDate())
      var hour = date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()

      var min = formatFunc(date2.getMinutes())
      var sec = formatFunc(date2.getSeconds())
      var dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec
      return dateStr
    },
    //时间转换
    formatDateFirsttime(row, column) {
      if (row.firsttime == null || row.firsttime == 0) {
        return ''
      }
      let date = new Date(parseInt(row.firsttime) * 1000)
      let date2 = date.toUTCString()
      return this.datetimecut(date2)
    },
    formatDateStatustime(row, column) {
      if (row.statustime == null || row.statustime == 0) {
        return ''
      }
      let date = new Date(parseInt(row.statustime) * 1000)
      let date2 = date.toUTCString()
      return this.datetimecut(date2)
    },
    formatTime(time) {
      if (time == null || time == 0) {
        return ''
      }
      let date = new Date(parseInt(time) * 1000)
      let date2 = date.toUTCString()
      return this.datetimecut(date2)
    },

    //添加基站
    addGateways() {
      if (this.contrForPrionum == 5) return
      this.totalbytes = ''
      this.addData = {
        deveui: '',
        scheme: '',
        tenantid: '',
        country: '',
        memo: '',
        sysmemo: '',
        custom: 1,
        alias: '',
        projectid: '',
        network: '',
        cardid: '',
        totalbytes: '',
      }
      if (this.contrForPrionum != 1 && this.contrForPrionum != 2) {
        this.selectScheme(this.tenantid_A)
      }
      this.add = true
    },
    addCancel(addData) {
      this.add = false
      this.loading = false
      this.$refs[addData].resetFields()
    },
    addTrue(addData) {
      if (this.contrForPrionum == 5) return
      var that = this
      this.$refs[addData].validate(valid => {
        if (valid) {
          if (that.contrForPrionum == 3 || that.contrForPrionum == 4) {
            that.addData.country = that.country
            that.addData.tenantid = that.tenantid_A
            that.addData.custom = 2
          } else {
            for (let i = 0; i < that.tenantidData.length; i++) {
              if (that.tenantidData[i].tenantid == that.addData.tenantid) {
                that.addData.country = that.tenantidData[i].country
              }
            }
          }
          this.loading = true

          addGateway(that.addData, that.tenantkey_A, that.tenantid_A, that.userName).then(res => {
            if (res.code == 1001) {
              that.add = false
              that.searchList.page = 1
              that.currentPage1 = 1
              that.getGatewayLists()
              that.getCustomerNames()
              that.getSearchGatewayList()
              that.$message({
                message: that.$t('gateway.addsuccess'),
                type: 'success',
              })
              that.loading = false

              that.$refs[addData].resetFields()
            } else {
              that.$message({
                message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
                type: 'error',
              })
              that.loading = false
            }
          })
        } else {
          return false
        }
      })
    },

    //获取基站信息
    getGatewayLists() {
      var that = this
      getGatewayList(this.searchList, this.tenantkey_A, this.tenantid_A, this.userName).then(
        res => {
          if (res.code == 1001) {
            that.tableData = res.data.list
            that.total = res.data.size
            that.renderGatewayMarkers()
            const currentRow =
              that.tableData.find(item => item.custom == 1) || that.tableData[0]
            if (currentRow) {
              that.$nextTick(() => {
                if (that.$refs.multipleTable) {
                  that.$refs.multipleTable.setCurrentRow(currentRow)
                }
              })
            }
          }
        }
      )
    },

    //修改gateway
    gatewayEdit(row) {
      this.show4G = false
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        if (row.custom == 2) {
          this.$message({
            message: this.$t('gateway.editgatewayrules'),
            type: 'warning',
          })
          return
        }
      }
      this.editData.deveui = row.deveui
      this.editData.tenantid = row.tenantid
      this.editData.country = row.country
      this.editData.memo = row.memo
      this.editData.sysmemo = row.sysmemo
      this.editData.alias = row.alias
      this.editData.schemestr = row.schemestr
      this.editData.projectid = row.projectid
      this.editData.cardid = row.cardid
      this.editData.network = row.network
      this.totalbytes1 = row.totalbytes
        ? row.totalbytes.substr(0, row.totalbytes.length - 1)
        : ''

      this.selectScheme(this.editData.tenantid)
      this.edit = true
    },
    editCancel(editData) {
      this.edit = false
      this.loading = false
      this.show4G = true
      this.$refs[editData].resetFields()
    },
    editTrue(editData) {
      var that = this
      this.$refs[editData].validate(valid => {
        if (valid) {
          this.editData.scheme = this.editData.schemestr
          if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
            for (let i = 0; i < that.tenantidData.length; i++) {
              if (that.tenantidData[i].tenantid == that.editData.tenantid) {
                that.editData.country = that.tenantidData[i].country
              }
            }
          }

          this.loading = true
          updateGateway(that.editData, that.tenantkey_A, that.tenantid_A, that.userName).then(
            res => {
              if (res.code == 1001) {
                that.edit = false
                that.getGatewayLists()
                that.getCustomerNames()
                that.getSearchGatewayList()
                that.$message({
                  message: that.$t('gateway.editsuccess'),
                  type: 'success',
                })
                that.loading = false
                that.show4G = true
                that.$refs[editData].resetFields()
              } else {
                that.$message({
                  message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
                  type: 'error',
                })
                that.loading = false
              }
            }
          )
        } else {
          return false
        }
      })
    },

    //删除gateway
    gatewayDele(row) {
      if (this.contrForPrionum == 5) return
      if (
        (this.$store.state.userInfo.prionum == 5 && this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t('staffmanagement.permissiondelete'),
          type: 'warning',
        })
        return
      }
      var that = this
      //系统分配的设备无法删除
      if (
        (this.contrForPrionum == 3 && row.custom == 1) ||
        (this.contrForPrionum == 4 && row.custom == 1)
      ) {
        this.$message({
          message: this.$t('gateway.deletegatewayrules'),
          type: 'warning',
        })
        return
      } else if (this.contrForPrionum == 1 && row.custom == 2) {
        this.$message({
          message: this.$t('gateway.deletegatewayrules1'),
          type: 'warning',
        })
        return
      }
      this.$confirm(
        this.$t('gateway.deletemsg') + row.deveui + this.$t('gateway.deletemsg1'),
        this.$t('Building.tips'),

        {
          customClass: 'device-message-box',
          confirmButtonClass: 'device-message-confirm',
          cancelButtonClass: 'device-message-cancel',
          roundButton: false,
          confirmButtonText: this.$t('terminal.confirm'),
          cancelButtonText: this.$t('terminal.cancel'),
          type: 'warning',
        }
      ).then(() => {
        let data = {
          deveui: row.deveui,
        }
        delGateway(data, that.tenantkey_A, that.tenantid_A, that.userName).then(res => {
          if (res.code == 1001) {
            that.getGatewayLists()
            that.getCustomerNames()
            that.getSearchGatewayList()
            that.$message({
              message: that.$t('gateway.deletesuccess'),
              type: 'success',
            })
          } else {
            $message({
              message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
              type: 'error',
            })
          }
        })
      })
    },

    //回收
    gatewayBack(row) {
      if (this.contrForPrionum == 5) return
      var that = this
      this.$confirm(
        this.$t('beacon.tet13') + row.deveui + this.$t('gateway.deletemsg1'),
        this.$t('Building.tips'),
        {
          customClass: 'device-message-box',
          confirmButtonClass: 'device-message-confirm',
          cancelButtonClass: 'device-message-cancel',
          roundButton: false,
          confirmButtonText: this.$t('terminal.confirm'),
          cancelButtonText: this.$t('terminal.cancel'),
          type: 'warning',
        }
      ).then(() => {
        let data = {
          deveui: row.deveui,
        }
        updateGatewayRemoveProject(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          res => {
            if (res.code == 1001) {
              that.getGatewayLists()
              that.getCustomerNames()
              that.getSearchGatewayList()
              that.$message({
                message: that.$t('gateway.Recyclingsucceeded'),
                type: 'success',
              })
            } else {
              that.$message({
                message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
                type: 'error',
              })
            }
          }
        )
      })
    },

    //搜索gateway
    searchGateway() {
      this.searchList.page = 1
      this.currentPage1 = 1
      var that = this
      // if (this.contrForPrionum != "系统管理员") {
      //   this.searchList.tenantid = this.tenantid_A;
      // }
      getGatewayList(this.searchList, this.tenantkey_A, this.tenantid_A, this.userName).then(
        res => {
          if (res.code == 1001) {
            that.tableData = res.data.list
            that.total = res.data.size
            that.renderGatewayMarkers()
            if (res.data.size > 0) {
              that.$message({
                message: that.$t('gateway.searchsuccess'),
                type: 'success',
              })
            } else {
              that.$message({
                message: that.$t('gateway.nodata'),
                type: 'success',
              })
            }
          } else {
            that.$message({
              message: that.$store.state.i18n == 'zh' ? res.msg : res.enMsg,
              type: 'error',
            })
          }
        }
      )
    },

    // 刷新
    clearButton() {
      this.pageCount = 10;
      if (this.$store.state.userInfo.prionum == 1 || this.$store.state.userInfo.prionum == 2) {
        this.searchList = {
          deveui: '',
          scheme: '',
          tenantid: '',
          page: 1,
          count: 10,
          hbstatus: '',
          network: '',
          projectid: '',
        }
      } else if (this.$store.state.userInfo.prionum == 5) {
        this.searchList = {
          deveui: '',
          scheme: '',
          tenantid: this.$store.state.intoProjectSuperid,
          page: 1,
          count: 10,
          hbstatus: '',
          network: '',
          projectid: this.$store.state.projectid,
        }
      } else {
        this.searchList = {
          deveui: '',
          scheme: '',
          tenantid: this.$store.state.userInfo.tenantid,
          page: 1,
          count: 10,
          hbstatus: '',
          network: '',
          projectid: '',
        }
      }

      this.currentPage1 = 1
      this.getGatewayLists()
    },
    //获取所有的Tenantid
    getCustomerNames() {
      var that = this
      if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
        let data = {
          beginlevel: 1,
          endlevel: 3,
        }
        getCustomerName(data, that.tenantkey_A, that.tenantid_A, that.userName).then(res => {
          that.tenantidData = res.data
        })
      }
    },

    //获取设备号下拉框
    getSearchGatewayList(event) {
      let data = {}
      if (this.$store.state.userInfo.prionum == 1 || this.$store.state.userInfo.prionum == 2) {
        data = {
          tenantid: event,
        }
      } else if (this.$store.state.userInfo.prionum == 5) {
        data = {
          tenantid: this.$store.state.intoProjectSuperid,
          projectid: this.$store.state.projectid,
        }
      } else {
        data = {
          tenantid: this.$store.state.userInfo.tenantid,
        }
      }
      getGatewayList(data, this.tenantkey_A, this.tenantid_A, this.userName).then(res => {
        this.devList = res.data.list
      })
    },

    //系统管理员添加设备时根据选择的公司来获取相对应的设备制式
    selectScheme(event) {
      this.selectschemeList = []
      let data = {
        tenantid: event,
      }
      getSchemes(data, this.tenantkey_A, this.tenantid_A, this.userName).then(res => {
        let scheme = {}
        let schemes = res.data.split(',')
        for (let i = 0; i < schemes.length; i++) {
          scheme = {
            index: i,
            value: schemes[i],
          }
          this.selectschemeList.push(scheme)
        }
      })

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
      }
      getProjectListByTenantid(data, this.tenantkey_A, this.tenantid_A, this.userName).then(res => {
        this.projectList = res.data.list
      })
    },

    //获取项目搜索下拉框（权限3/4，参考终端管理）
    getProjectLists() {
      let data = {
        superid: this.tenantid_A,
      }
      getProjectListByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then(res => {
        this.searchProjectList = res.data.list
      })
    },
  },
  beforeMount() {
    this.outdoorBaseLayers = createOutdoorBaseLayers(
      this.$store.state.i18n == 'zh'
    )
    if (this.$store.state.userInfo.prionum == 1 || this.$store.state.userInfo.prionum == 2) {
      this.searchList = {
        deveui: '',
        scheme: '',
        tenantid: '',
        page: 1,
        count: 10,
        hbstatus: '',
        network: '',
        projectid: '',
      }
    }
    if (this.$store.state.userInfo.prionum == 5) {
      this.searchList = {
        deveui: '',
        scheme: '',
        tenantid: this.$store.state.intoProjectSuperid,
        page: 1,
        count: 10,
        hbstatus: '',
        network: '',
        projectid: this.$store.state.projectid,
      }
    }
    if (this.$store.state.userInfo.prionum == 3 || this.$store.state.userInfo.prionum == 4) {
      this.searchList = {
        deveui: '',
        scheme: '',
        tenantid: this.$store.state.userInfo.tenantid,
        page: 1,
        count: 10,
        hbstatus: '',
        network: '',
        projectid: '',
      }
      this.getSearchProjectList(this.$store.state.userInfo.tenantid)
      this.getProjectLists()
    }

    this.getCustomerNames()
    this.getSearchGatewayList()
    this.initMap()
    this.getGatewayLists()
  },
  mounted() {
    this.drawLine1()
    this.drawLine2()
    window.addEventListener('resize', this.resizeGatewayCharts)
  },
  beforeUnmount() {
    this.clearGatewayLayer()
    if (this.mapResizeObserver) {
      this.mapResizeObserver.disconnect()
      this.mapResizeObserver = null
    }
    window.removeEventListener('resize', this.resizeGatewayCharts)
    const ids = ['line1', 'line2']
    ids.forEach(id => {
      const el = document.getElementById(id)
      const chart = el && this.$echarts.getInstanceByDom(el)
      if (chart && !chart.isDisposed()) chart.dispose()
    })
  },
  watch: {
    totalbytes(v) {
      if (v) {
        this.addData.totalbytes = `${v}G`
      } else {
        this.addData.totalbytes = ''
      }
    },
    totalbytes1(v) {
      if (v) {
        this.editData.totalbytes = `${v}G`
      } else {
        this.editData.totalbytes = ''
      }
    },
    '$i18n.locale'() {
      this.i8n = this.$store.state.i18n
      Object.assign(this.$data.addRules, this.$options.data.call(this).addRules)
      Object.assign(this.$data.editRules, this.$options.data.call(this).editRules)
      Object.assign(this.$data.typeList, this.$options.data.call(this).typeList)

      this.drawLine1()
      this.drawLine2()
    },
  },
}
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
.user {
  height: 100%;
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

.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}
.el-table :deep(.hover-row td,
.el-table >>> .current-row td) {
  background-color: #d9eafa !important;
}
.query,
.reset,
.add {
  padding: 8px 14px !important;
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

.terminal-filter-flow .gateway-search-form :deep(.el-form-item .el-form-item__content) {
  flex: 0 0 auto;
  min-width: 0;
}

/* 地图 */
.mapConent {
  display: flex;
}

.gateway-map-wrap {
  position: relative;
  width: 47%;
}

.tips {
  display: block;
  margin: 0 !important;
  padding: 8px 14px 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #64748b;
  text-align: left;
}
/* 图层切换控件的定位锚点：紧跟提示条、不占布局高度 */
.gateway-map-anchor {
  position: relative;
  z-index: 20;
  height: 0;
  margin: 0 !important;
}
#gatewayMap {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 550px;
  width: 100%;
}
#lineChart {
  width: 50%;
  height: 550px;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 与外层 page-panel 顶部的渐变条拉开距离 */
  padding: 12px 12px 12px 0;
  margin: 0 0 0 3% !important;
}

/* 折线图卡片：圆角与统计胶囊沿用数据分析页风格，渐变顶条由外层 page-panel 提供 */
.gateway-chart-card {
  --tone-c1: #2f7bff;
  --tone-c2: #22d3ee;
  --tone-rgb: 47, 123, 255;
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
  margin: 0 !important;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: radial-gradient(
      120% 80% at 100% 0%,
      rgba(var(--tone-rgb), 0.06),
      rgba(var(--tone-rgb), 0) 55%
    ),
    #fff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.25s ease;
}
/* 外层 mapConent.page-panel 自带一条贯穿整宽的渐变顶条，卡片不再重复叠加 */
.gateway-chart-card:hover {
  box-shadow: 0 8px 24px rgba(var(--tone-rgb), 0.12);
}
.gateway-chart-card--tx {
  --tone-c1: #059669;
  --tone-c2: #34d399;
  --tone-rgb: 16, 185, 129;
}
.gateway-chart-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px 4px;
  margin: 0 !important;
  box-sizing: border-box;
}
.gateway-chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin: 0 auto 0 0 !important;
  font-weight: 700;
  font-size: 15px;
  color: #1f2937;
  text-align: left !important;
}
.gateway-chart-title > span {
  margin: 0 !important;
}
.gateway-chart-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin: 0 !important;
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  background: linear-gradient(135deg, var(--tone-c2), var(--tone-c1));
  box-shadow: 0 4px 10px rgba(var(--tone-rgb), 0.35);
}
.gateway-chart-stats {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 !important;
}
.gateway-chart-stat {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  margin: 0 !important;
  padding: 3px 10px;
  border-radius: 14px;
  background: #f5f7fb;
  border: 1px solid #eef2f7;
}
.gateway-chart-stat em {
  font-style: normal;
  font-size: 12px;
  color: #8a94a6;
}
.gateway-chart-stat b {
  font-size: 15px;
  line-height: 1;
  color: #1f2937;
  font-family: 'DIN Alternate', Arial, sans-serif;
}
.gateway-chart-stat--max {
  background: rgba(var(--tone-rgb), 0.08);
  border-color: rgba(var(--tone-rgb), 0.18);
}
.gateway-chart-stat--max b {
  color: var(--tone-c1);
}
.gateway-chart-box {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  margin: 0 !important;
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

/* 地图占满提示条之外的剩余高度；原来 95% 是按整个容器算的，会把底部顶出卡片被裁掉 */
#gatewayMap >>> .ol-viewport {
  flex: 1 1 auto;
  height: auto !important;
  min-height: 0;
}
.icon_button {
  padding: 2px 16px !important;
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

