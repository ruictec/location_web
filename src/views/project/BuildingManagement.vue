<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Project /></el-aside>
        <el-main>
          <div
            class="project_input"
            style="display: flex; justify-content: space-between"
          >
            <el-breadcrumb
              separator="/"
              style="margin-left: 0"
              v-if="contrForPrionum == 3 || contrForPrionum == 4"
            >
              <el-breadcrumb-item :to="{ path: '/projectmanagement' }">{{
                $t("index.projectmanagement")
              }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ intoProjectName }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{
                $t("Breadcrumb.Floormanagement")
              }}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-form
              :model="searchList"
              class="demo-form-inline"
              style="display: flex; white-space: nowrap; margin-left: 2%"
            >
              <el-form-item
                :label="$t('floormanagement.Building')"
                style="display: flex; margin-right: 2%"
              >
                <el-select
                  v-model="searchList.buildid"
                  clearable
                  filterable
                  @change="selectGround"
                  :placeholder="$t('floormanagement.text')"
                >
                  <el-option
                    v-for="item in buildingList"
                    :key="item.id"
                    :label="item.building"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('floormanagement.floor1')"
                style="display: flex; margin-right: 2%"
              >
                <el-select
                  v-model="searchList.ground"
                  clearable
                  filterable
                  :placeholder="$t('floormanagement.text')"
                >
                  <el-option
                    v-for="item in groundList"
                    :key="item.id"
                    :label="item.ground"
                    :value="item.ground"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('floormanagement.Floornumber')"
                style="display: flex; margin-right: 2%"
              >
                <el-input v-model="searchList.groundid"></el-input>
              </el-form-item>
              <el-form-item style="display: flex">
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("floormanagement.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("floormanagement.reset")
                }}</el-button>
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
                <el-button type="primary" class="add" @click="addBuildings()">{{
                  $t("floormanagement.Add")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 展示 -->
          <div class="content_project">
            <div class="exportContent" style="display: flex">
              <input
                id="articleNearFile"
                name="excelFile"
                type="file"
                class="x_file"
                accept=".xls,.xlsx"
                @change="importExcelsNear"
              />
              <input
                id="articlePointFile"
                name="excelFile"
                type="file"
                class="x_file"
                accept=".xls,.xlsx"
                @change="importExcelsPoint"
              />
              <input
                id="articleAreaFile"
                name="excelFile"
                type="file"
                class="x_file"
                accept=".xls,.xlsx"
                @change="importExcelsArea"
              />
              <input
                id="articleImage"
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
              style="
                width: 98%;
                text-align: center;
                margin-left: 2%;
                z-index: 1;
              "
              max-height="660"
              border
              highlight-current-row
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                property="building"
                :label="$t('floormanagement.building')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>

              <el-table-column
                property="ground"
                :label="$t('floormanagement.floor')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.floor")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("floormanagement.text1") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="name"
                :label="$t('floormanagement.floorName')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="id"
                show-overflow-tooltip
                min-width="77"
                align="center"
                ><template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.floornumber")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("floormanagement.text2") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>

              <el-table-column
                property="mapname"
                :label="$t('floormanagement.mapname')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.mapname")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("floormanagement.text3") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <!-- 正向项目 -->
              <el-table-column
                property="nums"
                :label="$t('floormanagement.EquipmentQuantity')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 1"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.EquipmentQuantity")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("floormanagement.text4") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="bclocknum"
                :label="$t('floormanagement.Numberofpunchpoints')"
                show-overflow-tooltip
                min-width="80"
                align="center"
                v-if="intoProjectType == 1"
                ><template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.Numberofpunchpoints")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("floormanagement.text5") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="balarmnum"
                :label="$t('floormanagement.Numberofalarmdevices')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 1"
                ><template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.Numberofalarmdevices")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("floormanagement.text6") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <!-- 反向项目 -->
              <el-table-column
                property="gwnum"
                :label="$t('floormanagement.EquipmentQuantity')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 2"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.EquipmentQuantity")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("floormanagement.text4") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="gwclocknum"
                :label="$t('floormanagement.Numberofpunchpoints')"
                show-overflow-tooltip
                min-width="80"
                align="center"
                v-if="intoProjectType == 2"
                ><template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.Numberofpunchpoints")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("floormanagement.text5") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="gwalarmnum"
                :label="$t('floormanagement.Numberofalarmdevices')"
                show-overflow-tooltip
                min-width="77"
                align="center"
                v-if="intoProjectType == 2"
                ><template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("floormanagement.Numberofalarmdevices")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("floormanagement.text6") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('floormanagement.Remark')"
                show-overflow-tooltip
                min-width="110"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('floormanagement.operate')"
                min-width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('floormanagement.operate')"
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
                          class="editss"
                          @click="projectEdit(scope.$index, tableData)"
                          >{{ $t("floormanagement.edit") }}</el-button
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
                          @click="projectDele(scope.$index)"
                          >{{ $t("floormanagement.delete") }}</el-button
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
                          class="editss"
                          @click="sendDevOtherAlarmMores('yes', scope.$index)"
                          >{{ $t("otherDev.triggerAlarm") }}</el-button
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
                          class="editss"
                          @click="sendDevOtherAlarmMores('no', scope.$index)"
                          >{{ $t("otherDev.cancelAlarm") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('floormanagement.arrangement')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      class="icon_button"
                      :disabled="dobuleClick"
                      @click="arrangeMap(scope.$index, scope)"
                    >
                      <img src="../../../static/arrangement.png"
                    /></el-button>
                  </el-tooltip>

                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('terminal.export')"
                      placement="top"
                    >
                      <el-button
                        type="primary"
                        class="icon_button icon-control"
                      >
                        <i class="el-icon-download download"></i>
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
                          class="editss"
                          @click="exportExcelArea(scope.$index)"
                          >{{ $t("terminal.exportArea") }}</el-button
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
                          class="editss"
                          @click="exportExcelPoint(scope.$index)"
                          >{{ $t("floormanagement.Point") }}</el-button
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
                          class="editss"
                          @click="exportExcelNear(scope.$index)"
                          >{{ $t("floormanagement.Near") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('terminal.import')"
                      placement="top"
                    >
                      <el-button
                        type="primary"
                        class="icon_button icon-control"
                      >
                        <i class="el-icon-upload2 upload"></i>
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
                          class="editss"
                          @click="importExcelArea()"
                          >{{ $t("terminal.importArea") }}</el-button
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
                          class="editss"
                          @click="importExcelPoint()"
                          >{{ $t("floormanagement.Point") }}</el-button
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
                          class="editss"
                          @click="importExcelNear()"
                          >{{ $t("floormanagement.Near") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
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
                :page-size="pageCount"
              >
              </el-pagination>
            </div>
          </div>
          <!-- 添加建筑信息 -->
          <el-dialog
            :title="$t('floormanagement.text7')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="100px"
              ref="addData"
              :rules="addRules"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('floormanagement.Building')"
                prop="buildid"
              >
                <el-select
                  v-model="addData.buildid"
                  :placeholder="$t('floormanagement.text8')"
                  clearable
                  filterable
                  @change="checkMapType"
                >
                  <el-option
                    v-for="item in buildingList"
                    :key="item.id"
                    :label="item.building"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.floor1')" prop="">
                <el-input
                  v-model="addData_ground"
                  :placeholder="$t('floormanagement.text9')"
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
                      {{ $t("floormanagement.tet") }}<br />
                      {{ $t("floormanagement.tet1") }}<br />
                      {{ $t("floormanagement.tet2") }}<br />
                      {{ $t("floormanagement.tet3") }}<br />
                      {{ $t("floormanagement.tet4") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.Mapname')" prop="mapid">
                <el-select
                  v-model="addData.mapid"
                  :placeholder="$t('floormanagement.text10')"
                  clearable
                  filterable
                  :disabled="chooseMap"
                >
                  <el-option
                    v-for="item in mapList"
                    :key="item.mapid"
                    :label="item.mapname"
                    :value="item.mapid"
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
                    <p>{{ $t("floormanagement.tet5") }}<br /></p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.Remark1')">
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
          <!-- 编辑建筑 -->
          <el-dialog
            :title="$t('floormanagement.text11')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-form
              :model="editData"
              label-width="100px"
              ref="editData"
              :rules="addRules"
              style="text-align: left"
            >
              <el-form-item :label="$t('floormanagement.floor1')" prop="">
                <el-input
                  v-model="editData.ground"
                  :placeholder="$t('floormanagement.text9')"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.floorName1')" prop="">
                <el-input
                  v-model="editData.name"
                  :placeholder="$t('floormanagement.placeholderName')"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('floormanagement.Mapname')"
                prop="mapid"
                v-if="buildtype == 1 || changeMap == true"
              >
                <el-select
                  v-model="editData.mapid"
                  :placeholder="$t('floormanagement.text10')"
                  clearable
                  filterable
                  :disabled="chooseMap"
                >
                  <el-option
                    v-for="item in mapList"
                    :key="item.mapid"
                    :label="item.mapname"
                    :value="item.mapid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.Remark1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(edit = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 删除 -->
          <el-dialog
            :title="$t('floormanagement.text12')"
            :visible.sync="deletes"
            class="edit"
            width="30%"
            style="text-align: center"
          >
            <el-form
              :model="deleteData"
              label-width="100px"
              ref="deleteData"
              style="text-align: left"
            >
              <el-form-item :label="$t('floormanagement.Building')" prop="">
                <el-input v-model="deleteData.building" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.floor1')" prop="">
                <el-input v-model="deleteData.ground" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('floormanagement.Mapname')" prop="">
                <el-input v-model="deleteData.mapname" disabled></el-input>
              </el-form-item>
              <!-- 正向项目 -->
              <el-form-item
                :label="$t('floormanagement.EquipmentQuantity1')"
                prop=""
                v-if="intoProjectType == 1"
              >
                <el-input v-model="deleteData.nums" disabled></el-input>
              </el-form-item>

              <!-- 反向项目 -->
              <el-form-item
                :label="$t('floormanagement.EquipmentQuantity1')"
                prop=""
                v-if="intoProjectType == 2"
              >
                <el-input v-model="deleteData.gwnum" disabled></el-input>
              </el-form-item>

              <el-form-item :label="$t('floormanagement.Remark1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="deleteData.memo"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(deletes = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="delTrue('deleteData')"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>

          <Arrange2dMap
            @change="getMsgFormSon2d"
            ref="arrange2dmap"
            v-if="arrange2d"
          />
          <Arrange3dMap
            @change="getMsgFormSon3d"
            ref="arrange3dmap"
            v-if="arrange3d"
          />
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";
import { groundTest, newGround, rightGround } from "../../grounds/grounds.js";
import {
  getBuildGroundList,
  addBuildGround,
  updateBuildGround,
  delBuildGround,
  getMapInfoList,
  getMapidByBuildid,
  getBuildingByProjectid,
  getGround,
  sendDevOtherAlarmMore,
  getTranche,
  importTranche,
  importBuildGround,
  updateBuildGround3D,
  getPointNearList,
  getPointList,
  importPoint,
  importPointNear,
} from "../../axios/api";

import Arrange2dMap from "./Arrange2dMap.vue";
import Arrange3dMap from "./Arrange3dMap.vue";
export default {
  components: {
    Menu,
    Project,
    basecard,
    Arrange2dMap,
    Arrange3dMap,
  },
  name: "BuildingManagement",
  data() {
    return {
      arrange2d: false,
      arrange3d: false,
      i8n: this.$store.state.i18n,
      maprio: this.$store.state.userInfo.maprio,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      superId: this.$store.state.userInfo.superid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      intoProjectName: this.$store.state.intoProjectName,
      intoProjectid: this.$store.state.intoProjectid,
      intoProjectType: this.$store.state.intoProjectType,
      loading: false,
      tableData: [],

      searchList: {
        projectid: this.$store.state.intoProjectid,
        mapid: "",
        buildid: "",
        ground: "",
        groundid: "",
        page: 1,
        count: 20,
      },

      currentPage1: 1,
      total: 0,
      add: false,
      addData: {
        buildid: "", //楼栋号
        grounds: "", //楼层
        mapid: "", //地图名称
        memo: "", //备注
      },
      fileName: "", //3D地图的地图id
      addData_ground: "",
      addRules: {
        buildid: [
          {
            required: true,
            message: this.$t("floormanagement.message1"),
            trigger: "blur",
          },
        ],
        ground: [
          {
            required: true,
            message: this.$t("floormanagement.message2"),
            trigger: "blur",
          },
        ],
        mapid: [
          {
            required: false,
            message: this.$t("floormanagement.message4"),
            trigger: "change",
          },
        ],
      },
      pageCount: 20,
      editData: {
        buildid: "",
        id: "",
        ground: "",
        mapid: "",
        memo: "",
        name: "",
      },
      changeImg: false, //是否可以更换地图
      edit: false,
      mapList: [], //地图下拉框
      deletes: false,
      deleteData: {},
      buildingList: "",
      groundList: "",
      dobuleClick: false, //判断是否连续点击了布置按钮
      buildtype: 1,
      buildId: "",
      chooseMap: false,
      changeMap: false,
      multipleSelection: [],
      headlistdata: "",
    };
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
      );
    },
  },
  methods: {
    // 导入
    importExcelNear() {
      document.getElementById("articleNearFile").click(); //触发importExcels
    },
    importExcelPoint() {
      document.getElementById("articlePointFile").click(); //触发importExcels
    },
    importExcelArea() {
      document.getElementById("articleAreaFile").click(); //触发importExcels
    },
    importExcel() {
      document.getElementById("articleImage").click(); //触发importExcels
    },

    importExcelsNear(obj) {
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
          importList = that.dateTransitionNear(outdata);
          let data = {
            msg: JSON.stringify(importList),
          };

          importPointNear(
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
              $("#articleNearFile").val("");
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              $("#articleNearFile").val("");
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

    importExcelsPoint(obj) {
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
          importList = that.dateTransitionPoint(outdata);
          let data = {
            msg: JSON.stringify(importList),
          };

          importPoint(
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
              $("#articlePointFile").val("");
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              $("#articlePointFile").val("");
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
    importExcelsArea(obj) {
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
          importList = that.dateTransitionArea(outdata);
          let data = {
            msg: JSON.stringify(importList),
          };

          importTranche(
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
              $("#articleAreaFile").val("");
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              $("#articleAreaFile").val("");
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
          };

          importBuildGround(
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
              $("#articleImage").val("");
              that.getBuildingLists();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              $("#articleImage").val("");
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
    dateTransitionNear(outdata) {
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case "pointid":
              obj["pointid"] = outdata[i][key];
              break;
            case "nearpointid":
              obj["nearpointid"] = outdata[i][key];
              break;
            case "dist":
              obj["dist"] = outdata[i][key];
              break;
            case "groundid":
              obj["groundid"] = outdata[i][key];
              break;

            default:
              break;
          }
        }
        list.push(obj);
      }
      return list;
    },
    dateTransitionPoint(outdata) {
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case "pointid":
              obj["pointid"] = outdata[i][key];
              break;
            case "nodeX":
              obj["nodeX"] = outdata[i][key];
              break;
            case "nodeY":
              obj["nodeY"] = outdata[i][key];
              break;
            case "groundid":
              obj["groundid"] = outdata[i][key];
              break;

            default:
              break;
          }
        }
        list.push(obj);
      }
      return list;
    },
    dateTransitionArea(outdata) {
      var that = this;
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case that.$t("Building.buildid"):
              obj["buildid"] = outdata[i][key];
              break;
            case that.$t("Building.Building1"):
              obj["building"] = outdata[i][key];
              break;
            case that.$t("floormanagement.Regionalshake"):
              obj["fremove"] = outdata[i][key];
              break;
            case that.$t("buildingmanagement.ground"):
              obj["ground"] = outdata[i][key];
              break;
            case that.$t("Building.groundid"):
              obj["groundid"] = outdata[i][key];
              break;
            case that.$t("Building.areaid"):
              obj["id"] = outdata[i][key];
              break;
            case that.$t("Building.areaname"):
              obj["name"] = outdata[i][key];
              break;
            case that.$t("Building.projectid"):
              obj["projectid"] = outdata[i][key];
              break;
            case that.$t("terminal.Positioningbeacon"):
              obj["site"] = outdata[i][key];
              break;
            default:
              break;
          }
        }
        list.push(obj);
      }
      return list;
    },
    dateTransition(outdata) {
      var that = this;
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case that.$t("floormanagement.building"):
              obj["building"] = outdata[i][key];
              break;
            case that.$t("floormanagement.buildingid"):
              obj["buildid"] = outdata[i][key];
              break;
            case that.$t("floormanagement.floor"):
              obj["ground"] = outdata[i][key];
              break;
            case that.$t("floormanagement.floorName"):
              obj["name"] = outdata[i][key];
              break;
            case that.$t("floormanagement.floornumber"):
              obj["id"] = outdata[i][key];
              break;
            case that.$t("floormanagement.mapname"):
              obj["mapname"] = outdata[i][key];
              break;
            case that.$t("floormanagement.EquipmentQuantity"):
              obj["nums"] = outdata[i][key];
              break;
            case that.$t("floormanagement.Numberofpunchpoints"):
              obj["bclocknum"] = outdata[i][key];
              break;
            case that.$t("floormanagement.Numberofalarmdevices"):
              obj["balarmnum"] = outdata[i][key];
              break;
            case that.$t("project.memo"):
              obj["memo"] = outdata[i][key];
              break;
            case that.$t("floormanagement.EquipmentQuantity"):
              obj["gwnum"] = outdata[i][key];
              break;
            case that.$t("floormanagement.Numberofpunchpoints"):
              obj["gwclocknum"] = outdata[i][key];
              break;
            case that.$t("floormanagement.Numberofalarmdevices"):
              obj["gwalarmnum"] = outdata[i][key];
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
          message: that.$t("buildingmanagement.selectGround"),
          type: "warning",
        });
        return;
      }
      this.headlistdata =
        this.intoProjectType == 1
          ? [
              {
                msg: that.$t("floormanagement.building"),
                value: "building",
              },
              {
                msg: that.$t("floormanagement.buildingid"),
                value: "buildid",
              },
              {
                msg: that.$t("floormanagement.floor"),
                value: "ground",
              },
              {
                msg: that.$t("floormanagement.floorName"),
                value: "name",
              },
              {
                msg: that.$t("floormanagement.floornumber"),
                value: "id",
              },
              {
                msg: that.$t("floormanagement.mapname"),
                value: "mapname",
              },
              {
                msg: that.$t("floormanagement.EquipmentQuantity"),
                value: "nums",
              },
              {
                msg: that.$t("floormanagement.Numberofpunchpoints"),
                value: "bclocknum",
              },
              {
                msg: that.$t("floormanagement.Numberofalarmdevices"),
                value: "balarmnum",
              },
              {
                msg: that.$t("project.memo"),
                value: "memo",
              },
            ]
          : [
              {
                msg: that.$t("floormanagement.building"),
                value: "building",
              },
              {
                msg: that.$t("floormanagement.buildingid"),
                value: "buildid",
              },
              {
                msg: that.$t("floormanagement.floor"),
                value: "ground",
              },
              {
                msg: that.$t("floormanagement.floorName"),
                value: "name",
              },
              {
                msg: that.$t("floormanagement.floornumber"),
                value: "id",
              },
              {
                msg: that.$t("floormanagement.mapname"),
                value: "mapname",
              },
              {
                msg: that.$t("floormanagement.EquipmentQuantity"),
                value: "gwnum",
              },
              {
                msg: that.$t("floormanagement.Numberofpunchpoints"),
                value: "gwclocknum",
              },
              {
                msg: that.$t("floormanagement.Numberofalarmdevices"),
                value: "gwalarmnum",
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
      var exprotHeadertype =
        this.intoProjectType == 1
          ? [
              "building",
              "buildid",
              "ground",
              "name",
              "id",
              "mapname",
              "nums",
              "bclocknum",
              "balarmnum",
              "memo",
            ]
          : [
              "building",
              "ground",
              "name",
              "id",
              "mapname",
              "gwnum",
              "gwclocknum",
              "gwalarmnum",
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
        export_json_to_excel(tHeader, data, that.$t("list.Floormanagement"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    exportExcelAll() {
      var that = this;
      this.headlistdata =
        this.intoProjectType == 1
          ? [
              {
                msg: that.$t("floormanagement.building"),
                value: "building",
              },
              {
                msg: that.$t("floormanagement.buildingid"),
                value: "buildid",
              },
              {
                msg: that.$t("floormanagement.floor"),
                value: "ground",
              },
              {
                msg: that.$t("floormanagement.floorName"),
                value: "name",
              },
              {
                msg: that.$t("floormanagement.floornumber"),
                value: "id",
              },
              {
                msg: that.$t("floormanagement.mapname"),
                value: "mapname",
              },
              {
                msg: that.$t("floormanagement.EquipmentQuantity"),
                value: "nums",
              },
              {
                msg: that.$t("floormanagement.Numberofpunchpoints"),
                value: "bclocknum",
              },
              {
                msg: that.$t("floormanagement.Numberofalarmdevices"),
                value: "balarmnum",
              },
              {
                msg: that.$t("project.memo"),
                value: "memo",
              },
            ]
          : [
              {
                msg: that.$t("floormanagement.building"),
                value: "building",
              },
              {
                msg: that.$t("floormanagement.buildingid"),
                value: "buildid",
              },
              {
                msg: that.$t("floormanagement.floor"),
                value: "ground",
              },
              {
                msg: that.$t("floormanagement.floorName"),
                value: "name",
              },
              {
                msg: that.$t("floormanagement.floornumber"),
                value: "id",
              },
              {
                msg: that.$t("floormanagement.mapname"),
                value: "mapname",
              },
              {
                msg: that.$t("floormanagement.EquipmentQuantity"),
                value: "gwnum",
              },
              {
                msg: that.$t("floormanagement.Numberofpunchpoints"),
                value: "gwclocknum",
              },
              {
                msg: that.$t("floormanagement.Numberofalarmdevices"),
                value: "gwalarmnum",
              },

              {
                msg: that.$t("project.memo"),
                value: "memo",
              },
            ];
      let data = {
        projectid: this.$store.state.intoProjectid,
        mapid: "",
        buildid: "",
        ground: "",
        groundid: "",
        page: "",
        count: "",
      };
      getBuildGroundList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          res.data.list.forEach((item) => {
            item.nums = item.bnum + item.onum;
          });
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
    // 导出区域信息
    exportExcelArea(index) {
      var that = this;
      this.headlistdata = [
        {
          msg: that.$t("Building.buildid"),
          value: "buildid",
        },
        {
          msg: that.$t("Building.Building1"),
          value: "building",
        },
        {
          msg: that.$t("floormanagement.Regionalshake"),
          value: "fremove",
        },
        {
          msg: that.$t("buildingmanagement.ground"),
          value: "ground",
        },
        {
          msg: that.$t("Building.groundid"),
          value: "groundid",
        },
        {
          msg: that.$t("Building.areaid"),
          value: "id",
        },
        {
          msg: that.$t("Building.areaname"),
          value: "name",
        },
        {
          msg: that.$t("Building.projectid"),
          value: "projectid",
        },
        {
          msg: that.$t("terminal.Positioningbeacon"),
          value: "site",
        },
      ];
      let data = {
        groundid: this.tableData[index].id,
        projectid: this.$store.state.intoProjectid,
      };
      getTranche(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
        (res) => {
          if (res.code == 1001) {
            if (res.data.length == 0) {
              that.$message({
                message: that.$t("buildingmanagement.nodata"),
                type: "warning",
              });
            } else {
              that.export2Excel1(res.data);
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
    export2Excel1(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = [
        "name",
        "id",
        "site",
        "fremove",
        "projectid",
        "building",
        "buildid",
        "ground",
        "groundid",
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
        export_json_to_excel(tHeader, data, that.$t("Building.areaInfo"));
      });
    },

    // 导出连接点
    exportExcelPoint(index) {
      var that = this;
      this.headlistdata = [
        {
          msg: "pointid",
          value: "pointid",
        },
        {
          msg: "nodeX",
          value: "nodeX",
        },
        {
          msg: "nodeY",
          value: "nodeY",
        },
        {
          msg: "groundid",
          value: "groundid",
        },
      ];
      getPointList(
        { groundid: this.tableData[index].id },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.data.length == 0) {
          that.$message({
            message: that.$t("buildingmanagement.nodata"),
            type: "warning",
          });
        } else {
          that.export2ExcelPoint(res.data);
        }
      });
    },
    export2ExcelPoint(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = ["pointid", "nodeX", "nodeY", "groundid"];
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
        export_json_to_excel(tHeader, data, "连接点信息");
      });
    },

    // 导出相邻关系
    exportExcelNear(index) {
      var that = this;
      this.headlistdata = [
        {
          msg: "dist",
          value: "dist",
        },
        {
          msg: "nearpointid",
          value: "nearpointid",
        },
        {
          msg: "pointid",
          value: "pointid",
        },
        {
          msg: "groundid",
          value: "groundid",
        },
      ];
      getPointNearList(
        { groundid: this.tableData[index].id },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.data.length == 0) {
          that.$message({
            message: that.$t("buildingmanagement.nodata"),
            type: "warning",
          });
        } else {
          that.export2ExcelNear(res.data);
        }
      });
    },
    export2ExcelNear(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = ["pointid", "nearpointid", "dist", "groundid"];
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
        export_json_to_excel(tHeader, data, "相邻关系");
      });
    },
    //选择楼栋获取楼层下拉框
    selectGround(event) {
      var that = this;
      let data = {
        buildid: event,
      };
      getGround(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.groundList = res.data;
          }
        }
      );
    },
    //根据楼层编号查询
    searchInfo() {
      var that = this;
      getBuildGroundList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.tableData.forEach((item) => {
            item.nums = item.bnum + item.onum;
          });
          that.total = res.data.size;
          if (res.data.size > 0) {
            that.$message({
              message: that.$t("buildingmanagement.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("buildingmanagement.nodata"),
              type: "error",
            });
          }
        }
      });
    },

    //重置楼层查询
    clearBtn() {
      this.currentPage1 = 1;
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        mapid: "",
        buildid: "",
        ground: "",
        groundid: "",
        page: 1,
        count: 20,
      };
      this.getBuildingLists();
    },

    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getBuildingLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getBuildingLists();
    },

    //获取建筑信息
    getBuildingLists() {
      var that = this;
      getBuildGroundList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.tableData.forEach((item) => {
            item.nums = item.bnum + item.onum;
          });
          that.total = res.data.size;
        }
      });
    },

    //添加建筑
    addBuildings() {
      this.mapList = [];
      this.addData = {
        buildid: "", //楼栋号
        grounds: "", //楼层
        mapid: "", //地图名称
        memo: "", //备注
      };
      this.addData_ground = "";
      this.add = true;
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      if (that.addData_ground == "") {
        that.$message({
          message: that.$t("floormanagement.floorformat"),
          type: "warning",
        });
        return;
      }
      that.addData_ground = newGround(that.addData_ground);
      if (groundTest(that.addData_ground)) {
        that.$message({
          message: that.$t("floormanagement.floorformat"),
          type: "warning",
        });
        return;
      }
      let groundArr = that.addData_ground.split(",");
      let rirghtGrounds = rightGround(groundArr);

      if (rirghtGrounds == false) {
        that.$message({
          message: that.$t("floormanagement.floorformat"),
          type: "warning",
        });
        return;
      } else {
        rirghtGrounds = [...new Set(rirghtGrounds)];
        rirghtGrounds = rirghtGrounds.join(",");
        that.addData.grounds = rirghtGrounds;
      }
      that.$refs[addData].validate((valid) => {
        if (valid) {
          that.loading = true;
          addBuildGround(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getBuildingLists();
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
            }
          });
        } else {
          return false;
        }
      });
    },

    // 编辑建筑信息
    projectEdit(index) {
      this.checkMapTypeEdit(
        this.tableData[index].buildid,
        this.tableData[index]
      );
      this.editData.id = this.tableData[index].id;
      this.editData.ground = this.tableData[index].ground;
      this.editData.mapid = this.tableData[index].mapid;
      this.editData.memo = this.tableData[index].memo;
      this.editData.buildid = this.tableData[index].buildid;
      this.editData.name = this.tableData[index].name;

      this.edit = true;
    },
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (that.buildtype == 1) {
            updateBuildGround(
              this.editData,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.edit = false;
                that.getBuildingLists();
                that.$message({
                  message: that.$t("beacon.editsuccess"),
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
            updateBuildGround3D(
              this.editData,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.edit = false;
                that.getBuildingLists();
                that.$message({
                  message: that.$t("beacon.editsuccess"),
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
        } else {
          return false;
        }
      });
    },
    // 根据设备号触发或取消告警
    sendDevOtherAlarmMores(val, index) {
      var that = this;
      this.$confirm(
        val == "yes"
          ? this.$t("otherDev.triggerAlarmtrue")
          : this.$t("otherDev.cancelAlarmtrue"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          alarm: val,
          devtype: 4,
          inuse: 1,
          groundid: that.tableData[index].id,
          buildid: that.tableData[index].buildid,
          projectid: that.tableData[index].projectid,
        };
        sendDevOtherAlarmMore(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
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

    //删除建筑信息
    projectDele(index) {
      let that = this;
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
      this.deleteData = this.tableData[index];
      this.deletes = true;
    },

    delTrue(index) {
      var that = this;
      let data = {
        groundid: this.deleteData.id,
        building: this.deleteData.building,
        ground: this.deleteData.ground,
        mapid: this.deleteData.mapid,
        type: this.intoProjectType,
        projectid: this.deleteData.projectid,
      };
      this.loading = true;
      delBuildGround(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.deletes = false;
          that.getBuildingLists();
          that.$message({
            message: that.$t("buildingmanagement.deletesuccess"),
            type: "success",
          });
          that.loading = false;
        } else {
          that.$message({
            message: that.$t("buildingmanagement.deletefaile"),
            type: "error",
          });
          that.loading = false;
        }
      });
    },
    //布置
    arrangeMap(index, scope) {
      var that = this;
      // this.dobuleClick = true;
      if (this.tableData[index].maptype == 1) {
        that.arrange2d = true;
        setTimeout(() => {
          that.$refs.arrange2dmap.arrangeMaps(this.tableData[index], scope);
        }, 1);
      } else if (this.tableData[index].maptype == 2) {
        that.arrange3d = true;
        setTimeout(() => {
          that.$refs.arrange3dmap.arrangeMaps(this.tableData[index], scope);
        }, 1);
      }
    },
    getMsgFormSon2d(data) {
      this.arrange2d = data;
      this.dobuleClick = data;
    },
    getMsgFormSon3d(data) {
      this.arrange3d = data;
      this.dobuleClick = data;
    },

    //获取地图下拉框
    getMapInfoLists(val) {
      var that = this;
      let data;
      if (this.$store.state.userInfo.prionum == 5) {
        data = {
          tenantid: this.superId,
          projectid: val,
          status: 3,
          maptype: this.buildtype,
        };
      } else if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4
      ) {
        data = {
          tenantid: this.tenantid_A,
          projectid: val,
          status: 3,
          maptype: this.buildtype,
        };
      }
      getMapInfoList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.mapList = res.data.list;
          if (that.buildtype == 2 && that.add) {
            if (that.fileName) {
              let obj = that.mapList.find(
                (item) => item.filename == that.fileName
              );
              that.addData.mapid = obj.mapid;
            }
          } else {
            that.addData.mapid = "";
          }
        }
      });
    },

    //获取楼栋号的下拉框
    getBuildings() {
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
          that.buildingList = res.data;
        }
      });
    },
    checkMapType(value) {
      var that = this;
      this.chooseMap = false;
      const data = this.buildingList.filter(function (item) {
        return item.id == value;
      });
      this.buildtype = data[0].buildtype;

      if (this.buildtype == 2) {
        that.buildId = data[0].id;
        getMapidByBuildid(
          { buildid: that.buildId },
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            if (res.data.length > 0) {
              if (that.add) {
                that.fileName = res.data[0];
                that.getMapInfoLists(that.$store.state.intoProjectid);
              }
              that.chooseMap = true;
            } else {
              that.getMapInfoLists(that.$store.state.intoProjectid);
              that.chooseMap = false;
            }
          }
        });
      } else {
        that.getMapInfoLists(that.$store.state.intoProjectid);
        that.addData.mapid = "";
      }
    },
    checkMapTypeEdit(value, val) {
      var that = this;
      this.changeMap = true;
      this.chooseMap = false;
      const data = this.buildingList.filter(function (item) {
        return item.id == value;
      });
      this.buildtype = data[0].buildtype;
      if (this.buildtype == 2) {
        if (val) {
          if (val.mapid) {
            that.chooseMap = true;
            that.changeMap = false;
          } else {
            that.getMapInfoLists(that.$store.state.intoProjectid);
            that.chooseMap = false;
            that.changeMap = true;
          }
        }
        that.buildId = data[0].id;
      } else {
        that.getMapInfoLists(that.$store.state.intoProjectid);
      }
    },
  },
  beforeMount() {
    this.getBuildingLists();
    this.getBuildings();
  },
};
</script>

<style scoped>
#articleNearFile,
#articlePointFile,
#articleAreaFile,
#articleImage {
  display: none;
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
.selects button {
  width: 100%;
  text-align: left;
}
.query,
.reset,
.add {
  padding: 8px 12px !important;
}
.editss:hover {
  background-color: rgb(25, 86, 201);
  color: white;
}
.delss:hover {
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
a {
  text-decoration: none;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.demo-form-inline {
  margin-right: 0;
}
.icon_button {
  padding: 2px 16px !important;
}
.icon-control {
  margin-top: 0px !important;
  padding: 5px 16px 1px !important;
}
.download,
.upload {
  font-size: 24px !important;
}
</style>
