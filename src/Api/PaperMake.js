import request from '_utils/request'

/**
 * 试卷自动生成
 * @param {Object} examInfo
 */
export function autoGenerator (examInfo) {
  return request({
    url: '/examination/autoGenerator',
    method: 'POST',
    data: examInfo
  })
}

/**
 * 把保存试卷信息
 */
export function saveExamInfo (examInfo) {
  return request({
    url: '/examination/save',
    method: 'POST',
    data: examInfo
  })
}
