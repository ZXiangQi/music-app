import { playMode } from 'common/js/config'
import { loadSearch, loadPlay } from 'common/js/cache'

const state = {
  singer: {},
  // 播放器
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: []
}

export default state
