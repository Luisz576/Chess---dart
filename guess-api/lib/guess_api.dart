import 'dart:io';

class GuessApi{
  final String address;
  final int port;

  late final ServerSocket _server;
  final List<Socket> _clients = [];

  GuessApi._(this.address, this.port);

  run() async{
    _server = await ServerSocket.bind(address, port);
    _server.listen(_handle);
  }

  _handle(Socket client){
    client.listen((data) {
      final message = String.fromCharCodes(data);

      for(final c in _clients){
        c.write("Server: $message just joined");
      }
      //TODO

      _clients.add(client);
      client.write("Server: You are logged in as $message");
    }, onDone: (){
      print("Server: Client left");
      client.close();
    }, onError: (error){
      print(error);
      client.close();
    });
  }
}

runServer(String address, int port){
  final guessApi = GuessApi._(address, port);
  guessApi.run();
}