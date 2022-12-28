from copy import deepcopy
from src.Game import Game
from src.Movie import Movie
from os import mkdir

class Collection:
    def __init__(self, data, type_data):
        self.data = data
        self.lenght = len(self.data)

        try : mkdir("posters")
        except: pass

        if type_data == "game": self.gameCollection()
        else: self.movieCollection(type_data)


    def gameCollection(self):
        self.data = [Game(game, self.lenght, i) for i, game in enumerate(self.data)]
    
    def movieCollection(self, type_data):
        type_tmdb = "tv" if type_data == "show" else "movie"
        self.data = [Movie(movie, type_data, type_tmdb, self.lenght, i) for i, movie in enumerate(self.data)]

    def sort(self, sort):
        temp = deepcopy(self.data)
        for key, value in sort.items():
            if key == "type" or key == "tmdb": continue
            temp = [temp[i] for i in range(len(temp)) if temp[i].__dict__[key] == value]
        return temp