// matrix.js — Canvas matrix rain background effect

function initMatrixRain() {
  var canvas = document.getElementById('matrix-canvas');
  if (!canvas) return; // element not present — skip safely

  var ctx  = canvas.getContext('2d');
  var cols, drops;
  var chars = 'VIGILIADRONESOLARUPT01アウエカキクケコサシスセソタチツテトナニヌネノ';

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 16);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,10,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font      = '14px monospace';

    drops.forEach(function (y, i) {
      var ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(draw, 50);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });
}

window.addEventListener('load', initMatrixRain);
