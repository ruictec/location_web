import Vue from "vue";
import Vuex from "vuex";
import { constantRoutes, resetRouter } from '../router/index.js'

// import createpersistedstate from 'vuex-persistedstate'

Vue.use(Vuex);

const store = new Vuex.Store({
    // state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
    state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
        // 存储数据

        typeEnum: {// 事件响应 - 拾取类型
            8192: "FACILITY",
            16384: "LABEL",
            4096: "MODEL",
            64: "TEXT_MARKER",
            8: "IMAGE_MARKER",
        },
        userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
        userInfoCopy: {},
        i18n: '',
        projectid: '',
        show: '',
        intoProjectFlag: '',
        intoProjectKey: '',
        intoProjectTenantid: '',
        intoProjectSuperid: '',
        intoProjectid: '',
        intoProjectFBXUrl: '',
        intoProjectName: '',
        intoProjectTimezone: '',
        intoProjectType: '',
        intoProjectprojectType: '',
        intoGroundId: '',
        intoGroundImg: '',
        intoGroundImgWidth: '',
        intoGroundImgHeight: '',
        building: '',
        mapZoom: '',
        longis: '',
        latis: '',
        activeName: 'location',//室外定位
        activeName2: 'location',//室内定位
        activeName3D: 'location',//室内定位
        sosList: [],//存储SOS告警信息，退出时删除清空
        sosWebsocket: '',//soswebsocket推送过来的数据
        sosNum: false,
        projectTable: [],
        sosData: {},//告警信息点击定位时获取的信息
        warningNum: '',
        routes: [], // 所有路由
        addRoutes: [],
        goNext: false,
        isFullscreen: '',
        staffEuis: '',
        assetEuis: '',
        tboxEuis: '',
        sosNums: '',
        functionParts: {
            attenFlag: '',
            alarmConfig: true,
            tboxConfig: true,
            employee: true,
            asset: true,
            tbox: true,
            attendance: true,
            task: true,
            inDoor: true,
            outDoor: true,
            assetgw: true,
            aoagw: true,
            smoke: true,
            alertor: true,
            blesensor: true,
            camera: true,
            devgw: true,
            scanbeacon: true
        },
        warningInfo: {},
        showWarningDialog: true,
        largeScreen: false,// 大屏返回控制告警
        projectNum: 0,//项目数量
    },
    mutations: {
        changeWarningDialog(state, showWarningDialog) {
            state.showWarningDialog = showWarningDialog
        },//改变告警弹框的层级

        addRoutes(state, routes) {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        resetRoutes(state) {

            state.addRoutes = []
            state.routes = []
            resetRouter()

        },
        //数据处理方法
        setuserInfo(state, v) {
            localStorage.setItem('userInfo', JSON.stringify(v));//将传递的数据先保存到localStorage中
            state.userInfo = v;// 之后才是修改state中的状态
        },
        setWarningInfo(state, warningInfo) {
            state.warningInfo = warningInfo
        },//告警信息
        changeStaffEuis(state, staffEuis) {
            state.staffEuis = staffEuis
        },//存储首页点击在线、离线人员
        changeAssetEuis(state, assetEuis) {
            state.assetEuis = assetEuis
        },//存储首页点击在线、离线资产
        changeTBoxEuis(state, tboxEuis) {
            state.tboxEuis = tboxEuis
        },//存储首页点击在线、离线车辆
        changeScreen(state, isFullscreen) {
            state.isFullscreen = isFullscreen
        },//是否全屏
        changeState(state, info) { state = info },
        changeGoNext(state, goNext) {
            state.goNext = goNext
        },
        changeActiveName(state, activeName) { state.activeName = activeName },
        changeActiveName2(state, activeName) { state.activeName2 = activeName },
        changeActiveName3D(state, activeName) { state.activeName3D = activeName },

        changeLogo(state, logo) { state.userInfo.filelogo = logo },
        changeCLogo(state, clogo) { state.userInfo.cfilelogo = clogo },
        changeProjectid(state, projectid) {
            state.projectid = projectid
        },
        changesosList(state, sosList) {
            state.sosList = sosList
        },
        changesosWebsocket(state, sosWebsocket) {
            state.sosWebsocket = sosWebsocket
        },
        changesosNum(state, sosNum) {
            state.sosNum = sosNum
        },
        changesosNums(state, sosNums) {
            state.sosNums = sosNums
        },
        changeuserInfoCopy(state, userInfoCopy) {
            state.userInfoCopy = userInfoCopy
        },
        changeProjectTable(state, projectTable) {
            state.projectTable = projectTable
        },

        //选择侧边栏的显隐
        changeShow(state, show) {
            state.show = show
        },
        //改变楼栋的默认名
        changeBuilding(state, building) {
            state.building = building
        },
        //选择进入的项目ID
        selectProjectid(state, intoProjectid) {
            state.intoProjectid = intoProjectid
        },
        //选择进入的项目是否有FBX模型背景
        selectProjectFBXUrl(state, intoProjectFBXUrl) {
            state.intoProjectFBXUrl = intoProjectFBXUrl
        },

        //该项目外嵌密钥
        selectProjectKey(state, intoProjectKey) {
            state.intoProjectKey = intoProjectKey
        },
        //该项目是否可以外嵌
        selectProjectFlag(state, intoProjectFlag) {
            state.intoProjectFlag = intoProjectFlag
        },
        //选择进入的项目tenantid
        selectProjectTenantid(state, intoProjectTenantid) {
            state.intoProjectTenantid = intoProjectTenantid
        },
        //选择进入的项目superid
        selectProjectSuperid(state, intoProjectSuperid) {
            state.intoProjectSuperid = intoProjectSuperid
        },

        //选择进入的项目的名字
        selectProjectName(state, intoProjectName) {
            state.intoProjectName = intoProjectName
        },
        //选择进入的项目的时区
        selectProjectTimezone(state, intoProjectTimezone) {
            state.intoProjectTimezone = intoProjectTimezone
        },
        //选择进入的项目的定位类型
        selectProjectType(state, intoProjectType) {
            state.intoProjectType = intoProjectType
        },
        //选择进入的项目的项目类型
        selectProjectprojectType(state, intoProjectprojectType) {
            state.intoProjectprojectType = intoProjectprojectType
        },
        //选择进入的楼层编号
        selectGroundId(state, intoGroundId) {
            state.intoGroundId = intoGroundId
        },
        //选择进入的楼层地图
        selectGroundImg(state, intoGroundImg) {
            state.intoGroundImg = intoGroundImg
        },
        selectGroundImgWidth(state, intoGroundImgWidth) {
            state.intoGroundImgWidth = intoGroundImgWidth
        },
        selectGroundImgHeight(state, intoGroundImgHeight) {
            state.intoGroundImgHeight = intoGroundImgHeight
        },

        changeMapZoom(state, mapZoom) {
            state.mapZoom = mapZoom
        },
        changeMapLongi(state, longis) {
            state.longis = longis
        },
        changeMapLati(state, latis) {
            state.latis = latis
        },

        //告警信息点击定位按钮保存的位置数据
        changesosData(state, sosData) {
            state.sosData = sosData
        },
        setWarningNum(state, warningNum) {
            state.warningNum = warningNum
        },
        changefunctionParts(state, functionParts) {
            state.functionParts = functionParts
        },
        setlargeScreen(state, v) {
            state.largeScreen = v
        },
        setProjectNum(state, v) {
            state.projectNum = v
        },

    },
    getters: {
        // 数据包装
    }
});

export default store