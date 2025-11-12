const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let bird = {
  x: 100,
  y: 250,
  size: 14,
  gravity: 0.2,
  lift: -5,
  velocity: 0
};

let gameOver = false;

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
  ctx.fill();
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
    gameOver = true;
  }
}

function loop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  updateBird();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    bird.velocity = bird.lift;
  }
});

loop();
