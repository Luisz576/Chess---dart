import 'dart:io';

import 'package:guess_api/models/chess_packet.dart';

extension WebSocketSender on WebSocket{
  send(ChessPacket packet){
    add(packet.toJson());
  }
  sendAll(List<ChessPacket> packets){
    for(ChessPacket packet in packets){
      add(packet.toJson());
    }
  }
}