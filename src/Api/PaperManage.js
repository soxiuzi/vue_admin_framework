import request from '_utils/request'

/**
 * 创建试卷
 * @param {String} examinationName 试卷名称
 */
export function createExamination(examinationName, curriculumId) {
  return request({
    url: '/examination/create',
    method: 'POST',
    data: {
      examinationName,
      curriculumId
    }
  })
}

/**
 * 设置试卷题型
 * @param {String} subjectId 题型ID
 * @param {String} examinationId 试卷Id
 * @returns
 */
export function setExaminationType(subjectId, examinationId) {
  return request({
    url: '/examination/setupSubjectType',
    method: 'POST',
    data: {
      typeId: subjectId,
      examinationId
    }
  })
}

/**
 * 设置试卷题目
 * @param {Object} param 试卷信息
 */
export function setExaminationSubject(param) {
  return request({
    url: '/examination/setupSubject',
    method: 'POST',
    data: param
  })
}

/**
 * 获取试卷列表
 */
export function getExaminatiionList() {
  return request({
    url: '/examination/list',
    method: 'GET'
  })
}

/**
 * 获取已设置的试卷题型
 * @param {String} examinationId 试卷Id
 */
export function getSubjectTypeByExamId(examinationId) {
  return request({
    url: `/examination/getSubjectType/${examinationId}`,
    method: 'GET'
  })
}