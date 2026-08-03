/**
 * 运行时外部配置（部署后可直接修改 dist/static/config.js，无需重新打包）
 * 留空字符串时回退到构建时 .env / 环境变量中的同名配置
 */
window.__RUNTIME_CONFIG__ = {
  // tianditu | osm
  VUE_APP_MAP_PROVIDER: 'tianditu',
  // 天地图 API Key：https://www.tianditu.gov.cn/
  VUE_APP_TIANDITU_KEY: '',
}
