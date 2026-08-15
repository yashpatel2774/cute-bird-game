// ========================================
// FLAPPY BIRD GAME
// ========================================

const bird = document.querySelector(".bird-png");
const game = document.querySelector(".game");

// ========================================
// GAME VARIABLES
// ========================================

let birdTop = 200;
let gravity = 2;

let isGameOver = false;

// ========================================
// GAME SETTINGS
// ========================================

const JUMP_POWER = 60;

const PIPE_GAP = 200;
const PIPE_SPEED = 2;
const PIPE_INTERVAL = 2000;

const MIN_PIPE_HEIGHT = 60;

// Collision margin
// Higher value = bird must go slightly more inside the pipe
const COLLISION_MARGIN = 3;


// ========================================
// INTERVAL STORAGE
// ========================================

let gravityInterval = null;
let pipeCreationInterval = null;

let pipeMovementIntervals = [];


// ========================================
// BIRD GRAVITY
// ========================================

gravityInterval = setInterval(() => {

    // Stop everything after game over
    if (isGameOver) {
        return;
    }

    // Bird falls
    birdTop += gravity;

    bird.style.top = birdTop + "px";


    // ====================================
    // BIRD BOUNDARY CHECK
    // ====================================

    const birdRect =
        bird.getBoundingClientRect();

    const gameRect =
        game.getBoundingClientRect();


    // Bird touches top
    const hitTop =
        birdRect.top <= gameRect.top;


    // Bird touches bottom
    const hitBottom =
        birdRect.bottom >= gameRect.bottom;


    // Game Over
    if (hitTop || hitBottom) {

        gameOver();

    }

}, 20);


// ========================================
// BIRD JUMP
// ========================================

function jump() {

    if (isGameOver) {
        return;
    }

    birdTop -= JUMP_POWER;


    // Don't allow bird to go too far above
    if (birdTop < 0) {

        birdTop = 0;

    }

    bird.style.top =
        birdTop + "px";
}


// ========================================
// KEYBOARD CONTROL
// ========================================

document.addEventListener("keydown", (event) => {

    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {

        event.preventDefault();

        jump();

    }

});


// ========================================
// MOBILE TOUCH CONTROL
// ========================================

game.addEventListener(
    "touchstart",
    (event) => {

        event.preventDefault();

        jump();

    },
    {
        passive: false
    }
);


// ========================================
// MOUSE CONTROL
// ========================================

game.addEventListener("click", (event) => {

    if (isGameOver) {
        return;
    }

    jump();

});


// ========================================
// CREATE PIPE
// ========================================

function createPipe() {

    if (isGameOver) {
        return;
    }


    // Create pipes
    const pipeTop =
        document.createElement("div");

    const pipeBottom =
        document.createElement("div");


    pipeTop.classList.add("pipe");

    pipeBottom.classList.add("pipe");


    // ====================================
    // GAME HEIGHT
    // ====================================

    const gameHeight =
        game.clientHeight;


    // ====================================
    // PIPE HEIGHT CALCULATION
    // ====================================

    const availableHeight =
        gameHeight - PIPE_GAP;


    const maxTopPipeHeight =
        availableHeight - MIN_PIPE_HEIGHT;


    const topPipeHeight =
        Math.floor(
            Math.random() *
            (
                maxTopPipeHeight -
                MIN_PIPE_HEIGHT
            )
        ) +
        MIN_PIPE_HEIGHT;


    const bottomPipeHeight =
        gameHeight -
        topPipeHeight -
        PIPE_GAP;


    // ====================================
    // SET PIPE HEIGHT
    // ====================================

    pipeTop.style.height =
        topPipeHeight + "px";

    pipeBottom.style.height =
        bottomPipeHeight + "px";


    // ====================================
    // SET PIPE POSITION
    // ====================================

    pipeTop.style.top = "0px";

    pipeBottom.style.bottom = "0px";


    // ====================================
    // ADD PIPES
    // ====================================

    game.appendChild(pipeTop);

    game.appendChild(pipeBottom);


    // ====================================
    // PIPE START POSITION
    // ====================================

    let pipeLeft =
        game.clientWidth;


    pipeTop.style.left =
        pipeLeft + "px";

    pipeBottom.style.left =
        pipeLeft + "px";


    // ====================================
    // MOVE PIPE
    // ====================================

    const pipeMovement =
        setInterval(() => {

            if (isGameOver) {

                clearInterval(pipeMovement);

                return;

            }


            // Move pipe left
            pipeLeft -= PIPE_SPEED;


            pipeTop.style.left =
                pipeLeft + "px";

            pipeBottom.style.left =
                pipeLeft + "px";


            // ====================================
            // COLLISION DETECTION
            // ====================================

            const birdRect =
                bird.getBoundingClientRect();


            const topPipeRect =
                pipeTop.getBoundingClientRect();


            const bottomPipeRect =
                pipeBottom.getBoundingClientRect();


            // ====================================
            // CREATE SMALLER BIRD HITBOX
            // ====================================
            //
            // This ignores a few pixels around
            // the outside of the bird image.
            //
            // This is useful because your PNG
            // may contain transparent space.
            // ====================================

            const birdLeft =
                birdRect.left +
                COLLISION_MARGIN;

            const birdRight =
                birdRect.right -
                COLLISION_MARGIN;

            const birdTopPosition =
                birdRect.top +
                COLLISION_MARGIN;

            const birdBottom =
                birdRect.bottom -
                COLLISION_MARGIN;


            // ====================================
            // TOP PIPE COLLISION
            // ====================================

            const hitTopPipe =

                birdRight >
                topPipeRect.left &&

                birdLeft <
                topPipeRect.right &&

                birdBottom >
                topPipeRect.top &&

                birdTopPosition <
                topPipeRect.bottom;


            // ====================================
            // BOTTOM PIPE COLLISION
            // ====================================

            const hitBottomPipe =

                birdRight >
                bottomPipeRect.left &&

                birdLeft <
                bottomPipeRect.right &&

                birdBottom >
                bottomPipeRect.top &&

                birdTopPosition <
                bottomPipeRect.bottom;


            // ====================================
            // GAME OVER
            // ====================================

            if (
                hitTopPipe ||
                hitBottomPipe
            ) {

                clearInterval(pipeMovement);

                gameOver();

                return;

            }


            // ====================================
            // REMOVE PIPE
            // ====================================

            if (pipeLeft < -100) {

                pipeTop.remove();

                pipeBottom.remove();

                clearInterval(pipeMovement);

            }

        }, 20);


    // Save interval
    pipeMovementIntervals.push(
        pipeMovement
    );
}


// ========================================
// CREATE PIPES
// ========================================

pipeCreationInterval =
    setInterval(
        createPipe,
        PIPE_INTERVAL
    );


// ========================================
// GAME OVER
// ========================================

function gameOver() {

    // Prevent multiple calls
    if (isGameOver) {
        return;
    }


    // Set game over
    isGameOver = true;


    // ====================================
    // STOP BIRD
    // ====================================

    if (gravityInterval) {

        clearInterval(
            gravityInterval
        );

    }


    // ====================================
    // STOP NEW PIPES
    // ====================================

    if (pipeCreationInterval) {

        clearInterval(
            pipeCreationInterval
        );

    }


    // ====================================
    // STOP EXISTING PIPES
    // ====================================

    pipeMovementIntervals.forEach(
        (interval) => {

            clearInterval(interval);

        }
    );


    pipeMovementIntervals = [];


    // ====================================
    // STOP CSS ANIMATIONS
    // ====================================

    game.classList.add("game-over");


    // ====================================
    // SHOW GAME OVER
    // ====================================

    setTimeout(() => {

        alert("Your game is over!");

        location.reload();

    }, 100);

}