import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './router/permission'
import ElementPlus, { ElDialog, ElTimeline, ElTimelineItem, ElSlider, ElSwitch } from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/element-icons/icon.css'
import './assets/element-plus-compat.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import axios from 'axios'
import qs from 'qs.js'
import $ from 'jquery'
import store from './store/index'
import echarts from './utils/echartsLegacy'
import VueLazyload from 'vue-lazyload'
import './utils/flexible'
import websocket from './common/WebSocket'
import Velocity from 'velocity-animate'
import DataVVue3 from '@kjgl77/datav-vue3'
import '@kjgl77/datav-vue3/dist/style.css'
import i18n from './i18n/i18n'
import VScaleScreen from 'v-scale-screen'
import eventBus from './utils/eventBus'

window.$ = window.jQuery = $

const app = createApp(App)

app.component('VScaleScreen', VScaleScreen)
app.component('Timeline', ElTimeline)
app.component('TimelineItem', ElTimelineItem)
app.component('Slider', ElSlider)
app.component('i-switch', ElSwitch)

app.config.globalProperties.websocket = websocket
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_API_BASE
app.config.globalProperties.$axios = axios
app.config.globalProperties.qs = qs
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$EventBus = eventBus
app.config.globalProperties.Velocity = Velocity
app.config.globalProperties.$set = (target, key, val) => {
  if (target && typeof target === 'object') target[key] = val
  return target
}
app.config.globalProperties.$delete = (target, key) => {
  if (target && typeof target === 'object') delete target[key]
}

if (process.env.NODE_ENV === 'production') {
  app.config.performance = false
} else {
  app.config.performance = true
}

app.config.errorHandler = function (err, instance, info) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Vue errorHandler:', err, info)
  }
}
window.addEventListener('unhandledrejection', function (event) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled Promise Rejection:', event.reason)
  }
})

const lang =
  (navigator.systemLanguage || navigator.language || '').toLowerCase().indexOf('zh') === 0
    ? 'zh'
    : 'en'
app.use(i18n)
app.use(ElementPlus, { locale: lang === 'zh' ? zhCn : en })
ElDialog.props.lockScroll.default = false

app.use(VueLazyload, { attempt: 6 })
app.use(DataVVue3)
app.use(store)
app.use(router)

app.config.globalProperties.resetSetItem = function (key, newVal) {
  if (key == 'watchStorage') {
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)
        newStorageEvent.initStorageEvent('setItem', false, false, k, val, null, null)
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, JSON.stringify(newVal))
  } else if (key == 'delStorage') {
    var delStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      delItem: function (k, val) {
        sessionStorage.setItem(k, val)
        delStorageEvent.initStorageEvent('delItem', false, false, k, val, null, null)
        window.dispatchEvent(delStorageEvent)
      }
    }
    return storage.delItem(key, JSON.stringify(newVal))
  }
}

app.directive('showTips', {
  updated(el) {
    const curStyle = window.getComputedStyle(el, '')
    const textSpan = document.createElement('span')
    textSpan.style.fontSize = curStyle.fontSize
    textSpan.style.fontWeight = curStyle.fontWeight
    textSpan.style.fontFamily = curStyle.fontFamily
    document.body.appendChild(textSpan)
    textSpan.innerHTML = el.innerText
    if (textSpan.offsetWidth > el.offsetWidth) {
      el.style.overflow = 'hidden'
      el.style.textOverflow = 'ellipsis'
      el.style.whiteSpace = 'nowrap'
      el.onmouseenter = function (e) {
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
        vcTooltipDom.setAttribute('id', 'vc-tooltip')
        document.body.appendChild(vcTooltipDom)
        document.getElementById('vc-tooltip').innerHTML = el.innerText
      }
      el.onmouseleave = function () {
        const vcTooltipDom = document.getElementById('vc-tooltip')
        vcTooltipDom && document.body.removeChild(vcTooltipDom)
      }
    }
    document.body.removeChild(textSpan)
  },
  unmounted() {
    const vcTooltipDom = document.getElementById('vc-tooltip')
    vcTooltipDom && document.body.removeChild(vcTooltipDom)
  }
})

try {
  window.__APP_ROUTER__ = router
  window.__APP_STORE__ = store
} catch (e) {}

app.mount('#app')

router.beforeEach((to, from, next) => {
  if (process.env.VUE_APP_ENABLE_BAIDU_ANALYTICS === 'true') {
    setTimeout(() => {
      let _hmt = _hmt || []
      ;(() => {
        document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove()
        let hm = document.createElement('script')
        const hmId = process.env.VUE_APP_BAIDU_HM_ID
        hm.src = 'https://hm.baidu.com/hm.js?' + hmId
        hm.id = 'baidu_tj'
        let s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(hm, s)
      })()
    }, 50)
  }
  next()
})
