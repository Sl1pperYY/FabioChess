//================================================================================
// Buttons
//================================================================================

// Undo Button which will undo the move which black made (the engine), and the move which white makes (player move)
$('#Undo').click( function () {
	if(Board.hisPly > 0) {
        TakeMove();
        TakeMove();
		Board.ply = 0;
        SetInitialBoardPieces();
        $(SearchController.fromId).removeClass("selected");
        $(SearchController.toId).removeClass("selected");
	}
});
 
// New Game Button which resets the board to the starting position
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

// Function to add a piece on to the board
function AddGUIPiece(sq, pce) {

	var file = FileChar[FilesBrd[sq]];
    var rank = RanksBrd[sq]+1;
    var id = file + rank;
    var colour = '';
    var piece = PceName[pce];

    // Sets the colour of the piece (original colour is black so no styling needed)
    if (PieceCol[pce] == COLOURS.WHITE) {
        colour = ' style=\'color:white\'';
    }

    // Setting up the the correct drag image for the piece being added
    var pieceImageString = "<i class=\'fas fa-chess-" + piece + "\'" + colour + "></i>";
    // Making the div of the piece being added
    var	pieceString = "<div class=\'piece\' id=\'"+ id + "piece\' draggable=\'true\' ondragstart=\'drag(event)\'>" + pieceImageString + "</div>";
    id = '#' + id;

    // Appending the piece string to the correct square and removing the square class
    $(id).append(pieceString);
    $(id).removeClass("square");
}

// Function to add all the pieces to the board
function SetInitialBoardPieces() {

	var sq;
	var sq120;
    var pce;
	ClearAllPieces();
    
    // Loops through all 64 squares using the 120 square board
	for(sq = 0; sq < 64; ++sq) {
		sq120 = SQ120(sq);
        pce = Board.pieces[sq120];
        // Checks if the square has a piece on it and adds the correct piece on to the board
		if(pce >= PIECES.wP && pce <= PIECES.bK) {
			AddGUIPiece(sq120, pce);
		}
	}
}

// Function to reposition all the pieces in the right location given by an FEN string
function NewGame(fenStr) {
    ParseFen(fenStr);
    SetInitialBoardPieces();
    CheckAndSet();
}

//================================================================================
// Drag and Drop
//================================================================================

// Function which gets called when the piece is being dragged
function drag(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", ev.target.id);

    // Determines what side the piece is on and what kind of piece it is
    side = $(ev.target).children().attr('style');
    pceType = $(ev.target).children().attr('class');

    // Sets the from square
    SetFromSq($(ev.target).parent().attr('id'));

    var img = new Image();
    
    // Sets the correct drag image using the drag images set in defs.js
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

// Function which gets called when a piece is dropped
function drop(ev) {

    // Checks if the piece is being dropped on another piece
    // If it is and the move is legal than it removes the piece being taken and replaces it with the piece being dropped
    // If it isnt being dropped on another piece and it is a legal move then it moves the piece
    if ($(ev.target).parent().attr('class') == 'piece') {
        // Sets the to square
        squareid = $(ev.target).parent().parent().attr('id');
        SetToSq(squareid);

        var move = ParseMove(UserMove.from, UserMove.to);
        var toastMessage = UserMove.fromId + UserMove.toId;

        // Checks if the move is legal or not
        if(move != NOMOVE) {
            // Makes the move in the engine
            MakeMove(move);
            // Removes the piece being taken from the board
            $(ev.target).parent().remove();

            // Gets the to square from the move string
            var to = TOSQ(move);

            // Adds the piece being moved to the square its being moved to
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.currentTarget.appendChild(document.getElementById(data));
            
            // Changing Pawn into a queen on promotion
            if (PROMOTED(move)) {
                $(ev.currentTarget).children().children().removeClass();
                $(ev.currentTarget).children().children().addClass("fas fa-chess-queen");
            }

            // Displays a toast message of the move which was just made
            M.toast({html: toastMessage, classes: 'rounded player', displayLength: 6000});
            setTimeout(function() {
                PreSearch();
            }, 300);
        // If the move is illegal than it displays a message
        } else {
            $("#GameStatus").text("Illegal Move");
        }
    } else {
        squareid = $(ev.target).attr('id');
        SetToSq(squareid);

        var move = ParseMove(UserMove.from, UserMove.to);
        var toastMessage = UserMove.fromId + UserMove.toId;

        // Checks if the move is legal or not
        if(move != NOMOVE) {
            // Makes the move in the engine
            MakeMove(move);
            $(ev.target).children().remove();

            var to = TOSQ(move);
    
            // Removing the pawn on an en passant move
            if(move & MOVEFLAGEP) {
                // Checks which side made the en passant move (if Board.side == COLOURS.BLACK than it means it was white that made the move)
                if(Board.side == COLOURS.BLACK) {
                    // Sets the id of the piece which is being taken
                    var enPassantSqRank = (parseInt(squareid[1]) - 1).toString();
                    var enPassantSqId = ("#" + squareid[0] + enPassantSqRank);
                    // Removes the piece from the board
                    $(enPassantSqId).children().remove();
                } else {
                    // Sets the id of the piece which is being taken
                    var enPassantSqRank = (parseInt(squareid[1]) + 1).toString();
                    var enPassantSqId = ("#" + squareid[0] + enPassantSqRank);
                    // Removes the piece from the board
                    $(enPassantSqId).children().remove();
                }
            }

            // Moving the rook if its a castling move
            // Only have to move the rook because the king is already being moved when a legal move is made
            if (move & MOVEFLAGCA) {
                // Switch statement to move the correct rook to the correct square by checking where the king was moved
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
            
            // Adds the piece being moved to the correct square on the board
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.currentTarget.appendChild(document.getElementById(data));

            // Changing Pawn into a queen on promotion
            if (PROMOTED(move)) {
                $(ev.currentTarget).children().children().removeClass();
                $(ev.currentTarget).children().children().addClass("fas fa-chess-queen");
            }

            // Displays a toast message of the move which was just made
            M.toast({html: toastMessage, classes: 'rounded player', displayLength: 6000});
            setTimeout(function() {
                PreSearch();
            }, 300);
        // If the move is illegal than it displays a message
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
    UserMove.fromId = sq;
}

// Function to set the square which the piece is being moved to
function SetToSq(sq) {
    file = (sq.charCodeAt(0) - 97);
    rank = (parseInt(sq[1], 10) - 1);
    coordinate = FR2SQ(file,rank);
    UserMove.to = coordinate;
    UserMove.toId = sq;
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
    if(Board.fiftyMove >= 100) {
        $("#GameStatus").text("GAME DRAWN fifty move rule"); 
        return true;
    }

    // 3-fold repetition draw
    if (ThreeFoldRep() >= 2) {
        $("#GameStatus").text("GAME DRAWN 3-fold repetition"); 
        return true;
    }

    // Insufficient material to mate draw
    if (DrawMaterial() == true) {
        $("#GameStatus").text("GAME DRAWN insufficient material to mate"); 
        return true;
    }

    GenerateMoves();

    var MoveNum = 0;
    var found = 0;

    for(MoveNum = Board.moveListStart[Board.ply]; MoveNum < Board.moveListStart[Board.ply + 1]; ++MoveNum)  {	
      
        if ( MakeMove(Board.moveList[MoveNum]) == false)  {
            continue;
        }
        found++;
        TakeMove();
        break;
    }

    if(found != 0) {return false};

    var InCheck = SqAttacked(Board.pList[PCEINDEX(Kings[Board.side],0)], Board.side^1);

    // Checks if the King is in check mate or not
    if(InCheck == true) {
        if(Board.side == COLOURS.WHITE) {

            // Black wins
            $("#GameStatus").text("GAME OVER black mates");
            return true;
        } else {

            // White wins
            $("#GameStatus").text("GAME OVER white mates");
            return true;
        }
    } else {
        
        // Stalemate draw
        $("#GameStatus").text("GAME DRAWN stalemate");return true;
    }
}

// Function to determine a material draw
function DrawMaterial() {
	if (Board.pceNum[PIECES.wP]!=0 || Board.pceNum[PIECES.bP]!=0) return false;
	if (Board.pceNum[PIECES.wQ]!=0 || Board.pceNum[PIECES.bQ]!=0 || Board.pceNum[PIECES.wR]!=0 || Board.pceNum[PIECES.bR]!=0) return false;
	if (Board.pceNum[PIECES.wB] > 1 || Board.pceNum[PIECES.bB] > 1) {return false;}
    if (Board.pceNum[PIECES.wN] > 1 || Board.pceNum[PIECES.bN] > 1) {return false;}
	if (Board.pceNum[PIECES.wN]!=0 && Board.pceNum[PIECES.wB]!=0) {return false;}
	if (Board.pceNum[PIECES.bN]!=0 && Board.pceNum[PIECES.bB]!=0) {return false;}
	 
	return true;
}

// Function for three fold repetition
function ThreeFoldRep() {
    var i = 0, r = 0;
	
	for(i = 0; i < Board.hisPly; ++i) {
		if (Board.history[i].posKey == Board.posKey) {
		    r++;
		}
	}
	return r;
}

//================================================================================
// Searching
//================================================================================

// PreSearch function which calls the StartSearch function if the game is not over.
function PreSearch() {
	if(GameController.GameOver == false) {
		SearchController.thinking = true;
		setTimeout( function() { StartSearch(); }, 0 );
	}
}



// Function to output data about the engine, such as ordering, depth it searched to and the score of the move.
/*
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
*/

// Function to search for the best possible move and make the move
function StartSearch() {
    SearchController.depth = MAXDEPTH;
    var t = $.now();
    // Thinking time (How long the engine thinks about the best move)
    var thinkingTime = 2; 

    // Removes the selected class from the from square and the to square of the players last move
    $(SearchController.fromId).removeClass("selected");
    $(SearchController.toId).removeClass("selected");

    // Converting Thinking time into miliseconds
    SearchController.time = thinkingTime * 1000;

    SearchPosition();
    MakeMove(SearchController.best);

    // Getting the form square from the move found by the SearchPosition function
    var from = FROMSQ(SearchController.best);
    // Getting the to square from the move found by the SearchPosition function
    var to = TOSQ(SearchController.best);
    // Converting the from square and to square to fit the id notation
    var fromFile = String.fromCharCode(FilesBrd[from] + 97);
    var fromRank = (RanksBrd[from] + 1).toString();
    var toFile = String.fromCharCode(FilesBrd[to] + 97);
    var toRank = (RanksBrd[to] + 1).toString();
    var fromId = ("#" + fromFile + fromRank);
    var toId = ("#" + toFile + toRank);

    // Setting from id and to id to searchController so the selected class can be removed from the last move the engine makes
    SearchController.fromId = fromId;
    SearchController.toId = toId;
    
    // Making the move on the gui
    var piece = $(fromId).children().detach();
    $(toId).children().remove();
    $(toId).append(piece);
    // adding the selected class to the from square and to square to make it easier to see for the player what the engine moved
    $(fromId).addClass("selected");
    $(toId).addClass("selected");
    
    // Displays toast message of the move which was just made
    M.toast({html: PrintMove(SearchController.best), classes: 'rounded', displayLength: 6000});

    // Removes the pawn if there was an en passant capture
	if(SearchController.best & MOVEFLAGEP) {
        var enPassantCap;
        // Checks what side made the en passant move (If its black's turn to move then it was white who made the en passant capture)
        if (Board.side == COLOURS.BLACK){
            enPassantCap = (RanksBrd[to]).toString();
            $("#" + toFile + enPassantCap).children().remove()
        } else {
            enPassantCap = (RanksBrd[to] + 2).toString();
            $("#" + toFile + enPassantCap).children().remove()
        }
	}
    
    // Checks if the move was a castling move
	if(SearchController.best & MOVEFLAGCA) {
        var rook;
        // Switch statement which moves the rook depending on where the king was moved
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
    // Checks if the move was a promotion move and promotes the pawn to a queen
	} else if (PROMOTED(SearchController.best)) {
        $(toId).children().children().removeClass();
        $(toId).children().children().addClass("fas fa-chess-queen");
	}
    CheckAndSet();
}

//================================================================================
// Puzzle
//================================================================================

// Function which redirects the user to the main page with the puzzle set up which they chose or put in
function redirect(puzzle) {
    var index = "/bf/index.html?puzzle="
    window.location.href= index + puzzle;
}

// Creates a dictionary for the parameters in the url
function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    prmstr = decodeURIComponent(prmstr);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

// Converts the content of the url parameters into a string
function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var params = getSearchParameters();