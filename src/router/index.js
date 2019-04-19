import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// let base = `${process.env.BASE_URL}` // 动态设置二级目录

let router = new Router({
  mode: 'history',
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
          component: () => import(/* webpackChunkName: "welcome" */ '_view/Welcome')
        },
        {
          path: '/coursemanage',
          name: 'coursemanage',
          meta: {
            title: '课程管理'
          },
          component: () => import(/* webpackChunkName: "coursemanage" */ '_view/CourseManage')
        },
        {
          path: '/majorManage',
          name: 'majormanage',
          meta: {
            title: '专业管理'
          },
          component: () => import(/* webpackChunkName: "majormanage" */ '_view/MajorManage')
        },
        {
          path: '/teachermanage',
          name: 'teachermanage',
          meta: {
            title: '教师管理'
          },
          component: () => import(/* webpackChunkName: "teachermanage" */ '_view/TeacherManage')
        },        
        {
          path: '/grademanage',
          name: 'grademanage',
          meta: {
            title: '年级管理'
          },
          component: () => import(/* webpackChunkName: "grademanage" */ '_view/GradeManage')
        },
        {
          path: '/questionmanage',
          name: 'questionmanage',
          meta: {
            title: '题目管理'
          },
          component: () => import(/* webpackChunkName: "questionmanage" */ '_view/QuestionManage')
        },
        {
          path: '/questionimport',
          name: 'questionimport',
          meta: {
            title: '题目导入'
          },
          component: () => import(/* webpackChunkName: "questionimport" */ '_view/QuestionImport')
        },
        {
          path: '/questionshare',
          name: 'questionshare',
          meta: {
            title: '题库共享'
          },
          component: () => import(/* webpackChunkName: "questionshare" */ '_view/QuestionShare')
        },
        {
          path: '/answermanage',
          name: 'answermanage',
          meta: {
            title: '答案管理'
          },
          component: () => import(/* webpackChunkName: "answermanage" */ '_view/AnswerManage')
        },
        {
          path: '/papermanage',
          name: 'papermanage',
          meta: {
            title: '出题组卷管理'
          },
          component: () => import(/* webpackChunkName: "papermanage" */ '_view/PaperManage')
        },
        {
          path: '/papermake',
          name: 'papermake',
          meta: {
            title: '组卷一键生成'
          },
          component: () => import(/* webpackChunkName: "papermake" */ '_view/PaperMake')
        }
      ],
      meta: {
        title: '医专在线题库系统'
      },
      component: () => import(/* webpackChunkName: "home" */ '_view/Layout')
    },
    {
      path: '/makeExamination',
      name: 'makeExamination',
      meta: {
        title: '编辑试卷'
      },
      component: () => import(/* webpackChunkName: "makeExamination" */ '_view/ExaminationMake')
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
      mata: {
        title: '登录'
      },
      component: () => import(/* webpackChunkName: "home" */ '_view/Login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  let title = to.meta && to.meta.title

  if (title) {
    document.title = title
  }
  next()
})

export default router
