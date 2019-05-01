var perft_leafNodes;

// Recursive Perft function
function Perft(depth) { 	

	// Base case
	if(depth == 0) {
        perft_leafNodes++;
        return;
    }	
	
	var index;
	var move;

	GenerateMoves();

	// Loops through the move list generated with GenerateMoves()
	for(index = Board.moveListStart[Board.ply]; index < Board.moveListStart[Board.ply + 1]; ++index) {
	
		move = Board.moveList[index];	
		// Continue and dont do anything if the move is illegal
		if(MakeMove(move) == false) {
			continue;
		}
		// Recursive call of the function
		Perft(depth-1);
		TakeMove();
	} 
    
    return;
} 

// Function which starts the perft test and helps with debugging
function PerftTest(depth) {    

	PrintBoard();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;

	GenerateMoves();

	var index;
	var move;
	var moveNum = 0;
	
	// Loops through all possible moves
	for(index = Board.moveListStart[Board.ply]; index < Board.moveListStart[Board.ply + 1]; ++index) {
	
		move = Board.moveList[index];
		// Continue and print the result if the move is illegal
		if(MakeMove(move) == false) {
			continue;
		}
		moveNum++;
		var cumnodes = perft_leafNodes;
		// Call of the recursive Perft function
		Perft(depth-1);
		TakeMove();

		// Prints out how many nodes were visited fro each possible move
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + PrintMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");
}