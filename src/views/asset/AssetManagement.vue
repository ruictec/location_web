<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu ref="menu" />
    </div>
    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Asset /></el-aside>

        <el-main>
          <!-- 第一行 -->
          <el-form
            class="demo-form-inline"
            :model="searchList"
            style="display: flex; white-space: nowrap; margin-left: 1%"
          >
            <el-form-item
              :label="$t('asset.AssetName')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-input v-model="searchList.name"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('asset.AssetNumber')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-input style="width: 95%; float: left" v-model="searchList.id">
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('asset.Labelnumber')"
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
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('asset.AssetType')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
              v-if="show"
            >
              <el-select
                v-model="searchList.type"
                filterable
                :placeholder="$t('staff.text')"
              >
                <el-option
                  v-for="item in assetList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('asset.AssetModel')"
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
                v-model="searchList.model"
                maxlength="32"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('asset.Department')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
                z-index: 1;
              "
              v-if="show"
            >
              <el-select
                v-model="searchList.depart"
                filterable
                :placeholder="$t('staff.text')"
              >
                <el-option
                  v-for="item in DepartList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              style="display: flex; margin-left: 1%; z-index: 1"
              v-if="!show"
            >
              <span class="el-dropdown-link" @click="changeItem()">
                {{ $t("asset.More")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-button type="primary" class="query" @click="searchStaff()">{{
                $t("asset.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("asset.reset")
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
                $t("asset.Addassets")
              }}</el-button
              ><el-button type="danger" class="add" @click="removeStaffs()">{{
                $t("asset.unbind")
              }}</el-button>
              <el-button
                type="primary"
                class="add add2"
                @click="goSetAsset()"
                >{{ $t("asset.AssetSettings") }}</el-button
              >
            </el-form-item>
          </el-form>
          <!-- 第二行 -->
          <el-form
            class="demo-form-inline"
            :model="searchList"
            style="display: flex; white-space: nowrap; margin-left: 1%"
            v-if="show"
          >
            <el-form-item
              :label="$t('asset.User')"
              style="
                display: flex;
                width: 15%;
                margin-left: 1%;
                margin-right: 0;
              "
            >
              <el-input v-model="searchList.username"></el-input>
            </el-form-item>
            <el-form-item style="display: flex; margin-left: 1%">
              <span class="el-dropdown-link" @click="changeItem()">
                {{ $t("inspection.State")
                }}<i class="el-icon-arrow-up el-icon--right"></i>
              </span>
              <el-button type="primary" class="query" @click="searchStaff()">{{
                $t("asset.search")
              }}</el-button>
              <el-button type="primary" class="reset" @click="clearBtn()">{{
                $t("asset.reset")
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
                $t("asset.Addassets")
              }}</el-button
              ><el-button type="danger" class="add" @click="removeStaffs()">{{
                $t("asset.unbind")
              }}</el-button>
              <el-button
                type="primary"
                class="add add2"
                @click="goSetAsset()"
                >{{ $t("asset.AssetSettings") }}</el-button
              >
            </el-form-item>
          </el-form>
          <!-- </div> -->

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
            </div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
              style="
                width: 97%;
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
                property="id"
                :label="$t('asset.AssetNumber1')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="name"
                :label="$t('asset.AssetName1')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="type"
                :label="$t('asset.AssetType1')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="model"
                :label="$t('asset.AssetModel1')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="username"
                :label="$t('asset.owninguser')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="depart"
                :label="$t('asset.Department1')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="beaconid"
                :label="$t('asset.labelnumber')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                property="warningstr"
                :label="$t('home.alarm')"
                align="center"
                show-overflow-tooltip
                v-if="intoProjectType == 2"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('asset.Remark')"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('asset.operate')"
                min-width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('asset.operate')"
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
                          @click="staffEdit(scope.$index, tableData)"
                          >{{ $t("asset.edit") }}</el-button
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
                          >{{ $t("asset.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('asset.position')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="edits icon_button"
                      @click="goLocation(scope.$index, tableData)"
                      ><img src="../../../static/location.png"
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

          <!-- 添加资产 -->
          <el-dialog
            :title="$t('asset.text1')"
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
                {{ $t("asset.text2") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="addData"
              label-width="110px"
              ref="addData"
              :rules="editRules"
              style="text-align: left; margin-top: 2%"
            >
              <el-form-item :label="$t('asset.AssetName2')" prop="name">
                <el-input v-model="addData.name" maxlength="32"></el-input>
              </el-form-item>
              <el-form-item :label="$t('asset.AssetType2')" prop="">
                <el-select
                  v-model="addData.type"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in assetList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('asset.AssetModel2')" prop="model">
                <el-input v-model="addData.model" maxlength="32"></el-input>
              </el-form-item>

              <el-form-item :label="$t('asset.User2')" prop="">
                <el-select
                  v-model="addData.username"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in assetUsername"
                    :key="item.username"
                    :label="item.username"
                    :value="item.username"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('asset.Department2')">
                <el-select
                  v-model="addData.depart"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in DepartList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('asset.Tagnumber2')">
                <el-select
                  v-model="addData.beaconid"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in beaconidLists"
                    :key="item.beaconid"
                    :label="
                      item.beaconid + ' / ' + item.major + ' / ' + item.minor
                    "
                    :value="item.beaconid"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('tet.Triggeralarm')"
                v-if="intoProjectType == 2"
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
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('asset.Remark2')">
                <el-input
                  type="textarea"
                  maxlength="255"
                  show-word-limit
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
          <!-- 地图预览 -->
          <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
          <!-- 编辑 -->
          <el-dialog
            :title="$t('asset.text3')"
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
                {{ $t("asset.text2") }}
              </div>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-form
              :model="editData"
              ref="editData"
              label-width="110px"
              :rules="editRules"
              style="text-align: left; margin-top: 2%"
            >
              <el-form-item :label="$t('asset.AssetName2')" prop="name">
                <el-input v-model="editData.name" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('asset.AssetType2')" prop="">
                <el-select
                  v-model="editData.type"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in assetList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('asset.AssetModel2')" prop="model">
                <el-input v-model="editData.model" maxlength="32"></el-input>
              </el-form-item>

              <el-form-item :label="$t('asset.User2')" prop="">
                <el-select
                  v-model="editData.username"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in assetUsername"
                    :key="item.username"
                    :label="item.username"
                    :value="item.username"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('asset.Department2')">
                <el-select
                  v-model="editData.depart"
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in DepartList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('asset.Tagnumber2')">
                <el-select
                  v-model="editData.beaconid"
                  clearable
                  filterable
                  :placeholder="$t('staff.text')"
                >
                  <el-option
                    v-for="item in beaconidLists"
                    :key="item.beaconid"
                    :label="
                      item.beaconid + ' / ' + item.major + ' / ' + item.minor
                    "
                    :value="item.beaconid"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('tet.Triggeralarm')"
                v-if="intoProjectType == 2"
              >
                <el-select
                  v-model="editData.warning"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in warningList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('asset.Remark2')">
                <el-input
                  type="textarea"
                  maxlength="64"
                  show-word-limit
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

          <!-- 解除分配信标 -->
          <el-dialog
            :title="$t('staff.text4')"
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
                property="id"
                :label="$t('asset.AssetNumber1')"
                align="center"
              ></el-table-column>
              <el-table-column
                property="name"
                :label="$t('asset.AssetName1')"
                align="center"
              ></el-table-column>
              <el-table-column
                property="type"
                :label="$t('asset.AssetType1')"
                align="center"
              ></el-table-column>
              <el-table-column
                property="model"
                :label="$t('asset.AssetModel1')"
                align="center"
              ></el-table-column>
              <el-table-column
                property="username"
                :label="$t('asset.owninguser')"
                align="center"
              ></el-table-column>
              <el-table-column
                property="depart"
                :label="$t('asset.Department1')"
                align="center"
              ></el-table-column>
              <el-table-column
                property="beaconid"
                :label="$t('asset.labelnumber')"
                align="center"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('asset.Remark')"
                align="center"
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
          <!-- 设置资产 -->
          <el-dialog
            :title="$t('asset.text5')"
            :visible.sync="addAssets"
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
                @click="addAssetRow"
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
                  @change="importAssets"
                  :placeholder="$t('asset.text6')"
                >
                  <el-option
                    v-for="item in projectList()"
                    :key="item.projectid"
                    :label="item.name"
                    :value="item.projectid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form
              label-width="80px"
              v-for="(item, index) in assetList"
              :key="item.id"
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
                    deleAssetRow(
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
              <el-button @click="addAssets = false">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button type="primary" @click="addAssetRowTrue()">{{
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
import host from "../../host";
import {
  delAsset,
  getBeaconid,
  updateRemoveBeacon,
  getAssetList,
  delAssetType,
  addAssetType,
  addAsset,
  updateAsset,
  getAssetType,
  getDepartmentType,
  getMemberList,
  getProjectListByTenantid,
  getAssetByEuis,
  getDevOtherList,
  importAsset,
} from "../../axios/api";
import Asset from "../../components/asset/asset.vue";
export default {
  components: {
    Menu,
    Asset,
  },
  name: "AssetManagement",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectType: this.$store.state.intoProjectType,
      show: false, //用来判断搜索栏是否展开
      loading: false,
      searchList: {
        name: "", //资产名称
        type: "", //资产类型
        model: "", //资产型号
        projectid: this.$store.state.projectid, //项目编号
        username: "", //所属人员
        depart: "", //部门
        beaconid: "", //资产信标编号
        memo: "",
        page: 1,
        count: 20,
        id: "", //资产编号
        ontime: "", //在线时间
        offtime: "", //离线时间
        // state: "",
      },
      assetUsername: [], //所属用户下拉框
      beaconidList: [], //标签号下拉框
      beaconidLists: [], //标签号下拉框
      bleList: [],
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
      searchSelectPerson: [],
      tableData: [],
      pageCount: 20,
      tenantidData: [],
      currentPage1: 1,
      total: 0,
      add: false,
      addData: {
        name: "", //资产姓名
        type: "", //资产类型
        model: "", //资产型号
        username: "", //所属用户
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        depart: "", //所在部门
        beaconid: "", //绑定标签好
        memo: "", //备注
        warning: "", //是否触发告警
        flag: "", //是否是信标
      },
      ProjectTye: "",
      maplabelList: [],
      edit: false,
      editData: {
        id: "",
        name: "", //资产姓名
        type: "", //资产类型
        model: "", //资产型号
        username: "", //所属用户
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        depart: "", //所在部门
        beaconid: "", //绑定标签好
        memo: "", //备注
        filename: "",
        warning: "", //是否触发告警
        flag: "",
      },
      editRules: {
        name: [
          {
            required: true,
            message: this.$t("asset.Pleaseassetname"),
            trigger: "blur",
          },
          {
            min: 1,
            max: 10,
            message: this.$t("asset.Length"),
            trigger: "blur",
          },
        ],
        model: [
          { max: 32, message: this.$t("asset.Length1"), trigger: "blur" },
        ],
      },
      deleStaff: "",
      deleId: "",
      deleTenantid: "",

      multipleSelection: [],
      removeStaff: false,
      removeDatas: [],
      removeStaffDatas: {
        ids: [],
      },

      assetList: [],
      DepartList: [],
      haveImage: false, //判断添加的资产有没有图片
      delImage: false, //判断资产是否要删除图片
      ImagePath: host.host + "user/addAssetMapFile",
      ImagePathEdit: host.host + "user/updateAssetMapFile",
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
      projectTable: [],
      currentProjectid: {
        projectid: "",
      },
      addAssets: false,
      assetList: [],
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

          importAsset(
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
              that.getAssetLists();
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
            case that.$t("asset.AssetNumber1"):
              obj["id"] = outdata[i][key];
              break;
            case that.$t("asset.AssetName1"):
              obj["name"] = outdata[i][key];
              break;
            case that.$t("asset.AssetType1"):
              obj["type"] = outdata[i][key];
              break;
            case that.$t("asset.AssetModel1"):
              obj["model"] = outdata[i][key];
              break;
            case that.$t("asset.owninguser"):
              obj["username"] = outdata[i][key];
              break;
            case that.$t("asset.Department1"):
              obj["depart"] = outdata[i][key];
              break;
            case that.$t("asset.labelnumber"):
              obj["beaconid"] = outdata[i][key];
              break;
            case that.$t("otherDev.beacon"):
              obj["flag"] = outdata[i][key];
              break;
            case that.$t("home.alarm"):
              obj["warning"] = outdata[i][key];
              break;
            case that.$t("asset.Remark"):
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
    //导出
    exportExcel() {
      var that = this;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: that.$t("asset.selectAsset"),
          type: "warning",
        });
        return;
      }
      this.headlistdata =
        that.intoProjectType == 1
          ? [
              {
                msg: that.$t("asset.AssetNumber1"),
                value: "id",
              },
              {
                msg: that.$t("asset.AssetName1"),
                value: "name",
              },
              {
                msg: that.$t("asset.AssetType1"),
                value: "type",
              },
              {
                msg: that.$t("asset.AssetModel1"),
                value: "model",
              },
              {
                msg: that.$t("asset.owninguser"),
                value: "username",
              },
              {
                msg: that.$t("asset.Department1"),
                value: "depart",
              },
              {
                msg: that.$t("asset.labelnumber"),
                value: "beaconid",
              },
              {
                msg: that.$t("otherDev.beacon"),
                value: "flag",
              },

              {
                msg: that.$t("asset.Remark"),
                value: "memo",
              },
            ]
          : [
              {
                msg: that.$t("asset.AssetNumber1"),
                value: "id",
              },
              {
                msg: that.$t("asset.AssetName1"),
                value: "name",
              },
              {
                msg: that.$t("asset.AssetType1"),
                value: "type",
              },
              {
                msg: that.$t("asset.AssetModel1"),
                value: "model",
              },
              {
                msg: that.$t("asset.owninguser"),
                value: "username",
              },
              {
                msg: that.$t("asset.Department1"),
                value: "depart",
              },
              {
                msg: that.$t("asset.labelnumber"),
                value: "beaconid",
              },
              {
                msg: that.$t("otherDev.beacon"),
                value: "flag",
              },
              {
                msg: that.$t("home.alarm"),
                value: "warning",
              },
              {
                msg: that.$t("asset.Remark"),
                value: "memo",
              },
            ];

      that.export2Excel(this.multipleSelection);
    },
    export2Excel(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype =
        that.intoProjectType == 1
          ? [
              "id",
              "name",
              "type",
              "model",
              "username",
              "depart",
              "beaconid",
              "flag",
              "memo",
            ]
          : [
              "id",
              "name",
              "type",
              "model",
              "username",
              "depart",
              "beaconid",
              "flag",
              "warning",
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
        export_json_to_excel(tHeader, data, that.$t("list.assetmanagement"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    exportExcelAll() {
      var that = this;
      this.headlistdata =
        that.intoProjectType == 1
          ? [
              {
                msg: that.$t("asset.AssetNumber1"),
                value: "id",
              },
              {
                msg: that.$t("asset.AssetName1"),
                value: "name",
              },
              {
                msg: that.$t("asset.AssetType1"),
                value: "type",
              },
              {
                msg: that.$t("asset.AssetModel1"),
                value: "model",
              },
              {
                msg: that.$t("asset.owninguser"),
                value: "username",
              },
              {
                msg: that.$t("asset.Department1"),
                value: "depart",
              },
              {
                msg: that.$t("asset.labelnumber"),
                value: "beaconid",
              },
              {
                msg: that.$t("otherDev.beacon"),
                value: "flag",
              },
              {
                msg: that.$t("asset.Remark"),
                value: "memo",
              },
            ]
          : [
              {
                msg: that.$t("asset.AssetNumber1"),
                value: "id",
              },
              {
                msg: that.$t("asset.AssetName1"),
                value: "name",
              },
              {
                msg: that.$t("asset.AssetType1"),
                value: "type",
              },
              {
                msg: that.$t("asset.AssetModel1"),
                value: "model",
              },
              {
                msg: that.$t("asset.owninguser"),
                value: "username",
              },
              {
                msg: that.$t("asset.Department1"),
                value: "depart",
              },
              {
                msg: that.$t("asset.labelnumber"),
                value: "beaconid",
              },
              {
                msg: that.$t("otherDev.beacon"),
                value: "flag",
              },
              {
                msg: that.$t("home.alarm"),
                value: "warning",
              },
              {
                msg: that.$t("asset.Remark"),
                value: "memo",
              },
            ];
      let data = {
        name: "", //资产名称
        type: "", //资产类型
        model: "", //资产型号
        projectid: this.$store.state.projectid, //项目编号
        username: "", //所属人员
        depart: "", //部门
        beaconid: "", //资产信标编号
        memo: "",
        page: "",
        count: " ",
        id: "",
        ontime: "",
        offtime: "",
      };
      getAssetList(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.export2Excel(res.data.list);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    projectList() {
      return this.projectTable.filter((item) => {
        return item.projectid !== this.$store.state.projectid;
      });
    },
    getProjectLists() {
      let data = {
        tenantid: this.$store.state.userInfo.tenantid,
      };
      getProjectListByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.username
      ).then((res) => {
        if (res.code == 1001) {
          this.projectTable = res.data.list;
        }
      });
    },
    //资产设置
    goSetAsset() {
      this.getProjectLists();
      var that = this;
      this.currentProjectid.projectid = "";
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      getAssetType(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.assetList = res.data;
            that.addAssets = true;
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        }
      );
    },
    addAssetRow() {
      this.assetList.push({});
    },
    //导入资产
    importAssets(val) {
      if (!val) return;
      var that = this;
      let data = {
        tenantid: this.tenantid_A,
        projectid: this.currentProjectid.projectid,
      };
      getAssetType(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            if (res.data.length > 0) {
              // //导入后自动去重

              let arr = res.data;
              that.assetList.forEach((i) => {
                arr.forEach((j, index) => {
                  if (j.name == i.name) {
                    arr.splice(index, 1);
                  }
                });
              });
              arr.forEach((item) => {
                that.assetList.push({
                  name: item.name,
                  id: "",
                  tenantid: item.tenantid,
                  projectid: item.projectid,
                });
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
    //删除资产
    deleAssetRow(index, id, name, tenantid, projectid) {
      if (!name || !id) {
        this.assetList.splice(index, 1);
      } else {
        var that = this;
        let data = {
          tenantid: tenantid,
          projectid: projectid,
          name: name,
        };
        delAssetType(
          JSON.stringify(data),
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.assetList.splice(index, 1);
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      }
    },
    addAssetRowTrue() {
      var that = this;
      let flag = false;
      let flag1 = false;
      let hash = {};
      $.each(this.assetList, function (i, n) {
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
          message: this.$t("asset.Assetempty"),
          type: "error",
        });
        this.assetList.splice(-1, 1);
        return;
      }
      if (flag1) {
        that.$message({
          message: this.$t("asset.Assetexists"),
          type: "error",
        });
        this.assetList.splice(-1, 1);
        return;
      }
      let data = {
        branchs: this.assetList.filter(item => !item.id).map(({id,...item})=>item),
        tenantid: this.tenantid_A,
        projectid: this.$store.state.projectid,
      };
      data.branchs = JSON.stringify(data.branchs);
      addAssetType(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.$message({
              message: that.$t("asset.Setsuccessfully"),
              type: "success",
            });
            that.addAssets = false;
            this.getAssetTypes();
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
        this.searchList.page = 1;
        this.getAssetLists();
        this.$message({
          message: this.$t("beacon.addsuccess"),
          type: "success",
        });
        this.loading = false;
        this.$refs.addData.resetFields();
      } else {
        this.$message({
          message: this.$t("beacon.addfaile"),
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
        this.searchList.page = 1;
        this.getAssetLists();
        this.$message({
          message: this.$t("beacon.editsuccess"),
          type: "success",
        });
        this.loading = false;
      } else {
        this.$message({
          message: this.$t("beacon.editfaile"),
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

    //展开、收起搜索栏
    changeItem() {
      this.show = !this.show;
    },
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      if (this.$route.query.euis) {
        var that = this;
        let data = {
          euis: this.$store.state.assetEuis,
          page: this.searchList.page,
          count: this.searchList.count,
          flag: this.$route.query.flag,
          projectid: this.$store.state.projectid,
        };
        getAssetByEuis(
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
        this.getAssetLists();
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
          euis: this.$store.state.assetEuis,
          page: this.searchList.page,
          count: this.searchList.count,
          flag: this.$route.query.flag,
          projectid: this.$store.state.projectid,
        };
        getAssetByEuis(
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
        this.getAssetLists();
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
        name: "", //资产名称
        type: "", //资产类型
        model: "", //资产型号
        projectid: this.$store.state.projectid, //项目编号
        username: "", //所属人员
        depart: "", //部门
        beaconid: "", //资产信标编号
        memo: "",
        page: 1,
        count: 10,
        id: "",
        ontime: "",
        offtime: "",
        // state: "",
      };
      this.currentPage1 = 1;
      this.$route.query.euis = "";
      that.$store.commit("changeAssetEuis", "");
      this.getAssetLists();
    },

    getMemberLists() {
      var that = this;
      return new Promise((resolve, reject) => {
        let data = {
          tenantid: this.$store.state.userInfo.tenantid, //公司识别号
          projectid: this.$store.state.projectid, //项目编号
        };
        getMemberList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.assetUsername = res.data.list;
            resolve();
          }
        });
      });
    },

    //标签号下拉框
    getBeaconids(val) {
      var that = this;
      return new Promise((resolve, reject) => {
        let data = {
          projectid: val,
          inallot: 1,
          inuse: 2,
          workstate: 1,
          type: 3,
        };
        getBeaconid(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            for (let i = 0; i < res.data.length; i++) {
              that.beaconidList[i] = {
                beaconid: res.data[i].beaconid,
                major: res.data[i].major,
                minor: res.data[i].minor,
              };
            }
            resolve();
          }
        });
      });
    },

    // 获取蓝牙传感器信息
    getDevOtherLists(val) {
      var that = this;
      return new Promise((resolve, reject) => {
        let data = {
          devtype: 5,
          tenantid: this.$store.state.intoProjectSuperid,
          projectid: val,
          inallot: 1,
          inuse: 2,
          workstate: 1,
        };
        getDevOtherList(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            for (let i = 0; i < res.data.list.length; i++) {
              that.bleList[i] = {
                beaconid: res.data.list[i].deveui,
                major: res.data.list[i].mode,
                minor: res.data.list[i].scheme,
              };
            }
            resolve();
          }
        });
      });
    },

    //添加资产
    addStaff() {
      this.fileListAdd = [];
      this.haveImage = false;
      var that = this;

      this.assetUsername = []; //所属用户下拉框
      this.beaconidList = []; //标签号下拉框
      this.beaconidLists = [];
      this.bleList = [];
      this.addData = {
        name: "", //资产姓名
        type: "", //资产类型
        model: "", //资产型号
        username: "", //所属用户
        tenantid: this.$store.state.userInfo.tenantid, //公司识别号
        projectid: this.$store.state.projectid, //项目编号
        depart: "", //所在部门
        beaconid: "", //绑定标签好
        memo: "", //备注
        warning: "", //是否触发告警
        flag: "", //是否是信标
      };

      Promise.all([
        this.getMemberLists(),
        this.getBeaconids(this.$store.state.projectid),
        this.getDevOtherLists(this.$store.state.projectid),
        this.getAssetTypes(),
      ]).then(() => {
        that.beaconidLists = that.beaconidList.concat(that.bleList);
        that.add = true;
      });
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
          that.addData.flag = that.beaconidList.some(
            (item) => item.beaconid === that.addData.beaconid
          );
          if (that.haveImage) {
            that.userIdForPic.name = that.addData.name;
            that.userIdForPic.type = that.addData.type;
            that.userIdForPic.model = that.addData.model;
            that.userIdForPic.username = that.addData.username;
            that.userIdForPic.tenantid = that.addData.tenantid;
            that.userIdForPic.projectid = that.addData.projectid;
            that.userIdForPic.depart = that.addData.depart;
            that.userIdForPic.beaconid = that.addData.beaconid;
            that.userIdForPic.memo = that.addData.memo;
            that.userIdForPic.warning = that.addData.warning;
            that.userIdForPic.flag = that.addData.flag;
            that.$refs.upload.submit();
          } else {
            addAsset(
              this.addData,
              this.tenantkey_A,
              this.tenantid_A,
              this.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.add = false;
                that.searchList.page = 1;
                that.getAssetLists();
                that.$message({
                  message: that.$t("beacon.addsuccess"),
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
      var that = this;
      this.assetUsername = []; //所属用户下拉框
      this.beaconidList = []; //标签号下拉框
      this.beaconidLists = [];
      this.bleList = [];
      this.editData.id = this.tableData[index].id;
      this.editData.name = this.tableData[index].name;
      this.editData.type = this.tableData[index].type;
      this.editData.model = this.tableData[index].model;
      this.editData.username = this.tableData[index].username;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.depart = this.tableData[index].depart;
      this.editData.projectid = this.tableData[index].projectid;
      this.editData.beaconid = this.tableData[index].beaconid;
      this.editData.memo = this.tableData[index].memo;
      this.editData.filename = this.tableData[index].filename;
      this.editData.warning = this.tableData[index].warning;
      this.editData.flag = this.tableData[index].flag;
      Promise.all([
        this.getMemberLists(),
        this.getBeaconids(this.$store.state.projectid),
        this.getDevOtherLists(this.$store.state.projectid),
        this.getAssetTypes(),
      ]).then(() => {
        that.beaconidLists = that.beaconidList.concat(that.bleList);
        that.edit = true;
      });
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
          that.editData.flag = that.beaconidList.some(
            (item) => item.beaconid === that.editData.beaconid
          );
          if (that.haveImage) {
            that.userIdForPicEdit.id = that.editData.id;
            that.userIdForPicEdit.name = that.editData.name;
            that.userIdForPicEdit.type = that.editData.type;
            that.userIdForPicEdit.model = that.editData.model;
            that.userIdForPicEdit.username = that.editData.username;
            that.userIdForPicEdit.tenantid = that.editData.tenantid;
            that.userIdForPicEdit.depart = that.editData.depart;
            that.userIdForPicEdit.projectid = that.editData.projectid;
            that.userIdForPicEdit.beaconid = that.editData.beaconid;
            that.userIdForPicEdit.memo = that.editData.memo;
            that.userIdForPicEdit.warning = that.editData.warning;
            that.userIdForPicEdit.flag = that.editData.flag;
            that.$refs.upload.submit();
          } else {
            if (that.delImage) {
              that.editData.filename = "";
            }
            updateAsset(
              that.editData,
              that.tenantkey_A,
              that.tenantid_A,
              that.userName
            ).then((res) => {
              if (res.code == 1001) {
                that.edit = false;
                that.searchList.page = 1;
                that.getAssetLists();
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
        } else {
          return false;
        }
      });
    },

    // 删除资产
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
      this.$confirm(
        this.$t("beacon.deletemsg1") +
          this.tableData[index].name +
          this.$t("beacon.deletemsg31"),
        this.$t("beacon.prompt"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        this.deleStaff = this.tableData[index].name;
        this.deleId = this.tableData[index].id;
        this.deleTrue();
      });
    },
    deleTrue() {
      var that = this;
      let data = {
        id: this.deleId,
      };
      data.id = JSON.stringify(data.id);
      this.loading = true;
      delAsset(data, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.searchList.page = 1;
            that.getAssetLists();
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
        }
      );
    },

    //搜索
    searchStaff() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getAssetList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          if (res.data.list.length > 0) {
            that.$message({
              message: tat.$t("beacon.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("beacon.nodata"),
              type: "warning",
            });
          }
        }
      });
    },

    // 解除绑定
    removeStaffs(index) {
      var that = this;
      this.removeStaffDatas = {
        ids: [],
      };
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("beacon.Pleaseunbound"),
          type: "warning",
        });
        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[i].beaconid == null ||
          this.multipleSelection[i].beaconid == ""
        ) {
          this.$message({
            message: this.$t("asset.Pleaseassets"),
            type: "warning",
          });
          return;
        }
        this.removeStaffDatas.ids.push(this.multipleSelection[i].id);
      }

      this.removeDatas = this.multipleSelection;
      this.removeStaff = true;
    },

    removeTrue() {
      var that = this;
      this.loading = true;
      updateRemoveBeacon(
        this.removeStaffDatas,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.removeStaff = false;
          that.searchList.page = 1;
          that.getAssetLists();
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

    //获取资产信息
    getAssetLists() {
      var that = this;
      getAssetList(
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

    //获取资产类型下拉框
    getAssetTypes() {
      var that = this;
      return new Promise((resolve, reject) => {
        let data = {
          tenantid: this.tenantid_A,
          projectid: this.$store.state.projectid,
        };
        getAssetType(
          data,
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.assetList = res.data;
            resolve();
          } else {
            that.$message({
              message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
              type: "error",
            });
          }
        });
      });
    },

    //获取部门下拉框
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
          this.DepartList = res.data;
        }
      });
    },
    //点击跳转到定位页面
    goLocation(index) {
      if (
        this.tableData[index].beaconid == "" ||
        this.tableData[index].beaconid == null
      ) {
        this.$message({
          message: this.$t("asset.Pleasebinding"),
          type: "warning",
        });
        return;
      }
      this.$router.push({
        path: "/location/indoor/locationindoor",
        query: { assetDeveui: this.tableData[index].beaconid },
      });
    },
  },
  beforeMount() {
    if (this.$route.query.assetype == 1) {
      this.searchList.ontime = this.$route.query.timeStamp;
    } else if (this.$route.query.assetype == 2) {
      this.searchList.offtime = this.$route.query.timeStamp;
    }
    if (this.$route.query.euis) {
      var that = this;
      let data = {
        euis: this.$store.state.assetEuis,
        page: 1,
        count: 20,
        flag: this.$route.query.flag,
        projectid: this.$store.state.projectid,
      };
      getAssetByEuis(
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
      this.getAssetLists();
    }
    this.getAssetTypes();
    this.getDepart();
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
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
.add {
  padding: 8px 12px !important;
}
.icon_button {
  padding: 2px 16px !important;
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-form-item .el-button {
  margin-left: 4px !important;
}
.el-form-item .el-button.el-button--danger {
  transform: translateX(4px);
}
.el-form-item .el-button.add2 {
  margin-left: 8px !important;
}
</style>
