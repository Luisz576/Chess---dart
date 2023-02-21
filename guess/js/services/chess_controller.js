class ChessController{
    #tableResolution
    #chessCanvas
    #canvas
    #api
    #callbackOnConnection
    #player = -1
    #allPlayersConnected = false
    #isPlayer = false
    #pieces = {}
    #whoisNow = 1

    isMe(){
        return this.#whoisNow == this.#player
    }

    isPlayer(){
        return this.#isPlayer
    }

    constructor(canvas, api, tableResolution, callbackOnConnection){
        this.#chessCanvas = canvas
        this.#canvas = canvas.getContext('2d')
        this.#tableResolution = tableResolution
        this.#chessCanvas.width = tableResolution * 8
        this.#chessCanvas.height = tableResolution * 8
        this.#api = api
        this.#callbackOnConnection = callbackOnConnection

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
        if(this.#allPlayersConnected && this.#whoisNow == this.#player){
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
        let cliquedPiece;
        for(let k in this.#pieces){
            let piece_position = this.#pieces[k]["piece_position"]
            if(piece_position["x"] == clickPosition["x"] && piece_position["y"] == clickPosition["y"]){
                cliquedPiece = this.#pieces[k];
                break;
            }
        }
        if(cliquedPiece){
            if(cliquedPiece["owner"] == this.#player){
                this.#selectedPiece = cliquedPiece
                this.#markPossibleMoviments(this.#selectedPiece, ChessPieceMoviment.CHESS_PIECE_MOVIMENTS[this.#selectedPiece["piece_type"]])
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
                if(moviment["x"] != 10 && moviment["x"] != -10
                    && moviment["y"] != 10 && moviment["y"] != -10){
                    if(moviment["x"] == distance["x"] && moviment["y"] == distance["y"]){
                        this.#sendMovimentPacket(this.#selectedPiece["piece_id"], moviment["id"], 1)
                    }
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
        while (this.#possibleMoviments.length > 0) {
            this.#possibleMoviments.pop();
        }
        
        //TODO: fazer toda logíca de se pode mover
        //TODO: salvar todos os blocos em #possibleMoviments

        console.log(selectedPiece)
        console.log(moviments)
    }

    #onConnection(player, is_player){
        this.#player = player
        this.#isPlayer = is_player;
        this.#callbackOnConnection(is_player)
    }
    #onPlayerJoinOrQuit(hasJoined){
        this.#allPlayersConnected = hasJoined
    }
    #onPieceCreate(piece_id, piece_type, piece_position, owner){
        this.#pieces[piece_id] = {
            "piece_id": piece_id,
            "piece_type": CHESS_PIECE_TYPES.fromValue(piece_type),
            "piece_position": {
                "x": piece_position[0],
                "y": piece_position[1]
            },
            "owner": owner
        }
    }
    #onUpdateChessPiecePosition(chessPieceId, position){
        if(this.#pieces[chessPieceId]){
            this.#pieces[chessPieceId]["piece_position"] = position
        }
    }
    #onDestroyChessPiece(chessPieceId){
        delete this.#pieces[chessPieceId]
    }
    #onChangeChessPieceType(chessPieceId, type){
        if(this.#pieces[chessPieceId]){
            this.#pieces[chessPieceId]["piece_type"] = type
        }
    }
    #onChangePlayerTime(playerTime){
        this.#whoisNow = playerTime
    }
    #onPlayerWin(player){
        console.log("onPlayerWin:", player)
    }

    renderTable(){
        this.#canvas.clearRect(0, 0, this.#chessCanvas.width, this.#chessCanvas.height)
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                this._drawRect(x * this.#tableResolution,
                    y * this.#tableResolution,
                    this.#tableResolution,
                    this.#tableResolution,
                    (y * 7 + x) % 2 == 0 ? "black" : "white")
            }
        }
        for(let i in this.#pieces){
            let piece = this.#pieces[i]
            let position = piece["piece_position"]
            this._drawRect(position['x'] * this.#tableResolution,
                position['y'] * this.#tableResolution,
                this.#tableResolution,
                this.#tableResolution,
                piece["owner"] == 1 ? "red" : "blue")
        }
        if(this.#whoisNow == this.#player){
            for(let i in this.#possibleMoviments){
                this._drawRect(this.#possibleMoviments[i]['x'] * this.#tableResolution,
                this.#possibleMoviments[i]['y'] * this.#tableResolution,
                this.#tableResolution,
                this.#tableResolution,
                "green")
            }
        }
    }
    _drawRect(x, y, width, height, color){
        this.#canvas.fillStyle = color;
        this.#canvas.fillRect(x, y, width, height)
    }
}