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

const jetpackSound = new Audio("Sound/Jetpack.mp3");
jetpackSound.volume = 0.5;
const deathSounds = [
  new Audio("Sound/Deathsound1.mp3"),
  new Audio("Sound/Deathsound2.mp3"),
];

function playJetpackSound() {
  jetpackSound.currentTime = 0;
  jetpackSound.play().catch(() => {});
}

function playDeathSound() {
  const sound = deathSounds[Math.floor(Math.random() * deathSounds.length)];
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

let x1 = 0;
let x2 = canvas.width;
const speed = 2;

// Spelstatus och räknare.
let score = 0;
let gameOver = false;
let gameStarted = false;
let meteorTimer = 0;
let projectileTimer = 0;
const showHitboxes = true;

// Starta om spelet till standardläge.
function resetGame() {
  resetPlayer(canvas);
  resetMeteors();
  resetProjectiles();
  score = 0;
  gameOver = false;
  gameStarted = true;
}

// Tangentbordslyssnare för att flyga eller starta om spelet.
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Förhindra standardbeteende (t.ex. scrollning)
    if (!gameStarted) {
      gameStarted = true;
    }
    if (!gameOver) {
      if (player) {
        player.gravitySpeed = -10.5;
        setPlayerFireMode(); // Byt till FireJet i 0.5 sekund.
        playJetpackSound();
      }
    }
  } else if (e.code === "Enter" && gameOver) {
    resetGame();
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

  for (const proj of projectiles) {
    const hitbox = proj.getHitbox();
    ctx.strokeStyle = "#ffff00"; // Gul för projektiler
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
    ctx.fillText("Tryck SPACE för att flyga", canvas.width / 2, canvas.height / 2);
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
    ctx.fillText("Tryck ENTER för att spela igen", canvas.width / 2, canvas.height / 2 + 60);
    return;
  }

  // Räkna score per frame istället för per undkomna fiender.
  score++;

  // Skapa nya meteoriter med jämna mellanrum.
  meteorTimer++;
  if (meteorTimer > 17) {
    spawnMeteor(canvas);
    meteorTimer = 0;
  }

  // Skapa nya projektiler med jämna mellanrum.
  projectileTimer++;
  if (projectileTimer > 100) { // Var 100:e frame, justera för svårighet
    spawnProjectile(canvas, player, speed);
    projectileTimer = 0;
  }

  // Uppdatera och rita alla meteoriter.
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.x += m.speedX;
    m.update(ctx);

    if (checkCollision(player, m)) {
      if (!gameOver) {
        gameOver = true;
        playDeathSound();
      }
    }

    if (m.x + m.width < 0) {
      meteors.splice(i, 1);
    }
  }

  // Uppdatera och rita alla projektiler.
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.update(ctx);

    if (checkCollision(player, p)) {
      if (!gameOver) {
        gameOver = true;
        playDeathSound();
      }
    }

    // Ta bort projektiler som gått utanför skärmen
    if (p.x + p.width < 0 || p.x > canvas.width || p.y + p.height < 0 || p.y > canvas.height) {
      projectiles.splice(i, 1);
    }
  }

  // Flytta spelaren.
  player.newPos(canvas);
  player.update(ctx);

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
