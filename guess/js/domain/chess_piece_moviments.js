class ChessPieceMoviment{
    static CHESS_PIECE_MOVIMENTS = {
        "king": {
            "right": {
                "x": 1,
                "y": 0,
                "id": 1
            },
            "right_top": {
                "x": 1,
                "y": 1,
                "id": 2
            },
            "right_down": {
                "x": 1,
                "y": -1,
                "id": 3
            },
            "left": {
                "x": -1,
                "y": 0,
                "id": 4
            },
            "left_top": {
                "x": -1,
                "y": 1,
                "id": 5
            },
            "left_down": {
                "x": -1,
                "y": -1,
                "id": 6
            },
            "top": {
                "x": 0,
                "y": 1,
                "id": 0
            },
            "down": {
                "x": 0,
                "y": -1,
                "id": 7
            },
            "rock_left": {
                "custom": true,
                "id": 8
            },
            "rock_right": {
                "custom": true,
                "id": 9
            }
        },
        "queen": {
            "right": {
                "x": 10,
                "y": 0,
                "id": 1
            },
            "right_top": {
                "x": 10,
                "y": 10,
                "id": 2
            },
            "right_down": {
                "x": 10,
                "y": -10,
                "id": 3
            },
            "left": {
                "x": -10,
                "y": 0,
                "id": 4
            },
            "left_top": {
                "x": -10,
                "y": 10,
                "id": 5
            },
            "left_down": {
                "x": -10,
                "y": -10,
                "id": 6
            },
            "top": {
                "x": 0,
                "y": 10,
                "id": 0
            },
            "down": {
                "x": 0,
                "y": -10,
                "id": 7
            },
        },
        "tower": {
            "top": {
                "x": 0,
                "y": 10,
                "id": 0
            },
            "down": {
                "x": 0,
                "y": -10,
                "id": 1
            },
            "right": {
                "x": 10,
                "y": 0,
                "id": 2
            },
            "left": {
                "x": -10,
                "y": 0,
                "id": 3
            },
        },
        "knight": {
            "top_top_left": {
                "x": -1,
                "y": 2,
                "id": 0
            },
            "top_top_right": {
                "x": 1,
                "y": 2,
                "id": 1
            },
            "top_left_left": {
                "x": -2,
                "y": 1,
                "id": 2
            },
            "top_right_right": {
                "x": 2,
                "y": 1,
                "id": 3
            },
            "down_down_left": {
                "x": -1,
                "y": -2,
                "id": 4
            },
            "down_down_right": {
                "x": 1,
                "y": -2,
                "id": 5
            },
            "down_left_left": {
                "x": -2,
                "y": -1,
                "id": 6
            },
            "down_right_right": {
                "x": 2,
                "y": -1,
                "id": 7
            },
        },
        "pawn": {
            "pawn_top": {
                "x": 0,
                "y": 1,
                "id": 0
            },
            "pawn_down": {
                "x": 0,
                "y": -1,
                "id": 1
            },
            "pawn_attack_right_top": {
                "x": 1,
                "y": 1,
                "id": 2
            },
            "pawn_attack_left_top": {
                "x": -1,
                "y": 1,
                "id": 3
            },
            "pawn_attack_right_down": {
                "x": 1,
                "y": -1,
                "id": 4
            },
            "pawn_attack_left_down": {
                "x": -1,
                "y": -1,
                "id": 5
            },
            "pawn_double_top": {
                "x": 0,
                "y": 2,
                "id": 6
            },
            "pawn_double_down": {
                "x": 0,
                "y": -2,
                "id": 7
            }
        },
        "bishop": {
            "top_left": {
                "x": -10,
                "y": 10,
                "id": 0
            },
            "top_right": {
                "x": 10,
                "y": 10,
                "id": 1
            },
            "down_left": {
                "x": -10,
                "y": -10,
                "id": 2
            },
            "down_right": {
                "x": 10,
                "y": -10,
                "id": 3
            },
        }
    }

    static canJump(movimentName){
        return movimentName == "top_top_left"
            || movimentName == "top_top_right"
            || movimentName == "top_left_left"
            || movimentName == "top_right_right"
            || movimentName == "down_down_left"
            || movimentName == "down_down_right"
            || movimentName == "down_left_left"
            || movimentName == "down_right_right"
    }

    static thisPlayerCanDo(movimentName, player){
        if(player == 1){
            if(movimentName == "pawn_down"
                || movimentName == "pawn_attack_right_down"
                || movimentName == "pawn_attack_left_down"
                || movimentName == "pawn_double_down"){
                return false;
            }
        }else{
            if(movimentName == "pawn_top"
                || movimentName == "pawn_attack_right_top"
                || movimentName == "pawn_attack_left_top"
                || movimentName == "pawn_double_top"){
                return false;
            }
        }
        return true;
    }

    static isCustom(movimentName){
        return movimentName == "rock_left"
            || movimentName == "rock_right"
    }

    static onlyToMove(movimentName){
        return movimentName == "pawn_top"
            || movimentName == "pawn_down"
            || movimentName == "pawn_double_top"
            || movimentName == "pawn_double_down"
            || movimentName == "rock_left"
            || movimentName == "rock_right"
    }

    static onlyToAttack(movimentName){
        return movimentName == "pawn_attack_right_top"
            || movimentName == "pawn_attack_left_top"
            || movimentName == "pawn_attack_right_down"
            || movimentName == "pawn_attack_left_down"
    }

    static onlyIfNotMoved(movimentName){
        return movimentName == "pawn_double_top"
            || movimentName == "pawn_double_down"
            || movimentName == "rock_left"
            || movimentName == "rock_right"
    }

    static getAllowedMoviments(type, distance){
        let ms = {}
        let moviments = this.CHESS_PIECE_MOVIMENTS[type]
        for(let k in moviments){
            let moviment = moviments[k]
            if(moviment["custom"] === true
                || (moviment["x"] == distance["x"] && moviment["y"] == distance["y"])
                || (moviment["x"] == 10 && distance["x"] > 0 && moviment["y"] == distance["y"])
                || (moviment["x"] == -10 && distance["x"] < 0 && moviment["y"] == distance["y"])
                || (moviment["y"] == 10 && distance["y"] > 0 && moviment["x"] == distance["x"])
                || (moviment["y"] == -10 && distance["y"] < 0 && moviment["x"] == distance["x"])
                || (moviment["x"] == 10 && distance["x"] > 0 && moviment["y"] == 10 && distance["y"] > 0)
                || (moviment["x"] == 10 && distance["x"] > 0 && moviment["y"] == -10 && distance["y"] < 0)
                || (moviment["x"] == -10 && distance["x"] < 0 && moviment["y"] == 10 && distance["y"] > 0)
                || (moviment["x"] == -10 && distance["x"] < 0 && moviment["y"] == -10 && distance["y"] < 0)){
                ms[k] = moviment
            }
        }
        return ms
    }
}