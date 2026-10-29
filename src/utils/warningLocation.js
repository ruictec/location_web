import { getWarningPointByWarningid } from "../axios/api";

/** 告警是否带定位类型（无 postype 表示无位置，不可跳转） */
export function hasWarningPostype(postype) {
  return (
    postype !== null &&
    postype !== undefined &&
    postype !== "" &&
    postype !== "null" &&
    postype !== "undefined"
  );
}

function normalizeWarning(info) {
  if (info == null) return {};
  if (typeof info === "string") {
    try {
      return JSON.parse(info);
    } catch (e) {
      return {};
    }
  }
  return { ...info };
}

/**
 * 拉取告警点位并写入 vuex sosData，成功返回 { warning, points }，失败返回 null（已提示）
 */
export async function prepareWarningLocation(vm, rawInfo) {
  const warning = normalizeWarning(rawInfo);
  const postype = warning.postype;

  if (!hasWarningPostype(postype)) {
    vm.$message({
      message: vm.$t("tet.tet8"),
      type: "warning",
    });
    return null;
  }

  if (warning.id == null || warning.id === "") {
    vm.$message({
      message: vm.$t("tet.tet8"),
      type: "warning",
    });
    return null;
  }

  const tenantkey =
    vm.tenantkey_A ||
    (vm.$store.state.userInfo && vm.$store.state.userInfo.tenantkey);
  const tenantid =
    vm.tenantid_A ||
    (vm.$store.state.userInfo && vm.$store.state.userInfo.tenantid);
  const username =
    vm.userName ||
    (vm.$store.state.userInfo && vm.$store.state.userInfo.username);

  let res;
  try {
    res = await getWarningPointByWarningid(
      { warningid: warning.id },
      tenantkey,
      tenantid,
      username
    );
  } catch (e) {
    vm.$message({
      message: vm.$t("tet.tet8"),
      type: "warning",
    });
    return null;
  }

  if (!res || res.code != 1001) {
    vm.$message({
      message:
        (vm.$store.state.i18n == "zh" ? res && res.msg : res && res.enMsg) ||
        vm.$t("tet.tet8"),
      type: "error",
    });
    return null;
  }

  const points = Array.isArray(res.data) ? res.data : [];
  if (!points.length) {
    vm.$message({
      message: vm.$t("tet.tet8"),
      type: "warning",
    });
    return null;
  }

  const first = points[0] || {};
  const sosData = {
    ...warning,
    points,
    x: first.x,
    y: first.y,
    gpstime: first.gpstime != null ? first.gpstime : warning.gpstime,
  };
  // 单设备：用点位覆盖设备号/名称；聚集告警 deveui 可能是门限级别，保留告警原文
  if (Number(warning.type) !== 2) {
    if (first.deveui) sosData.deveui = first.deveui;
    if (first.username) sosData.username = first.username;
  }

  vm.$store.commit("changesosData", sosData);
  return { warning: sosData, points, postype: Number(postype) };
}

/** 根据告警与点位构造室内/室外路由 */
export function buildWarningLocationRoute(warning, { active = true } = {}) {
  const postype = Number(warning.postype);
  const isGather = Number(warning.type) === 2;
  const query = { warning: true };
  if (active) query.sostype = true;

  if (postype === 1) {
    if (isGather) {
      return { path: "/location/indoor/locationindoor", query };
    }
    if (warning.devtype == 4) {
      return {
        path: "/location/indoor/locationindoor",
        query: { ...query, tboxDeveui: warning.deveui },
      };
    }
    if (warning.devtype == 3) {
      return {
        path: "/location/indoor/locationindoor",
        query: { ...query, assetDeveui: warning.deveui },
      };
    }
    return {
      path: "/location/indoor/locationindoor",
      query: { ...query, deveui: warning.deveui },
    };
  }

  if (postype === 2) {
    if (isGather) {
      return { path: "/location/outdoor/locationoutdoor", query };
    }
    if (warning.devtype == 4) {
      return {
        path: "/location/outdoor/locationoutdoor",
        query: { ...query, tboxDeveui: warning.deveui },
      };
    }
    return {
      path: "/location/outdoor/locationoutdoor",
      query: { ...query, deveui: warning.deveui },
    };
  }

  // 兜底：有 postype 但非 1/2 时仍进室内（兼容旧聚集逻辑）
  return { path: "/location/indoor/locationindoor", query };
}

/** 入口统一：校验 → 查点 → 跳转 */
export async function jumpToWarningLocation(vm, rawInfo, options = {}) {
  const prepared = await prepareWarningLocation(vm, rawInfo);
  if (!prepared) return false;
  const route = buildWarningLocationRoute(prepared.warning, options);
  vm.$router.push(route);
  return true;
}
