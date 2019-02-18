from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem.snowball import SnowballStemmer
import string
from collections import Counter
def cleanQuery(query):
    # remove punctuation
    # stem words in query
    # calculated score *8 or *9 as threshold
    # determine cumulative distribution
    stop_words = set(stopwords.words('english'))
    stemmer2 = SnowballStemmer("english", ignore_stopwords=True)
    query = query.lower()
    query = "".join([w for w in query if w not in string.punctuation and not w.isdigit()])

    word_tokens = word_tokenize(query)
    results = []
    for w in word_tokens:
        if not w in stop_words:
            results.append(stemmer2.stem(w))

    return results

print(cleanQuery("Campbell's Slow Kettle Style Soup, Tomato & Sweet Basil Bisque, 15.5 Ounce (Pack of 8)"))