from math import ceil, sqrt
from datetime import datetime
from PIL import Image
from src.Game import Game
from os import mkdir
import json

class Create:
    def __init__(self, data, infos = (0, 0)):
        self.infos = infos
        self.data = data

        try : mkdir("exports")
        except: pass
    
    def posterSize(self):
        self.size = ceil(sqrt(len(self.data)))
        self.posterWidth = 400 if isinstance(self.data[0], Game) else self.data[0].poster.width
        self.posterHeight = 400 if isinstance(self.data[0], Game) else self.data[0].poster.height
        self.resultWidth = self.posterWidth * (self.size  + self.infos[0])
        self.resultHeight = self.posterHeight * (self.size + self.infos[1])
        self.result = Image.new("RGB", (self.resultWidth, self.resultHeight))

    def poster(self, name):
        print("Exporting Collection to JPEG...")
        self.posterSize()
        for i in range(len(self.data)):
            if self.data[i].poster is None: continue
            print(f"\033[92m({i + 1}/{len(self.data)})\033[0m \033[96mGenerating image\033[0m {self.data[i].title}")
            self.result.paste(self.data[i].compress(self.posterWidth, self.posterHeight), (self.posterWidth * (i % self.size), self.posterHeight * (i // self.size)))

        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        self.result.save(f"exports/{name}_{date}.jpg", quality=50)
    
    def txt(self, name):
        print("Exporting Collection to TXT...")
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        with open(f"exports/{name}_{date}.txt", "w") as f:
            for game in self.data: f.write(f"{game.title} ({game.year})\n")

    def json(self, name):
        print("Exporting Collection to JSON...")
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        data = {}
        for i, content in enumerate(self.data):
            data[i] = {"title": content.title, "year": content.year, "id": content.id, "genres": content.genres, "country": content.country}
        json.dump(data, open(f"exports/{name}_{date}.json", "w"))

    def gif(self, name):
        print("Exporting Collection to GIF...")
        self.posterSize()
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        frames = [self.data[i].compress(self.posterWidth, self.posterHeight) for i in range(len(self.data)) if self.data[i].poster is not None]
        frame_one = frames[0]
        frame_one.save(f"exports/{name}_{date}.gif", format="GIF", append_images=frames, save_all=True, duration=50, loop=0)
