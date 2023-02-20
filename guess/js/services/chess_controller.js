class ChessController{
    #canvas
    #api

    constructor(canvas, api){
        this.#canvas = canvas
        this.#api = api

        canvas.addEventListener("click", this.#clickHandler.bind(this))

        api.registerListener(ChessEventType.EVENTS_TYPES.connection, this.#onConnection)
        api.registerListener(ChessEventType.EVENTS_TYPES.playerJoinOrQuit, this.#onPlayerJoinOrQuit)
        api.registerListener(ChessEventType.EVENTS_TYPES.chessPieceCreate, this.#onPieceCreate)
        api.registerListener(ChessEventType.EVENTS_TYPES.updateChessPiecePosition, this.#onUpdateChessPiecePosition)
        api.registerListener(ChessEventType.EVENTS_TYPES.destroyChessPiece, this.#onDestroyChessPiece)
        api.registerListener(ChessEventType.EVENTS_TYPES.changeChessPieceType, this.#onChangeChessPieceType)
        api.registerListener(ChessEventType.EVENTS_TYPES.playerTime, this.#onChangePlayerTime)
        api.registerListener(ChessEventType.EVENTS_TYPES.playerWin, this.#onPlayerWin)
    }

    #clickHandler(event){
        //TODO: calcular onde clicou, verifica se tem peça, manda evento
        console.log(event)
    }

    #onConnection(player, is_player){
        console.log("onConnection:", player, is_player)
    }
    #onPlayerJoinOrQuit(hasJoined){
        console.log("onPlayerJoinOrQuit:", hasJoined)
    }
    #onPieceCreate(piece_id, piece_type, piece_position){
        console.log("onPieceCreate:", piece_id, piece_type, piece_position)
    }
    #onUpdateChessPiecePosition(chessPieceId, position){
        console.log("onUpdateChessPiecePosition:", chessPieceId, position)
    }
    #onDestroyChessPiece(chessPieceId){
        console.log("onDestroyChessPiece:", chessPieceId)
    }
    #onChangeChessPieceType(chessPieceId, type){
        console.log("onChangeChessPieceType:", chessPieceId, type)
    }
    #onChangePlayerTime(playerTime){
        console.log("onChangePlayerTime:", playerTime)
    }
    #onPlayerWin(player){
        console.log("onPlayerWin:", player)
    }
}