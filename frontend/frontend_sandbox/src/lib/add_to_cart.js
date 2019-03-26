import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

import AddToCart from './../components/add_to_cart';

function greenFunctionality() {

  $("#submit\\.add-to-cart .a-button-inner").css({
    "background": "#8fd671"
  });
  


}
export function create(data) {

  var updateLogic = (params) => {
    if(params[0].classification != 2) {
      $("#submit\\.add-to-cart").css({
        "border-width":"2px"
      });
    }
    if(params[0].classification == 0) {
        greenFunctionality();
    } else if(params[0].classification == 1) {

      if (exists(document.getElementById('elephants-add-to-cart'))) {
        return;
      }

      var labelContainer = '<span id="elephants-add-to-cart"></span>';
      if($("#submit\\.add-to-cart").length == 0)
        return;
       $("#submit\\.add-to-cart").html(labelContainer);
        ReactDOM.render( <AddToCart data={params[0]}/> , document.getElementById('elephants-add-to-cart'));
    }
  };

  jQueryDOMUpdater(updateLogic, [data]);
}
