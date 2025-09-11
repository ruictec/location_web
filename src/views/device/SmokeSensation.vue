<template>
  <div style="height: 100%">
    <div class="content">
      <el-container>
        <el-main>
          <div class="aoa_input">
            <!-- 第一行 -->
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="
                display: flex;
                white-space: nowrap;
                margin-left: 0;
                z-index: 1;
              "
            >
              <el-form-item
                :label="$t('terminal.deveui')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 0;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.deveui"
                  :placeholder="$t('beacon.please')"
                ></el-input>
              </el-form-item>

              <el-form-item
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
                  :placeholder="$t('beacon.please')"
                ></el-input>
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

              <!-- 隐藏显示所有按钮 -->
              <el-form-item
                style="display: flex; margin-left: 2%"
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
                  class="addBeacon"
                  @click="addAoas()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                  >{{ $t("index.add") }}</el-button
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
                      ><el-button
                        class="delBeacons"
                        @click="assignAoas()"
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
                        @click="removeAoas()"
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
                        @click="deleteAoas()"
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
                :label="$t('beacon.project1')"
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
                  @change="selectProject"
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
                :label="$t('floormanagement.floor1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="(contrForPrionum == 3 || contrForPrionum == 4) && show"
              >
                <el-select
                  v-model="searchList.groundid"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in groundList"
                    :key="item.id"
                    :label="item.labelname"
                    :value="item.id"
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
                :label="$t('terminal.inuse')"
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
                :label="$t('terminal.workstate')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="
                  (contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 5) &&
                  show
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
                :label="$t('gateway.memo')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                  z-index: 1;
                "
                v-if="contrForPrionum == 5 && show"
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.memo"
                  :placeholder="$t('beacon.please')"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-show="contrForPrionum == 5 && seen1"
                style="
                  display: flex;
                  margin-left: 1%;
                  margin-right: 0;
                  z-index: 1;
                "
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

            <!-- 第二行 -->
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="display: flex; white-space: nowrap; margin-left: 0"
              v-if="
                contrForPrionum == 1 ||
                contrForPrionum == 2 ||
                contrForPrionum == 3 ||
                contrForPrionum == 4
              "
            >
              <el-form-item
                :label="$t('terminal.workstate')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 0;
                  margin-right: 0;
                "
                v-if="(contrForPrionum == 3 || contrForPrionum == 4) && show"
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
                :label="$t('gateway.memo')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
                v-if="show"
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.memo"
                  :placeholder="$t('beacon.please')"
                ></el-input>
              </el-form-item>

              <el-form-item
                v-show="seen1"
                style="display: flex; margin-left: 1%; margin-right: 0"
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
                <el-button
                  type="primary"
                  class="addBeacon"
                  @click="addAoas()"
                  v-if="
                    contrForPrionum == 1 ||
                    contrForPrionum == 2 ||
                    contrForPrionum == 3 ||
                    contrForPrionum == 4
                  "
                  >{{ $t("floormanagement.Add") }}</el-button
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
                      ><el-button
                        class="delBeacons"
                        @click="assignAoas()"
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
                        @click="removeAoas()"
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
                        @click="deleteAoas()"
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
            </el-form>
          </div>

          <!-- 烟感展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              style="width: 98%; text-align: center; margin-left: 0; z-index: 1"
              max-height="670"
              border
              highlight-current-row
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
                property="deveui"
                :label="$t('terminal.DeviceID')"
                show-overflow-tooltip
                min-width="97"
                align="center"
              ></el-table-column>
              <el-table-column
                property="alias"
                :label="$t('terminal.alias1')"
                show-overflow-tooltip
                min-width="97"
                align="center"
              ></el-table-column>
              <el-table-column
                property="projectname"
                :label="$t('terminal.project')"
                show-overflow-tooltip
                min-width="97"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>

              <el-table-column
                v-if="contrForPrionum != 5"
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
                :label="$t('terminal.inallotstr')"
                show-overflow-tooltip
                min-width="82"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="inusestr"
                :label="$t('beacon.inusestr')"
                show-overflow-tooltip
                min-width="60"
                align="center"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'workstatestr' : 'enworkstate'"
                :label="$t('beacon.workstatestr')"
                show-overflow-tooltip
                min-width="78"
                align="center"
              ></el-table-column>
              <el-table-column
                property="groundid"
                :label="$t('floormanagement.floornumber')"
                show-overflow-tooltip
                min-width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                property="mode"
                :label="$t('terminal.mode')"
                show-overflow-tooltip
                min-width="78"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="scheme"
                :label="$t('terminal.Standard')"
                show-overflow-tooltip
                min-width="78"
                align="center"
                v-if="contrForPrionum != 5"
              ></el-table-column>
              <el-table-column
                property="regtime"
                :label="$t('gateway.firsttime')"
                show-overflow-tooltip
                :formatter="formatDateDregtime"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                property="dectime"
                :label="$t('otherDev.updateTime')"
                show-overflow-tooltip
                :formatter="formatDateDevtime"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('beacon.memo')"
                show-overflow-tooltip
                min-width="97"
                align="center"
              ></el-table-column>

              <el-table-column
                fixed="right"
                :label="$t('beacon.control')"
                align="center"
                min-width="80"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4
                "
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
                        ><el-button
                          size="mini"
                          class="edits"
                          @click="editAoa(scope.$index, tableData)"
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
                          @click="assignAoa(scope.$index, tableData)"
                          v-if="contrForPrionum == 3 || contrForPrionum == 4"
                          >{{ $t("beacon.assign") }}</el-button
                        ></el-dropdown-item
                      ><el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                      >
                        <el-button
                          size="mini"
                          class="edits"
                          @click="recycleAoa(scope.$index, tableData)"
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
                          @click="delAoa(scope.$index)"
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

          <!-- 添加 -->
          <el-dialog
            :title="$t('otherDev.addinfoSmoke')"
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
                :label="$t('terminal.deveui')"
                style="margin-right: 2%"
                prop="deveui"
              >
                <el-input v-model="addData.deveui"> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.alias')"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.alias"
                  show-word-limit
                  maxlength="20"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.company')"
                style="margin-right: 2%"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
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
              <el-form-item
                label="origappeui："
                style="margin-right: 2%"
                prop="origappeui"
              >
                <el-input v-model="addData.origappeui" maxlength="32">
                </el-input>
              </el-form-item>
              <el-form-item
                label="origappkey："
                style="margin-right: 2%"
                prop="origappkey"
              >
                <el-input v-model="addData.origappkey" maxlength="32">
                </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.memo1')"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.memo"
                  type="textarea"
                  show-word-limit
                  maxlength="225"
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

          <!-- 编辑 -->
          <el-dialog
            :title="$t('otherDev.editinfoSmoke')"
            width="30%"
            class="edit"
            :visible.sync="edit"
            style="text-aling: center"
            @close="editCancle('editData')"
          >
            <el-form
              :model="editData"
              label-width="130px"
              ref="editData"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('terminal.deveui')"
                style="margin-right: 2%"
              >
                <el-input v-model="editData.deveui" disabled> </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('terminal.alias')"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="editData.alias"
                  maxlength="20"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('beacon.company')"
                style="margin-right: 2%"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
                  v-model="editData.tenantid"
                  :placeholder="$t('terminal.choose')"
                  disabled
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
                :label="$t('beacon.memo1')"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="editData.memo"
                  type="textarea"
                  maxlength="225"
                  show-word-limit
                >
                </el-input>
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

          <!-- 批量删除 -->
          <el-dialog :title="$t('terminal.deletemsgs')" :visible.sync="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="customername"
                :label="$t('beacon.customername')"
                show-overflow-tooltip
                v-if="contrForPrionum == '1' || contrForPrionum == '2'"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('terminal.DeviceID')"
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
                property="projectname"
                :label="$t('terminal.project')"
                show-overflow-tooltip
                min-width="78"
              ></el-table-column>
              <el-table-column
                property="inallotstr"
                :label="$t('terminal.inallotstr')"
                show-overflow-tooltip
                min-width="78"
              ></el-table-column>
              <el-table-column
                property="inusestr"
                :label="$t('beacon.inusestr')"
                show-overflow-tooltip
                min-width="78"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'workstatestr' : 'enworkstate'"
                :label="$t('beacon.workstatestr')"
                show-overflow-tooltip
                min-width="78"
              ></el-table-column>
              <el-table-column
                property="groundid"
                :label="$t('floormanagement.floornumber')"
                show-overflow-tooltip
                min-width="78"
              ></el-table-column>
              <el-table-column
                property="regtime"
                :label="$t('gateway.firsttime')"
                show-overflow-tooltip
                :formatter="formatDateDregtime"
                min-width="90"
              ></el-table-column>
              <el-table-column
                property="dectime"
                :label="$t('otherDev.updateTime')"
                show-overflow-tooltip
                :formatter="formatDateDevtime"
                min-width="90"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('beacon.memo')"
                show-overflow-tooltip
                min-width="78"
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

          <!-- 分配aoa -->
          <el-dialog
            :title="$t('otherDev.assigninfoSmoke')"
            :visible.sync="assign"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="assignCancle('assignData')"
          >
            <el-form
              :model="assignData"
              label-width="100px"
              ref="assignData"
              style="text-align: left"
              :rules="assignRules"
            >
              <el-form-item :label="$t('terminal.deveui')" prop="">
                <el-input v-model="assignData.deveuis" disabled> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.projectname1')" prop="projectid">
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
              <el-button @click="assignCancle('assignData')">{{
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

          <!-- 批量分配AOA -->
          <el-dialog
            :title="$t('otherDev.assigninfosSmoke')"
            :visible.sync="assigns"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="assignsCancle('assignDatas')"
          >
            <el-form
              :model="assignDatas"
              label-width="100px"
              ref="assignDatas"
              style="text-align: left"
              :rules="assignRules"
            >
              <el-form-item :label="$t('terminal.deveui')" prop="">
                <el-input v-model="assignDatas.deveuis" disabled> </el-input>
              </el-form-item>
              <el-form-item :label="$t('beacon.projectname1')" prop="projectid">
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
              <el-button @click="assignsCancle('assignDatas')">{{
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

          <!-- 批量解除分配AOA -->
          <el-dialog
            :title="$t('beacon.deletemsgs1')"
            :visible.sync="removeAoa"
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
                :label="$t('terminal.deveui')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="projectname"
                :label="$t('beacon.projectname')"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(removeAoa = false), (loading = false)">{{
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
  getProjectListByTenantid,
  getCustomerName,
  addDevOther,
  getDevOtherList,
  delDevOtherByDeveuis,
  updateDevOther,
  updateDevOtherByDeveuis,
  updateDevOtherRemoveProject,
  getBuildGroundList,
} from "../../axios/api";

export default {
  components: {
    Menu,
    Devicemanagement,
    basecard,
  },
  data() {
    return {
      i8n: this.$store.state.i18n,
      show: false,
      seen: true,
      seen1: false,
      intoProjectType: this.$store.state.intoProjectType,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      searchList: {
        devtype: 2,
        deveui: "",
        alias: "",
        tenantid: "",
        projectid: "",
        groundid: "",
        inallot: "",
        inuse: "",
        workstate: "",
        page: "",
        count: this.pageCount,
        memo: "",
      },
      pageCount: 20,
      currentPage1: 1,
      total: 0,
      groundList: [],
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
      // 使用状态下拉框
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
      // 工作状态下拉框
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

      tableData: [],
      deleteData: [],
      del: false,
      multipleSelection: [],
      loading: false,
      add: false,
      addData: {
        custom:
          this.contrForPrionum == 1 || this.contrForPrionum == 2 ? "1" : "2",
        devtype: 2,
        deveui: "",
        alias: "",
        tenantid: "",
        memo: "",
        mode: "ABP",
        scheme: "CN470",
        origappeui: "",
        origappkey: "",
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
        tenantid: [
          {
            required: true,
            message: this.$t("beacon.tenantidrules"),
            trigger: "change",
          },
        ],
        origappeui: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9]{32}$/,
            message: this.$t("otherDev.mes11"),
            trigger: "blur",
          },
        ],
        origappkey: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9]{32}$/,
            message: this.$t("otherDev.mes11"),
            trigger: "blur",
          },
        ],
      },
      edit: false,
      editData: {
        devtype: 2,
        deveui: "",
        alias: "",
        tenantid: "",
        projectid: "",
        groundid: "",
        inallot: "",
        inuse: "",
        workstate: "",
        memo: "",
      },

      tenantidData: [], //公司列表
      projectList: [], //项目列表
      assign: false,
      assignData: {
        deveuis: "",
        projectid: "",
        devtype: 2,
        mode: "ABP",
      },
      assignRules: {
        projectid: [
          {
            required: true,
            message: this.$t("otherDev.mes10"),
            trigger: "change",
          },
        ],
      },
      assignDatas: {
        deveuis: "",
        projectid: "",
        devtype: 2,
        mode: "ABP",
      },
      assigns: false,
      removeAoaDatas: {
        deveuis: "",
        devtype: 2,
        projectid: "",
      },
      removeDatas: [],
      removeAoa: false,
    };
  },
  methods: {
    search() {
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          devtype: 2,
          deveui: "",
          alias: "",
          tenantid: "",
          projectid: "",
          groundid: "",
          inallot: "",
          inuse: "",
          workstate: "",
          page: 1,
          count: this.pageCount,
          memo: "",
        };
        this.getCustomerNames();
      }
      if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4
      ) {
        this.searchList = {
          devtype: 2,
          deveui: "",
          alias: "",
          tenantid: this.$store.state.userInfo.tenantid,
          projectid: "",
          groundid: "",
          inallot: "",
          inuse: "",
          workstate: "",
          page: 1,
          count: this.pageCount,
          memo: "",
        };
        this.getProjectListByTenantids();
      }
      if (this.$store.state.userInfo.prionum == 5) {
        this.searchList = {
          devtype: 2,
          deveui: "",
          alias: "",
          tenantid: this.$store.state.intoProjectSuperid,
          projectid: this.$store.state.projectid,
          groundid: "",
          inallot: "",
          inuse: "",
          workstate: "",
          page: 1,
          count: this.pageCount,
          memo: "",
        };
      }
      this.getDevAoaLists();
    },
    // 刷新
    clearBtn() {
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          devtype: 2,
          deveui: "",
          alias: "",
          tenantid: "",
          projectid: "",
          groundid: "",
          inallot: "",
          inuse: "",
          workstate: "",
          page: 1,
          count: this.pageCount,
          memo: "",
        };
      }
      if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4
      ) {
        this.searchList = {
          devtype: 2,
          deveui: "",
          alias: "",
          tenantid: this.$store.state.userInfo.tenantid,
          projectid: "",
          groundid: "",
          inallot: "",
          inuse: "",
          workstate: "",
          page: 1,
          count: this.pageCount,
          memo: "",
        };
      }
      if (this.$store.state.userInfo.prionum == 5) {
        this.searchList = {
          devtype: 2,
          deveui: "",
          alias: "",
          tenantid: this.$store.state.intoProjectSuperid,
          projectid: this.$store.state.projectid,
          groundid: "",
          inallot: "",
          inuse: "",
          workstate: "",
          page: 1,
          count: this.pageCount,
          memo: "",
        };
      }
      this.getDevAoaLists();
    },

    // 查询
    searchInfo() {
      var that = this;
      getDevOtherList(
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
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getDevAoaLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getDevAoaLists();
    },
    // 选则项目后
    selectProject(event) {
      this.groundList = [];
      this.getBuildingLists(event);
    },
    //获取建筑信息
    getBuildingLists(projectid) {
      var that = this;
      let data = {
        projectid: projectid,
      };
      getBuildGroundList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          var grounds = res.data.list;
          grounds.forEach((item, index) => {
            if (item.mapid !== "" && item.mapid !== null) {
              item.labelname =
                item.building + "/" + item.ground + that.$t("warning.floor");
              that.groundList.push(item);
            }
          });
        }
      });
    },
    // 解除分配
    recycleAoa(index) {
      var that = this;
      if (this.tableData[index].inallot == 2) {
        this.$message({
          message: that.$t("otherDev.SmokeMes1"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("beacon.tet13") +
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
          deveuis: that.tableData[index].deveui,
          projectid: that.tableData[index].projectid,
          devtype: 2,
        };
        updateDevOtherRemoveProject(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.getDevAoaLists();
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
    // 批量回收
    removeAoas() {
      var that = this;
      that.removeAoaDatas.deveuis = "";
      if (that.multipleSelection.length == 0) {
        that.$message({
          message: that.$t("otherDev.SmokeMes2"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inallot == 2) {
          this.$message({
            message: this.$t("otherDev.SmokeMes1"),
            type: "warning",
          });
          return;
        }
        if (
          this.multipleSelection.length > 1 &&
          i < this.multipleSelection.length - 1
        ) {
          if (
            this.multipleSelection[i].projectid !==
            this.multipleSelection[i + 1].projectid
          ) {
            this.$message({
              message: "请选择同一项目的资产网关！",
              type: "warning",
            });
            return;
          }
        }
        that.removeAoaDatas.deveuis += that.multipleSelection[i].deveui + ",";
      }

      that.removeAoaDatas.projectid = that.multipleSelection[0].projectid;
      that.removeAoaDatas.devtype = 2;
      // 去掉最后一个逗号
      that.removeAoaDatas.deveuis = that.removeAoaDatas.deveuis.slice(
        0,
        that.removeAoaDatas.deveuis.length - 1
      );

      this.removeDatas = this.multipleSelection;
      this.removeAoa = true;
    },
    removeTrue() {
      var that = this;
      this.loading = true;
      updateDevOtherRemoveProject(
        that.removeAoaDatas,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.removeAoa = false;
          that.getDevAoaLists();
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
    // 分配
    assignAoa(index) {
      if (this.tableData[index].inallot == 1) {
        this.$message({
          message: this.$t("otherDev.SmokeMes3"),
          type: "warning",
        });
        return;
      }
      this.assignData.deveuis = this.tableData[index].deveui;
      this.assignData.projectid = "";
      this.assign = true;
    },
    assignCancle(assignData) {
      this.assign = false;
      this.loading = false;
      this.$refs[assignData].resetFields();
    },
    assignTrue(assignData) {
      var that = this;
      this.$refs[assignData].validate((valid) => {
        if (valid) {
          that.loading = true;
          updateDevOtherByDeveuis(
            that.assignData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.assign = false;
              that.getDevAoaLists();
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
        }
      });
    },
    // 批量分配
    assignAoas() {
      var that = this;
      this.assignDatas.deveuis = "";
      this.assignDatas.projectid = "";
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("otherDev.SmokeMes4"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].inallot == 1) {
          this.$message({
            message: this.$t("otherDev.SmokeMes3"),
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
      this.assigns = true;
    },
    assignsCancle(assignDatas) {
      this.assigns = false;
      this.loading = false;
      this.$refs[assignDatas].resetFields();
    },
    assignsTrue(assignDatas) {
      var that = this;
      this.$refs[assignDatas].validate((valid) => {
        if (valid) {
          that.loading = true;
          updateDevOtherByDeveuis(
            that.assignDatas,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.getDevAoaLists();
              that.$message({
                message: that.$t("beacon.assinsuccess"),
                type: "success",
              });
              that.$refs[assignDatas].resetFields();
              that.loading = false;
              that.assigns = false;
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              that.loading = false;
            }
          });
        }
      });
    },
    // 添加
    addAoas() {
      this.add = true;
      this.addData = {
        custom:
          this.contrForPrionum == 1 || this.contrForPrionum == 2 ? "1" : "2",
        devtype: 2,
        deveui: "",
        alias: "",
        tenantid: "",
        memo: "",
        mode: "ABP",
        scheme: "CN470",
        origappeui: "",
        origappkey: "",
      };
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
          if (that.contrForPrionum != 1 && that.contrForPrionum != 2) {
            that.addData.tenantid = that.tenantid_A;
          }
          this.loading = true;
          addDevOther(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.loading = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.$refs[addData].resetFields();
              that.getDevAoaLists();
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
        }
      });
    },
    // 编辑
    editAoa(index) {
      this.editData.deveui = this.tableData[index].deveui;
      this.editData.alias = this.tableData[index].alias;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.projectid = this.tableData[index].projectid;
      this.editData.groundid = this.tableData[index].groundid;
      this.editData.inallot = this.tableData[index].inallot;
      this.editData.inuse = this.tableData[index].inuse;
      this.editData.workstate = this.tableData[index].workstate;
      this.editData.memo = this.tableData[index].memo;
      this.edit = true;
      if (this.editData.projectid) {
        this.getBuildingLists(this.editData.projectid);
      }
    },
    editCancle(editData) {
      this.edit = false;
      this.loading = false;
      this.$refs[editData].resetFields();
    },
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          updateDevOther(
            that.editData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.getDevAoaLists();
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
        }
      });
    },
    // 删除
    delAoa(index) {
      var that = this;
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
      if (this.tableData[index].inallot == 1) {
        this.$message({
          message: this.$t("otherDev.mes5"),
          type: "warning",
        });
        return;
      }
      if (this.tableData[index].inuse == 1) {
        this.$message({
          message: this.$t("otherDev.mes6"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("beacon.deletemsg1") +
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
          deveuis: [that.tableData[index].deveui],
        };
        delDevOtherByDeveuis(
          JSON.stringify(data),
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.getDevAoaLists();
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
        });
      });
    },

    // 批量删除
    deleteAoas() {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("otherDev.mes7"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          (that.contrForPrionum == 3 || that.contrForPrionum == 4) &&
          that.multipleSelection[i].custom == 1
        ) {
          that.$message({
            message: that.$t("terminal.tet44"),
            type: "warning",
          });
          return;
        }
        if (
          (that.contrForPrionum == 1 || that.contrForPrionum == 2) &&
          that.multipleSelection[i].custom == 2
        ) {
          that.$message({
            message: that.$t("terminal.tet3"),
            type: "warning",
          });
          return;
        }
        if (this.multipleSelection[i].inallot == 1) {
          that.$message({
            message: this.$t("otherDev.mes8"),
            type: "warning",
          });
          return;
        }
        if (this.multipleSelection[i].inuse == 1) {
          that.$message({
            message: this.$t("otherDev.mes9"),
            type: "warning",
          });
          return;
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
        deveuis: [],
      };
      for (var i = 0; i < this.deleteData.length; i++) {
        data.deveuis.push(this.deleteData[i].deveui);
      }
      this.loading = true;
      delDevOtherByDeveuis(
        JSON.stringify(data),
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.getDevAoaLists();
          that.$message({
            message: that.$t("beacon.deletesuccess"),
            type: "success",
          });
          this.del = false;
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
    formatDateDevtime(row, column) {
      if (row.devtime == null || row.devtime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.devtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    // 时间转换
    formatDateDregtime(row, column) {
      if (row.regtime == null || row.regtime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.regtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
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

    // 获取项目
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
    // 获取aoa信息
    getDevAoaLists() {
      var that = this;
      getDevOtherList(
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

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
        this.$data.inuseType,
        this.$options.data.call(this).inuseType
      );
      Object.assign(
        this.$data.workType,
        this.$options.data.call(this).workType
      );
      Object.assign(
        this.$data.assignRules,
        this.$options.data.call(this).assignRules
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
.el-main {
  width: 98%;
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
.el-form-item .el-button {
  margin-left: 4px !important;
}
.icon_button {
  padding: 2px 16px !important;
}
</style>