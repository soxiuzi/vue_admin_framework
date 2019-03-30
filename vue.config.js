const envConfig = require('./config')
const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve (dir) {
  return path.join(__dirname, dir)
}

const isPro = process.env.NODE_ENV === 'production'

const type = process.env.NODE_ENV == 'production' ? envConfig.build.env.TYPE : envConfig.dev.env.TYPE

module.exports = {
  publicPath: '/', // 基本路径
  outputDir: 'dist', // 输出目录
  // webpack配置
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_view', resolve('src/views'))
      .set('_api', resolve('src/api'))
      .set('_com', resolve('src/components'))
      .set('_utils', resolve('src/utils'))
    config.resolve.symlinks(true)
    config.module.rules.delete("svg")
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
  productionSourceMap: true, // 生产环境是否生成sourceMap文件
  // css相关配置
  css: {
    // extract: true, // 是否使用css分离插件，ExtractTextPlugin
    sourceMap: false, // 开启css source maps？
    loaderOptions: {}, // css预设器配置项
    modules: false // 启用CSS modules for all css / pre-processor files
  },
  // 相当于webpack-dev-server，对本地服务器进行配置
  devServer: {
    open: true, // 是否自动打开浏览器页面
    host: '0.0.0.0', // 指定一个host，默认是localhost
    port: 8080, // 端口地址
    https: false, // 使用https服务
    proxy: {
      '/api': {
        target: 'https://api.douban.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }, // string | object 代理设置
    // 提供在服务器内部的其他中间件之前执行自定义中间件的能力
    before: app => {

    }
  },
  // 第三方插件配置
  pluginOptions: {}
}
