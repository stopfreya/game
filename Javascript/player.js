let player;
const playerImage = new Image();
playerImage.src = "../Img/Jet.png";

function createPlayer(canvas) {
  player = new Component(120, 100, "#00ff00", 100, canvas.height / 2);
  player.image = playerImage;
  player.hitboxWidth = 60;
  player.hitboxHeight = 50;
  player.hitboxOffsetX = 30;
  player.hitboxOffsetY = 25;
  return player;
}

function resetPlayer(canvas) {
  if (!player) {
    return;
  }
  player.y = canvas.height / 2;
  player.gravitySpeed = 0;
}
