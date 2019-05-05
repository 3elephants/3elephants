import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'
import Tooltip from './../components/tooltip';

export function create(data) {
  var updateLogic = (params) => {

    if(exists(document.getElementById("elephants-data-tooltip")))
      return;
      $("#title_feature_div").css({
        "overflow":"visible"
      });
      $("#actionPanelContainer").css({
        "z-index":"2"
      })
      console.log('<img id="elephants-toggle" src="' +  chrome.extension.getURL("assets/images/elephants-tab.svg") + '"/>');
    $("body").append('<img id="elephants-toggle" src="' +  chrome.extension.getURL("assets/images/elephants-tab.svg") + '"/>');
    var labelContainer = '<div id="elephants-data-tooltip"> </div>';

    $("body").append(labelContainer);
    ReactDOM.render(<Tooltip data={params[0]}/> , document.getElementById('elephants-data-tooltip'));
    $("#elephants-toggle" ).click(function() {
    $( "#elephants-data-tooltip" ).toggle();

    });
    $(window).on("scroll", function(e){
      
      $( "#elephants-data-tooltip" ).toggle();
      $(window).unbind("scroll");
    });

  };
  jQueryDOMUpdater(updateLogic, [data]);
}
