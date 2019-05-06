# from nltk.corpus import wordnet as wn
# from .utilfunctions import *
from bs4 import BeautifulSoup
import requests

categoryMapping = {
    "electronics_gp":{"Amazon Devices":6, "Appliances":10,"Cell Phones & Accessories":10,"Computers":10,"Electronics":10,"Industrial and Scientific":2,"Office Products": 1, "Video Games": 6},
    "fashion_goy":{"Luxury Beauty": 10, "Beauty & Personal Care":5, "Clothing, Shoes & Jewelry":10, "Men":10, "Women":10,"Girls":10, "Boys":10, "Baby":10},
    "cosm_ewg": {"Luxury Beauty": 10, "Beauty & Personal Care": 10,"Health, Household & Baby Care":5},
    "household_nlm":{"Appliances": 10, "Beauty & Personal Care": 8, "Arts, Crafts & Sewing": 10, "Garden & Outdoor":10, "Health, Household &  Baby Care": 10, "Home & Kitchen": 10,"Tools & Home Improvement": 10, "Pet Supplies": 10},
    "food_ewg":{"Amazon Fresh":10, "Grocery & Gourmet Food": 10, "Prime Pantry": 10}
}
def getCategory(nodeid):
    return ""
    try:
        html = requests.get("https://www.amazon.com/exec/obidos/tg/browse/-/" + nodeid, timeout=0.6)
    except:
        return ""

    bs = BeautifulSoup(html.text, 'html.parser')

    bsQuery = bs.select('#nav-search-dropdown-card .nav-search-label')

    if len(bsQuery) == 0:
        return ""

    amazonCategory = bs.select('#nav-search-dropdown-card .nav-search-label')[0].getText()
    amazonCategory = amazonCategory.strip()
    #print(amazonCategory) - prints amazon category
    return amazonCategory

excludedCategories = {"Apps & Games", "Books", "CDs & Vinyl", "Collectibles & Fine Art","Courses","Credit and Payment Cards", "Digital Music", "Gift Cards", "Home & Business Services", "Kindle Store", "Magazine Subscriptions","Musical Instruments","Software", "Prime Video"}
def isExcluded(category):
    return category in excludedCategories

def categorySimilarity(amazonCategory, category):
    if amazonCategory in categoryMapping[category]:
        return (categoryMapping[category][amazonCategory])/10
    else:
        return 0

#debatable efficacy - using wordnet to classify product
# def sentence_similarity(query, category):
#     query = cleanQuery(query)
#     maxSimilarity = 0
#     if category == "household":
#         category = wn.synsets(category, 'n')[0]
#     else:
#         category = wn.synsets(category, 'n')[0]
#
#     for token in query:
#         types = wn.synsets(token, 'n')
#         if len(types) > 0:
#             maxSimilarity = max(maxSimilarity, types[0].wup_similarity(category))
#     return maxSimilarity
