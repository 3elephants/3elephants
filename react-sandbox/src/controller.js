import React, {Component} from 'react';

import ReactDOM from 'react-dom';


import * as customUtils from './lib/utils';
import * as label from './lib/label';
import * as tooltip from './lib/tooltip';
import * as reformat from './lib/reformat'


function updateUICallback(data, betaMode) {
  var productGreenRating = data.classification;

  if (!betaMode && productGreenRating != 0) { //disable most features on beta mode
    return;
  }

  //TODO: call chrome local storage apis to retrieve configuration
  //and use configuration to determine which features should exist
  var configuration = {
    reformat: {type: true},
    label: {type: true},
    tooltip: {type: true},
    background_color: {type:true}
  };

  if(configuration.reformat.type)
    reformat.spaceTitleDiv();
  if(configuration.label.type)
    label.createOriginal(data);
  if(configuration.tooltip.type)
    tooltip.createOriginal(data);
  if(configuration.background_color.type)
    reformat.changeBackgroundColor(data);

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
