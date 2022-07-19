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
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { Pagination } from 'swiper';

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
      modules: [Pagination],
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 50
        }
      }
    });
  },
  beforeDestroy() {},
  methods: {}
};
</script>
