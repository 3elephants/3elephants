import mixpanel from 'mixpanel-browser';

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

      configuration[key].is_on = binomial(0.2);

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
    tooltip: {
      is_on: true
    },
    background_color: {
      is_on: true
    },
    add_to_cart: {
      is_on: true
    },
    price: {
      is_on: true,
      green_tax: true,
      percentage: 0.5
    },
    rating: {
      is_on: true
    },
    sorting: {
      is_on: true
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
  mixpanel.track_links(".nav-cart,#nav-cart", "Add To Cart", {});
}

export function trackBackButton(){
  $(window).on('popstate', function(event) {
      mixpanel.track("Back Button");
  });
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
    trackBackButton();
    trackAddToCart();
    trackLabelClick();
    trackRatingClick();
  });
}
