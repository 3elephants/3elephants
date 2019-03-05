export function regexFunc() {
  var regex = RegExp("^(http[s]?://)?([\\w.-]+)(:[0-9]+)?/([\\w-%]+/)?(dp|gp/product|exec/obidos/asin)/(\\w+/)?(\\w{10})(.*)?$");
  var m = window.location.href.match(regex);
  return (m && m.length > 7) ? m[7] : null;
}
export function jQueryDOMUpdater(functionLogic, params) {
  functionLogic(params);
  $(function() { //incase the rest of the webpage lags and invalidates the css
    functionLogic(params);
  });
}
export function mutationObserver(mainLogic) {
  var observer = new MutationObserver(function(mutations) {
    mainLogic(mutations);
    observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}
