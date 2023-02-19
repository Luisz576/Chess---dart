class ChessApi{
    #socket
    #listeners = {
        "updateChessPiecePosition": [],
        "changeChessPieceType": [],
        "destroyChessPiece": [],
        "playerTime": []
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
                case ChessEventType.EVENTS_TYPES.changeChessPieceType:
                    const chessPieceIdT = data["chess_piece_id"];
                    const type = data["chess_piece_type"];
                    if(chessPieceIdT && type){
                        this.#listeners.changeChessPieceType.forEach((listener) => {
                            if(chessPieceId && type){
                                listener(chessPieceIdT, type)
                            }
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
    moveChessPiece(chessPieceId, moviment){
        if(chessPieceId && moviment && Number.isInteger(moviment['id'])){
            this.#sendJson({
                "chessPieceId": chessPieceId,
                "moviment": moviment['id']
            })
        }
    }
}