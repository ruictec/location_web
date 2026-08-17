import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) walk(full, files)
    else if (name.endsWith('.vue')) files.push(full)
  }
  return files
}

function convertShortcutClicks(src) {
  return src.replace(
    /onClick\s*\(\s*picker\s*\)\s*\{([\s\S]*?)picker\.\$emit\(\s*["']pick["']\s*,\s*(\[[^\]]+\])\s*\)\s*;?/g,
    (_, body, value) => `value() {${body}return ${value};`
  )
}

function replacePickerOptionsAttr(src) {
  return src.replace(
    /:picker-options="pickerOptions"/g,
    ':shortcuts="pickerOptions.shortcuts" :disabled-date="pickerOptions.disabledDate" @calendar-change="(val) => pickerOptions.onPick && pickerOptions.onPick({ minDate: val[0], maxDate: val[1] })"'
  )
}

function stripModalAppend(src) {
  return src
    .replace(/\s*:modal-append-to-body="false"/g, '')
    .replace(/\s*modal-append-to-body(?:="[^"]*")?/g, '')
}

function convertDateFormats(src) {
  return src
    .replace(/((?:value-)?format=")yyyy-MM-dd"/g, '$1YYYY-MM-DD"')
}

function convertTextButtons(src) {
  return src.replace(/<el-button\b([\s\S]*?)>/g, (full, attrs) => {
    if (!/type\s*=\s*["']text["']/.test(attrs)) return full
    let next = attrs.replace(/\s*type\s*=\s*["']text["']/, '')
    if (!/(^|\s)text(\s|=|$)/.test(next)) next = ` text${next}`
    return `<el-button${next}>`
  })
}

let changedFiles = 0
for (const file of walk(root)) {
  const before = fs.readFileSync(file, 'utf8')
  let next = before
  next = convertShortcutClicks(next)
  next = replacePickerOptionsAttr(next)
  next = stripModalAppend(next)
  next = convertDateFormats(next)
  next = convertTextButtons(next)
  if (next !== before) {
    fs.writeFileSync(file, next)
    changedFiles++
    console.log(path.relative(root, file))
  }
}
console.log(`updated ${changedFiles} files`)
