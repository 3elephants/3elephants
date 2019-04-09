from flask_server import *
import multiprocessing as mp
from lib.utilfunctions import *
from lib.function_calls import *
from pymongo import MongoClient
from multiprocessing.pool import ThreadPool
import time

client = MongoClient(os.environ.get('MONGO_URL'), 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]

def lambda_handler(event, context):
    name = event["queryStringParameters"].get('name')
    asin = event["queryStringParameters"].get('asin')
    betaMode = (event["queryStringParameters"].get('mode') == 'true')
    params = {
        "name": name,
        "cosmListings": cosmListings,
        "foodListings": foodListings,
        "betaMode": betaMode
    }
    if asin != None:
        params["asin"] = asin

    return {"body":evalLogic(firstPrototypeCall, params), "statusCode": 200}



#search results sorting and caching


#multithreaded implementation
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

def search_results_page_cache_multithreaded(event, context):
    cachedStopWords = stopwords.words("english")
    products = json.loads(event["body"])
    scores = [tuple([idx, name]) for idx, name in enumerate(products)]
    pool = ThreadPool(32)
    scores = pool.map(poolRequests, scores)
    scores.sort(key=lambda x: -1 * x["score"])
    return {"body": json.dumps(scores), "statusCode": 200}



#multi process implementation
def poolRequestsMp(pair, child_conn):
    idx, name = pair

    currClient = MongoClient(
        os.environ.get('MONGO_URL'),
        27017)

    currDb = currClient["3elephants"]
    currFoodListings = currDb["foodListings"]
    currCosmListings = currDb["cosmListings"]
    params = {
        "name": name,
        "cosmListings": currCosmListings,
        "foodListings": currFoodListings
    }
    result = json.loads(evalLogic(firstPrototypeCall, params))
    result["orig_pos"] = idx
    child_conn.send(result)

def search_results_page_cache_multiprocess(event, context):
    products = json.loads(event["body"])
    scores = [] #results
    parent_connections = []
    processes = []

    for idx, name in enumerate(products):
        parent_conn, child_conn = mp.Pipe()
        parent_connections.append(parent_conn)
        newP = mp.Process(target=poolRequestsMp, args=(tuple([idx, name]), child_conn))
        processes.append(newP)

    for process in processes:
        process.start()

    for process in processes:
        process.join()

    for parent_connection in parent_connections:
        scores.append(parent_connection.recv())
    scores.sort(key=lambda x: -1 * x["score"])


    #
    # # Converts scores Python array to a json string
    return {"body":json.dumps(scores), "statusCode":200} # Dumps means "dump string"




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
        result = json.loads(evalLogic(firstPrototypeCall, params))
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


def combinedTechnique(event, context):
    products = json.loads(event["body"])
    processAmount = 4
    parentConns = []
    childConns = []
    processes = []

    cachedStopWords = stopwords.words("english")

    sizeIncrement = len(products) / processAmount
    currentIndex = 0

    # timeStart = time.time()

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
    # timeEnd = time.time()
    # print(timeEnd - timeStart)
    return {"body":json.dumps(scores), "statusCode":200}





#actual function
def search_results_page_cache(event, context):
    return search_results_page_cache_multithreaded(event, context)
