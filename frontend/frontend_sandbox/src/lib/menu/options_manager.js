import * as abTest from '../ab_test';
function saveOptions(features, value) {
  chrome.storage.sync.get(['elephants_feature_settings'], function(result) {

    if(result.elephants_feature_settings == undefined || result.elephants_feature_settings == null)
      result.elephants_feature_settings = abTest.generateConfiguration();

    for (var feature of features) {
      result.elephants_feature_settings[feature].is_on =  value;
    }
    chrome.storage.sync.set({elephants_feature_settings: result.elephants_feature_settings});
  });
};

export function saveOptions(features, value, callback) {
  chrome.storage.sync.get(['elephants_feature_settings'], function(result) {

    if(result.elephants_feature_settings == undefined || result.elephants_feature_settings == null)
      result.elephants_feature_settings = abTest.generateConfiguration();

    for (var feature of features) {
      result.elephants_feature_settings[feature].is_on =  value;
    }
    chrome.storage.sync.set({elephants_feature_settings: result.elephants_feature_settings}, function(){callback()});
  });
};


function addClickListeners(options) {
  for (var i=0; i< options.length; ++i) {
    (function () {
    var option = options[i];
    var newFunc = () =>  saveOptions(option.features,document.getElementById(option.id).checked, ()=>{});
    document.getElementById(options[i].id).addEventListener('click', newFunc);
    }());
  }
}

function restoreOptions(options) {

  chrome.storage.sync.get(['elephants_feature_settings'], function(result) {
    if(result.elephants_feature_settings == undefined || result.elephants_feature_settings == null)
      result.elephants_feature_settings = abTest.generateConfiguration();

    for (var option of options) {
      document.getElementById(option.id).checked = result.elephants_feature_settings[option.features[0]].is_on;
    }
  });
  addClickListeners(options);
};

export function create(options) {
  document.addEventListener('DOMContentLoaded', restoreOptions(options));
  abTest.trackOptionsMenu(options.map((option)=>option.id));
}
