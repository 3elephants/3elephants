import re
from urllib.request import urlopen

from bs4 import BeautifulSoup
from string import ascii_lowercase
import requests
import json

# To Aditya: If no health, flammability, or reactivity rating is provided
#            the value -1 gets inserted. Check this product, it shows that
#.           the letter 'N' is provided which we have to handle somehow

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

def outer():
    for char in ascii_lowercase:
        allResults = []
        print("Reading in products that start with " + char.upper())
        url = "https://householdproducts.nlm.nih.gov/cgi-bin/household/list?tbl=TblBrands&alpha=" + char.upper()
        html = urlopen(url)
        soup = BeautifulSoup(html, 'lxml')
        print(html);
        counter = 0;
    
        products = soup.find_all('td', {"class": "bodytext"})[0].find_all('a')
        for product in products:
            if counter%20 == 0:
                print(product)
            counter += 1
            productLink = "https://householdproducts.nlm.nih.gov/" + product.get("href")
            productData = urlopen(productLink)
            soup = BeautifulSoup(productData, 'lxml')
            dataObject = {}
            
            regexes = ['Product Name', 'Form', 'Product Category', 'Manufacturer', 'Acute Health Effects',
                       'Chronic Health Effects', 'Carcinogenicity', 'MSDS Date',
                       'Handling', 'Disposal']
            numericalRegexes = {'Health Rating', 'Flammability Rating', 'Reactivity Rating'}
            for regex in regexes:
                results = soup.find_all("th", {"class": "headertext"}, text=re.compile(regex))

                if len(results) > 0:
                    # print("* " + regex);
                    text = results[0].find_parent('tr').find_all('td')[0].get_text().strip()

                    if regex in numericalRegexes:
                        dataObject[regex.lower().replace(" ", "_")] = int(text)
                    else:
                        dataObject[regex.lower().replace(" ", "_")] = (text.replace('\n', ' ').replace('\r', ''))
            
            for regex in numericalRegexes:
                results = soup.find_all("a", {"href": "/householdGlossary.htm#HMIS"}, text=re.compile(regex))
                
                if len(results) > 0:
                    # print("** " + regex);
                    text = results[0].find_parent('tr').find_all('td')[0].get_text().strip()

                    if regex in numericalRegexes:
                        if is_number(text):
                            dataObject[regex.lower().replace(" ", "_")] = int(text)
                        else:
                            dataObject[regex.lower().replace(" ", "_")] = -1
                    else:
                        dataObject[regex.lower().replace(" ", "_")] = (text.replace('\n', ' ').replace('\r', ''))
            
            allResults.append(dataObject)
            # print(dataObject)
            # if counter == 3:
               # break

        print("This many products were read: " + str(counter))
        filename = 'nih_data_' + char + '.json'
        with open(filename, 'w') as outfile:
            json.dump(allResults, outfile)

outer()
