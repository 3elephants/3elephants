import json
from pprint import pprint
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['3elephants']
fashionGOY = db["fashionGOY"]

def addToDatabase(documents):
    fashionGOY.insert_many(documents)



def main():
    with open("good_for_you_data.json") as f:
        data = json.load(f)
        addToDatabase(data)


main()