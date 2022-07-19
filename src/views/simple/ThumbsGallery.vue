<template>
  <div class="thumbs-gallery" style="width: 100%; height: 100%">
    <div
      style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff"
      class="swiper main-swiper"
      ref="swiper"
    >
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(s, i) in slides" :key="i">
          <img :src="s.img" />
        </div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
    <div ref="thumbsSwiper" class="swiper thumbs-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(s, i) in slides" :key="i">
          <img :src="s.img" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { Navigation, Thumbs } from 'swiper';

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
    const thumbsSwiper = new Swiper(this.$refs.thumbsSwiper, {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true
    });
    const swiper = new Swiper(this.$refs.swiper, {
      modules: [Navigation, Thumbs],
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      thumbs: {
        swiper: thumbsSwiper
      }
    });
  },
  beforeDestroy() {},
  methods: {}
};
</script>
<style scoped>
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  background-size: cover;
  background-position: center;
}

.main-swiper {
  height: 80%;
  width: 100%;
}

.thumbs-swiper {
  height: 20%;
  box-sizing: border-box;
  padding: 10px 0;
}

.thumbs-swiper .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
}

.thumbs-swiper .swiper-slide-thumb-active {
  opacity: 1;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
