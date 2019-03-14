import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

import PriceChanger from './../components/price_changer';


export function create(data, variant) {
  var updateLogic = (params) => {
    if (exists(document.getElementById('elephants-price'))) {
      return;
    }
    //get price
    var floatPrice = params[2] //to keep price changer create idempotent
    if (floatPrice == undefined || floatPrice == null)
    {
      var amazonPrice = $("#priceblock_ourprice").text();
      var regex = /[^0-9.]/g;
      var newPrice = amazonPrice.replace(regex, "");
      floatPrice = parseFloat(newPrice);
    }

    var amazonData = {
      price:floatPrice
    };


    //update DOM
    var labelContainer = '<span id="elephants-price"></span>';
    $("#priceblock_ourprice").html(labelContainer);

    ReactDOM.render(<PriceChanger score={params[0].score} variant={params[1]} amazonData={amazonData} />, document.getElementById('elephants-price'));

  };

  jQueryDOMUpdater(updateLogic, [data, variant]);
}
