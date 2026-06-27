export class Piece {
  constructor() {}

  getMoves(pos) {}
  name;
  validMoves = [];
}

export class Pawn1 extends Piece {
  constructor(name) {
    this.name = name;
  }
}
