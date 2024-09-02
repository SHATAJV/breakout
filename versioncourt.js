const c = document.getElementById("myCanvas"), ctx = c.getContext("2d"),
    [bw, bh, br, pH, pW, bRow, bCol, bPad, bTop, bLeft] = [75, 20, 10, 10, 75, 3, 5, 10, 30, 30];
let x, y, dx, dy, pX, s, b = [], rp = false, lp = false;

const init = () => {
    [x, y, dx, dy, pX, s] = [c.width / 2, c.height - 30, 2, -2, (c.width - pW) / 2, 0];
    b = Array.from({ length: bCol }, () => Array(bRow).fill({ x: 0, y: 0, status: 1 }));
};

document.addEventListener("keydown", e => e.key.includes("Right") ? rp = true : e.key.includes("Left") ? lp = true : null);
document.addEventListener("keyup", e => e.key.includes("Right") ? rp = false : e.key.includes("Left") ? lp = false : null);

const collision = () => {
    b.forEach((col, cIdx) => col.forEach((brick, rIdx) => {
        if (brick.status && x > brick.x && x < brick.x + bw && y > brick.y && y < brick.y + bh) {
            dy = -dy; b[cIdx][rIdx].status = 0; s++;
            if (s === bRow * bCol && confirm("Vous avez gagné ! Rejouer ?")) init();
        }
    }));
};

const draw = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    b.forEach((col, cIdx) => col.forEach((brick, rIdx) => {
        if (brick.status) {
            let bx = cIdx * (bw + bPad) + bLeft, by = rIdx * (bh + bPad) + bTop;
            b[cIdx][rIdx] = { x: bx, y: by, status: 1 };
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--brick-color') || "#0095dd";
            ctx.fillRect(bx, by, bw, bh);
        }
    }));
    ctx.beginPath();
    ctx.arc(x, y, br, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ball-color') || "#0095dd";
    ctx.fill(); ctx.closePath();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle-color') || "#0095dd";
    ctx.fillRect(pX, c.height - pH, pW, pH);
    ctx.font = "16px Arial";
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--score-color') || "#0095dd";
    ctx.fillText("Score: " + s, 8, 20);
    collision();
    if (x + dx > c.width - br || x + dx < br) dx = -dx;
    if (y + dy < br) dy = -dy;
    else if (y + dy > c.height - br) {
        if (x > pX && x < pX + pW) dy = -dy;
        else if (confirm("Game Over. Rejouer ?")) init();
        else return;
    }
    if (rp && pX < c.width - pW) pX += 7;
    else if (lp && pX > 0) pX -= 7;
    [x, y] = [x + dx, y + dy];
    requestAnimationFrame(draw);
};

init(); draw();
