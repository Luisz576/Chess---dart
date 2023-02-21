class ChessClientPacket{
  late final int chessPieceId, movimentId, value;

  ChessClientPacket.fromPacket(Map json){
    if(!(json.containsKey("chessPieceId") && json.containsKey("moviment") && json.containsKey("value"))){
      throw "Invalid packet!";
    }
    chessPieceId = json["chessPieceId"];
    movimentId = json["moviment"];
    value = json["value"];
  }
}