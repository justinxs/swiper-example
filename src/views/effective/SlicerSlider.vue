<template>
  <div class="slicer-slider">
    <div ref="swiper" class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
          <img class="swiper-slicer-image" :src="slide.img" alt="" />
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>
<script>
import Swiper, { Navigation, Autoplay } from 'swiper';

export default {
  data() {
    return {
      slides: [
        { img: require('@/images/SlicerSlider/01.jpg') },
        { img: require('@/images/SlicerSlider/02.jpg') },
        { img: require('@/images/SlicerSlider/03.jpg') },
        { img: require('@/images/SlicerSlider/04.jpg') },
        { img: require('@/images/SlicerSlider/05.jpg') }
      ]
    };
  },
  mounted() {
    new Swiper(this.$refs.swiper, {
      modules: [
        Navigation,
        Autoplay,
        function ({ swiper, extendParams, on, emit }) {
          extendParams({ slicerEffect: { split: 5 } });
          const i = (transition) => {
            swiper.slides.forEach((slide) => {
              const slices = slide.querySelectorAll(
                  '.swiper-slicer-image-clone'
                ),
                content = slide.querySelector('.swiper-slide-content');

              content && (content.style.transitionDuration = `${transition}ms`);
              slices.forEach((s, i) => {
                if (0 === transition) {
                  s.style.transitionTimingFunction = 'ease-out';
                  s.style.transitionDuration = `${
                    swiper.params.speed +
                    (swiper.params.speed / (slices.length - 1)) *
                      (slices.length - i - 1)
                  }ms`;
                } else {
                  s.style.transitionTimingFunction = '';
                  s.style.transitionDuration = `${
                    transition +
                    (transition / (slices.length - 1)) * (slices.length - i - 1)
                  }ms`;
                }
              });
            });
            const { slides, activeIndex, $wrapperEl } = swiper;
            if (0 !== transition) {
              let toggle = false;
              slides
                .eq(activeIndex)
                .find('.swiper-slicer-image-clone:nth-child(1)')
                .transitionEnd(() => {
                  if (toggle) return;
                  if (!swiper || swiper.destroyed) return;
                  toggle = true;
                  swiper.animating = false;
                  const props = ['webkitTransitionEnd', 'transitionend'];
                  for (let i = 0; i < props.length; i += 1) {
                    $wrapperEl.trigger(props[i]);
                  }
                });
            }
          };
          on('setTranslate', () => {
            if ('slicer' === swiper.params.effect) {
              const TD = 'vertical' === swiper.params.direction ? 'Y' : 'X';
              swiper.slides.forEach((s, i) => {
                s.style.transform = `translate${TD}(-${100 * i}%)`;
                const p = s.progress,
                  content = s.querySelector('.swiper-slide-content');
                content &&
                  (content.style.transform = `translate${TD}(${
                    e.size * -p * 1.2
                  }px)`);
                s.querySelectorAll('.swiper-slicer-image-clone').forEach(
                  (e) => {
                    e.style.transform = `translate${TD}(${100 * -p}%)`;
                  }
                );
              });
            }
          });
          on('setTransition', (swiper, transition) => {
            'slicer' === swiper.params.effect && i(transition);
          });
          on('beforeInit', () => {
            if ('slicer' !== swiper.params.effect) return;
            swiper.classNames.push('swiper-slicer');
            const params = {
              slidesPerView: 1,
              slidesPerGroup: 1,
              watchSlidesProgress: !0,
              spaceBetween: 0,
              virtualTranslate: !0
            };
            Object.assign(swiper.params, params);
            Object.assign(swiper.originalParams, params);
          });
          on('init', () => {
            if ('slicer' === swiper.params.effect) {
              swiper.slides.each((s) => {
                const img = s.querySelector('.swiper-slicer-image');
                if (!img) return;
                const existCloneEls = img.nextElementSibling,
                  cloneEls = document.createElement('div');
                cloneEls.classList.add('swiper-slicer-image-clones');
                for (let i = 0; i < swiper.params.slicerEffect.split; i += 1) {
                  const cloneEl = document.createElement('div');
                  cloneEl.classList.add('swiper-slicer-image-clone');
                  cloneEl.appendChild(img.cloneNode());
                  cloneEls.appendChild(cloneEl);
                }
                existCloneEls
                  ? img.parentNode.insertBefore(cloneEls, existCloneEls)
                  : img.parentNode.appendChild(cloneEls);
              });
              emit('setTranslate', swiper, swiper.translate);
            }
          });
          on('resize init', () => {
            if ('slicer' === swiper.params.effect) {
              swiper.el
                .querySelectorAll('.swiper-slicer-image')
                .forEach((img) => {
                  img.style.width = `${swiper.width}px`;
                  img.style.height = `${swiper.height}px`;
                });
              swiper.el.querySelectorAll('.swiper-slide').forEach((slide) => {
                slide
                  .querySelectorAll('.swiper-slicer-image-clone')
                  .forEach((cloneEl, i) => {
                    const cloneImg = cloneEl.querySelector(
                      '.swiper-slicer-image'
                    );
                    if ('horizontal' === swiper.params.direction) {
                      cloneEl.style.height =
                        100 / swiper.params.slicerEffect.split + '%';
                      cloneEl.style.top =
                        (100 / swiper.params.slicerEffect.split) * i + '%';
                      cloneImg.style.top = `-${100 * i}%`;
                    } else {
                      cloneEl.style.width =
                        100 / swiper.params.slicerEffect.split + '%';
                      cloneEl.style.left =
                        (100 / swiper.params.slicerEffect.split) * i + '%';
                      cloneImg.style.left = `-${100 * i}%`;
                    }
                  });
              });
            }
          });
        }
      ],
      effect: 'slicer',
      slicerEffect: { split: 5 },
      direction: 'vertical',
      autoplay: {
        delay: 3000
      },
      loop: true,
      speed: 300,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }
};
</script>
