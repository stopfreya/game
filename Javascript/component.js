// En generisk spelkomponent som kan ritas på canvas.
// Används både för spelaren och meteoriter.
class Component {
  constructor(width, height, color, x, y) {
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

    // Hitbox för kollision, kan vara mindre än den visuella storleken.
    this.hitboxWidth = width;
    this.hitboxHeight = height;
    this.hitboxOffsetX = 0;
    this.hitboxOffsetY = 0;
  }

  update(ctx) {
    if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  updateFireMode() {
    if (this.fireModeExpiry && Date.now() >= this.fireModeExpiry) {
      this.image = this.normalImage || this.image;
      this.fireModeExpiry = 0;
    }
  }

  newPos(canvas) {
    this.updateFireMode();

    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;

    let hitBottom = false;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.gravitySpeed = 0;
      hitBottom = true;
    }
    if (this.y < 0) {
      this.y = 0;
      this.gravitySpeed = 0;
    }
    return hitBottom;
  }

  // Returnerar hitbox-position och storlek för kollisionstest.
  getHitbox() {
    return {
      x: this.x + (this.hitboxOffsetX || 0),
      y: this.y + (this.hitboxOffsetY || 0),
      width: this.hitboxWidth,
      height: this.hitboxHeight,
    };
  }
}

function checkCollision(rect1, rect2) {
  const a = rect1.getHitbox();
  const b = rect2.getHitbox();

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
