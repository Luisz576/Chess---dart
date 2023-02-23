class ChessController{
    #tableResolution
    #chessCanvas
    #render
    #piecesController
    #api
    #player = -1
    #allPlayersConnected = false
    #isPlayer = false
    #whoisNow = 1

    isMe(){
        return this.#whoisNow == this.#player
    }

    isPlayer(){
        return this.#isPlayer
    }

    constructor(canvas, api, tableResolution){
        this.#chessCanvas = canvas
        
        this.#tableResolution = tableResolution
        this.#api = api

        this.#piecesController = new ChessPiecesController()
        this.#render = new ChessRender(canvas, tableResolution)

        canvas.addEventListener("click", this.#clickHandler.bind(this))

        api.registerListener(ChessEventType.EVENTS_TYPES.connection, this.#onConnection.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.playerJoinOrQuit, this.#onPlayerJoinOrQuit.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.chessPieceCreate, this.#onPieceCreate.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.updateChessPiecePosition, this.#onUpdateChessPiecePosition.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.destroyChessPiece, this.#onDestroyChessPiece.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.changeChessPieceType, this.#onChangeChessPieceType.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.playerTime, this.#onChangePlayerTime.bind(this))
        api.registerListener(ChessEventType.EVENTS_TYPES.playerWin, this.#onPlayerWin.bind(this))
    }

    #clickHandler(event){
        if(this.#allPlayersConnected && this.isMe()){
            const canvasBounding = this.#chessCanvas.getBoundingClientRect()
            const clickPosition = {
                "x": Math.ceil((event.clientX - canvasBounding.left) / this.#tableResolution) - 1,
                "y": Math.ceil((event.clientY - canvasBounding.top) / this.#tableResolution) - 1
            }
            this.#onPlayerClick(clickPosition)
        }
    }

    #selectedPiece

    #onPlayerClick(clickPosition){
        let cliquedPiece = this.#piecesController.getPieceAt(clickPosition["x"], clickPosition["y"]);
        if(cliquedPiece){
            if(cliquedPiece["owner"] == this.#player){
                this.#selectedPiece = cliquedPiece
                this.#markPossibleMoviments(this.#selectedPiece, ChessPieceMoviment.CHESS_PIECE_MOVIMENTS[this.#selectedPiece["piece_type"]])
                this.renderTable()
                return;
            }
            //TODO: attack?
            return
        }
        if(this.#selectedPiece){
            let selectedPiecePosition = this.#selectedPiece["piece_position"]
            let distance = {
                "x": clickPosition["x"] - selectedPiecePosition["x"],
                "y": clickPosition["y"] - selectedPiecePosition["y"]
            }
            let moviments = ChessPieceMoviment.CHESS_PIECE_MOVIMENTS[this.#selectedPiece["piece_type"]]
            //TODO: peao primeiro movimento 2 casas
            for(let k in moviments){
                //moviment logic
                let moviment = moviments[k]
                moviment["name"] = k
                if(this.#canDoThisMoviment(this.#selectedPiece, moviment, distance)){
                    this.#sendMovimentPacket(this.#selectedPiece["piece_id"], moviment["id"], 1)
                    this.#clearPossibleMoviments()
                    this.renderTable()
                    break;
                }
            }
            return;
        }
    }

    #sendMovimentPacket(chessPieceId, moviment, value){
        this.#api.moveChessPiece(chessPieceId, moviment, value)
    }

    #possibleMoviments = []

    #markPossibleMoviments(selectedPiece, moviments){
        this.#clearPossibleMoviments()

        for(let k in moviments){
            let moviment = moviments[k]
            moviment["name"] = k
            if(this.#canDoThisMoviment(selectedPiece, moviment)){
                this.#addPossibleMoviment(selectedPiece["piece_position"], moviment)
            }
        }
    }

    #canDoThisMoviment(selectedPiece, moviment, distance = -1){
        if(!ChessPieceMoviment.thisPlayerCanDo(moviment["name"], this.#player)){
            return false;
        }

        let startX = selectedPiece["piece_position"]["x"];
        let startY = selectedPiece["piece_position"]["y"];
        if(distance == -1){
            if(moviment["x"] != 10 && moviment["x"] != -10
                && moviment["y"] != 10 && moviment["y"] != -10){
                let endX = startX + moviment["x"]
                let endY = startY + moviment["y"]
                let target = this.#piecesController.getPieceAt(endX, endY)
                if(target != null){
                    if(ChessPieceMoviment.onlyToMove(moviment["name"])){
                        return false;
                    }
                    return target["owner"] != this.#player
                }
                if(ChessPieceMoviment.onlyToAttack(moviment["name"])){
                    return false;
                }
                return true;
            }

            let endX = -1;
            let endY = -1;
            let movimentXToLeft = moviment["x"] == -10
            let movimentYToDown = moviment["y"] == -10
            let movimentXToRight = moviment["x"] == 10
            let movimentYToTop = moviment["y"] == 10
            

            return false;
        }

        let endX = startX + distance["x"]
        let endY = startY + distance["y"]

        if(endX > 7 || endX < 0 || endY > 7 || endY < 0){
            return false;
        }

        if(moviment["x"] != 10 && moviment["x"] != -10
            && moviment["y"] != 10 && moviment["y"] != -10){
            return moviment["x"] == distance["x"] && moviment["y"] == distance["y"]
        }

        let toY = startY > endY ? startY : endY
        let toX = startX > endX ? startX : endX
        for(let y = startY > endY ? endY : startY; y < toY; y++){
            for(let x = startX > endX ? endX : startX; x < toX; x++){
                if(this.#piecesController.getPieceAt(x, y) != null){
                    return false;
                }
            }
        }

        let target = this.#piecesController.getPieceAt(toX, toY)
        if(target != null){
            if(ChessPieceMoviment.onlyToMove(moviment["name"])){
                return false;
            }
            return target["owner"] != this.#player
        }

        if(ChessPieceMoviment.onlyToAttack(moviment["name"])){
            return false;
        }

        return true;
    }

    #clearPossibleMoviments(){
        while (this.#possibleMoviments.length > 0) {
            this.#possibleMoviments.pop();
        }
    }

    #addPossibleMoviment(currentPosition, moviment){
        this.#possibleMoviments.push({
            "id": moviment["id"],
            "x": currentPosition["x"] + moviment["x"],
            "y": currentPosition["y"] + moviment["y"]
        })
    }

    #onConnection(player, is_player){
        this.#player = player
        this.#isPlayer = is_player;
    }
    #onPlayerJoinOrQuit(hasJoined){
        this.#allPlayersConnected = hasJoined
    }
    #onPieceCreate(piece_id, piece_type, piece_position, owner){
        this.#piecesController.createPiece(piece_id, piece_type, piece_position, owner)
    }
    #onUpdateChessPiecePosition(chessPieceId, position){
        console.log(chessPieceId, position)
        this.#piecesController.updatePiecePosition(chessPieceId, position)
    }
    #onDestroyChessPiece(chessPieceId){
        this.#piecesController.destroyPiece(chessPieceId)
    }
    #onChangeChessPieceType(chessPieceId, type){
        this.#piecesController.changePieceType(chessPieceId, type)
    }
    #onChangePlayerTime(playerTime){
        this.#whoisNow = playerTime
    }
    #onPlayerWin(player){
        console.log("onPlayerWin:", player)
    }

    renderTable(){
        this.#render.render(this.#piecesController.getAllPieces(), this.#possibleMoviments, this.isMe())
    }
}