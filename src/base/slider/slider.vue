<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        v-for="(dot, index) in dots"
        :key="index"
        :class="{'active': currentPageIndex === index}"
        class="dot"></span>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { addClass } from 'common/js/dom'

BScroll.use(Slide)
export default {
  name: 'Slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
      this._initDots()
    }, 20)
  },
  methods: {
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      const sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        slide: {
          loop: this.loop,
          autoplay: this.autoPlay,
          interval: this.interval
        },
        momentum: false,
        bounce: false,
        stopPropagation: true,
        click: true
      })

      this.slider.on('slideWillChange', (page) => {
        this.currentPageIndex = page.pageX
      })
    },
    _initDots() {
      let length = this.children.length
      if (this.loop) {
        length -= 2
      }
      this.dots = new Array(length)
    }
  },
  beforeDestroy() {
    this.slider.destroy()
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable'
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
