<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
      {{ $t("list.Alarmconfiguration") }}
    </div>
    <div class="content">
      <el-container>
        <el-main>
          <div class="warning_input terminal-filter-flow" :class="filterLangClass">
            <el-form
              class="demo-form-inline terminal-filter-form"
            >
              <el-form-item class="terminal-toolbar-item">
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
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("warningVoice.warningTime2")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>
                        {{ $t("warningVoice.warningTimeTip") }}<br />
                        {{ $t("warningVoice.warningTimeCycleTip") }}
                      </p>
                    </div></template>
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
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("warningVoice.warningCycle2")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>
                        {{ $t("warningVoice.warningCycleTip") }}<br />
                        {{ $t("warningVoice.warningTimeCycleTip") }}
                      </p>
                    </div></template>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                property="pushstr"
                show-overflow-tooltip
                align="center"
              >
                <template #header="scope">
                  <span class="cell" style="padding-right: 0">{{
                    $t("warningVoice.push1")
                  }}</span>
                  <el-tooltip
                    class="item"
                    effect="light"
                    placement="right-start"
                    style="font-size: 130%"
                  >
                    <template #content><div>
                      <p>
                        {{ $t("warningVoice.pushTip") }}
                      </p>
                    </div></template>
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
                <template #default="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('territorymanagement.edit')"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      size="small"
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
                      size="small"
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
                v-model:current-page="currentPage1"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                v-model:page-size="pageCount"
              >
              </el-pagination>
            </div>
          </div>

          <!-- 添加告警设置 -->
          <el-dialog
            :title="$t('warning.title1')"
            v-model="add"
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
                <div class="voice-audition-row">
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
                </div>
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
                  <template #content><div>
                    <p>
                      {{ $t("warning.title7") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("warning.title8") }}
                    </p>
                  </div></template>
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
            <template #footer><div class="dialog-footer">
              <el-button @click="addCancel(addData)">
                {{ $t("warning.Cancel") }}
              </el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="addTrue(addData)"
              >
                {{ $t("warning.Sure") }}</el-button>
            </div></template>
          </el-dialog>

          <!-- 编辑告警设置 -->
          <el-dialog
            :title="$t('warning.title6')"
            v-model="edit"
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
                <div class="voice-audition-row">
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
                </div>
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
                  <template #content><div>
                    <p>
                      {{ $t("warning.title7") }}
                    </p>
                  </div></template>
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
                  <template #content><div>
                    <p>
                      {{ $t("warning.title8") }}
                    </p>
                  </div></template>
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
            <template #footer><div class="dialog-footer">
              <el-button @click="editCancel(editData)">{{
                $t("warning.Cancel")
              }}</el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="editTrue(editData)"
                >{{ $t("warning.Sure") }}</el-button>
            </div></template>
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
  computed: {
    filterLangClass() {
      const lang = this.i8n || this.$store.state.i18n || (this.$i18n && this.$i18n.locale);
      return lang === "en" ? "is-en" : "is-zh";
    },
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

.el-table :deep(.el-table__row td) {
  padding: 0 !important;
}

.el-table :deep(.hover-row td) {
  background-color: #d9eafa !important;
}

.querry,
.reset {
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

.demo-form-inline :deep(.el-form-item .el-range-separator) {
  height: 34px;
  line-height: 34px;
}

.el-form-item .el-button {
  margin-left: 4px !important;
}
.voice-audition-row {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  width: 100%;
}
.voice-audition-row :deep(.el-select) {
  flex: 1 1 auto;
  min-width: 0;
  width: auto !important;
}
.voice-audition-row :deep(.el-button) {
  flex: 0 0 auto;
  margin-left: 0 !important;
  white-space: nowrap;
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

</style>

  