const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = "destination-over";
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

function getRow(pos) {
  row = 0;
  while (pos > 0) {
    pos -= 17 - Math.abs(row - 8);
    row++;
  }
  return row;
}

function isLeftEdge(square) {
  if (getRow(square) === getRow(square - 1)) return false;
  return true;
}

function isRightEdge(square) {
  if (getRow(square) === getRow(square + 1)) return false;
  return true;
}

const pieceList = new Map();

function isEmpty(pos) {
  if (pieceList.has(pos)) return false;
  else return true;
}

function rightUp(pos) {
  consideredMove = pos + 18 - Math.abs(getRow(pos) - 9);
  if (
    getRow(pos) + 1 == getRow(consideredMove) &&
    consideredMove > 0 &&
    consideredMove < 217
  )
    return consideredMove;
  return 0;
}
function rightDown(pos) {
  consideredMove = pos - (17 - Math.abs(getRow(pos) - 9));
  if (
    getRow(pos) - 1 == getRow(consideredMove) &&
    consideredMove > 0 &&
    consideredMove < 217
  )
    return consideredMove;
  return 0;
}
function leftUp(pos) {
  consideredMove = pos + 17 - Math.abs(getRow(pos) - 9);
  if (
    getRow(pos) + 1 == getRow(consideredMove) &&
    consideredMove > 0 &&
    consideredMove < 217
  )
    return consideredMove;
  return 0;
}
function leftDown(pos) {
  consideredMove = pos - (16 - Math.abs(getRow(pos) - 9));
  if (
    getRow(pos) - 1 == getRow(consideredMove) &&
    consideredMove > 0 &&
    consideredMove < 217
  )
    return consideredMove;
  return 0;
}

function right(pos) {
  if (isRightEdge(pos) == false && pos < 217) return pos + 1;
  return 0;
}

function left(pos) {
  if (isLeftEdge(pos) == false && pos > 1) return pos - 1;
  return 0;
}

function posOnRow(pos) {
  var row = getRow(pos);
  var xtraSqr = 0;
  for (let i = 1; i <= row; i++) {
    xtraSqr += 8 - Math.abs(9 - i);
  }
  return pos - (9 * row + xtraSqr) + (17 - Math.abs(9 - row));
}

function findCords(pos, startx, starty, size) {
  let x, y;
  let row = getRow(pos);
  x =
    Math.sqrt(3) *
      size *
      (posOnRow(pos) - (8 - Math.abs(9 - row)) / 2 - 1 / 3) +
    startx;
  y = starty - ((row - 1 / 2) * size * 3) / 2;

  return [x, y];
}

function findPosFromCords(x, y, startx, starty, size) {
  let row = ((starty - y) / size / 3) * 2 + 1 / 2;
  let posOnRow =
    (x - startx) / Math.sqrt(3) / size +
    (8 - Math.sqrt(9 - row)) / 2 +
    1 / 3 -
    1 / 2;
  let expPos = 0;
  for (let i = 1; i < row; i++) {
    expPos += 9 + 8 - Math.abs(9 - i);
  }
  return Math.round(expPos + posOnRow);
}

function loadPieces() {
  pieceList.forEach((value, key) => {
    const [first, second] = findCords(key, startx, starty, size);
    value.img.addEventListener("load", () => {
      ctx.drawImage(value.img, first, second, size, size);
    });
  });
}

function displayMoves(selectedPiece) {
  selectedPiece.validMoves.forEach((move) => {
    const [first, second] = findCords(move, startx, starty, size);
    ctx.beginPath();
    ctx.arc(
      first + (radius * Math.sqrt(3)) / 3,
      second + radius / 1.5,
      15,
      0,
      2 * Math.PI,
    );
    ctx.fillStyle = "black";
    ctx.fill();
    console.log(move);
  });
}

class Piece {
  constructor(side) {
    this.side = side;
  }

  getMoves(pos) {}
  name;
  side;
  img;
  validMoves = [];

  printMoves() {
    this.validMoves.forEach(function (entry) {
      console.log(entry);
    });
  }

  isFriendPiece(pos) {
    if (pieceList.has(pos)) {
      if (pieceList.get(pos).side == this.side) return true;
    }
    return false;
  }

  isEnemyPiece(pos) {
    if (pieceList.has(pos)) {
      if (pieceList.get(pos).side != this.side) return true;
    }
    return false;
  }
}

class Pawn1 extends Piece {
  constructor(side) {
    super(side);
    this.name = "Pawn the First";
    this.img = new Image();
    this.img.src = "./assets/Pavel.png";
  }

  getMoves(pos) {
    let temp = rightUp(pos);
    if (temp != 0 && isEmpty(temp)) {
      temp = rightUp(temp);
      if (!this.isFriendPiece(temp)) this.validMoves.push(temp);
    }

    temp = leftUp(pos);
    if (temp != 0 && isEmpty(temp)) {
      temp = leftUp(temp);
      if (!this.isFriendPiece(temp)) this.validMoves.push(temp);
    }
  }
}

class Pawn2 extends Piece {
  constructor(side) {
    super(side);
    this.name = "Pawn the Second";
    this.img = new Image();
    this.img.src = "./assets/Pavel2.png";
  }

  getMoves(pos) {
    let temp = rightUp(pos);
    if (this.isEnemyPiece(temp)) this.validMoves.push(temp);
    else if (isEmpty(temp)) {
      temp = rightUp(temp);
      if (isEmpty(temp)) this.validMoves.push(temp);
    }

    temp = leftUp(pos);
    if (this.isEnemyPiece(temp)) this.validMoves.push(temp);
    else if (isEmpty(temp)) {
      temp = leftUp(temp);
      if (isEmpty(temp)) this.validMoves.push(temp);
    }
  }
}

var selectedPiece = 0;
const startx = 500;
const starty = 800;
const size = 30;

/* document.addEventListener("mousedown", function (e) {
  const x = e.pageX;
  const y = e.pageY;
  var square = findPosFromCords(x, y, startx, starty, size);
  console.log("clicked at", square);
  if (selectedPiece == 0 && pieceList.has(square)) {
    selectedPiece = pieceList.get(square);
  }
}); */

function gameLoop() {
  ctx.clearRect(0, 0, 1600, 900);
  drawField(startx, starty, 30);
  loadPieces();
  if (selectedPiece) {
    selectedPiece.getMoves();
    displayMoves(selectedPiece);
  }
}

pawn1 = new Pawn1("white");
pawn2 = new Pawn2("black");

pieceList.set(42, pawn1);
pieceList.set(68, pawn2);
gameLoop();

for (let i = 1; i < 218; i++) {
  var [x, y] = findCords(i, startx, starty, size);
  console.log(findPosFromCords(x, y, startx, starty, size));
}
