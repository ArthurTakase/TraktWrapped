import matplotlib.pyplot as plt
from datetime import datetime
import json

class Graph:
    def __init__(self):
        filename = input("Filename: ")
        is_graph = input("Graph? (y/n): ") == "y"
        is_json = input("JSON? (y/n): ") == "y"

        with open(filename) as f: data = json.load(f)

        if is_graph: self.graph(data)
        if is_json: self.export(data)

    def graph(self, data):
        print("Graphing...")
        genres = {}
        for content in data:
            for genre in data[content]["genres"]:
                if genre in genres: genres[genre] += 1
                else: genres[genre] = 1

        genres = dict(sorted(genres.items(), key=lambda item: item[1], reverse=False))

        plt.subplot(1, 2, 1)
        plt.barh(list(genres.keys()), list(genres.values()), color="green")
        plt.subplot(1, 2, 2)
        plt.pie(list(genres.values()), labels=list(genres.keys()), autopct="%1.1f%%")
        plt.gcf().set_size_inches(18.5, 10.5)

        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        plt.savefig(f"exports/graph_{date}.png")
        # plt.show()

    def export(self, data):
        print("Exporting...")
        genres_movies = {}
        for content in data:
            for genre in data[content]["genres"]:
                if genre in genres_movies: genres_movies[genre].append(data[content]["title"])
                else: genres_movies[genre] = [data[content]["title"]]
        genres_movies = dict(sorted(genres_movies.items(), key=lambda item: len(item[1]), reverse=False))
        
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        json.dump(genres_movies, open(f"exports/genres_{date}.json", "w"))
