/**
 * Smooth scrolling powered by Lenis integrated with GSAP ScrollTrigger
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

let lenisInstance = null;

/**
 * Initialize Lenis smooth scrolling
 * @returns {Lenis|null}
 */
export function initSmoothScroll() {
  if (prefersReducedMotion()) {
    return null;
  }

  try {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    window.lenis = lenisInstance;

    return lenisInstance;
  } catch (error) {
    console.warn('Lenis smooth scroll initialization skipped:', error);
    return null;
  }
}

/**
 * Get current Lenis instance
 * @returns {Lenis|null}
 */
export function getLenis() {
  return lenisInstance;
}

/**
 * Smoothly scroll to target element or offset
 * @param {string|number|Element} target
 * @param {Object} [options]
 */
export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: 0,
      duration: 1.2,
      ...options
    });
  } else {
    // Native fallback
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

