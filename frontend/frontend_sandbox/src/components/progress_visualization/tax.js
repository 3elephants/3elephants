import React, { Component } from 'react';

class Tax  extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var tax = <span className="elephants-price-text" id="elephants-pv-tax">{Math.abs(this.props.cost).toFixed(2)}</span>;
    return {tax};
  }
}

export default Tax;
