import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

import NavCart from './../components/nav_cart';

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

      if (exists(document.getElementById('elephants-nav-cart'))) {
        return;
      }
      $(".nav-cart,#nav-cart").css({
        "padding": "0px",
        "border-radius":"2px",
        "background": "#ff0000"
      });
      var labelContainer = '<span id="elephants-nav-cart"></span>';
       $(".nav-cart,#nav-cart").html(labelContainer);
        ReactDOM.render( <NavCart data={params[0]}/> , document.getElementById('elephants-nav-cart'));

    }
  };

  jQueryDOMUpdater(updateLogic, [data]);
}
