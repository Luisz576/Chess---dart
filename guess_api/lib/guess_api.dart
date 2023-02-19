import 'dart:io';

import 'package:guess_api/models/chess_data.dart';

class GuessApi{
  final String address;
  final int port;

  late final HttpServer _server;
  final List<WebSocket> _clients = [];

  GuessApi._(this.address, this.port);

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
            },
            onError: (error){
              print(error);
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

  _broadcast(ChessData data){
    _clients.forEach((client) {
      client.add(data.toJson());
    });
  }
}

runServer(String address, int port){
  final guessApi = GuessApi._(address, port);
  guessApi.run();
}