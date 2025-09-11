<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Usermanagement /></el-aside>
        <el-main>
          <div class="user_input">
            <el-form
              class="demo-form-inline"
              :model="searchList"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item
                :label="$t('companymanagement.company')"
                style="display: flex; margin-left: 5%"
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-select
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

              <el-form-item style="margin-left: 20px">
                <el-button type="primary" class="query" @click="searchInfo()"
                  >{{ $t("companymanagement.search") }}
                </el-button>
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("companymanagement.reset")
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
                <el-button type="primary" class="add" @click="addUsers()">{{
                  $t("companymanagement.addclient")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="content_user">
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
            <!-- 公司展示 -->
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                fixed
                property="username"
                :label="$t('companymanagement.username')"
                min-width="150"
                align="center"
              ></el-table-column>

              <el-table-column
                property="tenantid"
                :label="$t('companymanagement.tenantid')"
                min-width="88"
                align="center"
              ></el-table-column>

              <el-table-column
                property="tel"
                :label="$t('companymanagement.tel')"
                min-width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                property="email"
                :label="$t('companymanagement.email')"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                property="country"
                :label="$t('companymanagement.country')"
                min-width="88"
                align="center"
              ></el-table-column>
              <el-table-column
                property="address"
                :label="$t('companymanagement.address')"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                property="schemes"
                :label="$t('companymanagement.schemes')"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                property="nsname"
                :label="$t('project.Networkserver1')"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                property="logopriostr"
                :label="$t('companymanagement.Setlogo')"
                min-width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                property="accpriostr"
                :label="$t('usermanagement.Accessrights')"
                min-width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                property="projectnum"
                :label="$t('companymanagement.item')"
                min-width="140"
                align="center"
              ></el-table-column>
              <el-table-column
                property="mapnum"
                :label="$t('companymanagement.item1')"
                min-width="130"
                align="center"
              ></el-table-column>
              <el-table-column
                property="devnum"
                :label="$t('companymanagement.item2')"
                min-width="140"
                align="center"
              ></el-table-column>
              <el-table-column
                property="validtime"
                :label="$t('companymanagement.item3')"
                min-width="180"
                align="center"
              ></el-table-column>
              <el-table-column
                property="createtime"
                :label="$t('companymanagement.createtime')"
                :formatter="formatDate"
                min-width="160"
                align="center"
              ></el-table-column>
              <el-table-column
                property="record"
                :label="$t('companymanagement.record')"
                min-width="300"
                align="center"
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('companymanagement.memo')"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('usermanagement.operate')"
                min-width="160"
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
                          @click="userEdit(scope.$index, tableData)"
                          class="edits"
                        >
                          {{ $t("usermanagement.edit") }}</el-button
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
                          @click="userDele(scope.$index)"
                          >{{ $t("usermanagement.delete") }}</el-button
                        ></el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-dropdown size="mini" type="primary" trigger="click">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('companymanagement.synchronization')"
                      placement="top"
                    >
                      <el-button type="primary" class="icon_button">
                        <img src="../../../static/synchronization.png" />
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
                          @click="userSync(scope.$index, tableData)"
                          class="edits"
                          >{{ $t("companymanagement.lns") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="mini"
                          @click="userSyncSQL(scope.$index, tableData)"
                          class="edits"
                        >
                          {{ $t("companymanagement.mysql") }}</el-button
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
          <!-- 添加模态框  :headers="setHeader"  -->
          <el-dialog
            :title="$t('companymanagement.addclientinfor')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="180px"
              :rules="addRules"
              ref="addData"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('companymanagement.clientname')"
                prop="username"
              >
                <el-input
                  v-model="addData.username"
                  :placeholder="$t('companymanagement.clientnamerule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clienttel')"
                :prop="i8n == 'zh' ? 'tel' : ''"
              >
                <el-input
                  v-model.number="addData.tel"
                  type="tel"
                  :placeholder="$t('companymanagement.clienttelrule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clientemail')"
                prop="email"
              >
                <el-input
                  v-model="addData.email"
                  :placeholder="$t('companymanagement.clientemailrule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clienttenantid')"
                prop=""
              >
                <el-input
                  disabled
                  v-model="addData.tenantid"
                  :placeholder="$t('companymanagement.clienttenantidrule')"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('companymanagement.clientschemes')"
                prop=""
              >
                <el-select
                  v-model="addSchemes"
                  multiple
                  :label="$t('terminal.chosetime')"
                >
                  <el-option
                    v-for="item in schemesList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('project.Networkserver')" prop="nsid">
                <el-select
                  v-model="addData.nsid"
                  :label="$t('terminal.chosetime')"
                >
                  <el-option
                    v-for="item in nsidList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('companymanagement.Numberitems')"
                prop=""
              >
                <el-input
                  v-model="addData.projectnum"
                  :placeholder="$t('companymanagement.Numberitems1')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.Numbermaps')" prop="">
                <el-input
                  v-model="addData.mapnum"
                  :placeholder="$t('companymanagement.Numbermaps1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.Numberequipment')"
                prop=""
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-input
                  v-model="addData.devnum"
                  :placeholder="$t('companymanagement.Numberequipment1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.Logopermission')"
                prop=""
              >
                <el-select
                  v-model="addData.logoprio"
                  clearable
                  filterable
                  :placeholder="$t('companymanagement.Logopermission1')"
                >
                  <el-option
                    v-for="item in logoprioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.item31')" prop="">
                <el-input
                  v-model="addData.validtime"
                  :placeholder="$t('companymanagement.item4')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clientcountry')"
                prop=""
              >
                <el-input
                  v-model="addData.country1"
                  :placeholder="$t('companymanagement.clientcountryrule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clientcountry')"
                prop=""
              >
                <el-select
                  v-model="addData.country2"
                  :placeholder="$t('companymanagement.clientcountryrule1')"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.value }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.label }}</span
                    ></el-option
                  >
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('companymanagement.clientaddress')"
                prop=""
              >
                <el-input
                  v-model="addData.address"
                  :placeholder="$t('companymanagement.clientaddressrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.clientrecord')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="1024"
                  v-model="addData.record"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.memo1')">
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

          <!-- 编辑模态框 -->
          <el-dialog
            :title="$t('companymanagement.edituser')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              ref="editData"
              :rules="editRules"
              class="demo-ruleForm"
              label-width="180px"
              style="text-align: left; margin-left: 10px"
            >
              <el-form-item :label="$t('companymanagement.clientname')">
                <el-input
                  disabled
                  v-model="editData.username"
                  :placeholder="$t('companymanagement.clientnamerule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clienttel')"
                :prop="i8n == 'zh' ? 'tel' : ''"
              >
                <el-input
                  v-model="editData.tel"
                  :placeholder="$t('companymanagement.clienttelrule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clientemail')"
                prop="email"
              >
                <el-input
                  v-model="editData.email"
                  :placeholder="$t('companymanagement.clientemailrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.clientschemes')">
                <el-select
                  v-model="editSchemes"
                  multiple
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in schemesList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('companymanagement.Numberitems')"
                prop=""
              >
                <el-input
                  v-model="editData.projectnum"
                  :placeholder="$t('companymanagement.Numberitems1')"
                ></el-input>
              </el-form-item>

              <el-form-item :label="$t('companymanagement.Numbermaps')" prop="">
                <el-input
                  v-model="editData.mapnum"
                  :placeholder="$t('companymanagement.Numbermaps1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.Numberequipment')"
                prop=""
                v-if="contrForPrionum == 1 || contrForPrionum == 2"
              >
                <el-input
                  v-model="editData.devnum"
                  :placeholder="$t('companymanagement.Numberequipment1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.Logopermission')"
                prop=""
              >
                <el-select
                  v-model="editData.logoprio"
                  clearable
                  filterable
                  :placeholder="$t('companymanagement.Logopermission1')"
                >
                  <el-option
                    v-for="item in logoprioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.item31')" prop="">
                <el-input
                  v-model="editData.validtime"
                  :placeholder="$t('companymanagement.item4')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.Accpermission')"
                prop=""
              >
                <el-select
                  v-model="editData.accprio"
                  clearable
                  filterable
                  :placeholder="$t('companymanagement.Accpermission1')"
                >
                  <el-option
                    v-for="item in accprioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.clientcountry')">
                <el-select
                  disabled
                  v-model="editData.country"
                  :placeholder="$t('companymanagement.clientcountryrule')"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.value }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.label }}</span
                    ></el-option
                  >
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('companymanagement.clientaddress')">
                <el-input
                  v-model="editData.address"
                  :placeholder="$t('companymanagement.clientaddressrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.clientrecord')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="1024"
                  v-model="editData.record"
                  class="editInput"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.memo1')">
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

          <!-- 删除 -->
          <el-dialog
            :title="$t('companymanagement.deleteclient')"
            :visible.sync="deleTpl"
            style="text-align: center"
          >
            <el-form>
              <p
                style="
                  line-height: 0px;
                  margin-bottom: 10px;
                  color: red;
                  fontsize: 20px;
                "
              >
                {{ $t("companymanagement.deleteclientrules") }}{{ deleUser
                }}{{ $t("companymanagement.deleteclientrules1") }}
              </p>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(deleTpl = false), (loading = false)">
                {{ $t("terminal.cancel") }}</el-button
              >
              <el-button type="primary" @click="deleTrue" :loading="loading">{{
                $t("terminal.confirm")
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
import basecard from "../../components/card/base-card";
import Usermanagement from "../../components/user/user";
import {
  getCustomerList,
  getCustomerName,
  getCustomerByTenantid,
  insertCustomer,
  updateCustomer,
  delCustomer,
  getNsAllName,
  addCustomerToMysql,
  addTenantOperateNs,
  importCustomer,
} from "../../axios/api";
export default {
  components: {
    Menu,
    basecard,
    Usermanagement,
  },
  name: "CompanyManagement",
  data() {
    //手机号码正则
    // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;

    //邮箱正则
    var isEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        // const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        const reg =
          /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

        const email = reg.test(value);
        if (!email) {
          callback(new Error(this.$t("companymanagement.clientemailrule2")));
        } else {
          callback();
        }
      }
    };

    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      tableData: [],
      loading: false,
      searchList: {
        tenantid: "",
        beginlevel: 1,
        endlevel: 3,
        page: 1,
        count: 20,
      },
      searchSelectCountry: [],
      tenantidData: [],
      currentPage1: 1,
      total: 0,
      addData: {
        nsid: "",
        username: "",
        tel: "",
        email: "",
        country1: "",
        country2: "",
        country: "",
        address: "",
        tenantid: "",
        memo: "",
        record: "",
        schemes: "",
        mapnum: "",
        projectnum: "",
        validtime: "",
        logoprio: "",
        superid: "",
        level: 2,
        devnum: "",
      },
      addSchemes: "",
      editSchemes: "",
      add: false, //添加模态框
      addRules: {
        nsid: [
          {
            required: true,
            message: this.$t("project.tet18"),
            trigger: "change",
          },
        ],
        username: [
          {
            required: true,
            message: this.$t("companymanagement.clientnamerule1"),
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: this.$t("companymanagement.clientemailrule1"),
            trigger: "blur",
          },
          { validator: isEmail, trigger: "blur" },
        ],
        tel: [
          {
            required: false,
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: this.$t("companymanagement.clienttelrule3"),
            trigger: "blur",
          },
        ],
      },

      editRules: {
        email: [
          {
            required: true,
            message: this.$t("companymanagement.clientemailrule1"),
            trigger: "blur",
          },
          { validator: isEmail, trigger: "blur" },
        ],
        tel: [
          {
            required: false,
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: this.$t("companymanagement.clienttelrule3"),
            trigger: "blur",
          },
        ],
      },

      logoprioList: [
        {
          index: 1,
          value: "Yes",
        },
        {
          index: 2,
          value: "No",
        },
      ],
      accprioList: [
        {
          index: 1,
          value: "Yes",
        },
        {
          index: 2,
          value: "No",
        },
      ],
      schemesList: [
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

      countryList: [
        { value: "Angola", label: "安哥拉" },
        { value: "Afghanistan", label: "阿富汗" },
        { value: "Albania", label: "阿尔巴尼亚" },
        { value: "Algeria", label: "阿尔及利亚" },
        { value: "Andorra", label: "安道尔共和国" },
        { value: "Anguilla", label: "安圭拉岛" },
        { value: "Antigua and Barbuda", label: "安提瓜和巴布达" },
        { value: "Argentina", label: "阿根廷" },
        { value: "Armenia", label: "亚美尼亚" },
        { value: "Ascension", label: "阿森松" },
        { value: "Australia", label: "澳大利亚" },
        { value: "Austria", label: "奥地利" },
        { value: "Azerbaijan", label: "阿塞拜疆" },
        { value: "Bahamas", label: "巴哈马" },
        { value: "Bahrain", label: "巴林" },
        { value: "Bangladesh", label: "孟加拉国" },
        { value: "Barbados", label: "巴巴多斯" },
        { value: "Belarus", label: "白俄罗斯" },
        { value: "Belgium", label: "比利时" },
        { value: "Belize", label: "伯利兹" },
        { value: "Benin", label: "贝宁" },
        { value: "Bermuda Is", label: "百慕大群岛" },
        { value: "Bolivia", label: "玻利维亚" },
        { value: "Botswana", label: "博茨瓦纳" },
        { value: "Brazil", label: "巴西" },
        { value: "Brunei", label: "文莱" },
        { value: "Bulgaria", label: "保加利亚" },
        { value: "Burkina Faso", label: "布基纳法索" },
        { value: "Burma", label: "缅甸" },
        { value: "Burundi", label: "布隆迪" },
        { value: "Cameroon", label: "喀麦隆" },
        { value: "Canada", label: "加拿大" },
        { value: "Cayman Is", label: "开曼群岛" },
        { value: "Central African Republic", label: "中非共和国" },
        { value: "Chad", label: "乍得" },
        { value: "Chile", label: "智利" },
        { value: "China", label: "中国" },
        { value: "Colombia", label: "哥伦比亚" },
        { value: "Congo", label: "刚果" },
        { value: "Cook Is", label: "库克群岛" },
        { value: "Costa Rica", label: "哥斯达黎加" },
        { value: "Cuba", label: "古巴" },
        { value: "Cyprus", label: "塞浦路斯" },
        { value: "Czech Republic", label: "捷克" },
        { value: "Denmark", label: "丹麦" },
        { value: "Djibouti", label: "吉布提" },
        { value: "Dominica Rep", label: "多米尼加共和国" },
        { value: "Ecuador", label: "厄瓜多尔" },
        { value: "Egypt", label: "埃及" },
        { value: "EI Salvador", label: "萨尔瓦多" },
        { value: "Estonia", label: "爱沙尼亚" },
        { value: "Ethiopia", label: "埃塞俄比亚" },
        { value: "Fiji", label: "斐济" },
        { value: "Finland", label: "芬兰" },
        { value: "France", label: "法国" },
        { value: "French Guiana", label: "法属圭亚那" },
        { value: "French Polynesia", label: "法属玻利尼西亚" },
        { value: "Gabon", label: "加蓬" },
        { value: "Gambia", label: "冈比亚" },
        { value: "Georgia", label: "格鲁吉亚" },
        { value: "Germany", label: "德国" },
        { value: "Ghana", label: "加纳" },
        { value: "Gibraltar", label: "直布罗陀" },
        { value: "Greece", label: "希腊" },
        { value: "Grenada", label: "格林纳达" },
        { value: "Guam", label: "关岛" },
        { value: "Guatemala", label: "危地马拉" },
        { value: "Guinea", label: "几内亚" },
        { value: "Guyana", label: "圭亚那" },
        { value: "Haiti", label: "海地" },
        { value: "Honduras", label: "洪都拉斯" },
        { value: "Hungary", label: "匈牙利" },
        { value: "Iceland", label: "冰岛" },
        { value: "India", label: "印度" },
        { value: "Indonesia", label: "印度尼西亚" },
        { value: "Iran", label: "伊朗" },
        { value: "Iraq", label: "伊拉克" },
        { value: "Ireland", label: "爱尔兰" },
        { value: "Israel", label: "以色列" },
        { value: "Italy", label: "意大利" },
        { value: "Ivory Coast", label: "科特迪瓦" },
        { value: "Jamaica", label: "牙买加" },
        { value: "Japan", label: "日本" },
        { value: "Jordan", label: "约旦" },
        { value: "Kampuchea (Cambodia )", label: "柬埔寨" },
        { value: "Kazakstan", label: "哈萨克斯坦" },
        { value: "Kenya", label: "肯尼亚" },
        { value: "Korea", label: "韩国" },
        { value: "Kuwait", label: "科威特" },
        { value: "Kyrgyzstan", label: "吉尔吉斯坦" },
        { value: "Laos", label: "老挝" },
        { value: "Latvia", label: "拉脱维亚" },
        { value: "Lebanon", label: "黎巴嫩" },
        { value: "Lesotho", label: "莱索托" },
        { value: "Liberia", label: "利比里亚" },
        { value: "Libya", label: "利比亚" },
        { value: "Liechtenstein", label: "列支敦士登" },
        { value: "Lithuania", label: "立陶宛" },
        { value: "Luxembourg", label: "卢森堡" },
        { value: "Madagascar", label: "马达加斯加" },
        { value: "Malawi", label: "马拉维" },
        { value: "Malaysia", label: "马来西亚" },
        { value: "Maldives", label: "马尔代夫" },
        { value: "Mali", label: "马里" },
        { value: "Malta", label: "马耳他" },
        { value: "Mariana Is", label: "马里亚那群岛" },
        { value: "Martinique", label: "马提尼克" },
        { value: "Mauritius", label: "毛里求斯" },
        { value: "Mexico", label: "墨西哥" },
        { value: "Moldova", label: "摩尔多瓦" },
        { value: "Monaco", label: "摩纳哥" },
        { value: "Mongolia", label: "蒙古" },
        { value: "Montserrat Is", label: "蒙特塞拉特岛" },
        { value: "Morocco", label: "摩洛哥" },
        { value: "Mozambique", label: "莫桑比克" },
        { value: "Namibia", label: "纳米比亚" },
        { value: "Nauru", label: "瑙鲁" },
        { value: "Nepal", label: "尼泊尔" },
        { value: "Netheriands Antilles", label: "荷属安的列斯" },
        { value: "Netherlands", label: "荷兰" },
        { value: "New Zealand", label: "新西兰" },
        { value: "Nicaragua", label: "尼加拉瓜" },
        { value: "Niger", label: "尼日尔" },
        { value: "Nigeria", label: "尼日利亚" },
        { value: "North Korea", label: "朝鲜" },
        { value: "Norway", label: "挪威" },
        { value: "Oman", label: "阿曼" },
        { value: "Pakistan", label: "巴基斯坦" },
        { value: "Panama", label: "巴拿马" },
        { value: "Papua New Cuinea", label: "巴布亚新几内亚" },
        { value: "Paraguay", label: "巴拉圭" },
        { value: "Peru", label: "秘鲁" },
        { value: "Philippines", label: "菲律宾" },
        { value: "Poland", label: "波兰" },
        { value: "Portugal", label: "葡萄牙" },
        { value: "Puerto Rico", label: "波多黎各" },
        { value: "Qatar", label: "卡塔尔" },
        { value: "Reunion", label: "留尼旺" },
        { value: "Romania", label: "罗马尼亚" },
        { value: "Russia", label: "俄罗斯" },
        { value: "Saint Lueia", label: "圣卢西亚" },
        { value: "Saint Vincent", label: "圣文森特岛" },
        { value: "Samoa Eastern", label: "东萨摩亚(美)" },
        { value: "Samoa Western", label: "西萨摩亚" },
        { value: "San Marino", label: "圣马力诺" },
        { value: "Sao Tome and Principe", label: "圣多美和普林西比" },
        { value: "Saudi Arabia", label: "沙特阿拉伯" },
        { value: "Senegal", label: "塞内加尔" },
        { value: "Seychelles", label: "塞舌尔" },
        { value: "Sierra Leone", label: "塞拉利昂" },
        { value: "Singapore", label: "新加坡" },
        { value: "Slovakia", label: "斯洛伐克" },
        { value: "Slovenia", label: "斯洛文尼亚" },
        { value: "Solomon Is", label: "所罗门群岛" },
        { value: "Somali", label: "索马里" },
        { value: "South Africa", label: "南非" },
        { value: "Spain", label: "西班牙" },
        { value: "SriLanka", label: "斯里兰卡" },
        { value: "St.Lucia", label: "圣卢西亚" },
        { value: "St.Vincent", label: "圣文森特" },
        { value: "Sudan", label: "苏丹" },
        { value: "Suriname", label: "苏里南" },
        { value: "Swaziland", label: "斯威士兰" },
        { value: "Sweden", label: "瑞典" },
        { value: "Switzerland", label: "瑞士" },
        { value: "Syria", label: "叙利亚" },
        { value: "Tajikstan", label: "塔吉克斯坦" },
        { value: "Tanzania", label: "坦桑尼亚" },
        { value: "Thailand", label: "泰国" },
        { value: "Togo", label: "多哥" },
        { value: "Tonga", label: "汤加" },
        { value: "Trinidad and Tobago", label: "特立尼达和多巴哥" },
        { value: "Tunisia", label: "突尼斯" },
        { value: "Turkey", label: "土耳其" },
        { value: "Turkmenistan", label: "土库曼斯坦" },
        { value: "Uganda", label: "乌干达" },
        { value: "Ukraine", label: "乌克兰" },
        { value: "United Arab Emirates", label: "阿拉伯联合酋长国" },
        { value: "United Kiongdom", label: "英国" },
        { value: "United States of America", label: "美国" },
        { value: "Uruguay", label: "乌拉圭" },
        { value: "Uzbekistan", label: "乌兹别克斯坦" },
        { value: "Venezuela", label: "委内瑞拉" },
        { value: "Vietnam", label: "越南" },
        { value: "Yemen", label: "也门" },
        { value: "Yugoslavia", label: "南斯拉夫" },
        { value: "Zimbabwe", label: "津巴布韦" },
        { value: "Zaire", label: "扎伊尔" },
        { value: "Zambia", label: "赞比亚" },
      ],
      pageCount: 20,
      prioList: [],
      editData: {
        tenantid: "",
        username: "",
        tel: "",
        email: "",
        country: "",
        address: "",
        memo: "",
        record: "",
        nsid: "",
        organizationID: "",
        schemes: "",
        mapnum: "",
        projectnum: "",
        validtime: "",
        logoprio: "",
        accprio: "",
        devnum: "",
      },
      editBtnDis: false,
      deleBtnDis: false,
      edit: false,
      deleUser: "",
      deleTenantid: "",
      deleTpl: false,
      resetKeysUser: "",
      passwordTpl: false,
      passwordData: {
        managerkey: "",
        passwordNew: "",
        passwordAgain: "",
      },

      nsidList: [],
      multipleSelection: [],
      headlistdata: "",
      exportData: "",
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
            level: 2,
          };

          importCustomer(
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
              that.getCustomerLists();
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
            case that.$t("companymanagement.username"):
              obj["username"] = outdata[i][key];
              break;
            case that.$t("companymanagement.tenantid"):
              obj["tenantid"] = outdata[i][key];
              break;
            case "tenantkey":
              obj["tenantkey"] = outdata[i][key];
              break;
            case that.$t("companymanagement.tel"):
              obj["tel"] = outdata[i][key];
              break;
            case that.$t("companymanagement.email"):
              obj["email"] = outdata[i][key];
              break;
            case that.$t("companymanagement.country"):
              obj["country"] = outdata[i][key];
              break;
            case that.$t("companymanagement.address"):
              obj["address"] = outdata[i][key];
              break;
            case that.$t("companymanagement.Setlogo"):
              obj["logoprio"] = outdata[i][key];
              break;
            case that.$t("usermanagement.Accessrights"):
              obj["accprio"] = outdata[i][key];
              break;
            case that.$t("companymanagement.item"):
              obj["projectnum"] = outdata[i][key];
              break;
            case that.$t("companymanagement.item1"):
              obj["mapnum"] = outdata[i][key];
              break;
            case that.$t("companymanagement.item2"):
              obj["devnum"] = outdata[i][key];
              break;
            case that.$t("companymanagement.item3"):
              obj["validtime"] = outdata[i][key];
              break;
            case that.$t("companymanagement.schemes"):
              obj["schemes"] = outdata[i][key];
              break;
            case that.$t("companymanagement.superid"):
              obj["superid"] = outdata[i][key];
              break;
            case that.$t("companymanagement.createtime"):
              obj["createtime"] = outdata[i][key];
              break;
            case that.$t("companymanagement.record"):
              obj["record"] = outdata[i][key];
              break;
            case that.$t("companymanagement.memo"):
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
          message: that.$t("beacon.tenantidrules"),
          type: "warning",
        });
        return;
      }
      this.headlistdata = [
        {
          msg: that.$t("companymanagement.username"),
          value: "username",
        },
        {
          msg: that.$t("companymanagement.tenantid"),
          value: "tenantid",
        },
        {
          msg: "tenantkey",
          value: "tenantkey",
        },
        {
          msg: that.$t("companymanagement.tel"),
          value: "tel",
        },
        {
          msg: that.$t("companymanagement.email"),
          value: "email",
        },
        {
          msg: that.$t("companymanagement.country"),
          value: "country",
        },
        {
          msg: that.$t("companymanagement.address"),
          value: "address",
        },
        {
          msg: that.$t("companymanagement.schemes"),
          value: "schemes",
        },
        {
          msg: that.$t("companymanagement.Setlogo"),
          value: "logoprio",
        },
        {
          msg: that.$t("usermanagement.Accessrights"),
          value: "accprio",
        },
        {
          msg: that.$t("companymanagement.item"),
          value: "projectnum",
        },
        {
          msg: that.$t("companymanagement.item1"),
          value: "mapnum",
        },
        {
          msg: that.$t("companymanagement.item2"),
          value: "devnum",
        },
        {
          msg: that.$t("companymanagement.item3"),
          value: "validtime",
        },
        {
          msg: that.$t("companymanagement.createtime"),
          value: "createtime",
        },
        {
          msg: that.$t("companymanagement.record"),
          value: "record",
        },
        {
          msg: that.$t("companymanagement.superid"),
          value: "superid",
        },
        {
          msg: that.$t("companymanagement.memo"),
          value: "memo",
        },
      ];

      that.export2Excel(this.multipleSelection);
    },
    export2Excel(tableData) {
      var that = this;
      var eHeaders3 = [];
      var exprotHeadertype = [
        "username",
        "tenantid",
        "tenantkey",
        "tel",
        "email",
        "country",
        "address",
        "schemes",
        "logoprio",
        "accprio",
        "projectnum",
        "mapnum",
        "devnum",
        "validtime",
        "createtime",
        "record",
        "superid",
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
        export_json_to_excel(tHeader, data, that.$t("list.Purchasingcompany"));
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    exportExcelAll() {
      var that = this;
      this.headlistdata = [
        {
          msg: that.$t("companymanagement.username"),
          value: "username",
        },
        {
          msg: that.$t("companymanagement.tenantid"),
          value: "tenantid",
        },
        {
          msg: "tenantkey",
          value: "tenantkey",
        },
        {
          msg: that.$t("companymanagement.tel"),
          value: "tel",
        },
        {
          msg: that.$t("companymanagement.email"),
          value: "email",
        },
        {
          msg: that.$t("companymanagement.country"),
          value: "country",
        },
        {
          msg: that.$t("companymanagement.address"),
          value: "address",
        },
        {
          msg: that.$t("companymanagement.schemes"),
          value: "schemes",
        },
        {
          msg: that.$t("companymanagement.Setlogo"),
          value: "logoprio",
        },
        {
          msg: that.$t("usermanagement.Accessrights"),
          value: "accprio",
        },
        {
          msg: that.$t("companymanagement.item"),
          value: "projectnum",
        },
        {
          msg: that.$t("companymanagement.item1"),
          value: "mapnum",
        },
        {
          msg: that.$t("companymanagement.item2"),
          value: "devnum",
        },
        {
          msg: that.$t("companymanagement.item3"),
          value: "validtime",
        },
        {
          msg: that.$t("companymanagement.createtime"),
          value: "createtime",
        },
        {
          msg: that.$t("companymanagement.record"),
          value: "record",
        },
        {
          msg: that.$t("companymanagement.superid"),
          value: "superid",
        },
        {
          msg: that.$t("companymanagement.memo"),
          value: "memo",
        },
      ];
      let data = {
        beginlevel: 1,
        endlevel: 3,
        username: "",
        country: "",
        tenantid: "",
        page: "",
        count: "",
      };
      getCustomerList(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
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
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getCustomerLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getCustomerLists();
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
    formatDate(row, column) {
      let date = new Date(parseInt(row.createtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    //获取客户信息
    getCustomerLists() {
      var that = this;
      getCustomerList(
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
    //查询客户信息
    searchInfo() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getCustomerByTenantid(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = [];
          that.tableData.push(res.data);
          that.total = that.tableData.length;
          that.$message({
            message: that.$t("companymanagement.searchsuccess"),
            type: "success",
          });
        }
        this.searchList.count = 20;
      });
    },

    //重置搜索输入
    clearBtn() {
      this.searchList = {
        beginlevel: 1,
        endlevel: 3,
        username: "",
        country: "",
        tenantid: "",
        page: 1,
        count: this.pageCount,
      };
      this.currentPage1 = 1;
      this.getCustomerLists();
      this.getCustomerNames();
    },

    //添加用户
    addUsers() {
      let that = this;
      this.addSchemes = "";
      this.addData = {
        nsid: "",
        username: "",
        tel: "",
        email: "",
        country1: "",
        country2: "",
        country: "",
        address: "",
        tenantid: "",
        memo: "",
        record: "",
        schemes: "",
        mapnum: "",
        projectnum: "",
        validtime: "",
        logoprio: "",
        superid: "",
        level: 2,
        devnum: "",
      };
      getNsAllName({}, this.tenantkey_A, this.tenantid_A, this.userName).then(
        (res) => {
          if (res.code == 1001) {
            that.nsidList = res.data;
          }
        }
      );
      this.add = true;
      this.addData.tenantid = this.makeTenantid(8);
      this.addData.superid = this.tenantid_A;
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addTrue(formName) {
      var that = this;
      if (this.addSchemes.length == 0) {
        this.$message({
          message: this.$t("companymanagement.clientschemesrule2"),
          type: "warning",
        });
        return;
      }

      for (let i = 0; i < this.addSchemes.length; i++) {
        that.addData.schemes += that.addSchemes[i] + ",";
      }
      that.addData.schemes = that.addData.schemes.slice(
        0,
        that.addData.schemes.length - 1
      );

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.addData.country1 == "" && that.addData.country2) {
            that.addData.country = that.addData.country2;
          } else if (that.addData.country2 == "" && that.addData.country1) {
            that.addData.country = that.addData.country1;
          } else if (that.addData.country1 && that.addData.country2) {
            that.addData.country = "";
            that.$message({
              message: this.$t("companymanagement.recountry"),
            });

            return;
          } else if (
            that.addData.country1 == "" &&
            that.addData.country2 == ""
          ) {
            that.addData.country = "";
            that.$message({
              message: this.$t("companymanagement.recountry1"),
            });
            return;
          }
          this.loading = true;
          insertCustomer(
            this.addData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getCustomerLists();
              that.getCustomerNames();
              that.$message({
                message: that.$t("companymanagement.addsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs[formName].resetFields();
            } else {
              that.addData.schemes = "";
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
    // 同步LSN
    userSync(index) {
      let that = this;
      console.log(this.tableData[index]);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let data = {
        username: this.tableData[index].username,
        tenantid: this.tableData[index].tenantid,
        schemes: this.tableData[index].schemes,
        nsid: this.tableData[index].nsid,
        level: this.tableData[index].level,
      };
      addTenantOperateNs(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        loading.close();
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
      }).catch((err) => {
        loading.close();
      })
    },

    // 同步MySQL
    userSyncSQL(index) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let that = this;
      addCustomerToMysql(
        { tenantid: this.tableData[index].tenantid },
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        loading.close();
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

    //修改用户信息
    userEdit(index) {
      this.editSchemes = this.tableData[index].schemes.split(",");
      this.editData.devnum = this.tableData[index].devnum;
      this.editData.username = this.tableData[index].username;
      this.editData.tel = this.tableData[index].tel;
      this.editData.email = this.tableData[index].email;
      this.editData.country = this.tableData[index].country;
      this.editData.address = this.tableData[index].address;
      this.editData.memo = this.tableData[index].memo;
      this.editData.record = this.tableData[index].record;
      this.editData.nsid = this.tableData[index].nsid;
      this.editData.organizationID = this.tableData[index].organizationID;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.logoprio = this.tableData[index].logoprio;
      this.editData.accprio = this.tableData[index].accprio;
      this.editData.validtime = this.tableData[index].validtime;
      this.editData.mapnum = this.tableData[index].mapnum;
      this.editData.projectnum = this.tableData[index].projectnum;
      this.editData.schemes = "";
      this.edit = true;
    },
    editCancel(editData) {
      this.edit = false;
      this.loading = false;
      this.$refs[editData].resetFields();
    },
    //确定提交
    editTrue(editData) {
      var that = this;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.editSchemes.length == 0) {
            this.$message({
              message: this.$t("companymanagement.clientschemesrule2"),
              type: "warning",
            });
            return;
          }
          for (let i = 0; i < this.editSchemes.length; i++) {
            that.editData.schemes += that.editSchemes[i] + ",";
          }
          that.editData.schemes = that.editData.schemes.slice(
            0,
            that.editData.schemes.length - 1
          );
          this.loading = true;
          updateCustomer(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              this.edit = false;
              this.getCustomerLists();
              this.getCustomerNames();
              that.$message({
                message: that.$t("companymanagement.editsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs[editData].resetFields();
            } else {
              that.editData.schemes = "";
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

    //点击删除
    userDele(index) {
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
      //删除用户信息
      this.deleUser = this.tableData[index].username;
      this.deleTenantid = this.tableData[index].tenantid;
      this.deleTpl = true;
    },
    deleTrue() {
      var that = this;
      this.$prompt(
        that.$t("usermanagement.passwordrules"),
        that.$t("Building.tips"),
        {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
          inputType: "password",
          beforeClose: function (action, instance, done) {
            if (action == "confirm") {
              let value = instance.inputValue;
              if (!value) {
                that.$message({
                  message: that.$t("usermanagement.passwordrules"),
                  type: "warning",
                });
                return;
              }
            }
            done();
          },
        }
      ).then(({ value }) => {
        let data = {
          username: this.deleUser,
          tenantid: this.deleTenantid,
          prioname: that.userName, //高权限用户名
          userkey: value, //高权限用户密码
        };
        this.loading = true;
        delCustomer(
          JSON.stringify(data),
          this.tenantkey_A,
          this.tenantid_A,
          this.userName
        ).then((res) => {
          if (res.code == 1001) {
            this.deleTpl = false;
            this.getCustomerLists();
            this.getCustomerNames();
            that.$message({
              message: that.$t("companymanagement.deletesuccess"),
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

    //随机生成tenantid
    makeTenantid(length) {
      var result = "";
      var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    //获取所有的Tenantid
    getCustomerNames() {
      var that = this;
      if (
        that.$store.state.userInfo.prionum == 1 ||
        that.$store.state.userInfo.prionum == 2
      ) {
        let data = {
          beginlevel: 1,
          endlevel: 3,
        };
        getCustomerName(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          that.tenantidData = res.data;
        });
      }
    },
  },

  beforeMount() {
    var that = this;
    this.getCustomerNames();

    switch (this.$store.state.userInfo.prio) {
      case "系统管理员":
        that.prioList = [
          {
            index: "2",
            value: this.$t("companymanagement.systemadmin1"),
          },
        ];
        break;
      case "系统子管理员":
        that.prioList = [
          {
            index: "3",
            value: this.$t("companymanagement.companyadmin"),
          },
          {
            index: "4",
            value: this.$t("companymanagement.companyadmin1"),
          },
          {
            index: "5",
            value: this.$t("companymanagement.companyuser"),
          },
          {
            index: "6",
            value: this.$t("companymanagement.companyassets"),
          },
        ];
      case "企业管理员":
        that.prioList = [
          {
            index: "4",
            value: this.$t("companymanagement.companyadmin1"),
          },
          {
            index: "5",
            value: this.$t("companymanagement.companyuser"),
          },
          {
            index: "6",
            value: this.$t("companymanagement.companyassets"),
          },
        ];
        break;
      case "企业子管理员":
        that.prioList = [
          {
            index: "5",
            value: this.$t("companymanagement.companyuser"),
          },
          {
            index: "6",
            value: this.$t("companymanagement.companyassets"),
          },
        ];
        break;
      case "企业用户":
        that.prioList = [
          {
            index: "6",
            value: this.$t("companymanagement.companyassets"),
          },
        ];
        break;
      default:
        that.prioList = [];
        break;
    }
    this.getCustomerLists();
  },
  watch: {
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;
      Object.assign(
        this.$data.addRules,
        this.$options.data.call(this).addRules
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

.user_input {
  float: left;
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

.content_user {
  margin-top: 20px;
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

.editInput >>> textarea {
  min-height: 88px !important;
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
