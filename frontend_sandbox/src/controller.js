import React, {Component} from 'react';

import ReactDOM from 'react-dom';


import * as customUtils from './lib/utils';
import * as label from './lib/label';
import * as tooltip from './lib/tooltip';
import * as reformat from './lib/reformat'
import * as addToCart from './lib/add_to_cart'
import * as priceChanger from './lib/price_changer'
import * as rating from './lib/rating'



function updateUICallback(data, betaMode) {
  var productGreenRating = data.classification;

  if (!betaMode && productGreenRating != 0) { //disable most features on beta mode
    return;
  }

  //TODO: call chrome local storage apis to retrieve configuration
  //and use configuration to determine which features should exist
  var configuration = {
    reformat: {is_on: true},
    label: {is_on: true},
    tooltip: {is_on: true},
    background_color: {is_on:true},
    add_to_cart:{is_on:true},
    price:{is_on: true, green_tax:false, percentage:0.5},
    rating:{is_on: true}
  };

  if(configuration.reformat.is_on)
    reformat.spaceTitleDiv();
  if(configuration.label.is_on)
    label.create(data);
  if(configuration.tooltip.is_on)
    tooltip.create(data);

  //this check doesn't apply to the above features
  //because the above would work with not enough data

  var notEnoughData = (data.has_results == false || (data.data_quality !=0 && data.data_quality < 2))
  if (!notEnoughData) {
    if(configuration.background_color.is_on)
      reformat.changeBackgroundColor(data);
    if(configuration.add_to_cart.is_on)
      addToCart.create(data);
    if(configuration.price.is_on)
      priceChanger.create(data, configuration.price);
    if(configuration.rating.is_on)
      rating.create(data);
  }
};




function triggerAPI(searchTerm, betaMode) {
  var encodedSearchTerm = encodeURIComponent(searchTerm);
  var m = customUtils.regexFunc();
  var serverUrl = "https://sheltered-mountain-69586.herokuapp.com/GetProductClass?name=" + encodedSearchTerm + "&mode=" + betaMode;
  if (m != null && m != undefined && m.length > 7) {
    serverUrl += "&asin=" + m[7];
  }

  $.get(serverUrl, function(data, status) {
    console.log(data);
    data = JSON.parse(data);
    updateUICallback(data, betaMode);
  });


};







//main function
function main() {
  //we need the product title to trigger the api call thus it needs to be parsed
  //observe the dom to figure out when this is parsed and we can trigger api call
  var observer = new MutationObserver(function(mutations) {

    for (var i = 0; i < mutations.length; i++) {
      for (var j = 0; j < mutations[i].addedNodes.length; j++) {
        // We're iterating through _all_ the elements as the parser parses them,
        // deciding if they're the one we're looking for.
        var node = mutations[i].addedNodes[j];

        if ((node.nodeType == Node.ELEMENT_NODE) &&
          (node.id == "productTitle")) {
          var searchTerm = $("#productTitle").text();
          searchTerm = searchTerm.trim();
          chrome.storage.sync.get({
            betaMode: true,
            toSort: true
          }, function(items) {

            triggerAPI(searchTerm, items.betaMode); //probably url encode product info

          });
          observer.disconnect();
        }


      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

};

main();
