from flask import Flask, request, json, jsonify

application = Flask(__name__)
import functions as elephantFunctions



@application.route('/GetProductClass')
def GetProductClass():

    event = {}
    event["queryStringParameters"] = request.args

    return postProcess(elephantFunctions.getProductClass(event, None))

@application.route('/GetSearchResultsPageCachev2', methods=['POST'])
def GetSearchResultsPageCachev2():
    event = {}
    event["body"] = json.dumps(request.json)
    return postProcess(elephantFunctions.batchProductClassQuery(event, None))

def postProcess(returnValue):
    return jsonify(json.loads(returnValue["body"]))
if __name__ == '__main__':
    application.run()
