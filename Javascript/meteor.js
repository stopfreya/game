// Lista över meteoriter som flyger från höger till vänster.
let meteors = [];
const meteorImage = new Image();
meteorImage.src = "../Img/standin.png";
const meteorSpeed = 10;

// Skapar en ny meteor med slumpad storlek och vertikal position.
function spawnMeteor(canvas) {
  const size = 100 + Math.random() * 100;
  const meteor = new Component(size, size, "#ff6600", canvas.width, Math.random() * (canvas.height - size));
  meteor.image = meteorImage;

  // Mindre hitbox än bildstorleken för rättvisare kollision.
  meteor.hitboxWidth = size * 0.3;
  meteor.hitboxHeight = size * 0.3;
  meteor.hitboxOffsetX = size * 0.25;
  meteor.hitboxOffsetY = size * 0.3;
  meteor.speedX = -meteorSpeed;

  meteors.push(meteor);
}

// Tömmer meteorlistan vid omstart.
function resetMeteors() {
  meteors = [];
}
