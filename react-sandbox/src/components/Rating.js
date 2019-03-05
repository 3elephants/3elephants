import React, { Component } from 'react';

import StarRatingComponent from 'react-star-rating-component';

class Rating extends Component {

  constructor(props) {
    super(props);
  }

  

  render() {
    return (
    	<div id="rating_component">
	      <StarRatingComponent
          name="rate1" 
          starCount={5}
          value={this.props.score * 5}
          
        />
	    </div>
    );
  }
}

export default Rating;
