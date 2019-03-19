import axios from 'axios'
const config = require('../../config/index.js')

const durationTime = 3 * 1000;

// process.env.NODE_ENV == 'production' ? config.build.env.Base_url : config.dev.env.Base_url

// 创建axios实例
let service = axios.create({
  baseURL: "/api",
  // 请求超时时间
  timeout: 50000,
  // 跨域是否需要凭证
  withCredentials: false
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 设置自定义请求头
    config.header = {
      'X-Requested-With': 'XMLHttpRequest'
    };
    // 最大重定向数
    config.maxRedirects = 0;
    return config
  },
  error => {
    // 请求错误
    return Promise.reject(error)
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => response,
  error => {
    return new Promise((resolve, reject) => {
      // console.log(error.response)
      if (error.response == null) {
        alert('网络异常', 'error', durationTime);
        reject(error)
      } else {
        switch (error.response.status) {
          case 500: // 处理500状态码
            let res = error.response.data;
            if (res.code === 500) {
              // 运行时异常
              alert(`运行时异常：${res.code} ${res.message}`, 'error', durationTime);
            } else {
              // 业务异常
              alert(`业务异常: ${res.code} ${res.message}`, 'error', durationTime);
            }
            reject(error);
            break;
          case 403:
            alert('无权访问', 'warning', durationTime);
            break;
        }
      }
    })
  }
)

export default service
