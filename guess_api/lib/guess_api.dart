import 'dart:io';

import 'package:guess_api/extension/websocketsender_extension.dart';
import 'package:guess_api/models/chess_game.dart';
import 'package:guess_api/models/chess_packet.dart';

class GuessApi{
  final String address;
  final int port;
  late final ChessGame chessGame;

  late final HttpServer _server;
  final List<WebSocket> _clients = [];
  WebSocket? p1, p2;

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
    print("data: $data");
    //TODO:
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