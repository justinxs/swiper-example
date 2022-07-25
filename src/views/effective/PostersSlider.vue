<template>
  <div class="posters-slider">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
          <!-- set image parallax scale for nice zoom effect -->
          <img data-swiper-parallax-scale="1.1" :src="slide.img" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { EffectCreative, Parallax } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        { img: require('@/images/posts/1.jpg') },
        { img: require('@/images/posts/2.jpg') },
        { img: require('@/images/posts/3.jpg') },
        { img: require('@/images/posts/4.jpg') },
        { img: require('@/images/posts/5.jpg') },
        { img: require('@/images/posts/6.jpg') }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init(document.querySelector('.posters-slider'));
  },
  beforeDestroy() {
    this.resizer && this.resizer.clear();
  },
  methods: {
    init(parent) {
      const swEl = parent.querySelector('.swiper'),
        getX = () => {
          const e = swEl.parentElement.offsetWidth,
            r = swEl.offsetWidth;
          let t = (e - (e - r) / 2) / r;
          return (t = Math.max(t, 1)), 100 * t + '%';
        },
        swiper = new Swiper(swEl, {
          modules: [EffectCreative, Parallax],
          effect: 'creative',
          speed: 600,
          resistanceRatio: 0,
          grabCursor: !0,
          parallax: !0,
          creativeEffect: {
            limitProgress: 3,
            perspective: !0,
            shadowPerProgress: !0,
            prev: {
              shadow: !0,
              translate: ['-15%', 0, -200]
            },
            next: {
              translate: [getX(), 0, 0]
            }
          }
        });
      const resizeHandler = () => {
        if (swiper && !swiper.destroyed) {
          swiper.params.creativeEffect.next.translate = [getX(), 0, 0];
          swiper.params.resizeObserver &&
            void 0 !== window.ResizeObserver &&
            swiper.update();
        }
      };
      window.addEventListener('resize', resizeHandler);
      this.resizer = {
        clear() {
          window.removeEventListener('resize', resizeHandler);
        }
      };
    }
  }
};
</script>
