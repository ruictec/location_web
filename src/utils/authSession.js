const STATE_KEY = 'state'
const SESSION_FLAG = 'hasActiveSession'
const TAB_ID_KEY = 'authTabId'
const CHANNEL_NAME = 'location_web_auth'

export function getTabId() {
  try {
    let id = window.sessionStorage.getItem(TAB_ID_KEY)
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
      window.sessionStorage.setItem(TAB_ID_KEY, id)
    }
    return id
  } catch (e) {
    return 'tab'
  }
}

export function getSessionState() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STATE_KEY) || 'null')
  } catch (e) {
    return null
  }
}

export function getSessionUserInfo() {
  const state = getSessionState()
  return state && state.userInfo && state.userInfo.prionum ? state.userInfo : null
}

export function hasTabSession() {
  return !!getSessionUserInfo()
}

export function persistTabSession(storeState) {
  try {
    const saved = Object.assign({}, storeState, { addRoutes: [] })
    window.sessionStorage.setItem(STATE_KEY, JSON.stringify(saved))
    window.sessionStorage.setItem(SESSION_FLAG, 'true')
    getTabId()
  } catch (e) {}
}

export function clearTabSession() {
  try {
    window.sessionStorage.removeItem(STATE_KEY)
    window.sessionStorage.removeItem(SESSION_FLAG)
  } catch (e) {}
}

let channel = null

export function getAuthChannel() {
  if (typeof BroadcastChannel === 'undefined') return null
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME)
    } catch (e) {
      channel = null
    }
  }
  return channel
}

export function notifyAuthEvent(type, payload) {
  try {
    const ch = getAuthChannel()
    if (!ch) return
    ch.postMessage(
      Object.assign(
        {
          type: type,
          tabId: getTabId(),
          ts: Date.now(),
        },
        payload || {}
      )
    )
  } catch (e) {}
}

export function closeAuthChannel() {
  if (channel) {
    try {
      channel.close()
    } catch (e) {}
    channel = null
  }
}
