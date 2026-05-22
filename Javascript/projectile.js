// Projectile-klass för animerade projektiler, t.ex. Aliens som skjuts mot spelaren
class Projectile extends Component {
  constructor(spriteSheet, frameWidth, frameHeight, frameCount, x, y, speedX, speedY, scale = 3, rows = 1) {
    super(frameWidth * scale, frameHeight * scale, "#000", x, y);
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.scale = scale;
    this.rows = rows;
    this.frameIndex = 0;
    this.elapsed = 0;
    this.fps = 12;
    this.speedX = speedX;
    this.speedY = speedY;
    this.hitboxWidth = frameWidth * scale * 0.3; // Justera hitbox
    this.hitboxHeight = frameHeight * scale * 0.6;
    this.hitboxOffsetX = frameWidth * scale * 0.35;
    this.hitboxOffsetY = frameHeight * scale * 0.25;
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

    // Beräkna source position för sprite sheet med flera rader
    const framesPerRow = Math.ceil(this.frameCount / this.rows);
    const row = Math.floor(this.frameIndex / framesPerRow);
    const col = this.frameIndex % framesPerRow;
    const sourceX = col * this.frameWidth;
    const sourceY = row * this.frameHeight;

    // Rita sprite
    if (this.spriteSheet && this.spriteSheet.complete) {
      ctx.drawImage(
        this.spriteSheet,
        sourceX,
        sourceY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale
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

// Funktion för att skapa en projectile som faller nedåt och dras med bakgrundens vänsterrörelse
function spawnProjectile(canvas, player, bgSpeed) {
  const frameWidth = 32;
  const frameHeight = 22;
  const frameCount = 6;
  const scale = 4; // Öka storleken för bättre synlighet
  const rows = 1; // Ändra till 2 om sprite sheet har flera rader

  // Startposition från toppen, slumpad x
  const startX = Math.random() * canvas.width;
  const startY = -50;

  // Rör sig nedåt och dras åt vänster med bakgrunden
  const speedX = -Math.abs(bgSpeed);
  const speedY = 4; // Justera fallhastighet

  const projectile = new Projectile(
    aliensProjectileSprite,
    frameWidth,
    frameHeight,
    frameCount,
    startX,
    startY,
    speedX,
    speedY,
    scale,
    rows
  );

  projectiles.push(projectile);
}

// Återställ projektiler vid omstart
function resetProjectiles() {
  projectiles = [];
}