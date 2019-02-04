var newText = "eco-friendly"
function getResultsFromAPI(var searchTerm)
{
	//Note: Call to backend service here
	encodedSearchTerm = encodeURI(searchTerm);
	$.get("http://localhost:5000/GetProductClass?name=" + encodedSearchTerm, function(data, status){
			var result  = JSON.parse(data)

			var productGreenRating = result.classification;
			console.log(productGreenRating);
			var newText = "    Eco Friendly ";
			if(productGreenRating == 0)
				newText = "    Eco Friendly ";
			else if(productGreenRating == 1)
				newText = "    Not Eco Friendly ";
			else if(productGreenRating == 2)
				newText = "    No rating ";
			else
				newText = "API return value is not valid in myscript.js";
			$("#productTitle").text( $("#productTitle").text() + newText )

	  });
	
	var txt = '{"rating": 0}'
	var obj = JSON.parse(txt);

	var result = obj.rating;
	return result;
}

var searchTerm = "Soap for Goodness Sakes";
searchTerm = $("#productTitle").text();
var productGreenRating = getResultsFromAPI(searchTerm); //probably url encode product info
