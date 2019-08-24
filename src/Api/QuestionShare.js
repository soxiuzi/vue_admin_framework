import request from '_utils/request'

/**
 * 获取题目信息
 */
export function getSubjectList (subjectInfo) {
  return request({
    url: `/subject/list`,
    method: 'POST',
    data: {
      questionType: subjectInfo.questionType
    }
  })
}

/**
 * 分享题目信息
 */
export function shareSubjectInfo (subjectInfo) {
  return request({
    url: '/subject/share',
    method: 'POST',
    data: subjectInfo
  })
}

/**
 * 获取所有用户列表
 */
export function getAllUsers () {
  return request({
    url: '/user/allUsers',
    method: 'GET'
  })
}
