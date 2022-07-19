<template>
  <div class="swiper mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(s, i) in slides" :key="i">
        <img :src="s.img" />
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { EffectFade, Pagination, Navigation } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        { img: require('@/images/nature/nature-1.jpg') },
        { img: require('@/images/nature/nature-2.jpg') },
        { img: require('@/images/nature/nature-3.jpg') },
        { img: require('@/images/nature/nature-4.jpg') }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    var swiper = new Swiper('.mySwiper', {
      modules: [EffectFade, Pagination, Navigation],
      spaceBetween: 30,
      effect: 'fade',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  },
  beforeDestroy() {},
  methods: {}
};
</script>
<style scoped>
.swiper-slide {
  background-position: center;
  background-size: cover;
}
</style>
