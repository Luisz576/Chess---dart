import 'dart:convert';
import 'dart:io';

import 'package:guess_api/domain/chess_packet_type.dart';
import 'package:guess_api/extension/websocketsender_extension.dart';
import 'package:guess_api/models/chess_client_packet.dart';
import 'package:guess_api/models/chess_game.dart';
import 'package:guess_api/models/chess_packet.dart';

class GuessApi{
  final String address;
  final int port;
  late final ChessGame chessGame;

  late final HttpServer _server;
  final List<WebSocket> _clients = [];
  WebSocket? p1, p2;
  int currentPlayer = 1;

  GuessApi._(this.address, this.port){
    chessGame = ChessGame();
  }

  run() async{
    _server = await HttpServer.bind(address, port);
    _server.listen((req) async {
      if(req.uri.path == '/ws'){
        try{
          final socket = await WebSocketTransformer.upgrade(req);
          _addClient(socket);
          socket.listen((data) => _handleSocket(socket, data),
            onDone: () {
              print("done");
              _removeClient(socket);
            },
            onError: (error){
              print("Error: $error");
              _removeClient(socket);
            }
          );
          socket.sendAll(chessGame.getAllChessGamePackets());
        }catch(e){
          print(e);
        }
      }
    });
  }

  _addClient(WebSocket client){
    int player = 0;
    if(p1 == null || p2 == null){
      if(p1 == null){
        p1 = client;
        player = 1;
      }else{
        p2 = client;
        player = 2;
      }
      _broadcast(ChessPacket.playerJoinOrQuit(true));
    }
    _clients.add(client);
    client.send(ChessPacket.connection(player));
    if(p1 != null && p2 != null){
      client.send(ChessPacket.playerJoinOrQuit(true));
    }
  }

  _removeClient(client){
    _clients.remove(client);
    if(p1 == client || p2 == client){
      if(p1 == client){
        p1 = null;
      }else{
        p2 = null;
      }
      _broadcast(ChessPacket.playerJoinOrQuit(false));
    }
  }

  _handleSocket(socket, data){
    Map json = {};
    try{
      json = jsonDecode(data);
    }catch(e){
      print(e);
      return;
    }
    if(json["type"] == "clientPacket"){
      int p = socket == p1 ? 1 : socket == p2 ? 2 : -1;
      if(p != -1){
        if(currentPlayer != p){
          return;
        }
        late ChessClientPacket clientPacket;
        try{
          clientPacket = ChessClientPacket.fromPacket(json);
        }catch(e){
          print(e);
          return;
        }
        ChessPacket? packet = chessGame.moveChessPieceHandler(p, clientPacket.chessPieceId, clientPacket.movimentId, clientPacket.value);
        if(packet == null){
          return;
        }
        _broadcast(packet);
        if(packet.dataType == ChessPacketType.playerWin){
          //TODO: delay to reload
          return;
        }
        currentPlayer = currentPlayer == 1 ? 2 : 1;
        _broadcast(ChessPacket.playerTime(currentPlayer));
      }
    }
  }

  _broadcast(ChessPacket packet){
    for (WebSocket client in _clients) {
      client.add(packet.toJson());
    }
  }
}

runServer(String address, int port){
  GuessApi._(address, port).run();
}