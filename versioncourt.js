// Get the canvas element and its 2D drawing context
const c = document.getElementById("myCanvas"), ctx = c.getContext("2d");

// Initialize game settings with descriptive variable names
const [bw, bh, br, pH, pW, bRow, bCol, bPad, bTop, bLeft] = [
    75,   // Brick width
    20,   // Brick height
    10,   // Ball radius
    10,   // Paddle height
    75,   // Paddle width
    3,    // Number of brick rows
    5,    // Number of brick columns
    10,   // Padding between bricks
    30,   // Offset from the top of the canvas for the bricks
    30    // Offset from the left of the canvas for the bricks
];

// Declare game variables
let x, y, dx, dy, pX, s, b = [], rp = false, lp = false;

// Initialize or reset the game state
const init = () => {
    [x, y, dx, dy, pX, s] = [
        c.width / 2,            // Initial ball position (x, centered)
        c.height - 30,          // Initial ball position (y, near bottom)
        2,                      // Ball horizontal velocity
        -2,                     // Ball vertical velocity
        (c.width - pW) / 2,     // Initial paddle position (centered horizontally)
        0                       // Initial score
    ];

    // Create a 2D array for the bricks with initial status
    b = Array.from({ length: bCol }, () =>
        Array(bRow).fill({ x: 0, y: 0, status: 1 })  // Each brick starts with status = 1 (intact)
    );
};

// Event listeners for keydown and keyup to track paddle movement
document.addEventListener("keydown", e => 
    e.key.includes("Right") ? rp = true : e.key.includes("Left") ? lp = true : null
);
document.addEventListener("keyup", e => 
    e.key.includes("Right") ? rp = false : e.key.includes("Left") ? lp = false : null
);

// Collision detection between the ball and bricks
const collision = () => {
    b.forEach((col, cIdx) => col.forEach((brick, rIdx) => {
        // Check if the brick is still intact
        if (brick.status && 
            x > brick.x && x < brick.x + bw &&  // Ball within brick's x boundaries
            y > brick.y && y < brick.y + bh) {  // Ball within brick's y boundaries
            dy = -dy;                           // Reverse the ball's vertical direction
            b[cIdx][rIdx].status = 0;           // Mark the brick as broken
            s++;                                // Increment score
            // Check if all bricks are destroyed
            if (s === bRow * bCol && confirm("Vous avez gagné ! Rejouer ?")) init();
        }
    }));
};

// Main function to draw the game elements and handle game logic
const draw = () => {
    ctx.clearRect(0, 0, c.width, c.height);  // Clear the canvas

    // Draw the bricks
    b.forEach((col, cIdx) => col.forEach((brick, rIdx) => {
        if (brick.status) {  // Only draw intact bricks
            let bx = cIdx * (bw + bPad) + bLeft;  // Calculate brick's x position
            let by = rIdx * (bh + bPad) + bTop;   // Calculate brick's y position
            b[cIdx][rIdx] = { x: bx, y: by, status: 1 };  // Update brick's position
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--brick-color') || "#0095dd"; // Set brick color
            ctx.fillRect(bx, by, bw, bh);  // Draw the brick
        }
    }));

    // Draw the ball
    ctx.beginPath();
    ctx.arc(x, y, br, 0, Math.PI * 2);  // Draw the ball as a circle
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ball-color') || "#0095dd"; // Set ball color
    ctx.fill();
    ctx.closePath();

    // Draw the paddle
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle-color') || "#0095dd"; // Set paddle color
    ctx.fillRect(pX, c.height - pH, pW, pH);  // Draw the paddle as a rectangle

    // Display the current score
    ctx.font = "16px Arial";  // Set font for the score display
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--score-color') || "#0095dd"; // Set score color
    ctx.fillText("Score: " + s, 8, 20);  // Draw the score text

    collision();  // Check for collisions between ball and bricks

    // Ball movement logic (bounce off walls and paddle)
    if (x + dx > c.width - br || x + dx < br) dx = -dx;  // Reverse horizontal direction on left/right wall collision
    if (y + dy < br) dy = -dy;  // Reverse vertical direction on top wall collision
    else if (y + dy > c.height - br) {  // Check if the ball hits the bottom of the canvas
        if (x > pX && x < pX + pW) dy = -dy;  // Ball hits the paddle, reverse direction
        else if (confirm("Game Over. Rejouer ?")) init();  // Game Over, ask to restart
        else return;  // Stop the game if the player doesn't want to continue
    }

    // Paddle movement logic
    if (rp && pX < c.width - pW) pX += 7;  // Move paddle right
    else if (lp && pX > 0) pX -= 7;        // Move paddle left

    // Update ball position
    [x, y] = [x + dx, y + dy];

    // Continue the game loop
    requestAnimationFrame(draw);
};

// Initialize the game and start the draw loop
init();
draw();
