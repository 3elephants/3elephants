import React, {Component} from 'react';

import ReactDOM from 'react-dom';
import $ from "jquery";
import jQuery from "jquery";
// turn on jquery
window.$ = $;
window.jQuery = jQuery;


import * as customUtils from './lib/utils';
import * as label from './lib/label';
import * as healthRisk from './lib/health_risk_label';
import * as tooltip from './lib/tooltip';
import * as reformat from './lib/reformat';
import * as addToCart from './lib/add_to_cart';
import * as navCart from './lib/nav_cart';
import * as sort from './lib/sort';

import * as priceChanger from './lib/price_changer'
import * as rating from './lib/rating'
import * as abTest from './lib/ab_test'
import * as constants from './lib/constants'
import * as shipping from './lib/shipping';




function updateUICallback(data, configuration) {

  var productGreenRating = data.classification;

  if (configuration.restrictive_mode.is_on && productGreenRating != 0) { //disable most features on beta mode
    return;
  }

  if(configuration.label.is_on && (data.has_results || data.has_results_health) &&  !(data.data_quality < 1)) {


    if(data.has_results) {
      if(configuration.rating.is_on)
        rating.create(data);
      if(configuration.price.is_on)
        priceChanger.create(data, configuration.price);
      if(configuration.label.is_on)
        label.create(data);
    }
    if(data.has_results_health) {
      if(configuration.health_risk_label.is_on)
        healthRisk.create(data);
    }

    if(configuration.background_color.is_on)
      reformat.changeBackgroundColor(data);
    if(configuration.add_to_cart.is_on)
      addToCart.create(data);
    if(configuration.nav_cart.is_on)
      navCart.create(data);
    if(configuration.tooltip.is_on) {
      tooltip.create(data);
    }

  }



  //this check doesn't apply to the above features
  //because the above would work with not enough data




  abTest.mixpanelInstall();
  abTest.registerSession(configuration, data);
  abTest.trackingCode();
};







function triggerAPI(searchTerms) {

  chrome.storage.sync.get(['elephants_feature_settings'], function(result) {
    result.elephants_feature_settings = abTest.generateConfiguration();
    if (result.elephants_feature_settings == undefined || result.elephants_feature_settings == null)
      result.elephants_feature_settings = abTest.generateConfiguration();
    let endUrl = "";
    for(var searchTerm in searchTerms) {
      endUrl += "&";
      endUrl += searchTerm.toLowerCase();
      endUrl += "=";
      endUrl += encodeURIComponent(searchTerms[searchTerm]);

    }

    var encodedSearchTerm = encodeURIComponent(searchTerm);
    var afterServerUrl =  "GetProductClassv2?mode=" + !result.elephants_feature_settings.restrictive_mode.is_on + endUrl;

    console.log(afterServerUrl)
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
  //to turn on shipping feature
  shipping.create();

  //we need the product title to trigger the api call thus it needs to be parsed
  //observe the dom to figure out when this is parsed and we can trigger api call
  let triggered = false;
  let boolMap = {
    "productTitle": false,
    "nodeID": false,
    "ASIN": false,
    "bylineInfo": false
  };
  let textKeys = new Set(["productTitle"]);
  let searchTerms = {}
  let keys = Object.keys(boolMap);
  var findValuefromIDSub = (key) => {
    var results = ((textKeys.has(key))?($("#"+key).text().trim()):($("#"+key).val()));
    return results;
  }
  var findValuefromID = (key) => {

    if(key == "bylineInfo") {
      let byLineUrl = $("#"+key);

      if (byLineUrl.length == 0) {

        byLineUrl = $("#bylineInfo_feature_div #brand");

      }
      if(byLineUrl.length == 0) {
        return "";
      }
      byLineUrl = byLineUrl[0].href.split("-bin=")[1];
      byLineUrl  = decodeURIComponent(byLineUrl);
      return byLineUrl;
    } else {
      return findValuefromIDSub(key);
    }
  }

  var observer = new MutationObserver(function(mutations) {

    for (var i = 0; i < mutations.length; i++) {
      for (var j = 0; j < mutations[i].addedNodes.length; j++) {
        // We're iterating through _all_ the elements as the parser parses them,
        // deciding if they're the one we're looking for.
        var node = mutations[i].addedNodes[j];

        for (var key of keys) {
          if ((node.nodeType == Node.ELEMENT_NODE) && (node.id == key)) {
            searchTerms[key] =  findValuefromID(key);
            boolMap[key] = true;
          }
        }
        let isTrigger = true;
        for (var key of keys) {
          isTrigger &= boolMap[key];
          if (!isTrigger)
            break;
          }
        triggered = isTrigger;
        if (triggered) {
          observer.disconnect();
          triggerAPI(searchTerms);
        }

      }
    }
  });

  $(function() {
    if (!triggered) {
      triggered = true;
      for (var key of keys) {
          if(!($("#" + key).length)) {
            return;
          }
          searchTerms[key] =  findValuefromID(key);
      }
      observer.disconnect();
      triggerAPI(searchTerms);

    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

};

main();
