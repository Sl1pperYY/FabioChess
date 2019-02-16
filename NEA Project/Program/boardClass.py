#----------------------------------------------------------------------
#Creating the Chess Board class
#----------------------------------------------------------------------

class ChessBoard:
    def __init__(self):
        self.board = [[Empty(x='',y='',team='')]*8 for _ in range(8)]

        for i in range(8):
            self.board[1][i] = Pawn(x=1, y=i+1, team='Black', first='Y')

        for i in range(8):
            self.board[6][i] = Pawn(x=6, y=i+1, team='White', first='Y')

        self.board[0][0] = Rook(x=0, y=0, team='Black')
        self.board[0][1] = Knight(x=0, y=1, team='Black')
        self.board[0][2] = Bishop(x=0, y=2, team='Black')
        self.board[0][3] = Queen(x=0, y=3, team='Black')
        self.board[0][4] = King(x=0, y=4, team='Black')
        self.board[0][5] = Bishop(x=0, y=5, team='Black')
        self.board[0][6] = Knight(x=0, y=6, team='Black')
        self.board[0][7] = Rook(x=0, y=7, team='Black')

        self.board[7][0] = Rook(x=0, y=0, team='White')
        self.board[7][1] = Knight(x=0, y=1, team='White')
        self.board[7][2] = Bishop(x=0, y=2, team='White')
        self.board[7][3] = Queen(x=0, y=3, team='White')
        self.board[7][4] = King(x=0, y=4, team='White')
        self.board[7][5] = Bishop(x=0, y=5, team='White')
        self.board[7][6] = Knight(x=0, y=6, team='White')
        self.board[7][7] = Rook(x=0, y=7, team='White')


    #Displays the current chessboard
    def display(self):
        for i in range(8):
            for j in range(8):
                print(self.board[i][j].rep, end=' ')
            print()

    
    def move(self,colour):
        startx,starty = logic.selectPiece(self.board)
        destx,desty = logic.selectDestination(self.board)

        #Base Case is checkmate
        for i1 in range(8):
            for j1 in range (8):
                if colour == True and self.board[j1][i1].team == 'White':
                    for i2 in range(8):
                        for j2 in range(8):
                            if not(self.board[j1][i1].possibleMoves(self.board,i1,j1,i2,j2)) or not(logic.blocked(self.board,i1,j1,i2,j2)):
                                ChessBoard.display()
                                print('Checkmate, Black Won.')
                                break
                elif colour == False and self.board[j1][i1].team == 'Black':
                    for i2 in range(8):
                        for j2 in range(8):
                            if not(self.board[j1][i1].possibleMoves(self.board,i1,j1,i2,j2)) or not(logic.blocked(self.board,i1,j1,i2,j2)):
                                ChessBoard.display()
                                print('Checkmate, White Won.')
                                break               



        if colour == True and self.board[starty][startx].team == 'White':
            if self.board[starty][startx].possibleMoves(self.board,startx,starty,destx,desty):
                if not(logic.sameTeam(self.board,startx,starty,destx,desty)):
                    if self.board[starty][startx].name == 'Pawn' and self.board[starty][startx].first == 'Y':
                        self.board[starty][startx].first = 'N'
                        self.board = logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display()
                        colour = not colour
                        ChessBoard.move(colour)
                    else:
                        self.board = logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display()
                        colour = not colour
                        ChessBoard.move(colour)
                else:
                    print('The destination coordinate is occupied by one of your pieces.')
                    ChessBoard.display()
                    ChessBoard.move(colour)
            else:
                print('This piece can not move there')
                ChessBoard.display()
                ChessBoard.move(colour)
        elif colour == False and self.board[starty][startx].team == 'Black':
            if self.board[starty][startx].possibleMoves(self.board,startx,starty,destx,desty):
                if not(logic.sameTeam(self.board,startx,starty,destx,desty)):
                    if self.board[starty][startx].name == 'Pawn' and self.board[starty][startx].first == 'Y':
                        self.board[starty][startx].first = 'N'
                        self.board = logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display()
                        colour = not colour
                        ChessBoard.move(colour)
                    else:
                        self.board = logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display()
                        colour = not colour
                        ChessBoard.move(colour)
                else:
                    print('The destination coordinate is occupied by one of your pieces.')
                    ChessBoard.display()
                    ChessBoard.move(colour)
            else:
                print('This piece can not move there')
                ChessBoard.display()
                ChessBoard.move(colour)
        else:
            print('The piece you chose is not on your team')
            ChessBoard.display()
            ChessBoard.move(colour)

    

    """
    def move(self):
        startx,starty = logic.selectPiece(self.board)
        destx,desty = logic.selectDestination(self.board)
    """