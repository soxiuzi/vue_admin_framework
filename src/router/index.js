import Vue from 'vue'
// import store from '../store'
import Router from 'vue-router'
import { PAGEBREAD } from '@/var/pageBread.js'
import Layout from '_view/Layout'

// import NProgress from 'nprogress'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/welcome',
    name: '首页',
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
    ]
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册'
    },
    component: () => import(/* webpackChunkName: "register" */ '_view/Register')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "login" */ '_view/Login')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404'
    },
    component: () => import(/* webpackChunkName: "404" */ '_view/404')
  },
]

export default new Router({
  routes: constantRoutes
})

export const asyncRoutes = [
  {
    path: '/permission',
    name: 'permission',
    component: Layout,
    children: [
      {
        path: '',
        meta: {
          title: '验权页面'
        },
        component: () => import(/* webpackChunkName: "Permission" */ '_view/Permission')
      }
    ]
  }
]

// let router = new Router({
//   // mode: 'hash',
//   routes: [
//     {
//       path: '',
//       name: 'index',
//       redirect: '/welcome',
//       children: [
//         {
//           path: '/welcome',
//           name: 'welcome',
//           meta: {
//             title: '首页'
//           },
//           component: () =>
//             import(/* webpackChunkName: "welcome" */ '_view/Welcome')
//         }
//       ],
//       meta: {
//         title: '后端管理系统'
//       },
//       component: () => import(/* webpackChunkName: "home" */ '_view/Layout')
//     }
//   ]
// })

// router.beforeEach((to, from, next) => {
//   // NProgress.start()
//   let title = to.meta && to.meta.title
//   if (title) {
//     document.title = title
//   }
//   PAGEBREAD.forEach(item => {
//     if (document.title === item.title) {
//       let headerInfo = {
//         explain: item.explain,
//         title: item.title
//       }
//       store.dispatch('setHeaderInfo', headerInfo)
//     }
//   })
//   // if (store.getters.token) {
//   //   if (to.path == '/login') {
//   //     NProgress.done()
//   //     next({
//   //       path: '/'
//   //     })
//   //   } else {
//   //     store.dispatch('GetUserInfo').then().catch(err => {
//   //       message.error("请求出错！")
//   //     })
//   //     NProgress.done()
//   //     next()
//   //   }
//   // } else {
//   //   NProgress.done()
//   //   // console.log('token不存在')
//   //   next()
//   // }
//   next()
// })

// export default router
