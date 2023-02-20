enum ChessPacketType{
  connection("connection"),
  chessPieceCreate("chessPieceCreate"),
  updateChessPiecePosition("updateChessPiecePosition"),
  changeChessPieceType("changeChessPieceType"),
  destroyChessPiece("destroyChessPiece"),
  playerTime("playerTime"),
  playerWin("playerWin");

  final String value;

  const ChessPacketType(this.value);
}