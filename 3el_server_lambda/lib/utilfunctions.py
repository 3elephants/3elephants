from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem.snowball import SnowballStemmer
import string
#nltk.data.path.append('../nltk_data/')

def cleanQuery(query): #simplify a query into its likely format in the index


    #clean punctuation
    query = query.lower()
    punctuation  = set(string.punctuation)
    punctuation.union('\'')
    query = "".join([w for w in query if w.isalpha() or w.isspace()])




    word_tokens = word_tokenize(query)


    #clean words
    results = []

    stop_words = set(stopwords.words('english'))
    measurement_units = {'oz', 'kg', 'ounc', 'gram', 'ounce', 'pack', 'fl', 'tsp', 'g'}
    extra_stop_words = {'amp', 'w'}
    stop_words = stop_words.union(measurement_units)
    stop_words = stop_words.union(extra_stop_words)

    word_stemmer = SnowballStemmer("english", ignore_stopwords=True)

    for w in word_tokens:
        if not w in stop_words:
            results.append(word_stemmer.stem(w))
    return results
