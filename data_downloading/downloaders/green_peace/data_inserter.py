
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['3elephants']
electronicsGP = db["electronicsGP"]
greenPeaceMap = {'A': 1, 'A-': 2, 'B+': 3,'B':4,'B-':5, 'C+':6,'C':7, 'C-':8, 'D+': 9,'D':10, 'D-':11, 'F':12}
def addToDatabase(documents):
    electronicsGP.insert_many(documents)
    print("all electronics manafacturers added to database...")



import csv
import json
def parseData():
    # Open the CSV
    out = []
    with open('green_peace_data.csv', 'rU') as f:
        # Change each fieldname to the appropriate field name. I know, so difficult.
        reader = csv.DictReader(f, fieldnames=("name","letter_overall_rating", "energy_rating", "resources_rating", "chemicals_rating"))
        reader.__next__()
        # Parse the CSV into JSON
        out = [row for row in reader]
        for row in out:
            row["overall_rating"] = greenPeaceMap[row["letter_overall_rating"]]

        # Save the JSON
    return out

addToDatabase(parseData())