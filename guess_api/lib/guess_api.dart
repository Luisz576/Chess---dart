import 'dart:io';

import 'package:guess_api/models/chess_game.dart';
import 'package:guess_api/models/chess_packet.dart';

class GuessApi{
  final String address;
  final int port;
  late final ChessGame chessGame;

  late final HttpServer _server;
  final List<WebSocket> _clients = [];

  GuessApi._(this.address, this.port){
    this.chessGame = ChessGame();
  }

  run() async{
    _server = await HttpServer.bind(address, port);
    _server.listen((req) async {
      if(req.uri.path == '/ws'){
        try{
          final socket = await WebSocketTransformer.upgrade(req);
          this._clients.add(socket);
          socket.listen(_handleSocket,
            onDone: () {
              print("done");
              this._clients.remove(socket);
            },
            onError: (error){
              print("Error: $error");
              this._clients.remove(socket);
            }
          );
        }catch(e){
          print(e);
        }
      }
    });
  }

  _handleSocket(data){
    print("data: $data");
    //TODO:
  }

  _broadcast(ChessPacket packet){
    _clients.forEach((client) {
      client.add(packet.toJson());
    });
  }
}

runServer(String address, int port){
  GuessApi._(address, port).run();
}