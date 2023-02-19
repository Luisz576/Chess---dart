enum ChessDataType{
  updateChessPiecePosition("updateChessPiecePosition"),
  changeChessPieceType("changeChessPieceType"),
  destroyChessPiece("destroyChessPiece"),
  playerTime("playerTime");

  final String value;

  const ChessDataType(this.value);
}