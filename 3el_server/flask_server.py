from flask import Flask, request, json

from lib.utilfunctions import *
from lib.function_calls import *
application = Flask(__name__)
import time
from multiprocessing.pool import ThreadPool


from pymongo import MongoClient
import os
import multiprocessing as mp

client = MongoClient("mongodb://client-mongo-user:dXN4Y3XEcTcWi5s@elephantscluster0-shard-00-00-fvddp.mongodb.net:27017,elephantscluster0-shard-00-01-fvddp.mongodb.net:27017,elephantscluster0-shard-00-02-fvddp.mongodb.net:27017/test?ssl=true&replicaSet=ElephantsCluster0-shard-0&authSource=admin&retryWrites=true", 27017)
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

def poolRequests(pair):
    idx, name = pair


    params = {
        "name": name,
        "cosmListings": cosmListings,
        "foodListings": foodListings
    }
    result = json.loads(evalLogic(firstPrototypeCall, params))
    result["orig_pos"] = idx
    return result

@application.route('/GetSearchResultsPageCache', methods=['POST'])
def GetSearchResultsPageCache():
    cachedStopWords = stopwords.words("english")

    requestInfo = request
    products = requestInfo.json
    scores = [tuple([idx, name]) for idx, name in enumerate(products)]
    pool = ThreadPool(32)
    scores = pool.map(poolRequests, scores)
    scores.sort(key=lambda x: -1 * x["score"])




    #
    # # Converts scores Python array to a json string
    return json.dumps(scores) # Dumps means "dump string"


def evalLogic(logic, params):
    return logic(params)

if __name__ == '__main__':
    application.run()
