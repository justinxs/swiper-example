<template>
  <div class="panorama-slider">
    <div class="swiper">
      <div class="swiper-pagination"></div>
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
          <img class="slide-image" :src="slide.img" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { Pagination } from 'swiper';

function Panorama({ swiper, extendParams, on }) {
  extendParams({
    panoramaEffect: {
      depth: 200,
      rotate: 30
    }
  });
  on('beforeInit', () => {
    if (swiper.params.effect !== 'panorama') return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}panorama`);
    swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    const r = {
      watchSlidesProgress: !0
    };
    Object.assign(swiper.params, r);
    Object.assign(swiper.originalParams, r);
  });
  on('progress', () => {
    if (swiper.params.effect !== 'panorama') return;
    const r = swiper.slidesSizesGrid,
      { depth: e = 200, rotate: a = 30 } = swiper.params.panoramaEffect,
      g = (a * Math.PI) / 180 / 2,
      h = 1 / (180 / a);
    for (let i = 0; i < swiper.slides.length; i += 1) {
      const c = swiper.slides[i],
        P = c.progress,
        d = r[i],
        y = swiper.params.centeredSlides
          ? 0
          : (swiper.params.slidesPerView - 1) * 0.5,
        l = P + y,
        f = 1 - Math.cos(l * h * Math.PI),
        m = `${l * (d / 3) * f}px`,
        p = l * a,
        u = `${((d * 0.5) / Math.sin(g)) * f - e}px`;
      c.style.transform =
        swiper.params.direction === 'horizontal'
          ? `translateX(${m}) translateZ(${u}) rotateY(${p}deg)`
          : `translateY(${m}) translateZ(${u}) rotateX(${-p}deg)`;
    }
  });
  on('setTransition', (r, e) => {
    swiper.params.effect === 'panorama' &&
      swiper.slides.forEach((a) => {
        a.style.transition = `${e}ms`;
      });
  });
}

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        { img: require('@/images/panorama/1.jpg') },
        { img: require('@/images/panorama/2.jpg') },
        { img: require('@/images/panorama/3.jpg') },
        { img: require('@/images/panorama/4.jpg') },
        { img: require('@/images/panorama/5.jpg') },
        { img: require('@/images/panorama/6.jpg') },
        { img: require('@/images/panorama/7.jpg') },
        { img: require('@/images/panorama/8.jpg') },
        { img: require('@/images/panorama/9.jpg') },
        { img: require('@/images/panorama/10.jpg') }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    new Swiper('.panorama-slider .swiper', {
      modules: [Pagination, Panorama],
      effect: 'panorama',
      slidesPerView: 1.5,
      loop: !0,
      loopedSlides: 10,
      centeredSlides: !0,
      grabCursor: !0,
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: !0,
        dynamicMainBullets: 3
      },
      panoramaEffect: {
        depth: 150,
        rotate: 45
      },
      breakpoints: {
        480: {
          slidesPerView: 2,
          panoramaEffect: {
            rotate: 35,
            depth: 150
          }
        },
        640: {
          slidesPerView: 3,
          panoramaEffect: {
            rotate: 30,
            depth: 150
          }
        },
        1024: {
          slidesPerView: 4,
          panoramaEffect: {
            rotate: 30,
            depth: 200
          }
        },
        1200: {
          slidesPerView: 5,
          panoramaEffect: {
            rotate: 25,
            depth: 250
          }
        }
      }
    });
  },
  beforeDestroy() {},
  methods: {}
};
</script>
