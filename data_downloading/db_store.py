import json
from pprint import pprint
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]

def addToDatabase(obj):
    foodScores = obj["foodscores"]["foods"]
    foodListings.insert_many(foodScores)
    cosmetics = obj["skindeep"]["cosmetics"]
    cosmListings.insert_many(cosmetics)



def readJson(fileNum):
    with open("report_results_"+str(fileNum)+".json") as f:
        data = json.load(f)

        addToDatabase(data)


def main():
    for pNum in range(1, 2):
        readJson(pNum+1)
        print(pNum)

main()