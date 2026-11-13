import Atropos from 'atropos';
import { prefersReducedMotion } from './utils.js';

let projectAtroposInstance = null;

/**
 * Initialize Atropos 3D parallax hover effect on the Projects visual container
 */
export function initProjectAtropos() {
  const el = document.querySelector('.portfolio-img.project-atropos');
  if (!el) return;

  // Respect accessibility preferences
  if (prefersReducedMotion()) {
    if (projectAtroposInstance) {
      projectAtroposInstance.destroy();
      projectAtroposInstance = null;
    }
    return;
  }

  function handleResponsive() {
    // Desktop screens (> 991px): enable subtle, restrained 3D parallax
    // Tablet/mobile screens (<= 991px): disable 3D rotation to preserve touch scrolling
    const isDesktop = window.innerWidth > 991;

    if (isDesktop) {
      if (!projectAtroposInstance) {
        projectAtroposInstance = Atropos({
          el: el,
          rotateXMax: 8,
          rotateYMax: 8,
          activeOffset: 20,
          duration: 400,
          shadow: true,
          shadowOffset: 30,
          shadowScale: 0.95,
          highlight: true,
          rotateTouch: false
        });
      }
    } else {
      if (projectAtroposInstance) {
        projectAtroposInstance.destroy();
        projectAtroposInstance = null;
      }
    }
  }

  // Initial evaluation
  handleResponsive();

  // Watch for window resize to toggle between desktop 3D and responsive flat layout
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResponsive, 150);
  });
}

/**
 * Expose instance accessor if needed by other modules
 */
export function getProjectAtroposInstance() {
  return projectAtroposInstance;
}

