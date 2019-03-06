import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

import AddToCart from './../components/add_to_cart';

function greenFunctionality() {
  $(".nav-cart-count,#nav-cart-count").css({
    "color":"#FFFFFF"
  });
  $(".nav-cart,#nav-cart").css({
    "background": "#8fd671",
    "border-radius":"2px"
  });

}
export function create(data) {

  var updateLogic = (params) => {
    if(params[0].classification == 0) {
        greenFunctionality();
    } else if(params[0].classification == 1) {
      console.log(exists(document.getElementById('ne-add-to-cart')));
      if (exists(document.getElementById('ne-add-to-cart'))) {
        return;
      }
      $(".nav-cart,#nav-cart").css({
        "padding": "0px",
        "border-radius":"2px"
      });
      var labelContainer = '<span id="ne-add-to-cart"></span>';
       $(".nav-cart,#nav-cart").html(labelContainer);
        ReactDOM.render( <AddToCart data={params[0]}/> , document.getElementById('ne-add-to-cart'));
    }
  };

  jQueryDOMUpdater(updateLogic, [data]);
}
