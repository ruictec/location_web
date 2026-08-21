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
            class="map_pinut map-search-bar"
            v-if="contrForPrionum == 3 || contrForPrionum == 4"
          >
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/projectmanagement' }">{{
                $t("index.projectmanagement")
              }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ intoProjectName }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{
                $t("index.Mapmanagement")
              }}</el-breadcrumb-item>
            </el-breadcrumb>

            <div class="map-search-row terminal-filter-flow" :class="filterLangClass">
            <el-form
              class="demo-form-inline map-search-form terminal-filter-form"
              :model="searchList"
            >
              <el-form-item
                :label="$t('mapmanagements.Mapnumber')"
               class="terminal-filter-item">
                <el-select
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
                      >{{ item.maplabel }}</span></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="search-actions terminal-toolbar-item">
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("mapmanagements.search")
                }}</el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("mapmanagements.reset")
                }}</el-button>
                <el-popover
                  v-model:visible="choseMap"
                  placement="top-end"
                  :width="'auto'"
                  popper-class="map-add-popover"
                >
                  <div class="map-add-popover__actions">
                    <el-button size="small" type="primary" @click="addMap2D()">{{
                      $t("mapmanagements.sDmap")
                    }}</el-button>
                    <el-button type="primary" size="small" @click="addMap3D()">{{
                      $t("mapmanagements.tDmap")
                    }}</el-button>
                  </div>
                  <template #reference><el-button type="primary" class="del move">{{
                    $t("mapmanagements.Addmap")
                  }}</el-button></template>
                </el-popover>
              </el-form-item>
            </el-form>
            </div>
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
                      >{{ item.maplabel }}</span>
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
                <el-popover
                  placement="top-end"
                  :width="'auto'"
                  popper-class="map-add-popover"
                  v-model:visible="choseMap"
                >
                  <div class="map-add-popover__actions">
                    <el-button size="small" type="primary" @click="addMap2D()">{{
                      $t("mapmanagements.sDmap")
                    }}</el-button>
                    <el-button type="primary" size="small" @click="addMap3D()">{{
                      $t("mapmanagements.tDmap")
                    }}</el-button>
                  </div>
                  <template #reference><el-button type="primary" class="del move">{{
                    $t("mapmanagements.Addmap")
                  }}</el-button></template>
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
                      >{{ item.maplabel }}</span>
                  </el-option>
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
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.mapwidth")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>{{ $t("mapmanagements.text1") }}</p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip> </template></el-table-column>
              <el-table-column
                property="length"
                :label="$t('mapmanagements.maplength')"
                show-overflow-tooltip
                min-width="110"
                align="center"
              >
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.maplength")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>{{ $t("mapmanagements.text2") }}</p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip> </template></el-table-column>
              <el-table-column
                property="realwidth"
                :label="$t('mapmanagements.actualwidthofthemap')"
                show-overflow-tooltip
                min-width="140"
                align="center"
              >
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.actualwidthofthemap")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>{{ $t("mapmanagements.text3") }}</p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip> </template></el-table-column>
              <el-table-column
                property="reallength"
                :label="$t('mapmanagements.actuallengthofthemap')"
                show-overflow-tooltip
                min-width="140"
                align="center"
              >
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("mapmanagements.actuallengthofthemap")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>{{ $t("mapmanagements.text4") }}</p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip> </template></el-table-column>
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
                :label="$t('mapmanagements.inusestr')"
                show-overflow-tooltip
                min-width="88"
                align="center"
              >
                <template #default="scope">
                  {{
                    scope.row.inuseNum > 0
                      ? $t("mapmanagements.inuseYes")
                      : $t("mapmanagements.inuseNo")
                  }}
                </template>
              </el-table-column>
              <el-table-column
                property="edittime"
                :label="$t('mapmanagements.mapedittime')"
                show-overflow-tooltip
                :formatter="formatDateEdittime"
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
                <template #default="scope">
                  <el-dropdown size="small" type="primary" trigger="click">
                    <span class="el-dropdown-link">
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
                    </span>
<template #dropdown><el-dropdown-menu
                     
                      style="background-color: rgb(219, 222, 231)"
                      class="selects"
                    >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="small"
                          class="edits"
                          @click="editMap(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          >{{ $t("mapmanagements.edit") }}</el-button></el-dropdown-item>
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="small"
                          class="dels1"
                          @click="delMap(scope.$index)"
                          v-if="
                            contrForPrionum == 1 ||
                            contrForPrionum == 2 ||
                            contrForPrionum == 3 ||
                            contrForPrionum == 4 ||
                            contrForPrionum == 5
                          "
                          >{{ $t("mapmanagements.delete") }}</el-button></el-dropdown-item>
                    </el-dropdown-menu></template>
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
                v-model:current-page="currentPage1"
                v-model:page-size="pageCount"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 添加2D -->
          <el-dialog
            :title="$t('mapmanagements.text5')"
            width="30%"
            v-model="add2D"
            style="text-align: center"
            @close="addCancel2D('addData')"
          >
            <el-upload
              :action="ImagePath"
              list-type="picture-card"
              v-model:file-list="fileListAdd"
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
              <template #tip><div class="el-upload__tip">
                {{ $t("mapmanagements.text6") }}
              </div></template>
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
                  >{{ $t("mapmanagements.mapselection") }}</el-button>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text7") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text8") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text9") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text10") }}
                    </p>
                  </div></template>
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

            <template #footer><div class="dialog-footer">
              <el-button @click="addCancel2D('addData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addTrue2D('addData')">{{
                $t("warning.Sure")
              }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 添加3D -->
          <el-dialog
            :title="$t('mapmanagements.text5')"
            width="30%"
            v-model="add3D"
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text9") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text10") }}
                    </p>
                  </div></template>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('mapmanagements.scale')" prop="scale">
                <el-input v-model="addData.scale"></el-input>
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
                      {{ $t("mapmanagements.scaleTip") }}
                    </p>
                  </div></template>
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

            <template #footer><div class="dialog-footer">
              <el-button @click="addCancel3D('addData')">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addTrue3D('addData')">{{
                $t("warning.Sure")
              }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 地图预览 -->
          <el-dialog
            width="60%"
            class="mapview"
            v-model="dialogVisible"
            :append-to-body="true"
            :destroy-on-close="true"
            @close="removeMap()"
          >
            <div class="mapContent" ref="mapContent">
              <div class="map-image-stage">
                <img
                  v-if="dialogImageUrl"
                  class="map-image-preview"
                  :src="dialogImageUrl"
                  alt=""
                />
                <div id="map" ref="map"></div>
              </div>
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
            v-model="del"
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

            <template #footer><div class="dialog-footer">
              <el-button @click="del = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="delTrue('delData')">{{
                $t("warning.Sure")
              }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 编辑2D 不可更该地图的编辑页面-->
          <el-dialog
            width="30%"
            v-model="edit2D"
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text15") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>{{ $t("mapmanagements.text16") }}</p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text17") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text18") }}
                    </p>
                  </div></template>
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

            <template #footer><div class="dialog-footer">
              <el-button @click="edit2D = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="editTrue('editData')">{{
                $t("warning.Sure")
              }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 企业级编辑2D，可以修改地图 -->
          <el-dialog
            :title="$t('mapmanagements.text14')"
            width="30%"
            v-model="editCompany2D"
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
              <template #tip><div class="el-upload__tip">
                {{ $t("mapmanagements.text6") }}
              </div></template>
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
                  >{{ $t("mapmanagements.mapselection") }}</el-button>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text15") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>{{ $t("mapmanagements.text16") }}</p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text17") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("mapmanagements.text18") }}
                    </p>
                  </div></template>
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

            <template #footer><div class="dialog-footer">
              <el-button @click="editCompany2D = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="editTrues('editDatas')">{{
                $t("warning.Sure")
              }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 编辑3D地图 -->
          <el-dialog
            :title="$t('mapmanagements.text14')"
            width="60%"
            v-model="edit3D"
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
                      <template #content><div>
                        <p>
                          {{ $t("mapmanagements.text17") }}
                        </p>
                      </div></template>
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
                      <template #content><div>
                        <p>
                          {{ $t("mapmanagements.text18") }}
                        </p>
                      </div></template>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item
                    :label="$t('mapmanagements.scale')"
                    prop="scale"
                  >
                    <el-input v-model="editData.scale"></el-input>
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
                          {{ $t("mapmanagements.scaleTip") }}
                        </p>
                      </div></template>
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
                <div class="edit-3d-actions">
                  <el-button @click="closeCheck('editData')">{{
                    $t("warning.Cancel")
                  }}</el-button>
                  <el-button type="primary" @click="editTrue3D('editData')">{{
                    $t("warning.Sure")
                  }}</el-button>
                </div>
              </div>
              <div class="check_3d_map">
                <div
                  id="fengMap"
                  ref="fengMap"
                  v-loading="loading"
                  v-if="edit3D"
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
import { FENGMAP_DECODER_URL } from "../../utils/fengmapAssets";
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
import { markRaw } from "vue";

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
            pattern: /^(\d+(\.\d+)?|\.\d+)?$/,
            message: this.$t("mapmanagement.titScale"),
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
      },

      projectList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      mapDialogInitTimer: null,
      mapDialogInitSeq: 0,
      mapImageRaw: null,
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
        mapname: "",
        mapid: "",
        width: "",
        length: "",
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
        mapname: "",
        mapid: "",
        width: "",
        length: "",
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

      clickTrue: true,
      map3d: null,
      themeId: "", //3D地图主题id
      fmapId: "",
      fmapKey: "",
      fmapName: "",
      loading: true,
      scrollFloorControl: "",

      imgUrl: "",
      imageInfo: {}, //原始图片的分辨率，用于校验实际宽高比例
      srcList: [],

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
  created() {
    this.map = null;
    this.mapClickEvent = null;
  },
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
  },
  methods: {
    resolveUploadImageUrl(file) {
      if (!file) {
        return "";
      }
      if (file.url) {
        return file.url;
      }
      return "";
    },
    readMapImageDataUrl(raw) {
      return new Promise((resolve, reject) => {
        if (!(raw instanceof Blob)) {
          reject(new Error("invalid map image"));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(raw);
      });
    },
    rememberMapImageFile(file) {
      const raw = file?.raw instanceof Blob ? file.raw : null;
      if (raw) {
        this.mapImageRaw = raw;
      }
    },
    loadMapImageSource() {
      const finish = (url) => {
        if (!url) {
          return Promise.reject(new Error("empty map image url"));
        }
        this.dialogImageUrl = url;
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            if (!img.width || !img.height) {
              reject(new Error("invalid map image size"));
              return;
            }
            resolve({
              url,
              width: img.width,
              height: img.height,
            });
          };
          img.onerror = reject;
          img.src = url;
        });
      };

      if (this.mapImageRaw) {
        return this.readMapImageDataUrl(this.mapImageRaw).then(finish);
      }

      const fallbackUrl = this.getCurrentMapImageUrl();
      if (fallbackUrl) {
        return finish(fallbackUrl);
      }

      return Promise.reject(new Error("no map image"));
    },
    getCurrentMapImageUrl() {
      if (this.dialogImageUrl) {
        return this.dialogImageUrl;
      }
      if (this.fileListAdd.length) {
        return this.resolveUploadImageUrl(this.fileListAdd[0]);
      }
      if (this.fileListEdit.length) {
        return this.resolveUploadImageUrl(this.fileListEdit[0]);
      }
      return "";
    },
    clearMapDialogInitTimer() {
      if (this.mapDialogInitTimer) {
        clearTimeout(this.mapDialogInitTimer);
        this.mapDialogInitTimer = null;
      }
    },
    scheduleMapDialogInit() {
      this.clearMapDialogInitTimer();
      const token = this.mapDialogInitSeq;
      this.mapDialogInitTimer = setTimeout(() => {
        if (token !== this.mapDialogInitSeq || !this.dialogVisible) {
          return;
        }
        this.initMapFromImageUrl();
      }, 280);
    },
    openMapView(imageUrl) {
      if (imageUrl) {
        this.dialogImageUrl = imageUrl;
      }
      if (!this.mapImageRaw && !this.dialogImageUrl && !this.getCurrentMapImageUrl()) {
        this.$message({
          message: this.$t("mapmanagement.tit4"),
          type: "warning",
        });
        return;
      }
      this.mapDialogInitSeq += 1;
      this.dialogVisible = true;
    },
    initMapFromImageUrl() {
      if (!this.dialogVisible) {
        return;
      }
      this.loadMapImageSource()
        .then(({ url, width, height }) => {
          if (!this.dialogVisible) {
            return;
          }
          this.dialogImageUrl = url;
          this.imageX = width;
          this.imageY = height;
          this.imageInfo = {
            width: width,
            height: height,
          };
          this.mapInit(width, height);
        })
        .catch(() => {
          this.$message({
            message: this.$t("mapmanagement.maprule1"),
            type: "warning",
          });
        });
    },
    // 初始话地图
    mapInit(x, y) {
      var that = this;
      that.actualrange = "";
      if (this.map) {
        this.map.setTarget(null);
        this.map = null;
      }
      var extent = [0, 0, x, y];
      const projectionCode = `map-image-${x}-${y}-${Date.now()}`;
      var projection = new Projection({
        code: projectionCode,
        units: "pixels",
        extent: extent,
      });
      const mapEl = this.$refs.map;
      const mapContentEl = this.$refs.mapContent;
      if (!mapEl || !mapContentEl) {
        return;
      }
      const tipsEl = mapContentEl.querySelector(".map_tips");
      const tipsHeight = tipsEl ? tipsEl.offsetHeight + 12 : 48;
      const mapHeight = Math.max(mapContentEl.clientHeight - tipsHeight, 420);
      mapEl.style.width = "100%";
      mapEl.style.height = `${mapHeight}px`;
      mapEl.style.minHeight = `${mapHeight}px`;
      this.map = markRaw(
        new Map({
          layers: [
            new ImageLayer({
              source: new Static({
                url: that.dialogImageUrl,
                projection: projection,
                imageExtent: extent,
                imageSize: [x, y],
                imageLoadFunction(image, src) {
                  image.getImage().src = that.dialogImageUrl || src;
                },
              }),
            }),
          ],
          target: mapEl,
          view: new View({
            projection: projection,
            center: getCenter(extent),
            zoom: 2,
            maxZoom: 8,
            minZoom: 1,
          }),
        })
      );
      this.mapClick();
      this.$nextTick(() => {
        if (!this.map) {
          return;
        }
        this.map.updateSize();
        this.map.getView().fit(extent, {
          size: this.map.getSize(),
          padding: [20, 20, 20, 20],
          constrainResolution: false,
        });
        setTimeout(() => {
          if (this.map) {
            this.map.updateSize();
            this.map.renderSync();
          }
        }, 200);
      });
    },
    removeMap() {
      this.clearMapDialogInitTimer();
      if (this.map) {
        this.map.setTarget(null);
        this.map = null;
      }
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


    myHeaderd() {
      let d = new Date();
      let time_A = d.getTime();
      this.myHeader.tenantkey = this.tenantkey_A;
      this.myHeader.ts = this.time_A;
      this.myHeader.tenantid = this.tenantid_A;
      this.myHeader.userName = this.userName;
    },

    handlePictureCardPreview(file) {
      this.rememberMapImageFile(file);
      this.openMapView(this.resolveUploadImageUrl(file));
    },

    handlePictureCardPreviewEdit(file) {
      this.rememberMapImageFile(file);
      this.openMapView(this.resolveUploadImageUrl(file));
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

    handleChange(uploadFile, uploadFiles) {
      var that = this;
      if (uploadFiles && uploadFiles.length) {
        this.fileListAdd = uploadFiles;
      }
      this.rememberMapImageFile(uploadFile);
      const previewUrl = this.resolveUploadImageUrl(uploadFile);
      if (previewUrl) {
        this.dialogImageUrl = previewUrl;
        let img = new Image();
        img.src = previewUrl;
        img.onload = function () {
          that.userIdForPic.width = img.height;
          that.userIdForPic.length = img.width;
          that.imageInfo = {
            width: img.width,
            height: img.height,
          };
          that.imageX = img.width;
          that.imageY = img.height;
        };
      }
      if (this.mapImageRaw) {
        this.readMapImageDataUrl(this.mapImageRaw).then((dataUrl) => {
          that.dialogImageUrl = dataUrl;
        });
      }
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
          if (
            !this.validateRealSizeRatio(
              this.addData.realwidth,
              this.addData.reallength
            )
          ) {
            return;
          }
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
      this.changeImg = this.tableData[index].inuseNum > 0;
      if (this.contrForPrionum == 1 || this.contrForPrionum == 2) {
        this.passEdit = true;

        this.editData.mapid = this.tableData[index].mapid;
        this.editData.mapname = this.tableData[index].mapname;
        this.editData.width = this.tableData[index].width;
        this.editData.length = this.tableData[index].length;
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
          this.setImageInfoFromMap(this.tableData[index]);
          this.recordImageSize(this.imgUrl);

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
        this.changeImg = this.tableData[index].inuseNum > 0;


        this.editDatas.mapid = this.tableData[index].mapid;
        this.editDatas.mapname = this.tableData[index].mapname;
        this.editDatas.width = this.tableData[index].width;
        this.editDatas.length = this.tableData[index].length;
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
          this.setImageInfoFromMap(this.tableData[index]);
          this.recordImageSize(this.fileListEdit[0].url);
          this.editCompany2D = true;
        } else {
          this.editData.mapid = this.tableData[index].mapid;
          this.editData.mapname = this.tableData[index].mapname;
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
          if (
            !this.validateRealSizeRatio(
              this.editData.realwidth,
              this.editData.reallength
            )
          ) {
            return;
          }
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
          if (
            !this.validateRealSizeRatio(
              this.editDatas.realwidth,
              this.editDatas.reallength
            )
          ) {
            return;
          }
          if (this.choseApiEdit) {
            this.userIdForPicEdit.projectid = this.editDatas.projectid;
            this.userIdForPicEdit.mapid = this.editDatas.mapid;
            this.userIdForPicEdit.mapname = this.editDatas.mapname;
            this.userIdForPicEdit.width = this.editDatas.width;
            this.userIdForPicEdit.length = this.editDatas.length;
            this.userIdForPicEdit.memo = this.editDatas.memo;
            this.userIdForPicEdit.distance = this.editDatas.distance;
            this.userIdForPicEdit.reallength = this.editDatas.reallength;
            this.userIdForPicEdit.realwidth = this.editDatas.realwidth;
            this.userIdForPicEdit.active = this.editDatas.active;
            this.$refs.upload.submit();
          } else {
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

    onmap() {
      var that = this;
      var tryInit = function (remain) {
        var container = that.$refs.fengMap || document.getElementById("fengMap");
        if (!container) {
          if (remain > 0) {
            setTimeout(function () {
              tryInit(remain - 1);
            }, 50);
          }
          return;
        }
        var width = Math.floor(container.clientWidth || container.offsetWidth);
        var height = Math.floor(container.clientHeight || container.offsetHeight);
        if (width < 10 || height < 10) {
          // 弹窗动画未完成时容器可能为 0，稍后重试
          if (remain > 0) {
            setTimeout(function () {
              tryInit(remain - 1);
            }, 50);
          }
          return;
        }
        if (!that.fmapId || !that.fmapKey || !that.fmapName) {
          that.loading = false;
          that.$message({
            message: that.$t("mapmanagements.Please3dmapkey"),
            type: "warning",
          });
          return;
        }
        if (that.map3d && typeof that.map3d.dispose === "function") {
          try {
            that.map3d.dispose();
          } catch (e) {}
          that.map3d = null;
        }
        container.style.margin = "0";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.display = "flex";

        var mapOpation = {
          container: container,
          level: 1,
          visibleLevels: [1],
          focusAlphaMode: false,
          focusAlpha: 0.1,
          appName: that.fmapName,
          key: that.fmapKey,
          mapID: that.fmapId,
          defaultControlsPose: 0,
          modelSelectedEffect: false,
          defaultViewMode: fengmap.FMViewMode.MODE_3D,
          themeID: that.themeId,
          decoderURL: FENGMAP_DECODER_URL,
        };
        that.map3d = markRaw(new fengmap.FMMap(mapOpation));
        that._fengMapLastWidth = 0;
        that._fengMapLastHeight = 0;

        that.map3d.on("loaded", function () {
          that.loading = false;
          that.loadScrollFloorCtrl();
          that.resizeFengMap();
          that.observeFengMapResize();
          // 再延后一次，覆盖弹窗动画结束
          setTimeout(function () {
            that.resizeFengMap();
          }, 120);
        });
      };
      this.$nextTick(function () {
        tryInit(20);
      });
    },
    resizeFengMap() {
      var container = this.$refs.fengMap || document.getElementById("fengMap");
      var map = this.map3d;
      if (!container || !map) {
        return;
      }
      var width = Math.floor(container.clientWidth || container.offsetWidth);
      var height = Math.floor(container.clientHeight || container.offsetHeight);
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
      // 必须传宽高；无参 resize 会把画布设成无效尺寸导致白屏
      if (typeof map.resize === "function") {
        map.resize(width, height);
      }
    },
    observeFengMapResize() {
      this.unobserveFengMapResize();
      var target =
        document.querySelector(".check_3d_map") ||
        document.getElementById("fengMap");
      if (!target || typeof ResizeObserver === "undefined") {
        return;
      }
      var that = this;
      this._fengMapResizeObserver = new ResizeObserver(function () {
        clearTimeout(that._fengMapResizeTimer);
        that._fengMapResizeTimer = setTimeout(function () {
          that.resizeFengMap();
        }, 80);
      });
      this._fengMapResizeObserver.observe(target);
    },
    unobserveFengMapResize() {
      clearTimeout(this._fengMapResizeTimer);
      this._fengMapResizeTimer = null;
      if (this._fengMapResizeObserver) {
        this._fengMapResizeObserver.disconnect();
        this._fengMapResizeObserver = null;
      }
    },
    closeCheck(rule) {
      this.unobserveFengMapResize();
      if (this.map3d && typeof this.map3d.dispose === "function") {
        try {
          this.map3d.dispose();
        } catch (e) {}
      }
      this.map3d = null;
      this.edit3D = false;
      if (this.$refs[rule] && typeof this.$refs[rule].resetFields === "function") {
        this.$refs[rule].resetFields();
      }
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
      this.scrollFloorControl = markRaw(new fengmap.FMToolbar(scrollFloorCtlOpt));
      this.scrollFloorControl.addTo(this.map3d);
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
    setImageInfoFromMap(row) {
      if (!row) {
        return;
      }
      // 本系统 width=图片高，length=图片宽
      if (row.length && row.width) {
        this.imageInfo = {
          width: Number(row.length),
          height: Number(row.width),
        };
        this.imageX = Number(row.length);
        this.imageY = Number(row.width);
      }
    },
    recordImageSize(url) {
      if (!url) {
        return;
      }
      var that = this;
      var img = new Image();
      img.onload = function () {
        that.imageInfo = {
          width: img.width,
          height: img.height,
        };
        that.imageX = img.width;
        that.imageY = img.height;
      };
      img.src = url;
    },
    // 实际宽高比需接近图片高/宽（width 对应图片高，length 对应图片宽），偏差超过 20% 拦截
    validateRealSizeRatio(realwidth, reallength) {
      var rw = Number(realwidth);
      var rl = Number(reallength);
      var pw = Number(this.imageInfo && this.imageInfo.width);
      var ph = Number(this.imageInfo && this.imageInfo.height);
      if (!rw || !rl || !pw || !ph) {
        return true;
      }
      var actualRatio = rw / rl;
      var pixelRatio = ph / pw;
      var diff = Math.abs(actualRatio - pixelRatio) / pixelRatio;
      if (diff > 0.2) {
        this.$message({
          message: this.$t("mapmanagements.ratioMismatch"),
          type: "warning",
          duration: 5000,
        });
        return false;
      }
      return true;
    },
    // 点击打开地图计算实际宽度
    chooseMapPoint() {
      if (this.editCompany2D && this.fileListEdit[0]) {
        this.rememberMapImageFile(this.fileListEdit[0]);
        this.dialogImageUrl = this.resolveUploadImageUrl(this.fileListEdit[0]);
      } else if (this.fileListAdd[0]) {
        this.rememberMapImageFile(this.fileListAdd[0]);
      }
      this.openMapView(this.dialogImageUrl);
    },
  },
  beforeMount() {
    if (
      this.$store.state.userInfo.prionum == 1 ||
      this.$store.state.userInfo.prionum == 2
    ) {
      this.searchList = {
        mapid: "",
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
  beforeUnmount() {
    this.clearMapDialogInitTimer();
    this.removeMap();
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.scheduleMapDialogInit();
        });
      } else {
        this.clearMapDialogInitTimer();
      }
    },
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

.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}
.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}
.query,
.reset,
.del {
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

.map-search-bar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.map-search-bar :deep(.el-breadcrumb) {
  margin: 0 0 8px 2% !important;
  align-self: flex-start;
}

.map-search-row {
  box-sizing: border-box;
  width: 98% !important;
  max-width: 98% !important;
  margin: 0 0 16px 2% !important;
  display: flex !important;
  justify-content: flex-end !important;
}

.map-search-row .map-search-form,
.map-search-row :deep(.demo-form-inline) {
  width: auto !important;
  max-width: 100% !important;
  margin: 0 !important;
  justify-content: flex-end !important;
}

.imageSize :deep(.el-image-viewer__img) {
  position: absolute !important;
}

.el-page-header__content {
  margin-left: 30px;
}
.backProject :deep(.el-page-header__left) {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject :deep(.el-page-header__content) {
  text-align: left !important;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
/* .move {
  transform: translateX(4px);
} */
.edit-3d-actions {
  margin-top: 16px;
  text-align: right;
  padding-right: 8px;
}
.check_3d_box {
  display: flex;
  position: relative;
  width: 100%;
  height: 520px;
  min-height: 520px;
  margin: 0 !important;
}
.check_3d_info {
  width: 40%;
  margin-left: 0 !important;
  margin-right: 0 !important;
  position: relative;
  z-index: 2;
  overflow: auto;
  box-sizing: border-box;
}
.check_3d_map {
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  left: auto !important;
  width: 59% !important;
  height: 520px !important;
  margin: 0 !important;
  z-index: 1;
  overflow: hidden;
  background: #0e2232;
}
#fengMap {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  display: flex !important;
  position: relative !important;
  margin: 0 !important;
  left: 0 !important;
  top: 0 !important;
  box-sizing: border-box !important;
  background: #0e2232;
}
.mapview :deep(.el-dialog) {
  margin-top: 0 !important;
  height: 90vh;
  display: flex;
  flex-direction: column;
}
.mapview :deep(.el-dialog__body) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.mapContent {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: calc(90vh - 160px);
}

.map-image-stage {
  position: relative;
  flex: 1;
  min-height: 420px;
  width: 100%;
  overflow: hidden;
}

.map-image-preview {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f5f7fa;
  z-index: 0;
  pointer-events: none;
}

.mapContent #map {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 420px;
  background: transparent;
}

.mapContent :deep(.ol-viewport),
.mapContent :deep(.ol-overlaycontainer),
.mapContent :deep(.ol-overlaycontainer-stopevent) {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
}

.mapContent :deep(.ol-viewport canvas) {
  background: transparent !important;
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
.actual_width :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
}

.actual_width :deep(.el-form-item__content > .el-input) {
  width: auto !important;
  flex: 1 1 auto;
  min-width: 0;
  max-width: none;
}

.actual_width :deep(.el-form-item__content > .el-button) {
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: 0 !important;
}

.actual_width :deep(.el-form-item__content > .el-tooltip) {
  flex-shrink: 0;
}
.icon_button {
  padding: 2px 16px !important;
}

.terminal-filter-flow {
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px 16px;
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 16px;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  text-align: right !important;
  line-height: 32px;
  box-sizing: border-box;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow.is-en .terminal-filter-item :deep(.el-form-item__label) {
  width: auto !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input),
.terminal-filter-flow .terminal-filter-item :deep(.el-select),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor),
.terminal-filter-flow .terminal-filter-item :deep(.el-cascader) {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  float: none !important;
  margin: 0 !important;
  flex: none !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--datetimerange),
.terminal-filter-flow .terminal-filter-item :deep(.el-date-editor--daterange) {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-filter-flow .terminal-filter-item :deep(.el-input__wrapper),
.terminal-filter-flow .terminal-filter-item :deep(.el-select__wrapper) {
  width: 100% !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  float: none !important;
  order: 999;
}
.terminal-toolbar-item :deep(.el-form-item__content) {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  width: auto !important;
  margin: 0 !important;
}
.terminal-toolbar-item :deep(.el-button),
.terminal-toolbar-item :deep(.el-dropdown),
.terminal-toolbar-item :deep(.el-popover__),
.terminal-toolbar-item :deep(.el-tooltip__),
.terminal-toolbar-item :deep(.el-popover),
.terminal-toolbar-item :deep(.el-tooltip) {
  margin: 0 !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .query,
.terminal-filter-flow .reset,
.terminal-filter-flow .add,
.terminal.terminal-filter-flow .del,
.terminal-filter-flow .del,
.terminal-filter-flow .export,
.terminal-filter-flow .addTer,
.terminal-filter-flow .addBeacon {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  line-height: 1 !important;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.terminal-toolbar-item :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}
.search-actions :deep(.el-button) {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
}

</style>

<style>
.terminal-filter-flow {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px 16px !important;
  margin-bottom: 16px !important;
}
.terminal-filter-flow > .terminal-filter-form.demo-form-inline {
  display: contents !important;
}
.terminal-filter-flow .terminal-filter-item {
  margin: 0 !important;
  width: auto !important;
  flex: 0 0 auto !important;
  display: inline-flex !important;
  align-items: center !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 0 8px 0 0 !important;
  margin: 0 !important;
  justify-content: flex-end !important;
  white-space: nowrap !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow.is-en .terminal-filter-item .el-form-item__label {
  width: auto !important;
  min-width: auto !important;
  flex: 0 0 auto !important;
}
.terminal-filter-flow .terminal-filter-item .el-form-item__content {
  margin-left: 0 !important;
}
.terminal-filter-flow .terminal-filter-item .el-input,
.terminal-filter-flow .terminal-filter-item .el-select,
.terminal-filter-flow .terminal-filter-item .el-cascader {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  margin: 0 !important;
  float: none !important;
}
.terminal-filter-flow .terminal-filter-item .el-date-editor.el-input__wrapper,
.terminal-filter-flow .terminal-filter-item .el-date-editor--datetimerange,
.terminal-filter-flow .terminal-filter-item .el-date-editor--daterange {
  width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important;
}
.terminal-toolbar-item {
  width: auto !important;
  flex: 0 0 auto !important;
  margin: 0 !important;
  order: 999;
}
.terminal-toolbar-item .el-form-item__content {
  display: inline-flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 !important;
}
.terminal-toolbar-item .el-button,
.terminal-toolbar-item .el-dropdown {
  margin: 0 !important;
}
/* unified-filter-toolbar-btn-size */
.terminal-toolbar-row .el-button,
.terminal-toolbar-row > .el-dropdown .el-button,
.terminal-toolbar-item .el-button,
.search-actions .el-button {
  height: 28px !important;
  padding: 7px 15px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 编辑3D弹窗：固定地图区域尺寸，并抵消 App.vue *{margin:0 auto} */
.check_3d_box {
  display: flex !important;
  position: relative !important;
  width: 100% !important;
  height: 520px !important;
  min-height: 520px !important;
  margin: 0 !important;
}
.check_3d_info {
  width: 40% !important;
  margin: 0 !important;
  position: relative !important;
  z-index: 2 !important;
}
.check_3d_map {
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  left: auto !important;
  width: 59% !important;
  height: 520px !important;
  margin: 0 !important;
  z-index: 1 !important;
  overflow: hidden !important;
  background: #0e2232 !important;
}
.check_3d_map #fengMap,
#fengMap {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  display: flex !important;
  position: relative !important;
  left: 0 !important;
  top: 0 !important;
  margin: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box !important;
  background: #0e2232 !important;
}
.check_3d_map #fengMap canvas,
#fengMap canvas {
  margin: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  display: block !important;
}
.edit-3d-actions {
  margin-top: 16px;
  text-align: right;
  padding-right: 8px;
}

</style>

