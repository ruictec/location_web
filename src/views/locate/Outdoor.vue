<template>
  <div  :class=" contrForPrionum != 5 ? 'home': ''" style="height:100%">
    <div class="menu_header" v-if="contrForPrionum != 5">
      <Menu />
    </div>

    <div class="content">
      <el-container :class=" contrForPrionum == 5 ? 'user': 'asi'">
        <el-aside v-if="contrForPrionum != 5"><Project /></el-aside>
        <el-main>
          <!-- <div class="inputContent">
            <div class="navigation" style="margin-right: 2%">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane
                  class="black"
                  label="定位查询"
                  name="location"
                ></el-tab-pane>
                <el-tab-pane
                  class="black"
                  label="历史轨迹"
                  name="historical"
                ></el-tab-pane>
              </el-tabs>
            </div>
          </div> -->
          <div>
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Project from "../../components/project/project";

export default {
  components: {
    Menu,
    Project,
  },
  name: "Outdoor",
  data() {
    return {
      contrForPrionum: this.$store.state.userInfo.prionum,
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
      intoProjectName: this.$store.state.intoProjectName,
      intoGroundImg: this.$store.state.intoGroundImg,
      intoGroundId: this.$store.state.intoGroundId,
      activeName: 'location',
    };
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case "location":
          this.$router.push("/outdoor/locationoutdoor");
          this.$store.commit("changeActiveName", tab.name);
          break;
        case "historical":
          this.$router.push("/outdoor/historical");
          this.$store.commit("changeActiveName", tab.name);
          break;
        default:
          break;
      }
    },
  },
  computed: {
    activeNames() {
      return this.$store.state.activeName;
    },
  },
  watch: {
    //监听vuex中projectid的变化
    activeNames(val) {
      if (val == "location") {
        this.activeName = "location";
      }
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
li {
  list-style-type: none;
}
.home {
  height: 100%;
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

.demo-form-inline >>> .el-form-item  .el-form-item__label {
  padding: 0;
  line-height: 34px;
}

.demo-form-inline >>> .el-form-item   .el-form-item__content {
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item   .el-input__inner {
  height: 34px;
  line-height: 34px;
}
.demo-form-inline >>> .el-form-item   .el-input__icon {
  height: 34px;
  line-height: 34px;
}

.querry,
.reset {
  padding: 8px 12px !important;
}

#allmap {
  position: relative;
  /* height: 600px; */
  /* width: 100%; */
  border: 1px solid red;
}

#popup {
  height: 100px;
}

#popup-content {
  background: #fff;
  padding: 3px;
}
.ol-popup-closer {
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "x";
  color: red;
}

.backProject >>> .el-page-header__left {
  height: 24px !important;
  white-space: nowrap !important;
}
.backProject >>> .el-page-header__content {
  text-align: left !important;
}
.navigation >>> .el-tabs__item {
  height: 24px;
  line-height: 24px;
}
.inputContent {
  position: absolute;
  right: 2%;
  display: flex;
}
</style>