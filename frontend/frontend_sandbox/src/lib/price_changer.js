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

      amazonPrice = amazonPrice.trim();

      var indexOfDelimiter = amazonPrice.indexOf(' ');
      if(indexOfDelimiter != -1)
        amazonPrice = amazonPrice.substr(0,indexOfDelimiter);
      indexOfDelimiter = amazonPrice.indexOf('(');
      if(indexOfDelimiter != -1)
        amazonPrice = amazonPrice.substr(0,indexOfDelimiter);


      var regex = /[^0-9.]/g;
      var newPrice = amazonPrice.replace(regex, "");
      floatPrice = parseFloat(newPrice);

    }

    var amazonData = {
      price:floatPrice
    };


    //update DOM
    var labelContainer = '<span id="elephants-price"></span>';
    var priceContainer = $("#priceblock_ourprice");
    var outerSpecialContainer = $("#snsPrice");

    if(outerSpecialContainer != undefined && outerSpecialContainer != null && outerSpecialContainer.length != 0) {
      priceContainer = $("#priceblock_snsprice_Based .a-size-large").not(".aok-hidden");
      if(priceContainer == undefined || priceContainer == null)
        priceContainer = $("#priceblock_snsprice_Tiered .a-size-large").not(".aok-hidden");
    }



    if(priceContainer == undefined || priceContainer == null || priceContainer.length == 0)
      return;
    priceContainer.append(labelContainer);
    ReactDOM.render(<PriceChanger score={params[0].score} percentage={variant.percentage} amazonData={amazonData} />, document.getElementById('elephants-price'));

  };

  jQueryDOMUpdater(updateLogic, [data, variant]);
}
