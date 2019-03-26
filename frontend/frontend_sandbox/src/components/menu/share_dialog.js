import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
  RedditIcon,
  FacebookIcon,
  TwitterIcon
} from 'react-share';

import './scss/App.scss';

import {Modal, Button, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


class ShareDialog extends React.Component {
  constructor(props) {
    super(props);


    this.shareUrl = "https://tinyurl.com/lashopgreen";

  }

  render() {
    const shareMaterial = "3 Elephants is a chrome extension that tells you the eco-friendliness of products while online shopping. Try it out!";
    const emailTitle = "Plugin for Eco-Concious Shopping";
    const emailBody = "This is an invitation to a chrome extension to incentivize green shopping on Amazon.";
    return (
        <div id="elephants-share-icons">

          <div className="elephants-share-icon-container">
            <FacebookShareButton quote={shareMaterial} className="share-icon-elephants" url="https://tinyurl.com/lashopgreen">
              <FacebookIcon
               size={20}
               round />
            </FacebookShareButton>
          </div>
          <div className="elephants-share-icon-container">
            <RedditShareButton  className="share-icon-elephants" title={emailTitle} url="https://tinyurl.com/lashopgreen">
              <RedditIcon
               size={20}
               round />
           </RedditShareButton>
          </div>
          <div className="elephants-share-icon-container">
            <TwitterShareButton className="share-icon-elephants" url="https://tinyurl.com/lashopgreen">
              <TwitterIcon
               size={20}
               round />
            </TwitterShareButton>
          </div>
        </div>


    );
  }
}

export default ShareDialog;
