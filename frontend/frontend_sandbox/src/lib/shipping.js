import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'
import Shipping from './../components/shipping';

function shippingModifier(jQueryArray) {
  var goodShippingOption = null;
  var length = jQueryArray.length;
  var goGreenHTML = '<span> <div class="elephants-speech-bubble-shipping"> Help our planet and get cash back by shipping it more <span class="three-elephants-promotion">efficiently.</span> </div> </span>'
  for(var i = 0; i < length; i++) {
      var badShipping = false;
      var text = jQueryArray.eq(i).find(".a-color-secondary").text().trim().toLowerCase();

      var date = jQueryArray.eq(i).find(".a-color-success").text().trim();

      if(date == "Tomorrow") {
        badShipping = true;
      } else {
        var shippingDate = new Date(date + ", " + new Date().getFullYear());
        var timeDiff = Math.abs(shippingDate.getTime() - new Date().getTime());
        var difference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if(difference <= 3) {
            badShipping = true;
        }
      }
      if(!badShipping) {
        if(text.includes("no-rush") || text.includes("standard")) {
          goodShippingOption = jQueryArray.eq(i);
          $(goodShippingOption).addClass("good-shipping");


          $($(goodShippingOption).find("input")[0]).attr('checked', true);
          $($(goodShippingOption).find(".deliveryPromoDescription")).addClass("three-elephants-promotion");

          $(goodShippingOption).after(goGreenHTML);
          ReactDOM.render( <Label data={params[0]}/> , document.getElementById('elephant-label-span'));
        }
      } else {
        jQueryArray.eq(i).addClass("bad-shipping");
      }

  }
}
export function create() {
  $(function() {
    var updateLogic = (params) => {
      shippingModifier($(".prime-ship-speed"));
      shippingModifier($(".shipping-speed.ship-option"));
    };
    updateLogic();
  });
}

//Jquery selector chains with "dot notation"
//.eq(0) can get the first element in an HTML array, [0] doesn't work
//.css can get the styling done for us
//jQuery.find can search for child elements, string.search looks for keywords in the text
