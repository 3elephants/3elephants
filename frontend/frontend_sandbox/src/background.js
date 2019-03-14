import * as abTest from './lib/ab_test'

chrome.runtime.onInstalled.addListener(function() {
  abTest.generateConfiguration();
});
// $( document ).ready(function() {
//   $.get(serverUrl, function(data, status) {
//     console.log(data);
//     data = JSON.parse(data);
//     chrome.storage.sync.get(['feature_settings'], function(result) {
//       abTest.registerSession(result.feature_settings, data);
//       trackingCode();
//     });
//
//   });
//     console.log( "tracking!" );
//
// });
