<template>
  <div :class="changeBox ? 'box' : 'box1'">
    <el-button
      :class="btnChange ? 'changeBtn1' : 'changeBtn'"
      @click="changeIcon()"
      v-bind:icon="iconData"
    ></el-button>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="this.$route.path"
      :router="true"
    >
      <el-menu-item index="/terminal" :class="{ left: show }">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Terminalmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon terminal"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Terminalmanagement") }}</span>
      </el-menu-item>

      <el-menu-item index="/beacon" :class="{ left: show }">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Beaconmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon mark"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Beaconmanagement") }}</span>
      </el-menu-item>
      <el-menu-item index="/security" :class="{ left: show }">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Securitymanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon aoa"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Securitymanagement") }}</span>
      </el-menu-item>
      <el-menu-item
        :class="{ left: show }"
        index="/gateway"
        v-if="
          contrForPrioNum == 1 ||
            contrForPrioNum == 2 ||
            contrForPrioNum == 3 ||
            contrForPrioNum == 4
        "
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.Basestationmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon station"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Basestationmanagement") }}</span>
      </el-menu-item>
      <el-menu-item
        :class="{ left: show }"
        index="/ns"
        v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.NSmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon ns"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.NSmanagement") }}</span>
      </el-menu-item>
      <el-menu-item
        :class="{ left: show }"
        index="/nsconfig"
        v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.NSconfiguration')"
          placement="right"
          :disabled="open"
        >
          <i class="el-icon-setting"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.NSconfiguration") }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Devicemanagement",

  data() {
    return {
      contrForPrioNum: this.$store.state.userInfo.prionum,
      isCollapse: false,
      iconData: "",
      show: this.$store.state.show,
      btnChange: "",
      changeBox: "",
      open: ""
    };
  },

  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    changeIcon() {
      if (!this.show) {
        //展开
        this.iconData = "el-icon-s-fold";
        this.open = true;
        this.show = true;
        this.btnChange = true;
        this.changeBox = true;
        this.$store.commit("changeShow", this.show);
      } else {
        //收缩
        this.iconData = "el-icon-s-unfold";
        this.show = false;
        this.btnChange = false;
        this.open = false;
        this.changeBox = false;
        this.$store.commit("changeShow", this.show);
      }
    }
  },
  beforeMount() {
    if (this.$store.state.show) {
      this.iconData = "el-icon-s-fold";
      this.btnChange = true;
      this.changeBox = true;
      this.open = true;
    } else {
      this.iconData = "el-icon-s-unfold";
      this.btnChange = false;
      this.changeBox = false;
      this.open = false;
    }
  },
  beforeDestroy() {
    this.$store.commit("changeShow", this.show);
  }
};
</script>

<style scoped>
.changeBtn {
  width: 30px;
  height: 50px;
  border: none;
  background-color: #fff;
  padding-left: 20%;
}
.changeBtn1 {
  width: 149px;
  height: 50px;
  border: none;
}

.box {
  width: auto;
  overflow: hidden;
}
.box1 {
  overflow: hidden;
  width: auto;
}
.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-color: #909399;
}
.icon.terminal {
  mask: url("../../assets/terminal.svg");
  mask-size: contain;
}
.icon.mark {
  mask: url("../../assets/mark.svg");
  mask-size: contain;
}
.icon.aoa {
  mask: url("../../assets/aoa.svg");
  mask-size: contain;
}
.icon.station {
  mask: url("../../assets/station.svg");
  mask-size: contain;
}
.icon.ns {
  mask: url("../../assets/ns.svg");
  mask-size: contain;
}
.is-active .icon {
  background-color: #409eff;
}
/* item左对齐 */
.left {
  text-align: start !important;
  padding-left: 40px !important;
}
</style>
