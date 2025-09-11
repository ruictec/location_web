module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential'
  ],
  plugins: ['vue'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'warn',
    'prefer-const': 'warn',
    // 放宽部分历史代码的校验为 warn，避免开源首次阻塞
    'no-undef': 'warn',
    'no-useless-escape': 'warn',
    'no-irregular-whitespace': 'warn',
    'no-extra-semi': 'warn',
    'no-redeclare': 'warn',
    'no-unreachable': 'warn',
    'no-duplicate-case': 'warn',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn'
  },
  globals: {
    $: 'readonly',
    jQuery: 'readonly'
  }
}

