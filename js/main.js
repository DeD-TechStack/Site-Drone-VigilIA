// main.js — Typewriter, scroll, fade-in, navbar, telemetry, animated counters

window.addEventListener('load', function () {

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------
  // 0. MOBILE NAV TOGGLE — hamburger open/close
  // -------------------------------------------------------
  var navToggle = document.getElementById('nav-toggle');
  var navbar    = document.getElementById('navbar');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    // Close menu when any nav link is clicked (anchor navigation)
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navbar.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navbar.classList.contains('nav-open')) {
        navbar.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        navToggle.focus();
      }
    });
  }

  // -------------------------------------------------------
  // 1. TYPEWRITER — hero subtitle
  // -------------------------------------------------------
  var heroText = 'DRONE NACIONAL · ASA FIXA SOLAR · VIGILÂNCIA URBANA AUTÔNOMA';
  var charIdx  = 0;
  var heroEl   = document.getElementById('hero-subtitle');

  if (heroEl) {
    if (reducedMotion) {
      heroEl.textContent = heroText;
    } else {
      function typeChar() {
        if (charIdx < heroText.length) {
          heroEl.textContent += heroText[charIdx++];
          setTimeout(typeChar, 80);
        }
      }
      typeChar();
    }
  }

  // -------------------------------------------------------
  // 1b. NAVBAR SCROLLED STATE — shadow once user scrolls
  // -------------------------------------------------------
  if (navbar) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set on load in case page is already scrolled
  }

  // -------------------------------------------------------
  // 2. BACK-TO-TOP BUTTON — show after 300px scroll
  // -------------------------------------------------------
  var btnTopo = document.getElementById('btn-topo');

  if (btnTopo) {
    window.addEventListener('scroll', function () {
      btnTopo.style.display = window.scrollY > 300 ? 'block' : 'none';
    }, { passive: true });
  }

  // -------------------------------------------------------
  // 3. SECTION FADE-IN — IntersectionObserver
  // -------------------------------------------------------
  if (reducedMotion) {
    // Skip fade animation — show all sections immediately
    document.querySelectorAll('section').forEach(function (s) {
      s.classList.add('visible');
    });
  } else {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(function (s) {
      sectionObserver.observe(s);
    });
  }

  // -------------------------------------------------------
  // 4. NAVBAR ACTIVE HIGHLIGHT — IntersectionObserver
  // -------------------------------------------------------
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(function (a) {
          a.classList.remove('active');
        });
        var link = document.querySelector('.nav-links a[data-section="' + entry.target.id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(function (s) {
    navObserver.observe(s);
  });

  // -------------------------------------------------------
  // 5. TELEMETRY — simulate live updates every 3s
  //    Sync HUD readouts and hero-tel chips simultaneously
  // -------------------------------------------------------
  setInterval(function () {
    var hudSolar  = document.getElementById('tel-solar');
    var hudBat    = document.getElementById('tel-bat');

    var newSolar = (55 + Math.floor(Math.random() * 36)).toString();
    if (hudSolar) hudSolar.textContent = newSolar;

    var batVal = hudBat ? parseInt(hudBat.textContent, 10) : 88;
    var newBat = Math.max(10, batVal - Math.round(Math.random())).toString();
    if (hudBat) hudBat.textContent = newBat;

    // Mirror values in hero-tel chips (look for strong elements by position)
    var telChips = document.querySelectorAll('.hero-tel span strong');
    // telChips[0] = SOLAR value, telChips[1] = BAT value
    if (telChips[0]) telChips[0].textContent = newSolar;
    if (telChips[1]) telChips[1].textContent = newBat;
  }, 3000);

  // -------------------------------------------------------
  // 6. ANIMATED COUNTERS — data-count attribute
  // -------------------------------------------------------
  function animateCount(el, target, duration) {
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toString();
      }
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var target = parseInt(el.dataset.count, 10);
        animateCount(el, target, 1500);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

});
