import 'dart:io';

import 'package:guess_api/domain/chess_packet_type.dart';
import 'package:guess_api/models/chess_game.dart';
import 'package:guess_api/models/chess_packet.dart';

extension WebSocketSender on WebSocket{
  send(ChessPacket packet, ChessGame game){
    if(packet.dataType == ChessPacketType.changeChessPieceType){
      int owner = packet.read("chess_piece_owner");
      if(owner == 1){
        if(game.p1 != null){
          if(game.p1 == this){
            add(packet.toJson());
          }
        }
        return;
      }else if(owner == 2){
        if(game.p2 != null){
          if(game.p2 == this){
            add(packet.toJson());
          }
        }
        return;
      }
    }
    add(packet.toJson());
  }
  sendAll(List<ChessPacket> packets, ChessGame game){
    for(ChessPacket packet in packets){
      send(packet, game);
    }
  }
}