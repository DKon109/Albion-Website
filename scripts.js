// ============================================================
// Albion Place Hotel — page interactions
//   1. Eased smooth-scroll for header anchor links.
//   2. Menu links (food / lunch / cocktails): laptop opens the PDF,
//      mobile opens the fitted image viewer.
//   3. What's On carousel: shows 3 posters at once, arrow + auto
//      advance, wraps around all 5.
// ============================================================

(function () {
  // -------- 0. Restore section on load -------------
  // When returning from the menu viewer (index.html#eat / #drink), align to
  // that section. Native anchor jumps are unreliable here because the section
  // images load after parse and shift the layout, so we re-align explicitly.
  function alignToHash() {
    var hash = location.hash;
    if (!hash || hash === '#') return;
    var target = document.querySelector(hash);
    if (!target) return;
    var header = document.querySelector('.site-header');
    var headerH = header ? header.offsetHeight : 0;
    var y = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
    window.scrollTo(0, y);
  }
  if (location.hash) {
    // Prevent the smooth-scroll CSS from animating this initial jump.
    var prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    alignToHash();                              // immediate best-effort
    window.addEventListener('load', function () {
      alignToHash();                            // after images finish loading
      setTimeout(function () {
        alignToHash();
        document.documentElement.style.scrollBehavior = prevBehavior;
      }, 60);
    });
  }

  // -------- 1. Smooth scroll -----------------------
  var SCROLL_DURATION = 700;
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function smoothScrollTo(targetY) {
    var startY = window.scrollY;
    var diff = targetY - startY;
    if (Math.abs(diff) < 2) return;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var t = Math.min(1, (ts - startTime) / SCROLL_DURATION);
      window.scrollTo(0, startY + diff * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('a.js-scroll').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href') || '';
      if (!href.startsWith('#') || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      document.body.classList.remove('nav-open');
      var headerH = document.querySelector('.site-header').offsetHeight || 0;
      var y = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      smoothScrollTo(y);
    });
  });

  // -------- 2. Menu router (laptop=PDF, mobile=fitted viewer) --
  // Any link with class "menu-link" and data-mobile-href is routed.
  // The mobile viewer picks the correct image via ?menu= query param.
  var MOBILE_QUERY = '(max-width: 820px)';
  function routeToViewer(link) {
    var target = link.getAttribute('data-mobile-href') || 'menu-view.html';
    // Tell the viewer which section to return to on Close (eat / drink).
    var section = link.closest('section[id]');
    if (section && target.indexOf('from=') === -1) {
      target += (target.indexOf('?') === -1 ? '?' : '&') + 'from=' + section.id;
    }
    window.location.href = target;
  }
  document.querySelectorAll('.menu-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.matchMedia(MOBILE_QUERY).matches) {
        e.preventDefault();
        routeToViewer(link);
      }
    });
  });
  // Backwards-compat alias for the old class name
  document.querySelectorAll('.food-menu-link').forEach(function (link) {
    if (link.classList.contains('menu-link')) return;
    link.addEventListener('click', function (e) {
      if (window.matchMedia(MOBILE_QUERY).matches) {
        e.preventDefault();
        routeToViewer(link);
      }
    });
  });

  // -------- 3. What's On carousel ------------------
  document.querySelectorAll('.whatson-carousel').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var slides = root.querySelectorAll('.carousel-slide');
    var prevBtn = root.querySelector('.carousel-arrow--prev');
    var nextBtn = root.querySelector('.carousel-arrow--next');
    if (!track || !slides.length) return;

    var count = slides.length;
    var interval = parseInt(track.dataset.autoplay || '5000', 10);
    var current = 0;
    var timer = null;

    function visibleCount() {
      var w = window.innerWidth;
      if (w <= 960) return 2; // 2 banners on mobile & tablet
      return 3;
    }
    function slideStep() {
      if (slides.length < 2) return slides[0] ? slides[0].getBoundingClientRect().width : 0;
      return slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
    }
    function goTo(idx) {
      var maxStart = count - visibleCount();
      if (idx > maxStart) idx = 0;
      if (idx < 0) idx = maxStart;
      current = idx;
      track.style.transform = 'translateX(' + (-current * slideStep()) + 'px)';
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function start() { stop(); timer = setInterval(next, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
    // Pause-on-hover only on devices that actually hover (desktop). Touch
    // devices (phones/tablets) never hover, so they keep auto-scrolling.
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
    }
    window.addEventListener('resize', function () { goTo(current); });

    goTo(0);
    start();
  });
})();
