import { createI18n } from 'vue-i18n'
import messages from './langs/index'

let lan = navigator.systemLanguage || navigator.language;
const lang =
    lan === "zh" || lan === "zh-CN" || lan === "zh-cn" ? "zh" : "en";
const i18n = createI18n({
    legacy: true,
    globalInjection: true,
    locale: lang,
    fallbackLocale: 'zh',
    messages,
    silentTranslationWarn: process.env.NODE_ENV === 'production',
    missingWarn: process.env.NODE_ENV !== 'production',
    fallbackWarn: false
})

export default i18n
