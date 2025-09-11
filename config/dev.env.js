'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 开发环境配置：使用 .env.local 文件中的配置
  // 如需自定义，请在 .env.local 文件中设置对应的环境变量
})
