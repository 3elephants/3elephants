const {ProductName, Classification} = require('./three_el_pb.js');
const {RatingProviderClient} = require('./three_el_grpc_web_pb.js');

var ratingService = new RatingProviderClient('localhost:50051');

var product = new ProductName();
product.setName('Soap for Goodness Sake Goat Milk Soap, Oatmeal and Honey');

ratingService.getProductClass(product, {}, function(err, classification) {
  console.log("class type is " + classification.getClassType())
});
