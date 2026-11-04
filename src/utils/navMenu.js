const ROLE_LABEL_KEYS = {
  1: "usercenter.systemadmin",
  2: "usercenter.systemadmin1",
  3: "usercenter.companyadmin",
  4: "usercenter.companyadmin1",
  5: "usercenter.companyuser",
  6: "usercenter.companyassets",
};

export function roleLabelKey(prionum) {
  return ROLE_LABEL_KEYS[Number(prionum)] || "";
}

export function userInitial(name) {
  const text = String(name || "").trim();
  return text ? text.charAt(0).toUpperCase() : "?";
}
