class ChessController{
    constructor(api){
        api.registerListener(ChessEventType.EVENTS_TYPES.updateChessPiecePosition, this.#onUpdateChessPiecePosition)
        api.registerListener(ChessEventType.EVENTS_TYPES.destroyChessPiece, this.#onDestroyChessPiece)
        api.registerListener(ChessEventType.EVENTS_TYPES.changeChessPieceType, this.#onChangeChessPieceType)
    }

    //TODO:
    #onUpdateChessPiecePosition(chessPieceId, position){
        console.log("onUpdateChessPiecePosition:", chessPieceId, position)
    }
    #onDestroyChessPiece(chessPieceId){
        console.log("onDestroyChessPiece:", chessPieceId)
    }
    #onChangeChessPieceType(chessPieceId, type){
        console.log("onChangeChessPieceType:", chessPieceId, type)
    }
}