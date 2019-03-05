import React, { Component } from 'react';

class Label extends Component {

  constructor(props) {
    super(props);
  }

  labelSelector()
  {
      if(this.props.variant = "EcoFriendly_Label") {
          return (
                <div id="ecofriendly_label">
                     <img src="images/eco-friendly-label.jpg" />
                </div>
          );
      }
      else if(this.props.variant = "Product_Title") {
          if(this.props.score > 0.8)  
          {
              return (
                  <div id="ecofriendly_label">
                    <span style='color:green'> Eco Friendly </span>
                  </div>
              );
          }
          else if(this.props.score > 0.3) {
              return (
                <div id="ecofriendly_label">
                    <span style='color:yellow'> Neutral </span>
                </div>
              );
          }
          else {
              return (
                <div id="ecofriendly_label">
                    <span style='color:red'> Not Eco Friendly </span>
                </div>
              );
          }

  }
  

  render() {
    return (
    	labelSelector();
    );
  }
}

export default Label;
