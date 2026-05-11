// Sprite-animerad fiendeklass
class SpriteEnemy extends Component {
  constructor(spriteSheet, frameWidth, frameHeight, frameCount, x, y, speedX) {
    super(frameWidth * 3, frameHeight * 3, "#000", x, y);
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.frameIndex = 0;
    this.elapsed = 0;
    this.fps = 12;
    this.speedX = speedX;
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

// Preload sprite sheets
const aliensSprite1 = new Image();
aliensSprite1.src = "Img/Aliens1.png";

const aliensSprite2 = new Image();
aliensSprite2.src = "Img/Aliens2.png";

const spaceshipSprite = new Image();
spaceshipSprite.src = "Img/Spaceship.png";

const spriteSheets = [
  { sheet: aliensSprite1, frameWidth: 25, frameHeight: 22, frameCount: 4 },
  { sheet: aliensSprite2, frameWidth: 25, frameHeight: 22, frameCount: 4 },
  { sheet: spaceshipSprite, frameWidth: 23, frameHeight: 22, frameCount: 4 },
];

// Spawn sprite-fiende
function spawnSpriteEnemy(canvas) {
  const spriteData = spriteSheets[Math.floor(Math.random() * spriteSheets.length)];
  const enemy = new SpriteEnemy(
    spriteData.sheet,
    spriteData.frameWidth,
    spriteData.frameHeight,
    spriteData.frameCount,
    canvas.width,
    Math.random() * (canvas.height - 100),
    -10
  );
  return enemy;
}
