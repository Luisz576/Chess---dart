import 'dart:convert';

import 'package:guess_api/domain/chess_packet_type.dart';
import 'package:guess_api/domain/chess_piece_type.dart';
import 'package:guess_api/models/chess_piece.dart';

class ChessPacket{
  late final ChessPacketType dataType;
  final Map<String, dynamic> _data = {};

  ChessPacket.connection(int player){
    this.dataType = ChessPacketType.connection;
    write("player", player);
    write("is_player", player == 1 || player == 2);
  }
  ChessPacket.chessPieceCreate(ChessPiece piece, int id){
    this.dataType = ChessPacketType.chessPieceCreate;
    write("piece_id", id);
    write("piece_type", piece.chessPieceType.value);
    write("piece_position", piece.xy);
  }
  ChessPacket.changeChessPieceType(int chessPieceId, ChessPieceType chessPieceType){
    this.dataType = ChessPacketType.changeChessPieceType;
    write("chess_piece_id", chessPieceId);
    write("chess_piece_type", chessPieceType.value);
  }
  ChessPacket.destroyChessPiece(int chessPieceId){
    this.dataType = ChessPacketType.destroyChessPiece;
    write("chess_piece_id", chessPieceId);
  }
  ChessPacket.updateChessPiecePosition(int chessPieceId, int x, int y){
    this.dataType = ChessPacketType.updateChessPiecePosition;
    write("chess_piece_id", chessPieceId);
    write("chess_piece_position", {
      "x": x,
      "y": y
    });
  }
  ChessPacket.playerTime(int player){
    this.dataType = ChessPacketType.playerTime;
    write("player_time", player);
  }
  ChessPacket.playerWin(int player){
    this.dataType = ChessPacketType.playerWin;
    write("player_win", player);
  }

  write(String key, value){
    _data[key] = value;
  }

  String toJson(){
    final Map<String, dynamic> data = Map.from(_data);
    data['data_type'] = dataType.value;
    return jsonEncode(data);
  }
}