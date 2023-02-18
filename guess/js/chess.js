class ChessGame{
    #api
    #chessController
    constructor(){
        this.#api = new ChessApi('127.0.0.1:5760')
        this.#chessController = ChessController(this.#api)
    }
    init(){
        //TODO:
    }
}

function initChess(){
    const game = ChessGame()
    game.init()
}

window.onload = initChess