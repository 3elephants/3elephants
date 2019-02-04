var newText = "eco-friendly"
function getResultsFromAPI()
{
	$.get("http://localhost:5000/GetProductClass?name=Soap for Goodness Sakes", function(data, status){
			var result  = JSON.parse(data)

			var productGreenRating = result.classification
			console.log(productGreenRating)
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
	//Note: Call to backend service here
	var txt = '{"rating": 0}'
	var obj = JSON.parse(txt);

	var result = obj.rating;
	return result;
}

var productGreenRating = getResultsFromAPI(); //probably url encode product info
$("#productTitle").text( $("#productTitle").text() + newText )
