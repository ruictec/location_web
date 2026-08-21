/**
 * 工种/人员地图图标：使用前端 static 目录资源，随包发布。
 */
export function worktypeIconUrl(colour) {
  if (colour !== undefined && colour !== null && String(colour).trim() !== "") {
    return `../../../static/${colour}.png`;
  }
  return "../../../static/user1.png";
}

export function rankIconUrl(name) {
  return `../../../static/rank/${name}`;
}
