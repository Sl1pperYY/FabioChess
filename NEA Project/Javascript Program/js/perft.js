var perft_leafNodes;

function Perft(depth) { 	

	if(depth == 0) {
        perft_leafNodes++;
        return;
    }	
	
	var index;
	var move;

	GenerateMoves();

	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		move = GameBoard.moveList[index];	
		if(MakeMove(move) == false) {
			continue;
		}		
		Perft(depth-1);
		TakeMove();
	} 
    
    return;
}

function PerftTest(depth) {    

	PrintBoard();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;

	GenerateMoves();

	console.log("GameBoard.moveListStart[GameBoard.ply] " + GameBoard.moveListStart[GameBoard.ply]);
	console.log("GameBoard.moveListStart[GameBoard.ply + 1] " + GameBoard.moveListStart[GameBoard.ply+1]);

	var index;
	var move;
	var moveNum = 0;
	
	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		move = GameBoard.moveList[index];
		if(MakeMove(move) == false) {
			continue;
		}
		moveNum++;
		var cumnodes = perft_leafNodes;
		Perft(depth-1);
		TakeMove();
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");      

    return;

}