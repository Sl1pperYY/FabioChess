// Function to get the index of piece
function PCEINDEX(pce,pceNum) {
    return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM); // Array of location of every piece
GameBoard.side = COLOURS.WHITE; // Currect colour
GameBoard.fiftyMove = 0; // Counter for the fifty move rule
GameBoard.hisPly = 0; // Counter for every move made from the start
GameBoard.ply = 0; // Counter for number of half moves made in the search tree
GameBoard.enPas = 0; // Square set if a pawn advances 2 squares as its starting move (en Passant rule)
GameBoard.castlePerm = 0; // Castling permission
GameBoard.material = new Array(2); //WHITE,Black material of pieces
GameBoard.pceNum = new Array(13); // index by Piece
GameBoard.pList = new Array(14*10); // Piece list
GameBoard.posKey = 0; // Position Key

GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES); // Move list which is depth times maxpositionmoves
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES); // Moves that are generate will be given a certain score
GameBoard.moveListStart = new Array(MAXDEPTH); // Where the move list will actually start for a given depth

function CheckBoard() {   
 
	var t_pceNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var t_material = [ 0, 0];
	var sq64, t_piece, t_pce_num, sq120, colour, pcount;
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for(t_pce_num = 0; t_pce_num < GameBoard.pceNum[t_piece]; ++t_pce_num) {
			sq120 = GameBoard.pList[PCEINDEX(t_piece,t_pce_num)];
			if(GameBoard.pieces[sq120] != t_piece) {
				console.log('Error Pce Lists');
				return false;
			}
		}	
	}
	
	for(sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		t_piece = GameBoard.pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		if(t_pceNum[t_piece] != GameBoard.pceNum[t_piece]) {
				console.log('Error t_pceNum');
				return false;
			}	
	}
	
	if(t_material[COLOURS.WHITE] != GameBoard.material[COLOURS.WHITE] ||
			 t_material[COLOURS.BLACK] != GameBoard.material[COLOURS.BLACK]) {
				console.log('Error t_material');
				return false;
	}	
	
	if(GameBoard.side!=COLOURS.WHITE && GameBoard.side!=COLOURS.BLACK) {
				console.log('Error GameBoard.side');
				return false;
	}
	
	if(GeneratePosKey()!=GameBoard.posKey) {
				console.log('Error GameBoard.posKey');
				return false;
	}	
	return true;
}


// Function to print the board
function PrintBoard() {

    var sq,file,rank,piece;

    console.log("\nGame Board:\n");

    // For loop to print out the board
    for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line =(RankChar[rank] + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file,rank);
			piece = GameBoard.pieces[sq];
			line += (" " + PceChar[piece] + " ");
		}
		console.log(line);
	}
	
	console.log("");
	var line = "   ";
	for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
		line += (' ' + FileChar[file] + ' ');	
	}
    
    // Printing the side and the En Passant Square
	console.log(line);
	console.log("side:" + SideChar[GameBoard.side] );
	console.log("enPas:" + GameBoard.enPas);
	line = "";	
    
    // Printing the Castling permissions and the position key
	if(GameBoard.castlePerm & CASTLEBIT.WKCA) line += 'K';
	if(GameBoard.castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if(GameBoard.castlePerm & CASTLEBIT.BKCA) line += 'k';
	if(GameBoard.castlePerm & CASTLEBIT.BQCA) line += 'q';
	console.log("castle:" + line);
	console.log("key:" + GameBoard.posKey.toString(16));
}



function GeneratePosKey() {

    var sq = 0;
    var finalKey = 0;
    var piece = PIECES.EMPTY;

    
    for(sq = 0; sq < BRD_SQ_NUM; ++sq) {
        piece = GameBoard.pieces[sq];
        if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
            finalKey ^= PieceKeys[(piece * 120) + sq]; // unique index for each unique piece and square combination
        }
    }

    // If its whites turn we hash in the side key
    if(GameBoard.side == COLOURS.WHITE) {
        finalKey ^= SideKey;
    }

    // if en passant square isnt set than hash in the en passant square
    if(GameBoard.enPas != SQUARES.NO_SQ) {
        finalKey ^= PieceKeys[GameBoard.enPas];
    }

    // hash in castling castling permission
    finalKey ^= CastleKeys[GameBoard.castlePerm];

    return finalKey;
}

function PrintPieceLists() {

    var piece, pceNum;

    for(piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
        for(pceNum = 0; pceNum < GameBoard.pceNum[piece]; ++pceNum) {
            console.log('Piece ' + PceChar[piece] + ' on ' + PrSq(GameBoard.pList[PCEINDEX(piece,pceNum)]))
        }
    }
}



function UpdateListsMaterial() {

    var piece,sq,index,colour;

    // Sets all the pieces in the piece list to empty
    for(index = 0; index < 14 * 120; ++index) {
        GameBoard.pList[index] = PIECES.EMPTY;
    }

    // Set the material to 0 for each square
    for(index = 0; index < 2; ++index) {
        GameBoard.material[index] = 0;
    }

    // Set the number of pieces on the board to zero
    for(index = 0; index < 13; ++index) {
        GameBoard.pceNum[index] = 0;
    }

    // For loop to loop thorugh each square of the board
    for(index = 0; index < 64; ++index) {
        sq = SQ120(index);
        piece = GameBoard.pieces[sq];

        // If the piece isnt emtpy than incrament the material value for that particular value with that pieces value
        if(piece != PIECES.EMPTY) { 
            // console.log('piece ' + piece + ' on ' + sq);
            colour = PieceCol[piece];

            GameBoard.material[colour] += PieceVal[piece];

            GameBoard.pList[PCEINDEX(piece,GameBoard.pceNum[piece])] = sq;
            GameBoard.pceNum[piece]++;
        }
    }
    PrintPieceLists();
}

function ResetBoard() {

    var index = 0

    // Set all indexes to OFFBOARD
    for(index = 0; index < BRD_SQ_NUM; ++index) {
        GameBoard.pieces[index] = SQUARES.OFFBOARD;
    }

    // 64 square loop to set correct squares to empty and leave the OFFBOARD squares
    for(index = 0; index < 64; ++index) {
        GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
    }


    GameBoard.side = COLOURS.BOTH; // Setting colour to both so its nither blacks or whites turn
    GameBoard.enPas = SQUARES.NO_SQ; // Setting En Passant square to no square
    GameBoard.fiftyMove = 0; // Setting fifty move rule to 0
    GameBoard.ply = 0; // Setting the number of halfmoves to 0
    GameBoard.hisPly = 0; // Setting the history of moves to 0
    GameBoard.castlePerm = 0; // Setting Castling permissions to 0
    GameBoard.posKey = 0; // Setting position key to 0
    GameBoard.moveListStart[GameBoard.ply] = 0; // Setting the move list start to the beginning
}

// fen format => rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

// Function to set up board to the FEN string given
function ParseFen(fen) {
    console.log('ParseFen() called')

    ResetBoard();

    var rank = RANKS.RANK_8;
    var file = FILES.FILE_A;
    var piece = 0;
    var count = 0;
    var i = 0;
    var sq120 = 0;
    var fenCnt = 0; // Index for the FEN string

    // Iterating through FEN string
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
            GameBoard.pieces[sq120] = piece;
			file++;
        }
		fenCnt++;
    }

    // Setting the game side according to the FEN string
    GameBoard.side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
    fenCnt += 2;

    // For loop to implement Castling rights according to FEN string
    for(i = 0; i < 4; i++) {
        // If we reach a space than it breakes and moves on
        if(fen[fenCnt] == ' ') {
            break;
        }
        switch(fen[fenCnt]) {
            case 'K' : GameBoard.castlePerm |= CASTLEBIT.WKCA; break;
            case 'Q' : GameBoard.castlePerm |= CASTLEBIT.WQCA; break;
            case 'k' : GameBoard.castlePerm |= CASTLEBIT.BKCA; break;
            case 'q' : GameBoard.castlePerm |= CASTLEBIT.BQCA; break;
            default: break;
        }
        fenCnt++;
    }
    fenCnt++;

    // If we are not looking at a dash set the En Passant Square
    if (fen[fenCnt] != '-') {
        file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
        rank = parseInt(fen[fenCnt], 10);
        console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);
        GameBoard.enPas = FR2SQ(file,rank);
    }

    GameBoard.posKey = GeneratePosKey();
    UpdateListsMaterial();
    SqAttacked(21, 0);
    PrintSqAttacked();

}

function PrintSqAttacked() {
	
	var sq,file,rank,piece;

	console.log("\nAttacked:\n");
    
    // for loop to check which squares are being attacked by the current moving side
	for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line =((rank+1) + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file,rank);
			if(SqAttacked(sq, GameBoard.side) == true) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
	
	console.log("");
	
}

function SqAttacked(sq, side) {
	var pce;
	var t_sq;
	var index;
    
    // if/else statement to check if a square is being attacked by a pawn
	if(side == COLOURS.WHITE) {
		if(GameBoard.pieces[sq - 11] == PIECES.wP || GameBoard.pieces[sq - 9] == PIECES.wP) {
			return true;
		}
	} else {
		if(GameBoard.pieces[sq + 11] == PIECES.bP || GameBoard.pieces[sq + 9] == PIECES.bP) {
			return true;
		}	
	}
    
    // for loop to check if a square is being attacked by a knight
	for(index = 0; index < 8; index++) {
		pce = GameBoard.pieces[sq + KnDir[index]]; // looping through the array of possible moves for a knight
		if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKnight[pce] == true) {
			return true;
		}
	}
    
    // for loop to check if a square is being attacked by a rook or a queen
	for(index = 0; index < 4; ++index) {		
		dir = RkDir[index];
		t_sq = sq + dir;
		pce = GameBoard.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceRookQueen[pce] == true && PieceCol[pce] == side) {
					return true;
				}
				break;
			}
			t_sq += dir;
			pce = GameBoard.pieces[t_sq];
		}
	}
    
    // for loop to check if a square is being attacked by a bishop or a queen
	for(index = 0; index < 4; ++index) {		
		dir = BiDir[index];
		t_sq = sq + dir;
		pce = GameBoard.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceBishopQueen[pce] == true && PieceCol[pce] == side) {
					return true;
				}
				break;
			}
			t_sq += dir;
			pce = GameBoard.pieces[t_sq];
		}
	}
    
    // for loop to check if a square is being attacked by a king
	for(index = 0; index < 8; index++) {
		pce = GameBoard.pieces[sq + KiDir[index]]; // looping through the array of possible moves for a king
		if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKing[pce] == true) {
			return true;
		}
	}
	
	return false;
	

}



