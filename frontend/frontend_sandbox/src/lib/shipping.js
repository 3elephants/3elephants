import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'


export function create(data) {
  console.log("Shipping feature is on");
  var updateLogic = (params) => {

    if (exists(document.getElementById('elephant-shipping-span'))) {
      return;
    }

    if(exists(document.getElementsByClassName(".shipping-speed .ship-option")[1])) {
      console.log("Element found!");
    }

    var length = $(".shipping-speed.ship-option").length;
    console.log("length: " + length);

    /* Change background color of the shipping options */
    var studentShipping = $(".shipping-speed.ship-option").eq(0);
    var standardShipping = $(".shipping-speed.ship-option").eq(1);
    var twoDayShipping;
    var freeShipping;

    for(var i = 0; i < length; i++) {
        var text = $(".shipping-speed.ship-option").eq(i).find(".a-color-secondary").text();
        
        //Based on text assign variable
        if(text.search("trialof") != -1)
          studentShipping = $(".shipping-speed.ship-option").eq(i);
        else if(text.search("Standard") != -1)
          standardShipping = $(".shipping-speed.ship-option").eq(i);
        else if(text.search("Two-Day") != -1)
          twoDayShipping = $(".shipping-speed.ship-option").eq(i);
        else if(text.search("FREE") != -1)
          freeShipping = $(".shipping-speed.ship-option").eq(i);
        else
          console.log("One of the shipping options was not recognized");
    }

    if(studentShipping != undefined)
      studentShipping.css("background-color", "#EA5353");
    if(standardShipping != undefined)
      standardShipping.prop("style", "background-color:#7AD038;");
    if(twoDayShipping != undefined)
      twoDayShipping.css("background-color", "#EA5353");
    if(freeShipping != undefined)
      freeShipping.prop("style", "background-color:#7AD038;");

    //Add speech bubble next to the shipping options
    var shippingContainer = '<span id="elephant-shipping-span" style="background-color:#7AD038;"> <div id="elephant-speech-bubble"> Go Green! </div> </span>';
    $("#right-grid").after(shippingContainer);

  };

  jQueryDOMUpdater(updateLogic, [data]);
}

//Jquery selector chains with "dot notation"
//.eq(0) can get the first element in an HTML array, [0] doesn't work
//.css can get the styling done for us
//jQuery.find can search for child elements, string.search looks for keywords in the text