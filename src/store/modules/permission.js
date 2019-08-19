import { constantRoutes, asyncRoutes } from '../../router/index'

/**
 * 判断路由权限
 * @param {Array} roles 当前用户角色
 * @param {Object} route 路由角色
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRoutes,
    addRouters: []
  },
  mutations: {
    // 根据权限动态生成路由
    SET_ROUTES: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
    }
  },
  actions: {
    
  }
}
