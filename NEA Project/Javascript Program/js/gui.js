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
    var	pieceString = "<div class=\'piece\' id=\'" + id + "piece\' draggable=\'true\' ondragstart=\'drag(event)\'>" + pieceImageString + "</div>";
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


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", ev.target.id);
    var pce = ev.target.id
    pce = pce[0] + pce[1];


    var img = new Image();
    
    if (pce[1] == '7') {
        img = bPImg;
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if (pce[1] == '2') {
        img = wPImg;
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if ((pce[0] == 'a' && pce[1] == '8') || (pce[0] == 'h' && pce[1] == '8')) {
        img = bRImg;
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if ((pce[0] == 'a' && pce[1] == '1') || (pce[0] == 'h' && pce[1] == '1')) {
        img = wRImg;
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if ((pce[0] == 'b' && pce[1] == '8') || (pce[0] == 'g'  && pce[1] == '8')) {
        img = bNImg
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if ((pce[0] == 'b' && pce[1] == '1') || (pce[0] == 'g'  && pce[1] == '1')) {
        img.src = "Assets/PieceSVGs/wN.svg";
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if ((pce[0] == 'c' && pce[1] == '8') || (pce[0] == 'f' && pce[1] == '8')) {
        img.src = "Assets/PieceSVGs/bB.svg";
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if ((pce[0] == 'c' && pce[1] == '1') || (pce[0] == 'f' && pce[1] == '1')) {
        img.src = "Assets/PieceSVGs/wB.svg";
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if (pce[0] == 'd' && pce[1] == '8') {
        img.src = "Assets/PieceSVGs/bQ.svg";
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if (pce[0] == 'd' && pce[1] == '1') {
        img.src = "Assets/PieceSVGs/wQ.svg";
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if (pce[0] == 'e' && pce[1] == '8') {
        img.src = "Assets/PieceSVGs/bK.svg";
        ev.dataTransfer.setDragImage(img, 10, 10);
    } else if (pce[0] == 'e' && pce[1] == '1') {
        img.src = "Assets/PieceSVGs/wK.svg";
        ev.dataTransfer.setDragImage(img, 0, 0);
    }
    

}
  
function drop(ev) {
    if ($(ev.currentTarget).children().length == 0) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.currentTarget.appendChild(document.getElementById(data));
    }
}


//================================================================================
// Moving with clicking
//================================================================================

$(document).on('click','.piece', function (e) {
    console.log('Piece Click');
});

$(document).on('click','.square', function (e) {
    console.log('Square Click');
});