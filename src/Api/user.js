import request from '_utils/request'

/**
 * 获取用户信息
 */
export function getUserInfo () {
  return request({
    url: '/login/checkMemberLogin',
    method: 'GET'
  })
}
