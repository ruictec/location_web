<template>
  <div :class="contrForPrioNum != 5 ? 'home' : ''" style="height: 100%">
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
                <el-button type="primary" class="query" @click="searchInfo()">{{
                  $t("companymanagement.search")
                }}</el-button>
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
            <!-- 展示 -->
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
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                property="tenantid"
                :label="$t('companymanagement.tenantid')"
                min-width="88"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                property="tenantkey"
                label="tenantkey"
                min-width="88"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                property="tel"
                :label="$t('companymanagement.tel')"
                min-width="120"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="email"
                :label="$t('companymanagement.email')"
                min-width="150"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="address"
                :label="$t('companymanagement.address')"
                min-width="150"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="logopriostr"
                :label="$t('companymanagement.Setlogo')"
                min-width="160"
                align="center"
                show-overflow-tooltip
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("companymanagement.Setlogo")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("companymanagement.tet") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="accpriostr"
                :label="$t('usermanagement.Accessrights')"
                min-width="140"
                align="center"
                show-overflow-tooltip
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">
                    {{ $t("usermanagement.Accessrights") }}</span
                  >
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("companymanagement.tet1") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="mapriostr"
                :label="$t('myorderde.projectmanagement')"
                min-width="185"
                align="center"
                show-overflow-tooltip
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("myorderde.projectmanagement")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("companymanagement.tet2") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip> </template
              ></el-table-column>
              <el-table-column
                property="createtime"
                :label="$t('companymanagement.createtime')"
                :formatter="formatDate"
                min-width="160"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="record"
                :label="$t('companymanagement.record')"
                min-width="300"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                property="memo"
                :label="$t('companymanagement.memo')"
                min-width="150"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('companymanagement.operate1')"
                min-width="80"
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
                          >{{ $t("companymanagement.edit") }}</el-button
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
                          >{{ $t("companymanagement.delete") }}</el-button
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
              label-width="160px"
              :rules="addRules"
              ref="addData"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('companymanagement.clientname')"
                prop="username"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.username"
                  :placeholder="$t('companymanagement.clientnamerule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clienttel')"
                :prop="i8n == 'zh' ? 'tel' : ''"
                style="margin-right: 2%"
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
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.email"
                  :placeholder="$t('companymanagement.clientemailrule')"
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
                    <p>{{ $t("companymanagement.tet3") }}</p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clienttenantid')"
                prop=""
                style="margin-right: 2%"
              >
                <el-input
                  disabled
                  v-model="addData.tenantid"
                  :placeholder="$t('companymanagement.clienttenantidrule')"
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
                      {{ $t("companymanagement.tet4") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.tet5')"
                prop=""
                v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.devnum"
                  :placeholder="$t('companymanagement.Numberequipment1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clientaddress')"
                prop=""
                style="margin-right: 2%"
              >
                <el-input
                  v-model="addData.address"
                  :placeholder="$t('companymanagement.clientaddressrule')"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('companymanagement.Logopermission')"
                prop=""
                v-if="logoprio == 1"
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
                      {{ $t("companymanagement.tet6") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('companymanagement.tet7')" prop="">
                <el-select
                  v-model="addData.maprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.priorules')"
                >
                  <el-option
                    v-for="item in mapprioList"
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
                      {{ $t("companymanagement.tet8") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clientrecord')"
                style="margin-right: 2%"
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="1024"
                  v-model="addData.record"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.memo1')"
                style="margin-right: 2%"
              >
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
                $t("companymanagement.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addTrue('addData')"
                :loading="loading"
                >{{ $t("companymanagement.confirm") }}</el-button
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
              label-width="160px"
              style="text-align: left; margin-left: 10px"
            >
              <el-form-item :label="$t('companymanagement.clientname')">
                <el-input
                  disabled
                  v-model="editData.username"
                  :placeholder="$t('companymanagement.clientnamerule1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clienttel')"
                :prop="i8n == 'zh' ? 'tel' : ''"
              >
                <el-input
                  v-model="editData.tel"
                  :placeholder="$t('companymanagement.clienttelrule1')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('companymanagement.clientemail')"
                prop="email"
              >
                <el-input
                  v-model="editData.email"
                  :placeholder="$t('companymanagement.clientemailrule1')"
                ></el-input>
              </el-form-item>

              <el-form-item :label="$t('companymanagement.clientaddress')">
                <el-input
                  v-model="editData.address"
                  :placeholder="$t('companymanagement.clientaddressrule')"
                ></el-input>
              </el-form-item>

              <el-form-item
                :label="$t('companymanagement.Logopermission')"
                prop=""
                v-if="logoprio == 1"
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
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <div slot="content">
                    <p>
                      {{ $t("companymanagement.tet6") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('usermanagement.prio1')" prop="">
                <el-select
                  v-model="editData.accprio"
                  clearable
                  filterable
                  :placeholder="$t('companymanagement.tet9')"
                >
                  <el-option
                    v-for="item in accprioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <div slot="content">
                    <p>
                      {{ $t("companymanagement.tet91") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('companymanagement.tet7')" prop="">
                <el-select
                  v-model="editData.maprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.priorules')"
                >
                  <el-option
                    v-for="item in mapprioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right-start"
                  style="font-size: 130%"
                >
                  <div slot="content">
                    <p>
                      {{ $t("companymanagement.tet8") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
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
                $t("companymanagement.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="editTrue('editData')"
                :loading="loading"
                >{{ $t("companymanagement.confirm") }}</el-button
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
                {{ $t("companymanagement.deleteclientrules") }}{{ deleUser }}?
              </p>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(deleTpl = false), (loading = false)">{{
                $t("companymanagement.cancel")
              }}</el-button>
              <el-button type="primary" @click="deleTrue" :loading="loading">{{
                $t("companymanagement.confirm")
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
  importCustomer,
} from "../../axios/api";
export default {
  components: {
    Menu,
    basecard,
    Usermanagement,
  },
  name: "CustomerManagement",
  data() {
    //手机号码正则
    // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;

    //邮箱正则
    var isEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        // const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        const reg =
          /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

        const email = reg.test(value);
        if (!email) {
          callback(new Error(this.$t("usermanagement.meil")));
        } else {
          callback();
        }
      }
    };
    var nums = (rule, value, callback) => {
      const boolean = new RegExp("^[1-9][0-9]*$").test(value);
      if (!boolean) {
        callback(new Error(this.$t("warning.positiveinteger")));
      }
    };

    return {
      i8n: this.$store.state.i18n,
      contrForPrioNum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      logoprio: this.$store.state.userInfo.logoprio,
      tableData: [],
      loading: false,
      searchList: {
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        beginlevel: 2,
        endlevel: 4,
        page: 1,
        count: 20,
      },
      searchSelectCountry: [],
      tenantidData: [],
      currentPage1: 1,
      total: 0,
      addData: {
        username: "",
        tel: "",
        email: "",
        address: "",
        tenantid: "",
        memo: "",
        record: "",
        superid: "",
        level: 2,
        logoprio: "",
        maprio: "",
        devnum: "",
      },
      add: false, //添加模态框
      addRules: {
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

      mapprioList: [
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

      pageCount: 20,
      prioList: [],
      editData: {
        accprio: "",
        tenantid: "",
        username: "",
        tel: "",
        email: "",
        address: "",
        memo: "",
        record: "",
        nsid: "",
        organizationID: "",
        logoprio: "",
        maprio: "",
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

      showscheme: false, //展示制式

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
            level: 3,
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
            case that.$t("companymanagement.address"):
              obj["address"] = outdata[i][key];
              break;
            case that.$t("companymanagement.Setlogo"):
              obj["logoprio"] = outdata[i][key];
              break;
            case that.$t("usermanagement.Accessrights"):
              obj["accprio"] = outdata[i][key];
              break;
            case that.$t("myorderde.projectmanagement"):
              obj["maprio"] = outdata[i][key];
              break;
            case that.$t("project.Standard"):
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
          message: that.$t("companymanagement.selectCustomer"),
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
          msg: that.$t("companymanagement.address"),
          value: "address",
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
          msg: that.$t("myorderde.projectmanagement"),
          value: "maprio",
        },
        {
          msg: that.$t("project.Standard"),
          value: "schemes",
        },
        {
          msg: that.$t("companymanagement.superid"),
          value: "superid",
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
        "address",
        "logoprio",
        "accprio",
        "maprio",
        "schemes",
        "superid",
        "createtime",
        "record",
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
        export_json_to_excel(tHeader, data, that.$t("list.Purchasingcustomer"));
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
          msg: that.$t("companymanagement.address"),
          value: "address",
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
          msg: that.$t("myorderde.projectmanagement"),
          value: "maprio",
        },
        {
          msg: that.$t("project.Standard"),
          value: "schemes",
        },
        {
          msg: that.$t("companymanagement.superid"),
          value: "superid",
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
          msg: that.$t("companymanagement.memo"),
          value: "memo",
        },
      ];
      let data = {
        username: "",
        country: "",
        tenantid: "",
        page: "",
        count: "",
        superid: this.$store.state.userInfo.tenantid,
        beginlevel: 2,
        endlevel: 4,
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
            message: that.$t("usermanagement.searchsuccess"),
            type: "success",
          });
        }
        this.searchList.count = 20;
      });
    },

    //重置搜索输入
    clearBtn() {
      this.searchList = {
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        beginlevel: 2,
        endlevel: 4,
        page: 1,
        count: 20,
      };
      this.currentPage1 = 1;
      this.getCustomerLists();
    },

    //添加用户
    addUsers() {
      this.addData = {
        username: "",
        tel: "",
        email: "",
        address: "",
        tenantid: "",
        memo: "",
        record: "",
        superid: "",
        level: 3,
        logoprio: "",
        maprio: "",
        devnum: "",
      };
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

      this.$refs[formName].validate((valid) => {
        if (valid) {
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
                message: that.$t("usermanagement.addsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs[formName].resetFields();
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

    //修改用户信息
    userEdit(index) {
      this.editData.username = this.tableData[index].username;
      this.editData.tel = this.tableData[index].tel;
      this.editData.email = this.tableData[index].email;
      this.editData.address = this.tableData[index].address;
      this.editData.memo = this.tableData[index].memo;
      this.editData.record = this.tableData[index].record;
      this.editData.nsid = this.tableData[index].nsid;
      this.editData.organizationID = this.tableData[index].organizationID;
      this.editData.tenantid = this.tableData[index].tenantid;
      this.editData.logoprio = this.tableData[index].logoprio;
      this.editData.accprio = this.tableData[index].accprio;
      this.editData.maprio = this.tableData[index].maprio;
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
          this.loading = true;
          updateCustomer(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.edit = false;
              that.getCustomerLists();
              that.getCustomerNames();
              that.$message({
                message: that.$t("usermanagement.editsuccess"),
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
    //点击删除
    userDele(index) {
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
      //删除用户信息
      this.deleUser = this.tableData[index].username;
      this.deleTenantid = this.tableData[index].tenantid;
      this.deleTpl = true;
    },
    deleTrue() {
      var that = this;

      this.$prompt(
        this.$t("usermanagement.passwordrules"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
          inputType: "password",
          beforeClose: function (action, instance, done) {
            if (action == "confirm") {
              let value = instance.inputValue;
              if (!value) {
                that.$message({
                  message: this.$t("usermanagement.passwordrules"),
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
            that.deleTpl = false;
            that.getCustomerLists();
            that.getCustomerNames();
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
    //获取Tenantid，做下拉框
    getCustomerNames() {
      let data = {
        superid: this.$store.state.userInfo.tenantid,
        beginlevel: 2,
        endlevel: 4,
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
        break;
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
