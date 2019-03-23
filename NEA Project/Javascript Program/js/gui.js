$("#SetFen").click(function() {
    var fenStr = $("#fenIn").val();
    NewGame(fenStr);
});

//================================================================================
// Board Set up
//================================================================================

// Function to clear all the pieces on the board
function ClearAllPieces() {
    $(".piece").remove();
}

// Function to add a piece on the board
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

// Function to add all the pieces to the board
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

// Function to reposition all the pieces in the right location given by an FEN string
function NewGame(fenStr) {
    ParseFen(fenStr);
    PrintBoard();
    SetInitialBoardPieces()
}

//================================================================================
// Drag and Drop
//================================================================================

function drag(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", ev.target.id);
    // ev.currentTarget.style.boxShadow = '0 0 0 0.2rem cyan';
    var pce = ev.target.id;
    pce = pce[0] + pce[1];

    SetFromSq($(ev.target).parent().attr('id'));

    // $(ev.target).addClass('.selected');
    var img = new Image();
    
    // Sets the correct drag image
    if (pce[1] == '7') {
        img = bPImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if (pce[1] == '2') {
        img = wPImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if ((pce[0] == 'a' && pce[1] == '8') || (pce[0] == 'h' && pce[1] == '8')) {
        img = bRImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if ((pce[0] == 'a' && pce[1] == '1') || (pce[0] == 'h' && pce[1] == '1')) {
        img = wRImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if ((pce[0] == 'b' && pce[1] == '8') || (pce[0] == 'g'  && pce[1] == '8')) {
        img = bNImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if ((pce[0] == 'b' && pce[1] == '1') || (pce[0] == 'g'  && pce[1] == '1')) {
        img = wNImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if ((pce[0] == 'c' && pce[1] == '8') || (pce[0] == 'f' && pce[1] == '8')) {
        img = bBImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if ((pce[0] == 'c' && pce[1] == '1') || (pce[0] == 'f' && pce[1] == '1')) {
        img = wBImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if (pce[0] == 'd' && pce[1] == '8') {
        img = bQImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if (pce[0] == 'd' && pce[1] == '1') {
        img = wQImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if (pce[0] == 'e' && pce[1] == '8') {
        img = bKImg;
        ev.dataTransfer.setDragImage(img, 50, 50);
    } else if (pce[0] == 'e' && pce[1] == '1') {
        img = wKImg;
        ev.dataTransfer.setDragImage(img, 0, 0);
    }
}
  
function drop(ev) {
    // ev.currentTarget.childNode.style.boxShadow = '';
    SetToSq($(ev.target).attr('id'));

    var parsed = ParseMove(UserMove.from, UserMove.to);

    if(parsed != NOMOVE && $(ev.currentTarget).children().length == 0) {
        MakeMove(parsed);
        
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.currentTarget.appendChild(document.getElementById(data));
    } else if(parsed != NOMOVE && $(ev.currentTarget).children().length == 1) {
        MakeMove(parsed);
        
        ev.currentTarget.removeChild();
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.currentTarget.appendChild(document.getElementById(data));
    } else {
        console.log('Illegal Move')
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

// Function to set the square which the piece is being dragged from
function SetFromSq(sq) {
    file = (sq.charCodeAt(0) - 97);
    rank = (parseInt(sq[1], 10) - 1);
    coordinate = FR2SQ(file,rank);
    UserMove.from = coordinate;
}

// Function to set the square which the piece is being moved to
function SetToSq(sq) {
    console.log(sq); 
    file = (sq.charCodeAt(0) - 97);
    rank = (parseInt(sq[1], 10) - 1);
    coordinate = FR2SQ(file,rank);
    UserMove.to = coordinate;
}


//================================================================================
// Move Detection
//================================================================================

/*
$(document).on('click','.piece', function (e) {
    console.log('Piece Click');
});

$(document).on('click','.square', function (e) {
    console.log('Square Click');
});
*/