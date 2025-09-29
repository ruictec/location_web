<template>
  <div :class="contrForPrionum != 5 ? 'homes' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>

    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Devicemanagement /></el-aside>
        <el-main>
          <el-tabs @tab-click="changeTab" v-if="hasAnyDevice">
            <el-tab-pane name="0" :label="$t('otherDev.aoaGateway')" v-if="aoagw">
              <AOA ref="aoa" />
            </el-tab-pane>
            <el-tab-pane name="1" :label="$t('otherDev.smokeSensor')" v-if="smoke">
              <SmokeSensation ref="smokesensation" />
            </el-tab-pane>
            <el-tab-pane name="2" :label="$t('otherDev.burglarAlarm')" v-if="alertor">
              <BurglarAlarm ref="burglaralarm" />
            </el-tab-pane>
            <el-tab-pane name="3"
              :label="$t('otherDev.bluetoothSensor')"
              v-if="blesensor"
            >
              <Ble ref="ble"
            /></el-tab-pane>
            <el-tab-pane name="4" :label="$t('otherDev.camera')" v-if="camera">
              <Camera ref="camera"
            /></el-tab-pane>
          </el-tabs>
          <div v-else class="no-device-message">
            <el-empty :description="$t('common.noDeviceAvailable') || '暂无可用设备'"></el-empty>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Devicemanagement from "../../components/devicemanagement/devicemanagement";
import AOA from "./Aoa.vue";
import Ble from "./Ble.vue";
import BurglarAlarm from "./BurglarAlarm.vue";
import Camera from "./Camera.vue";
import SmokeSensation from "./SmokeSensation.vue";

export default {
  components: {
    Menu,
    Devicemanagement,
    basecard,
    AOA,
    Ble,
    BurglarAlarm,
    Camera,
    SmokeSensation,
  },
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo?.prionum || 5,
      aoagw: this.$store.state.functionParts?.aoagw || false,
      smoke: this.$store.state.functionParts?.smoke || false,
      alertor: this.$store.state.functionParts?.alertor || false,
      blesensor: this.$store.state.functionParts?.blesensor || false,
      camera: this.$store.state.functionParts?.camera || false,
    };
  },
  computed: {
    hasAnyDevice() {
      return this.aoagw || this.smoke || this.alertor || this.blesensor || this.camera;
    }
  },
  methods: {
    changeTab(tab) {
      var that = this;
      switch (tab.name) {
        case "0":
          that.$refs.aoa.search();
          break;
        case "1":
          that.$refs.smokesensation.search();
          break;
        case "2":
          that.$refs.burglaralarm.search();
          break;
        case "3":
          that.$refs.ble.search();
          break;
        case "4":
          that.$refs.camera.search();
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    // 延迟执行，确保组件已渲染
    this.$nextTick(() => {
      if (this.aoagw && this.$refs.aoa) {
        this.$refs.aoa.search();
      }
    });
  },
};
</script>
<style scoped>
.homes {
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
.el-main {
  width: 98%;
}
.no-device-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
