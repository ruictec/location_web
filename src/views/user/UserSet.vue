<template>
  <div  :class=" contrForPrionum != 5 ? 'home': ''" style="height:100%">
    <div class="menu_header">
      <Menu />
    </div>
    <div class="content">
      <el-container class="asi">
        <el-aside><Usermanagement /></el-aside>
        <el-main> </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Menu from "../../components/menu/Menu";
import Usermanagement from "../../components/user/user";
// import {} from "../../axios/api";
export default {
  components: {
    Menu,
    Usermanagement,
  },
  name: "UserSet",
  data() {
    return {
      tenantid_A: this.$store.state.userInfo.tenantid,
      tenantkey_A: this.$store.state.userInfo.tenantkey,
      userName: this.$store.state.userInfo.username,
    };
  },
  methods: {},
  beforeMount() {},
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
</style>