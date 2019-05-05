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
  let cClass = data.classification;
  if(!data.has_results)
    cClass = data.health_risk;
  if (cClass == 1) {
    var updateLogic = (params) => { //private logic is where core dom updating logic is placed

      $("#leftCol, #centerCol, .a-container, .a-box").css({
        "background-color": "#ffd6d6"
      });
      $(".a-container").css({
        "padding-top":"100px"
      });

      $(".a-box").css({
        "border-color":"#8b0000"
      });

      if($("#t_el_label").length) {
        $("#t_el_label").css({
          "color": "#8b0000"
        });
      }
      if($("#elephants-health-risk-span").length) {
        $("#elephants-health-risk-span").css({
          "color": "#8b0000"
        });
      }
    };
    jQueryDOMUpdater(updateLogic, []);

  }
}
