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


    return (<span>{classifictionSpan}</span>);

  }
}
export default Label;
