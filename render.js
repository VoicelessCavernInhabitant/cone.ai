const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const a = (2 * Math.PI) / 6;

function drawHexagon(x, y, r) {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(
      x + r * Math.cos(a * i + a / 2),
      y + r * Math.sin(a * i + a / 2),
    );
  }
  ctx.closePath();
  ctx.stroke();
}

function drawField(x, y, r) {
  xcentre = x;
  ycentre = y;

  for (let i = 1; i < 18; i++) {
    for (let j = 1; j < 18 - Math.abs(i - 9); j++) {
      drawHexagon(xcentre + r * j * Math.sqrt(3), ycentre, r);
    }
    if (i < 9) xcentre -= 0.5 * r * Math.sqrt(3);
    else xcentre += 0.5 * r * Math.sqrt(3);
    ycentre -= r * 1.5;
  }
}

drawField(500, 800, 30);
