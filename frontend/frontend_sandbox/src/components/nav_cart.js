import React, {Component} from 'react';
class NavCart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var data = this.props.data;

    var addToCartSpan =
    <div style="display:table;height:100%">
      <div style="
       display: table-cell;
       vertical-align: middle;
       
       padding: 5px 5px 0 5px;">
        <span aria-hidden="true" class="nav-line-2" style="
         padding: 0px;
         margin-left:0px;
         margin-right: 4px;">&#x26A0; Cart
        </span>
      </div>
    </div>

  return (<span>{(data.classification == 1) && addToCartSpan}</span>);

  }
}
export default NavCart;
