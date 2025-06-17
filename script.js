document.addEventListener('DOMContentLoaded', () => {
  let startTime = 0,
      elapsedTime = 0,
      timerInterval,
      isRunning = false;

  const display = document.getElementById('display');
  const millisecondsDisplay = document.getElementById('milliseconds');
  const startBtn = document.getElementById('startBtn');

  function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const milli = ms % 1000;
    return {
      time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      ms: `.${String(milli).padStart(3, '0')}`
    };
  }

  function updateDisplay() {
    const formatted = formatTime(elapsedTime);
    display.textContent = formatted.time;
    millisecondsDisplay.textContent = formatted.ms;
  }

  function startStopwatch() {
    if (!isRunning) {
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
      }, 10);
      isRunning = true;
      startBtn.textContent = '⏸ Stop';
    } else {
      pauseStopwatch();
    }
  }

  function pauseStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = '▶ Start';
  }

  function resetStopwatch() {
    pauseStopwatch();
    elapsedTime = 0;
    updateDisplay();
  }

  updateDisplay();

  startBtn.addEventListener('click', startStopwatch);
  document.getElementById('pauseBtn').addEventListener('click', pauseStopwatch);
  document.getElementById('resetBtn').addEventListener('click', resetStopwatch);

  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const dots = [];

  for (let i = 0; i < 100; i++) {
    dots.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < dots.length; i++) {
      let dot = dots[i];
      dot.x += dot.vx;
      dot.y += dot.vy;

      if (dot.x < 0 || dot.x > width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > height) dot.vy *= -1;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#555';
      ctx.fill();

      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.stroke();
        }
      }

      if (mouse.x && mouse.y) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
});
