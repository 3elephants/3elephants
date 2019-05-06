import introJs from 'intro.js/minified/intro.min.js';

export function run() {

		var redirectedLink= "https://www.amazon.com/gp/product/B01MYFHXRG?pf_rd_p=f3acc539-5d5f-49a3-89ea-768a917d5900&pf_rd_r=2Q6HD0NBCRXB94PK3SB1";

		chrome.tabs.create({
	    url: redirectedLink
	  }, function(tab){
			setTimeout(()=>chrome.tabs.sendMessage(tab.id, {action: "start_onboarding"}, function(response) {}), 1000);
		});

}

export function mainIntro() {
	var intro = introJs();
	intro.setOptions({
		steps: [
			{
				element: document.querySelector("#t_el_label"),
				intro: "3 Elephants labels products eco-friendly, not eco-friendly, and neutral. We will also tell you if there are potential health hazards."
			},
			{
				element: document.querySelector('#elephants-rating'),
				intro: "We rate products on a 5 star rating system, based on how green third party sources say they and the brands behind them are."
			},
			{
				element: document.querySelector('#elephants-data-tooltip'),
				intro: "This popup tells you where the data comes from, and how much you should trust these sources.",
				position: 'left'
			},
			{
				element: document.querySelector('#elephants-toggle'),
				intro: "You can toggle the popup by clicking this button.",
				position: 'left'
			},
			{
				intro: 'We also modify the page a bit more, at times, to discourage or encourage you from buying a product.'
			}
		]
	});
	intro.onexit(subIntroRedirect);
	intro.start();

}

export function subIntro(){
	var intro = introJs();
	intro.setOptions({
		steps: [
			{
				element: document.querySelector("#elephants-sort-results").parentElement,
				intro: "We sort results for you by how eco-friendly they are. You can turn this on and off anytime by clicking the checkmark."
			},
			{
				intro: "And that's it. Check the extension's menu for customization options. Stay Green!"
			},

		]
	});
	intro.start();
}

function subIntroRedirect() {
	var redirectedLink = "https://www.amazon.com/s?k=patagonia+hat&crid=3QINJ8J62GIWZ&sprefix=Patagonia%2Caps%2C178&ref=nb_sb_ss_i_1_9";
	window.location.replace(redirectedLink);
}
