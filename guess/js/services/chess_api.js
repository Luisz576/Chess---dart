class ChessApi{
    #socket
    #listeners = {
        "connection": [],
        "chessPieceCreate": [],
        "updateChessPiecePosition": [],
        "changeChessPieceType": [],
        "destroyChessPiece": [],
        "playerTime": [],
        "playerWin": []
    }

    constructor(address, onOpen = (_event) => {}, onClose = (_event) => {}){
        this.#socket = new WebSocket(address)
        this.#socket.onopen = onOpen
        this.#socket.onclose = onClose
        this.#socket.onmessage = this.#onMessage
    }
    // METHODS
    //handler
    #onMessage(event){
        if(event['data']){
            try{
                const data = JSON.parse(event['data'])
                this.#handleOnReceiveData(data)
            }catch(e){
                console.log(e)
            }
        }
    }
    #handleOnReceiveData(data){
        if(data['data_type']){
            switch(data['data_type']){
                case ChessEventType.EVENTS_TYPES.connection:
                    const player = data["player"]
                    const is_player = data["is_player"]
                    if(Number.isInteger(player)){
                        this.#listeners.connection.forEach((listener) => {
                            listener(player, is_player)
                        })
                    }
                    break;
                case ChessEventType.EVENTS_TYPES.chessPieceCreate:
                    const piece_id = data["piece_id"]
                    const piece_type = data["piece_type"]
                    const piece_position = data["piece_position"]
                    if(Number.isInteger(piece_id) && piece_type && piece_position){
                        this.#listeners.chessPieceCreate.forEach((listener) => {
                            listener(piece_id, piece_type, piece_position)
                        })
                    }
                    break;
                case ChessEventType.EVENTS_TYPES.changeChessPieceType:
                    const chessPieceIdT = data["chess_piece_id"];
                    const type = data["chess_piece_type"];
                    if(chessPieceIdT && type){
                        this.#listeners.changeChessPieceType.forEach((listener) => {
                            listener(chessPieceIdT, type)
                        })
                    }
                    break;
                case ChessEventType.EVENTS_TYPES.destroyChessPiece:
                    const chessPieceIdD = data["chess_piece_id"];
                    if(chessPieceIdD){
                        this.#listeners.destroyChessPiece.forEach((listener) => {
                            listener(chessPieceIdD)
                        })
                    }
                    break;  
                case ChessEventType.EVENTS_TYPES.updateChessPiecePosition:
                    const chessPieceId = 1
                    const position = data["chess_piece_position"]
                    if(chessPieceId && position){
                        this.#listeners.updateChessPiecePosition.forEach((listener) => {
                            listener(chessPieceId, position)
                        })
                    }
                    break;
                case ChessEventType.EVENTS_TYPES.playerTime:
                    const playerTime = data["player_time"]
                    if(Number.isInteger(playerTime)){
                        this.#listeners.playerTime.forEach((listener) => {
                            listener(playerTime)
                        })
                    }
                    break;
                case ChessEventType.EVENTS_TYPES.playerWin:
                    const playerWin = data["player_win"]
                    if(Number.isInteger(playerWin)){
                        this.#listeners.playerWin.forEach((listener) => {
                            listener(playerWin)
                        })
                    }
                    break;
            }
            return;
        }
        console.error(`Invalid Data: ${data}`)
    }
    //send
    #send(message){
        this.#socket.send(message)
    }
    #sendJson(json){
        this.#send(JSON.stringify(json))
    }

    // LISTENERS
    registerListener(type = "", listener){
        if(listener && type && this.#listeners[type]){
            this.#listeners[type].push(listener)
            return true;
        }
        return false;
    }

    // ACTIONS
    moveChessPiece(chessPieceId, moviment, value){
        if(chessPieceId && moviment && Number.isInteger(moviment['id'])){
            this.#sendJson({
                "chessPieceId": chessPieceId,
                "moviment": moviment['id'],
                "value": value
            })
        }
    }
}