from flask import Flask, request
from lib.function_calls import *
import json
app = Flask(__name__)


from pymongo import MongoClient


print("Opening MongoClient")
client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]
print("Set database links")

@app.route('/GetProductClass')
def GetProductClass():
    print("a")
    name = request.args.get('name')
    params = {
        "name":name,
        "cosmListings":cosmListings,
        "foodListings":foodListings
    }
    print("b")
    return evalLogic(firstPrototypeCall, params)

@app.route('/GetSearchResultsPageCache')
def GetSearchResultsPageCache():
    names = request.args.get('jsonString')
    decoded = json.loads(names)
    scores = []

    for x in decoded['products']:
        params = {
            "name":x,
            "cosmListings":cosmListings,
            "foodListings":foodListings
        }
        temp = evalLogic(firstPrototypeCall, params)
        print(temp)
        scores.append(temp)

    # Converts scores Python array to a json string
    json_scores = json.dumps(scores) # Dumps means "dump string"

    return json_scores

def evalLogic(logic, params):
    return logic(params)

if __name__ == '__main__':
    app.run()
