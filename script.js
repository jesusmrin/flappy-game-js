const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

// 🐤 Parámetros del pájaro
let bird = {
  x: 100,
  y: 250,
  size: 14,
  gravity: 0.18,
  lift: -5,
  velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// 🖼️ Imagen del pájaro (opcional)
const birdImg = new Image();
birdImg.src = 'bird.png'; // agrega una imagen llamada bird.png en tu carpeta

// 🎨 Dibujar pájaro (usa imagen si carga, si no, círculo)
function drawBird() {
  if (birdImg.complete && birdImg.naturalHeight !== 0) {
    ctx.drawImage(birdImg, bird.x - bird.size, bird.y - bird.size, bird.size * 2, bird.size * 2);
  } else {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 🌿 Dibujar tubos
function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

// 🕹️ Actualizar pájaro
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
    endGame();
  }
}

// 🚧 Actualizar tubos con puntaje arreglado
function updatePipes() {
  // Cada 160 frames crea un tubo nuevo
  if (frame % 160 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let gap = 200; // 🔹 mayor espacio vertical
    pipes.push({
      x: canvas.width,
      width: 55,
      top,
      bottom: top + gap,
      passed: false
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 1.1; // 🔹 velocidad más lenta

    // Colisión
    if (
      bird.x + bird.size > pipe.x &&
      bird.x - bird.size < pipe.x + pipe.width &&
      (bird.y - bird.size < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      endGame();
    }

    // ✅ Puntaje (cuando el tubo pasa completamente)
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
      scoreEl.textContent = `Puntaje: ${score}`;
    }
  });

  // eliminar tubos fuera de la pantalla
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// ☠️ Fin del juego
function endGame() {
  gameOver = true;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('GAME OVER', 130, 250);
  ctx.font = '20px Arial';
  ctx.fillText('Presiona ESPACIO para reiniciar', 70, 290);
}

// 🔄 Reiniciar juego
function restartGame() {
  bird.y = 250;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  scoreEl.textContent = 'Puntaje: 0';
  loop();
}

// 🔁 Loop principal
function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  updateBird();
  updatePipes();
  frame++;
  requestAnimationFrame(loop);
}

// ⌨️ Controles
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    if (gameOver) restartGame();
    else bird.velocity = bird.lift;
  }
});

loop();
