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

Vue.prototype.$axios = Axios

Vue.use(animated)
Vue.use(Antd)

if (process.env.NODE_ENV !== 'production') {
  Vue.config.performance = true
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
