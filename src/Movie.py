from PIL import Image
import requests
import urllib.request

API_KEY = "29e2619a94b2f9dd0ca5609beac3eeda"

class Movie:
    def __init__(self, data, type_data, tmdb, lenght, i):
        self.type = type_data
        self.id = data[type_data]['ids']['tmdb']
        self.url = f"https://api.themoviedb.org/3/{tmdb}/{self.id}?api_key={API_KEY}&language=fr-FR"
        response = requests.get(self.url).json()

        try: self.genres = [genre['name'] for genre in response['genres']]
        except: self.genres = []

        try: self.title = response['name'] if type_data == "show" else response['title']
        except: self.title = data[type_data]['title']
        
        try: self.year = int(response['release_date'][0:4])
        except: self.year = data[type_data]['year']
        
        try: self.rating = data["rating"]
        except: self.rating = None
    
        self.get_poster(response, type_data)
        self.set_show(response, data, type_data)

        self.lenght = lenght

        print(f"\033[92m({i + 1}/{self.lenght})\033[0m \033[94mLoad Movie/Show\033[0m {self.title} ({self.year})")

    def set_show(self, response, data, type_data):
        if type_data != "show": return
        try:
            self.last_air_date = int(response['last_episode_to_air']["air_date"][0:4])
            self.last_episode = response['last_episode_to_air']['episode_number']
            self.season = response['last_episode_to_air']['season_number']
            self.season_seen = len(data["seasons"])
            self.episode_in_last_season = len(data["seasons"][-1]["episodes"])
            self.total_seen = 0
            for season in data["seasons"]: self.total_seen += len(season["episodes"])
        except: # si la série n'a pas encore été diffusée / n'a pas été regardée par l'utilisateur
            self.last_air_date = None
            self.last_episode = 100
            self.season = 0
            self.season_seen = 0
            self.episode_in_last_season = 0
            self.total_seen = 0
        self.up_to_date = self.season == self.season_seen and self.episode_in_last_season > (self.last_episode / 2)
        self.last_season = self.season_seen == self.season

    def get_poster(self, response, type_data):
        try: self.poster = Image.open(f"posters/{self.title}.png")
        except:
            try :
                self.poster_path = response['poster_path'] if type_data == "movie" else response['poster_path']
                poster_name = f"{self.title}_{self.year}_{self.type}.png"
                urllib.request.urlretrieve(f"https://image.tmdb.org/t/p/w500{self.poster_path}", f"posters/{poster_name}")
                self.poster = Image.open(f"posters/{poster_name}")
            except: self.poster_path, self.poster = None, None

    def compress(self, posterWidth, posterHeight):
        self.poster.thumbnail((posterWidth, posterHeight))
        self.poster = self.poster.resize((posterWidth, posterHeight))

        return self.poster

def set_sort_movie(data):
    type = "movie" if "movie" in data.select_file else "show"
    sort = {}

    if type == "show":
        sort["last_air_date"] = input("Last air date (press Enter to skip): ")
        sort["up_to_date"] = input("Up to date (y/n/Enter to skip): ")
        if sort["last_air_date"] == "": del sort["last_air_date"]
        else: sort["last_air_date"] = int(sort["last_air_date"])
        if sort["up_to_date"] == "": del sort["up_to_date"]
        else: sort["up_to_date"] = True if sort["up_to_date"] == "y" else False
    else:
        sort["year"] = input("Year (press Enter to skip): ")
        if sort["year"] == "": del sort["year"]
        else: sort["year"] = int(sort["year"])
    
    return sort, type