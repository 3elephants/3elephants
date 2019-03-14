import * as constants from './lib/constants'

//This function gets the
$(function() {

  //Using the cached sort scores, this function should order the list by ecofriendliness
  function sortList(sortOrder, list, b) {

    var s = sortOrder.reduce((accumulator, orig_pos) => accumulator + b[orig_pos].outerHTML, "");
    list.innerHTML = s;
		// $("#loading").css("display","none");
  }

  function getAllTheSortScores(list, b) {

    var products = [];
    // document.getElementsByTagName("body")[0].innerHTML +='<div id="loading"> <div id="loading-image"class="loader"></div></div>';
    for (i = 0; i < list.children.length; i++) {
      if (b[i] == null) {
        break;
      }
      var title = b[i].getElementsByClassName("s-access-title")[0];
      if (title == null)
        title = b[i].getElementsByClassName("a-size-medium a-color-base a-text-normal")[0]; //for different layout
      if (title == null) {
        title = b[i].getElementsByClassName("a-size-base-plus a-color-base a-text-normal")[0]; //for different layout
      }

      if (title != undefined) {
        title = title.innerHTML.trim();
        products.push(title);
      }

    }


    // Here is where you call the API route with the "jsonString" variable
    $.ajax({
      type: "POST",
      url: constants.getBaseAPIUrl() +"GetSearchResultsPageCache",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify(products),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {

        var sortOrder = data.map(element => element.orig_pos);

        sortList(sortOrder, list, b);
      },
      failure: function(errMsg) {
        console.log(errMsg);
      }
    });


  }


  chrome.storage.sync.get({
    betaMode: true,
    toSort: true
  }, function(items) {
    //get dom element for search results list
    var list = document.getElementById("s-results-list-atf");
    if (list == null) {

      if(document.getElementsByClassName("s-result-list") == undefined)
        return;
      list = document.getElementsByClassName("s-result-list")[0]; //for different layout
    }
    b = list.children;
		if(items.toSort)
    	getAllTheSortScores(list, b);



  });



});
