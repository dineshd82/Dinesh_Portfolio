/**
 * Modern Slider module powered by Swiper (replacing legacy Slick)
 */
import Swiper from 'swiper';
import { Autoplay, EffectFade, Controller } from 'swiper/modules';
import { $, $$ } from './utils.js';

export function initSliders() {
  initTestimonialSlider();
}

/**
 * Testimonial synchronized quote & author avatar slider
 */
function initTestimonialSlider() {
  const quoteContainer = $('.single-testimonial');
  const authorContainer = $('.author-img-wrapper');
  const dotsContainer = $('.testimonial-dots');

  if (!quoteContainer || !authorContainer) return;

  const authorSwiper = new Swiper(authorContainer, {
    modules: [EffectFade],
    effect: 'fade',
    fadeEffect: { crossFade: true },
    allowTouchMove: false,
    speed: 1200
  });

  const quoteSwiper = new Swiper(quoteContainer, {
    modules: [Autoplay],
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    speed: 1200,
    on: {
      init: function () {
        setupDots(this);
      },
      slideChange: function () {
        authorSwiper.slideTo(this.realIndex);
        updateDots(this.realIndex);
      }
    }
  });

  function setupDots(swiper) {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    for (let i = 0; i < swiper.slides.length; i++) {
      const li = document.createElement('li');
      if (i === 0) li.classList.add('slick-active');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      btn.addEventListener('click', () => {
        swiper.slideTo(i);
      });

      li.appendChild(btn);
      dotsContainer.appendChild(li);
    }
  }

  function updateDots(activeIndex) {
    if (!dotsContainer) return;
    const items = $$('li', dotsContainer);
    items.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('slick-active');
      } else {
        item.classList.remove('slick-active');
      }
    });
  }
}

