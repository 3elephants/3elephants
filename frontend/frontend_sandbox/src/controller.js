import React, {Component} from 'react';

import ReactDOM from 'react-dom';
import $ from "jquery";
import jQuery from "jquery";
// turn on jquery
window.$ = $;
window.jQuery = jQuery;


import * as customUtils from './lib/utils';
import * as label from './lib/label';
import * as tooltip from './lib/tooltip';
import * as reformat from './lib/reformat';
import * as addToCart from './lib/add_to_cart';
import * as navCart from './lib/nav_cart';
import * as sort from './lib/sort';
import * as shipping from './lib/shipping';

import * as priceChanger from './lib/price_changer'
import * as rating from './lib/rating'
import * as abTest from './lib/ab_test'
import * as constants from './lib/constants'



function updateUICallback(data, configuration) {

  var productGreenRating = data.classification;

  if (configuration.restrictive_mode.is_on && productGreenRating != 0) { //disable most features on beta mode
    return;
  }

  if(configuration.label.is_on && data.has_results &&  !(data.data_quality !=0 && data.data_quality < 2)) {
    label.create(data);
    tooltip.create(data);
    if(configuration.rating.is_on)
      rating.create(data);
    if(configuration.background_color.is_on)
      reformat.changeBackgroundColor(data);
    if(configuration.add_to_cart.is_on)
      addToCart.create(data);
    if(configuration.nav_cart.is_on)
      navCart.create(data);
    if(configuration.price.is_on)
      priceChanger.create(data, configuration.price);
  }



  //this check doesn't apply to the above features
  //because the above would work with not enough data




  abTest.mixpanelInstall();
  abTest.registerSession(configuration, data);
  abTest.trackingCode();
};







function triggerAPI(searchTerm) {
  chrome.storage.sync.get(['elephants_feature_settings'], function(result) {

    if (result.elephants_feature_settings == undefined || result.elephants_feature_settings == null)
      result.elephants_feature_settings = abTest.generateConfiguration();

    var encodedSearchTerm = encodeURIComponent(searchTerm);
    var m = customUtils.regexFunc();

    var afterServerUrl =  "GetProductClass?name=" + encodedSearchTerm + "&mode=" + !result.elephants_feature_settings.restrictive_mode.is_on;
    if (m != null && m != undefined && m.length > 7) {
      if(m[7].length ==10)
        afterServerUrl += "&asin=" + m[7];
    }
    chrome.runtime.sendMessage({
      elephantsGetRequest: true,
      afterServerUrl: afterServerUrl
    }, data => {
      console.log(data);
      updateUICallback(data, result.elephants_feature_settings);
    });



  });
}







//main function
function main() {




  //to turn on sort feature
  sort.create();
  shipping.create();

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
          triggerAPI(searchTerm);
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
