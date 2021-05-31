import axios from 'axios'
import { commonParams, ERR_OK } from './config'
import { getUid } from 'common/js/uid'

// const debug = process.env.NODE_ENV !== 'production'

// 获取歌手的歌曲列表
export function getSongsUrl(songs) {
  // const url = debug ? '/api/getPurlUrl' : 'http://ustbhuangyi.com/music/api/getPurlUrl'
  const url = '/api/getPurlUrl'
  let mids = []
  let types = []

  songs.forEach(song => {
    mids.push(song.mid)
    types.push(0)
  })

  // 用于post请求歌曲数据
  const urlMid = genUrlMid(mids, types)

  // 同上
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    // 因为请求可能失败，所以会尝试请求3次
    let tryTime = 3
    function request() {
      // 通过axios向代理服务器发送post请求
      return axios.post(url, {
        comm: data,
        url_mid: urlMid
      }).then(response => {
        const res = response.data
        if (res.code === ERR_OK) {
          let urlMid = res.url_mid
          if (urlMid && urlMid.code === ERR_OK) {
            // const info = urlMid.data.midurlinfo[0]
            // if (info && info.purl) {
            //   console.log(res)
            //   resolve(res)}
            // -
            // 由于请求到的歌曲列表数据可能因为要付费才能听到，导致付费歌曲的purl失效
            // 过滤掉失效的歌曲，返回通过歌曲的 songmid 标识的歌曲 url 对象
            const purlMap = {}
            urlMid.data.midurlinfo.forEach(item => {
              if (item.purl) {
                purlMap[item.songmid] = item.purl
              }
            })
            if (Object.keys(purlMap).length > 0) {
              // console.log(purlMap)
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry() {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

// 各种请求音乐歌曲有关的数据整合
function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}

// 获取歌曲歌词
export function getLyric(mid) {
  // const url = debug ? 'api/lyric' : 'http://ustbhuangyi.com/music/api/lyric'
  const url = 'api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
