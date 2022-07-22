<template>
  <div class="slicer-3d">
    <div class="container">
      <h2>Ratio Slicer</h2>
      <div class="swiper-slicer swiper-ratio-slicer">
        <div class="swiper" v-for="(slide, i) in slides" :key="i">
          <!-- invisible image to determine size -->
          <img v-if="i == 0" class="swiper-slicer-size" :src="slide.img" />
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(slide, j) in slides"
              :key="j"
              :style="{ 'background-image': `url(${slide.img})` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <h2>Delay Slicer</h2>
      <div class="swiper-slicer swiper-delay-slicer">
        <div class="swiper" v-for="(slide, i) in slides" :key="i">
          <!-- invisible image to determine size -->
          <img v-if="i == 0" class="swiper-slicer-size" :src="slide.img" />
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(slide, j) in slides"
              :key="j"
              :style="{ 'background-image': `url(${slide.img})` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { EffectCube } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        { img: require('@/images/3d/1.jpg') },
        { img: require('@/images/3d/2.jpg') },
        { img: require('@/images/3d/3.jpg') },
        { img: require('@/images/3d/4.jpg') }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initSlicer(document.querySelector('.swiper-ratio-slicer'));
    this.initSlicer(document.querySelector('.swiper-delay-slicer'), 50);
  },
  beforeDestroy() {},
  methods: {
    initSlicer(parent, delay = 0) {
      const children = parent.querySelectorAll('.swiper'),
        swipers = [];
      children.forEach((child, i) => {
        const sw = new Swiper(child, {
          modules: [EffectCube],
          effect: 'cube',
          grabCursor: !0,
          allowTouchMove: 0 === i,
          touchEventsTarget: 'container',
          cubeEffect: {
            shadow: i === children.length - 1
          }
        });
        swipers.push(sw);
      });
      const main = swipers[0],
        others = swipers.filter((sw) => sw !== main),
        ratio = 1 / 3;
      main.on('progress', (msw, progress) => {
        others.forEach((sw, i) => {
          if (delay) {
            setTimeout(() => {
              sw.setProgress(progress);
            }, delay * (i + 1));
          } else {
            const step = Math.floor(progress / ratio) * ratio;
            sw.setProgress(
              step + ((progress - step) / ratio) ** (1.5 * (1 + i)) * ratio
            );
          }
        });
      });
      main.on('setTransition', (msw, transition) => {
        others.forEach((sw, i) => {
          if (delay) {
            setTimeout(() => {
              sw.setTransition(transition);
            }, delay * (i + 1));
          } else {
            sw.setTransition(transition);
          }
        });
      });
    }
  }
};
</script>
