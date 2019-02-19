from gevent import monkey
monkey.patch_all()
import json
from pprint import pprint
from pymongo import MongoClient

import requests
client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]

def addToDatabase(obj):
    foodScores = obj["foodscores"]["foods"]
    foodListings.insert_many(foodScores)
    cosmetics = obj["skindeep"]["cosmetics"]
    # cosmListings.insert_many(cosmetics)


def doRequest(url):
    try:
        r = requests.get(url, timeout=0.5)

        if r.ok:
            # print("Report results received...")
            # print("HTTP %i - %s" % (r.status_code, r.reason))
            return True, r.text
        else:
            # print("HTTP %i - %s" % (r.status_code, r.reason))
            return False, None
    except:
        return False, None
def dbASINUpdater():
    cursor = foodListings.find(modifiers={"$snapshot": True})
    count = 0
    for doc in cursor:
        print(count)
        if doc["upc"] != None:
            upcCode = str(doc["upc"])

            success, r = doRequest("https://api.barcodable.com/api/v1/upc/" + upcCode)
            if success:
                requestJSON =  json.loads(r)
                matchResults = requestJSON["item"]["matched_items"]
                asinList = [currResult["asin"] for currResult in matchResults]
                doc["asin_list"] = asinList
                print("update occurred " + doc["asin_list"])
                foodListings.save(doc)
        count+=1

def readJson(fileNum):
    with open("report_results_"+str(fileNum)+".json") as f:
        data = json.load(f)

        addToDatabase(data)


def main():
    # for pNum in range(1, 2):
    #     readJson(pNum+1)
    #     print(pNum)

    dbASINUpdater()


main()