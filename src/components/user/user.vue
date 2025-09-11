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
      <el-menu-item index="/usermanagement" v-if="contrForPrioNum != 6">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('index.usermanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="el-icon-user"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("index.usermanagement") }}</span>
        <el-tooltip
          class="item"
          effect="light"
          placement="right-start"
          style="
            position: absolute;
            font-size: 130%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 2%;
          "
          v-if="show"
        >
          <div slot="content">
            <p>
              {{ $t("companyorder.tet9") }}
            </p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>

      <el-menu-item
        index="/companymanagement"
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
          class="item"
          effect="light"
          placement="right-start"
          style="
            position: absolute;
            font-size: 130%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 2%;
          "
          v-if="show"
        >
          <div slot="content">
            <p>{{ $t("index.tet10") }}</p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
      <el-menu-item
        index="/customermanagement"
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
          class="item"
          effect="light"
          placement="right-start"
          style="
            position: absolute;
            font-size: 130%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 2%;
          "
          v-if="show"
        >
          <div slot="content">
            <p>{{ $t("list.tet") }}</p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
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
.el-menu-item {
  text-align: left;
}
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
</style>
