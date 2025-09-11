<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <!-- <el-aside><Project /></el-aside> -->
        <el-main>
          <div class="project_input">
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item
                :label="$t('project.ProjectName')"
                style="
                  display: flex;
                  margin-left: 2%;
                  width: 15%;
                  margin-right: 2%;
                "
              >
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
                style="
                  display: flex;
                  margin-left: 0;
                  width: 15%;
                  margin-right: 2%;
                "
              >
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
                style="
                  display: flex;
                  margin-left: 0;
                  width: 15%;
                  margin-right: 2%;
                "
              >
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
              <el-form-item style="margin-left: 0">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchProject()"
                  >{{ $t("project.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="clearProject()"
                  >{{ $t("project.reset") }}</el-button
                >
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
                <el-button
                  type="primary"
                  class="add"
                  @click="addProjects()"
                  v-if="contrForPrionum != 5"
                  >{{ $t("project.additem") }}</el-button
                >
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
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("project.Numberbuildings")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("project.tet") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="mapnum"
                show-overflow-tooltip
                align="center"
                min-width="110"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("project.mapNumber")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("project.tet1") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                :label="$t('floormanagement.EquipmentQuantity')"
                show-overflow-tooltip
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  {{ (scope.row.devnum || 0) + (scope.row.othernum || 0) }}
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('project.forward')"
                min-width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.forward !== 3"
                    @click="showForwards(scope.$index)"
                    type="text"
                    size="small"
                    style="width: 60%"
                    >{{ $t("project.see") }}</el-button
                  >
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
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.net != 5"
                    @click="showNetInfo(scope.$index)"
                    type="text"
                    size="small"
                    style="width: 60%"
                    >{{ $t("inspection.Check") }}</el-button
                  >
                  <p v-if="scope.row.net == 5">{{ $t("project.other") }}</p>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('project.FBX')"
                min-width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.filename"
                    @click="showFBX(scope.$index)"
                    type="text"
                    size="small"
                    style="width: 60%"
                    >{{ $t("project.see") }}</el-button
                  >
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
                :label="$t('project.operation')"
                align="center"
                min-width="120"
                v-if="contrForPrionum != 5"
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
                        ><el-button
                          size="mini"
                          class="edits"
                          @click="projectEdit(scope.$index, tableData)"
                          >{{ $t("project.edit") }}</el-button
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
                          @click="projectDele(scope.$index)"
                          v-if="delprio == 1"
                          >{{ $t("project.delete") }}</el-button
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
                          @click="importFbx(scope.$index)"
                          >{{ $t("project.importFBX") }}</el-button
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
                          @click="removeFbx(scope.$index)"
                          >{{ $t("project.deleteFBX") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('project.Enterproject')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      class="dels"
                      @click="projectInto(scope.$index)"
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
                :current-page.sync="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>

          <div class="mapConent">
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
            :visible.sync="showForward"
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
                  <div slot="content">
                    <p>
                      {{ $t("project.tet5") }}
                      <a
                        :href="assetBase + '/guide/dataforward.html'"
                        target="_blank"
                        >{{ $t("project.tet6") }}</a
                      >
                      。
                    </p>
                  </div>
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
            :visible.sync="showNet"
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text17") }}
                    </p>
                  </div>
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
            :visible.sync="add"
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
                  <div slot="content">
                    <p>
                      {{ $t("project.OfftimeTip") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.tet9") }}
                    </p>
                    <p>
                      {{ $t("project.tet10") }}
                    </p>
                  </div>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text15") }}
                    </p>
                  </div>
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
                  <div slot="content">
                    <p>{{ $t("project.text7") }}</p>
                  </div>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text8") }}<br />
                      {{ $t("project.text9") }}<br />
                      {{ $t("project.text10") }}<br />
                      {{ $t("project.text11") }}<br />
                      {{ $t("project.text12") }}<br />
                      {{ $t("project.text13") }}
                    </p>
                  </div>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text17") }}
                    </p>
                  </div>
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

              <el-form-item :label="$t('ns.memo1')" style="margin-right: 2%">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel('addData')">{{
                $t("project.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
                >{{ $t("project.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 编辑项目 -->
          <el-dialog
            :title="$t('project.tet11')"
            :visible.sync="edit"
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
                  <div slot="content">
                    <p>
                      {{ $t("project.OfftimeTip") }}
                    </p>
                  </div>
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
                  <div slot="content">
                    <p>{{ $t("project.text7") }}</p>
                  </div>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text8") }}<br />
                      {{ $t("project.text9") }}<br />
                      {{ $t("project.text10") }}<br />
                      {{ $t("project.text11") }}<br />
                      {{ $t("project.text12") }}<br />
                      {{ $t("project.text13") }}
                    </p>
                  </div>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text17") }}
                    </p>
                  </div>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text16") }}
                    </p>
                  </div>
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
                  <div slot="content">
                    <p>
                      {{ $t("project.text15") }}
                    </p>
                  </div>
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
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel('editData')">{{
                $t("project.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("project.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 显示FBX模型 -->
          <el-dialog
            :title="$t('project.text18')"
            width="55%"
            :visible.sync="showFBXDialog"
            style="text-align: center"
            @close="closeFBX()"
            :destroy-on-close="true"
            @opened="initThree()"
          >
            <div id="userMap" ref="userMap"></div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
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
import OSM from "ol/source/OSM";
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
export default {
  components: {
    Menu,
    Project,
    basecard,
  },
  name: "ProjectManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      mqttBrokerUrl: MQTT_BROKER_URL,
      openlayersSource: "",
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
        offtime: "",
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
      },

      edit: false,
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
      scene: null, //场景
      cameras: null, //照相机
      renderer: null, //渲染器
      textureLoader: null, // 纹理加载器
      groupBox: null,
      control: null, // 相机控件
      publicPath: process.env.BASE_URL,
      clearAnim: null,

      selectProjectID: "",
    };
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
    showFBX(index) {
      this.FBXUrl = host.host + "model/" + this.tableData[index].filename;
      this.showFBXDialog = true;
    },
    closeFBX() {
      this.scene.traverse((v) => {
        if (v.type === "Mesh") {
          v.geometry.dispose();
          v.material.dispose();
        }
      });
      cancelAnimationFrame(this.clearAnim); // 清除requestAnimationFrame
      this.scene.clear();
      this.scene = null; // 场景
      this.cameras = null; // 照相机
      this.renderer = null; // 渲染器
      this.textureLoader = null; // 纹理加载器
      this.groupBox = null;
      this.control = null; // 相机控件
      this.publicPath = process.env.BASE_URL;
      this.showFBXDialog = false;
    },
    initThree() {
      // 场景
      this.scene = new THREE.Scene();
      // 1.2 相机
      this.cameras = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      // 设置摄像机位置
      this.cameras.position.set(30, 50, 70);
      // 指向场景中心
      this.cameras.lookAt(this.scene.position);
      // 1.3 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      // 创建纹理加载器
      this.textureLoader = new THREE.TextureLoader();
      // 创建一个组合对象
      // this.groupBox = new THREE.Group();
      // 设置环境
      this.renderer.setClearColor(new THREE.Color("#f1f5f7"));
      // 设置场景大小
      this.renderer.setSize(
        $("#userMap")[0].getBoundingClientRect().width,
        $("#userMap")[0].getBoundingClientRect().height
      );
      // 渲染器开启阴影效果
      this.renderer.shadowMap.enabled = true;
      // 环境光
      let ambient = new THREE.AmbientLight(0x1c1c1c);
      this.scene.add(ambient);
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(1000, 1000, 1000); // 点光源位置
      this.scene.add(point); // 点光源添加到场景中

      // 渲染div到canvas
      $("#userMap")[0].appendChild(this.renderer.domElement);

      //创建相机控件
      this.control = new OrbitControls(this.cameras, this.renderer.domElement);
      this.control.enableDamping = true;
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
      // this.control.dampingFactor = 0.5;
      // 是否可以缩放
      this.control.enableZoom = true;
      // 是否自动旋转
      this.control.autoRotate = false;
      // 设置相机距离原点的最近距离
      this.control.minDistance = 20;
      // 设置相机距离原点的最远距离
      this.control.maxDistance = 1000;
      // 是否开启右键拖拽
      this.control.enablePan = true;
      // // 上下翻转的最大角度
      // this.control.maxPolarAngle = 1.5;
      // // 上下翻转的最小角度
      // this.control.minPolarAngle = 0.0;
      // 是否可以旋转
      this.enableRotate = true;
      this.loadFbxModel(); // 加载 FBX 模型
      // 最后进行渲染
      this.render();
    },
    render() {
      let animate = () => {
        if (this.control) {
          //循环调用函数
          this.clearAnim = requestAnimationFrame(animate);
          //更新相机控件
          this.control.update();
          //渲染界面
          this.renderer.render(this.scene, this.cameras);
        } else {
          return;
        }
      };
      animate();
    },
    //  加载 FBX 模型
    loadFbxModel() {
      var loader = new FBXLoader();
      loader.load(this.FBXUrl, (object) => {
        //加载路径fbx文件
        // object.traverse((child) => {
        //   if (child.isMesh) {
        //     child.castShadow = true;
        //     child.receiveShadow = true;
        //   }
        // });
        this.scene.add(object); //模型
      });
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
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
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
      this.seeLayer = new TileLayer({
        className: "baseLayerClass",
        source: this.openlayersSource,
      });

      this.view = new View({
        projection: "EPSG:4326",
        center: this.mapCenter,
        zoom: 8,
      });
      setTimeout(() => {
        this.map = new Map({
          target: "projectMap",
          layers: [this.seeLayer],
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
                  // 设置字体颜色
                  color: "white",
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
        offtime: "",
      };
      this.selectScheme();
      this.showNS = false;
      this.showTTN = false;
      this.showHTTP = false;
      this.showMQTT = false;
      this.showHttpUrl = false;
      this.add = true;
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.showTTN = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      that.addData.timezone = that.addData.timeZone * 3600;
      this.addData.offtime = this.addData.offtime * 60;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          delete that.addData.timeZone;
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
              that.addData.timezone = that.addData.timeZone / 3600;
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
    projectEdit(index) {
      this.firstMQTT = false;
      this.firstHTTP = false;
      this.firstNS = false;
      this.firstTTN = false;
      this.editData.offtime = this.tableData[index].offtime / 60;
      this.editData.name = this.tableData[index].name;
      this.editData.forward = this.tableData[index].forward;
      this.editData.projectid = this.tableData[index].projectid;
      this.editData.memo = this.tableData[index].memo;
      this.editData.net = this.tableData[index].net;
      this.editData.ttnbroker = this.tableData[index].ttnbroker;
      this.editData.ttname = this.tableData[index].ttname;
      this.editData.ttnpwd = this.tableData[index].ttnpwd;
      this.editData.downtopic = this.tableData[index].downtopic;
      this.editData.uptopic = this.tableData[index].uptopic;
      this.editData.scheme = this.tableData[index].scheme;
      this.editData.url = this.tableData[index].url;
      if (this.editData.forward === 2) {
        this.showHttpUrl = true;
      } else {
        this.showHttpUrl = false;
      }
      this.ttnbrokers = JSON.parse(
        JSON.stringify(this.tableData[index].ttnbroker)
      );
      this.ttnames = JSON.parse(JSON.stringify(this.tableData[index].ttname));
      this.ttnpwds = JSON.parse(JSON.stringify(this.tableData[index].ttnpwd));
      this.downtopics = JSON.parse(
        JSON.stringify(this.tableData[index].downtopic)
      );
      this.uptopics = JSON.parse(JSON.stringify(this.tableData[index].uptopic));
      this.editData.timeZone = this.tableData[index].timezone / 3600;
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
      this.$refs[editData].resetFields();
    },
    editTrue(editData) {
      var that = this;
      that.editData.timezone = that.editData.timeZone * 3600;
      this.editData.offtime = this.editData.offtime * 60;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateProjectByProjectid(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
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
              that.editData.timezone = that.editData.timeZone / 3600;
            }
          });
        } else {
          return false;
        }
      });
    },

    //删除项目信息
    projectDele(index) {
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
          this.tableData[index].name +
          this.$t("project.confirmdel3"),
        this.$t("project.tip"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          projectid: that.tableData[index].projectid,
          name: that.tableData[index].name,
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
    projectInto(index) {
      this.intoProjectid = this.tableData[index].projectid;
      this.intoProjectName = this.tableData[index].name;
      this.$store.commit("selectProjectid", this.intoProjectid);

      this.$store.commit("selectProjectSuperid", this.tableData[index].superid);
      this.$store.commit(
        "selectProjectTenantid",
        this.tableData[index].tenantid
      );
      this.$store.commit("selectProjectName", this.intoProjectName);
      this.$store.commit("changeMapZoom", this.tableData[index].zoom);
      this.$store.commit("changeMapLongi", this.tableData[index].longi);
      this.$store.commit("changeMapLati", this.tableData[index].lati);
      this.$store.commit("selectProjectType", this.tableData[index].type);
      this.$store.commit(
        "selectProjectprojectType",
        this.tableData[index].projectype
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
    if (this.$store.state.i18n == "zh") {
      this.openlayersSource = new OSM({
        url: process.env.VUE_APP_TILE_URL_TEMPLATE,
        crossOrigin: "",
      });
    } else {
      this.openlayersSource = new OSM();
    }
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
#userMap {
  width: 100%;
  height: 600px;
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

.mapConent {
  /* display: flex; */
  width: 100%;
}
#projectMap {
  /* position: relative; */
  height: 560px;
  width: 100%;
}
#projectMap >>> .baseLayerClass {
  filter: grayscale(100%) sepia(51%) invert(100%) saturate(350%);
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
</style>
