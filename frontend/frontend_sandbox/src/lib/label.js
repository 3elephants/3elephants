import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

import Label from './../components/label';


export function create(data) {
  var updateLogic = (params) => {

    if (exists(document.getElementById('elephant-label-span'))) {
      return;
    }
    var labelContainer = '<span id="elephant-label-span"> </span>';
    $("#productTitle").after(labelContainer);

    ReactDOM.render( <Label data={params[0]}/> , document.getElementById('elephant-label-span'));
  };

  jQueryDOMUpdater(updateLogic, [data]);
}
