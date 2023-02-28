import 'package:guess_api/domain/chess_piece_moviment.dart';
import 'package:guess_api/domain/chess_piece_type.dart';

class ChessPiece{
  late ChessPieceType _chessPieceType;
  final int owner, id;
  int _x = 0, _y = 0;
  bool _destroyed = false, _moved = false;

  ChessPieceType get chessPieceType => _chessPieceType;

  int get x => _x;
  int get y => _y;
  List<int> get xy => [_x, _y];

  bool get moved => _moved;

  bool get destroyed => _destroyed;
  destroy(){
    _destroyed = true;
  }

  ChessPiece(ChessPieceType chessPieceType, this.owner, this.id){
    if(chessPieceType == ChessPieceType.none){
      throw "ChessPieceType cannot be 'none'";
    }
    _chessPieceType = chessPieceType;
  }

  changeType(ChessPieceType type){
    if(type == ChessPieceType.none){
      throw "ChessPieceType cannot be 'none'";
    }
    _chessPieceType = type;
  }

  updatePosition(int x, int y, {bool isSetup = false}){
    _x = x;
    _y = y;
    if(isSetup){
      return;
    }
    _moved = true;
  }

  ChessPieceMoviment getMoviment(int moviment){
    return ChessPieceMoviment.fromData(_chessPieceType, moviment);
  }
}