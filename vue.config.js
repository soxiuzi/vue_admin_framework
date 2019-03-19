const config = require('./config')

const type = process.env.NODE_ENV == 'production' ? config.build.env.TYPE : config.dev.env.TYPE

module.exports = {
    publicPath: '/', // 基本路径
    outputDir: 'dist', // 输出目录
    lintOnSave: true, // eslint-loader 是否在保存时检查
    // webpack配置
    chainWebpack: () => {},
    configureWebpack: () => {},
    productionSourceMap: true, // 生产环境是否生成sourceMap文件
    // css相关配置
    css: {
        extract: true, // 是否使用css分离插件，ExtractTextPlugin
        sourceMap: false, // 开启css source maps？
        loaderOptions: {}, // css预设器配置项
        modules: false, // 启用CSS modules for all css / pre-processor files
    },
    // 相当于webpack-dev-server，对本地服务器进行配置 
    devServer: {
        open: true, // 是否自动打开浏览器页面
        host: '0.0.0.0', // 指定一个host，默认是localhost
        port: 8080, // 端口地址
        https: false, // 使用https服务
        proxy: {
            "/api": {
                target: 'https://api.douban.com',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": ''
                }
            }
        }, // string | object 代理设置
        // 提供在服务器内部的其他中间件之前执行自定义中间件的能力
        before: app => {

        }
    },
    // 第三方插件配置
    pluginOptions: {}
};