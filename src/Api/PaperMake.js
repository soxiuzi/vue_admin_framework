import request from "_utils/request"

/**
 * 试卷自动生成
 * @param {Object} examInfo 
 */
export function autoGenerator(examInfo) {
  return request({
    url: '/examination/autoGenerator',
    method: 'POST',
    data: examInfo
  })
}