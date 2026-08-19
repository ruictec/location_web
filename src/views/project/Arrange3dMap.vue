<template>
  <div style="height: 100%">
    <div class="content">
      <el-container>
        <el-main>
          <el-dialog v-model="vedio" @close="closeVedio('video')">
            <video width="100%" controls autoplay id="video">
              <source
                v-if="i8n == 'zh'"
                src="../../../static/楼层管理——布置~1.mp4"
                type="video/mp4"
              />
              <source
                v-if="i8n != 'zh'"
                src="../../../static/楼层管理——布置En.mp4"
                type="video/mp4"
              />
            </video>
          </el-dialog>
          <el-dialog v-model="vedio2" @close="closeVedio('video2')">
            <video width="100%" controls autoplay id="video2">
              <source src="../../../static/3D~1.mp4" type="video/mp4" />
            </video>
          </el-dialog>
          <!-- 布置3D -->
          <Teleport to="body">
          <div v-if="arrange3D" class="arrange-3d-page">
            <div class="arrange-dialog-inner">
              <div class="searchArrange">
                <el-form
                  class="demo-form-inline"
                  style="display: flex; white-space: nowrap"
                >
                  <el-button
                    type="primary"
                    @click="arrangcancel3D()"
                    style="width: 90px; height: 30px; text-align: left"
                    size="small"
                   
                    ><i class="el-icon-arrow-left"></i>{{ $t("login.return") }}</el-button>

                  <el-form-item
                    :label="$t('floormanagement.device')"
                    style="display: flex"
                  >
                    <el-input
                      v-model="searchDeveui"
                      :placeholder="$t('floormanagement.devicenumber')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('floormanagement.Devicealias')"
                    style="display: flex"
                  >
                    <el-input
                      v-model="searchAlias"
                      :placeholder="$t('floormanagement.devicealias')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('floormanagement.status')"
                    style="display: flex"
                  >
                    <el-select
                      v-model="searchInuse"
                      filterable
                      :placeholder="$t('floormanagement.usagestatus')"
                    >
                      <el-option
                        v-for="item in inuseType"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="margin-left: 0">
                    <el-button
                      type="primary"
                      @click="searchArranges()"
                      class="query"
                      >{{ $t("floormanagement.search") }}</el-button>
                    <el-button
                      type="primary"
                      @click="clearArranges()"
                      class="reset"
                      >{{ $t("floormanagement.reset") }}</el-button>
                    <el-button
                      type="primary"
                      class="reset"
                      @click="editTranche('position')"
                      >{{ $t("floormanagement.Positioningarea") }}</el-button>
                    <el-button
                      type="primary"
                      class="reset"
                      v-if="
                        (contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5) &&
                        !sub &&
                        intoProjectType == 1
                      "
                      @click="setSub3D()"
                      >{{ $t("floormanagement.Addconnectionpoint") }}</el-button>
                    <el-button
                      type="primary"
                      class="reset"
                      v-if="
                        (contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5) &&
                        sub &&
                        intoProjectType == 1
                      "
                      @click="closeSub3D()"
                      >{{ $t("floormanagement.Endsetting") }}</el-button>
                    <el-button
                      type="primary"
                      @click="showLines3D()"
                      class="query"
                      v-if="!isShowLines && intoProjectType == 1"
                      >{{ $t("floormanagement.showConnectPoint") }}</el-button>
                    <el-button
                      type="primary"
                      @click="showLines3D()"
                      class="query"
                      v-if="isShowLines && intoProjectType == 1"
                      >{{ $t("floormanagement.hideConnectPoint") }}</el-button>
                    <el-button
                      type="primary"
                      @click="removeGroundDevs()"
                      class="query"
                      >{{ $t("floormanagement.RemoveGroundDev") }}</el-button>
                    <el-button
                      type="primary"
                      class="reset"
                      v-if="
                        (contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5) &&
                        !adj &&
                        intoProjectType == 1
                      "
                      @click="setAdj3D()"
                      >{{ $t("floormanagement.Setadjacency") }}</el-button>
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
                          {{ $t("floormanagement.title") }}<br />
                          {{ $t("floormanagement.title1") }}<br />
                          {{ $t("floormanagement.title2") }}<br />
                          {{ $t("floormanagement.title3") }}<br />
                          {{ $t("floormanagement.title4") }}
                        </p>
                      </div></template>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </div>
              <div class="arrange-map-row">
                <div class="mapContent" ref="mapContent">
                  <div class="arrange-map-wrap">
                    <div id="fengMap" ref="fengMap" class="feng-map-container"></div>
                    <p class="arrange-map-tip show_video">
                      {{ $t("floormanagement.arrangement1") }}
                      <a href="javascript:;" @click="vedio2 = true">
                        {{ $t("floormanagement.Watchdemo") }}
                      </a>
                    </p>

                    <!-- 修改图标显示的文字 -->
                    <div class="changShowButton" v-if="showOptions">
                      <el-dropdown @command="showOptionsTrue">
                        <span class="el-dropdown-link">
                        <el-button type="primary">
                          {{ showOptionName
                          }}<i class="el-icon-arrow-up el-icon--right"></i>
                        </el-button>
                        </span>
<template #dropdown><el-dropdown-menu>
                          <el-dropdown-item
                            command="1"
                            v-if="intoProjectType == 1"
                            >{{ $t("change.showAliases") }}</el-dropdown-item>
                          <el-dropdown-item
                            command="2"
                            v-if="intoProjectType == 1"
                            >{{ $t("change.showMajor16") }}</el-dropdown-item>
                          <el-dropdown-item
                            command="3"
                            v-if="intoProjectType == 1"
                            >{{ $t("change.showMajor10") }}</el-dropdown-item>
                          <el-dropdown-item command="4">{{
                            $t("change.showPosition")
                          }}</el-dropdown-item>
                        </el-dropdown-menu></template>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <div
                  class="tableContent"
                  ref="tableContent"
                  :class="{ 'is-expanded': showTable }"
                >
                  <div class="show_table">
                    <svg
                      :class="{ 'is-active': !showTable }"
                      class="hamburger"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      @click="setTable()"
                    >
                      <path
                        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
                      />
                    </svg>
                    <el-menu
                      class="chose_table"
                      :default-active="activeMenu"
                      :collapse="false"
                    >
                      <el-menu-item index="0" @click="menuClick('0', 1)">
                        <i class="icon beacon"></i>
                        <span>{{ $t("otherDev.beacon") }}</span>
                      </el-menu-item>

                      <el-menu-item
                        index="1"
                        v-if="aoagw"
                        @click="menuClick('1', 1)"
                      >
                        <i class="icon aoagw"></i>
                        <span>{{ $t("otherDev.aoaGateway") }}</span>
                      </el-menu-item>

                      <el-menu-item
                        index="2"
                        v-if="smoke"
                        @click="menuClick('2', 1)"
                      >
                        <i class="icon smoke"></i>
                        <span>{{ $t("otherDev.smokeSensor") }}</span>
                      </el-menu-item>

                      <el-menu-item
                        index="3"
                        v-if="alertor"
                        @click="menuClick('3', 1)"
                      >
                        <i class="icon alarm"></i>
                        <span>{{ $t("otherDev.burglarAlarm") }}</span>
                      </el-menu-item>

                      <el-menu-item
                        index="5"
                        v-if="camera"
                        @click="menuClick('5', 1)"
                      >
                        <i class="icon camera"></i>
                        <span>{{ $t("otherDev.camera") }}</span>
                      </el-menu-item>
                    </el-menu>
                  </div>
                  <div class="table_data" v-if="showTable">
                    <el-table
                      ref="multipleTable"
                      :key="'arrange3d-' + activeMenu + '-' + intoProjectType"
                      :data="arrangeData"
                      highlight-current-row
                      @current-change="selectArrange"
                      style="text-align: center"
                      max-height="660"
                      border
                      @header-click="changeBase"
                    >
                      <el-table-column
                        property="major"
                        label="Major"
                        show-overflow-tooltip
                        min-width="60"
                        align="center"
                        v-if="activeMenu == '0' && intoProjectType == 1"
                      ></el-table-column>

                      <el-table-column
                        property="minor"
                        :label="$t('beacon.minor')"
                        show-overflow-tooltip
                        min-width="60"
                        align="center"
                        v-if="activeMenu == '0' && intoProjectType == 1"
                      ></el-table-column>

                      <el-table-column
                        property="deveui"
                        :label="$t('beacon.beaconid')"
                        show-overflow-tooltip
                        align="center"
                        v-if="activeMenu == '0' && intoProjectType == 2"
                      ></el-table-column>

                      <el-table-column
                        property="deveui"
                        :label="$t('terminal.DeviceID')"
                        show-overflow-tooltip
                        align="center"
                        v-if="activeMenu != '0'"
                      ></el-table-column>

                      <el-table-column
                        property="alias"
                        :label="$t('floormanagement.Devicealias2')"
                        show-overflow-tooltip
                        align="center"
                        min-width="78"
                      ></el-table-column>
                      <el-table-column
                        property="typestr"
                        :label="$t('floormanagement.DeviceType2')"
                        show-overflow-tooltip
                        align="center"
                        min-width="78"
                        v-if="intoProjectType == 1"
                      ></el-table-column>
                      <el-table-column
                        property="inusestr"
                        :label="$t('floormanagement.status1')"
                        show-overflow-tooltip
                        align="center"
                        min-width="78"
                      ></el-table-column>

                      <el-table-column
                        :property="i8n == 'zh' ? 'workstatestr' : 'enworkstate'"
                        :label="$t('floormanagement.workingcondition')"
                        show-overflow-tooltip
                        align="center"
                      ></el-table-column>
                    </el-table>
                    <div class="block" style="text-align: center; width: 100%">
                      <el-pagination
                        @current-change="handleCurrentChangeArrange"
                        :current-page="currentPage2"
                        :page-size="20"
                        layout="total, prev, pager, next"
                        :total="totalArrange"
                      ></el-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 编辑3D地图上的设备信息 -->
            <el-dialog
              width="30%"
              :title="$t('floormanagement.Editdeviceinformation')"
              v-model="editFeatures3D"
              :modal="false"
              class="showHeadr"
              style="text-align: center"
            >
              <el-form
                :model="editFeatureData"
                label-width="100px"
                ref="editFeatureData"
                style="text-align: center"
              >
                <el-form-item :label="$t('floormanagement.device')">
                  <el-input
                    v-model="editFeatureData.deveui"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('floormanagement.Devicealias')">
                  <el-input v-model="editFeatureData.alias"></el-input>
                </el-form-item>
              </el-form>
              <template #footer><div class="dialog-footer">
                <el-button @click="editFeatureCancel3D()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button type="primary" @click="editFeaturesTrue3D()">{{
                  $t("change.sure")
                }}</el-button>
              </div></template>
            </el-dialog>

            <!-- 设置3D地图上的扫描区域 -->
            <el-dialog
              width="30%"
              v-model="setAnglimit3D"
              :modal="false"
              class="showHeadr setAreas"
              style="text-align: center"
              @close="setAreas3DCancel"
            >
              <template #header><span
                >{{ $t("floormanagement.Setscanarea") }}
                <el-tooltip class="item" effect="light" placement="right-start">
                  <template #content><div>
                    <p>{{ $t("floormanagement.scannedarea") }}</p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </span></template>
              <el-radio-group v-model="radio">
                <el-radio :label="2"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl1"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="1"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl2"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="8"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl4"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="4"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl8"
                    fit="contain"
                  ></el-image></el-radio>

                <el-radio :label="6"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl9"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="3"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl3"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="9"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl6"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="12"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl12"
                    fit="contain"
                  ></el-image></el-radio>

                <el-radio :label="14"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl13"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="13"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl14"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="7"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl11"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="11"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl7"
                    fit="contain"
                  ></el-image></el-radio>
                <el-radio :label="15"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl15"
                    fit="contain"
                  ></el-image></el-radio>
              </el-radio-group>
              <template #footer><div class="dialog-footer">
                <el-button @click="setAreas3DCancel()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button type="primary" @click="setAreas3DTrue()">{{
                  $t("change.sure")
                }}</el-button>
              </div></template>
            </el-dialog>

            <!-- 3D地图设置区域 -->
            <el-dialog
              :title="$t('floormanagement.Setarea')"
              v-model="trancheShow3D"
              class="edit showHeadr"
              width="30%"
              style="text-align: center"
              :modal="false"
            >
              <el-form
                ref="TrancheDatas"
                label-width="130px"
                style="text-align: left; margin-left: 10px"
              >
                <el-form-item :label="$t('beacon.beaconid1')">
                  <el-input
                    v-model="TrancheDatas.beaconids"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('floormanagement.Alias')">
                  <el-input v-model="TrancheDatas.alias" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('floormanagement.Positioningarea1')">
                  <el-select
                    v-model="TrancheDatas.tranche"
                    clearable
                    filterable
                    :placeholder="$t('terminal.choose')"
                  >
                    <el-option
                      v-for="item in setTrancheList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <template #footer><div class="dialog-footer">
                <el-button @click="updateTrancheCancel3D()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button
                  type="primary"
                  @click="updateTrancheTrue3D()"
                  :loading="loading"
                  >{{ $t("change.sure") }}</el-button>
              </div></template>
            </el-dialog>

            <!-- 3D 地图设置相邻信标 -->
            <el-dialog
              :title="
                $t('tet.setup') + adjoinBeaconAlias + $t('tet.Adjacentbeacon')
              "
              v-model="adjoinBeaconShow3D"
              class="edit showHeadr setAdjoinBeacon"
              width="30%"
              style="text-align: center; margin-right: 2%"
              :modal="false"
              @close="closeAdjoinBeacon3D"
              @open="openAdjoinBeacon3D"
            >
              <el-form
                label-width="100px"
                style="text-align: left; margin-left: 10px"
              >
                <el-form-item
                  :label="$t('floormanagement.Adjacentbeacon')"
                  prop=""
                >
                  <el-select
                    v-model="adjoinBeacon"
                    filterable
                    multiple
                    clearable
                    style="width: 80%"
                    :placeholder="$t('terminal.choose')"
                  >
                    <el-option
                      v-for="item in adjoinBeaconDataList"
                      :key="item.id"
                      :label="item.alias"
                      :value="item.major + item.minor"
                    >
                    </el-option>
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
                      <p>{{ $t("floormanagement.title5") }}</p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </el-form-item>
              </el-form>
              <template #footer><div class="dialog-footer">
                <el-button @click="closeAdjoinBeacon3D()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button
                  type="primary"
                  @click="setAdjoinBeaconTrue3D()"
                  :loading="loading"
                  >{{ $t("change.sure") }}</el-button>
              </div></template>
            </el-dialog>
            <!-- 显示距离：必须放在 3D 全屏层内，否则会被挡住 -->
            <el-dialog
              width="30%"
              class="showHeadr"
              v-model="showDistance"
              :modal="false"
              style="text-align: center"
            >
              <p>{{ $t("floormanagement.Xaxis") }}{{ distanceData.x }}cm</p>
              <p>{{ $t("floormanagement.Yaxis") }}{{ distanceData.y }}cm</p>
            </el-dialog>
            <!-- 设置定位区域：必须放在 3D 全屏层内，否则会被挡住 -->
            <el-dialog
              v-model="addTranchePosition"
              class="edit"
              width="40%"
              style="text-align: center"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              @close="addTrancheRowCancelPosition"
            >
              <template #header><div class="dialog-title">
                <span class="title-text"
                  >{{ $t("floormanagement.Regionalmanagement") }}
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style=""
                  >
                    <template #content><div>
                      <p>
                        {{ $t("floormanagement.title6") }}
                      </p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
              </div></template>
              <el-radio-group size="small">
                <el-button
                  type="primary"
                  class="add"
                  style="float: left"
                  @click="addTrancheRowPosition"
                  >{{ $t("floormanagement.add") }}</el-button>
              </el-radio-group>
              <el-form style="text-align: center">
                <el-form-item
                  style="
                    width: 60%;
                    margin-left: 16%;
                    text-align: left;
                    margin-top: 14px;
                  "
                  :label="$t('floormanagement.Import')"
                >
                  <el-select
                    v-model="currentProjectid.groundid"
                    clearable
                    filterable
                    @change="importTranchePosition"
                    :placeholder="$t('floormanagement.Importbuilding')"
                  >
                    <el-option
                      v-for="item in projectList()"
                      :key="item.id"
                      :label="item.ground"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-form
                label-width="0px"
                v-for="(item, index) in positionTrancheList"
                :key="item.id"
                style="margin-top: 20px"
                class="demo-form-inline addTranche"
              >
                <el-form-item>
                  <el-input
                    v-model="item.name"
                    :maxlength="i8n == 'zh' ? '12' : '30'"
                    style="width: 70%"
                    :disabled="item.id === undefined ? false : true"
                  ></el-input>
                  <p>
                    <el-button
                      type="primary"
                      size="small"
                      style="margin-left: 20px"
                      class="del"
                      @click="deleTrancheRowPosition(index, item.name, item.id)"
                      >{{ $t("floormanagement.delete") }}</el-button>
                  </p>
                  <p class="tranchSwitch">
                    <span>{{ $t("floormanagement.Regionalshake") }}</span>
                    <i-switch
                      size="large"
                      :value="item.fremove"
                      v-model="item.fremove"
                    >
                      <template #active>{{ $t("floormanagement.open") }}</template>
                      <template #inactive>{{ $t("floormanagement.close") }}</template>
                    </i-switch>
                  </p>
                </el-form-item>
              </el-form>
              <template #footer><div class="dialog-footer" style="margin-top: -10px">
                <el-button @click="addTrancheRowCancelPosition()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button type="primary" @click="addTrancheRowTruePosition()">{{
                  $t("change.sure")
                }}</el-button>
              </div></template>
            </el-dialog>
          </div>
          </Teleport>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import { markRaw } from "vue";
import fengmap from "fengmap/build/fengmap.map.min";
import "fengmap/build/fengmap.plugin.ui.min";
import "fengmap/build/fengmap.plugin.markers.min";
import "fengmap/build/toolBarStyle.css";
import { FENGMAP_DECODER_URL } from "../../utils/fengmapAssets";
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import {
  getBuildGroundList,
  getDevPosList,
  getBeaconPosList,
  getGround,
  updateClockin,
  getTranche,
  addTranche,
  delTranche,
  updateBeaconTranche,
  updateDevListToGwClockin,
  updateDevListTranche,
  updateAnglimit,
  updateDevListToGwAnglimit,
  getBeaconid,
  addPoint,
  delPointByPointid,
  addPointNear,
  getPointAndNearList,
  delPointNearByPointid,
  updateBeaconPosOne,
  updateDevListPosOne,
  updateNearBeacons,
  removeGroundDev,
  getDevOtherList,
  getDevAndOtherList,
  updateDevOtherPosOne,
  updateDevList,
  updateDevOther,
  updateBeacon,
  updateDevOtherTranche,
  getFenceManageAndPointListByPage,
} from "../../axios/api";

function patchFengmapRenderNode(marker) {
  if (!marker || marker.__patchedRenderNode || typeof marker.getRenderNode !== "function") {
    return marker;
  }
  const originalGetRenderNode = marker.getRenderNode.bind(marker);
  marker.getRenderNode = function getCompositeRenderNode() {
    const node = originalGetRenderNode();
    if (node && node.center && typeof node.center.set === "function") {
      return node;
    }
    const child = node && node.children && node.children[0];
    if (child && child.center && typeof child.center.set === "function") {
      return child;
    }
    return node;
  };
  marker.__patchedRenderNode = true;
  return marker;
}

function keepFengmapRaw(obj) {
  return obj ? markRaw(patchFengmapRenderNode(obj)) : obj;
}

export default {
  components: {
    Menu,
    Project,
    basecard,
  },
  name: "BuildingManagement",
  data() {
    return {
      aoagw: this.$store.state.functionParts.aoagw,
      smoke: this.$store.state.functionParts.smoke,
      alertor: this.$store.state.functionParts.alertor,
      blesensor: this.$store.state.functionParts.blesensor,
      camera: this.$store.state.functionParts.camera,
      activeMenu: "0",
      i8n: this.$store.state.i18n,
      vedio: false,
      vedio2: false,
      major: "",
      minor: "",
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      superId: this.$store.state.userInfo.superid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      intoProjectid: this.$store.state.intoProjectid,
      intoProjectType: this.$store.state.intoProjectType,
      loading: false,
      trancheShow3D: false,
      setArea3DMarker: "",
      buildid: "",
      currentProjectid: {
        groundid: "",
      },
      searchList: {
        projectid: this.$store.state.intoProjectid,
        mapid: "",
        buildid: "",
        ground: "",
        groundid: "",
        page: 1,
        count: 20,
      },
      TrancheDatas: {
        beaconids: "",
        tranche: "",
        alias: "",
      },
      currentPage2: 1,
      totalArrange: 0,
      dobuleClick: false, //判断是否连续点击了布置按钮
      groundListCopy: [], //用于3D地图的时候，点击布置时设定新的对应关系
      newGround: "", //用于3D地图的时候新的对应关系里的新的楼层对应的
      arrange3D: false,
      pendingMap3DInit: null,
      cancelTranched: false,
      // 布置相关
      searchArrangeList: {
        devtype: "",
        projectid: "",
        inallot: "",
        inuse: "",
        workstate: "",
        page: "",
        count: "",
        deveui: "",
        alias: "",
      },
      searchDeveui: "",
      searchAlias: "",
      searchInuse: "",
      iconSrc: "",
      inuseType: [
        {
          index: 1,
          value: this.$t("floormanagement.value1"),
        },
        {
          index: 2,
          value: this.$t("floormanagement.value2"),
        },
      ],
      groundid: "", //进入的楼层编号
      fenceManageList: [],
      fencePolygonMarkers: [],
      fenceNameMarkers3d: [],
      selectArrangeData: "", //表格里选中要布置的设备信息
      arrangeData: [], //表格里的设备信息
      showTable: false, //是否显示图表
      featureArrs: [], //地图上所有的图标
      editFeatures3D: false,
      setAreas: false,
      setAnglimit3D: false,
      setAreaDeveui: "",
      radio: "",
      oldRadio: "",
      areaInfo: "",
      setAreasUrl1: "../../../static/1.jpg",
      setAreasUrl2: "../../../static/2.jpg",
      setAreasUrl3: "../../../static/3.jpg",
      setAreasUrl4: "../../../static/4.jpg",
      setAreasUrl6: "../../../static/6.jpg",
      setAreasUrl7: "../../../static/7.jpg",
      setAreasUrl8: "../../../static/8.jpg",
      setAreasUrl9: "../../../static/9.jpg",
      setAreasUrl11: "../../../static/11.jpg",
      setAreasUrl12: "../../../static/12.jpg",
      setAreasUrl13: "../../../static/13.jpg",
      setAreasUrl14: "../../../static/14.jpg",
      setAreasUrl15: "../../../static/15.jpg",
      arrangeFeatures: "", //已布置的设备
      editFeatureData: {
        deveui: "",
        alias: "",
        major: "",
        minor: "",
        devtype: "",
      }, //编辑地图上的图标信息
      editFeatureData3D: {
        deveui: "",
        alias: "",
      }, //编辑3D地图上的图标信息
      editFeatureInfo3D: "", //选中地图上要编辑的图标信息
      editFeatureInfo3DText: "", //选中3D地图上要编辑的图标文字信息
      source: null,
      clearBeaconList: false,
      adjoinBeaconShow3D: false,
      adjoinBeacon: [],
      adjoinBeaconAlias: "",
      adjoinBeaconData: {
        beaconid: "",
        nearbeacons: "",
      },
      adjoinBeaconInfo: "",
      adjoinBeaconPopMarker: "",
      adjoinBeaconDataList: "",
      positionTrancheList: [],
      setTrancheList: [],
      addTranchePosition: false,
      projectTable: [],
      sub: false, //是否是绘制子区域状态
      addPoint3D: false,
      adj: false,
      polygonOnce: false, //监听绘制一次完成
      vectorList: [],
      subFlag: false,
      //3D 地图相关
      map3d: null,
      _map3DInitStarted: false,
      lastGroupid: "",
      changeGroup: true,
      fmapId: "",
      themeId: "",
      scrollFloorControl: "",
      layer: null,
      layerList: [],
      layer2: null,
      setNewMarker: true, //标注
      popMarker: null, //信息框
      popMarkerTip: false, //是否有提示框了
      popMarkerList: [], //地图上所有的信息框
      resetIcon: false,
      resetIconInfo: "",
      resetIconInfoText: "",
      pointList: [],
      currentFeature: [],
      pointLists: [], //存放点的相邻关系
      changeMajor: true,
      changeMinor: true,
      // 图标显示相关
      showOption: this.$store.state.intoProjectType == 1 ? 1 : 4,
      showOptionName:
        this.$store.state.intoProjectType == 1
          ? this.$t("change.showAliases")
          : this.$t("change.showPosition"),
      showOptions: false, //是否显示
      isShowLines: false, //是否显示连接线
      lineMarkerList: [], //存放线数据lineMarker
      lineMarker: "", //存放线数据lineMarker
      markerPointList: [],
      length: 0, //左下角x
      width: 0, //左下角y
      showDistance: false,
      distanceData: {
        x: 0,
        y: 0,
      },
    };
  },
  watch: {
    polygonOnce(newv) {
      if (newv) {
        this.closeSub();
        this.polygonOnce = false;
      }
    },
    activeMenu(news) {
      if (news == 0) {
        // if (this.intoProjectType == 1) {
        //   this.showOptions = true;
        // } else {
        this.showOptions = true;
        // }
      } else {
        this.showOptions = false;
      }
    },
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.inuseType,
        this.$options.data.call(this).inuseType
      );
      Object.assign(
        this.$data.showOptionName,
        this.$options.data.call(this).showOptionName
      );
    },
    arrange3D(val) {
      if (!val) {
        clearTimeout(this._arrange3DOpenTimer);
        this.closeMap3D();
        return;
      }
      if (!this.pendingMap3DInit) {
        return;
      }
      this._map3DInitStarted = false;
      this.$nextTick(() => {
        this._arrange3DOpenTimer = setTimeout(() => {
          if (this.pendingMap3DInit) {
            this.handleArrange3DDialogOpened();
          }
        }, 50);
      });
    },
  },
  methods: {
    // 切换显示图标下标
    showOptionsTrue(val) {
      this.showOption = Number(val);
      switch (this.showOption) {
        case 1:
          this.showOptionName = this.$t("change.showAliases");
          break;
        case 2:
          this.showOptionName = this.$t("change.showMajor16");
          break;
        case 3:
          this.showOptionName = this.$t("change.showMajor10");
          break;
        case 4:
          this.showOptionName = this.$t("change.showPosition");
          break;
        default:
          break;
      }
      let that = this;
      this.clearArranges();
    },
    //点击表头显示十进制或十六进制
    changeBase(column) {
      if (column.label == "Major") {
        this.changMajor();
      } else if (column.label == "Minor") {
        this.changMinor();
      }
    },
    changMajor() {
      if (this.changeMajor) {
        this.arrangeData.forEach((item) => {
          item.major = parseInt(item.major, 16);
        });
      } else {
        this.arrangeData.forEach((item) => {
          item.major = item.major.toString(16);
          switch (item.major.length) {
            case 1:
              item.major = "000" + item.major;
              break;
            case 2:
              item.major = "00" + item.major;
              break;
            case 3:
              item.major = "0" + item.major;
              break;
            default:
              break;
          }
        });
      }
      this.changeMajor = !this.changeMajor;
    },
    changMinor() {
      if (this.changeMinor) {
        this.arrangeData.forEach((item) => {
          item.minor = parseInt(item.minor, 16);
        });
      } else {
        this.arrangeData.forEach((item) => {
          item.minor = item.minor.toString(16);
          switch (item.minor.length) {
            case 1:
              item.minor = "000" + item.minor;
              break;
            case 2:
              item.minor = "00" + item.minor;
              break;
            case 3:
              item.minor = "0" + item.minor;
              break;
            default:
              break;
          }
        });
      }
      this.changeMinor = !this.changeMinor;
    },
    // 一键解除布置
    removeGroundDevs() {
      var that = this;
      this.$confirm(this.$t("floormanagement.RemoveGroundDevText"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          groundid: that.groundid,
          projectid: that.intoProjectid,
          type: that.intoProjectType,
        };
        removeGroundDev(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("terminal.tet28"),
              type: "success",
            });
            that.clearArranges();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },
    // 显示/隐藏图表
    setTable() {
      this.showTable = !this.showTable;
      if (this.arrange3D) {
        this.scheduleFengMapResize();
      }
    },
    resizeFengMap() {
      const container = this.$refs.fengMap;
      const map = this.map3d;
      if (!container || !map) {
        return;
      }
      const width = Math.floor(container.clientWidth);
      const height = Math.floor(container.clientHeight);
      if (width < 10 || height < 10) {
        return;
      }
      if (
        width === this._fengMapLastWidth &&
        height === this._fengMapLastHeight
      ) {
        return;
      }
      this._fengMapLastWidth = width;
      this._fengMapLastHeight = height;
      // FengMAP 的 resize 必须传入宽高；无参调用会把 WebGL 画布设成无效尺寸，表现为黑屏且 Logo 消失
      if (typeof map.resize === "function") {
        map.resize(width, height);
      }
      if (typeof map.enableUpdateRender === "function") {
        map.enableUpdateRender();
      }
    },
    scheduleFengMapResize() {
      this.$nextTick(() => {
        [0, 120, 360].forEach((delay) => {
          setTimeout(() => {
            this.resizeFengMap();
          }, delay);
        });
      });
    },
    observeFengMapResize() {
      this.unobserveFengMapResize();
      const target = this.$refs.mapContent || this.$refs.fengMap;
      if (!target || typeof ResizeObserver === "undefined") {
        return;
      }
      this._fengMapResizeObserver = new ResizeObserver(() => {
        clearTimeout(this._fengMapResizeTimer);
        this._fengMapResizeTimer = setTimeout(() => {
          this.resizeFengMap();
        }, 80);
      });
      this._fengMapResizeObserver.observe(target);
    },
    unobserveFengMapResize() {
      clearTimeout(this._fengMapResizeTimer);
      this._fengMapResizeTimer = null;
      this._fengMapResizeObserver?.disconnect();
      this._fengMapResizeObserver = null;
    },
    // 选择表格数据
    menuClick(index, page) {
      var that = this;
      this.activeMenu = index;
      let data = {
        devtype: index,
        tenantid: that.contrForPrionum == 5 ? that.superId : that.tenantid_A,
        page: page,
        count: 20,
        projectid: that.intoProjectid,
        inuse: that.searchInuse,
      };
      switch (index) {
        case "0":
          that.changeMajor = true;
          that.changeMinor = true;
          if (that.$store.state.intoProjectType == 2) {
            //反向项目
            //获取设备位置信息,默认获取未布置的设备，不需要楼层编号groundid，放在表格里
            that.getGatewayPos(that.intoProjectid, 1);
          } else if (that.$store.state.intoProjectType == 1) {
            //正向项目
            //获取设备位置信息,默认获取未布置的设备，不需要楼层编号groundid，放在表格里
            that.getBeaconPos(that.intoProjectid, 1);
          }
          break;
        case "1":
          getDevOtherList(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.arrangeData = res.data.list;
              that.totalArrange = res.data.size;
            }
          });
          break;
        case "2":
          getDevOtherList(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.arrangeData = res.data.list;
              that.totalArrange = res.data.size;
            }
          });
          break;
        case "3":
          getDevOtherList(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.arrangeData = res.data.list;
              that.totalArrange = res.data.size;
            }
          });
          break;
        case "5":
          getDevOtherList(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.arrangeData = res.data.list;
              that.totalArrange = res.data.size;
            }
          });
          break;
        default:
          break;
      }
    },
    // 关闭视频
    closeVedio(id) {
      let myVideo = document.getElementById(id); //对应video标签的ID
      myVideo.pause();
      myVideo.currentTime = 0;
    },
    setSub3D() {
      this.addPoint3D = true;
      this.sub = !this.sub;
    },
    closeSub3D() {
      this.addPoint3D = false;
      this.sub = !this.sub;
    },
    //加载已布置的相邻关系和相邻点
    addSubPolygon3D() {
      if (!this.isShowLines) return;
      let that = this;
      that.lineMarkerList = [];
      let data = {
        groundid: this.groundid,
      };
      //布置点
      getPointAndNearList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code === 1001) {
          that.pointLists = res.data;
          let pointList = res.data;
          //扁平化数组 变成线的数组
          let list = [];
          pointList.forEach((item) => {
            if (!isNaN(Number(item.pointid))) {
              let mapInfo = {
                x: item.nodeX,
                y: item.nodeY,
                xy: [item.nodeX, item.nodeY],
                id: item.pointid,
              };
              let target = {
                mapCoord: { coord3: { x: item.nodeX, y: item.nodeY } },
                groupID: that.lastGroupid,
              };
              that.addMarkerPoints(target, mapInfo);
            }
            if (item.list.length !== 0) {
              item.list.forEach((item1) => {
                list.push([item1, item]);
              });
            }
          });
          // if (!that.isShowLines) return;
          //去重数组，防止重复添加线
          let f = false;
          let arr = [];
          list.forEach((item) => {
            if (arr.length === 0) {
              arr.push(item);
            } else {
              //新数组里已存在的就不添加
              arr.forEach((i) => {
                if (
                  item[0].pointid === i[1].pointid &&
                  item[1].pointid === i[0].pointid
                ) {
                  f = true;
                }
              });
              if (!f) {
                arr.push(item);
              }
              f = false;
            }
          });
          arr.forEach((item, index) => {
            var segment = keepFengmapRaw(new fengmap.FMSegment());
            segment.points = [
              {
                x: item[0].nodeX,
                y: item[0].nodeY,
                z: 1,
              },
              {
                x: item[1].nodeX,
                y: item[1].nodeY,
                z: 1,
              },
            ];
            /* 使用 level 参数定义要在哪个楼层上绘制线覆盖物 */
            segment.level = that.lastGroupid;
            /* 构造线 Marker */
            that.lineMarker = keepFengmapRaw(new fengmap.FMLineMarker({
              segments: [segment],
              width: 2,
              color: "#ccc",
              type: fengmap.FMLineType.FULL,
            }));
            that.lineMarker.pointid = item[0].pointid;
            that.lineMarker.addTo(that.map3d);
            that.lineMarkerList.push(that.lineMarker);
          });
        }
      });
    },
    //加载3d地图
    onmap(group, projectid, appname, mapkey) {
      document.oncontextmenu = function (e) {
        return false;
      };
      var that = this;
      that.lastGroupid = group;
      if (!appname || !mapkey || !that.fmapId || !that.themeId) {
        that.$message({
          message: that.$t("floormanagement.Unboundmap"),
          type: "warning",
        });
        return;
      }
      const container = this.$refs.fengMap;
      if (!container || container.clientWidth < 10 || container.clientHeight < 10) {
        return;
      }
      if (that.map3d) {
        that.map3d.dispose();
        that.map3d = null;
      }
      that._map3DInitStarted = true;
      const level = Number(group) || 1;
      var mapOpation = {
        container: container,
        level: level,
        visibleLevels: [level],
        appName: appname,
        key: mapkey,
        viewMode: fengmap.FMViewMode.MODE_2D,
        mapID: that.fmapId,
        themeID: that.themeId,
        zoomRange: [1, 29],
        decoderURL: FENGMAP_DECODER_URL,
      };
      that.map3d = markRaw(new fengmap.FMMap(mapOpation));
      that.map3d.on("loaded", function () {
        try {
          const level = that.map3d.getLevel();
          const floor = that.map3d.getFloor(level);
          if (floor && floor.getBound) {
            that.map3d.setFitView(floor.getBound());
          }
        } catch (e) {
          // ignore fit view errors
        }
        that.observeFengMapResize();
        that.scheduleFengMapResize();
        if (that.$store.state.intoProjectType == 1) {
          that.getArrangeBeaconPos3D(projectid, that.lastGroupid);
        } else if (that.$store.state.intoProjectType == 2) {
          that.getArrangeGatewayPos3D(projectid, that.lastGroupid);
        }
        that.loadIndoorFences();
      });
        //鼠标左右键点击事件
        that.map3d.on("click", function (event) {
          if (!event.targets || !event.targets.length) {
            return;
          }
          if (event.targets[0].type == "64" || event.targets[0].type == "8") {
          that.setNewMarker = false;
          if (event.mouseEvent.button == 0) {
            //左键点击
            that.addPopInfoWindowLeft(event.targets[0]);
          } else if (event.mouseEvent.button === 2) {
            //右键点击
            that.addPopInfoWindowRight(event.targets[0], that.lastGroupid);
          }
        } else {
          //event.nodeType=4表示地图底面
          //鼠标左右键点击事件
          var buttonType = event.mouseEvent.button;
          if (buttonType === 0) {
            if (that.addPoint3D) {
              let coord3 = { x: event.coords.x, y: event.coords.y };
              //封装model对象
              let target = {
                mapCoord: { coord3: coord3 },
                groupID: that.lastGroupid,
              };
              let mapInfo = {
                x: coord3.x,
                y: coord3.y,
                xy: [coord3.x, coord3.y],
                id: "",
              };
              that.addMarkerPoint(target, mapInfo);
              return;
            }
            // 鼠标左键点击
            if (that.setNewMarker) {
              if (that.resetIcon) {
                that.resetIconInfo.moveTo({
                  x: event.coords.x,
                  y: event.coords.y,
                  animate: true,
                  time: 0.5,
                  finish: function () {
                    that.resetIconInfo.selfAttr.x = event.coords.x;
                    that.resetIconInfo.selfAttr.y = event.coords.y;
                  }, //更新时的回调函数
                });
                let data = {
                  projectid: that.intoProjectid,
                  groundid: that.groundid,
                  deveui: that.resetIconInfo.selfAttr.deveui,
                  longi: event.coords.x,
                  lati: event.coords.y,
                  falg: true,
                };
                if (that.resetIconInfo.selfAttr.devtype) {
                  let otherData = {
                    projectid: that.intoProjectid,
                    groundid: that.groundid,
                    deveui: that.resetIconInfo.selfAttr.deveui,
                    devtype: that.resetIconInfo.selfAttr.devtype,
                    longi: event.coords.x,
                    lati: event.coords.y,
                    falg: true,
                  };
                  updateDevOtherPosOne(
                    otherData,
                    that.tenantkey_A,
                    that.tenantid_A,
                    that.userName
                  ).then((res) => {
                    if (res.code == 1001) {
                      that.$message({
                        message: that.$t("Building.Layoutsuccessful"),
                        type: "success",
                      });
                      that.resetIcon = false;
                    } else {
                      that.$message({
                        message:
                          that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                        type: "error",
                      });
                    }
                  });
                } else {
                  if (that.intoProjectType == 1) {
                    updateBeaconPosOne(
                      data,
                      that.tenantkey_A,
                      that.tenantid_A,
                      that.userName
                    ).then((res) => {
                      if (res.code == 1001) {
                        that.$message({
                          message: that.$t("Building.Layoutsuccessful"),
                          type: "success",
                        });
                        that.resetIcon = false;
                      } else {
                        that.$message({
                          message:
                            that.$store.state.i18n == "zh"
                              ? res.msg
                              : res.enMsg,
                          type: "error",
                        });
                      }
                    });
                  } else {
                    updateDevListPosOne(
                      data,
                      that.tenantkey_A,
                      that.tenantid_A,
                      that.userName
                    ).then((res) => {
                      if (res.code == 1001) {
                        that.$message({
                          message: that.$t("Building.Layoutsuccessful"),
                          type: "success",
                        });
                        that.resetIcon = false;
                      } else {
                        that.$message({
                          message:
                            that.$store.state.i18n == "zh"
                              ? res.msg
                              : res.enMsg,
                          type: "error",
                        });
                      }
                    });
                  }
                }
              } else {
                var coord2 = { x: event.coords.x, y: event.coords.y };
                if (
                  that.selectArrangeData == null ||
                  that.selectArrangeData == ""
                ) {
                  that.$message({
                    message: that.$t("floormanagement.unuseddevice"),
                    type: "warning",
                  });
                  return;
                }
                //封装model对象
                var target = {
                  mapCoord: { coord2: coord2 },
                  groupID: that.lastGroupid,
                };
                var mapInfo;
                if (that.activeMenu != "0") {
                  mapInfo = {
                    x: coord2.x,
                    y: coord2.y,
                    alias: that.selectArrangeData.alias,
                    deveui: that.selectArrangeData.deveui,
                    major: that.selectArrangeData.major,
                    minor: that.selectArrangeData.minor,
                    devtype: that.selectArrangeData.devtype,
                  };
                } else {
                  if (that.$store.state.intoProjectType == 1) {
                    mapInfo = {
                      x: coord2.x,
                      y: coord2.y,
                      alias: that.selectArrangeData.alias,
                      deveui: that.selectArrangeData.beaconid,
                      major: that.selectArrangeData.major,
                      minor: that.selectArrangeData.minor,
                      type: that.selectArrangeData.type,
                      tranche: that.selectArrangeData.tranche,
                      clockin: that.selectArrangeData.clockin,
                      anglimit: that.selectArrangeData.anglimit,
                      warning: "",
                      nearbeacons: "",
                    };
                  } else if (that.$store.state.intoProjectType == 2) {
                    mapInfo = {
                      x: coord2.x,
                      y: coord2.y,
                      alias: that.selectArrangeData.alias,
                      deveui: that.selectArrangeData.deveui,
                      major: that.selectArrangeData.major,
                      minor: that.selectArrangeData.minor,
                      type: "",
                      clockin: that.selectArrangeData.clockin,
                      tranche: that.selectArrangeData.tranche,
                      anglimit: that.selectArrangeData.anglimit,
                      nearbeacons: "",
                    };
                  }
                }
                //添加marker
                that.addMarker(target, mapInfo);
              }
            }
          }
        }
      });
    },

    //正向项目获取3D地图上已布置的设备
    getArrangeBeaconPos3D(projectid, groupID) {
      var that = this;
      let data2 = {
        projectype: 1,
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevAndOtherList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          let devList = res.data.devList;
          let otherList = res.data.otherList;
          that.arrangeFeatures = devList.concat(otherList);
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.addMarkers(that.arrangeFeatures[i], groupID);
            }
          }
        }
      });
    },
    //反向项目获取3D地图上已布置的设备
    getArrangeGatewayPos3D(projectid, groupID) {
      var that = this;
      let data2 = {
        projectype: 2,
        groundid: this.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevAndOtherList(
        // getDevPosList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          let devList = res.data.devList;
          let otherList = res.data.otherList;
          that.arrangeFeatures = devList.concat(otherList);
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.addMarkers(that.arrangeFeatures[i], groupID);
            }
          }
        }
      });
    },

    //在3D地图上加载已布置的设备
    addMarkers(mapinfo, groupID) {
      if (mapinfo.tranche == null) {
        mapinfo.tranche = "";
      }
      var that = this;
      var info;

      let alias = mapinfo.alias;
      switch (that.showOption) {
        case 1:
          alias = mapinfo.alias;
          break;
        case 2:
          alias = mapinfo.major + "/" + mapinfo.minor;
          break;
        case 3:
          alias =
            parseInt(mapinfo.major, 16) + "/" + parseInt(mapinfo.minor, 16);
          break;
        default:
          break;
      }
      var names = "";
      if (that.showOption == 4) {
        names = mapinfo.tranche ? "/" + mapinfo.tranche : "";
      }

      if (mapinfo.devtype) {
        // 第三方
        alias = mapinfo.alias;
        var coord = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
        };

        info = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
          xy: [mapinfo.lastx, mapinfo.lasty],
          alias: mapinfo.alias,
          deveui: mapinfo.deveui,
          major: mapinfo.major,
          minor: mapinfo.minor,
          devtype: mapinfo.devtype,
          tranche: mapinfo.tranche,
        };

        let src;
        switch (mapinfo.devtype) {
          case 1:
            src = "../../../static/aoa.png";
            break;
          case 2:
            src = "../../../static/smoke.png";
            break;
          case 3:
            src = "../../../static/alarm.png";
            break;
          case 5:
            src = "../../../static/camera.png";
            break;
          default:
            break;
        }
        that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
              // strokeColor: "rgba(255, 204, 255)",
              // strokeWidth: 1,
              text: alias + names,
            },
          },
          x: coord.x,
          y: coord.y,
          height: 1,
          collision: false,
          anchor: {
            baseon: "image",
            anchor: fengmap.FMMarkerAnchor.CENTER,
          },
          image: {
            url: src,
            size: [100, 100],
          },
        }));
      } else {
        if (this.$store.state.intoProjectType == 1) {
          //正向项目
          var coord = {
            x: mapinfo.longi,
            y: mapinfo.lati,
          };
          info = {
            x: mapinfo.longi,
            y: mapinfo.lati,
            xy: [mapinfo.longi, mapinfo.lati],
            alias: mapinfo.alias,
            deveui: mapinfo.beaconid,
            major: mapinfo.major,
            minor: mapinfo.minor,
            type: mapinfo.type,
            clockin: mapinfo.clockin,
            tranche: mapinfo.tranche,
            anglimit: mapinfo.anglimit,
            nearbeacons: "",
          };
          if (mapinfo.type == 2) {
            that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: alias + names,
                },
              },
              x: coord.x,
              y: coord.y,
              image: {
                url: "../../../static/beacon_sos.png",
                size: [100, 100],
              },
              height: 1,
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            }));
          } else if (mapinfo.type == 1 && mapinfo.clockin == 1) {
            // 打卡点用另一种图标表示
            that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
                  fcollision: false,
                  ontFamily: "Microsoft YaHei",
                  fillColor: "rgba(0, 0, 238)",
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: alias + names,
                },
              },
              x: coord.x,
              y: coord.y,
              image: {
                url: "../../../static/clock.png",
                size: [100, 100],
              },
              height: 1,
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            }));
          } else {
            that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: alias + names,
                },
              },
              image: {
                url: that.iconSrc,
                size: [100, 100],
              },
              x: coord.x,
              y: coord.y,
              collision: false,
              height: 1,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            }));
          }
        } else if (this.$store.state.intoProjectType == 2) {
          alias = mapinfo.alias;
          //反向项目
          var coord = {
            x: mapinfo.lastx,
            y: mapinfo.lasty,
          };
          info = {
            x: mapinfo.lastx,
            y: mapinfo.lasty,
            xy: [mapinfo.lastx, mapinfo.lasty],
            alias: mapinfo.alias,
            deveui: mapinfo.deveui,
            major: mapinfo.major,
            minor: mapinfo.minor,
            type: "",
            clockin: mapinfo.clockin,
            tranche: mapinfo.tranche,
            anglimit: mapinfo.anglimit,
            nearbeacons: "",
          };
          if (mapinfo.clockin == 1) {
            // 打卡点用另一种图标表示
            that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: alias + names,
                },
              },
              x: coord.x,
              y: coord.y,
              image: {
                url: "../../../static/clock.png",
                size: [100, 100],
              },
              height: 1,
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            }));
          } else {
            that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: alias + names,
                },
              },
              x: coord.x,
              y: coord.y,
              height: 10,
              image: {
                url: that.iconSrc,
                size: [100, 100],
              },
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            }));
          }
        }
      }
      that.layer.selfAttr = info;
      var level = this.map3d.getLevel();
      var group = this.map3d.getFloor(level);
      that.layer.addTo(group);
      that.layerList.push(that.layer);
    },
    //3d地图部署添加
    addMarker(model, mapinfo) {
      var that = this;
      that.resetIcon = false;
      var coord = model.mapCoord.coord2;
      let alias = mapinfo.alias;
      switch (that.showOption) {
        case 1:
          alias = mapinfo.alias;
          break;
        case 2:
          alias = mapinfo.major + "/" + mapinfo.minor;
          break;
        case 3:
          alias =
            parseInt(mapinfo.major, 16) + "/" + parseInt(mapinfo.minor, 16);
          break;
        default:
          break;
      }
      if (mapinfo.devtype) {
        alias = mapinfo.alias;
      }
      if (this.$store.state.intoProjectType == 2) {
        alias = mapinfo.alias;
      }
      if (that.activeMenu != "0") {
        let src;
        switch (that.activeMenu) {
          case "1":
            src = "../../../static/aoa.png";
            break;
          case "2":
            src = "../../../static/smoke.png";
            break;
          case "3":
            src = "../../../static/alarm.png";
            break;
          case "5":
            src = "../../../static/camera.png";
            break;
          default:
            break;
        }
        that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
              // strokeColor: "rgba(255, 204, 255)",
              // strokeWidth: 1,
              text: alias,
            },
          },
          image: {
            url: src,
            size: [100, 100],
          },
          x: coord.x,
          y: coord.y,
          height: 1,
          collision: false,
          anchor: {
            baseon: "image",
            anchor: fengmap.FMMarkerAnchor.CENTER,
          },
        }));
      } else {
        if (mapinfo.type == 2) {
          that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: alias,
              },
            },
            image: {
              url: "../../../static/beacon_sos.png",
              size: [100, 100],
            },
            x: coord.x,
            y: coord.y,
            height: 1,
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          }));
        } else {
          that.layer = keepFengmapRaw(new fengmap.FMCompositeMarker({
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: alias,
              },
            },
            x: coord.x,
            y: coord.y,
            image: {
              url: "../../../static/gateway_sos.png",
              size: [100, 100],
            },
            height: 1,
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          }));
        }
      }
      //图标添加自定义属性(绑定值)
      that.layer.selfAttr = mapinfo;
      that.layer.selfAttr.tranche = "";
      var level = this.map3d.getLevel();
      var group = this.map3d.getFloor(level);
      that.layer.addTo(group);
      that.layerList.push(that.layer);

      let data = {
        projectid: that.intoProjectid,
        groundid: that.groundid,
        deveui: mapinfo.deveui,
        longi: mapinfo.x,
        lati: mapinfo.y,
        falg: true,
      };
      if (that.activeMenu != "0") {
        let otherData = {
          projectid: that.intoProjectid,
          groundid: that.groundid,
          deveui: mapinfo.deveui,
          devtype: that.activeMenu,
          longi: mapinfo.x,
          lati: mapinfo.y,
          falg: true,
        };
        updateDevOtherPosOne(
          otherData,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("Building.Layoutsuccessful"),
              type: "success",
            });
            that.totalArrange -= 1;
            that.delTableDev(coord);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      } else {
        if (that.intoProjectType == 1) {
          updateBeaconPosOne(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("Building.Layoutsuccessful"),
                type: "success",
              });
              that.totalArrange -= 1;
              that.delTableDev(coord);
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else {
          updateDevListPosOne(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("Building.Layoutsuccessful"),
                type: "success",
              });
              that.totalArrange -= 1;
              that.delTableDev(coord);
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        }
      }
    },

    // 添加点
    addMarkerPoint(model, mapinfo) {
      var that = this;
      var coord = model.mapCoord.coord3;
      that.layer = keepFengmapRaw(new fengmap.FMImageMarker({
        x: coord.x,
        y: coord.y,
        height: 10,
        //设置图片路径
        url: "../../../static/near.png",
        //设置图片显示尺寸
        size: 32,
        collision: false,
      }));

      //图标添加自定义属性(绑定值)
      that.layer.selfAttr = mapinfo;

      let data1 = {
        groundid: this.groundid,
        nodeX: mapinfo.x,
        nodeY: mapinfo.y,
      };
      addPoint(data1, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("floormanagement.Layoutpointsuccess"),
              type: "success",
            });
            that.subFlag = false;
            that.vectorList = [];
            that.layer.selfAttr.id = res.data;
            var level = that.map3d.getLevel();
            var group = that.map3d.getFloor(level);
            that.layer.addTo(group);
            that.markerPointList.push(that.layer);
            that.layerList.push(that.layer);
            that.pointLists.push({ pointid: res.data, list: [] });
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            that.subFlag = false;
          }
        }
      );
    },
    // 加载点
    addMarkerPoints(model, mapinfo) {
      var that = this;
      var coord = model.mapCoord.coord3;
      that.layer = keepFengmapRaw(new fengmap.FMImageMarker({
        x: coord.x,
        y: coord.y,
        height: 1,
        //设置图片路径
        url: "../../../static/near.png",
        //设置图片显示尺寸
        size: 32,
      }));

      //图标添加自定义属性(绑定值)
      that.layer.selfAttr = mapinfo;
      var level = this.map3d.getLevel();
      var floor = this.map3d.getFloor(level);
      that.layer.addTo(floor);
      that.markerPointList.push(that.layer);
      that.layerList.push(that.layer);
    },

    delTableDev(coord) {
      var that = this;
      //从表格里暂时删除选中布置的设备
      if (this.$store.state.intoProjectType == 1) {
        let index;
        if (that.activeMenu != "0") {
          for (let i = 0; i < that.arrangeData.length; i++) {
            if (that.selectArrangeData.deveui == that.arrangeData[i].deveui) {
              index = i;
            }
          }
        } else {
          for (let i = 0; i < that.arrangeData.length; i++) {
            if (
              that.selectArrangeData.beaconid == that.arrangeData[i].beaconid
            ) {
              index = i;
            }
          }
        }

        that.arrangeData[index].x = coord.x;
        that.arrangeData[index].y = coord.y;

        that.arrangeData.splice(index, 1);
        // that.totalArrange -= 1;
        that.selectArrangeData = ""; //添加一个后就置空
      } else if (this.$store.state.intoProjectType == 2) {
        let index;
        for (let i = 0; i < that.arrangeData.length; i++) {
          if (that.selectArrangeData.deveui == that.arrangeData[i].deveui) {
            index = i;
          }
        }
        that.arrangeData.splice(index, 1);
        that.selectArrangeData = ""; //添加一个后就置空
      }
    },
    //信息框
    addPopInfoWindowLeft(marker) {
      var that = this;
      if (marker.selfAttr.devtype) {
        that.$message({
          message: that.$t("floormanagement.selectNonOther"),
          type: "warning",
        });
        return;
      }
      if (window.event.shiftKey) {
        if (
          that.currentFeature.includes(marker.selfAttr.id) ||
          that.currentFeature.includes(marker.selfAttr.deveui)
        ) {
          if (that.currentFeature.includes(marker.selfAttr.id)) {
            that.currentFeature = that.currentFeature.filter((val) => {
              return val != marker.selfAttr.id;
            });
            marker.url = "../../../static/near.png";
            // marker.setImage("../../../static/near.png", [100, 100]);
            // marker.update();
          }
          if (that.currentFeature.includes(marker.selfAttr.deveui)) {
            that.currentFeature = that.currentFeature.filter((val) => {
              return val != marker.selfAttr.deveui;
            });
            // marker.O = that.iconSrc;
            marker.setImage(that.iconSrc, [100, 100]);
            marker.update();
          }
          return;
        }
        that.currentFeature.push(marker.selfAttr.id || marker.selfAttr.deveui);
        if (that.currentFeature.length == 1) {
          if (marker.selfAttr.id) {
            marker.url = "../../../static/near2.png";
            // marker.setImage("../../../static/near2.png", [100, 100]);
          } else if (marker.selfAttr.deveui) {
            // marker.O = "../../../static/beacon_sos.png";
            marker.setImage("../../../static/beacon_sos.png", [100, 100]);
            marker.update();
          }
        } else {
          if (marker.selfAttr.id) {
            marker.url = "../../../static/near1.png";
            // marker.setImage("../../../static/near1.png", [100, 100]);
          } else if (marker.selfAttr.deveui) {
            // marker.O = "../../../static/beacon_green.png";
            marker.setImage("../../../static/beacon_green.png", [100, 100]);
            marker.update();
          }
        }
      } else {
        that.currentFeature = [];
      }
    },
    // 显示/隐藏连接线
    showLines3D() {
      var that = this;
      if (this.isShowLines) {
        that.isShowLines = !that.isShowLines;
        // that.map3d.clearLineMark();
        // for (let i = that.markerPointList.length - 1; i > -1; i--) {
        //   that.layer.removeMarker(that.markerPointList[i]);
        // }
        that.lineMarkerList.forEach((item) => {
          item.remove();
        });
        that.markerPointList.forEach((item) => {
          item.remove();
        });
        that.markerPointList = [];
      } else {
        that.isShowLines = !that.isShowLines;
        that.addSubPolygon3D();
      }
    },
    //设置相邻关系
    setAdj3D() {
      let that = this;
      if (that.currentFeature.length === 0) {
        that.$message({
          message: that.$t("floormanagement.Pleaseselectpoint"),
          type: "warning",
        });
        return;
      }
      if (that.currentFeature.length === 1) {
        that.$message({
          message: that.$t("floormanagement.adjacentpoint"),
          type: "warning",
        });
        return;
      }
      let point = that.currentFeature[0];
      let pointidNears = that.currentFeature
        .map((item, index) => {
          if (index > 0) {
            return item;
          }
        })
        .slice(1)
        .join(",");
      let data = {
        groundid: that.groundid,
        pointid: point,
        pointidNears: pointidNears,
      };
      addPointNear(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("floormanagement.Layoutsuccessful"),
              type: "success",
            });
            that.currentFeature = [];
            that.clearArranges();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    // 删除相邻关系
    cancelNearList3D(marker, popMarker) {
      var that = this;
      let pointid = marker.selfAttr.deveui || marker.selfAttr.id;
      if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        that.$message({
          message: that.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      that
        .$confirm(
          that.$t("floormanagement.adjacencyrelationship"),
          that.$t("Building.tips"),
          {
            confirmButtonText: that.$t("terminal.confirm"),
            cancelButtonText: that.$t("terminal.cancel"),
            type: "warning",
          }
        )
        .then(() => {
          delPointNearByPointid(
            {
              groundid: that.groundid,
              pointid: pointid,
            },
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("beacon.deletesuccess"),
                type: "success",
              });
              that.clearArranges();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
            popMarker.remove();
            that.popMarkerTip = false;
          });
        })
        .catch(() => {
          popMarker.remove();
          that.popMarkerTip = false;
        });
    },
    // 删除点
    delPolygon3D(marker, popMarker) {
      var that = this;
      if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        that.$message({
          message: that.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      that
        .$confirm(
          that.$t("floormanagement.Aredelete"),
          that.$t("Building.tips"),
          {
            confirmButtonText: that.$t("terminal.confirm"),
            cancelButtonText: that.$t("terminal.cancel"),
            type: "warning",
          }
        )
        .then(() => {
          delPointByPointid(
            {
              pointid: marker.selfAttr.id, //子区域信息编号id
            },
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("buildingmanagement.deletesuccess"),
                type: "success",
              });
              // 重置添加点相关状态，以便可以继续添加设备
              that.addPoint3D = false;
              that.sub = false;
              that.setNewMarker = true;
              that.clearArranges();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
            popMarker.remove();
            that.popMarkerTip = false;
          });
        });
    },
    // 3D 地图鼠标右键
    addPopInfoWindowRight(marker, ground) {
      var that = this;
      if (that.popMarkerTip) {
        that.popMarker.remove();
      }
      let projectType = this.intoProjectType;
      if (marker.selfAttr.deveui) {
        if (!marker.selfAttr.devtype) {
          that.pointLists.forEach((item) => {
            if (item.pointid == marker.selfAttr.deveui) {
              if (item.list.length > 0) {
                that.clearBeaconList = true;
              } else {
                that.clearBeaconList = false;
              }
            }
          });
        }
        //添加绑定marker信息窗
        var ctlOpt = {
          x: marker.selfAttr.x,
          y: marker.selfAttr.y,
          anchor: fengmap.FMMarkerAnchor.LEFT_BOTTOM,
          //设置弹框的宽度
          domWidth: marker.selfAttr.devtype
            ? 120
            : that.clearBeaconList == true
            ? 130
            : 120,
          //设置弹框的高度px
          domHeight: marker.selfAttr.devtype
            ? 160
            : that.clearBeaconList == true
            ? 280
            : 240,
          collision: false,
          //设置弹框的内容，文本或html页面元素
          content: ` <div style='text-align:left;background: #f1f5f7' calss="threecontent" >
          <ul id="popup-content">
            <li style="margin-top:5px;text-align:right">
              <a style="margin-right:5px" href="javascript:;" id="polygonMenu-closer" class="ol-popup-closer" onclick="closeWindow3D();return false;">
                 <img src="../../../static/close.jpg"  width="11" height="11"/>
              </a>
            </li>
            <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="del3D()" class="el-button  el-button--mini BUTTON DELETE" >${that.$t(
                "tet.delete"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="edit3D()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "tet.edit"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px" ${
              marker.selfAttr.devtype ? 'class="hiddenclock"' : ""
            }>
              <button onclick="setAreas3D()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "floormanagement.Scanningarea"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="setArea3D()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "floormanagement.Setarea"
              )}</button>
            </li>
              <li style="margin-top:3px;padding-bottom:3px" ${
                marker.selfAttr.tranche != "" &&
                projectType == 1 &&
                !marker.selfAttr.devtype
                  ? ""
                  : 'class="hiddenclock"'
              }>
              <button onclick="setAdjoinBeacon3D()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "tet.Adjacentbeacon"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px" ${
              marker.selfAttr.clockin == 2 && marker.selfAttr.type == 1 &&
              !marker.selfAttr.devtype
                ? ""
                : 'class="hiddenclock"'
            }>
              <button onclick="setClock3D()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "floormanagement.Setascheckin"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px" ${
              marker.selfAttr.clockin == 1 && marker.selfAttr.type == 1 &&
              !marker.selfAttr.devtype
                ? ""
                : 'class="hiddenclock"'
            }>
              <button onclick="removeClock3D()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "floormanagement.Cancelclockout"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px" ${
              that.clearBeaconList == true && !marker.selfAttr.devtype
                ? ""
                : 'class="hiddenclock"'
            }>
              <button onclick="cancelNearList3D()" class="el-button  el-button--mini BUTTON DELETE " >${that.$t(
                "floormanagement.Deleteadjacency"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="reset3D()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "tet.Rearrange"
              )}</button>
            </li>
              <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="calculatingDistance()" class="el-button  el-button--mini BUTTON" >${that.$t(
                "floormanagement.CalculateDistance"
              )}</button>
            </li>
          </ul>
          </div>`,
        };
        that.popMarker = keepFengmapRaw(new fengmap.FMDomMarker(ctlOpt));
        that.popMarker.selfAttr = marker.selfAttr;
        var level = that.map3d.getLevel();
        var floor = that.map3d.getFloor(level);
        that.popMarker.addTo(floor);
        that.popMarkerList.push(that.popMarker);
        that.popMarkerTip = true;
      }
      if (marker.selfAttr.id) {
        that.pointLists.forEach((item) => {
          if (item.pointid == marker.selfAttr.id) {
            if (item.list.length > 0) {
              that.clearBeaconList = true;
            } else {
              that.clearBeaconList = false;
            }
          }
        });
        //添加绑定marker信息窗
        var ctlOpt = {
          x: marker.selfAttr.x,
          y: marker.selfAttr.y,
          anchor: fengmap.FMMarkerAnchor.LEFT_BOTTOM,
          //设置弹框的宽度
          domWidth: that.clearBeaconList == true ? 120 : 80,
          //设置弹框的高度px
          domHeight: that.clearBeaconList == true ? 100 : 60,
          collision: false,
          //设置弹框的内容，文本或html页面元素
          content: ` <div style='text-align:left;background: #f1f5f7' calss="threecontent" >
          <ul id="popup-content">
            <li style="margin-top:5px;text-align:right">
              <a style="margin-right:5px" href="javascript:;" id="polygonMenu-closer" class="ol-popup-closer" onclick="closeWindow3D();return false;">
                 <img src="../../../static/close.jpg"  width="11" height="11"/>
              </a>
            </li>
            <li style="margin-top:3px;padding-bottom:3px">
              <button onclick="delPolygon3D()" class="el-button  el-button--mini BUTTON DELETE" >${that.$t(
                "tet.delete"
              )}</button>
            </li>
            <li style="margin-top:3px;padding-bottom:3px" ${
              that.clearBeaconList == true ? "" : 'class="hiddenclock"'
            }>
              <button onclick="cancelNearList3D()" class="el-button  el-button--mini BUTTON DELETE" >${that.$t(
                "floormanagement.Deleteadjacency"
              )}</button>
            </li>
           
          </ul>
          </div>`,
        };
        that.popMarker = keepFengmapRaw(new fengmap.FMDomMarker(ctlOpt));
        that.popMarker.selfAttr = marker.selfAttr;
        var level = that.map3d.getLevel();
        var floor = that.map3d.getFloor(level);
        that.popMarker.addTo(floor);
        that.popMarkerList.push(that.popMarker);
        that.popMarkerTip = true;
      }
      //绑定的点击事件从这触发，直接写在method中没有作用
      window.del3D = function () {
        that.del3D(marker, that.popMarker);
      };
      //计算距离
      window.calculatingDistance = function () {
        that.calculatingDistance(that.popMarker,marker);
      };
      window.closeWindow3D = function () {
        that.closeWindow3D(that.popMarker, marker);
      };
      window.edit3D = function () {
        that.edit3D(that.popMarker, marker, ground);
      };
      window.setArea3D = function () {
        that.setArea3D(marker, that.popMarker, ground);
      };
      window.setAreas3D = function () {
        that.setAreas3D(marker, that.popMarker, ground);
      };
      window.removeArea3D = function () {
        that.removeArea3D(marker, that.popMarker, ground);
      };
      window.setAdjoinBeacon3D = function () {
        that.setAdjoinBeacon3D(marker, that.popMarker, ground);
      };

      window.setClock3D = function () {
        that.setClock3D(marker, that.popMarker);
      };
      window.removeClock3D = function () {
        that.removeClock3D(marker, that.popMarker);
      };
      window.cancelNearList3D = function () {
        that.cancelNearList3D(marker, that.popMarker);
      };
      window.delPolygon3D = function () {
        that.delPolygon3D(marker, that.popMarker);
      };

      window.reset3D = function () {
        that.resetIcon = true;
        that.setNewMarker = true;
        that.resetIconInfo = keepFengmapRaw(marker);
        that.popMarker.remove();
        that.popMarkerTip = false;
      };
      window.resetPoint3D = function () {
        that.resetIcon = true;
        that.resetIconInfo = keepFengmapRaw(marker);
        that.popMarker.remove();
        that.popMarkerTip = false;
      };
    },
    //3D 地图布置删除
    del3D(marker, popMarker) {
      var that = this;
      if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        that.$message({
          message: that.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      that
        .$confirm(that.$t("floormanagement.Aredelete"), that.$t("change.tip"), {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        })
        .then(() => {
          // 删除图标
          let data = {
            projectid: that.intoProjectid,
            groundid: that.groundid,
            deveui: marker.selfAttr.deveui,
            longi: marker.selfAttr.x,
            lati: marker.selfAttr.y,
            falg: false,
          };
          if (marker.selfAttr.devtype) {
            data.devtype = marker.selfAttr.devtype;
            updateDevOtherPosOne(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.$message({
                  message: that.$t("staffmanagement.delsuccess"),
                  type: "success",
                });
                popMarker.remove();
                that.popMarkerTip = false;
                marker.remove();
                that.selectArrangeData = ""; // 清空选中的设备，以便重新选择
                that.setNewMarker = true; // 重置标记，允许继续添加新设备
                that.menuClick(that.activeMenu, that.currentPage2);
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          } else {
            if (that.intoProjectType == 1) {
              updateBeaconPosOne(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.$message({
                    message: that.$t("staffmanagement.delsuccess"),
                    type: "success",
                  });
                  popMarker.remove();
                  that.popMarkerTip = false;
                  marker.remove();
                  that.selectArrangeData = ""; // 清空选中的设备，以便重新选择
                  that.setNewMarker = true; // 重置标记，允许继续添加新设备
                  that.getBeaconPos(that.intoProjectid, that.currentPage2);
                  // that.map3d.clearLineMark();
                  that.lineMarkerList.forEach((item) => {
                    if (item.pointid == marker.selfAttr.deveui) {
                      item.remove();
                    }
                  });
                  that.addSubPolygon3D();
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                }
              });
            } else {
              updateDevListPosOne(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.$message({
                    message: that.$t("staffmanagement.delsuccess"),
                    type: "success",
                  });

                  popMarker.remove();
                  that.popMarkerTip = false;
                  marker.remove();
                  that.selectArrangeData = ""; // 清空选中的设备，以便重新选择
                  that.setNewMarker = true; // 重置标记，允许继续添加新设备

                  that.getGatewayPos(that.intoProjectid, that.currentPage2);
                  // that.map3d.clearLineMark();
                  that.lineMarkerList.forEach((item) => {
                    if (item.pointid == marker.selfAttr.deveui) {
                      item.remove();
                    }
                  });
                  that.addSubPolygon3D();
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                }
              });
            }
          }
        });
    },
    // 3D地图关闭右键信息
    //信息窗点击关闭操作
    closeWindow3D(popMarker, marker) {
      var that = this;
      popMarker.remove();
      that.setNewMarker = true;
      that.popMarkerTip = false;
      for (let i = 0; i < that.popMarkerList.length; i++) {
        if (marker.selfAttr.deveui == that.popMarkerList[i].selfAttr.deveui) {
          that.popMarkerList.splice(i, 1);
        }
      }
    },
    // 计算距离
    calculatingDistance(popMarker,marker) {
      popMarker.remove();
      this.popMarkerTip = false;
      console.log(marker.selfAttr);
      this.distanceData.x =Math.round((marker.selfAttr.x - this.length) * 100) ;
      this.distanceData.y =Math.round((marker.selfAttr.y - this.width) * 100)  ;
      this.showDistance = true;
    },
    //3D 地图布置编辑
    edit3D(popMarker, marker, ground) {
      popMarker.remove();
      this.popMarkerTip = false;
      this.editFeatureData.alias = marker.selfAttr.alias;
      this.editFeatureData.deveui = marker.selfAttr.deveui;
      this.editFeatureData.tranche = marker.selfAttr.tranche;
      this.editFeatureData.major = marker.selfAttr.major;
      this.editFeatureData.minor = marker.selfAttr.minor;
      this.editFeatureData.x = marker.selfAttr.x;
      this.editFeatureData.y = marker.selfAttr.y;
      this.editFeatureData.devtype = marker.selfAttr.devtype;
      this.editFeatureInfo3D = keepFengmapRaw(marker);
      // this.editFeatureInfo3DText = foundT;
      this.editFeatures3D = true;
    },
    editFeatureCancel3D() {
      this.editFeatures3D = false;
    },
    editFeaturesTrue3D() {
      var that = this;
      this.editFeatures3D = false;
      let alias = this.editFeatureData.alias;
      switch (this.showOption) {
        case 1:
          alias = this.editFeatureData.alias;
          break;
        case 2:
          alias = this.editFeatureData.major + "/" + this.editFeatureData.minor;
          break;
        case 3:
          alias =
            parseInt(this.editFeatureData.major, 16) +
            "/" +
            parseInt(this.editFeatureData.minor, 16);
          break;
        default:
          break;
      }
      var names = alias;
      if (that.showOption == 4) {
        names =
          alias +
          (that.editFeatureInfo3D.selfAttr.tranche
            ? "/" + that.editFeatureInfo3D.selfAttr.tranche
            : "");
      }
      if (this.editFeatureData.devtype) {
        alias = that.editFeatureData.alias;
        let data = {
          deveui: that.editFeatureData.deveui,
          alias: that.editFeatureData.alias,
        };
        updateDevOther(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("mapmanagement.editsuccess"),
              type: "success",
            });
            //移动完成重新设置该点信息
            that.editFeatureInfo3D.selfAttr.alias = that.editFeatureData.alias;
            that.editFeatureInfo3D.selfAttr.deveui =
              that.editFeatureData.deveui;
            that.editFeatureInfo3D.setText(names);
            that.editFeatureInfo3D.update();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      } else {
        if (that.intoProjectType == 1) {
          let data = {
            beaconid: that.editFeatureData.deveui,
            alias: that.editFeatureData.alias,
          };
          updateBeacon(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("mapmanagement.editsuccess"),
                type: "success",
              });
              //移动完成重新设置该点信息
              that.editFeatureInfo3D.selfAttr.alias =
                that.editFeatureData.alias;
              that.editFeatureInfo3D.selfAttr.deveui =
                that.editFeatureData.deveui;
              that.editFeatureInfo3D.setText(names);
              that.editFeatureInfo3D.update();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else {
          let data = {
            deveui: that.editFeatureData.deveui,
            alias: that.editFeatureData.alias,
          };
          updateDevList(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("mapmanagement.editsuccess"),
                type: "success",
              });
              //移动完成重新设置该点信息
              that.editFeatureInfo3D.selfAttr.alias =
                that.editFeatureData.alias;
              that.editFeatureInfo3D.selfAttr.deveui =
                that.editFeatureData.deveui;

              that.editFeatureInfo3D.setText(names);
              that.editFeatureInfo3D.update();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        }
      }
    },
    //3D地图设置区域
    setArea3D(marker, popMarker, ground) {
      let that = this;
      this.setTrancheList = [];
      if (marker.selfAttr.tranche) {
        that.TrancheDatas.tranche = marker.selfAttr.tranche;
      } else {
        that.TrancheDatas.tranche = "";
      }
      that.TrancheDatas.alias = marker.selfAttr.alias;
      that.TrancheDatas.beaconids = marker.selfAttr.deveui;
      that.TrancheDatas.devtype = marker.selfAttr.devtype;
      that.setArea3DMarker = marker;
      let dataPosition = {
        site: true,
        groundid: that.groundid,
        projectid:
          that.contrForPrionum == 5
            ? that.$store.state.projectid
            : that.$store.state.intoProjectid,
      };
      getTranche(
        dataPosition,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.setTrancheList = res.data;
          that.trancheShow3D = true;
          popMarker.remove();
          that.popMarkerTip = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    updateTrancheCancel3D() {
      this.trancheShow3D = false;
    },
    updateTrancheTrue3D() {
      var that = this;
      let e = this.setArea3DMarker;
      this.loading = true;

      // 判断是不是第三方设备
      if (that.TrancheDatas.devtype) {
        let data = {
          tranche: that.TrancheDatas.tranche,
          deveui: that.TrancheDatas.beaconids,
        };
        updateDevOtherTranche(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            let src;
            switch (that.TrancheDatas.devtype) {
              case 1:
                src = "../../../static/aoa.png";
                break;
              case 2:
                src = "../../../static/smoke.png";
                break;
              case 3:
                src = "../../../static/alarm.png";
                break;
              case 5:
                src = "../../../static/camera.png";
                break;
              default:
                break;
            }

            e.selfAttr.tranche = that.TrancheDatas.tranche;

            var found = "";
            if (e.selfAttr.tranche) {
              found = that.setTrancheList.find(function (item) {
                return item.name == that.TrancheDatas.tranche;
              });
              if (found) {
                e.selfAttr.tranche = found.name;
              }
            }
            var names = "";
            if (that.showOption == 4) {
              names = found.name ? "/" + found.name : "";
            }
            // e.O = src;
            e.setImage(src, [100, 100]);
            e.setText(e.selfAttr.alias + names);
            e.update();
            that.$message({
              message: that.$t("beacon.assinsuccess"),
              type: "success",
            });
            that.loading = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            that.loading = false;
          }

          that.trancheShow3D = false;
        });
      } else {
        let trancheDatas1 = {
          groundid: that.groundid,
          tranche: that.TrancheDatas.tranche,
          deveui: that.TrancheDatas.beaconids,
        };
        if (that.$store.state.intoProjectType == 1) {
          let alias = e.selfAttr.alias;
          switch (that.showOption) {
            case 1:
              alias = e.selfAttr.alias;
              break;
            case 2:
              alias = e.selfAttr.major + "/" + e.selfAttr.minor;
              break;
            case 3:
              alias =
                parseInt(e.selfAttr.major, 16) +
                "/" +
                parseInt(e.selfAttr.minor, 16);
              break;
            default:
              break;
          }
          updateBeaconTranche(
            trancheDatas1,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              e.selfAttr.tranche = that.TrancheDatas.tranche;

              var found = "";
              if (e.selfAttr.tranche) {
                found = that.setTrancheList.find(function (item) {
                  return item.name == that.TrancheDatas.tranche;
                });
                if (found) {
                  e.selfAttr.tranche = found.name;
                }
              }
              var names = "";
              if (that.showOption == 4) {
                names = found.name ? "/" + found.name : "";
              }
              if (e.selfAttr.clockin == 1) {
                e.setImage("../../../static/clock.png", [100, 100]);
              } else if (e.selfAttr.type == 1) {
                e.setImage("../../../static/beacon.png", [100, 100]);
              } else {
                e.setImage("../../../static/sos.png", [100, 100]);
              }
              // e.O =
              //   e.selfAttr.clockin == 1
              //     ? "../../../static/clock.png"
              //     : e.selfAttr.type == 1
              //     ? "../../../static/beacon.png"
              //     : "../../../static/sos.png";
              e.setText(alias + names);
              e.update();
              that.$message({
                message: that.$t("beacon.assinsuccess"),
                type: "success",
              });
              that.loading = false;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }

            that.trancheShow3D = false;
          });
        } else if (that.$store.state.intoProjectType == 2) {
          updateDevListTranche(
            trancheDatas1,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              e.selfAttr.tranche = that.TrancheDatas.tranche;
              var found = "";
              if (e.selfAttr.tranche) {
                found = that.setTrancheList.find(function (item) {
                  return item.name == that.TrancheDatas.tranche;
                });
                if (found) {
                  e.selfAttr.tranche = found.name;
                }
              }
              var names = "";
              if (that.showOption == 4) {
                names = found.name ? "/" + found.name : "";
              }
              if (e.selfAttr.clockin == 1) {
                e.setImage("../../../static/clock.png", [100, 100]);
              } else {
                e.setImage("../../../static/beacon.png", [100, 100]);
              }
              // e.O =
              //   e.selfAttr.clockin == 1
              //     ? "../../../static/clock.png"
              //     : "../../../static/beacon.png";
              e.setText(e.selfAttr.alias + names);
              e.update();
              that.$message({
                message: that.$t("beacon.assinsuccess"),
                type: "success",
              });
              that.loading = false;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }

            that.trancheShow3D = false;
          });
        }
      }
    },
    //3D地图解除区域
    removeArea3D(marker, popMarker, ground) {
      let that = this;
      this.$confirm(
        that.$t("floormanagement.releasezone"),
        that.$t("change.tip"),
        {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let LayerArraysT = that.map3d.getFMGroup(ground).layers.textMarker[0]
          ? that.map3d.getFMGroup(ground).layers.textMarker[0].textMarkers
          : "";
        let foundT = LayerArraysT.find(function (item) {
          return item.selfAttr.deveui == marker.selfAttr.deveui;
        });
        that.editFeatureInfo3DText = keepFengmapRaw(foundT);
        if (marker.selfAttr.devtype) {
          let data = {
            deveui: marker.selfAttr.deveui,
            tranchid: "",
          };
          updateDevOtherTranche(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              let src;
              switch (marker.selfAttr.devtype) {
                case 1:
                  src = "../../../static/aoa.png";
                  break;
                case 2:
                  src = "../../../static/smoke.png";
                  break;
                case 3:
                  src = "../../../static/alarm.png";
                  break;
                case 5:
                  src = "../../../static/camera.png";
                  break;
                default:
                  break;
              }

              popMarker.remove();
              that.popMarkerTip = false;
              marker.selfAttr.tranche = "";
              marker.selfAttr.tranchid = "";
              // marker.url = src;
              marker.setImage(src, [100, 100]);

              that.editFeatureInfo3DText.name =
                marker.selfAttr.alias +
                (marker.selfAttr.tranche ? "/" + marker.selfAttr.tranche : "");

              marker.update();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else {
          let trancheDatas1 = {
            deveui: marker.selfAttr.deveui,
            tranchid: "",
          };
          if (that.$store.state.intoProjectType == 1) {
            let alias = marker.selfAttr.alias;
            switch (that.showOption) {
              case 1:
                alias = marker.selfAttr.alias;
                break;
              case 2:
                alias = marker.selfAttr.major + "/" + marker.selfAttr.minor;
                break;
              case 3:
                alias =
                  parseInt(marker.selfAttr.major, 16) +
                  "/" +
                  parseInt(marker.selfAttr.minor, 16);
                break;
              default:
                break;
            }
            updateBeaconTranche(
              trancheDatas1,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                popMarker.remove();
                that.popMarkerTip = false;
                marker.selfAttr.tranche = "";
                marker.selfAttr.tranchid = "";
                if (marker.selfAttr.clockin == 1) {
                  marker.setImage("../../../static/clock.png", [100, 100]);
                } else if (marker.selfAttr.type == 1) {
                  marker.setImage("../../../static/beacon.png", [100, 100]);
                } else {
                  marker.setImage("../../../static/sos.png", [100, 100]);
                }
                // marker.url =
                //   marker.selfAttr.clockin == 1
                //     ? "../../../static/clock.png"
                //     : marker.selfAttr.type == 1
                //     ? "../../../static/beacon.png"
                //     : "../../../static/sos.png";

                that.editFeatureInfo3DText.name =
                  alias +
                  (marker.selfAttr.tranche
                    ? "/" + marker.selfAttr.tranche
                    : "");
                marker.update();
                that.$message({
                  message: that.$t("floormanagement.Releasesucceeded"),
                  type: "success",
                });
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          } else if (that.$store.state.intoProjectType == 2) {
            updateDevListTranche(
              trancheDatas1,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                popMarker.remove();
                that.popMarkerTip = false;
                marker.selfAttr.tranche = "";
                marker.selfAttr.tranchid = "";
                if (marker.selfAttr.clockin == 1) {
                  marker.setImage("../../../static/clock.png", [100, 100]);
                } else {
                  marker.setImage("../../../static/beacon.png", [100, 100]);
                }
                // marker.url =
                //   marker.selfAttr.clockin == 1
                //     ? "../../../static/clock.png"
                //     : "../../../static/beacon.png";
                marker.update();

                that.editFeatureInfo3DText.name =
                  marker.selfAttr.alias +
                  (marker.selfAttr.tranche
                    ? "/" + marker.selfAttr.tranche
                    : "");
                that.$message({
                  message: that.$t("floormanagement.Releasesucceeded"),
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
        }
      });
    },

    // 3D设置相邻信标
    setAdjoinBeacon3D(marker, popMarker, ground) {
      var that = this;
      this.adjoinBeaconInfo = keepFengmapRaw(marker);
      this.adjoinBeaconPopMarker = keepFengmapRaw(popMarker);

      let data = {
        deveui: marker.selfAttr.deveui,
        fortype: "2",
        inallot: "1",
        projectid: this.intoProjectid,
      };
      getBeaconPosList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.adjoinBeaconInfo.selfAttr.nearbeacons =
            res.data.list[0].nearbeacons;
          that.adjoinBeaconShow3D = true;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    closeAdjoinBeacon3D() {
      this.adjoinBeaconData = {
        beaconid: "",
        nearbeacons: "",
      };
      this.adjoinBeacon = [];
      this.adjoinBeaconShow3D = false;
    },
    openAdjoinBeacon3D() {
      this.adjoinBeaconData = {
        beaconid: "",
        nearbeacons: "",
      };
      this.adjoinBeaconAlias = "";
      var that = this;
      let data = {
        projectid: this.intoProjectid,
        tranche: this.adjoinBeaconInfo.selfAttr.tranche,
        type: this.adjoinBeaconInfo.selfAttr.type,
        inallot: 1,
        inuse: 1,
        workstate: 1,
        groundid: that.groundid,
      };
      getBeaconid(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.adjoinBeaconDataList = res.data;
            for (let i = 0; i < that.adjoinBeaconDataList.length; i++) {
              if (
                that.adjoinBeaconDataList[i].beaconid ==
                that.adjoinBeaconInfo.selfAttr.deveui
              ) {
                that.adjoinBeaconDataList.splice(i, 1);
              }
            }
            that.adjoinBeaconAlias = that.adjoinBeaconInfo.selfAttr.alias;
            that.adjoinBeaconData.beaconid =
              that.adjoinBeaconInfo.selfAttr.deveui;
            let adjoinBeaconArr = [];
            if (that.adjoinBeaconInfo.selfAttr.nearbeacons) {
              let userids =
                that.adjoinBeaconInfo.selfAttr.nearbeacons.split(",");
              userids.forEach((item) => {
                adjoinBeaconArr.push(item);
              });
            } else {
              that.userid = [];
            }
            if (adjoinBeaconArr.length > 0) {
              adjoinBeaconArr.forEach((item) => {
                that.adjoinBeacon.push(item);
              });
            }
            that.adjoinBeaconPopMarker.remove();
            that.popMarkerTip = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    setAdjoinBeaconTrue3D() {
      var that = this;

      this.loading = true;
      if (this.adjoinBeacon.length > 0) {
        for (let i = 0; i < this.adjoinBeacon.length; i++) {
          that.adjoinBeaconData.nearbeacons += this.adjoinBeacon[i] + ",";
        }
        that.adjoinBeaconData.nearbeacons =
          that.adjoinBeaconData.nearbeacons.slice(
            0,
            that.adjoinBeaconData.nearbeacons.length - 1
          );
      } else {
        that.adjoinBeaconData.nearbeacons = "";
      }
      updateNearBeacons(
        this.adjoinBeaconData,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.adjoinBeaconInfo.selfAttr.nearbeacons =
            that.adjoinBeaconData.nearbeacons;
          that.$message({
            message: that.$t("staffmanagement.Setsuccessfully"),
            type: "success",
          });
          that.loading = false;
          that.adjoinBeaconShow3D = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
          that.loading = false;
          that.adjoinBeaconShow3D = false;
        }
      });
    },

    //3D地图设置打卡点
    setClock3D(marker, popMarker) {
      var that = this;
      that
        .$confirm(that.$t("floormanagement.tippp"), that.$t("change.tip"), {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        })
        .then(() => {
          let data = {
            deveui: marker.selfAttr.deveui,
            clockin: 1,
          };
          if (that.$store.state.intoProjectType == 1) {
            updateClockin(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                marker.selfAttr.clockin = 1;
                // marker.O = "../../../static/clock.png";
                marker.setImage("../../../static/clock.png", [100, 100]);
                marker.update();
                popMarker.remove();
                that.popMarkerTip = false;
                that.$message({
                  message: that.$t("floormanagement.tippp1"),
                  type: "success",
                });
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          } else if (that.$store.state.intoProjectType == 2) {
            updateDevListToGwClockin(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                marker.selfAttr.clockin = 1;
                // marker.O = "../../../static/clock.png";
                marker.setImage("../../../static/clock.png", [100, 100]);
                marker.update();
                popMarker.remove();
                that.popMarkerTip = false;
                that.$message({
                  message: that.$t("floormanagement.tippp1"),
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
        });
    },

    //3D地图取消打卡点
    removeClock3D(marker, popMarker) {
      var that = this;
      this.$confirm(that.$t("floormanagement.tippp2"), that.$t("change.tip"), {
        confirmButtonText: that.$t("terminal.confirm"),
        cancelButtonText: that.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          deveui: marker.selfAttr.deveui,
          clockin: 2,
        };
        if (that.$store.state.intoProjectType == 1) {
          updateClockin(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              marker.selfAttr.clockin = 2;
              if (that.intoProjectType == 1) {
                // marker.O = "../../../static/beacon.png";
                marker.setImage("../../../static/beacon.png", [100, 100]);
              } else if (that.intoProjectType == 2) {
                // marker.O = "../../../static/gateway.png";
                marker.setImage("../../../static/gateway.png", [100, 100]);
              }
              marker.update();
              popMarker.remove();
              that.popMarkerTip = false;
              that.$message({
                message: that.$t("floormanagement.tippp3"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else if (that.$store.state.intoProjectType == 2) {
          updateDevListToGwClockin(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              marker.selfAttr.clockin = 2;
              if (that.intoProjectType == 1) {
                // marker.O = "../../../static/beacon.png";
                marker.setImage("../../../static/beacon.png", [100, 100]);
              } else if (that.intoProjectType == 2) {
                // marker.O = "../../../static/gateway.png";
                marker.setImage("../../../static/gateway.png", [100, 100]);
              }
              marker.update();
              popMarker.remove();
              that.popMarkerTip = false;
              that.$message({
                message: that.$t("floormanagement.tippp3"),
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
      });
    },

    //关闭3D地图布置的回调
    closeMap3D() {
      this.clearIndoorFences3d();
      this.fenceManageList = [];
      this._map3DInitStarted = false;
      this.unobserveFengMapResize();
      if (this.map3d) {
        this.map3d.dispose();
        this.map3d = null;
      }
    },
    //获取页面所有的图标
    getAllFeatures3D(groupID) {
      var that = this;
      let imageMarkers;
      this.featureArrs = [];
      if (this.map3d.getFMGroup(groupID).layers.imageMarker.length > 0) {
        imageMarkers =
          this.map3d.getFMGroup(groupID).layers.imageMarker[0].imageMarkers;
        let info;
        if (that.$store.state.intoProjectType == 1) {
          for (let i = 0; i < imageMarkers.length; i++) {
            info = {
              longi: imageMarkers[i].selfAttr.x,
              lati: imageMarkers[i].selfAttr.y,
              beaconid: imageMarkers[i].selfAttr.deveui,
              alias: imageMarkers[i].selfAttr.alias,
            };
            that.featureArrs.push(info);
          }
        } else if (that.$store.state.intoProjectType == 2) {
          for (let i = 0; i < imageMarkers.length; i++) {
            info = {
              lastx: imageMarkers[i].selfAttr.x,
              lasty: imageMarkers[i].selfAttr.y,
              deveui: imageMarkers[i].selfAttr.deveui,
              alias: imageMarkers[i].selfAttr.alias,
            };
            that.featureArrs.push(info);
          }
        }
      }
    },

    //3D地图布置页面点击返回
    escapeFenceName(name) {
      return String(name || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },
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
    clearIndoorFences3d() {
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
    loadIndoorFences() {
      var that = this;
      if (!that.groundid || !that.intoProjectid) {
        return;
      }
      getFenceManageAndPointListByPage(
        {
          projectid: that.intoProjectid,
          groundid: that.groundid,
        },
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.fenceManageList = res.data.list || [];
          that.renderIndoorFences3d();
        }
      });
    },
    renderIndoorFences3d() {
      var that = this;
      if (!that.map3d) {
        return;
      }
      that.clearIndoorFences3d();
      if (!that.fenceManageList || that.fenceManageList.length === 0) {
        return;
      }
      try {
        var level = that.map3d.getLevel();
        var group = that.map3d.getFloor(level);
        that.fenceManageList.forEach(function (fence) {
          if (!fence.list || fence.list.length < 3) {
            return;
          }
          var polygonPoints = fence.list.map(function (point) {
            return {
              x: point.pointX || point.x,
              y: point.pointY || point.y,
              z: 1,
            };
          });
          polygonPoints.push({
            x: polygonPoints[0].x,
            y: polygonPoints[0].y,
            z: 1,
          });
          var polygonMarker = new fengmap.FMPolygonMarker({
            points: polygonPoints,
            color: fence.colour || "#FF0000",
            alpha: 0.3,
            lineWidth: 2,
            lineColor: fence.colour || "#FF0000",
          });
          polygonMarker.selfAttr = {
            fenceId: fence.id,
            fenceName: fence.name,
            isElectronicFence: true,
          };
          polygonMarker.addTo(group);
          that.fencePolygonMarkers.push(polygonMarker);
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
    arrangcancel3D() {
      let that = this;
      let goBack = false;
      that.clearIndoorFences3d();
      that.fenceManageList = [];
      let data = {
        groundid: this.groundid,
      };
      getPointAndNearList(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.length == 0 || res.data.length == 1) {
            that.map3d.dispose();
            that.map3d = null;
            that.arrange3D = false;
            that.dobuleClick = false;
            that.$emit("change", false);
            return;
          }
          res.data.forEach((item) => {
            if (item.list.length == 0) {
              goBack = true;
            }
          });
          if (goBack && that.intoProjectType != 2) {
            that
              .$confirm(
                that.$t("floormanagement.tippp6"),
                that.$t("Building.tips"),
                {
                  confirmButtonText: that.$t("terminal.confirm"),
                  cancelButtonText: that.$t("terminal.cancel"),
                  type: "warning",
                  customClass: "msgbox-text-left",
                }
              )
              .then(() => {
                that.arrange3D = false;
                that.dobuleClick = false;
                that.$emit("change", false);
                that.map3d.dispose();
                that.map3d = null;
                return;
              })
              .catch(() => {
                return;
              });
          } else {
            that.arrange3D = false;
            that.dobuleClick = false;
            that.$emit("change", false);
            that.map3d.dispose();
            that.map3d = null;
          }
        }
      });
    },

    projectList() {
      return this.projectTable.filter((item) => {
        return item.id !== this.groundid;
      });
    },
    getProjectLists() {
      var that = this;
      let data = {
        buildid: this.buildid,
      };
      getBuildGroundList(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.projectTable = res.data.list;
        }
      });
    },
    //区域设置
    editTranche(val) {
      var that = this;
      this.currentProjectid.groundid = "";
      this.getProjectLists();
      if (val == "position") {
        let data = {
          site: true,
          groundid: this.groundid,
          projectid:
            this.contrForPrionum == 5
              ? this.$store.state.projectid
              : this.$store.state.intoProjectid,
        };
        getTranche(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.positionTrancheList = res.data;
              for (let i = 0; i < that.positionTrancheList.length; i++) {
                if (that.positionTrancheList[i].fremove == 1) {
                  that.positionTrancheList[i].fremove = true;
                } else {
                  that.positionTrancheList[i].fremove = false;
                }
              }
              that.addTranchePosition = true;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          }
        );
      } else if (val == "alarm") {
        let data = {
          site: false,
          groundid: this.groundid,
          projectid:
            that.contrForPrionum == 5
              ? that.$store.state.projectid
              : that.$store.state.intoProjectid,
        };
        getTranche(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.alarmTrancheList = res.data;
              that.addTrancheAlarm = true;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          }
        );
      }
    },
    addTrancheRowPosition() {
      this.positionTrancheList.push({});
    },
    //导入区域
    importTranchePosition(val) {
      if (!val) return;
      var that = this;
      let data = {
        site: true,
        projectid:
          this.contrForPrionum == 5
            ? this.$store.state.projectid
            : this.$store.state.intoProjectid,
        groundid: this.currentProjectid.groundid,
      };

      getTranche(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            if (res.data.length > 0) {
              // //导入后自动去重
              let arr = res.data;
              that.positionTrancheList.forEach((i) => {
                arr.forEach((j, index) => {
                  if (j.name == i.name) {
                    arr.splice(index, 1);
                  }
                });
              });
              arr.forEach((item) => {
                that.positionTrancheList.push({ name: item.name, id: "" });
              });
              for (let i = 0; i < that.positionTrancheList.length; i++) {
                if (that.positionTrancheList[i].fremove == 1) {
                  that.positionTrancheList[i].fremove = true;
                } else {
                  that.positionTrancheList[i].fremove = false;
                }
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
    //删除区域
    deleTrancheRowPosition(index, name, id) {
      var that = this;
      if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        that.$message({
          message: that.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      if (!id) {
        this.positionTrancheList.splice(index, 1);
      } else {
        let data = {
          site: true,
          id: id,
          name: name,
          projectid:
            this.contrForPrionum == 5
              ? this.$store.state.projectid
              : this.$store.state.intoProjectid,
        };
        delTranche(
          JSON.stringify(data),
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.positionTrancheList.splice(index, 1);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    // 区域管理
    addTrancheRowTruePosition() {
      var that = this;
      let flag = false;
      let flag1 = false;
      let hash = {};
      $.each(this.positionTrancheList, function (i, n) {
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
          message: that.$t("floormanagement.tippp4"),
          type: "error",
        });
        return;
      }
      if (flag1) {
        that.$message({
          message: that.$t("floormanagement.tippp5"),
          type: "error",
        });
        return;
      }
      let data = {
        site: true,
        tranches: JSON.parse(JSON.stringify(this.positionTrancheList)),
        groundid: that.groundid,
        projectid:
          this.contrForPrionum == 5
            ? this.$store.state.projectid
            : this.$store.state.intoProjectid,
      };
      for (let i = 0; i < data.tranches.length; i++) {
        if (
          data.tranches[i].fremove === true ||
          data.tranches[i].fremove === 1
        ) {
          data.tranches[i].fremove = 1;
        } else {
          data.tranches[i].fremove = 2;
        }
      }
      data.tranches = JSON.stringify(data.tranches);
      addTranche(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("Building.Setsuccessfully"),
              type: "success",
            });
            that.addTranchePosition = false;
            flag = false;
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

    addTrancheRowCancelPosition() {
      this.addTranchePosition = false;
      this.positionTrancheList = [];
    },

    // 3D地图设置扫描区域
    setAreas3D(marker, popMarker, ground) {
      this.popMarker.remove();
      this.popMarkerTip = false;
      this.popMarkerTip = false;
      this.areaInfo = keepFengmapRaw(marker);
      this.setAreaDeveui = marker.selfAttr.deveui;
      this.radio = marker.selfAttr.anglimit;
      this.oldRadio = marker.selfAttr.anglimit;
      this.setAnglimit3D = true;
    },
    setAreas3DCancel() {
      this.setAnglimit3D = false;
    },
    setAreas3DTrue() {
      var that = this;
      if (this.radio == this.oldRadio) {
        that.setAnglimit3D = false;
        return;
      }
      let data = {
        deveui: this.setAreaDeveui,
        anglimit: this.radio,
      };
      if (this.intoProjectType == 1) {
        updateAnglimit(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.areaInfo.selfAttr.anglimit = that.radio;
            that.$message({
              message: that.$t("staffmanagement.Setsuccessfully"),
              type: "success",
            });
            that.setAnglimit3D = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      } else if (this.intoProjectType == 2) {
        updateDevListToGwAnglimit(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.areaInfo.values_.anglimit = that.radio;
            that.$message({
              message: that.$t("staffmanagement.Setsuccessfully"),
              type: "success",
            });
            that.setAnglimit3D = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },

    //查询图标
    searchArranges() {
      this.changeMajor = true;
      this.changeMinor = true;
      if (
        this.searchInuse == "" &&
        this.searchDeveui == "" &&
        this.searchAlias == ""
      ) {
        this.searchInuse = 2;
      }
      var that = this;
      var data;
      if (this.activeMenu != "0") {
        data = {
          deveui: that.searchDeveui,
          alias: that.searchAlias,
          inuse: that.searchInuse,
          devtype: that.activeMenu,
          tenantid: that.contrForPrionum == 5 ? that.superId : that.tenantid_A,
          page: 1,
          count: 20,
          projectid: that.intoProjectid,
        };
      } else {
        if (this.$store.state.intoProjectType == 1) {
          //正向项目
          data = {
            deveui: this.searchDeveui,
            alias: this.searchAlias,
            inuse: this.searchInuse,
            fortype: "2",
            inallot: "1",
            projectid: this.intoProjectid,
            page: 1,
            count: 20,
          };
        } else if (this.$store.state.intoProjectType == 2) {
          //反向项目
          data = {
            deveui: this.searchDeveui,
            alias: this.searchAlias,
            inuse: this.searchInuse,
            inallot: "1",
            projectid: this.intoProjectid,
            page: 1,
            count: 20,
          };
        }
      }

      if (this.searchInuse == 1) {
        data.groundid = this.groundid;
      }
      if (this.activeMenu != "0") {
        getDevOtherList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.arrangeData = res.data.list;
            that.currentPage2 = 1;
            that.totalArrange = res.data.size;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      } else {
        if (this.$store.state.intoProjectType == 1) {
          //正向项目
          getBeaconPosList(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.arrangeData = res.data.list;
              that.currentPage2 = 1;
              that.totalArrange = res.data.size;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else if (this.$store.state.intoProjectType == 2) {
          //反向项目
          getDevPosList(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.arrangeData = res.data.list;
              that.currentPage2 = 1;
              that.totalArrange = res.data.size;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        }
      }
    },

    //重置布置查询
    clearArranges() {
      this.changeMajor = true;
      this.changeMinor = true;
      var that = this;
      this.inuseType = [
        {
          index: 1,
          message: that.$t("floormanagement.value1"),
        },
        {
          index: 2,
          message: that.$t("floormanagement.value2"),
        },
      ];
      Object.assign(
        this.$data.inuseType,
        this.$options.data.call(this).inuseType
      );
      this.searchDeveui = "";
      this.searchAlias = "";
      this.searchInuse = 2;

      this.currentPage2 = 1;
      this.searchArranges();
      if (this.arrange3D) {
        that.layerList.forEach((item) => {
          item.remove();
        });
        that.layerList = [];
        that.currentFeature = [];
        that.lineMarkerList.forEach((item) => {
          item.remove();
        });
        this.addSubPolygon3D();
        if (that.$store.state.intoProjectType == 1) {
          that.getArrangeBeaconPos3D(that.intoProjectid, that.lastGroupid);
        } else if (that.$store.state.intoProjectType == 2) {
          that.getArrangeGatewayPos3D(that.intoProjectid, that.lastGroupid);
        }
      }
    },

    //布置分页
    handleCurrentChangeArrange(val) {
      this.currentPage2 = val;
      this.changePageSearchArrange(val);
    },

    //布置分页查询
    changePageSearchArrange(val) {
      if (
        this.searchInuse == "" &&
        this.searchDeveui == "" &&
        this.searchAlias == ""
      ) {
        this.searchInuse = 2;
      }
      var page;
      if (val == "" || val == undefined) {
        page = 1;
      } else {
        page = val;
      }
      var that = this;
      var data;
      if (this.$store.state.intoProjectType == 1) {
        //正向项目
        data = {
          deveui: this.searchDeveui,
          alias: this.searchAlias,
          inuse: this.searchInuse,
          fortype: "2",
          inallot: "1",
          projectid: this.intoProjectid,
          page: page,
          count: 20,
        };
      } else if (this.$store.state.intoProjectType == 2) {
        //反向项目
        data = {
          deveui: this.searchDeveui,
          alias: this.searchAlias,
          inuse: this.searchInuse,
          inallot: "1",
          projectid: this.intoProjectid,
          page: page,
          count: 20,
        };
      }

      if (this.searchInuse == 1) {
        data.groundid = this.groundid;
      }

      if (this.$store.state.intoProjectType == 1) {
        //正向项目
        getBeaconPosList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.arrangeData = res.data.list;
            that.totalArrange = res.data.size;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      } else if (this.$store.state.intoProjectType == 2) {
        //反向项目
        getDevPosList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.arrangeData = res.data.list;
            that.totalArrange = res.data.size;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },

    //布置
    arrangeMaps(info, scope) {
      var that = this;
      this.length = info.length;
      this.width = info.width;
      this.changeMajor = true;
      this.changeMinor = true;
      this.dobuleClick = true;
      if (scope.row.mapname === null) {
        that.$message({
          message: that.$t("floormanagement.Unboundmap"),
          type: "warning",
        });

        that.dobuleClick = false;
        return;
      }
      if (that.intoProjectType == 1) {
        that.iconSrc = "../../../static/beacon.png";
        that.showOptions = true;
        that.showOption = 1;
      } else if (that.intoProjectType == 2) {
        that.iconSrc = "../../../static/gateway.png";
        that.showOptions = true;
        that.showOption = 5;
      }

      this.groundid = info.id;
      this.buildid = info.buildid;
      if (info.maptype == 2) {
        let data = {
          buildid: info.buildid,
        };
        getGround(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.groundListCopy = [];
              for (let i = 0; i < res.data.length; i++) {
                let groundinfo = {
                  groundid: res.data[i].id,
                  ground: res.data[i].ground,
                  newground: i + 1,
                };
                that.groundListCopy.push(groundinfo);
              }

              that.newGround = that.groundListCopy.find(function (item) {
                return item.ground == info.ground;
              });
              if (!that.newGround) {
                that.$message({
                  message: that.$t("floormanagement.Unboundmap"),
                  type: "warning",
                });
                that.dobuleClick = false;
                return;
              }
              const matchedFloor =
                res.data.find((item) => item.ground == info.ground) ||
                res.data[0];
              that.pendingMap3DInit = {
                group: that.newGround.newground,
                projectid: info.projectid,
                appname: matchedFloor.appname || info.appname,
                mapkey: matchedFloor.mapkey || info.mapkey,
              };
              that.arrange3D = true; //3d布置
              that.showTable = false;
              that.fmapId = matchedFloor.filename || info.filename;
              that.themeId = matchedFloor.filetype || info.filetype;
              if (that.$store.state.intoProjectType == 2) {
                that.getGatewayPos(info.projectid, 1);
              } else if (that.$store.state.intoProjectType == 1) {
                that.getBeaconPos(info.projectid, 1);
              }
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          }
        );
      }
      this.searchInuse = 2;
    },
    handleArrange3DDialogOpened() {
      if (!this.pendingMap3DInit || this.map3d) {
        return;
      }
      clearTimeout(this._arrange3DOpenTimer);
      this.initMap3DWhenReady(this.pendingMap3DInit);
    },
    initMap3DWhenReady(pending, retries = 0) {
      if (this.map3d) {
        return;
      }
      this.$nextTick(() => {
        const container = this.$refs.fengMap;
        if (
          !container ||
          container.clientWidth < 10 ||
          container.clientHeight < 10
        ) {
          if (retries < 40) {
            setTimeout(() => this.initMap3DWhenReady(pending, retries + 1), 50);
          }
          return;
        }
        this.pendingMap3DInit = null;
        this.onmap(
          pending.group,
          pending.projectid,
          pending.appname,
          pending.mapkey
        );
      });
    },

    //反向项目默认获取未布置的设备,列表显示
    getGatewayPos(projectid, page) {
      var that = this;
      this.searchArrangeList = {
        projectid: projectid,
        inallot: 1,
        inuse: 2,
        workstate: 1,
        page: page,
        count: 20,
      };
      getDevPosList(
        this.searchArrangeList,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.arrangeData = res.data.list;
          that.totalArrange = res.data.size;
        }
      });
    },

    //正向项目默认获取未布置的设备,列表显示
    getBeaconPos(projectid, page) {
      var that = this;
      this.searchArrangeList = {
        fortype: 2,
        projectid: projectid,
        inallot: 1,
        inuse: 2,
        workstate: 1,
        page: page,
        count: 20,
      };
      getBeaconPosList(
        this.searchArrangeList,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.arrangeData = res.data.list;
          that.totalArrange = res.data.size;
        }
      });
    },

    //表格里选中
    selectArrange(val) {
      // 关闭其他绘制
      if (this.sub) {
        this.closeSub();
      }
      if (this.adj) {
        this.closeAdj();
      }
      var that = this;
      if (val) {
        if (val.inuse == 2) {
          this.selectArrangeData = val;
        }
      }
    },
  },
  beforeUnmount() {
    this.closeMap3D();
  },
};
</script>

<style scoped>
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
  padding: 5px 0 !important;
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

.mapContent {
  width: auto;
  height: 100%;
  margin: 0 !important;
  margin-right: 0;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
}

.searchArrange {
  flex: 0 0 auto;
  margin: 0 !important;
  width: 100%;
  padding: 8px 12px 4px;
  box-sizing: border-box;
}

.arrange-map-row {
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  display: flex;
  align-items: stretch;
  margin: 0 !important;
  text-align: left;
}

.arrange-map-wrap {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  margin: 0 !important;
  flex: 1;
}

.arrange-map-tip.show_video {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 12;
  margin: 0 !important;
  text-align: center;
}

.feng-map-container,
#fengMap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% - 28px);
  display: block;
  z-index: 11;
  margin: 0 !important;
  overflow: hidden;
}
.feng-map-container canvas,
#fengMap canvas {
  display: block;
  margin: 0;
}
.tableContent {
  flex: 0 0 148px;
  width: 148px;
  min-width: 148px;
  max-width: 148px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  margin-right: 0;
  overflow: hidden;
  position: relative;
  z-index: 5;
  background: rgba(241, 245, 247, 0.96);
  box-sizing: border-box;
  border-left: 1px solid #e4e7ed;
  padding: 4px 0 8px;
}
.tableContent.is-expanded {
  flex: 0 0 32%;
  width: 32%;
  min-width: 320px;
  max-width: 38%;
  align-self: stretch;
  overflow: hidden;
  background: #f1f5f7;
  padding: 0;
}
.show_table {
  flex: 0 0 148px;
  width: 148px;
  min-width: 148px;
  margin-right: 0;
  z-index: 1;
  text-align: left;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.hamburger {
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: block;
  margin: 6px 0 8px 12px;
  flex: 0 0 auto;
}
.table_data {
  flex: 1 1 0;
  min-width: 0;
  overflow: auto;
}
.chose_table {
  text-align: left !important;
  background-color: transparent !important;
  border: 0 !important;
  width: 100% !important;
  min-height: 0 !important;
  padding: 0 !important;
  --el-menu-base-level-padding: 12px;
  --el-menu-level-padding: 0px;
}
.tableContent.is-expanded .chose_table {
  background-color: #f1f5f7 !important;
}
.chose_table :deep(.el-menu-item) {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0 !important;
  width: 100% !important;
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 12px !important;
  padding-left: 12px !important;
  padding-right: 12px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  background: transparent !important;
  text-align: left !important;
}
.chose_table :deep(.el-menu-item .icon) {
  flex: 0 0 18px !important;
  width: 18px !important;
  height: 18px !important;
  margin: 0 8px 0 0 !important;
}
.chose_table :deep(.el-menu-item > span),
.chose_table :deep(.el-menu-item span) {
  flex: 0 1 auto !important;
  display: block !important;
  width: auto !important;
  max-width: calc(100% - 26px);
  margin: 0 !important;
  padding: 0 !important;
  font-size: 13px;
  line-height: 18px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left !important;
}
.chose_table :deep(.el-menu-item.is-active) {
  background: transparent !important;
}
.chose_table :deep(.el-menu-item.is-active .icon) {
  background-color: #458bff;
}
.chose_table :deep(.el-menu-item.is-active span) {
  color: #458bff;
  font-weight: 500;
}
.icon {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  display: inline-block;
  background-color: #9c9c9c;
  transition: background-color 0.2s;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
.icon.beacon {
  mask-image: url("../../assets/beacon.svg");
  -webkit-mask-image: url("../../assets/beacon.svg");
}
.icon.smoke {
  mask-image: url("../../assets/smoke.svg");
  -webkit-mask-image: url("../../assets/smoke.svg");
}
.icon.aoagw {
  mask-image: url("../../assets/aoagw.svg");
  -webkit-mask-image: url("../../assets/aoagw.svg");
}
.icon.alarm {
  mask-image: url("../../assets/alarm.svg");
  -webkit-mask-image: url("../../assets/alarm.svg");
}
.icon.camera {
  mask-image: url("../../assets/camera.svg");
  -webkit-mask-image: url("../../assets/camera.svg");
}

#leftmenu_container {
  display: none;
}
#leftmenu_container1 {
  display: none;
}
#contextmenu_container {
  display: flex;
  flex-direction: column;
}
#contextmenu_container li {
  display: flex;
}

#polygonMenu {
  display: flex;
  flex-direction: column;
}
#polygonMenu li {
  display: flex;
}
.ol-popup-closer {
  margin-right: 2px;
}

li {
  list-style: none;
  margin-top: 5px;
}
.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}

#popup_contentLeft {
  background: #fff;
  padding: 3px 15px 3px 10px;
}

#popup_contentLeft li {
  list-style: none;
  text-align: left;
}
#popup_contentLeft li:first-of-type {
  margin-top: 10px;
}
#popup_contentLeft li:last-of-type {
  margin-bottom: 5px;
}
.nearSubtranche {
  word-wrap: break-word;
  word-break: normal;
}
.ol-popup-closerLeft {
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
.backProject :deep(.el-page-header__left) {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject :deep(.el-page-header__content) {
  text-align: left !important;
}
.arrange-3d-page {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: #f1f5f7;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.arrange-dialog-inner {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box;
}

.arrangeDialog3D :deep(.el-dialog) {
  background-color: #f1f5f7 !important;
  display: flex;
  flex-direction: column;
  height: 100vh !important;
  margin: 0 !important;
  max-height: 100vh;
}

.arrangeDialog3D :deep(.el-dialog__body) {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 10px 16px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.arrange-dialog-inner {
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
}

.arrangeDialog3D :deep(.el-dialog__header) {
  display: none !important;
}
.showHeadr :deep(.el-dialog__header) {
  display: block !important;
}
.setAreas :deep(.el-radio-group) {
  display: flex !important;
  flex-wrap: wrap;
}
.setAreas :deep(.el-radio) {
  width: 20%;
  margin-left: 2%;
  margin-right: 0;
  margin-top: 2%;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.demo-form-inline {
  margin-right: 0;
}
.hiddenclock {
  display: none;
}

.threecontent :deep(li) {
  margin-top: 5px;
}

.setAdjoinBeacon :deep(.el-dialog) {
  margin-right: 2%;
}
.addTranche :deep(.el-form-item__content) {
  display: flex;
}
.tranchSwitch {
  display: flex;
  line-height: 34px;
  height: 34px;
}
.tranchSwitch :deep(.ivu-switch) {
  height: 22px;
  margin-top: 6px;
  margin-bottom: 6px;
}
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
.changShowButton {
  position: absolute;
  bottom: 4%;
  z-index: 12;
}
.arrange-3d-page {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: #f1f5f7;
  display: flex;
  flex-direction: column;
  text-align: left;
}
</style>
<style>
.arrange-3d-page {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: #f1f5f7;
  display: flex;
  flex-direction: column;
}
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
</style>