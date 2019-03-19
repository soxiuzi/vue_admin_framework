import request from "../utils/request"

export function test() {
  return request({
    url: '/v2/movie/in_theaters',
    method: 'get',
  })
}
