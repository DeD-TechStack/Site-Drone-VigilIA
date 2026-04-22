// mission.js — Mission simulator: animated canvas phases + phase selector

/* ==========================================================
   Phase drawing functions
   Each receives (canvas, progress 0→1) and renders one frame.
   ========================================================== */

function drawVTOL(canvas, progress) {
  var dpr = window.devicePixelRatio || 1;
  var ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var W = canvas.width / dpr, H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000a00';
  ctx.fillRect(0, 0, W, H);

  var cx    = W / 2, cy = H * 0.55;
  var alpha = Math.min(progress * 2, 1);

  // Vertical lift arrows
  ctx.save();
  ctx.globalAlpha  = alpha;
  ctx.strokeStyle  = '#00ff41';
  ctx.lineWidth    = 2;
  [-60, 0, 60].forEach(function (dx) {
    var ax = cx + dx;
    var ay = cy - 60 - progress * 30;
    ctx.beginPath();
    ctx.moveTo(ax, ay + 40);
    ctx.lineTo(ax, ay);
    ctx.lineTo(ax - 8, ay + 12);
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + 8, ay + 12);
    ctx.stroke();
  });
  ctx.restore();

  // Fuselage (front view)
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#00ff41';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 50, 14, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Wings
  ctx.beginPath();
  ctx.moveTo(cx - 50, cy);
  ctx.lineTo(cx - 110, cy - 10);
  ctx.lineTo(cx - 110, cy + 6);
  ctx.lineTo(cx - 50, cy + 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 50, cy);
  ctx.lineTo(cx + 110, cy - 10);
  ctx.lineTo(cx + 110, cy + 6);
  ctx.lineTo(cx + 50, cy + 8);
  ctx.stroke();

  // Rotors (pulsing)
  var pulse = 0.5 + 0.5 * Math.sin(Date.now() / 80);
  [cx - 100, cx - 60, cx + 60, cx + 100].forEach(function (rx) {
    ctx.strokeStyle = 'rgba(0,255,65,' + (0.4 + 0.6 * pulse) + ')';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(rx, cy - 8, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rx - 16, cy - 8);
    ctx.lineTo(rx + 16, cy - 8);
    ctx.moveTo(rx, cy - 24);
    ctx.lineTo(rx, cy + 8);
    ctx.stroke();
  });
  ctx.restore();

  ctx.fillStyle = '#334433';
  ctx.font      = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VTOL ATIVO — DECOLAGEM VERTICAL', cx, H - 15);
}

function drawTransicao(canvas, progress) {
  var dpr = window.devicePixelRatio || 1;
  var ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var W = canvas.width / dpr, H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000a00';
  ctx.fillRect(0, 0, W, H);

  var alpha = Math.min(progress * 2, 1);
  var cx = W * 0.5, cy = H * 0.5;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Trajectory arc
  ctx.strokeStyle = 'rgba(0,255,65,0.3)';
  ctx.lineWidth   = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(W * 0.15, H * 0.8, W * 0.45, -Math.PI * 0.7, -Math.PI * 0.2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Drone (side profile)
  ctx.strokeStyle = '#00ff41';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 55, 12, -0.15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 4);
  ctx.lineTo(cx - 80, cy - 20);
  ctx.lineTo(cx + 30, cy - 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 50, cy + 4);
  ctx.lineTo(cx - 65, cy + 20);
  ctx.moveTo(cx - 50, cy + 4);
  ctx.lineTo(cx - 35, cy + 20);
  ctx.stroke();

  // Direction arrow
  var ax = cx + 80;
  ctx.strokeStyle = '#00cc33';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 60, cy);
  ctx.lineTo(ax, cy);
  ctx.lineTo(ax - 10, cy - 8);
  ctx.moveTo(ax, cy);
  ctx.lineTo(ax - 10, cy + 8);
  ctx.stroke();

  ctx.restore();
  ctx.fillStyle = '#334433';
  ctx.font      = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TRANSIÇÃO VTOL → ASA FIXA (~8s a 30m AGL)', W / 2, H - 15);
}

function drawCruzeiro(canvas, progress) {
  var dpr = window.devicePixelRatio || 1;
  var ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var W = canvas.width / dpr, H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000a00';
  ctx.fillRect(0, 0, W, H);

  var alpha = Math.min(progress * 2, 1);
  var cx = W * 0.45, cy = H * 0.42;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Drone (side profile)
  ctx.strokeStyle = '#00ff41';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 55, 11, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 3);
  ctx.lineTo(cx - 85, cy - 18);
  ctx.lineTo(cx + 30, cy - 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 50, cy + 3);
  ctx.lineTo(cx - 65, cy + 18);
  ctx.moveTo(cx - 50, cy + 3);
  ctx.lineTo(cx - 35, cy + 18);
  ctx.stroke();

  // Direction arrow
  ctx.strokeStyle = '#00cc33';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 60, cy);
  ctx.lineTo(cx + 90, cy);
  ctx.lineTo(cx + 78, cy - 7);
  ctx.moveTo(cx + 90, cy);
  ctx.lineTo(cx + 78, cy + 7);
  ctx.stroke();

  // Solar rays on wings
  var solarPulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
  ctx.strokeStyle = 'rgba(255,200,0,' + (0.2 + 0.3 * solarPulse) + ')';
  ctx.lineWidth   = 1;
  for (var s = 0; s < 5; s++) {
    var sx = cx - 80 + s * 18;
    ctx.beginPath();
    ctx.moveTo(sx, cy - 22); ctx.lineTo(sx - 4, cy - 30);
    ctx.moveTo(sx, cy - 22); ctx.lineTo(sx + 4, cy - 30);
    ctx.moveTo(sx, cy - 22); ctx.lineTo(sx,     cy - 32);
    ctx.stroke();
  }

  // Battery fill
  var bx   = W - 80, by = H * 0.3;
  var fill = Math.min(progress, 0.85);
  ctx.strokeStyle = '#00cc33';
  ctx.lineWidth   = 1.5;
  ctx.strokeRect(bx, by, 50, 22);
  ctx.fillStyle   = '#003300';
  ctx.fillRect(bx + 50, by + 7, 6, 8);
  ctx.fillStyle   = '#00ff41';
  ctx.fillRect(bx + 2, by + 2, 46 * fill, 18);
  ctx.fillStyle   = '#00ff41';
  ctx.font        = '10px monospace';
  ctx.textAlign   = 'center';
  ctx.fillText('BAT', bx + 25, by + 35);

  ctx.restore();
  ctx.fillStyle = '#334433';
  ctx.font      = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CRUZEIRO SOLAR — 65 km/h — MOTOR PUSHER ATIVO', W / 2, H - 15);
}

function drawPatrulha(canvas, progress) {
  var dpr = window.devicePixelRatio || 1;
  var ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var W = canvas.width / dpr, H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000a00';
  ctx.fillRect(0, 0, W, H);

  var alpha = Math.min(progress * 2, 1);
  var cx = W / 2, cy = H * 0.2;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Drone (bottom view)
  ctx.strokeStyle = '#00ff41';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 30, 10, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy);
  ctx.lineTo(cx - 90, cy - 5);
  ctx.lineTo(cx - 90, cy + 5);
  ctx.lineTo(cx - 30, cy + 4);
  ctx.moveTo(cx + 30, cy);
  ctx.lineTo(cx + 90, cy - 5);
  ctx.lineTo(cx + 90, cy + 5);
  ctx.lineTo(cx + 30, cy + 4);
  ctx.stroke();

  // Camera cone
  ctx.strokeStyle = 'rgba(0,255,65,0.2)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 10); ctx.lineTo(cx - 70, H - 40);
  ctx.moveTo(cx, cy + 10); ctx.lineTo(cx + 70, H - 40);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,255,65,0.08)';
  ctx.beginPath();
  ctx.moveTo(cx - 70, H - 40);
  ctx.lineTo(cx + 70, H - 40);
  ctx.stroke();

  // Detection boxes (blinking)
  var blink = Math.sin(Date.now() / 300) > 0;
  if (blink) {
    ctx.strokeStyle = '#cc4444';
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(cx - 50, H * 0.6, 40, 50);
    ctx.fillStyle   = '#cc4444';
    ctx.font        = '9px monospace';
    ctx.textAlign   = 'left';
    ctx.fillText('PESSOA', cx - 50, H * 0.6 - 4);
  }
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth   = 1;
  ctx.strokeRect(cx + 20, H * 0.55, 60, 35);
  ctx.fillStyle   = '#ffaa00';
  ctx.font        = '9px monospace';
  ctx.textAlign   = 'left';
  ctx.fillText('VEÍCULO', cx + 20, H * 0.55 - 4);

  // AI FPS overlay
  ctx.fillStyle = '#00ff41';
  ctx.font      = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('IA: 45 FPS | YOLOv8n', W - 10, 16);

  ctx.restore();
  ctx.fillStyle = '#334433';
  ctx.font      = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PATRULHA — DETECÇÃO EM TEMPO REAL — JETSON ORIN NX', W / 2, H - 15);
}

function drawAlerta(canvas, progress) {
  var dpr = window.devicePixelRatio || 1;
  var ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var W = canvas.width / dpr, H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000a00';
  ctx.fillRect(0, 0, W, H);

  var cx    = W / 2, cy = H * 0.45;
  var alpha = Math.min(progress * 2, 1);

  ctx.save();
  ctx.globalAlpha = alpha;

  // Signal waves
  var waveTime = Date.now() / 600;
  for (var w = 1; w <= 4; w++) {
    var r      = 30 + w * 25;
    var wAlpha = Math.max(0, 0.6 - w * 0.12) * (0.5 + 0.5 * Math.sin(waveTime - w));
    ctx.strokeStyle = 'rgba(68,136,255,' + wAlpha + ')';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * progress, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Alert triangle icon
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 22);
  ctx.lineTo(cx - 20, cy + 12);
  ctx.lineTo(cx + 20, cy + 12);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#ffaa00';
  ctx.font      = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('!', cx, cy + 10);

  // Cell broadcast label (blinking)
  var cbAlpha = Math.sin(Date.now() / 400) > 0 ? 1 : 0.3;
  ctx.fillStyle = 'rgba(68,136,255,' + cbAlpha + ')';
  ctx.font      = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CELL BROADCAST ATIVO', cx, cy + 50);

  ctx.fillStyle = '#88bb88';
  ctx.font      = '10px monospace';
  ctx.fillText('LATÊNCIA < 2s | ANATEL CB', cx, cy + 68);

  ctx.restore();
  ctx.fillStyle = '#334433';
  ctx.font      = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ALERTA DISPARADO — OPERADOR COP-SP AUTORIZOU', W / 2, H - 15);
}

function drawPouso(canvas, progress) {
  var dpr = window.devicePixelRatio || 1;
  var ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var W = canvas.width / dpr, H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000a00';
  ctx.fillRect(0, 0, W, H);

  var alpha = Math.min(progress * 2, 1);
  var cx    = W / 2;
  var cy    = H * 0.25 + progress * H * 0.35;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Descent arrows
  ctx.strokeStyle = '#00cc33';
  ctx.lineWidth   = 2;
  [-50, 0, 50].forEach(function (dx) {
    var ax = cx + dx;
    var ay = cy + 50;
    ctx.beginPath();
    ctx.moveTo(ax, cy + 10);
    ctx.lineTo(ax, ay);
    ctx.lineTo(ax - 8, ay - 12);
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + 8, ay - 12);
    ctx.stroke();
  });

  // Drone (front view)
  ctx.strokeStyle = '#00ff41';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 45, 13, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 45, cy);
  ctx.lineTo(cx - 100, cy - 8);
  ctx.lineTo(cx - 100, cy + 6);
  ctx.lineTo(cx - 45, cy + 6);
  ctx.moveTo(cx + 45, cy);
  ctx.lineTo(cx + 100, cy - 8);
  ctx.lineTo(cx + 100, cy + 6);
  ctx.lineTo(cx + 45, cy + 6);
  ctx.stroke();

  // Battery indicator
  var bx     = W - 90, by = 20;
  var batPct = 0.4 + 0.2 * progress;
  ctx.strokeStyle = '#00cc33';
  ctx.lineWidth   = 1.5;
  ctx.strokeRect(bx, by, 60, 20);
  ctx.fillStyle   = '#003300';
  ctx.fillRect(bx + 60, by + 6, 6, 8);
  ctx.fillStyle   = '#00ff41';
  ctx.fillRect(bx + 2, by + 2, 56 * batPct, 16);
  ctx.fillStyle   = '#00ff41';
  ctx.font        = '10px monospace';
  ctx.textAlign   = 'center';
  ctx.fillText(Math.round(batPct * 100) + '%', bx + 30, by + 34);

  // Ground line
  ctx.strokeStyle = '#003300';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(20, H - 35);
  ctx.lineTo(W - 20, H - 35);
  ctx.stroke();

  ctx.restore();
  ctx.fillStyle = '#334433';
  ctx.font      = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RETORNO AUTOMÁTICO — RTL GPS RTK — POUSO VTOL', W / 2, H - 15);
}

/* ==========================================================
   Phase data — stats, description, color, draw function
   ========================================================== */
var PHASES = [
  {
    name:  'DECOLAGEM VTOL',
    stats: [
      { label: 'CONSUMO', value: '300W' },
      { label: 'SOLAR',   value: '70W'  },
      { label: 'BALANÇO', value: '−230W' },
      { label: 'ALTITUDE', value: '0→50m' }
    ],
    desc:  'Os 4 rotores brushless T-Motor MN3110 ativam para decolagem vertical. Motor pusher desligado. Consumo de pico: 280–320W. Duração: ~5 min. Bateria Li-Ion fornece toda a energia nesta fase.',
    color: '#cc4444',
    draw:  drawVTOL
  },
  {
    name:  'SUBIDA E TRANSIÇÃO',
    stats: [
      { label: 'CONSUMO',  value: '165W'    },
      { label: 'SOLAR',    value: '70W'     },
      { label: 'BALANÇO',  value: '−95W'    },
      { label: 'ALTITUDE', value: '50→200m' }
    ],
    desc:  'Drone sobe para altitude de cruzeiro. Motor pusher inicia gradualmente enquanto rotores VTOL reduzem potência. Transição completa em ~8 segundos a 30m AGL. Consumo: 150–180W.',
    color: '#ffaa00',
    draw:  drawTransicao
  },
  {
    name:  'CRUZEIRO SOLAR',
    stats: [
      { label: 'CONSUMO',    value: '95W'     },
      { label: 'SOLAR',      value: '70W'     },
      { label: 'BALANÇO',    value: '−25W'    },
      { label: 'VELOCIDADE', value: '65 km/h' }
    ],
    desc:  'Voo de asa fixa em cruzeiro. Rotores VTOL recolhidos. Painéis SunPower C60 geram 96W de pico. Em modo planar com vento favorável o motor pode ser desligado — balanço positivo recarrega as baterias.',
    color: '#ffaa00',
    draw:  drawCruzeiro
  },
  {
    name:  'PATRULHA E DETECÇÃO IA',
    stats: [
      { label: 'CONSUMO', value: '70W'    },
      { label: 'SOLAR',   value: '70W'    },
      { label: 'BALANÇO', value: '±0W'   },
      { label: 'IA FPS',  value: '45 FPS' }
    ],
    desc:  'Jetson Orin NX executa YOLOv8n em tempo real: detecção de pessoas, veículos e comportamentos suspeitos. Câmera Sony IMX477 com gimbal Gremsy T3 estabilizado. Feed criptografado AES-256 para o COP-SP via 4G/5G.',
    color: '#00ff41',
    draw:  drawPatrulha
  },
  {
    name:  'ALERTA — CELL BROADCAST',
    stats: [
      { label: 'LATÊNCIA',  value: '<2s'      },
      { label: 'ALCANCE',   value: 'Célula 4G' },
      { label: 'OPERADOR',  value: 'COP-SP'   },
      { label: 'PROTOCOLO', value: 'ANATEL CB' }
    ],
    desc:  'IA detecta ocorrência com confiança > 95%. Operador humano no COP-SP confirma e autoriza alerta. Sistema Cell Broadcast da Anatel dispara notificação para todos os celulares na célula afetada em menos de 2 segundos.',
    color: '#4488ff',
    draw:  drawAlerta
  },
  {
    name:  'RETORNO E POUSO',
    stats: [
      { label: 'CONSUMO',      value: '280W'    },
      { label: 'SOLAR',        value: '70W'     },
      { label: 'BAT RESTANTE', value: '40–60%'  },
      { label: 'MODO',         value: 'RTL AUTO' }
    ],
    desc:  'GPS RTK Here3+ guia retorno automático (RTL). Rotores VTOL reativam para pouso vertical. Bateria retém 40–60% de carga — possibilitando segunda missão no mesmo dia sem recarga completa.',
    color: '#cc4444',
    draw:  drawPouso
  }
];

/* ==========================================================
   Rendering and interaction logic
   ========================================================== */
var currentPhase     = 0;
var missionAnimId    = null;
var autoAdvanceTimer = null;
var isPaused         = false;
var missionReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleMissionPause() {
  isPaused = !isPaused;
  var btn = document.getElementById('mission-pause-btn');
  if (!btn) return;
  if (isPaused) {
    btn.textContent = '▶ RETOMAR';
    btn.setAttribute('aria-label', 'Retomar avanço automático da simulação');
    btn.classList.add('active');
  } else {
    btn.textContent = '⏸ PAUSAR';
    btn.setAttribute('aria-label', 'Pausar avanço automático da simulação');
    btn.classList.remove('active');
  }
}

function renderPhase(index) {
  currentPhase = index;
  var phase  = PHASES[index];
  var canvas = document.getElementById('mission-canvas');
  if (!canvas) return;

  // Update phase header
  var phdrNum  = document.getElementById('mission-phase-num');
  var phdrName = document.getElementById('mission-phase-name');
  if (phdrNum)  phdrNum.textContent  = String(index + 1).padStart(2, '0') + '/' + String(PHASES.length).padStart(2, '0');
  if (phdrName) phdrName.textContent = phase.name;

  // Update stats panel
  var statsEl = document.getElementById('mission-stats');
  if (statsEl) {
    statsEl.innerHTML = phase.stats.map(function (s) {
      return '<div class="m-stat">' +
             '<span class="m-stat-label">' + s.label + '</span>' +
             '<span class="m-stat-value" style="color:' + phase.color + '">' + s.value + '</span>' +
             '</div>';
    }).join('');
  }

  // Update description panel
  var descEl = document.getElementById('mission-desc');
  if (descEl) {
    descEl.style.borderLeftColor = phase.color;
    descEl.textContent = phase.desc;
  }

  // Size canvas buffer to match current CSS layout × DPR (fixes blur on Retina
  // and on containers wider than the HTML width="420" attribute)
  var dpr  = window.devicePixelRatio || 1;
  var cssW = canvas.offsetWidth;
  var cssH = canvas.offsetHeight;
  if (cssW && cssH) {
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }

  // Run canvas animation
  if (missionAnimId) cancelAnimationFrame(missionAnimId);
  var startTime = null;
  var duration  = 600;

  function loop(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    phase.draw(canvas, progress);
    if (progress < 1) {
      missionAnimId = requestAnimationFrame(loop);
    } else if (!missionReducedMotion) {
      // Keep alive for phases with continuous animations (rotors, blink, etc.)
      function keepAlive() {
        phase.draw(canvas, 1);
        missionAnimId = requestAnimationFrame(keepAlive);
      }
      missionAnimId = requestAnimationFrame(keepAlive);
    }
  }

  missionAnimId = requestAnimationFrame(loop);
}

function startAutoAdvance() {
  if (missionReducedMotion) return; // user prefers reduced motion — manual only
  if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
  autoAdvanceTimer = setInterval(function () {
    if (isPaused) return;
    var next  = (currentPhase + 1) % PHASES.length;
    var items = document.querySelectorAll('.phase-item');
    items.forEach(function (p) { p.classList.remove('active'); });
    if (items[next]) items[next].classList.add('active');
    renderPhase(next);
  }, 5000);
}

window.addEventListener('load', function () {
  var items = document.querySelectorAll('.phase-item');

  items.forEach(function (item, i) {
    function activate() {
      items.forEach(function (p) { p.classList.remove('active'); });
      item.classList.add('active');
      renderPhase(i);
    }

    item.addEventListener('click', activate);

    // Keyboard support (Enter / Space) for role="button" divs
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  // Pause button — toggle auto-advance
  var pauseBtn = document.getElementById('mission-pause-btn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', toggleMissionPause);
  }

  // Pause auto-advance while hovering the simulator
  // (does not change the button state — hover-pause is temporary)
  var layout = document.querySelector('.mission-layout');
  if (layout) {
    layout.addEventListener('mouseenter', function () { isPaused = true; });
    layout.addEventListener('mouseleave', function () {
      // Only un-pause on mouse-leave if the pause button hasn't been explicitly toggled
      var btn = document.getElementById('mission-pause-btn');
      if (!btn || !btn.classList.contains('active')) {
        isPaused = false;
      }
    });
  }

  // Start when section enters viewport
  var secaoOp = document.getElementById('secao-op');
  if (secaoOp) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          renderPhase(0);
          startAutoAdvance();
          obs.unobserve(secaoOp);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(secaoOp);
  }

  // Redraw mission canvas on container resize (orientation change, sidebar, etc.)
  var missionCanvas = document.getElementById('mission-canvas');
  if (window.ResizeObserver && missionCanvas && missionCanvas.parentElement) {
    var missionResizeTimer;
    var missionRO = new ResizeObserver(function () {
      clearTimeout(missionResizeTimer);
      missionResizeTimer = setTimeout(function () {
        renderPhase(currentPhase);
      }, 150);
    });
    missionRO.observe(missionCanvas.parentElement);
  }
});
