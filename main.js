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

function findCords(startx, starty, pos, size) {
  let row = getRow(pos);
  let posOnRow =
    17 - Math.abs(row - 9) - ((26 - Math.abs(row - 9)) * row) / 2 + pos;

  let x =
    -(((8 - Math.abs(row - 9)) * size * Math.sqrt(3)) / 2) +
    (posOnRow - 1) * size * Math.sqrt(3);
  let y = size * row - size;
  return [x + startx, starty - y];
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
      if (pieceList[pos].side == this.side) return true;
    }
    return false;
  }

  isEnemyPiece(pos) {
    if (pieceList.has(pos)) {
      if (pieceList[pos].side != this.side) return true;
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

const radius = 30;
const x = 500;
const y = 800;
drawField(x, y, 30);

pawn1 = new Pawn1("white");

pieceList.set(1, pawn1);
pieceList.set(42, pawn1);
pieceList.set(69, pawn1);
pieceList.set(128, pawn1);

function loadPieces() {
  for (let i in pieceList) {
    const [first, second] = findCords(x, y, i, radius);
    img.addEventListener("load", () => {
      ctx.drawImage(value.img, 0, 0);
    });
  }
}

pieceList.forEach((value, key) => {
  const [first, second] = findCords(x, y, key, radius);
  console.log(first, second);
  value.img.addEventListener("load", () => {
    ctx.drawImage(value.img, first, second, radius, radius);
  });
});
