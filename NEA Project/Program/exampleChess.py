p_pos = 'e6'
colour = 'white'

# Create the board using 1's as empty squares
board = [['1'] * 8 for i in range(8)]

map_alpha_idx = {
   "a" : 0,
   "b" : 1,
   "c" : 2,
   "d" : 3,
   "e" : 4,
   "f" : 5,
   "g" : 6,
   "h" : 7
}

map_idx_alpha = {
   0: "a",
   1: "b",
   2: "c",
   3: "d",
   4: "e",
   5: "f",
   6: "g",
   7: "h"
}

uniDict = {"white" : {"Pawn" : "♙", "Rook" : "♖","Knight": "♘", "Bishop" : "♗", "King": "♔", "Queen": "♕" }, "black" : {"Pawn": "♟", "Rook": "♜", "Knight": "♞", "Bishop": "♝", "King": "♚", "Queen": "♛" }}

#   adding of white pieces
board[0][0] = uniDict['white']['Rook']
board[0][1] = uniDict['white']['Knight']
board[0][2] = uniDict['white']['Bishop']
board[0][3] = uniDict['white']['Queen']
board[0][4] = uniDict['white']['King']
board[0][5] = uniDict['white']['Bishop']
board[0][6] = uniDict['white']['Knight']
board[0][7] = uniDict['white']['Rook']

board[1][0] = uniDict['white']['Pawn']
board[1][1] = uniDict['white']['Pawn']
board[1][2] = uniDict['white']['Pawn']
board[1][3] = uniDict['white']['Pawn']
board[1][4] = uniDict['white']['Pawn']
board[1][5] = uniDict['white']['Pawn']
board[1][6] = uniDict['white']['Pawn']
board[1][7] = uniDict['white']['Pawn']

#   adding of black pieces
board[7][0] = uniDict['black']['Rook']
board[7][1] = uniDict['black']['Knight']
board[7][2] = uniDict['black']['Bishop']
board[7][3] = uniDict['black']['Queen']
board[7][4] = uniDict['black']['King']
board[7][5] = uniDict['black']['Bishop']
board[7][6] = uniDict['black']['Knight']
board[7][7] = uniDict['black']['Rook']

board[6][0] = uniDict['black']['Pawn']
board[6][1] = uniDict['black']['Pawn']
board[6][2] = uniDict['black']['Pawn']
board[6][3] = uniDict['black']['Pawn']
board[6][4] = uniDict['black']['Pawn']
board[6][5] = uniDict['black']['Pawn']
board[6][6] = uniDict['black']['Pawn']
board[6][7] = uniDict['black']['Pawn']

#  move coordinates for each type of piece
rook = [(1,0), (0,1), (-1,0), (0,-1)]
bishop = [(1,1), (-1,1), (1,-1), (-1,-1)]
knight_solutions = [(2,1), (1,2), (-1,2), (-2,1), (-2,-1), (-1,-2), (1,-2), (2,-1)]
pawn_moves_white = [(1, 0), (1, 1), (1, -1)]
pawn_moves_black = [(-1, 0), (-1, -1), (-1, 1)]

# list of pieces to iterate over so as not to repeat code
pieces = ['knight', 'rook', 'bishop', 'queen', 'king', 'pawn']

# reverse the board to enable accurate mapping of positions as per the output display
board = board[::-1]

def init_player():
    """Allows the player to pick a colour"""
    p = input("Please Pick a Colour B or W: ").upper()
    if p == 'B':
        human = 'black'
    else:
        human = 'white'

    computer = 'black' if p == 'W' else 'white'

    return human, computer

def init_board(pos):
    """ a reusable function to initilise the position on the board and return the results """
    y, x = list(pos.strip().lower())
    x = int(x) - 1
    y = map_alpha_idx[y]
    return x, y

def printBoard():
    """Prints a chessboard to the screen with the pieces current position in the board list"""
    print("\n\n  | A | B | C | D | E | F | G | H |")
    print("-" * 34)
    c = 8
    for i in board[0:8]:
        for k in range(0, 1):
            print((k + c),end=" | ")
        c -= 1
        for j in i:
            print(j, sep='|', end=' | ', flush=False)
        print()
    print('\n\n')

printBoard()

def moves(pos, colour, piece):
    """ recusively checks each space and returns a list of availble positions
        with opponenets pieces
     """
    # Init
    player = 'black' if colour == 'white' else 'white'
    opponent = 'white' if player == 'black' else 'black'

    spots_with_opponent_pics, opp, plyr, empty = [], [], [], []

    moves_dict = dict()

    def recursive_move(pos, colour, piece):

        j = init_board(pos)
        x = j[0]
        y = j[1]

        if (x + i[0]) >= 0 and (x + i[0]) < 8 and (y + i[1]) >= 0 and (y + i[1]) < 8:
            p = board[x + i[0]][y + i[1]]
            c = ''.join((map_idx_alpha[y + i[1]], str(x + i[0] + 1)))
           #is the square my colour?
            if p in uniDict[player].values():
                joined_up_p = c
                plyr.append(joined_up_p)

            #is the square opponents colour?
            elif p in uniDict[opponent].values():
                spots_with_opponent_pics.append(p)
                joined_up_opp = c
                opp.append(joined_up_opp)

            # Is the square empty?
            elif p == '1':
                joined_up_em = c
                empty.append(joined_up_em)
                if piece != 'knight':
                    if piece != 'king':
                        if piece != 'pawn':
                            recursive_move(joined_up_em, colour, piece)
    if rook:
        for i in rook:
            recursive_move(pos, colour, piece)
        moves_dict['rook'] = {'pics': spots_with_opponent_pics, 'player': plyr, 'opponent': opp, 'empty': empty}

    if bishop:
        spots_with_opponent_pics, opp, plyr, empty = [], [], [], []
        for i in bishop:
            recursive_move(pos,colour, piece)
        moves_dict['bishop'] = {'pics': spots_with_opponent_pics, 'player': plyr, 'opponent': opp, 'empty': empty}

    if piece == 'knight':
        spots_with_opponent_pics, opp, plyr, empty = [], [], [], []
        for i in knight_solutions:
            recursive_move(pos, colour, piece)
        moves_dict['knight'] = {'pics': spots_with_opponent_pics, 'player': plyr, 'opponent': opp, 'empty': empty}

    if piece == 'queen':
        moves_dict['queen'] = {'straight': moves_dict['rook'], 'diagonal': moves_dict['bishop']}

    if piece == 'king':
        moves_dict['king'] = {'straight': moves_dict['rook'], 'diagonal': moves_dict['bishop']}

    if piece == 'pawn':
        spots_with_opponent_pics, opp, plyr, empty = [], [], [], []

        if colour == 'white':
            for i in pawn_moves_white:
                recursive_move(pos, 'white', piece)

            moves_dict['pawn'] = {'pics': spots_with_opponent_pics if spots_with_opponent_pics else 0 , 'player': plyr, 'opponent': opp[1:] if opp else 0, 'empty': empty[0] if empty else 0}

        elif colour == 'black':
            for i in pawn_moves_black:
                recursive_move(pos, 'black', piece)

            moves_dict['pawn'] = {'pics': spots_with_opponent_pics[0] if spots_with_opponent_pics else 0 , 'player': plyr, 'opponent': opp[1:] if opp else 0, 'empty': empty[0] if empty else 0}

    return moves_dict


def moves_of_each_piece(pieces, p_pos, colour):
    """ assesses, returns and prints dictionaries of available moves for each piece on the board from a certain position"""
    all_moves_dict = dict()
    all_moves_dict['position'] = p_pos
    for i in pieces:
        s = str(i)
        print(i.title(), '\'s Moves: ')
        p = moves(p_pos, colour, i).get(i)
        all_moves_dict[i] = p

        if p == None:
            # print('none')
            pass
        else:
            for k in p:
                if p[k] == {}:
                    print(k)
                    # list_gen(p[k], s)
                print(k, ': ', p[k])
        print('\n')
    return all_moves_dict

moves_of_each_piece(pieces, p_pos, colour)

def make_a_move():
    """ Takes in starting position and desired end position.
        Evaluates whether the moves is legal.
        If the move is legal:
            make the current location empty ('1')
            make the new position vacated by the piece
    """
    pass


print(init_player())
print('position: ', p_pos, '\ncolour: ', colour, '\n')

# # # # Command line parser

import argparse, json

parser = argparse.ArgumentParser()
parser.add_argument("-p", "--piece", help="chess piece name: ex- rook, knight, pawn etc")
parser.add_argument("-l", "--location", help="chess notation string: ex- E4, D6 etc")
parser.add_argument("-c", "--colour", help="Colour: black or white")
args = parser.parse_args()


piece = args.piece.strip().lower()
location = args.location.strip()
colour = args.colour.strip()
# According to the type of piece adjust function
if (piece == 'rook'):
    print(json.dumps({"piece": piece,"current_location": location, 'colour': colour,
                      "solutions": moves(location, colour, 'rook', rook).get('rook')}))
elif (piece == "knight"):
    print(json.dumps({"piece": piece, "current_location": location, 'colour': colour,
                      "solutions": moves(location, colour, 'knight').get('knight')}))
elif (piece == "bishop"):
    print(json.dumps({"piece": piece, "current_location": location, 'colour': colour,
                      "solutions": moves(location, colour, 'bishop', bishop).get('bishop')}))
elif (piece == "queen"):
    print(json.dumps({"piece": piece, "current_location": location, 'colour': colour,
                      "solutions": moves(location, colour, 'queen', bishop, rook).get('queen')}))
elif (piece == "king"):
    print(json.dumps({"piece": piece, "current_location": location, 'colour': colour,
                      "solutions": moves(location, colour, 'king').get('king')}))
elif (piece == "pawn"):
    print(json.dumps({"piece": piece, "current_location": location, 'colour': colour,
                      "solutions": moves(location, colour, 'pawn').get('pawn')}))
