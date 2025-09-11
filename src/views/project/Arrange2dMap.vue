<template>
  <div style="height: 100%">
    <div class="content">
      <el-container>
        <el-main>
          <!-- 布置 -->
          <el-dialog
            :visible.sync="arrange"
            class="arrangeDialog"
            :close-on-click-modal="false"
            :show-close="false"
            :fullscreen="true"
            width="100%"
            :close-on-press-escape="false"
          >
            <div style="width: 100%; height: 100%">
              <div class="searchArrange">
                <el-form
                  class="demo-form-inline"
                  style="display: flex; white-space: nowrap"
                >
                  <el-button
                    type="primary"
                    @click="arrangcancel()"
                    style="width: 90px; height: 30px; text-align: left"
                    size="mini"
                    icon="el-icon-arrow-left"
                    >{{ $t("login.return") }}</el-button
                  >
                  <el-form-item
                    :label="$t('floormanagement.device')"
                    style="display: flex; margin-left: 2%; margin-right: 0%"
                  >
                    <el-input
                      v-model="searchDeveui"
                      :placeholder="$t('floormanagement.devicenumber')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('floormanagement.Devicealias')"
                    style="display: flex; margin-left: 2%; margin-right: 0%"
                  >
                    <el-input
                      v-model="searchAlias"
                      :placeholder="$t('floormanagement.devicealias')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('floormanagement.status')"
                    style="display: flex; margin-left: 2%; margin-right: 2%"
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
                      >{{ $t("floormanagement.search") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="clearArranges()"
                      class="reset"
                      >{{ $t("floormanagement.reset") }}</el-button
                    >

                    <el-popover placement="top">
                      <div style="display: flex">
                        <el-button
                          size="mini"
                          type="primary"
                          @click="editTranche('alarm')"
                          >{{ $t("floormanagement.Alarmarea") }}</el-button
                        >
                        <el-button
                          type="primary"
                          size="mini"
                          @click="editTranche('position')"
                          >{{
                            $t("floormanagement.Positioningarea")
                          }}</el-button
                        >
                      </div>
                      <el-button
                        type="primary"
                        class="reset"
                        slot="reference"
                        >{{ $t("floormanagement.Regionalsettings") }}</el-button
                      >
                    </el-popover>

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
                      @click="setSub()"
                      >{{ $t("floormanagement.Addconnectionpoint") }}</el-button
                    >
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
                      @click="closeSub()"
                      >{{ $t("floormanagement.Endsetting") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="showLines()"
                      class="query"
                      v-if="!isShowLines && intoProjectType == 1"
                      >{{ $t("floormanagement.showConnectPoint") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="showLines()"
                      class="query"
                      v-if="isShowLines && intoProjectType == 1"
                      >{{ $t("floormanagement.hideConnectPoint") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="removeGroundDevs()"
                      class="query"
                      >{{ $t("floormanagement.RemoveGroundDev") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="reset"
                      v-if="
                        (contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5) &&
                        intoProjectType == 1
                      "
                      @click="setAdj()"
                      >{{ $t("floormanagement.Setadjacency") }}</el-button
                    >
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
                          {{ $t("floormanagement.title") }}<br />
                          {{ $t("floormanagement.title1") }}<br />
                          {{ $t("floormanagement.title2") }}<br />
                          {{ $t("floormanagement.title3") }}<br />
                          {{ $t("floormanagement.title4") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </div>

              <div
                style="width: 100%; height: 90%; display: flex; margin-top: 2%"
              >
                <div class="mapContent" ref="mapContent">
                  <div style="width: 100%; height: 100%">
                    <div id="allmap" ref="map" class="allmap"></div>
                    <p style="width: 100%">
                      {{ $t("floormanagement.arrangement1") }}
                      <a href="javascript:;" @click="vedio = true">{{
                        $t("floormanagement.Watchdemo")
                      }}</a>
                    </p>
                  </div>

                  <!-- 右键显示内容的 -->
                  <div id="polygonMenu" ref="polygonMenu" class="contextmenu">
                    <ul id="popup-content">
                      <li>
                        <a
                          href="#"
                          id="polygonMenu-closer"
                          class="ol-popup-closer"
                        >
                          <img
                            src="../../../static/close.jpg"
                            width="11"
                            height="11"
                            alt=""
                        /></a>
                      </li>
                      <li>
                        <el-button id="editNear" size="mini" class="dels">{{
                          $t("floormanagement.Deleteadjacency")
                        }}</el-button>
                      </li>
                      <li>
                        <el-button id="delPolygon" size="mini" class="dels">{{
                          $t("floormanagement.delete")
                        }}</el-button>
                      </li>
                    </ul>
                  </div>
                  <div
                    id="contextmenu_container"
                    ref="contextmenu_container"
                    class="contextmenu"
                  >
                    <ul id="popup-content">
                      <li>
                        <a href="#" id="popup-closer" class="ol-popup-closer">
                          <img
                            src="../../../static/close.jpg"
                            width="11"
                            height="11"
                            alt=""
                        /></a>
                      </li>

                      <li>
                        <el-button id="del" size="mini" class="reset">{{
                          $t("floormanagement.delete")
                        }}</el-button>
                      </li>
                      <li>
                        <el-button id="edit" size="mini" class="reset">{{
                          $t("floormanagement.edit")
                        }}</el-button>
                      </li>
                      <li v-show="!showOther">
                        <el-button id="setArea" class="reset" size="mini">{{
                          $t("floormanagement.Scanningarea")
                        }}</el-button>
                      </li>
                      <li
                        v-show="
                          contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5
                        "
                      >
                        <el-button id="setTranche" class="reset" size="mini">{{
                          $t("floormanagement.Setarea")
                        }}</el-button>
                      </li>
                      <li v-show="clock && !showOther">
                        <el-button id="setClock" size="mini" class="reset">{{
                          $t("floormanagement.Setascheckin")
                        }}</el-button>
                      </li>
                      <li v-show="caecelClock && !showOther">
                        <el-button id="cancelClock" size="mini" class="reset">{{
                          $t("floormanagement.Cancelclockout")
                        }}</el-button>
                      </li>
                      <li
                        v-show="
                          (contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5) &&
                          showBeacon &&
                          intoProjectType == 1 &&
                          !showOther
                        "
                      >
                        <el-button
                          id="setAdjoinBeacon"
                          size="mini"
                          class="reset"
                          >{{
                            $t("floormanagement.Setadjacentbeacon")
                          }}</el-button
                        >
                      </li>
                      <li v-show="clearBeaconList && !showOther">
                        <el-button
                          id="cancelNearList"
                          size="mini"
                          class="reset dels"
                          >{{
                            $t("floormanagement.Deleteadjacency")
                          }}</el-button
                        >
                      </li>

                      <li>
                        <el-button
                          id="calculatingDistance"
                          size="mini"
                          class="reset"
                          >{{
                            $t("floormanagement.CalculateDistance")
                          }}</el-button
                        >
                      </li>
                    </ul>
                  </div>
                </div>
                <!-- 表格 -->
                <div class="tableContent" ref="tableContent">
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
                      :collapse="isCollapse"
                    >
                      <el-menu-item index="0" @click="menuClick('0', 1)">
                        <span>{{ $t("otherDev.beacon") }}</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="$t('otherDev.beacon')"
                          placement="right"
                          :disabled="!isCollapse"
                        >
                          <i class="icon beacon"></i>
                        </el-tooltip>
                      </el-menu-item>

                      <el-menu-item
                        index="2"
                        v-if="aoagw"
                        @click="menuClick('1', 1)"
                      >
                        <span>{{ $t("otherDev.aoaGateway") }}</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="$t('otherDev.aoaGateway')"
                          placement="right"
                          :disabled="!isCollapse"
                        >
                          <i class="icon aoagw"></i>
                        </el-tooltip>
                      </el-menu-item>

                      <el-menu-item
                        index="3"
                        v-if="smoke"
                        @click="menuClick('2', 1)"
                      >
                        <span>{{ $t("otherDev.smokeSensor") }}</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="$t('otherDev.smokeSensor')"
                          placement="right"
                          :disabled="!isCollapse"
                        >
                          <i class="icon smoke"></i>
                        </el-tooltip>
                      </el-menu-item>

                      <el-menu-item
                        index="4"
                        v-if="alertor"
                        @click="menuClick('3', 1)"
                      >
                        <span>{{ $t("otherDev.burglarAlarm") }}</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="$t('otherDev.burglarAlarm')"
                          placement="right"
                          :disabled="!isCollapse"
                        >
                          <i class="icon alarm"></i>
                        </el-tooltip>
                      </el-menu-item>

                      <el-menu-item
                        index="6"
                        v-if="camera"
                        @click="menuClick('5', 1)"
                      >
                        <span>{{ $t("otherDev.camera") }}</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="$t('otherDev.camera')"
                          placement="right"
                          :disabled="!isCollapse"
                        >
                          <i class="icon camera"></i>
                        </el-tooltip>
                      </el-menu-item>
                    </el-menu>
                  </div>
                  <div class="table_data" v-if="showTable">
                    <el-table
                      ref="multipleTable"
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
                        :key="Math.random()"
                      ></el-table-column>

                      <el-table-column
                        property="minor"
                        :label="$t('beacon.minor')"
                        show-overflow-tooltip
                        min-width="60"
                        align="center"
                        v-if="activeMenu == '0' && intoProjectType == 1"
                        :key="Math.random()"
                      ></el-table-column>
                      <el-table-column
                        property="deveui"
                        :label="$t('beacon.beaconid')"
                        show-overflow-tooltip
                        align="center"
                        v-if="activeMenu == '0' && intoProjectType == 2"
                        :key="Math.random()"
                      ></el-table-column>
                      <el-table-column
                        property="deveui"
                        :label="$t('terminal.DeviceID')"
                        show-overflow-tooltip
                        align="center"
                        v-if="activeMenu != '0'"
                        :key="Math.random()"
                      ></el-table-column>
                      <el-table-column
                        property="alias"
                        :label="$t('floormanagement.Devicealias2')"
                        show-overflow-tooltip
                        align="center"
                        :key="Math.random()"
                      ></el-table-column>
                      <el-table-column
                        property="typestr"
                        :label="$t('floormanagement.DeviceType2')"
                        show-overflow-tooltip
                        align="center"
                        v-if="activeMenu == '0' && intoProjectType == 1"
                        :key="Math.random()"
                      ></el-table-column>
                      <el-table-column
                        property="devtypestr"
                        :label="$t('floormanagement.DeviceType2')"
                        show-overflow-tooltip
                        align="center"
                        v-if="activeMenu != '0'"
                        :key="Math.random()"
                      ></el-table-column>
                      <el-table-column
                        property="inusestr"
                        :label="$t('floormanagement.status1')"
                        show-overflow-tooltip
                        align="center"
                        :key="Math.random()"
                      ></el-table-column>

                      <el-table-column
                        :property="i8n == 'zh' ? 'workstatestr' : 'enworkstate'"
                        :label="$t('floormanagement.workingcondition')"
                        show-overflow-tooltip
                        align="center"
                        :key="Math.random()"
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
                <!-- 修改图标显示的文字 -->
                <div class="changShowButton" v-if="showOptions">
                  <el-dropdown @command="showOptionsTrue">
                    <el-button type="primary">
                      {{ showOptionName
                      }}<i class="el-icon-arrow-up el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        command="1"
                        v-if="intoProjectType == 1"
                        >{{ $t("change.showAliases") }}</el-dropdown-item
                      >
                      <el-dropdown-item
                        command="2"
                        v-if="intoProjectType == 1"
                        >{{ $t("change.showMajor16") }}</el-dropdown-item
                      >
                      <el-dropdown-item
                        command="3"
                        v-if="intoProjectType == 1"
                        >{{ $t("change.showMajor10") }}</el-dropdown-item
                      >
                      <el-dropdown-item command="4">{{
                        $t("change.showPosition")
                      }}</el-dropdown-item>
                      <el-dropdown-item command="5">{{
                        $t("change.showAlarm")
                      }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>

            <!-- 编辑设备信息 -->
            <el-dialog
              width="30%"
              :title="$t('floormanagement.Editdeviceinformation')"
              class="showHeadr"
              :visible.sync="editFeatures"
              :modal="false"
              style="text-align: center"
              @close="closeEdit"
            >
              <el-form
                :model="editFeatureData"
                label-width="120px"
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
              <div slot="footer" class="dialog-footer">
                <el-button @click="editFeatureCancel()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button type="primary" @click="editFeaturesTrue()">{{
                  $t("change.sure")
                }}</el-button>
              </div>
            </el-dialog>

            <!-- 设置信标扫描区域 -->
            <el-dialog
              width="40%"
              :visible.sync="setAreas"
              :modal="false"
              class="showHeadr setAreas"
              style="text-align: center"
              @close="setAreaCancel"
            >
              <span slot="title"
                >{{ $t("floormanagement.Setscanarea") }}
                <el-tooltip class="item" effect="light" placement="right-start">
                  <div slot="content">
                    <p>{{ $t("floormanagement.scannedarea") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-radio-group v-model="radio">
                <el-radio :label="2"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl1"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="1"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl2"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="8"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl4"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="4"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl8"
                    fit="fit"
                  ></el-image
                ></el-radio>

                <el-radio :label="6"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl9"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="3"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl3"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="9"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl6"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="12"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl12"
                    fit="fit"
                  ></el-image
                ></el-radio>

                <el-radio :label="14"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl13"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="13"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl14"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="7"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl11"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="11"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl7"
                    fit="fit"
                  ></el-image
                ></el-radio>
                <el-radio :label="15"
                  ><el-image
                    style="width: 100px; height: 100px"
                    :src="setAreasUrl15"
                    fit="fit"
                  ></el-image
                ></el-radio>
              </el-radio-group>
              <div slot="footer" class="dialog-footer">
                <el-button @click="setAreaCancel()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button type="primary" @click="setAreaTrue()">{{
                  $t("change.sure")
                }}</el-button>
              </div>
            </el-dialog>
            <!-- 编辑区域 -->
            <!-- 2D 地图鼠标右键设置区域 -->
            <el-dialog
              :title="$t('floormanagement.Setarea')"
              :visible.sync="trancheShow"
              class="edit showHeadr"
              width="30%"
              style="text-align: center"
              :modal="false"
              @close="closeTranche"
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
                <el-form-item :label="$t('floormanagement.Alarmarea1')">
                  <el-select
                    v-model="TrancheDatas.alarmid"
                    clearable
                    filterable
                    :placeholder="$t('terminal.choose')"
                  >
                    <el-option
                      v-for="item in setAlarmTrancheList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="updateTrancheCancel()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button
                  type="primary"
                  @click="updateTrancheTrue()"
                  :loading="loading"
                  >{{ $t("change.sure") }}</el-button
                >
              </div>
            </el-dialog>

            <!-- 2D 地图设置相邻信标 -->
            <el-dialog
              :title="
                $t('tet.setup') + adjoinBeaconAlias + $t('tet.Adjacentbeacon')
              "
              :visible.sync="adjoinBeaconShow"
              class="edit showHeadr setAdjoinBeacon"
              width="30%"
              style="text-align: center; margin-right: 2%"
              :modal="false"
              @close="closeAdjoinBeacon"
              @open="openAdjoinBeacon"
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
                    <div slot="content">
                      <p>{{ $t("floormanagement.title5") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="updateAdjoinBeaconCancel()">{{
                  $t("change.cancle")
                }}</el-button>
                <el-button
                  type="primary"
                  @click="setAdjoinBeaconTrue()"
                  :loading="loading"
                  >{{ $t("change.sure") }}</el-button
                >
              </div>
            </el-dialog>
          </el-dialog>
          <el-dialog :visible.sync="vedio" @close="closeVedio('video')">
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
          <el-dialog :visible.sync="vedio2" @close="closeVedio('video2')">
            <video width="100%" controls autoplay id="video2">
              <source src="../../../static/3D~1.mp4" type="video/mp4" />
            </video>
          </el-dialog>

          <!-- 设置定位区域 -->
          <el-dialog
            :title="$t('floormanagement.Positioningarea')"
            :visible.sync="addTranchePosition"
            class="edit"
            width="40%"
            style="text-align: center"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
            :append-to-body="true"
            @close="addTrancheRowCancelPosition"
          >
            <div slot="title" class="dialog-title">
              <span class="title-text"
                >{{ $t("floormanagement.Positioningarea") }}
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style=""
                >
                  <div slot="content">
                    <p>
                      {{ $t("floormanagement.title6") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
            </div>

            <el-radio-group size="small">
              <el-button
                type="primary"
                class="add"
                style="float: left"
                @click="addTrancheRowPosition"
                >{{ $t("floormanagement.add") }}</el-button
              >
            </el-radio-group>

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
                    >{{ $t("floormanagement.delete") }}</el-button
                  >
                </p>

                <p class="tranchSwitch">
                  <span>{{ $t("floormanagement.Regionalshake") }}</span>
                  <i-switch
                    size="large"
                    :value="item.fremove"
                    v-model="item.fremove"
                  >
                    <span slot="open">{{ $t("floormanagement.open") }}</span>
                    <span slot="close">{{ $t("floormanagement.close") }}</span>
                  </i-switch>
                </p>
              </el-form-item>
            </el-form>
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
            <div slot="footer" class="dialog-footer" style="margin-top: -10px">
              <el-button @click="addTrancheRowCancelPosition()">{{
                $t("change.cancle")
              }}</el-button>
              <el-button type="primary" @click="addTrancheRowTruePosition()">{{
                $t("change.sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 设置告警区域 -->
          <el-dialog
            :title="$t('floormanagement.Alarmarea')"
            :visible.sync="addTrancheAlarm"
            class="edit"
            width="40%"
            style="text-align: center"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
            :append-to-body="true"
            @close="addTrancheRowCancelAlarm"
          >
            <div slot="title" class="dialog-title">
              <span class="title-text"
                >{{ $t("floormanagement.Alarmarea") }}
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style=""
                >
                  <div slot="content">
                    <p>
                      {{ $t("floormanagement.title6") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
            </div>

            <el-radio-group size="small">
              <el-button
                type="primary"
                class="add"
                style="float: left"
                @click="addTrancheRowAlarm"
                >{{ $t("floormanagement.add") }}</el-button
              >
            </el-radio-group>

            <el-form
              label-width="0px"
              v-for="(item, index) in alarmTrancheList"
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
                    @click="deleTrancheRowAlarm(index, item.name, item.id)"
                    >{{ $t("floormanagement.delete") }}</el-button
                  >
                </p>
              </el-form-item>
            </el-form>

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
                  @change="importTrancheAlarm"
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
            <div slot="footer" class="dialog-footer" style="margin-top: -10px">
              <el-button @click="addTrancheRowCancelAlarm()">{{
                $t("change.cancle")
              }}</el-button>
              <el-button type="primary" @click="addTrancheRowTrueAlarm()">{{
                $t("change.sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 显示距离 -->
          <el-dialog
            width="30%"
            class="showHeadr"
            :visible.sync="showDistance"
            :modal="false"
            style="text-align: center"
          >
            <p>{{ $t("floormanagement.Xaxis") }}{{ distanceData.x }}cm</p>
            <p>{{ $t("floormanagement.Yaxis") }}{{ distanceData.y }}cm</p>
          </el-dialog>
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
  getDevPosList,
  getBeaconPosList,
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
  updatePoint,
  addPointNear,
  getPointAndNearList,
  delPointNearByPointid,
  updateBeaconPosOne,
  updateDevListPosOne,
  updateBeacon,
  updateNearBeacons,
  removeGroundDev,
  getDevOtherList,
  getDevAndOtherList,
  updateDevOtherPosOne,
  updateDevList,
  updateDevOther,
  updateDevOtherTranche,
} from "../../axios/api";

// 布置相关
import { click } from "ol/events/condition"; //限制添加锚点
import "ol/ol.css";
import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { getCenter } from "ol/extent";
import { OverviewMap, defaults as defaultControls } from "ol/control.js";
// 图上图标相关
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlLayerVector from "ol/layer/Vector";
import OlSourceVector from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import Overlay from "ol/Overlay";
import { OSM, Vector as VectorSource } from "ol/source";
import {
  Modify,
  Select,
  Translate,
  defaults as defaultInteractions,
} from "ol/interaction";
import { LineString } from "ol/geom";

// 用来添加相关文字描述的
import Text from "ol/style/Text";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { unByKey } from "ol/Observable";

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
      isCollapse: false,
      activeMenu: "0",
      i8n: this.$store.state.i18n,
      currentPoint: [],
      featureModify: "", //图标的拖拽控制器对象
      // MsubN: "", //左键显示子区域名，
      // Mname: "", //左键显示区域名
      // MnearsubN: "", //左键显示相邻子区域名
      vedio: false,
      vedio2: false,
      // deveuiNum: "",
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
      trancheShow: false,
      tableData: [],
      buildid: "",
      currentProjectid: {
        groundid: "",
      },
      // searchList: {
      //   projectid: this.$store.state.intoProjectid,
      //   mapid: "",
      //   buildid: "",
      //   ground: "",
      //   groundid: "",
      //   page: 1,
      //   count: 20,
      // },
      TrancheDatas: {
        beaconids: "",
        tranche: "",
        alias: "",
        alarmid: "",
      },
      currentPage2: 1,
      // total: 0,
      totalArrange: 0,
      dobuleClick: false, //判断是否连续点击了布置按钮
      arrange: false,
      // 布置相关
      caecelClock: false,
      clock: false,
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
      // overlay: "", //鼠标左键单击显示设备号
      searchDeveui: "",
      searchAlias: "",
      searchInuse: "",
      mapLength: "",
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
      selectArrangeData: "", //表格里选中要布置的设备信息
      arrangeData: [], //表格里的设备信息
      showTable: false, //是否显示图表
      editFeatures: false,
      setAreas: false,
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

      editFeatureInfo: "", //选中地图上要编辑的图标信息
      menu_overlay: "",
      imgUrl: "",
      map: null,
      mapName: "allmap",
      vectorLayer: null,
      source: null,
      feature: null,
      showOther: false,
      // otherShow: false,
      show1: false,
      showBeacon: false,
      clearBeaconList: false,
      adjoinBeaconShow: false,
      adjoinBeacon: [],
      adjoinBeaconAlias: "",
      adjoinBeaconData: {
        beaconid: "",
        nearbeacons: "",
      },
      adjoinBeaconInfo: "",
      adjoinBeaconDataList: "",
      positionTrancheList: [],
      alarmTrancheList: [],
      setTrancheList: [],
      setAlarmTrancheList: [],
      addTranchePosition: false,
      addTrancheAlarm: false,
      projectTable: [],
      imageWidth: "",
      imageHeight: "", //记录2D地图的宽高，用作判断移动图标有没有超出地图
      sub: false, //是否是添加连接点状态
      polygonOnce: false, //监听绘制一次完成

      currentAdj: "", //当前选中的相邻点
      //3D 地图相关
      pointList: [],
      // pointNear: false,
      currentFeature: [],
      pointLists: "", //存放点的相邻关系

      changeMajor: true,
      changeMinor: true,

      // 图标显示相关
      showOption: this.$store.state.intoProjectType == 1 ? 1 : 5,
      showOptionName:
        this.$store.state.intoProjectType == 1
          ? this.$t("change.showAliases")
          : this.$t("change.showAlarm"),
      showOptions: false, //是否显示
      isShowLines: false, //是否显示连接线

      select: null, //选中的点
      reallength: 0,
      length: 0,
      realwidth: 0,
      width: 0,
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
        case 5:
          this.showOptionName = this.$t("change.showAlarm");
          break;
        default:
          break;
      }
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
      var that = this;
      that.showTable = !that.showTable;
      if (that.showTable) {
        that.$refs.mapContent.style.width = "70%";
        that.$refs.tableContent.style.width = "30%";
        that.isCollapse = false;
      } else {
        that.$refs.mapContent.style.width = "95%";
        that.$refs.tableContent.style.width = "5%";
        that.isCollapse = true;
      }

      if (that.arrange) {
        setTimeout(() => {
          that.map.updateSize();
        }, 100);
      }
    },
    // 选择表格数据
    menuClick(index, page) {
      var that = this;
      that.activeMenu = index;
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

    //添加单击选中事件
    selectSingleClick() {
      let that = this;
      //只给相邻点添加点击事件
      let arr = that.map.getLayers().getArray();
      let list = [];
      arr.forEach((item, index) => {
        if (item.values_.wrapX == false) {
          arr.splice(index, 1);
        }
      });
      arr.map((item, index) => {
        let source = item.getSource();
        if (source.getFeatures && !source.getFeatures()[0].values_.name) {
          list.push(item);
        }
      });

      const style = new OlStyleStyle({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.3)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/beacon_sos.png",
          scale: 1,
        }),
      });
      const select = new Select({
        style: style,
        hitTolerance: 1,
        condition: click,
      });
      that.map.addInteraction(select);

      select.on("select", (e) => {
        if (window.event.ctrlKey) {
          if (select.getFeatures().array_.length == 0) return;
          if (!select.getFeatures().array_[0].values_.alias) {
            select.getFeatures().array_[0].setStyle(
              new OlStyleStyle({
                fill: new Fill({
                  color: "rgba(255, 255, 255, 0.3)",
                }),
                stroke: new Stroke({
                  color: "#ccc",
                  width: 2,
                }),
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({
                    color: "red",
                  }),
                }),
              })
            );
          }
          return;
        }
        that.currentFeature = select.getFeatures().array_;
        if (e.selected.length == 0) return;
        that.currentFeature.forEach((item, index) => {
          if (e.selected[0] && e.selected[0].ol_uid === item.ol_uid) {
            let image;
            if (item.values_.alias) {
              image = new OlStyleIcon({
                anchor: [0.5, 1],
                src:
                  index == 0
                    ? "../../../static/beacon_sos.png"
                    : "../../../static/beacon_green.png",
                scale: 1,
              });
            } else {
              image = new CircleStyle({
                radius: 7,
                fill: new Fill({
                  color: index == 0 ? "red" : "green",
                }),
              });
            }
            item.setStyle(
              new OlStyleStyle({
                fill: new Fill({
                  color: "rgba(255, 255, 255, 0.3)",
                }),
                stroke: new Stroke({
                  color: "#ccc",
                  width: 2,
                }),
                image: image,
              })
            );
          }
        });

        that.currentAdj = e.selected[0];
      });
    },

    //删除点和线 重新请求加载布置
    resetNear() {
      let that = this;
      let list = that.map.getLayers().getArray();
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!item.getSource().image_) {
          that.map.removeLayer(item);
          i--;
        }
      }
      that.addSubPolygon();
      if (that.intoProjectType == 1) {
        that.getArrangeBeaconPos(that.intoProjectid);
      } else {
        that.getArrangeGatewayPos(that.intoProjectid);
      }
    },
    //设置相邻关系
    setAdj() {
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
      for (let i = 0; i < that.currentFeature.length; i++) {
        if (that.currentFeature[i].values_.devtype) {
          that.$message({
            message: that.$t("floormanagement.selectNonOther"),
            type: "warning",
          });
          return;
        }
      }
      let point = that.currentFeature[0];
      let pointidNears = that.currentFeature
        .map((item, index) => {
          if (index > 0) {
            return item.values_.id || item.values_.deveui;
          }
        })
        .slice(1)
        .join(",");
      let data = {
        groundid: that.groundid,
        pointid: point.values_.id || point.values_.deveui,
        pointidNears: pointidNears,
      };
      addPointNear(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("floormanagement.Layoutsuccessful"),
              type: "success",
            });
            that.resetNear();
            that.currentFeature = [];
            that.select.getFeatures().array_ = [];
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },

    //关闭绘制点操作
    closeSub() {
      this.sub = false;
      unByKey(this.mapClickEvent);
      this.map.removeInteraction(this.draw);
      this.map.removeInteraction(this.snap);
      // this.selectSingleClick();
      this.mapClick();
      // this.select.getFeatures().array_ = [];
    },
    // 添加连接点
    setSub() {
      this.currentAdj = "";
      // this.map.removeInteraction(this.featureModify);
      unByKey(this.mapClickEvent);
      this.sub = true;
      let that = this;
      let coodinate;
      this.mapClickEvent = this.map.on("click", (evt) => {
        if (!that.mapLength) {
          that.$message({
            message: that.$t("floormanagement.Noactualsize"),
            type: "warning",
          });
          return;
        }
        coodinate = evt.coordinate;

        let style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 0.5],
            src: "../../../static/near.png",
            scale: 0.3,
          }),
        });
        var startMarker = new OlFeature({
          point: true,
          geometry: new OlGeomPoint([coodinate[0], coodinate[1]]),
        });
        var adjSource = new OlSourceVector({
          features: [startMarker],
        });
        var adjPoint = new OlLayerVector({
          source: adjSource,
          style: style,
          zIndex: 10000,
        });
        this.map.addLayer(adjPoint);

        let data1 = {
          groundid: this.groundid,
          nodeX: coodinate[0],
          nodeY: coodinate[1],
        };
        addPoint(data1, this.tenantkey_A, this.tenantid_A, this.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("floormanagement.Layoutpointsuccess"),
                type: "success",
              });
              startMarker.set("id", res.data);
              // that.select.getFeatures().array_ = [];
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          }
        );
        // this.modifyFeature(this.map, adjPoint.getSource(), adjPoint);
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
            that.contrForPrionum == 5
              ? that.$store.state.projectid
              : that.$store.state.intoProjectid,
        };
        getTranche(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
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
    addTrancheRowAlarm() {
      this.alarmTrancheList.push({});
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
    importTrancheAlarm(val) {
      if (!val) return;
      var that = this;
      let data = {
        site: false,
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
              that.alarmTrancheList.forEach((i) => {
                arr.forEach((j, index) => {
                  if (j.name == i.name) {
                    arr.splice(index, 1);
                  }
                });
              });
              arr.forEach((item) => {
                that.alarmTrancheList.push({ name: item.name, id: "" });
              });
              // for (let i = 0; i < that.alarmTrancheList.length; i++) {
              //   if (that.alarmTrancheList[i].fremove == 1) {
              //     that.alarmTrancheList[i].fremove = true;
              //   } else {
              //     that.alarmTrancheList[i].fremove = false;
              //   }
              // }
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
    deleTrancheRowAlarm(index, name, id) {
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
        this.alarmTrancheList.splice(index, 1);
      } else {
        let data = {
          site: false,
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
            that.alarmTrancheList.splice(index, 1);
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
    addTrancheRowTrueAlarm() {
      var that = this;
      let flag = false;
      let flag1 = false;
      let hash = {};
      $.each(this.alarmTrancheList, function (i, n) {
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
        site: false,
        tranches: JSON.parse(JSON.stringify(this.alarmTrancheList)),
        groundid: that.groundid,
        projectid:
          this.contrForPrionum == 5
            ? this.$store.state.projectid
            : this.$store.state.intoProjectid,
      };
      for (let i = 0; i < data.tranches.length; i++) {
        data.tranches[i].fremove = 2;
      }
      data.tranches = JSON.stringify(data.tranches);
      addTranche(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("Building.Setsuccessfully"),
              type: "success",
            });
            that.addTrancheAlarm = false;
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
    addTrancheRowCancelAlarm() {
      this.addTrancheAlarm = false;
      this.alarmTrancheList = [];
    },

    //初始化地图
    mapInit(x, y, info) {
      this.imageWidth = x;
      this.imageHeight = y;
      var that = this;
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      setTimeout(() => {
        this.$refs.map.style.width = "100%";
        this.$refs.map.style.height = "90%";

        that.select = new Select();
        // 单击选中
        that.select.on("select", (e) => {
          // if(that.select==null)return
          if (window.event && window.event.ctrlKey) {
            if (that.select.getFeatures().array_.length == 0) return;
            if (!that.select.getFeatures().array_[0].values_.alias) {
              that.select.getFeatures().array_[0].setStyle(
                new OlStyleStyle({
                  fill: new Fill({
                    color: "rgba(255, 255, 255, 0.3)",
                  }),
                  stroke: new Stroke({
                    color: "#ccc",
                    width: 2,
                  }),
                  image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                      color: "red",
                    }),
                  }),
                })
              );
            }
            return;
          }
          that.currentFeature = that.select.getFeatures().array_;
          if (e.selected.length == 0) return;
          that.currentFeature.forEach((item, index) => {
            if (e.selected[0] && e.selected[0].ol_uid === item.ol_uid) {
              let image;
              if (item.values_.alias) {
                image = new OlStyleIcon({
                  anchor: [0.5, 1],
                  src:
                    index == 0
                      ? "../../../static/beacon_sos.png"
                      : "../../../static/beacon_green.png",
                  scale: 1,
                });
              } else {
                image = new CircleStyle({
                  radius: 7,
                  fill: new Fill({
                    color: index == 0 ? "red" : "green",
                  }),
                });
              }
              item.setStyle(
                new OlStyleStyle({
                  fill: new Fill({
                    color: "rgba(255, 255, 255, 0.3)",
                  }),
                  stroke: new Stroke({
                    color: "#ccc",
                    width: 2,
                  }),
                  image: image,
                })
              );
            }
          });

          that.currentAdj = e.selected[0];
        });

        const translate = new Translate({
          features: that.select.getFeatures(),
        });

        let old = [];
        let oldFeature = "";
        //选中点相关线集合
        let lines = [];
        //选中点相关线的坐标集合
        let xy = [];
        let currentFeature = "";
        let differX = 0,
          differY = 0;

        //开始移动
        translate.on("translatestart", (e) => {
          let list = that.map.getLayers().getArray();
          //获取选中的点信息 用于判断线的移动端点
          let feature = e.features.array_[0].values_;
          if (feature.xy) {
            differX = e.coordinate[0] - feature.xy[0];
            differY = e.coordinate[1] - feature.xy[1];
          }
          currentFeature = e.features.array_[0];
          oldFeature = feature;
          let LayerArrays = [];
          //获选中点相关的线集合
          list.forEach((item) => {
            if (
              !item.getSource().image_ &&
              item.getSource().getFeatures()[0].values_
            ) {
              if (feature.id) {
                if (
                  item.getSource().getFeatures()[0].values_.perid ===
                    feature.id ||
                  item.getSource().getFeatures()[0].values_.subid === feature.id
                ) {
                  LayerArrays.push(item);
                }
              }
              if (feature.deveui) {
                if (
                  item.getSource().getFeatures()[0].values_.perid ===
                    feature.deveui ||
                  item.getSource().getFeatures()[0].values_.subid ===
                    feature.deveui
                ) {
                  LayerArrays.push(item);
                }
              }
            }
          });
          old = e.mapBrowserEvent.coordinate;
          lines = LayerArrays;
          //获取线的坐标集合
          lines.forEach((item, index) => {
            const flatCoordinates = item
              .getSource()
              .getFeatures()[0]
              .getGeometry().flatCoordinates;
            //为了判断端点移动 线需要移动的端点坐标设为0
            if (
              flatCoordinates[0] === oldFeature.xy[0] &&
              flatCoordinates[1] === oldFeature.xy[1]
            ) {
              xy.push([0, 0, flatCoordinates[2], flatCoordinates[3]]);
            }
            if (
              flatCoordinates[2] === oldFeature.xy[0] &&
              flatCoordinates[3] === oldFeature.xy[1]
            ) {
              xy.push([flatCoordinates[0], flatCoordinates[1], 0, 0]);
            }
          });
        });

        //移动中
        translate.on("translating", function (e) {
          //遍历该点的相关线
          lines.forEach((item, index) => {
            //移动线，端点坐标为0的就设置为移动中的坐标
            item
              .getSource()
              .getFeatures()[0]
              .getGeometry()
              .setCoordinates([
                [
                  xy[index][0] == 0
                    ? e.mapBrowserEvent.coordinate[0] - differX
                    : xy[index][0],
                  xy[index][1] == 0
                    ? e.mapBrowserEvent.coordinate[1] - differY
                    : xy[index][1],
                ],
                [
                  xy[index][2] == 0
                    ? e.mapBrowserEvent.coordinate[0] - differX
                    : xy[index][2],
                  xy[index][3] == 0
                    ? e.mapBrowserEvent.coordinate[1] - differY
                    : xy[index][3],
                ],
              ]);
          });
        });

        //移动结束
        translate.on("translateend", function (e) {
          // if (window.event.ctrlKey) return;
          //没有移动点就不执行
          if (
            old[0] === e.mapBrowserEvent.coordinate[0] &&
            old[1] === e.mapBrowserEvent.coordinate[1]
          ) {
            old = [];
            lines = [];
            oldFeature = "";
            xy = [];
            return;
          }
          const loading = that.$loading({
            lock: true,
            text: "loading",
            spinner: "el-icon-loading",
            background: "rgba(256, 256, 256, 0.7)",
          });
          let moveTimes = 0;
          function updatePoints() {
            moveTimes += 1;
            let clearMarker = true;
            let data = {
              groundid: that.groundid,
              pointid:
                e.features.array_[0].values_.id ||
                e.features.array_[0].values_.features[0].values_.id,
              nodeX: e.mapBrowserEvent.coordinate[0] - differX,
              nodeY: e.mapBrowserEvent.coordinate[1] - differY,
            };
            // return;
            setTimeout(() => {
              if (clearMarker) {
                that.$message({
                  message: that.$t("floormanagement.Requesttimedout"),
                  type: "warning",
                });
                that.clearArranges();
                loading.close();
              }
            }, 5000);
            updatePoint(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                clearMarker = false;
                moveTimes = 0;
                that.$message({
                  message: that.$t("Building.Layoutsuccessful"),
                  type: "success",
                });
                //移动完成重新设置该点xy信息
                currentFeature.set("xy", [
                  e.mapBrowserEvent.coordinate[0] - differX,
                  e.mapBrowserEvent.coordinate[1] - differY,
                ]);
                setTimeout(() => {
                  loading.close();
                }, 500);
              } else {
                if (moveTimes <= 3) {
                  updatePoints();
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  that.clearArranges();
                  loading.close();
                }
              }
            });
          }
          function updateBeaconPosOnes() {
            let clearMarker = true;
            moveTimes += 1;
            let data = {
              projectid: that.intoProjectid,
              groundid: that.groundid,
              deveui:
                e.features.array_[0].values_.deveui ||
                e.features.array_[0].values_.features[0].values_.deveui,
              longi: e.mapBrowserEvent.coordinate[0] - differX,
              lati: e.mapBrowserEvent.coordinate[1] - differY,
              falg: true,
            };
            setTimeout(() => {
              if (clearMarker) {
                that.$message({
                  message: that.$t("floormanagement.Requesttimedout"),
                  type: "warning",
                });
                that.clearArranges();

                loading.close();
              }
            }, 5000);

            if (e.features.array_[0].values_.devtype) {
              data.devtype = e.features.array_[0].values_.devtype;
              updateDevOtherPosOne(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  clearMarker = false;
                  setTimeout(() => {
                    loading.close();
                  }, 500);
                  moveTimes = 0;
                  that.$message({
                    message: that.$t("Building.Layoutsuccessful"),
                    type: "success",
                  });
                  //移动完成重新设置该点xy信息
                  currentFeature.set("xy", [
                    e.mapBrowserEvent.coordinate[0] - differX,
                    e.mapBrowserEvent.coordinate[1] - differY,
                  ]);
                } else {
                  if (moveTimes <= 3) {
                    updateBeaconPosOnes();
                  } else {
                    loading.close();
                    that.$message({
                      message:
                        that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                      type: "error",
                    });

                    that.clearArranges();
                  }
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
                    clearMarker = false;
                    setTimeout(() => {
                      loading.close();
                    }, 500);
                    moveTimes = 0;
                    that.$message({
                      message: that.$t("Building.Layoutsuccessful"),
                      type: "success",
                    });
                    //移动完成重新设置该点xy信息
                    currentFeature.set("xy", [
                      e.mapBrowserEvent.coordinate[0] - differX,
                      e.mapBrowserEvent.coordinate[1] - differY,
                    ]);
                  } else {
                    if (moveTimes <= 3) {
                      updateBeaconPosOnes();
                    } else {
                      loading.close();
                      that.$message({
                        message:
                          that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                        type: "error",
                      });

                      that.clearArranges();
                    }
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
                    clearMarker = false;
                    setTimeout(() => {
                      loading.close();
                    }, 500);
                    moveTimes = 0;
                    that.$message({
                      message: that.$t("Building.Layoutsuccessful"),
                      type: "success",
                    });
                    //移动完成重新设置该点xy信息
                    currentFeature.set("xy", [
                      e.mapBrowserEvent.coordinate[0] - differX,
                      e.mapBrowserEvent.coordinate[1] - differY,
                    ]);
                  } else {
                    if (moveTimes <= 3) {
                      updateBeaconPosOnes();
                    } else {
                      loading.close();
                      that.$message({
                        message:
                          that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                        type: "error",
                      });

                      that.clearArranges();
                    }
                  }
                });
              }
            }
          }

          if (
            e.mapBrowserEvent.coordinate[0] - differX > that.imageWidth ||
            e.mapBrowserEvent.coordinate[0] - differX < 0 ||
            e.mapBrowserEvent.coordinate[1] - differY < 0 ||
            e.mapBrowserEvent.coordinate[1] - differY > that.imageHeight
          ) {
            // 超出地图，重新加载
            that.$message({
              message: that.$t("floormanagement.Beyondthemap"),
              type: "warning",
            });
            that.clearArranges();
            setTimeout(() => {
              loading.close();
            }, 500);
            return;
          }
          if (
            (e.features.array_[0].values_ &&
              e.features.array_[0].values_.point) ||
            (e.features.array_[0].values_.features &&
              e.features.array_[0].values_.features[0].values_ &&
              e.features.array_[0].values_.features[0].values_.point)
          ) {
            updatePoints();
          }
          if (
            (e.features.array_[0].values_ &&
              e.features.array_[0].values_.alias) ||
            (e.features.array_[0].values_.features &&
              e.features.array_[0].values_.features[0].values_ &&
              e.features.array_[0].values_.features[0].values_.alias)
          ) {
            updateBeaconPosOnes();
          }
          old = [];
          lines = [];
          oldFeature = "";
          xy = [];
          currentFeature.set("xy", [
            e.mapBrowserEvent.coordinate[0],
            e.mapBrowserEvent.coordinate[1],
          ]);
        });
        const overviewMapControl = new OverviewMap({
          layers: [
            new ImageLayer({
              source: new Static({
                url: that.imgUrl,
                projection: projection,
                imageExtent: extent,
              }),
            }),
          ],
          collapsed: false,
          view: new View({
            projection: projection,
            zoom: 1,
          }),
        });
        let minZoom, zoom, control;
        if (info.nums > 200) {
          zoom = 5;
          minZoom = 4;
        } else {
          zoom = 4;
          minZoom = 3;
        }
        if (info.reallength > 60 || info.realwidth > 60) {
          control = true;
        } else {
          control = false;
          minZoom = 1;
        }
        this.map = new Map({
          controls: control
            ? defaultControls().extend([overviewMapControl])
            : null,
          interactions: defaultInteractions().extend([that.select, translate]),
          layers: [
            new ImageLayer({
              source: new Static({
                url: that.imgUrl,
                projection: projection,
                imageExtent: extent,
              }),
            }),
          ],
          target: this.mapName,
          view: new View({
            projection: projection,
            center: getCenter(extent),
            zoom: zoom,
            maxZoom: 6,
            minZoom: minZoom,
          }),
        });
        this.mapClick();
        this.mapRightClick(that.map);
        this.addSubPolygon();
        if (this.$store.state.intoProjectType == 2) {
          //反向项目
          //获取设备位置信息,默认获取未布置的设备，不需要楼层编号groundid，放在表格里
          that.getGatewayPos(info.projectid, 1);
          //获取设备位置信息，在地图上显示，获取已布置的设备,需要楼层编号
          that.getArrangeGatewayPos(info.projectid);
        } else if (that.$store.state.intoProjectType == 1) {
          //正向项目
          //获取设备位置信息,默认获取未布置的设备，不需要楼层编号groundid，放在表格里
          that.getBeaconPos(info.projectid, 1);
          //获取设备位置信息，在地图上显示，获取已布置的设备,需要楼层编号
          that.getArrangeBeaconPos(info.projectid);
        }
      }, 0);
    },

    //单击布置
    mapClick() {
      var that = this;
      var x, y, coodinate;
      this.mapClickEvent = this.map.on("click", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            coodinate = evt.coordinate;
            return feature;
          }
        );
        if (that.selectArrangeData == null || that.selectArrangeData == "") {
          // that.$message({
          //   message: "请选择未使用的设备！",
          //   type: "warning",
          // });
        } else {
          x = evt.coordinate[0];
          y = evt.coordinate[1];
          if (x > that.imageWidth || x < 0 || y < 0 || y > that.imageHeight) {
            // 超出地图，重新加载
            that.$message({
              message: that.$t("floormanagement.deploymap"),
              type: "warning",
            });
            return;
          }
          var info;
          if (that.activeMenu != "0") {
            info = {
              x: x,
              y: y,
              xy: [x, y],
              alias: that.selectArrangeData.alias,
              deveui: that.selectArrangeData.deveui,
              major: that.selectArrangeData.major,
              minor: that.selectArrangeData.minor,
              devtype: that.selectArrangeData.devtype,
              tranche: that.selectArrangeData.tranche,
              alarmid: that.selectArrangeData.alarmid,
              alarmname: that.selectArrangeData.alarmname,
            };
            if (that.activeMenu == "5") {
              info.major = that.selectArrangeData.mode;
              info.minor = that.selectArrangeData.scheme;
            }
          } else {
            if (that.$store.state.intoProjectType == 1) {
              info = {
                x: x,
                y: y,
                xy: [x, y],
                alias: that.selectArrangeData.alias,
                deveui: that.selectArrangeData.beaconid,
                major: that.selectArrangeData.major,
                minor: that.selectArrangeData.minor,
                type: that.selectArrangeData.type,
                tranche: that.selectArrangeData.tranche,
                alarmid: that.selectArrangeData.alarmid,
                alarmname: that.selectArrangeData.alarmname,
                clockin: that.selectArrangeData.clockin,
                warning: "",
                anglimit: that.selectArrangeData.anglimit,
                nearbeacons: "",
              };
            } else if (that.$store.state.intoProjectType == 2) {
              info = {
                x: x,
                y: y,
                alias: that.selectArrangeData.alias,
                deveui: that.selectArrangeData.deveui,
                major: that.selectArrangeData.major,
                minor: that.selectArrangeData.minor,
                type: "",
                tranche: that.selectArrangeData.tranche,
                alarmid: that.selectArrangeData.alarmid,
                alarmname: that.selectArrangeData.alarmname,
                clockin: that.selectArrangeData.clockin,
                warning: that.selectArrangeData.warning,
                anglimit: that.selectArrangeData.anglimit,
                nearbeacons: "",
              };
            }
          }
          that.addIconMarker(that.map, info);
        }
        // }
      });
    },

    //在地图上加载已布置的设备
    addIconMarkers(map, info) {
      var that = this;
      let alias = info.alias;
      switch (this.showOption) {
        case 1:
          alias = info.alias;
          break;
        case 2:
          alias = info.major + "/" + info.minor;
          break;
        case 3:
          alias = parseInt(info.major, 16) + "/" + parseInt(info.minor, 16);
          break;
        default:
          break;
      }
      if (info.devtype) {
        alias = info.alias;
        var startMarker = new OlFeature({
          x: info.lastx,
          y: info.lasty,
          xy: [info.lastx, info.lasty],
          alias: info.alias,
          deveui: info.deveui,
          devtype: info.devtype,
          major: info.mode,
          minor: info.scheme,
          tranche: info.tranche || "",
          alarmid: info.alarmid || "",
          alarmname: info.alarmname || "",
          geometry: new OlGeomPoint([info.lastx, info.lasty]),
        });
      } else {
        if (this.$store.state.intoProjectType == 1) {
          //正向项目
          var startMarker = new OlFeature({
            x: info.longi,
            y: info.lati,
            xy: [info.longi, info.lati],
            alias: info.alias,
            deveui: info.beaconid,
            major: info.major,
            minor: info.minor,
            type: info.type,
            clockin: info.clockin,
            anglimit: info.anglimit,
            tranche: info.tranche || "",
            warning: "",
            nearbeacons: "",
            alarmid: info.alarmid || "",
            alarmname: info.alarmname || "",
            geometry: new OlGeomPoint([info.longi, info.lati]),
          });
        } else if (this.$store.state.intoProjectType == 2) {
          alias = info.alias;
          //反向项目
          var startMarker = new OlFeature({
            x: info.lastx,
            y: info.lasty,
            xy: [info.lastx, info.lasty],
            alias: info.alias,
            deveui: info.deveui,
            major: info.major,
            minor: info.minor,
            type: "",
            clockin: info.clockin,
            anglimit: info.anglimit,
            tranche: info.tranche || "",
            warning: info.warning,
            nearbeacons: "",
            alarmid: info.alarmid || "",
            alarmname: info.alarmname || "",
            geometry: new OlGeomPoint([info.lastx, info.lasty]),
          });
        }
      }

      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style;
      var names = info.alarmname ? "/" + info.alarmname : "";
      if (that.showOption == 4) {
        names = info.tranche ? "/" + info.tranche : "";
      }

      if (info.devtype) {
        let src;
        switch (info.devtype) {
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
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: src,
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: alias + names,
            font: "14px font-size",
            fill: new Fill({
              color: "blue",
            }),
            offsetY: 10, //文字偏移量
          }),
        });
      } else {
        if (this.$store.state.intoProjectType == 1) {
          if (info.type == 2) {
            // 告警信标用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/beacon_sos.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else if (
            (info.type == 1 && info.clockin == 1) ||
            (this.$store.state.intoProjectType == 2 && info.clockin == 1)
          ) {
            // 打卡点用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/clock.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: that.iconSrc,
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          }
        } else if (this.$store.state.intoProjectType == 2) {
          if (info.warning == 2) {
            // 告警 另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/gateway_sos.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else if (info.clockin == 1) {
            // 打卡点用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/clock.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: that.iconSrc,
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "14px font-size",
                fill: new Fill({
                  color: "blue",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          }
        }
      }
      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
        zIndex: 100,
      });
      map.addLayer(vectorLayer);
    },
    //加载已布置的相邻关系和相邻点
    addSubPolygon() {
      let that = this;
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
          if (that.isShowLines == false) return;
          let pointList = res.data;
          let style = new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 0.5],
              src: "../../../static/near.png",
              scale: 0.3,
            }),
          });
          //扁平化数组 变成线的数组
          let list = [];
          pointList.forEach((item) => {
            // 判断是否为连接点
            if (!isNaN(Number(item.pointid)) && item.pointid.length != 8) {
              var startMarker = new OlFeature({
                id: item.pointid,
                geometry: new OlGeomPoint([item.nodeX, item.nodeY]),
                point: true,
                xy: [item.nodeX, item.nodeY],
              });
              var source = new OlSourceVector({
                features: [startMarker],
              });
              let adjPoint = new OlLayerVector({
                source: source,
                style: style,
                zIndex: 10000,
              });

              this.map.addLayer(adjPoint);
              // this.modifyFeature(this.map, adjPoint.getSource(), adjPoint);
            }

            if (item.list.length !== 0) {
              item.list.forEach((item1) => {
                list.push([item1, item]);
              });
            }
          });
          if (!that.isShowLines) return;
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
          let lines = [];
          //遍历线数组添加线
          arr.forEach((element, index) => {
            let p = [element[0].nodeX, element[0].nodeY];
            let p1 = [element[1].nodeX, element[1].nodeY];
            var line = new LineString([p, p1]);
            let feature = new OlFeature({
              geometry: line,
              name: "Line",
              perid: element[0].pointid,
              subid: element[1].pointid,
              per: [element[0].nodeX, element[0].nodeY],
              sub: [element[1].nodeX, element[1].nodeY],
            });
            lines.push(feature);
            let sourceVec = new VectorSource({
              features: [feature],
            });
            var vectorLayer = new VectorLayer({
              source: sourceVec,
              style: new Style({
                stroke: new Stroke({
                  width: 2,
                  color: "#ccc",
                }),
              }),
            });
            this.map.addLayer(vectorLayer);
          });
        }
      });
    },
    //添加图标
    addIconMarker(map, info) {
      var that = this;
      if (info.alias == undefined || info.deveui == undefined) {
        that.$message({
          message: that.$t("floormanagement.unuseddevice"),
          type: "warning",
        });
      } else {
        let alias = info.alias;
        var names = info.alarmname ? "/" + info.alarmname : "";
        if (that.showOption == 4) {
          names = info.tranche ? "/" + info.tranche : "";
        }
        switch (that.showOption) {
          case 1:
            alias = info.alias;
            break;
          case 2:
            alias = info.major + "/" + info.minor;
            break;
          case 3:
            alias = parseInt(info.major, 16) + "/" + parseInt(info.minor, 16);
            break;
          default:
            break;
        }
        if (info.devtype) {
          alias = info.alias;
        }
        var startMarker = new OlFeature({
          xy: [info.x, info.y],
          x: info.x,
          y: info.y,
          alias: info.alias,
          deveui: info.deveui,
          major: info.major,
          minor: info.minor,
          anglimit: info.anglimit,
          type: info.type || "",
          devtype: info.devtype || "",
          clockin: info.clockin || "",
          tranche: info.tranche || "",

          alarmid: info.alarmid || "",
          alarmname: info.alarmname || "",
          warning: info.warning || "",
          nearbeacons: "",
          geometry: new OlGeomPoint([info.x, info.y]),
        });
        var source = new OlSourceVector({
          features: [startMarker],
        });
        var style;
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
          style = new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 1],
              src: src,
              scale: 1,
            }),
            //设置图片下面显示的字体样式和内容
            text: new Text({
              text: alias,
              font: "12px font-size",
              fill: new Fill({
                color: "red",
              }),
              offsetY: 10, //文字偏移量
            }),
          });
        } else {
          if (info.type == 2) {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/beacon_sos.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "12px font-size",
                fill: new Fill({
                  color: "red",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else {
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: that.iconSrc,
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: alias + names,
                font: "12px font-size",
                fill: new Fill({
                  color: "red",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          }
        }

        var vectorLayer = new OlLayerVector({
          source: source,
          style: style,
          zIndex: 100,
        });
        map.addLayer(vectorLayer);
        // this.modifyFeature(map, vectorLayer.getSource(), vectorLayer);
        let data = {
          projectid: that.intoProjectid,
          groundid: that.groundid,
          deveui: info.deveui,
          longi: info.x,
          lati: info.y,
          falg: true,
        };
        if (that.activeMenu != "0") {
          let otherData = {
            projectid: that.intoProjectid,
            groundid: that.groundid,
            deveui: info.deveui,
            devtype: that.activeMenu,
            longi: info.x,
            lati: info.y,
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
              if (that.arrangeData.length == 0 && that.currentPage2 > 1) {
                that.menuClick(that.activeMenu, that.currentPage2 - 1);
              }
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
                if (that.arrangeData.length == 0 && that.currentPage2 > 1) {
                  that.getBeaconPos(that.intoProjectid, that.currentPage2 - 1);
                }
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
                if (that.arrangeData.length == 0 && that.currentPage2 > 1) {
                  that.getGatewayPos(that.intoProjectid, that.currentPage2 - 1);
                }

                //移动完成重新设置该点xy信息
                // startMarker.set("xy", [
                //   e.mapBrowserEvent.coordinate[0],
                //   e.mapBrowserEvent.coordinate[1]
                // ]);
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          }
        }

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
      }
    },

    //拖拽
    modifyFeature(map, source, layer) {
      var that = this;
      let layerList = [];
      let arr = that.map.getLayers().getArray();
      arr.forEach((item, index) => {
        if (item.values_.wrapX == false) {
          arr.splice(index, 1);
        }
      });
      arr.forEach((item, index) => {
        if (
          item.getSource().getFeatures &&
          !item.getSource().getFeatures()[0].values_.name
        ) {
          layerList.push(item);
        }
      });

      var translate1 = new Translate({
        layers: layerList,
        source: source,
      });

      // this.featureModify = new Modify({
      //   layers: layerList,
      //   source: source,
      // });
      map.addInteraction(translate1);
      let old = "";
      let oldFeature = "";
      //选中点相关线集合
      let lines = [];
      //选中点相关线的坐标集合
      let xy = [];
      let currentFeature = "";
      let differX = 0,
        differY = 0;

      //开始移动
      translate1.on("translatestart", (e) => {
        let list = that.map.getLayers().getArray();
        //获取选中的点信息 用于判断线的移动端点
        let feature = e.features.array_[0].values_;
        if (feature.xy) {
          differX = e.coordinate[0] - feature.xy[0];
          differY = e.coordinate[1] - feature.xy[1];
        }
        currentFeature = e.features.array_[0];
        oldFeature = feature;
        let LayerArrays = [];
        //获选中点相关的线集合
        list.forEach((item) => {
          if (
            !item.getSource().image_ &&
            item.getSource().getFeatures()[0].values_
          ) {
            if (feature.id) {
              if (
                item.getSource().getFeatures()[0].values_.perid ===
                  feature.id ||
                item.getSource().getFeatures()[0].values_.subid === feature.id
              ) {
                LayerArrays.push(item);
              }
            }
            if (feature.deveui) {
              if (
                item.getSource().getFeatures()[0].values_.perid ===
                  feature.deveui ||
                item.getSource().getFeatures()[0].values_.subid ===
                  feature.deveui
              ) {
                LayerArrays.push(item);
              }
            }
          }
        });
        old = e.mapBrowserEvent.coordinate[0];
        lines = LayerArrays;
        //获取线的坐标集合
        lines.forEach((item, index) => {
          const flatCoordinates = item
            .getSource()
            .getFeatures()[0]
            .getGeometry().flatCoordinates;
          //为了判断端点移动 线需要移动的端点坐标设为0
          if (
            flatCoordinates[0] === oldFeature.xy[0] &&
            flatCoordinates[1] === oldFeature.xy[1]
          ) {
            xy.push([0, 0, flatCoordinates[2], flatCoordinates[3]]);
          }
          if (
            flatCoordinates[2] === oldFeature.xy[0] &&
            flatCoordinates[3] === oldFeature.xy[1]
          ) {
            xy.push([flatCoordinates[0], flatCoordinates[1], 0, 0]);
          }
        });
      });
      //移动中
      translate1.on("translating", function (e) {
        //遍历该点的相关线
        lines.forEach((item, index) => {
          //移动线，端点坐标为0的就设置为移动中的坐标
          item
            .getSource()
            .getFeatures()[0]
            .getGeometry()
            .setCoordinates([
              [
                xy[index][0] == 0
                  ? e.mapBrowserEvent.coordinate[0] - differX
                  : xy[index][0],
                xy[index][1] == 0
                  ? e.mapBrowserEvent.coordinate[1] - differY
                  : xy[index][1],
              ],
              [
                xy[index][2] == 0
                  ? e.mapBrowserEvent.coordinate[0] - differX
                  : xy[index][2],
                xy[index][3] == 0
                  ? e.mapBrowserEvent.coordinate[1] - differY
                  : xy[index][3],
              ],
            ]);
        });
      });

      //移动结束
      translate1.on("translateend", function (e) {
        // if (window.event.ctrlKey) return;
        //没有移动点就不执行
        if (old === e.mapBrowserEvent.coordinate[0]) {
          old = "";
          lines = [];
          oldFeature = "";
          xy = [];
          return;
        }
        const loading = that.$loading({
          lock: true,
          text: "loading",
          spinner: "el-icon-loading",
          background: "rgba(256, 256, 256, 0.7)",
        });
        let moveTimes = 0;
        function updatePoints() {
          moveTimes += 1;
          let clearMarker = true;
          let data = {
            groundid: that.groundid,
            pointid:
              e.features.array_[0].values_.id ||
              e.features.array_[0].values_.features[0].values_.id,
            nodeX: e.mapBrowserEvent.coordinate[0] - differX,
            nodeY: e.mapBrowserEvent.coordinate[1] - differY,
          };
          // return;
          setTimeout(() => {
            if (clearMarker) {
              that.$message({
                message: that.$t("floormanagement.Requesttimedout"),
                type: "warning",
              });
              that.clearArranges();
              loading.close();
            }
          }, 5000);
          updatePoint(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              clearMarker = false;
              moveTimes = 0;
              that.$message({
                message: that.$t("Building.Layoutsuccessful"),
                type: "success",
              });
              //移动完成重新设置该点xy信息
              currentFeature.set("xy", [
                e.mapBrowserEvent.coordinate[0] - differX,
                e.mapBrowserEvent.coordinate[1] - differY,
              ]);
              setTimeout(() => {
                loading.close();
              }, 500);
            } else {
              if (moveTimes <= 3) {
                updatePoints();
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
                that.clearArranges();
                loading.close();
              }
            }
          });
        }
        function updateBeaconPosOnes() {
          let clearMarker = true;
          moveTimes += 1;
          let data = {
            projectid: that.intoProjectid,
            groundid: that.groundid,
            deveui:
              e.features.array_[0].values_.deveui ||
              e.features.array_[0].values_.features[0].values_.deveui,
            longi: e.mapBrowserEvent.coordinate[0] - differX,
            lati: e.mapBrowserEvent.coordinate[1] - differY,
            falg: true,
          };
          setTimeout(() => {
            if (clearMarker) {
              that.$message({
                message: that.$t("floormanagement.Requesttimedout"),
                type: "warning",
              });
              that.clearArranges();

              loading.close();
            }
          }, 5000);

          if (e.features.array_[0].values_.devtype) {
            data.devtype = e.features.array_[0].values_.devtype;
            updateDevOtherPosOne(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                clearMarker = false;
                setTimeout(() => {
                  loading.close();
                }, 500);
                moveTimes = 0;
                that.$message({
                  message: that.$t("Building.Layoutsuccessful"),
                  type: "success",
                });
                //移动完成重新设置该点xy信息
                currentFeature.set("xy", [
                  e.mapBrowserEvent.coordinate[0] - differX,
                  e.mapBrowserEvent.coordinate[1] - differY,
                ]);
              } else {
                if (moveTimes <= 3) {
                  updateBeaconPosOnes();
                } else {
                  loading.close();
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });

                  that.clearArranges();
                }
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
                  clearMarker = false;
                  setTimeout(() => {
                    loading.close();
                  }, 500);
                  moveTimes = 0;
                  that.$message({
                    message: that.$t("Building.Layoutsuccessful"),
                    type: "success",
                  });
                  //移动完成重新设置该点xy信息
                  currentFeature.set("xy", [
                    e.mapBrowserEvent.coordinate[0] - differX,
                    e.mapBrowserEvent.coordinate[1] - differY,
                  ]);
                } else {
                  if (moveTimes <= 3) {
                    updateBeaconPosOnes();
                  } else {
                    loading.close();
                    that.$message({
                      message:
                        that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                      type: "error",
                    });

                    that.clearArranges();
                  }
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
                  clearMarker = false;
                  setTimeout(() => {
                    loading.close();
                  }, 500);
                  moveTimes = 0;
                  that.$message({
                    message: that.$t("Building.Layoutsuccessful"),
                    type: "success",
                  });
                  //移动完成重新设置该点xy信息
                  currentFeature.set("xy", [
                    e.mapBrowserEvent.coordinate[0] - differX,
                    e.mapBrowserEvent.coordinate[1] - differY,
                  ]);
                } else {
                  if (moveTimes <= 3) {
                    updateBeaconPosOnes();
                  } else {
                    loading.close();
                    that.$message({
                      message:
                        that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                      type: "error",
                    });

                    that.clearArranges();
                  }
                }
              });
            }
          }
        }

        if (
          e.mapBrowserEvent.coordinate[0] - differX > that.imageWidth ||
          e.mapBrowserEvent.coordinate[0] - differX < 0 ||
          e.mapBrowserEvent.coordinate[1] - differY < 0 ||
          e.mapBrowserEvent.coordinate[1] - differY > that.imageHeight
        ) {
          // 超出地图，重新加载
          that.$message({
            message: that.$t("floormanagement.Beyondthemap"),
            type: "warning",
          });
          that.clearArranges();
          setTimeout(() => {
            loading.close();
          }, 500);
          return;
        }
        if (
          (e.features.array_[0].values_ &&
            e.features.array_[0].values_.point) ||
          (e.features.array_[0].values_.features &&
            e.features.array_[0].values_.features[0].values_ &&
            e.features.array_[0].values_.features[0].values_.point)
        ) {
          updatePoints();
        }
        if (
          (e.features.array_[0].values_ &&
            e.features.array_[0].values_.alias) ||
          (e.features.array_[0].values_.features &&
            e.features.array_[0].values_.features[0].values_ &&
            e.features.array_[0].values_.features[0].values_.alias)
        ) {
          updateBeaconPosOnes();
        }
        old = "";
        lines = [];
        oldFeature = "";
        xy = [];
        currentFeature.set("xy", [
          e.mapBrowserEvent.coordinate[0],
          e.mapBrowserEvent.coordinate[1],
        ]);
      });
    },
    delNear(feature, menu_overlay1) {
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
      this.removeClick();
      delPointNearByPointid(
        {
          groundid: that.groundid,
          pointid: feature.values_.id,
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
          let list = that.map.getLayers().getArray();
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item.getSource().image_) {
              that.map.removeLayer(item);
              i--;
            }
          }
          that.addSubPolygon();
          that.getArrangeBeaconPos(that.intoProjectid);
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        menu_overlay1.setPosition(undefined);
      });
    },
    showLines() {
      var that = this;
      if (this.isShowLines) {
        that.isShowLines = !that.isShowLines;
        let arr = that.map.getLayers().getArray();
        for (let i = 0; i < arr.length; i++) {
          let source = arr[i].getSource();
          // name删除线，id删除点
          if (
            source.getFeatures &&
            (source.getFeatures()[0].values_.name ||
              source.getFeatures()[0].values_.id)
          ) {
            that.map.removeLayer(arr[i]);
            i--;
          }
        }
      } else {
        that.isShowLines = !that.isShowLines;
        let arr = that.map.getLayers().getArray();
        for (let i = 0; i < arr.length; i++) {
          let source = arr[i].getSource();
          if (source.getFeatures && source.getFeatures()[0].values_.id) {
            that.map.removeLayer(arr[i]);
            i--;
          }
        }
        that.addSubPolygon();
      }
    },

    //右键菜单
    mapRightClick(map) {
      var that = this;
      var menu_overlay = new Overlay({
        element: this.$refs.contextmenu_container,
        positioning: "center-center",
      });
      var menu_overlay1 = new Overlay({
        element: this.$refs.polygonMenu,
        positioning: "center-center",
      });
      map.addOverlay(menu_overlay);
      map.addOverlay(menu_overlay1);
      $(map.getViewport()).on("contextmenu", function (event) {
        event.preventDefault();
        // 书写事件触发后的函数
        var pixel = map.getEventPixel(event.originalEvent);
        var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });
        if (feature) {
          var coordinate = map.getEventCoordinate(event.originalEvent);
          //右键非信标
          if (feature.values_.point) {
            // if (that.currentAdj && that.currentAdj.values_.point) {
            menu_overlay1.setPosition(coordinate);
            $("#polygonMenu-closer").on("click", function (event) {
              //移除之前添加的事件 防止多次添加
              that.removeClick();
              event.preventDefault();
              menu_overlay1.setPosition(undefined);
            }); // 点击关闭的按钮
            $("#delPolygon").click(function () {
              that.delPolygon(feature, menu_overlay1);
              // menu_overlay1.setPosition(undefined);
            }); //点击删除
            $("#editNear").click(function () {
              that.delNear(feature, menu_overlay1);
              // menu_overlay1.setPosition(undefined);
            }); //点击删除
          }
          if (feature.values_.x && feature.values_.alias) {
            if (
              (feature.values_.type == 1 && feature.values_.clockin == 2) ||
              (feature.values_.warning == 1 && feature.values_.clockin == 2)
            ) {
              that.clock = true;
              that.caecelClock = false;
            } else if (
              (feature.values_.type == 1 && feature.values_.clockin == 1) ||
              (feature.values_.warning == 1 && feature.values_.clockin == 1)
            ) {
              that.caecelClock = true;
              that.clock = false;
            } else {
              that.caecelClock = false;
              that.clock = false;
            }

            if (
              (feature.values_.tranche == "" ||
                feature.values_.tranche == null) &&
              !feature.values_.devtype
            ) {
              that.show1 = true;
              that.showBeacon = false;
            } else {
              that.show1 = false;
              that.showBeacon = true;
            }
            if (feature.values_.devtype) {
              that.showOther = true;
            } else {
              that.showOther = false;
            }
            that.pointLists.forEach((item) => {
              if (item.pointid == feature.values_.deveui) {
                if (item.list.length > 0) {
                  that.clearBeaconList = true;
                } else {
                  that.clearBeaconList = false;
                }
              }
            });

            menu_overlay.setPosition(coordinate);
            $("#popup-closer").on("click", function (event) {
              that.removeClick();
              event.preventDefault();
              menu_overlay.setPosition(undefined);
            }); // 点击关闭的按钮
            $("#del").click(function () {
              that.delFeature(feature, menu_overlay);
            }); //点击删除

            $("#calculatingDistance").click(function () {
              that.calculatingDistance(feature, menu_overlay);
            }); //点击计算距离
            $("#edit").click(function () {
              that.editFeature(feature, menu_overlay);
            }); //点击编辑
            // $("#cancelNear").click(function () {
            //   that.cancelNear(feature, menu_overlay);
            // }); //点击删除相邻信标
            $("#cancelNearList").click(function () {
              that.cancelNearList(feature, menu_overlay);
            }); //点击删除相邻信标
            $("#setClock").click(function () {
              that.setClock(feature, menu_overlay);
            }); //点击设为打卡点
            $("#cancelClock").click(function () {
              that.cancelClock(feature, menu_overlay);
            }); //取消打卡点
            $("#setTranche").click(function () {
              that.updateTranche(feature, menu_overlay);
            }); //点击设置区域

            // $("#removeTranche").click(function () {
            //   that.removeTranche(feature, menu_overlay);
            // });//解除区域
            // 设置相邻信标
            $("#setAdjoinBeacon").click(function () {
              that.setAdjoinBeacon(feature, menu_overlay);
            });

            // 设置信标扫描的范围
            $("#setArea").click(function () {
              that.setArea(feature, menu_overlay);
            });
          }
        }
      });
    },
    removeClick() {
      console.log(111);
      $("#edit").unbind("click");
      $("#del").unbind("click");
      $("#setClock").unbind("click");
      $("#setArea").unbind("setArea");
      $("#cancelClock").unbind("click");
      $("#cancelNearList").unbind("click");
      $("#setTranche").unbind("click");
      $("#setAdjoinBeacon").unbind("click");
      $("#editNear").unbind("click");
      $("#calculatingDistance").off("calculatingDistance");
    },
    updateTrancheCancel() {
      this.trancheShow = false;
      this.menu_overlay.setPosition(undefined);
    },
    closeTranche() {
      this.updateTrancheCancel();
      this.removeClick();
    },
    //绑定区域
    updateTrancheTrue(TrancheDatas) {
      let e = this.temE;
      var that = this;
      this.loading = true;
      let alias = e.values_.alias;
      switch (that.showOption) {
        case 1:
          alias = e.values_.alias;
          break;
        case 2:
          alias = e.values_.major + "/" + e.values_.minor;
          break;
        case 3:
          alias =
            parseInt(e.values_.major, 16) + "/" + parseInt(e.values_.minor, 16);
          break;
        default:
          break;
      }
      if (that.TrancheDatas.devtype) {
        let data = {
          tranche: that.TrancheDatas.tranche,
          alarmid: that.TrancheDatas.alarmid,
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
            e.values_.tranche = that.TrancheDatas.tranche;
            e.values_.alarmid = that.TrancheDatas.alarmid;
            var found = "";
            var foundAlarm = "";
            if (e.values_.tranche) {
              found = that.setTrancheList.find(function (item) {
                return item.name == that.TrancheDatas.tranche;
              });
              if (found) {
                e.values_.tranche = found.name;
              }
            }
            if (e.values_.alarmid) {
              foundAlarm = that.setAlarmTrancheList.find(function (item) {
                return item.id == that.TrancheDatas.alarmid;
              });
              if (foundAlarm) {
                e.values_.alarmname = foundAlarm.name;
              }
            }

            var names = foundAlarm.name ? "/" + foundAlarm.name : "";
            if (that.showOption == 4) {
              names = found.name ? "/" + found.name : "";
            }
            e.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: src,
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: alias + names, // 添加文字描述
                  font: "12px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "blue",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );
            that.$message({
              message: that.$t("beacon.assinsuccess"),
              type: "success",
            });
            that.loading = false;
            that.menu_overlay.setPosition(undefined);
          }
          that.trancheShow = false;
        });
      } else {
        let trancheDatas1 = {
          groundid: that.groundid,
          tranche: that.TrancheDatas.tranche,
          alarmid: that.TrancheDatas.alarmid,
          deveui: that.TrancheDatas.beaconids,
        };
        if (that.$store.state.intoProjectType == 1) {
          updateBeaconTranche(
            trancheDatas1,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              e.values_.tranche = that.TrancheDatas.tranche;
              e.values_.alarmid = that.TrancheDatas.alarmid;
              var found = "";
              var foundAlarm = "";
              if (e.values_.tranche) {
                found = that.setTrancheList.find(function (item) {
                  return item.name == that.TrancheDatas.tranche;
                });
                if (found) {
                  e.values_.tranche = found.name;
                }
              }
              if (e.values_.alarmid) {
                foundAlarm = that.setAlarmTrancheList.find(function (item) {
                  return item.id == that.TrancheDatas.alarmid;
                });
                if (foundAlarm) {
                  e.values_.alarmname = foundAlarm.name;
                }
              }
              var names = foundAlarm.name ? "/" + foundAlarm.name : "";
              if (that.showOption == 4) {
                names = found.name ? "/" + found.name : "";
              }

              if (that.intoProjectType == 1) {
                e.setStyle(
                  new OlStyleStyle({
                    image: new OlStyleIcon({
                      anchor: [0.5, 1],
                      src:
                        e.values_.clockin == 1
                          ? "../../../static/clock.png"
                          : e.values_.type == 1
                          ? "../../../static/beacon.png"
                          : "../../../static/sos.png",
                      scale: 1,
                    }),
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text: alias + names, // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      fill: new Fill({
                        // 设置字体颜色
                        color: "blue",
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  })
                );
              } else if (that.intoProjectType == 2) {
                alias = e.values_.alias;
                e.setStyle(
                  new OlStyleStyle({
                    image: new OlStyleIcon({
                      anchor: [0.5, 1],
                      src:
                        e.values_.clockin == 1
                          ? "../../../static/clock.png"
                          : e.values_.warning == 2
                          ? "../../../static/gateway_sos.png"
                          : "../../../static/gateway.png",
                      scale: 1,
                    }),
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text: alias + names, // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      fill: new Fill({
                        // 设置字体颜色
                        color: "blue",
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  })
                );
              }

              that.$message({
                message: that.$t("beacon.assinsuccess"),
                type: "success",
              });
              that.loading = false;
              that.menu_overlay.setPosition(undefined);
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }

            that.trancheShow = false;
          });
        }
        if (that.$store.state.intoProjectType == 2) {
          alias = e.values_.alias;
          updateDevListTranche(
            trancheDatas1,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              e.values_.tranche = that.TrancheDatas.tranche;
              e.values_.alarmid = that.TrancheDatas.alarmid;
              var found = "";
              var foundAlarm = "";
              if (e.values_.tranche) {
                found = that.setTrancheList.find(function (item) {
                  return item.name == that.TrancheDatas.tranche;
                });
                if (found) {
                  e.values_.tranche = found.name;
                }
              }
              if (e.values_.alarmid) {
                foundAlarm = that.setAlarmTrancheList.find(function (item) {
                  return item.id == that.TrancheDatas.alarmid;
                });
                if (foundAlarm) {
                  e.values_.alarmname = foundAlarm.name;
                }
              }
              var names = foundAlarm.name ? "/" + foundAlarm.name : "";
              if (that.showOption == 4) {
                names = found.name ? "/" + found.name : "";
              }
              e.setStyle(
                new OlStyleStyle({
                  image: new OlStyleIcon({
                    anchor: [0.5, 1],
                    src:
                      e.values_.clockin == 1
                        ? "../../../static/clock.png"
                        : "../../../static/beacon.png",
                    scale: 1,
                  }),
                  // 设置图片下面显示字体的样式和内容
                  text: new Text({
                    text: alias + names, // 添加文字描述
                    font: "12px font-size", // 设置字体大小
                    fill: new Fill({
                      // 设置字体颜色
                      color: "blue",
                    }),
                    offsetY: 10, // 设置文字偏移量
                  }),
                })
              );
              that.$message({
                message: that.$t("beacon.assinsuccess"),
                type: "success",
              });
              that.loading = false;
              that.menu_overlay.setPosition(undefined);
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }

            that.trancheShow = false;
          });
        }
      }
    },
    //解绑区域
    removeTranche(e, menu_overlay) {
      this.removeClick();
      this.menu_overlay = menu_overlay;
      let that = this;
      this.$confirm(
        that.$t("floormanagement.releasezone"),
        that.$t("Building.tips"),
        {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let alias;
          switch (that.showOption) {
            case 1:
              alias = e.values_.alias;
              break;
            case 2:
              alias = e.values_.major + "/" + e.values_.minor;
              break;
            case 3:
              alias =
                parseInt(e.values_.major, 16) +
                "/" +
                parseInt(e.values_.minor, 16);
              break;
            default:
              break;
          }
          if (e.values_.devtype) {
            let data = {
              deveui: e.values_.deveui,
              tranchid: "",
              alarmid: "",
            };
            updateDevOtherTranche(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                let src;
                switch (e.values_.devtype) {
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
                e.values_.tranche = "";
                e.values_.tranchid = "";
                e.values_.alarmid = "";
                e.values_.alarmname = "";
                e.setStyle(
                  new OlStyleStyle({
                    image: new OlStyleIcon({
                      anchor: [0.5, 1],
                      src: src,
                      scale: 1,
                    }),
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text: alias, // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      fill: new Fill({
                        // 设置字体颜色
                        color: "blue",
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  })
                );
                that.$message({
                  message: that.$t("floormanagement.Releasesucceeded"),
                  type: "success",
                });
                that.loading = false;

                that.menu_overlay.setPosition(undefined);
              }
            });
          } else {
            let trancheDatas1 = {
              deveui: e.values_.deveui,
              tranchid: "",
            };
            if (that.$store.state.intoProjectType == 1) {
              updateBeaconTranche(
                trancheDatas1,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  e.values_.tranche = "";
                  e.values_.tranchid = "";
                  e.setStyle(
                    new OlStyleStyle({
                      image: new OlStyleIcon({
                        anchor: [0.5, 1],
                        src:
                          e.values_.clockin == 1
                            ? "../../../static/clock.png"
                            : e.values_.type == 1
                            ? "../../../static/beacon.png"
                            : "../../../static/sos.png",
                        scale: 1,
                      }),
                      // 设置图片下面显示字体的样式和内容
                      text: new Text({
                        text: alias, // 添加文字描述
                        font: "12px font-size", // 设置字体大小
                        fill: new Fill({
                          // 设置字体颜色
                          color: "blue",
                        }),
                        offsetY: 10, // 设置文字偏移量
                      }),
                    })
                  );
                  that.$message({
                    message: that.$t("floormanagement.Releasesucceeded"),
                    type: "success",
                  });
                  that.loading = false;

                  that.menu_overlay.setPosition(undefined);
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  that.loading = false;
                }
              });
            }
            if (this.$store.state.intoProjectType == 2) {
              updateDevListTranche(
                trancheDatas1,
                this.tenantkey_A,
                this.tenantid_A,
                this.userName
              ).then((res) => {
                if (res.code == 1001) {
                  e.values_.tranche = "";
                  e.values_.tranchid = "";
                  e.setStyle(
                    new OlStyleStyle({
                      image: new OlStyleIcon({
                        anchor: [0.5, 1],
                        src:
                          e.values_.clockin == 1
                            ? "../../../static/clock.png"
                            : "../../../static/beacon.png",
                        scale: 1,
                      }),
                      // 设置图片下面显示字体的样式和内容
                      text: new Text({
                        text: alias, // 添加文字描述
                        font: "12px font-size", // 设置字体大小
                        fill: new Fill({
                          // 设置字体颜色
                          color: "blue",
                        }),
                        offsetY: 10, // 设置文字偏移量
                      }),
                    })
                  );
                  that.$message({
                    message: that.$t("floormanagement.Releasesucceeded"),
                    type: "success",
                  });
                  that.loading = false;

                  that.menu_overlay.setPosition(undefined);
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  that.loading = false;
                }
              });
            }
          }
        })
        .catch(() => {
          this.menu_overlay.setPosition(undefined);
          this.removeClick();
        });
    },

    // 布置右键设置区域
    updateTranche(e, menu_overlay) {
      this.removeClick();
      this.menu_overlay = menu_overlay;
      let that = this;
      this.setTrancheList = [];
      this.setAlarmTrancheList = [];
      if (e.values_.tranche) {
        this.TrancheDatas.tranche = e.values_.tranche;
      } else {
        this.TrancheDatas.tranche = "";
      }
      if (e.values_.alarmid) {
        this.TrancheDatas.alarmid = e.values_.alarmid;
      } else {
        this.TrancheDatas.alarmid = "";
      }
      this.TrancheDatas.alias = e.values_.alias;
      this.temE = e;
      this.TrancheDatas.beaconids = e.values_.deveui;
      this.TrancheDatas.devtype = e.values_.devtype;
      let dataPosition = {
        site: true,
        groundid: this.groundid,
        projectid:
          this.contrForPrionum == 5
            ? this.$store.state.projectid
            : this.$store.state.intoProjectid,
      };
      let dataAlarm = {
        site: false,
        groundid: this.groundid,
        projectid:
          this.contrForPrionum == 5
            ? this.$store.state.projectid
            : this.$store.state.intoProjectid,
      };
      getTranche(
        dataPosition,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.setTrancheList = res.data;
          that.trancheShow = true;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
      getTranche(
        dataAlarm,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.setAlarmTrancheList = res.data;
          that.trancheShow = true;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 设置打卡点
    setClock(e, menu_overlay) {
      this.removeClick();
      this.menu_overlay = menu_overlay;
      var that = this;
      this.$confirm(
        that.$t("floormanagement.tippp"),
        that.$t("Building.tips"),
        {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let data = {
            deveui: e.values_.deveui,
            clockin: 1,
          };
          let alias = e.values_.alias;
          var names = e.values_.alarmname ? "/" + e.values_.alarmname : "";
          if (that.showOption == 4) {
            names = e.values_.tranche ? "/" + e.values_.tranche : "";
          }
          switch (that.showOption) {
            case 1:
              alias = e.values_.alias;
              break;
            case 2:
              alias = e.values_.major + "/" + e.values_.minor;
              break;
            case 3:
              alias =
                parseInt(e.values_.major, 16) +
                "/" +
                parseInt(e.values_.minor, 16);
              break;
            default:
              break;
          }
          if (this.$store.state.intoProjectType == 1) {
            updateClockin(
              data,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                e.values_.clockin = 1;

                e.setStyle(
                  new OlStyleStyle({
                    image: new OlStyleIcon({
                      anchor: [0.5, 1],
                      src: "../../../static/clock.png",
                      scale: 1,
                    }),
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text: alias + names, // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      fill: new Fill({
                        // 设置字体颜色
                        color: "blue",
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  })
                );
                that.$message({
                  message: that.$t("floormanagement.tippp1"),
                  type: "success",
                });
                that.menu_overlay.setPosition(undefined);
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          }
          if (this.$store.state.intoProjectType == 2) {
            updateDevListToGwClockin(
              data,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                e.values_.clockin = 1;
                e.setStyle(
                  new OlStyleStyle({
                    image: new OlStyleIcon({
                      anchor: [0.5, 1],
                      src: "../../../static/clock.png",
                      scale: 1,
                    }),
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text: alias + names, // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      fill: new Fill({
                        // 设置字体颜色
                        color: "blue",
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  })
                );
                that.$message({
                  message: that.$t("floormanagement.tippp1"),
                  type: "success",
                });
                that.menu_overlay.setPosition(undefined);
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          }
        })
        .catch(() => {
          this.menu_overlay.setPosition(undefined);
          this.removeClick();
        });
    },

    cancelNearList(feature, menu_overlay) {
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
      that.removeClick();
      that.menu_overlay = menu_overlay;
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
              pointid: feature.values_.deveui,
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
              let list = that.map.getLayers().getArray();
              for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (!item.getSource().image_) {
                  that.map.removeLayer(item);
                  i--;
                }
              }
              that.addSubPolygon();
              that.getArrangeBeaconPos(that.intoProjectid);
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
            menu_overlay.setPosition(undefined);
          });
        })
        .catch(() => {
          this.menu_overlay.setPosition(undefined);
          this.removeClick();
        });
    },
    cancelClock(e, menu_overlay) {
      this.removeClick();
      this.menu_overlay = menu_overlay;
      var that = this;
      that
        .$confirm(that.$t("floormanagement.tippp2"), that.$t("Building.tips"), {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        })
        .then(() => {
          let data = {
            deveui: e.values_.deveui,
            clockin: 2,
          };
          let alias = e.values_.alias;
          var names = e.values_.alarmname ? "/" + e.values_.alarmname : "";
          if (that.showOption == 4) {
            names = e.values_.tranche ? "/" + e.values_.tranche : "";
          }
          switch (that.showOption) {
            case 1:
              alias = e.values_.alias;
              break;
            case 2:
              alias = e.values_.major + "/" + e.values_.minor;
              break;
            case 3:
              alias =
                parseInt(e.values_.major, 16) +
                "/" +
                parseInt(e.values_.minor, 16);
              break;
            default:
              break;
          }
          if (this.$store.state.intoProjectType == 1) {
            updateClockin(
              data,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                e.values_.clockin = 2;

                e.setStyle(
                  new OlStyleStyle({
                    image: new OlStyleIcon({
                      anchor: [0.5, 1],
                      src: "../../../static//beacon.png",
                      scale: 1,
                    }),
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text: alias + names, // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      fill: new Fill({
                        // 设置字体颜色
                        color: "blue",
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  })
                );

                that.$message({
                  message: that.$t("floormanagement.tippp3"),
                  type: "success",
                });
                that.menu_overlay.setPosition(undefined);
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          }
          if (this.$store.state.intoProjectType == 2) {
            updateDevListToGwClockin(
              data,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                e.values_.clockin = 2;
                e.setStyle(
                  new OlStyleStyle({
                    image: new OlStyleIcon({
                      anchor: [0.5, 1],
                      src: "../../../static/gateway.png",
                      scale: 1,
                    }),
                    // 设置图片下面显示字体的样式和内容
                    text: new Text({
                      text: alias + names, // 添加文字描述
                      font: "12px font-size", // 设置字体大小
                      fill: new Fill({
                        // 设置字体颜色
                        color: "blue",
                      }),
                      offsetY: 10, // 设置文字偏移量
                    }),
                  })
                );
                that.$message({
                  message: that.$t("floormanagement.tippp3"),
                  type: "success",
                });
                that.menu_overlay.setPosition(undefined);
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          }
        })
        .catch(() => {
          this.menu_overlay.setPosition(undefined);
          this.removeClick();
        });
    },
    // 设置信标扫描的范围
    setArea(e, menu_overlay) {
      this.removeClick();
      this.menu_overlay = menu_overlay;
      this.radio = e.values_.anglimit;
      this.oldRadio = e.values_.anglimit;
      this.setAreaDeveui = e.values_.deveui;
      this.areaInfo = e;
      this.setAreas = true;
    },
    setAreaCancel() {
      this.setAreas = false;
      this.menu_overlay.setPosition(undefined);
      this.removeClick();
    },
    setAreaTrue() {
      var that = this;
      if (this.radio == this.oldRadio) {
        that.setAreas = false;
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
            that.areaInfo.values_.anglimit = that.radio;
            that.$message({
              message: that.$t("staffmanagement.Setsuccessfully"),
              type: "success",
            });
            that.setAreas = false;
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
            that.setAreas = false;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },

    //设置相邻信标
    setAdjoinBeacon(e, menu_overlay) {
      this.removeClick();
      var that = this;
      this.adjoinBeaconInfo = e;
      this.menu_overlay = menu_overlay;
      let data = {
        deveui: e.values_.deveui,
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
          that.adjoinBeaconInfo.values_.nearbeacons =
            res.data.list[0].nearbeacons;
          that.adjoinBeaconShow = true;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    openAdjoinBeacon() {
      var that = this;
      this.adjoinBeaconData = {
        beaconid: "",
        nearbeacons: "",
      };
      this.adjoinBeaconAlias = "";
      let data = {
        projectid: this.intoProjectid,
        tranche: this.adjoinBeaconInfo.values_.tranche,
        type: this.adjoinBeaconInfo.values_.type,
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
                that.adjoinBeaconInfo.values_.deveui
              ) {
                that.adjoinBeaconDataList.splice(i, 1);
              }
            }
            that.adjoinBeaconAlias = that.adjoinBeaconInfo.values_.alias;
            that.adjoinBeaconData.beaconid =
              that.adjoinBeaconInfo.values_.deveui;
            let adjoinBeaconArr = [];
            if (that.adjoinBeaconInfo.values_.nearbeacons) {
              let userids =
                that.adjoinBeaconInfo.values_.nearbeacons.split(",");
              userids.forEach((item) => {
                adjoinBeaconArr.push(item);
              });
            } else {
              this.userid = [];
            }
            if (adjoinBeaconArr.length > 0) {
              adjoinBeaconArr.forEach((item) => {
                that.adjoinBeacon.push(item);
              });
            }
            that.menu_overlay.setPosition(undefined);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    setAdjoinBeaconTrue() {
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
          that.adjoinBeaconInfo.values_.nearbeacons =
            that.adjoinBeaconData.nearbeacons;
          that.$message({
            message: that.$t("staffmanagement.Setsuccessfully"),
            type: "success",
          });
          that.loading = false;
          that.adjoinBeaconShow = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
          that.loading = false;
          that.adjoinBeaconShow = false;
        }
      });
    },
    updateAdjoinBeaconCancel() {
      this.adjoinBeaconData = {
        beaconid: "",
        nearbeacons: "",
      };
      this.adjoinBeacon = [];
      this.adjoinBeaconShow = false;
      this.menu_overlay.setPosition(undefined);
    },

    closeAdjoinBeacon() {
      this.updateAdjoinBeaconCancel();
      this.removeClick();
    },

    //删除点和图层
    delFeatureAndLayer(layer) {
      layer
        .getSource()
        .getFeatures()
        .forEach(function (feature) {
          layer.getSource().removeFeature(feature);
        });
      // menu_overlay.setPosition(undefined);
      //删除多边形
      this.map.removeLayer(layer);
    },
    //删除点
    delPolygon(e, menu_overlay) {
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
          let LayerArrays = that.map.getLayers().getArray();
          //删除相邻点需要先选中再可以删除
          if (e.values_.id) {
            //遍历所有图层找到匹配feature的图层删除图层
            for (let i = 1; i < LayerArrays.length; i++) {
              if (
                (LayerArrays[i].getSource().getFeatures()[0].values_.adj ||
                  LayerArrays[i].getSource().getFeatures()[0].values_.point) &&
                JSON.stringify(e.values_.id) ==
                  (JSON.stringify(
                    LayerArrays[i].getSource().getFeatures()[0].values_.id
                  ) ||
                    JSON.stringify(
                      LayerArrays[i].getSource().getFeatures()[1].values_.id
                    ))
              ) {
                that.delFeatureAndLayer(LayerArrays[i]);
              }
            }
            let data3 = {
              pointid: e.values_.id, //子区域信息编号id
            };
            delPointByPointid(
              data3,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.$message({
                  message: that.$t("buildingmanagement.deletesuccess"),
                  type: "success",
                });
                that.resetNear();
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
            that.currentAdj = "";
            //隐藏菜单
            menu_overlay.setPosition(undefined);
            return;
          } else {
            //没有保存的点删除
            let LayerArrays = that.map.getLayers().getArray();
            //删除相邻点需要先选中再可以删除
            //遍历所有图层找到匹配feature的图层删除图层
            for (let i = 1; i < LayerArrays.length; i++) {
              if (
                LayerArrays[i].getSource().getFeatures()[0].values_.point &&
                that.currentAdj.ol_uid ==
                  LayerArrays[i].getSource().getFeatures()[0].ol_uid
              ) {
                that.delFeatureAndLayer(LayerArrays[i]);
              }
            }

            that.currentAdj = "";
            //隐藏菜单
            menu_overlay.setPosition(undefined);
            return;
          }
        })
        .catch(() => {
          menu_overlay.setPosition(undefined);
          that.removeClick();
        });
    },
    //删除图标
    delFeature(e, menu_overlay) {
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
          let num;
          let LayerArrays = that.map.getLayers().getArray();
          for (let i = 1; i < LayerArrays.length; i++) {
            if (
              e.values_.x ==
                LayerArrays[i].getSource().getFeatures()[0].values_.x &&
              e.values_.y ==
                LayerArrays[i].getSource().getFeatures()[0].values_.y
            ) {
              num = i;
              break;
            }
          }
          let data = {
            projectid: that.intoProjectid,
            groundid: that.groundid,
            deveui: e.values_.deveui,
            longi: e.values_.x,
            lati: e.values_.y,
            falg: false,
          };
          if (e.values_.devtype) {
            data.devtype = e.values_.devtype;
            updateDevOtherPosOne(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.$message({
                  message: that.$t("buildingmanagement.deletesuccess"),
                  type: "success",
                });
                LayerArrays[num]
                  .getSource()
                  .getFeatures()
                  .forEach(function (feature) {
                    LayerArrays[num].getSource().removeFeature(feature);
                  });

                menu_overlay.setPosition(undefined);
                that.map.removeLayer(LayerArrays[num]);
                if (that.activeMenu) {
                  that.menuClick(that.activeMenu, that.currentPage2);
                }
                // that.getBeaconPos(that.intoProjectid, that.currentPage2);
                // that.resetNear();
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
                    message: that.$t("buildingmanagement.deletesuccess"),
                    type: "success",
                  });
                  LayerArrays[num]
                    .getSource()
                    .getFeatures()
                    .forEach(function (feature) {
                      LayerArrays[num].getSource().removeFeature(feature);
                    });

                  menu_overlay.setPosition(undefined);
                  that.map.removeLayer(LayerArrays[num]);
                  that.getBeaconPos(that.intoProjectid, that.currentPage2);
                  that.resetNear();
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
                    message: that.$t("buildingmanagement.deletesuccess"),
                    type: "success",
                  });
                  LayerArrays[num]
                    .getSource()
                    .getFeatures()
                    .forEach(function (feature) {
                      LayerArrays[num].getSource().removeFeature(feature);
                    });

                  menu_overlay.setPosition(undefined);
                  that.map.removeLayer(LayerArrays[num]);

                  that.getGatewayPos(that.intoProjectid, that.currentPage2);
                  that.resetNear();
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
        })
        .catch(() => {
          that.menu_overlay.setPosition(undefined);
          that.removeClick();
        });
    },

    //计算距离
    calculatingDistance(e, menu_overlay) {
      this.removeClick();
      this.distanceData.x = Math.round(
        (this.reallength / this.length) * e.values_.xy[0] * 100
      );
      this.distanceData.y = Math.round(
        (this.realwidth / this.width) * e.values_.xy[1] * 100
      );
      this.showDistance = true;
    },
    //编辑图标
    editFeature(e, menu_overlay) {
      this.removeClick();
      this.menu_overlay = menu_overlay;
      this.editFeatureData.alias = e.values_.alias;
      this.editFeatureData.deveui = e.values_.deveui;
      this.editFeatureData.tranche = e.values_.tranche;
      this.editFeatureData.x = e.values_.x;
      this.editFeatureData.y = e.values_.y;

      this.editFeatureData.major = e.values_.major;
      this.editFeatureData.minor = e.values_.minor;
      this.editFeatureData.devtype = e.values_.devtype;
      this.editFeatureData.alarmname = e.values_.alarmname;

      this.editFeatureInfo = e;
      this.editFeatures = true;
    },
    editFeatureCancel() {
      this.editFeatures = false;

      this.menu_overlay.setPosition(undefined);
      this.removeClick();
    },
    closeEdit() {
      this.editFeatureCancel();
      this.removeClick();
    },
    editFeaturesTrue() {
      var that = this;
      this.editFeatures = false;
      this.editFeatureInfo.values_.alias = this.editFeatureData.alias;
      this.editFeatureInfo.values_.deveui = this.editFeatureData.deveui;
      this.editFeatureInfo.values_.devtype = this.editFeatureData.devtype;
      this.editFeatureInfo.x = this.editFeatureData.x;
      this.editFeatureInfo.y = this.editFeatureData.y;
      let alias = that.editFeatureData.alias;
      switch (that.showOption) {
        case 1:
          alias = that.editFeatureData.alias;
          break;
        case 2:
          alias = that.editFeatureData.major + "/" + that.editFeatureData.minor;
          break;
        case 3:
          alias =
            parseInt(that.editFeatureData.major, 16) +
            "/" +
            parseInt(that.editFeatureData.minor, 16);
          break;
        default:
          break;
      }
      var names = this.editFeatureData.alarmname
        ? "/" + this.editFeatureData.alarmname
        : "";
      if (that.showOption == 4) {
        names = this.editFeatureData.tranche
          ? "/" + this.editFeatureData.tranche
          : "";
      }
      if (this.editFeatureData.devtype) {
        let src;
        switch (that.editFeatureData.devtype) {
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

        that.editFeatureInfo.setStyle(
          new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 1],
              src: src,
              scale: 1,
            }),
            // 设置图片下面显示字体的样式和内容
            text: new Text({
              text: alias + names, // 添加文字描述
              font: "12px font-size", // 设置字体大小
              fill: new Fill({
                // 设置字体颜色
                color: "red",
              }),
              offsetY: 10, // 设置文字偏移量
            }),
          })
        );

        let data = {
          deveui: this.editFeatureData.deveui,
          alias: this.editFeatureData.alias,
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
            //移动完成重新设置该点xy信息
            that.editFeatureInfo.set("alias", that.editFeatureData.alias);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      } else {
        if (this.intoProjectType == 1) {
          if (that.editFeatureInfo.values_.type == 2) {
            that.editFeatureInfo.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: "../../../static/beacon_sos.png",
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: alias + names, // 添加文字描述 // 添加文字描述
                  font: "12px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "red",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );
          } else if (
            that.editFeatureInfo.values_.type == 1 &&
            that.editFeatureInfo.values_.clockin == 1
          ) {
            that.editFeatureInfo.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: "../../../static/clock.png",
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: alias + names, // 添加文字描述
                  font: "12px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "red",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );
          } else {
            that.editFeatureInfo.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: that.iconSrc,
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: alias + names, // 添加文字描述
                  font: "12px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "red",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );
          }
          let data = {
            beaconid: this.editFeatureData.deveui,
            alias: this.editFeatureData.alias,
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
              //移动完成重新设置该点xy信息
              that.editFeatureInfo.set("alias", that.editFeatureData.alias);
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else if (this.intoProjectType == 2) {
          if (that.editFeatureInfo.values_.warning == 2) {
            that.editFeatureInfo.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: "../../../static/gateway_sos.png",
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: alias + names, // 添加文字描述 // 添加文字描述
                  font: "12px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "red",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );
          } else if (that.editFeatureInfo.values_.clockin == 1) {
            that.editFeatureInfo.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: "../../../static/clock.png",
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: alias + names, // 添加文字描述
                  font: "12px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "red",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );
          } else {
            that.editFeatureInfo.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: that.iconSrc,
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: alias + names, // 添加文字描述
                  font: "12px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "red",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );
          }
          let data = {
            deveui: this.editFeatureData.deveui,
            alias: this.editFeatureData.alias,
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
              //移动完成重新设置该点xy信息
              that.editFeatureInfo.set("alias", that.editFeatureData.alias);
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        }
      }

      that.menu_overlay.setPosition(undefined);
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
          tenantid: that.contrForPrionum == 5 ? that.superId : that.tenantkey_A,
          page: 1,
          count: 20,
          projectid: that.intoProjectid,
        };
      } else {
        if (that.$store.state.intoProjectType == 1) {
          //正向项目
          data = {
            deveui: that.searchDeveui,
            alias: that.searchAlias,
            inuse: that.searchInuse,
            fortype: "2",
            inallot: "1",
            projectid: that.intoProjectid,
            page: 1,
            count: 20,
          };
        } else if (that.$store.state.intoProjectType == 2) {
          //反向项目
          data = {
            deveui: that.searchDeveui,
            alias: that.searchAlias,
            inuse: that.searchInuse,
            inallot: "1",
            projectid: that.intoProjectid,
            page: 1,
            count: 20,
          };
        }
      }

      if (this.searchInuse == 1) {
        data.groundid = that.groundid;
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
        if (that.$store.state.intoProjectType == 1) {
          //正向项目
          getBeaconPosList(
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
        } else if (that.$store.state.intoProjectType == 2) {
          //反向项目
          getDevPosList(
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
      if (this.arrange) {
        let LayerArrays = this.map.getLayers().getArray();
        for (let i = LayerArrays.length - 1; i > 0; i--) {
          LayerArrays[i]
            .getSource()
            .getFeatures()
            .forEach(function (feature) {
              LayerArrays[i].getSource().removeFeature(feature);
            });
          this.map.removeLayer(LayerArrays[i]);
        }
        this.addSubPolygon();
        if (that.$store.state.intoProjectType == 2) {
          that.getArrangeGatewayPos(that.intoProjectid);
        } else {
          that.getArrangeBeaconPos(that.intoProjectid);
        }
      }
    },

    //布置分页
    handleCurrentChangeArrange(val) {
      this.currentPage2 = val;
      if (this.activeMenu == "0") {
        this.changePageSearchArrange(val);
      } else {
        this.menuClick(this.activeMenu, val);
      }
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
          deveui: that.searchDeveui,
          alias: that.searchAlias,
          inuse: that.searchInuse,
          fortype: "2",
          inallot: "1",
          projectid: that.intoProjectid,
          page: page,
          count: 20,
        };
      } else if (that.$store.state.intoProjectType == 2) {
        //反向项目
        data = {
          deveui: that.searchDeveui,
          alias: that.searchAlias,
          inuse: that.searchInuse,
          inallot: "1",
          projectid: that.intoProjectid,
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

    //获取建筑信息
    getBuildingLists() {
      var that = this;
      // getBuildGroundList(
      //   this.searchList,
      //   this.tenantkey_A,
      //   this.tenantid_A,
      //   this.userName
      // ).then((res) => {
      //   if (res.code == 1001) {
      //     that.tableData = res.data.list;
      //     that.total = res.data.size;
      //   }
      // });
    },

    //布置
    arrangeMaps(info, scope) {
      var that = this;
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
      if (info.maptype == 1) {
        const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
        this.imgUrl = base + "indoormap/" + info.filetype;
        this.mapInit(info.length, info.width, info);
        this.reallength = info.reallength;
        this.length = info.length;
        this.realwidth = info.realwidth;
        this.width = info.width;
        if (info.reallength) {
          this.mapLength = info.reallength;
        } else {
          this.mapLength = null;
        }
        this.arrange = true;
        // this.showTable = true;
      }
      this.searchInuse = 2;
    },
    //布置页面点击返回
    arrangcancel() {
      let that = this;
      let goBack = false;
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
        if (res.code == 1001) {
          if (res.data.length == 0 || res.data.length == 1) {
            that.arrange = false;
            that.sub = false;
            that.map.setTarget("masssss");
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
                }
              )
              .then(() => {
                that.arrange = false;
                that.sub = false;
                that.map.setTarget("masssss");
                that.dobuleClick = false;
                that.$emit("change", false);
                return;
              })
              .catch(() => {
                return;
              });
          } else {
            that.arrange = false;
            that.sub = false;
            that.map.setTarget("masssss");
            that.dobuleClick = false;
            that.$emit("change", false);
          }
        }
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

    //反向项目获取地图上已布置的设备
    getArrangeGatewayPos(projectid) {
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
              that.addIconMarkers(that.map, that.arrangeFeatures[i]);
            }
          }
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

    //正向项目获取地图上已布置的设备
    getArrangeBeaconPos(projectid) {
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
              that.addIconMarkers(that.map, that.arrangeFeatures[i]);
            }
          }
        }
      });
    },

    //表格里选中
    selectArrange(val) {
      // 关闭其他绘制
      if (this.sub) {
        this.closeSub();
      }
      var that = this;
      if (val) {
        if (val.inuse == 2) {
          this.selectArrangeData = val;
        }
      }
    },
  },
  beforeMount() {
    // this.getBuildingLists();
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

.el-table >>> .el-table__row td {
  padding: 5px 0 !important;
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
.mapContent {
  width: 95%;
  height: 100%;
  margin-right: 0;
}
.allmap {
  background-color: white;
  margin: 0 auto;
}

.tableContent {
  width: 5%;
  display: flex;
  justify-content: flex-end;
  margin-right: 0;
}
.show_table {
  margin-right: 1%;
  z-index: 999;
  text-align: right;
}

.chose_table {
  text-align: right;
  background-color: #f1f5f7 !important;
  border: 0 !important;
}
.chose_table >>> .el-menu-item {
  padding: 0 !important;
  margin: 0 !important;
  height: 20px;
  line-height: 20px;
}
.icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-color: #9c9c9c;
  transition: all 0.2s;
}
.icon.beacon {
  mask: url("../../assets/beacon.svg");
  mask-size: contain;
}
.icon.smoke {
  mask: url("../../assets/smoke.svg");
  mask-size: contain;
}
.icon.aoagw {
  mask: url("../../assets/aoagw.svg");
  mask-size: contain;
}
.icon.alarm {
  mask: url("../../assets/alarm.svg");
  mask-size: contain;
}
.icon.camera {
  mask: url("../../assets/camera.svg");
  mask-size: contain;
}
.is-active > .icon {
  background-color: #458bff;
}
.table_data {
  margin-left: 0;
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
#popup-content {
  background: #f1f5f7 !important;
}
#popup-content button {
  background: #f1f5f7 !important;
  width: 100%;
  text-align: left;
  border: none;
  color: black;
}
#popup-content button:hover {
  background: skyblue !important;
  color: white;
}

#popup-content #delPolygon:hover {
  background-color: rgb(196, 27, 27) !important;
}
#popup-content #del:hover {
  background-color: rgb(196, 27, 27) !important;
}
#popup-content .dels:hover {
  background-color: rgb(196, 27, 27) !important;
}
.ol-popup-closer {
  margin-right: 2px;
}

li {
  list-style: none;
  margin-top: 5px;
}
.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
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

.arrangeDialog {
  text-align: center;
  background-color: #f1f5f7 !important;
}

.arrangeDialog >>> .el-dialog {
  background-color: #f1f5f7 !important;
}

.arrangeDialog >>> .el-dialog__header {
  display: none !important;
}

.arrangeDialog >>> .el-dialog__body {
  width: 100%;
  height: 100%;
}
.showHeadr >>> .el-dialog__header {
  display: block !important;
}
.setAreas >>> .el-radio-group {
  display: flex !important;
  flex-wrap: wrap;
}
.setAreas >>> .el-radio {
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

#allmap >>> .ol-viewport {
  overflow: unset !important;
}
.setAdjoinBeacon >>> .el-dialog {
  margin-right: 2%;
}
.addTranche >>> .el-form-item__content {
  display: flex;
}
.tranchSwitch {
  display: flex;
  line-height: 34px;
  height: 34px;
}
.tranchSwitch >>> .ivu-switch {
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
  z-index: 1;
}
</style>
