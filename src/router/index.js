import { createRouter, createWebHashHistory } from 'vue-router'
// 说明：改为路由懒加载，降低首屏体积；不改变页面逻辑与路径
const Login1 = () => import('../views/login/Login1')
const Register = () => import('../views/login/Register')
const Home = () => import('../views/home/Home')
const Homeuser = () => import('../views/home/Homeuser')
const Beacon = () => import('../views/device/Beacon')
const Security = () => import('../views/device/Security')
const Largescreen = () => import('../views/home/LargeScreen')
const NS = () => import('../views/device/NS')
const DownLink = () => import('../views/data/DownLink')
const Location = () => import('../views/project/Location')
const Config = () => import('../views/project/ProjectConfig')
const NsConfig = () => import('../views/device/NsConfig')
const GateWay = () => import('../views/device/GateWay')
const Terminal = () => import('../views/device/Terminal')
const UserManagement = () => import('../views/user/UserManagement')
const CompanyManagement = () => import('../views/user/CompanyManagement')
const CustomerManagement = () => import('../views/user/CustomerManagement')
const MapManagement = () => import('../views/map/MapManagement')

const buildingManagement = () => import('../views/locate/buildingManagement')
const GroundDetails = () => import('../views/locate/GroundDetails')
const LocationOutdoor = () => import('../views/locate/LocationOutdoor')
const Outdoor = () => import('../views/locate/Outdoor')
const Historical = () => import('../views/locate/LocationHistorical')
const Indoor = () => import('../views/locate/Indoor')
const LocationIndoor = () => import('../views/locate/LocationIndoor')
const LocationIndoorHis = () => import('../views/locate/LocationIndoorHis')


const StaffManagement = () => import('../views/staff/StaffManagement')
const LogManagement = () => import('../views/log/LogManagement')
const OtaManagement = () => import('../views/system/OtaManagement')
const WarningManagement = () => import('../views/warning/WarningManagement')
const HeartBeat = () => import('../views/data/HeartBeat')
const Test = () => import('../views/data/Test')
const TestData = () => import('../views/data/TestData')
const ProjectManagement = () => import('../views/project/ProjectManagement')
const BuildingManagement = () => import('../views/project/BuildingManagement')
const TerritoryManagement = () => import('../views/territory/TerritoryManagement')
const UserCenter = () => import('../views/user/UserCenter')
const Message = () => import('../views/message/Message')
const AssetManagement = () => import('../views/asset/AssetManagement')
const TBoxManagement = () => import('../views/asset/TBoxManagement')
const MyOrder = () => import('../views/system/myorder')
const UserOrder = () => import('../views/system/userorder')
const OrderDetails = () => import('../views/system/orderdetails')
const CompanyOrder = () => import('../views/system/companyorder')
const CheckWork = () => import('../views/staff/checkwork')
const inspection = () => import('../views/staff/inspection')
import Layout from '../components/layout'

// 说明：基础路由（无需鉴权），其余按角色在运行时动态注入
export const constantRoutes = [

    {
      path: '/largescreen',
      name: 'Largescreen',
      component: Largescreen,
      props: true, // 通过props将查询参数传递给组件 
      meta: {
        requireAuth: false
      }
    },

    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login1,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        requireAuth: false
      }
    },
]

// 说明：管理员/高级角色的业务路由，登录后由 permission 按角色注入
export const adminRoutes = [
    {
      path: '/dashboard',
      name: 'Home',
      component: Home,
      meta: { requireAuth: true }
    },
    {
      path: '/beacon',
      name: 'Beacon',
      component: Beacon,
      meta: { requireAuth: true }
    },
    {
      path: '/security',
      name: 'Security',
      component: Security,
      meta: { requireAuth: true }
    },

    {
      path: '/downlink',
      name: 'DownLink',
      component: DownLink,
      meta: { requireAuth: true }
    },
    {
      path: '/location',
      name: 'Location',
      component: Location,
      meta: { requireAuth: true }
    },
    {
      path: '/config',
      name: 'Config',
      component: Config,
      meta: { requireAuth: true }
    },
    {
      path: '/ns',
      name: 'NS',
      component: NS,
      meta: { requireAuth: true }
    },

    {
      path: '/nsconfig',
      name: 'NsConfig',
      component: NsConfig,
      meta: { requireAuth: true }
    },
    {
      path: '/gateway',
      name: 'GateWay',
      component: GateWay,
      meta: { requireAuth: true }
    }
    ,
    {
      path: '/terminal',
      name: 'Terminal',
      component: Terminal,
      meta: { requireAuth: true }
    },
    {
      path: '/usermanagement',
      name: 'UserManagement',
      component: UserManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/companymanagement',
      name: 'CompanyManagement',
      component: CompanyManagement,
      meta: { requireAuth: true }
    },

    {
      path: '/customermanagement',
      name: 'CustomerManagement',
      component: CustomerManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/mapmanagement',
      name: 'MapManagement',
      component: MapManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/buildingmanagement',
      name: 'buildingmanagement',
      component: buildingManagement,
      meta: { requireAuth: true }
    },

    {
      path: '/outdoor',
      name: 'Outdoor',
      component: Outdoor,
      meta: { requireAuth: true },
      children: [
        {
          path: 'locationoutdoor',
          component: LocationOutdoor,
          meta: { requireAuth: true }
        },
        {
          path: 'historical',
          component: Historical,
          meta: { requireAuth: true }
        },
      ]
    },

    {
      path: '/indoor',
      name: 'Indoor',
      component: Indoor,
      meta: { requireAuth: true },
      children: [
        {
          path: 'locationindoor',
          component: LocationIndoor,
          meta: { requireAuth: true }
        },
        {
          path: 'historical',
          component: LocationIndoorHis,
          meta: { requireAuth: true }
        },
      ]
    },
    {
      path: '/buildingdetails',
      name: 'buildingdetails',
      component: GroundDetails,
      meta: { requireAuth: true }
    },

    {
      path: '/staffmanagement',
      name: 'StaffManagement',
      component: StaffManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/logmanagement',
      name: 'LogManagement',
      component: LogManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/otamanagement',
      name: 'OtaManagement',
      component: OtaManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/warningmanagement',
      name: 'WarningManagement',
      component: WarningManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/heartbeat',
      name: 'HeartBeat',
      component: HeartBeat,
      meta: { requireAuth: true }
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
      meta: { requireAuth: true }
    },
    {
      path: '/testdata',
      name: 'TestData',
      component: TestData,
      meta: { requireAuth: true }
    },
    {
      path: '/projectmanagement',
      name: 'ProjectManagement',
      component: ProjectManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/floormanagement',
      name: 'floormanagement',
      component: BuildingManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/territorymanagement',
      name: 'TerritoryManagement',
      component: TerritoryManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/usercenter',
      name: 'UserCenter',
      component: UserCenter,
      meta: { requireAuth: true }
    },

    {
      path: '/message',
      name: 'Message',
      component: Message,
      meta: { requireAuth: true }
    },
    {
      path: '/assetManagement',
      name: 'AssetManagement',
      component: AssetManagement,
      meta: { requireAuth: true }
    },

    {
      path: '/tboxManagement',
      name: 'TBoxManagement',
      component: TBoxManagement,
      meta: { requireAuth: true }
    },
    {
      path: '/myorder',
      name: 'MyOrder',
      component: MyOrder,
      meta: { requireAuth: true }
    },

    {
      path: '/userorder',
      name: 'UserOrder',
      component: UserOrder,
      meta: { requireAuth: true }
    },
    {
      path: '/orderdetails',
      name: 'OrderDetails',
      component: OrderDetails,
      meta: { requireAuth: true }
    },
    {
      path: '/companyorder',
      name: 'CompanyOrder',
      component: CompanyOrder,
      meta: { requireAuth: true }
    },
    {
      path: '/checkwork',
      name: 'CheckWork',
      component: CheckWork,
      meta: { requireAuth: true }
    },
    {
      path: '/inspection',
      name: 'Inspection',
      component: inspection,
      meta: { requireAuth: true }
    },
]

// 说明：普通用户（prionum == 5）路由分组
export const userRoutes = [
    {
      path: '/device',
      component: Layout,
      redirect: '/device/terminal',
      name: 'terminal',
      meta: {
        title: 'router.deviceManagement',
        icon: '404'
      },
      children: [
        {
          path: 'terminal',
          component: Terminal,
          name: 'terminal',
          meta: { title: 'router.terminalManagement', noCache: true }
        },
        {
          path: 'beacon',
          component: Beacon,
          name: 'beacon',
          meta: { title: 'router.beaconManagement', noCache: true }
        },
        {
          path: 'security',
          component: Security,
          name: 'security',
          meta: { title: 'router.securityManagement', noCache: true }
        },
        {
          path: 'gateway',
          component: GateWay,
          name: 'gateway',
          meta: { title: 'router.gatewayManagement', noCache: true }
        }
      ]
    },

    {
      path: '/dashboard',
      component: Layout,
      children: [
        {
          path: '',
          component: Homeuser,
          name: 'HomeUser',
          meta: { title: 'router.homepage', icon: 'Home', affix: true }
        }
      ]
    },
    {
      path: '/warning',
      component: Layout,
      redirect: '/warning/index',
      name: 'warning',
      meta: {
        title: 'router.alarmManagement',
        icon: 'Warningmanagement'
      },
      children: [
        {
          path: 'index',
          component: () => import('../views/warning/WarningManagement.vue'),
          name: 'Warningmanagement',
          meta: { title: 'router.alarmInformation', noCache: true }
        },
        {
          path: 'electronicfence',
          component: () => import('../views/warning/ElectronicFence.vue'),
          name: 'ElectronicFence',
          meta: { title: 'router.electronicFence', noCache: true }
        },
        {
          path: 'warningconfigper',
          component: () => import('../views/warning/WarningConfigPer.vue'),
          name: 'WarningConfigPer',
          meta: { title: 'router.personAlarmConfig', noCache: true }
        },
        {
          path: 'warningconfigtbox',
          component: () => import('../views/warning/WarningConfigTBox.vue'),
          name: 'WarningConfigTbox',
          meta: { title: 'router.vehicleAlarmConfig', noCache: true }
        },
        {
          path: 'warningconfig',
          component: () => import('../views/warning/WarningConfig.vue'),
          name: 'WarningConfig',
          meta: { title: 'router.alarmConfig', noCache: true }
        }
      ]
    },
    {
      path: '/staff',
      component: Layout,
      redirect: '/staff/staffmanagement',
      name: 'staffmanagement',
      meta: {
        title: 'router.personnelManagement',
        icon: '404'
      },
      children: [
        {
          path: 'staffmanagement',
          component: StaffManagement,
          name: 'staffmanagement',
          meta: { title: 'router.employeeManagement', noCache: true }
        },
        {
          path: 'assetManagement',
          component: AssetManagement,
          name: 'assetManagement',
          meta: { title: 'router.assetManagement', noCache: true }
        },
        {
          path: 'tboxManagement',
          component: TBoxManagement,
          name: 'tboxManagement',
          meta: { title: 'router.vehicleManagement', noCache: true }
        },
        {
          path: 'checkwork',
          component: CheckWork,
          name: 'checkwork',
          meta: { title: 'router.attendanceManagement', noCache: true }
        },
        {
          path: 'inspection',
          component: inspection,
          name: 'inspection',
          meta: { title: 'router.inspectionManagement', noCache: true }
        }
      ]
    },
    {
      path: '/location',
      component: Layout,
      redirect: '/location/mapmanagement',
      name: 'mapmanagement',
      meta: {
        title: 'router.locationManagement',
        icon: '404'
      },
      children: [
        {
          path: 'mapmanagement',
          component: MapManagement,
          name: 'mapmanagement',
          meta: { title: 'router.mapManagement', noCache: true }
        },
        {
          path: 'buildingmanagement',
          component: buildingManagement,
          name: 'buildingmanagement',
          meta: { title: 'router.buildingManagement', noCache: true }
        },
        {
          path: 'floormanagement',
          component: BuildingManagement,
          name: 'floormanagement',
          meta: { title: 'router.floorManagement', noCache: true }
        },
        {
          path: 'buildingdetails',
          component: GroundDetails,
          name: 'buildingdetails',
          meta: { title: 'router.floorDetails', noCache: true }
        },
        {
          path: 'outdoor',
          component: Outdoor,
          name: 'outdoor',
          redirect: '/location/outdoor/locationoutdoor',
          meta: { title: 'router.outdoorPositioning', noCache: true },
          children: [{
            path: 'locationoutdoor',
            component: LocationOutdoor,
            name: 'locationoutdoor',
            meta: { title: 'router.locationQuery', noCache: true },

          },
          {
            path: 'historical',
            component: Historical,
            name: 'historical',
            meta: { title: 'router.historicalTrack', noCache: true },

          }]
        },
        {
          path: 'indoor',
          component: Indoor,
          name: 'indoor',
          meta: { title: 'router.indoorPositioning', noCache: true },
          redirect: '/location/indoor/locationindoor',
          children: [{
            path: 'locationindoor',
            component: LocationIndoor,
            name: 'locationindoor',
            meta: { title: 'router.locationQuery', noCache: true },

          },
          {
            path: 'historical',
            component: LocationIndoorHis,
            name: 'historical',
            meta: { title: 'router.dataAnalysis', noCache: true },

          }]
        },

      ]
    },

    {
      path: '/user',
      component: Layout,
      redirect: '/user/usercenter',
      name: 'usercenter',
      meta: {
        title: 'router.user',
        icon: '404'
      },
      children: [
        {
          path: 'usercenter',
          component: UserCenter,
          name: 'usercenter',
          meta: { title: 'router.userCenter', noCache: true }
        },
        {
          path: 'myorder',
          component: MyOrder,
          name: 'myorder',
          meta: { title: 'router.myOrder', noCache: true }
        },
      ]
    },
    {
      path: '/messageuser',
      component: Layout,
      name: 'messageuser',
      meta: {
        icon: '404'
      },
      children: [
        {
          path: '/',
          component: Message,
          name: 'messageuser',
          meta: { title: 'router.messageCenter', noCache: true }
        },

      ]
    },
]

// 说明：恢复 oldCode 的“基础路由 + 动态注入”方案
// 仅用基础路由创建 Router，其余按权限在运行时注入
const createRouterInstance = () => createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

const router = createRouterInstance()

function collectRouteNames(routes, names = []) {
  routes.forEach((route) => {
    if (route.name) names.push(route.name)
    if (route.children && route.children.length) {
      collectRouteNames(route.children, names)
    }
  })
  return names
}

const constantRouteNames = collectRouteNames(constantRoutes)

// 重置动态路由，用于在切换角色/首次登录后清空已注册的动态路由
export function resetRouter () {
  router.getRoutes().forEach((route) => {
    if (route.name && !constantRouteNames.includes(route.name)) {
      router.removeRoute(route.name)
    }
  })
}

export default router
