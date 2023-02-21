import 'package:guess_api/domain/chess_piece_type.dart';
import 'package:guess_api/models/chess_packet.dart';
import 'package:guess_api/models/chess_piece.dart';

class ChessGame{
  final List<ChessPiece> _pieces = [];

  ChessGame(){
    _start();
  }

  _start(){
    // WHITE
    //king
    _createChessPiece(ChessPieceType.king, 3, 0, 1);
    _createChessPiece(ChessPieceType.king, 4, 7, 2);
    //quee
    _createChessPiece(ChessPieceType.queen, 4, 0, 1);
    _createChessPiece(ChessPieceType.queen, 3, 7, 1);
    //pawn
    for(int i = 0; i < 8; i++){
      _createChessPiece(ChessPieceType.pawn, i, 1, 1);
      _createChessPiece(ChessPieceType.pawn, i, 6, 2);
    }
    //TODO: create
  }

  ChessPacket _createChessPiece(ChessPieceType type, int x, int y, int owner){
    final chessPiece = ChessPiece(type, owner);
    chessPiece.updatePosition(x, y);
    _pieces.add(chessPiece);
    return ChessPacket.chessPieceCreate(chessPiece, _pieces.length - 1);
  }

  //PUBLIC
  List<ChessPacket> getAllChessGamePackets(){
    List<ChessPacket> packets = [];
    for(int i = 0; i < _pieces.length; i++){
      packets.add(ChessPacket.chessPieceCreate(_pieces[i], i));
    }
    return packets;
  }

  reset(){
    //TODO: reset
  }

  ChessPacket? moveChessPiece(int chessPieceId, int moviment){
    if(chessPieceId > -1 && chessPieceId < _pieces.length){
      final pieceMoviment = _pieces[chessPieceId].getMoviment(moviment);
      //TODO: calculate
      return ChessPacket.playerWin(1);
    }
    return null;
  }
}