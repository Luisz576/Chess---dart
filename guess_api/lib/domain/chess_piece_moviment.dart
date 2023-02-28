import 'package:guess_api/domain/chess_piece_type.dart';

enum ChessPieceMoviment{
  none("none", 0, 0),
  kingTop("king_0", 0, 1),
  kingRight("king_1", 1, 0),
  kingRightTop("king_2", 1, 1),
  kingRightDown("king_3", 1, -1),
  kingLeft("king_4", -1, 0),
  kingLeftTop("king_5", -1, 1),
  kingLeftDown("king_6", -1, -1),
  kingDown("king_7", 0, -1),
  rockLeft("king_8", 0, 0),
  rockRight("king_9", 0, 0),
  queenTop("queen_0", 0, 10),
  queenRight("queen_1", 10, 0),
  queenRightTop("queen_2", 10, 10),
  queenRightDown("queen_3", 10, -10),
  queenLeft("queen_4", -10, 0),
  queenLeftTop("queen_5", -10, 10),
  queenLeftDown("queen_6", -10, -10),
  queenDown("queen_7", 0, -10),
  towerTop("tower_0", 0, 10),
  towerDown("tower_1", 0, -10),
  towerRight("tower_2", 10, 0),
  towerLeft("tower_3", -10, 0),
  knightTopTopLeft("knight_0", -1, 2),
  knightTopTopRight("knight_1", 1, 2),
  knightTopLeftLeft("knight_2", -2, 1),
  knightTopRightRight("knight_3", 2, 1),
  knightDownDownLeft("knight_4", -1, -2),
  knightDownDownRight("knight_5", 1, -2),
  knightDownLeftLeft("knight_6", -2, -1),
  knightDownRightRight("knight_7", 2, -1),
  pawnTop("pawn_0", 0, 1),
  pawnDown("pawn_1", 0, -1),
  pawnAttackRightTop("pawn_2", 1, 1),
  pawnAttackLeftTop("pawn_3", -1, 1),
  pawnAttackRightDown("pawn_4", 1, -1),
  pawnAttackLeftDown("pawn_5", -1, -1),
  pawnDoubleTop("pawn_6", 0, 2),
  pawnDoubleDown("pawn_7", 0, -2),
  bishopTopLeft("bishop_0", -10, 10),
  bishopTopRight("bishop_1", 10, 10),
  bishopDownLeft("bishop_2", -10, -10),
  bishopDownRight("bishop_3", 10, -10);

  final int x, y;
  final String id;
  
  bool get isXIlimited => x == 10 || x == -10;
  bool get isYIlimited => y == 10 || y == -10;
  int get ilimitedSignX => x == 10 ? 1 : -1;
  int get ilimitedSignY => y == 10 ? 1 : -1;

  const ChessPieceMoviment(this.id, this.x, this.y);

  bool get isCustom =>
    this == rockRight
    || this == rockLeft;

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
    return this == pawnAttackRightTop
        || this == pawnAttackLeftTop
        || this == pawnAttackRightDown
        || this == pawnAttackLeftDown;
  }

  bool onlyToMove(){
    return this == pawnTop
      || this == pawnDown
      || this == rockRight
      || this == rockLeft;
  }

  bool onlyIfPlayer1(){
    return this == pawnTop
      || this == pawnAttackLeftTop
      || this == pawnAttackRightTop
      || this == pawnDoubleTop;
  }

  bool onlyIfPlayer2(){
    return this == pawnDown
      || this == pawnAttackLeftDown
      || this == pawnAttackRightDown
      || this == pawnDoubleDown;
  }

  bool onlyIfNotMoved(){
    return this == pawnDoubleTop
      || this == pawnDoubleDown
      || this == rockRight
      || this == rockLeft;
  }

  static ChessPieceMoviment fromData(ChessPieceType chessPieceType, int moviment){
    final s = "${chessPieceType.value}_$moviment";
    for(ChessPieceMoviment value in values){
      if(value.id == s){
        return value;
      }
    }
    return ChessPieceMoviment.none;
  }
}