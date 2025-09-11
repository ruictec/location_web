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
            <el-form class="demo-form-inline" :model="searchList">
              <el-form-item
                :label="$t('usermanagement.company')"
                style="
                  display: flex;
                  margin-left: 2%;
                  float: left;
                  white-space: nowrap;
                "
                v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
              >
                <el-select
                  v-model="searchList.tenantid"
                  clearable
                  filterable
                  @change="selectUserCustomerList"
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
                :label="$t('usermanagement.company')"
                style="
                  display: flex;
                  margin-left: 2%;
                  float: left;
                  white-space: nowrap;
                "
                v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
              >
                <el-select
                  v-model="searchList.tenantid"
                  clearable
                  filterable
                  @change="selectUserCustomerList"
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
                :label="$t('usermanagement.user')"
                style="
                  display: flex;
                  margin-left: 2%;
                  float: left;
                  white-space: nowrap;
                "
                v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
              >
                <el-select
                  v-model="searchList.username"
                  clearable
                  filterable
                  :placeholder="$t('terminal.tit27')"
                >
                  <el-option
                    v-for="item in searchSelectPerson"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$t('usermanagement.country')"
                style="
                  display: flex;
                  margin-left: 2%;
                  float: left;
                  white-space: nowrap;
                "
                v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
              >
                <el-select
                  v-model="searchList.country"
                  clearable
                  filterable
                  :placeholder="$t('terminal.tit27')"
                >
                  <el-option
                    v-for="item in searchSelectCountry"
                    :key="item.country"
                    :label="item.country"
                    :value="item.country"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item style="margin-left: 2%; float: left">
                <el-button
                  type="primary"
                  class="query"
                  @click="searchInfo()"
                  v-if="
                    contrForPrioNum == 1 ||
                    contrForPrioNum == 2 ||
                    contrForPrioNum == 3 ||
                    contrForPrioNum == 4
                  "
                  >{{ $t("usermanagement.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="clearBtn()"
                  v-if="
                    contrForPrioNum == 1 ||
                    contrForPrioNum == 2 ||
                    contrForPrioNum == 3 ||
                    contrForPrioNum == 4
                  "
                  >{{ $t("usermanagement.reset") }}</el-button
                >
                <el-button
                  type="primary"
                  class="add"
                  @click="addUsers()"
                  v-if="contrForPrioNum == 1"
                  >{{ $t("usermanagement.Addsubadministrator") }}</el-button
                >
                <el-popover v-if="contrForPrioNum == 3">
                  <div style="display: flex">
                    <el-button size="mini" type="primary" @click="addUser()">{{
                      $t("usermanagement.addUser")
                    }}</el-button>
                    <el-button type="primary" size="mini" @click="addUsers()">{{
                      $t("usermanagement.Addsubadministrator")
                    }}</el-button>
                  </div>
                  <el-button type="primary" class="del move" slot="reference">{{
                    $t("usermanagement.add")
                  }}</el-button>
                </el-popover>
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
                  v-if="
                    contrForPrioNum != 2 &&
                    contrForPrioNum != 6 &&
                    contrForPrioNum != 4
                  "
                >
                  <div slot="content">
                    <p>
                      {{ $t("usermanagement.tlt") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-form>
          </div>
          <div class="content_user">
            <!-- 人员展示 -->
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 98%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              highlight-current-row
            >
              <el-table-column
                property="realname"
                :label="$t('usermanagement.Realname')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrioNum == 5"
              ></el-table-column>
              <el-table-column
                property="username"
                :label="$t('usermanagement.username')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>

              <el-table-column
                property="customername"
                :label="$t('usermanagement.customername')"
                show-overflow-tooltip
                align="center"
                v-if="
                  contrForPrioNum == 1 ||
                  contrForPrioNum == 2 ||
                  contrForPrioNum == 3 ||
                  contrForPrioNum == 4
                "
              ></el-table-column>
              <el-table-column
                property="usertel"
                :label="$t('usermanagement.usertel')"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.usertel }}
                </template>
              </el-table-column>
              <el-table-column
                property="usermail"
                :label="$t('usermanagement.usermail')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'prio' : 'enprio'"
                :label="$t('usermanagement.prio')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>

              <el-table-column
                property="delpriostr"
                :label="$t('usermanagement.unprio1')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrioNum == 3"
              ></el-table-column>

              <el-table-column
                property="accpriostr"
                :label="$t('usermanagement.Accessrights')"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                property="country"
                :label="$t('usermanagement.country1')"
                show-overflow-tooltip
                align="center"
                v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
              ></el-table-column>
              <el-table-column
                property="ctime"
                :label="$t('usermanagement.ctime')"
                show-overflow-tooltip
                align="center"
                :formatter="formatDate"
              ></el-table-column>
              <el-table-column
                :label="$t('usermanagement.operate')"
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
                          >{{ $t("usermanagement.edit") }}</el-button
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
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                        ><el-button
                          size="mini"
                          @click="handleLogin(scope.$index, tableData)"
                          class="edits"
                          >{{ $t("usermanagement.Login") }}</el-button
                        ></el-dropdown-item
                      >
                      <el-dropdown-item
                        style="
                          margin-top: 4%;
                          background-color: rgb(219, 222, 231);
                        "
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="$t('usermanagement.repwd')"
                          placement="top"
                        >
                          <el-button
                            size="mini"
                            class="dels"
                            @click="resetUserkeys(scope.$index)"
                            >{{ $t("usermanagement.repassword") }}</el-button
                          >
                        </el-tooltip>
                      </el-dropdown-item>
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
          <!-- 添加子管理员模态框    -->
          <el-dialog
            :title="$t('usermanagement.adduser')"
            width="30%"
            :visible.sync="add"
            style="text-align: center"
            @close="addCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="140px"
              :rules="addRules"
              ref="addData"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('usermanagement.Realname1')"
                prop="realname"
                v-if="contrForPrioNum == 5"
              >
                <el-input
                  v-model="addData.realname"
                  :placeholder="$t('usermanagement.Realname2')"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usermanagement.user')" prop="username">
                <el-input
                  v-model="addData.username"
                  :placeholder="$t('usermanagement.adduserrule')"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.password')"
                prop="userkey"
              >
                <el-input
                  v-model="addData.userkey"
                  :placeholder="$t('usermanagement.passwordrules')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.usertel1')"
                :prop="i8n == 'zh' ? 'usertel' : ''"
              >
                <el-input
                  v-model.number="addData.usertel"
                  type="tel"
                  :placeholder="$t('usermanagement.usertelrules')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.usermail1')"
                prop="usermail"
              >
                <el-input
                  v-model="addData.usermail"
                  :placeholder="$t('usermanagement.usermailrules')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usermanagement.prio1')" prop="">
                <el-select
                  v-model="addData.accprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.prio11')"
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
                      {{ $t("usermanagement.prio12") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.Logopermission')"
                prop=""
                v-if="
                  (contrForPrioNum == 1 || contrForPrioNum == 2) &&
                  logoprio == 1
                "
              >
                <el-select
                  v-model="addData.logoprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.Logopermission1')"
                >
                  <el-option
                    v-for="item in logoprioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.unprio')"
                prop=""
                v-if="contrForPrioNum == 3 && addData.prio == 4"
              >
                <el-select
                  v-model="addData.delprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.priorules')"
                  :disabled="addData.prio == 4 ? false : true"
                >
                  <el-option
                    v-for="item in delprioList"
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
                      {{ $t("usermanagement.prio13") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
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
              >
                {{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 企业管理员添加用户    -->
          <el-dialog
            :title="$t('usermanagement.adduser')"
            width="30%"
            :visible.sync="add_User"
            style="text-align: center"
            @close="addUserCancel('addData')"
          >
            <el-form
              :model="addData"
              label-width="140px"
              :rules="addRules"
              ref="addData"
              style="text-align: left"
            >
              <el-form-item :label="$t('usermanagement.user')" prop="username">
                <el-input
                  v-model="addData.username"
                  :placeholder="$t('usermanagement.adduserrule')"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.password')"
                prop="userkey"
              >
                <el-input
                  v-model="addData.userkey"
                  :placeholder="$t('usermanagement.passwordrules')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.usertel1')"
                :prop="i8n == 'zh' ? 'usertel' : ''"
              >
                <el-input
                  v-model.number="addData.usertel"
                  type="tel"
                  :placeholder="$t('usermanagement.usertelrules')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.usermail1')"
                prop="usermail"
              >
                <el-input
                  v-model="addData.usermail"
                  :placeholder="$t('usermanagement.usermailrules')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.company')"
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
              <el-form-item :label="$t('usermanagement.prio1')" prop="">
                <el-select
                  v-model="addData.accprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.prio11')"
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
                      {{ $t("usermanagement.prio12") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('usermanagement.unprio')" prop="">
                <el-select
                  v-model="addData.delprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.priorules')"
                >
                  <el-option
                    v-for="item in delprioList"
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
                      {{ $t("usermanagement.prio13") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addUserCancel('addData')">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="addUserTrue('addData')"
                :loading="loading"
              >
                {{ $t("terminal.confirm") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 编辑模态框 -->
          <el-dialog
            :title="$t('usermanagement.edituser')"
            :visible.sync="edit"
            class="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel('editData')"
          >
            <el-form
              :model="editData"
              ref="editData"
              :rules="addRules"
              label-width="140px"
              style="text-align: left"
            >
              <el-form-item
                :label="$t('usermanagement.Realname1')"
                prop="realname"
                v-if="contrForPrioNum == 5"
              >
                <el-input
                  v-model="editData.realname"
                  :placeholder="$t('usermanagement.Realname2')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usermanagement.user')" prop="username">
                <el-input
                  disabled
                  v-model="editData.username"
                  :placeholder="$t('usermanagement.adduserrule')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.company')"
                prop="username"
              >
                <el-input
                  disabled
                  v-model="editData.customername"
                  :placeholder="$t('usermanagement.companyrules')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.usertel1')"
                :prop="i8n == 'zh' ? 'usertel' : ''"
              >
                <el-input
                  v-model="editData.usertel"
                  :placeholder="$t('usermanagement.usertelrules')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.usermail1')"
                prop="usermail"
              >
                <el-input
                  v-model="editData.usermail"
                  :placeholder="$t('usermanagement.usermailrules')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usermanagement.prio1')" prop="">
                <el-select
                  v-model="editData.accprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.prio11')"
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
                      {{ $t("usermanagement.prio12") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item
                :label="$t('usermanagement.Logopermission')"
                prop=""
                v-if="
                  (contrForPrioNum == 1 ||
                    contrForPrioNum == 2 ||
                    contrForPrioNum == 3 ||
                    contrForPrioNum == 4) &&
                  clogoprio == 1
                "
              >
                <el-select
                  v-model="editData.logoprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.Logopermission1')"
                >
                  <el-option
                    v-for="item in logoprioList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('usermanagement.unprio')"
                prop="delprio"
                v-if="
                  contrForPrioNum == 3 &&
                  (editData.prio == 4 ||
                    editData.prio == '企业子管理员' ||
                    editData.prio == 5 ||
                    editData.prio == '企业用户')
                "
              >
                <el-select
                  v-model="editData.delprio"
                  clearable
                  filterable
                  :placeholder="$t('usermanagement.priorules')"
                >
                  <el-option
                    v-for="item in delprioList"
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
                      {{ $t("usermanagement.prio13") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel('editData')">
                {{ $t("terminal.cancel") }}</el-button
              >
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
            :title="$t('usermanagement.deleteuser')"
            :visible.sync="deleTpl"
            style="text-align: center"
            width="30%"
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
                {{ $t("usermanagement.deleterules") }}
                {{ deleUser }} ?
              </p>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(deleTpl = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button type="primary" @click="deleTrue" :loading="loading">{{
                $t("terminal.confirm")
              }}</el-button>
            </div>
          </el-dialog>

          <!-- 重置密码 -->
          <el-dialog
            :title="$t('usermanagement.repwd')"
            width="30%"
            style="text-align: center"
            :visible.sync="passwordTpl"
            class="passward"
          >
            <el-form
              :model="passwordData"
              ref="passwordData"
              :rules="addRules"
              class="demo-ruleForm"
              label-width="150px"
              style="text-align: left; margin-left: 10px"
            >
              <el-form-item :label="$t('usermanagement.adminpwd')">
                <el-input
                  show-password
                  v-model="passwordData.managerkey"
                  :placeholder="$t('usermanagement.adminpwdrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usermanagement.newpwd')">
                <el-input
                  show-password
                  v-model="passwordData.passwordNew"
                  :placeholder="$t('usermanagement.newpwdrule')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('usermanagement.newpwdrule1')">
                <el-input
                  show-password
                  v-model="passwordData.passwordAgain"
                  :placeholder="$t('usermanagement.newpwdrule2')"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(passwordTpl = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="passwordTrue()"
                :loading="loading"
                >{{ $t("terminal.confirm") }}</el-button
              >
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
  getCustomerName,
  getUserCustomerList,
  insertUser,
  updateUser,
  delUserByUsername,
  resetUserkey,
  getUsernameByTenantid,
  superLogin,
} from "../../axios/api";
export default {
  components: {
    Menu,
    basecard,
    Usermanagement,
  },
  name: "UserManagement",
  data() {
    //手机号码正则
    var isMobileNumber = (rule, value, callback) => {
      if (!value) {
        return new Error(this.$t("companymanagement.clienttelrule2"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const isPhone = reg.test(value);
        value = Number(value); //转换为数字
        if (typeof value === "number" && !isNaN(value)) {
          //判断是否为数字
          value = value.toString(); //转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) {
            //判断是否为11位手机号
            callback(new Error(this.$t("companymanagement.clienttelrule3")));
          } else {
            callback();
          }
        } else {
          callback(new Error(this.$t("companymanagement.clienttelrule2")));
        }
      }
    };
    //邮箱正则
    var isEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
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
      contrForPrioNum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      country: this.$store.state.userInfo.country,
      delprio: this.$store.state.userInfo.delprio,
      clogoprio: this.$store.state.userInfo.clogoprio, //用来判断企业有没有设置logo的权限
      logoprio: this.$store.state.userInfo.logoprio, //用来判断用户有没有设置logo的权限
      loading: false,
      tableData: [],
      tenantidData: [],
      searchList: {
        prionum: "",
        endprio: "",
        prio: "",
        username: "",
        country: "",
        tenantid: "",
        superid: "",
        page: 1,
        count: 20,
      },

      pageCount: 20,
      searchSelectCountry: [],
      searchSelectPerson: [],
      projectList: [],
      currentPage1: 1,
      total: 0,
      addData: {
        username: "",
        userkey: "",
        usertel: "",
        usermail: "",
        prio: "",
        country: "",
        tenantid: "",
        customername: "",
        delprio: "",
        record: "",
        cusname: "",
        accprio: "",
        logoprio: "",
      },
      //访问权限
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
      //设置Logo权限
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
      add: false,
      add_User: false,
      //添加模态框
      addRules: {
        realname: [
          {
            required: true,
            message: this.$t("usermanagement.Realname2"),
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: this.$t("usermanagement.adduserrule"),
            trigger: "blur",
          },
          {
            pattern: /^\w+$/,
            message: this.$t("usermanagement.adduserrule1"),
          },
        ],
        usertel: [
          {
            required: false,
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: this.$t("companymanagement.clienttelrule3"),
            trigger: "blur",
          },
        ],
        userkey: [
          {
            required: true,
            message: this.$t("usermanagement.passwordrules"),
            trigger: "blur",
          },
          // {
          //   pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
          //   message: "密码至少包含 数字和英文，长度8-20",
          // },
        ],
        usermail: [
          {
            required: true,
            message: this.$t("usermanagement.usermailrules"),
            trigger: "blur",
          },
          { validator: isEmail, trigger: "blur" },
        ],
        prio: [
          {
            required: true,
            message: this.$t("usermanagement.priorules"),
            trigger: "change",
          },
        ],
        delprio: [
          {
            required: true,
            message: this.$t("usermanagement.priorules"),
            trigger: "change",
          },
        ],
        projectid: [
          {
            required: true,
            message: this.$t("usermanagement.projectid"),
            trigger: "change",
          },
        ],
        tenantid: [
          {
            required: true,
            message: this.$t("usermanagement.tenantid"),
            trigger: "change",
          },
        ],
      },
      prioList: [],
      delprioList: [
        {
          index: 1,
          value: "Yes",
        },
        {
          index: 2,
          value: "No",
        },
      ],
      editData: {
        username: "",
        usertel: "",
        usermail: "",
        prio: "",
        country: "",
        tenantid: "",
        customername: "",
        delprio: "",
        logintime: "",
        projectid: "",
        record: "",
        cusname: "",
        accprio: "",
        logoprio: "",
        realname: "",
      },
      editBtnDis: false,
      deleBtnDis: false,
      edit: false,
      deleUser: "",
      deleTpl: false,
      resetKeysUser: "",
      passwordTpl: false,
      passwordData: {
        managerkey: "",
        passwordNew: "",
        passwordAgain: "",
      },
    };
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getUserCustomerLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getUserCustomerLists();
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
      if (row.regtime == null) {
        return "";
      }
      let date = new Date(parseInt(row.regtime) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    //获取用户信息
    getUserCustomerLists() {
      var that = this;
      getUserCustomerList(
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

    //获取所有用户，制作下拉框
    selectUserCustomerList(event) {
      var that = this;
      let data = "";
      this.searchSelectPerson = [];
      if (
        this.$store.state.userInfo.prionum == "1" ||
        this.$store.state.userInfo.prionum == "2"
      ) {
        data = {
          prionum: this.$store.state.userInfo.prionum,
          tenantid: event,
        };
      } else {
        data = {
          prionum: this.$store.state.userInfo.prionum,
          tenantid: this.$store.state.userInfo.tenantid,
        };
      }

      getUsernameByTenantid(
        data,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.searchSelectPerson = res.data;
        }
      });
    },

    //查询用户信息
    searchInfo() {
      this.searchList.page = 1;
      this.currentPage1 = 1;
      var that = this;
      getUserCustomerList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.total = res.data.size;
          that.$message({
            message: this.$t("usermanagement.searchsuccess"),
            type: "success",
          });
        }
      });
    },

    //重置搜索输入
    clearBtn() {
      if (
        this.$store.state.userInfo.prionum == "1" ||
        this.$store.state.userInfo.prionum == "2"
      ) {
        this.searchList = {
          prionum: this.$store.state.userInfo.prionum,
          endprio: 5,
          prio: "",
          username: "",
          country: "",
          tenantid: "",
          superid: "",
          page: 1,
          count: 20,
        };
      } else if (this.$store.state.userInfo.prionum == "3") {
        this.searchList = {
          prionum: 3,
          endprio: 6,
          prio: "",
          username: "",
          country: "",
          tenantid: "",
          superid: this.$store.state.userInfo.tenantid,
          page: 1,
          count: 20,
        };
      } else if (this.$store.state.userInfo.prionum == "4") {
        this.searchList = {
          prionum: 4,
          endprio: 6,
          prio: "",
          username: "",
          country: "",
          tenantid: "",
          superid: this.$store.state.userInfo.tenantid,
          page: 1,
          count: 20,
        };
      } else if (this.$store.state.userInfo.prionum == "5") {
        this.searchList = {
          prionum: "",
          endprio: "",
          prio: 6,
          username: "",
          country: "",
          tenantid: this.$store.state.userInfo.tenantid,
          superid: "",
          page: 1,
          count: 20,
        };
      }

      this.currentPage1 = 1;
      this.getUserCustomerLists();
    },

    //添加子管理员
    addUsers() {
      switch (this.contrForPrioNum) {
        case 1:
          this.addData = {
            username: "",
            userkey: "",
            usertel: "",
            usermail: "",
            prio: "2",
            country: "",
            tenantid: "",
            customername: "",
            delprio: "",
            record: "",
            cusname: "",
            accprio: "",
            logoprio: "",
          };
          break;
        case 3:
          this.addData = {
            username: "",
            userkey: "",
            usertel: "",
            usermail: "",
            prio: "4",
            country: "",
            tenantid: "",
            customername: "",
            delprio: "",
            record: "",
            cusname: "",
            accprio: "",
            logoprio: "",
          };
          break;
        case 5:
          this.addData = {
            username: "",
            userkey: "",
            usertel: "",
            usermail: "",
            prio: 6,
            country: "",
            tenantid: "",
            customername: "",
            delprio: "",
            record: "",
            cusname: "",
            accprio: "",
            logoprio: "",
            realname: "",
          };
          break;
        default:
          break;
      }
      this.add = true;
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
          this.addData.tenantid = this.tenantid_A;
          this.addData.country = this.country;
          insertUser(
            this.addData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              this.add = false;
              this.searchList.page = 1;
              this.currentPage1 = 1;
              this.getUserCustomerLists();
              this.getCustomerNames();
              this.selectUserCustomerList();

              that.$message({
                message: that.$t("usermanagement.addsuccess"),
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

          that.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },

    // 添加用户
    addUser() {
      this.addData = {
        username: "",
        userkey: "",
        usertel: "",
        usermail: "",
        prio: 5,
        country: "",
        tenantid: "",
        customername: "",
        delprio: "",
        record: "",
        cusname: "",
        accprio: "",
        logoprio: "",
        realname: "",
      };
      this.getCustomerNames();
      this.add_User = true;
    },

    addUserCancel(addData) {
      this.add_User = false;
      this.loading = false;
      this.$refs[addData].resetFields();
    },
    addUserTrue(formName) {
      var that = this;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.addData.country = this.country;
          insertUser(
            this.addData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              this.add_User = false;
              this.searchList.page = 1;
              this.currentPage1 = 1;
              this.getUserCustomerLists();
              this.getCustomerNames();
              this.selectUserCustomerList();

              that.$message({
                message: that.$t("usermanagement.addsuccess"),
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

          that.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },

    //修改用户信息
    userEdit(index) {
      let that = this;
      if (this.contrForPrioNum == 1 && this.tableData[index].prionum != 2) {
        this.$message({
          message: that.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      } else if (this.contrForPrioNum == 2) {
        this.$message({
          message: that.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      }
      this.editData.username = this.tableData[index].username;
      this.editData.cusname = this.tableData[index].cusname;
      this.editData.record = this.tableData[index].record;
      this.editData.usertel = this.tableData[index].usertel;
      this.editData.usermail = this.tableData[index].usermail;
      this.editData.prio = this.tableData[index].prio;
      this.editData.country = this.tableData[index].country;
      this.editData.logintime = this.tableData[index].logintime;
      this.editData.delprio = this.tableData[index].delprio;
      this.editData.customername = this.tableData[index].customername;
      this.editData.projectid = this.tableData[index].projectid;
      this.editData.accprio = this.tableData[index].accprio;
      this.editData.logoprio = this.tableData[index].logoprio;
      this.editData.realname = this.tableData[index].realname;
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
          switch (that.editData.prio) {
            case "系统管理员":
              that.editData.prio = "1";
              break;
            case "系统子管理员":
              that.editData.prio = "2";
              break;
            case "企业管理员":
              that.editData.prio = "3";
              break;
            case "企业子管理员":
              that.editData.prio = "4";
              break;
            case "企业用户":
              that.editData.prio = "5";
              break;
            case "企业资产拥有者":
              that.editData.prio = "6";
              break;
            default:
              break;
          }
          this.loading = true;
          updateUser(
            this.editData,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              this.edit = false;
              this.getUserCustomerLists();
              this.getCustomerNames();
              this.selectUserCustomerList();
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

    //重置密码
    resetUserkeys(index) {
      var that = this;
      if (
        (this.contrForPrioNum == 1 &&
          this.tableData[index].prionum != 3 &&
          this.tableData[index].prionum != 2) ||
        (this.contrForPrioNum == 2 && this.tableData[index].prionum != 3)
      ) {
        that.$message({
          message: that.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      } else {
        this.resetKeysUser = this.tableData[index].username;
        this.passwordData = {
          managerkey: "",
          passwordNew: "",
          passwordAgain: "",
        };
        this.passwordTpl = true;
      }
    },
    passwordTrue() {
      var that = this;
      if (!that.passwordData.managerkey) {
        that.$message({
          message: that.$t("usermanagement.adminpwdrule"),
          type: "error",
        });
        return;
      }

      if (
        !that.passwordData.passwordNew ||
        !that.passwordData.passwordAgain ||
        that.passwordData.passwordNew != that.passwordData.passwordAgain
      ) {
        that.$message({
          message: that.$t("usermanagement.newpwdrule3"),
          type: "error",
        });
        return;
      }
      if (that.passwordData.passwordNew == that.passwordData.passwordOld) {
        that.$message({
          message: that.$t("usermanagement.newpwdrule4"),
          type: "error",
        });
        return;
      } else {
        let para = {
          username: that.resetKeysUser,
          newkey: that.passwordData.passwordNew,
          managerkey: that.passwordData.managerkey,
        };
        that.loading = true;
        resetUserkey(
          para,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.passwordTpl = false;
            that.getUserCustomerLists();
            that.getCustomerNames();
            that.selectUserCustomerList();
            that.$message({
              message: that.$t("usermanagement.resuccess"),
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
    },

    //点击删除
    userDele(index) {
      let that = this;
      if (
        (this.$store.state.userInfo.prionum == 5 &&
          this.$store.state.userInfo.delprio == 2) ||
        (this.$store.state.userInfo.prionum == 4 &&
          this.$store.state.userInfo.delprio == 2)
      ) {
        that.$message({
          message: that.$t("warning.permissiondelete"),
          type: "warning",
        });
        return;
      }
      // contrForPrioNum;
      if (this.contrForPrioNum == 1 && this.tableData[index].prionum != 2) {
        that.$message({
          message: that.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      } else if (this.contrForPrioNum == 2) {
        that.$message({
          message: that.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      } else if (
        this.contrForPrioNum == 4 &&
        this.tableData[index].delprio == 2
      ) {
        that.$message({
          message: that.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      }
      //删除用户信息
      this.deleUser = this.tableData[index].username;
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
          username: that.deleUser, //删除用户的用户名
          prioname: that.userName, //高权限用户名
          userkey: value, //高权限用户密码
        };
        that.loading = true;
        delUserByUsername(
          JSON.stringify(data),
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.deleTpl = false;
            that.getUserCustomerLists();
            that.getCustomerNames();
            that.selectUserCustomerList();
            that.$message({
              message: that.$t("usermanagement.deletesuccess"),
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

    //登录其他账号
    handleLogin(index) {
      var that = this;
      this.$confirm(
        that.$t("usermanagement.tt") +
          that.tableData[index].username +
          that.$t("usermanagement.ttt"),
        that.$t("terminal.tips"),

        {
          confirmButtonText: that.$t("terminal.confirm"),
          cancelButtonText: that.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          username: that.tableData[index].username,
          supername: that.$store.state.userInfo.username,
        };
        superLogin(data, that.tenantkey_A, that.tenantid_A, that.userName).then(
          (res) => {
            if (res.code == 1001) {
              if (res.data.prionum == 5) {
                if (res.data.num > 0) {
                  that.$message({
                    message: that.$t("usermanagement.tt2"),
                    type: "success",
                  });
                  sessionStorage.clear();
                  that.$store.commit("setuserInfo", res.data);
                  sessionStorage.setItem(
                    "state",
                    JSON.stringify(that.$store.state)
                  );
                  that.$store.state.addRoutes = [];
                  that.$store.commit("resetRoutes");
                  that.$router.push("/dashboard").catch(() => {});
                } else {
                  that.$message({
                    message: that.$t("usermanagement.loginTips"),
                    type: "warning",
                  });
                  return;
                }
              } else {
                that.$message({
                  message: that.$t("usermanagement.tt2"),
                  type: "success",
                });
                sessionStorage.clear();
                that.$store.commit("setuserInfo", res.data);
                sessionStorage.setItem(
                  "state",
                  JSON.stringify(that.$store.state)
                );
                that.$router.push("/dashboard").catch(() => {});
              }
              that.$store.state.show = true;
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

    //获取所有的Tenantid
    getCustomerNames() {
      let data = {
        beginlevel: 1,
        endlevel: 3,
      };
      if (this.contrForPrioNum == 3 || this.contrForPrioNum == 4) {
        data = {
          superid: this.$store.state.userInfo.tenantid,
          beginlevel: 2,
          endlevel: 4,
        };
      }
      this.tenantidData = [];
      this.searchSelectCountry = [];
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
    },
  },

  beforeMount() {
    var that = this;
    this.getCustomerNames();
    this.selectUserCustomerList();

    if (
      this.$store.state.userInfo.prionum == "1" ||
      this.$store.state.userInfo.prionum == "2"
    ) {
      this.searchList = {
        prionum: this.$store.state.userInfo.prionum,
        endprio: 5,
        prio: "",
        username: "",
        country: "",
        tenantid: "",
        superid: "",
        page: 1,
        count: 20,
      };
    } else if (this.$store.state.userInfo.prionum == "3") {
      this.searchList = {
        prionum: 3,
        endprio: 6,
        prio: "",
        username: "",
        country: "",
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        page: 1,
        count: 20,
      };
    } else if (this.$store.state.userInfo.prionum == "4") {
      this.searchList = {
        prionum: 4,
        endprio: 6,
        prio: "",
        username: "",
        country: "",
        tenantid: "",
        superid: this.$store.state.userInfo.tenantid,
        page: 1,
        count: 20,
      };
    } else if (this.$store.state.userInfo.prionum == "5") {
      this.searchList = {
        prionum: "",
        endprio: "",
        prio: 6,
        username: "",
        country: "",
        tenantid: this.$store.state.userInfo.tenantid,
        superid: "",
        page: 1,
        count: 20,
      };
    }
    this.getUserCustomerLists();
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
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
  width: 20% !important;
  margin-top: 50px;
  width: auto !important;
}

.content_user {
  margin-top: 20px;
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
  display: -webkit-box !important;
}
/* 表格中按钮大小 */
/* .el-button--mini, .el-button--mini.is-round {
  padding: 5px 8px !important;
} */
.el-message--error {
  display: -webkit-box !important;
}

.el-message--warning {
  display: -webkit-box !important;
}
.el-table >>> .el-table__row td {
  padding: 0px 0 !important;
}
.el-table >>> .el-table__row:hover td {
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
