import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  // 判断是否有?, 并将 url 和 data 做拼接
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 将 json 格式的 data 用 & = 拼接起来
function param(data) {
  let url = ''
  for (const k in data) {
    // 假如值为undefined就为空
    const value = data[k] !== undefined ? data[k] : ''
    // 拼接 url
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 去掉第一个字符 - &
  return url ? url.substring(1) : ''
}
