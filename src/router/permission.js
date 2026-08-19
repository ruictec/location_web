// 说明：切换为正式路由入口，避免与备份路由实例不一致
import router from './index.js'
import { adminRoutes, userRoutes, resetRouter } from './index.js'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import service from '../axios/request'
import { hasTabSession, getSessionUserInfo, persistTabSession, notifyAuthEvent } from '../utils/authSession'
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 说明：根据 prionum 动态注入路由；仅注入一次，刷新时若未注入再补注入
export function injectRoutesByRole (prionum) {
  try {
    resetRouter()
  } catch (e) {}
  if (Number(prionum) === 5) {
    store.commit('addRoutes', userRoutes)
    userRoutes.forEach((route) => {
      try {
        router.addRoute(route)
      } catch (e) {
        console.warn('addRoute failed:', route && route.path, e)
      }
    })
  } else {
    store.commit('addRoutes', adminRoutes)
    adminRoutes.forEach((route) => {
      try {
        router.addRoute(route)
      } catch (e) {
        console.warn('addRoute failed:', route && route.path, e)
      }
    })
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  
  // 处理根路径重定向
  if (to.path === '/') {
    NProgress.done()
    return next('/login')
  }
  
  // 处理登录页：只认当前标签的 sessionStorage，不读写 localStorage，避免多标签互相覆盖
  if (to.path === '/login') {
    const sessionUser = getSessionUserInfo()
    if (sessionUser && sessionUser.prionum) {
      if (!store.state.userInfo || !store.state.userInfo.prionum) {
        store.commit('setuserInfo', sessionUser)
      }
      const hasRoles = store.state.addRoutes && store.state.addRoutes.length > 0
      if (!hasRoles) {
        try { injectRoutesByRole(sessionUser.prionum) } catch (e) {}
      }
      NProgress.done()
      return next({ path: '/dashboard', replace: true })
    }
    
    if (to.query && to.query.username && to.query.password) {
      service({
        method: 'post',
        url: '/user/login',
        data: { username: to.query.username.toString(), userkey: to.query.password.toString() },
        ContentType: 'application/json;charset=UTF-8'
      })
        .then(function (data) {
          if (data.code == 1001) {
            const userInfo = data.data
            store.commit('setuserInfo', userInfo)
            persistTabSession(store.state)
            notifyAuthEvent('login', { username: userInfo.username, prionum: userInfo.prionum })
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
  const hasToken = hasTabSession()
  
  if (hasToken) {
    // 只从当前标签 session 恢复用户，不用 localStorage（会串到其他标签的账号）
    if (!store.state.userInfo || !store.state.userInfo.prionum) {
      const sessionUser = getSessionUserInfo()
      if (sessionUser && sessionUser.prionum) {
        store.commit('setuserInfo', sessionUser)
      } else {
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