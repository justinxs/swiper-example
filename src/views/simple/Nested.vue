<template>
  <div ref="swiper1" class="swiper mySwiper swiper-h">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Horizontal Slide 1</div>
      <div class="swiper-slide">
        <div ref="swiper2" class="swiper mySwiper2 swiper-v">
          <div class="swiper-wrapper">
            <div class="swiper-slide">Vertical Slide 1</div>
            <div class="swiper-slide">Vertical Slide 2</div>
            <div class="swiper-slide">Vertical Slide 3</div>
            <div class="swiper-slide">Vertical Slide 4</div>
            <div class="swiper-slide">Vertical Slide 5</div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="swiper-slide">Horizontal Slide 3</div>
      <div class="swiper-slide">Horizontal Slide 4</div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { Pagination } from 'swiper';

export default {
  mounted() {
    this.swiper = new Swiper(this.$refs.swiper1, {
      modules: [Pagination],
      spaceBetween: 50,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
    this.swiper2 = new Swiper(this.$refs.swiper2, {
      modules: [Pagination],
      direction: 'vertical',
      spaceBetween: 50,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  }
};
</script>
<style scoped>
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-v {
  background: #eee;
}
</style>
