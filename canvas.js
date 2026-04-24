let canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = "100%";
canvas.style.height = "100%";

let c = canvas.getContent("2d");

c.fillStyle = "red";
c.fillRect(0, 0, canvas.width, canvas.height);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ladda bakgrundsbild
const bgImage = new Image();
bgImage.src = "flappy_bird_back.jpg";

let x1 = 0;
let x2 = canvas.width;
const speed = 2; // Justera farten på bakgrunden

function update() {
  x1 -= speed;
  x2 -= speed;

  // Om en bild flyttar helt utanför skärmen, flytta tillbaka den
  if (x1 <= -canvas.width) {
    x1 = x2 + canvas.width;
  }
  if (x2 <= -canvas.width) {
    x2 = x1 + canvas.width;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rita två kopior av bakgrunden
  ctx.drawImage(bgImage, x1, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, x2, 0, canvas.width, canvas.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

bgImage.onload = () => {
  gameLoop();
};

let canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = "100%";
canvas.style.height = "100%";