function ClearPiece(sq) {

    var pce = GameBoard.pieces[sq];
    var col = PieceCol[pce];
    var index;
    var t_pceNum = -1;

    HASH_PCE(pce, sq);

    GameBoard.pieces[sq] = PIECES.EMPTY;
    GameBoard.material[col] -= PieceVal[pce];

    for(index = 0; index < GameBoard.pceNum[pce]; ++index) {
        if(GameBoard.pList[PCEINDEX(pce,index)] == sq) {
            t_pceNum = index;
            break;
        }
    }

    GameBoard.pceNum[pce]--;
    GameBoard.pList[PCEINDEX(pce, t_pceNum)] = GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])];
}

function AddPiece(sq, pce) {

    var col = PieceCol[pce];

    HASH_PCE(pce,sq);

    GameBoard.pieces[sq] = pce;
    GameBoard.material[col] += PieceVal[pce];
    GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq;
    GameBoard.pceNum[pce]++;
}

function MovePiece(from, to) {

    var index = 0;
    var pce = GameBoard.pieces[from];

    HASH_PCE(pce, from);
    GameBoard.pieces[from] = PIECES.EMPTY;

    HASH_PCE(pce,to);
    GameBoard.pieces[to] = pce;

    for(index = 0; index < GameBoard.pceNum[pce]; ++index) {
        if(GameBoard.pList[PCEINDEX(pce,index)] == from) {
            GameBoard.pList[PCEINDEX(pce,index)] = to;
            break;
        }
    }

}