
from lib.sort_items import *
from lib.query_item import *
import json
from elasticsearch_dsl.connections import connections

# Define a default Elasticsearch client
connections.create_connection(hosts=['localhost'])

indices = ["electronics_gp", "fashion_goy", "household_nlm", "food_ewg", "cosm_ewg"]
def getProductClass(event, context):

    name = event["queryStringParameters"].get('name')
    brand = event["queryStringParameters"].get('brand')
    asin = event["queryStringParameters"].get('asin')
    betaMode = (event["queryStringParameters"].get('mode') == "true")
    indices = getAllIndices()
    if event["queryStringParameters"].get("nodeid") != None:
        productCategory = similarity.getCategory(event["queryStringParameters"].get("nodeid"))
        if similarity.isExcluded(productCategory):
            return {"has_results": False}
        indices = calculateSimilarities(productCategory, indices)

    params = {
        "name": name,
        "brand":brand,
        "betaMode": betaMode,
        "indices": indices
    }
    if asin != None:
        params["asin"] = asin
    params["responses"] = elasticSearchRequest(params)
    return postProcess(postProcessResults(params))

def batchProductClassQuery(event, context):
    productCategory = None
    indices = getAllIndices()
    indices = filterOutBrandIndices(indices)

    if event["body"].get("nodeid") != None:
        productCategory = similarity.getCategory(event["body"].get("nodeid"))
        if similarity.isExcluded(productCategory):
            return {"has_results": False}
        indices = calculateSimilarities(productCategory, indices)

    params = {
        "products": json.loads(event["body"]["products"]),
        "productCategory": productCategory,
        "indices": indices
    }
    response = bulkElasticSearchRequest(params)
    response = [response[i:i + len(indices)] for i in range(0, len(response), len(indices))]
    params["responses"] = response
    return postProcess(bulkPostProcessResults(params))

def postProcess(results):
    return {"body": json.dumps(results), "statusCode": 200}

