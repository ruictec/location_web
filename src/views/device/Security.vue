<template>
  <div :class="contrForPrionum != 5 ? 'homes' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>

    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Devicemanagement /></el-aside>
        <el-main>
          <el-tabs @tab-click="changeTab">
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
      contrForPrionum: this.$store.state.userInfo.prionum,
      aoagw: this.$store.state.functionParts.aoagw,
      smoke: this.$store.state.functionParts.smoke,
      alertor: this.$store.state.functionParts.alertor,
      blesensor: this.$store.state.functionParts.blesensor,
      camera: this.$store.state.functionParts.camera,
    };
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
          break;
        case "2":
          that.$refs.burglaralarm.search();
          break;
          break;
        case "3":
          that.$refs.ble.search();
          break;
          break;
        case "4":
          that.$refs.camera.search();
          break;
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.$refs.aoa.search();
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
</style>
