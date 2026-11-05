/**
 * Safe Vue2 -> Vue3 syntax migrator.
 * Does not restructure DOM (no slot wrapping). Relies on Vue 3 compiler
 * still accepting native `slot=` attributes.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, '../src')

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, acc)
    else if (name.endsWith('.vue') || name.endsWith('.js')) acc.push(full)
  }
  return acc
}

function findMatchingClose(html, from, tag) {
  const openRe = new RegExp(`<${tag}\\b`, 'gi')
  const closeRe = new RegExp(`</${tag}\\s*>`, 'gi')
  let depth = 1
  let i = from
  while (i < html.length) {
    openRe.lastIndex = i
    closeRe.lastIndex = i
    const open = openRe.exec(html)
    const close = closeRe.exec(html)
    if (!close) return -1
    if (open && open.index < close.index) {
      const tagEnd = html.indexOf('>', open.index)
      if (tagEnd < 0) return -1
      const slice = html.slice(open.index, tagEnd + 1)
      if (!/\/\s*>$/.test(slice)) depth++
      i = tagEnd + 1
    } else {
      depth--
      if (depth === 0) return close.index
      i = close.index + close[0].length
    }
  }
  return -1
}

function splitSfc(content) {
  const start = content.search(/<template(\s[^>]*)?>/i)
  if (start < 0) return null
  const openEnd = content.indexOf('>', start)
  if (openEnd < 0) return null
  const close = findMatchingClose(content, openEnd + 1, 'template')
  if (close < 0) return null
  const closeEnd = content.indexOf('>', close) + 1
  return {
    before: content.slice(0, start),
    openTag: content.slice(start, openEnd + 1),
    template: content.slice(openEnd + 1, close),
    closeTag: content.slice(close, closeEnd),
    after: content.slice(closeEnd)
  }
}

function transformTemplate(tpl) {
  tpl = tpl.replace(
    /<template([^>]*?)\sslot-scope=(["'])([^"']*)\2([^>]*)>/g,
    (m, a, _q, scope, b) => {
      const all = `${a} ${b}`
      const slotMatch = all.match(/\sslot=(["'])([^"']*)\1/)
      const slotName = slotMatch ? slotMatch[2] : 'default'
      const rest = all.replace(/\sslot=(["'])[^"']*\1/, '').replace(/\sslot-scope=(["'])[^"']*\1/, '').trim()
      return `<template #${slotName}="${scope}"${rest ? ` ${rest}` : ''}>`
    }
  )

  tpl = tpl.replace(
    /<template([^>]*?)\sslot=(["'])([^"']*)\2([^>]*)>/g,
    (m, a, _q, name, b) => {
      const rest = `${a} ${b}`.trim()
      if (/#|v-slot/.test(rest)) return m
      return `<template #${name}${rest ? ` ${rest}` : ''}>`
    }
  )

  tpl = tpl.replace(/:visible\.sync=/g, 'v-model=')
  tpl = tpl.replace(/v-bind:visible\.sync=/g, 'v-model=')
  tpl = tpl.replace(/:([\w-]+)\.sync=/g, 'v-model:$1=')
  tpl = tpl.replace(/v-bind:([\w-]+)\.sync=/g, 'v-model:$1=')

  tpl = tpl.replace(/(@[\w-]+)((?:\.[a-zA-Z0-9-]+)*)/g, (all, event, mods) => {
    return event + mods.replace(/\.native/g, '')
  })

  tpl = tpl.replace(/\ssize=["']mini["']/g, ' size="small"')
  tpl = tpl.replace(/\ssize=["']medium["']/g, '')
  tpl = tpl.replace(/:popper-append-to-body=/g, ':teleported=')
  tpl = tpl.replace(/\spopper-append-to-body(?=[\s>])/g, '')
  tpl = tpl.replace(/el-submenu(?!2)/g, 'el-sub-menu')
  return tpl
}

function transformStyles(css) {
  return css.replace(
    /(\.[^\s{][^{]*?)\s*(>>>|\/deep\/|::v-deep)\s*([^{]+)\{/g,
    (m, left, _op, right) => `${left.trim()} :deep(${right.trim()}) {`
  )
}

function transformScript(script) {
  script = script.replace(/\bbeforeDestroy\s*\(/g, 'beforeUnmount(')
  script = script.replace(/\bdestroyed\s*\(/g, 'unmounted(')
  script = script.replace(
    /\b(\w+)\.\$set\(\s*([^,]+)\s*,\s*(['"][^'"]+['"]|[^,]+)\s*,\s*([^)]+)\)/g,
    (m, obj, target, key, value) => `${target.trim()}[${key.trim()}] = ${value.trim()}`
  )
  script = script.replace(/from\s+["']vue-count-to["']/g, 'from "vue3-count-to"')
  script = script.replace(
    /import\s+Fullscreen\s+from\s+["']vue-fullscreen\/src\/component\.vue["']/g,
    'import { component as Fullscreen } from "vue-fullscreen"'
  )
  script = script.replace(/\bi18n\.t\(/g, 'i18n.global.t(')
  script = script.replace(/el-submenu(?!2)/g, 'el-sub-menu')
  return script
}

function transformFile(file) {
  const original = fs.readFileSync(file, 'utf8')
  let next = original
  if (file.endsWith('.vue')) {
    const sfc = splitSfc(next)
    if (sfc) {
      const template = transformTemplate(sfc.template)
      const after = transformStyles(transformScript(sfc.after))
      next = sfc.before + sfc.openTag + template + sfc.closeTag + after
    } else {
      next = transformScript(next)
    }
  } else {
    next = transformScript(next)
  }
  if (next !== original) {
    fs.writeFileSync(file, next)
    return true
  }
  return false
}

let changed = 0
for (const file of walk(srcDir)) {
  if (file.endsWith('Sidebar/Item.vue')) continue
  if (transformFile(file)) {
    changed++
    console.log('updated', path.relative(srcDir, file))
  }
}
console.log(`done, ${changed} files changed`)
