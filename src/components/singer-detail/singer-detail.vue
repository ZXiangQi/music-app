<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { isValidMusic, createSong, processSongsUrl } from 'common/js/song'

import MusicList from 'components/music-list/music-list'
export default {
  name: 'SingerDetail',
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      // 边界情况：页面在详情页时刷新，导致数据清空得不到id值，所以让其返回歌手列表页面
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      // 获取歌手详情与歌曲
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
            // console.log('songs', songs)
            this.songs = songs
          })
          // console.log(res.data)
        }
      })
    },
    // 将数据有用的部分提取出来
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        // 过滤数据失效的部分
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      // console.log(ret)
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang='stylus' scoped>
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
</style>
