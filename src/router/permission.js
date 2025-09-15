// 说明：切换为正式路由入口，避免与备份路由实例不一致
import router from './index.js'
import { adminRoutes, userRoutes, resetRouter } from './index.js'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import service from '../axios/request'
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 说明：根据 prionum 动态注入路由；仅注入一次，刷新时若未注入再补注入
function injectRoutesByRole (prionum) {
  try {
    resetRouter()
  } catch (e) {}
  if (Number(prionum) === 5) {
    store.commit('addRoutes', userRoutes)
    router.addRoutes(userRoutes)
  } else {
    store.commit('addRoutes', adminRoutes)
    router.addRoutes(adminRoutes)
  }
}
router.beforeEach((to, from, next) => {
  var that = this
  NProgress.start()
  // oldCode 风格：登录页允许携带用户名密码直接登录
  if (to.path === '/login') {
    // 若已登录（store 中已有用户信息），直接按角色注入并跳转到 dashboard
    if (store.state.userInfo && store.state.userInfo.prionum) {
      const hasRoles = store.state.addRoutes && store.state.addRoutes.length > 0
      if (!hasRoles) {
        try { injectRoutesByRole(store.state.userInfo.prionum) } catch (e) {}
      }
      NProgress.done()
      return next({ path: '/dashboard', replace: true })
    }
    // 未登录：清空本地缓存与 store，避免残留
    try { window.localStorage.removeItem('userInfo') } catch (e) {}
    try { window.sessionStorage.removeItem('state') } catch (e) {}
    try { store.commit('setuserInfo', '') } catch (e) {}
    if (to.query && to.query.username && to.query.password) {
      service({
        method: 'post',
        url: process.env.VUE_APP_API_BASE + '/user/login',
        data: { username: to.query.username.toString(), userkey: to.query.password.toString() },
        ContentType: 'application/json;charset=UTF-8'
      })
        .then(function (data) {
          if (data.code == 1001) {
            const userInfo = data.data
            store.commit('setuserInfo', userInfo)
            try { window.sessionStorage.setItem('state', JSON.stringify(store.state)) } catch (e) {}
            try { window.localStorage.setItem('userInfo', JSON.stringify(userInfo)) } catch (e) {}
            try { injectRoutesByRole(userInfo.prionum) } catch (e) {}
            const target = to.query && to.query.redirect && to.query.redirect !== '/login' ? to.query.redirect : '/dashboard'
            NProgress.done()
            return next({ path: target, replace: true })
          } else {
            // 登录失败，停留在登录页
            NProgress.done(); next();
          }
        })
        .catch(function () {
          // 登录请求异常，保持在登录页
          NProgress.done(); next();
        })
      return
    }
    NProgress.done()
    return next()
  }
  if (to.query) {
    let q = to.query
    if (q.username && q.password) {
      service({
        method: "post",
        // 说明：登录地址改为读取环境变量，默认使用你当前线上地址；
        // 开源后请在 .env(.local) 中配置 VUE_APP_API_BASE
        url: process.env.VUE_APP_API_BASE + "/user/login",
        data: {
          username: q.username.toString(),
          userkey: q.password.toString(),
        },
        ContentType: "application/json;charset=UTF-8",
      })
        .then(function (data) {
          if (data.code == 1001) {
            if (data.data.prionum == 5 && data.data.num == 0) {
              // that.$message({
              //   message: "未创建项目，与管理员联系",
              //   type: "warning",
              // });
              return;
            }
            let userInfo = data.data;
            store.commit("setuserInfo", userInfo);
            window.sessionStorage.setItem(
              "state",
              JSON.stringify(store.state)
            );
            try { injectRoutesByRole(userInfo.prionum) } catch (e) {}
            const target = (to.query && to.query.redirect && to.query.redirect !== '/login') ? to.query.redirect : '/dashboard'
            next({ path: target, replace: true })
            store.state.show = true;
          } else {
            // 登录失败，停留当前页或给出提示（此处保持静默以兼容现有逻辑）
          }
        })
        .catch(function () {
          // 请求异常保持静默
        });
    }
  }
  if (to.name == null && from.name == null) {
    if (to.query.username && to.query.password) {
      next()
      NProgress.done()
    } else {
      // if (!to.path) {
      //   next({
      //     path: '/login', // 刷新跳转至login页面
      //   });
      //   NProgress.done()
      // }
      const hasToken = window.sessionStorage.getItem('state')
      if (hasToken) {
        // 确保刷新或刚登录后 userInfo 可用
        if (!store.state.userInfo || !store.state.userInfo.prionum) {
          try {
            const cached = JSON.parse(window.localStorage.getItem('userInfo') || '{}')
            if (cached && cached.prionum) {
              store.commit('setuserInfo', cached)
            }
          } catch (e) { /* ignore */ }
        }
        const hasRoles = store.state.addRoutes && store.state.addRoutes.length > 0
        if (!hasRoles && store.state.userInfo && store.state.userInfo.prionum) {
          try { injectRoutesByRole(store.state.userInfo.prionum) } catch (e) {}
          return next({ ...to, replace: true })
        }
        next()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    // 非登录页常规流程
    if (to.path === '/register') {
      next()
      NProgress.done()
      return
    }
    // set page title
    // document.title = getPageTitle(to.meta.title)
    // determine whether the user has logged in
    const hasToken = window.sessionStorage.getItem('state')
    //  const hasToken = store.state.userInfo
    // const L =  router.options.routes.length
    if (hasToken) {
      // 确保刷新或刚登录后 userInfo 可用
      if (!store.state.userInfo || !store.state.userInfo.prionum) {
        try {
          const cached = JSON.parse(window.localStorage.getItem('userInfo') || '{}')
          if (cached && cached.prionum) {
            store.commit('setuserInfo', cached)
          }
        } catch (e) { /* ignore */ }
      }
      const hasRoles = store.state.addRoutes && store.state.addRoutes.length > 0
      if (!hasRoles && store.state.userInfo && store.state.userInfo.prionum) {
        try { injectRoutesByRole(store.state.userInfo.prionum) } catch (e) {}
        return next({ ...to, replace: true })
      }
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
      // }
    }
  }

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
