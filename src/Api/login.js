import request from '_utils/request.js'

/**
 * 注册
 */
export function register(account, password) { 
  return request({
    url: '/user/register',
    method: 'POST',
    data: {
      account,
      password
    }
  })
}

/**
 * 登录
 */
export function loginByUserName(account, password) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: {
      account,
      password
    }
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {

}


/**
 * 登出
 */
export function logOut() {
    
}