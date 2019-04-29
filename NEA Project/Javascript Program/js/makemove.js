// Function which removes a piece from the square which was input
function ClearPiece(sq) {

    var pce = Board.pieces[sq];
    var colour = PieceCol[pce];
    var index;
    var temp_pceNum = -1;

    HASH_PCE(pce, sq);
 
    // Sets the sq which was input to empty
    Board.pieces[sq] = PIECES.EMPTY;
    // Takes away from the material value of the piece which was just removed
    Board.material[colour] -= PieceVal[pce];

    // For loop to loop through all of the same pieces
    for(index = 0; index < Board.pceNum[pce]; ++index) {
        // If we found the right piece than its piece number is stored in temp_pceNum
        if(Board.pList[PCEINDEX(pce,index)] == sq) {
            temp_pceNum = index;
            break;
        }
    }
    // Reduces the pceNum by one to be able to remove the last piece of the piece list
    Board.pceNum[pce]--;
    // Switches the piece with the index of temp_pceNum with the last index in the piece list so that it will be removed from the piece list
    Board.pList[PCEINDEX(pce, temp_pceNum)] = Board.pList[PCEINDEX(pce, Board.pceNum[pce])];
} 

// Function which adds a piece to the board
function AddPiece(sq, pce) {

    var colour = PieceCol[pce];

    HASH_PCE(pce,sq);

    // Adds the pce which was input to the square input
    Board.pieces[sq] = pce;
    // Adds the value of the added piece to the material value of the correct colour
    Board.material[colour] += PieceVal[pce];
    // Inserts the piece into the piece list
    Board.pList[PCEINDEX(pce, Board.pceNum[pce])] = sq;
    // Increments the piece number
    Board.pceNum[pce]++;
}

// Function which moves a piece from the square input onto the square input
function MovePiece(from, to) {

    var index = 0;
    // Gets which piece is being moved
    var pce = Board.pieces[from];

    // Hashes the piece out of its from square and removes the piece from the from square
    HASH_PCE(pce, from);
    Board.pieces[from] = PIECES.EMPTY;

    // Hashes the piece back in to its to square and adds the piece to the to square
    HASH_PCE(pce,to);
    Board.pieces[to] = pce;

    // Loops through all of the pieces on the board
    for(index = 0; index < Board.pceNum[pce]; ++index) {
        // If we found the correct piece on the from square in the piece list than we can update its position to the to square
        if(Board.pList[PCEINDEX(pce,index)] == from) {
            Board.pList[PCEINDEX(pce,index)] = to;
            break;
        }
    }

}

// Function which makes the move which is input using the move string format
function MakeMove(move) {
	
	var from = FROMSQ(move);
    var to = TOSQ(move);
    var side = Board.side;	

    // Stores the position key in the history array
	Board.history[Board.hisPly].posKey = Board.posKey;

    // If the move is an en passant move than it removes the correct pawn
	if( (move & MOVEFLAGEP) != 0) {
		if(side == COLOURS.WHITE) {
			ClearPiece(to-10);
		} else {
			ClearPiece(to+10);
        }
    // Checks if the move was a castling move or not
	} else if( (move & MOVEFLAGCA) != 0) {
        // Switch statement which moves the correct rook according to where the king was moved
		switch(to) {
			case SQUARES.C1:
                MovePiece(SQUARES.A1, SQUARES.D1);
			break;
            case SQUARES.C8:
                MovePiece(SQUARES.A8, SQUARES.D8);
			break;
            case SQUARES.G1:
                MovePiece(SQUARES.H1, SQUARES.F1);
			break;
            case SQUARES.G8:
                MovePiece(SQUARES.H8, SQUARES.F8);
			break;
            default: break;
		}
	}
    
    // If an En Passant square is set than hash it out of the hash key
    if(Board.enPas != SQUARES.NO_SQ) HASH_EP();
    // Hash out the current castling permissions
	HASH_CA();
    
    // Stores the current history index variables with what move is made, fifty move rule, En Passant square and the castling permissions
	Board.history[Board.hisPly].move = move;
    Board.history[Board.hisPly].fiftyMove = Board.fiftyMove;
    Board.history[Board.hisPly].enPas = Board.enPas;
    Board.history[Board.hisPly].castlePerm = Board.castlePerm;
    
    // Bitwise anding the castling permission with the from square and the to square (to square is needed so when a rook is captured than it also removes the castling permission)
    Board.castlePerm &= CastlePerm[from];
    Board.castlePerm &= CastlePerm[to];
    // Setting the En Passant square to NO_SQ
    Board.enPas = SQUARES.NO_SQ;
    
    // Hash the new castling permissions
    HASH_CA();
    
    var captured = CAPTURED(move);
    // Incrementing the fifty move rule counter
    Board.fiftyMove++;
    
    // If the move is a capturing move it clears the to square of the piece than sets the fifty move rule back to 0
    if(captured != PIECES.EMPTY) {
        ClearPiece(to);
        Board.fiftyMove = 0;
    }
    
    // Incrementing the hisPly counter and the ply counter
    Board.hisPly++;
	Board.ply++;
    
    // If statement which checks if the piece is a pawn
	if(PiecePawn[Board.pieces[from]] == true) {
        // Sets the fifty move rule back to 0
        Board.fiftyMove = 0;
        // If the its the first move for the pawn being moved than it sets the Board.enPas to the correct square
        if( (move & MOVEFLAGPS) != 0) {
            if(side==COLOURS.WHITE) {
                Board.enPas=from+10;
            } else {
                Board.enPas=from-10;
            }
            HASH_EP();
        }
    }
    
    // Moving the piece
    MovePiece(from, to);
    
    var prPce = PROMOTED(move);
    // If there is a promoted piece then it removes the piece from the to square and replaces it with the promoted square
    if(prPce != PIECES.EMPTY)   {
        ClearPiece(to);
        AddPiece(to, prPce);
    }
    
    // Switches the side and hashes the side into the key
    Board.side ^= 1;
    HASH_SIDE();
    
    // If the king is in check than it return false
    if(SqAttacked(Board.pList[PCEINDEX(Kings[side],0)], Board.side))  {
        TakeMove();
        return false;
    }
    
    return true;
}

// Function which takes the last move back
function TakeMove() {
    
    // Decreasing the hisply to use it as an index in the history array
	Board.hisPly--;
    Board.ply--;
    
    // Get the move string from the history array
    var move = Board.history[Board.hisPly].move;
	var from = FROMSQ(move);
    var to = TOSQ(move);
    
    // If the En Passant square was set int the previous move than hash it back out of the hash key
    if(Board.enPas != SQUARES.NO_SQ) HASH_EP();
    // Hashing castle permissions out
    HASH_CA();
    
    // Makes the current castling permissions, the fifty move rule and the En Passant square variables in the Board the same as the previous moves using the history array
    Board.castlePerm = Board.history[Board.hisPly].castlePerm;
    Board.fiftyMove = Board.history[Board.hisPly].fiftyMove;
    Board.enPas = Board.history[Board.hisPly].enPas;
    
    // Hash back the En passant square if the En Passant square was set before
    if(Board.enPas != SQUARES.NO_SQ) HASH_EP();
    // Hashing back the castle permissions
    HASH_CA();
    
    // Changes the side
    Board.side ^= 1;
    HASH_SIDE();
    
    // If the last move was an En Passant capture than add back the pawn which was taken
    if( (MOVEFLAGEP & move) != 0) {
        if(Board.side == COLOURS.WHITE) {
            AddPiece(to-10, PIECES.bP);
        } else {
            AddPiece(to+10, PIECES.wP);
        }
    // If the last move was a Castling move than it also moves the rook back to its original place
    } else if( (MOVEFLAGCA & move) != 0) {
        switch(to) {
        	case SQUARES.C1: MovePiece(SQUARES.D1, SQUARES.A1); break;
            case SQUARES.C8: MovePiece(SQUARES.D8, SQUARES.A8); break;
            case SQUARES.G1: MovePiece(SQUARES.F1, SQUARES.H1); break;
            case SQUARES.G8: MovePiece(SQUARES.F8, SQUARES.H8); break;
            default: break;
        }
    }
    
    // Moves the piece back
    MovePiece(to, from);
    
    // Adds back the piece which was capture if any were captured
    var captured = CAPTURED(move);
    if(captured != PIECES.EMPTY) { 
        AddPiece(to, captured);
    }
    
    // If a pawn promoted the last move than it is converted back into a pawn
    if(PROMOTED(move) != PIECES.EMPTY)   {         
        ClearPiece(from);
        AddPiece(from, (PieceCol[PROMOTED(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP));
    }
    
}