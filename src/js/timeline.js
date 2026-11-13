/**
 * Experience & Education Interactive Timeline Controller
 * 
 * Features:
 * - GSAP ScrollTrigger synchronized timeline spine fill (scrubbed, reversible)
 * - Animated last-digit rolling effect (6 -> 5 -> 2 and reversed on scroll up)
 * - Date range cross-fade & progress bar synchronization
 * - Milestone indicator transitions (grey -> red when active, black when passed)
 * - Reduced motion support & dynamic responsive bound calculations
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, prefersReducedMotion, debounce } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initExperienceEducationTimeline() {
  const section = $('#experience-education');
  if (!section) return;

  const entries = $$('.timeline-entry', section);
  if (!entries.length) return;

  const rightCol = $('.timeline-right-column', section);
  const spineTrack = $('.timeline-spine-track', section);
  const spineFill = $('.timeline-spine-fill', section);
  const entriesList = $('.timeline-entries-list', section);

  // Left column elements
  const yearDigitItems = $$('.year-digit-item', section);
  const srYearEl = $('.timeline-year-sr', section);
  const dateEl = $('#timeline-active-date', section);
  const currentStepEl = $('.current-step', section);
  const progressFill = $('.timeline-progress-fill', section);

  const dates = [
    'FEB 2026 – PRESENT',
    'AUG 2022 – MAY 2025',
    '2019 – 2022'
  ];
  const steps = ['01', '02', '03'];
  const years = ['2026', '2025', '2022'];
  const progressWidths = ['33.33%', '66.66%', '100%'];

  const isReduced = prefersReducedMotion();
  let currentIndex = 0;

  // 1. Initial State Setup
  yearDigitItems.forEach((item, idx) => {
    if (idx === 0) {
      gsap.set(item, { yPercent: 0, opacity: 1 });
    } else {
      gsap.set(item, { yPercent: -100, opacity: 0 });
    }
  });

  updateMarkerClasses(0);

  // 2. Dynamic Spine Line Bounds Calculation
  function updateSpineBounds() {
    if (!entries.length || !rightCol || !spineTrack) return;
    const firstMarker = $('.timeline-marker', entries[0]);
    const lastMarker = $('.timeline-marker', entries[entries.length - 1]);
    if (!firstMarker || !lastMarker) return;

    const rightColRect = rightCol.getBoundingClientRect();
    const firstRect = firstMarker.getBoundingClientRect();
    const lastRect = lastMarker.getBoundingClientRect();

    const m1Y = (firstRect.top + firstRect.height / 2) - rightColRect.top;
    const m3Y = (lastRect.top + lastRect.height / 2) - rightColRect.top;

    const startY = Math.max(0, m1Y - 24);
    const endY = m3Y + 24;
    const totalHeight = endY - startY;

    spineTrack.style.top = `${startY}px`;
    spineTrack.style.height = `${totalHeight}px`;
  }

  updateSpineBounds();
  if (document.fonts?.ready) {
    document.fonts.ready.then(updateSpineBounds);
  }
  window.addEventListener('resize', debounce(updateSpineBounds, 120), { passive: true });

  // 3. Center Spine Progressive Fill Animation (GSAP Scrub)
  if (!isReduced && spineFill && entriesList) {
    gsap.fromTo(spineFill, 
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: entriesList,
          start: 'top 60%',
          end: 'bottom 55%',
          scrub: 0.25,
          invalidateOnRefresh: true
        }
      }
    );
  } else if (spineFill) {
    gsap.set(spineFill, { scaleY: 1 });
  }

  // 4. Milestone Marker Indicator Classes
  function updateMarkerClasses(targetIdx) {
    entries.forEach((entry, idx) => {
      entry.classList.remove('is-active', 'is-passed', 'is-unreached');
      if (idx === targetIdx) {
        entry.classList.add('is-active');
      } else if (idx < targetIdx) {
        entry.classList.add('is-passed');
      } else {
        entry.classList.add('is-unreached');
      }
    });
  }

  // 5. Digit Roll & Left Column Synchronization
  function setActiveMilestone(targetIdx, direction = 1) {
    if (targetIdx === currentIndex) return;

    const prevIndex = currentIndex;
    currentIndex = targetIdx;
    const dir = direction !== 0 ? direction : (targetIdx > prevIndex ? 1 : -1);

    // Update markers
    updateMarkerClasses(targetIdx);

    // Update active class on digit items
    yearDigitItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === targetIdx);
    });

    // Update screen-reader live year
    if (srYearEl) {
      srYearEl.textContent = years[targetIdx];
    }

    // Animate Year Digit Roll
    if (isReduced) {
      yearDigitItems.forEach((item, idx) => {
        gsap.set(item, { yPercent: idx === targetIdx ? 0 : -100, opacity: idx === targetIdx ? 1 : 0 });
      });
    } else {
      const exitingItem = yearDigitItems[prevIndex];
      const enteringItem = yearDigitItems[targetIdx];

      gsap.killTweensOf(yearDigitItems);

      // Hide all other items
      yearDigitItems.forEach((item, idx) => {
        if (idx !== prevIndex && idx !== targetIdx) {
          gsap.set(item, { yPercent: dir > 0 ? -100 : 100, opacity: 0 });
        }
      });

      if (dir > 0) {
        // Scrolling Down: current digit drops down out of view, new digit enters from above
        if (exitingItem) {
          gsap.to(exitingItem, {
            yPercent: 100,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
          });
        }
        if (enteringItem) {
          gsap.fromTo(enteringItem,
            { yPercent: -100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.inOut' }
          );
        }
      } else {
        // Scrolling Up: current digit rises up out of view, new digit enters from below
        if (exitingItem) {
          gsap.to(exitingItem, {
            yPercent: -100,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
          });
        }
        if (enteringItem) {
          gsap.fromTo(enteringItem,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.inOut' }
          );
        }
      }
    }

    // Update Date Range
    if (dateEl && dates[targetIdx]) {
      if (isReduced) {
        dateEl.textContent = dates[targetIdx];
      } else {
        gsap.to(dateEl, {
          opacity: 0,
          y: dir > 0 ? 6 : -6,
          duration: 0.16,
          ease: 'power1.in',
          onComplete: () => {
            dateEl.textContent = dates[targetIdx];
            gsap.fromTo(dateEl,
              { opacity: 0, y: dir > 0 ? -6 : 6 },
              { opacity: 1, y: 0, duration: 0.24, ease: 'power1.out' }
            );
          }
        });
      }
    }

    // Update Progress Step
    if (currentStepEl && steps[targetIdx]) {
      currentStepEl.textContent = steps[targetIdx];
    }

    // Update Progress Bar Fill
    if (progressFill && progressWidths[targetIdx]) {
      if (isReduced) {
        progressFill.style.width = progressWidths[targetIdx];
      } else {
        gsap.to(progressFill, {
          width: progressWidths[targetIdx],
          duration: 0.45,
          ease: 'power2.out'
        });
      }
    }
  }

  // 6. High-Performance ScrollTrigger Milestone Position Tracking
  // Pre-computes and caches scroll offsets on refresh — zero layout reads during scrolling
  entries.forEach((entry, idx) => {
    ScrollTrigger.create({
      trigger: entry,
      start: 'top 52%',
      onEnter: () => setActiveMilestone(idx, 1),
      onLeaveBack: () => {
        if (idx > 0) {
          setActiveMilestone(idx - 1, -1);
        } else {
          setActiveMilestone(0, -1);
        }
      }
    });
  });

  // Re-check on refresh to ensure spine alignment and correct milestone selection
  ScrollTrigger.addEventListener('refresh', () => {
    updateSpineBounds();
    const triggerThreshold = window.innerHeight * 0.52;
    let targetIdx = 0;
    for (let i = 0; i < entries.length; i++) {
      const rect = entries[i].getBoundingClientRect();
      if (rect.top <= triggerThreshold) {
        targetIdx = i;
      }
    }
    setActiveMilestone(targetIdx, 0);
  });
}
