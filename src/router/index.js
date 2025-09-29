import Vue from 'vue'
import Router from 'vue-router'
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
const Indoor3D = () => import('../views/locate/Indoor3D')
const LocationIndoor = () => import('../views/locate/LocationIndoor')
const LocationIndoor3D = () => import('../views/locate/LocationIndoor3D')
const LocationIndoorHis = () => import('../views/locate/LocationIndoorHis')
const LocationIndoorHis3D = () => import('../views/locate/LocationIndoorHis3D')

const Locations = () => import('../views/location/Locations')
const LocationDeveui = () => import('../views/location/LocationDeveui')
const LocationHistorical = () => import('../views/location/LocationHistorical')


const StaffManagement = () => import('../views/staff/staffManagement')
const LogManagement = () => import('../views/log/LogManagement')
const WarningManagement = () => import('../views/warning/WarningManagement')
const HeartBeat = () => import('../views/data/HeartBeat')
const Test = () => import('../views/data/Test')
const TestData = () => import('../views/data/TestData')
const ProjectManagement = () => import('../views/project/ProjectManagement')
const BuildingManagement = () => import('../views/project/BuildingManagement')
const Building3D = () => import('../views/project/Building3D')
const TerritoryManagement = () => import('../views/territory/TerritoryManagement')
const UserCenter = () => import('../views/user/UserCenter')
const UserSet = () => import('../views/user/UserSet')
const Message = () => import('../views/message/Message')
const AssetManagement = () => import('../views/asset/assetManagement')
const TBoxManagement = () => import('../views/asset/TBoxManagement')
const MyOrder = () => import('../views/system/myorder')
const UserOrder = () => import('../views/system/userorder')
const OrderDetails = () => import('../views/system/orderdetails')
const CompanyOrder = () => import('../views/system/companyorder')
const CheckWork = () => import('../views/staff/checkwork')
const inspection = () => import('../views/staff/inspection')
import Layout from '../components/layout'

const originalPush = Router.prototype.push
//修改原型对象中的push方法 重复路由报错
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(Router)

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
      path: '/locations',
      name: 'Locations',
      component: Locations,
      meta: { requireAuth: true },
      children: [
        {
          path: 'locationdeveui',
          component: LocationDeveui,
          meta: { requireAuth: true }
        },
        {
          path: 'locationhistorical',
          component: LocationHistorical,
          meta: { requireAuth: true }
        },
      ]
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
      path: '/indoor3d',
      name: 'Indoor3D',
      component: Indoor3D,
      meta: { requireAuth: true },
      children: [
        {
          path: 'locationindoor3d',
          component: LocationIndoor3D,
          meta: { requireAuth: true }
        },
        {
          path: 'historical3d',
          component: LocationIndoorHis3D,
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
      path: '/userset',
      name: 'UserSet',
      component: UserSet,
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
    {
      path: '/building3d',
      name: 'Building3D',
      component: Building3D,
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
        title: '设备管理',
        icon: '404'
      },
      children: [
        {
          path: 'terminal',
          component: Terminal,
          name: 'terminal',
          meta: { title: '终端管理', noCache: true }
        },
        {
          path: 'beacon',
          component: Beacon,
          name: 'beacon',
          meta: { title: '信标管理', noCache: true }
        },
        {
          path: 'security',
          component: Security,
          name: 'security',
          meta: { title: '安全管理', noCache: true }
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
          meta: { title: '首页', icon: 'Home', affix: true }
        }
      ]
    },
    {
      path: '/warning',
      component: Layout,
      redirect: '/warning/index',
      name: 'warning',
      meta: {
        title: '告警管理',
        icon: 'Warningmanagement'
      },
      children: [
        {
          path: 'index',
          component: () => import('../views/warning/WarningManagement.vue'),
          name: 'Warningmanagement',
          meta: { title: '告警信息', noCache: true }
        },
        {
          path: 'electronicfence',
          component: () => import('../views/warning/ElectronicFence.vue'),
          name: 'ElectronicFence',
          meta: { title: '电子围栏', noCache: true }
        },
        {
          path: 'warningconfigper',
          component: () => import('../views/warning/WarningConfigPer.vue'),
          name: 'WarningConfigPer',
          meta: { title: '人员告警配置', noCache: true }
        },
        {
          path: 'warningconfigtbox',
          component: () => import('../views/warning/WarningConfigTBox.vue'),
          name: 'WarningConfigTbox',
          meta: { title: '车辆告警配置', noCache: true }
        },
        {
          path: 'warningconfig',
          component: () => import('../views/warning/WarningConfig.vue'),
          name: 'WarningConfig',
          meta: { title: '告警配置', noCache: true }
        }
      ]
    },
    {
      path: '/staff',
      component: Layout,
      redirect: '/staff/staffmanagement',
      name: 'staffmanagement',
      meta: {
        title: '人员管理',
        icon: '404'
      },
      children: [
        {
          path: 'staffmanagement',
          component: StaffManagement,
          name: 'staffmanagement',
          meta: { title: '员工管理', noCache: true }
        },
        {
          path: 'assetManagement',
          component: AssetManagement,
          name: 'assetManagement',
          meta: { title: '资产管理', noCache: true }
        },
        {
          path: 'tboxManagement',
          component: TBoxManagement,
          name: 'tboxManagement',
          meta: { title: '车辆管理', noCache: true }
        },
        {
          path: 'checkwork',
          component: CheckWork,
          name: 'checkwork',
          meta: { title: '考勤管理', noCache: true }
        },
        {
          path: 'inspection',
          component: inspection,
          name: 'inspection',
          meta: { title: '巡检管理', noCache: true }
        }
      ]
    },
    {
      path: '/location',
      component: Layout,
      redirect: '/location/mapmanagement',
      name: 'mapmanagement',
      meta: {
        title: '定位管理',
        icon: '404'
      },
      children: [
        {
          path: 'mapmanagement',
          component: MapManagement,
          name: 'mapmanagement',
          meta: { title: '地图管理', noCache: true }
        },
        {
          path: 'buildingmanagement',
          component: buildingManagement,
          name: 'buildingmanagement',
          meta: { title: '楼栋管理', noCache: true }
        },
        {
          path: 'floormanagement',
          component: BuildingManagement,
          name: 'floormanagement',
          meta: { title: '楼层管理', noCache: true }
        },
        {
          path: 'buildingdetails',
          component: GroundDetails,
          name: 'buildingdetails',
          meta: { title: '楼层详情', noCache: true }
        },
        {
          path: 'outdoor',
          component: Outdoor,
          name: 'outdoor',
          redirect: '/location/outdoor/locationoutdoor',
          meta: { title: '室外定位', noCache: true },
          children: [{
            path: 'locationoutdoor',
            component: LocationOutdoor,
            name: 'locationoutdoor',
            meta: { title: '定位查询', noCache: true },

          },
          {
            path: 'historical',
            component: Historical,
            name: 'historical',
            meta: { title: '历史轨迹', noCache: true },

          }]
        },
        {
          path: 'indoor',
          component: Indoor,
          name: 'indoor',
          meta: { title: '室内定位', noCache: true },
          redirect: '/location/indoor/locationindoor',
          children: [{
            path: 'locationindoor',
            component: LocationIndoor,
            name: 'locationindoor',
            meta: { title: '定位查询', noCache: true },

          },
          {
            path: 'historical',
            component: LocationIndoorHis,
            name: 'historical',
            meta: { title: '数据分析', noCache: true },

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
        title: 'user',
        icon: '404'
      },
      children: [
        {
          path: 'usercenter',
          component: UserCenter,
          name: 'usercenter',
          meta: { title: '用户中心', noCache: true }
        },
        {
          path: 'myorder',
          component: MyOrder,
          name: 'myorder',
          meta: { title: '我的工单', noCache: true }
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
          meta: { title: '消息中心', noCache: true }
        },

      ]
    },
]

// 说明：恢复 oldCode 的“基础路由 + 动态注入”方案
// 仅用基础路由创建 Router，其余按权限在运行时注入
const createRouter = () => new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 重置 matcher，用于在切换角色/首次登录后清空已注册的动态路由
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
