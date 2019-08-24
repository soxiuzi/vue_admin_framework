import request from '_utils/request'

/**
 * 添加课程
 * @param {Object} courseInfo
 */
export function addCourse (courseInfo) {
  return request({
    url: '/curriculum/create',
    method: 'POST',
    data: courseInfo
  })
}

/**
 * 更新课程
 * @param {Object} courseInfo
 */
export function updateCourse (courseInfo) {
  return request({
    url: '/curriculum/update',
    method: 'POST',
    data: courseInfo
  })
}

/**
 * 删除课程
 * @param {String} courseId
 */
export function deleteCourse (courseId) {
  return request({
    url: `/curriculum/delete/${courseId}`,
    method: 'DELETE'
  })
}

/**
 * 获取课程树
 */
export function getCourseTree () {
  return request({
    url: '/curriculum/tree',
    method: 'GET'
  })
}
