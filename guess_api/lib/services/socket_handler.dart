import 'dart:convert';
import 'dart:io';

import 'package:guess_api/domain/chess_packet_type.dart';
import 'package:guess_api/extension/websocketsender_extension.dart';
import 'package:guess_api/models/chess_client_packet.dart';
import 'package:guess_api/models/chess_game.dart';
import 'package:guess_api/models/chess_packet.dart';

class SocketHandler{
  final ChessGame _game;
  final List<WebSocket> _clients = [];

  SocketHandler(this._game);

  websocketConnection(req) async{
    try{
      final socket = await WebSocketTransformer.upgrade(req);
      _addClient(socket);
      socket.listen((data){
          Map json = {};
          try{
            json = jsonDecode(data);
          }catch(e){
            print(e);
            return;
          }
          _handler(socket, json);
        },
        onDone: () {
          print("done");
          _removeClient(socket);
        },
        onError: (error){
          print("Error: $error");
          _removeClient(socket);
        }
      );
      socket.sendAll(_game.getAllChessGamePackets());
    }catch(e){
      print(e);
    }
  }

  _handler(WebSocket socket, Map json){
    if(json["type"] == "clientPacket"){
      int p = socket == _game.p1 ? 1 : socket == _game.p2 ? 2 : -1;
      if(p != -1){
        if(_game.currentPlayer != p){
          return;
        }
        late ChessClientPacket clientPacket;
        try{
          clientPacket = ChessClientPacket.fromPacket(json);
        }catch(e){
          print(e);
          return;
        }
        List<ChessPacket>? packets = _game.moveChessPieceHandler(p, clientPacket.chessPieceId, clientPacket.movimentId, clientPacket.value);
        if(packets == null){
          return;
        }
        _broadcastAll(packets);
        if(packets[packets.length - 1].dataType == ChessPacketType.playerWin){
          //TODO: delay to reload
          return;
        }
        _game.currentPlayer = _game.currentPlayer == 1 ? 2 : 1;
        _broadcast(ChessPacket.playerTime(_game.currentPlayer));
      }
    }
  }
  
  _addClient(WebSocket client){
    int player = 0;
    if(_game.p1 == null || _game.p2 == null){
      if(_game.p1 == null){
        _game.p1 = client;
        player = 1;
      }else{
        _game.p2 = client;
        player = 2;
      }
      _broadcast(ChessPacket.playerJoinOrQuit(true));
    }
    _clients.add(client);
    client.send(ChessPacket.connection(player));
    if(_game.p1 != null && _game.p2 != null){
      client.send(ChessPacket.playerJoinOrQuit(true));
    }
  }

  _removeClient(client){
    _clients.remove(client);
    if(_game.p1 == client || _game.p2 == client){
      if(_game.p1 == client){
        _game.p1 = null;
      }else{
        _game.p2 = null;
      }
      _broadcast(ChessPacket.playerJoinOrQuit(false));
    }
  }

  _broadcastAll(List<ChessPacket> packets){
    for(ChessPacket packet in packets){
      _broadcast(packet);
    }
  }

  _broadcast(ChessPacket packet){
    for (WebSocket client in _clients) {
      client.add(packet.toJson());
    }
  }
}