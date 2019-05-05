
from lib.sort_items import *
from lib.query_item import *
import json
from elasticsearch_dsl.connections import connections
from elasticsearch import RequestsHttpConnection
import os
import urllib.parse

from requests_aws4auth import AWS4Auth
service = 'es'
region = 'us-east-1'
awsauth = AWS4Auth( os.environ.get('AWS_ACCESS'), os.environ.get('AWS_SECRET'), region, service)

# Define a default Elasticsearch client
connections.create_connection(hosts=["https://"+ os.environ.get('ELASTIC_URL')], http_auth = awsauth,use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection)

indices = ["electronics_gp", "fashion_goy", "household_nlm", "food_ewg", "cosm_ewg"]
def getProductClass(event, context):

    name = urllib.parse.unquote(event["queryStringParameters"].get('producttitle'))
    brand = urllib.parse.unquote(event["queryStringParameters"].get('bylineinfo'))
    asin = event["queryStringParameters"].get('asin')
    betaMode = (event["queryStringParameters"].get('mode') == "true")
    indices = getAllIndices()
    if(brand == None):
        indices = filterOutBrandIndices(indices)
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
    eventBody =  json.loads(event["body"])
    if eventBody.get("nodeid") != None:
        productCategory = similarity.getCategory(eventBody.get("nodeid"))
        if similarity.isExcluded(productCategory):
            return {"has_results": False}
        indices = calculateSimilarities(productCategory, indices)

    params = {
        "products": eventBody["products"],
        "productCategory": productCategory,
        "indices": indices
    }
    response = bulkElasticSearchRequest(params)
    response = [response[i: (i + len(indices))] for i in range(0, len(response), len(indices))]
    params["responses"] = response
    return postProcess(bulkPostProcessResults(params))

def postProcess(results):
    return {"body": json.dumps(results), "statusCode": 200}

