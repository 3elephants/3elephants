# JSON DATA PUSH API by Robert Prochowicz, great help from Henri-Francois Chadeisson and Scott Rigney
# Tested with MSTR 10.10 / 2018-01-29

import requests
import json

### Parameters ###



def getData():
    requestUrl = "https://goy-dev-2079.nodechef.com/parse/functions/searchAll"
    data = {
        "searched_terms": "aa",
        "offset": 1338,
        "_ApplicationId": "gcrp2V42PHW7S8ElL639",
        "_JavaScriptKey": "gVoyh28ouDRUazw9IMrF6nIkxHVtvvALHHJL5BOg",
        "_ClientVersion": "js2.1.0",
        "_InstallationId": "5fa708a2-6fa6-04bc-d667-01704ac57a33"
    }
    retrievedSet = set({})
    brands = []
    counter = 0
    for outer in range(26):
        for inner in range(26):
            try:
                data["searched_terms"] = chr(ord('a') + outer) + chr(ord('a') + inner)
                r = requests.post(url=requestUrl, json=data, timeout=4)

                if r.ok:
                    print(counter)
                    print("HTTP %i - %s" % (r.status_code, r.reason))

                    results = json.loads(r.text)
                    for brand in results["result"]["brands"]:
                        if brand["id"] not in retrievedSet:
                            brand["environment_rating"] = -1.0
                            retrievedSet.add(brand["id"])
                            print(brand["id"])
                            secondData = {"id": brand["id"], "_ApplicationId": "gcrp2V42PHW7S8ElL639",
                                          "_JavaScriptKey": "gVoyh28ouDRUazw9IMrF6nIkxHVtvvALHHJL5BOg",
                                          "_ClientVersion": "js2.1.0",
                                          "_InstallationId": "5fa708a2-6fa6-04bc-d667-01704ac57a33"}
                            rDetails = None
                            try:
                                rDetails = requests.post(url="https://goy-dev-2079.nodechef.com/parse/functions/getBrandDetails", json=secondData, timeout=2)
                            except:
                                print("timeout on " + brand["id"])
                            if rDetails and rDetails.ok:
                                brand["details"] = json.loads(rDetails.text)
                                if brand["details"]["result"].get("environment_rating") != None:
                                    brand["environment_rating"] = float(brand["details"]["result"].get("environment_rating"))
                            brands.append(brand)
                else:
                    print("HTTP %i - %s" % (r.status_code, r.reason))
                counter += 1
            except:
                print("failed search")
    others = ['1', '2', '7', '9', '&']
    for other in others:
        data["searched_terms"] = other
        brands.extend(findAllDataforSearch(requestUrl, data, retrievedSet))
    print(len(brands))
    return json.dumps(brands)


def findAllDataforSearch(requestUrl, data, retrievedSet):
    r = requests.post(url=requestUrl, json=data)
    brands = []
    if r.ok:

        print("HTTP %i - %s" % (r.status_code, r.reason))

        results = json.loads(r.text)
        for brand in results["result"]["brands"]:
            if brand["id"] not in retrievedSet:
                retrievedSet.add(brand["id"])
                print(brand["id"])
                brand["environment_rating"] = -1.0
                secondData = {"id": brand["id"], "_ApplicationId": "gcrp2V42PHW7S8ElL639",
                              "_JavaScriptKey": "gVoyh28ouDRUazw9IMrF6nIkxHVtvvALHHJL5BOg",
                              "_ClientVersion": "js2.1.0",
                              "_InstallationId": "5fa708a2-6fa6-04bc-d667-01704ac57a33"}
                rDetails = None
                try:
                    rDetails = requests.post(url="https://goy-dev-2079.nodechef.com/parse/functions/getBrandDetails",
                                             json=secondData, timeout=2)
                except:
                    print("timeout on " + brand["id"])
                if rDetails and rDetails.ok:
                    brand["details"] = json.loads(rDetails.text)
                    if brand["details"]["result"].get("environment_rating") != None:
                        brand["environment_rating"] = float(brand["details"]["result"].get("environment_rating"))
                brands.append(brand)
    return brands

def export_to_json():
    print("Exporting report results to JSON file...")
    r = getData()
    text_file = open("good_for_you_data.json", "w", encoding="utf8")
    text_file.write(r)
    text_file.close()


def main():
    export_to_json()


### Main program
main()
