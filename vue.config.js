// const envConfig = require('./config')
const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve (dir) {
  return path.join(__dirname, dir)
}

const isPro = process.env.NODE_ENV === 'production'

// const type = process.env.NODE_ENV == 'production' ? envConfig.build.env.TYPE : envConfig.dev.env.TYPE

module.exports = {
  // 基本路径
  publicPath: './',

  // webpack配置
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_view', resolve('src/views'))
      .set('_api', resolve('src/api'))
      .set('_com', resolve('src/components'))
      .set('_utils', resolve('src/utils'))
    config.resolve.symlinks(true) // 修复HMR
    config.module.rules.delete('svg')
    config.module
      .rule('svg-smart')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },

  configureWebpack: (config) => {
    if (isPro) {
      return {
        plugins: [
          // 使用包分析工具
          new BundleAnalyzerPlugin()
        ]
      }
    }
  },

  // css相关配置
  css: {
    loaderOptions: {}
  },

  // 相当于webpack-dev-server，对本地服务器进行配置
  devServer: {
    open: true, // 是否自动打开浏览器页面
    host: '0.0.0.0', // 指定一个host，默认是localhost
    port: 8080, // 端口地址
    https: false, // 使用https服务
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://127.0.0.1:8080/mock',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    // 提供在服务器内部的其他中间件之前执行自定义中间件的能力
    before: app => {},
    after: require('./mock/mock-server.js')
  },

  // 第三方插件配置
  pluginOptions: {},

  runtimeCompiler: true
}
