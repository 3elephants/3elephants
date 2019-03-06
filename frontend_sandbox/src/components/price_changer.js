import React, { Component } from 'react';

class PriceChanger   extends Component {
  priceChecker()
  {
      var variant = this.props.variant;

      // A score of 1.0 should be a 50% price reduction
      // And a score of 0.0 should be a 50% price increase

      var greenPriceFactor = (1 + variant.percentage - this.props.score);

      this.modifiedPrice = this.props.amazonData.price * greenPriceFactor;
      // console.log(this.modifiedPrice);

  }
  constructor(props) {
    super(props);

    this.priceChecker();
  }




  render() {


    var variant = this.props.variant;
    if(variant.green_tax) {
      this.modifiedPrice -= this.props.amazonData.price;
    }

    return (<span> ${variant.green_tax && (this.props.amazonData.price)}
                <span className={variant.green_tax?"elephants-price-text":""}>
                  {variant.green_tax && ' +'}
                  {this.modifiedPrice.toFixed(2)}
                </span>
            </span>
            );
  }
}

export default PriceChanger;
