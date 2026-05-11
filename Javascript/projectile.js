// Projectile-klass för animerade projektiler, t.ex. Aliens som skjuts mot spelaren
class Projectile extends Component {
  constructor(spriteSheet, frameWidth, frameHeight, frameCount, x, y, speedX, speedY) {
    super(frameWidth * 3, frameHeight * 3, "#000", x, y);
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.frameIndex = 0;
    this.elapsed = 0;
    this.fps = 12;
    this.speedX = speedX;
    this.speedY = speedY;
    this.hitboxWidth = frameWidth * 2;
    this.hitboxHeight = frameHeight * 2;
    this.hitboxOffsetX = frameWidth * 0.5;
    this.hitboxOffsetY = frameHeight * 0.5;
  }

  updateAnimation(delta) {
    this.elapsed += delta;
    const frameTime = 1000 / this.fps;
    if (this.elapsed >= frameTime) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.elapsed -= frameTime;
    }
  }

  update(ctx) {
    // Uppdatera animation
    this.updateAnimation(16); // Antag 60fps, delta ~16ms

    // Uppdatera position
    this.x += this.speedX;
    this.y += this.speedY;

    // Rita sprite
    if (this.spriteSheet && this.spriteSheet.complete) {
      ctx.drawImage(
        this.spriteSheet,
        this.frameIndex * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.frameWidth * 3,
        this.frameHeight * 3
      );
    } else {
      ctx.fillStyle = "#ff6600";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

// Lista över projektiler
let projectiles = [];

// Preload Aliens1 sprite för projektiler
const aliensProjectileSprite = new Image();
aliensProjectileSprite.src = "Img/Aliens1.png";

// Funktion för att skapa en projectile som skjuts mot spelaren
function spawnProjectile(canvas, player) {
  const frameWidth = 32;
  const frameHeight = 22;
  const frameCount = 8;

  // Startposition, t.ex. slumpad från toppen eller sidan
  const startX = Math.random() * canvas.width;
  const startY = -50; // Från toppen

  // Beräkna riktning mot spelaren
  const dx = player.x - startX;
  const dy = player.y - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = 5; // Justera hastighet
  const speedX = (dx / distance) * speed;
  const speedY = (dy / distance) * speed;

  const projectile = new Projectile(
    aliensProjectileSprite,
    frameWidth,
    frameHeight,
    frameCount,
    startX,
    startY,
    speedX,
    speedY
  );

  projectiles.push(projectile);
}

// Återställ projektiler vid omstart
function resetProjectiles() {
  projectiles = [];
}