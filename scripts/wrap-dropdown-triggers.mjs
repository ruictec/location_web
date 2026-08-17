import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const nativeTags = new Set(['span', 'a', 'button', 'i', 'img', 'div', 'p', 'label'])

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else if (name.endsWith('.vue')) files.push(full)
  }
  return files
}

function findOpenTagEnd(src, start) {
  let quote = null
  for (let i = start; i < src.length; i++) {
    const c = src[i]
    if (quote) {
      if (c === quote) quote = null
      continue
    }
    if (c === '"' || c === "'") {
      quote = c
      continue
    }
    if (c === '>') return i
  }
  return -1
}

function firstTagName(html) {
  const m = html.trim().match(/^<([A-Za-z][\w-]*)/)
  return m ? m[1] : ''
}

function wrapFile(src) {
  let out = ''
  let i = 0
  let changed = 0
  while (i < src.length) {
    const idx = src.indexOf('<el-dropdown', i)
    if (idx === -1) {
      out += src.slice(i)
      break
    }
    if (!/^<el-dropdown[\s>]/.test(src.slice(idx, idx + 16))) {
      out += src.slice(i, idx + 12)
      i = idx + 12
      continue
    }
    const tagEnd = findOpenTagEnd(src, idx)
    if (tagEnd === -1) {
      out += src.slice(i)
      break
    }
    const openTag = src.slice(idx, tagEnd + 1)
    if (openTag.endsWith('/>')) {
      out += src.slice(i, tagEnd + 1)
      i = tagEnd + 1
      continue
    }
    const after = src.slice(tagEnd + 1)
    const slotMatch = after.match(/<template\s+#dropdown|<template\s+v-slot:dropdown/)
    if (!slotMatch) {
      out += src.slice(i, tagEnd + 1)
      i = tagEnd + 1
      continue
    }
    const between = after.slice(0, slotMatch.index)
    const tag = firstTagName(between)
    if (!tag || nativeTags.has(tag) || tag === 'template') {
      out += src.slice(i, tagEnd + 1)
      i = tagEnd + 1
      continue
    }
    const indentMatch = between.match(/^\s*/)
    const indent = indentMatch ? indentMatch[0].replace(/^\n/, '\n') : '\n'
    const inner = between.replace(/^\s*\n/, '\n').replace(/\s*$/, '')
    const wrapped = `${indent}<span class="el-dropdown-link">${inner}${indent}</span>\n`
    out += src.slice(i, tagEnd + 1) + wrapped
    i = tagEnd + 1 + slotMatch.index
    changed++
  }
  return { out, changed }
}

let total = 0
const files = walk(root)
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const { out, changed } = wrapFile(src)
  if (changed) {
    fs.writeFileSync(file, out)
    total += changed
    console.log(`${path.relative(root, file)}: wrapped ${changed}`)
  }
}
console.log(`done, wrapped ${total} dropdowns`)
