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
    _createChessPiece(ChessPieceType.king, 3, 0);
    //quee
    _createChessPiece(ChessPieceType.queen, 4, 0);
    // BLACK
    //TODO: create
  }

  ChessPacket _createChessPiece(ChessPieceType type, int x, int y){
    final chessPiece = ChessPiece(type);
    chessPiece.updatePosition(x, y);
    this._pieces.add(chessPiece);
    return ChessPacket.chessPieceCreate(chessPiece, this._pieces.length - 1);
  }

  //PUBLIC
  List<ChessPacket> getAllChessGamePackets(){
    List<ChessPacket> packets = [];
    for(int i = 0; i < this._pieces.length; i++){
      packets.add(ChessPacket.chessPieceCreate(this._pieces[i], i));
    }
    return packets;
  }

  reset(){
    //TODO: reset
  }

  ChessPacket? moveChessPiece(int chessPieceId, int moviment){
    if(chessPieceId > -1 && chessPieceId < this._pieces.length){
      final pieceMoviment = _pieces[chessPieceId].getMoviment(moviment);
      //TODO: calculate
      return ChessPacket.playerWin(1);
    }
    return null;
  }
}