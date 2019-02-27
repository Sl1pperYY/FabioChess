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




