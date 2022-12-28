from math import ceil, sqrt
from datetime import datetime
from PIL import Image
from src.Game import Game
from src.Movie import Movie
from os import mkdir

class Poster:
    def __init__(self, data, infos = (0, 0)):
        self.size = ceil(sqrt(len(data)))
        self.posterWidth = 640 if isinstance(data[0], Game) else data[0].poster.width
        self.posterHeight = 360 if isinstance(data[0], Game) else data[0].poster.height
        self.resultWidth = self.posterWidth * (self.size  + infos[0])
        self.resultHeight = self.posterHeight * (self.size + infos[1])
        self.result = Image.new("RGB", (self.resultWidth, self.resultHeight))
        self.data = data

        try : mkdir("exports")
        except: pass

    def generate(self, name):
        print("Exporting Collection to JPEG...")
        for i in range(len(self.data)):
            if self.data[i].poster is None: continue
            print(f"\033[92m({i + 1}/{len(self.data)})\033[0m \033[96mGenerating image\033[0m {self.data[i].title}")
            self.result.paste(self.data[i].compress(self.posterWidth, self.posterHeight), (self.posterWidth * (i % self.size), self.posterHeight * (i // self.size)))

        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        print(f"Saving image 'result-{date}.jpg'")
        self.result.save(f"exports/{name}_{date}.jpg", quality=50)
    
    def export(self, name):
        print("Exporting Collection to TXT...")
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        with open(f"exports/{name}_{date}.txt", "w") as f:
            for game in self.data: f.write(f"{game.title} ({game.year})\n")

    def gif(self, name):
        print("Exporting Collection to GIF...")
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        frames = [self.data[i].compress(self.posterWidth, self.posterHeight) for i in range(len(self.data)) if self.data[i].poster is not None]
        frame_one = frames[0]
        frame_one.save(f"exports/{name}_{date}.gif", format="GIF", append_images=frames, save_all=True, duration=50, loop=0)
