class CHESS_PIECE_TYPES{
    static CHESS_PIECE_TYPES = {
        "king": "king",
        "queen": "queen",
        "tower": "tower",
        "knight": "knight",
        "pawn": "pawn",
        "bishop": "bishop"
    }

    static getImage(value, owner){
        if(owner == 1){
            switch(value){
                case "king":
                    return "imgs/w_king_svg_withShadow.svg"
                case "queen":
                    return "imgs/w_queen_svg_withShadow.svg"
                case "tower":
                    return "imgs/w_rook_svg_withShadow.svg"
                case "knight":
                    return "imgs/w_knight_svg_withShadow.svg"
                case "pawn":
                    return "imgs/w_pawn_svg_withShadow.svg"
                case "bishop":
                    return "imgs/w_bishop_svg_withShadow.svg"
            }
        }else{
            switch(value){
                case "king":
                    return "imgs/b_king_svg_withShadow.svg"
                case "queen":
                    return "imgs/b_queen_svg_withShadow.svg"
                case "tower":
                    return "imgs/b_rook_svg_withShadow.svg"
                case "knight":
                    return "imgs/b_knight_svg_withShadow.svg"
                case "pawn":
                    return "imgs/b_pawn_svg_withShadow.svg"
                case "bishop":
                    return "imgs/b_bishop_svg_withShadow.svg"
            }
        }
        return undefined
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