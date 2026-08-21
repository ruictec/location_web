<template>
  <div :class="contrForPrionum != 5 ? 'homes' : ''" style="height: 100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>

    <div class="content">
      <el-container :class="contrForPrionum == 5 ? 'user' : 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Devicemanagement /></el-aside>
        <el-main>
          <!-- 权限 1-4 始终展示；权限 5 才按项目功能配置判断 -->
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
            <el-tab-pane
              name="3"
              :label="$t('otherDev.bluetoothSensor')"
              v-if="blesensor"
            >
              <Ble ref="ble" />
            </el-tab-pane>
            <el-tab-pane name="4" :label="$t('otherDev.camera')" v-if="camera">
              <Camera ref="camera" />
            </el-tab-pane>
          </el-tabs>
          <div v-else-if="isUserPrio" class="no-device-message">
            <el-empty :description="$t('common.noDeviceAvailable')"></el-empty>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import { resolveElTab } from "../../utils/elementTab";
import basecard from "../../components/card/base-card";
import Menu from "../../components/menu/Menu";
import Devicemanagement from "../../components/devicemanagement/devicemanagement";
import AOA from "./Aoa.vue";
import Ble from "./Ble.vue";
import BurglarAlarm from "./BurglarAlarm.vue";
import Camera from "./Camera.vue";
import SmokeSensation from "./SmokeSensation.vue";

function isPartEnabled(v) {
  return v === true || v === 1 || v === "1" || v === "true";
}

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
    };
  },
  computed: {
    prionum() {
      return Number(this.contrForPrionum || this.$store.state.userInfo.prionum);
    },
    // 管理员/客户侧 1-4：安全管理页直接可用，不依赖项目 functionParts
    isAdminPrio() {
      const p = this.prionum;
      return p === 1 || p === 2 || p === 3 || p === 4;
    },
    // 普通用户 5：按项目配置判断可见设备类型
    isUserPrio() {
      return this.prionum === 5;
    },
    functionParts() {
      return this.$store.state.functionParts || {};
    },
    aoagw() {
      return this.isAdminPrio || isPartEnabled(this.functionParts.aoagw);
    },
    smoke() {
      return this.isAdminPrio || isPartEnabled(this.functionParts.smoke);
    },
    alertor() {
      return this.isAdminPrio || isPartEnabled(this.functionParts.alertor);
    },
    blesensor() {
      return this.isAdminPrio || isPartEnabled(this.functionParts.blesensor);
    },
    camera() {
      return this.isAdminPrio || isPartEnabled(this.functionParts.camera);
    },
    hasAnyDevice() {
      if (this.isAdminPrio) return true;
      return (
        this.aoagw ||
        this.smoke ||
        this.alertor ||
        this.blesensor ||
        this.camera
      );
    },
  },
  watch: {
    hasAnyDevice: {
      immediate: true,
      handler(val) {
        if (!val) return;
        this.$nextTick(() => {
          this.triggerDefaultSearch();
        });
      },
    },
  },
  methods: {
    triggerDefaultSearch() {
      if (this.aoagw && this.$refs.aoa) {
        this.$refs.aoa.search();
      } else if (this.smoke && this.$refs.smokesensation) {
        this.$refs.smokesensation.search();
      } else if (this.alertor && this.$refs.burglaralarm) {
        this.$refs.burglaralarm.search();
      } else if (this.blesensor && this.$refs.ble) {
        this.$refs.ble.search();
      } else if (this.camera && this.$refs.camera) {
        this.$refs.camera.search();
      }
    },
    changeTab(tab) {
      var that = this;
      switch (resolveElTab(tab).name) {
        case "0":
          that.$refs.aoa && that.$refs.aoa.search();
          break;
        case "1":
          that.$refs.smokesensation && that.$refs.smokesensation.search();
          break;
        case "2":
          that.$refs.burglaralarm && that.$refs.burglaralarm.search();
          break;
        case "3":
          that.$refs.ble && that.$refs.ble.search();
          break;
        case "4":
          that.$refs.camera && that.$refs.camera.search();
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.homes {
  height: 100%;
}
.menu_header {
  position: relative;
}
.asi {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 30px;
  width: 100%;
}
.el-aside {
  margin-top: 50px;
  width: auto !important;
  flex-shrink: 0;
}
.el-main {
  width: auto !important;
  flex: 1;
  min-width: 0;
  padding: 8px 16px 16px;
  overflow: auto;
}
.el-tabs {
  width: 100%;
  min-width: 0;
}
.el-main :deep(.el-tabs__header),
.el-main :deep(.el-tabs__content),
.el-main :deep(.el-tab-pane),
.el-main :deep(.content),
.el-main :deep(.el-container),
.el-main :deep(.el-main),
.el-main :deep(.el-table) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.el-main :deep(.el-main) {
  padding: 0 !important;
}
.no-device-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
