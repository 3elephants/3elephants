//This function gets the 
function getAllTheSortScores() {
	var listOfScores = 3;
	var jsonString = { products: [] };
	
	var list = document.getElementById("s-results-list-atf");
	b = list.getElementsByTagName("LI");
	
	for (i = 0; i < 10; i++) {
		  console.log("Iterating over list item: " + b[i].innerHTML)
		  jsonString.push(b[i].innerHTML);
	}
	
	// Here is where you call the API route with the "jsonString" variable
	$.get("http://localhost:5000//GetSearchResultsPageCache?jsonString=" + jsonString, function(data, status){
			listOfScores = JSON.parse(data);
	});
	
	console.log("ARRAY SIZE IS: " + listOfScores.length);
	return listOfScores;
}

//Using the cached sort scores, this function should order the list by ecofriendliness
// But maybe it should be for only the first 10 elements
function sortList(shouldSort,scores) {
	
	//This is an implementation of simple bubble sort
	if(shouldSort) {
	  var list, i, switching, b, shouldSwitch;
	  list = document.getElementById("s-results-list-atf");
	  switching = true;
	  /* Make a loop that will continue until
	  no switching has been done: */
	  while (switching) {
	  	console.log("One iteration of Bubble Sort just ran");
		// Start by saying: no switching is done:
		switching = false;
		b = list.getElementsByTagName("LI");
		// Loop through all list items:
		for (i = 0; i < b.length - 1; i++) {
		  // Start by saying there should be no switching:
		  shouldSwitch = false;
		  /* Check if the next item should
		  switch place with the current item: */
		  if (scores[i] < scores[i + 1]) {
			/* If next item is alphabetically lower than current item,
			mark as a switch and break the loop: */
			shouldSwitch = true;
			break;
		  }
		}
		if (shouldSwitch) {
		  /* If a switch has been marked, make the switch
		  and mark the switch as done: */
		  b[i].parentNode.insertBefore(b[i + 1], b[i]);
		  switching = true;
		}
	  }
	}
	
}

var cache = getAllTheSortScores();
sortList(true, cache);