<template>
  <div class="swiper mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(s, i) in slides" :key="i">
        <img :src="s.img" />
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { EffectCube, Pagination } from 'swiper';

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
      modules: [EffectCube, Pagination],
      effect: 'cube',
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94
      },
      pagination: {
        el: '.swiper-pagination'
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
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  margin-top: -150px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
}

.swiper-slide img {
  display: block;
  width: 100%;
}
</style>
