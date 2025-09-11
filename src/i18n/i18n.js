import Vue from 'vue'
import locale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n'
import messages from './langs/index'
Vue.use(VueI18n)
let lan = navigator.systemLanguage || navigator.language;
const lang =
    lan === "zh" || lan === "zh-CN" || lan === "zh-cn" ? "zh" : "en";
const i18n = new VueI18n({
    // locale: localStorage.getItem('lang'),  //初始未选择默认 cn 中文
    locale: lang,  //初始未选择默认 cn 中文
    messages,
    // 说明：开发环境打开缺失键警告，生产环境静默
    silentTranslationWarn: process.env.NODE_ENV === 'production'
})
locale.i18n((key, value) => i18n.t(key, value)) //兼容element

export default i18n