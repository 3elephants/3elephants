from abc import ABC, abstractmethod
from elasticsearch_dsl import MultiSearch, Search
from . import similarity


class AbstractRequestInterface(ABC):
    instance = None

    @classmethod
    def getInstance(cls, newInstance):
        """ Static access method. """
        if cls.instance == None:
            cls.instance = newInstance
        return cls.instance

    def __init__(self, params):
        self.sourceName = params["sourceName"]
        self.dataQuality = params["dataQuality"]
        self.baseUrl = params["baseUrl"]
        self.nameKey = params.get("queryNameKey")
        self.brandKey = params.get("queryBrandKey")
        self.requiresBrand = False

    @abstractmethod
    def getScore(self, response):
        pass

    @abstractmethod
    def getEndUrl(self, response):
        pass

    def requestBrand(self, params):
        return {
            "query": {
                "match_phrase": {
                    self.brandKey: {
                        "query": params["brand"]
                    }
                }
            }
        }

    def request(self, params):
        should = [{
            "match": {
                self.nameKey + ".shingles": params["name"]
            }
        }]
        if self.brandKey!=  None and params.get('brand') != None:
            should.append({
                "match_phrase": {
                    self.brandKey: params['brand']
                }
            })
        return {
            "query": {
                "bool": {
                    "must": {
                        "match": {
                            self.nameKey: {
                                "cutoff_frequency": 0.1,
                                "minimum_should_match": "-50%",
                                "query": params["name"]
                            }
                        }
                    },
                    "should": should
                }
            }
        }



    def response(self, responses):
        if len(responses) == 0:
            return -1

        # primary
        endUrl = self.getEndUrl(responses[0])
        dataQuality = self.dataQuality
        firstMetaScore = responses[0].meta.score

        totalScore = 0
        totalPossible = 0
        # scoring
        for i in range(len(responses)):
            metaScore = responses[i].meta.score

            if (firstMetaScore * 0.9 < metaScore):
                ratingScore = self.getScore(responses[i])
                if ratingScore != None:
                    totalScore += metaScore * ratingScore
                    totalPossible += metaScore
            else:
                break
        if totalPossible != 0:
            totalScore /= totalPossible
        else:
            return -1


        return (totalScore, dataQuality, {"source": self.sourceName, "url": self.baseUrl + endUrl})


class CosmEWG(AbstractRequestInterface):

    def getScore(self, score):
        if (score < 1):
            score = 1
        if (score > 10):
            score = 10
        return 1 - (score - 1) / 9

    def extractCosmRatingInfo(self, cosmInfo):
        if(cosmInfo == None):
            return None, None
        dataQualityMap = {"None": 1, "Limited": 2, "Fair": 3, "Good": 4, "Robust": 5}
        score, dataQuality = cosmInfo.split("_")

        return dataQualityMap[dataQuality], self.getScore(int(score))

    def getEndUrl(self, response):
        return response.product_id + "/A/"

    def response(self, responses):
        if len(responses) == 0:
            return -1

        # primary
        endUrl = self.getEndUrl(responses[0])
        dataQuality = self.dataQuality
        firstMetaScore = responses[0].meta.score

        totalScore = 0
        totalPossible = 0
        ewgRatedDataQuality = 0
        # scoring
        for i in range(len(responses)):
            metaScore = responses[i].meta.score

            if (firstMetaScore * 0.9 < metaScore):
                ewgDataQuality, ratingScore = self.extractCosmRatingInfo(responses[i].score)
                if ratingScore != None:
                    totalScore += metaScore * ratingScore
                    ewgRatedDataQuality += metaScore * ewgDataQuality
                    totalPossible += metaScore
            else:
                break
        if totalPossible != 0:
            totalScore /= totalPossible
            ewgRatedDataQuality/= totalPossible
            dataQuality += (ewgRatedDataQuality - 1)/2 - 1
        else:
            return -1


        return (totalScore, dataQuality, {"source": self.sourceName, "url": self.baseUrl + endUrl})


class FoodEWG(AbstractRequestInterface):

    def getScore(self, response):
        score = response.scores.overall
        if (score < 1):
            score = 1
        if (score > 10):
            score = 10
        return 1 - (score - 1) / 9

    def getEndUrl(self, response):
        return response.upc


class HouseholdNLM(AbstractRequestInterface):

    def getScore(self, response):
        response = response.to_dict()
        score = response.get("overall_rating")
        if score == None:
            return None

        return  (4 - score)/4

    def getEndUrl(self, response):
        return response.web_url




class FashionGOY(AbstractRequestInterface):

    def __init__(self, params):
        super().__init__(params)
        self.requiresBrand = True

    def getScore(self, response):
        response = response.to_dict()
        score = response.get("environment_rating")
        if score == -1.0:
            return None
        return  (score)/20

    def getEndUrl(self, response):
        return response.id

    def request(self, params):
        return super().requestBrand(params)

class ElectronicsGP(AbstractRequestInterface):
    def __init__(self, params):
        super().__init__(params)
        self.requiresBrand = True
        self.greenPeaceMap = {'A': 11, 'A-': 10, 'B+': 9, 'B': 8, 'B-': 7, 'C+': 6, 'C': 5, 'C-': 4, 'D+': 3, 'D': 2,
                         'D-': 1, 'F': 0}


    def getScore(self, response):

        score = self.greenPeaceMap.get(response.letter_overall_rating)
        if score == None:
            return None
        return  score/11

    def getEndUrl(self, response):
        return response.name + ".pdf"

    def request(self, params):
        return super().requestBrand(params)




dbs = {
    "food_ewg": {"sourceName": "Environmental Working Group",
                 "dataQuality": 1,
                 "baseUrl": "https://www.ewg.org/foodscores/products/",
                 "queryNameKey": "name"
                 },
    "household_nlm": {"sourceName": "National Library of Medicine",
                      "dataQuality": 3,
                      "baseUrl": "https://householdproducts.nlm.nih.gov/",
                      "queryNameKey": "product_name",
                      "queryBrandKey": "manufacturer"
                      },
    "fashion_goy": {"sourceName": "Good On You",
                    "dataQuality": 2,
                    "baseUrl": "https://directory.goodonyou.eco/brand/",
                    "queryBrandKey": "name"
                    },
    "electronics_gp": {"sourceName": "Greenpeace",
                       "dataQuality": 2,
                       "baseUrl": "https://www.greenpeace.org/usa/wp-content/uploads/2017/10/GGE2017_",
                       "queryBrandKey": "name"
                       },
    "cosm_ewg" : {"sourceName": "Environmental Working Group",
                       "dataQuality": 2,
                       "baseUrl": "https://www.ewg.org/skindeep/product/",
                       "queryNameKey": "name",
                        "queryBrandKey":"brand_name"
                       }
}

interfaces = {
    "food_ewg": FoodEWG.getInstance(FoodEWG(dbs["food_ewg"])),
    "household_nlm": HouseholdNLM.getInstance(HouseholdNLM(dbs["household_nlm"])),
    "electronics_gp": ElectronicsGP.getInstance(ElectronicsGP(dbs["electronics_gp"])),
    "fashion_goy": FashionGOY.getInstance(FashionGOY(dbs["fashion_goy"])),
    "cosm_ewg": CosmEWG.getInstance(CosmEWG(dbs["cosm_ewg"]))
}




#helper functions
def classifier(betaMode, score):

    threshold = 0.7 if betaMode else 0.9
    if score < 0.5:
        return 1 #not eco firendly
    elif score > 0.5 and score < threshold:
        return 2 #neutral
    else:
        return 0 #eco friendly


def calculateIndexSimilarity(productCategory, indexName):
    return similarity.categorySimilarity(productCategory, indexName)

def getAllIndices():
    indices = []
    for key in interfaces.keys():
        indices.append(key)
    return indices

def calculateSimilarities(productCategory, indices):
    newIndices = []
    for index in indices:
        currInterface = interfaces[index]
        currInterface.categorySimilarity = calculateIndexSimilarity(productCategory, index)
        if currInterface.categorySimilarity != 0:
            newIndices.append(index)
    if (len(newIndices) == 0):
        return indices
    return newIndices



#main api functions
def elasticSearchRequest(params):
    ms = MultiSearch()
    indices = params.get("indices")
    for index in indices:
        ms = ms.add(Search.from_dict(interfaces[index].request(params))[:5].index(index))
    responses = ms.execute()

    return responses

def postProcessResults(params):
    responses = params["responses"]
    indices = params["indices"]
    betaMode = params.get("betaMode")
    results = []
    similarities = []
    scores = []
    qualities = []
    for i in range(len(responses)):  #aggregate indices
        response = responses[i]
        index = indices[i]
        currInterface = interfaces[index]

        result = currInterface.response(response)
        if result != -1:
            score, quality, row = result
            results.append(row)
            similarities.append(currInterface.categorySimilarity)
            scores.append(score)
            qualities.append(quality)

    if len(results) == 0:
        return {"has_results":False}
    else:

        totalQuality = 0
        totalScore = 0
        similaritiesSum = sum(similarities)

        if similaritiesSum == 0:
            resultsLength = len(results)
            totalScore = sum(scores)/resultsLength
            totalQuality = sum(qualities)/resultsLength
        else:

            totalScore = sum([scores[elIndex] * similarities[elIndex] for elIndex in range(len(results))])  / similaritiesSum
            totalQuality = sum([qualities[elIndex] * similarities[elIndex] for elIndex in range(len(results))])  / similaritiesSum

        return {
            "data_quality": totalQuality,
            "score": totalScore,
            "classification": classifier(betaMode, totalScore),
            "has_results": True,
            "sources": results
        }



