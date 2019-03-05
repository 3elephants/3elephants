import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater} from './utils'

import OriginalLabel from './../original_label';


export function createOriginal(data) {
  var updateLogic = (params) => {
    var labelContainer = '<span id="elephant-label-span"> </span>';
    $("#productTitle").append(labelContainer);

    ReactDOM.render( < OriginalLabel data={params[0]}/> , document.getElementById('elephant-label-span'));
  };
  
  jQueryDOMUpdater(updateLogic, [data]);
}
