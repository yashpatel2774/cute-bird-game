// ===============================
// BIRD FLAPPY GAME
// ===============================

// Get game elements
const bird = document.querySelector(".bird-png");
const game = document.querySelector(".game");

// ===============================
// GAME VARIABLES
// ===============================

let birdTop = 200;
let gravity = 2;
let isGameOver = false;

// ===============================
// BIRD GRAVITY
// ===============================

setInterval(() => {
  if (isGameOver) return;

  birdTop = birdTop + gravity;

  bird.style.top = birdTop + "px";

  // Check if bird goes outside game area
  if (birdTop > game.clientHeight || birdTop < 0) {
    gameOver();
  }
}, 20);


// ===============================
// BIRD JUMP FUNCTION
// ===============================

function jump() {
  if (isGameOver) return;

  birdTop = birdTop - 60;
}


// ===============================
// KEYBOARD CONTROL
// ===============================

// Space + Arrow Up
document.addEventListener("keydown", (e) => {

  if (e.code === "Space" || e.code === "ArrowUp") {

    e.preventDefault();

    jump();
  }

});


// ===============================
// MOBILE TOUCH CONTROL
// ===============================

// Touch screen
game.addEventListener(
  "touchstart",
  (e) => {

    e.preventDefault();

    jump();

  },
  { passive: false }
);


// ===============================
// MOUSE CONTROL
// ===============================

// Desktop mouse click
game.addEventListener("click", (e) => {

  e.preventDefault();

  jump();

});


// ===============================
// CREATE PIPES
// ===============================

function createPipe() {

  if (isGameOver) return;

  // Create top pipe
  const pipeTop = document.createElement("div");

  // Create bottom pipe
  const pipeBottom = document.createElement("div");

  pipeTop.className = "pipe";
  pipeBottom.className = "pipe";

  // Gap between pipes
  let gap = 100;

  // Get current game height
  let gameHeight = game.clientHeight;

  // Maximum pipe height
  let maxHeight = gameHeight - gap - 70;

  // Random top pipe height
  let topPipeHeight = Math.random() * maxHeight + 50;

  // Bottom pipe height
  let bottomPipeHeight =
    maxHeight - topPipeHeight - gap;

  // Prevent negative height
  if (bottomPipeHeight < 50) {
    bottomPipeHeight = 50;
  }

  // Set pipe heights
  pipeTop.style.height = topPipeHeight + "px";
  pipeBottom.style.height = bottomPipeHeight + "px";

  // Position pipes
  pipeTop.style.top = "0px";
  pipeBottom.style.bottom = "0px";

  // Add pipes to game
  game.append(pipeTop, pipeBottom);

  // Start pipes from right side
  let pipeLeft = game.clientWidth;

  pipeTop.style.left = pipeLeft + "px";
  pipeBottom.style.left = pipeLeft + "px";


  // ===============================
  // MOVE PIPES
  // ===============================

  let move = setInterval(() => {

    if (isGameOver) {

      clearInterval(move);

      return;
    }

    // Move pipes left
    pipeLeft -= 2;

    pipeTop.style.left = pipeLeft + "px";
    pipeBottom.style.left = pipeLeft + "px";


    // ===============================
    // COLLISION DETECTION
    // ===============================

    let birdRect = bird.getBoundingClientRect();

    let topRect = pipeTop.getBoundingClientRect();

    let bottomRect = pipeBottom.getBoundingClientRect();


    if (
      birdRect.right > topRect.left &&
      birdRect.left < topRect.right &&
      (
        birdRect.top < topRect.bottom ||
        birdRect.bottom > bottomRect.top
      )
    ) {

      gameOver();

      clearInterval(move);

      return;
    }


    // ===============================
    // REMOVE OLD PIPES
    // ===============================

    if (pipeLeft < -40) {

      pipeTop.remove();

      pipeBottom.remove();

      clearInterval(move);
    }

  }, 20);
}


// ===============================
// CREATE NEW PIPE EVERY 2 SECONDS
// ===============================

setInterval(createPipe, 2000);


// ===============================
// GAME OVER
// ===============================

function gameOver() {

  if (isGameOver) return;

  isGameOver = true;

  alert("Your game is over!");

  location.reload();
}