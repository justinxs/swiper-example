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
import Swiper, { EffectFlip, Pagination, Navigation } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        { img: require('@/images/nature/nature-1.jpg') },
        { img: require('@/images/nature/nature-2.jpg') },
        { img: require('@/images/nature/nature-3.jpg') },
        { img: require('@/images/nature/nature-4.jpg') },
        { img: require('@/images/nature/nature-5.jpg') },
        { img: require('@/images/nature/nature-6.jpg') },
        { img: require('@/images/nature/nature-7.jpg') },
        { img: require('@/images/nature/nature-8.jpg') },
        { img: require('@/images/nature/nature-9.jpg') }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    var swiper = new Swiper('.mySwiper', {
      modules: [EffectFlip, Pagination, Navigation],
      effect: 'flip',
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  },
  beforeDestroy() {},
  methods: {}
};
</script>
<style scoped>
.swiper {
  width: 300px;
  height: 300px;
  padding: 50px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 300px;
}

.swiper-slide img {
  display: block;
  width: 100%;
}
</style>
