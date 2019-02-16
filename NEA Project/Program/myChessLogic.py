from pieceClasses import Pawn, Rook, Knight, Bishop, Queen, King, Empty

#----------------------------------------------------------------------
#All of the chess Logic
#----------------------------------------------------------------------

class Logic:

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
        return (len(x) == 2) or (Logic.range(x))

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
            x,y = Logic.convert(piece)
            if not(Logic.coordinateCheck(piece)):
                print ('You did not enter the coordinate in the right format or the coordinate is out of range.')
            elif Logic.emptyCheck(board,x,y):
                print('The coordinate you entered is empty.')
            else:
                return x,y

    #Asks for an input for the destination coordinate
    @staticmethod
    def selectDestination(board):
        while True:
            destination = input('Please enter the coordinate you want to move this piece to (in the format of f3): ')
            x,y = Logic.convert(destination)
            if not(Logic.coordinateCheck(destination)):
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
        else:
            return False