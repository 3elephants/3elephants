from flask import Flask, request, json
from lib.function_calls import *
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

@app.route('/GetSearchResultsPageCache', methods=['POST'])
def GetSearchResultsPageCache():
    requestInfo = request
    products = requestInfo.json

    scores = []
    #
    for idx, name in enumerate(products):
        params = {
            "name":name,
            "cosmListings":cosmListings,
            "foodListings":foodListings
        }
        result = json.loads(evalLogic(firstPrototypeCall, params))
        result["orig_pos"] = idx
        scores.append(result)
    scores.sort(key=lambda x: -1 * x["score"])


    #
    # # Converts scores Python array to a json string
    return json.dumps(scores) # Dumps means "dump string"


def evalLogic(logic, params):
    return logic(params)

if __name__ == '__main__':
    app.run()
