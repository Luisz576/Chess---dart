class ChessController{
    #tableResolution
    #chessCanvas
    #cgm
    #chessWhosTime
    #chessModal
    #chessModalMessage
    #chessModalSelectPiece
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

    constructor(canvas, cgm, chessWhosTime, chessModal, chessModalMessage, chessModalSelectPiece, api, tableResolution){
        this.#chessCanvas = canvas
        this.#cgm = cgm
        this.#chessWhosTime = chessWhosTime
        this.#chessModal = chessModal
        this.#chessModalMessage = chessModalMessage
        this.#chessModalSelectPiece = chessModalSelectPiece
        
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
                if(!this.#isPossibleMoviment(cliquedPiece["piece_position"])){
                    this.#selectedPiece = cliquedPiece
                    this.#markPossibleMoviments(this.#selectedPiece, ChessPieceMoviment.CHESS_PIECE_MOVIMENTS[this.#selectedPiece["piece_type"]])
                    this.renderTable()
                    return;
                }
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
                    this.#selectedPiece = undefined
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

    #isPossibleMoviment(position){
        for(let i in this.#possibleMoviments){
            let pm = this.#possibleMoviments[i]
            if(pm["newPosition"]["x"] == position["x"]
                && pm["newPosition"]["y"] == position["y"]){
                return true
            }
        }
        return false
    }

    #markPossibleMoviments(selectedPiece, moviments){
        this.#clearPossibleMoviments()

        for(let k in moviments){
            let moviment = moviments[k]
            moviment["name"] = k
            if(this.#canDoThisMoviment(selectedPiece, moviment)){
                let maxD = moviment["custom"] === true ? 1
                    : this.#whatsMaxDistance(selectedPiece["piece_position"],
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

    #hasPieceInWay(startX, startY, endX, endY){
        let toX = startX > endX ? startX : endX,
            fromX = startX > endX ? endX : startX,
            toY = startY > endY ? startY : endY,
            fromY = startY > endY ? endY : startY;
        if(fromY == toY){
            for(let x = fromX + 1; x < toX; x++){
                if(this.#piecesController.getPieceAt(x, toY) != null){
                    return true;
                }
            }
            return false;
        }
        if(fromX == toX){
            for(let y = fromY + 1; y < toY; y++){
                if(this.#piecesController.getPieceAt(toX, y) != null){
                    return true;
                }
            }
            return false;
        }
        if(toX - fromX == toY - fromY){
            for(let xy = 1; xy < toX - fromX; xy++){
                if(this.#piecesController.getPieceAt(fromX + xy, fromY + xy) != null){
                    return true;
                }
            }
        }
        return false;
    }

    #canDoThisMoviment(selectedPiece, moviment, distance = -1){
        if(!ChessPieceMoviment.thisPlayerCanDo(moviment["name"], this.#player)){
            return false;
        }

        if(ChessPieceMoviment.onlyIfNotMoved(moviment["name"])){
            if(selectedPiece["piece_moved"]){
                return false;
            }
        }

        if(moviment["custom"] == true){
            return ChessPieceCustomMoviment.canDoThisMoviment(this.#player, selectedPiece, moviment, this.#piecesController.getPieceAt.bind(this.#piecesController), this.#hasPieceInWay.bind(this))
        }

        let startX = selectedPiece["piece_position"]["x"];
        let startY = selectedPiece["piece_position"]["y"];
        if(distance == -1){
            let endX = startX + moviment["x"]
            let endY = startY + moviment["y"]

            if(this.#hasPieceInWay(startX, startY, endX, endY) && !ChessPieceMoviment.canJump(moviment["name"])){
                return false
            }

            if(moviment["x"] != 10 && moviment["x"] != -10
                && moviment["y"] != 10 && moviment["y"] != -10){
                let target = this.#piecesController.getPieceAt(endX, endY)
                if(target != null){
                    if(ChessPieceMoviment.onlyToMove(moviment["name"])){
                        return false
                    }
                    return target["owner"] != this.#player
                }
                if(ChessPieceMoviment.onlyToAttack(moviment["name"])){
                    return false;
                }
                return true
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

        if(this.#hasPieceInWay(startX, startY, endX, endY) && !ChessPieceMoviment.canJump(moviment["name"])){
            return false
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
        if(moviment["custom"] == true){
            let movimentation = ChessPieceCustomMoviment.getCustomMovimentationMark(this.#player, currentPosition, moviment["name"])
            this.#possibleMoviments.push({
                "id": moviment["id"],
                "current_position": currentPosition,
                "base_moviment": {
                    "x": movimentation["x"],
                    "y": movimentation["y"]
                },
                "newPosition": {
                    "x": currentPosition["x"] + movimentation["x"],
                    "y": currentPosition["y"] + movimentation["y"]
                },
                "power": power,
            })
            return
        }
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
    #onPieceCreate(piece_id, piece_type, piece_position, piece_moved, owner){
        this.#piecesController.createPiece(piece_id, piece_type, piece_position, piece_moved, owner)
    }
    #onUpdateChessPiecePosition(chessPieceId, position){
        this.#piecesController.updatePiecePosition(chessPieceId, position)
    }
    #onDestroyChessPiece(chessPieceId){
        this.#piecesController.destroyPiece(chessPieceId)
    }
    #onChangeChessPieceType(chessPieceId, type){
        if(type == "none"){
            this.#chessModalSelectPiece.classList.add('modal-visible')
            return
        }
        this.#piecesController.changePieceType(chessPieceId, type)
    }
    #onChangePlayerTime(playerTime){
        this.#whoisNow = playerTime
        this.#chessWhosTime.innerText = `Vez de ${playerTime}`
    }
    #onPlayerWin(player){
        this.#chessModal.classList.add('modal-visible')
        this.#chessModalMessage.innerText = `Player ${player} venceu!`
        const cm = this.#chessModal
        setTimeout(() => {
            cm.classList.remove('modal-visible')
        }, 10000)
    }

    renderTable(){
        this.#render.render(this.#piecesController.getAllPieces(), this.#possibleMoviments, this.isMe())
    }
}