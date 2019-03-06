
// Function to build a move together
function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move) {
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 0;
	GameBoard.moveListStart[GameBoard.ply+1]++;
}

function AddQuietMove(move) {
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 0;
	GameBoard.moveListStart[GameBoard.ply+1]++;
}

function AddEnPassantMove(move) {
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 0;
	GameBoard.moveListStart[GameBoard.ply+1]++;
}

function AddWhitePawnCaptureMove(from, to, cap) {
	if(RanksBrd[from]==RANKS.RANK_7) {
		AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));	
	}
}

function AddBlackPawnCaptureMove(from, to, cap) {
	if(RanksBrd[from]==RANKS.RANK_2) {
		AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));	
	}
}

function AddWhitePawnQuietMove(from, to) {
	if(RanksBrd[from]==RANKS.RANK_7) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wQ,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wR,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wB,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wN,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function AddBlackPawnQuietMove(from, to) {
	if(RanksBrd[from]==RANKS.RANK_2) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bQ,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bR,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bB,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bN,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function GenerateMoves() {

	console.log(1);
	
	GameBoard.moveListStart[GameBoard.ply+1] = GameBoard.moveListStart[GameBoard.ply];

	console.log(1);
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq; // traget square
	var dir;

	console.log(1);

	if(GameBoard.side == COLOURS.WHITE) {
		pceType = PIECES.wP;
		console.log(1);


		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
			console.log(1);
	
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
			console.log(1);
	
			if(GameBoard.pieces[sq + 10] == PIECES.EMPTY) {
				console.log(1);
		
				AddWhitePawnQuietMove(sq, sq+10);
				console.log(1);
		
				if(RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq+20] == PIECES.EMPTY) {
					console.log(1);
			
					AddQuietMove(MOVE(sq, sq+20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
					console.log(1);
			
				}
			}

			if(SQOFFBOARD(sq + 9) == false && PieceCol[GameBoard.pieces[sq+9]] == COLOURS.BLACK) {
				console.log(1);
		
				AddWhitePawnCaptureMove(sq, sq+9, GameBoard.pieces[sq+9]);
				console.log(1);
		
			}

			if(SQOFFBOARD(sq + 11) == false && PieceCol[GameBoard.pieces[sq+11]] == COLOURS.BLACK) {
				console.log(1);
		
				AddWhitePawnCaptureMove(sq, sq+11, GameBoard.pieces[sq+11]);
				console.log(1);
		
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				console.log(1);
		
				if(sq + 9 == GameBoard.enPas) {
					console.log(1);
			
					AddEnPassantMove(MOVE(sq, sq+9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
					console.log(1);
			
				}
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				console.log(1);
		
				if(sq + 11 == GameBoard.enPas) {
					console.log(1);
			
					AddEnPassantMove(MOVE(sq, sq+11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
					console.log(1);
			
				}
			}
		}

		
		if (GameBoard.castlePerm & CASTLEBIT.WKCA) {
			console.log(1);
	
			if(GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
				console.log(1);
		
				if(SqAttacked(SQUARES.F1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false) {
					console.log(1);
			
					AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
					console.log(1);
			
				}
			}
		}
	

		if (GameBoard.castlePerm & CASTLEBIT.WQCA) {
			console.log(1);
	
			if(GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
				console.log(1);
		
				if(SqAttacked(SQUARES.D1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false) {
					console.log(1);
			
					AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
					console.log(1);
			
				}
			}
		}
	} else {
		console.log(1);

		pceType = PIECES.bP;

		console.log(1);

		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
			console.log(1);
	
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
			console.log(1);
	
			if(GameBoard.pieces[sq - 10] == PIECES.EMPTY) {
				console.log(1);
		
				AddBlackPawnQuietMove(sq, sq-10);
				console.log(1);
		
				if(RanksBrd[sq] == RANKS.RANK_7 && GameBoard.pieces[sq-20] == PIECES.EMPTY) {
					console.log(1);
			
					AddQuietMove(MOVE(sq, sq-20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
					console.log(1);
			
				}
			}

			if(SQOFFBOARD(sq - 9) == false && PieceCol[GameBoard.pieces[sq-9]] == COLOURS.WHITE) {
				console.log(1);
		
				AddBlackPawnCaptureMove(sq, sq-9, GameBoard.pieces[sq-9]);
				console.log(1);
		
			}

			if(SQOFFBOARD(sq - 11) == false && PieceCol[GameBoard.pieces[sq-11]] == COLOURS.WHITE) {
				console.log(1);
		
				AddBlackPawnCaptureMove(sq, sq-9, GameBoard.pieces[sq-9]);
				console.log(1);
		
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				console.log(1);
		
				if(sq - 9 == GameBoard.enPas) {
					console.log(1);
			
					AddEnPassantMove(MOVE(sq, sq-9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
					console.log(1);
			
				}
			}

			if(GameBoard.enPas != SQUARES.NOSQ) {
				console.log(1);
		
				if(sq - 11 == GameBoard.enPas) {
					console.log(1);
			
					AddEnPassantMove(MOVE(sq, sq-11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
					console.log(1);
			
				}
			}

		}

		if (GameBoard.castlePerm & CASTLEBIT.BKCA) {
			console.log(1);
	
			if(GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
				console.log(1);
		
				if(SqAttacked(SQUARES.F8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false) {
					console.log(1);
			
					AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
					console.log(1);
			
				}
			}
		}

		if (GameBoard.castlePerm & CASTLEBIT.BQCA) {
			console.log(1);
	
			if(GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
				console.log(1);
		
				if(SqAttacked(SQUARES.D8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false) {
					console.log(1);
			
					AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
					console.log(1);
			
				}
			}
		}
	}

	pceIndex = LoopNonSlideIndex[GameBoard.side];
	pce = LoopNonSlidePce[pceIndex++];

	console.log(1);
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
						AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0 ));
					}
				} else {
					AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
				}
			}			
		}	
		pce = LoopNonSlidePce[pceIndex++];
		console.log(pce);
		if (pce >= 3) {
			break;
		}
	}

	pceIndex = LoopSlidePceIndex[GameBoard.side];
	console.log(1);
	pce = LoopSlidePce[pceIndex++];

	console.log(1);
	while(pce != 0) {
		console.log(1);

		for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
			console.log(1);
	
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			console.log(1);
	
			for(index = 0; index < DirNum[pce]; index++) {
				console.log(1);
		
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				while(SQOFFBOARD(t_sq) == false) {
					console.log(1);
			

					if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
						console.log(1);
				
						if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
							console.log(1);
					
							AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
							console.log(1);
					
						}
						break;
					}
					AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
					console.log(1);
			
					t_sq += dir;
				}
			}
		}
		pce = LoopSlidePce[pceIndex++];
		console.log(pce);
		if (pce >= 3) {
			break;
		}
	}
}