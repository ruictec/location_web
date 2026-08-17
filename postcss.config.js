module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // 1920 设计稿：1rem = 192px，与 flexible 根字号（视口宽度 / 10）对应
      rootValue: 192,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['.norem'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 2,
      exclude: (file) => {
        if (!file) return false
        const normalized = file.replace(/\\/g, '/')
        if (normalized.includes('/element-plus/')) return false
        return normalized.includes('/node_modules/')
      }
    }
  }
}
