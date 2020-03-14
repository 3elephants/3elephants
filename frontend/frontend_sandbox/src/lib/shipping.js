import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'
import Shipping from './../components/shipping';

function shippingModifier(selector, userClicked) {
  var jQueryArray = $(selector)
  var goodShippingOption = null;
  var length = jQueryArray.length;
  var goGreenHTML = '<span> <div class="elephants-speech-bubble-shipping"> Help our planet and get cash back by shipping it more <span class="three-elephants-promotion">efficiently.</span> </div> </span>'
  var goGreenHTMLStandard = '<span> <div class="elephants-speech-bubble-shipping"> Help our planet by shipping it more <span class="three-elephants-promotion">efficiently.</span> </div> </span>'

  for(var i = 0; i < length; i++) {

      var fastShipping = false;
      var text = jQueryArray.eq(i).find(".a-color-secondary").text().trim().toLowerCase();

      var date = jQueryArray.eq(i).find(".a-color-success").text().trim();

      if(date == "Tomorrow") {
        fastShipping = true;
      } else {
        var shippingDate = new Date(date + ", " + new Date().getFullYear());
        var timeDiff = Math.abs(shippingDate.getTime() - new Date().getTime());
        var difference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if(difference <= 3) {
            fastShipping = true;
        }
      }
      if(!fastShipping) {

        if(text.includes("no-rush")) {
          goodShippingOption = jQueryArray.eq(i);
          $(goodShippingOption).addClass("good-shipping");

          if(!userClicked) {
            $($(goodShippingOption).find("input")[0]).attr('checked', true);
          }

          $($(goodShippingOption).find(".deliveryPromoDescription")).addClass("three-elephants-promotion");

          $(goodShippingOption).after(goGreenHTML);
        } else if(text.includes("standard")) {
          goodShippingOption = jQueryArray.eq(i);
          $(goodShippingOption).addClass("good-shipping");

          if(!userClicked) {
            $($(goodShippingOption).find("input")[0]).attr('checked', true);
          }
          $(goodShippingOption).after(goGreenHTMLStandard);
        }
      }
      $(jQueryArray.eq(i)).click(function() {
        var intervalTimer =  setInterval(()=>{

          if($("#loading-spinner-blocker-doc").css("display") == "none" && $(selector).length) {

              clearInterval(intervalTimer);
              shippingModifier($(selector), true);

          }
        }, 500);
      });
  }
}
export function create() {
  $(function() {

    var updateLogic = (params) => {
      shippingModifier(".prime-ship-speed", false);
      shippingModifier(".shipping-speed.ship-option", false);
    };
    setTimeout(()=>updateLogic() ,500);

  });
}

//Jquery selector chains with "dot notation"
//.eq(0) can get the first element in an HTML array, [0] doesn't work
//.css can get the styling done for us
//jQuery.find can search for child elements, string.search looks for keywords in the text
