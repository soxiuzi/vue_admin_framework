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
 * 删除专业项
 * @param {String} majorId 专业Id
 */
export function DeleteMajor(majorId) {
  return request({
    url: `/professional/delete/${majorId}`,
    method: 'DELETE'
  })
}

/**
 * 更新专业名称
 * @param {Object} updateInfo 更新信息
 */
export function UpdateMajorInfo(updateInfo) {
  return request({
    url: '/professional/update',
    method: 'POST',
    data: updateInfo
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

/**
 * 获取课程列表
 */
export function getCourseList(namePart = '', initials = '') {
  return request({
    url: '/curriculum/list',
    method: 'POST',
    data: {
      namePart,
      initials
    }
  })
}

/**
 * 通过年级Id和专业Id获取该专业课程列表
 * @param {String} professionalId 专业Id
 * @param {String} gradeId 年级Id
 * @returns
 */
export function getMajorCourse(professionalId, gradeId) { 
  return request({
    url: '/professional/getProfessionalCurriculum',
    method: 'POST',
    data: {
      professionalId,
      gradeId
    }
  })
 }

 /**
  * 添加专业课程
  * @param {Object} courseInfo
  */
 export function addCourseForMajor(courseInfo) {
   return request({
     url:'/professional/setProfessionalCurriculum',
     method: 'POST',
     data: courseInfo
   })
 }

 /**
  * 删除专业课程
  * @param {Object} courseInfo
  */
 export function deleteMajorCourse(courseInfo) {
  return request({
    url: '/professional/removeProfessionalCurriculum',
    method: 'POST',
    data: courseInfo
  })
 }