// Character strings to make things easier to print
var PceName = [".", "pawn", "knight", "bishop", "rook", "queen", "king", "pawn", "knight", "bishop", "rook", "queen", "king"];
var PceChar = ".PNBRQKpnbrqk";
var SideChar = "wb-";
var RankChar = "12345678";
var FileChar = "abcdefgh";

// Number representation of each piece
var PIECES =  { EMPTY : 0, wP : 1, wN : 2, wB : 3,wR : 4, wQ : 5, wK : 6, bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12  };

var BRD_SQ_NUM = 120; // Number of squares on the board

// Number representation of each file
var FILES =  { FILE_A:0, FILE_B:1, FILE_C:2, FILE_D:3, FILE_E:4, FILE_F:5, FILE_G:6, FILE_H:7, FILE_NONE:8 };
 // Number representation of each rank
var RANKS =  { RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3, RANK_5:4, RANK_6:5, RANK_7:6, RANK_8:7, RANK_NONE:8 };

var COLOURS = { WHITE:0, BLACK:1, BOTH:2 }; // Number representation for the colours

var CASTLEBIT = { WKCA:1, WQCA:2, BKCA:4, BQCA:8 }; // Values for castling permissions

// Important Squares (Castling)
var SQUARES = {
    A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
    A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, 
    NO_SQ:99, OFFBOARD:100
}; // Array of important squares 

// Maximum values for amount of moves in one game, amount of moves for one position, 
// the max depth at which the engine will search to and an infinite value and a mate value which is in the range of the infinite value 
// and the amount of entries we will have in pvtable
var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 64;
var INFINITE = 30000;
var MATE = 29000;
var PVENTRIES = 10000;

// Arrays for both files boards and ranks boards
var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

// Starting FEN string
var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Function to convert the files and ranks into the correct coordinates for the board
function FR2SQ(f,r) {
    return ( (21 + (f) ) + ( (r) * 10 ) );
}

// (empty, white pawn, white knight, white bishop, white rook, white queen, white king,
// black pawn, black knight, black bishop, blackt rook, black queen, black king)

// Array to show if a piece is a big piece(non pawn)
var PieceBig = [ false, false, true, true, true, true, true, false, true, true, true, true, true ]; 
// Array to show if a piece is a major piece(Queen, Rook or King)
var PieceMaj = [ false, false, false, false, true, true, true, false, false, false, true, true, true ]; 
// Array to show if a piece is a minor piece(Bishop or Knight)
var PieceMin = [ false, false, true, true, false, false, false, false, true, true, false, false, false ]; 
// Piece value for each piece
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ]; 
// Index of the pieces colour
var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
                 COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ]; 

// Array to show if the piece is a pawn
var PiecePawn = [ false, true, false, false, false, false, false, true, false, false, false, false, false ];
// Array to show if the piece is a knight 
var PieceKnight = [ false, false, true, false, false, false, false, false, true, false, false, false, false ]; 
// Array to show if the piece is a king
var PieceKing = [ false, false, false, false, false, false, true, false, false, false, false, false, true ]; 
// Array to show if the piece is a rook or a queen
var PieceRookQueen = [ false, false, false, false, true, true, false, false, false, false, true, true, false ]; 
// Array to show if the piece is a pawn bishop or a queen
var PieceBishopQueen = [ false, false, false, true, false, true, false, false, false, true, false, true, false ];
// Array to show if the piece slides or not 
var PieceSlides = [ false, false, false, true, true, true, false, false, false, true, true, true, false ]; 

var KnDir = [ -8, -19,	-21, -12, 8, 19, 21, 12 ]; // Array for the knight directions
var RkDir = [ -1, -10,	1, 10 ]; // Array for the rook directions
var BiDir = [ -9, -11, 11, 9 ]; // Array for the bishop directions
var KiDir = [ -1, -10,	1, 10, -9, -11, 11, 9 ]; // Array for the king directions


var DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8]; // Array of how many times we have to loop through each pieces moves
var PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0]; // Array where each piece can move ()

// Arrays to loop through when generating non slide moves
var LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN,  PIECES.bK, 0];
var LoopNonSlideIndex = [0, 3];

// Arrays to loop through when generating slide moves
var LoopSlidePce = [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB,  PIECES.bR, PIECES.bQ, 0];
var LoopSlideIndex = [0, 4];

var PieceKeys = new Array(14 * 120); // Unique index for each piece and square
var SideKey; // xor in or out
var CastleKeys = new Array(16); // Unique index for each castle key

// Variable definitions for changing between the two arrays
var Sq120ToSq64 = new Array(BRD_SQ_NUM);
var Sq64ToSq120 = new Array(64);

// Function to generate a random number
function RAND_32() {
    return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16) 
    | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);
}

// Array of the mirrored 64 square board
var Mirror64 = [56	,	57	,	58	,	59	,	60	,	61	,	62	,	63	,
                48	,	49	,	50	,	51	,	52	,	53	,	54	,	55	,
                40	,	41	,	42	,	43	,	44	,	45	,	46	,	47	,
                32	,	33	,	34	,	35	,	36	,	37	,	38	,	39	,
                24	,	25	,	26	,	27	,	28	,	29	,	30	,	31	,
                16	,	17	,	18	,	19	,	20	,	21	,	22	,	23	,
                8	,	9	,	10	,	11	,	12	,	13	,	14	,	15	,
                0	,	1	,	2	,	3	,	4	,	5	,	6	,	7];

// Function to return the position of the square on the mirrored 64 square board
function MIRROR64(sq) {
    return Mirror64[sq];
}

// Functions to interchange between the two values in the arrays
function SQ64(sq120) {
    return Sq120ToSq64[(sq120)];
}

function SQ120(sq64) {
    return Sq64ToSq120[(sq64)];
}

function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var Kings = [PIECES.wK, PIECES.bK];
var CastlePerm = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15
];

/*

0000 0000 0000 0000 0000 0111 1111 -> From: bitwiseAnd 0x7F
0000 0000 0000 0011 1111 1000 0000 -> To: shift 7 bits to the right, bitwiseAnd 0x7F
0000 0000 0011 1100 0000 0000 0000 -> Capture: shift 14 bits to the right, bitwiseAnd 0xF
0000 0000 0100 0000 0000 0000 0000 -> EP: bitwiseAnd 0x40000
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start: bitwiseAnd 0x80000
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece: shift 20 bits to the right, bitwiseAnd 0xF
0001 0000 0000 0000 0000 0000 0000 -> Castle: bitwiseAnd 0x1000000

*/

function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m) { return ( (m >> 7) & 0x7F); }
function CAPTURED(m) { return ( (m >> 14) & 0xF); }
function PROMOTED(m) { return ( (m >> 20) & 0xF); }

// Move flags
var MOVEFLAGEP = 0x40000; // En passant
var MOVEFLAGPS = 0x80000; // Pawn start
var MOVEFLAGCA = 0x1000000; // Castling

var MOVEFLAGCAP = 0x7C000; // Captured
var MOVEFLAGPROM = 0xF00000; // Promoted piece

var NOMOVE = 0;

// Checks if a square is off the board
function SQOFFBOARD(sq) {
    if(FilesBrd[sq]==SQUARES.OFFBOARD) return true;
    return false;
}

// Hashing functions
function HASH_PCE(pce, sq) {GameBoard.posKey ^= PieceKeys[(pce * 120) + sq];}
function HASH_CA() {GameBoard.posKey ^= CastleKeys[GameBoard.castlePerm];}
function HASH_SIDE() {GameBoard.posKey ^= SideKey;}
function HASH_EP() {GameBoard.posKey ^= PieceKeys[GameBoard.enPas];}

// GameController variables for engine side
var GameController = {};
GameController.GameOver = false;

// User Move variables
var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;
UserMove.fromId;
UserMove.toId;

// Drag Images
bPImg = new Image();
bRImg = new Image();
bNImg = new Image();
bBImg = new Image();
bQImg = new Image();
bKImg = new Image();

wPImg = new Image();
wRImg = new Image();
wNImg = new Image();
wBImg = new Image();
wQImg = new Image();
wKImg = new Image();

bPImg.src = "Assets/PieceSVGs/bP.svg"
bRImg.src = "Assets/PieceSVGs/bR.svg"
bNImg.src = "Assets/PieceSVGs/bN.svg"
bBImg.src = "Assets/PieceSVGs/bB.svg"
bQImg.src = "Assets/PieceSVGs/bQ.svg"
bKImg.src = "Assets/PieceSVGs/bK.svg"

wPImg.src = "Assets/PieceSVGs/wP.svg"
wRImg.src = "Assets/PieceSVGs/wR.svg"
wNImg.src = "Assets/PieceSVGs/wN.svg"
wBImg.src = "Assets/PieceSVGs/wB.svg"
wQImg.src = "Assets/PieceSVGs/wQ.svg"
wKImg.src = "Assets/PieceSVGs/wK.svg"

// Puzzle FEN strings
mateIn2_1FEN = "r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 0";
mateIn2_2FEN = "r1b2k1r/ppp1bppp/8/1B1Q4/5q2/2P5/PPP2PPP/R3R1K1 w - - 1 0";
mateIn2_3FEN = "5rkr/pp2Rp2/1b1p1Pb1/3P2Q1/2n3P1/2p5/P4P2/4R1K1 w - - 1 0";

mateIn3_1FEN = "4r2k/4Q1bp/4B1p1/1q2n3/4pN2/P1B3P1/4pP1P/4R1K1 w - - 1 0";
mateIn3_2FEN = "1qr1k3/pb2p3/1p2N3/1NpPp3/8/7Q/PPP5/2K1R3 w - - 1 0";
mateIn3_3FEN = "r6k/pb4bp/5Q2/2p1Np2/1qB5/8/P4PPP/4RK2 w - - 1 0";

mateIn4_1FEN = "r7/p1n2p1R/qp1p1k2/3Pp3/bPp1P3/2P1BBN1/3Q2K1/8 w - - 1 0";
mateIn4_2FEN = "5rk1/pR4bp/6p1/6B1/5Q2/4P3/q2r1PPP/5RK1 w - - 1 0";
mateIn4_3FEN = "1r2r2k/1q1n1p1p/p1b1pp2/3pP3/1b5R/2N1BBQ1/1PP3PP/3R3K w - - 1 0";

