from pieceClasses import Pawn, Rook, Knight, Bishop, Queen, King, Empty
from myChessLogic import Logic

#----------------------------------------------------------------------
#Creating the Chess Board class
#----------------------------------------------------------------------

class ChessBoard:
    def __init__(self):
        self.board = [[Empty(x='',y='',team='')]*8 for _ in range(8)]

        for i in range(8):
            self.board[1][i] = Pawn(x=1, y=i+1, team='Black', first=True)

        for i in range(8):
            self.board[6][i] = Pawn(x=6, y=i+1, team='White', first=True)

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

    def attackedGeneration(self):
        attacked = []
        for y in range(8):
            for x in range(8):
                if self.board[y][x].name != 'Empty':
                    list(set(attacked.append(Logic.attackedPerPiece(self.board,x,y))))


    
    def move(self,colour):
        startx,starty = Logic.selectPiece(self.board)
        destx,desty = Logic.selectDestination(self.board)

        #Base Case is checkmate
        done = False
        counter = 0

        while not done:
            for i1 in range(8):
                for j1 in range (8):
                    counter += 1
                    if colour == True and self.board[j1][i1].team == 'White':
                        for i2 in range(8):
                            for j2 in range(8):
                                if (self.board[j1][i1].possibleMoves(self.board,i1,j1,i2,j2)) and not(Logic.blocked(self.board,i1,j1,i2,j2)):
                                    ChessBoard.display(self)
                                    print('Checkmate, Black Won.')
                                    print(counter)
                                    done = True
                    elif colour == False and self.board[j1][i1].team == 'Black':
                        for i2 in range(8):
                            for j2 in range(8):
                                if (self.board[j1][i1].possibleMoves(self.board,i1,j1,i2,j2)) and not(Logic.blocked(self.board,i1,j1,i2,j2)):
                                    ChessBoard.display(self)
                                    print('Checkmate, White Won.')
                                    print(counter)
                                    done = True
                    else:
                        done = True



        if colour == True and self.board[starty][startx].team == 'White':
            if self.board[starty][startx].possibleMoves(self.board,startx,starty,destx,desty):
                if not(Logic.sameTeam(self.board,startx,starty,destx,desty)):
                    if self.board[starty][startx].name == 'Pawn' and self.board[starty][startx].first == 'Y':
                        self.board[starty][startx].first = 'N'
                        self.board = Logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display(self)
                        colour = not colour
                        ChessBoard.move(self,colour)
                    else:
                        self.board = Logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display(self)
                        colour = not colour
                        ChessBoard.move(self,colour)
                else:
                    print('The destination coordinate is occupied by one of your pieces.')
                    ChessBoard.display(self)
                    ChessBoard.move(self,colour)
            else:
                print('This piece can not move there')
                ChessBoard.display(self)
                ChessBoard.move(self,colour)
        elif colour == False and self.board[starty][startx].team == 'Black':
            if self.board[starty][startx].possibleMoves(self.board,startx,starty,destx,desty):
                if not(Logic.sameTeam(self.board,startx,starty,destx,desty)):
                    if self.board[starty][startx].name == 'Pawn' and self.board[starty][startx].first == 'Y':
                        self.board[starty][startx].first = 'N'
                        self.board = Logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display(self)
                        colour = not colour
                        ChessBoard.move(self,colour)
                    else:
                        self.board = Logic.killPos(self.board,startx,starty,destx,desty)
                        ChessBoard.display(self)
                        colour = not colour
                        ChessBoard.move(self,colour)
                else:
                    print('The destination coordinate is occupied by one of your pieces.')
                    ChessBoard.display(self)
                    ChessBoard.move(self,colour)
            else:
                print('This piece can not move there')
                ChessBoard.display(self)
                ChessBoard.move(self,colour)
        else:
            print('The piece you chose is not on your team')
            ChessBoard.display(self)
            ChessBoard.move(self,colour)

    

    """
    def move(self):
        startx,starty = Logic.selectPiece(self.board)
        destx,desty = Logic.selectDestination(self.board)
    """