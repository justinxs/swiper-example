<template>
  <div class="pagination-3d">
    <div class="container">
      <h2>Cube Swiper</h2>
      <div class="swiper-all-cubes">
        <div class="swiper swiper-main">
          <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
            <img :src="slide.img" />
          </div>
        </div>
        <div class="swiper-cubes-pagination">
          <div class="swiper" v-for="(slide, i) in slides" :key="i">
            <div class="swiper-slide swiper-slide-number">{{ i + 1 }}</div>
            <div class="swiper-slide">
              <img :src="slide.img" />
            </div>
            <div class="swiper-slide swiper-slide-number">{{ i + 1 }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <h2>Coverflow Swiper</h2>
      <div class="swiper-coverflow-cubes">
        <div class="swiper swiper-main">
          <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
            <img :src="slide.img" />
          </div>
        </div>
        <div class="swiper-cubes-pagination">
          <div class="swiper" v-for="(slide, i) in slides" :key="i">
            <div class="swiper-slide swiper-slide-number">{{ i + 1 }}</div>
            <div class="swiper-slide">
              <img :src="slide.img" />
            </div>
            <div class="swiper-slide swiper-slide-number">{{ i + 1 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { EffectCube, EffectCoverflow } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        { img: require('@/images/pagination/1.jpg') },
        { img: require('@/images/pagination/2.jpg') },
        { img: require('@/images/pagination/3.jpg') },
        { img: require('@/images/pagination/4.jpg') }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init(document.querySelector('.swiper-all-cubes'), 'cube');
    this.init(document.querySelector('.swiper-coverflow-cubes'), 'coverflow');
  },
  beforeDestroy() {},
  methods: {
    init(parent, c) {
      const paginationSw = [];
      let mainSw;
      parent
        .querySelectorAll('.swiper-cubes-pagination .swiper')
        .forEach((swEl, i) => {
          const sw = new Swiper(swEl, {
            modules: [EffectCube, EffectCoverflow],
            effect: 'cube',
            cubeEffect: {
              shadow: !1
            },
            createElements: !0,
            simulateTouch: !1,
            allowTouchMove: !1
          });
          swEl.addEventListener('click', () => {
            mainSw.slideTo(i);
          });
          paginationSw.push(sw);
        });

      mainSw = new Swiper(parent.querySelector('.swiper-main'), {
        modules: [EffectCube, EffectCoverflow],
        effect: c,
        createElements: !0,
        coverflowEffect: {
          depth: 200
        },
        on: {
          setTransition(e, transition) {
            paginationSw.forEach((pSw) => {
              pSw.setTransition(transition);
            });
          },
          progress(e, progress) {
            const t = (1 / 3) * 2;
            for (let i = 0; i < 4; i += 1) {
              let p = (progress + 0.3333333333333333 * (1 - i)) / t;
              p = Math.max(Math.min(p, 1), 0);
              paginationSw[i].setProgress(p);
            }
          }
        }
      });
    }
  }
};
</script>
