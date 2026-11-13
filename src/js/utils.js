/**
 * Utility functions for DOM manipulation and helpers
 */

/**
 * Select a single DOM element
 * @param {string} selector
 * @param {Document|Element} parent
 * @returns {Element|null}
 */
export const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Select all matching DOM elements as an Array
 * @param {string} selector
 * @param {Document|Element} parent
 * @returns {Element[]}
 */
export const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * Throttle a function
 * @param {Function} fn
 * @param {number} limit
 * @returns {Function}
 */
export const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

