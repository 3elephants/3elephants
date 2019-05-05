import React from 'react';
import ReactDOM from 'react-dom';
import {jQueryDOMUpdater, exists} from './utils'

export function run() {
	//First step is to redirect to Amazon home page
	var amazonHomePage= "https://www.amazon.com"; 
    window.location = amazonHomePage; 

    //Now update the DOM to highlight search engine
    var modalText = "Search for this item to get started: Campbell's Soup";
    var modalElement = "<div id='homePageModal' class='modal'><div class='modal-content'><span class='close'>&times;</span><p>"+modalText+"</p></div></div>";

    //Apply some CSS
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'modalStyling.css';
    link.media = 'all';
    head.appendChild(link);

    // TODO: Update DOM with jQueryDOMUpdater


    //Now wait until the user has hit search
    var redirectedLink = "https://www.amazon.com/s?k=campbell%27s+soup&ref=nb_sb_noss_2";
    var checkExist = setInterval(function() {
       if (!exists(document.getElementById('search'))) {
          console.log("Page redirected!");
          clearInterval(checkExist);
       }
    }, 100); // check every 100ms


    //Ask user to click on the right product
    var modalText2 = "Please click on the first search result";
    var modalElement2 = "<div id='searchResultsModal' class='modal'><div class='modal-content'><span class='close'>&times;</span><p>"+modalText2+"</p></div></div>";

    // TODO: Update DOM with jquerydomupdater

    //Last modal component, describing the page
    var modalText3 = "This page will show details on how environmentally friendly the product is";
    var modalElement3 = "<div id='descriptionModal' class='modal'><div class='modal-content'><span class='close'>&times;</span><p>"+modalText3+"</p></div></div>";

    // TODO: Update DOM with jquerydomupdater
}