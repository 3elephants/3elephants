from flask import Flask, request, json
from lib.utilfunctions import *
from lib.function_calls import *
application = Flask(__name__)


from pymongo import MongoClient
import os


client = MongoClient(os.environ.get('MONGO_URL'), 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]


@application.route('/GetProductClass')
def GetProductClass():
    name = request.args.get('name')
    asin = request.args.get('asin')
    print("made it here")
    betaMode = (request.args.get('mode') == 'true')
    params = {
        "name":name,
        "cosmListings":cosmListings,
        "foodListings":foodListings,
        "betaMode": betaMode
    }
    if asin!=None:
        params["asin"] = asin
    return evalLogic(firstPrototypeCall, params)

@application.route('/GetSearchResultsPageCache', methods=['POST'])
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
    application.run()
