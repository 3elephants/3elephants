import re
from urllib.request import urlopen

from bs4 import BeautifulSoup


def outer():
    url = "https://householdproducts.nlm.nih.gov/cgi-bin/household/list?tbl=TblBrands&alpha=A"
    html = urlopen(url)
    soup = BeautifulSoup(html, 'lxml')
    type(soup)
    products = soup.find_all('td', {"class": "bodytext"})[0].find_all('a')
    for product in products:

        productLink = "https://householdproducts.nlm.nih.gov/" + product.get("href")
        productData = urlopen(productLink)
        soup = BeautifulSoup(productData, 'lxml')
        soup.find_all(productLink)
        regexes = ['Product Name', 'Form', 'Product Category', 'Manufacturer', 'Acute Health Effects',
                   'Chronic Health Effects', 'Carcinogenicity', 'MSDS Date',
                   'Handling', 'Disposal', 'Health Rating', 'Flammability Rating', 'Flammability Rating']
        numericalRegexes = {'Health Rating', 'Flammability Rating', 'Flammability Rating'}
        for regex in regexes:
            dataObject = {}
            results = soup.find_all("th", text=re.compile(regex))
            if len(results) > 0:
                text = results[0].find_parent('tr').find_all('td')[0].get_text().strip()

                if regex in numericalRegexes:
                    dataObject[regex.lower().replace(" ", "_")] = int(text)
                else:
                    dataObject[regex.lower().replace(" ", "_")] = (text.replace('\n', ' ').replace('\r', ''))
            print(dataObject)
        break


outer()
