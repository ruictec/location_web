<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu v-if="contrForPrionum != 5" />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Asset /> </el-aside>
        <el-main>
          <el-tabs v-model="activeName" @tab-click="changeTab">
            <!-- 巡检任务 -->
            <el-tab-pane :label="$t('inspection.Inspectiontasks')" name="first">
              <div class="checkwork_input">
                <el-form
                  class="demo-form-inline"
                  style="display: flex; white-space: nowrap"
                  :model="searchList"
                >
                  <el-form-item
                    :label="$t('inspection.state')"
                    style="display: flex; margin-left: 2%; margin-right: 0"
                  >
                    <el-select
                      v-model="searchList.states"
                      :placeholder="$t('inspection.title')"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in statusList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('inspection.time')"
                    style="display: flex; margin-left: 2%; margin-right: 0"
                  >
                    <el-date-picker
                      v-model="tasktime"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      :range-separator="$t('checkwork.to')"
                      :start-placeholder="$t('checkwork.starttime')"
                      :end-placeholder="$t('checkwork.endtime')"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item style="margin-left: 1%">
                    <el-button
                      type="primary"
                      class="querry"
                      @click="searchInfo()"
                      >{{ $t("inspection.search") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="reset"
                      @click="clearBtn()"
                      >{{ $t("inspection.reset") }}</el-button
                    >

                    <el-button
                      type="primary"
                      class="reset"
                      @click="addInspection()"
                      >{{ $t("inspection.addtask") }}</el-button
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
                        <p>
                          {{ $t("inspection.tttt2") }}<br />
                          {{ $t("inspection.tttt3") }}<br />
                          {{ $t("inspection.tttt4") }}<br />
                          {{ $t("inspection.tttt5") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 展示 -->
              <div>
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  @current-change="handleCurrentChangeIns"
                  style="
                    width: 98%;
                    text-align: center;
                    margin-left: 2%;
                    z-index: 1;
                  "
                  border
                  highlight-current-row
                >
                  <!-- <el-table-column type="selection" width="55">
                  </el-table-column> -->
                  <el-table-column
                    property="name"
                    :label="$t('inspection.Inspectiontasks1')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="details"
                    :label="$t('inspection.route')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    :property="i8n == 'zh' ? 'repetitionstr' : 'enrepetition'"
                    :label="$t('inspection.Isitredundant')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="daily"
                    :label="$t('inspection.repeatdate')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>

                  <el-table-column
                    property="begindate"
                    :label="$t('inspection.startdate')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="enddate"
                    :label="$t('inspection.enddate')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="begintime"
                    :label="$t('inspection.Startingtime')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="endtime"
                    :label="$t('inspection.EndTime')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>

                  <el-table-column
                    :property="i8n == 'zh' ? 'statestr' : 'enstates'"
                    :label="$t('inspection.State')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="ctime"
                    :label="$t('inspection.creationtime')"
                    show-overflow-tooltip
                    :formatter="formatDatectime"
                    align="center"
                    width="200"
                  >
                  </el-table-column>
                  <el-table-column
                    property="memo"
                    :label="$t('inspection.Remark1')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    :label="$t('inspection.assignstaff')"
                    min-width="80"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        v-if="
                          scope.row.userids != '' && scope.row.userids != null
                        "
                        @click="showInspectionPer(scope.$index)"
                        type="text"
                        size="small"
                        style="width: 60%"
                        >{{ $t("inspection.Check") }}</el-button
                      >
                      <p
                        v-if="
                          scope.row.userids == '' || scope.row.userids == null
                        "
                      >
                        {{ $t("inspection.Unassigned") }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    :label="$t('inspection.Operate')"
                    min-width="250"
                    align="center"
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
                              @click="editTask(scope.$index, tableData)"
                              >{{ $t("inspection.edit") }}</el-button
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
                              @click="updateTask(scope.$index, tableData)"
                              >{{ $t("inspection.distribution") }}</el-button
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
                              class="dels"
                              @click="delTask(scope.$index, tableData)"
                              >{{ $t("inspection.delete") }}</el-button
                            ></el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>

                      <!-- 路线操作 -->
                      <el-dropdown size="mini" type="primary" trigger="click">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="$t('inspection.route')"
                          placement="top"
                        >
                          <el-button type="primary" class="icon_button">
                            <img src="../../../static/route.png" />
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
                              @click="setInspection(scope.$index, tableData)"
                              >{{ $t("inspection.setroute") }}</el-button
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
                              @click="openDetail(scope.$index)"
                              >{{ $t("inspection.route1") }}</el-button
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
                              @click="removeInspection(scope.$index)"
                              >{{ $t("inspection.RemoveRoute") }}</el-button
                            ></el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>

                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('inspection.start')"
                        placement="top"
                      >
                        <el-button
                          type="danger"
                          class="icon_button"
                          @click="onTask(scope.$index, 1)"
                          v-show="scope.row.states == 2"
                          :disabled="showButton(scope.row)"
                          ><img src="../../../static/start1.png"
                        /></el-button>
                      </el-tooltip>

                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('inspection.stop')"
                        placement="top"
                      >
                        <el-button
                          type="danger"
                          size="mini"
                          class="icon_button"
                          @click="onTask(scope.$index, 2)"
                          v-show="scope.row.states !== 2"
                          :disabled="showButton(scope.row)"
                          ><img src="../../../static/stop.png"
                        /></el-button>
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
                    :page-size="pageCount"
                  >
                  </el-pagination>
                </div>
              </div>
            </el-tab-pane>
            <!-- 巡检历史 -->
            <el-tab-pane
              :label="$t('inspection.Inspectionhistory')"
              name="second"
            >
              <div class="taskHis">
                <el-form
                  class="demo-form-inline"
                  style="display: flex; white-space: nowrap"
                  :model="searchListHis"
                >
                  <el-form-item
                    :label="$t('inspection.Name')"
                    style="
                      display: flex;
                      margin-left: 2%;
                      margin-right: 0;
                      width: 12%;
                    "
                  >
                    <el-select
                      v-model="searchListHis.userid"
                      filterable
                      :placeholder="$t('inspection.text')"
                    >
                      <el-option
                        v-for="item in nameList"
                        :key="item.id"
                        :label="item.username"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('inspection.Taskname')"
                    style="
                      display: flex;
                      margin-left: 2%;
                      margin-right: 0;
                      width: 12%;
                    "
                  >
                    <el-select
                      v-model="searchListHis.taskid"
                      filterable
                      :placeholder="$t('inspection.text')"
                    >
                      <el-option
                        v-for="item in taskList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('inspection.Taskstatus')"
                    style="
                      display: flex;
                      margin-left: 2%;
                      margin-right: 0;
                      width: 14%;
                    "
                  >
                    <el-select
                      v-model="searchListHis.taskstatus"
                      :placeholder="$t('inspection.text1')"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in statusHisList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('inspection.time')"
                    style="display: flex; margin-left: 2%; margin-right: 0"
                  >
                    <el-date-picker
                      v-model="searchListHis.taskdate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :placeholder="$t('inspection.Selectdate')"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item style="z-index: 1; margin-left: 1%">
                    <el-button
                      type="primary"
                      class="querry"
                      @click="searchInfoHis()"
                      >{{ $t("inspection.search") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="reset"
                      @click="clearBtnHis()"
                      >{{ $t("inspection.reset") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="reset"
                      @click="delTaskListHis()"
                      >{{ $t("inspection.batchdeletion") }}</el-button
                    >
                    <el-button
                      type="primary"
                      class="reset"
                      @click="taskListHisInfo()"
                      >{{ $t("inspection.Inspectiondetails") }}</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>

              <!-- 展示巡检历史 -->
              <div class="checkHistory">
                <el-table
                  ref="multipleTableHis"
                  :data="tableDataHis"
                  @selection-change="handleSelectionChangeHis"
                  @row-click="handleRowClick"
                  style="
                    width: 97%;
                    text-align: center;
                    margin-left: 2%;
                    z-index: 1;
                  "
                  border
                  highlight-current-row
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column
                    property="username"
                    :label="$t('inspection.name')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="name"
                    :label="$t('inspection.taskname')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="details"
                    :label="$t('inspection.MissionDetails')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="infodetails"
                    :label="$t('inspection.Inspectionrecord')"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot="header" slot-scope="scope">
                      <span class="cell" style="padding-right: 0">{{
                        $t("inspection.Inspectionrecord")
                      }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                        style="font-size: 130%"
                      >
                        <div slot="content">
                          <p>
                            {{ $t("inspection.tttt") }}
                          </p>
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="taskdate"
                    :label="$t('inspection.Inspectiondate')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="begintime"
                    :label="$t('inspection.Startingtime')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    property="endtime"
                    :label="$t('inspection.EndTime')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>

                  <el-table-column
                    property="missnum"
                    :label="$t('inspection.number')"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot="header" slot-scope="scope">
                      <span class="cell" style="padding-right: 0">{{
                        $t("inspection.number")
                      }}</span>
                      <el-tooltip
                        class="item"
                        effect="light"
                        placement="right-start"
                        style="font-size: 130%"
                      >
                        <div slot="content">
                          <p>
                            {{ $t("inspection.tttt1") }}
                          </p>
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="missdetails"
                    :label="$t('inspection.detail')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    :property="i8n == 'zh' ? 'taskstatustr' : 'entaskstatus'"
                    :label="$t('inspection.taskstatus')"
                    show-overflow-tooltip
                    align="center"
                    class-name="taskstatustr"
                  >
                    <template slot-scope="scope">
                      <p :class="tableCellClassName(scope.row)"></p>
                      <span>
                        {{
                          i8n == "zh"
                            ? scope.row.taskstatustr
                            : scope.row.entaskstatus
                        }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="memo"
                    :label="$t('inspection.Remark1')"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div
                  class="block"
                  style="text-align: center; width: 100%; margin-top: 1%"
                >
                  <el-pagination
                    @size-change="handleSizeChangeHis"
                    @current-change="handleCurrentChangeHis"
                    :current-page.sync="currentPage1"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :page-size="pageCountHis"
                  >
                  </el-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- 批量删除巡检历史 -->
          <el-dialog :title="$t('inspection.text2')" :visible.sync="delHis">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="username"
                :label="$t('inspection.name')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="name"
                :label="$t('inspection.taskname')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="details"
                :label="$t('inspection.MissionDetails')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="infodetails"
                :label="$t('inspection.Inspectionrecord')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="taskdate"
                :label="$t('inspection.Inspectiondate')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="begintime"
                :label="$t('inspection.Startingtime')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="endtime"
                :label="$t('inspection.EndTime')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="missnum"
                :label="$t('inspection.number')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'taskstatustr' : 'entaskstatus'"
                :label="$t('inspection.taskstatus')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="memo"
                :label="$t('inspection.Remark1')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(delHis = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="deleteTrueHis()"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 查看巡检历史里的巡检详情 -->
          <el-dialog
            :visible.sync="taskHisInfo"
            :fullscreen="true"
            width="100%"
            :close-on-press-escape="false"
            @close="closeTaskInfoHis"
            class="setInspection"
          >
            <el-form
              class="demo-form-inline"
              style="display: flex; white-space: nowrap; margin-left: 0"
            >
              <el-button
                type="primary"
                round
                @click="closeTaskInfoHisCancle()"
                style="width: 90px; height: 30px; text-align: left"
                size="mini"
                icon="el-icon-arrow-left"
                >{{ $t("login.return") }}</el-button
              >

              <el-form-item
                :label="$t('inspection.Building')"
                style="display: flex; margin-left: 2%; margin-right: 0"
              >
                <el-select
                  clearable
                  filterable
                  v-model="isactive"
                  @change="getGroundsHis(isactive)"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in buildingListHis"
                    :key="item.buildid"
                    :label="item.building"
                    :value="item.buildid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div v-show="mapTypes" class="mapConent">
              <div id="allmapHis" ref="map" class="allmap"></div>
              <div class="selectGround">
                <div
                  class="fm-control-groups"
                  style="
                    width: 42px;
                    background-color: white;
                    box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 3px;
                    border-radius: 2px;
                  "
                >
                  <div style="overflow: hidden" class="fm-layer-list">
                    <div
                      v-for="(item, index) in groundListHis"
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
                        v-show="
                          grounds.length > 1 && index !== grounds.length - 1
                        "
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
              <div class="groundControl">
                <el-button-group>
                  <el-button
                    type="primary"
                    icon="el-icon-arrow-left"
                    :disabled="lastBuilding"
                    @click="lastBuildings"
                    >{{ $t("inspection.previousbuilding") }}</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-arrow-left"
                    :disabled="lastGroup"
                    @click="lastGroups"
                    >{{ $t("inspection.previouslayer") }}</el-button
                  >
                  <el-button
                    type="primary"
                    :disabled="nextGroup"
                    @click="nextGroups"
                    >{{ $t("inspection.Nextlevel")
                    }}<i class="el-icon-arrow-right el-icon--right"></i
                  ></el-button>
                  <el-button
                    type="primary"
                    :disabled="nextBuilding"
                    @click="nextBuildings"
                    >{{ $t("inspection.nextbuilding")
                    }}<i class="el-icon-arrow-right el-icon--right"></i
                  ></el-button>
                </el-button-group>
              </div>
            </div>

            <div v-show="!mapTypes" class="mapConentD">
              <div id="fengMapHis">
                <div class="groundControl3D">
                  <el-button-group>
                    <el-button
                      type="primary"
                      icon="el-icon-arrow-left"
                      :disabled="lastBuilding"
                      @click="lastBuildings"
                      style="z-index: 1"
                      >{{ $t("inspection.previousbuilding") }}</el-button
                    >
                    <el-button
                      type="primary"
                      icon="el-icon-arrow-left"
                      :disabled="lastGroup3D"
                      @click="lastGroups3D"
                      style="z-index: 1"
                      >{{ $t("inspection.previouslayer") }}</el-button
                    >
                    <el-button
                      type="primary"
                      :disabled="nextGroup3D"
                      @click="nextGroups3D"
                      style="z-index: 1"
                      >{{ $t("inspection.Nextlevel")
                      }}<i class="el-icon-arrow-right el-icon--right"></i
                    ></el-button>
                    <el-button
                      type="primary"
                      :disabled="nextBuilding"
                      @click="nextBuildings"
                      style="z-index: 1"
                      >{{ $t("inspection.nextbuilding")
                      }}<i class="el-icon-arrow-right el-icon--right"></i
                    ></el-button>
                  </el-button-group>
                </div>
              </div>
            </div>
          </el-dialog>

          <!-- 设置巡检详情 -->
          <el-dialog
            :visible.sync="setInspectionMap"
            :fullscreen="true"
            width="100%"
            :close-on-press-escape="false"
            @close="closeInspection"
            class="setInspection"
          >
            <el-form
              class="demo-form-inline"
              style="display: flex; white-space: nowrap; margin-left: 0"
            >
              <el-button
                type="primary"
                round
                @click="inspectioncancel()"
                style="width: 90px; height: 30px; text-align: left"
                size="mini"
                icon="el-icon-arrow-left"
                >{{ $t("login.return") }}</el-button
              >

              <el-form-item
                :label="$t('inspection.Building')"
                style="display: flex; margin-left: 2%; margin-right: 0"
              >
                <el-select
                  clearable
                  filterable
                  v-model="isactive"
                  @change="getGrounds(isactive)"
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in buildingList"
                    :key="item.id"
                    :label="item.building"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: 0">
                <el-button
                  type="primary"
                  @click="updateTaskManagementDetailsTrue()"
                  class="reset"
                  >{{ $t("inspection.preservation") }}</el-button
                >
              </el-form-item>
            </el-form>
            <div v-show="mapTypes" class="mapConent">
              <div id="allmap" ref="map" class="allmap"></div>
              <div class="selectGround">
                <div
                  class="fm-control-groups"
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
                        v-show="
                          grounds.length > 1 && index !== grounds.length - 1
                        "
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

            <div v-show="!mapTypes" class="mapConentD">
              <div id="fengMap"></div>
              <div v-show="!mapTypes" class="mapConentD"></div>
            </div>
          </el-dialog>

          <!-- 显示巡检路线详情 -->
          <el-dialog
            :title="$t('inspection.text3')"
            :visible.sync="showInspection"
            width="40%"
            style="text-align: center"
            @close="closeInspection"
          >
            <div style="padding-bottom: 3%">
              <el-table :data="showInspectionData" border max-height="660">
                <el-table-column
                  property="beaconid"
                  :label="$t('inspection.DeviceNo')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                  v-if="intoProjectType == 1"
                ></el-table-column>
                <el-table-column
                  property="deveui"
                  :label="$t('inspection.DeviceNo')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                  v-if="intoProjectType == 2"
                ></el-table-column>
                <el-table-column
                  property="alias"
                  :label="$t('inspection.alias')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                ></el-table-column>
                <el-table-column
                  property="building"
                  :label="$t('inspection.building')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                ></el-table-column>
                <el-table-column
                  property="ground"
                  :label="$t('inspection.floor')"
                  show-overflow-tooltip
                  min-width="77"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed="right"
                  :label="$t('inspection.Operate')"
                  width="170"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      class="edits"
                      @click="
                        goShowInspection(scope.$index, showInspectionData)
                      "
                      >{{ $t("inspection.Check") }}</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      class="dels"
                      @click="
                        delShowInspection(scope.$index, showInspectionData)
                      "
                      >{{ $t("inspection.delete") }}</el-button
                    >
                  </template></el-table-column
                >
              </el-table>
            </div>
          </el-dialog>

          <!-- 添加巡检任务 -->
          <el-dialog
            :title="$t('inspection.text4')"
            width="40%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
            @opened="openDialog('addData')"
          >
            <el-form
              :model="addData"
              label-width="100px"
              ref="addData"
              :rules="addRules"
              style="text-align: left; margin-top: 2%"
              class="addInspection"
            >
              <el-form-item :label="$t('inspection.Task')" prop="name">
                <el-input v-model="addData.name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('inspection.Repeat')" prop="repetition">
                <el-select
                  v-model="addData.repetition"
                  clearable
                  @change="showDetal()"
                  :placeholder="$t('inspection.text')"
                >
                  <el-option
                    v-for="item in repetitionList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="addData.daily"
                  v-show="addData.repetition == 3 || addData.repetition == 4"
                  multiple
                  clearable
                  :placeholder="$t('inspection.text')"
                >
                  <el-option
                    v-for="item in dailyList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('inspection.Date')">
                <el-date-picker
                  v-model="totleDate"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  :range-separator="$t('inspection.to')"
                  :start-placeholder="$t('inspection.startdate')"
                  :end-placeholder="$t('inspection.enddate')"
                  :picker-options="above_now"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('inspection.time')">
                <el-time-picker
                  is-range
                  :picker-options="{
                    selectableRange: '00:00 - 24:00',
                  }"
                  v-model="totleTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  :range-separator="$t('inspection.to')"
                  :start-placeholder="$t('inspection.Startingtime')"
                  :end-placeholder="$t('inspection.EndTime')"
                  :placeholder="$t('tet.tet14')"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item :label="$t('inspection.Remark')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  rows="4"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel('addData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 编辑巡检任务 -->
          <el-dialog
            :title="$t('inspection.text5')"
            width="40%"
            :visible.sync="edit"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              label-width="100px"
              ref="editData"
              :rules="editRules"
              style="text-align: left; margin-top: 2%"
              class="addInspection"
            >
              <el-form-item :label="$t('inspection.Task')" prop="name">
                <el-input v-model="editData.name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('inspection.Repeat')" prop="repetition">
                <el-select
                  v-model="editData.repetition"
                  filterable
                  clearable
                  @change="showDetalEdit()"
                  :placeholder="$t('inspection.text')"
                >
                  <el-option
                    v-for="item in repetitionList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="editData.daily"
                  v-show="editData.repetition == 3 || editData.repetition == 4"
                  multiple
                  clearable
                  :placeholder="$t('inspection.text')"
                >
                  <el-option
                    v-for="item in dailyList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('inspection.Date')">
                <el-date-picker
                  v-model="totleDate"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  :range-separator="$t('inspection.to')"
                  :start-placeholder="$t('inspection.startdate')"
                  :end-placeholder="$t('inspection.enddate')"
                  :picker-options="above_now"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('inspection.time')">
                <el-time-picker
                  is-range
                  arrow-control
                  :picker-options="{
                    selectableRange: '00:00 - 24:00',
                  }"
                  v-model="totleTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  :range-separator="$t('inspection.to')"
                  :start-placeholder="$t('inspection.Startingtime')"
                  :end-placeholder="$t('inspection.EndTime')"
                  :placeholder="$t('tet.tet14')"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item :label="$t('inspection.Remark')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  rows="4"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel('addData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTaskTrue('addData')"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 分配巡检任务 -->
          <el-dialog
            :title="$t('inspection.text6')"
            width="30%"
            :visible.sync="update"
            style="text-align: center"
          >
            <el-form
              label-width="100px"
              ref="editData"
              style="text-align: left; margin-top: 2%"
              class="addInspection"
            >
              <el-form-item
                :label="$t('inspection.taskname1')"
                prop="name"
                style="width: 70%; margin-left: 0"
              >
                <el-input v-model="updateData.name" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('inspection.staff')" prop="repetition">
                <el-select
                  v-model="userid"
                  filterable
                  multiple
                  clearable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in memberList"
                    :key="item.id"
                    :label="item.username"
                    :value="item.username"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="update = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="updateTaskTrue('addData')"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 显示巡检任务分配人员 -->
          <el-dialog
            :title="$t('inspection.Personneldetails')"
            width="40%"
            :visible.sync="showUser"
            style="text-align: center"
            @close="closeAction"
          >
            <div style="padding-bottom: 3%">
              <el-table :data="userDetails" border max-height="600">
                <el-table-column
                  property="username"
                  :label="$t('inspection.name')"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  property="depart"
                  :label="$t('inspection.Department')"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  property="worktype"
                  :label="$t('inspection.Typeofwork')"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  property="maplabel"
                  :label="$t('inspection.Workcardnumber')"
                  align="center"
                  show-overflow-tooltip
                  min-width="100"
                ></el-table-column>
                <el-table-column
                  property="cardno"
                  :label="$t('inspection.Jobnumber')"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  property="tel"
                  :label="$t('inspection.telephone')"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import host from "../../host";
import Menu from "../../components/menu/Menu";
import basecard from "../../components/card/base-card";
import Asset from "../../components/asset/asset.vue";

// 地图相关
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
// 用来添加相关文字描述的
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

import {
  getTaskInfoList,
  getTaskManagementList,
  insertTaskManagement,
  delTaskInfo,
  delTaskManagement,
  updateTaskManagement,
  getMemberList,
  updateTaskManagementStats,
  updateTaskManagementUsers,
  getMemberByIds,
  getMemberNameId,
  getDepartmentType,
  getTaskNameId,
  getBuildingByProjectid,
  getGroundList,
  getGround,
  getBuildGroundList,
  getBeaconPosList,
  getDevPosList,
  updateTaskManagementDetails,
  getBeaconByBeaconids,
  getDevByEuiList,
  getTaskInfoTimeList,
  removeTaskManagementDetails,
} from "../../axios/api";
import util from "../../common/util";
export default {
  components: {
    Menu,
    basecard,
    Asset,
  },
  name: "CheckWork",
  data() {
    return {
      i8n: this.$store.state.i18n,
      activeName: "first",
      projectid: this.$store.state.intoProjectid,
      intoProjectid: this.$store.state.intoProjectid,
      intoProjectType: this.$store.state.intoProjectType,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      contrForPrionum: this.$store.state.userInfo.prionum,
      delprio: this.$store.state.userInfo.delprio,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tableData: [],
      tableDataHis: [],
      multipleSelection: [],
      currentRow: null,
      currentRowHis: null,
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("terminal.pickeroptions4"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0));
              // start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions5"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("terminal.pickeroptions6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6);
              // end.setTime(end.setHours(0, 0, 0, 0));
              picker.$emit("pick", [start, end]);

              // const end = new Date();
              // const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              // picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tasktime: [],
      taskData: [],
      begingTime: "",
      endTime: "",
      departList: [],
      //巡检任务
      searchList: {
        projectid: this.$store.state.projectid,
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        states: "",
      },
      //巡检历史
      begindate: "",
      enddate: "",
      detail: false,
      searchListHis: {
        userid: "",
        taskid: "",
        projectid: this.$store.state.projectid,
        taskdate: "",
        taskstatus: "",
        begintaskstatus: "",
        endtaskstatus: "",
        page: 1,
        count: 20,
      },
      taskList: [],
      taskInfoTimeList: [], //巡检历史时间
      total: 0,
      totalMember: 0,
      pageCount: 20,
      pageCountHis: 20,
      pageCountMem: 20,
      currentPage1: 1,
      edit: false,
      editData: {
        id: "",
        name: "",
        repetition: "",
        daily: "",
        begindate: "",
        enddate: "",
        begintime: "",
        endtime: "",
        memo: "",
      },
      editRules: {
        name: [
          {
            required: true,
            message: this.$t("inspection.patroltask"),
            trigger: "blur",
          },
        ],
        repetition: [
          {
            required: true,
            message: this.$t("inspection.duplicatedate"),
            trigger: "change",
          },
        ],
      },
      add: false,
      addData: {
        name: "",
        projectid: this.$store.state.projectid,
        repetition: "",
        daily: "",
        begindate: "",
        enddate: "",
        begintime: "",
        endtime: "",
        memo: "",
        timezone: (0 - new Date().getTimezoneOffset() / 60) * 3600,
      },

      mapTypes: true,
      setInspectionMap: false, //设置巡检路线详情
      inspectionDetails: [],
      inspectionInfodetails: [], //巡检记录
      inspectionDetailsArr: [], //用于巡检任务详情里面删除
      inspectionName: "",
      inspectionId: "",
      isactive: "",
      isactiveGround: false,
      buildingList: [], //楼栋下拉框
      building: "", //当前选中楼栋
      grounds: "", //所有楼层
      groundid: "", //当前楼层编号
      imgUrl: "", //地图路径
      map: null,
      mapName: "allmap",
      mapNameHis: "allmapHis",
      arrangeFeatures: "", //已布置的设备
      iconSrc: "",
      featureArrs: [], //地图上所有的图标

      showInspection: false, //显示巡检任务详情
      showInspectionData: [],

      showUser: false, //显示巡检任务分配人员详情
      userDetails: [], //巡检人员数据

      //3D 地图相关
      groundListCopy: [], //用于3D地图的时候，设定新的对应关系
      newGround: "", //用于3D地图的时候新的对应关系里的新的楼层对应的
      changemap: true,
      map3d: null,
      fmapId: "",
      themeId: "",
      scrollFloorControl: "",
      layer: null,
      layerList: [],
      layer2: null,
      setNewMarker: true, //标注

      addRules: {
        name: [
          {
            required: true,
            message: this.$t("inspection.patroltask"),
            trigger: "blur",
          },
        ],
        repetition: [
          {
            type: "number",
            required: true,
            message: this.$t("inspection.duplicatedate"),
            trigger: "change",
          },
        ],
      },
      update: false,
      updateData: {},
      userid: [], //员工id集合
      totleTime: "", //添加巡检时间
      totleDate: "", //添加巡检日期
      // 巡检日期
      above_now: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        },
      },
      repetitionList: [
        {
          index: 1,
          value: this.$t("inspection.Norepetition"),
        },
        {
          index: 5,
          value: this.$t("inspection.onehour"),
        },
        {
          index: 6,
          value: this.$t("inspection.twohours"),
        },
        {
          index: 7,
          value: this.$t("inspection.threehours"),
        },
        {
          index: 8,
          value: this.$t("inspection.fourhours"),
        },
        {
          index: 9,
          value: this.$t("inspection.fivehours"),
        },
        {
          index: 10,
          value: this.$t("inspection.sixhours"),
        },
        {
          index: 2,
          value: this.$t("inspection.Everyday"),
        },
        {
          index: 4,
          value: this.$t("inspection.weekly"),
        },
        {
          index: 3,
          value: this.$t("inspection.monthly"),
        },
      ],
      dailyList: [],
      dailyDays: [
        {
          value: "01",
          index: 1,
        },
        {
          value: "02",
          index: 2,
        },
        {
          value: "03",
          index: 3,
        },
        {
          value: "04",
          index: 4,
        },
        {
          value: "05",
          index: 5,
        },
        {
          value: "06",
          index: 6,
        },
        {
          value: "07",
          index: 7,
        },
        {
          value: "08",
          index: 8,
        },
        {
          value: "09",
          index: 9,
        },
        {
          value: "10",
          index: 10,
        },
        {
          value: "11",
          index: 11,
        },
        {
          value: "12",
          index: 12,
        },
        {
          value: "13",
          index: 13,
        },
        {
          value: "14",
          index: 14,
        },
        {
          value: "15",
          index: 15,
        },
        {
          value: "16",
          index: 16,
        },
        {
          value: "17",
          index: 17,
        },
        {
          value: "18",
          index: 18,
        },
        {
          value: "19",
          index: 19,
        },
        {
          value: "20",
          index: 20,
        },
        {
          value: "21",
          index: 21,
        },
        {
          value: "22",
          index: 22,
        },
        {
          value: "23",
          index: 23,
        },
        {
          value: "24",
          index: 24,
        },
        {
          value: "25",
          index: 25,
        },
        {
          value: "26",
          index: 26,
        },
        {
          value: "27",
          index: 27,
        },
        {
          value: "28",
          index: 28,
        },
        {
          value: "29",
          index: 29,
        },
        {
          value: "30",
          index: 30,
        },
        {
          value: "31",
          index: 31,
        },
      ],
      dailyWeeks: [
        {
          index: 1,
          value: this.$t("inspection.Monday"),
        },
        {
          index: 2,
          value: this.$t("inspection.Tuesday"),
        },
        {
          index: 3,
          value: this.$t("inspection.Wednesday"),
        },
        {
          index: 4,
          value: this.$t("inspection.Thursday"),
        },
        {
          index: 5,
          value: this.$t("inspection.Friday"),
        },
        {
          index: 6,
          value: this.$t("inspection.Saturday"),
        },
        {
          index: 7,
          value: this.$t("inspection.Sunday"),
        },
      ],
      statusList: [
        {
          index: 1,
          value: this.$t("inspection.normal"),
        },
        {
          index: 2,
          value: this.$t("inspection.termination"),
        },
      ],
      statusHisList: [
        {
          index: 1,
          value: this.$t("inspection.Notperformed"),
        },
        {
          index: 2,
          value: this.$t("inspection.inprogress"),
        },
        {
          index: 3,
          value: this.$t("inspection.complete"),
        },
        {
          index: 4,
          value: this.$t("inspection.incomplete"),
        },
      ],
      sexType: [
        {
          index: 1,
          value: this.$t("inspection.man"),
        },
        {
          index: 2,
          value: this.$t("inspection.woman"),
        },
      ],

      del: false,
      delHis: false,
      loading: false,
      deleteData: [],
      memberList: [],
      nameList: [], //用作姓名下拉框

      taskHisInfo: false,
      lastGroup: true,
      nextGroup: true,
      lastBuilding: true,
      nextBuilding: true,

      lastGroup3D: false,
      nextGroup3D: false,
      taskHisInfoData: [],
      buildingListHis: [], //楼栋下拉框，巡检历史巡检详情
      groundListHis: [], //楼层数组，巡检历史巡检详情
      taskHis: false, //判断是否为巡检历史页面
    };
  },
  methods: {
    // 巡检历史里面根据状态设置表格样式
    tableCellClassName(row) {
      if (row.taskstatus == 1) {
        return "not-conducted";
      } else if (row.taskstatus == 2) {
        return "underway";
      } else if (row.taskstatus == 3) {
        return "finished";
      } else if (row.taskstatus == 4) {
        return "unfinished";
      }
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
    formatDatectime(row, colum) {
      if (row.ctime == null || row.ctime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.ctime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    datetimecut1(UTCDateString) {
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
      var dateStr = mon + "-" + day + " " + hour + ":" + min + ":" + sec;
      return dateStr;
    },
    formatDatetime(row) {
      if (row == null || row == 0) {
        return "";
      }
      let date = new Date(parseInt(row) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut1(date2);
    },
    formatSeconds(value) {
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result = "" + parseInt(secondTime) + "s";

      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "m" + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "h" + result;
      }
      return result;
    },

    //切换标签
    changeTab(tab, event) {
      var that = this;
      switch (tab.index) {
        case "0":
          //巡检任务
          that.searchList = {
            projectid: this.$store.state.projectid,
            begintime: "",
            endtime: "",
            page: 1,
            count: 20,
            states: "",
          };
          that.currentPage1 = 1;
          that.pageCount = 20;
          that.tasktime = [];
          that.taskHis = false;
          that.getTaskNameIds();
          that.getTaskManagementLists();
          break;
        case "1":
          //巡检历史
          that.searchListHis = {
            userid: "",
            taskid: "",
            projectid: that.$store.state.projectid,
            taskdate: "",
            taskstatus: "",
            begintaskstatus: "",
            endtaskstatus: "",
            page: 1,
            count: 20,
          };
          that.currentPage1 = 1;
          that.pageCountHis = 20;
          that.taskData = [];
          that.taskHis = true;
          that.getTaskNameIds();
          that.getMemberLists2();
          that.getTaskInfoLists();
          break;
        default:
          break;
      }
    },
    // 设置巡检任务详情
    setInspection(index) {
      this.inspectionDetails = [];
      this.isactive = "";
      this.buildingList = [];
      this.grounds = "";
      if (this.map) {
        this.map.setTarget("nnnnnn");
        this.map = null;
      }
      if (this.map3d) {
        this.map3d.dispose();
        this.map3d = null;
      }
      this.inspectionName = this.tableData[index].name;
      this.inspectionId = this.tableData[index].id;
      if (this.tableData[index].details) {
        this.inspectionDetails = this.tableData[index].details.split(",");
      }
      this.getBuildings();
      this.setInspectionMap = true;
    },
    // 解除路线设置
    removeInspection(index) {
      var that = this;
      this.$confirm(this.$t("inspection.RemoveRouteText"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      }).then(() => {
        let data = {
          id: that.tableData[index].id,
          name: that.tableData[index].name,
        };
        removeTaskManagementDetails(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.clearBtn();
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
      });
    },

    //获取楼栋号的下拉框
    getBuildings(buildingId, ground) {
      var that = this;
      let data = {
        projectid: this.$store.state.intoProjectid,
      };
      getBuildingByProjectid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.buildingList = res.data;
          if (!buildingId && !ground && that.buildingList.length > 0) {
            that.isactive = that.buildingList[0].id;
            that.getGrounds(that.isactive);
          }
          if (buildingId) {
            var found = that.buildingList.find(function (item) {
              return item.id == buildingId;
            });
            if (found.buildtype == 1) {
              that.mapTypes = true;
              that.getGroundLists(buildingId, ground);
            } else if (found.buildtype == 2) {
              that.mapTypes = false;
              that.getGroundLists3D(buildingId, ground);
            }
          }
        }
      });
    },

    // 点击楼栋,判断楼栋是2D还是3D
    getGrounds(val) {
      var that = this;
      var found = this.buildingList.find(function (item) {
        return item.id == val;
      });
      if (found.buildtype == 1) {
        if (that.map3d) {
          that.map3d.dispose();
          that.map3d = null;
        }
        this.mapTypes = true;
        this.getGroundLists(val);
      } else if (found.buildtype == 2) {
        this.mapTypes = false;
        that.getGroundLists3D(val);
      }
    },

    // 点击楼栋,判断楼栋是2D还是3D,巡检历史页面
    getGroundsHis(val) {
      this.groundListHis = [];
      var that = this;
      var found = this.buildingList.find(function (item) {
        return item.id == val;
      });

      // 获取点击的楼栋在数组里的位置
      let buildIndex;
      this.buildingListHis.forEach((item, index) => {
        if (val == item.buildid) {
          buildIndex = index;
          return;
        }
      });
      // 判断点击的楼栋在数组中的位置
      if (buildIndex === 0) {
        this.lastBuilding = true;
      } else {
        this.lastBuilding = false;
      }

      if (buildIndex == this.buildingListHis.length - 1) {
        this.nextBuilding = true;
      } else {
        this.nextBuilding = false;
      }
      let arrData = this.taskHisInfoData.filter((item) => item.buildid === val);
      let hash = {};
      // 获取数据中存在的楼层
      arrData = arrData.reduce((item, next) => {
        hash[next.groundid]
          ? ""
          : (hash[next.groundid] = true && item.push(next));
        return item;
      }, []);

      arrData.sort(function (a, b) {
        return a.ground - b.ground;
      });
      for (let i = 0; i < arrData.length; i++) {
        that.groundListHis.push(arrData[i].ground);
      }
      that.groundListHis.sort(function (a, b) {
        return a - b;
      });
      that.groundListHis = that.groundListHis.reverse();

      this.isactive = val;
      this.building = val;
      if (found.buildtype == 1) {
        if (that.groundListHis.length == 1) {
          that.lastGroup = true;
          that.nextGroup = true;
        } else if (that.groundListHis.length > 1) {
          that.lastGroup = true;
          that.nextGroup = false;
        }
        if (that.map3d) {
          that.map3d.dispose();
          that.map3d = null;
        }
        this.mapTypes = true;
        this.getBuildGroundLists(
          this.groundListHis[this.groundListHis.length - 1]
        );
      } else if (found.buildtype == 2) {
        if (that.groundListHis.length == 1) {
          that.lastGroup3D = true;
          that.nextGroup3D = true;
        } else if (that.groundListHis.length > 1) {
          that.lastGroup3D = true;
          that.nextGroup3D = false;
        }
        this.mapTypes = false;
        that.getGroundLists3D(val, arrData[0].ground);
      }
    },
    // 巡检历史页面，上一栋
    lastBuildings() {
      this.nextBuilding = false;
      var that = this;
      let index = this.buildingListHis.findIndex(
        (item) => item.buildid == that.isactive
      );

      this.isactive = that.buildingListHis[index - 1].buildid;

      if (index == 0) {
        this.lastBuilding = true;
      }
      this.getGroundsHis(this.isactive);
    },
    // 巡检历史页面，上一层
    lastGroups() {
      var that = this;
      let index = this.groundListHis.findIndex(
        (item) => item == that.isactiveGround
      );
      that.groundListHis = that.groundListHis.reverse();
      this.isactiveGround = that.groundListHis[index];
      that.groundListHis = that.groundListHis.reverse();

      this.getBuildGroundLists(this.isactiveGround);
    },
    // 巡检历史页面，下一栋
    nextBuildings() {
      this.lastBuilding = false;
      var that = this;
      let index = this.buildingListHis.findIndex(
        (item) => item.buildid == that.isactive
      );
      this.isactive = that.buildingListHis[index + 1].buildid;
      if (index == that.buildingListHis.length - 1) {
        this.nextBuilding = true;
      }
      this.getGroundsHis(this.isactive);
    },
    // 巡检历史页面，下一层
    nextGroups() {
      var that = this;
      let index = this.groundListHis.findIndex(
        (item) => item == that.isactiveGround
      );
      that.groundListHis = that.groundListHis.reverse();
      this.isactiveGround = that.groundListHis[index];
      that.groundListHis = that.groundListHis.reverse();

      this.getBuildGroundLists(this.isactiveGround);
    },
    //获取楼层2D
    getGroundLists(val, ground) {
      var that = this;
      this.featureArrs = [];
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
          that.grounds = res.data.reverse();
          that.building = val;
          if (ground) {
            that.getBuildGroundLists(ground);
          } else {
            that.getBuildGroundLists(that.grounds[that.grounds.length - 1]);
          }
        }
      });
    },

    // 获取楼层3D
    getGroundLists3D(build, ground) {
      var that = this;
      that.groundListCopy = [];
      this.isactive = build;
      this.building = build;
      if (this.map3d) {
        this.map3d.dispose();
        this.map3d = null;
      }

      let data = {
        buildid: build,
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
            that.fmapId = res.data[0].filename;
            that.themeId = res.data[0].filetype;
            setTimeout(() => {
              let gound;
              if (ground) {
                let focusGroupID = that.groundListCopy.find(function (item) {
                  return item.ground == ground;
                });
                gound = focusGroupID.newground;
              }
              if (that.taskHis == false) {
                that.onmap(
                  that.$store.state.intoProjectid,
                  gound,
                  res.data[0].appname,
                  res.data[0].mapkey
                );
              } else {
                that.onmapHis(
                  that.$store.state.intoProjectid,
                  gound,
                  res.data[0].appname,
                  res.data[0].mapkey
                );
              }
            }, 1);
          }
        }
      );
    },
    //加载3D地图
    onmap(projectid, groundVal, appname, mapkey) {
      let ground;
      if (groundVal) {
        ground = groundVal;
      } else {
        ground = 1;
      }
      document.oncontextmenu = function (e) {
        return false;
      };
      var that = this;
      var mapOpation = {
        container: document.getElementById("fengMap"),
        level: ground,
        visibleLevels: [ground],
        appName: appname,
        key: mapkey,
        viewMode: fengmap.FMViewMode.MODE_2D,
        mapID: that.fmapId,
        themeID: that.themeId,
        zoomRange: [1, 29],
        // mapURL: "/data/",
        // themeURL: "/data/theme/",
      };

      this.map3d = new fengmap.FMMap(mapOpation);
      this.map3d.on("loaded", function () {
        console.log("地图加载完成");
        that.loadScrollFloorCtrl();
        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        let data = {
          projectid: that.intoProjectid,
          buildid: that.building,
          ground: focusGroupID.ground,
        };
        getBuildGroundList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.groundid = res.data.list[0].id;
            if (that.$store.state.intoProjectType == 1) {
              that.getArrangeBeaconPos3D(projectid, that.map3d.getLevel());
            } else if (that.$store.state.intoProjectType == 2) {
              that.getArrangeGatewayPos3D(projectid, that.map3d.getLevel());
            }
          }
        });
      });
      // 聚焦楼层改变事件
      this.map3d.on("levelChanged", function (event) {
        if (that.layerList.length > 0) {
          that.layerList.forEach((item) => {
            item.remove();
          });
          that.layerList = [];
        }
        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        let data = {
          projectid: that.intoProjectid,
          buildid: that.building,
          ground: focusGroupID.ground,
        };
        getBuildGroundList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.groundid = res.data.list[0].id;
            if (that.$store.state.intoProjectType == 1) {
              that.getArrangeBeaconPos3D(projectid, that.map3d.getLevel());
            } else if (that.$store.state.intoProjectType == 2) {
              that.getArrangeGatewayPos3D(projectid, that.map3d.getLevel());
            }
          }
        });
      });

      // 鼠标左键点击事件
      this.map3d.on("click", function (event) {
        if (event.targets[0].type == "64") {
          //event.nodeType=31表示图片标注
          //type == "64"表示点到图标
          that.setNewMarker = false;
          if (event.mouseEvent.button == 0) {
            //左键点击
            that.map3dClick(event.targets[0]);
          }
        }
      });
    },
    //巡检历史页面巡检详情加载3D地图
    onmapHis(projectid, groundVal, appname, mapkey) {
      let ground;
      if (groundVal) {
        ground = groundVal;
      } else {
        ground = 1;
      }
      document.oncontextmenu = function (e) {
        return false;
      };
      var that = this;
      var mapOpation = {
        container: document.getElementById("fengMapHis"),
        level: ground, //默认聚焦楼层
        visibleLevels: [ground], //初始显示楼层ID数组
        appName: appname,
        key: mapkey,
        viewMode: fengmap.FMViewMode.MODE_2D, //设置地图2d显示
        mapID: that.fmapId,
        themeID: that.themeId,
        // mapURL: "/data/",
        // themeURL: "/data/theme/",
      };

      this.map3d = new fengmap.FMMap(mapOpation);
      this.map3d.on("loaded", function () {
        console.log("地图加载完成");
        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        let data = {
          projectid: that.intoProjectid,
          buildid: that.building,
          ground: focusGroupID.ground,
        };
        getBuildGroundList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.groundid = res.data.list[0].id;
            if (that.$store.state.intoProjectType == 1) {
              that.getArrangeBeaconPos3D(projectid, that.map3d.getLevel());
            } else if (that.$store.state.intoProjectType == 2) {
              that.getArrangeGatewayPos3D(projectid, that.map3d.getLevel());
            }
          }
        });
      });
      // 聚焦楼层改变事件
      this.map3d.on("levelChanged", function (event) {
        that.layerList.forEach((item) => {
          item.remove();
        });
        that.layerList = [];
        let focusGroupID = that.groundListCopy.find(function (item) {
          return item.newground == that.map3d.getLevel();
        });
        let data = {
          projectid: that.intoProjectid,
          buildid: that.building,
          ground: focusGroupID.ground,
        };
        getBuildGroundList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.groundid = res.data.list[0].id;
            if (that.$store.state.intoProjectType == 1) {
              that.getArrangeBeaconPos3D(projectid, that.map3d.getLevel());
            } else if (that.$store.state.intoProjectType == 2) {
              that.getArrangeGatewayPos3D(projectid, that.map3d.getLevel());
            }
          }
        });
      });
    },

    // 用来判断3D地图上一层，下一层
    changeGroup() {
      var that = this;
      let newArrLast = that.groundListCopy.filter(function (value) {
        return that.map3d.getLevel() > value.newground;
      });
      let newArrNext = that.groundListCopy.filter(function (value) {
        return that.map3d.getLevel() < value.newground;
      });
      if (newArrLast.length == 0) {
        this.lastGroup3D = true;
      } else {
        this.lastGroup3D = false;
      }
      if (newArrNext.length == 0) {
        this.nextGroup3D = true;
      } else {
        this.nextGroup3D = false;
      }
    },
    // 巡检历史页面，上一层
    lastGroups3D() {
      var that = this;
      this.map3d.setLevel({
        level: this.map3d.getLevel() - 1,
        finish: function () {
          that.changeGroup();
        },
      });
    },
    // 巡检历史页面，下一层
    nextGroups3D() {
      var that = this;
      this.map3d.setLevel({
        level: this.map3d.getLevel() + 1,
        finish: function () {
          that.changeGroup();
        },
      });
    },

    //加载滚动楼层控制
    loadScrollFloorCtrl() {
      var scrollFloorCtlOpt = {
        position: fengmap.FMControlPosition.RIGHT_TOP,
        //初始楼层按钮显示个数配置。默认显示5层,其他的隐藏，可滚动查看
        // showBtnCount: 6,
        //是否显示多层/单层切换按钮
        needAllLayerBtn: false,
        offset: {
          x: -20,
          y: 20,
        },
      };
      this.scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt);
      this.scrollFloorControl.addTo(this.map3d);
    },

    //正向项目获取3D地图上已布置的设备
    getArrangeBeaconPos3D(projectid, groupID) {
      var that = this;
      let data2 = {
        fortype: 2,
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getBeaconPosList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.arrangeFeatures = res.data.list;
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.arrangeFeatures[i].inspection = false;
              for (let j = 0; j < that.inspectionDetails.length; j++) {
                if (
                  that.arrangeFeatures[i].beaconid == that.inspectionDetails[j]
                ) {
                  that.arrangeFeatures[i].inspection = true;
                  break;
                }
              }
              if (that.taskHis == false) {
                that.addMarkers(that.arrangeFeatures[i], groupID);
              } else {
                that.addMarkersHis(that.arrangeFeatures[i], groupID);
              }
            }
          }
        }
      });
    },
    //反向项目获取3D地图上已布置的设备
    getArrangeGatewayPos3D(projectid, groupID) {
      var that = this;
      let data2 = {
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevPosList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.arrangeFeatures = res.data.list;
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.arrangeFeatures[i].inspection = false;
              for (let j = 0; j < that.inspectionDetails.length; j++) {
                if (
                  that.arrangeFeatures[i].deveui == that.inspectionDetails[j]
                ) {
                  that.arrangeFeatures[i].inspection = true;
                  break;
                }
              }
              if (that.taskHis == false) {
                that.addMarkers(that.arrangeFeatures[i], groupID);
              } else {
                that.addMarkersHis(that.arrangeFeatures[i], groupID);
              }
            }
          }
        }
      });
    },

    //3D 地图显示图标
    addMarkers(mapinfo, groupID) {
      var that = this;
      if (this.$store.state.intoProjectType == 1) {
        //正向项目
        var coord = {
          x: mapinfo.longi,
          y: mapinfo.lati,
        };
        var info = {
          x: mapinfo.longi,
          y: mapinfo.lati,
          alias: mapinfo.alias,
          deveui: mapinfo.beaconid,
          major: mapinfo.major,
          minor: mapinfo.minor,
          type: mapinfo.type,
          clockin: mapinfo.clockin,
          tranche: mapinfo.tranche,
          inspection: mapinfo.inspection,
          warning: "",
        };
      } else if (this.$store.state.intoProjectType == 2) {
        //反向项目
        var coord = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
        };
        var info = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
          alias: mapinfo.alias,
          deveui: mapinfo.deveui,
          major: mapinfo.major,
          minor: mapinfo.minor,
          type: "",
          clockin: mapinfo.clockin,
          inspection: mapinfo.inspection,
          warning: mapinfo.warning,
        };
      }
      if (this.intoProjectType == 1) {
        if (mapinfo.inspection) {
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: info.alias,
              },
            },
            x: coord.x,
            y: coord.y,
            image: {
              url: "../../../static/beacon_sos.png",
              size: [100, 100],
            },
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
            height: 2,
          });
        } else {
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: info.alias,
              },
            },
            x: coord.x,
            y: coord.y,
            height: 2,
            image: {
              url: that.iconSrc,
              size: [100, 100],
            },
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          });
        }
      } else if (this.intoProjectType == 2) {
        if (mapinfo.inspection) {
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: info.alias,
              },
            },
            x: coord.x,
            y: coord.y,
            height: 2,
            image: {
              url: "../../../static/gateway_sos.png",
              size: [100, 100],
            },
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          });
        } else {
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: info.alias,
              },
            },
            x: coord.x,
            y: coord.y,
            height: 2,
            image: {
              url: that.iconSrc,
              size: [100, 100],
            },
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          });
        }
      }

      this.layer.selfAttr = info;
      var level = this.map3d.getLevel();
      var group = this.map3d.getFloor(level);
      this.layer.addTo(group);
      this.layerList.push(this.layer);
    },

    //巡检历史巡检详情3D 地图显示图标
    addMarkersHis(mapinfo, groupID) {
      var that = this;
      if (this.$store.state.intoProjectType == 1) {
        //正向项目
        var coord = {
          x: mapinfo.longi,
          y: mapinfo.lati,
        };
        var info = {
          x: mapinfo.longi,
          y: mapinfo.lati,
          alias: mapinfo.alias,
          deveui: mapinfo.beaconid,
          major: mapinfo.major,
          minor: mapinfo.minor,
          type: mapinfo.type,
          clockin: mapinfo.clockin,
          tranche: mapinfo.tranche,
          inspection: mapinfo.inspection,
          warning: "",
        };
      } else if (this.$store.state.intoProjectType == 2) {
        //反向项目
        var coord = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
        };
        var info = {
          x: mapinfo.lastx,
          y: mapinfo.lasty,
          alias: mapinfo.alias,
          deveui: mapinfo.deveui,
          major: mapinfo.major,
          minor: mapinfo.minor,
          type: "",
          clockin: mapinfo.clockin,
          inspection: mapinfo.inspection,
          warning: mapinfo.warning,
        };
      }
      if (this.intoProjectType == 1) {
        if (mapinfo.inspection) {
          if (that.inspectionInfodetails.includes(mapinfo.beaconid)) {
            let icon;
            that.taskInfoTimeList.forEach((item) => {
              if (item.deveui == mapinfo.beaconid) {
                icon = item;
              }
            });
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text:
                    info.alias +
                    `\n` +
                    that.$t("inspection.start") +
                    "：" +
                    that.formatDatetime(icon.begintime) +
                    `\n` +
                    that.$t("inspection.stay") +
                    "：" +
                    that.formatSeconds(icon.staytime),
                },
              },
              x: coord.x,
              y: coord.y,
              height: 2,
              image: {
                url: "../../../static/beacon_green.png",
                size: [100, 100],
              },
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            });
          } else {
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: info.alias,
                },
              },
              x: coord.x,
              y: coord.y,
              height: 2,
              image: {
                url: "../../../static/beacon_sos.png",
                size: [100, 100],
              },
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            });
          }
        } else {
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: info.alias,
              },
            },
            x: coord.x,
            y: coord.y,
            height: 2,
            image: {
              url: that.iconSrc,
              size: [100, 100],
            },
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          });
        }
      } else if (this.intoProjectType == 2) {
        if (mapinfo.inspection) {
          if (that.inspectionInfodetails.includes(info.beaconid)) {
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: info.alias,
                },
              },
              x: coord.x,
              y: coord.y,
              height: 2,
              image: {
                url: "../../../static/gateway_green.png",
                size: [100, 100],
              },
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            });
          } else {
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
                  // strokeColor: "rgba(255, 204, 255)",
                  // strokeWidth: 1,
                  text: info.alias,
                },
              },
              x: coord.x,
              y: coord.y,
              height: 2,
              image: {
                url: "../../../static/gateway_sos.png",
                size: [100, 100],
              },
              collision: false,
              anchor: {
                baseon: "image",
                anchor: fengmap.FMMarkerAnchor.CENTER,
              },
            });
          }
        } else {
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
                // strokeColor: "rgba(255, 204, 255)",
                // strokeWidth: 1,
                text: info.alias,
              },
            },
            x: coord.x,
            y: coord.y,
            height: 2,
            image: {
              url: that.iconSrc,
              size: [100, 100],
            },
            collision: false,
            anchor: {
              baseon: "image",
              anchor: fengmap.FMMarkerAnchor.CENTER,
            },
          });
        }
      }

      this.layer.selfAttr = info;
      var level = this.map3d.getLevel();
      var group = this.map3d.getFloor(level);
      this.layer.addTo(group);
      this.layerList.push(this.layer);
    },

    // 3D 地图点击事件
    map3dClick(marker) {
      var that = this;
      if (marker.selfAttr.inspection) {
        // marker.O = that.iconSrc;
        marker.setImage(that.iconSrc, [100, 100]);
        marker.selfAttr.inspection = false;
        marker.update();
        that.inspectionDetails.splice(
          that.inspectionDetails.indexOf(marker.selfAttr.deveui),
          1
        );
      } else {
        if (that.intoProjectType == 1) {
          marker.setImage("../../../static/beacon_sos.png", [100, 100]);
          // marker.O = "../../../static/beacon_sos.png";
        } else if (that.intoProjectType == 2) {
          marker.setImage("../../../static/gateway_sos.png", [100, 100]);
          // marker.O = "../../../static/gateway_sos.png";
        }
        marker.selfAttr.inspection = true;
        marker.update();
        that.inspectionDetails.push(marker.selfAttr.deveui);
      }
    },

    //获取楼层详情
    getBuildGroundLists(val) {
      var that = this;
      this.isactiveGround = val;

      let groundIndex = this.groundListHis.findIndex(
        (item) => item == that.isactiveGround
      );
      // 判断上一层，下一层按钮是否有用
      if (groundIndex === 0) {
        this.nextGroup = true;
      } else {
        this.nextGroup = false;
      }
      if (groundIndex == this.groundListHis.length - 1) {
        this.lastGroup = true;
      } else {
        this.lastGroup = false;
      }

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
            that.imgUrl = host.host + "indoormap/" + res.data.list[0].filetype;
            that.groundid = res.data.list[0].id;
            if (that.taskHis == false) {
              that.mapInit(res.data.list[0].length, res.data.list[0].width);
            } else {
              that.mapInitHis(res.data.list[0].length, res.data.list[0].width);
            }
            if (that.intoProjectType == 1) {
              that.getArrangeBeaconPos(that.intoProjectid);
            } else if (that.intoProjectType == 2) {
              that.getArrangeGatewayPos(that.intoProjectid);
            }
          } else {
            if (that.map) {
              that.map.setTarget("mapppppp");
              that.map = null;
            }
          }
        }
      });
    },

    mapInit(x, y) {
      if (this.map) {
        this.map.setTarget("masssss");
        this.map = null;
      }
      var that = this;
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      // setTimeout(() => {
      let xx, yy;
      if (x > 1399 && y > 699) {
        xx = 1400;
        yy = 700;
      } else if (x > 1399 && y < 700) {
        xx = 1400;
        yy = y;
      } else if (x < 1400 && y > 699) {
        yy = 700;
        xx = x;
      } else if (x < 1400 && y < 700) {
        xx = x;
        yy = y;
      }
      this.$refs.map.style.width = "100%";
      this.$refs.map.style.height = "100%";
      this.map = new Map({
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
          zoom: 1,
          maxZoom: 6,
        }),
      });
      this.mapClick();
      // }, 0);
    },
    mapInitHis(x, y) {
      if (this.map) {
        this.map.setTarget("masssss");
        this.map = null;
      }
      var that = this;
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      let xx, yy;
      if (x > 1399 && y > 699) {
        xx = 1400;
        yy = 700;
      } else if (x > 1399 && y < 700) {
        xx = 1400;
        yy = y;
      } else if (x < 1400 && y > 699) {
        yy = 700;
        xx = x;
      } else if (x < 1400 && y < 700) {
        xx = x;
        yy = y;
      }
      this.$refs.map.style.width = "100%";
      this.$refs.map.style.height = "100%";
      this.map = new Map({
        layers: [
          new ImageLayer({
            source: new Static({
              url: that.imgUrl,
              projection: projection,
              imageExtent: extent,
            }),
          }),
        ],
        target: this.mapNameHis,
        view: new View({
          projection: projection,
          center: getCenter(extent),
          zoom: 1,
          maxZoom: 6,
        }),
      });
    },

    //反向项目获取地图上已布置的设备
    getArrangeGatewayPos(projectid) {
      var that = this;
      let data2 = {
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getDevPosList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.arrangeFeatures = res.data.list;
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.arrangeFeatures[i].inspection = false;
              for (let j = 0; j < that.inspectionDetails.length; j++) {
                if (
                  that.arrangeFeatures[i].deveui == that.inspectionDetails[j]
                ) {
                  that.arrangeFeatures[i].inspection = true;
                  break;
                }
              }
              if (that.taskHis == false) {
                that.addIconMarkers(that.map, that.arrangeFeatures[i]);
              } else {
                that.addIconMarkersHis(that.map, that.arrangeFeatures[i]);
              }
            }
          }
        }
      });
    },

    //正向项目获取地图上已布置的设备
    getArrangeBeaconPos(projectid) {
      var that = this;
      let data2 = {
        fortype: 2,
        groundid: that.groundid,
        projectid: projectid,
        inallot: 1,
        inuse: 1,
      };
      getBeaconPosList(
        data2,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.arrangeFeatures = res.data.list;
          if (that.arrangeFeatures.length > 0) {
            for (let i = 0; i < that.arrangeFeatures.length; i++) {
              that.arrangeFeatures[i].inspection = false;
              for (let j = 0; j < that.inspectionDetails.length; j++) {
                if (
                  that.arrangeFeatures[i].beaconid == that.inspectionDetails[j]
                ) {
                  that.arrangeFeatures[i].inspection = true;
                  break;
                }
              }
              if (that.taskHis == false) {
                that.addIconMarkers(that.map, that.arrangeFeatures[i]);
              } else {
                that.addIconMarkersHis(that.map, that.arrangeFeatures[i]);
              }
            }
          }
        }
      });
    },

    //在地图上加载已布置的设备
    addIconMarkers(map, info) {
      var that = this;
      if (this.$store.state.intoProjectType == 1) {
        //正向项目
        var startMarker = new OlFeature({
          x: info.longi,
          y: info.lati,
          alias: info.alias,
          deveui: info.beaconid,
          major: info.major,
          minor: info.minor,
          type: info.type,
          clockin: info.clockin,
          inspection: info.inspection,
          warning: "",
          geometry: new OlGeomPoint([info.longi, info.lati]),
        });
      } else if (this.$store.state.intoProjectType == 2) {
        //反向项目
        var startMarker = new OlFeature({
          x: info.lastx,
          y: info.lasty,
          alias: info.alias,
          deveui: info.deveui,
          major: info.major,
          minor: info.minor,
          type: "",
          clockin: "",
          inspection: info.inspection,
          warning: info.warning,
          geometry: new OlGeomPoint([info.lastx, info.lasty]),
        });
      }

      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style;
      if (this.intoProjectType == 1) {
        if (info.inspection) {
          // 已设置信标用另一种图标表示
          style = new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 1],
              src: "../../../static/beacon_sos.png",
              scale: 1,
            }),
            //设置图片下面显示的字体样式和内容
            text: new Text({
              text: info.alias,
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
              text: info.alias,
              font: "14px font-size",
              fill: new Fill({
                color: "blue",
              }),
              offsetY: 10, //文字偏移量
            }),
          });
        }
      } else if (this.intoProjectType == 2) {
        if (info.inspection) {
          // 已设置信标用另一种图标表示
          style = new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 1],
              src: "../../../static/gateway_sos.png",
              scale: 1,
            }),
            //设置图片下面显示的字体样式和内容
            text: new Text({
              text: info.alias,
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
              text: info.alias,
              font: "14px font-size",
              fill: new Fill({
                color: "blue",
              }),
              offsetY: 10, //文字偏移量
            }),
          });
        }
      }

      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
    },
    //在地图上加载已布置的设备,巡检历史页面
    addIconMarkersHis(map, info) {
      var that = this;
      if (this.$store.state.intoProjectType == 1) {
        //正向项目
        var startMarker = new OlFeature({
          x: info.longi,
          y: info.lati,
          alias: info.alias,
          deveui: info.beaconid,
          major: info.major,
          minor: info.minor,
          type: info.type,
          clockin: info.clockin,
          inspection: info.inspection,
          warning: "",
          begintime: info.begintime,
          staytime: info.staytime,
          geometry: new OlGeomPoint([info.longi, info.lati]),
        });
      } else if (this.$store.state.intoProjectType == 2) {
        //反向项目
        var startMarker = new OlFeature({
          x: info.lastx,
          y: info.lasty,
          alias: info.alias,
          deveui: info.deveui,
          major: info.major,
          minor: info.minor,
          type: "",
          clockin: "",
          inspection: info.inspection,
          warning: info.warning,
          begintime: info.begintime,
          staytime: info.staytime,
          geometry: new OlGeomPoint([info.lastx, info.lasty]),
        });
      }

      var source = new OlSourceVector({
        features: [startMarker],
      });
      var style;
      if (this.intoProjectType == 1) {
        if (info.inspection) {
          if (that.inspectionInfodetails.includes(info.beaconid)) {
            let icon;
            that.taskInfoTimeList.forEach((item) => {
              if (item.deveui == info.beaconid) {
                icon = item;
              }
            });
            // 完成巡检
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/beacon_green.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text:
                  info.alias +
                  `\n` +
                  that.$t("inspection.start") +
                  "：" +
                  that.formatDatetime(icon.begintime) +
                  `\n` +
                  that.$t("inspection.stay") +
                  "：" +
                  that.formatSeconds(icon.staytime),
                font: "14px font-size",
                textAlign: "left",
                fill: new Fill({
                  color: "green",
                }),
                offsetY: 25, //文字偏移量
                offsetX: -30, //文字偏移量
              }),
            });
          } else {
            // 未完成巡检
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/beacon_sos.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: info.alias,
                font: "14px font-size",
                fill: new Fill({
                  color: "red",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          }
        } else {
          style = new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 1],
              src: that.iconSrc,
              scale: 1,
            }),
            //设置图片下面显示的字体样式和内容
            text: new Text({
              text: info.alias,
              font: "14px font-size",
              fill: new Fill({
                color: "blue",
              }),
              offsetY: 10, //文字偏移量
            }),
          });
        }
      } else if (this.intoProjectType == 2) {
        if (info.inspection) {
          if (that.inspectionInfodetails.includes(info.deveui)) {
            let icon;
            // that.taskHisInfoData.forEach((item) => {
            //   if (item.beaconid == info.beaconid) {
            //     icon = item;
            //   }
            // });
            that.taskInfoTimeList.forEach((item) => {
              if (item.deveui == info.deveui) {
                icon = item;
              }
            });
            // 完成巡检
            // 已设置信标用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/gateway_green.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text:
                  info.alias +
                  `\n` +
                  that.$t("inspection.start") +
                  "：" +
                  that.formatDatetime(icon.begintime) +
                  `\n` +
                  that.$t("inspection.stay") +
                  "：" +
                  that.formatSeconds(icon.staytime),
                font: "12px font-size",
                fill: new Fill({
                  color: "red",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          } else {
            // 未完成巡检
            // 已设置信标用另一种图标表示
            style = new OlStyleStyle({
              image: new OlStyleIcon({
                anchor: [0.5, 1],
                src: "../../../static/gateway_sos.png",
                scale: 1,
              }),
              //设置图片下面显示的字体样式和内容
              text: new Text({
                text: info.alias,
                font: "12px font-size",
                fill: new Fill({
                  color: "red",
                }),
                offsetY: 10, //文字偏移量
              }),
            });
          }
        } else {
          style = new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 1],
              src: that.iconSrc,
              scale: 1,
            }),
            //设置图片下面显示的字体样式和内容
            text: new Text({
              text: info.alias,
              font: "14px font-size",
              fill: new Fill({
                color: "blue",
              }),
              offsetY: 10, //文字偏移量
            }),
          });
        }
      }

      var vectorLayer = new OlLayerVector({
        source: source,
        style: style,
      });
      map.addLayer(vectorLayer);
    },

    //在地图上单击
    mapClick() {
      var that = this;
      this.map.on("click", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );
        if (feature) {
          if (!feature.values_.inspection) {
            that.inspectionDetails.push(feature.values_.deveui);
            if (that.intoProjectType == 1) {
              feature.setStyle(
                new OlStyleStyle({
                  image: new OlStyleIcon({
                    anchor: [0.5, 1],
                    src: "../../../static/beacon_sos.png",
                    scale: 1,
                  }),
                  // 设置图片下面显示字体的样式和内容
                  text: new Text({
                    text: feature.values_.alias, // 添加文字描述
                    font: "12px font-size", // 设置字体大小
                    fill: new Fill({
                      // 设置字体颜色
                      color: "red",
                    }),
                    offsetY: 10, // 设置文字偏移量
                  }),
                })
              );
            } else if (that.intoProjectType == 2) {
              feature.setStyle(
                new OlStyleStyle({
                  image: new OlStyleIcon({
                    anchor: [0.5, 1],
                    src: "../../../static/gateway_sos.png",
                    scale: 1,
                  }),
                  // 设置图片下面显示字体的样式和内容
                  text: new Text({
                    text: feature.values_.alias, // 添加文字描述
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

            feature.values_.inspection = true;
          } else {
            that.inspectionDetails.splice(
              that.inspectionDetails.indexOf(feature.values_.deveui),
              1
            );

            feature.setStyle(
              new OlStyleStyle({
                image: new OlStyleIcon({
                  anchor: [0.5, 1],
                  src: that.iconSrc,
                  scale: 1,
                }),
                // 设置图片下面显示字体的样式和内容
                text: new Text({
                  text: feature.values_.alias, // 添加文字描述
                  font: "14px font-size", // 设置字体大小
                  fill: new Fill({
                    // 设置字体颜色
                    color: "blue",
                  }),
                  offsetY: 10, // 设置文字偏移量
                }),
              })
            );

            feature.values_.inspection = false;
          }
        }
      });
    },

    //确认设置巡检任务详情
    updateTaskManagementDetailsTrue() {
      var that = this;
      if (this.isactive) {
        let data = {
          details: that.inspectionDetails.toString(),
          name: that.inspectionName,
          id: that.inspectionId,
        };
        updateTaskManagementDetails(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("inspection.Savedsuccessfully"),
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

    //获取页面所有图标
    getAllFeatures() {
      var that = this;
      if (this.map) {
        let LayerArrays = that.map.getLayers().getArray();
        that.featureArrs = [];
        let info;
        if (that.$store.state.intoProjectType == 1) {
          for (let i = 1; i < LayerArrays.length; i++) {
            if (
              LayerArrays[i].getSource().getFeatures()[0].values_.inspection
            ) {
              info = LayerArrays[i].getSource().getFeatures()[0].values_.deveui;
              that.featureArrs.push(info);
            }
          }
        } else if (that.$store.state.intoProjectType == 2) {
          for (let i = 1; i < LayerArrays.length; i++) {
            if (
              LayerArrays[i].getSource().getFeatures()[0].values_.inspection
            ) {
              info = LayerArrays[i].getSource().getFeatures()[0].values_.deveui;
              that.featureArrs.push(info);
            }
          }
        }
      }
    },

    // 设置巡检详情返回
    inspectioncancel() {
      this.setInspectionMap = false;
    },

    //关闭设置巡检详情关闭回调
    closeInspection() {
      this.showInspection = false;
      this.getTaskManagementLists();
      if (this.map3d) {
        this.map3d.dispose();
        this.map3d = null;
      }
    },
    //是否禁用启动、终止按钮
    showButton(row) {
      const currentTime = new Date(); //当前时间
      let time = row.enddate + " " + row.endtime;
      let customTime = time.replace("-", "/");
      customTime = new Date(Date.parse(customTime)); //巡检任务结束时间
      if (currentTime > customTime) {
        return true;
      } else {
        return false;
      }
    },
    //巡检任务详情
    openDetail(index) {
      var that = this;
      if (this.tableData[index].details) {
        this.inspectionDetailsArr = this.tableData[index].details.split(",");
        this.inspectionDetails = this.tableData[index].details.split(",");
      } else {
        that.$message({
          message: this.$t("inspection.Nodatasettings"),
          type: "warning",
        });
        return;
      }
      this.inspectionName = this.tableData[index].name;
      this.inspectionId = this.tableData[index].id;
      if (this.$store.state.intoProjectType == 1) {
        let data = {
          beaconids: that.tableData[index].details,
        };
        getBeaconByBeaconids(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (res.data.length > 0) {
              that.showInspectionData = res.data;
              that.showInspection = true;
            } else {
              that.$message({
                message: that.$t("inspection.Nodatasettings"),
                type: "warning",
              });
            }
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      } else if (this.$store.state.intoProjectType == 2) {
        let data = {
          deveuis: that.tableData[index].details,
        };
        getDevByEuiList(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.showInspectionData = res.data;
            that.showInspection = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },

    // 查看任务详情信标点所在地图的位置
    goShowInspection(index) {
      this.setInspectionMap = true;
      this.getBuildings(
        this.showInspectionData[index].buildid,
        this.showInspectionData[index].ground
      );
    },

    // goShowInspection3D(index) {
    //   this.setInspectionMap3D = true;
    //   this.getBuildings(
    //     this.showInspectionData[index].buildid,
    //     this.showInspectionData[index].ground
    //   );
    // },
    //删除任务详情中的选中信标
    delShowInspection(index) {
      var that = this;
      this.$confirm(
        this.$t("warning.permissiondelete1"),
        this.$t("change.tip"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        if (that.$store.state.intoProjectType == 1) {
          that.inspectionDetailsArr.splice(
            that.inspectionDetailsArr.indexOf(
              that.showInspectionData[index].beaconid
            ),
            1
          );
        } else if (that.$store.state.intoProjectType == 2) {
          that.inspectionDetailsArr.splice(
            that.inspectionDetailsArr.indexOf(
              that.showInspectionData[index].deveui
            ),
            1
          );
        }
        let data = {
          details: that.inspectionDetailsArr.toString(),
          name: that.inspectionName,
          id: that.inspectionId,
        };
        updateTaskManagementDetails(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.showInspectionData.splice(index, 1);
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

    //添加巡检任务
    addInspection() {
      this.totleDate = "";
      this.totleTime = "";
      this.addData = {
        name: "",
        projectid: this.$store.state.projectid,
        repetition: "",
        daily: "",
        begindate: "",
        enddate: "",
        begintime: "",
        endtime: "",
        memo: "",
        timezone: (0 - new Date().getTimezoneOffset() / 60) * 3600,
      };
      this.add = true;
    },
    showDetal() {
      let that = this;
      if (this.addData.repetition == 1) {
        let _minTime = null;
        let _maxTime = null;
        that.above_now = {
          onPick(time) {
            //此处的time为选择日期时的结果，time为一个对象，有两个值，一个是maxDate,一个是minDate,详细见下图，
            //以下判断是只选择了一个值的时候，也就是默认的开始值。
            if (!time.maxDate && time.minDate) {
              //时间跨度为1天，1天转化成毫秒就是   24 * 3600 * 1000
              // let timeRange = 1 * 24 * 60 * 60 * 1000;
              //最小值为选择的日期-跨度值
              _minTime = time.minDate.getTime();
              // _minTime = time.minDate.getTime() - timeRange;
              //最大值为选择的日期+跨度值
              _maxTime = time.minDate.getTime();
              // _maxTime = time.minDate.getTime() + timeRange;
            } else if (time.maxDate && time.minDate) {
              //如果两个值都已经选择了，也就是已经选择完成，则将最大值和最小值设置为null
              _minTime = _maxTime = null;
            }
          },
          disabledDate(time) {
            //当已经选择了两个日期时
            if (_minTime && _maxTime) {
              //如果已经选择了两个日期，则小于最小值和大于最大值的都要禁用
              return time.getTime() < _minTime || time.getTime() > _maxTime;
            } else {
              //如果没有选择两个值，即选择了一个或者什么都没有选择的初始状态，禁用的日期是当前日期之前的日期
              return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000;
            }
          },
        };
      } else {
        this.above_now = {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        };
      }
      if (this.addData.repetition == 3) {
        // 当前选择为月份   dataDetal为月份
        this.addData.daily = "";
        this.dailyList = this.dailyDays;
      }
      if (this.addData.repetition == 4) {
        // 当前为周   dataDetal 为周  详情是周
        this.addData.daily = "";
        this.dailyList = this.dailyWeeks;
      }
    },
    showDetalEdit() {
      let that = this;
      if (this.editData.repetition == 1) {
        let _minTime = null;
        let _maxTime = null;
        that.above_now = {
          onPick(time) {
            //此处的time为选择日期时的结果，time为一个对象，有两个值，一个是maxDate,一个是minDate,详细见下图，
            //以下判断是只选择了一个值的时候，也就是默认的开始值。
            if (!time.maxDate && time.minDate) {
              //时间跨度为1天，1天转化成毫秒就是   24 * 3600 * 1000
              // let timeRange = 1 * 24 * 60 * 60 * 1000;
              //最小值为选择的日期-跨度值
              _minTime = time.minDate.getTime();
              // _minTime = time.minDate.getTime() - timeRange;
              //最大值为选择的日期+跨度值
              _maxTime = time.minDate.getTime();
              // _maxTime = time.minDate.getTime() + timeRange;
            } else if (time.maxDate && time.minDate) {
              //如果两个值都已经选择了，也就是已经选择完成，则将最大值和最小值设置为null
              _minTime = _maxTime = null;
            }
          },
          disabledDate(time) {
            //当已经选择了两个日期时
            if (_minTime && _maxTime) {
              //如果已经选择了两个日期，则小于最小值和大于最大值的都要禁用
              return time.getTime() < _minTime || time.getTime() > _maxTime;
            } else {
              //如果没有选择两个值，即选择了一个或者什么都没有选择的初始状态，禁用的日期是当前日期之前的日期
              return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000;
            }
          },
        };
      } else {
        this.above_now = {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        };
      }
      if (this.editData.repetition == 3) {
        // 当前选择为月份   dataDetal为月份
        this.editData.daily = "";
        this.dailyList = this.dailyDays;
      }
      if (this.editData.repetition == 4) {
        // 当前为周   dataDetal 为周  详情是周
        this.editData.daily = "";
        this.dailyList = this.dailyWeeks;
      }
    },
    openDialog(addData) {
      this.$refs[addData].resetFields();
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      if (this.addData.repetition == 4 || this.addData.repetition == 3) {
        if (!this.addData.daily[0]) {
          this.$message({
            message: this.$t("inspection.duplicatedate"),
            type: "warning",
          });
          return;
        }
      }
      if (this.totleTime || this.totleDate) {
        this.addData.begintime = this.totleTime[0];
        this.addData.endtime = this.totleTime[1];
        this.addData.begindate = this.totleDate[0];
        this.addData.enddate = this.totleDate[1];
        if (this.addData.daily) {
          this.addData.daily = this.addData.daily
            .sort(function (a, b) {
              return a - b;
            })
            .toString();
        }
        // this.addData.daily = this.addData.daily.toString();
      } else {
        this.$message({
          message: this.$t("inspection.timeperiod"),
          type: "warning",
        });
        return;
      }
      this.$refs[addData].validate((valid) => {
        if (valid) {
          that.loading = true;
          that.addData.timezone =
            (0 - new Date().getTimezoneOffset() / 60) * 3600;
          insertTaskManagement(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getTaskManagementLists();
              that.$message({
                message: that.$t("beacon.addsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs[addData].resetFields();
            }
          });
        }
      });
    },
    //编辑任务信息
    editTask(index) {
      this.editData.id = this.tableData[index].id;
      this.editData.name = this.tableData[index].name;
      this.editData.repetition = this.tableData[index].repetition;
      this.showDetalEdit();
      this.editData.daily = this.tableData[index].daily.split(",").map(Number);
      this.totleDate = [
        this.tableData[index].begindate,
        this.tableData[index].enddate,
      ];
      this.totleTime = [
        this.tableData[index].begintime,
        this.tableData[index].endtime,
      ];
      this.editData.memo = this.tableData[index].memo;
      this.edit = true;
    },
    editCancel() {
      this.edit = false;
      this.$refs.editData.resetFields();
    },
    editTaskTrue() {
      let that = this;
      if (this.editData.repetition == 4 || this.editData.repetition == 3) {
        if (!this.editData.daily[0]) {
          this.$message({
            message: this.$t("inspection.duplicatedate"),
            type: "warning",
          });
          return;
        }
      }
      if (this.totleTime || this.totleDate) {
        this.editData.begintime = this.totleTime[0];
        this.editData.endtime = this.totleTime[1];
        this.editData.begindate = this.totleDate[0];
        this.editData.enddate = this.totleDate[1];
        if (this.editData.repetition == 4 || this.editData.repetition == 3) {
          this.editData.daily = this.editData.daily
            .sort(function (a, b) {
              return a - b;
            })
            .toString();
        } else {
          this.editData.daily = "";
        }
        // this.editData.daily = this.editData.daily.toString();
      } else {
        this.$message({
          message: this.$t("inspection.timeperiod"),
          type: "warning",
        });
        return;
      }

      this.$refs.editData.validate((valid) => {
        if (valid) {
          updateTaskManagement(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.getTaskManagementLists();

              that.$message({
                message: that.$t("buildingmanagement.editsuccess"),
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
    //执行任务
    onTask(index, val) {
      let that = this;
      let data = {
        id: this.tableData[index].id,
        name: this.tableData[index].name,
        details: this.tableData[index].details,
        states: val,
      };
      updateTaskManagementStats(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.getTaskManagementLists();
          that.$message({
            message: that.$t("buildingmanagement.editsuccess"),
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
    //查询巡检任务
    searchInfo() {
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.tasktime && this.tasktime.length > 0) {
        this.searchList.begintime =
          Date.parse(new Date(this.tasktime[0])) / 1000;
        this.searchList.endtime = Date.parse(new Date(this.tasktime[1])) / 1000;
      } else {
        this.searchList.begintime = "";
        this.searchList.endtime = "";
      }
      getTaskManagementList(
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
              message: that.$t("buildingmanagement.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("buildingmanagement.nodata"),
              type: "warning",
            });
          }
        }
      });
    },

    //查询巡检历史
    searchInfoHis() {
      var that = this;
      if (this.taskData) {
        that.begindate = that.taskData[0];
        that.enddate = that.taskData[1];
      } else {
        that.begindate = "";
        that.enddate = "";
      }

      // this.searchListHis.begindate = this.begindate;
      // this.searchListHis.enddate = this.enddate;
      that.searchListHis.page = 1;
      getTaskInfoList(
        this.searchListHis,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableDataHis = res.data.list;
          that.total = res.data.size;
          if (res.data.size > 0) {
            that.$message({
              message: that.$t("buildingmanagement.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("buildingmanagement.nodata"),
              type: "warning",
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

    //分页
    //巡检任务
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getTaskManagementLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getTaskManagementLists();
    },

    //巡检历史
    handleCurrentChangeHis(val) {
      this.searchListHis.page = val;
      this.searchListHis.count = this.pageCountHis;
      this.getTaskInfoLists();
    },
    handleSizeChangeHis(val1) {
      this.pageCountHis = val1;
      this.searchListHis.count = val1;
      this.searchListHis.page = 1;
      this.currentPage1 = 1;
      this.getTaskInfoLists();
    },

    //获取巡检任务信息
    getTaskManagementLists() {
      var that = this;
      getTaskManagementList(
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

    //获取巡检历史信息
    getTaskInfoLists() {
      var that = this;
      getTaskInfoList(
        this.searchListHis,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableDataHis = res.data.list;
          that.total = res.data.size;
        }
      });
    },

    //刷新，巡检任务
    clearBtn() {
      this.searchList = {
        projectid: this.$store.state.projectid,
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
        states: "",
      };
      this.currentPage1 = 1;
      this.pageCount = 20;
      this.tasktime = [];

      this.getTaskManagementLists();
    },
    //刷新，巡检历史
    clearBtnHis() {
      this.searchListHis = {
        userid: "",
        taskid: "",
        projectid: this.$store.state.projectid,
        taskdate: "",
        taskstatus: "",
        begintaskstatus: "",
        endtaskstatus: "",
        page: 1,
        count: 20,
      };
      this.currentPage1 = 1;
      this.pageCountHis = 20;
      this.taskData = [
        // new Date().getTime() - (1 * 60 * 60 * 1000 * 24 - 1),
        // new Date(),
      ];
      this.getTaskInfoLists();
    },
    //删除巡检任务
    delTask(index) {
      var that = this;
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
      this.$confirm(
        this.$t("beacon.deletemsg1") +
          this.tableData[index].name +
          this.$t("beacon.Pinspectiontask"),
        this.$t("beacon.prompt"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let data;
          data = {
            name: this.tableData[index].name,
            id: this.tableData[index].id,
          };
          delTaskManagement(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              // that.searchList.page = 1;
              // that.currentPage1 = 1;
              that.getTaskManagementLists();
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
        })
        .catch(() => {});
    },
    //分配任务
    updateTask(index) {
      var that = this;
      this.getMemberNameIds();
      this.updateData = {
        id: "",
        userids: "",
      };
      that.userid = [];
      if (this.tableData[index].states == 3) {
        this.$message({
          message: this.$t("inspection.Terminationssigned"),
          type: "warning",
        });
        return;
      }
      if (!this.tableData[index].details) {
        this.$message({
          message: this.$t("inspection.routeassigned"),
          type: "warning",
        });
        return;
      }
      let useridsArr = [];

      if (this.tableData[index].userids) {
        let userids = this.tableData[index].userids.split(",");
        userids.forEach((item) => {
          that.memberList.forEach(
            (value) => item == value.id && useridsArr.push(value)
          );
        });
      } else {
        this.userid = [];
      }
      if (useridsArr.length > 0) {
        useridsArr.forEach((item) => {
          that.userid.push(item.username);
        });
      }
      this.updateData.name = this.tableData[index].name;
      this.updateData.id = this.tableData[index].id;
      this.update = true;
    },
    updateTaskTrue() {
      let that = this;
      let userNameArr = [];
      that.userid.forEach((item) => {
        that.memberList.forEach(
          (value) => item == value.username && userNameArr.push(value)
        );
      });
      for (let i = 0; i < userNameArr.length; i++) {
        that.updateData.userids += userNameArr[i].id + ",";
      }
      that.updateData.userids = that.updateData.userids.slice(
        0,
        that.updateData.userids.length - 1
      );
      let data = {
        id: this.updateData.id,
        userids: this.updateData.userids,
      };
      updateTaskManagementUsers(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.searchList.page = 1;
          that.getTaskManagementLists();
          that.$message({
            message: that.$t("beacon.editsuccess"),
            type: "success",
          });
          that.loading = false;
          that.update = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
          that.loading = false;
        }
      });
    },
    // 查看巡检任务分配人员
    showInspectionPer(index) {
      var that = this;
      if (this.tableData[index].userids == null) {
        this.$message({
          message: this.$t("beacon.assignfirst"),
          type: "warning",
        });
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".action"),
      });
      setTimeout(() => {
        let data = {
          ids: this.tableData[index].userids,
        };
        getMemberByIds(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.userDetails = res.data;
            that.showUser = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
          loading.close();
        });
      }, 500);
    },
    //关闭行为回调
    closeAction() {
      this.userDetails = "";
    },
    // 表格单选事件
    handleCurrentChangeIns(val) {
      this.currentRow = val;
    },
    handleRowClick(row, column, event) {
      this.$refs.multipleTableHis.toggleRowSelection(row);
    },
    // 表格多选事件
    handleSelectionChangeHis(val) {
      this.multipleSelection = val;
      this.currentRowHis = val[0];
    },
    //批量删除巡检历史
    delTaskListHis() {
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
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("downlink.deletedownlink1"),
          type: "warning",
        });
        return;
      }
      this.deleteData = this.multipleSelection;
      this.delHis = true;
    },
    deleteTrueHis() {
      var that = this;
      let data = {
        ids: [],
      };
      for (let i = 0; i < this.deleteData.length; i++) {
        data.ids.push(this.deleteData[i].id);
      }
      this.loading = true;
      delTaskInfo(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.delHis = false;
            that.searchListHis.page = 1;
            that.currentPage1 = 1;
            that.getTaskInfoLists();
            that.$message({
              message: that.$t("downlink.deletesuccess"),
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
        }
      );
    },
    // 巡检历史页面查看巡检详情
    taskListHisInfo() {
      var that = this;
      if (this.multipleSelection.length > 1) {
        that.$message({
          message: that.$t("inspection.tasktoview"),
          type: "warning",
        });
        return;
      }
      if (this.currentRowHis) {
        if (
          this.currentRowHis.taskstatus == 3 ||
          this.currentRowHis.taskstatus == 4
        ) {
          this.inspectionDetails = [];
          this.inspectionInfodetails = [];
          this.isactive = "";
          this.buildingList = [];
          this.groundListHis = [];
          this.buildingListHis = [];

          this.grounds = "";
          if (this.map) {
            this.map.setTarget("nnnnnn");
            this.map = null;
          }
          if (this.map3d) {
            this.map3d.dispose();
            this.map3d = null;
          }
          this.inspectionName = this.currentRowHis.name;
          this.inspectionId = this.currentRowHis.id;
          if (this.currentRowHis.details) {
            that.inspectionDetails = that.currentRowHis.details.split(",");
          }
          if (this.currentRowHis.infodetails) {
            that.inspectionInfodetails =
              that.currentRowHis.infodetails.split(",");
          }
          getTaskInfoTimeList(
            { taskinfoid: that.currentRowHis.id },
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.taskInfoTimeList = res.data;
            }
            let data = {
              projectid: that.$store.state.intoProjectid,
            };
            getBuildingByProjectid(
              data,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                // 获取所有楼栋
                that.buildingList = res.data;
                if (that.$store.state.intoProjectType == 1) {
                  let data = {
                    beaconids: that.currentRowHis.details,
                  };
                  getBeaconByBeaconids(
                    data,
                    that.tenantkey_A,
                    that.tenantid_A,
                    that.userName
                  ).then((res) => {
                    if (res.code == 1001) {
                      if (res.data.length > 0) {
                        that.taskHisInfoData = res.data;
                        let arrData = res.data;
                        for (let i = 0; i < arrData.length; i++) {
                          if (
                            arrData[i].buildid == "" ||
                            arrData[i].buildid == null
                          ) {
                            arrData.splice(i, 1);
                          }
                        }
                        let hash = {};
                        // 获取数据中存在的楼栋
                        arrData = arrData.reduce((item, next) => {
                          hash[next.buildid]
                            ? ""
                            : (hash[next.buildid] = true && item.push(next));
                          return item;
                        }, []);
                        that.buildingListHis = arrData;
                        that.getGroundsHis(that.buildingListHis[0].buildid);
                      } else {
                        that.$message({
                          message: that.$t("buildingmanagement.nodata"),
                          type: "warning",
                        });
                      }
                    } else {
                      that.$message({
                        message:
                          that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                        type: "error",
                      });
                    }
                  });
                } else if (this.$store.state.intoProjectType == 2) {
                  let data = {
                    deveuis: that.currentRowHis.details,
                  };
                  getDevByEuiList(
                    data,
                    that.tenantkey_A,
                    that.tenantid_A,
                    that.userName
                  ).then((res) => {
                    if (res.code == 1001) {
                      if (res.data.length > 0) {
                        that.taskHisInfoData = res.data;
                        let arrData = res.data;
                        let hash = {};
                        // 获取数据中存在的楼栋
                        arrData = arrData.reduce((item, next) => {
                          hash[next.buildid]
                            ? ""
                            : (hash[next.buildid] = true && item.push(next));
                          return item;
                        }, []);
                        that.buildingListHis = arrData;
                        that.getGroundsHis(arrData[0].buildid);
                      } else {
                        that.$message({
                          message: that.$t("buildingmanagement.nodata"),
                          type: "warning",
                        });
                      }
                    } else {
                      that.$message({
                        message:
                          that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                        type: "error",
                      });
                    }
                  });
                }

                this.taskHisInfo = true;
              } else {
                that.$message({
                  message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                  type: "error",
                });
              }
            });
          });
        } else {
          that.$message({
            message: this.$t("inspection.uncompletedpatrol"),
            type: "warning",
          });
        }
      } else {
        that.$message({
          message: that.$t("inspection.tasktoview"),
          type: "warning",
        });
      }
    },

    //关闭巡检历史页面巡检详情关闭回调
    closeTaskInfoHis() {
      this.taskHisInfo = false;
      this.getTaskInfoLists();
      if (this.map3d) {
        this.map3d.dispose();
        this.map3d = null;
      }
    },
    closeTaskInfoHisCancle() {
      this.taskHisInfo = false;
    },

    getMemberNameIds() {
      var that = this;
      let data = {
        projectid: this.$store.state.projectid, //项目编号
        inallot: 2,
      };
      getMemberNameId(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.memberList = res.data;
        }
      });
    },
    //获取任务下拉框
    getTaskNameIds() {
      let data = {
        projectid: this.$store.state.projectid,
      };
      getTaskNameId(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.taskList = res.data;
        }
      });
    },
    //部门下拉框
    getDepart() {
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      getDepartmentType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.departList = res.data;
        }
      });
    },

    // 获取巡检人员下拉框
    getMemberLists2() {
      var that = this;
      let data = {
        username: "",
        sex: "",
        cardno: "",
        worktype: "",
        tenantid: this.$store.state.userInfo.tenantid,
        projectid: this.$store.state.projectid,
        depart: "",
        maplabel: "",
        inallot: "",
        taskid: "",
        page: "",
        count: "",
      };

      getMemberList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.nameList = res.data.list;
        }
      });
    },
  },

  beforeMount() {
    this.getTaskManagementLists();
    this.getMemberNameIds();
    if (this.$store.state.intoProjectType == 1) {
      this.iconSrc = "../../../static/beacon.png";
    } else if (this.$store.state.intoProjectType == 2) {
      this.iconSrc = "../../../static/gateway.png";
    }
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;

      Object.assign(
        this.$data.repetitionList,
        this.$options.data.call(this).repetitionList
      );
      Object.assign(
        this.$data.statusList,
        this.$options.data.call(this).statusList
      );
      Object.assign(
        this.$data.statusHisList,
        this.$options.data.call(this).statusHisList
      );
      Object.assign(
        this.$data.pickerOptions,
        this.$options.data.call(this).pickerOptions
      );
      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
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

.el-message {
  display: -webkit-box !important;
}
.icon_button {
  padding: 2px 16px !important;
}
.selects button {
  width: 100%;
  text-align: left;
}
/* 改变按钮颜色 */
.dels:hover {
  background-color: rgb(196, 27, 27);
  color: white;
}
.edits:hover {
  background-color: rgb(25, 86, 201);
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
.el-table .not-conducted {
  background: rgba(255, 215, 0, 1);
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.el-table >>> .taskstatustr {
  display: flex;
  text-align: left;
}
.el-table .underway {
  background: rgba(30, 144, 255, 1);
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.el-table >>> .finished {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 255, 0, 1);
}
.el-table >>> .unfinished {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 1);
}

.querry,
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
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-input__icon {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item .el-range-separator {
  height: 34px;
  line-height: 34px;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}

.addInspection >>> .el-range-separator {
  width: auto !important;
  padding: 0 !important;
}
>>> .el-date-editor .el-range-separator {
  padding: 0 !important;
}
/* >>> .el-tabs__nav-wrap::after {
  width: 0; } */
>>> .el-tabs__header.is-top {
  margin-bottom: 26px;
  margin-left: 30px;
}
>>> .el-table__fixed-right {
  height: 100% !important;
}
.el-button + .el-button {
  margin-left: 0;
}

.mapConent {
  position: absolute;
  margin-top: 2%;
  left: 10%;
  display: flex;
  justify-content: flex-start;
  width: 80%;
  height: 80%;
}
.allmap {
  background-color: white;
}
.allmapHis {
  background-color: white;
}

.selectGround >>> .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.selectGround {
  margin-left: 20px;
}
.groundControl {
  position: absolute;
  right: 5%;
  bottom: 2%;
}
.groundControl3D {
  position: absolute;
  right: 0;
  bottom: 0;
}
.fm-control-groups {
  /* transform: translateX(-80px); */
}
.addclass span {
  /* background-color: #409eff !important; */
  color: #409eff;
  transition: all 0.3s;
}

.mapConentD {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 2%;
}
#fengMap {
  width: 80%;
  height: 80%;
  display: flex;
  position: absolute;
}
#fengMapHis {
  width: 80%;
  height: 80%;
  display: flex;
  position: absolute;
}

.backImg {
  height: 30px;
  width: 52px;
  margin-left: 0;
  margin-right: 0;
  cursor: pointer;
}
.setInspection {
  background-color: #f1f5f7 !important;
}
.setInspection >>> .el-dialog {
  background-color: #f1f5f7 !important;
}

.setInspection >>> .el-dialog__header {
  display: none;
}
.setInspection >>> .el-dialog__body {
  width: 100%;
  height: 100%;
}
#floors {
  position: absolute;
}
</style>
