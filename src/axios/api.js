//api.js
import service from './request'
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
    let sha_A = hex_sha1("/v1/user/getUser" + tenantkey_A + time_A)
    return service({
        url: "user/getUser",
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
    let sha_A = hex_sha1("/v1/user/getSchemes" + tenantkey_A + time_A)
    return service({
        url: "user/getSchemes",
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
    let sha_A = hex_sha1("/v1/user/registerUser" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/registerUser",
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
    let sha_A = hex_sha1("/v1/user/insertUser" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/insertUser",
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
    let sha_A = hex_sha1("/v1/user/getCustomerList" + tenantkey_A + time_A)
    return service({
        url: "user/getCustomerList",
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
    let sha_A = hex_sha1("/v1/user/getCustomerUsernameTenantidAll" + tenantkey_A + time_A)
    return service({
        url: "user/getCustomerUsernameTenantidAll",
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
    let sha_A = hex_sha1("/v1/user/getCustomerName" + tenantkey_A + time_A)
    return service({
        url: "user/getCustomerName",
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
    let sha_A = hex_sha1("/v1/user/getUserCustomerList" + tenantkey_A + time_A)
    return service({
        url: "user/getUserCustomerList",
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
    let sha_A = hex_sha1("/v1/user/getUserCustomerOne" + tenantkey_A + time_A)
    return service({
        url: "user/getUserCustomerOne",
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
    let sha_A = hex_sha1("/v1/user/updateUser" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateUser",
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
    let sha_A = hex_sha1("/v1/user/resetUserkey" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/resetUserkey",
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
    let sha_A = hex_sha1("/v1/user/delUserByUsername" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delUserByUsername",
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
    let sha_A = hex_sha1("/v1/user/removeUser" + datas + tenantkey_A + time_A)
    return service({
        url: "user/removeUser",
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
    let sha_A = hex_sha1("/v1/user/loginout" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/loginout",
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
    let sha_A = hex_sha1("/v1/user/getCountryList" + tenantkey_A + time_A)
    return service({
        url: "user/getCountryList",
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
    let sha_A = hex_sha1("/v1/user/delCustomer" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delCustomer",
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
    let sha_A = hex_sha1("/v1/user/getCustomerByTenantid" + tenantkey_A + time_A)
    return service({
        url: "user/getCustomerByTenantid",
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
    let sha_A = hex_sha1("/v1/user/insertCustomer" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/insertCustomer",
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
    let sha_A = hex_sha1("/v1/user/updateCustomer" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateCustomer",
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
    let sha_A = hex_sha1("/v1/user/getSysLog" + tenantkey_A + time_A)
    return service({
        url: "user/getSysLog",
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
    let sha_A = hex_sha1("/v1/user/delSysLog" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delSysLog",
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
    let sha_A = hex_sha1("/v1/user/getCountry" + tenantkey_A + time_A)
    return service({
        url: "user/getCountry",
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
    let sha_A = hex_sha1("/v1/user/updateCountry" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateCountry",
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
    let sha_A = hex_sha1("/v1/user/getProjectList" + tenantkey_A + time_A)
    return service({
        url: "user/getProjectList",
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
    let sha_A = hex_sha1("/v1/user/getProjectListByTenantid" + tenantkey_A + time_A)
    return service({
        url: "user/getProjectListByTenantid",
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
    let sha_A = hex_sha1("/v1/user/getUsernameByTenantid" + tenantkey_A + time_A)
    return service({
        url: "user/getUsernameByTenantid",
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
    let sha_A = hex_sha1("/v1/user/addProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addProject",
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
    let sha_A = hex_sha1("/v1/user/delProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/delProject",
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
    let sha_A = hex_sha1("/v1/user/updateProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateProject",
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
    let sha_A = hex_sha1("/v1/user/updateProjectByProjectid" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateProjectByProjectid",
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
    let sha_A = hex_sha1("/v1/user/getMemberList" + tenantkey_A + time_A)
    return service({
        url: "user/getMemberList",
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
    let sha_A = hex_sha1("/v1/user/addMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addMember",
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
    let sha_A = hex_sha1("/v1/user/updateMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateMember",
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
    let sha_A = hex_sha1("/v1/user/updateMemberRemoveLable" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateMemberRemoveLable",
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
    let sha_A = hex_sha1("/v1/user/delMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/delMember",
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
    let sha_A = hex_sha1("/v1/devices/addDevToNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addDevToNs",
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
    let sha_A = hex_sha1("/v1/devices/addTenantOperateNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addTenantOperateNs",
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
    let sha_A = hex_sha1("/v1/devices/addNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addNs",
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
    let sha_A = hex_sha1("/v1/devices/getNsList" + tenantkey_A + time_A)
    return service({
        url: "devices/getNsList",
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
    let sha_A = hex_sha1("/v1/devices/getNsAll" + tenantkey_A + time_A)
    return service({
        url: "devices/getNsAll",
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
    let sha_A = hex_sha1("/v1/devices/updateNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateNs",
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
    let sha_A = hex_sha1("/v1/devices/delNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delNs",
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
    let sha_A = hex_sha1("/v1/devices/getDevCommandList" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevCommandList",
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
    let sha_A = hex_sha1("/v1/devices/delDevCommandById" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delDevCommandById",
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
    let sha_A = hex_sha1("/v1/devices/getNsConfigList" + tenantkey_A + time_A)
    return service({
        url: "devices/getNsConfigList",
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
    let sha_A = hex_sha1("/v1/devices/addGateway" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addGateway",
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
    let sha_A = hex_sha1("/v1/devices/delNsConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delNsConfig",
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
    let sha_A = hex_sha1("/v1/devices/delNsDpConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delNsDpConfig",
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
    let sha_A = hex_sha1("/v1/devices/getGatewayList" + tenantkey_A + time_A)
    return service({
        url: "devices/getGatewayList",
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
    let sha_A = hex_sha1("/v1/devices/updateGateway" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateGateway",
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
    let sha_A = hex_sha1("/v1/devices/updateGatewayRemoveProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateGatewayRemoveProject",
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
    let sha_A = hex_sha1("/v1/devices/delGateway" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delGateway",
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
    let sha_A = hex_sha1("/v1/devices/getBeaconList" + tenantkey_A + time_A)
    return service({
        url: "devices/getBeaconList",
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
    let sha_A = hex_sha1("/v1/devices/addBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addBeacon",
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
    let sha_A = hex_sha1("/v1/devices/updateBeaconByBeaconids" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateBeaconByBeaconids",
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
    let sha_A = hex_sha1("/v1/devices/updateRemoveProjectByBeaconids" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateRemoveProjectByBeaconids",
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
    let sha_A = hex_sha1("/v1/devices/updateBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateBeacon",
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
    let sha_A = hex_sha1("/v1/devices/updateBeaconList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateBeaconList",
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
    let sha_A = hex_sha1("/v1/devices/delBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delBeacon",
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
    let sha_A = hex_sha1("/v1/devices/delBeaconList" + datas + tenantkey_A + time_A)
    return service({
        url: "devices/delBeaconList",
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
    let sha_A = hex_sha1("/v1/devices/addDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addDevList",
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
    let sha_A = hex_sha1("/v1/devices/addDevListKey" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addDevListKey",
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
    let sha_A = hex_sha1("/v1/devices/getDevList" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevList",
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
    let sha_A = hex_sha1("/v1/devices/updateDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevList",
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
    let sha_A = hex_sha1("/v1/devices/updateDevListByDeveuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevListByDeveuis",
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
    let sha_A = hex_sha1("/v1/devices/updateDevListRemoveProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevListRemoveProject",
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
    let sha_A = hex_sha1("/v1/devices/delDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delDevList",
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
    let sha_A = hex_sha1("/v1/devices/getDevConfigV2" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevConfigV2",
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
    let sha_A = hex_sha1("/v1/devices/updateDevConfigV2" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevConfigV2",
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
    let sha_A = hex_sha1("/v1/devices/getStatusRecordList" + tenantkey_A + time_A)
    return service({
        url: "devices/getStatusRecordList",
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
    let sha_A = hex_sha1("/v1/devices/delStatusRecord" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delStatusRecord",
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
    let sha_A = hex_sha1("/v1/devices/getTrackerTestList" + tenantkey_A + time_A)
    return service({
        url: "devices/getTrackerTestList",
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
    let sha_A = hex_sha1("/v1/devices/delTrackerTest" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delTrackerTest",
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
    let sha_A = hex_sha1("/v1/devices/delDevRssiById" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delDevRssiById",
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
    let sha_A = hex_sha1("/v1/devices/updateDevListBatch" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevListBatch",
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
    let sha_A = hex_sha1("/v1/devices/delDevListByDeveuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delDevListByDeveuis",
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
    let sha_A = hex_sha1("/v1/devices/updateDevConfigV2List" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevConfigV2List",
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
    let sha_A = hex_sha1("/v1/map/addMap" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addMap",
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
    let sha_A = hex_sha1("/v1/map/getMapInfoList" + tenantkey_A + time_A)
    return service({
        url: "map/getMapInfoList",
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
    let sha_A = hex_sha1("/v1/map/delMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delMapInfo",
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
    let sha_A = hex_sha1("/v1/map/updateMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateMapInfo",
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

export const auditMapInfo = (datas, tenantkey_A, tenantid_A, username) => { //审核地图信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/map/auditMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/auditMapInfo",
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
    let sha_A = hex_sha1("/v1/map/updateMap" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateMap",
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
    let sha_A = hex_sha1("/v1/devices/getDevDeveui" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevDeveui",
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
    let sha_A = hex_sha1("/v1/devices/getBeaconid" + tenantkey_A + time_A)
    return service({
        url: "devices/getBeaconid",
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
    let sha_A = hex_sha1("/v1/map/getBuildGroundList" + tenantkey_A + time_A)
    return service({
        url: "map/getBuildGroundList",
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
    let sha_A = hex_sha1("/v1/map/getBuildGroundOne" + tenantkey_A + time_A)
    return service({
        url: "map/getBuildGroundOne",
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
    let sha_A = hex_sha1("/v1/map/getBuildingByProjectid" + tenantkey_A + time_A)
    return service({
        url: "map/getBuildingByProjectid",
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
    let sha_A = hex_sha1("/v1/map/disposeBuildingMsg" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/disposeBuildingMsg",
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
    let sha_A = hex_sha1("/v1/map/addBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addBuildGround",
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
    let sha_A = hex_sha1("/v1/map/updateBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateBuildGround",
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
    let sha_A = hex_sha1("/v1/map/updateBuildGround3D" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateBuildGround3D",
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
    let sha_A = hex_sha1("/v1/map/delBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delBuildGround",
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
    let sha_A = hex_sha1("/v1/devices/sendDownLinkMsg" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/sendDownLinkMsg",
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
    let sha_A = hex_sha1("/v1/user/getNotice" + tenantkey_A + time_A)
    return service({
        url: "user/getNotice",
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
    let sha_A = hex_sha1("/v1/user/delNotice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/delNotice",
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
    let sha_A = hex_sha1("/v1/user/updateNoticeList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateNoticeList",
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
    let sha_A = hex_sha1("/v1/devices/updateDevPosList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevPosList",
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
    let sha_A = hex_sha1("/v1/devices/getDevPosList" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevPosList",
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
    let sha_A = hex_sha1("/v1/devices/getBeaconPosList" + tenantkey_A + time_A)
    return service({
        url: "devices/getBeaconPosList",
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
    let sha_A = hex_sha1("/v1/devices/updateBeaconPosList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateBeaconPosList",
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
    let sha_A = hex_sha1("/v1/map/getBuildingById" + tenantkey_A + time_A)
    return service({
        url: "map/getBuildingById",
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
    let sha_A = hex_sha1("/v1/devices/getGwActiveInfo" + tenantkey_A + time_A)
    return service({
        url: "devices/getGwActiveInfo",
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
    let sha_A = hex_sha1("/v1/devices/getGatewayMore" + tenantkey_A + time_A)
    return service({
        url: "devices/getGatewayMore",
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
    let sha_A = hex_sha1("/v1/devices/getDevStatsNum" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevStatsNum",
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
    let sha_A = hex_sha1("/v1/devices/getGwStats" + tenantkey_A + time_A)
    return service({
        url: "devices/getGwStats",
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
    let sha_A = hex_sha1("/v1/map/getGroundList" + tenantkey_A + time_A)
    return service({
        url: "map/getGroundList",
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
    let sha_A = hex_sha1("/v1/devices/addGatewayToNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addGatewayToNs",
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
    let sha_A = hex_sha1("/v1/devices/exportDevListInfo" + tenantkey_A + time_A)
    return service({
        url: "devices/exportDevListInfo",
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
    let sha_A = hex_sha1("/v1/devices/importDevList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/importDevList",
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
    let sha_A = hex_sha1("/v1/devices/getDevGps" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevGps",
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
    let sha_A = hex_sha1("/v1/map/getLastDevGps" + tenantkey_A + time_A)
    return service({
        url: "map/getLastDevGps",
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
    let sha_A = hex_sha1("/v1/map/getDevGpsList" + tenantkey_A + time_A)
    return service({
        url: "map/getDevGpsList",
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
    let sha_A = hex_sha1("/v1/map/getDevGpsOne" + tenantkey_A + time_A)
    return service({
        url: "map/getDevGpsOne",
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
    let sha_A = hex_sha1("/v1/map/getDevGpsById" + tenantkey_A + time_A)
    return service({
        url: "map/getDevGpsById",
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
    let sha_A = hex_sha1("/v1/map/getDevGpsAction" + tenantkey_A + time_A)
    return service({
        url: "map/getDevGpsAction",
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
    let sha_A = hex_sha1("/v1/user/registerSendMail" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/registerSendMail",
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
    let sha_A = hex_sha1("/v1/user/registerUserPwd" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/registerUserPwd",
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
    let sha_A = hex_sha1("/v1/devices/updateGatewayLocation" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateGatewayLocation",
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
    let sha_A = hex_sha1("/v1/devices/getFristPage" + tenantkey_A + time_A)
    return service({
        url: "devices/getFristPage",
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
    let sha_A = hex_sha1("/v1/map/delDevGps" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delDevGps",
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
    let sha_A = hex_sha1("/v1/map/getWarningList" + tenantkey_A + time_A)
    return service({
        url: "map/getWarningList",
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
    let sha_A = hex_sha1("/v1/map/getWarningNum" + tenantkey_A + time_A)
    return service({
        url: "map/getWarningNum",
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
    let sha_A = hex_sha1("/v1/map/getWarnSos" + tenantkey_A + time_A)
    return service({
        url: "map/getWarnSos",
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
    let sha_A = hex_sha1("/v1/map/delWarning" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delWarning",
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
    let sha_A = hex_sha1("/v1/user/getAssetList" + tenantkey_A + time_A)
    return service({
        url: "user/getAssetList",
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
    let sha_A = hex_sha1("/v1/user/addAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addAsset",
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
    let sha_A = hex_sha1("/v1/user/updateAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateAsset",
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
    let sha_A = hex_sha1("/v1/user/updateRemoveBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateRemoveBeacon",
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
    let sha_A = hex_sha1("/v1/user/delAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/delAsset",
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
    let sha_A = hex_sha1("/v1/user/getMemberName" + tenantkey_A + time_A)
    return service({
        url: "user/getMemberName",
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
    let sha_A = hex_sha1("/v1/devices/getBeaconGps" + tenantkey_A + time_A)
    return service({
        url: "devices/getBeaconGps",
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
    let sha_A = hex_sha1("/v1/user/getAssetName" + tenantkey_A + time_A)
    return service({
        url: "user/getAssetName",
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
    let sha_A = hex_sha1("/v1/user/getAssetOne" + tenantkey_A + time_A)
    return service({
        url: "user/getAssetOne",
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
    let sha_A = hex_sha1("/v1/map/getGround" + tenantkey_A + time_A)
    return service({
        url: "map/getGround",
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
    let sha_A = hex_sha1("/v1/devices/updateDevBeaconUUID" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevBeaconUUID",
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
    let sha_A = hex_sha1("/v1/map/updateSosWarn" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateSosWarn",
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
    let sha_A = hex_sha1("/v1/devices/updateDevBeaconFilter" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevBeaconFilter",
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
    let sha_A = hex_sha1("/v1/devices/getDevConfigFilter" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevConfigFilter",
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
    let sha_A = hex_sha1("/v1/user/getMemberType" + tenantkey_A + time_A)
    return service({
        url: "user/getMemberType",
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
    let sha_A = hex_sha1("/v1/user/getDepartmentType" + tenantkey_A + time_A)
    return service({
        url: "user/getDepartmentType",
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
    let sha_A = hex_sha1("/v1/user/getAssetType" + tenantkey_A + time_A)
    return service({
        url: "user/getAssetType",
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
    let sha_A = hex_sha1("/v1/user/getTboxType" + tenantkey_A + time_A)
    return service({
        url: "user/getTboxType",
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
    let sha_A = hex_sha1("/v1/user/delMemberType" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delMemberType",
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
    let sha_A = hex_sha1("/v1/user/delDepartmenType" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delDepartmenType",
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
    let sha_A = hex_sha1("/v1/user/delAssetType" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delAssetType",
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
    let sha_A = hex_sha1("/v1/user/delTboxType" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delTboxType",
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
    let sha_A = hex_sha1("/v1/user/addMemberType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addMemberType",
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
    let sha_A = hex_sha1("/v1/user/addDepartmentType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addDepartmentType",
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
    let sha_A = hex_sha1("/v1/user/addAssetType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addAssetType",
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
    let sha_A = hex_sha1("/v1/user/addTboxType" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addTboxType",
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
    let sha_A = hex_sha1("/v1/user/updateMemberTypeIcon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateMemberTypeIcon",
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
    let sha_A = hex_sha1("/v1/map/getGroundDevNum" + tenantkey_A + time_A)
    return service({
        url: "map/getGroundDevNum",
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
    let sha_A = hex_sha1("/v1/user/getMemberInformation" + tenantkey_A + time_A)
    return service({
        url: "user/getMemberInformation",
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
    let sha_A = hex_sha1("/v1/user/getQuestion" + tenantkey_A + time_A)
    return service({
        url: "user/getQuestion",
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
    let sha_A = hex_sha1("/v1/user/addQuestionMapFile" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addQuestionMapFile",
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
    let sha_A = hex_sha1("/v1/user/insertQuestion" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/insertQuestion",
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
    let sha_A = hex_sha1("/v1/user/delQuestion" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delQuestion",
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
    let sha_A = hex_sha1("/v1/user/updateQuestionMapFile" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateQuestionMapFile",
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
    let sha_A = hex_sha1("/v1/user/updateQuestion" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateQuestion",
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
    let sha_A = hex_sha1("/v1/user/delFile" + datas + tenantkey_A + time_A)
    return service({
        url: "user/delFile",
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
export const insertNoticeList = (datas, tenantkey_A, tenantid_A, username) => { //批量添加通知消息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/user/insertNoticeList" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/insertNoticeList",
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
    let sha_A = hex_sha1("/v1/user/updateQuestionStatus" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateQuestionStatus",
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
    let sha_A = hex_sha1("/v1/user/getMsgBoard" + tenantkey_A + time_A)
    return service({
        url: "user/getMsgBoard",
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
    let sha_A = hex_sha1("/v1/user/insertMsgBoard" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/insertMsgBoard",
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
    let sha_A = hex_sha1("/v1/user/getQuestionOne" + tenantkey_A + time_A)
    return service({
        url: "user/getQuestionOne",
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
    let sha_A = hex_sha1("/v1/devices/updateClockin" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateClockin",
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
    let sha_A = hex_sha1("/v1/map/getTranche" + tenantkey_A + time_A)
    return service({
        url: "map/getTranche",
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
    let sha_A = hex_sha1("/v1/map/addTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addTranche",
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
    let sha_A = hex_sha1("/v1/map/delTranche" + datas + tenantkey_A + time_A)
    return service({
        url: "map/delTranche",
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
    let sha_A = hex_sha1("/v1/devices/updateDevListTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevListTranche",
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
    let sha_A = hex_sha1("/v1/devices/removeDevTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/removeDevTranche",
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
    let sha_A = hex_sha1("/v1/devices/updateBeaconTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateBeaconTranche",
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
    let sha_A = hex_sha1("/v1/devices/removeBeaconTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/removeBeaconTranche",
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
    let sha_A = hex_sha1("/v1/map/delAttendance" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delAttendance",
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
    let sha_A = hex_sha1("/v1/map/getAttendanceList" + tenantkey_A + time_A)
    return service({
        url: "map/getAttendanceList",
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
    let sha_A = hex_sha1("/v1/map/getDevNum" + tenantkey_A + time_A)
    return service({
        url: "map/getDevNum",
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
    let sha_A = hex_sha1("/v1/map/getTaskInfoList" + tenantkey_A + time_A)
    return service({
        url: "map/getTaskInfoList",
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
    let sha_A = hex_sha1("/v1/map/getTaskInfoTimeList" + tenantkey_A + time_A)
    return service({
        url: "map/getTaskInfoTimeList",
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

export const getTaskManagementList = (query, tenantkey_A, tenantid_A, username) => { //获取巡检任务信息
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/map/getTaskManagementList" + tenantkey_A + time_A)
    return service({
        url: "map/getTaskManagementList",
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
    let sha_A = hex_sha1("/v1/map/insertTaskManagement" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/insertTaskManagement",
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
    let sha_A = hex_sha1("/v1/map/delTaskInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delTaskInfo",
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
    let sha_A = hex_sha1("/v1/map/delTaskManagement" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delTaskManagement",
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
    let sha_A = hex_sha1("/v1/map/updateTaskManagement" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateTaskManagement",
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
    let sha_A = hex_sha1("/v1/map/removeTaskManagementDetails" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/removeTaskManagementDetails",
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
    let sha_A = hex_sha1("/v1/map/updateTaskManagementStats" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateTaskManagementStats",
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
    let sha_A = hex_sha1("/v1/user/updateMemberTask" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateMemberTask",
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
    let sha_A = hex_sha1("/v1/user/getMemberNameId" + tenantkey_A + time_A)
    return service({
        url: "user/getMemberNameId",
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
    let sha_A = hex_sha1("/v1/map/getTaskNameId" + tenantkey_A + time_A)
    return service({
        url: "map/getTaskNameId",
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
    let sha_A = hex_sha1("/v1/user/getMemberByTaskid" + tenantkey_A + time_A)
    return service({
        url: "user/getMemberByTaskid",
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
    let sha_A = hex_sha1("/v1/map/updateTaskManagementDetails" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateTaskManagementDetails",
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
    let sha_A = hex_sha1("/v1/devices/getBeaconByBeaconids" + tenantkey_A + time_A)
    return service({
        url: "devices/getBeaconByBeaconids",
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
    let sha_A = hex_sha1("/v1/devices/getDevByEuiList" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevByEuiList",
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
    let sha_A = hex_sha1("/v1/devices/getFristPageAdmin" + tenantkey_A + time_A)
    return service({
        url: "devices/getFristPageAdmin",
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
    let sha_A = hex_sha1("/v1/devices/getFristPageUserDevUtil" + tenantkey_A + time_A)
    return service({
        url: "devices/getFristPageUserDevUtil",
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
    let sha_A = hex_sha1("/v1/devices/updateDevListToGwClockin" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevListToGwClockin",
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
    let sha_A = hex_sha1("/v1/map/updateBuildingOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateBuildingOne",
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
    let sha_A = hex_sha1("/v1/map/getFristPageUserMapUtil" + tenantkey_A + time_A)
    return service({
        url: "map/getFristPageUserMapUtil",
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
    let sha_A = hex_sha1("/v1/user/superLogin" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/superLogin",
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
    let sha_A = hex_sha1("/v1/map/getWarningConfigList" + tenantkey_A + time_A)
    return service({
        url: "map/getWarningConfigList",
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
    let sha_A = hex_sha1("/v1/map/addWarningConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addWarningConfig",
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
    let sha_A = hex_sha1("/v1/map/delWarningConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delWarningConfig",
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
    let sha_A = hex_sha1("/v1/map/updateWarningConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateWarningConfig",
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
    let sha_A = hex_sha1("/v1/map/getTrancheByIds" + tenantkey_A + time_A)
    return service({
        url: "map/getTrancheByIds",
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
    let sha_A = hex_sha1("/v1/map/updateTaskManagementUsers" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateTaskManagementUsers",
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
    let sha_A = hex_sha1("/v1/user/getMemberByIds" + tenantkey_A + time_A)
    return service({
        url: "user/getMemberByIds",
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
    let sha_A = hex_sha1("/v1/devices/updateAnglimit" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateAnglimit",
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
    let sha_A = hex_sha1("/v1/devices/updateDevListToGwAnglimit" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevListToGwAnglimit",
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
    let sha_A = hex_sha1("/v1/devices/updateHistoryBleConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateHistoryBleConfig",
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
    let sha_A = hex_sha1("/v1/map/replaceMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/replaceMapInfo",
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
    let sha_A = hex_sha1("/v1/devices/updateNearBeacons" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateNearBeacons",
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
    let sha_A = hex_sha1("/v1/map/addTrancheSub" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addTrancheSub",
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
    let sha_A = hex_sha1("/v1/map/getTrancheSubAndNearList" + tenantkey_A + time_A)
    return service({
        url: "map/getTrancheSubAndNearList",
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
    let sha_A = hex_sha1("/v1/map/delTrancheSubById" + datas + tenantkey_A + time_A)
    return service({
        url: "map/delTrancheSubById",
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
    let sha_A = hex_sha1("/v1/map/addTrancheNearSub" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addTrancheNearSub",
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
    let sha_A = hex_sha1("/v1/map/getTrancheNearSubList" + tenantkey_A + time_A)
    return service({
        url: "map/getTrancheNearSubList",
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
    let sha_A = hex_sha1("/v1/map/delTrancheNearSubBySubtranchid" + datas + tenantkey_A + time_A)
    return service({
        url: "map/delTrancheNearSubBySubtranchid",
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
    let sha_A = hex_sha1("/v1/map/getTrancheAndSubList" + tenantkey_A + time_A)
    return service({
        url: "map/getTrancheAndSubList",
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
    let sha_A = hex_sha1("/v1/map/getTrancheSubList" + tenantkey_A + time_A)
    return service({
        url: "map/getTrancheSubList",
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
    let sha_A = hex_sha1("/v1/user/getFristPageUserUtil" + tenantkey_A + time_A)
    return service({
        url: "user/getFristPageUserUtil",
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
    let sha_A = hex_sha1("/v1/map/getWarnWeekNumList" + tenantkey_A + time_A)
    return service({
        url: "map/getWarnWeekNumList",
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
    let sha_A = hex_sha1("/v1/user/addTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addTbox",
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
    let sha_A = hex_sha1("/v1/user/getTboxList" + tenantkey_A + time_A)
    return service({
        url: "user/getTboxList",
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
    let sha_A = hex_sha1("/v1/user/updateTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateTbox",
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
    let sha_A = hex_sha1("/v1/user/delTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/delTbox",
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
    let sha_A = hex_sha1("/v1/user/updateTboxRemoveLable" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateTboxRemoveLable",
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
    let sha_A = hex_sha1("/v1/user/getTboxSnId" + tenantkey_A + time_A)
    return service({
        url: "user/getTboxSnId",
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
    let sha_A = hex_sha1("/v1/user/getTboxOne" + tenantkey_A + time_A)
    return service({
        url: "user/getTboxOne",
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
    let sha_A = hex_sha1("/v1/map/addMapInfo" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addMapInfo",
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
    let sha_A = hex_sha1("/v1/map/getMapidByBuildid" + tenantkey_A + time_A)
    return service({
        url: "map/getMapidByBuildid",
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
    let sha_A = hex_sha1("/v1/map/getGroundDevGps" + tenantkey_A + time_A)
    return service({
        url: "map/getGroundDevGps",
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
    let sha_A = hex_sha1("/v1/map/getCountNum" + tenantkey_A + time_A)
    return service({
        url: "map/getCountNum",
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
//     let sha_A = hex_sha1("/v1/user/getMemberByEuis" +JSON.stringify(datas)+ tenantkey_A + time_A)
//     return service({
//         url: "user/getMemberByEuis",
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
    let sha_A = hex_sha1("/v1/user/getMemberByEuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/getMemberByEuis",
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
//     let sha_A = hex_sha1("/v1/map/addPoint" + JSON.stringify(datas) + tenantkey_A + time_A)
//     return service({
//         url: "map/addPoint",
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
    let sha_A = hex_sha1("/v1/user/getTboxByEuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/getTboxByEuis",
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
    let sha_A = hex_sha1("/v1/user/getAssetByEuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/getAssetByEuis",
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
    let sha_A = hex_sha1("/v1/map/addPoint" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addPoint",
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
    let sha_A = hex_sha1("/v1/map/delPointByPointid" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delPointByPointid",
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
    let sha_A = hex_sha1("/v1/map/updatePoint" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updatePoint",
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
    let sha_A = hex_sha1("/v1/map/getPointList" + tenantkey_A + time_A)
    return service({
        url: "map/getPointList",
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
    let sha_A = hex_sha1("/v1/map/getPointNearList" + tenantkey_A + time_A)
    return service({
        url: "map/getPointNearList",
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
    let sha_A = hex_sha1("/v1/map/addPointNear" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addPointNear",
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
    let sha_A = hex_sha1("/v1/map/getPointAndNearList" + tenantkey_A + time_A)
    return service({
        url: "map/getPointAndNearList",
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
    let sha_A = hex_sha1("/v1/map/delPointNearByPointid" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delPointNearByPointid",
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
    let sha_A = hex_sha1("/v1/devices/updateBeaconPosOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateBeaconPosOne",
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
    let sha_A = hex_sha1("/v1/map/addBuilding" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/addBuilding",
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
    let sha_A = hex_sha1("/v1/map/delBuilding" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delBuilding",
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
    let sha_A = hex_sha1("/v1/map/getBuildingList" + tenantkey_A + time_A)
    return service({
        url: "map/getBuildingList",
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
    let sha_A = hex_sha1("/v1/devices/updateDevListPosOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevListPosOne",
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
    let sha_A = hex_sha1("/v1/user/updateProjectPosition" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateProjectPosition",
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
    let sha_A = hex_sha1("/v1/map/getDevGpsByGroup" + tenantkey_A + time_A)
    return service({
        url: "map/getDevGpsByGroup",
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
    let sha_A = hex_sha1("/v1/devices/getNsAllName" + tenantkey_A + time_A)
    return service({
        url: "devices/getNsAllName",
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
    let sha_A = hex_sha1("/v1/user/getProjectConfigOne" + tenantkey_A + time_A)
    return service({
        url: "user/getProjectConfigOne",
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
    let sha_A = hex_sha1("/v1/user/updateProjectConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateProjectConfig",
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
    let sha_A = hex_sha1("/v1/user/addCustomerToMysql" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/addCustomerToMysql",
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
    let sha_A = hex_sha1("/v1/devices/getGatewayFlow" + tenantkey_A + time_A)
    return service({
        url: "devices/getGatewayFlow",
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
    let sha_A = hex_sha1("/v1/map/removeGroundDev" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/removeGroundDev",
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
    let sha_A = hex_sha1("/v1/map/insertWarningVoice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/insertWarningVoice",
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
    let sha_A = hex_sha1("/v1/map/delWarningVoice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delWarningVoice",
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
    let sha_A = hex_sha1("/v1/map/getWarningVoiceList" + tenantkey_A + time_A)
    return service({
        url: "map/getWarningVoiceList",
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
    let sha_A = hex_sha1("/v1/map/updateWarningVoice" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/updateWarningVoice",
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
    let sha_A = hex_sha1("/v1/devices/addDevOther" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/addDevOther",
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
    let sha_A = hex_sha1("/v1/devices/getDevOtherList" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevOtherList",
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
    let sha_A = hex_sha1("/v1/devices/delDevOtherByDeveuis" + datas + tenantkey_A + time_A)
    return service({
        url: "devices/delDevOtherByDeveuis",
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
    let sha_A = hex_sha1("/v1/devices/updateDevOther" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevOther",
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
    let sha_A = hex_sha1("/v1/devices/updateDevOtherByDeveuis" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevOtherByDeveuis",
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
    let sha_A = hex_sha1("/v1/devices/updateDevOtherRemoveProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevOtherRemoveProject",
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
    let sha_A = hex_sha1("/v1/devices/getDevAndOtherList" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevAndOtherList",
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
    let sha_A = hex_sha1("/v1/devices/getDevRssiList" + tenantkey_A + time_A)
    return service({
        url: "devices/getDevRssiList",
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
    let sha_A = hex_sha1("/v1/devices/updateDevOtherPosOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevOtherPosOne",
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
    let sha_A = hex_sha1("/v1/devices/sendDevOtherAlarmOne" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/sendDevOtherAlarmOne",
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
    let sha_A = hex_sha1("/v1/devices/sendDevOtherAlarmMore" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/sendDevOtherAlarmMore",
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
    let sha_A = hex_sha1("/v1/user/insertCustomerConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/insertCustomerConfig",
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
    let sha_A = hex_sha1("/v1/user/delCustomerConfig" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/delCustomerConfig",
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
    let sha_A = hex_sha1("/v1/devices/updateDevOtherTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/updateDevOtherTranche",
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
    let sha_A = hex_sha1("/v1/map/getWarnNumList" + tenantkey_A + time_A)
    return service({
        url: "map/getWarnNumList",
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
    let sha_A = hex_sha1("/v1/map/getWarningPopoutList" + tenantkey_A + time_A)
    return service({
        url: "map/getWarningPopoutList",
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
    let sha_A = hex_sha1("/v1/user/updateProjectMosaic" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateProjectMosaic",
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
    let sha_A = hex_sha1("/v1/user/getProjectFirstList" + tenantkey_A + time_A)
    return service({
        url: "user/getProjectFirstList",
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
    let sha_A = hex_sha1("/v1/devices/exportBeaconInfo" + tenantkey_A + time_A)
    return service({
        url: "devices/exportBeaconInfo",
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
    let sha_A = hex_sha1("/v1/user/importTbox" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/importTbox",
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
    let sha_A = hex_sha1("/v1/user/importAsset" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/importAsset",
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
    let sha_A = hex_sha1("/v1/user/importMember" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/importMember",
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
    let sha_A = hex_sha1("/v1/map/importTranche" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/importTranche",
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
    let sha_A = hex_sha1("/v1/map/importPointNear" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/importPointNear",
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
    let sha_A = hex_sha1("/v1/map/importPoint" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/importPoint",
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
    let sha_A = hex_sha1("/v1/map/importBuildGround" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/importBuildGround",
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
    let sha_A = hex_sha1("/v1/map/importBuilding" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/importBuilding",
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
    let sha_A = hex_sha1("/v1/user/importProject" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/importProject",
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
    let sha_A = hex_sha1("/v1/user/importCustomer" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/importCustomer",
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
    let sha_A = hex_sha1("/v1/devices/importBeacon" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/importBeacon",
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
    let sha_A = hex_sha1("/v1/user/updateProjectUnbind" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/updateProjectUnbind",
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
    let sha_A = hex_sha1("/v1/user/importBranch" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "user/importBranch",
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
    let sha_A = hex_sha1("/v1/map/fenceManage" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/fenceManage",
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

export const getFenceManageAndPointList = (query, tenantkey_A, tenantid_A, username) => { //获取告警弹框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/map/getFenceManageAndPointList" + tenantkey_A + time_A)
    return service({
        url: "map/getFenceManageAndPointList",
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
    let sha_A = hex_sha1("/v1/map/delFenceManage" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "map/delFenceManage",
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
    let sha_A = hex_sha1("/v1/map/getFenceManageList" + tenantkey_A + time_A)
    return service({
        url: "map/getFenceManageList",
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
    let sha_A = hex_sha1("/v1/map/getFenceManageWhiteList" + tenantkey_A + time_A)
    return service({
        url: "map/getFenceManageWhiteList",
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

export const getFenceManageWhiteNum = (query, tenantkey_A, tenantid_A, username) => { //获取告警弹框
    let time_A = getTime()
    let sha_A = hex_sha1("/v1/map/getFenceManageWhiteNum" + tenantkey_A + time_A)
    return service({
        url: "map/getFenceManageWhiteNum",
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
    let sha_A = hex_sha1("/v1/devices/getNsTenantInfoList" + tenantkey_A + time_A)
    return service({
        url: "devices/getNsTenantInfoList",
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
    let sha_A = hex_sha1("/v1/devices/getNsDeviceInfoList" + tenantkey_A + time_A)
    return service({
        url: "devices/getNsDeviceInfoList",
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
    let sha_A = hex_sha1("/v1/devices/getApplicationList" + tenantkey_A + time_A)
    return service({
        url: "devices/getApplicationList",
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
    let sha_A = hex_sha1("/v1/devices/delTenantOperateNs" + JSON.stringify(datas) + tenantkey_A + time_A)
    return service({
        url: "devices/delTenantOperateNs",
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