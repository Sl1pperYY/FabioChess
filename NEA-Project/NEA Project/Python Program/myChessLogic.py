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
        if board[y1][x1].name == 'Pawn':
            if y1+2 == y2:
                if board[y1+1][x1].name != 'Empty':
                    
                    return True
            else:
                return False

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

    #Returns all the coordinates of the piece at the 
    @staticmethod
    def attackedPerPiece(board,x,y):
        print(1)
        if board[y][x].name == 'Pawn':
            print(2)
            if board[y][x].team == 'White':
                print(3)
                if (y < 9) and (x < 9):
                    print(191)
                    return [x+1,y+1]
                elif (y < 9) and (x > 0):
                    print(194)
                    return [x-1,y+1]
            else:
                if y > 0 and x < 9:
                    return [x+1,y-1]
                elif y < 0 and x > 0:
                    return [x-1,y-1]

        
        elif board[y][x].name == 'Rook':
            print(207)
            posnewx = x
            posnewy = y
            negnewx = x
            negnewy = y
            attacked = []
            while posnewx < 9 or posnewy < 9 or negnewx > 0 or negnewy > 0:
                if posnewx < 8:
                    posnewx += 1
                    attacked.append([posnewx,y])
                    print(1)
                elif posnewy < 8:
                    posnewy += 1
                    attacked.append([x,posnewy])
                    print(2)
                elif negnewx > 0:
                    negnewx -= 1
                    attacked.append([negnewx,y])
                    print(3)
                elif negnewy > 0:
                    negnewy -= 1
                    attacked.append([x,negnewy])
                    print(4)
            print(5)
            return attacked
        

        elif (board[y][x].name == 'Knight'):
            print(3)
            posnewx1 = x+1
            posnewx2 = x+2
            posnewy1 = y+2
            posnewy2 = y+1
            negnewx1 = x-1
            negnewx2 = x-2
            negnewy1 = y-2
            negnewy2 = y-1
            attacked = []
            if (0 < posnewx1 > 9) and (0 < posnewy1 >9):
                attacked.append([posnewx1,posnewy1])
            elif (0 < posnewx2 > 9) and (0 < posnewy2 >9):
                attacked.append([posnewx2,posnewy2])
            elif (0 < negnewx1 > 9) and (0 < negnewy1 >9):
                attacked.append([negnewx1,negnewy1])
            elif (0 < negnewx2 > 9) and (0 < negnewy2 >9):
                attacked.append([negnewx2,negnewy2])
            return attacked

        elif board[y][x].name == 'Bishop':
            print(4)
            posnewx = x
            posnewy = y
            negnewx = x
            negnewy = y
            attacked = []
            while posnewx < 9 or posnewy < 9 or negnewx > 0 or negnewy > 0:
                if posnewx < 8 and posnewy < 8:
                    posnewx += 1
                    posnewy += 1
                    attacked.append([posnewx,posnewy])
                elif posnewx < 8 and negnewy > 0:
                    posnewx += 1
                    negnewy -= 1
                    attacked.append([posnewx,posnewy])
                elif negnewx > 0 and posnewy < 8:
                    negnewx -= 1
                    posnewy += 1
                    attacked.append([posnewx,posnewy])
                elif negnewx > 0 and negnewy > 0:
                    negnewx -= 1
                    negnewy -= 1
                    attacked.append([posnewx,posnewy])
            return attacked
        
        elif board[y][x].name == 'Queen':
            print(5)
            posnewx = x
            posnewy = y
            negnewx = x
            negnewy = y
            attacked = []
            while posnewx < 9 or posnewy < 9 or negnewx > 0 or negnewy > 0:
                if posnewx < 8 and posnewy < 8:
                    posnewx += 1
                    posnewy += 1
                    attacked.append([posnewx,posnewy])
                elif posnewx < 8 and negnewy > 0:
                    posnewx += 1
                    negnewy -= 1
                    attacked.append([posnewx,posnewy])
                elif negnewx > 0 and posnewy < 8:
                    negnewx -= 1
                    posnewy += 1
                    attacked.append([posnewx,posnewy])
                elif negnewx > 0 and negnewy > 0:
                    negnewx -= 1
                    negnewy -= 1
                    attacked.append([posnewx,posnewy])
                elif posnewx < 8:
                    posnewx += 1
                    attacked.append([posnewx,y])
                elif posnewy < 8:
                    posnewy += 1
                    attacked.append([x,posnewy])
                elif negnewx > 0:
                    negnewx -= 1
                    attacked.append([negnewx,y])
                elif negnewy > 0:
                    negnewy -= 1
                    attacked.append([x,negnewy])
            return attacked

        elif board[y][x].name == 'King':
            print(6)
            posnewx = x+1
            posnewy = y+1
            negnewx = x-1
            negnewy = y-1
            attacked = []
            if posnewy < 9:
                attacked.append([x,posnewy])
            elif negnewy > 0:
                attacked.append([x,negnewy])
            elif posnewy < 9 and posnewx < 9:
                attacked.append([posnewx,posnewy])
            elif posnewx < 9:
                attacked.append([posnewx,y])
            elif posnewx < 9 and negnewy > 0:
                attacked.append([posnewx,negnewy])
            elif posnewy < 9 and negnewx > 0:
                attacked.append([negnewx,posnewy])
            elif negnewx > 0:
                attacked.append([negnewx,y])
            elif negnewx > 0 and negnewy > 0:
                attacked.append([negnewx,negnewy])
            return attacked

        else:
            print(404)