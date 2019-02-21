from util_functions import *
from collections import Counter
from enum import Enum
from flask import json

class ProductType(Enum):
    FOOD = 1
    COSMETICS = 2

def firstPrototypeCall(params):

    #set variables
    name = params.get("name")
    asin = params.get("asin")
    betaMode = params.get("betaMode")
    cosmListings = params["cosmListings"]
    foodListings = params ["foodListings"]
    thresholdEcoAccuracy = 0.8

    if not betaMode:
        thresholdEcoAccuracy = 0.9
    # functions

    # convert cosmetics class name to class 3 Elephants score
    def classToNumber(cLabel):
        return 1 if cLabel == 'Y' else 0

    # convert ewg food score to 3 Elephants score
    def scoreToNumber(score):
        if (score < 1):
            score = 1
        if (score > 10):
            score = 10
        return 1 - (score - 1) / 9

    def extractCosmRatingInfo(cosmInfo):
        dataQualityMap = {"None": 1, "Limited": 2, "Fair": 3, "Good": 4, "Robust": 5}
        score, dataQuality = cosmInfo.split("_")

        return dataQualityMap[dataQuality], scoreToNumber(int(score))

    def getUnitRating(pType, param):
        if pType == ProductType.COSMETICS:

            return extractCosmRatingInfo(param["score"])
        else:
            return None, scoreToNumber(param["scores"]["overall"])



    #query

    if asin != None:
        asinCursor = foodListings.find({"asin_list": asin}) #if we find the asin in the database
        if asinCursor.count() > 0:
            return getUnitRating(ProductType.FOOD, asinCursor[0])

    cursorFood = foodListings.find(
        {'$text': {'$search': name}},
        {'search_score': {'$meta': 'textScore'}})


    cursorCosm = cosmListings.find(
        {'$text': {'$search': name}},
        {'search_score': {'$meta': 'textScore'}})





    # Sort by 'score' field.
    cursorCosm.sort([('search_score', {'$meta': 'textScore'})])
    cursorFood.sort([('search_score', {'$meta': 'textScore'})])

    numberReturnedCosm = 0 if not cursorCosm else cursorCosm.count()
    numberReturnedFood = 0 if not cursorFood else cursorFood.count()







    #gets the score based on food collection query
    # for use only when len(query results) > 0
    def getScore(cursor, pType, thresholdScore=0):
        startItem = cursor[0]
        startName = startItem["name"]

        if startName == name:
            return getUnitRating(pType, startItem)
        else:
            numWords = len(Counter(cleanQuery(name)))


            if betaMode:
                thresholdScore =  (numWords * 8)/(2.5 - 1.5/numWords) #if half to all words show up once in all fields we should include it
                                                                                           #more words means that if less of them match it is still accurate
                                                                                                     # because more matches
            else:
                thresholdScore = (numWords * 8)/(2.3 - 1.3/numWords)
            totalPossible = 0
            weightedSum = 0
            weightedSumDataQ = 0
            totalPossibleDataQ = 0
            count = 0
            for startItem in cursor:
                if count > 30 or startItem["search_score"] < thresholdScore: #if we have 30 items (assumed to be enough to describe any distribution or remaining results irrelevant break)
                    break
                factor = startItem["search_score"]
                dataQuality, rating = getUnitRating(pType, startItem)

                weightedSum += factor * rating
                if dataQuality != None:
                    weightedSumDataQ += factor * dataQuality
                    totalPossibleDataQ += factor
                totalPossible += factor
                count+=1


            if totalPossible == 0:

                return False, None, 0.6 #we assume there is not enough data if no data point is above the threshold for a match

            weightedAverage = weightedSum / totalPossible

            weightedAverageDataQ  = None
            if totalPossibleDataQ != 0:
                weightedAverageDataQ = weightedSumDataQ/totalPossibleDataQ
            return True, weightedAverageDataQ, weightedAverage


    #run logic
    finalScore = 0.6
    dQ = None
    hasResults = False
    if numberReturnedCosm != 0 and numberReturnedFood!=0:

        hasResults ,dQ,  finalScore = getScore(cursorFood, ProductType.FOOD) if cursorFood[0]["search_score"] > cursorCosm[0]["search_score"] else \
            getScore(cursorCosm, ProductType.COSMETICS)
    elif numberReturnedFood > 0:
        hasResults, dQ, finalScore = getScore(cursorFood, ProductType.FOOD)
    elif numberReturnedCosm > 0:
        hasResults, dQ, finalScore = getScore(cursorCosm, ProductType.COSMETICS)

    if dQ == None:
        dQ = 0
    # return logic
    if finalScore > thresholdEcoAccuracy:
        return json.dumps({'has_results': hasResults, 'data_quality':dQ, 'score':finalScore, 'classification':0})
    elif finalScore < 0.5:
        return json.dumps({'has_results': hasResults, 'data_quality':dQ, 'score':finalScore,'classification':1})


    return json.dumps({'has_results':hasResults,'data_quality':dQ, 'score':finalScore, 'classification':2})
