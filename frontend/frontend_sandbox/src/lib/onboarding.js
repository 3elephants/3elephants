
export function run() {
	//First step is to redirect to Amazon home page
	var patagoniaHat= "https://www.amazon.com/gp/product/B01MYFHXRG?pf_rd_p=f3acc539-5d5f-49a3-89ea-768a917d5900&pf_rd_r=2Q6HD0NBCRXB94PK3SB1";
    window.location = amazonHomePage;

    //Now update the DOM to highlight search engine

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
		var intro = introJs();
          intro.setOptions({
            steps: [
              {
								element: document.querySelector("#t_el_label")
                intro: "3 Elephants labels products eco-friendly, not eco-friendly, and neutral. We will also tell you if there are potential health hazards."
              },
              {
                element: document.querySelector('#step1'),
                intro: "This is a tooltip."
              },
              {
                element: document.querySelectorAll('#step2')[0],
                intro: "Ok, wasn't that fun?",
                position: 'right'
              },
              {
                element: '#step3',
                intro: 'More features, more fun.',
                position: 'left'
              },
              {
                element: '#step4',
                intro: "Another step.",
                position: 'bottom'
              },
              {
                element: '#step5',
                intro: 'Get it, use it.'
              }
            ]
          });
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
