import React, { Component } from 'react';
import Rating from 'react-rating';
class ElephantsRating extends Component {

  constructor(props) {
    super(props);
  }



  render() {

    const SVGIcon = (props) =>
      <img src={props.href} className={props.className}/>


    return (
    	<div id="rating_component">

	      <Rating name="elephants-star-rating"
          //  emptySymbol={<SVGIcon href="./img/elephant_rating_empty.svg" className="icon" />}
            initialRating={this.props.score * 5}
            emptySymbol={<SVGIcon className='icon' href={chrome.runtime.getURL('assets/images/elephant_rating_empty.svg')}/>}

          fullSymbol={<SVGIcon className='icon' href={chrome.runtime.getURL('assets/images/elephant_rating_full.svg')}/>}
            readonly />
	    </div>
    );
  }
}

export default ElephantsRating;
