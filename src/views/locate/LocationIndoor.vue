<template>
  <div class="content" style="height: 100%; width: 100%">
    <ul class="imags_ul" v-show="btnShow">
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('LocationIndoor.search')"
          placement="left"
        >
          <el-image
            src="../../../static/search.png"
            style="width: 32px; height: 32px"
            @click="showSearch()"
          ></el-image>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('LocationIndoor.Selectbuilding')"
          placement="left"
        >
          <el-image
            src="../../../static/switch.png"
            style="width: 32px; height: 32px"
            @click="showBuild()"
          ></el-image>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('LocationIndoor.Viewdetails')"
          placement="left"
        >
          <el-image
            src="../../../static/detail.png"
            style="width: 32px; height: 32px"
            @click="showGround()"
          ></el-image>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('LocationIndoor.Parameterconfiguration')"
          placement="left"
        >
          <el-image
            src="../../../static/edit.png"
            style="width: 32px; height: 32px"
            @click="showSetting()"
          ></el-image>
        </el-tooltip>
      </li>
    </ul>

    <div class="inputContent" style="display: flex; flex-wrap: wrap">
      <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
        v-bind:css="false"
      >
        <el-form
          class="demo-form-inline"
          style="display: flex; white-space: nowrap; margin-left: 1%"
          :model="searchLists"
          v-if="searchShow"
        >
          <el-form-item
            :label="$t('LocationIndoor.name')"
            style="display: flex; margin-left: 1%; margin-right: 2%"
          >
            <el-select
              clearable
              filterable
              remote
              :remote-method="remoteUserMethod"
              v-model="perDeveui"
              :placeholder="$t('LocationIndoor.Pleaseenter')"
              style="width: 100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.maplabel"
                :label="item.username"
                :value="item.maplabel"
              >
                <span style="float: left">{{ item.username }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.maplabel
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('LocationIndoor.asset')"
            style="display: flex; margin-left: 1%; margin-right: 0"
          >
            <el-select
              clearable
              filterable
              remote
              :remote-method="remoteAssetMethod"
              v-model="assetDeveui"
              :placeholder="$t('LocationIndoor.Pleaseenter')"
            >
              <el-option
                v-for="item in assetOptions"
                :key="item.beaconid"
                :label="item.name"
                :value="item.beaconid"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.beaconid
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('LocationIndoor.carnumber')"
            style="display: flex; margin-left: 1%; margin-right: 2%"
            v-if="intoProjectType == 1"
          >
            <el-select
              clearable
              filterable
              remote
              :remote-method="remoteTBoxMethod"
              v-model="tboxDeveui"
              :placeholder="$t('LocationIndoor.Pleaseenter')"
            >
              <el-option
                v-for="item in tboxOptions"
                :key="item.maplabel"
                :label="item.sn"
                :value="item.maplabel"
              >
                <span style="float: left">{{ item.sn }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.maplabel
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="display: flex; margin-left: 1%">
            <el-button type="primary" class="query" @click="searchInfo()"
              >{{ $t("LocationIndoor.search") }}
            </el-button>
            <el-button type="primary" class="reset" @click="clearBtn()">{{
              $t("LocationIndoor.reset")
            }}</el-button>
          </el-form-item>
        </el-form>
      </transition>
    </div>

    <div
      :class="fullscreen ? 'fullscreen_containers' : 'containers'"
      style="width: 100%; height: 98%"
    >
      <div class="float_box">
        <div v-if="isAllData" style="width: 100%">
          <dv-decoration-7 style="width: 100%; height: 30px">{{
            $t("LocationIndoor.statistics")
          }}</dv-decoration-7>
          <dv-border-box-6 :key="borderkey">
            <div class="all_num_box">
              <div class="all_num">
                <p>{{ allPerson }}</p>
                <p>{{ $t("LocationIndoor.Numpeople") }}</p>
              </div>
              <div class="all_num">
                <p>{{ allCar }}</p>
                <p>{{ $t("LocationIndoor.NumCar") }}</p>
              </div>
              <div class="all_num">
                <p>{{ allAsste }}</p>
                <p>{{ $t("LocationIndoor.Numassets") }}</p>
              </div>
            </div>
          </dv-border-box-6>
        </div>

        <div class="statistics_box">
          <div v-if="isRoleData">
            <dv-decoration-7 style="width: 100%; height: 30px">{{
              $t("LocationIndoor.RoleStatistics")
            }}</dv-decoration-7>
            <dv-capsule-chart :config="roleData" class="rloe_data" />
          </div>
          <div v-if="isDepartmentData">
            <dv-decoration-7
              style="width: 100%; height: 30px; margin-top: 20px"
              >{{ $t("LocationIndoor.DepartmentStatistics") }}</dv-decoration-7
            >
            <dv-capsule-chart
              :config="departmentData"
              class="department_data"
            />
          </div>
          <div v-if="isSosData">
            <dv-decoration-7
              style="width: 100%; height: 30px; margin-top: 20px"
              >{{ $t("Breadcrumb.AlarmStatistics") }}</dv-decoration-7
            >
            <dv-active-ring-chart :config="sosDatas" class="sosDatas_data" />
          </div>
        </div>
      </div>

      <!-- 2D地图 -->
      <div v-show="mapTypes" class="mapConent">
        <div id="allmap" ref="map" class="allmap">
          <div
            style="position: absolute; bottom: 2%; right: 4px; z-index: 1001"
          >
            <transition
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-on:leave="leave"
              v-bind:css="false"
            >
              <el-checkbox-group
                @change="changeSetting"
                v-if="settingShow"
                v-model="checkList"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                "
              >
                <el-checkbox
                  :label="$t('LocationIndoor.personnel')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.assets')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.vehicle')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute1')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute5')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute10')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute20')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute30')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.hour')"
                  style="margin-left: 0"
                ></el-checkbox>
                <!-- <el-checkbox
                  label="所有"
                  style="margin-left: 0"
                ></el-checkbox> -->
              </el-checkbox-group></transition
            >
          </div>
          <!-- 楼栋选择 -->
          <div class="selectBuild">
            <transition
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-on:leave="leave"
              v-bind:css="false"
            >
              <el-select
                v-model="isactive"
                placeholder=""
                @change="getGrounds(isactive)"
                :popper-append-to-body="false"
                style="position: absolute; right: 0; z-index: 1001"
                v-if="buildShow"
              >
                <el-option
                  v-for="item in buildings"
                  :key="item.id"
                  :label="item.building"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </transition>
          </div>
          <transition
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            v-bind:css="false"
          >
            <div
              class="statistics"
              style="
                display: flex;
                background-color: #fff;
                border-radius: 6px;
                box-shadow: 1px 1px 3px 1px #b5c6dd;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 1000;
                align-items: center;
              "
              v-show="groundShow"
            >
              <div
                v-show="
                  (tableData[0].num > 0 || tableData[1].num > 0) && showEcharts
                "
                style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-wrap: wrap;
                "
              >
                <div>
                  <div style="width: 220px; height: 220px" id="echarts"></div>
                  <div style="width: 220px; height: 220px" id="echarts1"></div>
                </div>
                <div>
                  <div style="width: 220px; height: 220px" id="echarts2"></div>
                  <div style="width: 220px; height: 220px" id="echarts3"></div>
                </div>
              </div>
              <div class="show_echarts" @click="showEchart()">
                {{ show_echart }}
              </div>
              <div>
                <el-table
                  :data="groundData"
                  style="width: 100%; margin-bottom: 20px"
                  border
                  max-height="300"
                  :cell-class-name="selectGrounds"
                  :summary-method="getSummaries"
                  show-summary
                >
                  <el-table-column
                    prop="name"
                    :label="$t('LocationIndoor.floor')"
                    min-width="80"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="devnum"
                    :label="$t('LocationIndoor.Numpeople')"
                    min-width="65"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="tboxnum"
                    :label="$t('LocationIndoor.NumCar')"
                    min-width="80"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="assetnum"
                    :label="$t('LocationIndoor.Numassets')"
                    min-width="80"
                  >
                  </el-table-column>
                </el-table>
                <!-- <el-table
                  :data="tableData"
                  style="width: 100%; margin-bottom: 20px"
                  row-key="id"
                  border
                  :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren',
                  }"
                >
                  <el-table-column
                    prop="name"
                    :label="$t('LocationIndoor.type')"
                    min-width="120"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    :label="$t('LocationIndoor.quantity')"
                    min-width="50"
                  >
                  </el-table-column>
                </el-table> -->
              </div>
            </div>
          </transition>
        </div>
        <!-- 楼层选择 -->
        <div class="selectGround" style="z-index: 1">
          <div
            style="
              width: 42px;
              background-color: white;
              box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 3px;
              border-radius: 2px;
            "
          >
            <div style="overflow: hidden" class="fm-layer-list">
              <div
                v-for="(item, index) in grounds"
                :key="item"
                @click="getBuildGroundLists(item)"
                :class="isactiveGround == item ? 'addclass' : ''"
              >
                <label
                  data-gid="2"
                  id="gid_24.99322021/3/1/11:04:43"
                  style="
                    display: inline-block;
                    text-align: center;
                    width: 42px;
                    height: 42px;
                    line-height: 42px;
                    margin: 0px;
                    cursor: pointer;
                    font-size: 0.8em;
                    font-weight: bold;
                    color: rgb(102, 102, 102);
                  "
                >
                  <span v-if="item > 0">F{{ item }}</span>
                  <span v-if="item < 0">B{{ -item }}</span>
                </label>
                <hr
                  v-show="grounds.length > 1 && index !== grounds.length - 1"
                  style="
                    height: 1px;
                    border-top: 1px solid rgba(153, 153, 153, 0.45);
                    border-right: none;
                    border-bottom: none;
                    border-left: none;
                    border-image: initial;
                    width: 60%;
                    margin: 0px 20%;
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D地图 -->
      <div v-show="!mapTypes" class="mapConentD">
        <div id="fengMap" class="fengMap">
          <div
            style="position: absolute; bottom: 10%; right: 2%; z-index: 1001"
          >
            <transition
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-on:leave="leave"
              v-bind:css="false"
            >
              <el-checkbox-group
                @change="changeSetting"
                v-if="settingShow"
                v-model="checkList"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                "
              >
                <el-checkbox
                  :label="$t('LocationIndoor.personnel')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.assets')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.vehicle')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute1')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute5')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute10')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute20')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.minute30')"
                  style="margin-left: 0"
                ></el-checkbox>
                <el-checkbox
                  :label="$t('LocationIndoor.hour')"
                  style="margin-left: 0"
                ></el-checkbox> </el-checkbox-group
            ></transition>
          </div>
          <!-- 楼栋选择 -->
          <div class="selectBuild selectBuild3d">
            <transition
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-on:leave="leave"
              v-bind:css="false"
            >
              <el-select
                v-model="isactive"
                placeholder=""
                @change="getGrounds(isactive)"
                :popper-append-to-body="false"
                v-if="buildShow"
                style="position: absolute; right: 0; z-index: 1001"
              >
                <el-option
                  v-for="item in buildings"
                  :key="item.building"
                  :label="item.building"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </transition>
          </div>
          <transition
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            v-bind:css="false"
          >
            <div class="statistics statistics3d" v-show="groundShow">
              <div
                v-show="
                  (tableData[0].num > 0 || tableData[1].num > 0) && showEcharts
                "
                style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-wrap: wrap;
                "
              >
                <div>
                  <div
                    style="width: 220px; height: 220px"
                    id="echarts_3D"
                  ></div>
                  <div
                    style="width: 220px; height: 220px"
                    id="echarts1_3D"
                  ></div>
                </div>
                <div>
                  <div
                    style="width: 220px; height: 220px"
                    id="echarts2_3D"
                  ></div>
                  <div
                    style="width: 220px; height: 220px"
                    id="echarts3_3D"
                  ></div>
                </div>
              </div>
              <div
                class="show_echarts"
                @click="showEchart()"
                v-if="tenantid_A != 'yvi0xfwr'"
              >
                {{ show_echart }}
              </div>
              <div>
                <el-table
                  :data="groundData"
                  style="width: 100%; margin-bottom: 20px"
                  border
                  max-height="500"
                  :cell-class-name="selectGrounds"
                  :summary-method="getSummaries"
                  show-summary
                >
                  <el-table-column
                    prop="name"
                    :label="$t('LocationIndoor.floor')"
                    min-width="80"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="devnum"
                    :label="$t('LocationIndoor.Numpeople')"
                    min-width="70"
                  >
                  </el-table-column>
                  <el-table-column
                    v-if="tenantid_A != 'yvi0xfwr'"
                    prop="tboxnum"
                    :label="$t('LocationIndoor.NumCar')"
                    min-width="60"
                  >
                  </el-table-column>
                  <el-table-column
                    v-if="tenantid_A != 'yvi0xfwr'"
                    prop="assetnum"
                    :label="$t('LocationIndoor.Numassets')"
                    min-width="50"
                  >
                  </el-table-column>
                </el-table>
                <!-- <el-table
                  v-if="tenantid_A != 'yvi0xfwr'"
                  :data="tableData"
                  style="width: 100%; margin-bottom: 20px"
                  row-key="id"
                  border
                  :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren',
                  }"
                >
                  <el-table-column
                    prop="name"
                    :label="$t('LocationIndoor.type')"
                    min-width="120"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    :label="$t('LocationIndoor.quantity')"
                    min-width="50"
                  >
                  </el-table-column>
                </el-table> -->
              </div>
            </div>
          </transition>
        </div>
        <p
          style="
            position: absolute;
            top: 94.5%;
            text-align: left;
            color: white;
            z-index: 11;
          "
        >
          {{ $t("LocationIndoor.tet") }}
        </p>
      </div>
    </div>

    <!-- 点击地图上图标显示的内容 -->
    <el-dialog
      :visible.sync="visible"
      :width="showBracelet ? '25%' : '20%'"
      class="Info_dialog"
      :modal="false"
    >
      <!-- 左键显示内容的 -->
      <div id="popups" class="ol-popups">
        <div id="popup-contents">
          <ul v-show="devPer" class="container">
            <!-- 左上部分：图片 -->
            <div class="left-top">
              <el-image
                style="width: 100%; height: auto"
                :src="imagePer"
              ></el-image>
            </div>

            <!-- 右上部分：基本信息 -->
            <div class="right-top">
              <li class="goDev">
                {{ $t("locationoutdoor.name") }}
                <a @click="goStaff(username)">{{ username }}</a>
              </li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.age") }}{{ age }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.sex") }}{{ sexstr }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.worktype") }}{{ worktype }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.department") }}{{ depart }}</li>
            </div>

            <!-- 下部：其余信息 -->
            <div class="bottom" v-if="showBracelet">
              <el-divider class="divider"></el-divider>
              <!-- 设备信息 -->
              <p class="bracelet_title">
                {{ $t("LocationIndoor.equipmentInfo") }}
              </p>
              <li class="goDev bracelet_dev">
                <span
                  >{{ $t("terminal.deveui") }}
                  <a @click="goDevs(maplabel)">{{ maplabel }}</a></span
                >
                <span v-if="battery"
                  >{{ $t("locationoutdoor.electricity") }}{{ battery }}%</span
                >
              </li>
              <!-- <el-divider class="divider"></el-divider> -->
              <li>{{ $t("terminal.Locationupdatetime1") }}{{ gpstime }}</li>

              <el-divider class="divider"></el-divider>
              <!-- 手环数据 -->
              <p class="bracelet_title">
                {{ $t("LocationIndoor.braceletData") }}
              </p>
              <li class="bracelet_dev">
                <span>{{ $t("terminal.deveui") }} {{ bracelet_eui }}</span>
                <span
                  >{{ $t("locationoutdoor.electricity")
                  }}{{ bracelet_soc }}%</span
                >
              </li>
              <!-- <el-divider class="divider"></el-divider> -->
              <li class="bracelet_dev">
                <span
                  >{{ $t("LocationIndoor.heartRate") }}{{ bracelet_rate }}</span
                >
                <span
                  >{{ $t("LocationIndoor.temperature")
                  }}{{ bracelet_tem }} °C</span
                >
                <span
                  >{{ $t("LocationIndoor.oxygen") }}{{ bracelet_oxygen }}</span
                >
              </li>
              <!-- <el-divider class="divider"></el-divider> -->
              <li>{{ $t("home.Dataupdatetime") }}{{ bracelet_time }}</li>
            </div>

            <!-- 下部：其余信息 -->
            <div class="bottom" v-else>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.telephone") }}{{ tel }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.cardno") }}{{ cardno }}</li>

              <el-divider class="divider" v-if="battery"></el-divider>
              <li v-if="battery">
                {{ $t("locationoutdoor.electricity") }}{{ battery }} %
              </li>

              <el-divider class="divider"></el-divider>
              <li class="goDev">
                {{ $t("terminal.deveui") }}
                <a @click="goDevs(maplabel)">{{ maplabel }}</a>
              </li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("terminal.Locationupdatetime1") }}{{ gpstime }}</li>
            </div>
          </ul>

          <ul v-show="devAsset" class="container">
            <!-- 左上部分：图片 -->
            <div class="left-top">
              <el-image
                style="width: 100%; height: auto"
                :src="imageAsset"
              ></el-image>
            </div>
            <!-- 右上部分：基本信息 -->
            <div class="right-top">
              <li>{{ $t("locationoutdoor.AssetName") }}{{ assetName }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Assettype") }}{{ assetType }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Assetmodel") }}{{ assetModel }}</li>
            </div>

            <!-- 下部：其余信息 -->
            <div class="bottom">
              <el-divider class="divider"></el-divider>
              <li class="goDev">
                {{ $t("LocationIndoor.TagNo")
                }}<a @click="goBeacons(assetBeaconid)">{{ assetBeaconid }}</a>
              </li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Department") }}{{ assetDepart }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.User") }}{{ assetUser }}</li>
              <el-divider class="divider"></el-divider>
              <li>{{ $t("locationoutdoor.Time") }}{{ assetTime }}</li>
            </div>
          </ul>

          <ul v-show="devTBox">
            <el-image
              style="width: 150px; height: 150px"
              :src="imageTBox"
            ></el-image>
            <li>{{ $t("LocationIndoor.carnumber") }}{{ tboxName }}</li>
            <el-divider class="divider"></el-divider>
            <li>{{ $t("LocationIndoor.Vehicletype") }}{{ tboxType }}</li>
            <el-divider class="divider"></el-divider>
            <li class="goDev">
              {{ $t("LocationIndoor.TagNo")
              }}<a @click="goDevs(tboxMaplabel)">{{ tboxMaplabel }}</a>
            </li>
            <el-divider class="divider"></el-divider>
            <li>{{ $t("LocationIndoor.Time") }}{{ tboxTime }}</li>
            <el-divider class="divider"></el-divider>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fengmap from "fengmap/build/fengmap.map.min";
import host from "../../host";
import Fullscreen from "vue-fullscreen/src/component.vue";

import {
  getBuildingByProjectid,
  getGroundList,
  getGround,
  getBuildGroundList,
  getMemberNameId,
  getTboxSnId,
  getLastDevGps,
  getDevGpsOne,
  getAssetName,
  getMemberInformation,
  getTboxOne,
  getAssetOne,
  getMapidByBuildid,
  getCountNum,
  getWarnNumList,
} from "../../axios/api";

// 布置相关
import "ol/ol.css";
import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { getCenter } from "ol/extent";

// 图上图标相关
import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlLayerVector from "ol/layer/Vector";
import OlSourceVector from "ol/source/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";

import * as echarts from "echarts";

// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

// 控制
import { defaults as defaultControls } from "ol/control";
export default {
  components: { Fullscreen },
  name: "LocationIndoor",
  data() {
    return {
      scale: "",
      i8n: this.$store.state.i18n,
      checkList: [],
      checkList1: [],
      contrForPrionum: this.$store.state.userInfo.prionum,
      intoProjectName: this.$store.state.intoProjectName,
      intoProjectid: this.$store.state.intoProjectid,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      radio1: 1,
      isactive: "",
      buildingId: "", //用户从首页点击跳转传过来的楼栋id
      homeGround: "", //用户从首页点击跳转传过来的楼层
      warningBuildingId: "", //用户从告警信息（人群聚集）点击跳转传过来的楼栋id
      warningGround: "", //用户从告警信息（人群聚集）点击跳转传过来的楼层
      isactiveGround: false,
      buildings: "", //所有楼栋
      building: "", //当前选中楼栋
      grounds: "", //所有楼层
      ground: "", //当前选中楼层
      groundid: "", //当前楼层编号
      arrangeFeatures: "", //已布置的设备
      imgUrl: "",
      map: null,
      mapName: "allmap",
      groundData: [],
      userList: [],
      assetList: [],
      tboxList: [],
      perDeveui: "",
      assetDeveui: "",
      tboxDeveui: "",
      searchLists: {},
      searchList: {
        deveui: "",
        projectid: this.$store.state.projectid,
        devtype: "",
      },
      sostype: false, //判断是否为SOS
      wsuri: "",
      websockNum: 0,

      //点击显示的信息
      devPer: false, //单击显示人的信息
      showBracelet: false, //是否显示手环健康数据
      devAsset: false, //单击显示资产的信息
      devTBox: false, //单击显示车辆的信息
      // 手环信息
      bracelet_eui: "", //设备号
      bracelet_soc: "", //电量
      bracelet_rate: "", //心率
      bracelet_tem: "", //体温
      bracelet_oxygen: "", //血氧
      bracelet_time: "", //时间
      age: "",
      depart: "",
      cardno: "",
      maplabel: "",
      sexstr: "",
      tel: "",
      worktype: "",
      username: "",
      imagePer: "",
      imageAsset: "",
      imageTBox: "",
      gpstime: "",
      assetName: "",
      assetType: "",
      assetModel: "",
      assetBeaconid: "",
      assetDepart: "",
      assetUser: "",
      assetTime: "",
      tboxName: "",
      tboxType: "",
      tboxMaplabel: "",
      tboxTime: "",
      //当前楼层内的信息
      tableData: [
        {
          id: "-1",
          name: this.$t("LocationIndoor.Totalnumber"),
          num: "0",
        },
        {
          id: "-2",
          name: this.$t("LocationIndoor.Totalassets"),
          num: "0",
        },
        {
          id: "-3",
          name: this.$t("LocationIndoor.Totalvehicle"),
          num: "0",
        },
        {
          id: "-4",
          name: this.$t("LocationIndoor.Jobs1"),
          num: "0",
          children: [],
        },
        {
          id: "-5",
          name: this.$t("LocationIndoor.department"),
          num: "0",
          children: [],
        },
        {
          id: "-6",
          name: this.$t("LocationIndoor.assets1"),
          num: "0",
          children: [],
        },
      ],

      //输入框模糊查询
      userLoading: false,
      assetLoading: false,
      tboxLoading: false,
      userOptions: [],
      assetOptions: [],
      tboxOptions: [],
      visible: false, //信息详情弹框
      fullscreen: false,

      //3D地图相关
      groundListCopy: [], //用于3D地图的时候，设定新的对应关系
      newGround: "", //用于3D地图的时候新的对应关系里的新的楼层对应的
      mapTypes: true, //用于判断选择2d还是3d显示
      changemap: true,
      map3d: null,
      fmapId: "",
      themeId: "",
      scrollFloorControl: "",
      layer: null,
      layerList: [],
      layer2: null,
      setNewMarker: true, //标注
      groundVals: "",

      gl: "",
      timer: null,
      searchShow: false,
      buildShow: false,
      groundShow: false,
      settingShow: false,
      time: 0,
      mapInfo: [],
      btnShow: true,
      timeOut: null,

      showEcharts: false,
      show_echart: "<",
      loading: null,
      // 地图左上角
      borderkey: 1,
      isAllData: false,
      allPerson: 0,
      allCar: 0,
      allAsste: 0,
      dataTimer: null,
      roleData: {
        data: [],
        // unit: this.$t("LocationIndoor.person"),
        unit: "",
        showValue: true,
      },
      departmentData: {
        data: [],
        unit: this.$t("LocationIndoor.person"),
        showValue: true,
      },
      activeName: "role",
      sosDatas: {
        radius: "40%",
        activeRadius: "45%",
        data: [],
        digitalFlopStyle: {
          fontSize: 12,
        },
        showOriginValue: true,
        activeTimeGap: 2000, //切换间隔
      },
      isRoleData: false,
      isDepartmentData: false,
      isSosData: false,

      showAllGround: false,
      battery: "", //工卡电量
      featureMap: "",
      sourceMap: "",
      layerMap: "",
      moveTimers: {
        person: {},
        asset: {},
        tbox: {},
      },
    };
  },
  methods: {
    // 点击信息弹框中的人名,跳转查询
    goStaff(username) {
      this.$router.push({
        path: "/staff/staffmanagement",
        query: {
          username: username,
        },
      });
    },
    // 点击信息弹框中的卡号,跳转查询
    goDevs(deveui) {
      this.$router.push({
        path: "/device/terminal",
        query: {
          deveui: deveui,
        },
      });
    },
    goBeacons(deveui) {
      this.$router.push({
        path: "/device/beacon",
        query: {
          beaconid: deveui,
        },
      });
    },
    // 计算年龄
    ages(str) {
      if (str == "" || str == null) {
        return 0;
      }
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
      if (r == null) return 0;
      var d = new Date(r[1], r[3] - 1, r[4]);
      if (
        d.getFullYear() == r[1] &&
        d.getMonth() + 1 == r[3] &&
        d.getDate() == r[4]
      ) {
        var Y = new Date().getFullYear();
        return Y - r[1];
      }
      return 0;
    },
    // 获取相关数据
    getData() {
      let that = this;
      if (this.dataTimer) {
        clearInterval(this.dataTimer);
        this.dataTimer = null;
      }
      that.isDepartmentData = false;
      that.isRoleData = false;
      that.isSosData = false;
      that.isAllData = false;
      that.getWarnNumLists();
      that.dataTimer = setInterval(() => {
        that.getWarnNumLists();
      }, 10000);
    },
    getCountNums() {
      var that = this;
      let time = Math.floor(new Date().getTime() / 1000);
      let data = {
        projectid: this.$store.state.projectid,
        buildid: this.building,
        groundid: this.groundid,
        gpstype: 1,
        devtype: 0,
        time: time,
      };
      getCountNum(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.allPerson = res.data.devnum;
            that.allCar = res.data.tboxnum;
            that.allAsste = res.data.assetnum;
            if (that.allPerson || that.allCar || that.allAsste) {
              that.isAllData = true;
            }
            that.borderkey++;
            if (res.data.list) {
              let groundInfoList = res.data.list;
              that.roleData = {
                data: [],
                showValue: true,
                unit: "",
              };
              that.departmentData = {
                data: [],
                showValue: true,
                unit: "",
              };
              if (groundInfoList.length > 0) {
                for (let i = 0; i < groundInfoList.length; i++) {
                  switch (groundInfoList[i].type) {
                    case 1:
                      that.roleData.data.push({
                        name: groundInfoList[i].name,
                        value: groundInfoList[i].num,
                      });
                      break;
                    case 2:
                      that.departmentData.data.push({
                        name: groundInfoList[i].name,
                        value: groundInfoList[i].num,
                      });
                      break;
                    default:
                      break;
                  }
                }
                that.roleData = { ...that.roleData };
                that.departmentData = { ...that.departmentData };
                if (that.departmentData.data.length > 0) {
                  that.isDepartmentData = true;
                }
                if (that.roleData.data.length > 0) {
                  that.isRoleData = true;
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
    getWarnNumLists() {
      let that = this;
      let data = {
        superid: this.$store.state.userInfo.superid,
        projectid: this.$store.state.projectid,
        buildid: this.building,
        groundid: this.groundid,
        status: 1,
        endtype: 8,
      };
      that.sosDatas.data = [];
      that.sosDatas = { ...that.sosDatas };
      getWarnNumList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        that.getCountNums();
        if (res.code == 1001) {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              that.sosDatas.data.push({
                name:
                  that.$store.state.i18n == "zh" ? item.typestr : item.entype,
                value: item.warn_status1_num,
              });
            });
            that.sosDatas = { ...that.sosDatas };
            that.isSosData = true;
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 是否显示echarts图
    showEchart() {
      if (this.tableData[0].num > 0 || this.tableData[1].num > 0) {
        if (this.showEcharts) {
          this.show_echart = "<";
        } else {
          this.show_echart = ">";
        }
        this.showEcharts = !this.showEcharts;
      }
    },
    // 3D楼栋获取地图的编号
    getMapid(id) {
      var that = this;
      getMapidByBuildid(
        { buildid: id },
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.fmapId = res.data[0];
        }
      });
    },
    echartsInit(list) {
      if (this.mapTypes) {
        var chartDom = document.getElementById("echarts");
        var myChart = echarts.init(chartDom);
        var chartDom1 = document.getElementById("echarts1");
        var myChart1 = echarts.init(chartDom1);
        var chartDom2 = document.getElementById("echarts2");
        var myChart2 = echarts.init(chartDom2);
        var chartDom3 = document.getElementById("echarts3");
        var myChart3 = echarts.init(chartDom3);
      } else {
        var chartDom = document.getElementById("echarts_3D");
        var myChart = echarts.init(chartDom);
        var chartDom1 = document.getElementById("echarts1_3D");
        var myChart1 = echarts.init(chartDom1);
        var chartDom2 = document.getElementById("echarts2_3D");
        var myChart2 = echarts.init(chartDom2);
        var chartDom3 = document.getElementById("echarts3_3D");
        var myChart3 = echarts.init(chartDom3);
      }

      var option, option1, option2, option3;
      let obj = {
        arr1: [],
        arr2: [],
        arr3: [],
        arr4: [],
      };
      list.forEach((item) => {
        if (item.type) {
          let arr = `arr${item.type}`;
          obj[arr].push({ name: item.name, value: item.num });
        }
      });
      option = {
        title: {
          text: this.$t("LocationIndoor.Jobsdistribution"),
          left: "center",
          textStyle: {
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "item",

          confine: true,
        },
        legend: {
          orient: "horizontal",
          left: "left",
          top: "10%",
          show: false,
        },
        series: [
          {
            name: this.$t("LocationIndoor.Jobsdistribution"),
            top: "0%",

            type: "pie",
            radius: "45%",
            data: obj.arr1,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option1 = {
        title: {
          text: this.$t("LocationIndoor.Sectordistribution"),
          left: "center",
          textStyle: {
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "item",

          confine: true,
        },
        legend: {
          orient: "horizontal",
          left: "left",
          top: "10%",
          show: false,
        },
        series: [
          {
            name: this.$t("LocationIndoor.Sectordistribution"),
            top: "0%",

            type: "pie",
            radius: "45%",
            data: obj.arr2,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option2 = {
        title: {
          text: this.$t("LocationIndoor.Assetdistribution"),
          left: "center",
          textStyle: {
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "item",

          confine: true,
        },
        legend: {
          orient: "horizontal",
          left: "left",
          top: "10%",
          show: false,
        },
        series: [
          {
            name: this.$t("LocationIndoor.Assetdistribution"),
            type: "pie",
            top: "0%",
            radius: "45%",
            data: obj.arr3,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option3 = {
        title: {
          text: this.$t("LocationIndoor.Vehicledistribution"),
          left: "center",
          textStyle: {
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "item",

          confine: true,
        },
        legend: {
          orient: "horizontal",
          left: "left",
          top: "-10%",
          show: false,
        },
        series: [
          {
            name: this.$t("LocationIndoor.Vehicledistribution"),
            type: "pie",
            radius: "45%",
            top: "0%",
            data: obj.arr4,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
      option1 && myChart1.setOption(option1);

      option2 && myChart2.setOption(option2);

      option3 && myChart3.setOption(option3);
    },
    changeSetting() {
      var that = this;
      clearInterval(that.timeOut);
      that.timeOut = null;
      //获取当前新选中的选项
      if (that.websock) {
        // this.websock.close(); //断开websocket
      }
      let newv = that.checkList.filter((i) => {
        return !that.checkList1.includes(i);
      });

      that.checkList1 = that.checkList;
      let a = [
        that.$t("LocationIndoor.personnel"),
        that.$t("LocationIndoor.assets"),
        that.$t("LocationIndoor.vehicle"),
      ];
      let b = [
        that.$t("LocationIndoor.minute1"),
        that.$t("LocationIndoor.minute5"),
        that.$t("LocationIndoor.minute10"),
        that.$t("LocationIndoor.minute20"),
        that.$t("LocationIndoor.minute30"),
        that.$t("LocationIndoor.hour"),
      ];
      let c = [60, 300, 600, 1200, 1800, 3600];

      if (newv[0]) {
        that.checkList.forEach((e, i) => {
          if (a.includes(newv[0]) && a.includes(e) && e !== newv[0]) {
            that.checkList.splice(i, 1);
          }
          if (b.includes(newv[0]) && b.includes(e) && e !== newv[0]) {
            that.checkList.splice(i, 1);
          }
        });
        //如果选中的是时间 获取数据
        let index = b.indexOf(newv[0]);
        if (index > -1) {
          that.time = c[index];
          let data = {
            projectid: that.$store.state.projectid,
            buildid: that.building,
            groundid: that.groundid,
            gpstype: 1,
            devtype: 0,
            time: that.time,
          };
          getLastDevGps(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code === 1001) {
              that.mapInfo = res.data;
              let devList = that.mapInfo.map((item) => {
                return item.deveui;
              });

              if (that.map) {
                let LayerArrays = that.map.getLayers().getArray();
                for (let i = 1; i < LayerArrays.length; i++) {
                  that.map.removeLayer(LayerArrays[i]);
                  i--;
                }
              } else {
                that.layerList.forEach((item) => {
                  item.remove();
                });
              }

              for (let i = 0; i < that.mapInfo.length; i++) {
                if (
                  that.mapInfo[i].devtype === 4 &&
                  ((that.checkList.indexOf(that.$t("LocationIndoor.assets")) ==
                    -1 &&
                    that.checkList.indexOf(
                      that.$t("LocationIndoor.personnel")
                    ) == -1) ||
                    that.checkList.length === 0)
                ) {
                  if (that.map3d) {
                    that.groundListCopy.forEach((item) => {
                      if (item.ground == that.mapInfo[i].ground) {
                        that.mapInfo[i].newground = item.newground;
                      }
                    });
                    that.addTBox(that.groundVals, that.mapInfo[i]);
                  } else {
                    // that.addIconTBox(that.map, that.mapInfo[i]);
                    that.addOrUpdateFeature("tbox", that.mapInfo[i]);
                  }
                }
                if (
                  ((that.mapInfo[i].devtype == 1 ||
                    that.mapInfo[i].devtype == 2) &&
                    that.checkList.indexOf(that.$t("LocationIndoor.vehicle")) ==
                      -1 &&
                    that.checkList.indexOf(that.$t("LocationIndoor.assets")) ==
                      -1) ||
                  that.checkList.length === 0
                ) {
                  if (that.map3d) {
                    that.groundListCopy.forEach((item) => {
                      if (item.ground == that.mapInfo[i].ground) {
                        that.mapInfo[i].newground = item.newground;
                      }
                    });
                    that.addMarker(that.groundVals, that.mapInfo[i]);
                  } else {
                    // that.addIconMarkers(that.map, that.mapInfo[i]);
                    that.addOrUpdateFeature("person", that.mapInfo[i]);
                  }
                }
                if (
                  that.mapInfo[i].devtype === 3 &&
                  ((that.checkList.indexOf(that.$t("LocationIndoor.vehicle")) ==
                    -1 &&
                    that.checkList.indexOf(
                      that.$t("LocationIndoor.personnel")
                    ) == -1) ||
                    that.checkList.length === 0)
                ) {
                  if (that.map3d) {
                    that.groundListCopy.forEach((item) => {
                      if (item.ground == that.mapInfo[i].ground) {
                        that.mapInfo[i].newground = item.newground;
                      }
                    });
                    that.addAsset(that.groundVals, that.mapInfo[i]);
                  } else {
                    // that.addIconAssets(that.map, that.mapInfo[i]);
                    that.addOrUpdateFeature("asset", that.mapInfo[i]);
                  }
                }
              }
              that.hideLayers(devList);
              that.timeOut = setInterval(() => {
                that.delTimeOut();
              }, 10000);
            }
          });
        } else {
          that.timeOut = setInterval(() => {
            that.delTimeOut();
          }, 10000);
          that.hideLayers();
        }
      } else {
        let isTime =
          that.checkList.length === 0
            ? false
            : that.checkList.every((item) => b.includes(item));
        //取消选中重新发请求
        if (!isTime) {
          that.time = 0;
          let data = {
            projectid: that.$store.state.projectid,
            buildid: that.building,
            groundid: that.groundid,
            gpstype: 1,
            devtype: 0,
            time: that.time,
          };
          getLastDevGps(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code === 1001) {
              that.mapInfo = res.data;
              if (that.map3d) {
                that.layerList.forEach((item) => {
                  item.remove();
                });
              } else {
                let LayerArrays = that.map.getLayers().getArray();
                for (let i = 1; i < LayerArrays.length; i++) {
                  that.map.removeLayer(LayerArrays[i]);
                  i--;
                }
              }

              for (let i = 0; i < that.mapInfo.length; i++) {
                if (that.mapInfo[i].devtype === 4) {
                  if (that.map3d) {
                    that.groundListCopy.forEach((item) => {
                      if (item.ground == that.mapInfo[i].ground) {
                        that.mapInfo[i].newground = item.newground;
                      }
                    });
                    that.addTBox(that.groundVals, that.mapInfo[i]);
                  } else {
                    // that.addIconTBox(that.map, that.mapInfo[i]);
                    that.addOrUpdateFeature("tbox", that.mapInfo[i]);
                  }
                }
                if (
                  that.mapInfo[i].devtype === 1 ||
                  that.mapInfo[i].devtype === 2
                ) {
                  if (that.map3d) {
                    that.groundListCopy.forEach((item) => {
                      if (item.ground == that.mapInfo[i].ground) {
                        that.mapInfo[i].newground = item.newground;
                      }
                    });
                    that.addMarker(that.groundVals, that.mapInfo[i]);
                  } else {
                    // that.addIconMarkers(that.map, that.mapInfo[i]);
                    that.addOrUpdateFeature("person", that.mapInfo[i]);
                  }
                }
                if (that.mapInfo[i].devtype === 3) {
                  if (that.map3d) {
                    that.groundListCopy.forEach((item) => {
                      if (item.ground == that.mapInfo[i].ground) {
                        that.mapInfo[i].newground = item.newground;
                      }
                    });
                    that.addAsset(that.groundVals, that.mapInfo[i]);
                  } else {
                    // that.addIconAssets(that.map, that.mapInfo[i]);
                    that.addOrUpdateFeature("asset", that.mapInfo[i]);
                  }
                }
              }
              that.timeOut = setInterval(() => {
                that.delTimeOut();
              }, 10000);
              this.hideLayers();
            }
          });
        } else {
          that.timeOut = setInterval(() => {
            that.delTimeOut();
          }, 10000);
          this.hideLayers();
        }
      }
      this.checkList1 = this.checkList;
    },

    //隐藏图标
    hideLayers(devList) {
      var that = this;
      //devlist是时间筛选设备deveui集合
      //showList显示设备类型的选中项
      let showList = [];
      this.checkList.forEach((item) => {
        if (item === that.$t("LocationIndoor.personnel")) {
          showList.push(1);
        }
        if (item === that.$t("LocationIndoor.assets")) {
          showList.push(3);
        }
        if (item === that.$t("LocationIndoor.vehicle")) {
          showList.push(4);
        }
      });
      if (this.map) {
        //遍历所有图标隐藏显示
        let LayerArrays = that.map.getLayers().getArray();
        for (let i = 1; i < LayerArrays.length; i++) {
          //没有选择设备类型并且没有时间段设备 图标全部显示
          if (showList.length === 0 && !devList) {
            LayerArrays[i].setVisible(true);
          } else {
            if (
              (!showList.includes(
                LayerArrays[i].getSource().getFeatures()[0].values_.devtype
              ) &&
                showList.length !== 0) ||
              (devList
                ? !devList.includes(
                    LayerArrays[i].getSource().getFeatures()[0].values_.deveui
                  )
                : false)
            ) {
              LayerArrays[i].setVisible(false);
            } else {
              LayerArrays[i].setVisible(true);
            }
          }
        }
      } else {
        that.layerList.forEach((item) => {
          //没有选择设备类型并且没有时间段设备 图标全部显示
          if (showList.length === 0 && !devList) {
            item.visible = true;
          } else {
            if (
              (!showList.includes(item.selfAttr.devtype) &&
                showList.length !== 0) ||
              (devList ? !devList.includes(item.selfAttr.deveui) : false)
            ) {
              item.visible = false;
            } else {
              item.visible = true;
            }
          }
        });
      }
    },
    // 动画
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      Velocity(el, { opacity: 1 }, { duration: 300, complete: done });
      this.showEcharts = false;
      this.show_echart = "<";
    },
    leave: function (el, done) {
      Velocity(el, { opacity: 0 }, { duration: 300, complete: done });
    },
    showSearch() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.searchShow = !this.searchShow;
      this.buildShow = false;
      this.groundShow = false;
      this.settingShow = false;
    },
    showBuild() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.buildShow = !this.buildShow;
      this.searchShow = false;

      this.groundShow = false;
      this.settingShow = false;
    },
    showGround() {
      var that = this;
      if (this.mapTypes) {
        echarts.init(document.getElementById("echarts")).dispose();
        echarts.init(document.getElementById("echarts1")).dispose();
        echarts.init(document.getElementById("echarts2")).dispose();
        echarts.init(document.getElementById("echarts3")).dispose();
      } else {
        echarts.init(document.getElementById("echarts_3D")).dispose();
        echarts.init(document.getElementById("echarts1_3D")).dispose();
        echarts.init(document.getElementById("echarts2_3D")).dispose();
        echarts.init(document.getElementById("echarts3_3D")).dispose();
      }
      that.getGroundDevNums(that.groundid);
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (!this.groundShow) {
        that.timer = setInterval(() => {
          that.getGroundDevNums(that.groundid);
        }, 5000);
      }
      this.groundShow = !this.groundShow;
      this.buildShow = false;
      this.searchShow = false;
      this.settingShow = false;
    },
    showSetting() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.settingShow = !this.settingShow;
      this.groundShow = false;
      this.buildShow = false;
      this.searchShow = false;
    },
    // 选择哪一层时，表格里标识选中的楼层数据
    selectGrounds({ row }) {
      var that = this;
      if (this.map3d) {
        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        if (focusGroupID.groundid == row.id) {
          return "cell-blue";
        }
      } else {
        let ground;
        if (row.ground.slice(0, 1) == "B") {
          ground = -row.ground.slice(1);
        } else {
          ground = row.ground.slice(1);
        }

        if (that.isactiveGround == ground) {
          return "cell-blue";
        }
      }
    },
    //输入框模糊查询
    remoteUserMethod(query) {
      if (query !== "") {
        this.userLoading = true;
        setTimeout(() => {
          this.userLoading = false;
          this.userOptions = this.userList.filter((item) => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return (
                item.username.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          });
        }, 200);
      } else {
        this.userOptions = [];
      }
    },
    remoteAssetMethod(query) {
      if (query !== "") {
        this.assetLoading = true;
        setTimeout(() => {
          this.assetLoading = false;
          this.assetOptions = this.assetList.filter((item) => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
          });
        }, 200);
      } else {
        this.assetOptions = [];
      }
    },
    remoteTBoxMethod(query) {
      if (query !== "") {
        this.tboxLoading = true;
        setTimeout(() => {
          this.tboxLoading = false;
          this.tboxOptions = this.tboxList.filter((item) => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.sn.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return item.sn.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
          });
        }, 200);
      } else {
        this.tboxOptions = [];
      }
    },
    //查询
    searchInfo(val, assetVal, tboxVal, vals) {
      this.isAllData = false;
      this.isDepartmentData = false;
      this.isSosData = false;
      var that = this;
      if (val) {
        this.searchLists.perDeveui = val;
        this.searchLists.assetDeveui = "";
        this.searchLists.tboxDeveui = "";
      } else if (assetVal) {
        this.searchLists.perDeveui = "";
        this.searchLists.assetDeveui = assetVal;
        this.searchLists.tboxDeveui = "";
      } else if (tboxVal) {
        this.searchLists.perDeveui = "";
        this.searchLists.assetDeveui = "";
        this.searchLists.tboxDeveui = tboxVal;
      } else {
        this.searchLists.perDeveui = this.perDeveui;
        this.searchLists.assetDeveui = this.assetDeveui;
        this.searchLists.tboxDeveui = this.tboxDeveui;
      }
      if (
        (this.searchLists.perDeveui && this.searchLists.assetDeveui) ||
        (this.searchLists.perDeveui && this.searchLists.tboxDeveui) ||
        (this.searchLists.assetDeveui && this.searchLists.tboxDeveui)
      ) {
        this.$message({
          message: this.$t("LocationIndoor.tet1"),
          type: "warning",
        });
        return;
      }
      if (this.intoProjectType == 1) {
        this.searchList.devtype = 1;
      } else if (this.intoProjectType == 2) {
        this.searchList.devtype = 2;
      }
      if (this.searchLists.perDeveui) {
        this.searchList.deveui = this.searchLists.perDeveui;
      } else if (this.searchLists.assetDeveui) {
        this.searchList.deveui = this.searchLists.assetDeveui;
        this.searchList.devtype = 3;
      } else if (this.searchLists.tboxDeveui) {
        this.searchList.deveui = this.searchLists.tboxDeveui;
        this.searchList.devtype = 4;
      } else if (
        this.searchLists.perDeveui == "" &&
        this.searchLists.assetDeveui == "" &&
        this.searchLists.tboxDeveui == "" &&
        vals == ""
      ) {
        this.$message({
          message: this.$t("LocationIndoor.tet2"),
          type: "warning",
        });
        return;
      }

      //判断是否从告警管理页面跳转过来的，如果是，就使用触发告警时的信息
      if (that.$route.query.warning == "true") {
        let sosData = that.$store.state.sosData;
        let isactive1 = sosData.buildid;
        let isactiveGround1 = sosData.groundid;

        if (val) {
          that.remoteUserMethod(sosData.deveui);
          setTimeout(() => {
            that.perDeveui = sosData.deveui;
            that.assetDeveui = "";
            that.tboxDeveui = "";
          }, 201);
        }
        if (assetVal) {
          that.remoteAssetMethod(sosData.deveui);
          setTimeout(() => {
            that.perDeveui = "";
            that.assetDeveui = sosData.deveui;
            that.tboxDeveui = "";
          }, 201);
        }
        if (tboxVal) {
          that.remoteTBoxMethod(sosData.deveui);
          setTimeout(() => {
            that.perDeveui = "";
            that.assetDeveui = "";
            that.tboxDeveui = sosData.deveui;
          }, 201);
        }
        if (vals) {
          that.searchLists.perDeveui = "";
          that.searchLists.assetDeveui = "";
          that.searchLists.tboxDeveui = "";
          that.perDeveui = "";
          that.assetDeveui = "";
          that.tboxDeveui = "";
        }
        if (that.websock) {
          that.websock.close(); //断开websocket
        }
        let mapInfo = sosData;
        var found = that.buildings.find(function (item) {
          return item.id == sosData.buildid;
        });
        // 2D
        if (found.buildtypestr == "2D") {
          that.mapTypes = true;
          let data = {
            projectid: that.intoProjectid,
            buildid: isactive1,
            groundid: isactiveGround1,
          };
          let data1 = {
            buildid: isactive1,
          };
          //获取查询的人所在楼栋的所有楼层
          getGroundList(
            data1,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            that.grounds = res.data.reverse();
          });
          //获取查询的人所在楼层的详细信息
          getBuildGroundList(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
            that.imgUrl = base + "indoormap/" + res.data.list[0].filetype;

            that.isactiveGround = res.data.list[0].ground;
            if (that.map) {
              that.map.setTarget("sss");
            }
            if (that.map3d) {
              that.map3d.dispose();
              that.map3d = null;
            }
            that.loadingFun();
            that.mapInit(
              res.data.list[0].length,
              res.data.list[0].width,
              1200,
              800,
              mapInfo
            );
          });
        } else if (found.buildtypestr == "3D") {
          // 3D
          that.showAllGround = found.flag;
          that.mapTypes = false;
          // that.getMapid(found.id);
          // 3D地图下，获取该楼栋下所有的楼层，设定新的楼层数与楼层的id的对应关系
          let data = {
            buildid: sosData.buildid,
          };
          getGround(
            data,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              for (let i = 0; i < res.data.length; i++) {
                let groundinfo = {
                  groundid: res.data[i].id,
                  ground: res.data[i].ground,
                  newground: i + 1,
                };
                that.groundListCopy.push(groundinfo);
              }
              that.scale = res.data[0].scale;
              let focusGroup = that.groundListCopy.find(function (item) {
                return item.groundid == sosData.groundid;
              });
              that.fmapId = res.data[0].filename;
              that.themeId = res.data[0].filetype;
              if (that.map) {
                that.map.setTarget("sss");
              }
              if (that.map3d) {
                that.map3d.dispose();
                that.map3d = null;
              }
              that.loadingFun();
              that.onmap(
                "",
                focusGroup.newground,
                mapInfo,
                res.data[0].appname,
                res.data[0].mapkey,
                that.groundListCopy
              );
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        }
        that.isactive = sosData.buildid;
        that.building = sosData.buildid;
        that.groundid = sosData.groundid;
      } else {
        getDevGpsOne(
          that.searchList,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (val) {
              that.remoteUserMethod(res.data.deveui);
              setTimeout(() => {
                that.perDeveui = res.data.deveui;
              }, 201);
            }
            if (assetVal) {
              that.remoteAssetMethod(res.data.deveui);
              setTimeout(() => {
                that.assetDeveui = res.data.deveui;
              }, 201);
            }
            if (tboxVal) {
              that.remoteTBoxMethod(res.data.deveui);
              setTimeout(() => {
                that.tboxDeveui = res.data.deveui;
              }, 201);
            }
            if (
              res.data.gpstime == null ||
              res.data.gpstime == "" ||
              res.data.gpstime == 0
            ) {
              that.$message({
                message: that.$t("LocationIndoor.tet3"),
                type: "warning",
              });
              this.btnShow = false;
            } else {
              if (res.data.postype == 1) {
                let isactive1 = res.data.buildid;
                let isactiveGround1 = res.data.ground;

                if (that.websock) {
                  that.websock.close(); //断开websocket
                }
                let mapInfo = res.data;
                var found = that.buildings.find(function (item) {
                  return item.id == res.data.buildid;
                });
                if (found.buildtypestr == "2D") {
                  that.mapTypes = true;
                  let data = {
                    projectid: that.intoProjectid,
                    buildid: isactive1,
                    ground: isactiveGround1,
                  };
                  let data1 = {
                    buildid: isactive1,
                  };
                  //获取查询的人所在楼栋的所有楼层
                  getGroundList(
                    data1,
                    that.tenantkey_A,
                    that.tenantid_A,
                    that.userName
                  ).then((res) => {
                    that.grounds = res.data.reverse();
                  });
                  //获取查询的人所在楼层的详细信息
                  getBuildGroundList(
                    data,
                    that.tenantkey_A,
                    that.tenantid_A,
                    that.userName
                  ).then((res) => {
                    const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
                    that.imgUrl =
                      base + "indoormap/" + res.data.list[0].filetype;
                    if (that.map) {
                      that.map.setTarget("sss");
                    }
                    if (that.map3d) {
                      that.map3d.dispose();
                      that.map3d = null;
                    }
                    that.loadingFun();
                    that.mapInit(
                      res.data.list[0].length,
                      res.data.list[0].width,
                      1200,
                      800,
                      mapInfo
                    );
                    that.wsuri = host.ws + "map/" + that.searchList.deveui;
                    that.initWebsocketOne();
                  });
                } else if (found.buildtypestr == "3D") {
                  that.showAllGround = found.flag;
                  that.mapTypes = false;
                  // 3D地图下，获取该楼栋下所有的楼层，设定新的楼层数与楼层的id的对应关系
                  let data = {
                    buildid: isactive1,
                  };
                  getGround(
                    data,
                    that.tenantkey_A,
                    that.tenantid_A,
                    that.userName
                  ).then((res) => {
                    if (res.code == 1001) {
                      for (let i = 0; i < res.data.length; i++) {
                        let groundinfo = {
                          groundid: res.data[i].id,
                          ground: res.data[i].ground,
                          newground: i + 1,
                        };
                        that.groundListCopy.push(groundinfo);
                      }
                      let focusGroup = that.groundListCopy.find(function (
                        item
                      ) {
                        return item.ground == isactiveGround1;
                      });
                      that.fmapId = res.data[0].filename;
                      that.themeId = res.data[0].filetype;
                      that.scale = res.data[0].scale;
                      if (that.map) {
                        that.map.setTarget("sss");
                      }
                      if (that.map3d) {
                        that.map3d.dispose();
                        that.map3d = null;
                      }
                      that.loadingFun();
                      that.onmap(
                        "",
                        focusGroup.newground,
                        mapInfo,
                        res.data[0].appname,
                        res.data[0].mapkey,
                        that.groundListCopy
                      );
                      that.wsuri = host.ws + "map/" + that.searchList.deveui;
                      that.initWebsocketOne();
                    }
                  });
                }
                that.isactive = res.data.buildid;
                that.building = res.data.buildid;
                that.isactiveGround = res.data.ground;
                that.groundid = res.data.groundid;
              } else if (res.data.postype == 2) {
                that.$confirm(
                  this.$t("LocationIndoor.tet4"),
                  this.$t("Building.tips"),
                  {
                    confirmButtonText: this.$t("terminal.confirm"),
                    cancelButtonText: this.$t("terminal.cancel"),
                    type: "warning",
                    callback: (action) => {
                      if (action === "confirm") {
                        if (that.perDeveui) {
                          that.$router.push({
                            path: "/location/outdoor/locationoutdoor",
                            query: { deveui: res.data.deveui },
                          });
                        } else if (that.tboxDeveui) {
                          that.$router.push({
                            path: "/location/outdoor/locationoutdoor",
                            query: { tboxDeveui: res.data.deveui },
                          });
                        }
                      }
                    },
                  }
                );
              }
            }
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },

    // 2D
    addIconMarker(map, info) {
      var startMarker = new OlFeature({
        x: info.x,
        y: info.y,
        deveui: info.deveui,
        username: info.username,
        projectid: info.projectid,
        gpstime: info.gpstime,
        devtype: info.devtype,
        battery: info.battery ? info.battery : "",
        type: info.type ? info.type : "",
        geometry: new OlGeomPoint([info.x, info.y]),
      });
      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style;
      if (this.sostype) {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/usersos.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
            font: "14px font-size",
            fill: new Fill({
              color: "blue",
            }),
            offsetY: 10, //文字偏移量
          }),
        });
      } else if (info.status == 3) {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/user1down.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
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
            // 说明：图片地址改为从环境变量读取基础地址，默认使用你当前线上地址，便于本地调试
            src: info.colour
              ? process.env.VUE_APP_ASSET_BASE + "/image/" + info.colour + ".png"
              : "../../../static/user1.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
            font: "14px font-size",
            fill: new Fill({
              color: "blue",
            }),
            offsetY: 10, //文字偏移量
          }),
        });
      }
      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
      this.sostype = false;
    },

    // 3D
    addMarker(groupID, mapinfo) {
      var that = this;
      var that = this;
      var coord = {
        x: mapinfo.x,
        y: mapinfo.y,
      };
      var info = {
        x: mapinfo.x,
        y: mapinfo.y,
        deveui: mapinfo.deveui,
        username: mapinfo.username,
        projectid: mapinfo.projectid,
        gpstime: mapinfo.gpstime,
        devtype: mapinfo.devtype,
        type: mapinfo.type ? mapinfo.type : "",
        level: mapinfo.newground,
      };
      let imgsrc;
      if (this.sostype) {
        imgsrc = "../../../static/usersos.png";
      } else if (mapinfo.status == 3) {
        imgsrc = "../../../static/user1down.png";
      } else {
        switch (mapinfo.colour) {
          case 1:
            imgsrc = "../../../static/1.png";
            break;
          case 2:
            imgsrc = "../../../static/2.png";
            break;
          case 3:
            imgsrc = "../../../static/3.png";
            break;
          case 4:
            imgsrc = "../../../static/4.png";
            break;
          case 5:
            imgsrc = "../../../static/5.png";
            break;
          case 6:
            imgsrc = "../../../static/6.png";
            break;
          case 7:
            imgsrc = "../../../static/7.png";
            break;
          case 8:
            imgsrc = "../../../static/8.png";
            break;
          case 9:
            imgsrc = "../../../static/9.png";
            break;
          case 10:
            imgsrc = "../../../static/10.png";
            break;
          default:
            imgsrc = "../../../static/user1.png";
            break;
        }
      }

      that.layer = new fengmap.FMCompositeMarker({
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
            text: mapinfo.username,
          },
        },
        x: coord.x,
        y: coord.y,
        image: {
          url: imgsrc,
          size: [100, 100],
        },
        // height: 1.7 / that.scale,
        collision: false,
        anchor: {
          baseon: "image",
          anchor: fengmap.FMMarkerAnchor.CENTER,
        },
      });

      that.layer.selfAttr = info;

      if (that.showAllGround) {
        var group = that.map3d.getFloor(mapinfo.newground);
        that.layer.addTo(group);
        that.layerList.push(that.layer);
      } else {
        var level = that.map3d.getLevel();
        var group = that.map3d.getFloor(level);
        that.layer.addTo(group);
        that.layerList.push(that.layer);
      }
      this.sostype = false;
    },
    // 2D
    addIconAsset(map, info) {
      var that = this;
      var startMarker = new OlFeature({
        x: info.x,
        y: info.y,
        username: info.username,
        projectid: info.projectid,
        gpstime: info.gpstime,
        deveui: info.deveui,
        devtype: info.devtype,
        battery: info.battery ? info.battery : "",
        type: info.type ? info.type : "",
        geometry: new OlGeomPoint([info.x, info.y]),
      });
      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/beacon1.png",
          scale: 1,
        }),
        //设置图片下面显示的字体样式和内容
        text: new Text({
          text: info.username,
          font: "14px font-size",
          fill: new Fill({
            color: "blue",
          }),
          offsetY: 10, //文字偏移量
        }),
      });
      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
    },

    // 2D
    addIconTBox(map, info) {
      var that = this;
      var startMarker = new OlFeature({
        x: info.x,
        y: info.y,
        username: info.username,
        projectid: info.projectid,
        gpstime: info.gpstime,
        deveui: info.deveui,
        devtype: info.devtype,
        battery: info.battery ? info.battery : "",
        type: info.type ? info.type : "",
        geometry: new OlGeomPoint([info.x, info.y]),
      });
      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style;

      if (this.sostype) {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/tboxsos.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
            font: "14px font-size",
            fill: new Fill({
              color: "blue",
            }),
            offsetY: 10, //文字偏移量
          }),
        });
      } else if (info.status == 3) {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/tboxdown.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
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
            src: "../../../static/tbox.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
            font: "14px font-size",
            fill: new Fill({
              color: "blue",
            }),
            offsetY: 10, //文字偏移量
          }),
        });
      }
      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
    },

    // 3D
    addAsset(groupID, info) {
      var that = this;
      var coord = {
        x: info.x,
        y: info.y,
      };
      var info = {
        x: info.x,
        y: info.y,
        username: info.username,
        projectid: info.projectid,
        gpstime: info.gpstime,
        deveui: info.deveui,
        devtype: info.devtype,
        type: info.type ? info.type : "",
        level: info.newground,
      };

      that.layer = new fengmap.FMCompositeMarker({
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
            text: info.username,
          },
        },
        x: coord.x,
        y: coord.y,
        image: {
          url: "../../../static/beacon1.png",
          size: [100, 100],
        },
        height: 2 / that.scale,
        collision: false,
        anchor: {
          baseon: "image",
          anchor: fengmap.FMMarkerAnchor.CENTER,
        },
      });
      this.layer.selfAttr = info;
      if (this.showAllGround) {
        var group = this.map3d.getFloor(info.newground);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      } else {
        var level = this.map3d.getLevel();
        var group = this.map3d.getFloor(level);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      }
    },

    // 3D
    addTBox(groupID, info) {
      var that = this;
      var coord = {
        x: info.x,
        y: info.y,
      };
      var info = {
        x: info.x,
        y: info.y,
        username: info.username,
        projectid: info.projectid,
        gpstime: info.gpstime,
        deveui: info.deveui,
        devtype: info.devtype,
        type: info.type ? info.type : "",
        level: info.newground,
      };
      let imgsrc;
      if (this.sostype) {
        imgsrc = "../../../static/tboxsos.png";
      } else if (info.status == 3) {
        imgsrc = "../../../static/tboxdown.png";
      } else {
        imgsrc = "../../../static/tbox.png";
      }
      that.layer = new fengmap.FMCompositeMarker({
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
            text: info.username,
          },
        },
        x: coord.x,
        y: coord.y,
        height: 2 / that.scale,
        collision: false,
        anchor: {
          baseon: "image",
          anchor: fengmap.FMMarkerAnchor.CENTER,
        },
        //设置图片路径
        image: {
          url: imgsrc,
          size: [100, 100],
        },
      });
      this.layer.selfAttr = info;
      if (this.showAllGround) {
        var group = this.map3d.getFloor(info.newground);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      } else {
        var level = this.map3d.getLevel();
        var group = this.map3d.getFloor(level);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      }
    },

    clearBtn() {
      this.buildingId = "";
      this.warningBuildingId = "";
      this.warningGround = "";
      this.homeGround = "";
      this.searchLists = {};
      this.perDeveui = "";
      this.assetDeveui = "";
      this.tboxDeveui = "";

      if (this.websock) {
        this.websock.close(); //断开websocket
      }
      this.searchList = {
        deveui: "",
        projectid: this.$store.state.projectid,
        devtype: "",
      };
      this.$route.query.deveui = "";
      this.$route.query.assetDeveui = "";
      this.getBuildingByProjectids();
      this.getMemberNames();
      this.getAssetNames();
    },

    // 定时删除
    delTimeOut() {
      var that = this;
      if (this.time == 0) return;
      let timeNow = Date.parse(new Date()).toString(); //获取到毫秒的时间戳，精确到毫秒
      timeNow = timeNow.substr(0, 10) - this.time; //精确到秒
      if (this.map3d) {
        that.layerList.forEach((item) => {
          if (item.selfAttr.gpstime < timeNow) {
            item.remove();
          }
        });
      } else {
        let LayerArrays = this.map.getLayers().getArray();
        for (let i = 1; i < LayerArrays.length; i++) {
          if (
            LayerArrays[i].getSource().getFeatures()[0].values_.gpstime <
            timeNow
          ) {
            LayerArrays[i]
              .getSource()
              .getFeatures()
              .forEach(function (feature) {
                LayerArrays[i].getSource().removeFeature(feature);
              });
            that.map.removeLayer(LayerArrays[i]);
          }
        }
      }
    },
    //删除
    delFeature(e) {
      let LayerArrays = this.map.getLayers().getArray();
      for (let i = 1; i < LayerArrays.length; i++) {
        if (
          e.deveui == LayerArrays[i].getSource().getFeatures()[0].values_.deveui
        ) {
          LayerArrays[i]
            .getSource()
            .getFeatures()
            .forEach(function (feature) {
              LayerArrays[i].getSource().removeFeature(feature);
            });
          this.map.removeLayer(LayerArrays[i]);
        }
      }
    },

    // 删除3D
    delIcon(e) {
      this.layerList.forEach((item, index) => {
        if (item.selfAttr.deveui == e.deveui) {
          item.remove();
          return this.layerList.splice(index, 1);
        }
      });
    },

    mapInit(x, y, maxX, maxY, mapInfo) {
      document.oncontextmenu = function (e) {
        return false;
      };
      if (this.map) {
        this.map.setTarget("sss");
      }
      if (this.map3d) {
        this.map3d.dispose();
        this.map3d = null;
      }
      var that = this;
      that.AllSource = new OlSourceVector();
      that.AllLayer = new OlLayerVector({
        source: that.AllSource,
      });
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      setTimeout(() => {
        let xx, yy;
        if (x > maxX - 1 && y > maxY - 1) {
          xx = maxX;
          yy = maxY;
        } else if (x > maxX - 1 && y < maxY - 1) {
          xx = maxX;
          yy = y;
        } else if (x < maxX && y > maxY - 1) {
          yy = maxY;
          xx = x;
        } else if (x < maxX && y < maxY) {
          xx = x;
          yy = y;
        }
        this.$refs.map.style.width = "100%";
        this.$refs.map.style.height = "100%";
        this.map = new Map({
          //加载控件到地图容器中
          controls: defaultControls({
            zoom: false,
          }),
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
            zoom: 2,
            maxZoom: 6,
          }),
        });

        that.map.addLayer(that.AllLayer);
        that.AllFeatures = {};
        this.featureMap = { person: {}, asset: {}, tbox: {} };

        this.sourceMap = {
          person: new OlSourceVector(),
          asset: new OlSourceVector(),
          tbox: new OlSourceVector(),
        };

        this.layerMap = {
          person: new OlLayerVector({ source: this.sourceMap.person }),
          asset: new OlLayerVector({ source: this.sourceMap.asset }),
          tbox: new OlLayerVector({ source: this.sourceMap.tbox }),
        };

        this.map.addLayer(this.layerMap.person);
        this.map.addLayer(this.layerMap.asset);
        this.map.addLayer(this.layerMap.tbox);

        if (mapInfo && this.searchLists.perDeveui) {
          // this.addIconMarker(this.map, mapInfo);
          this.addOrUpdateFeature("person", mapInfo);
        } else if (mapInfo && this.searchLists.assetDeveui) {
          // this.addIconAsset(this.map, mapInfo);
          this.addOrUpdateFeature("asset", mapInfo);
        } else if (mapInfo && this.searchLists.tboxDeveui) {
          // this.addIconTBox(this.map, mapInfo);
          this.addOrUpdateFeature("tbox", mapInfo);
        }
        this.userMapMouse(this.map);
        this.mapClick();
        this.getData();
        this.loading.close();
      }, 0);
    },
    handlePushData(devicePathList) {
      devicePathList.forEach((device) => {
        const { type, deveui, pathData, info } = device;
        const coordList = pathData.map((p) => [p.x, p.y]);

        if (!coordList || coordList.length < 1) return;

        if (!this.featureMap[type]) this.featureMap[type] = {};
        const feature = this.featureMap[type][deveui];

        if (!feature) {
          console.log("第一次");
          // 第一次出现：创建 Feature，用第一个点初始化
          // const initCoord = coordList[0];
          // const newFeature = new OlFeature({
          //   geometry: new OlGeomPoint(initCoord),
          //   deveui,
          // });

          // newFeature.setStyle(this.getFeatureStyle(type, pathData[0]));

          // if (!this.sourceMap[type])
          //   this.sourceMap[type] = new OlSourceVector();
          // this.sourceMap[type].addFeature(newFeature);
          // this.featureMap[type][deveui] = newFeature;
          // 第一次：使用 info 创建 Feature，定位到 pathData[0]
          const initInfo = Object.assign({}, info, pathData[0]); // 用第一帧位置更新 info
          this.addOrUpdateFeature(type, initInfo);

          if (coordList.length > 1) {
            const restPath = coordList.slice(1);
            const newFeature = this.featureMap[type][deveui];
            this.moveAlongPath(type, deveui, newFeature, restPath, 3000);
          }

          // 如果还有后续路径点，执行动画（注意去掉第一个点）
          if (coordList.length > 1) {
            const restPath = coordList.slice(1);
            const newFeature = this.featureMap[type][deveui];
            this.moveAlongPath(type, deveui, newFeature, restPath, 3000);
          }
        } else {
          // 已存在：直接动画
          if (coordList.length > 1) {
            this.moveAlongPath(type, deveui, feature, coordList, 3000);
          }
        }
      });
    },
    moveAlongPath(type, deveui, feature, coordList, totalDuration = 3000) {
      console.log(type);
      console.log(deveui);
      console.log(feature);
      console.log(coordList);
      console.log(totalDuration);
      if (!coordList || coordList.length < 2) return;

      const geom = feature.getGeometry();
      const steps = coordList.length - 1;
      const stepDuration = totalDuration / steps;
      let currentStep = 0;

      // 初始化 moveTimers[type]
      if (!this.moveTimers[type]) {
        this.moveTimers[type] = {};
      }

      // 停止之前的动画（如有）
      if (this.moveTimers[type][deveui]) {
        cancelAnimationFrame(this.moveTimers[type][deveui]);
        this.moveTimers[type][deveui] = null;
      }

      const moveToNext = () => {
        if (currentStep >= steps) return;

        const start = coordList[currentStep];
        const end = coordList[currentStep + 1];
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const fraction = Math.min(elapsed / stepDuration, 1);
          const current = [
            start[0] + (end[0] - start[0]) * fraction,
            start[1] + (end[1] - start[1]) * fraction,
          ];
          geom.setCoordinates(current);

          if (fraction < 1) {
            this.moveTimers[type][deveui] = requestAnimationFrame(animate);
          } else {
            currentStep++;
            moveToNext();
          }
        };

        animate();
      };

      moveToNext();
    },
    addOrUpdateFeature(type, info) {
      const source = this.sourceMap[type];
      const featureMap = this.featureMap[type];

      const id = info.deveui;
      const coord = [info.x, info.y];

      let feature = featureMap[id];
      console.log("feature", feature);

      if (!feature) {
        feature = new OlFeature({
          geometry: new OlGeomPoint(coord),
          // ...info,
          x: info.x,
          y: info.y,
          username: info.username,
          projectid: info.projectid,
          gpstime: info.gpstime,
          deveui: info.deveui,
          devtype: info.devtype,
          battery: info.battery,
        });

        feature.setStyle(this.getFeatureStyle(type, info));
        source.addFeature(feature);
        featureMap[id] = feature;
        console.log("feature11", featureMap);
        console.log("feature22", this.featureMap);
      } else {
        this.animateMoveFeature(feature, coord);
        // 可更新属性和样式
        feature.set("gpstime", info.gpstime);
        feature.set("battery", info.battery);
        feature.set("username", info.username);
        feature.setStyle(this.getFeatureStyle(type, info)); // 状态改变重新设 style
      }
    },
    animateMoveFeature(feature, endCoord) {
      const geom = feature.getGeometry();
      const startCoord = geom.getCoordinates();
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const fraction = Math.min(elapsed / duration, 1);
        const current = [
          startCoord[0] + (endCoord[0] - startCoord[0]) * fraction,
          startCoord[1] + (endCoord[1] - startCoord[1]) * fraction,
        ];
        geom.setCoordinates(current);
        if (fraction < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    },
    getFeatureStyle(type, info) {
      let src = "";

      if (type === "person") {
        if (info.status === 3) {
          src = "../../../static/user1down.png";
        } else if (info.colour) {
          // 说明：图片地址改为从环境变量读取基础地址
          src = `${process.env.VUE_APP_ASSET_BASE}/image/${info.colour}.png`;
        } else {
          src = "../../../static/user1.png";
        }
      } else if (type === "asset") {
        src = "../../../static/beacon1.png";
      } else if (type === "tbox") {
        if (this.sostype) {
          src = "../../../static/tboxsos.png";
        } else if (info.status === 3) {
          src = "../../../static/tboxdown.png";
        } else {
          src = "../../../static/tbox.png";
        }
      }

      return new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: src,
          scale: 1,
        }),
        text: new Text({
          text: info.username,
          font: "14px sans-serif",
          fill: new Fill({ color: "blue" }),
          offsetY: 10,
        }),
      });
    },

    //鼠标经过图标改变鼠标样式
    userMapMouse(map) {
      var that = this;
      map.on("pointermove", function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        if (feature) {
          if (feature.values_.x != "" || feature.values_.x != null) {
            map.getTargetElement().style.cursor = "pointer";
          }
        } else {
          map.getTargetElement().style.cursor = "default";
        }
      });
    },

    //地图上的点击事件
    mapClick() {
      var that = this;
      this.map.on("click", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );

        that.battery = "";
        if (feature) {
          if (feature.values_.type == 2) return;
          if (feature.values_.deveui) {
            if (feature.values_.devtype == 1 || feature.values_.devtype == 2) {
              let data = {
                maplabel: feature.values_.deveui,
              };
              //单击获取需要显示的内容
              getMemberInformation(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.battery = feature.values_.battery;
                  that.age = that.ages(res.data.member.birthday);
                  that.depart = res.data.member.depart;
                  that.cardno = res.data.member.cardno;
                  that.maplabel = res.data.member.maplabel;
                  that.sexstr =
                    that.i8n == "zh"
                      ? res.data.member.sexstr
                      : res.data.member.ensex;
                  that.tel = res.data.member.tel;
                  that.worktype = res.data.member.worktype;
                  that.username = res.data.member.username;
                  that.gpstime = that.formatDate(feature.values_.gpstime);
                  that.imagePer = res.data.member.filename
                    ? host.host + "profile/" + res.data.member.filename
                    : res.data.member.sex == "1"
                    ? "../../../static/male.png"
                    : res.data.member.sex == "2"
                    ? "../../../static/female.png"
                    : "../../../static/nosex.png";
                  if (res.data.devHealth == null) {
                    that.bracelet_eui = "";
                    that.bracelet_soc = "";
                    that.bracelet_rate = "";
                    that.bracelet_tem = "";
                    that.bracelet_oxygen = "";
                    that.bracelet_time = "";
                    that.showBracelet = false;
                  } else {
                    that.bracelet_eui = res.data.devHealth.wristEui;
                    that.bracelet_soc = res.data.devHealth.soc;
                    that.bracelet_rate = res.data.devHealth.heartrate;
                    that.bracelet_tem = res.data.devHealth.tem;
                    that.bracelet_oxygen = res.data.devHealth.oxygen;
                    that.bracelet_time = that.formatDate(
                      res.data.devHealth.dataTime
                    );

                    that.showBracelet = true;
                  }

                  that.devPer = true;
                  that.devAsset = false;
                  that.devTBox = false;

                  that.visible = true;
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  return;
                }
              });
            } else if (feature.values_.devtype == 3) {
              let data = {
                beaconid: feature.values_.deveui,
              };
              getAssetOne(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.assetName = res.data.name;
                  that.assetType = res.data.type;
                  that.assetModel = res.data.model;
                  that.assetBeaconid = res.data.beaconid;
                  that.assetDepart = res.data.depart;
                  that.assetUser = res.data.username;
                  that.assetTime = that.formatDate(feature.values_.gpstime);
                  that.imageAsset = res.data.filename
                    ? host.host + "profile/" + res.data.filename
                    : "";

                  that.devPer = false;
                  that.showBracelet = false;
                  that.devAsset = true;
                  that.devTBox = false;
                  that.visible = true;
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  return;
                }
              });
            } else {
              let data = {
                maplabel: feature.values_.deveui,
              };
              getTboxOne(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.battery = feature.values_.battery;
                  that.tboxName = res.data.sn;
                  that.tboxType = res.data.type;
                  that.tboxMaplabel = res.data.maplabel;
                  that.tboxTime = that.formatDate(feature.values_.gpstime);
                  that.imageTBox = res.data.filename
                    ? host.host + "profile/" + res.data.filename
                    : "";

                  that.devPer = false;
                  that.showBracelet = false;
                  that.devAsset = false;
                  that.devTBox = true;
                  that.visible = true;
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  return;
                }
              });
            }
          }
        }
      });
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
    //转换时间
    formatDate(time) {
      if (time == null) {
        return "";
      }
      let date = new Date(parseInt(time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    //在地图上加载人
    addIconMarkers(map, info) {
      var that = this;
      var startMarker = new OlFeature({
        x: info.x,
        y: info.y,
        username: info.username,
        deveui: info.deveui,
        projectid: info.projectid,
        gpstime: info.gpstime,
        devtype: 1,
        battery: info.battery ? info.battery : "",
        geometry: new OlGeomPoint([info.x, info.y]),
      });
      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style;
      if (info.status == 3) {
        style = new OlStyleStyle({
          image: new OlStyleIcon({
            anchor: [0.5, 1],
            src: "../../../static/user1down.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
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
            // 说明：图片地址改为从环境变量读取基础地址
            src: info.colour
              ? process.env.VUE_APP_ASSET_BASE + "/image/" + info.colour + ".png"
              : "../../../static/user1.png",
            scale: 1,
          }),
          //设置图片下面显示的字体样式和内容
          text: new Text({
            text: info.username,
            font: "14px font-size",
            fill: new Fill({
              color: "blue",
            }),
            offsetY: 10, //文字偏移量
          }),
        });
      }

      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
    },

    // 在3D地图上加载人
    addMarkers(mapinfo, groupID) {
      var that = this;
      var coord = {
        x: mapinfo.x,
        y: mapinfo.y,
      };
      var info = {
        x: mapinfo.x,
        y: mapinfo.y,
        username: mapinfo.username,
        deveui: mapinfo.deveui,
        projectid: mapinfo.projectid,
        gpstime: mapinfo.gpstime,
        devtype: 1,
        level: mapinfo.newground,
      };
      let imgsrc;
      if (this.sostype) {
        imgsrc = "../../../static/usersos.png";
      } else if (mapinfo.status == 3) {
        imgsrc = "../../../static/user1down.png";
      } else {
        switch (mapinfo.colour) {
          case 1:
            imgsrc = "../../../static/1.png";
            break;
          case 2:
            imgsrc = "../../../static/2.png";
            break;
          case 3:
            imgsrc = "../../../static/3.png";
            break;
          case 4:
            imgsrc = "../../../static/4.png";
            break;
          case 5:
            imgsrc = "../../../static/5.png";
            break;
          case 6:
            imgsrc = "../../../static/6.png";
            break;
          case 7:
            imgsrc = "../../../static/7.png";
            break;
          case 8:
            imgsrc = "../../../static/8.png";
            break;
          case 9:
            imgsrc = "../../../static/9.png";
            break;
          case 10:
            imgsrc = "../../../static/10.png";
            break;
          default:
            imgsrc = "../../../static/user1.png";
            break;
        }
      }
      that.layer = new fengmap.FMCompositeMarker({
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
            text: info.username,
          },
        },
        x: coord.x,
        y: coord.y,
        height: 1.7 / that.scale,
        collision: false,
        anchor: {
          baseon: "image",
          anchor: fengmap.FMMarkerAnchor.CENTER,
        },
        //设置图片路径
        image: {
          url: imgsrc,
          size: [100, 100],
        },
      });
      this.layer.selfAttr = info;
      if (this.showAllGround) {
        var group = this.map3d.getFloor(mapinfo.newground);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      } else {
        var level = this.map3d.getLevel();
        var group = this.map3d.getFloor(level);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      }
    },

    //在地图上加资产
    addIconAssets(map, info) {
      var that = this;
      var startMarker = new OlFeature({
        x: info.x,
        y: info.y,
        username: info.username,
        projectid: info.projectid,
        gpstime: info.gpstime,
        deveui: info.deveui,
        devtype: 3,
        battery: info.battery ? info.battery : "",
        geometry: new OlGeomPoint([info.x, info.y]),
      });
      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style = new OlStyleStyle({
        image: new OlStyleIcon({
          anchor: [0.5, 1],
          src: "../../../static/beacon1.png",
          scale: 1,
        }),
        //设置图片下面显示的字体样式和内容
        text: new Text({
          text: info.username,
          font: "14px font-size",
          fill: new Fill({
            color: "blue",
          }),
          offsetY: 10, //文字偏移量
        }),
      });
      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
    },

    // 在3D地图上加载资产
    addAssets(mapinfo, groupID) {
      var that = this;
      var coord = {
        x: mapinfo.x,
        y: mapinfo.y,
      };
      var info = {
        x: mapinfo.x,
        y: mapinfo.y,
        username: mapinfo.username,
        projectid: mapinfo.projectid,
        gpstime: mapinfo.gpstime,
        deveui: mapinfo.deveui,
        devtype: 3,
        level: mapinfo.newground,
      };

      that.layer = new fengmap.FMCompositeMarker({
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
            text: mapinfo.username,
          },
        },
        x: coord.x,
        y: coord.y,
        image: {
          url: "../../../static/beacon1.png",
          size: [100, 100],
        },
        height: 2 / that.scale,
        collision: false,
        anchor: {
          baseon: "image",
          anchor: fengmap.FMMarkerAnchor.CENTER,
        },
      });

      this.layer.selfAttr = info;
      if (this.showAllGround) {
        var group = this.map3d.getFloor(mapinfo.newground);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      } else {
        var level = this.map3d.getLevel();
        var group = this.map3d.getFloor(level);
        this.layer.addTo(group);
        this.layerList.push(this.layer);
      }
    },

    //获取楼栋
    getBuildingByProjectids() {
      var that = this;
      let data = {
        tenantid: this.$store.state.intoProjectTenantid,
        projectid: this.$store.state.intoProjectid,
      };
      getBuildingByProjectid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.buildings = res.data;
          if (that.$route.query.deveui) return;
          if (that.$route.query.assetDeveui) return;
          if (that.buildingId && that.homeGround) {
            // 判断首页点击最多楼层跳转过来
            var found = that.buildings.find(function (item) {
              return item.id == that.buildingId;
            });
            //筛选首页点击的对应的楼栋，判断采用2D还是3D地图
            if (found.buildtypestr == "2D") {
              that.mapTypes = true;
              that.getGroundLists(that.buildingId, that.homeGround);
            } else if (found.buildtypestr == "3D") {
              that.showAllGround = found.flag;
              that.mapTypes = false;
              that.getMapid(found.id);
              that.getGroundLists3D(that.buildingId, that.homeGround);
            }
          } else if (that.buildingId) {
            //判断是否为首页点击地图跳转过来
            var found = that.buildings.find(function (item) {
              return item.id == that.buildingId;
            });
            //筛选首页点击的对应的楼栋，判断采用2D还是3D地图
            if (found.buildtypestr == "2D") {
              that.mapTypes = true;
              that.getGroundLists(that.buildingId);
            } else if (found.buildtypestr == "3D") {
              that.showAllGround = found.flag;
              that.mapTypes = false;
              that.getMapid(found.id);
              that.getGroundLists3D(that.buildingId);
            }
          } else if (that.warningBuildingId && that.warningGround) {
            // 判断是否为告警信息（人员聚集）页面跳转
            var found = that.buildings.find(function (item) {
              return item.id == that.warningBuildingId;
            });
            //筛选对应的楼栋，判断采用2D还是3D地图
            if (found.buildtypestr == "2D") {
              that.mapTypes = true;
              that.getGroundLists(that.warningBuildingId, that.warningGround);
            } else if (found.buildtypestr == "3D") {
              that.showAllGround = found.flag;
              that.mapTypes = false;
              that.getMapid(found.id);
              that.getGroundLists3D(that.warningBuildingId, that.warningGround);
            }
          } else if (
            this.$route.query.deveui ||
            this.$route.query.assetDeveui ||
            this.$route.query.tboxDeveui
          ) {
            return;
          } else {
            // 默认选择第一栋楼,判断采用2D还是3D地图
            if (that.buildings[0].buildtypestr == "2D") {
              that.mapTypes = true;
              that.getGroundLists(that.buildings[0].id);
            } else if (that.buildings[0].buildtypestr == "3D") {
              that.showAllGround = that.buildings[0].flag;
              that.mapTypes = false;
              that.getMapid(that.buildings[0].id);
              that.getGroundLists3D(that.buildings[0].id);
            }
          }
        }
      });
    },

    // 点击楼栋，判断楼栋是2D还是3D
    getGrounds(val) {
      var that = this;
      var found = this.buildings.find(function (item) {
        return item.id == val;
      });
      if (found.buildtypestr == "2D") {
        if (that.map) {
          that.map.setTarget("sss");
        }
        if (that.map3d) {
          that.map3d.dispose();
          that.map3d = null;
        }
        this.mapTypes = true;
        this.getGroundLists(val);
      } else if (found.buildtypestr == "3D") {
        if (that.map) {
          that.map.setTarget("sss");
        }
        if (that.map3d) {
          that.map3d.dispose();
          that.map3d = null;
        }

        this.showAllGround = found.flag;
        this.mapTypes = false;
        that.getMapid(found.id);
        this.getGroundLists3D(val, "", found);
      }
    },
    //获取楼层
    getGroundLists(val, ground) {
      if (this.websockNum != 0) {
        this.websock.close();
      }
      var that = this;
      this.isactive = val;
      let data = {
        buildid: val,
      };
      getGroundList(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          //没有楼层数据 置空楼层人数列表
          if (res.data.length == 0) {
            that.groundData = [];
          }
          that.grounds = res.data.reverse();
          that.building = val;
          if (ground) {
            that.getBuildGroundLists(ground);
          } else {
            that.getBuildGroundLists(res.data[res.data.length - 1]);
          }
        }
      });
    },
    //获取楼层3D
    getGroundLists3D(val, ground, found) {
      var that = this;
      if (this.websockNum != 0) {
        this.websock.close();
      }
      var that = this;
      this.isactive = val;
      if (that.websock) {
        that.websock.close(); //断开websocket
      }
      let data = {
        buildid: val,
      };
      getGround(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
        (res) => {
          if (res.code == 1001) {
            for (let i = 0; i < res.data.length; i++) {
              let groundinfo = {
                groundid: res.data[i].id,
                ground: res.data[i].ground,
                newground: i + 1,
              };
              that.groundListCopy.push(groundinfo);
            }
            that.scale = res.data[0].scale;
            if (that.showAllGround) {
              // 显示全部楼层时
              if (that.map3d) {
                that.map3d.dispose();
                that.map3d = null;
              }
              if (that.$route.query.deveui) {
                that.perDeveui = "";
              }
              if (that.$route.query.assetDeveui) {
                that.assetDeveui = "";
              }
              if (that.websockNum != 0) {
                that.websock.close();
              }

              that.building = val;
              that.fmapId = res.data[0].filename;
              that.themeId = res.data[0].filetype;
              that.loadingFun();
              that.onmap(
                that.$store.state.intoProjectid,
                "",
                "",
                res.data[0].appname,
                res.data[0].mapkey,
                that.groundListCopy
              );
              that.wsuri = host.ws + "map/build_" + val;

              that.initWebsocket();
            } else {
              getGroundList(
                data,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.grounds = res.data.reverse();
                  that.building = val;
                  if (ground) {
                    that.getBuildGroundLists3D(ground);
                  } else {
                    that.getBuildGroundLists3D(that.groundListCopy[0].ground);
                  }
                }
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

    //获取楼层详情3D
    getBuildGroundLists3D(val) {
      this.ground = val;
      if (this.map3d) {
        this.map3d.dispose();
        this.map3d = null;
      }
      if (this.$route.query.deveui) {
        this.perDeveui = "";
      }
      if (this.$route.query.assetDeveui) {
        this.assetDeveui = "";
      }
      if (this.websockNum != 0) {
        this.websock.close();
      }
      this.tableData = [
        {
          id: "-1",
          name: this.$t("LocationIndoor.Totalnumber"),
          num: "0",
        },
        {
          id: "-2",
          name: this.$t("LocationIndoor.Totalassets"),
          num: "0",
        },
        {
          id: "-3",
          name: this.$t("LocationIndoor.Totalvehicle"),
          num: "0",
        },
        {
          id: "-4",
          name: this.$t("LocationIndoor.Jobs1"),
          num: "0",
          children: [],
        },
        {
          id: "-5",
          name: this.$t("LocationIndoor.department"),
          num: "0",
          children: [],
        },
        {
          id: "-6",
          name: this.$t("LocationIndoor.assets1"),
          num: "0",
          children: [],
        },
      ];
      if (val) {
        this.isactiveGround = val;
        var that = this;
        let data = {
          projectid: this.intoProjectid,
          buildid: this.building,
          ground: val,
        };
        getBuildGroundList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (res.data.list.length > 0) {
              that.groundid = res.data.list[0].id;
              that.fmapId = res.data.list[0].filename;
              that.themeId = res.data.list[0].filetype;
              that.wsuri = host.ws + "map/" + that.groundid;
              that.scale = res.data.list[0].scale;
              if (that.websockNum != 0) {
                that.websock.close();
              }
              setTimeout(() => {
                let focusGroupID = that.groundListCopy.find(function (item) {
                  return item.ground == val;
                });
                that.loadingFun();
                that.onmap(
                  that.$store.state.intoProjectid,
                  focusGroupID.newground,
                  "",
                  res.data.list[0].appname,
                  res.data.list[0].mapkey,
                  that.groundListCopy
                );
                that.initWebsocket();
              }, 1);
            }
          }
        });
      }
    },
    //加载3D地图
    onmap(projectid, groundVal, mapInfo, appname, mapkey, groundList) {
      var that = this;
      if (this.dataTimer) {
        clearInterval(this.dataTimer);
        this.dataTimer = null;
      }
      that.isDepartmentData = false;
      that.isRoleData = false;
      that.isSosData = false;
      that.isAllData = false;
      document.oncontextmenu = function (e) {
        return false;
      };
      if (this.map) {
        this.map.setTarget("sss");
      }
      let ground;
      if (groundVal) {
        ground = groundVal;
      } else {
        ground = 1;
      }
      this.groundVals = ground;
      var that = this;
      let newGroundList = [];
      groundList.forEach((item) => {
        newGroundList.push(item.newground);
      });
      var mapOpation = {
        container: document.getElementById("fengMap"),
        level: ground,
        visibleLevels: that.showAllGround ? newGroundList : [ground],
        appName: appname,
        key: mapkey,
        mapID: that.fmapId,
        themeID: that.themeId,
        highlightPicker: ["hover"],
        floorSpace: 5,
        zoomRange: [1, 25],
        buildingOptions: {
          level: ground,
          floorSpace: 5,
        },
      };
      this.map3d = new fengmap.FMMap(mapOpation);
      this.map3d.on("loaded", function () {
        console.log("地图加载完成");
        if (that.showAllGround) {
          let bound = that.map3d.getBound();
          that.map3d.setFitView(bound);
        } else {
          let bound = that.map3d.getFloor(1).getBound();
          that.map3d.setFitView(bound);
        }
        that.loading.close();
        that.loadScrollFloorCtrl();
        if (projectid) {
          that.getData();
          // 刚进入页面以及刷新的时候会调用接口查询最后一次的位置信息

          if (that.intoProjectType == 1) {
            //正向项目
            that.getDevGpsLocation3D(that.groundid, that.map3d.getLevel());
          } else if (that.intoProjectType == 2) {
            //反向项目
            that.getBeaconGpss3D(that.groundid, that.map3d.getLevel());
          }
        }

        // 搜索的时候会调用
        that.groundListCopy.forEach((item) => {
          if (item.ground == mapInfo.ground) {
            mapInfo.newground = item.newground;
          }
        });
        if (mapInfo && that.searchLists.perDeveui) {
          that.addMarker(groundVal, mapInfo);
        } else if (mapInfo && that.searchLists.assetDeveui) {
          that.addAsset(groundVal, mapInfo);
        } else if (mapInfo && that.searchLists.tboxDeveui) {
          that.addTBox(groundVal, mapInfo);
        }
      });

      // 聚焦楼层改变事件
      this.map3d.on("levelChanged", function (event) {
        if (that.showAllGround) return;
        if (that.websockNum != 0) {
          that.websock.close();
        }
        that.layerList.forEach((item) => {
          item.remove();
        });

        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        that.groundVals = focusGroupID.ground;

        let bound = that.map3d.getFloor(focusGroupID.newground).getBound();
        that.map3d.setFitView(bound, {
          animate: true,
          finish: function () {
            that.getBuildGroundListsAll(that.groundVals, that.building);
            that.getData();
          },
        });
      });

      // 鼠标左键单击事件
      this.map3d.on("click", function (event) {
        // if (event.nodeType == 31) {
        //event.nodeType=31表示图片标注
        if (event.targets[0].type == "64" || event.targets[0].type == "8") {
          // 64: "TEXT_MARKER",
          //   8: "IMAGE_MARKER",
          that.setNewMarker = false;
          if (event.mouseEvent.button == 0) {
            //左键点击
            that.addPopInfoWindowLeft(event.targets[0]);
          }
        }
      });
    },

    // loading状态
    loadingFun() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)",
      });
    },

    // 3D地图鼠标左键单击信息框
    addPopInfoWindowLeft(marker) {
      var that = this;
      if (marker.selfAttr.type == 2) return;
      if (marker.selfAttr.devtype == 1 || marker.selfAttr.devtype == 2) {
        let data = {
          maplabel: marker.selfAttr.deveui,
        };
        //单击获取需要显示的内容
        getMemberInformation(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.age = that.ages(res.data.member.birthday);
            that.depart = res.data.member.depart;
            that.cardno = res.data.member.cardno;
            that.maplabel = res.data.member.maplabel;
            that.sexstr =
              that.i8n == "zh" ? res.data.member.sexstr : res.data.member.ensex;
            that.tel = res.data.member.tel;
            that.worktype = res.data.member.worktype;
            that.username = res.data.member.username;
            that.gpstime = that.formatDate(marker.selfAttr.gpstime);
            that.imagePer = res.data.member.filename
              ? host.host + "profile/" + res.data.member.filename
              : res.data.member.sex == "1"
              ? "../../../static/male.png"
              : res.data.member.sex == "2"
              ? "../../../static/female.png"
              : "../../../static/nosex.png";
            if (res.data.devHealth == null) {
              that.bracelet_eui = "";
              that.bracelet_soc = "";
              that.bracelet_rate = "";
              that.bracelet_tem = "";
              that.bracelet_oxygen = "";
              that.bracelet_time = "";
              that.showBracelet = false;
            } else {
              that.bracelet_eui = res.data.devHealth.wristEui;
              that.bracelet_soc = res.data.devHealth.soc;
              that.bracelet_rate = res.data.devHealth.heartrate;
              that.bracelet_tem = res.data.devHealth.tem;
              that.bracelet_oxygen = res.data.devHealth.oxygen;
              that.bracelet_time = that.formatDate(res.data.devHealth.dataTime);

              that.showBracelet = true;
            }
            that.devPer = true;
            that.devAsset = false;
            that.devTBox = false;
            that.visible = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            return;
          }
        });
      } else if (marker.selfAttr.devtype == 3) {
        let data = {
          beaconid: marker.selfAttr.deveui,
        };
        getAssetOne(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.assetName = res.data.name;
            that.assetType = res.data.type;
            that.assetModel = res.data.model;
            that.assetBeaconid = res.data.beaconid;
            that.assetDepart = res.data.depart;
            that.assetUser = res.data.username;
            that.assetTime = that.formatDate(marker.selfAttr.gpstime);
            that.imageAsset = res.data.filename
              ? host.host + "profile/" + res.data.filename
              : "";

            that.devPer = false;
            that.showBracelet = false;
            that.devAsset = true;
            that.devTBox = false;
            that.visible = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
            return;
          }
        });
      } else {
        let data = {
          maplabel: marker.selfAttr.deveui,
        };
        getTboxOne(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.battery = feature.values_.battery;
              that.tboxName = res.data.sn;
              that.tboxType = res.data.type;
              that.tboxMaplabel = res.data.maplabel;
              that.tboxTime = that.formatDate(marker.selfAttr.gpstime);
              that.imageTBox = res.data.filename
                ? host.host + "profile/" + res.data.filename
                : "";

              that.devPer = false;
              that.showBracelet = false;
              that.devAsset = false;
              that.devTBox = true;
              that.visible = true;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              return;
            }
          }
        );
      }
    },

    //加载滚动楼层控制
    loadScrollFloorCtrl() {
      var scrollFloorCtlOpt = {
        floorButtonCount: 5,
        position: fengmap.FMControlPosition.RIGHT_TOP,
        needAllLayerBtn: false,
        viewModeControl: true,
        floorModeControl: true,
        offset: {
          x: -20,
          y: 20,
        },
      };
      this.scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt);
      this.scrollFloorControl.addTo(this.map3d);
    },

    //获取楼层详情
    getBuildGroundLists(val) {
      this.ground = val;
      if (this.$route.query.deveui) {
        this.perDeveui = "";
      }
      if (this.$route.query.assetDeveui) {
        this.assetDeveui = "";
      }
      if (this.websockNum != 0) {
        this.websock.close();
      }
      this.tableData = [
        {
          id: "-1",
          name: this.$t("LocationIndoor.Totalnumber"),
          num: "0",
        },
        {
          id: "-2",
          name: this.$t("LocationIndoor.Totalassets"),
          num: "0",
        },
        {
          id: "-3",
          name: this.$t("LocationIndoor.Totalvehicle"),
          num: "0",
        },
        {
          id: "-4",
          name: this.$t("LocationIndoor.Jobs1"),
          num: "0",
          children: [],
        },
        {
          id: "-5",
          name: this.$t("LocationIndoor.department"),
          num: "0",
          children: [],
        },
        {
          id: "-6",
          name: this.$t("LocationIndoor.assets1"),
          num: "0",
          children: [],
        },
      ];
      if (val) {
        this.isactiveGround = val;
        var that = this;
        let data = {
          projectid: this.intoProjectid,
          buildid: this.building,
          ground: val,
        };
        getBuildGroundList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (that.map) {
              that.map.setTarget("mapppppp");
            }
            if (res.data.list.length > 0) {
              const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
              that.imgUrl =
                base + "indoormap/" + res.data.list[0].filetype;
              that.groundid = res.data.list[0].id;
              that.loadingFun();
              that.mapInit(
                res.data.list[0].length,
                res.data.list[0].width,
                1200,
                800
              );
              that.wsuri = host.ws + "map/" + that.groundid;
              that.initWebsocket();
              if (that.intoProjectType == 1) {
                //正向项目
                that.getDevGpsLocation(that.groundid);
              } else if (that.intoProjectType == 2) {
                //反向项目
                that.getBeaconGpss(that.groundid, that.ground);
              }
              that.getGroundDevNums(that.groundid);
              if (that.timer) {
                clearInterval(that.timer);
                that.timer = null;
              }
              if (that.groundShow) {
                that.timer = setInterval(() => {
                  that.getGroundDevNums(that.groundid);
                }, 5000);
              }
              //切换楼层 取消时间筛选
              let a = [
                that.$t("LocationIndoor.personnel"),
                that.$t("LocationIndoor.assets"),
                that.$t("LocationIndoor.vehicle"),
              ];

              clearInterval(that.timeOut);
              that.timeOut = null;
              for (let index = 0; index < that.checkList.length; index++) {
                if (!a.includes(that.checkList[index])) {
                  that.checkList.splice(index, 1);
                  index--;
                }
              }
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          }
        });
      } else {
        if (this.map) {
          this.map.setTarget("mapppppp");
        }
      }
    },

    //获取最后一次位置信息,正向项目
    getDevGpsLocation(val) {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
        buildid: this.building,
        groundid: val,
        gpstype: 1,
        devtype: 0,
        time: this.time,
      };
      getLastDevGps(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.mapInfo = res.data;
          for (let i = 0; i < this.mapInfo.length; i++) {
            if (this.mapInfo[i].devtype === 4) {
              // that.addIconTBox(that.map, this.mapInfo[i]);
              that.addOrUpdateFeature("tbox", this.mapInfo[i]);
            }
            if (this.mapInfo[i].devtype === 1) {
              // that.addIconMarkers(that.map, this.mapInfo[i]);
              that.addOrUpdateFeature("person", this.mapInfo[i]);
            }
            if (this.mapInfo[i].devtype === 3) {
              // that.addIconAssets(that.map, this.mapInfo[i]);
              that.addOrUpdateFeature("asset", this.mapInfo[i]);
            }
          }
          that.hideLayers();
        }
      });
    },

    //获取最后一次位置信息,正向项目,3D
    getDevGpsLocation3D(val, groupID) {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
        buildid: this.building,
        groundid: this.showAllGround ? "" : val,
        gpstype: 1,
        devtype: 0,
        time: this.time,
      };
      getLastDevGps(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          let mapInfo = res.data;
          for (let i = 0; i < mapInfo.length; i++) {
            that.groundListCopy.forEach((item) => {
              if (item.ground == mapInfo[i].ground) {
                mapInfo[i].newground = item.newground;
              }
            });

            if (mapInfo[i].devtype === 4) {
              that.addTBox(groupID, mapInfo[i]);
            }
            if (mapInfo[i].devtype === 1) {
              that.addMarkers(mapInfo[i], groupID);
            }
            if (mapInfo[i].devtype === 3) {
              that.addAssets(mapInfo[i], groupID);
            }
          }
        }
      });
    },

    //获取最后一次位置信息,反向项目
    getBeaconGpss(val) {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
        buildid: this.building,
        groundid: val,
        gpstype: 1,
        devtype: 0,
        time: this.time,
      };
      getLastDevGps(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          let mapInfo = res.data;
          for (let i = 0; i < mapInfo.length; i++) {
            if (mapInfo[i].devtype === 4) {
              // that.addIconTBox(that.map, mapInfo[i]);
              that.addOrUpdateFeature("tbox", mapInfo[i]);
            }
            if (mapInfo[i].devtype === 2) {
              // that.addIconMarkers(that.map, mapInfo[i]);
              that.addOrUpdateFeature("person", that.mapInfo[i]);
            }
            if (mapInfo[i].devtype === 3) {
              // that.addIconAssets(that.map, mapInfo[i]);
              that.addOrUpdateFeature("asset", mapInfo[i]);
            }
          }
        }
      });
    },

    //获取最后一次位置信息,反向项目,3D
    getBeaconGpss3D(val, groupID) {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
        buildid: this.building,
        groundid: this.showAllGround ? "" : val,
        gpstype: 1,
        devtype: 0,
        time: this.time,
      };
      getLastDevGps(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          let mapInfo = res.data;

          for (let i = 0; i < mapInfo.length; i++) {
            that.groundListCopy.forEach((item) => {
              if (item.ground == mapInfo[i].ground) {
                mapInfo[i].newground = item.newground;
              }
            });
            if (mapInfo[i].devtype === 4) {
              that.addTBox(groupID, mapInfo[i]);
            }
            if (mapInfo[i].devtype === 1) {
              that.addMarkers(mapInfo[i], groupID);
            }
            if (mapInfo[i].devtype === 3) {
              that.addAssets(mapInfo[i], groupID);
            }
          }
        }
      });
    },
    getSummaries(param) {
      var that = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = that.$t("floormanagement.value3");
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += " ";
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
    },
    //地图右方显示当前楼层人数，不同角色的人数，不同部门的人数，不同类型的资产数
    getGroundDevNums(val) {
      this.groundInfoList1 = [];
      this.groundInfoList2 = [];
      this.groundInfoList3 = [];
      let time = Math.floor(new Date().getTime() / 1000);
      let data = {
        projectid: this.$store.state.projectid,
        buildid: this.building,
        groundid: val,
        gpstype: 1,
        devtype: 0,
        time: time,
      };
      var that = this;
      getCountNum(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            let allDev = 0,
              allTbox = 0,
              allAsset = 0;
            let list = res.data.groundlist;
            list.forEach((item) => {
              allDev += item.devnum;
              allTbox += item.tboxnum;
              allAsset += item.assetnum;
              if (item.ground > 0) {
                item.ground = "F" + item.ground;
              } else {
                item.ground = "B" + Math.abs(item.ground);
              }
            });
            that.groundData = list;
            that.groundData.reverse();

            that.tableData[0].num = res.data.devnum;
            that.tableData[1].num = res.data.assetnum;
            that.tableData[2].num = res.data.tboxnum;
            if (res.data.list) {
              let groundInfoList = res.data.list;
              let arr2 = [];
              let arr3 = [];
              let arr4 = [];
              if (groundInfoList.length > 0) {
                this.echartsInit(groundInfoList);
                for (let i = 0; i < groundInfoList.length; i++) {
                  switch (groundInfoList[i].type) {
                    case 1:
                      arr2.push(groundInfoList[i]);
                      that.tableData[3].children = arr2;
                      that.tableData[3].num = arr2.length;
                      break;
                    case 2:
                      arr3.push(groundInfoList[i]);
                      that.tableData[4].children = arr3;
                      that.tableData[4].num = arr3.length;
                      break;
                    case 3:
                      arr4.push(groundInfoList[i]);
                      that.tableData[5].children = arr4;
                      that.tableData[5].num = arr4.length;
                      break;
                    default:
                      break;
                  }
                }
              } else {
                that.tableData[2].num = 0;
                that.tableData[3].num = 0;
                that.tableData[4].num = 0;
              }
            } else {
              that.tableData[0].num = 0;
              that.tableData[1].num = 0;
              that.tableData[2].num = 0;
              that.tableData[3].num = 0;
              that.tableData[4].num = 0;
            }
            if (that.tableData[0].num > 0 || that.tableData[1].num > 0) {
              if (!that.showEcharts) {
                that.show_echart = "<";
              } else {
                that.show_echart = ">";
              }
            } else {
              that.show_echart = "<";
            }
          }
        }
      );
    },

    //获取姓名下拉框
    getMemberNames() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
      };
      getMemberNameId(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.userList = res.data.map((item) => {
            return {
              value: `${item.maplabel}`,
              maplabel: `${item.maplabel}`,
              username: `${item.username}`,
            };
          });
          for (let i = that.userList.length - 1; i > -1; i--) {
            if (
              that.userList[i].maplabel == "" ||
              that.userList[i].maplabel == null ||
              that.userList[i].maplabel == undefined
            ) {
              that.userList.splice(i, 1);
            }
          }
        }
      });
    },
    //资产下拉框
    getAssetNames() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
      };
      getAssetName(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.assetList = res.data.map((item) => {
              return {
                beaconid: `${item.beaconid}`,
                value: `${item.beaconid}`,
                name: `${item.name}`,
              };
            });
            for (let i = that.assetList.length - 1; i > -1; i--) {
              if (
                that.assetList[i].beaconid == "" ||
                that.assetList[i].beaconid == null ||
                that.assetList[i].beaconid == undefined
              ) {
                that.assetList.splice(i, 1);
              }
            }
          }
        }
      );
    },
    // 获取车辆下拉框
    getTboxSnIds() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid,
      };
      getTboxSnId(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.tboxList = res.data
              .filter((item) => {
                return item.maplabel;
              })
              .map((item) => {
                return {
                  value: `${item.maplabel}`,
                  maplabel: `${item.maplabel}`,
                  sn: `${item.sn}`,
                };
              });
          }
        }
      );
    },
    //获取楼栋下所有的楼层信息
    getBuildGroundListsAll(groundVals, buildid) {
      var that = this;
      let data = {
        projectid: this.intoProjectid,
        buildid: buildid,
      };
      getBuildGroundList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        var found = res.data.list.find(function (item) {
          return item.ground == groundVals;
        });
        that.groundid = found.id;
        that.wsuri = host.ws + "map/" + that.groundid;
        that.initWebsocket();

        that.getGroundDevNums(that.groundid);
        if (that.timer) {
          clearInterval(that.timer);
          that.timer = null;
        }
        if (that.groundShow) {
          that.timer = setInterval(() => {
            that.getGroundDevNums(that.groundid);
          }, 5000);
        }
        if (that.intoProjectType == 1) {
          //正向项目
          that.getDevGpsLocation3D(that.groundid, found.ground);
        } else if (that.intoProjectType == 2) {
          //反向项目
          that.getBeaconGpss3D(that.groundid, found.ground);
        }
      });
    },

    //websock
    initWebsocket() {
      this.websockNum = 1;
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持WebSocket");
        return false;
      }
      this.websock = new WebSocket(this.wsuri);
      this.websock.onopen = this.websocketopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketerror;
      this.websock.onclose = this.close;
    },
    initWebsocketOne() {
      this.websockNum = 1;
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持WebSocket");
        return false;
      }
      this.websock = new WebSocket(this.wsuri);
      this.websock.onopen = this.websocketopenOne;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketerror;
      this.websock.onclose = this.close;
    },
    websocketopenOne(e) {
      //打开
      console.log("室内单人定位WebSocket连接成功");
      // this.websocketSend(this.userName);
    },
    websocketopen(e) {
      //打开
      console.log("室内定位WebSocket连接成功");
      // this.websocketSend(this.userName);
    },
    //数据接收
    websocketonmessage(res) {
      // groundid
      var that = this;
      if (res.data != "连接成功") {
        let data = [];
        var datas = JSON.parse(res.data);
        if (Array.isArray(datas) == false) {
          data.push(datas);
        } else {
          data = datas;
        }
        let isEqual;
        if (data.length > 1) {
          isEqual = data.every((i) => i.deveui === data[0].deveui);
        } else {
          isEqual = false;
        }
        // 判断是不是UWB定位：数组中的deveui都相同
        if (isEqual) {
          console.log(11);
          let newData = [
            {
              type:
                data[0].devtype == 3
                  ? "asset"
                  : data[0].devtype == 4
                  ? "tbox"
                  : "person",
              deveui: data[0].deveui,
              pathData: [],
              info: data[0],
            },
          ];
          data.forEach((item) => {
            newData[0].pathData.push({ x: item.x, y: item.y });
          });
          console.log("newData", newData);
          that.handlePushData(newData);
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].deveui) {
              if (data[i].maptype == 1) {
                // that.delFeature(data[i]);
              } else if (data[i].maptype == 2) {
                that.delIcon(data[i]);
              }
              if (data[i].status != 2) {
                if (that.showAllGround === false) {
                  if (that.groundid != data[i].groundid) {
                    setTimeout(() => {
                      switch (data[i].devtype) {
                        case 1:
                          that.searchInfo(data[i].deveui);
                          break;
                        case 2:
                          that.searchInfo(data[i].deveui);
                          break;
                        case 3:
                          that.searchInfo("", data[i].deveui);
                          break;
                        case 4:
                          that.searchInfo("", "", data[i].deveui);
                          break;
                        default:
                          break;
                      }
                    }, 1000);
                    return;
                  }
                }
                if (data[i].maptype == 1) {
                  if (
                    data[i].devtype == 3 &&
                    ((this.checkList.indexOf(
                      this.$t("LocationIndoor.vehicle")
                    ) == -1 &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.personnel")
                      ) == -1) ||
                      this.checkList.length === 0)
                  ) {
                    // that.addIconAsset(that.map, data[i]);
                    that.addOrUpdateFeature("asset", data[i]);
                  } else if (
                    data[i].devtype == 4 &&
                    ((this.checkList.indexOf(
                      this.$t("LocationIndoor.assets")
                    ) == -1 &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.personnel")
                      ) == -1) ||
                      this.checkList.length === 0)
                  ) {
                    // that.addIconTBox(that.map, data[i]);
                    that.addOrUpdateFeature("tbox", data[i]);
                  } else if (
                    ((data[i].devtype == 1 || data[i].devtype == 2) &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.vehicle")
                      ) == -1 &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.assets")
                      ) == -1) ||
                    this.checkList.length === 0
                  ) {
                    // that.addIconMarker(that.map, data[i]);
                    that.addOrUpdateFeature("person", data[i]);
                  }
                } else if (data[i].maptype == 2) {
                  that.groundListCopy.forEach((item) => {
                    if (item.ground == data[i].ground) {
                      data[i].newground = item.newground;
                    }
                  });
                  if (
                    data[i].devtype == 3 &&
                    ((this.checkList.indexOf(
                      this.$t("LocationIndoor.vehicle")
                    ) == -1 &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.personnel")
                      ) == -1) ||
                      this.checkList.length === 0)
                  ) {
                    that.addAsset(data[i].ground, data[i]);
                  } else if (
                    data[i].devtype == 4 &&
                    ((this.checkList.indexOf(
                      this.$t("LocationIndoor.assets")
                    ) == -1 &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.personnel")
                      ) == -1) ||
                      this.checkList.length === 0)
                  ) {
                    that.addTBox(data[i].ground, data[i]);
                  } else if (
                    ((data[i].devtype == 1 || data[i].devtype == 2) &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.vehicle")
                      ) == -1 &&
                      this.checkList.indexOf(
                        this.$t("LocationIndoor.assets")
                      ) == -1) ||
                    this.checkList.length === 0
                  ) {
                    that.addMarker(data[i].ground, data[i]);
                  }
                }
              }
            }
          }
        }
      }
    },
    close(e) {
      console.log("室内WebSocket关闭");
      this.websock.close();
    },
    websocketerror(err) {
      console.log("室内WebSocket连接失败");
      console.log(err);
    },

    websocketSend(data) {
      this.websock.send(data);
    },
    updateSize() {
      if (this.map) {
        this.map.updateSize();
      }
    },
  },
  mounted() {
    clearInterval(this.timeOut);
    this.timeOut = null;
  },
  beforeMount() {
    this.buildingId = Number(this.$route.query.id);
    this.warningBuildingId = Number(this.$route.query.buildid);
    this.warningGround = Number(this.$route.query.ground);
    this.homeGround = Number(this.$route.query.homeground);
    this.getBuildingByProjectids();
    this.getMemberNames();
    this.getAssetNames();
    this.getTboxSnIds();
    if (this.$route.query.deveui) {
      if (this.$route.query.sostype == "true") {
        this.sostype = true;
      } else {
        this.sostype = false;
      }
      setTimeout(() => {
        this.searchInfo(this.$route.query.deveui);
      }, 1000);
    } else if (this.$route.query.assetDeveui) {
      if (this.$route.query.sostype == "true") {
        this.sostype = true;
      } else {
        this.sostype = false;
      }
      setTimeout(() => {
        this.searchInfo("", this.$route.query.assetDeveui);
      }, 1000);
    } else if (this.$route.query.tboxDeveui) {
      if (this.$route.query.sostype == "true") {
        this.sostype = true;
      } else {
        this.sostype = false;
      }
      setTimeout(() => {
        this.searchInfo("", "", this.$route.query.tboxDeveui);
      }, 1000);
    } else {
      if (this.$route.query.sostype == "true") {
        this.sostype = true;
        setTimeout(() => {
          this.searchInfo("", "", "", 1);
        }, 100);
      } else {
        this.sostype = false;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timeOut);
    this.timeOut = null;
    if (this.map) {
      this.map.setTarget("sss");
      this.map = null;
    }
    if (this.map3d) {
      this.map3d.dispose();
      this.map3d = null;
    }
  },

  destroyed() {
    if (this.websock) {
      this.websock.close();
    }
    clearInterval(this.timer);
    clearInterval(this.dataTimer);
    this.timer = null;
    this.dataTimer = null;
  },
  computed: {
    show1() {
      return this.$store.state.show;
    },
  },
  watch: {
    show1(val) {
      setTimeout(() => {
        this.updateSize();
      }, 200);
    },
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
    },
    //路由参数变化
    $route: {
      handler(to, from) {
        if (to.query != from.query) {
          this.buildingId = Number(this.$route.query.id);
          this.getBuildingByProjectids();
          this.getMemberNames();
          this.getAssetNames();
          if (this.$route.query.deveui) {
            if (this.$route.query.sostype == "true") {
              this.sostype = true;
            } else {
              this.sostype = false;
            }
            setTimeout(() => {
              this.searchInfo(this.$route.query.deveui);
            }, 100);
          } else if (this.$route.query.assetDeveui) {
            this.searchInfo("", this.$route.query.assetDeveui);
          } else if (this.$route.query.tboxDeveui) {
            this.searchInfo("", "", this.$route.query.tboxDeveui);
          } else {
            if (this.$route.query.sostype == "true") {
              this.sostype = true;
              setTimeout(() => {
                this.searchInfo("", "", "", 1);
              }, 100);
            } else {
              this.sostype = false;
            }
          }
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.Info_dialog >>> .el-dialog {
  border-radius: 20px !important;
  background: rgba(0, 0, 0, 0.5);
}
.Info_dialog >>> .el-dialog__body {
  color: white !important;
}
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.left-top {
  flex: 1 1 40%; /* 左上部分图片宽度为40% */
}

.right-top {
  flex: 1 1 58%; /* 右上部分宽度为60% */
  display: flex;
  flex-direction: column;
  margin-left: 2%;
}

.bottom {
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
}

.container li {
  text-align: left; /* 确保每个 li 左对齐 */
  list-style: none; /* 去掉 li 前面的默认样式 */
  padding: 0 !important;
  margin: 0 !important;
}

.goDev a {
  text-decoration: null;
  color: #409eff; /* 链接颜色 */
}
.bracelet_title {
  text-align: left;
}
.bracelet_dev {
  display: flex;
  justify-content: space-between;
}
.bracelet_dev span {
  margin: 0;
  padding: 0;
}
.selectGround >>> .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
>>> .el-notification.right {
  right: 30px;
}
.selectBuild {
  width: 100%;
  position: absolute;
  right: 0;
  z-index: 1;
}
.selectBuild >>> .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.selectBuild >>> .el-select {
  width: 200px;
  margin-right: 0%;
  display: block;
}
.selectBuild3d >>> .el-select {
  margin-right: 4%;
}
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
  margin-top: 50px;
  width: auto !important;
}
li {
  list-style: none;
  cursor: pointer;
}
.content::-webkit-scrollbar {
  display: none !important;
}
.mapConent {
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  margin-left: 0%;
  background-color: #0e2232;
}

.addclass >>> span {
  color: #409eff;
  transition: all 0.3s;
}

.query,
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
  height: 34px !important;
  line-height: 34px !important;
  cursor: text !important;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-range-separator {
  height: 34px;
  line-height: 34px;
}

#popups {
  display: block;
}

.divider {
  margin: 5px 0 !important;
}

#popup-contents li {
  list-style: none;
  text-align: left;
  cursor: default;
}
#popup-contents .goDev {
  cursor: pointer;
}

#popup-contents li:first-of-type {
  margin-top: 10px;
}

#popup-contents li:last-of-type {
  margin-bottom: 5px;
}

a {
  text-decoration: none;
}

.statistics {
  margin-left: 0%;
}

.statistics >>> .el-table tr {
  background-color: #f5f7fa !important;
}

.statistics >>> .cell-blue {
  background: #bed7f0 !important;
}
.statistics3d {
  margin-right: 4%;
  top: 20px;
  display: flex;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 3px 1px #b5c6dd;
  position: absolute;
  right: 0%;
  z-index: 1;
  align-items: center;
}
.statistics3d >>> .el-table td {
  padding: 10px 0 !important;
}
.buildings-item li {
  background-color: #fff;
  border-bottom: 1px #efefef solid;
}
.buildings-item:hover li {
  background-color: #f2f2f2;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.ground li {
  font-size: 16px;
  padding: 5px 12px !important;
  background-color: #fff;
  border-bottom: 1px #efefef solid;
}
.ground:hover li {
  background-color: #f2f2f2;
}
.containers {
  display: flex;
}
.fullscreen_containers {
  display: flex;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fullscreen_containers .mapConent .allmap,
.fullscreen_containers .mapConentD .fengMap {
  width: 80vw !important;
  height: 80vh !important;
}
.allmap,
.fengMap {
  position: relative;
  z-index: 1;
}
.fullscreen {
  background-color: #fff !important;
}
.statistics {
  overflow-x: hidden;
}
>>> .el-select-dropdown.el-popper {
  top: 39px !important;
  text-align: left;
}
>>> .el-select-dropdown__wrap.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}

.mapConentD {
  display: flex;
  height: 100%;
  width: 100%;
  margin-left: 0%;
}

#fengMap {
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 11;
}
.scrollbar {
  max-height: 250px;
}
.el-table {
  height: auto !important;
}
.imags_ul {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 99;
}
.imags_ul li {
  margin-top: 20px;
}
.inputContent {
  padding-top: 10px;
  margin-bottom: -10px;
}
.show_echarts {
  border: 2px solid #f2f2f2;
  cursor: pointer;
  height: 50px;
  width: 25px;
  text-align: center;
  line-height: 50px;
}
.float_box {
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 999;
  color: white;
  font-weight: 600;
  left: 10px;
}
.all_num_box {
  display: flex;
  margin-top: 1%;
  margin-bottom: 1%;
  justify-content: space-between;
  width: 100%;
}
.all_num p {
  font-size: 18px;
  opacity: 0.7;
}
.statistics_box {
  margin-top: 4%;
}
.rloe_data,
.department_data,
.sosDatas_data {
  width: 300px;
  margin-top: -10px;
}
.rloe_data >>> .capsule-item-column,
.department_data >>> .capsule-item-column,
.rloe_data >>> .capsule-item-column .capsule-item-value,
.department_data >>> .capsule-item-column .capsule-item-value {
  margin: 0;
}
.rloe_data >>> .capsule-container .unit-label,
.department_data >>> .capsule-container .unit-label {
  margin: 0 !important;
}
.rloe_data >>> .capsule-container .unit-label div,
.department_data >>> .capsule-container .unit-label div {
  margin: 0 !important;
  padding: 0 !important;
}
.sosDatas_data {
  height: 200px;
}
.statistics_img {
  width: 32px;
  height: 32px;
  background-color: #409eff;
  border-radius: 25%;
}
.pan_box {
  margin-left: 4%;
}
.pan_box >>> .el-tabs__header {
  border: 0px !important;
}
.pan_box >>> .el-tabs__nav {
  border: 0px !important;
}
.pan_box >>> .el-tabs__nav .is-active {
  color: white;
  background-color: gray;
  opacity: 0.7;
}
.pan_box >>> .el-tabs__item {
  border: 0px !important;
  color: white;
  opacity: 0.7;
}
.data_table {
  background: transparent !important;
  border: 0px !important;
}
.data_table::before {
  height: 0 !important;
}
.data_table >>> .has-gutter tr th {
  background: transparent !important;
}
.data_table >>> tr {
  background: transparent !important;
  color: white;
  opacity: 0.7;
}
.data_table >>> tr td,
.data_table >>> tr th {
  border: 0px !important;
  padding: 5px 0;
}
.data_table >>> .el-table__body tr:hover > td {
  background: transparent !important;
}
</style>
