let canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = "100%";
canvas.style.height = "100%";

// Ladda bakgrundsbild
const bgImage = new Image();
bgImage.src = "../Img/moln_3.avif";

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

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.color = color;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.gravity = 0.05;
  this.gravitySpeed = 0;

  this.update = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.newPos = function grav() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.gravitySpeed = 0;
    }
  };
}

let bird = new component(20, 20, "red", 10, 10);

// Tryck på mellanslag för att hoppa
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.gravitySpeed = -6;
  }
});

// ----------------------------------------------------------------------------------------------------------

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rita två kopior av bakgrunden
  ctx.drawImage(bgImage, x1, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, x2, 0, canvas.width, canvas.height);

  bird.newPos();
  bird.update();
}

// --------------------------------------------------------------------------------------------------------------

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Starta spelet när bakgrunden laddats
bgImage.onload = function() {
  gameLoop();
};