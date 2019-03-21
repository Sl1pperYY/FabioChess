$("#SetFen").click(function() {
    var fenStr = $("#fenIn").val();
    NewGame(fenStr);
});

//================================================================================
// Board Set up
//================================================================================

function ClearAllPieces() {
    $(".piece").remove();
}

function AddGUIPiece(sq, pce) {

	var file = FileChar[FilesBrd[sq]];
    var rank = RanksBrd[sq]+1;
    var id = file + rank;
    var colour = '';
    var piece = PceName[pce];


    if (PieceCol[pce] == COLOURS.WHITE) {
        colour = ' style=\'color:white\'';
    }

	var pieceImageString = "<i class=\'fas fa-chess-" + piece + "\'" + colour + "></i>";
    var	pieceString = "<div class=\'piece\' id=\'" + id + "piece\'>" /*draggable=\'true\' ondragstart=\'drag(event)\'*/ + pieceImageString + "</div>";
    id = '#' + id;
    $(id).append(pieceString);
    $(id).removeClass("square");
}

function SetInitialBoardPieces() {

	var sq;
	var sq120;
	var pce;
	ClearAllPieces();
	
	for(sq = 0; sq < 64; ++sq) {

		sq120 = SQ120(sq);
		pce = GameBoard.pieces[sq120];
		if(pce >= PIECES.wP && pce <= PIECES.bK) {
			AddGUIPiece(sq120, pce);
		}
	}
}

function NewGame(fenStr) {
    ParseFen(fenStr);
    PrintBoard();
    SetInitialBoardPieces()
}

//================================================================================
// Drag and Drop
//================================================================================

/*
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", ev.target.id);
    $(ev.currentTarget).addClass('invisible');
}
  
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    $(ev.currentTarget).removeClass('invisible');
    ev.target.appendChild(document.getElementById(data));
    
}
*/

//================================================================================
// Moving with clicking
//================================================================================

$(document).on('click','.piece', function (e) {
    console.log('Piece Click');
});

$(document).on('click','.square', function (e) {
    console.log('Square Click');
});