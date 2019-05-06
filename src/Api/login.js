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
export function loginByUserName() {
  return request({
    url: '/auth/loginCAS',
    method: 'GET'
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