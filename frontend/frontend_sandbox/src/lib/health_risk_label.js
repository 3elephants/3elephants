import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'


import HealthRiskLabel from './../components/health_risk_label';


export function create(data) {
  var updateLogic = (params) => {

    if (exists(document.getElementById('elephants-health-risk-span'))) {
      return;
    }

    var healthRisk = '<span id="elephants-health-risk-span"> </span>';
    $("#productTitle").after(healthRisk);
    ReactDOM.render( <HealthRiskLabel data={params[0]}/> , document.getElementById('elephants-health-risk-span'));

  };

  jQueryDOMUpdater(updateLogic, [data]);
}
