import matplotlib.pyplot as plt
from datetime import datetime
import json

class Graph:
    def __init__(self):
        filename = input("Filename: ")
        with open(filename) as f: data = json.load(f)
        c = self.country(data)
        g = self.genres(data)

        print("------ GENRES ------")
        is_graph_g = input("Graph? (y/n): ") == "y"
        is_json_g = input("JSON? (y/n): ") == "y"

        if is_graph_g: self.graph(g[1], "genres")
        if is_json_g: self.export(g[0], "genres")

        print("------ COUNTRY ------")
        is_graph_c = input("Graph? (y/n): ") == "y"
        is_json_c = input("JSON? (y/n): ") == "y"

        if is_graph_c: self.graph(c[1], "country")
        if is_json_c: self.export(c[0], "country")

    def genres(self, data):
        # movies sorted by genres
        genres_movies = {}
        for content in data:
            for genre in data[content]["genres"]:
                if genre in genres_movies: genres_movies[genre].append(data[content]["title"])
                else: genres_movies[genre] = [data[content]["title"]]
        genres_movies = dict(sorted(genres_movies.items(), key=lambda item: len(item[1]), reverse=False))

        # genres sorted by number of movies
        genres = {}
        for key in genres_movies: genres[key] = len(genres_movies[key])
        genres = dict(sorted(genres.items(), key=lambda item: item[1], reverse=True))

        return genres_movies, genres

    def country(self, data):
        country_movies = {}
        for content in data:
            for country in data[content]["country"]:
                if country in country_movies: country_movies[country].append(data[content]["title"])
                else: country_movies[country] = [data[content]["title"]]
        country_movies = dict(sorted(country_movies.items(), key=lambda item: len(item[1]), reverse=False))
        
        country = {}
        for key in country_movies: country[key] = len(country_movies[key])
        country = dict(sorted(country.items(), key=lambda item: item[1], reverse=True))

        return country_movies, country

    def graph(self, tab, title):
        print("Graphing...")

        # clear the graph
        plt.clf()
        plt.subplot(1, 2, 1)
        plt.barh(list(tab.keys()), list(tab.values()), color="blue")
        plt.subplot(1, 2, 2)
        plt.pie(list(tab.values()), labels=list(tab.keys()), autopct="%1.1f%%")
        plt.gcf().set_size_inches(18.5, 10.5)

        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        plt.savefig(f"exports/graph_{title}_{date}.png")

    def export(self, tab, title):
        print("Exporting...")
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        json.dump(tab, open(f"exports/{title}_{date}.json", "w"))
