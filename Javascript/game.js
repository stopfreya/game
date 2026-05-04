// Hämta canvas-elementet och dess ritkontext.
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Anpassa canvas till hela fönstrets storlek.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = "100%";
canvas.style.height = "100%";

// Bakgrundsbild som rullar i två delar.
const bgImage = new Image();
bgImage.src = "../Img/blue.png";

let x1 = 0;
let x2 = canvas.width;
const speed = 2;

// Spelstatus och räknare.
let score = 0;
let gameOver = false;
let gameStarted = false;
let meteorTimer = 0;
const showHitboxes = true;

// Starta om spelet till standardläge.
function resetGame() {
  resetPlayer(canvas);
  resetMeteors();
  score = 0;
  gameOver = false;
  gameStarted = true;
}

// Tangentbordslyssnare för att hoppa eller starta om spelet.
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameStarted) {
      gameStarted = true;
    }
    if (!gameOver) {
      if (player) {
        player.gravitySpeed = -10;
        setPlayerFireMode(1000); // Byt till FireJet i 1 sekund.
      }
    } else {
      resetGame();
    }
  }
});

// Flyttar bakgrundsbilden för parallax-effekt.
function updateBackground() {
  x1 -= speed;
  x2 -= speed;

  if (x1 <= -canvas.width) {
    x1 = x2 + canvas.width;
  }
  if (x2 <= -canvas.width) {
    x2 = x1 + canvas.width;
  }
}

// Ritar den rullande bakgrunden.
function drawBackground() {
  ctx.drawImage(bgImage, x1, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, x2, 0, canvas.width, canvas.height);
}

// Visar hitboxes i spelvyn för debugging.
function drawHitboxes() {
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 2;
  const pHitbox = player.getHitbox();
  ctx.strokeRect(pHitbox.x, pHitbox.y, pHitbox.width, pHitbox.height);

  for (const m of meteors) {
    const hitbox = m.getHitbox();
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  }
}

// Ritar spelarens poäng i vänstra hörnet.
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Poäng: " + score, 10, 30);
}

// Huvudritfunktion som uppdaterar och ritar hela spelvärlden varje frame.
function draw() {
  // Rensa canvasen varje gång innan vi ritar om.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  // Visa starttext innan spelet startar.
  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tryck SPACE för att starta", canvas.width / 2, canvas.height / 2);
    return;
  }

  // Visa game over-text om spelet är slut.
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

  // Skapa nya meteoriter med jämna mellanrum.
  meteorTimer++;
  if (meteorTimer > 17) {
    spawnMeteor(canvas);
    meteorTimer = 0;
  }

  // Uppdatera och rita alla meteoriter.
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.x += m.speedX;
    m.update(ctx);

    if (checkCollision(player, m)) {
      gameOver = true;
    }

    if (m.x + m.width < 0) {
      meteors.splice(i, 1);
      score++;
    }
  }

  // Flytta spelaren och kontrollera om den träffar botten.
  const hitBottom = player.newPos(canvas);
  player.update(ctx);
  if (hitBottom) {
    gameOver = true;
  }

  // Rita hitboxes om debug-läget är aktiverat.
  if (showHitboxes) {
    drawHitboxes();
  }

  // Räkna poäng längst upp till vänster.
  drawScore();
}

// Huvudloopen som körs om och om igen.
function gameLoop() {
  updateBackground();
  draw();
  requestAnimationFrame(gameLoop);
}

// Starta spelet när bakgrundsbilden är laddad.
function startGame() {
  createPlayer(canvas);
  gameLoop();
}

bgImage.onload = function () {
  startGame();
};
