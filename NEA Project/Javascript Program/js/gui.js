//================================================================================
// Buttons
//================================================================================

$("#SetFen").click(function() {
    var fenStr = $("#fenIn").val();
    NewGame(fenStr);
    $(SearchController.fromId).removeClass("selected");
    $(SearchController.toId).removeClass("selected");
});

$('#Undo').click( function () {
	if(GameBoard.hisPly > 0) {
		TakeMove();
		GameBoard.ply = 0;
        SetInitialBoardPieces();
        $(SearchController.fromId).removeClass("selected");
        $(SearchController.toId).removeClass("selected");
	}
});

$('#NewGameButton').click( function () {
    NewGame(START_FEN);
    $(SearchController.fromId).removeClass("selected");
    $(SearchController.toId).removeClass("selected");
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
    SetInitialBoardPieces();
    CheckAndSet();
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
    side = $(ev.target).children().attr('style');
    pceType = $(ev.target).children().attr('class');

    SetFromSq($(ev.target).parent().attr('id'));

    // $(ev.target).addClass('.selected');
    var img = new Image();
    
    // Sets the correct drag image
    if (side == 'color:white') {
        if (pceType == 'fas fa-chess-pawn') {
            img = wPImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-rook') {
            img = wRImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-knight') {
            img = wNImg;
            
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-bishop') {
            img = wBImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-queen') {
            img = wQImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-king') {
            img = wKImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        }
    } else {
        if (pceType == 'fas fa-chess-pawn') {
            img = bPImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-rook') {
            img = bRImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-knight') {
            img = bNImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-bishop') {
            img = bBImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-queen') {
            img = bQImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        } else if (pceType == 'fas fa-chess-king') {
            img = bKImg;
            ev.dataTransfer.setDragImage(img, 50, 50);
        }
    }
}
  
function drop(ev) {

    if ($(ev.target).parent().attr('class') == 'piece') {
        squareid = $(ev.target).parent().parent().attr('id');
        SetToSq(squareid);

        var move = ParseMove(UserMove.from, UserMove.to);

        if(move != NOMOVE) {
            MakeMove(move);
            $(ev.target).parent().remove();

            var to = TOSQ(move);

            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.currentTarget.appendChild(document.getElementById(data));
            
            // Changing Pawn into a queen on promotion
            if (PROMOTED(move)) {
                $(ev.currentTarget).children().children().removeClass();
                $(ev.currentTarget).children().children().addClass("fas fa-chess-queen");
            }
            PreSearch();
        } else {
            $("#GameStatus").text("Illegal Move");
        }
        
    } else {
        squareid = $(ev.target).attr('id');
        SetToSq(squareid);

        var move = ParseMove(UserMove.from, UserMove.to);

        if(move != NOMOVE) {
            MakeMove(move);
            $(ev.target).children().remove();

            var to = TOSQ(move);
    
            // Removing the pawn on an enpassant move
            if(move & MFLAGEP) {
                if(GameBoard.side == COLOURS.BLACK) {
                    var enPassantSqRank = (parseInt(squareid[1]) - 1).toString();
                    var enPassantSqId = ("#" + squareid[0] + enPassantSqRank);
                    $(enPassantSqId).children().remove();
                } else {
                    var enPassantSqRank = (parseInt(squareid[1]) + 1).toString();
                    var enPassantSqId = ("#" + squareid[0] + enPassantSqRank);
                    $(enPassantSqId).children().remove();
                }
            }

            // Moving the rook if its a castling move
            if (move & MFLAGCA) {
                switch(to) {
                    case SQUARES.G1:
                        rook = $("#h1").children().detach();
                        $("#f1").append(rook);
                        break;
                    case SQUARES.C1:
                        rook = $("#a1").children().detach();
                        $("#d1").append(rook);
                        break;
                    case SQUARES.G8:
                        rook = $("#h8").children().detach();
                        $("#f8").append(rook);
                        break;
                    case SQUARES.C8:
                        rook = $("#a8").children().detach();
                        $("#d8").append(rook);
                        break;
                }
            }
            
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.currentTarget.appendChild(document.getElementById(data));

            // Changing Pawn into a queen on promotion
            if (PROMOTED(move)) {
                $(ev.currentTarget).children().children().removeClass();
                $(ev.currentTarget).children().children().addClass("fas fa-chess-queen");
            }

            PreSearch();
        } else {
            $("#GameStatus").text("Illegal Move");
        }
    }
    CheckAndSet();
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
    file = (sq.charCodeAt(0) - 97);
    rank = (parseInt(sq[1], 10) - 1);
    coordinate = FR2SQ(file,rank);
    UserMove.to = coordinate;
}

//================================================================================
// Checking Game State
//================================================================================

// Function to let the engine know the game is over and prints it on the website
function CheckAndSet() {
	if(CheckResult() == true) {
		GameController.GameOver = true;
	} else {
        GameController.GameOver = false;
        $("#GameStatus").text("");
	}
}

// Function to check the gamestate (true = game over)
function CheckResult() {

    // Fifty move rule draw
    if(GameBoard.fiftyMove >= 100) {
        $("#GameStatus").text("GAME DRAWN {fifty move rule}"); 
        return true;
    }

    // 3-fold repetition draw
    if (ThreeFoldRep() >= 2) {
        $("#GameStatus").text("GAME DRAWN {3-fold repetition}"); 
        return true;
    }

    // Insufficient material to mate draw
    if (DrawMaterial() == true) {
        $("#GameStatus").text("GAME DRAWN {insufficient material to mate}"); 
        return true;
    }

    GenerateMoves();

    var MoveNum = 0;
    var found = 0;

    for(MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum)  {	
      
        if ( MakeMove(GameBoard.moveList[MoveNum]) == false)  {
            continue;
        }
        found++;
        TakeMove();
        break;
    }

    if(found != 0) {return false};

    var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side],0)], GameBoard.side^1);

    if(InCheck == true) {
        if(GameBoard.side == COLOURS.WHITE) {

            // Black wins
            $("#GameStatus").text("GAME OVER {black mates}");
            return true;
        } else {

            // White wins
            $("#GameStatus").text("GAME OVER {white mates}");
            return true;
        }
    } else {
        
        // Stalemate draw
        $("#GameStatus").text("GAME DRAWN {stalemate}");return true;
    }
}

// Function to determine a material draw
function DrawMaterial() {
	if (GameBoard.pceNum[PIECES.wP]!=0 || GameBoard.pceNum[PIECES.bP]!=0) return false;
	if (GameBoard.pceNum[PIECES.wQ]!=0 || GameBoard.pceNum[PIECES.bQ]!=0 || GameBoard.pceNum[PIECES.wR]!=0 || GameBoard.pceNum[PIECES.bR]!=0) return false;
	if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) {return false;}
    if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) {return false;}
	if (GameBoard.pceNum[PIECES.wN]!=0 && GameBoard.pceNum[PIECES.wB]!=0) {return false;}
	if (GameBoard.pceNum[PIECES.bN]!=0 && GameBoard.pceNum[PIECES.bB]!=0) {return false;}
	 
	return true;
}

// Function for three fold repetition
function ThreeFoldRep() {
    var i = 0, r = 0;
	
	for(i = 0; i < GameBoard.hisPly; ++i) {
		if (GameBoard.history[i].posKey == GameBoard.posKey) {
		    r++;
		}
	}
	return r;
}

//================================================================================
// Searching
//================================================================================

function PreSearch() {
	if(GameController.GameOver == false) {
		SearchController.thinking = true;
		setTimeout( function() { StartSearch(); }, 0 );
	}
}

function UpdateDOMStats(dom_score, dom_depth) {

    var scoreText = "Score: " + (dom_score / 100).toFixed(2);
    if(Math.abs(dom_score) > MATE - MAXDEPTH) {
        scoreText = "Score: Mate In " + (MATE - Math.abs(dom_score)-1) + " moves";
    }

	$("#OrderingOut").text("Ordering: " + ((SearchController.fhf/SearchController.fh)*100).toFixed(2) + "%");
	$("#DepthOut").text("Depth: " + dom_depth);
	$("#ScoreOut").text(scoreText);
	$("#NodesOut").text("Nodes: " + SearchController.nodes);
	$("#TimeOut").text("Time: " + (($.now()-SearchController.start)/1000).toFixed(1) + "s");
	$("#BestOut").text("BestMove: " + PrMove(SearchController.best));
}

function StartSearch() {
    SearchController.depth = MAXDEPTH;
    var t = $.now();
    var tt = 1; // Thinking time

    $(SearchController.fromId).removeClass("selected");
    $(SearchController.toId).removeClass("selected");

    SearchController.time = tt * 1000;
    SearchPosition();

    
    MakeMove(SearchController.best);

    var from = FROMSQ(SearchController.best);
    var to = TOSQ(SearchController.best);
    var fromFile = String.fromCharCode(FilesBrd[from] + 97);
    var fromRank = (RanksBrd[from] + 1).toString();
    var toFile = String.fromCharCode(FilesBrd[to] + 97);
    var toRank = (RanksBrd[to] + 1).toString();
    var fromId = ("#" + fromFile + fromRank);
    var toId = ("#" + toFile + toRank);

    SearchController.fromId = fromId;
    SearchController.toId = toId;
    
    var piece = $(fromId).children().detach();
    $(toId).children().remove();
    $(toId).append(piece);
    $(fromId).addClass("selected");
    $(toId).addClass("selected");
	
	if(SearchController.best & MFLAGEP) {
        var enPassantCap;
        if (GameBoard.side == COLOURS.BLACK){
            enPassantCap = (RanksBrd[to]).toString();
            $("#" + toFile + enPassantCap).children().remove()
        } else {
            enPassantCap = (RanksBrd[to] + 2).toString();
            $("#" + toFile + enPassantCap).children().remove()
        }
	}
	
	console.log(to);
	if(SearchController.best & MFLAGCA) {
        var rook;
		switch(to) {
            case SQUARES.G1:
                rook = $("#h1").children().detach();
                $("#f1").append(rook);
                break;
            case SQUARES.C1:
                rook = $("#a1").children().detach();
                $("#d1").append(rook);
                break;
            case SQUARES.G8:
                rook = $("#h8").children().detach();
                $("#f8").append(rook);
                break;
            case SQUARES.C8:
                rook = $("#a8").children().detach();
                $("#d8").append(rook);
                break;
		}
	} else if (PROMOTED(SearchController.best)) {
        $(toId).children().children().removeClass();
        $(toId).children().children().addClass("fas fa-chess-queen");
	}
    CheckAndSet();
}

//================================================================================
// Puzzle
//================================================================================

function redirect(puzzle) {
    window.location.href="'/bf/index.html?puzzle=' + puzzle";
}