// Main Init
$(function() {
    init();
    console.log("Main Init Called"); // Check to see if it is called
});

// Init of the files and ranks boards
function InitFilesRanksBrd() {
    console.log('InitFilesRanksBrd() called')

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
    
    // Check
	console.log("FilesBrd[0]:" + FilesBrd[0] + " RanksBrd[0]:" + RanksBrd[0]);
	console.log("FilesBrd[SQUARES.A1]:" + FilesBrd[SQUARES.A1] + " RanksBrd[SQUARES.A1]:" + RanksBrd[SQUARES.A1]);
	console.log("FilesBrd[SQUARES.E8]:" + FilesBrd[SQUARES.E8] + " RanksBrd[SQUARES.E8]:" + RanksBrd[SQUARES.E8]);

}

// Filling up various arrays and variables using RAND_32()
function InitHashKeys(){
    console.log('InitHashKeys() called')

    var index = 0

    for(index = 0; index < 14 * 120; ++index) {
        PieceKeys[index] = RAND_32();
    }

    SideKey = RAND_32();

    for(index = 0; index < 16; ++index) {
        CastleKeys[index] = RAND_32();
    }
}

function init() {
	console.log("init() called"); // Check to see if it is called
    InitFilesRanksBrd();
    InitHashKeys()
};