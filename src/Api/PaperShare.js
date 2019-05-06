import request from '_utils/request'

/**
 * 获取与我共享的试卷信息
 */
export function getShareWithMe() {
  return request({
    url: '/examination/shareWithMe',
    method: 'GET'
  })
}

/**
 * 获取我与他人共享的试卷信息
 */
export function getSharedExam() {
  return request({
    url: '/examination/sharedExaminations',
    method: 'GET'
  })
}

/**
 * 获取试卷分享的用户信息
 */
export function getShareUsersForExam(examId) {
  return request({
    url: `examination/getShareUsers/${examId}`,
    method: 'GET'
  })
}