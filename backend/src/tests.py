import time
from functions import *
import os



class TestQuery:

    #querys for campbell's soup - tests if basic product rating and information retrieval is working
    def testFood(self):
        event = {
            "queryStringParameters": {
                "name": "Dove Beauty Bar White Bar",
                "mode": "true",

            }
        }


        results = getProductClass(event, None)
        results = results["body"]
        results = json.loads(results)

        print(json.dumps(results))
        assert results["classification"] == 1
        assert results["has_results"] == True
        assert results["score"] < 0.6

    def testElectronics(self):
        event = {
            "queryStringParameters": {
                "name": "Apple iPhone 6, GSM Unlocked, 16 GB Unlocked, Silver (Renewed)",
                "brand": "Apple",
                "mode": "true",
                "asin": "B01BI2VZEI",
                "nodeid": "2335752011"
            }
        }

        results = getProductClass(event, None)
        results = results["body"]
        results = json.loads(results)

        print(json.dumps(results))
        assert results["has_results"] == True

    def testCosmetics(self):
        event = {
            "queryStringParameters": {
                "name": "Dove Beauty Bar Gentle Exfoliating Soap",
                "brand": "Dove",
                "mode": "true",
                "asin": "B00OMXW9F0",
                "nodeid": "3760911"
            }
        }

        results = getProductClass(event, None)
        results = results["body"]
        results = json.loads(results)

        print(json.dumps(results))
        assert results["has_results"] == True

    def testFashion(self):
        event = {
            "queryStringParameters": {
                "name": "Nike Men's Revolution 4 Running Shoe",
                "brand": "Nike",
                "mode": "true",
                "asin": "B06XKKRPBJ",
                "nodeid": "672123011"
            }
        }

        results = getProductClass(event, None)
        results = results["body"]
        results = json.loads(results)

        print(json.dumps(results))
        assert results["has_results"] == True

    def testHousehold(self):
        event = {
            "queryStringParameters": {
                "name": "Easy-Off Glass-Ceramic Cooktop Cleaner",
                "brand": "Reckitt",
                "mode": "true",
                "nodeid": "284507"
            }
        }

        results = getProductClass(event, None)
        results = results["body"]
        results = json.loads(results)

        print(json.dumps(results))
        assert results["has_results"] == True



class TestSort:

    def setup(self):
        self.original = [
            "O Naturals 3-Piece Cleansing Green Clay &amp; Dead Sea Mud Bar Soap. 100% Natural. Face, Hands &amp; Body Wash. Exfoliating, Detoxifying, Pore Minimizer. Treats Acne &amp; Oily Skin. Triple Milled, Vegan. 4 oz",
            "O Naturals 6 Piece Moisturizing Body Wash Soap Bar Collection. 100% Natural Made w/ Organic Ingredients &amp; Therapeutic Essential Oils. Face &amp; Hands. Vegan. French Triple Milled. For Women &amp; Men 4 Oz",
            "O Naturals 6 Piece Citrus Vitamin C &amp; E Bar Soap Collection, Made with Organic Coconut &amp; Olive Oil. Vegan, Triple Milled, Fresh Citrus Scents. Face, Hand &amp; Body Wash. Gift Set. For Women &amp; Men. 4 oz.",
            "DEAD SEA Salt Mud Charcoal – Soap Variety Pack, Dead Sea Mud, Dead Sea Salt, Activated Charcoal. With Shea Butter, Argan Oil. All Skin type, Problem Skin. Acne Treatment, Eczema, Psoriasis, 3/7oz Bars",
            "Dove Beauty Bar, White 4 oz, 14 bar", "Dove Purely Pampering Beauty Bar, Coconut Milk 4 Ounce",
            "Dove Men+Care Body and Face Bar, Extra Fresh",
            "Mrs. Meyer’s Clean Day Liquid Hand Soap, Lemon Verbena Scent, 12.5 fl oz (Pack of 3)",
            "Dove Beauty Bar Sensitive Skin 4 Ounce", "Irish Spring Deodorant Soap Original Scent - 20 ct",
            "Softsoap Liquid Hand Soap, Fresh Breeze - 7.5 fluid ounce (Pack of 6)",
            "Lever 2000 Bar Soap, Aloe &amp; Cucumber, 4 oz, 12 Bar",
            "Dial Complete Antibacterial Foaming Hand Soap, 2-Scent Variety Pack, Spring Water/Fresh Pear, 7.5 Fluid Ounces Each (Pack of 5)",
            "Crate 61 Best Seller Soap 6-Pack Box Set, 100% Vegan Cold Process Bar Soap, scented with premium essential oils and natural flavors, for men and women, face and body.",
            "Pre de Provence Artisanal French Soap Bar Enriched with Shea Butter, Quad-Milled For A Smooth &amp; Rich Lather (150 grams) - Honey Almond",
            "Yardley London Soap Bath Bar Bundle - 10 Bars: English Lavender, Oatmeal and Almond, Aloe and Avocado, Cocoa Butter, Lemon Verbena  4.25 Ounce Bars (Pack of 10 Bars, Two of each)",
            "O Naturals 6-Piece Black Soap Bar Collection. 100% Natural. Organic Ingredients. Helps Treat Acne, Repairs Skin, Moisturizes, Deep Cleanse, Luxurious. Face &amp; Body Women &amp; Men. Triple Milled, Vegan 4oz",
            "Bali Soap - Natural Soap Bar Gift Set, Face Soap or Body Soap, 6 pc Variety Soap Pack (Coconut, Papaya, Vanilla, Lemongrass, Jasmine, Ylang-Ylang) 3.5 Oz each",
            "O Naturals Moisturizing Organic Coconut Oil, Shea Butter 3 Piece Bar Soaps. Softens &amp; Nourishes Dry Skin. Face &amp; Body Wash. Made in USA. Triple Milled, Vegan. 4 Ounce Each",
            "Method Foaming Hand Soap, Sweet Water, 10 Ounce (6 Pack), Hand Wash Dispenser with Pump",
            "Dropping the Soap", "Dial Antibacterial Bar Soap, White, 30 Count",
            "Dr. Bronner’s Pure-Castile Bar Soap Variety Gift Pack– 5oz, 6 Pack",
            "Mrs. Meyer’s Liquid Hand Soap Refill, Basil, 33 fl oz", "Dove Men+Care Body and Face Bar, Extra Fresh",
            "Dawn Ultra Dishwashing Liquid Dish Soap, Original Scent, 2 count, 56 oz.(Packaging May Vary)",
            "ArtNaturals 6 Piece Soap Bar Set, 100% Natural and Infused with Jojoba Oil, Best for All Skin Types, Body and Face, Men and Women, Tea Tree/Lavender/Eucalyptus/Lemon/Grapefruit/Orange, 4 oz. Each",
            "Handmade Soap Ends Sampler", "SpaLife Hand Made Soap Set - Handmade - 6 Pack - 3.5oz Each (Loofah)",
            "O My! Goat Milk Soap 6oz Bar - Black Raspberry Vanilla | Bundle of 3 | Made with Farm-Fresh Goat Milk | Moisturizes Dry Skin | Gently Exfoliates | Paraben Free | Leaping Bunny Certified | Made in USA",
            "SpaLife Hand Made Soap Set - Handmade - 6 Pack - 3.5oz Each (Natural)",
            "Baylis &amp; Harding Sweet Mandarin &amp; Grapefruit 500ml Moisturising Bath Soak, Pack Of 3, 575 Gram",
            "O Naturals 6 Piece Citrus Vitamin C &amp; E Bar Soap Collection, Made with Organic Coconut &amp; Olive Oil. Vegan, Triple Milled, Fresh Citrus Scents. Face, Hand &amp; Body Wash. Gift Set. For Women &amp; Men. 4 oz.",
            "Mrs. Meyer’s Clean Day Liquid Hand Soap, Lavender Scent, 12.5 ounce bottle (Pack of 3)",
            "Cakie Soap Dispenser, Touchless Automatic Soap Dispenser, Infrared Motion Sensor Stainless Steel Dish Liquid Hands-Free Auto Hand Soap Dispenser, Upgraded Waterproof Base",
            "Olive Oil Soap Bar - Handmade 100% Pure Natural &amp; Vegan (5 Bars)",
            "Ivory Clean Original Bath Bar 4.0oz, 10 count  Packaging may Vary",
            "Dr. Bronner's Pure-Castile Liquid Soap - Peppermint 32oz.",
            "Irish Spring Aloe Bar Soap 3.75 Oz-pack of 20 Bars", "Dove Beauty Bar, White, 4 oz, 6 Bar",
            "Dove Men+Care Body and Face Bar, Deep Clean",
            "Dawn Ultra Dishwashing Liquid Dish Soap (4x19.4oz) + Dawn Non-Scratch Sponge (2ct), Original(Packaging May Vary)",
            "Cetaphil Deep Cleansing Face &amp; Body Bar for All Skin Types (Pack of 3)",
            "The Natural Soap Making Book for Beginners: Do-It-Yourself Soaps Using All-Natural Herbs, Spices, and Essential Oils",
            "Art of Sport Body Bar Soap (2-Pack), Rise Scent, with Activated Charcoal, Tea Tree Oil, and Shea Butter, 3.75 oz",
            "SheaMoisture African Black Soap Bar Soap | 8 oz.",
            "Dawn Antibacterial Dishwashing Liquid Dish Soap, Orange Scent, 56 Fl Oz,Pack of 2(Packaging May Vary)",
            "Oatmeal Soap Bar. With Organic Honey, Goats Milk, &amp; Organic Shea Butter, Can Be Used as a Face Soap or All Over Body Soap. For Men, Women &amp; Teens. Gentle Exfoliating Soap, For All Skin Types. GMO Free, Preservative Free. Each Bar Is Handmade By Our Artisan Soap Maker. 4oz Bar. No Animal Testing - Cruelty Free. Natural &amp; Organic Soap. Satisfaction Guaranteed.",
            "The Complete Guide to Natural Soap Making: Create 65 All-Natural Cold-Process, Hot-Process, Liquid, Melt-and-Pour, and Hand-Milled Soaps",
            "Amish Farms Handmade Bar Soap, Natural Ingredients, Cold Pressed, Carcinogen Free, 6 Ounce - 6 Pack Gift Box (6 Bars)",
            "COW BRAND Soap Red Box 100g*6pieces", "Dial Liquid Hand Soap, Coconut Water &amp; Mango, 7.5 Fluid Ounces",
            "Royalty Soaps", "Dr. Bronner's Pure-Castile Bar Soap - Baby Unscented, 5 oz (6 Pack)",
            "Dead Sea mud soap bar Peppermint essential oil Handmade all skin types (5 oz) Natural Herbal", "Soap",
            "Antifungal TeaTree Oil Body Wash, Peppermint &amp; Eucalyptus Oil Antibacterial Soap by Natural Riches -12 oz Helps Athletes Foot, Eczema, Ringworm, Toenail Fungus, Jock itch, Body Itch, Body Odor &amp; Acne",
            "Natural Olive Marseille Soap with 99.8% Natural Ingredients, Fragrance and Dye Free for Sensitive Skin by Le Lores (3.52 Oz)",
            "O Naturals Tea Tree Oil Foot &amp; Body Wash (16 oz) Treats Athletes Foot, Body Odor, Toenail Fungus, Jock Itch &amp; Ringworm. Helps Acne and Breakouts. Antifungal &amp; Anti Bacterial Soap. No Parabens &amp; SLS",
            "SoapBox Soaps Hand Soap, Coconut Milk &amp; Sandalwood, 3 Count"]


    # tests that product results are sorted correctly (in descending order)
    def testSort(self):
        event = {"body": {"products":json.dumps(self.original),"nodeid":"3375251"}}
        start = time.time()
        results = batchProductClassQuery(event, None)
        end = time.time()
        print(end-start,'s')
        results = results["body"]

        results = json.loads(results)
        assert len(results) == len(self.original)
        oldScore = 1
        for result in results:

            assert oldScore >= result["score"]
            oldScore = result["score"]



# more test cases may be added here
# for more than 100 entries as input or validation, consider using a file for data
TestQuery().testFood()
print("fashion...")
TestQuery().testFashion()
TestQuery().testCosmetics()
TestQuery().testElectronics()

TestQuery().testHousehold()
sort = TestSort()
sort.setup()
sort.testSort()