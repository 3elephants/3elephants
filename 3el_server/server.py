import logging
import time
from concurrent import futures
from enum import Enum
from collections import Counter
import grpc
import three_el_pb2
import three_el_pb2_grpc
from pymongo import MongoClient
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]


class ProductType(Enum):
    FOOD = 1
    COSMETICS = 2

class RatingProviderServicer(three_el_pb2_grpc.RatingProviderServicer):


    def GetProductClass(self, request, context):

        #query
        cursorCosm = cosmListings.find(
            {'$text': {'$search': request.name}},
            {'score': {'$meta': 'textScore'}})

        cursorFood = foodListings.find(
            {'$text': {'$search': request.name}},
            {'score': {'$meta': 'textScore'}})


        # Sort by 'score' field.
        cursorCosm.sort([('score', {'$meta': 'textScore'})])
        cursorFood.sort([('score', {'$meta': 'textScore'})])

        numberReturnedCosm = 0 if not cursorCosm else cursorCosm.count()
        numberReturnedFood = 0 if not cursorFood else cursorFood.count()



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

            if startItem["name"] == request.name:
                return getUnitRating(pType, startItem)
            else:
                numWords = len(Counter(cleanQuery(request.name)))

                maxScore =  numWords * 9 #TODO: make score max calculation more accurate
                # if pType == ProductType.COSMETICS:
                #     maxScore = 5
                print(maxScore)
                factor = 0.5
                totalPossible = 0
                weightedSum = 0
                for startItem in cursor:
                    if startItem["score"] / maxScore < 0.6:
                        break

                    weightedSum += factor * getUnitRating(pType, startItem)
                    totalPossible += factor
                    factor *= factor

                if totalPossible == 0:
                    print("threshold")
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

        # return logic
        if finalScore > 0.8:
            return three_el_pb2.Classification(class_type=three_el_pb2.Classification.GOOD)
        elif finalScore < 0.2:
            return three_el_pb2.Classification(class_type=three_el_pb2.Classification.BAD)


        return three_el_pb2.Classification(class_type=three_el_pb2.Classification.NONE)


#code adapted from from https://github.com/grpc/grpc/blob/master/examples/python/helloworld/greeter_server.py
def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  three_el_pb2_grpc.add_RatingProviderServicer_to_server(
      RatingProviderServicer(), server)
  server.add_insecure_port('[::]:50051')

  server.start()
  try:
      while True:
          time.sleep(_ONE_DAY_IN_SECONDS)
  except KeyboardInterrupt:
      server.stop(0)


if __name__ == "__main__":
    logging.basicConfig()
    print("server starting...")
    serve()