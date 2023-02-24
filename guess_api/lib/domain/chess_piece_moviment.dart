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
  knightDownLeftLeft("knight_6", -2, 1),
  knightDownRightRight("knight_7", 2, -1),
  pawnTop("pawn_0", 0, 1),
  pawnDown("pawn_1", 0, -1),
  pawnAttackRight("pawn_2", 1, 1),
  pawnAttackLeft("pawn_3", -1, 1),
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
    return this == pawnTop;
  }

  bool onlyIfPlayer2(){
    return this == pawnDown;
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