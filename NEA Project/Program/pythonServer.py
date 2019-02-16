from flask import Flask
from flask_restful import Resource, Api


#----------------------------------------------------------------------
#All of the chess logic
#----------------------------------------------------------------------

class logic:

    #Checks if the input is in the correct format
    @staticmethod
    def range(x):
        return (x[0] in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] and 0 < int(x[1]) > 9)

    #Converts the input coordinate into the correct coordinate readable by the program
    @staticmethod
    def convert(coordinate):
        x = ord(coordinate[0]) - 97
        
        y = (int(coordinate[1]) - 8) * -1
        print(x,y)
        return x,y

    #Checks if the input is the correct format
    @staticmethod
    def coordinateCheck(x):
        return (len(x) == 2) or (logic.range(x))

    #Checks if the coordinate selected is empty or not
    @staticmethod
    def emptyCheck(board,x,y):
        return board[y][x] == '.'

    #Checks if the coordinates selected are occupied by pieces on the same team
    @staticmethod
    def sameTeam(board,x1,y1,x2,y2):
        return board[y1][x1].team == board[y2][x2].team

    #Asks for an input for the starting coordinate
    @staticmethod
    def selectPiece(board):
        while True:
            piece = input('Please enter the coordinate you want to select (in the format of f3): ')
            x,y = logic.convert(piece)
            if not(logic.coordinateCheck(piece)):
                print ('You did not enter the coordinate in the right format or the coordinate is out of range.')
            elif logic.emptyCheck(board,x,y):
                print('The coordinate you entered is empty.')
            else:
                return x,y

    #Asks for an input for the destination coordinate
    @staticmethod
    def selectDestination(board):
        while True:
            destination = input('Please enter the coordinate you want to move this piece to (in the format of f3): ')
            x,y = logic.convert(destination)
            if not(logic.coordinateCheck(destination)):
                print('You did not enter the coordinate in the right format or the coordinate is out of range.')
            else:
                return x,y

    #Checks if the two coordinates selected contain opposite team pieces
    @staticmethod
    def kill(board,x1,y1,x2,y2):
        if board[x1][y1].team == 'White' and board[x2][y2].team == 'Black':
            return True
        elif board[x1][y1].team == 'Black' and board[x2][y2].team == 'White':
            return True
        else:
            return False

    #Checks if the move is a pawn kill or not
    @staticmethod
    def pawnKill(board,x1,y1,x2,y2):
        if board[x1][y1].team == 'White' and board[x2][y2].team == 'Black' and board[x1][y1].name == 'Pawn':
            return True
        elif board[x1][y1].team == 'Black' and board[x2][y2].team == 'White' and board[x1][y1].name == 'Pawn':
            return True
        else:
            return False

    #Changes the starting position into an empty position and moves the piece to the destination
    @staticmethod
    def killPos(board,x1,y1,x2,y2):
        board[y2][x2] = board[y1][x1]
        board[y1][x1] = Empty(x='',y='',team='')
        return board

    #Checks if there is a piece in the way
    @staticmethod
    def blocked(board,x1,y1,x2,y2):
        if board[y1][x1].name == 'Rook':
            if x2>x1:
                for i in range(x1+1,x2):
                    if board[y1][i].name != 'Empty':
                        return True
            elif x2<x1:
                for i in range(x2+1,x1):
                    if board[y1][i].name != 'Empty':
                        return True
            elif y2>y1:
                for j in range(y1+1,y2):
                    if board[j][x1].name != 'Empty':
                        return True
            elif y2<y1:
                for j in range(y2+1,y1):
                    if board[j][x1].name != 'Empty':
                        return True
            else:
                return False

        elif board[y1][x1].name == 'Bishop':
            if x2>x1 and y2>y1:
                for i in range(x1+1,x2):
                    for j in range(y1+1,y2):
                        if board[j][i].name != 'Empty':
                            return True
            elif x2>x1 and y2<y1:
                for i in range(x2+1,x1):
                    for j in range(y2+1,y1):
                        if board[j][i].name != 'Empty':
                            return True
            elif x2<x1 and y2>y1:
                for i in range(x1+1,x2):
                    for j in range(y1+1,y2):
                        if board[j][i].name != 'Empty':
                            return True
            elif x2<x1 and y2<y1:
                for i in range(x2+1,x1):
                    for j in range(y2+1,y1):
                        if board[j][i].name != 'Empty':
                            return True
            else:
                return False

        elif board[y1][x1].name == 'Queen':
            if x2>x1:
                for i in range(x1+1,x2):
                    if board[y1][i].name != 'Empty':
                        return True
            elif x2<x1:
                for i in range(x2+1,x1):
                    if board[y1][i].name != 'Empty':
                        return True
            elif y2>y1:
                for j in range(y1+1,y2):
                    if board[j][x1].name != 'Empty':
                        return True
            elif y2<y1:
                for j in range(y2+1,y1):
                    if board[j][x1].name != 'Empty':
                        return True
            elif x2>x1 and y2>y1:
                for i in range(x1+1,x2):
                    for j in range(y1+1,y2):
                        if board[j][i].name != 'Empty':
                            return True
            elif x2>x1 and y2<y1:
                for i in range(x2+1,x1):
                    for j in range(y2+1,y1):
                        if board[j][i].name != 'Empty':
                            return True
            elif x2<x1 and y2>y1:
                for i in range(x1+1,x2):
                    for j in range(y1+1,y2):
                        if board[j][i].name != 'Empty':
                            return True
            elif x2<x1 and y2<y1:
                for i in range(x2+1,x1):
                    for j in range(y2+1,y1):
                        if board[j][i].name != 'Empty':
                            return True
            else:
                return False



#----------------------------------------------------------------------
#Possible moves for each pieces
#----------------------------------------------------------------------

wPawn = [(1,0), (1,1), (1,-1)]
bPawn = [(-1,0), (-1,-1), (-1,1)]
rook = [(1,0), (0,1), (-1,0), (0,-1)]
knight = [(2,1), (1,2), (-1,2), (-2,1), (-2,-1), (-1,-2), (1,-2), (2,-1)]
bishop = [(1,1), (1,-1), (-1,-1), (-1,1)]



#----------------------------------------------------------------------
#Classes for each pieces and possible moves
#----------------------------------------------------------------------

class Pawn:
    def __init__(self, x, y, team, first):
        self.name = 'Pawn'
        self.x = x
        self.y = y
        self.team = team
        self.first = first
        if self.team == 'White':
            self.rep = 'P'
        else:
            self.rep = 'p'

    def possibleMoves(self,board,startx,starty,destx,desty):
        if board[startx][starty].team == 'White' and desty-starty == -1 and startx == destx:
            return True
        elif board[startx][starty].team == 'Black' and desty-starty == 1 and startx == destx:
            return True
        else:
            return False


class Rook:
    def __init__(self, x, y, team):
        self.name = 'Rook'
        self.x = x
        self.y = y
        self.team = team
        if self.team == 'White':
            self.rep = 'R'
        else:
            self.rep = 'r'

    def possibleMoves(self,board,startx,starty,destx,desty):
        if destx==startx or desty==starty:
            return True
        else:
            return False

class Knight:
    def __init__(self, x, y, team):
        self.name = 'Knight'
        self.x = x
        self.y = y
        self.team = team
        if self.team == 'White':
            self.rep = 'N'
        else:
            self.rep = 'n'

    def possibleMoves(self,board,startx,starty,destx,desty):
        if (startx-destx == 1 or startx-destx == -1) and (starty-desty == 2 or starty-desty == -2):
            return True
        elif (startx-destx == 2 or startx-destx == -2) and (starty-desty == 1 or starty-desty == -1):
            return True
        else:
            return False


class Bishop:
    def __init__(self, x, y, team):
        self.name = 'Bishop'
        self.x = x
        self.y = y
        self.team = team
        if self.team == 'White':
            self.rep = 'B'
        else:
            self.rep = 'b'

    def possibleMoves(self,board,startx,starty,destx,desty):
        if abs(destx-startx) == abs(desty-starty):
            return True
        else:
            return False


class Queen:
    def __init__(self, x, y, team):
        self.name = 'Queen'
        self.x = x
        self.y = y
        self.team = team
        if self.team == 'White':
            self.rep = 'Q'
        else:
            self.rep = 'q'

    def possibleMoves(self,board,startx,starty,destx,desty):
        if abs(destx-startx) == abs(desty-starty) or destx == startx or desty == starty:
            return True
        else:
            return False


class King:
    def __init__(self, x, y, team):
        self.name = 'King'
        self.x = x
        self.y = y
        self.team = team
        if self.team == 'White':
            self.rep = 'K'
        else:
            self.rep = 'k'

    def possibleMoves(self,board,startx,starty,destx,desty):
        if abs(destx-startx) < 2 and abs(desty-starty) < 2:
            return True
        else:
            return False

class Empty:
    def __init__(self, x, y, team):
        self.name = 'Empty'
        self.x = x
        self.y = y
        self.team = team
        self.rep = '.'



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

#----------------------------------------------------------------------
#Main program
#----------------------------------------------------------------------

ChessBoard = ChessBoard()
ChessBoard.display()
ChessBoard.move(True)
