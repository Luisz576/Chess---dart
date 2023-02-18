class ChessGame{
    #api
    #chessController
    constructor(){
        this.#api = new ChessApi('wss://127.0.0.1:5760/ws', this.#onOpen, this.#onClose)
        this.#chessController = new ChessController(this.#api)
    }

    #onOpen(event){
        console.log("Conectado!", event)
    }
    #onClose(event){
        console.log("Desconectado!", event)
    }

    init(){
        //TODO:
    }
}

function initChess(){
    const game = new ChessGame()
    game.init()
}

window.onload = initChess