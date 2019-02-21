### What is our data source?
We use [Environmental Working Group](https://www.ewg.org/about-us)'s database of [food products](https://www.ewg.org/foodscores) and [cosmetics](https://www.ewg.org/skindeep/) scores. The Environmental Working Group is a non-profit that collects data and conducts research on consumer products' health concerns and environmental impact. EWG details the methodology through which it scores foods [here](https://www.ewg.org/foodscores/content/methodology) and cosmetics [here](). We describe the overall picture of their scoring methodology in "How do we score products?"

### What is the data source quality?

EWG provides us a ready and available data source to start with, with a clearly detailed approach to data collection and scoring, with data constantly subject to review and updates. However, we do acknowledge risk because we cannot certify the assumptions they have made in scoring. We aim to integrate more data sources into our project in future releases, taking into account quality from the databases we draw from. However, we have worked to mitigate this risk, by making the *default mode* require strict search relevance thresholds, avoid labeling "hazardous" products, and require a high score (above 4.5 on a scale from 1-5) in order to be labeled eco-friendly.

### How do we score products?

* Food
    * Three factors are considered. [Nutrition](https://www.ewg.org/foodscores/content/faq), [Ingredients](https://www.ewg.org/foodscores/content/methodology-ingredients), and [Processing](https://www.ewg.org/foodscores/content/methodology-processing). Nutrition scoring depends on a research based algorithm for evaluating the nutritional value of a set of ingredients detailed [here](https://www.ewg.org/foodscores/content/methodology-nutrition). Ingredients scoring take into account a Food and Drug Administration list of food additives and traces of chemicals considered to be causes of consumer illness. Processing looks at manafacturing processes likely to have been used to make the ingredients in the product. Afterwards, all three scores are averaged.
* Cosmetics
    * 17 "hazard categories" are considered.  Hazard categories are chemicals that are known to increase chances of affect organ systems negatively. Full details on hazard categories can be found [here](https://www.ewg.org/skindeep/site/about.php#5).
    * EWG have reviewed up to [60 databases](https://www.ewg.org/skindeep/site/about.php#4) and given their ratings a data quality score. We only show ratings with a data quality score of 2 or higher on a scale from 1-5.
