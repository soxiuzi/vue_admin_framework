import request from '_utils/request.js'

/**
 * 获取专业树结构
 */
export function getTreeData() {
  return request({
    url: '/professional/tree',
    method: 'GET'
  })
}

/**
 * 新增专业
 */
export function addMajor(addMajorInfo) {
  return request({
    url: '/professional/create',
    method: 'POST',
    data: {
      parentId: addMajorInfo.parentId,
      sort: addMajorInfo.sort,
      professionalName: addMajorInfo.professionalName,
      professionalCode: addMajorInfo.professionalCode
    }
  })
}

/**
 * 获取年级列表
 */
export function getGradeList() {
  return request({
    url: '/grade/list',
    method: 'GET'
  })
}