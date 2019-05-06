import * as constants from './constants';
import * as optionsManager from './menu/options_manager';
import * as onboarding from './onboarding';



//to toggle sorting
function saveOptions() {
  var sorting = document.getElementById('elephants-sort-results').checked;
  optionsManager.saveOptions(['sort_results'], sorting, () => location.reload());
}

//reorganizes and updates the html
function sortList(sortOrder, list, b) {
  console.log(sortOrder);
  var s = sortOrder.reduce((accumulator, orig_pos) => accumulator + b[orig_pos].outerHTML, "");
  list.innerHTML = s;
}

//sort feature
function getAllTheSortScores(list, b) {

  var products = [];
  for (var i = 0; i < list.children.length; i++) {
    if (b[i] == null) {
      break;
    }


    var title = b[i].getElementsByClassName("s-access-title")[0];
    if (title == null)
      title = b[i].getElementsByClassName("a-size-medium a-color-base a-text-normal")[0]; //for different layout
    if (title == null) {
      title = b[i].getElementsByClassName("a-size-base-plus a-color-base a-text-normal")[0]; //for different layout
    }

    if (title != undefined) {
      title = title.innerHTML.trim();
      products.push(title);
    }

  }

  console.log(products);
  let nodeid = $($("#departments li")[0]).attr('id').split("/")[1];
  let body = {
    "products": products,
    "nodeid": nodeid
  };
  $.ajax({
    type: "POST",
    url: constants.getBaseAPIUrl() + "BatchProductClassQueryv2",
    data: JSON.stringify(body),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {
      console.log(data);
      var sortOrder = data.map(element => element.orig_pos);

      sortList(sortOrder, list, b);
    },
    failure: function(errMsg) {
      console.log(errMsg);
    }
  });


}


export function create() {
  $(function() { // waits for the page to load

    //checks if sort feature applies
    var list = document.getElementById("s-results-list-atf");
    if (list == undefined || list == null) {
      if (document.getElementsByClassName("s-result-list") == undefined) {
        return;
      }
      list = document.getElementsByClassName("s-result-list")[0]; //for different layout
      if (list==undefined || list==null) {
        return;
      }
    }




    //implements sort feature
    chrome.storage.sync.get(['elephants_feature_settings'], function(result) {
      if (result.elephants_feature_settings == undefined || result.elephants_feature_settings == null)
        result.elephants_feature_settings = abTest.generateConfiguration();
      if (result.elephants_feature_settings.sort_results.is_on) {
        $(".s-desktop-toolbar .a-text-right").html('<input type="checkbox" id="elephants-sort-results" name="" checked> Sort By Green Score ');
        document.getElementById('elephants-sort-results').addEventListener('click',
          saveOptions);

        //sort feature
        var b = list.children;
        getAllTheSortScores(list, b);

      } else {
        $(".s-desktop-toolbar .a-text-right").append('<div style="display:inline-block;margin-right:7px"> &nbsp; | &nbsp; <input type="checkbox" id="elephants-sort-results" name=""> Sort By Green Score </div>');
        document.getElementById('elephants-sort-results').addEventListener('click',
          saveOptions);
      }

    });
    chrome.storage.sync.get(['subIntro'], function(result) {

      if(result.subIntro == undefined || result.subIntro == null) {
          onboarding.subIntro();
          chrome.storage.sync.set({
            subIntro: true
          }, function() {});
      }
    });
  });
}
