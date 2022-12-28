from os import mkdir
from sys import argv
from src.Collection import Collection
from src.Poster import Poster
from src.Data import Data
from src.Game import set_sort_game
from src.Movie import set_sort_movie

def main(func, type):
    username = input("Username: ")
    data = Data(username, type)
    export = True if "-txt" in argv else False
    poster = True if "-poster" in argv else False
    gif = True if "-gif" in argv else False

    sort, coll_type = func(data)

    coll = Collection(data.data, coll_type)
    sort_coll = coll.sort(sort)
    if poster:
        padding_x = int(input("padding X: "))
        padding_y = int(input("padding Y: "))
        Poster(sort_coll, (padding_x, padding_y)).generate("poster")
    if export: Poster(sort_coll).export("export")
    if gif: Poster(sort_coll).gif("gif")

    data.clean()

if __name__ == "__main__":
    if "-h" in argv or ("-rawg" not in argv and "-trakt" not in argv):
        print("Usage: python main.py [-h] [-txt] [-poster] [-gif] [-trakt] [-rawg]")
        print("-h: display this help")
        print("-txt: export the collection to a txt file")
        print("-poster: generate a poster of the collection")
        print("-gif: generate a GIF of the collection")
        print("-t: set data as TV (Trakt only))")
        print("-g: set data as Game (RAWG only)")
    elif "-rawg" in argv: main(set_sort_game, "rawg")
    elif "-trakt" in argv: main(set_sort_movie, "trakt")