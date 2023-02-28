import 'package:guess_api/domain/chess_piece_moviment.dart';
import 'package:guess_api/models/chess_packet.dart';
import 'package:guess_api/models/chess_piece.dart';

class ChessPieceCustomMoviment{
  final ChessPieceMoviment _data;
  ChessPieceCustomMoviment.upgrade(this._data){
    if(!_data.isCustom){
      throw "This moviment isn't a custom moviment!";
    }
  }

  List<ChessPacket>? execMoviment(int player, ChessPiece piece,
    ChessPiece? Function(int, int) pieceRequester, bool Function(int, int, int, int) hasPieceInWay){
    switch(this._data){
      case ChessPieceMoviment.rockRight:
        ChessPiece? tower = pieceRequester(piece.x + (player == 1 ? 4 : 3), piece.y);
        if(tower == null || tower.destroyed){
          return null;
        }

        if(tower.moved || hasPieceInWay(piece.x, piece.y, tower.x, tower.y)){
          return null;
        }

        piece.updatePosition(piece.x + 2, piece.y);
        tower.updatePosition(piece.x - 1, tower.y);

        return [ChessPacket.updateChessPiecePosition(piece.id, piece.x, piece.y),
          ChessPacket.updateChessPiecePosition(tower.id, tower.x, tower.y)];
      case ChessPieceMoviment.rockLeft:
        ChessPiece? tower = pieceRequester(piece.x - (player == 1 ? 3 : 4), piece.y);
        if(tower == null || tower.destroyed){
          return null;
        }

        if(tower.moved || hasPieceInWay(piece.x, piece.y, tower.x, tower.y)){
          return null;
        }

        piece.updatePosition(piece.x - 2, piece.y);
        tower.updatePosition(piece.x + 1, tower.y);

        return [ChessPacket.updateChessPiecePosition(piece.id, piece.x, piece.y),
          ChessPacket.updateChessPiecePosition(tower.id, tower.x, tower.y)];
      default:
        return null;
    }
  }
}