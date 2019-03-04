'use strict';

const e = React.createElement;
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return (<h1> {2+2} </h1>);
  }
}

const domContainer = document.querySelector('#like_button_container');

ReactDOM.render(e(LikeButton), domContainer);
//
// (function() {
//    // your page initialization code here
//    // the DOM will be available here
//    const domContainer = document.querySelector('#like_button_container');
//
//    ReactDOM.render(e(LikeButton), domContainer);
// })();
