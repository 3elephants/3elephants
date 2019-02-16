
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

	var txt = '{"rating": 0}'
	var obj = JSON.parse(txt);

	var result = obj.rating;
	return result;
}

var searchTerm = "Soap for Goodness Sakes";
searchTerm = $("#productTitle").text();
searchTerm = searchTerm.trim();

var productGreenRating = getResultsFromAPI(searchTerm); //probably url encode product info
