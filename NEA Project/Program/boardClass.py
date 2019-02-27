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

    def attackedGeneration(self,colour):
        attacked = []
        print(1)
        if colour:
            print(2)
            for y in range(8):
                print(3)
                for x in range(8):
                    print(4)
                    if self.board[y][x].team == 'Black':
                        print(5)
                        list(set(attacked.append(Logic.attackedPerPiece(self.board,x,y))))
                        print(6)
        else:
            print(7)
            for y in range(8):
                print(8)
                for x in range(8):
                    print(9)
                    if self.board[y][x].team == 'White':
                        print(10)
                        list(set(attacked.append(Logic.attackedPerPiece(self.board,x,y))))
                        print(11)
        print(12)
        print (attacked)
        return attacked

    def findKing(self,colour):
        kingx = 0
        kingy = 0
        for i in range(8):
            for j in range(8):
                if (colour == True) and self.board[i][j].team == 'White' and self.board[i][j].name == 'King':
                    kingy = (i - 8) * -1
                    kingx = j
                elif (colour == False) and self.board[i][j].team == 'Black' and self.board[i][j].name == 'King':
                    kingy = (i - 8) * -1
                    kingx = j
        return kingx,kingy


    
    def move(self,colour):
        startx,starty = Logic.selectPiece(self.board)
        destx,desty = Logic.selectDestination(self.board)


        #Base Case is checkmate
        done = False
        counter = 0
        print(82)
        attacked = ChessBoard.attackedGeneration(self,colour)
        print(84)
        '''possibleProttected = ChessBoard.attackedGeneration(self,(not colour))'''
        kingx, kingy = ChessBoard.findKing(self,colour)

        print(86)
        while not done:
            print(1)
            if [kingy,kingx] in attacked:
                print(2)
                for y1 in range(8):
                    print(1)
                    for x1 in range (8):
                        counter += 1
                        print(2)
                        if colour == True and self.board[y1][x1].team == 'White':
                            for y2 in range(8):
                                print(3)
                                for x2 in range(8):
                                    print(4)
                                    if (self.board[y1][x1].possibleMoves(self.board,x1,y1,x2,y2)) and not(Logic.blocked(self.board,x1,y1,x2,y2)):
                                        print(counter)
                                        done = True
                        elif colour == False and self.board[y1][x1].team == 'Black':
                            for y2 in range(8):
                                print(5)
                                for x2 in range(8):
                                    print(6)
                                    if (self.board[y1][x1].possibleMoves(self.board,x1,y1,x2,y2)) and not(Logic.blocked(self.board,x1,y1,x2,y2)):
                                        print(counter)
                                        done = True
                        else:
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