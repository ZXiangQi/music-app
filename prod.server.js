const express = require('express')
const axios = require('axios')

const app = express()


app.get('/api/getDiscList', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
// 获取歌手列表
app.get('/api/getSingerList', function(req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

app.get('/api/getSingerDetail', (req, res) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

app.get('/api/getCdInfo', function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.get('/api/lyric', function (req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.use(express.json())
app.post('/api/getPurlUrl', function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.post(url, req.body, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com',
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.get('/api/search', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.get('/api/getTopBanner', function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const jumpPrefixMap = {
    10002: 'https://y.qq.com/n/yqq/album/',
    10014: 'https://y.qq.com/n/yqq/playlist/',
    10012: 'https://y.qq.com/n/yqq/mv/v/'
  }

  axios.get(url, {
    headers: {
      referer: 'https://u.y.qq.com/',
      host: 'u.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    response = response.data
    if (response.code === 0) {
      const slider = []
      const content = response.focus.data && response.focus.data.content
      if (content) {
        for (let i = 0; i < content.length; i++) {
          const item = content[i]
          const sliderItem = {}
          const jumpPrefix = jumpPrefixMap[item.type || 10002]
          sliderItem.id = item.id
          sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
          sliderItem.picUrl = item.pic_info.url
          slider.push(sliderItem)
        }
      }
      res.json({
        code: 0,
        data: {
          slider
        }
      })
    } else {
      res.json(response)
    }
  }).catch((e) => {
    console.log(e)
  })
})

// 静态资源
app.use(express.static('./dist'))

app.listen(3000, (err) => {
  if(err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost: 3000\n')
})
