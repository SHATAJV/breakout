const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


// setting de ball 
let ballRadius = 5;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// setting de rectangle 
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;


