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
        if board[starty][startx].team == 'White' and desty-starty == -1 and startx == destx:
            return True
        elif board[starty][startx].team == 'Black' and desty-starty == 1 and startx == destx:
            return True
        elif self.first == True and board[starty][startx].team == 'White' and desty-starty == -2 and startx == destx:
            return True
        elif self.first == True and board[starty][startx].team == 'Black' and desty-starty == 2 and startx == destx:
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