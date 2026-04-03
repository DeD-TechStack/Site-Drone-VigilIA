// charts.js — Gráficos e dashboards do VigilIA

/* ===================================================
   TASK 3 — Gráfico de Energia por Modo de Voo
   =================================================== */
function drawEnergiaChart(canvas) {
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var modos = [
    { label: 'Decolagem VTOL',   consumo: 300, solar: 70, cor: '#cc4444' },
    { label: 'Subida altitude',  consumo: 165, solar: 70, cor: '#cc4444' },
    { label: 'Cruzeiro motor',   consumo: 100, solar: 70, cor: '#ffaa00' },
    { label: 'Planar otimizado', consumo:  40, solar: 70, cor: '#00ff41' },
    { label: 'Patrulha lenta',   consumo:  70, solar: 70, cor: '#ffaa00' },
    { label: 'Pouso VTOL',       consumo: 260, solar: 70, cor: '#cc4444' }
  ];

  var padL = 150, padR = 70, padT = 20, padB = 45;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;
  var maxVal = 320;
  var n = modos.length;
  var rowH = chartH / n;
  var barH = Math.floor(rowH * 0.28);
  var gap = 3;

  function xPos(val) { return padL + (val / maxVal) * chartW; }

  function drawGrid() {
    var steps = [0, 50, 100, 150, 200, 250, 300];
    steps.forEach(function(g) {
      var gx = xPos(g);
      ctx.strokeStyle = 'rgba(0,51,0,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, H - padB);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#335533';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(g + 'W', gx, H - padB + 16);
    });
  }

  var startTime = null;
  var duration = 900;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);

    ctx.clearRect(0, 0, W, H);
    drawGrid();

    ctx.strokeStyle = 'rgba(0,80,0,0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, H - padB);
    ctx.stroke();

    modos.forEach(function(m, i) {
      var baseY = padT + i * rowH + rowH * 0.12;

      ctx.fillStyle = '#88bb88';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(m.label, padL - 10, baseY + barH + 2);

      var cW = (m.consumo / maxVal) * chartW * ease;
      ctx.fillStyle = m.cor;
      ctx.fillRect(padL, baseY, cW, barH);

      if (ease > 0.5) {
        ctx.fillStyle = m.cor;
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(m.consumo + 'W', padL + cW + 4, baseY + barH - 2);
      }

      var sW = (m.solar / maxVal) * chartW * ease;
      ctx.fillStyle = '#006622';
      ctx.fillRect(padL, baseY + barH + gap, sW, barH);

      if (ease > 0.5) {
        ctx.fillStyle = '#00aa33';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('70W', padL + sW + 4, baseY + barH * 2 + gap - 2);
      }
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
    { label: 'Componentes importados', pct: 60, cor: '#cc4444', textCor: '#ff6666' },
    { label: 'Estrutura nacional',     pct: 22, cor: '#00ff41', textCor: '#00ff41' },
    { label: 'Software e integração',  pct: 10, cor: '#00884d', textCor: '#00bb66' },
    { label: 'Montagem e testes',       pct:  8, cor: '#005522', textCor: '#00882a' }
  ];

  var donutCx = W * 0.28;
  var donutCy = H * 0.46;
  var rOut = Math.min(W * 0.18, 85);
  var rIn  = rOut * 0.56;

  var startTime = null;
  var duration = 1000;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 2);

    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();
    ctx.arc(donutCx, donutCy, rOut, 0, Math.PI * 2);
    ctx.arc(donutCx, donutCy, rIn, Math.PI * 2, 0, true);
    ctx.fillStyle = 'rgba(0,30,0,0.4)';
    ctx.fill();

    var angle = -Math.PI / 2;
    fatias.forEach(function(f) {
      var sweep = (f.pct / 100) * Math.PI * 2 * ease;

      ctx.beginPath();
      ctx.moveTo(donutCx + rIn * Math.cos(angle), donutCy + rIn * Math.sin(angle));
      ctx.arc(donutCx, donutCy, rOut, angle, angle + sweep);
      ctx.arc(donutCx, donutCy, rIn, angle + sweep, angle, true);
      ctx.closePath();
      ctx.fillStyle = f.cor;
      ctx.fill();

      ctx.strokeStyle = '#000a00';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (f.pct >= 10 && ease > 0.6) {
        var midAngle = angle + sweep / 2;
        var rMid = (rOut + rIn) / 2;
        var lx = donutCx + rMid * Math.cos(midAngle);
        var ly = donutCy + rMid * Math.sin(midAngle);
        ctx.fillStyle = '#000a00';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.pct + '%', lx, ly);
      }

      angle += sweep;
    });

    if (ease > 0.7) {
      ctx.fillStyle = '#001400';
      ctx.beginPath();
      ctx.arc(donutCx, donutCy, rIn - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00ff41';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P1', donutCx, donutCy - 8);
      ctx.fillStyle = '#006622';
      ctx.font = '10px monospace';
      ctx.fillText('CUSTO', donutCx, donutCy + 8);
    }

    if (ease > 0.3) {
      var legX = donutCx + rOut + 28;
      var legStartY = donutCy - rOut * 0.65;
      var legLineH = 38;

      fatias.forEach(function(f, i) {
        var ly = legStartY + i * legLineH;
        ctx.fillStyle = f.cor;
        ctx.fillRect(legX, ly, 12, 12);
        ctx.fillStyle = '#88bb88';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(f.label, legX + 18, ly);
        ctx.fillStyle = f.textCor;
        ctx.font = 'bold 14px monospace';
        ctx.fillText(f.pct + '%', legX + 18, ly + 15);
      });
    }

    ctx.textBaseline = 'alphabetic';
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
    { label: 'Índia HAPS Maraal-3', val: 21,   cor: '#004d22', destaque: false },
    { label: 'VigilIA (proposto)',   val: 10,   cor: '#00ff41', destaque: true  },
    { label: 'Dubai Drone Box',      val: 0.92, cor: '#224422', destaque: false },
    { label: 'Chula Vista DFR',      val: 0.92, cor: '#224422', destaque: false },
    { label: 'China Shenzhen',       val: 0.75, cor: '#1a3322', destaque: false }
  ];

  var padL = 165, padR = 85, padT = 20, padB = 35;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;
  var n = dados.length;
  var rowH = chartH / n;
  var barH = Math.floor(rowH * 0.52);
  var minBarW = chartW * 0.03;

  var logMax = Math.log(21 + 1);
  function logScale(val) {
    return Math.log(val + 1) / logMax;
  }

  var startTime = null;
  var duration = 1000;

  function animate(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(0,80,0,0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, H - padB);
    ctx.stroke();

    var refs = [0.5, 1, 2, 5, 10, 21];
    refs.forEach(function(r) {
      var rx = padL + logScale(r) * chartW;
      ctx.strokeStyle = 'rgba(0,51,0,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(rx, padT);
      ctx.lineTo(rx, H - padB);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#334433';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      var refLabel = r < 1 ? (Math.round(r * 60) + 'min') : (r + 'h');
      ctx.fillText(refLabel, rx, H - padB + 14);
    });

    ctx.fillStyle = '#223322';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('escala logarítmica', W - 8, H - padB + 14);

    dados.forEach(function(d, i) {
      var y = padT + i * rowH + (rowH - barH) / 2;
      var bW = Math.max(minBarW, logScale(d.val) * chartW * ease);

      ctx.fillStyle = d.destaque ? '#00ff41' : '#557755';
      ctx.font = (d.destaque ? 'bold ' : '') + '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(d.label, padL - 10, y + barH * 0.68);

      if (d.destaque) {
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = d.cor;
      ctx.fillRect(padL, y, bW, barH);
      ctx.shadowBlur = 0;

      if (d.destaque) {
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.strokeRect(padL, y, bW, barH);
      }

      if (ease > 0.4) {
        ctx.fillStyle = d.destaque ? '#00ff41' : '#557755';
        ctx.font = (d.destaque ? 'bold ' : '') + '11px monospace';
        ctx.textAlign = 'left';
        var displayVal = d.val < 1
          ? Math.round(d.val * 60) + 'min'
          : d.val + 'h';
        ctx.fillText(displayVal, padL + bW + 8, y + barH * 0.72);
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
