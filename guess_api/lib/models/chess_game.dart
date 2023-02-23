import 'dart:io';

import 'package:guess_api/domain/chess_piece_moviment.dart';
import 'package:guess_api/domain/chess_piece_type.dart';
import 'package:guess_api/models/chess_packet.dart';
import 'package:guess_api/models/chess_piece.dart';

class ChessGame{
  WebSocket? p1, p2;
  int currentPlayer = 1;

  final List<ChessPiece> _pieces = [];

  ChessGame(){
    _start();
  }

  List<ChessPacket> _start(){
    List<ChessPacket> packets = [];
    // WHITE
    //king
    packets.add(_createChessPiece(ChessPieceType.king, 3, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.king, 4, 7, 2));
    //quee
    packets.add(_createChessPiece(ChessPieceType.queen, 4, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.queen, 3, 7, 2));
    //bishop
    packets.add(_createChessPiece(ChessPieceType.bishop, 2, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.bishop, 5, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.bishop, 2, 7, 2));
    packets.add(_createChessPiece(ChessPieceType.bishop, 5, 7, 2));
    //knight
    packets.add(_createChessPiece(ChessPieceType.knight, 1, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.knight, 6, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.knight, 1, 7, 2));
    packets.add(_createChessPiece(ChessPieceType.knight, 6, 7, 2));
    //tower
    packets.add(_createChessPiece(ChessPieceType.tower, 0, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.tower, 7, 0, 1));
    packets.add(_createChessPiece(ChessPieceType.tower, 0, 7, 2));
    packets.add(_createChessPiece(ChessPieceType.tower, 7, 7, 2));
    //pawn
    for(int i = 0; i < 8; i++){
      packets.add(_createChessPiece(ChessPieceType.pawn, i, 1, 1));
      packets.add(_createChessPiece(ChessPieceType.pawn, i, 6, 2));
    }
    return packets;
  }

  ChessPacket _createChessPiece(ChessPieceType type, int x, int y, int owner){
    final chessPiece = ChessPiece(type, owner, _pieces.length);
    chessPiece.updatePosition(x, y);
    _pieces.add(chessPiece);
    return ChessPacket.chessPieceCreate(chessPiece);
  }

  //PUBLIC
  List<ChessPacket> getAllChessGamePackets(){
    List<ChessPacket> packets = [];
    for(int i = 0; i < _pieces.length; i++){
      packets.add(ChessPacket.chessPieceCreate(_pieces[i]));
    }
    return packets;
  }

  List<ChessPacket> reset(){
    List<ChessPacket> packets = [];
    for(int i = 0; i < _pieces.length; i++){
      if(_pieces[i].destroyed){
        continue;
      }
      packets.add(ChessPacket.destroyChessPiece(i));
    }
    packets.addAll(_start());
    return packets;
  }

  ChessPiece? _getPieceAt(int x, int y){
    for(ChessPiece piece in _pieces){
      if(piece.x == x && piece.y == y){
        return piece;
      }
    }
    return null;
  }

  List<ChessPacket>? moveChessPieceHandler(int player, int chessPieceId, int moviment, int value){
    if(chessPieceId > -1 && chessPieceId < _pieces.length && _pieces[chessPieceId].owner == player){
      ChessPiece piece = _pieces[chessPieceId];
      ChessPieceMoviment pieceMoviment = piece.getMoviment(moviment);

      if((pieceMoviment.onlyIfPlayer1() && player == 2) || (pieceMoviment.onlyIfPlayer2() && player == 1)){
        return null;
      }

      int movimentX = 0, movimentY = 0;
      if(pieceMoviment.isXIlimited){
        movimentX = value;
      }else{
        movimentX = pieceMoviment.x;
      }
      if(pieceMoviment.isYIlimited){
        movimentY = value;
      }else{
        movimentY = pieceMoviment.y;
      }
      int newLocX = piece.x + movimentX, newLocY = piece.y + movimentY;

      if(newLocX < 0 || newLocX > 7 || newLocY < 0 || newLocY > 7){
        return null;
      }

      if(!pieceMoviment.canJump()){
        if(_hasPieceInWay(piece.x, piece.y, newLocX, newLocY)){
          return null;
        }
      }

      ChessPiece? target = _getPieceAt(newLocX, newLocY);
      if(target == null){
        if(pieceMoviment.onlyToAttack()){
          return null;
        }
        return [ChessPacket.updateChessPiecePosition(chessPieceId, movimentX, movimentY)];
      }
      
      if(target.owner == player){
        return null;
      }

      if(pieceMoviment.onlyToMove()){
        return null;
      }

      return [ChessPacket.destroyChessPiece(target.id),
        ChessPacket.updateChessPiecePosition(chessPieceId, movimentX, movimentY)];
    }
    return null;
  }

  bool _hasPieceInWay(int startX, int startY, int endX, int endY){
    int toX = startX > endX ? startX : endX,
      toY = startY > endY ? startY : endY;
    for(int y = startY > endY ? endY : startY; y < toY; y++){
      for(int x = startX > endX ? endX : startX; x < toX; x++){
        if(_getPieceAt(x, y) != null){
          return true;
        }
      }
    }
    return false;
  }
}