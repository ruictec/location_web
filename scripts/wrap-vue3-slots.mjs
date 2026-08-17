/**
 * Wrap remaining Vue 2 slot="name" attributes into Vue 3 <template #name>.
 * Menu-item title slots are stripped instead of wrapped (Element Plus has no title slot on el-menu-item).
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
    else if (name.endsWith('.vue')) acc.push(full)
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

function nearestOpenComponent(tpl, index) {
  const before = tpl.slice(Math.max(0, index - 2500), index)
  const tags = [...before.matchAll(/<\/?el-([\w-]+)[^>]*>/gi)]
  const stack = []
  for (const m of tags) {
    const name = 'el-' + m[1].toLowerCase()
    const isClose = m[0].startsWith('</')
    const selfClose = /\/\s*>$/.test(m[0])
    if (selfClose) continue
    if (isClose) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i] === name) {
          stack.splice(i)
          break
        }
      }
    } else {
      stack.push(name)
    }
  }
  return stack[stack.length - 1] || ''
}

function transformTemplate(tpl) {
  const tagRe = /<([a-zA-Z][\w-]*)([^>]*?)\sslot=(["'])([^"']*)\3([^>]*?)(\s*\/>|>)/g
  const matches = []
  let m
  while ((m = tagRe.exec(tpl)) !== null) {
    if (m[1].toLowerCase() === 'template') continue
    matches.push({
      start: m.index,
      end: m.index + m[0].length,
      tag: m[1],
      pre: m[2],
      slot: m[4],
      post: m[5],
      selfClosing: m[6].includes('/')
    })
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i]
    const parent = nearestOpenComponent(tpl, match.start)
    const attrs = `${match.pre}${match.post}`.replace(/\sslot=(["'])[^"']*\1/, '')
    const newOpen = `<${match.tag}${attrs}${match.selfClosing ? ' />' : '>'}`

    // Element Plus el-menu-item 没有 title 插槽，去掉 slot 后作为默认内容渲染
    if (match.slot === 'title' && parent === 'el-menu-item') {
      tpl = tpl.slice(0, match.start) + newOpen + tpl.slice(match.end)
      continue
    }

    if (match.selfClosing) {
      tpl =
        tpl.slice(0, match.start) +
        `<template #${match.slot}>${newOpen}</template>` +
        tpl.slice(match.end)
      continue
    }
    const closeIdx = findMatchingClose(tpl, match.end, match.tag)
    if (closeIdx < 0) continue
    const closeEnd = tpl.indexOf('>', closeIdx) + 1
    const innerNew = newOpen + tpl.slice(match.end, closeEnd)
    tpl =
      tpl.slice(0, match.start) +
      `<template #${match.slot}>${innerNew}</template>` +
      tpl.slice(closeEnd)
  }

  tpl = tpl.replace(
    /<(el-button\b[^>]*?)\sicon=(["'])(el-icon-[^"']+)\2([^>]*)>/g,
    (all, pre, _q, icon, post) => {
      if (/\/\s*$/.test(post)) {
        return `<el-button${pre}${post.replace(/\s*\/\s*$/, '')}><i class="${icon}"></i></el-button>`
      }
      return `<el-button${pre}${post}><i class="${icon}"></i>`
    }
  )

  return tpl
}

function transformScript(script) {
  return script.replace(
    /require\(\s*(['"])(?:\.\.\/)+static\/([^'"]+)\1\s*\)/g,
    `(process.env.BASE_URL || '/') + 'static/$2'`
  )
}

let changed = 0
for (const file of walk(srcDir)) {
  const original = fs.readFileSync(file, 'utf8')
  const sfc = splitSfc(original)
  let next = original
  if (sfc) {
    next = sfc.before + sfc.openTag + transformTemplate(sfc.template) + sfc.closeTag + transformScript(sfc.after)
  } else {
    next = transformScript(original)
  }
  if (next !== original) {
    fs.writeFileSync(file, next)
    changed++
    console.log('updated', path.relative(srcDir, file))
  }
}
console.log(`done, ${changed} files changed`)
