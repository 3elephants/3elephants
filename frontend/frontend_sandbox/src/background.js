import * as abTest from './lib/ab_test'
import $ from "jquery";
import * as constants from './lib/constants';

chrome.runtime.onInstalled.addListener(function() {
  abTest.generateConfiguration();
});
chrome.runtime.setUninstallURL("http://3elephants.github.io/website/sorry/");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if(request.elephantsGetRequest) {
      var callback =
      $.ajax({
        type: "GET",
        url: constants.getBaseAPIUrl() + request.afterServerUrl,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: data => sendResponse(data),
        failure: function(errMsg) {
          console.log(errMsg);
        }
      });
      return true;
    }
  });
