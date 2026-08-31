<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <!-- <el-aside><Project /></el-aside> -->
        <el-main>
          <div class="project_input terminal-filter-flow" :class="filterLangClass">
            <el-form
              class="demo-form-inline terminal-filter-form"
              :model="searchList"
            >
              <el-form-item
                :label="$t('project.ProjectName')"
               class="terminal-filter-item">
                <el-select
                  v-model="searchList.name"
                  :placeholder="$t('project.Pleaseproject')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in searchProjectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('project.Locationtype')"
               class="terminal-filter-item">
                <el-select
                  v-model="searchList.type"
                  :placeholder="$t('project.Pleasetype')"
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
                :label="$t('project.Projecttype')"
               class="terminal-filter-item">
                <el-select
                  v-model="searchList.projectype"
                  :placeholder="$t('project.Pleaseitem')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in projectypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="terminal-toolbar-item">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchProject()"
                  >{{ $t("project.search") }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="clearProject()"
                  >{{ $t("project.reset") }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="importExcel()"
                  >{{ $t("terminal.import") }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="exportExcel()"
                  >{{ $t("terminal.export") }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  @click="exportExcelAll()"
                  >{{ $t("terminal.exportAll") }}</el-button>
                <el-button
                  type="primary"
                  class="add"
                  @click="addProjects()"
                  v-if="contrForPrionum != 5"
                  >{{ $t("project.additem") }}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 项目展示 -->
          <div class="content_project">
            <div class="exportContent" style="display: flex">
              <input
                id="articleImageFile"
                name="excelFile"
                type="file"
                class="x_file"
                accept=".xls,.xlsx"
                @change="importExcels"
              />
              <input
                id="articleFbxFile"
                name="fbxFile"
                type="file"
                accept=".fbx,.FBX"
                ref="fileInputFBX"
                @change="importFBX"
              />
            </div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 96%; text-align: center; margin-left: 2%"
              max-height="300"
              border
              highlight-current-row
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                property="name"
                :label="$t('staff.projectname')"
                show-overflow-tooltip
                align="center"
                min-width="150"
              ></el-table-column>
              <el-table-column
                property="projectid"
                :label="$t('project.ItemNo')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="customername"
                :label="$t('project.Affiliatedcompany')"
                show-overflow-tooltip
                align="center"
                min-width="100"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'typestr' : 'entype'"
                min-width="100"
                :label="$t('project.LocationType')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                :label="$t('project.DatatimeColumn')"
                show-overflow-tooltip
                align="center"
                min-width="120"
              >
                <template #default="scope">
                  {{
                    scope.row.type === 2 &&
                    scope.row.datatime !== "" &&
                    scope.row.datatime != null
                      ? scope.row.datatime / 1000 + $t("project.DatatimeUnit")
                      : "/"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'projectypestr' : 'enprojectype'"
                :label="$t('project.Projectype')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="scheme"
                :label="$t('terminal.Standard')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="buildnum"
                show-overflow-tooltip
                align="center"
                min-width="130"
              >
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("project.Numberbuildings")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>{{ $t("project.tet") }}</p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip> </template></el-table-column>
              <el-table-column
                property="mapnum"
                show-overflow-tooltip
                align="center"
                min-width="110"
              >
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("project.mapNumber")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>{{ $t("project.tet1") }}</p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip> </template></el-table-column>
              <el-table-column
                :label="$t('floormanagement.EquipmentQuantity')"
                show-overflow-tooltip
                align="center"
                min-width="100"
              >
                <template #default="scope">
                  {{ (scope.row.devnum || 0) + (scope.row.othernum || 0) }}
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('project.forward')"
                min-width="100"
                align="center"
              >
                <template #default="scope">
                  <el-button text
                    v-if="scope.row.forward !== 3"
                    @click="showForwards(scope.$index)"
                    size="small"
                    style="width: 60%"
                    >{{ $t("project.see") }}</el-button>
                  <p v-if="scope.row.forward === 3">
                    {{ $t("project.unconfigured") }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('project.Networkserver1')"
                min-width="100"
                align="center"
              >
                <template #default="scope">
                  <el-button text
                    v-if="scope.row.net != 5"
                    @click="showNetInfo(scope.$index)"
                    size="small"
                    style="width: 60%"
                    >{{ $t("inspection.Check") }}</el-button>
                  <p v-if="scope.row.net == 5">{{ $t("project.other") }}</p>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('project.FBX')"
                min-width="100"
                align="center"
              >
                <template #default="scope">
                  <el-button text
                    v-if="scope.row.filename"
                    @click="showFBX(scope.$index)"
                    size="small"
                    style="width: 60%"
                    >{{ $t("project.see") }}</el-button>
                  <p v-else>
                    {{ $t("project.unconfigured") }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                min-width="120"
                property="memo"
                :label="$t('project.memo')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                fixed="right"
                class-name="operation"
                :label="$t('project.operation')"
                align="center"
                min-width="120"
                v-if="contrForPrionum != 5"
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
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="small"
                          class="edits"
                          @click="projectEdit(scope.row)"
                          >{{ $t("project.edit") }}</el-button></el-dropdown-item>
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="small"
                          class="dels1"
                          @click="projectDele(scope.row)"
                          v-if="delprio == 1"
                          >{{ $t("project.delete") }}</el-button></el-dropdown-item>
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="small"
                          class="edits"
                          @click="importFbx(scope.$index)"
                          >{{ $t("project.importFBX") }}</el-button></el-dropdown-item>
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="small"
                          class="dels1"
                          @click="removeFbx(scope.$index)"
                          >{{ $t("project.deleteFBX") }}</el-button></el-dropdown-item>
                    </el-dropdown-menu></template>
                  </el-dropdown>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('project.Enterproject')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      class="icon_button"
                      @click="projectInto(scope.row)"
                      ><img src="../../../static/intoproject.png"
                    /></el-button>
                  </el-tooltip>
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
                v-model:current-page="currentPage1"
                v-model:page-size="pageCount"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>

          <div class="mapConent" style="position: relative">
            <MapLayerSwitcher :map="map" @change="onMapStyleChange" />
            <div id="projectMap"></div>
            <!-- 左键显示内容的 -->
            <div id="popup" class="ol-popup">
              <a href="#" id="popup-closer" class="ol-popup-closer">
                <img
                  src="../../../static/close.jpg"
                  width="11"
                  height="11"
                  alt=""
              /></a>
              <div id="popup-content">
                <ul>
                  <li>{{ $t("project.ProjectName") }}{{ projectName }}</li>
                  <el-divider class="divider"></el-divider>
                  <li>{{ $t("project.Totalfloors") }}{{ groundNum }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 显示mqtt相关信息 -->
          <el-dialog
            :title="$t('project.tet4')"
            width="55%"
            v-model="showForward"
            style="text-align: center"
            @close="closeForward()"
          >
            <el-form
              :model="forwardDatas"
              label-width="110px"
              ref="forwardDatas"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('project.ProjectName')"
                prop="name"
                style="margin-right: 2%"
              >
                <el-input v-model="forwardDatas.name"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.httpUrl')"
                prop="name"
                style="margin-right: 2%"
                v-if="showHttpUrlInfo"
              >
                <el-input v-model="forwardDatas.url"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.mqtt')"
                prop="name"
                style="margin-right: 2%"
                v-if="!showHttpUrlInfo"
              >
                <el-input :value="mqttBrokerUrl"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.Subscriptionsubject')"
                prop="name"
                style="margin-right: 2%"
                v-if="!showHttpUrlInfo"
              >
                <el-input v-model="forwardDatas.url"></el-input>
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
                      {{ $t("project.tet5") }}
                      <a
                        :href="assetBase + '/guide/dataforward.html'"
                        target="_blank"
                        >{{ $t("project.tet6") }}</a>
                      。
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                label="AppID："
                prop="name"
                style="margin-right: 2%"
                v-if="!showHttpUrlInfo"
              >
                <el-input v-model="forwardDatas.mqttname"></el-input>
              </el-form-item>
              <el-form-item
                label="AppSecret："
                prop="name"
                style="margin-right: 2%"
                v-if="!showHttpUrlInfo"
              >
                <el-input v-model="forwardDatas.mqttpwd"></el-input>
              </el-form-item>
            </el-form>
          </el-dialog>

          <!-- 显示网络服务器相关信息 -->
          <el-dialog
            :title="$t('project.text6')"
            width="55%"
            v-model="showNet"
            style="text-align: center"
            @close="closeNet()"
          >
            <el-form
              :model="netDatas"
              label-width="170px"
              ref="netDatas"
              style="text-align: left"
            >
              <el-form-item
                v-if="i8n == 'zh'"
                :label="$t('project.Networkserver2')"
                style="margin-right: 2%"
              >
                <el-input v-model="netDatas.netstr"></el-input>
              </el-form-item>
              <el-form-item
                v-if="i8n != 'zh'"
                :label="$t('project.Networkserver2')"
                style="margin-right: 2%"
              >
                <el-input v-model="netDatas.ennet"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.area')"
                style="margin-right: 2%"
                v-if="showNsInfo"
              >
                <el-input v-model="netDatas.nsname"></el-input>
              </el-form-item>
              <el-form-item
                label="MQTT Broker："
                style="margin-right: 2%"
                v-if="showTTNInfo || showMQTTInfo"
              >
                <el-input v-model="netDatas.ttnbroker"></el-input>
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
                      {{ $t("project.text17") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('usercenter.user')"
                style="margin-right: 2%"
                v-if="showTTNInfo || showMQTTInfo"
              >
                <el-input v-model="netDatas.ttname"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.password')"
                style="margin-right: 2%"
                v-if="showTTNInfo || showMQTTInfo"
              >
                <el-input v-model="netDatas.ttnpwd"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.text3')"
                style="margin-right: 2%"
                v-if="showHTTPInfo || showMQTTInfo"
              >
                <el-input v-model="netDatas.uptopic"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.text4')"
                style="margin-right: 2%"
                v-if="showHTTPInfo || showMQTTInfo"
              >
                <el-input v-model="netDatas.downtopic"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('ns.password1')"
                style="margin-right: 2%"
                v-if="showHTTPInfo"
              >
                <el-input v-model="netDatas.ttnpwd"></el-input>
              </el-form-item>
            </el-form>
          </el-dialog>

          <!-- 添加项目 -->
          <el-dialog
            :title="$t('project.tet7')"
            width="30%"
            v-model="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="130px"
              ref="addData"
              :rules="addRules"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('project.ProjectName')"
                prop="name"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.name"
                  :placeholder="$t('project.tet8')"
                  maxlength="64"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('project.Affiliatedcompany1')"
                prop="tenantid"
              >
                <el-select
                  v-model="addData.tenantid"
                  clearable
                  filterable
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
              <el-form-item :label="$t('project.scheme12')" prop="scheme">
                <el-select
                  v-model="addData.scheme"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in selectschemeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('project.Locationtype')" prop="type">
                <el-select
                  v-model="addData.type"
                  clearable
                  filterable
                  :placeholder="$t('project.Pleasetype')"
                  @change="changeLocationType"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
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
                    <p>
                      {{ $t("project.tet9") }}
                    </p>
                    <p>
                      {{ $t("project.tet10") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('project.Datatime')"
                prop="datatime"
                v-if="addData.type === 2"
              >
                <el-input
                  v-model="addData.datatime"
                  :placeholder="$t('project.DatatimeRule')"
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
                      {{ $t("project.DatatimeTip") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('project.Projecttype')"
                prop="projectype"
              >
                <el-select
                  v-model="addData.projectype"
                  clearable
                  filterable
                  :placeholder="$t('project.Pleaseitem')"
                >
                  <el-option
                    v-for="item in projectypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('project.time')" prop="timeZone">
                <el-select
                  v-model="addData.timeZone"
                  clearable
                  filterable
                  :placeholder="$t('project.time1')"
                >
                  <el-option
                    v-for="item in timezoneList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>
                      {{ $t("project.text15") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('project.Forwardornot')" prop="">
                <el-select
                  v-model="addData.forward"
                  clearable
                  filterable
                  :placeholder="$t('project.tet17')"
                  @change="changeForward"
                >
                  <el-option
                    v-for="item in forwardList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>{{ $t("project.text7") }}</p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('project.ForwardUrl')"
                style="margin-right: 2%"
                v-if="showHttpUrl"
              >
                <el-input v-model="addData.url"></el-input>
              </el-form-item>

              <el-form-item :label="$t('project.Networkserver')" prop="net">
                <el-select
                  v-model="addData.net"
                  clearable
                  filterable
                  :placeholder="$t('project.tet18')"
                  @change="changeF(addData.net)"
                  @clear="hideTTN()"
                >
                  <el-option
                    v-for="item in forwardList1"
                    :key="item.value"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>
                      {{ $t("project.text8") }}<br />
                      {{ $t("project.text9") }}<br />
                      {{ $t("project.text10") }}<br />
                      {{ $t("project.text11") }}<br />
                      {{ $t("project.text12") }}<br />
                      {{ $t("project.text13") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                label="MQTT Broker："
                prop="ttnbroker"
                v-if="showTTN"
              >
                <el-input
                  v-model="addData.ttnbroker"
                  :placeholder="$t('project.text')"
                  maxlength="125"
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
                      {{ $t("project.text17") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('usercenter.user')"
                prop="ttname"
                v-if="showTTN"
              >
                <el-input
                  v-model="addData.ttname"
                  :placeholder="$t('usercenter.userrule')"
                  maxlength="125"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.password')"
                prop="ttnpwd"
                v-if="showTTN"
              >
                <el-input
                  v-model="addData.ttnpwd"
                  :placeholder="$t('usermanagement.passwordrules')"
                  maxlength="255"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.text1')"
                prop="downtopic"
                v-if="showHTTP"
              >
                <el-input
                  v-model="addData.downtopic"
                  :placeholder="$t('project.text2')"
                  maxlength="64"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('ns.password1')"
                prop="ttnpwd"
                v-if="showHTTP"
              >
                <el-input
                  v-model="addData.ttnpwd"
                  :placeholder="$t('ns.text1')"
                  maxlength="255"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('project.Offtime')"
                prop="offtime"
                style="margin-right: 2%"
              >
                <el-input v-model="addData.offtime"></el-input>
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
                      {{ $t("project.OfftimeTip") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('ns.memo1')" style="margin-right: 2%">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <template #footer><div class="dialog-footer">
              <el-button @click="addCancel('addData')">{{
                $t("project.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
                >{{ $t("project.confirm") }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 编辑项目 -->
          <el-dialog
            :title="$t('project.tet11')"
            v-model="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              ref="editData"
              :rules="addRules"
              class="demo-ruleForm"
              label-width="140px"
              style="text-align: left; margin-left: 10px"
            >
              <el-form-item :label="$t('project.ProjectName')" prop="name">
                <el-input
                  v-model="editData.name"
                  :placeholder="$t('project.tet8')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.Datatime')"
                prop="datatime"
                v-if="showEditDatatime"
              >
                <el-input
                  v-model="editData.datatime"
                  :placeholder="$t('project.DatatimeRule')"
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
                      {{ $t("project.DatatimeTip") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('project.scheme12')" prop="scheme">
                <el-select
                  v-model="editData.scheme"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                  disabled
                >
                  <el-option
                    v-for="item in selectschemeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('project.Forwardornot')" prop="">
                <el-select
                  v-model="editData.forward"
                  clearable
                  filterable
                  :placeholder="$t('project.tet12')"
                  @change="changeForward"
                >
                  <el-option
                    v-for="item in forwardList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>{{ $t("project.text7") }}</p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('project.ForwardUrl')"
                style="margin-right: 2%"
                v-if="showHttpUrl"
              >
                <el-input v-model="editData.url"></el-input>
              </el-form-item>

              <el-form-item :label="$t('project.Networkserver')" prop="net">
                <el-select
                  v-model="editData.net"
                  clearable
                  filterable
                  :placeholder="$t('project.tet18')"
                  @change="changeF(editData.net)"
                  @clear="hideTTN()"
                >
                  <el-option
                    v-for="item in forwardList1"
                    :key="item.value"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>
                      {{ $t("project.text8") }}<br />
                      {{ $t("project.text9") }}<br />
                      {{ $t("project.text10") }}<br />
                      {{ $t("project.text11") }}<br />
                      {{ $t("project.text12") }}<br />
                      {{ $t("project.text13") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
   
              <el-form-item
                label="MQTT Broker："
                prop="ttnbroker"
                v-if="showTTN || (showMQTT && firstMQTT)"
              >
                <el-input
                  v-model="editData.ttnbroker"
                  :placeholder="$t('project.text')"
                  maxlength="125"
                  :disabled="showMQTT"
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
                      {{ $t("project.text17") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('usercenter.user')"
                prop="ttname"
                v-if="showTTN || (showMQTT && firstMQTT)"
              >
                <el-input
                  v-model="editData.ttname"
                  :placeholder="$t('usercenter.userrule')"
                  maxlength="125"
                  :disabled="showMQTT"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.password')"
                prop="ttnpwd"
                v-if="showTTN || (showMQTT && firstMQTT)"
              >
                <el-input
                  v-model="editData.ttnpwd"
                  :placeholder="$t('usermanagement.passwordrules')"
                  maxlength="255"
                  :disabled="showMQTT"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.text3')"
                prop="uptopic"
                v-if="(showMQTT && firstMQTT) || (showHTTP && firstHTTP)"
              >
                <el-input
                  v-model="editData.uptopic"
                  maxlength="64"
                  :disabled="showMQTT || showHTTP"
                  style="width: 320px"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('project.text4')"
                prop="downtopic"
                v-if="showHTTP || (showMQTT && firstMQTT)"
              >
                <el-input
                  v-model="editData.downtopic"
                  :placeholder="$t('project.text5')"
                  :disabled="showMQTT"
                  maxlength="64"
                  style="width: 320px"
                ></el-input>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>
                      {{ $t("project.text16") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('ns.password1')"
                prop="ttnpwd"
                v-if="showHTTP"
              >
                <el-input
                  v-model="editData.ttnpwd"
                  :placeholder="$t('ns.text1')"
                  maxlength="255"
                  style="width: 320px"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('project.time')" prop="timeZone">
                <el-select
                  v-model="editData.timeZone"
                  clearable
                  filterable
                  :placeholder="$t('project.time1')"
                >
                  <el-option
                    v-for="item in timezoneList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>
                      {{ $t("project.text15") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('project.Offtime')"
                prop="offtime"
                style="margin-right: 2%"
              >
                <el-input v-model="editData.offtime"></el-input>
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
                      {{ $t("project.OfftimeTip") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('project.memo1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <template #footer><div class="dialog-footer">
              <el-button @click="editCancel('editData')">{{
                $t("project.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("project.confirm") }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 显示FBX模型 -->
          <el-dialog
            :title="$t('project.text18')"
            width="55%"
            v-model="showFBXDialog"
            style="text-align: center"
            @close="closeFBX()"
            :destroy-on-close="true"
            @opened="onFbxDialogOpened"
          >
            <div id="userMap" ref="userMap" class="fbx-viewer"></div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import host from "../../host";
import { MQTT_BROKER_URL } from "../../config/index.js";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import OrbitControls from "three-orbitcontrols";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
//地图
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { createOutdoorBaseLayers } from "../../utils/mapSource";
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlSourceVector from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OlLayerVector from "ol/layer/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

import Overlay from "ol/Overlay";

// 描线
import { Circle as CircleStyle, Stroke, Style } from "ol/style";
import { LineString } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Feature from "ol/Feature";

//地图控件
import ScaleLine from "ol/control/ScaleLine"; //比例尺控件
import {
  getProjectList,
  addProject,
  delProject,
  updateProjectByProjectid,
  getBuildingByProjectid,
  getBuildingById,
  getCustomerName,
  getSchemes,
  importProject,
  updateProjectUnbind,
} from "../../axios/api";
import MapLayerSwitcher from "../../components/map/MapLayerSwitcher";
import mapStyleMixin from "../../mixins/mapStyleMixin";
import { markRaw } from "vue";
export default {
  mixins: [mapStyleMixin],
  components: {
    Menu,
    Project,
    basecard,
    MapLayerSwitcher,
  },
  name: "ProjectManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      mqttBrokerUrl: MQTT_BROKER_URL,
      outdoorBaseLayers: [],
      projectName: "",
      groundNum: "",
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      tableData: [],
      forwardDatas: "",
      showForward: false,
      intoProjectid: "",
      intoProjectName: "",
      loading: false,
      searchList: {
        projectid: "",
        name: "",
        type: "",
        memo: "",
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        page: 1,
        count: 10,
        projectype: "",
      },
      pageCount: 10,

      currentPage1: 1,
      total: 0,
      add: false,
      addData: {
        name: "",
        type: "",
        tenantid: "",
        memo: "",
        projectype: "",
        timezone: "",
        timeZone: "",
        forward: "",
        net: "",
        ttnbroker: "",
        ttname: "",
        ttnpwd: "",
        downtopic: "",
        scheme: "",
        url: "",
        offtime: 30,
        datatime: "",
      },

      tenantidData: [],
      addRules: {
        offtime: [
          {
            pattern: /^[1-9]\d*/,
            message: this.$t("project.OfftimeRule"),
            trigger: "blur",
          },
        ],
        datatime: [
          {
            validator: (rule, value, callback) => {
              if (value === "" || value === null || value === undefined) {
                callback();
                return;
              }
              const num = Number(value);
              if (
                !/^\d+$/.test(String(value)) ||
                num < 0 ||
                num > 600
              ) {
                callback(new Error(this.$t("project.DatatimeRule")));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: this.$t("project.tet13"),
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: this.$t("project.Pleasetype"),
            trigger: "change",
          },
        ],
        projectype: [
          {
            required: true,
            message: this.$t("project.Pleaseitem"),
            trigger: "change",
          },
        ],
        timeZone: [
          {
            required: true,
            message: this.$t("project.tet14"),
            trigger: "change",
          },
        ],

        tenantid: [
          {
            required: true,
            message: this.$t("project.tet15"),
            trigger: "change",
          },
        ],
        net: [
          {
            required: true,
            message: this.$t("project.tet18"),
            trigger: "change",
          },
        ],
 
        ttnbroker: [
          {
            required: true,
            message: this.$t("project.text"),
            trigger: "blur",
          },
        ],
        ttname: [
          {
            required: true,
            message: this.$t("usermanagement.adduserrule"),
            trigger: "blur",
          },
        ],
        ttnpwd: [
          {
            required: true,
            message: this.$t("usermanagement.passwordrules"),
            trigger: "blur",
          },
        ],
        downtopic: [
          {
            required: true,
            message: this.$t("project.text2"),
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
      },
      selectPerson: [],
      editData: {
        name: "",
        projectid: "",
        memo: "",
        timezone: "",
        timeZone: "",
        forward: "",
        net: "",
        ttnbroker: "",
        ttname: "",
        ttnpwd: "",
        downtopic: "",
        uptopic: "",
        scheme: "",
        url: "",
        offtime: "",
        datatime: "",
      },

      edit: false,
      showEditDatatime: false,
      searchProjectList: [],
      typeList: [
        {
          index: 1,
          value: this.$t("project.Forward"),
        },
        {
          index: 2,
          value: this.$t("project.Reverse"),
        },
      ],
      forwardList: [
        {
          index: 1,
          value: "MQTT",
        },
        {
          index: 2,
          value: "HTTP",
        },
        {
          index: 3,
          value: this.$t("project.Noforwarding"),
        },
      ],
      forwardList1: [
        {
          index: 1,
          value: this.$t("project.builtin"),
        },
        {
          index: 2,
          value: "TTN",
        },
        {
          index: 3,
          value: "ChirpStack-MQTT",
        },
        {
          index: 4,
          value: "ChirpStack-HTTP",
        },
        {
          index: 5,
          value: this.$t("project.other"),
        },
      ],
      projectypeList: [
        { index: 1, value: this.$t("home.school") },
        { index: 2, value: this.$t("home.hospital") },
        { index: 3, value: this.$t("home.OfficeBuilding") },
        { index: 4, value: this.$t("home.residencecommunity") },
        { index: 5, value: this.$t("home.factory") },
        { index: 6, value: this.$t("home.Warehouse") },
        { index: 7, value: this.$t("home.beadhouse") },
        { index: 8, value: this.$t("home.market") },
        { index: 9, value: this.$t("home.Parkinglot") },
        { index: 10, value: this.$t("home.constructionsite") },
        { index: 11, value: this.$t("home.Tunnel") },
        { index: 12, value: this.$t("home.other") },
      ],

      timezoneList: [
        { index: -12, value: "UTC-12:00" },
        { index: -11, value: "UTC-11:00" },
        { index: -10, value: "UTC-10:00" },
        { index: -9, value: "UTC-09:00" },
        { index: -8, value: "UTC-08:00" },
        { index: -7, value: "UTC-07:00" },
        { index: -6, value: "UTC-06:00" },
        { index: -5, value: "UTC-05:00" },
        { index: -4, value: "UTC-04:00" },
        { index: -3, value: "UTC-03:00" },
        { index: -2, value: "UTC-02:00" },
        { index: -1, value: "UTC-01:00" },
        { index: 0, value: "UTC+00:00" },
        { index: 1, value: "UTC+01:00" },
        { index: 2, value: "UTC+02:00" },
        { index: 3, value: "UTC+03:00" },
        { index: 4, value: "UTC+04:00" },
        { index: 5, value: "UTC+05:00" },
        { index: 6, value: "UTC+06:00" },
        { index: 7, value: "UTC+07:00" },
        { index: 8, value: "UTC+08:00" },
        { index: 9, value: "UTC+09:00" },
        { index: 10, value: "UTC+10:00" },
        { index: 11, value: "UTC+11:00" },
        { index: 12, value: "UTC+12:00" },
        { index: 13, value: "UTC+13:00" },
        { index: 14, value: "UTC+14:00" },
      ],

      //地图
      map: "",
      seeLayer: "",
      view: "",
      //聚合
      clusterFeatures: null, //要素数量
      clusterSource: null, //初始化矢量数据源
      clusterSources: null, //初始化聚合标注数据源
      styleCache: null, //加载聚合标注的矢量图层
      layerVetor: null,

      showHttpUrl: false,
      showHttpUrlInfo: false,
      showNS: false,
      showTTN: false,
      showHTTP: false,
      showMQTT: false,
      firstMQTT: false,
      firstHTTP: false,
      firstNS: false,
      firstTTN: false,
      ttnbrokers: "",
      ttnames: "",
      ttnpwds: "",
      downtopics: "",
      uptopics: "",

      showNet: false,
      netDatas: "",
      showNsInfo: false,
      showMQTTInfo: false,
      showTTNInfo: false,
      showHTTPInfo: false,

      selectschemeList: [],
      mapCenter: [0, 0],

      multipleSelection: [],
      headlistdata: "",
      showFBXDialog: false,
      FBXUrl: "",
      fbxInitRetry: 0,

      selectProjectID: "",
    };
  },
  created() {
    // Three.js 对象不能放进 data()，否则 Vue 3 代理会破坏 matrix 读写
    this.scene = null;
    this.cameras = null;
    this.renderer = null;
    this.textureLoader = null;
    this.groupBox = null;
    this.control = null;
    this.clearAnim = null;
    this.fbxModel = null;
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    // 删除FBX模型
    removeFbx(index) {
      var that = this;
      let data = {
        projectid: this.tableData[index].projectid,
        filename: this.tableData[index].filename,
      };
      updateProjectUnbind(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("project.removeSuccess"),
            type: "success",
          });
          that.getProjectLists();
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 上传FBX模型
    importFbx(index) {
      this.selectProjectID = this.tableData[index].projectid;
      document.getElementById("articleFbxFile").click();
    },
    importFBX() {
      var that = this;
      var file = event.currentTarget.files[0];
      let formData = new FormData();
      formData.append("file", file);
      formData.append("projectid", this.selectProjectID);
      this.$axios
        .post("v1/user/addProjectMapFile", formData)
        .then((response) => {
          if (response.data.code == 1001) {
            that.$message({
              message: that.$t("project.importSuccess"),
              type: "success",
            });
            that.getProjectLists();
          }
          // 文件上传成功的处理逻辑
        })
        .catch((error) => {
          that.$message({
            message:
              that.$store.state.i18n == "zh"
                ? error.data.msg
                : error.data.enMsg,
            type: "error",
          });
          // 文件上传失败的处理逻辑
        });
    },
    buildModelUrl(filename) {
      if (!filename) {
        return "";
      }
      const base = host.host.endsWith("/") ? host.host : `${host.host}/`;
      return `${base}model/${encodeURIComponent(filename)}`;
    },
    showFBX(index) {
      this.FBXUrl = this.buildModelUrl(this.tableData[index].filename);
      this.fbxInitRetry = 0;
      this.showFBXDialog = true;
    },
    onFbxDialogOpened() {
      this.$nextTick(() => {
        this.initThree();
      });
    },
    disposeFbxViewer() {
      if (this.clearAnim) {
        cancelAnimationFrame(this.clearAnim);
        this.clearAnim = null;
      }
      if (this.control) {
        this.control.dispose();
        this.control = null;
      }
      if (this.renderer) {
        this.renderer.dispose();
        if (
          this.renderer.domElement &&
          this.renderer.domElement.parentNode
        ) {
          this.renderer.domElement.parentNode.removeChild(
            this.renderer.domElement
          );
        }
        this.renderer = null;
      }
      if (this.scene) {
        this.scene.traverse((v) => {
          if (v.isMesh) {
            v.geometry?.dispose();
            if (Array.isArray(v.material)) {
              v.material.forEach((material) => material?.dispose());
            } else {
              v.material?.dispose();
            }
          }
        });
        this.scene.clear();
        this.scene = null;
      }
      this.cameras = null;
      this.textureLoader = null;
      this.groupBox = null;
      this.fbxModel = null;
    },
    closeFBX() {
      this.disposeFbxViewer();
      this.showFBXDialog = false;
    },
    initThree() {
      const container = this.$refs.userMap;
      if (!container) {
        return;
      }

      const { width, height } = container.getBoundingClientRect();
      if ((!width || !height) && this.fbxInitRetry < 10) {
        this.fbxInitRetry += 1;
        requestAnimationFrame(() => this.initThree());
        return;
      }

      this.disposeFbxViewer();

      this.scene = markRaw(new THREE.Scene());
      this.cameras = markRaw(
        new THREE.PerspectiveCamera(
        50,
        Math.max(width, 1) / Math.max(height, 1),
        0.1,
        10000
        )
      );
      this.cameras.position.set(30, 50, 70);
      this.cameras.lookAt(this.scene.position);

      this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true }));
      this.textureLoader = markRaw(new THREE.TextureLoader());
      this.renderer.setClearColor(new THREE.Color("#f1f5f7"));
      this.renderer.setPixelRatio(window.devicePixelRatio || 1);
      this.renderer.setSize(Math.max(width, 1), Math.max(height, 1));
      this.renderer.shadowMap.enabled = true;
      if (THREE.SRGBColorSpace) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      } else if (THREE.sRGBEncoding) {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
      }

      container.appendChild(this.renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambient);
      const point = new THREE.PointLight(0xffffff, 1);
      point.position.set(100, 200, 100);
      this.scene.add(point);
      const directional = new THREE.DirectionalLight(0xffffff, 0.8);
      directional.position.set(50, 100, 80);
      this.scene.add(directional);

      this.control = markRaw(
        new OrbitControls(this.cameras, this.renderer.domElement)
      );
      this.control.enableDamping = true;
      this.control.enableZoom = true;
      this.control.autoRotate = false;
      this.control.minDistance = 5;
      this.control.maxDistance = 5000;
      this.control.enablePan = true;

      this.loadFbxModel();
      this.render();
    },
    render() {
      const animate = () => {
        if (!this.control || !this.renderer || !this.scene || !this.cameras) {
          return;
        }
        this.clearAnim = requestAnimationFrame(animate);
        this.control.update();
        this.renderer.render(this.scene, this.cameras);
      };
      animate();
    },
    fitFbxModel(object) {
      if (!object || !this.cameras || !this.control) {
        return;
      }
      const box = new THREE.Box3().setFromObject(object);
      if (box.isEmpty()) {
        return;
      }
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      object.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z, 1);
      const fitHeightDistance =
        maxDim / (2 * Math.atan((Math.PI * this.cameras.fov) / 360));
      const fitWidthDistance = fitHeightDistance / this.cameras.aspect;
      const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.2;

      this.cameras.position.set(distance, distance * 0.8, distance);
      this.cameras.near = distance / 100;
      this.cameras.far = distance * 100;
      this.cameras.updateProjectionMatrix();
      this.cameras.lookAt(0, 0, 0);
      this.control.target.set(0, 0, 0);
      this.control.update();
    },
    loadFbxModel() {
      if (!this.scene || !this.FBXUrl) {
        return;
      }
      const loader = new FBXLoader();
      loader.setWithCredentials(true);
      loader.load(
        this.FBXUrl,
        (object) => {
          if (!this.scene) {
            return;
          }
          this.fbxModel = markRaw(object);
          this.scene.add(object);
          this.fitFbxModel(object);
        },
        undefined,
        (error) => {
          console.error("FBX load failed:", this.FBXUrl, error);
          this.$message({
            message:
              this.$store.state.i18n === "zh"
                ? "FBX模型加载失败，请检查文件是否存在或稍后重试"
                : "Failed to load FBX model",
            type: "error",
          });
        }
      );
    },
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
            superid: that.tenantid_A,
          };

          importProject(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("terminal.tet2"),
                type: "success",
              });
              $("#articleImageFile").val("");
              that.getProjectLists();
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

    dateTransition(outdata) {
      var that = this;
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case that.$t("staff.projectname"):
              obj["name"] = outdata[i][key];
              break;
            case that.$t("project.ItemNo"):
              obj["projectid"] = outdata[i][key];
              break;
            case that.$t("project.Affiliatedcompany"):
              obj["customername"] = outdata[i][key];
              break;
            case that.$t("project.AffiliatedcompanyNum"):
              obj["tenantid"] = outdata[i][key];
              break;
            case that.$t("project.LocationType"):
              obj["type"] = outdata[i][key];
              break;
            case that.$t("project.Projectype"):
              obj["projectype"] = outdata[i][key];
              break;
            case that.$t("terminal.Standard"):
              obj["scheme"] = outdata[i][key];
              break;
            case that.$t("project.Numberbuildings"):
              obj["buildnum"] = outdata[i][key];
              break;
            case that.$t("project.mapNumber"):
              obj["mapnum"] = outdata[i][key];
              break;
            case that.$t("floormanagement.EquipmentQuantity"):
              obj["devnum"] = outdata[i][key];
              break;
            case that.$t("project.forward"):
              obj["forward"] = outdata[i][key];
              break;
            case that.$t("project.Networkserver1"):
              obj["net"] = outdata[i][key];
              break;
            case that.$t("project.timezone"):
              obj["timezone"] = outdata[i][key];
              break;
            case that.$t("project.memo"):
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
          message: that.$t("buildingmanagement.projectname1rule1"),
          type: "warning",
        });
        return;
      }
      this.headlistdata = [
        {
          msg: that.$t("staff.projectname"),
          value: "name",
        },
        {
          msg: that.$t("project.ItemNo"),
          value: "projectid",
        },
        {
          msg: that.$t("project.Affiliatedcompany"),
          value: "customername",
        },

        {
          msg: that.$t("project.AffiliatedcompanyNum"),
          value: "tenantid",
        },
        {
          msg: that.$t("project.LocationType"),
          value: "type",
        },
        {
          msg: that.$t("project.Projectype"),
          value: "projectype",
        },
        {
          msg: that.$t("terminal.Standard"),
          value: "scheme",
        },
        {
          msg: that.$t("project.Numberbuildings"),
          value: "buildnum",
        },
        {
          msg: that.$t("project.mapNumber"),
          value: "mapnum",
        },
        {
          msg: that.$t("floormanagement.EquipmentQuantity"),
          value: "devnum",
        },
        {
          msg: that.$t("project.forward"),
          value: "forward",
        },
        {
          msg: that.$t("project.Networkserver1"),
          value: "net",
        },
        {
          msg: that.$t("project.timezone"),
          value: "timezone",
        },
        {
          msg: that.$t("project.memo"),
          value: "memo",
        },
      ];

      that.export2Excel(this.multipleSelection);
    },
    export2Excel(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = [
        "name",
        "projectid",
        "customername",
        "tenantid",
        "type",
        "projectype",
        "scheme",
        "buildnum",
        "mapnum",
        "devnum",
        "forward",
        "net",
        "timezone",
        "memo",
      ];
      for (let i = 0; i < exprotHeadertype.length; i++) {
        eHeaders3.push(exprotHeadertype[i]);
        for (let j = 0; j < that.headlistdata.length; j++) {
          if (exprotHeadertype[i] == that.headlistdata[j].value) {
            exprotHeadertype[i] = that.headlistdata[j].msg;
          }
        }
      }
      import("../../vendor/Export2Excel").then(({ export_json_to_excel }) => {
        //表头
        const tHeader = exprotHeadertype;
        const filterVal = eHeaders3;
        let list = tableData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, that.$t("index.projectmanagement"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => {
        if (j === 'devnum') {
          return (v.devnum || 0) + (v.othernum || 0);
        }
        return v[j];
      }));
    },
    exportExcelAll() {
      var that = this;
      this.headlistdata = [
        {
          msg: that.$t("staff.projectname"),
          value: "name",
        },
        {
          msg: that.$t("project.ItemNo"),
          value: "projectid",
        },
        {
          msg: that.$t("project.Affiliatedcompany"),
          value: "customername",
        },
        {
          msg: that.$t("project.AffiliatedcompanyNum"),
          value: "tenantid",
        },
        {
          msg: that.$t("project.LocationType"),
          value: "type",
        },
        {
          msg: that.$t("project.Projectype"),
          value: "projectype",
        },
        {
          msg: that.$t("terminal.Standard"),
          value: "scheme",
        },
        {
          msg: that.$t("project.Numberbuildings"),
          value: "buildnum",
        },
        {
          msg: that.$t("project.mapNumber"),
          value: "mapnum",
        },
        {
          msg: that.$t("floormanagement.EquipmentQuantity"),
          value: "devnum",
        },
        {
          msg: that.$t("project.forward"),
          value: "forward",
        },
        {
          msg: that.$t("project.Networkserver1"),
          value: "net",
        },
        {
          msg: that.$t("project.timezone"),
          value: "timezone",
        },
        {
          msg: that.$t("project.memo"),
          value: "memo",
        },
      ];
      let data = {
        projectid: "",
        name: "",
        type: "",
        memo: "",
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        page: "",
        count: "",
        projectype: "",
      };
      getProjectList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.export2Excel(res.data.list);
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加项目时根据选择的公司来获取相对应的制式
    selectScheme(event) {
      this.selectschemeList = [];
      let data = {
        tenantid: this.tenantid_A,
      };
      getSchemes(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          let scheme = {};
          let schemes = res.data.toString().split(",");
          for (let i = 0; i < schemes.length; i++) {
            scheme = {
              index: i,
              value: schemes[i],
            };
            this.selectschemeList.push(scheme);
          }
        }
      );
    },
    changeF(val) {
      if (this.$refs.editData) {
        this.$refs.editData.clearValidate("downtopic");
        this.$refs.editData.clearValidate("ttnbroker");
        this.$refs.editData.clearValidate("ttname");
        this.$refs.editData.clearValidate("ttnpwd");
        this.editData.ttnpwd = "";
        this.editData.ttnbroker = "";
        this.editData.ttname = "";
        this.editData.downtopic = "";
        this.editData.uptopic = "";
      }
      if (this.$refs.addData) {
        this.$refs.addData.clearValidate("downtopic");
        this.$refs.addData.clearValidate("ttnbroker");
        this.$refs.addData.clearValidate("ttname");
        this.$refs.addData.clearValidate("ttnpwd");
        this.addData.ttnpwd = "";
        this.addData.ttnbroker = "";
        this.addData.ttname = "";
        this.addData.downtopic = "";
      }
      if (val == 1) {
        this.showNS = true;
        this.showTTN = false;
        this.showHTTP = false;
        this.showMQTT = false;
      
      } else if (val == 2) {
        this.showNS = false;
        this.showTTN = true;
        this.showHTTP = false;
        this.showMQTT = false;
        if (this.firstTTN) {
          this.editData.ttnpwd = this.ttnpwds;
          this.editData.ttnbroker = this.ttnbrokers;
          this.editData.ttname = this.ttnames;
        }
      } else if (val == 3) {
        this.showNS = false;
        this.showTTN = false;
        this.showHTTP = false;
        this.showMQTT = true;
        if (this.firstMQTT) {
          this.editData.ttnpwd = this.ttnpwds;
          this.editData.ttnbroker = this.ttnbrokers;
          this.editData.ttname = this.ttnames;
          this.editData.downtopic = this.downtopics;
          this.editData.uptopic = this.uptopics;
        }
      } else if (val == 4) {
        this.showNS = false;
        this.showHTTP = true;
        this.showTTN = false;
        this.showMQTT = false;
        if (this.firstHTTP) {
          this.editData.downtopic = this.downtopics;
          this.editData.uptopic = this.uptopics;
          this.editData.ttnpwd = this.ttnpwds;
        }
      } else if (val == 5) {
        this.showNS = false;
        this.showHTTP = false;
        this.showTTN = false;
        this.showMQTT = false;
      }
    },
    hideTTN() {
      this.showTTN = false;
      this.showHTTP = false;
    },
    changeForward(e) {
      if (e === 2) {
        this.showHttpUrl = true;
        if (this.add) {
          this.addData.url = "";
        }
        if (this.edit) {
          this.editData.url = "";
        }
      } else {
        this.showHttpUrl = false;
        if (this.add) {
          this.addData.url = "";
        }
        if (this.edit) {
          this.editData.url = "";
        }
      }
    },
    //初始化地图
    initMap() {
      this.seeLayer = this.outdoorBaseLayers;

      this.view = new View({
        projection: "EPSG:4326",
        center: this.mapCenter,
        zoom: 8,
      });
      setTimeout(() => {
        this.map = new Map({
          target: "projectMap",
          layers: [...this.seeLayer],
          view: this.view,
        });

        this.map.addControl(new ScaleLine());
        this.mapClick();
        this.addLine(this.map);
      }, 0);
    },

    //设置聚合
    setCluster(map, mapInfo) {
      var that = this;
      //创建要素数量
      this.clusterFeatures = [];
      for (let i = 0; i < mapInfo.length; i++) {
        let coordinates = [mapInfo[i].longi, mapInfo[i].lati];
        //新建点要素
        that.clusterFeatures[i] = new OlFeature({
          longi: mapInfo[i].longi,
          lati: mapInfo[i].lati,
          src: mapInfo[i].src, //图标路径
          projectid: mapInfo[i].projectid,
          building: mapInfo[i].building,
          buildid: mapInfo[i].id,
          geometry: new OlGeomPoint(coordinates),
        });
      }
      //初始化矢量数据源
      this.clusterSource = new OlSourceVector({
        features: that.clusterFeatures,
      });

      //初始化聚合标注数据源
      this.clusterSources = new Cluster({
        distance: 60, //两个图标之间距离小于此值，就会聚合
        source: that.clusterSource,
      });

      //加载聚合标注的矢量图层
      this.styleCache = {};
      this.layerVetor = new OlLayerVector({
        source: that.clusterSources,
        style: function (feature) {
          var size = feature.get("features").length;
          var style = that.styleCache[size];
          if (size > 1) {
            //聚合时的样式
            style = [
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: "../../../static/cluster.png",
                  scale: 1,
                }),
                text: new Text({
                  text: size.toString(),
                  font: "20px font-size", // 设置字体大小
                  fill: new Fill({
                    color: "#fff",
                  }),
                  offsetY: -22, // 设置文字偏移量
                }),
              }),
            ];
            that.styleCache[size] = style;
          } else {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: feature.values_.features[0].values_.src,
                scale: 1,
              }),
              // 设置图片下面显示字体的样式和内容
              text: new Text({
                text: feature.values_.features[0].values_.building, // 添加文字描述
                font: "12px font-size", // 设置字体大小
                fill: new Fill({
                  color: that.getMarkerTextColor(),
                }),
                offsetY: 10, // 设置文字偏移量
              }),
            });
          }
          return style;
        },
      });

      map.addLayer(this.layerVetor);
    },

    //地图上的点击事件
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
          if (feature.getProperties().features) {
            if (feature.getProperties().features.length == 1) {
              let data = {
                id: feature.getProperties().features[0].values_.buildid,
              };
              getBuildingById(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                that.projectName = res.data.projectname;
                that.groundNum = res.data.num;
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
              });
            } else {
            }
          }
        }
      });
    },

    //获取数据，聚合使用
    getBuildingByProjectids() {
      var that = this;
      let data = {
        superid: this.$store.state.userInfo.tenantid,
      };
      getBuildingByProjectid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.setCluster(that.map, res.data);
        }
      });
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
      this.getProjectLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getProjectLists();
    },

    //获取项目信息
    getProjectLists() {
      if (this.contrForPrionum == 5) {
        this.searchList.username = this.$store.state.userInfo.username;
      }
      var that = this;
      getProjectList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          this.$store.commit("changeProjectTable", that.tableData);
          that.total = res.data.size;
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].longi && res.data.list[i].lati) {
              that.mapCenter = [res.data.list[i].longi, res.data.list[i].lati];
              if (that.map) {
                that.map
                  .getView()
                  .setCenter(
                    [res.data.list[i].longi, res.data.list[i].lati],
                    "EPSG:4326"
                  );
              }
              return;
            }
          }
        }
      });
    },

    //搜索
    searchProject() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getProjectList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          that.$message({
            message: that.$t("project.Searchsucceeded"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        this.searchList.count = 10;
      });
    },

    //重置搜索框
    clearProject() {
      if (this.$router.query) {
        this.$router.push({ query: {} });
      }
      this.searchList = {
        projectid: "",
        name: "",
        type: "",
        memo: "",
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        page: 1,
        count: this.pageCount,
        projectype: "",
      };
      this.currentPage1 = 1;
      this.getProjectLists();
    },

    //添加项目
    addProjects() {
      this.addData = {
        name: "",
        type: "",
        tenantid: "",
        memo: "",
        projectype: "",
        superid: this.tenantid_A,
        forward: "",
        net: "",
        ttnbroker: "",
        ttname: "",
        ttnpwd: "",
        downtopic: "",
        scheme: "",
        url: "",
        offtime: 30,
        datatime: "",
      };
      this.selectScheme();
      this.showNS = false;
      this.showTTN = false;
      this.showHTTP = false;
      this.showMQTT = false;
      this.showHttpUrl = false;
      this.add = true;
    },
    changeLocationType(val) {
      if (val !== 2) {
        this.addData.datatime = "";
      }
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.showTTN = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          that.addData.timezone = that.addData.timeZone * 3600;
          that.addData.offtime = that.addData.offtime * 60;
          delete that.addData.timeZone;
          if (that.addData.type === 2) {
            that.addData.datatime =
              that.addData.datatime === "" || that.addData.datatime == null
                ? ""
                : that.addData.datatime * 1000;
          } else {
            delete that.addData.datatime;
          }
          that.loading = true;
          addProject(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getProjectLists();
              that.getSearchProjectList(that.tenantid_A);
              that.$message({
                message: that.$t("buildingmanagement.addsuccess"),
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
              that.addData.timeZone = that.addData.timezone / 3600;
              that.addData.offtime = that.addData.offtime / 60;
              if (that.addData.type === 2 && that.addData.datatime !== "") {
                that.addData.datatime = that.addData.datatime / 1000;
              }
            }
          });
        } else {
          return false;
        }
      });
    },

    showForwards(index) {
      // 显示mqtt信息
      this.forwardDatas = JSON.parse(JSON.stringify(this.tableData[index]));
      if (this.forwardDatas.forward === 2) {
        this.showHttpUrlInfo = true;
      } else {
        this.showHttpUrlInfo = false;
      }
      this.showForward = true;
    },
    closeForward() {
      this.showForward = false;
    },
    // 查看网络服务器信息
    showNetInfo(index) {
      this.netDatas = JSON.parse(JSON.stringify(this.tableData[index]));
      this.showNet = true;
      switch (this.netDatas.net) {
        case 1:
          this.showNsInfo = true;
          this.showTTNInfo = false;
          this.showMQTTInfo = false;
          this.showHTTPInfo = false;
          break;
        case 2:
          this.showNsInfo = false;
          this.showTTNInfo = true;
          this.showMQTTInfo = false;
          this.showHTTPInfo = false;
          break;
        case 3:
          this.showNsInfo = false;
          this.showTTNInfo = false;
          this.showMQTTInfo = true;
          this.showHTTPInfo = false;
          break;
        case 4:
          this.showNsInfo = false;
          this.showTTNInfo = false;
          this.showMQTTInfo = false;
          this.showHTTPInfo = true;
          break;
        default:
          break;
      }
    },
    closeNet() {
      this.showNet = false;
    },
    // 编辑项目信息
    projectEdit(row) {
      this.firstMQTT = false;
      this.firstHTTP = false;
      this.firstNS = false;
      this.firstTTN = false;
      this.editData.offtime = row.offtime / 60;
      this.editData.name = row.name;
      this.editData.forward = row.forward;
      this.editData.projectid = row.projectid;
      this.editData.memo = row.memo;
      this.editData.net = row.net;
      this.editData.ttnbroker = row.ttnbroker;
      this.editData.ttname = row.ttname;
      this.editData.ttnpwd = row.ttnpwd;
      this.editData.downtopic = row.downtopic;
      this.editData.uptopic = row.uptopic;
      this.editData.scheme = row.scheme;
      this.editData.url = row.url;
      this.showEditDatatime = row.type === 2;
      this.editData.datatime =
        row.type === 2 && row.datatime !== "" && row.datatime != null
          ? row.datatime / 1000
          : "";
      if (this.editData.forward === 2) {
        this.showHttpUrl = true;
      } else {
        this.showHttpUrl = false;
      }
      this.ttnbrokers = JSON.parse(JSON.stringify(row.ttnbroker));
      this.ttnames = JSON.parse(JSON.stringify(row.ttname));
      this.ttnpwds = JSON.parse(JSON.stringify(row.ttnpwd));
      this.downtopics = JSON.parse(JSON.stringify(row.downtopic));
      this.uptopics = JSON.parse(JSON.stringify(row.uptopic));
      this.editData.timeZone = row.timezone / 3600;
      if (this.editData.net == 1) {
        this.showNS = true;
        this.firstNS = true;
        this.showTTN = false;
        this.showHTTP = false;
        this.showMQTT = false;
      } else if (this.editData.net == 2) {
        this.showNS = false;
        this.showHTTP = false;
        this.showTTN = true;
        this.firstTTN = true;
        this.showMQTT = false;
      } else if (this.editData.net == 3) {
        this.showNS = false;
        this.showHTTP = false;
        this.showTTN = false;
        this.showMQTT = true;
        this.firstMQTT = true;
      } else if (this.editData.net == 4) {
        this.firstHTTP = true;
        this.showNS = false;
        this.showHTTP = true;
        this.showTTN = false;
        this.showMQTT = false;
      }
      this.edit = true;
    },
    editCancel(editData) {
      this.edit = false;
      this.loading = false;
      this.showEditDatatime = false;
      this.$refs[editData].resetFields();
    },
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          that.editData.timezone = that.editData.timeZone * 3600;
          that.editData.offtime = that.editData.offtime * 60;
          if (that.showEditDatatime) {
            that.editData.datatime =
              that.editData.datatime === "" || that.editData.datatime == null
                ? ""
                : that.editData.datatime * 1000;
          } else {
            delete that.editData.datatime;
          }
          this.loading = true;
          updateProjectByProjectid(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.showEditDatatime = false;
              that.getProjectLists();
              that.getSearchProjectList(that.tenantid_A);
              that.$message({
                message: that.$t("buildingmanagement.editsuccess"),
                type: "success",
              });
              that.loading = false;
              that.editData.timeZone = "";
              that.ttnbrokers = "";
              that.ttnames = "";
              that.ttnpwds = "";
              that.downtopics = "";
              that.uptopics = "";
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
              that.editData.offtime = that.editData.offtime / 60;
              that.editData.timeZone = that.editData.timezone / 3600;
              if (that.showEditDatatime && that.editData.datatime !== "") {
                that.editData.datatime = that.editData.datatime / 1000;
              }
            }
          });
        } else {
          return false;
        }
      });
    },

    //删除项目信息
    projectDele(row) {
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
      this.$confirm(
        this.$t("project.confirmdel1") +
          row.name +
          this.$t("project.confirmdel3"),
        this.$t("project.tip"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          projectid: row.projectid,
          name: row.name,
        };

        delProject(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.getProjectLists();
              that.getSearchProjectList(that.tenantid_A);
              that.$message({
                message: that.$t("buildingmanagement.deletesuccess"),
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
      });
    },

    //选择进入项目
    projectInto(row) {
      this.intoProjectid = row.projectid;
      this.intoProjectName = row.name;
      this.$store.commit("selectProjectid", this.intoProjectid);

      this.$store.commit("selectProjectSuperid", row.superid);
      this.$store.commit(
        "selectProjectTenantid",
        row.tenantid
      );
      this.$store.commit("selectProjectName", this.intoProjectName);
      this.$store.commit("changeMapZoom", row.zoom);
      this.$store.commit("changeMapLongi", row.longi);
      this.$store.commit("changeMapLati", row.lati);
      this.$store.commit("selectProjectType", row.type);
      this.$store.commit(
        "selectProjectprojectType",
        row.projectype
      );
      this.$router.push("/mapmanagement");
    },

    //获取项目搜索下拉框
    getSearchProjectList(tenantid) {
      let data = {
        superid: tenantid,
      };
      getProjectList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.searchProjectList = res.data.list;
        }
      });
    },

    //调整操作栏宽度
    autoWidth() {
      if (
        this.contrForPrionum == 3 ||
        this.contrForPrionum == 4 ||
        this.delprio == 1
      ) {
        return 160 + "px";
      } else {
        return 80 + "px";
      }
    },

    //获取Tenantid，做下拉框
    getCustomerNames() {
      let data = {
        superid: this.$store.state.userInfo.tenantid,
        beginlevel: 1,
        endlevel: 4,
      };
      getCustomerName(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.tenantidData = res.data;
      });
    },
 
  },
  beforeMount() {
    if (this.$store.state.i18n == "zh") {
      this.mapCenter = [118, 32];
    } else {
      this.mapCenter = [0.1, 51.3];
    }
    this.outdoorBaseLayers = createOutdoorBaseLayers(
      this.$store.state.i18n == "zh"
    );
    if (this.$route.query.type) {
      this.searchList.type = Number(this.$route.query.type);
    } else if (this.$route.query.projectype) {
      this.searchList.projectype = Number(this.$route.query.projectype);
    }
    this.getProjectLists();
    this.getSearchProjectList(this.$store.state.userInfo.tenantid);
    this.initMap();
    this.getBuildingByProjectids();
    this.getCustomerNames();
  },

  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
      );
      Object.assign(
        this.$data.typeList,
        this.$options.data.call(this).typeList
      );
      Object.assign(
        this.$data.forwardList,
        this.$options.data.call(this).forwardList
      );
      Object.assign(
        this.$data.forwardList1,
        this.$options.data.call(this).forwardList1
      );
      Object.assign(
        this.$data.projectypeList,
        this.$options.data.call(this).projectypeList
      );
      Object.assign(
        this.$data.typeList,
        this.$options.data.call(this).typeList
      );
    },
  },
};
</script>

<style scoped>
#articleImageFile,
#articleFbxFile {
  display: none;
}
#userMap,
.fbx-viewer {
  width: 100%;
  height: 600px;
  min-height: 400px;
}
.home {
  height: 100%;
  width: 100%;
  position: absolute;
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
}
.home::-webkit-scrollbar {
  display: none;
}

.menu_header {
  position: relative;
}
.asi {
  position: absolute;
  top: 70px;
  width: 100%;
}
.el-aside {
  margin-top: 50px;
  width: auto !important;
}
.el-main {
  padding: 0;
  padding-top: 20px !important;
}
.icon_button,
.dels {
  padding: 2px 16px !important;
}
.selects button {
  width: 100%;
  text-align: left;
}
/* 按钮改变颜色 */
.edits:hover,
.dels:hover {
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
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}

.el-table :deep(.el-table__row td.operation .cell) {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  overflow: visible;
  padding: 0 4px;
}

.el-table :deep(.el-table__row td.operation .cell > *) {
  margin: 0 !important;
  flex-shrink: 0;
}

.query,
.reset,
.add {
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

.mapConent {
  /* display: flex; */
  width: 100%;
}
#projectMap {
  /* position: relative; */
  height: 560px;
  width: 100%;
}
#popup {
  /* height: 300px; */
  display: none;
}

#popup-content {
  background: #fff;
  padding: 3px 20px 3px 10px;
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

.divider {
  margin: 5px 0 !important;
}
a {
  text-decoration: none;
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

