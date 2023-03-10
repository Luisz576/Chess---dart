class ChessPiecesController{
    #pieces = {}

    getPieceAt(x, y){
        for(let k in this.#pieces){
            let piece_position = this.#pieces[k]["piece_position"]
            if(piece_position["x"] == x && piece_position["y"] == y){
                return this.#pieces[k]
            }
        }
        return undefined;
    }

    getAllPieces(){
        return this.#pieces
    }

    containsPiece(piece_id){
        if(this.#pieces[piece_id]){
            return true
        }
        return false
    }

    updatePiecePosition(piece_id, position){
        if(this.#pieces[piece_id]){
            this.#pieces[piece_id]["piece_position"] = position
            this.#pieces[piece_id]["piece_moved"] = true
        }
    }

    changePieceType(piece_id, type){
        if(this.#pieces[piece_id]){
            this.#pieces[piece_id]["piece_type"] = type
            this.#pieces[piece_id]["piece_image"] = CHESS_PIECE_TYPES.getImage(type, ["owner"])
        }
    }

    createPiece(piece_id, piece_type, piece_position, piece_moved, owner){
        let type = CHESS_PIECE_TYPES.fromValue(piece_type)
        this.#pieces[piece_id] = {
            "piece_id": piece_id,
            "piece_type": type,
            "piece_image": CHESS_PIECE_TYPES.getImage(type, owner),
            "piece_moved": piece_moved,
            "piece_position": {
                "x": piece_position[0],
                "y": piece_position[1]
            },
            "owner": owner
        }
    }

    destroyPiece(piece_id){
        delete this.#pieces[piece_id]
    }
}