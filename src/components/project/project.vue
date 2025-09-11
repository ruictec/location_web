<template>
  <div :class="changeBox ? 'box' : 'box1'">
    <el-button
      :class="btnChange ? 'changeBtn1' : 'changeBtn'"
      @click="changeIcon()"
      v-bind:icon="iconData"
    ></el-button>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="activeName"
      mode=""
      :router="true"
    >
      <el-menu-item
        index="/mapmanagement"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4 || maprio == 1"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Mapmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon map"></i>
        </el-tooltip>
        <span slot="title" v-if="show">{{
          $t("Breadcrumb.Mapmanagement")
        }}</span>
      </el-menu-item>

      <el-menu-item
        index="/buildingmanagement"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4 || maprio == 1"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Buildingmanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon tower"></i>
        </el-tooltip>
        <span slot="title" v-if="show">{{
          $t("Breadcrumb.Buildingmanagement")
        }}</span>
      </el-menu-item>
      <el-menu-item
        index="/floormanagement"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4 || maprio == 1"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Floormanagement')"
          placement="right"
          :disabled="open"
        >
          <i class="icon tier"></i>
        </el-tooltip>
        <span v-if="show">{{ $t("Breadcrumb.Floormanagement") }}</span>
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
            <p>{{ $t("Breadcrumb.tet") }}</p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>

      <el-menu-item
        index="/buildingdetails"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
        ><el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Floordetails')"
          placement="right"
          :disabled="open"
        >
          <i class="icon detail"></i>
        </el-tooltip>
        <span v-if="show">{{ $t("Breadcrumb.Floordetails") }}</span>
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
            <p>{{ $t("Breadcrumb.tet1") }}</p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
      <el-menu-item
        index="/outdoor/locationoutdoor"
        @click="changeActiveName()"
        v-if="contrForPrioNum == 5 && projectType == 1"
        :class="isActiveClass == 'locationoutdoor' ? 'is-active' : ''"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Outdoorpositioning')"
          placement="right"
          :disabled="open"
          ref="outdoor"
        >
          <i class="icon outdoor"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Outdoorpositioning") }}</span>
      </el-menu-item>

      <el-menu-item
        index="/indoor/locationindoor"
        @click="changeActiveName2()"
        v-if="contrForPrioNum == 5"
        :class="isActiveClass == 'locationindoor' ? 'is-active' : ''"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Indoorpositioning')"
          placement="right"
          :disabled="open"
          ref="indoor"
        >
          <i class="icon indoor"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Indoorpositioning") }}</span>
      </el-menu-item>
      <el-menu-item
        index="/location"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Locationdata')"
          placement="right"
          :disabled="open"
        >
          <i class="el-icon-data-board"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Locationdata") }}</span>
      </el-menu-item>
      <el-menu-item
        index="/config"
        v-if="contrForPrioNum == 3 || contrForPrioNum == 4"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('Breadcrumb.Config')"
          placement="right"
          :disabled="open"
        >
          <i class="el-icon-setting"></i>
        </el-tooltip>
        <span v-show="show">{{ $t("Breadcrumb.Config") }}</span>
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
            <p>{{ $t("Breadcrumb.tet2") }}</p>
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Project",
  data() {
    return {
      contrForPrioNum: this.$store.state.userInfo.prionum,
      maprio: this.$store.state.userInfo.maprio,
      projectType: this.$store.state.intoProjectType,
      isCollapse: false,
      iconData: "",
      show: this.$store.state.show,
      btnChange: "",
      changeBox: "",
      open: "",
      activeName: this.$route.path,

      isActiveClass: "",
    };
  },
  methods: {
    changeActiveName() {
      this.$store.commit("changeActiveName", "location");
    },
    changeActiveName2() {
      this.$store.commit("changeActiveName2", "location");
    },
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
    switch (this.$route.path) {
      case "/indoor/historical":
        this.isActiveClass = "locationindoor";
        break;
      case "/outdoor/historical":
        this.isActiveClass = "locationoutdoor";
        break;
      case "/indoor3d/historical3d":
        this.isActiveClass = "location3d";
    }
  },
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
.icon.map {
  mask: url("../../assets/map.svg");
  mask-size: contain;
}
.icon.tower {
  mask: url("../../assets/tower.svg");
  mask-size: contain;
}
.icon.tier {
  mask: url("../../assets/tier.svg");
  mask-size: contain;
}
.icon.detail {
  mask: url("../../assets/detail.svg");
  mask-size: contain;
}
.icon.indoor {
  mask: url("../../assets/indoor.svg");
  mask-size: contain;
}
.icon.outdoor {
  mask: url("../../assets/outdoor.svg");
  mask-size: contain;
}
.is-active .icon {
  background-color: #409eff;
}
</style>
