/**
 * Selected Work / Projects Showcase Module (High Performance & 60fps Smooth)
 * Features:
 * - Instantaneous Previous / Next project switching (0ms delay)
 * - Persistent slide pool (zero DOM node thrashing / innerHTML reconstruction)
 * - Project-specific 3-image automatic slideshow with 2.5s cycle interval
 * - Premium, silky smooth crossfade transition with hover pause/resume
 * - Modal case study gallery with all 7 screens for Oranzone Support App
 * - Dedicated scroll locking and restoration without page jump
 */

// Project 1 Images (Oranzone User App)
import oranzoneShowcaseImg from '../assets/images/oranzone-showcase-opt.jpg';
import oranzoneDeskImg from '../assets/images/oranzone-desk-opt.jpg';
import oranzoneHandImg from '../assets/images/project1-opt.jpg';

// Project 2 Images (Ride Booking & Parcel Delivery)
import ride1Img from '../assets/images/ride1-opt.jpg';
import ride2Img from '../assets/images/ride2-opt.jpg';
import ride3Img from '../assets/images/ride3-opt.jpg';

// Project 3 Images (Oranzone Support App - All 7 Screens)
import support1Img from '../assets/images/support1.png';
import support2Img from '../assets/images/support2.png';
import support3Img from '../assets/images/support3.png';
import support4Img from '../assets/images/support4.png';
import support5Img from '../assets/images/support5.png';
import support6Img from '../assets/images/support6.png';
import support7Img from '../assets/images/support7.png';

import { getLenis } from './smoothScroll.js';

export const projectsData = [
  {
    id: 'oranzone-user',
    num: '01',
    category: 'MOBILE APP • UI/UX DESIGN',
    titleMain: 'Oranzone',
    titleBrush: 'User App',
    description: 'A modern service-booking experience designed to make discovery, booking and ride tracking simple and intuitive.',
    tools: [
      { name: 'Figma', type: 'figma' },
      { name: 'Wireframing', type: 'wireframe' },
      { name: 'Prototype', type: 'prototype' }
    ],
    meta: {
      role: 'UI/UX Designer',
      year: '2026',
      platform: 'Mobile App',
      client: 'Oranzone Technologies',
      duration: '3 Months'
    },
    slideshowImages: [
      {
        src: oranzoneShowcaseImg,
        alt: 'Oranzone User App Multi-Screen Showcase',
        caption: 'Core Mobile Showcase — Home, Service Catalog, Ride Booking & Live Driver Telemetry'
      },
      {
        src: oranzoneDeskImg,
        alt: 'Oranzone Popular Services and Discovery Screen',
        caption: 'Discovery & Services Catalog — Category Browsing, Assistants & Event Exploration'
      },
      {
        src: oranzoneHandImg,
        alt: 'Oranzone User App Onboarding and Brand Splash',
        caption: 'High-Fidelity Mobile App Launch — Brand Onboarding & Splash Experience'
      }
    ],
    images: [
      {
        src: oranzoneShowcaseImg,
        alt: 'Oranzone User App Multi-Screen Showcase',
        caption: 'Core Mobile Showcase — Home, Service Catalog, Ride Booking & Live Driver Telemetry'
      },
      {
        src: oranzoneDeskImg,
        alt: 'Oranzone Popular Services and Discovery Screen',
        caption: 'Discovery & Services Catalog — Category Browsing, Assistants & Event Exploration'
      },
      {
        src: oranzoneHandImg,
        alt: 'Oranzone User App Onboarding and Brand Splash',
        caption: 'High-Fidelity Mobile App Launch — Brand Onboarding & Splash Experience'
      }
    ],
    caseStudy: {
      overview: 'Oranzone User App is an all-in-one multi-service booking platform. The challenge was organizing heterogeneous on-demand services (rides, logistics, on-demand errands) into a cohesive, lightning-fast user flow. Through rigorous user research, wireframing, and interactive prototypes, the experience was refined down to a 3-tap booking flow with real-time driver tracking and transparent upfront pricing.',
      highlights: [
        'End-to-end design system with 140+ reusable Figma components and token architecture',
        'Streamlined 3-step booking flow reducing user drop-off by 34%',
        'High-contrast live interactive map tracking engineered for outdoor daylight legibility',
        'Tested with 40+ user trials resulting in a 94% first-time task completion rate'
      ]
    }
  },
  {
    id: 'ride-booking',
    num: '02',
    category: 'MOBILE APP • UI/UX DESIGN',
    titleMain: 'Ride',
    titleBrush: 'Booking App',
    description: 'Fast, safe and reliable on-demand ride booking platform with live GPS tracking, seamless payments, and intuitive vehicle selection.',
    tools: [
      { name: 'Figma', type: 'figma' },
      { name: 'Wireframing', type: 'wireframe' },
      { name: 'Prototype', type: 'prototype' }
    ],
    meta: {
      role: 'UI/UX Designer',
      year: '2026',
      platform: 'Mobile App',
      client: 'Urban Mobility Labs',
      duration: '2.5 Months'
    },
    slideshowImages: [
      {
        src: ride1Img,
        alt: 'Ride Booking Tier Selection & Driver Telemetry',
        caption: 'Vehicle Tier Selection & Driver Dispatch — Sedan, Auto, Bike Classes & Live OTP Telemetry'
      },
      {
        src: ride2Img,
        alt: 'Ride Booking Route Optimization & Live GPS Tracking',
        caption: 'Trip Configuration & Live Telemetry — Vehicle Selection, Promo Coupons & Real-Time Driver Tracking'
      },
      {
        src: ride3Img,
        alt: 'Ride Booking Trips History & Bookings Management',
        caption: 'Bookings Management & History — Completed Rides, Driver Profiles & Trip Summaries'
      }
    ],
    images: [
      {
        src: ride1Img,
        alt: 'Ride Booking Tier Selection & Driver Telemetry',
        caption: 'Vehicle Tier Selection & Driver Dispatch — Sedan, Auto, Bike Classes & Live OTP Telemetry'
      },
      {
        src: ride2Img,
        alt: 'Ride Booking Route Optimization & Live GPS Tracking',
        caption: 'Trip Configuration & Live Telemetry — Vehicle Selection, Promo Coupons & Real-Time Driver Tracking'
      },
      {
        src: ride3Img,
        alt: 'Ride Booking Trips History & Bookings Management',
        caption: 'Bookings Management & History — Completed Rides, Driver Profiles & Trip Summaries'
      }
    ],
    caseStudy: {
      overview: 'A premium ride-hailing and parcel logistics app crafted for high-density metropolitan commuters. Focused on minimal cognitive load during rush hours, the interface emphasizes immediate pickup estimation, clear driver identity validation, and transparent multi-tier fares.',
      highlights: [
        'Dark and light mode optimized maps with contrast-compliant route lines',
        'Micro-interactions designed for single-hand thumb reachability on large displays',
        'Integrated coupon redemption and split-fare calculations with instant biometric confirmation',
        'Real-time trip sharing and automated anomaly detection for commuter safety'
      ]
    }
  },
  {
    id: 'oranzone-support',
    num: '03',
    category: 'MOBILE APP • UI/UX DESIGN',
    titleMain: 'Oranzone',
    titleBrush: 'Support App',
    description: 'Comprehensive partner and support management app designed for fast issue resolution, real-time ticket tracking, and multi-channel assistance.',
    tools: [
      { name: 'Figma', type: 'figma' },
      { name: 'Wireframing', type: 'wireframe' },
      { name: 'Design System', type: 'design-system' }
    ],
    meta: {
      role: 'UI/UX Designer',
      year: '2026',
      platform: 'Mobile App',
      client: 'Oranzone Partner Operations',
      duration: '3 Months'
    },
    slideshowImages: [
      {
        src: support1Img,
        alt: 'Oranzone Support App Event Details Hub',
        caption: 'Event Details & Community Hub — Stranger Meetup & Activity Booking'
      },
      {
        src: support2Img,
        alt: 'Oranzone Support Partner Dashboard & Earnings Overview',
        caption: 'Partner Operational Dashboard — Live Telemetry, Wallet Balance & Earnings Overview'
      },
      {
        src: support3Img,
        alt: 'Oranzone Support Revenue Analytics & Performance Charts',
        caption: 'Revenue & Analytics Console — Daily Earnings, Weekly Breakdown & Financial Performance'
      }
    ],
    images: [
      {
        src: support1Img,
        alt: 'support1.png — Event Details & Community Hub',
        caption: 'Event Details & Community Hub — Stranger Meetup & Activity Booking'
      },
      {
        src: support2Img,
        alt: 'support2.png — Partner Dashboard & Earnings Overview',
        caption: 'Partner Operational Dashboard — Live Telemetry, Wallet Balance & Earnings Overview'
      },
      {
        src: support3Img,
        alt: 'support3.png — Revenue Analytics & Performance Charts',
        caption: 'Revenue & Analytics Console — Daily Earnings, Weekly Breakdown & Financial Performance'
      },
      {
        src: support4Img,
        alt: 'support4.png — Partner Driver Brand Mobile Client',
        caption: 'Partner Mobile Identity — Dedicated Oranzone Driver & Service Agent Mobile Client'
      },
      {
        src: support5Img,
        alt: 'support5.png — Partner Verification & Document Check',
        caption: 'Partner Verification & Onboarding — Identity Check, Aadhaar/PAN & Vehicle Document Pipeline'
      },
      {
        src: support6Img,
        alt: 'support6.png — Fleet Vehicle Assignment Flow',
        caption: 'Fleet Service Configuration — Vehicle Class Assignment & Multimodal Service Selection'
      },
      {
        src: support7Img,
        alt: 'support7.png — Live Companion Session Telemetry',
        caption: 'Live Session Telemetry — Real-Time Companion Assistance & Session Timer Tracking'
      }
    ],
    caseStudy: {
      overview: 'Dedicated portal empowering drivers and customer support specialists with instant telemetry, automated resolution trees, and live emergency dispatch. Built to perform flawlessly across low-connectivity environments.',
      highlights: [
        'Streamlined ticket lifecycle cutting average resolution time by 38%',
        'Modular dashboard cards with customized priority sorting for field operators',
        'Biometric verification and secure document upload pipeline',
        'Full offline sync capability with optimistic UI state management'
      ]
    }
  }
];

export function initSelectedWork() {
  const section = document.getElementById('portfolio');
  if (!section) return;

  // Header Elements
  const counterCurrent = document.getElementById('project-counter-current');
  const counterTotal = document.getElementById('project-counter-total');
  const prevBtn = document.getElementById('project-prev-btn');
  const nextBtn = document.getElementById('project-next-btn');

  // Content Elements
  const categoryEl = document.getElementById('project-category');
  const titleEl = document.getElementById('project-title');
  const descEl = document.getElementById('project-description');
  const toolsEl = document.getElementById('project-tools');
  const viewBtn = document.getElementById('project-view-btn');
  const metaRole = document.getElementById('meta-role');
  const metaYear = document.getElementById('meta-year');
  const metaPlatform = document.getElementById('meta-platform');

  // Showcase Elements
  const showcaseCard = document.getElementById('project-showcase-card');
  const slidesWrapper = document.getElementById('showcase-slides-wrapper');

  // Modal Elements
  const modal = document.getElementById('project-case-study-modal');
  const modalScroller = document.getElementById('modal-scroller') || modal?.querySelector('.project-modal-scroller');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalMetaRow = document.getElementById('modal-meta-row');
  const modalOverview = document.getElementById('modal-overview-text');
  const modalHighlights = document.getElementById('modal-highlights-list');
  const modalGallery = document.getElementById('modal-gallery-grid');

  if (!slidesWrapper || !counterCurrent) return;

  let currentProjectIdx = 0;
  let currentSlideIdx = 0;
  let autoCycleTimer = null;
  let isHovered = false;
  let isSectionVisible = false;
  let isModalOpen = false;
  const CYCLE_INTERVAL = 2500; // Exact 2.5 seconds per requirements

  if (counterTotal) {
    counterTotal.textContent = String(projectsData.length).padStart(2, '0');
  }

  // Preload primary showcase images asynchronously
  const preloaded = new Set();
  function preloadImage(url) {
    if (!url || preloaded.has(url)) return;
    preloaded.add(url);
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  }

  projectsData.forEach(p => {
    (p.slideshowImages || []).forEach(img => {
      preloadImage(img.src);
    });
  });

  // Reusable tool icons
  function renderToolIcon(type) {
    if (type === 'figma') {
      return `
        <svg width="14" height="20" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" class="tool-icon" aria-hidden="true">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>`;
    } else if (type === 'wireframe') {
      return `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="tool-icon" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>`;
    } else if (type === 'prototype') {
      return `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="tool-icon" aria-hidden="true">
          <polygon points="6 4 18 12 6 20 6 4" fill="none"></polygon>
        </svg>`;
    } else {
      return `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tool-icon" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>`;
    }
  }

  // Pre-initialize a persistent pool of 3 slides (exactly 3 images per project slideshow)
  const MAX_SLIDES = 3;
  slidesWrapper.innerHTML = '';
  const slidePool = [];

  for (let i = 0; i < MAX_SLIDES; i++) {
    const slide = document.createElement('div');
    slide.className = `showcase-slide${i === 0 ? ' active' : ''}`;
    slide.setAttribute('data-index', i);

    const img = document.createElement('img');
    img.decoding = 'async';
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.alt = '';
    slide.appendChild(img);
    slidesWrapper.appendChild(slide);

    slidePool.push({ slide, img });
  }

  function applySlides(project) {
    currentSlideIdx = 0;
    const slides = project.slideshowImages || project.images.slice(0, 3);

    // Suppress CSS transition during project switch to prevent image mixing between projects
    slidesWrapper.classList.add('no-transition');

    for (let i = 0; i < MAX_SLIDES; i++) {
      const item = slidePool[i];
      if (i < slides.length) {
        item.img.src = slides[i].src;
        item.img.alt = slides[i].alt || '';
        item.slide.style.display = '';
        if (i === 0) {
          item.slide.classList.add('active');
        } else {
          item.slide.classList.remove('active');
        }
      } else {
        item.slide.style.display = 'none';
        item.slide.classList.remove('active');
      }
    }

    // Force reflow and re-enable smooth crossfade transitions for in-project rotation
    void slidesWrapper.offsetHeight;
    slidesWrapper.classList.remove('no-transition');
  }

  function applyContent(project) {
    if (categoryEl) categoryEl.textContent = project.category;

    if (titleEl) {
      titleEl.innerHTML = `
        <span class="title-main">${project.titleMain}</span>
        <span class="title-with-brush">
          <span class="title-brush-word">${project.titleBrush}</span>
          <svg class="title-brush-stroke" viewBox="0 0 220 22" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
            <path d="M4 14C55 5 130 4 216 10" stroke="var(--color-accent, #ff3b30)" stroke-width="4.5" stroke-linecap="round"/>
            <path d="M22 18C78 12 152 11 198 16" stroke="var(--color-accent, #ff3b30)" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </span>
      `;
    }

    if (descEl) descEl.textContent = project.description;

    if (toolsEl) {
      toolsEl.innerHTML = project.tools.map(tool => `
        <div class="tool-pill">
          ${renderToolIcon(tool.type)}
          <span>${tool.name}</span>
        </div>
      `).join('');
    }

    if (metaRole) metaRole.textContent = project.meta.role;
    if (metaYear) metaYear.textContent = project.meta.year;
    if (metaPlatform) metaPlatform.textContent = project.meta.platform;
  }

  function updateProject(project) {
    // 1. Instant counter update (0ms delay)
    if (counterCurrent) {
      counterCurrent.textContent = project.num;
    }

    // 2. Instant content update (0ms delay)
    applyContent(project);

    // 3. Instant slide pool update - resets to first image with no project mixing
    applySlides(project);

    // 4. Reset and restart auto-cycling if active
    if (isSectionVisible && !isHovered && !isModalOpen) {
      startAutoCycle();
    }
  }

  function startAutoCycle() {
    stopAutoCycle();
    if (!isSectionVisible || isHovered || isModalOpen) return;

    autoCycleTimer = setInterval(() => {
      if (!isSectionVisible || isHovered || isModalOpen) return;

      const project = projectsData[currentProjectIdx];
      const slides = project.slideshowImages || project.images.slice(0, 3);
      const count = slides.length;
      if (count <= 1) return;

      const prevIdx = currentSlideIdx;
      currentSlideIdx = (currentSlideIdx + 1) % count;

      slidePool[prevIdx].slide.classList.remove('active');
      slidePool[currentSlideIdx].slide.classList.add('active');
    }, CYCLE_INTERVAL);
  }

  function stopAutoCycle() {
    if (autoCycleTimer) {
      clearInterval(autoCycleTimer);
      autoCycleTimer = null;
    }
  }

  // Navigation handlers with instant response
  function goToNextProject() {
    currentProjectIdx = (currentProjectIdx + 1) % projectsData.length;
    updateProject(projectsData[currentProjectIdx]);
  }

  function goToPrevProject() {
    currentProjectIdx = (currentProjectIdx - 1 + projectsData.length) % projectsData.length;
    updateProject(projectsData[currentProjectIdx]);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToNextProject();
    }, { passive: false });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToPrevProject();
    }, { passive: false });
  }

  // Showcase card hover behavior: pause on hover, resume on pointer leave
  if (showcaseCard) {
    showcaseCard.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoCycle();
    }, { passive: true });

    showcaseCard.addEventListener('mouseleave', () => {
      isHovered = false;
      if (isSectionVisible && !isModalOpen) {
        startAutoCycle();
      }
    }, { passive: true });
  }

  // Tab visibility changes: pause on blur, resume on focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoCycle();
    } else if (isSectionVisible && !isHovered && !isModalOpen) {
      startAutoCycle();
    }
  });

  // IntersectionObserver to pause autoCycle when section is not in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isSectionVisible = entry.isIntersecting;
          if (isSectionVisible) {
            startAutoCycle();
          } else {
            stopAutoCycle();
          }
        }
      },
      { rootMargin: '100px 0px' }
    );
    observer.observe(section);
  } else {
    isSectionVisible = true;
    startAutoCycle();
  }

  // Modal functions with Lenis scroll lock & position restoration
  let savedScrollY = 0;

  function openCaseStudyModal(project) {
    if (!modal) return;
    isModalOpen = true;
    stopAutoCycle();

    // 1. Capture exact current scroll position before modifying any state
    const lenis = getLenis();
    savedScrollY = (lenis && typeof lenis.scroll === 'number')
      ? lenis.scroll
      : (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);

    // 2. Lock Lenis smooth scroll immediately
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }

    // 3. Mark html and body as locked to prevent background scrolling
    document.body.classList.add('modal-locked');
    document.documentElement.classList.add('modal-locked');

    // 4. Populate modal content efficiently
    if (modalCategory) modalCategory.textContent = project.category;
    if (modalTitle) modalTitle.textContent = `${project.titleMain} ${project.titleBrush}`;

    if (modalMetaRow) {
      modalMetaRow.innerHTML = `
        <div class="modal-meta-item">
          <span class="lbl">ROLE</span>
          <span class="val">${project.meta.role}</span>
        </div>
        <div class="modal-meta-item">
          <span class="lbl">YEAR</span>
          <span class="val">${project.meta.year}</span>
        </div>
        <div class="modal-meta-item">
          <span class="lbl">PLATFORM</span>
          <span class="val">${project.meta.platform}</span>
        </div>
        <div class="modal-meta-item">
          <span class="lbl">CLIENT</span>
          <span class="val">${project.meta.client || 'Client Project'}</span>
        </div>
        <div class="modal-meta-item">
          <span class="lbl">DURATION</span>
          <span class="val">${project.meta.duration || '3 Months'}</span>
        </div>
      `;
    }

    if (modalOverview) {
      modalOverview.textContent = project.caseStudy.overview;
    }

    if (modalHighlights) {
      modalHighlights.innerHTML = project.caseStudy.highlights.map(item => `
        <li>
          <span class="bullet" aria-hidden="true"></span>
          <span>${item}</span>
        </li>
      `).join('');
    }

    if (modalGallery) {
      modalGallery.innerHTML = project.images.map((img, i) => `
        <figure class="gallery-card">
          <div class="gallery-img-wrap">
            <img src="${img.src}" alt="${img.alt || ''}" loading="lazy" decoding="async">
          </div>
          <figcaption class="gallery-caption">
            <span class="gallery-index">0${i + 1}</span>
            <span class="gallery-desc">${img.caption || img.alt || ''}</span>
          </figcaption>
        </figure>
      `).join('');
    }

    // Reset modal scroll position to top
    if (modalScroller) {
      modalScroller.scrollTop = 0;
    }

    // 5. Activate modal visibility
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeCaseStudyModal() {
    if (!modal) return;
    isModalOpen = false;

    // 1. Hide modal
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    // 2. Unlock body scroll
    document.body.classList.remove('modal-locked');
    document.documentElement.classList.remove('modal-locked');

    // 3. Guarantee return to the exact same Selected Work position
    const lenis = getLenis();
    if (typeof savedScrollY === 'number') {
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(savedScrollY, { immediate: true });
      } else {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      }
    }

    // 4. Resume Lenis smooth scroll
    if (lenis && typeof lenis.start === 'function') {
      lenis.start();
    }

    // 5. Resume auto-cycling if section is visible
    if (isSectionVisible) {
      startAutoCycle();
    }
  }

  // Prevent background scroll propagation while inside the modal
  if (modalScroller) {
    modalScroller.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });

    modalScroller.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });
  }

  if (modal) {
    modal.addEventListener('wheel', (e) => {
      if (e.target === modal) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });

    modal.addEventListener('touchmove', (e) => {
      if (e.target === modal) {
        e.preventDefault();
      }
    }, { passive: false });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-scroller')) {
        closeCaseStudyModal();
      }
    });
  }

  // Open modal from View CTA button
  if (viewBtn) {
    viewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCaseStudyModal(projectsData[currentProjectIdx]);
    });
  }

  // Open modal from image hover arrow button
  const showcaseHoverArrow = document.getElementById('showcase-hover-arrow');
  if (showcaseHoverArrow) {
    showcaseHoverArrow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCaseStudyModal(projectsData[currentProjectIdx]);
    });
  }

  // Open modal from clicking on the showcase card itself
  if (showcaseCard) {
    showcaseCard.addEventListener('click', (e) => {
      if (e.target.closest('#showcase-hover-arrow')) return;
      openCaseStudyModal(projectsData[currentProjectIdx]);
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCaseStudyModal();
    });
  }

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (isModalOpen) {
      if (e.key === 'Escape') {
        closeCaseStudyModal();
      } else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        if (modalScroller && !modalScroller.contains(document.activeElement)) {
          e.preventDefault();
        }
      }
    }
  });

  // Initial render
  updateProject(projectsData[0]);
}
