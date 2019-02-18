//script to create indices in mongodb database
db.cosmListings.createIndex(
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

db.foodListings.createIndex(
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
