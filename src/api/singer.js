// import jsonp from 'common/js/jsonp'
// import { options, commonParams } from './config'

// 通过请求代理获取数据
import axios from 'axios'
import { commonParams } from './config'

export function getSingerList () {
  // const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const url = '/api/getSingerList'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return res.data
  })

  // return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  // const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const url = '/api/getSingerDetail'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return res.data
  })

  // return jsonp(url, data, options)
}
