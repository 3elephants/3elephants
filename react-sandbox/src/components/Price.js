import React, { Component } from 'react';

class Label extends Component {

  constructor(props) {
    super(props);
    priceChecker();
  }

  priceChecker()
  {
      // A score of 1.0 should be a 50% price reduction
      // And a score of 0.0 should be a 50% price increase
      var green_price_factor = (1.5 - this.props.score);
      this.props.original_price *= green_price_factor;
  }
  

  render() {
    return (
    	<div id="green_price">
          <span style='color:green'> this.props.original_price </span>
      </div>
    );
  }
}

export default Price;
