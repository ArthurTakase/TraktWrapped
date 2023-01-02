from PIL import Image
import urllib.request

class Game:
    def __init__(self, data, lenght, i):
        self.data = data
        self.title = data["name"]
        self.slug = data["slug"]
        self.released = data["released"]
        self.year = int(data["released"][:4])
        self.id = data["id"]
        self.background_image = data["background_image"]
        self.lenght = lenght
        self.country = []

        try: self.genres = [genre['slug'] for genre in data['genres']]
        except: self.genres = []

        try: self.poster = Image.open(f"posters/{self.slug}.png")
        except:
            urllib.request.urlretrieve(self.background_image, f"posters/{self.slug}.png")
            self.poster = Image.open(f"posters/{self.slug}.png")

        print(f"\033[92m({i + 1}/{self.lenght})\033[0m \033[94mLoad Game\033[0m {self.title} ({self.year})")

    def __repr__(self) -> str:
        return f"{self.id};{self.slug};{self.year}"

    def compress(self, posterWidth, posterHeight):
        middle = (self.poster.width/2, self.poster.height/2)
        demiLongeurCrop = (min(self.poster.width, self.poster.height)/2)
        imageTemp = self.poster.crop((middle[0] - demiLongeurCrop, middle[1] - demiLongeurCrop, middle[0] + demiLongeurCrop, middle[1] + demiLongeurCrop))
        self.poster = imageTemp.resize((posterWidth, posterHeight))
        return self.poster

def set_sort_game(_):
    sort = {}

    sort["year"] = input("Year (press Enter to skip): ")
    if sort["year"] == "": del sort["year"]
    else: sort["year"] = int(sort["year"])

    return sort, "game"