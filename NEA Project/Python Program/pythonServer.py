from flask import Flask
from flask_restful import Resource, Api
from pieceClasses import Pawn, Rook, Knight, Bishop, Queen, King, Empty
from myChessLogic import Logic
from boardClass import ChessBoard

#----------------------------------------------------------------------
#Main program
#----------------------------------------------------------------------

ChessBoard = ChessBoard()
ChessBoard.display()
ChessBoard.move(True)
