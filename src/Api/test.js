import request from '_utils/request.js'

export function getInTheater() {
    return request({
        url: '/movie/in_theaters',
        method: 'get'
    })
}