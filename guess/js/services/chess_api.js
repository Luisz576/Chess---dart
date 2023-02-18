class ChessApi{
    #socket
    #listeners = {
        "updateChessPiecePosition": [],
        "changeChessPieceType": [],
        "destroyChessPiece": []
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
        console.log("Message Event:", event)
        //TODO:
        switch(event['type']){
            case ChessEventType.EVENTS_TYPES.changeChessPieceType:
                this.#listeners.changeChessPieceType.forEach((listener) => {
                    const chessPieceId = 1
                    const type = ""
                    listener(chessPieceId, type)
                })
                break;
            case ChessEventType.EVENTS_TYPES.destroyChessPiece:
                this.#listeners.destroyChessPiece.forEach((listener) => {
                    const chessPieceId = 1
                    listener(chessPieceId)
                })
                break;  
            case ChessEventType.EVENTS_TYPES.updateChessPiecePosition:
                this.#listeners.updateChessPiecePosition.forEach((listener) => {
                    const chessPieceId = 1
                    const position = ""
                    listener(chessPieceId, position)
                })
                break;
        }
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
        if(chessPieceId && moviment && Number.isInteger(moviment)){
            this.#sendJson({
                "chessPieceId": chessPieceId,
                "moviment": moviment
            })
        }
    }
}