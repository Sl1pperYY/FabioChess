// Function to return a square string
function PrintSq(sq) {
    return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]]);
}

// Function to return move in algebraic form
function PrintMove(move) {
	var MvStr;
	
	// Gets the file and rank of the from square and the to square
	var fromFile = FilesBrd[FROMSQ(move)];
	var fromRank = RanksBrd[FROMSQ(move)];
	var toFile = FilesBrd[TOSQ(move)];
	var toRank = RanksBrd[TOSQ(move)];
	
	// Adds the files and ranks of the from square and the to square and converts it into algebraic notation
	MvStr = FileChar[fromFile] + RankChar[fromRank] + FileChar[toFile] + RankChar[toRank];
	
    var promoted = PROMOTED(move);
	
	// If the move was a promotion it adds what the piece was promoted to to the end of the move string
	if(promoted != PIECES.EMPTY) {
        console.log('promoted = ' + promoted);
		var pchar = 'q';
		if(PieceKnight[promoted] == true) {
			pchar = 'n';
		} else if(PieceRookQueen[promoted] == true && PieceBishopQueen[promoted] == false)  {
			pchar = 'r';
		} else if(PieceRookQueen[promoted] == false && PieceBishopQueen[promoted] == true)   {
			pchar = 'b';
		}
		MvStr += pchar;
	}
	return MvStr;
}

// Prints the move list
function PrintMoveList() {
	var index;
	var move;
	var num = 1;
	console.log('MoveList:');

	// Loops through all of the moves and prints them
	for(index = Board.moveListStart[Board.ply]; index < Board.moveListStart[Board.ply+1]; ++index) {
		move = Board.moveList[index];
		console.log('Move:' + num + ':' + PrintMove(move));
		num++;
	}
}

// Function to detect the move made by the user
function ParseMove(from, to) {
	
	GenerateMoves();

	var Move = NOMOVE;
	var PromPce = PIECES.EMPTY;
	var found = false;

	// Loops through all of the possible moves at the current position
	for(var index = Board.moveListStart[Board.ply]; index < Board.moveListStart[Board.ply + 1]; ++index) {
		Move = Board.moveList[index];
		// Checks if the move the user made is one of the possible moves or not
		if(FROMSQ(Move) == from && TOSQ(Move) == to) {
			PromPce = PROMOTED(Move);
			// Checks if the move was a promoting move
			if(PromPce != PIECES.EMPTY) {
				// Checks if the promotion was to a queen or not
				if((PromPce == PIECES.wQ && Board.side == COLOURS.WHITE) || (PromPce == PIECES.bQ && Board.side == COLOURS.BLACK)); {
					found = true;
					break;
				}
			}
			found = true;
			break;
		}
	}

	// Checks if it is a legal move or not
	if(found != false) {
		if(MakeMove(Move) == false) {
			return NOMOVE;
		}
		TakeMove();
		return Move;
	}

	return NOMOVE;
}
