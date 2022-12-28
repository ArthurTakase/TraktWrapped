import wget
from zipfile import ZipFile
from datetime import datetime
from os import listdir
from os.path import isfile, join
import json
import requests
from shutil import rmtree
from os import remove, mkdir

class Data:
    def __init__(self, username, type):
        self.username = username
        self.type = type
        self.data = []

        print("Downloading data...")

        if type == "trakt":
            try : mkdir("data")
            except: pass
            
            self.trakt_data()
            self.get_file()
            self.data = self.open_file()
        elif type == "rawg":
            self.rawg_data(f"https://rawg.io/api/users/{self.username}/games?page_size=10000")

        print("Data downloaded!")

    def trakt_data(self):
        date = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        self.filename = f"data/trakt_{self.username}_{date}"
        wget.download(f"https://darekkay.com/service/trakt/trakt.php?username={self.username}", f"{self.filename}.zip")
        with ZipFile(f"{self.filename}.zip", 'r') as zipObj: zipObj.extractall(self.filename)

    def rawg_data(self, url):
        response = requests.get(url).json()
        self.data += response["results"]
        if response["next"] != None: self.rawg_data(response["next"])
    
    def get_file(self):
        self.files = [f for f in listdir(self.filename) if isfile(join(self.filename, f))]
        self.files.sort()
        print("Select a file:")
        for i in range(len(self.files)): print(f"{i} {self.files[i]}")
        self.select_file = self.files[int(input("File: "))]
    
    def open_file(self):
        with open(f"{self.filename}/{self.select_file}") as f: data = json.load(f)
        return data

    def clean(self):
        if self.type == "trakt":
            rmtree("data")