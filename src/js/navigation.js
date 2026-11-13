/**
 * Navigation module: Header, Fullscreen Menu, Sticky state, Scroll-to-top, and Anchor scrolling
 */
import { $, $$, throttle } from './utils.js';
import { scrollTo } from './smoothScroll.js';

export function initNavigation() {
  const header = $('.header');
  const hamburger = $('.humbarger');
  const menuWrapper = $('.menu-wrapper');
  const menuLinks = $$('.main-menu li a');
  const scrollTopBtn = $('.scroll-top');
  const scrollMeBtn = $('#scroll-me');
  const hireMeBtns = $$('.hire-me');

  if (!header || !hamburger || !menuWrapper) return;

  // Enhance hamburger accessibility
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('tabindex', '0');
  hamburger.setAttribute('aria-label', 'Toggle navigation menu');
  hamburger.setAttribute('aria-expanded', 'false');

  const toggleMenu = () => {
    const isOpen = menuWrapper.classList.toggle('show-menu');
    header.classList.toggle('show-menu', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      // Focus first link in menu
      const firstLink = $('.main-menu li a');
      if (firstLink) setTimeout(() => firstLink.focus(), 100);
    } else {
      hamburger.focus();
    }
  };

  const closeMenu = () => {
    if (menuWrapper.classList.contains('show-menu')) {
      menuWrapper.classList.remove('show-menu');
      header.classList.remove('show-menu');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  // Hamburger click & keyboard activation
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuWrapper.classList.contains('show-menu')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Menu navigation links with smooth scrolling
  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        const target = $(href);
        if (target) {
          scrollTo(target, { offset: -20 });
        }
      }
    });
  });

  // Hero "scroll down" button
  if (scrollMeBtn) {
    scrollMeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const aboutSection = $('#about-me');
      if (aboutSection) {
        scrollTo(aboutSection);
      }
    });
  }

  // CTA buttons ("View My Work", "Hire me", etc.)
  const ctaBtns = $$('.hero-content .link-default, .hire-me, .view-work');
  ctaBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = $(href);
        if (target) {
          e.preventDefault();
          scrollTo(target, { offset: -20 });
        }
      }
    });
  });

  // Scroll-to-top button
  if (scrollTopBtn) {
    scrollTopBtn.setAttribute('role', 'button');
    scrollTopBtn.setAttribute('tabindex', '0');
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top of page');

    const handleScrollTopClick = (e) => {
      e.preventDefault();
      scrollTo(0);
    };

    scrollTopBtn.addEventListener('click', handleScrollTopClick);
    scrollTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleScrollTopClick(e);
      }
    });
  }

  // Throttled scroll listener for scroll-top visibility
  const onScroll = throttle(() => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Scroll-to-top button visibility
    if (scrollTopBtn) {
      if (scrollY > 200) {
        scrollTopBtn.classList.remove('not-visible');
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
        scrollTopBtn.classList.add('not-visible');
      }
    }
  }, 50);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check
}

