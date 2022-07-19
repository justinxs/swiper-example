<template>
  <div ref="swiper" class="swiper" style="width: 100%; height: 100%">
    <div class="swiper-wrapper">
      <div class="swiper-slide menu unready">Menu slide</div>
      <div class="swiper-slide content">
        <div class="menu-button unready">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        Content slide
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper';

export default {
  mounted() {
    const menuButton = document.querySelector('.menu-button');
    const openMenu = () => {
      this.swiper.slidePrev();
    };
    this.swiper = new Swiper(this.$refs.swiper, {
      slidesPerView: 'auto',
      initialSlide: 1,
      resistanceRatio: 0,
      slideToClickedSlide: true,
      on: {
        init: (swiper) => {
          const menu = swiper.slides[0];
          if (menu) {
            menu.classList.remove('unready');
          }
          menuButton.classList.remove('unready');
        },
        slideChangeTransitionStart: function () {
          var slider = this;
          if (slider.activeIndex === 0) {
            menuButton.classList.add('cross');
            // required because of slideToClickedSlide
            menuButton.removeEventListener('click', openMenu, true);
          } else {
            menuButton.classList.remove('cross');
          }
        },
        slideChangeTransitionEnd: function () {
          var slider = this;
          if (slider.activeIndex === 1) {
            menuButton.addEventListener('click', openMenu, true);
          }
        }
      }
    });
  }
};
</script>
<style scoped lang="scss">
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu {
  min-width: 100px;
  width: 70%;
  max-width: 320px;

  background-color: #2c8dfb;
  color: #fff;
  &.unready {
    visibility: hidden;
    position: absolute;
  }
}

.content {
  width: 100%;
}

.menu-button {
  position: absolute;
  top: 0px;
  left: 0px;

  padding: 15px;

  cursor: pointer;

  -webkit-transition: 0.3s;
  transition: 0.3s;

  background-color: #2c8dfb;

  /*margin: 14px;
			border-radius: 5px;*/
  &.unready {
    visibility: hidden;
  }
}

.menu-button .bar:nth-of-type(1) {
  margin-top: 0px;
}

.menu-button .bar:nth-of-type(3) {
  margin-bottom: 0px;
}

.bar {
  position: relative;
  display: block;

  width: 50px;
  height: 5px;

  margin: 10px auto;
  background-color: #fff;

  border-radius: 10px;

  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.menu-button:hover .bar:nth-of-type(1) {
  -webkit-transform: translateY(1.5px) rotate(-4.5deg);
  -ms-transform: translateY(1.5px) rotate(-4.5deg);
  transform: translateY(1.5px) rotate(-4.5deg);
}

.menu-button:hover .bar:nth-of-type(2) {
  opacity: 0.9;
}

.menu-button:hover .bar:nth-of-type(3) {
  -webkit-transform: translateY(-1.5px) rotate(4.5deg);
  -ms-transform: translateY(-1.5px) rotate(4.5deg);
  transform: translateY(-1.5px) rotate(4.5deg);
}

.cross .bar:nth-of-type(1) {
  -webkit-transform: translateY(15px) rotate(-45deg);
  -ms-transform: translateY(15px) rotate(-45deg);
  transform: translateY(15px) rotate(-45deg);
}

.cross .bar:nth-of-type(2) {
  opacity: 0;
}

.cross .bar:nth-of-type(3) {
  -webkit-transform: translateY(-15px) rotate(45deg);
  -ms-transform: translateY(-15px) rotate(45deg);
  transform: translateY(-15px) rotate(45deg);
}

.cross:hover .bar:nth-of-type(1) {
  -webkit-transform: translateY(13.5px) rotate(-40.5deg);
  -ms-transform: translateY(13.5px) rotate(-40.5deg);
  transform: translateY(13.5px) rotate(-40.5deg);
}

.cross:hover .bar:nth-of-type(2) {
  opacity: 0.1;
}

.cross:hover .bar:nth-of-type(3) {
  -webkit-transform: translateY(-13.5px) rotate(40.5deg);
  -ms-transform: translateY(-13.5px) rotate(40.5deg);
  transform: translateY(-13.5px) rotate(40.5deg);
}
</style>
