
module.exports = {
    // 开发环境变量
    dev: {
        env: {
            Base_url: 'https://api.douban.com',
        }
    },
    // 生产环境变量
    build: {
        env: {
            Base_url: 'http://192.168.1.13',
        }
    }
}