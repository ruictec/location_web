import { API_BASE, WS_BASE } from './config/index.js'

// 标准化API地址（确保以/结尾）
const NORMALIZED_API_BASE = API_BASE.endsWith('/') ? API_BASE : (API_BASE + '/')
const NORMALIZED_WS_BASE = WS_BASE.endsWith('/') ? WS_BASE : (WS_BASE + '/')

export default {
    // 说明：开源后地址统一从环境变量读取，默认值使用本地开发地址
    // 1. 后端API地址（用于API调用、文件上传等）
    host: NORMALIZED_API_BASE,
    
    // 2. WebSocket地址（用于实时通信）
    ws: NORMALIZED_WS_BASE,
    
    // 3. 项目内跳转地址（动态获取当前运行地址，无需手动配置）
    beaconUrl: window.location.protocol + "//" + location.host + '/#/beacon',
    projectUrl: window.location.protocol + "//" + location.host + '/#/projectmanagement',
    terminalUrl: window.location.protocol + "//" + location.host + '/#/terminal',
}

