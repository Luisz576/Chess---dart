class ChessGame{
    #chessCanvas
    #api
    #cgm
    #chessModal
    #chessModalMessage
    #running = false
    #chessController

    constructor(chessCanvas, cgm, chessModal, chessModalMessage){
        if(!chessCanvas){
            throw "Error to load canvas"
        }
        if(!cgm){
            throw "Error to load cgm"
        }
        if(!chessModal){
            throw "Error to load chess modal"
        }
        if(!chessModalMessage){
            throw "Error to load chess modal message"
        }
        this.#chessCanvas = chessCanvas
        this.#cgm = cgm
        this.#chessModal = chessModal
        this.#chessModalMessage = chessModalMessage
    }

    #onOpen(_event){}
    #onClose(_event){
        this.#cgm.innerText = "Reconectando..."
        initChess()
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
        this.#api = new ChessApi('ws://127.0.0.1:5760/ws', this.#onOpen.bind(this), this.#onClose.bind(this), this.#onReceivePacket.bind(this))
        this.#chessController = new ChessController(this.#chessCanvas, this.#cgm, this.#chessModal, this.#chessModalMessage, this.#api, tableResolution)
    }
}

function initChess(){
    const canvas = document.getElementById('chess-canvas')
    const cgm = document.getElementById('chess-game-message')
    const chessModal = document.getElementById('chess-modal')
    const chessModalMessage = document.getElementById('chess-modal-message')
    const game = new ChessGame(canvas, cgm, chessModal, chessModalMessage)
    game.startup(60)
}

window.onload = initChess