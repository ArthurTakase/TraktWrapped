from sys import argv
from src.Collection import Collection
from src.Create import Create
from src.Data import Data
from src.Game import set_sort_game
from src.Movie import set_sort_movie
from src.Graph import Graph

def main(func, type):
    username = input("Username: ")
    data = Data(username, type)
    export = True if "-txt" in argv else False
    poster = True if "-poster" in argv else False
    gif = True if "-gif" in argv else False
    json = True if "-json" in argv else False

    sort, coll_type = func(data)

    coll = Collection(data.data, coll_type)
    sort_coll = coll.sort(sort)
    if poster:
        padding_x = int(input("padding X: "))
        padding_y = int(input("padding Y: "))
        Create(sort_coll, (padding_x, padding_y)).poster("poster")
    if export: Create(sort_coll).txt("export")
    if gif: Create(sort_coll).gif("gif")
    if json: Create(sort_coll).json("json")

    data.clean()

if __name__ == "__main__":
    if "-h" in argv:
        print("Usage: python main.py [-h] [-txt] [-poster] [-gif] [-json] [-trakt | -rawg | -genre]")
        print("-h: display this help")
        print("-txt: export the collection to a txt file")
        print("-poster: generate a poster of the collection")
        print("-gif: generate a GIF of the collection")
        print("-trakt: set data as TV (Trakt only))")
        print("-rawg: set data as Game (RAWG only)")
        print("-genre: create a graph from collection (need a json file from -json)")
    elif "-genre" in argv: Graph()
    elif "-rawg" in argv: main(set_sort_game, "rawg")
    elif "-trakt" in argv: main(set_sort_movie, "trakt")