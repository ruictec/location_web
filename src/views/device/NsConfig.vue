<template>
  <div :class="contrForPrionum != 5 ? 'home' : ''" style="height: 100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Devicemanagement /></el-aside>
        <el-main> 

          <el-tabs v-model="activeName" @tab-click="changeTab">
            <el-tab-pane name="0" label="Teanats">
              <Teanats ref="Teanats" />
            </el-tab-pane>
            <el-tab-pane name="1" label="Applications">
              <Applications ref="Applications" />
            </el-tab-pane>
            <el-tab-pane name="2" label="Devices">
              <Devices ref="Devices" />
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import Menu from "../../components/menu/Menu";
import Devicemanagement from "../../components/devicemanagement/devicemanagement";
import Teanats from "./nsConfig/tenant.vue";
import Applications from "./nsConfig/application.vue";
import Devices from "./nsConfig/device.vue";

export default {
  components: { Menu, Devicemanagement, Teanats, Applications, Devices },
  name: "NsConfig",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prio,
      activeName: "",
    };
  },
  methods: {
    changeTab(tab, event) {
      switch (tab.name) {
        case "0":
          this.$refs.Teanats.getOrganizationOnes();
          break;
        case "1":
          this.$refs.Applications.getApplicationOnes();
          break;
        case "2":
          this.$refs.Devices.getDeviceProfileLists();
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.$refs.Teanats.getOrganizationOnes();
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
.query,
.reset,
.addBeacon,
.editBeacons,
.delBeacons {
  padding: 8px 12px !important;
}
.dels1 {
  padding: 2px 16px !important;
}
.dels1:hover {
  background-color: rgb(196, 27, 27);
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
  height: 34px !important;
  line-height: 34px !important;
}
.chose >>> button {
  padding: 0;
  line-height: 34px;
  border: 0;
}

.memo >>> .el-input {
  width: 80%;
}
</style>
