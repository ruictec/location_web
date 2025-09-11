<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>

    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Devicemanagement /></el-aside>
        <el-main>
          <div class="beacon_input">
            <!-- 第一行 -->
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
                :label="$t('beacon.beaconid1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.beaconid"
                  :placeholder="$t('beacon.please')"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('beacon.major1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.major"
                  :placeholder="$t('beacon.please')"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('beacon.minor1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.minor"
                  :placeholder="$t('beacon.please')"
                ></el-input>
              </el-form-item>

              <!-- 隐藏显示所有按钮 -->
              <el-form-item
                style="display: flex; margin-left: 0%"
                v-show="seen"
              >
                <!-- 高级 -->
                <span class="el-dropdown-link" @click="changeItem()">
                  {{ $t("beacon.more") }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>

                <el-button type="primary" class="query" @click="searchInfo()">
                  {{ $t("beacon.search") }}
                </el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">
                  {{ $t("beacon.reset") }}
                </el-button>
                <el-button
                  type="primary"
                  class="reset"
                  style="margin-left: 0%"
                  @click="importExcel()"
                  v-if="contrForPrionum == 3 || contrForPrionum == 4"
                  >{{ $t("terminal.import") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  style="margin-left: 0%"
                  @click="exportExcel()"
                  v-if="contrForPrionum == 3 || contrForPrionum == 4"
                  >{{ $t("terminal.export") }}</el-button
                >
                <el-button
                  type="primary"
                  class="addBeacon"
                  @click="addBeacons()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                  >{{ $t("beacon.addbeacon") }}</el-button
                >
                <el-dropdown
                  size="small "
                  type="primary"
                  trigger="hover"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                >
                  <el-button type="primary" size="small ">
                    {{ $t("beacon.batch")
                    }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
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
                        class="editBeacons"
                        @click="editBeacons()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("beacon.edit") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delBeacons"
                        @click="assignBeacons()"
                        v-if="contrForPrionum == 3 || contrForPrionum == 4"
                        >{{ $t("beacon.assign") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delBeacons"
                        @click="removeBeacons()"
                        v-if="contrForPrionum == 3 || delprio == 1"
                        >{{ $t("terminal.recovery") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="dels"
                        size="mini"
                        @click="deleteBeacons()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 3 ||
                          delprio == 1
                        "
                        >{{ $t("terminal.delete") }}</el-button
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>

              <el-form-item
                :label="$t('beacon.inuse')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="show"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.inuse"
                  :placeholder="$t('terminal.choose')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in inuseType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="show"
                type="hidden"
                :label="$t('beacon.workstate')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                  z-index: 1;
                "
              >
                <el-select
                  v-model="searchList.workstate"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in workType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="show"
                id="item1"
                :label="$t('beacon.type')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                  z-index: 1;
                "
              >
                <el-select
                  :placeholder="$t('terminal.choose')"
                  style="width: 95%; float: left"
                  v-model="searchList.type"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in beaconType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <!-- 第二行 -->
            <el-form
              class="demo-form-inline"
              style="display: flex; white-space: nowrap; margin-left: 1%"
            >
              <el-form-item
                :label="$t('beacon.battery')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="
                  (contrForPrionum == 5 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 1) &&
                  show
                "
              >
                <el-select
                  :placeholder="$t('terminal.choose')"
                  style="width: 95%; float: left"
                  v-model="batterys"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in searchBatteryList"
                    :key="item.inddex"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('terminal.Assignmentstatus')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="
                  (contrForPrionum == 3 ||
                    contrForPrionum == 4 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 1) &&
                  show
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.inallot"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in searchInallotList"
                    :key="item.inddex"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('terminal.Project1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="(contrForPrionum == 3 || contrForPrionum == 4) && show"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.projectid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
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
                :label="$t('beacon.company')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="(contrForPrionum == 1 || contrForPrionum == 2) && show"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.tenantid"
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
              <el-form-item
                :label="$t('beacon.tet')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="show"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="devtimes"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in devtimeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="show"
                :label="$t('beacon.regtime')"
                style="
                  display: flex;
                  width: 27%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-date-picker
                  style="width: 95%; float: left"
                  v-model="tasktime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('beacon.to')"
                  :start-placeholder="$t('beacon.starttime')"
                  :end-placeholder="$t('beacon.endtime')"
                  align="left"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                v-show="seen1 && contrForPrionum == 5"
                style="display: flex; margin-left: 0%; margin-right: 0"
              >
                <span class="el-dropdown-link" @click="changeItem()">
                  {{ $t("beacon.putAway")
                  }}<i class="el-icon-arrow-up el-icon--right"></i>
                </span>

                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("beacon.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("beacon.reset")
                }}</el-button>
              </el-form-item>
            </el-form>

            <!-- 第三行 -->
            <el-form
              v-show="
                seen1 &&
                (contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4)
              "
              class="demo-form-inline"
              style="display: flex; white-space: nowrap; margin-left: 1%"
            >
              <el-form-item
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                class="memo"
                :label="$t('beacon.sysmemo1')"
                v-if="(contrForPrionum == 1 || contrForPrionum == 2) && show"
              >
                <el-popover placement="bottom" trigger="click" class="chose">
                  <el-switch
                    v-model="value1"
                    :active-text="$t('beacon.exact')"
                    :inactive-text="$t('beacon.blur')"
                    @change="choseMemo"
                  >
                  </el-switch>
                  <el-input
                    style="width: 95%; float: left"
                    v-model="selectMemo"
                    :placeholder="$t('beacon.please')"
                    slot="reference"
                  ></el-input>
                </el-popover>
              </el-form-item>

              <el-form-item
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                class="memo"
                :label="$t('beacon.memo1')"
                v-if="(contrForPrionum == 3 || contrForPrionum == 4) && show"
              >
                <el-popover placement="bottom" trigger="click" class="chose">
                  <el-switch
                    v-model="value1"
                    :active-text="$t('beacon.exact')"
                    :inactive-text="$t('beacon.blur')"
                    @change="choseMemo"
                  >
                  </el-switch>
                  <el-input
                    style="width: 95%; float: left"
                    v-model="selectMemo"
                    :placeholder="$t('beacon.please')"
                    slot="reference"
                  ></el-input>
                </el-popover>
              </el-form-item>
              <el-form-item
                style="display: flex; margin-left: 1%; margin-right: 0"
              >
                <!-- 高级 -->
                <span class="el-dropdown-link" @click="changeItem()">
                  {{ $t("beacon.putAway")
                  }}<i class="el-icon-arrow-up el-icon--right"></i>
                </span>

                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("beacon.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("beacon.reset")
                }}</el-button>
                <el-button
                  type="primary"
                  class="reset"
                  style="margin-left: 0%"
                  @click="importExcel()"
                  v-if="contrForPrionum == 3 || contrForPrionum == 4"
                  >{{ $t("terminal.import") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  style="margin-left: 0%"
                  @click="exportExcel()"
                  v-if="contrForPrionum == 3 || contrForPrionum == 4"
                  >{{ $t("terminal.export") }}</el-button
                >
                <el-button
                  type="primary"
                  class="addBeacon"
                  @click="addBeacons()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                  >{{ $t("beacon.addbeacon") }}</el-button
                >
                <el-dropdown
                  size="small "
                  type="primary"
                  trigger="hover"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                >
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 5%"
                  >
                    {{ $t("beacon.batch")
                    }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
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
                        class="editBeacons"
                        @click="editBeacons()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("beacon.edit") }}</el-button
                      ></el-dropdown-item
                    >

                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delBeacons"
                        @click="assignBeacons()"
                        v-if="contrForPrionum == 3 || contrForPrionum == 4"
                        >{{ $t("beacon.assign") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delBeacons"
                        @click="removeBeacons()"
                        v-if="contrForPrionum == 3 || delprio == 1"
                        >{{ $t("terminal.recovery") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="dels"
                        size="mini"
                        @click="deleteBeacons()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 3 ||
                          delprio == 1
                        "
                        >{{ $t("beacon.delete") }}</el-button
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-form>
          </div>

          <!-- beacon展示 -->
          <div>
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
                width: 98%;
                text-align: center;
                margin-left: 2%;
                z-index: 1;
              "
              max-height="660"
              border
              highlight-current-row
              @header-click="changeBase"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
                v-if="contrForPrionum != '5'"
              >
              </el-table-column>
              <el-table-column
                property="customername"
                :label="$t('beacon.customername')"
                show-overflow-tooltip
                v-if="contrForPrionum == '1' || contrForPrionum == '2'"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                property="beaconid"
                :label="$t('beacon.beaconid')"
                show-overflow-tooltip
                min-width="87"
              ></el-table-column>
              <el-table-column
                property="alias"
                :label="$t('terminal.alias1')"
                show-overflow-tooltip
                min-width="78"
              ></el-table-column>
              <el-table-column
                property="major"
                label="Major"
                show-overflow-tooltip
                min-width="60"
                align="center"
                fixed
              ></el-table-column>

              <el-table-column
                property="minor"
                :label="$t('beacon.minor')"
                show-overflow-tooltip
                min-width="60"
                align="center"
                fixed
              ></el-table-column>

              <el-table-column
                property="customstr"
                :label="$t('beacon.customstr')"
                show-overflow-tooltip
                min-width="120"
                align="center"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              ></el-table-column>
              <el-table-column
                property="inallotstr"
                :label="$t('beacon.inallotstr')"
                show-overflow-tooltip
                min-width="130"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="inusestr"
                :label="$t('beacon.inusestr')"
                show-overflow-tooltip
                min-width="98"
                align="center"
              ></el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'workstatestr' : 'enworkstate'"
                :label="$t('beacon.workstatestr')"
                show-overflow-tooltip
                min-width="119"
                align="center"
              ></el-table-column>

              <el-table-column
                property="typestr"
                :label="$t('beacon.typestr')"
                show-overflow-tooltip
                min-width="100"
                align="center"
              ></el-table-column>

              <el-table-column
                property="alarmname"
                :label="$t('beacon.region')"
                show-overflow-tooltip
                min-width="78"
                align="center"
                v-if="
                  (intoProjectType == 1 && contrForPrionum == 5) ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              ></el-table-column>
              <el-table-column
                property="clockinstr"
                :label="$t('beacon.checkpoint')"
                show-overflow-tooltip
                min-width="115"
                align="center"
                v-if="
                  (intoProjectType == 1 && contrForPrionum == 5) ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              ></el-table-column>
              <el-table-column
                property="rssi1"
                :label="$t('beacon.rssi1')"
                show-overflow-tooltip
                min-width="95"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="rssi2"
                :label="$t('beacon.rssi2')"
                show-overflow-tooltip
                min-width="95"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="h"
                :label="$t('beacon.height')"
                show-overflow-tooltip
                min-width="75"
                align="center"
              ></el-table-column>
              <el-table-column
                property="a"
                label="a"
                show-overflow-tooltip
                min-width="40"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="n"
                label="n"
                show-overflow-tooltip
                min-width="40"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="projectname"
                :label="$t('beacon.projectname')"
                show-overflow-tooltip
                min-width="78"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="groundid"
                :label="$t('beacon.floor')"
                show-overflow-tooltip
                min-width="106"
                align="center"
              ></el-table-column>
              <el-table-column
                property="longi"
                :label="$t('beacon.longi')"
                show-overflow-tooltip
                min-width="80"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="lati"
                :label="$t('beacon.lati')"
                show-overflow-tooltip
                min-width="70"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="postime"
                :label="$t('beacon.postime')"
                show-overflow-tooltip
                :formatter="formatDatePostime"
                min-width="150"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="battery"
                :label="$t('beacon.battery1')"
                show-overflow-tooltip
                min-width="80%"
                align="center"
              ></el-table-column>
              <el-table-column
                property="devtime"
                :label="$t('beacon.Scantime')"
                show-overflow-tooltip
                :formatter="formatDateDevtime"
                min-width="115"
                align="center"
              ></el-table-column>
              <el-table-column
                property="regtime"
                :label="$t('beacon.creationtime')"
                show-overflow-tooltip
                :formatter="formatDateRegtime"
                align="center"
                min-width="115"
              ></el-table-column>

              <el-table-column
                property="sysmemo"
                :label="$t('beacon.sysmemo')"
                show-overflow-tooltip
                min-width="150"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('beacon.memo')"
                show-overflow-tooltip
                min-width="150"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('beacon.control')"
                align="center"
                min-width="80"
              >
                <template slot-scope="scope">
                  <el-dropdown
                    size="mini"
                    type="primary"
                    trigger="click"
                    v-if="
                      contrForPrionum == 1 ||
                      contrForPrionum == 2 ||
                      contrForPrionum == 3 ||
                      contrForPrionum == 4
                    "
                    ><el-tooltip
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
                          @click="editBeacon(scope.$index, tableData)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          >{{ $t("beacon.edit") }}</el-button
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
                          @click="assignBeacon(scope.$index, tableData)"
                          v-if="contrForPrionum == 3 || contrForPrionum == 4"
                          >{{ $t("beacon.assign") }}</el-button
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
                          @click="recycleBeacon(scope.$index, tableData)"
                          v-if="contrForPrionum == 3 || delprio == 1"
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
                          class="delss"
                          @click="delBeacons(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 3 ||
                            delprio == 1
                          "
                          >{{ $t("beacon.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('terminal.position')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="icon_button"
                      v-if="contrForPrionum == 5 && intoProjectType == 2"
                      @click="goLocation(scope.$index)"
                    >
                      <img src="../../../static/location.png" />
                    </el-button>
                  </el-tooltip>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('terminal.position')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="icon_button"
                      v-if="contrForPrionum == 5 && intoProjectType == 1"
                      @click="goLocationDetails(scope.$index)"
                    >
                      <img src="../../../static/location.png" />
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
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

          <!-- 添加beacon -->
          <el-dialog
            :title="$t('beacon.addmsg')"
            width="30%"
            :visible.sync="add"
            style="text-aling: center"
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
                label="Major："
                prop="major"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.major"
                  maxlength="4"
                  :placeholder="$t('beacon.majorimput')"
                >
                </el-input>
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
                    <p>{{ $t("beacon.tet1") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                label="Minor："
                prop="minor"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.minor"
                  maxlength="4"
                  :placeholder="$t('beacon.majorimput')"
                >
                </el-input>
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
                    <p>{{ $t("beacon.tet2") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.type')"
                prop="type"
                style="margin-right: 2%"
              >
                <el-select
                  v-model="addData.type"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in beaconType"
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
                    <p>{{ $t("beacon.tet3") }}</p>
                    <p>{{ $t("beacon.tet4") }}</p>
                    <p>{{ $t("beacon.tet5") }}</p>
                    <p>{{ $t("beacon.tet6") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                label="Rssi1："
                prop="rssi1"
                style="margin-right: 2%"
              >
                <el-input v-model="addData.rssi1"> </el-input>
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
                    <p>{{ $t("beacon.tet8") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                label="Rss2："
                prop="rssi2"
                style="margin-right: 2%"
              >
                <el-input v-model="addData.rssi2"> </el-input>
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
                    <p>{{ $t("beacon.tet9") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('beacon.h')"
                prop="h"
                style="margin-right: 2%"
              >
                <el-input v-model="addData.h"> </el-input>
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
                    <p>{{ $t("beacon.tet14") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('beacon.company')"
                prop="tenantid"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                style="margin-right: 2%"
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
              <el-form-item
                :label="$t('beacon.number')"
                prop="num"
                style="margin-right: 2%"
              >
                <el-input v-model="addData.num"> </el-input>
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
                      {{ $t("beacon.tet11") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                style="margin-right: 2%"
                :label="$t('beacon.sysmemo1')"
                prop=""
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.sysmemo"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                style="margin-right: 2%"
                :label="$t('beacon.memo1')"
                prop=""
                v-if="contrForPrionum != 1 && contrForPrionum != 2"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                >
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel('addData')">{{
                $t("change.cancle")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
                >{{ $t("change.sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 修改一个Beacon -->
          <el-dialog
            :title="$t('beacon.editmsg')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancle('editData')"
          >
            <el-form
              :model="editData"
              label-width="150px"
              ref="editData"
              style="text-align: left"
              :rules="editRules"
            >
              <el-form-item :label="$t('beacon.beaconid1')" prop="">
                <el-input v-model="editData.beaconid" disabled> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.Beaconalias')" prop="">
                <el-input v-model="editData.alias"> </el-input>
              </el-form-item>
              <el-form-item label="Major：" prop="">
                <el-input v-model="editData.major" :disabled="editmajor">
                </el-input>
              </el-form-item>
              <el-form-item label="Minor：" prop="">
                <el-input v-model="editData.minor" :disabled="editmajor">
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.inuse')" prop="">
                <el-select
                  v-model="editData.inuse"
                  disabled
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in inuseType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('beacon.workstate')" prop="">
                <el-select
                  v-model="editData.workstate"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in workType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('beacon.type')" prop="type">
                <el-select
                  v-model="editData.type"
                  clearable
                  filterable
                  :disabled="BeaconTypes"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in beaconType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('beacon.editrssi1')" prop="rssi1">
                <el-input v-model="editData.rssi1"> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.editrssi2')" prop="rssi2">
                <el-input v-model="editData.rssi2"> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.h')" prop="h">
                <el-input v-model="editData.h"> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.company')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                prop="tenantid"
              >
                <el-select
                  v-model="editData.tenantid"
                  clearable
                  filterable
                  :disabled="editTenantid"
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
                :label="$t('beacon.sysmemo1')"
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
                :label="$t('beacon.memo1')"
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
              <el-button @click="editCancle('editData')">{{
                $t("change.cancle")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("change.sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 批量编辑beacon信息 -->
          <el-dialog
            :title="$t('beacon.editmsgs')"
            :visible.sync="edits"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editscancel('editDatas')"
          >
            <el-form
              :model="editDatas"
              ref="editDatas"
              label-width="130px"
              style="text-align: left; margin-left: 10px"
              :rules="editRules"
            >
              <el-form-item :label="$t('beacon.beaconid1')">
                <el-input v-model="editDatas.beaconidlist" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.type')" prop="">
                <el-select
                  v-model="editDatas.type"
                  clearable
                  filterable
                  :disabled="BeaconTypes"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in beaconType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('beacon.editrssi1')" prop="rssi1">
                <el-input v-model="editDatas.rssi1"> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.editrssi2')" prop="rssi2">
                <el-input v-model="editDatas.rssi2"> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.h')" prop="h">
                <el-input v-model="editDatas.h"> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.company')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                prop=""
              >
                <el-select
                  v-model="editDatas.tenantid"
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

              <el-form-item
                :label="$t('beacon.sysmemo1')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editDatas.sysmemo"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.memo1')"
                v-if="contrForPrionum != 1 && contrForPrionum != 2"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editDatas.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editscancel('editDatas')">{{
                $t("change.cancle")
              }}</el-button>
              <el-button
                type="primary"
                @click="editsTrue('editDatas')"
                :loading="loading"
                >{{ $t("change.sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 批量删除beacon信息 -->
          <el-dialog :title="$t('beacon.deletemsgs')" :visible.sync="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="customername"
                :label="$t('beacon.customername1')"
                show-overflow-tooltip
                v-if="contrForPrionum == '1' || contrForPrionum == '2'"
                width="150"
              ></el-table-column>
              <el-table-column
                property="beaconid"
                :label="$t('beacon.beaconid')"
                show-overflow-tooltip
                width="150"
              ></el-table-column>

              <el-table-column
                property="major"
                label="Major"
                show-overflow-tooltip
                fixed
              ></el-table-column>

              <el-table-column
                property="minor"
                label="Minor"
                show-overflow-tooltip
                fixed
              ></el-table-column>
              <el-table-column
                property="inusestr"
                :label="$t('beacon.inusestr')"
                show-overflow-tooltip
                width="150"
              ></el-table-column>
              <el-table-column
                property="groundid"
                :label="$t('beacon.floor')"
                show-overflow-tooltip
                width="150"
              ></el-table-column>
              <el-table-column
                property="Rssi1"
                :label="$t('beacon.editrssi1')"
                show-overflow-tooltip
                width="100"
              ></el-table-column>
              <el-table-column
                property="Rssi2"
                :label="$t('beacon.editrssi2')"
                show-overflow-tooltip
                width="100"
              ></el-table-column>
              <el-table-column
                property="typestr"
                :label="$t('beacon.typestr')"
                show-overflow-tooltip
                width="150"
              ></el-table-column>
              <el-table-column
                property="tranche"
                :label="$t('beacon.region')"
                show-overflow-tooltip
                min-width="78"
                align="center"
                v-if="
                  contrForPrionum == 5 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
              ></el-table-column>
              <el-table-column
                property="a"
                label="a"
                show-overflow-tooltip
                width="100"
                v-if="contrForPrionum != 3 || contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="n"
                label="n"
                show-overflow-tooltip
                width="100"
                v-if="contrForPrionum != 3 || contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="x"
                label="x"
                show-overflow-tooltip
                width="100"
                v-if="contrForPrionum != 3 || contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="y"
                label="y"
                show-overflow-tooltip
                width="100"
                v-if="contrForPrionum != 3 || contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="battery"
                :label="$t('beacon.battery1')"
                show-overflow-tooltip
                width="100"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("beacon.battery1")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("terminal.electricityHelp") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="battime"
                :label="$t('beacon.battime')"
                show-overflow-tooltip
                :formatter="formatDateBattime"
                width="180"
              ></el-table-column>
              <el-table-column
                property="postime"
                :label="$t('beacon.postime')"
                show-overflow-tooltip
                :formatter="formatDatePostime"
                width="180"
              ></el-table-column>
              <el-table-column
                property="regtime"
                :label="$t('beacon.regtime')"
                show-overflow-tooltip
                :formatter="formatDateRegtime"
                width="180"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('beacon.memo')"
                show-overflow-tooltip
                width="150"
              ></el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
              <el-button @click="(del = false), (loading = false)">{{
                $t("change.cancle")
              }}</el-button>
              <el-button
                type="primary"
                @click="deleteTrue"
                :loading="loading"
                >{{ $t("change.sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 分配信标 -->
          <el-dialog
            :title="$t('beacon.assignbeacon')"
            :visible.sync="assign"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-form
              :model="assignData"
              label-width="100px"
              ref="assignData"
              style="text-align: left"
              :rules="editRules"
            >
              <el-form-item :label="$t('beacon.beaconid1')" prop="">
                <el-input v-model="assignData.beaconids" disabled> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.projectname1')" prop="">
                <el-select
                  v-model="assignData.projectid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(assign = false), (loading = false)">{{
                $t("change.cancle")
              }}</el-button>
              <el-button
                type="primary"
                @click="assignTrue('assignData')"
                :loading="loading"
                >{{ $t("change.sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 批量分配信标 -->
          <el-dialog
            :title="$t('beacon.assignbeacons')"
            :visible.sync="assigns"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-form
              :model="assignDatas"
              label-width="100px"
              ref="assignDatas"
              style="text-align: left"
              :rules="editRules"
            >
              <el-form-item :label="$t('beacon.beaconid1')" prop="">
                <el-input v-model="assignDatas.beaconids" disabled> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.projectname1')" prop="">
                <el-select
                  v-model="assignDatas.projectid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(assigns = false), (loading = false)">{{
                $t("change.cancle")
              }}</el-button>
              <el-button
                type="primary"
                @click="assignsTrue('assignDatas')"
                :loading="loading"
                >{{ $t("change.sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 解除分配信标 -->
          <el-dialog
            :title="$t('beacon.deletemsgs1')"
            :visible.sync="removeBeacon"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-table
              :data="removeDatas"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="beaconid"
                :label="$t('beacon.beaconid')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="projectname"
                :label="$t('beacon.projectname')"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(removeBeacon = false), (loading = false)">{{
                $t("change.cancle")
              }}</el-button>
              <el-button
                type="primary"
                @click="removeTrue()"
                :loading="loading"
                >{{ $t("change.sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 导出 表格复选框没有选择-->
          <el-dialog
            :title="$t('terminal.tit2')"
            :visible.sync="exportBtn"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-form
              :model="exportData"
              label-width="130px"
              ref="exportData"
              style="text-align: left"
              :rules="exportRules"
            >
              <el-form-item
                :label="$t('beacon.projectname1')"
                prop=""
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  style="width: 70%"
                  v-model="exportData.projectid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                  @change="changeEui(exportData.projectid)"
                >
                  <el-option
                    v-for="item in exportProjectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
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
                    <p>{{ $t("terminal.tit3") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('beacon.major1')">
                <el-input
                  :placeholder="$t('beacon.majorrules')"
                  v-model="exportData.major"
                  :disabled="selectEui"
                  maxlength="16"
                  style="width: 80%"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.beginminor')">
                <el-input
                  :placeholder="$t('beacon.beginminor1')"
                  v-model="exportData.beginminor"
                  :disabled="selectEui"
                  maxlength="16"
                  style="width: 80%"
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
                    <p>{{ $t("beacon.tit6") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('beacon.endminor')">
                <el-input
                  :placeholder="$t('beacon.endminor1')"
                  v-model="exportData.endminor"
                  :disabled="selectEui"
                  maxlength="16"
                  style="width: 80%"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('beacon.sysmemo1')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  v-model="exportData.sysmemo"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.memo1')"
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  v-model="exportData.memo"
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
                    <p>{{ $t("terminal.tet42") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(exportBtn = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="exportExcelTrue()"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
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
import {
  getBeaconList,
  addBeacon,
  updateBeacon,
  delBeacon,
  delBeaconList,
  updateBeaconList,
  getCustomerName,
  getProjectListByTenantid,
  updateBeaconByBeaconids,
  updateRemoveProjectByBeaconids,
  getDevGpsOne,
  exportBeaconInfo,
  importBeacon,
  getBuildGroundOne,
} from "../../axios/api";
export default {
  components: {
    Menu,
    Devicemanagement,
    basecard,
  },
  name: "Beacon",
  data() {
    //major正则
    var isMajor = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg = /^[0-9a-fA-F]{4}$/;
        const email = reg.test(value);
        if (!email) {
          callback(new Error(this.$t("beacon.majorimput")));
        } else {
          callback();
        }
      }
    };
    var isH = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (value < 1.5 || value > 100) {
          callback(new Error(this.$t("beacon.hrules")));
        } else {
          callback();
        }
      }
    };
    return {
      i8n: this.$store.state.i18n,
      show: false,
      seen: true,
      seen1: false,
      intoProjectType: this.$store.state.intoProjectType,
      contrForPrionum: this.$store.state.userInfo.prionum,
      country: this.$store.state.userInfo.country,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      tableData: [],
      tenantidData: [],
      multipleSelection: [],
      tasktime: [],
      trancheList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("terminal.pickeroptions4"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions5"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value1: true,
      changeMemo: true,
      selectMemo: "",
      searchBeaconType: "", //信标类型
      searchInallot: "", //分配状态
      searchInuse: "", //使用状态
      searchList: {
        beaconid: "",
        minor: "",
        major: "",
        inuse: "",
        workstate: "",
        type: "",
        tenantid: "",
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        projectid: "",
        inallot: "",
        beginbat: "",
        endbat: "",
        starttime: "",
        overtime: "",
      },
      batterys: "",
      devtimes: "",
      pageCount: 20,
      currentPage1: 1,
      total: 0,
      add: false,
      addData: {
        major: "", //4位正整数
        minor: "", //4位正整数
        type: "",
        rssi1: "",
        rssi2: "",
        a: "",
        n: "",
        tenantid: "",
        memo: "",
        num: "",
        custom: 1,
        projectid: "",
        sysmemo: "",
        h: "",
      },
      addRules: {
        major: [
          {
            required: true,
            message: this.$t("beacon.majorrules"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        minor: [
          {
            required: true,
            message: this.$t("beacon.minorrules"),
            trigger: "blur",
          },
          { validator: isMajor, trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message: this.$t("beacon.typerules"),
            trigger: "change",
          },
        ],
        rssi1: [
          {
            pattern: /^(-[1-9][0-9]*)$/,
            message: this.$t("beacon.rssirules"),
            trigger: "blur",
          },
        ],
        rssi2: [
          {
            pattern: /^(-[1-9][0-9]*)$/,
            message: this.$t("beacon.rssirules"),
            trigger: "blur",
          },
        ],
        h: [
          {
            required: false,
            validator: isH,
            trigger: "blur",
          },
        ],
        tenantid: [
          {
            required: false,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ],
        num: [
          {
            pattern: /^[1-9]\d*$/,
            message: this.$t("beacon.numrules"),
            trigger: "blur",
          },
        ],
      },
      loading: false,

      //分配状态下拉框
      searchInallotList: [
        {
          index: 1,
          value: this.$t("home.Assigned"),
        },
        {
          index: 2,
          value: this.$t("home.Unassigned"),
        },
      ],
      //电池电量下拉框
      searchBatteryList: [
        {
          index: 1,
          value: "60%~100%",
        },
        {
          index: 2,
          value: "20%~60%",
        },
        {
          index: 3,
          value: "0~20%",
        },
      ],
      //扫描时间下拉框
      devtimeList: [
        {
          index: 1,
          value: this.$t("home.Scanneddays"),
        },
        {
          index: 2,
          value: this.$t("home.scannedwithin"),
        },
        {
          index: 3,
          value: this.$t("home.Neverscanned"),
        },
      ],
      beaconType: [
        {
          index: 1,
          value: this.$t("beacon.location"),
        },
        {
          index: 2,
          value: this.$t("beacon.warning"),
        },
        {
          index: 3,
          value: this.$t("beacon.assets"),
        },
        {
          index: 4,
          value: this.$t("beacon.card"),
        },
      ],
      inuseType: [
        {
          index: 1,
          value: this.$t("beacon.inusetype4"),
        },
        {
          index: 2,
          value: this.$t("beacon.inusetype3"),
        },
      ],
      workType: [
        {
          index: 1,
          value: this.$t("terminal.worktype1"),
        },
        {
          index: 2,
          value: this.$t("terminal.worktype2"),
        },
      ],

      edit: false,
      edits: false,
      BeaconTypes: false,
      editTenantid: false,
      editmajor: false,
      editData: {
        beaconid: "",
        inuse: "",
        type: "",
        rssi1: "",
        rssi2: "",
        a: "",
        n: "",
        tenantid: "",
        memo: "",
        workstate: "",
        major: "",
        minor: "",
        sysmemo: "",
        alias: "",
        h: "",
      },
      editDatas: {
        beaconidlist: "",
        type: "",
        rssi1: "-59",
        rssi2: "-69",
        a: "",
        n: "",
        tenantid: "",
        memo: "",
        sysmemo: "",
        h: "",
      },
      editRules: {
        type: [
          {
            required: true,
            message: this.$t("beacon.typerules"),
            trigger: "change",
          },
        ],

        rssi1: [
          {
            pattern: /^(-[1-9][0-9]*)$/,
            message: this.$t("beacon.rssirules"),
            trigger: "blur",
          },
        ],
        rssi2: [
          {
            pattern: /^(-[1-9][0-9]*)$/,
            message: this.$t("beacon.rssirules"),
            trigger: "blur",
          },
        ],
        h: [{ required: false, validator: isH, trigger: "blur" }],
        tenantid: [
          {
            required: false,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ],
        major: [
          {
            required: true,
            message: this.$t("beacon.majorrules"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        minor: [
          {
            required: true,
            message: this.$t("beacon.minorrules"),
            trigger: "blur",
          },
          { validator: isMajor, trigger: "blur" },
        ],
      },
      assignData: {
        beaconids: "",
        projectid: "",
      },
      assignDatas: {
        beaconids: "",
        projectid: "",
      },
      TrancheDatas: {
        beaconids: "",
        tranche: "",
      },
      removeBeaconDatas: {
        beaconids: "",
      },
      removeDatas: [],

      assign: false,
      assigns: false,
      removeBeacon: false,
      deleteData: [],
      del: false,
      del1: false,
      projectList: [],
      changeMajor: true,
      changeMinor: true,

      exportProjectList: [],
      headerList: "",
      exportData: {
        tenantid: this.$store.state.userInfo.tenantid,
        projectid: "",
        sysmemo: "",
        memo: "",
        major: "",
        beginminor: "",
        endminor: "",
      },
      exportBtn: false, //表格复选框没有选择的时候弹框
      selectEui: false, //判断导出是否需要输入开始及结束设备号
      exportRules: {
        begineui: [
          {
            required: false,
            pattern: /^[a-zA-Z0-9]{16}$/,
            message: this.$t("terminal.deveuirules"),
            trigger: "blur",
          },
        ],
        endeui: [
          {
            required: false,
            pattern: /^[a-zA-Z0-9]{16}$/,
            message: this.$t("terminal.deveuirules"),
            trigger: "blur",
          },
        ],
      },
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
          };

          importBeacon(
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
              that.getBeaconLists();
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
            case that.$t("beacon.beaconid"):
              obj["beaconid"] = outdata[i][key];
              break;
            case that.$t("terminal.alias1"):
              obj["alias"] = outdata[i][key];
              break;
            case "Major":
              obj["major"] = outdata[i][key];
              break;
            case that.$t("beacon.minor"):
              obj["minor"] = outdata[i][key];
              break;
            case that.$t("beacon.customstr"):
              obj["custom"] = outdata[i][key];
              break;
            case that.$t("beacon.inallotstr"):
              obj["inallot"] = outdata[i][key];
              break;
            case that.$t("beacon.inusestr"):
              obj["inuse"] = outdata[i][key];
              break;
            case that.$t("beacon.workstatestr"):
              obj["workstate"] = outdata[i][key];
              break;
            case that.$t("beacon.typestr"):
              obj["type"] = outdata[i][key];
              break;
            case that.$t("beacon.region"):
              obj["alarmname"] = outdata[i][key];
              break;
            case that.$t("floormanagement.AlarmareaID"):
              obj["alarmid"] = outdata[i][key];
              break;
            case that.$t("floormanagement.Positioningarea"):
              obj["tranche"] = outdata[i][key];
              break;
            case that.$t("beacon.checkpoint"):
              obj["clockin"] = outdata[i][key];
              break;
            case that.$t("beacon.rssi1"):
              obj["rssi1"] = outdata[i][key];
              break;
            case that.$t("beacon.rssi2"):
              obj["rssi2"] = outdata[i][key];
              break;
            case that.$t("beacon.height"):
              obj["h"] = outdata[i][key];
              break;
            case "a":
              obj["a"] = outdata[i][key];
              break;
            case "n":
              obj["n"] = outdata[i][key];
              break;
            case that.$t("beacon.projectname"):
              obj["projectid"] = outdata[i][key];
              break;
            case that.$t("beacon.floor"):
              obj["groundid"] = outdata[i][key];
              break;
            case that.$t("beacon.longi"):
              obj["longi"] = outdata[i][key];
              break;
            case that.$t("beacon.lati"):
              obj["lati"] = outdata[i][key];
              break;
            case that.$t("beacon.postime"):
              obj["postime"] = outdata[i][key];
              break;
            case that.$t("beacon.battery1"):
              obj["battery"] = outdata[i][key];
              break;
            case that.$t("beacon.Scantime"):
              obj["devtime"] = outdata[i][key];
              break;
            case that.$t("beacon.creationtime"):
              obj["regtime"] = outdata[i][key];
              break;
            case that.$t("beacon.memo"):
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
    exportExcelTrue() {
      var that = this;
      exportBeaconInfo(
        that.exportData,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.export2Excel(res.data);
          that.exportBtn = false;
          that.selectEui = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 导出
    exportExcel() {
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.headerList = [
          {
            msg: this.$t("beacon.customername"),
            value: "customername",
          },
          {
            msg: this.$t("beacon.beaconid"),
            value: "beaconid",
          },
          {
            msg: this.$t("terminal.alias1"),
            value: "alias",
          },
          {
            msg: "Major",
            value: "major",
          },
          {
            msg: this.$t("beacon.minor"),
            value: "minor",
          },
          {
            msg: this.$t("beacon.customstr"),
            value: "custom",
          },
          {
            msg: this.$t("beacon.inallotstr"),
            value: "inallot",
          },
          {
            msg: this.$t("beacon.inusestr"),
            value: "inuse",
          },
          {
            msg: this.$t("beacon.workstatestr"),
            value: "workstate",
          },
          {
            msg: this.$t("beacon.typestr"),
            value: "type",
          },
          {
            msg: this.$t("beacon.rssi1"),
            value: "rssi1",
          },
          {
            msg: this.$t("beacon.rssi2"),
            value: "rssi2",
          },
          {
            msg: this.$t("beacon.height"),
            value: "h",
          },
          {
            msg: "a",
            value: "a",
          },
          {
            msg: "n",
            value: "n",
          },
          {
            msg: this.$t("beacon.projectname"),
            value: "projectid",
          },
          {
            msg: this.$t("beacon.floor"),
            value: "groundid",
          },
          {
            msg: this.$t("beacon.longi"),
            value: "longi",
          },
          {
            msg: this.$t("beacon.lati"),
            value: "lati",
          },
          {
            msg: this.$t("beacon.postime"),
            value: "postime",
          },
          {
            msg: this.$t("beacon.battery1"),
            value: "battery",
          },
          {
            msg: this.$t("beacon.Scantime"),
            value: "devtime",
          },
          {
            msg: this.$t("beacon.creationtime"),
            value: "regtime",
          },
          {
            msg: this.$t("beacon.sysmemo"),
            value: "sysmemo",
          },
          {
            msg: this.$t("beacon.memo"),
            value: "memo",
          },
        ];
        this.exportData = {
          tenantid: this.$store.state.userInfo.tenantid,
          projectid: "",
          sysmemo: "",
          memo: "",
          major: "",
          beginminor: "",
          endminor: "",
        };
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        this.headerList = [
          {
            msg: this.$t("beacon.beaconid"),
            value: "beaconid",
          },
          {
            msg: this.$t("terminal.alias1"),
            value: "alias",
          },
          {
            msg: "Major",
            value: "major",
          },
          {
            msg: this.$t("beacon.minor"),
            value: "minor",
          },
          {
            msg: this.$t("beacon.customstr"),
            value: "custom",
          },
          {
            msg: this.$t("beacon.inallotstr"),
            value: "inallot",
          },
          {
            msg: this.$t("beacon.inusestr"),
            value: "inuse",
          },
          {
            msg: this.$t("beacon.workstatestr"),
            value: "workstate",
          },
          {
            msg: this.$t("beacon.typestr"),
            value: "type",
          },
          {
            msg: this.$t("beacon.region"),
            value: "alarmname",
          },
          {
            msg: this.$t("floormanagement.AlarmareaID"),
            value: "alarmid",
          },
          {
            msg: this.$t("floormanagement.Positioningarea"),
            value: "tranche",
          },
          {
            msg: this.$t("beacon.checkpoint"),
            value: "clockin",
          },
          {
            msg: this.$t("beacon.rssi1"),
            value: "rssi1",
          },
          {
            msg: this.$t("beacon.rssi2"),
            value: "rssi2",
          },
          {
            msg: this.$t("beacon.height"),
            value: "h",
          },
          {
            msg: "a",
            value: "a",
          },
          {
            msg: "n",
            value: "n",
          },
          {
            msg: this.$t("beacon.projectname"),
            value: "projectid",
          },
          {
            msg: this.$t("beacon.floor"),
            value: "groundid",
          },
          {
            msg: this.$t("beacon.longi"),
            value: "longi",
          },
          {
            msg: this.$t("beacon.lati"),
            value: "lati",
          },
          {
            msg: this.$t("beacon.postime"),
            value: "postime",
          },
          {
            msg: this.$t("beacon.battery1"),
            value: "battery",
          },
          {
            msg: this.$t("beacon.Scantime"),
            value: "devtime",
          },
          {
            msg: this.$t("beacon.creationtime"),
            value: "regtime",
          },
          {
            msg: this.$t("beacon.memo"),
            value: "memo",
          },
        ];
        this.exportData = {
          tenantid: this.$store.state.userInfo.tenantid,
          projectid: "",
          sysmemo: "",
          memo: "",
          major: "",
          beginminor: "",
          endminor: "",
        };
      }
      if (this.multipleSelection.length == 0) {
        this.getExportProjectLists(this.tenantid_A);
        this.exportBtn = true; //表格里没有选择设备
      } else {
        this.export2Excel(this.multipleSelection);
      }
    },
    //导出表格设置
    export2Excel(tableData) {
      var eHeader = [];
      var exprotHeadertype = [];
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        exprotHeadertype = [
          "customername",
          "beaconid",
          "alias",
          "major",
          "minor",
          "custom",
          "inallot",
          "inuse",
          "workstate",
          "type",
          "rssi1",
          "rssi2",
          "h",
          "a",
          "n",
          "projectid",
          "groundid",
          "longi",
          "lati",
          "postime",
          "battery",
          "devtime",
          "regtime",
          "sysmemo",
          "memo",
        ];
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        exprotHeadertype = [
          "beaconid",
          "alias",
          "major",
          "minor",
          "custom",
          "inallot",
          "inuse",
          "workstate",
          "type",
          "alarmname",
          "alarmid",
          "tranche",
          "clockin",
          "rssi1",
          "rssi2",
          "h",
          "a",
          "n",
          "projectid",
          "groundid",
          "longi",
          "lati",
          "postime",
          "battery",
          "devtime",
          "regtime",
          "memo",
        ];
      }

      for (let i = 0; i < exprotHeadertype.length; i++) {
        eHeader.push(exprotHeadertype[i]);
        for (let j = 0; j < this.headerList.length; j++) {
          if (exprotHeadertype[i] == this.headerList[j].value) {
            exprotHeadertype[i] = this.headerList[j].msg;
          }
        }
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        //表头
        const tHeader = exprotHeadertype;
        const filterVal = eHeader;
        const list = tableData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, this.$t("list.Beaconmanagement"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    //当选择了项目的时候，就会禁止输入开始设备号以及结束设备号
    changeEui(eui) {
      if (eui) {
        this.selectEui = true;
      } else {
        this.selectEui = false;
      }
    },
    //导出窗口里面获取项目下拉框
    getExportProjectLists(tenantid) {
      let data = {
        superid: tenantid,
      };
      getProjectListByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.exportProjectList = res.data.list;
      });
    },
    changeBase(column) {
      if (column.label == "Major") {
        this.changMajor();
      } else if (column.label == "Minor") {
        this.changMinor();
      }
    },
    changMajor() {
      if (this.changeMajor) {
        this.tableData.forEach((item) => {
          item.major = parseInt(item.major, 16);
        });
      } else {
        this.tableData.forEach((item) => {
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
        this.tableData.forEach((item) => {
          item.minor = parseInt(item.minor, 16);
        });
      } else {
        this.tableData.forEach((item) => {
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
    //显示隐藏输入框
    changeItem() {
      if (this.show == false && this.seen == true && this.seen1 == false) {
        this.show = true;
        this.seen = false;
        this.seen1 = true;
      } else {
        this.show = false;
        this.seen = true;
        this.seen1 = false;
      }
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getBeaconLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getBeaconLists();
    },

    //选择备注查询方式
    choseMemo(callback) {
      this.changeMemo = callback;
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

    // 时间转换
    formatDateRegtime(row, column) {
      if (row.regtime == null || row.regtime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.regtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDatePostime(row, column) {
      if (row.postime == null || row.postime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.postime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    formatDateBattime(row, column) {
      if (row.battime == null || row.battime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.battime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    formatDateDevtime(row, column) {
      if (row.devtime == null || row.devtime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.devtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //获取beacon信息
    getBeaconLists() {
      this.changeMajor = true;
      this.changeMinor = true;
      var that = this;
      getBeaconList(
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

    // 添加beacon
    addBeacons() {
      this.addData = {
        major: "",
        minor: "",
        type: "",
        rssi1: "-59",
        rssi2: "-69",
        a: "",
        n: "",
        tenantid: "",
        memo: "",
        num: "",
        custom: 1,
        projectid: "",
        sysmemo: "",
        h: "",
      };
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.addRules.tenantid = [
          {
            required: true,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ];
      } else {
        this.addRules.tenantid = [
          {
            required: false,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ];
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

      //rssi1和rssi2的默认值分别是-59，-69，并且rss1要大于rssi2
      if (that.addData.rssi1 == "") {
        that.addData.rssi1 = -59;
      }
      if (that.addData.rssi2 == "") {
        that.addData.rssi2 = -69;
      }
      that.addData.rssi1 = that.addData.rssi1 * 1;
      that.addData.rssi2 = that.addData.rssi2 * 1;
      if (
        that.addData.rssi1 < that.addData.rssi2 ||
        that.addData.rssi1 == that.addData.rssi2
      ) {
        that.$message({
          message: this.$t("beacon.rssimsg"),
          type: "warning",
        });
        return;
      }
      //通过rssi1和rssi2计算a和n的值
      that.addData.a = Math.abs(that.addData.rssi1);
      let n1 = (that.addData.rssi1 - that.addData.rssi2) / 3.01;
      that.addData.n = n1.toFixed(5);

      if (that.addData.rssi1 == "") {
        that.addData.rssi1 = -59;
      }
      if (that.addData.rssi2 == "") {
        that.addData.rssi2 = -69;
      }
      this.$refs[addData].validate((valid) => {
        if (valid) {
          if (that.contrForPrionum != 1 && that.contrForPrionum != 2) {
            that.addData.tenantid = that.tenantid_A;
            that.addData.custom = 2;
          }
          if (that.addData.num == "" || that.addData.num == 0) {
            that.addData.num = 1;
          }
          this.loading = true;
          addBeacon(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.loading = false;

              that.$refs[addData].resetFields();
              that.getBeaconLists();
              that.$message({
                message: that.$t("beacon.addsuccess"),
                type: "success",
              });
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

    // 编辑一个beacon
    editBeacon(index) {
      var that = this;
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        if (this.tableData[index].custom == 2) {
          that.$message({
            message: this.$t("beacon.deletebeaconsmsg7"),
            type: "warning",
          });
          return;
        }
      }
      this.editData.beaconid = this.tableData[index].beaconid;
      this.editData.inuse = this.tableData[index].inuse;
      this.editData.type = this.tableData[index].type;
      this.editData.rssi1 = this.tableData[index].rssi1;
      this.editData.rssi2 = this.tableData[index].rssi2;
      this.editData.a = this.tableData[index].a;
      this.editData.n = this.tableData[index].n;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.memo = this.tableData[index].memo;
      this.editData.major = this.tableData[index].major;
      this.editData.minor = this.tableData[index].minor;
      this.editData.workstate = this.tableData[index].workstate;
      this.editData.sysmemo = this.tableData[index].sysmemo;
      this.editData.alias = this.tableData[index].alias;
      this.editData.h = this.tableData[index].h;

      if (this.tableData[index].inallot == 2) {
        this.BeaconTypes = false;
        this.editTenantid = false;
        this.editmajor = false;
      } else {
        this.BeaconTypes = true;
        this.editTenantid = true;
        this.editmajor = true;
      }

      if (this.contrForPrionum == 1) {
        this.editRules.tenantid = [
          {
            required: true,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ];
      } else {
        this.editRules.tenantid = [
          {
            required: false,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ];
      }
      this.edit = true;
    },

    editCancle(editData) {
      this.edit = false;
      this.loading = false;
      this.$refs[editData].resetFields();
    },
    editTrue(editData) {
      var that = this;
      //rssi1和rssi2的默认值分别是-59，-69，并且rss1要大于rssi2
      if (that.editData.rssi1 == "") {
        that.editData.rssi1 = -59;
      }
      if (that.editData.rssi2 == "") {
        that.editData.rssi2 = -69;
      }
      that.editData.rssi1 = that.editData.rssi1 * 1;
      that.editData.rssi2 = that.editData.rssi2 * 1;
      if (
        that.editData.rssi1 < that.editData.rssi2 ||
        that.editData.rssi1 == that.editData.rssi2
      ) {
        that.$message({
          message: this.$t("beacon.rssimsg"),
          type: "warning",
        });
        return;
      }
      //通过rssi1和rssi2计算a和n的值
      that.editData.a = Math.abs(that.editData.rssi1);
      let n1 = (that.editData.rssi1 - that.editData.rssi2) / 3.01;
      that.editData.n = n1.toFixed(5);

      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (!that.changeMajor) {
            that.editData.major = that.editData.major.toString(16);
            switch (that.editData.major.length) {
              case 1:
                that.editData.major = "000" + that.editData.major;
                break;
              case 2:
                that.editData.major = "00" + that.editData.major;
                break;
              case 3:
                that.editData.major = "0" + that.editData.major;
                break;
              default:
                break;
            }
          }
          if (!that.changeMinor) {
            that.editData.minor = that.editData.minor.toString(16);
            switch (that.editData.minor.length) {
              case 1:
                that.editData.minor = "000" + that.editData.minor;
                break;
              case 2:
                that.editData.minor = "00" + that.editData.minor;
                break;
              case 3:
                that.editData.minor = "0" + that.editData.minor;
                break;
              default:
                break;
            }
          }
          this.loading = true;
          updateBeacon(
            that.editData,
            that.tenantkey_A,
            that.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.getBeaconLists();
              that.$message({
                message: that.$t("beacon.editsuccess"),
                type: "success",
              });
              that.loading = false;
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

    // 批量编辑beacon
    editBeacons(index) {
      this.editDatas.beaconidlist = "";
      this.BeaconTypes = false;
      var that = this;
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].custom == 2) {
            that.$message({
              message: this.$t("beacon.deletebeaconsmsg8"),
              type: "warning",
            });
            return;
          }
        }
      }
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("beacon.chosebeacon"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        that.editDatas.beaconidlist += that.multipleSelection[i].beaconid + ",";
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inallot == 1) {
          this.BeaconTypes = true;
        }
      }
      // 去掉最后一个逗号
      that.editDatas.beaconidlist = that.editDatas.beaconidlist.slice(
        0,
        that.editDatas.beaconidlist.length - 1
      );

      if (this.contrForPrionum == 1) {
        this.editRules.tenantid = [
          {
            required: true,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ];
      } else {
        this.editRules.tenantid = [
          {
            required: false,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ];
      }
      this.edits = true;
    },
    editscancel(editDatas) {
      this.edits = false;
      this.loading = false;
      this.editDatas = {
        beaconidlist: "",
        type: "",
        rssi1: "-59",
        rssi2: "-69",
        a: "",
        n: "",
        tenantid: "",
        memo: "",
        projectid: "",
        sysmemo: "",
        h: "",
      };
      this.$refs[editDatas].resetFields();
    },
    editsTrue(editDatas) {
      var that = this;
      //rssi1和rssi2的默认值分别是-59，-69，并且rss1要大于rssi2
      if (that.editDatas.rssi1 == "") {
        that.editDatas.rssi1 = -59;
      }
      if (that.editDatas.rssi2 == "") {
        that.editDatas.rssi2 = -69;
      }
      that.editDatas.rssi1 = that.editDatas.rssi1 * 1;
      that.editDatas.rssi2 = that.editDatas.rssi2 * 1;
      if (
        that.editDatas.rssi1 < that.editDatas.rssi2 ||
        that.editDatas.rssi1 == that.editDatas.rssi2
      ) {
        that.$message({
          message: this.$t("beacon.rssimsg"),
          type: "warning",
        });
        return;
      }
      //通过rssi1和rssi2计算a和n的值
      that.editDatas.a = Math.abs(that.editDatas.rssi1);
      let n1 = (that.editDatas.rssi1 - that.editDatas.rssi2) / 3.01;
      that.editDatas.n = n1.toFixed(5);
      this.$refs[editDatas].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateBeaconList(
            that.editDatas,
            that.tenantkey_A,
            that.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edits = false;
              that.getBeaconLists();
              that.$message({
                message: that.$t("beacon.editsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs[editDatas].resetFields();
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

    // 删除
    delBeacons(index) {
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
      if (this.tableData[index].inallot == 1) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg9"),
          type: "warning",
        });
        return;
      }
      if (this.tableData[index].inuse == 1) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg1"),
          type: "warning",
        });
        return;
      }
      //系统分配的设备无法删除
      if (
        (this.contrForPrionum == 3 && this.tableData[index].custom == 1) ||
        (this.contrForPrionum == 4 && this.tableData[index].custom == 1)
      ) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg2"),
          type: "warning",
        });
        return;
      } else if (
        this.contrForPrionum == 1 &&
        this.tableData[index].custom == 2
      ) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg3"),
          type: "warning",
        });
        return;
      }

      this.$confirm(
        this.$t("beacon.deletemsg1") +
          this.tableData[index].beaconid +
          this.$t("beacon.deletemsg2"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          beaconid: that.tableData[index].beaconid,
        };
        delBeacon(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.getBeaconLists();
              that.$message({
                message: that.$t("beacon.deletesuccess"),
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

    //批量删除
    deleteBeacons(index) {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg4"),
          type: "warning",
        });
        return;
      }
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].inallot == 1) {
            that.$message({
              message: this.$t("beacon.deletebeaconsmsg10"),
              type: "warning",
            });
            return;
          }
          if (this.multipleSelection[i].custom != 1) {
            that.$message({
              message: this.$t("beacon.deletebeaconsmsg11"),
              type: "warning",
            });
            return;
          }
        }
      } else {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].inallot == 1) {
            that.$message({
              message: this.$t("beacon.deletebeaconsmsg10"),
              type: "warning",
            });
            return;
          }
          if (this.multipleSelection[i].custom != 2) {
            that.$message({
              message: this.$t("beacon.deletebeaconsmsg6"),
              type: "warning",
            });
            return;
          }
        }
      }

      this.deleteData = this.multipleSelection;
      this.del = true;
    },

    deleteTrue() {
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
      let data = {
        beaconids: [],
      };
      for (var i = 0; i < this.deleteData.length; i++) {
        data.beaconids.push(this.deleteData[i].beaconid);
      }
      this.loading = true;
      delBeaconList(
        JSON.stringify(data),
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.del = false;
          that.getBeaconLists();
          that.$message({
            message: that.$t("beacon.deletesuccess"),
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
      });
    },
    // 正向项目定位
    goLocationDetails(index) {
      var that = this;
      if (this.tableData[index].inuse == 2) {
        that.$message({
          message: this.$t("terminal.tet39"),
          type: "success",
        });
        return;
      }
      if (this.tableData[index].type == 3) {
        that.$router.push({
          path: "/location/indoor/locationindoor",
          query: { assetDeveui: that.tableData[index].beaconid },
        });
      } else {
        let data = {
          id: that.tableData[index].groundid,
        };
        getBuildGroundOne(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$router.push({
              path: "/location/buildingdetails",
              query: {
                beaconid: that.tableData[index].beaconid,
                buildid: res.data.buildid,
                groundid: that.tableData[index].groundid,
              },
            });
          }
        });
      }
    },
    // 反向项目定位
    goLocation(index) {
      var that = this;
      if (this.tableData[index].inuse == 2) {
        that.$message({
          message: this.$t("terminal.tet39"),
          type: "success",
        });
        return;
      }
      if (this.tableData[index].type == 3) {
        that.$router.push({
          path: "/location/indoor/locationindoor",
          query: { assetDeveui: that.tableData[index].beaconid },
        });
      } else if (this.tableData[index].type == 4) {
        let data = {
          deveui: that.tableData[index].beaconid,
          projectid: that.tableData[index].projectid,
          devtype: 1,
        };
        getDevGpsOne(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
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
                  query: { deveui: res.data.deveui },
                });
              } else if (res.data.postype == 2) {
                that.$router.push({
                  path: "/location/outdoor/locationoutdoor",
                  query: { deveui: res.data.deveui },
                });
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
    //分配信标
    assignBeacon(index) {
      if (this.tableData[index].inallot == 1) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg14"),
          type: "warning",
        });
        return;
      }
      this.assignData.beaconids = this.tableData[index].beaconid;
      this.assign = true;
    },
    assignTrue(assignData) {
      var that = this;
      this.$refs[assignData].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateBeaconByBeaconids(
            this.assignData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.assign = false;
              that.getBeaconLists();
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
          });

          this.assign = false;
        } else {
          return false;
        }
      });
    },

    //批量分配信标
    assignBeacons(index) {
      var that = this;
      this.assignDatas.beaconids = "";
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg11"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inallot == 1) {
          this.$message({
            message: this.$t("beacon.deletebeaconsmsg10"),
            type: "warning",
          });
          return;
        }

        that.assignDatas.beaconids += that.multipleSelection[i].beaconid + ",";
      }
      // 去掉最后一个逗号
      that.assignDatas.beaconids = that.assignDatas.beaconids.slice(
        0,
        that.assignDatas.beaconids.length - 1
      );
      this.assigns = true;
    },

    assignsTrue(assignDatas) {
      var that = this;
      this.$refs[assignDatas].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateBeaconByBeaconids(
            this.assignDatas,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.getBeaconLists();
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
          });

          this.assigns = false;
        } else {
          return false;
        }
      });
    },

    //解除信标
    recycleBeacon(index) {
      var that = this;
      if (this.tableData[index].inallot == 2) {
        this.$message({
          message: this.$t("beacon.tet12"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("beacon.tet13") +
          this.tableData[index].beaconid +
          this.$t("beacon.deletemsg2"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          beaconids: that.tableData[index].beaconid,
        };
        updateRemoveProjectByBeaconids(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.getBeaconLists();
            that.$message({
              message: that.$t("beacon.noassinsuccess"),
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

    //批量解除信标
    removeBeacons(index) {
      var that = this;
      this.removeBeaconDatas.beaconids = "";
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("beacon.deletebeaconsmsg12"),
          type: "warning",
        });
        return;
      }

      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inallot == 2) {
          this.$message({
            message: this.$t("beacon.deletebeaconsmsg13"),
            type: "warning",
          });
          return;
        }
        that.removeBeaconDatas.beaconids +=
          that.multipleSelection[i].beaconid + ",";
      }
      // 去掉最后一个逗号
      that.removeBeaconDatas.beaconids = that.removeBeaconDatas.beaconids.slice(
        0,
        that.removeBeaconDatas.beaconids.length - 1
      );

      this.removeDatas = this.multipleSelection;
      this.removeBeacon = true;
    },
    removeTrue() {
      var that = this;
      this.loading = true;
      updateRemoveProjectByBeaconids(
        this.removeBeaconDatas,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.removeBeacon = false;
          that.getBeaconLists();
          that.$message({
            message: that.$t("beacon.noassinsuccess"),
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
      });
    },

    // 搜索
    searchInfo() {
      this.changeMajor = true;
      this.changeMinor = true;
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.tasktime && this.tasktime.length > 0) {
        this.searchList.begintime =
          Date.parse(new Date(that.tasktime[0])) / 1000;
        this.searchList.endtime = Date.parse(new Date(that.tasktime[1])) / 1000;
      } else {
        this.searchList.begintime = "";
        this.searchList.endtime = "";
      }
      if (this.changeMemo == false) {
        if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
          that.searchList.likesysmemo = that.selectMemo;
          that.searchList.sysmemo = "";
        } else {
          that.searchList.likememo = that.selectMemo;
          that.searchList.memo = "";
        }
      } else {
        if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
          that.searchList.sysmemo = that.selectMemo;
          that.searchList.likesysmemo = "";
        } else {
          that.searchList.memo = that.selectMemo;
          that.searchList.likememo = "";
        }
      }

      switch (this.batterys) {
        case 1:
          this.searchList.beginbat = 60;
          this.searchList.endbat = 100;
          break;
        case 2:
          this.searchList.beginbat = 20;
          this.searchList.endbat = 60;
          break;
        case 3:
          this.searchList.beginbat = "";
          this.searchList.endbat = 20;
          break;
        default:
          this.searchList.beginbat = "";
          this.searchList.endbat = "";
          break;
      }

      let tasktimes = [
        new Date(new Date().setHours(0, 0, 0, 0)) / 1000 - 86400 * 2,
        Date.parse(new Date()) / 1000,
      ];
      switch (this.devtimes) {
        case 1:
          this.searchList.starttime = tasktimes[0];
          this.searchList.overtime = tasktimes[1];
          break;
        case 2:
          this.searchList.starttime = 0;
          this.searchList.overtime = tasktimes[0];
          break;
        case 3:
          this.searchList.starttime = "";
          this.searchList.overtime = 0;
          break;
        default:
          this.searchList.starttime = "";
          this.searchList.overtime = "";
          break;
      }
      getBeaconList(
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
              type: "success",
            });
          }
        } else {
          that.searchList.count = 20;
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 刷新
    clearBtn() {
      this.changeMajor = true;
      this.changeMinor = true;
      if (this.$router.query) {
        this.$router.push({ query: {} });
      }
      this.searchBeaconType = ""; //信标类型
      this.searchInallot = ""; //分配状态
      this.searchInuse = ""; //使用状态
      this.batterys = "";
      this.devtimes = "";
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          beaconid: "",
          minor: "",
          major: "",
          inuse: "",
          workstate: "",
          type: "",
          tenantid: "",
          memo: "",
          sysmemo: "",
          likememo: "",
          likesysmemo: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: this.pageCount,
          projectid: "",
          inallot: "",
          beginbat: "",
          endbat: "",
          starttime: "",
          overtime: "",
        };
        this.selectMemo = "";
      } else if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4
      ) {
        this.searchList = {
          beaconid: "",
          minor: "",
          major: "",
          inuse: "",
          workstate: "",
          type: "",
          tenantid: this.$store.state.userInfo.tenantid,
          memo: "",
          sysmemo: "",
          likememo: "",
          likesysmemo: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: this.pageCount,
          projectid: "",
          inallot: "",
          beginbat: "",
          endbat: "",
          starttime: "",
          overtime: "",
        };
        this.selectMemo = "";
      } else if (this.$store.state.userInfo.prionum == 5) {
        this.searchList = {
          beaconid: "",
          minor: "",
          major: "",
          inuse: "",
          workstate: "",
          type: "",
          tenantid: this.$store.state.intoProjectSuperid,
          memo: "",
          sysmemo: "",
          likememo: "",
          likesysmemo: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: this.pageCount,
          projectid: this.$store.state.projectid,
          inallot: "",
          beginbat: "",
          endbat: "",
          starttime: "",
          overtime: "",
        };
      }
      this.tasktime = [];
      this.currentPage1 = 1;
      this.getBeaconLists();
    },

    //获取所有的Tenantid
    getCustomerNames() {
      let data = {
        beginlevel: 1,
        endlevel: 3,
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

    //获取项目下拉框 getProjectListByTenantid
    getProjectListByTenantids() {
      let data;
      if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4
      ) {
        data = {
          superid: this.$store.state.userInfo.tenantid,
        };
      } else {
        data = {
          tenantid: this.$store.state.userInfo.tenantid,
        };
      }
      getProjectListByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.username
      ).then((res) => {
        if (res.code == 1001) {
          this.projectList = res.data.list;
        }
      });
    },
  },
  beforeMount() {
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2
    ) {
      this.searchList = {
        beaconid: "",
        minor: "",
        major: "",
        inuse: "",
        workstate: "",
        type: "",
        tenantid: "",
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        projectid: "",
        inallot: "",
        beginbat: "",
        endbat: "",
        starttime: "",
        overtime: "",
      };
      this.getCustomerNames();
    }
    if (this.$store.state.userInfo.prionum == 5) {
      this.searchList = {
        beaconid: "",
        minor: "",
        major: "",
        inuse: "",
        workstate: "",
        type: "",
        tenantid: this.$store.state.intoProjectSuperid,
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        projectid: this.$store.state.projectid,
        inallot: "",
        beginbat: "",
        endbat: "",
        starttime: "",
        overtime: "",
      };
    }

    if (
      this.$store.state.userInfo.prionum == 3 ||
      this.$store.state.userInfo.prionum == 4
    ) {
      this.searchList = {
        beaconid: "",
        minor: "",
        major: "",
        inuse: "",
        workstate: "",
        type: "",
        tenantid: this.$store.state.userInfo.tenantid,
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        projectid: "",
        inallot: "",
        beginbat: "",
        endbat: "",
        starttime: "",
        overtime: "",
      };
      this.getProjectListByTenantids();
    }

    if (this.$route.query.beaconid) {
      this.searchList.beaconid = this.$route.query.beaconid;
    } else if (this.$route.query.type) {
      this.searchList.type = Number(this.$route.query.type);
    } else if (this.$route.query.inallot) {
      this.searchList.inallot = Number(this.$route.query.inallot);
    } else if (this.$route.query.inuse) {
      this.searchList.inuse = Number(this.$route.query.inuse);
    } else if (this.$route.query.devtimes) {
      this.devtimes = Number(this.$route.query.devtimes);
      let tasktimes = [
        new Date(new Date().setHours(0, 0, 0, 0)) / 1000 - 86400 * 2,
        Date.parse(new Date()) / 1000,
      ];
      switch (this.devtimes) {
        case 1:
          this.searchList.starttime = tasktimes[0];
          this.searchList.overtime = tasktimes[1];
          break;
        case 2:
          this.searchList.starttime = 0;
          this.searchList.overtime = tasktimes[0];
          break;
        case 3:
          this.searchList.starttime = "";
          this.searchList.overtime = 0;
          break;
        default:
          this.searchList.starttime = "";
          this.searchList.overtime = "";
          break;
      }
    } else if (this.$route.query.batterys) {
      this.batterys = Number(this.$route.query.batterys);
      switch (this.batterys) {
        case 1:
          this.searchList.beginbat = 60;
          this.searchList.endbat = 100;
          break;
        case 2:
          this.searchList.beginbat = 20;
          this.searchList.endbat = 60;
          break;
        case 3:
          this.searchList.beginbat = "";
          this.searchList.endbat = 20;
          break;
        default:
          this.searchList.beginbat = "";
          this.searchList.endbat = "";
          break;
      }
    }

    this.getBeaconLists();
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
        this.$data.searchInallotList,
        this.$options.data.call(this).searchInallotList
      );
      Object.assign(
        this.$data.searchBatteryList,
        this.$options.data.call(this).searchBatteryList
      );
      Object.assign(
        this.$data.devtimeList,
        this.$options.data.call(this).devtimeList
      );
      Object.assign(
        this.$data.beaconType,
        this.$options.data.call(this).beaconType
      );
      Object.assign(
        this.$data.inuseType,
        this.$options.data.call(this).inuseType
      );
      Object.assign(
        this.$data.workType,
        this.$options.data.call(this).workType
      );
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
.el-main {
  width: 98%;
}
#item1 {
  display: none;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
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
.selects button {
  width: 100%;
  text-align: left;
}
.query,
.reset,
.delBeacons,
.addBeacon,
.editBeacons,
.dels {
  padding: 8px 12px !important;
}
/* 按钮改变颜色 */
.editBeacons:hover,
.delBeacons:hover,
.edits:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.delss:hover {
  background-color: rgb(196, 27, 27);
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

.chose >>> button {
  padding: 0;
  line-height: 34px;
  border: 0;
}

.memo >>> .el-input {
  width: 80%;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.icon_button {
  padding: 2px 16px !important;
}
</style>
