class ChessGame{
    #chessCanvas
    #api
    #running = false
    #chessController
    gameLoop

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
        console.log("Desconectado!")
        if(this.gameLoop != -1){
            clearInterval(this.gameLoop);
        }
    }

    #gameRun(){
        this.#chessController.renderTable()
    }
    
    isRunning(){
        return this.#running
    }

    startup(frames, tableResolution){
        if(this.isRunning())
			throw "This game is already running!"
        this.gameLoop = setInterval(this.#gameRun.bind(this), 1000/frames)
        this.#running = true
        this.#api = new ChessApi('ws://127.0.0.1:5760/ws', this.#onOpen, this.#onClose)
        this.#chessController = new ChessController(this.#chessCanvas, this.#api, tableResolution, this.#callbackOnConnection.bind(this))
    }

    #callbackOnConnection(isPlayer){
        if(!isPlayer){
            clearInterval(this.gameLoop);
            this.gameLoop = -1
        }
    }
}

function initChess(){
    const canvas = document.getElementById('chess-canvas')
    const game = new ChessGame(canvas)
    game.startup(5, 60)
}

window.onload = initChess