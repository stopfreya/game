let canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = "100%";
canvas.style.height = "100%";

// Ladda bakgrundsbild (rymdbakgrund)
const bgImage = new Image();
bgImage.src = "../Img/blue.png";

// Ladda spelarbild
const playerImage = new Image();
playerImage.src = "../Img/Jet.png";

// Ladda meteor-bild
const meteorImage = new Image();
meteorImage.src = "../Img/standin.png";

let x1 = 0;
let x2 = canvas.width;
const speed = 2;

// Spelstatus
let score = 0;
let gameOver = false;
let gameStarted = false;

function update() {
  x1 -= speed;
  x2 -= speed;

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
  this.gravity = 0.5;
  this.gravitySpeed = 0;
  this.image = null;
  
  // Separat hitbox (kan justeras oberoende av bildstorlek)
  this.hitboxWidth = width;
  this.hitboxHeight = height;
  this.hitboxOffsetX = 0;  // Förskjut hitbox horisontellt
  this.hitboxOffsetY = 0;  // Förskjut hitbox vertikalt

  this.update = function () {
    if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.gravitySpeed = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.gravitySpeed = 0;
    }
  };
}
// Spelarens rymdfarkost
let player = new component(120, 100, "#00ff00", 100, canvas.height / 2);
player.image = playerImage;
player.hitboxWidth = 60;
player.hitboxHeight = 50;
player.hitboxOffsetX = 30;  // Flytta hitbox 30px åt höger
player.hitboxOffsetY = 25;  // Flytta hitbox 25px ner

// Meteoriter
let meteors = [];
const meteorSpeed = 4;

function spawnMeteor() {
  const size = 100 + Math.random() * 100; // Minst 100, max 200
  const meteor = new component(size, size, "#ff6600", canvas.width, Math.random() * (canvas.height - size));
  meteor.image = meteorImage;
  
  // Hitbox skalas med meteorstorleken (80% av bildstorlek)
  meteor.hitboxWidth = size * 0.8;
  meteor.hitboxHeight = size * 0.8;
  meteor.hitboxOffsetX = size * 0.1; // Centrera (10% offset)
  meteor.hitboxOffsetY = size * 0.1;
  
  meteor.speedX = -meteorSpeed;
  meteors.push(meteor);
}

// Timer för att skapa meteoriter
let meteorTimer = 0;

// Tryck på mellanslag för att hoppa
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameStarted) {
      gameStarted = true;
    }
    if (!gameOver) {
      player.gravitySpeed = -10; // Justera hoppstyrkan
    } else {
      // Starta om spelet
      resetGame();
    }
  }
});

function resetGame() {
  player.y = canvas.height / 2;
  player.gravitySpeed = 0;
  meteors = [];
  score = 0;
  gameOver = false;
  gameStarted = true;
}

// === DEBUG: Visa hitboxes (sätt till false för att dölja) ===
const showHitboxes = true;
// ============================================================

function checkCollision(rect1, rect2) {
  // Använd hitbox med offset
  const x1 = rect1.x + (rect1.hitboxOffsetX || 0);
  const y1 = rect1.y + (rect1.hitboxOffsetY || 0);
  const x2 = rect2.x + (rect2.hitboxOffsetX || 0);
  const y2 = rect2.y + (rect2.hitboxOffsetY || 0);
  
  const w1 = rect1.hitboxWidth;
  const h1 = rect1.hitboxHeight;
  const w2 = rect2.hitboxWidth;
  const h2 = rect2.hitboxHeight;
  
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rita bakgrund
  ctx.drawImage(bgImage, x1, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, x2, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tryck SPACE för att starta", canvas.width / 2, canvas.height / 2);
    return;
  }

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Poäng: " + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("Tryck SPACE för att spela igen", canvas.width / 2, canvas.height / 2 + 60);
    return;
  }

  // Uppdatera och rita meteoriter
  meteorTimer++;
  if (meteorTimer > 20) { // Ny meteor var 100:e bildruta (ökad intervall)
    spawnMeteor();
    meteorTimer = 0;
  }

  for (let i = meteors.length - 1; i >= 0; i--) {
    let m = meteors[i];
    m.x += m.speedX;
    m.update();

    // Kolla kollision
    if (checkCollision(player, m)) {
      gameOver = true;
    }

    // Ta bort meteoriter som är utanför skärmen
    if (m.x + m.width < 0) {
      meteors.splice(i, 1);
      score++;
    }
  }

  // Uppdatera och rita spelaren
  player.newPos();
  player.update();

  // DEBUG: Rita hitboxar
  if (showHitboxes) {
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      player.x + (player.hitboxOffsetX || 0), 
      player.y + (player.hitboxOffsetY || 0), 
      player.hitboxWidth, 
      player.hitboxHeight
    );
    
    for (let m of meteors) {
      ctx.strokeStyle = "#ff0000";
      ctx.strokeRect(
        m.x + (m.hitboxOffsetX || 0), 
        m.y + (m.hitboxOffsetY || 0), 
        m.hitboxWidth, 
        m.hitboxHeight
      );
    }
  }

  // Rita poäng
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Poäng: " + score, 10, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

bgImage.onload = function() {
  gameLoop();
};