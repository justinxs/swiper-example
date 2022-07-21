<template>
  <div class="travel-slider-container">
    <div class="travel-slider">
      <!-- Rotating Planet -->
      <div class="travel-slider-planet">
        <img src="~@images/travel/earth.svg" />
        <div
          class="travel-slider-cities"
          :class="[
            slides.length > 4
              ? 'travel-slider-cities-8'
              : 'travel-slider-cities-4'
          ]"
        >
          <img :src="s.logo" v-for="(s, i) in slides" :key="i" />
        </div>
      </div>
      <!-- Swiper -->
      <div class="swiper transparent" ref="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(s, i) in slides" :key="i">
            <img :src="s.img" class="travel-slider-bg-image" />
            <div class="travel-slider-content">
              <div class="travel-slider-title">{{ s.title }}</div>
              <div class="travel-slider-subtitle">{{ s.subTitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { Keyboard, Mousewheel } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        {
          img: require('@/images/travel/usa.jpg'),
          logo: require('@/images/travel/usa.svg'),
          title: 'United States',
          subTitle: '8,295 properties'
        },
        {
          img: require('@/images/travel/england.jpg'),
          logo: require('@/images/travel/england.svg'),
          title: 'England',
          subTitle: '1,110 properties'
        },
        {
          img: require('@/images/travel/france.jpg'),
          logo: require('@/images/travel/france.svg'),
          title: 'France',
          subTitle: '314 properties'
        },
        {
          img: require('@/images/travel/italy.jpg'),
          logo: require('@/images/travel/italy.svg'),
          title: 'Italy',
          subTitle: '1,200 properties'
        },
        {
          img: require('@/images/travel/russia.jpg'),
          logo: require('@/images/travel/russia.svg'),
          title: 'Russia',
          subTitle: '12,231 properties'
        },
        {
          img: require('@/images/travel/egypt.jpg'),
          logo: require('@/images/travel/egypt.svg'),
          title: 'Egypt',
          subTitle: '505 properties'
        },
        {
          img: require('@/images/travel/india.jpg'),
          logo: require('@/images/travel/india.svg'),
          title: 'India',
          subTitle: '2,300 properties'
        },
        {
          img: require('@/images/travel/japan.jpg'),
          logo: require('@/images/travel/japan.svg'),
          title: 'Japan',
          subTitle: '1,700 properties'
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    const planet = document.querySelector('.travel-slider-planet');
    this.swiper = new Swiper(this.$refs.swiper, {
      modules: [Keyboard, Mousewheel],
      speed: 600,
      grabCursor: !0,
      slidesPerView: 'auto',
      centeredSlides: !0,
      spaceBetween: 24,
      watchSlidesProgress: !0,
      keyboard: !0,
      mousewheel: !0,
      breakpoints: {
        512: {
          spaceBetween: 32
        },
        1024: {
          spaceBetween: 64
        }
      },
      on: {
        progress(e, r) {
          if (!planet) return;
          const t =
            e.slides.length > 4 ? 360 - 45 * (8 - e.slides.length + 1) : 270;
          planet.style.transform = `translate(-50%, -50%) rotate(${t * -r}deg)`;
        },
        setTransition(swiper, transtion) {
          planet && (planet.style.transitionDuration = `${transtion}ms`);
        }
      }
    });
    this.$refs.swiper.classList.remove('transparent');
  },
  beforeDestroy() {},
  methods: {}
};
</script>
