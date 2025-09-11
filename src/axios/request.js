//request.js
import axios from "axios";
import { API_BASE } from "@/config";
/****** 创建axios实例 ******/
const service = axios.create({
    // 说明：开源后统一从环境变量读取服务端地址；
    // 若未设置则回退到你当前线上地址，便于本地调试。
    // 提交开源仓库前，建议在 .env(.local) 中维护，而不是写死在代码里。
    baseURL: API_BASE,
    timeout: 50000  // 请求超时时间
});

/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
    config.method === 'post'
        ? config.data = { ...config.data }
        : config.params = { ...config.params };
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    // config.headers['If-Modified-Since'] = '0';
    // config.headers['Cache-Control'] = 'no-cache';
    // config.headers['Access-Control-Allow-Origin'] = '*';

    return config;
}, error => {  //请求错误处理
    Promise.reject(error)
});

/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
    response => {
        // 成功返回，统一返回 data；如需状态码可在调用处使用 { raw: true }
        return response.data;
    },
    error => {
        // 说明：统一错误处理与提示占位，保持兼容不弹窗，仅输出关键字段
        if (error && error.response) {
            // 可按需接入全局消息组件
            // console.warn('HTTP ERROR:', error.response.status, error.response.data)
        } else {
            // console.warn('NETWORK ERROR:', error.message)
        }
        return Promise.reject(error)
    }
);

export default service;