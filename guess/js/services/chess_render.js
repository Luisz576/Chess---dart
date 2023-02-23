class ChessRender{
    #chessCanvas
    #tableResolution
    #canvas
    #imgs

    constructor(chessCanvas, tableResolution){
        this.#chessCanvas = chessCanvas
        this.#tableResolution = tableResolution
        this.#chessCanvas.width = tableResolution * 8
        this.#chessCanvas.height = tableResolution * 8

        this.#imgs = document.getElementsByClassName("chess-piece-img")
        
        this.#canvas = this.#chessCanvas.getContext('2d')
    }

    render(pieces, possibleMoviments, isMe){
        this.#canvas.clearRect(0, 0, this.#chessCanvas.width, this.#chessCanvas.height)
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                this.#drawRect(x * this.#tableResolution,
                    y * this.#tableResolution,
                    this.#tableResolution,
                    this.#tableResolution,
                    (y * 7 + x) % 2 == 0 ? "black" : "white")
            }
        }
        for(let i in pieces){
            let piece = pieces[i]
            let position = piece["piece_position"]
            this.#drawImage(piece["piece_image"],
                position['x'] * this.#tableResolution,
                position['y'] * this.#tableResolution,
                this.#tableResolution,
                this.#tableResolution)
        }
        if(isMe){
            for(let i in possibleMoviments){
                this.#drawRect(possibleMoviments[i]['x'] * this.#tableResolution,
                    possibleMoviments[i]['y'] * this.#tableResolution,
                    this.#tableResolution,
                    this.#tableResolution,
                    "green")
            }
        }
    }
    #drawRect(x, y, width, height, color){
        this.#canvas.fillStyle = color;
        this.#canvas.fillRect(x, y, width, height)
    }
    #drawImage(image, x, y, width, height){
        for(let k in this.#imgs){
            if(this.#imgs[k].src){
                if(this.#imgs[k].src.endsWith(image)){
                    this.#canvas.drawImage(this.#imgs[k], x, y, width, height)
                }
            }
        }
    }
}