const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const menu = document.getElementById('menu');
const playBtn = document.getElementById('playBtn');
const backBtn = document.getElementById('backBtn');

//Parámetros del pájaro
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
let playing = false;

const birdImg = new Image();
birdImg.src = 'bird.png';

//Dibujar pájaro
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

//Dibujar tubos
function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

//Actualizar pájaro
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
    endGame();
  }
}

//Actualizar tubos con puntaje
function updatePipes() {
  if (frame % 160 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let gap = 200;
    pipes.push({
      x: canvas.width,
      width: 55,
      top,
      bottom: top + gap,
      passed: false
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 1.1;

    if (
      bird.x + bird.size > pipe.x &&
      bird.x - bird.size < pipe.x + pipe.width &&
      (bird.y - bird.size < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      endGame();
    }

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
      scoreEl.textContent = `Puntaje: ${score}`;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

//Fin del juego
function endGame() {
  gameOver = true;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('GAME OVER', 120, 230);
  ctx.font = '18px Arial';
  ctx.fillText('Presiona ESPACIO para reiniciar', 60, 270);
}

//Reiniciar juego
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

//Loop principal
function loop() {
  if (!playing || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  updateBird();
  updatePipes();
  frame++;
  requestAnimationFrame(loop);
}

//Control de teclas
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    if (!playing) return;
    if (gameOver) restartGame();
    else bird.velocity = bird.lift;
  }
});

//Iniciar desde el menú
playBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  canvas.style.display = 'block';
  scoreEl.style.display = 'block';
  backBtn.style.display = 'block';
  playing = true;
  restartGame();
});

//Volver al menú
backBtn.addEventListener('click', () => {
  playing = false;
  canvas.style.display = 'none';
  scoreEl.style.display = 'none';
  backBtn.style.display = 'none';
  menu.style.display = 'block';
});
