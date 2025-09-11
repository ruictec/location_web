<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>

    <div class="content">
      <el-container class="asi">
        <el-aside><Data /></el-aside>
        <el-main>
          <div class="ter_input">
            <el-form
              class="demo-form-inline"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item
                :label="$t('test.deveui1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 2%;
                  margin-right: 0;
                "
              >
                <el-input
                  style="width: 95%; float: left"
                  v-model="searchList.deveui"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('test.msgtype1')"
                style="
                  display: flex;
                  width: 15%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-select
                  style="width: 95%; float: left"
                  v-model="searchList.msgtype"
                  clearable
                  filterable
                  :placeholder="$t('terminal.choose')"
                >
                  <el-option
                    v-for="item in msgtypeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('test.chosetime')"
                style="
                  display: flex;
                  width: 27%;
                  margin-left: 1%;
                  margin-right: 0;
                "
              >
                <el-date-picker
                  style="width: 95%; float: left"
                  v-model="tasktime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('test.to')"
                  :start-placeholder="$t('test.startdate')"
                  :end-placeholder="$t('test.enddate')"
                  align="right"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item style="margin-left: 0">
                <el-button
                  type="primary"
                  class="search"
                  @click="searchInfo()"
                  >{{ $t("test.search") }}</el-button
                >
                <el-button
                  type="primary"
                  class="search"
                  @click="searchPrevious()"
                  >{{ $t("test.previous") }}</el-button
                >
                <el-button
                  type="primary"
                  class="search"
                  @click="searchNext()"
                  >{{ $t("test.next") }}</el-button
                >
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("test.reset")
                }}</el-button
                ><el-button
                  type="primary"
                  class="reset"
                  @click="startRefresh()"
                  v-if="start"
                  >{{ $t("test.start") }}</el-button
                >
                <el-button
                  type="primary"
                  class="reset"
                  @click="stopRefresh()"
                  v-if="stop"
                  >{{ $t("test.stop") }}</el-button
                >

                <el-button
                  type="primary"
                  class="reset"
                  @click="delTestList()"
                  >{{ $t("test.Batchdelete") }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 97%; text-align: center; margin-left: 2%"
              max-height="660"
              border
              @selection-change="handleSelectionChange"
              highlight-current-row
            >
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column
                property="deveui"
                :label="$t('test.deveui')"
                show-overflow-tooltip
                min-width="90"
                header-align="center"
              >
              </el-table-column>
              <el-table-column
                property="freq"
                :label="$t('test.Frequency')"
                show-overflow-tooltip
                min-width="55"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("test.Frequency")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("test.tet") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                property="dr"
                label="DR"
                min-width="50"
                align="center"
                show-overflow-tooltip
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">DR</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("test.tet1") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="gwrssi"
                label="RSSI"
                show-overflow-tooltip
                min-width="55"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">RSSI</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("test.gwrssi") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="gwsnr"
                label="SNR"
                show-overflow-tooltip
                min-width="55"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">SNR</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("test.gwsnr") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="gwno"
                :label="$t('test.gwno')"
                show-overflow-tooltip
                min-width="55"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("test.gwno")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("test.tet2") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                property="framecount"
                :label="$t('test.framecount')"
                show-overflow-tooltip
                min-width="50"
                header-align="center"
              >
              </el-table-column>

              <el-table-column
                property="msgtype"
                :label="$t('test.msgtype')"
                show-overflow-tooltip
                min-width="40"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="payload"
                label="Payload"
                show-overflow-tooltip
                min-width="200"
                header-align="center"
              >
              </el-table-column>
              <el-table-column
                property="reboot"
                :label="$t('test.reboot')"
                show-overflow-tooltip
                min-width="70"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("test.reboot")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>{{ $t("test.tet3") }}</p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="pktlost"
                :label="$t('test.pktlost')"
                show-overflow-tooltip
                min-width="70"
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("test.pktlost")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("test.tet4") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="ratelost"
                :label="$t('test.ratelost')"
                show-overflow-tooltip
                min-width="50"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="time"
                :label="$t('test.time')"
                show-overflow-tooltip
                :formatter="formatDate"
                min-width="100"
                header-align="center"
              ></el-table-column>

              <el-table-column
                :label="$t('test.contron')"
                fixed="right"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('warning.delete')"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      class="dels"
                      @click="delTer(scope.$index)"
                      ><img src="../../../static/delete.png"
                    /></el-button>
                  </el-tooltip>
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
          <!-- 批量删除 -->
          <el-dialog :title="$t('test.tet5')" :visible.sync="del">
            <el-table
              :data="deleteData"
              style="width: 100%; text-align: left"
              max-height="660"
              stripe
            >
              <el-table-column
                property="deveui"
                :label="$t('test.deveui')"
                show-overflow-tooltip
                min-width="140"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="freq"
                :label="$t('test.freq')"
                show-overflow-tooltip
                min-width="65"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="dr"
                label="DR"
                min-width="50"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="gwrssi"
                :label="$t('test.gwrssi')"
                show-overflow-tooltip
                min-width="90"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="gwsnr"
                :label="$t('test.gwsnr')"
                show-overflow-tooltip
                min-width="90"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="gwno"
                :label="$t('test.gwno1')"
                show-overflow-tooltip
                min-width="55"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="framecount"
                :label="$t('test.framecount')"
                show-overflow-tooltip
                min-width="55"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="msgtype"
                :label="$t('test.Messagetype')"
                show-overflow-tooltip
                min-width="77"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="payload"
                label="Payload"
                show-overflow-tooltip
                min-width="100"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="reboot"
                :label="$t('test.Restarttimes')"
                show-overflow-tooltip
                min-width="70"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="pktlost"
                :label="$t('test.Packetlossquantity')"
                show-overflow-tooltip
                min-width="65"
                align="center"
              >
              </el-table-column>
              <el-table-column
                property="ratelost"
                :label="$t('test.ratelost')"
                show-overflow-tooltip
                min-width="75"
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="time"
                :label="$t('test.time')"
                show-overflow-tooltip
                :formatter="formatDate"
                width="160"
                align="center"
              ></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="(del = false), (loading = false)">{{
                $t("terminal.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="deleteTrue"
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
import Data from "../../components/data/data";
import { getTrackerTestList, delTrackerTest } from "../../axios/api";
export default {
  components: {
    Menu,
    Data,
  },
  name: "Test",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      delprio: this.$store.state.userInfo.delprio,
      start: false,
      stop: true,
      timer: null,
      tableData: [],
      tenantidData: [],
      pageCount: 20,
      currentPage1: 1,
      total: 0,
      tasktime: [],
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
      searchList: {
        tenantid: this.$store.state.userInfo.tenantid,
        deveui: "",
        msgtype: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: 20,
      },

      multipleSelection: [],
      del: false,
      loading: false,
      deleteData: [],
      msgtypeList: [
        {
          index: 1,
          value: "HB",
        },
        {
          index: 2,
          value: "Ack",
        },

        {
          index: 13,
          value: "AOA",
        },
        {
          index: 3,
          value: "BLE",
        },
        {
          index: 4,
          value: "GPS",
        },
        {
          index: 5,
          value: "Alarm",
        },
        {
          index: 6,
          value: "Filter",
        },
        {
          index: 7,
          value: "PosUUID",
        },
        {
          index: 8,
          value: "AssetUUID",
        },

        {
          index: 14,
          value: "BLE Sensor",
        },

        {
          index: 9,
          value: "Filter Data",
        },

        {
          index: 10,
          value: "Beacon Config",
        },

        {
          index: 11,
          value: "History Beacon",
        },

        {
          index: 12,
          value: "History GNSS",
        },
      ],
    };
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getTrackerTestLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getTrackerTestLists();
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
    formatDate(row, colum) {
      if (row.time == null || row.time == 0) {
        return "";
      }
      let date = new Date(parseInt(row.time) * 1000);
      let date2 = date.toUTCString();
      return this.datetimecut(date2);
    },

    // 获取测试数据
    getTrackerTestLists() {
      var that = this;
      getTrackerTestList(
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

    // 搜索
    searchInfo() {
      var that = this;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      if (this.tasktime && this.tasktime.length > 0) {
        this.searchList.begintime =
          Date.parse(new Date(that.tasktime[0])) / 1000;
        this.searchList.endtime = Date.parse(new Date(that.tasktime[1])) / 1000;
      } else {
        this.searchList.begintime = "";
        this.searchList.endtime = "";
      }
      getTrackerTestList(
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
              message: that.$t("test.searchsuccess"),
              type: "success",
            });
          } else {
            that.$message({
              message: that.$t("test.nodata"),
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
    searchPrevious() {
      if (this.searchList.deveui) {
        let firstNum, lastNum, deveui;
        if (this.searchList.deveui.length > 8) {
          let start = this.searchList.deveui.length - 8;
          lastNum = this.searchList.deveui.substring(start);
          firstNum = this.searchList.deveui.substring(0, start);
          deveui = parseInt(lastNum, 16) - 1;
          lastNum = deveui.toString(16);
          lastNum = lastNum.padStart(8, "0");
          this.searchList.deveui = firstNum + lastNum;
        } else {
          deveui = parseInt(this.searchList.deveui, 16) - 1;
          this.searchList.deveui = deveui.toString(16);
        }
        this.searchInfo();
      } else {
        this.$message({
          message: this.$t("test.tet6"),
          type: "warning",
        });
        return;
      }
    },
    searchNext() {
      if (this.searchList.deveui) {
        let firstNum, lastNum, deveui;
        if (this.searchList.deveui.length > 8) {
          let start = this.searchList.deveui.length - 8;
          lastNum = this.searchList.deveui.substring(start);
          firstNum = this.searchList.deveui.substring(0, start);
          deveui = parseInt(lastNum, 16) + 1;
          lastNum = deveui.toString(16);
          lastNum = lastNum.padStart(8, "0");
          this.searchList.deveui = firstNum + lastNum;
        } else {
          deveui = parseInt(this.searchList.deveui, 16) + 1;
          this.searchList.deveui = deveui.toString(16);
        }
        this.searchInfo();
      } else {
        this.$message({
          message: this.$t("test.tet6"),
          type: "warning",
        });
        return;
      }
    },
    // 刷新
    clearBtn() {
      this.tasktime = [];
      this.searchList = {
        tenantid: this.$store.state.userInfo.tenantid,
        deveui: "",
        msgtype: "",
        begintime: "",
        endtime: "",
        page: 1,
        count: this.pageCount,
      };
      this.currentPage1 = 1;
      this.getTrackerTestLists();
    },

    //删除
    delTer(index) {
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
      if (this.contrForPrionum == 4 && this.delprio == 2) {
        this.$message({
          message: this.$t("usermanagement.noprio"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("gateway.deletemsg") +
          this.tableData[index].deveui +
          this.$t("test.confirmdel3"),
        this.$t("Building.tips"),
        {
          confirmButtonText: this.$t("terminal.confirm"),
          cancelButtonText: this.$t("terminal.cancel"),
          type: "warning",
        }
      ).then(() => {
        let data = {
          tenantid: this.$store.state.userInfo.tenantid,
          ids: [this.tableData[index].id],
        };
        data.ids = JSON.stringify(data.ids);
        delTrackerTest(
          data,
          that.tenantkey_A,
          that.tenantid_A,
          that.userName
        ).then((res) => {
          if (res.code == 1001) {
            that.searchList.page = 1;
            that.currentPage1 = 1;
            that.getTrackerTestLists();
            that.$message({
              message: that.$t("test.delsuccess"),
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
    // 表格多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    delTestList() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: this.$t("downlink.deletedownlink1"),
          type: "warning",
        });
        return;
      }

      this.deleteData = this.multipleSelection;
      this.del = true;
    },

    //开始刷新
    startRefresh() {
      this.start = false;
      this.stop = true;
      this.timer = setInterval(() => {
        this.getTrackerTestLists();
      }, 10000);
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
        tenantid: this.$store.state.userInfo.tenantid,
        ids: [],
      };

      for (let i = 0; i < this.deleteData.length; i++) {
        data.ids.push(this.deleteData[i].id);
      }
      data.ids = JSON.stringify(data.ids);
      this.loading = true;
      delTrackerTest(
        data,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          this.del = false;
          that.searchList.page = 1;
          that.currentPage1 = 1;
          that.getTrackerTestLists();
          that.$message({
            message: that.$t("test.delsuccess"),
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

    //暂停刷新
    stopRefresh() {
      this.start = true;
      this.stop = false;
      clearInterval(this.timer);
    },
  },
  beforeMount() {
    this.getTrackerTestLists();
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getTrackerTestLists();
    }, 10000);
  },
  destroyed() {
    clearInterval(this.timer);
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
.dels {
  padding: 2px 16px !important;
}
/* 改变按钮颜色 */
.dels:hover {
  background-color: rgb(196, 27, 27);
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
.search,
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
.el-form-item .el-button {
  margin-left: 4px !important;
}
</style>
