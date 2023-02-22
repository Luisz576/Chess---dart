import 'package:guess_api/domain/chess_piece_type.dart';

enum ChessPieceMoviment{
  none(0, 0),
  kingTop(0, 1),
  kingRight(1, 0),
  kingRightTop(1, 1),
  kingRightDown(1, -1),
  kingLeft(-1, 0),
  kingLeftTop(-1, 1),
  kingLeftDown(-1, -1),
  kingDown(0, -1),
  queenTop(0, 10),
  queenRight(10, 0),
  queenRightTop(10, 10),
  queenRightDown(10, -10),
  queenLeft(-10, 0),
  queenLeftTop(-10, 10),
  queenLeftDown(-10, -10),
  queenDown(0, -10),
  towerTop(0, 10),
  towerDown(0, -10),
  towerRight(10, 0),
  towerLeft(-10, 0),
  knightTopTopLeft(-1, 2),
  knightTopTopRight(1, 2),
  knightTopLeftLeft(-2, 1),
  knightTopRightRight(2, 1),
  knightDownDownLeft(-1, -2),
  knightDownDownRight(1, -2),
  knightDownLeftLeft(-2, 1),
  knightDownRightRight(-2, -1),
  pawnTop(0, 1),
  pawnDown(0, -1),
  pawnAttackRight(1, 1),
  pawnAttackLeft(-1, 1);
  //TODO:

  final int x, y;
  bool get isXIlimited => x == 10 || x == -10;
  bool get isYIlimited => y == 10 || y == -10;

  const ChessPieceMoviment(this.x, this.y);

  bool canJump(){
    switch(this){
      case knightTopTopLeft:
      case knightTopTopRight:
      case knightTopLeftLeft:
      case knightTopRightRight:
      case knightDownDownLeft:
      case knightDownDownRight:
      case knightDownLeftLeft:
      case knightDownRightRight:
        return true;
      default:
        return false;
    }
  }

  bool onlyToAttack(){
    return this == pawnAttackRight
        || this == pawnAttackLeft;
  }

  bool onlyToMove(){
    return this == pawnTop || this == pawnDown;
  }

  bool onlyIfPlayer1(){
    return this == pawnDown;
  }

  bool onlyIfPlayer2(){
    return this == pawnTop;
  }

  static ChessPieceMoviment fromData(ChessPieceType chessPieceType, int moviment){
    switch(chessPieceType){
      case ChessPieceType.king:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.kingRight;
          case 1:
            return ChessPieceMoviment.kingRightTop;
          case 2:
            return ChessPieceMoviment.kingRightDown;
          case 3:
            return ChessPieceMoviment.kingLeft;
          case 4:
            return ChessPieceMoviment.kingLeftTop;
          case 5:
            return ChessPieceMoviment.kingLeftDown;
          case 6:
            return ChessPieceMoviment.kingTop;
          case 7:
            return ChessPieceMoviment.kingDown;
        }
        break;
      case ChessPieceType.queen:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.queenRight;
          case 1:
            return ChessPieceMoviment.queenRightTop;
          case 2:
            return ChessPieceMoviment.queenRightDown;
          case 3:
            return ChessPieceMoviment.queenLeft;
          case 4:
            return ChessPieceMoviment.queenLeftTop;
          case 5:
            return ChessPieceMoviment.queenLeftDown;
          case 6:
            return ChessPieceMoviment.queenTop;
          case 7:
            return ChessPieceMoviment.queenDown;
        }
        break;
      case ChessPieceType.tower:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.towerTop;
          case 1:
            return ChessPieceMoviment.towerDown;
          case 2:
            return ChessPieceMoviment.towerRight;
          case 3:
            return ChessPieceMoviment.towerLeft;
        }
        break;
      case ChessPieceType.knight:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.knightTopTopLeft;
          case 1:
            return ChessPieceMoviment.knightTopTopRight;
          case 2:
            return ChessPieceMoviment.knightTopLeftLeft;
          case 3:
            return ChessPieceMoviment.knightTopRightRight;
          case 4:
            return ChessPieceMoviment.knightDownDownLeft;
          case 5:
            return ChessPieceMoviment.knightDownDownRight;
          case 6:
            return ChessPieceMoviment.knightDownLeftLeft;
          case 7:
            return ChessPieceMoviment.knightDownRightRight;
        }
        break;
      case ChessPieceType.bishop:
      //TODO:
        break;
      case ChessPieceType.pawn:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.pawnTop;
          case 1:
            return ChessPieceMoviment.pawnAttackRight;
          case 2:
            return ChessPieceMoviment.pawnAttackLeft;
        }
        break;
      case ChessPieceType.none:
        break;
    }
    return ChessPieceMoviment.none;
  }
}