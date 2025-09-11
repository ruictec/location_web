<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>

    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Devicemanagement /></el-aside>
        <el-main>
          <div class="ter_input">
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
                :label="$t('terminal.deveui')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.deveui"
                ></el-input>
              </el-form-item>

              <el-form-item
                v-if="show"
                :label="$t('terminal.alias')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.alias"
                ></el-input>
              </el-form-item>

              <el-form-item
                v-if="show && contrForPrionum != 5"
                :label="$t('terminal.scheme')"
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
                v-if="show && contrForPrionum != 5"
                :label="$t('terminal.posttype')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.postype"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in postypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="show && contrForPrionum != 5"
                :label="$t('terminal.joinmode')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.joinmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in joinmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('terminal.country')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="show && (contrForPrionum == 1 || contrForPrionum == 2)"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.country"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in searchSelectCountry"
                    :key="item.tenantid"
                    :label="item.country"
                    :value="item.country"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('terminal.inuse')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="
                  (contrForPrionum == 3 ||
                    contrForPrionum == 4 ||
                    contrForPrionum == 5) &&
                  show
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.inuse"
                  clearable
                  filterable
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

              <!-- 企业用户 -->
              <el-form-item
                v-if="show && contrForPrionum == 5"
                :label="$t('terminal.workstate')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
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
                v-if="show && contrForPrionum == 5"
                :label="$t('terminal.chosetime')"
                style="margin-left: 1%; display: flex"
              >
                <el-date-picker
                  style="width: 100%; float: left; z-index: 1"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('terminal.to')"
                  :start-placeholder="$t('terminal.starttime')"
                  :end-placeholder="$t('terminal.endtime')"
                  align="left"
                  v-model="tasktime"
                >
                </el-date-picker>
              </el-form-item>

              <!-- 按钮 更多-->
              <el-form-item v-if="seen" style="display: flex; margin-left: 0%">
                <!-- 高级 -->
                <span class="el-dropdown-link" @click="changeItem()">
                  {{ $t("terminal.more")
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>

                <el-button
                  type="primary"
                  class="query"
                  @click="searchInfo()"
                  style="margin-right: 0"
                  >{{ $t("terminal.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="clearBtn()"
                  style="margin-left: 0"
                  >{{ $t("terminal.reset") }}</el-button
                >

                <el-button
                  type="primary"
                  class="export"
                  @click="importExcel()"
                  v-if="contrForPrionum != 5"
                  style="margin-left: 0%"
                  >{{ $t("terminal.import") }}</el-button
                >
                <el-button
                  type="primary"
                  class="export"
                  @click="exportExcel()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                  style="margin-left: 0%"
                  >{{ $t("terminal.export") }}</el-button
                >

                <el-button
                  type="primary"
                  class="addTer"
                  @click="addTer()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                  style="margin-left: 0"
                  >{{ $t("terminal.addterminal") }}</el-button
                >
                <el-dropdown
                  size="small"
                  type="primary"
                  trigger="hover"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                >
                  <el-button type="primary" size="small">
                    {{ $t("terminal.batch")
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
                        class="editTers"
                        @click="editTers()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.edit") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="configTers"
                        @click="configTers()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.deploy") }}</el-button
                      ></el-dropdown-item
                    >

                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delTers"
                        @click="devToNs()"
                        v-if="contrForPrionum == 1 || contrForPrionum == 2"
                        >{{ $t("terminal.synchronization") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        size="mini"
                        class="configTers"
                        @click="extendTerminals()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.Extend") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delTers"
                        @click="assignTers()"
                        v-if="contrForPrionum == 3 || contrForPrionum == 4"
                        >{{ $t("terminal.assign") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delTers"
                        @click="removeTers()"
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
                        @click="delTers()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.delete") }}</el-button
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown
                  size="small"
                  type="primary"
                  trigger="hover"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4 ||
                    contrForPrionum == 5
                  "
                >
                  <el-button type="primary" size="small">
                    {{ $t("terminal.command")
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
                        size="small"
                        class="edits"
                        @click="sendDownLinks(1)"
                        >{{ $t("terminal.Remotereboot") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                    >
                      <el-button
                        size="small"
                        class="edits"
                        @click="sendDownLinks(2)"
                        >{{ $t("terminal.Remoteshutdown") }}</el-button
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
                        @click="sendDownLinks(3)"
                        >{{ $t("terminal.Remotesearch") }}</el-button
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
                        @click="sendDownLinks(4)"
                        >{{ $t("terminal.Cancelsearch") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(0)"
                        >{{ $t("terminal.Requestlocation") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(5)"
                        >{{ $t("terminal.Positioningbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(6)"
                        >{{ $t("terminal.Assetbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(7)"
                        >{{ $t("terminal.Transparentbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(8)"
                        >{{ $t("terminal.Confirmationbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>

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
                    <p v-show="contrForPrionum != 5">
                      {{ $t("terminal.title") }}
                    </p>
                    <p>{{ $t("terminal.context") }}</p>
                    <p>
                      {{ $t("terminal.context1") }}
                    </p>
                    <p>
                      {{ $t("terminal.context2") }}
                    </p>
                    <p v-if="contrForPrionum != 5">
                      {{ $t("terminal.title1") }}
                    </p>
                    <p v-if="contrForPrionum != 5">
                      {{ $t("terminal.title2") }}
                    </p>
                    <p v-if="contrForPrionum != 5">
                      {{ $t("terminal.title3") }}
                    </p>
                    <p v-if="contrForPrionum == 3 || contrForPrionum == 4">
                      {{ $t("terminal.title4") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-form>
            <!-- 第二行 -->
            <el-form
              class="demo-form-inline"
              style="
                display: flex;
                white-space: nowrap;
                margin-left: 1%;
                z-index: 1;
              "
            >
              <el-form-item
                :label="$t('terminal.Hardwaretype')"
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
                  v-model="searchList.devtype"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in searchDevTypeList"
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
                :label="$t('terminal.onlinestatus')"
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
                  style="width: 95%; float: left"
                  v-model="searchList.hbstatus"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in searchHbstatusList"
                    :key="item.inddex"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.battery')"
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
                  style="width: 95%; float: left"
                  v-model="batterys"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
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
                    v-for="item in searchProjectList"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option>
                </el-select>
              </el-form-item>

              <!-- 按钮 权限5 -->
              <el-form-item
                v-if="show && contrForPrionum == 5"
                style="margin-left: 0%"
              >
                <span class="el-dropdown-link" @click="changeItem()">
                  {{ $t("terminal.putAway")
                  }}<i class="el-icon-arrow-up el-icon--right"></i>
                </span>
                <el-button
                  type="primary"
                  class="query"
                  @click="searchInfo()"
                  style="margin-right: 0"
                  >{{ $t("terminal.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="clearBtn()"
                  style="margin-left: 0"
                  >{{ $t("terminal.reset") }}</el-button
                >

                <el-dropdown
                  size="small"
                  type="primary"
                  trigger="hover"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4 ||
                    contrForPrionum == 5
                  "
                >
                  <el-button type="primary" size="small">
                    {{ $t("terminal.command")
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
                        size="small"
                        class="edits"
                        @click="sendDownLinks(1)"
                        >{{ $t("terminal.Remotereboot") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                    >
                      <el-button
                        size="small"
                        class="edits"
                        @click="sendDownLinks(2)"
                        >{{ $t("terminal.Remoteshutdown") }}</el-button
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
                        @click="sendDownLinks(3)"
                        >{{ $t("terminal.Remotesearch") }}</el-button
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
                        @click="sendDownLinks(4)"
                        >{{ $t("terminal.Cancelsearch") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(0)"
                        >{{ $t("terminal.Requestlocation") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(5)"
                        >{{ $t("terminal.Positioningbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(6)"
                        >{{ $t("terminal.Assetbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(7)"
                        >{{ $t("terminal.Transparentbeacon") }}</el-button
                      ></el-dropdown-item
                    ><el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(8)"
                        >{{ $t("terminal.Confirmationbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>

              <el-form-item
                v-if="show && contrForPrionum != 5"
                :label="$t('terminal.workstate')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
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
                :label="$t('terminal.inuse')"
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
                  v-model="searchList.inuse"
                  clearable
                  filterable
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
            </el-form>
            <!-- 第三行 -->
            <el-form
              class="demo-form-inline"
              v-if="
                show &&
                (contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4)
              "
              style="
                display: flex;
                white-space: nowrap;
                margin-left: 1%;
                z-index: 1;
              "
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
                    :active-text="$t('terminal.exact')"
                    :inactive-text="$t('terminal.blur')"
                    @change="choseMemo"
                  >
                  </el-switch>
                  <el-input
                    style="width: 95%; float: left"
                    slot="reference"
                    v-model="selectMemo"
                    :placeholder="$t('terminal.Pleaseenter')"
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
                :label="$t('beacon.memo11')"
                v-if="
                  contrForPrionum != 1 &&
                  contrForPrionum != 2 &&
                  show &&
                  contrForPrionum != 5
                "
              >
                <el-popover placement="bottom" trigger="click" class="chose">
                  <el-switch
                    v-model="value1"
                    :active-text="$t('terminal.exact')"
                    :inactive-text="$t('terminal.blur')"
                    @change="choseMemo"
                  >
                  </el-switch>
                  <el-input
                    style="width: 95%; float: left"
                    slot="reference"
                    v-model="selectMemo"
                    :placeholder="$t('terminal.Pleaseenter')"
                  ></el-input>
                </el-popover>
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
                v-if="show && contrForPrionum != 5"
                :label="$t('terminal.chosetime')"
                style="display: flex; margin-left: 1%; margin-right: 0"
              >
                <el-date-picker
                  style="width: 100%; float: left"
                  v-model="tasktime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('terminal.to')"
                  :start-placeholder="$t('terminal.startdate')"
                  :end-placeholder="$t('terminal.enddate')"
                  align="left"
                >
                </el-date-picker>
              </el-form-item>

              <!-- 按钮 权限3和4 -->
              <el-form-item
                style="display: flex; margin-left: 1%"
                v-if="show && (contrForPrionum == 3 || contrForPrionum == 4)"
              >
                <span
                  v-if="show && (contrForPrionum == 3 || contrForPrionum == 4)"
                  style="margin: left"
                >
                  <el-form-item style="margin-left: 0%">
                    <span class="el-dropdown-link" @click="changeItem()">
                      {{ $t("terminal.putAway")
                      }}<i class="el-icon-arrow-up el-icon--right"></i>
                    </span>
                    <el-button
                      type="primary"
                      class="query"
                      @click="searchInfo()"
                      style="margin-right: 0"
                      >{{ $t("terminal.search") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="reset"
                      @click="clearBtn()"
                      style="margin-left: 0"
                      >{{ $t("terminal.reset") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="export"
                      @click="importExcel()"
                      v-if="contrForPrionum != 5"
                      style="margin-left: 0%"
                      >{{ $t("terminal.import") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="export"
                      @click="exportExcel()"
                      v-if="contrForPrionum != 5"
                      style="margin-left: 0%"
                      >{{ $t("terminal.export") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="addTer"
                      @click="addTer()"
                      v-if="contrForPrionum != 5"
                      >{{ $t("terminal.addterminal") }}</el-button
                    >
                    <!-- 批量操作 -->
                    <el-dropdown
                      size="small"
                      type="primary"
                      trigger="hover"
                      v-if="contrForPrionum != 5"
                    >
                      <el-button type="primary" size="small">
                        {{ $t("terminal.batch")
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
                            class="editTers"
                            @click="editTers()"
                            v-if="
                              contrForPrionum == 1 ||
                              contrForPrionum == 2 ||
                              contrForPrionum == 3 ||
                              contrForPrionum == 4
                            "
                            >{{ $t("terminal.edit") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          ><el-button
                            class="configTers"
                            @click="configTers()"
                            v-if="
                              contrForPrionum == 1 ||
                              contrForPrionum == 2 ||
                              contrForPrionum == 3 ||
                              contrForPrionum == 4
                            "
                            >{{ $t("terminal.deploy") }}</el-button
                          ></el-dropdown-item
                        >

                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          ><el-button
                            class="delTers"
                            @click="devToNs()"
                            v-if="contrForPrionum == 1 || contrForPrionum == 2"
                            >{{ $t("terminal.synchronization") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          ><el-button
                            size="mini"
                            class="configTers"
                            @click="extendTerminals()"
                            v-if="
                              contrForPrionum == 1 ||
                              contrForPrionum == 2 ||
                              contrForPrionum == 3 ||
                              contrForPrionum == 4
                            "
                            >{{ $t("terminal.Extend") }}</el-button
                          ></el-dropdown-item
                        >

                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          ><el-button
                            class="delTers"
                            @click="assignTers()"
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
                            class="delTers"
                            @click="removeTers()"
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
                            @click="delTers()"
                            v-if="
                              contrForPrionum == 1 ||
                              contrForPrionum == 2 ||
                              contrForPrionum == 3 ||
                              contrForPrionum == 4
                            "
                            >{{ $t("terminal.delete") }}</el-button
                          ></el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                    <!-- 批量命令 -->
                    <el-dropdown size="small" type="primary" trigger="hover">
                      <el-button type="primary" size="small">
                        {{ $t("terminal.command")
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
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                        >
                          <el-button
                            size="small"
                            class="edits"
                            @click="sendDownLinks(1)"
                            >{{ $t("terminal.Remotereboot") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                        >
                          <el-button
                            size="small"
                            class="edits"
                            @click="sendDownLinks(2)"
                            >{{ $t("terminal.Remoteshutdown") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          ><el-button
                            size="mini"
                            class="dels"
                            @click="sendDownLinks(3)"
                            >{{ $t("terminal.Remotesearch") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          ><el-button
                            size="mini"
                            class="dels"
                            @click="sendDownLinks(4)"
                            >{{ $t("terminal.Cancelsearch") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          ><el-button
                            size="small"
                            class="dels"
                            @click="sendDownLinks(0)"
                            >{{ $t("terminal.Requestlocation") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          ><el-button
                            size="small"
                            class="dels"
                            @click="sendDownLinks(5)"
                            >{{ $t("terminal.Positioningbeacon") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          ><el-button
                            size="small"
                            class="dels"
                            @click="sendDownLinks(6)"
                            >{{ $t("terminal.Assetbeacon") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          ><el-button
                            size="small"
                            class="dels"
                            @click="sendDownLinks(7)"
                            >{{ $t("terminal.Transparentbeacon") }}</el-button
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          style="
                            margin-top: 4%;
                            background-color: rgb(219, 222, 231);
                          "
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          ><el-button
                            size="small"
                            class="dels"
                            @click="sendDownLinks(8)"
                            >{{ $t("terminal.Confirmationbeacon") }}</el-button
                          ></el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>
                </span>
              </el-form-item>
              <!-- 按钮 权限1和2 -->
              <el-form-item
                style="display: flex; margin-left: 0%"
                v-if="show && (contrForPrionum == 1 || contrForPrionum == 2)"
              >
                <span class="el-dropdown-link" @click="changeItem()">
                  {{ $t("terminal.putAway")
                  }}<i class="el-icon-arrow-up el-icon--right"></i>
                </span>
                <el-button
                  type="primary"
                  class="query"
                  @click="searchInfo()"
                  style="margin-right: 0%"
                  >{{ $t("terminal.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="clearBtn()"
                  style="margin-left: 0%"
                  >{{ $t("terminal.reset") }}</el-button
                >
                <el-button
                  type="primary"
                  class="export"
                  @click="importExcel()"
                  style="margin-left: 0%"
                  >{{ $t("terminal.import") }}</el-button
                >
                <el-button
                  type="primary"
                  class="export"
                  @click="exportExcel()"
                  style="margin-left: 0%"
                  >{{ $t("terminal.export") }}</el-button
                >
                <el-button
                  type="primary"
                  class="addTer"
                  @click="addTer()"
                  v-if="contrForPrionum == 1 || contrForPrionum == 2"
                  style="margin-left: 0%"
                  >{{ $t("terminal.addterminal") }}</el-button
                >
                <el-dropdown
                  size="small"
                  type="primary"
                  trigger="hover"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                >
                  <el-button type="primary" size="small">
                    {{ $t("terminal.batch")
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
                        class="editTers"
                        @click="editTers()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.edit") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="configTers"
                        @click="configTers()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.deploy") }}</el-button
                      ></el-dropdown-item
                    >

                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delTers"
                        @click="devToNs()"
                        v-if="contrForPrionum == 1 || contrForPrionum == 2"
                        >{{ $t("terminal.synchronization") }}</el-button
                      ></el-dropdown-item
                    >

                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        size="mini"
                        class="configTers"
                        @click="extendTerminals()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.Extend") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delTers"
                        @click="assignTers()"
                        v-if="contrForPrionum == 3 || contrForPrionum == 4"
                        >{{ $t("terminal.assign") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        class="delTers"
                        @click="removeTers()"
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
                        @click="delTers()"
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        >{{ $t("terminal.delete") }}</el-button
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>

                <el-dropdown
                  size="small"
                  type="primary"
                  trigger="hover"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4 ||
                    contrForPrionum == 5
                  "
                >
                  <el-button type="primary" size="small">
                    {{ $t("terminal.command")
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
                        size="small"
                        class="edits"
                        @click="sendDownLinks(1)"
                        >{{ $t("terminal.Remotereboot") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                    >
                      <el-button
                        size="small"
                        class="edits"
                        @click="sendDownLinks(2)"
                        >{{ $t("terminal.Remoteshutdown") }}</el-button
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
                        @click="sendDownLinks(3)"
                        >{{ $t("terminal.Remotesearch") }}</el-button
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
                        @click="sendDownLinks(4)"
                        >{{ $t("terminal.Cancelsearch") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(0)"
                        >{{ $t("terminal.Requestlocation") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(5)"
                        >{{ $t("terminal.Positioningbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(6)"
                        >{{ $t("terminal.Assetbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(7)"
                        >{{ $t("terminal.Transparentbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      style="
                        margin-top: 4%;
                        background-color: rgb(219, 222, 231);
                      "
                      v-if="contrForPrionum != 5"
                      ><el-button
                        size="small"
                        class="dels"
                        @click="sendDownLinks(8)"
                        >{{ $t("terminal.Confirmationbeacon") }}</el-button
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-form>
          </div>
          <!-- 设备展示 -->
          <div class="terminal_div">
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
              highlight-current-row
              @selection-change="handleSelectionChange"
              style="
                width: 98%;
                text-align: center;
                margin-left: 2%;
                background-color: #ffffff;
                z-index: 1;
              "
              max-height="660"
              border
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('terminal.DeviceID')"
                show-overflow-tooltip
                fixed="left"
                align="center"
                min-width="150"
                key="1"
              ></el-table-column>
              <el-table-column
                property="alias"
                :label="$t('terminal.alias1')"
                show-overflow-tooltip
                align="center"
                min-width="78"
                key="2"
              ></el-table-column>

              <el-table-column
                property="joinmodestr"
                :label="$t('terminal.mode')"
                show-overflow-tooltip
                align="center"
                min-width="70"
                v-if="contrForPrionum != 5"
                key="3"
              ></el-table-column>

              <el-table-column
                property="schemestr"
                :label="$t('terminal.Standard')"
                show-overflow-tooltip
                align="center"
                min-width="78"
                v-if="contrForPrionum != 5"
                key="4"
              ></el-table-column>

              <el-table-column
                property="devtypestr"
                :label="$t('terminal.type')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                key="5"
              ></el-table-column>
              <el-table-column
                v-if="contrForPrionum != 5"
                key="6"
                property="customstr"
                show-overflow-tooltip
                align="center"
                min-width="120"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("gateway.customstr")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("terminal.title5") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="inallotstr"
                show-overflow-tooltip
                align="center"
                min-width="115"
                v-if="contrForPrionum != 5"
                key="7"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("terminal.assign")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("terminal.title6") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="inusestr"
                :label="$t('terminal.use')"
                show-overflow-tooltip
                align="center"
                min-width="86"
                key="8"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("terminal.use")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("terminal.use1") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'workstatestr' : 'enworkstate'"
                :label="$t('terminal.state')"
                show-overflow-tooltip
                align="center"
                min-width="60"
                key="9"
              ></el-table-column>
              <el-table-column
                property="country"
                :label="$t('terminal.country1')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrionum == '1'"
                key="10"
                min-width="80"
              ></el-table-column>

              <el-table-column
                property="customername"
                :label="$t('terminal.customername')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrionum == '1'"
                key="11"
                min-width="85"
              ></el-table-column>

              <el-table-column
                property="projectname"
                :label="$t('terminal.projectname')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                v-if="contrForPrionum != 5"
                key="12"
              ></el-table-column>

              <el-table-column
                property="ver"
                :label="$t('terminal.ver')"
                show-overflow-tooltip
                align="center"
                min-width="85"
                v-if="contrForPrionum != 5"
                key="13"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("terminal.ver")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("terminal.verHelp") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="hbstatusstr"
                :label="$t('terminal.isonline')"
                show-overflow-tooltip
                align="center"
                min-width="90"
                key="14"
              ></el-table-column>

              <el-table-column
                property="battery"
                :label="$t('terminal.electricity')"
                show-overflow-tooltip
                align="center"
                min-width="85"
                key="15"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("terminal.electricity")
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
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="rssi"
                label="Rssi"
                show-overflow-tooltip
                align="center"
                min-width="50"
                v-if="contrForPrionum != 3 && contrForPrionum != 5"
                key="16"
              ></el-table-column>
              <el-table-column
                property="snr"
                :label="$t('terminal.Signaltonoiseratio')"
                show-overflow-tooltip
                align="center"
                min-width="70"
                v-if="contrForPrionum != 3 && contrForPrionum != 5"
                key="17"
              ></el-table-column>
              <el-table-column
                property="fcnt"
                :label="$t('test.framecount')"
                show-overflow-tooltip
                align="center"
                min-width="85"
                v-if="contrForPrionum != 5"
                key="18"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("test.framecount")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("test.framecountHelp") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="lastchannel"
                show-overflow-tooltip
                align="center"
                min-width="86"
                v-if="contrForPrionum != 5"
                key="19"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0"
                    >{{ $t("terminal.FrequencyPoint") }}
                  </span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("terminal.FrequencyPoint1") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                property="statustime"
                :label="$t('terminal.Statusupdatetime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDateStatustime"
                min-width="110"
                key="20"
              ></el-table-column>
              <el-table-column
                property="tranche"
                :label="$t('beacon.region')"
                show-overflow-tooltip
                min-width="100"
                align="center"
                v-if="
                  (intoProjectType == 2 && contrForPrionum == 5) ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
                key="21"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0"
                    >{{ $t("beacon.region") }}
                  </span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("beacon.regionHelp") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="clockinstr"
                :label="$t('beacon.checkpoint')"
                show-overflow-tooltip
                align="center"
                min-width="120"
                v-if="
                  (intoProjectType == 2 && contrForPrionum == 5) ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
                key="22"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0"
                    >{{ $t("beacon.checkpoint") }}
                  </span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("beacon.checkpointHelp") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="groundid"
                :label="$t('terminal.floornumber')"
                show-overflow-tooltip
                align="center"
                min-width="100"
                key="23"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("terminal.floornumber")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("terminal.floornumber1") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                property="lastx"
                :label="$t('terminal.lastx')"
                show-overflow-tooltip
                align="center"
                min-width="115"
                v-if="contrForPrionum != 5"
                key="24"
              ></el-table-column>
              <el-table-column
                property="lasty"
                :label="$t('terminal.lasty')"
                show-overflow-tooltip
                align="center"
                min-width="115"
                v-if="contrForPrionum != 5"
                key="25"
              ></el-table-column>
              <el-table-column
                property="postime"
                :label="$t('terminal.Locationupdatetime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDateLastxytime"
                min-width="150"
                key="26"
                v-if="intoProjectType != 2"
              ></el-table-column>

              <el-table-column
                v-if="intoProjectType != 1"
                key="27"
                property="warningstr"
                :label="$t('beacon.warning')"
                show-overflow-tooltip
                align="center"
                min-width="110"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">
                    {{ $t("beacon.warning") }}</span
                  >
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("beacon.warningHelp") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'postypestr' : 'enpostype'"
                :label="$t('terminal.postype')"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum != 5"
                key="28"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("terminal.postype")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("terminal.title8") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                property="keyencstr"
                :label="$t('terminal.encryption')"
                show-overflow-tooltip
                align="center"
                min-width="90"
                v-if="contrForPrionum != 5"
                key="29"
              ></el-table-column>
              <el-table-column
                v-if="contrForPrionum != 5"
                property="appeui"
                label="Appeui"
                show-overflow-tooltip
                align="center"
                min-width="140"
                key="30"
              >
              </el-table-column>

              <el-table-column
                property="nwkskey"
                label="Nwkskey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum != 5"
                key="31"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0"> Nwkskey </span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("terminal.NwkskeyTip") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="appkey"
                label="Appkey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum != 5"
                key="32"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0"> Appkey </span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("terminal.AppkeyTip1") }}</p>
                      <p>{{ $t("terminal.AppkeyTip2") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="orignwkskey"
                label="Orignwkskey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum != 5"
                key="33"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">
                    Orignwkskey
                  </span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("terminal.OrignwkskeyTip") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="origappkey"
                label="Origappkey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum != 5"
                key="34"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">
                    Origappkey
                  </span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("terminal.OrigappkeyTip1") }}</p>
                      <p>{{ $t("terminal.OrigappkeyTip2") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="workmodestr"
                :label="$t('terminal.currentstate')"
                show-overflow-tooltip
                align="center"
                min-width="110"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                key="35"
              ></el-table-column>

              <el-table-column
                property="debugmodestr"
                :label="$t('terminal.Debuggingstatus')"
                show-overflow-tooltip
                align="center"
                min-width="130"
                v-if="contrForPrionum != 5"
                key="36"
              ></el-table-column>

              <el-table-column
                property="configmodestr"
                :label="$t('terminal.Configurationmode')"
                show-overflow-tooltip
                align="center"
                min-width="150"
                v-if="contrForPrionum != 5"
                key="37"
              ></el-table-column>

              <el-table-column
                property="recv"
                :label="$t('terminal.addtime')"
                show-overflow-tooltip
                :formatter="formatDateRecv"
                align="center"
                min-width="110"
                key="38"
              ></el-table-column>

              <el-table-column
                property="sysmemo"
                :label="$t('beacon.sysmemo')"
                show-overflow-tooltip
                align="center"
                min-width="130"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                key="39"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('beacon.memo')"
                show-overflow-tooltip
                align="center"
                min-width="90"
                v-if="contrForPrionum != 5"
                key="40"
              ></el-table-column>

              <el-table-column
                fixed="right"
                :label="$t('terminal.control')"
                align="center"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4 ||
                  contrForPrionum == 5
                "
                key="41"
                :min-width="contrForPrionum == 5 ? '120' : '166'"
                class-name="operation"
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
                    key="42"
                  >
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
                          @click="editTer(scope.$index, tableData)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          key="43"
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
                          class="dels"
                          @click="configTer(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          key="44"
                        >
                          {{ $t("terminal.deploy") }}</el-button
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
                          @click="extendTerminal(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          key="45"
                          >{{ $t("terminal.Extend") }}</el-button
                        ></el-dropdown-item
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
                          @click="assignTer(scope.$index, tableData)"
                          v-if="contrForPrionum == 3 || contrForPrionum == 4"
                          key="46"
                          >{{ $t("terminal.assign") }}</el-button
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
                          @click="removeTerminal(scope.$index)"
                          v-if="contrForPrionum == 3 || contrForPrionum == 4"
                          key="47"
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
                          class="dels11"
                          @click="delTer(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4
                          "
                          key="48"
                          :disabled="showButton(scope.row)"
                          >{{ $t("terminal.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-dropdown
                    size="mini"
                    type="primary"
                    trigger="click"
                    v-if="
                      contrForPrionum == 1 ||
                      contrForPrionum == 2 ||
                      contrForPrionum == 3 ||
                      contrForPrionum == 4 ||
                      contrForPrionum == 5
                    "
                    key="49"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('terminal.order')"
                      placement="top"
                    >
                      <el-button type="primary" class="icon_button">
                        <img src="../../../static/order.png" />
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
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5
                        "
                        key="50"
                      >
                        <el-button
                          size="mini"
                          class="edits"
                          @click="sendDownLink(1, scope.$index)"
                          >{{ $t("terminal.Remotereboot") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5
                        "
                        key="51"
                      >
                        <el-button
                          size="mini"
                          class="edits"
                          @click="sendDownLink(2, scope.$index)"
                          >{{ $t("terminal.Remoteshutdown") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5
                        "
                        key="52"
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="sendDownLink(3, scope.$index)"
                          >{{ $t("terminal.Remotesearch") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5
                        "
                        key="53"
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="sendDownLink(4, scope.$index)"
                          >{{ $t("terminal.Cancelsearch") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4 ||
                          contrForPrionum == 5
                        "
                        key="54"
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="sendDownLink(0, scope.$index)"
                          >{{ $t("terminal.Requestlocation") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        key="55"
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="sendDownLink(5, scope.$index)"
                          >{{ $t("terminal.Positioningbeacon") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        key="56"
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="sendDownLink(6, scope.$index)"
                          >{{ $t("terminal.Assetbeacon") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        key="57"
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="sendDownLink(7, scope.$index)"
                          >{{ $t("terminal.Transparentbeacon") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        v-if="
                          contrForPrionum == 1 ||
                          contrForPrionum == 2 ||
                          contrForPrionum == 3 ||
                          contrForPrionum == 4
                        "
                        key="58"
                        ><el-button
                          size="mini"
                          class="dels"
                          @click="sendDownLink(8, scope.$index)"
                          >{{ $t("terminal.Confirmationbeacon") }}</el-button
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
                      v-if="contrForPrionum == 5 && intoProjectType == 1"
                      @click="goLocation(scope.$index)"
                    >
                      <img src="../../../static/location.png" />
                    </el-button>
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

          <!-- 系统管理员添加设备 -->
          <el-dialog
            :title="$t('terminal.addmsg')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="160px"
              ref="addData"
              style="text-align: left"
              :rules="addRules"
            >
              <el-form-item :label="$t('terminal.deveui')" prop="deveui">
                <el-input
                  v-model="addData.deveui"
                  autofocus
                  ref="getFocus"
                  maxlength="16"
                  style="width: 80%"
                >
                </el-input>
              </el-form-item>

              <el-form-item :label="$t('terminal.joinmode')" prop="joinmode">
                <el-select
                  v-model="addData.joinmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in joinmodeList"
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
                      {{ $t("terminal.title9") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.company')"
                prop="tenantid"
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
              <el-form-item :label="$t('terminal.scheme')" prop="scheme">
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
                    <p>{{ $t("terminal.title10") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.Hardwaredevicetype')"
                prop="devtype"
              >
                <el-select
                  v-model="addData.devtype"
                  clearable
                  filterable
                  @change="changeDevtype"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in devtypeList"
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
                    <p>{{ $t("terminal.title11") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip> </el-form-item
              ><el-form-item :label="$t('terminal.posttype')" prop="postype">
                <el-select
                  v-model="addData.postype"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in postypeList"
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
                    <p>{{ $t("terminal.title12") }}</p>
                    <p>
                      {{ $t("terminal.title13") }}
                    </p>
                    <p>
                      {{ $t("terminal.title14") }}
                    </p>
                    <p>
                      {{ $t("terminal.title14gps") }}
                    </p>
                    <p>
                      {{ $t("terminal.title14gateway") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.Whethealarmriggered')"
                prop=""
                v-show="addDataGateway"
              >
                <el-select
                  v-model="addData.warning"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in warningList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.Whetherencrypted')"
                prop="keyenc"
              >
                <el-select
                  v-model="addData.keyenc"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in keyencList"
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
                    <p>{{ $t("terminal.title15") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item label="nwkskey" prop="">
                <el-input
                  v-model="addData.nwkskey"
                  show-word-limit
                  maxlength="32"
                  style="width: 80%"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="appkey" prop="">
                <el-input
                  v-model="addData.appkey"
                  show-word-limit
                  maxlength="32"
                  style="width: 80%"
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('terminal.title16')" prop="workmode">
                <el-select
                  v-model="addData.workmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in workmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('terminal.title17')" prop="debugmode">
                <el-select
                  v-model="addData.debugmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in debugmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('terminal.title18')" prop="configmode">
                <el-select
                  v-model="addData.configmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in configmodeList"
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
                      {{ $t("terminal.title19") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('beacon.number')" prop="num">
                <el-input v-model="addData.num"> </el-input>
              </el-form-item>
              <el-form-item
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
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel('addData')">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 企业管理员添加设备 -->
          <el-dialog
            :title="$t('terminal.addmsg')"
            width="30%"
            :visible.sync="cusadd"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="160px"
              ref="addData"
              style="text-align: left"
              :rules="addRules"
            >
              <el-form-item :label="$t('terminal.deveui')" prop="deveui">
                <el-input v-model="addData.deveui" autofocus ref="getFocus">
                </el-input>
              </el-form-item>

              <el-form-item :label="$t('terminal.joinmode')" prop="joinmode">
                <el-select
                  v-model="addData.joinmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in joinmodeList"
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
                      {{ $t("terminal.title9") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('terminal.scheme')" prop="scheme">
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
                    <p>{{ $t("terminal.title10") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.Hardwaredevicetype')"
                prop="devtype"
              >
                <el-select
                  v-model="addData.devtype"
                  clearable
                  filterable
                  @change="changecusDevtype"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in devtypeList"
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
                    <p>{{ $t("terminal.title11") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip> </el-form-item
              ><el-form-item :label="$t('terminal.posttype')" prop="postype">
                <el-select
                  v-model="addData.postype"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in postypeList"
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
                    <p>{{ $t("terminal.title12") }}</p>
                    <p>
                      {{ $t("terminal.title13") }}
                    </p>
                    <p>
                      {{ $t("terminal.title14") }}
                    </p>
                    <p>
                      {{ $t("terminal.title14gps") }}
                    </p>
                    <p>
                      {{ $t("terminal.title14gateway") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('terminal.Whethealarmriggered')"
                prop=""
                v-show="addcueDataGateway"
              >
                <el-select
                  v-model="addData.warning"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in warningList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.Whetherencrypted')"
                prop="keyenc"
              >
                <el-select
                  v-model="addData.keyenc"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in keyencList"
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
                    <p>{{ $t("terminal.title15") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item label="nwkskey" prop="">
                <el-input
                  v-model="addData.nwkskey"
                  show-word-limit
                  maxlength="32"
                  style="width: 80%"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="appkey" prop="">
                <el-input
                  v-model="addData.appkey"
                  show-word-limit
                  maxlength="32"
                  style="width: 80%"
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('terminal.title18')" prop="configmode">
                <el-select
                  v-model="addData.configmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in configmodeList"
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
                      {{ $t("terminal.title19") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('beacon.number')" prop="num">
                <el-input v-model="addData.num"> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.memo11')" prop="">
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
              <el-button @click="addCancel('addData')">
                {{ $t("terminal.cancel") }}
              </el-button>
              <el-button
                type="primary"
                @click="addcusTrue('addData')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 编辑设备 -->
          <el-dialog
            :title="$t('terminal.editmsg')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              :label-width="i8n == 'zh' ? '120px' : '160px'"
              ref="editData"
              style="text-align: left"
              :rules="editRules"
            >
              <el-form-item :label="$t('terminal.deveui')">
                <el-input v-model="editData.deveui" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('terminal.alias')" prop="">
                <el-input v-model="editData.alias"></el-input>
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
              <el-form-item :label="$t('terminal.joinmode')" prop="joinmode">
                <el-select
                  v-model="editData.joinmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in joinmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('terminal.Whethealarmriggered')">
                <el-select
                  v-model="editData.warning"
                  clearable
                  filterable
                  :disabled="setWarning"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in warningList"
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
                    <p>{{ $t("terminal.title20") }}</p>
                    <p>{{ $t("terminal.title21") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('terminal.posttype')" prop="postype">
                <el-select
                  v-model="editData.postype"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in postypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.title16')"
                prop="workmode"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="editData.workmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in workmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.workstate')"
                prop="workmode"
                v-if="contrForPrionum != 1 && contrForPrionum != 2"
              >
                <el-select
                  v-model="editData.workstate"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in workstateList"
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
                      {{ $t("terminal.title22") }}
                    </p>
                  </div>
                  <i class="el-icon-question" /> </el-tooltip></el-form-item
              ><el-form-item
                :label="$t('terminal.title17')"
                prop="debugmode"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="editData.debugmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in debugmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('terminal.title18')" prop="configmode">
                <el-select
                  v-model="editData.configmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in configmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
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
                :label="$t('beacon.memo11')"
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

          <!-- 批量编辑 -->
          <el-dialog
            :title="$t('terminal.editmsgs')"
            :visible.sync="edits"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancels('editDatas')"
          >
            <el-form
              :model="editDatas"
              ref="editDatas"
              :label-width="i8n == 'zh' ? '120px' : '160px'"
              style="text-align: left"
            >
              <el-form-item :label="$t('terminal.deveui')">
                <el-input v-model="editDatas.deveuiList" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('terminal.alias')">
                <el-input v-model="editDatas.alias"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.company')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="editDatas.tenantid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <!-- @change="changeTenantids" -->

                  <el-option
                    v-for="item in tenantidData"
                    :key="item.tenantid"
                    :label="item.username"
                    :value="item.tenantid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('terminal.joinmode')" prop="joinmode">
                <el-select v-model="editDatas.joinmode" clearable filterable>
                  <el-option
                    v-for="item in joinmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('terminal.Whethealarmriggered')">
                <el-select
                  v-model="editDatas.warning"
                  clearable
                  filterable
                  :disabled="setWarning"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in warningList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('terminal.posttype')">
                <el-select
                  v-model="editDatas.postype"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in postypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.title16')"
                prop="workmode"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="editDatas.workmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in workmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.title17')"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="editDatas.debugmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in debugmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('terminal.title18')">
                <el-select
                  v-model="editDatas.configmode"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in configmodeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
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
              <el-button @click="editCancels('editDatas')">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrues('editDatas')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 配置设备 -->
          <el-dialog
            :title="$t('terminal.Configureinformation')"
            :visible.sync="config"
            width="70%"
            style="text-align: center"
          >
            <el-form
              :model="configData"
              label-width="220px"
              ref="configData"
              style="text-align: left"
            >
              <div class="configBeacon1">
                <div class="configBeacon">
                  <el-form-item :label="$t('terminal.deveui')">
                    <el-input v-model="configData.deveui" disabled></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Currentsystem')">
                    <el-input v-model="configData.modestr" disabled></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Bluetoothcycle')">
                    <el-select
                      v-model="configData.ble"
                      clearable
                      filterable
                      @change="checkScan(configData)"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in bleList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>{{ $t("terminal.text") }}</p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Bluetoothscanduration')">
                    <el-select
                      v-model="configData.scan"
                      clearable
                      filterable
                      @change="checkScan(configData)"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in scanList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text1") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Indicatesbeacon')">
                    <el-select
                      v-model="configData.scale"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in scaleList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text2") }}
                        </p>
                        <p>
                          {{ $t("terminal.text3") }}
                        </p>
                        <p>
                          {{ $t("terminal.text4") }}
                        </p>
                        <p>
                          {{ $t("terminal.text5") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Scanningsignalrange')">
                    <el-select
                      v-model="configData.thres"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in thresList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text6") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Bluetooththreshold')">
                    <el-select
                      v-model="configData.bleoff"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in bleoffList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text7") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.text8')">
                    <el-select
                      v-model="configData.proximity"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in proximityList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text9") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.text10')">
                    <el-select
                      v-model="configData.distance"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in distanceList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>{{ $t("terminal.text11") }}</p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Buzzer')">
                    <el-select
                      v-model="configData.buzzer"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in buzzerList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option> </el-select
                    ><el-tooltip
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
                        <p>{{ $t("terminal.Buzzer1") }}</p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Vibratoroperatingmode')">
                    <el-select
                      v-model="configData.vibrator"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in vibratorList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="configBeacon">
                  <el-form-item :label="$t('terminal.Currentworkingmode')">
                    <el-select
                      v-model="configData.type"
                      disabled
                      :placeholder="$t('terminal.choose')"
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
                          {{ $t("terminal.text12") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Transmitpower')">
                    <el-select
                      v-model="configData.power"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in powerList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text13") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="Data Rate：">
                    <el-select
                      v-model="configData.dr"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in drList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text15") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.text16')">
                    <el-select
                      v-model="configData.alreport"
                      clearable
                      filterable
                      @change="changeMode"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in alreportList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text17") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Stepthreshold')">
                    <el-select
                      v-model="configData.stepsoff"
                      clearable
                      filterable
                      @change="changeMode"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in stepsoffList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text18") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.GPSreportingcycle')">
                    <el-select
                      v-model="configData.gps"
                      clearable
                      filterable
                      @change="changeMode"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in gpsList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Heartbeatcycle')">
                    <el-select
                      v-model="configData.hb"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in hbList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>{{ $t("terminal.text19") }}</p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Bluetoothconfirmation')">
                    <el-select
                      v-model="configData.bleack"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in bleackList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Sleeplevel')">
                    <el-select
                      v-model="configData.degree"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in delaySleepList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.value"
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
                        <p>
                          {{ $t("terminal.text20") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Sleepstart1')">
                    <el-select
                      v-model="configData.sleepstart"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in sleepList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text202") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Sleepstart2')">
                    <el-select
                      v-model="configData.sleepend"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in sleepList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="(config = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="configTrue('configData')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 批量配置设备 -->
          <el-dialog
            :title="$t('terminal.Configureinformation')"
            :visible.sync="configs"
            width="70%"
            style="text-align: center"
          >
            <el-form
              :model="configDatas"
              label-width="220px"
              ref="configDatas"
              style="text-align: left"
            >
              <div class="configBeacon1">
                <div class="configBeacon">
                  <el-form-item :label="$t('terminal.deveui')">
                    <el-input
                      v-model="configDatas.deveuiList"
                      disabled
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Bluetoothcycle')">
                    <el-select
                      v-model="configDatas.ble"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in bleList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>{{ $t("terminal.text") }}</p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Bluetoothscanduration')">
                    <el-select
                      v-model="configDatas.scan"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in scanList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text1") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Indicatesbeacon')">
                    <el-select
                      v-model="configDatas.scale"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in scaleList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text2") }}
                        </p>
                        <p>
                          {{ $t("terminal.text3") }}
                        </p>
                        <p>
                          {{ $t("terminal.text4") }}
                        </p>
                        <p>
                          {{ $t("terminal.text5") }}
                        </p>
                        <p>
                          {{ $t("terminal.text55") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Scanningsignalrange')">
                    <el-select
                      v-model="configDatas.thres"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in thresList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text6") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Bluetooththreshold')">
                    <el-select
                      v-model="configDatas.bleoff"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in bleoffList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text7") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.text10')">
                    <el-select
                      v-model="configDatas.distance"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in distanceList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>{{ $t("terminal.text11") }}</p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.text8')">
                    <el-select
                      v-model="configDatas.proximity"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in proximityList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text9") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Buzzer')">
                    <el-select
                      v-model="configDatas.buzzer"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in buzzerList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>{{ $t("terminal.Buzzer1") }}</p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Vibratoroperatingmode')">
                    <el-select
                      v-model="configDatas.vibrator"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in vibratorList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="configBeacon">
                  <el-form-item :label="$t('terminal.Transmitpower')">
                    <el-select
                      v-model="configDatas.power"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in powerList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text13") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item label="Data Rate：">
                    <el-select
                      v-model="configDatas.dr"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in drList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text15") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.text16')">
                    <el-select
                      v-model="configDatas.alreport"
                      clearable
                      filterable
                      @change="changeMode"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in alreportList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text17") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Stepthreshold')">
                    <el-select
                      v-model="configDatas.stepsoff"
                      clearable
                      filterable
                      @change="changeMode"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in stepsoffList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text18") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.GPSreportingcycle')">
                    <el-select
                      v-model="configDatas.gps"
                      clearable
                      filterable
                      @change="changeMode"
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in gpsList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Heartbeatcycle')">
                    <el-select
                      v-model="configDatas.hb"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in hbList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('terminal.Bluetoothconfirmation')">
                    <el-select
                      v-model="configDatas.bleack"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in bleackList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Sleeplevel')">
                    <el-select
                      v-model="configDatas.degree"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in delaySleepList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.value"
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
                        <p>
                          {{ $t("terminal.text20") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Sleepstart1')">
                    <el-select
                      v-model="configDatas.sleepstart"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in sleepList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
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
                        <p>
                          {{ $t("terminal.text202") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>

                  <el-form-item :label="$t('terminal.Sleepstart2')">
                    <el-select
                      v-model="configDatas.sleepend"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in sleepList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="(configs = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="configTrues('configDatas')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 批量删除设备 -->
          <el-dialog :title="$t('terminal.deletemsgs')" :visible.sync="deletes">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="deveui"
                :label="$t('terminal.DeviceID')"
                show-overflow-tooltip
                fixed="left"
                align="center"
                min-width="150"
              ></el-table-column>
              <el-table-column
                property="alias"
                :label="$t('terminal.alias1')"
                show-overflow-tooltip
                align="center"
                min-width="78"
              ></el-table-column>

              <el-table-column
                property="joinmodestr"
                :label="$t('terminal.mode')"
                show-overflow-tooltip
                align="center"
                min-width="70"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="schemestr"
                :label="$t('terminal.Standard')"
                show-overflow-tooltip
                align="center"
                min-width="78"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="devtypestr"
                :label="$t('terminal.type')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="customstr"
                :label="$t('gateway.customstr')"
                show-overflow-tooltip
                align="center"
                min-width="90"
                v-if="
                  contrForPrionum == '1' ||
                  contrForPrionum == '2' ||
                  contrForPrionum == '3' ||
                  contrForPrionum == '4'
                "
              ></el-table-column>
              <el-table-column
                property="inallotstr"
                :label="$t('terminal.assign')"
                show-overflow-tooltip
                align="center"
                min-width="60"
                v-if="
                  contrForPrionum == '1' ||
                  contrForPrionum == '2' ||
                  contrForPrionum == '3' ||
                  contrForPrionum == '4'
                "
              ></el-table-column>
              <el-table-column
                property="inusestr"
                :label="$t('terminal.use')"
                show-overflow-tooltip
                align="center"
                min-width="60"
              ></el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'workstatestr' : 'enworkstate'"
                :label="$t('terminal.state')"
                show-overflow-tooltip
                align="center"
                min-width="60"
              ></el-table-column>
              <el-table-column
                property="country"
                :label="$t('terminal.country1')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrionum == '1'"
                min-width="80"
              ></el-table-column>

              <el-table-column
                property="customername"
                :label="$t('terminal.customername')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrionum == '1'"
                min-width="80"
              ></el-table-column>

              <el-table-column
                property="projectname"
                :label="$t('terminal.projectname')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="ver"
                :label="$t('terminal.ver')"
                show-overflow-tooltip
                align="center"
                min-width="60"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="hbstatusstr"
                :label="$t('terminal.isonline')"
                show-overflow-tooltip
                align="center"
                min-width="80"
              ></el-table-column>

              <el-table-column
                property="battery"
                :label="$t('terminal.electricity')"
                show-overflow-tooltip
                align="center"
                min-width="60"
              ></el-table-column>

              <el-table-column
                property="rssi"
                label="Rssi"
                show-overflow-tooltip
                align="center"
                min-width="50"
                v-if="contrForPrionum != 3 && contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="snr"
                :label="$t('terminal.Signaltonoiseratio')"
                show-overflow-tooltip
                align="center"
                min-width="70"
                v-if="contrForPrionum != 3 && contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="fcnt"
                :label="$t('test.framecount')"
                show-overflow-tooltip
                align="center"
                min-width="60"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="lastchannel"
                :label="$t('terminal.FrequencyPoint')"
                show-overflow-tooltip
                align="center"
                min-width="70"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="statustime"
                :label="$t('terminal.Statusupdatetime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDateStatustime"
                min-width="110"
              ></el-table-column>

              <el-table-column
                property="groundid"
                :label="$t('terminal.floornumber')"
                show-overflow-tooltip
                align="center"
                min-width="70"
              ></el-table-column>

              <el-table-column
                property="lastx"
                :label="$t('terminal.lastx')"
                show-overflow-tooltip
                align="center"
                min-width="95"
                v-if="contrForPrionum != 3 && contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="lasty"
                :label="$t('terminal.lasty')"
                show-overflow-tooltip
                align="center"
                min-width="95"
                v-if="contrForPrionum != 3 && contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="postime"
                :label="$t('terminal.Locationupdatetime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDateLastxytime"
                min-width="150"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="warningstr"
                :label="$t('beacon.warning')"
                show-overflow-tooltip
                align="center"
                min-width="90"
              ></el-table-column>

              <el-table-column
                :property="i8n == 'zh' ? 'postypestr' : 'enpostype'"
                :label="$t('terminal.postype')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="keyencstr"
                :label="$t('terminal.encryption')"
                show-overflow-tooltip
                align="center"
                min-width="60"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>
              <el-table-column
                property="appeui"
                label="appeui"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="nwkskey"
                label="nwkskey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>

              <el-table-column
                property="appkey"
                label="appkey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>

              <el-table-column
                property="orignwkskey"
                label="orignwkskey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>

              <el-table-column
                property="origappkey"
                label="origappkey"
                show-overflow-tooltip
                align="center"
                min-width="140"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>

              <el-table-column
                property="workmodestr"
                :label="$t('terminal.currentstate')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>

              <el-table-column
                property="debugmodestr"
                :label="$t('terminal.Debuggingstatus')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                v-if="contrForPrionum != 3 && contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="configmodestr"
                :label="$t('terminal.Configurationmode')"
                show-overflow-tooltip
                align="center"
                min-width="80"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                property="recv"
                :label="$t('terminal.addtime')"
                show-overflow-tooltip
                :formatter="formatDateRecv"
                align="center"
                min-width="110"
              ></el-table-column>

              <el-table-column
                property="sysmemo"
                :label="$t('beacon.sysmemo')"
                show-overflow-tooltip
                align="center"
                min-width="150"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('beacon.memo')"
                show-overflow-tooltip
                align="center"
                min-width="150"
                v-if="contrForPrionum != 5"
              ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(deletes = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="deleteTrue"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 分配设备 -->
          <el-dialog
            :title="$t('terminal.dispensingdevice')"
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
              <el-form-item :label="$t('terminal.deveui')" prop="">
                <el-input v-model="assignData.deveuis" disabled> </el-input>
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
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="assignTrue('assignData')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 批量分配 -->
          <el-dialog
            :title="$t('terminal.Batchdistributioneq')"
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
              <el-form-item :label="$t('terminal.deveui')" prop="">
                <el-input v-model="assignDatas.deveuis" disabled> </el-input>
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
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="assignsTrue('assignDatas')"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 解除分配 -->
          <el-dialog
            :title="$t('beacon.deletemsgs1')"
            :visible.sync="removeTer"
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
                property="deveui"
                :label="$t('terminal.DeviceID')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="projectname"
                :label="$t('terminal.projectname')"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(removeTer = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="removeTrue()"
                :loading="loading"
              >
                {{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 导入 -->
          <el-dialog
            :title="$t('terminal.tit1')"
            :visible.sync="selectCom"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-form
              class="exportForm"
              label-width="120px"
              style="text-align: left"
              :rules="exportRules"
            >
              <el-form-item :label="$t('beacon.company')" prop="">
                <el-select
                  v-model="selectTenantid"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="selectCom = false">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="selectComTrue()">
                {{ $t("terminal.confirm") }}</el-button
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
                :label="$t('gateway.company')"
                prop=""
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="exportData.tenantid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <!-- @change="getExportProjectLists(exportData.tenantid)" -->

                  <el-option
                    v-for="item in tenantidData"
                    :key="item.tenantid"
                    :label="item.username"
                    :value="item.tenantid"
                  ></el-option>
                </el-select>
              </el-form-item>

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
              <el-form-item :label="$t('terminal.tit4')" prop="begineui">
                <el-input
                  :placeholder="$t('terminal.tit5')"
                  v-model="exportData.begineui"
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
                    <p>{{ $t("terminal.tit6") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('terminal.tit7')" prop="endeui">
                <el-input
                  :placeholder="$t('terminal.tit8')"
                  v-model="exportData.endeui"
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

          <!-- 扩展 -->
          <el-dialog
            :visible.sync="extendTer"
            width="40%"
            @close="extendCancel('beaconFilterData')"
          >
            <div>
              <el-tabs tab-position="left">
                <el-tab-pane :label="$t('terminal.tit10')">
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.tit10") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">
                          {{ $t("terminal.tit11") }}<br />
                          {{ $t("terminal.tit12") }}
                        </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="positionUUIDData"
                    label-width="120px"
                    style="text-align: left"
                  >
                    <el-form-item :label="$t('terminal.deveui')">
                      <el-input
                        v-model="positionUUIDData.deveuis"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="UUID0：">
                      <el-input maxlength="32" v-model="puuid0"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID1：">
                      <el-input maxlength="32" v-model="puuid1"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID2：">
                      <el-input maxlength="32" v-model="puuid2"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID3：">
                      <el-input maxlength="32" v-model="puuid3"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID4：">
                      <el-input maxlength="32" v-model="puuid4"></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button
                      @click="(extendTer = false), (loading = false)"
                      >{{ $t("terminal.cancel") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="extendPositionTur()"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('terminal.tit13')">
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.tit13") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">
                          {{ $t("terminal.tit14") }}<br />
                          {{ $t("terminal.tit12") }}
                        </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="assetUUIDData"
                    label-width="120px"
                    style="text-align: left"
                  >
                    <el-form-item :label="$t('terminal.deveui')">
                      <el-input
                        v-model="assetUUIDData.deveuis"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="UUID0：">
                      <el-input maxlength="32" v-model="auuid0"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID1：">
                      <el-input maxlength="32" v-model="auuid1"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID2：">
                      <el-input maxlength="32" v-model="auuid2"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID3：">
                      <el-input maxlength="32" v-model="auuid3"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID4：">
                      <el-input maxlength="32" v-model="auuid4"></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button
                      @click="(extendTer = false), (loading = false)"
                      >{{ $t("terminal.cancel") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="extendAssetTur()"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('terminal.tit15')">
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.tit15") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">
                          {{ $t("terminal.tit16") }}
                        </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="beaconFilterData"
                    label-width="148px"
                    style="text-align: left"
                    ref="beaconFilterData"
                    :rules="FilterRules"
                  >
                    <el-form-item :label="$t('terminal.deveui')">
                      <el-input
                        v-model="beaconFilterData.deveuis"
                        disabled
                      ></el-input>
                    </el-form-item>

                    <el-form-item
                      :label="$t('terminal.Filterchannel')"
                      prop="port"
                    >
                      <el-select
                        v-model="beaconFilterData.port"
                        clearable
                        filterable
                        :placeholder="$t('terminal.Filterchannel1')"
                        @change="selectFilterport"
                      >
                        <el-option
                          v-for="item in filterPortList"
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
                          {{ $t("terminal.tit17") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item
                      :label="$t('terminal.interceptdata')"
                      prop="filter"
                    >
                      <el-input
                        v-model="beaconFilterData.filter"
                        maxlength="32"
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
                          {{ $t("terminal.tit18") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item
                      :label="$t('terminal.tit19')"
                      prop="filterStart"
                    >
                      <el-input
                        v-model="beaconFilterData.filterStart"
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
                          {{ $t("terminal.tit20") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item :label="$t('terminal.tit21')" prop="start">
                      <el-input
                        v-model="beaconFilterData.start"
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
                          {{ $t("terminal.tit22") }}<br />
                          {{ $t("terminal.tit23") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item :label="$t('terminal.tit24')" prop="end">
                      <el-input
                        v-model="beaconFilterData.end"
                        style="width: 80%"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button @click="extendCancel('beaconFilterData')">{{
                      $t("terminal.cancel")
                    }}</el-button>
                    <el-button
                      type="primary"
                      @click="extendFilterTur('beaconFilterData')"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
                <el-tab-pane
                  :label="$t('terminal.Retransmissionlist')"
                  v-if="changeRetransmissionBeacon"
                >
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.Retransmissionlist") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">{{ $t("terminal.tit25") }}</div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="retransmissionBeaconList"
                    label-width="120px"
                    :rules="retransmissionRules"
                    style="text-align: left; display: flex; flex-wrap: wrap"
                  >
                    <el-form-item
                      label="major-minor1:"
                      style="width: 50%"
                      prop="value1"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value1"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor2:"
                      style="width: 50%"
                      prop="value2"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value2"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor3:"
                      style="width: 50%"
                      prop="value3"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value3"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor4:"
                      style="width: 50%"
                      prop="value4"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value4"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor5:"
                      style="width: 50%"
                      prop="value5"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value5"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor6:"
                      style="width: 50%"
                      prop="value6"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value6"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor7:"
                      style="width: 50%"
                      prop="value7"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value7"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor8:"
                      style="width: 50%"
                      prop="value8"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value8"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor9:"
                      style="width: 50%"
                      prop="value9"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value9"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor10:"
                      style="width: 50%"
                      prop="value10"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value10"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor11:"
                      style="width: 50%"
                      prop="value11"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value11"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor12:"
                      style="width: 50%"
                      prop="value12"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value12"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor13:"
                      style="width: 50%"
                      prop="value13"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value13"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor14:"
                      style="width: 50%"
                      prop="value14"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value14"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor15:"
                      style="width: 50%"
                      prop="value15"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value15"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor16:"
                      style="width: 50%"
                      prop="value16"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value16"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor17:"
                      style="width: 50%"
                      prop="value17"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value17"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor18:"
                      style="width: 50%"
                      prop="value18"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value18"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor19:"
                      style="width: 50%"
                      prop="value19"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value19"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor20:"
                      style="width: 50%"
                      prop="value20"
                    >
                      <el-input
                        v-model="retransmissionBeaconList.value20"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button
                      @click="(extendTer = false), (loading = false)"
                      >{{ $t("terminal.cancel") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="retransmissionTur()"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-dialog>

          <!-- 批量扩展 -->
          <el-dialog
            :visible.sync="extendTers"
            widtsh="40%"
            @close="extendCancels('beaconFilterDatas')"
          >
            <div>
              <el-tabs tab-position="left">
                <el-tab-pane :label="$t('terminal.tit10')">
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.tit10") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">
                          {{ $t("terminal.tit11") }}<br />
                          {{ $t("terminal.tit12") }}
                        </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="positionUUIDDatas"
                    label-width="120px"
                    style="text-align: left"
                  >
                    <el-form-item :label="$t('terminal.deveui')">
                      <el-input
                        v-model="positionUUIDDatas.deveuis"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="UUID0：">
                      <el-input maxlength="32" v-model="puuid0"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID1：">
                      <el-input maxlength="32" v-model="puuid1"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID2：">
                      <el-input maxlength="32" v-model="puuid2"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID3：">
                      <el-input maxlength="32" v-model="puuid3"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID4：">
                      <el-input maxlength="32" v-model="puuid4"></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button
                      @click="(extendTers = false), (loading = false)"
                      >{{ $t("terminal.cancel") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="extendPositionTurs()"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('terminal.tit13')">
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.tit13") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">
                          {{ $t("terminal.tit14") }}<br />
                          {{ $t("terminal.tit12") }}
                        </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="assetUUIDDatas"
                    label-width="120px"
                    style="text-align: left"
                  >
                    <el-form-item :label="$t('terminal.deveui')">
                      <el-input
                        v-model="assetUUIDDatas.deveuis"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="UUID0：">
                      <el-input maxlength="32" v-model="auuid0"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID1：">
                      <el-input maxlength="32" v-model="auuid1"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID2：">
                      <el-input maxlength="32" v-model="auuid2"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID3：">
                      <el-input maxlength="32" v-model="auuid3"></el-input>
                    </el-form-item>
                    <el-form-item label="UUID4：">
                      <el-input maxlength="32" v-model="auuid4"></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button
                      @click="(extendTers = false), (loading = false)"
                      >{{ $t("terminal.cancel") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="extendAssetTurs()"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('terminal.tit15')">
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.tit15") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">
                          {{ $t("terminal.tit16") }}
                        </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="beaconFilterDatas"
                    label-width="148px"
                    style="text-align: left"
                    ref="beaconFilterDatas"
                    :rules="FilterRules"
                  >
                    <el-form-item :label="$t('terminal.deveui')">
                      <el-input
                        v-model="beaconFilterDatas.deveuis"
                        disabled
                      ></el-input>
                    </el-form-item>

                    <el-form-item
                      :label="$t('terminal.Filterchannel')"
                      prop="port"
                    >
                      <el-select
                        v-model="beaconFilterDatas.port"
                        clearable
                        filterable
                        :placeholder="$t('terminal.Filterchannel1')"
                      >
                        <el-option
                          v-for="item in filterPortList"
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
                          {{ $t("terminal.tit17") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item
                      :label="$t('terminal.interceptdata')"
                      prop="filter"
                    >
                      <el-input
                        v-model="beaconFilterDatas.filter"
                        maxlength="32"
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
                          {{ $t("terminal.tit18") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item
                      :label="$t('terminal.tit19')"
                      prop="filterStart"
                    >
                      <el-input
                        v-model="beaconFilterDatas.filterStart"
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
                          {{ $t("terminal.tit20") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item :label="$t('terminal.tit21')" prop="start">
                      <el-input
                        v-model="beaconFilterDatas.start"
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
                          {{ $t("terminal.tit22") }}
                          <br />
                          {{ $t("terminal.tit23") }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item :label="$t('terminal.tit24')" prop="end">
                      <el-input
                        v-model="beaconFilterDatas.end"
                        style="width: 80%"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button @click="extendCancels('beaconFilterDatas')">
                      {{ $t("terminal.cancel") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="extendFilterTurs('beaconFilterDatas')"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
                <el-tab-pane
                  :label="$t('terminal.Retransmissionlist')"
                  v-if="changeRetransmissionBeacons"
                >
                  <span slot="label">
                    <span class="span-box">
                      <span>{{ $t("terminal.Retransmissionlist") }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                      >
                        <div slot="content">{{ $t("terminal.tit25") }}</div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-form
                    :model="retransmissionBeaconLists"
                    label-width="120px"
                    :rules="retransmissionRules"
                    style="text-align: left; display: flex; flex-wrap: wrap"
                  >
                    <el-form-item
                      label="major-minor1:"
                      style="width: 50%"
                      prop="value1"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value1"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor2:"
                      style="width: 50%"
                      prop="value2"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value2"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor3:"
                      style="width: 50%"
                      prop="value3"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value3"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor4:"
                      style="width: 50%"
                      prop="value4"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value4"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor5:"
                      style="width: 50%"
                      prop="value5"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value5"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor6:"
                      style="width: 50%"
                      prop="value6"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value6"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor7:"
                      style="width: 50%"
                      prop="value7"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value7"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor8:"
                      style="width: 50%"
                      prop="value8"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value8"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor9:"
                      style="width: 50%"
                      prop="value9"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value9"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor10:"
                      style="width: 50%"
                      prop="value10"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value10"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor11:"
                      style="width: 50%"
                      prop="value11"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value11"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor12:"
                      style="width: 50%"
                      prop="value12"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value12"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor13:"
                      style="width: 50%"
                      prop="value13"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value13"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor14:"
                      style="width: 50%"
                      prop="value14"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value14"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor15:"
                      style="width: 50%"
                      prop="value15"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value15"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor16:"
                      style="width: 50%"
                      prop="value16"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value16"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor17:"
                      style="width: 50%"
                      prop="value17"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value17"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor18:"
                      style="width: 50%"
                      prop="value18"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value18"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor19:"
                      style="width: 50%"
                      prop="value19"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value19"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="major-minor20:"
                      style="width: 50%"
                      prop="value20"
                    >
                      <el-input
                        v-model="retransmissionBeaconLists.value20"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button
                      @click="(extendTers = false), (loading = false)"
                      >{{ $t("terminal.cancel") }}</el-button
                    >
                    <el-button
                      type="primary"
                      @click="retransmissionTurs()"
                      :loading="loading"
                      >{{ $t("terminal.confirm") }}</el-button
                    >
                  </div>
                </el-tab-pane>
              </el-tabs>
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
  addDevListKey,
  addDevList,
  getDevList,
  updateDevList,
  delDevList,
  getDevConfigV2,
  updateHistoryBleConfig,
  getDevConfigFilter,
  updateDevConfigV2,
  getCustomerName,
  getProjectListByTenantid,
  updateDevListBatch,
  delDevListByDeveuis,
  updateDevConfigV2List,
  updateDevListByDeveuis,
  updateDevListRemoveProject,
  getSchemes,
  sendDownLinkMsg,
  addDevToNs,
  exportDevListInfo,
  importDevList,
  updateDevBeaconUUID,
  updateDevBeaconFilter,
  getDevGpsOne,
} from "../../axios/api";
export default {
  components: {
    Menu,
    Devicemanagement,
    basecard,
  },
  name: "Terminal",
  data() {
    //major 8位16进制正则
    var isMajor = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg = /^[0-9a-fA-F]{8}$/;
        const email = reg.test(value);
        if (!email) {
          callback(new Error(this.$t("terminal.tit26")));
        } else {
          callback();
        }
      }
    };
    var pickerOptions_shortcuts = (rule, value, callback) => {
      callback(new Error(this.$t("terminal.pickeroptions4")));
    };
    var pickerOptions_shortcuts = (rule, value, callback) => {
      callback(new Error(this.$t("terminal.pickeroptions4")));
    };
    return {
      i8n: this.$store.state.i18n,
      seen: true,
      show: false,
      seen1: false,
      intoProjectType: this.$store.state.intoProjectType,
      contrForPrionum: this.$store.state.userInfo.prionum,
      country: this.$store.state.userInfo.country,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      timezone: Math.ceil(0 - new Date().getTimezoneOffset() / 60),
      tableData: [],
      tenantidData: [],
      searchSelectCountry: [],
      multipleSelection: [],
      currentPage1: 1,
      total: 0,
      add: false,
      cusadd: false,
      tasktime: [],
      loading: false, //等待ing
      trancheList: [],
      addTranche: false,
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
      searchList: {
        joinmode: "",
        deveui: "",
        scheme: "",
        country: "",
        tenantid: this.$store.state.userInfo.tenantid,
        projectid: "",
        alias: "",
        postype: "",
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        workstate: "",
        inuse: "",
        hbstatus: "",
        inallot: "",
        devtype: "",
        beginbat: "",
        endbat: "",
        custom: "",
        type: "",
      },
      pageCount: 20,
      addData: {
        joinmode: "",
        deveui: "",
        scheme: "",
        devtype: "",
        tenantid: "",
        warning: "",
        postype: "",
        keyenc: "",
        nwkskey: "",
        appkey: "",
        workmode: "",
        debugmode: "",
        configmode: "",
        memo: "",
        sysmemo: "",
        num: "",
        country: "",
        custom: "",
      },
      positionUUIDData: {
        deveuis: "",
        uuidList: "",
        fPort: 14,
      },
      assetUUIDData: {
        deveuis: "",
        uuidList: "",
        fPort: 15,
      },
      beaconFilterData: {
        deveuis: "",
        filter: "", //截取数据的字符串
        filterStart: "", //截取数据的开始位置
        filterLen: "", //截取数据的长度
        start: "", //透传数据的开始的位置
        end: "", //透传数据的结束位置
        port: "",
      },
      beaconFilterDataList: "", //用来放请求到的透传数据
      filterPortList: [
        {
          index: 21,
          value: 21,
        },
        {
          index: 22,
          value: 22,
        },
        {
          index: 23,
          value: 23,
        },
        {
          index: 24,
          value: 24,
        },
        {
          index: 25,
          value: 25,
        },
      ],
      // 可重发信标列表数据
      changeRetransmissionBeacon: true,
      retransmissionBeaconDeveui: "",
      retransmissionBeaconList: {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        value6: "",
        value7: "",
        value8: "",
        value9: "",
        value10: "",
        value11: "",
        value12: "",
        value13: "",
        value14: "",
        value15: "",
        value16: "",
        value17: "",
        value18: "",
        value19: "",
        value20: "",
      },
      changeRetransmissionBeacons: true,
      retransmissionBeaconDeveuis: "",
      retransmissionBeaconLists: {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        value6: "",
        value7: "",
        value8: "",
        value9: "",
        value10: "",
        value11: "",
        value12: "",
        value13: "",
        value14: "",
        value15: "",
        value16: "",
        value17: "",
        value18: "",
        value19: "",
        value20: "",
      },
      retransmissionRules: {
        value1: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value2: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value3: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value4: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value5: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value6: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value7: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value8: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value9: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value10: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value11: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value12: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value13: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value14: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value15: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value16: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value17: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value18: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value19: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
        value20: [
          {
            required: false,
            message: this.$t("terminal.tit27"),
            trigger: "blur",
          },

          { validator: isMajor, trigger: "blur" },
        ],
      },

      extendTer: false,
      auuid0: "",
      auuid1: "",
      auuid2: "",
      auuid3: "",
      auuid4: "",

      puuid0: "",
      puuid1: "",
      puuid2: "",
      puuid3: "",
      puuid4: "",
      positionUUIDDatas: {
        deveuis: "",
        uuidList: "",
        fPort: 14,
      },
      assetUUIDDatas: {
        deveuis: "",
        uuidList: "",
        fPort: 15,
      },
      beaconFilterDatas: {
        deveuis: "",
        filter: "", //截取数据的字符串
        filterStart: "", //截取数据的开始位置
        filterLen: "", //截取数据的长度
        start: "", //透传数据的开始的位置
        end: "", //透传数据的结束位置
        port: "",
      },
      extendTers: false,
      FilterRules: {
        filter: [
          {
            required: true,
            pattern: /^[0-9A-Fa-f]+$/,
            message: this.$t("terminal.tit28"),
            trigger: "blur",
          },
        ],
        filterStart: [
          {
            required: true,
            pattern: /^[+]{0,1}(\d+)$/,
            message: this.$t("terminal.tit29"),
            trigger: "blur",
          },
        ],
        start: [
          {
            required: true,
            pattern: /^[+]{0,1}(\d+)$/,
            message: this.$t("terminal.tit29"),
            trigger: "blur",
          },
        ],
        end: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: this.$t("terminal.numrules"),
            trigger: "blur",
          },
        ],
        port: [
          {
            required: true,
            message: this.$t("terminal.Filterchannel1"),
            trigger: "change",
          },
        ],
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
        alias: [
          {
            required: true,
            message: this.$t("terminal.aliasrules"),
            trigger: "blur",
          },
        ],
        joinmode: [
          {
            required: true,
            message: this.$t("terminal.joinmoderules"),
            trigger: "change",
          },
        ],
        scheme: [
          {
            required: true,
            message: this.$t("terminal.schemerules"),
            trigger: "change",
          },
        ],
        devtype: [
          {
            required: true,
            message: this.$t("terminal.devtyperules"),
            trigger: "change",
          },
        ],
        tenantid: [
          {
            required: false,
            message: this.$t("terminal.tenantidrules"),
            trigger: "change",
          },
        ],
        postype: [
          {
            required: true,
            message: this.$t("terminal.posttyperules"),
            trigger: "change",
          },
        ],
        keyenc: [
          {
            required: true,
            message: this.$t("terminal.keyencrules"),
            trigger: "change",
          },
        ],
        workmode: [
          {
            required: true,
            message: this.$t("terminal.workmoderules"),
            trigger: "change",
          },
        ],
        debugmode: [
          {
            required: true,
            message: this.$t("terminal.debugmoderules"),
            trigger: "change",
          },
        ],
        configmode: [
          {
            required: true,
            message: this.$t("terminal.configmoderules"),
            trigger: "change",
          },
        ],
        num: [
          {
            pattern: /^[1-9]\d*$/,
            message: this.$t("terminal.numrules"),
            trigger: "blur",
          },
        ],
      },
      addDataGateway: false,
      addcueDataGateway: false,
      addAgain: true, //添加的时候判断是否调用接口
      editDataGateway: false,
      edit: false,
      editTenantid: false,
      editData: {
        deveui: "",
        ver: "",
        tenantid: "", //
        alias: "", //
        inuse: "",
        battery: "",
        rssi: "",
        snr: "",
        fcnt: "",
        lastchannel: "",
        mapid: "", //如果devtype是gateway，可以修改
        lastx: "",
        lasty: "",
        postime: "",
        warning: "", //gateway
        postype: "", //
        workmode: "", //系统管理员可以
        workstate: "",
        debugmode: "", //
        configmode: "", //
        memo: "", //
        sysmemo: "",
        joinmode: "",
      },
      editRules: {
        alias: [
          {
            required: false,
            message: this.$t("terminal.aliasrules"),
            trigger: "blur",
          },
        ],
        tenantid: [
          {
            required: false,
            message: this.$t("terminal.tenantidrules"),
            trigger: "change",
          },
        ],
        projectid: [
          {
            required: false,
            message: this.$t("terminal.projectrules"),
            trigger: "change",
          },
        ],

        postype: [
          {
            required: true,
            message: this.$t("terminal.posttyperules"),
            trigger: "change",
          },
        ],
        workmode: [
          {
            required: true,
            message: this.$t("terminal.workmoderules"),
            trigger: "change",
          },
        ],
        debugmode: [
          {
            required: true,
            message: this.$t("terminal.debugmoderules"),
            trigger: "change",
          },
        ],
        configmode: [
          {
            required: true,
            message: this.$t("terminal.configmoderules"),
            trigger: "change",
          },
        ],
      },
      edits: false,
      setWarning: false,
      editDatas: {
        deveuiList: "",
        country: "",
        tenantid: "",
        alias: "",
        warning: "",
        postype: "",
        workmode: "",
        debugmode: "",
        configmode: "",
        memo: "",
        sysmemo: "",
        joinmode: "",
      },
      config: false,
      configData: "",
      configs: false,
      configDatas: {
        deveuiList: "",
        power: "",
        dr: "",
        alreport: "",
        ble: "",
        scan: "",
        scale: "",
        stepsoff: "",
        bleoff: "",
        buzzer: "",
        vibrator: "",
        distance: "",
        proximity: "",
        gps: "",
        hb: "",
        degree: "",
        sleepstart: "",
        sleepend: "",
        thres: "",
        bleack: "",
      },
      selectConfig: false,
      deletes: false,
      deleteData: [],
      assignData: {
        deveuis: "",
        projectid: "",
        joinmode: "",
        scheme: "",
      },
      assignDatas: {
        deveuis: "",
        projectid: "",
        joinmode: "",
        scheme: "",
      },
      removeTerDatas: {
        deveuis: "",
      },
      removeDatas: [],

      assign: false,
      assigns: false,
      removeTer: false,

      exportBtn: false, //表格复选框没有选择的时候弹框
      exportData: {
        deveuis: "",
        tenantid: "",
        projectid: "",
        sysmemo: "",
        memo: "",
        begineui: "",
        endeui: "",
      },
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
      selectEui: false, //判断导出是否需要输入开始及结束设备号
      selectCom: false, //判断导入是否需要选择公司
      selectTenantid: "", //导入选择的公司
      exprotHeader: "",
      selectBat: "", //选择电量区间
      batterys: "",
      batList: [
        //选择电量下拉框
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
      headerList: [],

      inuseType: [
        {
          index: 1,
          value: this.$t("terminal.inusetype2"),
        },
        {
          index: 2,
          value: this.$t("terminal.inusetype1"),
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
      joinmodeList: [
        {
          index: 1,
          value: "OTAA",
        },
        {
          index: 2,
          value: "ABP",
        },
        {
          index: 3,
          value: "Others",
        },
      ],
      selectschemeList: [],
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
      devtypeList: [
        {
          index: 1,
          value: "badge",
        },
        {
          index: 2,
          value: "gateway",
        },
        {
          index: 3,
          value: "tbox",
        },
      ],
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
      postypeList: [
        {
          index: 1,
          value: this.$t("terminal.positioning"),
        },
        {
          index: 5,
          value: this.$t("terminal.positionings"),
        },
        {
          index: 2,
          value: this.$t("terminal.Regionalpositioning"),
        },
        {
          index: 3,
          value: this.$t("terminal.GPSpositioning"),
        },
        {
          index: 4,
          value: this.$t("terminal.gateway"),
        },
      ],
      keyencList: [
        {
          index: 1,
          value: "Yes",
        },
        {
          index: 2,
          value: "No",
        },
      ],
      workmodeList: [
        {
          index: 1,
          value: "Normal",
        },
        {
          index: 2,
          value: "Test",
        },
      ],
      workstateList: [
        {
          index: 1,
          value: this.$t("terminal.worktype1"),
        },
        {
          index: 2,
          value: this.$t("terminal.worktype2"),
        },
      ],
      debugmodeList: [
        {
          index: 1,
          value: "Debug",
        },
        {
          index: 2,
          value: "Info",
        },
        {
          index: 3,
          value: "Error",
        },
      ],
      configmodeList: [
        {
          index: 1,
          value: "Yes",
        },
        {
          index: 2,
          value: "No",
        },
      ],
      powerList: [
        {
          index: 1,
          value: "20",
        },
        {
          index: 2,
          value: "18",
        },
        {
          index: 3,
          value: "16",
        },
        {
          index: 4,
          value: "14",
        },
      ],
      drList: [
        {
          index: 1,
          value: "DR5",
        },
        {
          index: 2,
          value: "DR4",
        },
        {
          index: 3,
          value: "DR3",
        },
        {
          index: 4,
          value: "DR2",
        },
        {
          index: 5,
          value: "DR1",
        },
      ],
      alreportList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "enabled",
        },
      ],
      bleList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "5s",
        },
        {
          index: 3,
          value: "10s",
        },
        {
          index: 4,
          value: "20s",
        },
        {
          index: 5,
          value: "30s",
        },
        {
          index: 6,
          value: "1m",
        },
        {
          index: 7,
          value: "2m",
        },
        {
          index: 8,
          value: "5m",
        },
        {
          index: 9,
          value: "10m",
        },
        {
          index: 10,
          value: "15m",
        },
        {
          index: 11,
          value: "20m",
        },
        {
          index: 12,
          value: "30m",
        },
        {
          index: 13,
          value: "1h",
        },
        {
          index: 14,
          value: "2h",
        },
        {
          index: 15,
          value: "6h",
        },
        {
          index: 16,
          value: "12h",
        },
      ],
      scanList: [
        {
          index: 1,
          value: "1s",
        },
        {
          index: 2,
          value: "2s",
        },
        {
          index: 3,
          value: "3s",
        },
        {
          index: 4,
          value: "6s",
        },
        {
          index: 5,
          value: "9s",
        },
        {
          index: 6,
          value: "12s",
        },
        {
          index: 7,
          value: "15s",
        },
        {
          index: 8,
          value: "Always",
        },
      ],
      scaleList: [
        {
          index: 1,
          value: "position/hazardous",
        },
        {
          index: 2,
          value: "position/asset/hazardous",
        },
        {
          index: 3,
          value: "proximity badge",
        },
        {
          index: 4,
          value: "all",
        },
        {
          index: 5,
          value: "asset",
        },
      ],
      buzzerList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "enabled",
        },
      ],
      vibratorList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "enabled",
        },
      ],
      bleackList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "enabled",
        },
      ],
      distanceList: [
        {
          index: 1,
          value: "2m",
        },
        {
          index: 2,
          value: "4m",
        },
        {
          index: 3,
          value: "6m",
        },
        {
          index: 4,
          value: "8m",
        },
        {
          index: 5,
          value: "10m",
        },
        {
          index: 6,
          value: "15m",
        },
        {
          index: 7,
          value: "unlimit",
        },
      ],
      proximityList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "enabled",
        },
      ],
      gpsList: [
        {
          index: 1,
          value: "disabled",
        },
        {
          index: 2,
          value: "5s",
        },
        {
          index: 3,
          value: "10s",
        },
        {
          index: 4,
          value: "15s",
        },
        {
          index: 5,
          value: "30s",
        },
        {
          index: 6,
          value: "60s",
        },
        {
          index: 7,
          value: "150s",
        },
        {
          index: 8,
          value: "5min",
        },
        {
          index: 9,
          value: "15min",
        },
        {
          index: 10,
          value: "30min",
        },
        {
          index: 11,
          value: "60min",
        },
        {
          index: 12,
          value: "90min",
        },
        {
          index: 13,
          value: "3h",
        },
        {
          index: 14,
          value: "6h",
        },
      ],
      thresList: [
        {
          index: 1,
          value: "No limit",
        },
        {
          index: 2,
          value: "-90dbm",
        },
        {
          index: 3,
          value: "-87dbm",
        },
        {
          index: 4,
          value: "-84dbm",
        },
        {
          index: 5,
          value: "-81dbm",
        },
        {
          index: 6,
          value: "-78dbm",
        },
        {
          index: 7,
          value: "-75dbm",
        },
        {
          index: 8,
          value: "-72dbm",
        },
      ],
      hbList: [
        {
          index: 1,
          value: "1min",
        },
        {
          index: 2,
          value: "5min",
        },
        {
          index: 3,
          value: "10min",
        },
        {
          index: 4,
          value: "20min",
        },
        {
          index: 5,
          value: "30min",
        },
        {
          index: 6,
          value: "1h",
        },
        {
          index: 7,
          value: "2h",
        },
        {
          index: 8,
          value: "6h",
        },
        {
          index: 9,
          value: "12h",
        },
        {
          index: 10,
          value: "24h",
        },
      ],
      searchProjectList: [],
      //硬件设备类型下拉框
      searchDevTypeList: [
        {
          index: 1,
          value: "badge",
        },
        {
          index: 2,
          value: "gateway",
        },
        {
          index: 3,
          value: "T-Box",
        },
      ],
      //分配状态下拉框
      searchInallotList: [
        {
          index: 1,
          value: this.$t("home.Assigned1"),
        },
        {
          index: 2,
          value: this.$t("home.Unassigned1"),
        },
      ],
      //在线状态下拉框
      searchHbstatusList: [
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
      exportProjectList: [],
      projectList: [],
      typeList: [
        {
          index: 1,
          value: "tracker",
        },
        {
          index: 2,
          value: "BLE gateway",
        },
      ],
      stepsoffList: [
        {
          index: 0,
          value: 0,
        },
        {
          index: 1,
          value: 1,
        },
        {
          index: 2,
          value: 2,
        },
        {
          index: 3,
          value: 3,
        },
        {
          index: 4,
          value: 4,
        },
        {
          index: 5,
          value: 5,
        },
        {
          index: 6,
          value: 6,
        },
        {
          index: 7,
          value: 7,
        },
      ],
      bleoffList: [
        {
          index: 0,
          value: 0,
        },
        {
          index: 1,
          value: 1,
        },
        {
          index: 2,
          value: 2,
        },
        {
          index: 3,
          value: 3,
        },
        {
          index: 4,
          value: 4,
        },
        {
          index: 5,
          value: 5,
        },
        {
          index: 6,
          value: 6,
        },
        {
          index: 7,
          value: 7,
        },
      ],
      sleepList: [
        {
          index: 0,
          value: "00",
        },
        {
          index: 1,
          value: "01",
        },
        {
          index: 2,
          value: "02",
        },
        {
          index: 3,
          value: "03",
        },
        {
          index: 4,
          value: "04",
        },
        {
          index: 5,
          value: "05",
        },
        {
          index: 6,
          value: "06",
        },
        {
          index: 7,
          value: "07",
        },

        {
          index: 8,
          value: "08",
        },
        {
          index: 9,
          value: "09",
        },
        {
          index: 10,
          value: "10",
        },
        {
          index: 11,
          value: "11",
        },
        {
          index: 12,
          value: "12",
        },
        {
          index: 13,
          value: "13",
        },
        {
          index: 14,
          value: "14",
        },
        {
          index: 15,
          value: "15",
        },
        {
          index: 16,
          value: "16",
        },
        {
          index: 17,
          value: "17",
        },
        {
          index: 18,
          value: "18",
        },
        {
          index: 19,
          value: "19",
        },
        {
          index: 20,
          value: "20",
        },
        {
          index: 21,
          value: "21",
        },
        {
          index: 22,
          value: "22",
        },
        {
          index: 23,
          value: "23",
        },
      ],
      delaySleepList: [
        {
          index: 1,
          value: 0,
        },
        {
          index: 2,
          value: 1,
        },
        {
          index: 3,
          value: 2,
        },
        {
          index: 4,
          value: 3,
        },
        {
          index: 5,
          value: 4,
        },
        {
          index: 6,
          value: 5,
        },
        {
          index: 7,
          value: 6,
        },
        {
          index: 8,
          value: 7,
        },
      ],
    };
  },
  methods: {
    //导出
    exportExcel() {
      var that = this;
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.headerList = [
          {
            msg: this.$t("terminal.DeviceID"),
            value: "deveui",
          },
          {
            msg: this.$t("terminal.alias1"),
            value: "alias",
          },
          {
            msg: this.$t("terminal.mode"),
            value: "joinmode",
          },
          {
            msg: this.$t("terminal.Standard"),
            value: "scheme",
          },
          {
            msg: this.$t("terminal.type"),
            value: "devtype",
          },
          {
            msg: this.$t("terminal.assign"),
            value: "inallot",
          },
          {
            msg: this.$t("terminal.use"),
            value: "inuse",
          },
          {
            msg: this.$t("terminal.state"),
            value: "workstate",
          },
          {
            msg: this.$t("terminal.country1"),
            value: "country",
          },
          {
            msg: this.$t("terminal.ver"),
            value: "ver",
          },
          {
            msg: this.$t("terminal.isonline"),
            value: "hbstatus",
          },
          {
            msg: this.$t("terminal.electricity"),
            value: "battery",
          },
          {
            msg: "rssi",
            value: "rssi",
          },
          {
            msg: this.$t("terminal.snr"),
            value: "snr",
          },
          {
            msg: this.$t("test.framecount"),
            value: "fcnt",
          },
          {
            msg: this.$t("terminal.FrequencyPoint"),
            value: "lastchannel",
          },
          {
            msg: this.$t("terminal.Statusupdatetime"),
            value: "statustime",
          },
          {
            msg: this.$t("terminal.floornumber"),
            value: "groundid",
          },

          {
            msg: this.$t("terminal.lastx"),
            value: "lastx",
          },
          {
            msg: this.$t("terminal.lasty"),
            value: "lasty",
          },
          {
            msg: this.$t("terminal.Locationupdatetime"),
            value: "postime",
          },
          {
            msg: this.$t("beacon.warning"),
            value: "warning",
          },
          {
            msg: this.$t("terminal.postype"),
            value: "postype",
          },
          {
            msg: this.$t("terminal.encryption"),
            value: "keyenc",
          },
          {
            msg: "appeui",
            value: "appeui",
          },
          {
            msg: "nwkskey",
            value: "nwkskey",
          },
          {
            msg: "appkey",
            value: "appkey",
          },
          {
            msg: "orignwkskey",
            value: "orignwkskey",
          },
          {
            msg: "origappkey",
            value: "origappkey",
          },
          {
            msg: this.$t("terminal.currentstate"),
            value: "workmode",
          },
          {
            msg: this.$t("terminal.Debuggingstatus"),
            value: "debugmode",
          },
          {
            msg: this.$t("terminal.Configurationmode"),
            value: "configmode",
          },
          {
            msg: this.$t("terminal.addtime"),
            value: "recv",
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
          deveuis: "",
          tenantid: "",
          projectid: "",
          sysmemo: "",
          memo: "",
          begineui: "",
          endeui: "",
        };
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        this.headerList = [
          {
            msg: this.$t("terminal.DeviceID"),
            value: "deveui",
          },
          {
            msg: this.$t("terminal.alias1"),
            value: "alias",
          },
          {
            msg: this.$t("terminal.mode"),
            value: "joinmode",
          },
          {
            msg: this.$t("terminal.Standard"),
            value: "scheme",
          },
          {
            msg: this.$t("terminal.type"),
            value: "devtype",
          },
          {
            msg: this.$t("terminal.assign"),
            value: "inallot",
          },
          {
            msg: this.$t("terminal.use"),
            value: "inuse",
          },
          {
            msg: this.$t("terminal.state"),
            value: "workstate",
          },
          {
            msg: this.$t("terminal.ver"),
            value: "ver",
          },
          {
            msg: this.$t("terminal.isonline"),
            value: "hbstatus",
          },
          {
            msg: this.$t("terminal.electricity"),
            value: "battery",
          },
          {
            msg: this.$t("test.framecount"),
            value: "fcnt",
          },
          {
            msg: this.$t("terminal.FrequencyPoint"),
            value: "lastchannel",
          },
          {
            msg: this.$t("terminal.statustime"),
            value: "statustime",
          },
          {
            msg: this.$t("terminal.floornumber"),
            value: "groundid",
          },
          {
            msg: this.$t("terminal.Locationupdatetime"),
            value: "postime",
          },
          {
            msg: this.$t("beacon.warning"),
            value: "warning",
          },
          {
            msg: this.$t("terminal.postype"),
            value: "postype",
          },
          {
            msg: this.$t("terminal.Configurationmode"),
            value: "configmode",
          },
          {
            msg: this.$t("terminal.lastx"),
            value: "lastx",
          },
          {
            msg: this.$t("terminal.lasty"),
            value: "lasty",
          },
          {
            msg: this.$t("terminal.encryption"),
            value: "keyenc",
          },
          {
            msg: "appeui",
            value: "appeui",
          },
          {
            msg: "nwkskey",
            value: "nwkskey",
          },
          {
            msg: "appkey",
            value: "appkey",
          },
          {
            msg: "orignwkskey",
            value: "orignwkskey",
          },
          {
            msg: "origappkey",
            value: "origappkey",
          },
          {
            msg: this.$t("terminal.memo"),
            value: "memo",
          },
        ];
        this.exportData = {
          deveuis: "",
          tenantid: this.tenantid_A,
          projectid: "",
          sysmemo: "",
          memo: "",
          begineui: "",
          endeui: "",
        };
      }

      if (this.multipleSelection.length == 0) {
        this.getExportProjectLists(this.tenantid_A);
        this.exportBtn = true; //表格里没有选择设备
      } else {
        this.export2Excel(this.multipleSelection);
      }
    },

    exportExcelTrue() {
      var that = this;
      if (that.exportData.projectid == "") {
        if (that.exportData.begineui && that.exportData.endeui) {
          if (
            that.exportData.begineui.slice(0, 11) !=
            that.exportData.endeui.slice(0, 11)
          ) {
            that.$message({
              message: this.$t("terminal.tet"),
              type: "warning",
            });
            return;
          }
          if (
            that.exportData.begineui.slice(11, 16) -
              that.exportData.endeui.slice(11, 16) >
            0
          ) {
            let start = that.exportData.begineui;
            let end = that.exportData.endeui;
            that.exportData.begineui = end;
            that.exportData.endeui = start;
          }
        }
      }
      exportDevListInfo(
        that.exportData,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.export2Excel(res.data);
          that.exportBtn = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    //导出表格设置
    export2Excel(tableData) {
      var eHeader = [];
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.exprotHeader = [
          "deveui",
          "alias",
          "joinmode",
          "scheme",
          "devtype",
          "inallot",
          "inuse",
          "workstate",
          "country",
          "ver",
          "hbstatus",
          "battery",
          "rssi",
          "snr",
          "fcnt",
          "lastchannel",
          "statustime",
          "groundid",
          "lastx",
          "lasty",
          "postime",
          "warning",
          "postype",
          "keyenc",
          "appeui",
          "nwkskey",
          "appkey",
          "orignwkskey",
          "origappkey",
          "workmode",
          "debugmode",
          "configmode",
          "recv",
          "sysmemo",
          "memo",
        ];
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        this.exprotHeader = [
          "deveui",
          "alias",
          "joinmode",
          "scheme",
          "devtype",
          "inallot",
          "inuse",
          "workstate",
          "ver",
          "hbstatus",
          "battery",
          "fcnt",
          "lastchannel",
          "statustime",
          "groundid",
          "lastx",
          "lasty",
          "postime",
          "warning",
          "postype",
          "configmode",
          "keyenc",
          "appeui",
          "nwkskey",
          "appkey",
          "orignwkskey",
          "origappkey",
          "memo",
        ];
      }

      for (let i = 0; i < this.exprotHeader.length; i++) {
        eHeader.push(this.exprotHeader[i]);
        for (let j = 0; j < this.headerList.length; j++) {
          if (this.exprotHeader[i] == this.headerList[j].value) {
            this.exprotHeader[i] = this.headerList[j].msg;
          }
        }
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        //表头
        const tHeader = this.exprotHeader;
        const filterVal = eHeader;
        const list = tableData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "设备信息");
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
    //导入
    importExcel() {
      if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        document.getElementById("articleImageFile").click(); //触发importExcels
      } else if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.selectTenantid = "";
        this.selectCom = true;
      }
    },
    selectComTrue() {
      this.selectCom = false;
      document.getElementById("articleImageFile").click(); //触发importExcels
    },
    importExcels(obj) {
      var importList;
      let that = this;
      let inputDOM = this.$refs.inputer;
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
          let data;
          if (that.contrForPrionum == 3 || that.contrForPrionum == 4) {
            data = {
              msg: JSON.stringify(importList),
              tenantid: that.tenantid_A,
            };
          } else if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
            data = {
              msg: JSON.stringify(importList),
              tenantid: that.selectTenantid,
            };
          }
          importDevList(
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
              that.getDevLists();
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
            case that.$t("terminal.DeviceID"):
              obj["deveui"] = outdata[i][key];
              break;
            case that.$t("terminal.alias1"):
              obj["alias"] = outdata[i][key];
              break;
            case that.$t("terminal.mode"):
              obj["joinmode"] = outdata[i][key];
              break;
            case that.$t("terminal.Standard"):
              obj["scheme"] = outdata[i][key];
              break;
            case that.$t("terminal.type"):
              obj["devtype"] = outdata[i][key];
              break;
            case that.$t("terminal.assign"):
              obj["inallot"] = outdata[i][key];
              break;
            case that.$t("terminal.use"):
              obj["inuse"] = outdata[i][key];
              break;
            case that.$t("terminal.state"):
              obj["workstate"] = outdata[i][key];
              break;
            case that.$t("terminal.country1"):
              obj["country"] = outdata[i][key];
              break;
            case that.$t("terminal.ver"):
              obj["ver"] = outdata[i][key];
              break;
            case that.$t("terminal.isonline"):
              obj["hbstatus"] = outdata[i][key];
              break;
            case that.$t("terminal.electricity"):
              obj["battery"] = outdata[i][key];
              break;
            case "rssi":
              obj["rssi"] = outdata[i][key];
              break;
            case that.$t("terminal.snr"):
              obj["snr"] = outdata[i][key];
              break;
            case that.$t("test.framecount"):
              obj["fcnt"] = outdata[i][key];
              break;
            case that.$t("terminal.FrequencyPoint"):
              obj["lastchannel"] = outdata[i][key];
              break;
            case that.$t("terminal.statustime"):
              obj["statustime"] = outdata[i][key];
              break;
            case that.$t("terminal.floornumber"):
              obj["groundid"] = outdata[i][key];
              break;
            case that.$t("terminal.Locationupdatetime"):
              obj["postime"] = outdata[i][key];
              break;
            case that.$t("terminal.lastx"):
              obj["lastx"] = outdata[i][key];
              break;
            case that.$t("terminal.lasty"):
              obj["lasty"] = outdata[i][key];
              break;
            case that.$t("beacon.warning"):
              obj["warning"] = outdata[i][key];
              break;
            case that.$t("terminal.postype"):
              obj["postype"] = outdata[i][key];
              break;
            case that.$t("terminal.encryption"):
              obj["keyenc"] = outdata[i][key];
              break;
            case "appeui":
              obj["appeui"] = outdata[i][key];
              break;
            case "nwkskey":
              obj["nwkskey"] = outdata[i][key];
              break;
            case "appkey":
              obj["appkey"] = outdata[i][key];
              break;
            case "orignwkskey":
              obj["orignwkskey"] = outdata[i][key];
              break;
            case "origappkey":
              obj["origappkey"] = outdata[i][key];
              break;
            case that.$t("terminal.currentstate"):
              obj["workmode"] = outdata[i][key];
              break;
            case that.$t("terminal.Debuggingstatus"):
              obj["debugmode"] = outdata[i][key];
              break;
            case that.$t("terminal.Configurationmode"):
              obj["configmode"] = outdata[i][key];
              break;
            case that.$t("beacon.sysmemo"):
              obj["sysmemo"] = outdata[i][key];
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

    changeMode() {
      var that = this;

      if (
        (this.configData.alreport == 2 &&
          this.configData.gps == 1 &&
          this.configData.stepsoff == 0) ||
        (this.configDatas.alreport == 2 &&
          this.configDatas.gps == 1 &&
          this.configDatas.stepsoff == 0)
      ) {
        if (this.configDatas.scale == 1 || this.configDatas.scale == 2) {
          this.configDatas.scale = "";
        }
        that.scaleList = [
          {
            index: 5,
            value: "asset",
          },
          {
            index: 3,
            value: "proximity badge",
          },
          {
            index: 4,
            value: "all",
          },
        ];
      } else {
        if (this.configDatas.scale == 5) {
          this.configDatas.scale = "";
        }
        that.scaleList = [
          {
            index: 1,
            value: "position/hazardous",
          },
          {
            index: 2,
            value: "position/asset/hazardous",
          },
          {
            index: 3,
            value: "proximity badge",
          },
          {
            index: 4,
            value: "all",
          },
        ];
      }
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
      this.getDevLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getDevLists();
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
    formatDateRecv(row, colum) {
      if (row.recv == null || row.recv == 0) {
        return "";
      }
      let date = new Date(parseInt(row.recv) * 1000);
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

    formatDateLastxytime(row, column) {
      if (row.postime == null || row.postime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.postime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    //表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取设备信息
    getDevLists() {
      var that = this;
      getDevList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res.code == 1001) {
            that.tableData = res.data.list;
            that.total = res.data.size;

            // 在数据更新后执行
            that.$nextTick(() => {
              // myTable是表格的ref属性值
              if (
                that.$refs.multipleTable &&
                that.$refs.multipleTable.doLayout
              ) {
                that.$refs.multipleTable.doLayout();
              }
            });
          }
        })
        .finally(() => {
          this.$nextTick(() => {
            this.$refs.multipleTable.doLayout();
          });
        });
    },

    // 添加
    addTer() {
      this.addData = {
        joinmode: "",
        deveui: "",
        scheme: "",
        devtype: "",
        tenantid: "",
        warning: "",
        postype: "",
        keyenc: "",
        nwkskey: "",
        appkey: "",
        workmode: "",
        debugmode: "",
        configmode: "",
        memo: "",
        sysmemo: "",
        num: "",
        country: "",
        custom: "",
      };

      this.workmodeList = [
        {
          index: 1,
          value: "Normal",
        },
        {
          index: 2,
          value: "Test",
        },
      ];
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.addData.custom = 1;
        this.addRules.tenantid = [
          {
            required: true,
            message: this.$t("terminal.tenantidrules"),
            trigger: "change",
          },
        ];

        this.add = true;
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        this.selectScheme(this.tenantid_A);
        this.addData.custom = 2;
        this.addData.tenantid = this.tenantid_A;
        this.addData.country = this.country;
        this.addRules.tenantid = [
          {
            required: false,
            message: this.$t("terminal.tenantidrules"),
            trigger: "change",
          },
        ];

        this.cusadd = true;
      }
    },

    addCancel(addData) {
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.add = false;
      } else if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        this.cusadd = false;
      }
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    //系统管理员添加确定
    addTrue(addData) {
      var that = this;
      this.addAgain = true;
      if (this.addData.num == "" || this.addData.num == 0) {
        this.addData.num = 1;
      }

      //当硬件设备类型不是3（gateway）的时候，不需要RSSI扫描范围和是否触发告警
      if (this.addData.devtype == 1) {
        this.addData.warning = "";
      }

      var Devtypes = that.addData.deveui.slice(9, 10);

      if (that.addData.devtype == 1) {
        if (
          Devtypes != "a" &&
          Devtypes != "b" &&
          Devtypes != "A" &&
          Devtypes != "B"
        ) {
          this.$nextTick(() => {
            this.$refs.getFocus.focus();
          });
          that.$message({
            message: this.$t("terminal.addmsgerror"),
            type: "warning",
          });
          that.addAgain = false;
          return;
        }
      }
      this.$refs[addData].validate((valid) => {
        if (valid) {
          if (that.addAgain) {
            for (let i = 0; i < that.tenantidData.length; i++) {
              if (that.tenantidData[i].tenantid == that.addData.tenantid) {
                that.addData.country = that.tenantidData[i].country;
              }
            }
            this.loading = true;
            if (that.addData.nwkskey && that.addData.appkey) {
              if (that.addData.nwkskey.length != 32) {
                that.$message({
                  message: that.$t("terminal.nwkskeylist"),
                  type: "warning",
                });
                that.loading = false;
                return;
              }
              if (that.addData.appkey.length != 32) {
                that.$message({
                  message: that.$t("terminal.appkeylist"),
                  type: "warning",
                });
                that.loading = false;
                return;
              }
              addDevListKey(
                that.addData,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.add = false;
                  that.searchList.page = 1;
                  that.currentPage1 = 1;
                  that.getDevLists();
                  that.$message({
                    message: that.$t("terminal.addsuccess"),
                    type: "success",
                  });
                  that.loading = false;
                  that.$refs[addData].resetFields();
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  that.loading = false;
                  that.addData.nwkskey = "";
                  that.addData.appkey = "";
                }
              });
            } else {
              //随机生成32位的appeui和appkey
              that.addData.nwkskey = "";
              that.addData.appkey = "";
              for (let i = 0; i < this.addData.num; i++) {
                this.addData.nwkskey += this.generateUUID() + ",";
                this.addData.appkey += this.generateUUID() + ",";
              }
              that.addData.nwkskey = that.addData.nwkskey.slice(
                0,
                that.addData.nwkskey.length - 1
              );
              that.addData.appkey = that.addData.appkey.slice(
                0,
                that.addData.appkey.length - 1
              );
              addDevList(
                that.addData,
                that.tenantkey_A,
                that.tenantid_A,
                that.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.add = false;
                  that.searchList.page = 1;
                  that.currentPage1 = 1;
                  that.getDevLists();
                  that.$message({
                    message: that.$t("terminal.addsuccess"),
                    type: "success",
                  });
                  that.loading = false;
                  that.$refs[addData].resetFields();
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                  that.loading = false;
                  that.addData.nwkskey = "";
                  that.addData.appkey = "";
                }
              });
            }
          }
        } else {
          return false;
        }
      });
    },
    //企业管理员添加确定
    addcusTrue(addData) {
      var that = this;
      if (this.addData.num == "" || this.addData.num == 0) {
        this.addData.num = 1;
      }

      //当硬件设备类型不是3（gateway）的时候，不需要RSSI扫描范围和是否触发告警
      if (this.addData.devtype == 1) {
        this.addData.warning = "";
      }
      this.$refs[addData].validate((valid) => {
        if (valid) {
          this.loading = true;

          if (that.addData.nwkskey && that.addData.appkey) {
            if (that.addData.nwkskey.length != 32) {
              that.$message({
                message: that.$t("terminal.nwkskeylist"),
                type: "warning",
              });
              that.loading = false;
              return;
            }
            if (that.addData.appkey.length != 32) {
              that.$message({
                message: that.$t("terminal.appkeylist"),
                type: "warning",
              });
              that.loading = false;
              return;
            }
            addDevListKey(
              that.addData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.cusadd = false;
                that.searchList.page = 1;
                that.currentPage1 = 1;
                that.getDevLists();
                that.$message({
                  message: that.$t("terminal.addsuccess"),
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
                that.addData.nwkskey = "";
                that.addData.appkey = "";
              }
            });
          } else {
            //随机生成32位的appeui和appkey
            that.addData.nwkskey = "";
            that.addData.appkey = "";
            for (let i = 0; i < this.addData.num; i++) {
              this.addData.nwkskey += this.generateUUID() + ",";
              this.addData.appkey += this.generateUUID() + ",";
            }
            that.addData.nwkskey = that.addData.nwkskey.slice(
              0,
              that.addData.nwkskey.length - 1
            );
            that.addData.appkey = that.addData.appkey.slice(
              0,
              that.addData.appkey.length - 1
            );
            addDevList(
              that.addData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.cusadd = false;
                that.searchList.page = 1;
                that.currentPage1 = 1;
                that.getDevLists();
                that.$message({
                  message: that.$t("terminal.addsuccess"),
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
                that.addData.nwkskey = "";
                that.addData.appkey = "";
              }
            });
          }
        } else {
          return false;
        }
      });
    },

    // 编辑
    editTer(index) {
      if (
        (this.contrForPrionum == 1 || this.contrForPrionum == 2) &&
        this.tableData[index].custom == 2
      ) {
        this.$message({
          message: this.$t("terminal.tet3"),
          type: "warning",
        });
        return;
      }
      if (this.tableData[index].clockin == 1) {
        this.setWarning = true;
      } else if (this.tableData[index].clockin == 2) {
        this.setWarning = false;
      }
      this.editData.deveui = this.tableData[index].deveui;
      this.editData.ver = this.tableData[index].ver;
      this.editData.country = this.tableData[index].country;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.alias = this.tableData[index].alias;
      this.editData.inuse = this.tableData[index].inuse;
      this.editData.hbstatus = this.tableData[index].hbstatus;
      this.editData.battery = this.tableData[index].battery;
      this.editData.rssi = this.tableData[index].rssi;
      this.editData.snr = this.tableData[index].snr;
      this.editData.fcnt = this.tableData[index].fcnt;
      this.editData.lastchannel = this.tableData[index].lastchannel;
      this.editData.mapid = this.tableData[index].mapid;
      this.editData.lastx = this.tableData[index].lastx;
      this.editData.lasty = this.tableData[index].lasty;
      this.editData.postime = this.tableData[index].postime;
      this.editData.warning = this.tableData[index].warning;
      this.editData.postype = this.tableData[index].postype;
      this.editData.workmode = this.tableData[index].workmode;
      this.editData.workstate = this.tableData[index].workstate;
      this.editData.debugmode = this.tableData[index].debugmode;
      this.editData.configmode = this.tableData[index].configmode;
      this.editData.memo = this.tableData[index].memo;
      this.editData.sysmemo = this.tableData[index].sysmemo;
      this.editData.joinmode = this.tableData[index].joinmode;
      if (this.tableData[index].devtype == 2) {
        this.editDataGateway = true;
      } else {
        this.editDataGateway = false;
      }
      if (this.tableData[index].inallot == 2) {
        this.editTenantid = false;
      } else {
        this.editTenantid = true;
      }
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.workmodeList = [
          {
            index: 1,
            value: "Normal",
          },
          {
            index: 2,
            value: "Test",
          },
          {
            index: 3,
            value: "Sold",
          },
        ];
      } else {
        this.workmodeList = [
          {
            index: 1,
            value: "Normal",
          },
          {
            index: 2,
            value: "Test",
          },
        ];
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
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (that.contrForPrionum == 3 || that.contrForPrionum == 4) {
            that.editData.country = that.country;
          }
          if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
            for (let i = 0; i < that.tenantidData.length; i++) {
              if (that.tenantidData[i].tenantid == that.editData.tenantid) {
                that.editData.country = that.tenantidData[i].country;
              }
            }
          }

          this.loading = true;
          updateDevList(
            that.editData,
            that.tenantkey_A,
            that.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.getDevLists();
              that.$message({
                message: that.$t("terminal.editsuccess"),
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
        } else {
          return false;
        }
      });
    },

    //批量编辑
    editTers(index) {
      var that = this;
      this.setWarning = false;
      this.editDatas.deveuiList = "";
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.editmsgswarning"),
          type: "warning",
        });
        return;
      }
      //获取deveui集合
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (that.multipleSelection[i].clockin == 1) {
          that.setWarning = true;
        }
        if (
          this.multipleSelection[0].customername !=
          this.multipleSelection[i].customername
        ) {
          that.$message({
            message: this.$t("terminal.tet4"),
            type: "warning",
          });
          return;
        }
        that.editDatas.deveuiList += that.multipleSelection[i].deveui + ",";
      }
      //去掉最后一个逗号
      that.editDatas.deveuiList = that.editDatas.deveuiList.slice(
        0,
        that.editDatas.deveuiList.length - 1
      );
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.workmodeList = [
          {
            index: 1,
            value: "Normal",
          },
          {
            index: 2,
            value: "Test",
          },
          {
            index: 3,
            value: "Sold",
          },
        ];
      } else {
        this.workmodeList = [
          {
            index: 1,
            value: "Normal",
          },
          {
            index: 2,
            value: "Test",
          },
        ];
      }

      this.editDatas.tenantid = "";
      this.edits = true;
    },
    editCancels(editDatas) {
      this.edits = false;
      this.loading = false;
      this.$refs[editDatas].resetFields();
    },
    editTrues(editDatas) {
      if (
        this.editDatas.alias == "" &&
        this.editDatas.configmode == "" &&
        this.editDatas.country == "" &&
        this.editDatas.debugmode == "" &&
        this.editDatas.joinmode == "" &&
        this.editDatas.memo == "" &&
        this.editDatas.postype == "" &&
        this.editDatas.tenantid == "" &&
        this.editDatas.warning == "" &&
        this.editDatas.workmode == "" &&
        this.editDatas.sysmemo == ""
      ) {
        //批量编辑输入框都为空，提示
        this.$message({
          message: this.$t("terminal.tet5"),
          type: "warning",
        });
        return;
      }
      var that = this;
      this.$refs[editDatas].validate((valid) => {
        if (valid) {
          if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
            for (let i = 0; i < that.tenantidData.length; i++) {
              if (that.tenantidData[i].tenantid == that.editDatas.tenantid) {
                that.editDatas.country = that.tenantidData[i].country;
              }
            }
          }

          this.loading = true;
          updateDevListBatch(
            that.editDatas,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edits = false;
              that.getDevLists();
              that.$message({
                message: that.$t("terminal.editsuccess"),
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
        } else {
          return false;
        }
      });
    },
    // 企业管理员删除按钮是否置灰
    showButton(row) {
      if (
        (this.$store.state.userInfo.prionum == 3 ||
          this.$store.state.userInfo.prionum == 4) &&
        row.custom == 1
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 删除
    delTer(index) {
      if (
        (this.$store.state.userInfo.prionum == 5 && this.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 && this.delprio == 2)
      ) {
        this.$message({
          message: this.$t("staffmanagement.permissiondelete"),
          type: "warning",
        });
        return;
      }
      if (
        (this.contrForPrionum == 1 || this.contrForPrionum == 2) &&
        this.tableData[index].custom == 2
      ) {
        this.$message({
          message: this.$t("terminal.tet3"),
          type: "warning",
        });
        return;
      }
      if (
        (this.contrForPrionum == 3 || this.contrForPrionum == 4) &&
        this.tableData[index].custom == 1
      ) {
        this.$message({
          message: this.$t("terminal.tet43"),
          type: "warning",
        });
        return;
      }
      var that = this;
      if (this.tableData[index].inallot == 1) {
        this.$message({
          message: this.$t("terminal.tet6"),
          type: "warning",
        });
        return;
      }
      if (this.tableData[index].inuse == 1) {
        this.$message({
          message: this.$t("terminal.tet7"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("terminal.deletetermsg1") +
          this.tableData[index].deveui +
          this.$t("terminal.deletetermsg2"),
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
        delDevList(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              that.getDevLists();
              that.$message({
                message: that.$t("terminal.deletesuccess"),
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
    delTers(index) {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.deletetermsgs"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inuse == 1) {
          that.$message({
            message: this.$t("terminal.deletetermsgs1"),
            type: "warning",
          });
          return;
        }
      }
      this.deleteData = this.multipleSelection;
      this.deletes = true;
    },

    deleteTrue() {
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
      var that = this;
      let data = {
        deveuis: [],
      };

      for (let i = 0; i < this.deleteData.length; i++) {
        if (
          (that.contrForPrionum == 3 || that.contrForPrionum == 4) &&
          that.deleteData[i].custom == 1
        ) {
          that.$message({
            message: that.$t("terminal.tet44"),
            type: "warning",
          });
          data.deveuis = [];
          return;
        }
        data.deveuis.push(this.deleteData[i].deveui);
      }
      this.loading = true;
      delDevListByDeveuis(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.deletes = false;
          that.getDevLists();
          that.$message({
            message: that.$t("terminal.deletesuccess"),
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

    //批量同步
    devToNs() {
      var that = this;
      // addDevToNs
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.tet8"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].custom == 2) {
          that.$message({
            message: this.$t("terminal.tet3"),
            type: "warning",
          });
          return;
        }
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
            addDevToNs(
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

    //devtype硬件设备类型发生改变(系统管理员)
    changeDevtype(event) {
      let Devtype = this.addData.deveui.slice(9, 10);
      if (event == 2) {
        this.addDataGateway = true;
        if (
          Devtype != "c" &&
          Devtype != "d" &&
          Devtype != "C" &&
          Devtype != "D"
        ) {
          this.$nextTick(() => {
            this.$refs.getFocus.focus();
          });

          this.$message({
            message: this.$t("terminal.addmsgerror"),
            type: "warning",
          });
          return;
        }
      } else if (event == 1) {
        this.addDataGateway = false;
        this.addData.warning = "";
        if (
          Devtype != "a" &&
          Devtype != "b" &&
          Devtype != "A" &&
          Devtype != "B"
        ) {
          this.$nextTick(() => {
            this.$refs.getFocus.focus();
          });
          this.$message({
            message: this.$t("terminal.addmsgerror"),
            type: "warning",
          });
          return;
        }
      }
    },

    //devtype硬件设备类型发生改变(企业管理员)
    changecusDevtype(event) {
      if (event == 2) {
        this.addcueDataGateway = true;
      } else if (event == 1) {
        this.addcueDataGateway = false;
        this.addData.warning = "";
      }
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
    },

    //随机生成32位
    generateUUID() {
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(
        /[x]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return r.toString(16);
        }
      );
      return uuid;
    },

    // 搜索
    searchInfo() {
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

      getDevList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      )
        .then((res) => {
          if (res.code == 1001) {
            that.tableData = res.data.list;
            that.total = res.data.size;
            if (res.data.size > 0) {
              that.$message({
                message: that.$t("terminal.searchsuccess"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$t("terminal.nodata"),
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
        })
        .finally(() => {
          this.$nextTick(() => {
            this.$refs.multipleTable.doLayout();
          });
        });
    },

    // 刷新
    clearBtn() {
      if (this.$router.query) {
        this.$router.push({ query: {} });
      }
      this.batterys = "";
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          joinmode: "",
          deveui: "",
          scheme: "",
          country: "",
          tenantid: "",
          projectid: "",
          alias: "",
          postype: "",
          memo: "",
          sysmemo: "",
          likememo: "",
          likesysmemo: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
          workstate: "",
          inuse: "",
          hbstatus: "",
          inallot: "",
          devtype: "",
          beginbat: "",
          endbat: "",
          custom: "",
          type: "",
        };
        this.selectMemo = "";
      } else if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4
      ) {
        this.searchList = {
          joinmode: "",
          deveui: "",
          scheme: "",
          country: "",
          tenantid: this.$store.state.userInfo.tenantid,
          alias: "",
          postype: "",
          memo: "",
          sysmemo: "",
          likememo: "",
          likesysmemo: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
          projectid: "",
          workstate: "",
          inuse: "",
          hbstatus: "",
          inallot: "",
          devtype: "",
          beginbat: "",
          endbat: "",
          custom: "",
          type: "",
        };
        this.selectMemo = "";
      } else if (this.$store.state.userInfo.prionum == 5) {
        this.searchList = {
          joinmode: "",
          deveui: "",
          scheme: "",
          country: "",
          tenantid: this.$store.state.intoProjectSuperid,
          alias: "",
          postype: "",
          memo: "",
          sysmemo: "",
          likememo: "",
          likesysmemo: "",
          begintime: "",
          endtime: "",
          page: 1,
          count: 20,
          projectid: this.$store.state.projectid,
          workstate: "",
          inuse: "",
          hbstatus: "",
          inallot: "",
          devtype: "",
          beginbat: "",
          endbat: "",
          custom: "",
          type: "",
        };
      }
      this.tasktime = [];
      this.currentPage1 = 1;
      this.getDevLists();
    },

    // 配置参数
    configTer(index) {
      if (this.tableData[index].custom == 2) {
        this.$message({
          message: this.$t("terminal.tet13"),
          type: "warning",
        });
        return;
      }
      if (
        this.tableData[index].ver == "" ||
        this.tableData[index].ver == null
      ) {
        this.$message({
          message: this.$t("terminal.tet14"),
          type: "warning",
        });
        return;
      }
      // inallot分配状态Yes，No
      if (this.tableData[index].inallot == 2) {
        this.selectConfig = false;
      } else {
        this.selectConfig = true;
      }
      var that = this;
      let data = {
        deveui: this.tableData[index].deveui,
      };
      getDevConfigV2(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.configData = res.data;
          let starttime = res.data.sleepstart + that.timezone;
          let endtime = res.data.sleepend + that.timezone;

          that.configData.sleepend = endtime > 24 ? endtime - 24 : endtime;
          that.configData.sleepstart =
            starttime > 24 ? starttime - 24 : starttime;

          if (res.data.mode == 3 || res.data.mode == 4) {
            that.powerList = [
              {
                index: 4,
                value: "16",
              },
              {
                index: 6,
                value: "14",
              },
              {
                index: 8,
                value: "12",
              },
              {
                index: 10,
                value: "10",
              },
            ];
          } else if (res.data.mode == 2 || res.data.mode == 7) {
            that.powerList = [
              {
                index: 1,
                value: "20",
              },
              {
                index: 2,
                value: "18",
              },
              {
                index: 4,
                value: "16",
              },
              {
                index: 6,
                value: "14",
              },
            ];
          } else if (res.data.mode == 1) {
            that.powerList = [
              {
                index: 3,
                value: "17",
              },
              {
                index: 5,
                value: "15",
              },
              {
                index: 7,
                value: "13",
              },
              {
                index: 9,
                value: "11",
              },
            ];
          }
          if (res.data.mode == 2) {
            that.drList = [
              {
                index: 3,
                value: "DR3",
              },
              {
                index: 4,
                value: "DR2",
              },
              {
                index: 5,
                value: "DR1",
              },
            ];
          } else {
            that.drList = [
              {
                index: 1,
                value: "DR5",
              },
              {
                index: 2,
                value: "DR4",
              },
              {
                index: 3,
                value: "DR3",
              },
            ];
          }

          if (res.data.type == 1) {
            that.scaleList = [
              {
                index: 1,
                value: "position/hazardous",
              },
              {
                index: 2,
                value: "position/asset/hazardous",
              },
              {
                index: 3,
                value: "proximity badge",
              },
              {
                index: 4,
                value: "all",
              },
            ];
          } else if (res.data.type == 2) {
            that.scaleList = [
              {
                index: 5,
                value: "asset",
              },
              {
                index: 3,
                value: "proximity badge",
              },
              {
                index: 4,
                value: "all",
              },
            ];
          }
          that.config = true;
        }
      });
    },
    //判断蓝牙扫描周期和蓝牙扫描持续时间
    checkScan(event) {
      var that = this;
      switch (event.ble) {
        case 2:
          if (event.scan > 3 && event.scan != 8) {
            that.$message({
              message: this.$t("terminal.tet15"),
              type: "warning",
            });
          }
          break;
        case 3:
          if (event.scan > 5 && event.scan != 8) {
            that.$message({
              message: this.$t("terminal.tet15"),
              type: "warning",
            });
          }
          break;
        default:
          break;
      }
    },

    configTrue(configData) {
      var that = this;
      if (this.configData.gps === 1) {
        if (this.configData.alreport == "" || this.configData.stepsoff === "") {
          that.$message({
            message: this.$t("terminal.tet16"),
            type: "warning",
          });
          return;
        }
      }
      if (this.configData.alreport === 2) {
        if (this.configData.gps == "" || this.configData.stepsoff === "") {
          that.$message({
            message: this.$t("terminal.tet17"),
            type: "warning",
          });
          return;
        }
      }
      if (this.configData.stepsoff === 0) {
        if (this.configData.alreport == "" || this.configData.gps == "") {
          that.$message({
            message: this.$t("terminal.tet18"),
            type: "warning",
          });
          return;
        }
      }

      let starttime, endtime;
      if (this.configData.sleepstart || this.configData.sleepstart === 0) {
        starttime = this.configData.sleepstart - this.timezone;
        this.configData.sleepstart = starttime < 0 ? 24 + starttime : starttime;
      }
      if (this.configData.sleepend || this.configData.sleepend === 0) {
        endtime = this.configData.sleepend - this.timezone;
        this.configData.sleepend = endtime < 0 ? 24 + endtime : endtime;
      }
      this.$refs[configData].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateDevConfigV2(
            that.configData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.config = false;
              that.getDevLists();
              that.$message({
                message: that.$t("terminal.configsuccess"),
                type: "success",
              });
              that.loading = false;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              starttime = that.configData.sleepstart + that.timezone;
              endtime = that.configData.sleepend + that.timezone;

              that.configData.sleepend = endtime > 24 ? endtime - 24 : endtime;
              that.configData.sleepstart =
                starttime > 24 ? starttime - 24 : starttime;
              that.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //批量配置
    configTers(index) {
      var that = this;
      this.configDatas = {
        deveuiList: "",
        power: "",
        dr: "",
        alreport: "",
        ble: "",
        scan: "",
        scale: "",
        stepsoff: "",
        bleoff: "",
        buzzer: "",
        vibrator: "",
        distance: "",
        proximity: "",
        gps: "",
        hb: "",
        degree: "",
        sleepstart: "",
        sleepend: "",
        thres: "",
        bleack: "",
      };
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.configtersmsg"),
          type: "warning",
        });
        return;
      }

      //判断制式是否一致
      //获取deveuiList集合
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (that.multipleSelection[i].custom == 2) {
          that.$message({
            message: this.$t("terminal.tet19"),
            type: "warning",
          });
          return;
        }
        if (
          that.multipleSelection[0].customername !=
          that.multipleSelection[i].customername
        ) {
          that.$message({
            message: this.$t("terminal.tet20"),
            type: "warning",
          });
          return;
        }
        if (
          that.multipleSelection[0].scheme != that.multipleSelection[i].scheme
        ) {
          that.$message({
            message: this.$t("terminal.configtersmsg1"),
            type: "warning",
          });
          return;
        }
        if (
          that.multipleSelection[i].ver == null ||
          that.multipleSelection[i].ver == ""
        ) {
          that.$message({
            message: this.$t("terminal.tet21"),
            type: "warning",
          });
          return;
        }
        if (
          that.multipleSelection[0].scheme == 4 ||
          that.multipleSelection[0].scheme == 5
        ) {
          that.powerList = [
            {
              index: 4,
              value: "16",
            },
            {
              index: 6,
              value: "14",
            },
            {
              index: 8,
              value: "12",
            },
            {
              index: 10,
              value: "10",
            },
          ];
        } else if (
          that.multipleSelection[0].scheme == 2 ||
          that.multipleSelection[0].scheme == 3 ||
          that.multipleSelection[0].scheme == 8 ||
          that.multipleSelection[0].scheme == 9
        ) {
          that.powerList = [
            {
              index: 1,
              value: "20",
            },
            {
              index: 2,
              value: "18",
            },
            {
              index: 4,
              value: "16",
            },
            {
              index: 6,
              value: "14",
            },
          ];
        } else if (that.multipleSelection[0].scheme == 1) {
          that.powerList = [
            {
              index: 3,
              value: "17",
            },
            {
              index: 5,
              value: "15",
            },
            {
              index: 7,
              value: "13",
            },
            {
              index: 9,
              value: "11",
            },
          ];
        }
        if (
          that.multipleSelection[0].scheme == 2 ||
          that.multipleSelection[0].scheme == 3
        ) {
          that.drList = [
            {
              index: 3,
              value: "DR3",
            },
            {
              index: 4,
              value: "DR2",
            },
            {
              index: 5,
              value: "DR1",
            },
          ];
        } else {
          that.drList = [
            {
              index: 1,
              value: "DR5",
            },
            {
              index: 2,
              value: "DR4",
            },
            {
              index: 3,
              value: "DR3",
            },
          ];
        }
        that.configDatas.deveuiList += that.multipleSelection[i].deveui + ",";
      }

      // 去掉最后一个逗号
      that.configDatas.deveuiList = that.configDatas.deveuiList.slice(
        0,
        that.configDatas.deveuiList.length - 1
      );
      that.scaleList = [
        {
          index: 1,
          value: "position/hazardous",
        },
        {
          index: 2,
          value: "position/asset/hazardous",
        },
        {
          index: 3,
          value: "proximity badge",
        },
        {
          index: 4,
          value: "all",
        },
        {
          index: 5,
          value: "asset",
        },
      ];
      this.configs = true;
    },
    configTrues(configDatas) {
      var that = this;
      if (this.configDatas.gps === 1) {
        if (
          this.configDatas.alreport == "" ||
          this.configDatas.stepsoff === ""
        ) {
          that.$message({
            message: this.$t("terminal.tet16"),
            type: "warning",
          });
          return;
        }
      }
      if (this.configDatas.alreport === 2) {
        if (this.configDatas.gps == "" || this.configDatas.stepsoff === "") {
          that.$message({
            message: this.$t("terminal.tet17"),
            type: "warning",
          });
          return;
        }
      }
      if (this.configDatas.stepsoff === 0) {
        if (this.configDatas.alreport == "" || this.configDatas.gps == "") {
          that.$message({
            message: this.$t("terminal.tet18"),
            type: "warning",
          });
          return;
        }
      }
      let starttime, endtime;
      if (this.configDatas.sleepstart || this.configDatas.sleepstart === 0) {
        starttime = this.configDatas.sleepstart - this.timezone;
        this.configDatas.sleepstart =
          starttime < 0 ? 24 + starttime : starttime;
      }
      if (this.configDatas.sleepend || this.configDatas.sleepend === 0) {
        endtime = this.configDatas.sleepend - this.timezone;
        this.configDatas.sleepend = endtime < 0 ? 24 + endtime : endtime;
      }

      this.$refs[configDatas].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateDevConfigV2List(
            that.configDatas,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.configs = false;
              that.getDevLists();
              that.$message({
                message: that.$t("terminal.configsuccess"),
                type: "success",
              });
              that.loading = false;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              if (that.configDatas.sleepstart) {
                starttime = that.configDatas.sleepstart + that.timezone;
                that.configDatas.sleepstart =
                  starttime > 24 ? starttime - 24 : starttime;
              }
              if (that.configDatas.sleepend) {
                endtime = that.configDatas.sleepend + that.timezone;
                that.configDatas.sleepend =
                  endtime > 24 ? endtime - 24 : endtime;
              }
              that.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    },

    //扩展
    extendTerminal(index) {
      if (this.tableData[index].custom == 2) {
        this.$message({
          message: this.$t("terminal.tet3"),
          type: "warning",
        });
        return;
      }
      var that = this;
      // 可重传信标列表
      this.retransmissionBeaconList = {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        value6: "",
        value7: "",
        value8: "",
        value9: "",
        value10: "",
        value11: "",
        value12: "",
        value13: "",
        value14: "",
        value15: "",
        value16: "",
        value17: "",
        value18: "",
        value19: "",
        value20: "",
      };
      //定位UUID
      this.auuid0 = "";
      this.auuid1 = "";
      this.auuid2 = "";
      this.auuid3 = "";
      this.auuid4 = "";

      this.puuid0 = "";
      this.puuid1 = "";
      this.puuid2 = "";
      this.puuid3 = "";
      this.puuid4 = "";
      //定位UUID
      this.positionUUIDData.deveuis = this.tableData[index].deveui;
      //资产UUID
      this.assetUUIDData.deveuis = this.tableData[index].deveui;
      //透传数据
      this.beaconFilterData.deveuis = this.tableData[index].deveui;
      // 可重传信标列表
      this.retransmissionBeaconDeveui = this.tableData[index].deveui;
      let data = {
        deveui: this.tableData[index].deveui,
      };
      // 判断类型是否为网关，网关不显示重传信标列表
      if (this.tableData[index].devtype == 2) {
        that.changeRetransmissionBeacon = false;
      } else {
        that.changeRetransmissionBeacon = true;
      }
      //获取UUID信息
      getDevConfigV2(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.auuid) {
            let auuidArr = res.data.auuid.split(",");
            that.auuid0 = auuidArr[0];
            that.auuid1 = auuidArr[1];
            that.auuid2 = auuidArr[2];
            that.auuid3 = auuidArr[3];
            that.auuid4 = auuidArr[4];
          }
          if (res.data.puuid) {
            let puuidArr = res.data.puuid.split(",");
            that.puuid0 = puuidArr[0];
            that.puuid1 = puuidArr[1];
            that.puuid2 = puuidArr[2];
            that.puuid3 = puuidArr[3];
            that.puuid4 = puuidArr[4];
          }
          if (res.data.bleconfig) {
            let retransmissionBeaconArr = res.data.bleconfig.split(",");
            for (let i = 0; i < retransmissionBeaconArr.length; i++) {
              const name = `value${i + 1}`;
              that.retransmissionBeaconList[name] = retransmissionBeaconArr[i];
            }
          }
        }
      });
      //获取透传数据信息

      getDevConfigFilter(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.beaconFilterDataList = res.data;
        }
      });
      this.extendTer = true;
    },

    // 配置定位UUID
    extendPositionTur() {
      var that = this;
      this.positionUUIDData.uuidList = [
        {
          uuid: this.puuid0,
          index: 0,
        },
        {
          uuid: this.puuid1,
          index: 1,
        },
        {
          uuid: this.puuid2,
          index: 2,
        },
        {
          uuid: this.puuid3,
          index: 3,
        },
        {
          uuid: this.puuid4,
          index: 4,
        },
      ];
      //判断UUID是否重复
      let list = JSON.parse(JSON.stringify(this.positionUUIDData.uuidList));
      for (let i = this.positionUUIDData.uuidList.length - 1; i >= 0; i--) {
        if (
          this.positionUUIDData.uuidList[i].uuid == "" ||
          this.positionUUIDData.uuidList[i].uuid == null ||
          this.positionUUIDData.uuidList[i].uuid ==
            "00000000000000000000000000000000" ||
          this.positionUUIDData.uuidList[i].uuid ==
            "ffffffffffffffffffffffffffffffff" ||
          this.positionUUIDData.uuidList[i].uuid ==
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        ) {
          this.positionUUIDData.uuidList.splice(i, 1);
        }
      }
      const uuids = this.positionUUIDData.uuidList.map((value) => value.uuid);
      const uuidsSet = new Set(uuids);
      if (uuidsSet.size != uuids.length) {
        that.$message({
          message: this.$t("terminal.tet22"),
          type: "warning",
        });
        return;
      }

      for (let i = 0; i < list.length; i++) {
        if (list[i].uuid == "") {
          list[i].uuid = "00000000000000000000000000000000";
        }
      }
      this.positionUUIDData.uuidList = list;
      this.positionUUIDData.uuidList = JSON.stringify(
        this.positionUUIDData.uuidList
      );
      updateDevBeaconUUID(
        this.positionUUIDData,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("terminal.configsuccess"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //配置资产UUID
    extendAssetTur() {
      var that = this;
      this.assetUUIDData.uuidList = [
        {
          uuid: this.auuid0,
          index: 0,
        },
        {
          uuid: this.auuid1,
          index: 1,
        },
        {
          uuid: this.auuid2,
          index: 2,
        },
        {
          uuid: this.auuid3,
          index: 3,
        },
        {
          uuid: this.auuid4,
          index: 4,
        },
      ];

      //判断UUID是否重复
      let list = JSON.parse(JSON.stringify(this.assetUUIDData.uuidList));
      for (let i = this.assetUUIDData.uuidList.length - 1; i >= 0; i--) {
        if (
          this.assetUUIDData.uuidList[i].uuid == "" ||
          this.assetUUIDData.uuidList[i].uuid == null ||
          this.assetUUIDData.uuidList[i].uuid ==
            "00000000000000000000000000000000" ||
          this.assetUUIDData.uuidList[i].uuid ==
            "ffffffffffffffffffffffffffffffff" ||
          this.assetUUIDData.uuidList[i].uuid ==
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        ) {
          this.assetUUIDData.uuidList.splice(i, 1);
        }
      }
      const uuids = this.assetUUIDData.uuidList.map((value) => value.uuid);
      const uuidsSet = new Set(uuids);
      if (uuidsSet.size != uuids.length) {
        that.$message({
          message: this.$t("terminal.tet22"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].uuid == "") {
          list[i].uuid = "00000000000000000000000000000000";
        }
      }
      this.assetUUIDData.uuidList = list;
      this.assetUUIDData.uuidList = JSON.stringify(this.assetUUIDData.uuidList);
      updateDevBeaconUUID(
        this.assetUUIDData,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("terminal.configsuccess"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //选择过滤通道,获得相对应的透传数据
    selectFilterport(val) {
      let flag = false;
      for (let i = 0; i < this.beaconFilterDataList.length; i++) {
        if (this.beaconFilterDataList[i].port == val) {
          this.beaconFilterData.filter = this.beaconFilterDataList[i].filter;
          this.beaconFilterData.filterStart =
            this.beaconFilterDataList[i].filterStart;
          this.beaconFilterData.filterLen =
            this.beaconFilterDataList[i].filterLen;
          this.beaconFilterData.start = this.beaconFilterDataList[i].start;
          this.beaconFilterData.end = this.beaconFilterDataList[i].end;
          flag = true;
        }
      }
      if (!flag) {
        this.beaconFilterData.filter = "";
        this.beaconFilterData.filterStart = "";
        this.beaconFilterData.filterLen = "";
        this.beaconFilterData.start = "";
        this.beaconFilterData.end = "";
      }
    },
    //配置透传数据
    extendFilterTur(beaconFilterData) {
      var that = this;
      this.$refs[beaconFilterData].validate((valid) => {
        if (valid) {
          if (
            that.beaconFilterData.filter.length < 8 ||
            that.beaconFilterData.filter.length > 32
          ) {
            that.$message({
              message: this.$t("terminal.tet23"),
              type: "warning",
            });
            return;
          }
          if (that.beaconFilterData.filter.length % 2 != 0) {
            that.$message({
              message: this.$t("terminal.tet24"),
              type: "warning",
            });
            return;
          }
          if (
            that.beaconFilterData.end * 1 > that.beaconFilterData.start * 1 ||
            (that.beaconFilterData.end == "0" &&
              that.beaconFilterData.start == "0")
          ) {
            that.beaconFilterData.filterLen =
              that.beaconFilterData.filter.length / 2;
          } else {
            that.$message({
              message: this.$t("terminal.tet25"),
              type: "warning",
            });
            return;
          }
          updateDevBeaconFilter(
            that.beaconFilterData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("terminal.configsuccess"),
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
    //透传取消
    extendCancel(beaconFilterData) {
      this.extendTer = false;
      this.loading = false;
      this.$refs[beaconFilterData].resetFields();
    },
    // 可重传信标列表
    retransmissionTur() {
      var that = this;
      let arr = Object.values(this.retransmissionBeaconList);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "00000000") {
          that.$message({
            message: this.$t("terminal.tet26"),
            type: "warning",
          });
          return;
        }
        if (arr[i] == "" || arr[i] == null || typeof arr[i] == undefined) {
          arr.splice(i, 1);
          i = i - 1;
        }
      }
      if (new Set(arr).size !== arr.length) {
        this.$message({
          message: this.$t("terminal.tet27"),
          type: "warning",
        });
        return;
      }
      let retransmissionBeacon = "";
      for (let i = 0; i < arr.length; i++) {
        retransmissionBeacon += arr[i] + ",";
      }
      // 去掉最后一个逗号
      retransmissionBeacon = retransmissionBeacon.slice(
        0,
        retransmissionBeacon.length - 1
      );
      let data = {
        deveuis: this.retransmissionBeaconDeveui,
        fport: 17,
        beaconList: retransmissionBeacon,
      };
      updateHistoryBleConfig(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("terminal.tet28"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //批量扩展
    extendTerminals() {
      this.changeRetransmissionBeacons = true;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].custom == 2) {
          this.$message({
            message: this.$t("terminal.tet3"),
            type: "warning",
          });
          return;
        }
        if (this.multipleSelection[i].devtype == 2) {
          this.changeRetransmissionBeacons = false;
        }
      }

      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.tet29"),
          type: "warning",
        });
        return;
      }

      //定位UUID
      this.positionUUIDDatas = {
        deveuis: "",
        uuidList: "",
        fPort: 14,
      };
      //资产UUID
      this.assetUUIDDatas = {
        deveuis: "",
        uuidList: "",
        fPort: 15,
      };
      //透传数据
      this.beaconFilterDatas = {
        deveuis: "",
        filter: "", //截取数据的字符串
        filterStart: "", //截取数据的开始位置
        filterLen: "", //截取数据的长度
        start: "", //透传数据的开始的位置
        end: "", //透传数据的结束位置
        port: "",
      };
      // 可重传信标列表
      this.retransmissionBeaconDeveuis = "";
      this.retransmissionBeaconLists = {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        value6: "",
        value7: "",
        value8: "",
        value9: "",
        value10: "",
        value11: "",
        value12: "",
        value13: "",
        value14: "",
        value15: "",
        value16: "",
        value17: "",
        value18: "",
        value19: "",
        value20: "",
      };
      this.auuid0 = "";
      this.auuid1 = "";
      this.auuid2 = "";
      this.auuid3 = "";
      this.auuid4 = "";

      this.puuid0 = "";
      this.puuid1 = "";
      this.puuid2 = "";
      this.puuid3 = "";
      this.puuid4 = "";
      for (let i = 0; i < this.multipleSelection.length; i++) {
        //定位UUID
        that.positionUUIDDatas.deveuis +=
          that.multipleSelection[i].deveui + ",";
        //资产UUID
        that.assetUUIDDatas.deveuis += that.multipleSelection[i].deveui + ",";
        //透传数据
        that.beaconFilterDatas.deveuis +=
          that.multipleSelection[i].deveui + ",";
        // 可重传信标列表
        that.retransmissionBeaconDeveuis +=
          that.multipleSelection[i].deveui + ",";
      }
      // 去掉最后一个逗号
      that.positionUUIDDatas.deveuis = that.positionUUIDDatas.deveuis.slice(
        0,
        that.positionUUIDDatas.deveuis.length - 1
      );
      that.assetUUIDDatas.deveuis = that.assetUUIDDatas.deveuis.slice(
        0,
        that.assetUUIDDatas.deveuis.length - 1
      );
      that.beaconFilterDatas.deveuis = that.beaconFilterDatas.deveuis.slice(
        0,
        that.beaconFilterDatas.deveuis.length - 1
      );
      that.retransmissionBeaconDeveuis = that.retransmissionBeaconDeveuis.slice(
        0,
        that.retransmissionBeaconDeveuis.length - 1
      );

      this.extendTers = true;
    },
    // 批量配置定位UUID
    extendPositionTurs() {
      var that = this;
      this.positionUUIDDatas.uuidList = [
        {
          uuid: this.puuid0,
          index: 0,
        },
        {
          uuid: this.puuid1,
          index: 1,
        },
        {
          uuid: this.puuid2,
          index: 2,
        },
        {
          uuid: this.puuid3,
          index: 3,
        },
        {
          uuid: this.puuid4,
          index: 4,
        },
      ];

      //判断UUID是否重复
      let list = JSON.parse(JSON.stringify(this.positionUUIDDatas.uuidList));
      for (let i = this.positionUUIDDatas.uuidList.length - 1; i >= 0; i--) {
        if (
          this.positionUUIDDatas.uuidList[i].uuid == "" ||
          this.positionUUIDDatas.uuidList[i].uuid == null ||
          this.positionUUIDDatas.uuidList[i].uuid ==
            "00000000000000000000000000000000" ||
          this.positionUUIDDatas.uuidList[i].uuid ==
            "ffffffffffffffffffffffffffffffff" ||
          this.positionUUIDDatas.uuidList[i].uuid ==
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        ) {
          this.positionUUIDDatas.uuidList.splice(i, 1);
        }
      }
      const uuids = this.positionUUIDDatas.uuidList.map((value) => value.uuid);
      const uuidsSet = new Set(uuids);
      if (uuidsSet.size != uuids.length) {
        that.$message({
          message: this.$t("terminal.tet22"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].uuid == "") {
          list[i].uuid = "00000000000000000000000000000000";
        }
      }
      this.positionUUIDDatas.uuidList = list;
      this.positionUUIDDatas.uuidList = JSON.stringify(
        this.positionUUIDDatas.uuidList
      );

      updateDevBeaconUUID(
        this.positionUUIDDatas,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.trancheList.$t("terminal.configsuccess"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //批量配置资产UUID
    extendAssetTurs() {
      var that = this;
      this.assetUUIDDatas.uuidList = [
        {
          uuid: this.auuid0,
          index: 0,
        },
        {
          uuid: this.auuid1,
          index: 1,
        },
        {
          uuid: this.auuid2,
          index: 2,
        },
        {
          uuid: this.auuid3,
          index: 3,
        },
        {
          uuid: this.auuid4,
          index: 4,
        },
      ];
      //判断UUID是否重复
      let list = JSON.parse(JSON.stringify(this.assetUUIDDatas.uuidList));
      for (let i = this.assetUUIDDatas.uuidList.length - 1; i >= 0; i--) {
        if (
          this.assetUUIDDatas.uuidList[i].uuid == "" ||
          this.assetUUIDDatas.uuidList[i].uuid == null ||
          this.assetUUIDDatas.uuidList[i].uuid ==
            "00000000000000000000000000000000" ||
          this.assetUUIDDatas.uuidList[i].uuid ==
            "ffffffffffffffffffffffffffffffff" ||
          this.assetUUIDDatas.uuidList[i].uuid ==
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        ) {
          this.assetUUIDDatas.uuidList.splice(i, 1);
        }
      }
      const uuids = this.assetUUIDDatas.uuidList.map((value) => value.uuid);
      const uuidsSet = new Set(uuids);
      if (uuidsSet.size != uuids.length) {
        that.$message({
          message: this.$t("terminal.tet22"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].uuid == "") {
          list[i].uuid = "00000000000000000000000000000000";
        }
      }
      this.assetUUIDDatas.uuidList = list;
      this.assetUUIDDatas.uuidList = JSON.stringify(
        this.assetUUIDDatas.uuidList
      );
      updateDevBeaconUUID(
        this.assetUUIDDatas,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("terminal.configsuccess"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //批量配置透传数据
    extendFilterTurs(beaconFilterDatas) {
      var that = this;
      this.$refs[beaconFilterDatas].validate((valid) => {
        if (valid) {
          if (
            that.beaconFilterDatas.filter.length < 8 ||
            that.beaconFilterDatas.filter.length > 32
          ) {
            that.$message({
              message: this.$t("terminal.tet23"),
              type: "warning",
            });
            return;
          }
          if (that.beaconFilterDatas.filter.length % 2 != 0) {
            that.$message({
              message: this.$t("terminal.tet24"),
              type: "warning",
            });
            return;
          }
          if (
            that.beaconFilterDatas.end * 1 > that.beaconFilterDatas.start * 1 ||
            (that.beaconFilterDatas.end == "0" &&
              that.beaconFilterDatas.start == "0")
          ) {
            that.beaconFilterDatas.filterLen =
              that.beaconFilterDatas.filter.length / 2;
          } else {
            that.$message({
              message: this.$t("terminal.tet25"),
              type: "warning",
            });
            return;
          }
          updateDevBeaconFilter(
            that.beaconFilterDatas,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("terminal.configsuccess"),
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
    //批量透传取消
    extendCancels(beaconFilterDatas) {
      this.extendTers = false;
      this.loading = false;
      this.$refs[beaconFilterDatas].resetFields();
    },

    // 批量可重传信标列表
    retransmissionTurs() {
      var that = this;
      let arr = Object.values(this.retransmissionBeaconLists);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "00000000") {
          that.$message({
            message: this.$t("terminal.tet26"),
            type: "warning",
          });
          return;
        }
        if (arr[i] == "" || arr[i] == null || typeof arr[i] == undefined) {
          arr.splice(i, 1);
          i = i - 1;
        }
      }
      if (new Set(arr).size !== arr.length) {
        this.$message({
          message: this.$t("terminal.tet27"),
          type: "warning",
        });
        return;
      }
      let retransmissionBeacon = "";
      for (let i = 0; i < arr.length; i++) {
        retransmissionBeacon += arr[i] + ",";
      }
      // 去掉最后一个逗号
      retransmissionBeacon = retransmissionBeacon.slice(
        0,
        retransmissionBeacon.length - 1
      );
      let data = {
        deveuis: this.retransmissionBeaconDeveuis,
        fport: 17,
        beaconList: retransmissionBeacon,
      };
      updateHistoryBleConfig(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("terminal.tet28"),
            type: "success",
          });
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    //分配
    assignTer(index) {
      var that = this;
      if (this.tableData[index].inallot == 1) {
        this.$message({
          message: this.$t("terminal.tet30"),
          type: "warning",
        });
        return;
      }
      let data = { superid: that.tenantid_A };

      getProjectListByTenantid(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        that.projectList = res.data.list;
      });
      this.assignData.deveuis = this.tableData[index].deveui;
      this.assignData.projectid = this.tableData[index].projectid;
      this.assignData.joinmode = this.tableData[index].joinmode;
      this.assignData.scheme = this.tableData[index].scheme;
      this.assign = true;
    },

    assignTrue(assignData) {
      var that = this;
      this.$refs[assignData].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateDevListByDeveuis(
            this.assignData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              this.assign = false;
              that.getDevLists();
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
        } else {
          return false;
        }
      });
    },

    // 批量分配
    assignTers(index) {
      var that = this;
      this.assignDatas.deveuis = "";
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.tet31"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inallot == 1) {
          this.$message({
            message: this.$t("terminal.tet32"),
            type: "warning",
          });
          return;
        }
        if (
          this.multipleSelection[0].joinmode !=
          this.multipleSelection[i].joinmode
        ) {
          this.$message({
            message: this.$t("terminal.tet33"),
            type: "warning",
          });
          return;
        }

        that.assignDatas.deveuis += that.multipleSelection[i].deveui + ",";
      }
      // 去掉最后一个逗号
      that.assignDatas.deveuis = that.assignDatas.deveuis.slice(
        0,
        that.assignDatas.deveuis.length - 1
      );
      that.assignDatas.joinmode = that.multipleSelection[0].joinmode;
      that.assignDatas.scheme = that.multipleSelection[0].scheme;
      let data = {
        superid: that.tenantid_A,
      };

      getProjectListByTenantid(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        that.projectList = res.data.list;
      });
      this.assigns = true;
    },

    assignsTrue(assignDatas) {
      var that = this;
      this.$refs[assignDatas].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateDevListByDeveuis(
            this.assignDatas,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              this.assigns = false;
              that.getDevLists();
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
        } else {
          return false;
        }
      });
    },

    //解除分配
    removeTerminal(index) {
      var that = this;
      if (this.tableData[index].inallot == 2) {
        this.$message({
          message: this.$t("terminal.tet34"),
          type: "warning",
        });
        return;
      }

      this.$confirm(
        this.$t("terminal.tet35") +
          this.tableData[index].deveui +
          this.$t("terminal.tet36"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          deveuis: that.tableData[index].deveui,
        };
        updateDevListRemoveProject(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            this.removeTer = false;
            that.getDevLists();
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
      });
    },

    //批量解除分配
    removeTers(index) {
      var that = this;
      this.removeTerDatas.deveuis = "";
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.tet37"),
          type: "warning",
        });
        return;
      }

      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inallot == 2) {
          this.$message({
            message: this.$t("terminal.tet38"),
            type: "warning",
          });
          return;
        }
        that.removeTerDatas.deveuis += that.multipleSelection[i].deveui + ",";
      }
      // 去掉最后一个逗号
      that.removeTerDatas.deveuis = that.removeTerDatas.deveuis.slice(
        0,
        that.removeTerDatas.deveuis.length - 1
      );

      this.removeDatas = this.multipleSelection;
      this.removeTer = true;
    },

    removeTrue() {
      var that = this;
      this.loading = true;
      updateDevListRemoveProject(
        this.removeTerDatas,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.removeTer = false;
          that.getDevLists();
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
    // 定位
    goLocation(index) {
      var that = this;
      if (this.tableData[index].inuse == 2) {
        that.$message({
          message: this.$t("terminal.tet39"),
          type: "success",
        });
        return;
      }
      if (this.tableData[index].devtype == 3) {
        let data = {
          deveui: that.tableData[index].deveui,
          projectid: that.tableData[index].projectid,
          devtype: 4,
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
                message: this.$t("LocationIndoor.tet3"),
                type: "warning",
              });
              return;
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
        });
      } else if (this.tableData[index].devtype == 1) {
        let data = {
          deveui: that.tableData[index].deveui,
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
                message: this.$t("LocationIndoor.tet3"),
                type: "warning",
              });
              return;
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
    //下行数据操作
    sendDownLink(val, index) {
      if (this.tableData[index].custom == 2) {
        this.$message({
          message: this.$t("terminal.tet3"),
          type: "warning",
        });
        return;
      }
      var that = this;
      let tips = "";
      switch (val) {
        case 0:
          tips = this.$t("terminal.requestposition");
          break;
        case 1:
          tips = this.$t("terminal.reboot");
          break;
        case 2:
          tips = this.$t("terminal.shutdown");
          break;
        case 3:
          tips = this.$t("terminal.Remotesearch");
          break;
        case 4:
          tips = this.$t("terminal.Cancelsearch");
          break;
        case 5:
          tips = this.$t("terminal.positionuuid");
          break;
        case 6:
          tips = this.$t("terminal.assetsuuid");
          break;
        case 7:
          tips = this.$t("terminal.assetsuuid1");
          break;
        case 8:
          tips = this.$t("terminal.Confirmationbeacon");
          break;
        default:
          break;
      }
      this.$confirm(
        this.$t("terminal.tet40") + tips + this.$t("terminal.tet41"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              let data = {
                euilist: this.tableData[index].deveui,
                command: val,
              };
              sendDownLinkMsg(
                data,
                this.tenantkey_A,
                this.tenantid_A,
                this.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.$message({
                    message: that.$t("terminal.tet28"),
                    type: "success",
                  });
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                }
              });
            }
          },
        }
      );
    },

    //批量执行下行数据操作
    sendDownLinks(index) {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("terminal.Pleasecheck"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].custom == 2) {
          that.$message({
            message: this.$t("terminal.tet3"),
            type: "warning",
          });
          return;
        }
      }
      let tips = "";
      switch (index) {
        case 0:
          tips = this.$t("terminal.requestposition");
          break;
        case 1:
          tips = this.$t("terminal.reboot");
          break;
        case 2:
          tips = this.$t("terminal.shutdown");
          break;
        case 3:
          tips = this.$t("terminal.Remotesearch");
          break;
        case 4:
          tips = this.$t("terminal.Cancelsearch");
          break;
        case 5:
          tips = this.$t("terminal.positionuuid");
          break;
        case 6:
          tips = this.$t("terminal.assetsuuid");
          break;
        case 7:
          tips = this.$t("terminal.assetsuuid1");
          break;
        case 8:
          tips = this.$t("terminal.Confirmationbeacon");
          break;
        default:
          break;
      }
      this.$confirm(
        this.$t("terminal.tet40") + tips + this.$t("terminal.tet41"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
          callback: (action) => {
            if (action === "confirm") {
              let euilist = "";
              for (let i = 0; i < this.multipleSelection.length; i++) {
                euilist += this.multipleSelection[i].deveui + ",";
              }
              euilist = euilist.slice(0, euilist.length - 1);
              let data = {
                euilist: euilist,
                command: index,
              };
              sendDownLinkMsg(
                data,
                this.tenantkey_A,
                this.tenantid_A,
                this.userName
              ).then((res) => {
                if (res.code == 1001) {
                  that.$message({
                    message: that.$t("terminal.tet28"),
                    type: "success",
                  });
                } else {
                  that.$message({
                    message:
                      that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                    type: "error",
                  });
                }
              });
            }
          },
        }
      );
    },

    //获取所有的Tenantid以及国家下拉框
    getCustomerNames() {
      var that = this;
      if (that.contrForPrionum == 1 || that.contrForPrionum == 2) {
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

          //国家下拉搜索框
          var countryData = res.data;
          var countryHash = {};
          this.searchSelectCountry = countryData.reduce((preVal, curVal) => {
            countryHash[curVal.country]
              ? ""
              : (countryHash[curVal.country] = true && preVal.push(curVal));
            return preVal;
          }, []);
        });
      }
    },

    //获取项目搜索下拉框
    getProjectLists(tenantid) {
      let data = {
        superid: this.tenantid_A,
      };
      getProjectListByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.searchProjectList = res.data.list;
      });
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
  },
  beforeMount() {
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2
    ) {
      this.searchList = {
        joinmode: "",
        deveui: "",
        scheme: "",
        country: "",
        tenantid: "",
        alias: "",
        postype: "",
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        projectid: "",
        workstate: "",
        inuse: "",
        hbstatus: "",
        inallot: "",
        devtype: "",
        beginbat: "",
        endbat: "",
        custom: "",
        type: "",
      };
    }
    if (this.$store.state.userInfo.prionum == 5) {
      this.searchList = {
        joinmode: "",
        deveui: "",
        scheme: "",
        country: "",
        tenantid: this.$store.state.intoProjectSuperid,
        alias: "",
        postype: "",
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        projectid: this.$store.state.projectid,
        workstate: "",
        inuse: "",
        hbstatus: "",
        inallot: "",
        devtype: "",
        beginbat: "",
        endbat: "",
        custom: "",
        type: "",
      };
    }
    if (
      this.$store.state.userInfo.prionum == 4 ||
      this.$store.state.userInfo.prionum == 3
    ) {
      this.searchList = {
        joinmode: "",
        deveui: "",
        scheme: "",
        country: "",
        tenantid: this.$store.state.userInfo.tenantid,
        alias: "",
        postype: "",
        memo: "",
        sysmemo: "",
        likememo: "",
        likesysmemo: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        workstate: "",
        inuse: "",
        hbstatus: "",
        inallot: "",
        devtype: "",
        beginbat: "",
        endbat: "",
        custom: "",
        type: "",
      };
      this.getProjectLists();
    }
    if (this.$route.query.deveui) {
      this.searchList.deveui = this.$route.query.deveui;
    } else if (this.$route.query.workstate) {
      this.searchList.workstate = Number(this.$route.query.workstate);
    } else if (this.$route.query.hbstatus) {
      this.searchList.hbstatus = Number(this.$route.query.hbstatus);
    } else if (this.$route.query.inuse) {
      this.searchList.inuse = Number(this.$route.query.inuse);
    } else if (this.$route.query.inallot) {
      this.searchList.inallot = Number(this.$route.query.inallot);
    } else if (this.$route.query.custom) {
      this.searchList.custom = Number(this.$route.query.custom);
    } else if (this.$route.query.devtype) {
      this.searchList.devtype = Number(this.$route.query.devtype);
      if (this.$route.query.type) {
        this.searchList.type = Number(this.$route.query.type);
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
    } else if (this.$route.query.endbat && this.$route.query.beginbat) {
      this.endbat = Number(this.$route.query.endbat);
      this.beginbat = Number(this.$route.query.beginbat);
      this.searchList.beginbat = this.beginbat;
      this.searchList.endbat = this.endbat;
    } else if (this.$route.query.endbat && !this.$route.query.beginbat) {
      this.endbat = Number(this.$route.query.endbat);
      this.searchList.endbat = this.endbat;
    } else if (!this.$route.query.endbat && this.$route.query.beginbat) {
      this.beginbat = Number(this.$route.query.beginbat);
      this.searchList.beginbat = this.beginbat;
    }

    this.getDevLists();
    this.getCustomerNames();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.searchInallotList,
        this.$options.data.call(this).searchInallotList
      );
      Object.assign(
        this.$data.retransmissionRules,
        this.$options.data.call(this).retransmissionRules
      );

      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
      );
      Object.assign(
        this.$data.editRules,
        this.$options.data.call(this).editRules
      );
      Object.assign(this.$data.batList, this.$options.data.call(this).batList);
      Object.assign(
        this.$data.headerList,
        this.$options.data.call(this).headerList
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
        this.$data.postypeList,
        this.$options.data.call(this).postypeList
      );
      Object.assign(
        this.$data.workstateList,
        this.$options.data.call(this).workstateList
      );
      Object.assign(
        this.$data.searchBatteryList,
        this.$options.data.call(this).searchBatteryList
      );
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
.ter_input {
  z-index: 1;
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
.el-table >>> .el-table__row .operation .cell {
  white-space: nowrap;
  overflow: inherit;
  text-overflow: clip;
  padding: 0;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}

.query,
.reset,
.export,
.addTer,
.editTers,
.configTers,
.delTers,
.dels1 {
  padding: 8px 12px !important;
  margin-left: 10px !important;
}
.exportContent {
  margin-bottom: 10px;
}
.selects button {
  width: 100%;
  text-align: left;
}
/* 按钮变化 */
.delTers:hover,
.configTers:hover,
.editTers:hover,
.edits:hover,
.dels:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.dels1:hover {
  background-color: rgb(196, 27, 27);
  color: white;
}
.dels11:hover {
  background-color: rgb(196, 27, 27);
  color: white;
}

.demo-form-inline >>> .el-form-item .el-form-item__label {
  padding: 0;
  line-height: 34px !important;
}

.demo-form-inline >>> .el-form-item .el-form-item__content {
  line-height: 34px !important;
}
.demo-form-inline >>> .el-form-item .el-input__inner {
  height: 34px !important;
  line-height: 34px !important;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px !important;
  line-height: 34px !important;
}
.demo-form-inline >>> .el-form-item .el-range-separator {
  height: 34px !important;
  line-height: 34px !important;
}

.configBeacon {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.configBeacon1 {
  display: flex;
  justify-content: space-around;
  width: 90%;
  padding-right: 20px;
}
.chose >>> button {
  padding: 0;
  line-height: 34px !important;
  border: 0;
}

.memo >>> .el-input {
  width: 80%;
}

.el-popover {
  min-width: 110px !important;
}

.exportForm >>> .el-select {
  display: block !important;
}
#articleImageFile {
  display: none;
}
.el-button {
  margin-left: 0px !important;
}

.el-table .current-row td  {
  background-color: skyblue !important;
}

.el-table--border th.gutter:last-of-type {
  display: block !important;
}
.el-table >>> th {
  display: table-cell !important;
}
.icon_button {
  padding: 2px 16px !important;
}
</style>