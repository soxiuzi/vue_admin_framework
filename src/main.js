import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import Axios from 'axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './styles/antd.scss'
import './styles/common.scss'
import '@/icons' // 全局注册svg组件
import animated from 'animate.css'
import Print from 'vue-print-nb'
// import './permission'

Vue.prototype.$axios = Axios

Vue.use(animated)
Vue.use(Antd)
Vue.use(Print)

if (process.env.NODE_ENV === 'development') {
  console.log('开发模式')
  require('../mock/index.js')
}

if (process.env.NODE_ENV !== 'production') {
  Vue.config.performance = true
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
