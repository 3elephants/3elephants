import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

import Shipping from './../components/shipping';


export function create(data) {
  var updateLogic = (params) => {

    if (exists(document.getElementById('elephant-shipping-span'))) {
      return;
    }

    //Change background color of the two shipping options
    console.log("Shipping feature selected");
    $(".a-radio a-spacing-mini shipping-speed ship-option pointer no-scheduled-delivery").eq(0).attr("style", "background-color:#EA5353;");
    $(".a-radio a-spacing-mini shipping-speed ship-option pointer no-scheduled-delivery").eq(1).attr("style", "background-color:#7AD038;");

    //Add speech bubble next to the shipping options
    var speechBubble = '<div id="elephant-speech-bubble"> Go Green! </div>';
    var shippingContainer = '<span id="elephant-shipping-span" style="background-color:#7AD038;"> </span>';
    $("#right-grid").after(shippingContainer);

    ReactDOM.render( speechBubble , document.getElementById('elephant-shipping-span'));
  };

  jQueryDOMUpdater(updateLogic, [data]);
}
