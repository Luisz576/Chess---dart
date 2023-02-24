class ChessController{
    #tableResolution
    #chessCanvas
    #cgm
    #chessModal
    #chessModalMessage
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

    constructor(canvas, cgm, chessModal, chessModalMessage, api, tableResolution){
        this.#chessCanvas = canvas
        this.#cgm = cgm
        this.#chessModal = chessModal
        this.#chessModalMessage = chessModalMessage
        
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
        }
        if(this.#selectedPiece){
            let selectedPiecePosition = this.#selectedPiece["piece_position"]
            let distance = {
                "x": clickPosition["x"] - selectedPiecePosition["x"],
                "y": clickPosition["y"] - selectedPiecePosition["y"]
            }
            let moviments = ChessPieceMoviment.getAllowedMoviments(this.#selectedPiece["piece_type"], distance)
            for(let k in moviments){
                //moviment logic
                let moviment = moviments[k]
                moviment["name"] = k
                console.log(moviment, ":", distance)
                if(this.#canDoThisMoviment(this.#selectedPiece, moviment, distance)){
                    let maxDist = this.#whatsMaxDistance(
                            this.#selectedPiece["piece_position"],
                            moviment["x"] == 10 ? 1 : moviment["x"] == -10 ? -1 : 0,
                            moviment["y"] == 10 ? 1 : moviment["y"] == -10 ? -1 : 0,
                            this.#selectedPiece["owner"]
                        )
                    let dist = distance["y"] == 0 || (distance["y"] > distance["x"] && distance["x"] != 0) ? distance["x"] : distance["y"]
                    dist = dist < 0 ? -1 * dist : dist
                    this.#sendMovimentPacket(this.#selectedPiece["piece_id"], moviment["id"],
                        Math.min(maxDist, dist)
                    )
                    this.#clearPossibleMoviments()
                    this.renderTable()
                    break;
                }
            }
            return;
        }
    }

    #sendMovimentPacket(chessPieceId, moviment, value){
        console.log("Send: ", chessPieceId, moviment, value)
        this.#api.moveChessPiece(chessPieceId, moviment, value)
    }

    #possibleMoviments = []

    #markPossibleMoviments(selectedPiece, moviments){
        this.#clearPossibleMoviments()

        for(let k in moviments){
            let moviment = moviments[k]
            moviment["name"] = k
            if(this.#canDoThisMoviment(selectedPiece, moviment)){
                let maxD = this.#whatsMaxDistance(selectedPiece["piece_position"],
                    moviment["x"] == 10 ? 1 : moviment["x"] == -10 ? -1 : 0,
                    moviment["y"] == 10 ? 1 : moviment["y"] == -10 ? -1 : 0,
                    selectedPiece["owner"]
                )
                this.#addPossibleMoviment(selectedPiece["piece_position"], moviment, Math.max(maxD, 1))
            }
        }
    }

    #whatsMaxDistance(position, goingToX = 0, goingToY = 0, owner){
        let power = 0;
        while(power < 7){
            let destinyX = position["x"]
            let destinyY = position["y"]
            if(goingToX != 0){
                destinyX = position["x"] + (goingToX * (power + 1))
                if(destinyX > 7 || destinyX < 0){
                    break
                }
            }
            if(goingToY != 0){
                destinyY = position["y"] + (goingToY * (power + 1))
                if(destinyY > 7 || destinyY < 0){
                    break
                }
            }
            let target = this.#piecesController.getPieceAt(destinyX, destinyY)
            if(target == null){
                power++
                continue
            }
            if(target["owner"] == owner){
                break
            }
            power++
            break
        }
        return power;
    }

    //TODO: peão trocar tipo
    //TODO: peão atacar
    //TODO: rock
    //TODO: peão andar 2 no começo

    #canDoThisMoviment(selectedPiece, moviment, distance = -1){
        if(!ChessPieceMoviment.thisPlayerCanDo(moviment["name"], this.#player)){
            return false;
        }

        let startX = selectedPiece["piece_position"]["x"];
        let startY = selectedPiece["piece_position"]["y"];
        if(distance == -1){
            let endX = startX + moviment["x"]
            let endY = startY + moviment["y"]
            if(moviment["x"] != 10 && moviment["x"] != -10
                && moviment["y"] != 10 && moviment["y"] != -10){
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

            let maxDist = this.#whatsMaxDistance(selectedPiece["piece_position"],
                moviment["x"] == 10 ? 1 : moviment["x"] == -10 ? -1 : 0,
                moviment["y"] == 10 ? 1 : moviment["y"] == -10 ? -1 : 0,
                selectedPiece["owner"])
            if(maxDist == 0){
                return false
            }

            return true
        }

        let endX = startX + distance["x"]
        let endY = startY + distance["y"]

        if(endX > 7 || endX < 0 || endY > 7 || endY < 0){
            return false;
        }

        if(moviment["x"] != 10 && moviment["x"] != -10
                && moviment["y"] != 10 && moviment["y"] != -10){
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

        let maxDist = this.#whatsMaxDistance(selectedPiece["piece_position"],
                moviment["x"] == 10 ? 1 : moviment["x"] == -10 ? -1 : 0,
                moviment["y"] == 10 ? 1 : moviment["y"] == -10 ? -1 : 0,
                selectedPiece["owner"])
        if(maxDist == 0){
            return false
        }

        return true;
    }

    #clearPossibleMoviments(){
        while (this.#possibleMoviments.length > 0) {
            this.#possibleMoviments.pop();
        }
    }

    #addPossibleMoviment(currentPosition, moviment, power = 1){
        this.#possibleMoviments.push({
            "id": moviment["id"],
            "current_position": currentPosition,
            "base_moviment": {
                "x": moviment["x"],
                "y": moviment["y"]
            },
            "newPosition": {
                "x": currentPosition["x"] + moviment["x"],
                "y": currentPosition["y"] + moviment["y"]
            },
            "power": power,
        })
    }

    #onConnection(player, is_player){
        this.#player = player
        this.#isPlayer = is_player;
        if(is_player){
            this.#cgm.innerText = "Esperando jogador..."
            return
        }
        this.#cgm.innerText = "Espectador"
    }
    #onPlayerJoinOrQuit(hasJoined){
        this.#allPlayersConnected = hasJoined
        if(this.#isPlayer){
            this.#cgm.innerText = hasJoined ? ("Conectado: " + this.#player) : "Esperando jogador..."
            return
        }
        this.#cgm.innerText = "Espectador"
    }
    #onPieceCreate(piece_id, piece_type, piece_position, owner){
        this.#piecesController.createPiece(piece_id, piece_type, piece_position, owner)
    }
    #onUpdateChessPiecePosition(chessPieceId, position){
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
        // this.#chessModal
        // this.#chessModalMessage
        //TODO: show modal and listener to close modal
    }

    renderTable(){
        this.#render.render(this.#piecesController.getAllPieces(), this.#possibleMoviments, this.isMe())
    }
}