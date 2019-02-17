from flask import Flask, request
from lib.function_calls import *
app = Flask(__name__)


from pymongo import MongoClient


_ONE_DAY_IN_SECONDS = 60 * 60 * 24

client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]


@app.route('/GetProductClass')
def GetProductClass():
    name = request.args.get('name')
    return firstPrototypeCall(name, cosmListings, foodListings)


if __name__ == '__main__':
    app.run()