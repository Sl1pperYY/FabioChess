
// Function to build a move together
function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function GenerateMoves() {
	GameBoard.moveListStart[GameBoard.ply+1] = GameBoard.moveListStart[GameBoard.ply];

	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq; // traget square
	var dir;

	if(GameBoard.side == COLOURS.WHITE) {
		pceType = PIECES.wP;

		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceType) {
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

			if(GameBoard.pieces[sq + 10] == PIECES.EMPTY) {
				// Add Pawn Move
				if(RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq+20] == PIECES.EMPTY) {
					// Add Quite Move
				}
			}

			if(SQOFFBOARD(sq + 9) == false && PieceCol[GameBoard.pieces[sq+9]] == COLOURS.BLACK) {
				// Add Pawn capture move
			}

			if(SQOFFBOARD(sq + 11) == false && PieceCol[GameBoard.pieces[sq+11]] == COLOURS.BLACK) {
				// Add Pawn capture move
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				if(sq + 9 == GameBoard.enPas) {
					// Add En Passant move
				}
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				if(sq + 11 == GameBoard.enPas) {
					// Add En Passant move
				}
			}
		}

		
		if (GameBoard.castlePerm & CASTLEBIT.WKCA) {
			if(GameBoard.pieces[SQUARES.F1] == PIECES.EMTPY && GameBoard.pieces[SQUARES.G1] == PIECES.EMTPY) {
				if(SqAttacked(SQUARES.F1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false) {
					// Add Quiet move
				}
			}
		}
	

		if (GameBoard.castlePerm & CASTLEBIT.WQCA) {
			if(GameBoard.pieces[SQUARES.D1] == PIECES.EMTPY && GameBoard.pieces[SQUARES.C1] == PIECES.EMTPY && GameBoard.pieces[SQUARES.B1] == PIECES.EMTPY) {
				if(SqAttacked(SQUARES.D1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false) {
					// Add Quiet move
				}
			}
		}
	} else {
		pceType = PIECES.bP;

		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceType) {
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

			if(GameBoard.pieces[sq - 10] == PIECES.EMPTY) {
				// Add Pawn Move
				if(RanksBrd[sq] == RANKS.RANK_7 && GameBoard.pieces[sq-20] == PIECES.EMPTY) {
					// Add Quite Move
				}
			}

			if(SQOFFBOARD(sq - 9) == false && PieceCol[GameBoard.pieces[sq-9]] == COLOURS.WHITE) {
				// Add Pawn capture move
			}

			if(SQOFFBOARD(sq - 11) == false && PieceCol[GameBoard.pieces[sq-11]] == COLOURS.WHITE) {
				// Add Pawn capture move
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				if(sq - 9 == GameBoard.enPas) {
					// Add En Passant move
				}
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				if(sq - 11 == GameBoard.enPas) {
					// Add En Passant move
				}
			}

		}

		if (GameBoard.castlePerm & CASTLEBIT.BKCA) {
			if(GameBoard.pieces[SQUARES.F8] == PIECES.EMTPY && GameBoard.pieces[SQUARES.G8] == PIECES.EMTPY) {
				if(SqAttacked(SQUARES.F8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false) {
					// Add Quiet move
				}
			}
		}

		if (GameBoard.castlePerm & CASTLEBIT.BQCA) {
			if(GameBoard.pieces[SQUARES.D8] == PIECES.EMTPY && GameBoard.pieces[SQUARES.C8] == PIECES.EMTPY && GameBoard.pieces[SQUARES.B8] == PIECES.EMTPY) {
				if(SqAttacked(SQUARES.D8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false) {
					// Add Quiet move
				}
			}
		}
	}

	pceIndex = LoopNonSlideIndex[GameBoard.side];
	pce = LoopNonSlidePce[pceIndex++];

	while (pce != 0) {
		for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				if(SQOFFBOARD(t_sq) == true) {
					continue;
				}

				if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
					if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
						// Add caputure move
					}
				} else {
					// Add Quiet move
				}
			}

		}
		pce = LoopNonSlidePce[pceIndex++];
	}

	pceIndex = LoopSlidePieceIndex[GameBoard.side];
	pce = LoopSlidePiece[pceIndex++];

	while(pce != 0) {
		for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				while(SQOFFBOARD(t_sq) == false) {

					if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
						if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
							// Add caputure move
						}
						break;
					}
					// Add Quite Move
					t_sq += dir;
				}
			}
		}
		pce = LoopSlidePiece[pceIndex++];
	}
}