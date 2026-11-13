/**
 * Smooth scrolling powered by Lenis integrated with GSAP ScrollTrigger
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, debounce } from './utils.js';

let lenisInstance = null;

/**
 * Re-calculate layout dimensions for both Lenis and ScrollTrigger
 */
export function refreshScrollDimensions() {
  if (lenisInstance) {
    lenisInstance.resize();
  }
  ScrollTrigger.refresh();
}

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
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      autoResize: true,
      syncTouch: false
    });

    // Debounced dimension refresh to avoid layout thrashing while guaranteeing accuracy
    const debouncedRefresh = debounce(() => {
      refreshScrollDimensions();
    }, 120);

    // Synchronize Lenis with GSAP ScrollTrigger purely without forced synchronous layout reads
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Drive Lenis RAF from GSAP ticker for unified animation timing
    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });

    // Enable lag smoothing to gracefully absorb frame spikes without sudden scroll jumps
    gsap.ticker.lagSmoothing(500, 33);

    window.lenis = lenisInstance;

    // 1. Observe document.body size changes with debounced ResizeObserver
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      const resizeObserver = new ResizeObserver(() => {
        debouncedRefresh();
      });
      resizeObserver.observe(document.body);
    }

    // 2. Attach load/error listeners to all <img> tags (lazy-loaded images expand document height)
    const monitorImageLoads = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', () => debouncedRefresh(), { once: true });
          img.addEventListener('error', () => debouncedRefresh(), { once: true });
        }
      });
    };
    monitorImageLoads();

    // Re-check for newly added images after window load
    window.addEventListener('load', () => {
      monitorImageLoads();
      refreshScrollDimensions();
    }, { once: true });

    // 3. Update when custom fonts finish loading
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        debouncedRefresh();
      });
    }

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

