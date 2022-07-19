<template>
  <div class="swiper" ref="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
      <div class="swiper-slide">Slide 4</div>
      <div class="swiper-slide">Slide 5</div>
      <div class="swiper-slide">Slide 6</div>
      <div class="swiper-slide">Slide 7</div>
      <div class="swiper-slide">Slide 8</div>
      <div class="swiper-slide">Slide 9</div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { Navigation, Pagination } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
    this.swiper = new Swiper(this.$refs.swiper, {
      modules: [Navigation, Pagination],
      autoHeight: true,
      spaceBetween: 20,
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
.swiper {
  width: 100%;
  height: auto;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
}

.swiper .swiper-slide {
  height: 300px;
  line-height: 300px;
}

.swiper .swiper-slide:nth-child(2n) {
  height: 500px;
  line-height: 500px;
}
</style>
