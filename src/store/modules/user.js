import {
  setLocalStorage,
  removeLocalStorage,
  getLocalStorage
} from '_utils/localStorage.js'
import { loginByUserName, logOut, loginCas } from '_api/login.js'
import { getUserInfo } from '_api/user.js'
import { message } from 'ant-design-vue'

const user = {
  state: {
    token: getLocalStorage('token'),
    roles: [],
    avatar: '',
    userName: '',
    userId: ''
  },

  mutations: {
    // 设置token
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // 设置头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    // 设置角色
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    // 设置用户名
    SET_USER_NAME: (state, userName) => {
      state.userName = userName
    },
    // 设置用户Id
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        loginCas(loginInfo.url, loginInfo.ticket).then(res => {
          let casStatus = res.data.data
          // console.log('检测是否跳转登录：', casStatus)
          if (casStatus.state) {
            // console.log('查看返回true的状态：', casStatus.state)
            commit('SET_TOKEN', casStatus.token)
            setLocalStorage('token', casStatus.token, 3)
            // message.success("登录成功！")
            resolve(casStatus.state)
          } else {
            window.location.assign(casStatus.url)
          }
        })
      })
    },

    // 获取用户信息
    getUserInfo ({ commit }, token) {
      return new Promise((resolve, reject) => {
        getUserInfo(token)
          .then(res => {
            const { data } = res

            if (!data) {
              reject('Verification failed, please Login again.')
            }

            const { name, avatar } = data

            commit('SET_USER_NAME', name)
            commit('SET_AVATAR', avatar)
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 登出
    LogOut ({ commit }) {
      try {
        commit('SET_TOKEN', '')
        removeLocalStorage('token')
        return true
      } catch {
        return false
      }
    }
  }
}

export default user
