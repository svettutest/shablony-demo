/* Behaviour copied from the MotionSites "Velar." pattern.
   Timings, easing and the scroll maths are theirs, verbatim. */
(function () {
  'use strict';

  var FULL_TEXT      = 'Sawah.';
  var CHAR_INTERVAL  = 140;
  var TYPE_START     = 600;
  var LIFT_AT        = TYPE_START + 6 * CHAR_INTERVAL + 700;
  var FINAL_SCALE    = 1.45;

  var pre        = document.getElementById('preloader');
  var preLetters = document.getElementById('preLetters');
  var preCursor  = document.getElementById('preCursor');
  var heroText   = document.getElementById('heroText');
  var houseWrap  = document.getElementById('houseWrap');
  var houseInner = document.getElementById('houseInner');
  var houseImg   = document.getElementById('houseImg');
  var hero       = document.querySelector('.hero');
  var darkOuter  = document.getElementById('darkOuter');
  var nav        = document.getElementById('nav');
  var gallery    = document.querySelector('.gallery');

  var liftDone = false;

  // ---------- Section 1: type the word, then lift the overlay ----------
  FULL_TEXT.split('').forEach(function (ch) {
    var i = document.createElement('i');
    if (ch === '.') i.className = 'dot';
    i.textContent = ch;
    preLetters.appendChild(i);
  });
  var letters = preLetters.querySelectorAll('i');

  letters.forEach(function (el, i) {
    setTimeout(function () { el.classList.add('on'); }, TYPE_START + i * CHAR_INTERVAL);
  });
  setTimeout(function () { preCursor.classList.add('off'); }, LIFT_AT - 150);
  setTimeout(function () {
    pre.classList.add('lift');
    houseInner.classList.add('rise');
  }, LIFT_AT);
  setTimeout(function () { heroText.classList.add('in'); }, LIFT_AT + 1300);
  setTimeout(function () {
    liftDone = true;
    pre.classList.add('parked');
    houseInner.classList.add('free');
    updateHouse();
  }, LIFT_AT + 2100);

  // ---------- Section 2: nav colour over dark sections ----------
  function overlapsTop(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    return r.top <= 0 && r.bottom > 0;
  }
  function updateNav() {
    var onDark = overlapsTop(darkOuter) || overlapsTop(gallery);
    nav.classList.toggle('on-dark', onDark);
  }

  var toggle = document.getElementById('navToggle');
  var menu   = document.getElementById('menu');
  toggle.addEventListener('click', function () {
    var open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- Section 4: scroll-driven pavilion ----------
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  function updateHouse() {
    if (!liftDone) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var baseW = Math.max(vw, 1400);
    var imgH = houseImg.naturalWidth
      ? baseW * (houseImg.naturalHeight / houseImg.naturalWidth)
      : houseImg.getBoundingClientRect().height;
    if (!imgH) return;

    var heroRect = hero.getBoundingClientRect();
    var darkRect = darkOuter.getBoundingClientRect();
    var heroH = hero.offsetHeight;

    var triggerPoint = -(heroH * 0.30);
    var endPoint = heroRect.top - (darkRect.bottom - vh);
    var denom = (endPoint - triggerPoint) || 1;
    var progress = Math.min(1, Math.max(0, (heroRect.top - triggerPoint) / denom));

    if (progress <= 0) {
      houseWrap.style.top = '';
      houseWrap.style.left = '';
      houseWrap.style.bottom = '0';
      houseWrap.style.transform = 'translateX(-50%)';
      houseWrap.style.transformOrigin = '';
      return;
    }

    var t = smoothstep(smoothstep(progress));

    var startX = (vw - baseW) / 2;
    var startY = vh - imgH;
    var finalX = (vw - baseW * FINAL_SCALE) / 2;
    var mobileOffset = vw < 1024 ? -250 : 4;
    var finalY = darkRect.bottom - imgH * FINAL_SCALE + 500 + mobileOffset;

    var currentX = startX + (finalX - startX) * t;
    var currentY = startY + (finalY - startY) * t;
    var currentScale = 1 + (FINAL_SCALE - 1) * t;

    houseWrap.style.bottom = 'auto';
    houseWrap.style.top = '0';
    houseWrap.style.left = '0';
    houseWrap.style.transformOrigin = 'top left';
    houseWrap.style.transform =
      'translate(' + currentX + 'px,' + currentY + 'px) scale(' + currentScale + ')';
  }

  // ---------- Section 5: count up once in view ----------
  var counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - start) / 2000);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * end) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.intersectionRatio >= 0.3) { runCounters(); obs.disconnect(); }
      });
    }, { threshold: [0.3] }).observe(document.getElementById('stats'));
  } else {
    runCounters();
  }

  // ---------- listeners ----------
  function onScroll() { updateHouse(); updateNav(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  houseImg.addEventListener('load', updateHouse);
  updateNav();
})();
