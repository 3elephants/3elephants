import React, { Component } from 'react';

class PriceChanger   extends Component {
  priceChecker()
  {


      // A score of 0.0 should be a variant% price increase
      this.greenTax = 0.0;
      if(this.props.score <= 0.59) {
          var invertedScore = (1-this.props.score);
          invertedScore -= 0.4;
          invertedScore/=0.6;
          this.greenTax = this.props.percentage * invertedScore * this.props.amazonData.price;
      }
  }
  constructor(props) {
    super(props);

    this.priceChecker();
  }




  render() {

    var isGreenTaxed = (this.props.score <= 0.59);
    var greenTaxContainer = <span className="elephants-price-text">
                       (advised green tax: $<span id="elephants-tax-amount">{Math.abs(this.greenTax).toFixed(2)}</span>)
                        </span>

    return (<span> {isGreenTaxed && greenTaxContainer}
            </span>);
  }
}

export default PriceChanger;
