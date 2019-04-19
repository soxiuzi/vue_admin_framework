import request from '_utils/request'

/**
 * 获取题目类型信息
 */
export function getSubjectType() {
  return request({
    url: '/subject/types',
    method: 'GET'
  })
}

/**
 * 新增题目信息
 */
export function addSubjectInfo(subjectInfo) {
  return request({
    url: '/subject/create',
    method: 'POST',
    data: subjectInfo
  })
}

/**
 * 分享题目信息
 */
export function shareSubject() {
  return request({
    url: '/subject/share',
    method: 'POST'
  })
}