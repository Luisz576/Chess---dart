import 'dart:convert';

import 'package:guess_api/domain/chess_data_type.dart';
import 'package:guess_api/domain/chess_piece_type.dart';

class ChessData{
  late final ChessDataType dataType;
  final Map<String, dynamic> _data = {};

  ChessData.changeChessPieceType(int chessPieceId, ChessPieceType chessPieceType){
    this.dataType = ChessDataType.changeChessPieceType;
    write("chess_piece_id", chessPieceId);
    write("chess_piece_type", chessPieceType.value);
  }
  ChessData.destroyChessPiece(int chessPieceId){
    this.dataType = ChessDataType.destroyChessPiece;
    write("chess_piece_id", chessPieceId);
  }
  ChessData.updateChessPiecePosition(int chessPieceId, int x, int y){
    this.dataType = ChessDataType.updateChessPiecePosition;
    write("chess_piece_id", chessPieceId);
    write("chess_piece_position", {
      "x": x,
      "y": y
    });
  }
  ChessData.playerTime(int player){
    this.dataType = ChessDataType.playerTime;
    write("player_time", player);
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