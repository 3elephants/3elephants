import React, { Component } from 'react';

import ShareDialog from './share_dialog'
import './scss/App.scss';
import * as optionsManager from '../../lib/menu/options_manager';
class MainMenu extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);

    this.setState({
      show: false
    });
  }



  handleShow() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {elephantShareDialog: true}, function(response) {
    window.close();
  });

});
  }

  handleShowOptions() {
    chrome.tabs.create({url: chrome.runtime.getURL("options_menu.html")});
  }

  render() {

    return (
      <div>


      <div id="elephants-menu-container">

        <div id="elephants-info-bar">
            <div className="callout"> Help Us Get the Word Out! &nbsp;-&nbsp; </div>
          <ShareDialog/>
        </div>

        <div id="elephants-menu">
              <ul>

                <li>
                      <input type="checkbox" id="sort-results"/>


                      <label htmlFor="sort-results">


                        <span className="checkmark"></span>
                        <div className="label">
                          Sort Results By Green Score
                        </div>
                      </label>


                </li>

                <li>
                      <input type="checkbox" id="restrictive-mode"/>


                      <label htmlFor="restrictive-mode">


                        <span className="checkmark"></span>
                        <div className="label">
                          Restrictive Mode
                        </div>
                      </label>


                </li>

              </ul>

              <div id="more-options">
              <input type="button" className="button" onClick={this.handleShowOptions} value="More Options"/>
              </div>



          <a target="_blank" className="elephants-menu-footer-link" href="https://3elephants.github.io/website/description.html">How Products are Rated </a>
          &#8226; <a target="_blank" className="elephants-menu-footer-link" href="https://3elephants.github.io/website/feedback/">Feedback </a> &#8226;
        <a target="_blank" className="elephants-menu-footer-link" href="https://chrome.google.com/webstore/detail/3-elephants/bcbdfklhjmhkhdloghmimgomcllhndio"> Rate Us </a>
        </div>
        </div>
      </div>

    );
  }
  componentDidMount() {
    var options = [
     {
       id: 'sort-results',
       features: ['sort_results']
     }, {
       id: 'restrictive-mode',
       features: ['restrictive_mode']
     }
   ];
   optionsManager.create(options);
  }
}

export default MainMenu;
