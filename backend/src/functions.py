
from lib.sort_items import *

client = MongoClient(os.environ.get('MONGO_URL'), 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]

def getProductClass(event, context):

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
    return postProcess(firstPrototypeCall(params))

def batchProductClassQuery(event, context):
    params = {
        "products": json.loads(event["body"]),
        "cosmListings":cosmListings,
        "foodListings":foodListings
    }
    return postProcess(searchResultsPageCacheMultithreaded(params))

def postProcess(results):
    return {"body": results, "statusCode": 200}
