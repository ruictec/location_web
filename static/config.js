/**
 * 运行时可选覆盖（部署后改 dist/static/config.js 无需重新打包）。
 * 日常配置请改：config/app.js
 * 此处留空则使用打包时写入的 config/app.js 值。
 */
window.__RUNTIME_CONFIG__ = {
  // tianditu | osm（非空才覆盖）
  VUE_APP_MAP_PROVIDER: 'tianditu',
  // 天地图 API Key（非空才覆盖）
  VUE_APP_TIANDITU_KEY: '',
}
