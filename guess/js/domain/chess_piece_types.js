class CHESS_PIECE_TYPES{
    static CHESS_PIECE_TYPES = {
        "king": "king",
        "queen": "queen",
        "tower": "tower",
        "knight": "knight",
        //TODO:
    }

    static fromValue(value){
        for(const k in CHESS_PIECE_TYPES.CHESS_PIECE_TYPES){
            if(CHESS_PIECE_TYPES.CHESS_PIECE_TYPES[k] == value){
                return k
            }
        }
        return null
    }
}