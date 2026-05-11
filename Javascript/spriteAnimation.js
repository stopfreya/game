const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");

const sprites = [
  {
    name: "Aliens 1",
    src: "Img/Aliens1.png",
    frameWidth: 25,
    frameHeight: 22,
    frameCount: 8,
    scale: 4,
    x: 20,
    y: 20,
    fps: 12,
    frameIndex: 0,
    elapsed: 0,
  },
  {
    name: "Aliens 2",
    src: "Img/Aliens2.png",
    frameWidth: 25,
    frameHeight: 22,
    frameCount: 8,
    scale: 4,
    x: 20,
    y: 140,
    fps: 14,
    frameIndex: 0,
    elapsed: 0,
  },
  {
    name: "Spaceship",
    src: "Img/Spaceship.png",
    frameWidth: 23,
    frameHeight: 22,
    frameCount: 11,
    scale: 4,
    x: 20,
    y: 260,
    fps: 18,
    frameIndex: 0,
    elapsed: 0,
  },
];

function loadImage(sprite) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = sprite.src;
    image.onload = () => {
      sprite.image = image;
      resolve(sprite);
    };
    image.onerror = () => reject(new Error(`Kunde inte ladda bild: ${sprite.src}`));
  });
}

Promise.all(sprites.map(loadImage)).then(() => {
  requestAnimationFrame(loop);
}).catch((error) => {
  console.error(error);
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Fel vid inläsning av sprites.", canvas.width / 2, canvas.height / 2);
});

let lastTimestamp = 0;

function loop(timestamp) {
  const delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Sprite sheet-animation: Aliens + Spaceship", 20, 16);

  for (const sprite of sprites) {
    sprite.elapsed += delta;
    const frameTime = 1000 / sprite.fps;
    if (sprite.elapsed >= frameTime) {
      sprite.frameIndex = (sprite.frameIndex + 1) % sprite.frameCount;
      sprite.elapsed -= frameTime;
    }

    ctx.drawImage(
      sprite.image,
      sprite.frameIndex * sprite.frameWidth,
      0,
      sprite.frameWidth,
      sprite.frameHeight,
      sprite.x,
      sprite.y,
      sprite.frameWidth * sprite.scale,
      sprite.frameHeight * sprite.scale
    );

    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText(sprite.name, sprite.x, sprite.y - 8);
  }

  requestAnimationFrame(loop);
}
