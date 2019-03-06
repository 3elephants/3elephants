import {
  jQueryDOMUpdater
} from './utils'



export function spaceTitleDiv() {
  var updateLogic = (params) => { //private logic is where core dom updating logic is placed
    $("#title_feature_div").css({
      "overflow": "visible",
      "margin-bottom": "50px"
    });
  };
  jQueryDOMUpdater(updateLogic, []);
}

export function changeBackgroundColor(data) {
  
  if (data.classification == 1) {
    var updateLogic = (params) => { //private logic is where core dom updating logic is placed

      $("#leftCol").css({
        "background-color": "#ffd6d6"
      });
    };
    jQueryDOMUpdater(updateLogic, []);

  }
}
