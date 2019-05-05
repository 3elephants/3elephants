import json
import requests
import time
import os
headers = {"Content-Type": "application/json"}


def indexTemplate(field):
    return {
        "properties": {
            field: {
                "type": "text",
                "fields": {
                    "shingles": {
                        "type": "text",
                        "analyzer": "elephants_analyzer"
                    }
                }
            }
        }
    }


baseUrl = os.environ.get('ELASTIC_URL')
endUrl = "/_mapping/_doc"
indicesToCreate = [{
    "index": "household_nlm",
    "field": "product_name"
}, {
    "index": "food_ewg",
    "field": "name"
},
    {
        "index": "cosm_ewg",
        "field": "name"
    }]

for index in indicesToCreate:
    data = {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "elephants_filter": {
                        "type": "shingle",
                        "min_shingle_size": 2,
                        "max_shingle_size": 3,
                        "output_unigrams": False
                    }
                },
                "analyzer": {
                    "elephants_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": [
                            "lowercase",
                            "elephants_filter"
                        ]
                    }
                }
            }
        }
    }

    results = requests.put(baseUrl + index["index"], data=json.dumps(data), headers=headers)
    print(results.text)
    time.sleep(5)
    results = requests.put(baseUrl + index["index"] + endUrl, data=json.dumps(indexTemplate(index["field"])), headers=headers)
    print(results.text)
    print('\n')
    print('\n')