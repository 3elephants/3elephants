
function getResultsFromAPI()
{
	//Note: Call to backend service here
	var txt = '{"rating": 0}'
	var obj = JSON.parse(txt);
	
	var result = obj.rating;
	return result;
}

var newText = "    Eco Friendly ";
var productGreenRating = getResultsFromAPI();

if(productGreenRating == 0)
	newText = "    Eco Friendly ";
else if(productGreenRating == 1)
	newText = "    Not Eco Friendly ";
else if(productGreenRating == 2)
	newText = "    No rating ";
else
	newText = "API return value is not valid in myscript.js";

$("#productTitle").text( $("#productTitle").text() + newText ) 