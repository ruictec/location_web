<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu ref="menu" />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Asset /></el-aside>
        <el-main>
          <el-form
            class="demo-form-inline"
            :model="searchList"
            style="display: flex; white-space: nowrap"
          >
            <el-form-item
              :label="$t('staff.name')"
              style="
                display: flex;
                width: 12%;
                margin-left: 2%;
                margin-right: 0;
              "
            >
              <el-select
                style="width: 95%; float: left"
                v-model="searchList.username"
                clearable
                filterable
                :placeholder="$t('staff.text')"
              >
                <el-option
                  v-for="item in searchSelectPerson"
                  :key="item.id"
                  :label="item.username"
                  :value="item.username"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('staff.gender')"
              style="
                display: flex;
                width: 10%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-select
                style="width: 95%; float: left"
                v-model="searchList.sex"
                clearable
                filterable
                :placeholder="$t('staff.text')"
              >
                <el-option
                  v-for="item in sexType"
                  :key="item.index"
                  :label="item.value"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('staff.WorkersCard')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-input
                style="width: 95%; float: left"
                v-model="searchList.maplabel"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('staff.Department')"
              style="
                display: flex;
                width: 12%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-select
                v-model="searchList.depart"
                filterable
                :placeholder="$t('staff.text')"
              >
                <el-option
                  v-for="item in departList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('staff.Jobnumber')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-input
                style="width: 95%; float: left"
                v-model="searchList.cardno"
              >
              </el-input>
            </el-form-item>

            <el-form-item style="display: flex; margin-left: 0; z-index: 1">
              <el-button type="primary" class="query" @click="searchStaff()">{{
                $t("staff.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("staff.reset")
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
              <el-button type="primary" class="add" @click="addStaff()">{{
                $t("staff.Addemployees")
              }}</el-button>
            </el-form-item>
          </el-form>

          <el-form
            class="demo-form-inline"
            style="display: flex; white-space: nowrap"
          >
            <el-form-item
              style="
                display: flex;
                width: 15%;
                margin-left: 2%;
                margin-right: 0;
              "
            >
              <el-button
                type="danger"
                class="add move"
                @click="removeStaffs()"
                >{{ $t("staff.unbind") }}</el-button
              >
              <el-button
                type="primary"
                class="add move"
                @click="goSetDepart()"
                >{{ $t("staff.DepartmentSettings") }}</el-button
              >
              <el-button
                type="primary"
                class="add move"
                @click="goSetWorktype()"
                >{{ $t("staff.Tradesettings") }}</el-button
              >
              <el-button
                type="primary"
                class="reset"
                style="margin-left: 0%"
                @click="importExcelWorktype()"
                >{{ $t("staff.importWorktype") }}</el-button
              >
              <el-button
                type="primary"
                class="reset"
                style="margin-left: 0%"
                @click="exportExcelWorkType()"
                >{{ $t("staff.exportWorktype") }}</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 展示 -->
          <div class="content_staff">
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
                id="articleWorktypeFile"
                name="excelFile"
                type="file"
                class="x_file"
                accept=".xls,.xlsx"
                @change="importExcelWorktypes"
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
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                property="username"
                :label="$t('staff.employeename')"
                min-width="100"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="birthday"
                :label="$t('staff.age')"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ ages(scope.row.birthday) }}
                </template>
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'sexstr' : 'ensex'"
                :label="$t('staff.gender1')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="tel"
                :label="$t('staff.telephone')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="depart"
                :label="$t('staff.Department1')"
                align="center"
                sortable
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="worktype"
                :label="$t('staff.Typeofwork')"
                align="center"
                sortable
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="maplabel"
                :label="$t('staff.Workcardnumber')"
                align="center"
                sortable
                show-overflow-tooltip
                min-width="150"
              ></el-table-column>
              <el-table-column
                property="cardno"
                :label="$t('staff.Jobnumber1')"
                align="center"
                sortable
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                property="memo"
                :label="$t('staff.Remark')"
                min-width="100"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('staff.operate')"
                min-width="160"
                align="center"
              >
                <template slot-scope="scope">
                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('staff.operate')"
                      placement="top-start"
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
                          @click="staffEdit(scope.$index, tableData)"
                          >{{ $t("staff.edit") }}</el-button
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
                          @click="staffDele(scope.$index)"
                          >{{ $t("staff.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('staff.position')"
                    placement="top-start"
                  >
                    <el-button
                      type="primary"
                      class="edits icon_button"
                      @click="goLocation(scope.$index, tableData)"
                      ><img src="../../../static/location.png"
                    /></el-button>
                  </el-tooltip>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('staffmanagement.trajectory')"
                    placement="top-start"
                  >
                    <el-button
                      type="primary"
                      class="edits icon_button"
                      style="margin-left: 0"
                      @click="staffAction(scope.$index, tableData)"
                      ><img src="../../../static/trajectory2.png"
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
                :page-size="20"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 添加员工 -->
          <el-dialog
            :title="$t('staff.text1')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-upload
              :action="ImagePath"
              list-type="picture-card"
              :file-list="fileListAdd"
              :on-preview="handlePictureCardPreview"
              accept=".png, .jpg, .jpeg"
              :limit="1"
              ref="upload"
              :data="userIdForPic"
              :on-success="picSuccess"
              :on-error="picError"
              :headers="myHeader"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
              :on-change="handleChange"
              :on-remove="handleRemove"
            >
              <div slot="tip" class="el-upload__tip">
                {{ $t("staff.text2") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="addData"
              label-width="120px"
              ref="addData"
              :rules="editRules"
              style="text-align: left; margin-top: 2%"
            >
              <el-form-item :label="$t('staff.name1')" prop="username">
                <el-input v-model="addData.username" maxlength="32"></el-input>
              </el-form-item>
              <el-form-item :label="$t('staff.Jobnumber')">
                <el-input v-model="addData.cardno" maxlength="16"></el-input>
              </el-form-item>
              <el-form-item :label="$t('staff.age1')" prop="">
                <el-date-picker
                  v-model="addData.birthday"
                  type="date"
                  :placeholder="$t('staff.birthdayPlaceholder')"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('staff.gender')">
                <el-select
                  v-model="addData.sex"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in sexType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('staff.telephone1')"
                :prop="i8n == 'zh' ? 'tel' : ''"
              >
                <el-input v-model="addData.tel"></el-input>
              </el-form-item>
              <el-form-item :label="$t('staff.Department2')">
                <el-select
                  v-model="addData.depart"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in departList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('staff.Typeofwork1')">
                <el-select
                  v-model="addData.worktype"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in worktypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('staff.Workcardnumber1')"
                v-if="ProjectTye != 2"
              >
                <el-select
                  v-model="addData.maplabel"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in maplabelList"
                    :key="item.deveui"
                    :label="item.deveui"
                    :value="item.deveui"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('staff.Workcardnumber1')"
                v-if="ProjectTye == 2"
              >
                <el-select
                  v-model="addData.maplabel"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in maplabelList"
                    :key="item.deveui"
                    :label="
                      item.deveui + ' / ' + item.major + ' / ' + item.minor
                    "
                    :value="item.deveui"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('staff.Remark1')">
                <el-input
                  type="textarea"
                  maxlength="64"
                  show-word-limit
                  v-model="addData.memo"
                  rows="4"
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
          <!-- 地图预览 -->
          <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>

          <!-- 编辑 -->
          <el-dialog
            :title="$t('staff.text3')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-upload
              :action="ImagePathEdit"
              list-type="picture-card"
              :file-list="fileListEdit"
              :on-preview="handlePictureCardPreviewEdit"
              accept=".png, .jpg, .jpeg"
              :limit="1"
              ref="upload"
              :data="userIdForPicEdit"
              :on-success="picSuccessEdit"
              :on-error="picErrorEdit"
              :headers="myHeaderEdit"
              :auto-upload="false"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-exceed="handleExceedEdit"
              :before-upload="beforeAvatarUploadEdit"
            >
              <div slot="tip" class="el-upload__tip">
                {{ $t("staff.text2") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="editData"
              ref="editData"
              label-width="120px"
              :rules="editRules"
              style="text-align: left; margin-top: 2%"
            >
              <el-form-item :label="$t('staff.name1')" prop="username">
                <el-input v-model="editData.username" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('staff.Jobnumber')">
                <el-input v-model="editData.cardno" maxlength="16"></el-input>
              </el-form-item>
              <el-form-item :label="$t('staff.age1')" prop="">
                <el-date-picker
                  v-model="editData.birthday"
                  type="date"
                  :placeholder="$t('staff.birthdayPlaceholder')"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('staff.gender')">
                <el-select
                  v-model="editData.sex"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in sexType"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('staff.telephone1')"
                :prop="i8n == 'zh' ? 'tel' : ''"
              >
                <el-input v-model="editData.tel"></el-input>
              </el-form-item>
              <el-form-item :label="$t('staff.Department2')">
                <el-select
                  v-model="editData.depart"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in departList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('staff.Typeofwork1')">
                <el-select
                  v-model="editData.worktype"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in worktypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('staff.Workcardnumber1')"
                v-if="ProjectTye != 2"
              >
                <el-select
                  v-model="editData.maplabel"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in maplabelList"
                    :key="item.deveui"
                    :label="item.deveui"
                    :value="item.deveui"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('staff.Workcardnumber1')"
                v-if="ProjectTye == 2"
              >
                <el-select
                  v-model="editData.maplabel"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in maplabelList"
                    :key="item.deveui"
                    :label="
                      item.deveui + ' / ' + item.major + ' / ' + item.minor
                    "
                    :value="item.deveui"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('staff.Remark1')">
                <el-input
                  type="textarea"
                  maxlength="64"
                  show-word-limit
                  rows="4"
                  v-model="editData.memo"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel('editData')">{{
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

          <!-- 行为分析 -->
          <el-dialog
            :visible.sync="actions"
            width="60%"
            style="text-align: center"
            :close-on-click-modal="false"
            class="action"
            @close="closeAction"
          >
            <el-dialog
              :visible.sync="trajectory"
              width="80%"
              style="text-align: center"
              :close-on-click-modal="false"
              class="trajectory"
              append-to-body
              @close="closetrajectoryAction"
            >
              <!-- <location ref="locations" /> -->
              <Trajectory ref="trajectory" @closePopup2d="closePopup" />
            </el-dialog>
            <el-dialog
              :visible.sync="trajectory3d"
              width="80%"
              style="text-align: center"
              :close-on-click-modal="false"
              class="trajectory"
              append-to-body
              @close="closetrajectoryAction3d"
            >
              <Trajectorys ref="trajectorys" @closePopup3d="closePopup3d" />
            </el-dialog>
            <el-form
              class="demo-form-inline"
              style="
                display: flex;
                white-space: nowrap;
                margin-left: 1%;
                width: 100%;
              "
              :model="actionData"
            >
              <el-form-item
                :label="$t('staff.name1')"
                style="
                  display: flex;
                  margin-left: 1%;
                  margin-right: 1%;
                  width: 16%;
                "
              >
                <el-input v-model="actionData.username"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('staff.Workcardnumber1')"
                style="
                  display: flex;
                  margin-left: 1%;
                  margin-right: 2%;
                  width: 30%;
                "
              >
                <el-input v-model="actionData.maplabel"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('staff.time')"
                style="
                  display: flex;
                  margin-left: 1%;
                  margin-right: 0;
                  width: 40%;
                "
              >
                <el-date-picker
                  v-model="actionTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('terminal.to')"
                  :start-placeholder="$t('terminal.startdate')"
                  :end-placeholder="$t('terminal.enddate')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item style="margin-left: 1%; width: 20%">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchAction()"
                  >{{ $t("staff.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="query"
                  @click="showTrajectory()"
                  >{{ $t("staff.Viewtrack") }}</el-button
                >
              </el-form-item>
            </el-form>
            <div class="actionDetails">
              <Timeline v-for="item in actionTableData" :key="item.id">
                <!-- 室内 -->
                <TimelineItem v-if="item.postype == 1">
                  <p class="time">
                    {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
                  </p>
                  <p class="content">
                    {{ $t("LocationIndoorHis.Building") }}{{ item.building }}
                  </p>
                  <p class="content">
                    {{ $t("LocationIndoorHis.floor") }}{{ item.groundname }}
                  </p>
                  <p class="content">
                    {{ $t("warning.area1") }}{{ item.tranche }}
                  </p>
                  <p class="content">
                    {{ $t("tet.Residencetime")
                    }}{{ formatSeconds(item.remaintime) }}
                  </p>
                </TimelineItem>

                <!-- 室外 -->
                <TimelineItem v-if="item.postype == 2">
                  <p class="time">
                    {{ $t("LocationIndoorHis.time") }}{{ item.gpstime }}
                  </p>
                  <p class="content">
                    {{ $t("warning.area1") }}{{ item.tranche }}
                  </p>
                  <p class="content">
                    {{ $t("tet.Residencetime")
                    }}{{ formatSeconds(item.remaintime) }}
                  </p>
                </TimelineItem>
              </Timeline>
            </div>
          </el-dialog>

          <!-- 删除 -->
          <el-dialog
            :title="$t('staff.text4')"
            :visible.sync="deleTpl"
            style="text-align: center"
          >
            <el-form>
              <p
                style="
                  line-height: 0px;
                  margin-bottom: 10px;
                  color: red;
                  font-size: 20px;
                "
              >
                {{ $t("staff.text5") }}{{ deleStaff }}{{ $t("staff.text6") }}
              </p>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(deleTpl = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="deleTrue" :loading="loading">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>
          <!--轨迹！-->

          <!-- 解除分配信标 -->
          <el-dialog
            :title="$t('staff.text7')"
            :visible.sync="removeStaff"
            class="edit"
            width="50%"
            style="text-align: center"
          >
            <el-table
              :data="removeDatas"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="username"
                :label="$t('staff.name2')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="maplabel"
                :label="$t('staff.Workcardnumber')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="projectname"
                :label="$t('staff.projectname')"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(removeStaff = false), (loading = false)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="removeTrue()"
                :loading="loading"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
          <!-- 设置角色 -->
          <el-dialog
            :title="$t('staff.text8')"
            :visible.sync="addWorktype"
            class="edit"
            width="30%"
            style="text-align: center"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
            :append-to-body="true"
          >
            <div class="import_type">
              <el-radio-group size="small">
                <el-button
                  type="primary"
                  class="add"
                  style="float: left"
                  @click="addWorktypeRow"
                  >{{ $t("staff.add") }}</el-button
                >
              </el-radio-group>
              <el-form style="text-align: center">
                <el-form-item
                  style="
                    width: 60%;
                    margin-left: 16%;
                    text-align: left;
                    margin-top: 14px;
                  "
                  :label="$t('staff.import')"
                >
                  <el-select
                    v-model="currentProjectid.projectid"
                    clearable
                    filterable
                    @change="importWorktype"
                    :placeholder="$t('staff.text9')"
                  >
                    <el-option
                      v-for="item in projectList()"
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
                      <p>
                        {{ $t("staff.text9") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </el-form-item>
              </el-form>
            </div>

            <el-form
              label-width="80px"
              v-for="(item, index) in worktypeList"
              :key="item.id"
              style="margin-top: 20px"
              class="demo-form-inline"
            >
              <el-form-item class="work_type_list">
                <el-input
                  v-model="item.name"
                  :maxlength="i8n == 'zh' ? '12' : '30'"
                  style="width: 70%"
                  :disabled="item.id === undefined ? false : true"
                ></el-input>
                <el-button
                  type="primary"
                  size="small"
                  class="del"
                  @click="
                    deleWorktypeRow(
                      index,
                      item.id,
                      item.name,
                      item.tenantid,
                      item.projectid
                    )
                  "
                  >{{ $t("staff.delete") }}</el-button
                >
                <el-image
                  style="width: 32px; height: 32px; cursor: pointer"
                  :src="
                    assetBase + '/image/' +
                    item.colour +
                    '.png'
                  "
                  fit="fill"
                  @click.native="changeIcon(item)"
                ></el-image>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-top: -10px">
              <el-button @click="addWorktype = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addWorktypeRowTrue()">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 选择角色图标 -->
          <el-dialog :visible.sync="showIcon" width="25%">
            <span slot="title"> 选择图标 </span>
            <el-radio-group
              v-model="radio"
              @change="chooseIcon()"
              style="text-align: left"
            >
              <el-radio :label="1">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc1"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="2">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc2"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="3">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc3"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="4">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc4"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="5">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc5"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="6">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc6"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="7">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc7"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="8">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc8"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="9">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc9"
                  fit="fit"
                ></el-image>
              </el-radio>
              <el-radio :label="10">
                <el-image
                  style="width: 32px; height: 32px"
                  :src="IconSrc10"
                  fit="fit"
                ></el-image>
              </el-radio>
            </el-radio-group>
          </el-dialog>

          <!-- 设置部门 -->
          <el-dialog
            :title="$t('staff.text10')"
            :visible.sync="addDepartktype"
            class="edit"
            width="30%"
            style="text-align: center"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
            :append-to-body="true"
          >
            <el-radio-group size="small">
              <el-button
                type="primary"
                class="add"
                style="float: left"
                @click="addDepartRow"
                >{{ $t("staff.add") }}</el-button
              >
            </el-radio-group>
            <el-form style="text-align: center">
              <el-form-item
                style="
                  width: 60%;
                  margin-left: 16%;
                  text-align: left;
                  margin-top: 14px;
                "
                :label="$t('staff.import')"
              >
                <el-select
                  v-model="currentProjectid.projectid"
                  clearable
                  filterable
                  @change="importDepart"
                  :placeholder="$t('staff.text11')"
                >
                  <el-option
                    v-for="(item, index) in projectList()"
                    :key="index"
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
                    <p>
                      {{ $t("staff.text11") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-form>
            <el-form
              label-width="80px"
              v-for="(item, index) in departList"
              :key="index"
              style="margin-top: 20px"
              class="demo-form-inline"
            >
              <el-form-item>
                <el-input
                  v-model="item.name"
                  :maxlength="i8n == 'zh' ? '12' : '30'"
                  style="float: left; width: 70%"
                  :disabled="item.id === undefined ? false : true"
                ></el-input>
                <el-button
                  type="primary"
                  size="small"
                  style="float: left; margin-left: 20px"
                  @click="
                    deleDepartRow(
                      index,
                      item.id,
                      item.name,
                      item.tenantid,
                      item.projectid
                    )
                  "
                  class="del"
                  >{{ $t("staff.delete") }}</el-button
                >
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-top: -10px">
              <el-button @click="addDepartktype = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addDepartRowTrue()">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Asset from "../../components/asset/asset";
import host from "../../host";
import util from "../../common/util";
import { ASSET_BASE } from "../../config/index.js";
import {
  getMemberList,
  getMemberName,
  addMember,
  updateMember,
  delMemberById,
  getProjectList,
  getDevDeveui,
  getBeaconid,
  updateMemberRemoveLable,
  getMemberType,
  getDepartmentType,
  getDevGpsOne,
  getDevGpsAction,
  delDepartmenType,
  delMemberType,
  addMemberType,
  addDepartmentType,
  getMemberByEuis,
  updateMemberTypeIcon,
  importMember,
  getBuildGroundList,
  importBranch,
} from "../../axios/api";
import Location from "./outdoorTrajectory.vue";
import Trajectory from "./trajectory.vue";
import Trajectorys from "./trajectory3d.vue";
import { name } from "file-loader";

export default {
  components: {
    Menu,
    Asset,
    Location,
    Trajectory,
    Trajectorys,
  },
  name: "StaffManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      assetBase: ASSET_BASE,
      //时间选择限制
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("staffmanagement.Lasthour1"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour3"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("staffmanagement.Lasthour6"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      superid: this.$store.state.userInfo.superid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      projectid: this.$store.state.intoProjectid,
      intoProjectid: this.$store.state.intoProjectid,
      projectTable: [],
      labelPosition: "right",
      loading: false,
      show: false,
      searchList: {
        username: "", //员工名称
        sex: "", //性别
        cardno: "", //工号
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        depart: "", //部门
        maplabel: "", //工卡号或信标号
        page: 1,
        count: 20,
        ontime: "", //在线时间
        offtime: "", //离线时间
      },
      currentProjectid: {
        projectid: "",
      },
      searchSelectPerson: [],
      searchSelectProject: [], //项目下拉选择
      tableData: [],
      pageCount: 20,
      currentPage1: 1,
      total: 0,
      add: false,
      addData: {
        username: "", //员工姓名
        birthday: "", //生日
        sex: "", //性别
        cardno: "", //工号
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: "", //项目编号
        depart: "", //所在部门
        maplabel: "", //工卡号或信标号
        tel: "",
        memo: "", //备注
        worktype: "", //角色
      },
      haveImage: false, //判断添加的员工有没有头像
      delImage: false, //判断员工是否要删除头像
      ImagePath: host.host + "user/addMemberMapFile",
      ImagePathEdit: host.host + "user/updateMemberMapFile",
      fileListAdd: [],
      fileListEdit: [],
      dialogImageUrl: "",
      dialogVisible: false,
      userIdForPic: {}, //添加图片携带参数
      userIdForPicEdit: {}, //编辑图片携带参数
      myHeader: {
        tenantkey: this.$store.state.userInfo.tenantkey,
        ts: new Date().getTime(),
        tenantid: this.$store.state.userInfo.tenantid,
        userName: this.$store.state.userInfo.username,
      },
      myHeaderEdit: {
        tenantkey: this.$store.state.userInfo.tenantkey,
        ts: new Date().getTime(),
        tenantid: this.$store.state.userInfo.tenantid,
        userName: this.$store.state.userInfo.username,
      },
      ProjectTye: "",
      departList: [],
      worktypeList: [],
      maplabelList: [],
      sexType: [
        {
          index: 1,
          value: this.$t("staffmanagement.man"),
        },
        {
          index: 2,
          value: this.$t("staffmanagement.woman"),
        },
        {
          index: 3,
          value: this.$t("staffmanagement.unknown"),
        },
      ],
      trajectory: false,
      trajectory3d: false,
      edit: false,
      actions: false,
      actionData: {
        projectid: "",
        maplabel: "",
        username: "",
      },
      actionTableData: [],
      actionTableDataArr: [],
      actionTime: "",
      editData: {
        tenantid: this.$store.state.userInfo.tenantid,
        username: "", //员工姓名
        birthday: "", //年龄
        sex: "", //性别
        cardno: "", //工号
        projectid: "", //项目编号
        depart: "", //所在部门
        maplabel: "", //工卡号或信标号
        tel: "",
        memo: "", //备注
        id: "",
        worktype: "",
        filename: "",
      },
      editRules: {
        tel: [
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: this.$t("companymanagement.clienttelrule3"),
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: this.$t("checkwork.title1"),
            trigger: "blur",
          },
        ],
        age: [
          {
            pattern: /^(?:0|[1-9][0-9]?|100)$/,
            message: this.$t("staffmanagement.enternamerule"),
            trigger: "blur",
          },
        ],
      },
      deleTpl: false,
      deleStaff: "",
      deleId: "",
      delFileName: "",

      multipleSelection: [],
      removeStaff: false,
      removeDatas: [],
      removeStaffDatas: {
        ids: "",
        usernamelist: "",
        projectid: "",
        maplabellist: "",
      },
      addWorktype: false,
      addDepartktype: false,
      outdoor: false,
      indoor: false,

      isSearchAction: false,

      showIcon: false,
      item_info: "",
      item_info_id: "",
      item_info_name: "",
      item_info_projectid: "",
      radio: "",
      IconSrc1: "../../../static/1.png",
      IconSrc2: "../../../static/2.png",
      IconSrc3: "../../../static/3.png",
      IconSrc4: "../../../static/4.png",
      IconSrc5: "../../../static/5.png",
      IconSrc6: "../../../static/6.png",
      IconSrc7: "../../../static/7.png",
      IconSrc8: "../../../static/8.png",
      IconSrc9: "../../../static/9.png",
      IconSrc10: "../../../static/10.png",
      headlistdata: "",
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
            projectid: that.$store.state.projectid,
          };

          importMember(
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
              that.getMemberLists();
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
    importExcelWorktype() {
      document.getElementById("articleWorktypeFile").click(); //触发importExcels
    },
    importExcelWorktypes() {
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
          importList = that.dateTransitionWork(outdata);
          let data = {
            msg: JSON.stringify(importList),
            tenantid: that.tenantid_A,
            projectid: that.$store.state.projectid,
          };

          importBranch(
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
              $("#articleWorktypeFile").val("");
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
              $("#articleWorktypeFile").val("");
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
            case that.$t("staff.employeename"):
              obj["username"] = outdata[i][key];
              break;
            case that.$t("staff.birthday"):
              obj["birthday"] = outdata[i][key];
              break;
            case that.$t("staff.gender1"):
              obj["sex"] = outdata[i][key];
              break;
            case that.$t("staff.telephone"):
              obj["tel"] = outdata[i][key];
              break;
            case that.$t("staff.Department1"):
              obj["depart"] = outdata[i][key];
              break;
            case that.$t("staff.Typeofwork"):
              obj["worktype"] = outdata[i][key];
              break;
            case that.$t("staff.Workcardnumber"):
              obj["maplabel"] = outdata[i][key];
              break;
            case that.$t("staff.Jobnumber1"):
              obj["cardno"] = outdata[i][key];
              break;
            case that.$t("staff.Remark"):
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
    dateTransitionWork(outdata) {
      var that = this;
      let list = [];
      var obj = {};
      for (var i = 0; i < outdata.length; i++) {
        obj = {};
        for (var key in outdata[i]) {
          switch (key) {
            case that.$t("staff.Tradesettings"):
              obj["name"] = outdata[i][key];
              break;
            case that.$t("staff.icon"):
              obj["colour"] = outdata[i][key];
              break;
            case "type":
              obj["type"] = outdata[i][key];
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
          message: that.$t("staff.selectStaff"),
          type: "warning",
        });
        return;
      }
      this.headlistdata = [
        {
          msg: that.$t("staff.employeename"),
          value: "username",
        },
        {
          msg: that.$t("staff.birthday"),
          value: "birthday",
        },
        {
          msg: that.$t("staff.gender1"),
          value: "sex",
        },
        {
          msg: that.$t("staff.telephone"),
          value: "tel",
        },
        {
          msg: that.$t("staff.Department1"),
          value: "depart",
        },
        {
          msg: that.$t("staff.Typeofwork"),
          value: "worktype",
        },
        {
          msg: that.$t("staff.Workcardnumber"),
          value: "maplabel",
        },
        {
          msg: that.$t("staff.Jobnumber1"),
          value: "cardno",
        },
        {
          msg: that.$t("staff.Remark"),
          value: "memo",
        },
        {
          msg: that.$t("otherDev.beacon"),
          value: "flag",
        },
      ];
      if (this.$store.state.intoProjectType == 1) {
        this.multipleSelection.forEach((item) => {
          item.flag = true;
        });
      } else {
        this.multipleSelection.forEach((item) => {
          item.flag = false;
        });
      }
      that.export2Excel(this.multipleSelection);
    },
    export2Excel(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = [
        "username",
        "birthday",
        "sex",
        "tel",
        "depart",
        "worktype",
        "maplabel",
        "cardno",
        "flag",
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
        export_json_to_excel(tHeader, data, that.$t("list.Employeemanagement"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    exportExcelAll() {
      var that = this;
      this.headlistdata = [
        {
          msg: that.$t("staff.employeename"),
          value: "username",
        },
        {
          msg: that.$t("staff.birthday"),
          value: "birthday",
        },
        {
          msg: that.$t("staff.gender1"),
          value: "sex",
        },
        {
          msg: that.$t("staff.telephone"),
          value: "tel",
        },
        {
          msg: that.$t("staff.Department1"),
          value: "depart",
        },
        {
          msg: that.$t("staff.Typeofwork"),
          value: "worktype",
        },
        {
          msg: that.$t("staff.Workcardnumber"),
          value: "maplabel",
        },
        {
          msg: that.$t("staff.Jobnumber1"),
          value: "cardno",
        },
        {
          msg: that.$t("staff.Remark"),
          value: "memo",
        },
        {
          msg: that.$t("otherDev.beacon"),
          value: "flag",
        },
      ];
      let data = {
        username: "", //员工名称
        sex: "", //性别
        cardno: "", //工号
        tenantid: that.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        depart: "", //部门
        maplabel: "", //工卡号或信标号
        page: "",
        count: "",
        ontime: "", //在线时间
        offtime: "", //离线时间
      };
      getMemberList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (that.$store.state.intoProjectType == 1) {
            res.data.list.forEach((item) => {
              item.flag = true;
            });
          } else {
            res.data.list.forEach((item) => {
              item.flag = false;
            });
          }

          that.export2Excel(res.data.list);
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    // 导出角色
    exportExcelWorkType() {
      var that = this;
      this.headlistdata = [
        {
          msg: that.$t("staff.Tradesettings"),
          value: "name",
        },
        {
          msg: that.$t("staff.icon"),
          value: "colour",
        },
        {
          msg: "type",
          value: "type",
        },
      ];
      let data = {
        tenantid: that.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
      };
      getMemberType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code === 1001) {
          that.exportWorkTypeExcel(res.data);
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },

    exportWorkTypeExcel(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = ["name", "colour", "type"];
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
        export_json_to_excel(tHeader, data, that.$t("staff.Tradesettings"));
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
    // 查看轨迹
    showTrajectory() {
      this.isSearchAction = true;
      this.actionTableData = [];
      this.searchActions();
    },
    showTrajectorys() {
      var that = this;
      // 将行为轨迹数据根据楼层分为不同的数组
      that.actionTableDataArr = [];
      let newArr = [];
      let list = JSON.parse(JSON.stringify(that.actionTableData));
      let node = list[0];
      list.forEach((item, i) => {
        if (item.groundid === node.groundid) {
          newArr.push(item);
        } else {
          that.actionTableDataArr.push(newArr);
          node = item;
          newArr = [];
          newArr.push(item);
        }
        if (i == list.length - 1) {
          that.actionTableDataArr.push(newArr);
        }
      });
      if (that.actionTableDataArr.length > 0) {
        let begintime, endtime;
        if (that.actionTime == null || that.actionTime.length == 0) {
          begintime = (Date.parse(new Date()) - 1 * 60 * 60 * 1000) / 1000;
          endtime = Date.parse(new Date()) / 1000;
        } else {
          let begingTime = that.actionTime[0];
          let endTime = that.actionTime[1];

          begingTime =
            !begingTime || begingTime == ""
              ? ""
              : util.formatDate.format(
                  new Date(begingTime),
                  "yyyy-MM-dd hh:mm:ss"
                );
          endTime =
            !endTime || endTime == ""
              ? ""
              : util.formatDate.format(
                  new Date(endTime),
                  "yyyy-MM-dd hh:mm:ss"
                );
          if (begingTime.length > 0 && endTime.length > 0) {
            begingTime = Date.parse(new Date(begingTime)) / 1000;
            endTime = Date.parse(new Date(endTime)) / 1000;
          }
          begintime = begingTime;
          endtime = endTime;
        }

        this.isSearchAction = false;
        if (that.actionTableDataArr[0][0].groundid) {
          let data = {
            groundid: that.actionTableDataArr[0][0].groundid,
          };
          getBuildGroundList(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              if (res.data.list[0].maptype == 2) {
                that.trajectory3d = true;
                that.$nextTick(() => {
                  that.$refs.trajectorys.search(
                    that.actionTableDataArr,
                    begintime,
                    endtime,
                    2
                  );
                });
              } else {
                that.trajectory = true;
                that.$nextTick(() => {
                  that.$refs.trajectory.search(
                    that.actionTableDataArr,
                    begintime,
                    endtime,
                    1
                  );
                });
              }
            }
          });
        } else {
          that.trajectory = true;
          that.$nextTick(() => {
            that.$refs.trajectory.search(
              that.actionTableDataArr,
              begintime,
              endtime,
              1
            );
          });
        }
      }
    },
    // 关闭轨迹弹框
    closePopup(data) {
      this.trajectory = false;
    },
    closePopup3d(data) {
      this.trajectory3d = false;
    },
    projectList() {
      return this.projectTable.filter((item) => {
        return item.projectid !== this.$store.state.projectid;
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
    //时间转换
    formatDatetime(row) {
      if (row == null || row == 0) {
        return "";
      }
      let date = new Date(parseInt(row) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },
    //将秒数转换为时分秒格式
    // formatSeconds(value) {
    //   var theTime = parseInt(value); // 秒
    //   var middle = 0; // 分
    //   var hour = 0; // 小时

    //   if (theTime > 60) {
    //     middle = parseInt(theTime / 60);
    //     theTime = parseInt(theTime % 60);
    //     if (middle > 60) {
    //       hour = parseInt(middle / 60);
    //       middle = parseInt(middle % 60);
    //     }
    //   }
    //   var result = "" + parseInt(theTime) + "秒";
    //   if (middle > 0) {
    //     result = "" + parseInt(middle) + "分" + result;
    //   }
    //   if (hour > 0) {
    //     result = "" + parseInt(hour) + "小时" + result;
    //   }
    //   return result;
    // },
    formatSeconds(value) {
      let result = parseInt(value);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);

      let res = "";
      if (h !== "00") res += `${h}h`;
      if (m !== "00") res += ` ${m}min`;
      res += ` ${s}s`;
      return res;
    },
    //设置角色
    goSetWorktype() {
      this.getProjectLists();
      var that = this;
      this.currentProjectid.projectid = "";
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      getMemberType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.worktypeList = res.data;
          that.addWorktype = true;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //删除角色
    deleWorktypeRow(index,id, name, tenantid, projectid) {
      if (!name || !id) {
        this.worktypeList.splice(index, 1);
      } else {
        var that = this;
        let data = {
          tenantid: tenantid,
          projectid: projectid,
          name: name,
        };
        delMemberType(
          JSON.stringify(data),
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.worktypeList.splice(index, 1);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    // 选择角色图标
    changeIcon(item) {
      this.showIcon = true;
      this.radio = item.colour;
      this.item_info = item;
      this.item_info_id = item.id;
      this.item_info_name = item.name;
      this.item_info_projectid = item.projectid;
    },
    chooseIcon() {
      if (this.item_info_id == undefined) {
        this.item_info.colour = this.radio;
        this.showIcon = false;
        return;
      }
      var that = this;
      let data = {
        name: this.item_info_name,
        colour: this.radio,
        projectid: this.item_info_projectid,
      };
      updateMemberTypeIcon(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.item_info.colour = that.radio;
          that.showIcon = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    // 确定添加角色
    addWorktypeRowTrue() {
      var that = this;
      let flag = false;
      let flag1 = false;
      let hash = {};
      $.each(this.worktypeList, function (i, n) {
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
          message: this.$t("staffmanagement.cannotempty"),
          type: "error",
        });
        this.worktypeList.splice(-1, 1);
        return;
      }
      if (flag1) {
        that.$message({
          message: this.$t("staffmanagement.alreadyexists"),
          type: "error",
        });
        this.worktypeList.splice(-1, 1);
        return;
      }
      let data = {
        branchs: this.worktypeList
          .filter((item) => !item.id)
          .map(({ id, ...item }) => item),
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      if (data.branchs.length == 0) {
        that.addWorktype = false;
        flag = false;
        return
      }
      data.branchs = JSON.stringify(data.branchs);
      addMemberType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("staffmanagement.Setsuccessfully"),
            type: "success",
          });
          that.addWorktype = false;
          that.getWorktyper();
          flag = false;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
          flag = false;
        }
      });
    },
    addWorktypeRow() {
      this.worktypeList.push({ colour: 1 });
    },
    //导入角色
    importWorktype(val) {
      if (!val) return;
      var that = this;
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.currentProjectid.projectid,
      };
      getMemberType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.length > 0) {
            // //导入后自动去重

            let arr = res.data;
            that.worktypeList.forEach((i) => {
              arr.forEach((j, index) => {
                if (j.name == i.name) {
                  arr.splice(index, 1);
                }
              });
            });
            arr.forEach((item) => {
              that.worktypeList.push({
                tenantid: item.tenantid,
                projectid: item.projectid,
                name: item.name,
                colour: item.colour,
                id:""
              });
            });
            console.log(that.worktypeList)
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //设置部门
    goSetDepart() {
      this.getProjectLists();
      var that = this;
      this.currentProjectid.projectid = "";
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
          that.departList = res.data;
          that.addDepartktype = true;
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
      });
    },
    //导入部门
    importDepart(val) {
      if (!val) return;
      var that = this;
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.currentProjectid.projectid,
      };

      getDepartmentType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.length > 0) {
            // //导入后自动去重

            let arr = res.data;
            that.departList.forEach((i) => {
              arr.forEach((j, index) => {
                if (j.name == i.name) {
                  arr.splice(index, 1);
                }
              });
            });
            arr.forEach((item) => {
              that.departList.push({
                name: item.name,
                tenantid: item.tenantid,
                projectid: item.projectid,
                id:""
              });
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
    addDepartRow() {
      this.departList.push({});
    },
    //删除部门
    deleDepartRow(index, id,name, tenantid, projectid) {
      if (!name || !id) {
        this.departList.splice(index, 1);
      } else {
        var that = this;
        let data = {
          tenantid: tenantid,
          projectid: projectid,
          name: name,
        };
        delDepartmenType(
          JSON.stringify(data),
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.departList.splice(index, 1);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    addDepartRowTrue() {
      var that = this;
      let flag = false;
      let flag1 = false;
      let hash = {};
      $.each(this.departList, function (i, n) {
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
          message: this.$t("staffmanagement.Departmentempty"),
          type: "error",
        });
        this.departList.splice(-1, 1);
        return;
      }
      if (flag1) {
        that.$message({
          message: this.$t("staffmanagement.Departmentexists"),
          type: "error",
        });
        this.departList.splice(-1, 1);
        return;
      }
      let data = {
        branchs: this.departList
          .filter((item) => !item.id)
          .map(({ id, ...item }) => item),
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      if (data.branchs.length == 0) {
        that.addDepartktype = false;
        flag = false;
        return;
      }
      data.branchs = JSON.stringify(data.branchs);
      addDepartmentType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.$message({
            message: that.$t("staffmanagement.Setsuccessfully"),
            type: "success",
          });
          that.addDepartktype = false;
          flag = false;
          that.getDepart();
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
          flag = false;
        }
      });
    },

    changeItem() {
      this.show = !this.show;
    },
    myHeaderd() {
      let d = new Date();
      let time_A = d.getTime();
      this.myHeader.tenantkey = this.tenantkey_A;
      this.myHeader.ts = this.time_A;
      this.myHeader.tenantid = this.tenantid_A;
      this.myHeader.userName = this.userName;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreviewEdit(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    picSuccess(response, file, fileList) {
      file = "";
      this.$refs.upload.clearFiles();
      if (response.code == 1001) {
        this.add = false;
        // this.searchList.page = 1;
        // this.currentPage1 = 1;
        this.getMemberLists();
        this.getMemberListss();
        this.$message({
          message: this.$t("staffmanagement.addsuccess"),
          type: "success",
        });
        this.loading = false;
        this.$refs.addData.resetFields();
      } else {
        this.$message({
          message: response.msg,
          type: "warning",
        });
        this.loading = false;
      }
    },
    picSuccessEdit(response, file, fileList) {
      file = "";
      this.$refs.upload.clearFiles();
      if (response.code == 1001) {
        this.edit = false;
        // this.searchList.page = 1;
        this.getMemberLists();
        this.$message({
          message: this.$t("staffmanagement.editsuccess"),
          type: "success",
        });
        this.loading = false;
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
        this.loading = false;
      }
    },

    picError(err) {
      this.loading = false;
      this.$refs.upload.clearFiles();
    },
    picErrorEdit(err) {
      this.loading = false;
      this.$refs.upload.clearFiles();
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t("tet.tet10"));
    },
    handleExceedEdit(files, fileList) {
      this.$message.warning(this.$t("tet.tet11"));
    },
    beforeAvatarUpload(file) {
      var index = file.name.lastIndexOf(".");
      var type = file.name.substr(index + 1); //文件后缀名
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.error(this.$t("tet.tet12"));
        this.loading = false;
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("tet.tet13"));
        this.loading = false;
      }

      return isLt2M;
    },
    beforeAvatarUploadEdit(file) {
      var index = file.name.lastIndexOf(".");
      var type = file.name.substr(index + 1); //文件后缀名
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.error(this.$t("tet.tet12"));
        this.loading = false;
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("tet.tet13"));
        this.loading = false;
      }
      return isLt2M;
    },
    handleChange(file) {
      if (file) {
        this.haveImage = true;
        this.delImage = false;
      }
    },
    handleRemove(file) {
      if (file) {
        this.haveImage = false;
        this.delImage = true;
      }
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      if (this.$route.query.euis) {
        var that = this;
        let data = {
          projectid: this.projectid,
          euis: this.$store.state.staffEuis,
          page: this.searchList.page,
          count: this.searchList.count,
          flag: this.$route.query.flag,
        };
        getMemberByEuis(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.tableData = res.data.list;
            that.total = res.data.size;
          }
        });
      } else {
        this.getMemberLists();
      }
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.$route.query.euis) {
        var that = this;
        let data = {
          projectid: this.projectid,
          euis: this.$store.state.staffEuis,
          page: this.searchList.page,
          count: this.searchList.count,
          flag: this.$route.query.flag,
        };
        getMemberByEuis(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.tableData = res.data.list;
            that.total = res.data.size;
          }
        });
      } else {
        this.getMemberLists();
      }
    },

    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //重置搜索
    clearBtn() {
      var that = this;
      this.searchList = {
        username: "", //员工名称
        sex: "", //性别
        cardno: "", //工号
        tenantid: that.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        depart: "", //部门
        maplabel: "", //工卡号或信标号
        page: 1,
        count: this.pageCount,
        ontime: "", //在线时间
        offtime: "", //离线时间
      };
      this.$route.query.euis = "";
      that.$store.commit("changeStaffEuis", "");
      this.currentPage1 = 1;
      this.getMemberLists();
    },

    //获取员工信息
    getMemberLists() {
      var that = this;
      getMemberList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          that.searchList.ontime = "";
          that.searchList.offtime = "";
        }
      });
    },

    //获取所有员工，制作下拉框
    getMemberListss() {
      var that = this;
      let data = {
        // tenantid: this.$store.state.userInfo.tenantid,
        projectid: this.$store.state.projectid,
      };
      getMemberName(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          // this.searchSelectPerson = res.data.list;
          // 筛选重名的
          var personData = res.data;
          var personHash = {};

          this.searchSelectPerson = personData.reduce((preVal, curVal) => {
            personHash[curVal.username]
              ? ""
              : (personHash[curVal.username] = true && preVal.push(curVal));
            return preVal;
          }, []);
        }
      });
    },

    //添加员工
    addStaff() {
      this.fileListAdd = [];
      this.haveImage = false;
      var that = this;
      if (this.contrForPrionum == 5) {
        this.addData = {
          username: "", //员工姓名
          birthday: "", //年龄
          sex: "", //性别
          cardno: "", //工号
          tenantid: that.tenantid_A, //公司识别号
          projectid: this.$store.state.projectid, //项目编号
          depart: "", //所在部门
          maplabel: "", //工卡号或信标号
          tel: "",
          memo: "",
          worktype: "", //角色
        };
        this.projectChanged(this.$store.state.projectid);
      } else {
        this.addData = {
          username: "", //员工姓名
          birthday: "", //年龄
          sex: "", //性别
          cardno: "", //工号
          tenantid: that.tenantid_A, //公司识别号
          projectid: "", //项目编号
          depart: "", //所在部门
          maplabel: "", //工卡号或信标号
          tel: "",
          memo: "",
        };
      }
      this.getWorktyper();
      this.getDepart();

      this.add = true;
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addTrue(addData) {
      var that = this;
      this.addData.tenantid = this.tenantid_A;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          that.loading = true;
          that.addData.type = that.ProjectTye;
          if (that.haveImage) {
            that.userIdForPic.username = that.addData.username;
            that.userIdForPic.birthday = that.addData.birthday;
            that.userIdForPic.sex = that.addData.sex;
            that.userIdForPic.cardno = that.addData.cardno;
            that.userIdForPic.tenantid = that.addData.tenantid;
            that.userIdForPic.projectid = that.addData.projectid;
            that.userIdForPic.depart = that.addData.depart;
            that.userIdForPic.maplabel =
              that.addData.maplabel == null ? "" : that.addData.maplabel;
            that.userIdForPic.memo = that.addData.memo;
            that.userIdForPic.type = that.addData.type;
            that.userIdForPic.worktype = that.addData.worktype;
            that.userIdForPic.tel = that.addData.tel;
            that.$refs.upload.submit();
          } else {
            addMember(
              that.addData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.add = false;
                that.getMemberLists();
                that.getMemberListss();
                that.$message({
                  message: that.$t("staffmanagement.addsuccess"),
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
          }
        }
      });
    },

    // 编辑
    staffEdit(index) {
      this.haveImage = false;
      this.delImage = false;
      if (this.tableData[index].filename) {
        this.fileListEdit = [
          {
            url: host.host + "profile/" + this.tableData[index].filename,
          },
        ];
      } else {
        this.fileListEdit = [];
      }

      this.editData.username = this.tableData[index].username;
      this.editData.birthday =
        this.tableData[index].birthday == null
          ? ""
          : this.tableData[index].birthday;
      this.editData.sex = this.tableData[index].sex;
      this.editData.cardno = this.tableData[index].cardno;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.depart = this.tableData[index].depart;
      this.editData.projectid = this.tableData[index].projectid;
      this.editData.type = this.tableData[index].type;
      this.editData.maplabel = this.tableData[index].maplabel;
      this.editData.memo = this.tableData[index].memo;
      this.editData.tel = this.tableData[index].tel;
      this.editData.id = this.tableData[index].id;
      this.editData.worktype =
        this.tableData[index].worktype == null
          ? ""
          : this.tableData[index].worktype;
      this.editData.filename = this.tableData[index].filename;

      this.projectChanged(this.editData.projectid);
      this.getWorktyper();
      this.getDepart();
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
          that.loading = true;
          that.editData.type = that.ProjectTye;
          if (that.haveImage) {
            that.userIdForPicEdit.id = that.editData.id;
            that.userIdForPicEdit.username = that.editData.username;
            that.userIdForPicEdit.birthday = that.editData.birthday;
            that.userIdForPicEdit.sex = that.editData.sex;
            that.userIdForPicEdit.cardno = that.editData.cardno;
            that.userIdForPicEdit.depart = that.editData.depart;
            that.userIdForPicEdit.maplabel =
              that.editData.maplabel == null ? "" : that.editData.maplabel;
            that.userIdForPicEdit.tel = that.editData.tel;
            that.userIdForPicEdit.memo = that.editData.memo;
            that.userIdForPicEdit.worktype = that.editData.worktype;
            that.userIdForPicEdit.type = that.editData.type;
            that.$refs.upload.submit();
          } else {
            if (that.delImage) {
              that.editData.filename = "";
            }
            updateMember(
              that.editData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.edit = false;
                that.getMemberLists();
                that.$message({
                  message: that.$t("staffmanagement.editsuccess"),
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
        } else {
          return false;
        }
      });
    },

    //行为分析
    staffAction(index) {
      var that = this;
      this.actionData.projectid = this.tableData[index].projectid;
      this.actionData.maplabel = this.tableData[index].maplabel;
      this.actionData.username = this.tableData[index].username;
      if (
        this.tableData[index].maplabel == "" ||
        this.tableData[index].maplabel == null
      ) {
        this.$message({
          message: this.$t("staffmanagement.Pleasecard"),
          type: "warning",
        });
        return;
      }
      this.actions = true;
    },

    searchAction() {
      var that = this;
      let data = {
        projectid: this.actionData.projectid,
        deveui: this.actionData.maplabel,
        username: this.actionData.username,
        begintime: "",
        endtime: "",
        devtype: this.$store.state.intoProjectType == 1 ? 1 : 2,
        timezone: this.$store.state.intoProjectTimezone,
      };
      if (this.actionTime) {
        // 判断是否为24小时间隔
        if (
          this.actionTime[1].getTime() - this.actionTime[0].getTime() >
          86400000
        ) {
          that.$message({
            message: this.$t("staffmanagement.Thehours"),
            type: "warning",
          });
          return;
        }
        let begingTime = that.actionTime[0];
        let endTime = that.actionTime[1];

        begingTime =
          !begingTime || begingTime == ""
            ? ""
            : util.formatDate.format(
                new Date(begingTime),
                "yyyy-MM-dd hh:mm:ss"
              );
        endTime =
          !endTime || endTime == ""
            ? ""
            : util.formatDate.format(new Date(endTime), "yyyy-MM-dd hh:mm:ss");

        if (begingTime.length > 0 && endTime.length > 0) {
          begingTime = Date.parse(new Date(begingTime)) / 1000;
          endTime = Date.parse(new Date(endTime)) / 1000;
        }
        data.begintime = begingTime;
        data.endtime = endTime;
      } else {
        let timee = new Date();
        data.begintime = (Date.parse(new Date()) - 1 * 60 * 60 * 1000) / 1000;
        data.endtime = Date.parse(new Date()) / 1000;
      }
      if (
        this.actionData.maplabel == "" ||
        this.actionData.maplabel == null ||
        this.actionData.username == "" ||
        this.actionData.username == null
      ) {
        this.$message({
          message: this.$t("staffmanagement.cardtime"),
          type: "warning",
        });
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t("tet.Loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".action"),
      });

      getDevGpsAction(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.tranchelist.length == 0) {
            that.$message({
              message: that.$t("staffmanagement.Nodata"),
              type: "warning",
            });
            that.actionTableData = [];
            loading.close();
            return;
          } else {
            that.actionTableData = res.data.tranchelist.reverse();
          }
          for (let i = 0; i < that.actionTableData.length; i++) {
            that.actionTableData[i].gpstime = that.formatDatetime(
              that.actionTableData[i].gpstime
            );
          }
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        loading.close();
      });
    },

    searchActions() {
      var that = this;
      let data = {
        projectid: this.actionData.projectid,
        deveui: this.actionData.maplabel,
        username: this.actionData.username,
        begintime: "",
        endtime: "",
        devtype: this.$store.state.intoProjectType == 1 ? 1 : 2,
        timezone: this.$store.state.intoProjectTimezone,

        postype: 1,
      };
      if (this.actionTime) {
        // 判断是否为24小时间隔
        if (
          this.actionTime[1].getTime() - this.actionTime[0].getTime() >
          86400000
        ) {
          that.$message({
            message: this.$t("staffmanagement.Thehours"),
            type: "warning",
          });
          return;
        }
        let begingTime = that.actionTime[0];
        let endTime = that.actionTime[1];

        begingTime =
          !begingTime || begingTime == ""
            ? ""
            : util.formatDate.format(
                new Date(begingTime),
                "yyyy-MM-dd hh:mm:ss"
              );
        endTime =
          !endTime || endTime == ""
            ? ""
            : util.formatDate.format(new Date(endTime), "yyyy-MM-dd hh:mm:ss");

        if (begingTime.length > 0 && endTime.length > 0) {
          begingTime = Date.parse(new Date(begingTime)) / 1000;
          endTime = Date.parse(new Date(endTime)) / 1000;
        }
        data.begintime = begingTime;
        data.endtime = endTime;
      } else {
        data.begintime = (Date.parse(new Date()) - 1 * 60 * 60 * 1000) / 1000;
        data.endtime = Date.parse(new Date()) / 1000;
      }
      if (
        this.actionData.maplabel == "" ||
        this.actionData.maplabel == null ||
        this.actionData.username == "" ||
        this.actionData.username == null
      ) {
        this.$message({
          message: this.$t("staffmanagement.cardtime"),
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

      getDevGpsAction(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          if (res.data.tranchelist.length == 0) {
            that.$message({
              message: that.$t("staffmanagement.Nodata"),
              type: "warning",
            });
            that.actionTableData = [];
            loading.close();
            return;
          } else {
            that.actionTableData = res.data.tranchelist.reverse();
          }
          for (let i = 0; i < that.actionTableData.length; i++) {
            that.actionTableData[i].gpstime = that.formatDatetime(
              that.actionTableData[i].gpstime
            );
          }
          that.showTrajectorys();
        } else {
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
        }
        loading.close();
      });
    },

    //关闭行为回调
    closeAction() {
      this.actionTableData = [];
    },
    closetrajectoryAction() {
      this.$nextTick(() => {
        this.$refs.trajectory.stop(true);
        this.$refs.trajectory.closeTime();
        this.$refs.trajectory.removeVectorLayer();
      });
    },
    closetrajectoryAction3d() {
      this.$nextTick(() => {
        this.$refs.trajectorys.mapOut();
      });
    },

    // 删除员工
    staffDele(index) {
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
      this.deleStaff = this.tableData[index].username;
      this.deleId = this.tableData[index].id;
      this.delFileName = this.tableData[index].filename;
      this.deleTpl = true;
    },
    deleTrue() {
      var that = this;
      let data = {
        filename: this.delFileName,
        username: this.deleStaff,
        id: this.deleId,
      };
      this.loading = true;
      delMemberById(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.deleTpl = false;
          that.getMemberLists();
          that.getMemberListss();
          that.$message({
            message: that.$t("staffmanagement.delsuccess"),
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

    //搜索
    searchStaff() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getMemberList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          that.$message({
            message: that.$t("staffmanagement.searchsuccess"),
            type: "success",
          });
        }
        this.searchList.count = 10;
      });
    },

    //获取公司下所有的项目,项目选择下拉框
    getProjectLists() {
      var that = this;
      let para = {
        tenantid: this.$store.state.userInfo.tenantid,
      };
      getProjectList(
        para,
        this.$store.state.userInfo.tenantkey,
        this.$store.state.userInfo.tenantid,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          let projectData = res.data.list;
          this.projectTable = res.data.list;
          let projectHash = {};
          //项目下拉选择框
          that.searchSelectProject = projectData.reduce((preVal, curVal) => {
            projectHash[curVal.projectid]
              ? ""
              : (projectHash[curVal.projectid] = true && preVal.push(curVal));
            return preVal;
          }, []);
        }
      });
    },

    //下拉框项目改变触发事件,制作工卡号下拉框
    projectChanged(val) {
      // searchSelectProject
      let that = this;
      for (let i = 0; i < this.searchSelectProject.length; i++) {
        if (val == this.searchSelectProject[i].projectid) {
          that.ProjectTye = this.searchSelectProject[i].type;
        }
      }
      //项目正向
      if (that.ProjectTye == 1) {
        that.maplabelList = [];
        let data = {
          projectid: val,
          devtype: 1,
          workstate: 1,
          inallot: 1,
          inuse: 2,
        };
        getDevDeveui(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.maplabelList = res.data;
            for (let i = 0; i < that.maplabelList.length; i++) {
              that.maplabelList[i] = {
                deveui: that.maplabelList[i],
              };
            }
          }
        });
      } else if (that.ProjectTye == 2) {
        that.maplabelList = [];
        //项目反向
        let data = {
          projectid: val,
          inallot: 1,
          inuse: 2,
          workstate: 1,
          type: 4,
        };
        getBeaconid(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.maplabelList = res.data;
            for (let i = 0; i < that.maplabelList.length; i++) {
              that.maplabelList[i] = {
                deveui: that.maplabelList[i].beaconid,
                major: that.maplabelList[i].major,
                minor: that.maplabelList[i].minor,
              };
            }
          }
        });
      }
    },

    // 解除绑定
    removeStaffs(index) {
      var that = this;
      this.removeStaffDatas = {
        ids: "",
        usernamelist: "",
        projectid: this.projectid,
        maplabellist: "",
      };
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("staffmanagement.staffrule"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].maplabel == "") {
          this.$message({
            message: this.$t("staffmanagement.staffrule1"),
            type: "warning",
          });
          return;
        }
        this.removeStaffDatas.ids += this.multipleSelection[i].id + ",";
        this.removeStaffDatas.usernamelist +=
          this.multipleSelection[i].username + ",";
        this.removeStaffDatas.maplabellist +=
          this.multipleSelection[i].maplabel + ",";
      }

      // 去掉最后一个逗号
      that.removeStaffDatas.ids = that.removeStaffDatas.ids.slice(
        0,
        that.removeStaffDatas.ids.length - 1
      );
      that.removeStaffDatas.usernamelist =
        that.removeStaffDatas.usernamelist.slice(
          0,
          that.removeStaffDatas.usernamelist.length - 1
        );
      that.removeStaffDatas.maplabellist =
        that.removeStaffDatas.maplabellist.slice(
          0,
          that.removeStaffDatas.maplabellist.length - 1
        );

      this.removeDatas = this.multipleSelection;
      this.removeStaff = true;
    },

    removeTrue() {
      var that = this;
      this.loading = true;
      updateMemberRemoveLable(
        this.removeStaffDatas,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.removeStaff = false;
          that.getMemberLists();
          that.$message({
            message: that.$t("staffmanagement.staffrule2"),
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
    //角色下拉框
    getWorktyper() {
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      getMemberType(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.worktypeList = res.data;
        }
      });
    },
    // 点击跳转到定位页面
    goLocation(index) {
      var that = this;
      if (
        this.tableData[index].maplabel == "" ||
        this.tableData[index].maplabel == null
      ) {
        this.$message({
          message: this.$t("staffmanagement.Pleasecard"),
          type: "warning",
        });
        return;
      }
      let data = {
        deveui: this.tableData[index].maplabel,
        projectid: this.tableData[index].projectid,
        devtype: 1,
      };
      getDevGpsOne(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            if (res.data.x == "" && res.data.y == "") {
              that.$message({
                message: that.$t("LocationIndoor.tet3"),
                type: "warning",
              });
              return;
            }
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
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
  },
  beforeMount() {
    if (this.$route.query.pertype == 1) {
      this.searchList.ontime = this.$route.query.timeStamp;
    } else if (this.$route.query.pertype == 2) {
      this.searchList.offtime = this.$route.query.timeStamp;
    }
    if (this.$route.query.euis) {
      var that = this;
      let data = {
        projectid: this.projectid,
        euis: this.$store.state.staffEuis,
        page: 1,
        count: 20,
        flag: this.$route.query.flag,
      };
      getMemberByEuis(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
        }
      });
    } else if (this.$route.query.username) {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.searchList = {
        username: this.$route.query.username, //员工名称
        sex: "", //性别
        cardno: "", //工号
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        depart: "", //部门
        maplabel: "", //工卡号或信标号
        page: 1,
        count: 20,
        ontime: "", //在线时间
        offtime: "", //离线时间
      };
      this.searchStaff();
    } else {
      this.getMemberLists();
    }
    this.getProjectLists();
    this.getMemberListss();
    this.getDepart();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;

      Object.assign(this.$data.sexType, this.$options.data.call(this).sexType);
      Object.assign(
        this.$data.editRules,
        this.$options.data.call(this).editRules
      );
    },
  },
};
</script>

<style scoped>
#articleImageFile,
#articleWorktypeFile {
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
.icon_button {
  padding: 2px 16px !important;
}
.selects button {
  width: 100%;
  text-align: left;
}
/* 按钮改变颜色 */
.edits:hover {
  background-color: rgb(25, 86, 201);
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

.demo-form-inline >>> .el-select .el-input__inner {
  padding-right: 20px;
}

.demo-form-inline >>> .el-input__suffix {
  right: 0 !important;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.actionDetails {
  /* height: 50px; */
  max-height: 500px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.actionDetails >>> .ivu-timeline {
  width: 23%;
  margin-left: 2%;
  text-align: left;
}

.action .el-dialog__body .el-form .el-form-item {
  padding-right: 0px !important;
}

.action .demo-form-inline .el-form-item .el-form-item__content {
  width: 100%;
}
/* .move {
  transform: translateX(4px);
} */

.trajectory >>> .el-dialog {
  height: 85%;
  margin-top: 2% !important;
}
.trajectory >>> .el-dialog__header {
  height: 4%;
}
.trajectory >>> .el-dialog__headerbtn {
  top: 1% !important;
}
.trajectory >>> .el-dialog__body {
  height: 96%;
  padding-top: 10px !important;
}
.import_type {
  white-space: nowrap;
}
.work_type_list {
  display: flex;
}
.work_type_list >>> .el-form-item__content {
  display: flex;
  width: 100%;
  margin-left: 80px !important;
}
</style>

