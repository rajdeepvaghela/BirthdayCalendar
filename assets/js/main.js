/* ============================================================
   Birthday Calendar — site behaviour
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('bc-theme', next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#0a1420' : '#f5f9fd');
    });
  }

  /* ---------- Sticky header ---------- */
  var header = document.getElementById('siteHeader');
  var onScroll = function () {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------- Scroll-spy nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav ul a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.feature, .step, .shot, .card, .privacy-grid > *, .watch, .faq-item, .hero-copy > *, .download-inner > *'
  );

  if ('IntersectionObserver' in window && !reduceMotion) {
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
    });
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- Gallery tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));

  function activateTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    panels.forEach(function (p) {
      var on = p.id === tab.getAttribute('aria-controls');
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var dir = e.key === 'ArrowRight' ? 1 : -1;
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      activateTab(next);
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var lbTitle = document.getElementById('lightboxTitle');
  var lbNote = document.getElementById('lightboxNote');
  var lbClose = document.getElementById('lightboxClose');
  var lbPrev = document.getElementById('lightboxPrev');
  var lbNext = document.getElementById('lightboxNext');

  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var current = -1;

  function visibleShots() {
    var active = document.querySelector('.panel.is-active');
    if (!active) return shots;
    return Array.prototype.slice.call(active.querySelectorAll('.shot'));
  }

  function render(index) {
    var list = visibleShots();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var shot = list[current];
    lbImg.src = shot.dataset.shot;
    lbImg.alt = shot.querySelector('img').alt;
    lbTitle.textContent = shot.dataset.title || '';
    lbNote.textContent = shot.dataset.note || '';
  }

  function openLightbox(shot) {
    var list = visibleShots();
    var index = list.indexOf(shot);
    render(index);
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
  }

  shots.forEach(function (shot) {
    shot.addEventListener('click', function () { openLightbox(shot); });
  });

  if (lightbox) {
    lbClose.addEventListener('click', function () { lightbox.close(); });
    lbPrev.addEventListener('click', function () { render(current - 1); });
    lbNext.addEventListener('click', function () { render(current + 1); });

    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); render(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); render(current + 1); }
    });

    // Click on the backdrop (outside the figure) closes.
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.close();
    });
  }

  /* ---------- Hero tilt ---------- */
  var heroVisual = document.getElementById('heroVisual');
  var phone = heroVisual && heroVisual.querySelector('[data-tilt]');

  if (phone && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    heroVisual.addEventListener('mousemove', function (e) {
      var r = heroVisual.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      phone.style.setProperty('--ry', (px * 16).toFixed(2) + 'deg');
      phone.style.setProperty('--rx', (-py * 12).toFixed(2) + 'deg');
    });
    heroVisual.addEventListener('mouseleave', function () {
      phone.style.setProperty('--ry', '0deg');
      phone.style.setProperty('--rx', '0deg');
    });
  }

  /* ---------- Confetti on download ---------- */
  var confettiLayer = document.getElementById('confettiLayer');
  var CONFETTI_COLORS = ['#ffb347', '#01579b', '#2b7fc4', '#ffd48a', '#7fb3dc', '#ffffff'];

  function burst(origin) {
    if (!confettiLayer || reduceMotion) return;
    var rect = origin.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;

    for (var i = 0; i < 70; i++) {
      var bit = document.createElement('span');
      bit.className = 'confetti-bit';
      var angle = (Math.PI * 2 * i) / 70 + Math.random() * 0.4;
      var distance = 120 + Math.random() * 240;

      bit.style.left = x + 'px';
      bit.style.top = y + 'px';
      bit.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      bit.style.setProperty('--dx', (Math.cos(angle) * distance).toFixed(1) + 'px');
      bit.style.setProperty('--rot', (Math.random() * 1080 - 360).toFixed(0) + 'deg');
      bit.style.animationDuration = (1.5 + Math.random() * 1.2).toFixed(2) + 's';
      bit.style.animationDelay = (Math.random() * 0.25).toFixed(2) + 's';

      confettiLayer.appendChild(bit);
      (function (node) {
        setTimeout(function () { node.remove(); }, 3200);
      })(bit);
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-download]'), function (btn) {
    btn.addEventListener('click', function () {
      burst(btn);
    });
  });

  /* ---------- Smooth-scroll fallback for older browsers ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });
})();
