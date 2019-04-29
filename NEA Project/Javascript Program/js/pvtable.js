function GetPvLine(depth) {
	
	var move = ProbePvTable();
	var count = 0;
	
	while(move != NOMOVE && count < depth) {
	
		if( MoveExists(move) == true) {
			MakeMove(move);
			GameBoard.PvArray[count++] = move;			
		} else {
			break;
		}		
		move = ProbePvTable();
	}
	
	while(GameBoard.ply > 0) {
		TakeMove();
	}
	
	return count;
	
}

// Function to Probe PvMove
function ProbePvTable() {
	var index = GameBoard.posKey % PVENTRIES;
	
	if(GameBoard.PvTable[index].posKey == GameBoard.posKey) {
		return GameBoard.PvTable[index].move;
	}
	
	return NOMOVE;
}

// Function to Store PvMove
function StorePvMove(move) {
	var index = GameBoard.posKey % PVENTRIES;
	GameBoard.PvTable[index].posKey = GameBoard.posKey;
	GameBoard.PvTable[index].move = move;
} 