import 'package:guess_api/domain/chess_piece_type.dart';

enum ChessPieceMoviment{
  none(0, 0),
  king_top(1, 0),
  king_right(0, 1),
  king_right_top(1, 1),
  king_right_down(-1, 1),
  king_left(0, -1),
  king_left_top(1, -1),
  king_left_down(-1, -1),
  king_down(-1, 0);
  //TODO:

  final x, y;

  const ChessPieceMoviment(this.x, this.y);

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
        break;
      case ChessPieceType.tower:
        break;
      case ChessPieceType.knight:
        break;
      //TODO:
    }
    return ChessPieceMoviment.none;
  }
}