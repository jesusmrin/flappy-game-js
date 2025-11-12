const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

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

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
    endGame();
  }
}

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

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    if (gameOver) restartGame();
    else bird.velocity = bird.lift;
  }
});

loop();
