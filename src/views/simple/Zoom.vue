<template>
  <div
    style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff"
    ref="swiper"
    class="swiper"
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(s, i) in slides" :key="i">
        <div class="swiper-zoom-container">
          <img :src="s.img" />
        </div>
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { Navigation, Pagination, Zoom } from 'swiper';

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
    this.swiper = new Swiper(this.$refs.swiper, {
      modules: [Navigation, Pagination, Zoom],
      zoom: true,
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
