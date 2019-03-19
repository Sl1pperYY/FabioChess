
//================================================================================
// Piece-Square Tables
//================================================================================
var PawnTable = [0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
                10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
                5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
                0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
                5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
                10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
                20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
                0	,	0	,	0	,	0	,	0	,	0	,	0	,	0];
    

function EvalPosition() {
    var score = GameBoard.material[COLOURS.WHITE] - GameBoard.material[COLOURS.BLACK];

    if (GameBoard.side == COLOURS.WHITE) {
        return score;
    } else {
        return -score;
    }
}