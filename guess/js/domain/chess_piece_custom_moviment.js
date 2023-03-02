class ChessPieceCustomMoviment{
    static getCustomMovimentationMark(player, piece_position, movimentName){
        if(movimentName == "rock_right"){
            return {
                "x": (player == 1 ? 4 : 3),
                "y": 0
            }
        }
        if(movimentName == "rock_right"){
            return {
                "x": (player == 1 ? -3 : -4),
                "y": 0
            }
        }
        return {
            "x": 0,
            "y": 0
        }
    }

    static canDoThisMoviment(player, piece, moviment, pieceRequester, hasPieceInWay){
        if(moviment["name"] == "rock_right"){
            let piecePosition = piece["piece_position"]
            let tower = pieceRequester(piecePosition["x"] + (player == 1 ? 4 : 3), piecePosition["y"])

            if(!tower || tower["piece_type"] != "tower"){
                return false
            }

            if(hasPieceInWay(piecePosition["x"], piecePosition["y"], tower["piece_position"]["x"], tower["piece_position"]["y"])){
                return false
            }

            return true
        }
        if(moviment["name"] == "rock_left"){
            let piecePosition = piece["piece_position"]
            let tower = pieceRequester(piecePosition["x"] - (player == 1 ? 3 : 4), piecePosition["y"])
            
            if(!tower || tower["piece_type"] != "tower"){
                return false
            }

            if(hasPieceInWay(piecePosition["x"], piecePosition["y"], tower["piece_position"]["x"], tower["piece_position"]["y"])){
                return false
            }

            return true
        }
        return false;
    }
}