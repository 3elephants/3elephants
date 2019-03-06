import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater} from './utils'
import Tooltip from './../components/tooltip';

export function create(data) {
  var updateLogic = (params) => {
    var labelContainer = '<span id="elephant-data-tooltip-span"> </span>';
    $("#productTitle").append(labelContainer);
    ReactDOM.render( <Tooltip data={params[0]}/> , document.getElementById('elephant-data-tooltip-span'));
  };
  jQueryDOMUpdater(updateLogic, [data]);
}
