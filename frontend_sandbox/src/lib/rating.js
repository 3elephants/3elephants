import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

import Rating from './../components/rating';


export function create(data) {
  var updateLogic = (params) => {

    var returnValue = (params[1]==true)?params[1]:false;

    if (exists(document.getElementById('elephants-rating'))) {
      return;
    }
    var labelContainer = '<div id="elephants-rating"></div>';
    $( "#averageCustomerReviews_feature_div" ).prepend(labelContainer);
    ReactDOM.render(<Rating score={params[0].score} />, document.getElementById('elephants-rating'));

  };

  jQueryDOMUpdater(updateLogic, [data]);
}
