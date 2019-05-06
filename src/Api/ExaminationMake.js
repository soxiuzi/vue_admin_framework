import request from "_utils/request"

/**
 * 获取试卷题目列表
 * @param {String} examinationId 试卷Id
 */
export function getSubjectListByExam(examinationId) {
  return request({
    url: `/examination/getSubjects/${examinationId}`,
    method: 'GET'
  })
}

/**
 * 更新题目信息
 * @param {Object} updateInfo 更新信息
 */
export function updateSubjectInfo(updateInfo) {
  return request({
    url: '/subject/update',
    method: 'POST',
    data: updateInfo
  })
}

/**
 * 获取他人与我共享的题目信息
 */
export function getCommonSubject() {
  return request({
    url: '/subject/shareWithMe',
    method: 'GET'
  })
}