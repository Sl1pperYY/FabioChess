var perft_leafNodes;

function Perft(depth) { 	

	console.log(10);
	if(depth == 0) {
		console.log(11);
        perft_leafNodes++;
        return;
    }	
	
	console.log(13);
	var index;
	var move;
	
	GenerateMoves();
	console.log("GameBoard.moveListStart[GameBoard.ply] " + GameBoard.moveListStart[GameBoard.ply]);
	console.log("GameBoard.moveListStart[GameBoard.ply + 1] " + GameBoard.moveListStart[GameBoard.ply+1]);

	console.log(14);
	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		console.log(20+index);
		move = GameBoard.moveList[index];
		console.log(21+index);	
		if(MakeMove(move) == false) {
			console.log(22+index);
			continue;
		}
		console.log(23+index);		
		Perft(depth-1);
		console.log(24+index);
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
	
		console.log(index+1);
		move = GameBoard.moveList[index];
		console.log(index);	
		if(MakeMove(move) == false) {
			console.log(index+2);
			continue;
		}
		console.log(index+3);	
		moveNum++;
		console.log(index+4);	
		var cumnodes = perft_leafNodes;
		console.log(index+5);
		Perft(depth-1);
		console.log(index+6);
		TakeMove();
		console.log(index+7);
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");      

    return;

}