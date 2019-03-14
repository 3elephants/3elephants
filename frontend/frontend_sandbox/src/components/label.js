import React, {Component} from 'react';

class Label extends Component {
  constructor(props) {
    super(props);
    this.labels = [{
      color: 'green',
      text: 'Eco Friendly'
    },{
      color: 'red',
      text: 'Not Eco Friendly'
    },
     {
      color: 'blue',
      text: 'Neutral'
    }]
  }

  render() {
    var data = this.props.data;



    var cClass = this.labels[data.classification];
    var classifictionSpan =   <span id='t_el_label' style={'color:'+ cClass.color}> {cClass.text} </span>;

    //may want to ab test - <span class="no_data_available">**We do not have enough data to give a green score.</span> - no data available feature
    var notEnoughData = (data.has_results == false || (data.data_quality !=0 && data.data_quality < 2));

    return (<span>{!notEnoughData && classifictionSpan}</span>);

  }
}
export default Label;
