class ChessPiece{
    #destroyed = false

    isDestroyed(){
        return this.#destroyed
    }

    destroy(){
        this.#destroyed = true
    }

    constructor(id, chessPieceType, position){
        this.id = id
        this.chessPieceType = chessPieceType
        this.position = position
    }

    render(){
        //TODO:
    }
}