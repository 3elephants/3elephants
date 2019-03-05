import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater} from './utils'
import OriginalTooltip from './../original_label_tooltip';

export function createOriginal(data) {
  var updateLogic = (params) => {
    var labelContainer = '<span id="elephant-data-tooltip-span"> </span>';
    $("#productTitle").append(labelContainer);
    ReactDOM.render( <OriginalTooltip data={params[0]}/> , document.getElementById('elephant-data-tooltip-span'));
  };
  jQueryDOMUpdater(updateLogic, [data]);
}
