//api.js
import service from './request'
import axios from 'axios'
import { API_BASE } from '@/config'
// import qs from "qs";

function getTime() {
    let d = new Date();
    let time_A = d.getTime()
    return time_A
}

function encodeUTF8(s) {
    var i, r = [],
        c, x;
    for (i = 0; i < s.length; i++)
        if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
        else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
        else {
            if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
                c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
                    r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
            else r.push(0xE0 + (c >> 12 & 0xF));
            r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
        };
    return r;
}

// 字符串加密成 hex 字符串
function hex_sha1(input) {
    var data = new Uint8Array(encodeUTF8(input))
    var i, j, t;
    var l = ((data.length + 8) >>> 6 << 4) + 16,
        arr = new Uint8Array(l << 2);
    arr.set(new Uint8Array(data.buffer)), arr = new Uint32Array(arr.buffer);
    for (t = new DataView(arr.buffer), i = 0; i < l; i++) arr[i] = t.getUint32(i << 2);
    arr[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    arr[l - 1] = data.length << 3;
    var w = [],
        f = [
            function () { return m[1] & m[2] | ~m[1] & m[3]; },
            function () { return m[1] ^ m[2] ^ m[3]; },
            function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
            function () { return m[1] ^ m[2] ^ m[3]; }
        ],
        rol = function (n, c) { return n << c | n >>> (32 - c); },
        k = [1518500249, 1859775393, -1894007588, -899497514],
        m = [1732584193, -271733879, null, null, -1009589776];
    m[2] = ~m[0], m[3] = ~m[1];
    for (i = 0; i < arr.length; i += 16) {
        var o = m.slice(0);
        for (j = 0; j < 80; j++)
            w[j] = j < 16 ? arr[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
                t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
                m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
        for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
    };
    t = new DataView(new Uint32Array(m).buffer);
    for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

    var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
        return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");
    return hex;
}
export const getUser = (query, tenantkey_A, tenantid_A, username) => { //获取用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getUser" + tenantkey_A + time_A)
    return service({
        url: "service/getUser",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getSchemes = (query, tenantkey_A, tenantid_A, username) => { //获取公司设备制式
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getSchemes" + tenantkey_A + time_A)
    return service({
        url: "service/getSchemes",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const registerUser = (datas, tenantkey_A, tenantid_A, username) => { //注册用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/registerUser" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/registerUser",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const insertUser = (datas, tenantkey_A, tenantid_A, username) => { //添加用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertUser" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertUser",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getCustomerList = (query, tenantkey_A, tenantid_A, username) => { //获取客户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getCustomerList" + tenantkey_A + time_A)
    return service({
        url: "service/getCustomerList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getCustomerUsernameTenantidAll = (query, tenantkey_A, tenantid_A, username) => { //获取客户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getCustomerUsernameTenantidAll" + tenantkey_A + time_A)
    return service({
        url: "service/getCustomerUsernameTenantidAll",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getCustomerName = (query, tenantkey_A, tenantid_A, username) => { //获取客户公司下拉框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getCustomerName" + tenantkey_A + time_A)
    return service({
        url: "service/getCustomerName",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getUserCustomerList = (query, tenantkey_A, tenantid_A, username) => { //获取用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getUserCustomerList" + tenantkey_A + time_A)
    return service({
        url: "service/getUserCustomerList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getUserCustomerOne = (query, tenantkey_A, tenantid_A, username) => { //获取用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getUserCustomerOne" + tenantkey_A + time_A)
    return service({
        url: "service/getUserCustomerOne",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const updateUser = (datas, tenantkey_A, tenantid_A, username) => { //编辑用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateUser" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateUser",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const resetUserkey = (datas, tenantkey_A, tenantid_A, username) => { //重置密码
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/resetUserkey" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/resetUserkey",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delUserByUsername = (datas, tenantkey_A, tenantid_A, username) => { //删除用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delUserByUsername" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delUserByUsername",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const removeUser = (datas, tenantkey_A, tenantid_A, username) => { //删除用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/removeUser" + datas + tenantkey_A + time_A)
    return service({
        url: "service/removeUser",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const loginout = (datas, tenantkey_A, tenantid_A, username) => { //退出
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/loginout" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/loginout",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getCountryList = (query, tenantkey_A, tenantid_A, username) => { //获取用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getCountryList" + tenantkey_A + time_A)
    return service({
        url: "service/getCountryList",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const delCustomer = (datas, tenantkey_A, tenantid_A, username) => { //删除采购公司信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delCustomer" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delCustomer",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getCustomerByTenantid = (query, tenantkey_A, tenantid_A, username) => { //根据tenantid查询客户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getCustomerByTenantid" + tenantkey_A + time_A)
    return service({
        url: "service/getCustomerByTenantid",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const insertCustomer = (datas, tenantkey_A, tenantid_A, username) => { //添加采购公司信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertCustomer" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertCustomer",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const updateCustomer = (datas, tenantkey_A, tenantid_A, username) => { //编辑采购公司信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateCustomer" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateCustomer",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getSysLog = (query, tenantkey_A, tenantid_A, username) => { //查询操作记录信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getSysLog" + tenantkey_A + time_A)
    return service({
        url: "service/getSysLog",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const delSysLog = (datas, tenantkey_A, tenantid_A, username) => { //删除操作记录
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delSysLog" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delSysLog",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getCountry = (query, tenantkey_A, tenantid_A, username) => { //根据国家名称查询国家设备数量信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getCountry" + tenantkey_A + time_A)
    return service({
        url: "service/getCountry",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const updateCountry = (datas, tenantkey_A, tenantid_A, username) => { //根据国家修改设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateCountry" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateCountry",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getProjectList = (query, tenantkey_A, tenantid_A, username) => { //获取项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getProjectList" + tenantkey_A + time_A)
    return service({
        url: "service/getProjectList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getProjectListByTenantid = (query, tenantkey_A, tenantid_A, username) => { //添加用户时获取项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getProjectListByTenantid" + tenantkey_A + time_A)
    return service({
        url: "service/getProjectListByTenantid",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getUsernameByTenantid = (query, tenantkey_A, tenantid_A, username) => { //添加项目的时候获取分配人员下拉框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getUsernameByTenantid" + tenantkey_A + time_A)
    return service({
        url: "service/getUsernameByTenantid",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const addProject = (datas, tenantkey_A, tenantid_A, username) => { //添加项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addProject",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delProject = (datas, tenantkey_A, tenantid_A, username) => { //删除项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delProject",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const updateProject = (datas, tenantkey_A, tenantid_A, username) => { //根据项目编号修改项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateProject",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateProjectByProjectid = (datas, tenantkey_A, tenantid_A, username) => { //根据项目编号修改项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateProjectByProjectid" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateProjectByProjectid",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getMemberList = (query, tenantkey_A, tenantid_A, username) => { //获取员工信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberList" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addMember = (datas, tenantkey_A, tenantid_A, username) => { //添加员工信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addMember",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateMember = (datas, tenantkey_A, tenantid_A, username) => { //根据id修改员工信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateMember",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateMemberRemoveLable = (datas, tenantkey_A, tenantid_A, username) => { //解除和员工绑定的工卡
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateMemberRemoveLable" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateMemberRemoveLable",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delMemberById = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除员工信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delMember",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const addDevToNs = (datas, tenantkey_A, tenantid_A, username) => { //根据设备号将设备同步到Ns服务器
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addDevToNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addDevToNs",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addTenantOperateNs = (datas, tenantkey_A, tenantid_A, username) => { //采购公司页面同步到NS
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addTenantOperateNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addTenantOperateNs",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const addNs = (datas, tenantkey_A, tenantid_A, username) => { //添加NS信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addNs",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getNsList = (query, tenantkey_A, tenantid_A, username) => { //获取NS信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getNsList" + tenantkey_A + time_A)
    return service({
        url: "service/getNsList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getNsAll = (query, tenantkey_A, tenantid_A, username) => { //获取NS信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getNsAll" + tenantkey_A + time_A)
    return service({
        url: "service/getNsAll",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateNs = (datas, tenantkey_A, tenantid_A, username) => { //根据id修改Ns信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateNs",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delNs = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除NS信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delNs",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevCommandList = (query, tenantkey_A, tenantid_A, username) => { //获取下行命令信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevCommandList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevCommandList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delDevCommandById = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除下行命令信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDevCommandById" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delDevCommandById",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getNsConfigList = (query, tenantkey_A, tenantid_A, username) => { //获取NS配置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getNsConfigList" + tenantkey_A + time_A)
    return service({
        url: "service/getNsConfigList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addGateway = (datas, tenantkey_A, tenantid_A, username) => { //添加基站信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addGateway" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addGateway",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delNsConfig = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除ns配置信息 
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delNsConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delNsConfig",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delNsDpConfig = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除ns配置信息 
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delNsDpConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delNsDpConfig",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getGatewayList = (query, tenantkey_A, tenantid_A, username) => { //获取基站信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGatewayList" + tenantkey_A + time_A)
    return service({
        url: "service/getGatewayList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateGateway = (datas, tenantkey_A, tenantid_A, username) => { //根据设备号修改基站信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateGateway" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateGateway",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateGatewayRemoveProject = (datas, tenantkey_A, tenantid_A, username) => { //根据设备号解除项目分配
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateGatewayRemoveProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateGatewayRemoveProject",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delGateway = (datas, tenantkey_A, tenantid_A, username) => { //根据deveui删除基站信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delGateway" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delGateway",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getBeaconList = (query, tenantkey_A, tenantid_A, username) => { //获取信标信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBeaconList" + tenantkey_A + time_A)
    return service({
        url: "service/getBeaconList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addBeacon = (datas, tenantkey_A, tenantid_A, username) => { //添加Beacon信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addBeacon",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateBeaconByBeaconids = (datas, tenantkey_A, tenantid_A, username) => { //企业管理员分配Beacon
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBeaconByBeaconids" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBeaconByBeaconids",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateRemoveProjectByBeaconids = (datas, tenantkey_A, tenantid_A, username) => { //企业管理员解除分配Beacon
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateRemoveProjectByBeaconids" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateRemoveProjectByBeaconids",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateBeacon = (datas, tenantkey_A, tenantid_A, username) => { //根据信标编号修改beacon信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBeacon",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateBeaconList = (datas, tenantkey_A, tenantid_A, username) => { //根据信标编号批量修改beacon信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBeaconList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBeaconList",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delBeacon = (datas, tenantkey_A, tenantid_A, username) => { //根据项目编号删除beacon信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delBeacon",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delBeaconList = (datas, tenantkey_A, tenantid_A, username) => { //批量删除删除beacon信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delBeaconList" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delBeaconList",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addDevList = (datas, tenantkey_A, tenantid_A, username) => { //添加设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addDevList",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addDevListKey = (datas, tenantkey_A, tenantid_A, username) => { //添加设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addDevListKey" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addDevListKey",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevList = (query, tenantkey_A, tenantid_A, username) => { //获取设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateDevList = (datas, tenantkey_A, tenantid_A, username) => { //根据设备号deveui修改设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevList",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevListByDeveuis = (datas, tenantkey_A, tenantid_A, username) => { //分配设备
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevListByDeveuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevListByDeveuis",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevListRemoveProject = (datas, tenantkey_A, tenantid_A, username) => { //解除分配设备
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevListRemoveProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevListRemoveProject",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delDevList = (datas, tenantkey_A, tenantid_A, username) => { //根据deveui删除设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delDevList",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getDevConfigV2 = (query, tenantkey_A, tenantid_A, username) => { //根据设备号查询设备配置的单个信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevConfigV2" + tenantkey_A + time_A)
    return service({
        url: "service/getDevConfigV2",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateDevConfigV2 = (datas, tenantkey_A, tenantid_A, username) => { //根据设备号deveui修改设备配置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevConfigV2" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevConfigV2",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getStatusRecordList = (query, tenantkey_A, tenantid_A, username) => { //获取心跳数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getStatusRecordList" + tenantkey_A + time_A)
    return service({
        url: "service/getStatusRecordList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delStatusRecord = (datas, tenantkey_A, tenantid_A, username) => { //根据信息id删除设备心跳信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delStatusRecord" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delStatusRecord",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getTrackerTestList = (query, tenantkey_A, tenantid_A, username) => { //获取设备测试信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTrackerTestList" + tenantkey_A + time_A)
    return service({
        url: "service/getTrackerTestList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delTrackerTest = (datas, tenantkey_A, tenantid_A, username) => { //根据信息id删除设备测试信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTrackerTest" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delTrackerTest",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delDevRssiById = (datas, tenantkey_A, tenantid_A, username) => { //根据信息id删除设备测试信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDevRssiById" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delDevRssiById",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const updateDevListBatch = (datas, tenantkey_A, tenantid_A, username) => { //批量编辑设备
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevListBatch" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevListBatch",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const delDevListByDeveuis = (datas, tenantkey_A, tenantid_A, username) => { //根据设备id批量删除设备测试信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDevListByDeveuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delDevListByDeveuis",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevConfigV2List = (datas, tenantkey_A, tenantid_A, username) => { //批量编辑设备配置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevConfigV2List" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevConfigV2List",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addMap = (datas, tenantkey_A, tenantid_A, username) => { //添加图片信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addMap" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addMap",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getMapInfoList = (query, tenantkey_A, tenantid_A, username) => { //获取地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMapInfoList" + tenantkey_A + time_A)
    return service({
        url: "service/getMapInfoList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const delMapInfo = (datas, tenantkey_A, tenantid_A, username) => { //根据mapid删除地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delMapInfo",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateMapInfo = (datas, tenantkey_A, tenantid_A, username) => { //编辑地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateMapInfo",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const updateMap = (datas, tenantkey_A, tenantid_A, username) => { //编辑地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateMap" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateMap",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getDevDeveui = (query, tenantkey_A, tenantid_A, username) => { //员工管理页面，只获取设备号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevDeveui" + tenantkey_A + time_A)
    return service({
        url: "service/getDevDeveui",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getBeaconid = (query, tenantkey_A, tenantid_A, username) => { //员工管理页面只获取设备号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBeaconid" + tenantkey_A + time_A)
    return service({
        url: "service/getBeaconid",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getBuildGroundList = (query, tenantkey_A, tenantid_A, username) => { //获取建筑信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBuildGroundList" + tenantkey_A + time_A)
    return service({
        url: "service/getBuildGroundList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getBuildGroundOne = (query, tenantkey_A, tenantid_A, username) => { //获取建筑信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBuildGroundOne" + tenantkey_A + time_A)
    return service({
        url: "service/getBuildGroundOne",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getBuildingByProjectid = (query, tenantkey_A, tenantid_A, username) => { //根据项目编号获取楼栋信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBuildingByProjectid" + tenantkey_A + time_A)
    return service({
        url: "service/getBuildingByProjectid",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const disposeBuildingMsg = (datas, tenantkey_A, tenantid_A, username) => { //添加建筑信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/disposeBuildingMsg" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/disposeBuildingMsg",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addBuildGround = (datas, tenantkey_A, tenantid_A, username) => { //添加建筑信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addBuildGround",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateBuildGround = (datas, tenantkey_A, tenantid_A, username) => { //编辑建筑信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBuildGround",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateBuildGround3D = (datas, tenantkey_A, tenantid_A, username) => { //编辑建筑信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBuildGround3D" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBuildGround3D",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delBuildGround = (datas, tenantkey_A, tenantid_A, username) => { //删除建筑信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delBuildGround",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const sendDownLinkMsg = (datas, tenantkey_A, tenantid_A, username) => { //下行数据操作
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/sendDownLinkMsg" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/sendDownLinkMsg",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getNotice = (query, tenantkey_A, tenantid_A, username) => { //获取通知消息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getNotice" + tenantkey_A + time_A)
    return service({
        url: "service/getNotice",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delNotice = (datas, tenantkey_A, tenantid_A, username) => { //删除通知信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delNotice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delNotice",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateNoticeList = (datas, tenantkey_A, tenantid_A, username) => { //批量修改消息状态
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateNoticeList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateNoticeList",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevPosList = (datas, tenantkey_A, tenantid_A, username) => { //布置反向项目设备
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevPosList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevPosList",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getDevPosList = (query, tenantkey_A, tenantid_A, username) => { //获取查询反向项目设备的位置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevPosList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevPosList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getBeaconPosList = (query, tenantkey_A, tenantid_A, username) => { //获取查询正向设备的位置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBeaconPosList" + tenantkey_A + time_A)
    return service({
        url: "service/getBeaconPosList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateBeaconPosList = (datas, tenantkey_A, tenantid_A, username) => { //布置正向项目设备
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBeaconPosList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBeaconPosList",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getBuildingById = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋编号获取项目名和楼层数
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBuildingById" + tenantkey_A + time_A)
    return service({
        url: "service/getBuildingById",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getGwActiveInfo = (query, tenantkey_A, tenantid_A, username) => { //获取基站的活动信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGwActiveInfo" + tenantkey_A + time_A)
    return service({
        url: "service/getGwActiveInfo",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getGatewayMore = (query, tenantkey_A, tenantid_A, username) => { //获取基站的活动信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGatewayMore" + tenantkey_A + time_A)
    return service({
        url: "service/getGatewayMore",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getDevStatsNum = (query, tenantkey_A, tenantid_A, username) => { //获取基站设备和终端设备的活动数量
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevStatsNum" + tenantkey_A + time_A)
    return service({
        url: "service/getDevStatsNum",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getGwStats = (query, tenantkey_A, tenantid_A, username) => { //获取单个基站处理的数量
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGwStats" + tenantkey_A + time_A)
    return service({
        url: "service/getGwStats",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getGroundList = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取楼层号集合
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGroundList" + tenantkey_A + time_A)
    return service({
        url: "service/getGroundList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addGatewayToNs = (datas, tenantkey_A, tenantid_A, username) => { //根据基站设备号将设备同步到Ns服务器
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addGatewayToNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addGatewayToNs",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};



export const exportDevListInfo = (query, tenantkey_A, tenantid_A, username) => { //导出设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/exportDevListInfo" + tenantkey_A + time_A)
    return service({
        url: "service/exportDevListInfo",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const importDevList = (datas, tenantkey_A, tenantid_A, username) => { //导入设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importDevList",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevGps = (query, tenantkey_A, tenantid_A, username) => { //根据楼层查询定位设备的位置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevGps" + tenantkey_A + time_A)
    return service({
        url: "service/getDevGps",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getLastDevGps = (query, tenantkey_A, tenantid_A, username) => { //查询定位设备的位置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getLastDevGps" + tenantkey_A + time_A)
    return service({
        url: "service/getLastDevGps",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getLastDevGpsByDeveuis = (query, tenantkey_A, tenantid_A, username) => { //按设备号集合查询最后位置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getLastDevGpsByDeveuis" + tenantkey_A + time_A)
    return service({
        url: "service/getLastDevGpsByDeveuis",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getDevGpsList = (query, tenantkey_A, tenantid_A, username) => { //分页查询定位信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevGpsList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevGpsList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getDevGpsOne = (query, tenantkey_A, tenantid_A, username) => { //查询定位信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevGpsOne" + tenantkey_A + time_A)
    return service({
        url: "service/getDevGpsOne",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getDevGpsById = (query, tenantkey_A, tenantid_A, username) => { //根据id定位信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevGpsById" + tenantkey_A + time_A)
    return service({
        url: "service/getDevGpsById",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getDevGpsAction = (query, tenantkey_A, tenantid_A, username) => { //行为分析
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevGpsAction" + tenantkey_A + time_A)
    return service({
        url: "service/getDevGpsAction",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const registerSendMail = (datas, tenantkey_A, tenantid_A, username) => { //重置密码
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/registerSendMail" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/registerSendMail",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const registerUserPwd = (datas, tenantkey_A, tenantid_A, username) => { //布置正向项目设备
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/registerUserPwd" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/registerUserPwd",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateGatewayLocation = (datas, tenantkey_A, tenantid_A, username) => { //根据设备号修改基站位置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateGatewayLocation" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateGatewayLocation",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getFristPage = (query, tenantkey_A, tenantid_A, username) => { //获取首页数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFristPage" + tenantkey_A + time_A)
    return service({
        url: "service/getFristPage",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const delDevGps = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除定位信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDevGps" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delDevGps",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getWarningList = (query, tenantkey_A, tenantid_A, username) => { //获取告警
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarningList" + tenantkey_A + time_A)
    return service({
        url: "service/getWarningList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getWarningNum = (query, tenantkey_A, tenantid_A, username) => { //企业用户获取未处理告警数量
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarningNum" + tenantkey_A + time_A)
    return service({
        url: "service/getWarningNum",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getWarnSos = (query, tenantkey_A, tenantid_A, username) => { //获取SOS
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarnSos" + tenantkey_A + time_A)
    return service({
        url: "service/getWarnSos",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delWarning = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除告警信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delWarning" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delWarning",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getAssetList = (query, tenantkey_A, tenantid_A, username) => { //查询资产信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getAssetList" + tenantkey_A + time_A)
    return service({
        url: "service/getAssetList",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addAsset = (datas, tenantkey_A, tenantid_A, username) => { //添加资产信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addAsset",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const updateAsset = (datas, tenantkey_A, tenantid_A, username) => { //根据id修改资产信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateAsset",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const updateRemoveBeacon = (datas, tenantkey_A, tenantid_A, username) => { //根据ids解除资产与信标的绑定
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateRemoveBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateRemoveBeacon",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delAsset = (datas, tenantkey_A, tenantid_A, username) => { //根据ids删除资产
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delAsset",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getMemberName = (query, tenantkey_A, tenantid_A, username) => { //获取员工姓名与工卡号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberName" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberName",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getBeaconGps = (query, tenantkey_A, tenantid_A, username) => { //反向项目获取室内定位最后一次的位置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBeaconGps" + tenantkey_A + time_A)
    return service({
        url: "service/getBeaconGps",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getAssetName = (query, tenantkey_A, tenantid_A, username) => { //查询资产位置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getAssetName" + tenantkey_A + time_A)
    return service({
        url: "service/getAssetName",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getAssetOne = (query, tenantkey_A, tenantid_A, username) => { //查询单个资产信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getAssetOne" + tenantkey_A + time_A)
    return service({
        url: "service/getAssetOne",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getGround = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取楼层号集合
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGround" + tenantkey_A + time_A)
    return service({
        url: "service/getGround",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateDevBeaconUUID = (datas, tenantkey_A, tenantid_A, username) => { //下行数据操作: 配置定位和资产UUID
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevBeaconUUID" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevBeaconUUID",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateSosWarn = (datas, tenantkey_A, tenantid_A, username) => { //确认SOS信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateSosWarn" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateSosWarn",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevBeaconFilter = (datas, tenantkey_A, tenantid_A, username) => { //下行数据操作: 配置设备的透传数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevBeaconFilter" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevBeaconFilter",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevConfigFilter = (query, tenantkey_A, tenantid_A, username) => { //查询透传数据配置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevConfigFilter" + tenantkey_A + time_A)
    return service({
        url: "service/getDevConfigFilter",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getMemberByWorktypes = (query, tenantkey_A, tenantid_A, username) => { //按分组查询最新人员信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberByWorktypes" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberByWorktypes",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getMemberType = (query, tenantkey_A, tenantid_A, username) => { //查询员工类型
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberType" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberType",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getDepartmentType = (query, tenantkey_A, tenantid_A, username) => { //查询员工部门
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDepartmentType" + tenantkey_A + time_A)
    return service({
        url: "service/getDepartmentType",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getAssetType = (query, tenantkey_A, tenantid_A, username) => { //查询资产类型
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getAssetType" + tenantkey_A + time_A)
    return service({
        url: "service/getAssetType",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getTboxType = (query, tenantkey_A, tenantid_A, username) => { //查询Tbox
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTboxType" + tenantkey_A + time_A)
    return service({
        url: "service/getTboxType",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delMemberType = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除员工类型
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delMemberType" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delMemberType",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delDepartmenType = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除资产类型
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDepartmenType" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delDepartmenType",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delAssetType = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除资产类型
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delAssetType" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delAssetType",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delTboxType = (datas, tenantkey_A, tenantid_A, username) => { //根据id删除Tbox
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTboxType" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delTboxType",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addMemberType = (datas, tenantkey_A, tenantid_A, username) => { //添加员工类型
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addMemberType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addMemberType",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const addDepartmentType = (datas, tenantkey_A, tenantid_A, username) => { //添加员工部门
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addDepartmentType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addDepartmentType",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const addAssetType = (datas, tenantkey_A, tenantid_A, username) => { //添加资产类型
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addAssetType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addAssetType",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const addTboxType = (datas, tenantkey_A, tenantid_A, username) => { //添加Tbox
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addTboxType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addTboxType",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateMemberTypeIcon = (datas, tenantkey_A, tenantid_A, username) => { //g更新图标
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateMemberTypeIcon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateMemberTypeIcon",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getGroundDevNum = (query, tenantkey_A, tenantid_A, username) => { //显示当前楼层人数，不同工种的人数，不同部门的人数，不同类型的资产数
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGroundDevNum" + tenantkey_A + time_A)
    return service({
        url: "service/getGroundDevNum",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getMemberInformation = (query, tenantkey_A, tenantid_A, username) => { //显示当前楼层人数，不同工种的人数，不同部门的人数，不同类型的资产数
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberInformation" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberInformation",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};



export const getQuestion = (query, tenantkey_A, tenantid_A, username) => { //企业用户获取未处理告警数量
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getQuestion" + tenantkey_A + time_A)
    return service({
        url: "service/getQuestion",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addQuestionMapFile = (datas, tenantkey_A, tenantid_A, username) => { //添加工单
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addQuestionMapFile" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addQuestionMapFile",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const insertQuestion = (datas, tenantkey_A, tenantid_A, username) => { //添加工单，没有附件
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertQuestion" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertQuestion",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delQuestion = (datas, tenantkey_A, tenantid_A, username) => { //删除工单信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delQuestion" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delQuestion",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const updateQuestionMapFile = (datas, tenantkey_A, tenantid_A, username) => { //修改工单信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateQuestionMapFile" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateQuestionMapFile",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateQuestion = (datas, tenantkey_A, tenantid_A, username) => { //修改工单信息，没有附件
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateQuestion" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateQuestion",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delFile = (datas, tenantkey_A, tenantid_A, username) => { //删除工单信息附件
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delFile" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delFile",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addDevOtaMapFile = (formData) => { //上传OTA文件
    const baseURL = API_BASE.endsWith('/') ? API_BASE : (API_BASE + '/')
    return axios({
        baseURL,
        url: "service/addDevOtaMapFile",
        method: 'post',
        data: formData,
        timeout: 50000
    }).then(res => res.data)
};

export const delDevOta = (datas, tenantkey_A, tenantid_A, username) => { //删除OTA文件
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDevOta" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delDevOta",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevOta = (datas, tenantkey_A, tenantid_A, username) => { //编辑OTA文件
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevOta" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevOta",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevOtaMapFileList = (query) => { //分页查询OTA文件
    return service({
        url: "service/getDevOtaMapFileList",
        method: 'get',
        params: query
    }).then(res => res)
};

export const insertNoticeList = (datas, tenantkey_A, tenantid_A, username) => { //批量添加通知消息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertNoticeList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertNoticeList",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateQuestionStatus = (datas, tenantkey_A, tenantid_A, username) => { //关闭工单
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateQuestionStatus" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateQuestionStatus",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getMsgBoard = (query, tenantkey_A, tenantid_A, username) => { //根据工单编号查询留言信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMsgBoard" + tenantkey_A + time_A)
    return service({
        url: "service/getMsgBoard",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const insertMsgBoard = (datas, tenantkey_A, tenantid_A, username) => { //添加留言信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertMsgBoard" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertMsgBoard",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getQuestionOne = (query, tenantkey_A, tenantid_A, username) => { //查询单个工单信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getQuestionOne" + tenantkey_A + time_A)
    return service({
        url: "service/getQuestionOne",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateClockin = (datas, tenantkey_A, tenantid_A, username) => { //设置打卡点
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateClockin" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateClockin",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};



export const getTranche = (query, tenantkey_A, tenantid_A, username) => { //获取区域数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTranche" + tenantkey_A + time_A)
    return service({
        url: "service/getTranche",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addTranche = (datas, tenantkey_A, tenantid_A, username) => { //添加区域
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addTranche",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const delTranche = (datas, tenantkey_A, tenantid_A, username) => { //删除区域
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTranche" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delTranche",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevListTranche = (datas, tenantkey_A, tenantid_A, username) => { //批量分配设备组别
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevListTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevListTranche",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const removeDevTranche = (datas, tenantkey_A, tenantid_A, username) => { //批量解除设备组别
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/removeDevTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/removeDevTranche",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const updateBeaconTranche = (datas, tenantkey_A, tenantid_A, username) => { //批量分配设备组别(信标)
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBeaconTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBeaconTranche",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const removeBeaconTranche = (datas, tenantkey_A, tenantid_A, username) => { //批量解除设备组别(信标)
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/removeBeaconTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/removeBeaconTranche",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};





export const delAttendance = (datas, tenantkey_A, tenantid_A, username) => { //删除考勤信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delAttendance" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delAttendance",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getAttendanceList = (query, tenantkey_A, tenantid_A, username) => { //获取区域数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getAttendanceList" + tenantkey_A + time_A)
    return service({
        url: "service/getAttendanceList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
export const getDevNum = (query, tenantkey_A, tenantid_A, username) => { //获取区域数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevNum" + tenantkey_A + time_A)
    return service({
        url: "service/getDevNum",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
export const getTaskInfoList = (query, tenantkey_A, tenantid_A, username) => { //获取巡检历史信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTaskInfoList" + tenantkey_A + time_A)
    return service({
        url: "service/getTaskInfoList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getTaskInfoTimeList = (query, tenantkey_A, tenantid_A, username) => { //获取巡检历史信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTaskInfoTimeList" + tenantkey_A + time_A)
    return service({
        url: "service/getTaskInfoTimeList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getLocateTaskList = (query, tenantkey_A, tenantid_A, username) => { //获取定位任务列表
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getLocateTaskList" + tenantkey_A + time_A)
    return service({
        url: "service/getLocateTaskList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const insertLocateTask = (datas, tenantkey_A, tenantid_A, username) => { //添加定位任务
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertLocateTask" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertLocateTask",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delLocateTask = (datas, tenantkey_A, tenantid_A, username) => { //删除定位任务
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delLocateTask" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delLocateTask",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateLocateTask = (datas, tenantkey_A, tenantid_A, username) => { //修改定位任务
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateLocateTask" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateLocateTask",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateLocateTaskStatus = (datas, tenantkey_A, tenantid_A, username) => { //更新定位任务状态
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateLocateTaskStatus" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateLocateTaskStatus",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const extendLocateTaskEndtime = (datas, tenantkey_A, tenantid_A, username) => { //定位任务加时
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/extendLocateTaskEndtime" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/extendLocateTaskEndtime",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getTaskManagementList = (query, tenantkey_A, tenantid_A, username) => { //获取巡检任务信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTaskManagementList" + tenantkey_A + time_A)
    return service({
        url: "service/getTaskManagementList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const insertTaskManagement = (datas, tenantkey_A, tenantid_A, username) => { //添加巡检任务
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertTaskManagement" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertTaskManagement",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};



export const delTaskInfo = (datas, tenantkey_A, tenantid_A, username) => { //批量删除巡检历史信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTaskInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delTaskInfo",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delTaskManagement = (datas, tenantkey_A, tenantid_A, username) => { //批量删除巡检历史信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTaskManagement" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delTaskManagement",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateTaskManagement = (datas, tenantkey_A, tenantid_A, username) => { //修改任务信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateTaskManagement" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateTaskManagement",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const removeTaskManagementDetails = (datas, tenantkey_A, tenantid_A, username) => { //解除路线设置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/removeTaskManagementDetails" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/removeTaskManagementDetails",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateTaskManagementStats = (datas, tenantkey_A, tenantid_A, username) => { //修改任务的状态
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateTaskManagementStats" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateTaskManagementStats",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateMemberTask = (datas, tenantkey_A, tenantid_A, username) => { //根据员工id分配或解除任务
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateMemberTask" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateMemberTask",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getMemberNameId = (query, tenantkey_A, tenantid_A, username) => { //查询员工姓名、id号、标签号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberNameId" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberNameId",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getTaskNameId = (query, tenantkey_A, tenantid_A, username) => { //查询员工姓名、id号、标签号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTaskNameId" + tenantkey_A + time_A)
    return service({
        url: "service/getTaskNameId",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getMemberByTaskid = (query, tenantkey_A, tenantid_A, username) => { //根据任务查询人员
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberByTaskid" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberByTaskid",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateTaskManagementDetails = (datas, tenantkey_A, tenantid_A, username) => { //修改任务管理详情
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateTaskManagementDetails" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateTaskManagementDetails",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getBeaconByBeaconids = (query, tenantkey_A, tenantid_A, username) => { //查询巡检任务详情
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBeaconByBeaconids" + tenantkey_A + time_A)
    return service({
        url: "service/getBeaconByBeaconids",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getDevByEuiList = (query, tenantkey_A, tenantid_A, username) => { //查询巡检任务详情
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevByEuiList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevByEuiList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};



export const getFristPageAdmin = (query, tenantkey_A, tenantid_A, username) => { //查询巡检任务详情
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFristPageAdmin" + tenantkey_A + time_A)
    return service({
        url: "service/getFristPageAdmin",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getFristPageUserDevUtil = (query, tenantkey_A, tenantid_A, username) => { //查询巡检任务详情
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFristPageUserDevUtil" + tenantkey_A + time_A)
    return service({
        url: "service/getFristPageUserDevUtil",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateDevListToGwClockin = (datas, tenantkey_A, tenantid_A, username) => { //设置打卡点
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevListToGwClockin" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevListToGwClockin",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateBuildingOne = (datas, tenantkey_A, tenantid_A, username) => { //修改楼栋信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBuildingOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBuildingOne",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getFristPageUserMapUtil = (query, tenantkey_A, tenantid_A, username) => { //查询巡检任务详情
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFristPageUserMapUtil" + tenantkey_A + time_A)
    return service({
        url: "service/getFristPageUserMapUtil",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const superLogin = (datas, tenantkey_A, tenantid_A, username) => { //退出
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/superLogin" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/superLogin",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getWarningConfigList = (query, tenantkey_A, tenantid_A, username) => { //查询告警设置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarningConfigList" + tenantkey_A + time_A)
    return service({
        url: "service/getWarningConfigList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const addWarningConfig = (datas, tenantkey_A, tenantid_A, username) => { //添加告警设置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addWarningConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addWarningConfig",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delWarningConfig = (datas, tenantkey_A, tenantid_A, username) => { //批量删除告警设置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delWarningConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delWarningConfig",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateWarningConfig = (datas, tenantkey_A, tenantid_A, username) => { //修改告警设置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateWarningConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateWarningConfig",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getTrancheByIds = (query, tenantkey_A, tenantid_A, username) => { //查询统计分组类别
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTrancheByIds" + tenantkey_A + time_A)
    return service({
        url: "service/getTrancheByIds",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateTaskManagementUsers = (datas, tenantkey_A, tenantid_A, username) => { //根据员工id分配或解除任务
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateTaskManagementUsers" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateTaskManagementUsers",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getMemberByIds = (query, tenantkey_A, tenantid_A, username) => { //查询统计分组类别
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberByIds" + tenantkey_A + time_A)
    return service({
        url: "service/getMemberByIds",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateAnglimit = (datas, tenantkey_A, tenantid_A, username) => { //设置扫描区域
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateAnglimit" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateAnglimit",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevListToGwAnglimit = (datas, tenantkey_A, tenantid_A, username) => { //批量编辑设备
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevListToGwAnglimit" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevListToGwAnglimit",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateHistoryBleConfig = (datas, tenantkey_A, tenantid_A, username) => { //可重传信标列表
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateHistoryBleConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateHistoryBleConfig",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const replaceMapInfo = (datas, tenantkey_A, tenantid_A, username) => { //修改楼层地图
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/replaceMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/replaceMapInfo",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateNearBeacons = (datas, tenantkey_A, tenantid_A, username) => { //设置/解除信标的相邻信标
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateNearBeacons" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateNearBeacons",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const addTrancheSub = (datas, tenantkey_A, tenantid_A, username) => { //添加子区域
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addTrancheSub" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addTrancheSub",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const getTrancheSubAndNearList = (query, tenantkey_A, tenantid_A, username) => { //获取子区域
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTrancheSubAndNearList" + tenantkey_A + time_A)
    return service({
        url: "service/getTrancheSubAndNearList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
export const delTrancheSubById = (datas, tenantkey_A, tenantid_A, username) => { //删除子区域
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTrancheSubById" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delTrancheSubById",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addTrancheNearSub = (datas, tenantkey_A, tenantid_A, username) => { //添加相邻点
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addTrancheNearSub" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addTrancheNearSub",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const getTrancheNearSubList = (query, tenantkey_A, tenantid_A, username) => { //获取相邻点
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTrancheNearSubList" + tenantkey_A + time_A)
    return service({
        url: "service/getTrancheNearSubList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delTrancheNearSubBySubtranchid = (datas, tenantkey_A, tenantid_A, username) => { //删除相邻点
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTrancheNearSubBySubtranchid" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delTrancheNearSubBySubtranchid",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getTrancheAndSubList = (query, tenantkey_A, tenantid_A, username) => { //获取区域数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTrancheAndSubList" + tenantkey_A + time_A)
    return service({
        url: "service/getTrancheAndSubList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
export const getTrancheSubList = (query, tenantkey_A, tenantid_A, username) => { //获取区域数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTrancheSubList" + tenantkey_A + time_A)
    return service({
        url: "service/getTrancheSubList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getFristPageUserUtil = (query, tenantkey_A, tenantid_A, username) => { //用户首页数据
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFristPageUserUtil" + tenantkey_A + time_A)
    return service({
        url: "service/getFristPageUserUtil",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getWarnWeekNumList = (query, tenantkey_A, tenantid_A, username) => { //查询七天内某种告警类型的每一天的告警情况
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarnWeekNumList" + tenantkey_A + time_A)
    return service({
        url: "service/getWarnWeekNumList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addTbox = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addTbox",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getTboxList = (query, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTboxList" + tenantkey_A + time_A)
    return service({
        url: "service/getTboxList",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateTbox = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateTbox",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delTbox = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delTbox",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateTboxRemoveLable = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateTboxRemoveLable" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateTboxRemoveLable",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getTboxSnId = (query, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTboxSnId" + tenantkey_A + time_A)
    return service({
        url: "service/getTboxSnId",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getTboxOne = (query, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTboxOne" + tenantkey_A + time_A)
    return service({
        url: "service/getTboxOne",
        method: 'get',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addMapInfo = (datas, tenantkey_A, tenantid_A, username) => { //添加地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addMapInfo",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const getMapidByBuildid = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取地图编号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMapidByBuildid" + tenantkey_A + time_A)
    return service({
        url: "service/getMapidByBuildid",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
export const getGroundDevGps = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取地图编号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGroundDevGps" + tenantkey_A + time_A)
    return service({
        url: "service/getGroundDevGps",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
export const getCountNum = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取地图编号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getCountNum" + tenantkey_A + time_A)
    return service({
        url: "service/getCountNum",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
// export const getMemberByEuis = (datas, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取地图编号
//     let time_A = getTime()
//     let sha_A = hex_sha1("/v1/service/getMemberByEuis" +JSON.stringify(datas)+ tenantkey_A + time_A)
//     return service({
//         url: "service/getMemberByEuis",
//         method: 'post',
//         processData: false,
//         headers: {
//             ts: time_A,
//             siginfo: sha_A,
//             tenantid: tenantid_A,
//             username: username
//         },
//         params: datas
//     }).then(res => res)
// };
export const getMemberByEuis = (datas, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取地图编号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getMemberByEuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/getMemberByEuis",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
// export const addPoint = (datas, tenantkey_A, tenantid_A, username) => { //添加地图信息
//     let time_A = getTime()
//     let sha_A = hex_sha1("/v1/service/addPoint" + JSON.stringify(datas) + tenantkey_A + time_A)
//     return service({
//         url: "service/addPoint",
//         method: 'post',
//         processData: false,
//         headers: {
//             ts: time_A,
//             siginfo: sha_A,
//             tenantid: tenantid_A,
//             username: username
//         },
//         data: datas
//     }).then(res => res)
// };

export const getTboxByEuis = (datas, tenantkey_A, tenantid_A, username) => { //
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getTboxByEuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/getTboxByEuis",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getAssetByEuis = (datas, tenantkey_A, tenantid_A, username) => { //
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getAssetByEuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/getAssetByEuis",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addPoint = (datas, tenantkey_A, tenantid_A, username) => { //添加地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addPoint" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addPoint",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const delPointByPointid = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delPointByPointid" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delPointByPointid",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const updatePoint = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updatePoint" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updatePoint",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getPointList = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取地图编号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getPointList" + tenantkey_A + time_A)
    return service({
        url: "service/getPointList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getPointNearList = (query, tenantkey_A, tenantid_A, username) => { //根据楼栋号获取地图编号
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getPointNearList" + tenantkey_A + time_A)
    return service({
        url: "service/getPointNearList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const addPointNear = (datas, tenantkey_A, tenantid_A, username) => { //添加地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addPointNear" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addPointNear",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const getPointAndNearList = (query, tenantkey_A, tenantid_A, username) => { //查询点及相邻点的信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getPointAndNearList" + tenantkey_A + time_A)
    return service({
        url: "service/getPointAndNearList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delPointNearByPointid = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delPointNearByPointid" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delPointNearByPointid",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateBeaconPosOne = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateBeaconPosOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateBeaconPosOne",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addBuilding = (datas, tenantkey_A, tenantid_A, username) => { //添加楼栋信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addBuilding" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addBuilding",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delBuilding = (datas, tenantkey_A, tenantid_A, username) => { //删除楼栋信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delBuilding" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delBuilding",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getBuildingList = (query, tenantkey_A, tenantid_A, username) => { //查询楼栋信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getBuildingList" + tenantkey_A + time_A)
    return service({
        url: "service/getBuildingList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateDevListPosOne = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevListPosOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevListPosOne",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateProjectPosition = (datas, tenantkey_A, tenantid_A, username) => { //根据项目编号修改项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateProjectPosition" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateProjectPosition",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevGpsByGroup = (query, tenantkey_A, tenantid_A, username) => { //行为分析
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevGpsByGroup" + tenantkey_A + time_A)
    return service({
        url: "service/getDevGpsByGroup",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getNsAllName = (query, tenantkey_A, tenantid_A, username) => { //获取NS信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getNsAllName" + tenantkey_A + time_A)
    return service({
        url: "service/getNsAllName",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getProjectConfigOne = (query, tenantkey_A, tenantid_A, username) => { //获取项目功能配置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getProjectConfigOne" + tenantkey_A + time_A)
    return service({
        url: "service/getProjectConfigOne",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateProjectConfig = (datas, tenantkey_A, tenantid_A, username) => { //修改项目功能配置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateProjectConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateProjectConfig",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const addCustomerToMysql = (datas, tenantkey_A, tenantid_A, username) => { //添加采购公司信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addCustomerToMysql" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addCustomerToMysql",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getGatewayFlow = (query, tenantkey_A, tenantid_A, username) => { //查询基站4G卡的流量
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getGatewayFlow" + tenantkey_A + time_A)
    return service({
        url: "service/getGatewayFlow",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const removeGroundDev = (datas, tenantkey_A, tenantid_A, username) => {//一键解除布置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/removeGroundDev" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/removeGroundDev",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const insertWarningVoice = (datas, tenantkey_A, tenantid_A, username) => { //添加告警设置
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertWarningVoice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertWarningVoice",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const delWarningVoice = (datas, tenantkey_A, tenantid_A, username) => { //批量删除告警设置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delWarningVoice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delWarningVoice",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getWarningVoiceList = (query, tenantkey_A, tenantid_A, username) => { //查询告警设置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarningVoiceList" + tenantkey_A + time_A)
    return service({
        url: "service/getWarningVoiceList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const updateWarningVoice = (datas, tenantkey_A, tenantid_A, username) => { //修改告警设置信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateWarningVoice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateWarningVoice",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const addDevOther = (datas, tenantkey_A, tenantid_A, username) => { //添加Aoa信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/addDevOther" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/addDevOther",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevOtherList = (query, tenantkey_A, tenantid_A, username) => { //获取Aoa信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevOtherList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevOtherList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delDevOtherByDeveuis = (datas, tenantkey_A, tenantid_A, username) => { //批量删除删除Aoa信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delDevOtherByDeveuis" + datas + tenantkey_A + time_A)
    return service({
        url: "service/delDevOtherByDeveuis",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevOther = (datas, tenantkey_A, tenantid_A, username) => { //根据信标编号修改Aoa信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevOther" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevOther",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevOtherByDeveuis = (datas, tenantkey_A, tenantid_A, username) => { //企业管理员分配Beacon
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevOtherByDeveuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevOtherByDeveuis",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevOtherRemoveProject = (datas, tenantkey_A, tenantid_A, username) => { //企业管理员解除分配Beacon
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevOtherRemoveProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevOtherRemoveProject",
        method: 'put',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getDevAndOtherList = (query, tenantkey_A, tenantid_A, username) => { //查询基站4G卡的流量
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevAndOtherList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevAndOtherList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};
export const getDevRssiList = (query, tenantkey_A, tenantid_A, username) => { //查询基站4G卡的流量
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getDevRssiList" + tenantkey_A + time_A)
    return service({
        url: "service/getDevRssiList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateDevOtherPosOne = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevOtherPosOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevOtherPosOne",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const sendDevOtherAlarmOne = (datas, tenantkey_A, tenantid_A, username) => { //根据设备号触发或取消告警
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/sendDevOtherAlarmOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/sendDevOtherAlarmOne",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const sendDevOtherAlarmMore = (datas, tenantkey_A, tenantid_A, username) => { //根据楼栋层触发或取消告警
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/sendDevOtherAlarmMore" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/sendDevOtherAlarmMore",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const insertCustomerConfig = (datas, tenantkey_A, tenantid_A, username) => { //注册用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/insertCustomerConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/insertCustomerConfig",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};
export const delCustomerConfig = (datas, tenantkey_A, tenantid_A, username) => { //删除用户信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delCustomerConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delCustomerConfig",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const updateDevOtherTranche = (datas, tenantkey_A, tenantid_A, username) => {
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateDevOtherTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateDevOtherTranche",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getWarnNumList = (query, tenantkey_A, tenantid_A, username) => { //查询七天内某种告警类型的每一天的告警情况
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarnNumList" + tenantkey_A + time_A)
    return service({
        url: "service/getWarnNumList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getWarningPopoutList = (query, tenantkey_A, tenantid_A, username) => { //获取告警弹框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getWarningPopoutList" + tenantkey_A + time_A)
    return service({
        url: "service/getWarningPopoutList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const updateProjectMosaic = (datas, tenantkey_A, tenantid_A, username) => { //开启关闭嵌入页面功能
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateProjectMosaic" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateProjectMosaic",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getProjectFirstList = (query, tenantkey_A, tenantid_A, username) => { //获取项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getProjectFirstList" + tenantkey_A + time_A)
    return service({
        url: "service/getProjectFirstList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const exportBeaconInfo = (query, tenantkey_A, tenantid_A, username) => { //导出设备信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/exportBeaconInfo" + tenantkey_A + time_A)
    return service({
        url: "service/exportBeaconInfo",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const importTbox = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importTbox",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importAsset = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importAsset",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importMember = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importMember",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importTranche = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importTranche",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importPointNear = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importPointNear" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importPointNear",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importPoint = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importPoint" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importPoint",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importBuildGround = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importBuildGround",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importBuilding = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importBuilding" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importBuilding",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importProject = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importProject",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importCustomer = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importCustomer" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importCustomer",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importBeacon = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importBeacon",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};


export const updateProjectUnbind = (datas, tenantkey_A, tenantid_A, username) => { //根据项目编号修改项目信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateProjectUnbind" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateProjectUnbind",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const importBranch = (datas, tenantkey_A, tenantid_A, username) => { //导入信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/importBranch" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/importBranch",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const fenceManage = (datas, tenantkey_A, tenantid_A, username) => { //添加图片信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/fenceManage" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/fenceManage",
        method: 'post',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getFenceManageAndPointList = (query, tenantkey_A, tenantid_A, username) => { //获取电子围栏
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFenceManageAndPointList" + tenantkey_A + time_A)
    return service({
        url: "service/getFenceManageAndPointList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getFenceManageAndPointListByPage = (query, tenantkey_A, tenantid_A, username) => { //获取电子围栏（有分页数据）
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFenceManageAndPointListByPage" + tenantkey_A + time_A)
    return service({
        url: "service/getFenceManageAndPointListByPage",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delFenceManage = (datas, tenantkey_A, tenantid_A, username) => { //根据mapid删除地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delFenceManage" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delFenceManage",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getFenceManageList = (query, tenantkey_A, tenantid_A, username) => { //获取告警弹框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFenceManageList" + tenantkey_A + time_A)
    return service({
        url: "service/getFenceManageList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getFenceManageByIds = (query, tenantkey_A, tenantid_A, username) => { //根据id查询电子围栏信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFenceManageByIds" + tenantkey_A + time_A)
    return service({
        url: "service/getFenceManageByIds",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getFenceManageAndPointByIds = (query, tenantkey_A, tenantid_A, username) => { //根据id查询电子围栏及坐标点
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFenceManageAndPointByIds" + tenantkey_A + time_A)
    return service({
        url: "service/getFenceManageAndPointByIds",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const getFenceManageWhiteList = (query, tenantkey_A, tenantid_A, username) => { //获取告警弹框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFenceManageWhiteList" + tenantkey_A + time_A)
    return service({
        url: "service/getFenceManageWhiteList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const updateFenceManage = (datas, tenantkey_A, tenantid_A, username) => { //根据围栏id修改围栏信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/updateFenceManage" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/updateFenceManage",
        method: 'put',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};

export const getFenceManageWhiteNum = (query, tenantkey_A, tenantid_A, username) => { //获取告警弹框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getFenceManageWhiteNum" + tenantkey_A + time_A)
    return service({
        url: "service/getFenceManageWhiteNum",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};



export const getNsTenantInfoList = (query, tenantkey_A, tenantid_A, username) => { //查询Tenant信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getNsTenantInfoList" + tenantkey_A + time_A)
    return service({
        url: "service/getNsTenantInfoList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getNsDeviceInfoList = (query, tenantkey_A, tenantid_A, username) => { //查询NsDeviceInfo信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getNsDeviceInfoList" + tenantkey_A + time_A)
    return service({
        url: "service/getNsDeviceInfoList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};


export const getApplicationList = (query, tenantkey_A, tenantid_A, username) => { //查询application现信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/getApplicationList" + tenantkey_A + time_A)
    return service({
        url: "service/getApplicationList",
        method: 'get',
        processData: false,
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        params: query
    }).then(res => res)
};

export const delTenantOperateNs = (datas, tenantkey_A, tenantid_A, username) => { //删除Tenant信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/service/delTenantOperateNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "service/delTenantOperateNs",
        method: 'delete',
        headers: {
            ts: time_A,
            siginfo: sha_A,
            tenantid: tenantid_A,
            username: username
        },
        data: datas
    }).then(res => res)
};