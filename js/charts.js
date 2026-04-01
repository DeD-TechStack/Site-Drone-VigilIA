// charts.js — Gráficos e dashboards do VigilIA

/* ===================================================
   TASK 3 — Gráfico de Energia por Modo de Voo
   =================================================== */
function drawEnergiaChart(canvas) {
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var modos = [
    { label: 'Decolagem VTOL',   consumo: 300, solar: 70 },
    { label: 'Subida altitude',  consumo: 165, solar: 70 },
    { label: 'Cruzeiro motor',   consumo: 100, solar: 70 },
    { label: 'Planar otimizado', consumo:  40, solar: 70 },
    { label: 'Patrulha lenta',   consumo:  70, solar: 70 },
    { label: 'Pouso VTOL',       consumo: 260, solar: 70 }
  ];

  var paddingLeft = 130, paddingRight = 20, paddingTop = 20, paddingBottom = 30;
  var chartW = W - paddingLeft - paddingRight;
  var chartH = H - paddingTop - paddingBottom;
  var maxVal = 320;
  var barH = Math.floor((chartH / modos.length) * 0.35);
  var groupH = Math.floor(chartH / modos.length);

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  for (var g = 0; g <= maxVal; g += 50) {
    var gx = paddingLeft + (g / maxVal) * chartW;
    ctx.strokeStyle = 'rgba(0,51,0,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx, paddingTop);
    ctx.lineTo(gx, H - paddingBottom);
    ctx.stroke();
    ctx.fillStyle = '#446644';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(g + 'W', gx, H - paddingBottom + 14);
  }

  var startTime = null;
  var duration = 800;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);

    ctx.clearRect(0, 0, W, H);

    // Re-draw grid
    for (var g = 0; g <= maxVal; g += 50) {
      var gx = paddingLeft + (g / maxVal) * chartW;
      ctx.strokeStyle = 'rgba(0,51,0,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, paddingTop);
      ctx.lineTo(gx, H - paddingBottom);
      ctx.stroke();
      ctx.fillStyle = '#446644';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(g + 'W', gx, H - paddingBottom + 14);
    }

    modos.forEach(function(m, i) {
      var y = paddingTop + i * groupH;
      var consumoColor = m.consumo > m.solar + 20 ? '#cc4444'
                       : m.consumo < m.solar - 10 ? '#00ff41'
                       : '#ffaa00';

      // Label
      ctx.fillStyle = '#88bb88';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(m.label, paddingLeft - 8, y + groupH * 0.4);

      // Barra consumo
      var cW = (m.consumo / maxVal) * chartW * progress;
      ctx.fillStyle = consumoColor;
      ctx.fillRect(paddingLeft, y + 4, cW, barH);

      // Barra solar
      var sW = (m.solar / maxVal) * chartW * progress;
      ctx.fillStyle = '#006622';
      ctx.fillRect(paddingLeft, y + 4 + barH + 2, sW, barH);
    });

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ===================================================
   TASK 4 — Gráfico de Custo por Escala de Produção
   =================================================== */
function drawEscalaChart(canvas) {
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var dados = [
    { label: 'Protótipo (1)',     min: 55000,  max: 96000  },
    { label: 'Série (10–50)',     min: 35000,  max: 55000  },
    { label: 'Escala (500+)',     min: 18000,  max: 28000  }
  ];

  var padL = 60, padR = 40, padT = 30, padB = 40;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;
  var maxY = 100000;
  var n = dados.length;
  var xStep = chartW / (n - 1);

  function yPos(val) { return padT + chartH - (val / maxY) * chartH; }
  function xPos(i) { return padL + i * xStep; }
  function fmtK(v) { return 'R$ ' + Math.round(v / 1000) + 'k'; }

  ctx.clearRect(0, 0, W, H);

  // Y grid
  for (var g = 0; g <= maxY; g += 20000) {
    var gy = yPos(g);
    ctx.strokeStyle = 'rgba(0,51,0,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, gy);
    ctx.lineTo(W - padR, gy);
    ctx.stroke();
    ctx.fillStyle = '#446644';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(fmtK(g), padL - 6, gy + 4);
  }

  var startTime = null;
  var duration = 1000;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);

    ctx.clearRect(0, 0, W, H);

    // Re-draw Y grid
    for (var g = 0; g <= maxY; g += 20000) {
      var gy = yPos(g);
      ctx.strokeStyle = 'rgba(0,51,0,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(W - padR, gy);
      ctx.stroke();
      ctx.fillStyle = '#446644';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(fmtK(g), padL - 6, gy + 4);
    }

    // X labels
    dados.forEach(function(d, i) {
      ctx.fillStyle = '#88bb88';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, xPos(i), H - 8);
    });

    var iMax = Math.floor(progress * (n - 1) * 100) / 100;

    // Área entre linhas
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(dados[0].max));
    for (var i = 1; i < n && i <= iMax; i++) {
      ctx.lineTo(xPos(i), yPos(dados[i].max));
    }
    if (iMax < n - 1) {
      var frac = iMax - Math.floor(iMax);
      var ci = Math.floor(iMax);
      ctx.lineTo(xPos(ci) + frac * xStep, yPos(dados[ci].max + frac * (dados[Math.min(ci+1,n-1)].max - dados[ci].max)));
    }
    // min backwards
    var endI = Math.min(Math.floor(iMax), n - 1);
    for (var i = endI; i >= 0; i--) {
      ctx.lineTo(xPos(i), yPos(dados[i].min));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,255,65,0.06)';
    ctx.fill();

    // Linha max
    ctx.beginPath();
    ctx.strokeStyle = '#00cc33';
    ctx.lineWidth = 2;
    ctx.moveTo(xPos(0), yPos(dados[0].max));
    for (var i = 1; i < n; i++) {
      var xi = Math.min(i, iMax);
      if (xi >= i) {
        ctx.lineTo(xPos(i), yPos(dados[i].max));
      } else {
        var frac = xi - (i - 1);
        ctx.lineTo(xPos(i - 1) + frac * xStep, yPos(dados[i-1].max + frac * (dados[i].max - dados[i-1].max)));
        break;
      }
    }
    ctx.stroke();

    // Linha min
    ctx.beginPath();
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.moveTo(xPos(0), yPos(dados[0].min));
    for (var i = 1; i < n; i++) {
      var xi = Math.min(i, iMax);
      if (xi >= i) {
        ctx.lineTo(xPos(i), yPos(dados[i].min));
      } else {
        var frac = xi - (i - 1);
        ctx.lineTo(xPos(i - 1) + frac * xStep, yPos(dados[i-1].min + frac * (dados[i].min - dados[i-1].min)));
        break;
      }
    }
    ctx.stroke();

    // Pontos e labels
    dados.forEach(function(d, i) {
      if (i > iMax) return;
      ctx.fillStyle = '#00ff41';
      ctx.beginPath();
      ctx.arc(xPos(i), yPos(d.min), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00cc33';
      ctx.beginPath();
      ctx.arc(xPos(i), yPos(d.max), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#88bb88';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(fmtK(d.min), xPos(i), yPos(d.min) - 10);
      ctx.fillText(fmtK(d.max), xPos(i), yPos(d.max) - 10);
    });

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ===================================================
   TASK 5 — Donut Chart de Composição de Custo
   =================================================== */
function drawDonutChart(canvas) {
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var fatias = [
    { label: 'Componentes importados', pct: 60, cor: '#cc4444' },
    { label: 'Estrutura nacional',     pct: 22, cor: '#00ff41' },
    { label: 'Software e integração',  pct: 10, cor: '#4488ff' },
    { label: 'Montagem e testes',       pct:  8, cor: '#ffaa00' }
  ];

  var cx = W / 2, cy = 120;
  var rOut = 90, rIn = 55;
  var total = 100;

  var startTime = null;
  var duration = 900;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);

    ctx.clearRect(0, 0, W, H);

    var startAngle = -Math.PI / 2;
    fatias.forEach(function(f) {
      var sweep = (f.pct / total) * Math.PI * 2 * progress;

      ctx.beginPath();
      ctx.moveTo(cx + rIn * Math.cos(startAngle), cy + rIn * Math.sin(startAngle));
      ctx.arc(cx, cy, rOut, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, rIn, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = f.cor;
      ctx.fill();

      // Label % no meio angular
      var midAngle = startAngle + sweep / 2;
      var rMid = (rOut + rIn) / 2;
      var lx = cx + rMid * Math.cos(midAngle);
      var ly = cy + rMid * Math.sin(midAngle);
      ctx.fillStyle = '#000a00';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (progress > 0.5) ctx.fillText(f.pct + '%', lx, ly);

      startAngle += sweep;
    });

    // Legenda em duas colunas
    var legY = cy + rOut + 20;
    var col = 0;
    fatias.forEach(function(f, i) {
      var lx = (i % 2 === 0) ? W * 0.1 : W * 0.55;
      var ly = legY + Math.floor(i / 2) * 20;
      ctx.fillStyle = f.cor;
      ctx.fillRect(lx, ly - 5, 10, 10);
      ctx.fillStyle = '#88bb88';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.label + ' ' + f.pct + '%', lx + 14, ly);
    });

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ===================================================
   TASK 7 — Barchart Comparativo de Autonomia
   =================================================== */
function drawAutonomiaChart(canvas) {
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var dados = [
    { label: 'Índia HAPS Maraal-3', val: 21,   cor: '#006622', destaque: false },
    { label: 'VigilIA (proposto)',   val: 10,   cor: '#00ff41', destaque: true  },
    { label: 'Dubai Drone Box',      val: 0.9,  cor: '#445544', destaque: false },
    { label: 'Chula Vista DFR',      val: 0.9,  cor: '#445544', destaque: false },
    { label: 'China Shenzhen',       val: 0.75, cor: '#445544', destaque: false }
  ];

  var padL = 150, padR = 60, padT = 15, padB = 15;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;
  var maxVal = 21;
  var barH = Math.floor((chartH / dados.length) * 0.55);
  var rowH = chartH / dados.length;

  var startTime = null;
  var duration = 1000;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);

    ctx.clearRect(0, 0, W, H);

    dados.forEach(function(d, i) {
      var y = padT + i * rowH + (rowH - barH) / 2;
      var bW = (d.val / maxVal) * chartW * 0.8 * progress;

      // Label esquerda
      ctx.fillStyle = d.destaque ? '#00ff41' : '#88bb88';
      ctx.font = (d.destaque ? 'bold ' : '') + '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(d.label, padL - 8, y + barH / 2 + 4);

      // Barra
      ctx.fillStyle = d.cor;
      ctx.fillRect(padL, y, bW, barH);
      if (d.destaque) {
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1;
        ctx.strokeRect(padL, y, bW, barH);
      }

      // Valor ao final da barra
      if (bW > 20) {
        ctx.fillStyle = '#00ff41';
        ctx.font = '11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(d.val + 'h', padL + bW + 6, y + barH / 2 + 4);
      }
    });

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ===================================================
   TASK 8 — Gantt Chart de Cronograma
   =================================================== */
function drawGanttChart(canvas) {
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var fases = [
    { label: 'F1 Conceituação',       inicio: 0,  dur: 3,  status: 'done'    },
    { label: 'F2 Design/Simulações',  inicio: 3,  dur: 6,  status: 'done'    },
    { label: 'F3 Fabricação P1',      inicio: 9,  dur: 6,  status: 'pending' },
    { label: 'F4 Testes de Voo',      inicio: 15, dur: 3,  status: 'pending' },
    { label: 'F5 Integração IA',      inicio: 18, dur: 3,  status: 'pending' },
    { label: 'F6 Certificação',       inicio: 21, dur: 6,  status: 'pending' },
    { label: 'F7 Comercialização',    inicio: 27, dur: 6,  status: 'future'  }
  ];

  var totalMonths = 33;
  var padL = 140, padR = 20, padT = 20, padB = 30;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;
  var rowH = chartH / fases.length;
  var barH = Math.floor(rowH * 0.55);
  var hojeM = 14; // Mar/2025 ≈ M14

  function xPos(m) { return padL + (m / totalMonths) * chartW; }

  // Quarter labels
  function drawGrid() {
    for (var q = 0; q <= totalMonths; q += 3) {
      var gx = xPos(q);
      ctx.strokeStyle = 'rgba(0,51,0,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, H - padB);
      ctx.stroke();
      var yr = 2024 + Math.floor(q / 12);
      var mo = (q % 12) + 1;
      if (mo === 1 || mo === 4 || mo === 7 || mo === 10) {
        ctx.fillStyle = '#334433';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(yr + '.' + String(mo).padStart(2,'0'), gx, H - padB + 14);
      }
    }
  }

  var startTime = null;
  var duration = 1200;
  var stagger = 100;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var elapsed = ts - startTime;

    ctx.clearRect(0, 0, W, H);
    drawGrid();

    // Linha HOJE
    var hx = xPos(hojeM);
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(hx, padT);
    ctx.lineTo(hx, H - padB);
    ctx.stroke();
    ctx.fillStyle = '#00ff41';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HOJE', hx, padT - 6);
    ctx.restore();

    fases.forEach(function(f, i) {
      var phaseStart = i * stagger;
      var phaseProgress = Math.max(0, Math.min((elapsed - phaseStart) / duration, 1));

      var y = padT + i * rowH + (rowH - barH) / 2;
      var x0 = xPos(f.inicio);
      var bW = (f.dur / totalMonths) * chartW * phaseProgress;

      // Label
      ctx.fillStyle = f.status === 'done' ? '#00ff41' : f.status === 'future' ? '#223322' : '#88bb88';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.setLineDash([]);
      ctx.fillText(f.label, padL - 6, y + barH / 2 + 4);

      // Barra
      ctx.save();
      if (f.status === 'done') {
        ctx.fillStyle = '#003300';
        ctx.fillRect(x0, y, bW, barH);
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.strokeRect(x0, y, bW, barH);
      } else if (f.status === 'pending') {
        ctx.fillStyle = 'rgba(0,20,0,0.3)';
        ctx.fillRect(x0, y, bW, barH);
        ctx.strokeStyle = '#003300';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x0, y, bW, barH);
      } else {
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = '#001a00';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        ctx.strokeRect(x0, y, bW, barH);
      }
      ctx.restore();

      // Período à direita
      if (phaseProgress > 0.8) {
        ctx.fillStyle = '#446644';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.setLineDash([]);
        ctx.fillText('M' + f.inicio + '–M' + (f.inicio + f.dur), x0 + bW + 4, y + barH / 2 + 4);
      }
    });

    var allDone = elapsed > (fases.length - 1) * stagger + duration;
    if (!allDone) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ===================================================
   TASK 9 — Inicialização com IntersectionObserver
   =================================================== */
function observeChart(canvasId, drawFn) {
  var el = document.getElementById(canvasId);
  if (!el) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        drawFn(el);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(el);
}

window.addEventListener('load', function () {
  observeChart('canvas-energia',   drawEnergiaChart);
  observeChart('canvas-escala',    drawEscalaChart);
  observeChart('canvas-donut',     drawDonutChart);
  observeChart('canvas-autonomia', drawAutonomiaChart);
  observeChart('canvas-gantt',     drawGanttChart);
});
