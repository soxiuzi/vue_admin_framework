import request from "_utils/request"

/**
 * 编辑答案
 * @param {Object} answerInfo 答案信息
 */
export function editAnswer(answerInfo) {
  return request({
    url: '/answer/update',
    method: 'POST',
    data: answerInfo
  })
}

/**
 *获取题目答案
 * @param {String} subjectId
 */
export function getAnswer(subjectId) {
  return request({
    url: `/answer/${subjectId}`,
    method: 'GET'
  })
}