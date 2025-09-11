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
      <el-menu-item index="/staffmanagement" v-if="contrForPrioNum != 6">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Employeemanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon staff"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Employeemanagement") }}</span>
      </el-menu-item>

      <el-menu-item index="/assetManagement">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.assetmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon asset"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.assetmanagement") }}</span>
      </el-menu-item>
      <el-menu-item index="/checkwork" v-if="contrForPrioNum == 5">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Attendancemanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon check"></i>
        </el-tooltip>
        <span slot="title" v-show="show">{{
          $t("Breadcrumb.Attendancemanagement")
        }}</span>
      </el-menu-item>
      <el-menu-item index="/inspection" v-if="contrForPrioNum == 5">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Patrolmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon task"></i>
        </el-tooltip>
        <span slot="title" v-show="show">{{
          $t("Breadcrumb.Patrolmanagement")
        }}</span>
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
      open: "",
    };
  },

  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    changeIcon() {
      if (!this.show) {
        this.iconData = "el-icon-s-fold";
        this.open = true;
        this.show = true;
        this.btnChange = true;
        this.changeBox = true;
        this.$store.commit("changeShow", this.show);
      } else {
        this.iconData = "el-icon-s-unfold";
        this.show = false;
        this.btnChange = false;
        this.open = false;
        this.changeBox = false;
        this.$store.commit("changeShow", this.show);
      }
    },
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
  width: 150px;
  overflow: hidden;
}
.box1 {
  overflow: hidden;
  width: 50px;
}
.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-color: #909399;
}
.icon.asset {
  mask: url("../../assets/asset.svg");
  mask-size: contain;
}
.icon.staff {
  mask: url("../../assets/staff.svg");
  mask-size: contain;
}
.icon.check {
  mask: url("../../assets/check.svg");
  mask-size: contain;
}
.icon.task {
  mask: url("../../assets/task.svg");
  mask-size: contain;
}
.is-active .icon {
  background-color: #409eff;
}
</style>
