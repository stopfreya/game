// Spelarens komponent och dess bilder.
let player;
const playerImage = new Image();
playerImage.src = "../Img/Jet.png";
const playerFireImage = new Image();
playerFireImage.src = "../Img/FireJet.png";

// Skapar spelaren och sätter standardvärden.
function createPlayer(canvas) {
  player = new Component(120, 100, "#00ff00", 100, canvas.height / 2);
  player.image = playerImage;
  player.normalImage = playerImage;
  player.fireImage = playerFireImage;
  player.fireModeExpiry = 0;
  player.hitboxWidth = 60;
  player.hitboxHeight = 50;
  player.hitboxOffsetX = 30;
  player.hitboxOffsetY = 25;
  return player;
}

// Återställer spelaren till startläge vid ny omgång.
function resetPlayer(canvas) {
  if (!player) {
    return;
  }
  player.y = canvas.height / 2;
  player.gravitySpeed = 0;
  player.image = player.normalImage;
  player.fireModeExpiry = 0;
}

// Byter spelarbilen till FireJet-bilden under en kort stund efter hopp.
function setPlayerFireMode(duration = 1000) {
  if (!player) {
    return;
  }
  player.image = player.fireImage;
  player.fireModeExpiry = Date.now() + duration;
}
