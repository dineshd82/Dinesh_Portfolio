/**
 * Centralized GSAP & ScrollTrigger animation controller
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all scroll-based reveal animations
 */
export function initAnimations() {
  const isReduced = prefersReducedMotion();

  // 1. Reveal Animations (.animate-me -> .animated)
  const animElements = $$('.animate-me');
  
  if (isReduced) {
    // If reduced motion is requested, instantly reveal all elements
    animElements.forEach((el) => el.classList.add('animated'));
  } else {
    animElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          el.classList.add('animated');
        }
      });
    });
  }

  // 2. Parallax Effects (replacing jQuery enllax plugin)
  if (!isReduced) {
    initParallax();
  }

  // 3. Dynamic Skill Line Width Calculation & Skill Hover Physics
  initSkillLines();
  initSkillsTilt();
}

/**
 * Modern GSAP ScrollTrigger parallax replacement for data-enllax-ratio
 */
function initParallax() {
  const parallaxElements = $$('[data-enllax-ratio]');

  parallaxElements.forEach((el) => {
    const ratio = parseFloat(el.getAttribute('data-enllax-ratio')) || 0.5;
    const isHorizontal = el.getAttribute('data-enllax-direction') === 'horizontal';
    const parentSection = el.closest('section') || el;
    const distance = ratio * 160;

    if (isHorizontal) {
      gsap.to(el, {
        x: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: parentSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    } else {
      gsap.to(el, {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: parentSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }
  });
}

/**
 * Calculate dynamic line width inside skill cards
 */
export function initSkillLines() {
  const updateLines = () => {
    const skills = $$('#me-working-skill .single-skill');
    skills.forEach((skill) => {
      const title = $('span.title', skill);
      const line = $('span.line', skill);
      if (title && line) {
        const titleWidth = Math.ceil(title.getBoundingClientRect().width);
        line.style.width = `calc(100% - ${titleWidth + 30}px)`;
      }
    });
  };

  // Run initially
  updateLines();

  // Run on font load / window resize
  if (document.fonts?.ready) {
    document.fonts.ready.then(updateLines);
  }
  window.addEventListener('resize', updateLines, { passive: true });
}

/**
 * Interactive 3D tilt & micro-physics for faceted skill items
 */
export function initSkillsTilt() {
  if (prefersReducedMotion()) return;

  const items = $$('.skill-item');
  if (!items.length) return;

  items.forEach((item) => {
    const container = item.querySelector('.skill-facet-container');
    if (!container) return;

    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = (e.clientX - centerX) / (rect.width / 2);
        const normY = (e.clientY - centerY) / (rect.height / 2);
        
        // Clamp to -1..1
        const clampedX = Math.max(-1, Math.min(1, normX));
        const clampedY = Math.max(-1, Math.min(1, normY));

        const tiltX = -clampedY * 7; // -7deg to +7deg
        const tiltY = clampedX * 7;  // -7deg to +7deg

        container.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        container.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.style.removeProperty('--tilt-x');
      container.style.removeProperty('--tilt-y');
    };

    item.addEventListener('mousemove', handleMouseMove, { passive: true });
    item.addEventListener('mouseleave', handleMouseLeave, { passive: true });
  });
}

