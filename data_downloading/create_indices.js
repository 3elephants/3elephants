var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/3elephants";
MongoClient.connect(url, function(err, connection) {
  if (err) throw err;

  var db = connection.db("3elephants");
  db.collection("cosmListings").createIndex(
     {
       name: "text",
       brand_name: "text"
     },
     {
       weights: {
         name: 6,
         brand_name: 2
       },
       name: "CosmIndex"
     }
   )

  db.collection("foodListings").createIndex(
     {
       name: "text",
       category_display_name : "text"
     },
     {
       weights: {
         name: 7,
         category_display_name : 1
       },
       name: "FoodIndex"
     }
   )
  connection.close();
});
//script to create indices in mongodb database
