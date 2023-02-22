import 'dart:convert';

import 'package:guess_api/domain/chess_packet_type.dart';
import 'package:guess_api/domain/chess_piece_type.dart';
import 'package:guess_api/models/chess_piece.dart';

class ChessPacket{
  late final ChessPacketType dataType;
  final Map<String, dynamic> _data = {};

  ChessPacket.connection(int player){
    dataType = ChessPacketType.connection;
    write("player", player);
    write("is_player", player == 1 || player == 2);
  }
  ChessPacket.playerJoinOrQuit(hasJoined){
    dataType = ChessPacketType.playerJoinOrQuit;
    write("has_joined", hasJoined);
  }
  ChessPacket.chessPieceCreate(ChessPiece piece){
    dataType = ChessPacketType.chessPieceCreate;
    write("piece_id", piece.id);
    write("piece_type", piece.chessPieceType.value);
    write("piece_position", piece.xy);
    write("piece_owner", piece.owner);
  }
  ChessPacket.changeChessPieceType(int chessPieceId, ChessPieceType chessPieceType){
    dataType = ChessPacketType.changeChessPieceType;
    write("chess_piece_id", chessPieceId);
    write("chess_piece_type", chessPieceType.value);
  }
  ChessPacket.destroyChessPiece(int chessPieceId){
    dataType = ChessPacketType.destroyChessPiece;
    write("chess_piece_id", chessPieceId);
  }
  ChessPacket.updateChessPiecePosition(int chessPieceId, int x, int y){
    dataType = ChessPacketType.updateChessPiecePosition;
    write("chess_piece_id", chessPieceId);
    write("chess_piece_position", {
      "x": x,
      "y": y
    });
  }
  ChessPacket.playerTime(int player){
    dataType = ChessPacketType.playerTime;
    write("player_time", player);
  }
  ChessPacket.playerWin(int player){
    dataType = ChessPacketType.playerWin;
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