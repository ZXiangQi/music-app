import { Base64 } from 'js-base64'
import { ERR_OK } from 'api/config'
import { getSongsUrl, getLyric } from 'api/song'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          /* eslint-disable */
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

// 在一首歌可能有两个歌手需要用 / 分开
// 假如数组中只有一个元素，那么join时 / 是不会加到字符串中的
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}

// 检测是否存在歌曲id以及是否需要付费
export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid &&
  (!musicData.pay || musicData.pay.payalbumprice === 0)
}

export function processSongsUrl(songs) {
  // console.log(songs)
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  // return getSongsUrl(songs).then(res => {
  //   if (res.code === ERR_OK) {
  //     let midUrlInfo = res.url_mid.data.midurlinfo
  //     midUrlInfo.forEach((info, index) => {
  //       let song = songs[index]
  //       song.url = info.purl
  //     })
  //   }
  //   return songs
  // })

  // 发送异步请求获取歌曲的播放地址
  return getSongsUrl(songs).then(purlMap => {
    // 异步请求获取到的数据通过是 songmid 标识的
    // 通过mid的比对，将歌曲的播放地址存进对应的歌曲对象中
    songs = songs.filter(song => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}
