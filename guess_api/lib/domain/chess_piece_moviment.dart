import 'package:guess_api/domain/chess_piece_type.dart';

enum ChessPieceMoviment{
  none(0, 0),
  king_top(0, 1),
  king_right(1, 0),
  king_right_top(1, 1),
  king_right_down(1, -1),
  king_left(-1, 0),
  king_left_top(-1, 1),
  king_left_down(-1, -1),
  king_down(0, -1),
  queen_top(0, 10),
  queen_right(10, 0),
  queen_right_top(10, 10),
  queen_right_down(10, -10),
  queen_left(-10, 0),
  queen_left_top(-10, 10),
  queen_left_down(-10, -10),
  queen_down(0, -10),
  tower_top(0, 10),
  tower_down(0, -10),
  tower_right(10, 0),
  tower_left(-10, 0),
  knight_top_top_left(-1, 2),
  knight_top_top_right(1, 2),
  knight_top_left_left(-2, 1),
  knight_top_right_right(2, 1),
  knight_down_down_left(-1, -2),
  knight_down_down_right(1, -2),
  knight_down_left_left(-2, 1),
  knight_down_right_right(-2, -1),
  pawn_top(0, 1),
  pawn_attack_right(1, 1),
  pawn_attack_left(-1, 1);
  //TODO:

  final x, y;
  bool get isXIlimited => x == 10 || x == -10;
  bool get isYIlimited => y == 10 || y == -10;

  const ChessPieceMoviment(this.x, this.y);

  static bool onlyToAttack(ChessPieceMoviment moviment){
    return moviment == ChessPieceMoviment.pawn_attack_right
        || moviment == ChessPieceMoviment.pawn_attack_left;
  }

  static ChessPieceMoviment fromData(ChessPieceType chessPieceType, int moviment){
    switch(chessPieceType){
      case ChessPieceType.king:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.king_right;
          case 1:
            return ChessPieceMoviment.king_right_top;
          case 2:
            return ChessPieceMoviment.king_right_down;
          case 3:
            return ChessPieceMoviment.king_left;
          case 4:
            return ChessPieceMoviment.king_left_top;
          case 5:
            return ChessPieceMoviment.king_left_down;
          case 6:
            return ChessPieceMoviment.king_top;
          case 7:
            return ChessPieceMoviment.king_down;
        }
        break;
      case ChessPieceType.queen:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.queen_right;
          case 1:
            return ChessPieceMoviment.queen_right_top;
          case 2:
            return ChessPieceMoviment.queen_right_down;
          case 3:
            return ChessPieceMoviment.queen_left;
          case 4:
            return ChessPieceMoviment.queen_left_top;
          case 5:
            return ChessPieceMoviment.queen_left_down;
          case 6:
            return ChessPieceMoviment.queen_top;
          case 7:
            return ChessPieceMoviment.queen_down;
        }
        break;
      case ChessPieceType.tower:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.tower_top;
          case 1:
            return ChessPieceMoviment.tower_down;
          case 2:
            return ChessPieceMoviment.tower_right;
          case 3:
            return ChessPieceMoviment.tower_left;
        }
        break;
      case ChessPieceType.knight:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.knight_top_top_left;
          case 1:
            return ChessPieceMoviment.knight_top_top_right;
          case 2:
            return ChessPieceMoviment.knight_top_left_left;
          case 3:
            return ChessPieceMoviment.knight_top_right_right;
          case 4:
            return ChessPieceMoviment.knight_down_down_left;
          case 5:
            return ChessPieceMoviment.knight_down_down_right;
          case 6:
            return ChessPieceMoviment.knight_down_left_left;
          case 7:
            return ChessPieceMoviment.knight_down_right_right;
        }
        break;
      case ChessPieceType.bishop:
      //TODO:
        break;
      case ChessPieceType.pawn:
        switch(moviment){
          case 0:
            return ChessPieceMoviment.pawn_top;
          case 1:
            return ChessPieceMoviment.pawn_attack_right;
          case 2:
            return ChessPieceMoviment.pawn_attack_left;
        }
        break;
    }
    return ChessPieceMoviment.none;
  }
}