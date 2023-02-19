class ChessGame{
    #chessCanvas
    #api
    #chessController
    constructor(chessCanvas){
        if(!chessCanvas){
            throw "Error to load canvas"
        }
        this.#chessCanvas = chessCanvas
        this.#api = new ChessApi('ws://127.0.0.1:5760/ws', this.#onOpen, this.#onClose)
        this.#chessController = new ChessController(this.#api)
    }

    #onOpen(event){
        console.log("Conectado!", event)
        //TODO: load map
    }
    #onClose(event){
        console.log("Desconectado!", event)
        //TODO: clear board
    }

    init(){
        //TODO:
    }
}

function initChess(){
    const canvas = document.getElementById('chess-canvas')
    const game = new ChessGame(canvas)
    game.init()
}

window.onload = initChess