import chess
from flask import Flask
from flask_restful import Resource, Api

board = chess.Board()
print(board)