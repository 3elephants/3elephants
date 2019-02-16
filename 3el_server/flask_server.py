from flask import Flask, request, json
app = Flask(__name__)

from enum import Enum
from collections import Counter

from pymongo import MongoClient
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

_ONE_DAY_IN_SECONDS = 60 * 60 * 24
class ProductType(Enum):
    FOOD = 1
    COSMETICS = 2
class Classification(Enum):
    GOOD = 1
    BAD = 2
    NONE = 3
client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]


@app.route('/GetProductClass')
def GetProductClass():
    name = request.args.get('name')

    #query
    cursorCosm = cosmListings.find(
        {'$text': {'$search': name}},
        {'score': {'$meta': 'textScore'}})

    cursorFood = foodListings.find(
        {'$text': {'$search': name}},
        {'score': {'$meta': 'textScore'}})


    # Sort by 'score' field.
    cursorCosm.sort([('score', {'$meta': 'textScore'})])
    cursorFood.sort([('score', {'$meta': 'textScore'})])

    numberReturnedCosm = 0 if not cursorCosm else cursorCosm.count()
    numberReturnedFood = 0 if not cursorFood else cursorFood.count()
    print(numberReturnedCosm, numberReturnedFood)


    #functions

    #convert cosmetics class name to class 3 Elephants score
    def classToNumber(cLabel):
        return 1 if cLabel == 'Y' else 0

    #convert ewg food score to 3 Elephants score
    def scoreToNumber(score):
        return 1 - (score - 1)/9

    def getUnitRating(pType, param):
        if pType == ProductType.COSMETICS:
            return classToNumber(param["ewg_verified"])
        else:
            return scoreToNumber(param["scores"]["overall"])

    def cleanQuery(query):
        stop_words = set(stopwords.words('english'))
        word_tokens = word_tokenize(query)
        return [w for w in word_tokens if not w in stop_words]

    #gets the score based on food collection query
    # for use only when len(query results) > 0
    def getScore(cursor, pType):
        startItem = cursor[0]
        startName = startItem["name"]

        if startItem["name"] == name:
            return getUnitRating(pType, startItem)
        else:
            numWords = len(Counter(cleanQuery(name)))

            maxScore =  numWords * 9 #TODO: make score max calculation more accurate
            # if pType == ProductType.COSMETICS:
            #     maxScore = 5

            factor = 0.5
            totalPossible = 0
            weightedSum = 0
            count = 5
            for startItem in cursor:
                if count == 0:
                    break

                weightedSum += factor * getUnitRating(pType, startItem)
                totalPossible += factor
                factor *= factor
                count -=1
            if totalPossible == 0:

                return 0.5 #we assume there is not enough data if no data point is above the threshold for a match

            weightedAverage = weightedSum / totalPossible
            return weightedAverage


    #run logic
    finalScore = 0.5
    if numberReturnedCosm != 0 and numberReturnedFood!=0:
        finalScore = getScore(cursorFood, ProductType.FOOD) if cursorFood[0]["score"] > cursorCosm[0]["score"] else \
            getScore(cursorCosm, ProductType.COSMETICS)
    elif numberReturnedFood > 0:
        finalScore = getScore(cursorFood, ProductType.FOOD)
    elif numberReturnedCosm > 0:
        finalScore = getScore(cursorCosm, ProductType.COSMETICS)

    print(finalScore)
    # return logic
    if finalScore > 0.8:
        return json.dumps({'classification':0})
    elif finalScore < 0.2:
        return json.dumps({'classification':1})


    return json.dumps({'classification':2})


if __name__ == '__main__':
    app.run()