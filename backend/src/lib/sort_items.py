
from multiprocessing.pool import ThreadPool
from .query_item import *
import json

def filterOutBrandIndices(indices):
    newIndex = []
    for index in indices:

        if not interfaces[index].requiresBrand:
            newIndex.append(index)
    return newIndex

def bulkElasticSearchRequest(params):
    ms = MultiSearch()
    indices = params.get("indices")

    products = params.get("products")
    for product in products:
        currItemParams = {
            "category": params.get("productCategory"),
            "name": product,

        }
        for index in indices:
            ms = ms.add(Search.from_dict(interfaces[index].request(currItemParams))[:5].index(index))
    return ms.execute()

def bulkPostProcessResults(params):
    return bulkPostProcessResultsMultithreaded(params)


#multithreaded implementation
def bulkPostProcessResultsMultithreaded(gParams):
    def poolRequests(pair):
        idx, responses = pair
        params = {
            "responses": responses,
            "indices": gParams["indices"]
        }
        result = postProcessResults(params)
        if result["has_results"] == False:
            result["score"] = 0.6
        result["orig_pos"] = idx
        return result

    products = gParams["responses"]
    scores = [tuple([idx, product]) for idx, product in enumerate(products)]
    pool = ThreadPool(32)
    scores = pool.map(poolRequests, scores)
    scores.sort(key=lambda x: -1 * x["score"])
    return scores

