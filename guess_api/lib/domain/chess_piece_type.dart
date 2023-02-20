enum ChessPieceType{
  king("king"),
  queen("queen"),
  tower("tower"),
  knight("knight"),
  pawn("pawn"),
  bishop("bishop");

  final String value;

  const ChessPieceType(this.value);
}