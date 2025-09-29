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
  NProgress.start()
  
  // 处理根路径重定向
  if (to.path === '/') {
    NProgress.done()
    return next('/login')
  }
  
  // 处理登录页
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
  
  // 处理注册页
  if (to.path === '/register') {
    next()
    NProgress.done()
    return
  }
  
  // 检查是否需要认证
  const hasToken = window.sessionStorage.getItem('state')
  
  if (hasToken) {
    // 有token，检查用户信息
    if (!store.state.userInfo || !store.state.userInfo.prionum) {
      try {
        const cached = JSON.parse(window.localStorage.getItem('userInfo') || '{}')
        if (cached && cached.prionum) {
          store.commit('setuserInfo', cached)
        } else {
          // 没有有效的用户信息，清除token并跳转到登录页
          window.sessionStorage.removeItem('state')
          NProgress.done()
          return next(`/login?redirect=${to.path}`)
        }
      } catch (e) {
        // 解析失败，清除token并跳转到登录页
        window.sessionStorage.removeItem('state')
        NProgress.done()
        return next(`/login?redirect=${to.path}`)
      }
    }
    
    // 检查路由是否已注入
    const hasRoles = store.state.addRoutes && store.state.addRoutes.length > 0
    if (!hasRoles && store.state.userInfo && store.state.userInfo.prionum) {
      try { 
        injectRoutesByRole(store.state.userInfo.prionum) 
        return next({ ...to, replace: true })
      } catch (e) {
        // 路由注入失败，跳转到登录页
        window.sessionStorage.removeItem('state')
        NProgress.done()
        return next(`/login?redirect=${to.path}`)
      }
    }
    
    // 正常访问
    next()
  } else {
    // 没有token，跳转到登录页
    NProgress.done()
    return next(`/login?redirect=${to.path}`)
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router