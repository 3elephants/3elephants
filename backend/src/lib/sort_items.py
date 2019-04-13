import multiprocessing as mp
from pymongo import MongoClient
from multiprocessing.pool import ThreadPool
from .query_item import *
import os
#multithreaded implementation

def searchResultsPageCacheMultithreaded(params):
    cosmListings = params["cosmListings"]
    foodListings = params["foodListings"]

    def poolRequests(pair):
        idx, name = pair
        params = {
            "name": name,
            "cosmListings": cosmListings,
            "foodListings": foodListings
        }
        result = json.loads(firstPrototypeCall(params))
        result["orig_pos"] = idx
        return result

    cachedStopWords = stopwords.words("english")
    products = params["products"]
    scores = [tuple([idx, name]) for idx, name in enumerate(products)]
    pool = ThreadPool(32)
    scores = pool.map(poolRequests, scores)
    scores.sort(key=lambda x: -1 * x["score"])
    return json.dumps(scores)

# combined technique - multiprocessing and multithreading

def poolRequestsMpCombined(products, child_conn):

    currClient = MongoClient(
        os.environ.get('MONGO_URL'),
        27017)

    currDb = currClient["3elephants"]
    currFoodListings = currDb["foodListings"]
    currCosmListings = currDb["cosmListings"]

    def poolRequests(pair):
        idx, name = pair

        params = {
            "name": name,
            "cosmListings": currCosmListings,
            "foodListings": currFoodListings
        }
        result = json.loads(firstPrototypeCall(params))
        result["orig_pos"] = idx
        return result


    scores = [tuple([idx, name]) for idx, name in enumerate(products)]
    pool = ThreadPool(32)
    scores = pool.map(poolRequests, scores)
    scores.sort(key=lambda x: -1 * x["score"])
    child_conn.send(scores)

def mergeSortedLists(listA, listB):
    i = 0
    j = 0
    result = []
    while i < len(listA) and j < len(listB):
        if listA[i]["score"] < listB[j]["score"]:
            result.append(listA[i])
            i+=1
        else:
            result.append(listB[j])
            j+=1
    while i < len(listA):
        result.append(listA[i])
        i+=1
    while j < len(listB):
        result.append(listB[j])
        j+=1
    return result


def combinedTechnique(params):
    products = params["products"]
    processAmount = 4
    parentConns = []
    childConns = []
    processes = []

    cachedStopWords = stopwords.words("english")

    sizeIncrement = len(products) / processAmount
    currentIndex = 0

    for i in range(processAmount):
        childConn, parentConn = mp.Pipe()
        parentConns.append(parentConn)
        childConns.append(childConn)
        nextIndex = int(min(len(products), currentIndex + sizeIncrement))

        splice = products[currentIndex:(nextIndex)]
        newP = mp.Process(target=poolRequestsMpCombined, args=(splice, childConn))
        currentIndex = nextIndex
        processes.append(newP)

    for process in processes:
        process.start()

    for process in processes:
        process.join()
    scores = []
    for parentConnection in parentConns:
        result = parentConnection.recv()
        scores = mergeSortedLists(result, scores)
    return {"body":json.dumps(scores), "statusCode":200}
