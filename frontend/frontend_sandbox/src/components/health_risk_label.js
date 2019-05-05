import React, {Component} from 'react';

class HealthRiskLabel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var data = this.props.data;
    var cClass = data.health_risk;
    var healthRisk = <span style="color:red"> {(data.has_results == true)?"&":""} Health Hazard </span>;
    if(cClass != 1) {
      healthRisk = <div className="elephants-informational-label">Note: {(cClass == 0)?"No Health Risk Found":"Mild Health Risk"} </div>
    }


    return (<span>{healthRisk}</span>);

  }
}
export default HealthRiskLabel;
