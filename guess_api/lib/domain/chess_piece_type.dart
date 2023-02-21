enum ChessPieceType{
  none("none", false),
  king("king", false),
  queen("queen", false),
  tower("tower", false),
  knight("knight", true),
  pawn("pawn", false),
  bishop("bishop", false);

  final String value;
  final bool canJump;

  const ChessPieceType(this.value, this.canJump);
}