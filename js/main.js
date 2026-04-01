// main.js — Polish global: typewriter, scroll, fade-in, navbar, telemetria, contadores

window.addEventListener('load', function () {

  // 1. TYPEWRITER — hero subtitle
  const heroText = 'DRONE NACIONAL · ASA FIXA SOLAR · VIGILÂNCIA URBANA AUTÔNOMA';
  let charIdx = 0;
  const heroEl = document.getElementById('hero-subtitle');
  function typeChar() {
    if (charIdx < heroText.length) {
      heroEl.textContent += heroText[charIdx++];
      setTimeout(typeChar, 80);
    }
  }
  typeChar();

  // 2. BOTÃO TOPO — mostrar após 300px de scroll
  const btnTopo = document.getElementById('btn-topo');
  window.addEventListener('scroll', () => {
    btnTopo.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  // 3. FADE-IN SECTIONS
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

  // 4. NAVBAR HIGHLIGHT
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        const link = document.querySelector('.nav-links a[data-section="' + entry.target.id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

  // 5. TELEMETRIA — atualiza a cada 3s
  setInterval(() => {
    const solar = document.getElementById('tel-solar');
    const bat = document.getElementById('tel-bat');
    if (solar) solar.textContent = (55 + Math.floor(Math.random() * 36)).toString();
    if (bat) {
      const val = parseInt(bat.textContent, 10);
      bat.textContent = Math.max(10, val - Math.round(Math.random())).toString();
    }
  }, 3000);

  // 6. CONTADORES ANIMADOS — data-count
  function animateCount(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCount(el, target, 1500);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

});
