import Vue from 'vue'
// import store from '../store'
import Router from 'vue-router'
import { PAGEBREAD } from '@/var/pageBread.js'
// import NProgress from 'nprogress'

Vue.use(Router)

// let base = `${process.env.BASE_URL}` // 动态设置二级目录

let router = new Router({
  // mode: 'hash',
  routes: [
    {
      path: '',
      name: 'index',
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          meta: {
            title: '首页'
          },
          component: () =>
            import(/* webpackChunkName: "welcome" */ '_view/Welcome')
        }
      ],
      meta: {
        title: '后端管理系统'
      },
      component: () => import(/* webpackChunkName: "home" */ '_view/Layout')
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册'
      },
      component: () =>
        import(/* webpackChunkName: "register" */ '_view/Register')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: () => import(/* webpackChunkName: "login" */ '_view/Login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // NProgress.start()
  let title = to.meta && to.meta.title
  if (title) {
    document.title = title
  }
  PAGEBREAD.forEach(item => {
    if (document.title === item.title) {
      let headerInfo = {
        explain: item.explain,
        title: item.title
      }
      store.dispatch('setHeaderInfo', headerInfo)
    }
  })
  // if (store.getters.token) {
  //   if (to.path == '/login') {
  //     NProgress.done()
  //     next({
  //       path: '/'
  //     })
  //   } else {
  //     store.dispatch('GetUserInfo').then().catch(err => {
  //       message.error("请求出错！")
  //     })
  //     NProgress.done()
  //     next()
  //   }
  // } else {
  //   NProgress.done()
  //   // console.log('token不存在')
  //   next()
  // }
  next()
})

export default router
