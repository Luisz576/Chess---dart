import 'dart:io';

import 'package:guess_api/models/chess_game.dart';
import 'package:guess_api/services/socket_handler.dart';

class GuessApi{
  final String address;
  final int port;
  late final ChessGame _chessGame;

  late final HttpServer _server;
  late final SocketHandler _socketHandler;

  GuessApi._(this.address, this.port){
    _chessGame = ChessGame();
    _socketHandler = new SocketHandler(_chessGame);
  }

  run() async{
    _server = await HttpServer.bind(address, port);
    _server.listen((req) {
      if(req.uri.path == '/ws'){
        _socketHandler.websocketConnection(req);
      }
    });
  }
}

runServer(String address, int port){
  GuessApi._(address, port).run();
}