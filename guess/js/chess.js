class ChessGame{
    #chessCanvas
    #api
    #running = false
    #chessController

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

    #onReceivePacket(){
        this.#chessController.renderTable()
    }
    
    isRunning(){
        return this.#running
    }

    startup(tableResolution){
        if(this.isRunning())
			throw "This game is already running!"
        this.#running = true
        this.#api = new ChessApi('ws://127.0.0.1:5760/ws', this.#onOpen, this.#onClose, this.#onReceivePacket.bind(this))
        this.#chessController = new ChessController(this.#chessCanvas, this.#api, tableResolution)
    }
}

function initChess(){
    const canvas = document.getElementById('chess-canvas')
    const game = new ChessGame(canvas)
    game.startup(60)
}

window.onload = initChess