import re
from urllib.request import urlopen

from bs4 import BeautifulSoup
from string import ascii_lowercase
import requests
import json
import copy
# To Aditya: If no health, flammability, or reactivity rating is provided
#            the value -1 gets inserted. Check this product, it shows that
#.           the letter 'N' is provided which we have to handle somehow

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False
def get_results_from_proxy_api(results):
    return json.loads(results.text)["data"][0]["ipPort"]


def getUrls():
    proxyUrl = "http://pubproxy.com/api/proxy?port=80&https=true&type=http&api=NW52eEI4YUk2Zy9CZDRxVjFVWG1Kdz09"
    totalCount = 0
    proxy = "78.24.216.141:80"
    letters = [chr(ord('a') + i) for i in range(26)]
    letters.append('0')
    for char in letters:


        print("Reading in products that start with " + char.upper())
        url = "https://householdproducts.nlm.nih.gov/cgi-bin/household/list?tbl=TblBrands&alpha=" + char.upper()
        workingProxyNotFound = True
        while (workingProxyNotFound):
            try:
                html = requests.get(url, proxies={"http": proxy, "https": proxy}, timeout=1)
                workingProxyNotFound = False
            except:
                loaded = False
                while (not loaded):
                    try:
                        print("searching for new proxy...")
                        proxy = get_results_from_proxy_api(requests.get(proxyUrl))
                        loaded = True
                    except:
                        print("failed...")

        soup = BeautifulSoup(html.text, 'lxml')



        products = soup.find_all('td', {"class": "bodytext"})[0].find_all('a')

        with open("nlm_data_"+char+".json") as f:
            data = json.load(f)
            for index in range(len(data)):
                data[index]["web_url"] = products[index]['href']
            with open("nlm_data_" + char + ".json", 'w') as f:
                json.dump(data, f)
                print(str(len(data)) + "documents rewritten")


def outer():
    proxyUrl = "http://pubproxy.com/api/proxy?port=80&https=true&type=http&api=NW52eEI4YUk2Zy9CZDRxVjFVWG1Kdz09"
    totalCount = 0
    proxy = "78.24.216.141:80"
    letters = [chr(ord('a') + i) for i in range(26)]
    letters.append('0')
    for char in letters:

        allResults = []
        print("Reading in products that start with " + char.upper())
        url = "https://householdproducts.nlm.nih.gov/cgi-bin/household/list?tbl=TblBrands&alpha=" + char.upper()
        workingProxyNotFound = True
        while (workingProxyNotFound):
            try:
                html = requests.get(url, proxies = {"http": proxy, "https": proxy})
                workingProxyNotFound = False
            except:
                loaded = False
                while (not loaded):
                    try:
                        proxy = get_results_from_proxy_api(requests.get(proxyUrl))
                        loaded = True
                    except:
                        print("failed...")


        soup = BeautifulSoup(html.text, 'lxml')

        innerCounter = 0
    
        products = soup.find_all('td', {"class": "bodytext"})[0].find_all('a')
        print(len(products))
        for product in products:
            if totalCount%200 == 0:
                workingProxyNotFound = True
                while(workingProxyNotFound):
                    loaded = False
                    while (not loaded):
                        try:
                            proxy = get_results_from_proxy_api(requests.get(proxyUrl))
                            loaded = True
                        except:
                            print("failed...")

                    try:
                        requests.get(url, proxies={"http": proxy, "https": proxy})
                        workingProxyNotFound = False
                    except:
                        print("searching for new proxy")
                print(proxy)
            #if totalCount%20 == 0:
            print(totalCount)
            innerCounter += 1
            totalCount += 1
            productLink = "https://householdproducts.nlm.nih.gov/" + product.get("href")
            workingProxyNotFound = True
            while (workingProxyNotFound):
                try:
                    productData = requests.get(productLink, proxies = {"http": proxy, "https": proxy})
                    workingProxyNotFound = False
                except:
                    print("searching for new proxy...")
                    loaded = False
                    while(not loaded):
                        try:
                            proxy = get_results_from_proxy_api(requests.get(proxyUrl))
                            loaded = True
                        except:
                            print('failed...')
            soup = BeautifulSoup(productData.text, 'lxml')
            dataObject = {}
            
            regexes = ['Product Name', 'Form', 'Product Category', 'Manufacturer', 'Acute Health Effects',
                       'Chronic Health Effects', 'Carcinogenicity', 'MSDS Date',
                       'Handling', 'Disposal']
            numericalRegexes = {'Health Rating', 'Flammability Rating', 'Reactivity Rating'}


            for regex in regexes: #non - numerical
                results = soup.find_all("th", {"class": "headertext"}, text=re.compile(regex))

                if len(results) > 0:
                    text = results[0].find_parent('tr').find_all('td')[0].get_text().strip()
                    dataObject[regex.lower().replace(" ", "_")] = (text.replace('\n', ' ').replace('\r', ''))

            for regex in numericalRegexes: #numerical
                results = soup.find_all("a", {"href": "/householdGlossary.htm#HMIS"}, text=re.compile(regex))
                
                if len(results) > 0:

                    text = results[0].find_parent('tr').find_all('td')[0].get_text().strip()
                    text = text.replace("*", "")
                    if is_number(text):
                        dataObject[regex.lower().replace(" ", "_")] = int(text)
                    else:
                        dataObject[regex.lower().replace(" ", "_")] = -1

            allResults.append(dataObject)


        print("This many products were read: " + str(innerCounter))
        filename = 'nlm_data_' + char + '.json'
        with open(filename, 'w') as outfile:
            json.dump(allResults, outfile)

getUrls()
