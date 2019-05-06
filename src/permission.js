import router from './router'
import store from './store'
import { message } from 'ant-design-vue'


router.beforeEach((to, from, next) => {
  let title = to.meta && to.meta.title
  if(title) {
    document.title = title
  }
  if (store.getters.token) {
    if (to.path == '/login') {
      next({
        path: '/'
      })
    } else {
      store.dispatch('GetUserInfo').then().catch(err => {
        message.error("请求出错！")
      })
      next()
    }
  } else {
    // console.log('token不存在')
    next()
  }
})