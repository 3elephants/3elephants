from flask_server import *
import multiprocessing as mp
from multiprocessing.pool import ThreadPool

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




#actual function
def search_results_page_cache(event, context):
    return search_results_page_cache_multithreaded(event, context)




