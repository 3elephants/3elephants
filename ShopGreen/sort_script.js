//This function gets the
function getAllTheSortScores() {
  var products = [];
  for (i = 0; i < list.children.length; i++) {
    if (b[i] == null) {
			break;
		}
    var title = b[i].getElementsByClassName("s-access-title")[0];

    title = title.innerHTML.trim();
    products.push(title)
  }

  // Here is where you call the API route with the "jsonString" variable
  $.ajax({
    type: "POST",
    url: "http://localhost:5000/GetSearchResultsPageCache",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(products),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {

      var sortOrder = data.map(element => element.orig_pos);

      sortList(sortOrder);
    },
    failure: function(errMsg) {
      console.log(errMsg);
    }
  });


}

//Using the cached sort scores, this function should order the list by ecofriendliness
// But maybe it should be for only the first 10 elements
function sortList(sortOrder) {

  var s = sortOrder.reduce((accumulator, orig_pos) => accumulator + b[orig_pos].outerHTML, "");
  list.innerHTML = s;
}
var list = document.getElementById("s-results-list-atf");
b = list.getElementsByTagName("LI");
getAllTheSortScores();
