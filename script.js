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

let pipes = [];
let frame = 0;
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
    let gap = 170;
    pipes.push({
      x: canvas.width,
      width: 55,
      top,
      bottom: top + gap
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
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function endGame() {
  gameOver = true;
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
    bird.velocity = bird.lift;
  }
});

loop();
