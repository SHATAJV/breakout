// Get the canvas element by its ID and set up the 2D drawing context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Game settings - these define the basic properties of the game elements
let ballRadius = 10; // Radius of the ball
let paddleHeight = 10; // Height of the paddle
let paddleWidth = 75; // Width of the paddle
let brickRowCount = 3; // Number of brick rows
let brickColumnCount = 5; // Number of brick columns
let brickWidth = 75; // Width of each brick
let brickHeight = 20; // Height of each brick
let brickPadding = 10; // Padding between bricks
let brickOffsetTop = 30; // Offset from the top for the bricks
let brickOffsetLeft = 30; // Offset from the left for the bricks

// Game variables
let x, y, dx, dy, paddleX, score, bricks, rightPressed, leftPressed;

// Function to initialize or reset the game
function init() {
    // Initialize ball position at the center bottom of the canvas
    x = canvas.width / 2;
    y = canvas.height - 30;
    
    // Set the ball's initial velocity (speed and direction)
    dx = 2;
    dy = -2;
    
    // Set the paddle's initial position (centered horizontally)
    paddleX = (canvas.width - paddleWidth) / 2;
    
    // Initialize score to 0
    score = 0;
    
    // Initialize key press flags
    rightPressed = false;
    leftPressed = false;
    
    // Initialize bricks as an empty array
    bricks = [];

    // Populate the bricks array based on the number of rows and columns
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            // Each brick is an object with x, y coordinates and a status (1 means it's still there, 0 means it's broken)
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Event listeners for keyboard input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Handle key down events (when a key is pressed)
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// Handle key up events (when a key is released)
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Check for collisions between the ball and bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            // Check if the brick is still visible (status = 1)
            if (b.status === 1) {
                // Check if the ball has hit the brick
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    // Reverse the ball's direction on collision
                    dy = -dy;
                    // Mark the brick as broken (status = 0)
                    b.status = 0;
                    // Increase the score
                    score++;
                    // Check if all bricks are destroyed
                    if (score === brickRowCount * brickColumnCount) {
                        alert("You Win!");
                        if (confirm("Do you want to play again?")) {
                            init(); // Reset the game if the player chooses to continue
                        } else {
                            return; // End the game if the player chooses not to continue
                        }
                    }
                }
            }
        }
    }
}

// Function to draw the ball on the canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // Draw the ball as a circle
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ball-color') || "#0095dd"; // Set the ball color
    ctx.fill();
    ctx.closePath();
}

// Function to draw the paddle on the canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); // Draw the paddle as a rectangle
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle-color') || "#0095dd"; // Set the paddle color
    ctx.fill();
    ctx.closePath();
}

// Function to draw the bricks on the canvas
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft; // Calculate the brick's x position
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop; // Calculate the brick's y position
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight); // Draw the brick as a rectangle
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--brick-color') || "#0095dd"; // Set the brick color
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function to display the current score on the canvas
function drawScore() {
    ctx.font = "16px Arial"; // Set the font for the score
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--score-color') || "#0095dd"; // Set the color of the score text
    ctx.fillText("Score: " + score, 8, 20); // Display the score at the top-left corner
}

// Main function to draw the game elements on the canvas and handle game logic
function draw() {
    // Clear the canvas for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the game elements
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    
    // Check for collisions between the ball and the bricks
    collisionDetection();

    // Ball movement logic
    // Reverse the ball's direction if it hits the left or right wall
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // Reverse the ball's direction if it hits the top wall
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        // Check if the ball hits the paddle
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy; // Reverse the ball's direction on paddle collision
        } else {
            // If the ball misses the paddle (Game Over)
            if (confirm("Game Over. Do you want to play again?")) {
                init(); // Reset the game if the player chooses to continue
            } else {
                return; // Stop the game if the player doesn't want to continue
            }
        }
    }

    // Paddle movement logic
    // Move the paddle to the right if the right arrow key is pressed and the paddle is within bounds
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    // Move the paddle to the left if the left arrow key is pressed and the paddle is within bounds
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // Update the ball's position
    x += dx;
    y += dy;

    // Request the next frame to keep the game loop running
    requestAnimationFrame(draw);
}

// Initialize the game and start the drawing loop
init();
draw();
