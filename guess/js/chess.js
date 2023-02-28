class ChessGame{
    #chessCanvas
    #api
    #cgm
    #chessWhosTime
    #chessModal
    #chessModalMessage
    #chessModalSelectPiece
    #running = false
    #chessController

    constructor(chessCanvas, cgm, chessWhosTime, chessModal, chessModalMessage, chessModalSelectPiece){
        if(!chessCanvas){
            throw "Error to load canvas"
        }
        if(!cgm){
            throw "Error to load cgm"
        }
        if(!chessWhosTime){
            throw "Error to load who's time"
        }
        if(!chessModal){
            throw "Error to load chess modal"
        }
        if(!chessModalMessage){
            throw "Error to load chess modal message"
        }
        if(!chessModalSelectPiece){
            throw "Error to load chess piece type modal"
        }
        this.#chessCanvas = chessCanvas
        this.#cgm = cgm
        this.#chessWhosTime = chessWhosTime
        this.#chessModal = chessModal
        this.#chessModalMessage = chessModalMessage
        this.#chessModalSelectPiece = chessModalSelectPiece
        const options = document.getElementsByClassName("chess-type-option")
        if(options.length != 4){
            throw "Error to load chess piece type option"
        }
        for(let i = 0; i < 4; i++){
            options.item(i).addEventListener("click", (_event) => {
                this.#onClickType(i)
            })
        }
    }

    #onClickType(typeIndex){
        this.#chessModalSelectPiece.classList.remove('modal-visible')
        this.#api.sendChangeTypeSelect(typeIndex)
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
        this.#chessController = new ChessController(this.#chessCanvas, this.#cgm, this.#chessWhosTime, this.#chessModal, this.#chessModalMessage, this.#chessModalSelectPiece, this.#api, tableResolution)
    }
}

function initChess(){
    const canvas = document.getElementById('chess-canvas')
    const cgm = document.getElementById('chess-game-message')
    const chessModal = document.getElementById('chess-modal')
    const chessModalMessage = document.getElementById('chess-modal-message')
    const chessModalSelectPiece = document.getElementById('chess-modal-select-piece')
    const chessWhosTime = document.getElementById('chess-game-player-time')
    const game = new ChessGame(canvas, cgm, chessWhosTime, chessModal, chessModalMessage, chessModalSelectPiece)
    game.startup(60)
}

window.onload = initChess