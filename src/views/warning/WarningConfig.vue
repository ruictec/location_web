<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
      {{ $t("list.Alarmconfiguration") }}
    </div>
    <div class="content">
      <el-container>
        <el-main>
          <div class="warning_input">
            <el-form
              class="demo-form-inline"
              style="display: flex; white-space: nowrap"
            >
              <el-form-item style="margin-left: 2%">
                <el-button type="primary" class="reset" @click="clearBtn()">{{
                  $t("beacon.reset")
                }}</el-button>
                <el-button type="primary" class="reset" @click="addWarning()">{{
                  $t("warning.add")
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 展示 -->
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="
                width: 98%;
                text-align: center;
                margin-left: 2%;
                z-index: 1;
              "
              border
              highlight-current-row
            >
              <el-table-column
                property="id"
                :label="$t('warning.id')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                :property="i8n == 'zh' ? 'typestr' : 'entype'"
                :label="$t('warning.AlertType1')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>

              <el-table-column
                property="vtime"
                show-overflow-tooltip
                align="center"
                :formatter="formatVtime"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("warningVoice.warningTime2")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("warningVoice.warningTimeTip") }}<br />
                        {{ $t("warningVoice.warningTimeCycleTip") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                property="vcycle"
                show-overflow-tooltip
                align="center"
                :formatter="formatTime"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("warningVoice.warningCycle2")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("warningVoice.warningCycleTip") }}<br />
                        {{ $t("warningVoice.warningTimeCycleTip") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="pushstr"
                show-overflow-tooltip
                align="center"
              >
                <template slot="header" slot-scope="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("warningVoice.push1")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <div slot="content">
                      <p>
                        {{ $t("warningVoice.pushTip") }}
                      </p>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="memo"
                :label="$t('warning.Remark')"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('warning.operate')"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('territorymanagement.edit')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      class="editss"
                      @click="EditWarningCommand(scope.$index)"
                      ><img src="../../../static/edit2.png"
                    /></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('warning.delete')"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      size="mini"
                      class="edits"
                      @click="DelWarningCommand(scope.$index)"
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

          <!-- 添加告警设置 -->
          <el-dialog
            :title="$t('warning.title1')"
            :visible.sync="add"
            width="30%"
            style="text-align: center"
            @close="addCancel(addData)"
          >
            <el-form
              :model="addData"
              label-width="120px"
              :rules="addRules"
              ref="addData"
              style="text-align: left"
            >
              <el-form-item :label="$t('warning.type')" prop="type">
                <el-select
                  v-model="addData.type"
                  :placeholder="$t('warning.text4')"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('warningVoice.chooseSound')">
                <el-select
                  v-model="addData.voice"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in voiceList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button type="primary" @click="muiscPlay">{{
                  buttonText
                }}</el-button>
              </el-form-item>
              <el-form-item :label="$t('warningVoice.warningTime')">
                <el-select
                  v-model="addData.vtime"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in timeList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
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
                      {{ $t("warning.title7") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('warningVoice.warningCycle')">
                <el-select
                  v-model="addData.vcycle"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in cycleList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
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
                      {{ $t("warning.title8") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('warningVoice.push')">
                <el-select
                  v-model="addData.push"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in pushList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('warning.Remark1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="addData.memo"
                >
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel(addData)">
                {{ $t("warning.Cancel") }}
              </el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="addTrue(addData)"
              >
                {{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>

          <!-- 编辑告警设置 -->
          <el-dialog
            :title="$t('warning.title6')"
            :visible.sync="edit"
            width="30%"
            style="text-align: center"
            @close="editCancel(editData)"
          >
            <el-form
              :model="editData"
              label-width="110px"
              :rules="addRules"
              ref="editData"
              style="text-align: left"
            >
              <el-form-item :label="$t('warning.type')" prop="type">
                <el-select
                  v-model="editData.type"
                  :placeholder="$t('warning.text4')"
                  disabled
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('warningVoice.chooseSound')">
                <el-select
                  v-model="editData.voice"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in voiceList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button type="primary" @click="muiscPlay">{{
                  buttonText
                }}</el-button>
              </el-form-item>

              <el-form-item :label="$t('warningVoice.warningTime')">
                <el-select
                  v-model="editData.vtime"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in timeList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
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
                      {{ $t("warning.title7") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('warningVoice.warningCycle')">
                <el-select
                  v-model="editData.vcycle"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in cycleList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
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
                      {{ $t("warning.title8") }}
                    </p>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('warningVoice.push')">
                <el-select
                  v-model="editData.push"
                  :placeholder="$t('warningVoice.select')"
                >
                  <el-option
                    v-for="item in pushList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('warning.Remark1')">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="64"
                  v-model="editData.memo"
                >
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCancel(editData)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="editTrue(editData)"
                >{{ $t("warning.Sure") }}</el-button
              >
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
    <audio :src="audioSrc" controls="controls" loop hidden ref="audio"></audio>
  </div>
</template>
  
<script>
import Menu from "../../components/menu/Menu";
import Data from "../../components/data/data";
import {
  getWarningVoiceList,
  delWarningVoice,
  insertWarningVoice,
  updateWarningVoice,
} from "../../axios/api";
export default {
  components: {
    Menu,
    Data,
  },
  name: "WarningConfig",
  data() {
    return {
      i8n: this.$store.state.i18n,
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      projectid: this.$store.state.projectid,
      delprio: this.$store.state.userInfo.delprio,
      timezone: Math.ceil(0 - new Date().getTimezoneOffset() / 60),
      tableData: [],
      currentPage1: 1,
      total: 0,
      searchList: {
        projectid: this.$store.state.intoProjectid,
        page: 1,
        count: 20,
        type: "",
      },
      pageCount: 20,
      add: false,
      addData: {
        projectid: this.$store.state.intoProjectid,
        type: "",
        voice: "",
        vtime: "",
        vcycle: "",
        memo: "",
        push: "",
      },

      addRules: {
        type: [
          {
            required: true,
            message: this.$t("beacon.Pleasealarm"),
            trigger: "change",
          },
        ],
        warnum: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: this.$t("beacon.positiveinteger"),
            trigger: "blur",
          },
        ],
      },
      edit: false,
      editData: {
        projectid: this.$store.state.intoProjectid,
        type: "",
        memo: "",
        vcycle: "",
        voice: "",
        vtime: "",
        id: "",
        push: "",
      },
      loading: false,
      //告警类型
      typeList: [
        {
          index: 1,
          value: this.$t("warning.SOSalarm"),
        },
        {
          index: 2,
          value: this.$t("warning.Aggregatealarm"),
        },
        {
          index: 3,
          value: this.$t("warning.Passingalarm"),
        },
        {
          index: 4,
          value: this.$t("warning.Detentionalarm"),
        },
        {
          index: 5,
          value: this.$t("warning.Abnormalstatic"),
        },
        {
          index: 6,
          value: this.$t("warning.Tilt"),
        },
        {
          index: 7,
          value: this.$t("warning.Dumpalarm"),
        },
        {
          index: 8,
          value: this.$t("warning.Firealarm"),
        },
      ],
      //   告警时间
      timeList: [
        {
          index: 0,
          label: "0",
          value: 0,
        },
        {
          index: 1,
          label: "3s",
          value: 3,
        },
        {
          index: 2,
          label: "6s",
          value: 6,
        },
        {
          index: 3,
          label: "9s",
          value: 9,
        },

        {
          index: 4,
          label: "30s",
          value: 30,
        },
      ],
      // 报警周期
      cycleList: [
        {
          index: 0,
          label: "0",
          value: 0,
        },
        {
          index: 1,
          label: "30s",
          value: 30,
        },
        {
          index: 2,
          label: "1min",
          value: 60,
        },
        {
          index: 3,
          label: "3min",
          value: 180,
        },
        {
          index: 4,
          label: "5min",
          value: 300,
        },
      ],
      // 是否推送
      pushList: [
        {
          index: 1,
          label: "Yes",
          value: true,
        },
        {
          index: 2,
          label: "No",
          value: false,
        },
      ],
      //   报警音效
      voiceList: [
        {
          label: this.$t("warningVoice.voice1"),
          value: 1,
        },
        {
          label: this.$t("warningVoice.voice2"),
          value: 2,
        },
        {
          label: this.$t("warningVoice.voice3"),
          value: 3,
        },
        {
          label: this.$t("warningVoice.voice4"),
          value: 4,
        },
        {
          label: this.$t("warningVoice.voice5"),
          value: 5,
        },
      ],
      audioSrc: "",
      autoPlay: true,
      buttonText: this.$t("warningVoice.Audition"),
      timer: null,
    };
  },
  methods: {
    // 时间
    formatTime(row) {
      if (row.vcycle == null || row.vcycle == 0) {
        return 0 + "s";
      }
      let theTime = parseInt(row.vcycle); // 秒
      let theTime1 = 0; // 分
      let theTime2 = 0; // 小时

      if (theTime > 59) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);

        if (theTime1 > 59) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      if (theTime < 10) {
        // 保留逻辑分支，但去除无效自赋值
      }
      let result = theTime + "s";
      if (theTime1 > 0) {
        if (theTime > 0) {
          result = theTime1 + "min" + theTime + "s";
        } else {
          result = theTime1 + "min";
        }
      }
      if (theTime2 > 0) {
        if (theTime1 > 0) {
          if (theTime > 0) {
            result = theTime2 + "h" + theTime1 + "min" + theTime + "s";
          } else {
            result = theTime2 + "h" + theTime1 + "min";
          }
        } else {
          result = theTime2 + "h" + theTime + "s";
        }
      }
      return result;
    },
    formatVtime(row) {
      if (row.vtime == null || row.vtime == 0) {
        return 0 + "s";
      }
      let theTime = parseInt(row.vtime); // 秒
      let theTime1 = 0; // 分
      let theTime2 = 0; // 小时

      if (theTime > 59) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);

        if (theTime1 > 59) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      if (theTime < 10) {
        // 保留逻辑分支，但去除无效自赋值
      }
      let result = theTime + "s";
      if (theTime1 > 0) {
        result = theTime1 + "min" + theTime + "s";
      }
      if (theTime2 > 0) {
        if (theTime1 > 0) {
          result = theTime2 + "h" + theTime1 + "min" + theTime + "s";
        } else {
          result = theTime2 + "h" + theTime + "s";
        }
      }
      return result;
    },
    //试听
    muiscPlay() {
      var that = this;
      if (this.addData.voice) {
        if (this.autoPlay) {
          this.$refs.audio.src =
            "../../../static/video/" + this.addData.voice + ".mp3";
          this.$refs.audio.currentTime = 0; //从头开始播放
          this.$refs.audio.play(); //播放
          this.buttonText = this.$t("warningVoice.Stop");
        } else {
          this.$refs.audio.pause();
          this.buttonText = this.$t("warningVoice.Audition");
          clearInterval(this.timer);
          this.timer = null;
        }
        this.autoPlay = !this.autoPlay;
      }
      if (this.editData.voice) {
        if (this.autoPlay) {
          this.$refs.audio.src =
            "../../../static/video/" + this.editData.voice + ".mp3";
          this.$refs.audio.currentTime = 0; //从头开始播放
          this.$refs.audio.play(); //播放
          this.buttonText = this.$t("warningVoice.Stop");
        } else {
          this.$refs.audio.pause();
          this.buttonText = this.$t("warningVoice.Audition");
          clearInterval(this.timer);
          this.timer = null;
        }
        this.autoPlay = !this.autoPlay;
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

    //分页
    handleCurrentChange(val) {
      this.searchList.page = val;
      this.searchList.count = this.pageCount;
      this.getWarningVoiceLists();
    },
    handleSizeChange(val1) {
      this.pageCount = val1;
      this.searchList.count = val1;
      this.searchList.page = 1;
      this.currentPage1 = 1;
      this.getWarningVoiceLists();
    },

    //刷新
    clearBtn() {
      this.currentPage1 = 1;
      this.searchList = {
        projectid: this.$store.state.intoProjectid,
        type: "",
        page: 1,
        count: 20,
      };
      this.getWarningVoiceLists();
    },

    // 添加
    addWarning() {
      this.addData = {
        projectid: this.$store.state.intoProjectid,
        type: "",
        voice: "",
        vtime: "",
        vcycle: "",
        memo: "",
        push: "",
      };
      this.add = true;
      this.autoPlay = true;
    },
    addCancel(addData) {
      this.add = false;
      this.loading = false;
      this.$refs.addData.resetFields();
      this.$refs.audio.pause();
      this.buttonText = this.$t("warningVoice.Audition");
      clearInterval(this.timer);
      this.timer = null;
    },
    addTrue(addData) {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          var that = this;
          that.loading = true;
          insertWarningVoice(
            that.addData,
            that.tenantkey_A,
            that.tenantid_A,
            that.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.add = false;
              that.searchList.page = 1;
              that.currentPage1 = 1;
              that.getWarningVoiceLists();
              that.$message({
                message: that.$t("beacon.addsuccess"),
                type: "success",
              });
              that.loading = false;
              that.$refs.addData.resetFields();
            } else {
              that.add = false;
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

    // 编辑
    EditWarningCommand(index) {
      this.autoPlay = true;
      this.editData.type = this.tableData[index].type;
      this.editData.vcycle = this.tableData[index].vcycle;
      this.editData.voice = this.tableData[index].voice;
      this.editData.vtime = this.tableData[index].vtime;
      this.editData.memo = this.tableData[index].memo;
      this.editData.id = this.tableData[index].id;
      this.editData.push = this.tableData[index].push;
      this.edit = true;
    },
    editCancel(editData) {
      this.edit = false;
      this.loading = false;
      this.$refs.editData.resetFields();
      this.$refs.audio.pause();
      this.buttonText = this.$t("warningVoice.Audition");
      clearInterval(this.timer);
      this.timer = null;
    },
    editTrue(editData) {
      var that = this;
      updateWarningVoice(
        that.editData,
        that.tenantkey_A,
        that.tenantid_A,
        that.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.edit = false;
          that.getWarningVoiceLists();
          that.$message({
            message: that.$t("beacon.editsuccess"),
            type: "success",
          });
          that.loading = false;
          that.$refs.editData.resetFields();
        } else {
          that.edit = false;
          that.$message({
            message: that.$store.state.i18n == "zh" ? res.msg : res.enMsg,
            type: "error",
          });
          that.loading = false;
        }
      });
    },

    //删除
    DelWarningCommand(index) {
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
      this.$confirm(this.$t("beacon.deletemsg10"), this.$t("beacon.prompt"), {
        confirmButtonText: this.$t("terminal.confirm"),
        cancelButtonText: this.$t("terminal.cancel"),
        type: "warning",
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id,
          };
          delWarningVoice(
            data,
            this.tenantkey_A,
            this.tenantid_A,
            this.userName
          ).then((res) => {
            if (res.code == 1001) {
              that.getWarningVoiceLists();
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

    //刚进页面获取数据
    getWarningVoiceLists() {
      var that = this;
      getWarningVoiceList(
        this.searchList,
        this.tenantkey_A,
        this.tenantid_A,
        this.userName
      ).then((res) => {
        if (res.code == 1001) {
          that.tableData = res.data.list;
          that.tableData.forEach((item) => {
            if (item.push) {
              item.pushstr = "Yes";
            } else {
              item.pushstr = "No";
            }
          });
          that.total = res.data.size;
        }
      });
    },
  },
  beforeMount() {
    this.searchList = {
      projectid: this.$store.state.intoProjectid,
      type: "",
      page: 1,
      count: 20,
    };
    this.getWarningVoiceLists();
    // if (this.$store.state.intoProjectType == 1) {
    //   this.typeList = [
    //     {
    //       index: 1,
    //       value: this.$t("warning.Detentionalarm"),
    //     },
    //     {
    //       index: 2,
    //       value: this.$t("warning.Aggregatealarm"),
    //     },
    //     {
    //       index: 3,
    //       value: this.$t("warning.Abnormalstatic"),
    //     },
    //     {
    //       index: 4,
    //       value: this.$t("warning.Passingalarm"),
    //     },
    //   ];
    // } else if (this.$store.state.intoProjectType == 2) {
    //   this.typeList = [
    //     {
    //       index: 1,
    //       value: this.$t("warning.Detentionalarm"),
    //     },
    //     {
    //       index: 2,
    //       value: this.$t("warning.Aggregatealarm"),
    //     },
    //   ];
    // }
  },
  watch: {
    //监听中英文 重新渲染下拉框内容
    "$i18n.locale"() {
      this.i8n = this.$store.state.i18n;

      Object.assign(
        this.$data.buttonText,
        this.$options.data.call(this).buttonText
      );
      Object.assign(
        this.$data.typeList,
        this.$options.data.call(this).typeList
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
.edits,
.editss {
  padding: 2px 16px !important;
}
/* 改变按钮颜色 */
.edits:hover {
  background-color: rgb(196, 27, 27);
}

.editss:hover {
  background-color: rgb(25, 86, 201);
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
</style>
  