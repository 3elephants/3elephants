import json
from pprint import pprint
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['3elephants']
householdNLM = db["householdNLM"]

def addToDatabase(documents):

    numericalIndices = ['health_rating', 'flammability_rating', 'reactivity_rating']

    for document in documents:
        rating = 0
        total = 0

        for index in numericalIndices:


            if document.get(index) != None and document.get(index)!=-1:

                newValue = document.get(index)

                if index == 'health_rating':
                    newValue *=2
                    total +=2
                else:
                    total +=1
                rating += newValue
        if(total != 0):
            rating/= total
            document["overall_rating"] = rating
    householdNLM.insert_many(documents)



def main():
    letters = [chr(ord('a') + i) for i in range(26)]
    letters.append('0')
    for letter in letters:
        print(letter)
        with open("nlm_data_"+letter+".json") as f:
            data = json.load(f)

        addToDatabase(data)



main()