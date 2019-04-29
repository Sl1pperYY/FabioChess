// Function to fill up the PvArray
function GetPvLine(depth) {
	
	var move = ProbePvTable();
	var count = 0;
	
	// While loop to ProbePvTable untill we reached the current depth or we reached a move which doesnt exist in the current position
	while(move != NOMOVE && count < depth) {
	
		// If the move exists make that move on the board and increment the count and get the next move from the table
		if( MoveExists(move) == true) {
			MakeMove(move);
			Board.PvArray[count++] = move;			
		} else {
			break;
		}		
		move = ProbePvTable();
	}
	
	// Take back all of the moves made above
	while(Board.ply > 0) {
		TakeMove();
	}
	return count;
}

// Function to Probe PvMove
function ProbePvTable() {
	var index = Board.posKey % PVENTRIES;
	
	// If the position key is the same in the PvTable and the Board then return the move string of the index in the PvTable
	if(Board.PvTable[index].posKey == Board.posKey) {
		return Board.PvTable[index].move;
	}
	
	return NOMOVE;
}
 
// Function to Store PvMove
function StorePvMove(move) {
	var index = Board.posKey % PVENTRIES;
	// Overwrites the position key in the index of the PvTable and the move string in the index of the PvTable
	Board.PvTable[index].posKey = Board.posKey;
	Board.PvTable[index].move = move;
} 