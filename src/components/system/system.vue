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
      mode=""
      :router="true"
    >
      <el-menu-item index="/usercenter">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.PersonalCenter')"
          placement="right"
          :disabled="open"
        >
          <i class="icon usercenter"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.PersonalCenter") }}</span>
      </el-menu-item>

      <el-menu-item
        index="/myorder"
        v-if="
          contrForPrioNum == 3 || contrForPrioNum == 4 || contrForPrioNum == 5
        "
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.Myworkorder')"
          placement="right"
          :disabled="open"
        >
          <i class="icon order"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Myworkorder") }}</span>
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
            <p>{{ $t("list.tet5") }}</p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>

      <el-menu-item
        index="/userorder"
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
          :content="$t('list.Userworkorder')"
          placement="right"
          :disabled="open"
        >
          <i class="icon userorder"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("list.Userworkorder") }}</span>
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
            <p>{{ $t("list.tet6") }}</p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
      <el-menu-item
        index="/companyorder"
        v-if="contrForPrioNum == 1 || contrForPrioNum == 2"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('list.Enterpriseworkorder')"
          placement="right"
          :disabled="open"
        >
          <i class="icon heartdata"></i>
        </el-tooltip>
        <span slot="title" v-show="show">{{
          $t("list.Enterpriseworkorder")
        }}</span>
      </el-menu-item>
      <el-menu-item
        index="/logmanagement"
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
          :content="$t('index.Logmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon log"></i>
        </el-tooltip>
        <span slot="title" v-show="show">{{ $t("index.Logmanagement") }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "System",
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
  width: auto;
  overflow: hidden;
}
.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-color: #909399;
}
.icon.realtime {
  mask: url("../../assets/realtime.svg");
  mask-size: contain;
}
.icon.heartdata {
  mask: url("../../assets/heartdata.svg");
  mask-size: contain;
}
.icon.downdata {
  mask: url("../../assets/downdata.svg");
  mask-size: contain;
}
.icon.sos {
  mask: url("../../assets/sos.svg");
  mask-size: contain;
}
.icon.order {
  mask: url("../../assets/order.svg");
  mask-size: contain;
}
.icon.log {
  mask: url("../../assets/log.svg");
  mask-size: contain;
}
.icon.usercenter {
  mask: url("../../assets/usercenter.svg");
  mask-size: contain;
}
.icon.userorder {
  mask: url("../../assets/userorder.svg");
  mask-size: contain;
}
.is-active .icon {
  background-color: #409eff;
}
@media screen and (max-width: 1400px) {
  .item1 {
    margin-left: 55% !important;
  }
}
</style>
