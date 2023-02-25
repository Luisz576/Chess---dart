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

  static ChessPieceType getChangeType(int type){
    switch(type){
      case 0:
        return ChessPieceType.queen;
      case 1:
        return ChessPieceType.knight;
      case 2:
        return ChessPieceType.tower;
      case 3:
        return ChessPieceType.bishop;
      default:
        return ChessPieceType.none;
    }
  }
}