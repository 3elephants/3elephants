function getResultsFromAPI(searchTerm)
{
	//Note: Call to backend service here
	console.log(searchTerm);
	encodedSearchTerm = searchTerm;
	$.get("http://localhost:5000/GetProductClass?name=" + encodedSearchTerm, function(data, status){

			var result  = JSON.parse(data);
			var newText = "";

			var productGreenRating = result.classification;

			var	newText = "    <span style='color:blue'> No rating </span> ";
			if(productGreenRating == 0)
				newText = "  <span style='color:green'> Eco Friendly </span> ";
			else if(productGreenRating == 1)
				newText = "   <span style='color:red'> Not Eco Friendly </span>";
			else if(productGreenRating == 2)
				newText = "    <span style='color:blue'> No rating </span> ";
			else
				newText = "API return value is not valid in myscript.js";
			
			$("#productTitle").html( $("#productTitle").text() + newText );

	  });

	var txt = '{"rating": 0}';
	var obj = JSON.parse(txt);

	var result = obj.rating;
	return result;
}

//Part 1: Add the eco friendly rating
var searchTerm = "Soap for Goodness Sakes";
searchTerm = $("#productTitle").text();
searchTerm = searchTerm.trim();

var productGreenRating = getResultsFromAPI(searchTerm); //probably url encode product info


//Part 2: Give the product design description to the Flask server
var productDescription = "This is just a product description";
productDescription = $("#productDescription p").get(0).text();

realProductDescription = productDescription.trim();
console.log(realProductDescription);
giveAPITheProductDescription( realProductDescription );


//Part 3: Get the Customer question and answers
var allAnswers = "This is going to be an array of customer answers";
var allText = "This is the allText variable";
allAnswers = $("#allAnswers").each(function( index ) {
  console.log( index + ": " + $( this ).text() );
  allText = allText + " " + $( this ).text();
});

console.log("Part 3 is almost done");
giveAPITheCustomerAnswers(allText);
console.log("Part 3 is now done");