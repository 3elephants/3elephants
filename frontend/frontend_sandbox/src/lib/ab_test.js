import mixpanel from 'mixpanel-browser';


// mixpanel link click event
mixpanel.delegate_links = function (parent, selector, event_name, properties) {
    properties = properties || {};
    parent = parent || document.body;
    parent = $(parent);

    parent.on('click', selector, function (event) {
        var new_tab = event.which === 2 || event.metaKey || event.target.target === '_blank';
        console.log(event);
        properties.url = event.currentTarget.href;

        function callback() {

            if (new_tab) {
                return;
            }

            window.location = properties.url;
        }

        if (!new_tab) {
            event.preventDefault();
            setTimeout(callback, 300);
        }

        mixpanel.track(event_name, properties, callback);
    });
};


function chooseVariant(variantsArray) {


  var totalWeight = 0;
  for (var i = 0; i < variantsArray.length; ++i) {
    totalWeight += variantsArray[i].weight;
  }
  for (var i = 0; i < variantsArray.length; ++i) {
    variantsArray[i].weight /= totalWeight;
  }
  var threshold = Math.random();
  var newAccumulator = 0;
  var count = 0;

  while (count < variantsArray.length && newAccumulator < threshold) {

    newAccumulator += variantsArray[count].weight
      ++count;

  }
  --count;
  return variantsArray[count].class;
}

function binomial(successWeight) {

  return chooseVariant([{
    class: true,
    weight: successWeight
  }, {
    class: false,
    weight: (1 - successWeight)
  }]);
};

function randomizeConfiguration(configuration) {
  for (var key in configuration) {
    if (configuration.hasOwnProperty(key)) {
      if (configuration[key].finalized) {
        continue;
      }

      configuration[key].is_on = binomial(0.5);

      if (key == "price") {
        configuration[key].green_tax = binomial(0.8);
        configuration[key].percentage = Math.random();
      }
    }
  }
  return configuration;
}
export function generateConfiguration() {
  var configuration = {
    reformat: {
      is_on: true
    },
    label: {
      is_on: true,
      finalized: true
    },
    background_color: {
      is_on: true
    },
    add_to_cart: {
      is_on: true
    },
    nav_cart: {
      is_on:true
    },
    price: {
      is_on: true,
      percentage: 0.5
    },
    rating: {
      is_on: true,
      finalized: true
    },
    sort_results: {
      is_on: true,
      finalized: true
    },
    restrictive_mode: {
      is_on: false,
      finalized:true
    }
  };

  configuration = randomizeConfiguration(configuration);


  chrome.storage.sync.set({
    elephants_feature_settings: configuration
  }, function() {});
  return configuration;
}
export function mixpanelInstall() {
    mixpanel.init("65ea6d2abd34039ed97c8018eaf15e78");
}
export function registerSession(configuration, data) {
    mixpanel.register_once({
        "configuration":configuration
    });
    mixpanel.register({
      "data":data
    });
}


export function trackAddToCart() {
  $("#submit\\.add-to-cart").click(function() {
      mixpanel.track("Add to Cart");
  });
}


export function trackNavCart() {
  mixpanel.delegate_links(document.body, ".nav-cart,#nav-cart", "Nav Cart");
}




export function trackQuitNavigate(){
  $(window).on('unload', function(event) {
      mixpanel.track("Quit Navigation");
  });
}



export function trackOptionsMenu(ids){
  for(var id of ids) {
    (function () {
      var functionCallback = ()=> {
        mixpanel.track(id + " option changed");
        mixpanel.register({
          "configuration": configuration
        });
      };
      document.getElementById(id).addEventListener('click',functionCallback)
    }());
  }
}
export function trackLabelClick(){

  $("#t_el_label").click(function() {
      mixpanel.track("Label Click");
  });
}

export function trackRatingClick(){
  $("#elephants-rating").click(function() {
      mixpanel.track("Rating Click");
  });
}

export function trackingCode() {
  $( document ).ready(function() {

    trackQuitNavigate();
    trackNavCart();
    trackAddToCart();
    trackLabelClick();
    trackRatingClick();
  });
}
