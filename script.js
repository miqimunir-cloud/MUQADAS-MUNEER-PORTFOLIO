/**
 * ESL TEACHER PORTFOLIO — script.js  (Muqadas Munir · v3)
 * =====================================================================
 * Features:
 *  1. Dark mode toggle — persists in localStorage
 *  2. Sticky header shadow on scroll
 *  3. Active nav link highlighting (IntersectionObserver)
 *  4. Mobile hamburger menu toggle
 *  5. Scroll-to-top button
 *  6. Fade-up entrance animations (IntersectionObserver)
 *  7. Demo video tab switcher (Video 1 / Video 2)
 * =====================================================================
 */

'use strict';

/* ---------------------------------------------------------------
   CONSTANTS — edit here to adjust behaviour
--------------------------------------------------------------- */
// EDIT: 'light' or 'dark' to change the default theme on first visit
const DEFAULT_THEME = 'light';

// EDIT: section IDs that the nav highlight system tracks.
// Must match the id="" attributes on your <section> elements.
const SECTION_IDS = [
  'home', 'about', 'philosophy', 'cv', 'certifications',
  'lesson-plans', 'materials', 'classroom', 'assessment',
  'demo', 'testimonials', 'cultural', 'contact'
];


/* ---------------------------------------------------------------
   1. DARK MODE TOGGLE
--------------------------------------------------------------- */
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function getTheme()       { return localStorage.getItem('portfolio-theme') || DEFAULT_THEME; }
function applyTheme(t)    { html.setAttribute('data-theme', t); localStorage.setItem('portfolio-theme', t); }

applyTheme(getTheme()); // Apply before first paint (no flash)

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}


/* ---------------------------------------------------------------
   2. STICKY HEADER + SCROLL-TO-TOP VISIBILITY
--------------------------------------------------------------- */
const header       = document.getElementById('site-header');
const scrollTopBtn = document.getElementById('scroll-top');

function onScroll() {
  if (header)       header.classList.toggle('scrolled', window.scrollY > 10);
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });


/* ---------------------------------------------------------------
   3. ACTIVE NAV LINK HIGHLIGHT
--------------------------------------------------------------- */
const navLinks   = document.querySelectorAll('.nav-link');
const navLinkMap = {};
navLinks.forEach(l => { navLinkMap[l.getAttribute('href').replace('#', '')] = l; });

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = navLinkMap[entry.target.id];
        if (link) link.classList.add('active');
      }
    });
  },
  { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
);

SECTION_IDS.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});


/* ---------------------------------------------------------------
   4. MOBILE HAMBURGER MENU
--------------------------------------------------------------- */
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  mainNav.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) {
      mainNav.classList.remove('open');
    }
  });

  document.addEventListener('click', e => {
    if (header && !header.contains(e.target) && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
    }
  });
}


/* ---------------------------------------------------------------
   5. SCROLL-TO-TOP BUTTON
--------------------------------------------------------------- */
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ---------------------------------------------------------------
   6. FADE-UP ENTRANCE ANIMATIONS
--------------------------------------------------------------- */
const AUTO_ANIMATE_SELECTORS = [
  '.phil-card', '.cert-card', '.lesson-card',
  '.cm-card', '.testimonial-card', '.ref-card',
  '.material-card', '.map-country', '.hero-stat',
  '.highlight-item', '.timeline-item', '.cv-job',
];

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

AUTO_ANIMATE_SELECTORS.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (!el.classList.contains('fade-up')) el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 0.07}s`;
    fadeObserver.observe(el);
  });
});


/* ---------------------------------------------------------------
   7. DEMO VIDEO TAB SWITCHER
   Switches between #demo-panel-1 and #demo-panel-2
   when the tab buttons are clicked.
--------------------------------------------------------------- */
const demoTabs   = document.querySelectorAll('.demo-tab');
const demoPanels = {
  '1': document.getElementById('demo-panel-1'),
  '2': document.getElementById('demo-panel-2'),
};

demoTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.video;

    // Update active tab state
    demoTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show/hide panels
    Object.entries(demoPanels).forEach(([key, panel]) => {
      if (!panel) return;
      panel.style.display = key === target ? '' : 'none';
    });
  });
});


/* ---------------------------------------------------------------
   8. SMOOTH SCROLL — header-offset aware
--------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 70);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ---------------------------------------------------------------
   DEV — console welcome
--------------------------------------------------------------- */
console.log(
  '%c Muqadas Munir · ESL Portfolio v3 ✦ ',
  'background:#1a2744;color:#c9a84c;font-size:1rem;padding:6px 14px;border-radius:4px;font-weight:bold;'
);
