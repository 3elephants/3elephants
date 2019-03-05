import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Rating from './components/Rating';


function getResultsFromAPI(searchTerm, betaMode) {
  //Note: Call to backend service here

  var regex = RegExp("^(http[s]?://)?([\\w.-]+)(:[0-9]+)?/([\\w-%]+/)?(dp|gp/product|exec/obidos/asin)/(\\w+/)?(\\w{10})(.*)?$");
  var m = window.location.href.match(regex);

  var encodedSearchTerm = encodeURIComponent(searchTerm);

  var serverUrl = "https://sheltered-mountain-69586.herokuapp.com/GetProductClass?name=" + encodedSearchTerm + "&mode=" + betaMode;
  if (m!= null && m!=undefined && m.length > 7) {
    serverUrl += "&asin=" + m[7];
  }
  $.get(serverUrl, function(data, status) {
    console.log(data);
    var result = JSON.parse(data);
    var newText = "";

    var productGreenRating = result.classification;
    if (!betaMode && productGreenRating != 0) { //disable most features on beta mode
      return;
    }
    if (result.has_results == false || (result.data_quality != 0 && result.data_quality < 2)) {
      return; //TODO:  A/B Test??
      var newText = "<span class=\"no_data_available\">**We do not have enough data to give a green score.</span> ";

    } else if (productGreenRating == 0)
      newText = "  <span style='color:green'> Eco Friendly </span> ";
    else if (productGreenRating == 1)
      newText = "   <span style='color:red'> Not Eco Friendly <span id=\"sampleDiv\"></span> </span>";
    else if (productGreenRating == 2)
      newText = "    <span style='color:blue'> Neutral </span> ";
    else
      newText = "API return value is not valid in myscript.js";

        //1) productGreenRating is what matters here, should be in props
        //2) We prepend a div called "rating_component" which can be modified later
    $( "#averageCustomerReviews_feature_div" ).prepend( "<div id=\"rating_component\"></div>" );
    ReactDOM.render(<Rating score={result.score} />, document.getElementById('rating_component'));
    console.log("Stars rating feature added");
    

    var labelObject = $(newText);
    if (result.has_results) {

      //5 star scale rating
      labelObject.first().attr('id', 't_el_label');
      var tooltipHTML = "<i class=\"material-icons icon-colors\">info</i> <span class=\"tooltiptext\"> ";

      var calculateScore = function(score) {
        return (score * 5);
      };
      tooltipHTML += "On a 5 star greenness rating scale, our sources give the product a of <span class=\"tooltiptextemphasis\">" +
        Number.parseFloat(calculateScore(result.score)).toFixed(1);


      tooltipHTML += "</span>. ";

      //data quality
      if (result.data_quality >= 2) {
        var dQratingsMap = {
          2: 'Limited',
          3: 'Fair',
          4: 'Good',
          5: 'Robust'
        };
        tooltipHTML += "<br> <br> Based on <span class=\"tooltiptextemphasis\">" +
          dQratingsMap[Math.round(result.data_quality)] +
          "</span> amount of data.";


      }
      tooltipHTML += "<br><br> <a  target=\"_blank\" style=\"font-style: italic;\" href=\"https://3elephants.github.io/website/description.html\">See More Information on How We Rate Products</a> "
      tooltipHTML += "</span>"


      labelObject.append(tooltipHTML);

    }



    var completeText = $("#productTitle").text() + labelObject.prop('outerHTML');
    $("#productTitle").html(completeText);
    $("#title_feature_div").css({
      "overflow": "visible",
      "margin-bottom": "50px"
    });

    ReactDOM.render(<App />, document.getElementById('sampleDiv'));

    $(function() { //incase the rest of the webpage lags and invalidates the css
      $("#productTitle").html(completeText);
      $("#title_feature_div").css({
        "overflow": "visible",
        "margin-bottom": "50px"
      });
      ReactDOM.render(<App />, document.getElementById('sampleDiv'));
    });




  });

  var txt = '{"rating": 0}';
  var obj = JSON.parse(txt);

  var result = obj.rating;
  return result;
}
var MY_SELECTOR = "productTitle"; // Could be any selector
var observer = new MutationObserver(function(mutations) {
  
  for (var i = 0; i < mutations.length; i++) {
    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
      // We're iterating through _all_ the elements as the parser parses them,
      // deciding if they're the one we're looking for.
      var node = mutations[i].addedNodes[j];

      if ((node.nodeType == Node.ELEMENT_NODE) &&
        (node.id == MY_SELECTOR)) {


        var searchTerm = "Soap for Goodness Sakes";
        searchTerm = $("#productTitle").text();

        searchTerm = searchTerm.trim();
        chrome.storage.sync.get({
          betaMode: true,
          toSort: true
        }, function(items) {

          getResultsFromAPI(searchTerm, items.betaMode); //probably url encode product info

        });

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





//
// Part 2: Give the product design description to the Flask server
// *Please note that the product description's entire HTML is being retrieved, not just keywords.
// So the algorithm has to be designed in a way that this will not dilute the score.
// var productDescription = "This is just a product description";
// productDescription = $("#a-section launchpad-text-left-justify").html();
//
// No trimming necessary because of how jQuery html method works
// realProductDescription = productDescription;
// console.log(realProductDescription);
// giveAPITheProductDescription(realProductDescription);
//
//
// Part 3: Get the Customer question and answers
// var allAnswers = "This is going to be an array of customer answers";
// var allText = "This is the allText variable";
// allAnswers = $("#allAnswers").each(function(index) {
//   console.log(index + ": " + $(this).text());
//   allText = allText + " " + $(this).text();
// });
//
// console.log("Part 3 is almost done");
// // giveAPITheCustomerAnswers(allText);
// console.log("Part 3 is now done");
