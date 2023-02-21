class ChessController{
    #chessCanvas
    #canvas
    #api
    #callbackOnConnection
    #player = -1
    #isPlayer = false
    #pieces = {}
    #whoisNow = 1

    isMe(){
        return this.#whoisNow == this.#player
    }

    isPlayer(){
        return this.#isPlayer
    }

    constructor(canvas, api, callbackOnConnection){
        this.#chessCanvas = canvas
        this.#canvas = canvas.getContext('2d')
        this.#api = api
        this.#callbackOnConnection = callbackOnConnection

        canvas.addEventListener("click", this.#clickHandler.bind(this))

        api.registerListener(ChessEventType.EVENTS_TYPES.connection, this.#onConnection.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.playerJoinOrQuit, this.#onPlayerJoinOrQuit.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.chessPieceCreate, this.#onPieceCreate.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.updateChessPiecePosition, this.#onUpdateChessPiecePosition.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.destroyChessPiece, this.#onDestroyChessPiece.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.changeChessPieceType, this.#onChangeChessPieceType.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.playerTime, this.#onChangePlayerTime.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.playerWin, this.#onPlayerWin.bind(this))
    }

    #clickHandler(event){
        //TODO: calcular onde clicou, verifica se tem peça, manda evento
        console.log(event)
    }

    #onConnection(player, is_player){
        this.#player = player
        this.#isPlayer = is_player;
        callbackOnConnection(is_player)
    }
    #onPlayerJoinOrQuit(hasJoined){
        console.log("onPlayerJoinOrQuit:", hasJoined)
    }
    #onPieceCreate(piece_id, piece_type, piece_position, owner){
        this.#pieces[piece_id] = {
            "piece_id": piece_id,
            "piece_type": CHESS_PIECE_TYPES.fromValue(piece_type),
            "piece_position": {
                "x": piece_position[0],
                "y": piece_position[1]
            },
            "owner": owner
        }
        console.log(this.#pieces)
    }
    #onUpdateChessPiecePosition(chessPieceId, position){
        if(this.#pieces[chessPieceId]){
            this.#pieces[chessPieceId]["piece_position"] = position
        }
    }
    #onDestroyChessPiece(chessPieceId){
        delete this.#pieces[chessPieceId]
    }
    #onChangeChessPieceType(chessPieceId, type){
        if(this.#pieces[chessPieceId]){
            this.#pieces[chessPieceId]["piece_type"] = type
        }
    }
    #onChangePlayerTime(playerTime){
        this.#whoisNow = playerTime
    }
    #onPlayerWin(player){
        console.log("onPlayerWin:", player)
    }

    renderTable(){
        this.#canvas.clearRect(0, 0, this.#chessCanvas.width, this.#chessCanvas.height)
        for(let i in this.#pieces){
            let piece = this.#pieces[i]
            let position = this.#pieces[i]["piece_position"]
            //TODO: draw
        }
    }
}