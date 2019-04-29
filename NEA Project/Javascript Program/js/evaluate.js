
//================================================================================
// Piece-Square Tables
//================================================================================
var PawnTable = [0,   0,   0,   0,   0,   0,   0,   0,
                 78,  83,  86,  73, 102,  82,  85,  90,
                 7,  29,  21,  44,  40,  31,  44,   7,
                -17,  16,  -2,  15,  14,   0,  15, -13,
                -26,   3,  10,   9,   6,   1,   0, -23,
                -22,   9,   5, -11, -10,  -2,   3, -19,
                -31,   8,  -7, -37, -36, -14,   3, -31,
                 0,   0,   0,   0,   0,   0,   0,   0];
   
var KnightTable = [ -66, -53, -75, -75, -10, -55, -58, -70,
                    -3,  -6, 100, -36,   4,  62,  -4, -14,
                    10,  67,   1,  74,  73,  27,  62,  -2,
                    24,  24,  45,  37,  33,  41,  25,  17,
                    -1,   5,  31,  21,  22,  35,   2,   0,
                    -18,  10,  13,  22,  18,  15,  11, -14,
                    -23, -15,   2,   0,   2,   0, -23, -20,
                    -74, -23, -26, -24, -19, -35, -22, -69];
                    
var BishopTable = [-59, -78, -82, -76, -23,-107, -37, -50,
                    -11,  20,  35, -42, -39,  31,   2, -22,
                    -9,  39, -32,  41,  52, -10,  28, -14,
                    25,  17,  20,  34,  26,  25,  15,  10,
                    13,  10,  17,  23,  17,  16,   0,   7,
                    14,  25,  24,  15,   8,  25,  20,  15,
                    19,  20,  11,   6,   7,   6,  20,  16,
                    -7,   2, -15, -12, -14, -15, -10, -10];
                    
var RookTable = [35,  29,  33,   4,  37,  33,  56,  50,
                55,  29,  56,  67,  55,  62,  34,  60,
                19,  35,  28,  33,  45,  27,  25,  15,
                0,   5,  16,  13,  18,  -4,  -9,  -6,
                -28, -35, -16, -21, -13, -29, -46, -30,
                -42, -28, -42, -25, -25, -35, -26, -46,
                -53, -38, -31, -26, -29, -43, -44, -53,
                -30, -24, -18,   5,  -2, -18, -31, -32];

// Bonus score if a side has 2 bishops
var BishopPair = 40;


//================================================================================
// Evaluation Function
//================================================================================

function EvalPosition() {
    var score = Board.material[COLOURS.WHITE] - Board.material[COLOURS.BLACK];

    var pce;
    var sq;
    var pceNum;

    // Using the Piece-Square Tables for white pawns
    pce = PIECES.wP;
    for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
        sq = Board.pList[PCEINDEX(pce,pceNum)];
        score += PawnTable[SQ64(sq)];
    }

    // Using the Piece-Square Tables for black pawns
    pce = PIECES.wP;
    for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
        sq = Board.pList[PCEINDEX(pce,pceNum)];
        score -= PawnTable[MIRROR64(SQ64(sq))];
    }

    // Using the Piece-Square Tables for white knights
    pce = PIECES.wN;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score += KnightTable[SQ64(sq)];
	}	

    // Using the Piece-Square Tables for black knights
	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
	}			
    
    // Using the Piece-Square Tables for white bishops
	pce = PIECES.wB;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score += BishopTable[SQ64(sq)];
	}	

    // Using the Piece-Square Tables for black bishops
	pce = PIECES.bB;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score -= BishopTable[MIRROR64(SQ64(sq))];
    }
    
    // Using the Piece-Square Tables for white rooks
	pce = PIECES.wR;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];
    }

    // Using the Piece-Square Tables for black rooks
	pce = PIECES.bR;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
    }

    // Using the Piece-Square Tables for white queens
	pce = PIECES.wQ;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];
	}	

    // Using the Piece-Square Tables for black queens
	pce = PIECES.bQ;	
	for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
		sq = Board.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
    }	
    
    // Bishop pair bonuses for each side
	if(Board.pceNum[PIECES.wB] >= 2) {
		score += BishopPair;
	}
	if(Board.pceNum[PIECES.bB] >= 2) {
		score -= BishopPair;
	}
    
    // Fliping the score if the side to move is black
    if (Board.side == COLOURS.WHITE) {
        return score;
    } else {
        return -score;
    }
}