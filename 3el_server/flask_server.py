from flask import Flask, request
from lib.function_calls import *
app = Flask(__name__)


from pymongo import MongoClient



client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]


@app.route('/GetProductClass')
def GetProductClass():
    name = request.args.get('name')
    params = {
        "name":name,
        "cosmListings":cosmListings,
        "foodListings":foodListings
    }
    return evalLogic(firstPrototypeCall, params)


def evalLogic(logic, params):
    return logic(params)

if __name__ == '__main__':
    app.run()