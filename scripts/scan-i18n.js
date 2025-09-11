const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')
const EXTS = new Set(['.js', '.vue'])
const zhRe = /[\u4e00-\u9fa5]/

function* walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      if (/node_modules|dist|static|public/.test(p)) continue
      yield* walk(p)
    } else if (EXTS.has(path.extname(name))) {
      yield p
    }
  }
}

let count = 0
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8')
  if (zhRe.test(text)) {
    console.log(file)
    count++
  }
}
console.log(`Chinese-hardcode files: ${count}`)
