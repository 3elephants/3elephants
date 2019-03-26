import React, {Component} from 'react';
class AddToCart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var data = this.props.data;

    var addToCartSpan =
    <span class="a-button-inner" style="
        background: red;
        color: white;">
      <i class="a-icon a-icon-cart" style="
          font-style: normal;
          font-size:18px;
          margin-top: 2px;
          background-image:none;
      ">&#x26A0;</i>
      <input id="add-to-cart-button" name="submit.add-to-cart" title="Add to Shopping Cart" data-hover="Select <b>__dims__</b> from the left<br> to add to Shopping Cart" class="a-button-input" type="submit" value="Add to Cart" aria-labelledby="submit.add-to-cart-announce"/>
      <span id="submit.add-to-cart-announce" class="a-button-text" aria-hidden="true" style="
      color: white;">Add to Cart</span>
    </span>

  return (<span>{(data.classification == 1) && addToCartSpan}</span>);

  }
}
export default AddToCart;
