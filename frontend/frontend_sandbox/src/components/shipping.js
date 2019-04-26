import React, {Component} from 'react';

class Shipping extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var data = this.props.data;


    var cClass = this.labels[data.classification];
    var classifictionSpan =   <span id='t_el_label' style={'color:'+ cClass.color}> {cClass.text} </span>;


    return (<span>{classifictionSpan}</span>);

  }
}
export default Label;
