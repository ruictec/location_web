/**
 * 浏览器 / 运行环境识别，用于登录页记录环境信息、排查兼容性问题（如大屏图表、全屏、分辨率相关表现）。
 *
 * 注意：User-Agent 可以被伪造或裁剪（部分 App 内置浏览器），因此结果只用于提示与排障，
 * 不能作为安全判断依据。
 */

// 顺序敏感：国产壳浏览器 / Edge 的 UA 里同时包含 Chrome、Safari 标识，必须排在前面
const BROWSER_RULES = [
  { name: '微信内置浏览器', re: /MicroMessenger\/([\d.]+)/i },
  { name: '企业微信内置浏览器', re: /wxwork\/([\d.]+)/i },
  { name: '钉钉内置浏览器', re: /DingTalk\/([\d.]+)/i },
  { name: 'QQ浏览器', re: /(?:QQBrowser|MQQBrowser)\/([\d.]+)/i },
  // 360 安全浏览器 / 极速浏览器的常见写法：QIHU 360SE、QIHU 360EE、QihooBrowser、360SE 等
  { name: '360浏览器', re: /(?:QIHU\s*360(?:SE|EE)?|QihooBrowser|360(?:SE|EE|Browser|Chrome))[/\s]?([\d.]*)/i },
  { name: '搜狗浏览器', re: /(?:MetaSr|SogouMobileBrowser)\/([\d.]+)/i },
  { name: 'UC浏览器', re: /UCBrowser\/([\d.]+)/i },
  { name: '百度浏览器', re: /(?:BIDUBROWSER|baidubrowser)\/([\d.]+)/i },
  { name: '2345浏览器', re: /2345Explorer\/([\d.]+)/i },
  { name: '猎豹浏览器', re: /LBBROWSER(?:[/\s]([\d.]+))?/i },
  { name: 'Edge', re: /(?:Edg|Edge|EdgA|EdgiOS)\/([\d.]+)/i },
  { name: 'Opera', re: /(?:OPR|Opera)\/([\d.]+)/i },
  { name: 'Firefox', re: /(?:Firefox|FxiOS)\/([\d.]+)/i },
  { name: 'Chrome', re: /(?:Chrome|CriOS)\/([\d.]+)/i },
  { name: 'Safari', re: /Version\/([\d.]+)[\s\S]*Safari/i },
  { name: 'IE', re: /(?:MSIE\s|Trident\/[\s\S]*rv:)([\d.]+)/i }
]

const OS_RULES = [
  { name: 'Windows', re: /Windows NT ([\d.]+)/i },
  { name: 'Android', re: /Android\s?([\d.]+)/i },
  { name: 'iOS', re: /(?:iPhone|iPad|iPod)[\s\S]*?OS ([\d_]+)/i },
  { name: 'macOS', re: /Mac OS X ([\d_.]+)/i },
  { name: 'HarmonyOS', re: /HarmonyOS(?:[/\s]([\d.]+))?/i },
  { name: 'Linux', re: /Linux/i }
]

const MOBILE_RE = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i

// Windows NT 版本号与产品名对应（NT 10.0 无法区分 Win10 / Win11）
const WINDOWS_VERSION_MAP = {
  '10.0': '10/11',
  '6.3': '8.1',
  '6.2': '8',
  '6.1': '7'
}

function matchFirst(ua, rules) {
  for (const rule of rules) {
    const m = ua.match(rule.re)
    if (m) {
      return { name: rule.name, version: (m[1] || '').replace(/_/g, '.') }
    }
  }
  return { name: '未知浏览器', version: '' }
}

function resolveEngine(name) {
  if (name === 'IE') return 'Trident'
  if (name === 'Firefox') return 'Gecko'
  if (name === 'Safari') return 'WebKit'
  if (name === '未知浏览器') return '未知'
  // Edge、Chrome 以及国产壳浏览器基本都是 Chromium 内核
  return 'Blink'
}

function resolveBrands() {
  try {
    const data = typeof navigator !== 'undefined' ? navigator.userAgentData : null
    return data && Array.isArray(data.brands) ? data.brands : []
  } catch (e) {
    return []
  }
}

/**
 * @param {string} [ua] 自定义 User-Agent，默认取 navigator.userAgent
 * @returns {{
 *   name: string, version: string, engine: string,
 *   os: string, osVersion: string,
 *   isMobile: boolean, isWechat: boolean, isChromium: boolean, ua: string
 * }}
 */
export function getBrowserInfo(ua) {
  const userAgent = ua || (typeof navigator !== 'undefined' ? navigator.userAgent : '')
  const browser = matchFirst(userAgent, BROWSER_RULES)
  const os = matchFirst(userAgent, OS_RULES)
  const osVersion =
    os.name === 'Windows'
      ? WINDOWS_VERSION_MAP[os.version] || os.version
      : (os.version || '').replace(/_/g, '.')
  const isMobile = MOBILE_RE.test(userAgent)
  const isChromium =
    /Chrome\/|CriOS\/|Edg\//i.test(userAgent) && !/(?:MSIE|Trident)/i.test(userAgent)

  // UA-CH 品牌信息（仅 Chromium 系支持）：360、QQ 等壳浏览器常把 UA 精简成纯 Chrome，
  // 但 brands 里不会出现 "Google Chrome"，可据此识别“伪装成 Chrome 的壳浏览器”
  const brands = resolveBrands()
  const brandText = brands.map((b) => String(b.brand || '')).join('|')
  const hasUAData = brands.length > 0
  // 注意：UA-CH 只在安全上下文（HTTPS / localhost）暴露。用 http://IP 访问时，
  // 正版 Chrome 同样没有 navigator.userAgentData，此时绝不能据此判壳浏览器，否则误报
  const secureContext =
    typeof window === 'undefined' ? false : window.isSecureContext !== false
  // iOS 上的 CriOS / FxiOS / EdgiOS 本身不提供 UA-CH，不能据此判为壳浏览器
  const isIOSBrowser = /CriOS|FxiOS|EdgiOS/i.test(userAgent)
  const isShellBrowser =
    secureContext &&
    browser.name === 'Chrome' &&
    !isIOSBrowser &&
    (hasUAData
      ? !/Google Chrome/i.test(brandText) &&
        !/Microsoft Edge/i.test(brandText) &&
        !/Opera|Brave|Vivaldi|Yandex/i.test(brandText)
      : isChromium) // 安全上下文下桌面 Chrome 90+ 必有 UA-CH，缺失即为魔改内核

  return {
    name: browser.name,
    version: browser.version,
    engine: resolveEngine(browser.name),
    os: os.name,
    osVersion,
    isMobile,
    isWechat: /MicroMessenger/i.test(userAgent),
    isChromium,
    isShellBrowser,
    hasUAData,
    secureContext,
    brands: brandText,
    ua: userAgent
  }
}

/** 便于日志/上报的单行文本，例如：Chrome 128.0.0.0 | Blink | Windows 10 */
export function formatBrowserInfo(info) {
  const parts = [info.name, info.version].filter(Boolean).join(' ')
  const os = [info.os, info.osVersion].filter(Boolean).join(' ')
  return `${parts} | ${info.engine} | ${os}${info.isMobile ? ' | 移动端' : ''}`
}
