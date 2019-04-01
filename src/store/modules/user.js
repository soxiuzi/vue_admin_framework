import { setLocalStorage, removeLocalStorage, getLocalStorage } from '_utils/localStorage.js'
import { loginByUserName, getUserInfo, logOut } from '_api/login.js'

const user = {
    state: {
        token: getLocalStorage('token'),
        roles: [],
        avatar: '',
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
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                loginByUserName(username, userInfo.password).then(res => {
                    const data = res.data.data
                    commit('SET_TOKEN', data.token)
                    setLocalStorage('token', data.token, 3)
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        //获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(res => {
                    if(!res.data) {
                        reject("凭证失效，请重新登录！")
                    }
                    const data = res.data

                    if(data.roles && data.roles.length > 0) {
                        commit('SET_ROLES', data.roles)
                    }else {
                        reject('获取信息错误，角色值不能是空值！')
                    }
                    
                    commit('SET_AVATAR', data.avatar)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        //登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logOut(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeLocalStorage('token')
                    resolve
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}

export default user