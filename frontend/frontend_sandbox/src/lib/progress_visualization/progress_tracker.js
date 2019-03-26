export function trackProgress(data) {
  $("#submit\\.add-to-cart").click(function() {
    if(data.has_results) {
      var greenTax = 0.0;
      var taxElement = $("#elephants-tax-amount");
      if (taxElement.length !=0) {
        greenTax = parseFloat(taxElement.text());
      }
      var purchaseDetails = {
        s: data.score,
        c: data.classification,
        g: taxElement,
        d: new Date()
      };
      chrome.storage.sync.get({ //change to local storage if it gets to large
        elephants_progress_vis:{aggregates:{cost:0, score:0, count:0}, data: []}
      }, function(result) {
        var localResult = result.elephants_progress_vis;
        if (localResult.data.length > 30) {
          result.elephants_progress_vis.data.clear();
          result.elephants_progress_vis.data.push({s: localResult.aggregates.score, c:3, g:localResult.aggregates.cost, d: new Date()});
        }
        result.elephants_progress_vis.data.push(purchaseDetails);

        //update aggregates
        result.elephants_progress_vis.aggregates.cost = localResult.aggregates.cost + purchaseDetails.g
        var count = localResult.aggregates.count;
        result.elephants_progress_vis.aggregates.score = (localResult.aggregates.score * count + purchaseDetails.s)/ (count + 1);
        result.elephants_progress_vis.aggregates.count = count + 1;
      });



    }
  });


}

export function visualizeProgress() {
  chrome.storage.sync.get({ //change to local storage if it gets to large
    elephants_progress_vis:{aggregates:{cost:0, score:0, count:0}, data: []}
  }, function(outerResult) {
    var result = outerResult.elephants_progress_vis;
    if(result.data.length != 0) {
      scoreVisualizer.create(result.aggregates.score);
      trendVisualizer.create(result.aggregates.data);


      if(result.aggregates.cost > 0) {

        chrome.storage.sync.get(['elephants_feature_settings'], function(innerResult) {
          if(innerResult.elephants_feature_settings == undefined || innerResult.elephants_feature_settings == null)
            return;
          if(innerResult.elephants_feature_settings.price.is_on)
            priceVisualizer.create(result.aggregates.cost);
        });
      }

    } else {
      console.log("No Data");
    }

  });
}
