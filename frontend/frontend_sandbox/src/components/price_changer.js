import React, { Component } from 'react';

class PriceChanger   extends Component {
  priceChecker()
  {
      var variant = this.props.variant;

      // A score of 1.0 should be a 50% price reduction
      // And a score of 0.0 should be a 50% price increase

      var greenPriceFactor = (1 - variant.percentage) +  (variant.percentage * 2 * (1 - this.props.score));

      this.modifiedPrice = this.props.amazonData.price * greenPriceFactor;



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

    var plusOrMinus = (Math.sign(this.modifiedPrice) == 1)?' +':' -';
    return (<span> ${variant.green_tax && (this.props.amazonData.price)}
                <span className={variant.green_tax?"elephants-price-text":""}>
                  {variant.green_tax &&  plusOrMinus}
                  {Math.abs(this.modifiedPrice).toFixed(2)}
                </span>
            </span>
            );
  }
}

export default PriceChanger;
