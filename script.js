// bird ko niche girna chaiye
//key press bird ko jump karana
//pipes create karne hai

const bird = document.querySelector(".bird-png");
const game = document.querySelector(".game");

let birdTop = 200;
let gravity = 2;

setInterval(() => {
  if (isGameOver) return;
  birdTop = birdTop + gravity;
  bird.style.top = birdTop + "px";

  if (birdTop > game.clientHeight || birdTop < 0) {
    gameOver();
  }
}, 20);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    birdTop = birdTop - 60;
  }
});

function createPipe() {
  if (isGameOver) return;
  const pipeTop = document.createElement("div");
  const pipeBottom = document.createElement("div");

  pipeTop.className = "pipe";
  pipeBottom.className = "pipe";

  let gap = 100;

  let gameHeight = game.clientHeight;

  let maxHeight = gameHeight - gap - 70;

  let topPipeHeight = Math.random() * maxHeight + 50;
  let bottomPipeHeight = maxHeight - topPipeHeight - gap;

  pipeTop.style.height = topPipeHeight + "px";
  pipeBottom.style.height = bottomPipeHeight + "px";

  pipeTop.style.top = 0;
  pipeBottom.style.bottom = 0;

  game.append(pipeTop, pipeBottom);

  let pipeLeft = game.clientWidth;

  pipeTop.style.left = pipeLeft + "px";
  pipeBottom.style.left = pipeLeft + "px";

  let move = setInterval(() => {
    pipeLeft -= 2;

    pipeTop.style.left = pipeLeft + "px";
    pipeBottom.style.left = pipeLeft + "px"; // 400 - 2 = 398  -40

    let birdRect = bird.getBoundingClientRect();
    let topRect = pipeTop.getBoundingClientRect();
    let bottomRect = pipeBottom.getBoundingClientRect();

    if (
      birdRect.right > topRect.left &&
      birdRect.left < topRect.right &&
      (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)
    ) {
      gameOver();
      clearInterval(move);
    }

    if (pipeLeft < -40) {
      pipeTop.remove();
      pipeBottom.remove();
      clearInterval(move);
    }
  }, 20);
}

setInterval(createPipe, 2000);

let isGameOver = false;
function gameOver() {
  if (isGameOver) return;
  isGameOver = true;
  alert("your game is over");
  location.reload();
}
