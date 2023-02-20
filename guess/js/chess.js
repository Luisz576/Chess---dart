class ChessGame{
    #chessCanvas
    #api
    #running = false
    #chessController
    #gameLoop

    constructor(chessCanvas){
        if(!chessCanvas){
            throw "Error to load canvas"
        }
        this.#chessCanvas = chessCanvas
    }

    #onOpen(event){
        console.log("Conectado!", event)
        //TODO: load map
    }
    #onClose(event){
        console.log("Desconectado!", event)
        //TODO: clear board
    }

    #gameRun(){
        //TODO:
    }
    
    isRunning(){
        return this.#running
    }

    startup(frames=30){
        if(this.isRunning())
			throw "This game is already running!"
        this.#gameLoop = setInterval(this.#gameRun.bind(this), 1000/frames)
        this.#running = true
        this.#api = new ChessApi('ws://127.0.0.1:5760/ws', this.#onOpen, this.#onClose)
        this.#chessController = new ChessController(this.#chessCanvas, this.#api)
    }
}

function initChess(){
    const canvas = document.getElementById('chess-canvas')
    const game = new ChessGame(canvas)
    game.startup()
}

window.onload = initChess