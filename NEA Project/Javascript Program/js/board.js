// Function to get the index of piece
function PCEINDEX(pce,pceNum) {
    return (pce * 10 + pceNum);
} 

var Board = {};

Board.pieces = new Array(BRD_SQ_NUM); // Array of location of every piece
Board.side = COLOURS.WHITE; // Currect colour
Board.fiftyMove = 0; // Counter for the fifty move rule
Board.hisPly = 0; // Counter for every move made from the start
Board.history = [];
Board.ply = 0; // Counter for number of half moves made in the search tree
Board.enPas = 0; // Square set if a pawn advances 2 squares as its starting move (en Passant rule)
Board.castlePerm = 0; // Castling permission
Board.material = new Array(2); // White, Black material score of pieces
Board.pceNum = new Array(13); // index by Piece 
Board.pList = new Array(14*10); // Piece list
Board.posKey = 0; // Position Key

Board.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES); // Move list which is depth times maxpositionmoves
Board.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES); // Moves that are generate will be given a certain score
Board.moveListStart = new Array(MAXDEPTH); // Where the move list will actually start for a given depth

Board.PvTable = []; // Array for pv table
Board.PvArray = new Array(MAXDEPTH); // array will be filled up to maxdepth to show the best line which the engine is finding
Board.searchHistory = new Array( 14 * BRD_SQ_NUM); // Search history array
Board.searchKillers = new Array(3 * MAXDEPTH); // Search killers array

// Function to check the board for errors
function CheckBoard() {  
 
	var temp_pceNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var temp_material = [ 0, 0];
	var sq64, temp_piece, temp_pce_num, sq120;
    
    // For loop to loop through each piece type
	for(temp_piece = PIECES.wP; temp_piece <= PIECES.bK; ++temp_piece) {
        // Loops through each of the pieces of that type
		for(temp_pce_num = 0; temp_pce_num < Board.pceNum[temp_piece]; ++temp_pce_num) {
            sq120 = Board.pList[PCEINDEX(temp_piece,temp_pce_num)];
            // Checks if the result of getting the pce index is the same as the existing pce
			if(Board.pieces[sq120] != temp_piece) {
				console.log('Error Pce Lists');
				return false;
			}
		}	
	}
    
    // Loops through all the squares which are on the board
	for(sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
        temp_piece = Board.pieces[sq120];
        // Incrementing piece number for each piece which is found
        temp_pceNum[temp_piece]++;
        // Adding the piece value of the found piece to the material value of the correct colour
		temp_material[PieceCol[temp_piece]] += PieceVal[temp_piece];
	}
    
    // For loop to check if the temporary piece numbers match the Board piece numbers for each kind of piece
	for(temp_piece = PIECES.wP; temp_piece <= PIECES.bK; ++temp_piece) {
		if(temp_pceNum[temp_piece] != Board.pceNum[temp_piece]) {
				console.log('Error t_pceNum');
				return false;
			}	
	}
    
    // Checks if both the white and the black material values are the same for the Board values and the temporary values
	if(temp_material[COLOURS.WHITE] != Board.material[COLOURS.WHITE] || temp_material[COLOURS.BLACK] != Board.material[COLOURS.BLACK]) {
				console.log('Error t_material');
				return false;
	}	
    
    // Checks if there is an error in the Board.side
	if(Board.side != COLOURS.WHITE && Board.side != COLOURS.BLACK) {
				console.log('Error Board.side');
				return false;
	}
    
    // Checks if there is an error with the Board.posKey by freshly generating a hash key
	if(GeneratePosKey() != Board.posKey) {
				console.log('Error Board.posKey');
				return false;
	}	
	return true;
}


// Function to print the board
function PrintBoard() {

    var sq,file,rank,piece,line;

    console.log("\nGame Board:\n");

    // For loop to print out the board
    for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		line =(RankChar[rank] + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file,rank);
			piece = Board.pieces[sq];
			line += (" " + PceChar[piece] + " ");
		}
		console.log(line);
	}
	
	console.log("");
	line = "   ";
	for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
		line += (' ' + FileChar[file] + ' ');	
	}
    
    // Printing the side and the En Passant Square
	console.log(line);
	console.log("side:" + SideChar[Board.side] );
	console.log("enPas:" + Board.enPas);
	line = "";	
    
    // Printing the Castling permissions and the position key
	if(Board.castlePerm & CASTLEBIT.WKCA) line += 'K';
	if(Board.castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if(Board.castlePerm & CASTLEBIT.BKCA) line += 'k';
	if(Board.castlePerm & CASTLEBIT.BQCA) line += 'q';
	console.log("castle:" + line);
	console.log("key:" + Board.posKey.toString(16));
}


// Function to generate the position key
function GeneratePosKey() {

    var sq = 0;
    var finalKey = 0;
    var piece = PIECES.EMPTY;

    // Loops through all the squares on the board
    for(sq = 0; sq < BRD_SQ_NUM; ++sq) {
        piece = Board.pieces[sq];
        // If there is a piece on the board and it isnt off the board than it generate a key
        if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
            // Unique index for each unique piece and square combination
            finalKey ^= PieceKeys[(piece * 120) + sq];
        }
    }

    // If its whites turn we hash in the side key
    if(Board.side == COLOURS.WHITE) {
        finalKey ^= SideKey;
    }

    // If there is no en passant square isnt set than hash in the en passant square
    if(Board.enPas != SQUARES.NO_SQ) {
        finalKey ^= PieceKeys[Board.enPas];
    }

    // Hash in castling castling permission
    finalKey ^= CastleKeys[Board.castlePerm];

    return finalKey;
}

// Function to print the piece list
function PrintPieceLists() {

    var piece, pceNum;

    for(piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
        for(pceNum = 0; pceNum < Board.pceNum[piece]; ++pceNum) {
            console.log('Piece ' + PceChar[piece] + ' on ' + PrintSq(Board.pList[PCEINDEX(piece,pceNum)]));
        }
    }
}


// Function to update lists material
function UpdateListsMaterial() {

    var piece,sq,index,colour;

    // Sets all the pieces in the piece list to empty
    for(index = 0; index < 14 * 120; ++index) {
        Board.pList[index] = PIECES.EMPTY;
    }

    // Set the material to 0 for each square
    for(index = 0; index < 2; ++index) {
        Board.material[index] = 0;
    }

    // Set the number of pieces on the board to zero
    for(index = 0; index < 13; ++index) {
        Board.pceNum[index] = 0;
    }

    // For loop to loop thorugh each square of the board
    for(index = 0; index < 64; ++index) {
        sq = SQ120(index);
        piece = Board.pieces[sq];

        // If the piece isnt empty than incrament the material value for that particular value with that pieces value
        if(piece != PIECES.EMPTY) { 
            colour = PieceCol[piece];

            Board.material[colour] += PieceVal[piece];

            Board.pList[PCEINDEX(piece,Board.pceNum[piece])] = sq;
            Board.pceNum[piece]++;
        }
    }
}

// Function to reset the board
function ResetBoard() {

    var index = 0;

    // Set all indexes to OFFBOARD
    for(index = 0; index < BRD_SQ_NUM; ++index) {
        Board.pieces[index] = SQUARES.OFFBOARD;
    }

    // 64 square loop to set correct squares to empty and leave the OFFBOARD squares
    for(index = 0; index < 64; ++index) {
        Board.pieces[SQ120(index)] = PIECES.EMPTY;
    }


    Board.side = COLOURS.BOTH; // Setting colour to both so its nither blacks or whites turn
    Board.enPas = SQUARES.NO_SQ; // Setting En Passant square to no square
    Board.fiftyMove = 0; // Setting fifty move rule to 0
    Board.ply = 0; // Setting the number of halfmoves to 0
    Board.hisPly = 0; // Setting the history of moves to 0
    Board.castlePerm = 0; // Setting Castling permissions to 0
    Board.posKey = 0; // Setting position key to 0
    Board.moveListStart[Board.ply] = 0; // Setting the move list start to the beginning
}

// fen format => rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

// Function to set up board to the FEN string given
function ParseFen(fen) {
    if (fen == '') {
        return;
    }

    ResetBoard();

    var rank = RANKS.RANK_8;
    var file = FILES.FILE_A;
    var piece = 0;
    var count = 0;
    var i = 0;
    var sq120 = 0;
    var fenCnt = 0; // Index for the FEN string

    // Iterating through FEN string to add the pieces
    while((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
        count = 1;

        switch (fen[fenCnt]) {
            // Checking if we have a piece letter or a number
			case 'p': piece = PIECES.bP; break;
            case 'r': piece = PIECES.bR; break;
            case 'n': piece = PIECES.bN; break;
            case 'b': piece = PIECES.bB; break;
            case 'k': piece = PIECES.bK; break;
            case 'q': piece = PIECES.bQ; break;
            case 'P': piece = PIECES.wP; break;
            case 'R': piece = PIECES.wR; break;
            case 'N': piece = PIECES.wN; break;
            case 'B': piece = PIECES.wB; break;
            case 'K': piece = PIECES.wK; break;
            case 'Q': piece = PIECES.wQ; break;


            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIECES.EMPTY;
                // Changing string to intiger
                count = parseInt(fen[fenCnt], 10);
                break;
            
            
            case '/':
            case ' ':
                rank--;
                file = FILES.FILE_A;
                fenCnt++;
                continue;  
            default:
                console.log("FEN error");
                return;

		}
        
        // For loop to increment the file
		for (i = 0; i < count; i++) {	
			sq120 = FR2SQ(file,rank);            
            Board.pieces[sq120] = piece;
			file++;
        }
		fenCnt++;
    }

    // Setting the game side according to the FEN string
    Board.side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
    fenCnt += 2;

    // For loop to implement Castling rights according to FEN string
    for(i = 0; i < 4; i++) {
        // If it reaches a space than it breakes and moves on
        if(fen[fenCnt] == ' ') {
            break;
        }
        switch(fen[fenCnt]) {
            case 'K' : Board.castlePerm |= CASTLEBIT.WKCA; break;
            case 'Q' : Board.castlePerm |= CASTLEBIT.WQCA; break;
            case 'k' : Board.castlePerm |= CASTLEBIT.BKCA; break;
            case 'q' : Board.castlePerm |= CASTLEBIT.BQCA; break;
            default: break;
        }
        fenCnt++;
    }
    fenCnt =+ 2;

    // If it is not looking at a dash set the En Passant Square
    if (fen[fenCnt] != '-') {
        console.log(fen[fenCnt].charCodeAt(), 'a'.charCodeAt())
        file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
        rank = parseInt(fen[fenCnt+1], 10);
        console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);
        Board.enPas = FR2SQ(file,rank);
        fenCnt++;
    }

    fenCnt =+ 2;
    
    if (fen[fenCnt] != '-') {
        Board.fiftyMove = parseInt(fen[fenCnt], 10);
    }


    Board.posKey = GeneratePosKey();
    UpdateListsMaterial();

}

// Function to print a representation of the board where it shows which squares are being attacked with an X in the console
function PrintSqAttacked() {
	
	var sq,file,rank,piece;

	console.log("\nAttacked:\n");
    
    // for loop to check which squares are being attacked by the current moving side
	for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line =((rank+1) + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file,rank);
			if(SqAttacked(sq, Board.side) == true) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
	
	console.log("");
	
}

// Function to check if the square which is input is being attacked
function SqAttacked(sq, side) {
	var pce;
	var t_sq;
    var index;
    var dir;
    
    // if/else statement to check if a square is being attacked by a pawn
	if(side == COLOURS.WHITE) {
		if(Board.pieces[sq - 11] == PIECES.wP || Board.pieces[sq - 9] == PIECES.wP) {
			return true;
		}
	} else {
		if(Board.pieces[sq + 11] == PIECES.bP || Board.pieces[sq + 9] == PIECES.bP) {
			return true;
		}	
	}
    
    // for loop to check if a square is being attacked by a knight
	for(index = 0; index < 8; index++) {
		pce = Board.pieces[sq + KnDir[index]]; // looping through the array of possible moves for a knight
		if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKnight[pce] == true) {
			return true;
		}
	}
    
    // for loop to check if a square is being attacked by a rook or a queen
	for(index = 0; index < 4; ++index) {		
		dir = RkDir[index];
		t_sq = sq + dir;
		pce = Board.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceRookQueen[pce] == true && PieceCol[pce] == side) {
					return true;
				}
				break;
			}
			t_sq += dir;
			pce = Board.pieces[t_sq];
		}
	}
    
    // for loop to check if a square is being attacked by a bishop or a queen
	for(index = 0; index < 4; ++index) {		
		dir = BiDir[index];
		t_sq = sq + dir;
		pce = Board.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceBishopQueen[pce] == true && PieceCol[pce] == side) {
					return true;
				}
				break;
			}
			t_sq += dir;
			pce = Board.pieces[t_sq];
		}
	}
    
    // for loop to check if a square is being attacked by a king
	for(index = 0; index < 8; index++) {
		pce = Board.pieces[sq + KiDir[index]]; // looping through the array of possible moves for a king
		if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKing[pce] == true) {
			return true;
		}
	}
	
	return false;
	

}