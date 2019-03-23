
// Function to return a square string
function PrSq(sq) {
    return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]]);
}

function PrMove(move) {
	var MvStr;
	
	var ff = FilesBrd[FROMSQ(move)];
	var rf = RanksBrd[FROMSQ(move)];
	var ft = FilesBrd[TOSQ(move)];
	var rt = RanksBrd[TOSQ(move)];
	
	MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];
	
    var promoted = PROMOTED(move);
	
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

function PrintMoveList() {
	var index;
	var move;
	var num = 1;
	console.log('MoveList:');

	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply+1]; ++index) {
		move = GameBoard.moveList[index];
		console.log('Move:' + num + ':' + PrMove(move));
		num++;
	}
}

// Function to check if it is a legal move or not
function ParseMove(from, to) {
	
	GenerateMoves();

	var Move = NOMOVE;
	var PromPce = PIECES.EMPTY;
	var found = false;

	for(var index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
		Move = GameBoard.moveList[index];
		if(FROMSQ(Move) == from && TOSQ(Move) == to) {
			PromPce = PROMOTED(Move);
			if(PromPce != PIECES.EMPTY) {
				if((PromPce == PIECES.wQ && GameBoard.side == COLOURS.WHITE) || (PromPce == PIECES.bQ && GameBoard.side == COLOURS.BLACK)); {
					found = true;
					break;
				}
				continue;
			}
			found = true;
			break;
		}
	}

	if(found != false) {
		if(MakeMove(Move) == false) {
			return NOMOVE;
		}
		TakeMove();
		return Move;
	}

	return NOMOVE;
}
