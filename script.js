document.addEventListener('DOMContentLoaded', () => {
  let startTime = 0,
      elapsedTime = 0,
      timerInterval,
      isRunning = false;

  const display = document.getElementById('display');
  const millisecondsDisplay = document.getElementById('milliseconds');
  const lapsList = document.getElementById('laps');

  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const lapBtn = document.getElementById('lapBtn');
  const exportBtn = document.getElementById('exportBtn');

  let laps = [];

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const milli = ms % 1000;
    return {
      time: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`,
      ms: `.${String(milli).padStart(3,'0')}`
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
    laps = [];
    lapsList.innerHTML = '';
    updateDisplay();
  }

  function recordLap() {
    if (!isRunning) return;
    const lapTime = formatTime(elapsedTime);
    laps.push({ ...lapTime });
    const li = document.createElement('li');
    li.textContent = `Lap ${laps.length}: ${lapTime.time}${lapTime.ms}`;
    li.className = 'bg-neutral-800 px-3 py-1 rounded';
    lapsList.appendChild(li);
    lapsList.scrollTop = lapsList.scrollHeight; 
  }

  function exportLaps() {
    if (laps.length === 0) {
      alert('No laps to export!');
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Lap,Time,Milliseconds\n";
    laps.forEach((lap, i) => {
      csvContent += `${i + 1},${lap.time},${lap.ms.replace('.', '')}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'stopwatch_laps.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  startBtn.addEventListener('click', startStopwatch);
  pauseBtn.addEventListener('click', pauseStopwatch);
  resetBtn.addEventListener('click', resetStopwatch);
  lapBtn.addEventListener('click', recordLap);
  exportBtn.addEventListener('click', exportLaps);

  updateDisplay();

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
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
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
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
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
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
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
