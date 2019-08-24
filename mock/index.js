import Mock from 'mockjs'
import MyInfo from './table'

Mock.mock('http://127.0.0.1/test', 'get', () => {
  return MyInfo.page1
})