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

    // Base case
    if(depth <= 0) {
        return EvalPosition();
    }

    // Checks if time is up
    if ((SearchController.nodes & 2047) == 0) {
        CheckUp();
    }

    SearchController.nodes++;

    // Checks for repetition
    if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
        return 0;
    }

    if(GameBoard.ply > MAXDEPTH - 1) {
        // Return Evaluate
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
        Score = -AlphaBeta(-beta, -alpha, depth-1); // Recursive call of the function

        TakeMove();

        // If statement to check if we have ran out of time
        if (SearchController.stop == true) {
            return 0
        }

        // If statement to check if we improved alpha
        if (Score > alpha) {
            if(Score >= beta) { // Check if we have a beta cut off
                if(Legal == 1) { // Statistics collection
                    SearchController.fhf++; // The more the better
                }
                SearchController.fh++; // fhf divided by fh tells us how often we get a beta cut off in the first move

                // Update killer moves

                return beta;
            }
            alpha = Score;
            BestMove = Move;
            // Update History Table
        }

	} 

    // Mate check (checking if legal = 0)

    if(alpha != OldAlpha) {
        // Store Principal Variation move
    }

    return alpha;
}

// Function to search for the best move
function SearchPosition() {

    var bestMove = NOMOVE;
    var bestScore = -INFINITE;
    var currentDepth = 0;

    // Iterative deepening
    for(currentDepth = 1; currentDepth <= SearchController.depth; ++currentDepth) {

        // Alpha Beta algorithm

        // If statement to stop if we are out of time
        if(SearchController.stop == true) {
            break;
        }

    }

    SearchController.best = bestMove;
    SearchController.thinking = false;

}
