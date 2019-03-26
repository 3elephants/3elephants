import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'
import Tooltip from './../components/tooltip';

export function create(data) {
  var updateLogic = (params) => {

    if(exists(document.getElementById("elephant-data-tooltip-span")))
      return;
      $("#title_feature_div").css({
        "overflow":"visible"
      });
      $("#actionPanelContainer").css({
        "z-index":"2"
      })
    var labelContainer = '<a class="elephants-link-no-style" href="https://3elephants.github.io/website/description.html"> <div id="elephant-data-tooltip-span"> </div> </a>';
    $("#elephant-label-span").after(labelContainer);
    ReactDOM.render( <Tooltip data={params[0]}/> , document.getElementById('elephant-data-tooltip-span'));
  };
  jQueryDOMUpdater(updateLogic, [data]);
}
