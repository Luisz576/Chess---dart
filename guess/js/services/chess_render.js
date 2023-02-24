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
        if(isMe){
            for(let i in possibleMoviments){
                let possibleMoviment = possibleMoviments[i]
                for(let p = 0; p < possibleMoviment["power"]; p++){
                    let px = possibleMoviment["base_moviment"]['x'], py = possibleMoviment["base_moviment"]['y'];
                    if(possibleMoviment["base_moviment"]['x'] == 10){
                        px = p + 1;
                    }
                    if(possibleMoviment["base_moviment"]['x'] == -10){
                        px = (p + 1) * -1;
                    }
                    if(possibleMoviment["base_moviment"]['y'] == 10){
                        py = p + 1;
                    }
                    if(possibleMoviment["base_moviment"]['y'] == -10){
                        py = (p + 1) * -1;
                    }
                    px += possibleMoviment["current_position"]["x"]
                    py += possibleMoviment["current_position"]["y"]
                    this.#drawRect(px * this.#tableResolution,
                        py * this.#tableResolution,
                        this.#tableResolution,
                        this.#tableResolution,
                    "rgba(10, 100, 175, 0.4)")
                }
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