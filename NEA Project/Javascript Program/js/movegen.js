
// Most valuable victim Least valuable attacker
var MvvLvaValue = [ 0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600 ]; // Value for each piece
var MvvLvaScores = new Array(14 * 14); // Victim * Attacker

// Function to initialise MvvLva
function InitMvvLva() {
	var Attacker;
	var Victim;
	
	for(Attacker = PIECES.wP; Attacker <= PIECES.bK; ++Attacker) {
		for(Victim = PIECES.wP; Victim <= PIECES.bK; ++Victim) {
			MvvLvaScores[Victim * 14 + Attacker] = MvvLvaValue[Victim] + 6 - (MvvLvaValue[Attacker]/100); // Gives a higher score the lower the attackers value is
		}
	}
}
 
// Function to check if a move exists
function MoveExists(move) {
	
	GenerateMoves();
    
	var index;
	var moveFound = NOMOVE;

	// For loop to loop thorugh each move in the move list
	for(index = Board.moveListStart[Board.ply]; index < Board.moveListStart[Board.ply + 1]; ++index) {
	
		moveFound = Board.moveList[index];	
		// Check if the move is legal if it isnt than we continue
		if(MakeMove(moveFound) == false) {
			continue;
		}
		// If it is a legal move than take back a move to see if it is the same as the move we are looking for
		TakeMove();
		if(move == moveFound) {
			return true;
		}
	}
	return false;
}
 
// Function which creates a move string using the from square, to square, captured piece, promoted piece and the flag
function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}
 
// Function which adds a capture move to the move list and adjusts the score of the move
function AddCaptureMove(move) {
	Board.moveList[Board.moveListStart[Board.ply+1]] = move;
	Board.moveScores[Board.moveListStart[Board.ply+1]++] = MvvLvaScores[CAPTURED(move) * 14 + Board.pieces[FROMSQ(move)]] + 1000000;
}

// Function which adds a quite move tot he move list and sets the moves score to 0
function AddQuietMove(move) {
	Board.moveList[Board.moveListStart[Board.ply+1]] = move;
	Board.moveScores[Board.moveListStart[Board.ply+1]] = 0;

	if(move == Board.searchKillers[Board.ply]) {
		Board.moveScores[Board.moveListStart[Board.ply+1]] = 900000;
	} else if(move == Board.searchKillers[Board.ply + MAXDEPTH]){ 
		Board.moveScores[Board.moveListStart[Board.ply+1]] = 800000;
	} else {
		Board.moveScores[Board.moveListStart[Board.ply+1]] = Board.searchHistory[Board.pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move)];
	}

	Board.moveListStart[Board.ply+1]++
}

// Function which adds an En Passant capture move to the move list and adjusts the score of the move
function AddEnPassantMove(move) {
	Board.moveList[Board.moveListStart[Board.ply+1]] = move;
	Board.moveScores[Board.moveListStart[Board.ply+1]++] = 105 + 1000000; // Pawn taking a pawn gives a value of 105
}

// Function which adds a white pawn capture move to the move list and adds the promotion moves to the moves list if the pawn moves from rank 7
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

// Function which adds a black pawn capture move to the move list and adds the promotion moves to the moves list if the pawn moves from rank 7
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

// Function which adds a white pawn quite move to the move list and adds the promotion moves to the moves list if the pawn moves from rank 7
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

// Function which adds a black pawn quite move to the move list and adds the promotion moves to the moves list if the pawn moves from rank 7
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
	Board.moveListStart[Board.ply+1] = Board.moveListStart[Board.ply];
	
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var target_sq;
	var dir;
	
	// If statement which checks what colours turn it is
	if(Board.side == COLOURS.WHITE) {
		// Setting the piece type to white pawn
		pceType = PIECES.wP;
		
		// For loop to loop through all the white pawns on the board
		for(pceNum = 0; pceNum < Board.pceNum[pceType]; ++pceNum) {
			// Getting the square which the piece is on
			sq = Board.pList[PCEINDEX(pceType, pceNum)];

			// If the square infront of a pawn is empty than it can move there
			if(Board.pieces[sq + 10] == PIECES.EMPTY) {
				// Adds white pawn quite move to the move list
				AddWhitePawnQuietMove(sq, sq+10);
				// If the white pawn is on the second rank and there is nothing two squares infront of it than it can move there
				if(RanksBrd[sq] == RANKS.RANK_2 && Board.pieces[sq + 20] == PIECES.EMPTY) {
					// Adds quite move to the move list
					AddQuietMove( MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGPS ));
				}
			}
			
			// Checks if the diagonal square to the left is not off the board and has a black piece on it
			if(SQOFFBOARD(sq + 9) == false && PieceCol[Board.pieces[sq+9]] == COLOURS.BLACK) {
				// Adds a white pawn capture move to the move list
				AddWhitePawnCaptureMove(sq, sq + 9, Board.pieces[sq+9]);
			}
			
			// Checks if the diagonal square to the right is not off the board and has a black piece on it
			if(SQOFFBOARD(sq + 11) == false && PieceCol[Board.pieces[sq+11]] == COLOURS.BLACK) {
				// Adds a white pawn capture move to the move list
				AddWhitePawnCaptureMove(sq, sq + 11, Board.pieces[sq+11]);
			}			
			
			// Checkis if there is an En Passsant square set
			if(Board.enPas != SQUARES.NO_SQ) {
				// Checks if the diagonal square to the left is the En Passant square
				if(sq + 9 == Board.enPas) {
					// Adds an En Passant move to the move list
					AddEnPassantMove( MOVE(sq, sq+9, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
				// Checks if the diagonal square to the right is the En Passant square
				if(sq + 11 == Board.enPas) {
					// Adds an En Passant move to the move list
					AddEnPassantMove( MOVE(sq, sq+11, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
			}			
			
		}
		
		// Checks if white has permission to castle king side
		if(Board.castlePerm & CASTLEBIT.WKCA) {
			// Checks if it is possible to make the white king side castling move
			if(Board.pieces[SQUARES.F1] == PIECES.EMPTY && Board.pieces[SQUARES.G1] == PIECES.EMPTY) {
				// Checks if the squares F1 and E1 are being attacked or not
				if(SqAttacked(SQUARES.F1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false) {
					// Adds a quite move to the move list
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGCA ));
				}
			}
		}
		
		// Checks if white has permission to castle queen side
		if(Board.castlePerm & CASTLEBIT.WQCA) {
			// Checks if it is possible to make the white queen side castling move
			if(Board.pieces[SQUARES.D1] == PIECES.EMPTY && Board.pieces[SQUARES.C1] == PIECES.EMPTY && Board.pieces[SQUARES.B1] == PIECES.EMPTY) {
				// Checks if the squares D1 and E1 are being attacked or not
				if(SqAttacked(SQUARES.D1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false) {
					// Adds a quite move to the move list
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGCA ));
				}
			}
		}		

	} else {
		// Setting the piece type to black pawn
		pceType = PIECES.bP;
		
		// For loop to loop through all the black pawns on the board
		for(pceNum = 0; pceNum < Board.pceNum[pceType]; ++pceNum) {
			// Getting the square which the piece is on
			sq = Board.pList[PCEINDEX(pceType, pceNum)];

			// If the square infront of a pawn is empty than it can move there
			if(Board.pieces[sq - 10] == PIECES.EMPTY) {
				// Adds black pawn quite move to the move list
				AddBlackPawnQuietMove(sq, sq-10);	
				// If the black pawn is on the seventh rank and there is nothing two squares infront of it than it can move there	
				if(RanksBrd[sq] == RANKS.RANK_7 && Board.pieces[sq - 20] == PIECES.EMPTY) {
					// Adds black pawn quite move to the move list
					AddQuietMove( MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGPS ));
				}
			}
			
			// Checks if the diagonal square to the left is not off the board and has a white piece on it
			if(SQOFFBOARD(sq - 9) == false && PieceCol[Board.pieces[sq-9]] == COLOURS.WHITE) {
				// Adds a black pawn capture move to the move list
				AddBlackPawnCaptureMove(sq, sq - 9, Board.pieces[sq-9]);
			}
			
			// Checks if the diagonal square to the right is not off the board and has a white piece on it
			if(SQOFFBOARD(sq - 11) == false && PieceCol[Board.pieces[sq-11]] == COLOURS.WHITE) {
				// Adds a black pawn capture move to the move list
				AddBlackPawnCaptureMove(sq, sq - 11, Board.pieces[sq-11]);
			}			
			
			// Checkis if there is an En Passsant square set
			if(Board.enPas != SQUARES.NO_SQ) {
				// Checks if the diagonal square to the left is the En Passant square
				if(sq - 9 == Board.enPas) {
					// Adds an En Passant move to the move list
					AddEnPassantMove( MOVE(sq, sq-9, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
				// Checks if the diagonal square to the right is the En Passant square
				if(sq - 11 == Board.enPas) {
					// Adds an En Passant move to the move list
					AddEnPassantMove( MOVE(sq, sq-11, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
			}
		}

		// Checks if black has permission to castle king side
		if(Board.castlePerm & CASTLEBIT.BKCA) {
			// Checks if it is possible to make the black king side castling move
			if(Board.pieces[SQUARES.F8] == PIECES.EMPTY && Board.pieces[SQUARES.G8] == PIECES.EMPTY) {
				// Checks if the squares F8 and E8 are being attacked or not
				if(SqAttacked(SQUARES.F8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false) {
					// Adds a quite move to the move list
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGCA ));
				}
			}
		}
		
		// Checks if black has permission to castle queen side
		if(Board.castlePerm & CASTLEBIT.BQCA) {
			// Checks if it is possible to make the black queen side castling move
			if(Board.pieces[SQUARES.D8] == PIECES.EMPTY && Board.pieces[SQUARES.C8] == PIECES.EMPTY && Board.pieces[SQUARES.B8] == PIECES.EMPTY) {
				// Checks if the squares D8 and E8 are being attacked or not
				if(SqAttacked(SQUARES.D8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false) {
					// Adds a quite move to the move list
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGCA ));
				}
			}
		}	
	}	
	
	pceIndex = LoopNonSlideIndex[Board.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	// While loop to loop through all of the non sliding pieces
	while (pce != 0) {
		// For loop to loop through the piece array
		for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
			// Setting the square which the piece is on
			sq = Board.pList[PCEINDEX(pce, pceNum)];
			
			// For loop to loop through all the directions the piece can move to
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				// Setting the target square
				target_sq = sq + dir;
				
				// Checks if the target square is off board or not
				if(SQOFFBOARD(target_sq) == true) {
					continue;
				}
				
				// Checks if the square is empty or not
				if(Board.pieces[target_sq] != PIECES.EMPTY) {
					// Checks if the piece on the target square is an enemy piece
					if(PieceCol[Board.pieces[target_sq]] != Board.side) {
						// Adds a capture move to the move list
						AddCaptureMove( MOVE(sq, target_sq, Board.pieces[target_sq], PIECES.EMPTY, 0 ));
					}
				} else {
					// Adds a quite move to the move list
					AddQuietMove( MOVE(sq, target_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
				}
			}			
		}
		// Moves on to the next piece in the array
		pce = LoopNonSlidePce[pceIndex++];
	}
	
	pceIndex = LoopSlideIndex[Board.side];
	pce = LoopSlidePce[pceIndex++];
	
	// While loop to loop through all of the sliding pieces
	while(pce != 0) {	
		// For loop to loop through the piece array	
		for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
			// Setting the square which the piece is on
			sq = Board.pList[PCEINDEX(pce, pceNum)];
			
			// For loop to loop through all of the directions the piece can move to
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				// Setting the target square
				target_sq = sq + dir;
				
				// While loop to loop through squares in one direction untill the next square is off the board
				while( SQOFFBOARD(target_sq) == false ) {	
					
					// Checks if the target square is empty or not
					if(Board.pieces[target_sq] != PIECES.EMPTY) {
						// Checks if the piece on the target square is an enemy or not, if it is than it adds a capture move to the move list and if it isn't than it stops generating moves in that direction
						if(PieceCol[Board.pieces[target_sq]] != Board.side) {
							AddCaptureMove( MOVE(sq, target_sq, Board.pieces[target_sq], PIECES.EMPTY, 0 ));
						}
						break;
					}
					// Adds a quite move to the move list
					AddQuietMove( MOVE(sq, target_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
					target_sq += dir;
				}
			}			
		}
		// Moves on to the next piece in the array
		pce = LoopSlidePce[pceIndex++];
	}
}

// Same function as generatemoves with only the capturing moves
function GenerateCaptures() {
	Board.moveListStart[Board.ply+1] = Board.moveListStart[Board.ply];
	
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq;
	var dir;
	
	if(Board.side == COLOURS.WHITE) {
		pceType = PIECES.wP;
		
		for(pceNum = 0; pceNum < Board.pceNum[pceType]; ++pceNum) {
			sq = Board.pList[PCEINDEX(pceType, pceNum)];				
			
			if(SQOFFBOARD(sq + 9) == false && PieceCol[Board.pieces[sq+9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 9, Board.pieces[sq+9]);
			}
			
			if(SQOFFBOARD(sq + 11) == false && PieceCol[Board.pieces[sq+11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 11, Board.pieces[sq+11]);
			}			
			
			if(Board.enPas != SQUARES.NO_SQ) {
				if(sq + 9 == Board.enPas) {
					AddEnPassantMove( MOVE(sq, sq+9, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
				
				if(sq + 11 == Board.enPas) {
					AddEnPassantMove( MOVE(sq, sq+11, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
			}			
			
		}			

	} else {
		pceType = PIECES.bP;
		
		for(pceNum = 0; pceNum < Board.pceNum[pceType]; ++pceNum) {
			sq = Board.pList[PCEINDEX(pceType, pceNum)];			
			
			if(SQOFFBOARD(sq - 9) == false && PieceCol[Board.pieces[sq-9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 9, Board.pieces[sq-9]);
			}
			
			if(SQOFFBOARD(sq - 11) == false && PieceCol[Board.pieces[sq-11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 11, Board.pieces[sq-11]);
			}			
			
			if(Board.enPas != SQUARES.NO_SQ) {
				if(sq - 9 == Board.enPas) {
					AddEnPassantMove( MOVE(sq, sq-9, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
				
				if(sq - 11 == Board.enPas) {
					AddEnPassantMove( MOVE(sq, sq-11, PIECES.EMPTY, PIECES.EMPTY, MOVEFLAGEP ) );
				}
			}
		}			
	}	
	
	pceIndex = LoopNonSlideIndex[Board.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	while (pce != 0) {
		for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
			sq = Board.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				if(SQOFFBOARD(t_sq) == true) {
					continue;
				}
				
				if(Board.pieces[t_sq] != PIECES.EMPTY) {
					if(PieceCol[Board.pieces[t_sq]] != Board.side) {
						AddCaptureMove( MOVE(sq, t_sq, Board.pieces[t_sq], PIECES.EMPTY, 0 ));
					}
				}
			}			
		}	
		pce = LoopNonSlidePce[pceIndex++];
	}
	
	pceIndex = LoopSlideIndex[Board.side];
	pce = LoopSlidePce[pceIndex++];
	
	while(pce != 0) {		
		for(pceNum = 0; pceNum < Board.pceNum[pce]; ++pceNum) {
			sq = Board.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				while( SQOFFBOARD(t_sq) == false ) {	
				
					if(Board.pieces[t_sq] != PIECES.EMPTY) {
						if(PieceCol[Board.pieces[t_sq]] != Board.side) {
							AddCaptureMove( MOVE(sq, t_sq, Board.pieces[t_sq], PIECES.EMPTY, 0 ));
						}
						break;
					}
					t_sq += dir;
				}
			}			
		}	
		pce = LoopSlidePce[pceIndex++];
	}
}