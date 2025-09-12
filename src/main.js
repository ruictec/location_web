// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// 说明：使用正式的路由入口文件，避免误用备份文件
import router from './router/index.js'
import './router/permission'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import qs from 'qs.js'
import $ from 'jquery'
import 'jquery'
import store from './store/index'
import VuePreview from 'vue-preview'
import echarts from 'echarts'
import VueLazyload from 'vue-lazyload'
import './utils/flexible'
import websocket from './common/WebSocket'
import 'view-design/dist/styles/iview.css'
import Velocity from 'velocity-animate'
import dataV from '@jiaminghi/data-view'

import i18n from './i18n/i18n';
import { Timeline, TimelineItem, Slider, Switch } from "view-design";
import VScaleScreen from 'v-scale-screen'



Vue.use(VScaleScreen)
Vue.component("Timeline", Timeline);
Vue.component("TimelineItem", TimelineItem);
Vue.component("Slider", Slider);
Vue.component("i-switch", Switch);
Vue.prototype.websocket = websocket

/*使用axios插件*/
// 请求允许携带cookie
axios.defaults.withCredentials = true
// 设置axios的baseURL
axios.defaults.baseURL = process.env.VUE_APP_API_BASE
Vue.prototype.$axios = axios
Vue.prototype.qs = qs

Vue.prototype.$echarts = echarts

//挂载全局EventBus
Vue.prototype.$EventBus = new Vue()

Vue.config.productionTip = false
// 说明：生产环境关闭 Vue 调试与性能提示；开发环境保留调试能力
if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false
  Vue.config.performance = false
} else {
  Vue.config.devtools = true
  Vue.config.performance = true
}

// 说明：全局错误兜底，避免未捕获错误导致白屏；开发环境输出到控制台
Vue.config.errorHandler = function (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    // 在开发环境打印错误，便于定位白屏
    /* eslint-disable no-console */
    console.error('Vue errorHandler:', err, info)
  }
}
window.addEventListener('unhandledrejection', function (event) {
  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable no-console */
    console.error('Unhandled Promise Rejection:', event.reason)
  }
})

Vue.prototype.Velocity = Velocity

Vue.use(VueI18n).use(ElementUI) // 通过插件的形式挂载
ElementUI.Dialog.props.lockScroll.default = false; //dialog时背景遮罩可滚动 

Vue.use(VuePreview)
Vue.use(VueLazyload, { attempt: 6 })
Vue.use(dataV)

// 说明：为便于在控制台排查问题，直接将 router/store 暴露到 window（无条件）
try {
  window.__APP_ROUTER__ = router
  window.__APP_STORE__ = store
} catch (e) {}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted() {
    this.prevent_back();
    // 说明：开发环境将 router/store 暴露到 window，便于控制台排错
    if (process.env.NODE_ENV !== 'production') {
      window.__APP_ROUTER__ = router
      window.__APP_STORE__ = store
    }
  },
  methods: {
    toUrl(url) {
      //首先跳回顶点，防止多次添加记录
      window.history.pushState({ target: "Final", }, "", location.href);
      location.href = url;
    },
    stay() {
      history.forward();
    },
    prevent_back() {
      var that = this
      window.addEventListener("popstate", function (e) {
        history.forward();
      }, false);
    }
  }
})

router.beforeEach((to, from, next) => {
  // 说明：按开关控制是否注入百度统计脚本；开源默认关闭
  if (process.env.VUE_APP_ENABLE_BAIDU_ANALYTICS === 'true') {
    setTimeout(() => {
      let _hmt = _hmt || [];
      (() => {
        document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
        let hm = document.createElement('script');
        // 说明：百度统计 HM ID 参数化，默认使用当前 ID；开源时可通过环境变量覆盖
        const hmId = process.env.VUE_APP_BAIDU_HM_ID;
        hm.src = 'https://hm.baidu.com/hm.js?' + hmId;
        hm.id = 'baidu_tj';
        let s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);
      })();
    }, 50);
  }
  next()
})




Vue.prototype.resetSetItem = function (key, newVal) {
  if (key == 'watchStorage') {
    //创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);

        //初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, val, null, null);

        //派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, JSON.stringify(newVal))
  } else if (key == 'delStorage') {
    var delStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      delItem: function (k, val) {
        sessionStorage.setItem(k, val);

        //初始化创建的事件
        delStorageEvent.initStorageEvent('delItem', false, false, k, val, null, null);

        //派发对象
        window.dispatchEvent(delStorageEvent)
      }
    }
    return storage.delItem(key, JSON.stringify(newVal))
  }
}

Vue.directive('showTips', {
  // el {element} 当前元素
  componentUpdated(el) {
    const curStyle = window.getComputedStyle(el, '') // 获取当前元素的style
    const textSpan = document.createElement('span') // 创建一个容器来记录文字的width
    // 设置新容器的字体样式，确保与当前需要隐藏的样式相同
    textSpan.style.fontSize = curStyle.fontSize
    textSpan.style.fontWeight = curStyle.fontWeight
    textSpan.style.fontFamily = curStyle.fontFamily
    // 将容器插入body，如果不插入，offsetWidth为0
    document.body.appendChild(textSpan)
    // 设置新容器的文字
    textSpan.innerHTML = el.innerText
    // 如果字体元素大于当前元素，则需要隐藏
    if (textSpan.offsetWidth > el.offsetWidth) {
      // 给当前元素设置超出隐藏
      el.style.overflow = 'hidden'
      el.style.textOverflow = 'ellipsis'
      el.style.whiteSpace = 'nowrap'
      // 鼠标移入
      el.onmouseenter = function (e) {
        // 创建浮层元素并设置样式
        const vcTooltipDom = document.createElement('div')
        vcTooltipDom.style.cssText = `
          max-width:400px;
          max-height: 400px;
          overflow: auto;
          position:absolute;
          top:${e.clientY + 5}px;
          left:${e.clientX}px;
          background: rgba(0, 0 , 0, .6);
          color:#fff;
          border-radius:5px;
          padding:10px;
          display:inline-block;
          font-size:12px;
          z-index:19999
        `
        // 设置id方便寻找
        vcTooltipDom.setAttribute('id', 'vc-tooltip')
        // 将浮层插入到body中
        document.body.appendChild(vcTooltipDom)
        // 浮层中的文字
        document.getElementById('vc-tooltip').innerHTML = el.innerText
      }
      // 鼠标移出
      el.onmouseleave = function () {
        // 找到浮层元素并移出
        const vcTooltipDom = document.getElementById('vc-tooltip')
        vcTooltipDom && document.body.removeChild(vcTooltipDom)
      }
    }
    // 记得移除刚刚创建的记录文字的容器
    document.body.removeChild(textSpan)
  },
  // 指令与元素解绑时
  unbind() {
    // 找到浮层元素并移除
    const vcTooltipDom = document.getElementById('vc-tooltip')
    vcTooltipDom && document.body.removeChild(vcTooltipDom)
  }
})