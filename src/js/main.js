/**
 * Main application entry point
 */
import '../css/main.css';
import { initSmoothScroll } from './smoothScroll.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initSliders } from './slider.js';
import { initProjectAtropos } from './atropos.js';
import { initSelectedWork } from './selectedWork.js';
import { initThemeRope } from './themeRope.js';
import { initExperienceEducationTimeline } from './timeline.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Prevent unwanted browser scroll jumping on reload when no hash is present
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

function dismissPreloader() {
  const preloader = document.getElementById('page-preloader');
  if (preloader) {
    preloader.classList.add('loaded');
    document.body.classList.remove('is-loading');
    setTimeout(() => {
      preloader.remove();
    }, 400);
  } else {
    document.body.classList.remove('is-loading');
  }
}

/**
 * Lazy-load Three.js interactive Hero 3D visual
 * Keeps main bundle lightweight and defers Three.js engine initialization
 */
function loadHero3D() {
  const container = document.getElementById('hero-3d-container');
  if (!container) return;

  const load = () => {
    import('../3d/HeroScene.js')
      .then(({ initHeroExperience }) => {
        initHeroExperience(container);
      })
      .catch((err) => {
        console.warn('Hero 3D could not be initialized:', err);
      });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(load, { timeout: 1500 });
  } else {
    setTimeout(load, 100);
  }
}

/**
 * Contact form submission handling with visual feedback
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  if (!form || !submitBtn) return;

  const originalBtnHTML = submitBtn.innerHTML;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="btn-text">Sending...</span>
      <svg class="btn-plane-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-dasharray="28" stroke-dashoffset="10"/>
      </svg>
    `;

    setTimeout(() => {
      submitBtn.classList.add('is-success');
      submitBtn.innerHTML = `
        <span class="btn-text">Message Sent!</span>
        <svg class="btn-plane-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      form.reset();

      setTimeout(() => {
        submitBtn.classList.remove('is-success');
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.disabled = false;
      }, 3500);
    }, 700);
  });
}

function initApp() {
  // Update copyright year
  const yearEls = document.querySelectorAll('.update-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = currentYear;
  });

  // 1. Initialize sliders (Swiper) so DOM containers are established
  initSliders();

  // 1b. Initialize Selected Work showcase
  initSelectedWork();

  // 1c. Initialize Atropos 3D parallax hover effect on projects image visual area
  initProjectAtropos();

  // 2. Initialize smooth scrolling with Lenis
  initSmoothScroll();

  // 3. Initialize navigation & interactions
  initNavigation();

  // 3b. Initialize Interactive Ceiling Pull-Rope Theme Switch
  initThemeRope();

  // 4. Initialize GSAP ScrollTrigger animations & parallax
  initAnimations();

  // 4b. Initialize Experience & Education interactive timeline
  initExperienceEducationTimeline();

  // 4c. Initialize Contact Form submission feedback
  initContactForm();

  // 5. Lazy-load Three.js Hero 3D Experience (strictly contained in Hero)
  loadHero3D();

  // 6. Dismiss preloader seamlessly once initial layout is ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dismissPreloader();
      ScrollTrigger.refresh();
      if (window.location.hash) {
        setTimeout(() => {
          const target = document.querySelector(window.location.hash);
          if (target) {
            if (window.lenis) {
              window.lenis.scrollTo(target, { immediate: true });
            } else {
              target.scrollIntoView();
            }
          }
        }, 600);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
