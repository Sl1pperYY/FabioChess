
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
  
var KnightTable = [0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
                    0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
                    0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
                    0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
                    5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
                    5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
                    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
                    0	,	0	,	0	,	0	,	0	,	0	,	0	,	0];
                    
var BishopTable = [0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
                    0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
                    0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
                    0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
                    0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
                    0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
                    0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
                    0	,	0	,	0	,	0	,	0	,	0	,	0	,	0];
                    
var RookTable = [0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
                0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
                0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
                0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
                0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
                0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
                25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
                0	,	0	,	5	,	10	,	10	,	5	,	0	,	0];

// Bonus if a side has a double bishop
var BishopPair = 40;


//================================================================================
// Evaluation Function
//================================================================================

function EvalPosition() {
    var score = GameBoard.material[COLOURS.WHITE] - GameBoard.material[COLOURS.BLACK];

    var pce;
    var sq;
    var pceNum;

    // Using the Piece-Square Tables for white pawns
    pce = PIECES.wP;
    for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
        sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
        score += PawnTable[SQ64(sq)];
    }

    // Using the Piece-Square Tables for black pawns
    pce = PIECES.wP;
    for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
        sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
        score -= PawnTable[MIRROR64(SQ64(sq))];
    }

    // Using the Piece-Square Tables for white knights
    pce = PIECES.wN;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += KnightTable[SQ64(sq)];
	}	

    // Using the Piece-Square Tables for black knights
	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
	}			
    
    // Using the Piece-Square Tables for white bishops
	pce = PIECES.wB;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += BishopTable[SQ64(sq)];
	}	

    // Using the Piece-Square Tables for black bishops
	pce = PIECES.bB;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= BishopTable[MIRROR64(SQ64(sq))];
	}
    
    // Using the Piece-Square Tables for white rooks
	pce = PIECES.wR;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];
	}	

    // Using the Piece-Square Tables for black rooks
	pce = PIECES.bR;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
	}
    
    // Using the Piece-Square Tables for white queens
	pce = PIECES.wQ;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)]/2;
	}	

    // Using the Piece-Square Tables for black queens
	pce = PIECES.bQ;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))]/2;
	}	
    
    // Bishop pair bonuses for each side
	if(GameBoard.pceNum[wB] >= 2) {
		score += BishopPair;
	}
	if(GameBoard.pceNum[bB] >= 2) {
		score -= BishopPair;
	}
    
    // Fliping the score if the side to move is black
    if (GameBoard.side == COLOURS.WHITE) {
        return score;
    } else {
        return -score;
    }
}