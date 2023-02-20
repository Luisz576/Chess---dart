class ChessPieceMoviment{
    static CHESS_PIECE_MOVIMENTS = {
        "king": {
            "right": {
                "x": 1,
                "y": 0,
                "id": 0
            },
            "right_top": {
                "x": 1,
                "y": 1,
                "id": 1
            },
            "right_down": {
                "x": 1,
                "y": -1,
                "id": 2
            },
            "left": {
                "x": -1,
                "y": 0,
                "id": 3
            },
            "left_top": {
                "x": -1,
                "y": 1,
                "id": 4
            },
            "left_down": {
                "x": -1,
                "y": -1,
                "id": 5
            },
            "top": {
                "x": 0,
                "y": 1,
                "id": 6
            },
            "down": {
                "x": 0,
                "y": -1,
                "id": 7
            },
        },
        "queen": {
            "right": {
                "x": 10,
                "y": 0,
                "id": 0
            },
            "right_top": {
                "x": 10,
                "y": 10,
                "id": 1
            },
            "right_down": {
                "x": 10,
                "y": -10,
                "id": 2
            },
            "left": {
                "x": -10,
                "y": 0,
                "id": 3
            },
            "left_top": {
                "x": -10,
                "y": 10,
                "id": 4
            },
            "left_down": {
                "x": -10,
                "y": -10,
                "id": 5
            },
            "top": {
                "x": 0,
                "y": 10,
                "id": 6
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
            "pawn_attack_right": {
                "x": 1,
                "y": 1,
                "id": 1
            },
            "pawn_attack_left": {
                "x": -1,
                "y": 1,
                "id": 2
            }
        }
    }

    static onlyToAttack(movimentName){
        return movimentName == "pawn_attack_right"
            || movimentName == "pawn_attack_left"
    }
}