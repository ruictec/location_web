<template>
  <div :class="changeBox ? 'box' : 'box1'">
    <el-button
      :class="btnChange ? 'changeBtn1' : 'changeBtn'"
      @click="changeIcon()"
    >
      <i :class="iconData"></i>
    </el-button>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="$route.path"
      :router="true"
    >
      <el-menu-item
        index="/usermanagement"
        :class="{ left: show }"
        v-if="contrForPrioNum != 6"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('index.usermanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="el-icon-user menu-side-icon"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("index.usermanagement") }}</span>
        <el-tooltip
          class="item menu-item-help"
          effect="light"
          placement="right-start"
          v-if="show"
        >
          <template #content><div>
            <p>
              {{ $t("companyorder.tet9") }}
            </p>
          </div></template>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>

      <el-menu-item
        index="/companymanagement"
        :class="{ left: show }"
        v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.Purchasingcompany')"
          placement="right"
          :disabled="open"
        >
          <i class="icon firm"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Purchasingcompany") }}</span>
        <el-tooltip
          class="item menu-item-help"
          effect="light"
          placement="right-start"
          v-if="show"
        >
          <template #content><div>
            <p>{{ $t("index.tet10") }}</p>
          </div></template>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
      <el-menu-item
        index="/customermanagement"
        :class="{ left: show }"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.Purchasingcustomer')"
          placement="right"
          :disabled="open"
        >
          <i class="icon client"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Purchasingcustomer") }}</span>
        <el-tooltip
          class="item menu-item-help"
          effect="light"
          placement="right-start"
          v-if="show"
        >
          <template #content><div>
            <p>{{ $t("list.tet") }}</p>
          </div></template>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Usermanagement",

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
.menu-side-icon {
  width: 16px;
  height: 16px;
  font-size: 16px;
  line-height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}
.is-active .icon,
.is-active .menu-side-icon {
  color: #409eff;
  background-color: transparent;
}
.icon.firm {
  mask: url("../../assets/firm.svg");
  mask-size: contain;
}
.icon.client {
  mask: url("../../assets/client.svg");
  mask-size: contain;
}
.is-active .icon {
  background-color: #409eff;
}
.left {
  text-align: start !important;
  padding-left: 40px !important;
}
</style>
