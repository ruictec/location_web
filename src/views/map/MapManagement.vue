<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum == 3 || contrForPrionum == 4">
          <Project />
        </el-aside>
        <el-main>
          <div
            class="map_pinut"
            v-if="contrForPrionum == 3 || contrForPrionum == 4"
          >
            <el-breadcrumb separator="/" style="margin-left: 0">
              <el-breadcrumb-item :to="{ path: '/projectmanagement' }">{{
                $t("index.projectmanagement")
              }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ intoProjectName }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{
                $t("index.Mapmanagement")
              }}</el-breadcrumb-item>
            </el-breadcrumb>

            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="display: flex; white-space: nowrap; justify-content: end"
            >
              <el-form-item
                style="display: flex; margin-right: 0"
                :label="$t('mapmanagements.Mapnumber')"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.mapid"
                  clearable
                  filterable
                  remote
                  :remote-method="remoteMapMethod"
                  :placeholder="$t('staffmanagement.text')"
                >
                  <el-option
                    v-for="item in mapOptions"
                    :key="item.maplabel"
                    :label="item.mapname"
                    :value="item.maplabel"
                  >
                    <span style="float: left">{{ item.mapname }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.maplabel }}</span
                    ></el-option
                  >
                </el-select>
              </el-form-item>
              <el-form-item style="display: flex; margin-left: 2%">
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("mapmanagements.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("mapmanagements.reset")
                }}</el-button>
                <el-popover v-model="choseMap">
                  <div style="display: flex">
                    <el-button size="mini" type="primary" @click="addMap2D()">{{
                      $t("mapmanagements.sDmap")
                    }}</el-button>
                    <el-button type="primary" size="mini" @click="addMap3D()">{{
                      $t("mapmanagements.tDmap")
                    }}</el-button>
                  </div>
                  <el-button type="primary" class="del move" slot="reference">{{
                    $t("mapmanagements.Addmap")
                  }}</el-button>
                </el-popover>
              </el-form-item>
            </el-form>
          </div>
          <div
            class="map_pinut"
            style="display: flex"
            v-if="contrForPrionum == 5"
          >
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="display: flex; white-space: nowrap; margin-left: 2%"
            >
              <el-form-item
                style="display: flex; margin-right: 0"
                :label="$t('mapmanagements.Mapnumber')"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.mapid"
                  clearable
                  filterable
                  remote
                  :remote-method="remoteMapMethod"
                  :placeholder="$t('staffmanagement.text')"
                >
                  <el-option
                    v-for="item in mapOptions"
                    :key="item.maplabel"
                    :label="item.mapname"
                    :value="item.maplabel"
                  >
                    <span style="float: left">{{ item.mapname }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.maplabel }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="display: flex; margin-left: 2%; margin-right: 2%"
              >
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("mapmanagements.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("mapmanagements.reset")
                }}</el-button>
                <el-popover placement="top" v-model="choseMap">
                  <div style="display: flex">
                    <el-button size="mini" type="primary" @click="addMap2D()">{{
                      $t("mapmanagements.sDmap")
                    }}</el-button>
                    <el-button type="primary" size="mini" @click="addMap3D()">{{
                      $t("mapmanagements.tDmap")
                    }}</el-button>
                  </div>
                  <el-button type="primary" class="del move" slot="reference">{{
                    $t("mapmanagements.Addmap")
                  }}</el-button>
                </el-popover>
              </el-form-item>
            </el-form>
          </div>
          <div
            class="map_pinut"
            v-if="contrForPrionum == 1 || contrForPrionum == 2"
          >
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
                :label="$t('mapmanagement.mapid')"
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.mapid"
                  clearable
                  filterable
                  remote
                  :remote-method="remoteMapMethod"
                  :placeholder="$t('staffmanagement.text')"
                >
                  <el-option
                    v-for="item in mapOptions"
                    :key="item.maplabel"
                    :label="item.mapname"
                    :value="item.maplabel"
                  >
                    <span style="float: left">{{ item.mapname }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.maplabel }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagement.statusstr1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.status"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in searchStatus"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: 1%">
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("terminal.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("terminal.reset")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 展示 -->
          <div class="content_map">
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
            >
              <el-table-column
                property="customername"
                :label="$t('mapmanagement.customername')"
                show-overflow-tooltip
                min-width="100"
                align="center"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              ></el-table-column>
              <el-table-column
                property="mapid"
                :label="$t('mapmanagements.mapnumber')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="mapname"
                :label="$t('mapmanagements.mapname')"
                show-overflow-tooltip
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                property="statusstr"
                :label="$t('mapmanagements.ApprovalStatus')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>

              <el-table-column
                property="instruction"
                :label="$t('mapmanagements.Auditopinion')"
                show-overflow-tooltip
                min-width="95"
                align="center"
              ></el-table-column>

              <el-table-column
                property="maptypestr"
                :label="$t('mapmanagements.mapdimension')"
                show-overflow-tooltip
                min-width="90"
                align="center"
              ></el-table-column>
              <el-table-column
                property="width"
                :label="$t('mapmanagements.mapwidth')"
                show-overflow-tooltip
                min-width="110"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.mapwidth")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("mapmanagements.text1") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="length"
                :label="$t('mapmanagements.maplength')"
                show-overflow-tooltip
                min-width="110"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.maplength")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("mapmanagements.text2") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="realwidth"
                :label="$t('mapmanagements.actualwidthofthemap')"
                show-overflow-tooltip
                min-width="140"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.actualwidthofthemap")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("mapmanagements.text3") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="reallength"
                :label="$t('mapmanagements.actuallengthofthemap')"
                show-overflow-tooltip
                min-width="140"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.actuallengthofthemap")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("mapmanagements.text4") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="distance"
                :label="$t('mapmanagements.Sensitivity')"
                show-overflow-tooltip
                min-width="88"
                align="center"
              ></el-table-column>
              <el-table-column
                property="active"
                :label="$t('mapmanagements.Activity')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              ></el-table-column>
              <el-table-column
                property="creattime"
                :label="$t('mapmanagements.mapcreationtime')"
                show-overflow-tooltip
                :formatter="formatDateCreattime"
                min-width="115"
                align="center"
              ></el-table-column>
              <el-table-column
                property="edittime"
                :label="$t('mapmanagements.mapedittime')"
                show-overflow-tooltip
                :formatter="formatDateEdittime"
                min-width="115"
                align="center"
              ></el-table-column>
              <el-table-column
                property="audittime"
                :label="$t('mapmanagements.mapreviewtime')"
                show-overflow-tooltip
                :formatter="formatDateAudittime"
                min-width="115"
                align="center"
              ></el-table-column>

              <el-table-column
                property="sysmemo"
                :label="$t('mapmanagement.sysmemo')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
                min-width="120"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('mapmanagements.Remark')"
                align="center"
                show-overflow-tooltip
                v-if="contrForPrionum != 1 && contrForPrionum != 2"
                min-width="120"
              ></el-table-column>

              <el-table-column
                fixed="right"
                :label="$t('mapmanagements.operate')"
                align="center"
                min-width="80"
                v-if="
                  contrForPrionum == 1 ||
                  contrForPrionum == 2 ||
                  contrForPrionum == 3 ||
                  contrForPrionum == 4 ||
                  contrForPrionum == 5
                "
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
                          @click="editMap(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          >{{ $t("mapmanagements.edit") }}</el-button
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
                          @click="delMap(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          >{{ $t("mapmanagements.delete") }}</el-button
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
                          @click="checkMap(scope.$index)"
                          v-if="contrForPrionum == 1 || contrForPrionum == 2"
                          >{{ $t("mapmanagements.examine") }}</el-button
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
                :page-size="20"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 添加2D -->
          <el-dialog
            :title="$t('mapmanagements.text5')"
            width="30%"
            :visible.sync="add2D"
            style="text-align: center"
            @close="addCancel2D('addData')"
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
            >
              <div slot="tip" class="el-upload__tip">
                {{ $t("mapmanagements.text6") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="addData"
              label-width="120px"
              ref="addData"
              style="text-align: left; margin-top: 4%"
              :rules="addRules"
            >
              <el-form-item
                :label="$t('mapmanagements.Mapname')"
                prop="mapname"
              >
                <el-input v-model="addData.mapname"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Actualwidth')"
                prop="realwidth"
                class="actual_width"
              >
                <el-input v-model="addData.realwidth"></el-input>
                <el-button
                  type="primary"
                  class="reset"
                  @click="chooseMapPoint()"
                  >{{ $t("mapmanagements.mapselection") }}</el-button
                >
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <div slot="content">
                    <p>
                      {{ $t("mapmanagements.text7") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Actuallength')"
                prop="reallength"
              >
                <el-input v-model="addData.reallength"></el-input>
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
                      {{ $t("mapmanagements.text8") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.sensitivity')"
                prop="distance"
              >
                <el-input v-model="addData.distance"></el-input>
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
                      {{ $t("mapmanagements.text9") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.activity')"
                prop="active"
              >
                <el-input v-model="addData.active"></el-input>
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
                      {{ $t("mapmanagements.text10") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('mapmanagements.Project')"
                prop=""
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  v-model="addData.projectid"
                  clearable
                  filterable
                  disabled
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
              <el-form-item :label="$t('mapmanagements.remark')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel2D('addData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addTrue2D('addData')">{{
                $t("warning.Sure")
              }}</el-button>
              <el-button type="primary" @click="auditTrue2D('addData')">{{
                $t("mapmanagements.Submitreview")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 添加3D -->
          <el-dialog
            :title="$t('mapmanagements.text5')"
            width="30%"
            :visible.sync="add3D"
            style="text-align: center"
            @close="addCancel3D('addData')"
          >
            <el-form
              :model="addData"
              label-width="120px"
              ref="addData"
              style="text-align: left; margin-top: 4%"
              :rules="addRules"
            >
              <el-form-item
                :label="$t('mapmanagements.Mapname')"
                prop="mapname"
              >
                <el-input v-model="addData.mapname"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.mapNumber')"
                prop="filename"
              >
                <el-input v-model="addData.filename"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.appName')"
                prop="appname"
              >
                <el-input v-model="addData.appname"></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.appKey')" prop="mapkey">
                <el-input v-model="addData.mapkey"></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.themeId')" prop="">
                <el-input v-model="themeId"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.sensitivity')"
                prop="distance"
              >
                <el-input v-model="addData.distance"></el-input>
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
                      {{ $t("mapmanagements.text9") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.activity')"
                prop="active"
              >
                <el-input v-model="addData.active"></el-input>
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
                      {{ $t("mapmanagements.text10") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.scale')" prop="scale">
                <el-input v-model="addData.scale"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Project')"
                prop=""
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  v-model="addData.projectid"
                  clearable
                  filterable
                  disabled
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
              <el-form-item :label="$t('mapmanagements.remark')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                ></el-input>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel3D('addData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addTrue3D('addData')">{{
                $t("warning.Sure")
              }}</el-button>
              <el-button type="primary" @click="auditTrue3D('addData')">{{
                $t("mapmanagements.Submitreview")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 地图预览 -->
          <el-dialog
            width="60%"
            class="mapview"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            @close="removeMap()"
          >
            <!-- <img width="100%" :src="dialogImageUrl" alt /> -->
            <div class="mapContent" ref="mapContent">
              <div id="map" ref="map"></div>
              <p class="map_tips">
                {{ $t("mapmanagements.text11")
                }}<input
                  type="text"
                  name="actualrange"
                  v-model="actualrange"
                  ref="actualrange"
                  :class="featureNum == 2 ? 'actualrange' : 'actualrange_dis'"
                  :disabled="featureNum != 2"
                />{{ $t("mapmanagements.text12") }}
              </p>
            </div>
            <!-- <el-form label-width="120px" style="text-align: left; width: 50%">
              <el-form-item label="实际距离：" prop="">
                <el-input
                  v-model="actualrange"
                  ref="actualrange"
                  :disabled="featureNum != 2"
                ></el-input>
              </el-form-item>
            </el-form> -->

            <div class="mapview_dialog_footer">
              <el-button @click="dialogVisible = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="distanceTrue()">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 删除 -->
          <el-dialog
            :title="$t('mapmanagements.text13')"
            width="30%"
            :visible.sync="del"
            style="text-align: center"
          >
            <div class="imageSize">
              <el-image
                style="width: 100px; height: 100px"
                :src="imgUrl"
                :preview-src-list="srcList"
              >
              </el-image>
            </div>
            <el-form
              :model="delData"
              label-width="100px"
              ref="delData"
              style="text-align: left; margin-top: 4%"
            >
              <el-form-item :label="$t('mapmanagements.Mapname')">
                <el-input v-model="delData.mapname" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Actualwidth')">
                <el-input v-model="delData.realwidth" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Actuallength')">
                <el-input v-model="delData.reallength" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.sensitivity')">
                <el-input v-model="delData.distance" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.activity')">
                <el-input v-model="delData.active" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Auditstatus')">
                <el-select
                  v-model="delData.status"
                  disabled
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.remark')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="delData.memo"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="del = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="delTrue('delData')">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 编辑2D 不可更该地图的编辑页面-->
          <el-dialog
            width="30%"
            :visible.sync="edit2D"
            style="text-align: center"
          >
            <div class="imageSize">
              <el-image
                style="width: 100px; height: 100px"
                :src="imgUrl"
                :preview-src-list="srcList"
              >
              </el-image>
            </div>
            <el-form
              :model="editData"
              label-width="120px"
              ref="editData"
              style="text-align: left; margin-top: 4%"
              :rules="addRules"
            >
              <el-form-item
                :label="$t('mapmanagements.Mapname')"
                prop="mapname"
              >
                <el-input
                  v-model="editData.mapname"
                  :disabled="passEdit"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Actualwidth')"
                prop="realwidth"
              >
                <el-input v-model="editData.realwidth"></el-input>
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
                      {{ $t("mapmanagements.text15") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Actuallength')"
                prop="reallength"
              >
                <el-input v-model="editData.reallength"></el-input>
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
                    <p>{{ $t("mapmanagements.text16") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.sensitivity')"
                prop="distance"
              >
                <el-input v-model="editData.distance"></el-input>
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
                      {{ $t("mapmanagements.text17") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.activity')"
                prop="active"
              >
                <el-input v-model="editData.active"></el-input>
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
                      {{ $t("mapmanagements.text18") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Project')"
                prop=""
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  v-model="editData.projectid"
                  clearable
                  filterable
                  :disabled="passEdit"
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
              <el-form-item :label="$t('mapmanagements.Auditstatus')">
                <el-select
                  v-model="editData.status"
                  disabled
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagement.sysmemo1')"
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
                :label="$t('mapmanagements.remark')"
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
              <el-button @click="edit2D = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="editTrue('editData')">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 企业级编辑2D，可以修改地图 -->
          <el-dialog
            :title="$t('mapmanagements.text14')"
            width="30%"
            :visible.sync="editCompany2D"
            style="text-align: center"
            @close="closeMap()"
          >
            <el-upload
              :disabled="changeImg"
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
              :on-change="choseApi"
              :on-exceed="handleExceedEdit"
              :before-upload="beforeAvatarUploadEdit"
            >
              <div slot="tip" class="el-upload__tip">
                {{ $t("mapmanagements.text6") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="editDatas"
              label-width="120px"
              ref="editDatas"
              style="text-align: left; margin-top: 4%"
              :rules="addRules"
            >
              <el-form-item
                :label="$t('mapmanagements.Mapname')"
                prop="mapname"
              >
                <el-input
                  v-model="editDatas.mapname"
                  :disabled="changeImg"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Actualwidth')"
                prop="realwidth"
                class="actual_width"
              >
                <el-input v-model="editDatas.realwidth"></el-input>
                <el-button
                  type="primary"
                  class="reset"
                  @click="chooseMapPoint()"
                  >{{ $t("mapmanagements.mapselection") }}</el-button
                >
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <div slot="content">
                    <p>
                      {{ $t("mapmanagements.text15") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Actuallength')"
                prop="reallength"
              >
                <el-input v-model="editDatas.reallength"></el-input>
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
                    <p>{{ $t("mapmanagements.text16") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.sensitivity')"
                prop="distance"
              >
                <el-input v-model="editDatas.distance"></el-input>
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
                      {{ $t("mapmanagements.text17") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.activity')"
                prop="active"
              >
                <el-input v-model="editDatas.active"></el-input>
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
                      {{ $t("mapmanagements.text18") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Project')"
                prop=""
                v-if="contrForPrionum == 3 || contrForPrionum == 4"
              >
                <el-select
                  v-model="editDatas.projectid"
                  clearable
                  filterable
                  disabled
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
              <el-form-item :label="$t('mapmanagements.Auditstatus')">
                <el-select
                  v-model="editDatas.status"
                  disabled
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagement.sysmemo1')"
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
                :label="$t('mapmanagements.remark')"
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
              <el-button @click="editCompany2D = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="editTrues('editDatas')">{{
                $t("warning.Sure")
              }}</el-button>
              <el-button
                type="primary"
                @click="auditTrues('editDatas')"
                v-if="auditBtn"
                >{{ $t("mapmanagements.Submitreview") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 编辑3D地图 -->
          <el-dialog
            :title="$t('mapmanagements.text14')"
            width="60%"
            :visible.sync="edit3D"
            style="text-align: center"
            @opened="onmap()"
            @close="closeCheck('editData')"
          >
            <div class="check_3d_box">
              <div class="check_3d_info">
                <el-form
                  :model="editData"
                  label-width="120px"
                  ref="editData"
                  style="text-align: left; margin-top: 4%"
                  :rules="addRules"
                >
                  <el-form-item
                    :label="$t('mapmanagements.Mapname')"
                    prop="mapname"
                  >
                    <el-input v-model="editData.mapname"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.mapNumber')"
                    prop="filename"
                  >
                    <el-input v-model="editData.filename" disabled></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.themeId')" prop="">
                    <el-input v-model="themeId"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.sensitivity')"
                    prop="distance"
                  >
                    <el-input v-model="editData.distance"></el-input>
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
                          {{ $t("mapmanagements.text17") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.activity')"
                    prop="active"
                  >
                    <el-input v-model="editData.active"></el-input>
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
                          {{ $t("mapmanagements.text18") }}
                        </p>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.scale')"
                    prop="scale"
                  >
                    <el-input v-model="editData.scale"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.Project')"
                    prop=""
                    v-if="contrForPrionum == 3 || contrForPrionum == 4"
                  >
                    <el-select
                      v-model="editData.projectid"
                      clearable
                      filterable
                      :disabled="passEdit"
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
                  <el-form-item :label="$t('mapmanagements.Auditstatus')">
                    <el-select
                      v-model="editData.status"
                      disabled
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in statusList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagement.sysmemo1')"
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
                    :label="$t('mapmanagements.remark')"
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
                  <el-button @click="closeCheck('editData')">{{
                    $t("warning.Cancel")
                  }}</el-button>
                  <el-button type="primary" @click="editTrue3D('editData')">{{
                    $t("warning.Sure")
                  }}</el-button
                  ><el-button
                    type="primary"
                    @click="auditTrues3D('editData')"
                    v-if="auditBtn"
                  >
                    {{ $t("mapmanagements.Submitreview") }}
                  </el-button>
                </div>
              </div>
              <div class="check_3d_map">
                <div
                  id="fengMap"
                  v-loading="loading"
                  v-if="edit3D"
                  :element-loading-text="$t('mapmanagements.text19')"
                ></div>
              </div>
            </div>
          </el-dialog>

          <!-- 审核 -->
          <el-dialog
            :title="$t('mapmanagements.text20')"
            width="30%"
            :visible.sync="check"
            style="text-align: center"
            @close="checkCancle('checkData')"
          >
            <div class="imageSize">
              <el-image
                style="width: 100px; height: 100px"
                :src="imgUrl"
                :preview-src-list="srcList"
              >
              </el-image>
            </div>
            <el-form
              :model="checkData"
              label-width="150px"
              ref="checkData"
              style="text-align: left; margin-top: 4%"
              :rules="addRules"
            >
              <el-form-item :label="$t('mapmanagements.Mapname')">
                <el-input v-model="checkData.mapname" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.imagewidth')">
                <el-input v-model="imageInfo.height" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.imagelength')">
                <el-input v-model="imageInfo.width" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Actualwidth')">
                <el-input v-model="checkData.realwidth" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Actuallength')">
                <el-input v-model="checkData.reallength" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.sensitivity')">
                <el-input v-model="checkData.distance" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.activity')">
                <el-input v-model="checkData.active" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Projectname')" prop="">
                <el-input v-model="checkData.projectname" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Projectid')" prop="">
                <el-input v-model="checkData.projectid" disabled></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('mapmanagements.Auditstatus')"
                prop="status"
              >
                <el-select
                  v-model="checkData.status"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Reviewcomments')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="255"
                  v-model="checkData.instruction"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.Systemremarks')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="checkData.sysmemo"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.remark')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="checkData.memo"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="checkCancle('checkData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="checkTrue('checkData')">{{
                $t("warning.Sure")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 审核3D -->
          <el-dialog
            :title="$t('mapmanagements.text20')"
            width="60%"
            :visible.sync="check3D"
            @opened="onmap()"
            @close="closeCheck('checkData')"
            style="text-align: center"
          >
            <div class="check_3d_box">
              <div class="check_3d_info">
                <el-form
                  :model="checkData"
                  label-width="150px"
                  ref="checkData"
                  style="text-align: left; margin-top: 4%"
                  :rules="addRules"
                >
                  <el-form-item :label="$t('mapmanagements.Mapname')">
                    <el-input v-model="checkData.mapname" disabled></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.Mapnumber')">
                    <el-input v-model="checkData.mapid" disabled></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.sensitivity')">
                    <el-input v-model="checkData.distance" disabled></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.activity')">
                    <el-input v-model="checkData.active" disabled></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.Projectname')"
                    prop=""
                  >
                    <el-input
                      v-model="checkData.projectname"
                      disabled
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.Projectid')" prop="">
                    <el-input v-model="checkData.projectid" disabled></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.Auditstatus')"
                    prop="status"
                  >
                    <el-select
                      v-model="checkData.status"
                      clearable
                      filterable
                      :placeholder="$t('terminal.choose')"
                    >
                      <el-option
                        v-for="item in statusList"
                        :key="item.index"
                        :label="item.value"
                        :value="item.index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.Reviewcomments')">
                    <el-input
                      type="textarea"
                      show-word-limit
                      maxlength="255"
                      v-model="checkData.instruction"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.Systemremarks')">
                    <el-input
                      type="textarea"
                      show-word-limit
                      maxlength="64"
                      v-model="checkData.sysmemo"
                      disabled
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('mapmanagements.remark')">
                    <el-input
                      type="textarea"
                      show-word-limit
                      maxlength="64"
                      v-model="checkData.memo"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="closeCheck('checkData')">{{
                    $t("warning.Cancel")
                  }}</el-button>
                  <el-button
                    type="primary"
                    :disabled="clickTrue"
                    @click="checkTrue('checkData')"
                    >{{ $t("warning.Sure") }}</el-button
                  >
                </div>
              </div>
              <div class="check_3d_map">
                <div
                  id="fengMap"
                  v-if="check3D"
                  v-loading="loading"
                  :element-loading-text="$t('mapmanagements.text19')"
                ></div>
              </div>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import fengmap from "fengmap/build/fengmap.map.min"; //核心包
import "fengmap/build/fengmap.plugin.ui.min"; //UI控件包
import "fengmap/build/fengmap.analyser.min"; //分析器包
import "fengmap/build/fengmap.plugin.navi.min"; //导航包
import "fengmap/build/fengmap.effect.min"; //特效包
import "fengmap/build/fengmap.plugin.markers.min"; //特殊标注包
import "fengmap/build/fengmap.plugin.draw.min"; //绘图包
import "fengmap/build/fengmap.plugin.location.min"; //位置服务相关功能包
import "fengmap/build/fengmap.plugin.export.min"; //打印/出图包
import "fengmap/build/fengmap.plugin.layers.min"; //附加图层包
import "fengmap/build/fengmap.plugin.debug.min"; //性能监控包
import "fengmap/build/toolBarStyle.css";

import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";

import host from "../../host";

import "ol/ol.css";
import Map from "ol/Map";
import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { getCenter } from "ol/extent";

import OlFeature from "ol/Feature";
import OlGeomPoint from "ol/geom/Point";
import OlSourceVector from "ol/source/Vector";
import OlLayerVector from "ol/layer/Vector";
import OlStyleStyle from "ol/style/Style";
import OlStyleIcon from "ol/style/Icon";
import {
  addMap,
  getMapInfoList,
  delMapInfo,
  updateMapInfo,
  getProjectListByTenantid,
  auditMapInfo,
  addMapInfo,
} from "../../axios/api";
export default {
  components: {
    Menu,
    Project,
  },
  name: "MapManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      // 地图相关
      map: null,
      mapName: "map",
      draw: "",
      snap: "",

      choseMap: false,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectName: this.$store.state.intoProjectName,
      tableData: [],
      searchList: {
        mapid: "",
        status: "",
        page: 1,
        count: 20,
        projectid: this.$store.state.projectid,
      },
      currentPage1: 1,
      total: 0,
      add2D: false,
      add3D: false,
      addData: {
        mapname: "",
        filename: "",
        tenantid: this.$store.state.userInfo.tenantid,
        width: "",
        length: "",
        memo: "",
        projectid: "",
        distance: "",
        reallength: "",
        realwidth: "",
        maptype: "",
        active: "",
        mapkey: "",
        appname: "",
        scale: 1,
      },
      addRules: {
        scale: [
          {
            pattern: /^\+?\d*$/,
            message: this.$t("mapmanagement.tit"),
            trigger: "blur",
          },
        ],
        mapkey: [
          {
            required: true,
            message: this.$t("mapmanagements.Please3dmapkey"),
            trigger: "blur",
          },
        ],
        appname: [
          {
            required: true,
            message: this.$t("mapmanagements.Please3dmapkeyName"),
            trigger: "blur",
          },
        ],
        mapname: [
          {
            required: true,
            message: this.$t("mapmanagements.Pleasemapname"),
            trigger: "blur",
          },
        ],
        filename: [
          {
            required: true,
            message: this.$t("mapmanagements.Please3dmapname"),
            trigger: "blur",
          },
        ],
        realwidth: [
          {
            // pattern: /^\+?[1-9]\d*$/,
            pattern: /^\+?\d*$/,
            message: this.$t("mapmanagement.tit"),
            trigger: "blur",
          },
        ],
        reallength: [
          {
            // pattern: /^\+?[1-9]\d*$/,
            pattern: /^\+?\d*$/,
            message: this.$t("mapmanagement.tit"),
            trigger: "blur",
          },
        ],
        distance: [
          {
            pattern: /^\+?\d*$/,
            message: this.$t("mapmanagement.tit"),
            trigger: "blur",
          },
        ],
        active: [
          {
            pattern: /^((0+)(\.\d{1})|1|0?)$/,
            message: this.$t("mapmanagement.tit1"),
            trigger: "blur",
          },
        ],
        width: [
          {
            required: true,
            message: this.$t("mapmanagement.mapwidthrule"),
            trigger: "blur",
          },
          {
            required: true,
            // pattern: /^(([1-9]\d{1,2}(\.\d{1,2})?)|\d((\.\d{1,2})?)|1000|1000.0|1000.00)$/,
            // message: "0-1000 meters to two decimal places",
            // message: "0-1000米，精确到小数点后两位",
            pattern: /^[1-9][0-9]{0,2}$|^1000$/,
            message: this.$t("mapmanagement.mapintrule"),
            trigger: "blur",
          },
        ],
        length: [
          {
            required: true,
            message: this.$t("mapmanagement.mapheightrule"),
            trigger: "blur",
          },
          {
            required: true,
            // pattern: /^(([1-9]\d{1,2}(\.\d{1,2})?)|\d((\.\d{1,2})?)|1000|1000.0|1000.00)$/,
            // message: "0-1000 meters to two decimal places",
            // message: "0-1000米，精确到小数点后两位",
            pattern: /^[1-9][0-9]{0,2}$|^1000$/,
            message: this.$t("mapmanagement.mapintrule"),
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: this.$t("mapmanagement.selectmap"),
            trigger: "change",
          },
        ],
      },

      projectList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      fileListAdd: [],

      fileListEdit: [],
      userIdForPic: {}, //添加图片携带参数
      userIdForPicEdit: {}, //编辑图片携带参数
      ImagePath: host.host + "map/addMapInfoAndMapFile",
      ImagePathEdit: host.host + "map/updateMapFile",
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
      pageCount: 20,
      edit2D: false,
      edit3D: false,
      editCompany2D: false,
      changeImg: false, //判断地图是否可以更换以及是否只能编辑备注，如果地图处于使用状态，就不可更换地图,
      editData: {
        status: "",
        mapname: "",
        mapid: "",
        width: "",
        length: "",
        instruction: "",
        memo: "",
        sysmemo: "",
        projectid: "",
        realwidth: "",
        reallength: "",
        distance: "",
        active: "",
        scale: "",
      },
      editDatas: {
        status: "",
        mapname: "",
        mapid: "",
        width: "",
        length: "",
        instruction: "",
        memo: "",
        sysmemo: "",
        projectid: "",
        realwidth: "",
        reallength: "",
        distance: "",
        active: "",
        scale: "",
      },
      passEdit: false, //系统级别管理员不可已修改的地方
      needChangeAPI: false, //用来判断是否要修改choseApiEdit
      choseApiEdit: false, //根据编辑的时候有没有修改过图片来判断选择哪个接口
      // projectEdit: false, //企业级别的管理员在地图已使用的时候不可以修改所属项目
      del: false,
      delData: {},
      check: false,
      check3D: false,
      clickTrue: true,
      map3d: null,
      themeId: "", //3D地图主题id
      fmapId: "",
      fmapKey: "",
      fmapName: "",
      loading: true,
      scrollFloorControl: "",
      checkData: {},

      auditBtn: "", //编辑页面是否显示提交审核的按钮

      imgUrl: "",
      imageInfo: {}, //原始图片的分辨率，用来审核用户添加的长宽比例
      srcList: [],
      searchStatus: [
        {
          index: 1,
          value: "Draft",
        },
        {
          index: 2,
          value: "Audit",
        },
        {
          index: 3,
          value: "Pass",
        },
        {
          index: 4,
          value: "Fail",
        },
        {
          index: 5,
          value: "Lock",
        },
      ],
      statusList: [
        {
          index: 1,
          value: "Draft",
        },
        {
          index: 2,
          value: "Audit",
        },
        {
          index: 3,
          value: "Pass",
        },
        {
          index: 4,
          value: "Fail",
        },
        {
          index: 5,
          value: "Lock",
        },
      ],
      mapIdList: [],
      featureNum: 0,
      actualrange: "",
      imageX: "",
      imageY: "",

      //输入框模糊查询
      mapLoading: false,
      mapOptions: [],
    };
  },
  methods: {
    // 初始话地图
    mapInit(x, y) {
      var that = this;
      that.actualrange = "";
      var extent = [0, 0, x, y];
      var projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      setTimeout(() => {
        this.$refs.map.style.width = "100%";
        this.$refs.map.style.height = "90%";
        this.map = new Map({
          layers: [
            new ImageLayer({
              source: new Static({
                url: that.dialogImageUrl,
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
        // this.addSubPolygon();
        // this.selectSingleClick();
        this.mapClick();
        // this.mapRightClick(that.map);
      }, 0);
    },
    removeMap() {
      this.map.setTarget(undefined);
      this.featureNum = 0;
    },
    mapClick() {
      var that = this;
      var coodinate;
      this.mapClickEvent = this.map.on("click", (evt) => {
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            coodinate = evt.coordinate;
            return feature;
          }
        );
        if (feature == undefined) {
          if (that.featureNum == 2) return;
          that.featureNum += 1;
          coodinate = evt.coordinate;
          let style = new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 0.5],
              src: "../../../static/near.png",
              scale: 0.3,
            }),
          });

          var startMarker = new OlFeature({
            x: coodinate[0],
            y: coodinate[1],
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
          if (that.featureNum == 2) {
            this.$nextTick(function () {
              that.$refs.actualrange.focus();
            });
          } else {
            that.actualrange = "";
          }
        } else {
          that.removeFeature(feature);
          that.actualrange = "";
        }
      });
    },
    removeFeature(feature) {
      var that = this;
      let LayerArrays = this.map.getLayers().getArray();
      for (let i = 1; i < LayerArrays.length; i++) {
        if (
          LayerArrays[i].getSource().getFeatures()[0].values_.x ==
            feature.values_.x &&
          LayerArrays[i].getSource().getFeatures()[0].values_.y ==
            feature.values_.y
        ) {
          that.delFeatureAndLayer(LayerArrays[i]);
        }
      }
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
      this.featureNum -= 1;
    },
    distanceTrue() {
      var that = this;
      if (
        this.actualrange == "" ||
        this.actualrange == 0 ||
        this.actualrange < 0
      ) {
        that.$message({
          message: this.$t("mapmanagement.actualdistance"),
          type: "warning",
        });
        that.$nextTick(function () {
          that.$refs.actualrange.focus();
        });
        return;
      }
      let LayerArrays = this.map.getLayers().getArray();
      let x = Math.abs(
        LayerArrays[1].getSource().getFeatures()[0].values_.x -
          LayerArrays[2].getSource().getFeatures()[0].values_.x
      );

      let y = Math.abs(
        LayerArrays[1].getSource().getFeatures()[0].values_.y -
          LayerArrays[2].getSource().getFeatures()[0].values_.y
      );

      let vectorMagnitude = Math.round(
        Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
      );

      if (this.add2D) {
        that.addData.reallength = Math.round(
          (that.imageX * that.actualrange) / vectorMagnitude
        );
        that.addData.realwidth = Math.round(
          (that.imageY * that.actualrange) / vectorMagnitude
        );
      }
      if (this.edit2D) {
        that.editData.reallength = Math.round(
          (that.imageX * that.actualrange) / vectorMagnitude
        );
        that.editData.realwidth = Math.round(
          (that.imageY * that.actualrange) / vectorMagnitude
        );
      }
      if (this.editCompany2D) {
        that.editDatas.reallength = Math.round(
          (that.imageX * that.actualrange) / vectorMagnitude
        );
        that.editDatas.realwidth = Math.round(
          (that.imageY * that.actualrange) / vectorMagnitude
        );
      }
      this.dialogVisible = false;
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getMapInfoLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getMapInfoLists();
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
    formatDateCreattime(row, column) {
      if (row.creattime == null || row.creattime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.creattime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    // 时间转换
    formatDateEdittime(row, column) {
      if (row.edittime == null || row.edittime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.edittime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    // 时间转换
    formatDateAudittime(row, column) {
      if (row.audittime == null || row.audittime == 0) {
        return "";
      }
      let date = new Date(parseInt(row.audittime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
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
      var that = this;
      this.dialogImageUrl = file.url;

      let img = new Image();
      img.src = file.url;
      img.onload = function () {
        that.imageX = img.width;
        that.imageY = img.height;
        that.mapInit(img.width, img.height);
      };
      this.dialogVisible = true;
    },

    handlePictureCardPreviewEdit(file) {
      var that = this;
      this.dialogImageUrl = file.url;

      let img = new Image();
      img.src = file.url;
      img.onload = function () {
        that.imageX = img.width;
        that.imageY = img.height;
        that.mapInit(img.width, img.height);
      };
      this.dialogVisible = true;
    },

    picSuccess(response, file, fileList) {
      file = "";
      this.$refs.upload.clearFiles();
      if (response.code == 1001) {
        this.add2D = false;
        this.$message({
          message: this.$t("buildingmanagement.addsuccess"),
          type: "success",
        });
        this.getMapInfoLists();
        this.getSearchMapInfoList();
      } else {
        this.$message({
          message: this.$t("buildingmanagement.addfaile"),
          type: "warning",
        });
      }
    },

    picSuccessEdit(response, file, fileList) {
      file = "";
      this.$refs.upload.clearFiles();
      if (response.code == 1001) {
        this.editCompany2D = false;
        this.$message({
          message: this.$t("mapmanagement.editsuccess"),
          type: "success",
        });
        this.getMapInfoLists();
        this.getSearchMapInfoList();
        this.choseApiEdit = false;
        this.needChangeAPI = false;
      } else {
        this.$message({
          message: this.$t("mapmanagement.editfaile"),
          type: "warning",
        });
      }
    },

    picError(err) {
      this.$refs.upload.clearFiles();
    },

    picErrorEdit(err) {
      this.$refs.upload.clearFiles();
    },

    handleExceed(files, fileList) {
      this.$message.warning(this.$t("mapmanagement.maprule"));
    },

    handleExceedEdit(files, fileList) {
      this.$message.warning(this.$t("mapmanagement.maprule"));
    },

    handleChange(file) {
      var that = this;
      let img = new Image();
      img.src = file.url;
      img.onload = function () {
        that.userIdForPic.width = img.height;
        that.userIdForPic.length = img.width;
      };
      this.dialogImageUrl = file.url;
    },

    beforeAvatarUpload(file) {
      var index = file.name.lastIndexOf(".");
      var type = file.name.substr(index + 1); //文件后缀名
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.warning(this.$t("mapmanagement.maprule1"));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.warning(this.$t("mapmanagement.maprule2"));
      }

      return isLt2M;
    },

    beforeAvatarUploadEdit(file) {
      var index = file.name.lastIndexOf(".");
      var type = file.name.substr(index + 1); //文件后缀名
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.warning(this.$t("mapmanagement.maprule1"));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.warning(this.$t("tet.tet13"));
      }
      return isLt2M;
    },

    //获取项目下拉框 getProjectListByTenantid
    getProjectListByTenantids() {
      let data = {
        superid: this.$store.state.userInfo.tenantid,
      };
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
    addMap() {
      this.fileListAdd = [];
      this.themeId = "";
      if (this.contrForPrionum == 3 || this.contrForPrionum == 4) {
        this.addData = {
          mapname: "",
          tenantid: this.$store.state.userInfo.tenantid,
          width: "",
          length: "",
          memo: "",
          projectid: this.$store.state.intoProjectid,
          realwidth: "",
          reallength: "",
          distance: "5",
          maptype: "",
          active: "0.5",
          mapkey: "",
          appname: "",
          filename: "",
          scale: 1,
        };
      } else if (this.contrForPrionum == 5) {
        this.addData = {
          mapname: "",
          tenantid: this.$store.state.userInfo.superid,
          width: "",
          length: "",
          memo: "",
          projectid: this.$store.state.intoProjectid,
          realwidth: "",
          reallength: "",
          distance: "5",
          maptype: "",
          active: "0.5",
          mapkey: "",
          appname: "",
          filename: "",
          scale: 1,
        };
      }
      this.choseMap = false;
    },
    // 添加2D 地图
    addMap2D() {
      this.addMap();
      this.add2D = true;
    },
    // 添加3D 地图
    addMap3D() {
      this.addMap();
      this.add3D = true;
    },
    addCancel2D(addData) {
      this.add2D = false;
      this.$refs[addData].resetFields();
    },
    addCancel3D(addData) {
      this.add3D = false;
      this.$refs[addData].resetFields();
    },
    addTrue2D(addData) {
      this.$refs[addData].validate((valid) => {
        if (valid) {
          this.addData.maptype = 1;
          this.userIdForPic.tenantid = this.addData.tenantid;
          this.userIdForPic.maptype = this.addData.maptype;
          this.userIdForPic.memo = this.addData.memo;
          this.userIdForPic.mapname = this.addData.mapname;
          this.userIdForPic.projectid = this.addData.projectid;
          this.userIdForPic.realwidth = this.addData.realwidth;
          this.userIdForPic.reallength = this.addData.reallength;
          this.userIdForPic.distance = this.addData.distance;
          this.userIdForPic.active = this.addData.active;
          this.userIdForPic.status = 1;
          this.$refs.upload.submit();
        } else {
          return false;
        }
      });
    },
    addTrue3D(addData) {
      var that = this;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          this.addData.filetype = this.themeId;
          this.addData.maptype = 2;
          this.addData.status = 1;
          addMapInfo(
            this.addData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("mapmanagement.addsuccess"),
                type: "warning",
              });
              that.getMapInfoLists();
              that.add3D = false;
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
    auditTrue2D(addData) {
      this.$refs[addData].validate((valid) => {
        if (valid) {
          this.addData.maptype = 1;
          this.userIdForPic.tenantid = this.addData.tenantid;
          this.userIdForPic.maptype = this.addData.maptype;
          this.userIdForPic.memo = this.addData.memo;
          this.userIdForPic.mapname = this.addData.mapname;
          this.userIdForPic.projectid = this.addData.projectid;
          this.userIdForPic.realwidth = this.addData.realwidth;
          this.userIdForPic.reallength = this.addData.reallength;
          this.userIdForPic.distance = this.addData.distance;
          this.userIdForPic.active = this.addData.active;
          this.userIdForPic.status = 2;
          this.$refs.upload.submit();
        } else {
          return false;
        }
      });
    },
    auditTrue3D(addData) {
      var that = this;
      this.$refs[addData].validate((valid) => {
        if (valid) {
          this.addData.filetype = this.themeId;
          this.addData.maptype = 2;
          this.addData.status = 2;
          addMapInfo(
            this.addData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.$message({
                message: that.$t("mapmanagement.Submittedsuccessfully"),
                type: "warning",
              });
              that.getMapInfoLists();
              that.add3D = false;
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
    //获取地图信息
    getMapInfoLists() {
      getMapInfoList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.tableData = res.data.list;
          this.total = res.data.size;
        }
      });
    },

    //制作地图下拉框查询
    getSearchMapInfoList() {
      let data = {};
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        data = {
          tenantid: "",
        };
      } else if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4
      ) {
        data = {
          projectid: this.$store.state.intoProjectid,
        };
      } else if (this.$store.state.userInfo.prionum == 5) {
        data = {
          projectid: this.$store.state.intoProjectid,
        };
      }
      getMapInfoList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        this.mapIdList = res.data.list.map((item) => {
          return {
            value: `${item.mapid}`,
            maplabel: `${item.mapid}`,
            mapname: `${item.mapname}`,
          };
        });
      });
    },
    //输入框模糊查询
    remoteMapMethod(query) {
      if (query !== "") {
        this.mapLoading = true;
        setTimeout(() => {
          this.mapLoading = false;
          this.mapOptions = this.mapIdList.filter((item) => {
            if (item.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else if (
              item.mapname.toLowerCase().indexOf(query.toLowerCase()) > -1
            ) {
              return (
                item.mapname.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          });
        }, 200);
      } else {
        this.mapOptions = [];
      }
    },
    // 查询
    searchInfo() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getMapInfoList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          that.currentPage1 = 1;
          if (res.data.size == 0) {
            that.$message({
              message: that.$t("mapmanagement.nodata"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("mapmanagement.searchsuccess"),
              type: "success",
            });
          }
        }
        that.searchList.count = 20;
      });
    },

    //刷新
    clearBtn() {
      if (
        this.$store.state.userInfo.prionum == 1 ||
        this.$store.state.userInfo.prionum == 2
      ) {
        this.searchList = {
          mapid: "",
          status: "",
          page: 1,
          count: this.pageCount,
          projectid: "",
        };
      } else if (
        this.$store.state.userInfo.prionum == 3 ||
        this.$store.state.userInfo.prionum == 4 ||
        this.$store.state.userInfo.prionum == 5
      ) {
        this.searchList = {
          mapid: "",
          status: "",
          page: 1,
          count: this.pageCount,
          projectid: this.$store.state.intoProjectid,
        };
      }

      this.currentPage1 = 1;
      this.getMapInfoLists();
    },

    //编辑
    editMap(index) {
      var that = this;
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        if (this.tableData[index].inuseNum > 0) {
          this.statusList = [
            {
              index: 3,
              value: "Pass",
            },
            {
              index: 5,
              value: "Lock",
            },
          ];
        } else {
          this.statusList = [
            {
              index: 1,
              value: "Draft",
            },
            {
              index: 2,
              value: "Audit",
            },
            {
              index: 3,
              value: "Pass",
            },
            {
              index: 4,
              value: "Fail",
            },
            {
              index: 5,
              value: "Lock",
            },
          ];
        }

        this.passEdit = true;

        this.editData.mapid = this.tableData[index].mapid;
        this.editData.status = this.tableData[index].status;
        this.editData.mapname = this.tableData[index].mapname;
        this.editData.width = this.tableData[index].width;
        this.editData.length = this.tableData[index].length;
        this.editData.instruction = this.tableData[index].instruction;
        this.editData.memo = this.tableData[index].memo;
        this.editData.sysmemo = this.tableData[index].sysmemo;
        this.editData.projectid = this.tableData[index].projectid;
        this.editData.distance = this.tableData[index].distance;
        this.editData.reallength = this.tableData[index].reallength;
        this.editData.realwidth = this.tableData[index].realwidth;
        this.editData.active = this.tableData[index].active;
        if (this.tableData[index].maptype == 1) {
          this.imgUrl = "";
          this.srcList = [];

          const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
          this.imgUrl =
            base + "indoormap/" + this.tableData[index].filetype;
          this.srcList.push(
            (host.host && host.host.endsWith('/') ? host.host : (host.host + '/')) + "indoormap/" + this.tableData[index].filetype
          );

          this.edit2D = true;
        } else {
          this.editData.filename = this.tableData[index].filename;
          this.fmapId = this.tableData[index].filename;
          this.fmapKey = this.tableData[index].mapkey;
          this.themeId = this.tableData[index].filetype;
          this.fmapName = this.tableData[index].appname;
          this.edit3D = true;
          this.loading = true;
        }
      } else {
        // changeImg
        if (this.tableData[index].inuseNum > 0) {
          this.changeImg = true;
        } else {
          this.changeImg = false;
        }
        // 判断是否为草稿状态、失败状态，编辑窗口有“提交审核”的按钮
        if (
          this.tableData[index].status == 1 ||
          this.tableData[index].status == 4
        ) {
          that.auditBtn = true;
        } else {
          that.auditBtn = false;
        }

        this.editDatas.mapid = this.tableData[index].mapid;
        this.editDatas.status = this.tableData[index].status;
        this.editDatas.mapname = this.tableData[index].mapname;
        this.editDatas.width = this.tableData[index].width;
        this.editDatas.length = this.tableData[index].length;
        this.editDatas.instruction = this.tableData[index].instruction;
        this.editDatas.memo = this.tableData[index].memo;
        this.editDatas.sysmemo = this.tableData[index].sysmemo;
        this.editDatas.projectid = this.tableData[index].projectid;
        this.editDatas.realwidth = this.tableData[index].realwidth;
        this.editDatas.reallength = this.tableData[index].reallength;
        this.editDatas.distance = this.tableData[index].distance;
        this.editDatas.active = this.tableData[index].active;

        if (this.tableData[index].maptype == 1) {
          //可以更换图片的编辑页面，企业级管理员打开的编辑页面

          this.needChangeAPI = true;
          this.fileListEdit = [
            {
              name: this.tableData[index].mapname,
              url: (host.host && host.host.endsWith('/') ? host.host : (host.host + '/')) + "indoormap/" + this.tableData[index].filetype,
            },
          ];
          this.editCompany2D = true;
        } else {
          this.editData.mapid = this.tableData[index].mapid;
          this.editData.status = this.tableData[index].status;
          this.editData.mapname = this.tableData[index].mapname;
          this.editData.instruction = this.tableData[index].instruction;
          this.editData.memo = this.tableData[index].memo;
          this.editData.sysmemo = this.tableData[index].sysmemo;
          this.editData.projectid = this.tableData[index].projectid;
          this.editData.distance = this.tableData[index].distance;
          this.editData.width = this.tableData[index].width;
          this.editData.length = this.tableData[index].length;
          this.editData.realwidth = this.tableData[index].realwidth;
          this.editData.reallength = this.tableData[index].reallength;
          this.editData.active = this.tableData[index].active;
          this.editData.filename = this.tableData[index].filename;
          this.editData.scale = this.tableData[index].scale;
          this.fmapId = this.tableData[index].filename;
          this.fmapKey = this.tableData[index].mapkey;
          this.themeId = this.tableData[index].filetype;
          this.fmapName = this.tableData[index].appname;
          this.edit3D = true;
          this.loading = true;
        }
      }
    },
    //系统级管理员编辑确定
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          updateMapInfo(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit2D = false;
              that.getMapInfoLists();
              that.getSearchMapInfoList();
              that.$message({
                message: that.$t("mapmanagement.editsuccess"),
                type: "success",
              });
            } else {
              this.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 3D地图编辑确定
    editTrue3D(editData) {
      var that = this;
      this.editData.filetype = this.themeId;
      this.$refs[editData].validate((valid) => {
        // this.editData.status = 1;
        if (valid) {
          updateMapInfo(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit3D = false;
              that.getMapInfoLists();
              that.getSearchMapInfoList();
              that.$message({
                message: that.$t("mapmanagement.editsuccess"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 3D地图提交审核
    auditTrues3D(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.editData.status = 2;
          updateMapInfo(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit3D = false;
              that.getMapInfoLists();
              that.getSearchMapInfoList();
              that.$message({
                message: that.$t("mapmanagement.Submittedsuccessfully"),
                type: "success",
              });
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    //判断有没有更换地图，从而选择接口
    choseApi(file, fileList) {
      if (this.needChangeAPI) {
        this.choseApiEdit = true;
      }
    },
    //企业级管理员编辑确定
    editTrues(editDatas) {
      var that = this;
      this.$refs[editDatas].validate((valid) => {
        if (valid) {
          if (this.choseApiEdit) {
            this.userIdForPicEdit.projectid = this.editDatas.projectid;
            this.userIdForPicEdit.mapid = this.editDatas.mapid;
            this.userIdForPicEdit.mapname = this.editDatas.mapname;
            this.userIdForPicEdit.status = 1;
            this.userIdForPicEdit.width = this.editDatas.width;
            this.userIdForPicEdit.length = this.editDatas.length;
            this.userIdForPicEdit.memo = this.editDatas.memo;
            this.userIdForPicEdit.distance = this.editDatas.distance;
            this.userIdForPicEdit.reallength = this.editDatas.reallength;
            this.userIdForPicEdit.realwidth = this.editDatas.realwidth;
            this.userIdForPicEdit.active = this.editDatas.active;
            this.$refs.upload.submit();
          } else {
            if (this.changeImg == false) {
              this.editDatas.status = 1;
            }
            updateMapInfo(
              this.editDatas,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.editCompany2D = false;
                that.getMapInfoLists();
                that.getSearchMapInfoList();
                that.$message({
                  message: that.$t("mapmanagement.editsuccess"),
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
    // 提交审核
    auditTrues(editDatas) {
      var that = this;
      this.$refs[editDatas].validate((valid) => {
        if (valid) {
          if (this.choseApiEdit) {
            this.userIdForPicEdit.projectid = this.editDatas.projectid;
            this.userIdForPicEdit.mapid = this.editDatas.mapid;
            this.userIdForPicEdit.mapname = this.editDatas.mapname;
            this.userIdForPicEdit.status = 2;
            this.userIdForPicEdit.width = this.editDatas.width;
            this.userIdForPicEdit.length = this.editDatas.length;
            this.userIdForPicEdit.memo = this.editDatas.memo;
            this.userIdForPicEdit.realwidth = this.editDatas.realwidth;
            this.userIdForPicEdit.reallength = this.editDatas.reallength;
            this.userIdForPicEdit.distance = this.editDatas.distance;
            this.userIdForPicEdit.active = this.editDatas.active;
            this.$refs.upload.submit();
          } else {
            this.editDatas.status = 2;
            updateMapInfo(
              this.editDatas,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.editCompany2D = false;
                that.getMapInfoLists();
                that.getSearchMapInfoList();
                that.$message({
                  message: that.$t("mapmanagement.Submittedsuccessfully"),
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

    //删除
    delMap(index) {
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        this.$message({
          message: this.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      var that = this;
      if (this.tableData[index].inuseNum < 1) {
        //未使用
        that.statusList = [
          {
            index: 1,
            value: "Draft",
          },
          {
            index: 2,
            value: "Audit",
          },
          {
            index: 3,
            value: "Pass",
          },
          {
            index: 4,
            value: "Fail",
          },
          {
            index: 5,
            value: "Lock",
          },
        ];
        that.imgUrl = "";
        that.srcList = [];
        that.delData = that.tableData[index];
        const base = host.host && host.host.endsWith('/') ? host.host : (host.host + '/');
        that.imgUrl = base + "indoormap/" + that.tableData[index].filetype;
        that.srcList.push(
          (host.host && host.host.endsWith('/') ? host.host : (host.host + '/')) + "indoormap/" + that.tableData[index].filetype
        );
        that.del = true;
      } else if (this.tableData[index].inuseNum > 0) {
        that.$message({
          message: this.$t("mapmanagements.cannotdeleted"),
          type: "warning",
        });
      }
    },
    delTrue() {
      let that = this;
      let data = {
        mapid: this.delData.mapid,
      };
      delMapInfo(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.del = false;
            that.getMapInfoLists();
            that.getSearchMapInfoList();
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
    },

    //审核
    checkMap(index) {
      var that = this;
      if (this.tableData[index].status == 1) {
        that.$message({
          message: this.$t("mapmanagement.tit2"),
          type: "warning",
        });
        return;
      } else if (this.tableData[index].status == 4) {
        that.$message({
          message: this.$t("mapmanagement.tit3"),
          type: "warning",
        });
        return;
      }
      if (this.tableData[index].inuseNum > 0) {
        this.statusList = [
          {
            index: 3,
            value: "Pass",
          },
          {
            index: 5,
            value: "Lock",
          },
        ];
      } else {
        this.statusList = [
          {
            index: 1,
            value: "Draft",
          },
          {
            index: 2,
            value: "Audit",
          },
          {
            index: 3,
            value: "Pass",
          },
          {
            index: 4,
            value: "Fail",
          },
          {
            index: 5,
            value: "Lock",
          },
        ];
      }

      this.checkData = this.tableData[index];
      if (this.tableData[index].maptype == 1) {
        this.imgUrl = "";
        this.srcList = [];
        this.imgUrl = (host.host && host.host.endsWith('/') ? host.host : (host.host + '/')) + "indoormap/" + this.tableData[index].filetype;
        this.srcList.push(
          (host.host && host.host.endsWith('/') ? host.host : (host.host + '/')) + "indoormap/" + this.tableData[index].filetype
        );

        //获取图片的宽高
        let img = new Image();
        img.src = this.imgUrl;
        img.onload = function () {
          that.$set(that.imageInfo, "width", img.width);
          that.$set(that.imageInfo, "height", img.height);
        };

        this.check = true;
      } else {
        this.fmapId = this.tableData[index].filename;
        this.fmapKey = this.tableData[index].mapkey;
        this.themeId = this.tableData[index].filetype;
        this.fmapName = this.tableData[index].appname;
        this.clickTrue = true;
        this.check3D = true;
        this.loading = true;
      }
    },
    onmap() {
      var that = this;
      var mapOpation = {
        container: document.getElementById("fengMap"),
        level: 1, //默认聚焦楼层
        visibleLevels: [1], //初始显示楼层ID数组
        focusAlphaMode: false, //是否对不可见图层启用透明设置，默认true
        focusAlpha: 0.1,
        appName: that.fmapName,
        key: that.fmapKey,
        mapID: that.fmapId,
        defaultControlsPose: 0, //角度值
        modelSelectedEffect: false, //支持单击模型高亮，false为单击时模型不高亮
        defaultViewMode: fengmap.FMViewMode.MODE_3D, //设置地图2d/3d显示
        themeID: that.themeId,
        // mapURL: "/data/",
        // themeURL: "/data/theme/",
      };
      this.map3d = new fengmap.FMMap(mapOpation);
      // this.map3d.openMapById(this.fmapId, function (error) {
      //   that.$message({
      //     message: error.data.error_msg,
      //     type: "error",
      //   });
      // });

      this.map3d.on("loaded", function () {
        // if (that.edit3D) {
        //   if (
        //     (that.editData.width == "" || that.editData.width == 0) &&
        //     (that.editData.length == "" || that.editData.length == 0) &&
        //     (that.editData.realwidth == "" || that.editData.realwidth == 0) &&
        //     (that.editData.reallength == "" || that.editData.reallength == 0)
        //   ) {
        //     let data = {
        //       mapid: that.editData.mapid,
        //       filename: that.editData.filename,
        //       width: that.map3d.minY,
        //       length: that.map3d.minX,
        //       realwidth: that.map3d.maxY,
        //       reallength: that.map3d.maxX,
        //     };
        //     // updateMapInfo(
        //     //   data,
        //     //   that.tenantkey_A,
        //     //   that.tenantid_A,
        //     //   that.userName
        //     // ).then((res) => {});
        //   }
        // }
        if (that.check3D) {
          if (
            (that.checkData.width == "" || that.checkData.width == 0) &&
            (that.checkData.length == "" || that.checkData.length == 0) &&
            (that.checkData.realwidth == "" || that.checkData.realwidth == 0) &&
            (that.checkData.reallength == "" || that.checkData.reallength == 0)
          ) {
            that.checkData.width = that.map3d.getBound().min.y;
            that.checkData.length = that.map3d.getBound().min.x;
            that.checkData.realwidth = that.map3d.getBound().max.y;
            that.checkData.reallength = that.map3d.getBound().max.x;
            that.clickTrue = false;
          } else {
            that.clickTrue = false;
          }
        }
        that.loading = false;
        that.loadScrollFloorCtrl();
      });
    },
    closeCheck(rule) {
      this.map3d.dispose();
      this.check3D = false;
      this.edit3D = false;
      this.$refs[rule].resetFields();
    },
    //加载滚动楼层控制
    loadScrollFloorCtrl() {
      var scrollFloorCtlOpt = {
        position: fengmap.FMControlPosition.RIGHT_TOP,
        floorButtonCount: 5,
        offset: {
          x: -20,
          y: 80,
        },
        viewModeControl: true,
        floorModeControl: true,
        needAllLayerBtn: false,
      };
      this.scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt);
      this.scrollFloorControl.addTo(this.map3d);
    },
    checkCancle(checkData) {
      this.check = false;
      this.$refs[checkData].resetFields();
    },
    checkTrue(checkData) {
      let that = this;
      this.$refs[checkData].validate((valid) => {
        if (valid) {
          let data = {
            mapid: this.checkData.mapid,
            status: this.checkData.status,
            instruction: this.checkData.instruction,
            width: this.checkData.width,
            length: this.checkData.length,
            realwidth: this.checkData.realwidth,
            reallength: this.checkData.reallength,
          };
          auditMapInfo(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.check = false;
              that.check3D = false;
              that.getMapInfoLists();
              that.getSearchMapInfoList();
              that.$message({
                message: that.$t("mapmanagement.checksuccess"),
                type: "success",
              });
              that.$refs[checkData].resetFields();
            } else {
              that.$message({
                message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
                type: "error",
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    //调整操作栏宽度
    autoWidth() {
      if (this.contrForPrionum == 1) {
        return 100 + "px";
      } else if (this.contrForPrionum == 2 || this.contrForPrionum == 3) {
        return 150 + "px";
      } else if (this.contrForPrionum == 4) {
        return 80 + "px";
      }
    },
    //返回项目管理
    goProject() {
      this.$router.push("/projectmanagement");
    },
    closeMap() {
      this.dialogImageUrl = "";
    },
    // 点击打开地图计算实际宽度
    chooseMapPoint() {
      let that = this;
      if (this.editCompany2D) {
        this.dialogImageUrl = this.fileListEdit[0].url;
      }
      if (this.dialogImageUrl == "") {
        that.$message({
          message: this.$t("mapmanagement.tit4"),
          type: "warning",
        });
        return;
      }
      let img = new Image();
      img.src = this.dialogImageUrl;
      img.onload = function () {
        that.imageX = img.width;
        that.imageY = img.height;
        that.mapInit(img.width, img.height);
      };
      this.dialogVisible = true;
    },
  },
  beforeMount() {
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2
    ) {
      this.searchList = {
        mapid: "",
        status: "",
        page: 1,
        count: 20,
        projectid: "",
      };
    } else if (
      this.$store.state.userInfo.prionum == 3 ||
      this.$store.state.userInfo.prionum == 4 ||
      this.$store.state.userInfo.prionum == 5
    ) {
      this.searchList.projectid = this.$store.state.intoProjectid;
      this.getProjectListByTenantids();
    }
    this.getMapInfoLists();
    this.getSearchMapInfoList();
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
  display: -webkit-box;
}

.el-message--error {
  display: -webkit-box;
}

.el-message--warning {
  display: -webkit-box;
}

.el-table >>> .el-table__row td {
  padding: 0 !important;
}
.el-table >>> .hover-row td {
  background-color: #d9eafa !important;
}
.query,
.reset,
.del {
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

.imageSize >>> .el-image-viewer__img {
  position: absolute !important;
}

.el-page-header__content {
  margin-left: 30px;
}
.backProject >>> .el-page-header__left {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject >>> .el-page-header__content {
  text-align: left !important;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
/* .move {
  transform: translateX(4px);
} */
.check_3d_box {
  display: flex;
  height: 100%;
}
.check_3d_info {
  width: 40%;
  margin-left: 0;
}
.check_3d_map {
  position: absolute;
  right: 1%;
  width: 59%;
  height: 80%;
}
#fengMap {
  width: 100%;
  height: 100%;
  display: flex;
}
.mapview >>> .el-dialog {
  margin-top: 0 !important;
  height: 90%;
}
.mapview >>> .el-dialog__body {
  height: 95%;
}
.mapContent {
  width: 100%;
  height: 90%;
}
.map_tips {
  text-align: center;
  /* white-space: nowrap; */
}
.mapview_dialog_footer {
  text-align: right;
}
.actualrange {
  width: 60px;
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  /* cursor: not-allowed; */
}
.actualrange_dis {
  width: 60px;
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
}
.actualrange:focus {
  border-color: #409eff;
}
.actual_width >>> .el-form-item__content {
  display: flex;
  align-items: center;
}
.icon_button {
  padding: 2px 16px !important;
}
</style>
