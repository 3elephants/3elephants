import three_el_pb2


from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['3elephants']
foodListings = db["foodListings"]
cosmListings = db["cosmListings"]


class RatingProviderServicer(three_el_pb2.RatingProviderServicer):
    def GetProductClass(self, request, context):
        foodListings.find({ "$text:" { $search: "java coffee shop" } })
        feature = get_feature(self.db, request)
        if feature is None:
            return route_guide_pb2.Feature(name="", location=request)
        else:
            return feature