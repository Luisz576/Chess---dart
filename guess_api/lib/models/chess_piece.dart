import 'package:guess_api/domain/chess_piece_moviment.dart';
import 'package:guess_api/domain/chess_piece_type.dart';

class ChessPiece{
  late ChessPieceType _chessPieceType;
  int _x = 0, _y = 0;
  bool _destroyed = false;

  ChessPieceType get chessPieceType => _chessPieceType;

  int get x => _x;
  int get y => _y;
  List<int> get xy => [_x, _y];

  bool get destroyed => _destroyed;
  destroy(){
    this._destroyed = true;
  }

  ChessPiece(ChessPieceType chessPieceType){
    if(chessPieceType == ChessPieceType.none){
      throw "ChessPieceType cannot be 'none'";
    }
    this._chessPieceType = chessPieceType;
  }

  changeType(ChessPieceType type){
    if(type == ChessPieceType.none){
      throw "ChessPieceType cannot be 'none'";
    }
    this._chessPieceType = type;
  }

  updatePosition(int x, int y){
    this._x = x;
    this._y = y;
  }

  ChessPieceMoviment getMoviment(int moviment){
    return ChessPieceMoviment.fromData(this._chessPieceType, moviment);
  }
}