// Main Init
$(function() {
	init();
	// Sets up the board according to the FEN string stored in the puzzle variable in the url
	if (params.puzzle != null) {
		NewGame(params.puzzle);
	// If it is empty than the START_FEN FEN string is used to set up the board
    } else {
		NewGame(START_FEN);
	}
}); 
 
// Init of the files and ranks boards
function InitFilesRanksBrd() {

	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
    
    // For loop to set every square to the offboard value in both files and ranks boards
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		FilesBrd[index] = SQUARES.OFFBOARD;
		RanksBrd[index] = SQUARES.OFFBOARD;
	}
    
    // For loop to change the files to the correct values in the files board and to change the ranks to the correct values in the ranks board
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			FilesBrd[sq] = file;
			RanksBrd[sq] = rank;
		}
	}
}

// Filling up various arrays and variables using RAND_32()
function InitHashKeys(){

    var index = 0;

    for(index = 0; index < 14 * 120; ++index) {
        PieceKeys[index] = RAND_32();
    }

    SideKey = RAND_32();

    for(index = 0; index < 16; ++index) {
        CastleKeys[index] = RAND_32();
    }
}

// Function to help interchange between the 64 square board and the 120 square board array
function InitSq120To64() {

	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	var sq64 = 0;

	// For loops to reset the board
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;
	}

	for(index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}

	// Iterate through the squares to set up two arrays to interchange between 64 and 120 arrays
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}

}

// Function to initialise board variables
function InitBoardVars() {
	var index = 0;
	for(index = 0; index < MAXGAMEMOVES; ++index){
		GameBoard.history.push( {
			move: NOMOVE,
			castelPerm: 0,
			enPas: 0,
			fiftyMove: 0,
			posKey: 0
		});
	}

	for(index = 0; index < PVENTRIES; ++index) {
		GameBoard.PvTable.push({move : NOMOVE, posKey : 0});
	}
}

// Main init function
function init() {
    InitFilesRanksBrd();
	InitHashKeys();
	InitSq120To64();
	InitBoardVars();
}