(function () {
  'use strict';

  var mq     = matchMedia('(max-width: 1000px)');
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('menu');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.toggleAttribute('inert', mq.matches && !open);
  }

  burger.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  // never leave the overlay stranded across the breakpoint
  if (mq.addEventListener) mq.addEventListener('change', function () { setMenu(false); });
  else mq.addListener(function () { setMenu(false); });
  setMenu(false);

  // reveal the sections below the hero as they come into view
  var reveal = document.querySelectorAll('.up');
  if (reveal.length) {
    if (!('IntersectionObserver' in window) ||
        matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal.forEach(function (el) { el.classList.add('seen'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('seen');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -12% 0px' });
      reveal.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        io.observe(el);
      });
    }
  }

  var btn = document.querySelector('.scroll__btn');
  if (btn) {
    btn.addEventListener('click', function () {
      window.scrollBy({ top: innerHeight * 0.9, behavior: 'smooth' });
    });
  }
})();
