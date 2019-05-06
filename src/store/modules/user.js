import {
  setLocalStorage,
  removeLocalStorage,
  getLocalStorage
} from '_utils/localStorage.js'
import {
  loginByUserName,
  logOut
} from '_api/login.js'
import {
  getUserInfo
} from '_api/user.js'
import {
  message
} from 'ant-design-vue'

const user = {
  state: {
    token: getLocalStorage('token'),
    roles: [],
    avatar: '',
    userName: "",
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_NAME: (state, userName) => {
      state.userName = userName
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({
      commit
    }) {
      return new Promise((resolve, reject) => {
        loginByUserName().then(res => {
          const data = res.data.data
          if (!data.state) {
            window.location.assign("http://218.201.243.209:8085/cas/login")
          } else {
            commit('SET_TOKEN', data.token)
            setLocalStorage('token', data.token, 3)
            message.success("登录成功！")
            resolve(data.state)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    //获取用户信息
    GetUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          let userInfo = res.data.data
          if (userInfo.account) {
            commit('SET_USER_NAME', userInfo.account)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //登出
    LogOut({
      commit
    }) {
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
