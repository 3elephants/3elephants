import React, {Component} from 'react';
class AddToCart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var data = this.props.data;

    var addToCartSpan = <div style="background-color: red;line-height: inherit;border-radius: 2px;padding: 0px 24px;margin: 0px; font-size:20px;" className="nav-line-2 add-to-cart-elephants"> &#x26A0; </div>
    return (<span>{(data.classification == 1) && addToCartSpan}</span>);

  }
}
export default AddToCart;
