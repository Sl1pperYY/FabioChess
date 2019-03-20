var SearchController = {};

SearchController.nodes; // Nodes counter
SearchController.fh; // Fail high
SearchController.fhf; // Fail high first
SearchController.depth; // Depth of search
SearchController.time; // Timer
SearchController.start; // Time when started
SearchController.stop; // Boolean to see if it is stoped or not
SearchController.best; // Best move from last completed depth
SearchController.thinking; // Flag to check if the engine is thinking or not

function PickNextMove(MoveNum) {

	var index = 0;
	var bestScore = -1;
	var bestNum = MoveNum;
	
	for(index = MoveNum; index < GameBoard.moveListStart[GameBoard.ply+1]; ++index) {
		if(GameBoard.moveScores[index] > bestScore) {
			bestScore = GameBoard.moveScores[index];
			bestNum = index;			
		}
	} 
	
	if(bestNum != MoveNum) {
		var temp = 0;
		temp = GameBoard.moveScores[MoveNum];
		GameBoard.moveScores[MoveNum] = GameBoard.moveScores[bestNum];
		GameBoard.moveScores[bestNum] = temp;
		
		temp = GameBoard.moveList[MoveNum];
		GameBoard.moveList[MoveNum] = GameBoard.moveList[bestNum];
		GameBoard.moveList[bestNum] = temp;
	}

}

// Function to clear the PvTable
function ClearPvTable() {
	for(var index = 0; index < PVENTRIES; index++) {
			GameBoard.PvTable[index].move = NOMOVE;
			GameBoard.PvTable[index].posKey = 0;	
	}
}

// Function to check for a timeout
function CheckUp() {
    if (( $.now() -SearchController.start) > SearchController.time) {
        SearchController.stop == true;
    }
}

// Checks for repetition of moves
function IsRepetition() {
    var index = 0;

    for(index = GameBoard.hisPly - GameBoard.fiftyMove; index < GameBoard.hisPly - 1; ++index) {
        if(GameBoard.posKey == GameBoard.history[index].posKey) {
            return true;
        }
    }
    return false;
}

// Alpha beta function
function AlphaBeta(alpha, beta, depth) {

    SearchController.nodes++;
    // Base case
    if(depth <= 0) {
        return EvalPosition();
    }

    // Checks if time is up
    if ((SearchController.nodes & 2047) == 0) {
        CheckUp();
    }

    // Checks for repetition
    if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
        return 0;
    }

    if(GameBoard.ply > MAXDEPTH - 1) {
        return EvalPosition();
    }


    // Checking if we are in check
    var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side],0)], GameBoard.side^1);
    if(InCheck == true) {
        depth++;
    }

    

    var Score = -INFINITE;

    

    GenerateMoves();

    var MoveNum = 0;
    var Legal = 0; // Amount of legal moves made in current position
    var OldAlpha = alpha; // We can check if OldAlpha == to alpha than no new best move found
    var BestMove = NOMOVE;
    var Move = NOMOVE; // Current move being made

    // Get Principal Variation move
    // Order Principal Variation move
    
    for(MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {

        // Pick next best move
        
		Move = GameBoard.moveList[MoveNum];	
		if(MakeMove(Move) == false) {
			continue;
        }
        

        Legal++; // Adding on 1 to legal because we have found a legal move
        Score = AlphaBeta(-beta, -alpha, depth-1); // Recursive call of the function
        console.log(Score);

        TakeMove();

        // If statement to check if we have ran out of time
        if (SearchController.stop == true) {
            return 0;
        }

        // If statement to check if we improved alpha
        if (Score > alpha) {
            if(Score >= beta) { // Check if we have a beta cut off
                if(Legal == 1) { // Statistics collection
                    SearchController.fhf++; // The more the better
                }
                SearchController.fh++; // fhf divided by fh tells us how often we get a beta cut off in the first move
                // Update killer moves	
                console.log(beta);		
				return beta;
            }
            // Update History table
            alpha = Score;
            BestMove = Move;
        }

	} 

    // Mate check
    if(Legal == 0) {
		if(InCheck == true) {
			return -MATE + GameBoard.ply;
		} else {
			return 0;
		}
    }
    
    if(alpha != OldAlpha) {
        StorePvMove(BestMove);
    }

    console.log(alpha);	
    return alpha;
}

// Function to clear everything for a new search
function ClearForSearch() {

	var index = 0;
    
    // Clearing search history array
	for(index = 0; index < 14 * BRD_SQ_NUM; ++index) {				
		GameBoard.searchHistory[index] = 0;	
	}
    
    // Clearing search killers array
	for(index = 0; index < 3 * MAXDEPTH; ++index) {
		GameBoard.searchKillers[index] = 0;
	}	
	
	ClearPvTable();
	GameBoard.ply = 0;
	SearchController.nodes = 0;
	SearchController.fh = 0;
	SearchController.fhf = 0;
	SearchController.start = $.now();
	SearchController.stop = false;
}

// Function to search for the best move
function SearchPosition() {

	var bestMove = NOMOVE;
	var bestScore = -INFINITE;
	var currentDepth = 0;
	var line;
	var PvNum;
	var c;

    ClearForSearch();

    // Iterative deepening
    for(currentDepth = 1; currentDepth <= /*SearchController.depth*/ 2; ++currentDepth) {

        // Alpha Beta algorithm
        bestScore = AlphaBeta(-INFINITE, INFINITE, currentDepth);

        // If statement to stop if we are out of time
        if(SearchController.stop == true) {
            break;
        }

        bestMove = ProbePvTable();
        line = 'Depth:' + currentDepth + ' Best:' + PrMove(bestMove) + ' Score:' + bestScore + ' nodes:' + SearchController.nodes;

        PvNum = GetPvLine(currentDepth);
		line += ' Pv:';
		for( c = 0; c < PvNum; ++c) {
			line += ' ' + PrMove(GameBoard.PvArray[c]);
		}

        console.log(line);
    }
    SearchController.best = bestMove;
    SearchController.thinking = false;
}