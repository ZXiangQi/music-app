import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

// 用于解决移动端点击事件会延迟300毫秒的问题
// fastclick.attach(document.body)
// 用于图片懒加载
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
