console.log("hello")
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
var MY_SELECTOR = "productTitle"; // Could be any selector
var observer = new MutationObserver(function(mutations){
  for (var i=0; i < mutations.length; i++){
    for (var j=0; j < mutations[i].addedNodes.length; j++){
      // We're iterating through _all_ the elements as the parser parses them,
      // deciding if they're the one we're looking for.
			var node =  mutations[i].addedNodes[j];
			
      if ((node.nodeType == Node.ELEMENT_NODE) &&
						(node.id == MY_SELECTOR)){


				var searchTerm = "Soap for Goodness Sakes";
				searchTerm = $("#productTitle").text();
				searchTerm = searchTerm.trim();

				var productGreenRating = getResultsFromAPI(searchTerm); //probably url encode product info

        // We found our element, we're done:
        observer.disconnect();
      };
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});



//Part 2: Give the product design description to the Flask server
//*Please note that the product description's entire HTML is being retrieved, not just keywords.
//So the algorithm has to be designed in a way that this will not dilute the score.
var productDescription = "This is just a product description";
productDescription = $("#a-section launchpad-text-left-justify").html();

//No trimming necessary because of how jQuery html method works
realProductDescription = productDescription;
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
